assert = assert or require?('chai').assert

describe 'view-model @quick @view-model', ->

  kb = window?.kb; try kb or= require?('knockback') catch; try kb or= require?('../../../knockback')
  {_, ko, $} = kb

  it 'TEST DEPENDENCY MISSING', (done) ->
    assert.ok(!!ko, 'ko')
    assert.ok(!!_, '_')
    assert.ok(!!kb.Model, 'kb.Model')
    assert.ok(!!kb.Collection, 'kb.Collection')
    assert.ok(!!kb, 'kb')
    done()

  Contact = if kb.Parse then kb.Model.extend('Contact', { defaults: {name: '', number: 0, date: new Date()} }) else kb.Model.extend({ defaults: {name: '', number: 0, date: new Date()} })
  Contacts = kb.Collection.extend({model: Contact})

  class TestViewModel extends kb.ViewModel
    constructor: ->
      super
      @test = ko.observable('hello')
      value = @test()
      value = @name()

  it '1. Standard use case: read and write', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    model = new Contact({name: 'Ringo', number: '555-555-5556'})
    view_model = kb.viewModel(model)

    # get
    assert.equal(view_model.name(), 'Ringo', "Interesting name")
    assert.equal(view_model.number(), '555-555-5556', "Not so interesting number")

    # set from the view model
    view_model.number('9222-222-222')
    assert.equal(model.get('number'), '9222-222-222', "Number was changed")
    assert.equal(view_model.number(), '9222-222-222', "Number was changed")

    # set from the model
    model.set({name: 'Starr', number: 'XXX-XXX-XXXX'})
    assert.equal(view_model.name(), 'Starr', "Name changed")
    assert.equal(view_model.number(), 'XXX-XXX-XXXX', "Number was changed")

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '2. Using Coffeescript classes', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelCustom extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['name', 'number']})
        @name = ko.computed(=> return "First: #{@_name()}")

    model = new Contact({name: 'Ringo', number: '555-555-5556'})
    view_model = new ContactViewModelCustom(model)

    # get
    assert.equal(view_model._name(), 'Ringo', "Interesting name")
    assert.equal(view_model.name(), 'First: Ringo', "Interesting name")

    # set from the model
    model.set({name: 'Starr'})
    assert.equal(view_model._name(), 'Starr', "Name changed")
    assert.equal(view_model.name(), 'First: Starr', "Name changed")

    # set from the generated attribute
    view_model._name('Ringo')
    assert.equal(view_model._name(), 'Ringo', "Interesting name")
    assert.equal(view_model.name(), 'First: Ringo', "Interesting name")

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '3. Using simple Javascript classes', (done) ->
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

    model = new Contact({name: 'Ringo', number: '555-555-5556'})
    view_model = new ContactViewModelCustom(model)

    # get
    assert.equal(view_model.name(), 'Ringo', "Interesting name")
    assert.equal(view_model.formatted_name(), 'First: Ringo', "Interesting name")
    assert.equal(view_model.number(), '555-555-5556', "Not so interesting number")
    assert.equal(view_model.formatted_number(), '#: 555-555-5556', "Not so interesting number")

    # set from the view model
    view_model.formatted_number('#: 9222-222-222')
    assert.equal(model.get('number'), '9222-222-222', "Number was changed")
    assert.equal(view_model.number(), '9222-222-222', "Number was changed")
    assert.equal(view_model.formatted_number(), '#: 9222-222-222', "Number was changed")

    # set from the model
    model.set({name: 'Starr', number: 'XXX-XXX-XXXX'})
    assert.equal(view_model.name(), 'Starr', "Name changed")
    assert.equal(view_model.formatted_name(), 'First: Starr', "Name changed")
    assert.equal(view_model.number(), 'XXX-XXX-XXXX', "Number was changed")
    assert.equal(view_model.formatted_number(), '#: XXX-XXX-XXXX', "Number was changed")

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '4. requires', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelFullName extends kb.ViewModel
      constructor: (model) ->
        super(model, {requires: ['first', 'last']})
        @full_name = ko.computed(=> "Last: #{@last()}, First: #{@first()}")

    model = new kb.Model()
    view_model = new ContactViewModelFullName(model)
    assert.equal(view_model.full_name(), 'Last: null, First: null', "full name is good")

    model.set({first: 'Ringo', last: 'Starr'})
    assert.equal(view_model.full_name(), 'Last: Starr, First: Ringo', "full name is good")

    model.set({first: 'Bongo'})
    assert.equal(view_model.full_name(), 'Last: Starr, First: Bongo', "full name is good")

    # clean up
    kb.release(view_model)

    class ContactViewModelFullName2 extends kb.ViewModel
      constructor: (model) ->
        super(model, {requires: 'first'})
        @last = kb.observable(model, 'last')
        @full_name = ko.computed(=> "Last: #{@last()}, First: #{@first()}")

    model = new kb.Model()
    view_model = new ContactViewModelFullName2(model)
    assert.equal(view_model.full_name(), 'Last: null, First: null', "full name is good")

    model.set({first: 'Ringo', last: 'Starr'})
    assert.equal(view_model.full_name(), 'Last: Starr, First: Ringo', "full name is good")

    model.set({first: 'Bongo'})
    assert.equal(view_model.full_name(), 'Last: Starr, First: Bongo', "full name is good")

    # clean up
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '5. reference counting and custom __destroy (Coffeescript inheritance)', (done) ->
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
        throw new Error 'ref count is corrupt' if @ref_count < 0
        return if @ref_count
        @is_destroyed = true
        @super_destroy()

    model = new kb.Model({first: "Hello"})
    view_model = new ContactViewModelFullName(model)

    assert.equal(view_model.first(), "Hello", "Hello exists")

    view_model.retain()
    assert.equal(view_model.refCount(), 2, "ref count 2")
    assert.equal(view_model.is_destroyed, false, "not destroyed")

    view_model.release()
    assert.equal(view_model.refCount(), 1, "ref count 1")
    assert.equal(view_model.is_destroyed, false, "not destroyed")

    kb.release(view_model)
    assert.equal(view_model.refCount(), 0, "ref count 0")
    assert.equal(view_model.is_destroyed, true, "is destroyed using overridden destroy function")

    assert.ok(!view_model.first, "Hello doesn't exist anymore")
    assert.throw((->view_model.release()), Error, "ref count is corrupt")

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '6. reference counting and custom __destroy (Javascript inheritance)', (done) ->
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
        throw new Error "ref count is corrupt" if @ref_count < 0
        return if @ref_count
        @is_destroyed = true
        @super_destroy()
    })

    model = new kb.Model({first: "Hello"})
    view_model = new ContactViewModelFullName(model)

    assert.equal(view_model.first(), "Hello", "Hello exists")

    view_model.retain()
    assert.equal(view_model.refCount(), 2, "ref count 2")
    assert.equal(view_model.is_destroyed, false, "not destroyed")

    view_model.release()
    assert.equal(view_model.refCount(), 1, "ref count 1")
    assert.equal(view_model.is_destroyed, false, "not destroyed")

    kb.release(view_model)
    assert.equal(view_model.refCount(), 0, "ref count 0")
    assert.equal(view_model.is_destroyed, true, "is destroyed using overridden destroy function")

    assert.ok(!view_model.first, "Hello doesn't exist anymore")
    assert.throw((->view_model.release()), Error, "ref count is corrupt")

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '7. Nested custom view models', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelDate extends kb.ViewModel
      constructor: (model, options) ->
        super(model, _.extend({requires: ['date']}, options))

    john_birthdate = new Date(1940, 10, 9)
    john = new Contact({name: 'John', date: new Date(john_birthdate.valueOf())})
    paul_birthdate = new Date(1942, 6, 18)
    paul = new Contact({name: 'Paul', date: new Date(paul_birthdate.valueOf())})
    george_birthdate = new Date(1943, 2, 25)
    george = new Contact({name: 'George', date: new Date(george_birthdate.valueOf())})
    ringo_birthdate = new Date(1940, 7, 7)
    ringo = new Contact({name: 'Ringo', date: new Date(ringo_birthdate.valueOf())})
    major_duo = new kb.Collection([john, paul])
    minor_duo = new kb.Collection([george, ringo])
    nested_model = new kb.Model({
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
      assert.equal(view_model.name(), name, "#{name}: Name matches")

      # set from the view model
      view_model.date(new Date(1963, 11, 10))
      current_date = model.get('date')
      assert.equal(current_date.getFullYear(), 1963, "#{name}: year is good")
      assert.equal(current_date.getMonth(), 11, "#{name}: month is good")
      assert.equal(current_date.getDate(), 10, "#{name}: day is good")
      assert.equal(view_model.date().getFullYear(), 1963, "#{name}: year is good")
      assert.equal(view_model.date().getMonth(), 11, "#{name}: month is good")
      assert.equal(view_model.date().getDate(), 10, "#{name}: day is good")

      model.set({date: new Date(birthdate.valueOf())}) # restore birthdate

      # set from the model
      view_model.date(new Date(1940, 10, 10))
      current_date = model.get('date')
      assert.equal(current_date.getFullYear(), 1940, "#{name}: year is good")
      assert.equal(current_date.getMonth(), 10, "#{name}: month is good")
      assert.equal(current_date.getDate(), 10, "#{name}: day is good")
      assert.equal(view_model.date().getFullYear(), 1940, "#{name}: year is good")
      assert.equal(view_model.date().getMonth(), 10, "#{name}: month is good")
      assert.equal(view_model.date().getDate(), 10, "#{name}: day is good")

      model.set({date: new Date(birthdate.valueOf())}) # restore birthdate

    validateGenericViewModel = (view_model, name, birthdate) ->
      assert.equal(view_model.name(), name, "#{name}: Name matches")
      assert.equal(view_model.date().valueOf(), birthdate.valueOf(), "#{name}: Birthdate matches")

    validateModel = (model, name, birthdate) ->
      assert.equal(model.get('name'), name, "#{name}: Name matches")
      assert.equal(model.get('date').valueOf(), birthdate.valueOf(), "#{name}: Birthdate matches")

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

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '8a. Changing attribute types', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    model = new kb.Model({reused: null})
    view_model = kb.viewModel(model)
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_SIMPLE, 'reused is kb.TYPE_SIMPLE')

    model.set({reused: new kb.Model()})
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_MODEL, 'reused is kb.TYPE_MODEL')

    model.set({reused: null})
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_MODEL, 'reused is retains type of kb.TYPE_MODEL')

    model.set({reused: new kb.Collection()})
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_COLLECTION, 'reused is kb.TYPE_COLLECTION')

    model.set({reused: null})
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_COLLECTION, 'reused is retains type of kb.TYPE_COLLECTION')

    # clean up
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '8b. Changing attribute types', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    model = new kb.Model({reused: null})
    view_model = kb.viewModel(model, {factories:
      reused: {create: (obj, options) ->
        return kb.collectionObservable(obj, options) if kb.isCollection(obj) or ((obj is null) and (kb.utils.valueType(view_model?.reused) is kb.TYPE_COLLECTION))
        return kb.viewModel(obj, options)
      }
    })
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_MODEL, 'reused is kb.TYPE_MODEL')

    model.set({reused: new kb.Model()})
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_MODEL, 'reused is kb.TYPE_MODEL')

    model.set({reused: null})
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_MODEL, 'reused retains type of kb.TYPE_MODEL')

    model.set({reused: new kb.Collection()})
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_COLLECTION, 'reused is kb.TYPE_COLLECTION')

    model.set({reused: null})
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_COLLECTION, 'reused retains type of kb.TYPE_COLLECTION')

    # clean up
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '9. Shared Options', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats
    model1 = new kb.Model({id: 1, name: 'Bob'})
    model2 = new kb.Model({id: 1, name: 'Bob'})
    model3 = new kb.Model({id: 1, name: 'Bob'})

    view_model1 = kb.viewModel(model1)
    view_model2 = kb.viewModel(model2)
    view_model3 = kb.viewModel(model3, view_model1.shareOptions())

    assert.ok((view_model1.name isnt view_model2.name) and (view_model1.name() is view_model2.name()), 'not sharing')
    assert.ok((view_model1.name isnt view_model3.name) and (view_model1.name() is view_model3.name()), 'sharing')

    kb.release([view_model1, view_model2, view_model3])

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '10. Options', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    # keys - array
    view_model = kb.viewModel(new kb.Model({name: 'Bob'}), keys: ['name', 'date'])
    assert.equal(view_model.name(), 'Bob', 'keys: Bob')
    assert.ok(view_model.date, 'keys: date')
    assert.equal(view_model.date(), null, 'keys: date fn')
    kb.release(view_model)

    # keys - no array
    view_model = kb.viewModel(new kb.Model({name: 'Bob'}), keys: 'date')
    assert.ok(view_model.date, 'keys: date')
    assert.equal(view_model.date(), null, 'keys: date fn')
    kb.release(view_model)

    # keys - object
    view_model = kb.viewModel(new kb.Model({name: 'Bob'}), keys: {name: {}, date: {}})
    assert.equal(view_model.name(), 'Bob', 'keys: Bob')
    assert.ok(view_model.date, 'keys: date')
    assert.equal(view_model.date(), null, 'keys: date fn')
    kb.release(view_model)

    # excludes
    view_model = kb.viewModel(new kb.Model({name: 'Bob', date: new Date()}), excludes: ['date'])
    assert.equal(view_model.name(), 'Bob', 'excludes: Bob')
    assert.ok(not view_model.date, 'excludes: date')
    kb.release(view_model)

    # excludes - no array
    view_model = kb.viewModel(new kb.Model({name: 'Bob', date: new Date()}), excludes: 'date')
    assert.equal(view_model.name(), 'Bob', 'excludes: Bob')
    assert.ok(not view_model.date, 'excludes: date')
    kb.release(view_model)

    # requires
    view_model = kb.viewModel(new kb.Model(), requires: ['name'])
    assert.equal(view_model.name(), null, 'requires: name')
    assert.ok(not view_model.date, 'requires: date')
    kb.release(view_model)

    # requires - no array
    view_model = kb.viewModel(new kb.Model(), requires: 'name')
    assert.equal(view_model.name(), null, 'requires: name')
    assert.ok(not view_model.date, 'requires: date')
    kb.release(view_model)

    # internals
    view_model = kb.viewModel(new kb.Model(), internals: ['name'])
    assert.equal(view_model._name(), null, 'internals: name')
    assert.ok(not view_model.date, 'internals: date')
    kb.release(view_model)

    # internals - no array
    view_model = kb.viewModel(new kb.Model(), internals: 'name')
    assert.equal(view_model._name(), null, 'internals: name')
    assert.ok(not view_model.date, 'internals: date')
    kb.release(view_model)

    # mappings
    view_model = kb.viewModel(new kb.Model(), mappings: {name: {}})
    assert.equal(view_model.name(), null, 'mappings: name')
    assert.ok(not view_model.date, 'mappings: date')
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '11. array attributes', (done) ->

    model = new kb.Model
      text: ["heading.get these rewards"]
      widget: ["sign_up", "rewards"]
      model_data:
        reward:
          top_rewards:
            properties: ["title", "description", "num_points"]
            query:
              type: "active"
              limit: 6

    view_model = kb.viewModel model

    assert.ok(_.isEqual(view_model.text(), ["heading.get these rewards"]), 'text observable matches')
    assert.ok(_.isEqual(view_model.widget(), ["sign_up", "rewards"]), 'widget observable matches')
    assert.ok(_.isEqual(view_model.model_data().reward.top_rewards.properties, ["title", "description", "num_points"]), 'model_data observable matches')
    done()

  it '12. model change is observable', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats
    model = new kb.Model({id: 1, name: 'Bob'})

    view_model = kb.viewModel(model)

    count = 0
    ko.computed(-> view_model.model(); count++)

    view_model.model(null)
    view_model.model(model)
    assert.equal(count, 3, "model change was observed")
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '13. model replacement', (done) ->
    kb.statistics = new kb.Statistics()
    model_opts =
      attributes:
          prop: 1
        defaults:
          prop: 1

    Model = if kb.Parse then kb.Model.extend('Model', model_opts) else kb.Model.extend(model_opts)

    model1 = new Model
    view_model = kb.viewModel(model1)

    assert.equal(view_model.prop(), 1, "sanity check")
    model2 = new Model({ prop: 2 })
    assert.equal(model2.get('prop'), 2, "sanity check 2")

    view_model.model(model2)

    assert.equal(model2.get('prop'), 2, "switched in model shouldn't inherit values from previous model")
    assert.equal(view_model.prop(), 2, "view model should have the value of the switched in model")

    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '14. model replacement with select', (done) ->
    return done() unless $

    kb.statistics = new kb.Statistics()

    model_opts =
      attributes:
          prop: 1
        defaults:
          prop: 1

    Model = if kb.Parse then kb.Model.extend('Model', model_opts) else kb.Model.extend(model_opts)

    model1 = new Model
    view_model = kb.viewModel(model1)


    el = $('''
      <div id="the_template1">
        <select data-bind="value: prop">
            <option value="" selected>---</option>
            <option value="1">1</option>
            <option value="2">2</option>
        </select>
      </div>''')
    $('body').append(el)

    widget = el.find('select')

    assert.equal(widget.val(), "", "select should be empty to start with")
    ko.applyBindings(view_model, el.get(0))
    assert.equal(widget.val(), "1", "select should be equal to the model after bindings applied")

    model2 = new Model({prop : 2})
    assert.equal(model2.get('prop'), 2, "sanity check 2")
    view_model.model(model2)

    assert.equal(widget.val(), 2, "model sets the select")
    assert.equal(model2.get('prop'), 2, "switched in model shouldn't inherit values from previous model")
    assert.equal(view_model.model(), model2, "view_model.model should be the same as the new model")
    assert.equal(view_model.prop(), 2, "view model should have the value of the switched in model")

    el.remove()
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '16. model replacement with input', (done) ->
    return done() unless $

    kb.statistics = new kb.Statistics()

    model_opts =
      attributes:
          prop: 1
        defaults:
          prop: 1

    Model = if kb.Parse then kb.Model.extend('Model', model_opts) else kb.Model.extend(model_opts)

    model1 = new Model
    view_model = kb.viewModel(model1)


    el = $('''
      <div id="the_template1">
        <input data-bind="value: prop" />
      </div>''')
    $('body').append(el)

    widget = el.find('input')

    assert.equal(widget.val(), "", "input should be empty to start with")
    ko.applyBindings(view_model, el.get(0))
    assert.equal(widget.val(), "1", "input should be equal to the model after bindings applied")

    model2 = new Model({prop : 2})
    assert.equal(model2.get('prop'), 2, "sanity check 2")
    view_model.model(model2)

    assert.equal(widget.val(), 2, "model sets the select")
    assert.equal(model2.get('prop'), 2, "switched in model shouldn't inherit values from previous model")
    assert.equal(view_model.model(), model2, "view_model.model should be the same as the new model")
    assert.equal(view_model.prop(), 2, "view model should have the value of the switched in model")

    el.remove()
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '17. model replacement with multiple selects and weird backbone bug', (done) ->
    return done() unless $

    kb.statistics = new kb.Statistics()

    default_attrs =
      prop1 : "p1-wrong"
      prop2 : "p2-wrong"

    model_opts =
      attributes: default_attrs
      defaults: default_attrs

    Model = if kb.Parse then kb.Model.extend('Model', model_opts) else kb.Model.extend(model_opts)

    model1 = new Model
    view_model = kb.viewModel(model1)

    el = $('''
      <div id="the_template1">
        <select id="prop1" data-bind="value: prop1">
            <option value="p1-wrong" selected>WRONG</option>
            <option value="p1-right">RIGHT</option>
        </select>
        <select id="prop2" data-bind="value: prop2">
            <option value="p2-wrong" selected>WRONG</option>
            <option value="p2-right">RIGHT</option>
        </select>
      </div>''')
    $('body').append(el)

    widget1 = el.find('#prop1')
    widget2 = el.find('#prop2')

    assert.equal(widget1.val(), "p1-wrong", "select should be first value to start with")
    assert.equal(widget2.val(), "p2-wrong", "select should be first value to start with")
    ko.applyBindings(view_model, el.get(0))
    assert.equal(widget1.val(), "p1-wrong", "select should be equal to the model after bindings applied")
    assert.equal(widget2.val(), "p2-wrong", "select should be equal to the model after bindings applied")

    model2 = new Model(
      DUMMY : ""
      prop1 : "p1-right"
      prop2 : "p2-right"
    )
    assert.equal(model2.get('prop1'), 'p1-right', "sanity check 2")
    assert.equal(model2.get('prop2'), 'p2-right', "sanity check 3")
    view_model.model(model2)

    assert.equal(widget1.val(), 'p1-right', "model sets the select")
    assert.equal(widget2.val(), 'p2-right', "model sets the select")
    assert.equal(model2.get('prop1'), 'p1-right', "switched in model shouldn't inherit values from previous model")
    assert.equal(model2.get('prop2'), 'p2-right', "switched in model shouldn't inherit values from previous model")
    assert.equal(view_model.model(), model2, "view_model.model should be the same as the new model")
    assert.equal(view_model.prop1(), 'p1-right', "view model should have the value of the switched in model")
    assert.equal(view_model.prop2(), 'p2-right', "view model should have the value of the switched in model")

    el.remove()
    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '18. can merge unique options', (done) ->
    options =
      internals: ['internal1']
      keys: ['key1']
      factories: {models: ->}
      options:
        requires: 'require2'
        keys: ['key2']
        excludes: 'exclude2'
        options:
          excludes: ['exclude3']
          factories: {'collection.models': ->}

    collapsed_options = kb.utils.collapseOptions(options)
    assert.deepEqual(collapsed_options.internals, ['internal1'])
    assert.deepEqual(collapsed_options.keys, ['key1', 'key2'])
    assert.deepEqual(_.keys(collapsed_options.factories), ['models', 'collection.models'])
    assert.deepEqual(collapsed_options.excludes, ['exclude2', 'exclude3'])
    done()

  it '19. can merge non-unique options', (done) ->
    factoryOverride = ->
    factory = ->

    options =
      internals: ['internal1']
      keys: ['key1']
      factories: {models: factory}
      options:
        requires: 'require1'
        keys: ['key1']
        excludes: 'exclude1'
        options:
          excludes: ['exclude1']
          factories: {models: factoryOverride}

    collapsed_options = kb.utils.collapseOptions(options)
    assert.deepEqual(collapsed_options.internals, ['internal1'])
    assert.deepEqual(collapsed_options.keys, ['key1'])
    assert.deepEqual(_.keys(collapsed_options.factories), ['models'])
    assert.equal(collapsed_options.factories.models, factoryOverride, 'selected overidden factory')
    assert.notEqual(collapsed_options.factories.models, factory, 'did not select original factory')
    assert.deepEqual(collapsed_options.excludes, ['exclude1'])
    done()

  it '20. can merge keys as object', (done) ->
    options =
      keys: {name: {key: 'name'}}
      options:
        keys: {thing: {key: 'thing'}}

    collapsed_options = kb.utils.collapseOptions(options)
    assert.deepEqual(collapsed_options.keys, {name: {key: 'name'}, thing: {key: 'thing'}})

    options =
      keys: 'name'
      options:
        keys: {thing: {key: 'thing'}}

    collapsed_options = kb.utils.collapseOptions(options)
    assert.deepEqual(collapsed_options.keys, {name: {key: 'name'}, thing: {key: 'thing'}})

    options =
      keys: ['name']
      options:
        keys: {thing: {key: 'thing'}}

    collapsed_options = kb.utils.collapseOptions(options)
    assert.deepEqual(collapsed_options.keys, {name: {key: 'name'}, thing: {key: 'thing'}})

    options =
      keys: {name: {key: 'name'}}
      options:
        keys: 'thing'

    collapsed_options = kb.utils.collapseOptions(options)
    assert.deepEqual(collapsed_options.keys, {name: {key: 'name'}, thing: {key: 'thing'}})

    options =
      keys: {name: {key: 'name'}}
      options:
        keys: ['thing']

    collapsed_options = kb.utils.collapseOptions(options)
    assert.deepEqual(collapsed_options.keys, {name: {key: 'name'}, thing: {key: 'thing'}})
    done()

  it '21. view model changes do not cause dependencies inside ko.computed', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    view_model = new TestViewModel(new kb.Model({id: 1, name: 'Initial'}))
    model = view_model.model()

    count_manual = 0
    ko.computed ->
      view_model.model(new kb.Model({id: 10, name: 'Manual'})) # should not depend
      count_manual++

    count_set_existing = 0
    ko.computed ->
      model.set({name: 'Existing'}) # should not depend
      count_set_existing++

    count_set_new = 0
    ko.computed ->
      model.set({new_attribute: 'New'}) # should not depend
      count_set_new++

    count_set_model = 0
    ko.computed ->
      model.set({model: new kb.Model({name: 'NestedModel'})}) # should not depend
      count_set_model++

    count_set_collection = 0
    ko.computed ->
      model.set({collection: new kb.Collection([{name: 'NestedModel'}])}) # should not depend
      count_set_collection++

    observable_count = 0
    ko.computed ->
      view_model.model() # should depend
      observable_count++

    assert.equal(count_manual, 1, 'count_manual'); assert.equal(count_set_existing, 1, 'count_set_existing'); assert.equal(count_set_new, 1, 'count_set_new'); assert.equal(count_set_model, 1, 'count_set_model'); assert.equal(count_set_collection, 1, 'count_set_collection'); assert.equal(observable_count, 1, 'observable_count')

    view_model.model(new kb.Model({id: 10, name: 'Manual'}))
    model.set({name: 'Existing'})
    model.set({new_attribute: 'New'})
    model.set({model: new kb.Model({name: 'NestedModel'})})
    model.set({collection: new kb.Collection([{name: 'NestedModel'}])})
    assert.equal(count_manual, 1, 'count_manual'); assert.equal(count_set_existing, 1, 'count_set_existing'); assert.equal(count_set_new, 1, 'count_set_new'); assert.equal(count_set_model, 1, 'count_set_model'); assert.equal(count_set_collection, 1, 'count_set_collection'); assert.equal(observable_count, 2, 'observable_count')

    model = view_model.model()
    model.set({name: 'Bob2'})
    assert.equal(view_model.name(), 'Bob2')
    view_model.test('world')
    assert.equal(view_model.test(), 'world')
    assert.equal(count_manual, 1, 'count_manual'); assert.equal(count_set_existing, 1, 'count_set_existing'); assert.equal(count_set_new, 1, 'count_set_new'); assert.equal(count_set_model, 1, 'count_set_model'); assert.equal(count_set_collection, 1, 'count_set_collection'); assert.equal(observable_count, 2, 'observable_count')

    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '22. statics and static defaults keyword', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    view_model = kb.viewModel(
      new kb.Model({id: 1, name: 'Initial', date: new Date()}),
      {statics: ['name', 'author', 'description', 'tags'], static_defaults: {author: '(none)', description: null}}
    )

    assert.ok(view_model.name and !ko.isObservable(view_model.name), 'name: non-observable')
    assert.equal(view_model.name, 'Initial', 'name: value is correct')
    assert.equal(ko.utils.unwrapObservable(view_model.name), 'Initial', 'name: unwrapped value is correct')

    assert.ok(view_model.date and ko.isObservable(view_model.date), 'date: observable')
    assert.equal(view_model.date(), view_model.model().get('date'), 'date: value is correct')
    assert.equal(ko.utils.unwrapObservable(view_model.date), view_model.model().get('date'), 'date: unwrapped value is correct')

    assert.ok(view_model.author and !ko.isObservable(view_model.author), 'author: non-observable')
    assert.equal(view_model.author, '(none)', 'author: value is correct')
    assert.equal(ko.utils.unwrapObservable(view_model.author), '(none)', 'author: unwrapped value is correct')

    assert.ok(!view_model.description and !ko.isObservable(view_model.description), 'description: non-observable')
    assert.equal(view_model.description, null, 'description: value is correct')
    assert.equal(ko.utils.unwrapObservable(view_model.description), null, 'description: unwrapped value is correct')

    assert.ok(_.isUndefined(view_model.tags), 'tags: not created')

    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it '23. Issue 94', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    # ECOSYSTEM
    return done() if kb.Parse

    Child = kb.Model.extend()

    Parent = kb.Model.extend({
      defaults: {
        child: new Child({name: "SingleChild"}),
        children: new kb.Collection([new Child({name: "Child1"}), new Child({name: "Child2"})], {model: Child})
      }
    })

    ChildViewModel = (model) ->
      assert.ok(!!model, 'model is null?')
      view_model = kb.viewModel(model)

      view_model.nameComputed = ko.computed =>
        ret = "no name function!"
        ret = "Hello, " + view_model.name() if view_model.name
        return ret

      return view_model

    ParentViewModel = (model) ->
      view_model = kb.viewModel(model, {
        factories: {
          'children.models': ChildViewModel,
          'child': ChildViewModel
        }
      })
      view_model.nameComputed = ko.computed => return "Hello, " + view_model.name()
      return view_model

    parent_view_model = new ParentViewModel(new Parent({name: "TestParent"}))

    kb.release(parent_view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  # https://github.com/kmalakoff/knockback/issues/82
  it '24. Issue 82 - createObservables', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    children = new kb.Collection([
      new kb.Model({name:"Charles"}),
      new kb.Model({name:"Eve"})
    ])

    parent = new kb.Model({name: "Bob", children: children})

    subFactory = (model) ->
      subVm = new kb.ViewModel(model)
      subVm.cid = ko.computed -> return model.cid
      return subVm;

    vm = new kb.ViewModel(parent, {excludes : ['children'], factories: {'children.models': subFactory}})
    assert.ok(_.isUndefined(vm.children))
    vm.children = kb.observable(parent, 'children', vm.shareOptions())
    assert.ok(vm.children()[0].cid())

    kb.release(vm)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  # https://github.com/kmalakoff/knockback/issues/121
  it '25. Issue 121', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    view_model = kb.viewModel(model1 = new kb.Model())
    model1.set({propB: 'val2'})
    assert.equal view_model.propB(), 'val2'

    model1.set({propA: 'val1', propB: 'val2.2'})
    assert.equal view_model.propA(), 'val1'
    assert.equal view_model.propB(), 'val2.2'

    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'can update an unshared null', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    view_model = kb.viewModel(null)
    assert.ok !view_model.name
    view_model.model(new kb.Model({name: 'Bob'}))
    assert.equal view_model.name(), 'Bob'

    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'cannot update a shared null', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    class CustomViewModel extends kb.ViewModel

    view_model = kb.viewModel(new kb.Model({model1: null, model2: null}), {factories: {model1: CustomViewModel, model2: CustomViewModel}})
    assert.ok view_model.model1
    assert.equal view_model.model1().model(), null, 'model1 is null'
    assert.ok view_model.model2
    assert.equal view_model.model2().model(), null, 'model2 is null'

    # cannot change a shared model
    assert.throw (-> view_model.model1().model(new kb.Model({name: 'Bob'}))), 'Trying to change a shared view model. Ref count: 3'
    assert.equal view_model.model1().model(), null, 'model1 is still null'
    assert.ok !view_model.model1().name, 'name has not been added to the shared view model'

    # can set the view model
    view_model.model1(new CustomViewModel(new kb.Model({name: 'Bob'})))
    assert !!view_model.model1().model
    assert.equal view_model.model1().name(), 'Bob', 'name has been added to the new view model'

    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'cannot update a shared view model', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    class CustomViewModel extends kb.ViewModel

    model = new kb.Model({name: 'Fred'})
    view_model = kb.viewModel(new kb.Model({model1: model, model2: model}), {factories: {model1: CustomViewModel, model2: CustomViewModel}})
    assert.ok view_model.model1
    assert.equal view_model.model1().model(), model, 'model1 is model'
    assert.equal view_model.model1().name(), 'Fred', 'name is Fred'
    assert.ok view_model.model2
    assert.equal view_model.model2().model(), model, 'model2 is model'
    assert.equal view_model.model2().name(), 'Fred', 'name is Fred'

    # cannot change a shared model
    assert.throw (-> view_model.model1().model(new kb.Model({name: 'Bob'}))), 'Trying to change a shared view model. Ref count: 3'
    assert.equal view_model.model1().model(), model, 'model1 is still model'
    assert.equal view_model.model1().name(), 'Fred', 'name has not been changed'

    # can set the view model
    view_model.model1(new CustomViewModel(new kb.Model({name: 'Bob'})))
    assert !!view_model.model1().model
    assert.equal view_model.model1().name(), 'Bob', 'name has been changed on the new view model'

    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  # https://github.com/kmalakoff/knockback/issues/134
  it 'handles url attributes', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    view_model = kb.viewModel(new kb.Model({url: '/some_url'}))
    assert.equal view_model.url(), '/some_url'

    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  # https://github.com/kmalakoff/knockback/issues/73
  it 'handles attribute named model', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    model = new kb.Model({model: 'car'})
    view_model = kb.viewModel(model, internals: ['model'])
    assert.equal view_model._model(), 'car'
    assert.equal view_model.model(), model

    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()
