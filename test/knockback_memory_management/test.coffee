$(document).ready( ->
  module("knockback.js memory management")

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  if (typeof(require) != 'undefined') then _ = require('underscore') else _ = window._
  _ = _._ if _ and (_.hasOwnProperty('_')) # LEGACY
  Backbone = if not window.Backbone and (typeof(require) != 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) != 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) != 'undefined') then require('knockback') else window.kb

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko); ok(!!_); ok(!!Backbone); ok(!!kb)
  )

  # ref counted view model
  class RefCountableViewModel extends kb.RefCountable
    constructor: ->
      super
      RefCountableViewModel.view_models.push(this)

    __destroy: ->
      RefCountableViewModel.view_models.splice(RefCountableViewModel.view_models.indexOf(this), 1)

    @view_models: []

  # destroyable view model
  class DestroyableViewModel
    constructor: ->
      DestroyableViewModel.view_models.push(this)

    destroy: ->
      DestroyableViewModel.view_models.splice(DestroyableViewModel.view_models.indexOf(this), 1)

    @view_models: []

  # simple view model
  class SimpleViewModel
    constructor: ->
      @prop = ko.observable()
      SimpleViewModel.view_models.push(this)

    @view_models: []

  class Person extends Backbone.RelationalModel
    relations: [{
      type: Backbone.HasMany
      key: 'friends'
      relatedModel: Person
    }]

  kb.locale_manager = new Backbone.Model()

  test("Basic view model properties", ->
    nested_view_model = kb.viewModel(new Backbone.Model({name: 'name1'}))
    ViewModel = ->
      @prop1 = ko.observable()
      @prop2 = ko.observableArray([])
      @prop3 = ko.dependentObservable(-> return true)
      @prop4 = kb.observable(new Backbone.Model({name: 'name1'}), 'name')
      @prop5 = kb.observables(new Backbone.Model({name: 'name1'}), {name: {}}, @)
      @prop5 = kb.collectionObservable(new Backbone.Collection())
      @prop6 = nested_view_model
      @prop7 = kb.simpleAttributeConnector(new Backbone.Model({name: 'name1'}), 'name')
      @prop8 = kb.collectionAttributeConnector(new Backbone.Model({name: new Backbone.Collection()}), 'name')
      @prop9 = kb.viewModelAttributeConnector(new Backbone.Model({name: new Backbone.Model()}), 'name', {view_model: ->})
      @prop10 = kb.collectionObservable(new Backbone.Collection())
      @prop11 = kb.localizedObservable(ko.observable(), {read: ->})
      @prop12 = kb.localizedObservable(ko.observable(), {read: ->})
      @prop13 = kb.triggeredObservable(new Backbone.Model({name: 'name1'}), 'name')
      @

    view_model = new ViewModel()
    kb.utils.release(view_model)

    ok(!view_model["prop#{index}"], "Property released: prop#{index}") for index in [1..13]
    ok(!view_model.name, "Property released: view_model.name") # kb.observables(new Backbone.Model({name: 'name1'}), 'name', @)
    ok(!nested_view_model.name, "Property released: nested_view_model.name") # nested_view_model
  )

  test("kb.RefCountable", ->
    class RefViewModel extends kb.RefCountable
      constructor: ->
        super
        @prop = kb.observable(new Backbone.Model({name: 'name1'}), 'name')

      __destroy: ->
        kb.utils.release(@prop); @prop = null

    ref_counted = new RefViewModel()
    view_model =
      ref_counted: ref_counted.retain()
    kb.utils.release(view_model)
    ok(!view_model.ref_counted, "Property released: view_model.ref_counted")
    ok(!!ref_counted.prop, "Property not released: ref_counted.prop")

    ref_counted.release()
    ok(!ref_counted.prop, "Property released: ref_counted.prop")
  )

  test("kb.CollectionObservable", ->
    # ref counted view model
    RefCountableViewModel.view_models = []
    collection = kb.collectionObservable(new Backbone.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: RefCountableViewModel})
    equal(RefCountableViewModel.view_models.length, 2, "Created: 2")

    instance = collection()[0].retain()

    kb.utils.release(collection)
    equal(RefCountableViewModel.view_models.length, 0, "All destroyed")

    # all instances in the collection's store were released when it was destroyed (to remove potential cycles)
    equal(instance.refCount(), 0, "All instances were destroyed in the collection's store")

    # destroyable view model
    DestroyableViewModel.view_models = []
    collection = kb.collectionObservable(new Backbone.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: DestroyableViewModel})
    equal(DestroyableViewModel.view_models.length, 2, "Created: 2")

    kb.utils.release(collection)
    equal(DestroyableViewModel.view_models.length, 0, "All destroyed")

    # simple view model
    SimpleViewModel.view_models = []
    collection = kb.collectionObservable(new Backbone.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: SimpleViewModel})
    equal(SimpleViewModel.view_models.length, 2, "Created: 2")

    kb.utils.release(collection)
    equal(SimpleViewModel.view_models.length, 2, "Destroyed: 2")
    ok(!view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models
  )

  test("kb.CollectionObservable with external store", ->
    # ref counted view model
    store = new kb.Store()
    RefCountableViewModel.view_models = []
    collection = kb.collectionObservable(new Backbone.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: RefCountableViewModel, store: store})
    equal(RefCountableViewModel.view_models.length, 2, "Created: 2")

    instance = collection()[0].retain()

    kb.utils.release(collection)
    equal(RefCountableViewModel.view_models.length, 2, "Remaining: 2")

    equal(instance.refCount(), 2, "One instance retained and one in the store")

    store.destroy(); store = null

    # all instances in the collection's store were released when it was destroyed (to remove potential cycles)
    equal(instance.refCount(), 0, "All instances were destroyed in the collection's store")
    equal(RefCountableViewModel.view_models.length, 0, "All destroyed")

    # destroyable view model
    store = new kb.Store()
    DestroyableViewModel.view_models = []
    collection = kb.collectionObservable(new Backbone.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: DestroyableViewModel, store: store})
    equal(DestroyableViewModel.view_models.length, 2, "Created: 2")

    kb.utils.release(collection)
    equal(DestroyableViewModel.view_models.length, 2, "All destroyed")

    store.destroy(); store = null

    # all instances in the collection's store were released when it was destroyed (to remove potential cycles)
    equal(DestroyableViewModel.view_models.length, 0, "All destroyed")

    # simple view model
    store = new kb.Store()
    SimpleViewModel.view_models = []
    collection = kb.collectionObservable(new Backbone.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: SimpleViewModel, store: store})
    equal(SimpleViewModel.view_models.length, 2, "Created: 2")

    kb.utils.release(collection)
    equal(SimpleViewModel.view_models.length, 2, "Remaining: 2")
    ok(view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models

    store.destroy(); store = null

    # all instances in the collection's store were released when it was destroyed (to remove potential cycles)
    equal(SimpleViewModel.view_models.length, 2, "Destroyed: 2")
    ok(!view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models
  )

  test("kb.CollectionObservable with recursive view models", ->
    john = new Person({
      id: 'person-1-1'
      name: 'John'
      friends: ['person-1-2', 'person-1-3', 'person-1-4']
    })
    paul = new Person({
      id: 'person-1-2'
      name: 'Paul'
      friends: ['person-1-1', 'person-1-3', 'person-1-4']
    })
    george = new Person({
      id: 'person-1-3'
      name: 'George'
      friends: ['person-1-1', 'person-1-2', 'person-1-4']
    })
    ringo = new Person({
      id: 'person-1-4'
      name: 'Ringo'
      friends: ['person-1-1', 'person-1-2', 'person-1-3']
    })

    band = new Backbone.Collection([john, paul, george, ringo])

    # ref counted view model
    RefCountableViewModel.view_models = []
    collection = kb.collectionObservable(band, {view_model: RefCountableViewModel})
    equal(RefCountableViewModel.view_models.length, 4, "Created: 4")

    instance = collection()[0].retain()

    kb.utils.release(collection)
    equal(RefCountableViewModel.view_models.length, 0, "All destroyed")

    # all instances in the collection's store were released when it was destroyed (to remove potential cycles)
    equal(instance.refCount(), 0, "All instances were destroyed in the collection's store")

    # destroyable view model
    DestroyableViewModel.view_models = []
    collection = kb.collectionObservable(band, {view_model: DestroyableViewModel})
    equal(DestroyableViewModel.view_models.length, 4, "Created: 4")

    kb.utils.release(collection)
    equal(DestroyableViewModel.view_models.length, 0, "All destroyed")

    # simple view model
    SimpleViewModel.view_models = []
    collection = kb.collectionObservable(band, {view_model: SimpleViewModel})
    equal(SimpleViewModel.view_models.length, 4, "Created: 4")

    kb.utils.release(collection)
    equal(SimpleViewModel.view_models.length, 4, "Destroyed: 4")
    ok(!view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models
  )

  test("kb.CollectionObservable with recursive view models and external store", ->
    john = new Person({
      id: 'person-2-1'
      name: 'John'
      friends: ['person-2-2', 'person-2-3', 'person-2-4']
    })
    paul = new Person({
      id: 'person-2-2'
      name: 'Paul'
      friends: ['person-2-1', 'person-2-3', 'person-2-4']
    })
    george = new Person({
      id: 'person-2-3'
      name: 'George'
      friends: ['person-2-1', 'person-2-2', 'person-2-4']
    })
    ringo = new Person({
      id: 'person-2-4'
      name: 'Ringo'
      friends: ['person-2-1', 'person-2-2', 'person-2-3']
    })

    band = new Backbone.Collection([john, paul, george, ringo])

    # ref counted view model
    store = new kb.Store()
    RefCountableViewModel.view_models = []
    collection = kb.collectionObservable(band, {view_model: RefCountableViewModel, store: store})
    equal(RefCountableViewModel.view_models.length, 4, "Created: 4")

    instance = collection()[0].retain()

    kb.utils.release(collection)
    equal(RefCountableViewModel.view_models.length, 4, "Remaining: 4")

    equal(instance.refCount(), 2, "One instance retained and one in the store")

    store.destroy(); store = null

    # all instances in the collection's store were released when it was destroyed (to remove potential cycles)
    equal(instance.refCount(), 0, "All instances were destroyed in the collection's store")
    equal(RefCountableViewModel.view_models.length, 0, "All destroyed")

    # destroyable view model
    store = new kb.Store()
    DestroyableViewModel.view_models = []
    collection = kb.collectionObservable(band, {view_model: DestroyableViewModel, store: store})
    equal(DestroyableViewModel.view_models.length, 4, "Created: 4")

    kb.utils.release(collection)
    equal(DestroyableViewModel.view_models.length, 4, "All destroyed")

    store.destroy(); store = null

    # all instances in the collection's store were released when it was destroyed (to remove potential cycles)
    equal(DestroyableViewModel.view_models.length, 0, "All destroyed")

    # simple view model
    store = new kb.Store()
    SimpleViewModel.view_models = []
    collection = kb.collectionObservable(band, {view_model: SimpleViewModel, store: store})
    equal(SimpleViewModel.view_models.length, 4, "Created: 4")

    kb.utils.release(collection)
    equal(SimpleViewModel.view_models.length, 4, "Remaining: 4")
    ok(view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models

    store.destroy(); store = null

    # all instances in the collection's store were released when it was destroyed (to remove potential cycles)
    equal(SimpleViewModel.view_models.length, 4, "Destroyed: 4")
    ok(!view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models
  )

  test("Error cases", ->
    # TODO
  )
)