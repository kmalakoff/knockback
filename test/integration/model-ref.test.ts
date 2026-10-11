import kb, { type ORM } from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ModelRef from 'backbone-modelref';
import ko from 'knockout';
import { listenerCount } from '../lib/backbone-events.ts';
import { getKnockbackMetadata } from '../lib/knockback-metadata.ts';

interface PersonAttributes {
  id: number;
  name: string;
  role?: string;
  status?: string;
  required?: string;
  extra?: string;
}

class PersonModel extends Backbone.Model<PersonAttributes> {}

class PersonCollection extends Backbone.Collection<PersonModel> {
  model = PersonModel;
}

interface PersonViewModel {
  name: ko.Observable<string | null>;
}

function safeOwnerFailure(error: unknown, seen = new Set<object>()): string {
  if (typeof error === 'object' && error !== null) {
    if (seen.has(error)) return 'repeated error';
    seen.add(error);
  }
  if (error instanceof AggregateError) return `AggregateError[${error.errors.map((member) => safeOwnerFailure(member, seen)).join('; ')}]`;
  if (error instanceof assert.AssertionError) {
    const scalar = (value: unknown): string => (value == null || typeof value === 'boolean' || typeof value === 'number' ? String(value) : typeof value);
    const assertion = error.generatedMessage ? error.operator : error.message;
    return `AssertionError: ${assertion}, actual ${scalar(error.actual)}, expected ${scalar(error.expected)}`;
  }
  if (error instanceof Error) {
    const cause = Object.getOwnPropertyDescriptor(error, 'cause');
    return cause && 'value' in cause ? `${error.name}, cause ${safeOwnerFailure(cause.value, seen)}` : error.name;
  }
  return error === null ? 'thrown null' : `thrown ${typeof error}`;
}

function finishOwnerExercise(failed: boolean, original: unknown, cleanupErrors: unknown[]): void {
  if (failed || cleanupErrors.length) {
    const failures = failed ? [original, ...cleanupErrors] : cleanupErrors;
    throw new AggregateError(failures, `ModelRef operation/cleanup failures: ${failures.map((failure) => safeOwnerFailure(failure)).join('; ')}`);
  }
}

function runOwnerCleanups(cleanups: Array<() => void>): unknown[] {
  const errors: unknown[] = [];
  for (const cleanup of cleanups.reverse()) {
    try {
      cleanup();
    } catch (error) {
      errors.push(error);
    }
  }
  return errors;
}

function ownerMethod(owner: object, key: string, ...args: unknown[]): unknown {
  const method: unknown = Reflect.get(owner, key);
  assert.ok(typeof method === 'function', `real owner method ${key}`);
  return Reflect.apply(method, owner, args);
}

function unchangedData(owner: object, label: string): () => void {
  const descriptors = Reflect.ownKeys(owner).map((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(owner, key);
    assert.ok(descriptor && 'value' in descriptor, `${label} has own data properties`);
    return { key, descriptor };
  });
  return () => {
    assert.strictEqual(Reflect.ownKeys(owner).length, descriptors.length, `${label} own key count`);
    for (const { key, descriptor } of descriptors) {
      const current = Object.getOwnPropertyDescriptor(owner, key);
      assert.ok(current && 'value' in current, `${label} remains own data`);
      assert.ok(current.value === descriptor.value, `${label} retains exact value`);
      assert.strictEqual(current.writable, descriptor.writable, `${label} writable flag`);
      assert.strictEqual(current.enumerable, descriptor.enumerable, `${label} enumerable flag`);
      assert.strictEqual(current.configurable, descriptor.configurable, `${label} configurable flag`);
    }
  };
}

function unchangedAttachment(view: object, stores: object[], models: Backbone.Model[], reference: ModelRef): () => void {
  const metadata = getKnockbackMetadata(view);
  const watcher: unknown = metadata.eventWatcher;
  assert.ok(typeof watcher === 'object' && watcher !== null);
  const checks = [unchangedData(metadata, 'root metadata'), unchangedData(watcher, 'root watcher')];
  const references = metadata.stores_references;
  assert.ok(Array.isArray(references));
  checks.push(unchangedData(references, 'lease array'));
  for (const lease of references) {
    assert.ok(typeof lease === 'object' && lease !== null);
    checks.push(unchangedData(lease, 'exact Store lease'));
  }
  const callbacks: unknown = getKnockbackMetadata(watcher).callbacks;
  assert.ok(typeof callbacks === 'object' && callbacks !== null);
  checks.push(unchangedData(callbacks, 'callback map'));
  for (const key of Object.keys(callbacks)) {
    const record: unknown = Reflect.get(callbacks, key);
    assert.ok(typeof record === 'object' && record !== null);
    checks.push(unchangedData(record, 'callback record'));
    const list: unknown = Reflect.get(record, 'list');
    assert.ok(Array.isArray(list));
    checks.push(unchangedData(list, 'callback list'));
    for (const info of list) {
      assert.ok(typeof info === 'object' && info !== null);
      checks.push(unchangedData(info, 'callback binding'));
    }
  }
  for (const store of stores) {
    checks.push(unchangedData(store, 'Store owner'));
    const retired: unknown = Reflect.get(store, 'replaced_observables');
    assert.ok(Array.isArray(retired));
    checks.push(unchangedData(retired, 'retired Store owners'));
    const pending: unknown = Reflect.get(store, '_reversibleMoves');
    const committed: unknown = Reflect.get(store, '_committedMoves');
    assert.ok(pending instanceof WeakMap);
    assert.ok(committed instanceof WeakSet);
    const move: unknown = pending.get(view);
    const isCommitted = committed.has(view);
    checks.push(() => {
      assert.ok(pending.get(view) === move, 'exact pending receipt remains registered');
      assert.strictEqual(committed.has(view), isCommitted, 'committed owner membership');
    });
    const records: unknown = Reflect.get(store, 'observable_records');
    assert.ok(typeof records === 'object' && records !== null);
    checks.push(unchangedData(records, 'Store creator map'));
    for (const key of Object.keys(records)) {
      const slots: unknown = Reflect.get(records, key);
      assert.ok(typeof slots === 'object' && slots !== null);
      checks.push(unchangedData(slots, 'Store registration slots'));
    }
  }
  for (const [emitter, names] of [[reference, ['loaded', 'unloaded']], ...models.map((model) => [model, ['change', 'refresh']] as const)] as const) {
    const events: unknown = Reflect.get(emitter, '_events');
    for (const name of names) {
      const listeners: unknown = events && typeof events === 'object' ? Reflect.get(events, name) : undefined;
      if (Array.isArray(listeners)) {
        checks.push(unchangedData(listeners, `${name} listener array`));
        for (const listener of listeners) {
          assert.ok(typeof listener === 'object' && listener !== null);
          checks.push(unchangedData(listener, `${name} callback/context`));
        }
      }
      checks.push(() => {
        const current: unknown = Reflect.get(emitter, '_events');
        const selected: unknown = current && typeof current === 'object' ? Reflect.get(current, name) : undefined;
        assert.ok(selected === listeners, `${name} exact listener registration`);
      });
    }
  }
  const refCount = reference.ref_count;
  return () => {
    for (const check of checks) check();
    assert.strictEqual(reference.ref_count, refCount, 'ModelRef lease remains unchanged');
  };
}

describe('ModelRef integration', () => {
  it('uses one pinned Backbone instance in each test environment', () => {
    const installedBackbone = Backbone as typeof Backbone & { ModelRef?: typeof ModelRef; VERSION: string };

    assert.strictEqual(installedBackbone.VERSION, '1.6.1');
    assert.strictEqual(installedBackbone.ModelRef, ModelRef);
  });

  it('captures an adapter for each direct or reference-backed model attachment', () => {
    class AdapterPerson extends Backbone.Model<{ id: number; special: string }> {
      special = (): string => `function:${this.get('special')}`;
    }
    class AdapterPeople extends Backbone.Collection<AdapterPerson> {
      model = AdapterPerson;
    }
    interface AdapterView {
      special: ko.Observable<unknown>;
    }

    const calls = { bindA: 0, bindB: 0, unbindA: 0, unbindB: 0 };
    const adapter = (name: 'A' | 'B', useFunction: boolean): ORM<AdapterPerson> => ({
      isAvailable: () => true,
      isModel: (model): model is AdapterPerson => model instanceof AdapterPerson,
      bind: () => {
        calls[`bind${name}`]++;
        return () => calls[`unbind${name}`]++;
      },
      useFunction: () => useFunction,
    });
    const adapterA = adapter('A', true);
    const adapterB = adapter('B', false);
    const collection = new AdapterPeople([new AdapterPerson({ id: 9, special: 'first' })]);
    const reference = new ModelRef(collection, 9);

    kb.configure({ orm: adapterA });
    const view = kb.viewModel<AdapterView, AdapterPerson>(reference, { keys: ['special'] });
    try {
      assert.strictEqual(view.special(), 'function:first');
      assert.deepStrictEqual(calls, { bindA: 1, bindB: 0, unbindA: 0, unbindB: 0 });

      kb.configure({ orm: adapterB });
      collection.at(0)?.set('special', 'same attachment');
      assert.strictEqual(view.special(), 'function:same attachment');

      const first = collection.at(0);
      assert.ok(first);
      collection.remove(first);
      assert.strictEqual(view.model(), null);
      assert.strictEqual(calls.unbindA, 1);

      const replacement = new AdapterPerson({ id: 9, special: 'reference replacement' });
      collection.add(replacement);
      assert.strictEqual(view.special(), 'reference replacement');
      assert.strictEqual(calls.bindB, 1);

      kb.configure({ orm: adapterA });
      const direct = new AdapterPerson({ id: 10, special: 'direct replacement' });
      view.model(direct);
      assert.strictEqual(view.special(), 'function:direct replacement');
      assert.strictEqual(calls.unbindB, 1);
      assert.strictEqual(calls.bindA, 2);
    } finally {
      view.dispose();
      reference.release();
      kb.configure({ orm: undefined });
    }

    assert.deepStrictEqual(calls, { bindA: 2, bindB: 1, unbindA: 2, unbindB: 1 });
  });

  it('keeps a surviving view current through the full reference lifecycle', () => {
    const collection = new PersonCollection();
    const reference = new ModelRef(collection, 0);

    const firstView = kb.viewModel<PersonViewModel, PersonModel>(reference, { keys: ['name'] });
    const secondView = kb.viewModel<PersonViewModel, PersonModel>(reference, { keys: ['name'] });

    assert.strictEqual(reference.ref_count, 3);
    assert.strictEqual(firstView.model(), null);
    assert.strictEqual(secondView.model(), null);
    assert.strictEqual(firstView.name(), null);
    assert.strictEqual(secondView.name(), null);

    const firstModel = new PersonModel({ id: 0, name: 'zero' });
    collection.add(firstModel);

    assert.strictEqual(firstView.model(), firstModel);
    assert.strictEqual(secondView.model(), firstModel);
    assert.strictEqual(firstView.name(), 'zero');
    assert.strictEqual(secondView.name(), 'zero');

    firstModel.set('name', 'zero changed');
    assert.strictEqual(firstView.name(), 'zero changed');
    assert.strictEqual(secondView.name(), 'zero changed');

    collection.remove(firstModel);
    assert.strictEqual(firstView.model(), null);
    assert.strictEqual(secondView.model(), null);
    assert.strictEqual(firstView.name(), null);
    assert.strictEqual(secondView.name(), null);

    collection.add(firstModel);
    assert.strictEqual(firstView.model(), firstModel);
    assert.strictEqual(secondView.model(), firstModel);

    const replacement = new PersonModel({ id: 0, name: 'replacement' });
    let destroyCalls = 0;
    replacement.destroy = (() => {
      destroyCalls++;
      return false;
    }) as typeof replacement.destroy;
    collection.reset([replacement]);

    assert.strictEqual(firstView.model(), replacement);
    assert.strictEqual(secondView.model(), replacement);
    assert.strictEqual(firstView.name(), 'replacement');
    assert.strictEqual(secondView.name(), 'replacement');
    assert.strictEqual(listenerCount(reference, 'loaded'), 2);
    assert.strictEqual(listenerCount(reference, 'unloaded'), 2);

    firstView.dispose();
    assert.strictEqual(reference.ref_count, 2);
    assert.strictEqual(listenerCount(reference, 'loaded'), 1);
    assert.strictEqual(listenerCount(reference, 'unloaded'), 1);

    replacement.set('name', 'survivor');
    assert.strictEqual(secondView.name(), 'survivor');

    secondView.dispose();
    assert.strictEqual(reference.ref_count, 1);
    assert.strictEqual(listenerCount(reference, 'loaded'), 0);
    assert.strictEqual(listenerCount(reference, 'unloaded'), 0);
    assert.strictEqual(destroyCalls, 0);

    reference.release();
    assert.strictEqual(reference.ref_count, 0);
    assert.strictEqual(reference.collection, null);
    assert.strictEqual(listenerCount(collection, 'add'), 0);
    assert.strictEqual(listenerCount(collection, 'remove'), 0);
    assert.strictEqual(listenerCount(collection, 'reset'), 0);
    assert.strictEqual(destroyCalls, 0);
  });

  it('keeps a null nested model distinct from the root through ModelRef unload and reload', () => {
    class Child extends Backbone.Model<{ name: string }> {}
    class Parent extends Backbone.Model<{ id: number; name: string; primary: Child | null }> {}
    interface ParentView {
      name: ko.Observable<string | null>;
      primary: ko.Observable<unknown>;
    }

    const child = new Child({ name: 'child' });
    const parent = new Parent({ id: 7, name: 'parent', primary: null });
    const replacement = new Parent({ id: 7, name: 'replacement', primary: child });
    const collection = new Backbone.Collection<Parent>();
    const cleanups: Array<() => void> = [];
    const cleanupErrors: unknown[] = [];
    let operationFailed = false;
    let operationError: unknown;

    try {
      cleanups.push(() => {
        collection.reset([]);
        for (const model of [parent, replacement, child]) assert.strictEqual(listenerCount(model, 'change'), 0, 'final model change listeners');
        for (const event of ['add', 'remove', 'reset']) assert.strictEqual(listenerCount(collection, event), 0, `final collection ${event} listeners`);
      });
      const reference = new ModelRef(collection, 7);
      cleanups.push(() => {
        reference.release();
        assert.strictEqual(reference.ref_count, 0, 'final ModelRef release count');
      });
      const view = kb.viewModel<ParentView, Parent>(reference, { keys: ['name', 'primary'] });
      cleanups.push(() => {
        kb.dispose(view);
        assert.strictEqual(reference.ref_count, 1, 'root disposal ModelRef retain count');
        assert.strictEqual(listenerCount(reference, 'loaded'), 0, 'root disposal loaded listeners');
        assert.strictEqual(listenerCount(reference, 'unloaded'), 0, 'root disposal unloaded listeners');
      });
      const store = getKnockbackMetadata(view).store;
      assert.ok(store instanceof kb.Store);
      const primary = view.primary;
      assert.strictEqual(view.model(), null);
      assert.strictEqual(primary(), null);

      collection.add(parent);
      assert.strictEqual(view.model(), parent);
      assert.strictEqual(parent.get('primary'), null);
      assert.strictEqual(primary(), null);
      collection.reset([replacement]);
      assert.strictEqual(view.model(), replacement);
      assert.strictEqual(replacement.get('primary'), child);
      const selected = primary();
      assert.ok(typeof selected === 'object' && selected !== null);
      assert.strictEqual(getKnockbackMetadata(selected).object, child);
      assert.strictEqual(getKnockbackMetadata(selected).store, store);

      const observe = (value: unknown) => {
        if (value === null) return { wrappedModel: null, model: null, name: null };
        assert.ok(typeof value === 'object' && value !== null);
        const model: unknown = Reflect.get(value, 'model');
        const name: unknown = Reflect.get(value, 'name');
        assert.ok(typeof model === 'function');
        assert.ok(name === undefined || ko.isObservable(name), 'null placeholder name is absent or a real observable');
        const liveModel: unknown = Reflect.apply(model, value, []);
        const observedName: unknown = name === undefined ? undefined : name();
        return { wrappedModel: getKnockbackMetadata(value).object, model: liveModel, name: observedName };
      };
      collection.remove(replacement);
      const unloaded = primary();
      const unloadedState = observe(unloaded);
      const unloadedRawPrimary = parent.get('primary');
      assert.strictEqual(view.model(), null);
      assert.strictEqual(view.name(), null);
      collection.add(parent);
      const reloaded = primary();
      const reloadedState = observe(reloaded);
      assert.strictEqual(view.model(), parent);
      assert.strictEqual(view.name(), 'parent');
      assert.strictEqual(view.primary, primary);
      assert.strictEqual(parent.get('primary'), null);
      assert.strictEqual(replacement.get('primary'), child);

      for (const state of [
        { phase: 'unloaded', rawPrimary: unloadedRawPrimary, selected: unloaded, ...unloadedState },
        { phase: 'reloaded', rawPrimary: parent.get('primary'), selected: reloaded, ...reloadedState },
      ]) {
        assert.strictEqual(state.rawPrimary, null, `${state.phase} raw parent primary`);
        assert.ok(state.selected !== view, `${state.phase} primary must not alias the root ViewModel`);
        assert.ok(state.wrappedModel === null || state.wrappedModel === undefined, `${state.phase} primary has no wrapped model`);
        assert.strictEqual(state.model, null, `${state.phase} primary has no live model`);
        assert.ok(state.name === null || state.name === undefined, `${state.phase} primary has no model name`);
      }
    } catch (error) {
      operationFailed = true;
      operationError = error;
    } finally {
      for (const cleanup of cleanups.reverse()) {
        try {
          cleanup();
        } catch (error) {
          cleanupErrors.push(error);
        }
      }
    }
    finishOwnerExercise(operationFailed, operationError, cleanupErrors);
  });

  for (const transition of ['load', 'unload'] as const)
    for (const committed of [false, true]) {
      it(`rejects automatic ${transition} before KB mutation during a ${committed ? 'committed' : 'prepared'} Store move`, () => {
        const collection = new PersonCollection();
        const originalModel = new PersonModel({ id: 7, name: 'original' });
        const movedModel = new PersonModel({ id: 8, name: 'transaction target' });
        if (transition === 'unload') collection.add(originalModel);
        const cleanups: Array<() => void> = [];
        let failed = false;
        let original: unknown;
        try {
          const store = new kb.Store();
          cleanups.push(() => store.dispose());
          const otherStore = new kb.Store();
          cleanups.push(() => otherStore.dispose());
          const reference = new ModelRef(collection, 7);
          cleanups.push(() => reference.release());
          const view = kb.viewModel<PersonViewModel, PersonModel>(reference, { store, keys: ['name'] });
          cleanups.push(() => kb.dispose(view));
          const metadata = getKnockbackMetadata(view);
          ownerMethod(otherStore, 'retain', view, transition === 'load' ? null : originalModel, metadata.creator);
          const watcher: unknown = metadata.eventWatcher;
          assert.ok(typeof watcher === 'object' && watcher !== null);
          const notifications: unknown[] = [];
          ownerMethod(watcher, 'registerCallbacks', {}, { eventSelector: 'change refresh', emitter: (model: unknown) => notifications.push(model) });
          notifications.length = 0;
          const receipt = { created: false, retained: false, cancelled: false, commit: undefined as (() => void) | undefined, rollback: undefined as (() => void) | undefined };
          ownerMethod(otherStore, 'retain', view, movedModel, metadata.creator, receipt);
          cleanups.push(() => receipt.rollback?.());
          if (committed) {
            assert.ok(receipt.commit);
            receipt.commit();
          }
          const check = unchangedAttachment(view, [store, otherStore], [originalModel, movedModel], reference);
          const receiptCheck = unchangedData(receipt, 'pending receipt');
          const priorName = view.name();
          const priorModel = view.model();
          assert.throws(
            () => (transition === 'load' ? collection.add(originalModel) : collection.remove(originalModel)),
            (error: unknown) => error instanceof Error && /reversible move/.test(error.message)
          );
          check();
          receiptCheck();
          assert.ok(view.model() === priorModel, 'rejected callback preserves root model');
          assert.strictEqual(view.name(), priorName, 'rejected callback preserves attribute');
          assert.strictEqual(notifications.length, 0, 'rejected callback publishes no child or root values');
          assert.ok(reference.model() === (transition === 'load' ? originalModel : undefined), 'real ModelRef has already transitioned independently');
          assert.ok(ownerMethod(watcher, 'emitter') === priorModel, 'KB watcher retains its admitted emitter');
        } catch (error) {
          failed = true;
          original = error;
        }
        const errors = runOwnerCleanups(cleanups);
        try {
          collection.reset([]);
        } catch (error) {
          errors.push(error);
        }
        finishOwnerExercise(failed, original, errors);
      });
    }

  it('rejects explicit reference admission without changing an ordinary null root or reference leases', () => {
    const collection = new PersonCollection();
    const pending = new PersonModel({ id: 8, name: 'pending' });
    const cleanups: Array<() => void> = [];
    let failed = false;
    let original: unknown;
    try {
      const store = new kb.Store();
      cleanups.push(() => store.dispose());
      const reference = new ModelRef(collection, 7);
      cleanups.push(() => reference.release());
      const view = kb.viewModel<PersonViewModel, PersonModel>(null, { store, keys: ['name'] });
      cleanups.push(() => kb.dispose(view));
      const metadata = getKnockbackMetadata(view);
      const receipt = { created: false, retained: false, rollback: undefined as (() => void) | undefined };
      ownerMethod(store, 'retain', view, pending, metadata.creator, receipt);
      cleanups.push(() => receipt.rollback?.());
      const check = unchangedAttachment(view, [store], [pending], reference);
      const receiptCheck = unchangedData(receipt, 'explicit setter receipt');
      assert.throws(
        () => view.model(reference),
        (error: unknown) => error instanceof Error && /reversible move/.test(error.message)
      );
      check();
      receiptCheck();
      assert.strictEqual(reference.ref_count, 1, 'rejected setter does not acquire reference');
      assert.strictEqual(view.model(), null, 'rejected setter keeps ordinary null model');
      assert.strictEqual(view.name(), null, 'rejected setter keeps ordinary null attribute');
      assert.ok(ownerMethod(store, 'find', null, metadata.creator) === view, 'ordinary null registration remains canonical');
    } catch (error) {
      failed = true;
      original = error;
    }
    finishOwnerExercise(failed, original, runOwnerCleanups(cleanups));
  });

  it('rejects explicit replacement before releasing the prior reference or mutating either Store', () => {
    const first = new PersonModel({ id: 7, name: 'first' });
    const replacement = new PersonModel({ id: 8, name: 'replacement' });
    const pending = new PersonModel({ id: 9, name: 'pending' });
    const collection = new PersonCollection([first, replacement]);
    const cleanups: Array<() => void> = [];
    let failed = false;
    let original: unknown;
    try {
      const primary = new kb.Store();
      cleanups.push(() => primary.dispose());
      const other = new kb.Store();
      cleanups.push(() => other.dispose());
      const previousReference = new ModelRef(collection, 7);
      cleanups.push(() => previousReference.release());
      const nextReference = new ModelRef(collection, 8);
      cleanups.push(() => nextReference.release());
      const view = kb.viewModel<PersonViewModel, PersonModel>(previousReference, { store: primary, keys: ['name'] });
      cleanups.push(() => kb.dispose(view));
      const metadata = getKnockbackMetadata(view);
      ownerMethod(other, 'retain', view, first, metadata.creator);
      const receipt = { created: false, retained: false, rollback: undefined as (() => void) | undefined };
      ownerMethod(other, 'retain', view, pending, metadata.creator, receipt);
      cleanups.push(() => receipt.rollback?.());
      const previousCheck = unchangedAttachment(view, [primary, other], [first, replacement, pending], previousReference);
      const nextCheck = unchangedAttachment(view, [primary, other], [first, replacement, pending], nextReference);
      const receiptCheck = unchangedData(receipt, 'rejected replacement receipt');
      assert.throws(
        () => view.model(nextReference),
        (error: unknown) => error instanceof Error && /reversible move/.test(error.message)
      );
      previousCheck();
      nextCheck();
      receiptCheck();
      assert.ok(view.model() === first, 'prior reference model remains selected');
      assert.strictEqual(view.name(), 'first', 'prior reference attribute remains selected');
      assert.strictEqual(previousReference.ref_count, 2, 'prior reference is not released');
      assert.strictEqual(nextReference.ref_count, 1, 'rejected replacement is not retained');
    } catch (error) {
      failed = true;
      original = error;
    }
    finishOwnerExercise(failed, original, runOwnerCleanups(cleanups));
  });

  for (const differentCreator of [false, true]) {
    it(`moves all registered Store leases with ${differentCreator ? 'different' : 'shared'} creators and preserves same-reference no-ops`, () => {
      const person = new PersonModel({ id: 7, name: 'first' });
      const replacement = new PersonModel({ id: 7, name: 'replacement' });
      const collection = new PersonCollection([person]);
      const cleanups: Array<() => void> = [];
      let failed = false;
      let original: unknown;
      try {
        const firstStore = new kb.Store();
        cleanups.push(() => firstStore.dispose());
        const secondStore = new kb.Store();
        cleanups.push(() => secondStore.dispose());
        const reference = new ModelRef(collection, 7);
        cleanups.push(() => reference.release());
        const creator = {
          create(): object {
            return view;
          },
        };
        const view = kb.viewModel<PersonViewModel, PersonModel>(reference, { store: firstStore, creator, keys: ['name'] });
        cleanups.push(() => kb.dispose(view));
        const otherCreator = differentCreator
          ? {
              create(): object {
                return view;
              },
            }
          : creator;
        const presented = kb.collectionObservable<object, PersonModel>(new PersonCollection([person]), { store: secondStore, viewModel: otherCreator });
        cleanups.push(() => presented.dispose());
        assert.ok(presented()[0] === view, 'public creator returns exact existing root');
        const leases: unknown = getKnockbackMetadata(view).stores_references;
        assert.ok(Array.isArray(leases));
        const leasesCheck = unchangedData(leases, 'multi-Store lease array');
        const leaseChecks = leases.map((lease: unknown) => {
          assert.ok(typeof lease === 'object' && lease !== null);
          assert.strictEqual(Reflect.get(lease, 'ref_count'), 1, 'each Store owns one ref');
          return unchangedData(lease, 'multi-Store lease');
        });
        const checkNoOp = unchangedAttachment(view, [firstStore, secondStore], [person, replacement], reference);
        view.model(reference);
        checkNoOp();
        collection.remove(person);
        assert.strictEqual(view.model(), null, 'multi-Store root unloads');
        assert.strictEqual(view.name(), null, 'multi-Store attributes unload');
        assert.ok(ownerMethod(firstStore, 'find', person, creator) === null, 'first old registration removed');
        assert.ok(ownerMethod(secondStore, 'find', person, otherCreator) === null, 'second old registration removed');
        collection.add(replacement);
        assert.ok(view.model() === replacement, 'multi-Store root replaces');
        assert.strictEqual(view.name(), 'replacement');
        assert.ok(ownerMethod(firstStore, 'find', replacement, creator) === view, 'first creator registration moved');
        assert.ok(ownerMethod(secondStore, 'find', replacement, otherCreator) === view, 'second creator registration moved');
        leasesCheck();
        for (const check of leaseChecks) check();
        assert.strictEqual(reference.ref_count, 2, 'Store movements do not reacquire ModelRef');
      } catch (error) {
        failed = true;
        original = error;
      }
      finishOwnerExercise(failed, original, runOwnerCleanups(cleanups));
    });
  }

  it('attaches a retired primary facade through its remaining registered Store without reacquiring the primary lease', () => {
    const first = new PersonModel({ id: 7, name: 'first' });
    const replacement = new PersonModel({ id: 8, name: 'replacement' });
    const collection = new PersonCollection([replacement]);
    const cleanups: Array<() => void> = [];
    let failed = false;
    let original: unknown;
    try {
      const primary = new kb.Store();
      cleanups.push(() => primary.dispose());
      const other = new kb.Store();
      cleanups.push(() => other.dispose());
      const reference = new ModelRef(collection, 8);
      cleanups.push(() => reference.release());
      const creator = {
        create(): object {
          return view;
        },
      };
      const view = kb.viewModel<PersonViewModel, PersonModel>(first, { store: primary, creator, keys: ['name'] });
      cleanups.push(() => kb.dispose(view));
      const presented = kb.collectionObservable<object, PersonModel>(new PersonCollection([first]), { store: other, viewModel: creator });
      cleanups.push(() => presented.dispose());
      const canonical = kb.viewModel<PersonViewModel, PersonModel>(first, { store: primary, creator, keys: ['name'] });
      cleanups.push(() => kb.dispose(canonical));
      const leases: unknown = getKnockbackMetadata(view).stores_references;
      assert.ok(Array.isArray(leases));
      assert.strictEqual(leases.length, 1, 'retired primary no longer has a lease');
      const lease: unknown = leases[0];
      assert.ok(typeof lease === 'object' && lease !== null);
      const checkLease = unchangedData(lease, 'remaining foreign lease');
      view.model(reference);
      assert.ok(view.model() === replacement, 'retired facade selects admitted reference');
      assert.ok(ownerMethod(other, 'find', replacement, creator) === view, 'remaining Store moves its exact registration');
      assert.ok(ownerMethod(primary, 'find', first, creator) === canonical, 'primary replacement remains canonical');
      assert.ok(ownerMethod(primary, 'find', replacement, creator) === null, 'primary Store is not reacquired');
      assert.strictEqual(leases.length, 1, 'no new primary lease');
      checkLease();
      assert.strictEqual(reference.ref_count, 2, 'successful explicit attachment acquires reference once');
    } catch (error) {
      failed = true;
      original = error;
    }
    finishOwnerExercise(failed, original, runOwnerCleanups(cleanups));
  });

  it('publishes a live reference facade after a sibling retires it during child notification without reclaiming the canonical slot', () => {
    class Parent extends Backbone.Model<{ id: number; name: string; primary: Backbone.Model | null }> {}
    interface ParentView {
      name: ko.Observable<string | null>;
      primary: ko.Observable<unknown>;
    }
    const child = new Backbone.Model({ name: 'child' });
    const parent = new Parent({ id: 7, name: 'parent', primary: child });
    const collection = new Backbone.Collection<Parent>();
    const cleanups: Array<() => void> = [];
    let failed = false;
    let original: unknown;
    try {
      const store = new kb.Store();
      cleanups.push(() => store.dispose());
      const reference = new ModelRef(collection, 7);
      cleanups.push(() => reference.release());
      const creator = {
        create(): object {
          return view;
        },
      };
      const view = kb.viewModel<ParentView, Parent>(reference, { store, creator, keys: ['name', 'primary'] });
      cleanups.push(() => kb.dispose(view));
      const references: unknown = getKnockbackMetadata(view).stores_references;
      assert.ok(Array.isArray(references));
      assert.strictEqual(references.length, 1, 'reference facade initially owns one Store lease');
      const published: unknown[] = [];
      const modelSubscription = view.model.subscribe((model) => published.push(model));
      cleanups.push(() => modelSubscription.dispose());
      let canonical: typeof view | undefined;
      let retirements = 0;
      const primarySubscription = view.primary.subscribe((selected) => {
        if (retirements || typeof selected !== 'object' || selected === null || getKnockbackMetadata(selected).object !== child) return;
        retirements++;
        canonical = kb.viewModel<ParentView, Parent>(parent, { store, creator, keys: ['name', 'primary'] });
        const acquired = canonical;
        cleanups.push(() => kb.dispose(acquired));
      });
      cleanups.push(() => primarySubscription.dispose());
      collection.add(parent);
      assert.strictEqual(retirements, 1, 'real child subscriber creates one canonical sibling');
      assert.ok(canonical, 'canonical sibling acquired');
      assert.ok(view.model() === parent, 'live retired facade publishes the loaded model');
      assert.strictEqual(view.name(), 'parent', 'live retired facade exposes loaded attributes');
      assert.deepStrictEqual(
        published.map((model) => model === parent),
        [true],
        'loaded model is published once after child retirement'
      );
      const metadata = getKnockbackMetadata(view);
      assert.ok(metadata.stores_references === references, 'retirement preserves the reference array object');
      assert.strictEqual(references.length, 0, 'retired facade does not reacquire a Store lease');
      assert.ok(metadata.object === null, 'retirement deliberately clears wrapped Store identity');
      assert.ok(ownerMethod(store, 'find', parent, creator) === canonical, 'newer sibling remains canonical');
      const watcher: unknown = metadata.eventWatcher;
      assert.ok(typeof watcher === 'object' && watcher !== null);
      assert.ok(ownerMethod(watcher, 'emitter') === parent, 'live watcher remains attached to the parent');
      assert.strictEqual(reference.ref_count, 2, 'retirement does not change the reference lease');
      kb.dispose(view);
      assert.strictEqual(reference.ref_count, 1, 'retired facade disposal releases the reference once');
      assert.ok(ownerMethod(store, 'find', parent, creator) === canonical, 'retired facade disposal preserves canonical sibling');
      parent.set('name', 'canonical survivor');
      assert.strictEqual(canonical.name(), 'canonical survivor', 'canonical sibling remains live');
    } catch (error) {
      failed = true;
      original = error;
    }
    const errors = runOwnerCleanups(cleanups);
    try {
      collection.reset([]);
    } catch (error) {
      errors.push(error);
    }
    for (const model of [parent, child]) {
      try {
        assert.strictEqual(listenerCount(model, 'change'), 0, 'retirement final model listeners');
      } catch (error) {
        errors.push(error);
      }
    }
    finishOwnerExercise(failed, original, errors);
  });

  for (const action of ['unload', 'replace'] as const) {
    it(`does not publish the outer loaded root after a live child subscriber requests ${action}`, () => {
      class Parent extends Backbone.Model<{ id: number; name: string; primary: Backbone.Model | null }> {}
      interface ParentView {
        name: ko.Observable<string | null>;
        primary: ko.Observable<unknown>;
      }
      const firstChild = new Backbone.Model({ name: 'first child' });
      const secondChild = new Backbone.Model({ name: 'second child' });
      const first = new Parent({ id: 7, name: 'first', primary: firstChild });
      const replacement = new Parent({ id: 7, name: 'replacement', primary: secondChild });
      const collection = new Backbone.Collection<Parent>();
      const cleanups: Array<() => void> = [];
      let failed = false;
      let original: unknown;
      try {
        const reference = new ModelRef(collection, 7);
        cleanups.push(() => reference.release());
        const view = kb.viewModel<ParentView, Parent>(reference, { keys: ['name', 'primary'] });
        cleanups.push(() => kb.dispose(view));
        const published: unknown[] = [];
        const modelSubscription = view.model.subscribe((model) => published.push(model));
        cleanups.push(() => modelSubscription.dispose());
        let transitions = 0;
        const primarySubscription = view.primary.subscribe((selected) => {
          if (transitions || typeof selected !== 'object' || selected === null || getKnockbackMetadata(selected).object !== firstChild) return;
          transitions++;
          if (action === 'unload') collection.remove(first);
          else collection.reset([replacement]);
        });
        cleanups.push(() => primarySubscription.dispose());
        collection.add(first);
        assert.strictEqual(transitions, 1, 'real child subscriber transitions once');
        const expected = action === 'unload' ? null : replacement;
        assert.ok(view.model() === expected, 'live root publishes latest admitted model');
        assert.ok(reference.model() === (action === 'unload' ? undefined : replacement), 'real reference is latest model');
        const metadata = getKnockbackMetadata(view);
        assert.ok(metadata.object === expected, 'Store wrapped model is latest attachment');
        const watcher: unknown = metadata.eventWatcher;
        assert.ok(typeof watcher === 'object' && watcher !== null);
        assert.ok(ownerMethod(watcher, 'emitter') === expected, 'watcher remains latest emitter');
        assert.ok(!published.includes(first), 'superseded outer model is never published');
        assert.strictEqual(view.name(), action === 'unload' ? null : 'replacement', 'latest root attribute');
        if (action === 'replace') {
          const selected = view.primary();
          assert.ok(typeof selected === 'object' && selected !== null);
          assert.ok(getKnockbackMetadata(selected).object === secondChild, 'replacement child remains selected');
        } else {
          const selected = view.primary();
          assert.ok(selected !== view, 'unloaded null child does not alias live root');
        }
        assert.strictEqual(reference.ref_count, 2, 'live transition keeps one reference lease');
      } catch (error) {
        failed = true;
        original = error;
      }
      const errors = runOwnerCleanups(cleanups);
      try {
        collection.reset([]);
      } catch (error) {
        errors.push(error);
      }
      for (const model of [first, replacement, firstChild, secondChild]) {
        try {
          assert.strictEqual(listenerCount(model, 'change'), 0, 'reentrant final model listeners');
        } catch (error) {
          errors.push(error);
        }
      }
      finishOwnerExercise(failed, original, errors);
    });
  }

  it('shares an ordinary null placeholder without adopting a live unloaded reference root', () => {
    interface ParentView {
      name: ko.Observable<string | null>;
      primary: ko.Observable<unknown>;
    }
    const store = new kb.Store();
    const collection = new Backbone.Collection();
    const reference = new ModelRef(collection, 7);
    const nullView = kb.viewModel<PersonViewModel>(null, { store, keys: ['name'] });
    const view = kb.viewModel<ParentView>(reference, { store, keys: ['name', 'primary'] });
    const child = new Backbone.Model({ name: 'child' });
    const parent = new Backbone.Model<{ id: number; name: string; primary: Backbone.Model | null }>({ id: 7, name: 'parent', primary: child });
    const ordinary = kb.observable<unknown>(parent, 'primary', { store });
    let failed = false;
    let original: unknown;
    try {
      collection.add(parent);
      assert.strictEqual(view.primary(), ordinary(), 'loaded child has one shared owner');
      parent.set('primary', null);
      assert.strictEqual(view.primary(), nullView, 'root primary uses ordinary null placeholder');
      assert.strictEqual(ordinary(), nullView, 'ordinary primary uses the same null placeholder');
      assert.strictEqual(nullView.model(), null, 'ordinary placeholder remains null-backed');
      collection.remove(parent);
      assert.strictEqual(view.primary(), nullView, 'unloaded nested primary keeps ordinary null owner');
      assert.ok(view.primary() !== view, 'unloaded nested primary never aliases reference root');
      assert.strictEqual(nullView.model(), null, 'unload does not replace null placeholder model');
      collection.add(parent);
      assert.strictEqual(view.primary(), nullView, 'reload keeps ordinary null owner');
      assert.strictEqual(view.model(), parent, 'root reload selects actual parent');
      assert.strictEqual(nullView.model(), null, 'reloaded placeholder does not become parent');
    } catch (error) {
      failed = true;
      original = error;
    }
    const cleanupErrors = runOwnerCleanups([
      () => {
        collection.reset([]);
        assert.strictEqual(listenerCount(parent, 'change'), 0, 'final parent listeners');
        assert.strictEqual(listenerCount(child, 'change'), 0, 'final child listeners');
      },
      () => reference.release(),
      () => store.dispose(),
      () => kb.dispose(view),
      () => ordinary.dispose(),
    ]);
    finishOwnerExercise(failed, original, cleanupErrors);
  });

  it('registers the loaded reference root before cyclic child materialization and keeps its shared lease', () => {
    interface GraphView {
      name: ko.Observable<string | null>;
      primary: ko.Observable<unknown>;
    }
    class GraphParent extends Backbone.Model<{ id: number; name: string; primary: Backbone.Model | null }> {}
    const store = new kb.Store();
    const collection = new Backbone.Collection();
    const reference = new ModelRef(collection, 7);
    const view = kb.viewModel<GraphView>(reference, { store, keys: ['name', 'primary'] });
    const first = new GraphParent({ id: 7, name: 'first', primary: null });
    const firstChild = new Backbone.Model({ name: 'first child', owner: first });
    first.set('primary', firstChild);
    const replacement = new GraphParent({ id: 7, name: 'replacement', primary: null });
    const replacementChild = new Backbone.Model({ name: 'replacement child', owner: replacement });
    replacement.set('primary', replacementChild);
    const observed: unknown[] = [];
    const childSubscription = view.primary.subscribe((selected) => {
      if (selected === null) return;
      assert.ok(typeof selected === 'object' && selected !== null);
      const inverse = Reflect.get(selected, 'owner');
      if (!ko.isObservable(inverse)) return;
      observed.push(inverse());
      assert.ok(inverse() === view, 'child materialization uses exact reference root before root publication');
    });
    let failed = false;
    let original: unknown;
    let extraRef = false;
    try {
      ownerMethod(store, 'retain', view, null);
      extraRef = true;
      const metadata = getKnockbackMetadata(view);
      const references = metadata.stores_references;
      assert.ok(Array.isArray(references));
      assert.strictEqual(references.length, 1, 'root initially has one Store lease');
      const lease: unknown = references[0];
      assert.ok(typeof lease === 'object' && lease !== null);
      assert.strictEqual(Reflect.get(lease, 'ref_count'), 2, 'manual retain acquires exactly one root ref');
      collection.add(first);
      assert.strictEqual(view.model(), first, 'first loaded root model');
      assert.strictEqual(getKnockbackMetadata(view).object, first, 'first wrapped root model');
      collection.reset([replacement]);
      assert.strictEqual(view.model(), replacement, 'replacement root model');
      assert.strictEqual(getKnockbackMetadata(view).object, replacement, 'replacement wrapped root model');
      assert.ok(observed.length >= 2, 'both real child graphs were materialized');
      collection.remove(replacement);
      assert.strictEqual(view.model(), null, 'unloaded root model');
      assert.ok(view.primary() !== view, 'unloaded primary is not the root');
      collection.add(first);
      assert.strictEqual(view.model(), first, 'original root reload model');
      assert.strictEqual(getKnockbackMetadata(view).object, first, 'original wrapped root reload model');
      assert.strictEqual(getKnockbackMetadata(view).stores_references, references, 'automatic attachments preserve exact Store reference array');
      assert.strictEqual(references[0], lease, 'automatic attachments preserve exact lease object');
      ownerMethod(store, 'release', view);
      extraRef = false;
      assert.strictEqual(reference.ref_count, 2, 'extra Store release leaves reference attachment alive');
    } catch (error) {
      failed = true;
      original = error;
    }
    const cleanupErrors = runOwnerCleanups([
      () => {
        collection.reset([]);
        for (const model of [first, replacement, firstChild, replacementChild]) assert.strictEqual(listenerCount(model, 'change'), 0, 'final cyclic model listeners');
      },
      () => {
        reference.release();
        assert.strictEqual(reference.ref_count, 0, 'final reference release');
      },
      () => store.dispose(),
      () => {
        kb.dispose(view);
        assert.strictEqual(reference.ref_count, 1, 'root final disposal releases reference once');
      },
      () => {
        if (extraRef) ownerMethod(store, 'release', view);
      },
      () => childSubscription.dispose(),
    ]);
    finishOwnerExercise(failed, original, cleanupErrors);
  });

  it('keeps shared-Store reference facades independent after canonical replacement and sibling disposal', () => {
    const store = new kb.Store();
    const collection = new PersonCollection();
    const reference = new ModelRef(collection, 7);
    const first = kb.viewModel<PersonViewModel, PersonModel>(reference, { store, keys: ['name'] });
    const second = kb.viewModel<PersonViewModel, PersonModel>(reference, { store, keys: ['name'] });
    const parent = new PersonModel({ id: 7, name: 'parent' });
    const replacement = new PersonModel({ id: 7, name: 'replacement' });
    let failed = false;
    let original: unknown;
    try {
      collection.add(parent);
      assert.strictEqual(first.name(), 'parent');
      assert.strictEqual(second.name(), 'parent');
      collection.reset([replacement]);
      assert.strictEqual(first.model(), replacement, 'retired facade remains attached to reference');
      assert.strictEqual(second.model(), replacement, 'canonical facade remains attached to reference');
      assert.strictEqual(getKnockbackMetadata(first).object, replacement, 'retired facade tracks actual wrapped model');
      kb.dispose(first);
      assert.strictEqual(reference.ref_count, 2, 'sibling disposal releases one reference');
      replacement.set('name', 'survivor');
      assert.strictEqual(second.name(), 'survivor', 'sibling replacement owner remains live');
      collection.remove(replacement);
      assert.strictEqual(second.name(), null);
      collection.add(parent);
      assert.strictEqual(second.name(), 'parent', 'surviving canonical facade reloads');
    } catch (error) {
      failed = true;
      original = error;
    }
    const cleanupErrors = runOwnerCleanups([
      () => {
        collection.reset([]);
        assert.strictEqual(listenerCount(parent, 'change'), 0, 'final parent listeners');
        assert.strictEqual(listenerCount(replacement, 'change'), 0, 'final replacement listeners');
      },
      () => {
        reference.release();
        assert.strictEqual(reference.ref_count, 0, 'final shared reference release');
      },
      () => store.dispose(),
      () => kb.dispose(second),
      () => kb.dispose(first),
    ]);
    finishOwnerExercise(failed, original, cleanupErrors);
  });

  it('does not publish or revive a reference root disposed during child notification', () => {
    interface ParentView {
      name: ko.Observable<string | null>;
      primary: ko.Observable<unknown>;
    }
    const collection = new Backbone.Collection();
    const reference = new ModelRef(collection, 7);
    const view = kb.viewModel<ParentView>(reference, { keys: ['name', 'primary'] });
    const child = new Backbone.Model({ name: 'child' });
    const parent = new Backbone.Model({ id: 7, name: 'parent', primary: child });
    let disposals = 0;
    let publications = 0;
    const modelSubscription = view.model.subscribe(() => {
      publications++;
    });
    const childSubscription = view.primary.subscribe((selected) => {
      if (!selected) return;
      disposals++;
      kb.dispose(view);
    });
    let failed = false;
    let original: unknown;
    try {
      collection.add(parent);
      assert.strictEqual(disposals, 1, 'real child notification disposes root once');
      assert.strictEqual(publications, 0, 'deferred root notification does not revive disposed root');
      assert.strictEqual(reference.ref_count, 1, 'notification disposal releases reference once');
      assert.strictEqual(listenerCount(reference, 'loaded'), 0, 'disposed loaded listener');
      assert.strictEqual(listenerCount(reference, 'unloaded'), 0, 'disposed unloaded listener');
    } catch (error) {
      failed = true;
      original = error;
    }
    const cleanupErrors = runOwnerCleanups([
      () => {
        collection.reset([]);
        assert.strictEqual(listenerCount(parent, 'change'), 0, 'final notification parent listeners');
        assert.strictEqual(listenerCount(child, 'change'), 0, 'final notification child listeners');
      },
      () => reference.release(),
      () => kb.dispose(view),
      () => modelSubscription.dispose(),
      () => childSubscription.dispose(),
    ]);
    finishOwnerExercise(failed, original, cleanupErrors);
  });

  it('rekeys an ordinary null root when an unloaded ModelRef is explicitly attached', () => {
    const store = new kb.Store();
    const collection = new PersonCollection();
    const reference = new ModelRef(collection, 7);
    const view = kb.viewModel<PersonViewModel, PersonModel>(null, { store, keys: ['name'] });
    const parent = new PersonModel({ id: 7, name: 'parent' });
    const other = new Backbone.Model<{ child: PersonModel | null }>({ child: parent });
    let selected: ReturnType<typeof kb.observable<unknown>> | undefined;
    let failed = false;
    let original: unknown;
    try {
      view.model(reference);
      assert.strictEqual(reference.ref_count, 2, 'explicit reference attachment retains once');
      selected = kb.observable<unknown>(other, 'child', { store });
      other.set('child', null);
      const placeholder = selected();
      assert.ok(placeholder !== view, 'explicitly attached unloaded root is not a null placeholder');
      assert.ok(typeof placeholder === 'object' && placeholder !== null);
      assert.strictEqual(getKnockbackMetadata(placeholder).object, null, 'separate null owner remains null-backed');
      collection.add(parent);
      assert.strictEqual(view.name(), 'parent');
      assert.strictEqual(getKnockbackMetadata(placeholder).object, null, 'loading reference does not adopt placeholder');
    } catch (error) {
      failed = true;
      original = error;
    }
    const cleanupErrors = runOwnerCleanups([() => collection.reset([]), () => reference.release(), () => store.dispose(), () => kb.dispose(view), () => selected?.dispose()]);
    finishOwnerExercise(failed, original, cleanupErrors);
  });

  it('transfers a view between ordinary and referenced models before clearing', () => {
    const collection = new PersonCollection();
    const referencedModel = new PersonModel({ id: 0, name: 'referenced' });
    collection.add(referencedModel);
    const reference = new ModelRef(collection, 0);
    const ordinaryModel = new PersonModel({ id: 1, name: 'ordinary' });
    const replacement = new PersonModel({ id: 2, name: 'replacement' });
    const view = kb.viewModel<PersonViewModel, PersonModel>(ordinaryModel, { keys: ['name'] });

    view.model(reference);
    assert.strictEqual(reference.ref_count, 2);
    assert.strictEqual(view.model(), referencedModel);
    assert.strictEqual(view.name(), 'referenced');

    view.model(replacement);
    assert.strictEqual(reference.ref_count, 1);
    assert.strictEqual(view.model(), replacement);
    assert.strictEqual(view.name(), 'replacement');

    view.model(null);
    assert.strictEqual(view.model(), null);
    assert.strictEqual(view.name(), null);

    referencedModel.set('name', 'ignored reference');
    replacement.set('name', 'ignored replacement');
    assert.strictEqual(view.model(), null);
    assert.strictEqual(view.name(), null);

    view.dispose();
    view.dispose();
    assert.strictEqual(reference.ref_count, 1);
    reference.release();
  });

  it('clears one reference-backed view without releasing its sibling', () => {
    const collection = new PersonCollection();
    const model = new PersonModel({ id: 0, name: 'shared' });
    collection.add(model);
    const reference = new ModelRef(collection, 0);
    const firstView = kb.viewModel<PersonViewModel, PersonModel>(reference, { keys: ['name'] });
    const secondView = kb.viewModel<PersonViewModel, PersonModel>(reference, { keys: ['name'] });

    assert.strictEqual(reference.ref_count, 3);
    firstView.model(null);
    assert.strictEqual(reference.ref_count, 2);
    assert.strictEqual(firstView.model(), null);
    assert.strictEqual(firstView.name(), null);
    assert.strictEqual(secondView.model(), model);
    assert.strictEqual(secondView.name(), 'shared');

    model.set('name', 'survivor');
    assert.strictEqual(firstView.name(), null);
    assert.strictEqual(secondView.name(), 'survivor');

    firstView.dispose();
    firstView.dispose();
    assert.strictEqual(reference.ref_count, 2);

    secondView.dispose();
    secondView.dispose();
    assert.strictEqual(reference.ref_count, 1);
    reference.release();
    assert.strictEqual(reference.ref_count, 0);
  });

  it('publishes loaded and replacement models after their attributes are ready', () => {
    interface ReactiveViewModel {
      name: ko.Observable<string | null>;
      role: ko.Observable<string | null>;
    }

    const collection = new PersonCollection();
    const reference = new ModelRef(collection, 7);
    const view = kb.viewModel<ReactiveViewModel, PersonModel>(reference);
    const labels: Array<string | null> = [];
    const readyModels: Array<{ model: PersonModel; name: string | null; role: string | null }> = [];
    const label = ko.computed(() => {
      const model = view.model();
      if (!model) return null;
      return model.has('role') ? `${view.name()}:${view.role()}` : view.name();
    });
    const labelSubscription = label.subscribe((value) => labels.push(value));
    const modelSubscription = view.model.subscribe((model) => {
      if (!model) return;
      readyModels.push({
        model,
        name: view.name(),
        role: model.has('role') ? view.role() : null,
      });
    });

    try {
      assert.strictEqual(label(), null);

      const initialModel = new PersonModel({ id: 7, name: 'loaded' });
      collection.add(initialModel);

      assert.strictEqual(label(), 'loaded');
      assert.deepStrictEqual(labels, ['loaded']);
      assert.deepStrictEqual(readyModels, [{ model: initialModel, name: 'loaded', role: null }]);

      const replacement = new PersonModel({ id: 7, name: 'replacement', role: 'admin' });
      collection.reset([replacement]);

      assert.strictEqual(label(), 'replacement:admin');
      assert.strictEqual(labels[labels.length - 1], 'replacement:admin');
      assert.deepStrictEqual(readyModels[readyModels.length - 1], {
        model: replacement,
        name: 'replacement',
        role: 'admin',
      });
    } finally {
      modelSubscription.dispose();
      labelSubscription.dispose();
      label.dispose();
      view.dispose();
      reference.release();
    }
  });

  it('publishes default-discovered values before each non-null model notification', () => {
    interface ReadyViewModel {
      name: ko.Observable<string | null>;
      role: ko.Observable<string | null>;
    }

    const collection = new PersonCollection();
    const reference = new ModelRef(collection, 7);
    const view = kb.viewModel<ReadyViewModel, PersonModel>(reference);
    const seen: Array<{ expected: string | undefined; actual: string | null; role: string | null }> = [];
    const subscription = view.model.subscribe((model) => {
      if (!model) return;
      seen.push({
        expected: model.get('name'),
        actual: view.name(),
        role: model.has('role') ? view.role() : null,
      });
    });

    try {
      const first = new PersonModel({ id: 7, name: 'first' });
      collection.add(first);
      assert.deepStrictEqual(seen[0], { expected: 'first', actual: 'first', role: null });

      const sameKeys = new PersonModel({ id: 7, name: 'second' });
      collection.reset([sameKeys]);
      assert.deepStrictEqual(seen[1], { expected: 'second', actual: 'second', role: null });

      const newKey = new PersonModel({ id: 7, name: 'third', role: 'admin' });
      collection.reset([newKey]);
      assert.deepStrictEqual(seen[2], { expected: 'third', actual: 'third', role: 'admin' });

      collection.remove(newKey);
      assert.strictEqual(view.model(), null);
      assert.strictEqual(view.name(), null);
      assert.strictEqual(view.role(), null);

      const reloaded = new PersonModel({ id: 7, name: 'reloaded' });
      collection.add(reloaded);
      assert.deepStrictEqual(seen[3], { expected: 'reloaded', actual: 'reloaded', role: null });

      const direct = new PersonModel({ id: 8, name: 'direct', role: 'owner' });
      view.model(direct);
      assert.deepStrictEqual(seen[4], { expected: 'direct', actual: 'direct', role: 'owner' });
      assert.strictEqual(reference.ref_count, 1);
    } finally {
      subscription.dispose();
      view.dispose();
      reference.release();
    }
  });

  it('publishes explicit and mapped values before each non-null model notification', () => {
    interface ReadyMappedViewModel {
      name: ko.Observable<string | null>;
      displayName: ko.Observable<string | null>;
      role?: ko.Observable<string | null>;
    }

    const collection = new PersonCollection();
    const reference = new ModelRef(collection, 7);
    const view = kb.viewModel<ReadyMappedViewModel, PersonModel>(reference, {
      keys: ['name'],
      mappings: {
        displayName: { key: 'name' },
      },
    });
    const seen: Array<{ expected: string | undefined; name: string | null; displayName: string | null }> = [];
    const subscription = view.model.subscribe((model) => {
      if (!model) return;
      seen.push({
        expected: model.get('name'),
        name: view.name(),
        displayName: view.displayName(),
      });
    });

    try {
      const first = new PersonModel({ id: 7, name: 'first' });
      collection.add(first);
      assert.deepStrictEqual(seen[0], { expected: 'first', name: 'first', displayName: 'first' });

      const sameKeys = new PersonModel({ id: 7, name: 'second' });
      collection.reset([sameKeys]);
      assert.deepStrictEqual(seen[1], { expected: 'second', name: 'second', displayName: 'second' });

      const newKey = new PersonModel({ id: 7, name: 'third', role: 'filtered' });
      collection.reset([newKey]);
      assert.deepStrictEqual(seen[2], { expected: 'third', name: 'third', displayName: 'third' });
      assert.strictEqual(view.role, undefined);

      collection.remove(newKey);
      assert.strictEqual(view.model(), null);
      assert.strictEqual(view.name(), null);
      assert.strictEqual(view.displayName(), null);

      const reloaded = new PersonModel({ id: 7, name: 'reloaded' });
      collection.add(reloaded);
      assert.deepStrictEqual(seen[3], { expected: 'reloaded', name: 'reloaded', displayName: 'reloaded' });

      const direct = new PersonModel({ id: 8, name: 'direct' });
      view.model(direct);
      assert.deepStrictEqual(seen[4], { expected: 'direct', name: 'direct', displayName: 'direct' });
      assert.strictEqual(reference.ref_count, 1);
    } finally {
      subscription.dispose();
      view.dispose();
      reference.release();
    }
  });

  it('updates a real browser DOM binding across the reference lifecycle', () => {
    if (typeof document === 'undefined') return;

    const collection = new PersonCollection();
    const reference = new ModelRef(collection, 7);
    const view = kb.viewModel<PersonViewModel, PersonModel>(reference);
    const node = document.createElement('div');
    const label = document.createElement('span');
    label.setAttribute('data-bind', "text: model() ? name() : ''");
    node.append(label);
    document.body.append(node);
    let bindingsApplied = false;

    try {
      ko.applyBindings(view, node);
      bindingsApplied = true;
      assert.strictEqual(label.textContent, '');

      const initialModel = new PersonModel({ id: 7, name: 'loaded' });
      collection.add(initialModel);
      assert.strictEqual(label.textContent, 'loaded');

      initialModel.set('name', 'changed');
      assert.strictEqual(label.textContent, 'changed');

      const replacement = new PersonModel({ id: 7, name: 'replacement' });
      collection.reset([replacement]);
      assert.strictEqual(label.textContent, 'replacement');

      collection.remove(replacement);
      assert.strictEqual(label.textContent, '');

      collection.add(new PersonModel({ id: 7, name: 'reloaded' }));
      assert.strictEqual(label.textContent, 'reloaded');
    } finally {
      if (bindingsApplied) ko.cleanNode(node);
      node.remove();
      view.dispose();
      reference.release();
    }
  });

  it('discovers attributes for two views across delayed loads and replacements', () => {
    interface DiscoveredViewModel {
      id: ko.Observable<number | null>;
      name: ko.Observable<string | null>;
      role: ko.Observable<string | null>;
      status: ko.Observable<string | null>;
    }

    const collection = new PersonCollection();
    const reference = new ModelRef(collection, 7);
    const firstView = kb.viewModel<DiscoveredViewModel, PersonModel>(reference);
    const secondView = kb.viewModel<DiscoveredViewModel, PersonModel>(reference);

    assert.strictEqual(reference.ref_count, 3);
    assert.strictEqual(firstView.model(), null);
    assert.strictEqual(secondView.model(), null);
    const firstNameBeforeLoad = firstView.name;
    const secondNameBeforeLoad = secondView.name;
    assert.strictEqual(firstNameBeforeLoad, undefined);
    assert.strictEqual(secondNameBeforeLoad, undefined);

    const initialModel = new PersonModel({ id: 7, name: 'loaded' });
    collection.add(initialModel);

    assert.strictEqual(firstView.model(), initialModel);
    assert.strictEqual(secondView.model(), initialModel);
    assert.strictEqual(firstView.name(), 'loaded');
    assert.strictEqual(secondView.name(), 'loaded');

    const replacement = new PersonModel({ id: 7, name: 'replacement', role: 'admin' });
    collection.reset([replacement]);

    assert.strictEqual(firstView.model(), replacement);
    assert.strictEqual(secondView.model(), replacement);
    assert.strictEqual(firstView.role(), 'admin');
    assert.strictEqual(secondView.role(), 'admin');

    collection.remove(replacement);
    assert.strictEqual(firstView.model(), null);
    assert.strictEqual(secondView.model(), null);
    assert.strictEqual(firstView.name(), null);
    assert.strictEqual(secondView.role(), null);

    const reloadedModel = new PersonModel({ id: 7, name: 'reloaded', status: 'ready' });
    collection.add(reloadedModel);

    assert.strictEqual(firstView.model(), reloadedModel);
    assert.strictEqual(secondView.model(), reloadedModel);
    assert.strictEqual(firstView.status(), 'ready');
    assert.strictEqual(secondView.status(), 'ready');
    assert.strictEqual(listenerCount(reloadedModel, 'change'), 2);

    firstView.dispose();
    assert.strictEqual(reference.ref_count, 2);
    assert.strictEqual(listenerCount(reloadedModel, 'change'), 1);

    reloadedModel.set('name', 'survivor');
    assert.strictEqual(secondView.name(), 'survivor');

    secondView.dispose();
    assert.strictEqual(reference.ref_count, 1);
    assert.strictEqual(listenerCount(reloadedModel, 'change'), 0);
    assert.strictEqual(listenerCount(reference, 'loaded'), 0);
    assert.strictEqual(listenerCount(reference, 'unloaded'), 0);

    reference.release();
    assert.strictEqual(reference.ref_count, 0);
    assert.strictEqual(listenerCount(collection, 'add'), 0);
    assert.strictEqual(listenerCount(collection, 'remove'), 0);
    assert.strictEqual(listenerCount(collection, 'reset'), 0);
  });

  it('preserves explicit keys, requires, and mappings on a delayed load', () => {
    interface FilteredViewModel {
      name: ko.Observable<string | null>;
      required: ko.Observable<string | null>;
      displayName: ko.Observable<string | null>;
      id?: ko.Observable<number>;
      extra?: ko.Observable<string>;
    }

    const collection = new PersonCollection();
    const reference = new ModelRef(collection, 12);
    const view = kb.viewModel<FilteredViewModel, PersonModel>(reference, {
      keys: ['name'],
      requires: ['required'],
      mappings: {
        displayName: { key: 'name' },
      },
    });

    assert.strictEqual(view.name(), null);
    assert.strictEqual(view.required(), null);
    assert.strictEqual(view.displayName(), null);

    const model = new PersonModel({ id: 12, name: 'mapped', required: 'present', extra: 'filtered' });
    collection.add(model);

    assert.strictEqual(view.name(), 'mapped');
    assert.strictEqual(view.required(), 'present');
    assert.strictEqual(view.displayName(), 'mapped');
    assert.strictEqual(view.id, undefined);
    assert.strictEqual(view.extra, undefined);

    const replacement = new PersonModel({ id: 12, name: 'replacement', required: 'still present', extra: 'still filtered' });
    collection.reset([replacement]);

    assert.strictEqual(view.name(), 'replacement');
    assert.strictEqual(view.required(), 'still present');
    assert.strictEqual(view.displayName(), 'replacement');
    assert.strictEqual(view.id, undefined);
    assert.strictEqual(view.extra, undefined);

    view.dispose();
    assert.strictEqual(reference.ref_count, 1);
    reference.release();
  });
});
