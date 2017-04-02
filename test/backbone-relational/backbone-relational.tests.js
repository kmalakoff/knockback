const r = typeof require !== 'undefined';
const root = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : this;
const assert = root.assert || (r ? require('chai').assert : undefined);

const kb = root.kb || (r ? require('@knockback/core') : undefined);
const _ = root._ || (r ? require('underscore') : undefined);
const Backbone = root.Backbone || (r ? require('backbone') : undefined);
const ko = root.ko || (r ? require('knockout') : undefined);

if (Backbone && !Backbone.Relational && r) require('backbone-relational');
const kbr = root.kbr || (r ? require('@knockback/backbone-relational') : undefined);

describe('Knockback.js with Backbone-Relational.js', () => {
  beforeEach(() => {
    kb.configure({ orm: kbr });

    Backbone.Relational.store = new Backbone.Store();
    if (typeof Backbone.Relational.store.addModelScope === 'function') Backbone.Relational.store.addModelScope(root);

    root.Person = Backbone.RelationalModel.extend({
      relations: [{
        type: Backbone.HasMany,
        key: 'friends',
        relatedModel: 'Person',
      }, {
        type: Backbone.HasOne,
        key: 'best_friend',
        relatedModel: 'Person',
        reverseRelation: {
          type: Backbone.HasMany,
          key: 'best_friends_with_me',
        },
      }],
    });

    root.Building = Backbone.RelationalModel.extend({
      relations: [{
        type: Backbone.HasMany,
        key: 'occupants',
        relatedModel: 'Person',
        reverseRelation: {
          type: Backbone.HasOne,
          key: 'occupies',
        },
      }],
    });

    root.Occupant = Backbone.RelationalModel.extend({});

    root.House = Backbone.RelationalModel.extend({
      relations: [{
        type: Backbone.HasMany,
        key: 'occupants',
        relatedModel: 'Occupant',
        reverseRelation: {
          key: 'livesIn',
        },
      }],
    });
  });
  afterEach(() => {
    kb.configure({ orm: null });
    delete root.Person;
    delete root.Building;
    delete root.Occupant;
    delete root.House;
  });

  it('TEST DEPENDENCY MISSING', () => {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!Backbone, 'Backbone');
    assert.ok(!!kb, 'kb');
    assert.ok(!!Backbone.Relational, 'Backbone.Relational');
    assert.ok(!!kbr, 'kbr');
  });

  it('1. Model with HasMany relations: A house with multiple people living in it', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const john = new Person({
      id: 'person-1-1',
      name: 'John',
    });

    const paul = new Person({
      id: 'person-1-2',
      name: 'Paul',
    });

    const our_house = new Building({
      id: 'house-1-1',
      location: 'in the middle of the street',
      occupants: ['person-1-1', 'person-1-2'],
    });

    const model_stats = {};
    model_stats.john = { model: john, event_stats: kb.Statistics.eventsStats(john) };
    model_stats.paul = { model: paul, event_stats: kb.Statistics.eventsStats(paul) };
    model_stats.our_house = { model: our_house, event_stats: kb.Statistics.eventsStats(our_house) };

    const house_view_model = new kb.ViewModel(our_house);
    assert.equal(house_view_model.location(), 'in the middle of the street', 'In the right place');
    assert.equal(house_view_model.occupants().length, 2, 'Expected occupant count');
    _.each(house_view_model.occupants(), (occupant_observable) => {
      assert.ok(~_.indexOf(['John', 'Paul'], occupant_observable.name()), 'Expected name');
      assert.equal(occupant_observable.occupies().location(), 'in the middle of the street', 'Expected location');

      // nested check
      assert.equal(occupant_observable.occupies().occupants().length, 2, 'Excepted occupant count');
      _.each(occupant_observable.occupies().occupants(), (x) => {
        assert.ok(~_.indexOf(['John', 'Paul'], x.name()), 'Expected name');
        assert.equal(x.occupies().location(), 'in the middle of the street', 'Expected location');
      });
    });

    kb.release(house_view_model);

    _.each(model_stats, (stats) => {
      const statsCount = kb.Statistics.eventsStats(stats.model).count === stats.event_stats.count;
      assert.ok(statsCount, `All model events cleared to initial state. Expected: ${JSON.stringify(stats.event_stats)}. Actual: ${JSON.stringify(kb.Statistics.eventsStats(stats.model))}`);
    });
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('2. Collection with models with HasMany relations: Multiple houses with multiple people living in them', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const john = new Person({
      id: 'person-2-1',
      name: 'John',
    });

    new Person({
      id: 'person-2-2',
      name: 'Paul',
    });

    new Person({
      id: 'person-2-3',
      name: 'George',
    });

    new Person({
      id: 'person-2-4',
      name: 'Ringo',
    });

    const abbey_flats = new Building({
      id: 'house-2-1',
      location: 'one side of the street',
      occupants: ['person-2-1', 'person-2-2', 'person-2-3', 'person-2-4'],
    });
    const abbey_studios = new Building({
      id: 'studio-2-2',
      location: 'the other side of the street',
      occupants: [],
    });

    // check the set up state
    const places = new Backbone.Collection([abbey_flats, abbey_studios]);
    const places_observable = kb.collectionObservable(places, { view_model: kb.ViewModel });
    _.each(places_observable(), (place_view_model) => {
      if (place_view_model.id() === 'house-2-1') {
        assert.equal(place_view_model.location(), 'one side of the street', 'In the right place');
        assert.equal(place_view_model.occupants().length, 4, 'Everyone is here');
        _.each(place_view_model.occupants(), (occupant_observable) => {
          assert.ok(~_.indexOf(['John', 'Paul', 'George', 'Ringo'], occupant_observable.name()), 'Expected name');
          assert.equal(occupant_observable.occupies().location(), 'one side of the street', 'Expected location');

          // nested check
          assert.equal(occupant_observable.occupies().occupants().length, 4, 'Everyone is here');
          _.each(occupant_observable.occupies().occupants(), (x) => {
            assert.ok(~_.indexOf(['John', 'Paul', 'George', 'Ringo'], x.name()), 'Expected name');
            assert.equal(x.occupies().location(), 'one side of the street', 'Expected location');
          });
        });
      } else {
        assert.equal(place_view_model.location(), 'the other side of the street', 'In the right place');
        assert.equal(place_view_model.occupants().length, 0, 'No one is here');
      }
    });

    // a beattle crosses the road
    abbey_studios.get('occupants').add(john);

    _.each(places_observable(), (place_view_model) => {
      if (place_view_model.id() === 'house-2-1') {
        assert.equal(place_view_model.location(), 'one side of the street', 'In the right place');
        assert.equal(place_view_model.occupants().length, 3, 'Almost everyone is here');
        _.each(place_view_model.occupants(), (occupant_observable) => {
          assert.ok(~_.indexOf(['Paul', 'George', 'Ringo'], occupant_observable.name()), 'Expected name');
          assert.equal(occupant_observable.occupies().location(), 'one side of the street', 'Expected location');

          // nested check
          assert.equal(occupant_observable.occupies().occupants().length, 3, 'Almost everyone is here');
          _.each(occupant_observable.occupies().occupants(), (x) => {
            assert.ok(~_.indexOf(['Paul', 'George', 'Ringo'], x.name()), 'Expected name');
            assert.equal(x.occupies().location(), 'one side of the street', 'Expected location');
          });
        });
      } else {
        assert.equal(place_view_model.location(), 'the other side of the street', 'In the right place');
        assert.equal(place_view_model.occupants().length, 1, 'In the studio');
        _.each(place_view_model.occupants(), (occupant_observable) => {
          assert.equal(occupant_observable.name(), 'John', 'Expected name');
          assert.equal(occupant_observable.occupies().location(), 'the other side of the street', 'Expected location');

          // nested check
          assert.equal(occupant_observable.occupies().occupants().length, 1, 'In the studio');
          _.each(occupant_observable.occupies().occupants(), (x) => {
            assert.equal(x.name(), 'John', 'Expected name');
            assert.equal(x.occupies().location(), 'the other side of the street', 'Expected location');
          });
        });
      }
    });

    kb.release(places_observable);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('3. Model with recursive HasMany relations: Person with users who are people', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const george = new Person({
      id: 'person-3-3',
      name: 'George',
      friends: ['person-3-1', 'person-3-2', 'person-3-4'],
    });

    const john = new Person({
      id: 'person-3-1',
      name: 'John',
      friends: ['person-3-2', 'person-3-3', 'person-3-4'],
      best_friend: george,
    });
    george.set({ best_friend: john });

    const paul = new Person({
      id: 'person-3-2',
      name: 'Paul',
      friends: ['person-3-1', 'person-3-3', 'person-3-4'],
      best_friend: george,
    });

    const ringo = new Person({
      id: 'person-3-4',
      name: 'Ringo',
      friends: ['person-3-1', 'person-3-2', 'person-3-3'],
    });

    const model_stats = {};
    model_stats.george = { model: george, event_stats: kb.Statistics.eventsStats(george) };
    model_stats.john = { model: john, event_stats: kb.Statistics.eventsStats(john) };
    model_stats.paul = { model: paul, event_stats: kb.Statistics.eventsStats(paul) };
    model_stats.ringo = { model: ringo, event_stats: kb.Statistics.eventsStats(ringo) };

    let john_view_model = new kb.ViewModel(john);
    assert.equal(john_view_model.name(), 'John', 'Name is correct');
    _.each(john_view_model.friends(), (friend) => {
      assert.ok(~_.indexOf(['Paul', 'George', 'Ringo'], friend.name()), 'Expected name');
    });
    assert.equal(john_view_model.best_friend().name(), 'George', 'Expected name');
    assert.equal(john_view_model.best_friends_with_me()[0].name(), 'George', 'Expected name');
    kb.release(john_view_model); john_view_model = null;

    let paul_view_model = new kb.ViewModel(paul);
    assert.equal(paul_view_model.name(), 'Paul', 'Name is correct');
    _.each(paul_view_model.friends(), (friend) => {
      assert.ok(~_.indexOf(['John', 'George', 'Ringo'], friend.name()), 'Expected name');
    });
    assert.equal(paul_view_model.best_friend().name(), 'George', 'Expected name');
    assert.equal(paul_view_model.best_friends_with_me().length, 0, 'No best friends with me');
    kb.release(paul_view_model); paul_view_model = null;

    let george_view_model = new kb.ViewModel(george);
    assert.equal(george_view_model.name(), 'George', 'Name is correct');
    _.each(george_view_model.friends(), (friend) => {
      assert.ok(~_.indexOf(['John', 'Paul', 'Ringo'], friend.name()), 'Expected name');
    });
    assert.equal(george_view_model.best_friend().name(), 'John', 'Expected name');
    assert.equal(george_view_model.best_friends_with_me()[0].name(), 'John', 'Expected name');
    assert.equal(george_view_model.best_friends_with_me()[1].name(), 'Paul', 'Expected name');
    kb.release(george_view_model); george_view_model = null;

    _.each(model_stats, (stats) => {
      const match = kb.Statistics.eventsStats(stats.model).count === stats.event_stats.count;
      assert.ok(match, `All model events cleared to initial state. Expected: ${JSON.stringify(stats.event_stats)}. Actual: ${JSON.stringify(kb.Statistics.eventsStats(stats.model))}`);
    });
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('4. After view model create, add models', () => {
    const bob = new Occupant({ id: 'person-1', name: 'Bob' });
    const fred = new Occupant({ id: 'person-2', name: 'Fred' });

    const house = new House({
      location: 'In the middle of our street',
      occupants: [],
    });

    // confirm no occupants
    const view_model = kb.viewModel(house);
    assert.equal(view_model.occupants().length, 0, 'no occupants');

    const occupants_relationship = house.get('occupants');
    occupants_relationship.add(bob);
    occupants_relationship.add(fred);
    assert.equal(view_model.occupants().length, 2, 'two occupants');
    assert.equal(view_model.occupants()[0].name(), 'Bob', 'Bob is in the view model relationship');
    assert.equal(view_model.occupants()[1].name(), 'Fred', 'Fred is in the view model relationship');
  });

  it('5. bug fix for relational models https://github.com/kmalakoff/knockback/issues/34', () => {
    const Book = Backbone.RelationalModel.extend({
      defaults: {
        name: 'untitled',
      },
      idAttribute: '_id',
    });
    const Author = Backbone.RelationalModel.extend({
      defaults: {
        name: 'untitled',
      },
      idAttribute: '_id',
      relations: [{
        type: 'HasMany',
        key: 'books',
        relatedModel: Book,
        includeInJSON: '_id',
        reverseRelation: {
          key: 'author',
          includeInJSON: '_id',
        },
      }],
    });
    const BookStore = Backbone.RelationalModel.extend({
      relations: [{
        type: 'HasMany',
        key: 'books',
        relatedModel: Book,
      }, {
        type: 'HasMany',
        key: 'authors',
        relatedModel: Author,
      }],
    });

    const bs = new BookStore({
      books: [{ _id: 'b1', name: 'Book One', author: 'a1' }, { _id: 'b2', name: 'Book Two', author: 'a1' }],
      authors: [{ name: 'fred', _id: 'a1' }, { name: 'ted', _id: 'a2' }],
    });

    const BookViewModel = kb.ViewModel.extend({
      constructor(...args) {
        kb.ViewModel.prototype.constructor.apply(this, args);
        this.editMode = ko.observable();

        this.edit = () => {
          model._save = model.toJSON();
          return this.editMode(true);
        };

        this.confirm = () => {
          model._save = null;
          return this.editMode(false);
        };

        this.cancel = () => {
          model.set(model._save);
          return this.editMode(false);
        };
        return this;
      },
    });

    const view_model = {
      books: kb.collectionObservable(bs.get('books'), {
        factories: {
          models: BookViewModel,
          'models.author.books.models': BookViewModel,
        },
      }),
    };

    _.each(view_model.books(), (book) => {
      const author = book.author();
      _.each(author.books(), (authored_book) => {
        authored_book.editMode(true);
        assert.equal(authored_book.editMode(), true, 'edit mode set');
      });
    });
  });

  it('6. Inferring observable types: from the start', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const person1 = new Person({ id: 'person-6-1', name: 'Daddy' });
    const person2 = new Person({ id: 'person-6-2', name: 'Mommy' });
    const house = new Building({ id: 'house-6-1', name: 'Home Sweet Home', occupants: ['person-6-1', 'person-6-2'] });
    person1.get('friends').add(person2); person2.set({ best_friend: person1 });

    const view_model_person1 = kb.viewModel(person1);
    const view_model_house1 = kb.viewModel(house);

    // check friends
    assert.equal(view_model_person1.friends().length, 1, 'person1 has one friend');
    assert.equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy');
    assert.equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy');

    // check occupants
    assert.equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    assert.equal(view_model_house1.occupants().length, 2, 'house has two occupants');
    assert.equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it');

    // release
    kb.release(view_model_person1);
    kb.release(view_model_house1);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('7a. Inferring observable types: late binding', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const person1 = new Person({ id: 'person-7-1', name: 'Daddy' });
    const person2 = new Person({ id: 'person-7-2', name: 'Mommy' });
    const house = new Building({ id: 'house-7-1', name: 'Home Sweet Home' });

    const view_model_person1 = kb.viewModel(person1);
    const view_model_house1 = kb.viewModel(house);

    // inferred the relationship types
    assert.equal(view_model_person1.name(), 'Daddy', 'person1 name is Daddy');
    assert.equal(view_model_person1.friends().length, 0, 'person1 has no friends');
    assert.equal(view_model_person1.best_friends_with_me().length, 0, 'person1 has not best_friends');
    assert.equal(view_model_house1.occupants().length, 0, 'house has no occupants');

    // add some friends
    person1.get('friends').add(person2); person2.set({ best_friend: person1 });
    assert.equal(view_model_person1.friends().length, 1, 'person1 has one friend');
    assert.equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy');
    assert.equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy');

    // add some occupants
    house.get('occupants').add(person1);
    house.get('occupants').add(person2);
    assert.equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    assert.equal(view_model_house1.occupants().length, 2, 'house has two occupants');
    assert.equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it');

    // release
    kb.release(view_model_person1);
    kb.release(view_model_house1);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('7b. Inferring observable types: late binding (attribute setting)', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const person1 = new Person({ id: 'person-7b-1', name: 'Daddy' });
    const person2 = new Person({ id: 'person-7b-2', name: 'Mommy' });
    const house = new Building({ id: 'house-7b-1', name: 'Home Sweet Home' });

    const view_model_person1 = kb.viewModel(person1);
    const view_model_house1 = kb.viewModel(house);

    // inferred the relationship types
    assert.equal(view_model_person1.name(), 'Daddy', 'person1 name is Daddy');
    assert.equal(view_model_person1.friends().length, 0, 'person1 has no friends');
    assert.equal(view_model_person1.best_friends_with_me().length, 0, 'person1 has not best_friends');
    assert.equal(view_model_house1.occupants().length, 0, 'house has no occupants');

    // add some friends
    const friends = _.clone(person1.get('friends').models); friends.push(person2); person1.set({ friends });
    person2.set({ best_friend: person1 });
    assert.equal(view_model_person1.friends().length, 1, 'person1 has one friend');
    assert.equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy');
    assert.equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy');

    // add some occupants
    const occupants = _.clone(house.get('occupants').models); occupants.push(person1); occupants.push(person2); house.set({ occupants });
    assert.equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    assert.equal(view_model_house1.occupants().length, 2, 'house has two occupants');
    assert.equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it');

    // release
    kb.release(view_model_person1);
    kb.release(view_model_house1);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('8a. Customizing observable types: from the start', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    class FriendViewModel extends kb.ViewModel {}
    class BestFriendViewModel extends kb.ViewModel {}
    class PersonViewModel extends kb.ViewModel {
      constructor(model, options) {
        super(model, {
          factories: {
            'friends.models': FriendViewModel,
            best_friend: BestFriendViewModel,
            occupies: HouseViewModel,
          },
          options,
        });
      }
    }
    class HouseViewModel extends kb.ViewModel {
      constructor(model, options) {
        super(model, {
          factories: { 'occupants.models': PersonViewModel },
          options,
        });
      }
    }

    const person1 = new Person({ id: 'person-8-1', name: 'Daddy' });
    const person2 = new Person({ id: 'person-8-2', name: 'Mommy' });
    const family = new Backbone.Collection([person1, person2]);
    const house = new Building({ id: 'house-8-1', name: 'Home Sweet Home', occupants: ['person-8-1', 'person-8-2'] });
    person1.get('friends').add(person2);
    person2.set({ best_friend: person1 });

    const view_model_person1 = new PersonViewModel(person1);
    const view_model_person2 = new PersonViewModel(person2);
    const co_family = kb.collectionObservable(family, { view_model: PersonViewModel });
    const view_model_house1 = new HouseViewModel(house);

    // check friends
    assert.equal(view_model_person1.friends().length, 1, 'person1 has one friend');
    assert.ok(view_model_person1.friends()[0] instanceof FriendViewModel, 'person1 is friends are FriendViewModel');
    assert.equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy');
    assert.equal(view_model_person1.best_friends_with_me().length, 1, 'person1 has one best friends');
    assert.equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy');
    assert.ok(view_model_person2.best_friend() instanceof BestFriendViewModel, 'person2 is best friends are BestFriendViewModel');
    assert.equal(view_model_person2.best_friend().name(), 'Daddy', 'person2 is best friends with Daddy');
    assert.ok(view_model_person2.occupies() instanceof HouseViewModel, 'person2 is occupies HouseViewModel');

    // check occupants
    assert.equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    assert.equal(view_model_house1.occupants().length, 2, 'house has two occupants');
    assert.ok(view_model_house1.occupants()[0] instanceof PersonViewModel, 'house has PersonViewModel in it');
    assert.equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it');
    assert.ok(view_model_house1.occupants()[0].occupies() instanceof HouseViewModel, 'person1 occupies has HouseViewModel');
    assert.equal(view_model_house1.occupants()[0].occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');

    // release
    kb.release(view_model_person1);
    kb.release(view_model_person2);
    kb.release(co_family);
    kb.release(view_model_house1);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('8b. Customizing observable types: from the start (attribute setting)', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    class FriendViewModel extends kb.ViewModel {}
    class BestFriendViewModel extends kb.ViewModel {}
    class PersonViewModel extends kb.ViewModel {
      constructor(model, options) {
        super(model, {
          factories: {
            'friends.models': FriendViewModel,
            best_friend: BestFriendViewModel,
            occupies: HouseViewModel,
          },
          options,
        });
      }
    }
    class HouseViewModel extends kb.ViewModel {
      constructor(model, options) {
        super(model, { factories: {
          'occupants.models': PersonViewModel,
        },
          options });
      }
    }

    const person1 = new Person({ id: 'person-8b-1', name: 'Daddy' });
    const person2 = new Person({ id: 'person-8b-2', name: 'Mommy' });
    const family = new Backbone.Collection([person1, person2]);
    const house = new Building({ id: 'house-8b-1', name: 'Home Sweet Home', occupants: [person1.toJSON()] });
    house.set({ occupants: [person1.toJSON(), person2.toJSON()] });
    const friends = _.clone(person1.get('friends').models); friends.push(person2); person1.set({ friends });
    person2.set({ best_friend: person1 });

    const view_model_person1 = new PersonViewModel(person1);
    const view_model_person2 = new PersonViewModel(person2);
    const co_family = kb.collectionObservable(family, { view_model: PersonViewModel });
    const view_model_house1 = new HouseViewModel(house);

    // check friends
    assert.equal(view_model_person1.friends().length, 1, 'person1 has one friend');
    assert.ok(view_model_person1.friends()[0] instanceof FriendViewModel, 'person1 is friends are FriendViewModel');
    assert.equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy');
    assert.equal(view_model_person1.best_friends_with_me().length, 1, 'person1 has one best friends');
    assert.equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy');
    assert.ok(view_model_person2.best_friend() instanceof BestFriendViewModel, 'person2 is best friends are BestFriendViewModel');
    assert.equal(view_model_person2.best_friend().name(), 'Daddy', 'person2 is best friends with Daddy');
    assert.ok(view_model_person2.occupies() instanceof HouseViewModel, 'person2 is occupies HouseViewModel');

    // check occupants
    assert.equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    assert.equal(view_model_house1.occupants().length, 2, 'house has two occupants');
    assert.ok(view_model_house1.occupants()[0] instanceof PersonViewModel, 'house has PersonViewModel in it');
    assert.equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it');
    assert.ok(view_model_house1.occupants()[0].occupies() instanceof HouseViewModel, 'person1 occupies has HouseViewModel');
    assert.equal(view_model_house1.occupants()[0].occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');

    // release
    kb.release(view_model_person1);
    kb.release(view_model_person2);
    kb.release(co_family);
    kb.release(view_model_house1);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('9a. Customizing observable types: late binding', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    class FriendViewModel extends kb.ViewModel {}
    class BestFriendViewModel extends kb.ViewModel {}
    class PersonViewModel extends kb.ViewModel {
      constructor(model, options) {
        super(model, { factories: {
          'friends.models': FriendViewModel,
          best_friend: BestFriendViewModel,
          occupies: HouseViewModel,
        },
          options });
      }
    }
    class HouseViewModel extends kb.ViewModel {
      constructor(model, options) {
        super(model, { factories: {
          'occupants.models': PersonViewModel,
        },
          options });
      }
    }

    const person1 = new Person({ id: 'person-9-1', name: 'Daddy' });
    const person2 = new Person({ id: 'person-9-2', name: 'Mommy' });
    const family = new Backbone.Collection([person1, person2]);
    const house = new Building({ id: 'house-9-1', name: 'Home Sweet Home' });

    const view_model_person1 = new PersonViewModel(person1);
    const view_model_person2 = new PersonViewModel(person2);
    const co_family = kb.collectionObservable(family, { view_model: PersonViewModel });
    const view_model_house1 = new HouseViewModel(house);

    // check initial state
    assert.equal(view_model_person1.friends().length, 0, 'person1 has no friends');
    assert.equal(view_model_person1.best_friends_with_me().length, 0, 'person1 has no best friends');
    assert.ok(view_model_person2.best_friend() instanceof BestFriendViewModel, 'person2 is best friends are BestFriendViewModel');
    assert.ok(view_model_person2.occupies() instanceof HouseViewModel, 'person2 is occupies HouseViewModel');
    assert.equal(view_model_house1.occupants().length, 0, 'house has no occupants');

    // check friends
    person1.get('friends').add(person2); person2.set({ best_friend: person1 });
    assert.equal(view_model_person1.friends().length, 1, 'person1 has one friend');
    assert.ok(view_model_person1.friends()[0] instanceof FriendViewModel, 'person1 is friends are FriendViewModel');
    assert.equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy');
    assert.equal(view_model_person1.best_friends_with_me().length, 1, 'person1 has one best friends');
    assert.equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy');
    assert.ok(view_model_person2.best_friend() instanceof BestFriendViewModel, 'person2 is best friends are BestFriendViewModel');
    assert.equal(view_model_person2.best_friend().name(), 'Daddy', 'person2 is best friends with Daddy');
    assert.ok(view_model_person2.occupies() instanceof HouseViewModel, 'person2 is occupies HouseViewModel');

    // check occupants
    house.get('occupants').add(person1);
    house.get('occupants').add(person2);
    assert.equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    assert.equal(view_model_house1.occupants().length, 2, 'house has two occupants');
    assert.ok(view_model_house1.occupants()[0] instanceof PersonViewModel, 'house has PersonViewModel in it');
    assert.equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it');
    assert.ok(view_model_house1.occupants()[0].occupies() instanceof HouseViewModel, 'person1 occupies has HouseViewModel');
    assert.equal(view_model_house1.occupants()[0].occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');

    // release
    kb.release(view_model_person1);
    kb.release(view_model_person2);
    kb.release(co_family);
    kb.release(view_model_house1);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('9b. Customizing observable types: late binding (atrributes setting)', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    class FriendViewModel extends kb.ViewModel {}
    class BestFriendViewModel extends kb.ViewModel {}
    class PersonViewModel extends kb.ViewModel {
      constructor(model, options) {
        super(model, { factories: {
          'friends.models': FriendViewModel,
          best_friend: BestFriendViewModel,
          occupies: HouseViewModel,
        },
          options });
      }
    }
    class HouseViewModel extends kb.ViewModel {
      constructor(model, options) {
        super(model, { factories: {
          'occupants.models': PersonViewModel,
        },
          options });
      }
    }

    const person1 = new Person({ id: 'person-9b-1', name: 'Daddy' });
    const person2 = new Person({ id: 'person-9b-2', name: 'Mommy' });
    const family = new Backbone.Collection([person1, person2]);
    const house = new Building({ id: 'house-9b-1', name: 'Home Sweet Home' });

    const view_model_person1 = new PersonViewModel(person1);
    const view_model_person2 = new PersonViewModel(person2);
    const co_family = kb.collectionObservable(family, { view_model: PersonViewModel });
    const view_model_house1 = new HouseViewModel(house);

    // check initial state
    assert.equal(view_model_person1.friends().length, 0, 'person1 has no friends');
    assert.equal(view_model_person1.best_friends_with_me().length, 0, 'person1 has no best friends');
    assert.ok(view_model_person2.best_friend() instanceof BestFriendViewModel, 'person2 is best friends are BestFriendViewModel');
    assert.ok(view_model_person2.occupies() instanceof HouseViewModel, 'person2 is occupies HouseViewModel');
    assert.equal(view_model_house1.occupants().length, 0, 'house has no occupants');

    // check friends
    const friends = _.clone(person1.get('friends').models); friends.push(person2); person1.set({ friends });
    person2.set({ best_friend: person1 });
    assert.equal(view_model_person1.friends().length, 1, 'person1 has one friend');
    assert.ok(view_model_person1.friends()[0] instanceof FriendViewModel, 'person1 is friends are FriendViewModel');
    assert.equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy');
    assert.equal(view_model_person1.best_friends_with_me().length, 1, 'person1 has one best friends');
    assert.equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy');
    assert.ok(view_model_person2.best_friend() instanceof BestFriendViewModel, 'person2 is best friends are BestFriendViewModel');
    assert.equal(view_model_person2.best_friend().name(), 'Daddy', 'person2 is best friends with Daddy');
    assert.ok(view_model_person2.occupies() instanceof HouseViewModel, 'person2 is occupies HouseViewModel');

    // check occupants
    const occupants = _.clone(house.get('occupants').models); occupants.push(person1); occupants.push(person2); house.set({ occupants });
    assert.equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    assert.equal(view_model_house1.occupants().length, 2, 'house has two occupants');
    assert.ok(view_model_house1.occupants()[0] instanceof PersonViewModel, 'house has PersonViewModel in it');
    assert.equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it');
    assert.ok(view_model_house1.occupants()[0].occupies() instanceof HouseViewModel, 'person1 occupies has HouseViewModel');
    assert.equal(view_model_house1.occupants()[0].occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');

    // release
    kb.release(view_model_person1);
    kb.release(view_model_person2);
    kb.release(co_family);
    kb.release(view_model_house1);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('10. Nested custom view models', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const george = new Person({
      id: 'person-10-3',
      name: 'George',
      friends: ['person-10-1', 'person-10-2', 'person-10-4'],
    });

    const john = new Person({
      id: 'person-10-1',
      name: 'John',
      friends: ['person-10-2', 'person-10-3', 'person-10-4'],
      best_friend: george,
    });
    george.set({ best_friend: john });

    const paul = new Person({
      id: 'person-10-2',
      name: 'Paul',
      friends: ['person-10-1', 'person-10-3', 'person-10-4'],
      best_friend: george,
    });

    const ringo = new Person({
      id: 'person-10-4',
      name: 'Ringo',
      friends: ['person-10-1', 'person-10-2', 'person-10-3'],
    });

    const FriendViewModel = function (model) {
      this.name = kb.observable(model, 'name');
      this.type = ko.observable('friend');
      return this;
    };
    const BestFriendViewModel = function (model) {
      this.name = kb.observable(model, 'name');
      this.type = ko.observable('best_friend');
      return this;
    };
    class BandMemberViewModel extends kb.ViewModel {
      constructor(...args) {
        super(...args);
        this.type = ko.observable('band_member');
      }
    }

    const collection_observable = kb.collectionObservable(new Backbone.Collection([john, paul, george, ringo]), {
      factories: {
        models: BandMemberViewModel,
        'models.best_friend': { create: model => (model && new BestFriendViewModel(model)) || null },
        'models.friends.models': FriendViewModel,
      },
    });

    const validateFriend = (vm, name) => {
      assert.equal(vm.type(), 'friend', `friend type matches for ${name}`);
      return assert.equal(vm.name(), name, `friend name matches for ${name}`);
    };

    const validateFriends = function (co, names) {
      _.each(names, (name) => {
        let found = false;
        _.each(co(), (vm) => {
          if (vm.name && (vm.name() === name)) {
            found = true;
            validateFriend(vm, name);
          }
        });
        assert.ok(found, `${name} was found`);
      });
    };

    const validateBestFriend = (vm, name) => {
      assert.equal(vm.type(), 'best_friend', `best friend type matches for ${name}`);
      return assert.equal(vm.name(), name, `best friend name matches for ${name}`);
    };

    const validateBandMember = (vm, name) => {
      assert.equal(vm.type(), 'band_member', `band member type matches for ${name}`);
      assert.ok(vm instanceof BandMemberViewModel, `band member type matches for ${name}`);
      return assert.equal(vm.name(), name, `band member name matches for ${name}`);
    };

    validateBandMember(collection_observable()[0], 'John');
    validateBestFriend(collection_observable()[0].best_friend(), 'George');
    validateFriends(collection_observable()[0].friends, ['Paul', 'George', 'Ringo']);
    validateBandMember(collection_observable()[1], 'Paul');
    validateBestFriend(collection_observable()[1].best_friend(), 'George');
    validateFriends(collection_observable()[1].friends, ['John', 'George', 'Ringo']);
    validateBandMember(collection_observable()[2], 'George');
    validateBestFriend(collection_observable()[2].best_friend(), 'John');
    validateFriends(collection_observable()[2].friends, ['John', 'Paul', 'Ringo']);
    validateBandMember(collection_observable()[3], 'Ringo');
    assert.equal(collection_observable()[3].best_friend(), null, 'No best friend');
    validateFriends(collection_observable()[3].friends, ['John', 'Paul', 'George']);

    // and cleanup after yourself when you are done.
    kb.release(collection_observable);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('11. Minimum factory tree for shared dependent models', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const george = new Person({
      id: 'person-11-3',
      name: 'George',
      friends: ['person-11-1', 'person-11-2', 'person-11-4'],
    });
    const john = new Person({
      id: 'person-11-1',
      name: 'John',
      friends: ['person-11-2', 'person-11-3', 'person-11-4'],
    });
    const paul = new Person({
      id: 'person-11-2',
      name: 'Paul',
      friends: ['person-11-1', 'person-11-3', 'person-11-4'],
    });
    const ringo = new Person({
      id: 'person-11-4',
      name: 'Ringo',
      friends: ['person-11-1', 'person-11-2', 'person-11-3'],
    });

    class PersonViewModel extends kb.ViewModel {
      constructor(model, options) {
        super(model, {
          factories: {
            friends: PersonCollection,
            best_friend: PersonViewModel,
            best_friends_with_me: PersonViewModel,
          },
          options,
        });
      }
    }

    class PersonCollection extends kb.CollectionObservable {
      constructor(collection, options) {
        super(collection, { factories: { models: PersonViewModel }, options });
        return kb.utils.wrappedObservable(this);
      }
    }

    const collection_observable1 = new PersonCollection(new Backbone.Collection([george, john, paul, ringo]));
    const collection_observable2 = new PersonCollection(new Backbone.Collection([george, john, paul, ringo]), collection_observable1.shareOptions());

    assert.equal(collection_observable1.__kb.factory, collection_observable2.__kb.factory, 'the factory should be shared');

    kb.release([collection_observable1, collection_observable2]);

    const view_model_george = new PersonViewModel(george);
    const view_model_john = new PersonViewModel(john, view_model_george.shareOptions());
    const view_model_paul = new PersonViewModel(john, view_model_john.shareOptions());
    const view_model_ringo = new PersonViewModel(ringo, view_model_paul.shareOptions());

    const view_model_george_john = view_model_george.friends()[0];
    assert.equal(view_model_george.__kb.factory, view_model_george_john.__kb.factory.parent_factory.parent_factory, 'the factory should be shared: george');
    assert.equal(view_model_george.__kb.factory, view_model_john.__kb.factory, 'the factory should be shared: john');
    assert.equal(view_model_george.__kb.factory, view_model_paul.__kb.factory, 'the factory should be shared: paul');
    assert.equal(view_model_george.__kb.factory, view_model_ringo.__kb.factory, 'the factory should be shared: ringo');

    kb.release([view_model_george, view_model_john, view_model_paul, view_model_ringo]);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  // https://github.com/kmalakoff/knockback/issues/96
  it('12. Issue 96', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const Parameter = Backbone.RelationalModel.extend({ idAttribute: 'ParameterName' });
    const ParameterCollection = Backbone.Collection.extend({ model: Parameter });

    const Filter = Backbone.RelationalModel.extend({
      relations: [{
        type: Backbone.HasOne,
        key: 'Parameter',
        keySource: 'ParameterName',
        relatedModel: Parameter,
        includeInJSON: 'ParameterName',
        reverseRelation: {
          key: 'Filters',
          type: Backbone.HasMany,
          includeInJSON: false,
        },
      }],
    });

    class StringParameterViewModel extends kb.ViewModel {}
    class BooleanParameterViewModel extends kb.ViewModel {}

    const ParameterFactory = {
      create(parameter, options) {
        switch (parameter.get('Type')) {
          case 0: return new StringParameterViewModel(parameter, options);
          case 1: return new BooleanParameterViewModel(parameter, options);
          default: throw new Error('Invalid parameter type attribute.');
        }
      },
    };

    const parameter_models = new ParameterCollection();
    const parameters = kb.collectionObservable(parameter_models, { factories: { models: ParameterFactory } });

    parameter_models.push({ Type: 0 });
    parameter_models.push({ Type: 1 });

    assert.ok(parameters()[0] instanceof StringParameterViewModel);
    assert.ok(parameters()[1] instanceof BooleanParameterViewModel);

    kb.release(parameters);

    const FilterGroup = Backbone.RelationalModel.extend({
      relations: [{
        type: Backbone.HasMany,
        key: 'Filters',
        relatedModel: Filter,
      }],
    });

    class FilterViewModel extends kb.ViewModel {}

    class FilterGroupViewModel extends kb.ViewModel {
      constructor(model, options) {
        super(model, {
          factories: {
            'Filters.models': FilterViewModel,
            'Filters.models.Parameter': ParameterFactory,
          },
          options,
        });
      }
    }

    const filter_group_model = new FilterGroup({ Filters: [
      { Name: 'String', Parameter: { Type: 0 } },
      { Name: 'Boolean', Parameter: { Type: 1 } },
    ] });

    // LEGACY
    if (!filter_group_model.get('Filters').models[0].get('Parameter')) {
      assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    }

    const filter_group = new FilterGroupViewModel(filter_group_model);

    let filter = filter_group.Filters()[0];
    assert.equal(filter.Name(), 'String');
    assert.ok(filter.Parameter() instanceof StringParameterViewModel);

    filter = filter_group.Filters()[1];
    assert.equal(filter.Name(), 'Boolean');
    assert.ok(filter.Parameter() instanceof BooleanParameterViewModel);

    kb.release(filter_group);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  // https://github.com/kmalakoff/knockback/issues/113
  it('13. Issue 113', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const SubModel = Backbone.RelationalModel.extend({});
    const SubCollection = Backbone.Collection.extend({ model: SubModel });
    new SubCollection([{ id: 1, name: 'aaron' }, { id: 2, name: 'bruce' }]);
    const Model = Backbone.RelationalModel.extend({
      relations: [{
        type: Backbone.HasOne,
        key: 'sub_model',
        relatedModel: SubModel,
      }],
    });

    const Collection = Backbone.Collection.extend({ model: Model });
    const col = new Collection([{ id: 1, sub_model: null }, { id: 2, sub_model: null }]);

    const co = new kb.CollectionObservable(col);

    col.models[0].set('sub_model', 1);
    col.models[1].set('sub_model', 1);
    assert.equal(col.models[0].get('sub_model').id, 1);
    assert.equal(col.models[1].get('sub_model').id, 1);
    assert.equal(co()[0].sub_model().id(), 1);
    assert.equal(co()[1].sub_model().id(), 1);

    col.models[0].set('sub_model', 2);
    assert.equal(col.models[0].get('sub_model').id, 2);
    assert.equal(col.models[1].get('sub_model').id, 1);
    assert.equal(co()[0].sub_model().id(), 2);
    assert.equal(co()[1].sub_model().id(), 1);

    kb.release(co);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  // https://github.com/kmalakoff/knockback/issues/122
  it('14. Issue 122', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const Model2 = Backbone.RelationalModel.extend({});
    const Model1 = Backbone.RelationalModel.extend({ relations: [{ type: Backbone.HasOne, key: 'nested', relatedModel: Model2 }] });

    class ViewModel extends kb.ViewModel {
      constructor(model, options) {
        super(model, { requires: ['nested'], options });
        this.removeNested = () => model.get('nested').destroy();
        this.addNested = () => model.set({ nested: new Model2() });
        this.hasNested = ko.computed(() => this.nested() && !!this.nested().model());
      }
    }

    const model = new Model1();
    const view_model = new ViewModel(model);
    assert.ok(!view_model.hasNested(), 'not have a nested');
    view_model.addNested();
    assert.ok(!!model.get('nested'), 'added a nested');
    assert.ok(view_model.hasNested(), 'added a nested');
    view_model.removeNested();
    assert.ok(!model.get('nested'), 'removed a nested');
    assert.ok(!view_model.hasNested(), 'removed a nested');

    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  // TODO: re-enable when fixed: https://github.com/PaulUithol/Backbone-relational/issues/485
  // # https://github.com/kmalakoff/knockback/issues/121
  // it '15. Issue 121', (done) ->
  //   kb.statistics = new kb.Statistics() # turn on stats

  //   Model1 = Backbone.RelationalModel.extend({})

  //   view_model =  new kb.ViewModel( model1 = new Model1() )

  //   model1.set({propB: 'val2'})
  //   assert.equal view_model.propB(), 'val2'

  //   model1.listenTo( model1, "change:propA", (model)->  model1.set( 'propC', 'val3' ) )

  //   model1.set({propA: 'val1', propB: 'val2.2'})
  //   assert.equal view_model.propA(), 'val1'
  //   assert.equal view_model.propB(), 'val2.2'
  //   assert.equal view_model.propC(), 'val3'

  //   kb.release(view_model)

  //   assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  //   done()
});
