var ko = kb.ko;

var people = new Backbone.Collection([{first: 'Jeremy', last: 'Ashkenas'}, {first: 'Steven', last: 'Sanderson'}, {first: 'Kevin', last: 'Malakoff'}]);
var filtered_names = ko.observableArray(['Kevin']);

var view_model = {
  filtered_names: filtered_names,
  available_names: ko.observableArray(people.map(function(model) { return model.get('first'); })),
  people: kb.collectionObservable(people, {filters: function(model) { return model.get('first') === filtered_names()[0]; } })
};

ko.applyBindings(view_model, $('#kbco_filtering')[0]);