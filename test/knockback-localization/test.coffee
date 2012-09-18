$(->
  module("knockback-localized-observable.js")

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  _ = if not window._ and (typeof(require) isnt 'undefined') then require('underscore') else window._
  _ = _._ if _ and _.hasOwnProperty('_') # LEGACY
  Backbone = if not window.Backbone and (typeof(require) isnt 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) isnt 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) isnt 'undefined') then require('knockback') else window.kb
  require('knockback-examples-localization') if (typeof(require) isnt 'undefined')

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko, 'ko')
    ok(!!_, '_')
    ok(!!Backbone, 'Backbone')
    ok(!!kb, 'kb')
    ok(!!kb, 'kb')
  )

  locale_manager = new kb.LocaleManager('en', {
    'en':
      formal_hello: 'Hello'
      formal_goodbye: 'Goodbye'
      informal_hello: 'Hi'
      informal_goodbye: 'Bye'
    'en-GB':
      formal_hello: 'Good day sir'
      formal_goodbye: 'Goodbye darling'
      informal_hello: "Let's get a pint"
      informal_goodbye: 'Toodles'
    'fr-FR':
      informal_hello: 'Bonjour'
      informal_goodbye: 'Au revoir'
      formal_hello: 'Bonjour'
      formal_goodbye: 'Au revoir'
  })

  kb.Contact = Backbone.Model.extend({ defaults: {name: '', number: 0, date: new Date()} })
  kb.ContactsCollection = Backbone.Collection.extend({ model: kb.Contact })

  class LocalizedStringLocalizer extends kb.LocalizedObservable
    constructor: (value, options, view_model) ->
      super
      return kb.utils.wrappedObservable(@)
    read: (value) ->
      return if (value.string_id) then kb.locale_manager.get(value.string_id) else ''

  test("Localized greeting", ->
    kb.statistics = new kb.Statistics() # turn on stats
    kb.locale_manager = locale_manager

    ContactViewModelGreeting = (model) ->
      @hello = kb.observable(model, {key:'hello_greeting', localizer: kb.LocalizedStringLocalizer})
      @goodbye = kb.observable(model, {key:'goodbye_greeting', localizer: kb.LocalizedStringLocalizer})
      @

    model = new kb.Contact({hello_greeting: new kb.LocalizedString('formal_hello'), goodbye_greeting: new kb.LocalizedString('formal_goodbye')})
    view_model = new ContactViewModelGreeting(model)

    kb.locale_manager.setLocale('en')
    equal(view_model.hello(), 'Hello', "en: Hello")
    equal(view_model.goodbye(), 'Goodbye', "en: Goobye")

    kb.locale_manager.setLocale('en-GB')
    equal(view_model.hello(), 'Good day sir', "en-GB: Hello")
    equal(view_model.goodbye(), 'Goodbye darling', "en-GB: Goobye")

    kb.locale_manager.setLocale('fr-FR')
    equal(view_model.hello(), 'Bonjour', "fr-FR: Hello")
    equal(view_model.goodbye(), 'Au revoir', "fr-FR: Goobye")

    model.set({hello_greeting: new kb.LocalizedString('informal_hello'), goodbye_greeting: new kb.LocalizedString('informal_goodbye')})
    kb.locale_manager.setLocale('en')
    equal(view_model.hello(), 'Hi', "en: Hello")
    equal(view_model.goodbye(), 'Bye', "en: Goobye")

    kb.locale_manager.setLocale('en-GB')
    equal(view_model.hello(), "Let's get a pint", "en-GB: Hello")
    equal(view_model.goodbye(), 'Toodles', "en-GB: Goobye")

    kb.locale_manager.setLocale('fr-FR')
    equal(view_model.hello(), 'Bonjour', "fr-FR: Hello")
    equal(view_model.goodbye(), 'Au revoir', "fr-FR: Goobye")

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  # NOTE: dependency on globalize and knockback-defaults
  class LongDateLocalizer extends kb.LocalizedObservable
    constructor: (value, options, view_model) ->
      super
      return kb.utils.wrappedObservable(@)
    read: (value) ->
      return Globalize.format(value, 'dd MMMM yyyy', kb.locale_manager.getLocale())
    write: (localized_string, value, observable) ->
      new_value = Globalize.parseDate(localized_string, 'dd MMMM yyyy', kb.locale_manager.getLocale())
      return observable.setToDefault() if not (new_value and _.isDate(new_value)) # reset if invalid
      value.setTime(new_value.valueOf())

  test("Date and time with jquery.globalize", ->
    kb.statistics = new kb.Statistics() # turn on stats

    ContactViewModelDate = (model) ->
      @date = kb.observable(model, {key:'date', localizer: kb.LongDateLocalizer}, this)
      @

    birthdate = new Date(1940, 10, 9)
    model = new kb.Contact({name: 'John', date: new Date(birthdate.valueOf())})
    view_model = new ContactViewModelDate(model)

    # set from the view model
    kb.locale_manager.setLocale('en-GB')
    equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format")
    view_model.date('10 December 1963')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1963, "year is good")
    equal(current_date.getMonth(), 11, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    # set from the model
    model.set({date: new Date(birthdate.valueOf())})
    kb.locale_manager.setLocale('fr-FR')
    equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format")
    view_model.date('10 novembre 1940')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1940, "year is good")
    equal(current_date.getMonth(), 10, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("Localization with a changing key", ->
    kb.statistics = new kb.Statistics() # turn on stats

    # directly with the locale manager
    greeting_key = ko.observable('formal_hello')
    locale_manager_greeting = kb.observable(kb.locale_manager, {key:greeting_key})

    kb.locale_manager.setLocale('en')
    equal(locale_manager_greeting(), 'Hello', "en: Hello")
    kb.locale_manager.setLocale('en-GB')
    equal(locale_manager_greeting(), 'Good day sir', "en-GB: Hello")

    greeting_key('formal_goodbye')
    equal(locale_manager_greeting(), 'Goodbye darling', "en-GB: Goodbye")
    kb.locale_manager.setLocale('en')
    equal(locale_manager_greeting(), 'Goodbye', "en: Goodbye")

    ContactViewModelGreeting = (model) ->
      @greeting_key = ko.observable('hello_greeting')
      @greeting = kb.observable(model, {key:@greeting_key, localizer: kb.LocalizedStringLocalizer})
      return

    model = new kb.Contact({hello_greeting: new kb.LocalizedString('formal_hello'), goodbye_greeting: new kb.LocalizedString('formal_goodbye')})
    view_model = new ContactViewModelGreeting(model)

    equal(view_model.greeting(), 'Hello', "en: Hello")
    kb.locale_manager.setLocale('en-GB')
    equal(view_model.greeting(), 'Good day sir', "en-GB: Hello")

    view_model.greeting_key('goodbye_greeting')
    equal(view_model.greeting(), 'Goodbye darling', "en-GB: Goodbye")
    kb.locale_manager.setLocale('en')
    equal(view_model.greeting(), 'Goodbye', "en: Goodbye")

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("2. internals test (Coffeescript inheritance)", ->
    kb.statistics = new kb.Statistics() # turn on stats
    kb.locale_manager = locale_manager

    class ContactViewModel extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['email', 'date']})
        @email = (value) =>
          if arguments.length
            @_email(value)
          else
            return if not @_email() then 'your.name@yourplace.com' else @_email()
        @date = new kb.LongDateLocalizer(@_date)

    birthdate = new Date(1940, 10, 9)
    model = new kb.Contact({name: 'John', date: new Date(birthdate.valueOf())})
    view_model = new ContactViewModel(model)

    # check email
    equal(view_model._email(), undefined, "no email")
    equal(view_model.email(), 'your.name@yourplace.com', "default message")

    view_model._email('j@imagine.com')
    equal(view_model.email(), 'j@imagine.com', "received email")

    view_model.email('john@imagine.com')
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

  test("3. internals test (Javascript inheritance)", ->
    kb.statistics = new kb.Statistics() # turn on stats
    kb.locale_manager = locale_manager

    ContactViewModel = kb.ViewModel.extend({
      constructor: (model) ->
        kb.ViewModel.prototype.constructor.call(this, model, {internals: ['email', 'date']})
        @email = (value) =>
          if arguments.length
            @_email(value)
          else
            return if not @_email() then 'your.name@yourplace.com' else @_email()
        @date = new kb.LongDateLocalizer(@_date)
        return
    })

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
  test("7. Using kb.localizedObservable", ->
    kb.statistics = new kb.Statistics() # turn on stats
    kb.locale_manager = locale_manager

    class ContactViewModelDate extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['date']})
        @date = new kb.LongDateLocalizer(@_date)

    birthdate = new Date(1940, 10, 9)
    model = new kb.Contact({name: 'John', date: new Date(birthdate.valueOf())})
    view_model = new ContactViewModelDate(model)

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
    equal(view_model.date(), '10 novembre 1940', "John's birthdate in France format")
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
  test("7. Using kb.localizedObservable", ->
    kb.statistics = new kb.Statistics() # turn on stats
    kb.locale_manager = locale_manager

    class ContactViewModelDate extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['date']})
        @date = new kb.LongDateLocalizer(@_date)

    birthdate = new Date(1940, 10, 9)
    model = new kb.Contact({name: 'John', date: new Date(birthdate.valueOf())})
    view_model = new ContactViewModelDate(model)

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
    equal(view_model.date(), '10 novembre 1940', "John's birthdate in France format")
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

  test("10. Nested custom view models", ->
    kb.statistics = new kb.Statistics() # turn on stats
    kb.locale_manager = locale_manager

    class ContactViewModelDate extends kb.ViewModel
      constructor: (model, options) ->
        super(model, _.extend({internals: ['date']}, options))
        @date = new kb.LongDateLocalizer(@_date)

    john_birthdate = new Date(1940, 10, 9)
    john = new kb.Contact({name: 'John', date: new Date(john_birthdate.valueOf())})
    paul_birthdate = new Date(1942, 6, 18)
    paul = new kb.Contact({name: 'Paul', date: new Date(paul_birthdate.valueOf())})
    george_birthdate = new Date(1943, 2, 25)
    george = new kb.Contact({name: 'George', date: new Date(george_birthdate.valueOf())})
    ringo_birthdate = new Date(1940, 7, 7)
    ringo = new kb.Contact({name: 'Ringo', date: new Date(ringo_birthdate.valueOf())})
    major_duo = new Backbone.Collection([john, paul])
    minor_duo = new Backbone.Collection([george, ringo])
    nested_model = new Backbone.Model({
      john: john
      paul: paul
      george: george
      ringo: ringo
      major_duo1: major_duo
      major_duo2: major_duo
      major_duo3: major_duo
      minor_duo1: minor_duo
      minor_duo2: minor_duo
      minor_duo3: minor_duo
    })

    nested_view_model = kb.viewModel(nested_model, {
      factories:
        john: ContactViewModelDate
        george: {create: (model, options) -> return new ContactViewModelDate(model, options)}
        'major_duo1.models': ContactViewModelDate
        'major_duo2.models': {create: (model, options) -> return new ContactViewModelDate(model, options)}
        'major_duo3.models': {models_only: true}
        'minor_duo1.models': kb.ViewModel
        'minor_duo2.models': {create: (model, options) -> return new kb.ViewModel(model, options)}
    })

    validateContactViewModel = (view_model, name, birthdate) ->
      model = kb.utils.wrappedModel(view_model)
      equal(view_model.name(), name, "#{name}: Name matches")

      # set from the view model
      kb.locale_manager.setLocale('en-GB')
      formatted_date = new kb.LongDateLocalizer(birthdate)
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

    # models
    validateContactViewModel(nested_view_model.john(), 'John', john_birthdate)
    validateGenericViewModel(nested_view_model.paul(), 'Paul', paul_birthdate)
    validateContactViewModel(nested_view_model.george(), 'George', george_birthdate)
    validateGenericViewModel(nested_view_model.ringo(), 'Ringo', ringo_birthdate)

    # colllections
    validateContactViewModel(nested_view_model.major_duo1()[0], 'John', john_birthdate)
    validateContactViewModel(nested_view_model.major_duo1()[1], 'Paul', paul_birthdate)
    validateContactViewModel(nested_view_model.major_duo2()[0], 'John', john_birthdate)
    validateContactViewModel(nested_view_model.major_duo2()[1], 'Paul', paul_birthdate)
    validateModel(nested_view_model.major_duo3()[0], 'John', john_birthdate)
    validateModel(nested_view_model.major_duo3()[1], 'Paul', paul_birthdate)
    validateGenericViewModel(nested_view_model.minor_duo1()[0], 'George', george_birthdate)
    validateGenericViewModel(nested_view_model.minor_duo1()[1], 'Ringo', ringo_birthdate)
    validateGenericViewModel(nested_view_model.minor_duo2()[0], 'George', george_birthdate)
    validateGenericViewModel(nested_view_model.minor_duo2()[1], 'Ringo', ringo_birthdate)
    validateGenericViewModel(nested_view_model.minor_duo3()[0], 'George', george_birthdate)
    validateGenericViewModel(nested_view_model.minor_duo3()[1], 'Ringo', ringo_birthdate)

    # and cleanup after yourself when you are done.
    kb.release(nested_view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
  test("12. Prior kb.Observables functionality", ->
    kb.statistics = new kb.Statistics() # turn on stats
    kb.locale_manager = locale_manager

    ContactViewModel = (model) ->
      @dynamic_observables = kb.viewModel(model, {keys: {
        name:     {key: 'name'}
        number:   'number'
        date:     {key:'date', localizer: kb.LongDateLocalizer}
        name2:    {key: 'name'}
      }}, this)
      return

    model = new kb.Contact({name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)})
    view_model = new ContactViewModel(model)

    # get
    equal(view_model.name(), 'John', "It is a name")
    equal(view_model.name2(), 'John', "It is a name")
    equal(view_model.number(), '555-555-5558', "Not so interesting number")
    kb.locale_manager.setLocale('en-GB')
    equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format")
    kb.locale_manager.setLocale('fr-FR')
    equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format")

    # set from the view model
    equal(model.get('name'), 'John', "Name not changed")
    equal(view_model.name(), 'John', "Name not changed")
    equal(view_model.name2(), 'John', "Name not changed")
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    kb.locale_manager.setLocale('en-GB')
    view_model.date('10 December 1963')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1963, "year is good")
    equal(current_date.getMonth(), 11, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    equal(model.get('name'), 'John', "Name not changed")
    equal(view_model.name(), 'John', "Name not changed")
    equal(view_model.name2(), 'John', "Name not changed")

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

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("13. Bulk mode (array of keys)", ->
    kb.statistics = new kb.Statistics() # turn on stats
    kb.locale_manager = locale_manager

    model = new kb.Contact({name: 'John', number: '555-555-5558'})
    view_model = kb.viewModel(model, ['name', 'number'])

    # get
    equal(view_model.name(), 'John', "It is a name")
    equal(view_model.number(), '555-555-5558', "Not so interesting number")
    kb.locale_manager.setLocale('en-GB')
    kb.locale_manager.setLocale('fr-FR')

    # set from the view model
    view_model.name('Paul')
    equal(model.get('name'), 'Paul', "Name changed")
    equal(view_model.name(), 'Paul', "Name changed")
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    kb.locale_manager.setLocale('en-GB')

    # set from the model
    model.set({name: 'Yoko', number: '818-818-8181'})
    equal(view_model.name(), 'Yoko', "Name changed")
    equal(view_model.number(), '818-818-8181', "Number was changed")
    kb.locale_manager.setLocale('fr-FR')

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
)