/*
  knockback.js 1.2.2
  Copyright (c)  2011-2017 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("backbone"), require("underscore"), require("knockout"));
	else if(typeof define === 'function' && define.amd)
		define(["backbone", "underscore", "knockout"], factory);
	else if(typeof exports === 'object')
		exports["kb"] = factory(require("backbone"), require("underscore"), require("knockout"));
	else
		root["kb"] = factory(root["Backbone"], root["_"], root["ko"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_27__, __WEBPACK_EXTERNAL_MODULE_28__, __WEBPACK_EXTERNAL_MODULE_29__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var root = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : undefined;

var ko = __webpack_require__(29);

var _ = null;
var Backbone = null;

var LIFECYCLE_METHODS = ['release', 'destroy', 'dispose'];

// The 'kb' namespace for classes, factory functions, constants, etc.
//
// @method .configure(options)
//   Method to update Knockback global configuration.
//   @param [Object] configuration options.
// 1) orm - select the library for relationships (default, backbone-orm, backbone-associations, backbone-relational)
// 2) deep_retain - true to multiply retain view models in the store
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
//   Factory to create a new kb.DefaultObservable. See {kb.DefaultObservable#constructor} for information on options.
//   If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-defaults component.
//   @param [ko.observable] target_observable the observable to check for null, undefined, or the empty string
//   @param [Any] default_value the default value. Can be a value, string or ko.observable
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
//
// @method .formattedObservable(format, arg1, arg2, etc)
//   Factory to create a new kb.FormattedObservable. See {kb.FormattedObservable#constructor} for information on options.
//   If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-formatting component.
//   @param [String|ko.observable] format the format string.
//   Format: `"{0} and {1}"` where `{0}` and `{1}` would be synchronized with the arguments (eg. "Bob and Carol" where `{0}` is Bob and `{1}` is Carol)
//   @param [Array] args arguments to be passed to the kb.LocaleManager's get() method
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
//
// @method .localizedObservable(value, options, view_model)
//   Factory to create a new kb.LocalizedObservable. See {kb.LocalizedObservable#constructor} for information on options.
//   If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-localization component.
//   @param [Data|ko.observable] value the value to localize
//   @param [Object] options the create options
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable

var kb = function () {
  function kb() {
    _classCallCheck(this, kb);
  }

  _createClass(kb, null, [{
    key: 'initClass',
    value: function initClass() {
      // Knockback library semantic version
      this.VERSION = '1.2.2';

      // ###################################
      // OBSERVABLE STORAGE TYPES
      // ###################################

      // Stored value type is not known like null/undefined (could be observed as a Model or a Collection or a simple type)
      this.TYPE_UNKNOWN = 0;
      // Stored value type is simple like a String or Number -> observable type: ko.observable
      this.TYPE_SIMPLE = 1;
      // Stored value type is an Array -> observable type: ko.observableArray
      this.TYPE_ARRAY = 2;
      // Stored value type is a Model -> observable type: ViewModel
      this.TYPE_MODEL = 3;
      // Stored value type is a Collection -> observable type: kb.CollectionObservable
      this.TYPE_COLLECTION = 4;

      // Helper to ignore dependencies in a function
      //
      // @param [Object] obj the object to test
      //
      // @example
      //   kb.ignore(fn);
      var _ignore = function _ignore(callback, callbackTarget, callbackArgs) {
        var value = null;
        ko.computed(function () {
          value = callback.apply(callbackTarget, callbackArgs || []);
        }).dispose();
        return value;
      };
      this.ignore = ko.dependencyDetection && ko.dependencyDetection.ignore ? ko.dependencyDetection.ignore : _ignore;
    }

    // Checks if an object has been released.
    // @param [Any] obj the object to release and also release its keys

  }, {
    key: 'wasReleased',
    value: function wasReleased(obj) {
      return !obj || obj.__kb_released;
    }

    // Checks if an object can be released. Used to perform minimal nested releasing on objects by checking if self or next level contained items can be released.
    // @param [Any] obj the object to release and also release its keys

  }, {
    key: 'isReleaseable',
    value: function isReleaseable(obj, depth) {
      if (depth == null) {
        depth = 0;
      }
      if (!obj || obj !== Object(obj) || obj.__kb_released) return false; // must be an object and not already released
      if (ko.isObservable(obj) || obj instanceof kb.ViewModel) return true; // a known type that is releasable
      if (typeof obj === 'function' || kb.isModel(obj) || kb.isCollection(obj)) return false; // a known type that is not releaseable
      for (var i = 0, l = LIFECYCLE_METHODS.length; i < l; i++) {
        var method = LIFECYCLE_METHODS[i];
        if (typeof obj[method] === 'function') return true;
      }

      if (depth > 0) return false; // max depth check for ViewModel inside of ViewModel
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var value = obj[key];
          if (key !== '__kb' && kb.isReleaseable(value, depth + 1)) return true;
        }
      }
      return false;
    }

    // Releases any type of view model or observable or items in an array using the conventions of release(), destroy(), dispose().
    // @param [Any] obj the object to release and also release its keys
    //
    // @example
    //   var view_model = kb.viewModel(model);
    //   kb.release(view_model); view_model = null;
    // @example
    //   var todos = kb.collectionObservable(collection);
    //   kb.release(todos); todos = null;

  }, {
    key: 'release',
    value: function release(obj) {
      if (!kb.isReleaseable(obj)) return;
      obj.__kb_released = true; // mark as released

      // release array's items
      if (_.isArray(obj)) {
        _.each(obj, function (value, index) {
          if (kb.isReleaseable(value)) {
            obj[index] = null;kb.release(value);
          }
        });
        return;
      }

      // observable or lifecycle managed
      var array = kb.peek(obj);
      if (ko.isObservable(obj) && _.isArray(array)) {
        if (obj.__kb_is_co || obj.__kb_is_o && obj.valueType() === kb.TYPE_COLLECTION) {
          if (typeof obj.destroy === 'function') obj.destroy();
          return;
        }
        _.each(array, function (value, index) {
          if (kb.isReleaseable(value)) {
            array[index] = null;kb.release(value);
          }
        });
        if (typeof obj.dispose === 'function') {
          obj.dispose();
        }
        return;
      }

      // releaseable signature
      for (var i = 0, l = LIFECYCLE_METHODS.length; i < l; i++) {
        var method = LIFECYCLE_METHODS[i];
        if (typeof obj[method] === 'function') {
          obj[method].call(obj);
          return;
        }
      }

      if (!ko.isObservable(obj)) this.releaseKeys(obj); // view model
    }

    // Releases and clears all of the keys on an object using the conventions of release(), destroy(), dispose() without releasing the top level object itself.

  }, {
    key: 'releaseKeys',
    value: function releaseKeys(obj) {
      _.each(obj, function (value, key) {
        if (key !== '__kb' && kb.isReleaseable(value)) {
          obj[key] = null;
          kb.release(value);
        }
      });
    }

    // Binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
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

  }, {
    key: 'releaseOnNodeRemove',
    value: function releaseOnNodeRemove(view_model, node) {
      view_model || kb._throwUnexpected(this, 'missing view model');
      node || kb._throwUnexpected(this, 'missing node');
      return ko.utils.domNodeDisposal.addDisposeCallback(node, function () {
        return kb.release(view_model);
      });
    }

    // Renders a template and binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
    //
    // NOTE: if you provide an afterRender method on the View Model and do not provide afterRender in the options,
    // afterRender will be called with the following signature: afterRender(element) which differs from the Knockout signture of afterRender(elements)
    //
    // @example The easy way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
    //   var el = kb.renderTemplate('my_template', kb.viewModel(new Backbone.Model({name: 'Bob'})));
    //   ...
    //   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)

  }, {
    key: 'renderTemplate',
    value: function renderTemplate(template, view_model) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!root.document) {
        typeof console === 'undefined' || console.log('renderTemplate: document is undefined');
        return undefined;
      }

      var el = root.document.createElement('div');
      var observable = ko.renderTemplate(template, view_model, options, el, 'replaceChildren');

      // do not return the template wrapper if possible
      if (el.childNodes.length === 1) el = el.childNodes[0];else if (el.childNodes.length) {
        for (var i = 0, end = el.childNodes.length, asc = end >= 0; asc ? i <= end : i >= end; asc ? i++ : i--) {
          // ensure the context is passed up to wrapper from a child
          try {
            ko.storedBindingContextForNode(el, ko.contextFor(el.childNodes[i]));
            break;
          } catch (err) {/**/}
        }
      }
      kb.releaseOnNodeRemove(view_model, el);
      observable.dispose(); // we will handle memory management with ko.removeNode (otherwise creates memory leak on default bound dispose function)

      if (view_model.afterRender && !options.afterRender) view_model.afterRender(el); // call afterRender for custom setup unless provided in options (so doesn't get double called)
      return el;
    }

    // Applies bindings and binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
    //
    // @example The easy way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
    //   var el = $('<div data-bind="name: name"></div>')[0];
    //   kb.applyBindings(kb.viewModel(new Backbone.Model({name: 'Bob'})), el);
    //   ...
    //   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)

  }, {
    key: 'applyBindings',
    value: function applyBindings(view_model, node) {
      if (!root.document) {
        typeof console === 'undefined' || console.log('renderTemplate: document is undefined');
        return undefined;
      }

      if (node.length) {
        // convert to a root element
        var children = node;
        node = root.document.createElement('div');
        _.each(children, function (child) {
          return node.appendChild(child);
        });
      }
      ko.applyBindings(view_model, node);
      kb.releaseOnNodeRemove(view_model, node);
      return node;
    }
  }, {
    key: 'getValue',
    value: function getValue(model, key, args) {
      if (!model) return undefined;
      if (_.isFunction(model[key]) && (kb.settings.orm != null ? kb.settings.orm.useFunction(model, key) : undefined)) return model[key]();
      if (!args) return model.get(key);
      return model.get.apply(model, _toConsumableArray(_.map([key].concat(args), function (value) {
        return kb.peek(value);
      })));
    }
  }, {
    key: 'setValue',
    value: function setValue(model, key, value) {
      var attributes = void 0;
      if (!model) return undefined;
      if (_.isFunction(model[key]) && (kb.settings.orm != null ? kb.settings.orm.useFunction(model, key) : undefined)) return model[key](value);
      (attributes = {})[key] = value;
      return model.set(attributes);
    }

    // ###################################
    // INTERNAL HELPERS
    // ###################################
    // @nodoc

  }, {
    key: '_throwMissing',
    value: function _throwMissing(instance, message) {
      throw new Error((_.isString(instance) ? instance : instance.constructor.name) + ': ' + message + ' is missing');
    }

    // @nodoc

  }, {
    key: '_throwUnexpected',
    value: function _throwUnexpected(instance, message) {
      throw new Error((_.isString(instance) ? instance : instance.constructor.name) + ': ' + message + ' is unexpected');
    }

    // @nodoc

  }, {
    key: 'publishMethods',
    value: function publishMethods(observable, instance, methods) {
      _.each(methods, function (fn) {
        observable[fn] = kb._.bind(instance[fn], instance);
      });
    }

    // @nodoc

  }, {
    key: 'peek',
    value: function peek(obs) {
      if (!ko.isObservable(obs)) return obs;
      if (obs.peek) return obs.peek();
      return kb.ignore(function () {
        return obs();
      });
    }

    // @nodoc

  }, {
    key: 'isModel',
    value: function isModel(obj) {
      return obj && (obj instanceof kb.Model || typeof obj.get === 'function' && typeof obj.bind === 'function');
    }

    // @nodoc

  }, {
    key: 'isCollection',
    value: function isCollection(obj) {
      return obj && obj instanceof kb.Collection;
    }
  }]);

  return kb;
}();

kb.initClass();
module.exports = kb;

if (root.Parse) {
  kb.Parse = root.Parse;Backbone = kb.Parse;
  kb._ = root.Parse._;_ = kb._;
} else {
  kb.Backbone = __webpack_require__(27);Backbone = kb.Backbone;
  kb._ = __webpack_require__(28);_ = kb._;
}
kb.ko = ko;

// cache local references
kb.Collection = Backbone.Collection;
kb.Model = Backbone.Object || Backbone.Model;
kb.Events = Backbone.Events;

// Object.assign
kb.assign = _.assign || _.extend;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var kb = __webpack_require__(0);

var _ = kb._;


var ALL_ORMS = {
  default: null,
  'backbone-orm': null,
  'backbone-associations': __webpack_require__(23),
  'backbone-relational': __webpack_require__(24)
};

// @nodoc
kb.settings = { orm: ALL_ORMS.default };
for (var key in ALL_ORMS) {
  if (Object.prototype.hasOwnProperty.call(ALL_ORMS, key)) {
    var value = ALL_ORMS[key];
    if (value && value.isAvailable()) {
      kb.settings.orm = value;
      break;
    }
  }
}

// @nodoc
module.exports = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _.each(options, function (value, key) {
    switch (key) {
      case 'orm':
        // set by name
        if (_.isString(value)) {
          if (!Object.prototype.hasOwnProperty.call(ALL_ORMS, value)) {
            typeof console === 'undefined' || console.log('Knockback configure: could not find orm: ' + value + '. Available: ' + _.keys(ALL_ORMS).join(', '));
            return;
          }

          var orm = ALL_ORMS[value];
          if (orm && !orm.isAvailable()) {
            typeof console === 'undefined' || console.log('Knockback configure: could not enable orm ' + value + '. Make sure it is included before Knockback');
            return;
          }
          kb.settings.orm = orm;
        } else kb.settings.orm = value;
        break;

      default:
        kb.settings[key] = value;break;
    }
  });
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var kb = __webpack_require__(0);

var _ = kb._,
    ko = kb.ko;

// @nodoc

module.exports = function () {
  function TypedValue(create_options) {
    _classCallCheck(this, TypedValue);

    this.create_options = create_options;
    this._vo = ko.observable(null); // create a value observable for the first dependency
  }

  _createClass(TypedValue, [{
    key: 'destroy',
    value: function destroy() {
      this.__kb_released = true;
      var previous_value = this.__kb_value;
      if (previous_value) {
        this.__kb_value = null;
        if (this.create_options.store && kb.utils.wrappedCreator(previous_value)) {
          this.create_options.store.release(previous_value);
        } else kb.release(previous_value);
      }
      this.create_options = null;
    }
  }, {
    key: 'value',
    value: function value() {
      return ko.utils.unwrapObservable(this._vo());
    }
  }, {
    key: 'rawValue',
    value: function rawValue() {
      return this.__kb_value;
    }
  }, {
    key: 'valueType',
    value: function valueType(model, key) {
      var new_value = kb.getValue(model, key);
      this.value_type || this._updateValueObservable(new_value); // create so we can check the type
      return this.value_type;
    }
  }, {
    key: 'update',
    value: function update(new_value) {
      if (this.__kb_released) return undefined; // destroyed, nothing to do

      // determine the new type
      new_value !== undefined || (new_value = null); // ensure null instead of undefined
      var new_type = kb.utils.valueType(new_value);

      if (this.__kb_value && this.__kb_value.__kb_released) {
        this.__kb_value = undefined;this.value_type = undefined;
      }
      var value = this.__kb_value;

      switch (this.value_type) {
        case kb.TYPE_COLLECTION:
          if (this.value_type === kb.TYPE_COLLECTION && new_type === kb.TYPE_ARRAY) return value(new_value);
          if (new_type === kb.TYPE_COLLECTION || _.isNull(new_value)) {
            // use the provided CollectionObservable
            if (new_value && new_value instanceof kb.CollectionObservable) this._updateValueObservable(kb.utils.wrappedObject(new_value), new_value);else if (kb.peek(value.collection) !== new_value) value.collection(new_value); // collection observables are allocated once
            return undefined;
          }
          break;

        case kb.TYPE_MODEL:
          if (new_type === kb.TYPE_MODEL || _.isNull(new_value)) {
            // use the provided ViewModel
            if (new_value && !kb.isModel(new_value)) this._updateValueObservable(kb.utils.wrappedObject(new_value), new_value);else if (kb.utils.wrappedObject(value) !== kb.utils.resolveModel(new_value)) this._updateValueObservable(new_value);
            return undefined;
          }
          break;
        default:
          break;
      }

      if (this.value_type === new_type && !_.isUndefined(this.value_type)) {
        if (kb.peek(value) !== new_value) return value(new_value);
      } else if (kb.peek(value) !== new_value) return this._updateValueObservable(new_value);
      return undefined;
    }
  }, {
    key: '_updateValueObservable',
    value: function _updateValueObservable(new_value, new_observable) {
      var create_options = this.create_options;

      var creator = kb.utils.inferCreator(new_value, create_options.factory, create_options.path);

      // retain previous type
      if (new_value === null && !creator) {
        if (this.value_type === kb.TYPE_MODEL) creator = kb.ViewModel;else if (this.value_type === kb.TYPE_COLLECTION) creator = kb.CollectionObservable;
      }
      create_options.creator = creator;

      var value_type = kb.TYPE_UNKNOWN;
      var previous_value = this.__kb_value;
      this.__kb_value = undefined;

      var value = void 0;
      if (new_observable) {
        value = new_observable;
        if (create_options.store) create_options.store.retain(new_observable, new_value, creator);

        // found a creator
      } else if (creator) {
        // have the store, use it to create
        if (create_options.store) value = create_options.store.retainOrCreate(new_value, create_options, true);

        // create manually
        else if (creator.models_only) {
            value = new_value;value_type = kb.TYPE_SIMPLE;
          } else if (creator.create) value = creator.create(new_value, create_options);else value = new creator(new_value, create_options);

        // create and cache the type
      } else if (_.isArray(new_value)) {
        value_type = kb.TYPE_ARRAY;value = ko.observableArray(new_value);
      } else {
        value_type = kb.TYPE_SIMPLE;value = ko.observable(new_value);
      }

      // determine the type
      this.value_type = value_type;
      if (value_type === kb.TYPE_UNKNOWN) {
        // a view model, recognize view_models as non-observable
        if (!ko.isObservable(value)) {
          this.value_type = kb.TYPE_MODEL;kb.utils.wrappedObject(value, kb.utils.resolveModel(new_value));
        } else if (value.__kb_is_co) {
          this.value_type = kb.TYPE_COLLECTION;kb.utils.wrappedObject(value, new_value);
        } else if (!this.value_type) this.value_type = kb.TYPE_SIMPLE;
      }

      // release previous
      if (previous_value) {
        this.create_options.store ? this.create_options.store.release(previous_value) : kb.release(previous_value);
      }

      // store the value
      this.__kb_value = value;
      return this._vo(value);
    }
  }]);

  return TypedValue;
}();

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._,
    ko = kb.ko;


var COMPARE_EQUAL = 0;
var COMPARE_ASCENDING = -1;
var COMPARE_DESCENDING = 1;

var KEYS_PUBLISH = ['destroy', 'shareOptions', 'filters', 'comparator', 'sortAttribute', 'viewModelByModel', 'hasViewModels'];

kb.compare = function (value_a, value_b) {
  // String compare
  if (_.isString(value_a)) {
    return value_a.localeCompare('' + value_b);
  }
  if (_.isString(value_b)) {
    return value_b.localeCompare('' + value_a);
  }

  // compare raw values
  return value_a === value_b ? COMPARE_EQUAL : value_a < value_b ? COMPARE_ASCENDING : COMPARE_DESCENDING;
};

// Base class for observing collections.
//
// @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
//   var collection = new Collection([{name: 'name1'}, {name: 'name2'}]);
//   var view_model = {
//     todos: kb.collectionObservable(collection)
//   };
//
// @example How to access and change the observed collection.
//    var todos = new kb.CollectionObservable(new kb.Collection([{name: 'name1'}, {name: 'name2'}]);
//    var current_collection = todos.collection(); // get
//    todos.collection(new Backbone.Collection([{name: 'name3'}, {name: 'name4'}])); // set
//
// @method .extend(prototype_properties, class_properties)
//   Class method for JavaScript inheritance.
//   @param [Object] prototype_properties the properties to add to the prototype
//   @param [Object] class_properties the properties to add to the class
//   @return [ko.observable] the constructor does not return 'this' but a ko.observableArray
//   @example
//     var MyCollectionObservable = kb.CollectionObservable.extend({
//        constructor: function(collection, options) {
//          // the constructor does not return 'this' but a ko.observableArray
//          return kb.CollectionObservable.prototype.constructor.call(this, collection, {
//            view_model: MyViewModel,
//            options: options
//        });
//     });
//
// @method #collection()
//   Dual-purpose getter/setter ko.computed for the observed collection.
//   @return [Collection|void] getter: the collection whose models are being observed (can be null) OR setter: void
//

var CollectionObservable = function () {
  _createClass(CollectionObservable, null, [{
    key: 'initClass',
    value: function initClass() {
      // @nodoc
      CollectionObservable.extend = kb.Parse ? kb.Parse._extend : kb.Model.extend;
      // for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")
    }

    // Used to create a new kb.CollectionObservable.
    //
    // When the observable is updated, the following Backbone.Events are triggered:
    //
    // * ***add***: (view_model, collection_observable) or if batch: (collection_observable)
    // * ***resort***: (view_model, collection_observable, new_index) or if batch: (collection_observable)
    // * ***remove***: (view_model, collection_observable) or if batch: (collection_observable)
    //
    // @param [Collection] collection the collection to observe (can be null)
    // @param [Object] options the create options
    // @option options [Boolean] models_only flag for skipping the creation of view models. The collection observable will be populated with (possibly sorted) models.
    // @option options [Boolean] auto_compact flag used to compact memory used by the collection observable when large changes occur, eg. resetting the collection.
    // @option options [Constructor] view_model the view model constructor used for models in the collection. Signature: constructor(model, options)
    // @option options [Function] create a function used to create a view model for models in the collection. Signature: create(model, options)
    // @option options [Object] factories a map of dot-deliminated paths;
    // for example 'models.owner': kb.ViewModel to either constructors or create functions. Signature: 'some.path': function(object, options)
    // @option options [Function] comparator a function that is used to sort an object.
    // Signature: `function(model_a, model_b)` returns negative value for ascending, 0 for equal, and positive for descending
    // @option options [String] sort_attribute the name of an attribute. Default: resort on all changes to a model.
    // @option options [Id|Function|Array] filters filters can be individual ids (observable or simple) or arrays of ids, functions, or arrays of functions.
    // @option options [String] path the path to the value (used to create related observables from the factory).
    // @option options [kb.Store] store a store used to cache and share view models.
    // @option options [kb.Factory] factory a factory used to create view models.
    // @option options [Object] options a set of options merge into these options. Useful for extending options when deriving classes rather than merging them by hand.
    // @return [ko.observableArray] the constructor does not return 'this' but a ko.observableArray
    // @note the constructor does not return 'this' but a ko.observableArray

  }]);

  function CollectionObservable() {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _classCallCheck(this, CollectionObservable);

    this._onCollectionChange = function (event, arg) {
      return kb.ignore(function () {
        if (_this.in_edit || kb.wasReleased(_this)) return undefined; // we are doing the editing or have been released

        switch (event) {
          case 'reset':
            {
              _this.auto_compact ? _this.compact() : _this._collection.notifySubscribers(_this._collection());
              break;
            }

          case 'sort':case 'resort':
            {
              _this._collection.notifySubscribers(_this._collection());
              break;
            }

          case 'new':case 'add':
            {
              if (!_this._selectModel(arg)) return undefined; // filtered

              var observable = kb.utils.wrappedObservable(_this);
              var collection = _this._collection();
              if (!~collection.indexOf(arg)) return undefined; // the model may have been removed before we got a chance to add it
              var view_model = _this.viewModelByModel(arg);
              if (view_model) return undefined; // it may have already been added by a change event
              _this.in_edit++;
              var comparator = _this._comparator();
              if (comparator) {
                observable().push(_this._createViewModel(arg));
                observable.sort(comparator);
              } else observable.splice(collection.indexOf(arg), 0, _this._createViewModel(arg));
              _this.in_edit--;
              break;
            }

          case 'remove':case 'destroy':
            {
              _this._onModelRemove(arg);
              break;
            }

          case 'change':
            {
              // filtered, remove
              if (!_this._selectModel(arg)) return _this._onModelRemove(arg);

              var _view_model = _this.models_only ? arg : _this.viewModelByModel(arg);
              if (!_view_model) return _this._onCollectionChange('add', arg); // add new
              var _comparator2 = _this._comparator();
              if (!_comparator2) return undefined;

              _this.in_edit++;
              kb.utils.wrappedObservable(_this).sort(_comparator2);
              _this.in_edit--;
              break;
            }
          default:
            break;
        }
        return undefined;
      });
    };

    this._onObservableArrayChange = function (models_or_view_models) {
      return kb.ignore(function () {
        var models = void 0;
        if (_this.in_edit) return; // we are doing the editing

        // validate input
        if (_this.models_only && models_or_view_models.length && !kb.isModel(models_or_view_models[0])) kb._throwUnexpected(_this, 'incorrect type passed');
        if (!_this.models_only && models_or_view_models.length && !(_.isObject(models_or_view_models[0]) || kb.isModel(models_or_view_models[0]))) kb._throwUnexpected(_this, 'incorrect type passed');

        var observable = kb.utils.wrappedObservable(_this);
        var collection = kb.peek(_this._collection);
        var has_filters = kb.peek(_this._filters).length;
        if (!collection) return; // no collection or we are updating ourselves

        var view_models = models_or_view_models;

        // set Models
        if (_this.models_only) {
          models = _.filter(models_or_view_models, function (model) {
            return !has_filters || _this._selectModel(model);
          });

          // set ViewModels
        } else {
          !has_filters || (view_models = []); // check for filtering of ViewModels
          models = [];
          _.each(models_or_view_models, function (view_model) {
            var model = kb.utils.wrappedObject(view_model);
            if (has_filters) {
              if (!_this._selectModel(model)) return; // filtered so skip
              view_models.push(view_model);
            }

            // check for view models being different (will occur if a ko select selectedOptions is bound to this collection observable) -> update our store
            var current_view_model = _this.create_options.store.find(model, _this.create_options.creator);
            if (current_view_model && current_view_model.constructor !== view_model.constructor) kb._throwUnexpected(_this, 'replacing different type of view model');
            _this.create_options.store.retain(view_model, model, _this.create_options.creator);
            models.push(model);
          });
        }

        // a change, update models
        _this.in_edit++;
        models_or_view_models.length === view_models.length || observable(view_models); // replace the ViewModels because they were filtered
        _.isEqual(collection.models, models) || collection.reset(models);
        _this.in_edit--;
      });
    };

    return kb.ignore(function () {
      var collection = null;
      if (args[0] instanceof kb.Collection) collection = args.shift();else collection = _.isArray(args[0]) ? new kb.Collection(args.shift()) : new kb.Collection();
      if (_.isFunction(args[0])) args[0] = { view_model: args[0] };

      var options = {};
      _.each(args, function (arg) {
        return kb.assign(options, arg);
      });

      var observable = kb.utils.wrappedObservable(_this, ko.observableArray([]));
      observable.__kb_is_co = true; // mark as a kb.CollectionObservable
      _this.in_edit = 0;

      // bind callbacks
      if (!_this.__kb) _this.__kb = {};

      // options
      options = kb.utils.collapseOptions(options);
      if (options.auto_compact) {
        _this.auto_compact = true;
      }

      if (options.sort_attribute) _this._comparator = ko.observable(_this._attributeComparator(options.sort_attribute));else _this._comparator = ko.observable(options.comparator);

      if (options.filters) _this._filters = ko.observableArray(_.isArray(options.filters) ? options.filters : [options.filters]);else _this._filters = ko.observableArray([]);

      // create options
      _this.create_options = { store: kb.Store.useOptionsOrCreate(options, collection, observable) };
      var create_options = _this.create_options;
      kb.utils.wrappedObject(observable, collection);

      // view model factory create factories
      _this.path = options.path;
      create_options.factory = kb.utils.wrappedFactory(observable, _this._shareOrCreateFactory(options));
      create_options.path = kb.utils.pathJoin(options.path, 'models');

      // check for models only
      create_options.creator = create_options.factory.creatorForPath(null, create_options.path);
      if (create_options.creator) {
        _this.models_only = create_options.creator.models_only;
      }

      // publish public interface on the observable and return instead of this
      kb.publishMethods(observable, _this, KEYS_PUBLISH);

      // start the processing
      _this._collection = ko.observable(collection);
      _this.collection = ko.computed({
        read: function read() {
          return _this._collection();
        },
        write: function write(new_collection) {
          return kb.ignore(function () {
            var previous_collection = _this._collection();
            if (previous_collection === new_collection) return undefined; // no change

            // @create_options.store.reuse(@, new_collection) # not meant to be shared
            kb.utils.wrappedObject(observable, new_collection);

            // clean up
            if (previous_collection) previous_collection.unbind('all', _this._onCollectionChange);

            // store in _kb_collection so that a collection() function can be exposed on the observable and so the collection can be
            if (new_collection) new_collection.bind('all', _this._onCollectionChange);

            // update references (including notification)
            return _this._collection(new_collection);
          });
        }
      });
      observable.collection = _this.collection;
      if (collection) collection.bind('all', _this._onCollectionChange); // bind now

      // observable that will re-trigger when sort or filters or collection changes
      _this._mapper = ko.computed(function () {
        var comparator = _this._comparator(); // create dependency
        var filters = _this._filters(); // create dependency
        if (filters) _.each(filters, function (filter) {
          return ko.utils.unwrapObservable(filter);
        }); // create a dependency
        var current_collection = _this._collection(); // create dependency
        if (_this.in_edit) return; // we are doing the editing

        // no models
        observable = kb.utils.wrappedObservable(_this);
        // const previous_view_models = kb.peek(observable);

        var models = void 0;
        if (current_collection) models = current_collection.models;

        var view_models = void 0;
        if (!models || current_collection.models.length === 0) view_models = [];
        // process filters, sorting, etc
        else {
            // apply filters
            models = _.filter(models, function (model) {
              return !filters.length || _this._selectModel(model);
            });

            // apply sorting
            if (comparator) view_models = _.map(models, function (model) {
              return _this._createViewModel(model);
            }).sort(comparator);
            // no sorting
            else if (_this.models_only) view_models = filters.length ? models : models.slice(); // clone the array if it wasn't filtered
              else view_models = _.map(models, function (model) {
                  return _this._createViewModel(model);
                });
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

      if (kb.statistics) kb.statistics.register('CollectionObservable', _this); // collect memory management statistics

      return observable;
    });
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(CollectionObservable, [{
    key: 'destroy',
    value: function destroy() {
      this.__kb_released = true;
      var observable = kb.utils.wrappedObservable(this);
      var collection = kb.peek(this._collection);kb.utils.wrappedObject(observable, null);
      if (collection) {
        collection.unbind('all', this._onCollectionChange);
        var array = kb.peek(observable);array.splice(0, array.length); // clear the view models or models
      }
      this.collection.dispose();this.collection = null;this._collection = null;observable.collection = null;
      this._mapper.dispose();this._mapper = null;
      kb.release(this._filters);this._filters = null;
      this._comparator(null);this._comparator = null;
      this.create_options = null;
      observable.collection = null;kb.utils.wrappedDestroy(this);

      if (kb.statistics) kb.statistics.unregister('CollectionObservable', this); // collect memory management statistics
    }

    // Get the options for a new collection that can be used for sharing view models.
    //
    // @example Sharing view models for an HTML select element.
    //   var selected_collection = new Backbone.Collection();
    //   var available_collection = new Backbone.Collection([{name: 'Bob'}, {name: 'Fred'}]);
    //   var selected = kb.collectionObservable(available_collection);
    //   var available = kb.collectionObservable(available_collection, available_collection.shareOptions()); // view models shared with selected collection observable

  }, {
    key: 'shareOptions',
    value: function shareOptions() {
      var observable = kb.utils.wrappedObservable(this);
      return { store: kb.utils.wrappedStore(observable), factory: kb.utils.wrappedFactory(observable) };
    }

    // Setter for the filters array for excluding models in the collection observable.
    //
    // @param [Id|Function|Array] filters filters can be individual ids (observable or simple) or arrays of ids, functions, or arrays of functions.
    //
    // @example
    //    // exclude a single model by id
    //    collection_observable.filters(model.id);

  }, {
    key: 'filters',
    value: function filters(_filters) {
      if (_filters) {
        return this._filters(_.isArray(_filters) ? _filters : [_filters]);
      }
      return this._filters([]);
    }

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

  }, {
    key: 'comparator',
    value: function comparator(_comparator) {
      return this._comparator(_comparator);
    }

    // Setter for the sort attribute name for auto-sorting the ViewModels or Models in a kb.CollectionObservable.
    //
    // @param [String] sort_attribute the name of an attribute. Default: resort on all changes to a model.
    //
    // @example
    //    var todos = new kb.CollectionObservable(new Backbone.Collection([{name: 'Zanadu', name: 'Alex'}]));
    //    // in order of Zanadu then Alex
    //    todos.sortAttribute('name');
    //    // in order of Alex then Zanadu

  }, {
    key: 'sortAttribute',
    value: function sortAttribute(sort_attribute) {
      return this._comparator(sort_attribute ? this._attributeComparator(sort_attribute) : null);
    }

    // Reverse lookup for a view model by model. If created with models_only option, will return null.

  }, {
    key: 'viewModelByModel',
    value: function viewModelByModel(model) {
      if (this.models_only) return null;
      var id_attribute = Object.prototype.hasOwnProperty.call(model, model.idAttribute) ? model.idAttribute : 'cid';
      return _.find(kb.peek(kb.utils.wrappedObservable(this)), function (test) {
        return test && test.__kb && test.__kb.object[id_attribute] === model[id_attribute];
      });
    }

    // Will return true unless created with models_only option.
    //
    // @example
    //   var todos1 = new kb.CollectionObservable(new Backbone.Collection(), {models_only: true});
    //   todos1.hasViewModels();     // false
    //   var todos2 = new kb.CollectionObservable(new Backbone.Collection());
    //   todos2.hasViewModels();     // true

  }, {
    key: 'hasViewModels',
    value: function hasViewModels() {
      return !this.models_only;
    }

    // Compacts the Collection Observable to use the least amount of memory. Currently, this is brute force meaning it releases than regenerates all view models when called.
    //

  }, {
    key: 'compact',
    value: function compact() {
      var _this2 = this;

      return kb.ignore(function () {
        var observable = kb.utils.wrappedObservable(_this2);
        if (!kb.utils.wrappedStoreIsOwned(observable)) return undefined;
        kb.utils.wrappedStore(observable).clear();
        return _this2._collection.notifySubscribers(_this2._collection());
      });
    }

    // ###################################################
    // Internal
    // ###################################################

    // @nodoc

  }, {
    key: '_shareOrCreateFactory',
    value: function _shareOrCreateFactory(options) {
      var absolute_models_path = kb.utils.pathJoin(options.path, 'models');
      var factories = options.factories;

      // check the existing factory

      var factory = options.factory;
      if (factory) {
        // models matches, check additional paths
        var existing_creator = factory.creatorForPath(null, absolute_models_path);
        if (existing_creator && (!factories || factories.models === existing_creator)) {
          if (!factories) return factory; // all match, share the factory

          // all match, share the factory
          if (factory.hasPathMappings(factories, options.path)) return factory;
        }
      }

      // need to create a new factory
      factory = new kb.Factory(options.factory);
      if (factories) {
        factory.addPathMappings(factories, options.path);
      }

      // set up the default create function
      if (!factory.creatorForPath(null, absolute_models_path)) {
        if (Object.prototype.hasOwnProperty.call(options, 'models_only')) {
          if (options.models_only) {
            factory.addPathMapping(absolute_models_path, { models_only: true });
          } else {
            factory.addPathMapping(absolute_models_path, kb.ViewModel);
          }
        } else if (options.view_model) {
          factory.addPathMapping(absolute_models_path, options.view_model);
        } else if (options.create) {
          factory.addPathMapping(absolute_models_path, { create: options.create });
        } else {
          factory.addPathMapping(absolute_models_path, kb.ViewModel);
        }
      }
      return factory;
    }

    // @nodoc

  }, {
    key: '_onModelRemove',


    // @nodoc
    value: function _onModelRemove(model) {
      var view_model = this.models_only ? model : this.viewModelByModel(model); // either remove a view model or a model
      if (!view_model) return undefined; // it may have already been removed
      var observable = kb.utils.wrappedObservable(this);
      this.in_edit++;
      observable.remove(view_model);
      return this.in_edit--;
    }

    // @nodoc

  }, {
    key: '_attributeComparator',


    // @nodoc
    value: function _attributeComparator(sort_attribute) {
      var modelAttributeCompare = function modelAttributeCompare(model_a, model_b) {
        var attribute_name = ko.utils.unwrapObservable(sort_attribute);
        return kb.compare(model_a.get(attribute_name), model_b.get(attribute_name));
      };
      return this.models_only ? modelAttributeCompare : function (model_a, model_b) {
        return modelAttributeCompare(kb.utils.wrappedModel(model_a), kb.utils.wrappedModel(model_b));
      };
    }

    // @nodoc

  }, {
    key: '_createViewModel',
    value: function _createViewModel(model) {
      if (this.models_only) {
        return model;
      }
      return this.create_options.store.retainOrCreate(model, this.create_options);
    }

    // @nodoc

  }, {
    key: '_selectModel',
    value: function _selectModel(model) {
      var filters = kb.peek(this._filters);
      for (var i = 0, l = filters.length; i < l; i++) {
        var filter = filters[i];
        filter = kb.peek(filter);
        if (_.isFunction(filter)) {
          if (!filter(model)) return false;
        } else if (_.isArray(filter)) {
          if (!~filter.indexOf(model.id)) return false;
        } else if (model.id !== filter) return false;
      }
      return true;
    }
  }]);

  return CollectionObservable;
}();

CollectionObservable.initClass();
kb.CollectionObservable = CollectionObservable;
module.exports = CollectionObservable;

// factory function
kb.collectionObservable = function () {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return new (Function.prototype.bind.apply(kb.CollectionObservable, [null].concat(args)))();
};
kb.observableCollection = kb.collectionObservable;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._,
    ko = kb.ko;

// Used to provide a central place to aggregate registered Model events rather than having all kb.Observables register for updates independently.
//

kb.EventWatcher = function () {
  _createClass(EventWatcher, null, [{
    key: 'useOptionsOrCreate',


    // Used to either register yourself with the existing emitter watcher or to create a new one.
    //
    // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(emitter, options)
    // @param [Model|ModelRef] obj the Model that will own or register with the store
    // @param [ko.observable|Object] emitter the emitters of the event watcher
    // @param [Object] callback_options information about the event and callback to register
    // @option options [Function] emitter callback for when the emitter changes (eg. is loaded). Signature: function(new_emitter)
    // @option options [Function] update callback for when the registered event is triggered. Signature: function(new_value)
    // @option options [String] event_selector the name or names of events.
    // @option options [String] key the optional key to filter update attribute events.
    value: function useOptionsOrCreate(options, emitter, obj, callback_options) {
      if (options.event_watcher) {
        if (options.event_watcher.emitter() !== emitter && options.event_watcher.model_ref !== emitter) {
          kb._throwUnexpected(this, 'emitter not matching');
        }
        return kb.utils.wrappedEventWatcher(obj, options.event_watcher).registerCallbacks(obj, callback_options);
      }
      kb.utils.wrappedEventWatcherIsOwned(obj, true);
      return kb.utils.wrappedEventWatcher(obj, new kb.EventWatcher(emitter)).registerCallbacks(obj, callback_options);
    }
  }]);

  function EventWatcher(emitter, obj, callback_options) {
    var _this = this;

    _classCallCheck(this, EventWatcher);

    this._onModelLoaded = function (model) {
      _this.ee = model;

      _.each(_this.__kb.callbacks, function (callbacks, event_name) {
        if (callbacks.model && callbacks.model !== model) _this._unbindCallbacks(event_name, callbacks, true);
        if (!callbacks.model) {
          callbacks.model = model;
          model.bind(event_name, callbacks.fn);
        }

        _.each(callbacks.list, function (info) {
          if (!info.unbind_fn && kb.settings.orm) info.unbind_fn = kb.settings.orm.bind(model, info.key, info.update, info.path);
          if (info.emitter) info.emitter(model);
        });
      });
    };

    this._onModelUnloaded = function (model) {
      if (_this.ee !== model) return;
      _this.ee = null;
      _.each(_this.__kb.callbacks, function (callbacks, event_name) {
        return _this._unbindCallbacks(event_name, callbacks);
      });
    };

    this._unbindCallbacks = function (event_name, callbacks, skip_emitter) {
      if (callbacks.model) {
        callbacks.model.unbind(event_name, callbacks.fn);callbacks.model = null;
      }

      _.each(callbacks.list, function (info) {
        if (info.unbind_fn) {
          info.unbind_fn(), info.unbind_fn = null;
        }
        if (info.emitter && !skip_emitter && !kb.wasReleased(info.obj)) {
          info.emitter(null);
        }
      });
    };

    if (!this.__kb) {
      this.__kb = {};
    }
    this.__kb.callbacks = {};

    this.ee = null;
    if (callback_options) this.registerCallbacks(obj, callback_options);
    if (emitter) this.emitter(emitter);
  }

  // Required clean up function to break cycles, release view emitters, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(EventWatcher, [{
    key: 'destroy',
    value: function destroy() {
      this.emitter(null);this.__kb.callbacks = null;
      return kb.utils.wrappedDestroy(this);
    }

    // Dual-purpose getter/setter for the observed emitter.
    //
    // @overload emitter()
    //   Gets the emitter or emitter reference
    //   @return [Model|ModelRef] the emitter whose attributes are being observed (can be null)
    // @overload emitter(new_emitter)
    //   Sets the emitter or emitter reference
    //   @param [Model|ModelRef] new_emitter the emitter whose attributes will be observed (can be null)

  }, {
    key: 'emitter',
    value: function emitter(new_emitter) {
      // get or no change
      if (arguments.length === 0 || this.ee === new_emitter) return this.ee;

      // clear and unbind previous
      if (this.model_ref) {
        this.model_ref.unbind('loaded', this._onModelLoaded);
        this.model_ref.unbind('unloaded', this._onModelUnloaded);
        this.model_ref.release();this.model_ref = null;
      }

      // set up current
      if (kb.Backbone && kb.Backbone.ModelRef && new_emitter instanceof kb.Backbone.ModelRef) {
        this.model_ref = new_emitter;this.model_ref.retain();
        this.model_ref.bind('loaded', this._onModelLoaded);
        this.model_ref.bind('unloaded', this._onModelUnloaded);
        new_emitter = this.model_ref.model() || null;
      } else {
        delete this.model_ref;
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

    // Used to register callbacks for an emitter.
    //
    // @param [Object] obj the owning object.
    // @param [Object] callback_info the callback information
    // @option options [Function] emitter callback for when the emitter changes (eg. is loaded). Signature: function(new_emitter)
    // @option options [Function] update callback for when the registered emitter is triggered. Signature: function(new_value)
    // @option options [String] emitter_name the name of the emitter.
    // @option options [String] key the optional key to filter update attribute events.

  }, {
    key: 'registerCallbacks',
    value: function registerCallbacks(obj, callback_info) {
      var _this2 = this;

      obj || kb._throwMissing(this, 'obj');
      callback_info || kb._throwMissing(this, 'callback_info');
      var event_names = callback_info.event_selector ? callback_info.event_selector.split(' ') : ['change'];
      var model = this.ee;

      _.each(event_names, function (event_name) {
        if (!event_name) return; // extra spaces

        var callbacks = _this2.__kb.callbacks[event_name];
        if (!callbacks) {
          _this2.__kb.callbacks[event_name] = {
            model: null,
            list: [],
            fn: function fn(m) {
              _.each(callbacks.list, function (info) {
                if (!info.update) return;
                if (m && info.key && m.hasChanged && !m.hasChanged(ko.utils.unwrapObservable(info.key))) return; // key doesn't match
                if (kb.statistics) kb.statistics.addModelEvent({ name: event_name, model: m, key: info.key, path: info.path });
                info.update();
              }); // trigger update
            }
          };
          callbacks = _this2.__kb.callbacks[event_name];
        }

        var info = _.defaults({ obj: obj }, callback_info);
        callbacks.list.push(info); // store the callback information
        if (model) _this2._onModelLoaded(model);
      });

      return this;
    }
  }, {
    key: 'releaseCallbacks',
    value: function releaseCallbacks(obj) {
      var _this3 = this;

      this.ee = null;
      _.each(this.__kb.callbacks, function (callbacks, event_name) {
        return _this3._unbindCallbacks(event_name, callbacks, kb.wasReleased(obj));
      });
      return delete this.__kb.callbacks;
    }

    // ###################################################
    // Internal
    // ###################################################

    // @nodoc
    // NOTE: this is called by registerCallbacks so the model could already be bound and we just want to bind the new info
    // NOTE: this is called by emitter so it may be used to clear a previous emitter without triggering an intermediate change


    // @nodoc


    // @nodoc

  }]);

  return EventWatcher;
}();

// factory function
kb.emitterObservable = function (emitter, observable) {
  return new kb.EventWatcher(emitter, observable);
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._;

// Used to share the hierachy of constructors and create functions by path to allow for custom creation per Model attribute.
//
// @example Create an instance by path.
//   var factory = new kb.Factory();
//   factory.addPathMapping('bob.the.builder', kb.ViewModel);
//   view_model = factory.createForPath(new Backbone.Model({name: 'Bob'}), 'bob.the.builder'); // creates kb.ViewModel

kb.Factory = function () {
  _createClass(Factory, null, [{
    key: 'useOptionsOrCreate',


    // Used to either register yourself with the existing factory or to create a new factory.
    //
    // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
    // @option options [Object] factories a map of dot-deliminated paths;
    // for example 'models.owner': kb.ViewModel to either constructors or create functions. Signature: 'some.path': function(object, options)
    // @param [Instance] obj the instance that will own or register with the store
    // @param [String] owner_path the path to the owning object for turning relative scoping of the factories to absolute paths.
    value: function useOptionsOrCreate(options, obj, owner_path) {
      // share
      if (options.factory && (!options.factories || options.factories && options.factory.hasPathMappings(options.factories, owner_path))) {
        return kb.utils.wrappedFactory(obj, options.factory);
      }

      // create a new factory
      var factory = kb.utils.wrappedFactory(obj, new kb.Factory(options.factory));
      if (options.factories) {
        factory.addPathMappings(options.factories, owner_path);
      }
      return factory;
    }
  }]);

  function Factory(parent_factory) {
    _classCallCheck(this, Factory);

    this.paths = {};
    if (parent_factory) this.parent_factory = parent_factory;
  }

  _createClass(Factory, [{
    key: 'hasPath',
    value: function hasPath(path) {
      return Object.prototype.hasOwnProperty.call(this.paths, path) && this.parent_factory ? this.parent_factory.hasPath(path) : false;
    }
  }, {
    key: 'addPathMapping',
    value: function addPathMapping(path, create_info) {
      this.paths[path] = create_info;
    }
  }, {
    key: 'addPathMappings',
    value: function addPathMappings(factories, owner_path) {
      var _this = this;

      _.each(factories, function (create_info, path) {
        _this.paths[kb.utils.pathJoin(owner_path, path)] = create_info;
      });
    }
  }, {
    key: 'hasPathMappings',
    value: function hasPathMappings(factories, owner_path) {
      var all_exist = true;
      for (var path in factories) {
        if (Object.prototype.hasOwnProperty.call(factories, path)) {
          var creator = factories[path];
          var existing_creator = this.creatorForPath(null, kb.utils.pathJoin(owner_path, path));
          all_exist &= existing_creator && creator === existing_creator;
        }
      }
      return all_exist;
    }

    // If possible, creates an observable for an object using a dot-deliminated path.
    //
    // @example Create an instance by path.
    //   var factory = new kb.Factory();
    //   factory.addPathMapping('bob.the.builder', kb.ViewModel);
    //   view_model = factory.createForPath(new Backbone.Model({name: 'Bob'}), 'bob.the.builder'); // creates kb.ViewModel

  }, {
    key: 'creatorForPath',
    value: function creatorForPath(obj, path) {
      var creator = this.paths[path];
      if (creator) return creator.view_model ? creator.view_model : creator;
      if (this.parent_factory) return this.parent_factory.creatorForPath(obj, path);
      return null;
    }
  }]);

  return Factory;
}();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

module.exports = kb;

kb.configure = __webpack_require__(1);

// re-expose modules
kb.modules = { underscore: kb._, backbone: kb.Parse || kb.Backbone, knockout: kb.ko };

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var root = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : undefined;

var kb = __webpack_require__(0);

var _ = kb._,
    ko = kb.ko;


kb.RECUSIVE_AUTO_INJECT = true;

// custom Knockout `inject` binding
ko.bindingHandlers.inject = {
  init: function init(element, value_accessor, all_bindings_accessor, view_model) {
    return kb.Inject.inject(ko.utils.unwrapObservable(value_accessor()), view_model, element, value_accessor, all_bindings_accessor);
  }
};

// Used to inject ViewModels and observables dynamically from your HTML Views. For both the `'kb-inject'` attribute and the data-bind `'inject'` custom binding, the following properties are reserved:
//
// * `'view_model'` class used to create a new ViewModel instance
// * `'create'` function used to manually add observables to a view model
// * `'options'` to pass to ko.applyBindings
// * `'afterBinding'` callback (can alternatively be in the options)
// * `'beforeBinding'` callback (can alternatively be in the options)
//
// Each function/constructor gets called with the following signature `'function(view_model, element)'`.
//
// @example Bind your application automatically when the DOM is loaded.
//   <div kb-inject><span data-bind="text: 'Hello World!'"></span></div>
// @example Bind your application with properties.
//   <div kb-inject="message: ko.observable('Hello World!')"><input data-bind="value: message"></input></div>
// @example Bind your application creating a specific ViewModel instance when the DOM is loaded.
//   <div kb-inject="MyViewModel"><input data-bind="value: message"></input></div>
//   var MyViewModel = function(view_model, el) {
//     this.message = ko.observable('Hello World!');
//   }
// @example Bind your application using a function when the DOM is loaded (like Angular.js controllers).
//   <div kb-inject="create: MyController"><input data-bind="value: message"></input></div>
//   var MyController = function(view_model, el) {
//     view_model.message = ko.observable('Hello World!');
//   }
// @example Bind your application with a specific ViewModel instance and a callback before and after the binding.
//   <div kb-inject="MyViewModel"><input data-bind="value: message"></input></div>
//   var MyViewModel = function(view_model, el) {
//     this.message = ko.observable('Hello World!');
//     this.beforeBinding = function() {alert('before'); };
//     this.afterBinding = function() {alert('after'); };
//   }
// @example Dynamically inject new properties into your ViewModel.
//   <div kb-inject="MyViewModel">
//     <div class="control-group" data-bind="inject: {site: ko.observable('http://your.url.com')}">
//       <label>Website</label>
//       <input type="url" name="site" data-bind="value: site, valueUpdate: 'keyup'" required>
//     </div>
//   </div>
//   var MyViewModel = function(view_model, el) {
//     // site will be dynamically attached to this ViewModel
//   }
// @example Dynamically bind a form.
//   <div kb-inject="MyViewModel">
//      <form name="my_form" data-bind="inject: kb.formValidator">
//        <div class="control-group">
//         <label>Name</label>
//         <input type="text" name="name" data-bind="value: name, valueUpdate: 'keyup'" required>
//       </div>
//       <div class="control-group">
//         <label>Website</label>
//         <input type="url" name="site" data-bind="value: site, valueUpdate: 'keyup'" required>
//       </div>
//     </form>
//   </div>
//   var MyViewModel = kb.ViewModel.extend({
//     constructor: ->
//       model = new Backbone.Model({name: '', site: 'http://your.url.com'});
//       kb.ViewModel.prototype.constructor.call(this, model);
//   });
kb.Inject = function () {
  function Inject() {
    _classCallCheck(this, Inject);
  }

  _createClass(Inject, null, [{
    key: 'inject',

    // @private
    value: function inject(data, view_model, element, value_accessor, all_bindings_accessor, nested) {
      var doInject = function doInject(value) {
        if (_.isFunction(value)) {
          view_model = new value(view_model, element, value_accessor, all_bindings_accessor); // use 'new' to allow for classes in addition to functions
          kb.releaseOnNodeRemove(view_model, element);
        } else {
          // view_model constructor causes a scope change
          if (value.view_model) {
            // specifying a view_model changes the scope so we need to bind a destroy
            view_model = new value.view_model(view_model, element, value_accessor, all_bindings_accessor);
            kb.releaseOnNodeRemove(view_model, element);
          }

          // resolve and merge in each key
          _.each(value, function (item, key) {
            if (key === 'view_model') return;

            // create function
            if (key === 'create') item(view_model, element, value_accessor, all_bindings_accessor);

            // resolve nested with assign or not
            else if (_.isObject(item) && !_.isFunction(item)) {
                var target = nested || item && item.create ? {} : view_model;
                view_model[key] = kb.Inject.inject(item, target, element, value_accessor, all_bindings_accessor, true);

                // simple set
              } else view_model[key] = item;
          });
        }

        return view_model;
      };

      // in recursive calls, we are already protected from propagating dependencies to the template
      return nested ? doInject(data) : kb.ignore(function () {
        return doInject(data);
      });
    }

    // Searches the DOM from root or document for elements with the `'kb-inject'` attribute and create/customizes ViewModels for the DOM tree when encountered.
    // Also, used with the data-bind `'inject'` custom binding.
    // @param [DOM element] root the root DOM element to start searching for `'kb-inject'` attributes.
    // @return [Array] array of Objects with the DOM elements and ViewModels that were bound in the form `{el: DOM element, view_model: ViewModel}`.

  }, {
    key: 'injectViewModels',
    value: function injectViewModels() {
      var rootEl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : root.document;

      // find all of the app elements
      var results = [];
      var findElements = function findElements(el) {
        if (!el.__kb_injected) {
          // already injected -> skip, but still process children in case they were added afterwards
          var attr = _.find(el.attributes || [], function (x) {
            return x.name === 'kb-inject';
          });
          if (attr) {
            el.__kb_injected = true; // mark injected
            results.push({ el: el, view_model: {}, binding: attr.value });
          }
        }
        _.each(el.childNodes, function (child) {
          return findElements(child);
        });
      };
      findElements(rootEl);

      // bind the view models
      _.each(results, function (app) {
        var options = {};
        var afterBinding = null;
        var beforeBinding = null;

        // evaluate the app data
        var expression = app.binding;
        if (expression) {
          !~expression.search(/[:]/) || (expression = '{' + expression + '}'); // wrap if is an object
          var data = new Function('', 'return ( ' + expression + ' )')() || {};
          if (data.options) {
            options = data.options;delete data.options;
          }
          app.view_model = kb.Inject.inject(data, app.view_model, app.el, null, null, true);
          afterBinding = app.view_model.afterBinding || options.afterBinding;
          beforeBinding = app.view_model.beforeBinding || options.beforeBinding;
        }

        // auto-bind
        if (beforeBinding) {
          beforeBinding.call(app.view_model, app.view_model, app.el, options);
        }
        kb.applyBindings(app.view_model, app.el, options);
        if (afterBinding) {
          afterBinding.call(app.view_model, app.view_model, app.el, options);
        }
      });
      return results;
    }
  }]);

  return Inject;
}();

// auto-inject recursively
var _ko_applyBindings = ko.applyBindings;
ko.applyBindings = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var el = args[1];
  var results = kb.RECUSIVE_AUTO_INJECT ? kb.injectViewModels(el) : [];
  return results.length ? results : _ko_applyBindings.call.apply(_ko_applyBindings, [this].concat(args));
};

// ############################
// Aliases
// ############################
kb.injectViewModels = kb.Inject.injectViewModels;

// ############################
// Auto Inject results
// ############################
if (root && typeof root.document !== 'undefined') {
  // use simple ready check
  var onReady = function onReady() {
    if (root.document.readyState !== 'complete') {
      setTimeout(onReady, 0); // keep waiting for the document to load
      return;
    }
    kb.injectViewModels(); // the document is loaded
  };
  onReady();
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var ko = kb.ko;

// Allow for dependent release until is resolved https://github.com/knockout/knockout/issues/1464

if (ko.subscribable && ko.subscribable.fn && ko.subscribable.fn.extend) {
  var _extend = ko.subscribable.fn.extend;
  ko.subscribable.fn.extend = function () {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var target = _extend.call(this, args);

    // release the extended observable
    if (target !== this && kb.isReleaseable(this)) {
      var _dispose = target.dispose;
      target.dispose = function () {
        if (_dispose != null) _dispose.apply(target, args);
        return kb.release(_this);
      };
    }

    return target;
  };
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var TypedValue = __webpack_require__(2);
var kb = __webpack_require__(0);

var _ = kb._,
    ko = kb.ko;


var KEYS_PUBLISH = ['value', 'valueType', 'destroy'];
var KEYS_INFO = ['args', 'read', 'write'];

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
kb.Observable = function () {

  // Used to create a new kb.Observable.
  //
  // @param [Model] model the model to observe (can be null)
  // @param [String|Array|Object] options the create options. String is a single attribute name, Array is an array of attribute names.
  // @option options [String] key the name of the attribute.
  // @option options [Function] read a function used to provide transform the attribute value before passing it to the caller. Signature: read()
  // @option options [Function] write a function used to provide transform the value before passing it to the model set function. Signature: write(value)
  // @option options [Array] args arguments to pass to the read and write functions (they can be ko.observables). Can be useful for passing arguments to a locale manager.
  // @option options [Constructor] localizer a concrete kb.LocalizedObservable constructor for localization.
  // @option options [Data|ko.observable] default the default value. Can be a value, string or ko.observable.
  // @option options [String] path the path to the value (used to create related observables from the factory).
  // @option options [kb.Store] store a store used to cache and share view models.
  // @option options [kb.Factory] factory a factory used to create view models.
  // @option options [Object] options a set of options merge into these options. Useful for extending options when deriving classes rather than merging them by hand.
  // @return [ko.observable] the constructor does not return 'this' but a ko.observable
  // @note the constructor does not return 'this' but a ko.observable
  function Observable(model, key_or_info, options, _vm) {
    var _this = this;

    _classCallCheck(this, Observable);

    if (_vm == null) {
      _vm = {};
    }this._vm = _vm;return kb.ignore(function () {
      key_or_info || kb._throwMissing(_this, 'key_or_info');
      _this.key = key_or_info.key || key_or_info;
      _.map(KEYS_INFO, function (key) {
        if (key_or_info[key]) {
          _this[key] = key_or_info[key];
        }
      });

      var create_options = kb.utils.collapseOptions(options);
      var event_watcher = create_options.event_watcher;

      delete create_options.event_watcher;

      // set up basics
      _this._value = new TypedValue(create_options);
      _this._model = ko.observable();
      var observable = kb.utils.wrappedObservable(_this, ko.computed({
        read: function read() {
          var m = _this._model();
          var args = [_this.key].concat(_this.args || []);
          _.each(args, function (arg) {
            return ko.utils.unwrapObservable(arg);
          });

          var ew = kb.utils.wrappedEventWatcher(_this);
          !ew || ew.emitter(m || null);

          if (_this.read) {
            _this.update(_this.read.apply(_this._vm, args));
          } else if (!_.isUndefined(m)) {
            kb.ignore(function () {
              return _this.update(kb.getValue(m, kb.peek(_this.key), _this.args));
            });
          }
          return _this._value.value();
        },

        write: function write(new_value) {
          return kb.ignore(function () {
            var unwrapped_new_value = kb.utils.unwrapModels(new_value); // unwrap for set (knockout may pass view models which are required for the observable but not the model)
            var m = kb.peek(_this._model);
            if (_this.write) {
              _this.write.call(_this._vm, unwrapped_new_value);
              new_value = kb.getValue(m, kb.peek(_this.key), _this.args);
            } else if (m) {
              kb.setValue(m, kb.peek(_this.key), unwrapped_new_value);
            }
            return _this.update(new_value);
          });
        },

        owner: _this._vm
      }));

      observable.__kb_is_o = true; // mark as a kb.Observable
      create_options.store = kb.utils.wrappedStore(observable, create_options.store);
      create_options.path = kb.utils.pathJoin(create_options.path, _this.key);
      if (create_options.factories && (typeof create_options.factories === 'function' || create_options.factories.create)) {
        create_options.factory = kb.utils.wrappedFactory(observable, new kb.Factory(create_options.factory));
        create_options.factory.addPathMapping(create_options.path, create_options.factories);
      } else create_options.factory = kb.Factory.useOptionsOrCreate(create_options, observable, create_options.path);
      delete create_options.factories;

      // publish public interface on the observable and return instead of this
      kb.publishMethods(observable, _this, KEYS_PUBLISH);

      // use external model observable or create
      _this.model = ko.computed({
        read: function read() {
          return ko.utils.unwrapObservable(_this._model);
        },
        write: function write(new_model) {
          return kb.ignore(function () {
            if (_this.__kb_released || kb.peek(_this._model) === new_model) return undefined; // destroyed or no change

            // update references
            var new_value = kb.getValue(new_model, kb.peek(_this.key), _this.args);
            _this._model(new_model);
            if (!new_model) {
              return _this.update(null);
            } else if (!_.isUndefined(new_value)) {
              return _this.update(new_value);
            }
            return undefined;
          });
        }
      });
      observable.model = _this.model;

      kb.EventWatcher.useOptionsOrCreate({ event_watcher: event_watcher }, model || null, _this, {
        emitter: _this.model,
        update: function update() {
          return kb.ignore(function () {
            return _this.update();
          });
        },
        key: _this.key,
        path: create_options.path
      });
      _this._value.rawValue() || _this._value.update(); // wasn't loaded so create

      // wrap ourselves with a localizer
      if (kb.LocalizedObservable && key_or_info.localizer) observable = new key_or_info.localizer(observable);

      // wrap ourselves with a default value
      if (kb.DefaultObservable && Object.prototype.hasOwnProperty.call(key_or_info, 'default')) observable = kb.defaultObservable(observable, key_or_info.default);

      return observable;
    });
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(Observable, [{
    key: 'destroy',
    value: function destroy() {
      var observable = kb.utils.wrappedObservable(this);
      this.__kb_released = true;
      this._value.destroy();this._value = null;
      this.model.dispose();this.model = null;observable.model = null;
      return kb.utils.wrappedDestroy(this);
    }

    // @return [kb.CollectionObservable|kb.ViewModel|ko.observable] exposes the raw value inside the kb.observable. For example, if your attribute is a Collection, it will hold a CollectionObservable.

  }, {
    key: 'value',
    value: function value() {
      return this._value.rawValue();
    }

    // @return [kb.TYPE_UNKNOWN|kb.TYPE_SIMPLE|kb.TYPE_ARRAY|kb.TYPE_MODEL|kb.TYPE_COLLECTION] provides the type of the wrapped value.

  }, {
    key: 'valueType',
    value: function valueType() {
      return this._value.valueType(kb.peek(this._model), kb.peek(this.key));
    }

    // ###################################################
    // Internal
    // ###################################################
    // @nodoc

  }, {
    key: 'update',
    value: function update(new_value) {
      if (this.__kb_released) return undefined; // destroyed, nothing to do
      if (!arguments.length) new_value = kb.getValue(kb.peek(this._model), kb.peek(this.key));
      return this._value.update(new_value);
    }
  }]);

  return Observable;
}();

kb.observable = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(kb.Observable, [null].concat(args)))();
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._;

// kb.Statistics is an optional components that is useful for measuring your application's performance.
// You can record all of the Backbone.Events that have triggered ko.observable subscription updates and the memory footprint (instance count-only) of your ViewModels and collection observables.
//
// kb.Statistics is not included in `knockback.js` nor `knockback-core.js` so you need to manually include it from the `lib` directory.
//

var Statistics = function () {
  function Statistics() {
    _classCallCheck(this, Statistics);

    this.model_events_tracker = [];
    this.registered_tracker = {};
  }

  // Clear the tracked model events (but keep the registered objects intact)


  _createClass(Statistics, [{
    key: 'clear',
    value: function clear() {
      this.model_events_tracker = [];
    }

    // ##############################
    // Registered Events
    // ##############################

    // Register a model event

  }, {
    key: 'addModelEvent',
    value: function addModelEvent(event) {
      this.model_events_tracker.push(event);
    }

    // A debug helper to summarize the registered events in human-readable form

  }, {
    key: 'modelEventsStatsString',
    value: function modelEventsStatsString() {
      var stats_string = '';
      stats_string += 'Total Count: ' + this.model_events_tracker.length;
      var event_groups = _.groupBy(this.model_events_tracker, function (test) {
        return 'event name: \'' + test.name + '\', attribute name: \'' + test.key + '\'';
      });
      _.each(event_groups, function (value, key) {
        stats_string += '\n ' + key + ', count: ' + value.length;
      });
      return stats_string;
    }

    // ##############################
    // Registered Observables and View Models
    // ##############################

    // Register an object by key

  }, {
    key: 'register',
    value: function register(key, obj) {
      this.registeredTracker(key).push(obj);
    }

    // Unregister an object by key

  }, {
    key: 'unregister',
    value: function unregister(key, obj) {
      var type_tracker = this.registeredTracker(key);
      var index = _.indexOf(type_tracker, obj);
      if (!~index) {
        if (typeof console !== 'undefined') console.log('kb.Statistics: failed to unregister type: ' + key);
        return undefined;
      }
      return type_tracker.splice(index, 1);
    }

    // @return [Integer] the number of registered objects by type

  }, {
    key: 'registeredCount',
    value: function registeredCount(type) {
      if (type) return this.registeredTracker(type).length;

      var count = 0;
      _.each(this.registered_tracker[type], function (type_tracker) {
        count += type_tracker.length;
      });
      return count;
    }

    // A debug helper to summarize the current registered objects by key
    //
    // @param [String] success_message a message to return if there are no registered objects
    // @return [String] a human readable string summarizing the currently registered objects or success_message

  }, {
    key: 'registeredStatsString',
    value: function registeredStatsString(success_message) {
      var stats_string = '';
      var written = false;
      _.each(this.registered_tracker, function (type_tracker, type) {
        if (!type_tracker.length) return;
        if (written) {
          stats_string += '\n ';
        }
        stats_string += (type || 'No Name') + ': ' + type_tracker.length;
        written = true;
      });
      return stats_string || success_message;
    }

    // @nodoc

  }, {
    key: 'registeredTracker',
    value: function registeredTracker(key) {
      if (Object.prototype.hasOwnProperty.call(this.registered_tracker, key)) {
        return this.registered_tracker[key];
      }
      var type_tracker = [];this.registered_tracker[key] = type_tracker;
      return type_tracker;
    }
  }], [{
    key: 'eventsStats',
    value: function eventsStats(obj, key) {
      var stats = { count: 0 };
      var events = obj._events || obj._callbacks || {};
      var keys = key ? [key] : _.keys(events);

      _.each(keys, function (key_) {
        var node = events[key_];
        if (node) {
          if (_.isArray(node)) {
            stats[key_] = _.compact(node).length;
          } else {
            var _node = node,
                tail = _node.tail;

            stats[key_] = 0;
            node = node.next;
            while (node !== tail) {
              stats[key_]++;
              node = node.next;
            }
          }
          stats.count += stats[key_];
        }
      });
      return stats;
    }
  }]);

  return Statistics;
}();

kb.Statistics = Statistics;
module.exports = Statistics;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._,
    ko = kb.ko;

// Used to share and manage the persistence of ViewModels and observables. ks.Store can be used to break relationship cycles between models,
// to reduce memory usage, and to share view models between kb.CollectionObservables (for example, when using Knockout.js selectedOptions).
//
// @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
//   var co = kb.collectionObservable(new Backbone.Collection());
//   var co_selected_options = kb.collectionObservable(new Backbone.Collection(), {
//     store: kb.utils.wrappedStore(co)
//   });

var Store = function () {
  _createClass(Store, null, [{
    key: 'initClass',
    value: function initClass() {
      // @nodoc
      Store.instances = [];
    }

    // Used to either register yourself with the existing store or to create a new store.
    //
    // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
    // @param [Instance] obj the instance that will own or register with the store
    // @param [ko.observable] observable the observable that will own the store
    // @example
    //   kb.Store.useOptionsOrCreate(model, this, options);

  }, {
    key: 'useOptionsOrCreate',
    value: function useOptionsOrCreate(options, obj, observable) {
      if (!options.store) {
        kb.utils.wrappedStoreIsOwned(observable, true);
      }
      var store = kb.utils.wrappedStore(observable, options.store || new kb.Store());
      store.retain(observable, obj, options.creator);
      return store;
    }

    // Used to create a new kb.Store.

  }]);

  function Store() {
    _classCallCheck(this, Store);

    this.observable_records = {};
    this.replaced_observables = [];
    kb.Store.instances.push(this);
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(Store, [{
    key: 'destroy',
    value: function destroy() {
      this.__kb_released = true;
      this.clear();
      var index = _.indexOf(kb.Store.instances, this);
      if (~index) kb.Store.instances.splice(index, 1);
    }

    // Manually clear the store

  }, {
    key: 'clear',
    value: function clear() {
      var _this = this;

      var observable_records = this.observable_records;
      this.observable_records = {};
      _.each(observable_records, function (records) {
        _.each(records, function (observable) {
          return _this.release(observable, true);
        });
      });

      var replaced_observables = this.replaced_observables;
      this.replaced_observables = [];
      _.each(replaced_observables, function (observable) {
        if (!observable.__kb_released) _this.release(observable, true);
      });
    }

    // Manually compact the store by searching for released view models

  }, {
    key: 'compact',
    value: function compact() {
      _.each(this.observable_records, function (records) {
        _.each(records, function (observable, cid) {
          if (observable.__kb_released) delete records[cid];
        });
      });
    }

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

  }, {
    key: 'retain',
    value: function retain(observable, obj, creator) {
      if (!this._canRegister(observable)) return undefined;
      if (!creator) {
        creator = observable.constructor;
      } // default is to use the constructor

      var current_observable = this.find(obj, creator);
      if (current_observable) {
        if (current_observable === observable) {
          // already in this store
          this._getOrCreateStoreReferences(observable).ref_count++;
          return observable;
        }
        this._retire(current_observable);
      }

      this._add(observable, obj, creator);
      this._getOrCreateStoreReferences(observable).ref_count++;
      return observable;
    }

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

  }, {
    key: 'retainOrCreate',
    value: function retainOrCreate(obj, options, deep_retain) {
      var _this2 = this;

      var creator = this._creator(obj, options);
      if (!creator) return kb.utils.createFromDefaultCreator(obj, options);
      if (creator.models_only) return obj;

      var observable = this.find(obj, creator);
      if (observable) {
        return deep_retain && kb.settings.deep_retain ? this.retain(observable, obj, creator) : observable;
      }
      if (!_.isFunction(creator.create || creator)) throw new Error('Invalid factory for "' + options.path + '"');

      observable = kb.ignore(function () {
        options = _.defaults({ store: _this2, creator: creator }, options); // set our own creator so we can register ourselves above
        observable = creator.create ? creator.create(obj, options) : new creator(obj, options);
        return observable || ko.observable(null);
      }); // default to null

      this.retain(observable, obj, creator);
      return observable;
    }

    // @nodoc

  }, {
    key: 'reuse',
    value: function reuse(observable, obj) {
      var current_obj = kb.utils.wrappedObject(observable);
      if (current_obj === obj) return;
      if (!this._canRegister(observable)) throw new Error('Cannot reuse a simple observable');
      if (this._refCount(observable) !== 1) throw new Error('Trying to change a shared view model. Ref count: ' + this._refCount(observable));

      var creator = kb.utils.wrappedCreator(observable) || observable.constructor; // default is to use the constructor
      var current_observable = void 0;
      if (!_.isUndefined(current_obj)) current_observable = this.find(current_obj, creator);
      this.retain(observable, obj, creator);
      if (current_observable) this.release(current_observable);
    }

    // Release a reference to a a ViewModel in this store.

  }, {
    key: 'release',
    value: function release(observable, force) {
      if (!this._canRegister(observable)) return kb.release(observable); // just release

      // maybe be externally added
      var store_references = this._storeReferences(observable);
      if (store_references) {
        if (!force && --store_references.ref_count > 0) return undefined; // do not release yet
        this._clearStoreReferences(observable);
      }

      this._remove(observable);
      if (observable.__kb_released) return undefined;
      if (force || this._refCount(observable) <= 1) return kb.release(observable); // allow for a single initial reference in another store
      return undefined;
    }

    // @nodoc

  }, {
    key: 'find',
    value: function find(obj, creator) {
      var records = this.observable_records[this._creatorId(creator)];
      if (!records) return null;

      var observable = records[this._cid(obj)];
      if (observable && observable.__kb_released) {
        delete records[this._cid(obj)];
        return null;
      }
      return observable;
    }

    // @nodoc

  }, {
    key: '_refCount',
    value: function _refCount(observable) {
      if (observable.__kb_released) {
        typeof console === 'undefined' || console.log('Observable already released');
        return 0;
      }
      var stores_references = kb.utils.get(observable, 'stores_references');
      if (!stores_references) return 1;
      return _.reduce(stores_references, function (memo, store_references) {
        return memo + store_references.ref_count;
      }, 0);
    }

    // @nodoc

  }, {
    key: '_canRegister',
    value: function _canRegister(observable) {
      return observable && !ko.isObservable(observable) && !observable.__kb_is_co;
    } // only register view models not basic ko.observables nor kb.CollectionObservables

    // @nodoc

  }, {
    key: '_cid',
    value: function _cid(obj) {
      if (!obj) return 'null';
      if (!obj.cid) obj.cid = _.uniqueId('c');
      return obj.cid;
    }

    // @nodoc

  }, {
    key: '_creatorId',
    value: function _creatorId(creator) {
      var create = creator.create || creator;
      if (!create.__kb_cids) {
        create.__kb_cids = [];
      }
      for (var i = 0, l = create.__kb_cids.length; i < l; i++) {
        var _item = create.__kb_cids[i];
        if (_item.create === create) return _item.cid;
      }
      var item = { create: create, cid: _.uniqueId('kb') };
      create.__kb_cids.push(item);
      return item.cid;
    }

    // @nodoc

  }, {
    key: '_storeReferences',
    value: function _storeReferences(observable) {
      var _this3 = this;

      var stores_references = kb.utils.get(observable, 'stores_references');
      if (!stores_references) return undefined;

      return _.find(stores_references, function (ref) {
        return ref.store === _this3;
      });
    }

    // @nodoc

  }, {
    key: '_getOrCreateStoreReferences',
    value: function _getOrCreateStoreReferences(observable) {
      var _this4 = this;

      var stores_references = kb.utils.orSet(observable, 'stores_references', []);

      var ref = _.find(stores_references, function (x) {
        return x.store === _this4;
      });
      if (!ref) stores_references.push(ref = { store: this, ref_count: 0, release: function release() {
          return _this4.release(observable);
        } });
      return ref;
    }

    // @nodoc

  }, {
    key: '_clearStoreReferences',
    value: function _clearStoreReferences(observable) {
      var stores_references = kb.utils.orSet(observable, 'stores_references', []);
      if (!stores_references) return;

      for (var i = 0, l = observable.__kb.stores_references.length; i < l; i++) {
        var ref = observable.__kb.stores_references[i];
        if (ref.store === this) {
          observable.__kb.stores_references.splice(i, 1);
          break;
        }
      }
    }

    // @nodoc

  }, {
    key: '_retire',
    value: function _retire(observable) {
      this._clearStoreReferences(observable);this.replaced_observables.push(observable);return this._remove(observable);
    }

    // @nodoc

  }, {
    key: '_add',
    value: function _add(observable, obj, creator) {
      if (!creator) creator = observable.constructor; // default is to use the constructor
      kb.utils.wrappedObject(observable, obj);kb.utils.wrappedCreator(observable, creator);

      var name = this._creatorId(creator);
      if (!this.observable_records[name]) this.observable_records[name] = {};
      this.observable_records[name][this._cid(obj)] = observable;
      return observable;
    }

    // @nodoc

  }, {
    key: '_remove',
    value: function _remove(observable) {
      var creator = kb.utils.wrappedCreator(observable) || observable.constructor; // default is to use the constructor
      var obj = kb.utils.wrappedObject(observable);
      var current_observable = this.find(obj, creator);

      // already released
      if (current_observable && current_observable === observable) {
        delete this.observable_records[this._creatorId(creator)][this._cid(obj)]; // not already replaced
      }
      kb.utils.wrappedObject(observable, null);
      return kb.utils.wrappedCreator(observable, null);
    }

    // @nodoc

  }, {
    key: '_creator',
    value: function _creator(obj, options) {
      if (options.creator) return options.creator;
      var creator = kb.utils.inferCreator(obj, options.factory, options.path);
      if (creator) return creator;
      if (kb.isModel(obj)) return kb.ViewModel;
      return undefined;
    }
  }]);

  return Store;
}();

Store.initClass();
kb.Store = Store;
module.exports = Store;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._,
    ko = kb.ko;

// ###################################################
// Public API
// ###################################################

// Library of general-purpose utilities

var utils = function () {
  function utils() {
    _classCallCheck(this, utils);
  }

  _createClass(utils, null, [{
    key: 'initClass',
    value: function initClass() {
      // Clean up function that releases all of the wrapped values on an owner.
      this.wrappedDestroy = __webpack_require__(22);

      // Helper to merge options including ViewmModel options like `keys` and `factories`
      //
      // @param [Object] obj the object to test
      //
      // @example
      //   kb.utils.collapseOptions(options);
      this.collapseOptions = __webpack_require__(20);

      // used for attribute setting to ensure all model attributes have their underlying models
      this.unwrapModels = __webpack_require__(21);
    }

    // @nodoc

  }, {
    key: 'get',
    value: function get(obj, key, default_value) {
      if (!obj.__kb) return default_value;
      return !Object.prototype.hasOwnProperty.call(obj.__kb, key) ? default_value : obj.__kb[key];
    }

    // @nodoc

  }, {
    key: 'set',
    value: function set(obj, key, value) {
      if (!obj.__kb) obj.__kb = {};
      obj.__kb[key] = value;
      return value;
    }

    // @nodoc

  }, {
    key: 'orSet',
    value: function orSet(obj, key, value) {
      if (!obj.__kb) obj.__kb = {};
      if (!Object.prototype.hasOwnProperty.call(obj.__kb, key)) obj.__kb[key] = value;
      return obj.__kb[key];
    }

    // @nodoc

  }, {
    key: 'has',
    value: function has(obj, key) {
      return obj.__kb && Object.prototype.hasOwnProperty.call(obj.__kb, key);
    }

    // Dual-purpose getter/setter for retrieving and storing the observable on an instance that returns a ko.observable instead of 'this'. Relevant for:
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

  }, {
    key: 'wrappedObservable',
    value: function wrappedObservable(obj, value) {
      if (arguments.length === 1) {
        return kb.utils.get(obj, 'observable');
      }return kb.utils.set(obj, 'observable', value);
    }

    // Dual-purpose getter/setter for retrieving and storing the Model or Collection on an owner.
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

  }, {
    key: 'wrappedObject',
    value: function wrappedObject(obj, value) {
      if (arguments.length === 1) {
        return kb.utils.get(obj, 'object');
      }return kb.utils.set(obj, 'object', value);
    }

    // @nodoc

  }, {
    key: 'wrappedCreator',
    value: function wrappedCreator(obj, value) {
      if (arguments.length === 1) {
        return kb.utils.get(obj, 'creator');
      }return kb.utils.set(obj, 'creator', value);
    }

    // Dual-purpose getter/setter for retrieving and storing the Model on a ViewModel.
    // @note this is almost the same as {kb.utils.wrappedObject} except that if the Model doesn't exist, it returns the ViewModel itself (which is useful behavior
    // for sorting because it you can iterate over a kb.CollectionObservable's ko.ObservableArray whether it holds ViewModels or Models with the models_only option).
    //
    // @overload wrappedModel(view_model)
    //   Gets the model from a ViewModel
    //   @param [Object|kb.ViewModel] view_model the owning ViewModel for the Model.
    //   @return [Model|ViewModel] the Model or ViewModel itself if there is no Model
    // @overload wrappedModel(view_model, model)
    //   Sets the observable on an object
    //   @param [Object|kb.ViewModel] view_model the owning ViewModel for the Model.
    //   @param [Model] model the Model

  }, {
    key: 'wrappedModel',
    value: function wrappedModel(obj, value) {
      if (arguments.length !== 1) return kb.utils.set(obj, 'object', value);
      value = kb.utils.get(obj, 'object');
      return _.isUndefined(value) ? obj : value;
    }

    // Dual-purpose getter/setter for retrieving and storing a kb.Store on an owner.
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

  }, {
    key: 'wrappedStore',
    value: function wrappedStore(obj, value) {
      if (arguments.length === 1) {
        return kb.utils.get(obj, 'store');
      }return kb.utils.set(obj, 'store', value);
    }

    // @private

  }, {
    key: 'wrappedStoreIsOwned',
    value: function wrappedStoreIsOwned(obj, value) {
      if (arguments.length === 1) {
        return kb.utils.get(obj, 'store_is_owned');
      }return kb.utils.set(obj, 'store_is_owned', value);
    }

    // Dual-purpose getter/setter for retrieving and storing a kb.Factory on an owner.
    //
    // @overload wrappedFactory(obj)
    //   Gets the factory from an object
    //   @param [Any] obj the owner
    //   @return [kb.Factory] the factory
    // @overload wrappedFactory(obj, factory)
    //   Sets the factory on an object
    //   @param [Any] obj the owner
    //   @param [kb.Factory] factory the factory

  }, {
    key: 'wrappedFactory',
    value: function wrappedFactory(obj, value) {
      if (arguments.length === 1) {
        return kb.utils.get(obj, 'factory');
      }return kb.utils.set(obj, 'factory', value);
    }

    // Dual-purpose getter/setter for retrieving and storing a kb.EventWatcher on an owner.
    //
    // @overload wrappedEventWatcher(obj)
    //   Gets the event_watcher from an object
    //   @param [Any] obj the owner
    //   @return [kb.EventWatcher] the event_watcher
    // @overload wrappedEventWatcher(obj, event_watcher)
    //   Sets the event_watcher on an object
    //   @param [Any] obj the owner
    //   @param [kb.EventWatcher] event_watcher the event_watcher

  }, {
    key: 'wrappedEventWatcher',
    value: function wrappedEventWatcher(obj, value) {
      if (arguments.length === 1) {
        return kb.utils.get(obj, 'event_watcher');
      }return kb.utils.set(obj, 'event_watcher', value);
    }

    // @private

  }, {
    key: 'wrappedEventWatcherIsOwned',
    value: function wrappedEventWatcherIsOwned(obj, value) {
      if (arguments.length === 1) {
        return kb.utils.get(obj, 'event_watcher_is_owned');
      }return kb.utils.set(obj, 'event_watcher_is_owned', value);
    }

    // Retrieves the value stored in a ko.observable.
    //
    // @see kb.Observable valueType
    //
    // @example
    //   var view_model = kb.viewModel(new Model({simple_attr: null, model_attr: null}), {factories: {model_attr: kb.ViewModel});
    //   kb.utils.valueType(view_model.simple_attr); // kb.TYPE_SIMPLE
    //   kb.utils.valueType(view_model.model_attr);  // kb.TYPE_MODEL

  }, {
    key: 'valueType',
    value: function valueType(observable) {
      if (!observable) {
        return kb.TYPE_UNKNOWN;
      }
      if (observable.__kb_is_o) {
        return observable.valueType();
      }
      if (observable.__kb_is_co || observable instanceof kb.Collection) {
        return kb.TYPE_COLLECTION;
      }
      if (observable instanceof kb.ViewModel || observable instanceof kb.Model) {
        return kb.TYPE_MODEL;
      }
      if (_.isArray(observable)) {
        return kb.TYPE_ARRAY;
      }
      return kb.TYPE_SIMPLE;
    }

    // Helper to join a dot-deliminated path.
    //
    // @param [String] path1 start path.
    // @param [String] path2 append path.
    // @return [String] combined dot-delimited path.
    //
    // @example
    //   kb.utils.pathJoin('models', 'name'); // 'models.name'

  }, {
    key: 'pathJoin',
    value: function pathJoin(path1, path2) {
      return (path1 ? path1[path1.length - 1] !== '.' ? path1 + '.' : path1 : '') + path2;
    }

    // Helper to join a dot-deliminated path with the path on options and returns a new options object with the result.
    //
    // @param [Object] options with path property for the start path
    // @param [String] path append path.
    // @return [Object] new options with combined dot-delimited path `{path: combined_path}`.
    //
    // @example
    //   this.friends = kb.collectionObservable(model.get('friends'), kb.utils.optionsPathJoin(options, 'friends'));

  }, {
    key: 'optionsPathJoin',
    value: function optionsPathJoin(options, path) {
      return _.defaults({ path: this.pathJoin(options.path, path) }, options);
    }

    // Helper to find the creator constructor or function from a factory or ORM solution

  }, {
    key: 'inferCreator',
    value: function inferCreator(value, factory, path) {
      var creator = factory ? factory.creatorForPath(value, path) : null;
      if (creator) {
        return creator;
      }

      // try fallbacks
      if (!value) return null;
      if (value instanceof kb.Model) {
        return kb.ViewModel;
      }
      if (value instanceof kb.Collection) {
        return kb.CollectionObservable;
      }
      return null;
    }

    // Creates an observable based on a value's type.

  }, {
    key: 'createFromDefaultCreator',
    value: function createFromDefaultCreator(obj, options) {
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

    // @nodoc

  }, {
    key: 'resolveModel',
    value: function resolveModel(model) {
      if (model && kb.Backbone && kb.Backbone.ModelRef && model instanceof kb.Backbone.ModelRef) {
        return model.model();
      }return model;
    }
  }]);

  return utils;
}();

utils.initClass();
kb.utils = utils;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._,
    ko = kb.ko;

// @nodoc

var assignViewModelKey = function assignViewModelKey(vm, key) {
  var vm_key = vm.__kb.internals && ~_.indexOf(vm.__kb.internals, key) ? '_' + key : key;
  if (Object.prototype.hasOwnProperty.call(vm.__kb.view_model, vm_key)) return undefined; // already exists, skip
  vm.__kb.view_model[vm_key] = null;
  return vm_key;
};

// @nodoc
var createObservable = function createObservable(vm, model, key, create_options) {
  if (vm.__kb.excludes && ~_.indexOf(vm.__kb.excludes, key)) return undefined;
  if (vm.__kb.statics && ~_.indexOf(vm.__kb.statics, key)) return undefined;
  var vm_key = assignViewModelKey(vm, key);
  if (!vm_key) return undefined;
  var observable = kb.observable(model, key, create_options, vm);vm.__kb.view_model[vm_key] = observable;vm[vm_key] = observable;
  return observable;
};

// @nodoc
var createStaticObservables = function createStaticObservables(vm, model) {
  _.each(vm.__kb.statics, function (key) {
    var vm_key = assignViewModelKey(vm, key);
    if (!vm_key) return;

    if (model.has(vm_key)) {
      vm.__kb.view_model[vm_key] = model.get(vm_key);
      vm[vm_key] = vm.__kb.view_model[vm_key];
    } else if (vm.__kb.static_defaults && Object.prototype.hasOwnProperty.call(vm.__kb.static_defaults, vm_key)) {
      vm.__kb.view_model[vm_key] = vm.__kb.static_defaults[vm_key];
      vm[vm_key] = vm.__kb.view_model[vm_key];
    } else delete vm.__kb.view_model[vm_key];
  });
};

var KEYS_OPTIONS = ['keys', 'internals', 'excludes', 'statics', 'static_defaults'];

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

var ViewModel = function () {
  _createClass(ViewModel, null, [{
    key: 'initClass',
    value: function initClass() {
      // @nodoc
      ViewModel.extend = kb.Parse ? kb.Parse._extend : kb.Model.extend;
      // for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")
    }

    // Used to create a new kb.ViewModel.
    //
    // @param [Model|ModelRef] model the model to observe (can be null)
    // @param [Object] options the create options
    // @option options [Array|String] internals an array of atttributes that should be scoped with an underscore, eg. name -> _name
    // @option options [Array|String] requires an array of atttributes that will have kb.Observables created even if they do not exist on the Model.
    // Useful for binding Views that require specific observables to exist
    // @option options [Array|String] keys restricts the keys used on a model. Useful for reducing the number of kb.Observables created from a limited set of Model attributes
    // @option options [Object|Array|String] excludes if an array is supplied, excludes keys to exclude on the view model;
    // for example, if you want to provide a custom implementation. If an Object, it provides options to the kb.Observable constructor.
    // @option options [Array] statics creates non-observable properties on your view model for Model attributes that do not need to be observed for changes.
    // @option options [Object] static_defaults provides default values for statics.
    // @option options [String] path the path to the value (used to create related observables from the factory).
    // @option options [kb.Store] store a store used to cache and share view models.
    // @option options [Object] factories a map of dot-deliminated paths; for example `{'models.name': kb.ViewModel}` to either constructors or create functions.
    // Signature: `{'some.path': function(object, options)}`
    // @option options [kb.Factory] factory a factory used to create view models.
    // @option options [Object] options a set of options merge into these options. Useful for extending options when deriving classes rather than merging them by hand.
    // @return [ko.observable] the constructor returns 'this'
    // @param [Object] view_model a view model to also set the kb.Observables on. Useful when batch creating observable on an owning view model.

  }]);

  function ViewModel() {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _classCallCheck(this, ViewModel);

    return kb.ignore(function () {
      var model = args.shift();
      !model || kb.isModel(model) || kb._throwUnexpected(_this, 'not a model');

      if (_.isArray(args[0])) args[0] = { keys: args[0] };
      if (!_this.__kb) {
        _this.__kb = {};
      }_this.__kb.view_model = args.length > 1 ? args.pop() : _this;

      var options = {};
      _.each(args, function (arg) {
        kb.assign(options, arg);options = kb.utils.collapseOptions(options);
      });
      _.each(KEYS_OPTIONS, function (key) {
        if (Object.prototype.hasOwnProperty.call(options, key)) _this.__kb[key] = options[key];
      });

      // always use a store to ensure recursive view models are handled correctly
      kb.Store.useOptionsOrCreate(options, model, _this);

      // view model factory
      _this.__kb.path = options.path;
      kb.Factory.useOptionsOrCreate(options, _this, options.path);

      var _model = kb.utils.set(_this, '_model', ko.observable());
      _this.model = ko.computed({
        read: function read() {
          return ko.utils.unwrapObservable(_model);
        },
        write: function write(new_model) {
          return kb.ignore(function () {
            if (kb.utils.wrappedObject(_this) === new_model || kb.wasReleased(_this) || !event_watcher) return undefined;

            _this.__kb.store.reuse(_this, kb.utils.resolveModel(new_model));
            event_watcher.emitter(new_model);_model(event_watcher.ee);
            return !event_watcher.ee || _this.createObservables(event_watcher.ee);
          });
        }
      });

      var event_watcher = kb.utils.wrappedEventWatcher(_this, new kb.EventWatcher(model, _this, {
        emitter: _this._model,
        update: function update() {
          return kb.ignore(function () {
            return !(event_watcher && event_watcher.ee) || _this.createObservables(event_watcher.ee);
          });
        }
      }));

      model = event_watcher.ee;
      kb.utils.wrappedObject(_this, model);_model(event_watcher.ee);

      // update the observables
      _this.__kb.create_options = { store: kb.utils.wrappedStore(_this), factory: kb.utils.wrappedFactory(_this), path: _this.__kb.path, event_watcher: kb.utils.wrappedEventWatcher(_this) };
      !options.requires || _this.createObservables(model, options.requires);
      !_this.__kb.internals || _this.createObservables(model, _this.__kb.internals);
      !options.mappings || _this.createObservables(model, options.mappings);
      !_this.__kb.statics || createStaticObservables(_this, model);
      _this.createObservables(model, _this.__kb.keys);

      if (kb.statistics) kb.statistics.register('ViewModel', _this); // collect memory management statistics
      return _this;
    });
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(ViewModel, [{
    key: 'destroy',
    value: function destroy() {
      var _this2 = this;

      this.__kb_released = true;
      if (this.__kb.view_model !== this) {
        _.each(this.__kb.vm_keys, function (key) {
          _this2.__kb.view_model[key] = null;
        });
      }

      // clear the external references
      this.__kb.view_model = null;this.__kb.create_options = null;
      kb.releaseKeys(this);
      kb.utils.wrappedDestroy(this);

      if (kb.statistics) kb.statistics.unregister('ViewModel', this); // collect memory management statistics
    }

    // Get the options for a new view model that can be used for sharing view models.

  }, {
    key: 'shareOptions',
    value: function shareOptions() {
      return { store: kb.utils.wrappedStore(this), factory: kb.utils.wrappedFactory(this) };
    }

    // create observables manually

  }, {
    key: 'createObservables',
    value: function createObservables(model, keys) {
      var _this3 = this;

      if (!keys) {
        if (this.__kb.keys || !model) return; // only use the keys provided
        for (var key in model.attributes) {
          if (Object.prototype.hasOwnProperty.call(model.attributes, key)) {
            createObservable(this, model, key, this.__kb.create_options);
          }
        }

        if (kb.settings.orm && kb.settings.orm.keys) {
          _.each(kb.settings.orm.keys, function (key) {
            return createObservable(_this3, model, key, _this3.__kb.create_options);
          });
        }
      } else if (_.isArray(keys)) {
        _.map(keys, function (key) {
          return createObservable(_this3, model, key, _this3.__kb.create_options);
        });
      } else {
        _.each(keys, function (mapping_info, key) {
          var vm_key = assignViewModelKey(_this3, key);
          if (vm_key) {
            if (!_.isString(mapping_info) && !mapping_info.key) mapping_info.key = vm_key;
            _this3[vm_key] = kb.observable(model, mapping_info, _this3.__kb.create_options, _this3);
            _this3.__kb.view_model[vm_key] = _this3[vm_key];
          }
        });
      }
    }
  }]);

  return ViewModel;
}();

ViewModel.initClass();
kb.ViewModel = ViewModel;
module.exports = ViewModel;

// Factory function to create a kb.ViewModel.
kb.viewModel = function () {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return new (Function.prototype.bind.apply(kb.ViewModel, [null].concat(args)))();
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._,
    ko = kb.ko;

__webpack_require__(25);

var KEYS_PUBLISH = ['destroy', 'setToDefault'];

// Used to provide a default value when an observable is null, undefined, or the empty string.
//
// @example Provide a observable with observable and/or non observable default argument in the form of:
//   var wrapped_name = kb.defaultObservable(kb.observable(model, 'name'), '(no name)');

var DefaultObservable = function () {
  // Used to create a new kb.DefaultObservable.
  //
  // @param [ko.observable] target_observable the observable to check for null, undefined, or the empty string
  // @param [Any] default_value the default value. Can be a value, string or ko.observable
  // @return [ko.observable] the constructor does not return 'this' but a ko.observable
  // @note the constructor does not return 'this' but a ko.observable
  function DefaultObservable(target_observable, dv) {
    var _this = this;

    _classCallCheck(this, DefaultObservable);

    // @dv is default value
    this.dv = dv;
    var observable = kb.utils.wrappedObservable(this, ko.computed({
      read: function read() {
        var current_target = ko.utils.unwrapObservable(target_observable());
        return _.isNull(current_target) || _.isUndefined(current_target) ? ko.utils.unwrapObservable(_this.dv) : current_target;
      },
      write: function write(value) {
        return target_observable(value);
      }
    }));

    // publish public interface on the observable and return instead of this
    kb.publishMethods(observable, this, KEYS_PUBLISH);

    return observable;
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(DefaultObservable, [{
    key: 'destroy',
    value: function destroy() {
      return kb.utils.wrappedDestroy(this);
    }

    // Forces the observable to take the default value.
    // @note Can be used with kb.utils.setToDefault, kb.Observable.setToDefault, kb.ViewModel.setToDefault

  }, {
    key: 'setToDefault',
    value: function setToDefault() {
      return kb.utils.wrappedObservable(this)(this.dv);
    }
  }]);

  return DefaultObservable;
}();

kb.DefaultObservable = DefaultObservable;
module.exports = DefaultObservable;

kb.defaultObservable = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(kb.DefaultObservable, [null].concat(args)))();
};
kb.observableDefault = kb.defaultObservable;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._,
    ko = kb.ko;


kb.toFormattedString = function (format) {
  var result = format.slice();

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  _.each(args, function (arg, index) {
    var value = ko.utils.unwrapObservable(arg);
    if (_.isUndefined(value) || _.isNull(value)) value = '';

    var parameter_index = format.indexOf('{' + index + '}');
    while (~parameter_index) {
      result = result.replace('{' + index + '}', value);
      parameter_index = format.indexOf('{' + index + '}', parameter_index + 1);
    }
  });
  return result;
};

kb.parseFormattedString = function (string, format) {
  var regex_string = format.slice();var index = 0;var parameter_count = 0;var positions = {};
  while (regex_string.search('\\{' + index + '\\}') >= 0) {
    // store the positions of the replacements
    var parameter_index = format.indexOf('{' + index + '}');
    while (~parameter_index) {
      regex_string = regex_string.replace('{' + index + '}', '(.*)');
      positions[parameter_index] = index;parameter_count++;
      parameter_index = format.indexOf('{' + index + '}', parameter_index + 1);
    }
    index++;
  }
  var count = index;

  var regex = new RegExp(regex_string);
  var matches = regex.exec(string);
  if (matches) {
    matches.shift();
  }
  // return fake empty data
  if (!matches || matches.length !== parameter_count) {
    var result = [];
    while (count-- > 0) {
      result.push('');
    }
    return result;
  }

  // sort the matches since the parameters could be requested unordered
  var sorted_positions = _.sortBy(_.keys(positions), function (parameter_index) {
    return +parameter_index;
  });
  var format_indices_to_matched_indices = {};
  _.each(sorted_positions, function (parameter_index, match_index) {
    parameter_index = sorted_positions[match_index];
    index = positions[parameter_index];
    if (!(index in format_indices_to_matched_indices)) {
      format_indices_to_matched_indices[index] = match_index;
    }
  });

  var results = [];index = 0;
  while (index < count) {
    results.push(matches[format_indices_to_matched_indices[index]]);
    index++;
  }
  return results;
};

// Handles two-way formatted string convertions and will reformat a string when any argument changes. The format string can also be an observable.
//
// @example change the formatted name whenever a model's name attribute changes
//   var observable = kb.formattedObservable("{0} and {1}", arg1, arg2);

var FormattedObservable = function () {
  // Used to create a new kb.FormattedObservable.
  //
  // @param [String|ko.observable] format the format string.
  // Format: `"{0} and {1}"` where `{0}` and `{1}` would be synchronized with the arguments (eg. "Bob and Carol" where `{0}` is Bob and `{1}` is Carol)
  // @param [Array] args arguments to be passed to the kb.LocaleManager's get() method
  // @return [ko.observable] the constructor does not return 'this' but a ko.observable
  // @note the constructor does not return 'this' but a ko.observable
  function FormattedObservable(format) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    _classCallCheck(this, FormattedObservable);

    // being called by the factory function
    var observable_args = _.isArray(args[0]) ? args[0] : args;
    var observable = kb.utils.wrappedObservable(this, ko.computed({
      read: function read() {
        args = [ko.utils.unwrapObservable(format)];
        _.each(observable_args, function (arg) {
          return args.push(ko.utils.unwrapObservable(arg));
        });
        return kb.toFormattedString.apply(null, args);
      },
      write: function write(value) {
        var matches = kb.parseFormattedString(value, ko.utils.unwrapObservable(format));
        var max_count = Math.min(observable_args.length, matches.length);var index = 0;
        while (index < max_count) {
          observable_args[index](matches[index]);
          index++;
        }
      }
    }));

    return observable;
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(FormattedObservable, [{
    key: 'destroy',
    value: function destroy() {
      return kb.utils.wrappedDestroy(this);
    }
  }]);

  return FormattedObservable;
}();

kb.FormattedObservable = FormattedObservable;
module.exports = FormattedObservable;

kb.formattedObservable = function () {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return new (Function.prototype.bind.apply(kb.FormattedObservable, [null].concat(args)))();
};
kb.observableFormatted = kb.formattedObservable;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._,
    ko = kb.ko;


var KEYS_PUBLISH = ['destroy', 'observedValue', 'resetToCurrent'];

// Locale Manager - if you are using localization, set this property.
// It must have Backbone.Events mixed in and implement a get method like Backbone.Model, eg. get: (attribute_name) -> return somthing
if (!kb.locale_manager) {
  kb.locale_manager = undefined;
}

// @abstract You must provide the following two methods:
//   * read: function(value, observable) called to get the value and each time the locale changes
//   * write: function(localized_string, value, observable) called to set the value (optional)
//
// Base class for observing localized data that changes when the locale changes.
//
// @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
//   kb.ShortDateLocalizer = kb.LocalizedObservable.extend({
//     constructor: function(value, options, view_model) {
//       kb.LocalizedObservable.prototype.constructor.apply(this, arguments);
//       return kb.utils.wrappedObservable(this);
//     },
//     read: function(value) {
//       return Globalize.format(value, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale());
//     },
//     write: function(localized_string, value) {
//       var new_value;
//       new_value = Globalize.parseDate(localized_string, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale());
//       if (!(new_value && _.isDate(new_value))) {
//         return kb.utils.wrappedObservable(this).resetToCurrent();
//       }
//       return value.setTime(new_value.valueOf());
//     }
//   });
//   var ViewModel = function(model) {
//     this.localized_date = kb.observable(model, {
//       key: 'date',
//       'default': this.loading_message,
//       localizer: ShortDateLocalizer
//     }, this);
//   };
//   var view_model = new ViewModel(new Backbone.Model({date: new Date()}));
//
// @method .extend(prototype_properties, class_properties)
//   Class method for JavaScript inheritance.
//   @param [Object] prototype_properties the properties to add to the prototype
//   @param [Object] class_properties the properties to add to the class
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
//   @example
//     var MyLocalizedObservable = kb.LocalizedObservable.extend({
//        constructor: function(value, options, view_model) {
//          // the constructor does not return 'this' but a ko.observable
//          return kb.LocalizedObservable.prototype.constructor.apply(this, arguments);
//        }
//     });

var LocalizedObservable = function () {
  _createClass(LocalizedObservable, null, [{
    key: 'initClass',
    value: function initClass() {
      LocalizedObservable.extend = kb.Parse ? kb.Parse._extend : kb.Model.extend;
      // for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")
    }

    // Used to create a new kb.LocalizedObservable. This an abstract class.
    //
    // @param [Data|ko.observable] value the value to localize
    // @param [Object] options the create options
    // @option options [Data|ko.observable] default a default value to present when the value is null, an empty string, etc.
    // @option options [Function] onChange a notification that gets called when the locale changes. Signature: function(localized_string, value, observable)
    // @return [ko.observable] the constructor does not return 'this' but a ko.observable
    // @note the constructor does not return 'this' but a ko.observable

  }]);

  function LocalizedObservable(value, options, vm) {
    var _this = this;

    _classCallCheck(this, LocalizedObservable);

    // @vm is view_model
    this.value = value;
    this.vm = vm;
    if (!options) {
      options = {};
    }if (!this.vm) {
      this.vm = {};
    }
    this.read || kb._throwMissing(this, 'read');
    kb.locale_manager || kb._throwMissing(this, 'kb.locale_manager');

    // bind callbacks
    if (!this.__kb) {
      this.__kb = {};
    }
    this.__kb._onLocaleChange = _.bind(this._onLocaleChange, this);
    this.__kb._onChange = options.onChange;

    // internal state
    var currentValue = this.value ? ko.utils.unwrapObservable(this.value) : null;
    this.vo = ko.observable(!currentValue ? null : this.read(currentValue, null));

    var observable = kb.utils.wrappedObservable(this, ko.computed({
      read: function read() {
        if (_this.value) ko.utils.unwrapObservable(_this.value);
        _this.vo(); // create a depdenency
        return _this.read(ko.utils.unwrapObservable(_this.value));
      },

      write: function write(x) {
        _this.write || kb._throwUnexpected(_this, 'writing to read-only');
        _this.write(x, ko.utils.unwrapObservable(_this.value));
        _this.vo(x);
        return _this.__kb._onChange ? _this.__kb._onChange(x) : undefined;
      },

      owner: this.vm
    }));

    // publish public interface on the observable and return instead of this
    kb.publishMethods(observable, this, KEYS_PUBLISH);

    // start
    kb.locale_manager.bind('change', this.__kb._onLocaleChange);

    // wrap ourselves with a default value
    if (Object.prototype.hasOwnProperty.call(options, 'default')) {
      observable = kb.DefaultObservable && ko.defaultObservable(observable, options.default);
    }

    return observable;
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(LocalizedObservable, [{
    key: 'destroy',
    value: function destroy() {
      kb.locale_manager.unbind('change', this.__kb._onLocaleChange);
      this.vm = null;
      return kb.utils.wrappedDestroy(this);
    }

    // Used to reset the value if localization is not possible.

  }, {
    key: 'resetToCurrent',
    value: function resetToCurrent() {
      var observable = kb.utils.wrappedObservable(this);
      var current_value = this.value ? this.read(ko.utils.unwrapObservable(this.value)) : null;
      if (observable() === current_value) return undefined;
      return observable(current_value);
    }

    // Dual purpose set/get

  }, {
    key: 'observedValue',
    value: function observedValue(value) {
      if (arguments.length === 0) return this.value;
      this.value = value;this._onLocaleChange();
      return undefined;
    }

    // ###################################################
    // Internal
    // ###################################################

    // @nodoc

  }, {
    key: '_onLocaleChange',
    value: function _onLocaleChange() {
      var value = this.read(ko.utils.unwrapObservable(this.value));
      this.vo(value);
      if (this.__kb._onChange) return this.__kb._onChange(value);
      return undefined;
    }
  }]);

  return LocalizedObservable;
}();

LocalizedObservable.initClass();
kb.LocalizedObservable = LocalizedObservable;
module.exports = LocalizedObservable;

// factory function
kb.localizedObservable = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(kb.LocalizedObservable, [null].concat(args)))();
};
kb.observableLocalized = kb.localizedObservable;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._,
    ko = kb.ko;


var KEYS_PUBLISH = ['destroy'];

// Class for observing emitter events.
//
// @example create an observable whose subscriptions are notified with the change event is triggered.
//   var triggered_observable = kb.triggeredObservable(name, 'change');
//
// @example How to watch a emitter for events.
//   var trigger_count = 0;
//   var emitter = new Backbone.Model();
//   var view_emitter = {
//     triggered_observable: kb.triggeredObservable(emitter, 'change')
//   };
//   view_emitter.counter = ko.computed(function() {
//     view_emitter.triggered_observable() // add a dependency
//     return trigger_count++
//   });
//   emitter.set(name: 'bob');       # trigger_count: 1
//   emitter.set(name: 'george');    # trigger_count: 2
//   emitter.set(last: 'smith');     # trigger_count: 3

var TriggeredObservable = function () {

  // Used to create a new kb.Observable.
  //
  // @param [Model] emitter the emitter to observe (can be null)
  // @param [String] event_selector the event name to trigger Knockout subscriptions on.
  // @return [ko.observable] the constructor does not return 'this' but a ko.observable
  // @note the constructor does not return 'this' but a ko.observable
  function TriggeredObservable(emitter, event_selector) {
    var _this = this;

    _classCallCheck(this, TriggeredObservable);

    this.event_selector = event_selector;
    emitter || kb._throwMissing(this, 'emitter');
    this.event_selector || kb._throwMissing(this, 'event_selector');

    // internal state
    this.vo = ko.observable();
    var observable = kb.utils.wrappedObservable(this, ko.computed(function () {
      return _this.vo();
    }));

    // publish public interface on the observable and return instead of this
    kb.publishMethods(observable, this, KEYS_PUBLISH);

    // create emitter observable
    kb.utils.wrappedEventWatcher(this, new kb.EventWatcher(emitter, this, { emitter: _.bind(this.emitter, this), update: _.bind(this.update, this), event_selector: this.event_selector }));

    return observable;
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(TriggeredObservable, [{
    key: 'destroy',
    value: function destroy() {
      return kb.utils.wrappedDestroy(this);
    }

    // Dual-purpose getter/setter for the observed emitter.
    //
    // @overload emitter()
    //   Gets the emitter or emitter reference
    //   @return [Model|ModelRef|Collection] the emitter whose events are being bound (can be null)
    // @overload emitter(new_emitter)
    //   Sets the emitter or emitter reference
    //   @param [Model|ModelRef|Collection] new_emitter the emitter whose events will be bound (can be null)

  }, {
    key: 'emitter',
    value: function emitter(new_emitter) {
      // get or no change
      if (arguments.length === 0 || this.ee === new_emitter) return this.ee;
      this.ee = new_emitter;
      if (this.ee) return this.update();
      return undefined;
    }

    // ###################################################
    // Internal
    // ###################################################
    // @nodoc

  }, {
    key: 'update',
    value: function update() {
      if (!this.ee) return undefined; // do not trigger if there is no emitter
      if (this.vo() !== this.ee) return this.vo(this.ee);
      return this.vo.valueHasMutated(); // manually trigger the dependable
    }
  }]);

  return TriggeredObservable;
}();

kb.TriggeredObservable = TriggeredObservable;
module.exports = TriggeredObservable;

// factory function
kb.triggeredObservable = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(kb.TriggeredObservable, [null].concat(args)))();
};
kb.observableTriggered = kb.triggeredObservable;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._,
    ko = kb.ko;


__webpack_require__(26);

// internal helper
var callOrGet = function callOrGet(value) {
  value = ko.utils.unwrapObservable(value);

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return typeof value === 'function' ? value.apply(undefined, args) : value;
};

// Helpers for validating forms, inputs, and values.
// @example A Named Form
//   <form name="myForm">
//      <input name="input1", data-bind="value: input1" required>
//      <input type="url" name="input2", data-bind="value: input2">
//    </form>
//   Because there is a form name, it will add the following property to your ViewModel (wrapped in an observable):
//    $myForm: {
//      input1: {required: boolean, valid: boolean, invalid: boolean},
//      input2: {url: boolean, valid: boolean, invalid: boolean},
//      valid: boolean,
//      invalid: boolean
//    }
// @example A Unnamed Form
//   <form>
//     <input name="input1", data-bind="value: input1" required>
//     <input type="url" name="input2", data-bind="value: input2">
//   </form>
//   Because there is not a form name, it will extend the following on your ViewModel (each wrapped separately in an observable):
//   {
//     $input1: {required: boolean, valid: boolean, invalid: boolean},
//     $input2: {url: boolean, valid: boolean, invalid: boolean}
//   }
//
// @method .valueValidator(value, bindings, validation_options={})
//   Used to create an observable that wraps all of the validators for a value and also generates helpers for $valid, $error_count, $enabled, $disabled, and $active_error.
//   @note Called using `kb.valueValidator` (not  kb.Validation.valueValidator)
//   @param [Observable] value the value to validate
//   @param [Object] bindings the named validators to use to validate the value
//   @param [Object] validation_options the validation options
//   @option validation_options [Boolean|Function] disable the test for disabling validations
//   @option validation_options [Boolean|Function] enable the test for enabling validations
//   @option validation_options [String|Array] priorities the priority order of the validators (used to set $active_error in the case of multiple being active simulateously)
//   @return [ko.computed] a single observable storing an Object with all of the validators and generated helpers
//
// @method .inputValidator(view_model, el, validation_options={})
//   Used to create an observable that wraps all of the validators for an HTML input element using `kb.valueValidator`. See kb.valueValidator for shared options.
//   In addition, you can add custom bindings by including a `validations` Object in your data-bind statement where each property has a function(value) that returns true if there are errors.
//   It will automatically generate validators from the input for the following attributes:
//   * type: for url, email, and number
//   * required: must have a length or a value
//   @note Called using `kb.inputValidator` (not  kb.Validation.inputValidator)
//   @return [ko.computed] a single observable storing an Object with all of the validators and generated helpers
//   @example Binding an input using Knockback inject.
//     <input type="url" name="name" data-bind="value: name, inject: kb.inputValidator" required>
//     Adds the following to your ViewModel:
//       $name: kb.observable({required: Boolean, url: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})
//   @example Binding an input with custom validations using Knockback inject.
//     <input type="url" name="name" data-bind="value: name, inject: kb.inputValidator, validations: {unique: nameTaken}" required>
//     Adds the following to your ViewModel:
//       $name: kb.observable({required: Boolean, url: Boolean, unique: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})
//   @example Binding an input with validation options using Knockback inject.
//     <input type="url" name="name" data-bind="value: name, inject: kb.inputValidator, validation_options: {disable: disable, priorities: 'url'}" required>
//     Adds the following to your ViewModel:
//       $name: kb.observable({required: Boolean, url: Boolean, unique: Boolean, $valid: Boolean, $error_count: Number, $enabled: Boolean, $disabled: Boolean, $active_error: String})
//
// @method .formValidator(view_model, el)
//   Used to create an observable that wraps all of the validators for all the inputs on an HTML form element using `kb.inputValidator`. See kb.inputValidator for per input options.
//   In addition, the formValidator aggregates the following helpers for its inputs: $valid, $error_count, $enabled, and $disabled.
//    Also, if you provide a name attribute for the form, it will attach all of the inputs to a $name property on your view model.
//   @note Called using `kb.formValidator` (not  kb.Validation.formValidator)
//   @return [Object] an Object with all of the validators and generated helpers
//   @example Binding a form by name using Knockback inject.
//     <form name='my_form' data-bind="inject: kb.formValidator, validation_options: {priorities: ['required', 'url']}">
//       <input type="text" name="name" data-bind="value: name" required>
//       <input type="url" name="site" data-bind="value: site" required>
//     </form>
//     Adds the following to your ViewModel:
//     $my_form: {
//       name: kb.observable({required: Boolean, $valid: Boolean, $error_count: Number, $active_error: String}),
//       site: kb.observable({required: Boolean, url: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})
//     }
//   @example Binding a form without a name using Knockback inject.
//     <form data-bind="inject: kb.formValidator, validation_options: {priorities: ['required', 'url']}">
//       <input type="text" name="name" data-bind="value: name" required>
//       <input type="url" name="site" data-bind="value: site" required>
//     </form>
//     Extends your ViewModel with the following Object:
//     {
//       $name: kb.observable({required: Boolean, $valid: Boolean, $error_count: Number, $active_error: String}),
//       $site: kb.observable({required: Boolean, url: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})
//     }
// @method .hasChangedFn(model)
//   A validation helper that can be used to wait for a change before enabling validations.
//   @note Called using `kb.hasChangedFn` (not  kb.Validation.hasChangedFn)
//   @return [Function] Validator function bound with model
//   @example Enabling validations after a change has been made to a model.
//     <form class="form-horizontal" data-bind="inject: kb.formValidator, validation_options: {enable: kb.hasChangedFn(model)}">
// @method .minLengthFn(length)
//   A validator that will be invalid until the length of the value is below a minimum value.
//   @note Called using `kb.minLengthFn` (not  kb.Validation.minLengthFn)
//   @return [Function] Validator function bound with min length
//   @example Validations will be invalid until the name is at least 4 characters long.
//     <input type="text" name="name" data-bind="value: name, validations: {length: kb.minLengthFn(4)}">
// @method .uniqueValueFn(model, key, collection)
//   Checks for a unique attribute value by key in a collection
//   @note Called using `kb.uniqueValueFn` (not  kb.Validation.uniqueValueFn)
//   @return [Function] Validator function bound with model, attribute key, and collection
//   @example Validations will be invalid until the name attribute is unique in the collection.
//     <input type="text" name="name" data-bind="value: name, validations: {unique: kb.uniqueValueFn(model, 'name', some_collection)}">
// @method .untilTrueFn(stand_in, fn, model)
//   Used to combine conditions.
//   @note Called using `kb.untilTrueFn` (not  kb.Validation.untilTrueFn)
//   @return [Function] Validator function bound with stand_in value before condition is met, validator function, and optionally model (will reset if the model changes).
//   @example Filter the minimum length test of name until it has be valid (that way, won't report invalid while typing in a new input).
//     <input type="text" name="name" data-bind="value: name, validations: {length_filtered: kb.untilFalseFn(false, kb.minLengthFn(4), model)}">
// @method .untilFalseFn(stand_in, fn, model)
//   Used to combine conditions.
//   @note Called using `kb.untilFalseFn` (not  kb.Validation.untilFalseFn)
//   @return [Function] Validator function bound with stand_in value before condition is met, validator function, and optionally model (will reset if the model changes).

var Validation = function Validation() {
  _classCallCheck(this, Validation);
};

kb.Validation = Validation;
module.exports = Validation;

// ############################
// Aliases
// ############################
kb.valueValidator = function (value, bindings) {
  var validation_options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return ko.computed(function () {
    var results = { $error_count: 0 };
    var current_value = ko.utils.unwrapObservable(value);

    var disabled = void 0;
    if ('disable' in validation_options) disabled = callOrGet(validation_options.disable);
    if ('enable' in validation_options) disabled = !callOrGet(validation_options.enable);

    var priorities = validation_options.priorities || [];
    if (!_.isArray(priorities)) priorities = [priorities]; // ensure priorities is an array

    // then add the rest
    var active_index = priorities.length + 1;
    _.each(bindings, function (validator, identifier) {
      results[identifier] = !disabled && callOrGet(validator, current_value); // update validity
      if (results[identifier]) {
        results.$error_count++;

        // check priorities
        var identifier_index = void 0;
        (identifier_index = _.indexOf(priorities, identifier) >= 0) || (identifier_index = priorities.length);

        if (results.$active_error && identifier_index < active_index) {
          results.$active_error = identifier;active_index = identifier_index;
        } else {
          results.$active_error || (results.$active_error = identifier, active_index = identifier_index);
        }
      }
    });

    // add the inverse and ensure a boolean
    results.$enabled = !disabled;
    results.$disable = !!disabled;
    results.$valid = results.$error_count === 0;
    return results;
  });
};

kb.inputValidator = function (view_model, el) {
  var validation_options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var validators = kb.valid;
  var input_name = el.getAttribute('name');
  if (input_name && !_.isString(input_name)) {
    input_name = null;
  }

  // only set up form elements with a value bindings
  var bindings = el.getAttribute('data-bind');
  if (!bindings) return null;
  var options = new Function('sc', 'with(sc[0]) { return { ' + bindings + ' } }')([view_model]);
  if (!(options && options.value)) return null;
  if (options.validation_options) {
    _.defaults(options.validation_options, validation_options);
    validation_options = options.validation_options;
  }

  // collect the types to identifier
  var type = el.getAttribute('type');
  bindings = {};
  !validators[type] || (bindings[type] = validators[type]);
  !el.hasAttribute('required') || (bindings.required = validators.required);
  if (options.validations) {
    _.each(options.validations, function (validator, identifier) {
      bindings[identifier] = validator;
    });
  }
  var result = kb.valueValidator(options.value, bindings, validation_options);

  // if there is a name, add to the view_model with $scoping
  !input_name && !validation_options.no_attach || (view_model['$' + input_name] = result);
  return result;
};

kb.formValidator = function (view_model, el) {
  var results = {};
  var validators = [];
  var form_name = el.getAttribute('name');
  if (form_name && !_.isString(form_name)) form_name = null;

  var bindings = el.getAttribute('data-bind');
  var validation_options = void 0;
  if (bindings) {
    var options = new Function('sc', 'with(sc[0]) { return { ' + bindings + ' } }')([view_model]);
    validation_options = options.validation_options;
  }
  if (!validation_options) validation_options = {};
  validation_options.no_attach = !!form_name;

  // build up the results
  _.each(el.getElementsByTagName('input'), function (input_el) {
    var name = input_el.getAttribute('name');
    if (!name) return; // need named inputs to set up an object
    var validator = kb.inputValidator(view_model, input_el, validation_options);
    !validator || validators.push(results[name] = validator);
  });

  // collect stats, error count and valid
  results.$error_count = ko.computed(function () {
    var error_count = 0;
    _.each(validators, function (validator) {
      error_count += validator().$error_count;
    });
    return error_count;
  });
  results.$valid = ko.computed(function () {
    return results.$error_count() === 0;
  });

  // enabled and disabled
  results.$enabled = ko.computed(function () {
    var enabled = true;
    _.each(validators, function (validator) {
      enabled &= validator().$enabled;
    });
    return enabled;
  });
  results.$disabled = ko.computed(function () {
    return !results.$enabled();
  });

  // if there is a name, add to the view_model with $scoping
  if (form_name) view_model['$' + form_name] = results;
  return results;
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._;

// @nodoc

var _mergeArray = function _mergeArray(result, key, value) {
  if (!result[key]) result[key] = [];
  if (!_.isArray(value)) value = [value];
  result[key] = result[key].length ? _.union(result[key], value) : value;
  return result;
};

// @nodoc
var _mergeObject = function _mergeObject(result, key, value) {
  if (!result[key]) result[key] = {};
  return kb.assign(result[key], value);
};

// @nodoc
var _keyArrayToObject = function _keyArrayToObject(value) {
  var result = {};
  _.each(value, function (item) {
    result[item] = { key: item };
  });
  return result;
};

var _mergeOptions = function _mergeOptions(result, options) {
  if (!options) return result;

  _.each(options, function (value, key) {
    switch (key) {
      case 'internals':case 'requires':case 'excludes':case 'statics':
        _mergeArray(result, key, value);break;
      case 'keys':
        // an object
        if (_.isObject(value) && !_.isArray(value) || _.isObject(result[key]) && !_.isArray(result[key])) {
          if (!_.isObject(value)) {
            value = [value];
          }
          if (_.isArray(value)) {
            value = _keyArrayToObject(value);
          }
          if (_.isArray(result[key])) {
            result[key] = _keyArrayToObject(result[key]);
          }
          _mergeObject(result, key, value);

          // an array
        } else {
          _mergeArray(result, key, value);
        }
        break;

      case 'factories':
        if (_.isFunction(value)) {
          result[key] = value;
        } else {
          _mergeObject(result, key, value);
        }
        break;
      case 'static_defaults':
        _mergeObject(result, key, value);break;
      case 'options':
        break;
      default:
        result[key] = value;break;
    }
  });

  return _mergeOptions(result, options.options);
};

// @nodoc
module.exports = function (options) {
  return _mergeOptions({}, options);
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._;

// @nodoc

var unwrapModels = function unwrapModels(obj) {
  if (!obj) return obj;
  if (obj.__kb) return Object.prototype.hasOwnProperty.call(obj.__kb, 'object') ? obj.__kb.object : obj;
  if (_.isArray(obj)) return _.map(obj, function (test) {
    return unwrapModels(test);
  });
  if (_.isObject(obj) && obj.constructor === {}.constructor) {
    // a simple object
    var result = {};
    _.each(obj, function (value, key) {
      result[key] = unwrapModels(value);
    });
    return result;
  }

  return obj;
};
module.exports = unwrapModels;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

// @nodoc
var wrappedDestroy = function wrappedDestroy(obj) {
  if (!obj.__kb) return;
  if (obj.__kb.event_watcher) obj.__kb.event_watcher.releaseCallbacks(obj);

  var __kb = obj.__kb;

  obj.__kb = null; // clear now to break cycles

  if (__kb.observable) {
    __kb.observable.destroy = null;__kb.observable.release = null;
    wrappedDestroy(__kb.observable);
    __kb.observable = null;
  }

  __kb.factory = null;

  if (__kb.event_watcher_is_owned) __kb.event_watcher.destroy(); // release the event_watcher
  __kb.event_watcher = null;

  if (__kb.store_is_owned) __kb.store.destroy(); // release the store
  __kb.store = null;

  if (__kb.stores_references) {
    var store_references = __kb.stores_references.pop();
    while (store_references) {
      if (!store_references.store.__kb_released) store_references.store.release(obj);
      store_references = __kb.stores_references.pop();
    }
  }
};
module.exports = wrappedDestroy;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._,
    Backbone = kb.Backbone;


var AssociatedModel = null; // lazy bind so this file can be loaded before relational library

// @nodoc
module.exports = function () {
  function BackboneAssociations() {
    _classCallCheck(this, BackboneAssociations);
  }

  _createClass(BackboneAssociations, null, [{
    key: 'isAvailable',
    value: function isAvailable() {
      return !!(AssociatedModel = Backbone ? Backbone.AssociatedModel : null);
    }
  }, {
    key: 'keys',
    value: function keys(model) {
      if (!(model instanceof AssociatedModel)) return null;
      return _.map(model.relations, function (test) {
        return test.key;
      });
    }
  }, {
    key: 'relationType',
    value: function relationType(model, key) {
      if (!(model instanceof AssociatedModel)) return null;
      var relation = _.find(model.relations, function (test) {
        return test.key === key;
      });
      if (!relation) return null;
      return relation.type === 'Many' ? kb.TYPE_COLLECTION : kb.TYPE_MODEL;
    }
  }, {
    key: 'useFunction',
    value: function useFunction() {
      return false;
    }
  }]);

  return BackboneAssociations;
}();

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._,
    Backbone = kb.Backbone;


var RelationalModel = null; // lazy bind so this file can be loaded before relational library

// @nodoc
module.exports = function () {
  function BackboneRelational() {
    _classCallCheck(this, BackboneRelational);
  }

  _createClass(BackboneRelational, null, [{
    key: 'isAvailable',
    value: function isAvailable() {
      return !!(RelationalModel = Backbone ? Backbone.RelationalModel : null);
    }
  }, {
    key: 'relationType',
    value: function relationType(model, key) {
      if (!(model instanceof RelationalModel)) return null;
      var relation = _.find(model.getRelations(), function (test) {
        return test.key === key;
      });
      if (!relation) return null;
      return relation.collectionType || _.isArray(relation.keyContents) ? kb.TYPE_COLLECTION : kb.TYPE_MODEL;
    }
  }, {
    key: 'bind',
    value: function bind(model, key, update, path) {
      var type = this.relationType(model, key);
      if (!type) return null;

      var relFn = function relFn(m) {
        if (kb.statistics) kb.statistics.addModelEvent({ name: 'update (relational)', model: m, key: key, path: path });
        return update();
      };

      // VERSIONING: pre Backbone-Relational 0.8.0
      var events = kb.Backbone.Relation.prototype.sanitizeOptions ? ['update', 'add', 'remove'] : ['change', 'add', 'remove'];
      if (type === kb.TYPE_COLLECTION) _.each(events, function (event) {
        return model.bind(event + ':' + key, relFn);
      });else model.bind(events[0] + ':' + key, relFn);

      return function () {
        if (type === kb.TYPE_COLLECTION) _.each(events, function (event) {
          return model.unbind(event + ':' + key, relFn);
        });else model.unbind(events[0] + ':' + key, relFn);
      };
    }
  }, {
    key: 'useFunction',
    value: function useFunction() {
      return false;
    }
  }]);

  return BackboneRelational;
}();

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._,
    ko = kb.ko;


kb.Observable.prototype.setToDefault = function () {
  if (this.__kb_value && this.__kb_value.setToDefault) this.__kb_value.setToDefault();
};

kb.ViewModel.prototype.setToDefault = function () {
  _.each(this.__kb.vm_keys, function (value) {
    if (value.__kb_value && value.__kb_value.setToDefault) value.__kb_value.setToDefault();
  });
};

// @example
//   var model = new Backbone.Model({name: 'Bob'});
//   var view_model = {
//     wrapped_name: kb.defaultWrapper(kb.observable(model, 'name'), '(no name)')
//   }; // view_model.wrapped name: Bob
//   kb.utils.setToDefault(view_model); // view_model.wrapped name: (no name)
kb.utils.setToDefault = function (obj) {
  var _this = this;

  if (!obj) return undefined;

  // observable
  if (ko.isObservable(obj)) {
    if (typeof obj.setToDefault === 'function') obj.setToDefault();

    // view model
  } else if (_.isObject(obj)) {
    _.each(obj, function (value, key) {
      if (value && (ko.isObservable(value) || typeof value !== 'function') && (key[0] !== '_' || key.search('__kb'))) _this.setToDefault(value);
    });
  }

  return obj;
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var kb = __webpack_require__(0);

var _ = kb._,
    ko = kb.ko;

// Regular expressions from Angular.js: https://github.com/angular/angular.js

var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/;
var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
var NUMBER_REGEXP = /^\s*(-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

// A validator should return true if there are errors (similar to the binding check in HTML, eg. $name().required).
kb.valid = {
  required: function required(value) {
    return !value;
  },
  url: function url(value) {
    return !URL_REGEXP.test(value);
  },
  email: function email(value) {
    return !EMAIL_REGEXP.test(value);
  },
  number: function number(value) {
    return !NUMBER_REGEXP.test(value);
  }
};

// Convention is that if they end in Fn then returns a function pointer based on parameters passed.
kb.hasChangedFn = function (model) {
  var m = null;var attributes = null;
  return function () {
    var current_model = ko.utils.unwrapObservable(model);
    if (m !== current_model) {
      // change in model
      m = current_model;
      attributes = m ? m.toJSON() : null;
      return false;
    }
    if (!(m && attributes)) return false;
    return !_.isEqual(m.toJSON(), attributes);
  };
};

kb.minLengthFn = function (length) {
  return function (value) {
    return !value || value.length < length;
  };
};

kb.uniqueValueFn = function (model, key, collection) {
  return function (value) {
    var m = ko.utils.unwrapObservable(model);var k = ko.utils.unwrapObservable(key);var c = ko.utils.unwrapObservable(collection);
    if (!(m && k && c)) return false;
    return !!_.find(c.models, function (test) {
      return test !== m && test.get(k) === value;
    });
  };
};

kb.untilTrueFn = function (stand_in, fn, model) {
  var was_true = false;
  if (model && ko.isObservable(model)) model.subscribe(function () {
    was_true = false;
  }); // reset if the model changes
  return function (value) {
    var f = ko.utils.unwrapObservable(fn);
    if (!f) return ko.utils.unwrapObservable(stand_in);
    var result = f(ko.utils.unwrapObservable(value));
    was_true |= !!result;
    return was_true ? result : ko.utils.unwrapObservable(stand_in);
  };
};

kb.untilFalseFn = function (stand_in, fn, model) {
  var was_false = false;
  if (model && ko.isObservable(model)) model.subscribe(function () {
    was_false = false;
  }); // reset if the model changes
  return function (value) {
    var f = ko.utils.unwrapObservable(fn);
    if (!f) return ko.utils.unwrapObservable(stand_in);
    var result = f(ko.utils.unwrapObservable(value));
    was_false |= !result;
    return was_false ? result : ko.utils.unwrapObservable(stand_in);
  };
};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_27__;

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_28__;

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_29__;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
__webpack_require__(1);
__webpack_require__(5);
__webpack_require__(6);
__webpack_require__(8);
__webpack_require__(0);
__webpack_require__(9);
__webpack_require__(10);
__webpack_require__(11);
__webpack_require__(12);
__webpack_require__(2);
__webpack_require__(13);
__webpack_require__(14);
__webpack_require__(15);
__webpack_require__(16);
__webpack_require__(17);
__webpack_require__(18);
__webpack_require__(19);
module.exports = __webpack_require__(7);


/***/ })
/******/ ]);
});