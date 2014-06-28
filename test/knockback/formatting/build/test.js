var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

describe('knockback-formatted-observable.js', function() {
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
    assert.ok(!!kb, 'kb');
    return done();
  });
  kb.Contact = kb.Parse ? kb.Model.extend('Contact', {
    defaults: {
      name: '',
      number: 0,
      date: new Date()
    }
  }) : kb.Model.extend({
    defaults: {
      name: '',
      number: 0,
      date: new Date()
    }
  });
  kb.ContactsCollection = kb.Collection.extend({
    model: kb.Contact
  });
  it('Various scenarios', function(done) {
    var ContactViewModelCustom, model, view_model;
    kb.statistics = new kb.Statistics();
    ContactViewModelCustom = (function(_super) {
      __extends(ContactViewModelCustom, _super);

      function ContactViewModelCustom(model) {
        ContactViewModelCustom.__super__.constructor.call(this, model, {
          internals: ['name', 'number']
        });
        this.name = ko.dependentObservable((function(_this) {
          return function() {
            return "Name: " + (_this._name());
          };
        })(this));
        this.number = kb.formattedObservable('#: {0}', this._number);
        this.name_number = kb.formattedObservable('Name: {0}, #: {1}', this._name, this._number);
        this.number_name = kb.formattedObservable('#: {1}, Name: {0}', this._name, this._number);
        this.name_number_name = kb.formattedObservable('Name: {0}, #: {1}, Name: {0}', this._name, this._number);
        this.name_number_name_song = kb.formattedObservable('Name: {0}, #: {1}, Name: {0}, Song: "{2}"', this._name, this._number, this.favorite_song);
      }

      return ContactViewModelCustom;

    })(kb.ViewModel);
    model = new kb.Contact({
      name: 'Ringo',
      number: '555-555-5556',
      favorite_song: 'Yellow Submarine'
    });
    view_model = new ContactViewModelCustom(model);
    assert.equal(view_model._name(), 'Ringo', "Interesting name");
    assert.equal(view_model.name(), 'Name: Ringo', "Interesting name");
    assert.equal(view_model._number(), '555-555-5556', "Not so interesting number");
    assert.equal(view_model.number(), '#: 555-555-5556', "Not so interesting number");
    assert.equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', "combined in order");
    assert.equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', "combined out of order");
    assert.equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', "combined repeat");
    model.set({
      name: 'Starr',
      number: 'XXX-XXX-XXXX'
    });
    assert.equal(view_model._name(), 'Starr', "Name changed");
    assert.equal(view_model.name(), 'Name: Starr', "Name changed");
    assert.equal(view_model._number(), 'XXX-XXX-XXXX', "Number was changed");
    assert.equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed");
    assert.equal(view_model.name_number(), 'Name: Starr, #: XXX-XXX-XXXX', "combined in order");
    assert.equal(view_model.number_name(), '#: XXX-XXX-XXXX, Name: Starr', "combined out of order");
    assert.equal(view_model.name_number_name(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr', "combined repeat");
    view_model._name('Ringo');
    view_model._number('555-555-5556');
    assert.equal(view_model._name(), 'Ringo', "Interesting name");
    assert.equal(view_model.name(), 'Name: Ringo', "Interesting name");
    assert.equal(view_model._number(), '555-555-5556', "Not so interesting number");
    assert.equal(view_model.number(), '#: 555-555-5556', "Not so interesting number");
    assert.equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', "combined in order");
    assert.equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', "combined out of order");
    assert.equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', "combined repeat");
    view_model.number('#: 9222-222-222');
    assert.equal(model.get('number'), '9222-222-222', "Number was changed");
    assert.equal(view_model._number(), '9222-222-222', "Number was changed");
    assert.equal(view_model.number(), '#: 9222-222-222', "Number was changed");
    assert.equal(view_model.name_number(), 'Name: Ringo, #: 9222-222-222', "combined in order");
    assert.equal(view_model.number_name(), '#: 9222-222-222, Name: Ringo', "combined out of order");
    assert.equal(view_model.name_number_name(), 'Name: Ringo, #: 9222-222-222, Name: Ringo', "combined repeat");
    view_model.name_number('Name: Starr, #: XXX-XXX-XXXX');
    assert.equal(view_model._name(), 'Starr', "Name changed");
    assert.equal(view_model.name(), 'Name: Starr', "Name changed");
    assert.equal(view_model._number(), 'XXX-XXX-XXXX', "Number was changed");
    assert.equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed");
    assert.equal(view_model.name_number(), 'Name: Starr, #: XXX-XXX-XXXX', "combined in order");
    assert.equal(view_model.number_name(), '#: XXX-XXX-XXXX, Name: Starr', "combined out of order");
    assert.equal(view_model.name_number_name(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr', "combined repeat");
    view_model.number_name('#: 555-555-5556, Name: Ringo');
    assert.equal(view_model._name(), 'Ringo', "Interesting name");
    assert.equal(view_model.name(), 'Name: Ringo', "Interesting name");
    assert.equal(view_model._number(), '555-555-5556', "Not so interesting number");
    assert.equal(view_model.number(), '#: 555-555-5556', "Not so interesting number");
    assert.equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', "combined in order");
    assert.equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', "combined out of order");
    assert.equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', "combined repeat");
    view_model.name_number_name('Name: Starr, #: XXX-XXX-XXXX, Name: Bongo');
    assert.equal(view_model._name(), 'Starr', "Name changed");
    assert.equal(view_model.name(), 'Name: Starr', "Name changed");
    assert.equal(view_model._number(), 'XXX-XXX-XXXX', "Number was changed");
    assert.equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed");
    assert.equal(view_model.name_number(), 'Name: Starr, #: XXX-XXX-XXXX', "combined in order");
    assert.equal(view_model.number_name(), '#: XXX-XXX-XXXX, Name: Starr', "combined out of order");
    assert.equal(view_model.name_number_name(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr', "combined repeat");
    assert.equal(view_model.name_number_name_song(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr, Song: "Yellow Submarine"', "works with repeat parameters");
    view_model.name_number_name_song('Name: Ringo, #: 555-555-5556, Name: Ringo, Song: "Yellow"');
    assert.equal(view_model._name(), 'Ringo', "Interesting name");
    assert.equal(view_model.name(), 'Name: Ringo', "Interesting name");
    assert.equal(view_model._number(), '555-555-5556', "Not so interesting number");
    assert.equal(view_model.number(), '#: 555-555-5556', "Not so interesting number");
    assert.equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', "combined in order");
    assert.equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', "combined out of order");
    assert.equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', "combined repeat");
    assert.equal(view_model.favorite_song(), 'Yellow', "combined repeat");
    assert.equal(view_model.name_number_name_song(), 'Name: Ringo, #: 555-555-5556, Name: Ringo, Song: "Yellow"', "combined repeat");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('4. Using Coffeescript classes', function(done) {
    var ContactViewModelCustom, model, view_model;
    kb.statistics = new kb.Statistics();
    ContactViewModelCustom = (function(_super) {
      __extends(ContactViewModelCustom, _super);

      function ContactViewModelCustom(model) {
        ContactViewModelCustom.__super__.constructor.call(this, model, {
          internals: ['name', 'number']
        });
        this.name = ko.dependentObservable((function(_this) {
          return function() {
            return "First: " + (_this._name());
          };
        })(this));
        this.number = kb.formattedObservable('#: {0}', this._number);
      }

      return ContactViewModelCustom;

    })(kb.ViewModel);
    model = new kb.Contact({
      name: 'Ringo',
      number: '555-555-5556'
    });
    view_model = new ContactViewModelCustom(model);
    assert.equal(view_model._name(), 'Ringo', "Interesting name");
    assert.equal(view_model.name(), 'First: Ringo', "Interesting name");
    assert.equal(view_model._number(), '555-555-5556', "Not so interesting number");
    assert.equal(view_model.number(), '#: 555-555-5556', "Not so interesting number");
    view_model.number('#: 9222-222-222');
    assert.equal(model.get('number'), '9222-222-222', "Number was changed");
    assert.equal(view_model._number(), '9222-222-222', "Number was changed");
    assert.equal(view_model.number(), '#: 9222-222-222', "Number was changed");
    model.set({
      name: 'Starr',
      number: 'XXX-XXX-XXXX'
    });
    assert.equal(view_model._name(), 'Starr', "Name changed");
    assert.equal(view_model.name(), 'First: Starr', "Name changed");
    assert.equal(view_model._number(), 'XXX-XXX-XXXX', "Number was changed");
    assert.equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed");
    view_model._name('Ringo');
    assert.equal(view_model._name(), 'Ringo', "Interesting name");
    assert.equal(view_model.name(), 'First: Ringo', "Interesting name");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('6. requires', function(done) {
    var ContactViewModelFullName, model, view_model;
    kb.statistics = new kb.Statistics();
    ContactViewModelFullName = (function(_super) {
      __extends(ContactViewModelFullName, _super);

      function ContactViewModelFullName(model) {
        ContactViewModelFullName.__super__.constructor.call(this, model, {
          requires: ['first', 'last']
        });
        this.full_name = kb.formattedObservable('Last: {1}, First: {0}', this.first, this.last);
      }

      return ContactViewModelFullName;

    })(kb.ViewModel);
    model = new kb.Model();
    view_model = new ContactViewModelFullName(model);
    assert.equal(view_model.full_name(), 'Last: , First: ', "full name is good");
    model.set({
      first: 'Ringo',
      last: 'Starr'
    });
    assert.equal(view_model.full_name(), 'Last: Starr, First: Ringo', "full name is good");
    model.set({
      first: 'Bongo'
    });
    assert.equal(view_model.full_name(), 'Last: Starr, First: Bongo', "full name is good");
    view_model.full_name('Last: The Starr, First: Ringo');
    assert.equal(model.get('first'), 'Ringo', "first name is good");
    assert.equal(model.get('last'), 'The Starr', "last name is good");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  return it('kb.formattedObservable', function(done) {
    var ContactViewModelFullName, model, view_model;
    kb.statistics = new kb.Statistics();
    ContactViewModelFullName = (function(_super) {
      __extends(ContactViewModelFullName, _super);

      function ContactViewModelFullName(model) {
        ContactViewModelFullName.__super__.constructor.call(this, model, {
          internals: ['first', 'last']
        });
        this.full_name = kb.formattedObservable('Last: {1}, First: {0}', this._first, this._last);
      }

      return ContactViewModelFullName;

    })(kb.ViewModel);
    model = new kb.Model({
      first: 'Ringo',
      last: 'Starr'
    });
    view_model = new ContactViewModelFullName(model);
    assert.equal(view_model.full_name(), 'Last: Starr, First: Ringo', "full name is good");
    model.set({
      first: 'Bongo'
    });
    assert.equal(view_model.full_name(), 'Last: Starr, First: Bongo', "full name is good");
    view_model.full_name('Last: The Starr, First: Ringo');
    assert.equal(view_model.full_name(), 'Last: The Starr, First: Ringo', "full name is good");
    assert.equal(model.get('first'), 'Ringo', "first name is good");
    assert.equal(model.get('last'), 'The Starr', "last name is good");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
});
