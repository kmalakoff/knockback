var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
$(document).ready(function() {
  module("knockback_formatted_observable.js");
  test("TEST DEPENDENCY MISSING", function() {
    ko.utils;
    _.VERSION;
    return Backbone.VERSION;
  });
  test("Various scenarios", function() {
    var ContactViewModelCustom, model, view_model;
    ContactViewModelCustom = (function() {
      __extends(ContactViewModelCustom, kb.ViewModel);
      function ContactViewModelCustom(model) {
        ContactViewModelCustom.__super__.constructor.call(this, model, {
          internals: ['name', 'number']
        });
        this.name = ko.dependentObservable(__bind(function() {
          return "Name: " + (this._name());
        }, this));
        this.number = kb.formattedObservable('#: {0}', this._number);
        this.name_number = kb.formattedObservable('Name: {0}, #: {1}', this._name, this._number);
        this.number_name = kb.formattedObservable('#: {1}, Name: {0}', this._name, this._number);
        this.name_number_name = kb.formattedObservable('Name: {0}, #: {1}, Name: {0}', this._name, this._number, this._name);
      }
      return ContactViewModelCustom;
    })();
    model = new Contact({
      name: 'Ringo',
      number: '555-555-5556'
    });
    view_model = new ContactViewModelCustom(model);
    equal(view_model._name(), 'Ringo', "Interesting name");
    equal(view_model.name(), 'Name: Ringo', "Interesting name");
    equal(view_model._number(), '555-555-5556', "Not so interesting number");
    equal(view_model.number(), '#: 555-555-5556', "Not so interesting number");
    equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', "combined in order");
    equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', "combined out of order");
    equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', "combined repeat");
    model.set({
      name: 'Starr',
      number: 'XXX-XXX-XXXX'
    });
    equal(view_model._name(), 'Starr', "Name changed");
    equal(view_model.name(), 'Name: Starr', "Name changed");
    equal(view_model._number(), 'XXX-XXX-XXXX', "Number was changed");
    equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed");
    equal(view_model.name_number(), 'Name: Starr, #: XXX-XXX-XXXX', "combined in order");
    equal(view_model.number_name(), '#: XXX-XXX-XXXX, Name: Starr', "combined out of order");
    equal(view_model.name_number_name(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr', "combined repeat");
    view_model._name('Ringo');
    view_model._number('555-555-5556');
    equal(view_model._name(), 'Ringo', "Interesting name");
    equal(view_model.name(), 'Name: Ringo', "Interesting name");
    equal(view_model._number(), '555-555-5556', "Not so interesting number");
    equal(view_model.number(), '#: 555-555-5556', "Not so interesting number");
    equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', "combined in order");
    equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', "combined out of order");
    equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', "combined repeat");
    view_model.number('#: 9222-222-222');
    equal(model.get('number'), '9222-222-222', "Number was changed");
    equal(view_model._number(), '9222-222-222', "Number was changed");
    equal(view_model.number(), '#: 9222-222-222', "Number was changed");
    equal(view_model.name_number(), 'Name: Ringo, #: 9222-222-222', "combined in order");
    equal(view_model.number_name(), '#: 9222-222-222, Name: Ringo', "combined out of order");
    equal(view_model.name_number_name(), 'Name: Ringo, #: 9222-222-222, Name: Ringo', "combined repeat");
    view_model.name_number('Name: Starr, #: XXX-XXX-XXXX');
    equal(view_model._name(), 'Starr', "Name changed");
    equal(view_model.name(), 'Name: Starr', "Name changed");
    equal(view_model._number(), 'XXX-XXX-XXXX', "Number was changed");
    equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed");
    equal(view_model.name_number(), 'Name: Starr, #: XXX-XXX-XXXX', "combined in order");
    equal(view_model.number_name(), '#: XXX-XXX-XXXX, Name: Starr', "combined out of order");
    equal(view_model.name_number_name(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr', "combined repeat");
    view_model.number_name('#: 555-555-5556, Name: Ringo');
    equal(view_model._name(), 'Ringo', "Interesting name");
    equal(view_model.name(), 'Name: Ringo', "Interesting name");
    equal(view_model._number(), '555-555-5556', "Not so interesting number");
    equal(view_model.number(), '#: 555-555-5556', "Not so interesting number");
    equal(view_model.name_number(), 'Name: Ringo, #: 555-555-5556', "combined in order");
    equal(view_model.number_name(), '#: 555-555-5556, Name: Ringo', "combined out of order");
    equal(view_model.name_number_name(), 'Name: Ringo, #: 555-555-5556, Name: Ringo', "combined repeat");
    view_model.name_number_name('Name: Starr, #: XXX-XXX-XXXX, Name: Bongo');
    equal(view_model._name(), 'Starr', "Name changed");
    equal(view_model.name(), 'Name: Starr', "Name changed");
    equal(view_model._number(), 'XXX-XXX-XXXX', "Number was changed");
    equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed");
    equal(view_model.name_number(), 'Name: Starr, #: XXX-XXX-XXXX', "combined in order");
    equal(view_model.number_name(), '#: XXX-XXX-XXXX, Name: Starr', "combined out of order");
    equal(view_model.name_number_name(), 'Name: Starr, #: XXX-XXX-XXXX, Name: Starr', "combined repeat");
    return kb.vmRelease(view_model);
  });
  return test("Error cases", function() {});
});