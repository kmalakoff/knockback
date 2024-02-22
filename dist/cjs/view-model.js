/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
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
var kb;
var _ref = kb = require("./kb"), _ = _ref._, ko = _ref.ko;
// @nodoc
var assignViewModelKey = function assignViewModelKey(vm, key) {
    var vm_key = vm.__kb.internals && ~_.indexOf(vm.__kb.internals, key) ? "_".concat(key) : key;
    if (vm.__kb.view_model.hasOwnProperty(vm_key)) {
        return;
    } // already exists, skip
    vm.__kb.view_model[vm_key] = null;
    return vm_key;
};
// @nodoc
var createObservable = function createObservable(vm, model, key, create_options) {
    var vm_key;
    if (vm.__kb.excludes && ~_.indexOf(vm.__kb.excludes, key)) {
        return;
    }
    if (vm.__kb.statics && ~_.indexOf(vm.__kb.statics, key)) {
        return;
    }
    if (!(vm_key = assignViewModelKey(vm, key))) {
        return;
    }
    return vm[vm_key] = vm.__kb.view_model[vm_key] = kb.observable(model, key, create_options, vm);
};
// @nodoc
var createStaticObservables = function createStaticObservables(vm, model) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = Array.from(vm.__kb.statics)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var key = _step.value;
            var vm_key;
            if (vm_key = assignViewModelKey(vm, key)) {
                if (model.has(vm_key)) {
                    vm[vm_key] = vm.__kb.view_model[vm_key] = model.get(vm_key);
                } else if (vm.__kb.static_defaults && vm_key in vm.__kb.static_defaults) {
                    vm[vm_key] = vm.__kb.view_model[vm_key] = vm.__kb.static_defaults[vm_key];
                } else {
                    delete vm.__kb.view_model[vm_key];
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
};
var KEYS_OPTIONS = [
    "keys",
    "internals",
    "excludes",
    "statics",
    "static_defaults"
];
// Base class for ViewModels for Models.
//
// @example How to create a ViewModel with first_name and last_name observables.
//   var view_model = kb.viewModel(new Backbone.Model({first_name: "Planet", last_name: "Earth"}));
//
// @example Bulk kb.Observable create using 'key' Object to customize the kb.Observable created per attribute.
//   var ContactViewModel = function(model) {
//     this.loading_message = new kb.LocalizedStringLocalizer(new LocalizedString('loading'));
//     this._auto = kb.viewModel(model, {
//       keys: {
//         name: { key: 'name', 'default': this.loading_message },
//         number: { key: 'number', 'default': this.loading_message },
//         date: { key: 'date', 'default': this.loading_message, localizer: kb.ShortDateLocalizer }
//       }
//     }, this);
//     return this;
//   };
//
// @example Creating ko.Observables on a target ViewModel
//   var view_model = {};
//   kb.viewModel(model, ['name', 'date'], view_model); // observables are added to view_model
//
// @method .extend(prototype_properties, class_properties)
//   Class method for JavaScript inheritance.
//   @param [Object] prototype_properties the properties to add to the prototype
//   @param [Object] class_properties the properties to add to the class
//   @return [kb.ViewModel] the constructor returns 'this'
//   @example
//     var ContactViewModel = kb.ViewModel.extend({
//       constructor: function(model) {
//         kb.ViewModel.prototype.constructor.call(this, model, {internals: ['email', 'date']});   // call super constructor: @name, @_email, and @_date created in super from the model attributes
//         this.email = kb.defaultObservable(this._email, 'your.name@yourplace.com');
//         this.date = new LongDateLocalizer(this._date);
//         return this;
//       }
//     });
//   @example
//     var ViewModel = kb.ViewModel.extend({
//       constructor: function(model){
//         kb.ViewModel.prototype.constructor.apply(this, arguments);
//         this.full_name = ko.computed(function() { return this.first_name() + " " + this.last_name(); }, this);
//       }
//     });
//     var view_model = new ViewModel(model);
//
// @method #model()
//   Dual-purpose getter/setter ko.computed for the observed model.
//   @return [Model|ModelRef|void] getter: the model whose attributes are being observed (can be null) OR setter: void
//   @example
//     var view_model = kb.viewModel(new Backbone.Model({name: 'bob'}));
//     var the_model = view_model.model(); // get
//     view_model.model(new Backbone.Model({name: 'fred'})); // set
//
var Cls = kb.ViewModel = /*#__PURE__*/ function() {
    "use strict";
    function ViewModel(model, options, _view_model) {
        var _this = this;
        _class_call_check(this, ViewModel);
        if (options == null) {
            options = {};
        }
        var args = Array.prototype.slice.call(_.isArguments(model) ? model : arguments);
        return kb.ignore(function() {
            !(model = args.shift()) || kb.isModel(model) || kb._throwUnexpected(_this, "not a model");
            if (_.isArray(args[0])) {
                args[0] = {
                    keys: args[0]
                };
            }
            if (!_this.__kb) {
                _this.__kb = {};
            }
            _this.__kb.view_model = args.length > 1 ? args.pop() : _this;
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
            options = kb.utils.collapseOptions(options);
            var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
            try {
                for(var _iterator1 = Array.from(KEYS_OPTIONS)[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                    var key = _step1.value;
                    if (options.hasOwnProperty(key)) {
                        _this.__kb[key] = options[key];
                    }
                }
            } catch (err) {
                _didIteratorError1 = true;
                _iteratorError1 = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                        _iterator1.return();
                    }
                } finally{
                    if (_didIteratorError1) {
                        throw _iteratorError1;
                    }
                }
            }
            // always use a store to ensure recursive view models are handled correctly
            kb.Store.useOptionsOrCreate(options, model, _this);
            // view model factory
            _this.__kb.path = options.path;
            kb.Factory.useOptionsOrCreate(options, _this, options.path);
            var _model = kb.utils.set(_this, "_model", ko.observable());
            _this.model = ko.computed({
                read: function() {
                    return ko.utils.unwrapObservable(_model);
                },
                write: function(new_model) {
                    return kb.ignore(function() {
                        if (kb.wasReleased(_this) || !event_watcher) {
                            return;
                        }
                        _this.__kb.store.reuse(_this, kb.utils.resolveModel(new_model));
                        event_watcher.emitter(new_model);
                        _model(event_watcher.ee);
                        return !event_watcher.ee || _this.createObservables(event_watcher.ee);
                    });
                }
            });
            var event_watcher = kb.utils.wrappedEventWatcher(_this, new kb.EventWatcher(model, _this, {
                emitter: _this._model,
                update: function() {
                    return kb.ignore(function() {
                        return !(event_watcher != null ? event_watcher.ee : undefined) || _this.createObservables(event_watcher != null ? event_watcher.ee : undefined);
                    });
                }
            }));
            kb.utils.wrappedObject(_this, model = event_watcher.ee);
            _model(event_watcher.ee);
            // update the observables
            _this.__kb.create_options = {
                store: kb.utils.wrappedStore(_this),
                factory: kb.utils.wrappedFactory(_this),
                path: _this.__kb.path,
                event_watcher: kb.utils.wrappedEventWatcher(_this)
            };
            !options.requires || _this.createObservables(model, options.requires);
            !_this.__kb.internals || _this.createObservables(model, _this.__kb.internals);
            !options.mappings || _this.createObservables(model, options.mappings);
            !_this.__kb.statics || createStaticObservables(_this, model);
            _this.createObservables(model, _this.__kb.keys);
            !kb.statistics || kb.statistics.register("ViewModel", _this); // collect memory management statistics
            return _this;
        });
    }
    _create_class(ViewModel, [
        {
            // Required clean up function to break cycles, release view models, etc.
            // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
            key: "destroy",
            value: function destroy() {
                this.__kb_released = true;
                if (this.__kb.view_model !== this) {
                    for(var vm_key in this.__kb.vm_keys){
                        this.__kb.view_model[vm_key] = null;
                    }
                } // clear the external references
                this.__kb.view_model = this.__kb.create_options = null;
                kb.releaseKeys(this);
                kb.utils.wrappedDestroy(this);
                return !kb.statistics || kb.statistics.unregister("ViewModel", this); // collect memory management statistics
            }
        },
        {
            // Get the options for a new view model that can be used for sharing view models.
            key: "shareOptions",
            value: function shareOptions() {
                return {
                    store: kb.utils.wrappedStore(this),
                    factory: kb.utils.wrappedFactory(this)
                };
            }
        },
        {
            // create observables manually
            key: "createObservables",
            value: function createObservables(model, keys) {
                var key;
                if (!keys) {
                    var rel_keys;
                    if (this.__kb.keys || !model) {
                        return;
                    } // only use the keys provided
                    for(key in model.attributes){
                        createObservable(this, model, key, this.__kb.create_options);
                    }
                    if (rel_keys = __guardMethod__(kb.settings.orm, "keys", function(o) {
                        return o.keys(model);
                    })) {
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(var _iterator = Array.from(rel_keys)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                key = _step.value;
                                createObservable(this, model, key, this.__kb.create_options);
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
                } else if (_.isArray(keys)) {
                    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                    try {
                        for(var _iterator1 = Array.from(keys)[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                            key = _step1.value;
                            createObservable(this, model, key, this.__kb.create_options);
                        }
                    } catch (err) {
                        _didIteratorError1 = true;
                        _iteratorError1 = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                _iterator1.return();
                            }
                        } finally{
                            if (_didIteratorError1) {
                                throw _iteratorError1;
                            }
                        }
                    }
                } else {
                    for(key in keys){
                        var vm_key;
                        var mapping_info = keys[key];
                        if (vm_key = assignViewModelKey(this, key)) {
                            if (!_.isString(mapping_info)) {
                                if (!mapping_info.key) {
                                    mapping_info.key = vm_key;
                                }
                            }
                            this[vm_key] = this.__kb.view_model[vm_key] = kb.observable(model, mapping_info, this.__kb.create_options, this);
                        }
                    }
                }
            }
        }
    ], [
        {
            key: "initClass",
            value: function initClass() {
                // @nodoc
                ViewModel.extend = kb.extend;
            // for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")
            }
        }
    ]);
    return ViewModel;
}();
Cls.initClass();
// Factory function to create a kb.ViewModel.
kb.viewModel = function(_model, _options, _view_model) {
    return new kb.ViewModel(arguments);
};
function __guardMethod__(obj, methodName, transform) {
    if (typeof obj !== "undefined" && obj !== null && typeof obj[methodName] === "function") {
        return transform(obj, methodName);
    }
    return undefined;
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }