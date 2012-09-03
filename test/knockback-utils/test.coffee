$(document).ready( ->
  module("knockback_core utils")

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  if (typeof(require) isnt 'undefined') then _ = require('underscore') else _ = window._
  _ = _._ if _ and _.hasOwnProperty('_') # LEGACY
  Backbone = if not window.Backbone and (typeof(require) isnt 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) isnt 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) isnt 'undefined') then require('knockback') else window.kb

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko, 'ko')
    ok(!!_, '_')
    ok(!!Backbone, 'Backbone')
    ok(!!kb, 'kb')
    ok(!!kb, 'kb')
  )

  test("kb.utils.wrappedObservable", ->
    kb.statistics = new kb.Statistics() # turn on stats

    observable = ko.observable()
    instance = {}
    kb.utils.wrappedObservable(instance, observable) # set
    equal(kb.utils.wrappedObservable(instance), observable, "observable was wrapped") # get

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("kb.utils.wrappedModel", ->
    kb.statistics = new kb.Statistics() # turn on stats

    model = new Backbone.Model({name: 'Bob'})
    instance = {}
    equal(kb.utils.wrappedModel(instance), instance, "no model was wrapped so return the instance") # get

    kb.utils.wrappedModel(instance, model) # set
    equal(kb.utils.wrappedModel(instance), model, "model was wrapped") # get

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("kb.utils.wrappedStore", ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection_observable = kb.collectionObservable(new Backbone.Collection())
    ok(!!kb.utils.wrappedStore(collection_observable), 'Store is available on a collection observable')

    # can get and share store
    collection_observable_shared = kb.collectionObservable(new Backbone.Collection(), {store: kb.utils.wrappedStore(collection_observable)})
    equal(kb.utils.wrappedStore(collection_observable), kb.utils.wrappedStore(collection_observable_shared), 'Store is shared between collection observables')
    kb.release(collection_observable_shared) # clean up

    view_model = kb.viewModel(new Backbone.Model({name: 'Bob'}))
    ok(!!kb.utils.wrappedStore(view_model), 'Store is available on a view model')

    # can get and share store
    collection_observable_shared = kb.collectionObservable(new Backbone.Collection(), {store: kb.utils.wrappedStore(view_model)})

    equal(kb.utils.wrappedStore(view_model), kb.utils.wrappedStore(collection_observable_shared), 'Store is shared between collection observable and view model')

    # clean up
    kb.release(collection_observable)
    kb.release(collection_observable_shared)
    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("kb.utils.valueType", ->
    kb.statistics = new kb.Statistics() # turn on stats

    co = kb.collectionObservable(new Backbone.Collection())
    equal(kb.utils.valueType(co), kb.TYPE_COLLECTION, "kb.CollectionObservable is a collection type")
    kb.release(co) # clean up

    o = kb.observable(new Backbone.Model({name: 'name1'}), 'name')
    equal(kb.utils.valueType(o), kb.TYPE_SIMPLE, "kb.Observable is a kb.TYPE_SIMPLE")
    kb.release(o) # clean up

    model = new Backbone.Model({simple_type: 3, model_type: new Backbone.Model(), collection_type: new Backbone.Collection})
    view_model = kb.viewModel(model)

    equal(kb.utils.valueType(view_model.simple_type), kb.TYPE_SIMPLE, "simple is kb.TYPE_SIMPLE")
    equal(kb.utils.valueType(view_model.model_type), kb.TYPE_MODEL, "model is kb.TYPE_MODEL")
    equal(kb.utils.valueType(view_model.collection_type), kb.TYPE_COLLECTION, "collection is kb.TYPE_COLLECTION")
    kb.release(view_model) # clean up

    view_model = kb.viewModel(new Backbone.Model({simple_attr: null, model_attr: null}), {factories: model_attr: kb.ViewModel})
    equal(kb.utils.valueType(view_model.simple_attr), kb.TYPE_SIMPLE, 'simple_attr is kb.TYPE_SIMPLE')
    equal(kb.utils.valueType(view_model.model_attr), kb.TYPE_MODEL, 'model_attr is kb.TYPE_MODEL')
    kb.release(view_model) # clean up

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("kb.utils.path", ->
    kb.statistics = new kb.Statistics() # turn on stats

    equal(kb.utils.pathJoin(null, 'key'), 'key', "key path joined")
    equal(kb.utils.pathJoin('bob', 'key'), 'bob.key', "bob.key path joined")
    equal(kb.utils.pathJoin('bob.', 'key'), 'bob.key', "bob.key path joined")
    equal(kb.utils.pathJoin('bob.harry', 'key'), 'bob.harry.key', "bob.harry.key path joined")
    equal(kb.utils.pathJoin('bob.harry.', 'key'), 'bob.harry.key', "bob.harry.key path joined")

    equal(kb.utils.optionsPathJoin({}, 'key').path, 'key', "key path joined")
    equal(kb.utils.optionsPathJoin({path: 'bob'}, 'key').path, 'bob.key', "bob.key path joined")
    equal(kb.utils.optionsPathJoin({path: 'bob.'}, 'key').path, 'bob.key', "bob.key path joined")
    equal(kb.utils.optionsPathJoin({path: 'bob.harry'}, 'key').path, 'bob.harry.key', "bob.harry.key path joined")
    equal(kb.utils.optionsPathJoin({path: 'bob.harry.'}, 'key').path, 'bob.harry.key', "bob.harry.key path joined")

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
)