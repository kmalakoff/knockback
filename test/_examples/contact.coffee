# import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
if (typeof(require) != 'undefined') then (try _ = require('lodash') catch e then _ = require('underscore')) else _ = @_
_ = _._ if _ and (_.hasOwnProperty('_')) # LEGACY
Backbone = if not @Backbone and (typeof(require) != 'undefined') then require('backbone') else @Backbone
ko = if not @ko and (typeof(require) != 'undefined') then require('knockout') else @ko
kb = if not @kb and (typeof(require) != 'undefined') then require('knockback') else @kb

# export or create _kbe namespace
_kbe = @_kbe = if (typeof(exports) != 'undefined') then exports else {}

_kbe.Contact = Backbone.Model.extend({
  defaults:
    name: ''
    number: 0
    date: new Date()
})

_kbe.ContactsCollection = Backbone.Collection.extend({
  model: _kbe.Contact
})

_kbe.NameSortedContactsCollection = Backbone.Collection.extend({
  model: _kbe.Contact
  comparator: (model) -> return model.get('name')
})
