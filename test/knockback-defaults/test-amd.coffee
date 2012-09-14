$(document).ready( ->
  module("knockback-defaults-amd.js")

  module_name = 'knockback-defaults'
  module_name = 'knockback' if (require.toUrl(module_name).split('./..').length is 1)

  # Knockback and depdenencies
  require(['underscore', 'backbone', 'knockout', module_name, 'knockback-statistics', 'knockback-examples-localization', 'backbone-modelref'], (_, Backbone, ko, kb, kbs) ->
    _ or (_ = kb._)
    Backbone or (Backbone = kb.Backbone)
    test("TEST DEPENDENCY MISSING", ->
      ok(!!ko, 'ko')
      ok(!!_, '_')
      ok(!!Backbone, 'Backbone')
      ok(!!kb, 'kb')
      ok(!!kbs, 'kbs')
    )

    kb.Contact = Backbone.Model.extend({ defaults: {name: '', number: 0, date: new Date()} })
    kb.ContactsCollection = Backbone.Collection.extend({ model: kb.Contact })

    locale_manager = new kb.LocaleManager('en', {
      'en': {loading: "Loading dude"}
      'en-GB': {loading: "Loading sir"}
      'fr-FR': {loading: "Chargement"}
    })

    test("Standard use case: just enough to get the picture", ->
      kb.statistics = new kb.Statistics() # turn on stats
      kb.locale_manager = locale_manager

      ContactViewModel = (model) ->
        @loading_message = new kb.LocalizedStringLocalizer(new kb.LocalizedString('loading'))
        @_auto = kb.viewModel(model, {keys: {
          name:     {key:'name', default: @loading_message}
          number:   {key:'number', default: @loading_message}
          date:     {key:'date', default: @loading_message, localizer: kb.ShortDateLocalizer}
        }}, this)
        @

      collection = new kb.ContactsCollection()
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
      equal(view_model.name(), 'Chargement', "Resets to default")
      view_model._auto.setToDefault() # override default behavior and go back to loading state
      kb.locale_manager.setLocale('en')
      equal(view_model.name(), 'Loading dude', "Is that what we want to convey?")
      kb.locale_manager.setLocale('en-GB')
      equal(view_model.name(), 'Loading sir', "Maybe too formal")
      kb.locale_manager.setLocale('fr-FR')
      equal(view_model.name(), 'Chargement', "Localize from day one. Good!")

      # and cleanup after yourself when you are done.
      kb.release(view_model)

      equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    )
    test("Standard use case with kb.ViewModels", ->
      kb.statistics = new kb.Statistics() # turn on stats
      kb.locale_manager = locale_manager

      class ContactViewModel extends kb.ViewModel
        constructor: (model) ->
          super(model, {internals: ['name', 'number', 'date']})
          @loading_message = new kb.LocalizedStringLocalizer(new kb.LocalizedString('loading'))
          @name = kb.defaultObservable(@_name, @loading_message)
          @number = kb.defaultObservable(@_number, @loading_message)
          @date = kb.defaultObservable(new kb.LongDateLocalizer(@_date), @loading_message)

      collection = new kb.ContactsCollection()
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
      equal(view_model.name(), 'Chargement', "Resets to default")
      kb.utils.setToDefault(view_model)
      kb.locale_manager.setLocale('en')
      equal(view_model.name(), 'Loading dude', "Is that what we want to convey?")
      kb.locale_manager.setLocale('en-GB')
      equal(view_model.name(), 'Loading sir', "Maybe too formal")
      kb.locale_manager.setLocale('fr-FR')
      equal(view_model.name(), 'Chargement', "Localize from day one. Good!")

      # and cleanup after yourself when you are done.
      kb.release(view_model)

      equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    )
    test("2. internals test (Coffeescript inheritance)", ->
      kb.statistics = new kb.Statistics() # turn on stats
      kb.locale_manager = locale_manager

      class ContactViewModel extends kb.ViewModel
        constructor: (model) ->
          super(model, {internals: ['email', 'date']})
          @email = kb.defaultObservable(@_email, 'your.name@yourplace.com')
          @date = new kb.LongDateLocalizer(@_date)

      birthdate = new Date(1940, 10, 9)
      model = new kb.Contact({name: 'John', date: new Date(birthdate.valueOf())})
      view_model = new ContactViewModel(model)

      # check email
      equal(view_model._email(), undefined, "no email")
      equal(view_model.email(), 'your.name@yourplace.com', "default message")

      view_model._email('j@imagine.com')
      equal(view_model._email(), 'j@imagine.com', "received email")
      equal(view_model.email(), 'j@imagine.com', "received email")

      view_model.email('john@imagine.com')
      equal(view_model._email(), 'john@imagine.com', "received email")
      equal(view_model.email(), 'john@imagine.com', "received email")

      # set from the view model
      kb.locale_manager.setLocale('en-GB')
      equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format")
      view_model.date('10 December 1963')
      current_date = model.get('date')
      equal(current_date.getFullYear(), 1963, "year is good")
      equal(current_date.getMonth(), 11, "month is good")
      equal(current_date.getDate(), 10, "day is good")
      equal(view_model._date().getFullYear(), 1963, "year is good")
      equal(view_model._date().getMonth(), 11, "month is good")
      equal(view_model._date().getDate(), 10, "day is good")

      # set from the model
      model.set({date: new Date(birthdate.valueOf())})
      kb.locale_manager.setLocale('fr-FR')
      equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format")
      view_model.date('10 novembre 1940')
      current_date = model.get('date')
      equal(current_date.getFullYear(), 1940, "year is good")
      equal(current_date.getMonth(), 10, "month is good")
      equal(current_date.getDate(), 10, "day is good")
      equal(view_model._date().getFullYear(), 1940, "year is good")
      equal(view_model._date().getMonth(), 10, "month is good")
      equal(view_model._date().getDate(), 10, "day is good")

      # set from the automatically-generated date observable
      view_model.date(new Date(birthdate.valueOf()))
      kb.locale_manager.setLocale('fr-FR')
      equal(view_model.date(), '10 novembre 1940', "One past John's birthdate in France format")
      current_date = model.get('date')
      equal(current_date.getFullYear(), 1940, "year is good")
      equal(current_date.getMonth(), 10, "month is good")
      equal(current_date.getDate(), 10, "day is good")
      equal(view_model._date().getFullYear(), 1940, "year is good")
      equal(view_model._date().getMonth(), 10, "month is good")
      equal(view_model._date().getDate(), 10, "day is good")

      # and cleanup after yourself when you are done.
      kb.release(view_model)

      equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    )
  )
)