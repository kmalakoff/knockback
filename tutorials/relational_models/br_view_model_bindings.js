var ko = kb.ko;

var bob = new Person({id: 'person-1', name: 'Bob'});
var fred = new Person({id: 'person-2', name: 'Fred'});

var house = new House({
  location: 'In the middle of our street',
  occupants: ['person-1', 'person-2']
});

var view_model = kb.viewModel(house);

ko.applyBindings(view_model, $('#br_relational_models')[0]);