$(document).ready( ->
  module("knockback_model_attribute_observable.js")
  test("TEST DEPENDENCY MISSING", ->
    ko.utils; _.VERSION; Backbone.VERSION
  )

  test("Standard use case: direct attributes with read and write", ->
    class ContactViewModel
      constructor: (model) ->
        @name = new kb.ModelAttributeObservable(model, keypath:'name')
        @number = new kb.ModelAttributeObservable(model, {keypath:'number', read_write: true}, this)
      destroy: ->
        @name.destroy(); @number.destroy()

    model = new Contact({name: 'Ringo', number: '555-555-5556'})
    view_model = new ContactViewModel(model)

    # get
    equal(view_model.name(), 'Ringo', "Interesting name")
    equal(view_model.number(), '555-555-5556', "Not so interesting number")

    # set from the view model
    raises((->view_model.name('Paul')), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
    equal(model.get('name'), 'Ringo', "Name not changed")
    equal(view_model.name(), 'Ringo', "Name not changed")
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")

    # set from the model
    model.set({name: 'Starr', number: 'XXX-XXX-XXXX'})
    equal(view_model.name(), 'Starr', "Name changed")
    equal(view_model.number(), 'XXX-XXX-XXXX', "Number was changed")
  )

  test("Standard use case: direct attributes with custom read and write", ->
    class ContactViewModelCustom
      constructor: (model) ->
        @name = new kb.ModelAttributeObservable(model, {keypath:'name', read: -> return "First: #{model.get('name')}" })
        @number = new kb.ModelAttributeObservable(model, {
          keypath:'number', read_write: true
          read: -> return "#: #{model.get('number')}"
          write: (value) -> model.set({number: value.substring(3)})
        }, this)
      destroy: ->
        @name.destroy(); @number.destroy()

    model = new Contact({name: 'Ringo', number: '555-555-5556'})
    view_model = new ContactViewModelCustom(model)

    # get
    equal(view_model.name(), 'First: Ringo', "Interesting name")
    equal(view_model.number(), '#: 555-555-5556', "Not so interesting number")

    # set from the view model
    raises((->view_model.name('Paul')), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
    equal(model.get('name'), 'Ringo', "Name not changed")
    equal(view_model.name(), 'First: Ringo', "Name not changed")
    view_model.number('#: 9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '#: 9222-222-222', "Number was changed")

    # set from the model
    model.set({name: 'Starr', number: 'XXX-XXX-XXXX'})
    equal(view_model.name(), 'First: Starr', "Name changed")
    equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed")
  )

  test("Error cases", ->
    # TODO
  )
)