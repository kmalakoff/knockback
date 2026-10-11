import kb from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ModelRef from 'backbone-modelref';
import ko from 'knockout';
import { EventWatcher } from '../../src/event-watcher.ts';
import { listenerCount } from '../lib/backbone-events.ts';

describe('EventWatcher', () => {
  it('rejects malformed present event state', () => {
    assert.strictEqual(listenerCount({}, 'change'), 0);
    assert.strictEqual(listenerCount({ _events: null }, 'change'), 0);
    assert.throws(() => listenerCount({ _events: 'invalid' }, 'change'), TypeError);
  });

  it('tracks string, changing observable, and unkeyed event keys', () => {
    const previousStatistics = kb.getStatistics();
    const statistics = new kb.Statistics();
    const model = new Backbone.Model({ name: 'first', title: 'initial' });
    const selectedKey = ko.observable('name');
    const watcher = new EventWatcher(model);
    let stringUpdates = 0;
    let observableUpdates = 0;
    let unkeyedUpdates = 0;

    try {
      kb.setStatistics(statistics);
      watcher.registerCallbacks({}, { key: 'name', update: () => stringUpdates++ });
      watcher.registerCallbacks({}, { key: selectedKey, update: () => observableUpdates++ });
      watcher.registerCallbacks({}, { eventSelector: 'refresh', update: () => unkeyedUpdates++ });

      model.set('name', 'second');
      assert.strictEqual(stringUpdates, 1);
      assert.strictEqual(observableUpdates, 1);
      assert.strictEqual(statistics.modelEventsTracker.length, 2);
      assert.strictEqual(statistics.modelEventsTracker[0].key, 'name');
      assert.strictEqual(statistics.modelEventsTracker[1].key, selectedKey);

      selectedKey('title');
      statistics.clear();
      model.set('name', 'third');
      assert.strictEqual(stringUpdates, 2);
      assert.strictEqual(observableUpdates, 1);
      assert.strictEqual(statistics.modelEventsTracker.length, 1);
      assert.strictEqual(statistics.modelEventsTracker[0].key, 'name');

      model.set('title', 'changed');
      assert.strictEqual(stringUpdates, 2);
      assert.strictEqual(observableUpdates, 2);
      assert.strictEqual(statistics.modelEventsTracker.length, 2);
      assert.strictEqual(statistics.modelEventsTracker[1].key, selectedKey);

      statistics.clear();
      model.trigger('refresh');
      assert.strictEqual(unkeyedUpdates, 1);
      assert.strictEqual(statistics.modelEventsTracker.length, 1);
      assert.strictEqual(Object.hasOwn(statistics.modelEventsTracker[0], 'key'), true);
      assert.strictEqual(statistics.modelEventsTracker[0].key, undefined);

      statistics.clear();
      watcher.dispose();
      model.set({ name: 'disposed', title: 'disposed' });
      model.trigger('refresh');
      assert.deepStrictEqual(statistics.modelEventsTracker, []);
      assert.strictEqual(stringUpdates, 2);
      assert.strictEqual(observableUpdates, 2);
      assert.strictEqual(unkeyedUpdates, 1);
    } finally {
      watcher.dispose();
      kb.setStatistics(previousStatistics);
    }
  });

  it('clears an ordinary model and stops its callbacks', () => {
    const model = new Backbone.Model({ name: 'before' });
    let updates = 0;
    const watcher = new EventWatcher(
      model,
      {},
      {
        update: () => updates++,
      }
    );

    assert.strictEqual(listenerCount(model, 'change'), 1);
    watcher.emitter(null);
    assert.strictEqual(watcher.emitter(), null);
    assert.strictEqual(listenerCount(model, 'change'), 0);

    model.set('name', 'after');
    assert.strictEqual(updates, 0);

    watcher.dispose();
    watcher.dispose();
    assert.strictEqual(listenerCount(model, 'change'), 0);
  });

  it('removes ordinary-model listeners on direct repeated disposal', () => {
    const model = new Backbone.Model({ name: 'before' });
    const watcher = new EventWatcher(
      model,
      {},
      {
        update: () => undefined,
      }
    );

    assert.strictEqual(listenerCount(model, 'change'), 1);
    watcher.dispose();
    watcher.dispose();
    assert.strictEqual(watcher.emitter(), null);
    assert.strictEqual(listenerCount(model, 'change'), 0);
  });

  it('retains a ModelRef and follows its loaded model', () => {
    const collection = new Backbone.Collection<Backbone.Model>();
    const reference = new ModelRef(collection, 0);
    const owner = {};
    const emitters: Array<Backbone.Model | null> = [];
    const watcher = new EventWatcher(reference, owner, {
      emitter: (model) => emitters.push(model),
    });

    assert.strictEqual(reference.ref_count, 2);
    assert.strictEqual(watcher.emitter(), null);

    const model = new Backbone.Model({ id: 0, name: 'zero' });
    collection.add(model);

    assert.strictEqual(watcher.emitter(), model);
    assert.deepStrictEqual(emitters, [model]);

    watcher.dispose();
    assert.strictEqual(reference.ref_count, 1);
    reference.release();
  });

  it('runs ordinary emitters before a deferred emitter during reentrant registration', () => {
    const firstModel = new Backbone.Model({ name: 'first' });
    const secondModel = new Backbone.Model({ name: 'second' });
    const order: string[] = [];
    const parent = {};
    const child = {};
    const watcher = new EventWatcher();
    let registeringChild = false;
    let childRegistered = false;

    watcher.registerCallbacks(parent, {
      emitterAfterCallbacks: true,
      emitter: (model) => {
        if (!model || registeringChild) return;
        if (!childRegistered) {
          registeringChild = true;
          childRegistered = true;
          watcher.registerCallbacks(child, {
            emitter: (childModel) => {
              if (childModel) order.push(`child:${childModel.get('name')}`);
            },
          });
          registeringChild = false;
        }
        order.push(`parent:${model.get('name')}`);
      },
    });

    watcher.emitter(firstModel);
    assert.deepStrictEqual(order, ['child:first', 'parent:first']);

    order.length = 0;
    watcher.emitter(secondModel);
    assert.deepStrictEqual(order, ['child:second', 'parent:second']);

    watcher.dispose();
  });

  it('transfers ownership across reference and ordinary-model replacements', () => {
    const firstCollection = new Backbone.Collection<Backbone.Model>();
    const firstModel = new Backbone.Model({ id: 0, name: 'first' });
    firstCollection.add(firstModel);
    const firstReference = new ModelRef(firstCollection, 0);
    const secondCollection = new Backbone.Collection<Backbone.Model>();
    const secondReference = new ModelRef(secondCollection, 1);
    const ordinaryModel = new Backbone.Model({ name: 'ordinary' });
    const watcher = new EventWatcher(
      firstReference,
      {},
      {
        update: () => undefined,
      }
    );

    assert.strictEqual(firstReference.ref_count, 2);
    assert.strictEqual(watcher.emitter(), firstModel);

    watcher.emitter(ordinaryModel);
    assert.strictEqual(firstReference.ref_count, 1);
    assert.strictEqual(listenerCount(firstReference, 'loaded'), 0);
    assert.strictEqual(listenerCount(firstReference, 'unloaded'), 0);
    assert.strictEqual(watcher.emitter(), ordinaryModel);
    assert.strictEqual(listenerCount(ordinaryModel, 'change'), 1);

    watcher.emitter(secondReference);
    assert.strictEqual(listenerCount(ordinaryModel, 'change'), 0);
    assert.strictEqual(secondReference.ref_count, 2);
    assert.strictEqual(watcher.emitter(), null);

    const secondModel = new Backbone.Model({ id: 1, name: 'second' });
    secondCollection.add(secondModel);
    assert.strictEqual(watcher.emitter(), secondModel);

    watcher.emitter(null);
    assert.strictEqual(secondReference.ref_count, 1);
    assert.strictEqual(listenerCount(secondReference, 'loaded'), 0);
    assert.strictEqual(listenerCount(secondReference, 'unloaded'), 0);
    assert.strictEqual(watcher.emitter(), null);
    assert.strictEqual(listenerCount(secondModel, 'change'), 0);

    watcher.dispose();
    watcher.dispose();
    assert.strictEqual(firstReference.ref_count, 1);
    assert.strictEqual(secondReference.ref_count, 1);
    firstReference.release();
    secondReference.release();
  });
});
