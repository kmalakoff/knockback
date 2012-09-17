$(->
  module("knockback-formatting-amd.js")

  module_name = 'knockback-formatting'
  module_name = 'knockback' if (require.toUrl(module_name).split('./..').length is 1)

  # library and dependencies
  require(['underscore', 'backbone', 'knockout', module_name, 'knockback-statistics'], (_, Backbone, ko, kb, kbs) ->
    _ or= @_
    Backbone or= @Backbone
    test("TEST DEPENDENCY MISSING", ->
      ok(!!ko, 'ko')
      ok(!!_, '_')
      ok(!!Backbone, 'Backbone')
      ok(!!kb, 'kb')
      ok(!!kbs, 'kbs')
    )

    kb.Contact = Backbone.Model.extend({ defaults: {name: '', number: 0, date: new Date()} })
    kb.ContactsCollection = Backbone.Collection.extend({ model: kb.Contact })

    test("Various scenarios", ->
      kb.statistics = new kb.Statistics() # turn on stats

      class ContactViewModelCustom extends kb.ViewModel
        constructor: (model) ->
          super(model, {internals: ['name', 'number']})
          @name = ko.dependentObservable(=> return "Name: #{@_name()}")
          @number = kb.formattedObservable('#: {0}', @_number)
          @name_number = kb.formattedObservable('Name: {0}, #: {1}', @_name, @_number)
          @number_name = kb.formattedObservable('#: {1}, Name: {0}', @_name, @_number)
          @name_number_name = kb.formattedObservable('Name: {0}, #: {1}, Name: {0}', @_name, @_number)
          @name_number_name_song = kb.formattedObservable('Name: {0}, #: {1}, Name: {0}, Song: "{2}"', @_name, @_number, @favorite_song)

      model = new kb.Contact({name: 'Ringo', number: '555-555-5556', favorite_song: 'Yellow Submarine'})
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
      kb.release(view_model)

      equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    )

    test("4. Using Coffeescript classes", ->
      kb.statistics = new kb.Statistics() # turn on stats

      class ContactViewModelCustom extends kb.ViewModel
        constructor: (model) ->
          super(model, {internals: ['name', 'number']})
          @name = ko.dependentObservable(=> return "First: #{@_name()}")
          @number = kb.formattedObservable('#: {0}', @_number)

      model = new kb.Contact({name: 'Ringo', number: '555-555-5556'})
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

      equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    )

    test("6. requires", ->
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

      equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
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

      equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    )
  )
)