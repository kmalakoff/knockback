$(document).ready( ->
  module("knockback_localized_observable.js")

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

  class LocalizedStringLocalizer extends kb.LocalizedObservable
    constructor: (value, options, view_model) ->
      super
      return kb.utils.wrappedObservable(@)
    read: (value) ->
      return if (value.string_id) then kb.locale_manager.get(value.string_id) else ''

  test("Localized greeting", ->
    kb.statistics = new kb.Statistics() # turn on stats

    ContactViewModelGreeting = (model) ->
      @hello = kb.observable(model, {key:'hello_greeting', localizer: _kbe.LocalizedStringLocalizer})
      @goodbye = kb.observable(model, {key:'goodbye_greeting', localizer: _kbe.LocalizedStringLocalizer})
      @

    model = new _kbe.Contact({hello_greeting: new _kbe.LocalizedString('formal_hello'), goodbye_greeting: new _kbe.LocalizedString('formal_goodbye')})
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

    model.set({hello_greeting: new _kbe.LocalizedString('informal_hello'), goodbye_greeting: new _kbe.LocalizedString('informal_goodbye')})
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

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  # NOTE: dependency on globalize
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
      @date = kb.observable(model, {key:'date', localizer: _kbe.LongDateLocalizer}, this)
      @

    birthdate = new Date(1940, 10, 9)
    model = new _kbe.Contact({name: 'John', date: new Date(birthdate.valueOf())})
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

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("kb.formattedObservable", ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelFullName extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['first', 'last']})
        @full_name = kb.formattedObservable('Last: {1}, First: {0}', @_first, @_last)

    model = new Backbone.Model({first: 'Ringo', last: 'Starr'})
    view_model = new ContactViewModelFullName(model)
    equal(view_model.full_name(), 'Last: Starr, First: Ringo', "full name is good")

    model.set({first: 'Bongo'})
    equal(view_model.full_name(), 'Last: Starr, First: Bongo', "full name is good")

    view_model.full_name('Last: The Starr, First: Ringo')
    equal(view_model.full_name(), 'Last: The Starr, First: Ringo', "full name is good")
    equal(model.get('first'), 'Ringo', "first name is good")
    equal(model.get('last'), 'The Starr', "last name is good")

    # clean up
    kb.release(view_model)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
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
      @greeting = kb.observable(model, {key:@greeting_key, localizer: _kbe.LocalizedStringLocalizer})
      @

    model = new _kbe.Contact({hello_greeting: new _kbe.LocalizedString('formal_hello'), goodbye_greeting: new _kbe.LocalizedString('formal_goodbye')})
    view_model = new ContactViewModelGreeting(model)

    equal(view_model.greeting(), 'Hello', "en: Hello")
    kb.locale_manager.setLocale('en-GB')
    equal(view_model.greeting(), 'Good day sir', "en-GB: Hello")

    view_model.greeting_key('goodbye_greeting')
    equal(view_model.greeting(), 'Goodbye darling', "en-GB: Goodbye")
    kb.locale_manager.setLocale('en')
    equal(view_model.greeting(), 'Goodbye', "en: Goodbye")

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
)