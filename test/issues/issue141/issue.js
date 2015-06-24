var Model = Backbone.RelationalModel.extend({
    url: '...'
});


var ListModel = Backbone.RelationalModel.extend({
    url: '...',
    relations: [{
            type: Backbone.HasMany,
            key: 'coll',
            relatedModel: Model
        }
    ]
});

ModelViewModel = kb.ViewModel.extend({
    constructor: function (model) {
        kb.ViewModel.prototype.constructor.apply(this, arguments);
        this.cancel = function () {this.model().destroy();}
    }
});

var listModel = new ListModel();
listModel.get('coll').reset([new Model(), new Model()]);

var viewModel = new kb.viewModel(listModel, {
    factories: {
        'coll.models': ModelViewModel
    }
});


ko.applyBindings(viewModel, $('#some-div')[0]);
