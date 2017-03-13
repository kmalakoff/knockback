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

/* WEBPACK VAR INJECTION */(function(global) {/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var _, Backbone;
var window = window != null ? window : global;
const ko = __webpack_require__(23);

const LIFECYCLE_METHODS = ['release', 'destroy', 'dispose'];

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
class kb {
  static initClass() {
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
      let value = null;ko.computed(() => value = callback.apply(callbackTarget, callbackArgs || [])).dispose();return value;
    };
  }

  // Checks if an object has been released.
  // @param [Any] obj the object to release and also release its keys
  static wasReleased(obj) {
    return !obj || obj.__kb_released;
  }

  // Checks if an object can be released. Used to perform minimal nested releasing on objects by checking if self or next level contained items can be released.
  // @param [Any] obj the object to release and also release its keys
  static isReleaseable(obj, depth) {
    if (depth == null) {
      depth = 0;
    }
    if (!obj || obj !== Object(obj) || obj.__kb_released) {
      return false;
    } // must be an object and not already released
    if (ko.isObservable(obj) || obj instanceof kb.ViewModel) {
      return true;
    } // a known type that is releasable
    if (typeof obj === 'function' || kb.isModel(obj) || kb.isCollection(obj)) {
      return false;
    } // a known type that is not releaseable
    for (const method of LIFECYCLE_METHODS) {
      if (typeof obj[method] === 'function') {
        return true;
      }
    } // a releaseable signature
    if (depth > 0) {
      return false;
    } // max depth check for ViewModel inside of ViewModel
    for (const key in obj) {
      const value = obj[key];if (key !== '__kb' && kb.isReleaseable(value, depth + 1)) {
        return true;
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
  static release(obj) {
    let array, index, value;
    if (!kb.isReleaseable(obj)) {
      return;
    }
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
    for (const method of LIFECYCLE_METHODS) {
      if (typeof obj[method] === 'function') {
        return obj[method].call(obj);
      }
    } // a releaseable signature
    if (!ko.isObservable(obj)) {
      return this.releaseKeys(obj);
    } // view model
  }

  // Releases and clears all of the keys on an object using the conventions of release(), destroy(), dispose() without releasing the top level object itself.
  static releaseKeys(obj) {
    for (const key in obj) {
      const value = obj[key];if (key !== '__kb' && kb.isReleaseable(value)) {
        obj[key] = null, kb.release(value);
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
  static releaseOnNodeRemove(view_model, node) {
    view_model || kb._throwUnexpected(this, 'missing view model');
    node || kb._throwUnexpected(this, 'missing node');
    return ko.utils.domNodeDisposal.addDisposeCallback(node, () => kb.release(view_model));
  }

  // Renders a template and binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
  //
  // NOTE: if you provide an afterRender method on the View Model and do not provide afterRender in the options, afterRender will be called with the following signature: afterRender(element) which differs from the Knockout signture of afterRender(elements)
  //
  // @example The easy way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
  //   var el = kb.renderTemplate('my_template', kb.viewModel(new Backbone.Model({name: 'Bob'})));
  //   ...
  //   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)
  static renderTemplate(template, view_model, options) {
    let document;
    if (options == null) {
      options = {};
    }
    if (!(document = window != null ? window.document : undefined)) {
      return typeof console !== 'undefined' && console !== null ? console.log('renderTemplate: document is undefined') : undefined;
    }

    let el = document.createElement('div');
    const observable = ko.renderTemplate(template, view_model, options, el, 'replaceChildren');
    if (el.childNodes.length === 1) {
      // do not return the template wrapper if possible
      el = el.childNodes[0];
    } else if (el.childNodes.length) {
      for (let i = 0, end = el.childNodes.length, asc = end >= 0; asc ? i <= end : i >= end; asc ? i++ : i--) {
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
  static applyBindings(view_model, node) {
    if (node.length) {
      // convert to a root element
      let children;
      [node, children] = Array.from([document.createElement('div'), node]);
      for (const child of children) {
        node.appendChild(child);
      }
    }
    ko.applyBindings(view_model, node);
    kb.releaseOnNodeRemove(view_model, node);
    return node;
  }

  static getValue(model, key, args) {
    if (!model) {
      return;
    }
    if (_.isFunction(model[key]) && (kb.settings.orm != null ? kb.settings.orm.useFunction(model, key) : undefined)) {
      return model[key]();
    }
    if (!args) {
      return model.get(key);
    }
    return model.get(..._.map([key].concat(args), value => kb.peek(value)));
  }

  static setValue(model, key, value) {
    let attributes;
    if (!model) {
      return;
    }
    if (_.isFunction(model[key]) && (kb.settings.orm != null ? kb.settings.orm.useFunction(model, key) : undefined)) {
      return model[key](value);
    }
    (attributes = {})[key] = value;
    return model.set(attributes);
  }

  // ###################################
  // INTERNAL HELPERS
  // ###################################
  // @nodoc
  static _throwMissing(instance, message) {
    throw `${_.isString(instance) ? instance : instance.constructor.name}: ${message} is missing`;
  }

  // @nodoc
  static _throwUnexpected(instance, message) {
    throw `${_.isString(instance) ? instance : instance.constructor.name}: ${message} is unexpected`;
  }

  // @nodoc
  static publishMethods(observable, instance, methods) {
    for (const fn of methods) {
      observable[fn] = kb._.bind(instance[fn], instance);return;
    }
  }

  // @nodoc
  static peek(obs) {
    if (!ko.isObservable(obs)) {
      return obs;if (obs.peek) {
        return obs.peek();return kb.ignore(() => obs());
      }
    }
  }

  // @nodoc
  static isModel(obj) {
    return obj && (obj instanceof kb.Model || typeof obj.get === 'function' && typeof obj.bind === 'function');
  }

  // @nodoc
  static isCollection(obj) {
    return obj && obj instanceof kb.Collection;
  }
}
kb.initClass();

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

module.exports = kb;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

let kb, value;
const { _, ko } = kb = __webpack_require__(0);

const ALL_ORMS = {
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
            console.log(`Knockback configure: could not find orm: ${value}. Available: ${_.keys(ALL_ORMS).join(', ')}`);
            continue;
          }
          if ((orm = ALL_ORMS[value]) && !orm.isAvailable()) {
            console.log(`Knockback configure: could not enable orm ${value}. Make sure it is included before Knockback`);
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

let kb, TypedValue;
const { _, ko } = kb = __webpack_require__(0);

// @nodoc
module.exports = TypedValue = class TypedValue {
  constructor(create_options) {
    this.create_options = create_options;
    this._vo = ko.observable(null); // create a value observable for the first dependency
  }

  destroy() {
    let previous_value;
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

  value() {
    return ko.utils.unwrapObservable(this._vo());
  }
  rawValue() {
    return this.__kb_value;
  }

  valueType(model, key) {
    const new_value = kb.getValue(model, key);
    this.value_type || this._updateValueObservable(new_value); // create so we can check the type
    return this.value_type;
  }

  update(new_value) {
    if (this.__kb_released) {
      return;
    } // destroyed, nothing to do

    // determine the new type
    new_value !== undefined || (new_value = null); // ensure null instead of undefined
    const new_type = kb.utils.valueType(new_value);

    if (this.__kb_value != null ? this.__kb_value.__kb_released : undefined) {
      this.__kb_value = this.value_type = undefined;
    }
    const value = this.__kb_value;

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

  _updateValueObservable(new_value, new_observable) {
    let previous_value, value;
    const { create_options } = this;
    let creator = kb.utils.inferCreator(new_value, create_options.factory, create_options.path);

    // retain previous type
    if (new_value === null && !creator) {
      if (this.value_type === kb.TYPE_MODEL) {
        creator = kb.ViewModel;
      } else if (this.value_type === kb.TYPE_COLLECTION) {
        creator = kb.CollectionObservable;
      }
    }
    create_options.creator = creator;

    let value_type = kb.TYPE_UNKNOWN;
    [previous_value, this.__kb_value] = Array.from([this.__kb_value, undefined]);

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

  _inferType(value) {}
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

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
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 4 */
/***/ (function(module, exports) {



/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let kb;
const { _, ko } = kb = __webpack_require__(0);
const extend = __webpack_require__(4);

const COMPARE_EQUAL = 0;
const COMPARE_ASCENDING = -1;
const COMPARE_DESCENDING = 1;

const KEYS_PUBLISH = ['destroy', 'shareOptions', 'filters', 'comparator', 'sortAttribute', 'viewModelByModel', 'hasViewModels'];

kb.compare = function (value_a, value_b) {
  // String compare
  if (_.isString(value_a)) {
    return value_a.localeCompare(`${value_b}`);
  }
  if (_.isString(value_b)) {
    return value_b.localeCompare(`${value_a}`);
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
kb.CollectionObservable = class CollectionObservable {
  static initClass() {
    // @nodoc
    this.extend = extend;
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
  constructor(collection, view_model, options) {
    this._onCollectionChange = this._onCollectionChange.bind(this);const args = Array.prototype.slice.call(_.isArguments(collection) ? collection : arguments);return kb.ignore(() => {
      collection = args[0] instanceof kb.Collection ? args.shift() : _.isArray(args[0]) ? new kb.Collection(args.shift()) : new kb.Collection();
      if (_.isFunction(args[0])) {
        args[0] = { view_model: args[0] };
      }
      options = {};for (const arg of args) {
        _.extend(options, arg);
      }
      let observable = kb.utils.wrappedObservable(this, ko.observableArray([]));
      observable.__kb_is_co = true; // mark as a kb.CollectionObservable
      this.in_edit = 0;

      // bind callbacks
      if (!this.__kb) {
        this.__kb = {};
      }

      // options
      options = kb.utils.collapseOptions(options);
      if (options.auto_compact) {
        this.auto_compact = true;
      }
      if (options.sort_attribute) {
        this._comparator = ko.observable(this._attributeComparator(options.sort_attribute));
      } else {
        this._comparator = ko.observable(options.comparator);
      }
      if (options.filters) {
        this._filters = ko.observableArray((() => {
          if (_.isArray(options.filters)) {
            return options.filters;
          } else if (options.filters) {
            return [options.filters];
          }
        })());
      } else {
        this._filters = ko.observableArray([]);
      }
      const create_options = this.create_options = { store: kb.Store.useOptionsOrCreate(options, collection, observable) }; // create options
      kb.utils.wrappedObject(observable, collection);

      // view model factory create factories
      this.path = options.path;
      create_options.factory = kb.utils.wrappedFactory(observable, this._shareOrCreateFactory(options));
      create_options.path = kb.utils.pathJoin(options.path, 'models');

      // check for models only
      create_options.creator = create_options.factory.creatorForPath(null, create_options.path);
      if (create_options.creator) {
        this.models_only = create_options.creator.models_only;
      }

      // publish public interface on the observable and return instead of this
      kb.publishMethods(observable, this, KEYS_PUBLISH);

      // start the processing
      this._collection = ko.observable(collection);
      observable.collection = this.collection = ko.computed({
        read: () => this._collection(),
        write: new_collection => kb.ignore(() => {
          let previous_collection;
          if ((previous_collection = this._collection()) === new_collection) {
            return;
          } // no change
          // @create_options.store.reuse(@, new_collection) # not meant to be shared
          kb.utils.wrappedObject(observable, new_collection);

          // clean up
          if (previous_collection) {
            previous_collection.unbind('all', this._onCollectionChange);
          }

          // store in _kb_collection so that a collection() function can be exposed on the observable and so the collection can be
          if (new_collection) {
            new_collection.bind('all', this._onCollectionChange);
          }

          // update references (including notification)
          return this._collection(new_collection);
        })
      });
      if (collection) {
        collection.bind('all', this._onCollectionChange);
      } // bind now

      // observable that will re-trigger when sort or filters or collection changes
      this._mapper = ko.computed(() => {
        let filter, models, view_models;
        const comparator = this._comparator(); // create dependency
        const filters = this._filters(); // create dependency
        if (filters) {
          (() => {
            const result = [];
            for (filter of filters) {
              result.push(ko.utils.unwrapObservable(filter));
            }
            return result;
          })();
        } // create a dependency
        const current_collection = this._collection(); // create dependency
        if (this.in_edit) {
          return;
        } // we are doing the editing

        // no models
        observable = kb.utils.wrappedObservable(this);
        const previous_view_models = kb.peek(observable);
        if (current_collection) {
          ({ models } = current_collection);
        }
        if (!models || current_collection.models.length === 0) {
          view_models = [];

          // process filters, sorting, etc
        } else {
          // apply filters
          models = _.filter(models, model => !filters.length || this._selectModel(model));

          // apply sorting
          if (comparator) {
            view_models = _.map(models, model => this._createViewModel(model)).sort(comparator);

            // no sorting
          } else if (this.models_only) {
            view_models = filters.length ? models : models.slice(); // clone the array if it wasn't filtered
          } else {
            view_models = _.map(models, model => this._createViewModel(model));
          }
        }

        // update the observable array for this collection observable
        this.in_edit++;
        observable(view_models);
        this.in_edit--;

        // TODO: release previous
        // unless @models_only
        //   create_options.store.release(view_model) for view_model in previous_view_models
      });

      // start subscribing
      observable.subscribe(_.bind(this._onObservableArrayChange, this));

      !kb.statistics || kb.statistics.register('CollectionObservable', this); // collect memory management statistics

      return observable;
    });
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy() {
    this.__kb_released = true;
    const observable = kb.utils.wrappedObservable(this);
    const collection = kb.peek(this._collection);kb.utils.wrappedObject(observable, null);
    if (collection) {
      collection.unbind('all', this._onCollectionChange);
      const array = kb.peek(observable);array.splice(0, array.length); // clear the view models or models
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
  shareOptions() {
    const observable = kb.utils.wrappedObservable(this);
    return { store: kb.utils.wrappedStore(observable), factory: kb.utils.wrappedFactory(observable) };
  }

  // Setter for the filters array for excluding models in the collection observable.
  //
  // @param [Id|Function|Array] filters filters can be individual ids (observable or simple) or arrays of ids, functions, or arrays of functions.
  //
  // @example
  //    // exclude a single model by id
  //    collection_observable.filters(model.id);
  filters(filters) {
    if (filters) {
      return this._filters(_.isArray(filters) ? filters : [filters]);
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
  comparator(comparator) {
    return this._comparator(comparator);
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
  sortAttribute(sort_attribute) {
    return this._comparator(sort_attribute ? this._attributeComparator(sort_attribute) : null);
  }

  // Reverse lookup for a view model by model. If created with models_only option, will return null.
  viewModelByModel(model) {
    if (this.models_only) {
      return null;
    }
    const id_attribute = model.hasOwnProperty(model.idAttribute) ? model.idAttribute : 'cid';
    return _.find(kb.peek(kb.utils.wrappedObservable(this)), test => __guard__(test != null ? test.__kb : undefined, x => x.object) ? test.__kb.object[id_attribute] === model[id_attribute] : false);
  }

  // Will return true unless created with models_only option.
  //
  // @example
  //   var todos1 = new kb.CollectionObservable(new Backbone.Collection(), {models_only: true});
  //   todos1.hasViewModels();     // false
  //   var todos2 = new kb.CollectionObservable(new Backbone.Collection());
  //   todos2.hasViewModels();     // true
  hasViewModels() {
    return !this.models_only;
  }

  // Compacts the Collection Observable to use the least amount of memory. Currently, this is brute force meaning it releases than regenerates all view models when called.
  //
  compact() {
    return kb.ignore(() => {
      const observable = kb.utils.wrappedObservable(this);
      if (!kb.utils.wrappedStoreIsOwned(observable)) {
        return;
      }
      kb.utils.wrappedStore(observable).clear();
      return this._collection.notifySubscribers(this._collection());
    });
  }

  // ###################################################
  // Internal
  // ###################################################

  // @nodoc
  _shareOrCreateFactory(options) {
    let factory;
    const absolute_models_path = kb.utils.pathJoin(options.path, 'models');
    const { factories } = options;

    // check the existing factory
    if (factory = options.factory) {
      // models matches, check additional paths
      let existing_creator;
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
  _onCollectionChange(event, arg) {
    return kb.ignore(() => {
      let comparator, view_model;
      if (this.in_edit || kb.wasReleased(this)) {
        return;
      } // we are doing the editing or have been released

      switch (event) {
        case 'reset':
          if (this.auto_compact) {
            this.compact();
          } else {
            this._collection.notifySubscribers(this._collection());
          }
          break;
        case 'sort':case 'resort':
          this._collection.notifySubscribers(this._collection());
          break;

        case 'new':case 'add':
          if (!this._selectModel(arg)) {
            return;
          } // filtered

          const observable = kb.utils.wrappedObservable(this);
          const collection = this._collection();
          if (collection.indexOf(arg) === -1) {
            return;
          } // the model may have been removed before we got a chance to add it
          if (view_model = this.viewModelByModel(arg)) {
            return;
          } // it may have already been added by a change event
          this.in_edit++;
          if (comparator = this._comparator()) {
            observable().push(this._createViewModel(arg));
            observable.sort(comparator);
          } else {
            observable.splice(collection.indexOf(arg), 0, this._createViewModel(arg));
          }
          this.in_edit--;
          break;

        case 'remove':case 'destroy':
          this._onModelRemove(arg);break;
        case 'change':
          // filtered, remove
          if (!this._selectModel(arg)) {
            return this._onModelRemove(arg);
          }

          view_model = this.models_only ? arg : this.viewModelByModel(arg);
          if (!view_model) {
            return this._onCollectionChange('add', arg);
          } // add new
          if (!(comparator = this._comparator())) {
            return;
          }

          this.in_edit++;
          kb.utils.wrappedObservable(this).sort(comparator);
          this.in_edit--;
          break;
      }
    });
  }

  // @nodoc
  _onModelRemove(model) {
    const view_model = this.models_only ? model : this.viewModelByModel(model); // either remove a view model or a model
    if (!view_model) {
      return;
    } // it may have already been removed
    const observable = kb.utils.wrappedObservable(this);
    this.in_edit++;
    observable.remove(view_model);
    return this.in_edit--;
  }

  // @nodoc
  _onObservableArrayChange(models_or_view_models) {
    return kb.ignore(() => {
      let models;
      if (this.in_edit) {
        return;
      } // we are doing the editing

      // validate input
      this.models_only && (!models_or_view_models.length || kb.isModel(models_or_view_models[0])) || !this.models_only && (!models_or_view_models.length || _.isObject(models_or_view_models[0]) && !kb.isModel(models_or_view_models[0])) || kb._throwUnexpected(this, 'incorrect type passed');

      const observable = kb.utils.wrappedObservable(this);
      const collection = kb.peek(this._collection);
      const has_filters = kb.peek(this._filters).length;
      if (!collection) {
        return;
      } // no collection or we are updating ourselves

      let view_models = models_or_view_models;

      // set Models
      if (this.models_only) {
        models = _.filter(models_or_view_models, model => !has_filters || this._selectModel(model));

        // set ViewModels
      } else {
        !has_filters || (view_models = []); // check for filtering of ViewModels
        models = [];
        for (const view_model of models_or_view_models) {
          var current_view_model;
          const model = kb.utils.wrappedObject(view_model);
          if (has_filters) {
            if (!this._selectModel(model)) {
              continue;
            } // filtered so skip
            view_models.push(view_model);
          }

          // check for view models being different (will occur if a ko select selectedOptions is bound to this collection observable) -> update our store
          if (current_view_model = this.create_options.store.find(model, this.create_options.creator)) {
            current_view_model.constructor === view_model.constructor || kb._throwUnexpected(this, 'replacing different type of view model');
          }
          this.create_options.store.retain(view_model, model, this.create_options.creator);
          models.push(model);
        }
      }

      // a change, update models
      this.in_edit++;
      models_or_view_models.length === view_models.length || observable(view_models); // replace the ViewModels because they were filtered
      _.isEqual(collection.models, models) || collection.reset(models);
      this.in_edit--;
    });
  }

  // @nodoc
  _attributeComparator(sort_attribute) {
    const modelAttributeCompare = function (model_a, model_b) {
      const attribute_name = ko.utils.unwrapObservable(sort_attribute);
      return kb.compare(model_a.get(attribute_name), model_b.get(attribute_name));
    };
    return this.models_only ? modelAttributeCompare : (model_a, model_b) => modelAttributeCompare(kb.utils.wrappedModel(model_a), kb.utils.wrappedModel(model_b));
  }

  // @nodoc
  _createViewModel(model) {
    if (this.models_only) {
      return model;
    }
    return this.create_options.store.retainOrCreate(model, this.create_options);
  }

  // @nodoc
  _selectModel(model) {
    const filters = kb.peek(this._filters);
    for (let filter of filters) {
      filter = kb.peek(filter);
      if (_.isFunction(filter)) {
        if (!filter(model)) {
          return false;
        }
      } else if (_.isArray(filter)) {
        if (!filter.includes(model.id)) {
          return false;
        }
      } else if (model.id !== filter) {
        return false;
      }
    }
    return true;
  }
};
undefined.initClass();

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

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let kb;
const { _, ko } = kb = __webpack_require__(0);

// Used to provide a central place to aggregate registered Model events rather than having all kb.Observables register for updates independently.
//
kb.EventWatcher = class EventWatcher {

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
  static useOptionsOrCreate(options, emitter, obj, callback_options) {
    if (options.event_watcher) {
      if (options.event_watcher.emitter() !== emitter && options.event_watcher.model_ref !== emitter) {
        kb._throwUnexpected(this, 'emitter not matching');
      }
      return kb.utils.wrappedEventWatcher(obj, options.event_watcher).registerCallbacks(obj, callback_options);
    }
    kb.utils.wrappedEventWatcherIsOwned(obj, true);
    return kb.utils.wrappedEventWatcher(obj, new kb.EventWatcher(emitter)).registerCallbacks(obj, callback_options);
  }

  constructor(emitter, obj, callback_options) {
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

  // Required clean up function to break cycles, release view emitters, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy() {
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
  emitter(new_emitter) {
    // get or no change
    if (arguments.length === 0 || this.ee === new_emitter) {
      return this.ee;
    }

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
  registerCallbacks(obj, callback_info) {
    obj || kb._throwMissing(this, 'obj');
    callback_info || kb._throwMissing(this, 'callback_info');
    const event_names = callback_info.event_selector ? callback_info.event_selector.split(' ') : ['change'];
    const model = this.ee;

    for (const event_name of event_names) {
      if (!event_name) {
        continue;
      } // extra spaces
      (event_name => {
        let callbacks, info;
        if (!(callbacks = this.__kb.callbacks[event_name])) {
          callbacks = this.__kb.callbacks[event_name] = {
            model: null,
            list: [],
            fn: model => {
              for (info of callbacks.list) {
                if (!info.update) {
                  continue;
                }
                if (model && info.key && model.hasChanged && !model.hasChanged(ko.utils.unwrapObservable(info.key))) {
                  continue;
                } // key doesn't match
                !kb.statistics || kb.statistics.addModelEvent({ name: event_name, model, key: info.key, path: info.path });
                info.update();
              } // trigger update
              return null;
            }
          };
        }

        callbacks.list.push(info = _.defaults({ obj }, callback_info)); // store the callback information
        if (model) {
          return this._onModelLoaded(model);
        }
      })(event_name);
    }
    return this;
  }

  releaseCallbacks(obj) {
    let callbacks;
    this.ee = null;
    for (const event_name in this.__kb.callbacks) {
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
  _onModelLoaded(model) {
    this.ee = model;
    for (const event_name in this.__kb.callbacks) {
      // bind all events
      const callbacks = this.__kb.callbacks[event_name];
      if (callbacks.model && callbacks.model !== model) {
        this._unbindCallbacks(event_name, callbacks, true);
      }

      if (!callbacks.model) {
        callbacks.model = model, model.bind(event_name, callbacks.fn);
      }
      for (const info of callbacks.list) {
        if (!info.unbind_fn) {
          info.unbind_fn = kb.settings.orm != null ? kb.settings.orm.bind(model, info.key, info.update, info.path) : undefined;
        }
        info.emitter ? info.emitter(model) : undefined;
      }
    }
  }

  // @nodoc
  _onModelUnloaded(model) {
    if (this.ee !== model) {
      return;
    }
    this.ee = null;
    for (const event_name in this.__kb.callbacks) {
      const callbacks = this.__kb.callbacks[event_name];this._unbindCallbacks(event_name, callbacks);
    } // unbind all events
  }

  // @nodoc
  _unbindCallbacks(event_name, callbacks, skip_emitter) {
    if (callbacks.model) {
      callbacks.model.unbind(event_name, callbacks.fn), callbacks.model = null;
    }
    for (const info of callbacks.list) {
      if (info.unbind_fn) {
        info.unbind_fn(), info.unbind_fn = null;
      }
      if (info.emitter && !skip_emitter && !kb.wasReleased(info.obj)) {
        info.emitter(null);
      }
    }
  }
};

// factory function
kb.emitterObservable = (emitter, observable) => new kb.EventWatcher(emitter, observable);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let kb;
const { _ } = kb = __webpack_require__(0);

// Used to share the hierachy of constructors and create functions by path to allow for custom creation per Model attribute.
//
// @example Create an instance by path.
//   var factory = new kb.Factory();
//   factory.addPathMapping('bob.the.builder', kb.ViewModel);
//   view_model = factory.createForPath(new Backbone.Model({name: 'Bob'}), 'bob.the.builder'); // creates kb.ViewModel
kb.Factory = class Factory {

  // Used to either register yourself with the existing factory or to create a new factory.
  //
  // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
  // @option options [Object] factories a map of dot-deliminated paths; for example 'models.owner': kb.ViewModel to either constructors or create functions. Signature: 'some.path': function(object, options)
  // @param [Instance] obj the instance that will own or register with the store
  // @param [String] owner_path the path to the owning object for turning relative scoping of the factories to absolute paths.
  static useOptionsOrCreate(options, obj, owner_path) {
    // share
    if (options.factory && (!options.factories || options.factories && options.factory.hasPathMappings(options.factories, owner_path))) {
      return kb.utils.wrappedFactory(obj, options.factory);
    }

    // create a new factory
    const factory = kb.utils.wrappedFactory(obj, new kb.Factory(options.factory));
    if (options.factories) {
      factory.addPathMappings(options.factories, owner_path);
    }
    return factory;
  }

  constructor(parent_factory) {
    this.paths = {};if (parent_factory) {
      this.parent_factory = parent_factory;
    }
  }

  hasPath(path) {
    return this.paths.hasOwnProperty(path) || (this.parent_factory != null ? this.parent_factory.hasPath(path) : undefined);
  }

  addPathMapping(path, create_info) {
    return this.paths[path] = create_info;
  }

  addPathMappings(factories, owner_path) {
    for (const path in factories) {
      const create_info = factories[path];this.paths[kb.utils.pathJoin(owner_path, path)] = create_info;
    }
  }

  hasPathMappings(factories, owner_path) {
    let all_exist = true;
    for (const path in factories) {
      var existing_creator;
      const creator = factories[path];
      all_exist &= (existing_creator = this.creatorForPath(null, kb.utils.pathJoin(owner_path, path))) && creator === existing_creator;
    }
    return all_exist;
  }

  // If possible, creates an observable for an object using a dot-deliminated path.
  //
  // @example Create an instance by path.
  //   var factory = new kb.Factory();
  //   factory.addPathMapping('bob.the.builder', kb.ViewModel);
  //   view_model = factory.createForPath(new Backbone.Model({name: 'Bob'}), 'bob.the.builder'); // creates kb.ViewModel
  creatorForPath(obj, path) {
    let creator;
    if (creator = this.paths[path]) {
      return creator.view_model ? creator.view_model : creator;
    }
    if (creator = this.parent_factory != null ? this.parent_factory.creatorForPath(obj, path) : undefined) {
      return creator;
    }
    return null;
  }
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let kb;
module.exports = kb = __webpack_require__(0);

kb.configure = __webpack_require__(1);

// re-expose modules
kb.modules = { underscore: kb._, backbone: kb.Parse || kb.Backbone, knockout: kb.ko };

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let kb;
var window = window != null ? window : global;

const { _, ko } = kb = __webpack_require__(0);

kb.RECUSIVE_AUTO_INJECT = true;

// custom Knockout `inject` binding
ko.bindingHandlers.inject = {
  init(element, value_accessor, all_bindings_accessor, view_model) {
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
kb.Inject = class Inject {
  // @private
  static inject(data, view_model, element, value_accessor, all_bindings_accessor, nested) {
    const inject = function (data) {
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
        for (const key in data) {
          const value = data[key];
          if (key === 'view_model') {
            continue;
          }

          // create function
          if (key === 'create') {
            value(view_model, element, value_accessor, all_bindings_accessor);

            // resolve nested with assign or not
          } else if (_.isObject(value) && !_.isFunction(value)) {
            const target = nested || value && value.create ? {} : view_model;
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
    return nested ? inject(data) : kb.ignore(() => inject(data));
  }

  // Searches the DOM from root or document for elements with the `'kb-inject'` attribute and create/customizes ViewModels for the DOM tree when encountered. Also, used with the data-bind `'inject'` custom binding.
  // @param [DOM element] root the root DOM element to start searching for `'kb-inject'` attributes.
  // @return [Array] array of Objects with the DOM elements and ViewModels that were bound in the form `{el: DOM element, view_model: ViewModel}`.
  static injectViewModels(root) {
    // find all of the app elements
    const results = [];
    var findElements = function (el) {
      if (!el.__kb_injected) {
        // already injected -> skip, but still process children in case they were added afterwards
        let attr;
        if (el.attributes && (attr = _.find(el.attributes, attr => attr.name === 'kb-inject'))) {
          el.__kb_injected = true; // mark injected
          results.push({ el, view_model: {}, binding: attr.value });
        }
      }
      for (const child_el of el.childNodes) {
        findElements(child_el);
      }
    };
    if (!root && (window != null ? window.document : undefined)) {
      root = window.document;
    }
    findElements(root);

    // bind the view models
    for (const app of results) {
      // evaluate the app data
      var afterBinding, beforeBinding, expression, options;
      if (expression = app.binding) {
        expression.search(/[:]/) < 0 || (expression = `{${expression}}`); // wrap if is an object
        let data = new Function('', `return ( ${expression} )`)();
        data || (data = {}); // no data
        !data.options || (({ options } = data), delete data.options); // extract options
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
    }
    return results;
  }
};

// auto-inject recursively
const _ko_applyBindings = ko.applyBindings;
ko.applyBindings = function (context, element) {
  const results = kb.RECUSIVE_AUTO_INJECT ? kb.injectViewModels(element) : [];
  if (!results.length) {
    return _ko_applyBindings.apply(this, arguments);
  }
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
  let onReady;
  (onReady = function () {
    if (document.readyState !== 'complete') {
      return setTimeout(onReady, 0);
    } // keep waiting for the document to load
    return kb.injectViewModels(); // the document is loaded
  })();
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let kb;
const { ko } = kb = __webpack_require__(0);

// Allow for dependent release until is resolved https://github.com/knockout/knockout/issues/1464
if (__guard__(ko.subscribable != null ? ko.subscribable.fn : undefined, x => x.extend)) {
  const _extend = ko.subscribable.fn.extend;
  ko.subscribable.fn.extend = function () {
    const target = _extend.apply(this, arguments);

    // release the extended observable
    if (target !== this && kb.isReleaseable(this)) {
      const _dispose = target.dispose;
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

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let kb;
const { _, ko } = kb = __webpack_require__(0);
const TypedValue = __webpack_require__(2);

const KEYS_PUBLISH = ['value', 'valueType', 'destroy'];
const KEYS_INFO = ['args', 'read', 'write'];

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
kb.Observable = class Observable {

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
  constructor(model, key_or_info, options, _vm) {
    if (_vm == null) {
      _vm = {};
    }this._vm = _vm;return kb.ignore(() => {
      let _model, args;
      key_or_info || kb._throwMissing(this, 'key_or_info');
      this.key = key_or_info.key || key_or_info;
      for (const key of KEYS_INFO) {
        if (key_or_info[key]) {
          this[key] = key_or_info[key];
        }
      }

      const create_options = kb.utils.collapseOptions(options);
      const { event_watcher } = create_options;
      delete create_options.event_watcher;

      // set up basics
      this._value = new TypedValue(create_options);
      this._model = ko.observable();
      let observable = kb.utils.wrappedObservable(this, ko.computed({
        read: () => {
          _model = this._model();for (const arg of args = [this.key].concat(this.args || [])) {
            ko.utils.unwrapObservable(arg);
          }
          __guard__(kb.utils.wrappedEventWatcher(this), x => x.emitter(_model || null)); // update the event watcher
          if (this.read) {
            this.update(this.read.apply(this._vm, args));
          } else if (!_.isUndefined(_model)) {
            kb.ignore(() => this.update(kb.getValue(_model, kb.peek(this.key), this.args)));
          }
          return this._value.value();
        },

        write: new_value => kb.ignore(() => {
          const unwrapped_new_value = kb.utils.unwrapModels(new_value); // unwrap for set (knockout may pass view models which are required for the observable but not the model)
          _model = kb.peek(this._model);
          if (this.write) {
            this.write.call(this._vm, unwrapped_new_value);
            new_value = kb.getValue(_model, kb.peek(this.key), this.args);
          } else if (_model) {
            kb.setValue(_model, kb.peek(this.key), unwrapped_new_value);
          }
          return this.update(new_value);
        }),

        owner: this._vm
      }));

      observable.__kb_is_o = true; // mark as a kb.Observable
      create_options.store = kb.utils.wrappedStore(observable, create_options.store);
      create_options.path = kb.utils.pathJoin(create_options.path, this.key);
      if (create_options.factories && (typeof create_options.factories === 'function' || create_options.factories.create)) {
        create_options.factory = kb.utils.wrappedFactory(observable, new kb.Factory(create_options.factory));
        create_options.factory.addPathMapping(create_options.path, create_options.factories);
      } else {
        create_options.factory = kb.Factory.useOptionsOrCreate(create_options, observable, create_options.path);
      }
      delete create_options.factories;

      // publish public interface on the observable and return instead of this
      kb.publishMethods(observable, this, KEYS_PUBLISH);

      // use external model observable or create
      observable.model = this.model = ko.computed({
        read: () => ko.utils.unwrapObservable(this._model),
        write: new_model => kb.ignore(() => {
          if (this.__kb_released || kb.peek(this._model) === new_model) {
            return;
          } // destroyed or no change

          // update references
          const new_value = kb.getValue(new_model, kb.peek(this.key), this.args);
          this._model(new_model);
          if (!new_model) {
            return this.update(null);
          } else if (!_.isUndefined(new_value)) {
            return this.update(new_value);
          }
        })
      });
      kb.EventWatcher.useOptionsOrCreate({ event_watcher }, model || null, this, { emitter: this.model, update: () => kb.ignore(() => this.update()), key: this.key, path: create_options.path });
      this._value.rawValue() || this._value.update(); // wasn't loaded so create

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
  destroy() {
    const observable = kb.utils.wrappedObservable(this);
    this.__kb_released = true;
    this._value.destroy();this._value = null;
    this.model.dispose();this.model = observable.model = null;
    return kb.utils.wrappedDestroy(this);
  }

  // @return [kb.CollectionObservable|kb.ViewModel|ko.observable] exposes the raw value inside the kb.observable. For example, if your attribute is a Collection, it will hold a CollectionObservable.
  value() {
    return this._value.rawValue();
  }

  // @return [kb.TYPE_UNKNOWN|kb.TYPE_SIMPLE|kb.TYPE_ARRAY|kb.TYPE_MODEL|kb.TYPE_COLLECTION] provides the type of the wrapped value.
  valueType() {
    return this._value.valueType(kb.peek(this._model), kb.peek(this.key));
  }

  // ###################################################
  // Internal
  // ###################################################
  // @nodoc
  update(new_value) {
    if (this.__kb_released) {
      return;
    } // destroyed, nothing to do
    if (!arguments.length) {
      new_value = kb.getValue(kb.peek(this._model), kb.peek(this.key));
    }
    return this._value.update(new_value);
  }
};

kb.observable = (model, key, options, view_model) => new kb.Observable(model, key, options, view_model);

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let kb;
const { _ } = kb = __webpack_require__(0);

// kb.Statistics is an optional components that is useful for measuring your application's performance. You can record all of the Backbone.Events that have triggered ko.observable subscription updates and the memory footprint (instance count-only) of your ViewModels and collection observables.
//
// kb.Statistics is not included in `knockback.js` nor `knockback-core.js` so you need to manually include it from the `lib` directory.
//
module.exports = kb.Statistics = class Statistics {
  constructor() {
    this.model_events_tracker = [];
    this.registered_tracker = {};
  }

  // Clear the tracked model events (but keep the registered objects intact)
  clear() {
    return this.model_events_tracker = [];
  }

  // ##############################
  // Registered Events
  // ##############################

  // Register a model event
  addModelEvent(event) {
    return this.model_events_tracker.push(event);
  }

  // A debug helper to summarize the registered events in human-readable form
  modelEventsStatsString() {
    let stats_string = '';
    stats_string += `Total Count: ${this.model_events_tracker.length}`;
    const event_groups = _.groupBy(this.model_events_tracker, test => `event name: '${test.name}', attribute name: '${test.key}'`);
    for (const key in event_groups) {
      const value = event_groups[key];
      stats_string += `\n ${key}, count: ${value.length}`;
    }
    return stats_string;
  }

  // ##############################
  // Registered Observables and View Models
  // ##############################

  // Register an object by key
  register(key, obj) {
    return this.registeredTracker(key).push(obj);
  }

  // Unregister an object by key
  unregister(key, obj) {
    let index;
    const type_tracker = this.registeredTracker(key);
    if ((index = _.indexOf(type_tracker, obj)) < 0) {
      return typeof console !== 'undefined' && console !== null ? console.log(`kb.Statistics: failed to unregister type: ${key}`) : undefined;
    }
    return type_tracker.splice(index, 1);
  }

  // @return [Integer] the number of registered objects by type
  registeredCount(type) {
    if (type) {
      return this.registeredTracker(type).length;
    }
    let count = 0;
    for (type in this.registered_tracker[type]) {
      const type_tracker = this.registered_tracker[type][type];count += type_tracker.length;
    }
    return count;
  }

  // A debug helper to summarize the current registered objects by key
  //
  // @param [String] success_message a message to return if there are no registered objects
  // @return [String] a human readable string summarizing the currently registered objects or success_message
  registeredStatsString(success_message) {
    let stats_string = '';
    for (const type in this.registered_tracker) {
      const type_tracker = this.registered_tracker[type];
      if (!type_tracker.length) {
        continue;
      }
      if (written) {
        stats_string += '\n ';
      }
      stats_string += `${type || 'No Name'}: ${type_tracker.length}`;
      var written = true;
    }
    return stats_string || success_message;
  }

  // @nodoc
  registeredTracker(key) {
    if (this.registered_tracker.hasOwnProperty(key)) {
      return this.registered_tracker[key];
    }
    const type_tracker = [];this.registered_tracker[key] = type_tracker;
    return type_tracker;
  }

  static eventsStats(obj, key) {
    const stats = { count: 0 };

    const events = obj._events || obj._callbacks || {};
    for (key of key ? [key] : _.keys(events)) {
      var node;
      if (node = events[key]) {
        if (_.isArray(node)) {
          stats[key] = _.compact(node).length;
        } else {
          stats[key] = 0;const { tail } = node;
          while ((node = node.next) !== tail) {
            stats[key]++;
          }
        }
        stats.count += stats[key];
      }
    }
    return stats;
  }
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let kb;
const { _, ko } = kb = __webpack_require__(0);

// Used to share and manage the persistence of ViewModels and observables. ks.Store can be used to break relationship cycles between models, to reduce memory usage, and to share view models between kb.CollectionObservables (for example, when using Knockout.js selectedOptions).
//
// @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
//   var co = kb.collectionObservable(new Backbone.Collection());
//   var co_selected_options = kb.collectionObservable(new Backbone.Collection(), {
//     store: kb.utils.wrappedStore(co)
//   });
module.exports = __initClass__(kb.Store = class Store {
  static initClass() {
    // @nodoc
    this.instances = [];
  }

  // Used to either register yourself with the existing store or to create a new store.
  //
  // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
  // @param [Instance] obj the instance that will own or register with the store
  // @param [ko.observable] observable the observable that will own the store
  // @example
  //   kb.Store.useOptionsOrCreate(model, this, options);
  static useOptionsOrCreate(options, obj, observable) {
    if (!options.store) {
      kb.utils.wrappedStoreIsOwned(observable, true);
    }
    const store = kb.utils.wrappedStore(observable, options.store || new kb.Store());
    store.retain(observable, obj, options.creator);
    return store;
  }

  // Used to create a new kb.Store.
  constructor() {
    this.observable_records = {};
    this.replaced_observables = [];
    kb.Store.instances.push(this);
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy() {
    let index;
    this.__kb_released = true;
    this.clear();
    if ((index = _.indexOf(kb.Store.instances, this)) >= 0) {
      return kb.Store.instances.splice(index, 1);
    }
  }

  // Manually clear the store
  clear() {
    let observable, observable_records, replaced_observables;
    [observable_records, this.observable_records] = Array.from([this.observable_records, {}]);
    for (const creator_id in observable_records) {
      const records = observable_records[creator_id];
      for (const cid in records) {
        observable = records[cid];this.release(observable, true);
      }
    }

    [replaced_observables, this.replaced_observables] = Array.from([this.replaced_observables, []]);
    for (observable of replaced_observables) {
      if (!observable.__kb_released) {
        this.release(observable, true);
      }
    }
  }

  // Manually compact the store by searching for released view models
  compact() {
    for (const creator_id in this.observable_records) {
      const records = this.observable_records[creator_id];
      for (const cid in records) {
        const observable = records[cid];if (observable.__kb_released) {
          delete records[cid];
        }
      }
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
  retain(observable, obj, creator) {
    let current_observable;
    if (!this._canRegister(observable)) {
      return;
    }
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
  retainOrCreate(obj, options, deep_retain) {
    let creator, observable;
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
      throw new Error(`Invalid factory for \"${options.path}\"`);
    }

    observable = kb.ignore(() => {
      options = _.defaults({ store: this, creator }, options); // set our own creator so we can register ourselves above
      observable = creator.create ? creator.create(obj, options) : new creator(obj, options);
      return observable || ko.observable(null);
    }); // default to null

    this.retain(observable, obj, creator);
    return observable;
  }

  // @nodoc
  reuse(observable, obj) {
    let current_obj, current_observable;
    if ((current_obj = kb.utils.wrappedObject(observable)) === obj) {
      return;
    }
    if (!this._canRegister(observable)) {
      throw new Error('Cannot reuse a simple observable');
    }
    if (this._refCount(observable) !== 1) {
      throw new Error(`Trying to change a shared view model. Ref count: ${this._refCount(observable)}`);
    }

    const creator = kb.utils.wrappedCreator(observable) || observable.constructor; // default is to use the constructor
    if (!_.isUndefined(current_obj)) {
      current_observable = this.find(current_obj, creator);
    }
    this.retain(observable, obj, creator);
    if (current_observable) {
      this.release(current_observable);
    }
  }

  // Release a reference to a a ViewModel in this store.
  release(observable, force) {
    let store_references;
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

  // @nodoc
  find(obj, creator) {
    let observable, records;
    if (!(records = this.observable_records[this._creatorId(creator)])) {
      return null;
    }
    if (__guard__(observable = records[this._cid(obj)], x => x.__kb_released)) {
      delete records[this._cid(obj)];
      return null;
    }
    return observable;
  }

  // @nodoc
  _refCount(observable) {
    let stores_references;
    if (observable.__kb_released) {
      if (typeof console !== 'undefined' && console !== null) {
        console.log('Observable already released');
      }
      return 0;
    }
    if (!(stores_references = kb.utils.get(observable, 'stores_references'))) {
      return 1;
    }
    return _.reduce(stores_references, (memo, store_references) => memo + store_references.ref_count, 0);
  }

  // @nodoc
  _canRegister(observable) {
    return observable && !ko.isObservable(observable) && !observable.__kb_is_co;
  } // only register view models not basic ko.observables nor kb.CollectionObservables

  // @nodoc
  _cid(obj) {
    let cid;
    return cid = obj ? obj.cid || (obj.cid = _.uniqueId('c')) : 'null';
  }

  // @nodoc
  _creatorId(creator) {
    const create = creator.create || creator;
    if (!create.__kb_cids) {
      create.__kb_cids = [];
    }
    for (var item of create.__kb_cids) {
      if (item.create === create) {
        return item.cid;
      }
    }
    create.__kb_cids.push(item = { create, cid: _.uniqueId('kb') });return item.cid;
  }

  // @nodoc
  _storeReferences(observable) {
    let stores_references;
    if (!(stores_references = kb.utils.get(observable, 'stores_references'))) {
      return;
    }
    return _.find(stores_references, store_references => store_references.store === this);
  }

  // @nodoc
  _getOrCreateStoreReferences(observable) {
    let store_references;
    const stores_references = kb.utils.orSet(observable, 'stores_references', []);
    if (!(store_references = _.find(stores_references, store_references => store_references.store === this))) {
      stores_references.push(store_references = { store: this, ref_count: 0, release: () => this.release(observable) });
    }
    return store_references;
  }

  // @nodoc
  _clearStoreReferences(observable) {
    let stores_references;
    if (stores_references = kb.utils.get(observable, 'stores_references')) {
      for (const index in observable.__kb.stores_references) {
        const store_references = observable.__kb.stores_references[index];
        if (store_references.store === this) {
          observable.__kb.stores_references.splice(index, 1);
          break;
        }
      }
    }
  }

  // @nodoc
  _retire(observable) {
    this._clearStoreReferences(observable);this.replaced_observables.push(observable);return this._remove(observable);
  }

  // @nodoc
  _add(observable, obj, creator) {
    let name;
    if (!creator) {
      creator = observable.constructor;
    } // default is to use the constructor
    kb.utils.wrappedObject(observable, obj);kb.utils.wrappedCreator(observable, creator);
    return (this.observable_records[name = this._creatorId(creator)] || (this.observable_records[name] = {}))[this._cid(obj)] = observable;
  }

  // @nodoc
  _remove(observable) {
    let current_observable, obj;
    const creator = kb.utils.wrappedCreator(observable) || observable.constructor; // default is to use the constructor
    if (current_observable = this.find(obj = kb.utils.wrappedObject(observable), creator)) {
      // already released
      if (current_observable === observable) {
        delete this.observable_records[this._creatorId(creator)][this._cid(obj)];
      } // not already replaced
    }
    kb.utils.wrappedObject(observable, null);return kb.utils.wrappedCreator(observable, null);
  }

  // @nodoc
  _creator(obj, options) {
    let creator;
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
});

function __initClass__(c) {
  c.initClass();
  return c;
}
function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let kb;
const { _, ko } = kb = __webpack_require__(0);

// ###################################################
// Public API
// ###################################################

// Library of general-purpose utilities
kb.utils = class utils {
  static initClass() {
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
  static get(obj, key, default_value) {
    return !obj.__kb || !obj.__kb.hasOwnProperty(key) ? default_value : obj.__kb[key];
  }

  // @nodoc
  static set(obj, key, value) {
    return (obj.__kb || (obj.__kb = {}))[key] = value;
  }

  // @nodoc
  static orSet(obj, key, value) {
    if (!(obj.__kb || (obj.__kb = {})).hasOwnProperty(key)) {
      obj.__kb[key] = value;return obj.__kb[key];
    }
  }

  // @nodoc
  static has(obj, key) {
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
  static wrappedObservable(obj, value) {
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
  static wrappedObject(obj, value) {
    if (arguments.length === 1) {
      return kb.utils.get(obj, 'object');
    }return kb.utils.set(obj, 'object', value);
  }

  // @nodoc
  static wrappedCreator(obj, value) {
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
  static wrappedModel(obj, value) {
    if (arguments.length === 1) {
      _.isUndefined(value = kb.utils.get(obj, 'object')) ? obj : value;
    } else {
      return kb.utils.set(obj, 'object', value);
    }
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
  static wrappedStore(obj, value) {
    if (arguments.length === 1) {
      return kb.utils.get(obj, 'store');
    }return kb.utils.set(obj, 'store', value);
  }

  // @private
  static wrappedStoreIsOwned(obj, value) {
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
  static wrappedFactory(obj, value) {
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
  static wrappedEventWatcher(obj, value) {
    if (arguments.length === 1) {
      return kb.utils.get(obj, 'event_watcher');
    }return kb.utils.set(obj, 'event_watcher', value);
  }

  // @private
  static wrappedEventWatcherIsOwned(obj, value) {
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
  static valueType(observable) {
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
  static pathJoin(path1, path2) {
    return (path1 ? path1[path1.length - 1] !== '.' ? `${path1}.` : path1 : '') + path2;
  }

  // Helper to join a dot-deliminated path with the path on options and returns a new options object with the result.
  //
  // @param [Object] options with path property for the start path
  // @param [String] path append path.
  // @return [Object] new options with combined dot-delimited path `{path: combined_path}`.
  //
  // @example
  //   this.friends = kb.collectionObservable(model.get('friends'), kb.utils.optionsPathJoin(options, 'friends'));
  static optionsPathJoin(options, path) {
    return _.defaults({ path: this.pathJoin(options.path, path) }, options);
  }

  // Helper to find the creator constructor or function from a factory or ORM solution
  static inferCreator(value, factory, path) {
    let creator;
    if (factory && (creator = factory.creatorForPath(value, path))) {
      return creator;
    }

    // try fallbacks
    if (!value) {
      return null;
    }
    if (value instanceof kb.Model) {
      return kb.ViewModel;
    }
    if (value instanceof kb.Collection) {
      return kb.CollectionObservable;
    }
    return null;
  }

  // Creates an observable based on a value's type.
  static createFromDefaultCreator(obj, options) {
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
  static resolveModel(model) {
    if (model && kb.Backbone && kb.Backbone.ModelRef && model instanceof kb.Backbone.ModelRef) {
      return model.model();
    }return model;
  }
};
undefined.initClass();

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let kb;
const { _, ko } = kb = __webpack_require__(0);
const extend = __webpack_require__(4);

// @nodoc
const assignViewModelKey = function (vm, key) {
  const vm_key = vm.__kb.internals && ~_.indexOf(vm.__kb.internals, key) ? `_${key}` : key;
  if (vm.__kb.view_model.hasOwnProperty(vm_key)) {
    return;
  } // already exists, skip
  vm.__kb.view_model[vm_key] = null;
  return vm_key;
};

// @nodoc
const createObservable = function (vm, model, key, create_options) {
  let vm_key;
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
const createStaticObservables = function (vm, model) {
  for (const key of vm.__kb.statics) {
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
};

const KEYS_OPTIONS = ['keys', 'internals', 'excludes', 'statics', 'static_defaults'];

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
kb.ViewModel = class ViewModel {
  static initClass() {
    // @nodoc
    this.extend = extend;
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
  constructor(model, options, view_model) {
    if (options == null) {
      options = {};
    }const args = Array.prototype.slice.call(_.isArguments(model) ? model : arguments);return kb.ignore(() => {
      !(model = args.shift()) || kb.isModel(model) || kb._throwUnexpected(this, 'not a model');
      if (_.isArray(args[0])) {
        args[0] = { keys: args[0] };
      }
      if (!this.__kb) {
        this.__kb = {};
      }this.__kb.view_model = args.length > 1 ? args.pop() : this;
      options = {};for (const arg of args) {
        _.extend(options, arg);options = kb.utils.collapseOptions(options);
      }
      for (const key of KEYS_OPTIONS) {
        if (options.hasOwnProperty(key)) {
          this.__kb[key] = options[key];
        }
      }

      // always use a store to ensure recursive view models are handled correctly
      kb.Store.useOptionsOrCreate(options, model, this);

      // view model factory
      this.__kb.path = options.path;
      kb.Factory.useOptionsOrCreate(options, this, options.path);

      const _model = kb.utils.set(this, '_model', ko.observable());
      this.model = ko.computed({
        read: () => ko.utils.unwrapObservable(_model),
        write: new_model => kb.ignore(() => {
          if (kb.utils.wrappedObject(this) === new_model || kb.wasReleased(this) || !event_watcher) {
            return;
          }

          this.__kb.store.reuse(this, kb.utils.resolveModel(new_model));
          event_watcher.emitter(new_model);_model(event_watcher.ee);
          return !event_watcher.ee || this.createObservables(event_watcher.ee);
        })
      });
      var event_watcher = kb.utils.wrappedEventWatcher(this, new kb.EventWatcher(model, this, { emitter: this._model, update: () => kb.ignore(() => !(event_watcher != null ? event_watcher.ee : undefined) || this.createObservables(event_watcher != null ? event_watcher.ee : undefined)) }));
      kb.utils.wrappedObject(this, model = event_watcher.ee);_model(event_watcher.ee);

      // update the observables
      this.__kb.create_options = { store: kb.utils.wrappedStore(this), factory: kb.utils.wrappedFactory(this), path: this.__kb.path, event_watcher: kb.utils.wrappedEventWatcher(this) };
      !options.requires || this.createObservables(model, options.requires);
      !this.__kb.internals || this.createObservables(model, this.__kb.internals);
      !options.mappings || this.createObservables(model, options.mappings);
      !this.__kb.statics || createStaticObservables(this, model);
      this.createObservables(model, this.__kb.keys);

      !kb.statistics || kb.statistics.register('ViewModel', this); // collect memory management statistics
      return this;
    });
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy() {
    this.__kb_released = true;
    if (this.__kb.view_model !== this) {
      (() => {
        const result = [];
        for (const vm_key in this.__kb.vm_keys) {
          result.push(this.__kb.view_model[vm_key] = null);
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
  shareOptions() {
    return { store: kb.utils.wrappedStore(this), factory: kb.utils.wrappedFactory(this) };
  }

  // create observables manually
  createObservables(model, keys) {
    let key;
    if (!keys) {
      let rel_keys;
      if (this.__kb.keys || !model) {
        return;
      } // only use the keys provided
      for (key in model.attributes) {
        createObservable(this, model, key, this.__kb.create_options);
      }
      if (rel_keys = __guardMethod__(kb.settings.orm, 'keys', o => o.keys(model))) {
        (() => {
          const result = [];
          for (key of rel_keys) {
            result.push(createObservable(this, model, key, this.__kb.create_options));
          }
          return result;
        })();
      }
    } else if (_.isArray(keys)) {
      for (key of keys) {
        createObservable(this, model, key, this.__kb.create_options);
      }
    } else {
      for (key in keys) {
        var vm_key;
        const mapping_info = keys[key];
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
};
undefined.initClass();

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

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

const { _ } = __webpack_require__(0);

// @nodoc
const _mergeArray = function (result, key, value) {
  if (!result[key]) {
    result[key] = [];
  }
  if (!_.isArray(value)) {
    value = [value];
  }
  result[key] = result[key].length ? _.union(result[key], value) : value;
  return result;
};

// @nodoc
const _mergeObject = function (result, key, value) {
  if (!result[key]) {
    result[key] = {};
  }return _.extend(result[key], value);
};

// @nodoc
const _keyArrayToObject = function (value) {
  const result = {};for (const item of value) {
    result[item] = { key: item };return result;
  }
};

var _mergeOptions = function (result, options) {
  if (!options) {
    return result;
  }
  for (const key in options) {
    let value = options[key];
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
        then;
        break;
      default:
        result[key] = value;
    }
  }

  return _mergeOptions(result, options.options);
};

// @nodoc
module.exports = options => _mergeOptions({}, options);

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let unwrapModels;
const { _ } = __webpack_require__(0);

// @nodoc
module.exports = unwrapModels = function (obj) {
  if (!obj) {
    return obj;
  }

  if (obj.__kb) {
    return obj.__kb.hasOwnProperty('object') ? obj.__kb.object : obj;
  }
  if (_.isArray(obj)) {
    return _.map(obj, test => unwrapModels(test));
  }
  if (_.isObject(obj) && obj.constructor === {}.constructor) {
    // a simple object
    const result = {};
    for (const key in obj) {
      const value = obj[key];result[key] = unwrapModels(value);
    }
    return result;
  }

  return obj;
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let wrappedDestroy;
const { _ } = __webpack_require__(0);

// @nodoc
module.exports = wrappedDestroy = function (obj) {
  if (!obj.__kb) {
    return;
  }
  if (obj.__kb.event_watcher) {
    obj.__kb.event_watcher.releaseCallbacks(obj);
  }

  const { __kb } = obj;obj.__kb = null; // clear now to break cycles

  if (__kb.observable) {
    __kb.observable.destroy = __kb.observable.release = null;
    wrappedDestroy(__kb.observable);
    __kb.observable = null;
  }

  __kb.factory = null;

  if (__kb.event_watcher_is_owned) {
    __kb.event_watcher.destroy();
  } // release the event_watcher
  __kb.event_watcher = null;

  if (__kb.store_is_owned) {
    __kb.store.destroy();
  } // release the store
  __kb.store = null;
  if (__kb.stores_references) {
    let store_references;
    while (store_references = __kb.stores_references.pop()) {
      if (!store_references.store.__kb_released) {
        store_references.store.release(obj);
      }
    }
  }
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let BackboneAssociations, kb;
const { _, Backbone } = kb = __webpack_require__(0);

let AssociatedModel = null; // lazy check

// @nodoc
module.exports = BackboneAssociations = class BackboneAssociations {
  static isAvailable() {
    return !!(AssociatedModel = Backbone != null ? Backbone.AssociatedModel : undefined);
  } // or require?('backbone-associations')?.AssociatedModel # webpack optionals

  static keys(model) {
    if (!(model instanceof AssociatedModel)) {
      return null;
    }
    return _.map(model.relations, test => test.key);
  }

  static relationType(model, key) {
    let relation;
    if (!(model instanceof AssociatedModel)) {
      return null;
    }
    if (!(relation = _.find(model.relations, test => test.key === key))) {
      return null;
    }
    return relation.type === 'Many' ? kb.TYPE_COLLECTION : kb.TYPE_MODEL;
  }

  static useFunction() {
    return false;
  }
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let BackboneRelational, kb;
const { _, Backbone } = kb = __webpack_require__(0);

let RelationalModel = null; // lazy check

// @nodoc
module.exports = BackboneRelational = class BackboneRelational {
  static isAvailable() {
    return !!(RelationalModel = Backbone != null ? Backbone.RelationalModel : undefined);
  } // or require?('backbone-relational')?.RelationalModel # webpack optionals

  static relationType(model, key) {
    let relation;
    if (!(model instanceof RelationalModel)) {
      return null;
    }
    if (!(relation = _.find(model.getRelations(), test => test.key === key))) {
      return null;
    }
    return relation.collectionType || _.isArray(relation.keyContents) ? kb.TYPE_COLLECTION : kb.TYPE_MODEL;
  }

  static bind(model, key, update, path) {
    let event, type;
    if (!(type = this.relationType(model, key))) {
      return null;
    }
    const rel_fn = function (model) {
      !kb.statistics || kb.statistics.addModelEvent({ name: 'update (relational)', model, key, path });
      return update();
    };

    // VERSIONING: pre Backbone-Relational 0.8.0
    const events = kb.Backbone.Relation.prototype.sanitizeOptions ? ['update', 'add', 'remove'] : ['change', 'add', 'remove'];
    if (type === kb.TYPE_COLLECTION) {
      for (event of events) {
        model.bind(`${event}:${key}`, rel_fn);
      }
    } else {
      model.bind(`${events[0]}:${key}`, rel_fn);
    }

    return function () {
      if (type === kb.TYPE_COLLECTION) {
        for (event of events) {
          model.unbind(`${event}:${key}`, rel_fn);
        }
      } else {
        model.unbind(`${events[0]}:${key}`, rel_fn);
      }
    };
  }

  static useFunction() {
    return false;
  }
};

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