var assert = assert || (typeof require === 'function' ? require('chai').assert : undefined);
const root = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : this;

describe('inject @quick @inject', () => {
  let kb = root != null ? root.kb : undefined; try { if (!kb) { kb = typeof require === 'function' ? require('knockback') : undefined; } } catch (error) {} try { if (!kb) { kb = typeof require === 'function' ? require('../../../knockback') : undefined; } } catch (error1) {}
  const { _, ko, $ } = kb;
  if (!$) return; // no jquery

  it('TEST DEPENDENCY MISSING', (done) => {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!kb.Model, 'kb.Model');
    assert.ok(!!kb.Collection, 'kb.Collection');
    assert.ok(!!kb, 'kb');
    return done();
  });

  root.kb = kb;
  root.appCreate = view_model => view_model.app_create = true;

  root.app = function (view_model) {
    this.app = true;
    kb.statistics.register('app', this);
    this.destroy = () => kb.statistics.unregister('app', this);
    return this; // return self
  };

  root.appCallbacks = function (view_model) {
    this.app = true;
    kb.statistics.register('app', this);
    this.destroy = () => kb.statistics.unregister('app', this);

    this.beforeBinding = () => this.before_was_called = true;
    this.afterBinding = () => this.after_was_called = true;

    return this; // return self
  };

  root.SuperClass = class SuperClass {
    constructor() {
      this.super_class = true;
      kb.statistics.register('SuperClass', this);
    }
    destroy() {
      return kb.statistics.unregister('SuperClass', this);
    }
  };

  root.SubClass = class SubClass extends SuperClass {
    constructor() {
      super(...arguments);
      this.sub_class = true;
    }
  };

  it('1. kb-inject', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats

    // no attributes
    let inject_el = $('<div kb-inject></div>')[0];
    $('body').append(inject_el);
    let injected = kb.injectViewModels();
    assert.equal(injected[0].el, inject_el, 'no attr: app was injected');
    ko.removeNode(inject_el);

    // properties
    root.hello = true;
    inject_el = $('<div kb-inject="hello: hello"><span data-bind="visible: hello"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    let { view_model } = injected[0];
    assert.equal(injected[0].el, inject_el, 'Properties: app was injected');
    assert.equal(view_model.hello, root.hello, 'Properties: hello was injected');
    assert.equal(view_model.hello, true, 'Properties: hello is true');
    ko.removeNode(inject_el);

    // ViewModel solo
    inject_el = $('<div kb-inject="app"><span data-bind="visible: app"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    ({ view_model } = injected[0]);
    assert.equal(injected[0].el, inject_el, 'ViewModel Solo: app was injected');
    assert.ok(view_model instanceof root.app, 'ViewModel Solo: view_model type app');
    assert.equal(view_model.app, true, 'ViewModel Solo: app is true');
    ko.removeNode(inject_el);

    // mutiliple ViewModel solos
    inject_el = $(`\
<div>
  <div kb-inject="app"><span data-bind="visible: app"></span></div>
  <div kb-inject="app"><span data-bind="visible: app"></span></div>
</div>`)[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    ({ view_model } = injected[0]);
    const view_model1 = injected[1].view_model;
    assert.equal(injected[0].el, inject_el.children[0], 'ViewModel Solo: app was injected');
    assert.ok(view_model instanceof root.app, 'ViewModel Solo: view_model type app');
    assert.equal(view_model.app, true, 'ViewModel Solo: app is true');
    assert.equal(injected[1].el, inject_el.children[1], 'ViewModel Solo: app was injected');
    assert.ok(injected[1].view_model instanceof root.app, 'ViewModel Solo: view_model type app');
    assert.equal(injected[1].view_model.app, true, 'ViewModel Solo: app is true');
    ko.removeNode(inject_el);

    // Create function with callbacks
    inject_el = $('<div kb-inject="create: appCreate"><span data-bind="visible: app_create"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    ({ view_model } = injected[0]);
    assert.equal(injected[0].el, inject_el, 'Create: app was injected');
    assert.ok(!(view_model instanceof root.appCreate), 'Create: view_model not type appCreate');
    assert.ok(_.isObject(view_model), 'Create: view_model is basic type');
    assert.equal(view_model.app_create, true, 'Create + Callbacks: view model was injected');
    ko.removeNode(inject_el);

    // ViewModel property
    inject_el = $('<div kb-inject="view_model: app"><span data-bind="visible: app"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    ({ view_model } = injected[0]);
    assert.equal(injected[0].el, inject_el, 'ViewModel Property: app was injected');
    assert.ok(view_model instanceof root.app, 'ViewModel Property: view_model type app');
    assert.equal(view_model.app, true, 'ViewModel Property: hello is true');
    ko.removeNode(inject_el);

    // ViewModel property and Create should take ViewModel
    inject_el = $('<div kb-inject="view_model: app, create: appCreate"><span data-bind="visible: app"></span><span data-bind="visible: app_create"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    ({ view_model } = injected[0]);
    assert.equal(injected[0].el, inject_el, 'Create: app was injected');
    assert.ok(!(view_model instanceof root.appCreate), 'Create: view_model not type appCreate');
    assert.ok(_.isObject(view_model), 'Create: view_model is basic type');
    assert.ok(view_model instanceof root.app, 'ViewModel Property: view_model type app');
    assert.equal(view_model.app, true, 'Create + Callbacks: view model was injected - ViewModel');
    assert.equal(view_model.app_create, true, 'Create + Callbacks: view model was injected - ViewModel, Create');
    ko.removeNode(inject_el);

    // Create and ViewModel property should take ViewModel
    inject_el = $('<div kb-inject="create: appCreate, view_model: app"><span data-bind="visible: app"></span><span data-bind="visible: app_create"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    ({ view_model } = injected[0]);
    assert.equal(injected[0].el, inject_el, 'Create: app was injected');
    assert.ok(!(view_model instanceof root.appCreate), 'Create: view_model not type appCreate');
    assert.ok(_.isObject(view_model), 'Create: view_model is basic type');
    assert.ok(view_model instanceof root.app, 'ViewModel Property: view_model type app');
    assert.equal(view_model.app, true, 'Create + Callbacks: view model was injected - ViewModel');
    assert.equal(view_model.app_create, true, 'Create + Callbacks: view model was injected - Create, ViewModel');
    ko.removeNode(inject_el);

    // ViewModel Object
    inject_el = $('<div kb-inject="hello: true"><span data-bind="visible: hello"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    ({ view_model } = injected[0]);
    assert.equal(injected[0].el, inject_el, 'ViewModel Object: app was injected');
    assert.equal(view_model.hello, true, 'ViewModel Object: hello is true');
    ko.removeNode(inject_el);

    // Mix of things
    inject_el = $(`\
<div kb-inject="view_model: SuperClass, sub_class: {view_model: SubClass}, created: {create: appCreate}, hello: true, embed: {hello: true}">
  <span data-bind="visible: super_class"></span>
  <span data-bind="visible: sub_class.sub_class"></span>
  <span data-bind="visible: created.app_create"></span>
  <span data-bind="visible: embed.hello"></span>
  <span data-bind="visible: hello"></span>
</div>`)[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    ({ view_model } = injected[0]);
    assert.equal(injected[0].el, inject_el, 'ViewModel Object: app was injected');
    assert.ok((view_model instanceof SuperClass), 'Mix: is SuperClass');
    assert.equal(view_model.super_class, true, 'Mix: has super_class');
    assert.ok((view_model.sub_class instanceof SubClass), 'Mix: is SubClass');
    assert.equal(view_model.sub_class.sub_class, true, 'Mix: has sub_class');
    assert.ok(!(view_model.created instanceof appCreate), 'Mix: is not create');
    assert.equal(view_model.created.app_create, true, 'Mix: has create');
    assert.equal(view_model.embed.hello, true, 'Mix: embedded hello is true');
    assert.equal(view_model.hello, true, 'Mix: hello is true');
    ko.removeNode(inject_el);

    // Properties with callbacks
    let before_was_called = false;
    let after_was_called = false;
    root.beforeBinding = view_model => before_was_called = view_model.hello;
    root.afterBinding = view_model => after_was_called = view_model.hello;
    inject_el = $('<div kb-inject="hello: true, options: {beforeBinding: beforeBinding, afterBinding: afterBinding}"><span data-bind="visible: hello"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    ({ view_model } = injected[0]);
    assert.equal(injected[0].el, inject_el, 'Properties + Callbacks: app was injected');
    assert.equal(view_model.hello, true, 'Properties + Callbacks: view model was injected');
    assert.ok(before_was_called, 'Properties + Callbacks: before_was_called was called');
    assert.ok(after_was_called, 'Properties + Callbacks: after_was_called was called');
    ko.removeNode(inject_el);

    // Create function with callbacks
    before_was_called = false;
    after_was_called = false;
    root.beforeBinding = view_model => before_was_called = view_model.hello;
    root.afterBinding = view_model => after_was_called = view_model.hello;
    inject_el = $('<div kb-inject="create: appCreate, hello: true, beforeBinding: beforeBinding, afterBinding: afterBinding"><span data-bind="visible: app_create"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    ({ view_model } = injected[0]);
    assert.equal(injected[0].el, inject_el, 'Create + Callbacks: app was injected');
    assert.ok(!(view_model instanceof root.appCreate), 'Create: view_model not type appCreate');
    assert.ok(_.isObject(view_model), 'Create: view_model is basic type');
    assert.equal(view_model.app_create, true, 'Create + Callbacks: view model was injected');
    assert.ok(before_was_called, 'Create + Callbacks: before_was_called was called');
    assert.ok(after_was_called, 'Create + Callbacks: after_was_called was called');
    ko.removeNode(inject_el);

    // ViewModel property with callbacks
    inject_el = $('<div kb-inject="view_model: appCallbacks, hello: true"><span data-bind="visible: app"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    ({ view_model } = injected[0]);
    assert.equal(injected[0].el, inject_el, 'ViewModel Property + Callbacks: app was injected');
    assert.ok((view_model instanceof root.appCallbacks), 'Create: view_model type appCallbacks');
    assert.equal(view_model.app, true, 'ViewModel Property + Callbacks: view model was injected');
    assert.ok(view_model.before_was_called, 'ViewModel Property + Callbacks: before_was_called was called');
    assert.ok(view_model.after_was_called, 'ViewModel Property + Callbacks: after_was_called was called');
    ko.removeNode(inject_el);

    // ViewModel Object with callbacks
    before_was_called = false;
    after_was_called = false;
    root.beforeBinding = view_model => before_was_called = view_model.hello;
    root.afterBinding = view_model => after_was_called = view_model.hello;
    inject_el = $('<div kb-inject="hello: true, options: {beforeBinding: beforeBinding, afterBinding: afterBinding}"><span data-bind="visible: hello"></span></div>')[0];
    $('body').append(inject_el);
    injected = kb.injectViewModels();
    ({ view_model } = injected[0]);
    assert.equal(injected[0].el, inject_el, 'ViewModel Object + Callbacks: app was injected');
    assert.equal(view_model.hello, true, 'ViewModel Object + Callbacks: view model was injected');
    assert.ok(before_was_called, 'ViewModel Object + Callbacks: before_was_called was called');
    assert.ok(after_was_called, 'ViewModel Object + Callbacks: after_was_called was called');
    ko.removeNode(inject_el);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });

  it('2. data-bind inject recusive', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const previous = kb.RECUSIVE_AUTO_INJECT; kb.RECUSIVE_AUTO_INJECT = true;

    let was_auto_injected = 0;
    root.AutoInject = class AutoInject {
      constructor() {
        was_auto_injected++;
      }
      destroy() {
        return was_auto_injected--;
      }
    };

    // no attributes
    assert.ok(!was_auto_injected, 'Not auto injected');
    let inject_el = $('<div kb-inject="AutoInject"></div>')[0];
    ko.applyBindings({}, inject_el);
    assert.equal(was_auto_injected, 1, 'Was auto injected');
    ko.removeNode(inject_el);
    assert.ok(!was_auto_injected, 'Not auto injected');

    // no attributes
    assert.ok(!was_auto_injected, 'Not auto injected');
    inject_el = $('<div kb-inject="AutoInject"><div><div kb-inject="AutoInject"></div></div></div>')[0];
    ko.applyBindings({}, inject_el);
    assert.equal(was_auto_injected, 2, 'Was auto injected');
    ko.removeNode(inject_el);
    assert.ok(!was_auto_injected, 'Not auto injected');

    kb.RECUSIVE_AUTO_INJECT = previous;

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });

  return it('3. data-bind inject', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats

    // properties
    let inject_el = $('<div data-bind="inject: {hello: true}"><span data-bind="visible: hello"></span></div>')[0];
    let view_model = {};
    kb.applyBindings(view_model, inject_el);
    assert.equal(view_model.hello, true, 'Properties: hello is true');
    ko.removeNode(inject_el);

    // Create solo
    inject_el = $('<div data-bind="inject: appCreate"><span data-bind="visible: app"></span></div>')[0];
    view_model = {};
    kb.applyBindings(view_model, inject_el);
    assert.equal(view_model.app_create, true, 'Create property: app_create is true');
    ko.removeNode(inject_el);

    // Create property
    inject_el = $('<div data-bind="inject: {create: appCreate}"><span data-bind="visible: app_create"></span></div>')[0];
    view_model = {};
    kb.applyBindings(view_model, inject_el);
    assert.equal(view_model.app_create, true, 'Create property: app_create is true');
    ko.removeNode(inject_el);

    // Function
    root.testFunction = view_model => view_model.hello = true;
    inject_el = $('<div data-bind="inject: {embedded: testFunction}"><span data-bind="click: embedded.testFunction"></span></div>')[0];
    view_model = {};
    kb.applyBindings(view_model, inject_el);
    assert.equal(view_model.embedded, root.testFunction, 'Function: is type testFunction');
    ko.removeNode(inject_el);

    // Create function
    inject_el = $('<div data-bind="inject: {embedded: {create: appCreate}}"><span data-bind="visible: embedded.app_create"></span></div>')[0];
    view_model = {};
    kb.applyBindings(view_model, inject_el);
    assert.ok(!(view_model.embedded instanceof root.appCreate), 'Create: view_model not type appCreate');
    assert.ok(_.isObject(view_model.embedded), 'Create: view_model is basic type');
    assert.equal(view_model.embedded.app_create, true, 'Create: view model was injected');
    ko.removeNode(inject_el);

    // ViewModel property
    inject_el = $('<div data-bind="inject: {embedded: {view_model: app}}"><span data-bind="visible: embedded.app"></span></div>')[0];
    view_model = {};
    kb.applyBindings(view_model, inject_el);
    assert.ok(view_model.embedded instanceof root.app, 'ViewModel Property: view_model type app');
    assert.equal(view_model.embedded.app, true, 'ViewModel Property: hello is true');
    ko.removeNode(inject_el);

    // ViewModel Object
    inject_el = $('<div data-bind="inject: {hello: true}"><span data-bind="visible: hello"></span></div>')[0];
    view_model = {};
    kb.applyBindings(view_model, inject_el);
    assert.equal(view_model.hello, true, 'ViewModel Object: hello is true');
    ko.removeNode(inject_el);

    // Mix of things
    inject_el = $(`\
<div data-bind="inject: {new_context: {view_model: SuperClass, sub_class: {view_model: SubClass}, created: {create: appCreate}, hello: true, embed: {hello: true}}}">
  <span data-bind="visible: new_context.super_class"></span>
  <span data-bind="visible: new_context.sub_class.sub_class"></span>
  <span data-bind="visible: new_context.created.app_create"></span>
  <span data-bind="visible: new_context.embed.hello"></span>
  <span data-bind="visible: new_context.hello"></span>
</div>`)[0];
    view_model = {};
    kb.applyBindings(view_model, inject_el);
    assert.ok((view_model.new_context instanceof SuperClass), 'Mix: is SuperClass');
    assert.equal(view_model.new_context.super_class, true, 'Mix: has super_class');
    assert.ok((view_model.new_context.sub_class instanceof SubClass), 'Mix: is SubClass');
    assert.equal(view_model.new_context.sub_class.sub_class, true, 'Mix: has sub_class');
    assert.ok(!(view_model.new_context.created instanceof appCreate), 'Mix: is not create');
    assert.equal(view_model.new_context.created.app_create, true, 'Mix: has create');
    assert.equal(view_model.new_context.embed.hello, true, 'Mix: embedded hello is true');
    assert.equal(view_model.new_context.hello, true, 'Mix: hello is true');
    ko.removeNode(inject_el);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });
});
