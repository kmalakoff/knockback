try
  require.config({
    paths:
      'underscore': "../../../../vendor/underscore-1.5.2"
      'backbone': "../../../../vendor/backbone-1.1.0"
      'backbone-modelref': "../../../../vendor/optional/backbone-modelref/backbone-modelref-0.1.5"
      'knockout': "../../../../vendor/knockout-3.0.0"
      'knockback': "../../../../knockback"
      'knockback-localization': "../../../../lib/localization"
      'knockback-examples-localization': "../../../_examples/build/_localization_examples"
      'knockback-statistics': "../../../../lib/statistics"
    shim:
      underscore:
        exports: '_'
      backbone:
        exports: 'Backbone'
        deps: ['underscore']
  })

  module_name = 'knockback-defaults'
  module_name = 'knockback' if (require.toUrl(module_name).split('./..').length is 1)

  # library and dependencies
  require ['underscore', 'backbone', 'knockout', module_name, 'knockback-statistics', 'knockback-examples-localization', 'backbone-modelref', 'mocha_test_runner'], (_, Backbone, ko, kb, kbs, kbe, bbmr, runner) ->
    window._ = window.Backbone = window.ko = window.kb = null # force each test to require dependencies synchronously
    require ['../../../knockback/defaults/build/test'], -> runner.start()

catch error
  alert("AMD tests failed: '#{error}'")