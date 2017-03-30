const r = typeof require !== 'undefined';
const root = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : this;
const assert = root.assert || (r ? require('chai').assert : undefined);

const kb = root.kb || (r ? require('@knockback/knockback-core') : undefined);
const _ = root._ || (r ? require('underscore') : undefined);
const Backbone = root.Backbone || (r ? require('backbone') : undefined);
const ko = root.ko || (r ? require('knockout') : undefined);

describe('observable', () => {
  it('TEST DEPENDENCY MISSING', () => {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!Backbone.Model, 'Backbone.Model');
    assert.ok(!!Backbone.Collection, 'Backbone.Collection');
    assert.ok(!!kb, 'kb');
  });

  const Contact = Backbone.Model.extend({ defaults: { name: '', number: 0, date: new Date() } });

  it('1. Standard use case: direct attributes with read and write', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const ContactViewModel = function (model) {
      this.name = kb.observable(model, 'name');
      this.number = kb.observable(model, { key: 'number' });
    };

    const model = new Contact({ name: 'Ringo', number: '555-555-5556' });
    const view_model = new ContactViewModel(model);

    // get
    assert.equal(view_model.name(), 'Ringo', 'Interesting name');
    assert.equal(view_model.number(), '555-555-5556', 'Not so interesting number');

    // set from the view model
    view_model.name('Paul');
    assert.equal(model.get('name'), 'Paul', 'Name changed');
    assert.equal(view_model.name(), 'Paul', 'Name changed');
    assert.equal(model.get('number'), '555-555-5556', 'Number not changed');
    assert.equal(view_model.number(), '555-555-5556', 'Number not changed');

    // set from the model
    model.set({ name: 'Starr', number: 'XXX-XXX-XXXX' });
    assert.equal(view_model.name(), 'Starr', 'Name changed');
    assert.equal(view_model.number(), 'XXX-XXX-XXXX', 'Number was changed');

    // and cleanup after yourself when you are done.
    kb.release(view_model);

    assert.ok(kb.Statistics.eventsStats(model).count === 0, `All model events cleared. Expected: 0. Actual: ${JSON.stringify(kb.Statistics.eventsStats(model))}`);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('2. Standard use case: direct attributes with custom read and write', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const ContactViewModelCustom = function (model) {
      this.name = kb.observable(model, { key: 'name', read() { return `First: ${model.get('name')}`; } });
      this.number = kb.observable(model, {
        key: 'number',
        read() { return `#: ${model.get('number')}`; },
        write(value) { return model.set({ number: value.substring(3) }); },
      });
    };

    const model = new Contact({ name: 'Ringo', number: '555-555-5556' });
    const view_model = new ContactViewModelCustom(model);

    // get
    assert.equal(view_model.name(), 'First: Ringo', 'Interesting name');
    assert.equal(view_model.number(), '#: 555-555-5556', 'Not so interesting number');

    // set from the view model
    assert.equal(model.get('name'), 'Ringo', 'Name not changed');
    assert.equal(view_model.name(), 'First: Ringo', 'Name not changed');
    view_model.number('#: 9222-222-222');
    assert.equal(model.get('number'), '9222-222-222', 'Number was changed');
    assert.equal(view_model.number(), '#: 9222-222-222', 'Number was changed');

    // set from the model
    model.set({ name: 'Starr', number: 'XXX-XXX-XXXX' });
    assert.equal(view_model.name(), 'First: Starr', 'Name changed');
    assert.equal(view_model.number(), '#: XXX-XXX-XXXX', 'Number was changed');

    // and cleanup after yourself when you are done.
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('3. Read args', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const args = [];
    const ContactViewModelCustom = function (model) {
      this.name = kb.observable(model, { key: 'name', read(key, arg1, arg2) { args.push(arg1); args.push(arg2); return model.get('name'); }, args: ['name', 1] });
      this.number = kb.observable(model, { key: 'number', read(key, arg) { args.push(arg); return model.get('number'); }, args: 'number' });
    };

    const model = new Contact({ name: 'Ringo', number: '555-555-5556' });
    new ContactViewModelCustom(model);
    assert.ok(_.isEqual(args, ['name', 1, 'number']) || _.isEqual(args, ['name', 1, 'name', 1, 'number', 'number']), `got the args: ${args.join(', ')}`);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('4. Standard use case: ko.computed', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const ContactViewModel = function (model) {
      this.name = kb.observable(model, { key: 'name' });
      this.formatted_name = ko.computed({
        read: this.name,
        write(value) { return this.name(`${value}`.trim()); },
        owner: this,
      });
    };

    const model = new Contact({ name: 'Ringo' });
    const view_model = new ContactViewModel(model);

    // get
    assert.equal(view_model.name(), 'Ringo', 'Interesting name');
    assert.equal(view_model.formatted_name(), 'Ringo', 'Interesting name');

    // set from the model
    view_model.formatted_name(' John ');
    assert.equal(view_model.name(), 'John', 'Name changed');
    assert.equal(view_model.formatted_name(), 'John', 'Name changed');

    // and cleanup after yourself when you are done.
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('5. Inferring observable types: the easy way', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    class ChildrenCollection extends kb.CollectionObservable {
      constructor(collection, options) {
        super(collection, { view_model: InferringViewModel, options }); // return the observable instead of this
        return kb.utils.wrappedObservable(this);
      }
    }

    class InferringViewModel extends kb.ViewModel {
      constructor(model, options) {
        super(model, {
          keys: ['name', 'parent', 'children', 'maybe_null_name', 'maybe_null_parent', 'maybe_null_children'],
          factories: {
            maybe_null_parent: InferringViewModel,
            maybe_null_children: ChildrenCollection,
          },
          options,
        });
      }
    }

    const parent = new Backbone.Model({ id: _.uniqueId(), name: 'Daddy' });
    const children_child = new Backbone.Model({ id: _.uniqueId(), name: 'Baby' });
    const children = new Backbone.Collection([{ id: _.uniqueId(), name: 'Bob', children: new Backbone.Collection([children_child]), maybe_null_children: new Backbone.Collection([children_child]) }]);
    const model = new Backbone.Model({ id: _.uniqueId() });

    const view_model = new InferringViewModel(model);
    assert.equal(view_model.name(), null, 'inferred name as simple null');
    assert.equal(view_model.parent(), null, 'inferred parent as simple null');
    assert.equal(view_model.children(), null, 'inferred children as simple null');
    assert.equal(view_model.maybe_null_name(), null, 'name is null');
    assert.equal(view_model.maybe_null_parent().name(), null, 'parent name is null');
    assert.ok(view_model.maybe_null_parent() instanceof InferringViewModel, 'maybe_null_parent type is inferring');
    assert.equal(view_model.maybe_null_children().length, 0, 'no children yet');

    // update the model
    model.set({
      name: 'Fred',
      parent,
      children,
    });
    assert.equal(view_model.name(), 'Fred', 'name is Fred');
    assert.equal(view_model.parent().name(), 'Daddy', 'parent name is Daddy');
    assert.ok(view_model.parent() instanceof kb.ViewModel, 'parent type is kb.ViewModel');
    assert.equal(view_model.children()[0].name(), 'Bob', 'child name is Bob');
    assert.ok(view_model.children()[0] instanceof kb.ViewModel, 'child type is kb.ViewModel');
    assert.equal(view_model.children()[0].children()[0].name(), 'Baby', 'child child name is Baby');
    assert.ok(view_model.children()[0].children()[0] instanceof kb.ViewModel, 'child child type is kb.ViewModel');
    assert.equal(view_model.maybe_null_name(), null, 'name is null');
    assert.equal(view_model.maybe_null_parent().name(), null, 'parent name is null');
    assert.equal(view_model.maybe_null_children().length, 0, 'no children yet');

    // update the model
    model.set({
      maybe_null_name: model.get('name'),
      maybe_null_parent: model.get('parent'),
      maybe_null_children: model.get('children'),
    });
    assert.equal(view_model.maybe_null_name(), 'Fred', 'maybe_null_name is Fred');
    assert.equal(view_model.maybe_null_parent().name(), 'Daddy', 'maybe_null_parent name is Daddy');
    assert.ok(view_model.maybe_null_parent() instanceof InferringViewModel, 'maybe_null_parent type is InferringViewModel');
    assert.equal(view_model.maybe_null_children()[0].name(), 'Bob', 'child name is Bob');
    assert.ok(view_model.maybe_null_children()[0] instanceof InferringViewModel, 'child type is InferringViewModel');
    assert.equal(view_model.maybe_null_children()[0].children()[0].name(), 'Baby', 'child child name is Baby');
    assert.ok(view_model.maybe_null_children()[0].children()[0] instanceof kb.ViewModel, 'child child type is kb.ViewModel');
    assert.equal(view_model.maybe_null_children()[0].maybe_null_children()[0].name(), 'Baby', 'maybe_null_children maybe_null_children name is Baby');
    assert.ok(view_model.maybe_null_children()[0].maybe_null_children()[0] instanceof InferringViewModel, 'maybe_null_children maybe_null_children type is InferringViewModel');

    // and cleanup after yourself when you are done.
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('6. Inferring observable types: the hard way', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    class ChildrenCollection extends kb.CollectionObservable {
      constructor(collection, options) {
        super(collection, { view_model: InferringViewModel, options }); // return the observable instead of this
        return kb.utils.wrappedObservable(this);
      }
    }

    const InferringViewModel = function (model, options) {
      this._auto = kb.viewModel(model, { keys: ['name', 'parent', 'children'], options }, this);
      this.maybe_null_name = kb.observable(model, 'maybe_null_name');

      // use shareOptions to share view models (avoid infinite loops trying to resolve relationships)
      this.maybe_null_parent = kb.observable(model, 'maybe_null_parent', { factories: InferringViewModel, options: this._auto.shareOptions() });

      // use shareOptions to share view models (avoid infinite loops trying to resolve relationships)
      this.maybe_null_children = kb.observable(model, 'maybe_null_children', { factories: ChildrenCollection, options: this._auto.shareOptions() });
    };

    const parent = new Backbone.Model({ id: _.uniqueId(), name: 'Daddy' });
    const children_child = new Backbone.Model({ id: _.uniqueId(), name: 'Baby' });
    const children = new Backbone.Collection([{ id: _.uniqueId(), name: 'Bob', children: new Backbone.Collection([children_child]), maybe_null_children: new Backbone.Collection([children_child]) }]);
    const model = new Backbone.Model({ id: _.uniqueId() });

    const view_model = new InferringViewModel(model);
    assert.equal(view_model.name(), null, 'inferred name as simple null');
    assert.equal(view_model.parent(), null, 'inferred parent as simple null');
    assert.equal(view_model.children(), null, 'inferred children as simple null');
    assert.equal(view_model.maybe_null_name(), null, 'name is null');
    assert.equal(view_model.maybe_null_parent().name(), null, 'parent name is null');
    assert.ok(view_model.maybe_null_parent() instanceof InferringViewModel, 'maybe_null_parent type is inferring');
    assert.equal(view_model.maybe_null_children().length, 0, 'no children yet');

    // update the model
    model.set({
      name: 'Fred',
      parent,
      children,
    });
    assert.equal(view_model.name(), 'Fred', 'name is Fred');
    assert.equal(view_model.parent().name(), 'Daddy', 'parent name is Daddy');
    assert.ok(view_model.parent() instanceof kb.ViewModel, 'parent type is kb.ViewModel');
    assert.equal(view_model.children()[0].name(), 'Bob', 'child name is Bob');
    assert.ok(view_model.children()[0] instanceof kb.ViewModel, 'child type is kb.ViewModel');
    assert.equal(view_model.children()[0].children()[0].name(), 'Baby', 'child child name is Baby');
    assert.ok(view_model.children()[0].children()[0] instanceof kb.ViewModel, 'child child type is kb.ViewModel');
    assert.equal(view_model.maybe_null_name(), null, 'name is null');
    assert.equal(view_model.maybe_null_parent().name(), null, 'parent name is null');
    assert.equal(view_model.maybe_null_children().length, 0, 'no children yet');

    // update the model
    model.set({
      maybe_null_name: model.get('name'),
      maybe_null_parent: model.get('parent'),
      maybe_null_children: model.get('children'),
    });
    assert.equal(view_model.maybe_null_name(), 'Fred', 'maybe_null_name is Fred');
    assert.equal(view_model.maybe_null_parent().name(), 'Daddy', 'maybe_null_parent name is Daddy');
    assert.ok(view_model.maybe_null_parent() instanceof InferringViewModel, 'maybe_null_parent type is InferringViewModel');
    assert.equal(view_model.maybe_null_children()[0].name(), 'Bob', 'child name is Bob');
    assert.ok(view_model.maybe_null_children()[0] instanceof InferringViewModel, 'child type is InferringViewModel');
    assert.equal(view_model.maybe_null_children()[0].children()[0].name(), 'Baby', 'child child name is Baby');
    assert.ok(view_model.maybe_null_children()[0].children()[0] instanceof kb.ViewModel, 'child child type is kb.ViewModel');
    assert.equal(view_model.maybe_null_children()[0].maybe_null_children()[0].name(), 'Baby', 'maybe_null_children maybe_null_children name is Baby');
    assert.ok(view_model.maybe_null_children()[0].maybe_null_children()[0] instanceof InferringViewModel, 'maybe_null_children maybe_null_children type is InferringViewModel');

    // and cleanup after yourself when you are done.
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('7. model change is observable', () => {
    kb.statistics = new kb.Statistics(); // turn on stats
    const model = new Backbone.Model({ id: 1, name: 'Bob' });

    const observable = kb.observable(model, 'name');

    let count = 0;
    ko.computed(() => { observable.model(); return count++; });

    observable.model(null);
    observable.model(model);
    assert.equal(count, 3, 'model change was observed');
    kb.release(observable);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('8. view model changes do not cause dependencies inside ko.computed', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const model = new Backbone.Model({ id: 1, name: 'Initial' });
    const observable = kb.observable(model, 'name');

    let count_manual = 0;
    ko.computed(() => {
      observable('Manual');
      return count_manual++;
    });

    let observable_count = 0;
    ko.computed(() => {
      observable(); // should depend
      return observable_count++;
    });

    assert.equal(count_manual, 1, 'count_manual'); assert.equal(observable_count, 1, 'observable_count');

    observable('Update');
    assert.equal(count_manual, 1, 'count_manual'); assert.equal(observable_count, 2, 'observable_count');

    kb.release(observable);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('9. this is bound', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const model = new Backbone.Model({ number: 33 });

    const ViewModel = function (m) {
      this.number = kb.observable(m, 'number');
      this.formatted_number = kb.observable(m, {
        key: 'number',
        read() { return `#: ${this.number()}`; },
        write(value) { return this.number(value.substring(3)); },
      }, {}, this);
    };

    const view_model = new ViewModel(model);

    assert.equal(view_model.formatted_number(), `#: ${view_model.number()}`);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  // https://github.com/kmalakoff/knockback/issues/108
  it('10. should be able to change models', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const values = [];

    const m1 = new Backbone.Model({ n: 'm1' });
    const m2 = new Backbone.Model({ n: 'm2' });
    const o = kb.observable(m1, 'n');

    o.subscribe(nv => values.push(nv));

    m1.set({ n: 'm1_2' });
    assert.deepEqual(values, ['m1_2']);

    o.model(m2);
    assert.deepEqual(values, ['m1_2', 'm2']);

    m1.set({ n: 'm1_3' });
    assert.deepEqual(values, ['m1_2', 'm2']);

    m2.set({ n: 'm2_2' });
    assert.deepEqual(values, ['m1_2', 'm2', 'm2_2']);

    m1.set({ n: 'm1_4' });
    assert.deepEqual(values, ['m1_2', 'm2', 'm2_2']);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });
});
