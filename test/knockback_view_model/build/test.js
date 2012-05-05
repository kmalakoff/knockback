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
    return kb.utils.release(view_model);
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
    return kb.utils.release(view_model);
  });
  test("internals test (Coffeescript inheritance)", function() {
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
    return kb.utils.release(view_model);
  });
  test("internals test (Javascript inheritance)", function() {
    var ContactViewModel, birthdate, current_date, model, view_model;
    ContactViewModel = kb.ViewModel.extend({
      constructor: function(model) {
        kb.ViewModel.prototype.constructor.call(this, model, {
          internals: ['email', 'date']
        });
        this.email = kb.defaultWrapper(this._email, 'your.name@yourplace.com');
        this.date = new LongDateLocalizer(this._date);
        return this;
      }
    });
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
    return kb.utils.release(view_model);
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
        this.number = kb.formattedObservable('#: {0}', this._number);
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
    return kb.utils.release(view_model);
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
    return kb.utils.release(view_model);
  });
  test("requires", function() {
    var ContactViewModelFullName, model, view_model;
    ContactViewModelFullName = (function() {
      __extends(ContactViewModelFullName, kb.ViewModel);
      function ContactViewModelFullName(model) {
        ContactViewModelFullName.__super__.constructor.call(this, model, {
          requires: ['first', 'last']
        });
        this.full_name = kb.formattedObservable('Last: {1}, First: {0}', this.first, this.last);
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
    return kb.utils.release(view_model);
  });
  test("reference counting and custom __destroy (Coffeescript inheritance)", function() {
    var ContactViewModelFullName, model, view_model;
    ContactViewModelFullName = (function() {
      __extends(ContactViewModelFullName, kb.ViewModel);
      function ContactViewModelFullName(model) {
        ContactViewModelFullName.__super__.constructor.call(this, model, {
          requires: ['first', 'last']
        });
        this.is_destroyed = false;
      }
      ContactViewModelFullName.prototype.__destroy = function() {
        this.is_destroyed = true;
        return ContactViewModelFullName.__super__.__destroy.apply(this, arguments);
      };
      return ContactViewModelFullName;
    })();
    model = new Backbone.Model({
      first: "Hello"
    });
    view_model = new ContactViewModelFullName(model);
    equal(view_model.first(), "Hello", "Hello exists");
    view_model.retain();
    equal(view_model.refCount(), 2, "ref count 2");
    equal(view_model.is_destroyed, false, "not destroyed");
    view_model.release();
    equal(view_model.refCount(), 1, "ref count 1");
    equal(view_model.is_destroyed, false, "not destroyed");
    view_model.release();
    equal(view_model.refCount(), 0, "ref count 0");
    equal(view_model.is_destroyed, true, "is destroyed using overridden destroy function");
    raises((function() {
      return view_model.first();
    }), null, "Hello doesn't exist anymore");
    return raises((function() {
      return view_model.release();
    }), Error, "ViewModel: ref_count is corrupt: 1");
  });
  test("reference counting and custom __destroy (Javascript inheritance)", function() {
    var ContactViewModelFullName, model, view_model;
    ContactViewModelFullName = kb.ViewModel.extend({
      constructor: function(model) {
        kb.ViewModel.prototype.constructor.call(this, model, {
          requires: ['first', 'last']
        });
        this.is_destroyed = false;
        return this;
      },
      __destroy: function() {
        this.is_destroyed = true;
        return kb.ViewModel.prototype.__destroy.call(this);
      }
    });
    model = new Backbone.Model({
      first: "Hello"
    });
    view_model = new ContactViewModelFullName(model);
    equal(view_model.first(), "Hello", "Hello exists");
    view_model.retain();
    equal(view_model.refCount(), 2, "ref count 2");
    equal(view_model.is_destroyed, false, "not destroyed");
    view_model.release();
    equal(view_model.refCount(), 1, "ref count 1");
    equal(view_model.is_destroyed, false, "not destroyed");
    view_model.release();
    equal(view_model.refCount(), 0, "ref count 0");
    equal(view_model.is_destroyed, true, "is destroyed using overridden destroy function");
    raises((function() {
      return view_model.first();
    }), null, "Hello doesn't exist anymore");
    return raises((function() {
      return view_model.release();
    }), Error, "ViewModel: ref_count is corrupt: 1");
  });
  test("Collection with nested custom view models", function() {
    var ContactViewModelDate, george, george_birthdate, john, john_birthdate, major_duo, minor_duo, nested_model, nested_view_model, paul, paul_birthdate, ringo, ringo_birthdate, validateContactViewModel, validateGenericViewModel;
    kb.stats_on = true;
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
    john_birthdate = new Date(1940, 10, 9);
    john = new Contact({
      name: 'John',
      date: new Date(john_birthdate.valueOf())
    });
    paul_birthdate = new Date(1942, 6, 18);
    paul = new Contact({
      name: 'Paul',
      date: new Date(paul_birthdate.valueOf())
    });
    george_birthdate = new Date(1943, 2, 25);
    george = new Contact({
      name: 'George',
      date: new Date(george_birthdate.valueOf())
    });
    ringo_birthdate = new Date(1940, 7, 7);
    ringo = new Contact({
      name: 'Ringo',
      date: new Date(ringo_birthdate.valueOf())
    });
    major_duo = new Backbone.Collection([john, paul]);
    minor_duo = new Backbone.Collection([george, ringo]);
    nested_model = new Backbone.Model({
      john: john,
      paul: paul,
      george: george,
      george2: george,
      ringo: ringo,
      major_duo: major_duo,
      major_duo2: major_duo,
      major_duo3: major_duo,
      minor_duo: minor_duo,
      minor_duo2: minor_duo,
      minor_duo3: minor_duo
    });
    nested_view_model = kb.viewModel(nested_model, {
      children: {
        john: ContactViewModelDate,
        paul: {
          view_model: ContactViewModelDate
        },
        george: {
          view_model_create: function(model) {
            return new ContactViewModelDate(model);
          }
        },
        george2: {
          create: function(model) {
            return new ContactViewModelDate(model);
          }
        },
        major_duo: {
          children: ContactViewModelDate
        },
        major_duo2: {
          children: {
            view_model: ContactViewModelDate
          }
        },
        major_duo3: {
          children: {
            view_model_create: function(model) {
              return new ContactViewModelDate(model);
            }
          }
        },
        minor_duo2: {
          children: {
            view_model: kb.ViewModel
          }
        },
        minor_duo3: {
          children: {
            create: function(model) {
              return new kb.ViewModel(model);
            }
          }
        }
      }
    });
    validateContactViewModel = function(view_model, name, birthdate) {
      var current_date, formatted_date, model;
      model = kb.utils.wrappedModel(view_model);
      equal(view_model.name(), name, "" + (view_model.name()) + ": Name matches");
      Knockback.locale_manager.setLocale('en-GB');
      formatted_date = new LongDateLocalizer(birthdate);
      equal(view_model.date(), formatted_date(), "" + (view_model.name()) + ": Birthdate in Great Britain format");
      view_model.date('10 December 1963');
      current_date = model.get('date');
      equal(current_date.getFullYear(), 1963, "" + (view_model.name()) + ": year is good");
      equal(current_date.getMonth(), 11, "" + (view_model.name()) + ": month is good");
      equal(current_date.getDate(), 10, "" + (view_model.name()) + ": day is good");
      equal(view_model._date().getFullYear(), 1963, "" + (view_model.name()) + ": year is good");
      equal(view_model._date().getMonth(), 11, "" + (view_model.name()) + ": month is good");
      equal(view_model._date().getDate(), 10, "" + (view_model.name()) + ": day is good");
      model.set({
        date: new Date(birthdate.valueOf())
      });
      Knockback.locale_manager.setLocale('fr-FR');
      equal(view_model.date(), formatted_date(), "" + (view_model.name()) + ": Birthdate in France format");
      view_model.date('10 novembre 1940');
      current_date = model.get('date');
      equal(current_date.getFullYear(), 1940, "" + (view_model.name()) + ": year is good");
      equal(current_date.getMonth(), 10, "" + (view_model.name()) + ": month is good");
      equal(current_date.getDate(), 10, "" + (view_model.name()) + ": day is good");
      equal(view_model._date().getFullYear(), 1940, "" + (view_model.name()) + ": year is good");
      equal(view_model._date().getMonth(), 10, "" + (view_model.name()) + ": month is good");
      equal(view_model._date().getDate(), 10, "" + (view_model.name()) + ": day is good");
      return model.set({
        date: new Date(birthdate.valueOf())
      });
    };
    validateGenericViewModel = function(view_model, name, birthdate) {
      equal(view_model.name(), name, "" + (view_model.name()) + ": Name matches");
      return equal(view_model.date().valueOf(), birthdate.valueOf(), "" + (view_model.name()) + ": Birthdate matches");
    };
    validateContactViewModel(nested_view_model.john, 'John', john_birthdate);
    validateContactViewModel(nested_view_model.paul, 'Paul', paul_birthdate);
    validateContactViewModel(nested_view_model.george, 'George', george_birthdate);
    validateContactViewModel(nested_view_model.george2, 'George', george_birthdate);
    validateGenericViewModel(nested_view_model.ringo(), 'Ringo', ringo_birthdate);
    validateContactViewModel(nested_view_model.major_duo()[0], 'John', john_birthdate);
    validateContactViewModel(nested_view_model.major_duo()[1], 'Paul', paul_birthdate);
    validateContactViewModel(nested_view_model.major_duo2()[0], 'John', john_birthdate);
    validateContactViewModel(nested_view_model.major_duo2()[1], 'Paul', paul_birthdate);
    validateContactViewModel(nested_view_model.major_duo3()[0], 'John', john_birthdate);
    validateContactViewModel(nested_view_model.major_duo3()[1], 'Paul', paul_birthdate);
    validateGenericViewModel(nested_view_model.minor_duo()[0], 'George', george_birthdate);
    validateGenericViewModel(nested_view_model.minor_duo()[1], 'Ringo', ringo_birthdate);
    validateGenericViewModel(nested_view_model.minor_duo2()[0], 'George', george_birthdate);
    validateGenericViewModel(nested_view_model.minor_duo2()[1], 'Ringo', ringo_birthdate);
    validateGenericViewModel(nested_view_model.minor_duo3()[0], 'George', george_birthdate);
    validateGenericViewModel(nested_view_model.minor_duo3()[1], 'Ringo', ringo_birthdate);
    kb.utils.release(nested_view_model);
    equal(kb.stats.collection_observables, 0, 'Cleanup: no collection observables');
    equal(kb.stats.view_models, 0, 'Cleanup: no view models');
    return kb.stats_on = false;
  });
  return test("Error cases", function() {});
});