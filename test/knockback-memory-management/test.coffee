module("knockback.js memory management")

ko = if not window.ko and (typeof(require) isnt 'undefined') then require('knockout') else window.ko
kb = if not window.kb and (typeof(require) isnt 'undefined') then require('knockback') else window.kb
_ = kb._

test("TEST DEPENDENCY MISSING", ->
  ok(!!ko, 'ko')
  ok(!!_, '_')
  ok(!!kb.Model, 'kb.Model')
  ok(!!kb.Collection, 'kb.Collection')
  ok(!!kb, 'kb')
)

# ref counted view model
class RefCountableViewModel
  constructor: ->
    RefCountableViewModel.view_models.push(this)

    # reference counting
    @ref_count = 1

  refCount: -> return @ref_count
  retain: ->
    @ref_count++
    return @
  release: ->
    --@ref_count
    throw "ref count is corrupt" if @ref_count < 0
    unless @ref_count
      @is_destroyed = true
      @__destroy()
    return @

  __destroy: ->
    RefCountableViewModel.view_models.splice(_.indexOf(RefCountableViewModel.view_models, this), 1)

  @view_models: []

# destroyable view model
class DestroyableViewModel
  constructor: ->
    DestroyableViewModel.view_models.push(this)

  destroy: ->
    DestroyableViewModel.view_models.splice(_.indexOf(DestroyableViewModel.view_models, this), 1)

  @view_models: []

# simple view model
class SimpleViewModel
  constructor: ->
    @prop = ko.observable()
    SimpleViewModel.view_models.push(this)

  @view_models: []

if kb.BACKBONE
  class Person extends Backbone.RelationalModel
    relations: [{
      type: Backbone.HasMany
      key: 'friends'
      relatedModel: Person
    }]

test("Basic view model properties", ->
  kb.statistics = new kb.Statistics() # turn on stats

  nested_view_model = kb.viewModel(new kb.Model({name: 'name1'}), {name: {}}, @)
  ViewModel = ->
    @prop1 = ko.observable()
    @prop2 = ko.observable(['test', 1, null, kb.viewModel(new kb.Model({name: 'name1'}))])
    @prop3 = ko.observableArray(['test', 1, null, kb.viewModel(new kb.Model({name: 'name1'}))])
    @prop4 = ko.dependentObservable(-> return true)
    @prop5 = kb.observable(new kb.Model({name: 'name1'}), 'name')
    @prop6 = nested_view_model
    @prop7 = kb.collectionObservable(new kb.Collection(), {models_only: true})
    @prop8 = kb.viewModel(new kb.Model({name: 'name1'}))
    @prop9 = kb.collectionObservable(new kb.Collection())
    return
  view_model = new ViewModel()
  kb.release(view_model)

  ok(!view_model["prop#{index}"], "Property released: prop#{index}") for index in [1..9]
  ok(!view_model.name, "Property released: view_model.name") # kb.viewModel(new kb.Model({name: 'name1'}), 'name', @)
  ok(!nested_view_model.name, "Property released: nested_view_model.name") # nested_view_model

  equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
)

test("Releasing with nodes", ->
  kb.statistics = new kb.Statistics() # turn on stats

  view_model = kb.viewModel(new kb.Model({name: 'Bob'}))
  collection_observable = kb.collectionObservable(new kb.Collection([new kb.Model({name: 'Fred'}), new kb.Model({name: 'Mary'})]))

  $vm_el = $('<div id="vm" data-bind="text: name"></div>')
  $co_el = $('<div id="co" data-bind="foreach: co"><div data-bind="text: name"></div></div>')
  $('body').append($vm_el).append($co_el)

  kb.applyBindings(view_model, $vm_el[0])
  kb.applyBindings({co: collection_observable}, $co_el[0])

  equal($vm_el.text(), 'Bob', 'found Bob')
  for child, index in $co_el.children()
    name = if index then 'Mary' else 'Fred'
    equal($(child).text(), name, "found #{name}")

  equal(kb.statistics.registeredCount('ViewModel'), 3, '3 bound view models')
  equal(kb.statistics.registeredCount('CollectionObservable'), 1, '1 bound collection observable')

  # dispose of the collection node
  ko.removeNode($co_el[0])
  equal(kb.statistics.registeredCount('ViewModel'), 1, '1 bound view model')
  equal(kb.statistics.registeredCount('CollectionObservable'), 0, 'no bound collection observables')

  # dispose of the model node
  ko.removeNode($vm_el[0])

  equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
)

test("RefCounting", ->
  kb.statistics = new kb.Statistics() # turn on stats

  class RefViewModel
    constructor: ->
      @prop = kb.observable(new kb.Model({name: 'name1'}), 'name')
      # reference counting
      @ref_count = 1

    refCount: -> return @ref_count
    retain: ->
      @ref_count++
      return @
    release: ->
      --@ref_count
      throw "ref count is corrupt" if @ref_count < 0
      unless @ref_count
        @is_destroyed = true
        @__destroy()
      return @

    __destroy: ->
      kb.release(@prop); @prop = null

  ref_counted = new RefViewModel()
  view_model =
    ref_counted: ref_counted.retain()
  kb.release(view_model)
  ok(!view_model.ref_counted, "Property released: view_model.ref_counted")
  ok(!!ref_counted.prop, "Property not released: ref_counted.prop")

  ref_counted.release()
  ok(!ref_counted.prop, "Property released: ref_counted.prop")

  equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
)

test("kb.CollectionObservable", ->
  kb.statistics = new kb.Statistics() # turn on stats

  # ref counted view model
  RefCountableViewModel.view_models = []
  collection_observable = kb.collectionObservable(new kb.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: RefCountableViewModel})
  equal(RefCountableViewModel.view_models.length, 2, "Created: 2")

  instance = collection_observable()[0].retain()

  kb.release(collection_observable)
  equal(RefCountableViewModel.view_models.length, 1, "Still one reference")
  equal(instance.refCount(), 1, "All instances were destroyed in the collection's store")

  # destroyable view model
  DestroyableViewModel.view_models = []
  collection_observable = kb.collectionObservable(new kb.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: DestroyableViewModel})
  equal(DestroyableViewModel.view_models.length, 2, "Created: 2")

  kb.release(collection_observable)
  equal(DestroyableViewModel.view_models.length, 0, "All destroyed")

  # simple view model
  SimpleViewModel.view_models = []
  collection_observable = kb.collectionObservable(new kb.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: SimpleViewModel})
  equal(SimpleViewModel.view_models.length, 2, "Created: 2")

  kb.release(collection_observable)
  equal(SimpleViewModel.view_models.length, 2, "Destroyed: 2")
  ok(!view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models

  equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
)

test("kb.CollectionObservable with external store", ->
  kb.statistics = new kb.Statistics() # turn on stats

  # ref counted view model
  store = new kb.Store()
  RefCountableViewModel.view_models = []
  collection_observable = kb.collectionObservable(new kb.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: RefCountableViewModel, store: store})
  equal(RefCountableViewModel.view_models.length, 2, "Created: 2")

  instance = collection_observable()[0].retain()

  kb.release(collection_observable)
  equal(RefCountableViewModel.view_models.length, 2, "Remaining: 2")

  equal(instance.refCount(), 2, "One instance retained and one in the store")

  store.destroy(); store = null

  equal(RefCountableViewModel.view_models.length, 1, "Still one reference")
  equal(instance.refCount(), 1, "All instances were destroyed in the collection's store")

  # destroyable view model
  store = new kb.Store()
  DestroyableViewModel.view_models = []
  collection_observable = kb.collectionObservable(new kb.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: DestroyableViewModel, store: store})
  equal(DestroyableViewModel.view_models.length, 2, "Created: 2")

  kb.release(collection_observable)
  equal(DestroyableViewModel.view_models.length, 2, "All destroyed")

  store.destroy(); store = null

  # all instances in the collection's store were released when it was destroyed (to remove potential cycles)
  equal(DestroyableViewModel.view_models.length, 0, "All destroyed")

  # simple view model
  store = new kb.Store()
  SimpleViewModel.view_models = []
  collection_observable = kb.collectionObservable(new kb.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: SimpleViewModel, store: store})
  equal(SimpleViewModel.view_models.length, 2, "Created: 2")

  kb.release(collection_observable)
  equal(SimpleViewModel.view_models.length, 2, "Remaining: 2")
  ok(view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models

  store.destroy(); store = null

  # all instances in the collection's store were released when it was destroyed (to remove potential cycles)
  equal(SimpleViewModel.view_models.length, 2, "Destroyed: 2")
  ok(!view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models

  equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
)

if kb.BACKBONE
  test("kb.CollectionObservable with recursive view models", ->
    kb.statistics = new kb.Statistics() # turn on stats

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

    band = new kb.Collection([john, paul, george, ringo])

    # ref counted view model
    RefCountableViewModel.view_models = []
    collection_observable = kb.collectionObservable(band, {view_model: RefCountableViewModel})
    equal(RefCountableViewModel.view_models.length, 4, "Created: 4")

    instance = collection_observable()[0].retain()

    kb.release(collection_observable)
    equal(RefCountableViewModel.view_models.length, 1, "Still one reference")
    equal(instance.refCount(), 1, "All instances were destroyed in the collection's store")

    # destroyable view model
    DestroyableViewModel.view_models = []
    collection_observable = kb.collectionObservable(band, {view_model: DestroyableViewModel})
    equal(DestroyableViewModel.view_models.length, 4, "Created: 4")

    kb.release(collection_observable)
    equal(DestroyableViewModel.view_models.length, 0, "All destroyed")

    # simple view model
    SimpleViewModel.view_models = []
    collection_observable = kb.collectionObservable(band, {view_model: SimpleViewModel})
    equal(SimpleViewModel.view_models.length, 4, "Created: 4")

    kb.release(collection_observable)
    equal(SimpleViewModel.view_models.length, 4, "Destroyed: 4")
    ok(!view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("kb.CollectionObservable with recursive view models and external store", ->
    kb.statistics = new kb.Statistics() # turn on stats

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

    band = new kb.Collection([john, paul, george, ringo])

    # ref counted view model
    store = new kb.Store()
    RefCountableViewModel.view_models = []
    collection_observable = kb.collectionObservable(band, {view_model: RefCountableViewModel, store: store})
    equal(RefCountableViewModel.view_models.length, 4, "Created: 4")

    instance = collection_observable()[0].retain()

    kb.release(collection_observable)
    equal(RefCountableViewModel.view_models.length, 4, "Remaining: 4")

    equal(instance.refCount(), 2, "One instance retained and one in the store")

    store.destroy(); store = null

    equal(RefCountableViewModel.view_models.length, 1, "Still one reference")
    equal(instance.refCount(), 1, "All instances were destroyed in the collection's store")

    # destroyable view model
    store = new kb.Store()
    DestroyableViewModel.view_models = []
    collection_observable = kb.collectionObservable(band, {view_model: DestroyableViewModel, store: store})
    equal(DestroyableViewModel.view_models.length, 4, "Created: 4")

    kb.release(collection_observable)
    equal(DestroyableViewModel.view_models.length, 4, "All destroyed")

    store.destroy(); store = null

    # all instances in the collection's store were released when it was destroyed (to remove potential cycles)
    equal(DestroyableViewModel.view_models.length, 0, "All destroyed")

    # simple view model
    store = new kb.Store()
    SimpleViewModel.view_models = []
    collection_observable = kb.collectionObservable(band, {view_model: SimpleViewModel, store: store})
    equal(SimpleViewModel.view_models.length, 4, "Created: 4")

    kb.release(collection_observable)
    equal(SimpleViewModel.view_models.length, 4, "Remaining: 4")
    ok(view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models

    store.destroy(); store = null

    # all instances in the collection's store were released when it was destroyed (to remove potential cycles)
    equal(SimpleViewModel.view_models.length, 4, "Destroyed: 4")
    ok(!view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )