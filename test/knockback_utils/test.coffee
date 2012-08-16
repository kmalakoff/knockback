$(document).ready( ->
  module("knockback_core utils")

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  if (typeof(require) != 'undefined') then _ = require('underscore') else _ = window._
  _ = _._ if _ and (_.hasOwnProperty('_')) # LEGACY
  Backbone = if not window.Backbone and (typeof(require) != 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) != 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) != 'undefined') then require('knockback') else window.kb

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko); ok(!!_); ok(!!Backbone); ok(!!kb)
  )

  test("kb.utils.wrappedObservable", ->
    observable = ko.observable()
    instance = {}
    kb.utils.wrappedObservable(instance, observable) # set
    equal(kb.utils.wrappedObservable(instance), observable, "observable was wrapped") # get
  )

  test("kb.utils.observableInstanceOf", ->
    equal(kb.utils.observableInstanceOf(kb.collectionObservable(new Backbone.Collection()), kb.CollectionObservable), true, "Instance is kb.CollectionObservable") # get

    kb.locale_manager = new Backbone.Model()
    equal(kb.utils.observableInstanceOf(kb.localizedObservable(ko.observable(), {read: ->}), kb.LocalizedObservable), true, "Instance is kb.LocalizedObservable") # get

    equal(kb.utils.observableInstanceOf(kb.observable(new Backbone.Model({name: 'name1'}), 'name'), kb.Observable), true, "Instance is kb.Observable") # get

    equal(kb.utils.observableInstanceOf(kb.triggeredObservable(new Backbone.Model({name: 'name1'}), 'name'), kb.TriggeredObservable), true, "Instance is kb.TriggeredObservable") # get
  )

  test("kb.utils.wrappedModel", ->
    model = new Backbone.Model()
    instance = {}
    equal(kb.utils.wrappedModel(instance), instance, "no model was wrapped so return the instance") # get

    kb.utils.wrappedModel(instance, model) # set
    equal(kb.utils.wrappedModel(instance), model, "model was wrapped") # get
  )

  test("kb.utils.setToDefault", ->
    # TODO
  )

  test("kb.utils.release", ->
    # TODO
  )

  test("Error cases", ->
    # TODO
  )
)