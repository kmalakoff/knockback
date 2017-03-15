/*
  knockback-core.js 1.2.2
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
})(this, function(__WEBPACK_EXTERNAL_MODULE_21__, __WEBPACK_EXTERNAL_MODULE_22__, __WEBPACK_EXTERNAL_MODULE_23__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 24);
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

var _ = void 0,
    Backbone = void 0;
var window = window != null ? window : global;
var ko = __webpack_require__(23);

var LIFECYCLE_METHODS = ['release', 'destroy', 'dispose'];

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
      this.ignore = (ko.dependencyDetection != null ? ko.dependencyDetection.ignore : undefined) || function (callback, callbackTarget, callbackArgs) {
        var value = null;ko.computed(function () {
          return value = callback.apply(callbackTarget, callbackArgs || []);
        }).dispose();return value;
      };
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
        var value = obj[key];if (key !== '__kb' && kb.isReleaseable(value, depth + 1)) return true;
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
      var array = void 0,
          index = void 0,
          value = void 0;
      if (!kb.isReleaseable(obj)) return;
      obj.__kb_released = true; // mark as released

      // release array's items
      if (_.isArray(obj)) {
        for (index in obj) {
          value = obj[index];if (kb.isReleaseable(value)) {
            obj[index] = null, kb.release(value);
          }
        }
        return;
      }

      // observable or lifecycle managed
      if (ko.isObservable(obj) && _.isArray(array = kb.peek(obj))) {
        if (obj.__kb_is_co || obj.__kb_is_o && obj.valueType() === kb.TYPE_COLLECTION) {
          return typeof obj.destroy === 'function' ? obj.destroy() : undefined;
        }
        for (index in array) {
          value = array[index];if (kb.isReleaseable(value)) {
            array[index] = null, kb.release(value);
          }
        }
        if (typeof obj.dispose === 'function') {
          obj.dispose();
        }
        return;
      }

      // releaseable signature
      for (var i = 0, l = LIFECYCLE_METHODS.length; i < l; i++) {
        var method = LIFECYCLE_METHODS[i];
        if (typeof obj[method] === 'function') return obj[method].call(obj);
      }
      if (!ko.isObservable(obj)) return this.releaseKeys(obj); // view model
    }

    // Releases and clears all of the keys on an object using the conventions of release(), destroy(), dispose() without releasing the top level object itself.

  }, {
    key: 'releaseKeys',
    value: function releaseKeys(obj) {
      for (var key in obj) {
        var value = obj[key];
        if (key !== '__kb' && kb.isReleaseable(value)) {
          obj[key] = null;
          kb.release(value);
        }
      }
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
    // NOTE: if you provide an afterRender method on the View Model and do not provide afterRender in the options, afterRender will be called with the following signature: afterRender(element) which differs from the Knockout signture of afterRender(elements)
    //
    // @example The easy way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
    //   var el = kb.renderTemplate('my_template', kb.viewModel(new Backbone.Model({name: 'Bob'})));
    //   ...
    //   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)

  }, {
    key: 'renderTemplate',
    value: function renderTemplate(template, view_model, options) {
      var document = void 0;
      if (options == null) {
        options = {};
      }
      if (!(document = window != null ? window.document : undefined)) {
        return typeof console !== 'undefined' && console !== null ? console.log('renderTemplate: document is undefined') : undefined;
      }

      var el = document.createElement('div');
      var observable = ko.renderTemplate(template, view_model, options, el, 'replaceChildren');
      if (el.childNodes.length === 1) {
        // do not return the template wrapper if possible
        el = el.childNodes[0];
      } else if (el.childNodes.length) {
        for (var i = 0, end = el.childNodes.length, asc = end >= 0; asc ? i <= end : i >= end; asc ? i++ : i--) {
          // ensure the context is passed up to wrapper from a child
          try {
            ko.storedBindingContextForNode(el, ko.contextFor(el.childNodes[i]));break;
          } catch (error) {}
        }
      }
      kb.releaseOnNodeRemove(view_model, el);
      observable.dispose(); // we will handle memory management with ko.removeNode (otherwise creates memory leak on default bound dispose function)

      if (view_model.afterRender && !options.afterRender) {
        view_model.afterRender(el);
      } // call afterRender for custom setup unless provided in options (so doesn't get double called)
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
      if (node.length) {
        // convert to a root element
        var children = void 0;
        var _ref = [document.createElement('div'), node];
        node = _ref[0];
        children = _ref[1];

        children.forEach(function (child) {
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
      if (!model) return;
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
      if (!model) return;
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
      throw (_.isString(instance) ? instance : instance.constructor.name) + ': ' + message + ' is missing';
    }

    // @nodoc

  }, {
    key: '_throwUnexpected',
    value: function _throwUnexpected(instance, message) {
      throw (_.isString(instance) ? instance : instance.constructor.name) + ': ' + message + ' is unexpected';
    }

    // @nodoc

  }, {
    key: 'publishMethods',
    value: function publishMethods(observable, instance, methods) {
      methods.forEach(function (fn) {
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

if (window.Parse) {
  Backbone = kb.Parse = window.Parse;
  _ = kb._ = window.Parse._;
} else {
  Backbone = kb.Backbone = __webpack_require__(21);
  _ = kb._ = __webpack_require__(22);
}
kb.ko = ko;

// cache local references
kb.Collection = Backbone.Collection;
kb.Model = Backbone.Object || Backbone.Model;
kb.Events = Backbone.Events;

// Object.assign
kb.assign = _.extend || _.assign;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var kb = void 0,
    value = void 0;

var _kb = kb = __webpack_require__(0),
    _ = _kb._,
    ko = _kb.ko;

var ALL_ORMS = {
  default: null,
  'backbone-orm': null,
  'backbone-associations': __webpack_require__(19),
  'backbone-relational': __webpack_require__(20)
};

// @nodoc
kb.settings = { orm: ALL_ORMS.default };
for (var key in ALL_ORMS) {
  value = ALL_ORMS[key];
  if (value && value.isAvailable()) {
    kb.settings.orm = value;
    break;
  }
}

// @nodoc
module.exports = function (options) {
  if (options == null) {
    options = {};
  }
  for (key in options) {
    var orm;
    value = options[key];
    switch (key) {
      case 'orm':
        // set by name
        if (_.isString(value)) {
          if (!ALL_ORMS.hasOwnProperty(value)) {
            console.log('Knockback configure: could not find orm: ' + value + '. Available: ' + _.keys(ALL_ORMS).join(', '));
            continue;
          }
          if ((orm = ALL_ORMS[value]) && !orm.isAvailable()) {
            console.log('Knockback configure: could not enable orm ' + value + '. Make sure it is included before Knockback');
            continue;
          }
          kb.settings.orm = orm;
          continue;

          // set by functions
        } else {
          kb.settings.orm = value;
        }
        break;

      default:
        kb.settings[key] = value;
    }
  }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var kb = void 0,
    TypedValue = void 0;

var _kb = kb = __webpack_require__(0),
    _ = _kb._,
    ko = _kb.ko;

// @nodoc


module.exports = TypedValue = function () {
  function TypedValue(create_options) {
    _classCallCheck(this, TypedValue);

    this.create_options = create_options;
    this._vo = ko.observable(null); // create a value observable for the first dependency
  }

  _createClass(TypedValue, [{
    key: 'destroy',
    value: function destroy() {
      var previous_value = void 0;
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
      if (this.__kb_released) return; // destroyed, nothing to do

      // determine the new type
      new_value !== undefined || (new_value = null); // ensure null instead of undefined
      var new_type = kb.utils.valueType(new_value);

      if (this.__kb_value != null ? this.__kb_value.__kb_released : undefined) {
        this.__kb_value = this.value_type = undefined;
      }
      var value = this.__kb_value;

      switch (this.value_type) {
        case kb.TYPE_COLLECTION:
          if (this.value_type === kb.TYPE_COLLECTION && new_type === kb.TYPE_ARRAY) {
            return value(new_value);
          }
          if (new_type === kb.TYPE_COLLECTION || _.isNull(new_value)) {
            // use the provided CollectionObservable
            if (new_value && new_value instanceof kb.CollectionObservable) {
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
            } else if (kb.utils.wrappedObject(value) !== kb.utils.resolveModel(new_value)) {
              this._updateValueObservable(new_value);
            }
            return;
          }
          break;
      }

      if (this.value_type === new_type && !_.isUndefined(this.value_type)) {
        if (kb.peek(value) !== new_value) {
          return value(new_value);
        }
      } else if (kb.peek(value) !== new_value) {
        return this._updateValueObservable(new_value);
      }
    }
  }, {
    key: '_updateValueObservable',
    value: function _updateValueObservable(new_value, new_observable) {
      var previous_value = void 0,
          value = void 0;
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
      var _ref = [this.__kb_value, undefined];
      previous_value = _ref[0];
      this.__kb_value = _ref[1];


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
        } else if (creator.models_only) {
          value = new_value;
          value_type = kb.TYPE_SIMPLE;
        } else if (creator.create) {
          value = creator.create(new_value, create_options);
        } else {
          value = new creator(new_value, create_options);
        }

        // create and cache the type
      } else if (_.isArray(new_value)) {
        value_type = kb.TYPE_ARRAY;
        value = ko.observableArray(new_value);
      } else {
        value_type = kb.TYPE_SIMPLE;
        value = ko.observable(new_value);
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
  }, {
    key: '_inferType',
    value: function _inferType(value) {}
  }]);

  return TypedValue;
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* ###
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
### */

var _ = __webpack_require__(0)._;

// Helper function to correctly set up the prototype chain for subclasses.
// Similar to 'goog.inherits', but uses a hash of prototype properties and
// class properties to be extended.
function inherits(parent, protoProps, staticProps) {
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your 'extend' definition), or defaulted
  // by us to simply call the parent constructor.
  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function child() {
      return parent.apply(this, arguments);
    };
  }

  // Add static properties to the constructor function, if supplied.
  kb.assign(child, parent, staticProps);

  // Set the prototype chain to inherit from 'parent', without calling
  // parent's constructor function and add the prototype properties.
  child.prototype = _.create(parent.prototype, protoProps);
  child.prototype.constructor = child;

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;

  return child;
};

// The self-propagating extend function that BacLCone classes use.
module.exports = function extend(protoProps, classProps) {
  var child = inherits(this, protoProps, classProps);
  child.extend = this.extend;
  return child;
};

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

var kb = void 0;

var _kb = kb = __webpack_require__(0),
    _ = _kb._,
    ko = _kb.ko;

var extend = __webpack_require__(4);

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
      CollectionObservable.extend = extend;
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
    // @option options [Object] factories a map of dot-deliminated paths; for example 'models.owner': kb.ViewModel to either constructors or create functions. Signature: 'some.path': function(object, options)
    // @option options [Function] comparator a function that is used to sort an object. Signature: `function(model_a, model_b)` returns negative value for ascending, 0 for equal, and positive for descending
    // @option options [String] sort_attribute the name of an attribute. Default: resort on all changes to a model.
    // @option options [Id|Function|Array] filters filters can be individual ids (observable or simple) or arrays of ids, functions, or arrays of functions.
    // @option options [String] path the path to the value (used to create related observables from the factory).
    // @option options [kb.Store] store a store used to cache and share view models.
    // @option options [kb.Factory] factory a factory used to create view models.
    // @option options [Object] options a set of options merge into these options. Useful for extending options when deriving classes rather than merging them by hand.
    // @return [ko.observableArray] the constructor does not return 'this' but a ko.observableArray
    // @note the constructor does not return 'this' but a ko.observableArray

  }]);

  function CollectionObservable(collection, view_model, options) {
    var _this = this;

    _classCallCheck(this, CollectionObservable);

    _initialiseProps.call(this);

    var args = Array.prototype.slice.call(_.isArguments(collection) ? collection : arguments);
    return kb.ignore(function () {
      collection = args[0] instanceof kb.Collection ? args.shift() : _.isArray(args[0]) ? new kb.Collection(args.shift()) : new kb.Collection();
      if (_.isFunction(args[0])) args[0] = { view_model: args[0] };

      options = {};
      args.forEach(function (arg) {
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
      if (options.sort_attribute) {
        _this._comparator = ko.observable(_this._attributeComparator(options.sort_attribute));
      } else {
        _this._comparator = ko.observable(options.comparator);
      }
      if (options.filters) {
        _this._filters = ko.observableArray(function () {
          if (_.isArray(options.filters)) {
            return options.filters;
          } else if (options.filters) {
            return [options.filters];
          }
        }());
      } else {
        _this._filters = ko.observableArray([]);
      }
      var create_options = _this.create_options = { store: kb.Store.useOptionsOrCreate(options, collection, observable) }; // create options
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
      observable.collection = _this.collection = ko.computed({
        read: function read() {
          return _this._collection();
        },
        write: function write(new_collection) {
          return kb.ignore(function () {
            var previous_collection = void 0;
            if ((previous_collection = _this._collection()) === new_collection) return; // no change

            // @create_options.store.reuse(@, new_collection) # not meant to be shared
            kb.utils.wrappedObject(observable, new_collection);

            // clean up
            if (previous_collection) {
              previous_collection.unbind('all', _this._onCollectionChange);
            }

            // store in _kb_collection so that a collection() function can be exposed on the observable and so the collection can be
            if (new_collection) {
              new_collection.bind('all', _this._onCollectionChange);
            }

            // update references (including notification)
            return _this._collection(new_collection);
          });
        }
      });
      if (collection) {
        collection.bind('all', _this._onCollectionChange);
      } // bind now

      // observable that will re-trigger when sort or filters or collection changes
      _this._mapper = ko.computed(function () {
        var filter = void 0,
            models = void 0,
            view_models = void 0;
        var comparator = _this._comparator(); // create dependency
        var filters = _this._filters(); // create dependency
        if (filters) {
          (function () {
            return filters.map(function (filter) {
              return ko.utils.unwrapObservable(filter);
            });
          })();
        } // create a dependency
        var current_collection = _this._collection(); // create dependency
        if (_this.in_edit) return; // we are doing the editing

        // no models
        observable = kb.utils.wrappedObservable(_this);
        var previous_view_models = kb.peek(observable);
        if (current_collection) {
          models = current_collection.models;
        }
        if (!models || current_collection.models.length === 0) {
          view_models = [];

          // process filters, sorting, etc
        } else {
          // apply filters
          models = _.filter(models, function (model) {
            return !filters.length || _this._selectModel(model);
          });

          // apply sorting
          if (comparator) {
            view_models = _.map(models, function (model) {
              return _this._createViewModel(model);
            }).sort(comparator);

            // no sorting
          } else if (_this.models_only) {
            view_models = filters.length ? models : models.slice(); // clone the array if it wasn't filtered
          } else {
            view_models = _.map(models, function (model) {
              return _this._createViewModel(model);
            });
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

      !kb.statistics || kb.statistics.register('CollectionObservable', _this); // collect memory management statistics

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
      this.collection.dispose();this._collection = observable.collection = this.collection = null;
      this._mapper.dispose();this._mapper = null;
      kb.release(this._filters);this._filters = null;
      this._comparator(null);this._comparator = null;
      this.create_options = null;
      observable.collection = null;kb.utils.wrappedDestroy(this);

      return !kb.statistics || kb.statistics.unregister('CollectionObservable', this); // collect memory management statistics
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
      var id_attribute = model.hasOwnProperty(model.idAttribute) ? model.idAttribute : 'cid';
      return _.find(kb.peek(kb.utils.wrappedObservable(this)), function (test) {
        return __guard__(test != null ? test.__kb : undefined, function (x) {
          return x.object;
        }) ? test.__kb.object[id_attribute] === model[id_attribute] : false;
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
        if (!kb.utils.wrappedStoreIsOwned(observable)) return;
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
      var factory = void 0;
      var absolute_models_path = kb.utils.pathJoin(options.path, 'models');
      var factories = options.factories;

      // check the existing factory

      if (factory = options.factory) {
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
        if (options.hasOwnProperty('models_only')) {
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
      if (!view_model) return; // it may have already been removed
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
          if (!filter.includes(model.id)) return false;
        } else if (model.id !== filter) return false;
      }
      return true;
    }
  }]);

  return CollectionObservable;
}();

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this._onCollectionChange = function (event, arg) {
    return kb.ignore(function () {
      var comparator = void 0,
          view_model = void 0;
      if (_this3.in_edit || kb.wasReleased(_this3)) return; // we are doing the editing or have been released

      switch (event) {
        case 'reset':
          if (_this3.auto_compact) {
            _this3.compact();
          } else {
            _this3._collection.notifySubscribers(_this3._collection());
          }
          break;
        case 'sort':case 'resort':
          _this3._collection.notifySubscribers(_this3._collection());
          break;

        case 'new':case 'add':
          if (!_this3._selectModel(arg)) return; // filtered

          var observable = kb.utils.wrappedObservable(_this3);
          var collection = _this3._collection();
          if (collection.indexOf(arg) === -1) return; // the model may have been removed before we got a chance to add it
          if (view_model = _this3.viewModelByModel(arg)) return; // it may have already been added by a change event
          _this3.in_edit++;
          if (comparator = _this3._comparator()) {
            observable().push(_this3._createViewModel(arg));
            observable.sort(comparator);
          } else {
            observable.splice(collection.indexOf(arg), 0, _this3._createViewModel(arg));
          }
          _this3.in_edit--;
          break;

        case 'remove':case 'destroy':
          _this3._onModelRemove(arg);break;
        case 'change':
          // filtered, remove
          if (!_this3._selectModel(arg)) {
            return _this3._onModelRemove(arg);
          }

          view_model = _this3.models_only ? arg : _this3.viewModelByModel(arg);
          if (!view_model) {
            return _this3._onCollectionChange('add', arg);
          } // add new
          if (!(comparator = _this3._comparator())) return;

          _this3.in_edit++;
          kb.utils.wrappedObservable(_this3).sort(comparator);
          _this3.in_edit--;
          break;
      }
    });
  };

  this._onObservableArrayChange = function (models_or_view_models) {
    return kb.ignore(function () {
      var models = void 0;
      if (_this3.in_edit) return; // we are doing the editing

      // validate input
      _this3.models_only && (!models_or_view_models.length || kb.isModel(models_or_view_models[0])) || !_this3.models_only && (!models_or_view_models.length || _.isObject(models_or_view_models[0]) && !kb.isModel(models_or_view_models[0])) || kb._throwUnexpected(_this3, 'incorrect type passed');

      var observable = kb.utils.wrappedObservable(_this3);
      var collection = kb.peek(_this3._collection);
      var has_filters = kb.peek(_this3._filters).length;
      if (!collection) return; // no collection or we are updating ourselves

      var view_models = models_or_view_models;

      // set Models
      if (_this3.models_only) {
        models = _.filter(models_or_view_models, function (model) {
          return !has_filters || _this3._selectModel(model);
        });

        // set ViewModels
      } else {
        !has_filters || (view_models = []); // check for filtering of ViewModels
        models = [];
        models_or_view_models.forEach(function (view_model) {
          var current_view_model = void 0;
          var model = kb.utils.wrappedObject(view_model);
          if (has_filters) {
            if (!_this3._selectModel(model)) return; // filtered so skip
            view_models.push(view_model);
          }

          // check for view models being different (will occur if a ko select selectedOptions is bound to this collection observable) -> update our store
          if (current_view_model = _this3.create_options.store.find(model, _this3.create_options.creator)) {
            current_view_model.constructor === view_model.constructor || kb._throwUnexpected(_this3, 'replacing different type of view model');
          }
          _this3.create_options.store.retain(view_model, model, _this3.create_options.creator);
          models.push(model);
        });
      }

      // a change, update models
      _this3.in_edit++;
      models_or_view_models.length === view_models.length || observable(view_models); // replace the ViewModels because they were filtered
      _.isEqual(collection.models, models) || collection.reset(models);
      _this3.in_edit--;
    });
  };
};

CollectionObservable.initClass();
kb.CollectionObservable = CollectionObservable;
module.exports = CollectionObservable;

// factory function
kb.collectionObservable = function (collection, view_model, options) {
  return new kb.CollectionObservable(arguments);
};
kb.observableCollection = kb.collectionObservable;

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

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

var kb = void 0;

var _kb = kb = __webpack_require__(0),
    _ = _kb._,
    ko = _kb.ko;

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
      for (var event_name in _this.__kb.callbacks) {
        // bind all events
        var callbacks = _this.__kb.callbacks[event_name];
        if (callbacks.model && callbacks.model !== model) {
          _this._unbindCallbacks(event_name, callbacks, true);
        }

        if (!callbacks.model) {
          callbacks.model = model, model.bind(event_name, callbacks.fn);
        }
        callbacks.list.forEach(function (info) {
          if (!info.unbind_fn) {
            info.unbind_fn = kb.settings.orm != null ? kb.settings.orm.bind(model, info.key, info.update, info.path) : undefined;
          }
          info.emitter ? info.emitter(model) : undefined;
        });
      }
    };

    this._onModelUnloaded = function (model) {
      if (_this.ee !== model) return;
      _this.ee = null;
      for (var event_name in _this.__kb.callbacks) {
        var callbacks = _this.__kb.callbacks[event_name];_this._unbindCallbacks(event_name, callbacks);
      } // unbind all events
    };

    this._unbindCallbacks = function (event_name, callbacks, skip_emitter) {
      if (callbacks.model) {
        callbacks.model.unbind(event_name, callbacks.fn);
        callbacks.model = null;
      }

      callbacks.list.forEach(function (info) {
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
    if (callback_options) {
      this.registerCallbacks(obj, callback_options);
    }
    if (emitter) {
      this.emitter(emitter);
    }
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

      event_names.forEach(function (event_name) {
        if (!event_name) return; // extra spaces

        var callbacks = void 0,
            info = void 0;
        if (!(callbacks = _this2.__kb.callbacks[event_name])) {
          callbacks = _this2.__kb.callbacks[event_name] = {
            model: null,
            list: [],
            fn: function fn(model) {
              callbacks.list.forEach(function (info) {
                if (!info.update) return;
                if (model && info.key && model.hasChanged && !model.hasChanged(ko.utils.unwrapObservable(info.key))) return; // key doesn't match
                !kb.statistics || kb.statistics.addModelEvent({ name: event_name, model: model, key: info.key, path: info.path });
                info.update();
              }); // trigger update
            }
          };
        }

        callbacks.list.push(info = _.defaults({ obj: obj }, callback_info)); // store the callback information
        if (model) return _this2._onModelLoaded(model);
      });
      return this;
    }
  }, {
    key: 'releaseCallbacks',
    value: function releaseCallbacks(obj) {
      var callbacks = void 0;
      this.ee = null;
      for (var event_name in this.__kb.callbacks) {
        callbacks = this.__kb.callbacks[event_name];this._unbindCallbacks(event_name, callbacks, kb.wasReleased(obj));
      } // unbind all events
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
/* 7 */
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

var kb = void 0;

var _kb = kb = __webpack_require__(0),
    _ = _kb._;

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
    // @option options [Object] factories a map of dot-deliminated paths; for example 'models.owner': kb.ViewModel to either constructors or create functions. Signature: 'some.path': function(object, options)
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
      return this.paths.hasOwnProperty(path) || (this.parent_factory != null ? this.parent_factory.hasPath(path) : undefined);
    }
  }, {
    key: 'addPathMapping',
    value: function addPathMapping(path, create_info) {
      return this.paths[path] = create_info;
    }
  }, {
    key: 'addPathMappings',
    value: function addPathMappings(factories, owner_path) {
      for (var path in factories) {
        var create_info = factories[path];
        this.paths[kb.utils.pathJoin(owner_path, path)] = create_info;
      }
    }
  }, {
    key: 'hasPathMappings',
    value: function hasPathMappings(factories, owner_path) {
      var all_exist = true;
      for (var path in factories) {
        var creator = factories[path];
        var existing_creator = this.creatorForPath(null, kb.utils.pathJoin(owner_path, path));
        all_exist &= existing_creator && creator === existing_creator;
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
/* 8 */
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

var kb = void 0;
module.exports = kb = __webpack_require__(0);

kb.configure = __webpack_require__(1);

// re-expose modules
kb.modules = { underscore: kb._, backbone: kb.Parse || kb.Backbone, knockout: kb.ko };

/***/ }),
/* 9 */
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

var kb = void 0;
var window = window != null ? window : global;

var _kb = kb = __webpack_require__(0),
    _ = _kb._,
    ko = _kb.ko;

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
      var inject = function inject(data) {
        if (_.isFunction(data)) {
          view_model = new data(view_model, element, value_accessor, all_bindings_accessor); // use 'new' to allow for classes in addition to functions
          kb.releaseOnNodeRemove(view_model, element);
        } else {
          // view_model constructor causes a scope change
          if (data.view_model) {
            // specifying a view_model changes the scope so we need to bind a destroy
            view_model = new data.view_model(view_model, element, value_accessor, all_bindings_accessor);
            kb.releaseOnNodeRemove(view_model, element);
          }

          // resolve and merge in each key
          for (var key in data) {
            var value = data[key];
            if (key === 'view_model') {
              continue;
            }

            // create function
            if (key === 'create') {
              value(view_model, element, value_accessor, all_bindings_accessor);

              // resolve nested with assign or not
            } else if (_.isObject(value) && !_.isFunction(value)) {
              var target = nested || value && value.create ? {} : view_model;
              view_model[key] = kb.Inject.inject(value, target, element, value_accessor, all_bindings_accessor, true);

              // simple set
            } else {
              view_model[key] = value;
            }
          }
        }

        return view_model;
      };

      // in recursive calls, we are already protected from propagating dependencies to the template
      return nested ? inject(data) : kb.ignore(function () {
        return inject(data);
      });
    }

    // Searches the DOM from root or document for elements with the `'kb-inject'` attribute and create/customizes ViewModels for the DOM tree when encountered. Also, used with the data-bind `'inject'` custom binding.
    // @param [DOM element] root the root DOM element to start searching for `'kb-inject'` attributes.
    // @return [Array] array of Objects with the DOM elements and ViewModels that were bound in the form `{el: DOM element, view_model: ViewModel}`.

  }, {
    key: 'injectViewModels',
    value: function injectViewModels(root) {
      // find all of the app elements
      var results = [];
      var findElements = function findElements(el) {
        if (!el.__kb_injected) {
          // already injected -> skip, but still process children in case they were added afterwards
          var attr = void 0;
          if (el.attributes && (attr = _.find(el.attributes, function (attr) {
            return attr.name === 'kb-inject';
          }))) {
            el.__kb_injected = true; // mark injected
            results.push({ el: el, view_model: {}, binding: attr.value });
          }
        }
        _.each(el.childNodes, function (child) {
          return findElements(child);
        });
      };
      if (!root && (window != null ? window.document : undefined)) {
        root = window.document;
      }
      findElements(root);

      // bind the view models
      results.forEach(function (app) {
        // evaluate the app data
        var afterBinding = void 0,
            beforeBinding = void 0,
            expression = void 0,
            options = void 0;
        if (expression = app.binding) {
          var _data;

          expression.search(/[:]/) < 0 || (expression = '{' + expression + '}'); // wrap if is an object
          var data = new Function('', 'return ( ' + expression + ' )')();
          data || (data = {}); // no data
          !data.options || ((_data = data, options = _data.options, _data), delete data.options); // extract options
          options || (options = {});
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
ko.applyBindings = function (context, element) {
  var results = kb.RECUSIVE_AUTO_INJECT ? kb.injectViewModels(element) : [];
  if (!results.length) return _ko_applyBindings.apply(this, arguments);
};

// ############################
// Aliases
// ############################
kb.injectViewModels = kb.Inject.injectViewModels;

// ############################
// Auto Inject results
// ############################
if (typeof document !== 'undefined' && document !== null) {
  // use simple ready check
  var _onReady = void 0;
  (_onReady = function onReady() {
    if (document.readyState !== 'complete') return setTimeout(_onReady, 0); // keep waiting for the document to load
    return kb.injectViewModels(); // the document is loaded
  })();
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 10 */
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

var kb = void 0;

var _kb = kb = __webpack_require__(0),
    ko = _kb.ko;

// Allow for dependent release until is resolved https://github.com/knockout/knockout/issues/1464


if (__guard__(ko.subscribable != null ? ko.subscribable.fn : undefined, function (x) {
  return x.extend;
})) {
  var _extend = ko.subscribable.fn.extend;
  ko.subscribable.fn.extend = function () {
    var target = _extend.apply(this, arguments);

    // release the extended observable
    if (target !== this && kb.isReleaseable(this)) {
      var _dispose = target.dispose;
      target.dispose = function () {
        if (_dispose != null) {
          _dispose.apply(target, arguments);
        }return kb.release(this);
      }.bind(this);
    }

    return target;
  };
}

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

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

var kb = void 0;

var _kb = kb = __webpack_require__(0),
    _ = _kb._,
    ko = _kb.ko;

var TypedValue = __webpack_require__(2);

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
      var _model = void 0,
          args = void 0;
      key_or_info || kb._throwMissing(_this, 'key_or_info');
      _this.key = key_or_info.key || key_or_info;
      KEYS_INFO.forEach(function (key) {
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
          _model = _this._model();
          args = [_this.key].concat(_this.args || []);
          args.forEach(function (arg) {
            return ko.utils.unwrapObservable(arg);
          });

          __guard__(kb.utils.wrappedEventWatcher(_this), function (x) {
            return x.emitter(_model || null);
          }); // update the event watcher
          if (_this.read) {
            _this.update(_this.read.apply(_this._vm, args));
          } else if (!_.isUndefined(_model)) {
            kb.ignore(function () {
              return _this.update(kb.getValue(_model, kb.peek(_this.key), _this.args));
            });
          }
          return _this._value.value();
        },

        write: function write(new_value) {
          return kb.ignore(function () {
            var unwrapped_new_value = kb.utils.unwrapModels(new_value); // unwrap for set (knockout may pass view models which are required for the observable but not the model)
            _model = kb.peek(_this._model);
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
      if (create_options.factories && (typeof create_options.factories === 'function' || create_options.factories.create)) {
        create_options.factory = kb.utils.wrappedFactory(observable, new kb.Factory(create_options.factory));
        create_options.factory.addPathMapping(create_options.path, create_options.factories);
      } else {
        create_options.factory = kb.Factory.useOptionsOrCreate(create_options, observable, create_options.path);
      }
      delete create_options.factories;

      // publish public interface on the observable and return instead of this
      kb.publishMethods(observable, _this, KEYS_PUBLISH);

      // use external model observable or create
      observable.model = _this.model = ko.computed({
        read: function read() {
          return ko.utils.unwrapObservable(_this._model);
        },
        write: function write(new_model) {
          return kb.ignore(function () {
            if (_this.__kb_released || kb.peek(_this._model) === new_model) return; // destroyed or no change

            // update references
            var new_value = kb.getValue(new_model, kb.peek(_this.key), _this.args);
            _this._model(new_model);
            if (!new_model) {
              return _this.update(null);
            } else if (!_.isUndefined(new_value)) {
              return _this.update(new_value);
            }
          });
        }
      });
      kb.EventWatcher.useOptionsOrCreate({ event_watcher: event_watcher }, model || null, _this, { emitter: _this.model, update: function update() {
          return kb.ignore(function () {
            return _this.update();
          });
        }, key: _this.key, path: create_options.path });
      _this._value.rawValue() || _this._value.update(); // wasn't loaded so create

      if (kb.LocalizedObservable && key_or_info.localizer) {
        observable = new key_or_info.localizer(observable);
      } // wrap ourselves with a localizer
      if (kb.DefaultObservable && key_or_info.hasOwnProperty('default')) {
        observable = kb.defaultObservable(observable, key_or_info.default);
      } // wrap ourselves with a default value

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
      this.model.dispose();this.model = observable.model = null;
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
      if (this.__kb_released) return; // destroyed, nothing to do
      if (!arguments.length) {
        new_value = kb.getValue(kb.peek(this._model), kb.peek(this.key));
      }
      return this._value.update(new_value);
    }
  }]);

  return Observable;
}();

kb.observable = function (model, key, options, view_model) {
  return new kb.Observable(model, key, options, view_model);
};

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

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

var kb = void 0;

var _kb = kb = __webpack_require__(0),
    _ = _kb._;

// kb.Statistics is an optional components that is useful for measuring your application's performance. You can record all of the Backbone.Events that have triggered ko.observable subscription updates and the memory footprint (instance count-only) of your ViewModels and collection observables.
//
// kb.Statistics is not included in `knockback.js` nor `knockback-core.js` so you need to manually include it from the `lib` directory.
//


module.exports = kb.Statistics = function () {
  function Statistics() {
    _classCallCheck(this, Statistics);

    this.model_events_tracker = [];
    this.registered_tracker = {};
  }

  // Clear the tracked model events (but keep the registered objects intact)


  _createClass(Statistics, [{
    key: 'clear',
    value: function clear() {
      return this.model_events_tracker = [];
    }

    // ##############################
    // Registered Events
    // ##############################

    // Register a model event

  }, {
    key: 'addModelEvent',
    value: function addModelEvent(event) {
      return this.model_events_tracker.push(event);
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
      for (var key in event_groups) {
        var value = event_groups[key];
        stats_string += '\n ' + key + ', count: ' + value.length;
      }
      return stats_string;
    }

    // ##############################
    // Registered Observables and View Models
    // ##############################

    // Register an object by key

  }, {
    key: 'register',
    value: function register(key, obj) {
      return this.registeredTracker(key).push(obj);
    }

    // Unregister an object by key

  }, {
    key: 'unregister',
    value: function unregister(key, obj) {
      var type_tracker = this.registeredTracker(key);
      var index = _.indexOf(type_tracker, obj);
      if (!~index) {
        if (typeof console !== 'undefined') console.log('kb.Statistics: failed to unregister type: ' + key);
        return;
      }
      return type_tracker.splice(index, 1);
    }

    // @return [Integer] the number of registered objects by type

  }, {
    key: 'registeredCount',
    value: function registeredCount(type) {
      if (type) return this.registeredTracker(type).length;
      var count = 0;
      for (type in this.registered_tracker[type]) {
        var type_tracker = this.registered_tracker[type][type];
        count += type_tracker.length;
      }
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
      for (var type in this.registered_tracker) {
        var type_tracker = this.registered_tracker[type];
        if (!type_tracker.length) continue;
        if (written) {
          stats_string += '\n ';
        }
        stats_string += (type || 'No Name') + ': ' + type_tracker.length;
        var written = true;
      }
      return stats_string || success_message;
    }

    // @nodoc

  }, {
    key: 'registeredTracker',
    value: function registeredTracker(key) {
      if (this.registered_tracker.hasOwnProperty(key)) {
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

      keys.forEach(function (key) {
        var node = events[key];
        if (node) {
          if (_.isArray(node)) {
            stats[key] = _.compact(node).length;
          } else {
            stats[key] = 0;var _node = node,
                tail = _node.tail;

            while ((node = node.next) !== tail) {
              stats[key]++;
            }
          }
          stats.count += stats[key];
        }
      });
      return stats;
    }
  }]);

  return Statistics;
}();

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

var kb = void 0;

var _kb = kb = __webpack_require__(0),
    _ = _kb._,
    ko = _kb.ko;

// Used to share and manage the persistence of ViewModels and observables. ks.Store can be used to break relationship cycles between models, to reduce memory usage, and to share view models between kb.CollectionObservables (for example, when using Knockout.js selectedOptions).
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
      if (~index) return kb.Store.instances.splice(index, 1);
    }

    // Manually clear the store

  }, {
    key: 'clear',
    value: function clear() {
      var _this = this;

      var observable = void 0,
          observable_records = void 0,
          replaced_observables = void 0;
      var _ref = [this.observable_records, {}];
      observable_records = _ref[0];
      this.observable_records = _ref[1];

      for (var creator_id in observable_records) {
        var records = observable_records[creator_id];
        for (var cid in records) {
          observable = records[cid];this.release(observable, true);
        }
      }

      var _ref2 = [this.replaced_observables, []];
      replaced_observables = _ref2[0];
      this.replaced_observables = _ref2[1];

      replaced_observables.forEach(function (observable) {
        if (!observable.__kb_released) _this.release(observable, true);
      });
    }

    // Manually compact the store by searching for released view models

  }, {
    key: 'compact',
    value: function compact() {
      for (var creator_id in this.observable_records) {
        var records = this.observable_records[creator_id];
        for (var cid in records) {
          if (records[cid].__kb_released) delete records[cid];
        };
      }
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
      var current_observable = void 0;
      if (!this._canRegister(observable)) return;
      if (!creator) {
        creator = observable.constructor;
      } // default is to use the constructor

      if (current_observable = this.find(obj, creator)) {
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

      var creator = void 0,
          observable = void 0;
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
        throw new Error('Invalid factory for "' + options.path + '"');
      }

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
      var current_obj = void 0,
          current_observable = void 0;
      if ((current_obj = kb.utils.wrappedObject(observable)) === obj) return;
      if (!this._canRegister(observable)) {
        throw new Error('Cannot reuse a simple observable');
      }
      if (this._refCount(observable) !== 1) {
        throw new Error('Trying to change a shared view model. Ref count: ' + this._refCount(observable));
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

    // Release a reference to a a ViewModel in this store.

  }, {
    key: 'release',
    value: function release(observable, force) {
      var store_references = void 0;
      if (!this._canRegister(observable)) return kb.release(observable); // just release

      // maybe be externally added
      if (store_references = this._storeReferences(observable)) {
        if (!force && --store_references.ref_count > 0) return; // do not release yet
        this._clearStoreReferences(observable);
      }

      this._remove(observable);
      if (observable.__kb_released) return;
      if (force || this._refCount(observable) <= 1) return kb.release(observable); // allow for a single initial reference in another store
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
      var stores_references = void 0;
      if (observable.__kb_released) {
        if (typeof console !== 'undefined' && console !== null) {
          console.log('Observable already released');
        }
        return 0;
      }
      if (!(stores_references = kb.utils.get(observable, 'stores_references'))) return 1;
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
      var cid = void 0;
      return cid = obj ? obj.cid || (obj.cid = _.uniqueId('c')) : 'null';
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
        var item = create.__kb_cids[i];
        if (item.create === create) return item.cid;
      }
      create.__kb_cids.push(item = { create: create, cid: _.uniqueId('kb') });return item.cid;
    }

    // @nodoc

  }, {
    key: '_storeReferences',
    value: function _storeReferences(observable) {
      var _this3 = this;

      var stores_references = kb.utils.get(observable, 'stores_references');
      if (!stores_references) return;

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

      var ref = _.find(stores_references, function (ref) {
        return ref.store === _this4;
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
      var name = void 0;
      if (!creator) {
        creator = observable.constructor;
      } // default is to use the constructor
      kb.utils.wrappedObject(observable, obj);kb.utils.wrappedCreator(observable, creator);
      return (this.observable_records[name = this._creatorId(creator)] || (this.observable_records[name] = {}))[this._cid(obj)] = observable;
    }

    // @nodoc

  }, {
    key: '_remove',
    value: function _remove(observable) {
      var current_observable = void 0,
          obj = void 0;
      var creator = kb.utils.wrappedCreator(observable) || observable.constructor; // default is to use the constructor
      if (current_observable = this.find(obj = kb.utils.wrappedObject(observable), creator)) {
        // already released
        if (current_observable === observable) {
          delete this.observable_records[this._creatorId(creator)][this._cid(obj)];
        } // not already replaced
      }
      kb.utils.wrappedObject(observable, null);return kb.utils.wrappedCreator(observable, null);
    }

    // @nodoc

  }, {
    key: '_creator',
    value: function _creator(obj, options) {
      var creator = void 0;
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
  }]);

  return Store;
}();

;
Store.initClass();
kb.Store = Store;
module.exports = Store;

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

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

var kb = void 0;

var _kb = kb = __webpack_require__(0),
    _ = _kb._,
    ko = _kb.ko;

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
      this.wrappedDestroy = __webpack_require__(18);

      // Helper to merge options including ViewmModel options like `keys` and `factories`
      //
      // @param [Object] obj the object to test
      //
      // @example
      //   kb.utils.collapseOptions(options);
      this.collapseOptions = __webpack_require__(16);

      // used for attribute setting to ensure all model attributes have their underlying models
      this.unwrapModels = __webpack_require__(17);
    }

    // @nodoc

  }, {
    key: 'get',
    value: function get(obj, key, default_value) {
      return !obj.__kb || !obj.__kb.hasOwnProperty(key) ? default_value : obj.__kb[key];
    }

    // @nodoc

  }, {
    key: 'set',
    value: function set(obj, key, value) {
      return (obj.__kb || (obj.__kb = {}))[key] = value;
    }

    // @nodoc

  }, {
    key: 'orSet',
    value: function orSet(obj, key, value) {
      if (!obj.__kb) obj.__kb = {};
      if (!obj.__kb.hasOwnProperty(key)) obj.__kb[key] = value;
      return obj.__kb[key];
    }

    // @nodoc

  }, {
    key: 'has',
    value: function has(obj, key) {
      return obj.__kb && obj.__kb.hasOwnProperty(key);
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

var kb = void 0;

var _kb = kb = __webpack_require__(0),
    _ = _kb._,
    ko = _kb.ko;

var extend = __webpack_require__(4);

// @nodoc
var assignViewModelKey = function assignViewModelKey(vm, key) {
  var vm_key = vm.__kb.internals && ~_.indexOf(vm.__kb.internals, key) ? '_' + key : key;
  if (vm.__kb.view_model.hasOwnProperty(vm_key)) return; // already exists, skip
  vm.__kb.view_model[vm_key] = null;
  return vm_key;
};

// @nodoc
var createObservable = function createObservable(vm, model, key, create_options) {
  var vm_key = void 0;
  if (vm.__kb.excludes && ~_.indexOf(vm.__kb.excludes, key)) return;
  if (vm.__kb.statics && ~_.indexOf(vm.__kb.statics, key)) return;
  if (!(vm_key = assignViewModelKey(vm, key))) return;
  return vm[vm_key] = vm.__kb.view_model[vm_key] = kb.observable(model, key, create_options, vm);
};

// @nodoc
var createStaticObservables = function createStaticObservables(vm, model) {
  vm.__kb.statics.forEach(function (key) {
    var vm_key = void 0;
    if (vm_key = assignViewModelKey(vm, key)) {
      if (model.has(vm_key)) {
        vm[vm_key] = vm.__kb.view_model[vm_key] = model.get(vm_key);
      } else if (vm.__kb.static_defaults && vm_key in vm.__kb.static_defaults) {
        vm[vm_key] = vm.__kb.view_model[vm_key] = vm.__kb.static_defaults[vm_key];
      } else {
        delete vm.__kb.view_model[vm_key];
      }
    }
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
      ViewModel.extend = extend;
      // for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")
    }

    // Used to create a new kb.ViewModel.
    //
    // @param [Model|ModelRef] model the model to observe (can be null)
    // @param [Object] options the create options
    // @option options [Array|String] internals an array of atttributes that should be scoped with an underscore, eg. name -> _name
    // @option options [Array|String] requires an array of atttributes that will have kb.Observables created even if they do not exist on the Model. Useful for binding Views that require specific observables to exist
    // @option options [Array|String] keys restricts the keys used on a model. Useful for reducing the number of kb.Observables created from a limited set of Model attributes
    // @option options [Object|Array|String] excludes if an array is supplied, excludes keys to exclude on the view model; for example, if you want to provide a custom implementation. If an Object, it provides options to the kb.Observable constructor.
    // @option options [Array] statics creates non-observable properties on your view model for Model attributes that do not need to be observed for changes.
    // @option options [Object] static_defaults provides default values for statics.
    // @option options [String] path the path to the value (used to create related observables from the factory).
    // @option options [kb.Store] store a store used to cache and share view models.
    // @option options [Object] factories a map of dot-deliminated paths; for example `{'models.name': kb.ViewModel}` to either constructors or create functions. Signature: `{'some.path': function(object, options)}`
    // @option options [kb.Factory] factory a factory used to create view models.
    // @option options [Object] options a set of options merge into these options. Useful for extending options when deriving classes rather than merging them by hand.
    // @return [ko.observable] the constructor returns 'this'
    // @param [Object] view_model a view model to also set the kb.Observables on. Useful when batch creating observable on an owning view model.

  }]);

  function ViewModel(model) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var view_model = arguments[2];

    _classCallCheck(this, ViewModel);

    var args = Array.prototype.slice.call(_.isArguments(model) ? model : arguments);
    return kb.ignore(function () {
      !(model = args.shift()) || kb.isModel(model) || kb._throwUnexpected(_this, 'not a model');
      if (_.isArray(args[0])) {
        args[0] = { keys: args[0] };
      }
      if (!_this.__kb) {
        _this.__kb = {};
      }_this.__kb.view_model = args.length > 1 ? args.pop() : _this;
      options = {};
      args.forEach(function (arg) {
        kb.assign(options, arg);options = kb.utils.collapseOptions(options);
      });
      KEYS_OPTIONS.forEach(function (key) {
        if (options.hasOwnProperty(key)) {
          _this.__kb[key] = options[key];
        }
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
            if (kb.utils.wrappedObject(_this) === new_model || kb.wasReleased(_this) || !event_watcher) return;

            _this.__kb.store.reuse(_this, kb.utils.resolveModel(new_model));
            event_watcher.emitter(new_model);_model(event_watcher.ee);
            return !event_watcher.ee || _this.createObservables(event_watcher.ee);
          });
        }
      });
      var event_watcher = kb.utils.wrappedEventWatcher(_this, new kb.EventWatcher(model, _this, { emitter: _this._model, update: function update() {
          return kb.ignore(function () {
            return !(event_watcher != null ? event_watcher.ee : undefined) || _this.createObservables(event_watcher != null ? event_watcher.ee : undefined);
          });
        } }));
      kb.utils.wrappedObject(_this, model = event_watcher.ee);_model(event_watcher.ee);

      // update the observables
      _this.__kb.create_options = { store: kb.utils.wrappedStore(_this), factory: kb.utils.wrappedFactory(_this), path: _this.__kb.path, event_watcher: kb.utils.wrappedEventWatcher(_this) };
      !options.requires || _this.createObservables(model, options.requires);
      !_this.__kb.internals || _this.createObservables(model, _this.__kb.internals);
      !options.mappings || _this.createObservables(model, options.mappings);
      !_this.__kb.statics || createStaticObservables(_this, model);
      _this.createObservables(model, _this.__kb.keys);

      !kb.statistics || kb.statistics.register('ViewModel', _this); // collect memory management statistics
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
        (function () {
          var result = [];
          for (var vm_key in _this2.__kb.vm_keys) {
            result.push(_this2.__kb.view_model[vm_key] = null);
          }
          return result;
        })();
      } // clear the external references
      this.__kb.view_model = this.__kb.create_options = null;
      kb.releaseKeys(this);
      kb.utils.wrappedDestroy(this);

      return !kb.statistics || kb.statistics.unregister('ViewModel', this); // collect memory management statistics
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

      var key = void 0;
      if (!keys) {
        var rel_keys = void 0;
        if (this.__kb.keys || !model) return; // only use the keys provided
        for (key in model.attributes) {
          createObservable(this, model, key, this.__kb.create_options);
        }
        if (rel_keys = __guardMethod__(kb.settings.orm, 'keys', function (o) {
          return o.keys(model);
        })) {
          (function () {
            return rel_keys.map(function (key) {
              return createObservable(_this3, model, key, _this3.__kb.create_options);
            });
          })();
        }
      } else if (_.isArray(keys)) {
        keys.forEach(function (key) {
          return createObservable(_this3, model, key, _this3.__kb.create_options);
        });
      } else {
        for (key in keys) {
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
  }]);

  return ViewModel;
}();

ViewModel.initClass();
kb.ViewModel = ViewModel;
module.exports = ViewModel;

// Factory function to create a kb.ViewModel.
kb.viewModel = function (model, options, view_model) {
  return new kb.ViewModel(arguments);
};
function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  }
  return undefined;
}

/***/ }),
/* 16 */
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
  value.forEach(function (item) {
    result[item] = { key: item };
  });
  return result;
};

var _mergeOptions = function _mergeOptions(result, options) {
  if (!options) return result;

  for (var key in options) {
    var value = options[key];
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
  }

  return _mergeOptions(result, options.options);
};

// @nodoc
module.exports = function (options) {
  return _mergeOptions({}, options);
};

/***/ }),
/* 17 */
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

var _unwrapModels = void 0;

var _require = __webpack_require__(0),
    _ = _require._;

// @nodoc


module.exports = _unwrapModels = function unwrapModels(obj) {
  if (!obj) return obj;
  if (obj.__kb) return obj.__kb.hasOwnProperty('object') ? obj.__kb.object : obj;
  if (_.isArray(obj)) return _.map(obj, function (test) {
    return _unwrapModels(test);
  });
  if (_.isObject(obj) && obj.constructor === {}.constructor) {
    // a simple object
    var result = {};
    for (var key in obj) {
      result[key] = _unwrapModels(obj[key]);
    }return result;
  }

  return obj;
};

/***/ }),
/* 18 */
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

var _require = __webpack_require__(0),
    _ = _require._;

// @nodoc


var wrappedDestroy = function wrappedDestroy(obj) {
  if (!obj.__kb) return;
  if (obj.__kb.event_watcher) obj.__kb.event_watcher.releaseCallbacks(obj);

  var __kb = obj.__kb;

  obj.__kb = null; // clear now to break cycles

  if (__kb.observable) {
    __kb.observable.destroy = __kb.observable.release = null;
    wrappedDestroy(__kb.observable);
    __kb.observable = null;
  }

  __kb.factory = null;

  if (__kb.event_watcher_is_owned) __kb.event_watcher.destroy(); // release the event_watcher
  __kb.event_watcher = null;

  if (__kb.store_is_owned) __kb.store.destroy(); // release the store
  __kb.store = null;

  if (__kb.stores_references) {
    var store_references = void 0;
    while (store_references = __kb.stores_references.pop()) {
      if (!store_references.store.__kb_released) {
        store_references.store.release(obj);
      }
    }
  }
};
module.exports = wrappedDestroy;

/***/ }),
/* 19 */
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
/* 20 */
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

      var relFn = function relFn(model) {
        !kb.statistics || kb.statistics.addModelEvent({ name: 'update (relational)', model: model, key: key, path: path });
        return update();
      };

      // VERSIONING: pre Backbone-Relational 0.8.0
      var events = kb.Backbone.Relation.prototype.sanitizeOptions ? ['update', 'add', 'remove'] : ['change', 'add', 'remove'];
      if (type === kb.TYPE_COLLECTION) events.forEach(function (event) {
        return model.bind(event + ':' + key, relFn);
      });else model.bind(events[0] + ':' + key, relFn);

      return function () {
        if (type === kb.TYPE_COLLECTION) events.forEach(function (event) {
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
/* 21 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_21__;

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_22__;

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_23__;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(5);
__webpack_require__(1);
__webpack_require__(6);
__webpack_require__(7);
__webpack_require__(9);
__webpack_require__(0);
__webpack_require__(10);
__webpack_require__(11);
__webpack_require__(12);
__webpack_require__(13);
__webpack_require__(2);
__webpack_require__(14);
__webpack_require__(15);
module.exports = __webpack_require__(8);


/***/ })
/******/ ]);
});