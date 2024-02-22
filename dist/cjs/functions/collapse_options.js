/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */ /*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/ "use strict";
var _ = require("../kb")._;
// @nodoc
var _mergeArray = function _mergeArray(result, key, value) {
    if (!result[key]) {
        result[key] = [];
    }
    if (!_.isArray(value)) {
        value = [
            value
        ];
    }
    result[key] = result[key].length ? _.union(result[key], value) : value;
    return result;
};
// @nodoc
var _mergeObject = function _mergeObject(result, key, value) {
    if (!result[key]) {
        result[key] = {};
    }
    return _.extend(result[key], value);
};
// @nodoc
var _keyArrayToObject = function _keyArrayToObject(value) {
    var result = {};
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = Array.from(value)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var item = _step.value;
            result[item] = {
                key: item
            };
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return result;
};
var _mergeOptions = function _mergeOptions1(result, options) {
    if (!options) {
        return result;
    }
    for(var key in options){
        var value = options[key];
        switch(key){
            case "internals":
            case "requires":
            case "excludes":
            case "statics":
                _mergeArray(result, key, value);
                break;
            case "keys":
                // an object
                if (_.isObject(value) && !_.isArray(value) || _.isObject(result[key]) && !_.isArray(result[key])) {
                    if (!_.isObject(value)) {
                        value = [
                            value
                        ];
                    }
                    if (_.isArray(value)) {
                        value = _keyArrayToObject(value);
                    }
                    if (_.isArray(result[key])) {
                        result[key] = _keyArrayToObject(result[key]);
                    }
                    _mergeObject(result, key, value);
                // an array
                } else {
                    _mergeArray(result, key, value);
                }
                break;
            case "factories":
                if (_.isFunction(value)) {
                    result[key] = value;
                } else {
                    _mergeObject(result, key, value);
                }
                break;
            case "static_defaults":
                _mergeObject(result, key, value);
                break;
            case "options":
                break;
            default:
                result[key] = value;
        }
    }
    return _mergeOptions(result, options.options);
};
// @nodoc
module.exports = function(options) {
    return _mergeOptions({}, options);
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }