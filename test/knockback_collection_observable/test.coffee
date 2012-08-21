$(document).ready( ->
  module("knockback_collection_observable.js")

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  if (typeof(require) != 'undefined') then _ = require('underscore') else _ = window._
  _ = _._ if _ and (_.hasOwnProperty('_')) # LEGACY
  Backbone = if not window.Backbone and (typeof(require) != 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) != 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) != 'undefined') then require('knockback') else window.kb
  _kbe = if not window._kbe and (typeof(require) != 'undefined') then require('knockback-examples') else window._kbe

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko); ok(!!_); ok(!!Backbone); ok(!!kb); ok(!!_kbe)
  )

  kb.locale_manager = new _kbe.LocaleManager('en', {})

  ContactViewModel = (model) ->
    @name = kb.observable(model, 'name')
    @number = kb.observable(model, 'number')
    @

  class ContactViewModelClass
    constructor: (model) ->
      @name = kb.observable(model, 'name')
      @number = kb.observable(model, 'number')

  test("Basic Usage: collection observable with ko.dependentObservable", ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection = new _kbe.ContactsCollection()
    collection_observable = kb.collectionObservable(collection)
    view_model =
      count: ko.dependentObservable(->return collection_observable().length )

    equal(collection.length, 0, "no models")
    equal(view_model.count(), 0, "no count")

    collection.add(new _kbe.Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new _kbe.Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    equal(collection.length, 2, "2 models")
    equal(view_model.count(), 2, "2 count")

    collection.add(new _kbe.Contact({id: 'b3', name: 'Paul', number: '555-555-5557'}))
    equal(collection.length, 3, "3 models")
    equal(view_model.count(), 3, "3 count")

    collection.remove('b2').remove('b3')
    equal(collection.length, 1, "1 model")
    equal(view_model.count(), 1, "1 count")

    # clean up
    kb.release(collection_observable)
    kb.release(view_model)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("Basic Usage: collection observable with ko.dependentObservable", ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection = new _kbe.ContactsCollection()
    collection_observable = kb.collectionObservable(collection, {
      models: ContactViewModel
    })

    view_model =
      count: ko.dependentObservable(->return collection_observable().length )

    equal(collection.length, 0, "no models")
    equal(view_model.count(), 0, "no count")

    collection.add(new _kbe.Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new _kbe.Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    equal(collection.length, 2, "2 models")
    equal(view_model.count(), 2, "2 count")

    collection.add(new _kbe.Contact({id: 'b3', name: 'Paul', number: '555-555-5557'}))
    equal(collection.length, 3, "3 models")
    equal(view_model.count(), 3, "3 count")

    collection.remove('b2').remove('b3')
    equal(collection.length, 1, "1 model")
    equal(view_model.count(), 1, "1 count")

    # clean up
    kb.release(collection_observable)
    kb.release(view_model)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("Basic Usage: no view models", ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection = new _kbe.ContactsCollection()

    collection_observable = kb.collectionObservable(collection, {models_only: true})

    equal(collection.length, 0, "no models")
    equal(collection_observable().length, 0, "no view models")

    collection.add(new _kbe.Contact({id: 'b1', name: 'Ringo', number: '555-555-5555'}))
    collection.add(new _kbe.Contact({id: 'b2', name: 'George', number: '555-555-5556'}))
    equal(collection.length, 2, "two models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    equal(collection.models[1].get('name'), 'George', "George is second")
    equal(collection_observable().length, 2, "two view models")
    equal(collection_observable()[0].get('name'), 'Ringo', "Ringo is first")
    equal(collection_observable()[1].get('name'), 'George', "George is second")

    collection.remove('b2')
    equal(collection.length, 1, "one models")
    equal(collection_observable().length, 1, "one view models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is left")
    model = kb.utils.wrappedModel(collection_observable()[0])
    equal(model.get('name'), 'Ringo', "Ringo is left")
    model = collection_observable()[0]
    equal(model.get('name'), 'Ringo', "Ringo is left")

    view_model = collection_observable.viewModelByModel(model)
    ok(!view_model, "no view model found since the collection observable is not wrapping models in view models")

    model_count = 0
    _.each(collection_observable(), (model)->model_count++)
    equal(model_count, 1, "one model")

    ok(collection_observable.collection()==collection, "collections match")

    # clean up
    kb.release(collection_observable)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("Basic Usage: no sorting and no callbacks", ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection = new _kbe.ContactsCollection()
    collection_observable = kb.collectionObservable(collection, {
      factories:
        models: {create: (model) -> return new ContactViewModel(model)}
    })

    equal(collection.length, 0, "no models")
    equal(collection_observable().length, 0, "no view models")

    collection.add(new _kbe.Contact({id: 'b1', name: 'Ringo', number: '555-555-5555'}))
    collection.add(new _kbe.Contact({id: 'b2', name: 'George', number: '555-555-5556'}))
    equal(collection.length, 2, "two models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    equal(collection.models[1].get('name'), 'George', "George is second")
    equal(collection_observable().length, 2, "two view models")
    equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Ringo', "Ringo is first")
    equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'George', "George is second")

    collection.remove('b2')
    equal(collection.length, 1, "one model")
    equal(collection_observable().length, 1, "one view model")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is left")
    model = kb.utils.wrappedModel(collection_observable()[0])
    equal(model.get('name'), 'Ringo', "Ringo is left")

    view_model = collection_observable.viewModelByModel(model)
    equal(kb.utils.wrappedModel(view_model).get('name'), 'Ringo', "Ringo is left")

    view_model_count = 0
    _.each(collection_observable(), (view_model)->view_model_count++)
    equal(view_model_count, 1, "one view model")

    ok(collection_observable.collection()==collection, "collections match")

    # clean up
    kb.release(collection_observable)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("Collection sync sorting with sort_attribute", ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection = new _kbe.ContactsCollection()
    view_model_count = 0; view_model_resort_count = 0

    collection_observable = kb.collectionObservable(collection, {
      view_model:           ContactViewModelClass
      sort_attribute:       'name'
    })
    collection_observable.bind('add', (view_model, collection_observable) -> if _.isArray(view_model) then (view_model_count+=view_model.length) else view_model_count++)
    collection_observable.bind('resort', (view_model, collection_observable, new_index) -> if _.isArray(view_model) then (view_model_resort_count+=view_model.length) else view_model_resort_count++ )
    collection_observable.bind('remove', (view_model, collection_observable) -> if _.isArray(view_model) then (view_model_count-=view_model.length) else view_model_count--)

    equal(collection.length, 0, "no models")
    equal(view_model_count, 0, "no view models")
    equal(collection_observable().length, 0, "no view models")

    collection.add(new _kbe.Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new _kbe.Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    equal(collection.length, 2, "two models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    equal(collection.models[1].get('name'), 'George', "George is second")
    equal(view_model_count, 2, "two view models")
    equal(collection_observable().length, 2, "two view models")
    equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!")
    equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Ringo', "Ringo is second - sorting worked!")

    collection.add(new _kbe.Contact({id: 'b3', name: 'Paul', number: '555-555-5557'}))
    equal(collection.length, 3, "three models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    equal(collection.models[1].get('name'), 'George', "George is second")
    equal(collection.models[2].get('name'), 'Paul', "Paul is second")
    equal(view_model_count, 3, "three view models")
    equal(collection_observable().length, 3, "two view models")
    equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!")
    equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Paul', "Paul is second - sorting worked!")
    equal(kb.utils.wrappedModel(collection_observable()[2]).get('name'), 'Ringo', "Ringo is third - sorting worked!")

    collection.remove('b2').remove('b3')
    equal(collection.length, 1, "one model")
    equal(view_model_count, 1, "one view model")
    equal(collection_observable().length, 1, "one view model")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is left")
    equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Ringo', "Ringo is left")

    collection.reset()
    equal(collection.length, 0, "no models")
    equal(view_model_count, 0, "no view models")
    equal(collection_observable().length, 0, "no view models")
    ok(view_model_resort_count==0, "not resorting happened because everything was inserted once") # TODO: make a rigorous check

    # clean up
    kb.release(collection_observable)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("Collection sync sorting with sorted_index", ->
    kb.statistics = new kb.Statistics() # turn on stats

    view_model_count = 0; view_model_resort_count = 0

    class SortWrapper
      constructor: (value) ->
        @parts = value.split('-')
      compare: (that) ->
        return (that.parts.length-@parts.length) if @parts.length != that.parts.length
        for index, part of @parts
          diff = that.parts[index] - Math.parseInt(part, 10)
          return diff unless diff is 0
        return 0

    # without view models
    collection = new _kbe.ContactsCollection()
    collection_observable = kb.collectionObservable(collection, {
      models_only:              true
      sorted_index:             kb.siwa('number', SortWrapper)
    })
    collection.add(new _kbe.Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new _kbe.Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    equal(collection.length, 2, "two models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    equal(collection.models[1].get('name'), 'George', "George is second")
    equal(collection_observable().length, 2, "two view models")
    equal(collection_observable()[0].get('name'), 'George', "George is first - sorting worked!")
    equal(collection_observable()[1].get('name'), 'Ringo', "Ringo is second - sorting worked!")

    # clean up
    kb.release(collection_observable)

    # with view models
    collection = new _kbe.ContactsCollection()
    collection_observable = kb.collectionObservable(collection, {
      view_model:         ContactViewModelClass
      sorted_index:       kb.siwa('number', SortWrapper)
    })
    collection.add(new _kbe.Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new _kbe.Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    equal(collection.length, 2, "two models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    equal(collection.models[1].get('name'), 'George', "George is second")
    equal(collection_observable().length, 2, "two view models")
    equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!")
    equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Ringo', "Ringo is second - sorting worked!")

    # clean up
    kb.release(collection_observable)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("Collection sorting with callbacks", ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection = new _kbe.NameSortedContactsCollection()
    view_model_count = 0; view_model_resort_count = 0

    collection_observable = kb.collectionObservable(collection, {
      view_model:       ContactViewModel    # view_model is legacy for view_model, it should be replaced with view_model or create
    })
    collection_observable.bind('add', (view_model, collection_observable) -> if _.isArray(view_model) then (view_model_count+=view_model.length) else view_model_count++)
    collection_observable.bind('resort', (view_model, collection_observable, new_index) -> if _.isArray(view_model) then (view_model_resort_count+=view_model.length) else view_model_resort_count++ )
    collection_observable.bind('remove', (view_model, collection_observable) -> if _.isArray(view_model) then (view_model_count-=view_model.length) else view_model_count--)

    equal(collection.length, 0, "no models")
    equal(collection_observable().length, 0, "no view models")

    collection.add(new _kbe.Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new _kbe.Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    equal(collection.length, 2, "two models")
    equal(collection.models[0].get('name'), 'George', "George is first")
    equal(collection.models[1].get('name'), 'Ringo', "Ringo is second")
    equal(view_model_count, 2, "two view models")
    equal(collection_observable().length, 2, "two view models")
    equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!")
    equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Ringo', "Ringo is second - sorting worked!")

    collection.add(new _kbe.Contact({id: 'b3', name: 'Paul', number: '555-555-5557'}))
    equal(collection.length, 3, "three models")
    equal(collection.models[0].get('name'), 'George', "George is first")
    equal(collection.models[1].get('name'), 'Paul', "Paul is second")
    equal(collection.models[2].get('name'), 'Ringo', "Ringo is second")
    equal(view_model_count, 3, "three view models")
    equal(collection_observable().length, 3, "two view models")
    equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!")
    equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Paul', "Paul is second - sorting worked!")
    equal(kb.utils.wrappedModel(collection_observable()[2]).get('name'), 'Ringo', "Ringo is third - sorting worked!")

    collection.remove('b2').remove('b3')
    equal(collection.length, 1, "one models")
    equal(view_model_count, 1, "one view models")
    equal(collection_observable().length, 1, "one view models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is left")
    equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Ringo', "Ringo is left")

    collection.reset()
    equal(collection.length, 0, "no models")
    equal(view_model_count, 0, "no view models")
    equal(collection_observable().length, 0, "no view models")
    ok(view_model_resort_count==0, "not resorting happened because everything was inserted once") # TODO: make a rigorous check

    # clean up
    kb.release(collection_observable)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("Collection sync dynamically changing the sorting function", ->
    kb.statistics = new kb.Statistics() # turn on stats

    collection = new _kbe.ContactsCollection()
    collection_observable = kb.collectionObservable(collection, {
      view_model:       ContactViewModel
    })

    equal(collection.length, 0, "no models")
    equal(collection_observable().length, 0, "no view models")

    collection.add(new _kbe.Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new _kbe.Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    equal(collection.length, 2, "two models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    equal(collection.models[1].get('name'), 'George', "George is second")
    equal(collection_observable().length, 2, "two view models")
    equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Ringo', "Ringo is first - no sorting")
    equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'George', "George is first - no sorting")

    collection_observable.sortedIndex(((view_models, vm) -> _.sortedIndex(view_models, vm, (test) -> kb.utils.wrappedModel(test).get('name'))), 'name')
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    equal(collection.models[1].get('name'), 'George', "George is second")
    equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!")
    equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Ringo', "Ringo is second - sorting worked!")

    collection.add(new _kbe.Contact({id: 'b3', name: 'Paul', number: '555-555-5554'}))
    equal(collection.length, 3, "three models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    equal(collection.models[1].get('name'), 'George', "George is second")
    equal(collection.models[2].get('name'), 'Paul', "Paul is second")
    equal(collection_observable().length, 3, "two view models")
    equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!")
    equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Paul', "Paul is second - sorting worked!")
    equal(kb.utils.wrappedModel(collection_observable()[2]).get('name'), 'Ringo', "Ringo is third - sorting worked!")

    collection_observable.sortAttribute('number')
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    equal(collection.models[1].get('name'), 'George', "George is second")
    equal(collection.models[2].get('name'), 'Paul', "Paul is second")
    equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Paul', "Paul is first - sorting worked!")
    equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'George', "Paul is second - sorting worked!")
    equal(kb.utils.wrappedModel(collection_observable()[2]).get('name'), 'Ringo', "Ringo is third - sorting worked!")

    collection_observable.sortAttribute('name')
    collection.remove('b2').remove('b3')
    equal(collection.length, 1, "one models")
    equal(collection_observable().length, 1, "one view models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is left")
    equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Ringo', "Ringo is left")

    collection.reset()
    equal(collection.length, 0, "no models")
    equal(collection_observable().length, 0, "no view models")

    # clean up
    kb.release(collection_observable)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("Nested custom view models", ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelDate extends kb.ViewModel
      constructor: (model, options) ->
        super(model, _.extend({internals: ['date']}, options))
        @date = new _kbe.LongDateLocalizer(@_date)

    john_birthdate = new Date(1940, 10, 9)
    john = new _kbe.Contact({name: 'John', date: new Date(john_birthdate.valueOf())})
    paul_birthdate = new Date(1942, 6, 18)
    paul = new _kbe.Contact({name: 'Paul', date: new Date(paul_birthdate.valueOf())})
    george_birthdate = new Date(1943, 2, 25)
    george = new _kbe.Contact({name: 'George', date: new Date(george_birthdate.valueOf())})
    ringo_birthdate = new Date(1940, 7, 7)
    ringo = new _kbe.Contact({name: 'Ringo', date: new Date(ringo_birthdate.valueOf())})
    major_duo = new Backbone.Collection([john, paul])
    minor_duo = new Backbone.Collection([george, ringo])

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
      equal(view_model.name(), name, "#{name}: Name matches")

      # set from the view model
      kb.locale_manager.setLocale('en-GB')
      formatted_date = new _kbe.LongDateLocalizer(birthdate)
      equal(view_model.date(), formatted_date(), "#{name}: Birthdate in Great Britain format")
      view_model.date('10 December 1963')
      current_date = model.get('date')
      equal(current_date.getFullYear(), 1963, "#{name}: year is good")
      equal(current_date.getMonth(), 11, "#{name}: month is good")
      equal(current_date.getDate(), 10, "#{name}: day is good")
      equal(view_model._date().getFullYear(), 1963, "#{name}: year is good")
      equal(view_model._date().getMonth(), 11, "#{name}: month is good")
      equal(view_model._date().getDate(), 10, "#{name}: day is good")

      model.set({date: new Date(birthdate.valueOf())}) # restore birthdate

      # set from the model
      kb.locale_manager.setLocale('fr-FR')
      equal(view_model.date(), formatted_date(), "#{name}: Birthdate in France format")
      view_model.date('10 novembre 1940')
      current_date = model.get('date')
      equal(current_date.getFullYear(), 1940, "#{name}: year is good")
      equal(current_date.getMonth(), 10, "#{name}: month is good")
      equal(current_date.getDate(), 10, "#{name}: day is good")
      equal(view_model._date().getFullYear(), 1940, "#{name}: year is good")
      equal(view_model._date().getMonth(), 10, "#{name}: month is good")
      equal(view_model._date().getDate(), 10, "#{name}: day is good")

      model.set({date: new Date(birthdate.valueOf())}) # restore birthdate

    validateGenericViewModel = (view_model, name, birthdate) ->
      equal(view_model.name(), name, "#{name}: Name matches")
      equal(view_model.date().valueOf(), birthdate.valueOf(), "#{name}: Birthdate matches")

    validateModel = (model, name, birthdate) ->
      equal(model.get('name'), name, "#{name}: Name matches")
      equal(model.get('date').valueOf(), birthdate.valueOf(), "#{name}: Birthdate matches")

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

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
)