const bob = new Backbone.Model({ id: 1, name: 'bob', age: 20 });
const fred = new Backbone.Model({ id: 2, name: 'fred', age: 30 });
const alice = new Backbone.Model({ id: 3, name: 'alice', age: 34 });
const people = new Backbone.Collection([bob, fred, alice]);

const inviteForm = new Backbone.Model({
  people,
  invite: bob,
});

const MyViewModel = function (model) {
  this.people = kb.observable(model, 'people');
  this.invite = kb.observable(model, 'invite');

  this.clearSelection = function () {
    model.set('invite', null);
  };

  this.setSelection = function () {
    model.set('invite', this.model());
  };
};

$(() => {
  window.vm = new MyViewModel(inviteForm);
  ko.applyBindings(window.vm);
});
