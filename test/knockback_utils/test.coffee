$(document).ready( ->
  module("knockback_core utils")

  # import Underscore, Backbone, and Knockout
  _ = if not window._ and (typeof(require) != 'undefined') then require('underscore') else window._
  Backbone = if not window.Backbone and (typeof(require) != 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) != 'undefined') then require('knockout') else window.ko
  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko); ok(!!_); ok(!!Backbone); ok(!!kb)
  )

  test("kb.utils.wrappedObservable", ->
    observable = ko.observable()
    instance = {}
    raises((->kb.utils.wrappedObservable(instance)), null, "Knockback: instance is not wrapping an observable") # get

    kb.utils.wrappedObservable(instance, observable) # set
    equal(kb.utils.wrappedObservable(instance), observable, "observable was wrapped") # get
  )

  test("kb.utils.observableInstanceOf", ->
    equal(kb.utils.observableInstanceOf(kb.simpleAttributeConnector(new Backbone.Model({name: 'name1'}), 'name'), kb.AttributeConnector), true, "Instance is kb.AttributeConnector") # get
    equal(kb.utils.observableInstanceOf(kb.simpleAttributeConnector(new Backbone.Model({name: 'name1'}), 'name'), kb.SimpleAttributeConnector), true, "Instance is kb.SimpleAttributeConnector") # get

    equal(kb.utils.observableInstanceOf(kb.collectionAttributeConnector(new Backbone.Model({name: new Backbone.Collection()}), 'name'), kb.AttributeConnector), true, "Instance is kb.AttributeConnector") # get
    equal(kb.utils.observableInstanceOf(kb.collectionAttributeConnector(new Backbone.Model({name: new Backbone.Collection()}), 'name'), kb.CollectionAttributeConnector), true, "Instance is kb.CollectionAttributeConnector") # get

    equal(kb.utils.observableInstanceOf(kb.viewModelAttributeConnector(new Backbone.Model({name: new Backbone.Model()}), 'name', {view_model: ->}), kb.AttributeConnector), true, "Instance is kb.AttributeConnector") # get
    equal(kb.utils.observableInstanceOf(kb.viewModelAttributeConnector(new Backbone.Model({name: new Backbone.Model()}), 'name', {view_model: ->}), kb.ViewModelAttributeConnector), true, "Instance is kb.ViewModelAttributeConnector") # get

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

  test("kb.utils.optionsCreateClear", ->
    # TODO
  )

  test("kb.utils.optionsCreateOverride", ->
    # TODO
  )

  test("Error cases", ->
    # TODO
  )
)