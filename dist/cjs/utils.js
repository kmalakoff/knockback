/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
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
var kb;
var _ref = kb = require("./kb"), _ = _ref._, ko = _ref.ko;
//###################################################
// Public API
//###################################################
// Library of general-purpose utilities
var Cls = kb.utils = /*#__PURE__*/ function() {
    "use strict";
    function utils() {
        _class_call_check(this, utils);
    }
    _create_class(utils, null, [
        {
            key: "initClass",
            value: function initClass() {
                // Clean up function that releases all of the wrapped values on an owner.
                utils.wrappedDestroy = require("./functions/wrapped_destroy");
                // Helper to merge options including ViewmModel options like `keys` and `factories`
                //
                // @param [Object] obj the object to test
                //
                // @example
                //   kb.utils.collapseOptions(options);
                utils.collapseOptions = require("./functions/collapse_options");
                // used for attribute setting to ensure all model attributes have their underlying models
                utils.unwrapModels = require("./functions/unwrap_models");
            }
        },
        {
            key: "get",
            value: // @nodoc
            function get(obj, key, default_value) {
                if (!obj.__kb || !obj.__kb.hasOwnProperty(key)) {
                    return default_value;
                }
                return obj.__kb[key];
            }
        },
        {
            key: "set",
            value: // @nodoc
            function set(obj, key, value) {
                return (obj.__kb || (obj.__kb = {}))[key] = value;
            }
        },
        {
            key: "orSet",
            value: // @nodoc
            function orSet(obj, key, value) {
                if (!(obj.__kb || (obj.__kb = {})).hasOwnProperty(key)) {
                    obj.__kb[key] = value;
                }
                return obj.__kb[key];
            }
        },
        {
            key: "has",
            value: // @nodoc
            function has(obj, key) {
                return obj.__kb && obj.__kb.hasOwnProperty(key);
            }
        },
        {
            key: "wrappedObservable",
            value: // Dual-purpose getter/setter for retrieving and storing the observable on an instance that returns a ko.observable instead of 'this'. Relevant for:
            //
            //   * [kb.CollectionObservable]('classes/kb/CollectionObservable.html')
            //   * [kb.Observable]('classes/kb/Observable.html')
            //   * [kb.DefaultObservable]('classes/kb/DefaultObservable.html')
            //   * [kb.FormattedObservable]('classes/kb/FormattedObservable.html')
            //   * [kb.LocalizedObservable]('classes/kb/LocalizedObservable.html')
            //   * [kb.TriggeredObservable]('classes/kb/TriggeredObservable.html')
            //
            // @overload wrappedObservable(instance)
            //   Gets the observable from an object
            //   @param [Any] instance the owner
            //   @return [ko.observable|ko.observableArray] the observable
            // @overload wrappedObservable(instance, observable)
            //   Sets the observable on an object
            //   @param [Any] instance the owner
            //   @param [ko.observable|ko.observableArray] observable the observable
            //
            // @example
            //   var ShortDateLocalizer = kb.LocalizedObservable.extend({
            //     constructor: function(value, options, view_model) {
            //       kb.LocalizedObservable.prototype.constructor.apply(this, arguments);
            //       return kb.utils.wrappedObservable(this);
            //     }
            //   });
            function wrappedObservable(obj, value) {
                if (arguments.length === 1) {
                    return kb.utils.get(obj, "observable");
                }
                return kb.utils.set(obj, "observable", value);
            }
        },
        {
            key: "wrappedObject",
            value: // Dual-purpose getter/setter for retrieving and storing the Model or Collection on an owner.
            // @note this is almost the same as {kb.utils.wrappedModel} except that if the Model doesn't exist, it returns null.
            //
            // @overload wrappedObject(obj)
            //   Gets the observable from an object
            //   @param [Object|kb.ViewModel|kb.CollectionObservable] obj owner the ViewModel/CollectionObservable owning the kb.Model or kb.Collection.
            //   @return [Model|Collection] the model/collection
            // @overload wrappedObject(obj, value)
            //   Sets the observable on an object
            //   @param [Object|kb.ViewModel|kb.CollectionObservable] obj owner the ViewModel/CollectionObservable owning the kb.Model or kb.Collection.
            //   @param [Model|Collection] value the model/collection
            //
            // @example
            //   var model = kb.utils.wrappedObject(view_model);
            //   var collection = kb.utils.wrappedObject(collection_observable);
            function wrappedObject(obj, value) {
                if (arguments.length === 1) {
                    return kb.utils.get(obj, "object");
                }
                return kb.utils.set(obj, "object", value);
            }
        },
        {
            key: "wrappedCreator",
            value: // @nodoc
            function wrappedCreator(obj, value) {
                if (arguments.length === 1) {
                    return kb.utils.get(obj, "creator");
                }
                return kb.utils.set(obj, "creator", value);
            }
        },
        {
            key: "wrappedModel",
            value: // Dual-purpose getter/setter for retrieving and storing the Model on a ViewModel.
            // @note this is almost the same as {kb.utils.wrappedObject} except that if the Model doesn't exist, it returns the ViewModel itself (which is useful behaviour for sorting because it you can iterate over a kb.CollectionObservable's ko.ObservableArray whether it holds ViewModels or Models with the models_only option).
            //
            // @overload wrappedModel(view_model)
            //   Gets the model from a ViewModel
            //   @param [Object|kb.ViewModel] view_model the owning ViewModel for the Model.
            //   @return [Model|ViewModel] the Model or ViewModel itself if there is no Model
            // @overload wrappedModel(view_model, model)
            //   Sets the observable on an object
            //   @param [Object|kb.ViewModel] view_model the owning ViewModel for the Model.
            //   @param [Model] model the Model
            function wrappedModel(obj, value) {
                if (arguments.length === 1) {
                    if (_.isUndefined(value = kb.utils.get(obj, "object"))) {
                        return obj;
                    }
                    return value;
                }
                return kb.utils.set(obj, "object", value);
            }
        },
        {
            key: "wrappedStore",
            value: // Dual-purpose getter/setter for retrieving and storing a kb.Store on an owner.
            //
            // @overload wrappedStore(obj)
            //   Gets the store from an object
            //   @param [Any] obj the owner
            //   @return [kb.Store] the store
            // @overload wrappedStore(obj, store)
            //   Sets the store on an object
            //   @param [Any] obj the owner
            //   @param [kb.Store] store the store
            //
            // @example
            //   var co = kb.collectionObservable(new Backbone.Collection());
            //   var co_selected_options = kb.collectionObservable(new Backbone.Collection(), {
            //     store: kb.utils.wrappedStore(co)
            //   });
            function wrappedStore(obj, value) {
                if (arguments.length === 1) {
                    return kb.utils.get(obj, "store");
                }
                return kb.utils.set(obj, "store", value);
            }
        },
        {
            key: "wrappedStoreIsOwned",
            value: // @private
            function wrappedStoreIsOwned(obj, value) {
                if (arguments.length === 1) {
                    return kb.utils.get(obj, "store_is_owned");
                }
                return kb.utils.set(obj, "store_is_owned", value);
            }
        },
        {
            key: "wrappedFactory",
            value: // Dual-purpose getter/setter for retrieving and storing a kb.Factory on an owner.
            //
            // @overload wrappedFactory(obj)
            //   Gets the factory from an object
            //   @param [Any] obj the owner
            //   @return [kb.Factory] the factory
            // @overload wrappedFactory(obj, factory)
            //   Sets the factory on an object
            //   @param [Any] obj the owner
            //   @param [kb.Factory] factory the factory
            function wrappedFactory(obj, value) {
                if (arguments.length === 1) {
                    return kb.utils.get(obj, "factory");
                }
                return kb.utils.set(obj, "factory", value);
            }
        },
        {
            key: "wrappedEventWatcher",
            value: // Dual-purpose getter/setter for retrieving and storing a kb.EventWatcher on an owner.
            //
            // @overload wrappedEventWatcher(obj)
            //   Gets the event_watcher from an object
            //   @param [Any] obj the owner
            //   @return [kb.EventWatcher] the event_watcher
            // @overload wrappedEventWatcher(obj, event_watcher)
            //   Sets the event_watcher on an object
            //   @param [Any] obj the owner
            //   @param [kb.EventWatcher] event_watcher the event_watcher
            function wrappedEventWatcher(obj, value) {
                if (arguments.length === 1) {
                    return kb.utils.get(obj, "event_watcher");
                }
                return kb.utils.set(obj, "event_watcher", value);
            }
        },
        {
            key: "wrappedEventWatcherIsOwned",
            value: // @private
            function wrappedEventWatcherIsOwned(obj, value) {
                if (arguments.length === 1) {
                    return kb.utils.get(obj, "event_watcher_is_owned");
                }
                return kb.utils.set(obj, "event_watcher_is_owned", value);
            }
        },
        {
            key: "valueType",
            value: // Retrieves the value stored in a ko.observable.
            //
            // @see kb.Observable valueType
            //
            // @example
            //   var view_model = kb.viewModel(new Model({simple_attr: null, model_attr: null}), {factories: {model_attr: kb.ViewModel});
            //   kb.utils.valueType(view_model.simple_attr); // kb.TYPE_SIMPLE
            //   kb.utils.valueType(view_model.model_attr);  // kb.TYPE_MODEL
            function valueType(observable) {
                if (!observable) {
                    return kb.TYPE_UNKNOWN;
                }
                if (observable.__kb_is_o) {
                    return observable.valueType();
                }
                if (observable.__kb_is_co || _instanceof(observable, kb.Collection)) {
                    return kb.TYPE_COLLECTION;
                }
                if (_instanceof(observable, kb.ViewModel) || _instanceof(observable, kb.Model)) {
                    return kb.TYPE_MODEL;
                }
                if (_.isArray(observable)) {
                    return kb.TYPE_ARRAY;
                }
                return kb.TYPE_SIMPLE;
            }
        },
        {
            key: "pathJoin",
            value: // Helper to join a dot-deliminated path.
            //
            // @param [String] path1 start path.
            // @param [String] path2 append path.
            // @return [String] combined dot-delimited path.
            //
            // @example
            //   kb.utils.pathJoin('models', 'name'); // 'models.name'
            function pathJoin(path1, path2) {
                return (path1 ? path1[path1.length - 1] !== "." ? "".concat(path1, ".") : path1 : "") + path2;
            }
        },
        {
            key: "optionsPathJoin",
            value: // Helper to join a dot-deliminated path with the path on options and returns a new options object with the result.
            //
            // @param [Object] options with path property for the start path
            // @param [String] path append path.
            // @return [Object] new options with combined dot-delimited path `{path: combined_path}`.
            //
            // @example
            //   this.friends = kb.collectionObservable(model.get('friends'), kb.utils.optionsPathJoin(options, 'friends'));
            function optionsPathJoin(options, path) {
                return _.defaults({
                    path: utils.pathJoin(options.path, path)
                }, options);
            }
        },
        {
            key: "inferCreator",
            value: // Helper to find the creator constructor or function from a factory or ORM solution
            function inferCreator(value, factory, path) {
                var creator;
                if (factory && (creator = factory.creatorForPath(value, path))) {
                    return creator;
                }
                // try fallbacks
                if (!value) {
                    return null;
                }
                if (_instanceof(value, kb.Model)) {
                    return kb.ViewModel;
                }
                if (_instanceof(value, kb.Collection)) {
                    return kb.CollectionObservable;
                }
                return null;
            }
        },
        {
            key: "createFromDefaultCreator",
            value: // Creates an observable based on a value's type.
            function createFromDefaultCreator(obj, options) {
                if (kb.isModel(obj)) {
                    return kb.viewModel(obj, options);
                }
                if (kb.isCollection(obj)) {
                    return kb.collectionObservable(obj, options);
                }
                if (_.isArray(obj)) {
                    return ko.observableArray(obj);
                }
                return ko.observable(obj);
            }
        },
        {
            key: "resolveModel",
            value: // @nodoc
            function resolveModel(model) {
                if (model && kb.Backbone && kb.Backbone.ModelRef && _instanceof(model, kb.Backbone.ModelRef)) {
                    return model.model();
                }
                return model;
            }
        }
    ]);
    return utils;
}();
Cls.initClass();
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }