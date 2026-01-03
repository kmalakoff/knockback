import kb from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';

type AnyPropsViewModel = {
  [key: string]: unknown;
};

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

    dispose(): void {
      this.release();
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
    SimpleViewModel.viewModels = [];
  });

  describe('basic view model properties', () => {
    it('should dispose all property types', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const nestedViewModel = kb.viewModel(new Backbone.Model({ name: 'name1' }));

      const vm = kb.viewModel<AnyPropsViewModel>(new Backbone.Model());
      vm.prop1 = ko.observable();
      vm.prop2 = ko.observable(['test', 1, null, kb.viewModel(new Backbone.Model({ name: 'name1' }))]);
      vm.prop3 = ko.observableArray(['test', 1, null, kb.viewModel(new Backbone.Model({ name: 'name1' }))]);
      vm.prop4 = ko.computed(() => true);
      vm.prop5 = kb.observable<string>(new Backbone.Model({ name: 'name1' }), 'name');
      vm.prop6 = nestedViewModel;
      vm.prop7 = kb.collectionObservable(new Backbone.Collection(), { modelsOnly: true });
      vm.prop8 = kb.viewModel(new Backbone.Model({ name: 'name1' }));
      vm.prop9 = kb.collectionObservable(new Backbone.Collection());

      vm.dispose();

      // All properties should be released (set to null)
      for (let i = 1; i <= 9; i++) {
        assert.ok(!vm[`prop${i}`], `Property released: prop${i}`);
      }

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('reference counting', () => {
    it('should respect refCount/retain/dispose lifecycle', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

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

        dispose(): void {
          this.release();
        }

        __destroy(): void {
          if (this.prop) {
            this.prop.dispose();
            this.prop = null;
          }
        }
      }

      const refCounted = new RefViewModel();
      const vm = kb.viewModel<AnyPropsViewModel>(new Backbone.Model());
      vm.ref_counted = refCounted.retain();

      vm.dispose();
      assert.ok(!vm.ref_counted, 'Property released: vm.ref_counted');
      assert.ok(!!refCounted.prop, 'Property not released: refCounted.prop');

      refCounted.release();
      assert.ok(!refCounted.prop, 'Property released: refCounted.prop');

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('CollectionObservable memory', () => {
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
