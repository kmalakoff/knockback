const Model = Backbone.RelationalModel.extend({
  url: '...',
});


const ListModel = Backbone.RelationalModel.extend({
  url: '...',
  relations: [{
    type: Backbone.HasMany,
    key: 'coll',
    relatedModel: Model,
  },
  ],
});

ModelViewModel = kb.ViewModel.extend({
  constructor(model) {
    kb.ViewModel.prototype.constructor.apply(this, arguments);
    this.cancel = function () { this.model().destroy(); };
  },
});

const listModel = new ListModel();
listModel.get('coll').reset([new Model(), new Model()]);

const viewModel = new kb.viewModel(listModel, {
  factories: {
    'coll.models': ModelViewModel,
  },
});


ko.applyBindings(viewModel, $('#some-div')[0]);
