$(document).ready( ->
  module("knockback_view_model.js")
  test("TEST DEPENDENCY MISSING", ->
    ko.utils; _.VERSION; Backbone.VERSION
  )

  Knockback.locale_manager = new LocaleManager('en', {})

  test("Standard use case: read and write", ->
    model = new Contact({name: 'Ringo', number: '555-555-5556'})
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
    kb.vmRelease(view_model)
  )

  test("Standard use case: read only", ->
    model = new Contact({name: 'Ringo', number: '555-555-5556'})
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
    kb.vmRelease(view_model)
  )

  test("internals test", ->
    class ContactViewModel extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['email', 'date']})
        @email = kb.defaultWrapper(@_email, 'your.name@yourplace.com')
        @date = new LongDateLocalizer(@_date)

    birthdate = new Date(1940, 10, 9)
    model = new Contact({name: 'John', date: new Date(birthdate.valueOf())})
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
    Knockback.locale_manager.setLocale('en-GB')
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
    Knockback.locale_manager.setLocale('fr-FR')
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
    Knockback.locale_manager.setLocale('fr-FR')
    equal(view_model.date(), '10 novembre 1940', "One past John's birthdate in France format")
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1940, "year is good")
    equal(current_date.getMonth(), 10, "month is good")
    equal(current_date.getDate(), 10, "day is good")
    equal(view_model._date().getFullYear(), 1940, "year is good")
    equal(view_model._date().getMonth(), 10, "month is good")
    equal(view_model._date().getDate(), 10, "day is good")

    # and cleanup after yourself when you are done.
    kb.vmRelease(view_model)
  )

  test("merge into an external view model", ->
    model = new Contact({name: 'Ringo', number: '555-555-5556'})
    view_model = {
      something: ko.observable('foo')
    }
    view_model_instance = kb.viewModel(model, {}, view_model)

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
    kb.vmRelease(view_model_instance)
    ok(view_model.number == null, "Number removed")
    ok(view_model.something != null, "Something remains removed")
    kb.vmRelease(view_model)
    ok(view_model.something == null, "Something removed")
  )

  test("Using Coffeescript classes", ->
    class ContactViewModelCustom extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['name', 'number']})
        @name = ko.dependentObservable(=> return "First: #{@_name()}")
        @number = kb.formattedObservable('#: {0}', @_number)

    model = new Contact({name: 'Ringo', number: '555-555-5556'})
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
    kb.vmRelease(view_model)
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

    model = new Contact({name: 'Ringo', number: '555-555-5556'})
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
    kb.vmRelease(view_model)
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
        @date = new LongDateLocalizer(@_date)

    birthdate = new Date(1940, 10, 9)
    model = new Contact({name: 'John', date: new Date(birthdate.valueOf())})
    view_model = new ContactViewModelDate(model)

    # set from the view model
    Knockback.locale_manager.setLocale('en-GB')
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
    Knockback.locale_manager.setLocale('fr-FR')
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
    Knockback.locale_manager.setLocale('fr-FR')
    equal(view_model.date(), '10 novembre 1940', "John's birthdate in France format")
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1940, "year is good")
    equal(current_date.getMonth(), 10, "month is good")
    equal(current_date.getDate(), 10, "day is good")
    equal(view_model._date().getFullYear(), 1940, "year is good")
    equal(view_model._date().getMonth(), 10, "month is good")
    equal(view_model._date().getDate(), 10, "day is good")

    # and cleanup after yourself when you are done.
    kb.vmRelease(view_model)
  )

  test("reference counting and custom __destroy", ->
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
    raises((->view_model.release()), Error, "ViewModel: ref_count is corrupt: 1")
  )

  test("reference counting and custom __destroy non-Coffeescript inheritance", ->
    ContactViewModelFullName_POJS = kb.ViewModel.extend({
      constructor: (model) ->
        kb.ViewModel.prototype.constructor.call(this, model, {requires: ['first', 'last']})
        @is_destroyed = false
        @

      __destroy: ->
        @is_destroyed = true
        kb.ViewModel.prototype.__destroy.call(this)
    })

    model = new Backbone.Model({first: "Hello"})
    view_model = new ContactViewModelFullName_POJS(model)

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
    raises((->view_model.release()), Error, "ViewModel: ref_count is corrupt: 1")
  )

  test("Error cases", ->
    # TODO
  )
)