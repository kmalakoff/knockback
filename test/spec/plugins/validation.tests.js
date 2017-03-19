const r = typeof require !== 'undefined';
const root = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : this;
let assert = root.assert; try { assert = assert || (r ? require('chai').assert : undefined); } catch (e) { /**/ }

let kb = root.kb; try { kb = kb || (r ? require('knockback') : undefined); } catch (e) { kb = kb || (r ? require('../../../knockback') : undefined); }
const { _, ko } = kb;
const { $ } = root;

describe('validation', () => {
  it('TEST DEPENDENCY MISSING', () => {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!kb.Model, 'kb.Model');
    assert.ok(!!kb.Collection, 'kb.Collection');
    assert.ok(!!kb, 'kb');
  });

  it('kb.valueValidator', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const view_model =
      { value: ko.observable() };

    const validator = kb.valueValidator(view_model.value, { required: kb.valid.required, url: kb.valid.url });
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'required'), 'has required');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'url'), 'has url');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$valid'), 'has $valid');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$error_count'), 'has $error_count');

    assert.ok(validator().required, 'required is invalid');
    assert.ok(validator().url, 'url is invalid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');

    view_model.value('Bob');
    assert.ok(!validator().required, 'required is valid');
    assert.ok(validator().url, 'url is invalid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');

    view_model.value('http://Bob');
    assert.ok(!validator().required, 'required is valid');
    assert.ok(!validator().url, 'url is valid');
    assert.ok(validator().$valid, 'validator is valid');
    assert.ok(!validator().$error_count, 'validator is not invalid');

    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('kb.inputValidator', () => {
    if (!$ || !root.document) return;
    if (!root.kb) { root.kb = kb; } // make kb global for bindings
    kb.statistics = new kb.Statistics(); // turn on stats

    const view_model =
      { name: ko.observable() };

    const el = $('<input type="url" name="name" data-bind="value: name, inject: kb.inputValidator" required>')[0];
    ko.applyBindings(view_model, el);

    const validator = view_model.$name;
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'required'), 'has required');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'url'), 'has url');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$valid'), 'has $valid');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$error_count'), 'has $error_count');

    assert.ok(validator().required, 'required is invalid');
    assert.ok(validator().url, 'url is invalid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');
    assert.ok(validator().$active_error, 'active error exists');

    view_model.name('Bob');
    assert.ok(!validator().required, 'required is valid');
    assert.ok(validator().url, 'url is invalid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');
    assert.ok(validator().$active_error, 'active error exists');

    view_model.name('http://Bob');
    assert.ok(!validator().required, 'required is valid');
    assert.ok(!validator().url, 'url is valid');
    assert.ok(validator().$valid, 'validator is valid');
    assert.ok(!validator().$error_count, 'validator is not invalid');
    assert.ok(!validator().$active_error, 'active error does not exist');

    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('kb.inputValidator with custom validators', () => {
    if (!$ || !root.document) return;
    if (!root.kb) { root.kb = kb; } // make kb global for bindings
    kb.statistics = new kb.Statistics(); // turn on stats

    const view_model =
      { name: ko.observable() };

    root.nameTaken = value => value === 'Bob';
    const el = $('<input type="url" name="name" data-bind="value: name, inject: kb.inputValidator, validations: {unique: nameTaken}" required>')[0];
    ko.applyBindings(view_model, el);

    const validator = view_model.$name;
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'required'), 'has required');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'url'), 'has url');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$valid'), 'has $valid');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$error_count'), 'has $error_count');

    assert.ok(validator().required, 'required is invalid');
    assert.ok(validator().url, 'url is invalid');
    assert.ok(!validator().unique, 'unique is valid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');
    assert.ok(validator().$active_error, 'active error exists');

    view_model.name('Bob');
    assert.ok(!validator().required, 'required is valid');
    assert.ok(validator().url, 'url is invalid');
    assert.ok(validator().unique, 'unique is invalid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');
    assert.ok(validator().$active_error, 'active error exists');

    view_model.name('Fred');
    assert.ok(!validator().required, 'required is valid');
    assert.ok(validator().url, 'url is invalid');
    assert.ok(!validator().unique, 'unique is valid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');
    assert.ok(validator().$active_error, 'active error exists');

    view_model.name('http://Bob');
    assert.ok(!validator().required, 'required is valid');
    assert.ok(!validator().url, 'url is valid');
    assert.ok(!validator().unique, 'unique is valid');
    assert.ok(validator().$valid, 'validator is valid');
    assert.ok(!validator().$error_count, 'validator is not invalid');
    assert.ok(!validator().$active_error, 'active error does not exist');

    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('kb.inputValidator with validation_options', () => {
    if (!$ || !root.document) return;
    if (!root.kb) { root.kb = kb; } // make kb global for bindings
    kb.statistics = new kb.Statistics(); // turn on stats

    let view_model =
      { name: ko.observable() };
    root.disable = ko.observable(true);
    let el = $('<input type="url" name="name" data-bind="value: name, inject: kb.inputValidator, validation_options: {disable: disable, priorities: \'url\'}" required>')[0];
    ko.applyBindings(view_model, el);

    let validator = view_model.$name;
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'required'), 'obs: has required');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'url'), 'obs: has url');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$valid'), 'obs: has $valid');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$error_count'), 'obs: has $error_count');

    assert.ok(!validator().required, 'obs: required is valid');
    assert.ok(!validator().url, 'obs: url is valid');
    assert.ok(validator().$valid, 'obs: validator is valid');
    assert.ok(!validator().$error_count, 'obs: validator is not invalid');
    assert.ok(!validator().$active_error, 'obs: active error does not exist');

    root.disable(false);
    assert.ok(validator().required, 'obs: required is invalid');
    assert.ok(validator().url, 'obs: url is invalid');
    assert.ok(!validator().$valid, 'obs: validator not valid');
    assert.ok(validator().$error_count, 'obs: validator is invalid');
    assert.equal(validator().$active_error, 'url', 'obs: active error is url');

    root.disable(() => true);
    assert.ok(!validator().required, 'obs fn: required is valid');
    assert.ok(!validator().url, 'obs fn: url is valid');
    assert.ok(validator().$valid, 'obs fn: validator is valid');
    assert.ok(!validator().$error_count, 'obs fn: validator is not invalid');
    assert.ok(!validator().$active_error, 'obs fn: error does not exist');

    root.disable(() => false);
    assert.ok(validator().required, 'obs fn: required is invalid');
    assert.ok(validator().url, 'obs fn: url is invalid');
    assert.ok(!validator().$valid, 'obs fn: validator not valid');
    assert.ok(validator().$error_count, 'obs fn: validator is invalid');
    assert.equal(validator().$active_error, 'url', 'obs fn: active error is url');

    kb.release(view_model);

    view_model =
      { name: ko.observable() };
    root.disable = () => true;
    el = $('<input type="url" name="name" data-bind="value: name, inject: kb.inputValidator, validation_options: {disable: disable}" required>')[0];
    ko.applyBindings(view_model, el);

    validator = view_model.$name;
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'required'), 'fn: has required');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'url'), 'fn: has url');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$valid'), 'fn: has $valid');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$error_count'), 'fn: has $error_count');

    assert.ok(!validator().required, 'fn: required is valid');
    assert.ok(!validator().url, 'fn: url is valid');
    assert.ok(validator().$valid, 'fn: validator is valid');
    assert.ok(!validator().$error_count, 'fn: validator is not invalid');
    assert.ok(!validator().$active_error, 'fn: active error does not exist');

    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('kb.formValidator with name', () => {
    if (!$ || !root.document) return;
    if (!root.kb) { root.kb = kb; } // make kb global for bindings
    kb.statistics = new kb.Statistics(); // turn on stats

    const view_model = {
      name: ko.observable(),
      site: ko.observable(),
    };

    const HTML = `\
<form name='my_form' data-bind="inject: kb.formValidator, validation_options: {priorities: ['required', 'url']}">
  <div class="control-group">
    <input type="text" name="name" data-bind="value: name" required>
  </div>
  <div class="control-group">
    <input type="url" name="site" data-bind="value: site" required>
  </div>
</form>\
`;

    const el = $(HTML)[0];
    ko.applyBindings(view_model, el);

    // check name
    let validator = view_model.$my_form.name;
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'required'), 'has required');
    assert.ok(!Object.prototype.hasOwnProperty.call(validator(), 'url'), 'has url');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$valid'), 'has $valid');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$error_count'), 'has $error_count');

    assert.ok(validator().required, 'required is invalid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');
    assert.ok(validator().$active_error, 'active error exists');

    view_model.name('Bob');
    assert.ok(!validator().required, 'required is valid');
    assert.ok(validator().$valid, 'validator valid');
    assert.ok(!validator().$error_count, 'validator is not invalid');
    assert.ok(!validator().$active_error, 'active error does not exist');

    validator = view_model.$my_form.site;
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'required'), 'has required');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'url'), 'has url');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$valid'), 'has $valid');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$error_count'), 'has $error_count');

    assert.ok(validator().required, 'required is invalid');
    assert.ok(validator().url, 'url is invalid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');
    assert.equal(validator().$active_error, 'url', 'active error is url');

    view_model.site('Bob');
    assert.ok(!validator().required, 'required is valid');
    assert.ok(validator().url, 'url is invalid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');
    assert.equal(validator().$active_error, 'url', 'active error is url');

    view_model.site('http://Bob');
    assert.ok(!validator().required, 'required is valid');
    assert.ok(!validator().url, 'url is valid');
    assert.ok(validator().$valid, 'validator is valid');
    assert.ok(!validator().$error_count, 'validator is not invalid');
    assert.ok(!validator().$active_error, 'active error does not exist');

    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('kb.formValidator no name with validation_options', () => {
    if (!$ || !root.document) return;
    if (!root.kb) { root.kb = kb; } // make kb global for bindings
    kb.statistics = new kb.Statistics(); // turn on stats

    const view_model = {
      name: ko.observable(),
      site: ko.observable(),
    };

    const HTML = `\
<form data-bind="inject: kb.formValidator, validation_options: {enable: enable, priorities: 'url'}">
  <div class="control-group">
    <input type="text" name="name" data-bind="value: name" required>
  </div>
  <div class="control-group">
    <input type="url" name="site" data-bind="value: site" required>
  </div>
</form>\
`;

    root.enable = ko.observable(false);
    const el = $(HTML)[0];
    ko.applyBindings(view_model, el);

    // check name
    let validator = view_model.$name;
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'required'), 'has required');
    assert.ok(!Object.prototype.hasOwnProperty.call(validator(), 'url'), 'has url');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$valid'), 'has $valid');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$error_count'), 'has $error_count');

    // disabled
    assert.ok(!validator().required, 'required is valid');
    assert.ok(validator().$valid, 'validator valid');
    assert.ok(!validator().$error_count, 'validator is not invalid');

    // enabled
    root.enable(() => true);
    assert.ok(validator().required, 'required is invalid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');

    view_model.name('Bob');
    assert.ok(!validator().required, 'required is valid');
    assert.ok(validator().$valid, 'validator valid');
    assert.ok(!validator().$error_count, 'validator is not invalid');
    assert.ok(!validator().$active_error, 'active error does not exist');

    validator = view_model.$site;
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'required'), 'has required');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'url'), 'has url');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$valid'), 'has $valid');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$error_count'), 'has $error_count');

    assert.ok(validator().required, 'required is invalid');
    assert.ok(validator().url, 'url is invalid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');
    assert.equal(validator().$active_error, 'url', 'active error is url');

    view_model.site('Bob');
    assert.ok(!validator().required, 'required is valid');
    assert.ok(validator().url, 'url is invalid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');
    assert.equal(validator().$active_error, 'url', 'active error is url');

    view_model.site('http://Bob');
    assert.ok(!validator().required, 'required is valid');
    assert.ok(!validator().url, 'url is valid');
    assert.ok(validator().$valid, 'validator is valid');
    assert.ok(!validator().$error_count, 'validator is not invalid');
    assert.ok(!validator().$active_error, 'active error does not exist');

    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('kb.formValidator with inject and disable', () => {
    if (!$ || !root.document) return;
    if (!root.kb) { root.kb = kb; } // make kb global for bindings
    kb.statistics = new kb.Statistics(); // turn on stats

    root.MyViewModel = kb.ViewModel.extend({
      constructor() {
        const model = new kb.Model({ name: '', site: '' });
        kb.ViewModel.prototype.constructor.call(this, model);
      },
    });

    const HTML = `\
<div kb-inject="MyViewModel">
   <form name="my_form" data-bind="inject: kb.formValidator, validation_options: {disable: disable, priorities: ['url']}">
     <div class="control-group">
      <label>Name</label>
      <input type="text" name="name" data-bind="value: name, valueUpdate: 'keyup'" required>
    </div>
    <div class="control-group">
      <label>Website</label>
      <input type="url" name="site" data-bind="value: site, valueUpdate: 'keyup'" required>
    </div>
  </form>
</div>\
`;

    root.disable = ko.observable(true);
    const inject_el = $(HTML)[0];
    const injected = kb.injectViewModels(inject_el);
    assert.equal(injected[0].el, inject_el, 'app was injected');
    const { view_model } = injected[0];

    // check name
    let validator = view_model.$my_form.name;
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'required'), 'has required');
    assert.ok(!Object.prototype.hasOwnProperty.call(validator(), 'url'), 'has url');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$valid'), 'has $valid');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$error_count'), 'has $error_count');

    // disabled
    assert.ok(!validator().required, 'required is valid');
    assert.ok(validator().$valid, 'validator valid');
    assert.ok(!validator().$error_count, 'validator is not invalid');

    // enabled
    root.disable(() => false);
    assert.ok(validator().required, 'required is invalid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');
    assert.equal(validator().$active_error, 'required', 'active error is required');

    view_model.name('Bob');
    assert.ok(!validator().required, 'required is valid');
    assert.ok(validator().$valid, 'validator valid');
    assert.ok(!validator().$error_count, 'validator is not invalid');
    assert.ok(!validator().$active_error, 'no active error');

    validator = view_model.$my_form.site;
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'required'), 'has required');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'url'), 'has url');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$valid'), 'has $valid');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$error_count'), 'has $error_count');

    assert.ok(validator().required, 'required is invalid');
    assert.ok(validator().url, 'url is invalid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');
    assert.equal(validator().$active_error, 'url', 'active error is url');

    view_model.site('Bob');
    assert.ok(!validator().required, 'required is valid');
    assert.ok(validator().url, 'url is invalid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');
    assert.equal(validator().$active_error, 'url', 'active error is url');

    view_model.site('http://Bob');
    assert.ok(!validator().required, 'required is valid');
    assert.ok(!validator().url, 'url is valid');
    assert.ok(validator().$valid, 'validator is valid');
    assert.ok(!validator().$error_count, 'validator is not invalid');
    assert.ok(!validator().$active_error, 'no active error');

    ko.removeNode(inject_el);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('kb.inputValidator without required', () => {
    if (!$ || !root.document) return;
    if (!root.kb) { root.kb = kb; } // make kb global for bindings
    kb.statistics = new kb.Statistics(); // turn on stats

    const view_model =
      { name: ko.observable() };

    const el = $('<input type="url" name="name" data-bind="value: name, inject: kb.inputValidator">')[0];
    ko.applyBindings(view_model, el);

    const validator = view_model.$name;
    assert.ok(!Object.prototype.hasOwnProperty.call(validator(), 'required'), 'does not have required');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), 'url'), 'has url');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$valid'), 'has $valid');
    assert.ok(Object.prototype.hasOwnProperty.call(validator(), '$error_count'), 'has $error_count');

    assert.ok(validator().url, 'url is invalid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');
    assert.ok(validator().$active_error, 'active error exists');

    view_model.name('Bob');
    assert.ok(validator().url, 'url is invalid');
    assert.ok(!validator().$valid, 'validator not valid');
    assert.ok(validator().$error_count, 'validator is invalid');
    assert.ok(validator().$active_error, 'active error exists');

    view_model.name('http://Bob');
    assert.ok(!validator().url, 'url is valid');
    assert.ok(validator().$valid, 'validator is valid');
    assert.ok(!validator().$error_count, 'validator is not invalid');
    assert.ok(!validator().$active_error, 'active error does not exist');

    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });
});
