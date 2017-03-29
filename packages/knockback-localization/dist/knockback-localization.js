(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("knockback"), require("backbone"), require("underscore"), require("knockout"));
	else if(typeof define === 'function' && define.amd)
		define(["knockback", "backbone", "underscore", "knockout"], factory);
	else if(typeof exports === 'object')
		exports["kb"] = factory(require("knockback"), require("backbone"), require("underscore"), require("knockout"));
	else
		root["kb"] = factory(root["kb"], root["Backbone"], root["_"], root["ko"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localizedObservable = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       knockback.js 1.2.2
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Copyright (c)  2011-2016 Kevin Malakoff.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       License: MIT (http://www.opensource.org/licenses/mit-license.php)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Source: https://github.com/kmalakoff/knockback
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Optional dependencies: Backbone.ModelRef.js and BackboneORM.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _underscore = __webpack_require__(4);

var _underscore2 = _interopRequireDefault(_underscore);

var _backbone = __webpack_require__(3);

var _backbone2 = _interopRequireDefault(_backbone);

var _knockout = __webpack_require__(5);

var _knockout2 = _interopRequireDefault(_knockout);

var _knockback = __webpack_require__(0);

var _knockback2 = _interopRequireDefault(_knockback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KEYS_PUBLISH = ['destroy', 'observedValue', 'resetToCurrent'];

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
  // for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")

  // Used to create a new kb.LocalizedObservable. This an abstract class.
  //
  // @param [Data|ko.observable] value the value to localize
  // @param [Object] options the create options
  // @option options [Data|ko.observable] default a default value to present when the value is null, an empty string, etc.
  // @option options [Function] onChange a notification that gets called when the locale changes. Signature: function(localized_string, value, observable)
  // @return [ko.observable] the constructor does not return 'this' but a ko.observable
  // @note the constructor does not return 'this' but a ko.observable
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
    this.read || _knockback2.default._throwMissing(this, 'read');
    _knockback2.default.locale_manager || _knockback2.default._throwMissing(this, 'kb.locale_manager');

    // bind callbacks
    if (!this.__kb) {
      this.__kb = {};
    }
    this.__kb._onLocaleChange = _underscore2.default.bind(this._onLocaleChange, this);
    this.__kb._onChange = options.onChange;

    // internal state
    var currentValue = this.value ? _knockout2.default.utils.unwrapObservable(this.value) : null;
    this.vo = _knockout2.default.observable(!currentValue ? null : this.read(currentValue, null));

    var observable = _knockback2.default.utils.wrappedObservable(this, _knockout2.default.computed({
      read: function read() {
        if (_this.value) _knockout2.default.utils.unwrapObservable(_this.value);
        _this.vo(); // create a depdenency
        return _this.read(_knockout2.default.utils.unwrapObservable(_this.value));
      },

      write: function write(x) {
        _this.write || _knockback2.default._throwUnexpected(_this, 'writing to read-only');
        _this.write(x, _knockout2.default.utils.unwrapObservable(_this.value));
        _this.vo(x);
        !_this.__kb._onChange || _this.__kb._onChange(x);
      },

      owner: this.vm
    }));

    // publish public interface on the observable and return instead of this
    _knockback2.default.publishMethods(observable, this, KEYS_PUBLISH);

    // start
    _knockback2.default.locale_manager.bind('change', this.__kb._onLocaleChange);

    // wrap ourselves with a default value
    if (Object.prototype.hasOwnProperty.call(options, 'default')) {
      observable = _knockback2.default.DefaultObservable && _knockout2.default.defaultObservable(observable, options.default);
    }

    return observable;
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(LocalizedObservable, [{
    key: 'destroy',
    value: function destroy() {
      _knockback2.default.locale_manager.unbind('change', this.__kb._onLocaleChange);
      this.vm = null;
      return _knockback2.default.utils.wrappedDestroy(this);
    }

    // Used to reset the value if localization is not possible.

  }, {
    key: 'resetToCurrent',
    value: function resetToCurrent() {
      var observable = _knockback2.default.utils.wrappedObservable(this);
      var current_value = this.value ? this.read(_knockout2.default.utils.unwrapObservable(this.value)) : null;
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
      var value = this.read(_knockout2.default.utils.unwrapObservable(this.value));
      this.vo(value);
      if (this.__kb._onChange) return this.__kb._onChange(value);
      return undefined;
    }
  }]);

  return LocalizedObservable;
}();

// factory function


LocalizedObservable.extend = _backbone2.default.Model.extend;
exports.default = LocalizedObservable;
var localizedObservable = exports.localizedObservable = function localizedObservable() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(LocalizedObservable, [null].concat(args)))();
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _knockback = __webpack_require__(0);

var _knockback2 = _interopRequireDefault(_knockback);

var _localizedObservable = __webpack_require__(1);

var _localizedObservable2 = _interopRequireDefault(_localizedObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Locale Manager - if you are using localization, set this property.
// It must have Backbone.Events mixed in and implement a get method like Backbone.Model, eg. get: (attribute_name) -> return somthing
/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var api = {
  locale_manager: undefined,
  LocalizedObservable: _localizedObservable2.default,
  localizedObservable: _localizedObservable.localizedObservable
};
_knockback2.default.assign(_knockback2.default, api);

module.exports = _knockback2.default;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ })
/******/ ]);
});