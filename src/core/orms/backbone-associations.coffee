###
  knockback.js 0.20.5
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
###

{_, Backbone} = kb = require '../kb'

AssociatedModel = null # lazy check

# @nodoc
module.exports = class BackboneAssociations
  @isAvailable: -> return !!AssociatedModel = Backbone?.AssociatedModel # or require?('backbone-associations')?.AssociatedModel # webpack optionals

  @keys: (model) ->
    return null unless model instanceof AssociatedModel
    return _.map(model.relations, (test) -> test.key)

  @relationType: (model, key) ->
    return null unless model instanceof AssociatedModel
    return null unless relation = _.find(model.relations, (test) -> return test.key is key)
    return if (relation.type is 'Many') then kb.TYPE_COLLECTION else kb.TYPE_MODEL

  @useFunction: -> false
