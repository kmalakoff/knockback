if @Parse
  _ = @Parse._
else if not _ = @_
  (try _ = require(key) catch finally break) for key in ['lodash', 'underscore']

# LEGACY
_ = if '_' in _ then _._ else _
if _.where and not _.findWhere # PATCH: lo-dash REMOVE AFTER _.findWhere IS ADDED
  _.mixin({findWhere: (obj, attrs) -> result = _.where(obj, attrs); if result.length then result[0] else null})

kb._ = _