$(document).ready( ->
  module("knockback_view_model.js")
  test("TEST DEPENDENCY MISSING", ->
    ko.utils; _.VERSION; Backbone.VERSION
  )

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
    ok(view_model.something != null, "Somthing remains removed")
    kb.vmRelease(view_model)
    ok(view_model.something == null, "Something removed")
  )

  test("Using in conjunction with Coffeescript classes", ->
    class ContactViewModelCustom extends kb.ViewModel
      constructor: (model) ->
        super(model)
        @formatted_name = ko.dependentObservable(=> return "First: #{@name()}")
        @formatted_number = ko.dependentObservable({
          read: => return "#: #{@number()}"
          write: (value) => @number(value.substring(3))
        }, this)

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

  test("Using in conjunction with simple Javascript classes", ->
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

  test("Using in conjunction with kb.localizedObservable", ->
    Knockback.locale_manager = new LocaleManager('en', {})

    class ContactViewModelDate extends kb.ViewModel
      constructor: (model) ->
        super(model)
        @formatted_date = new LongDateLocalizer(@date)

    birthdate = new Date(1940, 10, 9)
    model = new Contact({name: 'John', date: new Date(birthdate.valueOf())})
    view_model = new ContactViewModelDate(model)

    # set from the view model
    Knockback.locale_manager.setLocale('en-GB')
    equal(view_model.formatted_date(), '09 November 1940', "John's birthdate in Great Britain format")
    view_model.formatted_date('10 December 1963')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1963, "year is good")
    equal(current_date.getMonth(), 11, "month is good")
    equal(current_date.getDate(), 10, "day is good")
    equal(view_model.date().getFullYear(), 1963, "year is good")
    equal(view_model.date().getMonth(), 11, "month is good")
    equal(view_model.date().getDate(), 10, "day is good")

    # set from the model
    model.set({date: new Date(birthdate.valueOf())})
    Knockback.locale_manager.setLocale('fr-FR')
    equal(view_model.date().valueOf(), birthdate.valueOf(), "John's birthdate in France format")
    view_model.formatted_date('10 novembre 1940')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1940, "year is good")
    equal(current_date.getMonth(), 10, "month is good")
    equal(current_date.getDate(), 10, "day is good")
    equal(view_model.date().getFullYear(), 1940, "year is good")
    equal(view_model.date().getMonth(), 10, "month is good")
    equal(view_model.date().getDate(), 10, "day is good")

    # set from the automatically-generated date observable
    view_model.date(new Date(birthdate.valueOf()))
    Knockback.locale_manager.setLocale('fr-FR')
    equal(view_model.date().valueOf(), birthdate.valueOf(), "John's birthdate in France format")
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1940, "year is good")
    equal(current_date.getMonth(), 10, "month is good")
    equal(current_date.getDate(), 9, "day is good")
    equal(view_model.date().getFullYear(), 1940, "year is good")
    equal(view_model.date().getMonth(), 10, "month is good")
    equal(view_model.date().getDate(), 9, "day is good")

    # and cleanup after yourself when you are done.
    kb.vmRelease(view_model)
  )

  test("Error cases", ->
    # TODO
  )
)