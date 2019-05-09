(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@knockback/core"), require("knockout"), require("underscore"));
	else if(typeof define === 'function' && define.amd)
		define(["@knockback/core", "knockout", "underscore"], factory);
	else if(typeof exports === 'object')
		exports["kbv"] = factory(require("@knockback/core"), require("knockout"), require("underscore"));
	else
		root["kbv"] = factory(root["kb"], root["ko"], root["_"]);
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./packages/knockback-validation/src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(originalModule) {\n\tif (!originalModule.webpackPolyfill) {\n\t\tvar module = Object.create(originalModule);\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, \"loaded\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"id\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"exports\", {\n\t\t\tenumerable: true\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack://kbv/(webpack)/buildin/harmony-module.js?");

/***/ }),

/***/ "./packages/knockback-validation/src/index.js":
/*!****************************************************!*\
  !*** ./packages/knockback-validation/src/index.js ***!
  \****************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @knockback/core */ \"@knockback/core\");\n/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_knockback_core__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _valid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./valid */ \"./packages/knockback-validation/src/valid.js\");\n/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./validation */ \"./packages/knockback-validation/src/validation.js\");\n/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./validators */ \"./packages/knockback-validation/src/validators.js\");\n/*\n  knockback.js 2.0.0-alpha.1\n  Copyright (c)  2011-2016 Kevin Malakoff.\n  License: MIT (http://www.opensource.org/licenses/mit-license.php)\n  Source: https://github.com/kmalakoff/knockback\n  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).\n  Optional dependencies: Backbone.ModelRef.js and BackboneORM.\n*/\n\n\n\n\nvar api = {\n  valid: _valid__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  valueValidator: _validation__WEBPACK_IMPORTED_MODULE_2__[\"valueValidator\"],\n  inputValidator: _validation__WEBPACK_IMPORTED_MODULE_2__[\"inputValidator\"],\n  formValidator: _validation__WEBPACK_IMPORTED_MODULE_2__[\"formValidator\"],\n  hasChangedFn: _validators__WEBPACK_IMPORTED_MODULE_3__[\"hasChangedFn\"],\n  minLengthFn: _validators__WEBPACK_IMPORTED_MODULE_3__[\"minLengthFn\"],\n  uniqueValueFn: _validators__WEBPACK_IMPORTED_MODULE_3__[\"uniqueValueFn\"],\n  untilTrueFn: _validators__WEBPACK_IMPORTED_MODULE_3__[\"untilTrueFn\"],\n  untilFalseFn: _validators__WEBPACK_IMPORTED_MODULE_3__[\"untilFalseFn\"]\n};\n_knockback_core__WEBPACK_IMPORTED_MODULE_0___default.a.assign(_knockback_core__WEBPACK_IMPORTED_MODULE_0___default.a, api);\nmodule.exports = api;\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack://kbv/./packages/knockback-validation/src/index.js?");

/***/ }),

/***/ "./packages/knockback-validation/src/valid.js":
/*!****************************************************!*\
  !*** ./packages/knockback-validation/src/valid.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/*\n  knockback.js 2.0.0-alpha.1\n  Copyright (c)  2011-2016 Kevin Malakoff.\n  License: MIT (http://www.opensource.org/licenses/mit-license.php)\n  Source: https://github.com/kmalakoff/knockback\n  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).\n  Optional dependencies: Backbone.ModelRef.js and BackboneORM.\n*/\n// Regular expressions from Angular.js: https://github.com/angular/angular.js\nvar URL_REGEXP = /^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$/;\nvar EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$/;\nvar NUMBER_REGEXP = /^\\s*(-|\\+)?(\\d+|(\\d*(\\.\\d*)))\\s*$/; // A validator should return true if there are errors (similar to the binding check in HTML, eg. $name().required).\n\nvar valid = {\n  required: function required(value) {\n    return !value;\n  },\n  url: function url(value) {\n    return !URL_REGEXP.test(value);\n  },\n  email: function email(value) {\n    return !EMAIL_REGEXP.test(value);\n  },\n  number: function number(value) {\n    return !NUMBER_REGEXP.test(value);\n  }\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (valid);\n\n//# sourceURL=webpack://kbv/./packages/knockback-validation/src/valid.js?");

/***/ }),

/***/ "./packages/knockback-validation/src/validation.js":
/*!*********************************************************!*\
  !*** ./packages/knockback-validation/src/validation.js ***!
  \*********************************************************/
/*! exports provided: valueValidator, inputValidator, formValidator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"valueValidator\", function() { return valueValidator; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"inputValidator\", function() { return inputValidator; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"formValidator\", function() { return formValidator; });\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ \"underscore\");\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! knockout */ \"knockout\");\n/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @knockback/core */ \"@knockback/core\");\n/* harmony import */ var _knockback_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_knockback_core__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _valid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./valid */ \"./packages/knockback-validation/src/valid.js\");\n/*\n  knockback.js 2.0.0-alpha.1\n  Copyright (c)  2011-2016 Kevin Malakoff.\n  License: MIT (http://www.opensource.org/licenses/mit-license.php)\n  Source: https://github.com/kmalakoff/knockback\n  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).\n  Optional dependencies: Backbone.ModelRef.js and BackboneORM.\n*/\n\n\n\n // internal helper\n\nvar callOrGet = function callOrGet(value) {\n  value = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(value);\n\n  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {\n    args[_key - 1] = arguments[_key];\n  }\n\n  return typeof value === 'function' ? value.apply(void 0, args) : value;\n}; // Helpers for validating forms, inputs, and values.\n// @example A Named Form\n//   <form name=\"myForm\">\n//      <input name=\"input1\", data-bind=\"value: input1\" required>\n//      <input type=\"url\" name=\"input2\", data-bind=\"value: input2\">\n//    </form>\n//   Because there is a form name, it will add the following property to your ViewModel (wrapped in an observable):\n//    $myForm: {\n//      input1: {required: boolean, valid: boolean, invalid: boolean},\n//      input2: {url: boolean, valid: boolean, invalid: boolean},\n//      valid: boolean,\n//      invalid: boolean\n//    }\n// @example A Unnamed Form\n//   <form>\n//     <input name=\"input1\", data-bind=\"value: input1\" required>\n//     <input type=\"url\" name=\"input2\", data-bind=\"value: input2\">\n//   </form>\n//   Because there is not a form name, it will extend the following on your ViewModel (each wrapped separately in an observable):\n//   {\n//     $input1: {required: boolean, valid: boolean, invalid: boolean},\n//     $input2: {url: boolean, valid: boolean, invalid: boolean}\n//   }\n//\n// @method .valueValidator(value, bindings, validation_options={})\n//   Used to create an observable that wraps all of the validators for a value and also generates helpers for $valid, $error_count, $enabled, $disabled, and $active_error.\n//   @note Called using `kb.valueValidator` (not  kb.valueValidator)\n//   @param [Observable] value the value to validate\n//   @param [Object] bindings the named validators to use to validate the value\n//   @param [Object] validation_options the validation options\n//   @option validation_options [Boolean|Function] disable the test for disabling validations\n//   @option validation_options [Boolean|Function] enable the test for enabling validations\n//   @option validation_options [String|Array] priorities the priority order of the validators (used to set $active_error in the case of multiple being active simulateously)\n//   @return [ko.computed] a single observable storing an Object with all of the validators and generated helpers\n//\n// @method .inputValidator(view_model, el, validation_options={})\n//   Used to create an observable that wraps all of the validators for an HTML input element using `kb.valueValidator`. See kb.valueValidator for shared options.\n//   In addition, you can add custom bindings by including a `validations` Object in your data-bind statement where each property has a function(value) that returns true if there are errors.\n//   It will automatically generate validators from the input for the following attributes:\n//   * type: for url, email, and number\n//   * required: must have a length or a value\n//   @note Called using `inputValidator` (not  inputValidator)\n//   @return [ko.computed] a single observable storing an Object with all of the validators and generated helpers\n//   @example Binding an input using Knockback inject.\n//     <input type=\"url\" name=\"name\" data-bind=\"value: name, inject: inputValidator\" required>\n//     Adds the following to your ViewModel:\n//       $name: kb.observable({required: Boolean, url: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})\n//   @example Binding an input with custom validations using Knockback inject.\n//     <input type=\"url\" name=\"name\" data-bind=\"value: name, inject: inputValidator, validations: {unique: nameTaken}\" required>\n//     Adds the following to your ViewModel:\n//       $name: kb.observable({required: Boolean, url: Boolean, unique: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})\n//   @example Binding an input with validation options using Knockback inject.\n//     <input type=\"url\" name=\"name\" data-bind=\"value: name, inject: inputValidator, validation_options: {disable: disable, priorities: 'url'}\" required>\n//     Adds the following to your ViewModel:\n//       $name: kb.observable({required: Boolean, url: Boolean, unique: Boolean, $valid: Boolean, $error_count: Number, $enabled: Boolean, $disabled: Boolean, $active_error: String})\n//\n// @method .formValidator(view_model, el)\n//   Used to create an observable that wraps all of the validators for all the inputs on an HTML form element using `inputValidator`. See inputValidator for per input options.\n//   In addition, the formValidator aggregates the following helpers for its inputs: $valid, $error_count, $enabled, and $disabled.\n//    Also, if you provide a name attribute for the form, it will attach all of the inputs to a $name property on your view model.\n//   @note Called using `kb.formValidator` (not  kb.formValidator)\n//   @return [Object] an Object with all of the validators and generated helpers\n//   @example Binding a form by name using Knockback inject.\n//     <form name='my_form' data-bind=\"inject: kb.formValidator, validation_options: {priorities: ['required', 'url']}\">\n//       <input type=\"text\" name=\"name\" data-bind=\"value: name\" required>\n//       <input type=\"url\" name=\"site\" data-bind=\"value: site\" required>\n//     </form>\n//     Adds the following to your ViewModel:\n//     $my_form: {\n//       name: kb.observable({required: Boolean, $valid: Boolean, $error_count: Number, $active_error: String}),\n//       site: kb.observable({required: Boolean, url: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})\n//     }\n//   @example Binding a form without a name using Knockback inject.\n//     <form data-bind=\"inject: kb.formValidator, validation_options: {priorities: ['required', 'url']}\">\n//       <input type=\"text\" name=\"name\" data-bind=\"value: name\" required>\n//       <input type=\"url\" name=\"site\" data-bind=\"value: site\" required>\n//     </form>\n//     Extends your ViewModel with the following Object:\n//     {\n//       $name: kb.observable({required: Boolean, $valid: Boolean, $error_count: Number, $active_error: String}),\n//       $site: kb.observable({required: Boolean, url: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})\n//     }\n// @method .hasChangedFn(model)\n//   A validation helper that can be used to wait for a change before enabling validations.\n//   @note Called using `kb.hasChangedFn` (not  kb.hasChangedFn)\n//   @return [Function] Validator function bound with model\n//   @example Enabling validations after a change has been made to a model.\n//     <form class=\"form-horizontal\" data-bind=\"inject: kb.formValidator, validation_options: {enable: kb.hasChangedFn(model)}\">\n// @method .minLengthFn(length)\n//   A validator that will be invalid until the length of the value is below a minimum value.\n//   @note Called using `kb.minLengthFn` (not  kb.minLengthFn)\n//   @return [Function] Validator function bound with min length\n//   @example Validations will be invalid until the name is at least 4 characters long.\n//     <input type=\"text\" name=\"name\" data-bind=\"value: name, validations: {length: kb.minLengthFn(4)}\">\n// @method .uniqueValueFn(model, key, collection)\n//   Checks for a unique attribute value by key in a collection\n//   @note Called using `kb.uniqueValueFn` (not  kb.uniqueValueFn)\n//   @return [Function] Validator function bound with model, attribute key, and collection\n//   @example Validations will be invalid until the name attribute is unique in the collection.\n//     <input type=\"text\" name=\"name\" data-bind=\"value: name, validations: {unique: kb.uniqueValueFn(model, 'name', some_collection)}\">\n// @method .untilTrueFn(stand_in, fn, model)\n//   Used to combine conditions.\n//   @note Called using `kb.untilTrueFn` (not  kb.untilTrueFn)\n//   @return [Function] Validator function bound with stand_in value before condition is met, validator function, and optionally model (will reset if the model changes).\n//   @example Filter the minimum length test of name until it has be valid (that way, won't report invalid while typing in a new input).\n//     <input type=\"text\" name=\"name\" data-bind=\"value: name, validations: {length_filtered: kb.untilFalseFn(false, kb.minLengthFn(4), model)}\">\n// @method .untilFalseFn(stand_in, fn, model)\n//   Used to combine conditions.\n//   @note Called using `kb.untilFalseFn` (not  kb.untilFalseFn)\n//   @return [Function] Validator function bound with stand_in value before condition is met, validator function, and optionally model (will reset if the model changes).\n// ############################\n// Aliases\n// ############################\n\n\nvar valueValidator = function valueValidator(value, bindings) {\n  var validation_options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};\n  return knockout__WEBPACK_IMPORTED_MODULE_1___default.a.computed(function () {\n    var results = {\n      $error_count: 0\n    };\n    var current_value = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(value);\n    var disabled;\n    if ('disable' in validation_options) disabled = callOrGet(validation_options.disable);\n    if ('enable' in validation_options) disabled = !callOrGet(validation_options.enable);\n    var priorities = validation_options.priorities || [];\n    if (!underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(priorities)) priorities = [priorities]; // ensure priorities is an array\n    // then add the rest\n\n    var active_index = priorities.length + 1;\n\n    underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(bindings, function (validator, identifier) {\n      results[identifier] = !disabled && callOrGet(validator, current_value); // update validity\n\n      if (results[identifier]) {\n        results.$error_count++; // check priorities\n\n        var identifier_index;\n        (identifier_index = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.indexOf(priorities, identifier) >= 0) || (identifier_index = priorities.length);\n\n        if (results.$active_error && identifier_index < active_index) {\n          results.$active_error = identifier;\n          active_index = identifier_index;\n        } else {\n          results.$active_error || (results.$active_error = identifier, active_index = identifier_index);\n        }\n      }\n    }); // add the inverse and ensure a boolean\n\n\n    results.$enabled = !disabled;\n    results.$disable = !!disabled;\n    results.$valid = results.$error_count === 0;\n    return results;\n  });\n};\nvar inputValidator = function inputValidator(view_model, el) {\n  var validation_options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};\n  var validators = _valid__WEBPACK_IMPORTED_MODULE_3__[\"default\"];\n  var input_name = el.getAttribute('name');\n\n  if (input_name && !underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isString(input_name)) {\n    input_name = null;\n  } // only set up form elements with a value bindings\n\n\n  var bindings = el.getAttribute('data-bind');\n  if (!bindings) return null;\n  var options = new Function('sc', \"with(sc[0]) { return { \".concat(bindings, \" } }\"))([view_model]);\n  if (!(options && options.value)) return null;\n\n  if (options.validation_options) {\n    underscore__WEBPACK_IMPORTED_MODULE_0___default.a.defaults(options.validation_options, validation_options);\n\n    validation_options = options.validation_options;\n  } // collect the types to identifier\n\n\n  var type = el.getAttribute('type');\n  bindings = {};\n  !validators[type] || (bindings[type] = validators[type]);\n  !el.hasAttribute('required') || (bindings.required = validators.required);\n\n  if (options.validations) {\n    underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(options.validations, function (validator, identifier) {\n      bindings[identifier] = validator;\n    });\n  }\n\n  var result = valueValidator(options.value, bindings, validation_options); // if there is a name, add to the view_model with $scoping\n\n  !input_name && !validation_options.no_attach || (view_model[\"$\".concat(input_name)] = result);\n  return result;\n};\nvar formValidator = function formValidator(view_model, el) {\n  var results = {};\n  var validators = [];\n  var form_name = el.getAttribute('name');\n  if (form_name && !underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isString(form_name)) form_name = null;\n  var bindings = el.getAttribute('data-bind');\n  var validation_options;\n\n  if (bindings) {\n    var options = new Function('sc', \"with(sc[0]) { return { \".concat(bindings, \" } }\"))([view_model]);\n    validation_options = options.validation_options;\n  }\n\n  if (!validation_options) validation_options = {};\n  validation_options.no_attach = !!form_name; // build up the results\n\n  underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(el.getElementsByTagName('input'), function (input_el) {\n    var name = input_el.getAttribute('name');\n    if (!name) return; // need named inputs to set up an object\n\n    var validator = inputValidator(view_model, input_el, validation_options);\n    !validator || validators.push(results[name] = validator);\n  }); // collect stats, error count and valid\n\n\n  results.$error_count = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.computed(function () {\n    var error_count = 0;\n\n    underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(validators, function (validator) {\n      error_count += validator().$error_count;\n    });\n\n    return error_count;\n  });\n  results.$valid = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.computed(function () {\n    return results.$error_count() === 0;\n  }); // enabled and disabled\n\n  results.$enabled = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.computed(function () {\n    var enabled = true;\n\n    underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(validators, function (validator) {\n      enabled &= validator().$enabled;\n    });\n\n    return enabled;\n  });\n  results.$disabled = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.computed(function () {\n    return !results.$enabled();\n  }); // if there is a name, add to the view_model with $scoping\n\n  if (form_name) view_model[\"$\".concat(form_name)] = results;\n  return results;\n};\n\n//# sourceURL=webpack://kbv/./packages/knockback-validation/src/validation.js?");

/***/ }),

/***/ "./packages/knockback-validation/src/validators.js":
/*!*********************************************************!*\
  !*** ./packages/knockback-validation/src/validators.js ***!
  \*********************************************************/
/*! exports provided: hasChangedFn, minLengthFn, uniqueValueFn, untilTrueFn, untilFalseFn */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hasChangedFn\", function() { return hasChangedFn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"minLengthFn\", function() { return minLengthFn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"uniqueValueFn\", function() { return uniqueValueFn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"untilTrueFn\", function() { return untilTrueFn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"untilFalseFn\", function() { return untilFalseFn; });\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ \"underscore\");\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! knockout */ \"knockout\");\n/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_1__);\n/*\n  knockback.js 2.0.0-alpha.1\n  Copyright (c)  2011-2016 Kevin Malakoff.\n  License: MIT (http://www.opensource.org/licenses/mit-license.php)\n  Source: https://github.com/kmalakoff/knockback\n  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).\n  Optional dependencies: Backbone.ModelRef.js and BackboneORM.\n*/\n\n // Convention is that if they end in Fn then returns a function pointer based on parameters passed.\n\nvar hasChangedFn = function hasChangedFn(model) {\n  var m = null;\n  var attributes = null;\n  return function () {\n    var current_model = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(model);\n\n    if (m !== current_model) {\n      // change in model\n      m = current_model;\n      attributes = m ? m.toJSON() : null;\n      return false;\n    }\n\n    if (!(m && attributes)) return false;\n    return !underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isEqual(m.toJSON(), attributes);\n  };\n};\nvar minLengthFn = function minLengthFn(length) {\n  return function (value) {\n    return !value || value.length < length;\n  };\n};\nvar uniqueValueFn = function uniqueValueFn(model, key, collection) {\n  return function (value) {\n    var m = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(model);\n    var k = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(key);\n    var c = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(collection);\n    if (!(m && k && c)) return false;\n    return !!underscore__WEBPACK_IMPORTED_MODULE_0___default.a.find(c.models, function (test) {\n      return test !== m && test.get(k) === value;\n    });\n  };\n};\nvar untilTrueFn = function untilTrueFn(stand_in, fn, model) {\n  var was_true = false;\n  if (model && knockout__WEBPACK_IMPORTED_MODULE_1___default.a.isObservable(model)) model.subscribe(function () {\n    was_true = false;\n  }); // reset if the model changes\n\n  return function (value) {\n    var f = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(fn);\n    if (!f) return knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(stand_in);\n    var result = f(knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(value));\n    was_true |= !!result;\n    return was_true ? result : knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(stand_in);\n  };\n};\nvar untilFalseFn = function untilFalseFn(stand_in, fn, model) {\n  var was_false = false;\n  if (model && knockout__WEBPACK_IMPORTED_MODULE_1___default.a.isObservable(model)) model.subscribe(function () {\n    was_false = false;\n  }); // reset if the model changes\n\n  return function (value) {\n    var f = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(fn);\n    if (!f) return knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(stand_in);\n    var result = f(knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(value));\n    was_false |= !result;\n    return was_false ? result : knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(stand_in);\n  };\n};\n\n//# sourceURL=webpack://kbv/./packages/knockback-validation/src/validators.js?");

/***/ }),

/***/ "@knockback/core":
/*!*****************************************************************************************************************!*\
  !*** external {"root":"kb","amd":"@knockback/core","commonjs":"@knockback/core","commonjs2":"@knockback/core"} ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE__knockback_core__;\n\n//# sourceURL=webpack://kbv/external_%7B%22root%22:%22kb%22,%22amd%22:%22@knockback/core%22,%22commonjs%22:%22@knockback/core%22,%22commonjs2%22:%22@knockback/core%22%7D?");

/***/ }),

/***/ "knockout":
/*!********************************************************************************************!*\
  !*** external {"root":"ko","amd":"knockout","commonjs":"knockout","commonjs2":"knockout"} ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_knockout__;\n\n//# sourceURL=webpack://kbv/external_%7B%22root%22:%22ko%22,%22amd%22:%22knockout%22,%22commonjs%22:%22knockout%22,%22commonjs2%22:%22knockout%22%7D?");

/***/ }),

/***/ "underscore":
/*!*************************************************************************************************!*\
  !*** external {"root":"_","amd":"underscore","commonjs":"underscore","commonjs2":"underscore"} ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_underscore__;\n\n//# sourceURL=webpack://kbv/external_%7B%22root%22:%22_%22,%22amd%22:%22underscore%22,%22commonjs%22:%22underscore%22,%22commonjs2%22:%22underscore%22%7D?");

/***/ })

/******/ });
});