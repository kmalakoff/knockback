var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
$(document).ready(function() {
  var Building, Person;
  module("knockback.js with Backbone-Relational.js");
  test("TEST DEPENDENCY MISSING", function() {
    ko.utils;
    _.VERSION;
    Backbone.VERSION;
    return Backbone.Relational.Semaphore;
  });
  Person = (function() {
    __extends(Person, Backbone.RelationalModel);
    function Person() {
      Person.__super__.constructor.apply(this, arguments);
    }
    Person.prototype.relations = [
      {
        type: Backbone.HasMany,
        key: 'friends',
        relatedModel: Person
      }, {
        type: Backbone.HasOne,
        key: 'best_friend',
        relatedModel: Person,
        reverseRelation: {
          type: Backbone.HasMany,
          key: 'best_friends_with_me'
        }
      }
    ];
    return Person;
  })();
  Building = (function() {
    __extends(Building, Backbone.RelationalModel);
    function Building() {
      Building.__super__.constructor.apply(this, arguments);
    }
    Building.prototype.relations = [
      {
        type: Backbone.HasMany,
        key: 'occupants',
        relatedModel: Person,
        reverseRelation: {
          type: Backbone.HasOne,
          key: 'occupies'
        }
      }
    ];
    return Building;
  })();
  test("1. Model with HasMany relations: A house with multiple people living in it", function() {
    var house_view_model, john, occupant_observable, occupant_observable2, our_house, paul, _i, _j, _len, _len2, _ref, _ref2;
    kb.stats_on = true;
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
    equal(house_view_model.location(), 'in the middle of the street', 'In the right place');
    equal(house_view_model.occupants().length, 2, 'Expected occupant count');
    _ref = house_view_model.occupants();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      occupant_observable = _ref[_i];
      ok(_.contains(['John', 'Paul'], occupant_observable.name()), 'Expected name');
      equal(occupant_observable.occupies().location(), 'in the middle of the street', 'Expected location');
      equal(occupant_observable.occupies().occupants().length, 2, "Excepted occupant count");
      _ref2 = occupant_observable.occupies().occupants();
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        occupant_observable2 = _ref2[_j];
        ok(_.contains(['John', 'Paul'], occupant_observable2.name()), 'Expected name');
        equal(occupant_observable2.occupies().location(), 'in the middle of the street', 'Expected location');
      }
    }
    equal(house_view_model.refCount(), 1, 'Expected references');
    kb.utils.release(house_view_model);
    equal(house_view_model.refCount(), 0, 'Expected references');
    equal(kb.stats.collection_observables, 0, 'Cleanup: no collection observables');
    equal(kb.stats.view_models, 0, 'Cleanup: no view models');
    return kb.stats_on = false;
  });
  test("2. Collection with models with HasMany relations: Multiple houses with multiple people living in them", function() {
    var abbey_flats, abbey_studios, george, john, occupant_observable, occupant_observable2, paul, place_view_model, places, places_observable, ringo, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _m, _n, _o, _p, _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
    kb.stats_on = true;
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
    places = new Backbone.Collection([abbey_flats, abbey_studios]);
    places_observable = kb.collectionObservable(places, {
      view_model: kb.ViewModel
    });
    _ref = places_observable();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      place_view_model = _ref[_i];
      if (place_view_model.id() === 'house-2-1') {
        equal(place_view_model.location(), 'one side of the street', 'In the right place');
        equal(place_view_model.occupants().length, 4, "Everyone is here");
        _ref2 = place_view_model.occupants();
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          occupant_observable = _ref2[_j];
          ok(_.contains(['John', 'Paul', 'George', 'Ringo'], occupant_observable.name()), 'Expected name');
          equal(occupant_observable.occupies().location(), 'one side of the street', 'Expected location');
          equal(occupant_observable.occupies().occupants().length, 4, "Everyone is here");
          _ref3 = occupant_observable.occupies().occupants();
          for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
            occupant_observable2 = _ref3[_k];
            ok(_.contains(['John', 'Paul', 'George', 'Ringo'], occupant_observable2.name()), 'Expected name');
            equal(occupant_observable2.occupies().location(), 'one side of the street', 'Expected location');
          }
        }
      } else {
        equal(place_view_model.location(), 'the other side of the street', 'In the right place');
        equal(place_view_model.occupants().length, 0, "No one is here");
      }
    }
    abbey_studios.get('occupants').add(john);
    _ref4 = places_observable();
    for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
      place_view_model = _ref4[_l];
      if (place_view_model.id() === 'house-2-1') {
        equal(place_view_model.location(), 'one side of the street', 'In the right place');
        equal(place_view_model.occupants().length, 3, "Almost everyone is here");
        _ref5 = place_view_model.occupants();
        for (_m = 0, _len5 = _ref5.length; _m < _len5; _m++) {
          occupant_observable = _ref5[_m];
          ok(_.contains(['Paul', 'George', 'Ringo'], occupant_observable.name()), 'Expected name');
          equal(occupant_observable.occupies().location(), 'one side of the street', 'Expected location');
          equal(occupant_observable.occupies().occupants().length, 3, "Almost everyone is here");
          _ref6 = occupant_observable.occupies().occupants();
          for (_n = 0, _len6 = _ref6.length; _n < _len6; _n++) {
            occupant_observable2 = _ref6[_n];
            ok(_.contains(['Paul', 'George', 'Ringo'], occupant_observable2.name()), 'Expected name');
            equal(occupant_observable2.occupies().location(), 'one side of the street', 'Expected location');
          }
        }
      } else {
        equal(place_view_model.location(), 'the other side of the street', 'In the right place');
        equal(place_view_model.occupants().length, 1, "In the studio");
        _ref7 = place_view_model.occupants();
        for (_o = 0, _len7 = _ref7.length; _o < _len7; _o++) {
          occupant_observable = _ref7[_o];
          equal(occupant_observable.name(), 'John', 'Expected name');
          equal(occupant_observable.occupies().location(), 'the other side of the street', 'Expected location');
          equal(occupant_observable.occupies().occupants().length, 1, "In the studio");
          _ref8 = occupant_observable.occupies().occupants();
          for (_p = 0, _len8 = _ref8.length; _p < _len8; _p++) {
            occupant_observable2 = _ref8[_p];
            equal(occupant_observable2.name(), 'John', 'Expected name');
            equal(occupant_observable2.occupies().location(), 'the other side of the street', 'Expected location');
          }
        }
      }
    }
    equal(places_observable.refCount(), 1, 'Expected references');
    kb.utils.release(places_observable);
    equal(places_observable.refCount(), 0, 'Expected references');
    equal(kb.stats.collection_observables, 0, 'Cleanup: no collection observables');
    equal(kb.stats.view_models, 0, 'Cleanup: no view models');
    return kb.stats_on = false;
  });
  return test("3. Model with recursive HasMany relations: Person with users who are people", function() {
    var friend, george, george_view_model, john, john_view_model, paul, paul_view_model, ringo, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
    kb.stats_on = true;
    john = new Person({
      id: 'person-3-1',
      name: 'John',
      friends: ['person-3-2', 'person-3-3', 'person-3-4']
    });
    paul = new Person({
      id: 'person-3-2',
      name: 'Paul',
      friends: ['person-3-1', 'person-3-3', 'person-3-4']
    });
    george = new Person({
      id: 'person-3-3',
      name: 'George',
      friends: ['person-3-1', 'person-3-2', 'person-3-4']
    });
    ringo = new Person({
      id: 'person-3-4',
      name: 'Ringo',
      friends: ['person-3-1', 'person-3-2', 'person-3-3']
    });
    john.set({
      best_friend: george
    });
    paul.set({
      best_friend: george
    });
    george.set({
      best_friend: john
    });
    john_view_model = new kb.ViewModel(john);
    equal(john_view_model.name(), 'John', "Name is correct");
    _ref = john_view_model.friends();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      friend = _ref[_i];
      ok(_.contains(['Paul', 'George', 'Ringo'], friend.name()), 'Expected name');
    }
    equal(john_view_model.best_friend().name(), 'George', 'Expected name');
    equal(john_view_model.best_friends_with_me()[0].name(), 'George', 'Expected name');
    john_view_model.release();
    john_view_model = null;
    paul_view_model = new kb.ViewModel(paul);
    equal(paul_view_model.name(), 'Paul', "Name is correct");
    _ref2 = paul_view_model.friends();
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      friend = _ref2[_j];
      ok(_.contains(['John', 'George', 'Ringo'], friend.name()), 'Expected name');
    }
    equal(paul_view_model.best_friend().name(), 'George', 'Expected name');
    equal(paul_view_model.best_friends_with_me().length, 0, 'No best friends with me');
    kb.utils.release(paul_view_model);
    paul_view_model = null;
    george_view_model = new kb.ViewModel(george);
    equal(george_view_model.name(), 'George', "Name is correct");
    _ref3 = george_view_model.friends();
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      friend = _ref3[_k];
      ok(_.contains(['John', 'Paul', 'Ringo'], friend.name()), 'Expected name');
    }
    equal(george_view_model.best_friend().name(), 'John', 'Expected name');
    equal(george_view_model.best_friends_with_me()[0].name(), 'John', 'Expected name');
    equal(george_view_model.best_friends_with_me()[1].name(), 'Paul', 'Expected name');
    george_view_model.release();
    george_view_model = null;
    equal(kb.stats.collection_observables, 0, 'Cleanup: no collection observables');
    equal(kb.stats.view_models, 0, 'Cleanup: no view models');
    return kb.stats_on = false;
  });
});