assert = assert or require?('chai').assert

describe 'money-patches @quick', ->
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

  it 'allows fixes memory management for extended', (done) ->
    return done() unless ko.subscribable?.fn?.extend

    model = new Contact({name: 'Bob'})
    observable = kb.observable(model, {key: 'name'})
    assert.ok !kb.wasReleased(observable), 'observable not released'

    extended_observable = observable.extend({throttle: 100})
    assert.ok !kb.wasReleased(observable), 'observable not released'
    assert.ok !kb.wasReleased(extended_observable), 'observable not released'

    kb.release(extended_observable)
    assert.ok !!kb.wasReleased(observable), 'observable released'
    assert.ok !!kb.wasReleased(extended_observable), 'observable released'

    done()
