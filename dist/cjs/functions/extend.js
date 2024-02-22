/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/ // From Backbone.js (https:github.com/documentcloud/backbone)
"use strict";
var copyProps = function copyProps(dest, source) {
    for(var key in source){
        var value = source[key];
        dest[key] = value;
    }
    return dest;
};
// Shared empty constructor function to aid in prototype-chain creation.
var ctor = function ctor() {};
// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to 'goog.inherits', but uses a hash of prototype properties and
// class properties to be extended.
var inherits = function inherits(parent, protoProps, staticProps) {
    var child;
    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your extend definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty("constructor")) {
        child = protoProps.constructor;
    } else {
        child = function child() {
            parent.apply(this, arguments);
        };
    }
    // Inherit class (static) properties from parent.
    copyProps(child, parent);
    // Set the prototype chain to inherit from parent, without calling
    // parent's constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) copyProps(child.prototype, protoProps);
    // Add static properties to the constructor function, if supplied.
    if (staticProps) copyProps(child, staticProps);
    // Correctly set child's 'prototype.constructor'.
    child.prototype.constructor = child;
    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;
    return child;
};
// The self-propagating extend function that BacLCone classes use.
var extend = function extend(protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
};
module.exports = extend;
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }