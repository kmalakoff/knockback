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

  test("Error cases", ->
    # TODO
  )
)