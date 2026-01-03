import kb from '@mcpeasy/knockback';
import Backbone from 'backbone';
import ko from 'knockout';

/**
 * Type-level tests to ensure generic signatures work without type workarounds.
 * These tests verify that users can work with strongly-typed observables
 * without needing `as` casts, `&` intersections, or `unknown` workarounds.
 *
 * Philosophy: If the TypeScript compiler accepts these assertions without
 * type errors, our API is sufficiently generic and type-safe.
 */
describe('Type Safety', () => {
  interface PersonAttributes {
    id?: string;
    name: string;
    age: number;
    email?: string;
  }

  class PersonModel extends Backbone.Model<PersonAttributes> {}

  describe('kb.observable<T>', () => {
    it('should infer correct type from model attribute', () => {
      const model = new PersonModel({ name: 'Alice', age: 30 });

      // Type assertion: should compile without casts
      const nameObs = kb.observable<string>(model, 'name');
      const ageObs = kb.observable<number>(model, 'age');

      // These should be correctly typed
      const _nameCheck: kb.Observable<string> = nameObs;
      const _ageCheck: kb.Observable<number> = ageObs;

      // Runtime verification
      const name: string = nameObs();
      const age: number = ageObs();

      if (name !== 'Alice') throw new Error('Expected name to be Alice');
      if (age !== 30) throw new Error('Expected age to be 30');
    });

    it('should support .model() returning the correct type', () => {
      const model = new PersonModel({ name: 'Bob', age: 25 });
      const obs = kb.observable<string>(model, 'name');

      // Type assertion: model() should return PersonModel without cast
      const retrievedModel = obs.model();
      const _modelCheck: Backbone.Model | null = retrievedModel;

      // Should be able to call get without casts
      if (retrievedModel) {
        const name = retrievedModel.get('name');
        if (name !== 'Bob') throw new Error('Expected name to be Bob');
      }
    });

    it('should support optional attributes', () => {
      const model = new PersonModel({ name: 'Charlie', age: 35 });

      // Optional attribute - should work without casts
      const emailObs = kb.observable<string | undefined>(model, 'email');
      const _emailCheck: kb.Observable<string | undefined> = emailObs;

      // Type check passes - runtime value depends on Backbone defaults
      const _email: string | undefined = emailObs();

      // Set a value and verify it works
      model.set('email', 'charlie@example.com');
      if (emailObs() !== 'charlie@example.com') throw new Error('Expected email to be set');
    });
  });

  describe('kb.viewModel<T>', () => {
    it('should create strongly-typed view model', () => {
      const model = new PersonModel({ name: 'Diana', age: 28, email: 'diana@example.com' });

      type PersonViewModel = {
        name: ko.Observable<string>;
        age: ko.Observable<number>;
        email: ko.Observable<string | undefined>;
      };

      const vm = kb.viewModel<PersonViewModel>(model, {
        keys: ['name', 'age', 'email'],
      });

      // Type assertions: these should compile without casts
      const _nameCheck: ko.Observable<string> = vm.name;
      const _ageCheck: ko.Observable<number> = vm.age;
      const _emailCheck: ko.Observable<string | undefined> = vm.email;

      // Runtime verification
      if (vm.name() !== 'Diana') throw new Error('Expected name to be Diana');
      if (vm.age() !== 28) throw new Error('Expected age to be 28');
      if (vm.email() !== 'diana@example.com') throw new Error('Expected email');
    });

    it('should support .model() without type casts', () => {
      const model = new PersonModel({ name: 'Eve', age: 22 });

      type PersonViewModel = {
        name: ko.Observable<string>;
        age: ko.Observable<number>;
      };

      const vm = kb.viewModel<PersonViewModel>(model, {
        keys: ['name', 'age'],
      });

      // Type assertion: model() should return Backbone.Model without cast
      const retrievedModel = vm.model();
      const _modelCheck: Backbone.Model | null = retrievedModel;

      // Should work without casts
      if (retrievedModel) {
        const name = retrievedModel.get('name');
        if (name !== 'Eve') throw new Error('Expected name to be Eve');
      }
    });

    it('should support extend with computed properties', () => {
      const model = new PersonModel({ name: 'Frank', age: 45 });

      type PersonViewModel = {
        name: ko.Observable<string>;
        age: ko.Observable<number>;
        ageGroup: ko.Computed<'child' | 'adult' | 'senior'>;
      };

      const vm = kb.viewModel<PersonViewModel>(model, {
        keys: ['name', 'age'],
        extend: (vm) => ({
          ageGroup: ko.computed(() => {
            const age = vm.age();
            if (age < 18) return 'child';
            if (age < 65) return 'adult';
            return 'senior';
          }),
        }),
      });

      // Type assertions
      const _nameCheck: ko.Observable<string> = vm.name;
      const _ageCheck: ko.Observable<number> = vm.age;
      const _ageGroupCheck: ko.Computed<'child' | 'adult' | 'senior'> = vm.ageGroup;

      // Runtime verification
      if (vm.ageGroup() !== 'adult') throw new Error('Expected ageGroup to be adult');
    });
  });

  describe('kb.collectionObservable', () => {
    it('should create typed collection observable with view models', () => {
      class PersonCollection extends Backbone.Collection<PersonModel> {
        model = PersonModel;
      }

      // Define the view model type
      type PersonViewModel = {
        name: ko.Observable<string>;
        age: ko.Observable<number>;
      };

      const collection = new PersonCollection([new PersonModel({ name: 'Grace', age: 30 }), new PersonModel({ name: 'Hank', age: 40 })]);

      const collectionObs = kb.collectionObservable<PersonViewModel>(collection);

      // Type assertion: should be array of view models
      const _check: ko.ObservableArray<PersonViewModel> = collectionObs;

      // Runtime verification - collectionObservable returns view models
      const viewModels = collectionObs();
      if (viewModels.length !== 2) throw new Error('Expected 2 view models');
      if (viewModels[0].name() !== 'Grace') throw new Error('Expected first view model name to be Grace');
      if (viewModels[0].age() !== 30) throw new Error('Expected first view model age to be 30');
    });

    it('should support .collection() without casts', () => {
      class PersonCollection extends Backbone.Collection<PersonModel> {
        model = PersonModel;
      }

      type PersonViewModel = {
        name: ko.Observable<string>;
      };

      const collection = new PersonCollection([new PersonModel({ name: 'Ivy', age: 25 })]);
      const collectionObs = kb.collectionObservable<PersonViewModel>(collection);

      // Type assertion: collection() should return Backbone.Collection without cast
      const retrievedCollection = collectionObs.collection();
      const _collectionCheck: Backbone.Collection | null = retrievedCollection;

      // Should work without casts
      if (retrievedCollection) {
        const length = retrievedCollection.length;
        if (length !== 1) throw new Error('Expected collection length to be 1');
      }
    });
  });

  describe('Type utilities', () => {
    it('should support ko.isSubscribable for type checking', () => {
      const model = new PersonModel({ name: 'Jack', age: 50 });
      const plainObs = ko.observable('test');
      const kbObs = kb.observable<string>(model, 'name');

      // Type checks using Knockout's built-in utilities
      if (ko.isSubscribable(plainObs)) {
        const _check: ko.Subscribable<unknown> = plainObs;
      }

      if (ko.isSubscribable(kbObs)) {
        const _check: ko.Subscribable<unknown> = kbObs;
      }

      // Runtime verification
      if (!ko.isSubscribable(plainObs)) throw new Error('Expected plainObs to be subscribable');
      if (!ko.isSubscribable(kbObs)) throw new Error('Expected kbObs to be subscribable');
    });
  });

  describe('Real-world usage patterns', () => {
    it('should work in component view models without casts', () => {
      const model = new PersonModel({ name: 'Kate', age: 33 });

      interface ComponentViewModel {
        name: ko.Observable<string>;
        age: ko.Observable<number>;
        isAdult: ko.Computed<boolean>;
        displayName: ko.Computed<string>;
      }

      const vm = kb.viewModel<ComponentViewModel>(model, {
        keys: ['name', 'age'],
        extend: (vm) => ({
          isAdult: ko.computed(() => vm.age() >= 18),
          displayName: ko.computed(() => `${vm.name()} (${vm.age()} years old)`),
        }),
      });

      // Should compile without any type assertions
      const adult: boolean = vm.isAdult();
      const display: string = vm.displayName();

      // Runtime verification
      if (!adult) throw new Error('Expected isAdult to be true');
      if (display !== 'Kate (33 years old)') throw new Error('Unexpected display name');
    });

    it('should handle nullable models without casts', () => {
      const model = new PersonModel({ name: 'Leo', age: 28 });

      type ViewModel = {
        name: ko.Observable<string>;
        age: ko.Observable<number>;
      };

      const vm = kb.viewModel<ViewModel>(model, {
        keys: ['name', 'age'],
      });

      // Simulate setting model to null
      vm.model(null);

      // Should still be able to access observables
      const name = vm.name();
      const age = vm.age();

      // Values should be cleared or default
      const _nameCheck: string = name;
      const _ageCheck: number = age;
    });
  });
});
