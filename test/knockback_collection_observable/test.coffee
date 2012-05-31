$(document).ready( ->
  module("knockback_collection_observable.js")

  # import Underscore, Backbone, and Knockout
  _ = if not window._ and (typeof(require) != 'undefined') then require('underscore') else window._
  Backbone = if not window.Backbone and (typeof(require) != 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) != 'undefined') then require('knockout') else window.ko
  test("TEST DEPENDENCY MISSING", ->
    ko.utils; _.VERSION; Backbone.VERSION
  )

  ContactViewModel = (model) ->
    @name = kb.observable(model, 'name')
    @number = kb.observable(model, 'number')
    @

  class ContactViewModelClass
    constructor: (model) ->
      @name = kb.observable(model, 'name')
      @number = kb.observable(model, 'number')

  test("Basic Usage: collection observable with ko.dependentObservable", ->
    collection = new kb._.ContactsCollection()
    collection_observable = kb.collectionObservable(collection)
    view_model =
      count: ko.dependentObservable(->return collection_observable().length )

    equal(collection.length, 0, "no models")
    equal(view_model.count(), 0, "no count")

    collection.add(new kb._.Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new kb._.Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    equal(collection.length, 2, "2 models")
    equal(view_model.count(), 2, "2 count")

    collection.add(new kb._.Contact({id: 'b3', name: 'Paul', number: '555-555-5557'}))
    equal(collection.length, 3, "3 models")
    equal(view_model.count(), 3, "3 count")

    collection.remove('b2').remove('b3')
    equal(collection.length, 1, "1 model")
    equal(view_model.count(), 1, "1 count")
  )

  test("Basic Usage: collection observable with ko.dependentObservable", ->
    collection = new kb._.ContactsCollection()
    collection_observable = kb.collectionObservable(collection, {
      view_model: ContactViewModel
    })

    view_model =
      count: ko.dependentObservable(->return collection_observable().length )

    equal(collection.length, 0, "no models")
    equal(view_model.count(), 0, "no count")

    collection.add(new kb._.Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new kb._.Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    equal(collection.length, 2, "2 models")
    equal(view_model.count(), 2, "2 count")

    collection.add(new kb._.Contact({id: 'b3', name: 'Paul', number: '555-555-5557'}))
    equal(collection.length, 3, "3 models")
    equal(view_model.count(), 3, "3 count")

    collection.remove('b2').remove('b3')
    equal(collection.length, 1, "1 model")
    equal(view_model.count(), 1, "1 count")
  )

  test("Basic Usage: no view models", ->
    collection = new kb._.ContactsCollection()

    collection_observable = kb.collectionObservable(collection)

    equal(collection.length, 0, "no models")
    equal(collection_observable().length, 0, "no view models")

    collection.add(new kb._.Contact({id: 'b1', name: 'Ringo', number: '555-555-5555'}))
    collection.add(new kb._.Contact({id: 'b2', name: 'George', number: '555-555-5556'}))
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
  )

  test("Basic Usage: no sorting and no callbacks", ->
    collection = new kb._.ContactsCollection()
    collection_observable = kb.collectionObservable(collection, {
      view_model_create: (model) -> return new ContactViewModel(model)
    })

    equal(collection.length, 0, "no models")
    equal(collection_observable().length, 0, "no view models")

    collection.add(new kb._.Contact({id: 'b1', name: 'Ringo', number: '555-555-5555'}))
    collection.add(new kb._.Contact({id: 'b2', name: 'George', number: '555-555-5556'}))
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
  )

  test("Collection sync sorting with sort_attribute", ->
    collection = new kb._.ContactsCollection()
    view_model_count = 0; view_model_resort_count = 0

    collection_observable = kb.collectionObservable(collection, {
      view_model:   ContactViewModelClass
      sort_attribute:           'name'
    })
    collection_observable.bind('add', (view_model, collection_observable) -> if _.isArray(view_model) then (view_model_count+=view_model.length) else view_model_count++)
    collection_observable.bind('resort', (view_model, collection_observable, new_index) -> if _.isArray(view_model) then (view_model_resort_count+=view_model.length) else view_model_resort_count++ )
    collection_observable.bind('remove', (view_model, collection_observable) -> if _.isArray(view_model) then (view_model_count-=view_model.length) else view_model_count--)

    equal(collection.length, 0, "no models")
    equal(view_model_count, 0, "no view models")
    equal(collection_observable().length, 0, "no view models")

    collection.add(new kb._.Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new kb._.Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    equal(collection.length, 2, "two models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    equal(collection.models[1].get('name'), 'George', "George is second")
    equal(view_model_count, 2, "two view models")
    equal(collection_observable().length, 2, "two view models")
    equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!")
    equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Ringo', "Ringo is second - sorting worked!")

    collection.add(new kb._.Contact({id: 'b3', name: 'Paul', number: '555-555-5557'}))
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
  )

  test("Collection sync sorting with sorted_index", ->
    view_model_count = 0; view_model_resort_count = 0

    class SortWrapper
      constructor: (value) ->
        @parts = value.split('-')
      compare: (that) ->
        return (that.parts.length-@parts.length) if @parts.length != that.parts.length
        for index, part of @parts
          diff = that.parts[index] - Math.parseInt(part, 10)
          return diff unless diff == 0
        return 0

    # without view models
    collection = new kb._.ContactsCollection()
    collection_observable = kb.collectionObservable(collection, {
      sorted_index:             kb.siwa('number', SortWrapper)
    })
    collection.add(new kb._.Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new kb._.Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    equal(collection.length, 2, "two models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    equal(collection.models[1].get('name'), 'George', "George is second")
    equal(collection_observable().length, 2, "two view models")
    equal(collection_observable()[0].get('name'), 'George', "George is first - sorting worked!")
    equal(collection_observable()[1].get('name'), 'Ringo', "Ringo is second - sorting worked!")

    # with view models
    collection = new kb._.ContactsCollection()
    collection_observable = kb.collectionObservable(collection, {
      view_model:   ContactViewModelClass
      sorted_index:             kb.siwa('number', SortWrapper)
    })
    collection.add(new kb._.Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new kb._.Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    equal(collection.length, 2, "two models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    equal(collection.models[1].get('name'), 'George', "George is second")
    equal(collection_observable().length, 2, "two view models")
    equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!")
    equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Ringo', "Ringo is second - sorting worked!")
  )

  test("Collection sorting with callbacks", ->
    collection = new kb._.NameSortedContactsCollection()
    view_model_count = 0; view_model_resort_count = 0

    collection_observable = kb.collectionObservable(collection, {
      view_model: ContactViewModel    # view_model is legacy for view_model, it should be replaced with view_model or view_model_create
    })
    collection_observable.bind('add', (view_model, collection_observable) -> if _.isArray(view_model) then (view_model_count+=view_model.length) else view_model_count++)
    collection_observable.bind('resort', (view_model, collection_observable, new_index) -> if _.isArray(view_model) then (view_model_resort_count+=view_model.length) else view_model_resort_count++ )
    collection_observable.bind('remove', (view_model, collection_observable) -> if _.isArray(view_model) then (view_model_count-=view_model.length) else view_model_count--)

    equal(collection.length, 0, "no models")
    equal(collection_observable().length, 0, "no view models")

    collection.add(new kb._.Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new kb._.Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    equal(collection.length, 2, "two models")
    equal(collection.models[0].get('name'), 'George', "George is first")
    equal(collection.models[1].get('name'), 'Ringo', "Ringo is second")
    equal(view_model_count, 2, "two view models")
    equal(collection_observable().length, 2, "two view models")
    equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!")
    equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Ringo', "Ringo is second - sorting worked!")

    collection.add(new kb._.Contact({id: 'b3', name: 'Paul', number: '555-555-5557'}))
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
  )

  test("Collection sync dynamically changing the sorting function", ->
    collection = new kb._.ContactsCollection()
    collection_observable = kb.collectionObservable(collection, {
      view_model: ContactViewModel
    })

    equal(collection.length, 0, "no models")
    equal(collection_observable().length, 0, "no view models")

    collection.add(new kb._.Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new kb._.Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
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

    collection.add(new kb._.Contact({id: 'b3', name: 'Paul', number: '555-555-5554'}))
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
  )

  test("Error cases", ->
    raises((->kb.collectionObservable()), null, "CollectionObservable: collection is missing")
    kb.collectionObservable(new kb._.ContactsCollection(), ko.observableArray([]))
    # raises((->kb.collectionObservable(new kb._.ContactsCollection(), ko.observableArray([]))), null, "Legacy warning! 'kb.collectionObservable with an external ko.observableArray' has been deprecated. Please use the kb.collectionObservable directly instead of passing a ko.observableArray")
    kb.vmModel(new kb._.Contact())
    # raises((->kb.vmModel(new kb._.Contact())), null, "Legacy warning! 'kb.vmModel' has been deprecated. Please use kb.utils.wrappedObservable instead")
    kb.collectionObservable(new kb._.ContactsCollection())
    kb.collectionObservable(new kb._.ContactsCollection(), {})
  )
)