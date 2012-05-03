var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
$(document).ready(function() {
  var House, Person, User;
  module("knockback.js with Backbone-Relational.js");
  test("TEST DEPENDENCY MISSING", function() {
    ko.utils;
    _.VERSION;
    Backbone.VERSION;
    return Backbone.Relational.Semaphore;
  });
  User = (function() {
    __extends(User, Backbone.RelationalModel);
    function User() {
      User.__super__.constructor.apply(this, arguments);
    }
    return User;
  })();
  Person = (function() {
    __extends(Person, Backbone.RelationalModel);
    function Person() {
      Person.__super__.constructor.apply(this, arguments);
    }
    Person.prototype.relations = [
      {
        type: Backbone.HasOne,
        key: 'user',
        relatedModel: User,
        reverseRelation: {
          type: Backbone.HasOne,
          key: 'person'
        }
      }
    ];
    return Person;
  })();
  House = (function() {
    __extends(House, Backbone.RelationalModel);
    function House() {
      House.__super__.constructor.apply(this, arguments);
    }
    House.prototype.relations = [
      {
        type: Backbone.HasMany,
        key: 'occupants',
        relatedModel: Person,
        includeInJSON: Backbone.Model.prototype.idAttribute,
        reverseRelation: {
          key: 'livesIn'
        }
      }
    ];
    return House;
  })();
  test("1. Model with HasMany relations: A house with multiple people living in it", function() {
    var frog_man, house_view_model, occupant_observable, our_house, paul, _i, _len, _ref, _results;
    paul = new Person({
      id: 'person-1-1',
      name: 'Paul'
    });
    frog_man = new Person({
      id: 'person-1-2',
      name: 'Frog Man'
    });
    our_house = new House({
      id: 'house-1-1',
      location: 'in the middle of the street',
      occupants: ['person-1-1', 'person-1-2']
    });
    house_view_model = new kb.ViewModel(our_house);
    equal(house_view_model.location(), 'in the middle of the street', 'In the right place');
    _ref = house_view_model.occupants();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      occupant_observable = _ref[_i];
      ok(_.contains(['Paul', 'Frog Man'], occupant_observable.name()), 'Expected name');
      equal(occupant_observable.livesIn.location(), 'in the middle of the street', 'Expected location');
      _results.push((function() {
        var _j, _len2, _ref2, _results2;
        _ref2 = occupant_observable.livesIn.occupants();
        _results2 = [];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          occupant_observable = _ref2[_j];
          ok(_.contains(['Paul', 'Frog Man'], occupant_observable.name()), 'Expected name');
          _results2.push(equal(occupant_observable.livesIn.location(), 'in the middle of the street', 'Expected location'));
        }
        return _results2;
      })());
    }
    return _results;
  });
  test("2. Collection with models with HasMany relations: Multiple houses with multiple people living in them", function() {});
  test("3. Model with recursive HasMany relations: Person with users who are people", function() {
    var paul;
    return paul = new Person({
      id: 'person-3-1',
      name: 'Paul',
      user: {
        id: 'user-3-1',
        login: 'dude',
        email: 'me@gmail.com'
      }
    });
  });
  test("4. Collection with models with recursive HasMany relations: Person with users who are people", function() {
    var frog_man, paul;
    paul = new Person({
      id: 'person-4-1',
      name: 'Paul',
      user: {
        id: 'user-4-1',
        login: 'dude',
        email: 'me@gmail.com'
      }
    });
    return frog_man = new Person({
      id: 'person-4-2',
      name: 'Frog Man',
      user: {
        id: 'user-4-2',
        login: 'frog',
        email: 'frog@gmail.com'
      }
    });
  });
  test("5. Nested Model: A house with multiple people (with users who are people) living in it", function() {});
  return test("6. Nested Collection: Multiple houses with multiple people (with users who are people) living in them", function() {});
});