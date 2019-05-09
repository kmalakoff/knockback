const r = typeof require !== 'undefined';
const root = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
const assert = root.assert || (r ? require('chai').assert : undefined);

const kb = root.kb || (r ? require('@knockback/core') : undefined);
const _ = root._ || (r ? require('underscore') : undefined);
const Backbone = root.Backbone || (r ? require('backbone') : undefined);
const ko = root.ko || (r ? require('knockout') : undefined);

const { $ } = root;

describe('knockback_core', () => {
  it('TEST DEPENDENCY MISSING', () => {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!Backbone.Model, 'Backbone.Model');
    assert.ok(!!Backbone.Collection, 'Backbone.Collection');
    assert.ok(!!kb, 'kb');
  });

  it('kb.renderTemplate', () => {
    if (!$) return;

    kb.statistics = new kb.Statistics(); // turn on stats

    class ViewModel {
      constructor() {
        this.name = ko.observable('Bob');
      }

      afterRender() {
        this.was_called = true;
      }
    }

    // test without options override
    let view_model = new ViewModel();
    assert.ok(!view_model.was_called, 'afterRender not called yet');
    let el = $('<script type="text/x-jquery-tmpl" id="the_template1"><div data-bind="text: name"></div></script>');
    $('body').append(el);
    kb.renderTemplate('the_template1', view_model);
    assert.ok(view_model.was_called, 'afterRender was called');

    // test with options override
    let was_called = false;
    view_model = new ViewModel();
    assert.ok(!view_model.was_called, 'afterRender (options) not called yet');
    assert.ok(!view_model.was_called, 'afterRender not called yet');
    el = $('<script type="text/x-jquery-tmpl" id="the_template2"><div data-bind="text: name"></div></script>');
    $('body').append(el);
    kb.renderTemplate('the_template2', view_model, {
      afterRender() {
        was_called = true;
      }
    });
    assert.ok(was_called, 'afterRender (options) was called');
    assert.ok(!view_model.was_called, 'afterRender was not called');

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats');
    kb.statistics = null;
  });

  it('kb.ignore', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    let counter = 0;
    let counter_ignore = 0;

    const name = ko.observable('Bob');
    ko.computed(() => {
      name();
      return ++counter;
    });

    ko.computed(() => {
      const value = kb.ignore(() => {
        name();
        return ++counter_ignore;
      });
      return assert.equal(value, counter_ignore);
    });

    assert.equal(counter, 1);
    assert.equal(counter_ignore, 1);

    name('Fred');
    assert.equal(counter, 2);
    assert.equal(counter_ignore, 1);

    // ignore with arguments
    kb.ignore(
      (arg1, arg2) => {
        assert.equal(arg1, 1);
        assert.equal(arg2, 2);
      },
      null,
      [1, 2]
    );

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats');
    kb.statistics = null;
  });
});
