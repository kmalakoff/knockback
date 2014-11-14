###
  knockback.js 0.20.5
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
###

root = if window? then window else global

{_} = kb = require '../kb'

Supermodel = null # lazy check

# @nodoc
module.exports = class Supermodel
  @isAvailable: -> return !!Supermodel = root.Supermodel # or require?('supermodel') # webpack optionals

  @keys: (model) ->
    return null unless model instanceof Supermodel.Model
    return _.keys(model.constructor.associations())

  @relationType: (model, key) ->
    return null unless model instanceof Supermodel.Model
    return null unless relation = model.constructor.associations()[key]
    return if relation.add then kb.TYPE_COLLECTION else kb.TYPE_MODEL

  @bind: (model, key, update, path) ->
    return null unless type = @relationType(model, key)
    rel_fn = (model, other) ->
      not kb.statistics or kb.statistics.addModelEvent({name: 'update (supermodel)', model: model, key: key, path: path})

      # HACK: the relationship may not be set until after this call
      relation = model.constructor.associations()[key]
      previous = model[relation.store]
      model[relation.store] = other
      update(other)
      model[relation.store] = previous
    if type is kb.TYPE_MODEL
      model.bind("associate:#{key}", rel_fn)
      return -> model.unbind("associate:#{key}", rel_fn)
    return

  @useFunction: (model, key) -> return !!@relationType(model, key)
