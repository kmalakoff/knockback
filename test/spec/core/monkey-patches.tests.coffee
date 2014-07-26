assert = assert or require?('chai').assert

describe 'money-patches @quick', ->
  kb = window?.kb; try kb or= require?('knockback') catch; try kb or= require?('../../../knockback')
  {_, ko, $} = kb

  it 'TEST DEPENDENCY MISSING', (done) ->
    assert.ok(!!ko, 'ko')
    assert.ok(!!_, '_')
    assert.ok(!!kb.Model, 'kb.Model')
    assert.ok(!!kb.Collection, 'kb.Collection')
    assert.ok(!!kb, 'kb')
    done()

  kb.Contact = if kb.Parse then kb.Model.extend('Contact', { defaults: {name: '', number: 0, date: new Date()} }) else kb.Model.extend({ defaults: {name: '', number: 0, date: new Date()} })

  it 'allows fixes memory management for extended', (done) ->
    console.log 'EXTENDERS'

    # new kb.Contact

    # observable = kb.observable(model, {key: field}).extend(extenderA: { ... } ).extend( extenderB: { ... } );

    done()
