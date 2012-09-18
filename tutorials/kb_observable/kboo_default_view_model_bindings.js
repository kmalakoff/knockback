var model = new Backbone.Model({});

var ViewModel = function(model) {
  this.name = kb.observable(model, 'name');
  this.name_with_default = kb.observable(model, {key: 'name', "default": '(no name)'});
};

var view_model = new ViewModel(model);

ko.applyBindings(view_model, $('#kboo_default')[0]);