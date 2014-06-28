describe('knockback_core utils', function() {
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
  it('kb.renderTemplate', function(done) {
    var ViewModel, el, view_model, was_called;
    kb.statistics = new kb.Statistics();
    if (!ko.version) {
      assert.ok(true);
      return done();
    }
    ViewModel = (function() {
      function ViewModel() {
        this.name = ko.observable('Bob');
      }

      ViewModel.prototype.afterRender = function() {
        return this.was_called = true;
      };

      return ViewModel;

    })();
    view_model = new ViewModel();
    assert.ok(!view_model.was_called, 'afterRender not called yet');
    el = $('<script type="text/x-jquery-tmpl" id="the_template1"><div data-bind="text: name"></div></script>');
    $('body').append(el);
    kb.renderTemplate('the_template1', view_model);
    assert.ok(view_model.was_called, 'afterRender was called');
    was_called = false;
    view_model = new ViewModel();
    assert.ok(!view_model.was_called, 'afterRender (options) not called yet');
    assert.ok(!view_model.was_called, 'afterRender not called yet');
    el = $('<script type="text/x-jquery-tmpl" id="the_template2"><div data-bind="text: name"></div></script>');
    $('body').append(el);
    kb.renderTemplate('the_template2', view_model, {
      afterRender: function() {
        return was_called = true;
      }
    });
    assert.ok(was_called, 'afterRender (options) was called');
    assert.ok(!view_model.was_called, 'afterRender was not called');
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  return it('kb.ignore', function(done) {
    var counter, counter_computed, counter_computed_ignore, counter_ignore, name;
    kb.statistics = new kb.Statistics();
    counter = 0;
    counter_ignore = 0;
    name = ko.observable('Bob');
    counter_computed = ko.dependentObservable((function(_this) {
      return function() {
        name();
        return ++counter;
      };
    })(this));
    counter_computed_ignore = ko.dependentObservable((function(_this) {
      return function() {
        var value;
        value = kb.ignore(function() {
          name();
          return ++counter_ignore;
        });
        return assert.equal(value, counter_ignore);
      };
    })(this));
    assert.equal(counter, 1);
    assert.equal(counter_ignore, 1);
    name('Fred');
    assert.equal(counter, 2);
    assert.equal(counter_ignore, 1);
    kb.ignore((function(arg1, arg2) {
      assert.equal(arg1, 1);
      return assert.equal(arg2, 2);
    }), null, [1, 2]);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
});
