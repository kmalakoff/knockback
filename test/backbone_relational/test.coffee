$(document).ready( ->
  module("knockback.js with Backbone-Relational.js")
  test("TEST DEPENDENCY MISSING", ->
    ko.utils; _.VERSION; Backbone.VERSION; Backbone.Relational.Semaphore
  )

  class User extends Backbone.RelationalModel

  class Person extends Backbone.RelationalModel
    relations: [{
      type: Backbone.HasOne
      key: 'user'
      relatedModel: User
      reverseRelation:
        type: Backbone.HasOne
        key: 'person'
    }]

  class House extends Backbone.RelationalModel
    relations: [{
      type: Backbone.HasMany
      key: 'occupants'
      relatedModel: Person
      includeInJSON: Backbone.Model.prototype.idAttribute
      reverseRelation:
        key: 'livesIn'
    }]

  test("1. Model with HasMany relations: A house with multiple people living in it", ->
    paul = new Person({
      id: 'person-1-1'
      name: 'Paul'
    })
    frog_man = new Person({
      id: 'person-1-2'
      name: 'Frog Man'
    })

    our_house = new House({
      id: 'house-1-1'
      location: 'in the middle of the street'
      occupants: ['person-1-1', 'person-1-2']
    })

    house_view_model = new kb.ViewModel(our_house)
    equal(house_view_model.location(), 'in the middle of the street', 'In the right place')
    for occupant_observable in house_view_model.occupants()
      ok(_.contains(['Paul', 'Frog Man'], occupant_observable.name()), 'Expected name')
      equal(occupant_observable.livesIn.location(), 'in the middle of the street', 'Expected location')

      for occupant_observable in occupant_observable.livesIn.occupants()
        ok(_.contains(['Paul', 'Frog Man'], occupant_observable.name()), 'Expected name')
        equal(occupant_observable.livesIn.location(), 'in the middle of the street', 'Expected location')
  )

  test("2. Collection with models with HasMany relations: Multiple houses with multiple people living in them", ->
  )

  test("3. Model with recursive HasMany relations: Person with users who are people", ->
    paul = new Person({
      id: 'person-3-1'
      name: 'Paul'
      user: {id: 'user-3-1', login: 'dude', email: 'me@gmail.com'}
    })
  )

  test("4. Collection with models with recursive HasMany relations: Person with users who are people", ->
    paul = new Person({
      id: 'person-4-1'
      name: 'Paul'
      user: {id: 'user-4-1', login: 'dude', email: 'me@gmail.com'}
    })

    frog_man = new Person({
      id: 'person-4-2'
      name: 'Frog Man'
      user: {id: 'user-4-2', login: 'frog', email: 'frog@gmail.com'}
    })
  )

  test("5. Nested Model: A house with multiple people (with users who are people) living in it", ->
  )

  test("6. Nested Collection: Multiple houses with multiple people (with users who are people) living in them", ->
  )

)