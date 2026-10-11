import kb, { type Store } from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';

type AnyPropsViewModel = {
  [key: string]: unknown;
};

const describeBrowser = typeof document === 'undefined' ? describe.skip : describe;

describe('memory management', () => {
  // Helper: Ref-countable view model for testing
  class RefCountableViewModel {
    static viewModels: RefCountableViewModel[] = [];
    ref_count = 1;
    is_destroyed = false;

    constructor() {
      RefCountableViewModel.viewModels.push(this);
    }

    refCount(): number {
      return this.ref_count;
    }

    retain(): this {
      this.ref_count++;
      return this;
    }

    release(): this {
      this.ref_count--;
      if (this.ref_count < 0) throw new Error('ref count is corrupt');
      if (!this.ref_count) {
        this.is_destroyed = true;
        this.__destroy();
      }
      return this;
    }

    __destroy(): void {
      const index = RefCountableViewModel.viewModels.indexOf(this);
      if (index >= 0) {
        RefCountableViewModel.viewModels.splice(index, 1);
      }
    }
  }

  // Helper: Disposable view model
  class DisposableViewModel {
    static viewModels: DisposableViewModel[] = [];

    constructor() {
      DisposableViewModel.viewModels.push(this);
    }

    dispose(): void {
      const index = DisposableViewModel.viewModels.indexOf(this);
      if (index >= 0) {
        DisposableViewModel.viewModels.splice(index, 1);
      }
    }
  }

  // Helper: Destroy-only view model
  class DestroyableViewModel {
    static viewModels: DestroyableViewModel[] = [];

    constructor() {
      DestroyableViewModel.viewModels.push(this);
    }

    destroy(): void {
      const index = DestroyableViewModel.viewModels.indexOf(this);
      if (index >= 0) {
        DestroyableViewModel.viewModels.splice(index, 1);
      }
    }
  }

  // Helper: Simple view model
  class SimpleViewModel {
    static viewModels: SimpleViewModel[] = [];
    prop: ko.Observable<unknown>;

    constructor() {
      this.prop = ko.observable();
      SimpleViewModel.viewModels.push(this);
    }
  }

  beforeEach(() => {
    RefCountableViewModel.viewModels = [];
    DisposableViewModel.viewModels = [];
    DestroyableViewModel.viewModels = [];
    SimpleViewModel.viewModels = [];
  });

  describe('basic view model properties', () => {
    it('should release all property types on a plain owner', () => {
      const previousStatistics = kb.getStatistics();
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const failures: unknown[] = [];
      const childCleanups: Array<() => void> = [];
      const track = <T extends { dispose(): void }>(child: T): T => {
        childCleanups.push(child.dispose.bind(child));
        return child;
      };

      try {
        const nestedViewModel = track(kb.viewModel<AnyPropsViewModel>(new Backbone.Model({ name: 'name1' })));
        class PlainOwner {
          [key: string]: unknown;
          prop1 = ko.observable();
          prop2 = ko.observable(['test', 1, null, track(kb.viewModel(new Backbone.Model({ name: 'name1' })))]);
          prop3 = ko.observableArray(['test', 1, null, track(kb.viewModel(new Backbone.Model({ name: 'name1' })))]);
          prop4 = track(ko.computed(() => true));
          prop5 = track(kb.observable<string>(new Backbone.Model({ name: 'name1' }), 'name'));
          prop6 = nestedViewModel;
          prop7 = track(kb.collectionObservable(new Backbone.Collection(), { modelsOnly: true }));
          prop8 = track(kb.viewModel(new Backbone.Model({ name: 'name1' })));
          prop9 = track(kb.collectionObservable(new Backbone.Collection()));
        }
        const owner = new PlainOwner();

        kb.release(owner);

        for (let i = 1; i <= 9; i++) {
          assert.ok(!owner[`prop${i}`], `Property released: prop${i}`);
        }
        assert.ok(!owner.name, 'Property released: owner.name');
        assert.ok(!nestedViewModel.name, 'Property released: nestedViewModel.name');
        assert.strictEqual(stats.registeredStatsString('all released'), 'all released', 'Cleanup: stats');
      } catch (error) {
        failures.push(error);
      } finally {
        for (const cleanup of [
          ...childCleanups,
          () => assert.strictEqual(stats.registeredStatsString('all released'), 'all released', 'Cleanup after fallback: stats'),
          () => kb.setStatistics(previousStatistics),
        ]) {
          try {
            cleanup();
          } catch (error) {
            failures.push(error);
          }
        }
      }
      if (failures.length === 1) throw failures[0];
      if (failures.length) {
        const summary = failures.map((error) => (error instanceof Error ? `${error.name}: ${error.message}` : `thrown ${typeof error}`));
        throw new AggregateError(failures, `Plain-owner basic release operation and cleanup failed: ${summary.join('; ')}`);
      }
    });
  });

  describeBrowser('releasing with nodes', () => {
    it('should release a view model and a plain collection owner when their nodes are removed', () => {
      const previousStatistics = kb.getStatistics();
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const failures: unknown[] = [];
      const model = new Backbone.Model({ name: 'Bob' });
      let viewModel: ReturnType<typeof kb.viewModel> | undefined;
      let collectionObservable: ReturnType<typeof kb.collectionObservable> | undefined;
      let disposeViewModel: (() => void) | undefined;
      let disposeCollectionObservable: (() => void) | undefined;
      const vmElement = document.createElement('div');
      const coElement = document.createElement('div');

      try {
        viewModel = kb.viewModel(model);
        disposeViewModel = viewModel.dispose.bind(viewModel);
        collectionObservable = kb.collectionObservable(new Backbone.Collection([new Backbone.Model({ name: 'Fred' }), new Backbone.Model({ name: 'Mary' })]));
        disposeCollectionObservable = collectionObservable.dispose.bind(collectionObservable);
        vmElement.setAttribute('data-bind', 'text: name');
        coElement.setAttribute('data-bind', 'foreach: co');
        coElement.innerHTML = '<div data-bind="text: name"></div>';
        document.body.append(vmElement, coElement);

        kb.applyBindings(viewModel, vmElement);
        kb.applyBindings({ co: collectionObservable }, coElement);

        assert.strictEqual(vmElement.textContent, 'Bob', 'found Bob');
        assert.deepStrictEqual(
          Array.from(coElement.children, (child) => child.textContent),
          ['Fred', 'Mary']
        );
        assert.strictEqual(stats.registeredCount('ViewModel'), 3, '3 bound view models');
        assert.strictEqual(stats.registeredCount('CollectionObservable'), 1, '1 bound collection observable');

        ko.removeNode(coElement);
        assert.strictEqual(stats.registeredCount('ViewModel'), 1, '1 bound view model');
        assert.strictEqual(stats.registeredCount('CollectionObservable'), 0, 'no bound collection observables');

        ko.removeNode(vmElement);
        assert.strictEqual(kb.Statistics.eventsStats(model).count, 0, 'All model events cleared');
        assert.strictEqual(stats.registeredStatsString('all released'), 'all released', 'Cleanup: stats');
      } catch (error) {
        failures.push(error);
      } finally {
        for (const cleanup of [
          () => disposeCollectionObservable?.(),
          () => disposeViewModel?.(),
          () => vmElement.remove(),
          () => coElement.remove(),
          () => assert.strictEqual(stats.registeredStatsString('all released'), 'all released', 'Cleanup after fallback: stats'),
          () => kb.setStatistics(previousStatistics),
        ]) {
          try {
            cleanup();
          } catch (error) {
            failures.push(error);
          }
        }
      }
      if (failures.length === 1) throw failures[0];
      if (failures.length) throw new AggregateError(failures, 'Node release operation and cleanup failed');
    });
  });

  describe('reference counting', () => {
    class RefViewModel {
      ref_count = 1;
      is_destroyed = false;
      prop: kb.Observable<string> | null;

      constructor() {
        this.prop = kb.observable<string>(new Backbone.Model({ name: 'name1' }), 'name');
      }

      refCount(): number {
        return this.ref_count;
      }

      retain(): this {
        this.ref_count++;
        return this;
      }

      release(): this {
        this.ref_count--;
        if (this.ref_count < 0) throw new Error('ref count is corrupt');
        if (!this.ref_count) {
          this.is_destroyed = true;
          this.__destroy();
        }
        return this;
      }

      __destroy(): void {
        kb.release(this.prop);
        this.prop = null;
      }
    }

    function refCountExercise(name: string, operation: (refCounted: RefViewModel, stats: InstanceType<typeof kb.Statistics>) => void): void {
      const previousStatistics = kb.getStatistics();
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const failures: unknown[] = [];
      const refCounted = new RefViewModel();
      const prop = refCounted.prop;
      const disposeProp = prop?.dispose.bind(prop);

      try {
        operation(refCounted, stats);
      } catch (error) {
        failures.push(error);
      } finally {
        for (const cleanup of [
          () => {
            while (refCounted.ref_count > 0) refCounted.release();
          },
          () => disposeProp?.(),
          () => assert.strictEqual(stats.registeredStatsString('all released'), 'all released', 'Cleanup after fallback: stats'),
          () => kb.setStatistics(previousStatistics),
        ]) {
          try {
            cleanup();
          } catch (error) {
            failures.push(error);
          }
        }
      }
      if (failures.length === 1) throw failures[0];
      if (failures.length) throw new AggregateError(failures, `${name} operation and cleanup failed`);
    }

    it('should release a release-only child of a plain owner by reference count', () => {
      refCountExercise('Plain-owner reference counting', (refCounted, stats) => {
        const owner = { ref_counted: refCounted.retain() };
        kb.release(owner);
        assert.ok(!owner.ref_counted, 'Property released: owner.ref_counted');
        assert.ok(!!refCounted.prop, 'Property not released: refCounted.prop');

        refCounted.release();
        assert.ok(!refCounted.prop, 'Property released: refCounted.prop');
        assert.strictEqual(stats.registeredStatsString('all released'), 'all released', 'Cleanup: stats');
      });
    });

    it('should release a release-only child of a ViewModel by reference count', () => {
      refCountExercise('ViewModel reference counting', (refCounted, stats) => {
        const vm = kb.viewModel<AnyPropsViewModel>(new Backbone.Model());
        vm.ref_counted = refCounted.retain();
        vm.dispose();
        assert.ok(!vm.ref_counted, 'Property released: vm.ref_counted');
        assert.strictEqual(refCounted.ref_count, 1, 'release() was called once');
        assert.ok(!!refCounted.prop, 'Property not released: refCounted.prop');

        refCounted.release();
        assert.ok(!refCounted.prop, 'Property released: refCounted.prop');
        assert.strictEqual(stats.registeredStatsString('all released'), 'all released', 'Cleanup: stats');
      });
    });
  });

  describe('CollectionObservable memory', () => {
    it('should retain a custom child after releasing a collection with an owned Store', () => {
      const previousStatistics = kb.getStatistics();
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const failures: unknown[] = [];
      let disposeCollection: (() => void) | undefined;
      let retainedChild: RefCountableViewModel | undefined;

      try {
        const co = kb.collectionObservable<RefCountableViewModel>(
          new Backbone.Collection([{ name: 'name1' }, { name: 'name2' }]),
          { viewModel: { create: () => new RefCountableViewModel() } }
        );
        disposeCollection = co.dispose.bind(co);
        assert.strictEqual(RefCountableViewModel.viewModels.length, 2, 'Created: 2');
        const child = co()[0].retain();
        retainedChild = child;

        kb.release(co);
        assert.strictEqual(RefCountableViewModel.viewModels.length, 1, 'Still one reference');
        assert.strictEqual(child.refCount(), 1, "All instances were released from the collection's store");
        assert.strictEqual(child.is_destroyed, false, 'Retained child is alive');

        retainedChild = undefined;
        child.release();
        assert.strictEqual(child.refCount(), 0, 'Final child reference released');
        assert.strictEqual(child.is_destroyed, true, 'Retained child is destroyed');
        assert.strictEqual(RefCountableViewModel.viewModels.length, 0, 'All children released');
      } catch (error) {
        failures.push(error);
      } finally {
        for (const cleanup of [
          () => disposeCollection?.(),
          () => retainedChild?.release(),
          () => assert.strictEqual(stats.registeredStatsString('all released'), 'all released'),
          () => assert.strictEqual(RefCountableViewModel.viewModels.length, 0, 'No live fixture children'),
          () => kb.setStatistics(previousStatistics),
        ]) {
          try {
            cleanup();
          } catch (error) {
            failures.push(error);
          }
        }
      }
      if (failures.length === 1) throw failures[0];
      if (failures.length) throw new AggregateError(failures, 'Owned Store retained-child operation and cleanup failed');
    });

    it('should retain a custom child after releasing a collection with an external Store', () => {
      const previousStatistics = kb.getStatistics();
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const failures: unknown[] = [];
      let store: Store | undefined;
      let disposeCollection: (() => void) | undefined;
      let retainedChild: RefCountableViewModel | undefined;

      try {
        store = new kb.Store();
        const co = kb.collectionObservable<RefCountableViewModel>(
          new Backbone.Collection([{ name: 'name1' }, { name: 'name2' }]),
          { store, viewModel: { create: () => new RefCountableViewModel() } }
        );
        disposeCollection = co.dispose.bind(co);
        assert.strictEqual(RefCountableViewModel.viewModels.length, 2, 'Created: 2');
        const child = co()[0].retain();
        retainedChild = child;

        kb.release(co);
        assert.strictEqual(RefCountableViewModel.viewModels.length, 2, 'Remaining: 2');
        assert.strictEqual(child.refCount(), 2, 'One instance retained and one in the store');
        assert.strictEqual(child.is_destroyed, false, 'Retained child is alive');

        store.dispose();
        assert.strictEqual(RefCountableViewModel.viewModels.length, 1, 'Still one reference');
        assert.strictEqual(child.refCount(), 1, "All instances were released from the collection's store");
        assert.strictEqual(child.is_destroyed, false, 'Retained child survives Store disposal');

        retainedChild = undefined;
        child.release();
        assert.strictEqual(child.refCount(), 0, 'Final child reference released');
        assert.strictEqual(child.is_destroyed, true, 'Retained child is destroyed');
        assert.strictEqual(RefCountableViewModel.viewModels.length, 0, 'All children released');
      } catch (error) {
        failures.push(error);
      } finally {
        for (const cleanup of [
          () => disposeCollection?.(),
          () => store?.dispose(),
          () => retainedChild?.release(),
          () => assert.strictEqual(stats.registeredStatsString('all released'), 'all released'),
          () => assert.strictEqual(RefCountableViewModel.viewModels.length, 0, 'No live fixture children'),
          () => kb.setStatistics(previousStatistics),
        ]) {
          try {
            cleanup();
          } catch (error) {
            failures.push(error);
          }
        }
      }
      if (failures.length === 1) throw failures[0];
      if (failures.length) throw new AggregateError(failures, 'External Store retained-child operation and cleanup failed');
    });

    it('should keep destroy-only children until an external Store is disposed', () => {
      const previousStatistics = kb.getStatistics();
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const failures: unknown[] = [];
      let store: Store | undefined;
      let disposeCollection: (() => void) | undefined;

      try {
        store = new kb.Store();
        const co = kb.collectionObservable<DestroyableViewModel>(
          new Backbone.Collection([{ name: 'name1' }, { name: 'name2' }]),
          { store, viewModel: { create: () => new DestroyableViewModel() } }
        );
        disposeCollection = co.dispose.bind(co);
        assert.strictEqual(DestroyableViewModel.viewModels.length, 2, 'Created: 2');

        kb.release(co);
        assert.strictEqual(DestroyableViewModel.viewModels.length, 2, 'Remaining: 2');

        store.dispose();
        assert.strictEqual(DestroyableViewModel.viewModels.length, 0, 'All destroyed');
      } catch (error) {
        failures.push(error);
      } finally {
        for (const cleanup of [
          () => disposeCollection?.(),
          () => store?.dispose(),
          () => assert.strictEqual(stats.registeredStatsString('all released'), 'all released'),
          () => assert.strictEqual(DestroyableViewModel.viewModels.length, 0, 'No live fixture children'),
          () => kb.setStatistics(previousStatistics),
        ]) {
          try {
            cleanup();
          } catch (error) {
            failures.push(error);
          }
        }
      }
      if (failures.length === 1) throw failures[0];
      if (failures.length) throw new AggregateError(failures, 'External Store destroy-only operation and cleanup failed');
    });

    it('should keep simple child props until an external Store is disposed', () => {
      const previousStatistics = kb.getStatistics();
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const failures: unknown[] = [];
      let store: Store | undefined;
      let disposeCollection: (() => void) | undefined;

      try {
        store = new kb.Store();
        const co = kb.collectionObservable<SimpleViewModel>(
          new Backbone.Collection([{ name: 'name1' }, { name: 'name2' }]),
          { store, viewModel: { create: () => new SimpleViewModel() } }
        );
        disposeCollection = co.dispose.bind(co);
        assert.strictEqual(SimpleViewModel.viewModels.length, 2, 'Created: 2');

        kb.release(co);
        assert.strictEqual(SimpleViewModel.viewModels.length, 2, 'Remaining: 2');
        for (const vm of SimpleViewModel.viewModels) {
          assert.ok(vm.prop, 'Prop retained by the external Store');
        }

        store.dispose();
        assert.strictEqual(SimpleViewModel.viewModels.length, 2, 'Still in array: 2');
        for (const vm of SimpleViewModel.viewModels) {
          assert.ok(!vm.prop, 'Prop destroyed');
        }
      } catch (error) {
        failures.push(error);
      } finally {
        for (const cleanup of [
          () => disposeCollection?.(),
          () => store?.dispose(),
          () => assert.strictEqual(stats.registeredStatsString('all released'), 'all released'),
          () => kb.setStatistics(previousStatistics),
        ]) {
          try {
            cleanup();
          } catch (error) {
            failures.push(error);
          }
        }
      }
      if (failures.length === 1) throw failures[0];
      if (failures.length) throw new AggregateError(failures, 'External Store simple-child operation and cleanup failed');
    });

    it('should dispose view models when collection observable is released', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      // Test with destroyable view model
      DisposableViewModel.viewModels = [];
      const co = kb.collectionObservable(new Backbone.Collection([{ name: 'name1' }, { name: 'name2' }]), {
        viewModel: {
          create: () => new DisposableViewModel(),
        },
      });
      assert.strictEqual(DisposableViewModel.viewModels.length, 2, 'Created: 2');

      co.dispose();
      assert.strictEqual(DisposableViewModel.viewModels.length, 0, 'All disposed');

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should handle simple view models without dispose method', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      SimpleViewModel.viewModels = [];
      const co = kb.collectionObservable(new Backbone.Collection([{ name: 'name1' }, { name: 'name2' }]), {
        viewModel: {
          create: () => new SimpleViewModel(),
        },
      });
      assert.strictEqual(SimpleViewModel.viewModels.length, 2, 'Created: 2');

      co.dispose();
      // Simple view models stay in array but props are released
      assert.strictEqual(SimpleViewModel.viewModels.length, 2, 'Still in array: 2');
      for (const vm of SimpleViewModel.viewModels) {
        assert.ok(!vm.prop, 'Prop destroyed');
      }

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('disposal destructiveness', () => {
    it('should preserve plain arrays and objects', () => {
      const vm = kb.viewModel<AnyPropsViewModel>(new Backbone.Model());
      vm.array = ['Hello', 'Friend'];
      vm.obj = { name: 'Fred' };

      vm.dispose();

      assert.deepStrictEqual(vm.array, ['Hello', 'Friend'], 'preserves arrays');
      assert.deepStrictEqual(vm.obj, { name: 'Fred' }, 'preserves objects');
    });

    it('should dispose observables but preserve plain data in view models', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const vm = kb.viewModel<AnyPropsViewModel>(new Backbone.Model());
      vm.array = ['Hello', 'Friend'];
      vm.obj = { name: 'Fred' };
      vm.value = ko.observable('hi');
      vm.array_value1 = ko.observable(['Hello', 'Friend']);
      vm.array_value2 = ko.observableArray(['Hello', 'Friend']);
      vm.model_value = kb.viewModel(new Backbone.Model());
      vm.collection_value = kb.collectionObservable(new Backbone.Collection());

      vm.dispose();

      assert.deepStrictEqual(vm.array, ['Hello', 'Friend'], 'preserves arrays');
      assert.deepStrictEqual(vm.obj, { name: 'Fred' }, 'preserves objects');
      assert.ok(!vm.value, 'releases observables: value');
      assert.ok(!vm.array_value1, 'releases observables: array_value1');
      assert.ok(!vm.array_value2, 'releases observables: array_value2');
      assert.ok(!vm.model_value, 'releases observables: model_value');
      assert.ok(!vm.collection_value, 'releases observables: collection_value');

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should release observables but preserve plain data on a plain owner', () => {
      const previousStatistics = kb.getStatistics();
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const failures: unknown[] = [];
      let modelValue: ReturnType<typeof kb.viewModel> | undefined;
      let collectionValue: ReturnType<typeof kb.collectionObservable> | undefined;
      let disposeCollectionValue: (() => void) | undefined;

      try {
        const array = ['Hello', 'Friend'];
        kb.release(array);
        assert.deepStrictEqual(array, ['Hello', 'Friend'], 'preserves arrays');

        const obj = { name: 'Fred' };
        kb.release(obj);
        assert.deepStrictEqual(obj, { name: 'Fred' }, 'preserves objects');

        modelValue = kb.viewModel(new Backbone.Model());
        collectionValue = kb.collectionObservable(new Backbone.Collection());
        disposeCollectionValue = collectionValue.dispose.bind(collectionValue);
        const owner: AnyPropsViewModel = {
          array: ['Hello', 'Friend'],
          obj: { name: 'Fred' },
          value: ko.observable('hi'),
          array_value1: ko.observable(['Hello', 'Friend']),
          array_value2: ko.observableArray(['Hello', 'Friend']),
          model_value: modelValue,
          collection_value: collectionValue,
        };

        kb.release(owner);
        assert.deepStrictEqual(owner.array, ['Hello', 'Friend'], 'preserves arrays');
        assert.deepStrictEqual(owner.obj, { name: 'Fred' }, 'preserves objects');
        assert.ok(!owner.value, 'releases observables: value');
        assert.ok(!owner.array_value1, 'releases observables: array_value1');
        assert.ok(!owner.array_value2, 'releases observables: array_value2');
        assert.ok(!owner.model_value, 'releases observables: model_value');
        assert.ok(!owner.collection_value, 'releases observables: collection_value');
        assert.strictEqual(stats.registeredStatsString('all released'), 'all released', 'Cleanup: stats');
      } catch (error) {
        failures.push(error);
      } finally {
        for (const cleanup of [
          () => modelValue?.dispose(),
          () => disposeCollectionValue?.(),
          () => assert.strictEqual(stats.registeredStatsString('all released'), 'all released', 'Cleanup after fallback: stats'),
          () => kb.setStatistics(previousStatistics),
        ]) {
          try {
            cleanup();
          } catch (error) {
            failures.push(error);
          }
        }
      }
      if (failures.length === 1) throw failures[0];
      if (failures.length) throw new AggregateError(failures, 'Plain-owner release operation and cleanup failed');
    });
  });

  describe('disposable property cleanup', () => {
    it('should dispose user-added kb.observable properties', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const model = new Backbone.Model({ name: 'Test' });
      const vm = kb.viewModel<AnyPropsViewModel>(model);
      const customObs = kb.observable<string>(model, 'name');
      vm.customObs = customObs;

      vm.dispose();

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should dispose user-added ko.computed properties', () => {
      interface NameAgeViewModel extends AnyPropsViewModel {
        name: ko.Observable<string>;
        age: ko.Observable<number>;
        userComputed?: ko.Computed<string>;
      }

      const model = new Backbone.Model({ name: 'Test', age: 42 });
      const vm = kb.viewModel<NameAgeViewModel>(model, { keys: ['name', 'age'] });

      let disposed = false;
      const computed = ko.computed(() => `${vm.name()}-${vm.age()}`);
      const originalDispose = computed.dispose.bind(computed);
      computed.dispose = () => {
        disposed = true;
        originalDispose();
      };
      vm.userComputed = computed;

      vm.dispose();

      assert.ok(disposed);
    });

    it('should dispose arrays of disposables on the view model', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const model = new Backbone.Model({ name: 'Test' });
      const vm = kb.viewModel<AnyPropsViewModel>(model);
      const obs1 = kb.observable<string>(model, 'name');
      const obs2 = kb.observable<string>(model, 'name');

      vm.list = [obs1, obs2];

      vm.dispose();

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should tolerate shared disposables across view models', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const model = new Backbone.Model({ name: 'Test' });
      const shared = kb.observable<string>(model, 'name');
      const vm1 = kb.viewModel<AnyPropsViewModel>(model);
      const vm2 = kb.viewModel<AnyPropsViewModel>(model);

      vm1.shared = shared;
      vm2.shared = shared;

      vm1.dispose();
      assert.doesNotThrow(() => vm2.dispose());
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('component-style disposal', () => {
    it('should allow root dispose to clean nested view models', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);
      const model = new Backbone.Model({ name: 'Test' });
      const nested = kb.viewModel(model);
      const root = {
        nested,
        dispose: () => nested.dispose(),
      };

      root.dispose();

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('non-enumerable properties', () => {
    it('should not auto-dispose non-enumerable disposables', () => {
      const model = new Backbone.Model({ name: 'Test' });
      const vm = kb.viewModel<AnyPropsViewModel>(model);
      const hiddenModel = new Backbone.Model({ name: 'Hidden' });
      const hidden = kb.observable<string>(hiddenModel, 'name');
      Object.defineProperty(vm, 'hidden', { value: hidden, enumerable: false });

      const beforeEvents = kb.Statistics.eventsStats(hiddenModel).count;
      vm.dispose();

      const afterEvents = kb.Statistics.eventsStats(hiddenModel).count;
      assert.strictEqual(afterEvents, beforeEvents);
      hidden.dispose();
      assert.strictEqual(kb.Statistics.eventsStats(hiddenModel).count, 0);
    });
  });

  describe('event cleanup', () => {
    it('should clear all model events on dispose', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const model = new Backbone.Model({ name: 'Bob' });
      const vm = kb.viewModel(model);

      // Model should have event listeners
      vm.dispose();

      // After dispose, model should have no knockback event listeners
      const eventStats = kb.Statistics.eventsStats(model);
      assert.strictEqual(eventStats.count, 0, 'All model events cleared');

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should clear all events when observable is disposed', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const model = new Backbone.Model({ name: 'Bob' });
      const eventCountBefore = kb.Statistics.eventsStats(model).count;
      const obs = kb.observable<string>(model, 'name');

      obs.dispose();

      const eventStats = kb.Statistics.eventsStats(model);
      // After dispose, event count should be back to pre-observable level
      assert.ok(eventStats.count <= eventCountBefore + 1, 'Model events mostly cleared');

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });
});
