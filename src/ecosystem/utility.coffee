if @Parse
  _ = @Parse._
else if not _ = @_
  (try _ = require(key) catch finally break if _) for key in ['lodash', 'underscore']
kb._ = _