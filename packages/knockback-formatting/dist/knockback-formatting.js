(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@knockback/core"), require("knockout"), require("underscore"));
	else if(typeof define === 'function' && define.amd)
		define(["@knockback/core", "knockout", "underscore"], factory);
	else if(typeof exports === 'object')
		exports["kbf"] = factory(require("@knockback/core"), require("knockout"), require("underscore"));
	else
		root["kbf"] = factory(root["kb"], root["ko"], root["_"]);
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./packages/knockback-formatting/src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(originalModule) {\n\tif (!originalModule.webpackPolyfill) {\n\t\tvar module = Object.create(originalModule);\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, \"loaded\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"id\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"exports\", {\n\t\t\tenumerable: true\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack://kbf/(webpack)/buildin/harmony-module.js?");

/***/ }),

/***/ "./packages/knockback-formatting/src/formatted-observable.js":
/*!*******************************************************************!*\
  !*** ./packages/knockback-formatting/src/formatted-observable.js ***!
  \*******************************************************************/
/*! exports provided: toFormattedString, parseFormattedString, default, formattedObservable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"toFormattedString\", function() { return toFormattedString; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"parseFormattedString\", function() { return parseFormattedString; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return FormattedObservable; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"formattedObservable\", function() { return formattedObservable; });\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ \"underscore\");\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! knockout */ \"knockout\");\n/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @knockback/core */ \"@knockback/core\");\n/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_knockback_core__WEBPACK_IMPORTED_MODULE_2__);\nfunction isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/*\n  knockback.js 2.0.0-alpha.1\n  Copyright (c)  2011-2016 Kevin Malakoff.\n  License: MIT (http://www.opensource.org/licenses/mit-license.php)\n  Source: https://github.com/kmalakoff/knockback\n  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).\n  Optional dependencies: Backbone.ModelRef.js and BackboneORM.\n*/\n\n\n\nvar toFormattedString = function toFormattedString(format) {\n  var result = format.slice();\n\n  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {\n    args[_key - 1] = arguments[_key];\n  }\n\n  underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(args, function (arg, index) {\n    var value = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(arg);\n    if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isUndefined(value) || underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isNull(value)) value = '';\n    var parameter_index = format.indexOf(\"{\".concat(index, \"}\"));\n\n    while (~parameter_index) {\n      result = result.replace(\"{\".concat(index, \"}\"), value);\n      parameter_index = format.indexOf(\"{\".concat(index, \"}\"), parameter_index + 1);\n    }\n  });\n\n  return result;\n};\nvar parseFormattedString = function parseFormattedString(string, format) {\n  var regex_string = format.slice();\n  var index = 0;\n  var parameter_count = 0;\n  var positions = {};\n\n  while (regex_string.search(\"\\\\{\".concat(index, \"\\\\}\")) >= 0) {\n    // store the positions of the replacements\n    var parameter_index = format.indexOf(\"{\".concat(index, \"}\"));\n\n    while (~parameter_index) {\n      regex_string = regex_string.replace(\"{\".concat(index, \"}\"), '(.*)');\n      positions[parameter_index] = index;\n      parameter_count++;\n      parameter_index = format.indexOf(\"{\".concat(index, \"}\"), parameter_index + 1);\n    }\n\n    index++;\n  }\n\n  var count = index;\n  var regex = new RegExp(regex_string);\n  var matches = regex.exec(string);\n\n  if (matches) {\n    matches.shift();\n  } // return fake empty data\n\n\n  if (!matches || matches.length !== parameter_count) {\n    var result = [];\n\n    while (count-- > 0) {\n      result.push('');\n    }\n\n    return result;\n  } // sort the matches since the parameters could be requested unordered\n\n\n  var sorted_positions = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.sortBy(underscore__WEBPACK_IMPORTED_MODULE_0___default.a.keys(positions), function (parameter_index) {\n    return +parameter_index;\n  });\n\n  var format_indices_to_matched_indices = {};\n\n  underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(sorted_positions, function (parameter_index, match_index) {\n    parameter_index = sorted_positions[match_index];\n    index = positions[parameter_index];\n\n    if (!(index in format_indices_to_matched_indices)) {\n      format_indices_to_matched_indices[index] = match_index;\n    }\n  });\n\n  var results = [];\n  index = 0;\n\n  while (index < count) {\n    results.push(matches[format_indices_to_matched_indices[index]]);\n    index++;\n  }\n\n  return results;\n}; // Handles two-way formatted string convertions and will reformat a string when any argument changes. The format string can also be an observable.\n//\n// @example change the formatted name whenever a model's name attribute changes\n//   var observable = kb.formattedObservable(\"{0} and {1}\", arg1, arg2);\n\nvar FormattedObservable =\n/*#__PURE__*/\nfunction () {\n  // Used to create a new kb.FormattedObservable.\n  //\n  // @param [String|ko.observable] format the format string.\n  // Format: `\"{0} and {1}\"` where `{0}` and `{1}` would be synchronized with the arguments (eg. \"Bob and Carol\" where `{0}` is Bob and `{1}` is Carol)\n  // @param [Array] args arguments to be passed to the kb.LocaleManager's get() method\n  // @return [ko.observable] the constructor does not return 'this' but a ko.observable\n  // @note the constructor does not return 'this' but a ko.observable\n  function FormattedObservable(format) {\n    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {\n      args[_key2 - 1] = arguments[_key2];\n    }\n\n    _classCallCheck(this, FormattedObservable);\n\n    // being called by the factory function\n    var observable_args = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(args[0]) ? args[0] : args;\n    var observable = _knockback_core__WEBPACK_IMPORTED_MODULE_2___default.a.utils.wrappedObservable(this, knockout__WEBPACK_IMPORTED_MODULE_1___default.a.computed({\n      read: function read() {\n        args = [knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(format)];\n\n        underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(observable_args, function (arg) {\n          return args.push(knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(arg));\n        });\n\n        return toFormattedString.apply(null, args);\n      },\n      write: function write(value) {\n        var matches = parseFormattedString(value, knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(format));\n        var max_count = Math.min(observable_args.length, matches.length);\n        var index = 0;\n\n        while (index < max_count) {\n          observable_args[index](matches[index]);\n          index++;\n        }\n      }\n    }));\n    return observable;\n  } // Required clean up function to break cycles, release view models, etc.\n  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).\n\n\n  _createClass(FormattedObservable, [{\n    key: \"destroy\",\n    value: function destroy() {\n      return _knockback_core__WEBPACK_IMPORTED_MODULE_2___default.a.utils.wrappedDestroy(this);\n    }\n  }]);\n\n  return FormattedObservable;\n}();\n\n\nvar formattedObservable = function formattedObservable() {\n  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {\n    args[_key3] = arguments[_key3];\n  }\n\n  return _construct(FormattedObservable, args);\n};\n\n//# sourceURL=webpack://kbf/./packages/knockback-formatting/src/formatted-observable.js?");

/***/ }),

/***/ "./packages/knockback-formatting/src/index.js":
/*!****************************************************!*\
  !*** ./packages/knockback-formatting/src/index.js ***!
  \****************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @knockback/core */ \"@knockback/core\");\n/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_knockback_core__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _formatted_observable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./formatted-observable */ \"./packages/knockback-formatting/src/formatted-observable.js\");\n/*\n  knockback.js 2.0.0-alpha.1\n  Copyright (c)  2011-2016 Kevin Malakoff.\n  License: MIT (http://www.opensource.org/licenses/mit-license.php)\n  Source: https://github.com/kmalakoff/knockback\n  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).\n  Optional dependencies: Backbone.ModelRef.js and BackboneORM.\n*/\n\n\nvar api = {\n  FormattedObservable: _formatted_observable__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  formattedObservable: _formatted_observable__WEBPACK_IMPORTED_MODULE_1__[\"formattedObservable\"],\n  observableFormatted: _formatted_observable__WEBPACK_IMPORTED_MODULE_1__[\"formattedObservable\"]\n};\n_knockback_core__WEBPACK_IMPORTED_MODULE_0___default.a.assign(_knockback_core__WEBPACK_IMPORTED_MODULE_0___default.a, api);\nmodule.exports = api;\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack://kbf/./packages/knockback-formatting/src/index.js?");

/***/ }),

/***/ "@knockback/core":
/*!*****************************************************************************************************************!*\
  !*** external {"root":"kb","amd":"@knockback/core","commonjs":"@knockback/core","commonjs2":"@knockback/core"} ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE__knockback_core__;\n\n//# sourceURL=webpack://kbf/external_%7B%22root%22:%22kb%22,%22amd%22:%22@knockback/core%22,%22commonjs%22:%22@knockback/core%22,%22commonjs2%22:%22@knockback/core%22%7D?");

/***/ }),

/***/ "knockout":
/*!********************************************************************************************!*\
  !*** external {"root":"ko","amd":"knockout","commonjs":"knockout","commonjs2":"knockout"} ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_knockout__;\n\n//# sourceURL=webpack://kbf/external_%7B%22root%22:%22ko%22,%22amd%22:%22knockout%22,%22commonjs%22:%22knockout%22,%22commonjs2%22:%22knockout%22%7D?");

/***/ }),

/***/ "underscore":
/*!*************************************************************************************************!*\
  !*** external {"root":"_","amd":"underscore","commonjs":"underscore","commonjs2":"underscore"} ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_underscore__;\n\n//# sourceURL=webpack://kbf/external_%7B%22root%22:%22_%22,%22amd%22:%22underscore%22,%22commonjs%22:%22underscore%22,%22commonjs2%22:%22underscore%22%7D?");

/***/ })

/******/ });
});