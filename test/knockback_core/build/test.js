$(document).ready(function() {
  module("knockback core.js");
  test("TEST DEPENDENCY MISSING", function() {
    ko.utils;
    _.VERSION;
    return Backbone.VERSION;
  });
  test("Deprecated functions still exist", function() {
    Knockback.wrappedObservable({
      __kb: {
        observable: {}
      }
    });
    Knockback.vmModel({
      __kb: {
        model: {}
      }
    });
    Knockback.vmSetToDefault({});
    Knockback.vmRelease({});
    return Knockback.vmReleaseObservable(ko.observable());
  });
  return test("Error cases", function() {});
});