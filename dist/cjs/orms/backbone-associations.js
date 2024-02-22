/*
 * decaffeinate suggestions:
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
var BackboneAssociations;
var kb;
var _ref = kb = require("../kb"), _ = _ref._, Backbone = _ref.Backbone;
var AssociatedModel = null; // lazy check
// @nodoc
module.exports = BackboneAssociations = /*#__PURE__*/ function() {
    "use strict";
    function BackboneAssociations() {
        _class_call_check(this, BackboneAssociations);
    }
    _create_class(BackboneAssociations, null, [
        {
            key: "isAvailable",
            value: function isAvailable() {
                return !!(AssociatedModel = Backbone != null ? Backbone.AssociatedModel : undefined);
            } // or require?('backbone-associations')?.AssociatedModel # webpack optionals
        },
        {
            key: "keys",
            value: function keys(model) {
                if (!_instanceof(model, AssociatedModel)) {
                    return null;
                }
                return _.map(model.relations, function(test) {
                    return test.key;
                });
            }
        },
        {
            key: "relationType",
            value: function relationType(model, key) {
                var relation;
                if (!_instanceof(model, AssociatedModel)) {
                    return null;
                }
                if (!(relation = _.find(model.relations, function(test) {
                    return test.key === key;
                }))) {
                    return null;
                }
                if (relation.type === "Many") {
                    return kb.TYPE_COLLECTION;
                }
                return kb.TYPE_MODEL;
            }
        },
        {
            key: "useFunction",
            value: function useFunction() {
                return false;
            }
        }
    ]);
    return BackboneAssociations;
}();
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }