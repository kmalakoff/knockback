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
  return test("Error cases", function() {});
});