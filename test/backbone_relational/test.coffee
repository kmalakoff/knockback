$(document).ready( ->
  module("knockback.js with Backbone-Relational.js")
  test("TEST DEPENDENCY MISSING", ->
    ko.utils; _.VERSION; Backbone.VERSION; Backbone.Relational.Semaphore
  )

  class Person extends Backbone.RelationalModel
    relations: [{
      type: Backbone.HasMany
      key: 'friends'
      relatedModel: Person
    }, {
      type: Backbone.HasOne
      key: 'best_friend'
      relatedModel: Person
      reverseRelation:
        type: Backbone.HasMany
        key: 'best_friends_with_me'
    }]

  class Building extends Backbone.RelationalModel
    relations: [{
      type: Backbone.HasMany
      key: 'occupants'
      relatedModel: Person
      reverseRelation:
        type: Backbone.HasOne
        key: 'occupies'
    }]

  test("1. Model with HasMany relations: A house with multiple people living in it", ->
    kb.stats_on = true # turn on stats

    john = new Person({
      id: 'person-1-1'
      name: 'John'
    })

    paul = new Person({
      id: 'person-1-2'
      name: 'Paul'
    })

    our_house = new Building({
      id: 'house-1-1'
      location: 'in the middle of the street'
      occupants: ['person-1-1', 'person-1-2']
    })


    house_view_model = new kb.ViewModel(our_house)
    equal(house_view_model.location(), 'in the middle of the street', 'In the right place')
    equal(house_view_model.occupants().length, 2, 'Expected occupant count')
    for occupant_observable in house_view_model.occupants()
      ok(_.contains(['John', 'Paul'], occupant_observable.name()), 'Expected name')
      equal(occupant_observable.occupies().location(), 'in the middle of the street', 'Expected location')

      # nested check
      equal(occupant_observable.occupies().occupants().length, 2, "Excepted occupant count")
      for occupant_observable2 in occupant_observable.occupies().occupants()
        ok(_.contains(['John', 'Paul'], occupant_observable2.name()), 'Expected name')
        equal(occupant_observable2.occupies().location(), 'in the middle of the street', 'Expected location')

    equal(house_view_model.refCount(), 1, 'Expected references')
    kb.utils.release(house_view_model)
    equal(house_view_model.refCount(), 0, 'Expected references')

    # check stats
    equal(kb.stats.collection_observables, 0, 'Cleanup: no collection observables')
    equal(kb.stats.view_models, 0, 'Cleanup: no view models')

    kb.stats_on = false # turn off stats
  )

  test("2. Collection with models with HasMany relations: Multiple houses with multiple people living in them", ->
    kb.stats_on = true # turn on stats

    john = new Person({
      id: 'person-2-1'
      name: 'John'
    })
    paul = new Person({
      id: 'person-2-2'
      name: 'Paul'
    })
    george = new Person({
      id: 'person-2-3'
      name: 'George'
    })
    ringo = new Person({
      id: 'person-2-4'
      name: 'Ringo'
    })

    abbey_flats = new Building({
      id: 'house-2-1'
      location: 'one side of the street'
      occupants: ['person-2-1', 'person-2-2', 'person-2-3', 'person-2-4']
    })
    abbey_studios = new Building({
      id: 'studio-2-2'
      location: 'the other side of the street'
      occupants: []
    })

    # check the set up state
    places = new Backbone.Collection([abbey_flats, abbey_studios])
    places_observable = kb.collectionObservable(places, {view_model: kb.ViewModel})
    for place_view_model in places_observable()
      if place_view_model.id() == 'house-2-1'
        equal(place_view_model.location(), 'one side of the street', 'In the right place')
        equal(place_view_model.occupants().length, 4, "Everyone is here")
        for occupant_observable in place_view_model.occupants()
          ok(_.contains(['John', 'Paul', 'George', 'Ringo'], occupant_observable.name()), 'Expected name')
          equal(occupant_observable.occupies().location(), 'one side of the street', 'Expected location')

          # nested check
          equal(occupant_observable.occupies().occupants().length, 4, "Everyone is here")
          for occupant_observable2 in occupant_observable.occupies().occupants()
            ok(_.contains(['John', 'Paul', 'George', 'Ringo'], occupant_observable2.name()), 'Expected name')
            equal(occupant_observable2.occupies().location(), 'one side of the street', 'Expected location')
      else
        equal(place_view_model.location(), 'the other side of the street', 'In the right place')
        equal(place_view_model.occupants().length, 0, "No one is here")

    # a beattle crosses the road
    abbey_studios.get('occupants').add(john)

    for place_view_model in places_observable()
      if place_view_model.id() == 'house-2-1'
        equal(place_view_model.location(), 'one side of the street', 'In the right place')
        equal(place_view_model.occupants().length, 3, "Almost everyone is here")
        for occupant_observable in place_view_model.occupants()
          ok(_.contains(['Paul', 'George', 'Ringo'], occupant_observable.name()), 'Expected name')
          equal(occupant_observable.occupies().location(), 'one side of the street', 'Expected location')

          # nested check
          equal(occupant_observable.occupies().occupants().length, 3, "Almost everyone is here")
          for occupant_observable2 in occupant_observable.occupies().occupants()
            ok(_.contains(['Paul', 'George', 'Ringo'], occupant_observable2.name()), 'Expected name')
            equal(occupant_observable2.occupies().location(), 'one side of the street', 'Expected location')
      else
        equal(place_view_model.location(), 'the other side of the street', 'In the right place')
        equal(place_view_model.occupants().length, 1, "In the studio")
        for occupant_observable in place_view_model.occupants()
          equal(occupant_observable.name(), 'John', 'Expected name')
          equal(occupant_observable.occupies().location(), 'the other side of the street', 'Expected location')

          # nested check
          equal(occupant_observable.occupies().occupants().length, 1, "In the studio")
          for occupant_observable2 in occupant_observable.occupies().occupants()
            equal(occupant_observable2.name(), 'John', 'Expected name')
            equal(occupant_observable2.occupies().location(), 'the other side of the street', 'Expected location')

    equal(places_observable.refCount(), 1, 'Expected references')
    kb.utils.release(places_observable)
    equal(places_observable.refCount(), 0, 'Expected references')

    # check stats
    equal(kb.stats.collection_observables, 0, 'Cleanup: no collection observables')
    equal(kb.stats.view_models, 0, 'Cleanup: no view models')
    kb.stats_on = false # turn off stats
  )

  test("3. Model with recursive HasMany relations: Person with users who are people", ->
    kb.stats_on = true # turn on stats

    john = new Person({
      id: 'person-3-1'
      name: 'John'
      friends: ['person-3-2', 'person-3-3', 'person-3-4']
    })
    paul = new Person({
      id: 'person-3-2'
      name: 'Paul'
      friends: ['person-3-1', 'person-3-3', 'person-3-4']
    })
    george = new Person({
      id: 'person-3-3'
      name: 'George'
      friends: ['person-3-1', 'person-3-2', 'person-3-4']
    })
    ringo = new Person({
      id: 'person-3-4'
      name: 'Ringo'
      friends: ['person-3-1', 'person-3-2', 'person-3-3']
    })

    # set up best friends
    john.set(best_friend: george)
    paul.set(best_friend: george)
    george.set(best_friend: john)

    john_view_model = new kb.ViewModel(john)
    equal(john_view_model.name(), 'John', "Name is correct")
    for friend in john_view_model.friends()
      ok(_.contains(['Paul', 'George', 'Ringo'], friend.name()), 'Expected name')
    equal(john_view_model.best_friend().name(), 'George', 'Expected name')
    equal(john_view_model.best_friends_with_me()[0].name(), 'George', 'Expected name')
    john_view_model.release(); john_view_model = null

    paul_view_model = new kb.ViewModel(paul)
    equal(paul_view_model.name(), 'Paul', "Name is correct")
    for friend in paul_view_model.friends()
      ok(_.contains(['John', 'George', 'Ringo'], friend.name()), 'Expected name')
    equal(paul_view_model.best_friend().name(), 'George', 'Expected name')
    equal(paul_view_model.best_friends_with_me().length, 0, 'No best friends with me')
    kb.utils.release(paul_view_model); paul_view_model = null

    george_view_model = new kb.ViewModel(george)
    equal(george_view_model.name(), 'George', "Name is correct")
    for friend in george_view_model.friends()
      ok(_.contains(['John', 'Paul', 'Ringo'], friend.name()), 'Expected name')
    equal(george_view_model.best_friend().name(), 'John', 'Expected name')
    equal(george_view_model.best_friends_with_me()[0].name(), 'John', 'Expected name')
    equal(george_view_model.best_friends_with_me()[1].name(), 'Paul', 'Expected name')
    george_view_model.release(); george_view_model = null

    # check stats
    equal(kb.stats.collection_observables, 0, 'Cleanup: no collection observables')
    equal(kb.stats.view_models, 0, 'Cleanup: no view models')
    kb.stats_on = false # turn off stats
  )
)