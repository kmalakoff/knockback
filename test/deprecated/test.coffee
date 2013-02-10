$(->
  module("knockback legacy.js")

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

  test("0.16.0 deprecations", ->
    ok(true)
  )
)