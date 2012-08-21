$(document).ready( ->
  module("knockback.js with Backbone.ModelRef.js")

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

  kb.locale_manager = new _kbe.LocaleManager('en', {
    'en': {loading: "Loading dude"}
    'en-GB': {loading: "Loading sir"}
    'fr-FR': {loading: "Chargement"}
  })

  test("Standard use case: just enough to get the picture", ->
    kb.statistics = new kb.Statistics() # turn on stats

    ContactViewModel = (model) ->
      @loading_message = new _kbe.LocalizedStringLocalizer(new _kbe.LocalizedString('loading'))
      @_auto = kb.viewModel(model, {keys: {
        name:     {key:'name', default: @loading_message}
        number:   {key:'number', default: @loading_message}
        date:     {key:'date', default: @loading_message, localizer: _kbe.ShortDateLocalizer}
      }}, this)
      @

    collection = new _kbe.ContactsCollection()
    model_ref = new Backbone.ModelRef(collection, 'b4')
    view_model = new ContactViewModel(model_ref)

    kb.locale_manager.setLocale('en')
    equal(view_model.name(), 'Loading dude', "Is that what we want to convey?")
    kb.locale_manager.setLocale('en-GB')
    equal(view_model.name(), 'Loading sir', "Maybe too formal")
    kb.locale_manager.setLocale('fr-FR')
    equal(view_model.name(), 'Chargement', "Localize from day one. Good!")

    collection.add(collection.parse({id: 'b4', name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)}))
    model = collection.get('b4')

    # get
    equal(view_model.name(), 'John', "It is a name")
    equal(view_model.number(), '555-555-5558', "Not so interesting number")
    kb.locale_manager.setLocale('en-GB')
    equal(view_model.date(), '09/11/1940', "John's birthdate in Great Britain format")
    kb.locale_manager.setLocale('fr-FR')
    equal(view_model.date(), '09/11/1940', "John's birthdate in France format")

    # set from the view model
    equal(model.get('name'), 'John', "Name not changed")
    equal(view_model.name(), 'John', "Name not changed")
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    kb.locale_manager.setLocale('en-GB')
    view_model.date('10/12/1963')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1963, "year is good")
    equal(current_date.getMonth(), 11, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    # set from the model
    model.set({name: 'Yoko', number: '818-818-8181'})
    equal(view_model.name(), 'Yoko', "Name changed")
    equal(view_model.number(), '818-818-8181', "Number was changed")
    model.set({date: new Date(1940, 10, 9)})
    kb.locale_manager.setLocale('fr-FR')
    equal(view_model.date(), '09/11/1940', "John's birthdate in France format")
    view_model.date('10/11/1940')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1940, "year is good")
    equal(current_date.getMonth(), 10, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    # go back to loading state
    collection.reset()
    equal(view_model.name(), 'Yoko', "Default is to keep the last value")
    view_model._auto.setToDefault() # override default behavior and go back to loading state
    kb.locale_manager.setLocale('en')
    equal(view_model.name(), 'Loading dude', "Is that what we want to convey?")
    kb.locale_manager.setLocale('en-GB')
    equal(view_model.name(), 'Loading sir', "Maybe too formal")
    kb.locale_manager.setLocale('fr-FR')
    equal(view_model.name(), 'Chargement', "Localize from day one. Good!")

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("Standard use case with kb.ViewModels", ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModel extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['name', 'number', 'date']})
        @loading_message = new _kbe.LocalizedStringLocalizer(new _kbe.LocalizedString('loading'))
        @name = kb.defaultWrapper(@_name, @loading_message)
        @number = kb.defaultWrapper(@_number, @loading_message)
        @date = kb.defaultWrapper(new _kbe.LongDateLocalizer(@_date), @loading_message)

    collection = new _kbe.ContactsCollection()
    model_ref = new Backbone.ModelRef(collection, 'b4')
    view_model = new ContactViewModel(model_ref)

    kb.locale_manager.setLocale('en')
    equal(view_model.name(), 'Loading dude', "Is that what we want to convey?")
    kb.locale_manager.setLocale('en-GB')
    equal(view_model.name(), 'Loading sir', "Maybe too formal")
    kb.locale_manager.setLocale('fr-FR')
    equal(view_model.name(), 'Chargement', "Localize from day one. Good!")

    collection.add(collection.parse({id: 'b4', name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)}))
    model = collection.get('b4')

    # get
    equal(view_model.name(), 'John', "It is a name")
    equal(view_model.number(), '555-555-5558', "Not so interesting number")
    kb.locale_manager.setLocale('en-GB')
    equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format")
    kb.locale_manager.setLocale('fr-FR')
    equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format")

    # set from the view model
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    kb.locale_manager.setLocale('en-GB')
    view_model.date('10 December 1963')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1963, "year is good")
    equal(current_date.getMonth(), 11, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    # set from the model
    model.set({name: 'Yoko', number: '818-818-8181'})
    equal(view_model.name(), 'Yoko', "Name changed")
    equal(view_model.number(), '818-818-8181', "Number was changed")
    model.set({date: new Date(1940, 10, 9)})
    kb.locale_manager.setLocale('fr-FR')
    equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format")
    view_model.date('10 novembre 1940')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1940, "year is good")
    equal(current_date.getMonth(), 10, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    # go back to loading state
    collection.reset()
    equal(view_model.name(), 'Yoko', "Default is to keep the last value")
    kb.utils.setToDefault(view_model)
    kb.locale_manager.setLocale('en')
    equal(view_model.name(), 'Loading dude', "Is that what we want to convey?")
    kb.locale_manager.setLocale('en-GB')
    equal(view_model.name(), 'Loading sir', "Maybe too formal")
    kb.locale_manager.setLocale('fr-FR')
    equal(view_model.name(), 'Chargement', "Localize from day one. Good!")

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
)