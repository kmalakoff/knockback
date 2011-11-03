$(document).ready( ->
  module("knockback_collection_sync.js")
  test("TEST DEPENDENCY MISSING", ->
    ko.utils; _.VERSION; Backbone.VERSION
  )

  ContactViewModel = (model) ->
    @name = kb.observable(model, key:'name', this)
    @number = kb.observable(model, key:'number', this)
    return this

  test("Basic Usage: no sorting and no callbacks", ->
    collection = new ContactsCollection()
    view_models_array = ko.observableArray([])

    collection_sync = kb.collectionSync(collection, view_models_array, {
      viewModelCreate:    (model) -> return new ContactViewModel(model)
    })

    equal(collection.length, 0, "no models")
    equal(view_models_array().length, 0, "no view models")

    collection.add(new Contact({id: 'b1', name: 'Ringo', number: '555-555-5555'}))
    collection.add(new Contact({id: 'b2', name: 'George', number: '555-555-5556'}))
    equal(collection.length, 2, "two models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    equal(collection.models[1].get('name'), 'George', "George is second")
    equal(view_models_array().length, 2, "two view models")
    equal(kb.vmModel(view_models_array()[0]).get('name'), 'Ringo', "Ringo is first")
    equal(kb.vmModel(view_models_array()[1]).get('name'), 'George', "George is second")

    collection.remove('b2')
    equal(collection.length, 1, "one models")
    equal(view_models_array().length, 1, "one view models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is left")
    equal(kb.vmModel(view_models_array()[0]).get('name'), 'Ringo', "Ringo is left")
  )

  test("Basic Usage: collection sync sorting with callbacks", ->
    collection = new ContactsCollection()
    view_models_array = ko.observableArray([])
    view_model_count = 0; view_model_resort_count = 0

    collection_sync = kb.collectionSync(collection, view_models_array, {
      viewModelCreate:    (model) -> return new ContactViewModel(model)
      sort_attribute:     'name'
      sortedIndex:        (models, model) -> _.sortedIndex(models, model, (test) -> test.get('name'))

      onViewModelAdd:     (view_model, view_models_array_array) -> view_model_count++
      onViewModelResort:  (view_model, view_models_array_array, new_index) -> view_model_resort_count++
      onViewModelRemove:  (view_model, view_models_array_array) -> view_model_count--
    })

    equal(collection.length, 0, "no models")
    equal(view_model_count, 0, "no view models")
    equal(view_models_array().length, 0, "no view models")

    collection.add(new Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    equal(collection.length, 2, "two models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    equal(collection.models[1].get('name'), 'George', "George is second")
    equal(view_model_count, 2, "two view models")
    equal(view_models_array().length, 2, "two view models")
    equal(kb.vmModel(view_models_array()[0]).get('name'), 'George', "George is first - sorting worked!")
    equal(kb.vmModel(view_models_array()[1]).get('name'), 'Ringo', "Ringo is second - sorting worked!")

    collection.add(new Contact({id: 'b3', name: 'Paul', number: '555-555-5557'}))
    equal(collection.length, 3, "three models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is first")
    equal(collection.models[1].get('name'), 'George', "George is second")
    equal(collection.models[2].get('name'), 'Paul', "Paul is second")
    equal(view_model_count, 3, "three view models")
    equal(view_models_array().length, 3, "two view models")
    equal(kb.vmModel(view_models_array()[0]).get('name'), 'George', "George is first - sorting worked!")
    equal(kb.vmModel(view_models_array()[1]).get('name'), 'Paul', "Paul is second - sorting worked!")
    equal(kb.vmModel(view_models_array()[2]).get('name'), 'Ringo', "Ringo is third - sorting worked!")

    collection.remove('b2').remove('b3')
    equal(collection.length, 1, "one models")
    equal(view_model_count, 1, "one view models")
    equal(view_models_array().length, 1, "one view models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is left")
    equal(kb.vmModel(view_models_array()[0]).get('name'), 'Ringo', "Ringo is left")

    collection.reset()
    equal(collection.length, 0, "no models")
    equal(view_model_count, 0, "no view models")
    equal(view_models_array().length, 0, "no view models")
    ok(view_model_resort_count==0, "not resorting happened because everything was inserted once") # TODO: make a rigorous check
  )

  test("Basic Usage: collection sorting with callbacks", ->
    collection = new SortedContactsCollection()
    view_models_array = ko.observableArray([])
    view_model_count = 0; view_model_resort_count = 0

    collection_sync = kb.collectionSync(collection, view_models_array, {
      viewModelCreate:    (model) -> return new ContactViewModel(model)

      onViewModelAdd:     (view_model, view_models_array_array) -> view_model_count++
      onViewModelResort:  (view_model, view_models_array_array, new_index) -> view_model_resort_count++
      onViewModelRemove:  (view_model, view_models_array_array) -> view_model_count--
    })

    equal(collection.length, 0, "no models")
    equal(view_models_array().length, 0, "no view models")

    collection.add(new Contact({id: 'b1', name: 'Ringo', number: '555-555-5556'}))
    collection.add(new Contact({id: 'b2', name: 'George', number: '555-555-5555'}))
    equal(collection.length, 2, "two models")
    equal(collection.models[0].get('name'), 'George', "George is first")
    equal(collection.models[1].get('name'), 'Ringo', "Ringo is second")
    equal(view_model_count, 2, "two view models")
    equal(view_models_array().length, 2, "two view models")
    equal(kb.vmModel(view_models_array()[0]).get('name'), 'George', "George is first - sorting worked!")
    equal(kb.vmModel(view_models_array()[1]).get('name'), 'Ringo', "Ringo is second - sorting worked!")

    collection.add(new Contact({id: 'b3', name: 'Paul', number: '555-555-5557'}))
    equal(collection.length, 3, "three models")
    equal(collection.models[0].get('name'), 'George', "George is first")
    equal(collection.models[1].get('name'), 'Paul', "Paul is second")
    equal(collection.models[2].get('name'), 'Ringo', "Ringo is second")
    equal(view_model_count, 3, "three view models")
    equal(view_models_array().length, 3, "two view models")
    equal(kb.vmModel(view_models_array()[0]).get('name'), 'George', "George is first - sorting worked!")
    equal(kb.vmModel(view_models_array()[1]).get('name'), 'Paul', "Paul is second - sorting worked!")
    equal(kb.vmModel(view_models_array()[2]).get('name'), 'Ringo', "Ringo is third - sorting worked!")

    collection.remove('b2').remove('b3')
    equal(collection.length, 1, "one models")
    equal(view_model_count, 1, "one view models")
    equal(view_models_array().length, 1, "one view models")
    equal(collection.models[0].get('name'), 'Ringo', "Ringo is left")
    equal(kb.vmModel(view_models_array()[0]).get('name'), 'Ringo', "Ringo is left")

    collection.reset()
    equal(collection.length, 0, "no models")
    equal(view_model_count, 0, "no view models")
    equal(view_models_array().length, 0, "no view models")
    ok(view_model_resort_count==0, "not resorting happened because everything was inserted once") # TODO: make a rigorous check
  )

  test("Error cases", ->
    raises((->kb.collectionSync()), Error, "CollectionSync: collection is missing")
    raises((->kb.collectionSync(new ContactsCollection())), Error, "CollectionSync: observable_array is missing")
    raises((->kb.collectionSync(new ContactsCollection(), ko.observableArray([]))), Error, "CollectionSync: options is missing")
    raises((->kb.collectionSync(new ContactsCollection(), ko.observableArray([]), {})), Error, "CollectionSync: options.viewModelCreate is missing")
  )
)