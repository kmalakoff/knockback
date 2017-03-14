const root = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : this;
const assert = root.assert || (typeof require === 'function' ? require('chai').assert : undefined);

describe('knockback_core utils @quick @core', () => {
  let kb = typeof window !== 'undefined' ? window.kb : undefined; try { if (!kb) { kb = typeof require === 'function' ? require('knockback') : undefined; } } catch (error) {} try { if (!kb) { kb = typeof require === 'function' ? require('../../../knockback') : undefined; } } catch (error1) {}
  const { _, ko } = kb;
  const $ = typeof window !== 'undefined' ? window.$ : undefined;

  it('TEST DEPENDENCY MISSING', (done) => {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!kb.Model, 'kb.Model');
    assert.ok(!!kb.Collection, 'kb.Collection');
    assert.ok(!!kb, 'kb');
    return done();
  });

  it('kb.renderTemplate', (done) => {
    if (!$ || !(typeof window !== 'undefined' ? window.document : undefined)) return done();

    kb.statistics = new kb.Statistics(); // turn on stats

    class ViewModel {
      constructor() {
        this.name = ko.observable('Bob');
      }
      afterRender() {
        return this.was_called = true;
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
    kb.renderTemplate('the_template2', view_model, { afterRender() { return was_called = true; } });
    assert.ok(was_called, 'afterRender (options) was called');
    assert.ok(!view_model.was_called, 'afterRender was not called');

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });

  return it('kb.ignore', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats

    let counter = 0;
    let counter_ignore = 0;

    const name = ko.observable('Bob');
    const counter_computed = ko.computed(() => {
      name();
      return ++counter;
    });

    const counter_computed_ignore = ko.computed(() => {
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
    kb.ignore(((arg1, arg2) => { assert.equal(arg1, 1); return assert.equal(arg2, 2); }), null, [1, 2]);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });
});
