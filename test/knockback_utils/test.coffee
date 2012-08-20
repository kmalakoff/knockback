$(document).ready( ->
  module("knockback_core utils")

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  if (typeof(require) != 'undefined') then _ = require('underscore') else _ = window._
  _ = _._ if _ and (_.hasOwnProperty('_')) # LEGACY
  Backbone = if not window.Backbone and (typeof(require) != 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) != 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) != 'undefined') then require('knockback') else window.kb
  _kbe = if not window._kbe and (typeof(require) != 'undefined') then require('knockback-examples') else window._kbe

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko); ok(!!_); ok(!!Backbone); ok(!!kb); ok(!!_kbe)
  )

  kb.locale_manager = new _kbe.LocaleManager('en', {})

  test("kb.utils.wrappedObservable", ->
    observable = ko.observable()
    instance = {}
    kb.utils.wrappedObservable(instance, observable) # set
    equal(kb.utils.wrappedObservable(instance), observable, "observable was wrapped") # get
  )

  test("kb.utils.wrappedModel", ->
    model = new Backbone.Model({name: 'Bob'})
    instance = {}
    equal(kb.utils.wrappedModel(instance), instance, "no model was wrapped so return the instance") # get

    kb.utils.wrappedModel(instance, model) # set
    equal(kb.utils.wrappedModel(instance), model, "model was wrapped") # get
  )

  test("kb.utils.wrappedStore", ->
    collection_observable = kb.collectionObservable(new Backbone.Collection())
    ok(!!kb.utils.wrappedStore(collection_observable), 'Store is available on a collection observable')

    # can get and share store
    collection_observable_shared = kb.collectionObservable(new Backbone.Collection(), {store: kb.utils.wrappedStore(collection_observable)})
    equal(kb.utils.wrappedStore(collection_observable), kb.utils.wrappedStore(collection_observable_shared), 'Store is shared between collection observables')

    view_model = kb.viewModel(new Backbone.Model({name: 'Bob'}))
    ok(!!kb.utils.wrappedStore(view_model), 'Store is available on a view model')

    # can get and share store
    collection_observable_shared = kb.collectionObservable(new Backbone.Collection(), {store: kb.utils.wrappedStore(view_model)})
    equal(kb.utils.wrappedStore(view_model), kb.utils.wrappedStore(collection_observable_shared), 'Store is shared between collection observable and view model')
  )

  test("kb.utils.valueType", ->
    equal(kb.utils.valueType(kb.collectionObservable(new Backbone.Collection()), kb.CollectionObservable), kb.TYPE_COLLECTION, "kb.CollectionObservable is a collection type")

    equal(kb.utils.valueType(kb.observable(new Backbone.Model({name: 'name1'}), 'name'), kb.Observable), kb.TYPE_SIMPLE, "kb.Observable is a kb.TYPE_SIMPLE")

    model = new Backbone.Model({simple_type: 3, model_type: new Backbone.Model(), collection_type: new Backbone.Collection})
    view_model = kb.viewModel(model)

    equal(kb.utils.valueType(view_model.simple_type), kb.TYPE_SIMPLE, "simple is kb.TYPE_SIMPLE")
    equal(kb.utils.valueType(view_model.model_type), kb.TYPE_MODEL, "model is kb.TYPE_MODEL")
    equal(kb.utils.valueType(view_model.collection_type), kb.TYPE_COLLECTION, "collection is kb.TYPE_COLLECTION")

    view_model = kb.viewModel(new Backbone.Model({simple_attr: null, model_attr: null}), {factories: model_attr: kb.ViewModel})
    equal(kb.utils.valueType(view_model.simple_attr), kb.TYPE_SIMPLE, 'simple_attr is kb.TYPE_SIMPLE')
    equal(kb.utils.valueType(view_model.model_attr), kb.TYPE_MODEL, 'model_attr is kb.TYPE_MODEL')
  )

  test("kb.utils.observableInstanceOf", ->
    equal(kb.utils.observableInstanceOf(kb.collectionObservable(new Backbone.Collection()), kb.CollectionObservable), true, "Instance is kb.CollectionObservable")

    equal(kb.utils.observableInstanceOf(new _kbe.LongDateLocalizer(ko.observable(new Date)), kb.LocalizedObservable), true, "Instance is kb.LocalizedObservable")

    equal(kb.utils.observableInstanceOf(kb.observable(new Backbone.Model({name: 'name1'}), 'name'), kb.Observable), true, "Instance is kb.Observable")

    equal(kb.utils.observableInstanceOf(kb.triggeredObservable(new Backbone.Model({name: 'name1'}), 'name'), kb.TriggeredObservable), true, "Instance is kb.TriggeredObservable")
  )

  test("kb.utils.path", ->
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
  )

  test("Error cases", ->
    # TODO
  )
)