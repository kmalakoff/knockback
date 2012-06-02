$(document).ready( ->
  module("knockback_view_model.js")

  # import Underscore, Backbone, Knockout, and Knockback
  _ = if not window._ and (typeof(require) != 'undefined') then require('underscore') else window._
  Backbone = if not window.Backbone and (typeof(require) != 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) != 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) != 'undefined') then require('knockback') else window.kb

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko); ok(!!_); ok(!!Backbone); ok(!!kb)
  )

  kb.locale_manager = new kb._.LocaleManager('en', {})

  test("Standard use case: read and write", ->
    model = new kb._.Contact({name: 'Ringo', number: '555-555-5556'})
    view_model = kb.viewModel(model)

    # get
    equal(view_model.name(), 'Ringo', "Interesting name")
    equal(view_model.number(), '555-555-5556', "Not so interesting number")

    # set from the view model
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")

    # set from the model
    model.set({name: 'Starr', number: 'XXX-XXX-XXXX'})
    equal(view_model.name(), 'Starr', "Name changed")
    equal(view_model.number(), 'XXX-XXX-XXXX', "Number was changed")

    # and cleanup after yourself when you are done.
    kb.utils.release(view_model)
  )

  test("Standard use case: read only", ->
    model = new kb._.Contact({name: 'Ringo', number: '555-555-5556'})
    view_model = kb.viewModel(model, {read_only: true})

    # get
    equal(view_model.name(), 'Ringo', "Interesting name")
    equal(view_model.number(), '555-555-5556', "Not so interesting number")

    # set from the view model
    raises((->view_model.name('Paul')), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
    equal(model.get('name'), 'Ringo', "Name not changed")
    equal(view_model.name(), 'Ringo', "Name not changed")
    raises((->view_model.number('9222-222-222')), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
    equal(model.get('number'), '555-555-5556', "Number was not changed")
    equal(view_model.number(), '555-555-5556', "Number was not changed")

    # set from the model
    model.set({name: 'Starr', number: 'XXX-XXX-XXXX'})
    equal(view_model.name(), 'Starr', "Name changed")
    equal(view_model.number(), 'XXX-XXX-XXXX', "Number was changed")

    # and cleanup after yourself when you are done.
    kb.utils.release(view_model)
  )

  test("internals test (Coffeescript inheritance)", ->
    class ContactViewModel extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['email', 'date']})
        @email = kb.defaultWrapper(@_email, 'your.name@yourplace.com')
        @date = new kb._.LongDateLocalizer(@_date)

    birthdate = new Date(1940, 10, 9)
    model = new kb._.Contact({name: 'John', date: new Date(birthdate.valueOf())})
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
    kb.utils.release(view_model)
  )

  test("internals test (Javascript inheritance)", ->
    ContactViewModel = kb.ViewModel.extend({
      constructor: (model) ->
        kb.ViewModel.prototype.constructor.call(this, model, {internals: ['email', 'date']})
        @email = kb.defaultWrapper(@_email, 'your.name@yourplace.com')
        @date = new kb._.LongDateLocalizer(@_date)
        @
    })

    birthdate = new Date(1940, 10, 9)
    model = new kb._.Contact({name: 'John', date: new Date(birthdate.valueOf())})
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
    kb.utils.release(view_model)
  )

  test("Using Coffeescript classes", ->
    class ContactViewModelCustom extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['name', 'number']})
        @name = ko.dependentObservable(=> return "First: #{@_name()}")
        @number = kb.formattedObservable('#: {0}', @_number)

    model = new kb._.Contact({name: 'Ringo', number: '555-555-5556'})
    view_model = new ContactViewModelCustom(model)

    # get
    equal(view_model._name(), 'Ringo', "Interesting name")
    equal(view_model.name(), 'First: Ringo', "Interesting name")
    equal(view_model._number(), '555-555-5556', "Not so interesting number")
    equal(view_model.number(), '#: 555-555-5556', "Not so interesting number")

    # set from the view model
    view_model.number('#: 9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model._number(), '9222-222-222', "Number was changed")
    equal(view_model.number(), '#: 9222-222-222', "Number was changed")

    # set from the model
    model.set({name: 'Starr', number: 'XXX-XXX-XXXX'})
    equal(view_model._name(), 'Starr', "Name changed")
    equal(view_model.name(), 'First: Starr', "Name changed")
    equal(view_model._number(), 'XXX-XXX-XXXX', "Number was changed")
    equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed")

    # set from the generated attribute
    view_model._name('Ringo')
    equal(view_model._name(), 'Ringo', "Interesting name")
    equal(view_model.name(), 'First: Ringo', "Interesting name")

    # and cleanup after yourself when you are done.
    kb.utils.release(view_model)
  )

  test("Using simple Javascript classes", ->
    ContactViewModelCustom = (model) ->
      view_model = kb.viewModel(model)
      view_model.formatted_name = kb.observable(model, {key:'name', read: -> return "First: #{model.get('name')}" })
      view_model.formatted_number = kb.observable(model, {
        key:'number'
        read: -> return "#: #{model.get('number')}"
        write: (value) -> model.set({number: value.substring(3)})
      }, view_model)
      return view_model

    model = new kb._.Contact({name: 'Ringo', number: '555-555-5556'})
    view_model = new ContactViewModelCustom(model)

    # get
    equal(view_model.name(), 'Ringo', "Interesting name")
    equal(view_model.formatted_name(), 'First: Ringo', "Interesting name")
    equal(view_model.number(), '555-555-5556', "Not so interesting number")
    equal(view_model.formatted_number(), '#: 555-555-5556', "Not so interesting number")

    # set from the view model
    view_model.formatted_number('#: 9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    equal(view_model.formatted_number(), '#: 9222-222-222', "Number was changed")

    # set from the model
    model.set({name: 'Starr', number: 'XXX-XXX-XXXX'})
    equal(view_model.name(), 'Starr', "Name changed")
    equal(view_model.formatted_name(), 'First: Starr', "Name changed")
    equal(view_model.number(), 'XXX-XXX-XXXX', "Number was changed")
    equal(view_model.formatted_number(), '#: XXX-XXX-XXXX', "Number was changed")

    # and cleanup after yourself when you are done.
    kb.utils.release(view_model)
  )

  test("requires", ->
    class ContactViewModelFullName extends kb.ViewModel
      constructor: (model) ->
        super(model, {requires: ['first', 'last']})
        @full_name = kb.formattedObservable('Last: {1}, First: {0}', @first, @last)

    model = new Backbone.Model()
    view_model = new ContactViewModelFullName(model)
    equal(view_model.full_name(), 'Last: , First: ', "full name is good")

    model.set({first: 'Ringo', last: 'Starr'})
    equal(view_model.full_name(), 'Last: Starr, First: Ringo', "full name is good")

    model.set({first: 'Bongo'})
    equal(view_model.full_name(), 'Last: Starr, First: Bongo', "full name is good")

    view_model.full_name('Last: The Starr, First: Ringo')
    equal(model.get('first'), 'Ringo', "first name is good")
    equal(model.get('last'), 'The Starr', "last name is good")
  )

  test("Using kb.localizedObservable", ->
    class ContactViewModelDate extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['date']})
        @date = new kb._.LongDateLocalizer(@_date)

    birthdate = new Date(1940, 10, 9)
    model = new kb._.Contact({name: 'John', date: new Date(birthdate.valueOf())})
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
    kb.utils.release(view_model)
  )

  test("reference counting and custom __destroy (Coffeescript inheritance)", ->
    class ContactViewModelFullName extends kb.ViewModel
      constructor: (model) ->
        super(model, {requires: ['first', 'last']})
        @is_destroyed = false
      __destroy: ->
        @is_destroyed = true
        super

    model = new Backbone.Model({first: "Hello"})
    view_model = new ContactViewModelFullName(model)

    equal(view_model.first(), "Hello", "Hello exists")

    view_model.retain()
    equal(view_model.refCount(), 2, "ref count 2")
    equal(view_model.is_destroyed, false, "not destroyed")

    view_model.release()
    equal(view_model.refCount(), 1, "ref count 1")
    equal(view_model.is_destroyed, false, "not destroyed")

    view_model.release()
    equal(view_model.refCount(), 0, "ref count 0")
    equal(view_model.is_destroyed, true, "is destroyed using overridden destroy function")

    raises((->view_model.first()), null, "Hello doesn't exist anymore")
    raises((->view_model.release()), null, "ViewModel: ref_count is corrupt: 1")
  )

  test("reference counting and custom __destroy (Javascript inheritance)", ->
    ContactViewModelFullName = kb.ViewModel.extend({
      constructor: (model) ->
        kb.ViewModel.prototype.constructor.call(this, model, {requires: ['first', 'last']})
        @is_destroyed = false
        @

      __destroy: ->
        @is_destroyed = true
        kb.ViewModel.prototype.__destroy.call(this)
    })

    model = new Backbone.Model({first: "Hello"})
    view_model = new ContactViewModelFullName(model)

    equal(view_model.first(), "Hello", "Hello exists")

    view_model.retain()
    equal(view_model.refCount(), 2, "ref count 2")
    equal(view_model.is_destroyed, false, "not destroyed")

    view_model.release()
    equal(view_model.refCount(), 1, "ref count 1")
    equal(view_model.is_destroyed, false, "not destroyed")

    view_model.release()
    equal(view_model.refCount(), 0, "ref count 0")
    equal(view_model.is_destroyed, true, "is destroyed using overridden destroy function")

    raises((->view_model.first()), null, "Hello doesn't exist anymore")
    raises((->view_model.release()), null, "ViewModel: ref_count is corrupt: 1")
  )

  test("Collection with nested custom view models", ->
    kb.stats_on = true # turn on stats

    class ContactViewModelDate extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['date']})
        @date = new kb._.LongDateLocalizer(@_date)

    john_birthdate = new Date(1940, 10, 9)
    john = new kb._.Contact({name: 'John', date: new Date(john_birthdate.valueOf())})
    paul_birthdate = new Date(1942, 6, 18)
    paul = new kb._.Contact({name: 'Paul', date: new Date(paul_birthdate.valueOf())})
    george_birthdate = new Date(1943, 2, 25)
    george = new kb._.Contact({name: 'George', date: new Date(george_birthdate.valueOf())})
    ringo_birthdate = new Date(1940, 7, 7)
    ringo = new kb._.Contact({name: 'Ringo', date: new Date(ringo_birthdate.valueOf())})
    major_duo = new Backbone.Collection([john, paul])
    minor_duo = new Backbone.Collection([george, ringo])
    nested_model = new Backbone.Model({
      john: john
      paul: paul
      george: george
      george2: george
      ringo: ringo
      major_duo: major_duo
      major_duo2: major_duo
      major_duo3: major_duo
      minor_duo: minor_duo
      minor_duo2: minor_duo
      minor_duo3: minor_duo
    })

    nested_view_model = kb.viewModel(nested_model, {
      children:
        john: ContactViewModelDate
        paul: {view_model: ContactViewModelDate}
        george: {view_model_create: (model) -> return new ContactViewModelDate(model)}
        george2: {create: (model, key) -> return new ContactViewModelDate(model.get(key))}
        major_duo: {children: ContactViewModelDate}
        major_duo2: {children: {view_model: ContactViewModelDate}}
        major_duo3: {children: {view_model_create: (model) -> return new ContactViewModelDate(model)}}
        minor_duo2: {children: {view_model: kb.ViewModel}}
        minor_duo3: {children: {create: (model) -> return new kb.ViewModel(model)}}
    })

    validateContactViewModel = (view_model, name, birthdate) ->
      model = kb.utils.wrappedModel(view_model)
      equal(view_model.name(), name, "#{view_model.name()}: Name matches")

      # set from the view model
      kb.locale_manager.setLocale('en-GB')
      formatted_date = new kb._.LongDateLocalizer(birthdate)
      equal(view_model.date(), formatted_date(), "#{view_model.name()}: Birthdate in Great Britain format")
      view_model.date('10 December 1963')
      current_date = model.get('date')
      equal(current_date.getFullYear(), 1963, "#{view_model.name()}: year is good")
      equal(current_date.getMonth(), 11, "#{view_model.name()}: month is good")
      equal(current_date.getDate(), 10, "#{view_model.name()}: day is good")
      equal(view_model._date().getFullYear(), 1963, "#{view_model.name()}: year is good")
      equal(view_model._date().getMonth(), 11, "#{view_model.name()}: month is good")
      equal(view_model._date().getDate(), 10, "#{view_model.name()}: day is good")

      model.set({date: new Date(birthdate.valueOf())}) # restore birthdate

      # set from the model
      kb.locale_manager.setLocale('fr-FR')
      equal(view_model.date(), formatted_date(), "#{view_model.name()}: Birthdate in France format")
      view_model.date('10 novembre 1940')
      current_date = model.get('date')
      equal(current_date.getFullYear(), 1940, "#{view_model.name()}: year is good")
      equal(current_date.getMonth(), 10, "#{view_model.name()}: month is good")
      equal(current_date.getDate(), 10, "#{view_model.name()}: day is good")
      equal(view_model._date().getFullYear(), 1940, "#{view_model.name()}: year is good")
      equal(view_model._date().getMonth(), 10, "#{view_model.name()}: month is good")
      equal(view_model._date().getDate(), 10, "#{view_model.name()}: day is good")

      model.set({date: new Date(birthdate.valueOf())}) # restore birthdate

    validateGenericViewModel = (view_model, name, birthdate) ->
      equal(view_model.name(), name, "#{view_model.name()}: Name matches")
      equal(view_model.date().valueOf(), birthdate.valueOf(), "#{view_model.name()}: Birthdate matches")

    # models
    validateContactViewModel(nested_view_model.john, 'John', john_birthdate)
    validateContactViewModel(nested_view_model.paul, 'Paul', paul_birthdate)
    validateContactViewModel(nested_view_model.george, 'George', george_birthdate)
    validateContactViewModel(nested_view_model.george2, 'George', george_birthdate)
    validateGenericViewModel(nested_view_model.ringo(), 'Ringo', ringo_birthdate)

    # colllections
    validateContactViewModel(nested_view_model.major_duo()[0], 'John', john_birthdate)
    validateContactViewModel(nested_view_model.major_duo()[1], 'Paul', paul_birthdate)
    validateContactViewModel(nested_view_model.major_duo2()[0], 'John', john_birthdate)
    validateContactViewModel(nested_view_model.major_duo2()[1], 'Paul', paul_birthdate)
    validateContactViewModel(nested_view_model.major_duo3()[0], 'John', john_birthdate)
    validateContactViewModel(nested_view_model.major_duo3()[1], 'Paul', paul_birthdate)
    validateGenericViewModel(nested_view_model.minor_duo()[0], 'George', george_birthdate)
    validateGenericViewModel(nested_view_model.minor_duo()[1], 'Ringo', ringo_birthdate)
    validateGenericViewModel(nested_view_model.minor_duo2()[0], 'George', george_birthdate)
    validateGenericViewModel(nested_view_model.minor_duo2()[1], 'Ringo', ringo_birthdate)
    validateGenericViewModel(nested_view_model.minor_duo3()[0], 'George', george_birthdate)
    validateGenericViewModel(nested_view_model.minor_duo3()[1], 'Ringo', ringo_birthdate)

    # and cleanup after yourself when you are done.
    kb.utils.release(nested_view_model)

    # check stats
    equal(kb.stats.collection_observables, 0, 'Cleanup: no collection observables')
    equal(kb.stats.view_models, 0, 'Cleanup: no view models')
    kb.stats_on = false # turn off stats
  )

  test("Error cases", ->
    # TODO
  )
)