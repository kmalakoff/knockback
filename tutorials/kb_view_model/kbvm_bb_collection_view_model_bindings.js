var bob = new Backbone.Model({name: 'Bob', friends: new Backbone.Collection([new Backbone.Model({name: 'Fred'}), new Backbone.Model({name: 'John'})])});

var view_model = kb.viewModel(bob);

ko.applyBindings(view_model, $('#kbvm_bb_collection')[0]);