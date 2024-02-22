var model = new Backbone.Model({ value: 5 });

var viewModel = kb.viewModel(model);

viewModel.countDown = function () {
  model.set('value', model.get('value') - 1);
};
viewModel.reset = function () {
  model.set('value', 5);
};

ko.applyBindings(viewModel, document.body);
