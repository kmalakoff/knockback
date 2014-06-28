var error, module_name;

try {
  require.config({
    paths: {
      'underscore': "../../../../vendor/underscore-1.6.0",
      'jquery': "../../../../vendor/test/jquery-1.10.2",
      'backbone': "../../../../vendor/backbone-1.1.2",
      'backbone-modelref': "../../../../vendor/optional/backbone-modelref-0.1.5",
      'knockout': "../../../../vendor/knockout-3.1.0",
      'knockback': "../../../../knockback-core",
      'knockback-localization': "../../../../lib/knockback-localization",
      'knockback-defaults': "../../../../lib/knockback-defaults",
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
  require(['underscore', 'backbone', 'knockout', module_name, 'knockback-statistics', 'knockback-localization', 'knockback-examples-localization', 'backbone-modelref', 'mocha_test_runner'], function(_, Backbone, ko, kb, kbs, kbl, kbe, bbmr, runner) {
    window._ = window.Backbone = window.ko = window.kb = null;
    return require(['../../../knockback/defaults/build/test'], function() {
      return runner.start();
    });
  });
} catch (_error) {
  error = _error;
  alert("AMD tests failed: '" + error + "'");
}
