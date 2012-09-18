var bob = new Backbone.Model({name: 'Bob', friend: new Backbone.Model({name: 'Fred'})});

var view_model = kb.viewModel(bob);

ko.applyBindings(view_model, $('#kbvm_bb_model')[0]);