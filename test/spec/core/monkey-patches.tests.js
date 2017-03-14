var assert = assert || (typeof require === 'function' ? require('chai').assert : undefined);

describe('money-patches @quick @monkey', () => {
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

  const Contact = kb.Parse ? kb.Model.extend('Contact', { defaults: { name: '', number: 0, date: new Date() } }) : kb.Model.extend({ defaults: { name: '', number: 0, date: new Date() } });
  const Contacts = kb.Collection.extend({ model: Contact });

  // # https://github.com/kmalakoff/knockback/issues/124
  it('fixes memory management for extend on kb.observable', (done) => {
    if (!__guard__(ko.subscribable != null ? ko.subscribable.fn : undefined, x => x.extend)) { return done(); }
    kb.statistics = new kb.Statistics(); // turn on stats

    const model = new Contact({ name: 'Bob' });
    const observable = kb.observable(model, { key: 'name' });
    assert.ok(!kb.wasReleased(observable), 'observable not released');

    const extended_observable = observable.extend({ throttle: 100 });
    assert.ok(!kb.wasReleased(observable), 'observable not released');
    assert.ok(!kb.wasReleased(extended_observable), 'observable not released');

    kb.release(extended_observable);
    assert.ok(!!kb.wasReleased(observable), 'observable released');
    assert.ok(!!kb.wasReleased(extended_observable), 'observable released');

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });

  // # https://github.com/kmalakoff/knockback/issues/124
  it('fixes memory management for extend on kb.CollectionObservable', (done) => {
    let collection;
    if (!__guard__(ko.subscribable != null ? ko.subscribable.fn : undefined, x => x.extend)) { return done(); }
    kb.statistics = new kb.Statistics(); // turn on stats

    ko.extenders.lazyArray = function (target, timeout) {
      let addTimeout = null;
      target.elementsToDisplay = ko.observable(0);

      return ko.computed(() => {
        const all = target();
        if (target.elementsToDisplay() > all.length) {
          target.elementsToDisplay(all.length);
        } else if ((addTimeout === null) && (target.elementsToDisplay() < all.length)) {
          addTimeout = setTimeout((() => {
            addTimeout = null;
            return target.elementsToDisplay(target.elementsToDisplay() + 1);
          }), timeout);
        }
        return all.slice(0, target.elementsToDisplay());
      });
    };

    const collection_observable = kb.collectionObservable(collection = new Contacts([{ name: 'Bob' }]));
    assert.ok(!kb.wasReleased(collection_observable), 'collection_observable not released');

    const extended_collection_observable = collection_observable.extend({ lazyArray: 10 });
    assert.ok(!kb.wasReleased(collection_observable), 'collection_observable not released');
    assert.ok(!kb.wasReleased(extended_collection_observable), 'collection_observable not released');

    kb.release(extended_collection_observable);
    assert.ok(!!kb.wasReleased(collection_observable), 'collection_observable released');
    assert.ok(!!kb.wasReleased(extended_collection_observable), 'collection_observable released');

    delete ko.extenders.lazyArray;
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });

  // https://github.com/kmalakoff/knockback/issues/127
  return it('extend monkey patch does not cause arrays to destroy', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats

    class ViewModel {
      constructor() {
        this.list1 = ko.observableArray(['sds1', 'sdsd1']);
        this.list2 = ko.observableArray(['sds2', 'sdsd2']);
        this.totalNumberOfItems = ko.computed(() => this.list1().length + this.list2().length);
      }
    }

    const view_model = new ViewModel();
    assert.deepEqual(view_model.list1(), ['sds1', 'sdsd1']);
    assert.deepEqual(view_model.list2(), ['sds2', 'sdsd2']);
    assert.equal(view_model.totalNumberOfItems(), 4);

    assert.doesNotThrow(() => kb.release(view_model));
    assert.ok(!view_model.list1);
    assert.ok(!view_model.list2);
    assert.ok(!view_model.totalNumberOfItems);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });
});

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
