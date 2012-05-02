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
  test("Model with HasMany relations: A house with multiple people living in it", function() {
    var house_view_model, kevin, our_house, paul;
    paul = new Person({
      id: 'person-1',
      name: 'Paul',
      user: {
        id: 'user-1',
        login: 'dude',
        email: 'me@gmail.com'
      }
    });
    kevin = new Person({
      id: 'person-2',
      name: 'Frog Man',
      user: {
        id: 'user-2',
        login: 'frog',
        email: 'frog@gmail.com'
      }
    });
    our_house = new House({
      id: 'house-1',
      location: 'in the middle of the street',
      occupants: ['person-1', 'person-2']
    });
    return house_view_model = new kb.ViewModel(our_house);
  });
  test("Collection with models with HasMany relations: Multiple houses with multiple people living in them", function() {});
  test("Model with recursive HasMany relations: Person with users who are people", function() {});
  test("Collection with models with recursive HasMany relations: Person with users who are people", function() {});
  test("Nested Model: A house with multiple people (with users who are people) living in it", function() {});
  return test("Nested Collection: Multiple houses with multiple people (with users who are people) living in them", function() {});
});