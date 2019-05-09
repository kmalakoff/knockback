(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@knockback/core"), require("knockout"), require("underscore"));
	else if(typeof define === 'function' && define.amd)
		define(["@knockback/core", "knockout", "underscore"], factory);
	else if(typeof exports === 'object')
		exports["kbt"] = factory(require("@knockback/core"), require("knockout"), require("underscore"));
	else
		root["kbt"] = factory(root["kb"], root["ko"], root["_"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__knockback_core__, __WEBPACK_EXTERNAL_MODULE_knockout__, __WEBPACK_EXTERNAL_MODULE_underscore__) {
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./packages/knockback-triggering/src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(originalModule) {\n\tif (!originalModule.webpackPolyfill) {\n\t\tvar module = Object.create(originalModule);\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, \"loaded\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"id\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"exports\", {\n\t\t\tenumerable: true\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack://kbt/(webpack)/buildin/harmony-module.js?");

/***/ }),

/***/ "./packages/knockback-triggering/src/index.js":
/*!****************************************************!*\
  !*** ./packages/knockback-triggering/src/index.js ***!
  \****************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @knockback/core */ \"@knockback/core\");\n/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_knockback_core__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _triggered_observable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./triggered-observable */ \"./packages/knockback-triggering/src/triggered-observable.js\");\n/*\n  knockback.js 2.0.0-alpha.1\n  Copyright (c)  2011-2016 Kevin Malakoff.\n  License: MIT (http://www.opensource.org/licenses/mit-license.php)\n  Source: https://github.com/kmalakoff/knockback\n  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).\n  Optional dependencies: Backbone.ModelRef.js and BackboneORM.\n*/\n\n\nvar api = {\n  TriggeredObservable: _triggered_observable__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  triggeredObservable: _triggered_observable__WEBPACK_IMPORTED_MODULE_1__[\"triggeredObservable\"],\n  observableTriggered: _triggered_observable__WEBPACK_IMPORTED_MODULE_1__[\"triggeredObservable\"]\n};\n_knockback_core__WEBPACK_IMPORTED_MODULE_0___default.a.assign(_knockback_core__WEBPACK_IMPORTED_MODULE_0___default.a, api);\nmodule.exports = api;\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack://kbt/./packages/knockback-triggering/src/index.js?");

/***/ }),

/***/ "./packages/knockback-triggering/src/triggered-observable.js":
/*!*******************************************************************!*\
  !*** ./packages/knockback-triggering/src/triggered-observable.js ***!
  \*******************************************************************/
/*! exports provided: default, triggeredObservable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return TriggeredObservable; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"triggeredObservable\", function() { return triggeredObservable; });\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ \"underscore\");\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! knockout */ \"knockout\");\n/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @knockback/core */ \"@knockback/core\");\n/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_knockback_core__WEBPACK_IMPORTED_MODULE_2__);\nfunction isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/*\n  knockback.js 2.0.0-alpha.1\n  Copyright (c)  2011-2016 Kevin Malakoff.\n  License: MIT (http://www.opensource.org/licenses/mit-license.php)\n  Source: https://github.com/kmalakoff/knockback\n  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).\n  Optional dependencies: Backbone.ModelRef.js and BackboneORM.\n*/\n\n\n\nvar KEYS_PUBLISH = ['destroy']; // Class for observing emitter events.\n//\n// @example create an observable whose subscriptions are notified with the change event is triggered.\n//   var triggered_observable = kb.triggeredObservable(name, 'change');\n//\n// @example How to watch a emitter for events.\n//   var trigger_count = 0;\n//   var emitter = new Backbone.Model();\n//   var view_emitter = {\n//     triggered_observable: kb.triggeredObservable(emitter, 'change')\n//   };\n//   view_emitter.counter = ko.computed(function() {\n//     view_emitter.triggered_observable() // add a dependency\n//     return trigger_count++\n//   });\n//   emitter.set(name: 'bob');       # trigger_count: 1\n//   emitter.set(name: 'george');    # trigger_count: 2\n//   emitter.set(last: 'smith');     # trigger_count: 3\n\nvar TriggeredObservable =\n/*#__PURE__*/\nfunction () {\n  // Used to create a new kb.Observable.\n  //\n  // @param [Model] emitter the emitter to observe (can be null)\n  // @param [String] event_selector the event name to trigger Knockout subscriptions on.\n  // @return [ko.observable] the constructor does not return 'this' but a ko.observable\n  // @note the constructor does not return 'this' but a ko.observable\n  function TriggeredObservable(emitter, event_selector) {\n    var _this = this;\n\n    _classCallCheck(this, TriggeredObservable);\n\n    this.event_selector = event_selector;\n    emitter || _knockback_core__WEBPACK_IMPORTED_MODULE_2___default.a._throwMissing(this, 'emitter');\n    this.event_selector || _knockback_core__WEBPACK_IMPORTED_MODULE_2___default.a._throwMissing(this, 'event_selector'); // internal state\n\n    this.vo = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.observable();\n    var observable = _knockback_core__WEBPACK_IMPORTED_MODULE_2___default.a.utils.wrappedObservable(this, knockout__WEBPACK_IMPORTED_MODULE_1___default.a.computed(function () {\n      return _this.vo();\n    })); // publish public interface on the observable and return instead of this\n\n    _knockback_core__WEBPACK_IMPORTED_MODULE_2___default.a.publishMethods(observable, this, KEYS_PUBLISH); // create emitter observable\n\n    _knockback_core__WEBPACK_IMPORTED_MODULE_2___default.a.utils.wrappedEventWatcher(this, new _knockback_core__WEBPACK_IMPORTED_MODULE_2___default.a.EventWatcher(emitter, this, {\n      emitter: underscore__WEBPACK_IMPORTED_MODULE_0___default.a.bind(this.emitter, this),\n      update: underscore__WEBPACK_IMPORTED_MODULE_0___default.a.bind(this.update, this),\n      event_selector: this.event_selector\n    }));\n    return observable;\n  } // Required clean up function to break cycles, release view models, etc.\n  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).\n\n\n  _createClass(TriggeredObservable, [{\n    key: \"destroy\",\n    value: function destroy() {\n      return _knockback_core__WEBPACK_IMPORTED_MODULE_2___default.a.utils.wrappedDestroy(this);\n    } // Dual-purpose getter/setter for the observed emitter.\n    //\n    // @overload emitter()\n    //   Gets the emitter or emitter reference\n    //   @return [Model|ModelRef|Collection] the emitter whose events are being bound (can be null)\n    // @overload emitter(new_emitter)\n    //   Sets the emitter or emitter reference\n    //   @param [Model|ModelRef|Collection] new_emitter the emitter whose events will be bound (can be null)\n\n  }, {\n    key: \"emitter\",\n    value: function emitter(new_emitter) {\n      // get or no change\n      if (arguments.length === 0 || this.ee === new_emitter) return this.ee;\n      this.ee = new_emitter;\n      if (this.ee) return this.update();\n      return undefined;\n    } // ###################################################\n    // Internal\n    // ###################################################\n    // @nodoc\n\n  }, {\n    key: \"update\",\n    value: function update() {\n      if (!this.ee) return undefined; // do not trigger if there is no emitter\n\n      if (this.vo() !== this.ee) return this.vo(this.ee);\n      return this.vo.valueHasMutated(); // manually trigger the dependable\n    }\n  }]);\n\n  return TriggeredObservable;\n}(); // factory function\n\n\n\nvar triggeredObservable = function triggeredObservable() {\n  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n    args[_key] = arguments[_key];\n  }\n\n  return _construct(TriggeredObservable, args);\n};\n\n//# sourceURL=webpack://kbt/./packages/knockback-triggering/src/triggered-observable.js?");

/***/ }),

/***/ "@knockback/core":
/*!*****************************************************************************************************************!*\
  !*** external {"root":"kb","amd":"@knockback/core","commonjs":"@knockback/core","commonjs2":"@knockback/core"} ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE__knockback_core__;\n\n//# sourceURL=webpack://kbt/external_%7B%22root%22:%22kb%22,%22amd%22:%22@knockback/core%22,%22commonjs%22:%22@knockback/core%22,%22commonjs2%22:%22@knockback/core%22%7D?");

/***/ }),

/***/ "knockout":
/*!********************************************************************************************!*\
  !*** external {"root":"ko","amd":"knockout","commonjs":"knockout","commonjs2":"knockout"} ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_knockout__;\n\n//# sourceURL=webpack://kbt/external_%7B%22root%22:%22ko%22,%22amd%22:%22knockout%22,%22commonjs%22:%22knockout%22,%22commonjs2%22:%22knockout%22%7D?");

/***/ }),

/***/ "underscore":
/*!*************************************************************************************************!*\
  !*** external {"root":"_","amd":"underscore","commonjs":"underscore","commonjs2":"underscore"} ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_underscore__;\n\n//# sourceURL=webpack://kbt/external_%7B%22root%22:%22_%22,%22amd%22:%22underscore%22,%22commonjs%22:%22underscore%22,%22commonjs2%22:%22underscore%22%7D?");

/***/ })

/******/ });
});