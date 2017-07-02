(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("underscore"), require("backbone"), require("@knockback/core"));
	else if(typeof define === 'function' && define.amd)
		define(["underscore", "backbone", "@knockback/core"], factory);
	else if(typeof exports === 'object')
		exports["kba"] = factory(require("underscore"), require("backbone"), require("@knockback/core"));
	else
		root["kba"] = factory(root["_"], root["Backbone"], root["kb"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

var _backbone = __webpack_require__(2);

var _backbone2 = _interopRequireDefault(_backbone);

var _core = __webpack_require__(3);

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// @nodoc
module.exports = function () {
  function BackboneAssociations() {
    _classCallCheck(this, BackboneAssociations);
  }

  _createClass(BackboneAssociations, null, [{
    key: 'keys',
    value: function keys(model) {
      if (!_backbone2.default.AssociatedModel || !(model instanceof _backbone2.default.AssociatedModel)) return null;
      return _underscore2.default.map(model.relations, function (x) {
        return x.key;
      });
    }
  }, {
    key: 'relationType',
    value: function relationType(model, key) {
      if (!_backbone2.default.AssociatedModel || !(model instanceof _backbone2.default.AssociatedModel)) return null;
      var relation = _underscore2.default.find(model.relations, function (x) {
        return x.key === key;
      });
      if (!relation) return null;
      return relation.type === 'Many' ? _core2.default.TYPE_COLLECTION : _core2.default.TYPE_MODEL;
    }
  }]);

  return BackboneAssociations;
}();

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
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ })
/******/ ]);
});