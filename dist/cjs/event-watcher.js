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
var kb;
var _ref = kb = require("./kb"), _ = _ref._, ko = _ref.ko;
// Used to provide a central place to aggregate registered Model events rather than having all kb.Observables register for updates independently.
//
kb.EventWatcher = /*#__PURE__*/ function() {
    "use strict";
    function EventWatcher(emitter, obj, callback_options) {
        _class_call_check(this, EventWatcher);
        this._onModelLoaded = this._onModelLoaded.bind(this);
        this._onModelUnloaded = this._onModelUnloaded.bind(this);
        this._unbindCallbacks = this._unbindCallbacks.bind(this);
        if (!this.__kb) {
            this.__kb = {};
        }
        this.__kb.callbacks = {};
        this.ee = null;
        if (callback_options) {
            this.registerCallbacks(obj, callback_options);
        }
        if (emitter) {
            this.emitter(emitter);
        }
    }
    _create_class(EventWatcher, [
        {
            // Required clean up function to break cycles, release view emitters, etc.
            // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
            key: "destroy",
            value: function destroy() {
                this.emitter(null);
                this.__kb.callbacks = null;
                return kb.utils.wrappedDestroy(this);
            }
        },
        {
            // Dual-purpose getter/setter for the observed emitter.
            //
            // @overload emitter()
            //   Gets the emitter or emitter reference
            //   @return [Model|ModelRef] the emitter whose attributes are being observed (can be null)
            // @overload emitter(new_emitter)
            //   Sets the emitter or emitter reference
            //   @param [Model|ModelRef] new_emitter the emitter whose attributes will be observed (can be null)
            key: "emitter",
            value: function emitter(new_emitter) {
                // get or no change
                if (arguments.length === 0 || this.ee === new_emitter) {
                    return this.ee;
                }
                // clear and unbind previous
                if (this.model_ref) {
                    this.model_ref.unbind("loaded", this._onModelLoaded);
                    this.model_ref.unbind("unloaded", this._onModelUnloaded);
                    this.model_ref.release();
                    this.model_ref = null;
                }
                // set up current
                if (kb.Backbone && kb.Backbone.ModelRef && _instanceof(new_emitter, kb.Backbone.ModelRef)) {
                    this.model_ref = new_emitter;
                    this.model_ref.retain();
                    this.model_ref.bind("loaded", this._onModelLoaded);
                    this.model_ref.bind("unloaded", this._onModelUnloaded);
                    new_emitter = this.model_ref.model() || null;
                } else {
                    this.model_ref = undefined;
                }
                // switch bindings
                if (this.ee !== new_emitter) {
                    if (new_emitter) {
                        this._onModelLoaded(new_emitter);
                    } else {
                        this._onModelUnloaded(this.ee);
                    }
                }
                return new_emitter;
            }
        },
        {
            // Used to register callbacks for an emitter.
            //
            // @param [Object] obj the owning object.
            // @param [Object] callback_info the callback information
            // @option options [Function] emitter callback for when the emitter changes (eg. is loaded). Signature: function(new_emitter)
            // @option options [Function] update callback for when the registered emitter is triggered. Signature: function(new_value)
            // @option options [String] emitter_name the name of the emitter.
            // @option options [String] key the optional key to filter update attribute events.
            key: "registerCallbacks",
            value: function registerCallbacks(obj, callback_info) {
                var _this = this;
                obj || kb._throwMissing(this, "obj");
                callback_info || kb._throwMissing(this, "callback_info");
                var event_names = callback_info.event_selector ? callback_info.event_selector.split(" ") : [
                    "change"
                ];
                var model = this.ee;
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = Array.from(event_names)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var event_name = _step.value;
                        if (!event_name) {
                            continue;
                        } // extra spaces
                        (function(event_name) {
                            var callbacks;
                            var info;
                            if (!(callbacks = _this.__kb.callbacks[event_name])) {
                                callbacks = _this.__kb.callbacks[event_name] = {
                                    model: null,
                                    list: [],
                                    fn: function(model) {
                                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                        try {
                                            for(var _iterator = Array.from(callbacks.list)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                                var info = _step.value;
                                                if (!info.update) {
                                                    continue;
                                                }
                                                if (model && info.key && model.hasChanged && !model.hasChanged(ko.utils.unwrapObservable(info.key))) {
                                                    continue;
                                                } // key doesn't match
                                                !kb.statistics || kb.statistics.addModelEvent({
                                                    name: event_name,
                                                    model: model,
                                                    key: info.key,
                                                    path: info.path
                                                });
                                                info.update();
                                            } // trigger update
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
                                        return null;
                                    }
                                };
                            }
                            callbacks.list.push(info = _.defaults({
                                obj: obj
                            }, callback_info)); // store the callback information
                            if (model) {
                                return _this._onModelLoaded(model);
                            }
                        })(event_name);
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
                return this;
            }
        },
        {
            key: "releaseCallbacks",
            value: function releaseCallbacks(obj) {
                var callbacks;
                this.ee = null;
                for(var event_name in this.__kb.callbacks){
                    callbacks = this.__kb.callbacks[event_name];
                    this._unbindCallbacks(event_name, callbacks, kb.wasReleased(obj));
                } // unbind all events
                return this.__kb.callbacks = undefined;
            }
        },
        {
            //###################################################
            // Internal
            //###################################################
            // @nodoc
            // NOTE: this is called by registerCallbacks so the model could already be bound and we just want to bind the new info
            // NOTE: this is called by emitter so it may be used to clear a previous emitter without triggering an intermediate change
            key: "_onModelLoaded",
            value: function _onModelLoaded(model) {
                this.ee = model;
                for(var event_name in this.__kb.callbacks){
                    // bind all events
                    var callbacks = this.__kb.callbacks[event_name];
                    if (callbacks.model && callbacks.model !== model) {
                        this._unbindCallbacks(event_name, callbacks, true);
                    }
                    if (!callbacks.model) {
                        callbacks.model = model;
                        model.bind(event_name, callbacks.fn);
                    }
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = Array.from(callbacks.list)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var info = _step.value;
                            if (!info.unbind_fn) {
                                info.unbind_fn = kb.settings.orm != null ? kb.settings.orm.bind(model, info.key, info.update, info.path) : undefined;
                            }
                            if (info.emitter) {
                                info.emitter(model);
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
            }
        },
        {
            // @nodoc
            key: "_onModelUnloaded",
            value: function _onModelUnloaded(model) {
                if (this.ee !== model) {
                    return;
                }
                this.ee = null;
                for(var event_name in this.__kb.callbacks){
                    var callbacks = this.__kb.callbacks[event_name];
                    this._unbindCallbacks(event_name, callbacks);
                } // unbind all events
            }
        },
        {
            // @nodoc
            key: "_unbindCallbacks",
            value: function _unbindCallbacks(event_name, callbacks, skip_emitter) {
                if (callbacks.model) {
                    callbacks.model.unbind(event_name, callbacks.fn);
                    callbacks.model = null;
                }
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = Array.from(callbacks.list)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var info = _step.value;
                        if (info.unbind_fn) {
                            info.unbind_fn();
                            info.unbind_fn = null;
                        }
                        if (info.emitter && !skip_emitter && !kb.wasReleased(info.obj)) {
                            info.emitter(null);
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
        }
    ], [
        {
            key: "useOptionsOrCreate",
            value: // Used to either register yourself with the existing emitter watcher or to create a new one.
            //
            // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(emitter, options)
            // @param [Model|ModelRef] obj the Model that will own or register with the store
            // @param [ko.observable|Object] emitter the emitters of the event watcher
            // @param [Object] callback_options information about the event and callback to register
            // @option options [Function] emitter callback for when the emitter changes (eg. is loaded). Signature: function(new_emitter)
            // @option options [Function] update callback for when the registered event is triggered. Signature: function(new_value)
            // @option options [String] event_selector the name or names of events.
            // @option options [String] key the optional key to filter update attribute events.
            function useOptionsOrCreate(options, emitter, obj, callback_options) {
                if (options.event_watcher) {
                    if (options.event_watcher.emitter() !== emitter && options.event_watcher.model_ref !== emitter) {
                        kb._throwUnexpected(EventWatcher, "emitter not matching");
                    }
                    return kb.utils.wrappedEventWatcher(obj, options.event_watcher).registerCallbacks(obj, callback_options);
                }
                kb.utils.wrappedEventWatcherIsOwned(obj, true);
                return kb.utils.wrappedEventWatcher(obj, new kb.EventWatcher(emitter)).registerCallbacks(obj, callback_options);
            }
        }
    ]);
    return EventWatcher;
}();
// factory function
kb.emitterObservable = function(emitter, observable) {
    return new kb.EventWatcher(emitter, observable);
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }