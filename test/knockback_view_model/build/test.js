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
  test("Using in conjunction with kb.viewModel with Coffeescript classes", function() {
    var ContactViewModelCustom, model, view_model;
    ContactViewModelCustom = (function() {
      __extends(ContactViewModelCustom, kb.ViewModel);
      function ContactViewModelCustom(model) {
        ContactViewModelCustom.__super__.constructor.call(this, model);
        this.formatted_name = kb.observable(model, {
          key: 'name',
          read: function() {
            return "First: " + (model.get('name'));
          }
        });
        this.formatted_number = kb.observable(model, {
          key: 'number',
          read: function() {
            return "#: " + (model.get('number'));
          },
          write: function(value) {
            return model.set({
              number: value.substring(3)
            });
          }
        }, this);
      }
      return ContactViewModelCustom;
    })();
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
  test("Using in conjunction with kb.viewModel without Coffeescript classes", function() {
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
  return test("Error cases", function() {});
});