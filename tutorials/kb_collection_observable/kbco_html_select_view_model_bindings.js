var ko = kb.ko;

var people = new Backbone.Collection([{name: 'Bob'}, {name: 'Sarah'}, {name: 'George'}]);
var selected_people = new Backbone.Collection();

var view_model = {
  people: kb.collectionObservable(people),
  selected_people: kb.collectionObservable(selected_people)
};

ko.applyBindings(view_model, $('#kbco_html_select')[0]);