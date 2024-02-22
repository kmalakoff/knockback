assert = assert or require?('chai').assert

describe 'formatted-observable @quick @formatting', ->

  kb = window?.kb; try kb or= require?('knockback') catch; try kb or= require?('../../../knockback')
  {_, ko} = kb

  it 'TEST DEPENDENCY MISSING', (done) ->
    assert.ok(!!ko, 'ko')
    assert.ok(!!_, '_')
    assert.ok(!!kb.Model, 'kb.Model')
    assert.ok(!!kb.Collection, 'kb.Collection')
    assert.ok(!!kb, 'kb')
    assert.ok(!!kb, 'kb')
    done()

  Contact = if kb.Parse then kb.Model.extend('Contact', { defaults: {name: '', number: 0, date: new Date()} }) else kb.Model.extend({ defaults: {name: '', number: 0, date: new Date()} })
  Contacts = kb.Collection.extend({model: Contact})

  it 'Various scenarios', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelCustom extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['name', 'number']})
        @name = ko.computed(=> return "Name: #{@_name()}")
        @number = kb.formattedObservable('#: {0}', @_number)
        @name_number = kb.formattedObservable('Name: {0}, #: {1}', @_name, @_number)
        @number_name = kb.formattedObservable('#: {1}, Name: {0}', @_name, @_number)
        @name_number_name = kb.formattedObservable('Name: {0}, #: {1}, Name: {0}', @_name, @_number)
        @name_number_name_song = kb.formattedObservable('Name: {0}, #: {1}, Name: {0}, Song: "{2}"', @_name, @_number, @favorite_song)

    model = new Contact({name: 'Ringo', number: '555-555-5556', favorite_song: 'Yellow Submarine'})
    view_model = new ContactViewModelCustom(model)

    # get
    assert.equal(view_model._name(), 'Ringo', "Interesting name")
    assert.equal(view_model.name(), 'Name: Ringo', "Interesting name")
    assert.equal(view_model._number(), '555-555-5556', "Not so interesting number")
    assert.equal(view_model.number(), '#: 555-555-5556', "Not so interesting number")
    assert.equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', "combined in order")
    assert.equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', "combined out of order")
    assert.equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', "combined repeat")

    # set from the model
    model.set({name: 'Starr', number: 'XXX-XXX-XXXX'})
    assert.equal(view_model._name(), 'Starr', "Name changed")
    assert.equal(view_model.name(), 'Name: Starr', "Name changed")
    assert.equal(view_model._number(), 'XXX-XXX-XXXX', "Number was changed")
    assert.equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed")
    assert.equal(view_model.name_number(), 'Name: Starr, #: XXX-XXX-XXXX', "combined in order")
    assert.equal(view_model.number_name(), '#: XXX-XXX-XXXX, Name: Starr', "combined out of order")
    assert.equal(view_model.name_number_name(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr', "combined repeat")

    # set from the generated attribute
    view_model._name('Ringo')
    view_model._number('555-555-5556')
    assert.equal(view_model._name(), 'Ringo', "Interesting name")
    assert.equal(view_model.name(), 'Name: Ringo', "Interesting name")
    assert.equal(view_model._number(), '555-555-5556', "Not so interesting number")
    assert.equal(view_model.number(), '#: 555-555-5556', "Not so interesting number")
    assert.equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', "combined in order")
    assert.equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', "combined out of order")
    assert.equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', "combined repeat")

    # set from the view model - simple
    view_model.number('#: 9222-222-222')
    assert.equal(model.get('number'), '9222-222-222', "Number was changed")
    assert.equal(view_model._number(), '9222-222-222', "Number was changed")
    assert.equal(view_model.number(), '#: 9222-222-222', "Number was changed")
    assert.equal(view_model.name_number(), 'Name: Ringo, #: 9222-222-222', "combined in order")
    assert.equal(view_model.number_name(), '#: 9222-222-222, Name: Ringo', "combined out of order")
    assert.equal(view_model.name_number_name(), 'Name: Ringo, #: 9222-222-222, Name: Ringo', "combined repeat")

    # set from the view model - in order
    view_model.name_number('Name: Starr, #: XXX-XXX-XXXX')
    assert.equal(view_model._name(), 'Starr', "Name changed")
    assert.equal(view_model.name(), 'Name: Starr', "Name changed")
    assert.equal(view_model._number(), 'XXX-XXX-XXXX', "Number was changed")
    assert.equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed")
    assert.equal(view_model.name_number(), 'Name: Starr, #: XXX-XXX-XXXX', "combined in order")
    assert.equal(view_model.number_name(), '#: XXX-XXX-XXXX, Name: Starr', "combined out of order")
    assert.equal(view_model.name_number_name(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr', "combined repeat")

    # set from the view model - in reverse order
    view_model.number_name('#: 555-555-5556, Name: Ringo')
    assert.equal(view_model._name(), 'Ringo', "Interesting name")
    assert.equal(view_model.name(), 'Name: Ringo', "Interesting name")
    assert.equal(view_model._number(), '555-555-5556', "Not so interesting number")
    assert.equal(view_model.number(), '#: 555-555-5556', "Not so interesting number")
    assert.equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', "combined in order")
    assert.equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', "combined out of order")
    assert.equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', "combined repeat")

    # set from the view model - with repeats (it takes the first match if different)
    view_model.name_number_name('Name: Starr, #: XXX-XXX-XXXX, Name: Bongo')
    assert.equal(view_model._name(), 'Starr', "Name changed")
    assert.equal(view_model.name(), 'Name: Starr', "Name changed")
    assert.equal(view_model._number(), 'XXX-XXX-XXXX', "Number was changed")
    assert.equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed")
    assert.equal(view_model.name_number(), 'Name: Starr, #: XXX-XXX-XXXX', "combined in order")
    assert.equal(view_model.number_name(), '#: XXX-XXX-XXXX, Name: Starr', "combined out of order")
    assert.equal(view_model.name_number_name(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr', "combined repeat")

    # add a new parameter
    assert.equal(view_model.name_number_name_song(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr, Song: "Yellow Submarine"', "works with repeat parameters")
    view_model.name_number_name_song('Name: Ringo, #: 555-555-5556, Name: Ringo, Song: "Yellow"')
    assert.equal(view_model._name(), 'Ringo', "Interesting name")
    assert.equal(view_model.name(), 'Name: Ringo', "Interesting name")
    assert.equal(view_model._number(), '555-555-5556', "Not so interesting number")
    assert.equal(view_model.number(), '#: 555-555-5556', "Not so interesting number")
    assert.equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', "combined in order")
    assert.equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', "combined out of order")
    assert.equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', "combined repeat")
    assert.equal(view_model.favorite_song(), 'Yellow', "combined repeat")
    assert.equal(view_model.name_number_name_song(), 'Name: Ringo, #: 555-555-5556, Name: Ringo, Song: "Yellow"', "combined repeat")

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '4. Using Coffeescript classes', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelCustom extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['name', 'number']})
        @name = ko.computed(=> return "First: #{@_name()}")
        @number = kb.formattedObservable('#: {0}', @_number)

    model = new Contact({name: 'Ringo', number: '555-555-5556'})
    view_model = new ContactViewModelCustom(model)

    # get
    assert.equal(view_model._name(), 'Ringo', "Interesting name")
    assert.equal(view_model.name(), 'First: Ringo', "Interesting name")
    assert.equal(view_model._number(), '555-555-5556', "Not so interesting number")
    assert.equal(view_model.number(), '#: 555-555-5556', "Not so interesting number")

    # set from the view model
    view_model.number('#: 9222-222-222')
    assert.equal(model.get('number'), '9222-222-222', "Number was changed")
    assert.equal(view_model._number(), '9222-222-222', "Number was changed")
    assert.equal(view_model.number(), '#: 9222-222-222', "Number was changed")

    # set from the model
    model.set({name: 'Starr', number: 'XXX-XXX-XXXX'})
    assert.equal(view_model._name(), 'Starr', "Name changed")
    assert.equal(view_model.name(), 'First: Starr', "Name changed")
    assert.equal(view_model._number(), 'XXX-XXX-XXXX', "Number was changed")
    assert.equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed")

    # set from the generated attribute
    view_model._name('Ringo')
    assert.equal(view_model._name(), 'Ringo', "Interesting name")
    assert.equal(view_model.name(), 'First: Ringo', "Interesting name")

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '6. requires', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelFullName extends kb.ViewModel
      constructor: (model) ->
        super(model, {requires: ['first', 'last']})
        @full_name = kb.formattedObservable('Last: {1}, First: {0}', @first, @last)

    model = new kb.Model()
    view_model = new ContactViewModelFullName(model)
    assert.equal(view_model.full_name(), 'Last: , First: ', "full name is good")

    model.set({first: 'Ringo', last: 'Starr'})
    assert.equal(view_model.full_name(), 'Last: Starr, First: Ringo', "full name is good")

    model.set({first: 'Bongo'})
    assert.equal(view_model.full_name(), 'Last: Starr, First: Bongo', "full name is good")

    view_model.full_name('Last: The Starr, First: Ringo')
    assert.equal(model.get('first'), 'Ringo', "first name is good")
    assert.equal(model.get('last'), 'The Starr', "last name is good")

    # clean up
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'kb.formattedObservable', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelFullName extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['first', 'last']})
        @full_name = kb.formattedObservable('Last: {1}, First: {0}', @_first, @_last)

    model = new kb.Model({first: 'Ringo', last: 'Starr'})
    view_model = new ContactViewModelFullName(model)
    assert.equal(view_model.full_name(), 'Last: Starr, First: Ringo', "full name is good")

    model.set({first: 'Bongo'})
    assert.equal(view_model.full_name(), 'Last: Starr, First: Bongo', "full name is good")

    view_model.full_name('Last: The Starr, First: Ringo')
    assert.equal(view_model.full_name(), 'Last: The Starr, First: Ringo', "full name is good")
    assert.equal(model.get('first'), 'Ringo', "first name is good")
    assert.equal(model.get('last'), 'The Starr', "last name is good")

    # clean up
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'kb.observableFormatted', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelFullName extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['first', 'last']})
        @full_name = kb.observableFormatted('Last: {1}, First: {0}', @_first, @_last)

    model = new kb.Model({first: 'Ringo', last: 'Starr'})
    view_model = new ContactViewModelFullName(model)
    assert.equal(view_model.full_name(), 'Last: Starr, First: Ringo', "full name is good")

    model.set({first: 'Bongo'})
    assert.equal(view_model.full_name(), 'Last: Starr, First: Bongo', "full name is good")

    view_model.full_name('Last: The Starr, First: Ringo')
    assert.equal(view_model.full_name(), 'Last: The Starr, First: Ringo', "full name is good")
    assert.equal(model.get('first'), 'Ringo', "first name is good")
    assert.equal(model.get('last'), 'The Starr', "last name is good")

    # clean up
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()
