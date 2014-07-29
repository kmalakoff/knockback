assert = assert or require?('chai').assert

describe 'money-patches @quick @monkey', ->
  kb = window?.kb; try kb or= require?('knockback') catch; try kb or= require?('../../../knockback')
  {_, ko} = kb

  it 'TEST DEPENDENCY MISSING', (done) ->
    assert.ok(!!ko, 'ko')
    assert.ok(!!_, '_')
    assert.ok(!!kb.Model, 'kb.Model')
    assert.ok(!!kb.Collection, 'kb.Collection')
    assert.ok(!!kb, 'kb')
    done()

  Contact = if kb.Parse then kb.Model.extend('Contact', { defaults: {name: '', number: 0, date: new Date()} }) else kb.Model.extend({ defaults: {name: '', number: 0, date: new Date()} })
  Contacts = kb.Collection.extend({model: Contact})

  ## https://github.com/kmalakoff/knockback/issues/124
  it 'fixes memory management for extend on kb.observable', (done) ->
    return done() unless ko.subscribable?.fn?.extend
    kb.statistics = new kb.Statistics() # turn on stats

    model = new Contact({name: 'Bob'})
    observable = kb.observable(model, {key: 'name'})
    assert.ok !kb.wasReleased(observable), 'observable not released'

    extended_observable = observable.extend({throttle: 100})
    assert.ok !kb.wasReleased(observable), 'observable not released'
    assert.ok !kb.wasReleased(extended_observable), 'observable not released'

    kb.release(extended_observable)
    assert.ok !!kb.wasReleased(observable), 'observable released'
    assert.ok !!kb.wasReleased(extended_observable), 'observable released'

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  ## https://github.com/kmalakoff/knockback/issues/124
  it 'fixes memory management for extend on kb.CollectionObservable', (done) ->
    return done() unless ko.subscribable?.fn?.extend
    kb.statistics = new kb.Statistics() # turn on stats

    ko.extenders.lazyArray = (target, timeout) ->
      addTimeout = null
      target.elementsToDisplay = ko.observable(0)

      return ko.computed ->
        all = target()
        if (target.elementsToDisplay() > all.length)
          target.elementsToDisplay(all.length)
        else if (addTimeout is null && target.elementsToDisplay() < all.length)
          addTimeout = setTimeout (->
            addTimeout = null
            target.elementsToDisplay(target.elementsToDisplay() + 1)
          ), timeout
        return all.slice(0, target.elementsToDisplay())

    collection_observable = kb.collectionObservable(collection = new Contacts([{name: 'Bob'}]))
    assert.ok !kb.wasReleased(collection_observable), 'collection_observable not released'

    extended_collection_observable = collection_observable.extend({lazyArray: 10})
    assert.ok !kb.wasReleased(collection_observable), 'collection_observable not released'
    assert.ok !kb.wasReleased(extended_collection_observable), 'collection_observable not released'

    kb.release(extended_collection_observable)
    assert.ok !!kb.wasReleased(collection_observable), 'collection_observable released'
    assert.ok !!kb.wasReleased(extended_collection_observable), 'collection_observable released'

    delete ko.extenders.lazyArray
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()
