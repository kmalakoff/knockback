const r = typeof require !== 'undefined';
const root = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : this;
const assert = root.assert || (r ? require('chai').assert : undefined);

const kb = root.kb || (r ? require('@knockback/knockback-core') : undefined);
const _ = root._ || (r ? require('underscore') : undefined);
const Backbone = root.Backbone || (r ? require('backbone') : undefined);
const ko = root.ko || (r ? require('knockout') : undefined);
if (kb && !kb.TriggeredObservable && r) require('@knockback/knockback-triggering');

describe('triggered-observable', () => {
  it('TEST DEPENDENCY MISSING', () => {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!Backbone.Model, 'Backbone.Model');
    assert.ok(!!Backbone.Collection, 'Backbone.Collection');
    assert.ok(!!kb, 'kb');
  });

  it('1. Standard use case: simple events notifications', () => {
    kb.statistics = new kb.Statistics(); // turn on stats
    const model = new Backbone.Model();
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
  });

  it('2. Standard use case: simple events notifications (kb.observableTriggered)', () => {
    kb.statistics = new kb.Statistics(); // turn on stats
    const model = new Backbone.Model();
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
  });
});
