$(document).ready( ->
  module("knockback_triggered_observable.js")

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  if (typeof(require) != 'undefined') then _ = require('underscore') else _ = window._
  _ = _._ if _ and _.hasOwnProperty('_') # LEGACY
  Backbone = if not window.Backbone and (typeof(require) != 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) != 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) != 'undefined') then require('knockback') else window.kb
  _kbe = if not window._kbe and (typeof(require) != 'undefined') then require('knockback-examples') else window._kbe

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko); ok(!!_); ok(!!Backbone); ok(!!kb); ok(!!_kbe)
  )

  kb.locale_manager = new _kbe.LocaleManager('en', {
    'en':
      formal_hello: 'Hello'
    'en-GB':
      formal_hello: 'Good day sir'
    'fr-FR':
      informal_hello: 'Bonjour'
  })

  test("Standard use case: simple events notifications", ->
    kb.statistics = new kb.Statistics() # turn on stats

    trigger_count = 0

    view_model =
      triggered_observable: kb.triggeredObservable(kb.locale_manager, 'change')
    view_model.counter = ko.dependentObservable(->
      view_model.triggered_observable() # add a dependency
      return trigger_count++
    )

    equal(trigger_count, 1, "1: was set up")

    kb.locale_manager.trigger('change', kb.locale_manager)
    equal(trigger_count, 2, "2: changed")

    kb.locale_manager.setLocale('fr-FR')
    equal(trigger_count, 3, "3: changed")

    # and cleanup after yourself when you are done.
    kb.release(view_model)
    equal(trigger_count, 3, "3: no change")

    # KO doesn't have a dispose for ko.observable
    kb.locale_manager.setLocale('fr-FR')
    equal(trigger_count, 3, "3: no change")

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
)