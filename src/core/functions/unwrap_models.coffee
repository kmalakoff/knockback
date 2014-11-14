###
  knockback.js 0.20.5
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
###

{_} = require '../kb'

# @nodoc
module.exports = unwrapModels = (obj) ->
  return obj unless obj

  return (if obj.__kb.hasOwnProperty('object') then obj.__kb.object else obj) if obj.__kb
  return _.map(obj, (test) -> return unwrapModels(test)) if _.isArray(obj)
  if _.isObject(obj) and (obj.constructor is {}.constructor) # a simple object
    result = {}
    result[key] = unwrapModels(value) for key, value of obj
    return result

  return obj
