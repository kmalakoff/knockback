import kb, { type CollectionObservable } from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';
import { Store } from '../../src/store.ts';
import { wrappedObject } from '../../src/utils.ts';
import { deeplyNestedEqualValues } from '../lib/deeply-nested-values.ts';

interface ShareableCollectionObservable<T> extends CollectionObservable<T> {
  __kb?: unknown;
  shareOptions(): { store: unknown; factory: unknown };
}

describe('CollectionObservable advanced', () => {
  describe('sorting', () => {
    it('should sort by sortAttribute', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface NameViewModel {
        name: ko.Observable<string>;
      }

      const collection = new Backbone.Collection([
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 },
      ]);

      const co = kb.collectionObservable<NameViewModel>(collection, { sortAttribute: 'name' });
      const names = co().map((vm) => vm.name());

      assert.deepStrictEqual(names, ['Alice', 'Bob', 'Charlie'], 'Sorted by name');

      co.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should sort with custom comparator', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface AgeViewModel {
        age: ko.Observable<number>;
      }

      const collection = new Backbone.Collection([
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 },
      ]);

      // Comparator receives view models, not raw models
      const co = kb.collectionObservable<AgeViewModel>(collection, {
        comparator: (a, b) => {
          return b.age() - a.age(); // Descending by age
        },
      });

      const ages = co().map((vm) => vm.age());
      assert.deepStrictEqual(ages, [35, 30, 25], 'Sorted by age descending');

      co.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should re-sort when sort attribute changes', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface NameViewModel {
        name: ko.Observable<string>;
      }

      const collection = new Backbone.Collection([
        { name: 'Charlie', priority: 2 },
        { name: 'Alice', priority: 1 },
        { name: 'Bob', priority: 3 },
      ]);

      const co = kb.collectionObservable<NameViewModel>(collection, { sortAttribute: 'priority' });

      let names = co().map((vm) => vm.name());
      assert.deepStrictEqual(names, ['Alice', 'Charlie', 'Bob'], 'Initial sort');

      // Change priority
      collection.at(0)?.set('priority', 5);

      names = co().map((vm) => vm.name());
      assert.deepStrictEqual(names, ['Alice', 'Bob', 'Charlie'], 'Re-sorted after change');

      co.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('filters', () => {
    it('should filter with filters option', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface NameViewModel {
        name: ko.Observable<string>;
      }

      const collection = new Backbone.Collection([
        { name: 'Alice', active: true },
        { name: 'Bob', active: false },
        { name: 'Charlie', active: true },
      ]);

      const co = kb.collectionObservable<NameViewModel>(collection, {
        filters: (model: Backbone.Model) => model.get('active') === true,
      });

      assert.strictEqual(co().length, 2, 'Only active items');
      const names = co().map((vm) => vm.name());
      assert.deepStrictEqual(names, ['Alice', 'Charlie']);

      co.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should update when filtered attribute changes', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface NameViewModel {
        name: ko.Observable<string>;
      }

      const collection = new Backbone.Collection([
        { name: 'Alice', active: true },
        { name: 'Bob', active: false },
      ]);

      const co = kb.collectionObservable<NameViewModel>(collection, {
        filters: (model: Backbone.Model) => model.get('active') === true,
      });

      assert.strictEqual(co().length, 1);

      // Activate Bob
      collection.at(1)?.set('active', true);
      assert.strictEqual(co().length, 2);

      // Deactivate Alice
      collection.at(0)?.set('active', false);
      assert.strictEqual(co().length, 1);
      assert.strictEqual(co()[0].name(), 'Bob');

      co.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('collection observable', () => {
    it('should expose collection via .collection()', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface NameViewModel {
        name: ko.Observable<string>;
      }

      const collection = new Backbone.Collection([{ name: 'Alice' }]);
      const co = kb.collectionObservable<NameViewModel>(collection);

      assert.ok(ko.isObservable(co.collection), 'collection is observable');
      assert.strictEqual(co.collection(), collection);

      co.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should trigger updates when collection is swapped', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface NameViewModel {
        name: ko.Observable<string>;
      }

      const collection1 = new Backbone.Collection([{ name: 'Alice' }]);
      const collection2 = new Backbone.Collection([{ name: 'Bob' }, { name: 'Charlie' }]);

      const co = kb.collectionObservable<NameViewModel>(collection1);

      let changeCount = 0;
      ko.computed(() => {
        co();
        changeCount++;
      });

      assert.strictEqual(changeCount, 1);
      assert.strictEqual(co().length, 1);

      co.collection(null);
      assert.deepStrictEqual(co(), []);

      co.collection(collection2);
      assert.strictEqual(co().length, 2);

      co.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('array mutations', () => {
    it('should support push and unshift', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const collection = new Backbone.Collection([{ name: 'Alice' }]);
      const co = kb.collectionObservable<Backbone.Model>(collection, { modelsOnly: true });

      assert.strictEqual(co().length, 1);

      collection.push(new Backbone.Model({ name: 'Bob' }));
      assert.strictEqual(co().length, 2);
      assert.strictEqual(co()[1].get('name'), 'Bob');

      collection.unshift(new Backbone.Model({ name: 'Zack' }));
      assert.strictEqual(co().length, 3);
      assert.strictEqual(co()[0].get('name'), 'Zack');

      co.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should handle remove', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const alice = new Backbone.Model({ name: 'Alice' });
      const bob = new Backbone.Model({ name: 'Bob' });
      const collection = new Backbone.Collection([alice, bob]);
      const co = kb.collectionObservable<Backbone.Model>(collection, { modelsOnly: true });

      assert.strictEqual(co().length, 2);

      collection.remove(alice);
      assert.strictEqual(co().length, 1);
      assert.strictEqual(co()[0].get('name'), 'Bob');

      co.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should handle reset', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const collection = new Backbone.Collection([{ name: 'Alice' }, { name: 'Bob' }]);
      const co = kb.collectionObservable<Backbone.Model>(collection, { modelsOnly: true });

      assert.strictEqual(co().length, 2);

      collection.reset([{ name: 'Charlie' }]);
      assert.strictEqual(co().length, 1);
      assert.strictEqual(co()[0].get('name'), 'Charlie');

      co.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('auto-generate collection', () => {
    it('should create collection when passed array of models', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const models = [new Backbone.Model({ name: 'Alice' }), new Backbone.Model({ name: 'Bob' })];

      const co = kb.collectionObservable<Backbone.Model>(models, { modelsOnly: true });

      assert.strictEqual(co().length, 2);
      assert.ok(co.collection() instanceof Backbone.Collection, 'Collection was created');

      co.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should create collection when passed array of plain objects', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const data = [{ name: 'Alice' }, { name: 'Bob' }];

      interface NameViewModel {
        name: ko.Observable<string>;
      }

      const co = kb.collectionObservable<NameViewModel>(data);

      assert.strictEqual(co().length, 2);
      assert.ok(co.collection() instanceof Backbone.Collection, 'Collection was created');

      co.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('shared options', () => {
    it('should share store between parent and children', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface ShareOptionsViewModel {
        shareOptions: () => { store: unknown; factory: unknown };
      }

      interface NameViewModel {
        name: ko.Observable<string>;
      }

      const parentModel = new Backbone.Model({ name: 'Parent' });
      const parentVm = kb.viewModel<ShareOptionsViewModel>(parentModel);
      const sharedOptions = parentVm.shareOptions();

      const collection = new Backbone.Collection([{ name: 'Child1' }, { name: 'Child2' }]);
      const co = kb.collectionObservable<NameViewModel>(collection, { ...sharedOptions });

      // Both should use the same store
      assert.ok(sharedOptions.store, 'Store exists');

      co.dispose();
      parentVm.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should share view models and clear share options after disposal', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface NameViewModel {
        name: ko.Observable<string>;
      }

      const collection = new Backbone.Collection([{ id: 1, name: 'Alice' }]);
      const owner = kb.collectionObservable<NameViewModel>(collection) as ShareableCollectionObservable<NameViewModel>;
      let consumer: CollectionObservable<NameViewModel> | undefined;
      let ownerDisposed = false;
      let consumerDisposed = false;
      let registeredStats = '';

      try {
        const sharedOptions = owner.shareOptions();
        consumer = kb.collectionObservable<NameViewModel>(collection, sharedOptions);

        assert.strictEqual(consumer()[0], owner()[0]);
        assert.notStrictEqual(owner.__kb, null);

        consumer.dispose();
        consumerDisposed = true;
        owner.dispose();
        ownerDisposed = true;

        const clearedOptions = owner.shareOptions();
        assert.strictEqual(clearedOptions.store, undefined);
        assert.strictEqual(clearedOptions.factory, undefined);
        assert.strictEqual(owner.__kb, null);
      } finally {
        if (!consumerDisposed) consumer?.dispose();
        if (!ownerDisposed) owner.dispose();
        registeredStats = stats.registeredStatsString('all released');
        kb.setStatistics(null);
      }

      assert.strictEqual(registeredStats, 'all released');
    });
  });

  describe('store ownership and disposal', () => {
    it('should recreate view models when an owned store auto-compacts', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface NameViewModel {
        name: ko.Observable<string>;
      }

      const model = new Backbone.Model({ id: 1, name: 'Alice' });
      const collection = new Backbone.Collection([model]);
      const co = kb.collectionObservable<NameViewModel>(collection, { autoCompact: true });
      let disposed = false;
      let registeredStats = '';

      try {
        const initialViewModel = co()[0];
        collection.reset([model]);

        assert.notStrictEqual(co()[0], initialViewModel);
        assert.strictEqual(co()[0].name(), 'Alice');

        co.dispose();
        disposed = true;

        collection.reset([model]);
        collection.add({ id: 2, name: 'Bob' });
        model.set('name', 'Alicia');
        assert.deepStrictEqual(co(), []);
      } finally {
        if (!disposed) co.dispose();
        registeredStats = stats.registeredStatsString('all released');
        kb.setStatistics(null);
      }

      assert.strictEqual(registeredStats, 'all released');
    });

    it('should not clear an externally shared store during auto-compact', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      interface NameViewModel {
        name: ko.Observable<string>;
      }

      const store = new kb.Store();
      const model = new Backbone.Model({ id: 1, name: 'Alice' });
      const resettingCollection = new Backbone.Collection([model]);
      const survivingCollection = new Backbone.Collection([model]);
      const resetting = kb.collectionObservable<NameViewModel>(resettingCollection, { autoCompact: true, store });
      const survivor = kb.collectionObservable<NameViewModel>(survivingCollection, { store });
      let resettingDisposed = false;
      let registeredStats = '';

      try {
        const sharedViewModel = survivor()[0];
        assert.strictEqual(resetting()[0], sharedViewModel);

        resettingCollection.reset([model]);
        model.set('name', 'Alicia');
        assert.strictEqual(survivor()[0], sharedViewModel);
        assert.strictEqual(sharedViewModel.name(), 'Alicia');

        resetting.dispose();
        resettingDisposed = true;

        resettingCollection.reset([model]);
        resettingCollection.add({ id: 2, name: 'Bob' });
        model.set('name', 'Ada');

        assert.deepStrictEqual(resetting(), []);
        assert.strictEqual(survivor()[0], sharedViewModel);
        assert.strictEqual(sharedViewModel.name(), 'Ada');
      } finally {
        if (!resettingDisposed) resetting.dispose();
        survivor.dispose();
        store.dispose();
        registeredStats = stats.registeredStatsString('all released');
        kb.setStatistics(null);
      }

      assert.strictEqual(registeredStats, 'all released');
    });
  });

  describe('dependency isolation', () => {
    it('should not cause dependencies when collection changes inside ko.computed', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const collection = new Backbone.Collection([{ name: 'Alice' }]);
      const co = kb.collectionObservable<{ name: ko.Observable<string> }>(collection);

      let modifyCount = 0;
      ko.computed(() => {
        collection.add({ name: 'Added' });
        modifyCount++;
      });

      let readCount = 0;
      ko.computed(() => {
        co();
        readCount++;
      });

      // The add in the first computed shouldn't cause infinite loop
      assert.ok(modifyCount >= 1, 'Modify ran');
      assert.ok(readCount >= 1, 'Read ran');

      co.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('array write validation', () => {
    function referenceCount(value: unknown): number {
      const owner = value as { __kb?: { stores_references?: Array<{ ref_count: number }> } };
      return owner.__kb?.stores_references?.reduce((total, reference) => total + reference.ref_count, 0) ?? 0;
    }

    function recordCount(store: Store): number {
      return Object.values(store.observable_records).reduce((total, records) => total + Object.keys(records).length, 0);
    }

    it('should compare deeply nested model arrays before resetting the collection', () => {
      const [firstValue, secondValue] = deeplyNestedEqualValues();
      const firstModel = new Backbone.Model({ payload: firstValue });
      const secondModel = new Backbone.Model({ payload: secondValue });
      firstModel.cid = 'deep-model';
      secondModel.cid = 'deep-model';
      const collection = new Backbone.Collection([firstModel]);
      const co = kb.collectionObservable<Backbone.Model>(collection, { modelsOnly: true });

      try {
        co([secondModel]);
        assert.strictEqual(co()[0], secondModel);
        assert.strictEqual(collection.at(0), secondModel);
      } finally {
        co.dispose();
      }
    });

    it('should reject a malformed wrapped item before retaining earlier entries', () => {
      for (const callable of [false, true]) {
        const store = new kb.Store();
        const collection = new Backbone.Collection([{ id: 'a' }, { id: 'b' }]);
        const creator = (model: Backbone.Model): object => {
          if (callable) {
            return Object.assign(function owner() {}, { id: model.id, dispose() {} });
          }
          return { id: model.id, dispose() {} };
        };
        const co = kb.collectionObservable<unknown>(collection, { store, viewModel: creator });
        const owners = co().slice();
        const beforeReferences = owners.map(referenceCount);
        let disposed = false;

        try {
          assert.throws(
            () => co([owners[0], owners[1], owners[0], 7]),
            (error: unknown) => error instanceof TypeError && error.message === 'CollectionObservable array items must be objects or functions'
          );
          assert.deepStrictEqual(co(), [owners[0], owners[1], owners[0], 7]);
          assert.deepStrictEqual(collection.pluck('id'), ['a', 'b']);
          assert.deepStrictEqual(owners.map(referenceCount), beforeReferences);

          co.dispose();
          disposed = true;
          assert.deepStrictEqual(owners.map(referenceCount), beforeReferences);
        } finally {
          if (!disposed) co.dispose();
          store.dispose();
        }
      }
    });

    it('should run every filter before retaining a writable wrapped array', () => {
      const store = new kb.Store();
      const calls: string[] = [];
      let reject = false;
      const collection = new Backbone.Collection([{ id: 'a' }, { id: 'b' }]);
      const co = kb.collectionObservable<unknown>(collection, {
        filters(model: Backbone.Model) {
          calls.push(String(model.id));
          if (reject && model.id === 'b') throw new RangeError('filter:b');
          return true;
        },
        store,
        viewModel: (model: Backbone.Model) => ({ id: model.id, dispose() {} }),
      });
      const owners = co().slice();
      const beforeReferences = owners.map(referenceCount);
      calls.length = 0;
      reject = true;

      try {
        assert.throws(() => co(owners), RangeError);
        assert.deepStrictEqual(calls, ['a', 'b']);
        assert.deepStrictEqual(co(), owners);
        assert.deepStrictEqual(collection.pluck('id'), ['a', 'b']);
        assert.deepStrictEqual(owners.map(referenceCount), beforeReferences);
      } finally {
        co.dispose();
        store.dispose();
      }
    });

    it('should preserve valid callable duplicates, shared owners, models and plain records', () => {
      const store = new kb.Store();
      const collection = new Backbone.Collection([{ id: 'shared' }]);
      const creator = (model: Backbone.Model): object => Object.assign(function owner() {}, { id: model.id, dispose() {} });
      const first = kb.collectionObservable<unknown>(collection, { store, viewModel: creator });
      const second = kb.collectionObservable<unknown>(collection, { store, viewModel: creator });
      const owner = first()[0];

      try {
        assert.strictEqual(second()[0], owner);
        first([owner, owner]);
        assert.deepStrictEqual(first(), [owner, owner]);
        assert.deepStrictEqual(second(), [owner]);
        assert.deepStrictEqual(collection.pluck('id'), ['shared']);
        assert.strictEqual(referenceCount(owner), 3);
      } finally {
        first.dispose();
        second.dispose();
        store.dispose();
      }

      const model = new Backbone.Model({ id: 'model' });
      const modelsOnlyCollection = new Backbone.Collection([model]);
      const modelsOnly = kb.collectionObservable<Backbone.Model | Record<string, unknown>>(modelsOnlyCollection, { modelsOnly: true });
      const record = { id: 'plain' };
      try {
        modelsOnly([model, record]);
        assert.strictEqual(modelsOnly()[1], record);
        assert.strictEqual(modelsOnlyCollection.at(1)?.id, 'plain');
      } finally {
        modelsOnly.dispose();
      }
    });

    for (const existingCreatorMap of [false, true]) {
      for (const missingCid of [false, true]) {
        const mapState = existingCreatorMap ? 'an existing creator map' : 'an absent creator map';
        const cidState = missingCid ? 'a missing CID' : 'a stable CID';

        it(`should reject conflicting constructors before retain with ${mapState} and ${cidState}`, () => {
          const store = new Store();
          const disposals = { seed: 0, first: 0, second: 0 };
          class SeedOwner {
            dispose(): void {
              disposals.seed++;
            }
          }
          class FirstOwner {
            dispose(): void {
              disposals.first++;
            }
          }
          class SecondOwner {
            dispose(): void {
              disposals.second++;
            }
          }
          const creator = () => new SeedOwner();
          const collection = new Backbone.Collection(existingCreatorMap ? [{ id: 'seed' }] : []);
          const seedModel = collection.at(0);
          const co = kb.collectionObservable<unknown>(collection, { store, viewModel: creator });
          const seed = co()[0];
          const model = new Backbone.Model({ id: 'incoming' });
          if (missingCid) delete (model as { cid?: string }).cid;
          const first = new FirstOwner();
          const second = new SecondOwner();
          wrappedObject(first, model);
          wrappedObject(second, model);

          try {
            assert.throws(() => co([first, second]), kb.UnexpectedValueError);
            assert.deepStrictEqual(co(), [first, second]);
            assert.deepStrictEqual(collection.pluck('id'), existingCreatorMap ? ['seed'] : []);
            assert.deepStrictEqual([referenceCount(first), referenceCount(second)], [0, 0]);
            assert.strictEqual(recordCount(store), existingCreatorMap ? 1 : 0);
            assert.strictEqual(store.find(model, creator), null);
            assert.strictEqual(store.find(seedModel, creator), existingCreatorMap ? seed : null);
            assert.strictEqual(typeof model.cid === 'string', existingCreatorMap || !missingCid);
            assert.deepStrictEqual(store.replaced_observables, []);
          } finally {
            co.dispose();
            store.dispose();
          }

          assert.deepStrictEqual(disposals, { seed: existingCreatorMap ? 1 : 0, first: 0, second: 0 });
          assert.deepStrictEqual([referenceCount(first), referenceCount(second)], [0, 0]);
          assert.strictEqual(recordCount(store), 0);
          assert.deepStrictEqual(store.replaced_observables, []);
        });

        it(`should retain identical-owner duplicates with ${mapState} and ${cidState}`, () => {
          const store = new Store();
          const disposals = { seed: 0, owner: 0 };
          class SeedOwner {
            dispose(): void {
              disposals.seed++;
            }
          }
          class Owner {
            dispose(): void {
              disposals.owner++;
            }
          }
          const creator = () => new SeedOwner();
          const collection = new Backbone.Collection(existingCreatorMap ? [{ id: 'seed' }] : []);
          const co = kb.collectionObservable<unknown>(collection, { store, viewModel: creator });
          const seed = co()[0];
          const model = new Backbone.Model({ id: 'incoming' });
          if (missingCid) delete (model as { cid?: string }).cid;
          const owner = new Owner();
          wrappedObject(owner, model);

          try {
            co([owner, owner]);
            assert.deepStrictEqual(co(), [owner, owner]);
            assert.deepStrictEqual(collection.pluck('id'), ['incoming']);
            assert.strictEqual(referenceCount(owner), 2);
            assert.strictEqual(existingCreatorMap ? referenceCount(seed) : 0, existingCreatorMap ? 1 : 0);
            assert.strictEqual(recordCount(store), existingCreatorMap ? 2 : 1);
            assert.strictEqual(store.find(model, creator), owner);
            assert.strictEqual(typeof model.cid, 'string');
            assert.deepStrictEqual(store.replaced_observables, []);
          } finally {
            co.dispose();
            store.dispose();
          }

          assert.deepStrictEqual(disposals, { seed: existingCreatorMap ? 1 : 0, owner: 1 });
          assert.strictEqual(referenceCount(owner), 0);
          assert.strictEqual(recordCount(store), 0);
          assert.deepStrictEqual(store.replaced_observables, []);
        });
      }
    }
  });
});
