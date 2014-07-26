root = if window? then window else global
assert = assert or require?('chai').assert

describe 'Knockback.js with Backbone-Relational.js @backbone-relational', ->

  after: -> delete root.Person

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  kb = window?.kb; try kb or= require?('knockback') catch; try kb or= require?('../../../knockback')
  _ = kb._; Backbone = kb.Backbone; ko = kb.ko
  Backbone?.Relational or require?('backbone-relational')

  it 'TEST DEPENDENCY MISSING', (done) ->
    assert.ok(!!ko, 'ko')
    assert.ok(!!_, '_')
    assert.ok(!!Backbone, 'Backbone')
    assert.ok(!!kb, 'kb')
    assert.ok(!!Backbone.Relational, 'Backbone.Relational')
    assert.ok(!!kb, 'kb')
    done()

  Backbone.Relational.store = new Backbone.Store(); Backbone.Relational.store.addModelScope?(root)

  root.Person = Person = Backbone.RelationalModel.extend({
    relations: [{
      type: Backbone.HasMany
      key: 'friends'
      relatedModel: 'Person'
    }]
  })

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

  it 'kb.CollectionObservable with recursive view models', (done) ->
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
    assert.equal(RefCountableViewModel.view_models.length, 4, "Created: 4")

    instance = collection_observable()[0].retain()

    kb.release(collection_observable)
    assert.equal(RefCountableViewModel.view_models.length, 1, "Still one reference")
    assert.equal(instance.refCount(), 1, "All instances were destroyed in the collection's store")

    # destroyable view model
    DestroyableViewModel.view_models = []
    collection_observable = kb.collectionObservable(band, {view_model: DestroyableViewModel})
    assert.equal(DestroyableViewModel.view_models.length, 4, "Created: 4")

    kb.release(collection_observable)
    assert.equal(DestroyableViewModel.view_models.length, 0, "All destroyed")

    # simple view model
    SimpleViewModel.view_models = []
    collection_observable = kb.collectionObservable(band, {view_model: SimpleViewModel})
    assert.equal(SimpleViewModel.view_models.length, 4, "Created: 4")

    kb.release(collection_observable)
    assert.equal(SimpleViewModel.view_models.length, 4, "Destroyed: 4")
    assert.ok(!view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'kb.CollectionObservable with recursive view models and external store', (done) ->
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
    assert.equal(RefCountableViewModel.view_models.length, 4, "Created: 4")

    instance = collection_observable()[0].retain()

    kb.release(collection_observable)
    assert.equal(RefCountableViewModel.view_models.length, 4, "Remaining: 4")

    assert.equal(instance.refCount(), 2, "One instance retained and one in the store")

    store.destroy(); store = null

    assert.equal(RefCountableViewModel.view_models.length, 1, "Still one reference")
    assert.equal(instance.refCount(), 1, "All instances were destroyed in the collection's store")

    # destroyable view model
    store = new kb.Store()
    DestroyableViewModel.view_models = []
    collection_observable = kb.collectionObservable(band, {view_model: DestroyableViewModel, store: store})
    assert.equal(DestroyableViewModel.view_models.length, 4, "Created: 4")

    kb.release(collection_observable)
    assert.equal(DestroyableViewModel.view_models.length, 4, "All destroyed")

    store.destroy(); store = null

    # all instances in the collection's store were released when it was destroyed (to remove potential cycles)
    assert.equal(DestroyableViewModel.view_models.length, 0, "All destroyed")

    # simple view model
    store = new kb.Store()
    SimpleViewModel.view_models = []
    collection_observable = kb.collectionObservable(band, {view_model: SimpleViewModel, store: store})
    assert.equal(SimpleViewModel.view_models.length, 4, "Created: 4")

    kb.release(collection_observable)
    assert.equal(SimpleViewModel.view_models.length, 4, "Remaining: 4")
    assert.ok(view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models

    store.destroy(); store = null

    # all instances in the collection's store were released when it was destroyed (to remove potential cycles)
    assert.equal(SimpleViewModel.view_models.length, 4, "Destroyed: 4")
    assert.ok(!view_model.prop, "Prop destroyed") for view_model in SimpleViewModel.view_models

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()
