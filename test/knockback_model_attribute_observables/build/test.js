var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
$(document).ready(function() {
  module("knockback_model_attribute_observables.js");
  test("TEST DEPENDENCY MISSING", function() {
    ko.utils;
    _.VERSION;
    return Backbone.VERSION;
  });
  Knockback.locale_manager = new LocaleManager('en', {});
  test("Standard use case: just enough to get the picture", function() {
    var ContactViewModel, current_date, model, view_model;
    ContactViewModel = (function() {
      function ContactViewModel(model) {
        this.attribute_observables = new kb.ModelAttributeObservables(model, {
          name: {
            keypath: 'name'
          },
          number: {
            keypath: 'number',
            write: true
          },
          date: {
            keypath: 'date',
            write: true,
            localizer: __bind(function(value) {
              return new LongDateLocalizer(value);
            }, this)
          }
        }, this);
      }
      ContactViewModel.prototype.destroy = function() {
        return this.attribute_observables.destroy();
      };
      return ContactViewModel;
    })();
    model = new Contact({
      name: 'John',
      number: '555-555-5558',
      date: new Date(1940, 10, 9)
    });
    view_model = new ContactViewModel(model);
    equal(view_model.name(), 'John', "It is a name");
    equal(view_model.number(), '555-555-5558', "Not so interesting number");
    Knockback.locale_manager.setLocale('en-GB');
    equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
    Knockback.locale_manager.setLocale('fr-FR');
    equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    raises((function() {
      return view_model.name('Paul');
    }), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
    equal(model.get('name'), 'John', "Name not changed");
    equal(view_model.name(), 'John', "Name not changed");
    view_model.number('9222-222-222');
    equal(model.get('number'), '9222-222-222', "Number was changed");
    equal(view_model.number(), '9222-222-222', "Number was changed");
    Knockback.locale_manager.setLocale('en-GB');
    view_model.date('10 December 1963');
    current_date = model.get('date');
    equal(current_date.getFullYear(), 1963, "year is good");
    equal(current_date.getMonth(), 11, "month is good");
    equal(current_date.getDate(), 10, "day is good");
    model.set({
      name: 'Yoko',
      number: '818-818-8181'
    });
    equal(view_model.name(), 'Yoko', "Name changed");
    equal(view_model.number(), '818-818-8181', "Number was changed");
    model.set({
      date: new Date(1940, 10, 9)
    });
    Knockback.locale_manager.setLocale('fr-FR');
    equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    view_model.date('10 novembre 1940');
    current_date = model.get('date');
    equal(current_date.getFullYear(), 1940, "year is good");
    equal(current_date.getMonth(), 10, "month is good");
    return equal(current_date.getDate(), 10, "day is good");
  });
  return test("Error cases", function() {});
});