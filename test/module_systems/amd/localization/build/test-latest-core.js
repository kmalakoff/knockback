var module_name;

try {
  require.config({
    paths: {
      'underscore': "../../../../vendor/underscore-1.6.0",
      'jquery': "../../../../vendor/test/jquery-1.10.2",
      'backbone': "../../../../vendor/backbone-1.1.2",
      'knockout': "../../../../vendor/knockout-3.1.0",
      'knockback': "../../../../knockback-core",
      'knockback-localization': "../../../../lib/knockback-localization",
      'knockback-examples-localization': "../../../_examples/build/_localization_examples",
      'knockback-statistics': "../../../../lib/knockback-statistics"
    },
    shim: {
      underscore: {
        exports: '_'
      },
      backbone: {
        exports: 'Backbone',
        deps: ['underscore']
      }
    }
  });
  module_name = 'knockback-defaults';
  if (require.toUrl(module_name).split('./..').length === 1) {
    module_name = 'knockback';
  }
  require(['underscore', 'backbone', 'knockout', module_name, 'knockback-statistics', 'knockback-localization', 'knockback-examples-localization', 'mocha_test_runner'], function(_, Backbone, ko, kb, kbs, kbl, kbe, runner) {
    window._ = window.Backbone = window.ko = window.kb = null;
    return require(['../../../knockback/localization/build/test'], function() {
      return runner.start();
    });
  });
} catch (_error) {}
