import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';
import { collectionObservable } from '../../src/collection-observable.ts';
import { UnexpectedValueError } from '../../src/errors/index.ts';
import type { CreateOptions, CreatorObject } from '../../src/internal-types.ts';
import { settings } from '../../src/kb.ts';
import { Store } from '../../src/store.ts';
import type { StoreReference, StoreRetainState } from '../../src/types.ts';
import { get, getCreator, getObject } from '../../src/utils.ts';
import { getKnockbackMetadata } from '../lib/knockback-metadata.ts';

class TestCreator {
  constructor(obj: unknown, options: CreateOptions) {
    void obj;
    void options;
  }
}

describe('Store', () => {
  it('calls an inherited create method with its creator receiver and caches the result', () => {
    const store = new Store();
    const model = new Backbone.Model({ name: 'Ada' });
    let calls = 0;
    const creator: CreatorObject<{ model: unknown }> = Object.create({
      create(this: unknown, obj: unknown) {
        calls++;
        assert.strictEqual(this, creator);
        return { model: obj };
      },
    });

    try {
      const first = store.retainOrCreate(model, { creator }) as { model: unknown };
      const second = store.retainOrCreate(model, { creator });

      assert.strictEqual(first.model, model);
      assert.strictEqual(second, first);
      assert.strictEqual(calls, 1);
    } finally {
      store.dispose();
    }
  });

  it('dispatches constructors and arrow creators', () => {
    const store = new Store();
    const constructorModel = new Backbone.Model();
    const arrowModel = new Backbone.Model();

    class ConstructorCreator {
      model: unknown;

      constructor(obj: unknown) {
        this.model = obj;
      }
    }

    const arrowCreator = (obj: unknown) => ({ model: obj });

    try {
      const constructed = store.retainOrCreate(constructorModel, { creator: ConstructorCreator });
      const called = store.retainOrCreate(arrowModel, { creator: arrowCreator }) as { model: unknown };

      assert.ok(constructed instanceof ConstructorCreator);
      assert.strictEqual(constructed.model, constructorModel);
      assert.strictEqual(called.model, arrowModel);
    } finally {
      store.dispose();
    }
  });

  it('preserves creator flags and bare models-only sentinels', () => {
    const store = new Store();
    const modelsOnlyModel = new Backbone.Model();
    const createdModel = new Backbone.Model();
    const callableModel = new Backbone.Model();
    const bareModel = new Backbone.Model();
    const inheritedModelsOnlyModel = new Backbone.Model();
    const inheritedCreatedModel = new Backbone.Model();
    const inheritedCallableModel = new Backbone.Model();
    let trueFlagCalls = 0;
    let falseFlagCalls = 0;
    let callableCalls = 0;
    let inheritedTrueFlagCalls = 0;
    let inheritedFalseFlagCalls = 0;
    let inheritedCallableCalls = 0;
    const trueFlagCreator = {
      modelsOnly: true,
      create() {
        trueFlagCalls++;
        return {};
      },
    };
    const falseFlagCreator = {
      modelsOnly: false,
      create(obj: unknown) {
        falseFlagCalls++;
        return { model: obj };
      },
    };
    const callableCreator = Object.assign(
      (obj: unknown) => {
        callableCalls++;
        return { model: obj };
      },
      { modelsOnly: true }
    );
    const inheritedTrueFlagCreator = Object.assign(Object.create({ modelsOnly: true }), {
      create() {
        inheritedTrueFlagCalls++;
        return {};
      },
    });
    const inheritedFalseFlagCreator = Object.assign(Object.create({ modelsOnly: false }), {
      create(this: unknown, obj: unknown) {
        inheritedFalseFlagCalls++;
        assert.strictEqual(this, inheritedFalseFlagCreator);
        return { model: obj };
      },
    });
    const inheritedCallableCreator = Object.setPrototypeOf(
      (obj: unknown) => {
        inheritedCallableCalls++;
        return { model: obj };
      },
      { modelsOnly: true }
    );

    try {
      assert.strictEqual(store.retainOrCreate(modelsOnlyModel, { creator: trueFlagCreator }), modelsOnlyModel);
      assert.strictEqual((store.retainOrCreate(createdModel, { creator: falseFlagCreator }) as { model: unknown }).model, createdModel);
      assert.strictEqual(store.retainOrCreate(callableModel, { creator: callableCreator }), callableModel);
      assert.strictEqual(store.retainOrCreate(bareModel, { creator: { modelsOnly: true } }), bareModel);
      assert.strictEqual(store.retainOrCreate(inheritedModelsOnlyModel, { creator: inheritedTrueFlagCreator }), inheritedModelsOnlyModel);
      assert.strictEqual((store.retainOrCreate(inheritedCreatedModel, { creator: inheritedFalseFlagCreator }) as { model: unknown }).model, inheritedCreatedModel);
      assert.strictEqual(store.retainOrCreate(inheritedCallableModel, { creator: inheritedCallableCreator }), inheritedCallableModel);
      assert.strictEqual(trueFlagCalls, 0);
      assert.strictEqual(falseFlagCalls, 1);
      assert.strictEqual(callableCalls, 0);
      assert.strictEqual(inheritedTrueFlagCalls, 0);
      assert.strictEqual(inheritedFalseFlagCalls, 1);
      assert.strictEqual(inheritedCallableCalls, 0);
    } finally {
      store.dispose();
    }
  });

  it('keeps the early unexpected-value error for malformed creators', () => {
    const store = new Store();

    try {
      assert.throws(() => store.retainOrCreate(new Backbone.Model(), { creator: {} }), UnexpectedValueError);
    } finally {
      store.dispose();
    }
  });

  it('throws TypeError if a creator stops being callable during dispatch', () => {
    const store = new Store();
    let reads = 0;
    const creator = {
      get create() {
        reads++;
        return reads < 5 ? () => ({}) : undefined;
      },
    } as CreatorObject;

    try {
      assert.throws(() => store.retainOrCreate(new Backbone.Model(), { creator }), TypeError);
      assert.strictEqual(reads, 5);
    } finally {
      store.dispose();
    }
  });

  it('preserves creator getter selection and read count', () => {
    const store = new Store();
    let reads = 0;
    const creator = {
      get create() {
        const selectedRead = ++reads;
        return () => ({ selectedRead });
      },
    };

    try {
      const result = store.retainOrCreate(new Backbone.Model(), { creator }) as { selectedRead: number };

      assert.strictEqual(reads, 10);
      assert.strictEqual(result.selectedRead, 6);
    } finally {
      store.dispose();
    }
  });

  it('clears creator metadata when releasing a reused owner', () => {
    const store = new Store();
    const owner = {};
    const firstModel = new Backbone.Model({ name: 'Ada' });
    const secondModel = new Backbone.Model({ name: 'Grace' });

    try {
      store.retain(owner, firstModel, TestCreator);
      assert.strictEqual(getCreator(owner), TestCreator);
      assert.strictEqual(getObject(owner), firstModel);

      store.reuse(owner, secondModel);
      assert.strictEqual(getCreator(owner), TestCreator);
      assert.strictEqual(getObject(owner), secondModel);

      store.release(owner);
      assert.strictEqual(getCreator(owner), undefined);
      assert.strictEqual(getObject(owner), null);
      assert.strictEqual(store.find(secondModel, TestCreator), null);
    } finally {
      store.dispose();
    }
  });

  it('rejects an invalid retain before disturbing a cached owner', () => {
    const store = new Store();
    const model = new Backbone.Model();
    let disposed = 0;
    const creator = () => ({
      dispose() {
        disposed++;
      },
    });
    const owner = store.retainOrCreate(model, { creator }) as ReturnType<typeof creator>;
    const references = get<StoreReference[]>(owner, 'stores_references');
    const replacementList = store.replaced_observables;
    const cache = store.observable_records;
    const cacheKeys = Object.keys(cache);
    const metadata = (owner as { __kb?: object }).__kb;
    const creatorCids = (creator as typeof creator & { __kb_cids?: unknown[] }).__kb_cids;
    const creatorCidEntries = creatorCids?.slice();
    let unreadCreatorReads = 0;
    const unreadCreator = {
      get create() {
        unreadCreatorReads++;
        return () => ({});
      },
    };

    assert.ok(references);
    assert.strictEqual(references.length, 1);
    assert.strictEqual(references[0].ref_count, 1);
    assert.throws(() => store.retain(7, model, creator), TypeError);
    assert.throws(() => store.retain(7, model, unreadCreator), TypeError);
    assert.strictEqual(unreadCreatorReads, 0);
    assert.strictEqual(store.find(model, creator), owner);
    assert.strictEqual(getObject(owner), model);
    assert.strictEqual(getCreator(owner), creator);
    assert.strictEqual(store.observable_records, cache);
    assert.deepStrictEqual(Object.keys(cache), cacheKeys);
    assert.strictEqual((owner as { __kb?: object }).__kb, metadata);
    assert.strictEqual((creator as typeof creator & { __kb_cids?: unknown[] }).__kb_cids, creatorCids);
    assert.deepStrictEqual(creatorCids, creatorCidEntries);
    assert.strictEqual(get<StoreReference[]>(owner, 'stores_references'), references);
    assert.strictEqual(references.length, 1);
    assert.strictEqual(references[0].ref_count, 1);
    assert.strictEqual(store.replaced_observables, replacementList);
    assert.strictEqual(replacementList.length, 0);
    assert.strictEqual(disposed, 0);

    store.dispose();
    assert.strictEqual(disposed, 1);
    assert.strictEqual(references.length, 0);
    assert.strictEqual(getObject(owner), null);
    assert.strictEqual(getCreator(owner), undefined);
  });

  it('rejects truthy custom results and preserves the falsy KO fallback', () => {
    const invalidStore = new Store();
    const fallbackStore = new Store();
    const invalidCreator = () => 7;
    const fallbackCreator = () => 0;

    try {
      assert.throws(() => invalidStore.retainOrCreate(new Backbone.Model(), { creator: invalidCreator }), TypeError);
      assert.strictEqual(invalidStore.replaced_observables.length, 0);
      assert.deepStrictEqual(invalidStore.observable_records, {});

      const fallback = fallbackStore.retainOrCreate(new Backbone.Model(), { creator: fallbackCreator });
      assert.ok(ko.isObservable(fallback));
      assert.strictEqual(fallback(), null);
    } finally {
      invalidStore.dispose();
      fallbackStore.dispose();
    }
  });

  it('applies the explicit primitive policy without changing falsy retain', () => {
    const store = new Store();
    const model = new Backbone.Model();
    const creator = () => ({});
    const falsyValues: unknown[] = [null, undefined, 0, false, Number.NaN, ''];
    const truthyValues: unknown[] = [7, 'x', true, Symbol('owner'), BigInt(1)];

    try {
      for (const value of falsyValues) {
        assert.ok(Object.is(store.retain(value, model, creator), value));
      }
      for (const value of truthyValues) {
        assert.throws(() => store.retain(value, model, creator), TypeError);
      }
      for (const value of [...falsyValues, ...truthyValues]) {
        assert.throws(() => store.release(value), TypeError);
        assert.throws(() => store.reuse(value, undefined), TypeError);
        assert.throws(() => store.reuse(value, model), TypeError);
      }
    } finally {
      store.dispose();
    }
  });

  it('preserves object, function, KO, collection and models-only contracts', () => {
    const store = new Store();
    const objectModel = new Backbone.Model();
    const functionModel = new Backbone.Model();
    const koModel = new Backbone.Model();
    const modelsOnlyModel = new Backbone.Model();
    const objectOwner = {};
    const functionOwner = () => undefined;
    const objectCreator = () => objectOwner;
    const functionCreator = () => functionOwner;
    let koCalls = 0;
    let koDisposals = 0;
    const koCreator = () => {
      koCalls++;
      const value = ko.observable('value') as ko.Observable<string> & { dispose(): void };
      value.dispose = () => {
        koDisposals++;
      };
      return value;
    };
    let modelsOnlyCalls = 0;
    const modelsOnlyCreator = {
      modelsOnly: true,
      create() {
        modelsOnlyCalls++;
        return {};
      },
    };
    const collection = new Backbone.Collection();
    const collectionOwner = collectionObservable(collection, { modelsOnly: true });

    try {
      assert.strictEqual(store.retainOrCreate(objectModel, { creator: objectCreator }), objectOwner);
      assert.strictEqual(store.retainOrCreate(objectModel, { creator: objectCreator }), objectOwner);
      assert.strictEqual(store.retainOrCreate(functionModel, { creator: functionCreator }), functionOwner);
      assert.strictEqual(store.retainOrCreate(functionModel, { creator: functionCreator }), functionOwner);

      const firstKo = store.retainOrCreate(koModel, { creator: koCreator });
      const secondKo = store.retainOrCreate(koModel, { creator: koCreator });
      assert.notStrictEqual(secondKo, firstKo);
      assert.strictEqual(koCalls, 2);
      assert.strictEqual(store.find(koModel, koCreator), null);
      assert.throws(() => store.reuse(firstKo, koModel), UnexpectedValueError);
      store.release(firstKo);
      store.release(secondKo);
      assert.strictEqual(koDisposals, 2);

      assert.strictEqual(store.retain(collectionOwner, collection, objectCreator), collectionOwner);
      assert.throws(() => store.reuse(collectionOwner, objectModel), UnexpectedValueError);
      assert.strictEqual(store.find(collection, objectCreator), null);
      assert.strictEqual(store.retainOrCreate(modelsOnlyModel, { creator: modelsOnlyCreator }), modelsOnlyModel);
      assert.strictEqual(modelsOnlyCalls, 0);
    } finally {
      collectionOwner.dispose();
      store.dispose();
    }
  });

  it('preserves shared references and final disposal', () => {
    const store = new Store();
    const model = new Backbone.Model();
    let disposed = 0;
    const creator = () => ({
      dispose() {
        disposed++;
      },
    });
    const owner = store.retainOrCreate(model, { creator }) as ReturnType<typeof creator>;
    const references = get<StoreReference[]>(owner, 'stores_references');

    assert.ok(references);
    store.retain(owner, model, creator);
    assert.strictEqual(references[0].ref_count, 2);
    store.release(owner);
    assert.strictEqual(references[0].ref_count, 1);
    assert.strictEqual(store.find(model, creator), owner);
    assert.strictEqual(disposed, 0);
    store.dispose();
    assert.strictEqual(disposed, 1);
    assert.strictEqual(references.length, 0);
  });

  it('records whether each Store call created or retained its result', () => {
    const previousSetting = settings.deep_retain;
    settings.deep_retain = true;
    const store = new Store();
    const model = new Backbone.Model();
    const creator = () => ({ dispose() {} });
    try {
      const created: StoreRetainState = { created: false, retained: false };
      const owner = store.retainOrCreate(model, { creator }, true, created);
      assert.strictEqual(created.created, true);
      assert.strictEqual(created.retained, true);
      assert.strictEqual(created.value, owner);

      const borrowed: StoreRetainState = { created: false, retained: false };
      assert.strictEqual(store.retainOrCreate(model, { creator }, false, borrowed), owner);
      assert.strictEqual(borrowed.created, false);
      assert.strictEqual(borrowed.retained, false);
      assert.strictEqual(borrowed.value, owner);

      const retained: StoreRetainState = { created: false, retained: false };
      assert.strictEqual(store.retainOrCreate(model, { creator }, true, retained), owner);
      assert.strictEqual(retained.created, false);
      assert.strictEqual(retained.retained, true);
      assert.strictEqual(retained.value, owner);

      const koState: StoreRetainState = { created: false, retained: false };
      const koOwner = store.retainOrCreate(new Backbone.Model(), { creator: () => ko.observable('value') }, true, koState);
      assert.strictEqual(koState.created, true);
      assert.strictEqual(koState.retained, false);
      assert.strictEqual(koState.value, koOwner);

      store.release(owner);
      store.release(owner);
    } finally {
      settings.deep_retain = previousSetting;
      store.dispose();
    }
  });

  it('prepares a reversible move without changing cache metadata and can roll back or commit', () => {
    const store = new Store();
    const first = new Backbone.Model({ id: 'first' });
    const second = new Backbone.Model({ id: 'second' });
    let disposals = 0;
    const creator = () => ({
      dispose() {
        disposals++;
      },
    });
    const owner = store.retainOrCreate(first, { creator });
    assert.ok(typeof owner === 'object' && owner !== null);

    const state: StoreRetainState = { created: false, retained: false };
    store.retain(owner, second, creator, state);
    assert.strictEqual(state.retained, true);
    assert.strictEqual(typeof state.rollback, 'function');
    assert.strictEqual(typeof state.commit, 'function');
    assert.strictEqual(store.find(first, creator), owner);
    assert.strictEqual(store.find(second, creator), null);
    assert.strictEqual(getObject(owner), first);
    assert.strictEqual(get<StoreReference[]>(owner, 'stores_references')?.[0].ref_count, 2);
    state.rollback?.();
    assert.strictEqual(state.retained, false);
    assert.strictEqual(store.find(first, creator), owner);
    assert.strictEqual(store.find(second, creator), null);
    assert.strictEqual(get<StoreReference[]>(owner, 'stores_references')?.[0].ref_count, 1);

    const committed: StoreRetainState = { created: false, retained: false };
    store.retain(owner, second, creator, committed);
    committed.commit?.();
    committed.publish?.();
    store.release(owner);
    assert.strictEqual(store.find(first, creator), null);
    assert.strictEqual(store.find(second, creator), owner);
    store.release(owner);
    assert.strictEqual(disposals, 1);
    store.dispose();
    assert.strictEqual(disposals, 1);
  });

  it('keeps committed move cleanup active until publication or cancellation', () => {
    const store = new Store();
    const first = new Backbone.Model({ id: 'first' });
    const second = new Backbone.Model({ id: 'second' });
    const third = new Backbone.Model({ id: 'third' });
    const disposals: string[] = [];
    const creator = () => ({});
    const moved = {
      dispose() {
        disposals.push('moved');
      },
    };
    const intervening = {
      dispose() {
        disposals.push('intervening');
      },
    };
    store.retain(moved, first, creator);
    const state: StoreRetainState = { created: false, retained: false };
    store.retain(moved, second, creator, state);
    state.commit?.();

    assert.strictEqual(store.find(first, creator), null);
    assert.strictEqual(store.find(second, creator), moved);
    assert.strictEqual(get<StoreReference[]>(moved, 'stores_references')?.[0].ref_count, 2);
    assert.throws(() => store.retain(moved, third, creator), UnexpectedValueError);
    assert.throws(() => store.release(moved), UnexpectedValueError);
    assert.throws(() => store.retain(intervening, second, creator), UnexpectedValueError);
    assert.strictEqual(get<StoreReference[]>(intervening, 'stores_references'), undefined);

    state.rollback?.();
    assert.strictEqual(state.retained, false);
    assert.strictEqual(store.find(first, creator), null);
    assert.strictEqual(store.find(second, creator), moved);
    assert.strictEqual(get<StoreReference[]>(moved, 'stores_references')?.[0].ref_count, 1);
    store.release(moved);
    assert.strictEqual(store.find(second, creator), null);
    assert.deepStrictEqual(get<StoreReference[]>(moved, 'stores_references'), []);
    assert.deepStrictEqual(disposals, ['moved']);
    store.dispose();
    assert.deepStrictEqual(disposals, ['moved']);
  });

  it('marks force-cancelled receipts terminal before disposing their owners', () => {
    for (const operation of ['release', 'clear'] as const) {
      const store = new Store();
      const first = new Backbone.Model({ id: 'first' });
      const second = new Backbone.Model({ id: 'second' });
      let disposals = 0;
      const creator = () => ({});
      const owner = {
        dispose() {
          disposals++;
        },
      };
      store.retain(owner, first, creator);
      const state: StoreRetainState = { created: false, retained: false };
      store.retain(owner, second, creator, state);
      state.commit?.();

      assert.strictEqual(state.cancelled, false);
      if (operation === 'release') {
        store.release(owner, true);
      } else {
        store.clear();
      }
      assert.strictEqual(state.cancelled, true);
      assert.strictEqual(state.retained, false);
      assert.strictEqual(state.rollback, undefined);
      assert.strictEqual(state.commit, undefined);
      assert.strictEqual(state.publish, undefined);
      assert.strictEqual(store.find(first, creator), null);
      assert.strictEqual(store.find(second, creator), null);
      assert.deepStrictEqual(get<StoreReference[]>(owner, 'stores_references'), []);
      assert.strictEqual(disposals, 1);
      store.dispose();
      assert.strictEqual(disposals, 1);
    }
  });

  it('rejects an occupied reversible destination before changing either owner', () => {
    const store = new Store();
    const first = new Backbone.Model({ id: 'first' });
    const second = new Backbone.Model({ id: 'second' });
    const disposals: string[] = [];
    const creator = () => ({});
    const firstOwner = {
      dispose() {
        disposals.push('first');
      },
    };
    const secondOwner = {
      dispose() {
        disposals.push('second');
      },
    };
    store.retain(firstOwner, first, creator);
    store.retain(secondOwner, second, creator);
    const state: StoreRetainState = { created: false, retained: false };

    assert.throws(() => store.retain(firstOwner, second, creator, state), UnexpectedValueError);
    assert.strictEqual(store.find(first, creator), firstOwner);
    assert.strictEqual(store.find(second, creator), secondOwner);
    assert.strictEqual(get<StoreReference[]>(firstOwner, 'stores_references')?.[0].ref_count, 1);
    assert.strictEqual(get<StoreReference[]>(secondOwner, 'stores_references')?.[0].ref_count, 1);
    assert.strictEqual(state.retained, false);
    assert.strictEqual(state.rollback, undefined);
    assert.deepStrictEqual(store.replaced_observables, []);

    store.release(firstOwner);
    store.release(secondOwner);
    store.dispose();
    assert.deepStrictEqual(disposals, ['first', 'second']);
  });

  it('rejects retain and release while a reversible move is pending', () => {
    const store = new Store();
    const first = new Backbone.Model({ id: 'first' });
    const second = new Backbone.Model({ id: 'second' });
    let disposals = 0;
    const creator = () => ({});
    const moved = {
      dispose() {
        disposals++;
      },
    };
    store.retain(moved, first, creator);
    const state: StoreRetainState = { created: false, retained: false };
    store.retain(moved, second, creator, state);

    assert.throws(() => store.retain(moved, second, creator), UnexpectedValueError);
    assert.throws(() => store.release(moved), UnexpectedValueError);
    assert.strictEqual(store.find(first, creator), moved);
    assert.strictEqual(store.find(second, creator), null);
    assert.strictEqual(get<StoreReference[]>(moved, 'stores_references')?.[0].ref_count, 2);
    assert.strictEqual(state.retained, true);
    assert.deepStrictEqual(store.replaced_observables, []);

    state.rollback?.();
    assert.strictEqual(get<StoreReference[]>(moved, 'stores_references')?.[0].ref_count, 1);
    store.release(moved);
    store.dispose();
    assert.strictEqual(disposals, 1);
  });

  it('does not overwrite an owner that takes the source of a pending move', () => {
    const store = new Store();
    const first = new Backbone.Model({ id: 'first' });
    const second = new Backbone.Model({ id: 'second' });
    const disposals: string[] = [];
    const creator = () => ({});
    const moved = {
      dispose() {
        disposals.push('moved');
      },
    };
    const intervening = {
      dispose() {
        disposals.push('intervening');
      },
    };
    store.retain(moved, first, creator);
    const state: StoreRetainState = { created: false, retained: false };
    store.retain(moved, second, creator, state);
    store.retain(intervening, first, creator);

    assert.throws(() => state.commit?.(true), UnexpectedValueError);
    assert.throws(() => state.rollback?.(), UnexpectedValueError);
    assert.strictEqual(store.find(first, creator), intervening);
    assert.strictEqual(store.find(second, creator), null);
    assert.strictEqual(get<StoreReference[]>(moved, 'stores_references')?.length, 0);
    assert.strictEqual(get<StoreReference[]>(intervening, 'stores_references')?.[0].ref_count, 1);
    assert.strictEqual(state.retained, false);
    assert.deepStrictEqual(store.replaced_observables, [moved]);

    store.dispose();
    assert.deepStrictEqual(disposals, ['intervening', 'moved']);
  });

  it('keeps a newer destination owner when pending commit fails', () => {
    const store = new Store();
    const first = new Backbone.Model({ id: 'first' });
    const second = new Backbone.Model({ id: 'second' });
    const disposals: string[] = [];
    const creator = () => ({});
    const moved = {
      dispose() {
        disposals.push('moved');
      },
    };
    const intervening = {
      dispose() {
        disposals.push('intervening');
      },
    };
    store.retain(moved, first, creator);
    const state: StoreRetainState = { created: false, retained: false };
    store.retain(moved, second, creator, state);
    store.retain(intervening, second, creator);

    assert.throws(() => state.commit?.(), UnexpectedValueError);
    state.rollback?.();
    assert.strictEqual(store.find(first, creator), moved);
    assert.strictEqual(store.find(second, creator), intervening);
    assert.strictEqual(get<StoreReference[]>(moved, 'stores_references')?.[0].ref_count, 1);
    assert.strictEqual(get<StoreReference[]>(intervening, 'stores_references')?.[0].ref_count, 1);
    assert.strictEqual(state.retained, false);
    assert.deepStrictEqual(store.replaced_observables, []);

    store.release(moved);
    store.release(intervening);
    store.dispose();
    assert.deepStrictEqual(disposals, ['moved', 'intervening']);
  });

  it('rejects effectful move metadata before mutation and rechecks it before commit', () => {
    for (const key of ['object', 'creator'] as const) {
      for (const installBeforeRetain of [true, false]) {
        const store = new Store();
        const first = new Backbone.Model({ id: 'first' });
        const second = new Backbone.Model({ id: 'second' });
        let disposals = 0;
        let setterCalls = 0;
        const creator = () => ({});
        const owner = {
          dispose() {
            disposals++;
          },
        };
        store.retain(owner, first, creator);
        const metadata = getKnockbackMetadata(owner);
        const original = Object.getOwnPropertyDescriptor(metadata, key);
        assert.ok(original && 'value' in original);
        let backing = original.value;
        const install = () =>
          Object.defineProperty(metadata, key, {
            configurable: true,
            enumerable: true,
            get() {
              return backing;
            },
            set(next) {
              setterCalls++;
              backing = next;
              throw new RangeError(`${key} setter called`);
            },
          });
        if (installBeforeRetain) install();
        const state: StoreRetainState = { created: false, retained: false };

        if (installBeforeRetain) {
          assert.throws(() => store.retain(owner, second, creator, state), TypeError);
        } else {
          store.retain(owner, second, creator, state);
          install();
          assert.throws(() => state.commit?.(), UnexpectedValueError);
          state.rollback?.();
        }
        assert.strictEqual(setterCalls, 0);
        assert.strictEqual(store.find(first, creator), owner);
        assert.strictEqual(store.find(second, creator), null);
        assert.strictEqual(get<StoreReference[]>(owner, 'stores_references')?.[0].ref_count, 1);
        assert.deepStrictEqual(store.replaced_observables, []);

        Object.defineProperty(metadata, key, { ...original, value: backing });
        store.release(owner);
        store.dispose();
        assert.strictEqual(disposals, 1);
      }
    }
  });
});
