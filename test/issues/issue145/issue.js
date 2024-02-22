// MODIFIED from: https://stackoverflow.com/questions/15111361/backbone-localstorage-saves-but-does-not-fetch-collection-using-knockback

var Player = Backbone.Model.extend({
  urlRoot: "/players",
  localStorage: new Backbone.LocalStorage("players"),
  defaults: { name: "Unnamed", team: "Unassigned" },
});
var Players = Backbone.Collection.extend({
  url: "/players",
  model: Player,
  localStorage: new Backbone.LocalStorage("players"),
});

function GameViewModel() {
  var self = this;

  this.players = kb.collectionObservable(new Players());

  console.log("BEFORE fetch: ", self.players.collection().models);
  this.players.collection().fetch({
    success: function () {
      console.log("AFTER fetch: ", self.players.collection().models);
    },
  });
}

// save one if none exist yet
var players = new Players();
if (!players.localStorage.findAll().length) {
  new Player().save({ name: _.uniqueId("Player ") });
}

ko.applyBindings(new GameViewModel());
