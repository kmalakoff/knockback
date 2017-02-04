var ko = kb.ko;

var earth = new Backbone.Model({first_name: 'Planet', last_name: 'Earth'});
var mars = new Backbone.Model({first_name: 'Planet', last_name: 'Mars'});
var the_moon = new Backbone.Model({first_name: 'The', last_name: 'Moon'});

var planets = new Backbone.Collection([earth, the_moon, mars]);

var view_model = {
  planets: kb.collectionObservable(planets, { view_model: kb.ViewModel })
};

ko.applyBindings(view_model, $('#kb_collection')[0]);