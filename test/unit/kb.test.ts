import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';
import kb, { observable, viewModel, collectionObservable, ViewModel, Observable, CollectionObservable, TYPE_SIMPLE, TYPE_MODEL, TYPE_COLLECTION } from 'knockback';

describe('knockback', () => {
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

    it('should export Backbone, ko, and _', () => {
      assert.ok(kb.Backbone);
      assert.ok(kb.ko);
      assert.ok(kb._);
    });
  });

  describe('kb.observable', () => {
    it('should create an observable from a model attribute', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const nameObs = observable(model, 'name');

      assert.strictEqual(nameObs(), 'Bob');
    });

    it('should update when model changes', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const nameObs = observable(model, 'name');

      assert.strictEqual(nameObs(), 'Bob');
      model.set('name', 'Fred');
      assert.strictEqual(nameObs(), 'Fred');
    });

    it('should update model when observable changes', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const nameObs = observable(model, 'name');

      nameObs('Alice');
      assert.strictEqual(model.get('name'), 'Alice');
    });
  });

  describe('kb.viewModel', () => {
    it('should create observables for all model attributes', () => {
      const model = new Backbone.Model({ first_name: 'Bob', last_name: 'Smith' });
      const vm = viewModel(model);

      assert.ok(ko.isObservable((vm as Record<string, unknown>).first_name));
      assert.ok(ko.isObservable((vm as Record<string, unknown>).last_name));
      assert.strictEqual(((vm as Record<string, unknown>).first_name as ko.Observable)(), 'Bob');
      assert.strictEqual(((vm as Record<string, unknown>).last_name as ko.Observable)(), 'Smith');
    });

    it('should sync changes with model', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const vm = viewModel(model);

      ((vm as Record<string, unknown>).name as ko.Observable)('Fred');
      assert.strictEqual(model.get('name'), 'Fred');

      model.set('name', 'Alice');
      assert.strictEqual(((vm as Record<string, unknown>).name as ko.Observable)(), 'Alice');
    });

    it('should support keys option', () => {
      const model = new Backbone.Model({ name: 'Bob', age: 30, email: 'bob@example.com' });
      const vm = viewModel(model, { keys: ['name', 'age'] });

      assert.ok(ko.isObservable((vm as Record<string, unknown>).name));
      assert.ok(ko.isObservable((vm as Record<string, unknown>).age));
      assert.strictEqual((vm as Record<string, unknown>).email, undefined);
    });
  });

  describe('kb.collectionObservable', () => {
    it('should create an observable array from a collection', () => {
      const collection = new Backbone.Collection([
        { name: 'Bob' },
        { name: 'Fred' },
      ]);
      const co = collectionObservable(collection);

      assert.ok(ko.isObservableArray(co));
      assert.strictEqual(co().length, 2);
    });

    it('should update when collection changes', () => {
      const collection = new Backbone.Collection([{ name: 'Bob' }]);
      const co = collectionObservable(collection);

      assert.strictEqual(co().length, 1);

      collection.add({ name: 'Fred' });
      assert.strictEqual(co().length, 2);

      collection.remove(collection.at(0));
      assert.strictEqual(co().length, 1);
    });

    it('should support models_only option', () => {
      const collection = new Backbone.Collection([{ name: 'Bob' }]);
      const co = collectionObservable(collection, { models_only: true });

      assert.strictEqual(co().length, 1);
      assert.ok(co()[0] instanceof Backbone.Model);
    });
  });

  describe('kb.release', () => {
    it('should release view models', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const vm = viewModel(model);

      assert.ok(!kb.wasReleased(vm));
      kb.release(vm);
      assert.ok(kb.wasReleased(vm));
    });

    it('should release observables', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const obs = observable(model, 'name');

      assert.ok(!kb.wasReleased(obs));
      kb.release(obs);
      assert.ok(kb.wasReleased(obs));
    });
  });

  describe('kb.utils', () => {
    it('should have valueType function', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const obs = observable(model, 'name');

      assert.strictEqual(kb.utils.valueType(obs), TYPE_SIMPLE);
    });

    it('should have pathJoin function', () => {
      assert.strictEqual(kb.utils.pathJoin('foo', 'bar'), 'foo.bar');
      assert.strictEqual(kb.utils.pathJoin('', 'bar'), 'bar');
      assert.strictEqual(kb.utils.pathJoin(undefined, 'bar'), 'bar');
    });

    it('should have wrappedObservable function', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const vm = viewModel(model);

      // wrappedObservable works with view model instances that have __kb metadata
      // It returns the observable stored in the instance's __kb.observable
      assert.ok(typeof kb.utils.wrappedObservable === 'function', 'wrappedObservable is a function');

      kb.release(vm);
    });

    it('should have wrappedModel function', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const vm = viewModel(model);

      // wrappedModel should return/set the model
      const wrapped = kb.utils.wrappedModel(vm);
      assert.strictEqual(wrapped, model, 'Returns the model');
    });

    it('should have wrappedStore function', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const vm = viewModel(model);

      // wrappedStore should return the store
      const store = kb.utils.wrappedStore(vm);
      assert.ok(store, 'Returns a store');
    });

    it('should detect value types correctly', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const collection = new Backbone.Collection([{ name: 'Alice' }]);

      const simpleObs = observable(model, 'name');
      assert.strictEqual(kb.utils.valueType(simpleObs), TYPE_SIMPLE, 'Simple value');

      // Model type detection
      const modelObs = observable(model, {
        key: 'nested',
        factories: () => viewModel(new Backbone.Model()),
      });
      // This depends on actual value - without a nested model it's simple
      assert.ok([TYPE_SIMPLE, TYPE_MODEL].includes(kb.utils.valueType(modelObs)), 'Model or simple');

      kb.release(simpleObs);
      kb.release(modelObs);
    });
  });
});
