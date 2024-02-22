/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
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
var kb;
var TypedValue;
var _ref = kb = require("./kb"), _ = _ref._, ko = _ref.ko;
// @nodoc
module.exports = TypedValue = /*#__PURE__*/ function() {
    "use strict";
    function TypedValue(create_options) {
        _class_call_check(this, TypedValue);
        this.create_options = create_options;
        this._vo = ko.observable(null); // create a value observable for the first dependency
    }
    _create_class(TypedValue, [
        {
            key: "destroy",
            value: function destroy() {
                var previous_value;
                this.__kb_released = true;
                if (previous_value = this.__kb_value) {
                    this.__kb_value = null;
                    if (this.create_options.store && kb.utils.wrappedCreator(previous_value)) {
                        this.create_options.store.release(previous_value);
                    } else {
                        kb.release(previous_value);
                    }
                }
                return this.create_options = null;
            }
        },
        {
            key: "value",
            value: function value() {
                return ko.utils.unwrapObservable(this._vo());
            }
        },
        {
            key: "rawValue",
            value: function rawValue() {
                return this.__kb_value;
            }
        },
        {
            key: "valueType",
            value: function valueType(model, key) {
                var new_value = kb.getValue(model, key);
                this.value_type || this._updateValueObservable(new_value); // create so we can check the type
                return this.value_type;
            }
        },
        {
            key: "update",
            value: function update(new_value) {
                if (this.__kb_released) {
                    return;
                } // destroyed, nothing to do
                // determine the new type
                new_value !== undefined || (new_value = null); // ensure null instead of undefined
                var new_type = kb.utils.valueType(new_value);
                if (this.__kb_value != null ? this.__kb_value.__kb_released : undefined) {
                    this.__kb_value = this.value_type = undefined;
                }
                var value = this.__kb_value;
                switch(this.value_type){
                    case kb.TYPE_COLLECTION:
                        if (this.value_type === kb.TYPE_COLLECTION && new_type === kb.TYPE_ARRAY) {
                            return value(new_value);
                        }
                        if (new_type === kb.TYPE_COLLECTION || _.isNull(new_value)) {
                            // use the provided CollectionObservable
                            if (new_value && _instanceof(new_value, kb.CollectionObservable)) {
                                this._updateValueObservable(kb.utils.wrappedObject(new_value), new_value);
                            } else {
                                if (kb.peek(value.collection) !== new_value) {
                                    value.collection(new_value);
                                } // collection observables are allocated once
                            }
                            return;
                        }
                        break;
                    case kb.TYPE_MODEL:
                        if (new_type === kb.TYPE_MODEL || _.isNull(new_value)) {
                            // use the provided ViewModel
                            if (new_value && !kb.isModel(new_value)) {
                                this._updateValueObservable(kb.utils.wrappedObject(new_value), new_value);
                            } else {
                                if (kb.utils.wrappedObject(value) !== kb.utils.resolveModel(new_value)) {
                                    this._updateValueObservable(new_value);
                                }
                            }
                            return;
                        }
                        break;
                }
                if (this.value_type === new_type && !_.isUndefined(this.value_type)) {
                    if (kb.peek(value) !== new_value) {
                        return value(new_value);
                    }
                } else {
                    if (kb.peek(value) !== new_value) {
                        return this._updateValueObservable(new_value);
                    }
                }
            }
        },
        {
            key: "_updateValueObservable",
            value: function _updateValueObservable(new_value, new_observable) {
                var previous_value;
                var value;
                var create_options = this.create_options;
                var creator = kb.utils.inferCreator(new_value, create_options.factory, create_options.path);
                // retain previous type
                if (new_value === null && !creator) {
                    if (this.value_type === kb.TYPE_MODEL) {
                        creator = kb.ViewModel;
                    } else if (this.value_type === kb.TYPE_COLLECTION) {
                        creator = kb.CollectionObservable;
                    }
                }
                create_options.creator = creator;
                var value_type = kb.TYPE_UNKNOWN;
                var ref;
                ref = _sliced_to_array(Array.from([
                    this.__kb_value,
                    undefined
                ]), 2), previous_value = ref[0], this.__kb_value = ref[1], ref;
                if (new_observable) {
                    value = new_observable;
                    if (create_options.store) {
                        create_options.store.retain(new_observable, new_value, creator);
                    }
                // found a creator
                } else if (creator) {
                    // have the store, use it to create
                    if (create_options.store) {
                        value = create_options.store.retainOrCreate(new_value, create_options, true);
                    // create manually
                    } else {
                        if (creator.models_only) {
                            value = new_value;
                            value_type = kb.TYPE_SIMPLE;
                        } else if (creator.create) {
                            value = creator.create(new_value, create_options);
                        } else {
                            value = new creator(new_value, create_options);
                        }
                    }
                // create and cache the type
                } else {
                    if (_.isArray(new_value)) {
                        value_type = kb.TYPE_ARRAY;
                        value = ko.observableArray(new_value);
                    } else {
                        value_type = kb.TYPE_SIMPLE;
                        value = ko.observable(new_value);
                    }
                }
                // determine the type
                if ((this.value_type = value_type) === kb.TYPE_UNKNOWN) {
                    if (!ko.isObservable(value)) {
                        // a view model, recognize view_models as non-observable
                        this.value_type = kb.TYPE_MODEL;
                        kb.utils.wrappedObject(value, kb.utils.resolveModel(new_value));
                    } else if (value.__kb_is_co) {
                        this.value_type = kb.TYPE_COLLECTION;
                        kb.utils.wrappedObject(value, new_value);
                    } else if (!this.value_type) {
                        this.value_type = kb.TYPE_SIMPLE;
                    }
                }
                // release previous
                if (previous_value) {
                    if (this.create_options.store) {
                        this.create_options.store.release(previous_value);
                    } else {
                        kb.release(previous_value);
                    }
                }
                // store the value
                this.__kb_value = value;
                return this._vo(value);
            }
        },
        {
            key: "_inferType",
            value: function _inferType(_value) {}
        }
    ]);
    return TypedValue;
}();
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }