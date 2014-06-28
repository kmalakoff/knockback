var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

describe('Knockback.js with Backbone Supermodel', function() {
  var Backbone, Supermodel, kb, ko, _;
  _ = window._ || (typeof require === "function" ? require('underscore') : void 0);
  Backbone = window.Backbone || (typeof require === "function" ? require('backbone') : void 0);
  Supermodel = window.Supermodel || (typeof require === "function" ? require('supermodel') : void 0);
  ko = window.ko || (typeof require === "function" ? require('knockout') : void 0);
  kb = window.kb || (typeof require === "function" ? require('knockback') : void 0);
  it('TEST DEPENDENCY MISSING', function(done) {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!Backbone, 'Backbone');
    assert.ok(!!kb, 'kb');
    assert.ok(!!Supermodel, 'Supermodel');
    assert.ok(!!kb, 'kb');
    return done();
  });
  window.Person = Supermodel.Model.extend({});
  window.BestFriends = Supermodel.Model.extend({});
  window.Building = Supermodel.Model.extend({});
  Person.has().many('friends', {
    model: Person,
    inverse: 'friends_with_me',
    collection: Backbone.Collection
  }).many('friends_with_me', {
    model: Person,
    inverse: 'friends',
    collection: Backbone.Collection
  }).one('occupies', {
    model: Building,
    inverse: 'occupants'
  }).one('best_friend', {
    model: Person,
    inverse: 'best_friends_with_me'
  }).many('best_friends_with_me', {
    model: Person,
    inverse: 'best_friend',
    collection: Backbone.Collection
  });
  Building.has().many('occupants', {
    model: Person,
    inverse: 'occupies',
    collection: Backbone.Collection
  });
  it('1. Model with HasMany relations: A house with multiple people living in it', function(done) {
    var house_view_model, john, occupant_observable, occupant_observable2, our_house, paul, _i, _j, _len, _len1, _ref, _ref1;
    kb.statistics = new kb.Statistics();
    john = Person.create({
      id: 'person-1-1',
      name: 'John'
    });
    paul = Person.create({
      id: 'person-1-2',
      name: 'Paul'
    });
    our_house = Building.create({
      id: 'house-1-1',
      location: 'in the middle of the street'
    });
    our_house.occupants().reset([john, paul]);
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
    john = Person.create({
      id: 'person-2-1',
      name: 'John'
    });
    paul = Person.create({
      id: 'person-2-2',
      name: 'Paul'
    });
    george = Person.create({
      id: 'person-2-3',
      name: 'George'
    });
    ringo = Person.create({
      id: 'person-2-4',
      name: 'Ringo'
    });
    abbey_flats = Building.create({
      id: 'house-2-1',
      location: 'one side of the street'
    });
    abbey_flats.occupants().reset([john, paul, george, ringo]);
    abbey_studios = Building.create({
      id: 'studio-2-2',
      location: 'the other side of the street'
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
    abbey_studios.occupants().add(john);
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
    george = Person.create({
      id: 'person-3-3',
      name: 'George'
    });
    john = Person.create({
      id: 'person-3-1',
      name: 'John'
    });
    george.best_friend(john);
    paul = Person.create({
      id: 'person-3-2',
      name: 'Paul'
    });
    ringo = Person.create({
      id: 'person-3-4',
      name: 'Ringo'
    });
    george.friends().reset([john, paul, ringo]);
    john.friends().reset([paul, george, ringo]);
    john.best_friend(george);
    paul.friends().reset([john, george, ringo]);
    paul.best_friend(george);
    ringo.friends().reset([john, paul, george]);
    john_view_model = new kb.ViewModel(john);
    assert.equal(john_view_model.name(), 'John', "Name is correct");
    _ref = john_view_model.friends();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      friend = _ref[_i];
      assert.ok(_.contains(['Paul', 'George', 'Ringo'], friend.name()), 'Expected name');
    }
    assert.equal(john_view_model.best_friend().name(), 'George', 'Expected name');
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
    kb.release(george_view_model);
    george_view_model = null;
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('4. After view model create, add models', function(done) {
    var House, Occupant, bob, fred, house, occupants_relationship, view_model;
    Occupant = Supermodel.Model.extend({});
    House = Supermodel.Model.extend({});
    House.has().many('occupants', {
      model: Occupant,
      inverse: 'livesIn',
      collection: Backbone.Collection
    });
    Occupant.has().one('livesIn', {
      model: House,
      inverse: 'occupants'
    });
    bob = Occupant.create({
      id: 'person-1',
      name: 'Bob'
    });
    fred = Occupant.create({
      id: 'person-2',
      name: 'Fred'
    });
    house = House.create({
      location: 'In the middle of our street'
    });
    view_model = kb.viewModel(house);
    assert.equal(view_model.occupants().length, 0, "no occupants");
    occupants_relationship = house.occupants();
    occupants_relationship.add(bob);
    occupants_relationship.add(fred);
    assert.equal(view_model.occupants().length, 2, 'two occupants');
    assert.equal(view_model.occupants()[0].name(), 'Bob', 'Bob is in the view model relationship');
    assert.equal(view_model.occupants()[1].name(), 'Fred', 'Fred is in the view model relationship');
    return done();
  });
  it('6. Inferring observable types: from the start', function(done) {
    var house, person1, person2, view_model_house1, view_model_person1;
    kb.statistics = new kb.Statistics();
    person1 = Person.create({
      id: 'person-6-1',
      name: 'Daddy'
    });
    person2 = Person.create({
      id: 'person-6-2',
      name: 'Mommy'
    });
    house = Building.create({
      id: 'house-6-1',
      name: 'Home Sweet Home'
    });
    house.occupants().reset([person1, person2]);
    person1.friends().add(person2);
    person2.best_friend(person1);
    view_model_person1 = kb.viewModel(person1);
    view_model_house1 = kb.viewModel(house);
    assert.equal(view_model_person1.friends().length, 1, 'person1 has one friend');
    assert.equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy');
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
    person1 = Person.create({
      id: 'person-7-1',
      name: 'Daddy'
    });
    person2 = Person.create({
      id: 'person-7-2',
      name: 'Mommy'
    });
    house = Building.create({
      id: 'house-7-1',
      name: 'Home Sweet Home'
    });
    view_model_person1 = kb.viewModel(person1);
    view_model_house1 = kb.viewModel(house);
    assert.equal(view_model_person1.name(), 'Daddy', 'person1 name is Daddy');
    assert.equal(view_model_person1.friends().length, 0, 'person1 has no friends');
    assert.equal(view_model_house1.occupants().length, 0, 'house has no occupants');
    person1.friends().add(person2);
    person2.best_friend(person1);
    assert.equal(view_model_person1.friends().length, 1, 'person1 has one friend');
    assert.equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy');
    house.occupants().add(person1);
    house.occupants().add(person2);
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
    person1 = Person.create({
      id: 'person-8-1',
      name: 'Daddy'
    });
    person2 = Person.create({
      id: 'person-8-2',
      name: 'Mommy'
    });
    family = new kb.Collection([person1, person2]);
    house = Building.create({
      id: 'house-8-1',
      name: 'Home Sweet Home'
    });
    house.occupants().reset([person1, person2]);
    person1.friends().add(person2);
    person2.best_friend(person1);
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
    person1 = Person.create({
      id: 'person-9-1',
      name: 'Daddy'
    });
    person2 = Person.create({
      id: 'person-9-2',
      name: 'Mommy'
    });
    family = new kb.Collection([person1, person2]);
    house = Building.create({
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
    person1.friends().add(person2);
    person2.best_friend(person1);
    assert.equal(view_model_person1.friends().length, 1, 'person1 has one friend');
    assert.ok(view_model_person1.friends()[0] instanceof FriendViewModel, 'person1 is friends are FriendViewModel');
    assert.equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy');
    assert.equal(view_model_person1.best_friends_with_me().length, 1, 'person1 has one best friends');
    assert.equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy');
    assert.ok(view_model_person2.best_friend() instanceof BestFriendViewModel, 'person2 is best friends are BestFriendViewModel');
    assert.equal(view_model_person2.best_friend().name(), 'Daddy', 'person2 is best friends with Daddy');
    assert.ok(view_model_person2.occupies() instanceof HouseViewModel, 'person2 is occupies HouseViewModel');
    house.occupants().add(person1);
    house.occupants().add(person2);
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
    george = Person.create({
      id: 'person-10-3',
      name: 'George'
    });
    john = Person.create({
      id: 'person-10-1',
      name: 'John'
    });
    george.best_friend(john);
    paul = Person.create({
      id: 'person-10-2',
      name: 'Paul'
    });
    ringo = Person.create({
      id: 'person-10-4',
      name: 'Ringo'
    });
    george.friends().reset([john, paul, ringo]);
    john.friends().reset([paul, george, ringo]);
    john.best_friend(george);
    paul.friends().reset([john, george, ringo]);
    paul.best_friend(george);
    ringo.friends().reset([john, paul, george]);
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
  return it('11. Minimum factory tree for shared dependent models', function(done) {
    var collection_observable1, collection_observable2, george, john, paul, ringo, view_model_george, view_model_george_john, view_model_john, view_model_paul, view_model_ringo;
    kb.statistics = new kb.Statistics();
    george = Person.create({
      id: 'person-11-3',
      name: 'George'
    });
    john = Person.create({
      id: 'person-11-1',
      name: 'John'
    });
    george.best_friend(john);
    paul = Person.create({
      id: 'person-11-2',
      name: 'Paul'
    });
    ringo = Person.create({
      id: 'person-11-4',
      name: 'Ringo'
    });
    george.friends().reset([john, paul, ringo]);
    john.friends().reset([paul, george, ringo]);
    john.best_friend(george);
    paul.friends().reset([john, george, ringo]);
    paul.best_friend(george);
    ringo.friends().reset([john, paul, george]);
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
});
