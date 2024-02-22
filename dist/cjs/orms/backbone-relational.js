/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
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
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
var BackboneRelational;
var kb;
var _ref = kb = require("../kb"), _ = _ref._, Backbone = _ref.Backbone;
var RelationalModel = null; // lazy check
// @nodoc
module.exports = BackboneRelational = /*#__PURE__*/ function() {
    "use strict";
    function BackboneRelational() {
        _class_call_check(this, BackboneRelational);
    }
    _create_class(BackboneRelational, null, [
        {
            key: "isAvailable",
            value: function isAvailable() {
                return !!(RelationalModel = Backbone != null ? Backbone.RelationalModel : undefined);
            } // or require?('backbone-relational')?.RelationalModel # webpack optionals
        },
        {
            key: "relationType",
            value: function relationType(model, key) {
                var relation;
                if (!_instanceof(model, RelationalModel)) {
                    return null;
                }
                if (!(relation = _.find(model.getRelations(), function(test) {
                    return test.key === key;
                }))) {
                    return null;
                }
                if (relation.collectionType || _.isArray(relation.keyContents)) {
                    return kb.TYPE_COLLECTION;
                }
                return kb.TYPE_MODEL;
            }
        },
        {
            key: "bind",
            value: function bind(model, key, update, path) {
                var event;
                var type;
                if (!(type = BackboneRelational.relationType(model, key))) {
                    return null;
                }
                var rel_fn = function rel_fn(model) {
                    !kb.statistics || kb.statistics.addModelEvent({
                        name: "update (relational)",
                        model: model,
                        key: key,
                        path: path
                    });
                    return update();
                };
                // VERSIONING: pre Backbone-Relational 0.8.0
                var events = kb.Backbone.Relation.prototype.sanitizeOptions ? [
                    "update",
                    "add",
                    "remove"
                ] : [
                    "change",
                    "add",
                    "remove"
                ];
                if (type === kb.TYPE_COLLECTION) {
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = Array.from(events)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            event = _step.value;
                            model.bind("".concat(event, ":").concat(key), rel_fn);
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
                } else {
                    model.bind("".concat(events[0], ":").concat(key), rel_fn);
                }
                return function() {
                    if (type === kb.TYPE_COLLECTION) {
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(var _iterator = Array.from(events)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                event = _step.value;
                                model.unbind("".concat(event, ":").concat(key), rel_fn);
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
                    } else {
                        model.unbind("".concat(events[0], ":").concat(key), rel_fn);
                    }
                };
            }
        },
        {
            key: "useFunction",
            value: function useFunction() {
                return false;
            }
        }
    ]);
    return BackboneRelational;
}();
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }