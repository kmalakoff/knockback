import kb from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';

describe('ViewModel advanced', () => {
  describe('options', () => {
    it('should support keys option to limit observables', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface KeysViewModel {
        name: ko.Observable<string>;
        age: ko.Observable<number>;
        email?: ko.Observable<string>;
        phone?: ko.Observable<string>;
      }

      const model = new Backbone.Model({ name: 'Bob', age: 30, email: 'bob@test.com', phone: '555-1234' });
      const vm = kb.viewModel<KeysViewModel>(model, { keys: ['name', 'age'] });

      assert.ok(ko.isObservable(vm.name), 'name is observable');
      assert.ok(ko.isObservable(vm.age), 'age is observable');
      assert.strictEqual(vm.email, undefined, 'email not created');
      assert.strictEqual(vm.phone, undefined, 'phone not created');

      vm.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should support excludes option', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface ExcludesViewModel {
        name: ko.Observable<string>;
        email: ko.Observable<string>;
        password?: ko.Observable<string>;
      }

      const model = new Backbone.Model({ name: 'Bob', password: 'secret', email: 'bob@test.com' });
      const vm = kb.viewModel<ExcludesViewModel>(model, { excludes: ['password'] });

      assert.ok(ko.isObservable(vm.name), 'name is observable');
      assert.ok(ko.isObservable(vm.email), 'email is observable');
      assert.strictEqual(vm.password, undefined, 'password excluded');

      vm.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should support internals option with underscore prefix', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface InternalsViewModel {
        name: ko.Observable<string>;
        _id: ko.Observable<number>;
        id?: ko.Observable<number>;
      }

      const model = new Backbone.Model({ name: 'Bob', id: 123 });
      const vm = kb.viewModel<InternalsViewModel>(model, { internals: ['id'] });

      assert.ok(ko.isObservable(vm.name), 'name is observable');
      assert.ok(ko.isObservable(vm._id), 'id renamed to _id');
      assert.strictEqual(vm.id, undefined, 'original id not present');

      vm.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should support requires option', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface RequiresViewModel {
        name: ko.Observable<string>;
        age: ko.Observable<number | null>;
        email: ko.Observable<string | null>;
      }

      const model: Backbone.Model<Record<string, unknown>> = new Backbone.Model();
      model.set('name', 'Bob');
      const vm = kb.viewModel<RequiresViewModel>(model, { requires: ['name', 'age', 'email'] });

      // All required keys should be observables even if not in model
      assert.ok(ko.isObservable(vm.name), 'name is observable');
      assert.ok(ko.isObservable(vm.age), 'age is observable (required)');
      assert.ok(ko.isObservable(vm.email), 'email is observable (required)');

      assert.strictEqual(vm.name(), 'Bob');
      // Observables for non-existent model attributes return null
      assert.strictEqual(vm.age(), null);
      assert.strictEqual(vm.email(), null);

      vm.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('statics and staticDefaults', () => {
    it('should support statics option for non-observable values', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface StaticsViewModel {
        name: ko.Observable<string>;
        type: string;
      }

      const model = new Backbone.Model({ name: 'Bob', type: 'admin' });
      const vm = kb.viewModel<StaticsViewModel>(model, { statics: ['type'] });

      assert.ok(ko.isObservable(vm.name), 'name is observable');
      assert.ok(!ko.isObservable(vm.type), 'type is NOT observable');
      assert.strictEqual(vm.type, 'admin', 'type has correct value');

      // Static value should not change when model changes
      model.set('type', 'user');
      assert.strictEqual(vm.type, 'admin', 'static type unchanged');

      vm.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should support staticDefaults option', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface StaticDefaultsViewModel {
        name?: ko.Observable<string>;
        type: string;
        role: string;
      }

      const model = new Backbone.Model<{ name: string; age?: number }>({ name: 'Bob' });
      const vm = kb.viewModel<StaticDefaultsViewModel>(model, {
        statics: ['type', 'role'],
        staticDefaults: { type: 'guest', role: 'viewer' },
      });

      assert.strictEqual(vm.type, 'guest', 'type has default value');
      assert.strictEqual(vm.role, 'viewer', 'role has default value');

      vm.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('model observable', () => {
    it('should expose model as observable', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface ShareOptionsViewModel {
        shareOptions: () => { store: unknown; factory: unknown };
      }

      const model: Backbone.Model<Record<string, unknown>> = new Backbone.Model();
      model.set('name', 'Bob');
      const vm = kb.viewModel<ShareOptionsViewModel>(model);

      assert.ok(ko.isObservable(vm.model), 'model is observable');
      assert.strictEqual(vm.model(), model, 'model() returns the model');

      vm.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should trigger updates when model changes', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface NameViewModel {
        name: ko.Observable<string>;
      }

      const model1 = new Backbone.Model({ name: 'Bob' });
      const model2 = new Backbone.Model({ name: 'Alice' });
      const vm = kb.viewModel<NameViewModel>(model1);

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

      vm.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('model replacement', () => {
    it('should update all observables when model is replaced', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface NameAgeViewModel {
        name: ko.Observable<string>;
        age: ko.Observable<number>;
      }

      const model1 = new Backbone.Model({ name: 'Bob', age: 30 });
      const model2 = new Backbone.Model({ name: 'Alice', age: 25 });
      const vm = kb.viewModel<NameAgeViewModel>(model1);

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

      vm.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('extend', () => {
    it('should support extend as an object literal', () => {
      const model: Backbone.Model<Record<string, unknown>> = new Backbone.Model();
      model.set('name', 'Bob');
      const vm = kb.viewModel<{ name: ko.Observable<string>; onEdit: () => void; isAdmin: ko.Observable<boolean> }>(model, {
        extend: {
          onEdit: () => model.set('name', 'Alice'),
          isAdmin: ko.observable(false),
        },
      });

      assert.strictEqual(vm.name(), 'Bob');
      vm.onEdit();
      assert.strictEqual(vm.name(), 'Alice');
      assert.strictEqual(vm.isAdmin(), false);
      vm.isAdmin(true);
      assert.strictEqual(vm.isAdmin(), true);

      vm.dispose();
    });

    it('should support extend as a mutating function', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const vm = kb.viewModel<{ name: ko.Observable<string>; onEdit: () => void; isAdmin: ko.Observable<boolean> }>(model, {
        extend: (viewModelInstance) => {
          viewModelInstance.onEdit = () => model.set('name', 'Alice');
          viewModelInstance.isAdmin = ko.observable(true);
        },
      });

      assert.strictEqual(vm.name(), 'Bob');
      vm.onEdit();
      assert.strictEqual(vm.name(), 'Alice');
      assert.strictEqual(vm.isAdmin(), true);

      vm.dispose();
    });

    it('should support extend as a function returning an object', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const vm = kb.viewModel<{ name: ko.Observable<string>; displayName: ko.Computed<string>; onEdit: () => void }>(model, {
        extend: (viewModelInstance) => ({
          displayName: ko.computed(() => `User: ${viewModelInstance.name()}`),
          onEdit: () => model.set('name', 'Alice'),
        }),
      });

      assert.strictEqual(vm.displayName(), 'User: Bob');
      vm.onEdit();
      assert.strictEqual(vm.displayName(), 'User: Alice');

      vm.dispose();
    });
  });

  describe('shareOptions', () => {
    it('should share store and factory between view models', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const model = new Backbone.Model({ name: 'Bob' });
      interface ShareOptionsViewModel {
        shareOptions: () => { store: unknown; factory: unknown };
      }

      const vm = kb.viewModel<ShareOptionsViewModel>(model);

      const options = vm.shareOptions();
      assert.ok(options.store, 'has store');
      assert.ok(options.factory, 'has factory');

      vm.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('createObservables', () => {
    it('should dynamically create observables for new keys', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface DynamicViewModel {
        name: ko.Observable<string>;
        age?: ko.Observable<number>;
        createObservables: (model: Backbone.Model, keys: string[]) => void;
      }

      const model: Backbone.Model<Record<string, unknown>> = new Backbone.Model();
      model.set('name', 'Bob');
      const vm = kb.viewModel<DynamicViewModel>(model, { keys: ['name'] });

      assert.ok(ko.isObservable(vm.name), 'name exists');
      assert.strictEqual(vm.age, undefined, 'age does not exist');

      // Add age to model and create observable
      model.set('age', 30);
      vm.createObservables(model, ['age']);

      assert.ok(ko.isObservable(vm.age), 'age now exists');
      assert.strictEqual(vm.age?.(), 30);

      vm.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('dependency isolation', () => {
    it('should not cause dependencies when setting values inside ko.computed', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface NameViewModel {
        name: ko.Observable<string>;
      }

      const model = new Backbone.Model({ name: 'Initial' });
      const vm = kb.viewModel<NameViewModel>(model);

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

      vm.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('mappings', () => {
    it('should support mappings option for key configuration', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface MappingViewModel {
        firstName: ko.Observable<string>;
        lastName: ko.Observable<string>;
        first_name?: ko.Observable<string>;
        last_name?: ko.Observable<string>;
      }

      const model = new Backbone.Model({ first_name: 'Bob', last_name: 'Smith' });
      const vm = kb.viewModel<MappingViewModel>(model, {
        keys: [], // Use empty keys to prevent auto-creation of model attributes
        mappings: {
          firstName: { key: 'first_name' },
          lastName: { key: 'last_name' },
        },
      });

      assert.ok(ko.isObservable(vm.firstName), 'firstName is observable');
      assert.ok(ko.isObservable(vm.lastName), 'lastName is observable');
      assert.strictEqual(vm.firstName(), 'Bob');
      assert.strictEqual(vm.lastName(), 'Smith');

      // With keys: [], original attributes should not be auto-created
      assert.strictEqual(vm.first_name, undefined, 'first_name not auto-created');
      assert.strictEqual(vm.last_name, undefined, 'last_name not auto-created');

      vm.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });
});
