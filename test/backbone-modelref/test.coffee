$(document).ready( ->
  module("knockback.js with Backbone.ModelRef.js")

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  if (typeof(require) isnt 'undefined') then _ = require('underscore') else _ = window._
  _ = _._ if _ and _.hasOwnProperty('_') # LEGACY
  Backbone = if not window.Backbone and (typeof(require) isnt 'undefined') then require('backbone') else window.Backbone
  Backbone.ModelRef = if not Backbone.ModelRef and (typeof(require) isnt 'undefined') then require('backbone-modelref') else window.Backbone.ModelRef
  ko = if not window.ko and (typeof(require) isnt 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) isnt 'undefined') then require('knockback') else window.kb

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko, 'ko')
    ok(!!_, '_')
    ok(!!Backbone, 'Backbone')
    ok(!!Backbone.ModelRef, 'Backbone.ModelRef'); ok(!!kb, 'kb')
    ok(!!kb, 'kb')
  )

  kb.Contact = Backbone.Model.extend({ defaults: {name: '', number: 0, date: new Date()} })
  kb.ContactsCollection = Backbone.Collection.extend({ model: kb.Contact })

  test("Standard use case: just enough to get the picture", ->
    kb.statistics = new kb.Statistics() # turn on stats

    ContactViewModel = (model) ->
      @_auto = kb.viewModel(model, {keys: {
        name:     {key:'name'}
        number:   {key:'number'}
        date:     {key:'date'}
      }}, this)
      @

    collection = new kb.ContactsCollection()
    model_ref = new Backbone.ModelRef(collection, 'b4')
    view_model = new ContactViewModel(model_ref)

    equal(view_model.name(), null, "Is that what we want to convey?")

    collection.add(collection.parse({id: 'b4', name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)}))
    model = collection.get('b4')

    # get
    equal(view_model.name(), 'John', "It is a name")
    equal(view_model.number(), '555-555-5558', "Not so interesting number")
    equal(view_model.date().toString(), new Date(1940, 10, 9).toString(), "John's birthdate matches")

    # set from the view model
    equal(model.get('name'), 'John', "Name not changed")
    equal(view_model.name(), 'John', "Name not changed")
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    view_model.date(new Date(1963, 11, 10))
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1963, "year is good")
    equal(current_date.getMonth(), 11, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    # set from the model
    model.set({name: 'Yoko', number: '818-818-8181'})
    equal(view_model.name(), 'Yoko', "Name changed")
    equal(view_model.number(), '818-818-8181', "Number was changed")
    model.set({date: new Date(1940, 10, 9)})
    equal(view_model.date().toString(), (new Date(1940, 10, 9)).toString(), "John's birthdate")
    view_model.date(new Date(1940, 10, 10))
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1940, "year is good")
    equal(current_date.getMonth(), 10, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("Standard use case with kb.ViewModels", ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModel extends kb.ViewModel
      constructor: (model) ->
        super(model, {requires: ['name', 'number', 'date']})

    collection = new kb.ContactsCollection()
    model_ref = new Backbone.ModelRef(collection, 'b4')
    view_model = new ContactViewModel(model_ref)

    equal(view_model.name(), null, "Is that what we want to convey?")

    collection.add(collection.parse({id: 'b4', name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)}))
    model = collection.get('b4')

    # get
    equal(view_model.name(), 'John', "It is a name")
    equal(view_model.number(), '555-555-5558', "Not so interesting number")
    equal(view_model.date().toString(), (new Date(1940, 10, 9)).toString(), "John's birthdate matches")

    # set from the view model
    equal(model.get('name'), 'John', "Name not changed")
    equal(view_model.name(), 'John', "Name not changed")
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    view_model.date(new Date(1963, 11, 10))
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1963, "year is good")
    equal(current_date.getMonth(), 11, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    # set from the model
    model.set({name: 'Yoko', number: '818-818-8181'})
    equal(view_model.name(), 'Yoko', "Name changed")
    equal(view_model.number(), '818-818-8181', "Number was changed")
    model.set({date: new Date(1940, 10, 9)})
    equal(view_model.date().toString(), (new Date(1940, 10, 9)).toString(), "John's birthdate")
    view_model.date(new Date(1940, 10, 10))
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1940, "year is good")
    equal(current_date.getMonth(), 10, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
)