root = if window? then window else global
assert = assert or require?('chai').assert

describe 'Knockback.js with Backbone.ModelRef.js @backbone-modelref', ->

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  kb = window?.kb; try kb or= require?('knockback') catch; try kb or= require?('../../../knockback')
  {_, Backbone, ko} = kb
  root.Backbone?.ModelRef or= require?('backbone-modelref')

  it 'TEST DEPENDENCY MISSING', (done) ->
    assert.ok(!!ko, 'ko')
    assert.ok(!!_, '_')
    assert.ok(!!Backbone, 'Backbone')
    assert.ok(!!Backbone.ModelRef, 'Backbone.ModelRef')
    assert.ok(!!kb, 'kb')
    done()

  return unless root.Backbone?.ModelRef

  Contact = if kb.Parse then kb.Model.extend('Contact', { defaults: {name: '', number: 0, date: new Date()} }) else kb.Model.extend({ defaults: {name: '', number: 0, date: new Date()} })
  Contacts = kb.Collection.extend({model: Contact})

  it 'Standard use case: just enough to get the picture', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    ContactViewModel = (model) ->
      @_auto = kb.viewModel(model, {keys: {
        name:     {key:'name'}
        number:   {key:'number'}
        date:     {key:'date'}
      }}, this)
      return

    collection = new Contacts()
    model_ref = new Backbone.ModelRef(collection, 'b4')
    view_model = new ContactViewModel(model_ref)

    assert.equal(view_model.name(), null, "Is that what we want to convey?")

    collection.add(collection.parse({id: 'b4', name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)}))
    model = collection.get('b4')

    # get
    assert.equal(view_model.name(), 'John', "It is a name")
    assert.equal(view_model.number(), '555-555-5558', "Not so interesting number")
    assert.equal(view_model.date().toString(), new Date(1940, 10, 9).toString(), "John's birthdate matches")

    # set from the view model
    assert.equal(model.get('name'), 'John', "Name not changed")
    assert.equal(view_model.name(), 'John', "Name not changed")
    view_model.number('9222-222-222')
    assert.equal(model.get('number'), '9222-222-222', "Number was changed")
    assert.equal(view_model.number(), '9222-222-222', "Number was changed")
    view_model.date(new Date(1963, 11, 10))
    current_date = model.get('date')
    assert.equal(current_date.getFullYear(), 1963, "year is good")
    assert.equal(current_date.getMonth(), 11, "month is good")
    assert.equal(current_date.getDate(), 10, "day is good")

    # set from the model
    model.set({name: 'Yoko', number: '818-818-8181'})
    assert.equal(view_model.name(), 'Yoko', "Name changed")
    assert.equal(view_model.number(), '818-818-8181', "Number was changed")
    model.set({date: new Date(1940, 10, 9)})
    assert.equal(view_model.date().toString(), (new Date(1940, 10, 9)).toString(), "John's birthdate")
    view_model.date(new Date(1940, 10, 10))
    current_date = model.get('date')
    assert.equal(current_date.getFullYear(), 1940, "year is good")
    assert.equal(current_date.getMonth(), 10, "month is good")
    assert.equal(current_date.getDate(), 10, "day is good")

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'Standard use case with kb.ViewModels', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModel extends kb.ViewModel
      constructor: (model) ->
        super(model, {requires: ['name', 'number', 'date']})

    collection = new Contacts()
    model_ref = new Backbone.ModelRef(collection, 'b4')
    view_model = new ContactViewModel(model_ref)

    assert.equal(view_model.name(), null, "Is that what we want to convey?")

    collection.add(collection.parse({id: 'b4', name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)}))
    model = collection.get('b4')

    # get
    assert.equal(view_model.name(), 'John', "It is a name")
    assert.equal(view_model.number(), '555-555-5558', "Not so interesting number")
    assert.equal(view_model.date().toString(), (new Date(1940, 10, 9)).toString(), "John's birthdate matches")

    # set from the view model
    assert.equal(model.get('name'), 'John', "Name not changed")
    assert.equal(view_model.name(), 'John', "Name not changed")
    view_model.number('9222-222-222')
    assert.equal(model.get('number'), '9222-222-222', "Number was changed")
    assert.equal(view_model.number(), '9222-222-222', "Number was changed")
    view_model.date(new Date(1963, 11, 10))
    current_date = model.get('date')
    assert.equal(current_date.getFullYear(), 1963, "year is good")
    assert.equal(current_date.getMonth(), 11, "month is good")
    assert.equal(current_date.getDate(), 10, "day is good")

    # set from the model
    model.set({name: 'Yoko', number: '818-818-8181'})
    assert.equal(view_model.name(), 'Yoko', "Name changed")
    assert.equal(view_model.number(), '818-818-8181', "Number was changed")
    model.set({date: new Date(1940, 10, 9)})
    assert.equal(view_model.date().toString(), (new Date(1940, 10, 9)).toString(), "John's birthdate")
    view_model.date(new Date(1940, 10, 10))
    current_date = model.get('date')
    assert.equal(current_date.getFullYear(), 1940, "year is good")
    assert.equal(current_date.getMonth(), 10, "month is good")
    assert.equal(current_date.getDate(), 10, "day is good")

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'CLEANUP', -> delete Backbone.ModeRef
