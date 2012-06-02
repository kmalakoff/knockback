$(document).ready( ->
  module("knockback_formatted_observable.js")

  # import Underscore, Backbone, Knockout, and Knockback
  _ = if not window._ and (typeof(require) != 'undefined') then require('underscore') else window._
  Backbone = if not window.Backbone and (typeof(require) != 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) != 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) != 'undefined') then require('knockback') else window.kb

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko); ok(!!_); ok(!!Backbone); ok(!!kb)
  )

  test("Various scenarios", ->
    class ContactViewModelCustom extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['name', 'number']})
        @name = ko.dependentObservable(=> return "Name: #{@_name()}")
        @number = kb.formattedObservable('#: {0}', @_number)
        @name_number = kb.formattedObservable('Name: {0}, #: {1}', @_name, @_number)
        @number_name = kb.formattedObservable('#: {1}, Name: {0}', @_name, @_number)
        @name_number_name = kb.formattedObservable('Name: {0}, #: {1}, Name: {0}', @_name, @_number)
        @name_number_name_song = kb.formattedObservable('Name: {0}, #: {1}, Name: {0}, Song: "{2}"', @_name, @_number, @favorite_song)

    model = new kb._.Contact({name: 'Ringo', number: '555-555-5556', favorite_song: 'Yellow Submarine'})
    view_model = new ContactViewModelCustom(model)

    # get
    equal(view_model._name(), 'Ringo', "Interesting name")
    equal(view_model.name(), 'Name: Ringo', "Interesting name")
    equal(view_model._number(), '555-555-5556', "Not so interesting number")
    equal(view_model.number(), '#: 555-555-5556', "Not so interesting number")
    equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', "combined in order")
    equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', "combined out of order")
    equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', "combined repeat")

    # set from the model
    model.set({name: 'Starr', number: 'XXX-XXX-XXXX'})
    equal(view_model._name(), 'Starr', "Name changed")
    equal(view_model.name(), 'Name: Starr', "Name changed")
    equal(view_model._number(), 'XXX-XXX-XXXX', "Number was changed")
    equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed")
    equal(view_model.name_number(), 'Name: Starr, #: XXX-XXX-XXXX', "combined in order")
    equal(view_model.number_name(), '#: XXX-XXX-XXXX, Name: Starr', "combined out of order")
    equal(view_model.name_number_name(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr', "combined repeat")

    # set from the generated attribute
    view_model._name('Ringo')
    view_model._number('555-555-5556')
    equal(view_model._name(), 'Ringo', "Interesting name")
    equal(view_model.name(), 'Name: Ringo', "Interesting name")
    equal(view_model._number(), '555-555-5556', "Not so interesting number")
    equal(view_model.number(), '#: 555-555-5556', "Not so interesting number")
    equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', "combined in order")
    equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', "combined out of order")
    equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', "combined repeat")

    # set from the view model - simple
    view_model.number('#: 9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model._number(), '9222-222-222', "Number was changed")
    equal(view_model.number(), '#: 9222-222-222', "Number was changed")
    equal(view_model.name_number(), 'Name: Ringo, #: 9222-222-222', "combined in order")
    equal(view_model.number_name(), '#: 9222-222-222, Name: Ringo', "combined out of order")
    equal(view_model.name_number_name(), 'Name: Ringo, #: 9222-222-222, Name: Ringo', "combined repeat")

    # set from the view model - in order
    view_model.name_number('Name: Starr, #: XXX-XXX-XXXX')
    equal(view_model._name(), 'Starr', "Name changed")
    equal(view_model.name(), 'Name: Starr', "Name changed")
    equal(view_model._number(), 'XXX-XXX-XXXX', "Number was changed")
    equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed")
    equal(view_model.name_number(), 'Name: Starr, #: XXX-XXX-XXXX', "combined in order")
    equal(view_model.number_name(), '#: XXX-XXX-XXXX, Name: Starr', "combined out of order")
    equal(view_model.name_number_name(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr', "combined repeat")

    # set from the view model - in reverse order
    view_model.number_name('#: 555-555-5556, Name: Ringo')
    equal(view_model._name(), 'Ringo', "Interesting name")
    equal(view_model.name(), 'Name: Ringo', "Interesting name")
    equal(view_model._number(), '555-555-5556', "Not so interesting number")
    equal(view_model.number(), '#: 555-555-5556', "Not so interesting number")
    equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', "combined in order")
    equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', "combined out of order")
    equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', "combined repeat")

    # set from the view model - with repeats (it takes the first match if different)
    view_model.name_number_name('Name: Starr, #: XXX-XXX-XXXX, Name: Bongo')
    equal(view_model._name(), 'Starr', "Name changed")
    equal(view_model.name(), 'Name: Starr', "Name changed")
    equal(view_model._number(), 'XXX-XXX-XXXX', "Number was changed")
    equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed")
    equal(view_model.name_number(), 'Name: Starr, #: XXX-XXX-XXXX', "combined in order")
    equal(view_model.number_name(), '#: XXX-XXX-XXXX, Name: Starr', "combined out of order")
    equal(view_model.name_number_name(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr', "combined repeat")

    # add a new parameter
    equal(view_model.name_number_name_song(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr, Song: "Yellow Submarine"', "works with repeat parameters")
    view_model.name_number_name_song('Name: Ringo, #: 555-555-5556, Name: Ringo, Song: "Yellow"')
    equal(view_model._name(), 'Ringo', "Interesting name")
    equal(view_model.name(), 'Name: Ringo', "Interesting name")
    equal(view_model._number(), '555-555-5556', "Not so interesting number")
    equal(view_model.number(), '#: 555-555-5556', "Not so interesting number")
    equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', "combined in order")
    equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', "combined out of order")
    equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', "combined repeat")
    equal(view_model.favorite_song(), 'Yellow', "combined repeat")
    equal(view_model.name_number_name_song(), 'Name: Ringo, #: 555-555-5556, Name: Ringo, Song: "Yellow"', "combined repeat")

    # and cleanup after yourself when you are done.
    kb.utils.release(view_model)
  )

  test("Error cases", ->
    # TODO
  )
)