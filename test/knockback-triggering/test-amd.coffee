$(->
  module("knockback-triggering-amd.js")

  module_name = 'knockback-triggering'
  module_name = 'knockback' if (require.toUrl(module_name).split('./..').length is 1)

  # library and dependencies
  require(['underscore', 'backbone', 'knockout', module_name, 'knockback-statistics'], (_, Backbone, ko, kb, kbs) ->
    _ or= @_
    Backbone or= @Backbone
    test("TEST DEPENDENCY MISSING", ->
      ok(!!ko, 'ko')
      ok(!!_, '_')
      ok(!!Backbone, 'Backbone')
      ok(!!kb, 'kb')
      ok(!!kbs, 'kbs')
    )

    test("Standard use case: simple events notifications", ->
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

      equal(trigger_count, 1, "1: was set up")

      model.trigger('change', model)
      equal(trigger_count, 2, "2: changed")

      model.setLocale('fr-FR')
      equal(trigger_count, 3, "3: changed")

      # and cleanup after yourself when you are done.
      kb.release(view_model)
      equal(trigger_count, 3, "3: no change")

      # KO doesn't have a dispose for ko.observable
      model.setLocale('fr-FR')
      equal(trigger_count, 3, "3: no change")

      equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    )
  )
)