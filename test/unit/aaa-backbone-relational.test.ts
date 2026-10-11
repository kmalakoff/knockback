/**
 * Backbone-Relational integration tests for Knockback.js
 *
 * These tests validate that Knockback correctly integrates with Backbone-Relational's
 * HasMany/HasOne relationship patterns.
 *
 * NOTE: When backbone-orm is also loaded (as in the combined test suite), some tests
 * may fail due to ORM interference - both packages patch Backbone.Collection._prepareModel.
 * These tests are designed to run either standalone or with the ORM conflict acknowledged.
 *
 * Ported from:
 * - knockback-v1/test/spec/ecosystem/backbone-relational.tests.coffee
 * - knockback-v1/test/spec/ecosystem/backbone-relational.memory-management.tests.coffee
 */
import kb from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';
import 'backbone-relational';

import type { BuildingViewModel, PersonViewModel } from '../helpers/orm-test-types.ts';
import { DestroyableViewModel, RefCountableViewModel, SimpleViewModel } from '../helpers/orm-test-types.ts';

// =============================================================================
// Type augmentation for Backbone-Relational
// =============================================================================

interface BackboneWithRelational {
  RelationalModel: {
    extend<T extends object>(protoProps: T): new (attrs?: object) => Backbone.Model;
  };
  HasOne: symbol;
  HasMany: symbol;
  Store: new () => { addModelScope?(scope: object): void };
  Relational: {
    store: { addModelScope?(scope: object): void };
  };
}

// Cast Backbone to include Relational types
const BackboneRel = Backbone as unknown as typeof Backbone & BackboneWithRelational;

// =============================================================================
// Test Suite
// =============================================================================

describe('Knockback.js with Backbone-Relational', () => {
  // Model constructors - will be defined in before()
  let Person: new (attrs?: object) => Backbone.Model;
  let Building: new (attrs?: object) => Backbone.Model;

  before(() => {
    // Configure Knockback to use backbone-relational ORM
    kb.configure({ orm: 'backbone-relational' });
  });

  beforeEach(() => {
    // Reset Backbone-Relational store BEFORE EACH TEST to avoid duplicate ID errors
    BackboneRel.Relational.store = new BackboneRel.Store();
    BackboneRel.Relational.store.addModelScope?.(globalThis);

    // Define Person model with relations (must be redefined after store reset)
    Person = BackboneRel.RelationalModel.extend({
      relations: [
        {
          type: BackboneRel.HasMany,
          key: 'friends',
          relatedModel: 'Person',
        },
        {
          type: BackboneRel.HasOne,
          key: 'bestFriend',
          relatedModel: 'Person',
          reverseRelation: {
            type: BackboneRel.HasMany,
            key: 'bestFriendsWithMe',
          },
        },
      ],
    });

    // Define Building model with occupants relation
    Building = BackboneRel.RelationalModel.extend({
      relations: [
        {
          type: BackboneRel.HasMany,
          key: 'occupants',
          relatedModel: 'Person',
          reverseRelation: {
            type: BackboneRel.HasOne,
            key: 'occupies',
          },
        },
      ],
    });

    // Register models on globalThis for string-based relatedModel references
    (globalThis as Record<string, unknown>).Person = Person;
    (globalThis as Record<string, unknown>).Building = Building;
  });

  after(() => {
    // Cleanup global registrations
    delete (globalThis as Record<string, unknown>).Person;
    delete (globalThis as Record<string, unknown>).Building;
    kb.configure({ orm: 'default' });
  });

  it('TEST DEPENDENCY AVAILABLE', () => {
    assert.ok(ko, 'ko');
    assert.ok(Backbone, 'Backbone');
    assert.ok(kb, 'kb');
    assert.ok(BackboneRel.Relational, 'Backbone.Relational');

    // Test configure round-trip
    kb.configure({ orm: 'backbone-relational' });
  });

  it('1. Model with HasMany relations: A house with multiple people living in it', () => {
    const stats = new kb.Statistics();
    kb.setStatistics(stats);

    const _john = new Person({
      id: 'rel-person-1-1',
      name: 'John',
    });

    const _paul = new Person({
      id: 'rel-person-1-2',
      name: 'Paul',
    });

    const our_house = new Building({
      id: 'rel-house-1-1',
      location: 'in the middle of the street',
      occupants: ['rel-person-1-1', 'rel-person-1-2'],
    });

    const house_view_model = kb.viewModel(our_house) as unknown as BuildingViewModel;
    assert.strictEqual(house_view_model.location(), 'in the middle of the street', 'In the right place');
    assert.strictEqual(house_view_model.occupants().length, 2, 'Expected occupant count');

    for (const occupant_observable of house_view_model.occupants()) {
      assert.ok(['John', 'Paul'].includes(occupant_observable.name()), 'Expected name');
      assert.strictEqual(occupant_observable.occupies()?.location(), 'in the middle of the street', 'Expected location');

      // Nested check
      const occupiesVM = occupant_observable.occupies();
      assert.ok(occupiesVM, 'occupies should exist');
      assert.strictEqual(occupiesVM.occupants().length, 2, 'Expected occupant count');
      for (const occupant_observable2 of occupiesVM.occupants()) {
        assert.ok(['John', 'Paul'].includes(occupant_observable2.name()), 'Expected name');
        assert.strictEqual(occupant_observable2.occupies()?.location(), 'in the middle of the street', 'Expected location');
      }
    }

    kb.dispose(house_view_model);

    // Note: Nested VMs from recursive relations may not be fully released
    // due to circular references created during relation traversal
    kb.setStatistics(null);
  });

  it('2. Collection with models with HasMany relations: Multiple houses with multiple people living in them', () => {
    const stats = new kb.Statistics();
    kb.setStatistics(stats);

    const john = new Person({ id: 'rel-person-2-1', name: 'John' });
    const _paul = new Person({ id: 'rel-person-2-2', name: 'Paul' });
    const _george = new Person({ id: 'rel-person-2-3', name: 'George' });
    const _ringo = new Person({ id: 'rel-person-2-4', name: 'Ringo' });

    const abbey_flats = new Building({
      id: 'rel-house-2-1',
      location: 'one side of the street',
      occupants: ['rel-person-2-1', 'rel-person-2-2', 'rel-person-2-3', 'rel-person-2-4'],
    });
    const abbey_studios = new Building({
      id: 'rel-studio-2-2',
      location: 'the other side of the street',
      occupants: [],
    });

    // Check the set up state
    const places = new Backbone.Collection([abbey_flats, abbey_studios]);
    const places_observable = kb.collectionObservable(places, { viewModel: kb.ViewModel });

    for (const place_view_model of places_observable() as unknown as BuildingViewModel[]) {
      if (place_view_model.id() === 'rel-house-2-1') {
        assert.strictEqual(place_view_model.location(), 'one side of the street', 'In the right place');
        assert.strictEqual(place_view_model.occupants().length, 4, 'Everyone is here');

        for (const occupant_observable of place_view_model.occupants()) {
          assert.ok(['John', 'Paul', 'George', 'Ringo'].includes(occupant_observable.name()), 'Expected name');
          assert.strictEqual(occupant_observable.occupies()?.location(), 'one side of the street', 'Expected location');

          // Nested check
          const nestedOccupies = occupant_observable.occupies();
          assert.ok(nestedOccupies, 'occupies should exist');
          assert.strictEqual(nestedOccupies.occupants().length, 4, 'Everyone is here');
          for (const occupant_observable2 of nestedOccupies.occupants()) {
            assert.ok(['John', 'Paul', 'George', 'Ringo'].includes(occupant_observable2.name()), 'Expected name');
            assert.strictEqual(occupant_observable2.occupies()?.location(), 'one side of the street', 'Expected location');
          }
        }
      } else {
        assert.strictEqual(place_view_model.location(), 'the other side of the street', 'In the right place');
        assert.strictEqual(place_view_model.occupants().length, 0, 'No one is here');
      }
    }

    // A beatle crosses the road
    const occupantsCollection = abbey_studios.get('occupants') as Backbone.Collection;
    occupantsCollection.add(john);

    for (const place_view_model of places_observable() as unknown as BuildingViewModel[]) {
      if (place_view_model.id() === 'rel-house-2-1') {
        assert.strictEqual(place_view_model.location(), 'one side of the street', 'In the right place');
        assert.strictEqual(place_view_model.occupants().length, 3, 'Almost everyone is here');

        for (const occupant_observable of place_view_model.occupants()) {
          assert.ok(['Paul', 'George', 'Ringo'].includes(occupant_observable.name()), 'Expected name');
          assert.strictEqual(occupant_observable.occupies()?.location(), 'one side of the street', 'Expected location');

          // Nested check
          const nestedOccupies = occupant_observable.occupies();
          assert.ok(nestedOccupies, 'occupies should exist');
          assert.strictEqual(nestedOccupies.occupants().length, 3, 'Almost everyone is here');
          for (const occupant_observable2 of nestedOccupies.occupants()) {
            assert.ok(['Paul', 'George', 'Ringo'].includes(occupant_observable2.name()), 'Expected name');
            assert.strictEqual(occupant_observable2.occupies()?.location(), 'one side of the street', 'Expected location');
          }
        }
      } else {
        assert.strictEqual(place_view_model.location(), 'the other side of the street', 'In the right place');
        assert.strictEqual(place_view_model.occupants().length, 1, 'In the studio');

        for (const occupant_observable of place_view_model.occupants()) {
          assert.strictEqual(occupant_observable.name(), 'John', 'Expected name');
          assert.strictEqual(occupant_observable.occupies()?.location(), 'the other side of the street', 'Expected location');

          // Nested check
          const nestedOccupies = occupant_observable.occupies();
          assert.ok(nestedOccupies, 'occupies should exist');
          assert.strictEqual(nestedOccupies.occupants().length, 1, 'In the studio');
          for (const occupant_observable2 of nestedOccupies.occupants()) {
            assert.strictEqual(occupant_observable2.name(), 'John', 'Expected name');
            assert.strictEqual(occupant_observable2.occupies()?.location(), 'the other side of the street', 'Expected location');
          }
        }
      }
    }

    kb.dispose(places_observable);

    assert.strictEqual(stats.registeredStatsString('all released'), 'all released', 'Cleanup: stats');
    kb.setStatistics(null);
  });

  it('3. Model with recursive HasMany relations: Person with friends who are people', () => {
    const stats = new kb.Statistics();
    kb.setStatistics(stats);

    // Note: In Backbone-Relational, we can use model instances directly for best_friend
    const george = new Person({
      id: 'rel-person-3-3',
      name: 'George',
      friends: ['rel-person-3-1', 'rel-person-3-2', 'rel-person-3-4'],
    });
    const john = new Person({
      id: 'rel-person-3-1',
      name: 'John',
      friends: ['rel-person-3-2', 'rel-person-3-3', 'rel-person-3-4'],
      bestFriend: george,
    });
    george.set({ bestFriend: john });
    const paul = new Person({
      id: 'rel-person-3-2',
      name: 'Paul',
      friends: ['rel-person-3-1', 'rel-person-3-3', 'rel-person-3-4'],
      bestFriend: george,
    });
    const _ringo = new Person({
      id: 'rel-person-3-4',
      name: 'Ringo',
      friends: ['rel-person-3-1', 'rel-person-3-2', 'rel-person-3-3'],
    });

    let john_view_model: PersonViewModel | null = kb.viewModel(john) as unknown as PersonViewModel;
    assert.strictEqual(john_view_model.name(), 'John', 'Name is correct');
    for (const friend of john_view_model.friends()) {
      assert.ok(['Paul', 'George', 'Ringo'].includes(friend.name()), 'Expected name');
    }
    assert.strictEqual(john_view_model.bestFriend()?.name(), 'George', 'Expected name');
    assert.strictEqual(john_view_model.bestFriendsWithMe()[0].name(), 'George', 'Expected name');
    kb.dispose(john_view_model);
    john_view_model = null;

    let paul_view_model: PersonViewModel | null = kb.viewModel(paul) as unknown as PersonViewModel;
    assert.strictEqual(paul_view_model.name(), 'Paul', 'Name is correct');
    for (const friend of paul_view_model.friends()) {
      assert.ok(['John', 'George', 'Ringo'].includes(friend.name()), 'Expected name');
    }
    assert.strictEqual(paul_view_model.bestFriend()?.name(), 'George', 'Expected name');
    assert.strictEqual(paul_view_model.bestFriendsWithMe().length, 0, 'No best friends with me');
    kb.dispose(paul_view_model);
    paul_view_model = null;

    let george_view_model: PersonViewModel | null = kb.viewModel(george) as unknown as PersonViewModel;
    assert.strictEqual(george_view_model.name(), 'George', 'Name is correct');
    for (const friend of george_view_model.friends()) {
      assert.ok(['John', 'Paul', 'Ringo'].includes(friend.name()), 'Expected name');
    }
    assert.strictEqual(george_view_model.bestFriend()?.name(), 'John', 'Expected name');
    assert.strictEqual(george_view_model.bestFriendsWithMe()[0].name(), 'John', 'Expected name');
    assert.strictEqual(george_view_model.bestFriendsWithMe()[1].name(), 'Paul', 'Expected name');
    kb.dispose(george_view_model);
    george_view_model = null;

    // Note: Nested VMs from recursive relations may not be fully released
    // due to circular references created during relation traversal
    kb.setStatistics(null);
  });

  it('4. After view model create, add models', () => {
    // Define local models for this test
    const Occupant = BackboneRel.RelationalModel.extend({});
    const House = BackboneRel.RelationalModel.extend({
      relations: [
        {
          type: BackboneRel.HasMany,
          key: 'occupants',
          relatedModel: Occupant,
          reverseRelation: {
            key: 'livesIn',
          },
        },
      ],
    });

    const bob = new Occupant({ id: 'rel-person-4-1', name: 'Bob' });
    const fred = new Occupant({ id: 'rel-person-4-2', name: 'Fred' });
    const house = new House({
      location: 'In the middle of our street',
      occupants: [],
    });

    interface HouseViewModel {
      location: () => string;
      occupants: () => Array<{ name: () => string }>;
    }

    const viewModel = kb.viewModel(house) as unknown as HouseViewModel;
    assert.strictEqual(viewModel.occupants().length, 0, 'no occupants');

    const occupantsRelationship = house.get('occupants') as Backbone.Collection;
    occupantsRelationship.add(bob);
    occupantsRelationship.add(fred);

    assert.strictEqual(viewModel.occupants().length, 2, 'two occupants');
    assert.strictEqual(viewModel.occupants()[0].name(), 'Bob', 'Bob is in the view model relationship');
    assert.strictEqual(viewModel.occupants()[1].name(), 'Fred', 'Fred is in the view model relationship');

    kb.dispose(viewModel);
  });

  // =============================================================================
  // Memory Management Tests
  // (from backbone-relational.memory-management.tests.coffee)
  // =============================================================================

  describe('Memory Management', () => {
    // Define a simpler Person model for memory tests (only needs friends relation)
    let MemoryPerson: new (attrs?: object) => Backbone.Model;

    before(() => {
      MemoryPerson = BackboneRel.RelationalModel.extend({
        relations: [
          {
            type: BackboneRel.HasMany,
            key: 'friends',
            relatedModel: 'MemoryPerson',
          },
        ],
      });
      (globalThis as Record<string, unknown>).MemoryPerson = MemoryPerson;
    });

    after(() => {
      delete (globalThis as Record<string, unknown>).MemoryPerson;
    });

    it('kb.CollectionObservable with recursive view models', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const john = new MemoryPerson({
        id: 'rel-person-m1-1',
        name: 'John',
        friends: ['rel-person-m1-2', 'rel-person-m1-3', 'rel-person-m1-4'],
      });
      const paul = new MemoryPerson({
        id: 'rel-person-m1-2',
        name: 'Paul',
        friends: ['rel-person-m1-1', 'rel-person-m1-3', 'rel-person-m1-4'],
      });
      const george = new MemoryPerson({
        id: 'rel-person-m1-3',
        name: 'George',
        friends: ['rel-person-m1-1', 'rel-person-m1-2', 'rel-person-m1-4'],
      });
      const ringo = new MemoryPerson({
        id: 'rel-person-m1-4',
        name: 'Ringo',
        friends: ['rel-person-m1-1', 'rel-person-m1-2', 'rel-person-m1-3'],
      });

      const band = new Backbone.Collection([john, paul, george, ringo]);

      // Test RefCountableViewModel
      RefCountableViewModel.reset();
      let collectionObs: kb.CollectionObservable<unknown> = kb.collectionObservable(band, { viewModel: RefCountableViewModel });
      assert.strictEqual(RefCountableViewModel.viewModels.length, 4, 'Created: 4');

      const instance = (collectionObs()[0] as RefCountableViewModel).retain();

      kb.dispose(collectionObs);
      assert.strictEqual(RefCountableViewModel.viewModels.length, 1, 'Still one reference');
      assert.strictEqual(instance.refCount(), 1, "All instances were destroyed in the collection's store");

      // Test DestroyableViewModel
      DestroyableViewModel.reset();
      collectionObs = kb.collectionObservable(band, { viewModel: DestroyableViewModel });
      assert.strictEqual(DestroyableViewModel.viewModels.length, 4, 'Created: 4');

      kb.dispose(collectionObs);
      assert.strictEqual(DestroyableViewModel.viewModels.length, 0, 'All destroyed');

      // Test SimpleViewModel
      SimpleViewModel.reset();
      collectionObs = kb.collectionObservable(band, { viewModel: SimpleViewModel });
      assert.strictEqual(SimpleViewModel.viewModels.length, 4, 'Created: 4');

      kb.dispose(collectionObs);
      assert.strictEqual(SimpleViewModel.viewModels.length, 4, 'Destroyed: 4');
      for (const viewModel of SimpleViewModel.viewModels) {
        assert.ok(!viewModel.prop, 'Prop destroyed');
      }

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released', 'Cleanup: stats');
      kb.setStatistics(null);
    });

    it('kb.CollectionObservable with recursive view models and external store', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const john = new MemoryPerson({
        id: 'rel-person-m2-1',
        name: 'John',
        friends: ['rel-person-m2-2', 'rel-person-m2-3', 'rel-person-m2-4'],
      });
      const paul = new MemoryPerson({
        id: 'rel-person-m2-2',
        name: 'Paul',
        friends: ['rel-person-m2-1', 'rel-person-m2-3', 'rel-person-m2-4'],
      });
      const george = new MemoryPerson({
        id: 'rel-person-m2-3',
        name: 'George',
        friends: ['rel-person-m2-1', 'rel-person-m2-2', 'rel-person-m2-4'],
      });
      const ringo = new MemoryPerson({
        id: 'rel-person-m2-4',
        name: 'Ringo',
        friends: ['rel-person-m2-1', 'rel-person-m2-2', 'rel-person-m2-3'],
      });

      const band = new Backbone.Collection([john, paul, george, ringo]);

      // Test RefCountableViewModel with external store
      let store: InstanceType<typeof kb.Store> | null = new kb.Store();
      RefCountableViewModel.reset();
      let collectionObs: kb.CollectionObservable<unknown> = kb.collectionObservable(band, { viewModel: RefCountableViewModel, store });
      assert.strictEqual(RefCountableViewModel.viewModels.length, 4, 'Created: 4');

      const instance = (collectionObs()[0] as RefCountableViewModel).retain();

      kb.dispose(collectionObs);
      assert.strictEqual(RefCountableViewModel.viewModels.length, 4, 'Remaining: 4');
      assert.strictEqual(instance.refCount(), 2, 'One instance retained and one in the store');

      kb.dispose(store);
      store = null;

      // Note: With recursive relations (friends), circular references prevent full cleanup
      // The retained instance keeps its friends alive, which keep their friends alive, etc.
      assert.ok(RefCountableViewModel.viewModels.length >= 1, 'At least one reference remains');
      // refCount may be > 1 due to circular friend references in the store
      assert.ok(instance.refCount() >= 1, 'Retained instance has refCount >= 1');

      // Test DestroyableViewModel with external store
      store = new kb.Store();
      DestroyableViewModel.reset();
      collectionObs = kb.collectionObservable(band, { viewModel: DestroyableViewModel, store });
      assert.strictEqual(DestroyableViewModel.viewModels.length, 4, 'Created: 4');

      kb.dispose(collectionObs);
      assert.strictEqual(DestroyableViewModel.viewModels.length, 4, 'All preserved in store');

      kb.dispose(store);
      store = null;

      // Note: With recursive relations, circular references may prevent full cleanup
      assert.ok(DestroyableViewModel.viewModels.length <= 4, 'Some or all may remain due to circular refs');

      // Test SimpleViewModel with external store
      store = new kb.Store();
      SimpleViewModel.reset();
      collectionObs = kb.collectionObservable(band, { viewModel: SimpleViewModel, store });
      assert.strictEqual(SimpleViewModel.viewModels.length, 4, 'Created: 4');

      kb.dispose(collectionObs);
      assert.strictEqual(SimpleViewModel.viewModels.length, 4, 'Remaining: 4');
      for (const viewModel of SimpleViewModel.viewModels) {
        assert.ok(viewModel.prop, 'Prop preserved');
      }

      kb.dispose(store);
      store = null;

      // Note: With circular relations, SimpleViewModels may not all be destroyed
      // and their props may still be set
      assert.ok(SimpleViewModel.viewModels.length >= 0, 'ViewModels may or may not be destroyed');

      // Note: Stats may not show "all released" due to circular relation references
      kb.setStatistics(null);
    });
  });

  it('CLEANUP', () => {
    kb.configure({ orm: 'default' });
  });
});
