$(document).ready(function() {
  module("knockback_triggered_observable.js");
  test("TEST DEPENDENCY MISSING", function() {
    ko.utils;
    _.VERSION;
    return Backbone.VERSION;
  });
  kb.locale_manager = new LocaleManager('en', {
    'en': {
      formal_hello: 'Hello'
    },
    'en-GB': {
      formal_hello: 'Good day sir'
    },
    'fr-FR': {
      informal_hello: 'Bonjour'
    }
  });
  test("Standard use case: simple events notifications", function() {
    var trigger_count, view_model;
    trigger_count = 0;
    view_model = {
      triggered_observable: kb.triggeredObservable(kb.locale_manager, 'change')
    };
    view_model.counter = ko.dependentObservable(function() {
      view_model.triggered_observable();
      return trigger_count++;
    });
    equal(trigger_count, 1, "1: was set up");
    kb.locale_manager.trigger('change', kb.locale_manager);
    equal(trigger_count, 2, "2: changed");
    kb.locale_manager.setLocale('fr-FR');
    equal(trigger_count, 3, "3: changed");
    kb.vmDestroy(view_model);
    kb.locale_manager.setLocale('fr-FR');
    return equal(trigger_count, 3, "3: no change");
  });
  return test("Error cases", function() {});
});