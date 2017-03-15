const root = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : this;
const assert = root.assert || (typeof require === 'function' ? require('chai').assert : undefined);

// https://github.com/kmalakoff/knockback/issues/159
describe('issue 159 @issue159 @quick', () => {
  let kb = typeof window !== 'undefined' ? root.kb : undefined;
  try { if (!kb) { kb = typeof require === 'function' ? require('knockback') : undefined; } } catch (error) { /**/ }
  try { if (!kb) { kb = typeof require === 'function' ? require('../../../knockback') : undefined; } } catch (error1) { /**/ }
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

  return it('has no issue', (done) => {
    if (!$ || !(typeof window !== 'undefined' ? window.document : undefined)) return done();

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
    return done();
  });
});
