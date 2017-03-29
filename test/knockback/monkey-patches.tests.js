const r = typeof require !== 'undefined';
const root = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : this;
let assert = root.assert; assert = assert || (r ? require('chai').assert : undefined);

let kb = root.kb; kb = kb || (r ? require('knockback') : undefined);
const { _, Backbone, ko } = kb;

describe('money-patches', () => {
  it('TEST DEPENDENCY MISSING', () => {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!Backbone.Model, 'Backbone.Model');
    assert.ok(!!Backbone.Collection, 'Backbone.Collection');
    assert.ok(!!kb, 'kb');
  });

  const Contact = Backbone.Model.extend({ defaults: { name: '', number: 0, date: new Date() } });
  const Contacts = Backbone.Collection.extend({ model: Contact });

  // # https://github.com/kmalakoff/knockback/issues/124
  it('fixes memory management for extend on kb.observable', () => {
    if (!ko.subscribable && !ko.subscribable.fn && !ko.subscribable.fn.extend) return;
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
  });

  // # https://github.com/kmalakoff/knockback/issues/124
  it('fixes memory management for extend on kb.CollectionObservable', () => {
    if (!ko.subscribable && !ko.subscribable.fn && !ko.subscribable.fn.extend) return;
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

    const collection = new Contacts([{ name: 'Bob' }]);
    const collection_observable = kb.collectionObservable(collection);
    assert.ok(!kb.wasReleased(collection_observable), 'collection_observable not released');

    const extended_collection_observable = collection_observable.extend({ lazyArray: 10 });
    assert.ok(!kb.wasReleased(collection_observable), 'collection_observable not released');
    assert.ok(!kb.wasReleased(extended_collection_observable), 'collection_observable not released');

    kb.release(extended_collection_observable);
    assert.ok(!!kb.wasReleased(collection_observable), 'collection_observable released');
    assert.ok(!!kb.wasReleased(extended_collection_observable), 'collection_observable released');

    delete ko.extenders.lazyArray;
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  // https://github.com/kmalakoff/knockback/issues/127
  it('extend monkey patch does not cause arrays to destroy', () => {
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
  });
});
