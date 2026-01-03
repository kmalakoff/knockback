import kb from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';

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
});
