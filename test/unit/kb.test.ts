import kb, { EventWatcher, ignore, peek, viewModel } from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ModelRef from 'backbone-modelref';
import ko from 'knockout';
import { listenerCount } from '../lib/backbone-events.ts';

function disposalExercise(operation: () => void, cleanups: Array<() => void>): void {
  const failures: unknown[] = [];
  try {
    operation();
  } catch (error) {
    failures.push(error);
  }
  for (const cleanup of cleanups.reverse()) {
    try {
      cleanup();
    } catch (error) {
      failures.push(error);
    }
  }
  if (failures.length === 1) throw failures[0];
  if (failures.length) {
    const summary = failures.map((error) => (error instanceof Error ? `${error.name}: ${error.message}` : `thrown ${typeof error}`));
    throw new AggregateError(failures, `Public disposal operation and cleanup failed: ${summary.join('; ')}`);
  }
}

describe('@mcpeasy/knockback', () => {
  describe('kb namespace', () => {
    it('should have VERSION', () => {
      assert.ok(kb.VERSION);
      assert.strictEqual(typeof kb.VERSION, 'string');
    });

    it('should have type constants', () => {
      assert.strictEqual(kb.TYPE_UNKNOWN, 0);
      assert.strictEqual(kb.TYPE_SIMPLE, 1);
      assert.strictEqual(kb.TYPE_ARRAY, 2);
      assert.strictEqual(kb.TYPE_MODEL, 3);
      assert.strictEqual(kb.TYPE_COLLECTION, 4);
    });
  });

  describe('ignore()', () => {
    it('preserves callback target, tuple order and return value', () => {
      const target = { base: 7 };
      const observed: unknown[] = [];

      const result = ignore(
        function (this: typeof target, left: number, right: string) {
          observed.push(this, left, right);
          return this.base + left + right.length;
        },
        target,
        [2, 'abc']
      );

      assert.strictEqual(result, 12);
      assert.deepStrictEqual(observed, [target, 2, 'abc']);
      assert.strictEqual(
        ignore(() => 'zero'),
        'zero'
      );
      assert.strictEqual(
        ignore((value?: number) => value ?? 4),
        4
      );
    });

    it('does not capture callback dependencies', () => {
      const source = ko.observable(1);
      let evaluations = 0;
      const outer = ko.computed(() => {
        evaluations += 1;
        return ignore(() => source());
      });

      try {
        assert.strictEqual(outer(), 1);
        assert.strictEqual(evaluations, 1);
        source(2);
        assert.strictEqual(evaluations, 1);
        assert.strictEqual(outer(), 1);
      } finally {
        outer.dispose();
      }
    });

    function checkIgnoreTypes(): void {
      // @ts-expect-error A required callback argument tuple cannot be omitted.
      ignore((value: number) => value + 1);
      // @ts-expect-error A callback target does not supply required arguments.
      ignore((value: number) => value + 1, undefined);
      // @ts-expect-error Callback argument tuples retain their element types.
      ignore((value: number) => value + 1, undefined, ['bad']);
      // @ts-expect-error A required callback argument tuple cannot be incomplete.
      ignore((left: number, right: string) => left + right.length, undefined, [1]);
      ignore(
        function (this: { base: number }) {
          return this.base;
        },
        // @ts-expect-error Callback targets must satisfy the callback this type.
        { base: 'bad' }
      );
    }
    void checkIgnoreTypes;
  });

  describe('peek()', () => {
    it('reads observables without capturing them as dependencies', () => {
      const source = ko.observable('Ada');
      let evaluations = 0;
      const outer = ko.computed(() => {
        evaluations += 1;
        return peek(source);
      });

      try {
        assert.strictEqual(outer(), 'Ada');
        source('Grace');
        assert.strictEqual(evaluations, 1);
        assert.strictEqual(outer(), 'Ada');
        assert.strictEqual(peek('plain'), 'plain');
      } finally {
        outer.dispose();
      }
    });
  });

  describe('kb.observable', () => {
    it('should create an observable from a model attribute', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const nameObs = kb.observable<string>(model, 'name');

      assert.strictEqual(nameObs(), 'Bob');
    });

    it('should update when model changes', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const nameObs = kb.observable<string>(model, 'name');

      assert.strictEqual(nameObs(), 'Bob');
      model.set('name', 'Fred');
      assert.strictEqual(nameObs(), 'Fred');
    });

    it('should update model when observable changes', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const nameObs = kb.observable<string>(model, 'name');

      nameObs('Alice');
      assert.strictEqual(model.get('name'), 'Alice');
    });
  });

  describe('kb.viewModel', () => {
    it('should create observables for all model attributes', () => {
      interface PersonViewModel {
        first_name: ko.Observable<string>;
        last_name: ko.Observable<string>;
      }

      const model = new Backbone.Model({ first_name: 'Bob', last_name: 'Smith' });
      const vm = viewModel<PersonViewModel>(model);

      assert.ok(ko.isObservable(vm.first_name));
      assert.ok(ko.isObservable(vm.last_name));
      assert.strictEqual(vm.first_name(), 'Bob');
      assert.strictEqual(vm.last_name(), 'Smith');
    });

    it('should sync changes with model', () => {
      interface NameViewModel {
        name: ko.Observable<string>;
      }

      const model = new Backbone.Model({ name: 'Bob' });
      const vm = kb.viewModel<NameViewModel>(model);

      vm.name('Fred');
      assert.strictEqual(model.get('name'), 'Fred');

      model.set('name', 'Alice');
      assert.strictEqual(vm.name(), 'Alice');
    });

    it('should support keys option', () => {
      interface KeysViewModel {
        name: ko.Observable<string>;
        age: ko.Observable<number>;
        email?: ko.Observable<string>;
      }

      const model = new Backbone.Model({ name: 'Bob', age: 30, email: 'bob@example.com' });
      const vm = kb.viewModel<KeysViewModel>(model, { keys: ['name', 'age'] });

      assert.ok(ko.isObservable(vm.name));
      assert.ok(ko.isObservable(vm.age));
      assert.strictEqual(vm.email, undefined);
    });
  });

  describe('kb.collectionObservable', () => {
    it('should create an observable array from a collection', () => {
      const collection = new Backbone.Collection([{ name: 'Bob' }, { name: 'Fred' }]);
      const co = kb.collectionObservable(collection);

      assert.ok(ko.isObservableArray(co));
      assert.strictEqual(co().length, 2);
    });

    it('should update when collection changes', () => {
      const collection = new Backbone.Collection([{ name: 'Bob' }]);
      const co = kb.collectionObservable(collection);

      assert.strictEqual(co().length, 1);

      collection.add({ name: 'Fred' });
      assert.strictEqual(co().length, 2);

      collection.remove(collection.at(0));
      assert.strictEqual(co().length, 1);
    });

    it('should support modelsOnly option', () => {
      const collection = new Backbone.Collection([{ name: 'Bob' }]);
      const co = kb.collectionObservable(collection, { modelsOnly: true });

      assert.strictEqual(co().length, 1);
      assert.ok(co()[0] instanceof Backbone.Model);
    });
  });

  describe('dispose()', () => {
    for (const loaded of [false, true]) {
      it(`public disposal releases a ${loaded ? 'loaded' : 'unloaded'} real ModelRef ViewModel exactly once`, () => {
        const previousStatistics = kb.getStatistics();
        const stats = new kb.Statistics();
        kb.setStatistics(stats);
        const model = new Backbone.Model({ id: 7, name: 'parent' });
        const collection = new Backbone.Collection(loaded ? [model] : []);
        const reference = new ModelRef(collection, 7);
        const view = kb.viewModel<{ name: ko.Observable<string | null> }>(reference, { keys: ['name'] });
        const repeat = [view.dispose.bind(view), view.destroy.bind(view), view.release.bind(view)];
        disposalExercise(() => {
          const originalMetadata: unknown = Reflect.get(view, '__kb');
          assert.ok(typeof originalMetadata === 'object' && originalMetadata !== null);
          const watcher: unknown = Reflect.get(originalMetadata, 'eventWatcher');
          const store: unknown = Reflect.get(originalMetadata, 'store');
          const references: unknown = Reflect.get(originalMetadata, 'stores_references');
          assert.ok(watcher instanceof EventWatcher, 'capture exact owned watcher');
          assert.ok(store instanceof kb.Store, 'capture exact owned Store');
          const instances: unknown = Reflect.get(kb.Store, 'instances');
          assert.ok(Array.isArray(instances), 'public Store registry is an array');
          assert.ok(Array.isArray(references), 'capture exact Store reference array');
          assert.strictEqual(references.length, 1);
          assert.strictEqual(reference.ref_count, 2, 'one live reference lease');
          assert.strictEqual(stats.registeredCount('ViewModel'), 1);
          kb.dispose(view);
          assert.strictEqual(reference.ref_count, 1, 'public disposal releases exactly one reference lease');
          assert.strictEqual(listenerCount(reference, 'loaded'), 0);
          assert.strictEqual(listenerCount(reference, 'unloaded'), 0);
          assert.strictEqual(listenerCount(model, 'change'), 0);
          const metadata: unknown = Reflect.get(view, '__kb');
          let keys: PropertyKey[] = [];
          if (metadata !== null) {
            assert.ok(typeof metadata === 'object', 'disposed root metadata is null or cleared data');
            keys = Reflect.ownKeys(metadata);
            assert.ok(
              keys.every((key) => key === 'object' || key === 'creator'),
              'disposed root retains no ownership metadata'
            );
            assert.ok(Reflect.get(metadata, 'object') === null, 'disposed metadata retains no wrapped object');
            assert.ok(Reflect.get(metadata, 'creator') === undefined, 'disposed metadata retains no creator');
          }
          console.log(`[public disposal metadata] ${JSON.stringify({ loaded, kind: metadata === null ? 'null' : 'cleared', keys, object: null, creator: 'undefined' })}`);
          assert.ok(watcher.modelRef === null, 'captured watcher releases exact reference');
          assert.strictEqual(watcher.emitter(), null);
          assert.ok(Reflect.get(watcher, '__kb') === null, 'captured watcher metadata is cleared');
          assert.ok(!instances.includes(store), 'captured owned Store is no longer registered');
          assert.ok(kb.wasReleased(store), 'captured owned Store is released');
          assert.strictEqual(references.length, 0, 'captured lease array is drained');
          assert.strictEqual(stats.registeredCount(), 0, 'public disposal unregisters statistics');
          kb.dispose(view);
          for (const dispose of repeat) dispose();
          assert.strictEqual(reference.ref_count, 1, 'repeated public/member/alias disposal releases no extra lease');
        }, [
          () => kb.setStatistics(previousStatistics),
          () => collection.reset([]),
          () => {
            reference.release();
            assert.strictEqual(reference.ref_count, 0, 'final reference release');
          },
          () => view.dispose(),
        ]);
      });
    }

    it('public disposal clears a real Store and its reference owner exactly once', () => {
      const model = new Backbone.Model({ id: 7, name: 'parent' });
      const collection = new Backbone.Collection([model]);
      const reference = new ModelRef(collection, 7);
      const store = new kb.Store();
      const view = kb.viewModel(reference, { store, keys: ['name'] });
      disposalExercise(() => {
        const instances: unknown = Reflect.get(kb.Store, 'instances');
        assert.ok(Array.isArray(instances), 'public Store registry is an array');
        assert.ok(instances.includes(store), 'Store is initially tracked');
        assert.strictEqual(reference.ref_count, 2);
        kb.dispose(store);
        assert.ok(!instances.includes(store), 'public disposal unregisters exact Store');
        assert.strictEqual(reference.ref_count, 1, 'public Store disposal releases the owned view reference');
        assert.ok(Reflect.get(view, '__kb') === null, 'owned view metadata is cleared');
        assert.strictEqual(listenerCount(reference, 'loaded'), 0);
        assert.strictEqual(listenerCount(reference, 'unloaded'), 0);
        assert.strictEqual(listenerCount(model, 'change'), 0);
        kb.dispose(store);
        store.dispose();
        assert.strictEqual(reference.ref_count, 1, 'repeat Store disposal releases no extra reference');
      }, [
        () => collection.reset([]),
        () => {
          reference.release();
          assert.strictEqual(reference.ref_count, 0, 'final Store reference release');
        },
        () => store.dispose(),
        () => view.dispose(),
      ]);
    });

    for (const loaded of [false, true]) {
      it(`public disposal releases a ${loaded ? 'loaded' : 'unloaded'} real EventWatcher exactly once`, () => {
        const model = new Backbone.Model({ id: 7, name: 'parent' });
        const collection = new Backbone.Collection(loaded ? [model] : []);
        const reference = new ModelRef(collection, 7);
        const watcher = new EventWatcher(reference);
        let updates = 0;
        watcher.registerCallbacks({}, { update: () => updates++ });
        disposalExercise(() => {
          assert.strictEqual(reference.ref_count, 2);
          kb.dispose(watcher);
          assert.strictEqual(reference.ref_count, 1, 'public watcher disposal releases exactly one reference lease');
          assert.ok(watcher.modelRef === null, 'public disposal detaches the reference');
          assert.strictEqual(watcher.emitter(), null);
          assert.ok(Reflect.get(watcher, '__kb') === null, 'public disposal clears watcher metadata');
          assert.strictEqual(listenerCount(reference, 'loaded'), 0);
          assert.strictEqual(listenerCount(reference, 'unloaded'), 0);
          assert.strictEqual(listenerCount(model, 'change'), 0);
          model.set('name', 'after disposal');
          assert.strictEqual(updates, 0, 'disposed watcher receives no updates');
          kb.dispose(watcher);
          watcher.dispose();
          watcher.destroy();
          watcher.release();
          assert.strictEqual(reference.ref_count, 1, 'repeat public/member/alias disposal releases no extra lease');
        }, [
          () => collection.reset([]),
          () => {
            reference.release();
            assert.strictEqual(reference.ref_count, 0, 'final watcher reference release');
          },
          () => watcher.dispose(),
        ]);
      });
    }

    it('public disposal fences custom member reentry and disposes a real child once', () => {
      const model = new Backbone.Model({ name: 'child' });
      const child = kb.observable<string>(model, 'name');
      const disposeChild = child.dispose.bind(child);
      let memberCalls = 0;
      const owner = {
        child,
        dispose() {
          memberCalls++;
          kb.dispose(this);
        },
      };
      disposalExercise(() => {
        assert.strictEqual(listenerCount(model, 'change'), 1);
        kb.dispose(owner);
        assert.strictEqual(memberCalls, 1, 'generic dispatcher blocks recursive member invocation');
        assert.strictEqual(listenerCount(model, 'change'), 0, 'real child listener is released');
        kb.dispose(owner);
        assert.strictEqual(memberCalls, 1, 'repeat public disposal does not invoke the custom member');
        assert.strictEqual(listenerCount(model, 'change'), 0);
      }, [disposeChild]);
    });

    it('public disposal keeps children it cannot dispose', () => {
      let releases = 0;
      const releaseOnly = {
        release() {
          releases++;
        },
      };
      const owner = { releaseOnly };
      kb.dispose(owner);
      assert.strictEqual(owner.releaseOnly, releaseOnly, 'release-only child is not cleared');
      assert.strictEqual(releases, 0, 'dispose traversal does not call release()');
    });

    it('should dispose view models', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const model = new Backbone.Model({ name: 'Bob' });
      const vm = kb.viewModel(model);

      vm.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should dispose observables', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const model = new Backbone.Model({ name: 'Bob' });
      const obs = kb.observable<string>(model, 'name');

      obs.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('release()', () => {
    it('releases releaseable array items and preserves plain items', () => {
      const previousStatistics = kb.getStatistics();
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const model = new Backbone.Model({ name: 'Bob' });
      const obs = kb.observable<string>(model, 'name');
      const vm = kb.viewModel(new Backbone.Model({ name: 'Fred' }));
      disposalExercise(() => {
        const items: unknown[] = ['keep', obs, vm];
        assert.strictEqual(kb.isReleaseable(items), true, 'array with a releaseable item');
        kb.release(items);
        assert.deepStrictEqual(items, Object.assign(['keep', null, null], { __kb_released: true }));
        assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
        assert.strictEqual(listenerCount(model, 'change'), 0);
      }, [() => kb.setStatistics(previousStatistics), () => vm.dispose(), obs.dispose.bind(obs)]);
    });

    it('releases a direct child of a plain owner and preserves plain data', () => {
      const previousStatistics = kb.getStatistics();
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const collection = new Backbone.Collection([{ name: 'Fred' }]);
      const co = kb.collectionObservable(collection);
      disposalExercise(() => {
        const owner: Record<string, unknown> = { label: 'keep', data: { name: 'Fred' }, co };
        assert.strictEqual(kb.isReleaseable(owner), true, 'plain owner with a releaseable child');
        kb.release(owner);
        assert.strictEqual(owner.label, 'keep');
        assert.deepStrictEqual(owner.data, { name: 'Fred' });
        assert.strictEqual(owner.co, null);
        assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
        assert.strictEqual(kb.Statistics.eventsStats(collection).count, 0);
      }, [() => kb.setStatistics(previousStatistics), co.dispose.bind(co)]);
    });

    it('releases observable array items but does not traverse properties on a Knockout observable', () => {
      const previousStatistics = kb.getStatistics();
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const model = new Backbone.Model({ name: 'Bob' });
      const owned = kb.observable<string>(model, 'name');
      const vm = kb.viewModel(new Backbone.Model({ name: 'Fred' }));
      disposalExercise(() => {
        const container = { owned };
        const value = Object.assign(ko.observable('hi'), { owned, container });
        kb.release(value);
        assert.strictEqual(value(), 'hi');
        assert.strictEqual(value.owned, owned, 'owned property is not cleared');
        assert.strictEqual(value.container, container, 'plain container property is not cleared');
        assert.strictEqual(container.owned, owned);
        assert.ok(kb.Statistics.eventsStats(model).count > 0, 'owned observable remains live');

        const items = ko.observableArray<unknown>(['keep', vm]);
        let notifications = 0;
        const subscription = items.subscribe(() => notifications++);
        kb.release(items);
        subscription.dispose();
        assert.deepStrictEqual(items.peek(), ['keep', null]);
        assert.strictEqual(notifications, 0, 'observableArray.destroy() is not invoked');
        assert.strictEqual(stats.registeredCount('ViewModel'), 0, 'array item released');

        const computedVm = kb.viewModel(new Backbone.Model({ name: 'Mary' }));
        const computed = ko.computed(() => [computedVm]);
        kb.release(computed);
        assert.strictEqual(computed.isActive(), false, 'computed array is disposed');
        assert.strictEqual(stats.registeredCount('ViewModel'), 0, 'computed array item released');

        const bus = new ko.subscribable();
        const plainOwner = { label: 'keep', bus };
        assert.strictEqual(kb.isReleaseable(bus), false, 'a bare subscribable is not releaseable');
        kb.release(plainOwner);
        assert.strictEqual(plainOwner.bus, bus, 'a bare subscribable child is not cleared');

        owned.dispose();
        assert.strictEqual(kb.Statistics.eventsStats(model).count, 0);
        assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      }, [() => kb.setStatistics(previousStatistics), () => vm.dispose(), owned.dispose.bind(owned)]);
    });

    it('selects only lifecycle members that are functions', () => {
      const calls: string[] = [];
      const owner = {
        release: 'retained label',
        destroy() {
          calls.push('destroy');
        },
        dispose() {
          calls.push('dispose');
        },
      };
      kb.release(owner);
      assert.deepStrictEqual(calls, ['destroy'], 'a non-function release field is skipped');
      assert.strictEqual(owner.release, 'retained label');

      const data = { release: true, destroy: 1, dispose: 'no' };
      assert.strictEqual(kb.isReleaseable(data), false, 'non-function lifecycle fields are data');
      kb.release(data);
      assert.deepStrictEqual(data, { release: true, destroy: 1, dispose: 'no' });
    });

    it('limits discovery to direct children and excludes metadata, models, collections and functions', () => {
      const previousStatistics = kb.getStatistics();
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const collection = new Backbone.Collection([{ name: 'Fred' }]);
      const co = kb.collectionObservable(collection);
      disposalExercise(() => {
        const container = { co };
        const owner = { container };
        assert.strictEqual(kb.isReleaseable(owner), false, 'grandchild is beyond discovery depth');
        assert.strictEqual(kb.isReleaseable(container, 1), false, 'no discovery below depth 0');
        assert.strictEqual(kb.isReleaseable({ __kb: co }), false, '__kb is not discovered');
        assert.strictEqual(kb.isReleaseable({ model: new Backbone.Model(), collection: new Backbone.Collection(), fn: () => undefined }), false);

        kb.release(owner);
        assert.strictEqual(owner.container, container, 'unreleaseable owner is untouched');
        assert.strictEqual(container.co, co);
        assert.strictEqual(stats.registeredCount('CollectionObservable'), 1, 'grandchild remains live');

        kb.release(container);
        assert.strictEqual(container.co, null);
        assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      }, [() => kb.setStatistics(previousStatistics), co.dispose.bind(co)]);
    });

    it('does not extend public dispose() traversal to plain containers', () => {
      const previousStatistics = kb.getStatistics();
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const co = kb.collectionObservable(new Backbone.Collection([{ name: 'Fred' }]));
      disposalExercise(() => {
        const container = { co };
        const owner = { container };
        kb.dispose(owner);
        assert.strictEqual(owner.container, container, 'plain container is not cleared');
        assert.strictEqual(container.co, co);
        assert.strictEqual(stats.registeredCount('CollectionObservable'), 1);
        co.dispose();
        assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      }, [() => kb.setStatistics(previousStatistics), co.dispose.bind(co)]);
    });
  });

  describe('Statistics snapshot/diff', () => {
    it('should return counts by type and total', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const model = new Backbone.Model({ name: 'Bob' });
      const vm = kb.viewModel(model);
      const co = kb.collectionObservable(new Backbone.Collection());

      const snap = stats.snapshot();

      assert.strictEqual(snap.ViewModel, 1);
      assert.strictEqual(snap.CollectionObservable, 1);
      assert.strictEqual(snap.total, 2);

      vm.dispose();
      co.dispose();
      kb.setStatistics(null);
    });

    it('should diff snapshots by key', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const before = stats.snapshot();

      const model = new Backbone.Model({ name: 'Bob' });
      const vm = kb.viewModel(model);
      const co = kb.collectionObservable(new Backbone.Collection());

      const after = stats.snapshot();
      const delta = stats.diff(before, after);

      assert.strictEqual(delta.ViewModel, 1);
      assert.strictEqual(delta.CollectionObservable, 1);
      assert.strictEqual(delta.total, 2);

      vm.dispose();
      co.dispose();
      kb.setStatistics(null);
    });
  });
});
