/*
  knockback.js 1.2.3
  Copyright (c)  2011-2022 Kevin Malakoff.
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
})(this, function(__WEBPACK_EXTERNAL_MODULE_28__, __WEBPACK_EXTERNAL_MODULE_29__, __WEBPACK_EXTERNAL_MODULE_30__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 31);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var Backbone, LIFECYCLE_METHODS, _, kb, ko, window;

window = window != null ? window : global;
ko = __webpack_require__(30);
LIFECYCLE_METHODS = ['release', 'destroy', 'dispose']; // The 'kb' namespace for classes, factory functions, constants, etc.
// @method .configure(options)
//   Method to update Knockback global configuration.
//   @param [Object] configuration options. 1) orm - select the library for relationships (default, backbone-orm, backbone-associations, backbone-relational), 2) deep_retain - true to multiply retain view models in the store
// @method .collectionObservable(collection, options)
//   Factory to create a new kb.CollectionObservable. See {kb.CollectionObservable#constructor} for information on options
//   @param [Collection] collection the collection to observe (can be null)
//   @param [Object] options the create options
//   @return [ko.observableArray] the constructor does not return 'this' but a ko.observableArray
// @method .observable(model, options, view_model)
//   Factory to create a new kb.Observable. See {kb.Observable#constructor} for information on options
//   @param [Model] model the model to observe (can be null)
//   @param [String|Array|Object] options the create options. String is a single attribute name, Array is an array of attribute names.
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
// @method .viewModel(model, options, view_model)
//   Factory to create a new kb.ViewModel. See {kb.ViewModel#constructor} for information on options
//   @param [Model|ModelRef] model the model to observe (can be null)
//   @param [Object] options the create options
//   @return [ko.observable] the constructor returns 'this'
// @method .defaultObservable(target, default_value)
//   Factory to create a new kb.DefaultObservable. See {kb.DefaultObservable#constructor} for information on options. If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-defaults component.
//   @param [ko.observable] target_observable the observable to check for null, undefined, or the empty string
//   @param [Any] default_value the default value. Can be a value, string or ko.observable
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
// @method .formattedObservable(format, arg1, arg2, etc)
//   Factory to create a new kb.FormattedObservable. See {kb.FormattedObservable#constructor} for information on options. If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-formatting component.
//   @param [String|ko.observable] format the format string. Format: `"{0} and {1}"` where `{0}` and `{1}` would be synchronized with the arguments (eg. "Bob and Carol" where `{0}` is Bob and `{1}` is Carol)
//   @param [Array] args arguments to be passed to the kb.LocaleManager's get() method
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
// @method .localizedObservable(value, options, view_model)
//   Factory to create a new kb.LocalizedObservable. See {kb.LocalizedObservable#constructor} for information on options. If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-localization component.
//   @param [Data|ko.observable] value the value to localize
//   @param [Object] options the create options
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable

module.exports = kb = function () {
  var ref;

  var kb = /*#__PURE__*/function () {
    function kb() {
      _classCallCheck(this, kb);
    }

    _createClass(kb, null, [{
      key: "wasReleased",
      value: // Checks if an object has been released.
      // @param [Any] obj the object to release and also release its keys
      function wasReleased(obj) {
        return !obj || obj.__kb_released;
      } // Checks if an object can be released. Used to perform minimal nested releasing on objects by checking if self or next level contained items can be released.
      // @param [Any] obj the object to release and also release its keys

    }, {
      key: "isReleaseable",
      value: function isReleaseable(obj) {
        var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var j, key, len, method, value;

        if (!obj || obj !== Object(obj) || obj.__kb_released) {
          // must be an object and not already released
          return false;
        }

        if (ko.isObservable(obj) || obj instanceof kb.ViewModel) {
          // a known type that is releasable
          return true;
        }

        if (typeof obj === 'function' || kb.isModel(obj) || kb.isCollection(obj)) {
          // a known type that is not releaseable
          return false;
        } // a releaseable signature


        for (j = 0, len = LIFECYCLE_METHODS.length; j < len; j++) {
          method = LIFECYCLE_METHODS[j];

          if (typeof obj[method] === 'function') {
            return true;
          }
        }

        if (depth > 0) {
          // max depth check for ViewModel inside of ViewModel
          return false;
        }

        for (key in obj) {
          value = obj[key];

          if (key !== '__kb' && kb.isReleaseable(value, depth + 1)) {
            return true;
          }
        }

        return false;
      } // Releases any type of view model or observable or items in an array using the conventions of release(), destroy(), dispose().
      // @param [Any] obj the object to release and also release its keys
      // @example
      //   var view_model = kb.viewModel(model);
      //   kb.release(view_model); view_model = null;
      // @example
      //   var todos = kb.collectionObservable(collection);
      //   kb.release(todos); todos = null;

    }, {
      key: "release",
      value: function release(obj) {
        var array, index, j, len, method, value;

        if (!kb.isReleaseable(obj)) {
          return;
        }

        obj.__kb_released = true; // mark as released
        // release array's items

        if (_.isArray(obj)) {
          for (index in obj) {
            value = obj[index];

            if (kb.isReleaseable(value)) {
              obj[index] = null, kb.release(value);
            }
          }

          return;
        } // observable or lifecycle managed


        if (ko.isObservable(obj) && _.isArray(array = kb.peek(obj))) {
          if (obj.__kb_is_co || obj.__kb_is_o && obj.valueType() === kb.TYPE_COLLECTION) {
            return typeof obj.destroy === "function" ? obj.destroy() : void 0;
          }

          for (index in array) {
            value = array[index];

            if (kb.isReleaseable(value)) {
              array[index] = null, kb.release(value);
            }
          }

          if (typeof obj.dispose === 'function') {
            obj.dispose();
          }

          return;
        } // a releaseable signature


        for (j = 0, len = LIFECYCLE_METHODS.length; j < len; j++) {
          method = LIFECYCLE_METHODS[j];

          if (typeof obj[method] === 'function') {
            // releaseable signature
            return obj[method].call(obj);
          }
        }

        if (!ko.isObservable(obj)) {
          // view model
          return this.releaseKeys(obj);
        }
      } // Releases and clears all of the keys on an object using the conventions of release(), destroy(), dispose() without releasing the top level object itself.

    }, {
      key: "releaseKeys",
      value: function releaseKeys(obj) {
        var key, value;

        for (key in obj) {
          value = obj[key];

          if (key !== '__kb' && kb.isReleaseable(value)) {
            obj[key] = null, kb.release(value);
          }
        }
      } // Binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
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
      key: "releaseOnNodeRemove",
      value: function releaseOnNodeRemove(view_model, node) {
        view_model || kb._throwUnexpected(this, 'missing view model');
        node || kb._throwUnexpected(this, 'missing node');
        return ko.utils.domNodeDisposal.addDisposeCallback(node, function () {
          return kb.release(view_model);
        });
      } // Renders a template and binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
      // NOTE: if you provide an afterRender method on the View Model and do not provide afterRender in the options, afterRender will be called with the following signature: afterRender(element) which differs from the Knockout signture of afterRender(elements)
      // @example The easy way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
      //   var el = kb.renderTemplate('my_template', kb.viewModel(new Backbone.Model({name: 'Bob'})));
      //   ...
      //   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)

    }, {
      key: "renderTemplate",
      value: function renderTemplate(template, view_model) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var document, el, i, j, observable, ref;

        if (!(document = window != null ? window.document : void 0)) {
          return typeof console !== "undefined" && console !== null ? console.log('renderTemplate: document is undefined') : void 0;
        }

        el = document.createElement('div');
        observable = ko.renderTemplate(template, view_model, options, el, 'replaceChildren');

        if (el.childNodes.length === 1) {
          // do not return the template wrapper if possible
          el = el.childNodes[0];
        } else if (el.childNodes.length) {
          // ensure the context is passed up to wrapper from a child
          for (i = j = 0, ref = el.childNodes.length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
            try {
              ko.storedBindingContextForNode(el, ko.contextFor(el.childNodes[i]));
              break;
            } catch (error) {}
          }
        }

        kb.releaseOnNodeRemove(view_model, el);
        observable.dispose(); // we will handle memory management with ko.removeNode (otherwise creates memory leak on default bound dispose function)

        if (view_model.afterRender && !options.afterRender) {
          // call afterRender for custom setup unless provided in options (so doesn't get double called)
          view_model.afterRender(el);
        }

        return el;
      } // Applies bindings and binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
      // @example The easy way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
      //   var el = $('<div data-bind="name: name"></div>')[0];
      //   kb.applyBindings(kb.viewModel(new Backbone.Model({name: 'Bob'})), el);
      //   ...
      //   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)

    }, {
      key: "applyBindings",
      value: function applyBindings(view_model, node) {
        var child, children, j, len;

        if (node.length) {
          // convert to a root element
          var _ref = [document.createElement('div'), node];
          node = _ref[0];
          children = _ref[1];

          for (j = 0, len = children.length; j < len; j++) {
            child = children[j];
            node.appendChild(child);
          }
        }

        ko.applyBindings(view_model, node);
        kb.releaseOnNodeRemove(view_model, node);
        return node;
      }
    }, {
      key: "getValue",
      value: function getValue(model, key, args) {
        var ref;

        if (!model) {
          return;
        }

        if (_.isFunction(model[key]) && ((ref = kb.settings.orm) != null ? ref.useFunction(model, key) : void 0)) {
          return model[key]();
        }

        if (!args) {
          return model.get(key);
        }

        return model.get.apply(model, _.map([key].concat(args), function (value) {
          return kb.peek(value);
        }));
      }
    }, {
      key: "setValue",
      value: function setValue(model, key, value) {
        var attributes, ref;

        if (!model) {
          return;
        }

        if (_.isFunction(model[key]) && ((ref = kb.settings.orm) != null ? ref.useFunction(model, key) : void 0)) {
          return model[key](value);
        }

        (attributes = {})[key] = value;
        return model.set(attributes);
      } // @nodoc

    }, {
      key: "_throwMissing",
      value: function _throwMissing(instance, message) {
        throw "".concat(_.isString(instance) ? instance : instance.constructor.name, ": ").concat(message, " is missing");
      } // @nodoc

    }, {
      key: "_throwUnexpected",
      value: function _throwUnexpected(instance, message) {
        throw "".concat(_.isString(instance) ? instance : instance.constructor.name, ": ").concat(message, " is unexpected");
      } // @nodoc

    }, {
      key: "publishMethods",
      value: function publishMethods(observable, instance, methods) {
        var fn, j, len;

        for (j = 0, len = methods.length; j < len; j++) {
          fn = methods[j];
          observable[fn] = kb._.bind(instance[fn], instance);
        }
      } // @nodoc

    }, {
      key: "peek",
      value: function peek(obs) {
        if (!ko.isObservable(obs)) {
          return obs;
        }

        if (obs.peek) {
          return obs.peek();
        }

        return kb.ignore(function () {
          return obs();
        });
      } // @nodoc

    }, {
      key: "isModel",
      value: function isModel(obj) {
        return obj && (obj instanceof kb.Model || typeof obj.get === 'function' && typeof obj.bind === 'function');
      } // @nodoc

    }, {
      key: "isCollection",
      value: function isCollection(obj) {
        return obj && obj instanceof kb.Collection;
      }
    }]);

    return kb;
  }();

  ; // Knockback library semantic version

  kb.VERSION = '1.2.3'; //###################################
  // OBSERVABLE STORAGE TYPES
  //###################################
  // Stored value type is not known like null/undefined (could be observed as a Model or a Collection or a simple type)

  kb.TYPE_UNKNOWN = 0; // Stored value type is simple like a String or Number -> observable type: ko.observable

  kb.TYPE_SIMPLE = 1; // Stored value type is an Array -> observable type: ko.observableArray

  kb.TYPE_ARRAY = 2; // Stored value type is a Model -> observable type: ViewModel

  kb.TYPE_MODEL = 3; // Stored value type is a Collection -> observable type: kb.CollectionObservable

  kb.TYPE_COLLECTION = 4; // Helper to ignore dependencies in a function
  // @param [Object] obj the object to test
  // @example
  //   kb.ignore(fn);

  kb.ignore = ((ref = ko.dependencyDetection) != null ? ref.ignore : void 0) || function (callback, callbackTarget, callbackArgs) {
    var value;
    value = null;
    ko.computed(function () {
      return value = callback.apply(callbackTarget, callbackArgs || []);
    }).dispose();
    return value;
  }; //###################################
  // INTERNAL HELPERS
  //###################################
  // @nodoc


  kb.extend = __webpack_require__(21);
  return kb;
}.call(void 0);

if (window.Parse) {
  Backbone = kb.Parse = window.Parse;
  _ = kb._ = window.Parse._;
} else {
  Backbone = kb.Backbone = __webpack_require__(28);
  _ = kb._ = __webpack_require__(29);
}

kb.ko = ko; // cache local references

kb.Collection = Backbone.Collection;
kb.Model = Backbone.Object || Backbone.Model;
kb.Events = Backbone.Events;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ALL_ORMS, _, kb, key, ko, value;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
ko = _kb.ko;
ALL_ORMS = {
  'default': null,
  'backbone-orm': null,
  'backbone-associations': __webpack_require__(24),
  'backbone-relational': __webpack_require__(25)
}; // @nodoc

kb.settings = {
  orm: ALL_ORMS["default"]
};

for (key in ALL_ORMS) {
  value = ALL_ORMS[key];

  if (value && value.isAvailable()) {
    break;
  }

  kb.settings.orm = value;
} // @nodoc


module.exports = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var orm;

  for (key in options) {
    value = options[key];

    switch (key) {
      case 'orm':
        // set by name
        if (_.isString(value)) {
          if (!ALL_ORMS.hasOwnProperty(value)) {
            console.log("Knockback configure: could not find orm: ".concat(value, ". Available: ").concat(_.keys(ALL_ORMS).join(', ')));
            continue;
          }

          if ((orm = ALL_ORMS[value]) && !orm.isAvailable()) {
            console.log("Knockback configure: could not enable orm ".concat(value, ". Make sure it is included before Knockback"));
            continue;
          }

          kb.settings.orm = orm;
          continue;
        } else {
          // set by functions
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


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var TypedValue, _, kb, ko;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
ko = _kb.ko;

// @nodoc
module.exports = TypedValue = /*#__PURE__*/function () {
  function TypedValue(create_options1) {
    _classCallCheck(this, TypedValue);

    this.create_options = create_options1;
    this._vo = ko.observable(null); // create a value observable for the first dependency
  }

  _createClass(TypedValue, [{
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
  }, {
    key: "value",
    value: function value() {
      return ko.utils.unwrapObservable(this._vo());
    }
  }, {
    key: "rawValue",
    value: function rawValue() {
      return this.__kb_value;
    }
  }, {
    key: "valueType",
    value: function valueType(model, key) {
      var new_value;
      new_value = kb.getValue(model, key);
      this.value_type || this._updateValueObservable(new_value); // create so we can check the type

      return this.value_type;
    }
  }, {
    key: "update",
    value: function update(new_value) {
      var new_type, ref, value;

      if (this.__kb_released) {
        // destroyed, nothing to do
        return;
      } // determine the new type


      new_value !== void 0 || (new_value = null); // ensure null instead of undefined

      new_type = kb.utils.valueType(new_value);

      if ((ref = this.__kb_value) != null ? ref.__kb_released : void 0) {
        this.__kb_value = this.value_type = void 0;
      }

      value = this.__kb_value;

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
                // collection observables are allocated once
                value.collection(new_value);
              }
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
  }, {
    key: "_updateValueObservable",
    value: function _updateValueObservable(new_value, new_observable) {
      var create_options, creator, previous_value, value, value_type;
      create_options = this.create_options;
      creator = kb.utils.inferCreator(new_value, create_options.factory, create_options.path); // retain previous type

      if (new_value === null && !creator) {
        if (this.value_type === kb.TYPE_MODEL) {
          creator = kb.ViewModel;
        } else if (this.value_type === kb.TYPE_COLLECTION) {
          creator = kb.CollectionObservable;
        }
      }

      create_options.creator = creator;
      value_type = kb.TYPE_UNKNOWN;
      var _ref = [this.__kb_value, void 0];
      previous_value = _ref[0];
      this.__kb_value = _ref[1];

      if (new_observable) {
        value = new_observable;

        if (create_options.store) {
          create_options.store.retain(new_observable, new_value, creator);
        } // found a creator

      } else if (creator) {
        // have the store, use it to create
        if (create_options.store) {
          value = create_options.store.retainOrCreate(new_value, create_options, true);
        } else {
          // create manually
          if (creator.models_only) {
            value = new_value;
            value_type = kb.TYPE_SIMPLE;
          } else if (creator.create) {
            value = creator.create(new_value, create_options);
          } else {
            value = new creator(new_value, create_options);
          }
        }
      } else {
        // create and cache the type
        if (_.isArray(new_value)) {
          value_type = kb.TYPE_ARRAY;
          value = ko.observableArray(new_value);
        } else {
          value_type = kb.TYPE_SIMPLE;
          value = ko.observable(new_value);
        }
      } // determine the type


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
      } // release previous


      if (previous_value) {
        if (this.create_options.store) {
          this.create_options.store.release(previous_value);
        } else {
          kb.release(previous_value);
        }
      } // store the value


      this.__kb_value = value;
      return this._vo(value);
    }
  }, {
    key: "_inferType",
    value: function _inferType(value) {}
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


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var COMPARE_ASCENDING,
    COMPARE_DESCENDING,
    COMPARE_EQUAL,
    KEYS_PUBLISH,
    _,
    kb,
    ko,
    indexOf = [].indexOf;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
ko = _kb.ko;
COMPARE_EQUAL = 0;
COMPARE_ASCENDING = -1;
COMPARE_DESCENDING = 1;
KEYS_PUBLISH = ['destroy', 'shareOptions', 'filters', 'comparator', 'sortAttribute', 'viewModelByModel', 'hasViewModels'];

kb.compare = function (value_a, value_b) {
  if (_.isString(value_a)) {
    // String compare
    return value_a.localeCompare("".concat(value_b));
  }

  if (_.isString(value_b)) {
    return value_b.localeCompare("".concat(value_a));
  } // compare raw values


  if (value_a === value_b) {
    return COMPARE_EQUAL;
  } else {
    if (value_a < value_b) {
      return COMPARE_ASCENDING;
    } else {
      return COMPARE_DESCENDING;
    }
  }
};

kb.CollectionObservable = function () {
  // Base class for observing collections.
  // @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
  //   var collection = new Collection([{name: 'name1'}, {name: 'name2'}]);
  //   var view_model = {
  //     todos: kb.collectionObservable(collection)
  //   };
  // @example How to access and change the observed collection.
  //    var todos = new kb.CollectionObservable(new kb.Collection([{name: 'name1'}, {name: 'name2'}]);
  //    var current_collection = todos.collection(); // get
  //    todos.collection(new Backbone.Collection([{name: 'name3'}, {name: 'name4'}])); // set
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
  // @method #collection()
  //   Dual-purpose getter/setter ko.computed for the observed collection.
  //   @return [Collection|void] getter: the collection whose models are being observed (can be null) OR setter: void
  var CollectionObservable = /*#__PURE__*/function () {
    // Used to create a new kb.CollectionObservable.
    // When the observable is updated, the following Backbone.Events are triggered:
    // * ***add***: (view_model, collection_observable) or if batch: (collection_observable)
    // * ***resort***: (view_model, collection_observable, new_index) or if batch: (collection_observable)
    // * ***remove***: (view_model, collection_observable) or if batch: (collection_observable)
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
    function CollectionObservable(collection, view_model, options) {
      var _this = this;

      _classCallCheck(this, CollectionObservable);

      var args; // @nodoc

      this._onCollectionChange = this._onCollectionChange.bind(this);
      args = Array.prototype.slice.call(_.isArguments(collection) ? collection : arguments);
      return kb.ignore(function () {
        var arg, create_options, i, len, observable;
        collection = args[0] instanceof kb.Collection ? args.shift() : _.isArray(args[0]) ? new kb.Collection(args.shift()) : new kb.Collection();

        if (_.isFunction(args[0])) {
          args[0] = {
            view_model: args[0]
          };
        }

        options = {};

        for (i = 0, len = args.length; i < len; i++) {
          arg = args[i];

          _.extend(options, arg);
        }

        observable = kb.utils.wrappedObservable(_this, ko.observableArray([]));
        observable.__kb_is_co = true; // mark as a kb.CollectionObservable

        _this.in_edit = 0; // bind callbacks

        _this.__kb || (_this.__kb = {}); // options

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
          _this._filters = ko.observableArray(_.isArray(options.filters) ? options.filters : options.filters ? [options.filters] : void 0);
        } else {
          _this._filters = ko.observableArray([]);
        }

        create_options = _this.create_options = {
          store: kb.Store.useOptionsOrCreate(options, collection, observable) // create options

        };
        kb.utils.wrappedObject(observable, collection); // view model factory create factories

        _this.path = options.path;
        create_options.factory = kb.utils.wrappedFactory(observable, _this._shareOrCreateFactory(options));
        create_options.path = kb.utils.pathJoin(options.path, 'models'); // check for models only

        create_options.creator = create_options.factory.creatorForPath(null, create_options.path);

        if (create_options.creator) {
          _this.models_only = create_options.creator.models_only;
        } // publish public interface on the observable and return instead of this


        kb.publishMethods(observable, _this, KEYS_PUBLISH); // start the processing

        _this._collection = ko.observable(collection);
        observable.collection = _this.collection = ko.computed({
          read: function read() {
            return _this._collection();
          },
          write: function write(new_collection) {
            return kb.ignore(function () {
              var previous_collection;

              if ((previous_collection = _this._collection()) === new_collection) {
                // no change
                return;
              } // @create_options.store.reuse(@, new_collection) # not meant to be shared


              kb.utils.wrappedObject(observable, new_collection);

              if (previous_collection) {
                // clean up
                previous_collection.unbind('all', _this._onCollectionChange);
              }

              if (new_collection) {
                // store in _kb_collection so that a collection() function can be exposed on the observable and so the collection can be
                new_collection.bind('all', _this._onCollectionChange);
              } // update references (including notification)


              return _this._collection(new_collection);
            });
          }
        });

        if (collection) {
          // bind now
          collection.bind('all', _this._onCollectionChange);
        } // observable that will re-trigger when sort or filters or collection changes


        _this._mapper = ko.computed(function () {
          var comparator, current_collection, filter, filters, models, previous_view_models, view_models;
          comparator = _this._comparator(); // create dependency

          filters = _this._filters(); // create dependency

          if (filters) {
            // create a dependency
            (function () {
              var j, len1, results;
              results = [];

              for (j = 0, len1 = filters.length; j < len1; j++) {
                filter = filters[j];
                results.push(ko.utils.unwrapObservable(filter));
              }

              return results;
            })();
          }

          current_collection = _this._collection(); // create dependency

          if (_this.in_edit) {
            // we are doing the editing
            return;
          } // no models


          observable = kb.utils.wrappedObservable(_this);
          previous_view_models = kb.peek(observable);

          if (current_collection) {
            models = current_collection.models;
          }

          if (!models || current_collection.models.length === 0) {
            view_models = [];
          } else {
            // apply filters
            // process filters, sorting, etc
            models = _.filter(models, function (model) {
              return !filters.length || _this._selectModel(model);
            }); // apply sorting

            if (comparator) {
              view_models = _.map(models, function (model) {
                return _this._createViewModel(model);
              }).sort(comparator);
            } else {
              // no sorting
              if (_this.models_only) {
                view_models = filters.length ? models : models.slice(); // clone the array if it wasn't filtered
              } else {
                view_models = _.map(models, function (model) {
                  return _this._createViewModel(model);
                });
              }
            }
          } // update the observable array for this collection observable


          _this.in_edit++;
          observable(view_models);
          _this.in_edit--;
        }); // start subscribing
        // TODO: release previous
        // unless @models_only
        //   create_options.store.release(view_model) for view_model in previous_view_models

        observable.subscribe(_.bind(_this._onObservableArrayChange, _this));
        !kb.statistics || kb.statistics.register('CollectionObservable', _this); // collect memory management statistics

        return observable;
      });
    } // Required clean up function to break cycles, release view models, etc.
    // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


    _createClass(CollectionObservable, [{
      key: "destroy",
      value: function destroy() {
        var array, collection, observable;
        this.__kb_released = true;
        observable = kb.utils.wrappedObservable(this);
        collection = kb.peek(this._collection);
        kb.utils.wrappedObject(observable, null);

        if (collection) {
          collection.unbind('all', this._onCollectionChange);
          array = kb.peek(observable);
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
        return !kb.statistics || kb.statistics.unregister('CollectionObservable', this); // collect memory management statistics
      } // Get the options for a new collection that can be used for sharing view models.
      // @example Sharing view models for an HTML select element.
      //   var selected_collection = new Backbone.Collection();
      //   var available_collection = new Backbone.Collection([{name: 'Bob'}, {name: 'Fred'}]);
      //   var selected = kb.collectionObservable(available_collection);
      //   var available = kb.collectionObservable(available_collection, available_collection.shareOptions()); // view models shared with selected collection observable

    }, {
      key: "shareOptions",
      value: function shareOptions() {
        var observable;
        observable = kb.utils.wrappedObservable(this);
        return {
          store: kb.utils.wrappedStore(observable),
          factory: kb.utils.wrappedFactory(observable)
        };
      } // Setter for the filters array for excluding models in the collection observable.
      // @param [Id|Function|Array] filters filters can be individual ids (observable or simple) or arrays of ids, functions, or arrays of functions.
      // @example
      //    // exclude a single model by id
      //    collection_observable.filters(model.id);

    }, {
      key: "filters",
      value: function filters(_filters) {
        if (_filters) {
          return this._filters(_.isArray(_filters) ? _filters : [_filters]);
        } else {
          return this._filters([]);
        }
      } // Setter for the sorted index function for auto-sorting the ViewModels or Models in a kb.CollectionObservable.
      // @param [Function] comparator a function that returns an index where to insert the model. Signature: function(models, model)
      // @param [Function] comparator a function that is used to sort an object. Signature: `function(model_a, model_b)` returns negative value for ascending, 0 for equal, and positive for descending
      // @example
      //    // change the sorting function
      //    collection_observable.comparator(
      //      function(view_models, vm){
      //        return _.comparator(view_models, vm, (test) -> kb.utils.wrappedModel(test).get('name'));
      //      }
      //    );

    }, {
      key: "comparator",
      value: function comparator(_comparator) {
        return this._comparator(_comparator);
      } // Setter for the sort attribute name for auto-sorting the ViewModels or Models in a kb.CollectionObservable.
      // @param [String] sort_attribute the name of an attribute. Default: resort on all changes to a model.
      // @example
      //    var todos = new kb.CollectionObservable(new Backbone.Collection([{name: 'Zanadu', name: 'Alex'}]));
      //    // in order of Zanadu then Alex
      //    todos.sortAttribute('name');
      //    // in order of Alex then Zanadu

    }, {
      key: "sortAttribute",
      value: function sortAttribute(sort_attribute) {
        return this._comparator(sort_attribute ? this._attributeComparator(sort_attribute) : null);
      } // Reverse lookup for a view model by model. If created with models_only option, will return null.

    }, {
      key: "viewModelByModel",
      value: function viewModelByModel(model) {
        var id_attribute;

        if (this.models_only) {
          return null;
        }

        id_attribute = model.hasOwnProperty(model.idAttribute) ? model.idAttribute : 'cid';
        return _.find(kb.peek(kb.utils.wrappedObservable(this)), function (test) {
          var ref;

          if (test != null ? (ref = test.__kb) != null ? ref.object : void 0 : void 0) {
            return test.__kb.object[id_attribute] === model[id_attribute];
          } else {
            return false;
          }
        });
      } // Will return true unless created with models_only option.
      // @example
      //   var todos1 = new kb.CollectionObservable(new Backbone.Collection(), {models_only: true});
      //   todos1.hasViewModels();     // false
      //   var todos2 = new kb.CollectionObservable(new Backbone.Collection());
      //   todos2.hasViewModels();     // true

    }, {
      key: "hasViewModels",
      value: function hasViewModels() {
        return !this.models_only;
      } // Compacts the Collection Observable to use the least amount of memory. Currently, this is brute force meaning it releases than regenerates all view models when called.

    }, {
      key: "compact",
      value: function compact() {
        var _this2 = this;

        return kb.ignore(function () {
          var observable;
          observable = kb.utils.wrappedObservable(_this2);

          if (!kb.utils.wrappedStoreIsOwned(observable)) {
            return;
          }

          kb.utils.wrappedStore(observable).clear();
          return _this2._collection.notifySubscribers(_this2._collection());
        });
      } //###################################################
      // Internal
      //###################################################
      // @nodoc

    }, {
      key: "_shareOrCreateFactory",
      value: function _shareOrCreateFactory(options) {
        var absolute_models_path, existing_creator, factories, factory;
        absolute_models_path = kb.utils.pathJoin(options.path, 'models');
        factories = options.factories; // check the existing factory

        if (factory = options.factory) {
          // models matches, check additional paths
          if ((existing_creator = factory.creatorForPath(null, absolute_models_path)) && (!factories || factories['models'] === existing_creator)) {
            if (!factories) {
              // all match, share the factory
              return factory;
            }

            if (factory.hasPathMappings(factories, options.path)) {
              // all match, share the factory
              return factory;
            }
          }
        } // need to create a new factory


        factory = new kb.Factory(options.factory);

        if (factories) {
          factory.addPathMappings(factories, options.path);
        } // set up the default create function


        if (!factory.creatorForPath(null, absolute_models_path)) {
          if (options.hasOwnProperty('models_only')) {
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
    }, {
      key: "_onCollectionChange",
      value: function _onCollectionChange(event, arg) {
        var _this3 = this;

        return kb.ignore(function () {
          var collection, comparator, observable, view_model;

          if (_this3.in_edit || kb.wasReleased(_this3)) {
            // we are doing the editing or have been released
            return;
          }

          switch (event) {
            case 'reset':
              if (_this3.auto_compact) {
                _this3.compact();
              } else {
                _this3._collection.notifySubscribers(_this3._collection());
              }

              break;

            case 'sort':
            case 'resort':
              _this3._collection.notifySubscribers(_this3._collection());

              break;

            case 'new':
            case 'add':
              if (!_this3._selectModel(arg)) {
                // filtered
                return;
              }

              observable = kb.utils.wrappedObservable(_this3);
              collection = _this3._collection();

              if (collection.indexOf(arg) === -1) {
                // the model may have been removed before we got a chance to add it
                return;
              }

              if (view_model = _this3.viewModelByModel(arg)) {
                // it may have already been added by a change event
                return;
              }

              _this3.in_edit++;

              if (comparator = _this3._comparator()) {
                observable().push(_this3._createViewModel(arg));
                observable.sort(comparator);
              } else {
                observable.splice(collection.indexOf(arg), 0, _this3._createViewModel(arg));
              }

              _this3.in_edit--;
              break;

            case 'remove':
            case 'destroy':
              _this3._onModelRemove(arg);

              break;

            case 'change':
              if (!_this3._selectModel(arg)) {
                // filtered, remove
                return _this3._onModelRemove(arg);
              }

              view_model = _this3.models_only ? arg : _this3.viewModelByModel(arg);

              if (!view_model) {
                // add new
                return _this3._onCollectionChange('add', arg);
              }

              if (!(comparator = _this3._comparator())) {
                return;
              }

              _this3.in_edit++;
              kb.utils.wrappedObservable(_this3).sort(comparator);
              _this3.in_edit--;
          }
        });
      } // @nodoc

    }, {
      key: "_onModelRemove",
      value: function _onModelRemove(model) {
        var observable, view_model;
        view_model = this.models_only ? model : this.viewModelByModel(model); // either remove a view model or a model

        if (!view_model) {
          // it may have already been removed
          return;
        }

        observable = kb.utils.wrappedObservable(this);
        this.in_edit++;
        observable.remove(view_model);
        return this.in_edit--;
      } // @nodoc

    }, {
      key: "_onObservableArrayChange",
      value: function _onObservableArrayChange(models_or_view_models) {
        var _this4 = this;

        return kb.ignore(function () {
          var collection, current_view_model, has_filters, i, len, model, models, observable, view_model, view_models;

          if (_this4.in_edit) {
            // we are doing the editing
            return;
          } // validate input


          _this4.models_only && (!models_or_view_models.length || kb.isModel(models_or_view_models[0])) || !_this4.models_only && (!models_or_view_models.length || _.isObject(models_or_view_models[0]) && !kb.isModel(models_or_view_models[0])) || kb._throwUnexpected(_this4, 'incorrect type passed');
          observable = kb.utils.wrappedObservable(_this4);
          collection = kb.peek(_this4._collection);
          has_filters = kb.peek(_this4._filters).length;

          if (!collection) {
            // no collection or we are updating ourselves
            return;
          }

          view_models = models_or_view_models; // set Models

          if (_this4.models_only) {
            models = _.filter(models_or_view_models, function (model) {
              return !has_filters || _this4._selectModel(model);
            });
          } else {
            // set ViewModels
            !has_filters || (view_models = []); // check for filtering of ViewModels

            models = [];

            for (i = 0, len = models_or_view_models.length; i < len; i++) {
              view_model = models_or_view_models[i];
              model = kb.utils.wrappedObject(view_model);

              if (has_filters) {
                if (!_this4._selectModel(model)) {
                  // filtered so skip
                  continue;
                }

                view_models.push(view_model);
              } // check for view models being different (will occur if a ko select selectedOptions is bound to this collection observable) -> update our store


              if (current_view_model = _this4.create_options.store.find(model, _this4.create_options.creator)) {
                current_view_model.constructor === view_model.constructor || kb._throwUnexpected(_this4, 'replacing different type of view model');
              }

              _this4.create_options.store.retain(view_model, model, _this4.create_options.creator);

              models.push(model);
            }
          } // a change, update models


          _this4.in_edit++;
          models_or_view_models.length === view_models.length || observable(view_models); // replace the ViewModels because they were filtered

          _.isEqual(collection.models, models) || collection.reset(models);
          _this4.in_edit--;
        });
      } // @nodoc

    }, {
      key: "_attributeComparator",
      value: function _attributeComparator(sort_attribute) {
        var modelAttributeCompare;

        modelAttributeCompare = function modelAttributeCompare(model_a, model_b) {
          var attribute_name;
          attribute_name = ko.utils.unwrapObservable(sort_attribute);
          return kb.compare(model_a.get(attribute_name), model_b.get(attribute_name));
        };

        return this.models_only ? modelAttributeCompare : function (model_a, model_b) {
          return modelAttributeCompare(kb.utils.wrappedModel(model_a), kb.utils.wrappedModel(model_b));
        };
      } // @nodoc

    }, {
      key: "_createViewModel",
      value: function _createViewModel(model) {
        if (this.models_only) {
          return model;
        }

        return this.create_options.store.retainOrCreate(model, this.create_options);
      } // @nodoc

    }, {
      key: "_selectModel",
      value: function _selectModel(model) {
        var filter, filters, i, len, ref;
        filters = kb.peek(this._filters);

        for (i = 0, len = filters.length; i < len; i++) {
          filter = filters[i];
          filter = kb.peek(filter);

          if (_.isFunction(filter)) {
            if (!filter(model)) {
              return false;
            }
          } else if (_.isArray(filter)) {
            if (ref = model.id, indexOf.call(filter, ref) < 0) {
              return false;
            }
          } else {
            if (model.id !== filter) {
              return false;
            }
          }
        }

        return true;
      }
    }]);

    return CollectionObservable;
  }();

  ; // @nodoc

  CollectionObservable.extend = kb.extend; // for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")

  return CollectionObservable;
}.call(void 0); // factory function


kb.collectionObservable = function (collection, view_model, options) {
  return new kb.CollectionObservable(arguments);
};

kb.observableCollection = kb.collectionObservable;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var _, kb, ko;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
ko = _kb.ko;

// Used to provide a central place to aggregate registered Model events rather than having all kb.Observables register for updates independently.
kb.EventWatcher = /*#__PURE__*/function () {
  function EventWatcher(emitter, obj, callback_options) {
    _classCallCheck(this, EventWatcher);

    //###################################################
    // Internal
    //###################################################
    // @nodoc
    // NOTE: this is called by registerCallbacks so the model could already be bound and we just want to bind the new info
    // NOTE: this is called by emitter so it may be used to clear a previous emitter without triggering an intermediate change
    this._onModelLoaded = this._onModelLoaded.bind(this); // @nodoc

    this._onModelUnloaded = this._onModelUnloaded.bind(this); // @nodoc

    this._unbindCallbacks = this._unbindCallbacks.bind(this);
    this.__kb || (this.__kb = {});
    this.__kb.callbacks = {};
    this.ee = null;

    if (callback_options) {
      this.registerCallbacks(obj, callback_options);
    }

    if (emitter) {
      this.emitter(emitter);
    }
  } // Required clean up function to break cycles, release view emitters, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(EventWatcher, [{
    key: "destroy",
    value: function destroy() {
      this.emitter(null);
      this.__kb.callbacks = null;
      return kb.utils.wrappedDestroy(this);
    } // Dual-purpose getter/setter for the observed emitter.
    // @overload emitter()
    //   Gets the emitter or emitter reference
    //   @return [Model|ModelRef] the emitter whose attributes are being observed (can be null)
    // @overload emitter(new_emitter)
    //   Sets the emitter or emitter reference
    //   @param [Model|ModelRef] new_emitter the emitter whose attributes will be observed (can be null)

  }, {
    key: "emitter",
    value: function emitter(new_emitter) {
      if (arguments.length === 0 || this.ee === new_emitter) {
        // get or no change
        return this.ee;
      } // clear and unbind previous


      if (this.model_ref) {
        this.model_ref.unbind('loaded', this._onModelLoaded);
        this.model_ref.unbind('unloaded', this._onModelUnloaded);
        this.model_ref.release();
        this.model_ref = null;
      } // set up current


      if (kb.Backbone && kb.Backbone.ModelRef && new_emitter instanceof kb.Backbone.ModelRef) {
        this.model_ref = new_emitter;
        this.model_ref.retain();
        this.model_ref.bind('loaded', this._onModelLoaded);
        this.model_ref.bind('unloaded', this._onModelUnloaded);
        new_emitter = this.model_ref.model() || null;
      } else {
        delete this.model_ref;
      } // switch bindings


      if (this.ee !== new_emitter) {
        if (new_emitter) {
          this._onModelLoaded(new_emitter);
        } else {
          this._onModelUnloaded(this.ee);
        }
      }

      return new_emitter;
    } // Used to register callbacks for an emitter.
    // @param [Object] obj the owning object.
    // @param [Object] callback_info the callback information
    // @option options [Function] emitter callback for when the emitter changes (eg. is loaded). Signature: function(new_emitter)
    // @option options [Function] update callback for when the registered emitter is triggered. Signature: function(new_value)
    // @option options [String] emitter_name the name of the emitter.
    // @option options [String] key the optional key to filter update attribute events.

  }, {
    key: "registerCallbacks",
    value: function registerCallbacks(obj, callback_info) {
      var _this = this;

      var event_name, event_names, i, len, model;
      obj || kb._throwMissing(this, 'obj');
      callback_info || kb._throwMissing(this, 'callback_info');
      event_names = callback_info.event_selector ? callback_info.event_selector.split(' ') : ['change'];
      model = this.ee;

      for (i = 0, len = event_names.length; i < len; i++) {
        event_name = event_names[i];

        if (!event_name) {
          // extra spaces
          continue;
        }

        (function (event_name) {
          var callbacks, info;

          if (!(callbacks = _this.__kb.callbacks[event_name])) {
            callbacks = _this.__kb.callbacks[event_name] = {
              model: null,
              list: [],
              fn: function fn(model) {
                var info, j, len1, ref;
                ref = callbacks.list;

                for (j = 0, len1 = ref.length; j < len1; j++) {
                  info = ref[j];

                  if (!info.update) {
                    continue;
                  }

                  if (model && info.key && model.hasChanged && !model.hasChanged(ko.utils.unwrapObservable(info.key))) {
                    // key doesn't match
                    continue;
                  }

                  !kb.statistics || kb.statistics.addModelEvent({
                    name: event_name,
                    model: model,
                    key: info.key,
                    path: info.path
                  });
                  info.update(); // trigger update
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

      return this;
    }
  }, {
    key: "releaseCallbacks",
    value: function releaseCallbacks(obj) {
      var callbacks, event_name, ref;
      this.ee = null;
      ref = this.__kb.callbacks; // unbind all events

      for (event_name in ref) {
        callbacks = ref[event_name];

        this._unbindCallbacks(event_name, callbacks, kb.wasReleased(obj));
      }

      return delete this.__kb.callbacks;
    }
  }, {
    key: "_onModelLoaded",
    value: function _onModelLoaded(model) {
      var callbacks, event_name, i, info, len, ref, ref1, ref2;
      this.ee = model;
      ref = this.__kb.callbacks; // bind all events

      for (event_name in ref) {
        callbacks = ref[event_name];

        if (callbacks.model && callbacks.model !== model) {
          this._unbindCallbacks(event_name, callbacks, true);
        }

        if (!callbacks.model) {
          callbacks.model = model, model.bind(event_name, callbacks.fn);
        }

        ref1 = callbacks.list;

        for (i = 0, len = ref1.length; i < len; i++) {
          info = ref1[i];
          info.unbind_fn || (info.unbind_fn = (ref2 = kb.settings.orm) != null ? ref2.bind(model, info.key, info.update, info.path) : void 0);
          info.emitter ? info.emitter(model) : void 0;
        }
      }
    }
  }, {
    key: "_onModelUnloaded",
    value: function _onModelUnloaded(model) {
      var callbacks, event_name, ref;

      if (this.ee !== model) {
        return;
      }

      this.ee = null;
      ref = this.__kb.callbacks; // unbind all events

      for (event_name in ref) {
        callbacks = ref[event_name];

        this._unbindCallbacks(event_name, callbacks);
      }
    }
  }, {
    key: "_unbindCallbacks",
    value: function _unbindCallbacks(event_name, callbacks, skip_emitter) {
      var i, info, len, ref;

      if (callbacks.model) {
        callbacks.model.unbind(event_name, callbacks.fn), callbacks.model = null;
      }

      ref = callbacks.list;

      for (i = 0, len = ref.length; i < len; i++) {
        info = ref[i];

        if (info.unbind_fn) {
          info.unbind_fn(), info.unbind_fn = null;
        }

        if (info.emitter && !skip_emitter && !kb.wasReleased(info.obj)) {
          info.emitter(null);
        }
      }
    }
  }], [{
    key: "useOptionsOrCreate",
    value: // Used to either register yourself with the existing emitter watcher or to create a new one.
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
        if (!(options.event_watcher.emitter() === emitter || options.event_watcher.model_ref === emitter)) {
          kb._throwUnexpected(this, 'emitter not matching');
        }

        return kb.utils.wrappedEventWatcher(obj, options.event_watcher).registerCallbacks(obj, callback_options);
      } else {
        kb.utils.wrappedEventWatcherIsOwned(obj, true);
        return kb.utils.wrappedEventWatcher(obj, new kb.EventWatcher(emitter)).registerCallbacks(obj, callback_options);
      }
    }
  }]);

  return EventWatcher;
}(); // factory function


kb.emitterObservable = function (emitter, observable) {
  return new kb.EventWatcher(emitter, observable);
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var _, kb;

var _kb = kb = __webpack_require__(0);

_ = _kb._;

// Used to share the hierachy of constructors and create functions by path to allow for custom creation per Model attribute.
// @example Create an instance by path.
//   var factory = new kb.Factory();
//   factory.addPathMapping('bob.the.builder', kb.ViewModel);
//   view_model = factory.createForPath(new Backbone.Model({name: 'Bob'}), 'bob.the.builder'); // creates kb.ViewModel
kb.Factory = /*#__PURE__*/function () {
  function Factory(parent_factory) {
    _classCallCheck(this, Factory);

    this.paths = {};

    if (parent_factory) {
      this.parent_factory = parent_factory;
    }
  }

  _createClass(Factory, [{
    key: "hasPath",
    value: function hasPath(path) {
      var ref;
      return this.paths.hasOwnProperty(path) || ((ref = this.parent_factory) != null ? ref.hasPath(path) : void 0);
    }
  }, {
    key: "addPathMapping",
    value: function addPathMapping(path, create_info) {
      return this.paths[path] = create_info;
    }
  }, {
    key: "addPathMappings",
    value: function addPathMappings(factories, owner_path) {
      var create_info, path;

      for (path in factories) {
        create_info = factories[path];
        this.paths[kb.utils.pathJoin(owner_path, path)] = create_info;
      }
    }
  }, {
    key: "hasPathMappings",
    value: function hasPathMappings(factories, owner_path) {
      var all_exist, creator, existing_creator, path;
      all_exist = true;

      for (path in factories) {
        creator = factories[path];
        all_exist &= (existing_creator = this.creatorForPath(null, kb.utils.pathJoin(owner_path, path))) && creator === existing_creator;
      }

      return all_exist;
    } // If possible, creates an observable for an object using a dot-deliminated path.
    // @example Create an instance by path.
    //   var factory = new kb.Factory();
    //   factory.addPathMapping('bob.the.builder', kb.ViewModel);
    //   view_model = factory.createForPath(new Backbone.Model({name: 'Bob'}), 'bob.the.builder'); // creates kb.ViewModel

  }, {
    key: "creatorForPath",
    value: function creatorForPath(obj, path) {
      var creator, ref;

      if (creator = this.paths[path]) {
        return creator.view_model ? creator.view_model : creator;
      }

      if (creator = (ref = this.parent_factory) != null ? ref.creatorForPath(obj, path) : void 0) {
        return creator;
      }

      return null;
    }
  }], [{
    key: "useOptionsOrCreate",
    value: // Used to either register yourself with the existing factory or to create a new factory.
    // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
    // @option options [Object] factories a map of dot-deliminated paths; for example 'models.owner': kb.ViewModel to either constructors or create functions. Signature: 'some.path': function(object, options)
    // @param [Instance] obj the instance that will own or register with the store
    // @param [String] owner_path the path to the owning object for turning relative scoping of the factories to absolute paths.
    function useOptionsOrCreate(options, obj, owner_path) {
      var factory; // share

      if (options.factory && (!options.factories || options.factories && options.factory.hasPathMappings(options.factories, owner_path))) {
        return kb.utils.wrappedFactory(obj, options.factory);
      } // create a new factory


      factory = kb.utils.wrappedFactory(obj, new kb.Factory(options.factory));

      if (options.factories) {
        factory.addPathMappings(options.factories, owner_path);
      }

      return factory;
    }
  }]);

  return Factory;
}();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var kb;
module.exports = kb = __webpack_require__(0);
kb.configure = __webpack_require__(1); // re-expose modules

kb.modules = {
  underscore: kb._,
  backbone: kb.Parse || kb.Backbone,
  knockout: kb.ko
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var _, _ko_applyBindings, kb, ko, _onReady, window;

window = window != null ? window : global;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
ko = _kb.ko;
kb.RECUSIVE_AUTO_INJECT = true; // custom Knockout `inject` binding

ko.bindingHandlers['inject'] = {
  'init': function init(element, value_accessor, all_bindings_accessor, view_model) {
    return kb.Inject.inject(ko.utils.unwrapObservable(value_accessor()), view_model, element, value_accessor, all_bindings_accessor);
  }
}; // Used to inject ViewModels and observables dynamically from your HTML Views. For both the `'kb-inject'` attribute and the data-bind `'inject'` custom binding, the following properties are reserved:
// * `'view_model'` class used to create a new ViewModel instance
// * `'create'` function used to manually add observables to a view model
// * `'options'` to pass to ko.applyBindings
// * `'afterBinding'` callback (can alternatively be in the options)
// * `'beforeBinding'` callback (can alternatively be in the options)
// Each function/constructor gets called with the following signature `'function(view_model, element)'`.
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

kb.Inject = /*#__PURE__*/function () {
  function Inject() {
    _classCallCheck(this, Inject);
  }

  _createClass(Inject, null, [{
    key: "inject",
    value: // @private
    function inject(data, view_model, element, value_accessor, all_bindings_accessor, nested) {
      var inject;

      inject = function inject(data) {
        var key, target, value;

        if (_.isFunction(data)) {
          view_model = new data(view_model, element, value_accessor, all_bindings_accessor); // use 'new' to allow for classes in addition to functions

          kb.releaseOnNodeRemove(view_model, element);
        } else {
          // view_model constructor causes a scope change
          if (data.view_model) {
            // specifying a view_model changes the scope so we need to bind a destroy
            view_model = new data.view_model(view_model, element, value_accessor, all_bindings_accessor);
            kb.releaseOnNodeRemove(view_model, element);
          } // resolve and merge in each key


          for (key in data) {
            value = data[key];

            if (key === 'view_model') {
              continue;
            } // create function


            if (key === 'create') {
              value(view_model, element, value_accessor, all_bindings_accessor); // resolve nested with assign or not
            } else if (_.isObject(value) && !_.isFunction(value)) {
              target = nested || value && value.create ? {} : view_model;
              view_model[key] = kb.Inject.inject(value, target, element, value_accessor, all_bindings_accessor, true);
            } else {
              // simple set
              view_model[key] = value;
            }
          }
        }

        return view_model;
      }; // in recursive calls, we are already protected from propagating dependencies to the template


      if (nested) {
        return inject(data);
      } else {
        return kb.ignore(function () {
          return inject(data);
        });
      }
    } // Searches the DOM from root or document for elements with the `'kb-inject'` attribute and create/customizes ViewModels for the DOM tree when encountered. Also, used with the data-bind `'inject'` custom binding.
    // @param [DOM element] root the root DOM element to start searching for `'kb-inject'` attributes.
    // @return [Array] array of Objects with the DOM elements and ViewModels that were bound in the form `{el: DOM element, view_model: ViewModel}`.

  }, {
    key: "injectViewModels",
    value: function injectViewModels(root) {
      var afterBinding, app, beforeBinding, data, expression, _findElements, i, len, options, results; // find all of the app elements


      results = [];

      _findElements = function findElements(el) {
        var attr, child_el, i, len, ref;

        if (!el.__kb_injected) {
          // already injected -> skip, but still process children in case they were added afterwards
          if (el.attributes && (attr = _.find(el.attributes, function (attr) {
            return attr.name === 'kb-inject';
          }))) {
            el.__kb_injected = true; // mark injected

            results.push({
              el: el,
              view_model: {},
              binding: attr.value
            });
          }
        }

        ref = el.childNodes;

        for (i = 0, len = ref.length; i < len; i++) {
          child_el = ref[i];

          _findElements(child_el);
        }
      };

      if (!root && (window != null ? window.document : void 0)) {
        root = window.document;
      }

      _findElements(root); // bind the view models


      for (i = 0, len = results.length; i < len; i++) {
        app = results[i]; // evaluate the app data

        if (expression = app.binding) {
          expression.search(/[:]/) < 0 || (expression = "{".concat(expression, "}"));
          data = new Function("", "return ( ".concat(expression, " )"))();
          data || (data = {}); // no data

          !data.options || (options = data.options, delete data.options); // extract options

          options || (options = {});
          app.view_model = kb.Inject.inject(data, app.view_model, app.el, null, null, true);
          afterBinding = app.view_model.afterBinding || options.afterBinding;
          beforeBinding = app.view_model.beforeBinding || options.beforeBinding;
        }

        if (beforeBinding) {
          // auto-bind
          beforeBinding.call(app.view_model, app.view_model, app.el, options);
        }

        kb.applyBindings(app.view_model, app.el, options);

        if (afterBinding) {
          afterBinding.call(app.view_model, app.view_model, app.el, options);
        }
      }

      return results;
    }
  }]);

  return Inject;
}(); // auto-inject recursively


_ko_applyBindings = ko.applyBindings;

ko.applyBindings = function (context, element) {
  var results;
  results = kb.RECUSIVE_AUTO_INJECT ? kb.injectViewModels(element) : [];

  if (!results.length) {
    return _ko_applyBindings.apply(this, arguments);
  }
}; //############################
// Aliases
//############################


kb.injectViewModels = kb.Inject.injectViewModels; //############################
// Auto Inject results
//############################

if (typeof document !== "undefined" && document !== null) {
  // use simple ready check
  (_onReady = function onReady() {
    if (document.readyState !== 'complete') {
      // keep waiting for the document to load
      return setTimeout(_onReady, 0);
    }

    return kb.injectViewModels(); // the document is loaded
  })();
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var _extend, kb, ko, ref, ref1;

var _kb = kb = __webpack_require__(0);

ko = _kb.ko;

// Allow for dependent release until is resolved https://github.com/knockout/knockout/issues/1464
if ((ref = ko.subscribable) != null ? (ref1 = ref.fn) != null ? ref1.extend : void 0 : void 0) {
  _extend = ko.subscribable.fn.extend;

  ko.subscribable.fn.extend = function () {
    var _arguments = arguments,
        _this = this;

    var _dispose, target;

    target = _extend.apply(this, arguments); // release the extended observable

    if (target !== this && kb.isReleaseable(this)) {
      _dispose = target.dispose;

      target.dispose = function () {
        if (_dispose != null) {
          _dispose.apply(target, _arguments);
        }

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


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var KEYS_INFO, KEYS_PUBLISH, TypedValue, _, kb, ko;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
ko = _kb.ko;
TypedValue = __webpack_require__(2);
KEYS_PUBLISH = ['value', 'valueType', 'destroy'];
KEYS_INFO = ['args', 'read', 'write']; // Base class for observing model attributes.
// @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
//   var ContactViewModel = function(model) {
//     this.name = kb.observable(model, 'name');
//     this.number = kb.observable(model, { key: 'number'});
//   };
//   var model = new Contact({ name: 'Ringo', number: '555-555-5556' });
//   var view_model = new ContactViewModel(model);
// @example How to create a kb.Observable with a default value.
//   var model = Backbone.Model({name: 'Bob'});
//   var name = kb.observable(model, {key:'name', default: '(none)'}); // name is Bob
//   name.setToDefault(); // name is (none)
// @method #model()
//   Dual-purpose getter/setter ko.computed for the observed model.
//   @return [Model|ModelRef|void] getter: the model whose attributes are being observed (can be null) OR setter: void
//   @example
//     var observable = kb.observable(new Backbone.Model({name: 'bob'}), 'name');
//     var the_model = observable.model(); // get
//     observable.model(new Backbone.Model({name: 'fred'})); // set

kb.Observable = /*#__PURE__*/function () {
  // Used to create a new kb.Observable.
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
  function Observable(model, key_or_info, options) {
    var _this = this;

    var _vm = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, Observable);

    this._vm = _vm;
    return kb.ignore(function () {
      var create_options, event_watcher, i, key, len, observable;
      key_or_info || kb._throwMissing(_this, 'key_or_info');
      _this.key = key_or_info.key || key_or_info;

      for (i = 0, len = KEYS_INFO.length; i < len; i++) {
        key = KEYS_INFO[i];

        if (key_or_info[key]) {
          _this[key] = key_or_info[key];
        }
      }

      create_options = kb.utils.collapseOptions(options);
      event_watcher = create_options.event_watcher;
      delete create_options.event_watcher; // set up basics

      _this._value = new TypedValue(create_options);
      _this._model = ko.observable();
      observable = kb.utils.wrappedObservable(_this, ko.computed({
        read: function read() {
          var _model, arg, args, j, len1, ref, ref1;

          _model = _this._model();
          ref = args = [_this.key].concat(_this.args || []);

          for (j = 0, len1 = ref.length; j < len1; j++) {
            arg = ref[j];
            ko.utils.unwrapObservable(arg);
          }

          if ((ref1 = kb.utils.wrappedEventWatcher(_this)) != null) {
            ref1.emitter(_model || null); // update the event watcher
          }

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
            var _model, unwrapped_new_value;

            unwrapped_new_value = kb.utils.unwrapModels(new_value); // unwrap for set (knockout may pass view models which are required for the observable but not the model)

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

      delete create_options.factories; // publish public interface on the observable and return instead of this

      kb.publishMethods(observable, _this, KEYS_PUBLISH); // use external model observable or create

      observable.model = _this.model = ko.computed({
        read: function read() {
          return ko.utils.unwrapObservable(_this._model);
        },
        write: function write(new_model) {
          return kb.ignore(function () {
            var new_value;

            if (_this.__kb_released || kb.peek(_this._model) === new_model) {
              // destroyed or no change
              return;
            } // update references


            new_value = kb.getValue(new_model, kb.peek(_this.key), _this.args);

            _this._model(new_model);

            if (!new_model) {
              return _this.update(null);
            } else if (!_.isUndefined(new_value)) {
              return _this.update(new_value);
            }
          });
        }
      });
      kb.EventWatcher.useOptionsOrCreate({
        event_watcher: event_watcher
      }, model || null, _this, {
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

      if (kb.LocalizedObservable && key_or_info.localizer) {
        // wrap ourselves with a localizer
        observable = new key_or_info.localizer(observable);
      }

      if (kb.DefaultObservable && key_or_info.hasOwnProperty('default')) {
        // wrap ourselves with a default value
        observable = kb.defaultObservable(observable, key_or_info["default"]);
      }

      return observable;
    });
  } // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(Observable, [{
    key: "destroy",
    value: function destroy() {
      var observable;
      observable = kb.utils.wrappedObservable(this);
      this.__kb_released = true;

      this._value.destroy();

      this._value = null;
      this.model.dispose();
      this.model = observable.model = null;
      return kb.utils.wrappedDestroy(this);
    } // @return [kb.CollectionObservable|kb.ViewModel|ko.observable] exposes the raw value inside the kb.observable. For example, if your attribute is a Collection, it will hold a CollectionObservable.

  }, {
    key: "value",
    value: function value() {
      return this._value.rawValue();
    } // @return [kb.TYPE_UNKNOWN|kb.TYPE_SIMPLE|kb.TYPE_ARRAY|kb.TYPE_MODEL|kb.TYPE_COLLECTION] provides the type of the wrapped value.

  }, {
    key: "valueType",
    value: function valueType() {
      return this._value.valueType(kb.peek(this._model), kb.peek(this.key));
    } //###################################################
    // Internal
    //###################################################
    // @nodoc

  }, {
    key: "update",
    value: function update(new_value) {
      if (this.__kb_released) {
        // destroyed, nothing to do
        return;
      }

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

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var _, kb;

var _kb = kb = __webpack_require__(0);

_ = _kb._;

// kb.Statistics is an optional components that is useful for measuring your application's performance. You can record all of the Backbone.Events that have triggered ko.observable subscription updates and the memory footprint (instance count-only) of your ViewModels and collection observables.
// kb.Statistics is not included in `knockback.js` nor `knockback-core.js` so you need to manually include it from the `lib` directory.
module.exports = kb.Statistics = /*#__PURE__*/function () {
  function Statistics() {
    _classCallCheck(this, Statistics);

    this.model_events_tracker = [];
    this.registered_tracker = {};
  } // Clear the tracked model events (but keep the registered objects intact)


  _createClass(Statistics, [{
    key: "clear",
    value: function clear() {
      return this.model_events_tracker = [];
    } //##############################
    // Registered Events
    //##############################
    // Register a model event

  }, {
    key: "addModelEvent",
    value: function addModelEvent(event) {
      return this.model_events_tracker.push(event);
    } // A debug helper to summarize the registered events in human-readable form

  }, {
    key: "modelEventsStatsString",
    value: function modelEventsStatsString() {
      var event_groups, key, stats_string, value;
      stats_string = '';
      stats_string += "Total Count: ".concat(this.model_events_tracker.length);
      event_groups = _.groupBy(this.model_events_tracker, function (test) {
        return "event name: '".concat(test.name, "', attribute name: '").concat(test.key, "'");
      });

      for (key in event_groups) {
        value = event_groups[key];
        stats_string += "\n ".concat(key, ", count: ").concat(value.length);
      }

      return stats_string;
    } //##############################
    // Registered Observables and View Models
    //##############################
    // Register an object by key

  }, {
    key: "register",
    value: function register(key, obj) {
      return this.registeredTracker(key).push(obj);
    } // Unregister an object by key

  }, {
    key: "unregister",
    value: function unregister(key, obj) {
      var index, type_tracker;
      type_tracker = this.registeredTracker(key);

      if ((index = _.indexOf(type_tracker, obj)) < 0) {
        return typeof console !== "undefined" && console !== null ? console.log("kb.Statistics: failed to unregister type: ".concat(key)) : void 0;
      }

      return type_tracker.splice(index, 1);
    } // @return [Integer] the number of registered objects by type

  }, {
    key: "registeredCount",
    value: function registeredCount(type) {
      var count, ref, type_tracker;

      if (type) {
        return this.registeredTracker(type).length;
      }

      count = 0;
      ref = this.registered_tracker[type];

      for (type in ref) {
        type_tracker = ref[type];
        count += type_tracker.length;
      }

      return count;
    } // A debug helper to summarize the current registered objects by key
    // @param [String] success_message a message to return if there are no registered objects
    // @return [String] a human readable string summarizing the currently registered objects or success_message

  }, {
    key: "registeredStatsString",
    value: function registeredStatsString(success_message) {
      var ref, stats_string, type, type_tracker, written;
      stats_string = '';
      ref = this.registered_tracker;

      for (type in ref) {
        type_tracker = ref[type];

        if (!type_tracker.length) {
          continue;
        }

        if (written) {
          stats_string += '\n ';
        }

        stats_string += "".concat(type ? type : 'No Name', ": ").concat(type_tracker.length);
        written = true;
      }

      if (stats_string) {
        return stats_string;
      } else {
        return success_message;
      }
    } // @nodoc

  }, {
    key: "registeredTracker",
    value: function registeredTracker(key) {
      var type_tracker;

      if (this.registered_tracker.hasOwnProperty(key)) {
        return this.registered_tracker[key];
      }

      type_tracker = [];
      this.registered_tracker[key] = type_tracker;
      return type_tracker;
    }
  }], [{
    key: "eventsStats",
    value: function eventsStats(obj, key) {
      var events, i, len, node, ref, stats, tail;
      stats = {
        count: 0
      };
      events = obj._events || obj._callbacks || {};
      ref = key ? [key] : _.keys(events);

      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];

        if (!(node = events[key])) {
          continue;
        }

        if (_.isArray(node)) {
          stats[key] = _.compact(node).length;
        } else {
          stats[key] = 0;
          tail = node.tail;

          while ((node = node.next) !== tail) {
            stats[key]++;
          }
        }

        stats.count += stats[key];
      }

      return stats;
    }
  }]);

  return Statistics;
}();

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var _, kb, ko;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
ko = _kb.ko;

// Used to share and manage the persistence of ViewModels and observables. ks.Store can be used to break relationship cycles between models, to reduce memory usage, and to share view models between kb.CollectionObservables (for example, when using Knockout.js selectedOptions).
// @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
//   var co = kb.collectionObservable(new Backbone.Collection());
//   var co_selected_options = kb.collectionObservable(new Backbone.Collection(), {
//     store: kb.utils.wrappedStore(co)
//   });
module.exports = kb.Store = function () {
  var Store = /*#__PURE__*/function () {
    // Used to create a new kb.Store.
    function Store() {
      _classCallCheck(this, Store);

      this.observable_records = {};
      this.replaced_observables = [];
      kb.Store.instances.push(this);
    } // Required clean up function to break cycles, release view models, etc.
    // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


    _createClass(Store, [{
      key: "destroy",
      value: function destroy() {
        var index;
        this.__kb_released = true;
        this.clear();

        if ((index = _.indexOf(kb.Store.instances, this)) >= 0) {
          return kb.Store.instances.splice(index, 1);
        }
      } // Manually clear the store

    }, {
      key: "clear",
      value: function clear() {
        var cid, creator_id, i, len, observable, observable_records, records, replaced_observables;
        var _ref = [this.observable_records, {}];
        observable_records = _ref[0];
        this.observable_records = _ref[1];

        for (creator_id in observable_records) {
          records = observable_records[creator_id];

          for (cid in records) {
            observable = records[cid];
            this.release(observable, true);
          }
        }

        var _ref2 = [this.replaced_observables, []];
        replaced_observables = _ref2[0];
        this.replaced_observables = _ref2[1];

        for (i = 0, len = replaced_observables.length; i < len; i++) {
          observable = replaced_observables[i];

          if (!observable.__kb_released) {
            this.release(observable, true);
          }
        }
      } // Manually compact the store by searching for released view models

    }, {
      key: "compact",
      value: function compact() {
        var cid, creator_id, observable, records, ref;
        ref = this.observable_records;

        for (creator_id in ref) {
          records = ref[creator_id];

          for (cid in records) {
            observable = records[cid];

            if (observable.__kb_released) {
              delete records[cid];
            }
          }
        }
      } // Used to register a new view model with the store.
      // @param [Model] obj the Model
      // @param [ko.observable] observable the observable to share for the Model
      // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
      // @option options [Constructor|Function] creator the constructor or function used to create the observable. It is used to match observables in the store.
      // @option options [String] path the path to the value (used to create related observables from the factory).
      // @option options [kb.Store] store a store used to cache and share view models.
      // @option options [kb.Factory] factory a factory used to create view models.
      // @example retain an observable with the store
      //   store.retain(observable, obj, creator);

    }, {
      key: "retain",
      value: function retain(observable, obj, creator) {
        var current_observable;

        if (!this._canRegister(observable)) {
          return;
        }

        creator || (creator = observable.constructor); // default is to use the constructor

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
      } // Used to find an existing observable in the store or create a new one if it doesn't exist.
      // @param [Model|Collection|Data] obj the object to create the observable for. Only Models are cached in the store.
      // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
      // @param [boolean] deep_retain setting to true retains an existing observable when found.
      // @option options [Constructor|Function] creator the constructor or function used to create the observable. It is used to match observables in the store.
      // @option options [String] path the path to the value (used to create related observables from the factory).
      // @option options [kb.Store] store a store used to cache and share view models.
      // @option options [kb.Factory] factory a factory used to create view models.
      // @example register an observable with the store
      //   observable = store.retainOrCreate(value, {path: kb.utils.wrappedPath(observable), factory: kb.utils.wrappedFactory(observable)})

    }, {
      key: "retainOrCreate",
      value: function retainOrCreate(obj, options, deep_retain) {
        var _this = this;

        var creator, observable;

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
          throw new Error("Invalid factory for \"".concat(options.path, "\""));
        }

        observable = kb.ignore(function () {
          options = _.defaults({
            store: _this,
            creator: creator
          }, options); // set our own creator so we can register ourselves above

          observable = creator.create ? creator.create(obj, options) : new creator(obj, options);
          return observable || ko.observable(null); // default to null
        });
        this.retain(observable, obj, creator);
        return observable;
      } // @nodoc

    }, {
      key: "reuse",
      value: function reuse(observable, obj) {
        var creator, current_obj, current_observable;

        if ((current_obj = kb.utils.wrappedObject(observable)) === obj) {
          return;
        }

        if (!this._canRegister(observable)) {
          throw new Error('Cannot reuse a simple observable');
        }

        if (this._refCount(observable) !== 1) {
          throw new Error("Trying to change a shared view model. Ref count: ".concat(this._refCount(observable)));
        }

        creator = kb.utils.wrappedCreator(observable) || observable.constructor; // default is to use the constructor

        if (!_.isUndefined(current_obj)) {
          current_observable = this.find(current_obj, creator);
        }

        this.retain(observable, obj, creator);

        if (current_observable) {
          this.release(current_observable);
        }
      } // Release a reference to a a ViewModel in this store.

    }, {
      key: "release",
      value: function release(observable, force) {
        var store_references;

        if (!this._canRegister(observable)) {
          // just release
          return kb.release(observable);
        } // maybe be externally added


        if (store_references = this._storeReferences(observable)) {
          if (!force && --store_references.ref_count > 0) {
            // do not release yet
            return;
          }

          this._clearStoreReferences(observable);
        }

        this._remove(observable);

        if (observable.__kb_released) {
          return;
        }

        if (force || this._refCount(observable) <= 1) {
          // allow for a single initial reference in another store
          return kb.release(observable);
        }
      } // @nodoc

    }, {
      key: "find",
      value: function find(obj, creator) {
        var observable, records, ref;

        if (!(records = this.observable_records[this._creatorId(creator)])) {
          return null;
        }

        if ((ref = observable = records[this._cid(obj)]) != null ? ref.__kb_released : void 0) {
          delete records[this._cid(obj)];
          return null;
        }

        return observable;
      } // @nodoc

    }, {
      key: "_refCount",
      value: function _refCount(observable) {
        var stores_references;

        if (observable.__kb_released) {
          if (typeof console !== "undefined" && console !== null) {
            console.log('Observable already released');
          }

          return 0;
        }

        if (!(stores_references = kb.utils.get(observable, 'stores_references'))) {
          return 1;
        }

        return _.reduce(stores_references, function (memo, store_references) {
          return memo + store_references.ref_count;
        }, 0);
      } // @nodoc

    }, {
      key: "_canRegister",
      value: function _canRegister(observable) {
        return observable && !ko.isObservable(observable) && !observable.__kb_is_co; // only register view models not basic ko.observables nor kb.CollectionObservables
      } // @nodoc

    }, {
      key: "_cid",
      value: function _cid(obj) {
        var cid;
        return cid = obj ? obj.cid || (obj.cid = _.uniqueId('c')) : 'null';
      } // @nodoc

    }, {
      key: "_creatorId",
      value: function _creatorId(creator) {
        var create, i, item, len, ref;
        create = creator.create || creator;
        create.__kb_cids || (create.__kb_cids = []);
        ref = create.__kb_cids;

        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];

          if (item.create === create) {
            return item.cid;
          }
        }

        create.__kb_cids.push(item = {
          create: create,
          cid: _.uniqueId('kb')
        });

        return item.cid;
      } // @nodoc

    }, {
      key: "_storeReferences",
      value: function _storeReferences(observable) {
        var _this2 = this;

        var stores_references;

        if (!(stores_references = kb.utils.get(observable, 'stores_references'))) {
          return;
        }

        return _.find(stores_references, function (store_references) {
          return store_references.store === _this2;
        });
      } // @nodoc

    }, {
      key: "_getOrCreateStoreReferences",
      value: function _getOrCreateStoreReferences(observable) {
        var _this3 = this;

        var store_references, stores_references;
        stores_references = kb.utils.orSet(observable, 'stores_references', []);

        if (!(store_references = _.find(stores_references, function (store_references) {
          return store_references.store === _this3;
        }))) {
          stores_references.push(store_references = {
            store: this,
            ref_count: 0,
            release: function release() {
              return _this3.release(observable);
            }
          });
        }

        return store_references;
      } // @nodoc

    }, {
      key: "_clearStoreReferences",
      value: function _clearStoreReferences(observable) {
        var index, ref, store_references, stores_references;

        if (stores_references = kb.utils.get(observable, 'stores_references')) {
          ref = observable.__kb.stores_references;

          for (index in ref) {
            store_references = ref[index];

            if (store_references.store === this) {
              observable.__kb.stores_references.splice(index, 1);

              break;
            }
          }
        }
      } // @nodoc

    }, {
      key: "_retire",
      value: function _retire(observable) {
        this._clearStoreReferences(observable);

        this.replaced_observables.push(observable);
        return this._remove(observable);
      } // @nodoc

    }, {
      key: "_add",
      value: function _add(observable, obj, creator) {
        var base, name;
        creator || (creator = observable.constructor); // default is to use the constructor

        kb.utils.wrappedObject(observable, obj);
        kb.utils.wrappedCreator(observable, creator);
        return ((base = this.observable_records)[name = this._creatorId(creator)] || (base[name] = {}))[this._cid(obj)] = observable;
      } // @nodoc

    }, {
      key: "_remove",
      value: function _remove(observable) {
        var creator, current_observable, obj;
        creator = kb.utils.wrappedCreator(observable) || observable.constructor; // default is to use the constructor

        if (current_observable = this.find(obj = kb.utils.wrappedObject(observable), creator)) {
          // already released
          if (current_observable === observable) {
            // not already replaced
            delete this.observable_records[this._creatorId(creator)][this._cid(obj)];
          }
        }

        kb.utils.wrappedObject(observable, null);
        return kb.utils.wrappedCreator(observable, null);
      } // @nodoc

    }, {
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
    }], [{
      key: "useOptionsOrCreate",
      value: // Used to either register yourself with the existing store or to create a new store.
      // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
      // @param [Instance] obj the instance that will own or register with the store
      // @param [ko.observable] observable the observable that will own the store
      // @example
      //   kb.Store.useOptionsOrCreate(model, this, options);
      function useOptionsOrCreate(options, obj, observable) {
        var store;

        if (!options.store) {
          kb.utils.wrappedStoreIsOwned(observable, true);
        }

        store = kb.utils.wrappedStore(observable, options.store || new kb.Store());
        store.retain(observable, obj, options.creator);
        return store;
      }
    }]);

    return Store;
  }();

  ; // @nodoc

  Store.instances = [];
  return Store;
}.call(void 0);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var _, kb, ko;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
ko = _kb.ko;

kb.utils = function () {
  //###################################################
  // Public API
  //###################################################
  // Library of general-purpose utilities
  var utils = /*#__PURE__*/function () {
    function utils() {
      _classCallCheck(this, utils);
    }

    _createClass(utils, null, [{
      key: "get",
      value: // @nodoc
      function get(obj, key, default_value) {
        if (!obj.__kb || !obj.__kb.hasOwnProperty(key)) {
          return default_value;
        } else {
          return obj.__kb[key];
        }
      } // @nodoc

    }, {
      key: "set",
      value: function set(obj, key, value) {
        return (obj.__kb || (obj.__kb = {}))[key] = value;
      } // @nodoc

    }, {
      key: "orSet",
      value: function orSet(obj, key, value) {
        if (!(obj.__kb || (obj.__kb = {})).hasOwnProperty(key)) {
          obj.__kb[key] = value;
        }

        return obj.__kb[key];
      } // @nodoc

    }, {
      key: "has",
      value: function has(obj, key) {
        return obj.__kb && obj.__kb.hasOwnProperty(key);
      } // Dual-purpose getter/setter for retrieving and storing the observable on an instance that returns a ko.observable instead of 'this'. Relevant for:
      //   * [kb.CollectionObservable]('classes/kb/CollectionObservable.html')
      //   * [kb.Observable]('classes/kb/Observable.html')
      //   * [kb.DefaultObservable]('classes/kb/DefaultObservable.html')
      //   * [kb.FormattedObservable]('classes/kb/FormattedObservable.html')
      //   * [kb.LocalizedObservable]('classes/kb/LocalizedObservable.html')
      //   * [kb.TriggeredObservable]('classes/kb/TriggeredObservable.html')
      // @overload wrappedObservable(instance)
      //   Gets the observable from an object
      //   @param [Any] instance the owner
      //   @return [ko.observable|ko.observableArray] the observable
      // @overload wrappedObservable(instance, observable)
      //   Sets the observable on an object
      //   @param [Any] instance the owner
      //   @param [ko.observable|ko.observableArray] observable the observable
      // @example
      //   var ShortDateLocalizer = kb.LocalizedObservable.extend({
      //     constructor: function(value, options, view_model) {
      //       kb.LocalizedObservable.prototype.constructor.apply(this, arguments);
      //       return kb.utils.wrappedObservable(this);
      //     }
      //   });

    }, {
      key: "wrappedObservable",
      value: function wrappedObservable(obj, value) {
        if (arguments.length === 1) {
          return kb.utils.get(obj, 'observable');
        } else {
          return kb.utils.set(obj, 'observable', value);
        }
      } // Dual-purpose getter/setter for retrieving and storing the Model or Collection on an owner.
      // @note this is almost the same as {kb.utils.wrappedModel} except that if the Model doesn't exist, it returns null.
      // @overload wrappedObject(obj)
      //   Gets the observable from an object
      //   @param [Object|kb.ViewModel|kb.CollectionObservable] obj owner the ViewModel/CollectionObservable owning the kb.Model or kb.Collection.
      //   @return [Model|Collection] the model/collection
      // @overload wrappedObject(obj, value)
      //   Sets the observable on an object
      //   @param [Object|kb.ViewModel|kb.CollectionObservable] obj owner the ViewModel/CollectionObservable owning the kb.Model or kb.Collection.
      //   @param [Model|Collection] value the model/collection
      // @example
      //   var model = kb.utils.wrappedObject(view_model);
      //   var collection = kb.utils.wrappedObject(collection_observable);

    }, {
      key: "wrappedObject",
      value: function wrappedObject(obj, value) {
        if (arguments.length === 1) {
          return kb.utils.get(obj, 'object');
        } else {
          return kb.utils.set(obj, 'object', value);
        }
      } // @nodoc

    }, {
      key: "wrappedCreator",
      value: function wrappedCreator(obj, value) {
        if (arguments.length === 1) {
          return kb.utils.get(obj, 'creator');
        } else {
          return kb.utils.set(obj, 'creator', value);
        }
      } // Dual-purpose getter/setter for retrieving and storing the Model on a ViewModel.
      // @note this is almost the same as {kb.utils.wrappedObject} except that if the Model doesn't exist, it returns the ViewModel itself (which is useful behaviour for sorting because it you can iterate over a kb.CollectionObservable's ko.ObservableArray whether it holds ViewModels or Models with the models_only option).
      // @overload wrappedModel(view_model)
      //   Gets the model from a ViewModel
      //   @param [Object|kb.ViewModel] view_model the owning ViewModel for the Model.
      //   @return [Model|ViewModel] the Model or ViewModel itself if there is no Model
      // @overload wrappedModel(view_model, model)
      //   Sets the observable on an object
      //   @param [Object|kb.ViewModel] view_model the owning ViewModel for the Model.
      //   @param [Model] model the Model

    }, {
      key: "wrappedModel",
      value: function wrappedModel(obj, value) {
        if (arguments.length === 1) {
          if (_.isUndefined(value = kb.utils.get(obj, 'object'))) {
            return obj;
          } else {
            return value;
          }
        } else {
          return kb.utils.set(obj, 'object', value);
        }
      } // Dual-purpose getter/setter for retrieving and storing a kb.Store on an owner.
      // @overload wrappedStore(obj)
      //   Gets the store from an object
      //   @param [Any] obj the owner
      //   @return [kb.Store] the store
      // @overload wrappedStore(obj, store)
      //   Sets the store on an object
      //   @param [Any] obj the owner
      //   @param [kb.Store] store the store
      // @example
      //   var co = kb.collectionObservable(new Backbone.Collection());
      //   var co_selected_options = kb.collectionObservable(new Backbone.Collection(), {
      //     store: kb.utils.wrappedStore(co)
      //   });

    }, {
      key: "wrappedStore",
      value: function wrappedStore(obj, value) {
        if (arguments.length === 1) {
          return kb.utils.get(obj, 'store');
        } else {
          return kb.utils.set(obj, 'store', value);
        }
      } // @private

    }, {
      key: "wrappedStoreIsOwned",
      value: function wrappedStoreIsOwned(obj, value) {
        if (arguments.length === 1) {
          return kb.utils.get(obj, 'store_is_owned');
        } else {
          return kb.utils.set(obj, 'store_is_owned', value);
        }
      } // Dual-purpose getter/setter for retrieving and storing a kb.Factory on an owner.
      // @overload wrappedFactory(obj)
      //   Gets the factory from an object
      //   @param [Any] obj the owner
      //   @return [kb.Factory] the factory
      // @overload wrappedFactory(obj, factory)
      //   Sets the factory on an object
      //   @param [Any] obj the owner
      //   @param [kb.Factory] factory the factory

    }, {
      key: "wrappedFactory",
      value: function wrappedFactory(obj, value) {
        if (arguments.length === 1) {
          return kb.utils.get(obj, 'factory');
        } else {
          return kb.utils.set(obj, 'factory', value);
        }
      } // Dual-purpose getter/setter for retrieving and storing a kb.EventWatcher on an owner.
      // @overload wrappedEventWatcher(obj)
      //   Gets the event_watcher from an object
      //   @param [Any] obj the owner
      //   @return [kb.EventWatcher] the event_watcher
      // @overload wrappedEventWatcher(obj, event_watcher)
      //   Sets the event_watcher on an object
      //   @param [Any] obj the owner
      //   @param [kb.EventWatcher] event_watcher the event_watcher

    }, {
      key: "wrappedEventWatcher",
      value: function wrappedEventWatcher(obj, value) {
        if (arguments.length === 1) {
          return kb.utils.get(obj, 'event_watcher');
        } else {
          return kb.utils.set(obj, 'event_watcher', value);
        }
      } // @private

    }, {
      key: "wrappedEventWatcherIsOwned",
      value: function wrappedEventWatcherIsOwned(obj, value) {
        if (arguments.length === 1) {
          return kb.utils.get(obj, 'event_watcher_is_owned');
        } else {
          return kb.utils.set(obj, 'event_watcher_is_owned', value);
        }
      } // Retrieves the value stored in a ko.observable.
      // @see kb.Observable valueType
      // @example
      //   var view_model = kb.viewModel(new Model({simple_attr: null, model_attr: null}), {factories: {model_attr: kb.ViewModel});
      //   kb.utils.valueType(view_model.simple_attr); // kb.TYPE_SIMPLE
      //   kb.utils.valueType(view_model.model_attr);  // kb.TYPE_MODEL

    }, {
      key: "valueType",
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
      } // Helper to join a dot-deliminated path.
      // @param [String] path1 start path.
      // @param [String] path2 append path.
      // @return [String] combined dot-delimited path.
      // @example
      //   kb.utils.pathJoin('models', 'name'); // 'models.name'

    }, {
      key: "pathJoin",
      value: function pathJoin(path1, path2) {
        return (path1 ? path1[path1.length - 1] !== '.' ? "".concat(path1, ".") : path1 : '') + path2;
      } // Helper to join a dot-deliminated path with the path on options and returns a new options object with the result.
      // @param [Object] options with path property for the start path
      // @param [String] path append path.
      // @return [Object] new options with combined dot-delimited path `{path: combined_path}`.
      // @example
      //   this.friends = kb.collectionObservable(model.get('friends'), kb.utils.optionsPathJoin(options, 'friends'));

    }, {
      key: "optionsPathJoin",
      value: function optionsPathJoin(options, path) {
        return _.defaults({
          path: this.pathJoin(options.path, path)
        }, options);
      } // Helper to find the creator constructor or function from a factory or ORM solution

    }, {
      key: "inferCreator",
      value: function inferCreator(value, factory, path) {
        var creator;

        if (factory && (creator = factory.creatorForPath(value, path))) {
          return creator;
        }

        if (!value) {
          // try fallbacks
          return null;
        }

        if (value instanceof kb.Model) {
          return kb.ViewModel;
        }

        if (value instanceof kb.Collection) {
          return kb.CollectionObservable;
        }

        return null;
      } // Creates an observable based on a value's type.

    }, {
      key: "createFromDefaultCreator",
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
      } // @nodoc

    }, {
      key: "resolveModel",
      value: function resolveModel(model) {
        if (model && kb.Backbone && kb.Backbone.ModelRef && model instanceof kb.Backbone.ModelRef) {
          return model.model();
        } else {
          return model;
        }
      }
    }]);

    return utils;
  }();

  ; // Clean up function that releases all of the wrapped values on an owner.

  utils.wrappedDestroy = __webpack_require__(23); // Helper to merge options including ViewmModel options like `keys` and `factories`
  // @param [Object] obj the object to test
  // @example
  //   kb.utils.collapseOptions(options);

  utils.collapseOptions = __webpack_require__(20); // used for attribute setting to ensure all model attributes have their underlying models

  utils.unwrapModels = __webpack_require__(22);
  return utils;
}.call(void 0);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var KEYS_OPTIONS, _, assignViewModelKey, createObservable, createStaticObservables, kb, ko;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
ko = _kb.ko;

// @nodoc
assignViewModelKey = function assignViewModelKey(vm, key) {
  var vm_key;
  vm_key = vm.__kb.internals && ~_.indexOf(vm.__kb.internals, key) ? "_".concat(key) : key;

  if (vm.__kb.view_model.hasOwnProperty(vm_key)) {
    // already exists, skip
    return;
  }

  vm.__kb.view_model[vm_key] = null;
  return vm_key;
}; // @nodoc


createObservable = function createObservable(vm, model, key, create_options) {
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
}; // @nodoc


createStaticObservables = function createStaticObservables(vm, model) {
  var i, key, len, ref, vm_key;
  ref = vm.__kb.statics;

  for (i = 0, len = ref.length; i < len; i++) {
    key = ref[i];

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

KEYS_OPTIONS = ['keys', 'internals', 'excludes', 'statics', 'static_defaults'];

kb.ViewModel = function () {
  // Base class for ViewModels for Models.
  // @example How to create a ViewModel with first_name and last_name observables.
  //   var view_model = kb.viewModel(new Backbone.Model({first_name: "Planet", last_name: "Earth"}));
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
  // @example Creating ko.Observables on a target ViewModel
  //   var view_model = {};
  //   kb.viewModel(model, ['name', 'date'], view_model); // observables are added to view_model
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
  // @method #model()
  //   Dual-purpose getter/setter ko.computed for the observed model.
  //   @return [Model|ModelRef|void] getter: the model whose attributes are being observed (can be null) OR setter: void
  //   @example
  //     var view_model = kb.viewModel(new Backbone.Model({name: 'bob'}));
  //     var the_model = view_model.model(); // get
  //     view_model.model(new Backbone.Model({name: 'fred'})); // set
  var ViewModel = /*#__PURE__*/function () {
    // Used to create a new kb.ViewModel.
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
    function ViewModel(model) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var view_model = arguments.length > 2 ? arguments[2] : undefined;

      _classCallCheck(this, ViewModel);

      var args;
      args = Array.prototype.slice.call(_.isArguments(model) ? model : arguments);
      return kb.ignore(function () {
        var _model, arg, event_watcher, i, j, key, len, len1;

        !(model = args.shift()) || kb.isModel(model) || kb._throwUnexpected(_this, 'not a model');

        if (_.isArray(args[0])) {
          args[0] = {
            keys: args[0]
          };
        }

        _this.__kb || (_this.__kb = {});
        _this.__kb.view_model = args.length > 1 ? args.pop() : _this;
        options = {};

        for (i = 0, len = args.length; i < len; i++) {
          arg = args[i];

          _.extend(options, arg);
        }

        options = kb.utils.collapseOptions(options);

        for (j = 0, len1 = KEYS_OPTIONS.length; j < len1; j++) {
          key = KEYS_OPTIONS[j];

          if (options.hasOwnProperty(key)) {
            _this.__kb[key] = options[key];
          }
        } // always use a store to ensure recursive view models are handled correctly


        kb.Store.useOptionsOrCreate(options, model, _this); // view model factory

        _this.__kb.path = options.path;
        kb.Factory.useOptionsOrCreate(options, _this, options.path);
        _model = kb.utils.set(_this, '_model', ko.observable());
        _this.model = ko.computed({
          read: function read() {
            return ko.utils.unwrapObservable(_model);
          },
          write: function write(new_model) {
            return kb.ignore(function () {
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
        event_watcher = kb.utils.wrappedEventWatcher(_this, new kb.EventWatcher(model, _this, {
          emitter: _this._model,
          update: function update() {
            return kb.ignore(function () {
              return !(event_watcher != null ? event_watcher.ee : void 0) || _this.createObservables(event_watcher != null ? event_watcher.ee : void 0);
            });
          }
        }));
        kb.utils.wrappedObject(_this, model = event_watcher.ee);

        _model(event_watcher.ee); // update the observables


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

        !kb.statistics || kb.statistics.register('ViewModel', _this); // collect memory management statistics

        return _this;
      });
    } // Required clean up function to break cycles, release view models, etc.
    // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


    _createClass(ViewModel, [{
      key: "destroy",
      value: function destroy() {
        var vm_key;
        this.__kb_released = true;

        if (this.__kb.view_model !== this) {
          // clear the external references
          (function () {
            var results;
            results = [];

            for (vm_key in this.__kb.vm_keys) {
              results.push(this.__kb.view_model[vm_key] = null);
            }

            return results;
          }).call(this);
        }

        this.__kb.view_model = this.__kb.create_options = null;
        kb.releaseKeys(this);
        kb.utils.wrappedDestroy(this);
        return !kb.statistics || kb.statistics.unregister('ViewModel', this); // collect memory management statistics
      } // Get the options for a new view model that can be used for sharing view models.

    }, {
      key: "shareOptions",
      value: function shareOptions() {
        return {
          store: kb.utils.wrappedStore(this),
          factory: kb.utils.wrappedFactory(this)
        };
      } // create observables manually

    }, {
      key: "createObservables",
      value: function createObservables(model, keys) {
        var i, key, len, mapping_info, ref, rel_keys, vm_key;

        if (!keys) {
          if (this.__kb.keys || !model) {
            // only use the keys provided
            return;
          }

          for (key in model.attributes) {
            createObservable(this, model, key, this.__kb.create_options);
          }

          if (rel_keys = (ref = kb.settings.orm) != null ? typeof ref.keys === "function" ? ref.keys(model) : void 0 : void 0) {
            (function () {
              var i, len, results;
              results = [];

              for (i = 0, len = rel_keys.length; i < len; i++) {
                key = rel_keys[i];
                results.push(createObservable(this, model, key, this.__kb.create_options));
              }

              return results;
            }).call(this);
          }
        } else if (_.isArray(keys)) {
          for (i = 0, len = keys.length; i < len; i++) {
            key = keys[i];
            createObservable(this, model, key, this.__kb.create_options);
          }
        } else {
          for (key in keys) {
            mapping_info = keys[key];

            if (!(vm_key = assignViewModelKey(this, key))) {
              continue;
            }

            if (!_.isString(mapping_info)) {
              mapping_info.key || (mapping_info.key = vm_key);
            }

            this[vm_key] = this.__kb.view_model[vm_key] = kb.observable(model, mapping_info, this.__kb.create_options, this);
          }
        }
      }
    }]);

    return ViewModel;
  }();

  ; // @nodoc

  ViewModel.extend = kb.extend; // for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")

  return ViewModel;
}.call(void 0); // Factory function to create a kb.ViewModel.


kb.viewModel = function (model, options, view_model) {
  return new kb.ViewModel(arguments);
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var KEYS_PUBLISH, _, kb, ko;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
ko = _kb.ko;

__webpack_require__(26);

KEYS_PUBLISH = ['destroy', 'setToDefault']; // Used to provide a default value when an observable is null, undefined, or the empty string.
// @example Provide a observable with observable and/or non observable default argument in the form of:
//   var wrapped_name = kb.defaultObservable(kb.observable(model, 'name'), '(no name)');

module.exports = kb.DefaultObservable = /*#__PURE__*/function () {
  // Used to create a new kb.DefaultObservable.
  // @param [ko.observable] target_observable the observable to check for null, undefined, or the empty string
  // @param [Any] default_value the default value. Can be a value, string or ko.observable
  // @return [ko.observable] the constructor does not return 'this' but a ko.observable
  // @note the constructor does not return 'this' but a ko.observable
  function DefaultObservable(target_observable, dv) {
    var _this = this;

    _classCallCheck(this, DefaultObservable);

    // @dv is default value
    var observable;
    this.dv = dv;
    observable = kb.utils.wrappedObservable(this, ko.computed({
      read: function read() {
        var current_target;
        current_target = ko.utils.unwrapObservable(target_observable());

        if (_.isNull(current_target) || _.isUndefined(current_target)) {
          return ko.utils.unwrapObservable(_this.dv);
        } else {
          return current_target;
        }
      },
      write: function write(value) {
        return target_observable(value);
      }
    })); // publish public interface on the observable and return instead of this

    kb.publishMethods(observable, this, KEYS_PUBLISH);
    return observable;
  } // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(DefaultObservable, [{
    key: "destroy",
    value: function destroy() {
      return kb.utils.wrappedDestroy(this);
    } // Forces the observable to take the default value.
    // @note Can be used with kb.utils.setToDefault, kb.Observable.setToDefault, kb.ViewModel.setToDefault

  }, {
    key: "setToDefault",
    value: function setToDefault() {
      return kb.utils.wrappedObservable(this)(this.dv);
    }
  }]);

  return DefaultObservable;
}();

kb.defaultObservable = function (target, default_value) {
  return new kb.DefaultObservable(target, default_value);
};

kb.observableDefault = kb.defaultObservable;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var _, arraySlice, kb, ko;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
ko = _kb.ko;
arraySlice = Array.prototype.slice;

kb.toFormattedString = function (format) {
  var arg, args, index, parameter_index, result, value;
  result = format.slice();
  args = arraySlice.call(arguments, 1);

  for (index in args) {
    arg = args[index];
    value = ko.utils.unwrapObservable(arg);

    if (_.isUndefined(value) || _.isNull(value)) {
      value = '';
    }

    parameter_index = format.indexOf("{".concat(index, "}"));

    while (parameter_index >= 0) {
      result = result.replace("{".concat(index, "}"), value);
      parameter_index = format.indexOf("{".concat(index, "}"), parameter_index + 1);
    }
  }

  return result;
};

kb.parseFormattedString = function (string, format) {
  var count, format_indices_to_matched_indices, index, match_index, matches, parameter_count, parameter_index, positions, regex, regex_string, result, results, sorted_positions;
  regex_string = format.slice();
  index = 0;
  parameter_count = 0;
  positions = {};

  while (regex_string.search("\\{".concat(index, "\\}")) >= 0) {
    // store the positions of the replacements
    parameter_index = format.indexOf("{".concat(index, "}"));

    while (parameter_index >= 0) {
      regex_string = regex_string.replace("{".concat(index, "}"), '(.*)');
      positions[parameter_index] = index;
      parameter_count++;
      parameter_index = format.indexOf("{".concat(index, "}"), parameter_index + 1);
    }

    index++;
  }

  count = index;
  regex = new RegExp(regex_string);
  matches = regex.exec(string);

  if (matches) {
    matches.shift();
  } // return fake empty data


  if (!matches || matches.length !== parameter_count) {
    result = [];

    while (count-- > 0) {
      result.push('');
    }

    return result;
  } // sort the matches since the parameters could be requested unordered


  sorted_positions = _.sortBy(_.keys(positions), function (parameter_index, format_index) {
    return parseInt(parameter_index, 10);
  });
  format_indices_to_matched_indices = {};

  for (match_index in sorted_positions) {
    parameter_index = sorted_positions[match_index];
    index = positions[parameter_index];

    if (format_indices_to_matched_indices.hasOwnProperty(index)) {
      continue;
    }

    format_indices_to_matched_indices[index] = match_index;
  }

  results = [];
  index = 0;

  while (index < count) {
    results.push(matches[format_indices_to_matched_indices[index]]);
    index++;
  }

  return results;
}; // Handles two-way formatted string convertions and will reformat a string when any argument changes. The format string can also be an observable.
// @example change the formatted name whenever a model's name attribute changes
//   var observable = kb.formattedObservable("{0} and {1}", arg1, arg2);


module.exports = kb.FormattedObservable = /*#__PURE__*/function () {
  // Used to create a new kb.FormattedObservable.
  // @param [String|ko.observable] format the format string. Format: `"{0} and {1}"` where `{0}` and `{1}` would be synchronized with the arguments (eg. "Bob and Carol" where `{0}` is Bob and `{1}` is Carol)
  // @param [Array] args arguments to be passed to the kb.LocaleManager's get() method
  // @return [ko.observable] the constructor does not return 'this' but a ko.observable
  // @note the constructor does not return 'this' but a ko.observable
  function FormattedObservable(format, args) {
    _classCallCheck(this, FormattedObservable);

    var observable, observable_args; // being called by the factory function

    if (_.isArray(args)) {
      format = format;
      observable_args = args;
    } else {
      observable_args = arraySlice.call(arguments, 1);
    }

    observable = kb.utils.wrappedObservable(this, ko.computed({
      read: function read() {
        var arg, i, len;
        args = [ko.utils.unwrapObservable(format)];

        for (i = 0, len = observable_args.length; i < len; i++) {
          arg = observable_args[i];
          args.push(ko.utils.unwrapObservable(arg));
        }

        return kb.toFormattedString.apply(null, args);
      },
      write: function write(value) {
        var index, matches, max_count;
        matches = kb.parseFormattedString(value, ko.utils.unwrapObservable(format));
        max_count = Math.min(observable_args.length, matches.length);
        index = 0;

        while (index < max_count) {
          observable_args[index](matches[index]);
          index++;
        }
      }
    }));
    return observable;
  } // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(FormattedObservable, [{
    key: "destroy",
    value: function destroy() {
      return kb.utils.wrappedDestroy(this);
    }
  }]);

  return FormattedObservable;
}();

kb.formattedObservable = function (format, args) {
  return new kb.FormattedObservable(format, arraySlice.call(arguments, 1));
};

kb.observableFormatted = kb.formattedObservable;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var KEYS_PUBLISH, _, kb, ko;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
ko = _kb.ko;
KEYS_PUBLISH = ['destroy', 'observedValue', 'resetToCurrent']; // Locale Manager - if you are using localization, set this property.
// It must have Backbone.Events mixed in and implement a get method like Backbone.Model, eg. get: (attribute_name) -> return somthing

kb.locale_manager || (kb.locale_manager = void 0); // @abstract You must provide the following two methods:
//   * read: function(value, observable) called to get the value and each time the locale changes
//   * write: function(localized_string, value, observable) called to set the value (optional)
// Base class for observing localized data that changes when the locale changes.
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

module.exports = kb.LocalizedObservable = function () {
  var LocalizedObservable = /*#__PURE__*/function () {
    // Used to create a new kb.LocalizedObservable. This an abstract class.
    // @param [Data|ko.observable] value the value to localize
    // @param [Object] options the create options
    // @option options [Data|ko.observable] default a default value to present when the value is null, an empty string, etc.
    // @option options [Function] onChange a notification that gets called when the locale changes. Signature: function(localized_string, value, observable)
    // @return [ko.observable] the constructor does not return 'this' but a ko.observable
    // @note the constructor does not return 'this' but a ko.observable
    function LocalizedObservable(value1, options, vm) {
      var _this = this;

      _classCallCheck(this, LocalizedObservable);

      // @vm is view_model
      var observable, value;
      this.value = value1;
      this.vm = vm;
      options || (options = {});
      this.vm || (this.vm = {});
      this.read || kb._throwMissing(this, 'read');
      kb.locale_manager || kb._throwMissing(this, 'kb.locale_manager'); // bind callbacks

      this.__kb || (this.__kb = {});
      this.__kb._onLocaleChange = _.bind(this._onLocaleChange, this);
      this.__kb._onChange = options.onChange;

      if (this.value) {
        // internal state
        value = ko.utils.unwrapObservable(this.value);
      }

      this.vo = ko.observable(!value ? null : this.read(value, null));
      observable = kb.utils.wrappedObservable(this, ko.computed({
        read: function read() {
          if (_this.value) {
            ko.utils.unwrapObservable(_this.value);
          }

          _this.vo(); // create a depdenency


          return _this.read(ko.utils.unwrapObservable(_this.value));
        },
        write: function write(value) {
          _this.write || kb._throwUnexpected(_this, 'writing to read-only');

          _this.write(value, ko.utils.unwrapObservable(_this.value));

          _this.vo(value);

          if (_this.__kb._onChange) {
            return _this.__kb._onChange(value);
          }
        },
        owner: this.vm
      })); // publish public interface on the observable and return instead of this

      kb.publishMethods(observable, this, KEYS_PUBLISH); // start

      kb.locale_manager.bind('change', this.__kb._onLocaleChange);

      if (options.hasOwnProperty('default')) {
        // wrap ourselves with a default value
        observable = kb.DefaultObservable && ko.defaultObservable(observable, options["default"]);
      }

      return observable;
    } // Required clean up function to break cycles, release view models, etc.
    // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


    _createClass(LocalizedObservable, [{
      key: "destroy",
      value: function destroy() {
        kb.locale_manager.unbind('change', this.__kb._onLocaleChange);
        this.vm = null;
        return kb.utils.wrappedDestroy(this);
      } // Used to reset the value if localization is not possible.

    }, {
      key: "resetToCurrent",
      value: function resetToCurrent() {
        var current_value, observable;
        observable = kb.utils.wrappedObservable(this);
        current_value = this.value ? this.read(ko.utils.unwrapObservable(this.value)) : null;

        if (observable() === current_value) {
          return;
        }

        return observable(current_value);
      } // Dual purpose set/get

    }, {
      key: "observedValue",
      value: function observedValue(value) {
        if (arguments.length === 0) {
          return this.value;
        }

        this.value = value;

        this._onLocaleChange();
      } //###################################################
      // Internal
      //###################################################
      // @nodoc

    }, {
      key: "_onLocaleChange",
      value: function _onLocaleChange() {
        var value;
        value = this.read(ko.utils.unwrapObservable(this.value));
        this.vo(value);

        if (this.__kb._onChange) {
          return this.__kb._onChange(value);
        }
      }
    }]);

    return LocalizedObservable;
  }();

  ;
  LocalizedObservable.extend = kb.extend; // for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")

  return LocalizedObservable;
}.call(void 0); // factory function


kb.localizedObservable = function (value, options, view_model) {
  return new kb.LocalizedObservable(value, options, view_model);
};

kb.observableLocalized = kb.localizedObservable;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var KEYS_PUBLISH, _, kb, ko;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
ko = _kb.ko;
KEYS_PUBLISH = ['destroy']; // Class for observing emitter events.
// @example create an observable whose subscriptions are notified with the change event is triggered.
//   var triggered_observable = kb.triggeredObservable(name, 'change');
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

module.exports = kb.TriggeredObservable = /*#__PURE__*/function () {
  // Used to create a new kb.Observable.
  // @param [Model] emitter the emitter to observe (can be null)
  // @param [String] event_selector the event name to trigger Knockout subscriptions on.
  // @return [ko.observable] the constructor does not return 'this' but a ko.observable
  // @note the constructor does not return 'this' but a ko.observable
  function TriggeredObservable(emitter, event_selector1) {
    var _this = this;

    _classCallCheck(this, TriggeredObservable);

    var observable;
    this.event_selector = event_selector1;
    emitter || kb._throwMissing(this, 'emitter');
    this.event_selector || kb._throwMissing(this, 'event_selector'); // internal state

    this.vo = ko.observable();
    observable = kb.utils.wrappedObservable(this, ko.computed(function () {
      return _this.vo();
    })); // publish public interface on the observable and return instead of this

    kb.publishMethods(observable, this, KEYS_PUBLISH); // create emitter observable

    kb.utils.wrappedEventWatcher(this, new kb.EventWatcher(emitter, this, {
      emitter: _.bind(this.emitter, this),
      update: _.bind(this.update, this),
      event_selector: this.event_selector
    }));
    return observable;
  } // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(TriggeredObservable, [{
    key: "destroy",
    value: function destroy() {
      return kb.utils.wrappedDestroy(this);
    } // Dual-purpose getter/setter for the observed emitter.
    // @overload emitter()
    //   Gets the emitter or emitter reference
    //   @return [Model|ModelRef|Collection] the emitter whose events are being bound (can be null)
    // @overload emitter(new_emitter)
    //   Sets the emitter or emitter reference
    //   @param [Model|ModelRef|Collection] new_emitter the emitter whose events will be bound (can be null)

  }, {
    key: "emitter",
    value: function emitter(new_emitter) {
      if (arguments.length === 0 || this.ee === new_emitter) {
        // get or no change
        return this.ee;
      }

      if (this.ee = new_emitter) {
        return this.update();
      }
    } //###################################################
    // Internal
    //###################################################
    // @nodoc

  }, {
    key: "update",
    value: function update() {
      if (!this.ee) {
        // do not trigger if there is no emitter
        return;
      }

      if (this.vo() !== this.ee) {
        return this.vo(this.ee);
      } else {
        return this.vo.valueHasMutated(); // manually trigger the dependable
      }
    }
  }]);

  return TriggeredObservable;
}(); // factory function


kb.triggeredObservable = function (emitter, event_selector) {
  return new kb.TriggeredObservable(emitter, event_selector);
};

kb.observableTriggered = kb.triggeredObservable;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var _, callOrGet, kb, ko;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
ko = _kb.ko;

__webpack_require__(27); // internal helper


callOrGet = function callOrGet(value) {
  value = ko.utils.unwrapObservable(value);

  if (typeof value === 'function') {
    return value.apply(null, Array.prototype.slice.call(arguments, 1));
  } else {
    return value;
  }
}; // Helpers for validating forms, inputs, and values.
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
// @method .formValidator(view_model, el)
//   Used to create an observable that wraps all of the validators for all the inputs on an HTML form element using `kb.inputValidator`. See kb.inputValidator for per input options.
//   In addition, the formValidator aggregates the following helpers for its inputs: $valid, $error_count, $enabled, and $disabled. Also, if you provide a name attribute for the form, it will attach all of the inputs to a $name property on your view model.
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


module.exports = kb.Validation = /*#__PURE__*/_createClass(function Validation() {
  _classCallCheck(this, Validation);
}); //############################
// Aliases
//############################

kb.valueValidator = function (value, bindings) {
  var validation_options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  validation_options && !(typeof validation_options === 'function') || (validation_options = {});
  return ko.computed(function () {
    var active_index, current_value, disabled, identifier, identifier_index, priorities, results, validator;
    results = {
      $error_count: 0
    };
    current_value = ko.utils.unwrapObservable(value);
    !('disable' in validation_options) || (disabled = callOrGet(validation_options.disable));
    !('enable' in validation_options) || (disabled = !callOrGet(validation_options.enable));
    priorities = validation_options.priorities || [];
    _.isArray(priorities) || (priorities = [priorities]); // ensure priorities is an array
    // then add the rest

    active_index = priorities.length + 1;

    for (identifier in bindings) {
      validator = bindings[identifier];
      results[identifier] = !disabled && callOrGet(validator, current_value); // update validity

      if (results[identifier]) {
        results.$error_count++; // check priorities

        (identifier_index = _.indexOf(priorities, identifier) >= 0) || (identifier_index = priorities.length);

        if (results.$active_error && identifier_index < active_index) {
          results.$active_error = identifier;
          active_index = identifier_index;
        } else {
          results.$active_error || (results.$active_error = identifier, active_index = identifier_index);
        }
      }
    } // add the inverse and ensure a boolean


    results.$enabled = !disabled;
    results.$disable = !!disabled;
    results.$valid = results.$error_count === 0;
    return results;
  });
};

kb.inputValidator = function (view_model, el) {
  var validation_options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var bindings, identifier, input_name, options, ref, result, type, validator, validators;
  validation_options && !(typeof validation_options === 'function') || (validation_options = {});
  validators = kb.valid;

  if ((input_name = el.getAttribute('name')) && !_.isString(input_name)) {
    input_name = null;
  }

  if (!(bindings = el.getAttribute('data-bind'))) {
    // only set up form elements with a value bindings
    return null;
  }

  options = new Function("sc", "with(sc[0]) { return { ".concat(bindings, " } }"))([view_model]);

  if (!(options && options.value)) {
    return null;
  }

  !options.validation_options || (_.defaults(options.validation_options, validation_options), validation_options = options.validation_options); // collect the types to identifier

  bindings = {};
  !validators[type = el.getAttribute('type')] || (bindings[type] = validators[type]);
  !el.hasAttribute('required') || (bindings.required = validators.required);

  if (options.validations) {
    ref = options.validations;

    for (identifier in ref) {
      validator = ref[identifier];
      bindings[identifier] = validator;
    }
  }

  result = kb.valueValidator(options.value, bindings, validation_options); // if there is a name, add to the view_model with $scoping

  !input_name && !validation_options.no_attach || (view_model["$".concat(input_name)] = result);
  return result;
};

kb.formValidator = function (view_model, el) {
  var bindings, form_name, i, input_el, len, name, options, ref, results, validation_options, validator, validators;
  results = {};
  validators = [];

  if ((form_name = el.getAttribute('name')) && !_.isString(form_name)) {
    form_name = null;
  }

  if (bindings = el.getAttribute('data-bind')) {
    options = new Function("sc", "with(sc[0]) { return { ".concat(bindings, " } }"))([view_model]);
    validation_options = options.validation_options;
  }

  validation_options || (validation_options = {});
  validation_options.no_attach = !!form_name;
  ref = el.getElementsByTagName('input'); // build up the results

  for (i = 0, len = ref.length; i < len; i++) {
    input_el = ref[i];

    if (!(name = input_el.getAttribute('name'))) {
      // need named inputs to set up an object
      continue;
    }

    validator = kb.inputValidator(view_model, input_el, validation_options);
    !validator || validators.push(results[name] = validator);
  } // collect stats, error count and valid


  results.$error_count = ko.computed(function () {
    var error_count, j, len1;
    error_count = 0;

    for (j = 0, len1 = validators.length; j < len1; j++) {
      validator = validators[j];
      error_count += validator().$error_count;
    }

    return error_count;
  });
  results.$valid = ko.computed(function () {
    return results.$error_count() === 0;
  }); // enabled and disabled

  results.$enabled = ko.computed(function () {
    var enabled, j, len1;
    enabled = true;

    for (j = 0, len1 = validators.length; j < len1; j++) {
      validator = validators[j];
      enabled &= validator().$enabled;
    }

    return enabled;
  });
  results.$disabled = ko.computed(function () {
    return !results.$enabled();
  });

  if (form_name) {
    // if there is a name, add to the view_model with $scoping
    view_model["$".concat(form_name)] = results;
  }

  return results;
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var _, _keyArrayToObject, _mergeArray, _mergeObject, _mergeOptions2;

var _require = __webpack_require__(0);

_ = _require._;

// @nodoc
_mergeArray = function _mergeArray(result, key, value) {
  result[key] || (result[key] = []);

  if (!_.isArray(value)) {
    value = [value];
  }

  result[key] = result[key].length ? _.union(result[key], value) : value;
  return result;
}; // @nodoc


_mergeObject = function _mergeObject(result, key, value) {
  result[key] || (result[key] = {});
  return _.extend(result[key], value);
}; // @nodoc


_keyArrayToObject = function _keyArrayToObject(value) {
  var i, item, len, result;
  result = {};

  for (i = 0, len = value.length; i < len; i++) {
    item = value[i];
    result[item] = {
      key: item
    };
  }

  return result;
};

_mergeOptions2 = function _mergeOptions(result, options) {
  var key, value;

  if (!options) {
    return result;
  }

  for (key in options) {
    value = options[key];

    switch (key) {
      case 'internals':
      case 'requires':
      case 'excludes':
      case 'statics':
        _mergeArray(result, key, value);

        break;

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
        } else {
          // an array
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
        _mergeObject(result, key, value);

        break;

      case 'options':
        break;

      default:
        result[key] = value;
    }
  }

  return _mergeOptions2(result, options.options);
}; // @nodoc


module.exports = function (options) {
  return _mergeOptions2({}, options);
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var copyProps; // From Backbone.js (https:github.com/documentcloud/backbone)

copyProps = function copyProps(dest, source) {
  var key, value;

  for (key in source) {
    value = source[key];
    dest[key] = value;
  }

  return dest;
}; // Shared empty constructor function to aid in prototype-chain creation.


var ctor = function ctor() {}; // Helper function to correctly set up the prototype chain, for subclasses.
// Similar to 'goog.inherits', but uses a hash of prototype properties and
// class properties to be extended.


var inherits = function inherits(parent, protoProps, staticProps) {
  var child; // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your extend definition), or defaulted
  // by us to simply call the parent's constructor.

  if (protoProps && protoProps.hasOwnProperty('constructor')) {
    child = protoProps.constructor;
  } else {
    child = function child() {
      parent.apply(this, arguments);
    };
  } // Inherit class (static) properties from parent.


  copyProps(child, parent); // Set the prototype chain to inherit from parent, without calling
  // parent's constructor function.

  ctor.prototype = parent.prototype;
  child.prototype = new ctor(); // Add prototype properties (instance properties) to the subclass,
  // if supplied.

  if (protoProps) copyProps(child.prototype, protoProps); // Add static properties to the constructor function, if supplied.

  if (staticProps) copyProps(child, staticProps); // Correctly set child's 'prototype.constructor'.

  child.prototype.constructor = child; // Set a convenience property in case the parent's prototype is needed later.

  child.__super__ = parent.prototype;
  return child;
}; // The self-propagating extend function that BacLCone classes use.


var extend = function extend(protoProps, classProps) {
  var child = inherits(this, protoProps, classProps);
  child.extend = this.extend;
  return child;
};

;
module.exports = extend;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var _, _unwrapModels;

var _require = __webpack_require__(0);

_ = _require._;

// @nodoc
module.exports = _unwrapModels = function unwrapModels(obj) {
  var key, result, value;

  if (!obj) {
    return obj;
  }

  if (obj.__kb) {
    return obj.__kb.hasOwnProperty('object') ? obj.__kb.object : obj;
  }

  if (_.isArray(obj)) {
    return _.map(obj, function (test) {
      return _unwrapModels(test);
    });
  }

  if (_.isObject(obj) && obj.constructor === {}.constructor) {
    // a simple object
    result = {};

    for (key in obj) {
      value = obj[key];
      result[key] = _unwrapModels(value);
    }

    return result;
  }

  return obj;
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var _, _wrappedDestroy;

var _require = __webpack_require__(0);

_ = _require._;

// @nodoc
module.exports = _wrappedDestroy = function wrappedDestroy(obj) {
  var __kb, store_references;

  if (!obj.__kb) {
    return;
  }

  if (obj.__kb.event_watcher) {
    obj.__kb.event_watcher.releaseCallbacks(obj);
  }

  __kb = obj.__kb;
  obj.__kb = null; // clear now to break cycles

  if (__kb.observable) {
    __kb.observable.destroy = __kb.observable.release = null;

    _wrappedDestroy(__kb.observable);

    __kb.observable = null;
  }

  __kb.factory = null;

  if (__kb.event_watcher_is_owned) {
    // release the event_watcher
    __kb.event_watcher.destroy();
  }

  __kb.event_watcher = null;

  if (__kb.store_is_owned) {
    // release the store
    __kb.store.destroy();
  }

  __kb.store = null;

  if (__kb.stores_references) {
    while (store_references = __kb.stores_references.pop()) {
      if (!store_references.store.__kb_released) {
        store_references.store.release(obj);
      }
    }
  }
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var AssociatedModel, Backbone, BackboneAssociations, _, kb;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
Backbone = _kb.Backbone;
AssociatedModel = null; // lazy check
// @nodoc

module.exports = BackboneAssociations = /*#__PURE__*/function () {
  function BackboneAssociations() {
    _classCallCheck(this, BackboneAssociations);
  }

  _createClass(BackboneAssociations, null, [{
    key: "isAvailable",
    value: function isAvailable() {
      return !!(AssociatedModel = Backbone != null ? Backbone.AssociatedModel : void 0); // or require?('backbone-associations')?.AssociatedModel # webpack optionals
    }
  }, {
    key: "keys",
    value: function keys(model) {
      if (!(model instanceof AssociatedModel)) {
        return null;
      }

      return _.map(model.relations, function (test) {
        return test.key;
      });
    }
  }, {
    key: "relationType",
    value: function relationType(model, key) {
      var relation;

      if (!(model instanceof AssociatedModel)) {
        return null;
      }

      if (!(relation = _.find(model.relations, function (test) {
        return test.key === key;
      }))) {
        return null;
      }

      if (relation.type === 'Many') {
        return kb.TYPE_COLLECTION;
      } else {
        return kb.TYPE_MODEL;
      }
    }
  }, {
    key: "useFunction",
    value: function useFunction() {
      return false;
    }
  }]);

  return BackboneAssociations;
}();

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var Backbone, BackboneRelational, RelationalModel, _, kb;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
Backbone = _kb.Backbone;
RelationalModel = null; // lazy check
// @nodoc

module.exports = BackboneRelational = /*#__PURE__*/function () {
  function BackboneRelational() {
    _classCallCheck(this, BackboneRelational);
  }

  _createClass(BackboneRelational, null, [{
    key: "isAvailable",
    value: function isAvailable() {
      return !!(RelationalModel = Backbone != null ? Backbone.RelationalModel : void 0); // or require?('backbone-relational')?.RelationalModel # webpack optionals
    }
  }, {
    key: "relationType",
    value: function relationType(model, key) {
      var relation;

      if (!(model instanceof RelationalModel)) {
        return null;
      }

      if (!(relation = _.find(model.getRelations(), function (test) {
        return test.key === key;
      }))) {
        return null;
      }

      if (relation.collectionType || _.isArray(relation.keyContents)) {
        return kb.TYPE_COLLECTION;
      } else {
        return kb.TYPE_MODEL;
      }
    }
  }, {
    key: "bind",
    value: function bind(model, key, update, path) {
      var event, events, i, len, rel_fn, type;

      if (!(type = this.relationType(model, key))) {
        return null;
      }

      rel_fn = function rel_fn(model) {
        !kb.statistics || kb.statistics.addModelEvent({
          name: 'update (relational)',
          model: model,
          key: key,
          path: path
        });
        return update();
      }; // VERSIONING: pre Backbone-Relational 0.8.0


      events = kb.Backbone.Relation.prototype.sanitizeOptions ? ['update', 'add', 'remove'] : ['change', 'add', 'remove'];

      if (type === kb.TYPE_COLLECTION) {
        for (i = 0, len = events.length; i < len; i++) {
          event = events[i];
          model.bind("".concat(event, ":").concat(key), rel_fn);
        }
      } else {
        model.bind("".concat(events[0], ":").concat(key), rel_fn);
      }

      return function () {
        var j, len1;

        if (type === kb.TYPE_COLLECTION) {
          for (j = 0, len1 = events.length; j < len1; j++) {
            event = events[j];
            model.unbind("".concat(event, ":").concat(key), rel_fn);
          }
        } else {
          model.unbind("".concat(events[0], ":").concat(key), rel_fn);
        }
      };
    }
  }, {
    key: "useFunction",
    value: function useFunction() {
      return false;
    }
  }]);

  return BackboneRelational;
}();

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var _, kb, ko;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
ko = _kb.ko;

kb.Observable.prototype.setToDefault = function () {
  var ref;

  if ((ref = this.__kb_value) != null) {
    if (typeof ref.setToDefault === "function") {
      ref.setToDefault();
    }
  }
};

kb.ViewModel.prototype.setToDefault = function () {
  var ref, vm_key;

  for (vm_key in this.__kb.vm_keys) {
    if ((ref = this[vm_key]) != null) {
      if (typeof ref.setToDefault === "function") {
        ref.setToDefault();
      }
    }
  }
}; // @example
//   var model = new Backbone.Model({name: 'Bob'});
//   var view_model = {
//     wrapped_name: kb.defaultWrapper(kb.observable(model, 'name'), '(no name)')
//   }; // view_model.wrapped name: Bob
//   kb.utils.setToDefault(view_model); // view_model.wrapped name: (no name)


kb.utils.setToDefault = function (obj) {
  var key, value;

  if (!obj) {
    return;
  } // observable


  if (ko.isObservable(obj)) {
    if (typeof obj.setToDefault === "function") {
      obj.setToDefault();
    } // view model

  } else if (_.isObject(obj)) {
    for (key in obj) {
      value = obj[key];

      if (value && (ko.isObservable(value) || typeof value !== 'function') && (key[0] !== '_' || key.search('__kb'))) {
        this.setToDefault(value);
      }
    }
  }

  return obj;
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
var EMAIL_REGEXP, NUMBER_REGEXP, URL_REGEXP, _, kb, ko;

var _kb = kb = __webpack_require__(0);

_ = _kb._;
ko = _kb.ko;
// Regular expressions from Angular.js: https://github.com/angular/angular.js
URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/; // A validator should return true if there are errors (similar to the binding check in HTML, eg. $name().required).

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
}; // Convention is that if they end in Fn then returns a function pointer based on parameters passed.

kb.hasChangedFn = function (model) {
  var attributes, m;
  m = null;
  attributes = null;
  return function () {
    var current_model;

    if (m !== (current_model = ko.utils.unwrapObservable(model))) {
      // change in model
      m = current_model;
      attributes = m ? m.toJSON() : null;
      return false;
    }

    if (!(m && attributes)) {
      return false;
    }

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
    var c, k, m;
    m = ko.utils.unwrapObservable(model);
    k = ko.utils.unwrapObservable(key);
    c = ko.utils.unwrapObservable(collection);

    if (!(m && k && c)) {
      return false;
    }

    return !!_.find(c.models, function (test) {
      return test !== m && test.get(k) === value;
    });
  };
};

kb.untilTrueFn = function (stand_in, fn, model) {
  var was_true;
  was_true = false;

  if (model && ko.isObservable(model)) {
    // reset if the model changes
    model.subscribe(function () {
      return was_true = false;
    });
  }

  return function (value) {
    var f, result;

    if (!(f = ko.utils.unwrapObservable(fn))) {
      return ko.utils.unwrapObservable(stand_in);
    }

    was_true |= !!(result = f(ko.utils.unwrapObservable(value)));
    return was_true ? result : ko.utils.unwrapObservable(stand_in);
  };
};

kb.untilFalseFn = function (stand_in, fn, model) {
  var was_false;
  was_false = false;

  if (model && ko.isObservable(model)) {
    // reset if the model changes
    model.subscribe(function () {
      return was_false = false;
    });
  }

  return function (value) {
    var f, result;

    if (!(f = ko.utils.unwrapObservable(fn))) {
      return ko.utils.unwrapObservable(stand_in);
    }

    was_false |= !(result = f(ko.utils.unwrapObservable(value)));
    return was_false ? result : ko.utils.unwrapObservable(stand_in);
  };
};

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
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_30__;

/***/ }),
/* 31 */
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