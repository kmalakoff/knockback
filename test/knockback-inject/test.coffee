$(document).ready( ->
  module("knockback-inject.js")

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  if (typeof(require) isnt 'undefined') then _ = require('underscore') else _ = window._
  _ = _._ if _ and _.hasOwnProperty('_') # LEGACY
  Backbone = if not window.Backbone and (typeof(require) isnt 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) isnt 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) isnt 'undefined') then require('knockback') else window.kb

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko, 'ko')
    ok(!!_, '_')
    ok(!!Backbone, 'Backbone')
    ok(!!kb, 'kb')
  )

  window.appCreate = (view_model) -> view_model.app_create = true

  window.app = (view_model) ->
    @app = true
    kb.statistics.register('app', @)
    @destroy = => kb.statistics.unregister('app', @)
    return @ # return self

  class window.SuperClass
    constructor: ->
      @super_class = true
      kb.statistics.register('SuperClass', @)
    destroy: ->
      kb.statistics.unregister('SuperClass', @)

  class window.SubClass extends SuperClass
    constructor: ->
      super
      @sub_class = true

  test("1. kb-app", ->
    kb.statistics = new kb.Statistics() # turn on stats

    # no attributes
    app_el = $('<div kb-app></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "no attr: app was injected")
    ko.removeNode(app_el)

    # properties
    window.hello = true
    app_el = $('<div kb-app="hello: hello"><span data-bind="visible: hello"></span></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "Properties: app was injected")
    equal(apps[0].view_model.hello, window.hello, "Properties: hello was injected")
    equal(apps[0].view_model.hello, true, "Properties: hello is true")
    ko.removeNode(app_el)

    # ViewModel solo
    app_el = $('<div kb-app="app"><span data-bind="visible: app"></span></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "ViewModel Solo: app was injected")
    ok(apps[0].view_model instanceof window.app, "ViewModel Solo: view_model type app")
    equal(apps[0].view_model.app, true, "ViewModel Solo: app is true")
    ko.removeNode(app_el)

    # mutiliple ViewModel solos
    app_el = $("""
      <div>
        <div kb-app="app"><span data-bind="visible: app"></span></div>
        <div kb-app="app"><span data-bind="visible: app"></span></div>
      </div>""")[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el.children[0], "ViewModel Solo: app was injected")
    ok(apps[0].view_model instanceof window.app, "ViewModel Solo: view_model type app")
    equal(apps[0].view_model.app, true, "ViewModel Solo: app is true")
    equal(apps[1].el, app_el.children[1], "ViewModel Solo: app was injected")
    ok(apps[1].view_model instanceof window.app, "ViewModel Solo: view_model type app")
    equal(apps[1].view_model.app, true, "ViewModel Solo: app is true")
    ko.removeNode(app_el)

    # Create function with callbacks
    app_el = $('<div kb-app="create: appCreate"><span data-bind="visible: app_create"></span></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "Create: app was injected")
    ok(not (apps[0].view_model instanceof window.appCreate), "Create: view_model not type appCreate")
    ok(_.isObject(apps[0].view_model), "Create: view_model is basic type")
    equal(apps[0].view_model.app_create, true, "Create + Callbacks: view model was injected")
    ko.removeNode(app_el)

    # ViewModel property
    app_el = $('<div kb-app="view_model: app"><span data-bind="visible: app"></span></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "ViewModel Property: app was injected")
    ok(apps[0].view_model instanceof window.app, "ViewModel Property: view_model type app")
    equal(apps[0].view_model.app, true, "ViewModel Property: hello is true")
    ko.removeNode(app_el)

    # ViewModel property and Create should take ViewModel
    app_el = $('<div kb-app="view_model: app, create: appCreate"><span data-bind="visible: app"></span><span data-bind="visible: app_create"></span></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "Create: app was injected")
    ok(not (apps[0].view_model instanceof window.appCreate), "Create: view_model not type appCreate")
    ok(_.isObject(apps[0].view_model), "Create: view_model is basic type")
    ok(apps[0].view_model instanceof window.app, "ViewModel Property: view_model type app")
    equal(apps[0].view_model.app, true, "Create + Callbacks: view model was injected - ViewModel")
    equal(apps[0].view_model.app_create, true, "Create + Callbacks: view model was injected - ViewModel, Create")
    ko.removeNode(app_el)

    # Create and ViewModel property should take ViewModel
    app_el = $('<div kb-app="create: appCreate, view_model: app"><span data-bind="visible: app"></span><span data-bind="visible: app_create"></span></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "Create: app was injected")
    ok(not (apps[0].view_model instanceof window.appCreate), "Create: view_model not type appCreate")
    ok(_.isObject(apps[0].view_model), "Create: view_model is basic type")
    ok(apps[0].view_model instanceof window.app, "ViewModel Property: view_model type app")
    equal(apps[0].view_model.app, true, "Create + Callbacks: view model was injected - ViewModel")
    equal(apps[0].view_model.app_create, true, "Create + Callbacks: view model was injected - Create, ViewModel")
    ko.removeNode(app_el)

    # ViewModel Object
    app_el = $('<div kb-app="hello: true"><span data-bind="visible: hello"></span></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "ViewModel Object: app was injected")
    equal(apps[0].view_model.hello, true, "ViewModel Object: hello is true")
    ko.removeNode(app_el)

    # Mix of things
    app_el = $("""
        <div kb-app="view_model: SuperClass, sub_class: {view_model: SubClass}, created: {create: appCreate}, hello: true, embed: {hello: true}">
          <span data-bind="visible: super_class"></span>
          <span data-bind="visible: sub_class.sub_class"></span>
          <span data-bind="visible: created.app_create"></span>
          <span data-bind="visible: embed.hello"></span>
          <span data-bind="visible: hello"></span>
        </div>""")[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "ViewModel Object: app was injected")
    ok((apps[0].view_model instanceof SuperClass), "Mix: is SuperClass")
    equal(apps[0].view_model.super_class, true, "Mix: has super_class")
    ok((apps[0].view_model.sub_class instanceof SubClass), "Mix: is SubClass")
    equal(apps[0].view_model.sub_class.sub_class, true, "Mix: has sub_class")
    ok(not (apps[0].view_model.created instanceof appCreate), "Mix: is not create")
    equal(apps[0].view_model.created.app_create, true, "Mix: has create")
    equal(apps[0].view_model.embed.hello, true, "Mix: embedded hello is true")
    equal(apps[0].view_model.hello, true, "Mix: hello is true")
    ko.removeNode(app_el)

    # Properties with callbacks
    before_was_called = false
    after_was_called = false
    window.beforeBinding = (view_model) -> before_was_called = view_model.hello
    window.afterBinding = (view_model) -> after_was_called = view_model.hello
    app_el = $('<div kb-app="hello: true, options: {beforeBinding: beforeBinding, afterBinding: afterBinding}"><span data-bind="visible: hello"></span></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "Properties + Callbacks: app was injected")
    equal(apps[0].view_model.hello, true, "Properties + Callbacks: view model was injected")
    ok(before_was_called, "Properties + Callbacks: before_was_called was called")
    ok(after_was_called, "Properties + Callbacks: after_was_called was called")
    ko.removeNode(app_el)

    # Create function with callbacks
    before_was_called = false
    after_was_called = false
    window.beforeBinding = (view_model) -> before_was_called = view_model.hello
    window.afterBinding = (view_model) -> after_was_called = view_model.hello
    app_el = $('<div kb-app="create: appCreate, hello: true, options: {beforeBinding: beforeBinding, afterBinding: afterBinding}"><span data-bind="visible: app_create"></span></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "Create + Callbacks: app was injected")
    ok(not (apps[0].view_model instanceof window.appCreate), "Create: view_model not type appCreate")
    ok(_.isObject(apps[0].view_model), "Create: view_model is basic type")
    equal(apps[0].view_model.app_create, true, "Create + Callbacks: view model was injected")
    ok(before_was_called, "Create + Callbacks: before_was_called was called")
    ok(after_was_called, "Create + Callbacks: after_was_called was called")
    ko.removeNode(app_el)

    # ViewModel property with callbacks
    before_was_called = false
    after_was_called = false
    window.beforeBinding = (view_model) -> before_was_called = view_model.hello
    window.afterBinding = (view_model) -> after_was_called = view_model.hello
    app_el = $('<div kb-app="view_model: app, hello: true, options: {beforeBinding: beforeBinding, afterBinding: afterBinding}"><span data-bind="visible: app"></span></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "ViewModel Property + Callbacks: app was injected")
    ok((apps[0].view_model instanceof window.app), "Create: view_model not type app")
    equal(apps[0].view_model.app, true, "ViewModel Property + Callbacks: view model was injected")
    ok(before_was_called, "ViewModel Property + Callbacks: before_was_called was called")
    ok(after_was_called, "ViewModel Property + Callbacks: after_was_called was called")
    ko.removeNode(app_el)

    # ViewModel Object with callbacks
    before_was_called = false
    after_was_called = false
    window.beforeBinding = (view_model) -> before_was_called = view_model.hello
    window.afterBinding = (view_model) -> after_was_called = view_model.hello
    app_el = $('<div kb-app="hello: true, options: {beforeBinding: beforeBinding, afterBinding: afterBinding}"><span data-bind="visible: hello"></span></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "ViewModel Object + Callbacks: app was injected")
    equal(apps[0].view_model.hello, true, "ViewModel Object + Callbacks: view model was injected")
    ok(before_was_called, "ViewModel Object + Callbacks: before_was_called was called")
    ok(after_was_called, "ViewModel Object + Callbacks: after_was_called was called")
    ko.removeNode(app_el)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("2. data-bind inject", ->
    kb.statistics = new kb.Statistics() # turn on stats

    # properties
    app_el = $('<div data-bind="inject: {hello: true}"><span data-bind="visible: hello"></span></div>')[0]
    view_model = {}
    kb.applyBindings(view_model, app_el)
    equal(view_model.hello, true, "Properties: hello is true")
    ko.removeNode(app_el)

    # ViewModel solo
    app_el = $('<div data-bind="inject: app"><span data-bind="visible: app"></span></div>')[0]
    view_model = {}
    raises((->kb.applyBindings(view_model, app_el)), null, 'cannot change view model')
    ko.removeNode(app_el)

    # ViewModel property
    app_el = $('<div data-bind="inject: {view_model: app}"><span data-bind="visible: app"></span></div>')[0]
    view_model = {}
    raises((->kb.applyBindings(view_model, app_el)), null, 'cannot change view model')
    ko.removeNode(app_el)

    # Create property
    app_el = $('<div data-bind="inject: {create: appCreate}"><span data-bind="visible: app_create"></span></div>')[0]
    view_model = {}
    kb.applyBindings(view_model, app_el)
    equal(view_model.app_create, true, "Create property: app_create is true")
    ko.removeNode(app_el)

    # Function
    window.testFunction = (view_model) -> view_model.hello = true
    app_el = $('<div data-bind="inject: {embedded: testFunction}"><span data-bind="click: embedded.testFunction"></span></div>')[0]
    view_model = {}
    kb.applyBindings(view_model, app_el)
    equal(view_model.embedded, window.testFunction, "Function: is type testFunction")
    ko.removeNode(app_el)

    # Create function
    app_el = $('<div data-bind="inject: {embedded: {create: appCreate}}"><span data-bind="visible: embedded.app_create"></span></div>')[0]
    view_model = {}
    kb.applyBindings(view_model, app_el)
    ok(not (view_model.embedded instanceof window.appCreate), "Create: view_model not type appCreate")
    ok(_.isObject(view_model.embedded), "Create: view_model is basic type")
    equal(view_model.embedded.app_create, true, "Create: view model was injected")
    ko.removeNode(app_el)

    # ViewModel property
    app_el = $('<div data-bind="inject: {embedded: {view_model: app}}"><span data-bind="visible: embedded.app"></span></div>')[0]
    view_model = {}
    kb.applyBindings(view_model, app_el)
    ok(view_model.embedded instanceof window.app, "ViewModel Property: view_model type app")
    equal(view_model.embedded.app, true, "ViewModel Property: hello is true")
    ko.removeNode(app_el)

    # ViewModel Object
    app_el = $('<div data-bind="inject: {hello: true}"><span data-bind="visible: hello"></span></div>')[0]
    view_model = {}
    kb.applyBindings(view_model, app_el)
    equal(view_model.hello, true, "ViewModel Object: hello is true")
    ko.removeNode(app_el)

    # Mix of things
    app_el = $("""
        <div data-bind="inject: {new_context: {view_model: SuperClass, sub_class: {view_model: SubClass}, created: {create: appCreate}, hello: true, embed: {hello: true}}}">
          <span data-bind="visible: new_context.super_class"></span>
          <span data-bind="visible: new_context.sub_class.sub_class"></span>
          <span data-bind="visible: new_context.created.app_create"></span>
          <span data-bind="visible: new_context.embed.hello"></span>
          <span data-bind="visible: new_context.hello"></span>
        </div>""")[0]
    view_model = {}
    kb.applyBindings(view_model, app_el)
    ok((view_model.new_context instanceof SuperClass), "Mix: is SuperClass")
    equal(view_model.new_context.super_class, true, "Mix: has super_class")
    ok((view_model.new_context.sub_class instanceof SubClass), "Mix: is SubClass")
    equal(view_model.new_context.sub_class.sub_class, true, "Mix: has sub_class")
    ok(not (view_model.new_context.created instanceof appCreate), "Mix: is not create")
    equal(view_model.new_context.created.app_create, true, "Mix: has create")
    equal(view_model.new_context.embed.hello, true, "Mix: embedded hello is true")
    equal(view_model.new_context.hello, true, "Mix: hello is true")
    ko.removeNode(app_el)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
)