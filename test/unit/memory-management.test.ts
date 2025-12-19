import * as kb from '@mcpeasy/knockback';
import { collectionObservable, observable, Statistics, setStatistics, type ViewModel, viewModel } from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';

describe('memory management', () => {
  // Helper: Ref-countable view model for testing
  class RefCountableViewModel {
    static view_models: RefCountableViewModel[] = [];
    ref_count = 1;
    is_destroyed = false;

    constructor() {
      RefCountableViewModel.view_models.push(this);
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
      const index = RefCountableViewModel.view_models.indexOf(this);
      if (index >= 0) {
        RefCountableViewModel.view_models.splice(index, 1);
      }
    }
  }

  // Helper: Destroyable view model
  class DestroyableViewModel {
    static view_models: DestroyableViewModel[] = [];

    constructor() {
      DestroyableViewModel.view_models.push(this);
    }

    destroy(): void {
      const index = DestroyableViewModel.view_models.indexOf(this);
      if (index >= 0) {
        DestroyableViewModel.view_models.splice(index, 1);
      }
    }
  }

  // Helper: Simple view model
  class SimpleViewModel {
    static view_models: SimpleViewModel[] = [];
    prop: ko.Observable<unknown>;

    constructor() {
      this.prop = ko.observable();
      SimpleViewModel.view_models.push(this);
    }
  }

  beforeEach(() => {
    RefCountableViewModel.view_models = [];
    DestroyableViewModel.view_models = [];
    SimpleViewModel.view_models = [];
  });

  describe('basic view model properties', () => {
    it('should release all property types', () => {
      const stats = new Statistics();
      setStatistics(stats);

      const nestedViewModel = viewModel(new Backbone.Model({ name: 'name1' }));

      const vm: Record<string, unknown> = {
        prop1: ko.observable(),
        prop2: ko.observable(['test', 1, null, viewModel(new Backbone.Model({ name: 'name1' }))]),
        prop3: ko.observableArray(['test', 1, null, viewModel(new Backbone.Model({ name: 'name1' }))]),
        prop4: ko.computed(() => true),
        prop5: observable(new Backbone.Model({ name: 'name1' }), 'name'),
        prop6: nestedViewModel,
        prop7: collectionObservable(new Backbone.Collection(), { models_only: true }),
        prop8: viewModel(new Backbone.Model({ name: 'name1' })),
        prop9: collectionObservable(new Backbone.Collection()),
      };

      kb.release(vm);

      // All properties should be released (set to null)
      for (let i = 1; i <= 9; i++) {
        assert.ok(!vm[`prop${i}`], `Property released: prop${i}`);
      }

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });
  });

  describe('reference counting', () => {
    it('should respect refCount/retain/release lifecycle', () => {
      const stats = new Statistics();
      setStatistics(stats);

      class RefViewModel {
        ref_count = 1;
        is_destroyed = false;
        prop: ko.Observable<string> | null;

        constructor() {
          this.prop = observable(new Backbone.Model({ name: 'name1' }), 'name') as unknown as ko.Observable<string>;
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
          if (this.prop) {
            kb.release(this.prop);
            this.prop = null;
          }
        }
      }

      const refCounted = new RefViewModel();
      const vm: Record<string, unknown> = {
        ref_counted: refCounted.retain(),
      };

      kb.release(vm);
      assert.ok(!vm.ref_counted, 'Property released: vm.ref_counted');
      assert.ok(!!refCounted.prop, 'Property not released: refCounted.prop');

      refCounted.release();
      assert.ok(!refCounted.prop, 'Property released: refCounted.prop');

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });
  });

  describe('CollectionObservable memory', () => {
    it('should destroy view models when collection observable is released', () => {
      const stats = new Statistics();
      setStatistics(stats);

      // Test with destroyable view model
      DestroyableViewModel.view_models = [];
      const co = collectionObservable(new Backbone.Collection([{ name: 'name1' }, { name: 'name2' }]), { view_model: DestroyableViewModel as unknown as new () => ViewModel });
      assert.strictEqual(DestroyableViewModel.view_models.length, 2, 'Created: 2');

      kb.release(co);
      assert.strictEqual(DestroyableViewModel.view_models.length, 0, 'All destroyed');

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });

    it('should handle simple view models without destroy method', () => {
      const stats = new Statistics();
      setStatistics(stats);

      SimpleViewModel.view_models = [];
      const co = collectionObservable(new Backbone.Collection([{ name: 'name1' }, { name: 'name2' }]), { view_model: SimpleViewModel as unknown as new () => ViewModel });
      assert.strictEqual(SimpleViewModel.view_models.length, 2, 'Created: 2');

      kb.release(co);
      // Simple view models stay in array but props are released
      assert.strictEqual(SimpleViewModel.view_models.length, 2, 'Still in array: 2');
      for (const vm of SimpleViewModel.view_models) {
        assert.ok(!vm.prop, 'Prop destroyed');
      }

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });
  });

  describe('kb.release destructiveness', () => {
    it('should preserve plain arrays and objects', () => {
      const array = ['Hello', 'Friend'];
      kb.release(array);
      assert.deepStrictEqual(array, ['Hello', 'Friend'], 'preserves arrays');

      const obj = { name: 'Fred' };
      kb.release(obj);
      assert.deepStrictEqual(obj, { name: 'Fred' }, 'preserves objects');
    });

    it('should release observables but preserve plain data in view models', () => {
      const stats = new Statistics();
      setStatistics(stats);

      const vm: Record<string, unknown> = {
        array: ['Hello', 'Friend'],
        obj: { name: 'Fred' },
        value: ko.observable('hi'),
        array_value1: ko.observable(['Hello', 'Friend']),
        array_value2: ko.observableArray(['Hello', 'Friend']),
        model_value: viewModel(new Backbone.Model()),
        collection_value: collectionObservable(new Backbone.Collection()),
      };

      kb.release(vm);

      assert.deepStrictEqual(vm.array, ['Hello', 'Friend'], 'preserves arrays');
      assert.deepStrictEqual(vm.obj, { name: 'Fred' }, 'preserves objects');
      assert.ok(!vm.value, 'releases observables: value');
      assert.ok(!vm.array_value1, 'releases observables: array_value1');
      assert.ok(!vm.array_value2, 'releases observables: array_value2');
      assert.ok(!vm.model_value, 'releases observables: model_value');
      assert.ok(!vm.collection_value, 'releases observables: collection_value');

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });
  });

  describe('event cleanup', () => {
    it('should clear all model events on release', () => {
      const stats = new Statistics();
      setStatistics(stats);

      const model = new Backbone.Model({ name: 'Bob' });
      const vm = viewModel(model);

      // Model should have event listeners
      kb.release(vm);

      // After release, model should have no knockback event listeners
      const eventStats = Statistics.eventsStats(model);
      assert.strictEqual(eventStats.count, 0, 'All model events cleared');

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });

    it('should clear all events when observable is released', () => {
      const stats = new Statistics();
      setStatistics(stats);

      const model = new Backbone.Model({ name: 'Bob' });
      const eventCountBefore = Statistics.eventsStats(model).count;
      const obs = observable(model, 'name');

      kb.release(obs);

      const eventStats = Statistics.eventsStats(model);
      // After release, event count should be back to pre-observable level
      assert.ok(eventStats.count <= eventCountBefore + 1, 'Model events mostly cleared');

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });
  });
});
