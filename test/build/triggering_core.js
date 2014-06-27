(function() {
  var _start = window.__karma__.start, _config;
  window.__karma__.start = function(config) { _config = config; };

  require.config({
  "paths": {
    "jquery": "/base/vendor/test/jquery-1.11.1.min",
    "underscore": "/base/vendor/underscore-1.6.0",
    "backbone": "/base/vendor/backbone-1.1.2",
    "knockout": "/base/vendor/knockout-3.1.0",
    "knockback": "/base/knockback-core",
    "knockback-statistics": "/base/lib/knockback-statistics",
    "knockback-triggering": "/base/lib/knockback-triggering"
  },
  "shim": {
    "underscore": {
      "exports": "_"
    },
    "backbone": {
      "exports": "Backbone",
      "deps": [
        "underscore"
      ]
    }
  }
});

  require(["jquery","underscore","backbone","knockout","knockback","knockback-statistics","knockback-triggering"], function(){
    window._ = window.Backbone = window.ko = window.kb = null; // force each test to require dependencies synchronously
    (function() {
  describe('knockback-triggered-observable.js', function() {
    var kb, ko, _;
    ko = window.ko || (typeof require === "function" ? require('knockout') : void 0);
    kb = window.kb || (typeof require === "function" ? require('knockback') : void 0);
    _ = kb._;
    it('TEST DEPENDENCY MISSING', function(done) {
      assert.ok(!!ko, 'ko');
      assert.ok(!!_, '_');
      assert.ok(!!kb.Model, 'kb.Model');
      assert.ok(!!kb.Collection, 'kb.Collection');
      assert.ok(!!kb, 'kb');
      return done();
    });
    return it('Standard use case: simple events notifications', function(done) {
      var model, trigger_count, view_model;
      kb.statistics = new kb.Statistics();
      model = new kb.Model;
      model.setLocale = function() {
        return model.trigger('change', model);
      };
      trigger_count = 0;
      view_model = {
        triggered_observable: kb.triggeredObservable(model, 'change')
      };
      view_model.counter = ko.dependentObservable(function() {
        view_model.triggered_observable();
        return trigger_count++;
      });
      assert.equal(trigger_count, 1, "1: was set up");
      model.trigger('change', model);
      assert.equal(trigger_count, 2, "2: changed");
      model.setLocale('fr-FR');
      assert.equal(trigger_count, 3, "3: changed");
      kb.release(view_model);
      assert.equal(trigger_count, 3, "3: no change");
      model.setLocale('fr-FR');
      assert.equal(trigger_count, 3, "3: no change");
      assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
      kb.statistics = null;
      return done();
    });
  });

}).call(this);


    _start(_config);
  });
}).call(this);