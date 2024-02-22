assert = assert or require?('chai').assert

describe 'collection-observable @quick @collection-observable', ->

  kb = window?.kb; try kb or= require?('knockback') catch; try kb or= require?('../../../knockback')
  {_, ko} = kb

  it 'TEST DEPENDENCY MISSING', (done) ->
    assert.ok(!!ko, 'ko')
    assert.ok(!!_, '_')
    assert.ok(!!kb.Model, 'kb.Model')
    assert.ok(!!kb.Collection, 'kb.Collection')
    assert.ok(!!kb, 'kb')
    done()

  Contact = if kb.Parse then kb.Model.extend('Contact', { defaults: {name: '', number: 0, date: new Date()} }) else kb.Model.extend({ defaults: {name: '', number: 0, date: new Date()} })
  Contacts = kb.Collection.extend({model: Contact})

  ContactViewModel = (model) ->
    @name = kb.observable(model, 'name')
    @number = kb.observable(model, 'number')
    @

  class ContactViewModelClass
    constructor: (model) ->
      @name = kb.observable(model, 'name')
      @number = kb.observable(model, 'number')

  class TestViewModel extends kb.ViewModel
    constructor: ->
      super arguments...
      @test = ko.observable('hello')
      value = @test()
      value = @name()

  it '2. Basic Usage: collection observable with ko.computed', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection = new Contacts()
    collection_observable = kb.collectionObservable(collection)
    view_model =
      count: ko.computed(->return collection_observable().length )

    assert.equal(collection.length, 0, "no models")
    assert.equal(view_model.count(), 0, "no count")

    collection.add(new Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    assert.equal(collection.length, 2, "2 models")
    assert.equal(view_model.count(), 2, "2 count")

    collection.add(new Contact({id: 'b3', name: 'Paul', number: '555-555-5557'}))
    assert.equal(collection.length, 3, "3 models")
    assert.equal(view_model.count(), 3, "3 count")

    collection.remove('b2'); collection.remove('b3')
    assert.equal(collection.length, 1, "1 model")
    assert.equal(view_model.count(), 1, "1 count")

    # clean up
    kb.release(collection_observable)
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '3. Basic Usage: collection observable with ko.computed', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection = new Contacts()
    collection_observable = kb.collectionObservable(collection, factories: {models: ContactViewModel})

    view_model =
      count: ko.computed(-> return collection_observable().length)

    assert.equal(collection.length, 0, "no models")
    assert.equal(view_model.count(), 0, "no count")

    collection.add(new Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    assert.equal(collection.length, 2, "2 models")
    assert.equal(view_model.count(), 2, "2 count")

    collection.add(new Contact({id: 'b3', name: 'Paul', number: '555-555-5557'}))
    assert.equal(collection.length, 3, "3 models")
    assert.equal(view_model.count(), 3, "3 count")
    assert.ok(collection_observable()[2] instanceof ContactViewModel, 'correct type from factory')

    collection.remove('b2'); collection.remove('b3')
    assert.equal(collection.length, 1, "1 model")
    assert.equal(view_model.count(), 1, "1 count")

    # clean up
    kb.release(collection_observable)
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '4. Basic Usage: no view models', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection = new Contacts()

    collection_observable = kb.collectionObservable(collection, {models_only: true})

    assert.equal(collection.length, 0, "no models")
    assert.equal(collection_observable().length, 0, "no view models")

    collection.add(new Contact({id: 'b1', name: 'Ringo', number: '555-555-5555'}))
    collection.add(new Contact({id: 'b2', name: 'George', number: '555-555-5556'}))
    assert.equal(collection.length, 2, "two models")
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    assert.equal(collection.models[1].get('name'), 'George', "George is second")
    assert.equal(collection_observable().length, 2, "two view models")
    assert.equal(collection_observable()[0].get('name'), 'Ringo', "Ringo is first")
    assert.equal(collection_observable()[1].get('name'), 'George', "George is second")

    collection.remove('b2')
    assert.equal(collection.length, 1, "one models")
    assert.equal(collection_observable().length, 1, "one view models")
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is left")
    model = kb.utils.wrappedModel(collection_observable()[0])
    assert.equal(model.get('name'), 'Ringo', "Ringo is left")
    model = collection_observable()[0]
    assert.equal(model.get('name'), 'Ringo', "Ringo is left")

    view_model = collection_observable.viewModelByModel(model)
    assert.ok(!view_model, "no view model found since the collection observable is not wrapping models in view models")

    model_count = 0
    _.each(collection_observable(), (model)->model_count++)
    assert.equal(model_count, 1, "one model")

    assert.ok(collection_observable.collection()==collection, "collections match")

    # clean up
    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '5. Basic Usage: no sorting and no callbacks', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection = new Contacts()
    collection_observable = kb.collectionObservable(collection, {
      factories:
        models: {create: (model) -> return new ContactViewModel(model)}
    })

    assert.equal(collection.length, 0, "no models")
    assert.equal(collection_observable().length, 0, "no view models")

    collection.add(new Contact({id: 'b1', name: 'Ringo', number: '555-555-5555'}))
    collection.add(new Contact({id: 'b2', name: 'George', number: '555-555-5556'}))
    assert.equal(collection.length, 2, "two models")
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    assert.equal(collection.models[1].get('name'), 'George', "George is second")
    assert.equal(collection_observable().length, 2, "two view models")
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Ringo', "Ringo is first")
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'George', "George is second")

    collection.remove('b2')
    assert.equal(collection.length, 1, "one model")
    assert.equal(collection_observable().length, 1, "one view model")
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is left")
    model = kb.utils.wrappedModel(collection_observable()[0])
    assert.equal(model.get('name'), 'Ringo', "Ringo is left")

    view_model = collection_observable.viewModelByModel(model)
    assert.equal(kb.utils.wrappedModel(view_model).get('name'), 'Ringo', "Ringo is left")

    view_model_count = 0
    _.each(collection_observable(), (view_model)->view_model_count++)
    assert.equal(view_model_count, 1, "one view model")

    assert.ok(collection_observable.collection()==collection, "collections match")

    # clean up
    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '6. Collection sync sorting with sort_attribute', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection = new Contacts()

    collection_observable = kb.collectionObservable(collection, {
      view_model:           ContactViewModelClass
      sort_attribute:       'name'
    })

    assert.equal(collection.length, 0, "no models")
    assert.equal(collection_observable().length, 0, "no view models")

    collection.add(new Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    assert.equal(collection.length, 2, "two models")
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    assert.equal(collection.models[1].get('name'), 'George', "George is second")
    assert.equal(collection_observable().length, 2, "two view models")
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!")
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Ringo', "Ringo is second - sorting worked!")

    collection.add(new Contact({id: 'b3', name: 'Paul', number: '555-555-5557'}))
    assert.equal(collection.length, 3, "three models")
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    assert.equal(collection.models[1].get('name'), 'George', "George is second")
    assert.equal(collection.models[2].get('name'), 'Paul', "Paul is second")
    assert.equal(collection_observable().length, 3, "two view models")
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!")
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Paul', "Paul is second - sorting worked!")
    assert.equal(kb.utils.wrappedModel(collection_observable()[2]).get('name'), 'Ringo', "Ringo is third - sorting worked!")

    collection.remove('b2'); collection.remove('b3')
    assert.equal(collection.length, 1, "one model")
    assert.equal(collection_observable().length, 1, "one view model")
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is left")
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Ringo', "Ringo is left")

    collection.reset()
    assert.equal(collection.length, 0, "no models")
    assert.equal(collection_observable().length, 0, "no view models")

    # clean up
    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '7. Collection sync sorting with comparator', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    sortNumber = (model_a, model_b) ->
      parts_a = kb.utils.wrappedModel(model_a).get('number').split('-')
      parts_b = kb.utils.wrappedModel(model_b).get('number').split('-')

      return (parts_a.length-parts_b.length) if parts_a.length isnt parts_b.length
      for index, part of parts_b
        return delta unless (delta = parts_a[index] - parseInt(part, 10)) is 0
      return 0

    # without view models
    collection = new Contacts()
    collection_observable = kb.collectionObservable(collection, {
      models_only:  true
      comparator:   sortNumber
    })
    collection.add(new Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    assert.equal(collection.length, 2, "two models")
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    assert.equal(collection.models[1].get('name'), 'George', "George is second")
    assert.equal(collection_observable().length, 2, "two view models")
    assert.equal(collection_observable()[0].get('name'), 'George', "George is first - sorting worked!")
    assert.equal(collection_observable()[1].get('name'), 'Ringo', "Ringo is second - sorting worked!")

    # clean up
    kb.release(collection_observable)

    # with view models
    collection = new Contacts()
    collection_observable = kb.collectionObservable(collection, {
      view_model:   ContactViewModelClass
      comparator:   sortNumber
    })
    collection.add(new Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    assert.equal(collection.length, 2, "two models")
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    assert.equal(collection.models[1].get('name'), 'George', "George is second")
    assert.equal(collection_observable().length, 2, "two view models")
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!")
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Ringo', "Ringo is second - sorting worked!")

    # clean up
    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '8. Collection sorting with callbacks', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    kb.NameSortedContacts = kb.Collection.extend({
      model: Contact
      comparator: (model) -> return model.get('name')
    })
    collection = new kb.NameSortedContacts()

    collection_observable = kb.collectionObservable(collection, {
      view_model:       ContactViewModel    # view_model is legacy for view_model, it should be replaced with view_model or create
    })

    assert.equal(collection.length, 0, "no models")
    assert.equal(collection_observable().length, 0, "no view models")

    collection.add(new Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    assert.equal(collection.length, 2, "two models")
    assert.equal(collection.models[0].get('name'), 'George', "George is first")
    assert.equal(collection.models[1].get('name'), 'Ringo', "Ringo is second")
    assert.equal(collection_observable().length, 2, "two view models")
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!")
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Ringo', "Ringo is second - sorting worked!")

    collection.add(new Contact({id: 'b3', name: 'Paul', number: '555-555-5557'}))
    assert.equal(collection.length, 3, "three models")
    assert.equal(collection.models[0].get('name'), 'George', "George is first")
    assert.equal(collection.models[1].get('name'), 'Paul', "Paul is second")
    assert.equal(collection.models[2].get('name'), 'Ringo', "Ringo is second")
    assert.equal(collection_observable().length, 3, "two view models")
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!")
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Paul', "Paul is second - sorting worked!")
    assert.equal(kb.utils.wrappedModel(collection_observable()[2]).get('name'), 'Ringo', "Ringo is third - sorting worked!")

    collection.remove('b2'); collection.remove('b3')
    assert.equal(collection.length, 1, "one models")
    assert.equal(collection_observable().length, 1, "one view models")
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is left")
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Ringo', "Ringo is left")

    collection.reset()
    assert.equal(collection.length, 0, "no models")
    assert.equal(collection_observable().length, 0, "no view models")

    # clean up
    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '9. Collection sync dynamically changing the sorting function', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection = new Contacts()
    collection_observable = kb.collectionObservable(collection, {
      view_model:       ContactViewModel
    })

    assert.equal(collection.length, 0, "no models")
    assert.equal(collection_observable().length, 0, "no view models")

    collection.add(new Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    assert.equal(collection.length, 2, "two models")
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    assert.equal(collection.models[1].get('name'), 'George', "George is second")
    assert.equal(collection_observable().length, 2, "two view models")
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Ringo', "Ringo is first - no sorting")
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'George', "George is first - no sorting")

    collection_observable.sortAttribute('name')
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    assert.equal(collection.models[1].get('name'), 'George', "George is second")
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!")
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Ringo', "Ringo is second - sorting worked!")

    collection.add(new Contact({id: 'b3', name: 'Paul', number: '555-555-5554'}))
    assert.equal(collection.length, 3, "three models")
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    assert.equal(collection.models[1].get('name'), 'George', "George is second")
    assert.equal(collection.models[2].get('name'), 'Paul', "Paul is second")
    assert.equal(collection_observable().length, 3, "two view models")
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!")
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Paul', "Paul is second - sorting worked!")
    assert.equal(kb.utils.wrappedModel(collection_observable()[2]).get('name'), 'Ringo', "Ringo is third - sorting worked!")

    collection_observable.sortAttribute('number')
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    assert.equal(collection.models[1].get('name'), 'George', "George is second")
    assert.equal(collection.models[2].get('name'), 'Paul', "Paul is second")
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Paul', "Paul is first - sorting worked!")
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'George', "Paul is second - sorting worked!")
    assert.equal(kb.utils.wrappedModel(collection_observable()[2]).get('name'), 'Ringo', "Ringo is third - sorting worked!")

    collection_observable.sortAttribute('name')
    collection.remove('b2'); collection.remove('b3')
    assert.equal(collection.length, 1, "one models")
    assert.equal(collection_observable().length, 1, "one view models")
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is left")
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Ringo', "Ringo is left")

    collection.reset()
    assert.equal(collection.length, 0, "no models")
    assert.equal(collection_observable().length, 0, "no view models")

    # clean up
    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '10. Nested custom view models', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelDate extends kb.ViewModel
      constructor: (model, options) ->
        super(model, _.extend({requires: ['date']}, options))

    john_birthdate = new Date(1940, 10, 9)
    john = new Contact({name: 'John', date: new Date(john_birthdate.valueOf())})
    paul_birthdate = new Date(1942, 6, 18)
    paul = new Contact({name: 'Paul', date: new Date(paul_birthdate.valueOf())})
    george_birthdate = new Date(1943, 2, 25)
    george = new Contact({name: 'George', date: new Date(george_birthdate.valueOf())})
    ringo_birthdate = new Date(1940, 7, 7)
    ringo = new Contact({name: 'Ringo', date: new Date(ringo_birthdate.valueOf())})
    major_duo = new kb.Collection([john, paul])
    minor_duo = new kb.Collection([george, ringo])

    nested_view_model = {
      major_duo1: kb.collectionObservable(major_duo)
      major_duo2: kb.collectionObservable(major_duo, {models_only: true})
      major_duo3: kb.collectionObservable(major_duo, {view_model: kb.ViewModel})
      major_duo4: kb.collectionObservable(major_duo, {view_model: ContactViewModelDate})
      major_duo5: kb.collectionObservable(major_duo, {create: (model, options) -> return new ContactViewModelDate(model, options)})
      major_duo6: kb.collectionObservable(major_duo, {create: (model, options) -> return if model.get('name') is 'John' then new ContactViewModelDate(model, options) else kb.viewModel(model, options)}) # mixed
      minor_duo1: kb.collectionObservable(minor_duo, {factories: {}})
      minor_duo2: kb.collectionObservable(minor_duo, {factories: models: {models_only: true}})
      minor_duo3: kb.collectionObservable(minor_duo, {factories: models: kb.ViewModel})
      minor_duo4: kb.collectionObservable(minor_duo, {factories: models: {view_model: ContactViewModelDate}})
      minor_duo5: kb.collectionObservable(minor_duo, {factories: models: {create: (model, options) -> return new ContactViewModelDate(model, options)}})
      minor_duo6: kb.collectionObservable(minor_duo, {factories: models: {create: (model, options) -> return if model.get('name') is 'George' then new ContactViewModelDate(model, options) else kb.viewModel(model, options)}}) # mixed
    }

    validateContactViewModel = (view_model, name, birthdate) ->
      model = kb.utils.wrappedModel(view_model)
      assert.equal(view_model.name(), name, "#{name}: Name matches")

      # set from the view model
      view_model.date(new Date(1963, 11, 10))
      current_date = model.get('date')
      assert.equal(current_date.getFullYear(), 1963, "#{name}: year is good")
      assert.equal(current_date.getMonth(), 11, "#{name}: month is good")
      assert.equal(current_date.getDate(), 10, "#{name}: day is good")
      assert.equal(view_model.date().getFullYear(), 1963, "#{name}: year is good")
      assert.equal(view_model.date().getMonth(), 11, "#{name}: month is good")
      assert.equal(view_model.date().getDate(), 10, "#{name}: day is good")

      model.set({date: new Date(birthdate.valueOf())}) # restore birthdate

      # set from the model
      view_model.date(new Date(1940, 10, 10))
      current_date = model.get('date')
      assert.equal(current_date.getFullYear(), 1940, "#{name}: year is good")
      assert.equal(current_date.getMonth(), 10, "#{name}: month is good")
      assert.equal(current_date.getDate(), 10, "#{name}: day is good")
      assert.equal(view_model.date().getFullYear(), 1940, "#{name}: year is good")
      assert.equal(view_model.date().getMonth(), 10, "#{name}: month is good")
      assert.equal(view_model.date().getDate(), 10, "#{name}: day is good")

      model.set({date: new Date(birthdate.valueOf())}) # restore birthdate

    validateGenericViewModel = (view_model, name, birthdate) ->
      assert.equal(view_model.name(), name, "#{name}: Name matches")
      assert.equal(view_model.date().valueOf(), birthdate.valueOf(), "#{name}: Birthdate matches")

    validateModel = (model, name, birthdate) ->
      assert.equal(model.get('name'), name, "#{name}: Name matches")
      assert.equal(model.get('date').valueOf(), birthdate.valueOf(), "#{name}: Birthdate matches")

    # colllections
    validateGenericViewModel(nested_view_model.major_duo1()[0], 'John', john_birthdate)
    validateGenericViewModel(nested_view_model.major_duo1()[1], 'Paul', paul_birthdate)
    validateModel(nested_view_model.major_duo2()[0], 'John', john_birthdate)
    validateModel(nested_view_model.major_duo2()[1], 'Paul', paul_birthdate)
    validateGenericViewModel(nested_view_model.major_duo3()[0], 'John', john_birthdate)
    validateGenericViewModel(nested_view_model.major_duo3()[1], 'Paul', paul_birthdate)
    validateContactViewModel(nested_view_model.major_duo4()[0], 'John', john_birthdate)
    validateContactViewModel(nested_view_model.major_duo4()[1], 'Paul', paul_birthdate)
    validateContactViewModel(nested_view_model.major_duo5()[0], 'John', john_birthdate)
    validateContactViewModel(nested_view_model.major_duo5()[1], 'Paul', paul_birthdate)
    validateContactViewModel(nested_view_model.major_duo6()[0], 'John', john_birthdate) # mixed
    validateGenericViewModel(nested_view_model.major_duo6()[1], 'Paul', paul_birthdate) # mixed

    validateGenericViewModel(nested_view_model.minor_duo1()[0], 'George', george_birthdate)
    validateGenericViewModel(nested_view_model.minor_duo1()[1], 'Ringo', ringo_birthdate)
    validateModel(nested_view_model.minor_duo2()[0], 'George', george_birthdate)
    validateModel(nested_view_model.minor_duo2()[1], 'Ringo', ringo_birthdate)
    validateGenericViewModel(nested_view_model.minor_duo3()[0], 'George', george_birthdate)
    validateGenericViewModel(nested_view_model.minor_duo3()[1], 'Ringo', ringo_birthdate)
    validateContactViewModel(nested_view_model.minor_duo4()[0], 'George', george_birthdate)
    validateContactViewModel(nested_view_model.minor_duo4()[1], 'Ringo', ringo_birthdate)
    validateContactViewModel(nested_view_model.minor_duo5()[0], 'George', george_birthdate)
    validateContactViewModel(nested_view_model.minor_duo5()[1], 'Ringo', ringo_birthdate)
    validateContactViewModel(nested_view_model.minor_duo6()[0], 'George', george_birthdate) # mixed
    validateGenericViewModel(nested_view_model.minor_duo6()[1], 'Ringo', ringo_birthdate) # mixed

    # and cleanup after yourself when you are done.
    kb.release(nested_view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '11. Shared Options', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats
    collection = new kb.Collection({id: 1, name: 'Bob'})

    collection_observable1 = kb.collectionObservable(collection)
    collection_observable2 = kb.collectionObservable(collection)
    collection_observable3 = kb.collectionObservable(collection, collection_observable1.shareOptions())

    assert.ok(collection_observable1()[0] isnt collection_observable2()[0], 'not sharing')
    assert.ok(collection_observable1()[0] is collection_observable3()[0], 'sharing')

    kb.release([collection_observable1, collection_observable2, collection_observable3])

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '12. Filters option', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats
    collection = new kb.Collection([{id: 1, name: 'Bob'}, {id: 2, name: 'Fred'}, {id: 3, name: 'George'}])

    collection_observable1 = kb.collectionObservable(collection)
    collection_observable2 = kb.collectionObservable(collection, {filters: 1})
    collection_observable3 = kb.collectionObservable(collection, {filters: [2]})
    collection_observable4 = kb.collectionObservable(collection, {filters: 5})
    collection_observable5 = kb.collectionObservable(collection, {filters: [5]})
    collection_observable6 = kb.collectionObservable(collection, {filters: (model) -> model.get('name') isnt 'George'})
    collection_observable7 = kb.collectionObservable(collection, {filters: [((model) -> model.get('name') isnt 'Bob'), ((model) -> return model.get('name') isnt 'Fred')]})
    observable1 = ko.computed(-> _.filter(collection_observable6(), (vm) -> vm.name() is 'Bob'))

    assert.equal(_.map(_.map(collection_observable1(), (x) -> x.name), (o) -> o()).join(', '), 'Bob, Fred, George')
    assert.equal(_.map(_.map(collection_observable2(), (x) -> x.name), (o) -> o()).join(', '), 'Bob')
    assert.equal(_.map(_.map(collection_observable3(), (x) -> x.name), (o) -> o()).join(', '), 'Fred')
    assert.equal(_.map(_.map(collection_observable4(), (x) -> x.name), (o) -> o()).join(', '), '')
    assert.equal(_.map(_.map(collection_observable5(), (x) -> x.name), (o) -> o()).join(', '), '')
    assert.equal(_.map(_.map(collection_observable6(), (x) -> x.name), (o) -> o()).join(', '), 'Bob, Fred')
    assert.equal(_.map(_.map(collection_observable7(), (x) -> x.name), (o) -> o()).join(', '), 'George')
    assert.equal(_.map(_.map(observable1(), (x) -> x.name), (o) -> o()).join(', '), 'Bob')

    collection.add([{id: 4, name: 'Bob'}, {id: 5, name: 'Fred'}, {id: 6, name: 'George'}, {id: 7, name: 'Mary'}])

    assert.equal(_.map(_.map(collection_observable1(), (x) -> x.name), (o) -> o()).join(', '), 'Bob, Fred, George, Bob, Fred, George, Mary')
    assert.equal(_.map(_.map(collection_observable2(), (x) -> x.name), (o) -> o()).join(', '), 'Bob')
    assert.equal(_.map(_.map(collection_observable3(), (x) -> x.name), (o) -> o()).join(', '), 'Fred')
    assert.equal(_.map(_.map(collection_observable4(), (x) -> x.name), (o) -> o()).join(', '), 'Fred')
    assert.equal(_.map(_.map(collection_observable5(), (x) -> x.name), (o) -> o()).join(', '), 'Fred')
    assert.equal(_.map(_.map(collection_observable6(), (x) -> x.name), (o) -> o()).join(', '), 'Bob, Fred, Bob, Fred, Mary')
    assert.equal(_.map(_.map(collection_observable7(), (x) -> x.name), (o) -> o()).join(', '), 'George, George, Mary')
    assert.equal(_.map(_.map(observable1(), (x) -> x.name), (o) -> o()).join(', '), 'Bob, Bob')

    kb.release([collection_observable1, collection_observable2, collection_observable3, collection_observable4, collection_observable5, collection_observable6, collection_observable7, observable1])

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '13. Setting view models', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats
    collection = new kb.Collection([{id: 1, name: 'Bob'}, {id: 2, name: 'Fred'}, {id: 3, name: 'George'}])

    # set the viewmodels (simulating a selectOptions)
    collection_observable = kb.collectionObservable(collection)
    view_models = _.map(collection.models, (model) -> kb.viewModel(model))
    previous_view_model = collection_observable()[0]
    collection_observable(view_models)
    assert.ok(collection_observable()[0] isnt previous_view_model, 'view model updated')
    assert.ok(collection_observable()[0] is view_models[0], 'view model updated from new list')
    store = kb.utils.wrappedStore(collection_observable)
    store.compact() # ensure compact does not throw
    assert.ok(store.find(collection.models[0], kb.ViewModel) is view_models[0], 'view model was added to the store')
    assert.ok(store.find(collection.models[0], kb.ViewModel) isnt previous_view_model, 'previous view model was removed from the store')
    kb.release(view_models)
    kb.release(collection_observable)

    # set the viewmodels (simulating a selectOptions)
    class SpecializedViewModel extends kb.ViewModel
    collection_observable = kb.collectionObservable(collection)
    view_models = _.map(collection.models, (model) -> new SpecializedViewModel(model))
    previous_view_model = collection_observable()[0]
    assert.throw((->collection_observable(view_models)))
    # assert.throw((->collection_observable(view_models)), null, 'Store: replacing different type')
    assert.ok(collection_observable()[0] isnt previous_view_model, 'view model updated')
    assert.ok(collection_observable()[0] is view_models[0], 'view model updated from new list')
    store = kb.utils.wrappedStore(collection_observable)
    store.compact() # ensure compact does not throw
    assert.ok(store.find(collection.models[0], kb.ViewModel) isnt view_models[0], 'view model was not added to the store')
    assert.ok(store.find(collection.models[0], kb.ViewModel) is previous_view_model, 'previous view model was not removed from the store')
    kb.release(view_models)
    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '14. collection change is observable', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats
    collection = new kb.Collection([{id: 1, name: 'Bob'}, {id: 2, name: 'Fred'}, {id: 3, name: 'George'}])

    collection_observable = kb.collectionObservable(collection)

    count = 0
    ko.computed(-> collection_observable.collection(); count++)
    assert.ok(collection_observable()[0] instanceof kb.ViewModel, 'is a kb.ViewModel')

    collection_observable.collection(null)
    collection_observable.collection(collection)
    assert.equal(count, 3, "collection change was observed")
    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '15. collection is generated if not passed (no options)', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection_observable = kb.collectionObservable()
    collection = collection_observable.collection()
    collection.reset([{id: 1, name: 'Bob'}, {id: 2, name: 'Fred'}, {id: 3, name: 'George'}])

    count = 0
    ko.computed(-> collection_observable.collection(); count++)
    assert.ok(collection_observable()[0] instanceof kb.ViewModel, 'is a kb.ViewModel')

    collection_observable.collection(null)
    collection_observable.collection(collection)
    assert.equal(count, 3, "collection change was observed")
    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '16. collection is generated if not passed (options)', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection_observable = kb.collectionObservable({view_model: ContactViewModel})
    collection = collection_observable.collection()
    collection.reset([{id: 1, name: 'Bob'}, {id: 2, name: 'Fred'}, {id: 3, name: 'George'}])

    count = 0
    ko.computed(-> collection_observable.collection(); count++)
    assert.ok(collection_observable()[0] instanceof ContactViewModel, 'is a ContactViewModel')

    collection_observable.collection(null)
    collection_observable.collection(collection)
    assert.equal(count, 3, "collection change was observed")
    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '17. collection changes do not cause dependencies inside ko.computed', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection_observable = kb.collectionObservable({view_model: TestViewModel})
    collection = collection_observable.collection()

    count_manual = 0
    ko.computed ->
      collection_observable([new TestViewModel(new kb.Model({id: 10, name: 'Manual'}))]) # should not depend
      count_manual++

    count_reset = 0
    ko.computed ->
      collection.reset([{id: 20, name: 'Reset1'}, {id: 21, name: 'Reset2'}]) # should not depend
      count_reset++

    count_add = 0
    ko.computed ->
      collection.add([{id: 30, name: 'Add1'}, {id: 31, name: 'Add2'}]) # should not depend
      count_add++

    count_remove = 0
    ko.computed ->
      collection.remove(collection.at(0))
      count_remove++

    observable_count = 0
    ko.computed ->
      collection_observable() # should depend
      observable_count++

    assert.equal(count_manual, 1, 'count_manual'); assert.equal(count_reset, 1, 'count_reset'); assert.equal(count_add, 1, 'count_add'); assert.equal(count_remove, 1, 'count_remove'); assert.equal(observable_count, 1, 'observable_count')

    collection_observable([new TestViewModel(new kb.Model({id: 10, name: 'Manual'}))]) # should not depend
    collection.reset([{id: 20, name: 'Reset1'}, {id: 21, name: 'Reset2'}]) # should not depend
    collection.add([{id: 30, name: 'Add1'}, {id: 31, name: 'Add2'}]) # should not depend
    collection.remove(collection.at(0))
    assert.equal(count_manual, 1, 'count_manual'); assert.equal(count_reset, 1, 'count_reset'); assert.equal(count_add, 1, 'count_add'); assert.equal(count_remove, 1, 'count_remove'); assert.equal(observable_count, 6, 'observable_count')

    view_model = collection_observable()[0]
    model = view_model.model()
    model.set({name: 'Bob2'})
    assert.equal(view_model.name(), 'Bob2')
    view_model.test('world')
    assert.equal(view_model.test(), 'world')
    assert.equal(count_manual, 1, 'count_manual'); assert.equal(count_reset, 1, 'count_reset'); assert.equal(count_add, 1, 'count_add'); assert.equal(count_remove, 1, 'count_remove'); assert.equal(observable_count, 6, 'observable_count')

    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '18. Test auto-generate collections', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    models = (new Contact({id: id}) for id in [1..4])
    class PersonViewModel extends kb.ViewModel
    collection_observable = kb.collectionObservable({view_model: PersonViewModel})

    collection_observable.collection().reset(models)
    assert.equal(collection_observable.collection().length, 4)

    for view_models in collection_observable()
      assert.ok(!!view_models.date())
      assert.ok(view_models.model() instanceof Contact)

    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '19. Test auto-generate collections with model array', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    models = (new Contact({id: id}) for id in [1..4])
    class PersonViewModel extends kb.ViewModel
    collection_observable = kb.collectionObservable(models, {view_model: PersonViewModel})
    assert.equal(collection_observable.collection().length, 4)

    for view_model in collection_observable()
      assert.ok(!!view_model.date())
      assert.ok(view_model.model() instanceof Contact)

    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '20. push and unshift', (done) ->
    return done() if kb.Backbone and kb.Backbone.VERSION[0] isnt '1'

    kb.statistics = new kb.Statistics() # turn on stats

    class PersonViewModel extends kb.ViewModel
    collection_observable = kb.collectionObservable(new Contacts(), {view_model: PersonViewModel})

    # LEGACY
    if collection_observable.collection().push
      collection_observable.collection().push()
      assert.equal(collection_observable.collection().length, 0)
      assert.equal(collection_observable().length, 0)
      collection_observable.collection().push(null)
      assert.equal(collection_observable.collection().length, 0)
      assert.equal(collection_observable().length, 0)
      collection_observable.collection().push(new Contact())
      assert.equal(collection_observable.collection().length, 1)
      assert.equal(collection_observable().length, 1)
      collection_observable.collection().reset()
      assert.equal(collection_observable.collection().length, 0)
      assert.equal(collection_observable().length, 0)

    # LEGACY
    if collection_observable.collection().unshift
      collection_observable.collection().unshift()
      assert.equal(collection_observable.collection().length, 0)
      assert.equal(collection_observable().length, 0)
      collection_observable.collection().unshift(null)
      assert.equal(collection_observable.collection().length, 0)
      assert.equal(collection_observable().length, 0)
      collection_observable.collection().unshift(new Contact())
      assert.equal(collection_observable.collection().length, 1)
      assert.equal(collection_observable().length, 1)
      collection_observable.collection().reset()
      assert.equal(collection_observable.collection().length, 0)
      assert.equal(collection_observable().length, 0)

    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '21. Auto compact for collections', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    models = (new Contact({id: id}) for id in [1..4])
    class PersonViewModel extends kb.ViewModel
    collection_observable = kb.collectionObservable(models, {view_model: PersonViewModel, auto_compact: true})
    collection = collection_observable.collection()
    assert.equal(collection_observable.collection().length, 4)

    previous_view_models = collection_observable().slice()
    assert.equal(previous_view_models.length, 4)
    assert.equal(kb.statistics.registeredStatsString('all released'), 'ViewModel: 4\n CollectionObservable: 1', "Expected stats")

    collection_observable.collection().add(new Contact({id: 5}))
    new_view_models = collection_observable()
    assert.equal(new_view_models.length, 5)
    assert.equal(previous_view_models.length, 4)
    for vm in new_view_models
      if vm.model() is collection_observable.collection().models[4]
        assert.ok(not(vm in previous_view_models))
      else
        assert.ok(vm in previous_view_models)

    models = collection_observable.collection().models.slice()
    collection_observable.collection().reset(models)
    new_view_models = collection_observable()
    assert.equal(new_view_models.length, 5)
    assert.equal(previous_view_models.length, 4)
    assert.ok(not(vm in previous_view_models)) for vm in new_view_models

    kb.release(collection_observable)

    assert.ok(kb.Statistics.eventsStats(collection).count is 0, "All collection events cleared. Expected: 0. Actual: #{JSON.stringify(kb.Statistics.eventsStats(collection))}")
    for model in models
      collection.remove(model)
      assert.ok(kb.Statistics.eventsStats(model).count is 0, "All model events cleared. Expected: 0. Actual: #{JSON.stringify(kb.Statistics.eventsStats(model))}")
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '22. reduced form for view models', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    class PersonViewModel extends kb.ViewModel
    collection_observable = kb.collectionObservable(PersonViewModel)
    assert.equal collection_observable.collection().length, 0, 'no view models'
    collection_observable.collection().reset((new Contact({id: id}) for id in [1..4]))
    assert.equal collection_observable.collection().length, 4, '4 view models'

    for view_model in collection_observable()
      assert.ok view_model instanceof PersonViewModel, 'view model correct type'
      assert.ok !!view_model.date()
      assert.ok view_model.model() instanceof Contact, 'model correct type'

    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '23. reduced form for view models with options', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    class PersonViewModel extends kb.ViewModel
    class OtherViewModel extends kb.ViewModel
    collection_observable = kb.collectionObservable(PersonViewModel, {factories: {'models.other': OtherViewModel}})
    assert.equal collection_observable.collection().length, 0, 'no view models'
    collection_observable.collection().reset((new Contact({id: id, other: null}) for id in [1..4]))
    assert.equal collection_observable.collection().length, 4, '4 view models'

    for view_model in collection_observable()
      assert.ok view_model instanceof PersonViewModel, 'view model correct type'
      assert.ok !!view_model.date()
      assert.ok view_model.model() instanceof Contact, 'model correct type'
      assert.ok view_model.other() instanceof OtherViewModel, 'view_model correct type'

    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '24. expanded form for collection, view models with options', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    class PersonViewModel extends kb.ViewModel
    class OtherViewModel extends kb.ViewModel
    collection_observable = kb.collectionObservable(new kb.Collection(), PersonViewModel, {factories: {'models.other': OtherViewModel}})
    assert.equal collection_observable.collection().length, 0, 'no view models'
    collection_observable.collection().reset((new Contact({id: id, other: null}) for id in [1..4]))
    assert.equal collection_observable.collection().length, 4, '4 view models'

    for view_model in collection_observable()
      assert.ok view_model instanceof PersonViewModel, 'view model correct type'
      assert.ok !!view_model.date()
      assert.ok view_model.model() instanceof Contact, 'model correct type'
      assert.ok view_model.other() instanceof OtherViewModel, 'view_model correct type'

    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '24. expanded form for collection, view models with many options', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    class PersonViewModel extends kb.ViewModel
    class OtherViewModel extends kb.ViewModel
    collection_observable = kb.collectionObservable(new kb.Collection(), PersonViewModel, {}, {}, {}, {factories: {'models.other': OtherViewModel}})
    assert.equal collection_observable.collection().length, 0, 'no view models'
    collection_observable.collection().reset((new Contact({id: id, other: null}) for id in [1..4]))
    assert.equal collection_observable.collection().length, 4, '4 view models'

    for view_model in collection_observable()
      assert.ok view_model instanceof PersonViewModel, 'view model correct type'
      assert.ok !!view_model.date()
      assert.ok view_model.model() instanceof Contact, 'model correct type'
      assert.ok view_model.other() instanceof OtherViewModel, 'view_model correct type'

    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '25. Test auto-generate collections (kb.observableCollection)', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    models = (new Contact({id: id}) for id in [1..4])
    class PersonViewModel extends kb.ViewModel
    collection_observable = kb.observableCollection({view_model: PersonViewModel})

    collection_observable.collection().reset(models)
    assert.equal(collection_observable.collection().length, 4)

    for view_models in collection_observable()
      assert.ok(!!view_models.date())
      assert.ok(view_models.model() instanceof Contact)

    kb.release(collection_observable)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()
