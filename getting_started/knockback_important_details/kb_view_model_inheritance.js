var model = new Backbone.Model({
  first_name: "Planet",
  last_name: "Earth"
});

var ViewModel = kb.ViewModel.extend({
  constructor: function(model) {
    kb.ViewModel.prototype.constructor.apply(this, arguments);
    this.full_name = ko.computed((function() {
      return "" + (this.first_name()) + " " + (this.last_name());
    }), this);
  }
});

var view_model = new ViewModel(model);

ko.applyBindings(view_model, $('#kb_view_model_inheritance')[0]);
