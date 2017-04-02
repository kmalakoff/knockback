(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("underscore"), require("knockout"), require("backbone"));
	else if(typeof define === 'function' && define.amd)
		define(["underscore", "knockout", "backbone"], factory);
	else if(typeof exports === 'object')
		exports["kbd"] = factory(require("underscore"), require("knockout"), require("backbone"));
	else
		root["kbd"] = factory(root["_"], root["ko"], root["Backbone"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_3__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function webpackUniversalModuleDefinition(root, factory) {
  if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') module.exports = factory(__webpack_require__(0), __webpack_require__(1), __webpack_require__(3));else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') exports["kb"] = factory(require("underscore"), require("knockout"), require("backbone"));else root["kb"] = factory(root["_"], root["ko"], root["Backbone"]);
})(undefined, function (__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
  return (/******/function (modules) {
      // webpackBootstrap
      /******/ // The module cache
      /******/var installedModules = {};
      /******/
      /******/ // The require function
      /******/function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/if (installedModules[moduleId])
          /******/return installedModules[moduleId].exports;
        /******/
        /******/ // Create a new module (and put it into the cache)
        /******/var module = installedModules[moduleId] = {
          /******/i: moduleId,
          /******/l: false,
          /******/exports: {}
          /******/ };
        /******/
        /******/ // Execute the module function
        /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ // Flag the module as loaded
        /******/module.l = true;
        /******/
        /******/ // Return the exports of the module
        /******/return module.exports;
        /******/
      }
      /******/
      /******/
      /******/ // expose the modules object (__webpack_modules__)
      /******/__webpack_require__.m = modules;
      /******/
      /******/ // expose the module cache
      /******/__webpack_require__.c = installedModules;
      /******/
      /******/ // identity function for calling harmony imports with the correct context
      /******/__webpack_require__.i = function (value) {
        return value;
      };
      /******/
      /******/ // define getter function for harmony exports
      /******/__webpack_require__.d = function (exports, name, getter) {
        /******/if (!__webpack_require__.o(exports, name)) {
          /******/Object.defineProperty(exports, name, {
            /******/configurable: false,
            /******/enumerable: true,
            /******/get: getter
            /******/ });
          /******/
        }
        /******/
      };
      /******/
      /******/ // getDefaultExport function for compatibility with non-harmony modules
      /******/__webpack_require__.n = function (module) {
        /******/var getter = module && module.__esModule ?
        /******/function getDefault() {
          return module['default'];
        } :
        /******/function getModuleExports() {
          return module;
        };
        /******/__webpack_require__.d(getter, 'a', getter);
        /******/return getter;
        /******/
      };
      /******/
      /******/ // Object.prototype.hasOwnProperty.call
      /******/__webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      };
      /******/
      /******/ // __webpack_public_path__
      /******/__webpack_require__.p = "";
      /******/
      /******/ // Load entry module and return exports
      /******/return __webpack_require__(__webpack_require__.s = 19);
      /******/
    }(
    /************************************************************************/
    /******/[
    /* 0 */
    /***/function (module, exports) {

      module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

      /***/
    },
    /* 1 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";
      /* WEBPACK VAR INJECTION */
      (function (global) {

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var _createClass = function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
            }
          }return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
          };
        }(); /*
               knockback.js 2.0.0-alpha.1
               Copyright (c)  2011-2016 Kevin Malakoff.
               License: MIT (http://www.opensource.org/licenses/mit-license.php)
               Source: https://github.com/kmalakoff/knockback
               Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
               Optional dependencies: Backbone.ModelRef.js and BackboneORM.
             */

        var _underscore = __webpack_require__(0);

        var _underscore2 = _interopRequireDefault(_underscore);

        var _backbone = __webpack_require__(3);

        var _backbone2 = _interopRequireDefault(_backbone);

        var _knockout = __webpack_require__(2);

        var _knockout2 = _interopRequireDefault(_knockout);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        function _toConsumableArray(arr) {
          if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
              arr2[i] = arr[i];
            }return arr2;
          } else {
            return Array.from(arr);
          }
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        var root = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : undefined;

        var LIFECYCLE_METHODS = ['release', 'destroy', 'dispose'];

        var _ignore = function _ignore(callback, callbackTarget, callbackArgs) {
          var value = null;
          _knockout2.default.computed(function () {
            value = callback.apply(callbackTarget, callbackArgs || []);
          }).dispose();
          return value;
        };

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
            key: 'wasReleased',

            // Checks if an object has been released.
            // @param [Any] obj the object to release and also release its keys


            // cache local reference to underscore

            // Stored value type is a Model -> observable type: ViewModel

            // Stored value type is simple like a String or Number -> observable type: ko.observable

            // Knockback library semantic version
            value: function wasReleased(obj) {
              return !obj || obj.__kb_released;
            }

            // Checks if an object can be released. Used to perform minimal nested releasing on objects by checking if self or next level contained items can be released.
            // @param [Any] obj the object to release and also release its keys


            // cache local reference to Knockout

            // Stored value type is a Collection -> observable type: kb.CollectionObservable

            // Stored value type is an Array -> observable type: ko.observableArray


            // ###################################
            // OBSERVABLE STORAGE TYPES
            // ###################################

            // Stored value type is not known like null/undefined (could be observed as a Model or a Collection or a simple type)

          }, {
            key: 'isReleaseable',
            value: function isReleaseable(obj, depth) {
              if (depth == null) {
                depth = 0;
              }
              if (!obj || obj !== Object(obj) || obj.__kb_released) return false; // must be an object and not already released
              if (_knockout2.default.isObservable(obj) || obj instanceof kb.ViewModel) return true; // a known type that is releasable
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
              if (_underscore2.default.isArray(obj)) {
                _underscore2.default.each(obj, function (value, index) {
                  if (kb.isReleaseable(value)) {
                    obj[index] = null;kb.release(value);
                  }
                });
                return;
              }

              // observable or lifecycle managed
              var array = kb.peek(obj);
              if (_knockout2.default.isObservable(obj) && _underscore2.default.isArray(array)) {
                if (obj.__kb_is_co || obj.__kb_is_o && obj.valueType() === kb.TYPE_COLLECTION) {
                  if (typeof obj.destroy === 'function') obj.destroy();
                  return;
                }
                _underscore2.default.each(array, function (value, index) {
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

              if (!_knockout2.default.isObservable(obj)) this.releaseKeys(obj); // view model
            }

            // Releases and clears all of the keys on an object using the conventions of release(), destroy(), dispose() without releasing the top level object itself.

          }, {
            key: 'releaseKeys',
            value: function releaseKeys(obj) {
              _underscore2.default.each(obj, function (value, key) {
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
              return _knockout2.default.utils.domNodeDisposal.addDisposeCallback(node, function () {
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
              var observable = _knockout2.default.renderTemplate(template, view_model, options, el, 'replaceChildren');

              // do not return the template wrapper if possible
              if (el.childNodes.length === 1) el = el.childNodes[0];else if (el.childNodes.length) {
                for (var i = 0, end = el.childNodes.length, asc = end >= 0; asc ? i <= end : i >= end; asc ? i++ : i--) {
                  // ensure the context is passed up to wrapper from a child
                  try {
                    _knockout2.default.storedBindingContextForNode(el, _knockout2.default.contextFor(el.childNodes[i]));
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
                _underscore2.default.each(children, function (child) {
                  return node.appendChild(child);
                });
              }
              _knockout2.default.applyBindings(view_model, node);
              kb.releaseOnNodeRemove(view_model, node);
              return node;
            }
          }, {
            key: 'getValue',
            value: function getValue(model, key, args) {
              if (!model) return undefined;
              if (!args) return model.get(key);
              return model.get.apply(model, _toConsumableArray(_underscore2.default.map([key].concat(args), function (value) {
                return kb.peek(value);
              })));
            }
          }, {
            key: 'setValue',
            value: function setValue(model, key, value) {
              var attributes = void 0;
              if (!model) return undefined;
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
              throw new Error((_underscore2.default.isString(instance) ? instance : instance.constructor.name) + ': ' + message + ' is missing');
            }

            // @nodoc

          }, {
            key: '_throwUnexpected',
            value: function _throwUnexpected(instance, message) {
              throw new Error((_underscore2.default.isString(instance) ? instance : instance.constructor.name) + ': ' + message + ' is unexpected');
            }

            // @nodoc

          }, {
            key: 'publishMethods',
            value: function publishMethods(observable, instance, methods) {
              _underscore2.default.each(methods, function (fn) {
                observable[fn] = kb._.bind(instance[fn], instance);
              });
            }

            // @nodoc

          }, {
            key: 'peek',
            value: function peek(obs) {
              if (!_knockout2.default.isObservable(obs)) return obs;
              if (obs.peek) return obs.peek();
              return kb.ignore(function () {
                return obs();
              });
            }

            // @nodoc

          }, {
            key: 'isModel',
            value: function isModel(obj) {
              return obj && (obj instanceof _backbone2.default.Model || typeof obj.get === 'function' && typeof obj.bind === 'function');
            }

            // @nodoc

          }, {
            key: 'isCollection',
            value: function isCollection(obj) {
              return obj && obj instanceof _backbone2.default.Collection;
            }
          }]);

          return kb;
        }();

        kb.VERSION = '2.0.0-alpha.1';
        kb.TYPE_UNKNOWN = 0;
        kb.TYPE_SIMPLE = 1;
        kb.TYPE_ARRAY = 2;
        kb.TYPE_MODEL = 3;
        kb.TYPE_COLLECTION = 4;
        kb.assign = _underscore2.default.assign || _underscore2.default.extend;
        kb.ignore = _knockout2.default.dependencyDetection && _knockout2.default.dependencyDetection.ignore ? _knockout2.default.dependencyDetection.ignore : _ignore;
        exports.default = kb;
        /* WEBPACK VAR INJECTION */
      }).call(exports, __webpack_require__(5));

      /***/
    },
    /* 2 */
    /***/function (module, exports) {

      module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

      /***/
    },
    /* 3 */
    /***/function (module, exports) {

      module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

      /***/
    },
    /* 4 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.emitterObservable = undefined;

      var _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
          }
        }return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
        };
      }(); /*
             knockback.js 2.0.0-alpha.1
             Copyright (c)  2011-2016 Kevin Malakoff.
             License: MIT (http://www.opensource.org/licenses/mit-license.php)
             Source: https://github.com/kmalakoff/knockback
             Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
             Optional dependencies: Backbone.ModelRef.js and BackboneORM.
           */

      var _underscore = __webpack_require__(0);

      var _underscore2 = _interopRequireDefault(_underscore);

      var _backbone = __webpack_require__(3);

      var _backbone2 = _interopRequireDefault(_backbone);

      var _knockout = __webpack_require__(2);

      var _knockout2 = _interopRequireDefault(_knockout);

      var _kb = __webpack_require__(1);

      var _kb2 = _interopRequireDefault(_kb);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      // Used to provide a central place to aggregate registered Model events rather than having all kb.Observables register for updates independently.
      //
      var EventWatcher = function () {
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
                _kb2.default._throwUnexpected(this, 'emitter not matching');
              }
              return _kb2.default.utils.wrappedEventWatcher(obj, options.event_watcher).registerCallbacks(obj, callback_options);
            }
            _kb2.default.utils.wrappedEventWatcherIsOwned(obj, true);
            return _kb2.default.utils.wrappedEventWatcher(obj, new EventWatcher(emitter)).registerCallbacks(obj, callback_options);
          }
        }]);

        function EventWatcher(emitter, obj, callback_options) {
          var _this = this;

          _classCallCheck(this, EventWatcher);

          this._onModelLoaded = function (model) {
            _this.ee = model;

            _underscore2.default.each(_this.__kb.callbacks, function (callbacks, event_name) {
              if (callbacks.model && callbacks.model !== model) _this._unbindCallbacks(event_name, callbacks, true);
              if (!callbacks.model) {
                callbacks.model = model;
                model.bind(event_name, callbacks.fn);
              }

              _underscore2.default.each(callbacks.list, function (info) {
                if (!info.unbind_fn && _kb2.default.settings.orm && _kb2.default.settings.orm.customBind) {
                  info.unbind_fn = _kb2.default.settings.orm.customBind(model, info.key, info.update, info.path);
                }
                if (info.emitter) info.emitter(model);
              });
            });
          };

          this._onModelUnloaded = function (model) {
            if (_this.ee !== model) return;
            _this.ee = null;
            _underscore2.default.each(_this.__kb.callbacks, function (callbacks, event_name) {
              return _this._unbindCallbacks(event_name, callbacks);
            });
          };

          this._unbindCallbacks = function (event_name, callbacks, skip_emitter) {
            if (callbacks.model) {
              callbacks.model.unbind(event_name, callbacks.fn);callbacks.model = null;
            }

            _underscore2.default.each(callbacks.list, function (info) {
              if (info.unbind_fn) {
                info.unbind_fn(), info.unbind_fn = null;
              }
              if (info.emitter && !skip_emitter && !_kb2.default.wasReleased(info.obj)) {
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
            return _kb2.default.utils.wrappedDestroy(this);
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
            if (_backbone2.default && _backbone2.default.ModelRef && new_emitter instanceof _backbone2.default.ModelRef) {
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

            obj || _kb2.default._throwMissing(this, 'obj');
            callback_info || _kb2.default._throwMissing(this, 'callback_info');
            var event_names = callback_info.event_selector ? callback_info.event_selector.split(' ') : ['change'];
            var model = this.ee;

            _underscore2.default.each(event_names, function (event_name) {
              if (!event_name) return; // extra spaces

              var callbacks = _this2.__kb.callbacks[event_name];
              if (!callbacks) {
                _this2.__kb.callbacks[event_name] = {
                  model: null,
                  list: [],
                  fn: function fn(m) {
                    _underscore2.default.each(callbacks.list, function (info) {
                      if (!info.update) return;
                      if (m && info.key && m.hasChanged && !m.hasChanged(_knockout2.default.utils.unwrapObservable(info.key))) return; // key doesn't match
                      if (_kb2.default.statistics) _kb2.default.statistics.addModelEvent({ name: event_name, model: m, key: info.key, path: info.path });
                      info.update();
                    }); // trigger update
                  }
                };
                callbacks = _this2.__kb.callbacks[event_name];
              }

              var info = _underscore2.default.defaults({ obj: obj }, callback_info);
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
            _underscore2.default.each(this.__kb.callbacks, function (callbacks, event_name) {
              return _this3._unbindCallbacks(event_name, callbacks, _kb2.default.wasReleased(obj));
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


      exports.default = EventWatcher;
      var emitterObservable = exports.emitterObservable = function emitterObservable(emitter, observable) {
        return new EventWatcher(emitter, observable);
      };

      /***/
    },
    /* 5 */
    /***/function (module, exports) {

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
        if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === "object") g = window;
      }

      // g can still be undefined, but nothing to do about it...
      // We return undefined, instead of nothing here, so it's
      // easier to handle this case. if(!global) { ...}

      module.exports = g;

      /***/
    },
    /* 6 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.collectionObservable = exports.compare = undefined;

      var _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
          }
        }return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
        };
      }(); /*
             knockback.js 2.0.0-alpha.1
             Copyright (c)  2011-2016 Kevin Malakoff.
             License: MIT (http://www.opensource.org/licenses/mit-license.php)
             Source: https://github.com/kmalakoff/knockback
             Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
             Optional dependencies: Backbone.ModelRef.js and BackboneORM.
           */

      var _underscore = __webpack_require__(0);

      var _underscore2 = _interopRequireDefault(_underscore);

      var _backbone = __webpack_require__(3);

      var _backbone2 = _interopRequireDefault(_backbone);

      var _knockout = __webpack_require__(2);

      var _knockout2 = _interopRequireDefault(_knockout);

      var _kb = __webpack_require__(1);

      var _kb2 = _interopRequireDefault(_kb);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      var COMPARE_EQUAL = 0;
      var COMPARE_ASCENDING = -1;
      var COMPARE_DESCENDING = 1;

      var KEYS_PUBLISH = ['destroy', 'shareOptions', 'filters', 'comparator', 'sortAttribute', 'viewModelByModel', 'hasViewModels'];

      var compare = exports.compare = function compare(value_a, value_b) {
        // String compare
        if (_underscore2.default.isString(value_a)) {
          return value_a.localeCompare('' + value_b);
        }
        if (_underscore2.default.isString(value_b)) {
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
      //    var todos = new kb.CollectionObservable(new Backbone.Collection([{name: 'name1'}, {name: 'name2'}]);
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
        // for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")

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
        function CollectionObservable() {
          var _this = this;

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _classCallCheck(this, CollectionObservable);

          this._onCollectionChange = function (event, arg) {
            return _kb2.default.ignore(function () {
              if (_this.in_edit || _kb2.default.wasReleased(_this)) return undefined; // we are doing the editing or have been released

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

                    var observable = _kb2.default.utils.wrappedObservable(_this);
                    var collection = _this._collection();
                    if (!~collection.indexOf(arg)) return undefined; // the model may have been removed before we got a chance to add it
                    var view_model = _this.viewModelByModel(arg);
                    if (view_model) return undefined; // it may have already been added by a change event
                    _this.in_edit++;
                    var comparator = _this._comparator();
                    if (comparator) {
                      observable().push(_this._createViewModel(arg));
                      observable.sort(comparator);
                    } else {
                      var vm = _this._createViewModel(arg);
                      observable.splice(collection.indexOf(arg), 0, vm);
                    }
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
                    _kb2.default.utils.wrappedObservable(_this).sort(_comparator2);
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
            return _kb2.default.ignore(function () {
              if (_this.in_edit) return; // we are doing the editing

              // validate input
              if (_this.models_only && models_or_view_models.length && !_kb2.default.isModel(models_or_view_models[0])) _kb2.default._throwUnexpected(_this, 'incorrect type passed');
              if (!_this.models_only && models_or_view_models.length && !(_underscore2.default.isObject(models_or_view_models[0]) || _kb2.default.isModel(models_or_view_models[0]))) _kb2.default._throwUnexpected(_this, 'incorrect type passed');

              var observable = _kb2.default.utils.wrappedObservable(_this);
              var collection = _kb2.default.peek(_this._collection);
              var has_filters = _kb2.default.peek(_this._filters).length;
              if (!collection) return; // no collection or we are updating ourselves

              var view_models = models_or_view_models;

              // set Models
              var models = void 0;
              if (_this.models_only) {
                models = _underscore2.default.filter(models_or_view_models, function (model) {
                  return !has_filters || _this._selectModel(model);
                });

                // set ViewModels
              } else {
                !has_filters || (view_models = []); // check for filtering of ViewModels
                models = [];
                _underscore2.default.each(models_or_view_models, function (view_model) {
                  var model = _kb2.default.utils.wrappedObject(view_model);
                  if (has_filters) {
                    if (!_this._selectModel(model)) return; // filtered so skip
                    view_models.push(view_model);
                  }

                  // check for view models being different (will occur if a ko select selectedOptions is bound to this collection observable) -> update our store
                  var current_view_model = _this.create_options.store.find(model, _this.create_options.creator);
                  if (current_view_model && current_view_model.constructor !== view_model.constructor) _kb2.default._throwUnexpected(_this, 'replacing different type of view model');
                  _this.create_options.store.retain(view_model, model, _this.create_options.creator);
                  models.push(model);
                });
              }

              // a change, update models
              _this.in_edit++;
              models_or_view_models.length === view_models.length || observable(view_models); // replace the ViewModels because they were filtered
              _underscore2.default.isEqual(collection.models, models) || collection.reset(models);
              _this.in_edit--;
            });
          };

          return _kb2.default.ignore(function () {
            var collection = null;
            if (_kb2.default.isCollection(args[0])) collection = args.shift();else collection = _underscore2.default.isArray(args[0]) ? new _backbone2.default.Collection(args.shift()) : new _backbone2.default.Collection();
            if (_underscore2.default.isFunction(args[0])) args[0] = { view_model: args[0] };

            var options = {};
            _underscore2.default.each(args, function (arg) {
              _kb2.default.assign(options, arg);options = _kb2.default.utils.collapseOptions(options);
            });

            var observable = _kb2.default.utils.wrappedObservable(_this, _knockout2.default.observableArray([]));
            observable.__kb_is_co = true; // mark as a kb.CollectionObservable
            _this.in_edit = 0;

            // bind callbacks
            if (!_this.__kb) _this.__kb = {};

            // options
            options = _kb2.default.utils.collapseOptions(options);
            if (options.auto_compact) {
              _this.auto_compact = true;
            }

            if (options.sort_attribute) _this._comparator = _knockout2.default.observable(_this._attributeComparator(options.sort_attribute));else _this._comparator = _knockout2.default.observable(options.comparator);

            if (options.filters) _this._filters = _knockout2.default.observableArray(_underscore2.default.isArray(options.filters) ? options.filters : [options.filters]);else _this._filters = _knockout2.default.observableArray([]);

            // create options
            _this.create_options = { store: _kb2.default.Store.useOptionsOrCreate(options, collection, observable) };
            var create_options = _this.create_options;
            _kb2.default.utils.wrappedObject(observable, collection);

            // view model factory create factories
            _this.path = options.path;
            create_options.factory = _kb2.default.utils.wrappedFactory(observable, _this._shareOrCreateFactory(options));
            create_options.path = _kb2.default.utils.pathJoin(options.path, 'models');

            // check for models only
            create_options.creator = create_options.factory.creatorForPath(null, create_options.path);
            if (create_options.creator) {
              _this.models_only = create_options.creator.models_only;
            }

            // publish public interface on the observable and return instead of this
            _kb2.default.publishMethods(observable, _this, KEYS_PUBLISH);

            // start the processing
            _this._collection = _knockout2.default.observable(collection);
            _this.collection = _knockout2.default.computed({
              read: function read() {
                return _this._collection();
              },
              write: function write(new_collection) {
                return _kb2.default.ignore(function () {
                  var previous_collection = _this._collection();
                  if (previous_collection === new_collection) return undefined; // no change

                  // @create_options.store.reuse(@, new_collection) # not meant to be shared
                  _kb2.default.utils.wrappedObject(observable, new_collection);

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
            _this._mapper = _knockout2.default.computed(function () {
              var comparator = _this._comparator(); // create dependency
              var filters = _this._filters(); // create dependency
              if (filters) _underscore2.default.each(filters, function (filter) {
                return _knockout2.default.utils.unwrapObservable(filter);
              }); // create a dependency
              var current_collection = _this._collection(); // create dependency
              if (_this.in_edit) return; // we are doing the editing

              // no models
              observable = _kb2.default.utils.wrappedObservable(_this);

              var models = void 0;
              if (current_collection) models = current_collection.models;

              var view_models = void 0;
              if (!models || current_collection.models.length === 0) view_models = [];
              // process filters, sorting, etc
              else {
                  // apply filters
                  models = _underscore2.default.filter(models, function (model) {
                    return !filters.length || _this._selectModel(model);
                  });

                  // apply sorting
                  if (comparator) view_models = _underscore2.default.map(models, function (model) {
                    return _this._createViewModel(model);
                  }).sort(comparator);
                  // no sorting
                  else if (_this.models_only) view_models = filters.length ? models : models.slice(); // clone the array if it wasn't filtered
                    else view_models = _underscore2.default.map(models, function (model) {
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
            observable.subscribe(_underscore2.default.bind(_this._onObservableArrayChange, _this));

            if (_kb2.default.statistics) _kb2.default.statistics.register('CollectionObservable', _this); // collect memory management statistics

            return observable;
          });
        }

        // Required clean up function to break cycles, release view models, etc.
        // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).

        // @nodoc


        _createClass(CollectionObservable, [{
          key: 'destroy',
          value: function destroy() {
            this.__kb_released = true;
            var observable = _kb2.default.utils.wrappedObservable(this);
            var collection = _kb2.default.peek(this._collection);_kb2.default.utils.wrappedObject(observable, null);
            if (collection) {
              collection.unbind('all', this._onCollectionChange);
              var array = _kb2.default.peek(observable);array.splice(0, array.length); // clear the view models or models
            }
            this.collection.dispose();this.collection = null;this._collection = null;observable.collection = null;
            this._mapper.dispose();this._mapper = null;
            _kb2.default.release(this._filters);this._filters = null;
            this._comparator(null);this._comparator = null;
            this.create_options = null;
            observable.collection = null;_kb2.default.utils.wrappedDestroy(this);

            if (_kb2.default.statistics) _kb2.default.statistics.unregister('CollectionObservable', this); // collect memory management statistics
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
            var observable = _kb2.default.utils.wrappedObservable(this);
            return { store: _kb2.default.utils.wrappedStore(observable), factory: _kb2.default.utils.wrappedFactory(observable) };
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
              return this._filters(_underscore2.default.isArray(_filters) ? _filters : [_filters]);
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
            return _underscore2.default.find(_kb2.default.peek(_kb2.default.utils.wrappedObservable(this)), function (test) {
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

            return _kb2.default.ignore(function () {
              var observable = _kb2.default.utils.wrappedObservable(_this2);
              if (!_kb2.default.utils.wrappedStoreIsOwned(observable)) return undefined;
              _kb2.default.utils.wrappedStore(observable).clear();
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
            var absolute_models_path = _kb2.default.utils.pathJoin(options.path, 'models');
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
            factory = new _kb2.default.Factory(options.factory);
            if (factories) {
              factory.addPathMappings(factories, options.path);
            }

            // set up the default create function
            if (!factory.creatorForPath(null, absolute_models_path)) {
              if (Object.prototype.hasOwnProperty.call(options, 'models_only')) {
                if (options.models_only) {
                  factory.addPathMapping(absolute_models_path, { models_only: true });
                } else {
                  factory.addPathMapping(absolute_models_path, _kb2.default.ViewModel);
                }
              } else if (options.view_model) {
                factory.addPathMapping(absolute_models_path, options.view_model);
              } else if (options.create) {
                factory.addPathMapping(absolute_models_path, { create: options.create });
              } else {
                factory.addPathMapping(absolute_models_path, _kb2.default.ViewModel);
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
            var observable = _kb2.default.utils.wrappedObservable(this);
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
              var attribute_name = _knockout2.default.utils.unwrapObservable(sort_attribute);
              return compare(model_a.get(attribute_name), model_b.get(attribute_name));
            };
            return this.models_only ? modelAttributeCompare : function (model_a, model_b) {
              return modelAttributeCompare(_kb2.default.utils.wrappedModel(model_a), _kb2.default.utils.wrappedModel(model_b));
            };
          }

          // @nodoc

        }, {
          key: '_createViewModel',
          value: function _createViewModel(model) {
            if (this.models_only) return model;
            return this.create_options.store.retainOrCreate(model, this.create_options);
          }

          // @nodoc

        }, {
          key: '_selectModel',
          value: function _selectModel(model) {
            var filters = _kb2.default.peek(this._filters);
            for (var i = 0, l = filters.length; i < l; i++) {
              var filter = filters[i];
              filter = _kb2.default.peek(filter);
              if (_underscore2.default.isFunction(filter)) {
                if (!filter(model)) return false;
              } else if (_underscore2.default.isArray(filter)) {
                if (!~filter.indexOf(model.id)) return false;
              } else if (model.id !== filter) return false;
            }
            return true;
          }
        }]);

        return CollectionObservable;
      }();

      // factory function


      CollectionObservable.extend = _backbone2.default.Model.extend;
      exports.default = CollectionObservable;
      var collectionObservable = exports.collectionObservable = function collectionObservable() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return new (Function.prototype.bind.apply(CollectionObservable, [null].concat(args)))();
      };

      /***/
    },
    /* 7 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.settings = undefined;

      var _underscore = __webpack_require__(0);

      var _underscore2 = _interopRequireDefault(_underscore);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      // import BackboneAssociations from './orms/backbone-associations';
      // import BackboneRelational from './orms/backbone-relational';

      var ALL_ORMS = {
        default: null
      };

      // @nodoc
      var settings = exports.settings = { orm: ALL_ORMS.default };
      for (var key in ALL_ORMS) {
        if (Object.prototype.hasOwnProperty.call(ALL_ORMS, key)) {
          var value = ALL_ORMS[key];
          if (value && value.isAvailable()) {
            settings.orm = value;
            break;
          }
        }
      }

      // @nodoc

      exports.default = function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _underscore2.default.each(options, function (value, key) {
          switch (key) {
            case 'orm':
              // set by name
              if (_underscore2.default.isString(value)) {
                if (!Object.prototype.hasOwnProperty.call(ALL_ORMS, value)) {
                  typeof console === 'undefined' || console.log('Knockback configure: could not find orm: ' + value + '. Available: ' + _underscore2.default.keys(ALL_ORMS).join(', '));
                  return;
                }

                var orm = ALL_ORMS[value];
                if (orm && !orm.isAvailable()) {
                  typeof console === 'undefined' || console.log('Knockback configure: could not enable orm ' + value + '. Make sure it is included before Knockback');
                  return;
                }
                settings.orm = orm;
              } else settings.orm = value;
              break;

            default:
              settings[key] = value;break;
          }
        });
      };

      /***/
    },
    /* 8 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
          }
        }return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
        };
      }(); /*
             knockback.js 2.0.0-alpha.1
             Copyright (c)  2011-2016 Kevin Malakoff.
             License: MIT (http://www.opensource.org/licenses/mit-license.php)
             Source: https://github.com/kmalakoff/knockback
             Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
             Optional dependencies: Backbone.ModelRef.js and BackboneORM.
           */

      var _underscore = __webpack_require__(0);

      var _underscore2 = _interopRequireDefault(_underscore);

      var _kb = __webpack_require__(1);

      var _kb2 = _interopRequireDefault(_kb);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      // Used to share the hierachy of constructors and create functions by path to allow for custom creation per Model attribute.
      //
      // @example Create an instance by path.
      //   var factory = new kb.Factory();
      //   factory.addPathMapping('bob.the.builder', kb.ViewModel);
      //   view_model = factory.createForPath(new Backbone.Model({name: 'Bob'}), 'bob.the.builder'); // creates kb.ViewModel
      var Factory = function () {
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
              return _kb2.default.utils.wrappedFactory(obj, options.factory);
            }

            // create a new factory
            var factory = _kb2.default.utils.wrappedFactory(obj, new _kb2.default.Factory(options.factory));
            if (options.factories) factory.addPathMappings(options.factories, owner_path);
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

            _underscore2.default.each(factories, function (create_info, path) {
              _this.paths[_kb2.default.utils.pathJoin(owner_path, path)] = create_info;
            });
          }
        }, {
          key: 'hasPathMappings',
          value: function hasPathMappings(factories, owner_path) {
            var all_exist = true;
            for (var path in factories) {
              if (Object.prototype.hasOwnProperty.call(factories, path)) {
                var creator = factories[path];
                var existing_creator = this.creatorForPath(null, _kb2.default.utils.pathJoin(owner_path, path));
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

      exports.default = Factory;

      /***/
    },
    /* 9 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";
      /* WEBPACK VAR INJECTION */
      (function (global) {

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.injectViewModels = undefined;

        var _underscore = __webpack_require__(0);

        var _underscore2 = _interopRequireDefault(_underscore);

        var _knockout = __webpack_require__(2);

        var _knockout2 = _interopRequireDefault(_knockout);

        var _kb = __webpack_require__(1);

        var _kb2 = _interopRequireDefault(_kb);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        var root = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : undefined;

        // custom Knockout `inject` binding
        /*
          knockback.js 2.0.0-alpha.1
          Copyright (c)  2011-2016 Kevin Malakoff.
          License: MIT (http://www.opensource.org/licenses/mit-license.php)
          Source: https://github.com/kmalakoff/knockback
          Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
          Optional dependencies: Backbone.ModelRef.js and BackboneORM.
        */

        var inject = function inject(data, view_model, element, value_accessor, all_bindings_accessor, nested) {
          var doInject = function doInject(value) {
            if (_underscore2.default.isFunction(value)) {
              view_model = new value(view_model, element, value_accessor, all_bindings_accessor); // use 'new' to allow for classes in addition to functions
              _kb2.default.releaseOnNodeRemove(view_model, element);
            } else {
              // view_model constructor causes a scope change
              if (value.view_model) {
                // specifying a view_model changes the scope so we need to bind a destroy
                view_model = new value.view_model(view_model, element, value_accessor, all_bindings_accessor);
                _kb2.default.releaseOnNodeRemove(view_model, element);
              }

              // resolve and merge in each key
              _underscore2.default.each(value, function (item, key) {
                if (key === 'view_model') return;

                // create function
                if (key === 'create') item(view_model, element, value_accessor, all_bindings_accessor);

                // resolve nested with assign or not
                else if (_underscore2.default.isObject(item) && !_underscore2.default.isFunction(item)) {
                    var target = nested || item && item.create ? {} : view_model;
                    view_model[key] = inject(item, target, element, value_accessor, all_bindings_accessor, true);

                    // simple set
                  } else view_model[key] = item;
              });
            }

            return view_model;
          };

          // in recursive calls, we are already protected from propagating dependencies to the template
          return nested ? doInject(data) : _kb2.default.ignore(function () {
            return doInject(data);
          });
        };

        _knockout2.default.bindingHandlers.inject = {
          init: function init(element, value_accessor, all_bindings_accessor, view_model) {
            return inject(_knockout2.default.utils.unwrapObservable(value_accessor()), view_model, element, value_accessor, all_bindings_accessor);
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

        var doBind = function doBind(app) {
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
            app.view_model = inject(data, app.view_model, app.el, null, null, true);
            afterBinding = app.view_model.afterBinding || options.afterBinding;
            beforeBinding = app.view_model.beforeBinding || options.beforeBinding;
          }

          // auto-bind
          if (beforeBinding) {
            beforeBinding.call(app.view_model, app.view_model, app.el, options);
          }
          _kb2.default.applyBindings(app.view_model, app.el, options);
          if (afterBinding) {
            afterBinding.call(app.view_model, app.view_model, app.el, options);
          }
        };

        // Searches the DOM from root or document for elements with the `'kb-inject'` attribute and create/customizes ViewModels for the DOM tree when encountered.
        // Also, used with the data-bind `'inject'` custom binding.
        // @param [DOM element] root the root DOM element to start searching for `'kb-inject'` attributes.
        // @return [Array] array of Objects with the DOM elements and ViewModels that were bound in the form `{el: DOM element, view_model: ViewModel}`.
        var injectViewModels = exports.injectViewModels = function injectViewModels() {
          var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : root.document;

          var results = [];
          if (!el.__kb_injected) {
            // already injected -> skip, but still process children in case they were added afterwards
            var attr = _underscore2.default.find(el.attributes || [], function (x) {
              return x.name === 'kb-inject';
            });
            if (attr) {
              el.__kb_injected = true; // mark injected
              var app = { el: el, view_model: {}, binding: attr.value };
              doBind(app);
              results.push(app);
            }
          }
          _underscore2.default.each(el.childNodes, function (child) {
            var childResults = injectViewModels(child);
            if (childResults.length) _underscore2.default.each(childResults, function (x) {
              return results.push(x);
            });
          });
          return results;
        };

        // auto-inject recursively
        var _ko_applyBindings = _knockout2.default.applyBindings;
        _knockout2.default.applyBindings = function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var el = args[1];
          var results = _kb2.default.RECUSIVE_AUTO_INJECT ? injectViewModels(el) : [];
          return results.length ? results : _ko_applyBindings.call.apply(_ko_applyBindings, [undefined].concat(args));
        };

        // ############################
        // Auto Inject results
        // ############################
        if (root && typeof root.document !== 'undefined') {
          // use simple ready check
          var onReady = function onReady() {
            // keep waiting for the document to load
            if (root.document.readyState !== 'complete') return setTimeout(onReady, 0);
            return injectViewModels(); // the document is loaded
          };
          onReady();
        }
        /* WEBPACK VAR INJECTION */
      }).call(exports, __webpack_require__(5));

      /***/
    },
    /* 10 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      var _knockout = __webpack_require__(2);

      var _knockout2 = _interopRequireDefault(_knockout);

      var _kb = __webpack_require__(1);

      var _kb2 = _interopRequireDefault(_kb);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      // Allow for dependent release until is resolved https://github.com/knockout/knockout/issues/1464
      /*
        knockback.js 2.0.0-alpha.1
        Copyright (c)  2011-2016 Kevin Malakoff.
        License: MIT (http://www.opensource.org/licenses/mit-license.php)
        Source: https://github.com/kmalakoff/knockback
        Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
        Optional dependencies: Backbone.ModelRef.js and BackboneORM.
      */

      if (_knockout2.default.subscribable && _knockout2.default.subscribable.fn && _knockout2.default.subscribable.fn.extend) {
        var _extend = _knockout2.default.subscribable.fn.extend;
        _knockout2.default.subscribable.fn.extend = function () {
          var _this = this;

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var target = _extend.apply(this, args);

          // release the extended observable
          if (target !== this && _kb2.default.isReleaseable(this)) {
            var _dispose = target.dispose;
            target.dispose = function () {
              for (var _len2 = arguments.length, args2 = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args2[_key2] = arguments[_key2];
              }

              !_dispose || _dispose.apply(target, args2);
              return _kb2.default.release(_this);
            };
          }

          return target;
        };
      }

      /***/
    },
    /* 11 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.observable = undefined;

      var _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
          }
        }return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
        };
      }(); /*
             knockback.js 2.0.0-alpha.1
             Copyright (c)  2011-2016 Kevin Malakoff.
             License: MIT (http://www.opensource.org/licenses/mit-license.php)
             Source: https://github.com/kmalakoff/knockback
             Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
             Optional dependencies: Backbone.ModelRef.js and BackboneORM.
           */

      var _underscore = __webpack_require__(0);

      var _underscore2 = _interopRequireDefault(_underscore);

      var _knockout = __webpack_require__(2);

      var _knockout2 = _interopRequireDefault(_knockout);

      var _kb = __webpack_require__(1);

      var _kb2 = _interopRequireDefault(_kb);

      var _typedValue = __webpack_require__(20);

      var _typedValue2 = _interopRequireDefault(_typedValue);

      var _eventWatcher = __webpack_require__(4);

      var _eventWatcher2 = _interopRequireDefault(_eventWatcher);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

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

      var Observable = function () {

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
          }this._vm = _vm;return _kb2.default.ignore(function () {
            key_or_info || _kb2.default._throwMissing(_this, 'key_or_info');
            _this.key = key_or_info.key || key_or_info;
            _underscore2.default.map(KEYS_INFO, function (key) {
              if (key_or_info[key]) {
                _this[key] = key_or_info[key];
              }
            });

            var create_options = _kb2.default.utils.collapseOptions(options);
            var event_watcher = create_options.event_watcher;

            delete create_options.event_watcher;

            // set up basics
            _this._value = new _typedValue2.default(create_options);
            _this._model = _knockout2.default.observable();
            var observable = _kb2.default.utils.wrappedObservable(_this, _knockout2.default.computed({
              read: function read() {
                var m = _this._model();
                var args = [_this.key].concat(_this.args || []);
                _underscore2.default.each(args, function (arg) {
                  return _knockout2.default.utils.unwrapObservable(arg);
                });

                var ew = _kb2.default.utils.wrappedEventWatcher(_this);
                !ew || ew.emitter(m || null);

                if (_this.read) {
                  _this.update(_this.read.apply(_this._vm, args));
                } else if (!_underscore2.default.isUndefined(m)) {
                  _kb2.default.ignore(function () {
                    return _this.update(_kb2.default.getValue(m, _kb2.default.peek(_this.key), _this.args));
                  });
                }
                return _this._value.value();
              },

              write: function write(new_value) {
                return _kb2.default.ignore(function () {
                  var unwrapped_new_value = _kb2.default.utils.unwrapModels(new_value); // unwrap for set (knockout may pass view models which are required for the observable but not the model)
                  var m = _kb2.default.peek(_this._model);
                  if (_this.write) {
                    _this.write.call(_this._vm, unwrapped_new_value);
                    new_value = _kb2.default.getValue(m, _kb2.default.peek(_this.key), _this.args);
                  } else if (m) {
                    _kb2.default.setValue(m, _kb2.default.peek(_this.key), unwrapped_new_value);
                  }
                  return _this.update(new_value);
                });
              },

              owner: _this._vm
            }));

            observable.__kb_is_o = true; // mark as a kb.Observable
            create_options.store = _kb2.default.utils.wrappedStore(observable, create_options.store);
            create_options.path = _kb2.default.utils.pathJoin(create_options.path, _this.key);
            if (create_options.factories && (typeof create_options.factories === 'function' || create_options.factories.create)) {
              create_options.factory = _kb2.default.utils.wrappedFactory(observable, new _kb2.default.Factory(create_options.factory));
              create_options.factory.addPathMapping(create_options.path, create_options.factories);
            } else create_options.factory = _kb2.default.Factory.useOptionsOrCreate(create_options, observable, create_options.path);
            delete create_options.factories;

            // publish public interface on the observable and return instead of this
            _kb2.default.publishMethods(observable, _this, KEYS_PUBLISH);

            // use external model observable or create
            _this.model = _knockout2.default.computed({
              read: function read() {
                return _knockout2.default.utils.unwrapObservable(_this._model);
              },
              write: function write(new_model) {
                return _kb2.default.ignore(function () {
                  if (_this.__kb_released || _kb2.default.peek(_this._model) === new_model) return undefined; // destroyed or no change

                  // update references
                  var new_value = _kb2.default.getValue(new_model, _kb2.default.peek(_this.key), _this.args);
                  _this._model(new_model);
                  if (!new_model) {
                    return _this.update(null);
                  } else if (!_underscore2.default.isUndefined(new_value)) {
                    return _this.update(new_value);
                  }
                  return undefined;
                });
              }
            });
            observable.model = _this.model;

            _eventWatcher2.default.useOptionsOrCreate({ event_watcher: event_watcher }, model || null, _this, {
              emitter: _this.model,
              update: function update() {
                return _kb2.default.ignore(function () {
                  return _this.update();
                });
              },
              key: _this.key,
              path: create_options.path
            });
            _this._value.rawValue() || _this._value.update(); // wasn't loaded so create

            // wrap ourselves with a localizer
            if (_kb2.default.LocalizedObservable && key_or_info.localizer) observable = new key_or_info.localizer(observable);

            // wrap ourselves with a default value
            if (_kb2.default.DefaultObservable && Object.prototype.hasOwnProperty.call(key_or_info, 'default')) observable = _kb2.default.defaultObservable(observable, key_or_info.default);

            return observable;
          });
        }

        // Required clean up function to break cycles, release view models, etc.
        // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


        _createClass(Observable, [{
          key: 'destroy',
          value: function destroy() {
            var observable = _kb2.default.utils.wrappedObservable(this);
            this.__kb_released = true;
            this._value.destroy();this._value = null;
            this.model.dispose();this.model = null;observable.model = null;
            return _kb2.default.utils.wrappedDestroy(this);
          }

          // @return [kb.CollectionObservable|kb.ViewModel|ko.observable] exposes the raw value inside the kb.observable.
          // For example, if your attribute is a Collection, it will hold a CollectionObservable.

        }, {
          key: 'value',
          value: function value() {
            return this._value.rawValue();
          }

          // @return [kb.TYPE_UNKNOWN|kb.TYPE_SIMPLE|kb.TYPE_ARRAY|kb.TYPE_MODEL|kb.TYPE_COLLECTION] provides the type of the wrapped value.

        }, {
          key: 'valueType',
          value: function valueType() {
            return this._value.valueType(_kb2.default.peek(this._model), _kb2.default.peek(this.key));
          }

          // ###################################################
          // Internal
          // ###################################################
          // @nodoc

        }, {
          key: 'update',
          value: function update(new_value) {
            if (this.__kb_released) return undefined; // destroyed, nothing to do
            if (!arguments.length) new_value = _kb2.default.getValue(_kb2.default.peek(this._model), _kb2.default.peek(this.key));
            return this._value.update(new_value);
          }
        }]);

        return Observable;
      }();

      exports.default = Observable;
      var observable = exports.observable = function observable() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return new (Function.prototype.bind.apply(Observable, [null].concat(args)))();
      };

      /***/
    },
    /* 12 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
          }
        }return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
        };
      }(); /*
             knockback.js 2.0.0-alpha.1
             Copyright (c)  2011-2016 Kevin Malakoff.
             License: MIT (http://www.opensource.org/licenses/mit-license.php)
             Source: https://github.com/kmalakoff/knockback
             Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
             Optional dependencies: Backbone.ModelRef.js and BackboneORM.
           */

      var _underscore = __webpack_require__(0);

      var _underscore2 = _interopRequireDefault(_underscore);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

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
            var event_groups = _underscore2.default.groupBy(this.model_events_tracker, function (test) {
              return 'event name: \'' + test.name + '\', attribute name: \'' + test.key + '\'';
            });
            _underscore2.default.each(event_groups, function (value, key) {
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
            var index = _underscore2.default.indexOf(type_tracker, obj);
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
            _underscore2.default.each(this.registered_tracker[type], function (type_tracker) {
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
            _underscore2.default.each(this.registered_tracker, function (type_tracker, type) {
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
            var keys = key ? [key] : _underscore2.default.keys(events);

            _underscore2.default.each(keys, function (key_) {
              var node = events[key_];
              if (node) {
                if (_underscore2.default.isArray(node)) {
                  stats[key_] = _underscore2.default.compact(node).length;
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

      exports.default = Statistics;

      /***/
    },
    /* 13 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
          }
        }return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
        };
      }(); /*
             knockback.js 2.0.0-alpha.1
             Copyright (c)  2011-2016 Kevin Malakoff.
             License: MIT (http://www.opensource.org/licenses/mit-license.php)
             Source: https://github.com/kmalakoff/knockback
             Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
             Optional dependencies: Backbone.ModelRef.js and BackboneORM.
           */

      var _underscore = __webpack_require__(0);

      var _underscore2 = _interopRequireDefault(_underscore);

      var _knockout = __webpack_require__(2);

      var _knockout2 = _interopRequireDefault(_knockout);

      var _kb = __webpack_require__(1);

      var _kb2 = _interopRequireDefault(_kb);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

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
          key: 'useOptionsOrCreate',

          // Used to either register yourself with the existing store or to create a new store.
          //
          // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
          // @param [Instance] obj the instance that will own or register with the store
          // @param [ko.observable] observable the observable that will own the store
          // @example
          //   kb.Store.useOptionsOrCreate(model, this, options);
          value: function useOptionsOrCreate(options, obj, observable) {
            if (!options.store) {
              _kb2.default.utils.wrappedStoreIsOwned(observable, true);
            }
            var store = _kb2.default.utils.wrappedStore(observable, options.store || new _kb2.default.Store());
            store.retain(observable, obj, options.creator);
            return store;
          }

          // Used to create a new kb.Store.

          // @nodoc

        }]);

        function Store() {
          _classCallCheck(this, Store);

          this.observable_records = {};
          this.replaced_observables = [];
          _kb2.default.Store.instances.push(this);
        }

        // Required clean up function to break cycles, release view models, etc.
        // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


        _createClass(Store, [{
          key: 'destroy',
          value: function destroy() {
            this.__kb_released = true;
            this.clear();
            var index = _underscore2.default.indexOf(_kb2.default.Store.instances, this);
            if (~index) _kb2.default.Store.instances.splice(index, 1);
          }

          // Manually clear the store

        }, {
          key: 'clear',
          value: function clear() {
            var _this = this;

            var observable_records = this.observable_records;
            this.observable_records = {};
            _underscore2.default.each(observable_records, function (records) {
              _underscore2.default.each(records, function (observable) {
                return _this.release(observable, true);
              });
            });

            var replaced_observables = this.replaced_observables;
            this.replaced_observables = [];
            _underscore2.default.each(replaced_observables, function (observable) {
              if (!observable.__kb_released) _this.release(observable, true);
            });
          }

          // Manually compact the store by searching for released view models

        }, {
          key: 'compact',
          value: function compact() {
            _underscore2.default.each(this.observable_records, function (records) {
              _underscore2.default.each(records, function (observable, cid) {
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
            if (!creator) return _kb2.default.utils.createFromDefaultCreator(obj, options);
            if (creator.models_only) return obj;

            var observable = this.find(obj, creator);
            if (observable) {
              return deep_retain && _kb2.default.settings.deep_retain ? this.retain(observable, obj, creator) : observable;
            }
            if (!_underscore2.default.isFunction(creator.create || creator)) throw new Error('Invalid factory for "' + options.path + '"');

            observable = _kb2.default.ignore(function () {
              options = _underscore2.default.defaults({ store: _this2, creator: creator }, options); // set our own creator so we can register ourselves above
              observable = creator.create ? creator.create(obj, options) : new creator(obj, options);
              return observable || _knockout2.default.observable(null);
            }); // default to null

            this.retain(observable, obj, creator);
            return observable;
          }

          // @nodoc

        }, {
          key: 'reuse',
          value: function reuse(observable, obj) {
            var current_obj = _kb2.default.utils.wrappedObject(observable);
            if (current_obj === obj) return;
            if (!this._canRegister(observable)) throw new Error('Cannot reuse a simple observable');
            if (this._refCount(observable) !== 1) throw new Error('Trying to change a shared view model. Ref count: ' + this._refCount(observable));

            var creator = _kb2.default.utils.wrappedCreator(observable) || observable.constructor; // default is to use the constructor
            var current_observable = void 0;
            if (!_underscore2.default.isUndefined(current_obj)) current_observable = this.find(current_obj, creator);
            this.retain(observable, obj, creator);
            if (current_observable) this.release(current_observable);
          }

          // Release a reference to a a ViewModel in this store.

        }, {
          key: 'release',
          value: function release(observable, force) {
            if (!this._canRegister(observable)) return _kb2.default.release(observable); // just release

            // maybe be externally added
            var store_references = this._storeReferences(observable);
            if (store_references) {
              if (!force && --store_references.ref_count > 0) return undefined; // do not release yet
              this._clearStoreReferences(observable);
            }

            this._remove(observable);
            if (observable.__kb_released) return undefined;
            if (force || this._refCount(observable) <= 1) return _kb2.default.release(observable); // allow for a single initial reference in another store
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
            var stores_references = _kb2.default.utils.get(observable, 'stores_references');
            if (!stores_references) return 1;
            return _underscore2.default.reduce(stores_references, function (memo, store_references) {
              return memo + store_references.ref_count;
            }, 0);
          }

          // @nodoc

        }, {
          key: '_canRegister',
          value: function _canRegister(observable) {
            return observable && !_knockout2.default.isObservable(observable) && !observable.__kb_is_co;
          } // only register view models not basic ko.observables nor kb.CollectionObservables

          // @nodoc

        }, {
          key: '_cid',
          value: function _cid(obj) {
            if (!obj) return 'null';
            if (!obj.cid) obj.cid = _underscore2.default.uniqueId('c');
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
            var item = { create: create, cid: _underscore2.default.uniqueId('kb') };
            create.__kb_cids.push(item);
            return item.cid;
          }

          // @nodoc

        }, {
          key: '_storeReferences',
          value: function _storeReferences(observable) {
            var _this3 = this;

            var stores_references = _kb2.default.utils.get(observable, 'stores_references');
            if (!stores_references) return undefined;

            return _underscore2.default.find(stores_references, function (ref) {
              return ref.store === _this3;
            });
          }

          // @nodoc

        }, {
          key: '_getOrCreateStoreReferences',
          value: function _getOrCreateStoreReferences(observable) {
            var _this4 = this;

            var stores_references = _kb2.default.utils.orSet(observable, 'stores_references', []);

            var ref = _underscore2.default.find(stores_references, function (x) {
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
            var stores_references = _kb2.default.utils.orSet(observable, 'stores_references', []);
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
            _kb2.default.utils.wrappedObject(observable, obj);_kb2.default.utils.wrappedCreator(observable, creator);

            var name = this._creatorId(creator);
            if (!this.observable_records[name]) this.observable_records[name] = {};
            this.observable_records[name][this._cid(obj)] = observable;
            return observable;
          }

          // @nodoc

        }, {
          key: '_remove',
          value: function _remove(observable) {
            var creator = _kb2.default.utils.wrappedCreator(observable) || observable.constructor; // default is to use the constructor
            var obj = _kb2.default.utils.wrappedObject(observable);
            var current_observable = this.find(obj, creator);

            // already released
            if (current_observable && current_observable === observable) {
              delete this.observable_records[this._creatorId(creator)][this._cid(obj)]; // not already replaced
            }
            _kb2.default.utils.wrappedObject(observable, null);
            return _kb2.default.utils.wrappedCreator(observable, null);
          }

          // @nodoc

        }, {
          key: '_creator',
          value: function _creator(obj, options) {
            if (options.creator) return options.creator;
            var creator = _kb2.default.utils.inferCreator(obj, options.factory, options.path);
            if (creator) return creator;
            if (_kb2.default.isModel(obj)) return _kb2.default.ViewModel;
            return undefined;
          }
        }]);

        return Store;
      }();

      Store.instances = [];
      exports.default = Store;

      /***/
    },
    /* 14 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
          }
        }return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
        };
      }(); /*
             knockback.js 2.0.0-alpha.1
             Copyright (c)  2011-2016 Kevin Malakoff.
             License: MIT (http://www.opensource.org/licenses/mit-license.php)
             Source: https://github.com/kmalakoff/knockback
             Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
             Optional dependencies: Backbone.ModelRef.js and BackboneORM.
           */

      var _underscore = __webpack_require__(0);

      var _underscore2 = _interopRequireDefault(_underscore);

      var _backbone = __webpack_require__(3);

      var _backbone2 = _interopRequireDefault(_backbone);

      var _knockout = __webpack_require__(2);

      var _knockout2 = _interopRequireDefault(_knockout);

      var _kb = __webpack_require__(1);

      var _kb2 = _interopRequireDefault(_kb);

      var _wrappedDestroy = __webpack_require__(18);

      var _wrappedDestroy2 = _interopRequireDefault(_wrappedDestroy);

      var _collapseOptions = __webpack_require__(16);

      var _collapseOptions2 = _interopRequireDefault(_collapseOptions);

      var _unwrapModels = __webpack_require__(17);

      var _unwrapModels2 = _interopRequireDefault(_unwrapModels);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      // ###################################################
      // Public API
      // ###################################################

      // Library of general-purpose utilities
      var utils = function () {
        function utils() {
          _classCallCheck(this, utils);
        }

        _createClass(utils, null, [{
          key: 'get',

          // @nodoc


          // Helper to merge options including ViewmModel options like `keys` and `factories`
          //
          // @param [Object] obj the object to test
          //
          // @example
          //   kb.utils.collapseOptions(options);
          value: function get(obj, key, default_value) {
            return !obj.__kb || !Object.prototype.hasOwnProperty.call(obj.__kb, key) ? default_value : obj.__kb[key];
          }

          // @nodoc


          // used for attribute setting to ensure all model attributes have their underlying models

          // Clean up function that releases all of the wrapped values on an owner.

        }, {
          key: 'set',
          value: function set(obj, key, value) {
            (obj.__kb || (obj.__kb = {}))[key] = value;
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
            if (arguments.length === 1) return _kb2.default.utils.get(obj, 'observable');
            return _kb2.default.utils.set(obj, 'observable', value);
          }

          // Dual-purpose getter/setter for retrieving and storing the Model or Collection on an owner.
          // @note this is almost the same as {kb.utils.wrappedModel} except that if the Model doesn't exist, it returns null.
          //
          // @overload wrappedObject(obj)
          //   Gets the observable from an object
          //   @param [Object|kb.ViewModel|kb.CollectionObservable] obj owner the ViewModel/CollectionObservable owning the Backbone.Model or Backbone.Collection.
          //   @return [Model|Collection] the model/collection
          // @overload wrappedObject(obj, value)
          //   Sets the observable on an object
          //   @param [Object|kb.ViewModel|kb.CollectionObservable] obj owner the ViewModel/CollectionObservable owning the Backbone.Model or Backbone.Collection.
          //   @param [Model|Collection] value the model/collection
          //
          // @example
          //   var model = kb.utils.wrappedObject(view_model);
          //   var collection = kb.utils.wrappedObject(collection_observable);

        }, {
          key: 'wrappedObject',
          value: function wrappedObject(obj, value) {
            if (arguments.length === 1) {
              return _kb2.default.utils.get(obj, 'object');
            }return _kb2.default.utils.set(obj, 'object', value);
          }

          // @nodoc

        }, {
          key: 'wrappedCreator',
          value: function wrappedCreator(obj, value) {
            if (arguments.length === 1) {
              return _kb2.default.utils.get(obj, 'creator');
            }return _kb2.default.utils.set(obj, 'creator', value);
          }

          // Dual-purpose getter/setter for retrieving and storing the Model on a ViewModel.
          // @note this is almost the same as {kb.utils.wrappedObject} except that if the Model doesn't exist, it returns the ViewModel itself (which is useful behaviour for sorting because
          // it you can iterate over a kb.CollectionObservable's ko.ObservableArray whether it holds ViewModels or Models with the models_only option).
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
            if (arguments.length !== 1) return _kb2.default.utils.set(obj, 'object', value);
            value = _kb2.default.utils.get(obj, 'object');
            return _underscore2.default.isUndefined(value) ? obj : value;
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
              return _kb2.default.utils.get(obj, 'store');
            }return _kb2.default.utils.set(obj, 'store', value);
          }

          // @private

        }, {
          key: 'wrappedStoreIsOwned',
          value: function wrappedStoreIsOwned(obj, value) {
            if (arguments.length === 1) {
              return _kb2.default.utils.get(obj, 'store_is_owned');
            }return _kb2.default.utils.set(obj, 'store_is_owned', value);
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
              return _kb2.default.utils.get(obj, 'factory');
            }return _kb2.default.utils.set(obj, 'factory', value);
          }

          // Dual-purpose getter/setter for retrieving and storing a EventWatcher on an owner.
          //
          // @overload wrappedEventWatcher(obj)
          //   Gets the event_watcher from an object
          //   @param [Any] obj the owner
          //   @return [EventWatcher] the event_watcher
          // @overload wrappedEventWatcher(obj, event_watcher)
          //   Sets the event_watcher on an object
          //   @param [Any] obj the owner
          //   @param [EventWatcher] event_watcher the event_watcher

        }, {
          key: 'wrappedEventWatcher',
          value: function wrappedEventWatcher(obj, value) {
            if (arguments.length === 1) {
              return _kb2.default.utils.get(obj, 'event_watcher');
            }return _kb2.default.utils.set(obj, 'event_watcher', value);
          }

          // @private

        }, {
          key: 'wrappedEventWatcherIsOwned',
          value: function wrappedEventWatcherIsOwned(obj, value) {
            if (arguments.length === 1) {
              return _kb2.default.utils.get(obj, 'event_watcher_is_owned');
            }return _kb2.default.utils.set(obj, 'event_watcher_is_owned', value);
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
            if (!observable) return _kb2.default.TYPE_UNKNOWN;
            if (observable.__kb_is_o) return observable.valueType();
            if (observable.__kb_is_co || _kb2.default.isCollection(observable)) return _kb2.default.TYPE_COLLECTION;
            if (observable instanceof _kb2.default.ViewModel || _kb2.default.isModel(observable)) return _kb2.default.TYPE_MODEL;
            if (_underscore2.default.isArray(observable)) return _kb2.default.TYPE_ARRAY;
            return _kb2.default.TYPE_SIMPLE;
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
            return _underscore2.default.defaults({ path: this.pathJoin(options.path, path) }, options);
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
            if (value instanceof _backbone2.default.Model) {
              return _kb2.default.ViewModel;
            }
            if (value instanceof _backbone2.default.Collection) {
              return _kb2.default.CollectionObservable;
            }
            return null;
          }

          // Creates an observable based on a value's type.

        }, {
          key: 'createFromDefaultCreator',
          value: function createFromDefaultCreator(obj, options) {
            if (_kb2.default.isModel(obj)) {
              return _kb2.default.viewModel(obj, options);
            }
            if (_kb2.default.isCollection(obj)) {
              return _kb2.default.collectionObservable(obj, options);
            }
            if (_underscore2.default.isArray(obj)) {
              return _knockout2.default.observableArray(obj);
            }
            return _knockout2.default.observable(obj);
          }

          // @nodoc

        }, {
          key: 'resolveModel',
          value: function resolveModel(model) {
            if (model && _backbone2.default && _backbone2.default.ModelRef && model instanceof _backbone2.default.ModelRef) {
              return model.model();
            }return model;
          }
        }]);

        return utils;
      }();

      utils.wrappedDestroy = _wrappedDestroy2.default;
      utils.collapseOptions = _collapseOptions2.default;
      utils.unwrapModels = _unwrapModels2.default;
      exports.default = utils;

      /***/
    },
    /* 15 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.viewModel = undefined;

      var _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
          }
        }return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
        };
      }(); /*
             knockback.js 2.0.0-alpha.1
             Copyright (c)  2011-2016 Kevin Malakoff.
             License: MIT (http://www.opensource.org/licenses/mit-license.php)
             Source: https://github.com/kmalakoff/knockback
             Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
             Optional dependencies: Backbone.ModelRef.js and BackboneORM.
           */

      var _underscore = __webpack_require__(0);

      var _underscore2 = _interopRequireDefault(_underscore);

      var _backbone = __webpack_require__(3);

      var _backbone2 = _interopRequireDefault(_backbone);

      var _knockout = __webpack_require__(2);

      var _knockout2 = _interopRequireDefault(_knockout);

      var _kb = __webpack_require__(1);

      var _kb2 = _interopRequireDefault(_kb);

      var _eventWatcher = __webpack_require__(4);

      var _eventWatcher2 = _interopRequireDefault(_eventWatcher);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      // @nodoc
      var assignViewModelKey = function assignViewModelKey(vm, key) {
        var vm_key = vm.__kb.internals && ~_underscore2.default.indexOf(vm.__kb.internals, key) ? '_' + key : key;
        if (Object.prototype.hasOwnProperty.call(vm.__kb.view_model, vm_key)) return undefined; // already exists, skip
        vm.__kb.view_model[vm_key] = null;
        return vm_key;
      };

      // @nodoc
      var createObservable = function createObservable(vm, model, key, create_options) {
        if (vm.__kb.excludes && ~_underscore2.default.indexOf(vm.__kb.excludes, key)) return undefined;
        if (vm.__kb.statics && ~_underscore2.default.indexOf(vm.__kb.statics, key)) return undefined;
        var vm_key = assignViewModelKey(vm, key);
        if (!vm_key) return undefined;
        var observable = _kb2.default.observable(model, key, create_options, vm);
        vm.__kb.view_model[vm_key] = observable;vm[vm_key] = observable;
        return observable;
      };

      // @nodoc
      var createStaticObservables = function createStaticObservables(vm, model) {
        _underscore2.default.each(vm.__kb.statics, function (key) {
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
        // for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")

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
        function ViewModel() {
          var _this = this;

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _classCallCheck(this, ViewModel);

          return _kb2.default.ignore(function () {
            var model = args.shift();
            !model || _kb2.default.isModel(model) || _kb2.default._throwUnexpected(_this, 'not a model');

            if (_underscore2.default.isArray(args[0])) args[0] = { keys: args[0] };
            if (!_this.__kb) {
              _this.__kb = {};
            }_this.__kb.view_model = args.length > 1 ? args.pop() : _this;

            var options = {};
            _underscore2.default.each(args, function (arg) {
              _kb2.default.assign(options, arg);options = _kb2.default.utils.collapseOptions(options);
            });
            _underscore2.default.each(KEYS_OPTIONS, function (key) {
              if (Object.prototype.hasOwnProperty.call(options, key)) _this.__kb[key] = options[key];
            });

            // always use a store to ensure recursive view models are handled correctly
            _kb2.default.Store.useOptionsOrCreate(options, model, _this);

            // view model factory
            _this.__kb.path = options.path;
            _kb2.default.Factory.useOptionsOrCreate(options, _this, options.path);

            var event_watcher = _kb2.default.utils.wrappedEventWatcher(_this, new _eventWatcher2.default(model, _this, {
              emitter: _this._model,
              update: function update() {
                return _kb2.default.ignore(function () {
                  return !(event_watcher && event_watcher.ee) || _this.createObservables(event_watcher.ee);
                });
              }
            }));

            var _model = _kb2.default.utils.set(_this, '_model', _knockout2.default.observable());
            _this.model = _knockout2.default.computed({
              read: function read() {
                return _knockout2.default.utils.unwrapObservable(_model);
              },
              write: function write(new_model) {
                return _kb2.default.ignore(function () {
                  if (_kb2.default.utils.wrappedObject(_this) === new_model || _kb2.default.wasReleased(_this) || !event_watcher) return undefined;

                  _this.__kb.store.reuse(_this, _kb2.default.utils.resolveModel(new_model));
                  event_watcher.emitter(new_model);_model(event_watcher.ee);
                  return !event_watcher.ee || _this.createObservables(event_watcher.ee);
                });
              }
            });

            model = event_watcher.ee;
            _kb2.default.utils.wrappedObject(_this, model);_model(event_watcher.ee);

            // update the observables
            _this.__kb.create_options = { store: _kb2.default.utils.wrappedStore(_this), factory: _kb2.default.utils.wrappedFactory(_this), path: _this.__kb.path, event_watcher: _kb2.default.utils.wrappedEventWatcher(_this) };
            !options.requires || _this.createObservables(model, options.requires);
            !_this.__kb.internals || _this.createObservables(model, _this.__kb.internals);
            !options.mappings || _this.createObservables(model, options.mappings);
            !_this.__kb.statics || createStaticObservables(_this, model);
            _this.createObservables(model, _this.__kb.keys);

            if (_kb2.default.statistics) _kb2.default.statistics.register('ViewModel', _this); // collect memory management statistics
            return _this;
          });
        }

        // Required clean up function to break cycles, release view models, etc.
        // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).

        // @nodoc


        _createClass(ViewModel, [{
          key: 'destroy',
          value: function destroy() {
            var _this2 = this;

            this.__kb_released = true;
            if (this.__kb.view_model !== this) {
              _underscore2.default.each(this.__kb.vm_keys, function (key) {
                _this2.__kb.view_model[key] = null;
              });
            }

            // clear the external references
            this.__kb.view_model = null;this.__kb.create_options = null;
            _kb2.default.releaseKeys(this);
            _kb2.default.utils.wrappedDestroy(this);

            if (_kb2.default.statistics) _kb2.default.statistics.unregister('ViewModel', this); // collect memory management statistics
          }

          // Get the options for a new view model that can be used for sharing view models.

        }, {
          key: 'shareOptions',
          value: function shareOptions() {
            return { store: _kb2.default.utils.wrappedStore(this), factory: _kb2.default.utils.wrappedFactory(this) };
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

              if (_kb2.default.settings.orm && _kb2.default.settings.orm.keys) {
                _underscore2.default.each(_kb2.default.settings.orm.keys(model), function (key) {
                  createObservable(_this3, model, key, _this3.__kb.create_options);
                });
              }
            } else if (_underscore2.default.isArray(keys)) {
              _underscore2.default.map(keys, function (key) {
                return createObservable(_this3, model, key, _this3.__kb.create_options);
              });
            } else {
              _underscore2.default.each(keys, function (mapping_info, key) {
                var vm_key = assignViewModelKey(_this3, key);
                if (vm_key) {
                  if (!_underscore2.default.isString(mapping_info) && !mapping_info.key) mapping_info.key = vm_key;
                  _this3[vm_key] = _kb2.default.observable(model, mapping_info, _this3.__kb.create_options, _this3);
                  _this3.__kb.view_model[vm_key] = _this3[vm_key];
                }
              });
            }
          }
        }]);

        return ViewModel;
      }();

      // Factory function to create a kb.ViewModel.


      ViewModel.extend = _backbone2.default.Model.extend;
      exports.default = ViewModel;
      var viewModel = exports.viewModel = function viewModel() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return new (Function.prototype.bind.apply(ViewModel, [null].concat(args)))();
      };

      /***/
    },
    /* 16 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _underscore = __webpack_require__(0);

      var _underscore2 = _interopRequireDefault(_underscore);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var assign = _underscore2.default.assign || _underscore2.default.extend;

      // @nodoc
      /*
        knockback.js 2.0.0-alpha.1
        Copyright (c)  2011-2016 Kevin Malakoff.
        License: MIT (http://www.opensource.org/licenses/mit-license.php)
        Source: https://github.com/kmalakoff/knockback
        Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
        Optional dependencies: Backbone.ModelRef.js and BackboneORM.
      */

      var _mergeArray = function _mergeArray(result, key, value) {
        if (!result[key]) result[key] = [];
        if (!_underscore2.default.isArray(value)) value = [value];
        result[key] = result[key].length ? _underscore2.default.union(result[key], value) : value;
        return result;
      };

      // @nodoc
      var _mergeObject = function _mergeObject(result, key, value) {
        if (!result[key]) result[key] = {};
        return assign(result[key], value);
      };

      // @nodoc
      var _keyArrayToObject = function _keyArrayToObject(value) {
        var result = {};
        _underscore2.default.each(value, function (item) {
          result[item] = { key: item };
        });
        return result;
      };

      var _mergeOptions = function _mergeOptions(result, options) {
        if (!options) return result;

        _underscore2.default.each(options, function (value, key) {
          switch (key) {
            case 'internals':case 'requires':case 'excludes':case 'statics':
              _mergeArray(result, key, value);break;
            case 'keys':
              // an object
              if (_underscore2.default.isObject(value) && !_underscore2.default.isArray(value) || _underscore2.default.isObject(result[key]) && !_underscore2.default.isArray(result[key])) {
                if (!_underscore2.default.isObject(value)) {
                  value = [value];
                }
                if (_underscore2.default.isArray(value)) {
                  value = _keyArrayToObject(value);
                }
                if (_underscore2.default.isArray(result[key])) {
                  result[key] = _keyArrayToObject(result[key]);
                }
                _mergeObject(result, key, value);

                // an array
              } else _mergeArray(result, key, value);
              break;

            case 'factories':
              if (_underscore2.default.isFunction(value)) result[key] = value;else _mergeObject(result, key, value);
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

      exports.default = function (options) {
        return _mergeOptions({}, options);
      };

      /***/
    },
    /* 17 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _underscore = __webpack_require__(0);

      var _underscore2 = _interopRequireDefault(_underscore);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      // @nodoc
      exports.default = function (obj) {
        if (!obj) return obj;
        if (obj.__kb) return Object.prototype.hasOwnProperty.call(obj.__kb, 'object') ? obj.__kb.object : obj;
        if (_underscore2.default.isArray(obj)) return _underscore2.default.map(obj, function (test) {
          return unwrapModels(test);
        });
        if (_underscore2.default.isObject(obj) && obj.constructor === {}.constructor) {
          // a simple object
          var result = {};
          _underscore2.default.each(obj, function (value, key) {
            result[key] = unwrapModels(value);
          });
          return result;
        }

        return obj;
      }; /*
           knockback.js 2.0.0-alpha.1
           Copyright (c)  2011-2016 Kevin Malakoff.
           License: MIT (http://www.opensource.org/licenses/mit-license.php)
           Source: https://github.com/kmalakoff/knockback
           Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
           Optional dependencies: Backbone.ModelRef.js and BackboneORM.
         */

      /***/
    },
    /* 18 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      /*
        knockback.js 2.0.0-alpha.1
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
          wrappedDestroy(__kb.observable);__kb.observable = null;
        }
        __kb.factory = null;

        // release the event_watcher
        if (__kb.event_watcher_is_owned) __kb.event_watcher.destroy();
        __kb.event_watcher = null;

        // release the store
        if (__kb.store_is_owned) __kb.store.destroy();
        __kb.store = null;

        if (__kb.stores_references) {
          var store_references = __kb.stores_references.pop();
          while (store_references) {
            if (!store_references.store.__kb_released) store_references.store.release(obj);
            store_references = __kb.stores_references.pop();
          }
        }
      };

      exports.default = wrappedDestroy;

      /***/
    },
    /* 19 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      var _underscore = __webpack_require__(0);

      var _underscore2 = _interopRequireDefault(_underscore);

      var _backbone = __webpack_require__(3);

      var _backbone2 = _interopRequireDefault(_backbone);

      var _knockout = __webpack_require__(2);

      var _knockout2 = _interopRequireDefault(_knockout);

      __webpack_require__(10);

      var _kb = __webpack_require__(1);

      var _kb2 = _interopRequireDefault(_kb);

      var _collectionObservable = __webpack_require__(6);

      var _collectionObservable2 = _interopRequireDefault(_collectionObservable);

      var _configure = __webpack_require__(7);

      var _configure2 = _interopRequireDefault(_configure);

      var _eventWatcher = __webpack_require__(4);

      var _eventWatcher2 = _interopRequireDefault(_eventWatcher);

      var _factory = __webpack_require__(8);

      var _factory2 = _interopRequireDefault(_factory);

      var _inject = __webpack_require__(9);

      var _observable = __webpack_require__(11);

      var _observable2 = _interopRequireDefault(_observable);

      var _statistics = __webpack_require__(12);

      var _statistics2 = _interopRequireDefault(_statistics);

      var _store = __webpack_require__(13);

      var _store2 = _interopRequireDefault(_store);

      var _utils = __webpack_require__(14);

      var _utils2 = _interopRequireDefault(_utils);

      var _viewModel = __webpack_require__(15);

      var _viewModel2 = _interopRequireDefault(_viewModel);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var api = {
        _: _underscore2.default,
        Backbone: _backbone2.default,
        ko: _knockout2.default,
        CollectionObservable: _collectionObservable2.default,
        collectionObservable: _collectionObservable.collectionObservable,
        observableCollection: _collectionObservable.collectionObservable,
        compare: _collectionObservable.compare,
        configure: _configure2.default,
        settings: _configure.settings,
        EventWatcher: _eventWatcher2.default,
        Factory: _factory2.default,
        RECUSIVE_AUTO_INJECT: true,
        injectViewModels: _inject.injectViewModels,
        Observable: _observable2.default,
        observable: _observable.observable,
        Statistics: _statistics2.default,
        Store: _store2.default,
        utils: _utils2.default,
        ViewModel: _viewModel2.default,
        viewModel: _viewModel.viewModel
      }; /*
           knockback.js 2.0.0-alpha.1
           Copyright (c)  2011-2016 Kevin Malakoff.
           License: MIT (http://www.opensource.org/licenses/mit-license.php)
           Source: https://github.com/kmalakoff/knockback
           Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
           Optional dependencies: Backbone.ModelRef.js and BackboneORM.
         */

      _kb2.default.assign(_kb2.default, api);

      module.exports = _kb2.default;

      /***/
    },
    /* 20 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
          }
        }return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
        };
      }(); /*
             knockback.js 2.0.0-alpha.1
             Copyright (c)  2011-2016 Kevin Malakoff.
             License: MIT (http://www.opensource.org/licenses/mit-license.php)
             Source: https://github.com/kmalakoff/knockback
             Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
             Optional dependencies: Backbone.ModelRef.js and BackboneORM.
           */

      var _underscore = __webpack_require__(0);

      var _underscore2 = _interopRequireDefault(_underscore);

      var _knockout = __webpack_require__(2);

      var _knockout2 = _interopRequireDefault(_knockout);

      var _kb = __webpack_require__(1);

      var _kb2 = _interopRequireDefault(_kb);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      // @nodoc
      var TypedValue = function () {
        function TypedValue(create_options) {
          _classCallCheck(this, TypedValue);

          this.create_options = create_options;
          this._vo = _knockout2.default.observable(null); // create a value observable for the first dependency
        }

        _createClass(TypedValue, [{
          key: 'destroy',
          value: function destroy() {
            this.__kb_released = true;
            var previous_value = this.__kb_value;
            if (previous_value) {
              this.__kb_value = null;
              if (this.create_options.store && _kb2.default.utils.wrappedCreator(previous_value)) {
                this.create_options.store.release(previous_value);
              } else _kb2.default.release(previous_value);
            }
            this.create_options = null;
          }
        }, {
          key: 'value',
          value: function value() {
            return _knockout2.default.utils.unwrapObservable(this._vo());
          }
        }, {
          key: 'rawValue',
          value: function rawValue() {
            return this.__kb_value;
          }
        }, {
          key: 'valueType',
          value: function valueType(model, key) {
            var new_value = _kb2.default.getValue(model, key);
            this.value_type || this._updateValueObservable(new_value); // create so we can check the type
            return this.value_type;
          }
        }, {
          key: 'update',
          value: function update(new_value) {
            if (this.__kb_released) return undefined; // destroyed, nothing to do

            // determine the new type
            new_value !== undefined || (new_value = null); // ensure null instead of undefined
            var new_type = _kb2.default.utils.valueType(new_value);

            if (this.__kb_value && this.__kb_value.__kb_released) {
              this.__kb_value = undefined;this.value_type = undefined;
            }
            var value = this.__kb_value;

            switch (this.value_type) {
              case _kb2.default.TYPE_COLLECTION:
                if (this.value_type === _kb2.default.TYPE_COLLECTION && new_type === _kb2.default.TYPE_ARRAY) return value(new_value);
                if (new_type === _kb2.default.TYPE_COLLECTION || _underscore2.default.isNull(new_value)) {
                  // use the provided CollectionObservable
                  if (new_value && new_value instanceof _kb2.default.CollectionObservable) this._updateValueObservable(_kb2.default.utils.wrappedObject(new_value), new_value);else if (_kb2.default.peek(value.collection) !== new_value) value.collection(new_value); // collection observables are allocated once
                  return undefined;
                }
                break;

              case _kb2.default.TYPE_MODEL:
                if (new_type === _kb2.default.TYPE_MODEL || _underscore2.default.isNull(new_value)) {
                  // use the provided ViewModel
                  if (new_value && !_kb2.default.isModel(new_value)) this._updateValueObservable(_kb2.default.utils.wrappedObject(new_value), new_value);else if (_kb2.default.utils.wrappedObject(value) !== _kb2.default.utils.resolveModel(new_value)) this._updateValueObservable(new_value);
                  return undefined;
                }
                break;
              default:
                break;
            }

            if (this.value_type === new_type && !_underscore2.default.isUndefined(this.value_type)) {
              if (_kb2.default.peek(value) !== new_value) return value(new_value);
            } else if (_kb2.default.peek(value) !== new_value) return this._updateValueObservable(new_value);
            return undefined;
          }
        }, {
          key: '_updateValueObservable',
          value: function _updateValueObservable(new_value, new_observable) {
            var create_options = this.create_options;

            var creator = _kb2.default.utils.inferCreator(new_value, create_options.factory, create_options.path);

            // retain previous type
            if (new_value === null && !creator) {
              if (this.value_type === _kb2.default.TYPE_MODEL) creator = _kb2.default.ViewModel;else if (this.value_type === _kb2.default.TYPE_COLLECTION) creator = _kb2.default.CollectionObservable;
            }
            create_options.creator = creator;

            var value_type = _kb2.default.TYPE_UNKNOWN;
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
                  value = new_value;value_type = _kb2.default.TYPE_SIMPLE;
                } else if (creator.create) value = creator.create(new_value, create_options);else value = new creator(new_value, create_options);

              // create and cache the type
            } else if (_underscore2.default.isArray(new_value)) {
              value_type = _kb2.default.TYPE_ARRAY;value = _knockout2.default.observableArray(new_value);
            } else {
              value_type = _kb2.default.TYPE_SIMPLE;value = _knockout2.default.observable(new_value);
            }

            // determine the type
            this.value_type = value_type;
            if (value_type === _kb2.default.TYPE_UNKNOWN) {
              // a view model, recognize view_models as non-observable
              if (!_knockout2.default.isObservable(value)) {
                this.value_type = _kb2.default.TYPE_MODEL;_kb2.default.utils.wrappedObject(value, _kb2.default.utils.resolveModel(new_value));
              } else if (value.__kb_is_co) {
                this.value_type = _kb2.default.TYPE_COLLECTION;_kb2.default.utils.wrappedObject(value, new_value);
              } else if (!this.value_type) this.value_type = _kb2.default.TYPE_SIMPLE;
            }

            // release previous
            if (previous_value) {
              this.create_options.store ? this.create_options.store.release(previous_value) : _kb2.default.release(previous_value);
            }

            // store the value
            this.__kb_value = value;
            return this._vo(value);
          }
        }]);

        return TypedValue;
      }();

      exports.default = TypedValue;

      /***/
    }])
  );
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)(module)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultObservable = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       knockback.js 2.0.0-alpha.1
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Copyright (c)  2011-2016 Kevin Malakoff.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       License: MIT (http://www.opensource.org/licenses/mit-license.php)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Source: https://github.com/kmalakoff/knockback
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Optional dependencies: Backbone.ModelRef.js and BackboneORM.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _underscore = __webpack_require__(0);

var _underscore2 = _interopRequireDefault(_underscore);

var _knockout = __webpack_require__(1);

var _knockout2 = _interopRequireDefault(_knockout);

var _core = __webpack_require__(2);

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    var observable = _core2.default.utils.wrappedObservable(this, _knockout2.default.computed({
      read: function read() {
        var current_target = _knockout2.default.utils.unwrapObservable(target_observable());
        return _underscore2.default.isNull(current_target) || _underscore2.default.isUndefined(current_target) ? _knockout2.default.utils.unwrapObservable(_this.dv) : current_target;
      },
      write: function write(value) {
        return target_observable(value);
      }
    }));

    // publish public interface on the observable and return instead of this
    _core2.default.publishMethods(observable, this, KEYS_PUBLISH);

    return observable;
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(DefaultObservable, [{
    key: 'destroy',
    value: function destroy() {
      return _core2.default.utils.wrappedDestroy(this);
    }

    // Forces the observable to take the default value.
    // @note Can be used with kb.utils.setToDefault, kb.Observable.setToDefault, kb.ViewModel.setToDefault

  }, {
    key: 'setToDefault',
    value: function setToDefault() {
      return _core2.default.utils.wrappedObservable(this)(this.dv);
    }
  }]);

  return DefaultObservable;
}();

exports.default = DefaultObservable;
var defaultObservable = exports.defaultObservable = function defaultObservable() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(DefaultObservable, [null].concat(args)))();
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _underscore = __webpack_require__(0);

var _underscore2 = _interopRequireDefault(_underscore);

var _knockout = __webpack_require__(1);

var _knockout2 = _interopRequireDefault(_knockout);

var _core = __webpack_require__(2);

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.Observable.prototype.setToDefault = function () {
  if (this.__kb_value && this.__kb_value.setToDefault) this.__kb_value.setToDefault();
}; /*
     knockback.js 2.0.0-alpha.1
     Copyright (c)  2011-2016 Kevin Malakoff.
     License: MIT (http://www.opensource.org/licenses/mit-license.php)
     Source: https://github.com/kmalakoff/knockback
     Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
     Optional dependencies: Backbone.ModelRef.js and BackboneORM.
   */

_core2.default.ViewModel.prototype.setToDefault = function () {
  _underscore2.default.each(this.__kb.vm_keys, function (value) {
    if (value.__kb_value && value.__kb_value.setToDefault) value.__kb_value.setToDefault();
  });
};

// @example
//   var model = new Backbone.Model({name: 'Bob'});
//   var view_model = {
//     wrapped_name: kb.defaultWrapper(kb.observable(model, 'name'), '(no name)')
//   }; // view_model.wrapped name: Bob
//   kb.utils.setToDefault(view_model); // view_model.wrapped name: (no name)
_core2.default.utils.setToDefault = function (obj) {
  var _this = this;

  if (!obj) return undefined;

  // observable
  if (_knockout2.default.isObservable(obj)) {
    if (typeof obj.setToDefault === 'function') obj.setToDefault();

    // view model
  } else if (_underscore2.default.isObject(obj)) {
    _underscore2.default.each(obj, function (value, key) {
      if (value && (_knockout2.default.isObservable(value) || typeof value !== 'function') && (key[0] !== '_' || key.search('__kb'))) _this.setToDefault(value);
    });
  }

  return obj;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _core = __webpack_require__(2);

var _core2 = _interopRequireDefault(_core);

__webpack_require__(5);

var _defaultObservable = __webpack_require__(4);

var _defaultObservable2 = _interopRequireDefault(_defaultObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = {
  DefaultObservable: _defaultObservable2.default,
  defaultObservable: _defaultObservable.defaultObservable
}; /*
     knockback.js 2.0.0-alpha.1
     Copyright (c)  2011-2016 Kevin Malakoff.
     License: MIT (http://www.opensource.org/licenses/mit-license.php)
     Source: https://github.com/kmalakoff/knockback
     Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
     Optional dependencies: Backbone.ModelRef.js and BackboneORM.
   */

_core2.default.assign(_core2.default, api);

module.exports = _core2.default;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ })
/******/ ]);
});