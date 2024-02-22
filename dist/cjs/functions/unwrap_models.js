/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/ "use strict";
var unwrapModels;
var _ = require("../kb")._;
// @nodoc
module.exports = unwrapModels = function(obj) {
    if (!obj) {
        return obj;
    }
    if (obj.__kb) {
        return obj.__kb.hasOwnProperty("object") ? obj.__kb.object : obj;
    }
    if (_.isArray(obj)) {
        return _.map(obj, function(test) {
            return unwrapModels(test);
        });
    }
    if (_.isObject(obj) && obj.constructor === ({}).constructor) {
        // a simple object
        var result = {};
        for(var key in obj){
            var value = obj[key];
            result[key] = unwrapModels(value);
        }
        return result;
    }
    return obj;
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }