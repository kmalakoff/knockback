const assert = assert || (typeof require === 'function' ? require('chai').assert : undefined);

describe('triggered-observable @quick @triggering', () => {
  let kb = typeof window !== 'undefined' ? window.kb : undefined; try { if (!kb) { kb = typeof require === 'function' ? require('knockback') : undefined; } } catch (error) {} try { if (!kb) { kb = typeof require === 'function' ? require('../../../knockback') : undefined; } } catch (error1) {}
  const { _, ko } = kb;

  it('TEST DEPENDENCY MISSING', (done) => {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!kb.Model, 'kb.Model');
    assert.ok(!!kb.Collection, 'kb.Collection');
    assert.ok(!!kb, 'kb');
    return done();
  });

  it('1. Standard use case: simple events notifications', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats
    const model = new kb.Model();
    model.setLocale = () => model.trigger('change', model);

    let trigger_count = 0;

    const view_model =
      { triggered_observable: kb.triggeredObservable(model, 'change') };
    view_model.counter = ko.computed(() => {
      view_model.triggered_observable(); // add a dependency
      return trigger_count++;
    });

    assert.equal(trigger_count, 1, '1: was set up');

    model.trigger('change', model);
    assert.equal(trigger_count, 2, '2: changed');

    model.setLocale('fr-FR');
    assert.equal(trigger_count, 3, '3: changed');

    // and cleanup after yourself when you are done.
    kb.release(view_model);
    assert.equal(trigger_count, 3, '3: no change');

    // KO doesn't have a dispose for ko.observable
    model.setLocale('fr-FR');
    assert.equal(trigger_count, 3, '3: no change');

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });

  return it('2. Standard use case: simple events notifications (kb.observableTriggered)', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats
    const model = new kb.Model();
    model.setLocale = () => model.trigger('change', model);

    let trigger_count = 0;

    const view_model =
      { triggered_observable: kb.observableTriggered(model, 'change') };
    view_model.counter = ko.computed(() => {
      view_model.triggered_observable(); // add a dependency
      return trigger_count++;
    });

    assert.equal(trigger_count, 1, '1: was set up');

    model.trigger('change', model);
    assert.equal(trigger_count, 2, '2: changed');

    model.setLocale('fr-FR');
    assert.equal(trigger_count, 3, '3: changed');

    // and cleanup after yourself when you are done.
    kb.release(view_model);
    assert.equal(trigger_count, 3, '3: no change');

    // KO doesn't have a dispose for ko.observable
    model.setLocale('fr-FR');
    assert.equal(trigger_count, 3, '3: no change');

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });
});
