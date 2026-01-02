import kb, { viewModel } from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';

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

    it('should support models_only option', () => {
      const collection = new Backbone.Collection([{ name: 'Bob' }]);
      const co = kb.collectionObservable(collection, { models_only: true });

      assert.strictEqual(co().length, 1);
      assert.ok(co()[0] instanceof Backbone.Model);
    });
  });

  describe('dispose()', () => {
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
