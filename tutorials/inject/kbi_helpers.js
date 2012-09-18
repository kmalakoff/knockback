ko.bindingHandlers['classes'] = {
  update: function(element, value_accessor) {
    classes = ko.utils.unwrapObservable(value_accessor());
    for (var key in classes) {
      var state = classes[key];
      if (state) {
        $(element).addClass(key);
      } else {
        $(element).removeClass(key);
      }
}}};

window.loadUrl = function(url) {
  return Backbone.history.loadUrl(url);
};

window.loadUrlFn = function(url) {
  return function() {
    return Backbone.history.loadUrl(url);
  };
};