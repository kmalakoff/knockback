Contact = Backbone.Model.extend({
  defaults:
    name: ''
    number: 0
    date: new Date()
})

ContactsCollection = Backbone.Collection.extend({
  model: Contact
})

NameSortedContactsCollection = Backbone.Collection.extend({
  model: Contact
  comparator: (model) -> return model.get('name')
})
