const r = typeof require !== 'undefined';
const root = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : this;
let assert = root.assert; try { assert = assert || (r ? require('chai').assert : undefined); } catch (e) { /**/ }

let kb = root.kb; try { kb = kb || (r ? require('knockback') : undefined); } catch (e) { /* */ }
const { _, Backbone, ko } = kb;
const { $ } = root;

// https://github.com/kmalakoff/knockback/issues/159
describe('issue 159', () => {
  it('TEST DEPENDENCY MISSING', () => {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!Backbone.Model, 'Backbone.Model');
    assert.ok(!!Backbone.Collection, 'Backbone.Collection');
    assert.ok(!!kb, 'kb');
  });

  it('has no issue', () => {
    if (!$) return;

    kb.statistics = new kb.Statistics(); // turn on stats

    class ViewModel {
      afterRender() { this.was_called = true; }
    }

    // test without options override
    const view_model = new ViewModel();
    assert.ok(!view_model.was_called, 'afterRender not called yet');
    const el = $(`<script type="text/x-jquery-tmpl" id="the_template1">
  <div>
    <div>...</div>
  </div>
  <div>
    <div>...</div>
  </div>
</script>`);
    $('body').append(el);
    kb.renderTemplate('the_template1', view_model);
    assert.ok(view_model.was_called, 'afterRender was called');

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });
});
