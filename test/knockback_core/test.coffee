$(document).ready( ->
  module("knockback core.js")
  test("TEST DEPENDENCY MISSING", ->
    ko.utils; _.VERSION; Backbone.VERSION
  )

  test("Deprecated functions still exist", ->
    Knockback.wrappedObservable({__kb: {observable:{}}})
    Knockback.vmModel({__kb: {model:{}}})
    Knockback.vmSetToDefault({})
    Knockback.vmRelease({})
    Knockback.vmReleaseObservable(ko.observable())
  )

  test("Error cases", ->
    # TODO
  )
)