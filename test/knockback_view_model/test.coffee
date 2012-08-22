$(document).ready( ->
  module("knockback_view_model.js")

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

  kb.locale_manager = new _kbe.LocaleManager('en', {})

  test("Standard use case: read and write", ->
    kb.statistics = new kb.Statistics() # turn on stats

    model = new _kbe.Contact({name: 'Ringo', number: '555-555-5556'})
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
    kb.release(view_model)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
  
  test("internals test (Coffeescript inheritance)", ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModel extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['email', 'date']})
        @email = kb.defaultWrapper(@_email, 'your.name@yourplace.com')
        @date = new _kbe.LongDateLocalizer(@_date)
  
    birthdate = new Date(1940, 10, 9)
    model = new _kbe.Contact({name: 'John', date: new Date(birthdate.valueOf())})
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

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
  
  test("internals test (Javascript inheritance)", ->
    kb.statistics = new kb.Statistics() # turn on stats

    ContactViewModel = kb.ViewModel.extend({
      constructor: (model) ->
        kb.ViewModel.prototype.constructor.call(this, model, {internals: ['email', 'date']})
        @email = kb.defaultWrapper(@_email, 'your.name@yourplace.com')
        @date = new _kbe.LongDateLocalizer(@_date)
        @
    })
  
    birthdate = new Date(1940, 10, 9)
    model = new _kbe.Contact({name: 'John', date: new Date(birthdate.valueOf())})
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

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
  
  test("Using Coffeescript classes", ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelCustom extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['name', 'number']})
        @name = ko.dependentObservable(=> return "First: #{@_name()}")
        @number = kb.formattedObservable('#: {0}', @_number)
  
    model = new _kbe.Contact({name: 'Ringo', number: '555-555-5556'})
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
    kb.release(view_model)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
  
  test("Using simple Javascript classes", ->
    kb.statistics = new kb.Statistics() # turn on stats

    ContactViewModelCustom = (model) ->
      view_model = kb.viewModel(model)
      view_model.formatted_name = kb.observable(model, {key:'name', read: -> return "First: #{model.get('name')}" })
      view_model.formatted_number = kb.observable(model, {
        key:'number'
        read: -> return "#: #{model.get('number')}"
        write: (value) -> model.set({number: value.substring(3)})
      }, view_model)
      return view_model
  
    model = new _kbe.Contact({name: 'Ringo', number: '555-555-5556'})
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
    kb.release(view_model)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
  
  test("requires", ->
    kb.statistics = new kb.Statistics() # turn on stats

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

    # clean up
    kb.release(view_model)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
  
  test("Using kb.localizedObservable", ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelDate extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['date']})
        @date = new _kbe.LongDateLocalizer(@_date)
  
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

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
  
  test("reference counting and custom __destroy (Coffeescript inheritance)", ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelFullName extends kb.ViewModel
      constructor: (model) ->
        super(model, {requires: ['first', 'last']})
        @is_destroyed = false
 
        # monkey patch reference counting
        @ref_count = 1
        @super_destroy = @destroy; @destroy = null
        @is_destroyed = false

      retain: -> @ref_count++
      refCount: -> return @ref_count
      release: -> 
        --@ref_count
        throw "ref count is corrupt" if @ref_count < 0 
        return if @ref_count
        @is_destroyed = true
        @super_destroy()
 
    model = new Backbone.Model({first: "Hello"})
    view_model = new ContactViewModelFullName(model)
  
    equal(view_model.first(), "Hello", "Hello exists")
  
    view_model.retain()
    equal(view_model.refCount(), 2, "ref count 2")
    equal(view_model.is_destroyed, false, "not destroyed")
  
    view_model.release()
    equal(view_model.refCount(), 1, "ref count 1")
    equal(view_model.is_destroyed, false, "not destroyed")
  
    kb.release(view_model)
    equal(view_model.refCount(), 0, "ref count 0")
    equal(view_model.is_destroyed, true, "is destroyed using overridden destroy function")
  
    raises((->view_model.first()), null, "Hello doesn't exist anymore")
    raises((->view_model.release()), null, "ref count is corrupt")

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
  
  test("reference counting and custom __destroy (Javascript inheritance)", ->
    kb.statistics = new kb.Statistics() # turn on stats

    ContactViewModelFullName = kb.ViewModel.extend({
      constructor: (model) ->
        kb.ViewModel.prototype.constructor.call(this, model, {requires: ['first', 'last']})
  
        # monkey patch reference counting
        @ref_count = 1
        @super_destroy = @destroy; @destroy = null
        @is_destroyed = false

      retain: -> @ref_count++
      refCount: -> return @ref_count
      release: -> 
        --@ref_count
        throw "ref count is corrupt" if @ref_count < 0 
        return if @ref_count
        @is_destroyed = true
        @super_destroy()
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
  
    kb.release(view_model)
    equal(view_model.refCount(), 0, "ref count 0")
    equal(view_model.is_destroyed, true, "is destroyed using overridden destroy function")
  
    raises((->view_model.first()), null, "Hello doesn't exist anymore")
    raises((->view_model.release()), null, "ref count is corrupt")

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("Nested custom view models", ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelDate extends kb.ViewModel
      constructor: (model, options) ->
        super(model, _.extend({internals: ['date']}, options))
        @date = new _kbe.LongDateLocalizer(@_date)

    john_birthdate = new Date(1940, 10, 9)
    john = new _kbe.Contact({name: 'John', date: new Date(john_birthdate.valueOf())})
    paul_birthdate = new Date(1942, 6, 18)
    paul = new _kbe.Contact({name: 'Paul', date: new Date(paul_birthdate.valueOf())})
    george_birthdate = new Date(1943, 2, 25)
    george = new _kbe.Contact({name: 'George', date: new Date(george_birthdate.valueOf())})
    ringo_birthdate = new Date(1940, 7, 7)
    ringo = new _kbe.Contact({name: 'Ringo', date: new Date(ringo_birthdate.valueOf())})
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
      formatted_date = new _kbe.LongDateLocalizer(birthdate)
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

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("Changing attribute types", ->
    kb.statistics = new kb.Statistics() # turn on stats

    model = new Backbone.Model({reused: null})
    view_model = kb.viewModel(model)
    equal(kb.utils.valueType(view_model.reused), KB_TYPE_SIMPLE, 'reused is KB_TYPE_SIMPLE')

    model.set({reused: new Backbone.Model()})
    equal(kb.utils.valueType(view_model.reused), KB_TYPE_MODEL, 'reused is KB_TYPE_MODEL')

    model.set({reused: new Backbone.Collection()})
    equal(kb.utils.valueType(view_model.reused), KB_TYPE_COLLECTION, 'reused is KB_TYPE_COLLECTION')

    model.set({reused: null})
    equal(kb.utils.valueType(view_model.reused), KB_TYPE_COLLECTION, 'reused is retains type of KB_TYPE_COLLECTION')

    # clean up
    kb.release(view_model)

    # add custom mapping
    view_model = kb.viewModel(model, {factories: 
      reused: (obj, options) -> return if obj instanceof Backbone.Collection then kb.collectionObservable(obj, options) else kb.viewModel(obj, options)
    })
    equal(kb.utils.valueType(view_model.reused), KB_TYPE_MODEL, 'reused is KB_TYPE_MODEL')

    model.set({reused: new Backbone.Model()})
    equal(kb.utils.valueType(view_model.reused), KB_TYPE_MODEL, 'reused is KB_TYPE_MODEL')

    model.set({reused: new Backbone.Collection()})
    equal(kb.utils.valueType(view_model.reused), KB_TYPE_COLLECTION, 'reused is KB_TYPE_COLLECTION')

    model.set({reused: null})
    equal(kb.utils.valueType(view_model.reused), KB_TYPE_COLLECTION, 'reused retains type of KB_TYPE_COLLECTION')

    # clean up
    kb.release(view_model)

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("Prior kb.Observables functionality", ->
    kb.statistics = new kb.Statistics() # turn on stats

    ContactViewModel = (model) ->
      @dynamic_observables = kb.viewModel(model, {keys: {
        name:     {key: 'name'}
        number:   'number'
        date:     {key:'date', localizer: _kbe.LongDateLocalizer}
        name2:    {key: 'name'}
      }}, this)
      @

    model = new _kbe.Contact({name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)})
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

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("Bulk mode (array of keys)", ->
    kb.statistics = new kb.Statistics() # turn on stats

    model = new _kbe.Contact({name: 'John', number: '555-555-5558'})
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

    equal(kb.statistics.registeredTypeStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
)