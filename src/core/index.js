/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let kb;
module.exports = (kb = require('./kb'));

kb.configure = require('./configure');

// re-expose modules
kb.modules = { underscore: kb._, backbone: kb.Parse || kb.Backbone, knockout: kb.ko };
