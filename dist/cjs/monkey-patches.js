/*
 * decaffeinate suggestions:
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */ /*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/ "use strict";
var kb;
var ko = (kb = require("./kb")).ko;
// Allow for dependent release until is resolved https://github.com/knockout/knockout/issues/1464
if (__guard__(ko.subscribable != null ? ko.subscribable.fn : undefined, function(x) {
    return x.extend;
})) {
    var _extend = ko.subscribable.fn.extend;
    ko.subscribable.fn.extend = function() {
        var target = _extend.apply(this, arguments);
        // release the extended observable
        if (target !== this && kb.isReleaseable(this)) {
            var _dispose = target.dispose;
            target.dispose = (function() {
                if (_dispose != null) {
                    _dispose.apply(target, arguments);
                }
                return kb.release(this);
            }).bind(this);
        }
        return target;
    };
}
function __guard__(value, transform) {
    return typeof value !== "undefined" && value !== null ? transform(value) : undefined;
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }