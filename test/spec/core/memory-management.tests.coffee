assert = assert or require?('chai').assert

describe 'knockback.js memory management @quick', ->

  kb = window?.kb; try kb or= require?('knockback') catch; try kb or= require?('../../../knockback')
  {_, ko, $} = kb

  it 'TEST DEPENDENCY MISSING', (done) ->
    assert.ok(!!ko, 'ko')
    assert.ok(!!_, '_')
    assert.ok(!!kb.Model, 'kb.Model')
    assert.ok(!!kb.Collection, 'kb.Collection')
    assert.ok(!!kb, 'kb')
    done()

  # ref counted view model
  class RefCountableViewModel
    constructor: ->
      RefCountableViewModel.view_models.push(this)
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

  it 'Basic view model properties', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    nested_view_model = kb.viewModel(new kb.Model({name: 'name1'}), {name: {}}, @)
    ViewModel = ->
      @prop1 = ko.observable()
      @prop2 = ko.observable(['test', 1, null, kb.viewModel(new kb.Model({name: 'name1'}))])
      @prop3 = ko.observableArray(['test', 1, null, kb.viewModel(new kb.Model({name: 'name1'}))])
      @prop4 = ko.computed(-> return true)
      @prop5 = kb.observable(new kb.Model({name: 'name1'}), 'name')
      @prop6 = nested_view_model
      @prop7 = kb.collectionObservable(new kb.Collection(), {models_only: true})
      @prop8 = kb.viewModel(new kb.Model({name: 'name1'}))
      @prop9 = kb.collectionObservable(new kb.Collection())
      return
    view_model = new ViewModel()
    kb.release(view_model)

    assert.ok(!view_model["prop#{index}"], "Property released: prop#{index}") for index in [1..9]
    assert.ok(!view_model.name, "Property released: view_model.name") # kb.viewModel(new kb.Model({name: 'name1'}), 'name', @)
    assert.ok(!nested_view_model.name, "Property released: nested_view_model.name") # nested_view_model

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'Releasing with nodes', (done) ->
    return done() unless $

    kb.statistics = new kb.Statistics() # turn on stats

    view_model = kb.viewModel(model = new kb.Model({name: 'Bob'}))
    collection_observable = kb.collectionObservable(new kb.Collection([new kb.Model({name: 'Fred'}), new kb.Model({name: 'Mary'})]))

    $vm_el = $('<div id="vm" data-bind="text: name"></div>')
    $co_el = $('<div id="co" data-bind="foreach: co"><div data-bind="text: name"></div></div>')
    $('body').append($vm_el).append($co_el)

    kb.applyBindings(view_model, $vm_el[0])
    kb.applyBindings({co: collection_observable}, $co_el[0])

    assert.equal($vm_el.text(), 'Bob', 'found Bob')
    for child, index in $co_el.children()
      name = if index then 'Mary' else 'Fred'
      assert.equal($(child).text(), name, "found #{name}")

    assert.equal(kb.statistics.registeredCount('ViewModel'), 3, '3 bound view models')
    assert.equal(kb.statistics.registeredCount('CollectionObservable'), 1, '1 bound collection observable')

    # dispose of the collection node
    ko.removeNode($co_el[0])
    assert.equal(kb.statistics.registeredCount('ViewModel'), 1, '1 bound view model')
    assert.equal(kb.statistics.registeredCount('CollectionObservable'), 0, 'no bound collection observables')

    # dispose of the model node
    ko.removeNode($vm_el[0])

    assert.ok(kb.Statistics.eventsStats(model).count is 0, "All model events cleared. Expected: 0. Actual: #{JSON.stringify(kb.Statistics.eventsStats(model))}")
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'RefCounting', (done) ->
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
    assert.ok(!view_model.ref_counted, "Property released: view_model.ref_counted")
    assert.ok(!!ref_counted.prop, "Property not released: ref_counted.prop")

    ref_counted.release()
    assert.ok(!ref_counted.prop, "Property released: ref_counted.prop")

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'kb.CollectionObservable', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    # ref counted view model
    RefCountableViewModel.view_models = []
    collection_observable = kb.collectionObservable(new kb.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: RefCountableViewModel})
    assert.equal(RefCountableViewModel.view_models.length, 2, "Created: 2")

    instance = collection_observable()[0].retain()

    kb.release(collection_observable)
    assert.equal(RefCountableViewModel.view_models.length, 1, "Still one reference")
    assert.equal(instance.refCount(), 1, "All instances were destroyed in the collection's store")

    # destroyable view model
    DestroyableViewModel.view_models = []
    collection_observable = kb.collectionObservable(new kb.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: DestroyableViewModel})
    assert.equal(DestroyableViewModel.view_models.length, 2, "Created: 2")

    kb.release(collection_observable)
    assert.equal(DestroyableViewModel.view_models.length, 0, "All destroyed")

    # simple view model
    SimpleViewModel.view_models = []
    collection_observable = kb.collectionObservable(new kb.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: SimpleViewModel})
    assert.equal(SimpleViewModel.view_models.length, 2, "Created: 2")

    kb.release(collection_observable)
    assert.equal(SimpleViewModel.view_models.length, 2, "Destroyed: 2")
    assert.ok(!view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'kb.CollectionObservable with external store', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    # ref counted view model
    store = new kb.Store()
    RefCountableViewModel.view_models = []
    collection_observable = kb.collectionObservable(new kb.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: RefCountableViewModel, store: store})
    assert.equal(RefCountableViewModel.view_models.length, 2, "Created: 2")

    instance = collection_observable()[0].retain()

    kb.release(collection_observable)
    assert.equal(RefCountableViewModel.view_models.length, 2, "Remaining: 2")

    assert.equal(instance.refCount(), 2, "One instance retained and one in the store")

    store.destroy(); store = null

    assert.equal(RefCountableViewModel.view_models.length, 1, "Still one reference")
    assert.equal(instance.refCount(), 1, "All instances were destroyed in the collection's store")

    # destroyable view model
    store = new kb.Store()
    DestroyableViewModel.view_models = []
    collection_observable = kb.collectionObservable(new kb.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: DestroyableViewModel, store: store})
    assert.equal(DestroyableViewModel.view_models.length, 2, "Created: 2")

    kb.release(collection_observable)
    assert.equal(DestroyableViewModel.view_models.length, 2, "All destroyed")

    store.destroy(); store = null

    # all instances in the collection's store were released when it was destroyed (to remove potential cycles)
    assert.equal(DestroyableViewModel.view_models.length, 0, "All destroyed")

    # simple view model
    store = new kb.Store()
    SimpleViewModel.view_models = []
    collection_observable = kb.collectionObservable(new kb.Collection([{name: 'name1'},{name: 'name2'}]), {view_model: SimpleViewModel, store: store})
    assert.equal(SimpleViewModel.view_models.length, 2, "Created: 2")

    kb.release(collection_observable)
    assert.equal(SimpleViewModel.view_models.length, 2, "Remaining: 2")
    assert.ok(view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models

    store.destroy(); store = null

    # all instances in the collection's store were released when it was destroyed (to remove potential cycles)
    assert.equal(SimpleViewModel.view_models.length, 2, "Destroyed: 2")
    assert.ok(!view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'kb.release destructiveness', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    array = ['Hello', 'Friend']
    kb.release(array)
    assert.ok(_.isEqual(array, ['Hello', 'Friend']), 'preserves arrays')

    obj = {name: 'Fred'}
    kb.release(obj)
    assert.ok(_.isEqual(obj, {name: 'Fred'}), 'preserves objects')

    view_model = {
      array: ['Hello', 'Friend']
      obj: {name: 'Fred'}
      value: ko.observable('hi')
      array_value1: ko.observable(['Hello', 'Friend'])
      array_value2: ko.observableArray(['Hello', 'Friend'])
      model_value: kb.viewModel(new kb.Model())
      collection_value: kb.collectionObservable(new kb.Collection())
    }

    kb.release(view_model)
    assert.ok(_.isEqual(view_model.array, ['Hello', 'Friend']), 'preserves arrays')
    assert.ok(_.isEqual(view_model.obj, {name: 'Fred'}), 'preserves arrays')
    assert.ok(!view_model.value, 'releases observables: value')
    assert.ok(!view_model.array_value1, 'releases observables: array_value1')
    assert.ok(!view_model.array_value2, 'releases observables: array_value2')
    assert.ok(!view_model.model_value, 'releases observables: model_value')
    assert.ok(!view_model.collection_value, 'releases observables: collection_value')

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()
