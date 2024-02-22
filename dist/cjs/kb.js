/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS206: Consider reworking classes to avoid initClass
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
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
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
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
var _;
var Backbone;
var kb;
var window = window != null ? window : global;
var ko = require("knockout");
var LIFECYCLE_METHODS = [
    "release",
    "destroy",
    "dispose"
];
// The 'kb' namespace for classes, factory functions, constants, etc.
//
// @method .configure(options)
//   Method to update Knockback global configuration.
//   @param [Object] configuration options. 1) orm - select the library for relationships (default, backbone-orm, backbone-associations, backbone-relational), 2) deep_retain - true to multiply retain view models in the store
//
// @method .collectionObservable(collection, options)
//   Factory to create a new kb.CollectionObservable. See {kb.CollectionObservable#constructor} for information on options
//   @param [Collection] collection the collection to observe (can be null)
//   @param [Object] options the create options
//   @return [ko.observableArray] the constructor does not return 'this' but a ko.observableArray
//
// @method .observable(model, options, view_model)
//   Factory to create a new kb.Observable. See {kb.Observable#constructor} for information on options
//   @param [Model] model the model to observe (can be null)
//   @param [String|Array|Object] options the create options. String is a single attribute name, Array is an array of attribute names.
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
//
// @method .viewModel(model, options, view_model)
//   Factory to create a new kb.ViewModel. See {kb.ViewModel#constructor} for information on options
//   @param [Model|ModelRef] model the model to observe (can be null)
//   @param [Object] options the create options
//   @return [ko.observable] the constructor returns 'this'
//
// @method .defaultObservable(target, default_value)
//   Factory to create a new kb.DefaultObservable. See {kb.DefaultObservable#constructor} for information on options. If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-defaults component.
//   @param [ko.observable] target_observable the observable to check for null, undefined, or the empty string
//   @param [Any] default_value the default value. Can be a value, string or ko.observable
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
//
// @method .formattedObservable(format, arg1, arg2, etc)
//   Factory to create a new kb.FormattedObservable. See {kb.FormattedObservable#constructor} for information on options. If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-formatting component.
//   @param [String|ko.observable] format the format string. Format: `"{0} and {1}"` where `{0}` and `{1}` would be synchronized with the arguments (eg. "Bob and Carol" where `{0}` is Bob and `{1}` is Carol)
//   @param [Array] args arguments to be passed to the kb.LocaleManager's get() method
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
//
// @method .localizedObservable(value, options, view_model)
//   Factory to create a new kb.LocalizedObservable. See {kb.LocalizedObservable#constructor} for information on options. If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-localization component.
//   @param [Data|ko.observable] value the value to localize
//   @param [Object] options the create options
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
module.exports = kb = function() {
    kb = /*#__PURE__*/ function() {
        "use strict";
        function kb() {
            _class_call_check(this, kb);
        }
        _create_class(kb, null, [
            {
                key: "initClass",
                value: function initClass() {
                    // Knockback library semantic version
                    kb.VERSION = "1.2.3";
                    //###################################
                    // OBSERVABLE STORAGE TYPES
                    //###################################
                    // Stored value type is not known like null/undefined (could be observed as a Model or a Collection or a simple type)
                    kb.TYPE_UNKNOWN = 0;
                    // Stored value type is simple like a String or Number -> observable type: ko.observable
                    kb.TYPE_SIMPLE = 1;
                    // Stored value type is an Array -> observable type: ko.observableArray
                    kb.TYPE_ARRAY = 2;
                    // Stored value type is a Model -> observable type: ViewModel
                    kb.TYPE_MODEL = 3;
                    // Stored value type is a Collection -> observable type: kb.CollectionObservable
                    kb.TYPE_COLLECTION = 4;
                    // Helper to ignore dependencies in a function
                    //
                    // @param [Object] obj the object to test
                    //
                    // @example
                    //   kb.ignore(fn);
                    kb.ignore = (ko.dependencyDetection != null ? ko.dependencyDetection.ignore : undefined) || function(callback, callbackTarget, callbackArgs) {
                        var value = null;
                        ko.computed(function() {
                            return value = callback.apply(callbackTarget, callbackArgs || []);
                        }).dispose();
                        return value;
                    };
                    //###################################
                    // INTERNAL HELPERS
                    //###################################
                    // @nodoc
                    kb.extend = require("./functions/extend");
                }
            },
            {
                key: "wasReleased",
                value: // Checks if an object has been released.
                // @param [Any] obj the object to release and also release its keys
                function wasReleased(obj) {
                    return !obj || obj.__kb_released;
                }
            },
            {
                key: "isReleaseable",
                value: // Checks if an object can be released. Used to perform minimal nested releasing on objects by checking if self or next level contained items can be released.
                // @param [Any] obj the object to release and also release its keys
                function isReleaseable(obj, depth) {
                    if (depth == null) {
                        depth = 0;
                    }
                    if (!obj || obj !== Object(obj) || obj.__kb_released) {
                        return false;
                    } // must be an object and not already released
                    if (ko.isObservable(obj) || _instanceof(obj, kb.ViewModel)) {
                        return true;
                    } // a known type that is releasable
                    if (typeof obj === "function" || kb.isModel(obj) || kb.isCollection(obj)) {
                        return false;
                    } // a known type that is not releaseable
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = Array.from(LIFECYCLE_METHODS)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var method = _step.value;
                            if (typeof obj[method] === "function") {
                                return true;
                            }
                        } // a releaseable signature
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
                    if (depth > 0) {
                        return false;
                    } // max depth check for ViewModel inside of ViewModel
                    for(var key in obj){
                        var value = obj[key];
                        if (key !== "__kb" && kb.isReleaseable(value, depth + 1)) {
                            return true;
                        }
                    }
                    return false;
                }
            },
            {
                key: "release",
                value: // Releases any type of view model or observable or items in an array using the conventions of release(), destroy(), dispose().
                // @param [Any] obj the object to release and also release its keys
                //
                // @example
                //   var view_model = kb.viewModel(model);
                //   kb.release(view_model); view_model = null;
                // @example
                //   var todos = kb.collectionObservable(collection);
                //   kb.release(todos); todos = null;
                function release(obj) {
                    var array;
                    var index;
                    var value;
                    if (!kb.isReleaseable(obj)) {
                        return;
                    }
                    obj.__kb_released = true; // mark as released
                    // release array's items
                    if (_.isArray(obj)) {
                        for(index in obj){
                            value = obj[index];
                            if (kb.isReleaseable(value)) {
                                obj[index] = null;
                                kb.release(value);
                            }
                        }
                        return;
                    }
                    // observable or lifecycle managed
                    if (ko.isObservable(obj) && _.isArray(array = kb.peek(obj))) {
                        if (obj.__kb_is_co || obj.__kb_is_o && obj.valueType() === kb.TYPE_COLLECTION) {
                            return typeof obj.destroy === "function" ? obj.destroy() : undefined;
                        }
                        for(index in array){
                            value = array[index];
                            if (kb.isReleaseable(value)) {
                                array[index] = null;
                                kb.release(value);
                            }
                        }
                        if (typeof obj.dispose === "function") {
                            obj.dispose();
                        }
                        return;
                    }
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        // releaseable signature
                        for(var _iterator = Array.from(LIFECYCLE_METHODS)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var method = _step.value;
                            if (typeof obj[method] === "function") {
                                return obj[method].call(obj);
                            }
                        } // a releaseable signature
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
                    if (!ko.isObservable(obj)) {
                        return kb.releaseKeys(obj);
                    } // view model
                }
            },
            {
                key: "releaseKeys",
                value: // Releases and clears all of the keys on an object using the conventions of release(), destroy(), dispose() without releasing the top level object itself.
                function releaseKeys(obj) {
                    for(var key in obj){
                        var value = obj[key];
                        if (key !== "__kb" && kb.isReleaseable(value)) {
                            obj[key] = null;
                            kb.release(value);
                        }
                    }
                }
            },
            {
                key: "releaseOnNodeRemove",
                value: // Binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
                // ```
                // ko.utils.domNodeDisposal.addDisposeCallback(node, function() { kb.release(view_model)} );
                // ```
                // @example The hard way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
                //   var el = $('<div data-bind="name: name"></div>')[0];
                //   var view_model = kb.viewModel(new Backbone.Model({name: 'Bob'}));
                //   ko.applyBindings(view_model, el);
                //   kb.releaseOnNodeRemove(view_model, el);
                //   ...
                //   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)
                function releaseOnNodeRemove(view_model, node) {
                    view_model || kb._throwUnexpected(kb, "missing view model");
                    node || kb._throwUnexpected(kb, "missing node");
                    return ko.utils.domNodeDisposal.addDisposeCallback(node, function() {
                        return kb.release(view_model);
                    });
                }
            },
            {
                key: "renderTemplate",
                value: // Renders a template and binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
                //
                // NOTE: if you provide an afterRender method on the View Model and do not provide afterRender in the options, afterRender will be called with the following signature: afterRender(element) which differs from the Knockout signture of afterRender(elements)
                //
                // @example The easy way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
                //   var el = kb.renderTemplate('my_template', kb.viewModel(new Backbone.Model({name: 'Bob'})));
                //   ...
                //   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)
                function renderTemplate(template, view_model, options) {
                    var document1;
                    if (options == null) {
                        options = {};
                    }
                    if (!(document1 = window != null ? window.document : undefined)) {
                        return typeof console !== "undefined" && console !== null ? console.log("renderTemplate: document is undefined") : undefined;
                    }
                    var el = document1.createElement("div");
                    var observable = ko.renderTemplate(template, view_model, options, el, "replaceChildren");
                    if (el.childNodes.length === 1) {
                        // do not return the template wrapper if possible
                        el = el.childNodes[0];
                    } else if (el.childNodes.length) {
                        for(var i = 0, end = el.childNodes.length, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--){
                            // ensure the context is passed up to wrapper from a child
                            try {
                                ko.storedBindingContextForNode(el, ko.contextFor(el.childNodes[i]));
                                break;
                            } catch (_error) {}
                        }
                    }
                    kb.releaseOnNodeRemove(view_model, el);
                    observable.dispose(); // we will handle memory management with ko.removeNode (otherwise creates memory leak on default bound dispose function)
                    if (view_model.afterRender && !options.afterRender) {
                        view_model.afterRender(el);
                    } // call afterRender for custom setup unless provided in options (so doesn't get double called)
                    return el;
                }
            },
            {
                key: "applyBindings",
                value: // Applies bindings and binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
                //
                // @example The easy way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
                //   var el = $('<div data-bind="name: name"></div>')[0];
                //   kb.applyBindings(kb.viewModel(new Backbone.Model({name: 'Bob'})), el);
                //   ...
                //   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)
                function applyBindings(view_model, node) {
                    if (node.length) {
                        // convert to a root element
                        var children;
                        var ref;
                        ref = _sliced_to_array(Array.from([
                            document.createElement("div"),
                            node
                        ]), 2), node = ref[0], children = ref[1], ref;
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(var _iterator = Array.from(children)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                var child = _step.value;
                                node.appendChild(child);
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
                    }
                    ko.applyBindings(view_model, node);
                    kb.releaseOnNodeRemove(view_model, node);
                    return node;
                }
            },
            {
                key: "getValue",
                value: function getValue(model, key, args) {
                    if (!model) {
                        return;
                    }
                    if (_.isFunction(model[key]) && (kb.settings.orm != null ? kb.settings.orm.useFunction(model, key) : undefined)) {
                        return model[key]();
                    }
                    if (!args) {
                        return model.get(key);
                    }
                    return model.get.apply(model, _.map([
                        key
                    ].concat(args), function(value) {
                        return kb.peek(value);
                    }));
                }
            },
            {
                key: "setValue",
                value: function setValue(model, key, value) {
                    var attributes;
                    if (!model) {
                        return;
                    }
                    if (_.isFunction(model[key]) && (kb.settings.orm != null ? kb.settings.orm.useFunction(model, key) : undefined)) {
                        return model[key](value);
                    }
                    (attributes = {})[key] = value;
                    return model.set(attributes);
                }
            },
            {
                key: "_throwMissing",
                value: // @nodoc
                function _throwMissing(instance, message) {
                    throw "".concat(_.isString(instance) ? instance : instance.constructor.name, ": ").concat(message, " is missing");
                }
            },
            {
                key: "_throwUnexpected",
                value: // @nodoc
                function _throwUnexpected(instance, message) {
                    throw "".concat(_.isString(instance) ? instance : instance.constructor.name, ": ").concat(message, " is unexpected");
                }
            },
            {
                key: "publishMethods",
                value: // @nodoc
                function publishMethods(observable, instance, methods) {
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = Array.from(methods)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var fn = _step.value;
                            observable[fn] = kb._.bind(instance[fn], instance);
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
                }
            },
            {
                key: "peek",
                value: // @nodoc
                function peek(obs) {
                    if (!ko.isObservable(obs)) {
                        return obs;
                    }
                    if (obs.peek) {
                        return obs.peek();
                    }
                    return kb.ignore(function() {
                        return obs();
                    });
                }
            },
            {
                key: "isModel",
                value: // @nodoc
                function isModel(obj) {
                    return obj && (_instanceof(obj, kb.Model) || typeof obj.get === "function" && typeof obj.bind === "function");
                }
            },
            {
                key: "isCollection",
                value: // @nodoc
                function isCollection(obj) {
                    return obj && _instanceof(obj, kb.Collection);
                }
            }
        ]);
        return kb;
    }();
    kb.initClass();
    return kb;
}();
if (window.Parse) {
    Backbone = kb.Parse = window.Parse;
    _ = kb._ = window.Parse._;
} else {
    Backbone = kb.Backbone = require("backbone");
    _ = kb._ = require("underscore");
}
kb.ko = ko;
// cache local references
kb.Collection = Backbone.Collection;
kb.Model = Backbone.Object || Backbone.Model;
kb.Events = Backbone.Events;
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }