let SubThing = Backbone.Model.extend({}),
  SubThings = Backbone.Collection.extend({
    model: SubThing,
  }),
  Thing = Backbone.Model.extend({
    initialize() {
      this.subthings = new SubThings();
    },
  }),
  Things = Backbone.Collection.extend({
    model: Thing,
  });

let things = new Things([
        { name: 'Thing One', id: 1 }, { name: 'Thing Two', id: 2 },
  ]),
  thing = new Thing();

const SubthingViewModel = function (model) {
  this.id = kb.observable(model, 'id');
  this.name = kb.observable(model, 'name');
};

const ThingViewModel = function (model) {
  this.subthings = kb.collectionObservable(model.subthings, {
    view_model: SubthingViewModel,
  });
  this.name = kb.observable(model, 'name');

  this.allThings = kb.collectionObservable(things, {
    view_model: SubthingViewModel,
  });

  this.onSubmit = function (el) {
    document.getElementById('theJson').innerText = JSON.stringify(thing.subthings.toJSON());
    console.log(this.subthings());
  };
};

const pageViewModel = {
  thing: new ThingViewModel(thing),

};
ko.applyBindings(pageViewModel);
