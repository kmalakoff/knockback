class Contact extends Backbone.Model
  defaults:
    name: ''
    number: 0
    date: new Date()

class ContactsCollection extends Backbone.Collection
  model: Contact

class NameSortedContactsCollection extends Backbone.Collection
  model: Contact
  comparator: (model) -> return model.get('name')
