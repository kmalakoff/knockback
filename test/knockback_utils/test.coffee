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

  test("kb.utils.observableInstanceOf", ->
    equal(kb.utils.observableInstanceOf(kb.collectionObservable(new Backbone.Collection()), kb.CollectionObservable), true, "Instance is kb.CollectionObservable")

    equal(kb.utils.observableInstanceOf(new _kbe.LongDateLocalizer(ko.observable(new Date)), kb.LocalizedObservable), true, "Instance is kb.LocalizedObservable")

    equal(kb.utils.observableInstanceOf(kb.observable(new Backbone.Model({name: 'name1'}), 'name'), kb.Observable), true, "Instance is kb.Observable")

    equal(kb.utils.observableInstanceOf(kb.triggeredObservable(new Backbone.Model({name: 'name1'}), 'name'), kb.TriggeredObservable), true, "Instance is kb.TriggeredObservable")
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

  test("Error cases", ->
    # TODO
  )
)