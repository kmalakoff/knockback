###
  knockback.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
###

root = if window? then window else global
module.exports = kb = require './kb'
_ = kb._

# re-expose modules
kb.modules = {underscore: kb._, backbone: kb.Parse or kb.Backbone, knockout: kb.ko}
_.defaults(root, _.pick(kb, '_', 'Backbone', 'Parse', 'ko', '$'))
