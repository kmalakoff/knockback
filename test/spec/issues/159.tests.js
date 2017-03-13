var assert = assert || (typeof require === 'function' ? require('chai').assert : undefined);

// https://github.com/kmalakoff/knockback/issues/159
describe('issue 159 @issue159 @quick', function() {
  var kb = typeof window !== 'undefined' && window !== null ? window.kb : undefined; try { if (!kb) { kb = typeof require === 'function' ? require('knockback') : undefined; } } catch (error) {} try { if (!kb) { kb = typeof require === 'function' ? require('../../../knockback') : undefined; } } catch (error1) {}
  const {_, ko} = kb;
  const $ = typeof window !== 'undefined' && window !== null ? window.$ : undefined;

  it('TEST DEPENDENCY MISSING', function(done) {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!kb.Model, 'kb.Model');
    assert.ok(!!kb.Collection, 'kb.Collection');
    assert.ok(!!kb, 'kb');
    return done();
  });

  return it('has no issue', function(done) {
    if (!$ || !(typeof window !== 'undefined' && window !== null ? window.document : undefined)) { return done(); }

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

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null;
    return done();
  });
});
