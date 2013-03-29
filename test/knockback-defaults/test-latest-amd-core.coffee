try
  require.config({
    paths:
      'underscore': "../../vendor/underscore-1.4.4"
      'backbone': "../../vendor/backbone-1.0.0"
      'backbone-modelref': "../../vendor/optional/backbone-modelref-0.1.5"
      'knockout': "../../vendor/knockout-2.2.1"
      'knockback': "../../knockback-core"
      'knockback-defaults': "../../lib/knockback-defaults"
      'knockback-localization': "../../lib/knockback-localization"
      'knockback-examples-localization': "../_examples/build/_localization_examples"
      'knockback-statistics': "../../lib/knockback-statistics"
  })

  module_name = 'knockback-defaults'
  module_name = 'knockback' if (require.toUrl(module_name).split('./..').length is 1)

  # library and dependencies
  require ['underscore', 'backbone', 'knockout', module_name, 'knockback-statistics', 'knockback-examples-localization', 'backbone-modelref', 'qunit_test_runner'], (_, Backbone, ko, kb, kbs, kbe, bbmr, runner) ->
    # window._ = window.Backbone = null # force each test to require dependencies synchronously
    window.ko = window.kb = null

    require ['./build/test'], ->
      runner.start()

catch error
  alert("AMD tests failed: '#{error}'")