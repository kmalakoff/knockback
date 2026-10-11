import { EventWatcher } from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';
import { Factory } from '../../src/factory.ts';
import type { CreateOptions } from '../../src/internal-types.ts';
import { Store } from '../../src/store.ts';
import type { KBMetadata } from '../../src/types.ts';
import { disposeMetadata, get, has, orSet, set, wrappedCreator, wrappedEventWatcher, wrappedEventWatcherIsOwned, wrappedFactory, wrappedModel, wrappedObject, wrappedObservable, wrappedStore, wrappedStoreIsOwned } from '../../src/utils.ts';

class TestCreator {
  constructor(obj: unknown, options: CreateOptions) {
    void obj;
    void options;
  }
}

describe('metadata utils', () => {
  it('reads and writes metadata on opaque and callable owners', () => {
    const opaqueOwner = { unrelated: true };
    const callableOwner = () => undefined;
    const observableOwner = ko.observable('value');
    const model = new Backbone.Model({ name: 'Ada' });

    assert.strictEqual(get(opaqueOwner, 'store_is_owned', false), false);
    assert.strictEqual(has(opaqueOwner, 'store_is_owned'), false);

    assert.strictEqual(set(opaqueOwner, 'store_is_owned', true), true);
    assert.strictEqual(get(opaqueOwner, 'store_is_owned'), true);
    assert.strictEqual(has(opaqueOwner, 'store_is_owned'), true);

    assert.strictEqual(set(callableOwner, 'observable', observableOwner), observableOwner);
    assert.strictEqual(get(callableOwner, 'observable'), observableOwner);

    assert.strictEqual(set(observableOwner, 'object', model), model);
    assert.strictEqual(get(observableOwner, 'object'), model);
  });

  it('sets metadata once and preserves an existing own undefined value', () => {
    const owner = {};
    const undefinedOwner = {};

    assert.strictEqual(orSet(owner, 'store_is_owned', false), false);
    assert.strictEqual(orSet(owner, 'store_is_owned', true), false);

    set(undefinedOwner, 'store_is_owned', undefined);
    assert.strictEqual(has(undefinedOwner, 'store_is_owned'), true);
    assert.strictEqual(orSet(undefinedOwner, 'store_is_owned', true), undefined);
  });

  it('recreates metadata after disposal clears the reserved property', () => {
    const owner: { __kb?: KBMetadata | null } = {};

    set(owner, 'store_is_owned', true);
    disposeMetadata(owner);
    assert.strictEqual(owner.__kb, null);

    set(owner, 'store_is_owned', false);
    assert.strictEqual(get(owner, 'store_is_owned'), false);
  });

  it('distinguishes one-argument reads from explicit undefined writes', () => {
    const observableOwner = {};
    const objectOwner = {};
    const creatorOwner = {};
    const modelOwner = {};
    const storeOwner = {};
    const storeOwnershipOwner = {};
    const factoryOwner = {};
    const eventWatcherOwner = {};
    const eventWatcherOwnershipOwner = {};
    const observable = ko.observable('value');
    const model = new Backbone.Model({ name: 'Ada' });
    const store = new Store();
    const factory = new Factory();
    const eventWatcher = new EventWatcher();

    try {
      assert.strictEqual(wrappedObservable(observableOwner, observable), observable);
      assert.strictEqual(wrappedObject(objectOwner, model), model);
      assert.strictEqual(wrappedCreator(creatorOwner, TestCreator), TestCreator);
      assert.strictEqual(wrappedModel(modelOwner, model), model);
      assert.strictEqual(wrappedStore(storeOwner, store), store);
      assert.strictEqual(wrappedStoreIsOwned(storeOwnershipOwner, true), true);
      assert.strictEqual(wrappedFactory(factoryOwner, factory), factory);
      assert.strictEqual(wrappedEventWatcher(eventWatcherOwner, eventWatcher), eventWatcher);
      assert.strictEqual(wrappedEventWatcherIsOwned(eventWatcherOwnershipOwner, true), true);

      assert.strictEqual(wrappedObservable(observableOwner), observable);
      assert.strictEqual(wrappedObject(objectOwner), model);
      assert.strictEqual(wrappedCreator(creatorOwner), TestCreator);
      assert.strictEqual(wrappedModel(modelOwner), model);
      assert.strictEqual(wrappedStore(storeOwner), store);
      assert.strictEqual(wrappedStoreIsOwned(storeOwnershipOwner), true);
      assert.strictEqual(wrappedFactory(factoryOwner), factory);
      assert.strictEqual(wrappedEventWatcher(eventWatcherOwner), eventWatcher);
      assert.strictEqual(wrappedEventWatcherIsOwned(eventWatcherOwnershipOwner), true);

      assert.strictEqual(wrappedObservable(observableOwner, undefined), undefined);
      assert.strictEqual(wrappedObject(objectOwner, undefined), undefined);
      assert.strictEqual(wrappedCreator(creatorOwner, undefined), undefined);
      assert.strictEqual(wrappedModel(modelOwner, undefined), undefined);
      assert.strictEqual(wrappedStore(storeOwner, undefined), undefined);
      assert.strictEqual(wrappedStoreIsOwned(storeOwnershipOwner, undefined), undefined);
      assert.strictEqual(wrappedFactory(factoryOwner, undefined), undefined);
      assert.strictEqual(wrappedEventWatcher(eventWatcherOwner, undefined), undefined);
      assert.strictEqual(wrappedEventWatcherIsOwned(eventWatcherOwnershipOwner, undefined), undefined);

      assert.strictEqual(wrappedObservable(observableOwner), undefined);
      assert.strictEqual(wrappedObject(objectOwner), undefined);
      assert.strictEqual(wrappedCreator(creatorOwner), undefined);
      assert.strictEqual(wrappedModel(modelOwner), modelOwner);
      assert.strictEqual(wrappedStore(storeOwner), undefined);
      assert.strictEqual(wrappedStoreIsOwned(storeOwnershipOwner), undefined);
      assert.strictEqual(wrappedFactory(factoryOwner), undefined);
      assert.strictEqual(wrappedEventWatcher(eventWatcherOwner), undefined);
      assert.strictEqual(wrappedEventWatcherIsOwned(eventWatcherOwnershipOwner), undefined);
    } finally {
      eventWatcher.dispose();
      store.dispose();
    }
  });

  it('preserves null writes and the wrapped model getter fallback', () => {
    const objectOwner = {};
    const modelOwner = {};

    assert.strictEqual(wrappedObject(objectOwner, null), null);
    assert.strictEqual(wrappedObject(objectOwner), null);
    assert.strictEqual(wrappedModel(modelOwner, null), null);
    assert.strictEqual(wrappedModel(modelOwner), null);

    const fallbackOwner = {};
    assert.strictEqual(wrappedModel(fallbackOwner), fallbackOwner);
  });
});
