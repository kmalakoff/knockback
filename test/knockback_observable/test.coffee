$(document).ready( ->
  module("knockback_observable.js")

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  if (typeof(require) != 'undefined') then _ = require('underscore') else _ = window._
  _ = _._ if _ and (_.hasOwnProperty('_')) # LEGACY
  Backbone = if not window.Backbone and (typeof(require) != 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) != 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) != 'undefined') then require('knockback') else window.kb
  _kbe = if not window._kbe and (typeof(require) != 'undefined') then require('knockback-examples') else window._kbe

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko); ok(!!_); ok(!!Backbone); ok(!!kb); ok(!!_kbe)
  )

  test("1. Standard use case: direct attributes with read and write", ->
    ContactViewModel = (model) ->
      @name = kb.observable(model, 'name')
      @number = kb.observable(model, {key:'number'})
      @

    model = new _kbe.Contact({name: 'Ringo', number: '555-555-5556'})
    view_model = new ContactViewModel(model)

    # get
    equal(view_model.name(), 'Ringo', "Interesting name")
    equal(view_model.number(), '555-555-5556', "Not so interesting number")

    # set from the view model
    view_model.name('Paul')
    equal(model.get('name'), 'Paul', "Name changed")
    equal(view_model.name(), 'Paul', "Name changed")
    equal(model.get('number'), '555-555-5556', "Number not changed")
    equal(view_model.number(), '555-555-5556', "Number not changed")

    # set from the model
    model.set({name: 'Starr', number: 'XXX-XXX-XXXX'})
    equal(view_model.name(), 'Starr', "Name changed")
    equal(view_model.number(), 'XXX-XXX-XXXX', "Number was changed")

    # and cleanup after yourself when you are done.
    kb.release(view_model)
  )

  test("2. Standard use case: direct attributes with custom read and write", ->
    ContactViewModelCustom = (model) ->
      @name = kb.observable(model, {key:'name', read: -> return "First: #{model.get('name')}" })
      @number = kb.observable(model, {
        key:'number'
        read: -> return "#: #{model.get('number')}"
        write: (value) -> model.set({number: value.substring(3)})
      })
      @

    model = new _kbe.Contact({name: 'Ringo', number: '555-555-5556'})
    view_model = new ContactViewModelCustom(model)

    # get
    equal(view_model.name(), 'First: Ringo', "Interesting name")
    equal(view_model.number(), '#: 555-555-5556', "Not so interesting number")

    # set from the view model
    equal(model.get('name'), 'Ringo', "Name not changed")
    equal(view_model.name(), 'First: Ringo', "Name not changed")
    view_model.number('#: 9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '#: 9222-222-222', "Number was changed")

    # set from the model
    model.set({name: 'Starr', number: 'XXX-XXX-XXXX'})
    equal(view_model.name(), 'First: Starr', "Name changed")
    equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed")

    # and cleanup after yourself when you are done.
    kb.release(view_model)
  )

  test("3. Read args", ->
    args = []
    ContactViewModelCustom = (model) ->
      @name = kb.observable(model, {key:'name', read: ((key, arg1, arg2) -> args.push(arg1); args.push(arg2); return model.get('name')), args: ['name', 1] })
      @number = kb.observable(model, {key:'name', read: ((key, arg) -> args.push(arg); return model.get('number')), args: 'number' })
      @

    model = new _kbe.Contact({name: 'Ringo', number: '555-555-5556'})
    view_model = new ContactViewModelCustom(model)
    ok(_.isEqual(args, ['name', 1, 'number']), "got the args")
  )

  test("4. Standard use case: ko.dependentObservable", ->
    ContactViewModel = (model) ->
      @name = kb.observable(model, {key: 'name'})
      @formatted_name = ko.dependentObservable({
        read: @name,
        write: ((value) -> @name($.trim(value))),
        owner: @
      })
      @           # must return this or Coffeescript will return the last statement which is not what we want!

    model = new _kbe.Contact({name: 'Ringo'})
    view_model = new ContactViewModel(model)

    # get
    equal(view_model.name(), 'Ringo', "Interesting name")
    equal(view_model.formatted_name(), 'Ringo', "Interesting name")

    # set from the model
    view_model.formatted_name(' John ')
    equal(view_model.name(), 'John', "Name changed")
    equal(view_model.formatted_name(), 'John', "Name changed")

    # and cleanup after yourself when you are done.
    kb.release(view_model)
  )

  test("5. Infering observable types: the easy way", ->
    class ChildrenCollection extends kb.CollectionObservable
      constructor: (collection, options) ->
        return super(collection, {view_model: InferingViewModel, options: options}) # return the observable instead of this

    class InferingViewModel extends kb.ViewModel
      constructor: (model, options) ->
        super(model, {
          keys: ['name', 'parent', 'children', 'maybe_null_name', 'maybe_null_parent', 'maybe_null_children']
          factories: {
            'maybe_null_parent': InferingViewModel
            'maybe_null_children': ChildrenCollection
          }
          options: options
        })
  
    parent = new Backbone.Model({name: 'Daddy'})
    children_child = new Backbone.Model({name: 'Baby'})
    children = new Backbone.Collection([{name: 'Bob', children: new Backbone.Collection([children_child]), maybe_null_children: new Backbone.Collection([children_child])}])
    model = new Backbone.Model({})

    view_model = new InferingViewModel(model)
    equal(view_model.name(), null, 'inferred name as simple null')
    equal(view_model.parent(), null, 'inferred parent as simple null')
    equal(view_model.children(), null, 'inferred children as simple null')
    equal(view_model.maybe_null_name(), null, 'name is null')
    equal(view_model.maybe_null_parent().name(), null, 'parent name is null')
    ok(view_model.maybe_null_parent() instanceof InferingViewModel, 'maybe_null_parent type is inferring')
    equal(view_model.maybe_null_children().length, 0, 'no children yet')

    # update the model
    model.set({
      name: 'Fred'
      parent: parent
      children: children
    })
    equal(view_model.name(), 'Fred', 'name is Fred')
    equal(view_model.parent().name(), 'Daddy', 'parent name is Daddy')
    ok(view_model.parent() instanceof kb.ViewModel, 'parent type is kb.ViewModel')
    equal(view_model.children()[0].name(), 'Bob', 'child name is Bob')
    ok(view_model.children()[0] instanceof kb.ViewModel, 'child type is kb.ViewModel')
    equal(view_model.children()[0].children()[0].name(), 'Baby', 'child child name is Baby')
    ok(view_model.children()[0].children()[0] instanceof kb.ViewModel, 'child child type is kb.ViewModel')
    equal(view_model.maybe_null_name(), null, 'name is null')
    equal(view_model.maybe_null_parent().name(), null, 'parent name is null')
    equal(view_model.maybe_null_children().length, 0, 'no children yet')

    # update the model
    model.set({
      maybe_null_name: model.get('name')
      maybe_null_parent: model.get('parent')
      maybe_null_children: model.get('children')
    })
    equal(view_model.maybe_null_name(), 'Fred', 'maybe_null_name is Fred')
    equal(view_model.maybe_null_parent().name(), 'Daddy', 'maybe_null_parent name is Daddy')
    ok(view_model.maybe_null_parent() instanceof InferingViewModel, 'maybe_null_parent type is InferingViewModel')
    equal(view_model.maybe_null_children()[0].name(), 'Bob', 'child name is Bob')
    ok(view_model.maybe_null_children()[0] instanceof InferingViewModel, 'child type is InferingViewModel')
    equal(view_model.maybe_null_children()[0].children()[0].name(), 'Baby', 'child child name is Baby')
    ok(view_model.maybe_null_children()[0].children()[0] instanceof kb.ViewModel, 'child child type is kb.ViewModel')
    equal(view_model.maybe_null_children()[0].maybe_null_children()[0].name(), 'Baby', 'maybe_null_children maybe_null_children name is Baby')
    ok(view_model.maybe_null_children()[0].maybe_null_children()[0] instanceof InferingViewModel, 'maybe_null_children maybe_null_children type is InferingViewModel')

    # and cleanup after yourself when you are done.
    kb.release(view_model)
  )

  test("6. Infering observable types: the hard way", ->
    class ChildrenCollection extends kb.CollectionObservable
      constructor: (collection, options) ->
        return super(collection, {view_model: InferingViewModel, options: options}) # return the observable instead of this

    InferingViewModel = (model, options) ->
      kb.viewModel(model, {keys: ['name', 'parent', 'children'], options: options}, @)
      @maybe_null_name = kb.observable(model, 'maybe_null_name')
      @maybe_null_parent = kb.observable(model, {key: 'maybe_null_parent', factories: InferingViewModel, options: options})
      @maybe_null_children = kb.observable(model, {key: 'maybe_null_children', factories: ChildrenCollection, options: options})
      @

    parent = new Backbone.Model({name: 'Daddy'})
    children_child = new Backbone.Model({name: 'Baby'})
    children = new Backbone.Collection([{name: 'Bob', children: new Backbone.Collection([children_child]), maybe_null_children: new Backbone.Collection([children_child])}])
    model = new Backbone.Model({})

    view_model = new InferingViewModel(model)
    equal(view_model.name(), null, 'inferred name as simple null')
    equal(view_model.parent(), null, 'inferred parent as simple null')
    equal(view_model.children(), null, 'inferred children as simple null')
    equal(view_model.maybe_null_name(), null, 'name is null')
    equal(view_model.maybe_null_parent().name(), null, 'parent name is null')
    ok(view_model.maybe_null_parent() instanceof InferingViewModel, 'maybe_null_parent type is inferring')
    equal(view_model.maybe_null_children().length, 0, 'no children yet')

    # update the model
    model.set({
      name: 'Fred'
      parent: parent
      children: children
    })
    equal(view_model.name(), 'Fred', 'name is Fred')
    equal(view_model.parent().name(), 'Daddy', 'parent name is Daddy')
    ok(view_model.parent() instanceof kb.ViewModel, 'parent type is kb.ViewModel')
    equal(view_model.children()[0].name(), 'Bob', 'child name is Bob')
    ok(view_model.children()[0] instanceof kb.ViewModel, 'child type is kb.ViewModel')
    equal(view_model.children()[0].children()[0].name(), 'Baby', 'child child name is Baby')
    ok(view_model.children()[0].children()[0] instanceof kb.ViewModel, 'child child type is kb.ViewModel')
    equal(view_model.maybe_null_name(), null, 'name is null')
    equal(view_model.maybe_null_parent().name(), null, 'parent name is null')
    equal(view_model.maybe_null_children().length, 0, 'no children yet')

    # update the model
    model.set({
      maybe_null_name: model.get('name')
      maybe_null_parent: model.get('parent')
      maybe_null_children: model.get('children')
    })
    equal(view_model.maybe_null_name(), 'Fred', 'maybe_null_name is Fred')
    equal(view_model.maybe_null_parent().name(), 'Daddy', 'maybe_null_parent name is Daddy')
    ok(view_model.maybe_null_parent() instanceof InferingViewModel, 'maybe_null_parent type is InferingViewModel')
    equal(view_model.maybe_null_children()[0].name(), 'Bob', 'child name is Bob')
    ok(view_model.maybe_null_children()[0] instanceof InferingViewModel, 'child type is InferingViewModel')
    equal(view_model.maybe_null_children()[0].children()[0].name(), 'Baby', 'child child name is Baby')
    ok(view_model.maybe_null_children()[0].children()[0] instanceof kb.ViewModel, 'child child type is kb.ViewModel')
    equal(view_model.maybe_null_children()[0].maybe_null_children()[0].name(), 'Baby', 'maybe_null_children maybe_null_children name is Baby')
    ok(view_model.maybe_null_children()[0].maybe_null_children()[0] instanceof InferingViewModel, 'maybe_null_children maybe_null_children type is InferingViewModel')

    # and cleanup after yourself when you are done.
    kb.release(view_model)
  )
)