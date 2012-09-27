// helper to toggle classes
ko.bindingHandlers['classes'] = {
  update: function(element, value_accessor) {
    var classes = ko.utils.unwrapObservable(value_accessor());
    for (var key in classes) {
      $(element)[ko.utils.unwrapObservable(classes[key]) ? 'addClass' : 'removeClass'](key);
    }
}};

// helpers to manage push state
window.loadUrl = function(url) { return Backbone.history.loadUrl(url); };
window.loadUrlFn = function(url) { return function() { return Backbone.history.loadUrl(url); }; };