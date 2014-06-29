describe 'knockback-defaults.js', ->

  ko = window.ko or require?('knockout')
  kb = window.kb or require?('knockback')
  _ = kb._
  Backbone = kb.Backbone
  Backbone.ModelRef or require?('backbone-modelref') if kb.Backbone
  kb.LocaleManager or require?('knockback-examples-localization')

  it 'TEST DEPENDENCY MISSING', (done) ->
    assert.ok(!!ko, 'ko')
    assert.ok(!!_, '_')
    assert.ok(!!kb.Model, 'kb.Model')
    assert.ok(!!kb.Collection, 'kb.Collection')
    assert.ok(!!kb, 'kb')
    done()

  kb.Contact = if kb.Parse then kb.Model.extend('Contact', { defaults: {name: '', number: 0, date: new Date()} }) else kb.Model.extend({ defaults: {name: '', number: 0, date: new Date()} })
  kb.ContactsCollection = kb.Collection.extend({ model: kb.Contact })

  locale_manager = new kb.LocaleManager('en', {
    'en': {loading: "Loading dude"}
    'en-GB': {loading: "Loading sir"}
    'fr-FR': {loading: "Chargement"}
  })

  if kb.Backbone
    it '1. Standard use case: just enough to get the picture', (done) ->
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
      assert.equal(view_model.name(), 'Loading dude', "Is that what we want to convey?")
      kb.locale_manager.setLocale('en-GB')
      assert.equal(view_model.name(), 'Loading sir', "Maybe too formal")
      kb.locale_manager.setLocale('fr-FR')
      assert.equal(view_model.name(), 'Chargement', "Localize from day one. Good!")

      collection.add(collection.parse({id: 'b4', name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)}))
      model = collection.get('b4')

      # get
      assert.equal(view_model.name(), 'John', "It is a name")
      assert.equal(view_model.number(), '555-555-5558', "Not so interesting number")
      kb.locale_manager.setLocale('en-GB')
      assert.equal(view_model.date(), '09/11/1940', "John's birthdate in Great Britain format")
      kb.locale_manager.setLocale('fr-FR')
      assert.equal(view_model.date(), '09/11/1940', "John's birthdate in France format")

      # set from the view model
      assert.equal(model.get('name'), 'John', "Name not changed")
      assert.equal(view_model.name(), 'John', "Name not changed")
      view_model.number('9222-222-222')
      assert.equal(model.get('number'), '9222-222-222', "Number was changed")
      assert.equal(view_model.number(), '9222-222-222', "Number was changed")
      kb.locale_manager.setLocale('en-GB')
      view_model.date('10/12/1963')
      current_date = model.get('date')
      assert.equal(current_date.getFullYear(), 1963, "year is good")
      assert.equal(current_date.getMonth(), 11, "month is good")
      assert.equal(current_date.getDate(), 10, "day is good")

      # set from the model
      model.set({name: 'Yoko', number: '818-818-8181'})
      assert.equal(view_model.name(), 'Yoko', "Name changed")
      assert.equal(view_model.number(), '818-818-8181', "Number was changed")
      model.set({date: new Date(1940, 10, 9)})
      kb.locale_manager.setLocale('fr-FR')
      assert.equal(view_model.date(), '09/11/1940', "John's birthdate in France format")
      view_model.date('10/11/1940')
      current_date = model.get('date')
      assert.equal(current_date.getFullYear(), 1940, "year is good")
      assert.equal(current_date.getMonth(), 10, "month is good")
      assert.equal(current_date.getDate(), 10, "day is good")

      # go back to loading state
      collection.reset()
      assert.equal(view_model.name(), 'Chargement', "Resets to default")
      view_model._auto.setToDefault() # override default behavior and go back to loading state
      kb.locale_manager.setLocale('en')
      assert.equal(view_model.name(), 'Loading dude', "Is that what we want to convey?")
      kb.locale_manager.setLocale('en-GB')
      assert.equal(view_model.name(), 'Loading sir', "Maybe too formal")
      kb.locale_manager.setLocale('fr-FR')
      assert.equal(view_model.name(), 'Chargement', "Localize from day one. Good!")

      # and cleanup after yourself when you are done.
      kb.release(view_model)

      assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
      done()

    it '2. Standard use case with kb.ViewModels', (done) ->
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
      assert.equal(view_model.name(), 'Loading dude', "Is that what we want to convey?")
      kb.locale_manager.setLocale('en-GB')
      assert.equal(view_model.name(), 'Loading sir', "Maybe too formal")
      kb.locale_manager.setLocale('fr-FR')
      assert.equal(view_model.name(), 'Chargement', "Localize from day one. Good!")

      collection.add(collection.parse({id: 'b4', name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)}))
      model = collection.get('b4')

      # get
      assert.equal(view_model.name(), 'John', "It is a name")
      assert.equal(view_model.number(), '555-555-5558', "Not so interesting number")
      kb.locale_manager.setLocale('en-GB')
      assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format")
      kb.locale_manager.setLocale('fr-FR')
      assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format")

      # set from the view model
      view_model.number('9222-222-222')
      assert.equal(model.get('number'), '9222-222-222', "Number was changed")
      assert.equal(view_model.number(), '9222-222-222', "Number was changed")
      kb.locale_manager.setLocale('en-GB')
      view_model.date('10 December 1963')
      current_date = model.get('date')
      assert.equal(current_date.getFullYear(), 1963, "year is good")
      assert.equal(current_date.getMonth(), 11, "month is good")
      assert.equal(current_date.getDate(), 10, "day is good")

      # set from the model
      model.set({name: 'Yoko', number: '818-818-8181'})
      assert.equal(view_model.name(), 'Yoko', "Name changed")
      assert.equal(view_model.number(), '818-818-8181', "Number was changed")
      model.set({date: new Date(1940, 10, 9)})
      kb.locale_manager.setLocale('fr-FR')
      assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format")
      view_model.date('10 novembre 1940')
      current_date = model.get('date')
      assert.equal(current_date.getFullYear(), 1940, "year is good")
      assert.equal(current_date.getMonth(), 10, "month is good")
      assert.equal(current_date.getDate(), 10, "day is good")

      # go back to loading state
      collection.reset()
      assert.equal(view_model.name(), 'Chargement', "Resets to default")
      kb.utils.setToDefault(view_model)
      kb.locale_manager.setLocale('en')
      assert.equal(view_model.name(), 'Loading dude', "Is that what we want to convey?")
      kb.locale_manager.setLocale('en-GB')
      assert.equal(view_model.name(), 'Loading sir', "Maybe too formal")
      kb.locale_manager.setLocale('fr-FR')
      assert.equal(view_model.name(), 'Chargement', "Localize from day one. Good!")

      # and cleanup after yourself when you are done.
      kb.release(view_model)

      assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
      done()

  it '3. internals test (Coffeescript inheritance)', (done) ->
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
    assert.equal(view_model._email(), undefined, "no email")
    assert.equal(view_model.email(), 'your.name@yourplace.com', "default message")

    view_model._email('j@imagine.com')
    assert.equal(view_model._email(), 'j@imagine.com', "received email")
    assert.equal(view_model.email(), 'j@imagine.com', "received email")

    view_model.email('john@imagine.com')
    assert.equal(view_model._email(), 'john@imagine.com', "received email")
    assert.equal(view_model.email(), 'john@imagine.com', "received email")

    # set from the view model
    kb.locale_manager.setLocale('en-GB')
    assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format")
    view_model.date('10 December 1963')
    current_date = model.get('date')
    assert.equal(current_date.getFullYear(), 1963, "year is good")
    assert.equal(current_date.getMonth(), 11, "month is good")
    assert.equal(current_date.getDate(), 10, "day is good")
    assert.equal(view_model._date().getFullYear(), 1963, "year is good")
    assert.equal(view_model._date().getMonth(), 11, "month is good")
    assert.equal(view_model._date().getDate(), 10, "day is good")

    # set from the model
    model.set({date: new Date(birthdate.valueOf())})
    kb.locale_manager.setLocale('fr-FR')
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format")
    view_model.date('10 novembre 1940')
    current_date = model.get('date')
    assert.equal(current_date.getFullYear(), 1940, "year is good")
    assert.equal(current_date.getMonth(), 10, "month is good")
    assert.equal(current_date.getDate(), 10, "day is good")
    assert.equal(view_model._date().getFullYear(), 1940, "year is good")
    assert.equal(view_model._date().getMonth(), 10, "month is good")
    assert.equal(view_model._date().getDate(), 10, "day is good")

    # set from the automatically-generated date observable
    view_model.date(new Date(birthdate.valueOf()))
    kb.locale_manager.setLocale('fr-FR')
    assert.equal(view_model.date(), '10 novembre 1940', "One past John's birthdate in France format")
    current_date = model.get('date')
    assert.equal(current_date.getFullYear(), 1940, "year is good")
    assert.equal(current_date.getMonth(), 10, "month is good")
    assert.equal(current_date.getDate(), 10, "day is good")
    assert.equal(view_model._date().getFullYear(), 1940, "year is good")
    assert.equal(view_model._date().getMonth(), 10, "month is good")
    assert.equal(view_model._date().getDate(), 10, "day is good")

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()
