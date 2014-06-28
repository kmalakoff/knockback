var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

describe('knockback-inject.js', function() {
  var kb, ko, _;
  ko = window.ko || (typeof require === "function" ? require('knockout') : void 0);
  kb = window.kb || (typeof require === "function" ? require('knockback') : void 0);
  _ = kb._;
  it('TEST DEPENDENCY MISSING', function(done) {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!kb.Model, 'kb.Model');
    assert.ok(!!kb.Collection, 'kb.Collection');
    assert.ok(!!kb, 'kb');
    return done();
  });
  window.appCreate = function(view_model) {
    return view_model.app_create = true;
  };
  window.app = function(view_model) {
    this.app = true;
    kb.statistics.register('app', this);
    this.destroy = (function(_this) {
      return function() {
        return kb.statistics.unregister('app', _this);
      };
    })(this);
    return this;
  };
  window.appCallbacks = function(view_model) {
    this.app = true;
    kb.statistics.register('app', this);
    this.destroy = (function(_this) {
      return function() {
        return kb.statistics.unregister('app', _this);
      };
    })(this);
    this.beforeBinding = (function(_this) {
      return function() {
        return _this.before_was_called = true;
      };
    })(this);
    this.afterBinding = (function(_this) {
      return function() {
        return _this.after_was_called = true;
      };
    })(this);
    return this;
  };
  window.SuperClass = (function() {
    function SuperClass() {
      this.super_class = true;
      kb.statistics.register('SuperClass', this);
    }

    SuperClass.prototype.destroy = function() {
      return kb.statistics.unregister('SuperClass', this);
    };

    return SuperClass;

  })();
  window.SubClass = (function(_super) {
    __extends(SubClass, _super);

    function SubClass() {
      SubClass.__super__.constructor.apply(this, arguments);
      this.sub_class = true;
    }

    return SubClass;

  })(SuperClass);
  it('1. kb-inject', function(done) {
    var after_was_called, before_was_called, inject_el, injected, view_model, view_model1;
    kb.statistics = new kb.Statistics();
    inject_el = $('<div kb-inject></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    assert.equal(injected[0].el, inject_el, "no attr: app was injected");
    ko.removeNode(inject_el);
    window.hello = true;
    inject_el = $('<div kb-inject="hello: hello"><span data-bind="visible: hello"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    view_model = injected[0].view_model;
    assert.equal(injected[0].el, inject_el, "Properties: app was injected");
    assert.equal(view_model.hello, window.hello, "Properties: hello was injected");
    assert.equal(view_model.hello, true, "Properties: hello is true");
    ko.removeNode(inject_el);
    inject_el = $('<div kb-inject="app"><span data-bind="visible: app"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    view_model = injected[0].view_model;
    assert.equal(injected[0].el, inject_el, "ViewModel Solo: app was injected");
    assert.ok(view_model instanceof window.app, "ViewModel Solo: view_model type app");
    assert.equal(view_model.app, true, "ViewModel Solo: app is true");
    ko.removeNode(inject_el);
    inject_el = $("<div>\n  <div kb-inject=\"app\"><span data-bind=\"visible: app\"></span></div>\n  <div kb-inject=\"app\"><span data-bind=\"visible: app\"></span></div>\n</div>")[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    view_model = injected[0].view_model;
    view_model1 = injected[1].view_model;
    assert.equal(injected[0].el, inject_el.children[0], "ViewModel Solo: app was injected");
    assert.ok(view_model instanceof window.app, "ViewModel Solo: view_model type app");
    assert.equal(view_model.app, true, "ViewModel Solo: app is true");
    assert.equal(injected[1].el, inject_el.children[1], "ViewModel Solo: app was injected");
    assert.ok(injected[1].view_model instanceof window.app, "ViewModel Solo: view_model type app");
    assert.equal(injected[1].view_model.app, true, "ViewModel Solo: app is true");
    ko.removeNode(inject_el);
    inject_el = $('<div kb-inject="create: appCreate"><span data-bind="visible: app_create"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    view_model = injected[0].view_model;
    assert.equal(injected[0].el, inject_el, "Create: app was injected");
    assert.ok(!(view_model instanceof window.appCreate), "Create: view_model not type appCreate");
    assert.ok(_.isObject(view_model), "Create: view_model is basic type");
    assert.equal(view_model.app_create, true, "Create + Callbacks: view model was injected");
    ko.removeNode(inject_el);
    inject_el = $('<div kb-inject="view_model: app"><span data-bind="visible: app"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    view_model = injected[0].view_model;
    assert.equal(injected[0].el, inject_el, "ViewModel Property: app was injected");
    assert.ok(view_model instanceof window.app, "ViewModel Property: view_model type app");
    assert.equal(view_model.app, true, "ViewModel Property: hello is true");
    ko.removeNode(inject_el);
    inject_el = $('<div kb-inject="view_model: app, create: appCreate"><span data-bind="visible: app"></span><span data-bind="visible: app_create"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    view_model = injected[0].view_model;
    assert.equal(injected[0].el, inject_el, "Create: app was injected");
    assert.ok(!(view_model instanceof window.appCreate), "Create: view_model not type appCreate");
    assert.ok(_.isObject(view_model), "Create: view_model is basic type");
    assert.ok(view_model instanceof window.app, "ViewModel Property: view_model type app");
    assert.equal(view_model.app, true, "Create + Callbacks: view model was injected - ViewModel");
    assert.equal(view_model.app_create, true, "Create + Callbacks: view model was injected - ViewModel, Create");
    ko.removeNode(inject_el);
    inject_el = $('<div kb-inject="create: appCreate, view_model: app"><span data-bind="visible: app"></span><span data-bind="visible: app_create"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    view_model = injected[0].view_model;
    assert.equal(injected[0].el, inject_el, "Create: app was injected");
    assert.ok(!(view_model instanceof window.appCreate), "Create: view_model not type appCreate");
    assert.ok(_.isObject(view_model), "Create: view_model is basic type");
    assert.ok(view_model instanceof window.app, "ViewModel Property: view_model type app");
    assert.equal(view_model.app, true, "Create + Callbacks: view model was injected - ViewModel");
    assert.equal(view_model.app_create, true, "Create + Callbacks: view model was injected - Create, ViewModel");
    ko.removeNode(inject_el);
    inject_el = $('<div kb-inject="hello: true"><span data-bind="visible: hello"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    view_model = injected[0].view_model;
    assert.equal(injected[0].el, inject_el, "ViewModel Object: app was injected");
    assert.equal(view_model.hello, true, "ViewModel Object: hello is true");
    ko.removeNode(inject_el);
    inject_el = $("<div kb-inject=\"view_model: SuperClass, sub_class: {view_model: SubClass}, created: {create: appCreate}, hello: true, embed: {hello: true}\">\n  <span data-bind=\"visible: super_class\"></span>\n  <span data-bind=\"visible: sub_class.sub_class\"></span>\n  <span data-bind=\"visible: created.app_create\"></span>\n  <span data-bind=\"visible: embed.hello\"></span>\n  <span data-bind=\"visible: hello\"></span>\n</div>")[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    view_model = injected[0].view_model;
    assert.equal(injected[0].el, inject_el, "ViewModel Object: app was injected");
    assert.ok(view_model instanceof SuperClass, "Mix: is SuperClass");
    assert.equal(view_model.super_class, true, "Mix: has super_class");
    assert.ok(view_model.sub_class instanceof SubClass, "Mix: is SubClass");
    assert.equal(view_model.sub_class.sub_class, true, "Mix: has sub_class");
    assert.ok(!(view_model.created instanceof appCreate), "Mix: is not create");
    assert.equal(view_model.created.app_create, true, "Mix: has create");
    assert.equal(view_model.embed.hello, true, "Mix: embedded hello is true");
    assert.equal(view_model.hello, true, "Mix: hello is true");
    ko.removeNode(inject_el);
    before_was_called = false;
    after_was_called = false;
    window.beforeBinding = function(view_model) {
      return before_was_called = view_model.hello;
    };
    window.afterBinding = function(view_model) {
      return after_was_called = view_model.hello;
    };
    inject_el = $('<div kb-inject="hello: true, options: {beforeBinding: beforeBinding, afterBinding: afterBinding}"><span data-bind="visible: hello"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    view_model = injected[0].view_model;
    assert.equal(injected[0].el, inject_el, "Properties + Callbacks: app was injected");
    assert.equal(view_model.hello, true, "Properties + Callbacks: view model was injected");
    assert.ok(before_was_called, "Properties + Callbacks: before_was_called was called");
    assert.ok(after_was_called, "Properties + Callbacks: after_was_called was called");
    ko.removeNode(inject_el);
    before_was_called = false;
    after_was_called = false;
    window.beforeBinding = function(view_model) {
      return before_was_called = view_model.hello;
    };
    window.afterBinding = function(view_model) {
      return after_was_called = view_model.hello;
    };
    inject_el = $('<div kb-inject="create: appCreate, hello: true, beforeBinding: beforeBinding, afterBinding: afterBinding"><span data-bind="visible: app_create"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    view_model = injected[0].view_model;
    assert.equal(injected[0].el, inject_el, "Create + Callbacks: app was injected");
    assert.ok(!(view_model instanceof window.appCreate), "Create: view_model not type appCreate");
    assert.ok(_.isObject(view_model), "Create: view_model is basic type");
    assert.equal(view_model.app_create, true, "Create + Callbacks: view model was injected");
    assert.ok(before_was_called, "Create + Callbacks: before_was_called was called");
    assert.ok(after_was_called, "Create + Callbacks: after_was_called was called");
    ko.removeNode(inject_el);
    inject_el = $('<div kb-inject="view_model: appCallbacks, hello: true"><span data-bind="visible: app"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    view_model = injected[0].view_model;
    assert.equal(injected[0].el, inject_el, "ViewModel Property + Callbacks: app was injected");
    assert.ok(view_model instanceof window.appCallbacks, "Create: view_model type appCallbacks");
    assert.equal(view_model.app, true, "ViewModel Property + Callbacks: view model was injected");
    assert.ok(view_model.before_was_called, "ViewModel Property + Callbacks: before_was_called was called");
    assert.ok(view_model.after_was_called, "ViewModel Property + Callbacks: after_was_called was called");
    ko.removeNode(inject_el);
    before_was_called = false;
    after_was_called = false;
    window.beforeBinding = function(view_model) {
      return before_was_called = view_model.hello;
    };
    window.afterBinding = function(view_model) {
      return after_was_called = view_model.hello;
    };
    inject_el = $('<div kb-inject="hello: true, options: {beforeBinding: beforeBinding, afterBinding: afterBinding}"><span data-bind="visible: hello"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    view_model = injected[0].view_model;
    assert.equal(injected[0].el, inject_el, "ViewModel Object + Callbacks: app was injected");
    assert.equal(view_model.hello, true, "ViewModel Object + Callbacks: view model was injected");
    assert.ok(before_was_called, "ViewModel Object + Callbacks: before_was_called was called");
    assert.ok(after_was_called, "ViewModel Object + Callbacks: after_was_called was called");
    ko.removeNode(inject_el);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('2. data-bind inject recusive', function(done) {
    var inject_el, previous, was_auto_injected;
    kb.statistics = new kb.Statistics();
    previous = kb.RECUSIVE_AUTO_INJECT;
    kb.RECUSIVE_AUTO_INJECT = true;
    was_auto_injected = 0;
    window.AutoInject = (function() {
      function AutoInject() {
        was_auto_injected++;
      }

      AutoInject.prototype.destroy = function() {
        return was_auto_injected--;
      };

      return AutoInject;

    })();
    assert.ok(!was_auto_injected, "Not auto injected");
    inject_el = $('<div kb-inject="AutoInject"></div>')[0];
    ko.applyBindings({}, inject_el);
    assert.equal(was_auto_injected, 1, "Was auto injected");
    ko.removeNode(inject_el);
    assert.ok(!was_auto_injected, "Not auto injected");
    assert.ok(!was_auto_injected, "Not auto injected");
    inject_el = $('<div kb-inject="AutoInject"><div><div kb-inject="AutoInject"></div></div></div>')[0];
    ko.applyBindings({}, inject_el);
    assert.equal(was_auto_injected, 2, "Was auto injected");
    ko.removeNode(inject_el);
    assert.ok(!was_auto_injected, "Not auto injected");
    kb.RECUSIVE_AUTO_INJECT = previous;
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  return it('3. data-bind inject', function(done) {
    var inject_el, view_model;
    kb.statistics = new kb.Statistics();
    inject_el = $('<div data-bind="inject: {hello: true}"><span data-bind="visible: hello"></span></div>')[0];
    view_model = {};
    kb.applyBindings(view_model, inject_el);
    assert.equal(view_model.hello, true, "Properties: hello is true");
    ko.removeNode(inject_el);
    inject_el = $('<div data-bind="inject: appCreate"><span data-bind="visible: app"></span></div>')[0];
    view_model = {};
    kb.applyBindings(view_model, inject_el);
    assert.equal(view_model.app_create, true, "Create property: app_create is true");
    ko.removeNode(inject_el);
    inject_el = $('<div data-bind="inject: {create: appCreate}"><span data-bind="visible: app_create"></span></div>')[0];
    view_model = {};
    kb.applyBindings(view_model, inject_el);
    assert.equal(view_model.app_create, true, "Create property: app_create is true");
    ko.removeNode(inject_el);
    window.testFunction = function(view_model) {
      return view_model.hello = true;
    };
    inject_el = $('<div data-bind="inject: {embedded: testFunction}"><span data-bind="click: embedded.testFunction"></span></div>')[0];
    view_model = {};
    kb.applyBindings(view_model, inject_el);
    assert.equal(view_model.embedded, window.testFunction, "Function: is type testFunction");
    ko.removeNode(inject_el);
    inject_el = $('<div data-bind="inject: {embedded: {create: appCreate}}"><span data-bind="visible: embedded.app_create"></span></div>')[0];
    view_model = {};
    kb.applyBindings(view_model, inject_el);
    assert.ok(!(view_model.embedded instanceof window.appCreate), "Create: view_model not type appCreate");
    assert.ok(_.isObject(view_model.embedded), "Create: view_model is basic type");
    assert.equal(view_model.embedded.app_create, true, "Create: view model was injected");
    ko.removeNode(inject_el);
    inject_el = $('<div data-bind="inject: {embedded: {view_model: app}}"><span data-bind="visible: embedded.app"></span></div>')[0];
    view_model = {};
    kb.applyBindings(view_model, inject_el);
    assert.ok(view_model.embedded instanceof window.app, "ViewModel Property: view_model type app");
    assert.equal(view_model.embedded.app, true, "ViewModel Property: hello is true");
    ko.removeNode(inject_el);
    inject_el = $('<div data-bind="inject: {hello: true}"><span data-bind="visible: hello"></span></div>')[0];
    view_model = {};
    kb.applyBindings(view_model, inject_el);
    assert.equal(view_model.hello, true, "ViewModel Object: hello is true");
    ko.removeNode(inject_el);
    inject_el = $("<div data-bind=\"inject: {new_context: {view_model: SuperClass, sub_class: {view_model: SubClass}, created: {create: appCreate}, hello: true, embed: {hello: true}}}\">\n  <span data-bind=\"visible: new_context.super_class\"></span>\n  <span data-bind=\"visible: new_context.sub_class.sub_class\"></span>\n  <span data-bind=\"visible: new_context.created.app_create\"></span>\n  <span data-bind=\"visible: new_context.embed.hello\"></span>\n  <span data-bind=\"visible: new_context.hello\"></span>\n</div>")[0];
    view_model = {};
    kb.applyBindings(view_model, inject_el);
    assert.ok(view_model.new_context instanceof SuperClass, "Mix: is SuperClass");
    assert.equal(view_model.new_context.super_class, true, "Mix: has super_class");
    assert.ok(view_model.new_context.sub_class instanceof SubClass, "Mix: is SubClass");
    assert.equal(view_model.new_context.sub_class.sub_class, true, "Mix: has sub_class");
    assert.ok(!(view_model.new_context.created instanceof appCreate), "Mix: is not create");
    assert.equal(view_model.new_context.created.app_create, true, "Mix: has create");
    assert.equal(view_model.new_context.embed.hello, true, "Mix: embedded hello is true");
    assert.equal(view_model.new_context.hello, true, "Mix: hello is true");
    ko.removeNode(inject_el);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
});
