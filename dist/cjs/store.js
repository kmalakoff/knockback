/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS104: Avoid inline assignments
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
var _ref = kb = require("./kb"), _ = _ref._, ko = _ref.ko;
// Used to share and manage the persistence of ViewModels and observables. ks.Store can be used to break relationship cycles between models, to reduce memory usage, and to share view models between kb.CollectionObservables (for example, when using Knockout.js selectedOptions).
//
// @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
//   var co = kb.collectionObservable(new Backbone.Collection());
//   var co_selected_options = kb.collectionObservable(new Backbone.Collection(), {
//     store: kb.utils.wrappedStore(co)
//   });
module.exports = function() {
    var Cls = kb.Store = /*#__PURE__*/ function() {
        "use strict";
        function Store() {
            _class_call_check(this, Store);
            this.observable_records = {};
            this.replaced_observables = [];
            kb.Store.instances.push(this);
        }
        _create_class(Store, [
            {
                // Required clean up function to break cycles, release view models, etc.
                // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
                key: "destroy",
                value: function destroy() {
                    var index;
                    this.__kb_released = true;
                    this.clear();
                    if ((index = _.indexOf(kb.Store.instances, this)) >= 0) {
                        return kb.Store.instances.splice(index, 1);
                    }
                }
            },
            {
                // Manually clear the store
                key: "clear",
                value: function clear() {
                    var observable;
                    var observable_records;
                    var replaced_observables;
                    var ref;
                    ref = _sliced_to_array(Array.from([
                        this.observable_records,
                        {}
                    ]), 2), observable_records = ref[0], this.observable_records = ref[1], ref;
                    for(var creator_id in observable_records){
                        var records = observable_records[creator_id];
                        for(var cid in records){
                            observable = records[cid];
                            this.release(observable, true);
                        }
                    }
                    var ref1;
                    ref1 = _sliced_to_array(Array.from([
                        this.replaced_observables,
                        []
                    ]), 2), replaced_observables = ref1[0], this.replaced_observables = ref1[1], ref1;
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = Array.from(replaced_observables)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            observable = _step.value;
                            if (!observable.__kb_released) {
                                this.release(observable, true);
                            }
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
                // Manually compact the store by searching for released view models
                key: "compact",
                value: function compact() {
                    for(var creator_id in this.observable_records){
                        var records = this.observable_records[creator_id];
                        for(var cid in records){
                            var observable = records[cid];
                            if (observable.__kb_released) {
                                delete records[cid];
                            }
                        }
                    }
                }
            },
            {
                // Used to register a new view model with the store.
                //
                // @param [Model] obj the Model
                // @param [ko.observable] observable the observable to share for the Model
                // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
                // @option options [Constructor|Function] creator the constructor or function used to create the observable. It is used to match observables in the store.
                // @option options [String] path the path to the value (used to create related observables from the factory).
                // @option options [kb.Store] store a store used to cache and share view models.
                // @option options [kb.Factory] factory a factory used to create view models.
                //
                // @example retain an observable with the store
                //   store.retain(observable, obj, creator);
                key: "retain",
                value: function retain(observable, obj, creator) {
                    var current_observable;
                    if (!this._canRegister(observable)) {
                        return;
                    }
                    if (!creator) {
                        creator = observable.constructor;
                    } // default is to use the constructor
                    if (current_observable = this.find(obj, creator)) {
                        if (current_observable === observable) {
                            this._getOrCreateStoreReferences(observable).ref_count++;
                            return observable;
                        } // already in this store
                        this._retire(current_observable);
                    }
                    this._add(observable, obj, creator);
                    this._getOrCreateStoreReferences(observable).ref_count++;
                    return observable;
                }
            },
            {
                // Used to find an existing observable in the store or create a new one if it doesn't exist.
                //
                // @param [Model|Collection|Data] obj the object to create the observable for. Only Models are cached in the store.
                // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
                // @param [boolean] deep_retain setting to true retains an existing observable when found.
                // @option options [Constructor|Function] creator the constructor or function used to create the observable. It is used to match observables in the store.
                // @option options [String] path the path to the value (used to create related observables from the factory).
                // @option options [kb.Store] store a store used to cache and share view models.
                // @option options [kb.Factory] factory a factory used to create view models.
                //
                // @example register an observable with the store
                //   observable = store.retainOrCreate(value, {path: kb.utils.wrappedPath(observable), factory: kb.utils.wrappedFactory(observable)})
                key: "retainOrCreate",
                value: function retainOrCreate(obj, options, deep_retain) {
                    var _this = this;
                    var creator;
                    var observable;
                    if (!(creator = this._creator(obj, options))) {
                        return kb.utils.createFromDefaultCreator(obj, options);
                    }
                    if (creator.models_only) {
                        return obj;
                    }
                    if (observable = this.find(obj, creator)) {
                        return deep_retain && kb.settings.deep_retain ? this.retain(observable, obj, creator) : observable;
                    }
                    if (!_.isFunction(creator.create || creator)) {
                        throw new Error('Invalid factory for "'.concat(options.path, '"'));
                    }
                    observable = kb.ignore(function() {
                        options = _.defaults({
                            store: _this,
                            creator: creator
                        }, options); // set our own creator so we can register ourselves above
                        observable = creator.create ? creator.create(obj, options) : new creator(obj, options);
                        return observable || ko.observable(null);
                    }); // default to null
                    this.retain(observable, obj, creator);
                    return observable;
                }
            },
            {
                // @nodoc
                key: "reuse",
                value: function reuse(observable, obj) {
                    var current_obj;
                    var current_observable;
                    if ((current_obj = kb.utils.wrappedObject(observable)) === obj) {
                        return;
                    }
                    if (!this._canRegister(observable)) {
                        throw new Error("Cannot reuse a simple observable");
                    }
                    if (this._refCount(observable) !== 1) {
                        throw new Error("Trying to change a shared view model. Ref count: ".concat(this._refCount(observable)));
                    }
                    var creator = kb.utils.wrappedCreator(observable) || observable.constructor; // default is to use the constructor
                    if (!_.isUndefined(current_obj)) {
                        current_observable = this.find(current_obj, creator);
                    }
                    this.retain(observable, obj, creator);
                    if (current_observable) {
                        this.release(current_observable);
                    }
                }
            },
            {
                // Release a reference to a a ViewModel in this store.
                key: "release",
                value: function release(observable, force) {
                    var store_references;
                    if (!this._canRegister(observable)) {
                        return kb.release(observable);
                    } // just release
                    // maybe be externally added
                    if (store_references = this._storeReferences(observable)) {
                        if (!force && --store_references.ref_count > 0) {
                            return;
                        } // do not release yet
                        this._clearStoreReferences(observable);
                    }
                    this._remove(observable);
                    if (observable.__kb_released) {
                        return;
                    }
                    if (force || this._refCount(observable) <= 1) {
                        return kb.release(observable);
                    } // allow for a single initial reference in another store
                }
            },
            {
                // @nodoc
                key: "find",
                value: function find(obj, creator) {
                    var observable;
                    var records;
                    if (!(records = this.observable_records[this._creatorId(creator)])) {
                        return null;
                    }
                    if (__guard__(observable = records[this._cid(obj)], function(x) {
                        return x.__kb_released;
                    })) {
                        delete records[this._cid(obj)];
                        return null;
                    }
                    return observable;
                }
            },
            {
                // @nodoc
                key: "_refCount",
                value: function _refCount(observable) {
                    var stores_references;
                    if (observable.__kb_released) {
                        if (typeof console !== "undefined" && console !== null) {
                            console.log("Observable already released");
                        }
                        return 0;
                    }
                    if (!(stores_references = kb.utils.get(observable, "stores_references"))) {
                        return 1;
                    }
                    return _.reduce(stores_references, function(memo, store_references) {
                        return memo + store_references.ref_count;
                    }, 0);
                }
            },
            {
                // @nodoc
                key: "_canRegister",
                value: function _canRegister(observable) {
                    return observable && !ko.isObservable(observable) && !observable.__kb_is_co;
                } // only register view models not basic ko.observables nor kb.CollectionObservables
            },
            {
                // @nodoc
                key: "_cid",
                value: function _cid(obj) {
                    var cid;
                    return cid = obj ? obj.cid || (obj.cid = _.uniqueId("c")) : "null";
                }
            },
            {
                // @nodoc
                key: "_creatorId",
                value: function _creatorId(creator) {
                    var item;
                    var create = creator.create || creator;
                    if (!create.__kb_cids) {
                        create.__kb_cids = [];
                    }
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = Array.from(create.__kb_cids)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            item = _step.value;
                            if (item.create === create) {
                                return item.cid;
                            }
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
                    create.__kb_cids.push(item = {
                        create: create,
                        cid: _.uniqueId("kb")
                    });
                    return item.cid;
                }
            },
            {
                // @nodoc
                key: "_storeReferences",
                value: function _storeReferences(observable) {
                    var _this = this;
                    var stores_references;
                    if (!(stores_references = kb.utils.get(observable, "stores_references"))) {
                        return;
                    }
                    return _.find(stores_references, function(store_references) {
                        return store_references.store === _this;
                    });
                }
            },
            {
                // @nodoc
                key: "_getOrCreateStoreReferences",
                value: function _getOrCreateStoreReferences(observable) {
                    var _this = this;
                    var store_references;
                    var stores_references = kb.utils.orSet(observable, "stores_references", []);
                    if (!(store_references = _.find(stores_references, function(store_references) {
                        return store_references.store === _this;
                    }))) {
                        stores_references.push(store_references = {
                            store: this,
                            ref_count: 0,
                            release: function() {
                                return _this.release(observable);
                            }
                        });
                    }
                    return store_references;
                }
            },
            {
                // @nodoc
                key: "_clearStoreReferences",
                value: function _clearStoreReferences(observable) {
                    var stores_references;
                    if (stores_references = kb.utils.get(observable, "stores_references")) {
                        for(var index in observable.__kb.stores_references){
                            var store_references = observable.__kb.stores_references[index];
                            if (store_references.store === this) {
                                observable.__kb.stores_references.splice(index, 1);
                                break;
                            }
                        }
                    }
                }
            },
            {
                // @nodoc
                key: "_retire",
                value: function _retire(observable) {
                    this._clearStoreReferences(observable);
                    this.replaced_observables.push(observable);
                    return this._remove(observable);
                }
            },
            {
                // @nodoc
                key: "_add",
                value: function _add(observable, obj, creator) {
                    var name;
                    if (!creator) {
                        creator = observable.constructor;
                    } // default is to use the constructor
                    kb.utils.wrappedObject(observable, obj);
                    kb.utils.wrappedCreator(observable, creator);
                    return (this.observable_records[name = this._creatorId(creator)] || (this.observable_records[name] = {}))[this._cid(obj)] = observable;
                }
            },
            {
                // @nodoc
                key: "_remove",
                value: function _remove(observable) {
                    var current_observable;
                    var obj;
                    var creator = kb.utils.wrappedCreator(observable) || observable.constructor; // default is to use the constructor
                    if (current_observable = this.find(obj = kb.utils.wrappedObject(observable), creator)) {
                        // already released
                        if (current_observable === observable) {
                            delete this.observable_records[this._creatorId(creator)][this._cid(obj)];
                        } // not already replaced
                    }
                    kb.utils.wrappedObject(observable, null);
                    return kb.utils.wrappedCreator(observable, null);
                }
            },
            {
                // @nodoc
                key: "_creator",
                value: function _creator(obj, options) {
                    var creator;
                    if (options.creator) {
                        return options.creator;
                    }
                    if (creator = kb.utils.inferCreator(obj, options.factory, options.path)) {
                        return creator;
                    }
                    if (kb.isModel(obj)) {
                        return kb.ViewModel;
                    }
                }
            }
        ], [
            {
                key: "initClass",
                value: function initClass() {
                    // @nodoc
                    Store.instances = [];
                }
            },
            {
                key: "useOptionsOrCreate",
                value: // Used to either register yourself with the existing store or to create a new store.
                //
                // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
                // @param [Instance] obj the instance that will own or register with the store
                // @param [ko.observable] observable the observable that will own the store
                // @example
                //   kb.Store.useOptionsOrCreate(model, this, options);
                function useOptionsOrCreate(options, obj, observable) {
                    if (!options.store) {
                        kb.utils.wrappedStoreIsOwned(observable, true);
                    }
                    var store = kb.utils.wrappedStore(observable, options.store || new kb.Store());
                    store.retain(observable, obj, options.creator);
                    return store;
                }
            }
        ]);
        return Store;
    }();
    Cls.initClass();
    return Cls;
}();
function __guard__(value, transform) {
    return typeof value !== "undefined" && value !== null ? transform(value) : undefined;
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }