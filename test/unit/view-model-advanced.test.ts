import assert from 'assert';
import Backbone from 'backbone';
import * as kb from '@mcpeasy/knockback';
import { Statistics, setStatistics, type ViewModel, viewModel } from '@mcpeasy/knockback';
import ko from 'knockout';

describe('ViewModel advanced', () => {
  describe('options', () => {
    it('should support keys option to limit observables', () => {
      const stats = new Statistics();
      setStatistics(stats);

      const model = new Backbone.Model({ name: 'Bob', age: 30, email: 'bob@test.com', phone: '555-1234' });
      const vm = viewModel(model, { keys: ['name', 'age'] }) as Record<string, unknown>;

      assert.ok(ko.isObservable(vm.name), 'name is observable');
      assert.ok(ko.isObservable(vm.age), 'age is observable');
      assert.strictEqual(vm.email, undefined, 'email not created');
      assert.strictEqual(vm.phone, undefined, 'phone not created');

      kb.release(vm);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });

    it('should support excludes option', () => {
      const stats = new Statistics();
      setStatistics(stats);

      const model = new Backbone.Model({ name: 'Bob', password: 'secret', email: 'bob@test.com' });
      const vm = viewModel(model, { excludes: ['password'] }) as Record<string, unknown>;

      assert.ok(ko.isObservable(vm.name), 'name is observable');
      assert.ok(ko.isObservable(vm.email), 'email is observable');
      assert.strictEqual(vm.password, undefined, 'password excluded');

      kb.release(vm);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });

    it('should support internals option with underscore prefix', () => {
      const stats = new Statistics();
      setStatistics(stats);

      const model = new Backbone.Model({ name: 'Bob', id: 123 });
      const vm = viewModel(model, { internals: ['id'] }) as Record<string, unknown>;

      assert.ok(ko.isObservable(vm.name), 'name is observable');
      assert.ok(ko.isObservable(vm._id), 'id renamed to _id');
      assert.strictEqual(vm.id, undefined, 'original id not present');

      kb.release(vm);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });

    it('should support requires option', () => {
      const stats = new Statistics();
      setStatistics(stats);

      const model = new Backbone.Model({ name: 'Bob' });
      const vm = viewModel(model, { requires: ['name', 'age', 'email'] }) as Record<string, unknown>;

      // All required keys should be observables even if not in model
      assert.ok(ko.isObservable(vm.name), 'name is observable');
      assert.ok(ko.isObservable(vm.age), 'age is observable (required)');
      assert.ok(ko.isObservable(vm.email), 'email is observable (required)');

      assert.strictEqual((vm.name as ko.Observable)(), 'Bob');
      // Observables for non-existent model attributes return null
      assert.strictEqual((vm.age as ko.Observable)(), null);
      assert.strictEqual((vm.email as ko.Observable)(), null);

      kb.release(vm);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });
  });

  describe('statics and static_defaults', () => {
    it('should support statics option for non-observable values', () => {
      const stats = new Statistics();
      setStatistics(stats);

      const model = new Backbone.Model({ name: 'Bob', type: 'admin' });
      const vm = viewModel(model, { statics: ['type'] }) as Record<string, unknown>;

      assert.ok(ko.isObservable(vm.name), 'name is observable');
      assert.ok(!ko.isObservable(vm.type), 'type is NOT observable');
      assert.strictEqual(vm.type, 'admin', 'type has correct value');

      // Static value should not change when model changes
      model.set('type', 'user');
      assert.strictEqual(vm.type, 'admin', 'static type unchanged');

      kb.release(vm);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });

    it('should support static_defaults option', () => {
      const stats = new Statistics();
      setStatistics(stats);

      const model = new Backbone.Model({ name: 'Bob' });
      const vm = viewModel(model, {
        statics: ['type', 'role'],
        static_defaults: { type: 'guest', role: 'viewer' },
      }) as Record<string, unknown>;

      assert.strictEqual(vm.type, 'guest', 'type has default value');
      assert.strictEqual(vm.role, 'viewer', 'role has default value');

      kb.release(vm);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });
  });

  describe('model observable', () => {
    it('should expose model as observable', () => {
      const stats = new Statistics();
      setStatistics(stats);

      const model = new Backbone.Model({ name: 'Bob' });
      const vm = viewModel(model) as ViewModel;

      assert.ok(ko.isObservable(vm.model), 'model is observable');
      assert.strictEqual(vm.model(), model, 'model() returns the model');

      kb.release(vm);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });

    it('should trigger updates when model changes', () => {
      const stats = new Statistics();
      setStatistics(stats);

      const model1 = new Backbone.Model({ name: 'Bob' });
      const model2 = new Backbone.Model({ name: 'Alice' });
      const vm = viewModel(model1) as ViewModel & { name: ko.Observable<string> };

      let modelChangeCount = 0;
      ko.computed(() => {
        vm.model();
        modelChangeCount++;
      });

      const initialCount = modelChangeCount;
      assert.ok(initialCount >= 1, 'Initial evaluation');
      assert.strictEqual(vm.name(), 'Bob');

      vm.model(model2);
      assert.ok(modelChangeCount > initialCount, 'Model changed triggered update');
      assert.strictEqual(vm.name(), 'Alice');

      kb.release(vm);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });
  });

  describe('model replacement', () => {
    it('should update all observables when model is replaced', () => {
      const stats = new Statistics();
      setStatistics(stats);

      const model1 = new Backbone.Model({ name: 'Bob', age: 30 });
      const model2 = new Backbone.Model({ name: 'Alice', age: 25 });
      const vm = viewModel(model1) as ViewModel & { name: ko.Observable<string>; age: ko.Observable<number> };

      assert.strictEqual(vm.name(), 'Bob');
      assert.strictEqual(vm.age(), 30);

      vm.model(model2);

      assert.strictEqual(vm.name(), 'Alice');
      assert.strictEqual(vm.age(), 25);

      // Changes to old model should not affect VM
      model1.set('name', 'Bobby');
      assert.strictEqual(vm.name(), 'Alice');

      // Changes to new model should affect VM
      model2.set('name', 'Alicia');
      assert.strictEqual(vm.name(), 'Alicia');

      kb.release(vm);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });
  });

  describe('shareOptions', () => {
    it('should share store and factory between view models', () => {
      const stats = new Statistics();
      setStatistics(stats);

      const model = new Backbone.Model({ name: 'Bob' });
      const vm = viewModel(model) as ViewModel;

      const options = vm.shareOptions();
      assert.ok(options.store, 'has store');
      assert.ok(options.factory, 'has factory');

      kb.release(vm);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });
  });

  describe('createObservables', () => {
    it('should dynamically create observables for new keys', () => {
      const stats = new Statistics();
      setStatistics(stats);

      // biome-ignore lint/suspicious/noExplicitAny: Creating untyped model for dynamic attributes
      const model: any = new Backbone.Model({ name: 'Bob' });
      const vm = viewModel(model, { keys: ['name'] }) as ViewModel & Record<string, unknown>;

      assert.ok(ko.isObservable(vm.name), 'name exists');
      assert.strictEqual(vm.age, undefined, 'age does not exist');

      // Add age to model and create observable
      model.set('age', 30);
      vm.createObservables(model, ['age']);

      assert.ok(ko.isObservable(vm.age), 'age now exists');
      assert.strictEqual((vm.age as ko.Observable)(), 30);

      kb.release(vm);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });
  });

  describe('dependency isolation', () => {
    it('should not cause dependencies when setting values inside ko.computed', () => {
      const stats = new Statistics();
      setStatistics(stats);

      const model = new Backbone.Model({ name: 'Initial' });
      const vm = viewModel(model) as ViewModel & { name: ko.Observable<string> };

      let writeCount = 0;
      ko.computed(() => {
        vm.name('Written');
        writeCount++;
      });

      let readCount = 0;
      ko.computed(() => {
        vm.name();
        readCount++;
      });

      assert.strictEqual(writeCount, 1, 'Write computed ran once');
      assert.strictEqual(readCount, 1, 'Read computed ran once');

      vm.name('Update');
      assert.strictEqual(writeCount, 1, 'Write computed did not re-run');
      assert.strictEqual(readCount, 2, 'Read computed re-ran');

      kb.release(vm);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });
  });

  describe('mappings', () => {
    it('should support mappings option for key configuration', () => {
      const stats = new Statistics();
      setStatistics(stats);

      const model = new Backbone.Model({ first_name: 'Bob', last_name: 'Smith' });
      const vm = viewModel(model, {
        keys: [], // Use empty keys to prevent auto-creation of model attributes
        mappings: {
          firstName: { key: 'first_name' },
          lastName: { key: 'last_name' },
        },
      }) as Record<string, unknown>;

      assert.ok(ko.isObservable(vm.firstName), 'firstName is observable');
      assert.ok(ko.isObservable(vm.lastName), 'lastName is observable');
      assert.strictEqual((vm.firstName as ko.Observable)(), 'Bob');
      assert.strictEqual((vm.lastName as ko.Observable)(), 'Smith');

      // With keys: [], original attributes should not be auto-created
      assert.strictEqual(vm.first_name, undefined, 'first_name not auto-created');
      assert.strictEqual(vm.last_name, undefined, 'last_name not auto-created');

      kb.release(vm);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      setStatistics(null);
    });
  });
});
