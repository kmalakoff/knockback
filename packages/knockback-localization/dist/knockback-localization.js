(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@knockback/core"), require("backbone"), require("knockout"), require("underscore"));
	else if(typeof define === 'function' && define.amd)
		define(["@knockback/core", "backbone", "knockout", "underscore"], factory);
	else if(typeof exports === 'object')
		exports["kb"] = factory(require("@knockback/core"), require("backbone"), require("knockout"), require("underscore"));
	else
		root["kb"] = factory(root["kb"], root["Backbone"], root["ko"], root["_"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__knockback_core__, __WEBPACK_EXTERNAL_MODULE_backbone__, __WEBPACK_EXTERNAL_MODULE_knockout__, __WEBPACK_EXTERNAL_MODULE_underscore__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./packages/knockback-localization/src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(originalModule) {\n\tif (!originalModule.webpackPolyfill) {\n\t\tvar module = Object.create(originalModule);\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, \"loaded\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"id\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"exports\", {\n\t\t\tenumerable: true\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack://kb/(webpack)/buildin/harmony-module.js?");

/***/ }),

/***/ "./packages/knockback-localization/src/index.js":
/*!******************************************************!*\
  !*** ./packages/knockback-localization/src/index.js ***!
  \******************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @knockback/core */ \"@knockback/core\");\n/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_knockback_core__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _localized_observable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./localized-observable */ \"./packages/knockback-localization/src/localized-observable.js\");\n/*\n  knockback.js 2.0.0-alpha.1\n  Copyright (c)  2011-2016 Kevin Malakoff.\n  License: MIT (http://www.opensource.org/licenses/mit-license.php)\n  Source: https://github.com/kmalakoff/knockback\n  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).\n  Optional dependencies: Backbone.ModelRef.js and BackboneORM.\n*/\n\n // Locale Manager - if you are using localization, set this property.\n// It must have Backbone.Events mixed in and implement a get method like Backbone.Model, eg. get: (attribute_name) -> return somthing\n\nvar api = {\n  locale_manager: undefined,\n  LocalizedObservable: _localized_observable__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  localizedObservable: _localized_observable__WEBPACK_IMPORTED_MODULE_1__[\"localizedObservable\"]\n};\n_knockback_core__WEBPACK_IMPORTED_MODULE_0___default.a.assign(_knockback_core__WEBPACK_IMPORTED_MODULE_0___default.a, api);\nmodule.exports = api;\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack://kb/./packages/knockback-localization/src/index.js?");

/***/ }),

/***/ "./packages/knockback-localization/src/localized-observable.js":
/*!*********************************************************************!*\
  !*** ./packages/knockback-localization/src/localized-observable.js ***!
  \*********************************************************************/
/*! exports provided: default, localizedObservable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return LocalizedObservable; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"localizedObservable\", function() { return localizedObservable; });\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ \"underscore\");\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! backbone */ \"backbone\");\n/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! knockout */ \"knockout\");\n/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @knockback/core */ \"@knockback/core\");\n/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_knockback_core__WEBPACK_IMPORTED_MODULE_3__);\nfunction isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n/*\n  knockback.js 2.0.0-alpha.1\n  Copyright (c)  2011-2016 Kevin Malakoff.\n  License: MIT (http://www.opensource.org/licenses/mit-license.php)\n  Source: https://github.com/kmalakoff/knockback\n  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).\n  Optional dependencies: Backbone.ModelRef.js and BackboneORM.\n*/\n\n\n\n\nvar KEYS_PUBLISH = ['destroy', 'observedValue', 'resetToCurrent']; // @abstract You must provide the following two methods:\n//   * read: function(value, observable) called to get the value and each time the locale changes\n//   * write: function(localized_string, value, observable) called to set the value (optional)\n//\n// Base class for observing localized data that changes when the locale changes.\n//\n// @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.\n//   kb.ShortDateLocalizer = kb.LocalizedObservable.extend({\n//     constructor: function(value, options, view_model) {\n//       kb.LocalizedObservable.prototype.constructor.apply(this, arguments);\n//       return kb.utils.wrappedObservable(this);\n//     },\n//     read: function(value) {\n//       return Globalize.format(value, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale());\n//     },\n//     write: function(localized_string, value) {\n//       var new_value;\n//       new_value = Globalize.parseDate(localized_string, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale());\n//       if (!(new_value && _.isDate(new_value))) {\n//         return kb.utils.wrappedObservable(this).resetToCurrent();\n//       }\n//       return value.setTime(new_value.valueOf());\n//     }\n//   });\n//   var ViewModel = function(model) {\n//     this.localized_date = kb.observable(model, {\n//       key: 'date',\n//       'default': this.loading_message,\n//       localizer: ShortDateLocalizer\n//     }, this);\n//   };\n//   var view_model = new ViewModel(new Backbone.Model({date: new Date()}));\n//\n// @method .extend(prototype_properties, class_properties)\n//   Class method for JavaScript inheritance.\n//   @param [Object] prototype_properties the properties to add to the prototype\n//   @param [Object] class_properties the properties to add to the class\n//   @return [ko.observable] the constructor does not return 'this' but a ko.observable\n//   @example\n//     var MyLocalizedObservable = kb.LocalizedObservable.extend({\n//        constructor: function(value, options, view_model) {\n//          // the constructor does not return 'this' but a ko.observable\n//          return kb.LocalizedObservable.prototype.constructor.apply(this, arguments);\n//        }\n//     });\n\nvar LocalizedObservable =\n/*#__PURE__*/\nfunction () {\n  // for Backbone non-Coffeescript inheritance (use \"kb.SuperClass.extend({})\" in Javascript instead of \"class MyClass extends kb.SuperClass\")\n  // Used to create a new kb.LocalizedObservable. This an abstract class.\n  //\n  // @param [Data|ko.observable] value the value to localize\n  // @param [Object] options the create options\n  // @option options [Data|ko.observable] default a default value to present when the value is null, an empty string, etc.\n  // @option options [Function] onChange a notification that gets called when the locale changes. Signature: function(localized_string, value, observable)\n  // @return [ko.observable] the constructor does not return 'this' but a ko.observable\n  // @note the constructor does not return 'this' but a ko.observable\n  function LocalizedObservable(value, options, vm) {\n    var _this = this;\n\n    _classCallCheck(this, LocalizedObservable);\n\n    // @vm is view_model\n    this.value = value;\n    this.vm = vm;\n\n    if (!options) {\n      options = {};\n    }\n\n    if (!this.vm) {\n      this.vm = {};\n    }\n\n    this.read || _knockback_core__WEBPACK_IMPORTED_MODULE_3___default.a._throwMissing(this, 'read');\n    _knockback_core__WEBPACK_IMPORTED_MODULE_3___default.a.locale_manager || _knockback_core__WEBPACK_IMPORTED_MODULE_3___default.a._throwMissing(this, 'kb.locale_manager'); // bind callbacks\n\n    if (!this.__kb) {\n      this.__kb = {};\n    }\n\n    this.__kb._onLocaleChange = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.bind(this._onLocaleChange, this);\n    this.__kb._onChange = options.onChange; // internal state\n\n    var currentValue = this.value ? knockout__WEBPACK_IMPORTED_MODULE_2___default.a.utils.unwrapObservable(this.value) : null;\n    this.vo = knockout__WEBPACK_IMPORTED_MODULE_2___default.a.observable(!currentValue ? null : this.read(currentValue, null));\n    var observable = _knockback_core__WEBPACK_IMPORTED_MODULE_3___default.a.utils.wrappedObservable(this, knockout__WEBPACK_IMPORTED_MODULE_2___default.a.computed({\n      read: function read() {\n        if (_this.value) knockout__WEBPACK_IMPORTED_MODULE_2___default.a.utils.unwrapObservable(_this.value);\n\n        _this.vo(); // create a depdenency\n\n\n        return _this.read(knockout__WEBPACK_IMPORTED_MODULE_2___default.a.utils.unwrapObservable(_this.value));\n      },\n      write: function write(x) {\n        _this.write || _knockback_core__WEBPACK_IMPORTED_MODULE_3___default.a._throwUnexpected(_this, 'writing to read-only');\n\n        _this.write(x, knockout__WEBPACK_IMPORTED_MODULE_2___default.a.utils.unwrapObservable(_this.value));\n\n        _this.vo(x);\n\n        !_this.__kb._onChange || _this.__kb._onChange(x);\n      },\n      owner: this.vm\n    })); // publish public interface on the observable and return instead of this\n\n    _knockback_core__WEBPACK_IMPORTED_MODULE_3___default.a.publishMethods(observable, this, KEYS_PUBLISH); // start\n\n    _knockback_core__WEBPACK_IMPORTED_MODULE_3___default.a.locale_manager.bind('change', this.__kb._onLocaleChange); // wrap ourselves with a default value\n\n    if (Object.prototype.hasOwnProperty.call(options, 'default')) {\n      observable = _knockback_core__WEBPACK_IMPORTED_MODULE_3___default.a.DefaultObservable && knockout__WEBPACK_IMPORTED_MODULE_2___default.a.defaultObservable(observable, options[\"default\"]);\n    }\n\n    return observable;\n  } // Required clean up function to break cycles, release view models, etc.\n  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).\n\n\n  _createClass(LocalizedObservable, [{\n    key: \"destroy\",\n    value: function destroy() {\n      _knockback_core__WEBPACK_IMPORTED_MODULE_3___default.a.locale_manager.unbind('change', this.__kb._onLocaleChange);\n      this.vm = null;\n      return _knockback_core__WEBPACK_IMPORTED_MODULE_3___default.a.utils.wrappedDestroy(this);\n    } // Used to reset the value if localization is not possible.\n\n  }, {\n    key: \"resetToCurrent\",\n    value: function resetToCurrent() {\n      var observable = _knockback_core__WEBPACK_IMPORTED_MODULE_3___default.a.utils.wrappedObservable(this);\n      var current_value = this.value ? this.read(knockout__WEBPACK_IMPORTED_MODULE_2___default.a.utils.unwrapObservable(this.value)) : null;\n      if (observable() === current_value) return undefined;\n      return observable(current_value);\n    } // Dual purpose set/get\n\n  }, {\n    key: \"observedValue\",\n    value: function observedValue(value) {\n      if (arguments.length === 0) return this.value;\n      this.value = value;\n\n      this._onLocaleChange();\n\n      return undefined;\n    } // ###################################################\n    // Internal\n    // ###################################################\n    // @nodoc\n\n  }, {\n    key: \"_onLocaleChange\",\n    value: function _onLocaleChange() {\n      var value = this.read(knockout__WEBPACK_IMPORTED_MODULE_2___default.a.utils.unwrapObservable(this.value));\n      this.vo(value);\n      if (this.__kb._onChange) return this.__kb._onChange(value);\n      return undefined;\n    }\n  }]);\n\n  return LocalizedObservable;\n}(); // factory function\n\n\n_defineProperty(LocalizedObservable, \"extend\", backbone__WEBPACK_IMPORTED_MODULE_1___default.a.Model.extend);\n\n\nvar localizedObservable = function localizedObservable() {\n  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n    args[_key] = arguments[_key];\n  }\n\n  return _construct(LocalizedObservable, args);\n};\n\n//# sourceURL=webpack://kb/./packages/knockback-localization/src/localized-observable.js?");

/***/ }),

/***/ "@knockback/core":
/*!*****************************************************************************************************************!*\
  !*** external {"root":"kb","amd":"@knockback/core","commonjs":"@knockback/core","commonjs2":"@knockback/core"} ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE__knockback_core__;\n\n//# sourceURL=webpack://kb/external_%7B%22root%22:%22kb%22,%22amd%22:%22@knockback/core%22,%22commonjs%22:%22@knockback/core%22,%22commonjs2%22:%22@knockback/core%22%7D?");

/***/ }),

/***/ "backbone":
/*!**************************************************************************************************!*\
  !*** external {"root":"Backbone","amd":"backbone","commonjs":"backbone","commonjs2":"backbone"} ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_backbone__;\n\n//# sourceURL=webpack://kb/external_%7B%22root%22:%22Backbone%22,%22amd%22:%22backbone%22,%22commonjs%22:%22backbone%22,%22commonjs2%22:%22backbone%22%7D?");

/***/ }),

/***/ "knockout":
/*!********************************************************************************************!*\
  !*** external {"root":"ko","amd":"knockout","commonjs":"knockout","commonjs2":"knockout"} ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_knockout__;\n\n//# sourceURL=webpack://kb/external_%7B%22root%22:%22ko%22,%22amd%22:%22knockout%22,%22commonjs%22:%22knockout%22,%22commonjs2%22:%22knockout%22%7D?");

/***/ }),

/***/ "underscore":
/*!*************************************************************************************************!*\
  !*** external {"root":"_","amd":"underscore","commonjs":"underscore","commonjs2":"underscore"} ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_underscore__;\n\n//# sourceURL=webpack://kb/external_%7B%22root%22:%22_%22,%22amd%22:%22underscore%22,%22commonjs%22:%22underscore%22,%22commonjs2%22:%22underscore%22%7D?");

/***/ })

/******/ });
});