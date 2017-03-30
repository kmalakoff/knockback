const r = typeof require !== 'undefined';
const root = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : this;
const assert = root.assert || (r ? require('chai').assert : undefined);

const kb = root.kb || (r ? require('@knockback/knockback-core') : undefined);
const _ = root._ || (r ? require('underscore') : undefined);
const Backbone = root.Backbone || (r ? require('backbone') : undefined);
const ko = root.ko || (r ? require('knockout') : undefined);
if (kb && !kb.FormattedObservable && r) require('@knockback/knockback-formatting');

describe('formatted-observable', () => {
  it('TEST DEPENDENCY MISSING', () => {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!Backbone.Model, 'Backbone.Model');
    assert.ok(!!Backbone.Collection, 'Backbone.Collection');
    assert.ok(!!kb, 'kb');
    assert.ok(!!kb, 'kb');
  });

  const Contact = Backbone.Model.extend({ defaults: { name: '', number: 0, date: new Date() } });

  it('Various scenarios', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    class ContactViewModelCustom extends kb.ViewModel {
      constructor(model) {
        super(model, { internals: ['name', 'number'] });
        this.name = ko.computed(() => `Name: ${this._name()}`);
        this.number = kb.formattedObservable('#: {0}', this._number);
        this.name_number = kb.formattedObservable('Name: {0}, #: {1}', this._name, this._number);
        this.number_name = kb.formattedObservable('#: {1}, Name: {0}', this._name, this._number);
        this.name_number_name = kb.formattedObservable('Name: {0}, #: {1}, Name: {0}', this._name, this._number);
        this.name_number_name_song = kb.formattedObservable('Name: {0}, #: {1}, Name: {0}, Song: "{2}"', this._name, this._number, this.favorite_song);
      }
    }

    const model = new Contact({ name: 'Ringo', number: '555-555-5556', favorite_song: 'Yellow Submarine' });
    const view_model = new ContactViewModelCustom(model);

    // get
    assert.equal(view_model._name(), 'Ringo', 'Interesting name');
    assert.equal(view_model.name(), 'Name: Ringo', 'Interesting name');
    assert.equal(view_model._number(), '555-555-5556', 'Not so interesting number');
    assert.equal(view_model.number(), '#: 555-555-5556', 'Not so interesting number');
    assert.equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', 'combined in order');
    assert.equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', 'combined out of order');
    assert.equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', 'combined repeat');

    // set from the model
    model.set({ name: 'Starr', number: 'XXX-XXX-XXXX' });
    assert.equal(view_model._name(), 'Starr', 'Name changed');
    assert.equal(view_model.name(), 'Name: Starr', 'Name changed');
    assert.equal(view_model._number(), 'XXX-XXX-XXXX', 'Number was changed');
    assert.equal(view_model.number(), '#: XXX-XXX-XXXX', 'Number was changed');
    assert.equal(view_model.name_number(), 'Name: Starr, #: XXX-XXX-XXXX', 'combined in order');
    assert.equal(view_model.number_name(), '#: XXX-XXX-XXXX, Name: Starr', 'combined out of order');
    assert.equal(view_model.name_number_name(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr', 'combined repeat');

    // set from the generated attribute
    view_model._name('Ringo');
    view_model._number('555-555-5556');
    assert.equal(view_model._name(), 'Ringo', 'Interesting name');
    assert.equal(view_model.name(), 'Name: Ringo', 'Interesting name');
    assert.equal(view_model._number(), '555-555-5556', 'Not so interesting number');
    assert.equal(view_model.number(), '#: 555-555-5556', 'Not so interesting number');
    assert.equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', 'combined in order');
    assert.equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', 'combined out of order');
    assert.equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', 'combined repeat');

    // set from the view model - simple
    view_model.number('#: 9222-222-222');
    assert.equal(model.get('number'), '9222-222-222', 'Number was changed');
    assert.equal(view_model._number(), '9222-222-222', 'Number was changed');
    assert.equal(view_model.number(), '#: 9222-222-222', 'Number was changed');
    assert.equal(view_model.name_number(), 'Name: Ringo, #: 9222-222-222', 'combined in order');
    assert.equal(view_model.number_name(), '#: 9222-222-222, Name: Ringo', 'combined out of order');
    assert.equal(view_model.name_number_name(), 'Name: Ringo, #: 9222-222-222, Name: Ringo', 'combined repeat');

    // set from the view model - in order
    view_model.name_number('Name: Starr, #: XXX-XXX-XXXX');
    assert.equal(view_model._name(), 'Starr', 'Name changed');
    assert.equal(view_model.name(), 'Name: Starr', 'Name changed');
    assert.equal(view_model._number(), 'XXX-XXX-XXXX', 'Number was changed');
    assert.equal(view_model.number(), '#: XXX-XXX-XXXX', 'Number was changed');
    assert.equal(view_model.name_number(), 'Name: Starr, #: XXX-XXX-XXXX', 'combined in order');
    assert.equal(view_model.number_name(), '#: XXX-XXX-XXXX, Name: Starr', 'combined out of order');
    assert.equal(view_model.name_number_name(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr', 'combined repeat');

    // set from the view model - in reverse order
    view_model.number_name('#: 555-555-5556, Name: Ringo');
    assert.equal(view_model._name(), 'Ringo', 'Interesting name');
    assert.equal(view_model.name(), 'Name: Ringo', 'Interesting name');
    assert.equal(view_model._number(), '555-555-5556', 'Not so interesting number');
    assert.equal(view_model.number(), '#: 555-555-5556', 'Not so interesting number');
    assert.equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', 'combined in order');
    assert.equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', 'combined out of order');
    assert.equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', 'combined repeat');

    // set from the view model - with repeats (it takes the first match if different)
    view_model.name_number_name('Name: Starr, #: XXX-XXX-XXXX, Name: Bongo');
    assert.equal(view_model._name(), 'Starr', 'Name changed');
    assert.equal(view_model.name(), 'Name: Starr', 'Name changed');
    assert.equal(view_model._number(), 'XXX-XXX-XXXX', 'Number was changed');
    assert.equal(view_model.number(), '#: XXX-XXX-XXXX', 'Number was changed');
    assert.equal(view_model.name_number(), 'Name: Starr, #: XXX-XXX-XXXX', 'combined in order');
    assert.equal(view_model.number_name(), '#: XXX-XXX-XXXX, Name: Starr', 'combined out of order');
    assert.equal(view_model.name_number_name(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr', 'combined repeat');

    // add a new parameter
    assert.equal(view_model.name_number_name_song(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr, Song: "Yellow Submarine"', 'works with repeat parameters');
    view_model.name_number_name_song('Name: Ringo, #: 555-555-5556, Name: Ringo, Song: "Yellow"');
    assert.equal(view_model._name(), 'Ringo', 'Interesting name');
    assert.equal(view_model.name(), 'Name: Ringo', 'Interesting name');
    assert.equal(view_model._number(), '555-555-5556', 'Not so interesting number');
    assert.equal(view_model.number(), '#: 555-555-5556', 'Not so interesting number');
    assert.equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', 'combined in order');
    assert.equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', 'combined out of order');
    assert.equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', 'combined repeat');
    assert.equal(view_model.favorite_song(), 'Yellow', 'combined repeat');
    assert.equal(view_model.name_number_name_song(), 'Name: Ringo, #: 555-555-5556, Name: Ringo, Song: "Yellow"', 'combined repeat');

    // and cleanup after yourself when you are done.
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('4. Using classes', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    class ContactViewModelCustom extends kb.ViewModel {
      constructor(model) {
        super(model, { internals: ['name', 'number'] });
        this.name = ko.computed(() => `First: ${this._name()}`);
        this.number = kb.formattedObservable('#: {0}', this._number);
      }
    }

    const model = new Contact({ name: 'Ringo', number: '555-555-5556' });
    const view_model = new ContactViewModelCustom(model);

    // get
    assert.equal(view_model._name(), 'Ringo', 'Interesting name');
    assert.equal(view_model.name(), 'First: Ringo', 'Interesting name');
    assert.equal(view_model._number(), '555-555-5556', 'Not so interesting number');
    assert.equal(view_model.number(), '#: 555-555-5556', 'Not so interesting number');

    // set from the view model
    view_model.number('#: 9222-222-222');
    assert.equal(model.get('number'), '9222-222-222', 'Number was changed');
    assert.equal(view_model._number(), '9222-222-222', 'Number was changed');
    assert.equal(view_model.number(), '#: 9222-222-222', 'Number was changed');

    // set from the model
    model.set({ name: 'Starr', number: 'XXX-XXX-XXXX' });
    assert.equal(view_model._name(), 'Starr', 'Name changed');
    assert.equal(view_model.name(), 'First: Starr', 'Name changed');
    assert.equal(view_model._number(), 'XXX-XXX-XXXX', 'Number was changed');
    assert.equal(view_model.number(), '#: XXX-XXX-XXXX', 'Number was changed');

    // set from the generated attribute
    view_model._name('Ringo');
    assert.equal(view_model._name(), 'Ringo', 'Interesting name');
    assert.equal(view_model.name(), 'First: Ringo', 'Interesting name');

    // and cleanup after yourself when you are done.
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('6. requires', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    class ContactViewModelFullName extends kb.ViewModel {
      constructor(model) {
        super(model, { requires: ['first', 'last'] });
        this.full_name = kb.formattedObservable('Last: {1}, First: {0}', this.first, this.last);
      }
    }

    const model = new Backbone.Model();
    const view_model = new ContactViewModelFullName(model);
    assert.equal(view_model.full_name(), 'Last: , First: ', 'full name is good');

    model.set({ first: 'Ringo', last: 'Starr' });
    assert.equal(view_model.full_name(), 'Last: Starr, First: Ringo', 'full name is good');

    model.set({ first: 'Bongo' });
    assert.equal(view_model.full_name(), 'Last: Starr, First: Bongo', 'full name is good');

    view_model.full_name('Last: The Starr, First: Ringo');
    assert.equal(model.get('first'), 'Ringo', 'first name is good');
    assert.equal(model.get('last'), 'The Starr', 'last name is good');

    // clean up
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('kb.formattedObservable', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    class ContactViewModelFullName extends kb.ViewModel {
      constructor(model) {
        super(model, { internals: ['first', 'last'] });
        this.full_name = kb.formattedObservable('Last: {1}, First: {0}', this._first, this._last);
      }
    }

    const model = new Backbone.Model({ first: 'Ringo', last: 'Starr' });
    const view_model = new ContactViewModelFullName(model);
    assert.equal(view_model.full_name(), 'Last: Starr, First: Ringo', 'full name is good');

    model.set({ first: 'Bongo' });
    assert.equal(view_model.full_name(), 'Last: Starr, First: Bongo', 'full name is good');

    view_model.full_name('Last: The Starr, First: Ringo');
    assert.equal(view_model.full_name(), 'Last: The Starr, First: Ringo', 'full name is good');
    assert.equal(model.get('first'), 'Ringo', 'first name is good');
    assert.equal(model.get('last'), 'The Starr', 'last name is good');

    // clean up
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });

  it('kb.observableFormatted', () => {
    kb.statistics = new kb.Statistics(); // turn on stats

    class ContactViewModelFullName extends kb.ViewModel {
      constructor(model) {
        super(model, { internals: ['first', 'last'] });
        this.full_name = kb.observableFormatted('Last: {1}, First: {0}', this._first, this._last);
      }
    }

    const model = new Backbone.Model({ first: 'Ringo', last: 'Starr' });
    const view_model = new ContactViewModelFullName(model);
    assert.equal(view_model.full_name(), 'Last: Starr, First: Ringo', 'full name is good');

    model.set({ first: 'Bongo' });
    assert.equal(view_model.full_name(), 'Last: Starr, First: Bongo', 'full name is good');

    view_model.full_name('Last: The Starr, First: Ringo');
    assert.equal(view_model.full_name(), 'Last: The Starr, First: Ringo', 'full name is good');
    assert.equal(model.get('first'), 'Ringo', 'first name is good');
    assert.equal(model.get('last'), 'The Starr', 'last name is good');

    // clean up
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
  });
});
