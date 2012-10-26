var bob = new Backbone.Model({id: 1, name:'bob', age:20});
var fred = new Backbone.Model({id: 2, name:'fred', age:30});
var alice = new Backbone.Model({id: 3, name:'alice', age:34});
var people = new Backbone.Collection([bob,fred,alice]);

var inviteForm = new Backbone.Model({
    people: people,
    invite: bob
});

var MyViewModel = function(model) {
    this.people = kb.observable(model, 'people');
    this.invite = kb.observable(model, 'invite');

    this.clearSelection = function() {
        model.set("invite", null);
    };

    this.setSelection = function() {
        model.set("invite", this.model());
    };
};

$(function() {
    window.vm = new MyViewModel(inviteForm);
    ko.applyBindings(window.vm);
});
