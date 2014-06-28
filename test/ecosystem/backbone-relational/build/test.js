var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

describe('Knockback.js with Backbone-Relational.js', function() {
  var Backbone, kb, ko, _, _base;
  _ = window._ || (typeof require === "function" ? require('underscore') : void 0);
  Backbone = window.Backbone || (typeof require === "function" ? require('backbone') : void 0);
  (Backbone != null ? Backbone.Relational : void 0) || (typeof require === "function" ? require('backbone-relational') : void 0);
  ko = window.ko || (typeof require === "function" ? require('knockout') : void 0);
  kb = window.kb || (typeof require === "function" ? require('knockback') : void 0);
  it('TEST DEPENDENCY MISSING', function(done) {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!Backbone, 'Backbone');
    assert.ok(!!kb, 'kb');
    assert.ok(!!Backbone.Relational, 'Backbone.Relational');
    assert.ok(!!kb, 'kb');
    return done();
  });
  if (typeof (_base = Backbone.Relational.store).addModelScope === "function") {
    _base.addModelScope(window);
  }
  window.Person = Backbone.RelationalModel.extend({
    relations: [
      {
        type: Backbone.HasMany,
        key: 'friends',
        relatedModel: 'Person'
      }, {
        type: Backbone.HasOne,
        key: 'best_friend',
        relatedModel: 'Person',
        reverseRelation: {
          type: Backbone.HasMany,
          key: 'best_friends_with_me'
        }
      }
    ]
  });
  window.Building = Backbone.RelationalModel.extend({
    relations: [
      {
        type: Backbone.HasMany,
        key: 'occupants',
        relatedModel: Person,
        reverseRelation: {
          type: Backbone.HasOne,
          key: 'occupies'
        }
      }
    ]
  });
  it('1. Model with HasMany relations: A house with multiple people living in it', function(done) {
    var house_view_model, john, occupant_observable, occupant_observable2, our_house, paul, _i, _j, _len, _len1, _ref, _ref1;
    kb.statistics = new kb.Statistics();
    john = new Person({
      id: 'person-1-1',
      name: 'John'
    });
    paul = new Person({
      id: 'person-1-2',
      name: 'Paul'
    });
    our_house = new Building({
      id: 'house-1-1',
      location: 'in the middle of the street',
      occupants: ['person-1-1', 'person-1-2']
    });
    house_view_model = new kb.ViewModel(our_house);
    assert.equal(house_view_model.location(), 'in the middle of the street', 'In the right place');
    assert.equal(house_view_model.occupants().length, 2, 'Expected occupant count');
    _ref = house_view_model.occupants();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      occupant_observable = _ref[_i];
      assert.ok(_.contains(['John', 'Paul'], occupant_observable.name()), 'Expected name');
      assert.equal(occupant_observable.occupies().location(), 'in the middle of the street', 'Expected location');
      assert.equal(occupant_observable.occupies().occupants().length, 2, "Excepted occupant count");
      _ref1 = occupant_observable.occupies().occupants();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        occupant_observable2 = _ref1[_j];
        assert.ok(_.contains(['John', 'Paul'], occupant_observable2.name()), 'Expected name');
        assert.equal(occupant_observable2.occupies().location(), 'in the middle of the street', 'Expected location');
      }
    }
    kb.release(house_view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('2. Collection with models with HasMany relations: Multiple houses with multiple people living in them', function(done) {
    var abbey_flats, abbey_studios, george, john, occupant_observable, occupant_observable2, paul, place_view_model, places, places_observable, ringo, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _m, _n, _o, _p, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
    kb.statistics = new kb.Statistics();
    john = new Person({
      id: 'person-2-1',
      name: 'John'
    });
    paul = new Person({
      id: 'person-2-2',
      name: 'Paul'
    });
    george = new Person({
      id: 'person-2-3',
      name: 'George'
    });
    ringo = new Person({
      id: 'person-2-4',
      name: 'Ringo'
    });
    abbey_flats = new Building({
      id: 'house-2-1',
      location: 'one side of the street',
      occupants: ['person-2-1', 'person-2-2', 'person-2-3', 'person-2-4']
    });
    abbey_studios = new Building({
      id: 'studio-2-2',
      location: 'the other side of the street',
      occupants: []
    });
    places = new kb.Collection([abbey_flats, abbey_studios]);
    places_observable = kb.collectionObservable(places, {
      view_model: kb.ViewModel
    });
    _ref = places_observable();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      place_view_model = _ref[_i];
      if (place_view_model.id() === 'house-2-1') {
        assert.equal(place_view_model.location(), 'one side of the street', 'In the right place');
        assert.equal(place_view_model.occupants().length, 4, "Everyone is here");
        _ref1 = place_view_model.occupants();
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          occupant_observable = _ref1[_j];
          assert.ok(_.contains(['John', 'Paul', 'George', 'Ringo'], occupant_observable.name()), 'Expected name');
          assert.equal(occupant_observable.occupies().location(), 'one side of the street', 'Expected location');
          assert.equal(occupant_observable.occupies().occupants().length, 4, "Everyone is here");
          _ref2 = occupant_observable.occupies().occupants();
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            occupant_observable2 = _ref2[_k];
            assert.ok(_.contains(['John', 'Paul', 'George', 'Ringo'], occupant_observable2.name()), 'Expected name');
            assert.equal(occupant_observable2.occupies().location(), 'one side of the street', 'Expected location');
          }
        }
      } else {
        assert.equal(place_view_model.location(), 'the other side of the street', 'In the right place');
        assert.equal(place_view_model.occupants().length, 0, "No one is here");
      }
    }
    abbey_studios.get('occupants').add(john);
    _ref3 = places_observable();
    for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
      place_view_model = _ref3[_l];
      if (place_view_model.id() === 'house-2-1') {
        assert.equal(place_view_model.location(), 'one side of the street', 'In the right place');
        assert.equal(place_view_model.occupants().length, 3, "Almost everyone is here");
        _ref4 = place_view_model.occupants();
        for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
          occupant_observable = _ref4[_m];
          assert.ok(_.contains(['Paul', 'George', 'Ringo'], occupant_observable.name()), 'Expected name');
          assert.equal(occupant_observable.occupies().location(), 'one side of the street', 'Expected location');
          assert.equal(occupant_observable.occupies().occupants().length, 3, "Almost everyone is here");
          _ref5 = occupant_observable.occupies().occupants();
          for (_n = 0, _len5 = _ref5.length; _n < _len5; _n++) {
            occupant_observable2 = _ref5[_n];
            assert.ok(_.contains(['Paul', 'George', 'Ringo'], occupant_observable2.name()), 'Expected name');
            assert.equal(occupant_observable2.occupies().location(), 'one side of the street', 'Expected location');
          }
        }
      } else {
        assert.equal(place_view_model.location(), 'the other side of the street', 'In the right place');
        assert.equal(place_view_model.occupants().length, 1, "In the studio");
        _ref6 = place_view_model.occupants();
        for (_o = 0, _len6 = _ref6.length; _o < _len6; _o++) {
          occupant_observable = _ref6[_o];
          assert.equal(occupant_observable.name(), 'John', 'Expected name');
          assert.equal(occupant_observable.occupies().location(), 'the other side of the street', 'Expected location');
          assert.equal(occupant_observable.occupies().occupants().length, 1, "In the studio");
          _ref7 = occupant_observable.occupies().occupants();
          for (_p = 0, _len7 = _ref7.length; _p < _len7; _p++) {
            occupant_observable2 = _ref7[_p];
            assert.equal(occupant_observable2.name(), 'John', 'Expected name');
            assert.equal(occupant_observable2.occupies().location(), 'the other side of the street', 'Expected location');
          }
        }
      }
    }
    kb.release(places_observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('3. Model with recursive HasMany relations: Person with users who are people', function(done) {
    var friend, george, george_view_model, john, john_view_model, paul, paul_view_model, ringo, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    kb.statistics = new kb.Statistics();
    george = new Person({
      id: 'person-3-3',
      name: 'George',
      friends: ['person-3-1', 'person-3-2', 'person-3-4']
    });
    john = new Person({
      id: 'person-3-1',
      name: 'John',
      friends: ['person-3-2', 'person-3-3', 'person-3-4'],
      best_friend: george
    });
    george.set({
      best_friend: john
    });
    paul = new Person({
      id: 'person-3-2',
      name: 'Paul',
      friends: ['person-3-1', 'person-3-3', 'person-3-4'],
      best_friend: george
    });
    ringo = new Person({
      id: 'person-3-4',
      name: 'Ringo',
      friends: ['person-3-1', 'person-3-2', 'person-3-3']
    });
    john_view_model = new kb.ViewModel(john);
    assert.equal(john_view_model.name(), 'John', "Name is correct");
    _ref = john_view_model.friends();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      friend = _ref[_i];
      assert.ok(_.contains(['Paul', 'George', 'Ringo'], friend.name()), 'Expected name');
    }
    assert.equal(john_view_model.best_friend().name(), 'George', 'Expected name');
    assert.equal(john_view_model.best_friends_with_me()[0].name(), 'George', 'Expected name');
    kb.release(john_view_model);
    john_view_model = null;
    paul_view_model = new kb.ViewModel(paul);
    assert.equal(paul_view_model.name(), 'Paul', "Name is correct");
    _ref1 = paul_view_model.friends();
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      friend = _ref1[_j];
      assert.ok(_.contains(['John', 'George', 'Ringo'], friend.name()), 'Expected name');
    }
    assert.equal(paul_view_model.best_friend().name(), 'George', 'Expected name');
    assert.equal(paul_view_model.best_friends_with_me().length, 0, 'No best friends with me');
    kb.release(paul_view_model);
    paul_view_model = null;
    george_view_model = new kb.ViewModel(george);
    assert.equal(george_view_model.name(), 'George', "Name is correct");
    _ref2 = george_view_model.friends();
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      friend = _ref2[_k];
      assert.ok(_.contains(['John', 'Paul', 'Ringo'], friend.name()), 'Expected name');
    }
    assert.equal(george_view_model.best_friend().name(), 'John', 'Expected name');
    assert.equal(george_view_model.best_friends_with_me()[0].name(), 'John', 'Expected name');
    assert.equal(george_view_model.best_friends_with_me()[1].name(), 'Paul', 'Expected name');
    kb.release(george_view_model);
    george_view_model = null;
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('4. After view model create, add models', function(done) {
    var House, Occupant, bob, fred, house, occupants_relationship, view_model;
    Occupant = Backbone.RelationalModel.extend({});
    House = Backbone.RelationalModel.extend({
      relations: [
        {
          type: Backbone.HasMany,
          key: 'occupants',
          relatedModel: Occupant,
          reverseRelation: {
            key: 'livesIn'
          }
        }
      ]
    });
    bob = new Occupant({
      id: 'person-1',
      name: 'Bob'
    });
    fred = new Occupant({
      id: 'person-2',
      name: 'Fred'
    });
    house = new House({
      location: 'In the middle of our street',
      occupants: []
    });
    view_model = kb.viewModel(house);
    assert.equal(view_model.occupants().length, 0, "no occupants");
    occupants_relationship = house.get('occupants');
    occupants_relationship.add(bob);
    occupants_relationship.add(fred);
    assert.equal(view_model.occupants().length, 2, 'two occupants');
    assert.equal(view_model.occupants()[0].name(), 'Bob', 'Bob is in the view model relationship');
    assert.equal(view_model.occupants()[1].name(), 'Fred', 'Fred is in the view model relationship');
    return done();
  });
  it('5. bug fix for relational models https://github.com/kmalakoff/knockback/issues/34', function(done) {
    var Author, Book, BookStore, BookViewModel, author, authored_book, book, bs, view_model, _i, _j, _len, _len1, _ref, _ref1;
    Book = Backbone.RelationalModel.extend({
      defaults: {
        name: 'untitled'
      },
      idAttribute: '_id'
    });
    Author = Backbone.RelationalModel.extend({
      defaults: {
        name: 'untitled'
      },
      idAttribute: '_id',
      relations: [
        {
          type: 'HasMany',
          key: 'books',
          relatedModel: Book,
          includeInJSON: '_id',
          reverseRelation: {
            key: 'author',
            includeInJSON: '_id'
          }
        }
      ]
    });
    BookStore = Backbone.RelationalModel.extend({
      relations: [
        {
          type: 'HasMany',
          key: 'books',
          relatedModel: Book
        }, {
          type: 'HasMany',
          key: 'authors',
          relatedModel: Author
        }
      ]
    });
    bs = new BookStore({
      books: [
        {
          _id: "b1",
          name: "Book One",
          author: "a1"
        }, {
          _id: "b2",
          name: "Book Two",
          author: "a1"
        }
      ],
      authors: [
        {
          name: 'fred',
          _id: "a1"
        }, {
          name: 'ted',
          _id: "a2"
        }
      ]
    });
    BookViewModel = kb.ViewModel.extend({
      constructor: function(model) {
        kb.ViewModel.prototype.constructor.apply(this, arguments);
        this.editMode = ko.observable();
        this.edit = (function(_this) {
          return function() {
            model._save = model.toJSON();
            return _this.editMode(true);
          };
        })(this);
        this.confirm = (function(_this) {
          return function() {
            model._save = null;
            return _this.editMode(false);
          };
        })(this);
        this.cancel = (function(_this) {
          return function() {
            model.set(model._save);
            return _this.editMode(false);
          };
        })(this);
        return this;
      }
    });
    view_model = {
      books: kb.collectionObservable(bs.get('books'), {
        factories: {
          models: BookViewModel,
          'models.author.books.models': BookViewModel
        }
      })
    };
    _ref = view_model.books();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      book = _ref[_i];
      author = book.author();
      _ref1 = author.books();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        authored_book = _ref1[_j];
        authored_book.editMode(true);
        assert.equal(authored_book.editMode(), true, 'edit mode set');
      }
    }
    return done();
  });
  it('6. Inferring observable types: from the start', function(done) {
    var house, person1, person2, view_model_house1, view_model_person1;
    kb.statistics = new kb.Statistics();
    person1 = new Person({
      id: 'person-6-1',
      name: 'Daddy'
    });
    person2 = new Person({
      id: 'person-6-2',
      name: 'Mommy'
    });
    house = new Building({
      id: 'house-6-1',
      name: 'Home Sweet Home',
      occupants: ['person-6-1', 'person-6-2']
    });
    person1.get('friends').add(person2);
    person2.set({
      best_friend: person1
    });
    view_model_person1 = kb.viewModel(person1);
    view_model_house1 = kb.viewModel(house);
    assert.equal(view_model_person1.friends().length, 1, 'person1 has one friend');
    assert.equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy');
    assert.equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy');
    assert.equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    assert.equal(view_model_house1.occupants().length, 2, 'house has two occupants');
    assert.equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it');
    kb.release(view_model_person1);
    kb.release(view_model_house1);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('7a. Inferring observable types: late binding', function(done) {
    var house, person1, person2, view_model_house1, view_model_person1;
    kb.statistics = new kb.Statistics();
    person1 = new Person({
      id: 'person-7-1',
      name: 'Daddy'
    });
    person2 = new Person({
      id: 'person-7-2',
      name: 'Mommy'
    });
    house = new Building({
      id: 'house-7-1',
      name: 'Home Sweet Home'
    });
    view_model_person1 = kb.viewModel(person1);
    view_model_house1 = kb.viewModel(house);
    assert.equal(view_model_person1.name(), 'Daddy', 'person1 name is Daddy');
    assert.equal(view_model_person1.friends().length, 0, 'person1 has no friends');
    assert.equal(view_model_person1.best_friends_with_me().length, 0, 'person1 has not best_friends');
    assert.equal(view_model_house1.occupants().length, 0, 'house has no occupants');
    person1.get('friends').add(person2);
    person2.set({
      best_friend: person1
    });
    assert.equal(view_model_person1.friends().length, 1, 'person1 has one friend');
    assert.equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy');
    assert.equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy');
    house.get('occupants').add(person1);
    house.get('occupants').add(person2);
    assert.equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    assert.equal(view_model_house1.occupants().length, 2, 'house has two occupants');
    assert.equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it');
    kb.release(view_model_person1);
    kb.release(view_model_house1);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('7b. Inferring observable types: late binding (attribute setting)', function(done) {
    var friends, house, occupants, person1, person2, view_model_house1, view_model_person1;
    kb.statistics = new kb.Statistics();
    person1 = new Person({
      id: 'person-7b-1',
      name: 'Daddy'
    });
    person2 = new Person({
      id: 'person-7b-2',
      name: 'Mommy'
    });
    house = new Building({
      id: 'house-7b-1',
      name: 'Home Sweet Home'
    });
    view_model_person1 = kb.viewModel(person1);
    view_model_house1 = kb.viewModel(house);
    assert.equal(view_model_person1.name(), 'Daddy', 'person1 name is Daddy');
    assert.equal(view_model_person1.friends().length, 0, 'person1 has no friends');
    assert.equal(view_model_person1.best_friends_with_me().length, 0, 'person1 has not best_friends');
    assert.equal(view_model_house1.occupants().length, 0, 'house has no occupants');
    friends = _.clone(person1.get('friends').models);
    friends.push(person2);
    person1.set({
      friends: friends
    });
    person2.set({
      best_friend: person1
    });
    assert.equal(view_model_person1.friends().length, 1, 'person1 has one friend');
    assert.equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy');
    assert.equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy');
    occupants = _.clone(house.get('occupants').models);
    occupants.push(person1);
    occupants.push(person2);
    house.set({
      occupants: occupants
    });
    assert.equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    assert.equal(view_model_house1.occupants().length, 2, 'house has two occupants');
    assert.equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it');
    kb.release(view_model_person1);
    kb.release(view_model_house1);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('8a. Customizing observable types: from the start', function(done) {
    var BestFriendViewModel, FriendViewModel, HouseViewModel, PersonViewModel, co_family, family, house, person1, person2, view_model_house1, view_model_person1, view_model_person2;
    kb.statistics = new kb.Statistics();
    FriendViewModel = (function(_super) {
      __extends(FriendViewModel, _super);

      function FriendViewModel() {
        return FriendViewModel.__super__.constructor.apply(this, arguments);
      }

      return FriendViewModel;

    })(kb.ViewModel);
    BestFriendViewModel = (function(_super) {
      __extends(BestFriendViewModel, _super);

      function BestFriendViewModel() {
        return BestFriendViewModel.__super__.constructor.apply(this, arguments);
      }

      return BestFriendViewModel;

    })(kb.ViewModel);
    PersonViewModel = (function(_super) {
      __extends(PersonViewModel, _super);

      function PersonViewModel(model, options) {
        PersonViewModel.__super__.constructor.call(this, model, {
          factories: {
            'friends.models': FriendViewModel,
            'best_friend': BestFriendViewModel,
            'occupies': HouseViewModel
          },
          options: options
        });
      }

      return PersonViewModel;

    })(kb.ViewModel);
    HouseViewModel = (function(_super) {
      __extends(HouseViewModel, _super);

      function HouseViewModel(model, options) {
        HouseViewModel.__super__.constructor.call(this, model, {
          factories: {
            'occupants.models': PersonViewModel
          },
          options: options
        });
      }

      return HouseViewModel;

    })(kb.ViewModel);
    person1 = new Person({
      id: 'person-8-1',
      name: 'Daddy'
    });
    person2 = new Person({
      id: 'person-8-2',
      name: 'Mommy'
    });
    family = new kb.Collection([person1, person2]);
    house = new Building({
      id: 'house-8-1',
      name: 'Home Sweet Home',
      occupants: ['person-8-1', 'person-8-2']
    });
    person1.get('friends').add(person2);
    person2.set({
      best_friend: person1
    });
    view_model_person1 = new PersonViewModel(person1);
    view_model_person2 = new PersonViewModel(person2);
    co_family = kb.collectionObservable(family, {
      view_model: PersonViewModel
    });
    view_model_house1 = new HouseViewModel(house);
    assert.equal(view_model_person1.friends().length, 1, 'person1 has one friend');
    assert.ok(view_model_person1.friends()[0] instanceof FriendViewModel, 'person1 is friends are FriendViewModel');
    assert.equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy');
    assert.equal(view_model_person1.best_friends_with_me().length, 1, 'person1 has one best friends');
    assert.equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy');
    assert.ok(view_model_person2.best_friend() instanceof BestFriendViewModel, 'person2 is best friends are BestFriendViewModel');
    assert.equal(view_model_person2.best_friend().name(), 'Daddy', 'person2 is best friends with Daddy');
    assert.ok(view_model_person2.occupies() instanceof HouseViewModel, 'person2 is occupies HouseViewModel');
    assert.equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    assert.equal(view_model_house1.occupants().length, 2, 'house has two occupants');
    assert.ok(view_model_house1.occupants()[0] instanceof PersonViewModel, 'house has PersonViewModel in it');
    assert.equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it');
    assert.ok(view_model_house1.occupants()[0].occupies() instanceof HouseViewModel, 'person1 occupies has HouseViewModel');
    assert.equal(view_model_house1.occupants()[0].occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    kb.release(view_model_person1);
    kb.release(view_model_person2);
    kb.release(co_family);
    kb.release(view_model_house1);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('8b. Customizing observable types: from the start (attribute setting)', function(done) {
    var BestFriendViewModel, FriendViewModel, HouseViewModel, PersonViewModel, co_family, family, friends, house, person1, person2, view_model_house1, view_model_person1, view_model_person2;
    kb.statistics = new kb.Statistics();
    FriendViewModel = (function(_super) {
      __extends(FriendViewModel, _super);

      function FriendViewModel() {
        return FriendViewModel.__super__.constructor.apply(this, arguments);
      }

      return FriendViewModel;

    })(kb.ViewModel);
    BestFriendViewModel = (function(_super) {
      __extends(BestFriendViewModel, _super);

      function BestFriendViewModel() {
        return BestFriendViewModel.__super__.constructor.apply(this, arguments);
      }

      return BestFriendViewModel;

    })(kb.ViewModel);
    PersonViewModel = (function(_super) {
      __extends(PersonViewModel, _super);

      function PersonViewModel(model, options) {
        PersonViewModel.__super__.constructor.call(this, model, {
          factories: {
            'friends.models': FriendViewModel,
            'best_friend': BestFriendViewModel,
            'occupies': HouseViewModel
          },
          options: options
        });
      }

      return PersonViewModel;

    })(kb.ViewModel);
    HouseViewModel = (function(_super) {
      __extends(HouseViewModel, _super);

      function HouseViewModel(model, options) {
        HouseViewModel.__super__.constructor.call(this, model, {
          factories: {
            'occupants.models': PersonViewModel
          },
          options: options
        });
      }

      return HouseViewModel;

    })(kb.ViewModel);
    person1 = new Person({
      id: 'person-8b-1',
      name: 'Daddy'
    });
    person2 = new Person({
      id: 'person-8b-2',
      name: 'Mommy'
    });
    family = new kb.Collection([person1, person2]);
    house = new Building({
      id: 'house-8b-1',
      name: 'Home Sweet Home',
      occupants: [person1.toJSON()]
    });
    house.set({
      occupants: [person1.toJSON(), person2.toJSON()]
    });
    friends = _.clone(person1.get('friends').models);
    friends.push(person2);
    person1.set({
      friends: friends
    });
    person2.set({
      best_friend: person1
    });
    view_model_person1 = new PersonViewModel(person1);
    view_model_person2 = new PersonViewModel(person2);
    co_family = kb.collectionObservable(family, {
      view_model: PersonViewModel
    });
    view_model_house1 = new HouseViewModel(house);
    assert.equal(view_model_person1.friends().length, 1, 'person1 has one friend');
    assert.ok(view_model_person1.friends()[0] instanceof FriendViewModel, 'person1 is friends are FriendViewModel');
    assert.equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy');
    assert.equal(view_model_person1.best_friends_with_me().length, 1, 'person1 has one best friends');
    assert.equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy');
    assert.ok(view_model_person2.best_friend() instanceof BestFriendViewModel, 'person2 is best friends are BestFriendViewModel');
    assert.equal(view_model_person2.best_friend().name(), 'Daddy', 'person2 is best friends with Daddy');
    assert.ok(view_model_person2.occupies() instanceof HouseViewModel, 'person2 is occupies HouseViewModel');
    assert.equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    assert.equal(view_model_house1.occupants().length, 2, 'house has two occupants');
    assert.ok(view_model_house1.occupants()[0] instanceof PersonViewModel, 'house has PersonViewModel in it');
    assert.equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it');
    assert.ok(view_model_house1.occupants()[0].occupies() instanceof HouseViewModel, 'person1 occupies has HouseViewModel');
    assert.equal(view_model_house1.occupants()[0].occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    kb.release(view_model_person1);
    kb.release(view_model_person2);
    kb.release(co_family);
    kb.release(view_model_house1);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('9a. Customizing observable types: late binding', function(done) {
    var BestFriendViewModel, FriendViewModel, HouseViewModel, PersonViewModel, co_family, family, house, person1, person2, view_model_house1, view_model_person1, view_model_person2;
    kb.statistics = new kb.Statistics();
    FriendViewModel = (function(_super) {
      __extends(FriendViewModel, _super);

      function FriendViewModel() {
        return FriendViewModel.__super__.constructor.apply(this, arguments);
      }

      return FriendViewModel;

    })(kb.ViewModel);
    BestFriendViewModel = (function(_super) {
      __extends(BestFriendViewModel, _super);

      function BestFriendViewModel() {
        return BestFriendViewModel.__super__.constructor.apply(this, arguments);
      }

      return BestFriendViewModel;

    })(kb.ViewModel);
    PersonViewModel = (function(_super) {
      __extends(PersonViewModel, _super);

      function PersonViewModel(model, options) {
        PersonViewModel.__super__.constructor.call(this, model, {
          factories: {
            'friends.models': FriendViewModel,
            'best_friend': BestFriendViewModel,
            'occupies': HouseViewModel
          },
          options: options
        });
      }

      return PersonViewModel;

    })(kb.ViewModel);
    HouseViewModel = (function(_super) {
      __extends(HouseViewModel, _super);

      function HouseViewModel(model, options) {
        HouseViewModel.__super__.constructor.call(this, model, {
          factories: {
            'occupants.models': PersonViewModel
          },
          options: options
        });
      }

      return HouseViewModel;

    })(kb.ViewModel);
    person1 = new Person({
      id: 'person-9-1',
      name: 'Daddy'
    });
    person2 = new Person({
      id: 'person-9-2',
      name: 'Mommy'
    });
    family = new kb.Collection([person1, person2]);
    house = new Building({
      id: 'house-9-1',
      name: 'Home Sweet Home'
    });
    view_model_person1 = new PersonViewModel(person1);
    view_model_person2 = new PersonViewModel(person2);
    co_family = kb.collectionObservable(family, {
      view_model: PersonViewModel
    });
    view_model_house1 = new HouseViewModel(house);
    assert.equal(view_model_person1.friends().length, 0, 'person1 has no friends');
    assert.equal(view_model_person1.best_friends_with_me().length, 0, 'person1 has no best friends');
    assert.ok(view_model_person2.best_friend() instanceof BestFriendViewModel, 'person2 is best friends are BestFriendViewModel');
    assert.ok(view_model_person2.occupies() instanceof HouseViewModel, 'person2 is occupies HouseViewModel');
    assert.equal(view_model_house1.occupants().length, 0, 'house has no occupants');
    person1.get('friends').add(person2);
    person2.set({
      best_friend: person1
    });
    assert.equal(view_model_person1.friends().length, 1, 'person1 has one friend');
    assert.ok(view_model_person1.friends()[0] instanceof FriendViewModel, 'person1 is friends are FriendViewModel');
    assert.equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy');
    assert.equal(view_model_person1.best_friends_with_me().length, 1, 'person1 has one best friends');
    assert.equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy');
    assert.ok(view_model_person2.best_friend() instanceof BestFriendViewModel, 'person2 is best friends are BestFriendViewModel');
    assert.equal(view_model_person2.best_friend().name(), 'Daddy', 'person2 is best friends with Daddy');
    assert.ok(view_model_person2.occupies() instanceof HouseViewModel, 'person2 is occupies HouseViewModel');
    house.get('occupants').add(person1);
    house.get('occupants').add(person2);
    assert.equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    assert.equal(view_model_house1.occupants().length, 2, 'house has two occupants');
    assert.ok(view_model_house1.occupants()[0] instanceof PersonViewModel, 'house has PersonViewModel in it');
    assert.equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it');
    assert.ok(view_model_house1.occupants()[0].occupies() instanceof HouseViewModel, 'person1 occupies has HouseViewModel');
    assert.equal(view_model_house1.occupants()[0].occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    kb.release(view_model_person1);
    kb.release(view_model_person2);
    kb.release(co_family);
    kb.release(view_model_house1);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('9b. Customizing observable types: late binding (atrributes setting)', function(done) {
    var BestFriendViewModel, FriendViewModel, HouseViewModel, PersonViewModel, co_family, family, friends, house, occupants, person1, person2, view_model_house1, view_model_person1, view_model_person2;
    kb.statistics = new kb.Statistics();
    FriendViewModel = (function(_super) {
      __extends(FriendViewModel, _super);

      function FriendViewModel() {
        return FriendViewModel.__super__.constructor.apply(this, arguments);
      }

      return FriendViewModel;

    })(kb.ViewModel);
    BestFriendViewModel = (function(_super) {
      __extends(BestFriendViewModel, _super);

      function BestFriendViewModel() {
        return BestFriendViewModel.__super__.constructor.apply(this, arguments);
      }

      return BestFriendViewModel;

    })(kb.ViewModel);
    PersonViewModel = (function(_super) {
      __extends(PersonViewModel, _super);

      function PersonViewModel(model, options) {
        PersonViewModel.__super__.constructor.call(this, model, {
          factories: {
            'friends.models': FriendViewModel,
            'best_friend': BestFriendViewModel,
            'occupies': HouseViewModel
          },
          options: options
        });
      }

      return PersonViewModel;

    })(kb.ViewModel);
    HouseViewModel = (function(_super) {
      __extends(HouseViewModel, _super);

      function HouseViewModel(model, options) {
        HouseViewModel.__super__.constructor.call(this, model, {
          factories: {
            'occupants.models': PersonViewModel
          },
          options: options
        });
      }

      return HouseViewModel;

    })(kb.ViewModel);
    person1 = new Person({
      id: 'person-9b-1',
      name: 'Daddy'
    });
    person2 = new Person({
      id: 'person-9b-2',
      name: 'Mommy'
    });
    family = new kb.Collection([person1, person2]);
    house = new Building({
      id: 'house-9b-1',
      name: 'Home Sweet Home'
    });
    view_model_person1 = new PersonViewModel(person1);
    view_model_person2 = new PersonViewModel(person2);
    co_family = kb.collectionObservable(family, {
      view_model: PersonViewModel
    });
    view_model_house1 = new HouseViewModel(house);
    assert.equal(view_model_person1.friends().length, 0, 'person1 has no friends');
    assert.equal(view_model_person1.best_friends_with_me().length, 0, 'person1 has no best friends');
    assert.ok(view_model_person2.best_friend() instanceof BestFriendViewModel, 'person2 is best friends are BestFriendViewModel');
    assert.ok(view_model_person2.occupies() instanceof HouseViewModel, 'person2 is occupies HouseViewModel');
    assert.equal(view_model_house1.occupants().length, 0, 'house has no occupants');
    friends = _.clone(person1.get('friends').models);
    friends.push(person2);
    person1.set({
      friends: friends
    });
    person2.set({
      best_friend: person1
    });
    assert.equal(view_model_person1.friends().length, 1, 'person1 has one friend');
    assert.ok(view_model_person1.friends()[0] instanceof FriendViewModel, 'person1 is friends are FriendViewModel');
    assert.equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy');
    assert.equal(view_model_person1.best_friends_with_me().length, 1, 'person1 has one best friends');
    assert.equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy');
    assert.ok(view_model_person2.best_friend() instanceof BestFriendViewModel, 'person2 is best friends are BestFriendViewModel');
    assert.equal(view_model_person2.best_friend().name(), 'Daddy', 'person2 is best friends with Daddy');
    assert.ok(view_model_person2.occupies() instanceof HouseViewModel, 'person2 is occupies HouseViewModel');
    occupants = _.clone(house.get('occupants').models);
    occupants.push(person1);
    occupants.push(person2);
    house.set({
      occupants: occupants
    });
    assert.equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    assert.equal(view_model_house1.occupants().length, 2, 'house has two occupants');
    assert.ok(view_model_house1.occupants()[0] instanceof PersonViewModel, 'house has PersonViewModel in it');
    assert.equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it');
    assert.ok(view_model_house1.occupants()[0].occupies() instanceof HouseViewModel, 'person1 occupies has HouseViewModel');
    assert.equal(view_model_house1.occupants()[0].occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home');
    kb.release(view_model_person1);
    kb.release(view_model_person2);
    kb.release(co_family);
    kb.release(view_model_house1);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('10. Nested custom view models', function(done) {
    var BandMemberViewModel, BestFriendViewModel, FriendViewModel, collection_observable, george, john, paul, ringo, validateBandMember, validateBestFriend, validateFriend, validateFriends;
    kb.statistics = new kb.Statistics();
    george = new Person({
      id: 'person-10-3',
      name: 'George',
      friends: ['person-10-1', 'person-10-2', 'person-10-4']
    });
    john = new Person({
      id: 'person-10-1',
      name: 'John',
      friends: ['person-10-2', 'person-10-3', 'person-10-4'],
      best_friend: george
    });
    george.set({
      best_friend: john
    });
    paul = new Person({
      id: 'person-10-2',
      name: 'Paul',
      friends: ['person-10-1', 'person-10-3', 'person-10-4'],
      best_friend: george
    });
    ringo = new Person({
      id: 'person-10-4',
      name: 'Ringo',
      friends: ['person-10-1', 'person-10-2', 'person-10-3']
    });
    FriendViewModel = function(model) {
      this.name = kb.observable(model, 'name');
      this.type = ko.observable('friend');
      return this;
    };
    BestFriendViewModel = function(model) {
      this.name = kb.observable(model, 'name');
      this.type = ko.observable('best_friend');
      return this;
    };
    BandMemberViewModel = (function(_super) {
      __extends(BandMemberViewModel, _super);

      function BandMemberViewModel(model, options) {
        BandMemberViewModel.__super__.constructor.apply(this, arguments);
        this.type = ko.observable('band_member');
      }

      return BandMemberViewModel;

    })(kb.ViewModel);
    collection_observable = kb.collectionObservable(new kb.Collection([john, paul, george, ringo]), {
      factories: {
        models: BandMemberViewModel,
        'models.best_friend': {
          create: function(model, options) {
            if (model) {
              return new BestFriendViewModel(model);
            } else {
              return null;
            }
          }
        },
        'models.friends.models': FriendViewModel
      }
    });
    validateFriends = function(co, names) {
      var found, name, vm, _i, _j, _len, _len1, _ref;
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        found = false;
        _ref = co();
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          vm = _ref[_j];
          if (vm.name && vm.name() === name) {
            found = true;
            validateFriend(vm, name);
          }
        }
        assert.ok(found, "" + name + " was found");
      }
    };
    validateFriend = function(vm, name) {
      assert.equal(vm.type(), 'friend', "friend type matches for " + name);
      return assert.equal(vm.name(), name, "friend name matches for " + name);
    };
    validateBestFriend = function(vm, name) {
      assert.equal(vm.type(), 'best_friend', "best friend type matches for " + name);
      return assert.equal(vm.name(), name, "best friend name matches for " + name);
    };
    validateBandMember = function(vm, name) {
      assert.equal(vm.type(), 'band_member', "band member type matches for " + name);
      assert.ok(vm instanceof BandMemberViewModel, "band member type matches for " + name);
      return assert.equal(vm.name(), name, "band member name matches for " + name);
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
    kb.release(collection_observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('11. Minimum factory tree for shared dependent models', function(done) {
    var collection_observable1, collection_observable2, george, john, paul, ringo, view_model_george, view_model_george_john, view_model_john, view_model_paul, view_model_ringo;
    kb.statistics = new kb.Statistics();
    george = new Person({
      id: 'person-11-3',
      name: 'George',
      friends: ['person-11-1', 'person-11-2', 'person-11-4']
    });
    john = new Person({
      id: 'person-11-1',
      name: 'John',
      friends: ['person-11-2', 'person-11-3', 'person-11-4']
    });
    paul = new Person({
      id: 'person-11-2',
      name: 'Paul',
      friends: ['person-11-1', 'person-11-3', 'person-11-4']
    });
    ringo = new Person({
      id: 'person-11-4',
      name: 'Ringo',
      friends: ['person-11-1', 'person-11-2', 'person-11-3']
    });
    window.PersonViewModel = (function(_super) {
      __extends(PersonViewModel, _super);

      function PersonViewModel(model, options) {
        PersonViewModel.__super__.constructor.call(this, model, {
          factories: {
            'friends': PersonCollection,
            'best_friend': PersonViewModel,
            'best_friends_with_me': PersonViewModel
          },
          options: options
        });
      }

      return PersonViewModel;

    })(kb.ViewModel);
    window.PersonCollection = (function(_super) {
      __extends(PersonCollection, _super);

      function PersonCollection(collection, options) {
        return PersonCollection.__super__.constructor.call(this, collection, {
          factories: {
            'models': PersonViewModel
          },
          options: options
        });
      }

      return PersonCollection;

    })(kb.CollectionObservable);
    collection_observable1 = new PersonCollection(new kb.Collection([george, john, paul, ringo]));
    collection_observable2 = new PersonCollection(new kb.Collection([george, john, paul, ringo]), collection_observable1.shareOptions());
    assert.equal(collection_observable1.__kb.factory, collection_observable2.__kb.factory, "the factory should be shared");
    kb.release([collection_observable1, collection_observable2]);
    view_model_george = new PersonViewModel(george);
    view_model_john = new PersonViewModel(john, view_model_george.shareOptions());
    view_model_paul = new PersonViewModel(john, view_model_john.shareOptions());
    view_model_ringo = new PersonViewModel(ringo, view_model_paul.shareOptions());
    view_model_george_john = view_model_george.friends()[0];
    assert.equal(view_model_george.__kb.factory, view_model_george_john.__kb.factory.parent_factory.parent_factory, "the factory should be shared: george");
    assert.equal(view_model_george.__kb.factory, view_model_john.__kb.factory, "the factory should be shared: john");
    assert.equal(view_model_george.__kb.factory, view_model_paul.__kb.factory, "the factory should be shared: paul");
    assert.equal(view_model_george.__kb.factory, view_model_ringo.__kb.factory, "the factory should be shared: ringo");
    kb.release([view_model_george, view_model_john, view_model_paul, view_model_ringo]);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  return it('12. Issue 96', function(done) {
    var BooleanParameterViewModel, Filter, FilterGroup, FilterGroupViewModel, FilterViewModel, Parameter, ParameterCollection, ParameterFactory, StringParameterViewModel, filter, filter_group, filter_group_model, parameter_models, parameters;
    kb.statistics = new kb.Statistics();
    Parameter = Backbone.RelationalModel.extend({
      idAttribute: "ParameterName"
    });
    ParameterCollection = Backbone.Collection.extend({
      model: Parameter
    });
    Filter = Backbone.RelationalModel.extend({
      relations: [
        {
          type: Backbone.HasOne,
          key: "Parameter",
          keySource: "ParameterName",
          relatedModel: Parameter,
          includeInJSON: "ParameterName",
          reverseRelation: {
            key: "Filters",
            type: Backbone.HasMany,
            includeInJSON: false
          }
        }
      ]
    });
    StringParameterViewModel = (function(_super) {
      __extends(StringParameterViewModel, _super);

      function StringParameterViewModel() {
        return StringParameterViewModel.__super__.constructor.apply(this, arguments);
      }

      return StringParameterViewModel;

    })(kb.ViewModel);
    BooleanParameterViewModel = (function(_super) {
      __extends(BooleanParameterViewModel, _super);

      function BooleanParameterViewModel() {
        return BooleanParameterViewModel.__super__.constructor.apply(this, arguments);
      }

      return BooleanParameterViewModel;

    })(kb.ViewModel);
    ParameterFactory = {
      create: function(parameter, options) {
        switch (parameter.get("Type")) {
          case 0:
            return new StringParameterViewModel(parameter, options);
          case 1:
            return new BooleanParameterViewModel(parameter, options);
          default:
            throw "Invalid parameter type attribute.";
        }
      }
    };
    parameter_models = new ParameterCollection();
    parameters = kb.collectionObservable(parameter_models, {
      factories: {
        "models": ParameterFactory
      }
    });
    parameter_models.push({
      Type: 0
    });
    parameter_models.push({
      Type: 1
    });
    assert.ok(parameters()[0] instanceof StringParameterViewModel);
    assert.ok(parameters()[1] instanceof BooleanParameterViewModel);
    kb.release(parameters);
    FilterGroup = Backbone.RelationalModel.extend({
      relations: [
        {
          type: Backbone.HasMany,
          key: "Filters",
          relatedModel: Filter
        }
      ]
    });
    FilterViewModel = (function(_super) {
      __extends(FilterViewModel, _super);

      function FilterViewModel() {
        return FilterViewModel.__super__.constructor.apply(this, arguments);
      }

      return FilterViewModel;

    })(kb.ViewModel);
    FilterGroupViewModel = (function(_super) {
      __extends(FilterGroupViewModel, _super);

      function FilterGroupViewModel(model, options) {
        FilterGroupViewModel.__super__.constructor.call(this, model, {
          factories: {
            "Filters.models": FilterViewModel,
            "Filters.models.Parameter": ParameterFactory
          },
          options: options
        });
      }

      return FilterGroupViewModel;

    })(kb.ViewModel);
    filter_group_model = new FilterGroup({
      Filters: [
        {
          Name: 'String',
          Parameter: {
            Type: 0
          }
        }, {
          Name: 'Boolean',
          Parameter: {
            Type: 1
          }
        }
      ]
    });
    if (!filter_group_model.get('Filters').models[0].get('Parameter')) {
      assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
      kb.statistics = null;
      return done();
    }
    filter_group = new FilterGroupViewModel(filter_group_model);
    filter = filter_group.Filters()[0];
    assert.equal(filter.Name(), 'String');
    assert.ok(filter.Parameter() instanceof StringParameterViewModel);
    filter = filter_group.Filters()[1];
    assert.equal(filter.Name(), 'Boolean');
    assert.ok(filter.Parameter() instanceof BooleanParameterViewModel);
    kb.release(filter_group);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
});
