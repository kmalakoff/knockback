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
    app_el = $('<div kb-app="hello: hello"></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "Properties: app was injected")
    equal(apps[0].view_model.hello, window.hello, "Properties: hello was injected")
    equal(apps[0].view_model.hello, true, "Properties: hello is true")
    ko.removeNode(app_el)

    # ViewModel solo
    window.appCreate = (view_model) -> @hello = true; return @ # return self
    app_el = $('<div kb-app="appCreate"></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "ViewModel Solo: app was injected")
    ok(apps[0].view_model instanceof window.appCreate, "ViewModel Solo: view_model type appCreate")
    equal(apps[0].view_model.hello, true, "ViewModel Solo: hello is true")
    ko.removeNode(app_el)

    # Create function with callbacks
    window.appCreate = (view_model) -> view_model.hello = true
    app_el = $('<div kb-app="create: appCreate"></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "Create: app was injected")
    ok(not (apps[0].view_model instanceof window.appCreate), "Create: view_model not type appCreate")
    ok(_.isObject(apps[0].view_model), "Create: view_model is basic type")
    equal(apps[0].view_model.hello, true, "Create + Callbacks: view model was injected")
    ko.removeNode(app_el)

    # ViewModel property
    window.appCreate = (view_model) -> @hello = true; return @ # return self
    app_el = $('<div kb-app="view_model: appCreate"></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "ViewModel Property: app was injected")
    ok(apps[0].view_model instanceof window.appCreate, "ViewModel Property: view_model type appCreate")
    equal(apps[0].view_model.hello, true, "ViewModel Property: hello is true")
    ko.removeNode(app_el)

    # ViewModel Object
    app_el = $('<div kb-app="view_model: {hello: true}"></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "ViewModel Object: app was injected")
    equal(apps[0].view_model.hello, true, "ViewModel Object: hello is true")
    ko.removeNode(app_el)

    # Properties with callbacks
    before_was_called = false
    after_was_called = false
    window.beforeBinding = (view_model) -> before_was_called = view_model.hello
    window.afterBinding = (view_model) -> after_was_called = view_model.hello
    app_el = $('<div kb-app="hello: true, options: {beforeBinding: beforeBinding, afterBinding: afterBinding}"></div>')[0]
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
    window.appCreate = (view_model) -> view_model.hello = true
    window.beforeBinding = (view_model) -> before_was_called = view_model.hello
    window.afterBinding = (view_model) -> after_was_called = view_model.hello
    app_el = $('<div kb-app="create: appCreate, options: {beforeBinding: beforeBinding, afterBinding: afterBinding}"></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "Create + Callbacks: app was injected")
    ok(not (apps[0].view_model instanceof window.appCreate), "Create: view_model not type appCreate")
    ok(_.isObject(apps[0].view_model), "Create: view_model is basic type")
    equal(apps[0].view_model.hello, true, "Create + Callbacks: view model was injected")
    ok(before_was_called, "Create + Callbacks: before_was_called was called")
    ok(after_was_called, "Create + Callbacks: after_was_called was called")
    ko.removeNode(app_el)

    # ViewModel property with callbacks
    before_was_called = false
    after_was_called = false
    window.appCreate = (view_model) -> @hello = true; return @ # return self
    window.beforeBinding = (view_model) -> before_was_called = view_model.hello
    window.afterBinding = (view_model) -> after_was_called = view_model.hello
    app_el = $('<div kb-app="view_model: appCreate, options: {beforeBinding: beforeBinding, afterBinding: afterBinding}"></div>')[0]
    $('body').append(app_el)
    apps = kb.injectApps()
    equal(apps[0].el, app_el, "ViewModel Property + Callbacks: app was injected")
    ok((apps[0].view_model instanceof window.appCreate), "Create: view_model not type appCreate")
    equal(apps[0].view_model.hello, true, "ViewModel Property + Callbacks: view model was injected")
    ok(before_was_called, "ViewModel Property + Callbacks: before_was_called was called")
    ok(after_was_called, "ViewModel Property + Callbacks: after_was_called was called")
    ko.removeNode(app_el)

    # ViewModel Object with callbacks
    before_was_called = false
    after_was_called = false
    window.appCreate = (view_model) -> @hello = true; return @ # return self
    window.beforeBinding = (view_model) -> before_was_called = view_model.hello
    window.afterBinding = (view_model) -> after_was_called = view_model.hello
    app_el = $('<div kb-app="view_model: {hello: true}, options: {beforeBinding: beforeBinding, afterBinding: afterBinding}"></div>')[0]
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
    app_el = $('<div data-bind="inject: {hello: true}"></div>')[0]
    view_model = {}
    kb.applyBindings(view_model, app_el)
    equal(view_model.hello, true, "Properties: hello is true")
    ko.removeNode(app_el)

    # ViewModel solo
    window.appCreate = (view_model) -> view_model.hello = true
    app_el = $('<div data-bind="inject: appCreate"></div>')[0]
    view_model = {}
    kb.applyBindings(view_model, app_el)
    equal(view_model.hello, true, "ViewModel Solo: hello is true")
    ko.removeNode(app_el)

    # Function
    window.testFunction = (view_model) -> view_model.hello = true
    app_el = $('<div data-bind="inject: {embedded: testFunction}"></div>')[0]
    view_model = {}
    kb.applyBindings(view_model, app_el)
    equal(view_model.embedded, window.testFunction, "Function: is type testFunction")
    ko.removeNode(app_el)

    # Create function
    window.appCreate = (view_model) -> view_model.hello = true
    app_el = $('<div data-bind="inject: {embedded: {create: appCreate}}"></div>')[0]
    view_model = {}
    kb.applyBindings(view_model, app_el)
    ok(not (view_model.embedded instanceof window.appCreate), "Create: view_model not type appCreate")
    ok(_.isObject(view_model.embedded), "Create: view_model is basic type")
    equal(view_model.embedded.hello, true, "Create: view model was injected")
    ko.removeNode(app_el)

    # ViewModel property
    window.appCreate = (view_model) -> @hello = true; return @ # return self
    app_el = $('<div data-bind="inject: {embedded: {view_model: appCreate}}"></div>')[0]
    view_model = {}
    kb.applyBindings(view_model, app_el)
    ok(view_model.embedded instanceof window.appCreate, "ViewModel Property: view_model type appCreate")
    equal(view_model.embedded.hello, true, "ViewModel Property: hello is true")
    ko.removeNode(app_el)

    # ViewModel Object
    app_el = $('<div data-bind="inject: {view_model: {hello: true}}"></div>')[0]
    view_model = {}
    kb.applyBindings(view_model, app_el)
    equal(view_model.hello, true, "ViewModel Object: hello is true")
    ko.removeNode(app_el)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
)