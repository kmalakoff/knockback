/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
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
var TypedValue = require("./typed-value");
var KEYS_PUBLISH = [
    "value",
    "valueType",
    "destroy"
];
var KEYS_INFO = [
    "args",
    "read",
    "write"
];
// Base class for observing model attributes.
//
// @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
//   var ContactViewModel = function(model) {
//     this.name = kb.observable(model, 'name');
//     this.number = kb.observable(model, { key: 'number'});
//   };
//   var model = new Contact({ name: 'Ringo', number: '555-555-5556' });
//   var view_model = new ContactViewModel(model);
//
// @example How to create a kb.Observable with a default value.
//   var model = Backbone.Model({name: 'Bob'});
//   var name = kb.observable(model, {key:'name', default: '(none)'}); // name is Bob
//   name.setToDefault(); // name is (none)
//
// @method #model()
//   Dual-purpose getter/setter ko.computed for the observed model.
//   @return [Model|ModelRef|void] getter: the model whose attributes are being observed (can be null) OR setter: void
//   @example
//     var observable = kb.observable(new Backbone.Model({name: 'bob'}), 'name');
//     var the_model = observable.model(); // get
//     observable.model(new Backbone.Model({name: 'fred'})); // set
//
kb.Observable = /*#__PURE__*/ function() {
    "use strict";
    function Observable(model, key_or_info, options, _vm) {
        var _this = this;
        _class_call_check(this, Observable);
        if (_vm == null) {
            _vm = {};
        }
        this._vm = _vm;
        return kb.ignore(function() {
            var key;
            key_or_info || kb._throwMissing(_this, "key_or_info");
            _this.key = key_or_info.key || key_or_info;
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = Array.from(KEYS_INFO)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    key = _step.value;
                    if (key_or_info[key]) {
                        _this[key] = key_or_info[key];
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
            var create_options = kb.utils.collapseOptions(options);
            var event_watcher = create_options.event_watcher;
            create_options.event_watcher = undefined;
            // set up basics
            _this._value = new TypedValue(create_options);
            _this._model = ko.observable();
            var observable = kb.utils.wrappedObservable(_this, ko.computed({
                read: function() {
                    var args;
                    var _model = _this._model();
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = Array.from(args = [
                            _this.key
                        ].concat(_this.args || []))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var arg = _step.value;
                            ko.utils.unwrapObservable(arg);
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
                    __guard__(kb.utils.wrappedEventWatcher(_this), function(x) {
                        return x.emitter(_model || null);
                    }); // update the event watcher
                    if (_this.read) {
                        _this.update(_this.read.apply(_this._vm, args));
                    } else if (!_.isUndefined(_model)) {
                        kb.ignore(function() {
                            return _this.update(kb.getValue(_model, kb.peek(_this.key), _this.args));
                        });
                    }
                    return _this._value.value();
                },
                write: function(new_value) {
                    return kb.ignore(function() {
                        var unwrapped_new_value = kb.utils.unwrapModels(new_value); // unwrap for set (knockout may pass view models which are required for the observable but not the model)
                        var _model = kb.peek(_this._model);
                        if (_this.write) {
                            _this.write.call(_this._vm, unwrapped_new_value);
                            new_value = kb.getValue(_model, kb.peek(_this.key), _this.args);
                        } else if (_model) {
                            kb.setValue(_model, kb.peek(_this.key), unwrapped_new_value);
                        }
                        return _this.update(new_value);
                    });
                },
                owner: _this._vm
            }));
            observable.__kb_is_o = true; // mark as a kb.Observable
            create_options.store = kb.utils.wrappedStore(observable, create_options.store);
            create_options.path = kb.utils.pathJoin(create_options.path, _this.key);
            if (create_options.factories && (typeof create_options.factories === "function" || create_options.factories.create)) {
                create_options.factory = kb.utils.wrappedFactory(observable, new kb.Factory(create_options.factory));
                create_options.factory.addPathMapping(create_options.path, create_options.factories);
            } else {
                create_options.factory = kb.Factory.useOptionsOrCreate(create_options, observable, create_options.path);
            }
            create_options.factories = undefined;
            // publish public interface on the observable and return instead of this
            kb.publishMethods(observable, _this, KEYS_PUBLISH);
            // use external model observable or create
            observable.model = _this.model = ko.computed({
                read: function() {
                    return ko.utils.unwrapObservable(_this._model);
                },
                write: function(new_model) {
                    return kb.ignore(function() {
                        if (_this.__kb_released || kb.peek(_this._model) === new_model) {
                            return;
                        } // destroyed or no change
                        // update references
                        var new_value = kb.getValue(new_model, kb.peek(_this.key), _this.args);
                        _this._model(new_model);
                        if (!new_model) {
                            return _this.update(null);
                        }
                        if (!_.isUndefined(new_value)) {
                            return _this.update(new_value);
                        }
                    });
                }
            });
            kb.EventWatcher.useOptionsOrCreate({
                event_watcher: event_watcher
            }, model || null, _this, {
                emitter: _this.model,
                update: function() {
                    return kb.ignore(function() {
                        return _this.update();
                    });
                },
                key: _this.key,
                path: create_options.path
            });
            _this._value.rawValue() || _this._value.update(); // wasn't loaded so create
            if (kb.LocalizedObservable && key_or_info.localizer) {
                observable = new key_or_info.localizer(observable);
            } // wrap ourselves with a localizer
            if (kb.DefaultObservable && key_or_info.hasOwnProperty("default")) {
                observable = kb.defaultObservable(observable, key_or_info.default);
            } // wrap ourselves with a default value
            return observable;
        });
    }
    _create_class(Observable, [
        {
            // Required clean up function to break cycles, release view models, etc.
            // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
            key: "destroy",
            value: function destroy() {
                var observable = kb.utils.wrappedObservable(this);
                this.__kb_released = true;
                this._value.destroy();
                this._value = null;
                this.model.dispose();
                this.model = observable.model = null;
                return kb.utils.wrappedDestroy(this);
            }
        },
        {
            // @return [kb.CollectionObservable|kb.ViewModel|ko.observable] exposes the raw value inside the kb.observable. For example, if your attribute is a Collection, it will hold a CollectionObservable.
            key: "value",
            value: function value() {
                return this._value.rawValue();
            }
        },
        {
            // @return [kb.TYPE_UNKNOWN|kb.TYPE_SIMPLE|kb.TYPE_ARRAY|kb.TYPE_MODEL|kb.TYPE_COLLECTION] provides the type of the wrapped value.
            key: "valueType",
            value: function valueType() {
                return this._value.valueType(kb.peek(this._model), kb.peek(this.key));
            }
        },
        {
            //###################################################
            // Internal
            //###################################################
            // @nodoc
            key: "update",
            value: function update(new_value) {
                if (this.__kb_released) {
                    return;
                } // destroyed, nothing to do
                if (!arguments.length) {
                    new_value = kb.getValue(kb.peek(this._model), kb.peek(this.key));
                }
                return this._value.update(new_value);
            }
        }
    ]);
    return Observable;
}();
kb.observable = function(model, key, options, view_model) {
    return new kb.Observable(model, key, options, view_model);
};
function __guard__(value, transform) {
    return typeof value !== "undefined" && value !== null ? transform(value) : undefined;
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }