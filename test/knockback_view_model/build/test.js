var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
$(document).ready(function() {
  module("knockback_view_model.js");
  test("TEST DEPENDENCY MISSING", function() {
    ko.utils;
    _.VERSION;
    return Backbone.VERSION;
  });
  Knockback.locale_manager = new LocaleManager('en', {});
  test("Standard use case: read and write", function() {
    var model, view_model;
    model = new Contact({
      name: 'Ringo',
      number: '555-555-5556'
    });
    view_model = kb.viewModel(model);
    equal(view_model.name(), 'Ringo', "Interesting name");
    equal(view_model.number(), '555-555-5556', "Not so interesting number");
    view_model.number('9222-222-222');
    equal(model.get('number'), '9222-222-222', "Number was changed");
    equal(view_model.number(), '9222-222-222', "Number was changed");
    model.set({
      name: 'Starr',
      number: 'XXX-XXX-XXXX'
    });
    equal(view_model.name(), 'Starr', "Name changed");
    equal(view_model.number(), 'XXX-XXX-XXXX', "Number was changed");
    return kb.vmRelease(view_model);
  });
  test("Standard use case: read only", function() {
    var model, view_model;
    model = new Contact({
      name: 'Ringo',
      number: '555-555-5556'
    });
    view_model = kb.viewModel(model, {
      read_only: true
    });
    equal(view_model.name(), 'Ringo', "Interesting name");
    equal(view_model.number(), '555-555-5556', "Not so interesting number");
    raises((function() {
      return view_model.name('Paul');
    }), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
    equal(model.get('name'), 'Ringo', "Name not changed");
    equal(view_model.name(), 'Ringo', "Name not changed");
    raises((function() {
      return view_model.number('9222-222-222');
    }), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
    equal(model.get('number'), '555-555-5556', "Number was not changed");
    equal(view_model.number(), '555-555-5556', "Number was not changed");
    model.set({
      name: 'Starr',
      number: 'XXX-XXX-XXXX'
    });
    equal(view_model.name(), 'Starr', "Name changed");
    equal(view_model.number(), 'XXX-XXX-XXXX', "Number was changed");
    return kb.vmRelease(view_model);
  });
  test("internals test", function() {
    var ContactViewModel, birthdate, current_date, model, view_model;
    ContactViewModel = (function() {
      __extends(ContactViewModel, kb.ViewModel);
      function ContactViewModel(model) {
        ContactViewModel.__super__.constructor.call(this, model, {
          internals: ['email', 'date']
        });
        this.email = kb.defaultWrapper(this._email, 'your.name@yourplace.com');
        this.date = new LongDateLocalizer(this._date);
      }
      return ContactViewModel;
    })();
    birthdate = new Date(1940, 10, 9);
    model = new Contact({
      name: 'John',
      date: new Date(birthdate.valueOf())
    });
    view_model = new ContactViewModel(model);
    equal(view_model._email(), void 0, "no email");
    equal(view_model.email(), 'your.name@yourplace.com', "default message");
    view_model._email('j@imagine.com');
    equal(view_model._email(), 'j@imagine.com', "received email");
    equal(view_model.email(), 'j@imagine.com', "received email");
    view_model.email('john@imagine.com');
    equal(view_model._email(), 'john@imagine.com', "received email");
    equal(view_model.email(), 'john@imagine.com', "received email");
    Knockback.locale_manager.setLocale('en-GB');
    equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
    view_model.date('10 December 1963');
    current_date = model.get('date');
    equal(current_date.getFullYear(), 1963, "year is good");
    equal(current_date.getMonth(), 11, "month is good");
    equal(current_date.getDate(), 10, "day is good");
    equal(view_model._date().getFullYear(), 1963, "year is good");
    equal(view_model._date().getMonth(), 11, "month is good");
    equal(view_model._date().getDate(), 10, "day is good");
    model.set({
      date: new Date(birthdate.valueOf())
    });
    Knockback.locale_manager.setLocale('fr-FR');
    equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    view_model.date('10 novembre 1940');
    current_date = model.get('date');
    equal(current_date.getFullYear(), 1940, "year is good");
    equal(current_date.getMonth(), 10, "month is good");
    equal(current_date.getDate(), 10, "day is good");
    equal(view_model._date().getFullYear(), 1940, "year is good");
    equal(view_model._date().getMonth(), 10, "month is good");
    equal(view_model._date().getDate(), 10, "day is good");
    view_model.date(new Date(birthdate.valueOf()));
    Knockback.locale_manager.setLocale('fr-FR');
    equal(view_model.date(), '10 novembre 1940', "One past John's birthdate in France format");
    current_date = model.get('date');
    equal(current_date.getFullYear(), 1940, "year is good");
    equal(current_date.getMonth(), 10, "month is good");
    equal(current_date.getDate(), 10, "day is good");
    equal(view_model._date().getFullYear(), 1940, "year is good");
    equal(view_model._date().getMonth(), 10, "month is good");
    equal(view_model._date().getDate(), 10, "day is good");
    return kb.vmRelease(view_model);
  });
  test("merge into an external view model", function() {
    var model, view_model, view_model_instance;
    model = new Contact({
      name: 'Ringo',
      number: '555-555-5556'
    });
    view_model = {
      something: ko.observable('foo')
    };
    view_model_instance = kb.viewModel(model, {}, view_model);
    equal(view_model.name(), 'Ringo', "Interesting name");
    equal(view_model.number(), '555-555-5556', "Not so interesting number");
    view_model.number('9222-222-222');
    equal(model.get('number'), '9222-222-222', "Number was changed");
    equal(view_model.number(), '9222-222-222', "Number was changed");
    model.set({
      name: 'Starr',
      number: 'XXX-XXX-XXXX'
    });
    equal(view_model.name(), 'Starr', "Name changed");
    equal(view_model.number(), 'XXX-XXX-XXXX', "Number was changed");
    kb.vmRelease(view_model_instance);
    ok(view_model.number === null, "Number removed");
    ok(view_model.something !== null, "Somthing remains removed");
    kb.vmRelease(view_model);
    return ok(view_model.something === null, "Something removed");
  });
  test("Using Coffeescript classes", function() {
    var ContactViewModelCustom, model, view_model;
    ContactViewModelCustom = (function() {
      __extends(ContactViewModelCustom, kb.ViewModel);
      function ContactViewModelCustom(model) {
        ContactViewModelCustom.__super__.constructor.call(this, model, {
          internals: ['name', 'number']
        });
        this.name = ko.dependentObservable(__bind(function() {
          return "First: " + (this._name());
        }, this));
        this.number = kb.formatWrapper('#: {0}', this._number);
      }
      return ContactViewModelCustom;
    })();
    model = new Contact({
      name: 'Ringo',
      number: '555-555-5556'
    });
    view_model = new ContactViewModelCustom(model);
    equal(view_model._name(), 'Ringo', "Interesting name");
    equal(view_model.name(), 'First: Ringo', "Interesting name");
    equal(view_model._number(), '555-555-5556', "Not so interesting number");
    equal(view_model.number(), '#: 555-555-5556', "Not so interesting number");
    view_model.number('#: 9222-222-222');
    equal(model.get('number'), '9222-222-222', "Number was changed");
    equal(view_model._number(), '9222-222-222', "Number was changed");
    equal(view_model.number(), '#: 9222-222-222', "Number was changed");
    model.set({
      name: 'Starr',
      number: 'XXX-XXX-XXXX'
    });
    equal(view_model._name(), 'Starr', "Name changed");
    equal(view_model.name(), 'First: Starr', "Name changed");
    equal(view_model._number(), 'XXX-XXX-XXXX', "Number was changed");
    equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed");
    view_model._name('Ringo');
    equal(view_model._name(), 'Ringo', "Interesting name");
    equal(view_model.name(), 'First: Ringo', "Interesting name");
    return kb.vmRelease(view_model);
  });
  test("Using simple Javascript classes", function() {
    var ContactViewModelCustom, model, view_model;
    ContactViewModelCustom = function(model) {
      var view_model;
      view_model = kb.viewModel(model);
      view_model.formatted_name = kb.observable(model, {
        key: 'name',
        read: function() {
          return "First: " + (model.get('name'));
        }
      });
      view_model.formatted_number = kb.observable(model, {
        key: 'number',
        read: function() {
          return "#: " + (model.get('number'));
        },
        write: function(value) {
          return model.set({
            number: value.substring(3)
          });
        }
      }, view_model);
      return view_model;
    };
    model = new Contact({
      name: 'Ringo',
      number: '555-555-5556'
    });
    view_model = new ContactViewModelCustom(model);
    equal(view_model.name(), 'Ringo', "Interesting name");
    equal(view_model.formatted_name(), 'First: Ringo', "Interesting name");
    equal(view_model.number(), '555-555-5556', "Not so interesting number");
    equal(view_model.formatted_number(), '#: 555-555-5556', "Not so interesting number");
    view_model.formatted_number('#: 9222-222-222');
    equal(model.get('number'), '9222-222-222', "Number was changed");
    equal(view_model.number(), '9222-222-222', "Number was changed");
    equal(view_model.formatted_number(), '#: 9222-222-222', "Number was changed");
    model.set({
      name: 'Starr',
      number: 'XXX-XXX-XXXX'
    });
    equal(view_model.name(), 'Starr', "Name changed");
    equal(view_model.formatted_name(), 'First: Starr', "Name changed");
    equal(view_model.number(), 'XXX-XXX-XXXX', "Number was changed");
    equal(view_model.formatted_number(), '#: XXX-XXX-XXXX', "Number was changed");
    return kb.vmRelease(view_model);
  });
  test("requires", function() {
    var ContactViewModelFullName, model, view_model;
    ContactViewModelFullName = (function() {
      __extends(ContactViewModelFullName, kb.ViewModel);
      function ContactViewModelFullName(model) {
        ContactViewModelFullName.__super__.constructor.call(this, model, {
          requires: ['first', 'last']
        });
        this.full_name = kb.formatWrapper('Last: {1}, First: {0}', this.first, this.last);
      }
      return ContactViewModelFullName;
    })();
    model = new Backbone.Model();
    view_model = new ContactViewModelFullName(model);
    equal(view_model.full_name(), 'Last: , First: ', "full name is good");
    model.set({
      first: 'Ringo',
      last: 'Starr'
    });
    equal(view_model.full_name(), 'Last: Starr, First: Ringo', "full name is good");
    model.set({
      first: 'Bongo'
    });
    equal(view_model.full_name(), 'Last: Starr, First: Bongo', "full name is good");
    view_model.full_name('Last: The Starr, First: Ringo');
    equal(model.get('first'), 'Ringo', "first name is good");
    return equal(model.get('last'), 'The Starr', "last name is good");
  });
  test("Using kb.localizedObservable", function() {
    var ContactViewModelDate, birthdate, current_date, model, view_model;
    ContactViewModelDate = (function() {
      __extends(ContactViewModelDate, kb.ViewModel);
      function ContactViewModelDate(model) {
        ContactViewModelDate.__super__.constructor.call(this, model, {
          internals: ['date']
        });
        this.date = new LongDateLocalizer(this._date);
      }
      return ContactViewModelDate;
    })();
    birthdate = new Date(1940, 10, 9);
    model = new Contact({
      name: 'John',
      date: new Date(birthdate.valueOf())
    });
    view_model = new ContactViewModelDate(model);
    Knockback.locale_manager.setLocale('en-GB');
    equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
    view_model.date('10 December 1963');
    current_date = model.get('date');
    equal(current_date.getFullYear(), 1963, "year is good");
    equal(current_date.getMonth(), 11, "month is good");
    equal(current_date.getDate(), 10, "day is good");
    equal(view_model._date().getFullYear(), 1963, "year is good");
    equal(view_model._date().getMonth(), 11, "month is good");
    equal(view_model._date().getDate(), 10, "day is good");
    model.set({
      date: new Date(birthdate.valueOf())
    });
    Knockback.locale_manager.setLocale('fr-FR');
    equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    view_model.date('10 novembre 1940');
    current_date = model.get('date');
    equal(current_date.getFullYear(), 1940, "year is good");
    equal(current_date.getMonth(), 10, "month is good");
    equal(current_date.getDate(), 10, "day is good");
    equal(view_model._date().getFullYear(), 1940, "year is good");
    equal(view_model._date().getMonth(), 10, "month is good");
    equal(view_model._date().getDate(), 10, "day is good");
    view_model.date(new Date(birthdate.valueOf()));
    Knockback.locale_manager.setLocale('fr-FR');
    equal(view_model.date(), '10 novembre 1940', "John's birthdate in France format");
    current_date = model.get('date');
    equal(current_date.getFullYear(), 1940, "year is good");
    equal(current_date.getMonth(), 10, "month is good");
    equal(current_date.getDate(), 10, "day is good");
    equal(view_model._date().getFullYear(), 1940, "year is good");
    equal(view_model._date().getMonth(), 10, "month is good");
    equal(view_model._date().getDate(), 10, "day is good");
    return kb.vmRelease(view_model);
  });
  return test("Error cases", function() {});
});