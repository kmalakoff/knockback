$(document).ready( ->
  module("knockback legacy.js")

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  if (typeof(require) != 'undefined') then _ = require('underscore') else _ = window._
  _ = _._ if _ and (_.hasOwnProperty('_')) # LEGACY
  Backbone = if not window.Backbone and (typeof(require) != 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) != 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) != 'undefined') then require('knockback') else window.kb

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko); ok(!!_); ok(!!Backbone); ok(!!kb)
  )

  test("Deprecated utility functions still exist", ->
    kb.wrappedObservable({__kb: {observable:{}}})
    kb.vmModel({__kb: {model:{}}})
    kb.vmSetToDefault({})
    kb.vmRelease({})
    kb.vmReleaseObservable(ko.observable())
  )

  test("Deprecated functionality of kb.observable", ->
    # LEGACY: read only default still work if provide a write function or boolean
    model = new Backbone.Model({name: 'name1'})
    observable = kb.observable(model, {key: 'name', write: true})
    observable('name2')
    equal(observable(), 'name2', "Name was written")
    equal(model.get('name'), 'name2', "Name was written")

    model = new Backbone.Model({name: 'name1'})
    observable = kb.observable(model, {key: 'name', write: false})
    raises((->observable('name2')), null, "kb.Observable: name is read only")
    equal(observable(), 'name1', "Name was not written")
    equal(model.get('name'), 'name1', "Name not was written")

    # MUST UPDATE: now writable is default like for kb.ViewModel
    model = new Backbone.Model({name: 'name1'})
    observable = kb.observable(model, 'name')
    observable('name2')
    equal(observable(), 'name2', "Name was not written")
    equal(model.get('name'), 'name2', "Name not was written")

    model = new Backbone.Model({name: 'name1'})
    observable = kb.observable(model, {key: 'name'})
    observable('name2')
    equal(observable(), 'name2', "Name was not written")
    equal(model.get('name'), 'name2', "Name not was written")

    model = new Backbone.Model({name: 'name1'})
    observable = kb.observable(model, {key: 'name', read_only: true})
    raises((->observable('name2')), null, "kb.Observable: name is read only")
    equal(observable(), 'name1', "Name was not written")
    equal(model.get('name'), 'name1', "Name not was written")
  )

  test("Deprecated functionality of kb.observables", ->
    # LEGACY: read only default still work if provide a write function or boolean
    model = new Backbone.Model({name: 'name1'})
    observables = kb.observables(model,
      name: {key: 'name', write: true}
    )
    observables.name('name2')
    equal(observables.name(), 'name2', "Name was written")
    equal(model.get('name'), 'name2', "Name was written")

    model = new Backbone.Model({name: 'name1'})
    observables = kb.observables(model,
      name: {key: 'name', write: false}
    )
    raises((->observables.name('name2')), null, "kb.Observable: name is read only")
    equal(observables.name(), 'name1', "Name was not written")
    equal(model.get('name'), 'name1', "Name not was written")

    model = new Backbone.Model({name: 'name1'})
    observables = kb.observables(model,{
      name: {key: 'name'}
    }, {}, {write: true})
    observables.name('name2')
    equal(observables.name(), 'name2', "Name was written")
    equal(model.get('name'), 'name2', "Name was written")

    model = new Backbone.Model({name: 'name1'})
    observables = kb.observables(model,{
      name: {key: 'name'}
    }, {}, {write: false})
    raises((->observables.name('name2')), null, "kb.Observable: name is read only")
    equal(observables.name(), 'name1', "Name was not written")
    equal(model.get('name'), 'name1', "Name not was written")

    # MUST UPDATE: now writable is default like for kb.ViewModel

    # remapped: now writable by default
    model = new Backbone.Model({name: 'name1'})
    observables = kb.observables(model,
      name: {}
    )
    observables.name('name2')
    equal(observables.name(), 'name2', "Name was not written")
    equal(model.get('name'), 'name2', "Name not was written")

    # remapped: now writable by default
    model = new Backbone.Model({name: 'name1'})
    observables = kb.observables(model,
      name: {key: 'name'}
    )
    observables.name('name2')
    equal(observables.name(), 'name2', "Name was not written")
    equal(model.get('name'), 'name2', "Name not was written")

    model = new Backbone.Model({name: 'name1'})
    observables = kb.observables(model,
      name: {key: 'name', read_only: true}
    )
    raises((->observables.name('name2')), null, "kb.Observable: name is read only")
    equal(observables.name(), 'name1', "Name was not written")
    equal(model.get('name'), 'name1', "Name not was written")

    model = new Backbone.Model({name: 'name1'})
    observables = kb.observables(model,
      name: {read_only: true}
    )
    raises((->observables.name('name2')), null, "kb.Observable: name is read only")
    equal(observables.name(), 'name1', "Name was not written")
    equal(model.get('name'), 'name1', "Name not was written")

    # remapped: now read_only option
    model = new Backbone.Model({name: 'name1'})
    observables = kb.observables(model,{
      name: {key: 'name'}
    }, {}, true)
    raises((->observables.name('name2')), null, "kb.Observable: name is read only")
    equal(observables.name(), 'name1', "Name was not written")
    equal(model.get('name'), 'name1', "Name not was written")
  )

  test("Deprecated functionality of kb.CollectionObservable", ->
    class Test
      constructor: (model) -> {}

    # LEGACY: external array for models
    a = ko.observableArray()
    co = kb.collectionObservable(new Backbone.Collection([new Backbone.Model({name: 'name1'}), new Backbone.Model({name: 'name2'})]), a)
    equal(a().length, 2, 'Array: Models created')
    equal(co().length, 2, 'Collection: Models created')
    equal(a, co, 'Observable is identical')
    for m in a()
      ok(_.contains(['name1', 'name2'], m.get('name')), 'Expected name')
      ok((m instanceof Backbone.Model), 'Expected Type')

    # LEGACY: external array for view models
    a = ko.observableArray()
    co = kb.collectionObservable(new Backbone.Collection([new Backbone.Model({name: 'name1'}), new Backbone.Model({name: 'name2'})]), a, {view_model: Test})
    equal(a().length, 2, 'Array: View Models created')
    equal(co().length, 2, 'Collection: View Models created')
    equal(a, co, 'Observable is identical')
    for vm in a()
      ok(_.contains(['name1', 'name2'], kb.utils.wrappedModel(vm).get('name')), 'Expected name')
      ok((vm instanceof Test), 'Expected Type')

    # LEGACY: external array for view models using deprecated option
    a = ko.observableArray()
    co = kb.collectionObservable(new Backbone.Collection([new Backbone.Model({name: 'name1'}), new Backbone.Model({name: 'name2'})]), a, {view_model_constructor: Test})
    equal(a().length, 2, 'Array: View Models created')
    equal(co().length, 2, 'Collection: View Models created')
    equal(a, co, 'Observable is identical')
    for vm in a()
      ok(_.contains(['name1', 'name2'], kb.utils.wrappedModel(vm).get('name')), 'Expected name')
      ok((vm instanceof Test), 'Expected Type')

    # LEGACY: model changes triggers CollectionObservable when using an array
    a = ko.observableArray()
    co = kb.collectionObservable(new Backbone.Collection([new Backbone.Model({name: 'name1'}), new Backbone.Model({name: 'name2'})]), a)
    collection = co.collection()
    call_count = 0
    test_dependency = ko.dependentObservable(-> call_count++; return co())
    collection.models[0].set({name: 'name1_plus'})
    equal(call_count, 2, 'Deprecated model update triggering still works')

    # MUST UPDATE: model changes do not trigger CollectionObservable

    co = kb.collectionObservable(new Backbone.Collection([new Backbone.Model({name: 'name1'}), new Backbone.Model({name: 'name2'})]))
    collection = co.collection()
    call_count = 0
    test_dependency = ko.dependentObservable(-> call_count++; return co())
    collection.models[0].set({name: 'name1_plus'})
    equal(call_count, 1, 'Model triggering was disabled')
    collection.bind('change', -> co.valueHasMutated())
    collection.models[0].set({name: 'name1_plus_plus'})
    equal(call_count, 2, 'Manual model triggering works instead')

    # MUST UPDATE: sort functions will either pass a Backbone.Model or a view model depending on whether a view_model-create options was passed or not

    # LEGACY: if there is no view_model-create, it still works
    collection_observable = kb.collectionObservable(new Backbone.Collection([{name: 'name2'}, {name: 'name1'}]), {
      sorted_index:   (models, model) -> return _.sortedIndex(models, model, (test) -> return test.get('name') )
    })
    equal(collection_observable()[0].get('name'), 'name1', 'Name is right: name1')
    equal(collection_observable()[1].get('name'), 'name2', 'Name is right: name2')

    # MUST UPDATE: use kb.utils.wrappedModel
    collection_observable = kb.collectionObservable(new Backbone.Collection([{name: 'name2'}, {name: 'name1'}]), {
      view_model:     kb.ViewModel
      sorted_index:   (models, model) -> return _.sortedIndex(models, model, (test) -> return kb.utils.wrappedModel(test).get('name') )
    })
    equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'name1', 'Name is right: name1')
    equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'name2', 'Name is right: name2')
  )

  test("Error cases", ->
    # TODO
  )
)