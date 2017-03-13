// MODIFIED from: https://stackoverflow.com/questions/15111361/backbone-localstorage-saves-but-does-not-fetch-collection-using-knockback

const Player = Backbone.Model.extend({
  urlRoot: '/players',
  localStorage: new Backbone.LocalStorage('players'),
  defaults: { name: 'Unnamed', team: 'Unassigned' },
});
const Players = Backbone.Collection.extend({
  url: '/players',
  model: Player,
  localStorage: new Backbone.LocalStorage('players'),
});

function GameViewModel() {
  const self = this;

  this.players = kb.collectionObservable(new Players());

  console.log('BEFORE fetch: ', self.players.collection().models);
  this.players.collection().fetch({ success() {
    console.log('AFTER fetch: ', self.players.collection().models);
  } });
}

// save one if none exist yet
const players = new Players();
if (!players.localStorage.findAll().length) {
  new Player().save({ name: _.uniqueId('Player ') });
}

ko.applyBindings(new GameViewModel());
