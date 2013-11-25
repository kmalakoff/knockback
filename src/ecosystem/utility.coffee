if @Parse
  _ = @Parse._
else if not _ = @_
  (try _ = require(_key) catch finally break if _) for _key in ['lodash', 'underscore']
kb._ = _