(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@knockback/core"), require("underscore"), require("knockout"));
	else if(typeof define === 'function' && define.amd)
		define(["@knockback/core", "underscore", "knockout"], factory);
	else if(typeof exports === 'object')
		exports["kbv"] = factory(require("@knockback/core"), require("underscore"), require("knockout"));
	else
		root["kbv"] = factory(root["kb"], root["_"], root["ko"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
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
/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

// Regular expressions from Angular.js: https://github.com/angular/angular.js
var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/;
var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
var NUMBER_REGEXP = /^\s*(-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

// A validator should return true if there are errors (similar to the binding check in HTML, eg. $name().required).
var valid = {
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
};
exports.default = valid;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _core = __webpack_require__(0);

var _core2 = _interopRequireDefault(_core);

var _valid = __webpack_require__(1);

var _valid2 = _interopRequireDefault(_valid);

var _validation = __webpack_require__(5);

var _validators = __webpack_require__(6);

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
  valid: _valid2.default,
  valueValidator: _validation.valueValidator,
  inputValidator: _validation.inputValidator,
  formValidator: _validation.formValidator,
  hasChangedFn: _validators.hasChangedFn,
  minLengthFn: _validators.minLengthFn,
  uniqueValueFn: _validators.uniqueValueFn,
  untilTrueFn: _validators.untilTrueFn,
  untilFalseFn: _validators.untilFalseFn
};
_core2.default.assign(_core2.default, api);

module.exports = api;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formValidator = exports.inputValidator = exports.valueValidator = undefined;

var _underscore = __webpack_require__(2);

var _underscore2 = _interopRequireDefault(_underscore);

var _knockout = __webpack_require__(3);

var _knockout2 = _interopRequireDefault(_knockout);

var _core = __webpack_require__(0);

var _core2 = _interopRequireDefault(_core);

var _valid = __webpack_require__(1);

var _valid2 = _interopRequireDefault(_valid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// internal helper
/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var callOrGet = function callOrGet(value) {
  value = _knockout2.default.utils.unwrapObservable(value);

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return typeof value === 'function' ? value.apply(undefined, args) : value;
};

// Helpers for validating forms, inputs, and values.
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
//
// @method .valueValidator(value, bindings, validation_options={})
//   Used to create an observable that wraps all of the validators for a value and also generates helpers for $valid, $error_count, $enabled, $disabled, and $active_error.
//   @note Called using `kb.valueValidator` (not  kb.valueValidator)
//   @param [Observable] value the value to validate
//   @param [Object] bindings the named validators to use to validate the value
//   @param [Object] validation_options the validation options
//   @option validation_options [Boolean|Function] disable the test for disabling validations
//   @option validation_options [Boolean|Function] enable the test for enabling validations
//   @option validation_options [String|Array] priorities the priority order of the validators (used to set $active_error in the case of multiple being active simulateously)
//   @return [ko.computed] a single observable storing an Object with all of the validators and generated helpers
//
// @method .inputValidator(view_model, el, validation_options={})
//   Used to create an observable that wraps all of the validators for an HTML input element using `kb.valueValidator`. See kb.valueValidator for shared options.
//   In addition, you can add custom bindings by including a `validations` Object in your data-bind statement where each property has a function(value) that returns true if there are errors.
//   It will automatically generate validators from the input for the following attributes:
//   * type: for url, email, and number
//   * required: must have a length or a value
//   @note Called using `inputValidator` (not  inputValidator)
//   @return [ko.computed] a single observable storing an Object with all of the validators and generated helpers
//   @example Binding an input using Knockback inject.
//     <input type="url" name="name" data-bind="value: name, inject: inputValidator" required>
//     Adds the following to your ViewModel:
//       $name: kb.observable({required: Boolean, url: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})
//   @example Binding an input with custom validations using Knockback inject.
//     <input type="url" name="name" data-bind="value: name, inject: inputValidator, validations: {unique: nameTaken}" required>
//     Adds the following to your ViewModel:
//       $name: kb.observable({required: Boolean, url: Boolean, unique: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})
//   @example Binding an input with validation options using Knockback inject.
//     <input type="url" name="name" data-bind="value: name, inject: inputValidator, validation_options: {disable: disable, priorities: 'url'}" required>
//     Adds the following to your ViewModel:
//       $name: kb.observable({required: Boolean, url: Boolean, unique: Boolean, $valid: Boolean, $error_count: Number, $enabled: Boolean, $disabled: Boolean, $active_error: String})
//
// @method .formValidator(view_model, el)
//   Used to create an observable that wraps all of the validators for all the inputs on an HTML form element using `inputValidator`. See inputValidator for per input options.
//   In addition, the formValidator aggregates the following helpers for its inputs: $valid, $error_count, $enabled, and $disabled.
//    Also, if you provide a name attribute for the form, it will attach all of the inputs to a $name property on your view model.
//   @note Called using `kb.formValidator` (not  kb.formValidator)
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
//   @note Called using `kb.hasChangedFn` (not  kb.hasChangedFn)
//   @return [Function] Validator function bound with model
//   @example Enabling validations after a change has been made to a model.
//     <form class="form-horizontal" data-bind="inject: kb.formValidator, validation_options: {enable: kb.hasChangedFn(model)}">
// @method .minLengthFn(length)
//   A validator that will be invalid until the length of the value is below a minimum value.
//   @note Called using `kb.minLengthFn` (not  kb.minLengthFn)
//   @return [Function] Validator function bound with min length
//   @example Validations will be invalid until the name is at least 4 characters long.
//     <input type="text" name="name" data-bind="value: name, validations: {length: kb.minLengthFn(4)}">
// @method .uniqueValueFn(model, key, collection)
//   Checks for a unique attribute value by key in a collection
//   @note Called using `kb.uniqueValueFn` (not  kb.uniqueValueFn)
//   @return [Function] Validator function bound with model, attribute key, and collection
//   @example Validations will be invalid until the name attribute is unique in the collection.
//     <input type="text" name="name" data-bind="value: name, validations: {unique: kb.uniqueValueFn(model, 'name', some_collection)}">
// @method .untilTrueFn(stand_in, fn, model)
//   Used to combine conditions.
//   @note Called using `kb.untilTrueFn` (not  kb.untilTrueFn)
//   @return [Function] Validator function bound with stand_in value before condition is met, validator function, and optionally model (will reset if the model changes).
//   @example Filter the minimum length test of name until it has be valid (that way, won't report invalid while typing in a new input).
//     <input type="text" name="name" data-bind="value: name, validations: {length_filtered: kb.untilFalseFn(false, kb.minLengthFn(4), model)}">
// @method .untilFalseFn(stand_in, fn, model)
//   Used to combine conditions.
//   @note Called using `kb.untilFalseFn` (not  kb.untilFalseFn)
//   @return [Function] Validator function bound with stand_in value before condition is met, validator function, and optionally model (will reset if the model changes).

// ############################
// Aliases
// ############################
var valueValidator = exports.valueValidator = function valueValidator(value, bindings) {
  var validation_options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return _knockout2.default.computed(function () {
    var results = { $error_count: 0 };
    var current_value = _knockout2.default.utils.unwrapObservable(value);

    var disabled = void 0;
    if ('disable' in validation_options) disabled = callOrGet(validation_options.disable);
    if ('enable' in validation_options) disabled = !callOrGet(validation_options.enable);

    var priorities = validation_options.priorities || [];
    if (!_underscore2.default.isArray(priorities)) priorities = [priorities]; // ensure priorities is an array

    // then add the rest
    var active_index = priorities.length + 1;
    _underscore2.default.each(bindings, function (validator, identifier) {
      results[identifier] = !disabled && callOrGet(validator, current_value); // update validity
      if (results[identifier]) {
        results.$error_count++;

        // check priorities
        var identifier_index = void 0;
        (identifier_index = _underscore2.default.indexOf(priorities, identifier) >= 0) || (identifier_index = priorities.length);

        if (results.$active_error && identifier_index < active_index) {
          results.$active_error = identifier;active_index = identifier_index;
        } else {
          results.$active_error || (results.$active_error = identifier, active_index = identifier_index);
        }
      }
    });

    // add the inverse and ensure a boolean
    results.$enabled = !disabled;
    results.$disable = !!disabled;
    results.$valid = results.$error_count === 0;
    return results;
  });
};

var inputValidator = exports.inputValidator = function inputValidator(view_model, el) {
  var validation_options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var validators = _valid2.default;
  var input_name = el.getAttribute('name');
  if (input_name && !_underscore2.default.isString(input_name)) {
    input_name = null;
  }

  // only set up form elements with a value bindings
  var bindings = el.getAttribute('data-bind');
  if (!bindings) return null;
  var options = new Function('sc', 'with(sc[0]) { return { ' + bindings + ' } }')([view_model]);
  if (!(options && options.value)) return null;
  if (options.validation_options) {
    _underscore2.default.defaults(options.validation_options, validation_options);
    validation_options = options.validation_options;
  }

  // collect the types to identifier
  var type = el.getAttribute('type');
  bindings = {};
  !validators[type] || (bindings[type] = validators[type]);
  !el.hasAttribute('required') || (bindings.required = validators.required);
  if (options.validations) {
    _underscore2.default.each(options.validations, function (validator, identifier) {
      bindings[identifier] = validator;
    });
  }
  var result = valueValidator(options.value, bindings, validation_options);

  // if there is a name, add to the view_model with $scoping
  !input_name && !validation_options.no_attach || (view_model['$' + input_name] = result);
  return result;
};

var formValidator = exports.formValidator = function formValidator(view_model, el) {
  var results = {};
  var validators = [];
  var form_name = el.getAttribute('name');
  if (form_name && !_underscore2.default.isString(form_name)) form_name = null;

  var bindings = el.getAttribute('data-bind');
  var validation_options = void 0;
  if (bindings) {
    var options = new Function('sc', 'with(sc[0]) { return { ' + bindings + ' } }')([view_model]);
    validation_options = options.validation_options;
  }
  if (!validation_options) validation_options = {};
  validation_options.no_attach = !!form_name;

  // build up the results
  _underscore2.default.each(el.getElementsByTagName('input'), function (input_el) {
    var name = input_el.getAttribute('name');
    if (!name) return; // need named inputs to set up an object
    var validator = inputValidator(view_model, input_el, validation_options);
    !validator || validators.push(results[name] = validator);
  });

  // collect stats, error count and valid
  results.$error_count = _knockout2.default.computed(function () {
    var error_count = 0;
    _underscore2.default.each(validators, function (validator) {
      error_count += validator().$error_count;
    });
    return error_count;
  });
  results.$valid = _knockout2.default.computed(function () {
    return results.$error_count() === 0;
  });

  // enabled and disabled
  results.$enabled = _knockout2.default.computed(function () {
    var enabled = true;
    _underscore2.default.each(validators, function (validator) {
      enabled &= validator().$enabled;
    });
    return enabled;
  });
  results.$disabled = _knockout2.default.computed(function () {
    return !results.$enabled();
  });

  // if there is a name, add to the view_model with $scoping
  if (form_name) view_model['$' + form_name] = results;
  return results;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.untilFalseFn = exports.untilTrueFn = exports.uniqueValueFn = exports.minLengthFn = exports.hasChangedFn = undefined;

var _underscore = __webpack_require__(2);

var _underscore2 = _interopRequireDefault(_underscore);

var _knockout = __webpack_require__(3);

var _knockout2 = _interopRequireDefault(_knockout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Convention is that if they end in Fn then returns a function pointer based on parameters passed.
/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var hasChangedFn = exports.hasChangedFn = function hasChangedFn(model) {
  var m = null;var attributes = null;
  return function () {
    var current_model = _knockout2.default.utils.unwrapObservable(model);
    if (m !== current_model) {
      // change in model
      m = current_model;
      attributes = m ? m.toJSON() : null;
      return false;
    }
    if (!(m && attributes)) return false;
    return !_underscore2.default.isEqual(m.toJSON(), attributes);
  };
};

var minLengthFn = exports.minLengthFn = function minLengthFn(length) {
  return function (value) {
    return !value || value.length < length;
  };
};

var uniqueValueFn = exports.uniqueValueFn = function uniqueValueFn(model, key, collection) {
  return function (value) {
    var m = _knockout2.default.utils.unwrapObservable(model);var k = _knockout2.default.utils.unwrapObservable(key);var c = _knockout2.default.utils.unwrapObservable(collection);
    if (!(m && k && c)) return false;
    return !!_underscore2.default.find(c.models, function (test) {
      return test !== m && test.get(k) === value;
    });
  };
};

var untilTrueFn = exports.untilTrueFn = function untilTrueFn(stand_in, fn, model) {
  var was_true = false;
  if (model && _knockout2.default.isObservable(model)) model.subscribe(function () {
    was_true = false;
  }); // reset if the model changes
  return function (value) {
    var f = _knockout2.default.utils.unwrapObservable(fn);
    if (!f) return _knockout2.default.utils.unwrapObservable(stand_in);
    var result = f(_knockout2.default.utils.unwrapObservable(value));
    was_true |= !!result;
    return was_true ? result : _knockout2.default.utils.unwrapObservable(stand_in);
  };
};

var untilFalseFn = exports.untilFalseFn = function untilFalseFn(stand_in, fn, model) {
  var was_false = false;
  if (model && _knockout2.default.isObservable(model)) model.subscribe(function () {
    was_false = false;
  }); // reset if the model changes
  return function (value) {
    var f = _knockout2.default.utils.unwrapObservable(fn);
    if (!f) return _knockout2.default.utils.unwrapObservable(stand_in);
    var result = f(_knockout2.default.utils.unwrapObservable(value));
    was_false |= !result;
    return was_false ? result : _knockout2.default.utils.unwrapObservable(stand_in);
  };
};

/***/ })
/******/ ]);
});