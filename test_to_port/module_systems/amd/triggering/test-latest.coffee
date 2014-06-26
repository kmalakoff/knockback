try
  require.config({
    paths:
      'underscore': "../../../../vendor/underscore-1.6.0"
      'jquery': "../../../../vendor/test/jquery-1.10.2"
      'backbone': "../../../../vendor/backbone-1.1.2"
      'knockout': "../../../../vendor/knockout-3.1.0"
      'knockback': "../../../../knockback"
      'knockback-statistics': "../../../../lib/knockback-statistics"
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
  require ['underscore', 'backbone', 'knockout', module_name, 'knockback-statistics', 'mocha_test_runner'], (_, Backbone, ko, kb, kbs, runner) ->
    window._ = window.Backbone = window.ko = window.kb = null # force each test to require dependencies synchronously
    require ['../../../knockback/triggering/build/test'], -> runner.start()