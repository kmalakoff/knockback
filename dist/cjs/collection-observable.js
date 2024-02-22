/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS205: Consider reworking code to avoid use of IIFEs
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
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return CollectionObservable;
    }
});
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
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
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
var COMPARE_EQUAL = 0;
var COMPARE_ASCENDING = -1;
var COMPARE_DESCENDING = 1;
var KEYS_PUBLISH = [
    "destroy",
    "shareOptions",
    "filters",
    "comparator",
    "sortAttribute",
    "viewModelByModel",
    "hasViewModels"
];
kb.compare = function(value_a, value_b) {
    // String compare
    if (_.isString(value_a)) {
        return value_a.localeCompare("".concat(value_b));
    }
    if (_.isString(value_b)) {
        return value_b.localeCompare("".concat(value_a));
    }
    // compare raw values
    if (value_a === value_b) {
        return COMPARE_EQUAL;
    }
    if (value_a < value_b) {
        return COMPARE_ASCENDING;
    }
    return COMPARE_DESCENDING;
}; // Base class for observing collections.
var CollectionObservable = /*#__PURE__*/ function() {
    "use strict";
    function CollectionObservable(collection, _view_model, options) {
        var _this = this;
        _class_call_check(this, CollectionObservable);
        this._onCollectionChange = this._onCollectionChange.bind(this);
        var args = Array.prototype.slice.call(_.isArguments(collection) ? collection : arguments);
        return kb.ignore(function() {
            collection = _instanceof(args[0], kb.Collection) ? args.shift() : _.isArray(args[0]) ? new kb.Collection(args.shift()) : new kb.Collection();
            if (_.isFunction(args[0])) {
                args[0] = {
                    view_model: args[0]
                };
            }
            options = {};
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = Array.from(args)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var arg = _step.value;
                    _.extend(options, arg);
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
            var observable = kb.utils.wrappedObservable(_this, ko.observableArray([]));
            observable.__kb_is_co = true; // mark as a kb.CollectionObservable
            _this.in_edit = 0;
            // bind callbacks
            if (!_this.__kb) {
                _this.__kb = {};
            }
            // options
            options = kb.utils.collapseOptions(options);
            if (options.auto_compact) {
                _this.auto_compact = true;
            }
            if (options.sort_attribute) {
                _this._comparator = ko.observable(_this._attributeComparator(options.sort_attribute));
            } else {
                _this._comparator = ko.observable(options.comparator);
            }
            if (options.filters) {
                _this._filters = ko.observableArray(function() {
                    if (_.isArray(options.filters)) {
                        return options.filters;
                    }
                    if (options.filters) {
                        return [
                            options.filters
                        ];
                    }
                }());
            } else {
                _this._filters = ko.observableArray([]);
            }
            var create_options = _this.create_options = {
                store: kb.Store.useOptionsOrCreate(options, collection, observable)
            }; // create options
            kb.utils.wrappedObject(observable, collection);
            // view model factory create factories
            _this.path = options.path;
            create_options.factory = kb.utils.wrappedFactory(observable, _this._shareOrCreateFactory(options));
            create_options.path = kb.utils.pathJoin(options.path, "models");
            // check for models only
            create_options.creator = create_options.factory.creatorForPath(null, create_options.path);
            if (create_options.creator) {
                _this.models_only = create_options.creator.models_only;
            }
            // publish public interface on the observable and return instead of this
            kb.publishMethods(observable, _this, KEYS_PUBLISH);
            // start the processing
            _this._collection = ko.observable(collection);
            observable.collection = _this.collection = ko.computed({
                read: function() {
                    return _this._collection();
                },
                write: function(new_collection) {
                    return kb.ignore(function() {
                        var previous_collection;
                        if ((previous_collection = _this._collection()) === new_collection) {
                            return;
                        } // no change
                        // @create_options.store.reuse(@, new_collection) # not meant to be shared
                        kb.utils.wrappedObject(observable, new_collection);
                        // clean up
                        if (previous_collection) {
                            previous_collection.unbind("all", _this._onCollectionChange);
                        }
                        // store in _kb_collection so that a collection() function can be exposed on the observable and so the collection can be
                        if (new_collection) {
                            new_collection.bind("all", _this._onCollectionChange);
                        }
                        // update references (including notification)
                        return _this._collection(new_collection);
                    });
                }
            });
            if (collection) {
                collection.bind("all", _this._onCollectionChange);
            } // bind now
            // observable that will re-trigger when sort or filters or collection changes
            _this._mapper = ko.computed(function() {
                var filter;
                var models;
                var view_models;
                var comparator = _this._comparator(); // create dependency
                var filters = _this._filters(); // create dependency
                if (filters) {
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = Array.from(filters)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            filter = _step.value;
                            ko.utils.unwrapObservable(filter);
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
                } // create a dependency
                var current_collection = _this._collection(); // create dependency
                if (_this.in_edit) {
                    return;
                } // we are doing the editing
                // no models
                observable = kb.utils.wrappedObservable(_this);
                var _previous_view_models = kb.peek(observable);
                if (current_collection) {
                    models = current_collection.models;
                }
                if (!models || current_collection.models.length === 0) {
                    view_models = [];
                // process filters, sorting, etc
                } else {
                    // apply filters
                    models = _.filter(models, function(model) {
                        return !filters.length || _this._selectModel(model);
                    });
                    // apply sorting
                    if (comparator) {
                        view_models = _.map(models, function(model) {
                            return _this._createViewModel(model);
                        }).sort(comparator);
                    // no sorting
                    } else {
                        if (_this.models_only) {
                            view_models = filters.length ? models : models.slice(); // clone the array if it wasn't filtered
                        } else {
                            view_models = _.map(models, function(model) {
                                return _this._createViewModel(model);
                            });
                        }
                    }
                }
                // update the observable array for this collection observable
                _this.in_edit++;
                observable(view_models);
                _this.in_edit--;
            // TODO: release previous
            // unless @models_only
            //   create_options.store.release(view_model) for view_model in previous_view_models
            });
            // start subscribing
            observable.subscribe(_.bind(_this._onObservableArrayChange, _this));
            !kb.statistics || kb.statistics.register("CollectionObservable", _this); // collect memory management statistics
            return observable;
        });
    }
    _create_class(CollectionObservable, [
        {
            // Required clean up function to break cycles, release view models, etc.
            // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
            key: "destroy",
            value: function destroy() {
                this.__kb_released = true;
                var observable = kb.utils.wrappedObservable(this);
                var collection = kb.peek(this._collection);
                kb.utils.wrappedObject(observable, null);
                if (collection) {
                    collection.unbind("all", this._onCollectionChange);
                    var array = kb.peek(observable);
                    array.splice(0, array.length); // clear the view models or models
                }
                this.collection.dispose();
                this._collection = observable.collection = this.collection = null;
                this._mapper.dispose();
                this._mapper = null;
                kb.release(this._filters);
                this._filters = null;
                this._comparator(null);
                this._comparator = null;
                this.create_options = null;
                observable.collection = null;
                kb.utils.wrappedDestroy(this);
                return !kb.statistics || kb.statistics.unregister("CollectionObservable", this); // collect memory management statistics
            }
        },
        {
            // Get the options for a new collection that can be used for sharing view models.
            //
            // @example Sharing view models for an HTML select element.
            //   var selected_collection = new Backbone.Collection();
            //   var available_collection = new Backbone.Collection([{name: 'Bob'}, {name: 'Fred'}]);
            //   var selected = kb.collectionObservable(available_collection);
            //   var available = kb.collectionObservable(available_collection, available_collection.shareOptions()); // view models shared with selected collection observable
            key: "shareOptions",
            value: function shareOptions() {
                var observable = kb.utils.wrappedObservable(this);
                return {
                    store: kb.utils.wrappedStore(observable),
                    factory: kb.utils.wrappedFactory(observable)
                };
            }
        },
        {
            // Setter for the filters array for excluding models in the collection observable.
            //
            // @param [Id|Function|Array] filters filters can be individual ids (observable or simple) or arrays of ids, functions, or arrays of functions.
            //
            // @example
            //    // exclude a single model by id
            //    collection_observable.filters(model.id);
            key: "filters",
            value: function filters(filters) {
                if (filters) {
                    return this._filters(_.isArray(filters) ? filters : [
                        filters
                    ]);
                }
                return this._filters([]);
            }
        },
        {
            // Setter for the sorted index function for auto-sorting the ViewModels or Models in a kb.CollectionObservable.
            //
            // @param [Function] comparator a function that returns an index where to insert the model. Signature: function(models, model)
            // @param [Function] comparator a function that is used to sort an object. Signature: `function(model_a, model_b)` returns negative value for ascending, 0 for equal, and positive for descending
            //
            // @example
            //    // change the sorting function
            //    collection_observable.comparator(
            //      function(view_models, vm){
            //        return _.comparator(view_models, vm, (test) -> kb.utils.wrappedModel(test).get('name'));
            //      }
            //    );
            key: "comparator",
            value: function comparator(comparator) {
                return this._comparator(comparator);
            }
        },
        {
            // Setter for the sort attribute name for auto-sorting the ViewModels or Models in a kb.CollectionObservable.
            //
            // @param [String] sort_attribute the name of an attribute. Default: resort on all changes to a model.
            //
            // @example
            //    var todos = new kb.CollectionObservable(new Backbone.Collection([{name: 'Zanadu', name: 'Alex'}]));
            //    // in order of Zanadu then Alex
            //    todos.sortAttribute('name');
            //    // in order of Alex then Zanadu
            key: "sortAttribute",
            value: function sortAttribute(sort_attribute) {
                return this._comparator(sort_attribute ? this._attributeComparator(sort_attribute) : null);
            }
        },
        {
            // Reverse lookup for a view model by model. If created with models_only option, will return null.
            key: "viewModelByModel",
            value: function viewModelByModel(model) {
                if (this.models_only) {
                    return null;
                }
                var id_attribute = model.hasOwnProperty(model.idAttribute) ? model.idAttribute : "cid";
                return _.find(kb.peek(kb.utils.wrappedObservable(this)), function(test) {
                    if (__guard__(test != null ? test.__kb : undefined, function(x) {
                        return x.object;
                    })) {
                        return test.__kb.object[id_attribute] === model[id_attribute];
                    }
                    return false;
                });
            }
        },
        {
            // Will return true unless created with models_only option.
            //
            // @example
            //   var todos1 = new kb.CollectionObservable(new Backbone.Collection(), {models_only: true});
            //   todos1.hasViewModels();     // false
            //   var todos2 = new kb.CollectionObservable(new Backbone.Collection());
            //   todos2.hasViewModels();     // true
            key: "hasViewModels",
            value: function hasViewModels() {
                return !this.models_only;
            }
        },
        {
            // Compacts the Collection Observable to use the least amount of memory. Currently, this is brute force meaning it releases than regenerates all view models when called.
            //
            key: "compact",
            value: function compact() {
                var _this = this;
                return kb.ignore(function() {
                    var observable = kb.utils.wrappedObservable(_this);
                    if (!kb.utils.wrappedStoreIsOwned(observable)) {
                        return;
                    }
                    kb.utils.wrappedStore(observable).clear();
                    return _this._collection.notifySubscribers(_this._collection());
                });
            }
        },
        {
            //###################################################
            // Internal
            //###################################################
            // @nodoc
            key: "_shareOrCreateFactory",
            value: function _shareOrCreateFactory(options) {
                var factory;
                var absolute_models_path = kb.utils.pathJoin(options.path, "models");
                var factories = options.factories;
                // check the existing factory
                if (factory = options.factory) {
                    // models matches, check additional paths
                    var existing_creator;
                    if ((existing_creator = factory.creatorForPath(null, absolute_models_path)) && (!factories || factories.models === existing_creator)) {
                        if (!factories) {
                            return factory;
                        } // all match, share the factory
                        // all match, share the factory
                        if (factory.hasPathMappings(factories, options.path)) {
                            return factory;
                        }
                    }
                }
                // need to create a new factory
                factory = new kb.Factory(options.factory);
                if (factories) {
                    factory.addPathMappings(factories, options.path);
                }
                // set up the default create function
                if (!factory.creatorForPath(null, absolute_models_path)) {
                    if (options.hasOwnProperty("models_only")) {
                        if (options.models_only) {
                            factory.addPathMapping(absolute_models_path, {
                                models_only: true
                            });
                        } else {
                            factory.addPathMapping(absolute_models_path, kb.ViewModel);
                        }
                    } else if (options.view_model) {
                        factory.addPathMapping(absolute_models_path, options.view_model);
                    } else if (options.create) {
                        factory.addPathMapping(absolute_models_path, {
                            create: options.create
                        });
                    } else {
                        factory.addPathMapping(absolute_models_path, kb.ViewModel);
                    }
                }
                return factory;
            }
        },
        {
            // @nodoc
            key: "_onCollectionChange",
            value: function _onCollectionChange(event, arg) {
                var _this = this;
                return kb.ignore(function() {
                    var comparator;
                    var view_model;
                    if (_this.in_edit || kb.wasReleased(_this)) {
                        return;
                    } // we are doing the editing or have been released
                    switch(event){
                        case "reset":
                            if (_this.auto_compact) {
                                _this.compact();
                            } else {
                                _this._collection.notifySubscribers(_this._collection());
                            }
                            break;
                        case "sort":
                        case "resort":
                            _this._collection.notifySubscribers(_this._collection());
                            break;
                        case "new":
                        case "add":
                            {
                                if (!_this._selectModel(arg)) {
                                    return;
                                } // filtered
                                var observable = kb.utils.wrappedObservable(_this);
                                var collection = _this._collection();
                                if (collection.indexOf(arg) === -1) {
                                    return;
                                } // the model may have been removed before we got a chance to add it
                                if (view_model = _this.viewModelByModel(arg)) {
                                    return;
                                } // it may have already been added by a change event
                                _this.in_edit++;
                                if (comparator = _this._comparator()) {
                                    observable().push(_this._createViewModel(arg));
                                    observable.sort(comparator);
                                } else {
                                    observable.splice(collection.indexOf(arg), 0, _this._createViewModel(arg));
                                }
                                _this.in_edit--;
                                break;
                            }
                        case "remove":
                        case "destroy":
                            _this._onModelRemove(arg);
                            break;
                        case "change":
                            // filtered, remove
                            if (!_this._selectModel(arg)) {
                                return _this._onModelRemove(arg);
                            }
                            view_model = _this.models_only ? arg : _this.viewModelByModel(arg);
                            if (!view_model) {
                                return _this._onCollectionChange("add", arg);
                            } // add new
                            if (!(comparator = _this._comparator())) {
                                return;
                            }
                            _this.in_edit++;
                            kb.utils.wrappedObservable(_this).sort(comparator);
                            _this.in_edit--;
                            break;
                    }
                });
            }
        },
        {
            // @nodoc
            key: "_onModelRemove",
            value: function _onModelRemove(model) {
                var view_model = this.models_only ? model : this.viewModelByModel(model); // either remove a view model or a model
                if (!view_model) {
                    return;
                } // it may have already been removed
                var observable = kb.utils.wrappedObservable(this);
                this.in_edit++;
                observable.remove(view_model);
                return this.in_edit--;
            }
        },
        {
            // @nodoc
            key: "_onObservableArrayChange",
            value: function _onObservableArrayChange(models_or_view_models) {
                var _this = this;
                return kb.ignore(function() {
                    var models;
                    if (_this.in_edit) {
                        return;
                    } // we are doing the editing
                    // validate input
                    _this.models_only && (!models_or_view_models.length || kb.isModel(models_or_view_models[0])) || !_this.models_only && (!models_or_view_models.length || _.isObject(models_or_view_models[0]) && !kb.isModel(models_or_view_models[0])) || kb._throwUnexpected(_this, "incorrect type passed");
                    var observable = kb.utils.wrappedObservable(_this);
                    var collection = kb.peek(_this._collection);
                    var has_filters = kb.peek(_this._filters).length;
                    if (!collection) {
                        return;
                    } // no collection or we are updating ourselves
                    var view_models = models_or_view_models;
                    // set Models
                    if (_this.models_only) {
                        models = _.filter(models_or_view_models, function(model) {
                            return !has_filters || _this._selectModel(model);
                        });
                    // set ViewModels
                    } else {
                        !has_filters || (view_models = []); // check for filtering of ViewModels
                        models = [];
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(var _iterator = Array.from(models_or_view_models)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                var view_model = _step.value;
                                var current_view_model;
                                var model = kb.utils.wrappedObject(view_model);
                                if (has_filters) {
                                    if (!_this._selectModel(model)) {
                                        continue;
                                    } // filtered so skip
                                    view_models.push(view_model);
                                }
                                // check for view models being different (will occur if a ko select selectedOptions is bound to this collection observable) -> update our store
                                if (current_view_model = _this.create_options.store.find(model, _this.create_options.creator)) {
                                    current_view_model.constructor === view_model.constructor || kb._throwUnexpected(_this, "replacing different type of view model");
                                }
                                _this.create_options.store.retain(view_model, model, _this.create_options.creator);
                                models.push(model);
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
                    // a change, update models
                    _this.in_edit++;
                    models_or_view_models.length === view_models.length || observable(view_models); // replace the ViewModels because they were filtered
                    _.isEqual(collection.models, models) || collection.reset(models);
                    _this.in_edit--;
                });
            }
        },
        {
            // @nodoc
            key: "_attributeComparator",
            value: function _attributeComparator(sort_attribute) {
                var modelAttributeCompare = function modelAttributeCompare(model_a, model_b) {
                    var attribute_name = ko.utils.unwrapObservable(sort_attribute);
                    return kb.compare(model_a.get(attribute_name), model_b.get(attribute_name));
                };
                return this.models_only ? modelAttributeCompare : function(model_a, model_b) {
                    return modelAttributeCompare(kb.utils.wrappedModel(model_a), kb.utils.wrappedModel(model_b));
                };
            }
        },
        {
            // @nodoc
            key: "_createViewModel",
            value: function _createViewModel(model) {
                if (this.models_only) {
                    return model;
                }
                return this.create_options.store.retainOrCreate(model, this.create_options);
            }
        },
        {
            // @nodoc
            key: "_selectModel",
            value: function _selectModel(model) {
                var filters = kb.peek(this._filters);
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = Array.from(filters)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var filter = _step.value;
                        filter = kb.peek(filter);
                        if (_.isFunction(filter)) {
                            if (!filter(model)) {
                                return false;
                            }
                        } else if (_.isArray(filter)) {
                            if (!Array.from(filter).includes(model.id)) {
                                return false;
                            }
                        } else {
                            if (model.id !== filter) {
                                return false;
                            }
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
                return true;
            }
        }
    ]);
    return CollectionObservable;
}();
// @nodoc
_define_property(CollectionObservable, "extend", kb.extend);
// factory function
kb.collectionObservable = function(_collection, _view_model, _options) {
    return new kb.CollectionObservable(arguments);
};
kb.observableCollection = kb.collectionObservable;
function __guard__(value, transform) {
    return typeof value !== "undefined" && value !== null ? transform(value) : undefined;
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }