assert = assert or require?('chai').assert

kb = window?.kb; try kb or= require?('knockback') catch; try kb or= require?('../../../knockback')
{_, ko} = kb
kb.Backbone.ModelRef or require?('backbone-modelref') if kb.Backbone

unless Globalize
  Globalize = require?('../../lib/globalize')
  require?('../../lib/globalize.culture.en-GB.js'); require?('../../lib/globalize.culture.fr-FR.js')

###############################
class LocaleManager
  constructor: (locale_identifier, @translations_by_locale) ->
    @setLocale(locale_identifier) if locale_identifier

  get: (string_id, parameters) ->
    culture_map = @translations_by_locale[@locale_identifier] if @locale_identifier
    return '' if not culture_map
    string = if culture_map.hasOwnProperty(string_id) then culture_map[string_id] else ''
    return string if arguments == 1
    string = string.replace("{#{index}}", arg) for arg, index in Array.prototype.slice.call(arguments, 1)
    return string

  getLocale: -> return @locale_identifier

  setLocale: (locale_identifier) ->
    @locale_identifier = locale_identifier
    @trigger('change', this)
    @trigger("change:#{key}", value) for key, value of (@translations_by_locale[@locale_identifier] or {})
    return

  getLocales: ->
    locales = []
    locales.push(string_id) for string_id, value of @translations_by_locale
    return locales

_.extend(LocaleManager.prototype, kb.Events) # Mix in kb.Events so callers can subscribe

class LocalizedString
  constructor: (@string_id) ->
    throw 'missing kb.locale_manager' unless kb.locale_manager
    @string = kb.locale_manager.get(@string_id)

Contact = if kb.Parse then kb.Model.extend('Contact', { defaults: {name: '', number: 0, date: new Date()} }) else kb.Model.extend({ defaults: {name: '', number: 0, date: new Date()} })
Contacts = kb.Collection.extend({model: Contact})

class LocalizedStringLocalizer extends kb.LocalizedObservable
  constructor: (value, options, view_model) ->
    super arguments...
    return kb.utils.wrappedObservable(@)
  read: (value) ->
    return if (value.string_id) then kb.locale_manager.get(value.string_id) else ''

class kb.LocalizedStringLocalizer extends kb.LocalizedObservable
  read: (value) ->
    return if (value.string_id) then kb.locale_manager.get(value.string_id) else ''

# NOTE: dependency on globalize
class kb.LongDateLocalizer extends kb.LocalizedObservable
  constructor: (value, options, view_model) ->
    return super arguments... # return the observable instead of this
  read: (value) ->
    return Globalize.format(value, 'dd MMMM yyyy', kb.locale_manager.getLocale())
  write: (localized_string, value) ->
    new_value = Globalize.parseDate(localized_string, 'dd MMMM yyyy', kb.locale_manager.getLocale())
    return kb.utils.wrappedObservable(@).resetToCurrent() if not (new_value and _.isDate(new_value)) # reset if invalid
    value.setTime(new_value.valueOf())

# NOTE: dependency on globalize - notice the alternative formulation with extend
kb.ShortDateLocalizer = kb.LocalizedObservable.extend({
  constructor: (value, options, view_model) ->
    kb.LocalizedObservable.prototype.constructor.apply(this, arguments)
    return kb.utils.wrappedObservable(@) # return the observable instead of this
  read: (value) ->
    return Globalize.format(value, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale())
  write: (localized_string, value) ->
    new_value = Globalize.parseDate(localized_string, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale())
    return kb.utils.wrappedObservable(@).resetToCurrent() if not (new_value and _.isDate(new_value)) # reset if invalid
    value.setTime(new_value.valueOf())
})
###############################

describe 'localized-observable @quick @localization', ->

  it 'TEST DEPENDENCY MISSING', (done) ->
    assert.ok(!!ko, 'ko')
    assert.ok(!!_, '_')
    assert.ok(!!kb.Model, 'kb.Model')
    assert.ok(!!kb.Collection, 'kb.Collection')
    assert.ok(!!kb, 'kb')
    assert.ok(!!Globalize, 'Globalize')
    done()

  locale_manager = new LocaleManager('en', {
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

  it 'Localized greeting', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats
    kb.locale_manager = locale_manager

    ContactViewModelGreeting = (model) ->
      @hello = kb.observable(model, {key:'hello_greeting', localizer: kb.LocalizedStringLocalizer})
      @goodbye = kb.observable(model, {key:'goodbye_greeting', localizer: kb.LocalizedStringLocalizer})
      @

    model = new Contact({hello_greeting: new LocalizedString('formal_hello'), goodbye_greeting: new LocalizedString('formal_goodbye')})
    view_model = new ContactViewModelGreeting(model)

    kb.locale_manager.setLocale('en')
    assert.equal(view_model.hello(), 'Hello', "en: Hello")
    assert.equal(view_model.goodbye(), 'Goodbye', "en: Goobye")

    kb.locale_manager.setLocale('en-GB')
    assert.equal(view_model.hello(), 'Good day sir', "en-GB: Hello")
    assert.equal(view_model.goodbye(), 'Goodbye darling', "en-GB: Goobye")

    kb.locale_manager.setLocale('fr-FR')
    assert.equal(view_model.hello(), 'Bonjour', "fr-FR: Hello")
    assert.equal(view_model.goodbye(), 'Au revoir', "fr-FR: Goobye")

    model.set({hello_greeting: new LocalizedString('informal_hello'), goodbye_greeting: new LocalizedString('informal_goodbye')})
    kb.locale_manager.setLocale('en')
    assert.equal(view_model.hello(), 'Hi', "en: Hello")
    assert.equal(view_model.goodbye(), 'Bye', "en: Goobye")

    kb.locale_manager.setLocale('en-GB')
    assert.equal(view_model.hello(), "Let's get a pint", "en-GB: Hello")
    assert.equal(view_model.goodbye(), 'Toodles', "en-GB: Goobye")

    kb.locale_manager.setLocale('fr-FR')
    assert.equal(view_model.hello(), 'Bonjour', "fr-FR: Hello")
    assert.equal(view_model.goodbye(), 'Au revoir', "fr-FR: Goobye")

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  # NOTE: dependency on globalize and knockback-defaults
  class LongDateLocalizer extends kb.LocalizedObservable
    constructor: (value, options, view_model) ->
      super arguments...
      return kb.utils.wrappedObservable(@)
    read: (value) ->
      return Globalize.format(value, 'dd MMMM yyyy', kb.locale_manager.getLocale())
    write: (localized_string, value, observable) ->
      new_value = Globalize.parseDate(localized_string, 'dd MMMM yyyy', kb.locale_manager.getLocale())
      return observable.setToDefault() if not (new_value and _.isDate(new_value)) # reset if invalid
      value.setTime(new_value.valueOf())

  it 'Date and time with jquery.globalize', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    ContactViewModelDate = (model) ->
      @date = kb.observable(model, {key:'date', localizer: kb.LongDateLocalizer}, this)
      @

    birthdate = new Date(1940, 10, 9)
    model = new Contact({name: 'John', date: new Date(birthdate.valueOf())})
    view_model = new ContactViewModelDate(model)

    # set from the view model
    kb.locale_manager.setLocale('en-GB')
    assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format")
    view_model.date('10 December 1963')
    current_date = model.get('date')
    assert.equal(current_date.getFullYear(), 1963, "year is good")
    assert.equal(current_date.getMonth(), 11, "month is good")
    assert.equal(current_date.getDate(), 10, "day is good")

    # set from the model
    model.set({date: new Date(birthdate.valueOf())})
    kb.locale_manager.setLocale('fr-FR')
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format")
    view_model.date('10 novembre 1940')
    current_date = model.get('date')
    assert.equal(current_date.getFullYear(), 1940, "year is good")
    assert.equal(current_date.getMonth(), 10, "month is good")
    assert.equal(current_date.getDate(), 10, "day is good")

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'Localization with a changing key', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    # directly with the locale manager
    greeting_key = ko.observable('formal_hello')
    locale_manager_greeting = kb.observable(kb.locale_manager, {key:greeting_key})

    kb.locale_manager.setLocale('en')
    assert.equal(locale_manager_greeting(), 'Hello', "en: Hello")
    kb.locale_manager.setLocale('en-GB')
    assert.equal(locale_manager_greeting(), 'Good day sir', "en-GB: Hello")

    greeting_key('formal_goodbye')
    assert.equal(locale_manager_greeting(), 'Goodbye darling', "en-GB: Goodbye")
    kb.locale_manager.setLocale('en')
    assert.equal(locale_manager_greeting(), 'Goodbye', "en: Goodbye")

    ContactViewModelGreeting = (model) ->
      @greeting_key = ko.observable('hello_greeting')
      @greeting = kb.observable(model, {key:@greeting_key, localizer: kb.LocalizedStringLocalizer})
      return

    model = new Contact({hello_greeting: new LocalizedString('formal_hello'), goodbye_greeting: new LocalizedString('formal_goodbye')})
    view_model = new ContactViewModelGreeting(model)

    assert.equal(view_model.greeting(), 'Hello', "en: Hello")
    kb.locale_manager.setLocale('en-GB')
    assert.equal(view_model.greeting(), 'Good day sir', "en-GB: Hello")

    view_model.greeting_key('goodbye_greeting')
    assert.equal(view_model.greeting(), 'Goodbye darling', "en-GB: Goodbye")
    kb.locale_manager.setLocale('en')
    assert.equal(view_model.greeting(), 'Goodbye', "en: Goodbye")

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  # TODO: fix these tests in browserify
  it.skip '2. internals test (Coffeescript inheritance)', (done) ->
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
    model = new Contact({name: 'John', date: new Date(birthdate.valueOf())})
    view_model = new ContactViewModel(model)

    # check email
    assert.equal(view_model._email(), undefined, "no email")
    assert.equal(view_model.email(), 'your.name@yourplace.com', "default message")

    view_model._email('j@imagine.com')
    assert.equal(view_model.email(), 'j@imagine.com', "received email")

    view_model.email('john@imagine.com')
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

  # TODO: fix these tests in browserify
  it.skip '3. internals test (Javascript inheritance)', (done) ->
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
    model = new Contact({name: 'John', date: new Date(birthdate.valueOf())})
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

  it '7. Using kb.localizedObservable', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats
    kb.locale_manager = locale_manager

    class ContactViewModelDate extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['date']})
        @date = new kb.LongDateLocalizer(@_date)

    birthdate = new Date(1940, 10, 9)
    model = new Contact({name: 'John', date: new Date(birthdate.valueOf())})
    view_model = new ContactViewModelDate(model)

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
    assert.equal(view_model.date(), '10 novembre 1940', "John's birthdate in France format")
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

  it '7. Using kb.localizedObservable', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats
    kb.locale_manager = locale_manager

    class ContactViewModelDate extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['date']})
        @date = new kb.LongDateLocalizer(@_date)

    birthdate = new Date(1940, 10, 9)
    model = new Contact({name: 'John', date: new Date(birthdate.valueOf())})
    view_model = new ContactViewModelDate(model)

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
    assert.equal(view_model.date(), '10 novembre 1940', "John's birthdate in France format")
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

  it '10. Nested custom view models', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats
    kb.locale_manager = locale_manager

    class ContactViewModelDate extends kb.ViewModel
      constructor: (model, options) ->
        super(model, _.extend({internals: ['date']}, options))
        @date = new kb.LongDateLocalizer(@_date)

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
    nested_model = new kb.Model({
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
      assert.equal(view_model.name(), name, "#{name}: Name matches")

      # set from the view model
      kb.locale_manager.setLocale('en-GB')
      formatted_date = new kb.LongDateLocalizer(birthdate)
      assert.equal(view_model.date(), formatted_date(), "#{name}: Birthdate in Great Britain format")
      view_model.date('10 December 1963')
      current_date = model.get('date')
      assert.equal(current_date.getFullYear(), 1963, "#{name}: year is good")
      assert.equal(current_date.getMonth(), 11, "#{name}: month is good")
      assert.equal(current_date.getDate(), 10, "#{name}: day is good")
      assert.equal(view_model._date().getFullYear(), 1963, "#{name}: year is good")
      assert.equal(view_model._date().getMonth(), 11, "#{name}: month is good")
      assert.equal(view_model._date().getDate(), 10, "#{name}: day is good")

      model.set({date: new Date(birthdate.valueOf())}) # restore birthdate

      # set from the model
      kb.locale_manager.setLocale('fr-FR')
      assert.equal(view_model.date(), formatted_date(), "#{name}: Birthdate in France format")
      view_model.date('10 novembre 1940')
      current_date = model.get('date')
      assert.equal(current_date.getFullYear(), 1940, "#{name}: year is good")
      assert.equal(current_date.getMonth(), 10, "#{name}: month is good")
      assert.equal(current_date.getDate(), 10, "#{name}: day is good")
      assert.equal(view_model._date().getFullYear(), 1940, "#{name}: year is good")
      assert.equal(view_model._date().getMonth(), 10, "#{name}: month is good")
      assert.equal(view_model._date().getDate(), 10, "#{name}: day is good")

      model.set({date: new Date(birthdate.valueOf())}) # restore birthdate

    validateGenericViewModel = (view_model, name, birthdate) ->
      assert.equal(view_model.name(), name, "#{name}: Name matches")
      assert.equal(view_model.date().valueOf(), birthdate.valueOf(), "#{name}: Birthdate matches")

    validateModel = (model, name, birthdate) ->
      assert.equal(model.get('name'), name, "#{name}: Name matches")
      assert.equal(model.get('date').valueOf(), birthdate.valueOf(), "#{name}: Birthdate matches")

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

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '12. Prior kb.Observables functionality', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats
    kb.locale_manager = locale_manager

    ContactViewModel = (model) ->
      @dynamic_observables = kb.viewModel(model, {keys: {
        name:     {key: 'name'}
        number:   'number'
        date:     {key: 'date', localizer: kb.LongDateLocalizer}
        name2:    {key: 'name'}
      }}, @)
      return

    model = new Contact({name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)})
    view_model = new ContactViewModel(model)

    # get
    assert.equal(view_model.name(), 'John', "It is a name")
    assert.equal(view_model.name2(), 'John', "It is a name")
    assert.equal(view_model.number(), '555-555-5558', "Not so interesting number")
    kb.locale_manager.setLocale('en-GB')
    assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format")
    kb.locale_manager.setLocale('fr-FR')
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format")

    # set from the view model
    assert.equal(model.get('name'), 'John', "Name not changed")
    assert.equal(view_model.name(), 'John', "Name not changed")
    assert.equal(view_model.name2(), 'John', "Name not changed")
    view_model.number('9222-222-222')
    assert.equal(model.get('number'), '9222-222-222', "Number was changed")
    assert.equal(view_model.number(), '9222-222-222', "Number was changed")
    kb.locale_manager.setLocale('en-GB')
    view_model.date('10 December 1963')
    current_date = model.get('date')
    assert.equal(current_date.getFullYear(), 1963, "year is good")
    assert.equal(current_date.getMonth(), 11, "month is good")
    assert.equal(current_date.getDate(), 10, "day is good")

    assert.equal(model.get('name'), 'John', "Name not changed")
    assert.equal(view_model.name(), 'John', "Name not changed")
    assert.equal(view_model.name2(), 'John', "Name not changed")

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

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '13. Bulk mode (array of keys)', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats
    kb.locale_manager = locale_manager

    model = new Contact({name: 'John', number: '555-555-5558'})
    view_model = kb.viewModel(model, ['name', 'number'])

    # get
    assert.equal(view_model.name(), 'John', "It is a name")
    assert.equal(view_model.number(), '555-555-5558', "Not so interesting number")
    kb.locale_manager.setLocale('en-GB')
    kb.locale_manager.setLocale('fr-FR')

    # set from the view model
    view_model.name('Paul')
    assert.equal(model.get('name'), 'Paul', "Name changed")
    assert.equal(view_model.name(), 'Paul', "Name changed")
    view_model.number('9222-222-222')
    assert.equal(model.get('number'), '9222-222-222', "Number was changed")
    assert.equal(view_model.number(), '9222-222-222', "Number was changed")
    kb.locale_manager.setLocale('en-GB')

    # set from the model
    model.set({name: 'Yoko', number: '818-818-8181'})
    assert.equal(view_model.name(), 'Yoko', "Name changed")
    assert.equal(view_model.number(), '818-818-8181', "Number was changed")
    kb.locale_manager.setLocale('fr-FR')

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

describe 'defaults @quick @defaults', ->

  it 'TEST DEPENDENCY MISSING', (done) ->
    assert.ok(!!ko, 'ko')
    assert.ok(!!_, '_')
    assert.ok(!!kb.Model, 'kb.Model')
    assert.ok(!!kb.Collection, 'kb.Collection')
    assert.ok(!!kb, 'kb')
    assert.ok(!!Globalize, 'Globalize')
    done()

  locale_manager = new LocaleManager('en', {
    'en': {loading: "Loading dude"}
    'en-GB': {loading: "Loading sir"}
    'fr-FR': {loading: "Chargement"}
  })

  if kb.Backbone
    it '1. Standard use case: just enough to get the picture', (done) ->
      kb.statistics = new kb.Statistics() # turn on stats
      kb.locale_manager = locale_manager

      ContactViewModel = (model) ->
        @loading_message = new kb.LocalizedStringLocalizer(new LocalizedString('loading'))
        @_auto = kb.viewModel(model, {keys: {
          name:     {key:'name', default: @loading_message}
          number:   {key:'number', default: @loading_message}
          date:     {key:'date', default: @loading_message, localizer: kb.ShortDateLocalizer}
        }}, this)
        @

      collection = new Contacts()
      model_ref = new kb.Backbone.ModelRef(collection, 'b4')
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
          @loading_message = new kb.LocalizedStringLocalizer(new LocalizedString('loading'))
          @name = kb.defaultObservable(@_name, @loading_message)
          @number = kb.defaultObservable(@_number, @loading_message)
          @date = kb.defaultObservable(new kb.LongDateLocalizer(@_date), @loading_message)

      collection = new Contacts()
      model_ref = new kb.Backbone.ModelRef(collection, 'b4')
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

  # TODO: fix these tests in browserify
  it.skip '3. internals test (Coffeescript inheritance)', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats
    kb.locale_manager = locale_manager

    class ContactViewModel extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['email', 'date']})
        @email = kb.defaultObservable(@_email, 'your.name@yourplace.com')
        @date = new kb.LongDateLocalizer(@_date)

    birthdate = new Date(1940, 10, 9)
    model = new Contact({name: 'John', date: new Date(birthdate.valueOf())})
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

  # https://github.com/kmalakoff/knockback/issues/114
  it '4. 0 should not behave as null', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    model = new Contact()
    casebutton = kb.observable(model, {key:'casebutton', 'default': 99});
    casecond = ko.computed ->
      switch casebutton()
        when 0 then return 'Open'
        when 1 then return 'Closed'
        else return 'Unknown'

    assert.equal(casebutton(), 99)
    assert.equal(casecond(), 'Unknown')

    model.set({casebutton: 0})
    assert.equal(casebutton(), 0)
    assert.equal(casecond(), 'Open')

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()
