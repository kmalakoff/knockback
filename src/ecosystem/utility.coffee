if @Parse
  kb._ = _ = @Parse._
else
  if not @_ and (typeof(require) isnt 'undefined') then (try _ = require('lodash') catch e then _ = require('underscore')) else _ = @_

  kb._ = _ = if _.hasOwnProperty('_') then _._ else _ # LEGACY
  if _.where and not _.findWhere # PATCH: lo-dash REMOVE AFTER _.findWhere IS ADDED
    _.mixin({findWhere: (obj, attrs) -> result = _.where(obj, attrs); if result.length then result[0] else null})
