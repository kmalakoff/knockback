(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@knockback/core"), require("knockout"), require("underscore"));
	else if(typeof define === 'function' && define.amd)
		define(["@knockback/core", "knockout", "underscore"], factory);
	else if(typeof exports === 'object')
		exports["kbd"] = factory(require("@knockback/core"), require("knockout"), require("underscore"));
	else
		root["kbd"] = factory(root["kb"], root["ko"], root["_"]);
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./packages/knockback-defaults/src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(originalModule) {\n\tif (!originalModule.webpackPolyfill) {\n\t\tvar module = Object.create(originalModule);\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, \"loaded\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"id\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"exports\", {\n\t\t\tenumerable: true\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack://kbd/(webpack)/buildin/harmony-module.js?");

/***/ }),

/***/ "./packages/knockback-defaults/src/default-observable.js":
/*!***************************************************************!*\
  !*** ./packages/knockback-defaults/src/default-observable.js ***!
  \***************************************************************/
/*! exports provided: default, defaultObservable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return DefaultObservable; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"defaultObservable\", function() { return defaultObservable; });\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ \"underscore\");\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! knockout */ \"knockout\");\n/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @knockback/core */ \"@knockback/core\");\n/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_knockback_core__WEBPACK_IMPORTED_MODULE_2__);\nfunction isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/*\n  knockback.js 2.0.0-alpha.1\n  Copyright (c)  2011-2016 Kevin Malakoff.\n  License: MIT (http://www.opensource.org/licenses/mit-license.php)\n  Source: https://github.com/kmalakoff/knockback\n  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).\n  Optional dependencies: Backbone.ModelRef.js and BackboneORM.\n*/\n\n\n\nvar KEYS_PUBLISH = ['destroy', 'setToDefault']; // Used to provide a default value when an observable is null, undefined, or the empty string.\n//\n// @example Provide a observable with observable and/or non observable default argument in the form of:\n//   var wrapped_name = kb.defaultObservable(kb.observable(model, 'name'), '(no name)');\n\nvar DefaultObservable =\n/*#__PURE__*/\nfunction () {\n  // Used to create a new kb.DefaultObservable.\n  //\n  // @param [ko.observable] target_observable the observable to check for null, undefined, or the empty string\n  // @param [Any] default_value the default value. Can be a value, string or ko.observable\n  // @return [ko.observable] the constructor does not return 'this' but a ko.observable\n  // @note the constructor does not return 'this' but a ko.observable\n  function DefaultObservable(target_observable, dv) {\n    var _this = this;\n\n    _classCallCheck(this, DefaultObservable);\n\n    // @dv is default value\n    this.dv = dv;\n    var observable = _knockback_core__WEBPACK_IMPORTED_MODULE_2___default.a.utils.wrappedObservable(this, knockout__WEBPACK_IMPORTED_MODULE_1___default.a.computed({\n      read: function read() {\n        var current_target = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(target_observable());\n        return underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isNull(current_target) || underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isUndefined(current_target) ? knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(_this.dv) : current_target;\n      },\n      write: function write(value) {\n        return target_observable(value);\n      }\n    })); // publish public interface on the observable and return instead of this\n\n    _knockback_core__WEBPACK_IMPORTED_MODULE_2___default.a.publishMethods(observable, this, KEYS_PUBLISH);\n    return observable;\n  } // Required clean up function to break cycles, release view models, etc.\n  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).\n\n\n  _createClass(DefaultObservable, [{\n    key: \"destroy\",\n    value: function destroy() {\n      return _knockback_core__WEBPACK_IMPORTED_MODULE_2___default.a.utils.wrappedDestroy(this);\n    } // Forces the observable to take the default value.\n    // @note Can be used with kb.utils.setToDefault, kb.Observable.setToDefault, kb.ViewModel.setToDefault\n\n  }, {\n    key: \"setToDefault\",\n    value: function setToDefault() {\n      return _knockback_core__WEBPACK_IMPORTED_MODULE_2___default.a.utils.wrappedObservable(this)(this.dv);\n    }\n  }]);\n\n  return DefaultObservable;\n}();\n\n\nvar defaultObservable = function defaultObservable() {\n  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n    args[_key] = arguments[_key];\n  }\n\n  return _construct(DefaultObservable, args);\n};\n\n//# sourceURL=webpack://kbd/./packages/knockback-defaults/src/default-observable.js?");

/***/ }),

/***/ "./packages/knockback-defaults/src/extensions.js":
/*!*******************************************************!*\
  !*** ./packages/knockback-defaults/src/extensions.js ***!
  \*******************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ \"underscore\");\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! knockout */ \"knockout\");\n/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @knockback/core */ \"@knockback/core\");\n/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_knockback_core__WEBPACK_IMPORTED_MODULE_2__);\n/*\n  knockback.js 2.0.0-alpha.1\n  Copyright (c)  2011-2016 Kevin Malakoff.\n  License: MIT (http://www.opensource.org/licenses/mit-license.php)\n  Source: https://github.com/kmalakoff/knockback\n  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).\n  Optional dependencies: Backbone.ModelRef.js and BackboneORM.\n*/\n\n\n\n\n_knockback_core__WEBPACK_IMPORTED_MODULE_2___default.a.Observable.prototype.setToDefault = function () {\n  if (this.__kb_value && this.__kb_value.setToDefault) this.__kb_value.setToDefault();\n};\n\n_knockback_core__WEBPACK_IMPORTED_MODULE_2___default.a.ViewModel.prototype.setToDefault = function () {\n  underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(this.__kb.vm_keys, function (value) {\n    if (value.__kb_value && value.__kb_value.setToDefault) value.__kb_value.setToDefault();\n  });\n}; // @example\n//   var model = new Backbone.Model({name: 'Bob'});\n//   var view_model = {\n//     wrapped_name: kb.defaultWrapper(kb.observable(model, 'name'), '(no name)')\n//   }; // view_model.wrapped name: Bob\n//   kb.utils.setToDefault(view_model); // view_model.wrapped name: (no name)\n\n\n_knockback_core__WEBPACK_IMPORTED_MODULE_2___default.a.utils.setToDefault = function (obj) {\n  var _this = this;\n\n  if (!obj) return undefined; // observable\n\n  if (knockout__WEBPACK_IMPORTED_MODULE_1___default.a.isObservable(obj)) {\n    if (typeof obj.setToDefault === 'function') obj.setToDefault(); // view model\n  } else if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isObject(obj)) {\n    underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(obj, function (value, key) {\n      if (value && (knockout__WEBPACK_IMPORTED_MODULE_1___default.a.isObservable(value) || typeof value !== 'function') && (key[0] !== '_' || key.search('__kb'))) _this.setToDefault(value);\n    });\n  }\n\n  return obj;\n};\n\n//# sourceURL=webpack://kbd/./packages/knockback-defaults/src/extensions.js?");

/***/ }),

/***/ "./packages/knockback-defaults/src/index.js":
/*!**************************************************!*\
  !*** ./packages/knockback-defaults/src/index.js ***!
  \**************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @knockback/core */ \"@knockback/core\");\n/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_knockback_core__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _extensions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extensions */ \"./packages/knockback-defaults/src/extensions.js\");\n/* harmony import */ var _default_observable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./default-observable */ \"./packages/knockback-defaults/src/default-observable.js\");\n/*\n  knockback.js 2.0.0-alpha.1\n  Copyright (c)  2011-2016 Kevin Malakoff.\n  License: MIT (http://www.opensource.org/licenses/mit-license.php)\n  Source: https://github.com/kmalakoff/knockback\n  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).\n  Optional dependencies: Backbone.ModelRef.js and BackboneORM.\n*/\n\n\n\nvar api = {\n  DefaultObservable: _default_observable__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n  defaultObservable: _default_observable__WEBPACK_IMPORTED_MODULE_2__[\"defaultObservable\"]\n};\n_knockback_core__WEBPACK_IMPORTED_MODULE_0___default.a.assign(_knockback_core__WEBPACK_IMPORTED_MODULE_0___default.a, api);\nmodule.exports = _knockback_core__WEBPACK_IMPORTED_MODULE_0___default.a;\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack://kbd/./packages/knockback-defaults/src/index.js?");

/***/ }),

/***/ "@knockback/core":
/*!*****************************************************************************************************************!*\
  !*** external {"root":"kb","amd":"@knockback/core","commonjs":"@knockback/core","commonjs2":"@knockback/core"} ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE__knockback_core__;\n\n//# sourceURL=webpack://kbd/external_%7B%22root%22:%22kb%22,%22amd%22:%22@knockback/core%22,%22commonjs%22:%22@knockback/core%22,%22commonjs2%22:%22@knockback/core%22%7D?");

/***/ }),

/***/ "knockout":
/*!********************************************************************************************!*\
  !*** external {"root":"ko","amd":"knockout","commonjs":"knockout","commonjs2":"knockout"} ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_knockout__;\n\n//# sourceURL=webpack://kbd/external_%7B%22root%22:%22ko%22,%22amd%22:%22knockout%22,%22commonjs%22:%22knockout%22,%22commonjs2%22:%22knockout%22%7D?");

/***/ }),

/***/ "underscore":
/*!*************************************************************************************************!*\
  !*** external {"root":"_","amd":"underscore","commonjs":"underscore","commonjs2":"underscore"} ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_underscore__;\n\n//# sourceURL=webpack://kbd/external_%7B%22root%22:%22_%22,%22amd%22:%22underscore%22,%22commonjs%22:%22underscore%22,%22commonjs2%22:%22underscore%22%7D?");

/***/ })

/******/ });
});