var SubThing = Backbone.Model.extend({});
var SubThings = Backbone.Collection.extend({
  model: SubThing,
});
var Thing = Backbone.Model.extend({
  initialize: function () {
    this.subthings = new SubThings();
  },
});
var Things = Backbone.Collection.extend({
  model: Thing,
});

var things = new Things([
  { name: 'Thing One', id: 1 },
  { name: 'Thing Two', id: 2 },
]);
var thing = new Thing();

var SubthingViewModel = function (model) {
  this.id = kb.observable(model, 'id');
  this.name = kb.observable(model, 'name');
};

var ThingViewModel = function (model) {
  this.subthings = kb.collectionObservable(model.subthings, {
    view_model: SubthingViewModel,
  });
  this.name = kb.observable(model, 'name');

  this.allThings = kb.collectionObservable(things, {
    view_model: SubthingViewModel,
  });

  this.onSubmit = function (_el) {
    document.getElementById('theJson').innerText = JSON.stringify(thing.subthings.toJSON());
    console.log(this.subthings());
  };
};

var pageViewModel = {
  thing: new ThingViewModel(thing),
};
ko.applyBindings(pageViewModel);
