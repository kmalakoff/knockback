assert = assert or require?('chai').assert

describe 'knockback_core utils @quick', ->

  kb = window?.kb; try kb or= require?('knockback') catch; try kb or= require?('../../../knockback')
  _ = kb._; ko = kb.ko

  it 'TEST DEPENDENCY MISSING', (done) ->
    assert.ok(!!ko, 'ko')
    assert.ok(!!_, '_')
    assert.ok(!!kb.Model, 'kb.Model')
    assert.ok(!!kb.Collection, 'kb.Collection')
    assert.ok(!!kb, 'kb')
    done()

  it 'kb.utils.wrappedObservable', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    observable = ko.observable()
    instance = {}
    kb.utils.wrappedObservable(instance, observable) # set
    assert.equal(kb.utils.wrappedObservable(instance), observable, "observable was wrapped") # get

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'kb.utils.wrappedModel', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    model = new kb.Model({name: 'Bob'})
    instance = {}
    assert.equal(kb.utils.wrappedModel(instance), instance, "no model was wrapped so return the instance") # get

    kb.utils.wrappedModel(instance, model) # set
    assert.equal(kb.utils.wrappedModel(instance), model, "model was wrapped") # get

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'kb.utils.wrappedStore', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection_observable = kb.collectionObservable(new kb.Collection())
    assert.ok(!!kb.utils.wrappedStore(collection_observable), 'Store is available on a collection observable')

    # can get and share store
    collection_observable_shared = kb.collectionObservable(new kb.Collection(), {store: kb.utils.wrappedStore(collection_observable)})
    assert.equal(kb.utils.wrappedStore(collection_observable), kb.utils.wrappedStore(collection_observable_shared), 'Store is shared between collection observables')
    kb.release(collection_observable_shared) # clean up

    view_model = kb.viewModel(new kb.Model({name: 'Bob'}))
    assert.ok(!!kb.utils.wrappedStore(view_model), 'Store is available on a view model')

    # can get and share store
    collection_observable_shared = kb.collectionObservable(new kb.Collection(), {store: kb.utils.wrappedStore(view_model)})

    assert.equal(kb.utils.wrappedStore(view_model), kb.utils.wrappedStore(collection_observable_shared), 'Store is shared between collection observable and view model')

    # clean up
    kb.release(collection_observable)
    kb.release(collection_observable_shared)
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'kb.utils.valueType', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    co = kb.collectionObservable(new kb.Collection())
    assert.equal(kb.utils.valueType(co), kb.TYPE_COLLECTION, "kb.CollectionObservable is a collection type")
    kb.release(co) # clean up

    o = kb.observable(new kb.Model({name: 'name1'}), 'name')
    assert.equal(kb.utils.valueType(o), kb.TYPE_SIMPLE, "kb.Observable is a kb.TYPE_SIMPLE")
    kb.release(o) # clean up

    model = new kb.Model({simple_type: 3, model_type: new kb.Model(), collection_type: new kb.Collection()})
    view_model = kb.viewModel(model)

    assert.equal(kb.utils.valueType(view_model.simple_type), kb.TYPE_SIMPLE, "simple is kb.TYPE_SIMPLE")
    assert.equal(kb.utils.valueType(view_model.model_type), kb.TYPE_MODEL, "model is kb.TYPE_MODEL")
    assert.equal(kb.utils.valueType(view_model.collection_type), kb.TYPE_COLLECTION, "collection is kb.TYPE_COLLECTION")
    kb.release(view_model) # clean up

    view_model = kb.viewModel(new kb.Model({simple_attr: null, model_attr: null}), {factories: model_attr: kb.ViewModel})
    assert.equal(kb.utils.valueType(view_model.simple_attr), kb.TYPE_SIMPLE, 'simple_attr is kb.TYPE_SIMPLE')
    assert.equal(kb.utils.valueType(view_model.model_attr), kb.TYPE_MODEL, 'model_attr is kb.TYPE_MODEL')
    kb.release(view_model) # clean up

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'kb.utils.path', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    assert.equal(kb.utils.pathJoin(null, 'key'), 'key', "key path joined")
    assert.equal(kb.utils.pathJoin('bob', 'key'), 'bob.key', "bob.key path joined")
    assert.equal(kb.utils.pathJoin('bob.', 'key'), 'bob.key', "bob.key path joined")
    assert.equal(kb.utils.pathJoin('bob.harry', 'key'), 'bob.harry.key', "bob.harry.key path joined")
    assert.equal(kb.utils.pathJoin('bob.harry.', 'key'), 'bob.harry.key', "bob.harry.key path joined")

    assert.equal(kb.utils.optionsPathJoin({}, 'key').path, 'key', "key path joined")
    assert.equal(kb.utils.optionsPathJoin({path: 'bob'}, 'key').path, 'bob.key', "bob.key path joined")
    assert.equal(kb.utils.optionsPathJoin({path: 'bob.'}, 'key').path, 'bob.key', "bob.key path joined")
    assert.equal(kb.utils.optionsPathJoin({path: 'bob.harry'}, 'key').path, 'bob.harry.key', "bob.harry.key path joined")
    assert.equal(kb.utils.optionsPathJoin({path: 'bob.harry.'}, 'key').path, 'bob.harry.key', "bob.harry.key path joined")

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()
