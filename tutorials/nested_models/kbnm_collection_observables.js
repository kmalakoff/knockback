var bob = new Backbone.Model({name: "Bob", friends: new Backbone.Collection()});
var fred = new Backbone.Model({name: "Fred", friends: new Backbone.Collection([bob])});

var FriendViewModel = function(model) {
  this.name = kb.observable(model, 'name');
  this.type = ko.observable('friend');
  return this;
};

var PersonViewModel = kb.ViewModel.extend({
  constructor: function(model, options) {
    kb.ViewModel.prototype.constructor.apply(this, arguments);
    this.type = ko.observable('person');
  }
});

var view_model = {
  people: kb.collectionObservable(new Backbone.Collection([bob, fred]), {
    factories: {
      'models': PersonViewModel,
      'models.friends.models': FriendViewModel
    }
  })
};

ko.applyBindings(view_model, $('#kbnm_collection_observables')[0]);
