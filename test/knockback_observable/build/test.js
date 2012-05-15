// Generated by CoffeeScript 1.3.1

$(document).ready(function() {
  module("knockback_observable.js");
  test("TEST DEPENDENCY MISSING", function() {
    ko.utils;
    _.VERSION;
    return Backbone.VERSION;
  });
  test("Standard use case: direct attributes with read and write", function() {
    var ContactViewModel, model, view_model;
    ContactViewModel = function(model) {
      this.name = kb.observable(model, 'name');
      this.number = kb.observable(model, {
        key: 'number',
        read_only: true
      });
      return this;
    };
    model = new Contact({
      name: 'Ringo',
      number: '555-555-5556'
    });
    view_model = new ContactViewModel(model);
    equal(view_model.name(), 'Ringo', "Interesting name");
    equal(view_model.number(), '555-555-5556', "Not so interesting number");
    view_model.name('Paul');
    equal(model.get('name'), 'Paul', "Name changed");
    equal(view_model.name(), 'Paul', "Name changed");
    raises((function() {
      return view_model.number('9222-222-222');
    }), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
    equal(model.get('number'), '555-555-5556', "Number not changed");
    equal(view_model.number(), '555-555-5556', "Number not changed");
    model.set({
      name: 'Starr',
      number: 'XXX-XXX-XXXX'
    });
    equal(view_model.name(), 'Starr', "Name changed");
    equal(view_model.number(), 'XXX-XXX-XXXX', "Number was changed");
    return kb.utils.release(view_model);
  });
  test("Standard use case: direct attributes with custom read and write", function() {
    var ContactViewModelCustom, model, view_model;
    ContactViewModelCustom = function(model) {
      this.name = kb.observable(model, {
        key: 'name',
        read_only: true,
        read: function() {
          return "First: " + (model.get('name'));
        }
      });
      this.number = kb.observable(model, {
        key: 'number',
        read: function() {
          return "#: " + (model.get('number'));
        },
        write: function(value) {
          return model.set({
            number: value.substring(3)
          });
        }
      });
      return this;
    };
    model = new Contact({
      name: 'Ringo',
      number: '555-555-5556'
    });
    view_model = new ContactViewModelCustom(model);
    equal(view_model.name(), 'First: Ringo', "Interesting name");
    equal(view_model.number(), '#: 555-555-5556', "Not so interesting number");
    raises((function() {
      return view_model.name('Paul');
    }), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
    equal(model.get('name'), 'Ringo', "Name not changed");
    equal(view_model.name(), 'First: Ringo', "Name not changed");
    view_model.number('#: 9222-222-222');
    equal(model.get('number'), '9222-222-222', "Number was changed");
    equal(view_model.number(), '#: 9222-222-222', "Number was changed");
    model.set({
      name: 'Starr',
      number: 'XXX-XXX-XXXX'
    });
    equal(view_model.name(), 'First: Starr', "Name changed");
    equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed");
    return kb.utils.release(view_model);
  });
  test("Read args", function() {
    var ContactViewModelCustom, args, model, view_model;
    args = [];
    ContactViewModelCustom = function(model) {
      this.name = kb.observable(model, {
        key: 'name',
        read: (function(key, arg1, arg2) {
          args.push(arg1);
          args.push(arg2);
          return model.get('name');
        }),
        args: ['name', 1]
      });
      this.number = kb.observable(model, {
        key: 'name',
        read: (function(key, arg) {
          args.push(arg);
          return model.get('number');
        }),
        args: 'number'
      });
      return this;
    };
    model = new Contact({
      name: 'Ringo',
      number: '555-555-5556'
    });
    view_model = new ContactViewModelCustom(model);
    return ok(_.isEqual(args, ['name', 1, 'number']), "got the args");
  });
  test("Standard use case: ko.dependentObservable", function() {
    var ContactViewModel, model, view_model;
    ContactViewModel = function(model) {
      this.name = kb.observable(model, {
        key: 'name',
        write: true
      });
      this.formatted_name = ko.dependentObservable({
        read: this.name,
        write: (function(value) {
          return this.name($.trim(value));
        }),
        owner: this
      });
      return this;
    };
    model = new Contact({
      name: 'Ringo'
    });
    view_model = new ContactViewModel(model);
    equal(view_model.name(), 'Ringo', "Interesting name");
    equal(view_model.formatted_name(), 'Ringo', "Interesting name");
    view_model.formatted_name(' John ');
    equal(view_model.name(), 'John', "Name changed");
    equal(view_model.formatted_name(), 'John', "Name changed");
    return kb.utils.release(view_model);
  });
  return test("Error cases", function() {});
});