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
_mergeArray = (result, key, value) ->
  result[key] or= []
  value = [value] unless _.isArray(value)
  result[key] = if result[key].length then _.union(result[key], value) else value
  return result

# @nodoc
_mergeObject = (result, key, value) -> result[key] or= {}; return _.extend(result[key], value)

# @nodoc
_keyArrayToObject = (value) -> result = {}; result[item] = {key: item} for item in value; return result

_mergeOptions = (result, options) ->
  return result unless options
  for key, value of options
    switch key
      when 'internals', 'requires', 'excludes', 'statics' then _mergeArray(result, key, value)
      when 'keys'
        # an object
        if (_.isObject(value) and not _.isArray(value)) or (_.isObject(result[key]) and not _.isArray(result[key]))
          value = [value] unless _.isObject(value)
          value = _keyArrayToObject(value) if _.isArray(value)
          result[key] = _keyArrayToObject(result[key]) if _.isArray(result[key])
          _mergeObject(result, key, value)

        # an array
        else
          _mergeArray(result, key, value)

      when 'factories'
        if _.isFunction(value) then result[key] = value else _mergeObject(result, key, value)
      when 'static_defaults' then _mergeObject(result, key, value)
      when 'options' then
      else
        result[key] = value

  return _mergeOptions(result, options.options)

# @nodoc
module.exports = (options) -> _mergeOptions({}, options)
