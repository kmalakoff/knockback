$(document).ready( ->
  module("knockback-inject.js")

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  if (typeof(require) isnt 'undefined') then _ = require('underscore') else _ = window._
  _ = _._ if _ and _.hasOwnProperty('_') # LEGACY
  Backbone = if not window.Backbone and (typeof(require) isnt 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) isnt 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) isnt 'undefined') then require('knockback') else window.kb

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko, 'ko')
    ok(!!_, '_')
    ok(!!Backbone, 'Backbone')
    ok(!!kb, 'kb')
  )

  test("1. Injection", ->
    kb.statistics = new kb.Statistics() # turn on stats

    app_el = $('<div kb-app></div>')[0]

    $('body').append(app_el)
    kb.injectApps()
    ko.removeNode(app_el)

    was_called = false
    window.myCallback = (view_model) -> was_called = view_model.hello
    app_el = $('<div kb-app="view_model: {hello: true}, afterBinding: myCallback"></div>')[0]
    $('body').append(app_el)
    kb.injectApps()
    ok(was_called, "callback was called")
    ko.removeNode(app_el)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
)