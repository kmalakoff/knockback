(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@knockback/core"), require("underscore"), require("knockout"));
	else if(typeof define === 'function' && define.amd)
		define(["@knockback/core", "underscore", "knockout"], factory);
	else if(typeof exports === 'object')
		exports["kbt"] = factory(require("@knockback/core"), require("underscore"), require("knockout"));
	else
		root["kbt"] = factory(root["kb"], root["_"], root["ko"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
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


var _core = __webpack_require__(0);

var _core2 = _interopRequireDefault(_core);

var _triggeredObservable = __webpack_require__(2);

var _triggeredObservable2 = _interopRequireDefault(_triggeredObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var api = {
  TriggeredObservable: _triggeredObservable2.default,
  triggeredObservable: _triggeredObservable.triggeredObservable,
  observableTriggered: _triggeredObservable.triggeredObservable
};
_core2.default.assign(_core2.default, api);

module.exports = api;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.triggeredObservable = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       knockback.js 2.0.0-alpha.1
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Copyright (c)  2011-2016 Kevin Malakoff.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       License: MIT (http://www.opensource.org/licenses/mit-license.php)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Source: https://github.com/kmalakoff/knockback
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Optional dependencies: Backbone.ModelRef.js and BackboneORM.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _underscore = __webpack_require__(3);

var _underscore2 = _interopRequireDefault(_underscore);

var _knockout = __webpack_require__(4);

var _knockout2 = _interopRequireDefault(_knockout);

var _core = __webpack_require__(0);

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    emitter || _core2.default._throwMissing(this, 'emitter');
    this.event_selector || _core2.default._throwMissing(this, 'event_selector');

    // internal state
    this.vo = _knockout2.default.observable();
    var observable = _core2.default.utils.wrappedObservable(this, _knockout2.default.computed(function () {
      return _this.vo();
    }));

    // publish public interface on the observable and return instead of this
    _core2.default.publishMethods(observable, this, KEYS_PUBLISH);

    // create emitter observable
    _core2.default.utils.wrappedEventWatcher(this, new _core2.default.EventWatcher(emitter, this, { emitter: _underscore2.default.bind(this.emitter, this), update: _underscore2.default.bind(this.update, this), event_selector: this.event_selector }));

    return observable;
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(TriggeredObservable, [{
    key: 'destroy',
    value: function destroy() {
      return _core2.default.utils.wrappedDestroy(this);
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

// factory function


exports.default = TriggeredObservable;
var triggeredObservable = exports.triggeredObservable = function triggeredObservable() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(TriggeredObservable, [null].concat(args)))();
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ })
/******/ ]);
});