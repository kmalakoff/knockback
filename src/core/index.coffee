###
  knockback.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
###

module.exports = kb = require './kb'

# re-expose modules
kb.modules = {underscore: kb._, backbone: kb.Parse or kb.Backbone, knockout: kb.ko}
if window?
  window._ or window._ = kb._
  (window.Backbone or window.Backbone = kb.Backbone) if kb.Backbone
  (window.Parse or window.Parse = kb.Parse) if kb.Parse
  window.ko or window.ko = kb.ko
