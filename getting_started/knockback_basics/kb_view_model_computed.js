var ko = kb.ko;

var model = new Backbone.Model({first_name: "Planet", last_name: "Earth"});

var view_model = kb.viewModel(model);
view_model.full_name = ko.computed((function() {return "" + (this.first_name()) + " " + (this.last_name());}), view_model);

ko.applyBindings(view_model, $('#kb_view_model_computed')[0]);