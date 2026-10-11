import assert from 'assert';
import Backbone from 'backbone';
import ModelRef from 'backbone-modelref';
import ko from 'knockout';
import { KB_DISPOSE_STATE } from '../../src/constants.ts';
import { UnexpectedValueError } from '../../src/errors/index.ts';
import { Factory } from '../../src/factory.ts';
import type { Creator, CreatorObject } from '../../src/internal-types.ts';
import { settings } from '../../src/kb.ts';
import { observable } from '../../src/observable.ts';
import { Store } from '../../src/store.ts';
import { TypedValue } from '../../src/typed-value.ts';
import { wrappedCreator, wrappedObject } from '../../src/utils.ts';
import { getKnockbackMetadata } from '../lib/knockback-metadata.ts';

function createTypedValue(creator: Creator, store?: Store): TypedValue {
  const factory = new Factory();
  factory.addPathMapping('value', creator);
  return new TypedValue({ factory, path: 'value', store });
}

function referenceCount(value: unknown): number | null {
  if (!value || (typeof value !== 'object' && typeof value !== 'function')) return null;
  const references = (value as { __kb?: { stores_references?: Array<{ ref_count: number }> } }).__kb?.stores_references;
  return references?.reduce((total, reference) => total + reference.ref_count, 0) ?? null;
}

function recordCount(store?: Store): number | null {
  return store ? Object.values(store.observable_records).reduce((total, records) => total + Object.keys(records).length, 0) : null;
}

function createOwner(kind: 'object' | 'callable' | 'ko', onDispose: () => void): object {
  if (kind === 'callable') {
    const owner = (() => undefined) as (() => void) & { dispose(): void };
    owner.dispose = onDispose;
    return owner;
  }
  if (kind === 'ko') {
    const owner = ko.observable('value') as ko.Observable<string> & { dispose(): void };
    owner.dispose = onDispose;
    return owner;
  }
  return { dispose: onDispose };
}

describe('TypedValue', () => {
  it('calls an inherited create method with its creator receiver', () => {
    const model = new Backbone.Model();
    const creator: CreatorObject<{ model: unknown }> = Object.create({
      create(this: unknown, obj: unknown) {
        assert.strictEqual(this, creator);
        return { model: obj };
      },
    });
    const typedValue = createTypedValue(creator);

    try {
      typedValue.update(model);
      assert.strictEqual((typedValue.rawValue() as { model: unknown }).model, model);
    } finally {
      typedValue.dispose();
    }
  });

  it('dispatches constructors and arrow creators', () => {
    const constructorModel = new Backbone.Model();
    const arrowModel = new Backbone.Model();

    class ConstructorCreator {
      model: unknown;

      constructor(obj: unknown) {
        this.model = obj;
      }
    }

    const constructed = createTypedValue(ConstructorCreator);
    const called = createTypedValue((obj: unknown) => ({ model: obj }));

    try {
      constructed.update(constructorModel);
      called.update(arrowModel);
      assert.ok(constructed.rawValue() instanceof ConstructorCreator);
      assert.strictEqual((constructed.rawValue() as ConstructorCreator).model, constructorModel);
      assert.strictEqual((called.rawValue() as { model: unknown }).model, arrowModel);
    } finally {
      constructed.dispose();
      called.dispose();
    }
  });

  it('preserves true and false object creator flags without a store', () => {
    const modelsOnlyModel = new Backbone.Model();
    const createdModel = new Backbone.Model();
    const inheritedModelsOnlyModel = new Backbone.Model();
    const inheritedCreatedModel = new Backbone.Model();
    let trueFlagCalls = 0;
    let falseFlagCalls = 0;
    let inheritedTrueFlagCalls = 0;
    let inheritedFalseFlagCalls = 0;
    const modelsOnly = createTypedValue({
      modelsOnly: true,
      create() {
        trueFlagCalls++;
        return {};
      },
    });
    const creating = createTypedValue({
      modelsOnly: false,
      create(obj: unknown) {
        falseFlagCalls++;
        return { model: obj };
      },
    });
    const inheritedModelsOnly = createTypedValue(
      Object.assign(Object.create({ modelsOnly: true }), {
        create() {
          inheritedTrueFlagCalls++;
          return {};
        },
      })
    );
    const inheritedCreatingCreator = Object.assign(Object.create({ modelsOnly: false }), {
      create(this: unknown, obj: unknown) {
        inheritedFalseFlagCalls++;
        assert.strictEqual(this, inheritedCreatingCreator);
        return { model: obj };
      },
    });
    const inheritedCreating = createTypedValue(inheritedCreatingCreator);

    try {
      modelsOnly.update(modelsOnlyModel);
      creating.update(createdModel);
      inheritedModelsOnly.update(inheritedModelsOnlyModel);
      inheritedCreating.update(inheritedCreatedModel);
      assert.strictEqual(modelsOnly.rawValue(), modelsOnlyModel);
      assert.strictEqual((creating.rawValue() as { model: unknown }).model, createdModel);
      assert.strictEqual(inheritedModelsOnly.rawValue(), inheritedModelsOnlyModel);
      assert.strictEqual((inheritedCreating.rawValue() as { model: unknown }).model, inheritedCreatedModel);
      assert.strictEqual(trueFlagCalls, 0);
      assert.strictEqual(falseFlagCalls, 1);
      assert.strictEqual(inheritedTrueFlagCalls, 0);
      assert.strictEqual(inheritedFalseFlagCalls, 1);
    } finally {
      modelsOnly.dispose();
      creating.dispose();
      inheritedModelsOnly.dispose();
      inheritedCreating.dispose();
    }
  });

  it('preserves the callable models-only Store and no-store split', () => {
    const store = new Store();
    const storedModel = new Backbone.Model();
    const directModel = new Backbone.Model();
    const inheritedStoredModel = new Backbone.Model();
    const inheritedDirectModel = new Backbone.Model();
    let calls = 0;
    let inheritedCalls = 0;
    const creator = Object.assign(
      (obj: unknown) => {
        calls++;
        return { model: obj };
      },
      { modelsOnly: true }
    );
    const inheritedCreator = Object.setPrototypeOf(
      (obj: unknown) => {
        inheritedCalls++;
        return { model: obj };
      },
      { modelsOnly: true }
    );
    const stored = createTypedValue(creator, store);
    const direct = createTypedValue(creator);
    const inheritedStored = createTypedValue(inheritedCreator, store);
    const inheritedDirect = createTypedValue(inheritedCreator);

    try {
      stored.update(storedModel);
      direct.update(directModel);
      inheritedStored.update(inheritedStoredModel);
      inheritedDirect.update(inheritedDirectModel);
      assert.strictEqual(stored.rawValue(), storedModel);
      assert.strictEqual((direct.rawValue() as { model: unknown }).model, directModel);
      assert.strictEqual(inheritedStored.rawValue(), inheritedStoredModel);
      assert.strictEqual((inheritedDirect.rawValue() as { model: unknown }).model, inheritedDirectModel);
      assert.strictEqual(calls, 1);
      assert.strictEqual(inheritedCalls, 1);
    } finally {
      stored.dispose();
      direct.dispose();
      inheritedStored.dispose();
      inheritedDirect.dispose();
      store.dispose();
    }
  });

  it('throws TypeError synchronously for bare and malformed creators without a store', () => {
    for (const creator of [{ modelsOnly: true }, {}]) {
      const typedValue = createTypedValue(creator);
      try {
        assert.throws(() => typedValue.update(new Backbone.Model()), TypeError);
      } finally {
        typedValue.dispose();
      }
    }
  });

  it('preserves the prior owner after rejected or throwing replacement', () => {
    for (const withStore of [false, true]) {
      for (const failure of ['invalid', 'throw'] as const) {
        let mode: 'valid' | typeof failure = 'valid';
        let disposals = 0;
        const creator = () => {
          if (mode === 'throw') throw new RangeError('creator failed');
          if (mode === 'invalid') return 7;
          return {
            dispose() {
              disposals++;
            },
          };
        };
        const store = withStore ? new Store() : undefined;
        const typedValue = createTypedValue(creator, store);
        try {
          typedValue.update(new Backbone.Model({ id: 'previous' }));
          const previous = typedValue.rawValue();
          const previousType = typedValue.value_type;
          mode = failure;

          assert.throws(() => typedValue.update(new Backbone.Model({ id: 'rejected' })), failure === 'throw' ? RangeError : TypeError);
          assert.strictEqual(typedValue.rawValue(), previous);
          assert.strictEqual(typedValue.value(), previous);
          assert.strictEqual(typedValue.value_type, previousType);
          assert.strictEqual(referenceCount(previous), withStore ? 1 : null);
          assert.strictEqual(recordCount(store), withStore ? 1 : null);
          assert.strictEqual(disposals, 0);
        } finally {
          typedValue.dispose();
          store?.dispose();
        }
        assert.strictEqual(disposals, 1);
      }
    }
  });

  it('preserves shared Store references after rejected or throwing replacement', () => {
    for (const failure of ['invalid', 'throw'] as const) {
      let mode: 'valid' | typeof failure = 'valid';
      let disposals = 0;
      const creator = () => {
        if (mode === 'throw') throw new RangeError('creator failed');
        if (mode === 'invalid') return 7;
        return {
          dispose() {
            disposals++;
          },
        };
      };
      const store = new Store();
      const typedValue = createTypedValue(creator, store);
      const previousModel = new Backbone.Model({ id: 'previous' });
      typedValue.update(previousModel);
      const previous = typedValue.rawValue();
      store.retain(previous, previousModel, creator);
      mode = failure;

      assert.throws(() => typedValue.update(new Backbone.Model({ id: 'rejected' })), failure === 'throw' ? RangeError : TypeError);
      assert.strictEqual(typedValue.rawValue(), previous);
      assert.strictEqual(referenceCount(previous), 2);
      assert.strictEqual(recordCount(store), 1);
      assert.strictEqual(store.replaced_observables.length, 0);

      typedValue.dispose();
      assert.strictEqual(referenceCount(previous), 1);
      assert.strictEqual(disposals, 0);
      store.release(previous);
      assert.strictEqual(referenceCount(previous), 0);
      assert.strictEqual(recordCount(store), 0);
      assert.strictEqual(disposals, 1);
      store.dispose();
    }
  });

  it('keeps successful object, callable and Knockout replacements balanced', () => {
    for (const withStore of [false, true]) {
      for (const kind of ['object', 'callable', 'ko'] as const) {
        let disposals = 0;
        const creator = () => createOwner(kind, () => disposals++);
        const store = withStore ? new Store() : undefined;
        const typedValue = createTypedValue(creator, store);
        try {
          typedValue.update(new Backbone.Model({ id: 'first' }));
          const previous = typedValue.rawValue();
          typedValue.update(new Backbone.Model({ id: 'second' }));
          const replacement = typedValue.rawValue();

          assert.notStrictEqual(replacement, previous);
          assert.strictEqual(disposals, 1);
          assert.strictEqual(referenceCount(previous), withStore && kind !== 'ko' ? 0 : null);
          assert.strictEqual(referenceCount(replacement), withStore && kind !== 'ko' ? 1 : null);
          assert.strictEqual(recordCount(store), withStore && kind !== 'ko' ? 1 : withStore ? 0 : null);
        } finally {
          typedValue.dispose();
          store?.dispose();
        }
        assert.strictEqual(disposals, 2);
      }
    }
  });

  it('balances a cached shared Store replacement', () => {
    let disposals = 0;
    const creator = () => ({
      dispose() {
        disposals++;
      },
    });
    const store = new Store();
    const typedValue = createTypedValue(creator, store);
    const firstModel = new Backbone.Model({ id: 'first' });
    const secondModel = new Backbone.Model({ id: 'second' });
    const previousDeepRetain = settings.deep_retain;
    settings.deep_retain = true;
    try {
      typedValue.update(firstModel);
      const previous = typedValue.rawValue();
      const cached = store.retainOrCreate(secondModel, { creator });
      typedValue.update(secondModel);

      assert.strictEqual(typedValue.rawValue(), cached);
      assert.strictEqual(referenceCount(previous), 0);
      assert.strictEqual(referenceCount(cached), 2);
      assert.strictEqual(recordCount(store), 1);
      assert.strictEqual(disposals, 1);

      typedValue.dispose();
      assert.strictEqual(referenceCount(cached), 1);
      assert.strictEqual(disposals, 1);
      store.release(cached);
      assert.strictEqual(referenceCount(cached), 0);
      assert.strictEqual(recordCount(store), 0);
      assert.strictEqual(disposals, 2);
    } finally {
      settings.deep_retain = previousDeepRetain;
      store.dispose();
    }
  });

  it('keeps initial failures empty and preserves the Store falsy fallback', () => {
    for (const withStore of [false, true]) {
      for (const failure of ['invalid', 'throw'] as const) {
        const store = withStore ? new Store() : undefined;
        const typedValue = createTypedValue(() => {
          if (failure === 'throw') throw new RangeError('creator failed');
          return 7;
        }, store);
        assert.throws(() => typedValue.update(new Backbone.Model()), failure === 'throw' ? RangeError : TypeError);
        assert.strictEqual(typedValue.rawValue(), undefined);
        assert.strictEqual(typedValue.value(), null);
        assert.strictEqual(typedValue.value_type, undefined);
        assert.strictEqual(recordCount(store), withStore ? 0 : null);
        typedValue.dispose();
        store?.dispose();
      }
    }

    for (const output of [null, 0, false]) {
      const direct = createTypedValue(() => output);
      assert.throws(() => direct.update(new Backbone.Model()), TypeError);
      assert.strictEqual(direct.rawValue(), undefined);
      assert.strictEqual(direct.value_type, undefined);
      direct.dispose();

      const store = new Store();
      const stored = createTypedValue(() => output, store);
      stored.update(new Backbone.Model());
      assert.ok(ko.isObservable(stored.rawValue()));
      assert.strictEqual(stored.value(), null);
      stored.dispose();
      store.dispose();
    }
  });

  it('rejects reentrant updates before changing the prior owner', () => {
    for (const withStore of [false, true]) {
      let typedValue: TypedValue;
      let reenter = false;
      let disposals = 0;
      const creator = () => {
        if (reenter) typedValue.update(new Backbone.Model({ id: 'inner' }));
        return {
          dispose() {
            disposals++;
          },
        };
      };
      const store = withStore ? new Store() : undefined;
      typedValue = createTypedValue(creator, store);
      typedValue.update(new Backbone.Model({ id: 'previous' }));
      const previous = typedValue.rawValue();
      reenter = true;

      assert.throws(() => typedValue.update(new Backbone.Model({ id: 'outer' })), UnexpectedValueError);
      assert.strictEqual(typedValue.rawValue(), previous);
      assert.strictEqual(typedValue.value(), previous);
      assert.strictEqual(referenceCount(previous), withStore ? 1 : null);
      assert.strictEqual(recordCount(store), withStore ? 1 : null);
      typedValue.dispose();
      store?.dispose();
      assert.strictEqual(disposals, 1);
    }
  });

  it('defers creator-triggered disposal and does not resurrect an owner', () => {
    for (const withStore of [false, true]) {
      let typedValue: TypedValue;
      let disposeDuringCreate = false;
      let disposals = 0;
      const creator = () => {
        if (disposeDuringCreate) typedValue.dispose();
        return {
          dispose() {
            disposals++;
          },
        };
      };
      const store = withStore ? new Store() : undefined;
      typedValue = createTypedValue(creator, store);
      typedValue.update(new Backbone.Model({ id: 'previous' }));
      disposeDuringCreate = true;
      typedValue.update(new Backbone.Model({ id: 'replacement' }));

      assert.strictEqual(typedValue.rawValue(), undefined);
      assert.strictEqual(recordCount(store), withStore ? 0 : null);
      assert.strictEqual(disposals, 2);
      store?.dispose();
    }

    for (const withStore of [false, true]) {
      for (const failure of ['invalid', 'throw'] as const) {
        let typedValue: TypedValue;
        let fail = false;
        let disposals = 0;
        const creator = () => {
          if (fail) {
            typedValue.dispose();
            if (failure === 'throw') throw new RangeError('creator failed');
            return 7;
          }
          return {
            dispose() {
              disposals++;
            },
          };
        };
        const store = withStore ? new Store() : undefined;
        typedValue = createTypedValue(creator, store);
        typedValue.update(new Backbone.Model({ id: 'previous' }));
        fail = true;

        assert.throws(() => typedValue.update(new Backbone.Model({ id: 'replacement' })), failure === 'throw' ? RangeError : TypeError);
        assert.strictEqual(typedValue.rawValue(), undefined);
        assert.strictEqual(recordCount(store), withStore ? 0 : null);
        assert.strictEqual(disposals, 1);
        store?.dispose();
      }
    }
  });

  it('allows committed notifications to replace the published owner', () => {
    for (const withStore of [false, true]) {
      const disposals: string[] = [];
      const creator = (model: unknown) => {
        const id = (model as Backbone.Model).id as string;
        return {
          id,
          dispose() {
            disposals.push(id);
          },
        };
      };
      const store = withStore ? new Store() : undefined;
      const typedValue = createTypedValue(creator, store);
      typedValue.update(new Backbone.Model({ id: 'first' }));
      const read = ko.computed(() => typedValue.value() as { id: string });
      const subscription = read.subscribe((owner) => {
        if (owner.id === 'second') typedValue.update(new Backbone.Model({ id: 'third' }));
      });

      try {
        typedValue.update(new Backbone.Model({ id: 'second' }));
        assert.strictEqual((typedValue.rawValue() as { id: string }).id, 'third');
        assert.strictEqual((typedValue.value() as { id: string }).id, 'third');
        assert.deepStrictEqual(disposals, ['first', 'second']);
        assert.strictEqual(recordCount(store), withStore ? 1 : null);
      } finally {
        subscription.dispose();
        read.dispose();
        typedValue.dispose();
        store?.dispose();
      }
      assert.deepStrictEqual(disposals, ['first', 'second', 'third']);
    }
  });

  it('keeps a notification replacement when its subscriber throws', () => {
    for (const withStore of [false, true]) {
      const disposals: string[] = [];
      const creator = (model: unknown) => {
        const id = (model as Backbone.Model).id as string;
        return {
          id,
          dispose() {
            disposals.push(id);
          },
        };
      };
      const store = withStore ? new Store() : undefined;
      const typedValue = createTypedValue(creator, store);
      typedValue.update(new Backbone.Model({ id: 'first' }));
      const read = ko.computed(() => typedValue.value() as { id: string });
      const subscription = read.subscribe((owner) => {
        if (owner.id !== 'second') return;
        typedValue.update(new Backbone.Model({ id: 'third' }));
        throw new SyntaxError('subscriber failed');
      });

      try {
        assert.throws(() => typedValue.update(new Backbone.Model({ id: 'second' })), SyntaxError);
        assert.strictEqual((typedValue.rawValue() as { id: string }).id, 'third');
        assert.strictEqual((typedValue.value() as { id: string }).id, 'third');
        assert.deepStrictEqual(disposals, ['first', 'second']);
      } finally {
        subscription.dispose();
        read.dispose();
        typedValue.dispose();
        store?.dispose();
      }
      assert.deepStrictEqual(disposals, ['first', 'second', 'third']);
    }
  });

  it('releases only a reference acquired while validating a cached owner', () => {
    for (const deepRetain of [false, true]) {
      const previousSetting = settings.deep_retain;
      settings.deep_retain = deepRetain;
      const disposals: string[] = [];
      const creator = (model: unknown) => {
        const id = (model as Backbone.Model).id as string;
        return {
          id,
          dispose() {
            disposals.push(id);
          },
        };
      };
      const store = new Store();
      const typedValue = createTypedValue(creator, store);
      try {
        typedValue.update(new Backbone.Model({ id: 'prior' }));
        const prior = typedValue.rawValue();
        const cachedModel = new Backbone.Model({ id: 'cached' });
        const cached = store.retainOrCreate(cachedModel, { creator }) as { __kb: { object: unknown } };
        Object.defineProperty(cached.__kb, 'object', { writable: false });

        assert.throws(() => typedValue.update(cachedModel), TypeError);
        assert.strictEqual(typedValue.rawValue(), prior);
        assert.strictEqual(typedValue.value(), prior);
        assert.strictEqual(referenceCount(cached), 1);
        assert.strictEqual(store.find(cachedModel, creator), cached);

        Object.defineProperty(cached.__kb, 'object', { writable: true });
        typedValue.dispose();
        assert.strictEqual(referenceCount(cached), 1);
        assert.deepStrictEqual(disposals, ['prior']);
      } finally {
        settings.deep_retain = previousSetting;
        store.dispose();
      }
      assert.deepStrictEqual(disposals, ['prior', 'cached']);
    }
  });

  it('does not let outer notification cleanup overwrite nested disposal', () => {
    for (const withStore of [false, true]) {
      const disposals: string[] = [];
      let typedValue: TypedValue;
      const creator = (model: unknown) => {
        const id = (model as Backbone.Model).id as string;
        if (id === 'third') typedValue.dispose();
        return {
          id,
          dispose() {
            disposals.push(id);
          },
        };
      };
      const store = withStore ? new Store() : undefined;
      typedValue = createTypedValue(creator, store);
      typedValue.update(new Backbone.Model({ id: 'first' }));
      const read = ko.computed(() => typedValue.value() as { id: string });
      const subscription = read.subscribe((owner) => {
        if (owner.id === 'second') typedValue.update(new Backbone.Model({ id: 'third' }));
      });

      typedValue.update(new Backbone.Model({ id: 'second' }));
      assert.strictEqual(typedValue.rawValue(), undefined);
      assert.strictEqual((typedValue.value() as { id: string }).id, 'second');
      assert.strictEqual(recordCount(store), withStore ? 0 : null);
      assert.deepStrictEqual(disposals, ['first', 'third', 'second']);
      subscription.dispose();
      read.dispose();
      store?.dispose();
    }
  });

  it('reports preparation and cleanup failures without replacing the prior owner', () => {
    let mode: 'prior' | 'bad' = 'prior';
    const disposals: string[] = [];
    const typedValue = createTypedValue((model: unknown) => {
      if (mode === 'bad') {
        return {
          __kb: Object.freeze({}),
          dispose() {
            disposals.push('bad');
            throw new RangeError('cleanup failed');
          },
        };
      }
      const id = (model as Backbone.Model).id as string;
      return {
        id,
        dispose() {
          disposals.push(id);
        },
      };
    });
    typedValue.update(new Backbone.Model({ id: 'prior' }));
    const prior = typedValue.rawValue();
    mode = 'bad';

    let caught: unknown;
    try {
      typedValue.update(new Backbone.Model({ id: 'next' }));
    } catch (error) {
      caught = error;
    }
    assert.ok(caught instanceof AggregateError);
    assert.strictEqual(caught.errors[0] instanceof TypeError, true);
    assert.strictEqual(caught.errors[1] instanceof RangeError, true);
    assert.strictEqual(typedValue.rawValue(), prior);
    assert.strictEqual(typedValue.value(), prior);
    assert.deepStrictEqual(disposals, ['bad']);
    typedValue.dispose();
    assert.deepStrictEqual(disposals, ['bad', 'prior']);
  });

  it('does not dispose a creator result that aliases the prior owner', () => {
    for (const withStore of [false, true]) {
      for (const kind of ['object', 'callable'] as const) {
        let cancel = false;
        let disposals = 0;
        let typedValue: TypedValue;
        const owner = createOwner(kind, () => disposals++);
        const creator = () => {
          if (cancel) typedValue.dispose();
          return owner;
        };
        const store = withStore ? new Store() : undefined;
        typedValue = createTypedValue(creator, store);
        typedValue.update(new Backbone.Model({ id: 'first' }));
        const metadata = (owner as { __kb: { object: unknown } }).__kb;
        Object.defineProperty(metadata, 'object', { writable: false });

        assert.throws(() => typedValue.update(new Backbone.Model({ id: 'rejected' })), TypeError);
        assert.strictEqual(typedValue.rawValue(), owner);
        assert.strictEqual(typedValue.value(), owner);
        assert.strictEqual(disposals, 0);
        Object.defineProperty(metadata, 'object', { writable: true });

        cancel = true;
        typedValue.update(new Backbone.Model({ id: 'cancelled' }));
        assert.strictEqual(typedValue.rawValue(), undefined);
        assert.strictEqual(recordCount(store), withStore ? 0 : null);
        assert.strictEqual(disposals, 1);
        typedValue.dispose();
        store?.dispose();
        assert.strictEqual(disposals, 1);
      }
    }
  });

  it('moves a successful Store alias without leaving a stale cache record', () => {
    for (const shared of [false, true]) {
      const store = new Store();
      let disposals = 0;
      const owner = {
        dispose() {
          disposals++;
        },
      };
      const creator = () => owner;
      const typedValue = createTypedValue(creator, store);
      const first = new Backbone.Model({ id: 'first' });
      const second = new Backbone.Model({ id: 'second' });
      typedValue.update(first);
      if (shared) store.retain(owner, first, creator);

      typedValue.update(second);
      assert.strictEqual(typedValue.rawValue(), owner);
      assert.strictEqual(store.find(first, creator), null);
      assert.strictEqual(store.find(second, creator), owner);
      assert.strictEqual(recordCount(store), 1);
      assert.strictEqual(referenceCount(owner), shared ? 2 : 1);

      typedValue.dispose();
      if (shared) store.release(owner);
      assert.strictEqual(recordCount(store), 0);
      assert.strictEqual(disposals, 1);
      store.dispose();
      assert.strictEqual(disposals, 1);
    }
  });

  it('cleans a committed external candidate when prior release fails or cancels publication', () => {
    for (const action of ['throw', 'dispose'] as const) {
      const store = new Store();
      const factory = new Factory();
      const first = new Backbone.Model({ id: 'first' });
      const second = new Backbone.Model({ id: 'second' });
      const external = new Backbone.Model({ id: 'external' });
      const disposals: string[] = [];
      const failure = new RangeError('prior release failed');
      let failOnce = true;
      let typedValue: TypedValue;
      const prior = {
        dispose() {
          disposals.push('prior');
          if (action === 'throw' && failOnce) {
            failOnce = false;
            throw failure;
          }
          typedValue.dispose();
        },
      };
      const candidate = {
        dispose() {
          disposals.push('candidate');
        },
      };
      const creator = (model: unknown) => (model === first ? prior : candidate);
      factory.addPathMapping('value', creator);
      store.retain(candidate, external, creator);
      typedValue = new TypedValue({ factory, path: 'value', store });
      typedValue.update(first);

      if (action === 'throw') {
        assert.throws(
          () => typedValue.update(second),
          (error: unknown) => error === failure
        );
        assert.strictEqual(typedValue.rawValue(), prior);
      } else {
        typedValue.update(second);
        assert.strictEqual(typedValue.rawValue(), undefined);
      }
      assert.strictEqual(referenceCount(candidate), 1);
      assert.strictEqual(store.find(external, creator), null);
      assert.strictEqual(store.find(second, creator), candidate);
      typedValue.dispose();
      store.release(candidate);
      assert.strictEqual(referenceCount(candidate), 0);
      assert.strictEqual(recordCount(store), 0);
      assert.deepStrictEqual(disposals, action === 'throw' ? ['prior', 'prior', 'candidate'] : ['prior', 'candidate']);
      store.dispose();
      assert.deepStrictEqual(disposals, action === 'throw' ? ['prior', 'prior', 'candidate'] : ['prior', 'candidate']);
    }
  });

  it('ends replacement when Store force-cancels the candidate before publication', () => {
    for (const operation of ['release', 'clear'] as const) {
      for (const outcome of ['success', 'throw', 'dispose'] as const) {
        const store = new Store();
        const factory = new Factory();
        const first = new Backbone.Model({ id: 'first' });
        const second = new Backbone.Model({ id: 'second' });
        const external = new Backbone.Model({ id: 'external' });
        const disposals: string[] = [];
        const failure = new RangeError('prior release failed');
        let typedValue: TypedValue;
        const candidate = {
          dispose() {
            disposals.push('candidate');
          },
        };
        const prior = {
          dispose() {
            disposals.push('prior');
            if (operation === 'release') store.release(candidate, true);
            else store.clear();
            if (outcome === 'throw') throw failure;
            if (outcome === 'dispose') typedValue.dispose();
          },
        };
        const creator = (model: unknown) => (model === first ? prior : candidate);
        factory.addPathMapping('value', creator);
        store.retain(candidate, external, creator);
        typedValue = new TypedValue({ factory, path: 'value', store });
        typedValue.update(first);
        const previousType = typedValue.value_type;
        const read = ko.computed(() => typedValue.value());
        const notifications: unknown[] = [];
        const subscription = read.subscribe((value) => notifications.push(value));

        try {
          if (outcome === 'throw') {
            assert.throws(
              () => typedValue.update(second),
              (error: unknown) => error === failure
            );
          } else {
            typedValue.update(second);
          }
          assert.strictEqual(typedValue.rawValue(), undefined);
          assert.strictEqual(typedValue.value(), prior);
          assert.strictEqual(typedValue.value_type, previousType);
          assert.strictEqual(typedValue.create_options, undefined);
          assert.strictEqual(typedValue.__kb_dispose, KB_DISPOSE_STATE.DISPOSED);
          assert.deepStrictEqual(notifications, []);
          assert.strictEqual(referenceCount(prior), 0);
          assert.strictEqual(referenceCount(candidate), 0);
          assert.strictEqual(store.find(external, creator), null);
          assert.strictEqual(store.find(second, creator), null);
          assert.strictEqual(recordCount(store), 0);
          assert.deepStrictEqual(disposals, ['prior', 'candidate']);
          typedValue.dispose();
          assert.deepStrictEqual(disposals, ['prior', 'candidate']);
        } finally {
          subscription.dispose();
          read.dispose();
          store.dispose();
        }
        assert.deepStrictEqual(disposals, ['prior', 'candidate']);
      }
    }
  });

  it('publishes a committed external candidate with one new reference', () => {
    const store = new Store();
    const first = new Backbone.Model({ id: 'first' });
    const second = new Backbone.Model({ id: 'second' });
    const external = new Backbone.Model({ id: 'external' });
    const disposals: string[] = [];
    const prior = {
      dispose() {
        disposals.push('prior');
      },
    };
    const candidate = {
      dispose() {
        disposals.push('candidate');
      },
    };
    const creator = (model: unknown) => (model === first ? prior : candidate);
    const typedValue = createTypedValue(creator, store);
    store.retain(candidate, external, creator);
    typedValue.update(first);
    typedValue.update(second);

    assert.strictEqual(typedValue.rawValue(), candidate);
    assert.strictEqual(store.find(external, creator), null);
    assert.strictEqual(store.find(second, creator), candidate);
    assert.strictEqual(referenceCount(candidate), 2);
    assert.deepStrictEqual(disposals, ['prior']);
    typedValue.dispose();
    assert.strictEqual(referenceCount(candidate), 1);
    store.release(candidate);
    assert.strictEqual(referenceCount(candidate), 0);
    assert.strictEqual(recordCount(store), 0);
    assert.deepStrictEqual(disposals, ['prior', 'candidate']);
    store.dispose();
    assert.deepStrictEqual(disposals, ['prior', 'candidate']);
  });

  it('cancels publication when disposal is requested during prior release', () => {
    for (const withStore of [false, true]) {
      for (const releaseThrows of [false, true]) {
        const disposals: string[] = [];
        let typedValue: TypedValue;
        const creator = (model: unknown) => {
          const id = (model as Backbone.Model).id as string;
          return {
            id,
            dispose() {
              disposals.push(id);
              if (id !== 'first') return;
              typedValue.dispose();
              if (releaseThrows) throw new RangeError('prior release failed');
            },
          };
        };
        const store = withStore ? new Store() : undefined;
        typedValue = createTypedValue(creator, store);
        typedValue.update(new Backbone.Model({ id: 'first' }));

        if (releaseThrows) {
          assert.throws(() => typedValue.update(new Backbone.Model({ id: 'second' })), RangeError);
        } else {
          typedValue.update(new Backbone.Model({ id: 'second' }));
        }
        assert.strictEqual(typedValue.rawValue(), undefined);
        assert.strictEqual(typedValue.create_options, undefined);
        assert.strictEqual(recordCount(store), withStore ? 0 : null);
        assert.deepStrictEqual(disposals, ['first', 'second']);
        typedValue.dispose();
        store?.dispose();
        assert.deepStrictEqual(disposals, ['first', 'second']);
      }
    }
  });

  it('blocks nested updates during prior release and preparation cleanup', () => {
    const releaseDisposals: string[] = [];
    let releaseValue: TypedValue;
    const releaseCreator = (model: unknown) => {
      const id = (model as Backbone.Model).id as string;
      return {
        id,
        dispose() {
          releaseDisposals.push(id);
          if (id === 'first') releaseValue.update(new Backbone.Model({ id: 'third' }));
        },
      };
    };
    releaseValue = createTypedValue(releaseCreator);
    releaseValue.update(new Backbone.Model({ id: 'first' }));
    const prior = releaseValue.rawValue();
    assert.throws(() => releaseValue.update(new Backbone.Model({ id: 'second' })), UnexpectedValueError);
    assert.strictEqual(releaseValue.rawValue(), prior);
    assert.strictEqual(releaseValue.value(), prior);
    assert.deepStrictEqual(releaseDisposals, ['first', 'second']);
    releaseValue.dispose();
    assert.deepStrictEqual(releaseDisposals, ['first', 'second', 'first']);

    const cleanupDisposals: string[] = [];
    let cleanupValue: TypedValue;
    let fail = false;
    cleanupValue = createTypedValue((model: unknown) => {
      if (fail) {
        return {
          __kb: Object.freeze({}),
          dispose() {
            cleanupDisposals.push('candidate');
            cleanupValue.update(new Backbone.Model({ id: 'third' }));
          },
        };
      }
      const id = (model as Backbone.Model).id as string;
      return {
        id,
        dispose() {
          cleanupDisposals.push(id);
        },
      };
    });
    cleanupValue.update(new Backbone.Model({ id: 'prior' }));
    const cleanupPrior = cleanupValue.rawValue();
    fail = true;
    let caught: unknown;
    try {
      cleanupValue.update(new Backbone.Model({ id: 'second' }));
    } catch (error) {
      caught = error;
    }
    assert.ok(caught instanceof AggregateError);
    assert.strictEqual(caught.errors[0] instanceof TypeError, true);
    assert.strictEqual(caught.errors[1] instanceof UnexpectedValueError, true);
    assert.strictEqual(cleanupValue.rawValue(), cleanupPrior);
    assert.strictEqual(cleanupValue.value(), cleanupPrior);
    cleanupValue.dispose();
    assert.deepStrictEqual(cleanupDisposals, ['candidate', 'prior']);
  });

  it('rejects effectful Store metadata before preparing an alias move', () => {
    const store = new Store();
    let disposals = 0;
    const owner = {
      dispose() {
        disposals++;
      },
    };
    const creator = () => owner;
    const typedValue = createTypedValue(creator, store);
    const first = new Backbone.Model({ id: 'first' });
    const second = new Backbone.Model({ id: 'second' });
    typedValue.update(first);
    const metadata = getKnockbackMetadata(owner);
    const initialObject = metadata.object;
    assert.ok(initialObject instanceof Backbone.Model);
    let object = initialObject;
    let writes = 0;
    Object.defineProperty(metadata, 'object', {
      configurable: true,
      get() {
        return object;
      },
      set(next: Backbone.Model) {
        writes++;
        if (writes === 2) throw new TypeError('second metadata write failed');
        object = next;
      },
    });

    assert.throws(() => typedValue.update(second), TypeError);
    assert.strictEqual(typedValue.rawValue(), owner);
    assert.strictEqual(metadata.object, first);
    assert.strictEqual(referenceCount(owner), 1);
    assert.strictEqual(store.find(first, creator), owner);
    assert.strictEqual(store.find(second, creator), null);
    assert.strictEqual(recordCount(store), 1);
    assert.strictEqual(writes, 0);
    Object.defineProperty(metadata, 'object', { configurable: true, enumerable: true, writable: true, value: object });
    typedValue.dispose();
    store.dispose();
    assert.strictEqual(disposals, 1);
  });

  it('honors disposal requested by a failing preparation cleanup', () => {
    const disposals: string[] = [];
    let fail = false;
    let typedValue: TypedValue;
    typedValue = createTypedValue((model: unknown) => {
      if (fail) {
        return {
          __kb: Object.freeze({}),
          dispose() {
            disposals.push('candidate');
            typedValue.dispose();
            throw new RangeError('cleanup failed');
          },
        };
      }
      const id = (model as Backbone.Model).id as string;
      return {
        id,
        dispose() {
          disposals.push(id);
        },
      };
    });
    typedValue.update(new Backbone.Model({ id: 'prior' }));
    fail = true;

    let caught: unknown;
    try {
      typedValue.update(new Backbone.Model({ id: 'second' }));
    } catch (error) {
      caught = error;
    }
    assert.ok(caught instanceof AggregateError);
    assert.strictEqual(caught.errors[0] instanceof TypeError, true);
    assert.strictEqual(caught.errors[1] instanceof RangeError, true);
    assert.strictEqual(typedValue.rawValue(), undefined);
    assert.strictEqual(typedValue.create_options, undefined);
    assert.deepStrictEqual(disposals, ['candidate', 'prior']);
    typedValue.dispose();
    assert.deepStrictEqual(disposals, ['candidate', 'prior']);
  });

  it('keeps the prior-release error first when candidate cleanup also fails', () => {
    const disposals: string[] = [];
    let typedValue: TypedValue;
    const creator = (model: unknown) => {
      const id = (model as Backbone.Model).id as string;
      return {
        id,
        dispose() {
          disposals.push(id);
          if (id === 'first') {
            typedValue.dispose();
            throw new RangeError('prior release failed');
          }
          throw new URIError('candidate cleanup failed');
        },
      };
    };
    typedValue = createTypedValue(creator);
    typedValue.update(new Backbone.Model({ id: 'first' }));

    let caught: unknown;
    try {
      typedValue.update(new Backbone.Model({ id: 'second' }));
    } catch (error) {
      caught = error;
    }
    assert.ok(caught instanceof AggregateError);
    assert.strictEqual(caught.errors[0] instanceof RangeError, true);
    assert.strictEqual(caught.errors[1] instanceof URIError, true);
    assert.strictEqual(typedValue.rawValue(), undefined);
    assert.strictEqual(typedValue.create_options, undefined);
    assert.deepStrictEqual(disposals, ['first', 'second']);
    typedValue.dispose();
    assert.deepStrictEqual(disposals, ['first', 'second']);
  });

  it('does not invoke an effectful metadata setter through a Store-backed update', () => {
    const store = new Store();
    const factory = new Factory();
    const first = new Backbone.Model({ id: 'first' });
    const second = new Backbone.Model({ id: 'second' });
    const disposals: string[] = [];
    const prior = {
      name: 'prior',
      dispose() {
        disposals.push('prior');
      },
    };
    const intervening = {
      name: 'intervening',
      dispose() {
        disposals.push('intervening');
      },
    };
    const creator = () => prior;
    factory.addPathMapping('value', creator);
    const typedValue = new TypedValue({ factory, path: 'value', store });
    typedValue.update(first);
    const failure = new RangeError('metadata validation failed');
    const metadata = getKnockbackMetadata(prior);
    const initialObject = metadata.object;
    assert.ok(initialObject instanceof Backbone.Model);
    let object = initialObject;
    let writes = 0;
    Object.defineProperty(metadata, 'object', {
      configurable: true,
      enumerable: true,
      get() {
        return object;
      },
      set(next: Backbone.Model) {
        writes++;
        if (writes === 2) {
          store.retain(intervening, first, creator);
          throw failure;
        }
        object = next;
      },
    });

    let caught: unknown;
    try {
      typedValue.update(second);
    } catch (error) {
      caught = error;
    }
    assert.ok(caught instanceof TypeError);
    assert.strictEqual(typedValue.rawValue(), prior);
    assert.strictEqual(typedValue.value(), prior);
    assert.strictEqual(store.find(first, creator), prior);
    assert.strictEqual(store.find(second, creator), null);
    assert.strictEqual(referenceCount(prior), 1);
    assert.strictEqual(referenceCount(intervening), null);
    assert.strictEqual(recordCount(store), 1);
    assert.deepStrictEqual(store.replaced_observables, []);
    assert.strictEqual(writes, 0);

    Object.defineProperty(metadata, 'object', { configurable: true, enumerable: true, writable: true, value: object });
    typedValue.dispose();
    assert.strictEqual(recordCount(store), 0);
    assert.strictEqual(referenceCount(prior), 0);
    assert.strictEqual(referenceCount(intervening), null);
    assert.deepStrictEqual(disposals, ['prior']);
    store.dispose();
  });

  it('rejects an explicit owner at an occupied reversible destination', () => {
    const store = new Store();
    const first = new Backbone.Model({ id: 'first' });
    const second = new Backbone.Model({ id: 'second' });
    const disposals: string[] = [];
    const creator = (model: unknown) => {
      const id = (model as Backbone.Model).id as string;
      return {
        id,
        dispose() {
          disposals.push(id);
        },
      };
    };
    const cached = store.retainOrCreate(second, { creator });
    const typedValue = createTypedValue(creator, store);
    typedValue.update(first);
    const prior = typedValue.rawValue();
    const supplied = {
      __kb_is_vm: true,
      dispose() {
        disposals.push('supplied');
      },
    };
    wrappedObject(supplied, second);
    wrappedCreator(supplied, creator);

    assert.throws(() => typedValue.update(supplied), UnexpectedValueError);
    assert.strictEqual(typedValue.rawValue(), prior);
    assert.strictEqual(typedValue.value(), prior);
    assert.strictEqual(store.find(first, creator), prior);
    assert.strictEqual(store.find(second, creator), cached);
    assert.strictEqual(referenceCount(prior), 1);
    assert.strictEqual(referenceCount(cached), 1);
    assert.strictEqual(referenceCount(supplied), null);
    assert.strictEqual(recordCount(store), 2);
    assert.deepStrictEqual(store.replaced_observables, []);

    typedValue.dispose();
    store.release(cached);
    supplied.dispose();
    store.dispose();
    assert.deepStrictEqual(disposals, ['first', 'second', 'supplied']);
  });

  it('keeps cached shallow and deep replacements through a ModelRef reload', () => {
    for (const deepRetain of [false, true]) {
      const previousSetting = settings.deep_retain;
      settings.deep_retain = deepRetain;
      const collection = new Backbone.Collection();
      const reference = new ModelRef(collection, 0);
      const firstChild = new Backbone.Model({ id: 'first-child' });
      const secondChild = new Backbone.Model({ id: 'second-child' });
      collection.add(new Backbone.Model({ id: 0, child: firstChild }));
      const store = new Store();
      const disposals: string[] = [];
      const creator = (model: unknown) => {
        const id = (model as Backbone.Model | null)?.id as string | undefined;
        const name = id || 'null';
        return {
          name,
          dispose() {
            disposals.push(name);
          },
        };
      };
      const cached = store.retainOrCreate(secondChild, { creator });
      const value = observable<{ name: string }>(reference, 'child', { store, factories: creator });
      try {
        assert.strictEqual(value().name, 'first-child');
        assert.strictEqual(reference.ref_count, 2);
        collection.reset([new Backbone.Model({ id: 0, child: secondChild })]);
        assert.strictEqual(value(), cached);
        assert.strictEqual(referenceCount(cached), deepRetain ? 2 : 1);
        assert.strictEqual(recordCount(store), 1);
        assert.deepStrictEqual(store.replaced_observables, []);
        assert.deepStrictEqual(disposals, ['first-child', 'null']);

        value.dispose();
        assert.strictEqual(reference.ref_count, 1);
        assert.strictEqual(referenceCount(cached), deepRetain ? 1 : 0);
        if (deepRetain) store.release(cached);
        assert.strictEqual(referenceCount(cached), 0);
        assert.strictEqual(recordCount(store), 0);
        assert.deepStrictEqual(disposals, ['first-child', 'null', 'second-child']);
      } finally {
        settings.deep_retain = previousSetting;
        store.dispose();
        reference.release();
      }
      assert.strictEqual(reference.ref_count, 0);
    }
  });
});
