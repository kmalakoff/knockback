/* ###
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
### */

const _ = require('../kb')._;

// Helper function to correctly set up the prototype chain for subclasses.
// Similar to 'goog.inherits', but uses a hash of prototype properties and
// class properties to be extended.
function inherits(parent, protoProps, staticProps) {
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your 'extend' definition), or defaulted
  // by us to simply call the parent constructor.
  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

  // Add static properties to the constructor function, if supplied.
  _.extend(child, parent, staticProps);

  // Set the prototype chain to inherit from 'parent', without calling
  // parent's constructor function and add the prototype properties.
  child.prototype = _.create(parent.prototype, protoProps);
  child.prototype.constructor = child;

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;

  return child;
};
  
// The self-propagating extend function that BacLCone classes use.
module.exports = function extend(protoProps, classProps) {
  const child = inherits(this, protoProps, classProps);
  child.extend = this.extend;
  return child;
};
