describe 'knockback-triggered-observable.js', ->

  ko = if not window.ko and (typeof(require) isnt 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) isnt 'undefined') then require('knockback') else window.kb
  _ = kb._

  it 'TEST DEPENDENCY MISSING', (done) ->
    assert.ok(!!ko, 'ko')
    assert.ok(!!_, '_')
    assert.ok(!!kb.Model, 'kb.Model')
    assert.ok(!!kb.Collection, 'kb.Collection')
    assert.ok(!!kb, 'kb')
    done()

  it 'Standard use case: simple events notifications', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats
    model = new kb.Model
    model.setLocale = -> model.trigger('change', model)

    trigger_count = 0

    view_model =
      triggered_observable: kb.triggeredObservable(model, 'change')
    view_model.counter = ko.dependentObservable(->
      view_model.triggered_observable() # add a dependency
      return trigger_count++
    )

    assert.equal(trigger_count, 1, "1: was set up")

    model.trigger('change', model)
    assert.equal(trigger_count, 2, "2: changed")

    model.setLocale('fr-FR')
    assert.equal(trigger_count, 3, "3: changed")

    # and cleanup after yourself when you are done.
    kb.release(view_model)
    assert.equal(trigger_count, 3, "3: no change")

    # KO doesn't have a dispose for ko.observable
    model.setLocale('fr-FR')
    assert.equal(trigger_count, 3, "3: no change")

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()
