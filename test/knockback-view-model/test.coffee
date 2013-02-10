$(->
  module("knockback-view-model.js")

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  _ = if not window._ and (typeof(require) isnt 'undefined') then require('underscore') else window._
  _ = _._ if _ and _.hasOwnProperty('_') # LEGACY
  Backbone = if not window.Backbone and (typeof(require) isnt 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) isnt 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) isnt 'undefined') then require('knockback') else window.kb

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko, 'ko')
    ok(!!_, '_')
    ok(!!Backbone, 'Backbone')
    ok(!!kb, 'kb')
    ok(!!kb, 'kb')
  )

  kb.Contact = Backbone.Model.extend({ defaults: {name: '', number: 0, date: new Date()} })
  kb.ContactsCollection = Backbone.Collection.extend({ model: kb.Contact })

  test("1. Standard use case: read and write", ->
    kb.statistics = new kb.Statistics() # turn on stats

    model = new kb.Contact({name: 'Ringo', number: '555-555-5556'})
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

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("4. Using Coffeescript classes", ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelCustom extends kb.ViewModel
      constructor: (model) ->
        super(model, {internals: ['name', 'number']})
        @name = ko.dependentObservable(=> return "First: #{@_name()}")

    model = new kb.Contact({name: 'Ringo', number: '555-555-5556'})
    view_model = new ContactViewModelCustom(model)

    # get
    equal(view_model._name(), 'Ringo', "Interesting name")
    equal(view_model.name(), 'First: Ringo', "Interesting name")

    # set from the model
    model.set({name: 'Starr'})
    equal(view_model._name(), 'Starr', "Name changed")
    equal(view_model.name(), 'First: Starr', "Name changed")

    # set from the generated attribute
    view_model._name('Ringo')
    equal(view_model._name(), 'Ringo', "Interesting name")
    equal(view_model.name(), 'First: Ringo', "Interesting name")

    # and cleanup after yourself when you are done.
    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("5. Using simple Javascript classes", ->
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

    model = new kb.Contact({name: 'Ringo', number: '555-555-5556'})
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

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("6. requires", ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelFullName extends kb.ViewModel
      constructor: (model) ->
        super(model, {requires: ['first', 'last']})
        @full_name = ko.dependentObservable(=> "Last: #{@last()}, First: #{@first()}")

    model = new Backbone.Model()
    view_model = new ContactViewModelFullName(model)
    equal(view_model.full_name(), 'Last: null, First: null', "full name is good")

    model.set({first: 'Ringo', last: 'Starr'})
    equal(view_model.full_name(), 'Last: Starr, First: Ringo', "full name is good")

    model.set({first: 'Bongo'})
    equal(view_model.full_name(), 'Last: Starr, First: Bongo', "full name is good")

    # clean up
    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )


  test("8. reference counting and custom __destroy (Coffeescript inheritance)", ->
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

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("9. reference counting and custom __destroy (Javascript inheritance)", ->
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

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("10. Nested custom view models", ->
    kb.statistics = new kb.Statistics() # turn on stats

    class ContactViewModelDate extends kb.ViewModel
      constructor: (model, options) ->
        super(model, _.extend({requires: ['date']}, options))

    john_birthdate = new Date(1940, 10, 9)
    john = new kb.Contact({name: 'John', date: new Date(john_birthdate.valueOf())})
    paul_birthdate = new Date(1942, 6, 18)
    paul = new kb.Contact({name: 'Paul', date: new Date(paul_birthdate.valueOf())})
    george_birthdate = new Date(1943, 2, 25)
    george = new kb.Contact({name: 'George', date: new Date(george_birthdate.valueOf())})
    ringo_birthdate = new Date(1940, 7, 7)
    ringo = new kb.Contact({name: 'Ringo', date: new Date(ringo_birthdate.valueOf())})
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
      view_model.date(new Date(1963, 11, 10))
      current_date = model.get('date')
      equal(current_date.getFullYear(), 1963, "#{name}: year is good")
      equal(current_date.getMonth(), 11, "#{name}: month is good")
      equal(current_date.getDate(), 10, "#{name}: day is good")
      equal(view_model.date().getFullYear(), 1963, "#{name}: year is good")
      equal(view_model.date().getMonth(), 11, "#{name}: month is good")
      equal(view_model.date().getDate(), 10, "#{name}: day is good")

      model.set({date: new Date(birthdate.valueOf())}) # restore birthdate

      # set from the model
      view_model.date(new Date(1940, 10, 10))
      current_date = model.get('date')
      equal(current_date.getFullYear(), 1940, "#{name}: year is good")
      equal(current_date.getMonth(), 10, "#{name}: month is good")
      equal(current_date.getDate(), 10, "#{name}: day is good")
      equal(view_model.date().getFullYear(), 1940, "#{name}: year is good")
      equal(view_model.date().getMonth(), 10, "#{name}: month is good")
      equal(view_model.date().getDate(), 10, "#{name}: day is good")

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

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("11. Changing attribute types", ->
    kb.statistics = new kb.Statistics() # turn on stats

    model = new Backbone.Model({reused: null})
    view_model = kb.viewModel(model)
    equal(kb.utils.valueType(view_model.reused), kb.TYPE_SIMPLE, 'reused is kb.TYPE_SIMPLE')

    model.set({reused: new Backbone.Model()})
    equal(kb.utils.valueType(view_model.reused), kb.TYPE_MODEL, 'reused is kb.TYPE_MODEL')

    model.set({reused: new Backbone.Collection()})
    equal(kb.utils.valueType(view_model.reused), kb.TYPE_COLLECTION, 'reused is kb.TYPE_COLLECTION')

    model.set({reused: null})
    equal(kb.utils.valueType(view_model.reused), kb.TYPE_COLLECTION, 'reused is retains type of kb.TYPE_COLLECTION')

    # clean up
    kb.release(view_model)

    # add custom mapping
    view_model = kb.viewModel(model, {factories:
      reused: (obj, options) -> return if obj instanceof Backbone.Collection then kb.collectionObservable(obj, options) else kb.viewModel(obj, options)
    })
    equal(kb.utils.valueType(view_model.reused), kb.TYPE_MODEL, 'reused is kb.TYPE_MODEL')

    model.set({reused: new Backbone.Model()})
    equal(kb.utils.valueType(view_model.reused), kb.TYPE_MODEL, 'reused is kb.TYPE_MODEL')

    model.set({reused: new Backbone.Collection()})
    equal(kb.utils.valueType(view_model.reused), kb.TYPE_COLLECTION, 'reused is kb.TYPE_COLLECTION')

    model.set({reused: null})
    equal(kb.utils.valueType(view_model.reused), kb.TYPE_COLLECTION, 'reused retains type of kb.TYPE_COLLECTION')

    # clean up
    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("14. Shared Options", ->
    kb.statistics = new kb.Statistics() # turn on stats
    model1 = new Backbone.Model({id: 1, name: 'Bob'})
    model2 = new Backbone.Model({id: 1, name: 'Bob'})
    model3 = new Backbone.Model({id: 1, name: 'Bob'})

    view_model1 = kb.viewModel(model1)
    view_model2 = kb.viewModel(model2)
    view_model3 = kb.viewModel(model3, view_model1.shareOptions())

    ok((view_model1.name isnt view_model2.name) and (view_model1.name() is view_model2.name()), 'not sharing')
    ok((view_model1.name isnt view_model3.name) and (view_model1.name() is view_model3.name()), 'sharing')

    kb.release([view_model1, view_model2, view_model3])

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("15. Options", ->
    kb.statistics = new kb.Statistics() # turn on stats

    # keys - array
    view_model = kb.viewModel(new Backbone.Model({name: 'Bob'}), keys: ['name', 'date'])
    equal(view_model.name(), 'Bob', 'keys: Bob')
    ok(view_model.date, 'keys: date')
    equal(view_model.date(), null, 'keys: date fn')
    kb.release(view_model)

    # keys - object
    view_model = kb.viewModel(new Backbone.Model({name: 'Bob'}), keys: {name: {}, date: {}})
    equal(view_model.name(), 'Bob', 'keys: Bob')
    ok(view_model.date, 'keys: date')
    equal(view_model.date(), null, 'keys: date fn')
    kb.release(view_model)

    # excludes
    view_model = kb.viewModel(new Backbone.Model({name: 'Bob', date: new Date()}), excludes: ['date'])
    equal(view_model.name(), 'Bob', 'excludes: Bob')
    ok(not view_model.date, 'excludes: date')
    kb.release(view_model)

    # requires
    view_model = kb.viewModel(new Backbone.Model(), requires: ['name'])
    equal(view_model.name(), null, 'requires: name')
    ok(not view_model.date, 'requires: date')
    kb.release(view_model)

    # internals
    view_model = kb.viewModel(new Backbone.Model(), internals: ['name'])
    equal(view_model._name(), null, 'internals: name')
    ok(not view_model.date, 'internals: date')
    kb.release(view_model)

    # mappings
    view_model = kb.viewModel(new Backbone.Model(), mappings: {name: {}})
    equal(view_model.name(), null, 'mappings: name')
    ok(not view_model.date, 'mappings: date')
    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("16. array attributes", ->

    model = new Backbone.Model
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

    ok(_.isEqual(view_model.text(), ["heading.get these rewards"]), 'text observable matches')
    ok(_.isEqual(view_model.widget(), ["sign_up", "rewards"]), 'widget observable matches')
    ok(_.isEqual(view_model.model_data().reward.top_rewards.properties, ["title", "description", "num_points"]), 'model_data observable matches')
  )

  test("17. model change is observable", ->
    kb.statistics = new kb.Statistics() # turn on stats
    model = new Backbone.Model({id: 1, name: 'Bob'})

    view_model = kb.viewModel(model)

    count = 0
    ko.dependentObservable(-> view_model.model(); count++)

    view_model.model(null)
    view_model.model(model)
    equal(count, 3, "model change was observed")
    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
)