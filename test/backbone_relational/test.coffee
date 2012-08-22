$(document).ready( ->
  module("knockback.js with Backbone-Relational.js")

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  if (typeof(require) != 'undefined') then _ = require('underscore') else _ = window._
  _ = _._ if _ and (_.hasOwnProperty('_')) # LEGACY
  Backbone = if not window.Backbone and (typeof(require) != 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) != 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) != 'undefined') then require('knockback') else window.kb
  _kbe = if not window._kbe and (typeof(require) != 'undefined') then require('knockback-examples') else window._kbe

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko); ok(!!_); ok(!!Backbone); ok(!!kb); ok(!!Backbone.Relational); ok(!!_kbe)
  )

  kb.locale_manager = new _kbe.LocaleManager('en', {})

  window.Person = Backbone.RelationalModel.extend({
    relations: [{
      type: Backbone.HasMany
      key: 'friends'
      relatedModel: 'Person'
    }, {
      type: Backbone.HasOne
      key: 'best_friend'
      relatedModel: 'Person'
      reverseRelation:
        type: Backbone.HasMany
        key: 'best_friends_with_me'
    }]
  })

  window.Building = Backbone.RelationalModel.extend({
    relations: [{
      type: Backbone.HasMany
      key: 'occupants'
      relatedModel: Person
      reverseRelation:
        type: Backbone.HasOne
        key: 'occupies'
    }]
  })
  Person.setup()
  Building.setup()

  # REMOVE
  test("1. Model with HasMany relations: A house with multiple people living in it", ->
    kb.statistics = new kb.Statistics() # turn on stats

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

    kb.release(house_view_model)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("2. Collection with models with HasMany relations: Multiple houses with multiple people living in them", ->
    kb.statistics = new kb.Statistics() # turn on stats

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

    kb.release(places_observable)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("3. Model with recursive HasMany relations: Person with users who are people", ->
    kb.statistics = new kb.Statistics() # turn on stats

    george = new Person({
      id: 'person-3-3'
      name: 'George'
      friends: ['person-3-1', 'person-3-2', 'person-3-4']
    })
    john = new Person({
      id: 'person-3-1'
      name: 'John'
      friends: ['person-3-2', 'person-3-3', 'person-3-4']
      best_friend: george
    })
    george.set(best_friend: john)
    paul = new Person({
      id: 'person-3-2'
      name: 'Paul'
      friends: ['person-3-1', 'person-3-3', 'person-3-4']
      best_friend: george
    })
    ringo = new Person({
      id: 'person-3-4'
      name: 'Ringo'
      friends: ['person-3-1', 'person-3-2', 'person-3-3']
    })

    john_view_model = new kb.ViewModel(john)
    equal(john_view_model.name(), 'John', "Name is correct")
    for friend in john_view_model.friends()
      ok(_.contains(['Paul', 'George', 'Ringo'], friend.name()), 'Expected name')
    equal(john_view_model.best_friend().name(), 'George', 'Expected name')
    equal(john_view_model.best_friends_with_me()[0].name(), 'George', 'Expected name')
    kb.release(john_view_model); john_view_model = null

    paul_view_model = new kb.ViewModel(paul)
    equal(paul_view_model.name(), 'Paul', "Name is correct")
    for friend in paul_view_model.friends()
      ok(_.contains(['John', 'George', 'Ringo'], friend.name()), 'Expected name')
    equal(paul_view_model.best_friend().name(), 'George', 'Expected name')
    equal(paul_view_model.best_friends_with_me().length, 0, 'No best friends with me')
    kb.release(paul_view_model); paul_view_model = null

    george_view_model = new kb.ViewModel(george)
    equal(george_view_model.name(), 'George', "Name is correct")
    for friend in george_view_model.friends()
      ok(_.contains(['John', 'Paul', 'Ringo'], friend.name()), 'Expected name')
    equal(george_view_model.best_friend().name(), 'John', 'Expected name')
    equal(george_view_model.best_friends_with_me()[0].name(), 'John', 'Expected name')
    equal(george_view_model.best_friends_with_me()[1].name(), 'Paul', 'Expected name')
    kb.release(george_view_model); george_view_model = null

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("4. After view model create, add models", ->
    Person = Backbone.RelationalModel.extend({})

    House = Backbone.RelationalModel.extend({
      relations: [{
        type: Backbone.HasMany
        key: 'occupants'
        relatedModel: 'Person'
        reverseRelation:
          key: 'livesIn'
      }]
    })

    bob = new Person({id: 'person-1', name: 'Bob'})
    fred = new Person({id: 'person-2', name: 'Fred'})

    house = new House({
      location: 'In the middle of our street'
      occupants: new Backbone.Collection()
    })

    # confirm no occupants
    view_model = kb.viewModel(house)
    equal(view_model.occupants().length, 0, "no occupants")

    occupants_relationship = house.get('occupants')
    occupants_relationship.add(bob)
    occupants_relationship.add(fred)
    equal(view_model.occupants().length, 2, 'two occupants')
    equal(view_model.occupants()[0].name(), 'Bob', 'Bob is in the view model relationship')
    equal(view_model.occupants()[1].name(), 'Fred', 'Fred is in the view model relationship')
  )

  test("5. bug fix for relational models https://github.com/kmalakoff/knockback/issues/34", ->
    Book = Backbone.RelationalModel.extend({
      defaults:
        name: 'untitled'
      idAttribute: "_id"
    })
    Author = Backbone.RelationalModel.extend({
      defaults:
        name: 'untitled'
      idAttribute: "_id"
      relations:[{
        type: 'HasMany'
        key: 'books'
        relatedModel: Book
        includeInJSON: "_id"
        reverseRelation:
          key: 'author'
          includeInJSON: "_id"
      }]
    })
    BookStore = Backbone.RelationalModel.extend({
      relations:[{
        type: 'HasMany'
        key: 'books'
        relatedModel: Book
      },{
        type: 'HasMany'
        key: 'authors'
        relatedModel: Author
      }]
    })

    Author.setup()
    BookStore.setup()

    bs = new BookStore({
      books:[{_id:"b1", name: "Book One", author: "a1"}, {_id:"b2", name: "Book Two", author: "a1"}],
      authors:[{name: 'fred', _id: "a1"}, {name: 'ted', _id: "a2"}]
    })

    BookViewModel = kb.ViewModel.extend({
      constructor: (model) ->
        kb.ViewModel.prototype.constructor.apply(this, arguments)
        this.editMode = ko.observable()

        @edit = =>
          model._save = model.toJSON()
          @editMode(true)

        @confirm = =>
          model._save = null
          @editMode(false)

        @cancel = =>
          model.set(model._save)
          @editMode(false)
        @
    })

    view_model = {
      books: kb.collectionObservable(bs.get('books'), {
        factories:
          models: BookViewModel
          'models.author.books.models': BookViewModel
      })
    }

    for book in view_model.books()
      author = book.author()
      for authored_book in author.books()
        authored_book.editMode(true)
        equal(authored_book.editMode(), true, 'edit mode set')
  )

  test("6. Infering observable types: from the start", ->
    kb.statistics = new kb.Statistics() # turn on stats

    person1 = new Person({id: 'person-6-1', name: 'Daddy'})
    person2 = new Person({id: 'person-6-2', name: 'Mommy'})
    house = new Building({id: 'house-6-1', name: 'Home Sweet Home', occupants: ['person-6-1', 'person-6-2']})
    person1.get('friends').add(person2); person2.set({best_friend: person1})

    view_model_person1 = kb.viewModel(person1)
    view_model_house1 = kb.viewModel(house)

    # check friends
    equal(view_model_person1.friends().length, 1, 'person1 has one friend')
    equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy')
    equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy')

    # check occupants
    equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home')
    equal(view_model_house1.occupants().length, 2, 'house has two occupants')
    equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it')

    # release
    kb.release(view_model_person1)
    kb.release(view_model_house1)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("7. Infering observable types: late binding", ->
    kb.statistics = new kb.Statistics() # turn on stats

    person1 = new Person({id: 'person-7-1', name: 'Daddy'})
    person2 = new Person({id: 'person-7-2', name: 'Mommy'})
    house = new Building({id: 'house-7-1', name: 'Home Sweet Home'})

    view_model_person1 = kb.viewModel(person1)
    view_model_house1 = kb.viewModel(house)

    # inferred the relationship types
    equal(view_model_person1.name(), 'Daddy', 'person1 name is Daddy')
    equal(view_model_person1.friends().length, 0, 'person1 has no friends')
    equal(view_model_person1.best_friends_with_me().length, 0, 'person1 has not best_friends')
    ok(view_model_person1.occupies() instanceof kb.ViewModel, 'person1 occupies is kb.ViewModel')
    equal(view_model_house1.occupants().length, 0, 'house has no occupants')

    # add some friends
    person1.get('friends').add(person2); person2.set({best_friend: person1})
    equal(view_model_person1.friends().length, 1, 'person1 has one friend')
    equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy')
    equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy')

    # add some occupants
    house.get('occupants').add(person1).add(person2)
    equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home')
    equal(view_model_house1.occupants().length, 2, 'house has two occupants')
    equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it')

    # release
    kb.release(view_model_person1)
    kb.release(view_model_house1)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("8. Customizing observable types: from the start", ->
    kb.statistics = new kb.Statistics() # turn on stats

    class FriendViewModel extends kb.ViewModel
    class BestFriendViewModel extends kb.ViewModel
    class PersonViewModel extends kb.ViewModel
      constructor: (model, options) ->
        super(model, {factories: {
          'friends.models': FriendViewModel
          'best_friend': BestFriendViewModel
          'occupies': HouseViewModel
        }, options: options})
    class HouseViewModel extends kb.ViewModel
      constructor: (model, options) ->
        super(model, {factories: {
          'occupants.models': PersonViewModel
        }, options: options})

    person1 = new Person({id: 'person-8-1', name: 'Daddy'})
    person2 = new Person({id: 'person-8-2', name: 'Mommy'})
    family = new Backbone.Collection([person1, person2])
    house = new Building({id: 'house-8-1', name: 'Home Sweet Home', occupants: ['person-8-1', 'person-8-2']})
    person1.get('friends').add(person2); person2.set({best_friend: person1})

    view_model_person1 = new PersonViewModel(person1)
    view_model_person2 = new PersonViewModel(person2)
    co_family = kb.collectionObservable(family, {view_model: PersonViewModel})
    view_model_house1 = new HouseViewModel(house)

    # check friends
    equal(view_model_person1.friends().length, 1, 'person1 has one friend')
    ok(view_model_person1.friends()[0] instanceof FriendViewModel, 'person1 is friends are FriendViewModel')
    equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy')
    equal(view_model_person1.best_friends_with_me().length, 1, 'person1 has one best friends')
    equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy')
    ok(view_model_person2.best_friend() instanceof BestFriendViewModel, 'person2 is best friends are BestFriendViewModel')
    equal(view_model_person2.best_friend().name(), 'Daddy', 'person2 is best friends with Daddy')
    ok(view_model_person2.occupies() instanceof HouseViewModel, 'person2 is occupies HouseViewModel')

    # check occupants
    equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home')
    equal(view_model_house1.occupants().length, 2, 'house has two occupants')
    ok(view_model_house1.occupants()[0] instanceof PersonViewModel, 'house has PersonViewModel in it')
    equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it')
    ok(view_model_house1.occupants()[0].occupies() instanceof HouseViewModel, 'person1 occupies has HouseViewModel')
    equal(view_model_house1.occupants()[0].occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home')

    # release
    kb.release(view_model_person1)
    kb.release(view_model_person2)
    kb.release(co_family)
    kb.release(view_model_house1)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("9. Customizing observable types: late binding", ->
    kb.statistics = new kb.Statistics() # turn on stats

    class FriendViewModel extends kb.ViewModel
    class BestFriendViewModel extends kb.ViewModel
    class PersonViewModel extends kb.ViewModel
      constructor: (model, options) ->
        super(model, {factories: {
          'friends.models': FriendViewModel
          'best_friend': BestFriendViewModel
          'occupies': HouseViewModel
        }, options: options})
    class HouseViewModel extends kb.ViewModel
      constructor: (model, options) ->
        super(model, {factories: {
          'occupants.models': PersonViewModel
        }, options: options})

    person1 = new Person({id: 'person-9-1', name: 'Daddy'})
    person2 = new Person({id: 'person-9-2', name: 'Mommy'})
    family = new Backbone.Collection([person1, person2])
    house = new Building({id: 'house-9-1', name: 'Home Sweet Home'})

    view_model_person1 = new PersonViewModel(person1)
    view_model_person2 = new PersonViewModel(person2)
    co_family = kb.collectionObservable(family, {view_model: PersonViewModel})
    view_model_house1 = new HouseViewModel(house)

    # check initial state
    equal(view_model_person1.friends().length, 0, 'person1 has no friends')
    equal(view_model_person1.best_friends_with_me().length, 0, 'person1 has no best friends')
    ok(view_model_person2.best_friend() instanceof BestFriendViewModel, 'person2 is best friends are BestFriendViewModel')
    ok(view_model_person2.occupies() instanceof HouseViewModel, 'person2 is occupies HouseViewModel')
    equal(view_model_house1.occupants().length, 0, 'house has no occupants')

    # check friends
    person1.get('friends').add(person2); person2.set({best_friend: person1})
    equal(view_model_person1.friends().length, 1, 'person1 has one friend')
    ok(view_model_person1.friends()[0] instanceof FriendViewModel, 'person1 is friends are FriendViewModel')
    equal(view_model_person1.friends()[0].name(), 'Mommy', 'person1 is friends with Mommy')
    equal(view_model_person1.best_friends_with_me().length, 1, 'person1 has one best friends')
    equal(view_model_person1.best_friends_with_me()[0].name(), 'Mommy', 'person1 is best friends with Mommy')
    ok(view_model_person2.best_friend() instanceof BestFriendViewModel, 'person2 is best friends are BestFriendViewModel')
    equal(view_model_person2.best_friend().name(), 'Daddy', 'person2 is best friends with Daddy')
    ok(view_model_person2.occupies() instanceof HouseViewModel, 'person2 is occupies HouseViewModel')

    # check occupants
    house.get('occupants').add(person1).add(person2)
    equal(view_model_person1.occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home')
    equal(view_model_house1.occupants().length, 2, 'house has two occupants')
    ok(view_model_house1.occupants()[0] instanceof PersonViewModel, 'house has PersonViewModel in it')
    equal(view_model_house1.occupants()[0].name(), 'Daddy', 'house has Daddy in it')
    ok(view_model_house1.occupants()[0].occupies() instanceof HouseViewModel, 'person1 occupies has HouseViewModel')
    equal(view_model_house1.occupants()[0].occupies().name(), 'Home Sweet Home', 'person1 occupies home sweet home')

    # release
    kb.release(view_model_person1)
    kb.release(view_model_person2)
    kb.release(co_family)
    kb.release(view_model_house1)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("10. Nested custom view models", ->
    kb.statistics = new kb.Statistics() # turn on stats

    george = new Person({
      id: 'person-10-3'
      name: 'George'
      friends: ['person-10-1', 'person-10-2', 'person-10-4']
    })
    john = new Person({
      id: 'person-10-1'
      name: 'John'
      friends: ['person-10-2', 'person-10-3', 'person-10-4']
      best_friend: george
    })
    george.set(best_friend: john)
    paul = new Person({
      id: 'person-10-2'
      name: 'Paul'
      friends: ['person-10-1', 'person-10-3', 'person-10-4']
      best_friend: george
    })
    ringo = new Person({
      id: 'person-10-4'
      name: 'Ringo'
      friends: ['person-10-1', 'person-10-2', 'person-10-3']
    })

    FriendViewModel = (model) ->
      @name = kb.observable(model, 'name')
      @type = ko.observable('friend')
      @
    BestFriendViewModel = (model) ->
      @name = kb.observable(model, 'name')
      @type = ko.observable('best_friend')
      @
    class BandMemberViewModel extends kb.ViewModel
      constructor: (model, options) ->
        super
        @type = ko.observable('band_member')

    collection_observable = kb.collectionObservable(new Backbone.Collection([john, paul, george, ringo]), {
      factories:
        models: BandMemberViewModel
        'models.best_friend': {create: (model, options) -> return if model then new BestFriendViewModel(model) else null}
        'models.friends.models': FriendViewModel
    })

    validateFriends = (co, names) ->
      for name in names
        found = false
        for vm in co()
          if vm.name and vm.name() == name
            found = true
            validateFriend(vm, name)
        ok(found, "#{name} was found")
    validateFriend = (vm, name) ->
      equal(vm.type(), 'friend', "friend type matches for #{name}")
      equal(vm.name(), name, "friend name matches for #{name}")
    validateBestFriend = (vm, name) ->
      equal(vm.type(), 'best_friend', "best friend type matches for #{name}")
      equal(vm.name(), name, "best friend name matches for #{name}")
    validateBandMember = (vm, name) ->
      equal(vm.type(), 'band_member', "band member type matches for #{name}")
      ok(vm instanceof BandMemberViewModel, "band member type matches for #{name}")
      equal(vm.name(), name, "band member name matches for #{name}")

    validateBandMember(collection_observable()[0], 'John')
    validateBestFriend(collection_observable()[0].best_friend(), 'George')   
    validateFriends(collection_observable()[0].friends, ['Paul', 'George', 'Ringo'])
    validateBandMember(collection_observable()[1], 'Paul')
    validateBestFriend(collection_observable()[1].best_friend(), 'George')
    validateFriends(collection_observable()[1].friends, ['John', 'George', 'Ringo'])
    validateBandMember(collection_observable()[2], 'George')
    validateBestFriend(collection_observable()[2].best_friend(), 'John')
    validateFriends(collection_observable()[2].friends, ['John', 'Paul', 'Ringo'])
    validateBandMember(collection_observable()[3], 'Ringo')
    equal(collection_observable()[3].best_friend(), null, 'No best friend')
    validateFriends(collection_observable()[3].friends, ['John', 'Paul', 'George'])

    # and cleanup after yourself when you are done.
    kb.release(collection_observable)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
)