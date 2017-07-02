(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@knockback/core"), require("underscore"), require("knockout"));
	else if(typeof define === 'function' && define.amd)
		define(["@knockback/core", "underscore", "knockout"], factory);
	else if(typeof exports === 'object')
		exports["kbf"] = factory(require("@knockback/core"), require("underscore"), require("knockout"));
	else
		root["kbf"] = factory(root["kb"], root["_"], root["ko"]);
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

var _formattedObservable = __webpack_require__(2);

var _formattedObservable2 = _interopRequireDefault(_formattedObservable);

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
  FormattedObservable: _formattedObservable2.default,
  formattedObservable: _formattedObservable.formattedObservable,
  observableFormatted: _formattedObservable.formattedObservable
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
exports.formattedObservable = exports.parseFormattedString = exports.toFormattedString = undefined;

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

var toFormattedString = exports.toFormattedString = function toFormattedString(format) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var result = format.slice();
  _underscore2.default.each(args, function (arg, index) {
    var value = _knockout2.default.utils.unwrapObservable(arg);
    if (_underscore2.default.isUndefined(value) || _underscore2.default.isNull(value)) value = '';

    var parameter_index = format.indexOf('{' + index + '}');
    while (~parameter_index) {
      result = result.replace('{' + index + '}', value);
      parameter_index = format.indexOf('{' + index + '}', parameter_index + 1);
    }
  });
  return result;
};

var parseFormattedString = exports.parseFormattedString = function parseFormattedString(string, format) {
  var regex_string = format.slice();var index = 0;var parameter_count = 0;var positions = {};
  while (regex_string.search('\\{' + index + '\\}') >= 0) {
    // store the positions of the replacements
    var parameter_index = format.indexOf('{' + index + '}');
    while (~parameter_index) {
      regex_string = regex_string.replace('{' + index + '}', '(.*)');
      positions[parameter_index] = index;parameter_count++;
      parameter_index = format.indexOf('{' + index + '}', parameter_index + 1);
    }
    index++;
  }
  var count = index;

  var regex = new RegExp(regex_string);
  var matches = regex.exec(string);
  if (matches) {
    matches.shift();
  }
  // return fake empty data
  if (!matches || matches.length !== parameter_count) {
    var result = [];
    while (count-- > 0) {
      result.push('');
    }
    return result;
  }

  // sort the matches since the parameters could be requested unordered
  var sorted_positions = _underscore2.default.sortBy(_underscore2.default.keys(positions), function (parameter_index) {
    return +parameter_index;
  });
  var format_indices_to_matched_indices = {};
  _underscore2.default.each(sorted_positions, function (parameter_index, match_index) {
    parameter_index = sorted_positions[match_index];
    index = positions[parameter_index];
    if (!(index in format_indices_to_matched_indices)) {
      format_indices_to_matched_indices[index] = match_index;
    }
  });

  var results = [];index = 0;
  while (index < count) {
    results.push(matches[format_indices_to_matched_indices[index]]);
    index++;
  }
  return results;
};

// Handles two-way formatted string convertions and will reformat a string when any argument changes. The format string can also be an observable.
//
// @example change the formatted name whenever a model's name attribute changes
//   var observable = kb.formattedObservable("{0} and {1}", arg1, arg2);

var FormattedObservable = function () {
  // Used to create a new kb.FormattedObservable.
  //
  // @param [String|ko.observable] format the format string.
  // Format: `"{0} and {1}"` where `{0}` and `{1}` would be synchronized with the arguments (eg. "Bob and Carol" where `{0}` is Bob and `{1}` is Carol)
  // @param [Array] args arguments to be passed to the kb.LocaleManager's get() method
  // @return [ko.observable] the constructor does not return 'this' but a ko.observable
  // @note the constructor does not return 'this' but a ko.observable
  function FormattedObservable(format) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    _classCallCheck(this, FormattedObservable);

    // being called by the factory function
    var observable_args = _underscore2.default.isArray(args[0]) ? args[0] : args;
    var observable = _core2.default.utils.wrappedObservable(this, _knockout2.default.computed({
      read: function read() {
        args = [_knockout2.default.utils.unwrapObservable(format)];
        _underscore2.default.each(observable_args, function (arg) {
          return args.push(_knockout2.default.utils.unwrapObservable(arg));
        });
        return toFormattedString.apply(null, args);
      },
      write: function write(value) {
        var matches = parseFormattedString(value, _knockout2.default.utils.unwrapObservable(format));
        var max_count = Math.min(observable_args.length, matches.length);var index = 0;
        while (index < max_count) {
          observable_args[index](matches[index]);
          index++;
        }
      }
    }));

    return observable;
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(FormattedObservable, [{
    key: 'destroy',
    value: function destroy() {
      return _core2.default.utils.wrappedDestroy(this);
    }
  }]);

  return FormattedObservable;
}();

exports.default = FormattedObservable;
var formattedObservable = exports.formattedObservable = function formattedObservable() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return new (Function.prototype.bind.apply(FormattedObservable, [null].concat(args)))();
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