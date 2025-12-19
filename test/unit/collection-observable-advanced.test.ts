import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';
import kb, { collectionObservable, viewModel, ViewModel, Statistics } from 'knockback';

describe('CollectionObservable advanced', () => {
  describe('sorting', () => {
    it('should sort by sort_attribute', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const collection = new Backbone.Collection([
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 },
      ]);

      const co = collectionObservable(collection, { sort_attribute: 'name' });
      const names = co().map((vm: ViewModel & { name: ko.Observable<string> }) => vm.name());

      assert.deepStrictEqual(names, ['Alice', 'Bob', 'Charlie'], 'Sorted by name');

      kb.release(co);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });

    it('should sort with custom comparator', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const collection = new Backbone.Collection([
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 },
      ]);

      // Comparator receives view models, not raw models
      const co = collectionObservable(collection, {
        comparator: (a: ViewModel & { age: ko.Observable<number> }, b: ViewModel & { age: ko.Observable<number> }) => {
          return b.age() - a.age(); // Descending by age
        },
      });

      const ages = co().map((vm: ViewModel & { age: ko.Observable<number> }) => vm.age());
      assert.deepStrictEqual(ages, [35, 30, 25], 'Sorted by age descending');

      kb.release(co);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });

    it('should re-sort when sort attribute changes', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const collection = new Backbone.Collection([
        { name: 'Charlie', priority: 2 },
        { name: 'Alice', priority: 1 },
        { name: 'Bob', priority: 3 },
      ]);

      const co = collectionObservable(collection, { sort_attribute: 'priority' });

      let names = co().map((vm: ViewModel & { name: ko.Observable<string> }) => vm.name());
      assert.deepStrictEqual(names, ['Alice', 'Charlie', 'Bob'], 'Initial sort');

      // Change priority
      collection.at(0)!.set('priority', 5);

      names = co().map((vm: ViewModel & { name: ko.Observable<string> }) => vm.name());
      assert.deepStrictEqual(names, ['Alice', 'Bob', 'Charlie'], 'Re-sorted after change');

      kb.release(co);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });
  });

  describe('filters', () => {
    it('should filter with filters option', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const collection = new Backbone.Collection([
        { name: 'Alice', active: true },
        { name: 'Bob', active: false },
        { name: 'Charlie', active: true },
      ]);

      const co = collectionObservable(collection, {
        filters: (model: Backbone.Model) => model.get('active') === true,
      });

      assert.strictEqual(co().length, 2, 'Only active items');
      const names = co().map((vm: ViewModel & { name: ko.Observable<string> }) => vm.name());
      assert.deepStrictEqual(names, ['Alice', 'Charlie']);

      kb.release(co);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });

    it('should update when filtered attribute changes', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const collection = new Backbone.Collection([
        { name: 'Alice', active: true },
        { name: 'Bob', active: false },
      ]);

      const co = collectionObservable(collection, {
        filters: (model: Backbone.Model) => model.get('active') === true,
      });

      assert.strictEqual(co().length, 1);

      // Activate Bob
      collection.at(1)!.set('active', true);
      assert.strictEqual(co().length, 2);

      // Deactivate Alice
      collection.at(0)!.set('active', false);
      assert.strictEqual(co().length, 1);
      assert.strictEqual((co()[0] as ViewModel & { name: ko.Observable<string> }).name(), 'Bob');

      kb.release(co);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });
  });

  describe('collection observable', () => {
    it('should expose collection via .collection()', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const collection = new Backbone.Collection([{ name: 'Alice' }]);
      const co = collectionObservable(collection) as ko.ObservableArray & {
        collection: ko.Observable<Backbone.Collection>;
      };

      assert.ok(ko.isObservable(co.collection), 'collection is observable');
      assert.strictEqual(co.collection(), collection);

      kb.release(co);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });

    it('should trigger updates when collection is swapped', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const collection1 = new Backbone.Collection([{ name: 'Alice' }]);
      const collection2 = new Backbone.Collection([{ name: 'Bob' }, { name: 'Charlie' }]);

      const co = collectionObservable(collection1) as ko.ObservableArray & {
        collection: (c?: Backbone.Collection) => Backbone.Collection;
      };

      let changeCount = 0;
      ko.computed(() => {
        co();
        changeCount++;
      });

      assert.strictEqual(changeCount, 1);
      assert.strictEqual(co().length, 1);

      co.collection(collection2);
      assert.strictEqual(co().length, 2);

      kb.release(co);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });
  });

  describe('array mutations', () => {
    it('should support push and unshift', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const collection = new Backbone.Collection([{ name: 'Alice' }]);
      const co = collectionObservable(collection, { models_only: true });

      assert.strictEqual(co().length, 1);

      collection.push(new Backbone.Model({ name: 'Bob' }));
      assert.strictEqual(co().length, 2);
      assert.strictEqual(co()[1].get('name'), 'Bob');

      collection.unshift(new Backbone.Model({ name: 'Zack' }));
      assert.strictEqual(co().length, 3);
      assert.strictEqual(co()[0].get('name'), 'Zack');

      kb.release(co);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });

    it('should handle remove', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const alice = new Backbone.Model({ name: 'Alice' });
      const bob = new Backbone.Model({ name: 'Bob' });
      const collection = new Backbone.Collection([alice, bob]);
      const co = collectionObservable(collection, { models_only: true });

      assert.strictEqual(co().length, 2);

      collection.remove(alice);
      assert.strictEqual(co().length, 1);
      assert.strictEqual(co()[0].get('name'), 'Bob');

      kb.release(co);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });

    it('should handle reset', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const collection = new Backbone.Collection([{ name: 'Alice' }, { name: 'Bob' }]);
      const co = collectionObservable(collection, { models_only: true });

      assert.strictEqual(co().length, 2);

      collection.reset([{ name: 'Charlie' }]);
      assert.strictEqual(co().length, 1);
      assert.strictEqual(co()[0].get('name'), 'Charlie');

      kb.release(co);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });
  });

  describe('auto-generate collection', () => {
    it('should create collection when passed array of models', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const models = [new Backbone.Model({ name: 'Alice' }), new Backbone.Model({ name: 'Bob' })];

      const co = collectionObservable(models as unknown as Backbone.Collection, { models_only: true }) as ko.ObservableArray & {
        collection: () => Backbone.Collection;
      };

      assert.strictEqual(co().length, 2);
      assert.ok(co.collection() instanceof Backbone.Collection, 'Collection was created');

      kb.release(co);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });

    it('should create collection when passed array of plain objects', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const data = [{ name: 'Alice' }, { name: 'Bob' }];

      const co = collectionObservable(data as unknown as Backbone.Collection) as ko.ObservableArray & {
        collection: () => Backbone.Collection;
      };

      assert.strictEqual(co().length, 2);
      assert.ok(co.collection() instanceof Backbone.Collection, 'Collection was created');

      kb.release(co);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });
  });

  describe('shared options', () => {
    it('should share store between parent and children', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const parentModel = new Backbone.Model({ name: 'Parent' });
      const parentVm = viewModel(parentModel) as ViewModel;
      const sharedOptions = parentVm.shareOptions();

      const collection = new Backbone.Collection([{ name: 'Child1' }, { name: 'Child2' }]);
      const co = collectionObservable(collection, { ...sharedOptions });

      // Both should use the same store
      assert.ok(sharedOptions.store, 'Store exists');

      kb.release(co);
      kb.release(parentVm);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });
  });

  describe('dependency isolation', () => {
    it('should not cause dependencies when collection changes inside ko.computed', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const collection = new Backbone.Collection([{ name: 'Alice' }]);
      const co = collectionObservable(collection);

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

      kb.release(co);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });
  });
});
