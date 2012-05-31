# import Underscore, Backbone, Knockout, and Knockback
_ = if not @_ and (typeof(require) != 'undefined') then require('underscore') else @_
Backbone = if not @Backbone and (typeof(require) != 'undefined') then require('backbone') else @Backbone
ko = if not @ko and (typeof(require) != 'undefined') then require('knockout') else @ko
kb = if not @kb and (typeof(require) != 'undefined') then require('knockback') else @kb

# examples namespace
kb._ || kb._ = {};

kb._.Contact = Backbone.Model.extend({
  defaults:
    name: ''
    number: 0
    date: new Date()
})

kb._.ContactsCollection = Backbone.Collection.extend({
  model: kb._.Contact
})

kb._.NameSortedContactsCollection = Backbone.Collection.extend({
  model: kb._.Contact
  comparator: (model) -> return model.get('name')
})
