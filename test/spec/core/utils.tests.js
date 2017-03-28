const r = typeof require !== 'undefined';
const root = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : this;
let assert = root.assert; try { assert = assert || (r ? require('chai').assert : undefined); } catch (e) { /**/ }

let kb = root.kb; try { kb = kb || (r ? require('knockback') : undefined); } catch (e) { kb = kb || (r ? require('../../../knockback') : undefined); }
const { _, Backbone, ko } = kb;

describe('knockback_core utils', () => {
  it('TEST DEPENDENCY MISSING', () => {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!Backbone.Model, 'Backbone.Model');
    assert.ok(!!Backbone.Collection, 'Backbone.Collection');
    assert.ok(!!kb, 'kb');
  });

  it('kb.utils.wrappedObservable', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const observable = ko.observable();
    const instance = {};
    kb.utils.wrappedObservable(instance, observable); // set
    assert.equal(kb.utils.wrappedObservable(instance), observable, 'observable was wrapped'); // get

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('kb.utils.wrappedModel', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const model = new Backbone.Model({ name: 'Bob' });
    const instance = {};
    assert.equal(kb.utils.wrappedModel(instance), instance, 'no model was wrapped so return the instance'); // get

    kb.utils.wrappedModel(instance, model); // set
    assert.equal(kb.utils.wrappedModel(instance), model, 'model was wrapped'); // get

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('kb.utils.wrappedStore', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const collection_observable = kb.collectionObservable(new Backbone.Collection());
    assert.ok(!!kb.utils.wrappedStore(collection_observable), 'Store is available on a collection observable');

    // can get and share store
    let collection_observable_shared = kb.collectionObservable(new Backbone.Collection(), { store: kb.utils.wrappedStore(collection_observable) });
    assert.equal(kb.utils.wrappedStore(collection_observable), kb.utils.wrappedStore(collection_observable_shared), 'Store is shared between collection observables');
    kb.release(collection_observable_shared); // clean up

    const view_model = kb.viewModel(new Backbone.Model({ name: 'Bob' }));
    assert.ok(!!kb.utils.wrappedStore(view_model), 'Store is available on a view model');

    // can get and share store
    collection_observable_shared = kb.collectionObservable(new Backbone.Collection(), { store: kb.utils.wrappedStore(view_model) });

    assert.equal(kb.utils.wrappedStore(view_model), kb.utils.wrappedStore(collection_observable_shared), 'Store is shared between collection observable and view model');

    // clean up
    kb.release(collection_observable);
    kb.release(collection_observable_shared);
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('kb.utils.valueType', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const co = kb.collectionObservable(new Backbone.Collection());
    assert.equal(kb.utils.valueType(co), kb.TYPE_COLLECTION, 'kb.CollectionObservable is a collection type');
    kb.release(co); // clean up

    const o = kb.observable(new Backbone.Model({ name: 'name1' }), 'name');
    assert.equal(kb.utils.valueType(o), kb.TYPE_SIMPLE, 'kb.Observable is a kb.TYPE_SIMPLE');
    kb.release(o); // clean up

    const model = new Backbone.Model({ simple_type: 3, model_type: new Backbone.Model(), collection_type: new Backbone.Collection() });
    let view_model = kb.viewModel(model);

    assert.equal(kb.utils.valueType(view_model.simple_type), kb.TYPE_SIMPLE, 'simple is kb.TYPE_SIMPLE');
    assert.equal(kb.utils.valueType(view_model.model_type), kb.TYPE_MODEL, 'model is kb.TYPE_MODEL');
    assert.equal(kb.utils.valueType(view_model.collection_type), kb.TYPE_COLLECTION, 'collection is kb.TYPE_COLLECTION');
    kb.release(view_model); // clean up

    view_model = kb.viewModel(new Backbone.Model({ simple_attr: null, model_attr: null }), { factories: { model_attr: kb.ViewModel } });
    assert.equal(kb.utils.valueType(view_model.simple_attr), kb.TYPE_SIMPLE, 'simple_attr is kb.TYPE_SIMPLE');
    assert.equal(kb.utils.valueType(view_model.model_attr), kb.TYPE_MODEL, 'model_attr is kb.TYPE_MODEL');
    kb.release(view_model); // clean up

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('kb.utils.path', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    assert.equal(kb.utils.pathJoin(null, 'key'), 'key', 'key path joined');
    assert.equal(kb.utils.pathJoin('bob', 'key'), 'bob.key', 'bob.key path joined');
    assert.equal(kb.utils.pathJoin('bob.', 'key'), 'bob.key', 'bob.key path joined');
    assert.equal(kb.utils.pathJoin('bob.harry', 'key'), 'bob.harry.key', 'bob.harry.key path joined');
    assert.equal(kb.utils.pathJoin('bob.harry.', 'key'), 'bob.harry.key', 'bob.harry.key path joined');

    assert.equal(kb.utils.optionsPathJoin({}, 'key').path, 'key', 'key path joined');
    assert.equal(kb.utils.optionsPathJoin({ path: 'bob' }, 'key').path, 'bob.key', 'bob.key path joined');
    assert.equal(kb.utils.optionsPathJoin({ path: 'bob.' }, 'key').path, 'bob.key', 'bob.key path joined');
    assert.equal(kb.utils.optionsPathJoin({ path: 'bob.harry' }, 'key').path, 'bob.harry.key', 'bob.harry.key path joined');
    assert.equal(kb.utils.optionsPathJoin({ path: 'bob.harry.' }, 'key').path, 'bob.harry.key', 'bob.harry.key path joined');

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  // https://github.com/kmalakoff/knockback/issues/103
  it('kb.release handling type changes', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const model = new Backbone.Model();
    model.set({ foo: [1, 2, 3] });
    const observable = kb.viewModel(model);
    model.set({ foo: null });
    kb.release(observable);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  // https://github.com/kmalakoff/knockback/issues/101
  it('kb.release releases all events', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const model = new Backbone.Model({ id: 1, name: 'Zebra', age: 22, genus: 'Equus' });
    assert.ok(kb.Statistics.eventsStats(model).count === 0, 'No events yet');

    const view_model = { model: kb.viewModel(model) };
    assert.ok(kb.Statistics.eventsStats(model).count === 1, `There is 1 event. Expected: 1. Actual: ${JSON.stringify(kb.Statistics.eventsStats(model))}`);

    kb.release(view_model);

    assert.ok(kb.Statistics.eventsStats(model).count === 0, `All events cleared. Expected: 0. Actual: ${JSON.stringify(kb.Statistics.eventsStats(model))}`);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });
});
