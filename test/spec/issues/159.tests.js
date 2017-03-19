const root = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : this;
let assert; try { assert = root.assert || require('chai').assert; } catch (e) { /**/ }

let kb; try { kb = root.kb || require('knockback'); } catch (e) { kb = require('../../../knockback'); }
const { _, ko } = kb;
const { $ } = root;

// https://github.com/kmalakoff/knockback/issues/159
describe('issue 159', () => {
  it('TEST DEPENDENCY MISSING', () => {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!kb.Model, 'kb.Model');
    assert.ok(!!kb.Collection, 'kb.Collection');
    assert.ok(!!kb, 'kb');
  });

  return it('has no issue', () => {
    if (!$) return;

    kb.statistics = new kb.Statistics(); // turn on stats

    class ViewModel {
      afterRender() { return this.was_called = true; }
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
