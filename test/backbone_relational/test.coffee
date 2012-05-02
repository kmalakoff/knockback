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

  test("Model with HasMany relations: A house with multiple people living in it", ->
    paul = new Person({
      id: 'person-1'
      name: 'Paul'
      user: { id: 'user-1', login: 'dude', email: 'me@gmail.com' }
    })
    kevin = new Person({
      id: 'person-2'
      name: 'Frog Man'
      user: { id: 'user-2', login: 'frog', email: 'frog@gmail.com' }
    })
    our_house = new House({
      id: 'house-1'
      location: 'in the middle of the street'
      occupants: ['person-1', 'person-2']
    })

    house_view_model = new kb.ViewModel(our_house)
  )

  test("Collection with models with HasMany relations: Multiple houses with multiple people living in them", ->
  )

  test("Model with recursive HasMany relations: Person with users who are people", ->
  )

  test("Collection with models with recursive HasMany relations: Person with users who are people", ->
  )

  test("Nested Model: A house with multiple people (with users who are people) living in it", ->
  )

  test("Nested Collection: Multiple houses with multiple people (with users who are people) living in them", ->
  )

)