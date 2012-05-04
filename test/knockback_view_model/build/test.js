var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
$(document).ready(function() {
  module("knockback_view_model.js");
  test("TEST DEPENDENCY MISSING", function() {
    ko.utils;
    _.VERSION;
    return Backbone.VERSION;
  });
  Knockback.locale_manager = new LocaleManager('en', {});
  test("Collection with nested custom view models", function() {
    var ContactViewModelDate, george, george_birthdate, john, john_birthdate, major_duo, minor_duo, nested_model, nested_view_model, paul, paul_birthdate, ringo, ringo_birthdate, validateContactViewModel, validateGenericViewModel;
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
            view_model_create: function(model) {
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
    return kb.utils.release(nested_view_model);
  });
  return test("Error cases", function() {});
});