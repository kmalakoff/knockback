var bob = new Backbone.Model({name: "Bob"});
var fred = new Backbone.Model({name: "Fred", friends: new Backbone.Collection([bob])});
bob.set({friends: new Backbone.Collection([fred])});

var FriendViewModel = function(model, options) {
  this.name = kb.observable(model, 'name');
  this.type = ko.observable('friend');
  this.friends = kb.collectionObservable(model.get('friends'), kb.utils.optionsPathJoin(options, 'friends'));
  return this;
};

var PersonViewModel = kb.ViewModel.extend({
  constructor: function(model, options) {
    kb.ViewModel.prototype.constructor.apply(this, arguments);
    this.type = ko.observable('person');
  }
});

var view_model = new PersonViewModel(fred, {
  factories: {
    'friends.models': FriendViewModel,
    'friends.models.friends.models': FriendViewModel
  }
});

ko.applyBindings(view_model, $('#kbnm_view_models')[0]);