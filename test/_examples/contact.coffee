kb.Contact = Backbone.Model.extend({
  defaults:
    name: ''
    number: 0
    date: new Date()
})

kb.ContactsCollection = Backbone.Collection.extend({
  model: kb.Contact
})

kb.NameSortedContactsCollection = Backbone.Collection.extend({
  model: kb.Contact
  comparator: (model) -> return model.get('name')
})