var view_model = {
  people: kb.collectionObservable(new Backbone.Collection([bob, fred]), {
    factories: {
      'models': PersonViewModel,
      'models.friends.models': FriendViewModel
    }
  })
};