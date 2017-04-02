(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@knockback/core"), require("underscore"), require("knockout"));
	else if(typeof define === 'function' && define.amd)
		define(["@knockback/core", "underscore", "knockout"], factory);
	else if(typeof exports === 'object')
		exports["kbd"] = factory(require("@knockback/core"), require("underscore"), require("knockout"));
	else
		root["kbd"] = factory(root["kb"], root["_"], root["ko"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
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

var _underscore = __webpack_require__(1);

var _underscore2 = _interopRequireDefault(_underscore);

var _knockout = __webpack_require__(2);

var _knockout2 = _interopRequireDefault(_knockout);

var _core = __webpack_require__(0);

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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _underscore = __webpack_require__(1);

var _underscore2 = _interopRequireDefault(_underscore);

var _knockout = __webpack_require__(2);

var _knockout2 = _interopRequireDefault(_knockout);

var _core = __webpack_require__(0);

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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _core = __webpack_require__(0);

var _core2 = _interopRequireDefault(_core);

__webpack_require__(4);

var _defaultObservable = __webpack_require__(3);

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

/***/ })
/******/ ]);
});