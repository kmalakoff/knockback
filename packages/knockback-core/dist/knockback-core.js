(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("backbone"), require("knockout"), require("underscore"));
	else if(typeof define === 'function' && define.amd)
		define(["backbone", "knockout", "underscore"], factory);
	else if(typeof exports === 'object')
		exports["kb"] = factory(require("backbone"), require("knockout"), require("underscore"));
	else
		root["kb"] = factory(root["Backbone"], root["ko"], root["_"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_backbone__, __WEBPACK_EXTERNAL_MODULE_knockout__, __WEBPACK_EXTERNAL_MODULE_underscore__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./packages/knockback-core/src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if (!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./packages/knockback-core/src/collection-observable.js":
/*!**************************************************************!*\
  !*** ./packages/knockback-core/src/collection-observable.js ***!
  \**************************************************************/
/*! exports provided: compare, default, collectionObservable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compare", function() { return compare; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CollectionObservable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "collectionObservable", function() { return collectionObservable; });
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! knockout */ "knockout");
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _kb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./kb */ "./packages/knockback-core/src/kb.js");
function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/




var COMPARE_EQUAL = 0;
var COMPARE_ASCENDING = -1;
var COMPARE_DESCENDING = 1;
var KEYS_PUBLISH = ['destroy', 'shareOptions', 'filters', 'comparator', 'sortAttribute', 'viewModelByModel', 'hasViewModels'];
var compare = function compare(value_a, value_b) {
  // String compare
  if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isString(value_a)) {
    return value_a.localeCompare("".concat(value_b));
  }

  if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isString(value_b)) {
    return value_b.localeCompare("".concat(value_a));
  } // compare raw values


  return value_a === value_b ? COMPARE_EQUAL : value_a < value_b ? COMPARE_ASCENDING : COMPARE_DESCENDING;
}; // Base class for observing collections.
//
// @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
//   var collection = new Collection([{name: 'name1'}, {name: 'name2'}]);
//   var view_model = {
//     todos: kb.collectionObservable(collection)
//   };
//
// @example How to access and change the observed collection.
//    var todos = new kb.CollectionObservable(new Backbone.Collection([{name: 'name1'}, {name: 'name2'}]);
//    var current_collection = todos.collection(); // get
//    todos.collection(new Backbone.Collection([{name: 'name3'}, {name: 'name4'}])); // set
//
// @method .extend(prototype_properties, class_properties)
//   Class method for JavaScript inheritance.
//   @param [Object] prototype_properties the properties to add to the prototype
//   @param [Object] class_properties the properties to add to the class
//   @return [ko.observable] the constructor does not return 'this' but a ko.observableArray
//   @example
//     var MyCollectionObservable = kb.CollectionObservable.extend({
//        constructor: function(collection, options) {
//          // the constructor does not return 'this' but a ko.observableArray
//          return kb.CollectionObservable.prototype.constructor.call(this, collection, {
//            view_model: MyViewModel,
//            options: options
//        });
//     });
//
// @method #collection()
//   Dual-purpose getter/setter ko.computed for the observed collection.
//   @return [Collection|void] getter: the collection whose models are being observed (can be null) OR setter: void
//

var CollectionObservable =
/*#__PURE__*/
function () {
  // @nodoc
  // for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")
  // Used to create a new kb.CollectionObservable.
  //
  // When the observable is updated, the following Backbone.Events are triggered:
  //
  // * ***add***: (view_model, collection_observable) or if batch: (collection_observable)
  // * ***resort***: (view_model, collection_observable, new_index) or if batch: (collection_observable)
  // * ***remove***: (view_model, collection_observable) or if batch: (collection_observable)
  //
  // @param [Collection] collection the collection to observe (can be null)
  // @param [Object] options the create options
  // @option options [Boolean] models_only flag for skipping the creation of view models. The collection observable will be populated with (possibly sorted) models.
  // @option options [Boolean] auto_compact flag used to compact memory used by the collection observable when large changes occur, eg. resetting the collection.
  // @option options [Constructor] view_model the view model constructor used for models in the collection. Signature: constructor(model, options)
  // @option options [Function] create a function used to create a view model for models in the collection. Signature: create(model, options)
  // @option options [Object] factories a map of dot-deliminated paths;
  // for example 'models.owner': kb.ViewModel to either constructors or create functions. Signature: 'some.path': function(object, options)
  // @option options [Function] comparator a function that is used to sort an object.
  // Signature: `function(model_a, model_b)` returns negative value for ascending, 0 for equal, and positive for descending
  // @option options [String] sort_attribute the name of an attribute. Default: resort on all changes to a model.
  // @option options [Id|Function|Array] filters filters can be individual ids (observable or simple) or arrays of ids, functions, or arrays of functions.
  // @option options [String] path the path to the value (used to create related observables from the factory).
  // @option options [kb.Store] store a store used to cache and share view models.
  // @option options [kb.Factory] factory a factory used to create view models.
  // @option options [Object] options a set of options merge into these options. Useful for extending options when deriving classes rather than merging them by hand.
  // @return [ko.observableArray] the constructor does not return 'this' but a ko.observableArray
  // @note the constructor does not return 'this' but a ko.observableArray
  function CollectionObservable() {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _classCallCheck(this, CollectionObservable);

    _defineProperty(this, "_onCollectionChange", function (event, arg) {
      return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].ignore(function () {
        if (_this.in_edit || _kb__WEBPACK_IMPORTED_MODULE_3__["default"].wasReleased(_this)) return undefined; // we are doing the editing or have been released

        switch (event) {
          case 'reset':
            {
              _this.auto_compact ? _this.compact() : _this._collection.notifySubscribers(_this._collection());
              break;
            }

          case 'sort':
          case 'resort':
            {
              _this._collection.notifySubscribers(_this._collection());

              break;
            }

          case 'new':
          case 'add':
            {
              if (!_this._selectModel(arg)) return undefined; // filtered

              var observable = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedObservable(_this);

              var collection = _this._collection();

              if (!~collection.indexOf(arg)) return undefined; // the model may have been removed before we got a chance to add it

              var view_model = _this.viewModelByModel(arg);

              if (view_model) return undefined; // it may have already been added by a change event

              _this.in_edit++;

              var comparator = _this._comparator();

              if (comparator) {
                observable().push(_this._createViewModel(arg));
                observable.sort(comparator);
              } else {
                var vm = _this._createViewModel(arg);

                observable.splice(collection.indexOf(arg), 0, vm);
              }

              _this.in_edit--;
              break;
            }

          case 'remove':
          case 'destroy':
            {
              _this._onModelRemove(arg);

              break;
            }

          case 'change':
            {
              // filtered, remove
              if (!_this._selectModel(arg)) return _this._onModelRemove(arg);

              var _view_model = _this.models_only ? arg : _this.viewModelByModel(arg);

              if (!_view_model) return _this._onCollectionChange('add', arg); // add new

              var _comparator2 = _this._comparator();

              if (!_comparator2) return undefined;
              _this.in_edit++;
              _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedObservable(_this).sort(_comparator2);
              _this.in_edit--;
              break;
            }

          default:
            break;
        }

        return undefined;
      });
    });

    _defineProperty(this, "_onObservableArrayChange", function (models_or_view_models) {
      return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].ignore(function () {
        if (_this.in_edit) return; // we are doing the editing
        // validate input

        if (_this.models_only && models_or_view_models.length && !_kb__WEBPACK_IMPORTED_MODULE_3__["default"].isModel(models_or_view_models[0])) _kb__WEBPACK_IMPORTED_MODULE_3__["default"]._throwUnexpected(_this, 'incorrect type passed');
        if (!_this.models_only && models_or_view_models.length && !(underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isObject(models_or_view_models[0]) || _kb__WEBPACK_IMPORTED_MODULE_3__["default"].isModel(models_or_view_models[0]))) _kb__WEBPACK_IMPORTED_MODULE_3__["default"]._throwUnexpected(_this, 'incorrect type passed');
        var observable = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedObservable(_this);
        var collection = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].peek(_this._collection);
        var has_filters = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].peek(_this._filters).length;
        if (!collection) return; // no collection or we are updating ourselves

        var view_models = models_or_view_models; // set Models

        var models;

        if (_this.models_only) {
          models = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.filter(models_or_view_models, function (model) {
            return !has_filters || _this._selectModel(model);
          }); // set ViewModels
        } else {
          !has_filters || (view_models = []); // check for filtering of ViewModels

          models = [];

          underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(models_or_view_models, function (view_model) {
            var model = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedObject(view_model);

            if (has_filters) {
              if (!_this._selectModel(model)) return; // filtered so skip

              view_models.push(view_model);
            } // check for view models being different (will occur if a ko select selectedOptions is bound to this collection observable) -> update our store


            var current_view_model = _this.create_options.store.find(model, _this.create_options.creator);

            if (current_view_model && current_view_model.constructor !== view_model.constructor) _kb__WEBPACK_IMPORTED_MODULE_3__["default"]._throwUnexpected(_this, 'replacing different type of view model');

            _this.create_options.store.retain(view_model, model, _this.create_options.creator);

            models.push(model);
          });
        } // a change, update models


        _this.in_edit++;
        models_or_view_models.length === view_models.length || observable(view_models); // replace the ViewModels because they were filtered

        underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isEqual(collection.models, models) || collection.reset(models);
        _this.in_edit--;
      });
    });

    return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].ignore(function () {
      var collection = null;
      if (_kb__WEBPACK_IMPORTED_MODULE_3__["default"].isCollection(args[0])) collection = args.shift();else collection = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(args[0]) ? new backbone__WEBPACK_IMPORTED_MODULE_1___default.a.Collection(args.shift()) : new backbone__WEBPACK_IMPORTED_MODULE_1___default.a.Collection();
      if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isFunction(args[0])) args[0] = {
        view_model: args[0]
      };
      var options = {};

      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(args, function (arg) {
        _kb__WEBPACK_IMPORTED_MODULE_3__["default"].assign(options, arg);
        options = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.collapseOptions(options);
      });

      var observable = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedObservable(_this, knockout__WEBPACK_IMPORTED_MODULE_2___default.a.observableArray([]));
      observable.__kb_is_co = true; // mark as a kb.CollectionObservable

      _this.in_edit = 0; // bind callbacks

      if (!_this.__kb) _this.__kb = {}; // options

      options = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.collapseOptions(options);

      if (options.auto_compact) {
        _this.auto_compact = true;
      }

      if (options.sort_attribute) _this._comparator = knockout__WEBPACK_IMPORTED_MODULE_2___default.a.observable(_this._attributeComparator(options.sort_attribute));else _this._comparator = knockout__WEBPACK_IMPORTED_MODULE_2___default.a.observable(options.comparator);
      if (options.filters) _this._filters = knockout__WEBPACK_IMPORTED_MODULE_2___default.a.observableArray(underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(options.filters) ? options.filters : [options.filters]);else _this._filters = knockout__WEBPACK_IMPORTED_MODULE_2___default.a.observableArray([]); // create options

      _this.create_options = {
        store: _kb__WEBPACK_IMPORTED_MODULE_3__["default"].Store.useOptionsOrCreate(options, collection, observable)
      };
      var create_options = _this.create_options;
      _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedObject(observable, collection); // view model factory create factories

      _this.path = options.path;
      create_options.factory = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedFactory(observable, _this._shareOrCreateFactory(options));
      create_options.path = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.pathJoin(options.path, 'models'); // check for models only

      create_options.creator = create_options.factory.creatorForPath(null, create_options.path);

      if (create_options.creator) {
        _this.models_only = create_options.creator.models_only;
      } // publish public interface on the observable and return instead of this


      _kb__WEBPACK_IMPORTED_MODULE_3__["default"].publishMethods(observable, _this, KEYS_PUBLISH); // start the processing

      _this._collection = knockout__WEBPACK_IMPORTED_MODULE_2___default.a.observable(collection);
      _this.collection = knockout__WEBPACK_IMPORTED_MODULE_2___default.a.computed({
        read: function read() {
          return _this._collection();
        },
        write: function write(new_collection) {
          return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].ignore(function () {
            var previous_collection = _this._collection();

            if (previous_collection === new_collection) return undefined; // no change
            // @create_options.store.reuse(@, new_collection) # not meant to be shared

            _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedObject(observable, new_collection); // clean up

            if (previous_collection) previous_collection.unbind('all', _this._onCollectionChange); // store in _kb_collection so that a collection() function can be exposed on the observable and so the collection can be

            if (new_collection) new_collection.bind('all', _this._onCollectionChange); // update references (including notification)

            return _this._collection(new_collection);
          });
        }
      });
      observable.collection = _this.collection;
      if (collection) collection.bind('all', _this._onCollectionChange); // bind now
      // observable that will re-trigger when sort or filters or collection changes

      _this._mapper = knockout__WEBPACK_IMPORTED_MODULE_2___default.a.computed(function () {
        var comparator = _this._comparator(); // create dependency


        var filters = _this._filters(); // create dependency


        if (filters) underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(filters, function (filter) {
          return knockout__WEBPACK_IMPORTED_MODULE_2___default.a.utils.unwrapObservable(filter);
        }); // create a dependency

        var current_collection = _this._collection(); // create dependency


        if (_this.in_edit) return; // we are doing the editing
        // no models

        observable = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedObservable(_this);
        var models;
        if (current_collection) models = current_collection.models;
        var view_models;
        if (!models || current_collection.models.length === 0) view_models = []; // process filters, sorting, etc
        else {
            // apply filters
            models = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.filter(models, function (model) {
              return !filters.length || _this._selectModel(model);
            }); // apply sorting

            if (comparator) view_models = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.map(models, function (model) {
              return _this._createViewModel(model);
            }).sort(comparator); // no sorting
            else if (_this.models_only) view_models = filters.length ? models : models.slice(); // clone the array if it wasn't filtered
              else view_models = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.map(models, function (model) {
                  return _this._createViewModel(model);
                });
          } // update the observable array for this collection observable

        _this.in_edit++;
        observable(view_models);
        _this.in_edit--; // TODO: release previous
        // unless @models_only
        //   create_options.store.release(view_model) for view_model in previous_view_models
      }); // start subscribing

      observable.subscribe(underscore__WEBPACK_IMPORTED_MODULE_0___default.a.bind(_this._onObservableArrayChange, _this));
      if (_kb__WEBPACK_IMPORTED_MODULE_3__["default"].statistics) _kb__WEBPACK_IMPORTED_MODULE_3__["default"].statistics.register('CollectionObservable', _this); // collect memory management statistics

      return observable;
    });
  } // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(CollectionObservable, [{
    key: "destroy",
    value: function destroy() {
      this.__kb_released = true;
      var observable = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedObservable(this);
      var collection = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].peek(this._collection);
      _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedObject(observable, null);

      if (collection) {
        collection.unbind('all', this._onCollectionChange);
        var array = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].peek(observable);
        array.splice(0, array.length); // clear the view models or models
      }

      this.collection.dispose();
      this.collection = null;
      this._collection = null;
      observable.collection = null;

      this._mapper.dispose();

      this._mapper = null;
      _kb__WEBPACK_IMPORTED_MODULE_3__["default"].release(this._filters);
      this._filters = null;

      this._comparator(null);

      this._comparator = null;
      this.create_options = null;
      observable.collection = null;
      _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedDestroy(this);
      if (_kb__WEBPACK_IMPORTED_MODULE_3__["default"].statistics) _kb__WEBPACK_IMPORTED_MODULE_3__["default"].statistics.unregister('CollectionObservable', this); // collect memory management statistics
    } // Get the options for a new collection that can be used for sharing view models.
    //
    // @example Sharing view models for an HTML select element.
    //   var selected_collection = new Backbone.Collection();
    //   var available_collection = new Backbone.Collection([{name: 'Bob'}, {name: 'Fred'}]);
    //   var selected = kb.collectionObservable(available_collection);
    //   var available = kb.collectionObservable(available_collection, available_collection.shareOptions()); // view models shared with selected collection observable

  }, {
    key: "shareOptions",
    value: function shareOptions() {
      var observable = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedObservable(this);
      return {
        store: _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedStore(observable),
        factory: _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedFactory(observable)
      };
    } // Setter for the filters array for excluding models in the collection observable.
    //
    // @param [Id|Function|Array] filters filters can be individual ids (observable or simple) or arrays of ids, functions, or arrays of functions.
    //
    // @example
    //    // exclude a single model by id
    //    collection_observable.filters(model.id);

  }, {
    key: "filters",
    value: function filters(_filters) {
      if (_filters) {
        return this._filters(underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(_filters) ? _filters : [_filters]);
      }

      return this._filters([]);
    } // Setter for the sorted index function for auto-sorting the ViewModels or Models in a kb.CollectionObservable.
    //
    // @param [Function] comparator a function that returns an index where to insert the model. Signature: function(models, model)
    // @param [Function] comparator a function that is used to sort an object. Signature: `function(model_a, model_b)` returns negative value for ascending, 0 for equal, and positive for descending
    //
    // @example
    //    // change the sorting function
    //    collection_observable.comparator(
    //      function(view_models, vm){
    //        return _.comparator(view_models, vm, (test) -> kb.utils.wrappedModel(test).get('name'));
    //      }
    //    );

  }, {
    key: "comparator",
    value: function comparator(_comparator) {
      return this._comparator(_comparator);
    } // Setter for the sort attribute name for auto-sorting the ViewModels or Models in a kb.CollectionObservable.
    //
    // @param [String] sort_attribute the name of an attribute. Default: resort on all changes to a model.
    //
    // @example
    //    var todos = new kb.CollectionObservable(new Backbone.Collection([{name: 'Zanadu', name: 'Alex'}]));
    //    // in order of Zanadu then Alex
    //    todos.sortAttribute('name');
    //    // in order of Alex then Zanadu

  }, {
    key: "sortAttribute",
    value: function sortAttribute(sort_attribute) {
      return this._comparator(sort_attribute ? this._attributeComparator(sort_attribute) : null);
    } // Reverse lookup for a view model by model. If created with models_only option, will return null.

  }, {
    key: "viewModelByModel",
    value: function viewModelByModel(model) {
      if (this.models_only) return null;
      var id_attribute = Object.prototype.hasOwnProperty.call(model, model.idAttribute) ? model.idAttribute : 'cid';
      return underscore__WEBPACK_IMPORTED_MODULE_0___default.a.find(_kb__WEBPACK_IMPORTED_MODULE_3__["default"].peek(_kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedObservable(this)), function (test) {
        return test && test.__kb && test.__kb.object[id_attribute] === model[id_attribute];
      });
    } // Will return true unless created with models_only option.
    //
    // @example
    //   var todos1 = new kb.CollectionObservable(new Backbone.Collection(), {models_only: true});
    //   todos1.hasViewModels();     // false
    //   var todos2 = new kb.CollectionObservable(new Backbone.Collection());
    //   todos2.hasViewModels();     // true

  }, {
    key: "hasViewModels",
    value: function hasViewModels() {
      return !this.models_only;
    } // Compacts the Collection Observable to use the least amount of memory. Currently, this is brute force meaning it releases than regenerates all view models when called.
    //

  }, {
    key: "compact",
    value: function compact() {
      var _this2 = this;

      return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].ignore(function () {
        var observable = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedObservable(_this2);
        if (!_kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedStoreIsOwned(observable)) return undefined;
        _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedStore(observable).clear();
        return _this2._collection.notifySubscribers(_this2._collection());
      });
    } // ###################################################
    // Internal
    // ###################################################
    // @nodoc

  }, {
    key: "_shareOrCreateFactory",
    value: function _shareOrCreateFactory(options) {
      var absolute_models_path = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.pathJoin(options.path, 'models');
      var factories = options.factories; // check the existing factory

      var factory = options.factory;

      if (factory) {
        // models matches, check additional paths
        var existing_creator = factory.creatorForPath(null, absolute_models_path);

        if (existing_creator && (!factories || factories.models === existing_creator)) {
          if (!factories) return factory; // all match, share the factory
          // all match, share the factory

          if (factory.hasPathMappings(factories, options.path)) return factory;
        }
      } // need to create a new factory


      factory = new _kb__WEBPACK_IMPORTED_MODULE_3__["default"].Factory(options.factory);

      if (factories) {
        factory.addPathMappings(factories, options.path);
      } // set up the default create function


      if (!factory.creatorForPath(null, absolute_models_path)) {
        if (Object.prototype.hasOwnProperty.call(options, 'models_only')) {
          if (options.models_only) {
            factory.addPathMapping(absolute_models_path, {
              models_only: true
            });
          } else {
            factory.addPathMapping(absolute_models_path, _kb__WEBPACK_IMPORTED_MODULE_3__["default"].ViewModel);
          }
        } else if (options.view_model) {
          factory.addPathMapping(absolute_models_path, options.view_model);
        } else if (options.create) {
          factory.addPathMapping(absolute_models_path, {
            create: options.create
          });
        } else {
          factory.addPathMapping(absolute_models_path, _kb__WEBPACK_IMPORTED_MODULE_3__["default"].ViewModel);
        }
      }

      return factory;
    } // @nodoc

  }, {
    key: "_onModelRemove",
    // @nodoc
    value: function _onModelRemove(model) {
      var view_model = this.models_only ? model : this.viewModelByModel(model); // either remove a view model or a model

      if (!view_model) return undefined; // it may have already been removed

      var observable = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedObservable(this);
      this.in_edit++;
      observable.remove(view_model);
      return this.in_edit--;
    } // @nodoc

  }, {
    key: "_attributeComparator",
    // @nodoc
    value: function _attributeComparator(sort_attribute) {
      var modelAttributeCompare = function modelAttributeCompare(model_a, model_b) {
        var attribute_name = knockout__WEBPACK_IMPORTED_MODULE_2___default.a.utils.unwrapObservable(sort_attribute);
        return compare(model_a.get(attribute_name), model_b.get(attribute_name));
      };

      return this.models_only ? modelAttributeCompare : function (model_a, model_b) {
        return modelAttributeCompare(_kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedModel(model_a), _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedModel(model_b));
      };
    } // @nodoc

  }, {
    key: "_createViewModel",
    value: function _createViewModel(model) {
      if (this.models_only) return model;
      return this.create_options.store.retainOrCreate(model, this.create_options);
    } // @nodoc

  }, {
    key: "_selectModel",
    value: function _selectModel(model) {
      var filters = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].peek(this._filters);

      for (var i = 0, l = filters.length; i < l; i++) {
        var filter = filters[i];
        filter = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].peek(filter);

        if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isFunction(filter)) {
          if (!filter(model)) return false;
        } else if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(filter)) {
          if (!~filter.indexOf(model.id)) return false;
        } else if (model.id !== filter) return false;
      }

      return true;
    }
  }]);

  return CollectionObservable;
}(); // factory function


_defineProperty(CollectionObservable, "extend", backbone__WEBPACK_IMPORTED_MODULE_1___default.a.Model.extend);


var collectionObservable = function collectionObservable() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return _construct(CollectionObservable, args);
};

/***/ }),

/***/ "./packages/knockback-core/src/configure.js":
/*!**************************************************!*\
  !*** ./packages/knockback-core/src/configure.js ***!
  \**************************************************/
/*! exports provided: settings, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "settings", function() { return settings; });
/* harmony import */ var _kb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./kb */ "./packages/knockback-core/src/kb.js");
 // @nodoc

var settings = {
  orm: null
}; // @nodoc

/* harmony default export */ __webpack_exports__["default"] = (function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _kb__WEBPACK_IMPORTED_MODULE_0__["default"].assign(settings, options);
});

/***/ }),

/***/ "./packages/knockback-core/src/event-watcher.js":
/*!******************************************************!*\
  !*** ./packages/knockback-core/src/event-watcher.js ***!
  \******************************************************/
/*! exports provided: default, emitterObservable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EventWatcher; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "emitterObservable", function() { return emitterObservable; });
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! knockout */ "knockout");
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _kb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./kb */ "./packages/knockback-core/src/kb.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/



 // Used to provide a central place to aggregate registered Model events rather than having all kb.Observables register for updates independently.
//

var EventWatcher =
/*#__PURE__*/
function () {
  _createClass(EventWatcher, null, [{
    key: "useOptionsOrCreate",
    // Used to either register yourself with the existing emitter watcher or to create a new one.
    //
    // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(emitter, options)
    // @param [Model|ModelRef] obj the Model that will own or register with the store
    // @param [ko.observable|Object] emitter the emitters of the event watcher
    // @param [Object] callback_options information about the event and callback to register
    // @option options [Function] emitter callback for when the emitter changes (eg. is loaded). Signature: function(new_emitter)
    // @option options [Function] update callback for when the registered event is triggered. Signature: function(new_value)
    // @option options [String] event_selector the name or names of events.
    // @option options [String] key the optional key to filter update attribute events.
    value: function useOptionsOrCreate(options, emitter, obj, callback_options) {
      if (options.event_watcher) {
        if (options.event_watcher.emitter() !== emitter && options.event_watcher.model_ref !== emitter) {
          _kb__WEBPACK_IMPORTED_MODULE_3__["default"]._throwUnexpected(this, 'emitter not matching');
        }

        return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedEventWatcher(obj, options.event_watcher).registerCallbacks(obj, callback_options);
      }

      _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedEventWatcherIsOwned(obj, true);
      return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedEventWatcher(obj, new EventWatcher(emitter)).registerCallbacks(obj, callback_options);
    }
  }]);

  function EventWatcher(emitter, obj, callback_options) {
    var _this = this;

    _classCallCheck(this, EventWatcher);

    _defineProperty(this, "_onModelLoaded", function (model) {
      _this.ee = model;

      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(_this.__kb.callbacks, function (callbacks, event_name) {
        if (callbacks.model && callbacks.model !== model) _this._unbindCallbacks(event_name, callbacks, true);

        if (!callbacks.model) {
          callbacks.model = model;
          model.bind(event_name, callbacks.fn);
        }

        underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(callbacks.list, function (info) {
          if (!info.unbind_fn && _kb__WEBPACK_IMPORTED_MODULE_3__["default"].settings.orm && _kb__WEBPACK_IMPORTED_MODULE_3__["default"].settings.orm.customBind) {
            info.unbind_fn = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].settings.orm.customBind(model, info.key, info.update, info.path);
          }

          if (info.emitter) info.emitter(model);
        });
      });
    });

    _defineProperty(this, "_onModelUnloaded", function (model) {
      if (_this.ee !== model) return;
      _this.ee = null;

      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(_this.__kb.callbacks, function (callbacks, event_name) {
        return _this._unbindCallbacks(event_name, callbacks);
      });
    });

    _defineProperty(this, "_unbindCallbacks", function (event_name, callbacks, skip_emitter) {
      if (callbacks.model) {
        callbacks.model.unbind(event_name, callbacks.fn);
        callbacks.model = null;
      }

      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(callbacks.list, function (info) {
        if (info.unbind_fn) {
          info.unbind_fn(), info.unbind_fn = null;
        }

        if (info.emitter && !skip_emitter && !_kb__WEBPACK_IMPORTED_MODULE_3__["default"].wasReleased(info.obj)) {
          info.emitter(null);
        }
      });
    });

    if (!this.__kb) {
      this.__kb = {};
    }

    this.__kb.callbacks = {};
    this.ee = null;
    if (callback_options) this.registerCallbacks(obj, callback_options);
    if (emitter) this.emitter(emitter);
  } // Required clean up function to break cycles, release view emitters, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(EventWatcher, [{
    key: "destroy",
    value: function destroy() {
      this.emitter(null);
      this.__kb.callbacks = null;
      return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedDestroy(this);
    } // Dual-purpose getter/setter for the observed emitter.
    //
    // @overload emitter()
    //   Gets the emitter or emitter reference
    //   @return [Model|ModelRef] the emitter whose attributes are being observed (can be null)
    // @overload emitter(new_emitter)
    //   Sets the emitter or emitter reference
    //   @param [Model|ModelRef] new_emitter the emitter whose attributes will be observed (can be null)

  }, {
    key: "emitter",
    value: function emitter(new_emitter) {
      // get or no change
      if (arguments.length === 0 || this.ee === new_emitter) return this.ee; // clear and unbind previous

      if (this.model_ref) {
        this.model_ref.unbind('loaded', this._onModelLoaded);
        this.model_ref.unbind('unloaded', this._onModelUnloaded);
        this.model_ref.release();
        this.model_ref = null;
      } // set up current


      if (backbone__WEBPACK_IMPORTED_MODULE_1___default.a && backbone__WEBPACK_IMPORTED_MODULE_1___default.a.ModelRef && new_emitter instanceof backbone__WEBPACK_IMPORTED_MODULE_1___default.a.ModelRef) {
        this.model_ref = new_emitter;
        this.model_ref.retain();
        this.model_ref.bind('loaded', this._onModelLoaded);
        this.model_ref.bind('unloaded', this._onModelUnloaded);
        new_emitter = this.model_ref.model() || null;
      } else {
        delete this.model_ref;
      } // switch bindings


      if (this.ee !== new_emitter) {
        if (new_emitter) {
          this._onModelLoaded(new_emitter);
        } else {
          this._onModelUnloaded(this.ee);
        }
      }

      return new_emitter;
    } // Used to register callbacks for an emitter.
    //
    // @param [Object] obj the owning object.
    // @param [Object] callback_info the callback information
    // @option options [Function] emitter callback for when the emitter changes (eg. is loaded). Signature: function(new_emitter)
    // @option options [Function] update callback for when the registered emitter is triggered. Signature: function(new_value)
    // @option options [String] emitter_name the name of the emitter.
    // @option options [String] key the optional key to filter update attribute events.

  }, {
    key: "registerCallbacks",
    value: function registerCallbacks(obj, callback_info) {
      var _this2 = this;

      obj || _kb__WEBPACK_IMPORTED_MODULE_3__["default"]._throwMissing(this, 'obj');
      callback_info || _kb__WEBPACK_IMPORTED_MODULE_3__["default"]._throwMissing(this, 'callback_info');
      var event_names = callback_info.event_selector ? callback_info.event_selector.split(' ') : ['change'];
      var model = this.ee;

      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(event_names, function (event_name) {
        if (!event_name) return; // extra spaces

        var callbacks = _this2.__kb.callbacks[event_name];

        if (!callbacks) {
          _this2.__kb.callbacks[event_name] = {
            model: null,
            list: [],
            fn: function fn(m) {
              underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(callbacks.list, function (info) {
                if (!info.update) return;
                if (m && info.key && m.hasChanged && !m.hasChanged(knockout__WEBPACK_IMPORTED_MODULE_2___default.a.utils.unwrapObservable(info.key))) return; // key doesn't match

                if (_kb__WEBPACK_IMPORTED_MODULE_3__["default"].statistics) _kb__WEBPACK_IMPORTED_MODULE_3__["default"].statistics.addModelEvent({
                  name: event_name,
                  model: m,
                  key: info.key,
                  path: info.path
                });
                info.update();
              }); // trigger update

            }
          };
          callbacks = _this2.__kb.callbacks[event_name];
        }

        var info = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.defaults({
          obj: obj
        }, callback_info);

        callbacks.list.push(info); // store the callback information

        if (model) _this2._onModelLoaded(model);
      });

      return this;
    }
  }, {
    key: "releaseCallbacks",
    value: function releaseCallbacks(obj) {
      var _this3 = this;

      this.ee = null;

      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(this.__kb.callbacks, function (callbacks, event_name) {
        return _this3._unbindCallbacks(event_name, callbacks, _kb__WEBPACK_IMPORTED_MODULE_3__["default"].wasReleased(obj));
      });

      return delete this.__kb.callbacks;
    } // ###################################################
    // Internal
    // ###################################################
    // @nodoc
    // NOTE: this is called by registerCallbacks so the model could already be bound and we just want to bind the new info
    // NOTE: this is called by emitter so it may be used to clear a previous emitter without triggering an intermediate change

  }]);

  return EventWatcher;
}(); // factory function



var emitterObservable = function emitterObservable(emitter, observable) {
  return new EventWatcher(emitter, observable);
};

/***/ }),

/***/ "./packages/knockback-core/src/factory.js":
/*!************************************************!*\
  !*** ./packages/knockback-core/src/factory.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Factory; });
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _kb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./kb */ "./packages/knockback-core/src/kb.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

 // Used to share the hierachy of constructors and create functions by path to allow for custom creation per Model attribute.
//
// @example Create an instance by path.
//   var factory = new kb.Factory();
//   factory.addPathMapping('bob.the.builder', kb.ViewModel);
//   view_model = factory.createForPath(new Backbone.Model({name: 'Bob'}), 'bob.the.builder'); // creates kb.ViewModel

var Factory =
/*#__PURE__*/
function () {
  _createClass(Factory, null, [{
    key: "useOptionsOrCreate",
    // Used to either register yourself with the existing factory or to create a new factory.
    //
    // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
    // @option options [Object] factories a map of dot-deliminated paths;
    // for example 'models.owner': kb.ViewModel to either constructors or create functions. Signature: 'some.path': function(object, options)
    // @param [Instance] obj the instance that will own or register with the store
    // @param [String] owner_path the path to the owning object for turning relative scoping of the factories to absolute paths.
    value: function useOptionsOrCreate(options, obj, owner_path) {
      // share
      if (options.factory && (!options.factories || options.factories && options.factory.hasPathMappings(options.factories, owner_path))) {
        return _kb__WEBPACK_IMPORTED_MODULE_1__["default"].utils.wrappedFactory(obj, options.factory);
      } // create a new factory


      var factory = _kb__WEBPACK_IMPORTED_MODULE_1__["default"].utils.wrappedFactory(obj, new _kb__WEBPACK_IMPORTED_MODULE_1__["default"].Factory(options.factory));
      if (options.factories) factory.addPathMappings(options.factories, owner_path);
      return factory;
    }
  }]);

  function Factory(parent_factory) {
    _classCallCheck(this, Factory);

    this.paths = {};
    if (parent_factory) this.parent_factory = parent_factory;
  }

  _createClass(Factory, [{
    key: "hasPath",
    value: function hasPath(path) {
      return Object.prototype.hasOwnProperty.call(this.paths, path) && this.parent_factory ? this.parent_factory.hasPath(path) : false;
    }
  }, {
    key: "addPathMapping",
    value: function addPathMapping(path, create_info) {
      this.paths[path] = create_info;
    }
  }, {
    key: "addPathMappings",
    value: function addPathMappings(factories, owner_path) {
      var _this = this;

      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(factories, function (create_info, path) {
        _this.paths[_kb__WEBPACK_IMPORTED_MODULE_1__["default"].utils.pathJoin(owner_path, path)] = create_info;
      });
    }
  }, {
    key: "hasPathMappings",
    value: function hasPathMappings(factories, owner_path) {
      var all_exist = true;

      for (var path in factories) {
        if (Object.prototype.hasOwnProperty.call(factories, path)) {
          var creator = factories[path];
          var existing_creator = this.creatorForPath(null, _kb__WEBPACK_IMPORTED_MODULE_1__["default"].utils.pathJoin(owner_path, path));
          all_exist &= existing_creator && creator === existing_creator;
        }
      }

      return all_exist;
    } // If possible, creates an observable for an object using a dot-deliminated path.
    //
    // @example Create an instance by path.
    //   var factory = new kb.Factory();
    //   factory.addPathMapping('bob.the.builder', kb.ViewModel);
    //   view_model = factory.createForPath(new Backbone.Model({name: 'Bob'}), 'bob.the.builder'); // creates kb.ViewModel

  }, {
    key: "creatorForPath",
    value: function creatorForPath(obj, path) {
      var creator = this.paths[path];
      if (creator) return creator.view_model ? creator.view_model : creator;
      if (this.parent_factory) return this.parent_factory.creatorForPath(obj, path);
      return null;
    }
  }]);

  return Factory;
}();



/***/ }),

/***/ "./packages/knockback-core/src/functions/collapse-options.js":
/*!*******************************************************************!*\
  !*** ./packages/knockback-core/src/functions/collapse-options.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);
/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

var assign = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.assign || underscore__WEBPACK_IMPORTED_MODULE_0___default.a.extend; // @nodoc

var _mergeArray = function _mergeArray(result, key, value) {
  if (!result[key]) result[key] = [];
  if (!underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(value)) value = [value];
  result[key] = result[key].length ? underscore__WEBPACK_IMPORTED_MODULE_0___default.a.union(result[key], value) : value;
  return result;
}; // @nodoc


var _mergeObject = function _mergeObject(result, key, value) {
  if (!result[key]) result[key] = {};
  return assign(result[key], value);
}; // @nodoc


var _keyArrayToObject = function _keyArrayToObject(value) {
  var result = {};

  underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(value, function (item) {
    result[item] = {
      key: item
    };
  });

  return result;
};

var _mergeOptions = function _mergeOptions(result, options) {
  if (!options) return result;

  underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(options, function (value, key) {
    switch (key) {
      case 'internals':
      case 'requires':
      case 'excludes':
      case 'statics':
        _mergeArray(result, key, value);

        break;

      case 'keys':
        // an object
        if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isObject(value) && !underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(value) || underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isObject(result[key]) && !underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(result[key])) {
          if (!underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isObject(value)) {
            value = [value];
          }

          if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(value)) {
            value = _keyArrayToObject(value);
          }

          if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(result[key])) {
            result[key] = _keyArrayToObject(result[key]);
          }

          _mergeObject(result, key, value); // an array

        } else _mergeArray(result, key, value);

        break;

      case 'factories':
        if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isFunction(value)) result[key] = value;else _mergeObject(result, key, value);
        break;

      case 'static_defaults':
        _mergeObject(result, key, value);

        break;

      case 'options':
        break;

      default:
        result[key] = value;
        break;
    }
  });

  return _mergeOptions(result, options.options);
}; // @nodoc


/* harmony default export */ __webpack_exports__["default"] = (function (options) {
  return _mergeOptions({}, options);
});

/***/ }),

/***/ "./packages/knockback-core/src/functions/unwrap-models.js":
/*!****************************************************************!*\
  !*** ./packages/knockback-core/src/functions/unwrap-models.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);
/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
 // @nodoc

/* harmony default export */ __webpack_exports__["default"] = (function (obj) {
  if (!obj) return obj;
  if (obj.__kb) return Object.prototype.hasOwnProperty.call(obj.__kb, 'object') ? obj.__kb.object : obj;
  if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(obj)) return underscore__WEBPACK_IMPORTED_MODULE_0___default.a.map(obj, function (test) {
    return unwrapModels(test);
  });

  if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isObject(obj) && obj.constructor === {}.constructor) {
    // a simple object
    var result = {};

    underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(obj, function (value, key) {
      result[key] = unwrapModels(value);
    });

    return result;
  }

  return obj;
});

/***/ }),

/***/ "./packages/knockback-core/src/functions/wrapped-destroy.js":
/*!******************************************************************!*\
  !*** ./packages/knockback-core/src/functions/wrapped-destroy.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
// @nodoc
var wrappedDestroy = function wrappedDestroy(obj) {
  if (!obj.__kb) return;
  if (obj.__kb.event_watcher) obj.__kb.event_watcher.releaseCallbacks(obj);
  var __kb = obj.__kb;
  obj.__kb = null; // clear now to break cycles

  if (__kb.observable) {
    __kb.observable.destroy = null;
    __kb.observable.release = null;
    wrappedDestroy(__kb.observable);
    __kb.observable = null;
  }

  __kb.factory = null; // release the event_watcher

  if (__kb.event_watcher_is_owned) __kb.event_watcher.destroy();
  __kb.event_watcher = null; // release the store

  if (__kb.store_is_owned) __kb.store.destroy();
  __kb.store = null;

  if (__kb.stores_references) {
    var store_references = __kb.stores_references.pop();

    while (store_references) {
      if (!store_references.store.__kb_released) store_references.store.release(obj);
      store_references = __kb.stores_references.pop();
    }
  }
};

/* harmony default export */ __webpack_exports__["default"] = (wrappedDestroy);

/***/ }),

/***/ "./packages/knockback-core/src/index.js":
/*!**********************************************!*\
  !*** ./packages/knockback-core/src/index.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! knockout */ "knockout");
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _monkey_patches__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./monkey-patches */ "./packages/knockback-core/src/monkey-patches/index.js");
/* harmony import */ var _kb__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./kb */ "./packages/knockback-core/src/kb.js");
/* harmony import */ var _collection_observable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./collection-observable */ "./packages/knockback-core/src/collection-observable.js");
/* harmony import */ var _configure__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./configure */ "./packages/knockback-core/src/configure.js");
/* harmony import */ var _event_watcher__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./event-watcher */ "./packages/knockback-core/src/event-watcher.js");
/* harmony import */ var _factory__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./factory */ "./packages/knockback-core/src/factory.js");
/* harmony import */ var _inject__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./inject */ "./packages/knockback-core/src/inject.js");
/* harmony import */ var _observable__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./observable */ "./packages/knockback-core/src/observable.js");
/* harmony import */ var _statistics__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./statistics */ "./packages/knockback-core/src/statistics.js");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./store */ "./packages/knockback-core/src/store.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./utils */ "./packages/knockback-core/src/utils.js");
/* harmony import */ var _view_model__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./view-model */ "./packages/knockback-core/src/view-model.js");
/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/















var api = {
  _: underscore__WEBPACK_IMPORTED_MODULE_0___default.a,
  Backbone: backbone__WEBPACK_IMPORTED_MODULE_1___default.a,
  ko: knockout__WEBPACK_IMPORTED_MODULE_2___default.a,
  CollectionObservable: _collection_observable__WEBPACK_IMPORTED_MODULE_5__["default"],
  collectionObservable: _collection_observable__WEBPACK_IMPORTED_MODULE_5__["collectionObservable"],
  observableCollection: _collection_observable__WEBPACK_IMPORTED_MODULE_5__["collectionObservable"],
  compare: _collection_observable__WEBPACK_IMPORTED_MODULE_5__["compare"],
  configure: _configure__WEBPACK_IMPORTED_MODULE_6__["default"],
  settings: _configure__WEBPACK_IMPORTED_MODULE_6__["settings"],
  EventWatcher: _event_watcher__WEBPACK_IMPORTED_MODULE_7__["default"],
  Factory: _factory__WEBPACK_IMPORTED_MODULE_8__["default"],
  RECUSIVE_AUTO_INJECT: true,
  injectViewModels: _inject__WEBPACK_IMPORTED_MODULE_9__["injectViewModels"],
  Observable: _observable__WEBPACK_IMPORTED_MODULE_10__["default"],
  observable: _observable__WEBPACK_IMPORTED_MODULE_10__["observable"],
  Statistics: _statistics__WEBPACK_IMPORTED_MODULE_11__["default"],
  Store: _store__WEBPACK_IMPORTED_MODULE_12__["default"],
  utils: _utils__WEBPACK_IMPORTED_MODULE_13__["default"],
  ViewModel: _view_model__WEBPACK_IMPORTED_MODULE_14__["default"],
  viewModel: _view_model__WEBPACK_IMPORTED_MODULE_14__["viewModel"]
};
_kb__WEBPACK_IMPORTED_MODULE_4__["default"].assign(_kb__WEBPACK_IMPORTED_MODULE_4__["default"], api);
module.exports = _kb__WEBPACK_IMPORTED_MODULE_4__["default"];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./packages/knockback-core/src/inject.js":
/*!***********************************************!*\
  !*** ./packages/knockback-core/src/inject.js ***!
  \***********************************************/
/*! exports provided: injectViewModels */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "injectViewModels", function() { return injectViewModels; });
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! knockout */ "knockout");
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _kb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./kb */ "./packages/knockback-core/src/kb.js");
var _this = undefined;

/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/



var root = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : undefined; // custom Knockout `inject` binding

var inject = function inject(data, view_model, element, value_accessor, all_bindings_accessor, nested) {
  var doInject = function doInject(value) {
    if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isFunction(value)) {
      view_model = new value(view_model, element, value_accessor, all_bindings_accessor); // use 'new' to allow for classes in addition to functions

      _kb__WEBPACK_IMPORTED_MODULE_2__["default"].releaseOnNodeRemove(view_model, element);
    } else {
      // view_model constructor causes a scope change
      if (value.view_model) {
        // specifying a view_model changes the scope so we need to bind a destroy
        view_model = new value.view_model(view_model, element, value_accessor, all_bindings_accessor);
        _kb__WEBPACK_IMPORTED_MODULE_2__["default"].releaseOnNodeRemove(view_model, element);
      } // resolve and merge in each key


      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(value, function (item, key) {
        if (key === 'view_model') return; // create function

        if (key === 'create') item(view_model, element, value_accessor, all_bindings_accessor); // resolve nested with assign or not
        else if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isObject(item) && !underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isFunction(item)) {
            var target = nested || item && item.create ? {} : view_model;
            view_model[key] = inject(item, target, element, value_accessor, all_bindings_accessor, true); // simple set
          } else view_model[key] = item;
      });
    }

    return view_model;
  }; // in recursive calls, we are already protected from propagating dependencies to the template


  return nested ? doInject(data) : _kb__WEBPACK_IMPORTED_MODULE_2__["default"].ignore(function () {
    return doInject(data);
  });
};

knockout__WEBPACK_IMPORTED_MODULE_1___default.a.bindingHandlers.inject = {
  init: function init(element, value_accessor, all_bindings_accessor, view_model) {
    return inject(knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(value_accessor()), view_model, element, value_accessor, all_bindings_accessor);
  }
}; // Used to inject ViewModels and observables dynamically from your HTML Views. For both the `'kb-inject'` attribute and the data-bind `'inject'` custom binding, the following properties are reserved:
//
// * `'view_model'` class used to create a new ViewModel instance
// * `'create'` function used to manually add observables to a view model
// * `'options'` to pass to ko.applyBindings
// * `'afterBinding'` callback (can alternatively be in the options)
// * `'beforeBinding'` callback (can alternatively be in the options)
//
// Each function/constructor gets called with the following signature `'function(view_model, element)'`.
//
// @example Bind your application automatically when the DOM is loaded.
//   <div kb-inject><span data-bind="text: 'Hello World!'"></span></div>
// @example Bind your application with properties.
//   <div kb-inject="message: ko.observable('Hello World!')"><input data-bind="value: message"></input></div>
// @example Bind your application creating a specific ViewModel instance when the DOM is loaded.
//   <div kb-inject="MyViewModel"><input data-bind="value: message"></input></div>
//   var MyViewModel = function(view_model, el) {
//     this.message = ko.observable('Hello World!');
//   }
// @example Bind your application using a function when the DOM is loaded (like Angular.js controllers).
//   <div kb-inject="create: MyController"><input data-bind="value: message"></input></div>
//   var MyController = function(view_model, el) {
//     view_model.message = ko.observable('Hello World!');
//   }
// @example Bind your application with a specific ViewModel instance and a callback before and after the binding.
//   <div kb-inject="MyViewModel"><input data-bind="value: message"></input></div>
//   var MyViewModel = function(view_model, el) {
//     this.message = ko.observable('Hello World!');
//     this.beforeBinding = function() {alert('before'); };
//     this.afterBinding = function() {alert('after'); };
//   }
// @example Dynamically inject new properties into your ViewModel.
//   <div kb-inject="MyViewModel">
//     <div class="control-group" data-bind="inject: {site: ko.observable('http://your.url.com')}">
//       <label>Website</label>
//       <input type="url" name="site" data-bind="value: site, valueUpdate: 'keyup'" required>
//     </div>
//   </div>
//   var MyViewModel = function(view_model, el) {
//     // site will be dynamically attached to this ViewModel
//   }
// @example Dynamically bind a form.
//   <div kb-inject="MyViewModel">
//      <form name="my_form" data-bind="inject: kb.formValidator">
//        <div class="control-group">
//         <label>Name</label>
//         <input type="text" name="name" data-bind="value: name, valueUpdate: 'keyup'" required>
//       </div>
//       <div class="control-group">
//         <label>Website</label>
//         <input type="url" name="site" data-bind="value: site, valueUpdate: 'keyup'" required>
//       </div>
//     </form>
//   </div>
//   var MyViewModel = kb.ViewModel.extend({
//     constructor: ->
//       model = new Backbone.Model({name: '', site: 'http://your.url.com'});
//       kb.ViewModel.prototype.constructor.call(this, model);
//   });

var doBind = function doBind(app) {
  var options = {};
  var afterBinding = null;
  var beforeBinding = null; // evaluate the app data

  var expression = app.binding;

  if (expression) {
    !~expression.search(/[:]/) || (expression = "{".concat(expression, "}")); // wrap if is an object

    var data = new Function('', "return ( ".concat(expression, " )"))() || {};

    if (data.options) {
      options = data.options;
      delete data.options;
    }

    app.view_model = inject(data, app.view_model, app.el, null, null, true);
    afterBinding = app.view_model.afterBinding || options.afterBinding;
    beforeBinding = app.view_model.beforeBinding || options.beforeBinding;
  } // auto-bind


  if (beforeBinding) {
    beforeBinding.call(app.view_model, app.view_model, app.el, options);
  }

  _kb__WEBPACK_IMPORTED_MODULE_2__["default"].applyBindings(app.view_model, app.el, options);

  if (afterBinding) {
    afterBinding.call(app.view_model, app.view_model, app.el, options);
  }
}; // Searches the DOM from root or document for elements with the `'kb-inject'` attribute and create/customizes ViewModels for the DOM tree when encountered.
// Also, used with the data-bind `'inject'` custom binding.
// @param [DOM element] root the root DOM element to start searching for `'kb-inject'` attributes.
// @return [Array] array of Objects with the DOM elements and ViewModels that were bound in the form `{el: DOM element, view_model: ViewModel}`.


var injectViewModels = function injectViewModels() {
  var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : root.document;
  var results = [];

  if (!el.__kb_injected) {
    // already injected -> skip, but still process children in case they were added afterwards
    var attr = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.find(el.attributes || [], function (x) {
      return x.name === 'kb-inject';
    });

    if (attr) {
      el.__kb_injected = true; // mark injected

      var app = {
        el: el,
        view_model: {},
        binding: attr.value
      };
      doBind(app);
      results.push(app);
    }
  }

  underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(el.childNodes, function (child) {
    var childResults = injectViewModels(child);
    if (childResults.length) underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(childResults, function (x) {
      return results.push(x);
    });
  });

  return results;
}; // auto-inject recursively

var _ko_applyBindings = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.applyBindings;

knockout__WEBPACK_IMPORTED_MODULE_1___default.a.applyBindings = function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var el = args[1];
  var results = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].RECUSIVE_AUTO_INJECT ? injectViewModels(el) : [];
  return results.length ? results : _ko_applyBindings.call.apply(_ko_applyBindings, [_this].concat(args));
}; // ############################
// Auto Inject results
// ############################


if (root && typeof root.document !== 'undefined') {
  // use simple ready check
  var onReady = function onReady() {
    // keep waiting for the document to load
    if (root.document.readyState !== 'complete') return setTimeout(onReady, 0);
    return injectViewModels(); // the document is loaded
  };

  onReady();
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./packages/knockback-core/src/kb.js":
/*!*******************************************!*\
  !*** ./packages/knockback-core/src/kb.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return kb; });
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! knockout */ "knockout");
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_2__);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/



var root = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : undefined;
var LIFECYCLE_METHODS = ['release', 'destroy', 'dispose'];

var _ignore = function _ignore(callback, callbackTarget, callbackArgs) {
  var value = null;
  knockout__WEBPACK_IMPORTED_MODULE_2___default.a.computed(function () {
    value = callback.apply(callbackTarget, callbackArgs || []);
  }).dispose();
  return value;
}; // The 'kb' namespace for classes, factory functions, constants, etc.
//
// @method .configure(options)
//   Method to update Knockback global configuration.
//   @param [Object] configuration options.
// 1) orm - select the library for relationships (default, backbone-orm, backbone-associations, backbone-relational)
// 2) deep_retain - true to multiply retain view models in the store
//
// @method .collectionObservable(collection, options)
//   Factory to create a new kb.CollectionObservable. See {kb.CollectionObservable#constructor} for information on options
//   @param [Collection] collection the collection to observe (can be null)
//   @param [Object] options the create options
//   @return [ko.observableArray] the constructor does not return 'this' but a ko.observableArray
//
// @method .observable(model, options, view_model)
//   Factory to create a new kb.Observable. See {kb.Observable#constructor} for information on options
//   @param [Model] model the model to observe (can be null)
//   @param [String|Array|Object] options the create options. String is a single attribute name, Array is an array of attribute names.
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
//
// @method .viewModel(model, options, view_model)
//   Factory to create a new kb.ViewModel. See {kb.ViewModel#constructor} for information on options
//   @param [Model|ModelRef] model the model to observe (can be null)
//   @param [Object] options the create options
//   @return [ko.observable] the constructor returns 'this'
//
// @method .defaultObservable(target, default_value)
//   Factory to create a new kb.DefaultObservable. See {kb.DefaultObservable#constructor} for information on options.
//   If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-defaults component.
//   @param [ko.observable] target_observable the observable to check for null, undefined, or the empty string
//   @param [Any] default_value the default value. Can be a value, string or ko.observable
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
//
// @method .formattedObservable(format, arg1, arg2, etc)
//   Factory to create a new kb.FormattedObservable. See {kb.FormattedObservable#constructor} for information on options.
//   If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-formatting component.
//   @param [String|ko.observable] format the format string.
//   Format: `"{0} and {1}"` where `{0}` and `{1}` would be synchronized with the arguments (eg. "Bob and Carol" where `{0}` is Bob and `{1}` is Carol)
//   @param [Array] args arguments to be passed to the kb.LocaleManager's get() method
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
//
// @method .localizedObservable(value, options, view_model)
//   Factory to create a new kb.LocalizedObservable. See {kb.LocalizedObservable#constructor} for information on options.
//   If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-localization component.
//   @param [Data|ko.observable] value the value to localize
//   @param [Object] options the create options
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable


var kb =
/*#__PURE__*/
function () {
  function kb() {
    _classCallCheck(this, kb);
  }

  _createClass(kb, null, [{
    key: "wasReleased",
    // Knockback library semantic version
    // ###################################
    // OBSERVABLE STORAGE TYPES
    // ###################################
    // Stored value type is not known like null/undefined (could be observed as a Model or a Collection or a simple type)
    // Stored value type is simple like a String or Number -> observable type: ko.observable
    // Stored value type is an Array -> observable type: ko.observableArray
    // Stored value type is a Model -> observable type: ViewModel
    // Stored value type is a Collection -> observable type: kb.CollectionObservable
    // cache local reference to underscore
    // cache local reference to Knockout
    // Checks if an object has been released.
    // @param [Any] obj the object to release and also release its keys
    value: function wasReleased(obj) {
      return !obj || obj.__kb_released;
    } // Checks if an object can be released. Used to perform minimal nested releasing on objects by checking if self or next level contained items can be released.
    // @param [Any] obj the object to release and also release its keys

  }, {
    key: "isReleaseable",
    value: function isReleaseable(obj, depth) {
      if (depth == null) {
        depth = 0;
      }

      if (!obj || obj !== Object(obj) || obj.__kb_released) return false; // must be an object and not already released

      if (knockout__WEBPACK_IMPORTED_MODULE_2___default.a.isObservable(obj) || obj instanceof kb.ViewModel) return true; // a known type that is releasable

      if (typeof obj === 'function' || kb.isModel(obj) || kb.isCollection(obj)) return false; // a known type that is not releaseable

      for (var i = 0, l = LIFECYCLE_METHODS.length; i < l; i++) {
        var method = LIFECYCLE_METHODS[i];
        if (typeof obj[method] === 'function') return true;
      }

      if (depth > 0) return false; // max depth check for ViewModel inside of ViewModel

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var value = obj[key];
          if (key !== '__kb' && kb.isReleaseable(value, depth + 1)) return true;
        }
      }

      return false;
    } // Releases any type of view model or observable or items in an array using the conventions of release(), destroy(), dispose().
    // @param [Any] obj the object to release and also release its keys
    //
    // @example
    //   var view_model = kb.viewModel(model);
    //   kb.release(view_model); view_model = null;
    // @example
    //   var todos = kb.collectionObservable(collection);
    //   kb.release(todos); todos = null;

  }, {
    key: "release",
    value: function release(obj) {
      if (!kb.isReleaseable(obj)) return;
      obj.__kb_released = true; // mark as released
      // release array's items

      if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(obj)) {
        underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(obj, function (value, index) {
          if (kb.isReleaseable(value)) {
            obj[index] = null;
            kb.release(value);
          }
        });

        return;
      } // observable or lifecycle managed


      var array = kb.peek(obj);

      if (knockout__WEBPACK_IMPORTED_MODULE_2___default.a.isObservable(obj) && underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(array)) {
        if (obj.__kb_is_co || obj.__kb_is_o && obj.valueType() === kb.TYPE_COLLECTION) {
          if (typeof obj.destroy === 'function') obj.destroy();
          return;
        }

        underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(array, function (value, index) {
          if (kb.isReleaseable(value)) {
            array[index] = null;
            kb.release(value);
          }
        });

        if (typeof obj.dispose === 'function') {
          obj.dispose();
        }

        return;
      } // releaseable signature


      for (var i = 0, l = LIFECYCLE_METHODS.length; i < l; i++) {
        var method = LIFECYCLE_METHODS[i];

        if (typeof obj[method] === 'function') {
          obj[method].call(obj);
          return;
        }
      }

      if (!knockout__WEBPACK_IMPORTED_MODULE_2___default.a.isObservable(obj)) this.releaseKeys(obj); // view model
    } // Releases and clears all of the keys on an object using the conventions of release(), destroy(), dispose() without releasing the top level object itself.

  }, {
    key: "releaseKeys",
    value: function releaseKeys(obj) {
      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(obj, function (value, key) {
        if (key !== '__kb' && kb.isReleaseable(value)) {
          obj[key] = null;
          kb.release(value);
        }
      });
    } // Binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
    // ```
    // ko.utils.domNodeDisposal.addDisposeCallback(node, function() { kb.release(view_model)} );
    // ```
    // @example The hard way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
    //   var el = $('<div data-bind="name: name"></div>')[0];
    //   var view_model = kb.viewModel(new Backbone.Model({name: 'Bob'}));
    //   ko.applyBindings(view_model, el);
    //   kb.releaseOnNodeRemove(view_model, el);
    //   ...
    //   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)

  }, {
    key: "releaseOnNodeRemove",
    value: function releaseOnNodeRemove(view_model, node) {
      view_model || kb._throwUnexpected(this, 'missing view model');
      node || kb._throwUnexpected(this, 'missing node');
      return knockout__WEBPACK_IMPORTED_MODULE_2___default.a.utils.domNodeDisposal.addDisposeCallback(node, function () {
        return kb.release(view_model);
      });
    } // Renders a template and binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
    //
    // NOTE: if you provide an afterRender method on the View Model and do not provide afterRender in the options,
    // afterRender will be called with the following signature: afterRender(element) which differs from the Knockout signture of afterRender(elements)
    //
    // @example The easy way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
    //   var el = kb.renderTemplate('my_template', kb.viewModel(new Backbone.Model({name: 'Bob'})));
    //   ...
    //   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)

  }, {
    key: "renderTemplate",
    value: function renderTemplate(template, view_model) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!root.document) {
        typeof console === 'undefined' || console.log('renderTemplate: document is undefined');
        return undefined;
      }

      var el = root.document.createElement('div');
      var observable = knockout__WEBPACK_IMPORTED_MODULE_2___default.a.renderTemplate(template, view_model, options, el, 'replaceChildren'); // do not return the template wrapper if possible

      if (el.childNodes.length === 1) el = el.childNodes[0];else if (el.childNodes.length) {
        for (var i = 0, end = el.childNodes.length, asc = end >= 0; asc ? i <= end : i >= end; asc ? i++ : i--) {
          // ensure the context is passed up to wrapper from a child
          try {
            knockout__WEBPACK_IMPORTED_MODULE_2___default.a.storedBindingContextForNode(el, knockout__WEBPACK_IMPORTED_MODULE_2___default.a.contextFor(el.childNodes[i]));
            break;
          } catch (err) {
            /**/
          }
        }
      }
      kb.releaseOnNodeRemove(view_model, el);
      observable.dispose(); // we will handle memory management with ko.removeNode (otherwise creates memory leak on default bound dispose function)

      if (view_model.afterRender && !options.afterRender) view_model.afterRender(el); // call afterRender for custom setup unless provided in options (so doesn't get double called)

      return el;
    } // Applies bindings and binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
    //
    // @example The easy way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
    //   var el = $('<div data-bind="name: name"></div>')[0];
    //   kb.applyBindings(kb.viewModel(new Backbone.Model({name: 'Bob'})), el);
    //   ...
    //   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)

  }, {
    key: "applyBindings",
    value: function applyBindings(view_model, node) {
      if (!root.document) {
        typeof console === 'undefined' || console.log('renderTemplate: document is undefined');
        return undefined;
      }

      if (node.length) {
        // convert to a root element
        var children = node;
        node = root.document.createElement('div');

        underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(children, function (child) {
          return node.appendChild(child);
        });
      }

      knockout__WEBPACK_IMPORTED_MODULE_2___default.a.applyBindings(view_model, node);
      kb.releaseOnNodeRemove(view_model, node);
      return node;
    }
  }, {
    key: "getValue",
    value: function getValue(model, key, args) {
      if (!model) return undefined;
      if (!args) return model.get(key);
      return model.get.apply(model, _toConsumableArray(underscore__WEBPACK_IMPORTED_MODULE_0___default.a.map([key].concat(args), function (value) {
        return kb.peek(value);
      })));
    }
  }, {
    key: "setValue",
    value: function setValue(model, key, value) {
      var attributes;
      if (!model) return undefined;
      (attributes = {})[key] = value;
      return model.set(attributes);
    } // ###################################
    // INTERNAL HELPERS
    // ###################################
    // @nodoc

  }, {
    key: "_throwMissing",
    value: function _throwMissing(instance, message) {
      throw new Error("".concat(underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isString(instance) ? instance : instance.constructor.name, ": ").concat(message, " is missing"));
    } // @nodoc

  }, {
    key: "_throwUnexpected",
    value: function _throwUnexpected(instance, message) {
      throw new Error("".concat(underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isString(instance) ? instance : instance.constructor.name, ": ").concat(message, " is unexpected"));
    } // @nodoc

  }, {
    key: "publishMethods",
    value: function publishMethods(observable, instance, methods) {
      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(methods, function (fn) {
        observable[fn] = kb._.bind(instance[fn], instance);
      });
    } // @nodoc

  }, {
    key: "peek",
    value: function peek(obs) {
      if (!knockout__WEBPACK_IMPORTED_MODULE_2___default.a.isObservable(obs)) return obs;
      if (obs.peek) return obs.peek();
      return kb.ignore(function () {
        return obs();
      });
    } // @nodoc

  }, {
    key: "isModel",
    value: function isModel(obj) {
      return obj && (obj instanceof backbone__WEBPACK_IMPORTED_MODULE_1___default.a.Model || typeof obj.get === 'function' && typeof obj.bind === 'function');
    } // @nodoc

  }, {
    key: "isCollection",
    value: function isCollection(obj) {
      return obj && obj instanceof backbone__WEBPACK_IMPORTED_MODULE_1___default.a.Collection;
    }
  }]);

  return kb;
}();

_defineProperty(kb, "VERSION", '2.0.0-alpha.1');

_defineProperty(kb, "TYPE_UNKNOWN", 0);

_defineProperty(kb, "TYPE_SIMPLE", 1);

_defineProperty(kb, "TYPE_ARRAY", 2);

_defineProperty(kb, "TYPE_MODEL", 3);

_defineProperty(kb, "TYPE_COLLECTION", 4);

_defineProperty(kb, "assign", underscore__WEBPACK_IMPORTED_MODULE_0___default.a.assign || underscore__WEBPACK_IMPORTED_MODULE_0___default.a.extend);

_defineProperty(kb, "ignore", knockout__WEBPACK_IMPORTED_MODULE_2___default.a.dependencyDetection && knockout__WEBPACK_IMPORTED_MODULE_2___default.a.dependencyDetection.ignore ? knockout__WEBPACK_IMPORTED_MODULE_2___default.a.dependencyDetection.ignore : _ignore);


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./packages/knockback-core/src/lib/typed-value.js":
/*!********************************************************!*\
  !*** ./packages/knockback-core/src/lib/typed-value.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TypedValue; });
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! knockout */ "knockout");
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _kb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../kb */ "./packages/knockback-core/src/kb.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/


 // @nodoc

var TypedValue =
/*#__PURE__*/
function () {
  function TypedValue(create_options) {
    _classCallCheck(this, TypedValue);

    this.create_options = create_options;
    this._vo = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.observable(null); // create a value observable for the first dependency
  }

  _createClass(TypedValue, [{
    key: "destroy",
    value: function destroy() {
      this.__kb_released = true;
      var previous_value = this.__kb_value;

      if (previous_value) {
        this.__kb_value = null;

        if (this.create_options.store && _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedCreator(previous_value)) {
          this.create_options.store.release(previous_value);
        } else _kb__WEBPACK_IMPORTED_MODULE_2__["default"].release(previous_value);
      }

      this.create_options = null;
    }
  }, {
    key: "value",
    value: function value() {
      return knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(this._vo());
    }
  }, {
    key: "rawValue",
    value: function rawValue() {
      return this.__kb_value;
    }
  }, {
    key: "valueType",
    value: function valueType(model, key) {
      var new_value = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].getValue(model, key);
      this.value_type || this._updateValueObservable(new_value); // create so we can check the type

      return this.value_type;
    }
  }, {
    key: "update",
    value: function update(new_value) {
      if (this.__kb_released) return undefined; // destroyed, nothing to do
      // determine the new type

      new_value !== undefined || (new_value = null); // ensure null instead of undefined

      var new_type = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.valueType(new_value);

      if (this.__kb_value && this.__kb_value.__kb_released) {
        this.__kb_value = undefined;
        this.value_type = undefined;
      }

      var value = this.__kb_value;

      switch (this.value_type) {
        case _kb__WEBPACK_IMPORTED_MODULE_2__["default"].TYPE_COLLECTION:
          if (this.value_type === _kb__WEBPACK_IMPORTED_MODULE_2__["default"].TYPE_COLLECTION && new_type === _kb__WEBPACK_IMPORTED_MODULE_2__["default"].TYPE_ARRAY) return value(new_value);

          if (new_type === _kb__WEBPACK_IMPORTED_MODULE_2__["default"].TYPE_COLLECTION || underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isNull(new_value)) {
            // use the provided CollectionObservable
            if (new_value && new_value instanceof _kb__WEBPACK_IMPORTED_MODULE_2__["default"].CollectionObservable) this._updateValueObservable(_kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedObject(new_value), new_value);else if (_kb__WEBPACK_IMPORTED_MODULE_2__["default"].peek(value.collection) !== new_value) value.collection(new_value); // collection observables are allocated once

            return undefined;
          }

          break;

        case _kb__WEBPACK_IMPORTED_MODULE_2__["default"].TYPE_MODEL:
          if (new_type === _kb__WEBPACK_IMPORTED_MODULE_2__["default"].TYPE_MODEL || underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isNull(new_value)) {
            // use the provided ViewModel
            if (new_value && !_kb__WEBPACK_IMPORTED_MODULE_2__["default"].isModel(new_value)) this._updateValueObservable(_kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedObject(new_value), new_value);else if (_kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedObject(value) !== _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.resolveModel(new_value)) this._updateValueObservable(new_value);
            return undefined;
          }

          break;

        default:
          break;
      }

      if (this.value_type === new_type && !underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isUndefined(this.value_type)) {
        if (_kb__WEBPACK_IMPORTED_MODULE_2__["default"].peek(value) !== new_value) return value(new_value);
      } else if (_kb__WEBPACK_IMPORTED_MODULE_2__["default"].peek(value) !== new_value) return this._updateValueObservable(new_value);

      return undefined;
    }
  }, {
    key: "_updateValueObservable",
    value: function _updateValueObservable(new_value, new_observable) {
      var create_options = this.create_options;
      var creator = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.inferCreator(new_value, create_options.factory, create_options.path); // retain previous type

      if (new_value === null && !creator) {
        if (this.value_type === _kb__WEBPACK_IMPORTED_MODULE_2__["default"].TYPE_MODEL) creator = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].ViewModel;else if (this.value_type === _kb__WEBPACK_IMPORTED_MODULE_2__["default"].TYPE_COLLECTION) creator = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].CollectionObservable;
      }

      create_options.creator = creator;
      var value_type = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].TYPE_UNKNOWN;
      var previous_value = this.__kb_value;
      this.__kb_value = undefined;
      var value;

      if (new_observable) {
        value = new_observable;
        if (create_options.store) create_options.store.retain(new_observable, new_value, creator); // found a creator
      } else if (creator) {
        // have the store, use it to create
        if (create_options.store) value = create_options.store.retainOrCreate(new_value, create_options, true); // create manually
        else if (creator.models_only) {
            value = new_value;
            value_type = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].TYPE_SIMPLE;
          } else if (creator.create) value = creator.create(new_value, create_options);else value = new creator(new_value, create_options); // create and cache the type
      } else if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(new_value)) {
        value_type = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].TYPE_ARRAY;
        value = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.observableArray(new_value);
      } else {
        value_type = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].TYPE_SIMPLE;
        value = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.observable(new_value);
      } // determine the type


      this.value_type = value_type;

      if (value_type === _kb__WEBPACK_IMPORTED_MODULE_2__["default"].TYPE_UNKNOWN) {
        // a view model, recognize view_models as non-observable
        if (!knockout__WEBPACK_IMPORTED_MODULE_1___default.a.isObservable(value)) {
          this.value_type = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].TYPE_MODEL;
          _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedObject(value, _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.resolveModel(new_value));
        } else if (value.__kb_is_co) {
          this.value_type = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].TYPE_COLLECTION;
          _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedObject(value, new_value);
        } else if (!this.value_type) this.value_type = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].TYPE_SIMPLE;
      } // release previous


      if (previous_value) {
        this.create_options.store ? this.create_options.store.release(previous_value) : _kb__WEBPACK_IMPORTED_MODULE_2__["default"].release(previous_value);
      } // store the value


      this.__kb_value = value;
      return this._vo(value);
    }
  }]);

  return TypedValue;
}();



/***/ }),

/***/ "./packages/knockback-core/src/monkey-patches/index.js":
/*!*************************************************************!*\
  !*** ./packages/knockback-core/src/monkey-patches/index.js ***!
  \*************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! knockout */ "knockout");
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _kb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../kb */ "./packages/knockback-core/src/kb.js");
/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

 // Allow for dependent release until is resolved https://github.com/knockout/knockout/issues/1464

if (knockout__WEBPACK_IMPORTED_MODULE_0___default.a.subscribable && knockout__WEBPACK_IMPORTED_MODULE_0___default.a.subscribable.fn && knockout__WEBPACK_IMPORTED_MODULE_0___default.a.subscribable.fn.extend) {
  var _extend = knockout__WEBPACK_IMPORTED_MODULE_0___default.a.subscribable.fn.extend;

  knockout__WEBPACK_IMPORTED_MODULE_0___default.a.subscribable.fn.extend = function () {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var target = _extend.apply(this, args); // release the extended observable


    if (target !== this && _kb__WEBPACK_IMPORTED_MODULE_1__["default"].isReleaseable(this)) {
      var _dispose = target.dispose;

      target.dispose = function () {
        for (var _len2 = arguments.length, args2 = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args2[_key2] = arguments[_key2];
        }

        !_dispose || _dispose.apply(target, args2);
        return _kb__WEBPACK_IMPORTED_MODULE_1__["default"].release(_this);
      };
    }

    return target;
  };
}

/***/ }),

/***/ "./packages/knockback-core/src/observable.js":
/*!***************************************************!*\
  !*** ./packages/knockback-core/src/observable.js ***!
  \***************************************************/
/*! exports provided: default, observable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Observable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "observable", function() { return observable; });
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! knockout */ "knockout");
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _kb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./kb */ "./packages/knockback-core/src/kb.js");
/* harmony import */ var _lib_typed_value__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/typed-value */ "./packages/knockback-core/src/lib/typed-value.js");
/* harmony import */ var _event_watcher__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./event-watcher */ "./packages/knockback-core/src/event-watcher.js");
function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/





var KEYS_PUBLISH = ['value', 'valueType', 'destroy'];
var KEYS_INFO = ['args', 'read', 'write']; // Base class for observing model attributes.
//
// @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
//   var ContactViewModel = function(model) {
//     this.name = kb.observable(model, 'name');
//     this.number = kb.observable(model, { key: 'number'});
//   };
//   var model = new Contact({ name: 'Ringo', number: '555-555-5556' });
//   var view_model = new ContactViewModel(model);
//
// @example How to create a kb.Observable with a default value.
//   var model = Backbone.Model({name: 'Bob'});
//   var name = kb.observable(model, {key:'name', default: '(none)'}); // name is Bob
//   name.setToDefault(); // name is (none)
//
// @method #model()
//   Dual-purpose getter/setter ko.computed for the observed model.
//   @return [Model|ModelRef|void] getter: the model whose attributes are being observed (can be null) OR setter: void
//   @example
//     var observable = kb.observable(new Backbone.Model({name: 'bob'}), 'name');
//     var the_model = observable.model(); // get
//     observable.model(new Backbone.Model({name: 'fred'})); // set
//

var Observable =
/*#__PURE__*/
function () {
  // Used to create a new kb.Observable.
  //
  // @param [Model] model the model to observe (can be null)
  // @param [String|Array|Object] options the create options. String is a single attribute name, Array is an array of attribute names.
  // @option options [String] key the name of the attribute.
  // @option options [Function] read a function used to provide transform the attribute value before passing it to the caller. Signature: read()
  // @option options [Function] write a function used to provide transform the value before passing it to the model set function. Signature: write(value)
  // @option options [Array] args arguments to pass to the read and write functions (they can be ko.observables). Can be useful for passing arguments to a locale manager.
  // @option options [Constructor] localizer a concrete kb.LocalizedObservable constructor for localization.
  // @option options [Data|ko.observable] default the default value. Can be a value, string or ko.observable.
  // @option options [String] path the path to the value (used to create related observables from the factory).
  // @option options [kb.Store] store a store used to cache and share view models.
  // @option options [kb.Factory] factory a factory used to create view models.
  // @option options [Object] options a set of options merge into these options. Useful for extending options when deriving classes rather than merging them by hand.
  // @return [ko.observable] the constructor does not return 'this' but a ko.observable
  // @note the constructor does not return 'this' but a ko.observable
  function Observable(model, key_or_info, options, _vm) {
    var _this = this;

    _classCallCheck(this, Observable);

    if (_vm == null) {
      _vm = {};
    }

    this._vm = _vm;
    return _kb__WEBPACK_IMPORTED_MODULE_2__["default"].ignore(function () {
      key_or_info || _kb__WEBPACK_IMPORTED_MODULE_2__["default"]._throwMissing(_this, 'key_or_info');
      _this.key = key_or_info.key || key_or_info;

      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.map(KEYS_INFO, function (key) {
        if (key_or_info[key]) {
          _this[key] = key_or_info[key];
        }
      });

      var create_options = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.collapseOptions(options);
      var event_watcher = create_options.event_watcher;
      delete create_options.event_watcher; // set up basics

      _this._value = new _lib_typed_value__WEBPACK_IMPORTED_MODULE_3__["default"](create_options);
      _this._model = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.observable();
      var observable = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedObservable(_this, knockout__WEBPACK_IMPORTED_MODULE_1___default.a.computed({
        read: function read() {
          var m = _this._model();

          var args = [_this.key].concat(_this.args || []);

          underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(args, function (arg) {
            return knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(arg);
          });

          var ew = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedEventWatcher(_this);
          !ew || ew.emitter(m || null);

          if (_this.read) {
            _this.update(_this.read.apply(_this._vm, args));
          } else if (!underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isUndefined(m)) {
            _kb__WEBPACK_IMPORTED_MODULE_2__["default"].ignore(function () {
              return _this.update(_kb__WEBPACK_IMPORTED_MODULE_2__["default"].getValue(m, _kb__WEBPACK_IMPORTED_MODULE_2__["default"].peek(_this.key), _this.args));
            });
          }

          return _this._value.value();
        },
        write: function write(new_value) {
          return _kb__WEBPACK_IMPORTED_MODULE_2__["default"].ignore(function () {
            var unwrapped_new_value = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.unwrapModels(new_value); // unwrap for set (knockout may pass view models which are required for the observable but not the model)

            var m = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].peek(_this._model);

            if (_this.write) {
              _this.write.call(_this._vm, unwrapped_new_value);

              new_value = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].getValue(m, _kb__WEBPACK_IMPORTED_MODULE_2__["default"].peek(_this.key), _this.args);
            } else if (m) {
              _kb__WEBPACK_IMPORTED_MODULE_2__["default"].setValue(m, _kb__WEBPACK_IMPORTED_MODULE_2__["default"].peek(_this.key), unwrapped_new_value);
            }

            return _this.update(new_value);
          });
        },
        owner: _this._vm
      }));
      observable.__kb_is_o = true; // mark as a kb.Observable

      create_options.store = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedStore(observable, create_options.store);
      create_options.path = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.pathJoin(create_options.path, _this.key);

      if (create_options.factories && (typeof create_options.factories === 'function' || create_options.factories.create)) {
        create_options.factory = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedFactory(observable, new _kb__WEBPACK_IMPORTED_MODULE_2__["default"].Factory(create_options.factory));
        create_options.factory.addPathMapping(create_options.path, create_options.factories);
      } else create_options.factory = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].Factory.useOptionsOrCreate(create_options, observable, create_options.path);

      delete create_options.factories; // publish public interface on the observable and return instead of this

      _kb__WEBPACK_IMPORTED_MODULE_2__["default"].publishMethods(observable, _this, KEYS_PUBLISH); // use external model observable or create

      _this.model = knockout__WEBPACK_IMPORTED_MODULE_1___default.a.computed({
        read: function read() {
          return knockout__WEBPACK_IMPORTED_MODULE_1___default.a.utils.unwrapObservable(_this._model);
        },
        write: function write(new_model) {
          return _kb__WEBPACK_IMPORTED_MODULE_2__["default"].ignore(function () {
            if (_this.__kb_released || _kb__WEBPACK_IMPORTED_MODULE_2__["default"].peek(_this._model) === new_model) return undefined; // destroyed or no change
            // update references

            var new_value = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].getValue(new_model, _kb__WEBPACK_IMPORTED_MODULE_2__["default"].peek(_this.key), _this.args);

            _this._model(new_model);

            if (!new_model) {
              return _this.update(null);
            } else if (!underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isUndefined(new_value)) {
              return _this.update(new_value);
            }

            return undefined;
          });
        }
      });
      observable.model = _this.model;
      _event_watcher__WEBPACK_IMPORTED_MODULE_4__["default"].useOptionsOrCreate({
        event_watcher: event_watcher
      }, model || null, _this, {
        emitter: _this.model,
        update: function update() {
          return _kb__WEBPACK_IMPORTED_MODULE_2__["default"].ignore(function () {
            return _this.update();
          });
        },
        key: _this.key,
        path: create_options.path
      });
      _this._value.rawValue() || _this._value.update(); // wasn't loaded so create
      // wrap ourselves with a localizer

      if (_kb__WEBPACK_IMPORTED_MODULE_2__["default"].LocalizedObservable && key_or_info.localizer) observable = new key_or_info.localizer(observable); // wrap ourselves with a default value

      if (_kb__WEBPACK_IMPORTED_MODULE_2__["default"].DefaultObservable && Object.prototype.hasOwnProperty.call(key_or_info, 'default')) observable = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].defaultObservable(observable, key_or_info["default"]);
      return observable;
    });
  } // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(Observable, [{
    key: "destroy",
    value: function destroy() {
      var observable = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedObservable(this);
      this.__kb_released = true;

      this._value.destroy();

      this._value = null;
      this.model.dispose();
      this.model = null;
      observable.model = null;
      return _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedDestroy(this);
    } // @return [kb.CollectionObservable|kb.ViewModel|ko.observable] exposes the raw value inside the kb.observable.
    // For example, if your attribute is a Collection, it will hold a CollectionObservable.

  }, {
    key: "value",
    value: function value() {
      return this._value.rawValue();
    } // @return [kb.TYPE_UNKNOWN|kb.TYPE_SIMPLE|kb.TYPE_ARRAY|kb.TYPE_MODEL|kb.TYPE_COLLECTION] provides the type of the wrapped value.

  }, {
    key: "valueType",
    value: function valueType() {
      return this._value.valueType(_kb__WEBPACK_IMPORTED_MODULE_2__["default"].peek(this._model), _kb__WEBPACK_IMPORTED_MODULE_2__["default"].peek(this.key));
    } // ###################################################
    // Internal
    // ###################################################
    // @nodoc

  }, {
    key: "update",
    value: function update(new_value) {
      if (this.__kb_released) return undefined; // destroyed, nothing to do

      if (!arguments.length) new_value = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].getValue(_kb__WEBPACK_IMPORTED_MODULE_2__["default"].peek(this._model), _kb__WEBPACK_IMPORTED_MODULE_2__["default"].peek(this.key));
      return this._value.update(new_value);
    }
  }]);

  return Observable;
}();


var observable = function observable() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _construct(Observable, args);
};

/***/ }),

/***/ "./packages/knockback-core/src/statistics.js":
/*!***************************************************!*\
  !*** ./packages/knockback-core/src/statistics.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Statistics; });
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
 // kb.Statistics is an optional components that is useful for measuring your application's performance.
// You can record all of the Backbone.Events that have triggered ko.observable subscription updates and the memory footprint (instance count-only) of your ViewModels and collection observables.
//
// kb.Statistics is not included in `knockback.js` nor `knockback-core.js` so you need to manually include it from the `lib` directory.
//

var Statistics =
/*#__PURE__*/
function () {
  function Statistics() {
    _classCallCheck(this, Statistics);

    this.model_events_tracker = [];
    this.registered_tracker = {};
  } // Clear the tracked model events (but keep the registered objects intact)


  _createClass(Statistics, [{
    key: "clear",
    value: function clear() {
      this.model_events_tracker = [];
    } // ##############################
    // Registered Events
    // ##############################
    // Register a model event

  }, {
    key: "addModelEvent",
    value: function addModelEvent(event) {
      this.model_events_tracker.push(event);
    } // A debug helper to summarize the registered events in human-readable form

  }, {
    key: "modelEventsStatsString",
    value: function modelEventsStatsString() {
      var stats_string = '';
      stats_string += "Total Count: ".concat(this.model_events_tracker.length);

      var event_groups = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.groupBy(this.model_events_tracker, function (test) {
        return "event name: '".concat(test.name, "', attribute name: '").concat(test.key, "'");
      });

      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(event_groups, function (value, key) {
        stats_string += "\n ".concat(key, ", count: ").concat(value.length);
      });

      return stats_string;
    } // ##############################
    // Registered Observables and View Models
    // ##############################
    // Register an object by key

  }, {
    key: "register",
    value: function register(key, obj) {
      this.registeredTracker(key).push(obj);
    } // Unregister an object by key

  }, {
    key: "unregister",
    value: function unregister(key, obj) {
      var type_tracker = this.registeredTracker(key);

      var index = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.indexOf(type_tracker, obj);

      if (!~index) {
        if (typeof console !== 'undefined') console.log("kb.Statistics: failed to unregister type: ".concat(key));
        return undefined;
      }

      return type_tracker.splice(index, 1);
    } // @return [Integer] the number of registered objects by type

  }, {
    key: "registeredCount",
    value: function registeredCount(type) {
      if (type) return this.registeredTracker(type).length;
      var count = 0;

      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(this.registered_tracker[type], function (type_tracker) {
        count += type_tracker.length;
      });

      return count;
    } // A debug helper to summarize the current registered objects by key
    //
    // @param [String] success_message a message to return if there are no registered objects
    // @return [String] a human readable string summarizing the currently registered objects or success_message

  }, {
    key: "registeredStatsString",
    value: function registeredStatsString(success_message) {
      var stats_string = '';
      var written = false;

      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(this.registered_tracker, function (type_tracker, type) {
        if (!type_tracker.length) return;

        if (written) {
          stats_string += '\n ';
        }

        stats_string += "".concat(type || 'No Name', ": ").concat(type_tracker.length);
        written = true;
      });

      return stats_string || success_message;
    } // @nodoc

  }, {
    key: "registeredTracker",
    value: function registeredTracker(key) {
      if (Object.prototype.hasOwnProperty.call(this.registered_tracker, key)) {
        return this.registered_tracker[key];
      }

      var type_tracker = [];
      this.registered_tracker[key] = type_tracker;
      return type_tracker;
    }
  }], [{
    key: "eventsStats",
    value: function eventsStats(obj, key) {
      var stats = {
        count: 0
      };
      var events = obj._events || obj._callbacks || {};
      var keys = key ? [key] : underscore__WEBPACK_IMPORTED_MODULE_0___default.a.keys(events);

      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(keys, function (key_) {
        var node = events[key_];

        if (node) {
          if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(node)) {
            stats[key_] = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.compact(node).length;
          } else {
            var _node = node,
                tail = _node.tail;
            stats[key_] = 0;
            node = node.next;

            while (node !== tail) {
              stats[key_]++;
              node = node.next;
            }
          }

          stats.count += stats[key_];
        }
      });

      return stats;
    }
  }]);

  return Statistics;
}();



/***/ }),

/***/ "./packages/knockback-core/src/store.js":
/*!**********************************************!*\
  !*** ./packages/knockback-core/src/store.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Store; });
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! knockout */ "knockout");
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _kb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./kb */ "./packages/knockback-core/src/kb.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/


 // Used to share and manage the persistence of ViewModels and observables. ks.Store can be used to break relationship cycles between models,
// to reduce memory usage, and to share view models between kb.CollectionObservables (for example, when using Knockout.js selectedOptions).
//
// @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
//   var co = kb.collectionObservable(new Backbone.Collection());
//   var co_selected_options = kb.collectionObservable(new Backbone.Collection(), {
//     store: kb.utils.wrappedStore(co)
//   });

var Store =
/*#__PURE__*/
function () {
  _createClass(Store, null, [{
    key: "useOptionsOrCreate",
    // @nodoc
    // Used to either register yourself with the existing store or to create a new store.
    //
    // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
    // @param [Instance] obj the instance that will own or register with the store
    // @param [ko.observable] observable the observable that will own the store
    // @example
    //   kb.Store.useOptionsOrCreate(model, this, options);
    value: function useOptionsOrCreate(options, obj, observable) {
      if (!options.store) {
        _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedStoreIsOwned(observable, true);
      }

      var store = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedStore(observable, options.store || new _kb__WEBPACK_IMPORTED_MODULE_2__["default"].Store());
      store.retain(observable, obj, options.creator);
      return store;
    } // Used to create a new kb.Store.

  }]);

  function Store() {
    _classCallCheck(this, Store);

    this.observable_records = {};
    this.replaced_observables = [];
    _kb__WEBPACK_IMPORTED_MODULE_2__["default"].Store.instances.push(this);
  } // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(Store, [{
    key: "destroy",
    value: function destroy() {
      this.__kb_released = true;
      this.clear();

      var index = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.indexOf(_kb__WEBPACK_IMPORTED_MODULE_2__["default"].Store.instances, this);

      if (~index) _kb__WEBPACK_IMPORTED_MODULE_2__["default"].Store.instances.splice(index, 1);
    } // Manually clear the store

  }, {
    key: "clear",
    value: function clear() {
      var _this = this;

      var observable_records = this.observable_records;
      this.observable_records = {};

      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(observable_records, function (records) {
        underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(records, function (observable) {
          return _this.release(observable, true);
        });
      });

      var replaced_observables = this.replaced_observables;
      this.replaced_observables = [];

      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(replaced_observables, function (observable) {
        if (!observable.__kb_released) _this.release(observable, true);
      });
    } // Manually compact the store by searching for released view models

  }, {
    key: "compact",
    value: function compact() {
      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(this.observable_records, function (records) {
        underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(records, function (observable, cid) {
          if (observable.__kb_released) delete records[cid];
        });
      });
    } // Used to register a new view model with the store.
    //
    // @param [Model] obj the Model
    // @param [ko.observable] observable the observable to share for the Model
    // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
    // @option options [Constructor|Function] creator the constructor or function used to create the observable. It is used to match observables in the store.
    // @option options [String] path the path to the value (used to create related observables from the factory).
    // @option options [kb.Store] store a store used to cache and share view models.
    // @option options [kb.Factory] factory a factory used to create view models.
    //
    // @example retain an observable with the store
    //   store.retain(observable, obj, creator);

  }, {
    key: "retain",
    value: function retain(observable, obj, creator) {
      if (!this._canRegister(observable)) return undefined;

      if (!creator) {
        creator = observable.constructor;
      } // default is to use the constructor


      var current_observable = this.find(obj, creator);

      if (current_observable) {
        if (current_observable === observable) {
          // already in this store
          this._getOrCreateStoreReferences(observable).ref_count++;
          return observable;
        }

        this._retire(current_observable);
      }

      this._add(observable, obj, creator);

      this._getOrCreateStoreReferences(observable).ref_count++;
      return observable;
    } // Used to find an existing observable in the store or create a new one if it doesn't exist.
    //
    // @param [Model|Collection|Data] obj the object to create the observable for. Only Models are cached in the store.
    // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
    // @param [boolean] deep_retain setting to true retains an existing observable when found.
    // @option options [Constructor|Function] creator the constructor or function used to create the observable. It is used to match observables in the store.
    // @option options [String] path the path to the value (used to create related observables from the factory).
    // @option options [kb.Store] store a store used to cache and share view models.
    // @option options [kb.Factory] factory a factory used to create view models.
    //
    // @example register an observable with the store
    //   observable = store.retainOrCreate(value, {path: kb.utils.wrappedPath(observable), factory: kb.utils.wrappedFactory(observable)})

  }, {
    key: "retainOrCreate",
    value: function retainOrCreate(obj, options, deep_retain) {
      var _this2 = this;

      var creator = this._creator(obj, options);

      if (!creator) return _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.createFromDefaultCreator(obj, options);
      if (creator.models_only) return obj;
      var observable = this.find(obj, creator);

      if (observable) {
        return deep_retain && _kb__WEBPACK_IMPORTED_MODULE_2__["default"].settings.deep_retain ? this.retain(observable, obj, creator) : observable;
      }

      if (!underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isFunction(creator.create || creator)) throw new Error("Invalid factory for \"".concat(options.path, "\""));
      observable = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].ignore(function () {
        options = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.defaults({
          store: _this2,
          creator: creator
        }, options); // set our own creator so we can register ourselves above

        observable = creator.create ? creator.create(obj, options) : new creator(obj, options);
        return observable || knockout__WEBPACK_IMPORTED_MODULE_1___default.a.observable(null);
      }); // default to null

      this.retain(observable, obj, creator);
      return observable;
    } // @nodoc

  }, {
    key: "reuse",
    value: function reuse(observable, obj) {
      var current_obj = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedObject(observable);
      if (current_obj === obj) return;
      if (!this._canRegister(observable)) throw new Error('Cannot reuse a simple observable');
      if (this._refCount(observable) !== 1) throw new Error("Trying to change a shared view model. Ref count: ".concat(this._refCount(observable)));
      var creator = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedCreator(observable) || observable.constructor; // default is to use the constructor

      var current_observable;
      if (!underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isUndefined(current_obj)) current_observable = this.find(current_obj, creator);
      this.retain(observable, obj, creator);
      if (current_observable) this.release(current_observable);
    } // Release a reference to a a ViewModel in this store.

  }, {
    key: "release",
    value: function release(observable, force) {
      if (!this._canRegister(observable)) return _kb__WEBPACK_IMPORTED_MODULE_2__["default"].release(observable); // just release
      // maybe be externally added

      var store_references = this._storeReferences(observable);

      if (store_references) {
        if (!force && --store_references.ref_count > 0) return undefined; // do not release yet

        this._clearStoreReferences(observable);
      }

      this._remove(observable);

      if (observable.__kb_released) return undefined;
      if (force || this._refCount(observable) <= 1) return _kb__WEBPACK_IMPORTED_MODULE_2__["default"].release(observable); // allow for a single initial reference in another store

      return undefined;
    } // @nodoc

  }, {
    key: "find",
    value: function find(obj, creator) {
      var records = this.observable_records[this._creatorId(creator)];

      if (!records) return null;

      var observable = records[this._cid(obj)];

      if (observable && observable.__kb_released) {
        delete records[this._cid(obj)];
        return null;
      }

      return observable;
    } // @nodoc

  }, {
    key: "_refCount",
    value: function _refCount(observable) {
      if (observable.__kb_released) {
        typeof console === 'undefined' || console.log('Observable already released');
        return 0;
      }

      var stores_references = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.get(observable, 'stores_references');
      if (!stores_references) return 1;
      return underscore__WEBPACK_IMPORTED_MODULE_0___default.a.reduce(stores_references, function (memo, store_references) {
        return memo + store_references.ref_count;
      }, 0);
    } // @nodoc

  }, {
    key: "_canRegister",
    value: function _canRegister(observable) {
      return observable && !knockout__WEBPACK_IMPORTED_MODULE_1___default.a.isObservable(observable) && !observable.__kb_is_co;
    } // only register view models not basic ko.observables nor kb.CollectionObservables
    // @nodoc

  }, {
    key: "_cid",
    value: function _cid(obj) {
      if (!obj) return 'null';
      if (!obj.cid) obj.cid = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.uniqueId('c');
      return obj.cid;
    } // @nodoc

  }, {
    key: "_creatorId",
    value: function _creatorId(creator) {
      var create = creator.create || creator;

      if (!create.__kb_cids) {
        create.__kb_cids = [];
      }

      for (var i = 0, l = create.__kb_cids.length; i < l; i++) {
        var _item = create.__kb_cids[i];
        if (_item.create === create) return _item.cid;
      }

      var item = {
        create: create,
        cid: underscore__WEBPACK_IMPORTED_MODULE_0___default.a.uniqueId('kb')
      };

      create.__kb_cids.push(item);

      return item.cid;
    } // @nodoc

  }, {
    key: "_storeReferences",
    value: function _storeReferences(observable) {
      var _this3 = this;

      var stores_references = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.get(observable, 'stores_references');
      if (!stores_references) return undefined;
      return underscore__WEBPACK_IMPORTED_MODULE_0___default.a.find(stores_references, function (ref) {
        return ref.store === _this3;
      });
    } // @nodoc

  }, {
    key: "_getOrCreateStoreReferences",
    value: function _getOrCreateStoreReferences(observable) {
      var _this4 = this;

      var stores_references = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.orSet(observable, 'stores_references', []);

      var ref = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.find(stores_references, function (x) {
        return x.store === _this4;
      });

      if (!ref) stores_references.push(ref = {
        store: this,
        ref_count: 0,
        release: function release() {
          return _this4.release(observable);
        }
      });
      return ref;
    } // @nodoc

  }, {
    key: "_clearStoreReferences",
    value: function _clearStoreReferences(observable) {
      var stores_references = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.orSet(observable, 'stores_references', []);
      if (!stores_references) return;

      for (var i = 0, l = observable.__kb.stores_references.length; i < l; i++) {
        var ref = observable.__kb.stores_references[i];

        if (ref.store === this) {
          observable.__kb.stores_references.splice(i, 1);

          break;
        }
      }
    } // @nodoc

  }, {
    key: "_retire",
    value: function _retire(observable) {
      this._clearStoreReferences(observable);

      this.replaced_observables.push(observable);
      return this._remove(observable);
    } // @nodoc

  }, {
    key: "_add",
    value: function _add(observable, obj, creator) {
      if (!creator) creator = observable.constructor; // default is to use the constructor

      _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedObject(observable, obj);
      _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedCreator(observable, creator);

      var name = this._creatorId(creator);

      if (!this.observable_records[name]) this.observable_records[name] = {};
      this.observable_records[name][this._cid(obj)] = observable;
      return observable;
    } // @nodoc

  }, {
    key: "_remove",
    value: function _remove(observable) {
      var creator = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedCreator(observable) || observable.constructor; // default is to use the constructor

      var obj = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedObject(observable);
      var current_observable = this.find(obj, creator); // already released

      if (current_observable && current_observable === observable) {
        delete this.observable_records[this._creatorId(creator)][this._cid(obj)]; // not already replaced
      }

      _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedObject(observable, null);
      return _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.wrappedCreator(observable, null);
    } // @nodoc

  }, {
    key: "_creator",
    value: function _creator(obj, options) {
      if (options.creator) return options.creator;
      var creator = _kb__WEBPACK_IMPORTED_MODULE_2__["default"].utils.inferCreator(obj, options.factory, options.path);
      if (creator) return creator;
      if (_kb__WEBPACK_IMPORTED_MODULE_2__["default"].isModel(obj)) return _kb__WEBPACK_IMPORTED_MODULE_2__["default"].ViewModel;
      return undefined;
    }
  }]);

  return Store;
}();

_defineProperty(Store, "instances", []);



/***/ }),

/***/ "./packages/knockback-core/src/utils.js":
/*!**********************************************!*\
  !*** ./packages/knockback-core/src/utils.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return utils; });
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! knockout */ "knockout");
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _kb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./kb */ "./packages/knockback-core/src/kb.js");
/* harmony import */ var _functions_wrapped_destroy__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./functions/wrapped-destroy */ "./packages/knockback-core/src/functions/wrapped-destroy.js");
/* harmony import */ var _functions_collapse_options__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./functions/collapse-options */ "./packages/knockback-core/src/functions/collapse-options.js");
/* harmony import */ var _functions_unwrap_models__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./functions/unwrap-models */ "./packages/knockback-core/src/functions/unwrap-models.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/






 // ###################################################
// Public API
// ###################################################
// Library of general-purpose utilities

var utils =
/*#__PURE__*/
function () {
  function utils() {
    _classCallCheck(this, utils);
  }

  _createClass(utils, null, [{
    key: "get",
    // Clean up function that releases all of the wrapped values on an owner.
    // Helper to merge options including ViewmModel options like `keys` and `factories`
    //
    // @param [Object] obj the object to test
    //
    // @example
    //   kb.utils.collapseOptions(options);
    // used for attribute setting to ensure all model attributes have their underlying models
    // @nodoc
    value: function get(obj, key, default_value) {
      return !obj.__kb || !Object.prototype.hasOwnProperty.call(obj.__kb, key) ? default_value : obj.__kb[key];
    } // @nodoc

  }, {
    key: "set",
    value: function set(obj, key, value) {
      (obj.__kb || (obj.__kb = {}))[key] = value;
      return value;
    } // @nodoc

  }, {
    key: "orSet",
    value: function orSet(obj, key, value) {
      if (!obj.__kb) obj.__kb = {};
      if (!Object.prototype.hasOwnProperty.call(obj.__kb, key)) obj.__kb[key] = value;
      return obj.__kb[key];
    } // @nodoc

  }, {
    key: "has",
    value: function has(obj, key) {
      return obj.__kb && Object.prototype.hasOwnProperty.call(obj.__kb, key);
    } // Dual-purpose getter/setter for retrieving and storing the observable on an instance that returns a ko.observable instead of 'this'. Relevant for:
    //
    //   * [kb.CollectionObservable]('classes/kb/CollectionObservable.html')
    //   * [kb.Observable]('classes/kb/Observable.html')
    //   * [kb.DefaultObservable]('classes/kb/DefaultObservable.html')
    //   * [kb.FormattedObservable]('classes/kb/FormattedObservable.html')
    //   * [kb.LocalizedObservable]('classes/kb/LocalizedObservable.html')
    //   * [kb.TriggeredObservable]('classes/kb/TriggeredObservable.html')
    //
    // @overload wrappedObservable(instance)
    //   Gets the observable from an object
    //   @param [Any] instance the owner
    //   @return [ko.observable|ko.observableArray] the observable
    // @overload wrappedObservable(instance, observable)
    //   Sets the observable on an object
    //   @param [Any] instance the owner
    //   @param [ko.observable|ko.observableArray] observable the observable
    //
    // @example
    //   var ShortDateLocalizer = kb.LocalizedObservable.extend({
    //     constructor: function(value, options, view_model) {
    //       kb.LocalizedObservable.prototype.constructor.apply(this, arguments);
    //       return kb.utils.wrappedObservable(this);
    //     }
    //   });

  }, {
    key: "wrappedObservable",
    value: function wrappedObservable(obj, value) {
      if (arguments.length === 1) return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.get(obj, 'observable');
      return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.set(obj, 'observable', value);
    } // Dual-purpose getter/setter for retrieving and storing the Model or Collection on an owner.
    // @note this is almost the same as {kb.utils.wrappedModel} except that if the Model doesn't exist, it returns null.
    //
    // @overload wrappedObject(obj)
    //   Gets the observable from an object
    //   @param [Object|kb.ViewModel|kb.CollectionObservable] obj owner the ViewModel/CollectionObservable owning the Backbone.Model or Backbone.Collection.
    //   @return [Model|Collection] the model/collection
    // @overload wrappedObject(obj, value)
    //   Sets the observable on an object
    //   @param [Object|kb.ViewModel|kb.CollectionObservable] obj owner the ViewModel/CollectionObservable owning the Backbone.Model or Backbone.Collection.
    //   @param [Model|Collection] value the model/collection
    //
    // @example
    //   var model = kb.utils.wrappedObject(view_model);
    //   var collection = kb.utils.wrappedObject(collection_observable);

  }, {
    key: "wrappedObject",
    value: function wrappedObject(obj, value) {
      if (arguments.length === 1) {
        return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.get(obj, 'object');
      }

      return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.set(obj, 'object', value);
    } // @nodoc

  }, {
    key: "wrappedCreator",
    value: function wrappedCreator(obj, value) {
      if (arguments.length === 1) {
        return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.get(obj, 'creator');
      }

      return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.set(obj, 'creator', value);
    } // Dual-purpose getter/setter for retrieving and storing the Model on a ViewModel.
    // @note this is almost the same as {kb.utils.wrappedObject} except that if the Model doesn't exist, it returns the ViewModel itself (which is useful behaviour for sorting because
    // it you can iterate over a kb.CollectionObservable's ko.ObservableArray whether it holds ViewModels or Models with the models_only option).
    //
    // @overload wrappedModel(view_model)
    //   Gets the model from a ViewModel
    //   @param [Object|kb.ViewModel] view_model the owning ViewModel for the Model.
    //   @return [Model|ViewModel] the Model or ViewModel itself if there is no Model
    // @overload wrappedModel(view_model, model)
    //   Sets the observable on an object
    //   @param [Object|kb.ViewModel] view_model the owning ViewModel for the Model.
    //   @param [Model] model the Model

  }, {
    key: "wrappedModel",
    value: function wrappedModel(obj, value) {
      if (arguments.length !== 1) return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.set(obj, 'object', value);
      value = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.get(obj, 'object');
      return underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isUndefined(value) ? obj : value;
    } // Dual-purpose getter/setter for retrieving and storing a kb.Store on an owner.
    //
    // @overload wrappedStore(obj)
    //   Gets the store from an object
    //   @param [Any] obj the owner
    //   @return [kb.Store] the store
    // @overload wrappedStore(obj, store)
    //   Sets the store on an object
    //   @param [Any] obj the owner
    //   @param [kb.Store] store the store
    //
    // @example
    //   var co = kb.collectionObservable(new Backbone.Collection());
    //   var co_selected_options = kb.collectionObservable(new Backbone.Collection(), {
    //     store: kb.utils.wrappedStore(co)
    //   });

  }, {
    key: "wrappedStore",
    value: function wrappedStore(obj, value) {
      if (arguments.length === 1) {
        return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.get(obj, 'store');
      }

      return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.set(obj, 'store', value);
    } // @private

  }, {
    key: "wrappedStoreIsOwned",
    value: function wrappedStoreIsOwned(obj, value) {
      if (arguments.length === 1) {
        return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.get(obj, 'store_is_owned');
      }

      return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.set(obj, 'store_is_owned', value);
    } // Dual-purpose getter/setter for retrieving and storing a kb.Factory on an owner.
    //
    // @overload wrappedFactory(obj)
    //   Gets the factory from an object
    //   @param [Any] obj the owner
    //   @return [kb.Factory] the factory
    // @overload wrappedFactory(obj, factory)
    //   Sets the factory on an object
    //   @param [Any] obj the owner
    //   @param [kb.Factory] factory the factory

  }, {
    key: "wrappedFactory",
    value: function wrappedFactory(obj, value) {
      if (arguments.length === 1) {
        return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.get(obj, 'factory');
      }

      return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.set(obj, 'factory', value);
    } // Dual-purpose getter/setter for retrieving and storing a EventWatcher on an owner.
    //
    // @overload wrappedEventWatcher(obj)
    //   Gets the event_watcher from an object
    //   @param [Any] obj the owner
    //   @return [EventWatcher] the event_watcher
    // @overload wrappedEventWatcher(obj, event_watcher)
    //   Sets the event_watcher on an object
    //   @param [Any] obj the owner
    //   @param [EventWatcher] event_watcher the event_watcher

  }, {
    key: "wrappedEventWatcher",
    value: function wrappedEventWatcher(obj, value) {
      if (arguments.length === 1) {
        return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.get(obj, 'event_watcher');
      }

      return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.set(obj, 'event_watcher', value);
    } // @private

  }, {
    key: "wrappedEventWatcherIsOwned",
    value: function wrappedEventWatcherIsOwned(obj, value) {
      if (arguments.length === 1) {
        return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.get(obj, 'event_watcher_is_owned');
      }

      return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.set(obj, 'event_watcher_is_owned', value);
    } // Retrieves the value stored in a ko.observable.
    //
    // @see kb.Observable valueType
    //
    // @example
    //   var view_model = kb.viewModel(new Model({simple_attr: null, model_attr: null}), {factories: {model_attr: kb.ViewModel});
    //   kb.utils.valueType(view_model.simple_attr); // kb.TYPE_SIMPLE
    //   kb.utils.valueType(view_model.model_attr);  // kb.TYPE_MODEL

  }, {
    key: "valueType",
    value: function valueType(observable) {
      if (!observable) return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].TYPE_UNKNOWN;
      if (observable.__kb_is_o) return observable.valueType();
      if (observable.__kb_is_co || _kb__WEBPACK_IMPORTED_MODULE_3__["default"].isCollection(observable)) return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].TYPE_COLLECTION;
      if (observable instanceof _kb__WEBPACK_IMPORTED_MODULE_3__["default"].ViewModel || _kb__WEBPACK_IMPORTED_MODULE_3__["default"].isModel(observable)) return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].TYPE_MODEL;
      if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(observable)) return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].TYPE_ARRAY;
      return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].TYPE_SIMPLE;
    } // Helper to join a dot-deliminated path.
    //
    // @param [String] path1 start path.
    // @param [String] path2 append path.
    // @return [String] combined dot-delimited path.
    //
    // @example
    //   kb.utils.pathJoin('models', 'name'); // 'models.name'

  }, {
    key: "pathJoin",
    value: function pathJoin(path1, path2) {
      return (path1 ? path1[path1.length - 1] !== '.' ? "".concat(path1, ".") : path1 : '') + path2;
    } // Helper to join a dot-deliminated path with the path on options and returns a new options object with the result.
    //
    // @param [Object] options with path property for the start path
    // @param [String] path append path.
    // @return [Object] new options with combined dot-delimited path `{path: combined_path}`.
    //
    // @example
    //   this.friends = kb.collectionObservable(model.get('friends'), kb.utils.optionsPathJoin(options, 'friends'));

  }, {
    key: "optionsPathJoin",
    value: function optionsPathJoin(options, path) {
      return underscore__WEBPACK_IMPORTED_MODULE_0___default.a.defaults({
        path: this.pathJoin(options.path, path)
      }, options);
    } // Helper to find the creator constructor or function from a factory or ORM solution

  }, {
    key: "inferCreator",
    value: function inferCreator(value, factory, path) {
      var creator = factory ? factory.creatorForPath(value, path) : null;

      if (creator) {
        return creator;
      } // try fallbacks


      if (!value) return null;

      if (value instanceof backbone__WEBPACK_IMPORTED_MODULE_1___default.a.Model) {
        return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].ViewModel;
      }

      if (value instanceof backbone__WEBPACK_IMPORTED_MODULE_1___default.a.Collection) {
        return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].CollectionObservable;
      }

      return null;
    } // Creates an observable based on a value's type.

  }, {
    key: "createFromDefaultCreator",
    value: function createFromDefaultCreator(obj, options) {
      if (_kb__WEBPACK_IMPORTED_MODULE_3__["default"].isModel(obj)) {
        return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].viewModel(obj, options);
      }

      if (_kb__WEBPACK_IMPORTED_MODULE_3__["default"].isCollection(obj)) {
        return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].collectionObservable(obj, options);
      }

      if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(obj)) {
        return knockout__WEBPACK_IMPORTED_MODULE_2___default.a.observableArray(obj);
      }

      return knockout__WEBPACK_IMPORTED_MODULE_2___default.a.observable(obj);
    } // @nodoc

  }, {
    key: "resolveModel",
    value: function resolveModel(model) {
      if (model && backbone__WEBPACK_IMPORTED_MODULE_1___default.a && backbone__WEBPACK_IMPORTED_MODULE_1___default.a.ModelRef && model instanceof backbone__WEBPACK_IMPORTED_MODULE_1___default.a.ModelRef) {
        return model.model();
      }

      return model;
    }
  }]);

  return utils;
}();

_defineProperty(utils, "wrappedDestroy", _functions_wrapped_destroy__WEBPACK_IMPORTED_MODULE_4__["default"]);

_defineProperty(utils, "collapseOptions", _functions_collapse_options__WEBPACK_IMPORTED_MODULE_5__["default"]);

_defineProperty(utils, "unwrapModels", _functions_unwrap_models__WEBPACK_IMPORTED_MODULE_6__["default"]);



/***/ }),

/***/ "./packages/knockback-core/src/view-model.js":
/*!***************************************************!*\
  !*** ./packages/knockback-core/src/view-model.js ***!
  \***************************************************/
/*! exports provided: default, viewModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ViewModel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "viewModel", function() { return viewModel; });
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! knockout */ "knockout");
/* harmony import */ var knockout__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(knockout__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _kb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./kb */ "./packages/knockback-core/src/kb.js");
/* harmony import */ var _event_watcher__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./event-watcher */ "./packages/knockback-core/src/event-watcher.js");
function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/




 // @nodoc

var assignViewModelKey = function assignViewModelKey(vm, key) {
  var vm_key = vm.__kb.internals && ~underscore__WEBPACK_IMPORTED_MODULE_0___default.a.indexOf(vm.__kb.internals, key) ? "_".concat(key) : key;
  if (Object.prototype.hasOwnProperty.call(vm.__kb.view_model, vm_key)) return undefined; // already exists, skip

  vm.__kb.view_model[vm_key] = null;
  return vm_key;
}; // @nodoc


var createObservable = function createObservable(vm, model, key, create_options) {
  if (vm.__kb.excludes && ~underscore__WEBPACK_IMPORTED_MODULE_0___default.a.indexOf(vm.__kb.excludes, key)) return undefined;
  if (vm.__kb.statics && ~underscore__WEBPACK_IMPORTED_MODULE_0___default.a.indexOf(vm.__kb.statics, key)) return undefined;
  var vm_key = assignViewModelKey(vm, key);
  if (!vm_key) return undefined;
  var observable = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].observable(model, key, create_options, vm);
  vm.__kb.view_model[vm_key] = observable;
  vm[vm_key] = observable;
  return observable;
}; // @nodoc


var createStaticObservables = function createStaticObservables(vm, model) {
  underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(vm.__kb.statics, function (key) {
    var vm_key = assignViewModelKey(vm, key);
    if (!vm_key) return;

    if (model.has(vm_key)) {
      vm.__kb.view_model[vm_key] = model.get(vm_key);
      vm[vm_key] = vm.__kb.view_model[vm_key];
    } else if (vm.__kb.static_defaults && Object.prototype.hasOwnProperty.call(vm.__kb.static_defaults, vm_key)) {
      vm.__kb.view_model[vm_key] = vm.__kb.static_defaults[vm_key];
      vm[vm_key] = vm.__kb.view_model[vm_key];
    } else delete vm.__kb.view_model[vm_key];
  });
};

var KEYS_OPTIONS = ['keys', 'internals', 'excludes', 'statics', 'static_defaults']; // Base class for ViewModels for Models.
//
// @example How to create a ViewModel with first_name and last_name observables.
//   var view_model = kb.viewModel(new Backbone.Model({first_name: "Planet", last_name: "Earth"}));
//
// @example Bulk kb.Observable create using 'key' Object to customize the kb.Observable created per attribute.
//   var ContactViewModel = function(model) {
//     this.loading_message = new kb.LocalizedStringLocalizer(new LocalizedString('loading'));
//     this._auto = kb.viewModel(model, {
//       keys: {
//         name: { key: 'name', 'default': this.loading_message },
//         number: { key: 'number', 'default': this.loading_message },
//         date: { key: 'date', 'default': this.loading_message, localizer: kb.ShortDateLocalizer }
//       }
//     }, this);
//     return this;
//   };
//
// @example Creating ko.Observables on a target ViewModel
//   var view_model = {};
//   kb.viewModel(model, ['name', 'date'], view_model); // observables are added to view_model
//
// @method .extend(prototype_properties, class_properties)
//   Class method for JavaScript inheritance.
//   @param [Object] prototype_properties the properties to add to the prototype
//   @param [Object] class_properties the properties to add to the class
//   @return [kb.ViewModel] the constructor returns 'this'
//   @example
//     var ContactViewModel = kb.ViewModel.extend({
//       constructor: function(model) {
//         kb.ViewModel.prototype.constructor.call(this, model, {internals: ['email', 'date']});   // call super constructor: @name, @_email, and @_date created in super from the model attributes
//         this.email = kb.defaultObservable(this._email, 'your.name@yourplace.com');
//         this.date = new LongDateLocalizer(this._date);
//         return this;
//       }
//     });
//   @example
//     var ViewModel = kb.ViewModel.extend({
//       constructor: function(model){
//         kb.ViewModel.prototype.constructor.apply(this, arguments);
//         this.full_name = ko.computed(function() { return this.first_name() + " " + this.last_name(); }, this);
//       }
//     });
//     var view_model = new ViewModel(model);
//
// @method #model()
//   Dual-purpose getter/setter ko.computed for the observed model.
//   @return [Model|ModelRef|void] getter: the model whose attributes are being observed (can be null) OR setter: void
//   @example
//     var view_model = kb.viewModel(new Backbone.Model({name: 'bob'}));
//     var the_model = view_model.model(); // get
//     view_model.model(new Backbone.Model({name: 'fred'})); // set
//

var ViewModel =
/*#__PURE__*/
function () {
  // @nodoc
  // for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")
  // Used to create a new kb.ViewModel.
  //
  // @param [Model|ModelRef] model the model to observe (can be null)
  // @param [Object] options the create options
  // @option options [Array|String] internals an array of atttributes that should be scoped with an underscore, eg. name -> _name
  // @option options [Array|String] requires an array of atttributes that will have kb.Observables created even if they do not exist on the Model.
  // Useful for binding Views that require specific observables to exist
  // @option options [Array|String] keys restricts the keys used on a model. Useful for reducing the number of kb.Observables created from a limited set of Model attributes
  // @option options [Object|Array|String] excludes if an array is supplied, excludes keys to exclude on the view model;
  // for example, if you want to provide a custom implementation. If an Object, it provides options to the kb.Observable constructor.
  // @option options [Array] statics creates non-observable properties on your view model for Model attributes that do not need to be observed for changes.
  // @option options [Object] static_defaults provides default values for statics.
  // @option options [String] path the path to the value (used to create related observables from the factory).
  // @option options [kb.Store] store a store used to cache and share view models.
  // @option options [Object] factories a map of dot-deliminated paths; for example `{'models.name': kb.ViewModel}` to either constructors or create functions.
  // Signature: `{'some.path': function(object, options)}`
  // @option options [kb.Factory] factory a factory used to create view models.
  // @option options [Object] options a set of options merge into these options. Useful for extending options when deriving classes rather than merging them by hand.
  // @return [ko.observable] the constructor returns 'this'
  // @param [Object] view_model a view model to also set the kb.Observables on. Useful when batch creating observable on an owning view model.
  function ViewModel() {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _classCallCheck(this, ViewModel);

    return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].ignore(function () {
      var model = args.shift();
      !model || _kb__WEBPACK_IMPORTED_MODULE_3__["default"].isModel(model) || _kb__WEBPACK_IMPORTED_MODULE_3__["default"]._throwUnexpected(_this, 'not a model');
      if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(args[0])) args[0] = {
        keys: args[0]
      };

      if (!_this.__kb) {
        _this.__kb = {};
      }

      _this.__kb.view_model = args.length > 1 ? args.pop() : _this;
      var options = {};

      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(args, function (arg) {
        _kb__WEBPACK_IMPORTED_MODULE_3__["default"].assign(options, arg);
        options = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.collapseOptions(options);
      });

      underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(KEYS_OPTIONS, function (key) {
        if (Object.prototype.hasOwnProperty.call(options, key)) _this.__kb[key] = options[key];
      }); // always use a store to ensure recursive view models are handled correctly


      _kb__WEBPACK_IMPORTED_MODULE_3__["default"].Store.useOptionsOrCreate(options, model, _this); // view model factory

      _this.__kb.path = options.path;
      _kb__WEBPACK_IMPORTED_MODULE_3__["default"].Factory.useOptionsOrCreate(options, _this, options.path);
      var event_watcher = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedEventWatcher(_this, new _event_watcher__WEBPACK_IMPORTED_MODULE_4__["default"](model, _this, {
        emitter: _this._model,
        update: function update() {
          return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].ignore(function () {
            return !(event_watcher && event_watcher.ee) || _this.createObservables(event_watcher.ee);
          });
        }
      }));

      var _model = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.set(_this, '_model', knockout__WEBPACK_IMPORTED_MODULE_2___default.a.observable());

      _this.model = knockout__WEBPACK_IMPORTED_MODULE_2___default.a.computed({
        read: function read() {
          return knockout__WEBPACK_IMPORTED_MODULE_2___default.a.utils.unwrapObservable(_model);
        },
        write: function write(new_model) {
          return _kb__WEBPACK_IMPORTED_MODULE_3__["default"].ignore(function () {
            if (_kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedObject(_this) === new_model || _kb__WEBPACK_IMPORTED_MODULE_3__["default"].wasReleased(_this) || !event_watcher) return undefined;

            _this.__kb.store.reuse(_this, _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.resolveModel(new_model));

            event_watcher.emitter(new_model);

            _model(event_watcher.ee);

            return !event_watcher.ee || _this.createObservables(event_watcher.ee);
          });
        }
      });
      model = event_watcher.ee;
      _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedObject(_this, model);

      _model(event_watcher.ee); // update the observables


      _this.__kb.create_options = {
        store: _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedStore(_this),
        factory: _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedFactory(_this),
        path: _this.__kb.path,
        event_watcher: _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedEventWatcher(_this)
      };
      !options.requires || _this.createObservables(model, options.requires);
      !_this.__kb.internals || _this.createObservables(model, _this.__kb.internals);
      !options.mappings || _this.createObservables(model, options.mappings);
      !_this.__kb.statics || createStaticObservables(_this, model);

      _this.createObservables(model, _this.__kb.keys);

      if (_kb__WEBPACK_IMPORTED_MODULE_3__["default"].statistics) _kb__WEBPACK_IMPORTED_MODULE_3__["default"].statistics.register('ViewModel', _this); // collect memory management statistics

      return _this;
    });
  } // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).


  _createClass(ViewModel, [{
    key: "destroy",
    value: function destroy() {
      var _this2 = this;

      this.__kb_released = true;

      if (this.__kb.view_model !== this) {
        underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(this.__kb.vm_keys, function (key) {
          _this2.__kb.view_model[key] = null;
        });
      } // clear the external references


      this.__kb.view_model = null;
      this.__kb.create_options = null;
      _kb__WEBPACK_IMPORTED_MODULE_3__["default"].releaseKeys(this);
      _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedDestroy(this);
      if (_kb__WEBPACK_IMPORTED_MODULE_3__["default"].statistics) _kb__WEBPACK_IMPORTED_MODULE_3__["default"].statistics.unregister('ViewModel', this); // collect memory management statistics
    } // Get the options for a new view model that can be used for sharing view models.

  }, {
    key: "shareOptions",
    value: function shareOptions() {
      return {
        store: _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedStore(this),
        factory: _kb__WEBPACK_IMPORTED_MODULE_3__["default"].utils.wrappedFactory(this)
      };
    } // create observables manually

  }, {
    key: "createObservables",
    value: function createObservables(model, keys) {
      var _this3 = this;

      if (!keys) {
        if (this.__kb.keys || !model) return; // only use the keys provided

        for (var key in model.attributes) {
          if (Object.prototype.hasOwnProperty.call(model.attributes, key)) {
            createObservable(this, model, key, this.__kb.create_options);
          }
        }

        if (_kb__WEBPACK_IMPORTED_MODULE_3__["default"].settings.orm && _kb__WEBPACK_IMPORTED_MODULE_3__["default"].settings.orm.keys) {
          underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(_kb__WEBPACK_IMPORTED_MODULE_3__["default"].settings.orm.keys(model), function (key) {
            createObservable(_this3, model, key, _this3.__kb.create_options);
          });
        }
      } else if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(keys)) {
        underscore__WEBPACK_IMPORTED_MODULE_0___default.a.map(keys, function (key) {
          return createObservable(_this3, model, key, _this3.__kb.create_options);
        });
      } else {
        underscore__WEBPACK_IMPORTED_MODULE_0___default.a.each(keys, function (mapping_info, key) {
          var vm_key = assignViewModelKey(_this3, key);

          if (vm_key) {
            if (!underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isString(mapping_info) && !mapping_info.key) mapping_info.key = vm_key;
            _this3[vm_key] = _kb__WEBPACK_IMPORTED_MODULE_3__["default"].observable(model, mapping_info, _this3.__kb.create_options, _this3);
            _this3.__kb.view_model[vm_key] = _this3[vm_key];
          }
        });
      }
    }
  }]);

  return ViewModel;
}(); // Factory function to create a kb.ViewModel.


_defineProperty(ViewModel, "extend", backbone__WEBPACK_IMPORTED_MODULE_1___default.a.Model.extend);


var viewModel = function viewModel() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return _construct(ViewModel, args);
};

/***/ }),

/***/ "backbone":
/*!**************************************************************************************************!*\
  !*** external {"root":"Backbone","amd":"backbone","commonjs":"backbone","commonjs2":"backbone"} ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_backbone__;

/***/ }),

/***/ "knockout":
/*!********************************************************************************************!*\
  !*** external {"root":"ko","amd":"knockout","commonjs":"knockout","commonjs2":"knockout"} ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_knockout__;

/***/ }),

/***/ "underscore":
/*!*************************************************************************************************!*\
  !*** external {"root":"_","amd":"underscore","commonjs":"underscore","commonjs2":"underscore"} ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_underscore__;

/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9rYi93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8va2Ivd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8va2IvKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovL2tiLyh3ZWJwYWNrKS9idWlsZGluL2hhcm1vbnktbW9kdWxlLmpzIiwid2VicGFjazovL2tiLy4vcGFja2FnZXMva25vY2tiYWNrLWNvcmUvc3JjL2NvbGxlY3Rpb24tb2JzZXJ2YWJsZS5qcyIsIndlYnBhY2s6Ly9rYi8uL3BhY2thZ2VzL2tub2NrYmFjay1jb3JlL3NyYy9jb25maWd1cmUuanMiLCJ3ZWJwYWNrOi8va2IvLi9wYWNrYWdlcy9rbm9ja2JhY2stY29yZS9zcmMvZXZlbnQtd2F0Y2hlci5qcyIsIndlYnBhY2s6Ly9rYi8uL3BhY2thZ2VzL2tub2NrYmFjay1jb3JlL3NyYy9mYWN0b3J5LmpzIiwid2VicGFjazovL2tiLy4vcGFja2FnZXMva25vY2tiYWNrLWNvcmUvc3JjL2Z1bmN0aW9ucy9jb2xsYXBzZS1vcHRpb25zLmpzIiwid2VicGFjazovL2tiLy4vcGFja2FnZXMva25vY2tiYWNrLWNvcmUvc3JjL2Z1bmN0aW9ucy91bndyYXAtbW9kZWxzLmpzIiwid2VicGFjazovL2tiLy4vcGFja2FnZXMva25vY2tiYWNrLWNvcmUvc3JjL2Z1bmN0aW9ucy93cmFwcGVkLWRlc3Ryb3kuanMiLCJ3ZWJwYWNrOi8va2IvLi9wYWNrYWdlcy9rbm9ja2JhY2stY29yZS9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8va2IvLi9wYWNrYWdlcy9rbm9ja2JhY2stY29yZS9zcmMvaW5qZWN0LmpzIiwid2VicGFjazovL2tiLy4vcGFja2FnZXMva25vY2tiYWNrLWNvcmUvc3JjL2tiLmpzIiwid2VicGFjazovL2tiLy4vcGFja2FnZXMva25vY2tiYWNrLWNvcmUvc3JjL2xpYi90eXBlZC12YWx1ZS5qcyIsIndlYnBhY2s6Ly9rYi8uL3BhY2thZ2VzL2tub2NrYmFjay1jb3JlL3NyYy9tb25rZXktcGF0Y2hlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9rYi8uL3BhY2thZ2VzL2tub2NrYmFjay1jb3JlL3NyYy9vYnNlcnZhYmxlLmpzIiwid2VicGFjazovL2tiLy4vcGFja2FnZXMva25vY2tiYWNrLWNvcmUvc3JjL3N0YXRpc3RpY3MuanMiLCJ3ZWJwYWNrOi8va2IvLi9wYWNrYWdlcy9rbm9ja2JhY2stY29yZS9zcmMvc3RvcmUuanMiLCJ3ZWJwYWNrOi8va2IvLi9wYWNrYWdlcy9rbm9ja2JhY2stY29yZS9zcmMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8va2IvLi9wYWNrYWdlcy9rbm9ja2JhY2stY29yZS9zcmMvdmlldy1tb2RlbC5qcyIsIndlYnBhY2s6Ly9rYi9leHRlcm5hbCB7XCJyb290XCI6XCJCYWNrYm9uZVwiLFwiYW1kXCI6XCJiYWNrYm9uZVwiLFwiY29tbW9uanNcIjpcImJhY2tib25lXCIsXCJjb21tb25qczJcIjpcImJhY2tib25lXCJ9Iiwid2VicGFjazovL2tiL2V4dGVybmFsIHtcInJvb3RcIjpcImtvXCIsXCJhbWRcIjpcImtub2Nrb3V0XCIsXCJjb21tb25qc1wiOlwia25vY2tvdXRcIixcImNvbW1vbmpzMlwiOlwia25vY2tvdXRcIn0iLCJ3ZWJwYWNrOi8va2IvZXh0ZXJuYWwge1wicm9vdFwiOlwiX1wiLFwiYW1kXCI6XCJ1bmRlcnNjb3JlXCIsXCJjb21tb25qc1wiOlwidW5kZXJzY29yZVwiLFwiY29tbW9uanMyXCI6XCJ1bmRlcnNjb3JlXCJ9Il0sIm5hbWVzIjpbIkNPTVBBUkVfRVFVQUwiLCJDT01QQVJFX0FTQ0VORElORyIsIkNPTVBBUkVfREVTQ0VORElORyIsIktFWVNfUFVCTElTSCIsImNvbXBhcmUiLCJ2YWx1ZV9hIiwidmFsdWVfYiIsIl8iLCJpc1N0cmluZyIsImxvY2FsZUNvbXBhcmUiLCJDb2xsZWN0aW9uT2JzZXJ2YWJsZSIsImFyZ3MiLCJldmVudCIsImFyZyIsImtiIiwiaWdub3JlIiwiaW5fZWRpdCIsIndhc1JlbGVhc2VkIiwidW5kZWZpbmVkIiwiYXV0b19jb21wYWN0IiwiY29tcGFjdCIsIl9jb2xsZWN0aW9uIiwibm90aWZ5U3Vic2NyaWJlcnMiLCJfc2VsZWN0TW9kZWwiLCJvYnNlcnZhYmxlIiwidXRpbHMiLCJ3cmFwcGVkT2JzZXJ2YWJsZSIsImNvbGxlY3Rpb24iLCJpbmRleE9mIiwidmlld19tb2RlbCIsInZpZXdNb2RlbEJ5TW9kZWwiLCJjb21wYXJhdG9yIiwiX2NvbXBhcmF0b3IiLCJwdXNoIiwiX2NyZWF0ZVZpZXdNb2RlbCIsInNvcnQiLCJ2bSIsInNwbGljZSIsIl9vbk1vZGVsUmVtb3ZlIiwibW9kZWxzX29ubHkiLCJfb25Db2xsZWN0aW9uQ2hhbmdlIiwibW9kZWxzX29yX3ZpZXdfbW9kZWxzIiwibGVuZ3RoIiwiaXNNb2RlbCIsIl90aHJvd1VuZXhwZWN0ZWQiLCJpc09iamVjdCIsInBlZWsiLCJoYXNfZmlsdGVycyIsIl9maWx0ZXJzIiwidmlld19tb2RlbHMiLCJtb2RlbHMiLCJmaWx0ZXIiLCJtb2RlbCIsImVhY2giLCJ3cmFwcGVkT2JqZWN0IiwiY3VycmVudF92aWV3X21vZGVsIiwiY3JlYXRlX29wdGlvbnMiLCJzdG9yZSIsImZpbmQiLCJjcmVhdG9yIiwiY29uc3RydWN0b3IiLCJyZXRhaW4iLCJpc0VxdWFsIiwicmVzZXQiLCJpc0NvbGxlY3Rpb24iLCJzaGlmdCIsImlzQXJyYXkiLCJCYWNrYm9uZSIsIkNvbGxlY3Rpb24iLCJpc0Z1bmN0aW9uIiwib3B0aW9ucyIsImFzc2lnbiIsImNvbGxhcHNlT3B0aW9ucyIsImtvIiwib2JzZXJ2YWJsZUFycmF5IiwiX19rYl9pc19jbyIsIl9fa2IiLCJzb3J0X2F0dHJpYnV0ZSIsIl9hdHRyaWJ1dGVDb21wYXJhdG9yIiwiZmlsdGVycyIsIlN0b3JlIiwidXNlT3B0aW9uc09yQ3JlYXRlIiwicGF0aCIsImZhY3RvcnkiLCJ3cmFwcGVkRmFjdG9yeSIsIl9zaGFyZU9yQ3JlYXRlRmFjdG9yeSIsInBhdGhKb2luIiwiY3JlYXRvckZvclBhdGgiLCJwdWJsaXNoTWV0aG9kcyIsImNvbXB1dGVkIiwicmVhZCIsIndyaXRlIiwibmV3X2NvbGxlY3Rpb24iLCJwcmV2aW91c19jb2xsZWN0aW9uIiwidW5iaW5kIiwiYmluZCIsIl9tYXBwZXIiLCJ1bndyYXBPYnNlcnZhYmxlIiwiY3VycmVudF9jb2xsZWN0aW9uIiwibWFwIiwic2xpY2UiLCJzdWJzY3JpYmUiLCJfb25PYnNlcnZhYmxlQXJyYXlDaGFuZ2UiLCJzdGF0aXN0aWNzIiwicmVnaXN0ZXIiLCJfX2tiX3JlbGVhc2VkIiwiYXJyYXkiLCJkaXNwb3NlIiwicmVsZWFzZSIsIndyYXBwZWREZXN0cm95IiwidW5yZWdpc3RlciIsIndyYXBwZWRTdG9yZSIsImlkX2F0dHJpYnV0ZSIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImlkQXR0cmlidXRlIiwidGVzdCIsIm9iamVjdCIsIndyYXBwZWRTdG9yZUlzT3duZWQiLCJjbGVhciIsImFic29sdXRlX21vZGVsc19wYXRoIiwiZmFjdG9yaWVzIiwiZXhpc3RpbmdfY3JlYXRvciIsImhhc1BhdGhNYXBwaW5ncyIsIkZhY3RvcnkiLCJhZGRQYXRoTWFwcGluZ3MiLCJhZGRQYXRoTWFwcGluZyIsIlZpZXdNb2RlbCIsImNyZWF0ZSIsInJlbW92ZSIsIm1vZGVsQXR0cmlidXRlQ29tcGFyZSIsIm1vZGVsX2EiLCJtb2RlbF9iIiwiYXR0cmlidXRlX25hbWUiLCJnZXQiLCJ3cmFwcGVkTW9kZWwiLCJyZXRhaW5PckNyZWF0ZSIsImkiLCJsIiwiaWQiLCJNb2RlbCIsImV4dGVuZCIsImNvbGxlY3Rpb25PYnNlcnZhYmxlIiwic2V0dGluZ3MiLCJvcm0iLCJFdmVudFdhdGNoZXIiLCJlbWl0dGVyIiwib2JqIiwiY2FsbGJhY2tfb3B0aW9ucyIsImV2ZW50X3dhdGNoZXIiLCJtb2RlbF9yZWYiLCJ3cmFwcGVkRXZlbnRXYXRjaGVyIiwicmVnaXN0ZXJDYWxsYmFja3MiLCJ3cmFwcGVkRXZlbnRXYXRjaGVySXNPd25lZCIsImVlIiwiY2FsbGJhY2tzIiwiZXZlbnRfbmFtZSIsIl91bmJpbmRDYWxsYmFja3MiLCJmbiIsImxpc3QiLCJpbmZvIiwidW5iaW5kX2ZuIiwiY3VzdG9tQmluZCIsImtleSIsInVwZGF0ZSIsInNraXBfZW1pdHRlciIsIm5ld19lbWl0dGVyIiwiYXJndW1lbnRzIiwiX29uTW9kZWxMb2FkZWQiLCJfb25Nb2RlbFVubG9hZGVkIiwiTW9kZWxSZWYiLCJjYWxsYmFja19pbmZvIiwiX3Rocm93TWlzc2luZyIsImV2ZW50X25hbWVzIiwiZXZlbnRfc2VsZWN0b3IiLCJzcGxpdCIsIm0iLCJoYXNDaGFuZ2VkIiwiYWRkTW9kZWxFdmVudCIsIm5hbWUiLCJkZWZhdWx0cyIsImVtaXR0ZXJPYnNlcnZhYmxlIiwib3duZXJfcGF0aCIsInBhcmVudF9mYWN0b3J5IiwicGF0aHMiLCJoYXNQYXRoIiwiY3JlYXRlX2luZm8iLCJhbGxfZXhpc3QiLCJfbWVyZ2VBcnJheSIsInJlc3VsdCIsInZhbHVlIiwidW5pb24iLCJfbWVyZ2VPYmplY3QiLCJfa2V5QXJyYXlUb09iamVjdCIsIml0ZW0iLCJfbWVyZ2VPcHRpb25zIiwidW53cmFwTW9kZWxzIiwicmVsZWFzZUNhbGxiYWNrcyIsImRlc3Ryb3kiLCJldmVudF93YXRjaGVyX2lzX293bmVkIiwic3RvcmVfaXNfb3duZWQiLCJzdG9yZXNfcmVmZXJlbmNlcyIsInN0b3JlX3JlZmVyZW5jZXMiLCJwb3AiLCJhcGkiLCJvYnNlcnZhYmxlQ29sbGVjdGlvbiIsImNvbmZpZ3VyZSIsIlJFQ1VTSVZFX0FVVE9fSU5KRUNUIiwiaW5qZWN0Vmlld01vZGVscyIsIk9ic2VydmFibGUiLCJTdGF0aXN0aWNzIiwidmlld01vZGVsIiwibW9kdWxlIiwiZXhwb3J0cyIsInJvb3QiLCJ3aW5kb3ciLCJnbG9iYWwiLCJpbmplY3QiLCJkYXRhIiwiZWxlbWVudCIsInZhbHVlX2FjY2Vzc29yIiwiYWxsX2JpbmRpbmdzX2FjY2Vzc29yIiwibmVzdGVkIiwiZG9JbmplY3QiLCJyZWxlYXNlT25Ob2RlUmVtb3ZlIiwidGFyZ2V0IiwiYmluZGluZ0hhbmRsZXJzIiwiaW5pdCIsImRvQmluZCIsImFwcCIsImFmdGVyQmluZGluZyIsImJlZm9yZUJpbmRpbmciLCJleHByZXNzaW9uIiwiYmluZGluZyIsInNlYXJjaCIsIkZ1bmN0aW9uIiwiZWwiLCJhcHBseUJpbmRpbmdzIiwiZG9jdW1lbnQiLCJyZXN1bHRzIiwiX19rYl9pbmplY3RlZCIsImF0dHIiLCJhdHRyaWJ1dGVzIiwieCIsImNoaWxkTm9kZXMiLCJjaGlsZCIsImNoaWxkUmVzdWx0cyIsIl9rb19hcHBseUJpbmRpbmdzIiwib25SZWFkeSIsInJlYWR5U3RhdGUiLCJzZXRUaW1lb3V0IiwiTElGRUNZQ0xFX01FVEhPRFMiLCJfaWdub3JlIiwiY2FsbGJhY2siLCJjYWxsYmFja1RhcmdldCIsImNhbGxiYWNrQXJncyIsImFwcGx5IiwiZGVwdGgiLCJpc09ic2VydmFibGUiLCJtZXRob2QiLCJpc1JlbGVhc2VhYmxlIiwiaW5kZXgiLCJfX2tiX2lzX28iLCJ2YWx1ZVR5cGUiLCJUWVBFX0NPTExFQ1RJT04iLCJyZWxlYXNlS2V5cyIsIm5vZGUiLCJkb21Ob2RlRGlzcG9zYWwiLCJhZGREaXNwb3NlQ2FsbGJhY2siLCJ0ZW1wbGF0ZSIsImNvbnNvbGUiLCJsb2ciLCJjcmVhdGVFbGVtZW50IiwicmVuZGVyVGVtcGxhdGUiLCJlbmQiLCJhc2MiLCJzdG9yZWRCaW5kaW5nQ29udGV4dEZvck5vZGUiLCJjb250ZXh0Rm9yIiwiZXJyIiwiYWZ0ZXJSZW5kZXIiLCJjaGlsZHJlbiIsImFwcGVuZENoaWxkIiwiY29uY2F0Iiwic2V0IiwiaW5zdGFuY2UiLCJtZXNzYWdlIiwiRXJyb3IiLCJtZXRob2RzIiwib2JzIiwiZGVwZW5kZW5jeURldGVjdGlvbiIsIlR5cGVkVmFsdWUiLCJfdm8iLCJwcmV2aW91c192YWx1ZSIsIl9fa2JfdmFsdWUiLCJ3cmFwcGVkQ3JlYXRvciIsIm5ld192YWx1ZSIsImdldFZhbHVlIiwidmFsdWVfdHlwZSIsIl91cGRhdGVWYWx1ZU9ic2VydmFibGUiLCJuZXdfdHlwZSIsIlRZUEVfQVJSQVkiLCJpc051bGwiLCJUWVBFX01PREVMIiwicmVzb2x2ZU1vZGVsIiwiaXNVbmRlZmluZWQiLCJuZXdfb2JzZXJ2YWJsZSIsImluZmVyQ3JlYXRvciIsIlRZUEVfVU5LTk9XTiIsIlRZUEVfU0lNUExFIiwic3Vic2NyaWJhYmxlIiwiX2V4dGVuZCIsIl9kaXNwb3NlIiwiYXJnczIiLCJLRVlTX0lORk8iLCJrZXlfb3JfaW5mbyIsIl92bSIsIl92YWx1ZSIsIl9tb2RlbCIsImV3IiwidW53cmFwcGVkX25ld192YWx1ZSIsInNldFZhbHVlIiwib3duZXIiLCJuZXdfbW9kZWwiLCJyYXdWYWx1ZSIsIkxvY2FsaXplZE9ic2VydmFibGUiLCJsb2NhbGl6ZXIiLCJEZWZhdWx0T2JzZXJ2YWJsZSIsImRlZmF1bHRPYnNlcnZhYmxlIiwibW9kZWxfZXZlbnRzX3RyYWNrZXIiLCJyZWdpc3RlcmVkX3RyYWNrZXIiLCJzdGF0c19zdHJpbmciLCJldmVudF9ncm91cHMiLCJncm91cEJ5IiwicmVnaXN0ZXJlZFRyYWNrZXIiLCJ0eXBlX3RyYWNrZXIiLCJ0eXBlIiwiY291bnQiLCJzdWNjZXNzX21lc3NhZ2UiLCJ3cml0dGVuIiwic3RhdHMiLCJldmVudHMiLCJfZXZlbnRzIiwiX2NhbGxiYWNrcyIsImtleXMiLCJrZXlfIiwidGFpbCIsIm5leHQiLCJvYnNlcnZhYmxlX3JlY29yZHMiLCJyZXBsYWNlZF9vYnNlcnZhYmxlcyIsImluc3RhbmNlcyIsInJlY29yZHMiLCJjaWQiLCJfY2FuUmVnaXN0ZXIiLCJjdXJyZW50X29ic2VydmFibGUiLCJfZ2V0T3JDcmVhdGVTdG9yZVJlZmVyZW5jZXMiLCJyZWZfY291bnQiLCJfcmV0aXJlIiwiX2FkZCIsImRlZXBfcmV0YWluIiwiX2NyZWF0b3IiLCJjcmVhdGVGcm9tRGVmYXVsdENyZWF0b3IiLCJjdXJyZW50X29iaiIsIl9yZWZDb3VudCIsImZvcmNlIiwiX3N0b3JlUmVmZXJlbmNlcyIsIl9jbGVhclN0b3JlUmVmZXJlbmNlcyIsIl9yZW1vdmUiLCJfY3JlYXRvcklkIiwiX2NpZCIsInJlZHVjZSIsIm1lbW8iLCJ1bmlxdWVJZCIsIl9fa2JfY2lkcyIsInJlZiIsIm9yU2V0IiwiZGVmYXVsdF92YWx1ZSIsInBhdGgxIiwicGF0aDIiLCJhc3NpZ25WaWV3TW9kZWxLZXkiLCJ2bV9rZXkiLCJpbnRlcm5hbHMiLCJjcmVhdGVPYnNlcnZhYmxlIiwiZXhjbHVkZXMiLCJzdGF0aWNzIiwiY3JlYXRlU3RhdGljT2JzZXJ2YWJsZXMiLCJoYXMiLCJzdGF0aWNfZGVmYXVsdHMiLCJLRVlTX09QVElPTlMiLCJjcmVhdGVPYnNlcnZhYmxlcyIsInJldXNlIiwicmVxdWlyZXMiLCJtYXBwaW5ncyIsInZtX2tleXMiLCJtYXBwaW5nX2luZm8iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0Qs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QUNsQyxjQUFNd04sTUFBTSxHQUFHRCxrQkFBa0IsQ0FBQyxNQUFELEVBQU92TixHQUFQLENBQWpDOztBQUNBLGNBQUl3TixNQUFKLEVBQVk7QUFDVixnQkFBSSxDQUFDdFgsaURBQUMsQ0FBQ0MsUUFBRixDQUFXbVksWUFBWCxDQUFELElBQTZCLENBQUNBLFlBQVksQ0FBQ3RPLEdBQS9DLEVBQW9Ec08sWUFBWSxDQUFDdE8sR0FBYixHQUFtQndOLE1BQW5CO0FBQ3BELGtCQUFJLENBQUNBLE1BQUQsQ0FBSixHQUFlL1csMkNBQUUsQ0FBQ1UsVUFBSCxDQUFjNEIsS0FBZCxFQUFxQnVWLFlBQXJCLEVBQW1DLE1BQUksQ0FBQy9ULElBQUwsQ0FBVXBCLGNBQTdDLEVBQTZELE1BQTdELENBQWY7QUFDQSxrQkFBSSxDQUFDb0IsSUFBTCxDQUFVL0MsVUFBVixDQUFxQmdXLE1BQXJCLElBQStCLE1BQUksQ0FBQ0EsTUFBRCxDQUFuQztBQUNEO0FBQ0YsU0FQRDtBQVFEO0FBQ0Y7Ozs7S0FHSDs7O2dCQTVIcUI1UCxTLFlBRUg5RCwrQ0FBUSxDQUFDMkUsS0FBVCxDQUFlQyxNOzs7QUEySDFCLElBQU1zRSxTQUFTLEdBQUcsU0FBWkEsU0FBWTtBQUFBLHFDQUFJMU0sSUFBSjtBQUFJQSxRQUFKO0FBQUE7O0FBQUEsb0JBQWlCc0gsU0FBakIsRUFBOEJ0SCxJQUE5QjtBQUFBLENBQWxCLEM7Ozs7Ozs7Ozs7O0FDdk9QLHNEOzs7Ozs7Ozs7OztBQ0FBLHNEOzs7Ozs7Ozs7OztBQ0FBLHdEIiwiZmlsZSI6Imtub2NrYmFjay1jb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwiYmFja2JvbmVcIiksIHJlcXVpcmUoXCJrbm9ja291dFwiKSwgcmVxdWlyZShcInVuZGVyc2NvcmVcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wiYmFja2JvbmVcIiwgXCJrbm9ja291dFwiLCBcInVuZGVyc2NvcmVcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wia2JcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJiYWNrYm9uZVwiKSwgcmVxdWlyZShcImtub2Nrb3V0XCIpLCByZXF1aXJlKFwidW5kZXJzY29yZVwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wia2JcIl0gPSBmYWN0b3J5KHJvb3RbXCJCYWNrYm9uZVwiXSwgcm9vdFtcImtvXCJdLCByb290W1wiX1wiXSk7XG59KSh3aW5kb3csIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfYmFja2JvbmVfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9rbm9ja291dF9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3VuZGVyc2NvcmVfXykge1xucmV0dXJuICIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vcGFja2FnZXMva25vY2tiYWNrLWNvcmUvc3JjL2luZGV4LmpzXCIpO1xuIiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xufSBjYXRjaCAoZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIikgZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcmlnaW5hbE1vZHVsZSkge1xuXHRpZiAoIW9yaWdpbmFsTW9kdWxlLndlYnBhY2tQb2x5ZmlsbCkge1xuXHRcdHZhciBtb2R1bGUgPSBPYmplY3QuY3JlYXRlKG9yaWdpbmFsTW9kdWxlKTtcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcblx0XHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJsb2FkZWRcIiwge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBtb2R1bGUubDtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImlkXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJleHBvcnRzXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWVcblx0XHR9KTtcblx0XHRtb2R1bGUud2VicGFja1BvbHlmaWxsID0gMTtcblx0fVxuXHRyZXR1cm4gbW9kdWxlO1xufTtcbiIsIi8qXG4gIGtub2NrYmFjay5qcyAyLjAuMC1hbHBoYS4xXG4gIENvcHlyaWdodCAoYykgIDIwMTEtMjAxNiBLZXZpbiBNYWxha29mZi5cbiAgTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiAgU291cmNlOiBodHRwczovL2dpdGh1Yi5jb20va21hbGFrb2ZmL2tub2NrYmFja1xuICBEZXBlbmRlbmNpZXM6IEtub2Nrb3V0LmpzLCBCYWNrYm9uZS5qcywgYW5kIFVuZGVyc2NvcmUuanMgKG9yIExvRGFzaC5qcykuXG4gIE9wdGlvbmFsIGRlcGVuZGVuY2llczogQmFja2JvbmUuTW9kZWxSZWYuanMgYW5kIEJhY2tib25lT1JNLlxuKi9cblxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgQmFja2JvbmUgZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IGtvIGZyb20gJ2tub2Nrb3V0JztcblxuaW1wb3J0IGtiIGZyb20gJy4va2InO1xuXG5jb25zdCBDT01QQVJFX0VRVUFMID0gMDtcbmNvbnN0IENPTVBBUkVfQVNDRU5ESU5HID0gLTE7XG5jb25zdCBDT01QQVJFX0RFU0NFTkRJTkcgPSAxO1xuXG5jb25zdCBLRVlTX1BVQkxJU0ggPSBbJ2Rlc3Ryb3knLCAnc2hhcmVPcHRpb25zJywgJ2ZpbHRlcnMnLCAnY29tcGFyYXRvcicsICdzb3J0QXR0cmlidXRlJywgJ3ZpZXdNb2RlbEJ5TW9kZWwnLCAnaGFzVmlld01vZGVscyddO1xuXG5leHBvcnQgY29uc3QgY29tcGFyZSA9ICh2YWx1ZV9hLCB2YWx1ZV9iKSA9PiB7XG4gIC8vIFN0cmluZyBjb21wYXJlXG4gIGlmIChfLmlzU3RyaW5nKHZhbHVlX2EpKSB7IHJldHVybiB2YWx1ZV9hLmxvY2FsZUNvbXBhcmUoYCR7dmFsdWVfYn1gKTsgfVxuICBpZiAoXy5pc1N0cmluZyh2YWx1ZV9iKSkgeyByZXR1cm4gdmFsdWVfYi5sb2NhbGVDb21wYXJlKGAke3ZhbHVlX2F9YCk7IH1cblxuICAvLyBjb21wYXJlIHJhdyB2YWx1ZXNcbiAgcmV0dXJuICh2YWx1ZV9hID09PSB2YWx1ZV9iKSA/IENPTVBBUkVfRVFVQUwgOiAoKHZhbHVlX2EgPCB2YWx1ZV9iKSA/IENPTVBBUkVfQVNDRU5ESU5HIDogQ09NUEFSRV9ERVNDRU5ESU5HKTtcbn07XG5cbi8vIEJhc2UgY2xhc3MgZm9yIG9ic2VydmluZyBjb2xsZWN0aW9ucy5cbi8vXG4vLyBAZXhhbXBsZSBIb3cgdG8gY3JlYXRlIGEga28uQ29sbGVjdGlvbk9ic2VydmFibGUgdXNpbmcgdGhlIGtvLmNvbGxlY3Rpb25PYnNlcnZhYmxlIGZhY3RvcnkuXG4vLyAgIHZhciBjb2xsZWN0aW9uID0gbmV3IENvbGxlY3Rpb24oW3tuYW1lOiAnbmFtZTEnfSwge25hbWU6ICduYW1lMid9XSk7XG4vLyAgIHZhciB2aWV3X21vZGVsID0ge1xuLy8gICAgIHRvZG9zOiBrYi5jb2xsZWN0aW9uT2JzZXJ2YWJsZShjb2xsZWN0aW9uKVxuLy8gICB9O1xuLy9cbi8vIEBleGFtcGxlIEhvdyB0byBhY2Nlc3MgYW5kIGNoYW5nZSB0aGUgb2JzZXJ2ZWQgY29sbGVjdGlvbi5cbi8vICAgIHZhciB0b2RvcyA9IG5ldyBrYi5Db2xsZWN0aW9uT2JzZXJ2YWJsZShuZXcgQmFja2JvbmUuQ29sbGVjdGlvbihbe25hbWU6ICduYW1lMSd9LCB7bmFtZTogJ25hbWUyJ31dKTtcbi8vICAgIHZhciBjdXJyZW50X2NvbGxlY3Rpb24gPSB0b2Rvcy5jb2xsZWN0aW9uKCk7IC8vIGdldFxuLy8gICAgdG9kb3MuY29sbGVjdGlvbihuZXcgQmFja2JvbmUuQ29sbGVjdGlvbihbe25hbWU6ICduYW1lMyd9LCB7bmFtZTogJ25hbWU0J31dKSk7IC8vIHNldFxuLy9cbi8vIEBtZXRob2QgLmV4dGVuZChwcm90b3R5cGVfcHJvcGVydGllcywgY2xhc3NfcHJvcGVydGllcylcbi8vICAgQ2xhc3MgbWV0aG9kIGZvciBKYXZhU2NyaXB0IGluaGVyaXRhbmNlLlxuLy8gICBAcGFyYW0gW09iamVjdF0gcHJvdG90eXBlX3Byb3BlcnRpZXMgdGhlIHByb3BlcnRpZXMgdG8gYWRkIHRvIHRoZSBwcm90b3R5cGVcbi8vICAgQHBhcmFtIFtPYmplY3RdIGNsYXNzX3Byb3BlcnRpZXMgdGhlIHByb3BlcnRpZXMgdG8gYWRkIHRvIHRoZSBjbGFzc1xuLy8gICBAcmV0dXJuIFtrby5vYnNlcnZhYmxlXSB0aGUgY29uc3RydWN0b3IgZG9lcyBub3QgcmV0dXJuICd0aGlzJyBidXQgYSBrby5vYnNlcnZhYmxlQXJyYXlcbi8vICAgQGV4YW1wbGVcbi8vICAgICB2YXIgTXlDb2xsZWN0aW9uT2JzZXJ2YWJsZSA9IGtiLkNvbGxlY3Rpb25PYnNlcnZhYmxlLmV4dGVuZCh7XG4vLyAgICAgICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIG9wdGlvbnMpIHtcbi8vICAgICAgICAgIC8vIHRoZSBjb25zdHJ1Y3RvciBkb2VzIG5vdCByZXR1cm4gJ3RoaXMnIGJ1dCBhIGtvLm9ic2VydmFibGVBcnJheVxuLy8gICAgICAgICAgcmV0dXJuIGtiLkNvbGxlY3Rpb25PYnNlcnZhYmxlLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIGNvbGxlY3Rpb24sIHtcbi8vICAgICAgICAgICAgdmlld19tb2RlbDogTXlWaWV3TW9kZWwsXG4vLyAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbi8vICAgICAgICB9KTtcbi8vICAgICB9KTtcbi8vXG4vLyBAbWV0aG9kICNjb2xsZWN0aW9uKClcbi8vICAgRHVhbC1wdXJwb3NlIGdldHRlci9zZXR0ZXIga28uY29tcHV0ZWQgZm9yIHRoZSBvYnNlcnZlZCBjb2xsZWN0aW9uLlxuLy8gICBAcmV0dXJuIFtDb2xsZWN0aW9ufHZvaWRdIGdldHRlcjogdGhlIGNvbGxlY3Rpb24gd2hvc2UgbW9kZWxzIGFyZSBiZWluZyBvYnNlcnZlZCAoY2FuIGJlIG51bGwpIE9SIHNldHRlcjogdm9pZFxuLy9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbGxlY3Rpb25PYnNlcnZhYmxlIHtcbiAgLy8gQG5vZG9jXG4gIHN0YXRpYyBleHRlbmQgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQ7XG4gICAgLy8gZm9yIEJhY2tib25lIG5vbi1Db2ZmZWVzY3JpcHQgaW5oZXJpdGFuY2UgKHVzZSBcImtiLlN1cGVyQ2xhc3MuZXh0ZW5kKHt9KVwiIGluIEphdmFzY3JpcHQgaW5zdGVhZCBvZiBcImNsYXNzIE15Q2xhc3MgZXh0ZW5kcyBrYi5TdXBlckNsYXNzXCIpXG5cbiAgLy8gVXNlZCB0byBjcmVhdGUgYSBuZXcga2IuQ29sbGVjdGlvbk9ic2VydmFibGUuXG4gIC8vXG4gIC8vIFdoZW4gdGhlIG9ic2VydmFibGUgaXMgdXBkYXRlZCwgdGhlIGZvbGxvd2luZyBCYWNrYm9uZS5FdmVudHMgYXJlIHRyaWdnZXJlZDpcbiAgLy9cbiAgLy8gKiAqKiphZGQqKio6ICh2aWV3X21vZGVsLCBjb2xsZWN0aW9uX29ic2VydmFibGUpIG9yIGlmIGJhdGNoOiAoY29sbGVjdGlvbl9vYnNlcnZhYmxlKVxuICAvLyAqICoqKnJlc29ydCoqKjogKHZpZXdfbW9kZWwsIGNvbGxlY3Rpb25fb2JzZXJ2YWJsZSwgbmV3X2luZGV4KSBvciBpZiBiYXRjaDogKGNvbGxlY3Rpb25fb2JzZXJ2YWJsZSlcbiAgLy8gKiAqKipyZW1vdmUqKio6ICh2aWV3X21vZGVsLCBjb2xsZWN0aW9uX29ic2VydmFibGUpIG9yIGlmIGJhdGNoOiAoY29sbGVjdGlvbl9vYnNlcnZhYmxlKVxuICAvL1xuICAvLyBAcGFyYW0gW0NvbGxlY3Rpb25dIGNvbGxlY3Rpb24gdGhlIGNvbGxlY3Rpb24gdG8gb2JzZXJ2ZSAoY2FuIGJlIG51bGwpXG4gIC8vIEBwYXJhbSBbT2JqZWN0XSBvcHRpb25zIHRoZSBjcmVhdGUgb3B0aW9uc1xuICAvLyBAb3B0aW9uIG9wdGlvbnMgW0Jvb2xlYW5dIG1vZGVsc19vbmx5IGZsYWcgZm9yIHNraXBwaW5nIHRoZSBjcmVhdGlvbiBvZiB2aWV3IG1vZGVscy4gVGhlIGNvbGxlY3Rpb24gb2JzZXJ2YWJsZSB3aWxsIGJlIHBvcHVsYXRlZCB3aXRoIChwb3NzaWJseSBzb3J0ZWQpIG1vZGVscy5cbiAgLy8gQG9wdGlvbiBvcHRpb25zIFtCb29sZWFuXSBhdXRvX2NvbXBhY3QgZmxhZyB1c2VkIHRvIGNvbXBhY3QgbWVtb3J5IHVzZWQgYnkgdGhlIGNvbGxlY3Rpb24gb2JzZXJ2YWJsZSB3aGVuIGxhcmdlIGNoYW5nZXMgb2NjdXIsIGVnLiByZXNldHRpbmcgdGhlIGNvbGxlY3Rpb24uXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbQ29uc3RydWN0b3JdIHZpZXdfbW9kZWwgdGhlIHZpZXcgbW9kZWwgY29uc3RydWN0b3IgdXNlZCBmb3IgbW9kZWxzIGluIHRoZSBjb2xsZWN0aW9uLiBTaWduYXR1cmU6IGNvbnN0cnVjdG9yKG1vZGVsLCBvcHRpb25zKVxuICAvLyBAb3B0aW9uIG9wdGlvbnMgW0Z1bmN0aW9uXSBjcmVhdGUgYSBmdW5jdGlvbiB1c2VkIHRvIGNyZWF0ZSBhIHZpZXcgbW9kZWwgZm9yIG1vZGVscyBpbiB0aGUgY29sbGVjdGlvbi4gU2lnbmF0dXJlOiBjcmVhdGUobW9kZWwsIG9wdGlvbnMpXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbT2JqZWN0XSBmYWN0b3JpZXMgYSBtYXAgb2YgZG90LWRlbGltaW5hdGVkIHBhdGhzO1xuICAvLyBmb3IgZXhhbXBsZSAnbW9kZWxzLm93bmVyJzoga2IuVmlld01vZGVsIHRvIGVpdGhlciBjb25zdHJ1Y3RvcnMgb3IgY3JlYXRlIGZ1bmN0aW9ucy4gU2lnbmF0dXJlOiAnc29tZS5wYXRoJzogZnVuY3Rpb24ob2JqZWN0LCBvcHRpb25zKVxuICAvLyBAb3B0aW9uIG9wdGlvbnMgW0Z1bmN0aW9uXSBjb21wYXJhdG9yIGEgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIHRvIHNvcnQgYW4gb2JqZWN0LlxuICAvLyBTaWduYXR1cmU6IGBmdW5jdGlvbihtb2RlbF9hLCBtb2RlbF9iKWAgcmV0dXJucyBuZWdhdGl2ZSB2YWx1ZSBmb3IgYXNjZW5kaW5nLCAwIGZvciBlcXVhbCwgYW5kIHBvc2l0aXZlIGZvciBkZXNjZW5kaW5nXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbU3RyaW5nXSBzb3J0X2F0dHJpYnV0ZSB0aGUgbmFtZSBvZiBhbiBhdHRyaWJ1dGUuIERlZmF1bHQ6IHJlc29ydCBvbiBhbGwgY2hhbmdlcyB0byBhIG1vZGVsLlxuICAvLyBAb3B0aW9uIG9wdGlvbnMgW0lkfEZ1bmN0aW9ufEFycmF5XSBmaWx0ZXJzIGZpbHRlcnMgY2FuIGJlIGluZGl2aWR1YWwgaWRzIChvYnNlcnZhYmxlIG9yIHNpbXBsZSkgb3IgYXJyYXlzIG9mIGlkcywgZnVuY3Rpb25zLCBvciBhcnJheXMgb2YgZnVuY3Rpb25zLlxuICAvLyBAb3B0aW9uIG9wdGlvbnMgW1N0cmluZ10gcGF0aCB0aGUgcGF0aCB0byB0aGUgdmFsdWUgKHVzZWQgdG8gY3JlYXRlIHJlbGF0ZWQgb2JzZXJ2YWJsZXMgZnJvbSB0aGUgZmFjdG9yeSkuXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBba2IuU3RvcmVdIHN0b3JlIGEgc3RvcmUgdXNlZCB0byBjYWNoZSBhbmQgc2hhcmUgdmlldyBtb2RlbHMuXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBba2IuRmFjdG9yeV0gZmFjdG9yeSBhIGZhY3RvcnkgdXNlZCB0byBjcmVhdGUgdmlldyBtb2RlbHMuXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbT2JqZWN0XSBvcHRpb25zIGEgc2V0IG9mIG9wdGlvbnMgbWVyZ2UgaW50byB0aGVzZSBvcHRpb25zLiBVc2VmdWwgZm9yIGV4dGVuZGluZyBvcHRpb25zIHdoZW4gZGVyaXZpbmcgY2xhc3NlcyByYXRoZXIgdGhhbiBtZXJnaW5nIHRoZW0gYnkgaGFuZC5cbiAgLy8gQHJldHVybiBba28ub2JzZXJ2YWJsZUFycmF5XSB0aGUgY29uc3RydWN0b3IgZG9lcyBub3QgcmV0dXJuICd0aGlzJyBidXQgYSBrby5vYnNlcnZhYmxlQXJyYXlcbiAgLy8gQG5vdGUgdGhlIGNvbnN0cnVjdG9yIGRvZXMgbm90IHJldHVybiAndGhpcycgYnV0IGEga28ub2JzZXJ2YWJsZUFycmF5XG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4ga2IuaWdub3JlKCgpID0+IHtcbiAgICAgIGxldCBjb2xsZWN0aW9uID0gbnVsbDtcbiAgICAgIGlmIChrYi5pc0NvbGxlY3Rpb24oYXJnc1swXSkpIGNvbGxlY3Rpb24gPSBhcmdzLnNoaWZ0KCk7XG4gICAgICBlbHNlIGNvbGxlY3Rpb24gPSBfLmlzQXJyYXkoYXJnc1swXSkgPyBuZXcgQmFja2JvbmUuQ29sbGVjdGlvbihhcmdzLnNoaWZ0KCkpIDogbmV3IEJhY2tib25lLkNvbGxlY3Rpb24oKTtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24oYXJnc1swXSkpIGFyZ3NbMF0gPSB7IHZpZXdfbW9kZWw6IGFyZ3NbMF0gfTtcblxuICAgICAgbGV0IG9wdGlvbnMgPSB7fTtcbiAgICAgIF8uZWFjaChhcmdzLCAoYXJnKSA9PiB7IGtiLmFzc2lnbihvcHRpb25zLCBhcmcpOyBvcHRpb25zID0ga2IudXRpbHMuY29sbGFwc2VPcHRpb25zKG9wdGlvbnMpOyB9KTtcblxuICAgICAgbGV0IG9ic2VydmFibGUgPSBrYi51dGlscy53cmFwcGVkT2JzZXJ2YWJsZSh0aGlzLCBrby5vYnNlcnZhYmxlQXJyYXkoW10pKTtcbiAgICAgIG9ic2VydmFibGUuX19rYl9pc19jbyA9IHRydWU7IC8vIG1hcmsgYXMgYSBrYi5Db2xsZWN0aW9uT2JzZXJ2YWJsZVxuICAgICAgdGhpcy5pbl9lZGl0ID0gMDtcblxuICAgICAgLy8gYmluZCBjYWxsYmFja3NcbiAgICAgIGlmICghdGhpcy5fX2tiKSB0aGlzLl9fa2IgPSB7fTtcblxuICAgICAgLy8gb3B0aW9uc1xuICAgICAgb3B0aW9ucyA9IGtiLnV0aWxzLmNvbGxhcHNlT3B0aW9ucyhvcHRpb25zKTtcbiAgICAgIGlmIChvcHRpb25zLmF1dG9fY29tcGFjdCkgeyB0aGlzLmF1dG9fY29tcGFjdCA9IHRydWU7IH1cblxuICAgICAgaWYgKG9wdGlvbnMuc29ydF9hdHRyaWJ1dGUpIHRoaXMuX2NvbXBhcmF0b3IgPSBrby5vYnNlcnZhYmxlKHRoaXMuX2F0dHJpYnV0ZUNvbXBhcmF0b3Iob3B0aW9ucy5zb3J0X2F0dHJpYnV0ZSkpO1xuICAgICAgZWxzZSB0aGlzLl9jb21wYXJhdG9yID0ga28ub2JzZXJ2YWJsZShvcHRpb25zLmNvbXBhcmF0b3IpO1xuXG4gICAgICBpZiAob3B0aW9ucy5maWx0ZXJzKSB0aGlzLl9maWx0ZXJzID0ga28ub2JzZXJ2YWJsZUFycmF5KF8uaXNBcnJheShvcHRpb25zLmZpbHRlcnMpID8gb3B0aW9ucy5maWx0ZXJzIDogW29wdGlvbnMuZmlsdGVyc10pO1xuICAgICAgZWxzZSB0aGlzLl9maWx0ZXJzID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcblxuICAgICAgLy8gY3JlYXRlIG9wdGlvbnNcbiAgICAgIHRoaXMuY3JlYXRlX29wdGlvbnMgPSB7IHN0b3JlOiBrYi5TdG9yZS51c2VPcHRpb25zT3JDcmVhdGUob3B0aW9ucywgY29sbGVjdGlvbiwgb2JzZXJ2YWJsZSkgfTtcbiAgICAgIGNvbnN0IGNyZWF0ZV9vcHRpb25zID0gdGhpcy5jcmVhdGVfb3B0aW9ucztcbiAgICAgIGtiLnV0aWxzLndyYXBwZWRPYmplY3Qob2JzZXJ2YWJsZSwgY29sbGVjdGlvbik7XG5cbiAgICAgIC8vIHZpZXcgbW9kZWwgZmFjdG9yeSBjcmVhdGUgZmFjdG9yaWVzXG4gICAgICB0aGlzLnBhdGggPSBvcHRpb25zLnBhdGg7XG4gICAgICBjcmVhdGVfb3B0aW9ucy5mYWN0b3J5ID0ga2IudXRpbHMud3JhcHBlZEZhY3Rvcnkob2JzZXJ2YWJsZSwgdGhpcy5fc2hhcmVPckNyZWF0ZUZhY3Rvcnkob3B0aW9ucykpO1xuICAgICAgY3JlYXRlX29wdGlvbnMucGF0aCA9IGtiLnV0aWxzLnBhdGhKb2luKG9wdGlvbnMucGF0aCwgJ21vZGVscycpO1xuXG4gICAgICAvLyBjaGVjayBmb3IgbW9kZWxzIG9ubHlcbiAgICAgIGNyZWF0ZV9vcHRpb25zLmNyZWF0b3IgPSBjcmVhdGVfb3B0aW9ucy5mYWN0b3J5LmNyZWF0b3JGb3JQYXRoKG51bGwsIGNyZWF0ZV9vcHRpb25zLnBhdGgpO1xuICAgICAgaWYgKGNyZWF0ZV9vcHRpb25zLmNyZWF0b3IpIHsgdGhpcy5tb2RlbHNfb25seSA9IGNyZWF0ZV9vcHRpb25zLmNyZWF0b3IubW9kZWxzX29ubHk7IH1cblxuICAgICAgLy8gcHVibGlzaCBwdWJsaWMgaW50ZXJmYWNlIG9uIHRoZSBvYnNlcnZhYmxlIGFuZCByZXR1cm4gaW5zdGVhZCBvZiB0aGlzXG4gICAgICBrYi5wdWJsaXNoTWV0aG9kcyhvYnNlcnZhYmxlLCB0aGlzLCBLRVlTX1BVQkxJU0gpO1xuXG4gICAgICAvLyBzdGFydCB0aGUgcHJvY2Vzc2luZ1xuICAgICAgdGhpcy5fY29sbGVjdGlvbiA9IGtvLm9ic2VydmFibGUoY29sbGVjdGlvbik7XG4gICAgICB0aGlzLmNvbGxlY3Rpb24gPSBrby5jb21wdXRlZCh7XG4gICAgICAgIHJlYWQ6ICgpID0+IHRoaXMuX2NvbGxlY3Rpb24oKSxcbiAgICAgICAgd3JpdGU6IG5ld19jb2xsZWN0aW9uID0+IGtiLmlnbm9yZSgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgcHJldmlvdXNfY29sbGVjdGlvbiA9IHRoaXMuX2NvbGxlY3Rpb24oKTtcbiAgICAgICAgICBpZiAocHJldmlvdXNfY29sbGVjdGlvbiA9PT0gbmV3X2NvbGxlY3Rpb24pIHJldHVybiB1bmRlZmluZWQ7IC8vIG5vIGNoYW5nZVxuXG4gICAgICAgICAgLy8gQGNyZWF0ZV9vcHRpb25zLnN0b3JlLnJldXNlKEAsIG5ld19jb2xsZWN0aW9uKSAjIG5vdCBtZWFudCB0byBiZSBzaGFyZWRcbiAgICAgICAgICBrYi51dGlscy53cmFwcGVkT2JqZWN0KG9ic2VydmFibGUsIG5ld19jb2xsZWN0aW9uKTtcblxuICAgICAgICAgIC8vIGNsZWFuIHVwXG4gICAgICAgICAgaWYgKHByZXZpb3VzX2NvbGxlY3Rpb24pIHByZXZpb3VzX2NvbGxlY3Rpb24udW5iaW5kKCdhbGwnLCB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UpO1xuXG4gICAgICAgICAgLy8gc3RvcmUgaW4gX2tiX2NvbGxlY3Rpb24gc28gdGhhdCBhIGNvbGxlY3Rpb24oKSBmdW5jdGlvbiBjYW4gYmUgZXhwb3NlZCBvbiB0aGUgb2JzZXJ2YWJsZSBhbmQgc28gdGhlIGNvbGxlY3Rpb24gY2FuIGJlXG4gICAgICAgICAgaWYgKG5ld19jb2xsZWN0aW9uKSBuZXdfY29sbGVjdGlvbi5iaW5kKCdhbGwnLCB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UpO1xuXG4gICAgICAgICAgLy8gdXBkYXRlIHJlZmVyZW5jZXMgKGluY2x1ZGluZyBub3RpZmljYXRpb24pXG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbGxlY3Rpb24obmV3X2NvbGxlY3Rpb24pO1xuICAgICAgICB9KSxcbiAgICAgIH0pO1xuICAgICAgb2JzZXJ2YWJsZS5jb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uO1xuICAgICAgaWYgKGNvbGxlY3Rpb24pIGNvbGxlY3Rpb24uYmluZCgnYWxsJywgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKTsgLy8gYmluZCBub3dcblxuICAgICAgLy8gb2JzZXJ2YWJsZSB0aGF0IHdpbGwgcmUtdHJpZ2dlciB3aGVuIHNvcnQgb3IgZmlsdGVycyBvciBjb2xsZWN0aW9uIGNoYW5nZXNcbiAgICAgIHRoaXMuX21hcHBlciA9IGtvLmNvbXB1dGVkKCgpID0+IHtcbiAgICAgICAgY29uc3QgY29tcGFyYXRvciA9IHRoaXMuX2NvbXBhcmF0b3IoKTsgLy8gY3JlYXRlIGRlcGVuZGVuY3lcbiAgICAgICAgY29uc3QgZmlsdGVycyA9IHRoaXMuX2ZpbHRlcnMoKTsgLy8gY3JlYXRlIGRlcGVuZGVuY3lcbiAgICAgICAgaWYgKGZpbHRlcnMpIF8uZWFjaChmaWx0ZXJzLCBmaWx0ZXIgPT4ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShmaWx0ZXIpKTsgLy8gY3JlYXRlIGEgZGVwZW5kZW5jeVxuICAgICAgICBjb25zdCBjdXJyZW50X2NvbGxlY3Rpb24gPSB0aGlzLl9jb2xsZWN0aW9uKCk7IC8vIGNyZWF0ZSBkZXBlbmRlbmN5XG4gICAgICAgIGlmICh0aGlzLmluX2VkaXQpIHJldHVybjsgLy8gd2UgYXJlIGRvaW5nIHRoZSBlZGl0aW5nXG5cbiAgICAgICAgLy8gbm8gbW9kZWxzXG4gICAgICAgIG9ic2VydmFibGUgPSBrYi51dGlscy53cmFwcGVkT2JzZXJ2YWJsZSh0aGlzKTtcblxuICAgICAgICBsZXQgbW9kZWxzO1xuICAgICAgICBpZiAoY3VycmVudF9jb2xsZWN0aW9uKSBtb2RlbHMgPSBjdXJyZW50X2NvbGxlY3Rpb24ubW9kZWxzO1xuXG4gICAgICAgIGxldCB2aWV3X21vZGVscztcbiAgICAgICAgaWYgKCFtb2RlbHMgfHwgKGN1cnJlbnRfY29sbGVjdGlvbi5tb2RlbHMubGVuZ3RoID09PSAwKSkgdmlld19tb2RlbHMgPSBbXTtcbiAgICAgICAgLy8gcHJvY2VzcyBmaWx0ZXJzLCBzb3J0aW5nLCBldGNcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgLy8gYXBwbHkgZmlsdGVyc1xuICAgICAgICAgIG1vZGVscyA9IF8uZmlsdGVyKG1vZGVscywgbW9kZWwgPT4gIWZpbHRlcnMubGVuZ3RoIHx8IHRoaXMuX3NlbGVjdE1vZGVsKG1vZGVsKSk7XG5cbiAgICAgICAgICAvLyBhcHBseSBzb3J0aW5nXG4gICAgICAgICAgaWYgKGNvbXBhcmF0b3IpIHZpZXdfbW9kZWxzID0gXy5tYXAobW9kZWxzLCBtb2RlbCA9PiB0aGlzLl9jcmVhdGVWaWV3TW9kZWwobW9kZWwpKS5zb3J0KGNvbXBhcmF0b3IpO1xuICAgICAgICAgIC8vIG5vIHNvcnRpbmdcbiAgICAgICAgICBlbHNlIGlmICh0aGlzLm1vZGVsc19vbmx5KSB2aWV3X21vZGVscyA9IGZpbHRlcnMubGVuZ3RoID8gbW9kZWxzIDogbW9kZWxzLnNsaWNlKCk7IC8vIGNsb25lIHRoZSBhcnJheSBpZiBpdCB3YXNuJ3QgZmlsdGVyZWRcbiAgICAgICAgICBlbHNlIHZpZXdfbW9kZWxzID0gXy5tYXAobW9kZWxzLCBtb2RlbCA9PiB0aGlzLl9jcmVhdGVWaWV3TW9kZWwobW9kZWwpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgb2JzZXJ2YWJsZSBhcnJheSBmb3IgdGhpcyBjb2xsZWN0aW9uIG9ic2VydmFibGVcbiAgICAgICAgdGhpcy5pbl9lZGl0Kys7XG4gICAgICAgIG9ic2VydmFibGUodmlld19tb2RlbHMpO1xuICAgICAgICB0aGlzLmluX2VkaXQtLTtcblxuICAgICAgICAvLyBUT0RPOiByZWxlYXNlIHByZXZpb3VzXG4gICAgICAgIC8vIHVubGVzcyBAbW9kZWxzX29ubHlcbiAgICAgICAgLy8gICBjcmVhdGVfb3B0aW9ucy5zdG9yZS5yZWxlYXNlKHZpZXdfbW9kZWwpIGZvciB2aWV3X21vZGVsIGluIHByZXZpb3VzX3ZpZXdfbW9kZWxzXG4gICAgICB9LFxuICAgICk7XG5cbiAgICAgIC8vIHN0YXJ0IHN1YnNjcmliaW5nXG4gICAgICBvYnNlcnZhYmxlLnN1YnNjcmliZShfLmJpbmQodGhpcy5fb25PYnNlcnZhYmxlQXJyYXlDaGFuZ2UsIHRoaXMpKTtcblxuICAgICAgaWYgKGtiLnN0YXRpc3RpY3MpIGtiLnN0YXRpc3RpY3MucmVnaXN0ZXIoJ0NvbGxlY3Rpb25PYnNlcnZhYmxlJywgdGhpcyk7ICAgICAvLyBjb2xsZWN0IG1lbW9yeSBtYW5hZ2VtZW50IHN0YXRpc3RpY3NcblxuICAgICAgcmV0dXJuIG9ic2VydmFibGU7XG4gICAgfSk7XG4gIH1cblxuICAvLyBSZXF1aXJlZCBjbGVhbiB1cCBmdW5jdGlvbiB0byBicmVhayBjeWNsZXMsIHJlbGVhc2UgdmlldyBtb2RlbHMsIGV0Yy5cbiAgLy8gQ2FuIGJlIGNhbGxlZCBkaXJlY3RseSwgdmlhIGtiLnJlbGVhc2Uob2JqZWN0KSBvciBhcyBhIGNvbnNlcXVlbmNlIG9mIGtvLnJlbGVhc2VOb2RlKGVsZW1lbnQpLlxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuX19rYl9yZWxlYXNlZCA9IHRydWU7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZSA9IGtiLnV0aWxzLndyYXBwZWRPYnNlcnZhYmxlKHRoaXMpO1xuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBrYi5wZWVrKHRoaXMuX2NvbGxlY3Rpb24pOyBrYi51dGlscy53cmFwcGVkT2JqZWN0KG9ic2VydmFibGUsIG51bGwpO1xuICAgIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgICBjb2xsZWN0aW9uLnVuYmluZCgnYWxsJywgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKTtcbiAgICAgIGNvbnN0IGFycmF5ID0ga2IucGVlayhvYnNlcnZhYmxlKTsgYXJyYXkuc3BsaWNlKDAsIGFycmF5Lmxlbmd0aCk7IC8vIGNsZWFyIHRoZSB2aWV3IG1vZGVscyBvciBtb2RlbHNcbiAgICB9XG4gICAgdGhpcy5jb2xsZWN0aW9uLmRpc3Bvc2UoKTsgdGhpcy5jb2xsZWN0aW9uID0gbnVsbDsgdGhpcy5fY29sbGVjdGlvbiA9IG51bGw7IG9ic2VydmFibGUuY29sbGVjdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fbWFwcGVyLmRpc3Bvc2UoKTsgdGhpcy5fbWFwcGVyID0gbnVsbDtcbiAgICBrYi5yZWxlYXNlKHRoaXMuX2ZpbHRlcnMpOyB0aGlzLl9maWx0ZXJzID0gbnVsbDtcbiAgICB0aGlzLl9jb21wYXJhdG9yKG51bGwpOyB0aGlzLl9jb21wYXJhdG9yID0gbnVsbDtcbiAgICB0aGlzLmNyZWF0ZV9vcHRpb25zID0gbnVsbDtcbiAgICBvYnNlcnZhYmxlLmNvbGxlY3Rpb24gPSBudWxsOyBrYi51dGlscy53cmFwcGVkRGVzdHJveSh0aGlzKTtcblxuICAgIGlmIChrYi5zdGF0aXN0aWNzKSBrYi5zdGF0aXN0aWNzLnVucmVnaXN0ZXIoJ0NvbGxlY3Rpb25PYnNlcnZhYmxlJywgdGhpcyk7ICAgICAvLyBjb2xsZWN0IG1lbW9yeSBtYW5hZ2VtZW50IHN0YXRpc3RpY3NcbiAgfVxuXG4gIC8vIEdldCB0aGUgb3B0aW9ucyBmb3IgYSBuZXcgY29sbGVjdGlvbiB0aGF0IGNhbiBiZSB1c2VkIGZvciBzaGFyaW5nIHZpZXcgbW9kZWxzLlxuICAvL1xuICAvLyBAZXhhbXBsZSBTaGFyaW5nIHZpZXcgbW9kZWxzIGZvciBhbiBIVE1MIHNlbGVjdCBlbGVtZW50LlxuICAvLyAgIHZhciBzZWxlY3RlZF9jb2xsZWN0aW9uID0gbmV3IEJhY2tib25lLkNvbGxlY3Rpb24oKTtcbiAgLy8gICB2YXIgYXZhaWxhYmxlX2NvbGxlY3Rpb24gPSBuZXcgQmFja2JvbmUuQ29sbGVjdGlvbihbe25hbWU6ICdCb2InfSwge25hbWU6ICdGcmVkJ31dKTtcbiAgLy8gICB2YXIgc2VsZWN0ZWQgPSBrYi5jb2xsZWN0aW9uT2JzZXJ2YWJsZShhdmFpbGFibGVfY29sbGVjdGlvbik7XG4gIC8vICAgdmFyIGF2YWlsYWJsZSA9IGtiLmNvbGxlY3Rpb25PYnNlcnZhYmxlKGF2YWlsYWJsZV9jb2xsZWN0aW9uLCBhdmFpbGFibGVfY29sbGVjdGlvbi5zaGFyZU9wdGlvbnMoKSk7IC8vIHZpZXcgbW9kZWxzIHNoYXJlZCB3aXRoIHNlbGVjdGVkIGNvbGxlY3Rpb24gb2JzZXJ2YWJsZVxuICBzaGFyZU9wdGlvbnMoKSB7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZSA9IGtiLnV0aWxzLndyYXBwZWRPYnNlcnZhYmxlKHRoaXMpO1xuICAgIHJldHVybiB7IHN0b3JlOiBrYi51dGlscy53cmFwcGVkU3RvcmUob2JzZXJ2YWJsZSksIGZhY3Rvcnk6IGtiLnV0aWxzLndyYXBwZWRGYWN0b3J5KG9ic2VydmFibGUpIH07XG4gIH1cblxuICAvLyBTZXR0ZXIgZm9yIHRoZSBmaWx0ZXJzIGFycmF5IGZvciBleGNsdWRpbmcgbW9kZWxzIGluIHRoZSBjb2xsZWN0aW9uIG9ic2VydmFibGUuXG4gIC8vXG4gIC8vIEBwYXJhbSBbSWR8RnVuY3Rpb258QXJyYXldIGZpbHRlcnMgZmlsdGVycyBjYW4gYmUgaW5kaXZpZHVhbCBpZHMgKG9ic2VydmFibGUgb3Igc2ltcGxlKSBvciBhcnJheXMgb2YgaWRzLCBmdW5jdGlvbnMsIG9yIGFycmF5cyBvZiBmdW5jdGlvbnMuXG4gIC8vXG4gIC8vIEBleGFtcGxlXG4gIC8vICAgIC8vIGV4Y2x1ZGUgYSBzaW5nbGUgbW9kZWwgYnkgaWRcbiAgLy8gICAgY29sbGVjdGlvbl9vYnNlcnZhYmxlLmZpbHRlcnMobW9kZWwuaWQpO1xuICBmaWx0ZXJzKGZpbHRlcnMpIHtcbiAgICBpZiAoZmlsdGVycykge1xuICAgICAgcmV0dXJuIHRoaXMuX2ZpbHRlcnMoXy5pc0FycmF5KGZpbHRlcnMpID8gZmlsdGVycyA6IFtmaWx0ZXJzXSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9maWx0ZXJzKFtdKTtcbiAgfVxuXG4gIC8vIFNldHRlciBmb3IgdGhlIHNvcnRlZCBpbmRleCBmdW5jdGlvbiBmb3IgYXV0by1zb3J0aW5nIHRoZSBWaWV3TW9kZWxzIG9yIE1vZGVscyBpbiBhIGtiLkNvbGxlY3Rpb25PYnNlcnZhYmxlLlxuICAvL1xuICAvLyBAcGFyYW0gW0Z1bmN0aW9uXSBjb21wYXJhdG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGluZGV4IHdoZXJlIHRvIGluc2VydCB0aGUgbW9kZWwuIFNpZ25hdHVyZTogZnVuY3Rpb24obW9kZWxzLCBtb2RlbClcbiAgLy8gQHBhcmFtIFtGdW5jdGlvbl0gY29tcGFyYXRvciBhIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byBzb3J0IGFuIG9iamVjdC4gU2lnbmF0dXJlOiBgZnVuY3Rpb24obW9kZWxfYSwgbW9kZWxfYilgIHJldHVybnMgbmVnYXRpdmUgdmFsdWUgZm9yIGFzY2VuZGluZywgMCBmb3IgZXF1YWwsIGFuZCBwb3NpdGl2ZSBmb3IgZGVzY2VuZGluZ1xuICAvL1xuICAvLyBAZXhhbXBsZVxuICAvLyAgICAvLyBjaGFuZ2UgdGhlIHNvcnRpbmcgZnVuY3Rpb25cbiAgLy8gICAgY29sbGVjdGlvbl9vYnNlcnZhYmxlLmNvbXBhcmF0b3IoXG4gIC8vICAgICAgZnVuY3Rpb24odmlld19tb2RlbHMsIHZtKXtcbiAgLy8gICAgICAgIHJldHVybiBfLmNvbXBhcmF0b3Iodmlld19tb2RlbHMsIHZtLCAodGVzdCkgLT4ga2IudXRpbHMud3JhcHBlZE1vZGVsKHRlc3QpLmdldCgnbmFtZScpKTtcbiAgLy8gICAgICB9XG4gIC8vICAgICk7XG4gIGNvbXBhcmF0b3IoY29tcGFyYXRvcikgeyByZXR1cm4gdGhpcy5fY29tcGFyYXRvcihjb21wYXJhdG9yKTsgfVxuXG4gIC8vIFNldHRlciBmb3IgdGhlIHNvcnQgYXR0cmlidXRlIG5hbWUgZm9yIGF1dG8tc29ydGluZyB0aGUgVmlld01vZGVscyBvciBNb2RlbHMgaW4gYSBrYi5Db2xsZWN0aW9uT2JzZXJ2YWJsZS5cbiAgLy9cbiAgLy8gQHBhcmFtIFtTdHJpbmddIHNvcnRfYXR0cmlidXRlIHRoZSBuYW1lIG9mIGFuIGF0dHJpYnV0ZS4gRGVmYXVsdDogcmVzb3J0IG9uIGFsbCBjaGFuZ2VzIHRvIGEgbW9kZWwuXG4gIC8vXG4gIC8vIEBleGFtcGxlXG4gIC8vICAgIHZhciB0b2RvcyA9IG5ldyBrYi5Db2xsZWN0aW9uT2JzZXJ2YWJsZShuZXcgQmFja2JvbmUuQ29sbGVjdGlvbihbe25hbWU6ICdaYW5hZHUnLCBuYW1lOiAnQWxleCd9XSkpO1xuICAvLyAgICAvLyBpbiBvcmRlciBvZiBaYW5hZHUgdGhlbiBBbGV4XG4gIC8vICAgIHRvZG9zLnNvcnRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgLy8gICAgLy8gaW4gb3JkZXIgb2YgQWxleCB0aGVuIFphbmFkdVxuICBzb3J0QXR0cmlidXRlKHNvcnRfYXR0cmlidXRlKSB7IHJldHVybiB0aGlzLl9jb21wYXJhdG9yKHNvcnRfYXR0cmlidXRlID8gdGhpcy5fYXR0cmlidXRlQ29tcGFyYXRvcihzb3J0X2F0dHJpYnV0ZSkgOiBudWxsKTsgfVxuXG4gIC8vIFJldmVyc2UgbG9va3VwIGZvciBhIHZpZXcgbW9kZWwgYnkgbW9kZWwuIElmIGNyZWF0ZWQgd2l0aCBtb2RlbHNfb25seSBvcHRpb24sIHdpbGwgcmV0dXJuIG51bGwuXG4gIHZpZXdNb2RlbEJ5TW9kZWwobW9kZWwpIHtcbiAgICBpZiAodGhpcy5tb2RlbHNfb25seSkgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgaWRfYXR0cmlidXRlID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZGVsLCBtb2RlbC5pZEF0dHJpYnV0ZSkgPyBtb2RlbC5pZEF0dHJpYnV0ZSA6ICdjaWQnO1xuICAgIHJldHVybiBfLmZpbmQoa2IucGVlayhrYi51dGlscy53cmFwcGVkT2JzZXJ2YWJsZSh0aGlzKSksIHRlc3QgPT4gdGVzdCAmJiB0ZXN0Ll9fa2IgJiYgKHRlc3QuX19rYi5vYmplY3RbaWRfYXR0cmlidXRlXSA9PT0gbW9kZWxbaWRfYXR0cmlidXRlXSkpO1xuICB9XG5cbiAgLy8gV2lsbCByZXR1cm4gdHJ1ZSB1bmxlc3MgY3JlYXRlZCB3aXRoIG1vZGVsc19vbmx5IG9wdGlvbi5cbiAgLy9cbiAgLy8gQGV4YW1wbGVcbiAgLy8gICB2YXIgdG9kb3MxID0gbmV3IGtiLkNvbGxlY3Rpb25PYnNlcnZhYmxlKG5ldyBCYWNrYm9uZS5Db2xsZWN0aW9uKCksIHttb2RlbHNfb25seTogdHJ1ZX0pO1xuICAvLyAgIHRvZG9zMS5oYXNWaWV3TW9kZWxzKCk7ICAgICAvLyBmYWxzZVxuICAvLyAgIHZhciB0b2RvczIgPSBuZXcga2IuQ29sbGVjdGlvbk9ic2VydmFibGUobmV3IEJhY2tib25lLkNvbGxlY3Rpb24oKSk7XG4gIC8vICAgdG9kb3MyLmhhc1ZpZXdNb2RlbHMoKTsgICAgIC8vIHRydWVcbiAgaGFzVmlld01vZGVscygpIHsgcmV0dXJuICF0aGlzLm1vZGVsc19vbmx5OyB9XG5cbiAgLy8gQ29tcGFjdHMgdGhlIENvbGxlY3Rpb24gT2JzZXJ2YWJsZSB0byB1c2UgdGhlIGxlYXN0IGFtb3VudCBvZiBtZW1vcnkuIEN1cnJlbnRseSwgdGhpcyBpcyBicnV0ZSBmb3JjZSBtZWFuaW5nIGl0IHJlbGVhc2VzIHRoYW4gcmVnZW5lcmF0ZXMgYWxsIHZpZXcgbW9kZWxzIHdoZW4gY2FsbGVkLlxuICAvL1xuICBjb21wYWN0KCkge1xuICAgIHJldHVybiBrYi5pZ25vcmUoKCkgPT4ge1xuICAgICAgY29uc3Qgb2JzZXJ2YWJsZSA9IGtiLnV0aWxzLndyYXBwZWRPYnNlcnZhYmxlKHRoaXMpO1xuICAgICAgaWYgKCFrYi51dGlscy53cmFwcGVkU3RvcmVJc093bmVkKG9ic2VydmFibGUpKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAga2IudXRpbHMud3JhcHBlZFN0b3JlKG9ic2VydmFibGUpLmNsZWFyKCk7XG4gICAgICByZXR1cm4gdGhpcy5fY29sbGVjdGlvbi5ub3RpZnlTdWJzY3JpYmVycyh0aGlzLl9jb2xsZWN0aW9uKCkpO1xuICAgIH0sXG4gICk7XG4gIH1cblxuICAvLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgLy8gSW50ZXJuYWxcbiAgLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgLy8gQG5vZG9jXG4gIF9zaGFyZU9yQ3JlYXRlRmFjdG9yeShvcHRpb25zKSB7XG4gICAgY29uc3QgYWJzb2x1dGVfbW9kZWxzX3BhdGggPSBrYi51dGlscy5wYXRoSm9pbihvcHRpb25zLnBhdGgsICdtb2RlbHMnKTtcbiAgICBjb25zdCB7IGZhY3RvcmllcyB9ID0gb3B0aW9ucztcblxuICAgIC8vIGNoZWNrIHRoZSBleGlzdGluZyBmYWN0b3J5XG4gICAgbGV0IGZhY3RvcnkgPSBvcHRpb25zLmZhY3Rvcnk7XG4gICAgaWYgKGZhY3RvcnkpIHtcbiAgICAgIC8vIG1vZGVscyBtYXRjaGVzLCBjaGVjayBhZGRpdGlvbmFsIHBhdGhzXG4gICAgICBjb25zdCBleGlzdGluZ19jcmVhdG9yID0gZmFjdG9yeS5jcmVhdG9yRm9yUGF0aChudWxsLCBhYnNvbHV0ZV9tb2RlbHNfcGF0aCk7XG4gICAgICBpZiAoZXhpc3RpbmdfY3JlYXRvciAmJiAoIWZhY3RvcmllcyB8fCAoZmFjdG9yaWVzLm1vZGVscyA9PT0gZXhpc3RpbmdfY3JlYXRvcikpKSB7XG4gICAgICAgIGlmICghZmFjdG9yaWVzKSByZXR1cm4gZmFjdG9yeTsgLy8gYWxsIG1hdGNoLCBzaGFyZSB0aGUgZmFjdG9yeVxuXG4gICAgICAgIC8vIGFsbCBtYXRjaCwgc2hhcmUgdGhlIGZhY3RvcnlcbiAgICAgICAgaWYgKGZhY3RvcnkuaGFzUGF0aE1hcHBpbmdzKGZhY3Rvcmllcywgb3B0aW9ucy5wYXRoKSkgcmV0dXJuIGZhY3Rvcnk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gbmVlZCB0byBjcmVhdGUgYSBuZXcgZmFjdG9yeVxuICAgIGZhY3RvcnkgPSBuZXcga2IuRmFjdG9yeShvcHRpb25zLmZhY3RvcnkpO1xuICAgIGlmIChmYWN0b3JpZXMpIHsgZmFjdG9yeS5hZGRQYXRoTWFwcGluZ3MoZmFjdG9yaWVzLCBvcHRpb25zLnBhdGgpOyB9XG5cbiAgICAvLyBzZXQgdXAgdGhlIGRlZmF1bHQgY3JlYXRlIGZ1bmN0aW9uXG4gICAgaWYgKCFmYWN0b3J5LmNyZWF0b3JGb3JQYXRoKG51bGwsIGFic29sdXRlX21vZGVsc19wYXRoKSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvcHRpb25zLCAnbW9kZWxzX29ubHknKSkge1xuICAgICAgICBpZiAob3B0aW9ucy5tb2RlbHNfb25seSkge1xuICAgICAgICAgIGZhY3RvcnkuYWRkUGF0aE1hcHBpbmcoYWJzb2x1dGVfbW9kZWxzX3BhdGgsIHsgbW9kZWxzX29ubHk6IHRydWUgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmFjdG9yeS5hZGRQYXRoTWFwcGluZyhhYnNvbHV0ZV9tb2RlbHNfcGF0aCwga2IuVmlld01vZGVsKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChvcHRpb25zLnZpZXdfbW9kZWwpIHtcbiAgICAgICAgZmFjdG9yeS5hZGRQYXRoTWFwcGluZyhhYnNvbHV0ZV9tb2RlbHNfcGF0aCwgb3B0aW9ucy52aWV3X21vZGVsKTtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5jcmVhdGUpIHtcbiAgICAgICAgZmFjdG9yeS5hZGRQYXRoTWFwcGluZyhhYnNvbHV0ZV9tb2RlbHNfcGF0aCwgeyBjcmVhdGU6IG9wdGlvbnMuY3JlYXRlIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmFjdG9yeS5hZGRQYXRoTWFwcGluZyhhYnNvbHV0ZV9tb2RlbHNfcGF0aCwga2IuVmlld01vZGVsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhY3Rvcnk7XG4gIH1cblxuICAvLyBAbm9kb2NcbiAgX29uQ29sbGVjdGlvbkNoYW5nZSA9IChldmVudCwgYXJnKSA9PiBrYi5pZ25vcmUoKCkgPT4ge1xuICAgIGlmICh0aGlzLmluX2VkaXQgfHwga2Iud2FzUmVsZWFzZWQodGhpcykpIHJldHVybiB1bmRlZmluZWQ7IC8vIHdlIGFyZSBkb2luZyB0aGUgZWRpdGluZyBvciBoYXZlIGJlZW4gcmVsZWFzZWRcblxuICAgIHN3aXRjaCAoZXZlbnQpIHtcbiAgICAgIGNhc2UgJ3Jlc2V0Jzoge1xuICAgICAgICB0aGlzLmF1dG9fY29tcGFjdCA/IHRoaXMuY29tcGFjdCgpIDogdGhpcy5fY29sbGVjdGlvbi5ub3RpZnlTdWJzY3JpYmVycyh0aGlzLl9jb2xsZWN0aW9uKCkpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAnc29ydCc6IGNhc2UgJ3Jlc29ydCc6IHtcbiAgICAgICAgdGhpcy5fY29sbGVjdGlvbi5ub3RpZnlTdWJzY3JpYmVycyh0aGlzLl9jb2xsZWN0aW9uKCkpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAnbmV3JzogY2FzZSAnYWRkJzoge1xuICAgICAgICBpZiAoIXRoaXMuX3NlbGVjdE1vZGVsKGFyZykpIHJldHVybiB1bmRlZmluZWQ7IC8vIGZpbHRlcmVkXG5cbiAgICAgICAgY29uc3Qgb2JzZXJ2YWJsZSA9IGtiLnV0aWxzLndyYXBwZWRPYnNlcnZhYmxlKHRoaXMpO1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gdGhpcy5fY29sbGVjdGlvbigpO1xuICAgICAgICBpZiAoIX5jb2xsZWN0aW9uLmluZGV4T2YoYXJnKSkgcmV0dXJuIHVuZGVmaW5lZDsgLy8gdGhlIG1vZGVsIG1heSBoYXZlIGJlZW4gcmVtb3ZlZCBiZWZvcmUgd2UgZ290IGEgY2hhbmNlIHRvIGFkZCBpdFxuICAgICAgICBjb25zdCB2aWV3X21vZGVsID0gdGhpcy52aWV3TW9kZWxCeU1vZGVsKGFyZyk7XG4gICAgICAgIGlmICh2aWV3X21vZGVsKSByZXR1cm4gdW5kZWZpbmVkOyAvLyBpdCBtYXkgaGF2ZSBhbHJlYWR5IGJlZW4gYWRkZWQgYnkgYSBjaGFuZ2UgZXZlbnRcbiAgICAgICAgdGhpcy5pbl9lZGl0Kys7XG4gICAgICAgIGNvbnN0IGNvbXBhcmF0b3IgPSB0aGlzLl9jb21wYXJhdG9yKCk7XG4gICAgICAgIGlmIChjb21wYXJhdG9yKSB7XG4gICAgICAgICAgb2JzZXJ2YWJsZSgpLnB1c2godGhpcy5fY3JlYXRlVmlld01vZGVsKGFyZykpO1xuICAgICAgICAgIG9ic2VydmFibGUuc29ydChjb21wYXJhdG9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB2bSA9IHRoaXMuX2NyZWF0ZVZpZXdNb2RlbChhcmcpO1xuICAgICAgICAgIG9ic2VydmFibGUuc3BsaWNlKGNvbGxlY3Rpb24uaW5kZXhPZihhcmcpLCAwLCB2bSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbl9lZGl0LS07XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlICdyZW1vdmUnOiBjYXNlICdkZXN0cm95Jzoge1xuICAgICAgICB0aGlzLl9vbk1vZGVsUmVtb3ZlKGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlICdjaGFuZ2UnOiB7XG4gICAgICAgIC8vIGZpbHRlcmVkLCByZW1vdmVcbiAgICAgICAgaWYgKCF0aGlzLl9zZWxlY3RNb2RlbChhcmcpKSByZXR1cm4gdGhpcy5fb25Nb2RlbFJlbW92ZShhcmcpO1xuXG4gICAgICAgIGNvbnN0IHZpZXdfbW9kZWwgPSB0aGlzLm1vZGVsc19vbmx5ID8gYXJnIDogdGhpcy52aWV3TW9kZWxCeU1vZGVsKGFyZyk7XG4gICAgICAgIGlmICghdmlld19tb2RlbCkgcmV0dXJuIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgnYWRkJywgYXJnKTsgLy8gYWRkIG5ld1xuICAgICAgICBjb25zdCBjb21wYXJhdG9yID0gdGhpcy5fY29tcGFyYXRvcigpO1xuICAgICAgICBpZiAoIWNvbXBhcmF0b3IpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy5pbl9lZGl0Kys7XG4gICAgICAgIGtiLnV0aWxzLndyYXBwZWRPYnNlcnZhYmxlKHRoaXMpLnNvcnQoY29tcGFyYXRvcik7XG4gICAgICAgIHRoaXMuaW5fZWRpdC0tO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9LFxuICApXG5cbiAgLy8gQG5vZG9jXG4gIF9vbk1vZGVsUmVtb3ZlKG1vZGVsKSB7XG4gICAgY29uc3Qgdmlld19tb2RlbCA9IHRoaXMubW9kZWxzX29ubHkgPyBtb2RlbCA6IHRoaXMudmlld01vZGVsQnlNb2RlbChtb2RlbCk7IC8vIGVpdGhlciByZW1vdmUgYSB2aWV3IG1vZGVsIG9yIGEgbW9kZWxcbiAgICBpZiAoIXZpZXdfbW9kZWwpIHJldHVybiB1bmRlZmluZWQ7ICAvLyBpdCBtYXkgaGF2ZSBhbHJlYWR5IGJlZW4gcmVtb3ZlZFxuICAgIGNvbnN0IG9ic2VydmFibGUgPSBrYi51dGlscy53cmFwcGVkT2JzZXJ2YWJsZSh0aGlzKTtcbiAgICB0aGlzLmluX2VkaXQrKztcbiAgICBvYnNlcnZhYmxlLnJlbW92ZSh2aWV3X21vZGVsKTtcbiAgICByZXR1cm4gdGhpcy5pbl9lZGl0LS07XG4gIH1cblxuICAvLyBAbm9kb2NcbiAgX29uT2JzZXJ2YWJsZUFycmF5Q2hhbmdlID0gbW9kZWxzX29yX3ZpZXdfbW9kZWxzID0+IGtiLmlnbm9yZSgoKSA9PiB7XG4gICAgaWYgKHRoaXMuaW5fZWRpdCkgcmV0dXJuOyAvLyB3ZSBhcmUgZG9pbmcgdGhlIGVkaXRpbmdcblxuICAgICAgLy8gdmFsaWRhdGUgaW5wdXRcbiAgICBpZiAodGhpcy5tb2RlbHNfb25seSAmJiBtb2RlbHNfb3Jfdmlld19tb2RlbHMubGVuZ3RoICYmICFrYi5pc01vZGVsKG1vZGVsc19vcl92aWV3X21vZGVsc1swXSkpIGtiLl90aHJvd1VuZXhwZWN0ZWQodGhpcywgJ2luY29ycmVjdCB0eXBlIHBhc3NlZCcpO1xuICAgIGlmICghdGhpcy5tb2RlbHNfb25seSAmJiBtb2RlbHNfb3Jfdmlld19tb2RlbHMubGVuZ3RoICYmICEoXy5pc09iamVjdChtb2RlbHNfb3Jfdmlld19tb2RlbHNbMF0pIHx8IGtiLmlzTW9kZWwobW9kZWxzX29yX3ZpZXdfbW9kZWxzWzBdKSkpIGtiLl90aHJvd1VuZXhwZWN0ZWQodGhpcywgJ2luY29ycmVjdCB0eXBlIHBhc3NlZCcpO1xuXG4gICAgY29uc3Qgb2JzZXJ2YWJsZSA9IGtiLnV0aWxzLndyYXBwZWRPYnNlcnZhYmxlKHRoaXMpO1xuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBrYi5wZWVrKHRoaXMuX2NvbGxlY3Rpb24pO1xuICAgIGNvbnN0IGhhc19maWx0ZXJzID0ga2IucGVlayh0aGlzLl9maWx0ZXJzKS5sZW5ndGg7XG4gICAgaWYgKCFjb2xsZWN0aW9uKSByZXR1cm47IC8vIG5vIGNvbGxlY3Rpb24gb3Igd2UgYXJlIHVwZGF0aW5nIG91cnNlbHZlc1xuXG4gICAgbGV0IHZpZXdfbW9kZWxzID0gbW9kZWxzX29yX3ZpZXdfbW9kZWxzO1xuXG4gICAgICAvLyBzZXQgTW9kZWxzXG4gICAgbGV0IG1vZGVscztcbiAgICBpZiAodGhpcy5tb2RlbHNfb25seSkge1xuICAgICAgbW9kZWxzID0gXy5maWx0ZXIobW9kZWxzX29yX3ZpZXdfbW9kZWxzLCBtb2RlbCA9PiAhaGFzX2ZpbHRlcnMgfHwgdGhpcy5fc2VsZWN0TW9kZWwobW9kZWwpKTtcblxuICAgICAgLy8gc2V0IFZpZXdNb2RlbHNcbiAgICB9IGVsc2Uge1xuICAgICAgIWhhc19maWx0ZXJzIHx8ICh2aWV3X21vZGVscyA9IFtdKTsgLy8gY2hlY2sgZm9yIGZpbHRlcmluZyBvZiBWaWV3TW9kZWxzXG4gICAgICBtb2RlbHMgPSBbXTtcbiAgICAgIF8uZWFjaChtb2RlbHNfb3Jfdmlld19tb2RlbHMsICh2aWV3X21vZGVsKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0ga2IudXRpbHMud3JhcHBlZE9iamVjdCh2aWV3X21vZGVsKTtcbiAgICAgICAgaWYgKGhhc19maWx0ZXJzKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLl9zZWxlY3RNb2RlbChtb2RlbCkpIHJldHVybjsgLy8gZmlsdGVyZWQgc28gc2tpcFxuICAgICAgICAgIHZpZXdfbW9kZWxzLnB1c2godmlld19tb2RlbCk7XG4gICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIHZpZXcgbW9kZWxzIGJlaW5nIGRpZmZlcmVudCAod2lsbCBvY2N1ciBpZiBhIGtvIHNlbGVjdCBzZWxlY3RlZE9wdGlvbnMgaXMgYm91bmQgdG8gdGhpcyBjb2xsZWN0aW9uIG9ic2VydmFibGUpIC0+IHVwZGF0ZSBvdXIgc3RvcmVcbiAgICAgICAgY29uc3QgY3VycmVudF92aWV3X21vZGVsID0gdGhpcy5jcmVhdGVfb3B0aW9ucy5zdG9yZS5maW5kKG1vZGVsLCB0aGlzLmNyZWF0ZV9vcHRpb25zLmNyZWF0b3IpO1xuICAgICAgICBpZiAoY3VycmVudF92aWV3X21vZGVsICYmIChjdXJyZW50X3ZpZXdfbW9kZWwuY29uc3RydWN0b3IgIT09IHZpZXdfbW9kZWwuY29uc3RydWN0b3IpKSBrYi5fdGhyb3dVbmV4cGVjdGVkKHRoaXMsICdyZXBsYWNpbmcgZGlmZmVyZW50IHR5cGUgb2YgdmlldyBtb2RlbCcpO1xuICAgICAgICB0aGlzLmNyZWF0ZV9vcHRpb25zLnN0b3JlLnJldGFpbih2aWV3X21vZGVsLCBtb2RlbCwgdGhpcy5jcmVhdGVfb3B0aW9ucy5jcmVhdG9yKTtcbiAgICAgICAgbW9kZWxzLnB1c2gobW9kZWwpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gYSBjaGFuZ2UsIHVwZGF0ZSBtb2RlbHNcbiAgICB0aGlzLmluX2VkaXQrKztcbiAgICAobW9kZWxzX29yX3ZpZXdfbW9kZWxzLmxlbmd0aCA9PT0gdmlld19tb2RlbHMubGVuZ3RoKSB8fCBvYnNlcnZhYmxlKHZpZXdfbW9kZWxzKTsgLy8gcmVwbGFjZSB0aGUgVmlld01vZGVscyBiZWNhdXNlIHRoZXkgd2VyZSBmaWx0ZXJlZFxuICAgIF8uaXNFcXVhbChjb2xsZWN0aW9uLm1vZGVscywgbW9kZWxzKSB8fCBjb2xsZWN0aW9uLnJlc2V0KG1vZGVscyk7XG4gICAgdGhpcy5pbl9lZGl0LS07XG4gIH0pXG5cbiAgLy8gQG5vZG9jXG4gIF9hdHRyaWJ1dGVDb21wYXJhdG9yKHNvcnRfYXR0cmlidXRlKSB7XG4gICAgY29uc3QgbW9kZWxBdHRyaWJ1dGVDb21wYXJlID0gZnVuY3Rpb24gKG1vZGVsX2EsIG1vZGVsX2IpIHtcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZV9uYW1lID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShzb3J0X2F0dHJpYnV0ZSk7XG4gICAgICByZXR1cm4gY29tcGFyZShtb2RlbF9hLmdldChhdHRyaWJ1dGVfbmFtZSksIG1vZGVsX2IuZ2V0KGF0dHJpYnV0ZV9uYW1lKSk7XG4gICAgfTtcbiAgICByZXR1cm4gKHRoaXMubW9kZWxzX29ubHkgPyBtb2RlbEF0dHJpYnV0ZUNvbXBhcmUgOiAobW9kZWxfYSwgbW9kZWxfYikgPT4gbW9kZWxBdHRyaWJ1dGVDb21wYXJlKGtiLnV0aWxzLndyYXBwZWRNb2RlbChtb2RlbF9hKSwga2IudXRpbHMud3JhcHBlZE1vZGVsKG1vZGVsX2IpKSk7XG4gIH1cblxuICAvLyBAbm9kb2NcbiAgX2NyZWF0ZVZpZXdNb2RlbChtb2RlbCkge1xuICAgIGlmICh0aGlzLm1vZGVsc19vbmx5KSByZXR1cm4gbW9kZWw7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlX29wdGlvbnMuc3RvcmUucmV0YWluT3JDcmVhdGUobW9kZWwsIHRoaXMuY3JlYXRlX29wdGlvbnMpO1xuICB9XG5cbiAgLy8gQG5vZG9jXG4gIF9zZWxlY3RNb2RlbChtb2RlbCkge1xuICAgIGNvbnN0IGZpbHRlcnMgPSBrYi5wZWVrKHRoaXMuX2ZpbHRlcnMpO1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGxldCBmaWx0ZXIgPSBmaWx0ZXJzW2ldO1xuICAgICAgZmlsdGVyID0ga2IucGVlayhmaWx0ZXIpO1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihmaWx0ZXIpKSB7IGlmICghZmlsdGVyKG1vZGVsKSkgcmV0dXJuIGZhbHNlOyB9IGVsc2UgaWYgKF8uaXNBcnJheShmaWx0ZXIpKSB7IGlmICghfmZpbHRlci5pbmRleE9mKG1vZGVsLmlkKSkgcmV0dXJuIGZhbHNlOyB9IGVsc2UgaWYgKG1vZGVsLmlkICE9PSBmaWx0ZXIpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuLy8gZmFjdG9yeSBmdW5jdGlvblxuZXhwb3J0IGNvbnN0IGNvbGxlY3Rpb25PYnNlcnZhYmxlID0gKC4uLmFyZ3MpID0+IG5ldyBDb2xsZWN0aW9uT2JzZXJ2YWJsZSguLi5hcmdzKTtcbiIsImltcG9ydCBrYiBmcm9tICcuL2tiJztcblxuLy8gQG5vZG9jXG5leHBvcnQgY29uc3Qgc2V0dGluZ3MgPSB7IG9ybTogbnVsbCB9O1xuXG4vLyBAbm9kb2NcbmV4cG9ydCBkZWZhdWx0IChvcHRpb25zID0ge30pID0+IGtiLmFzc2lnbihzZXR0aW5ncywgb3B0aW9ucyk7XG4iLCIvKlxuICBrbm9ja2JhY2suanMgMi4wLjAtYWxwaGEuMVxuICBDb3B5cmlnaHQgKGMpICAyMDExLTIwMTYgS2V2aW4gTWFsYWtvZmYuXG4gIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4gIFNvdXJjZTogaHR0cHM6Ly9naXRodWIuY29tL2ttYWxha29mZi9rbm9ja2JhY2tcbiAgRGVwZW5kZW5jaWVzOiBLbm9ja291dC5qcywgQmFja2JvbmUuanMsIGFuZCBVbmRlcnNjb3JlLmpzIChvciBMb0Rhc2guanMpLlxuICBPcHRpb25hbCBkZXBlbmRlbmNpZXM6IEJhY2tib25lLk1vZGVsUmVmLmpzIGFuZCBCYWNrYm9uZU9STS5cbiovXG5cbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IEJhY2tib25lIGZyb20gJ2JhY2tib25lJztcbmltcG9ydCBrbyBmcm9tICdrbm9ja291dCc7XG5cbmltcG9ydCBrYiBmcm9tICcuL2tiJztcblxuLy8gVXNlZCB0byBwcm92aWRlIGEgY2VudHJhbCBwbGFjZSB0byBhZ2dyZWdhdGUgcmVnaXN0ZXJlZCBNb2RlbCBldmVudHMgcmF0aGVyIHRoYW4gaGF2aW5nIGFsbCBrYi5PYnNlcnZhYmxlcyByZWdpc3RlciBmb3IgdXBkYXRlcyBpbmRlcGVuZGVudGx5LlxuLy9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50V2F0Y2hlciB7XG5cbiAgLy8gVXNlZCB0byBlaXRoZXIgcmVnaXN0ZXIgeW91cnNlbGYgd2l0aCB0aGUgZXhpc3RpbmcgZW1pdHRlciB3YXRjaGVyIG9yIHRvIGNyZWF0ZSBhIG5ldyBvbmUuXG4gIC8vXG4gIC8vIEBwYXJhbSBbT2JqZWN0XSBvcHRpb25zIHBsZWFzZSBwYXNzIHRoZSBvcHRpb25zIGZyb20geW91ciBjb25zdHJ1Y3RvciB0byB0aGUgcmVnaXN0ZXIgbWV0aG9kLiBGb3IgZXhhbXBsZSwgY29uc3RydWN0b3IoZW1pdHRlciwgb3B0aW9ucylcbiAgLy8gQHBhcmFtIFtNb2RlbHxNb2RlbFJlZl0gb2JqIHRoZSBNb2RlbCB0aGF0IHdpbGwgb3duIG9yIHJlZ2lzdGVyIHdpdGggdGhlIHN0b3JlXG4gIC8vIEBwYXJhbSBba28ub2JzZXJ2YWJsZXxPYmplY3RdIGVtaXR0ZXIgdGhlIGVtaXR0ZXJzIG9mIHRoZSBldmVudCB3YXRjaGVyXG4gIC8vIEBwYXJhbSBbT2JqZWN0XSBjYWxsYmFja19vcHRpb25zIGluZm9ybWF0aW9uIGFib3V0IHRoZSBldmVudCBhbmQgY2FsbGJhY2sgdG8gcmVnaXN0ZXJcbiAgLy8gQG9wdGlvbiBvcHRpb25zIFtGdW5jdGlvbl0gZW1pdHRlciBjYWxsYmFjayBmb3Igd2hlbiB0aGUgZW1pdHRlciBjaGFuZ2VzIChlZy4gaXMgbG9hZGVkKS4gU2lnbmF0dXJlOiBmdW5jdGlvbihuZXdfZW1pdHRlcilcbiAgLy8gQG9wdGlvbiBvcHRpb25zIFtGdW5jdGlvbl0gdXBkYXRlIGNhbGxiYWNrIGZvciB3aGVuIHRoZSByZWdpc3RlcmVkIGV2ZW50IGlzIHRyaWdnZXJlZC4gU2lnbmF0dXJlOiBmdW5jdGlvbihuZXdfdmFsdWUpXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbU3RyaW5nXSBldmVudF9zZWxlY3RvciB0aGUgbmFtZSBvciBuYW1lcyBvZiBldmVudHMuXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbU3RyaW5nXSBrZXkgdGhlIG9wdGlvbmFsIGtleSB0byBmaWx0ZXIgdXBkYXRlIGF0dHJpYnV0ZSBldmVudHMuXG4gIHN0YXRpYyB1c2VPcHRpb25zT3JDcmVhdGUob3B0aW9ucywgZW1pdHRlciwgb2JqLCBjYWxsYmFja19vcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMuZXZlbnRfd2F0Y2hlcikge1xuICAgICAgaWYgKChvcHRpb25zLmV2ZW50X3dhdGNoZXIuZW1pdHRlcigpICE9PSBlbWl0dGVyKSAmJiAob3B0aW9ucy5ldmVudF93YXRjaGVyLm1vZGVsX3JlZiAhPT0gZW1pdHRlcikpIHsga2IuX3Rocm93VW5leHBlY3RlZCh0aGlzLCAnZW1pdHRlciBub3QgbWF0Y2hpbmcnKTsgfVxuICAgICAgcmV0dXJuIGtiLnV0aWxzLndyYXBwZWRFdmVudFdhdGNoZXIob2JqLCBvcHRpb25zLmV2ZW50X3dhdGNoZXIpLnJlZ2lzdGVyQ2FsbGJhY2tzKG9iaiwgY2FsbGJhY2tfb3B0aW9ucyk7XG4gICAgfVxuICAgIGtiLnV0aWxzLndyYXBwZWRFdmVudFdhdGNoZXJJc093bmVkKG9iaiwgdHJ1ZSk7XG4gICAgcmV0dXJuIGtiLnV0aWxzLndyYXBwZWRFdmVudFdhdGNoZXIob2JqLCBuZXcgRXZlbnRXYXRjaGVyKGVtaXR0ZXIpKS5yZWdpc3RlckNhbGxiYWNrcyhvYmosIGNhbGxiYWNrX29wdGlvbnMpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZW1pdHRlciwgb2JqLCBjYWxsYmFja19vcHRpb25zKSB7XG4gICAgaWYgKCF0aGlzLl9fa2IpIHsgdGhpcy5fX2tiID0ge307IH1cbiAgICB0aGlzLl9fa2IuY2FsbGJhY2tzID0ge307XG5cbiAgICB0aGlzLmVlID0gbnVsbDtcbiAgICBpZiAoY2FsbGJhY2tfb3B0aW9ucykgdGhpcy5yZWdpc3RlckNhbGxiYWNrcyhvYmosIGNhbGxiYWNrX29wdGlvbnMpO1xuICAgIGlmIChlbWl0dGVyKSB0aGlzLmVtaXR0ZXIoZW1pdHRlcik7XG4gIH1cblxuICAvLyBSZXF1aXJlZCBjbGVhbiB1cCBmdW5jdGlvbiB0byBicmVhayBjeWNsZXMsIHJlbGVhc2UgdmlldyBlbWl0dGVycywgZXRjLlxuICAvLyBDYW4gYmUgY2FsbGVkIGRpcmVjdGx5LCB2aWEga2IucmVsZWFzZShvYmplY3QpIG9yIGFzIGEgY29uc2VxdWVuY2Ugb2Yga28ucmVsZWFzZU5vZGUoZWxlbWVudCkuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5lbWl0dGVyKG51bGwpOyB0aGlzLl9fa2IuY2FsbGJhY2tzID0gbnVsbDtcbiAgICByZXR1cm4ga2IudXRpbHMud3JhcHBlZERlc3Ryb3kodGhpcyk7XG4gIH1cblxuICAvLyBEdWFsLXB1cnBvc2UgZ2V0dGVyL3NldHRlciBmb3IgdGhlIG9ic2VydmVkIGVtaXR0ZXIuXG4gIC8vXG4gIC8vIEBvdmVybG9hZCBlbWl0dGVyKClcbiAgLy8gICBHZXRzIHRoZSBlbWl0dGVyIG9yIGVtaXR0ZXIgcmVmZXJlbmNlXG4gIC8vICAgQHJldHVybiBbTW9kZWx8TW9kZWxSZWZdIHRoZSBlbWl0dGVyIHdob3NlIGF0dHJpYnV0ZXMgYXJlIGJlaW5nIG9ic2VydmVkIChjYW4gYmUgbnVsbClcbiAgLy8gQG92ZXJsb2FkIGVtaXR0ZXIobmV3X2VtaXR0ZXIpXG4gIC8vICAgU2V0cyB0aGUgZW1pdHRlciBvciBlbWl0dGVyIHJlZmVyZW5jZVxuICAvLyAgIEBwYXJhbSBbTW9kZWx8TW9kZWxSZWZdIG5ld19lbWl0dGVyIHRoZSBlbWl0dGVyIHdob3NlIGF0dHJpYnV0ZXMgd2lsbCBiZSBvYnNlcnZlZCAoY2FuIGJlIG51bGwpXG4gIGVtaXR0ZXIobmV3X2VtaXR0ZXIpIHtcbiAgICAvLyBnZXQgb3Igbm8gY2hhbmdlXG4gICAgaWYgKChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB8fCAodGhpcy5lZSA9PT0gbmV3X2VtaXR0ZXIpKSByZXR1cm4gdGhpcy5lZTtcblxuICAgIC8vIGNsZWFyIGFuZCB1bmJpbmQgcHJldmlvdXNcbiAgICBpZiAodGhpcy5tb2RlbF9yZWYpIHtcbiAgICAgIHRoaXMubW9kZWxfcmVmLnVuYmluZCgnbG9hZGVkJywgdGhpcy5fb25Nb2RlbExvYWRlZCk7XG4gICAgICB0aGlzLm1vZGVsX3JlZi51bmJpbmQoJ3VubG9hZGVkJywgdGhpcy5fb25Nb2RlbFVubG9hZGVkKTtcbiAgICAgIHRoaXMubW9kZWxfcmVmLnJlbGVhc2UoKTsgdGhpcy5tb2RlbF9yZWYgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIHNldCB1cCBjdXJyZW50XG4gICAgaWYgKEJhY2tib25lICYmIEJhY2tib25lLk1vZGVsUmVmICYmIChuZXdfZW1pdHRlciBpbnN0YW5jZW9mIEJhY2tib25lLk1vZGVsUmVmKSkge1xuICAgICAgdGhpcy5tb2RlbF9yZWYgPSBuZXdfZW1pdHRlcjsgdGhpcy5tb2RlbF9yZWYucmV0YWluKCk7XG4gICAgICB0aGlzLm1vZGVsX3JlZi5iaW5kKCdsb2FkZWQnLCB0aGlzLl9vbk1vZGVsTG9hZGVkKTtcbiAgICAgIHRoaXMubW9kZWxfcmVmLmJpbmQoJ3VubG9hZGVkJywgdGhpcy5fb25Nb2RlbFVubG9hZGVkKTtcbiAgICAgIG5ld19lbWl0dGVyID0gdGhpcy5tb2RlbF9yZWYubW9kZWwoKSB8fCBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdGhpcy5tb2RlbF9yZWY7XG4gICAgfVxuXG4gICAgLy8gc3dpdGNoIGJpbmRpbmdzXG4gICAgaWYgKHRoaXMuZWUgIT09IG5ld19lbWl0dGVyKSB7XG4gICAgICBpZiAobmV3X2VtaXR0ZXIpIHsgdGhpcy5fb25Nb2RlbExvYWRlZChuZXdfZW1pdHRlcik7IH0gZWxzZSB7IHRoaXMuX29uTW9kZWxVbmxvYWRlZCh0aGlzLmVlKTsgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3X2VtaXR0ZXI7XG4gIH1cblxuICAvLyBVc2VkIHRvIHJlZ2lzdGVyIGNhbGxiYWNrcyBmb3IgYW4gZW1pdHRlci5cbiAgLy9cbiAgLy8gQHBhcmFtIFtPYmplY3RdIG9iaiB0aGUgb3duaW5nIG9iamVjdC5cbiAgLy8gQHBhcmFtIFtPYmplY3RdIGNhbGxiYWNrX2luZm8gdGhlIGNhbGxiYWNrIGluZm9ybWF0aW9uXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbRnVuY3Rpb25dIGVtaXR0ZXIgY2FsbGJhY2sgZm9yIHdoZW4gdGhlIGVtaXR0ZXIgY2hhbmdlcyAoZWcuIGlzIGxvYWRlZCkuIFNpZ25hdHVyZTogZnVuY3Rpb24obmV3X2VtaXR0ZXIpXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbRnVuY3Rpb25dIHVwZGF0ZSBjYWxsYmFjayBmb3Igd2hlbiB0aGUgcmVnaXN0ZXJlZCBlbWl0dGVyIGlzIHRyaWdnZXJlZC4gU2lnbmF0dXJlOiBmdW5jdGlvbihuZXdfdmFsdWUpXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbU3RyaW5nXSBlbWl0dGVyX25hbWUgdGhlIG5hbWUgb2YgdGhlIGVtaXR0ZXIuXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbU3RyaW5nXSBrZXkgdGhlIG9wdGlvbmFsIGtleSB0byBmaWx0ZXIgdXBkYXRlIGF0dHJpYnV0ZSBldmVudHMuXG4gIHJlZ2lzdGVyQ2FsbGJhY2tzKG9iaiwgY2FsbGJhY2tfaW5mbykge1xuICAgIG9iaiB8fCBrYi5fdGhyb3dNaXNzaW5nKHRoaXMsICdvYmonKTtcbiAgICBjYWxsYmFja19pbmZvIHx8IGtiLl90aHJvd01pc3NpbmcodGhpcywgJ2NhbGxiYWNrX2luZm8nKTtcbiAgICBjb25zdCBldmVudF9uYW1lcyA9IGNhbGxiYWNrX2luZm8uZXZlbnRfc2VsZWN0b3IgPyBjYWxsYmFja19pbmZvLmV2ZW50X3NlbGVjdG9yLnNwbGl0KCcgJykgOiBbJ2NoYW5nZSddO1xuICAgIGNvbnN0IG1vZGVsID0gdGhpcy5lZTtcblxuICAgIF8uZWFjaChldmVudF9uYW1lcywgKGV2ZW50X25hbWUpID0+IHtcbiAgICAgIGlmICghZXZlbnRfbmFtZSkgcmV0dXJuOyAvLyBleHRyYSBzcGFjZXNcblxuICAgICAgbGV0IGNhbGxiYWNrcyA9IHRoaXMuX19rYi5jYWxsYmFja3NbZXZlbnRfbmFtZV07XG4gICAgICBpZiAoIWNhbGxiYWNrcykge1xuICAgICAgICB0aGlzLl9fa2IuY2FsbGJhY2tzW2V2ZW50X25hbWVdID0ge1xuICAgICAgICAgIG1vZGVsOiBudWxsLFxuICAgICAgICAgIGxpc3Q6IFtdLFxuICAgICAgICAgIGZuOiAobSkgPT4ge1xuICAgICAgICAgICAgXy5lYWNoKGNhbGxiYWNrcy5saXN0LCAoaW5mbykgPT4ge1xuICAgICAgICAgICAgICBpZiAoIWluZm8udXBkYXRlKSByZXR1cm47XG4gICAgICAgICAgICAgIGlmIChtICYmIGluZm8ua2V5ICYmIChtLmhhc0NoYW5nZWQgJiYgIW0uaGFzQ2hhbmdlZChrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGluZm8ua2V5KSkpKSByZXR1cm47IC8vIGtleSBkb2Vzbid0IG1hdGNoXG4gICAgICAgICAgICAgIGlmIChrYi5zdGF0aXN0aWNzKSBrYi5zdGF0aXN0aWNzLmFkZE1vZGVsRXZlbnQoeyBuYW1lOiBldmVudF9uYW1lLCBtb2RlbDogbSwga2V5OiBpbmZvLmtleSwgcGF0aDogaW5mby5wYXRoIH0pO1xuICAgICAgICAgICAgICBpbmZvLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfSk7IC8vIHRyaWdnZXIgdXBkYXRlXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgY2FsbGJhY2tzID0gdGhpcy5fX2tiLmNhbGxiYWNrc1tldmVudF9uYW1lXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW5mbyA9IF8uZGVmYXVsdHMoeyBvYmogfSwgY2FsbGJhY2tfaW5mbyk7XG4gICAgICBjYWxsYmFja3MubGlzdC5wdXNoKGluZm8pOyAvLyBzdG9yZSB0aGUgY2FsbGJhY2sgaW5mb3JtYXRpb25cbiAgICAgIGlmIChtb2RlbCkgdGhpcy5fb25Nb2RlbExvYWRlZChtb2RlbCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlbGVhc2VDYWxsYmFja3Mob2JqKSB7XG4gICAgdGhpcy5lZSA9IG51bGw7XG4gICAgXy5lYWNoKHRoaXMuX19rYi5jYWxsYmFja3MsIChjYWxsYmFja3MsIGV2ZW50X25hbWUpID0+IHRoaXMuX3VuYmluZENhbGxiYWNrcyhldmVudF9uYW1lLCBjYWxsYmFja3MsIGtiLndhc1JlbGVhc2VkKG9iaikpKTtcbiAgICByZXR1cm4gZGVsZXRlIHRoaXMuX19rYi5jYWxsYmFja3M7XG4gIH1cblxuICAvLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgLy8gSW50ZXJuYWxcbiAgLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgLy8gQG5vZG9jXG4gIC8vIE5PVEU6IHRoaXMgaXMgY2FsbGVkIGJ5IHJlZ2lzdGVyQ2FsbGJhY2tzIHNvIHRoZSBtb2RlbCBjb3VsZCBhbHJlYWR5IGJlIGJvdW5kIGFuZCB3ZSBqdXN0IHdhbnQgdG8gYmluZCB0aGUgbmV3IGluZm9cbiAgLy8gTk9URTogdGhpcyBpcyBjYWxsZWQgYnkgZW1pdHRlciBzbyBpdCBtYXkgYmUgdXNlZCB0byBjbGVhciBhIHByZXZpb3VzIGVtaXR0ZXIgd2l0aG91dCB0cmlnZ2VyaW5nIGFuIGludGVybWVkaWF0ZSBjaGFuZ2VcbiAgX29uTW9kZWxMb2FkZWQgPSAobW9kZWwpID0+IHtcbiAgICB0aGlzLmVlID0gbW9kZWw7XG5cbiAgICBfLmVhY2godGhpcy5fX2tiLmNhbGxiYWNrcywgKGNhbGxiYWNrcywgZXZlbnRfbmFtZSkgPT4ge1xuICAgICAgaWYgKGNhbGxiYWNrcy5tb2RlbCAmJiAoY2FsbGJhY2tzLm1vZGVsICE9PSBtb2RlbCkpIHRoaXMuX3VuYmluZENhbGxiYWNrcyhldmVudF9uYW1lLCBjYWxsYmFja3MsIHRydWUpO1xuICAgICAgaWYgKCFjYWxsYmFja3MubW9kZWwpIHtcbiAgICAgICAgY2FsbGJhY2tzLm1vZGVsID0gbW9kZWw7XG4gICAgICAgIG1vZGVsLmJpbmQoZXZlbnRfbmFtZSwgY2FsbGJhY2tzLmZuKTtcbiAgICAgIH1cblxuICAgICAgXy5lYWNoKGNhbGxiYWNrcy5saXN0LCAoaW5mbykgPT4ge1xuICAgICAgICBpZiAoIWluZm8udW5iaW5kX2ZuICYmIGtiLnNldHRpbmdzLm9ybSAmJiBrYi5zZXR0aW5ncy5vcm0uY3VzdG9tQmluZCkge1xuICAgICAgICAgIGluZm8udW5iaW5kX2ZuID0ga2Iuc2V0dGluZ3Mub3JtLmN1c3RvbUJpbmQobW9kZWwsIGluZm8ua2V5LCBpbmZvLnVwZGF0ZSwgaW5mby5wYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5mby5lbWl0dGVyKSBpbmZvLmVtaXR0ZXIobW9kZWwpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBAbm9kb2NcbiAgX29uTW9kZWxVbmxvYWRlZCA9IChtb2RlbCkgPT4ge1xuICAgIGlmICh0aGlzLmVlICE9PSBtb2RlbCkgcmV0dXJuO1xuICAgIHRoaXMuZWUgPSBudWxsO1xuICAgIF8uZWFjaCh0aGlzLl9fa2IuY2FsbGJhY2tzLCAoY2FsbGJhY2tzLCBldmVudF9uYW1lKSA9PiB0aGlzLl91bmJpbmRDYWxsYmFja3MoZXZlbnRfbmFtZSwgY2FsbGJhY2tzKSk7XG4gIH1cblxuICAvLyBAbm9kb2NcbiAgX3VuYmluZENhbGxiYWNrcyA9IChldmVudF9uYW1lLCBjYWxsYmFja3MsIHNraXBfZW1pdHRlcikgPT4ge1xuICAgIGlmIChjYWxsYmFja3MubW9kZWwpIHsgY2FsbGJhY2tzLm1vZGVsLnVuYmluZChldmVudF9uYW1lLCBjYWxsYmFja3MuZm4pOyBjYWxsYmFja3MubW9kZWwgPSBudWxsOyB9XG5cbiAgICBfLmVhY2goY2FsbGJhY2tzLmxpc3QsIChpbmZvKSA9PiB7XG4gICAgICBpZiAoaW5mby51bmJpbmRfZm4pIHsgKGluZm8udW5iaW5kX2ZuKCksIChpbmZvLnVuYmluZF9mbiA9IG51bGwpKTsgfVxuICAgICAgaWYgKGluZm8uZW1pdHRlciAmJiAhc2tpcF9lbWl0dGVyICYmICFrYi53YXNSZWxlYXNlZChpbmZvLm9iaikpIHsgaW5mby5lbWl0dGVyKG51bGwpOyB9XG4gICAgfSk7XG4gIH1cbn1cblxuLy8gZmFjdG9yeSBmdW5jdGlvblxuZXhwb3J0IGNvbnN0IGVtaXR0ZXJPYnNlcnZhYmxlID0gKGVtaXR0ZXIsIG9ic2VydmFibGUpID0+IG5ldyBFdmVudFdhdGNoZXIoZW1pdHRlciwgb2JzZXJ2YWJsZSk7XG4iLCIvKlxuICBrbm9ja2JhY2suanMgMi4wLjAtYWxwaGEuMVxuICBDb3B5cmlnaHQgKGMpICAyMDExLTIwMTYgS2V2aW4gTWFsYWtvZmYuXG4gIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4gIFNvdXJjZTogaHR0cHM6Ly9naXRodWIuY29tL2ttYWxha29mZi9rbm9ja2JhY2tcbiAgRGVwZW5kZW5jaWVzOiBLbm9ja291dC5qcywgQmFja2JvbmUuanMsIGFuZCBVbmRlcnNjb3JlLmpzIChvciBMb0Rhc2guanMpLlxuICBPcHRpb25hbCBkZXBlbmRlbmNpZXM6IEJhY2tib25lLk1vZGVsUmVmLmpzIGFuZCBCYWNrYm9uZU9STS5cbiovXG5cbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuXG5pbXBvcnQga2IgZnJvbSAnLi9rYic7XG5cbi8vIFVzZWQgdG8gc2hhcmUgdGhlIGhpZXJhY2h5IG9mIGNvbnN0cnVjdG9ycyBhbmQgY3JlYXRlIGZ1bmN0aW9ucyBieSBwYXRoIHRvIGFsbG93IGZvciBjdXN0b20gY3JlYXRpb24gcGVyIE1vZGVsIGF0dHJpYnV0ZS5cbi8vXG4vLyBAZXhhbXBsZSBDcmVhdGUgYW4gaW5zdGFuY2UgYnkgcGF0aC5cbi8vICAgdmFyIGZhY3RvcnkgPSBuZXcga2IuRmFjdG9yeSgpO1xuLy8gICBmYWN0b3J5LmFkZFBhdGhNYXBwaW5nKCdib2IudGhlLmJ1aWxkZXInLCBrYi5WaWV3TW9kZWwpO1xuLy8gICB2aWV3X21vZGVsID0gZmFjdG9yeS5jcmVhdGVGb3JQYXRoKG5ldyBCYWNrYm9uZS5Nb2RlbCh7bmFtZTogJ0JvYid9KSwgJ2JvYi50aGUuYnVpbGRlcicpOyAvLyBjcmVhdGVzIGtiLlZpZXdNb2RlbFxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmFjdG9yeSB7XG4gIC8vIFVzZWQgdG8gZWl0aGVyIHJlZ2lzdGVyIHlvdXJzZWxmIHdpdGggdGhlIGV4aXN0aW5nIGZhY3Rvcnkgb3IgdG8gY3JlYXRlIGEgbmV3IGZhY3RvcnkuXG4gIC8vXG4gIC8vIEBwYXJhbSBbT2JqZWN0XSBvcHRpb25zIHBsZWFzZSBwYXNzIHRoZSBvcHRpb25zIGZyb20geW91ciBjb25zdHJ1Y3RvciB0byB0aGUgcmVnaXN0ZXIgbWV0aG9kLiBGb3IgZXhhbXBsZSwgY29uc3RydWN0b3IobW9kZWwsIG9wdGlvbnMpXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbT2JqZWN0XSBmYWN0b3JpZXMgYSBtYXAgb2YgZG90LWRlbGltaW5hdGVkIHBhdGhzO1xuICAvLyBmb3IgZXhhbXBsZSAnbW9kZWxzLm93bmVyJzoga2IuVmlld01vZGVsIHRvIGVpdGhlciBjb25zdHJ1Y3RvcnMgb3IgY3JlYXRlIGZ1bmN0aW9ucy4gU2lnbmF0dXJlOiAnc29tZS5wYXRoJzogZnVuY3Rpb24ob2JqZWN0LCBvcHRpb25zKVxuICAvLyBAcGFyYW0gW0luc3RhbmNlXSBvYmogdGhlIGluc3RhbmNlIHRoYXQgd2lsbCBvd24gb3IgcmVnaXN0ZXIgd2l0aCB0aGUgc3RvcmVcbiAgLy8gQHBhcmFtIFtTdHJpbmddIG93bmVyX3BhdGggdGhlIHBhdGggdG8gdGhlIG93bmluZyBvYmplY3QgZm9yIHR1cm5pbmcgcmVsYXRpdmUgc2NvcGluZyBvZiB0aGUgZmFjdG9yaWVzIHRvIGFic29sdXRlIHBhdGhzLlxuICBzdGF0aWMgdXNlT3B0aW9uc09yQ3JlYXRlKG9wdGlvbnMsIG9iaiwgb3duZXJfcGF0aCkge1xuICAgIC8vIHNoYXJlXG4gICAgaWYgKG9wdGlvbnMuZmFjdG9yeSAmJiAoIW9wdGlvbnMuZmFjdG9yaWVzIHx8IChvcHRpb25zLmZhY3RvcmllcyAmJiBvcHRpb25zLmZhY3RvcnkuaGFzUGF0aE1hcHBpbmdzKG9wdGlvbnMuZmFjdG9yaWVzLCBvd25lcl9wYXRoKSkpKSB7XG4gICAgICByZXR1cm4ga2IudXRpbHMud3JhcHBlZEZhY3Rvcnkob2JqLCBvcHRpb25zLmZhY3RvcnkpO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBhIG5ldyBmYWN0b3J5XG4gICAgY29uc3QgZmFjdG9yeSA9IGtiLnV0aWxzLndyYXBwZWRGYWN0b3J5KG9iaiwgbmV3IGtiLkZhY3Rvcnkob3B0aW9ucy5mYWN0b3J5KSk7XG4gICAgaWYgKG9wdGlvbnMuZmFjdG9yaWVzKSBmYWN0b3J5LmFkZFBhdGhNYXBwaW5ncyhvcHRpb25zLmZhY3Rvcmllcywgb3duZXJfcGF0aCk7XG4gICAgcmV0dXJuIGZhY3Rvcnk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwYXJlbnRfZmFjdG9yeSkge1xuICAgIHRoaXMucGF0aHMgPSB7fTtcbiAgICBpZiAocGFyZW50X2ZhY3RvcnkpIHRoaXMucGFyZW50X2ZhY3RvcnkgPSBwYXJlbnRfZmFjdG9yeTtcbiAgfVxuXG4gIGhhc1BhdGgocGF0aCkgeyByZXR1cm4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLnBhdGhzLCBwYXRoKSAmJiB0aGlzLnBhcmVudF9mYWN0b3J5KSA/IHRoaXMucGFyZW50X2ZhY3RvcnkuaGFzUGF0aChwYXRoKSA6IGZhbHNlOyB9XG5cbiAgYWRkUGF0aE1hcHBpbmcocGF0aCwgY3JlYXRlX2luZm8pIHsgdGhpcy5wYXRoc1twYXRoXSA9IGNyZWF0ZV9pbmZvOyB9XG4gIGFkZFBhdGhNYXBwaW5ncyhmYWN0b3JpZXMsIG93bmVyX3BhdGgpIHsgXy5lYWNoKGZhY3RvcmllcywgKGNyZWF0ZV9pbmZvLCBwYXRoKSA9PiB7IHRoaXMucGF0aHNba2IudXRpbHMucGF0aEpvaW4ob3duZXJfcGF0aCwgcGF0aCldID0gY3JlYXRlX2luZm87IH0pOyB9XG4gIGhhc1BhdGhNYXBwaW5ncyhmYWN0b3JpZXMsIG93bmVyX3BhdGgpIHtcbiAgICBsZXQgYWxsX2V4aXN0ID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IHBhdGggaW4gZmFjdG9yaWVzKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGZhY3RvcmllcywgcGF0aCkpIHtcbiAgICAgICAgY29uc3QgY3JlYXRvciA9IGZhY3Rvcmllc1twYXRoXTtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdfY3JlYXRvciA9IHRoaXMuY3JlYXRvckZvclBhdGgobnVsbCwga2IudXRpbHMucGF0aEpvaW4ob3duZXJfcGF0aCwgcGF0aCkpO1xuICAgICAgICBhbGxfZXhpc3QgJj0gKGV4aXN0aW5nX2NyZWF0b3IgJiYgKGNyZWF0b3IgPT09IGV4aXN0aW5nX2NyZWF0b3IpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFsbF9leGlzdDtcbiAgfVxuXG4gIC8vIElmIHBvc3NpYmxlLCBjcmVhdGVzIGFuIG9ic2VydmFibGUgZm9yIGFuIG9iamVjdCB1c2luZyBhIGRvdC1kZWxpbWluYXRlZCBwYXRoLlxuICAvL1xuICAvLyBAZXhhbXBsZSBDcmVhdGUgYW4gaW5zdGFuY2UgYnkgcGF0aC5cbiAgLy8gICB2YXIgZmFjdG9yeSA9IG5ldyBrYi5GYWN0b3J5KCk7XG4gIC8vICAgZmFjdG9yeS5hZGRQYXRoTWFwcGluZygnYm9iLnRoZS5idWlsZGVyJywga2IuVmlld01vZGVsKTtcbiAgLy8gICB2aWV3X21vZGVsID0gZmFjdG9yeS5jcmVhdGVGb3JQYXRoKG5ldyBCYWNrYm9uZS5Nb2RlbCh7bmFtZTogJ0JvYid9KSwgJ2JvYi50aGUuYnVpbGRlcicpOyAvLyBjcmVhdGVzIGtiLlZpZXdNb2RlbFxuICBjcmVhdG9yRm9yUGF0aChvYmosIHBhdGgpIHtcbiAgICBjb25zdCBjcmVhdG9yID0gdGhpcy5wYXRoc1twYXRoXTtcbiAgICBpZiAoY3JlYXRvcikgcmV0dXJuIChjcmVhdG9yLnZpZXdfbW9kZWwgPyBjcmVhdG9yLnZpZXdfbW9kZWwgOiBjcmVhdG9yKTtcbiAgICBpZiAodGhpcy5wYXJlbnRfZmFjdG9yeSkgcmV0dXJuIHRoaXMucGFyZW50X2ZhY3RvcnkuY3JlYXRvckZvclBhdGgob2JqLCBwYXRoKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIiwiLypcbiAga25vY2tiYWNrLmpzIDIuMC4wLWFscGhhLjFcbiAgQ29weXJpZ2h0IChjKSAgMjAxMS0yMDE2IEtldmluIE1hbGFrb2ZmLlxuICBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuICBTb3VyY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9rbWFsYWtvZmYva25vY2tiYWNrXG4gIERlcGVuZGVuY2llczogS25vY2tvdXQuanMsIEJhY2tib25lLmpzLCBhbmQgVW5kZXJzY29yZS5qcyAob3IgTG9EYXNoLmpzKS5cbiAgT3B0aW9uYWwgZGVwZW5kZW5jaWVzOiBCYWNrYm9uZS5Nb2RlbFJlZi5qcyBhbmQgQmFja2JvbmVPUk0uXG4qL1xuXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcblxuY29uc3QgYXNzaWduID0gXy5hc3NpZ24gfHwgXy5leHRlbmQ7XG5cbi8vIEBub2RvY1xuY29uc3QgX21lcmdlQXJyYXkgPSBmdW5jdGlvbiAocmVzdWx0LCBrZXksIHZhbHVlKSB7XG4gIGlmICghcmVzdWx0W2tleV0pIHJlc3VsdFtrZXldID0gW107XG4gIGlmICghXy5pc0FycmF5KHZhbHVlKSkgdmFsdWUgPSBbdmFsdWVdO1xuICByZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldLmxlbmd0aCA/IF8udW5pb24ocmVzdWx0W2tleV0sIHZhbHVlKSA6IHZhbHVlO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLy8gQG5vZG9jXG5jb25zdCBfbWVyZ2VPYmplY3QgPSBmdW5jdGlvbiAocmVzdWx0LCBrZXksIHZhbHVlKSB7XG4gIGlmICghcmVzdWx0W2tleV0pIHJlc3VsdFtrZXldID0ge307XG4gIHJldHVybiBhc3NpZ24ocmVzdWx0W2tleV0sIHZhbHVlKTtcbn07XG5cbi8vIEBub2RvY1xuY29uc3QgX2tleUFycmF5VG9PYmplY3QgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgY29uc3QgcmVzdWx0ID0ge307XG4gIF8uZWFjaCh2YWx1ZSwgKGl0ZW0pID0+IHsgcmVzdWx0W2l0ZW1dID0geyBrZXk6IGl0ZW0gfTsgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5jb25zdCBfbWVyZ2VPcHRpb25zID0gZnVuY3Rpb24gKHJlc3VsdCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHJldHVybiByZXN1bHQ7XG5cbiAgXy5lYWNoKG9wdGlvbnMsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgc3dpdGNoIChrZXkpIHtcbiAgICAgIGNhc2UgJ2ludGVybmFscyc6IGNhc2UgJ3JlcXVpcmVzJzogY2FzZSAnZXhjbHVkZXMnOiBjYXNlICdzdGF0aWNzJzogX21lcmdlQXJyYXkocmVzdWx0LCBrZXksIHZhbHVlKTsgYnJlYWs7XG4gICAgICBjYXNlICdrZXlzJzpcbiAgICAgICAgLy8gYW4gb2JqZWN0XG4gICAgICAgIGlmICgoXy5pc09iamVjdCh2YWx1ZSkgJiYgIV8uaXNBcnJheSh2YWx1ZSkpIHx8IChfLmlzT2JqZWN0KHJlc3VsdFtrZXldKSAmJiAhXy5pc0FycmF5KHJlc3VsdFtrZXldKSkpIHtcbiAgICAgICAgICBpZiAoIV8uaXNPYmplY3QodmFsdWUpKSB7IHZhbHVlID0gW3ZhbHVlXTsgfVxuICAgICAgICAgIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7IHZhbHVlID0gX2tleUFycmF5VG9PYmplY3QodmFsdWUpOyB9XG4gICAgICAgICAgaWYgKF8uaXNBcnJheShyZXN1bHRba2V5XSkpIHsgcmVzdWx0W2tleV0gPSBfa2V5QXJyYXlUb09iamVjdChyZXN1bHRba2V5XSk7IH1cbiAgICAgICAgICBfbWVyZ2VPYmplY3QocmVzdWx0LCBrZXksIHZhbHVlKTtcblxuICAgICAgICAvLyBhbiBhcnJheVxuICAgICAgICB9IGVsc2UgX21lcmdlQXJyYXkocmVzdWx0LCBrZXksIHZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2ZhY3Rvcmllcyc6XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24odmFsdWUpKSByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgICAgICBlbHNlIF9tZXJnZU9iamVjdChyZXN1bHQsIGtleSwgdmFsdWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N0YXRpY19kZWZhdWx0cyc6IF9tZXJnZU9iamVjdChyZXN1bHQsIGtleSwgdmFsdWUpOyBicmVhaztcbiAgICAgIGNhc2UgJ29wdGlvbnMnOiBicmVhaztcbiAgICAgIGRlZmF1bHQ6IHJlc3VsdFtrZXldID0gdmFsdWU7IGJyZWFrO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIF9tZXJnZU9wdGlvbnMocmVzdWx0LCBvcHRpb25zLm9wdGlvbnMpO1xufTtcblxuLy8gQG5vZG9jXG5leHBvcnQgZGVmYXVsdCBvcHRpb25zID0+IF9tZXJnZU9wdGlvbnMoe30sIG9wdGlvbnMpO1xuIiwiLypcbiAga25vY2tiYWNrLmpzIDIuMC4wLWFscGhhLjFcbiAgQ29weXJpZ2h0IChjKSAgMjAxMS0yMDE2IEtldmluIE1hbGFrb2ZmLlxuICBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuICBTb3VyY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9rbWFsYWtvZmYva25vY2tiYWNrXG4gIERlcGVuZGVuY2llczogS25vY2tvdXQuanMsIEJhY2tib25lLmpzLCBhbmQgVW5kZXJzY29yZS5qcyAob3IgTG9EYXNoLmpzKS5cbiAgT3B0aW9uYWwgZGVwZW5kZW5jaWVzOiBCYWNrYm9uZS5Nb2RlbFJlZi5qcyBhbmQgQmFja2JvbmVPUk0uXG4qL1xuXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcblxuLy8gQG5vZG9jXG5leHBvcnQgZGVmYXVsdCAob2JqKSA9PiB7XG4gIGlmICghb2JqKSByZXR1cm4gb2JqO1xuICBpZiAob2JqLl9fa2IpIHJldHVybiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iai5fX2tiLCAnb2JqZWN0JykgPyBvYmouX19rYi5vYmplY3QgOiBvYmopO1xuICBpZiAoXy5pc0FycmF5KG9iaikpIHJldHVybiBfLm1hcChvYmosIHRlc3QgPT4gdW53cmFwTW9kZWxzKHRlc3QpKTtcbiAgaWYgKF8uaXNPYmplY3Qob2JqKSAmJiAob2JqLmNvbnN0cnVjdG9yID09PSB7fS5jb25zdHJ1Y3RvcikpIHsgLy8gYSBzaW1wbGUgb2JqZWN0XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgXy5lYWNoKG9iaiwgKHZhbHVlLCBrZXkpID0+IHsgcmVzdWx0W2tleV0gPSB1bndyYXBNb2RlbHModmFsdWUpOyB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG4iLCIvKlxuICBrbm9ja2JhY2suanMgMi4wLjAtYWxwaGEuMVxuICBDb3B5cmlnaHQgKGMpICAyMDExLTIwMTYgS2V2aW4gTWFsYWtvZmYuXG4gIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4gIFNvdXJjZTogaHR0cHM6Ly9naXRodWIuY29tL2ttYWxha29mZi9rbm9ja2JhY2tcbiAgRGVwZW5kZW5jaWVzOiBLbm9ja291dC5qcywgQmFja2JvbmUuanMsIGFuZCBVbmRlcnNjb3JlLmpzIChvciBMb0Rhc2guanMpLlxuICBPcHRpb25hbCBkZXBlbmRlbmNpZXM6IEJhY2tib25lLk1vZGVsUmVmLmpzIGFuZCBCYWNrYm9uZU9STS5cbiovXG5cbi8vIEBub2RvY1xuY29uc3Qgd3JhcHBlZERlc3Ryb3kgPSAob2JqKSA9PiB7XG4gIGlmICghb2JqLl9fa2IpIHJldHVybjtcbiAgaWYgKG9iai5fX2tiLmV2ZW50X3dhdGNoZXIpIG9iai5fX2tiLmV2ZW50X3dhdGNoZXIucmVsZWFzZUNhbGxiYWNrcyhvYmopO1xuXG4gIGNvbnN0IHsgX19rYiB9ID0gb2JqO1xuICBvYmouX19rYiA9IG51bGw7IC8vIGNsZWFyIG5vdyB0byBicmVhayBjeWNsZXNcblxuICBpZiAoX19rYi5vYnNlcnZhYmxlKSB7XG4gICAgX19rYi5vYnNlcnZhYmxlLmRlc3Ryb3kgPSBudWxsOyBfX2tiLm9ic2VydmFibGUucmVsZWFzZSA9IG51bGw7XG4gICAgd3JhcHBlZERlc3Ryb3koX19rYi5vYnNlcnZhYmxlKTsgX19rYi5vYnNlcnZhYmxlID0gbnVsbDtcbiAgfVxuICBfX2tiLmZhY3RvcnkgPSBudWxsO1xuXG4gIC8vIHJlbGVhc2UgdGhlIGV2ZW50X3dhdGNoZXJcbiAgaWYgKF9fa2IuZXZlbnRfd2F0Y2hlcl9pc19vd25lZCkgX19rYi5ldmVudF93YXRjaGVyLmRlc3Ryb3koKTtcbiAgX19rYi5ldmVudF93YXRjaGVyID0gbnVsbDtcblxuICAvLyByZWxlYXNlIHRoZSBzdG9yZVxuICBpZiAoX19rYi5zdG9yZV9pc19vd25lZCkgX19rYi5zdG9yZS5kZXN0cm95KCk7XG4gIF9fa2Iuc3RvcmUgPSBudWxsO1xuXG4gIGlmIChfX2tiLnN0b3Jlc19yZWZlcmVuY2VzKSB7XG4gICAgbGV0IHN0b3JlX3JlZmVyZW5jZXMgPSBfX2tiLnN0b3Jlc19yZWZlcmVuY2VzLnBvcCgpO1xuICAgIHdoaWxlIChzdG9yZV9yZWZlcmVuY2VzKSB7XG4gICAgICBpZiAoIXN0b3JlX3JlZmVyZW5jZXMuc3RvcmUuX19rYl9yZWxlYXNlZCkgc3RvcmVfcmVmZXJlbmNlcy5zdG9yZS5yZWxlYXNlKG9iaik7XG4gICAgICBzdG9yZV9yZWZlcmVuY2VzID0gX19rYi5zdG9yZXNfcmVmZXJlbmNlcy5wb3AoKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHdyYXBwZWREZXN0cm95O1xuIiwiLypcbiAga25vY2tiYWNrLmpzIDIuMC4wLWFscGhhLjFcbiAgQ29weXJpZ2h0IChjKSAgMjAxMS0yMDE2IEtldmluIE1hbGFrb2ZmLlxuICBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuICBTb3VyY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9rbWFsYWtvZmYva25vY2tiYWNrXG4gIERlcGVuZGVuY2llczogS25vY2tvdXQuanMsIEJhY2tib25lLmpzLCBhbmQgVW5kZXJzY29yZS5qcyAob3IgTG9EYXNoLmpzKS5cbiAgT3B0aW9uYWwgZGVwZW5kZW5jaWVzOiBCYWNrYm9uZS5Nb2RlbFJlZi5qcyBhbmQgQmFja2JvbmVPUk0uXG4qL1xuXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCBCYWNrYm9uZSBmcm9tICdiYWNrYm9uZSc7XG5pbXBvcnQga28gZnJvbSAna25vY2tvdXQnO1xuXG5pbXBvcnQgJy4vbW9ua2V5LXBhdGNoZXMnO1xuaW1wb3J0IGtiIGZyb20gJy4va2InO1xuaW1wb3J0IENvbGxlY3Rpb25PYnNlcnZhYmxlLCB7IGNvbGxlY3Rpb25PYnNlcnZhYmxlLCBjb21wYXJlIH0gZnJvbSAnLi9jb2xsZWN0aW9uLW9ic2VydmFibGUnO1xuaW1wb3J0IGNvbmZpZ3VyZSwgeyBzZXR0aW5ncyB9IGZyb20gJy4vY29uZmlndXJlJztcbmltcG9ydCBFdmVudFdhdGNoZXIgZnJvbSAnLi9ldmVudC13YXRjaGVyJztcbmltcG9ydCBGYWN0b3J5IGZyb20gJy4vZmFjdG9yeSc7XG5pbXBvcnQgeyBpbmplY3RWaWV3TW9kZWxzIH0gZnJvbSAnLi9pbmplY3QnO1xuaW1wb3J0IE9ic2VydmFibGUsIHsgb2JzZXJ2YWJsZSB9IGZyb20gJy4vb2JzZXJ2YWJsZSc7XG5pbXBvcnQgU3RhdGlzdGljcyBmcm9tICcuL3N0YXRpc3RpY3MnO1xuaW1wb3J0IFN0b3JlIGZyb20gJy4vc3RvcmUnO1xuaW1wb3J0IHV0aWxzIGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IFZpZXdNb2RlbCwgeyB2aWV3TW9kZWwgfSBmcm9tICcuL3ZpZXctbW9kZWwnO1xuXG5jb25zdCBhcGkgPSB7XG4gIF8sXG4gIEJhY2tib25lLFxuICBrbyxcbiAgQ29sbGVjdGlvbk9ic2VydmFibGUsXG4gIGNvbGxlY3Rpb25PYnNlcnZhYmxlLFxuICBvYnNlcnZhYmxlQ29sbGVjdGlvbjogY29sbGVjdGlvbk9ic2VydmFibGUsIFxuICBjb21wYXJlLFxuICBjb25maWd1cmUsXG4gIHNldHRpbmdzLFxuICBFdmVudFdhdGNoZXIsXG4gIEZhY3RvcnksXG4gIFJFQ1VTSVZFX0FVVE9fSU5KRUNUOiB0cnVlLFxuICBpbmplY3RWaWV3TW9kZWxzLFxuICBPYnNlcnZhYmxlLFxuICBvYnNlcnZhYmxlLFxuICBTdGF0aXN0aWNzLFxuICBTdG9yZSxcbiAgdXRpbHMsXG4gIFZpZXdNb2RlbCxcbiAgdmlld01vZGVsLFxufTtcbmtiLmFzc2lnbihrYiwgYXBpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBrYjtcbiIsIi8qXG4gIGtub2NrYmFjay5qcyAyLjAuMC1hbHBoYS4xXG4gIENvcHlyaWdodCAoYykgIDIwMTEtMjAxNiBLZXZpbiBNYWxha29mZi5cbiAgTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiAgU291cmNlOiBodHRwczovL2dpdGh1Yi5jb20va21hbGFrb2ZmL2tub2NrYmFja1xuICBEZXBlbmRlbmNpZXM6IEtub2Nrb3V0LmpzLCBCYWNrYm9uZS5qcywgYW5kIFVuZGVyc2NvcmUuanMgKG9yIExvRGFzaC5qcykuXG4gIE9wdGlvbmFsIGRlcGVuZGVuY2llczogQmFja2JvbmUuTW9kZWxSZWYuanMgYW5kIEJhY2tib25lT1JNLlxuKi9cblxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQga28gZnJvbSAna25vY2tvdXQnO1xuXG5pbXBvcnQga2IgZnJvbSAnLi9rYic7XG5cbmNvbnN0IHJvb3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpID8gd2luZG93IDogKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSA/IGdsb2JhbCA6IHRoaXM7XG5cbi8vIGN1c3RvbSBLbm9ja291dCBgaW5qZWN0YCBiaW5kaW5nXG5jb25zdCBpbmplY3QgPSAoZGF0YSwgdmlld19tb2RlbCwgZWxlbWVudCwgdmFsdWVfYWNjZXNzb3IsIGFsbF9iaW5kaW5nc19hY2Nlc3NvciwgbmVzdGVkKSA9PiB7XG4gIGNvbnN0IGRvSW5qZWN0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZpZXdfbW9kZWwgPSBuZXcgdmFsdWUodmlld19tb2RlbCwgZWxlbWVudCwgdmFsdWVfYWNjZXNzb3IsIGFsbF9iaW5kaW5nc19hY2Nlc3Nvcik7IC8vIHVzZSAnbmV3JyB0byBhbGxvdyBmb3IgY2xhc3NlcyBpbiBhZGRpdGlvbiB0byBmdW5jdGlvbnNcbiAgICAgIGtiLnJlbGVhc2VPbk5vZGVSZW1vdmUodmlld19tb2RlbCwgZWxlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHZpZXdfbW9kZWwgY29uc3RydWN0b3IgY2F1c2VzIGEgc2NvcGUgY2hhbmdlXG4gICAgICBpZiAodmFsdWUudmlld19tb2RlbCkge1xuICAgICAgICAvLyBzcGVjaWZ5aW5nIGEgdmlld19tb2RlbCBjaGFuZ2VzIHRoZSBzY29wZSBzbyB3ZSBuZWVkIHRvIGJpbmQgYSBkZXN0cm95XG4gICAgICAgIHZpZXdfbW9kZWwgPSBuZXcgdmFsdWUudmlld19tb2RlbCh2aWV3X21vZGVsLCBlbGVtZW50LCB2YWx1ZV9hY2Nlc3NvciwgYWxsX2JpbmRpbmdzX2FjY2Vzc29yKTtcbiAgICAgICAga2IucmVsZWFzZU9uTm9kZVJlbW92ZSh2aWV3X21vZGVsLCBlbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgLy8gcmVzb2x2ZSBhbmQgbWVyZ2UgaW4gZWFjaCBrZXlcbiAgICAgIF8uZWFjaCh2YWx1ZSwgKGl0ZW0sIGtleSkgPT4ge1xuICAgICAgICBpZiAoa2V5ID09PSAndmlld19tb2RlbCcpIHJldHVybjtcblxuICAgICAgICAvLyBjcmVhdGUgZnVuY3Rpb25cbiAgICAgICAgaWYgKGtleSA9PT0gJ2NyZWF0ZScpIGl0ZW0odmlld19tb2RlbCwgZWxlbWVudCwgdmFsdWVfYWNjZXNzb3IsIGFsbF9iaW5kaW5nc19hY2Nlc3Nvcik7XG5cbiAgICAgICAgLy8gcmVzb2x2ZSBuZXN0ZWQgd2l0aCBhc3NpZ24gb3Igbm90XG4gICAgICAgIGVsc2UgaWYgKF8uaXNPYmplY3QoaXRlbSkgJiYgIV8uaXNGdW5jdGlvbihpdGVtKSkge1xuICAgICAgICAgIGNvbnN0IHRhcmdldCA9IG5lc3RlZCB8fCAoaXRlbSAmJiBpdGVtLmNyZWF0ZSkgPyB7fSA6IHZpZXdfbW9kZWw7XG4gICAgICAgICAgdmlld19tb2RlbFtrZXldID0gaW5qZWN0KGl0ZW0sIHRhcmdldCwgZWxlbWVudCwgdmFsdWVfYWNjZXNzb3IsIGFsbF9iaW5kaW5nc19hY2Nlc3NvciwgdHJ1ZSk7XG5cbiAgICAgICAgLy8gc2ltcGxlIHNldFxuICAgICAgICB9IGVsc2Ugdmlld19tb2RlbFtrZXldID0gaXRlbTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB2aWV3X21vZGVsO1xuICB9O1xuXG4gIC8vIGluIHJlY3Vyc2l2ZSBjYWxscywgd2UgYXJlIGFscmVhZHkgcHJvdGVjdGVkIGZyb20gcHJvcGFnYXRpbmcgZGVwZW5kZW5jaWVzIHRvIHRoZSB0ZW1wbGF0ZVxuICByZXR1cm4gbmVzdGVkID8gZG9JbmplY3QoZGF0YSkgOiBrYi5pZ25vcmUoKCkgPT4gZG9JbmplY3QoZGF0YSkpO1xufTtcblxua28uYmluZGluZ0hhbmRsZXJzLmluamVjdCA9IHtcbiAgaW5pdChlbGVtZW50LCB2YWx1ZV9hY2Nlc3NvciwgYWxsX2JpbmRpbmdzX2FjY2Vzc29yLCB2aWV3X21vZGVsKSB7XG4gICAgcmV0dXJuIGluamVjdChrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlX2FjY2Vzc29yKCkpLCB2aWV3X21vZGVsLCBlbGVtZW50LCB2YWx1ZV9hY2Nlc3NvciwgYWxsX2JpbmRpbmdzX2FjY2Vzc29yKTtcbiAgfSxcbn07XG5cbi8vIFVzZWQgdG8gaW5qZWN0IFZpZXdNb2RlbHMgYW5kIG9ic2VydmFibGVzIGR5bmFtaWNhbGx5IGZyb20geW91ciBIVE1MIFZpZXdzLiBGb3IgYm90aCB0aGUgYCdrYi1pbmplY3QnYCBhdHRyaWJ1dGUgYW5kIHRoZSBkYXRhLWJpbmQgYCdpbmplY3QnYCBjdXN0b20gYmluZGluZywgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzIGFyZSByZXNlcnZlZDpcbi8vXG4vLyAqIGAndmlld19tb2RlbCdgIGNsYXNzIHVzZWQgdG8gY3JlYXRlIGEgbmV3IFZpZXdNb2RlbCBpbnN0YW5jZVxuLy8gKiBgJ2NyZWF0ZSdgIGZ1bmN0aW9uIHVzZWQgdG8gbWFudWFsbHkgYWRkIG9ic2VydmFibGVzIHRvIGEgdmlldyBtb2RlbFxuLy8gKiBgJ29wdGlvbnMnYCB0byBwYXNzIHRvIGtvLmFwcGx5QmluZGluZ3Ncbi8vICogYCdhZnRlckJpbmRpbmcnYCBjYWxsYmFjayAoY2FuIGFsdGVybmF0aXZlbHkgYmUgaW4gdGhlIG9wdGlvbnMpXG4vLyAqIGAnYmVmb3JlQmluZGluZydgIGNhbGxiYWNrIChjYW4gYWx0ZXJuYXRpdmVseSBiZSBpbiB0aGUgb3B0aW9ucylcbi8vXG4vLyBFYWNoIGZ1bmN0aW9uL2NvbnN0cnVjdG9yIGdldHMgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBzaWduYXR1cmUgYCdmdW5jdGlvbih2aWV3X21vZGVsLCBlbGVtZW50KSdgLlxuLy9cbi8vIEBleGFtcGxlIEJpbmQgeW91ciBhcHBsaWNhdGlvbiBhdXRvbWF0aWNhbGx5IHdoZW4gdGhlIERPTSBpcyBsb2FkZWQuXG4vLyAgIDxkaXYga2ItaW5qZWN0PjxzcGFuIGRhdGEtYmluZD1cInRleHQ6ICdIZWxsbyBXb3JsZCEnXCI+PC9zcGFuPjwvZGl2PlxuLy8gQGV4YW1wbGUgQmluZCB5b3VyIGFwcGxpY2F0aW9uIHdpdGggcHJvcGVydGllcy5cbi8vICAgPGRpdiBrYi1pbmplY3Q9XCJtZXNzYWdlOiBrby5vYnNlcnZhYmxlKCdIZWxsbyBXb3JsZCEnKVwiPjxpbnB1dCBkYXRhLWJpbmQ9XCJ2YWx1ZTogbWVzc2FnZVwiPjwvaW5wdXQ+PC9kaXY+XG4vLyBAZXhhbXBsZSBCaW5kIHlvdXIgYXBwbGljYXRpb24gY3JlYXRpbmcgYSBzcGVjaWZpYyBWaWV3TW9kZWwgaW5zdGFuY2Ugd2hlbiB0aGUgRE9NIGlzIGxvYWRlZC5cbi8vICAgPGRpdiBrYi1pbmplY3Q9XCJNeVZpZXdNb2RlbFwiPjxpbnB1dCBkYXRhLWJpbmQ9XCJ2YWx1ZTogbWVzc2FnZVwiPjwvaW5wdXQ+PC9kaXY+XG4vLyAgIHZhciBNeVZpZXdNb2RlbCA9IGZ1bmN0aW9uKHZpZXdfbW9kZWwsIGVsKSB7XG4vLyAgICAgdGhpcy5tZXNzYWdlID0ga28ub2JzZXJ2YWJsZSgnSGVsbG8gV29ybGQhJyk7XG4vLyAgIH1cbi8vIEBleGFtcGxlIEJpbmQgeW91ciBhcHBsaWNhdGlvbiB1c2luZyBhIGZ1bmN0aW9uIHdoZW4gdGhlIERPTSBpcyBsb2FkZWQgKGxpa2UgQW5ndWxhci5qcyBjb250cm9sbGVycykuXG4vLyAgIDxkaXYga2ItaW5qZWN0PVwiY3JlYXRlOiBNeUNvbnRyb2xsZXJcIj48aW5wdXQgZGF0YS1iaW5kPVwidmFsdWU6IG1lc3NhZ2VcIj48L2lucHV0PjwvZGl2PlxuLy8gICB2YXIgTXlDb250cm9sbGVyID0gZnVuY3Rpb24odmlld19tb2RlbCwgZWwpIHtcbi8vICAgICB2aWV3X21vZGVsLm1lc3NhZ2UgPSBrby5vYnNlcnZhYmxlKCdIZWxsbyBXb3JsZCEnKTtcbi8vICAgfVxuLy8gQGV4YW1wbGUgQmluZCB5b3VyIGFwcGxpY2F0aW9uIHdpdGggYSBzcGVjaWZpYyBWaWV3TW9kZWwgaW5zdGFuY2UgYW5kIGEgY2FsbGJhY2sgYmVmb3JlIGFuZCBhZnRlciB0aGUgYmluZGluZy5cbi8vICAgPGRpdiBrYi1pbmplY3Q9XCJNeVZpZXdNb2RlbFwiPjxpbnB1dCBkYXRhLWJpbmQ9XCJ2YWx1ZTogbWVzc2FnZVwiPjwvaW5wdXQ+PC9kaXY+XG4vLyAgIHZhciBNeVZpZXdNb2RlbCA9IGZ1bmN0aW9uKHZpZXdfbW9kZWwsIGVsKSB7XG4vLyAgICAgdGhpcy5tZXNzYWdlID0ga28ub2JzZXJ2YWJsZSgnSGVsbG8gV29ybGQhJyk7XG4vLyAgICAgdGhpcy5iZWZvcmVCaW5kaW5nID0gZnVuY3Rpb24oKSB7YWxlcnQoJ2JlZm9yZScpOyB9O1xuLy8gICAgIHRoaXMuYWZ0ZXJCaW5kaW5nID0gZnVuY3Rpb24oKSB7YWxlcnQoJ2FmdGVyJyk7IH07XG4vLyAgIH1cbi8vIEBleGFtcGxlIER5bmFtaWNhbGx5IGluamVjdCBuZXcgcHJvcGVydGllcyBpbnRvIHlvdXIgVmlld01vZGVsLlxuLy8gICA8ZGl2IGtiLWluamVjdD1cIk15Vmlld01vZGVsXCI+XG4vLyAgICAgPGRpdiBjbGFzcz1cImNvbnRyb2wtZ3JvdXBcIiBkYXRhLWJpbmQ9XCJpbmplY3Q6IHtzaXRlOiBrby5vYnNlcnZhYmxlKCdodHRwOi8veW91ci51cmwuY29tJyl9XCI+XG4vLyAgICAgICA8bGFiZWw+V2Vic2l0ZTwvbGFiZWw+XG4vLyAgICAgICA8aW5wdXQgdHlwZT1cInVybFwiIG5hbWU9XCJzaXRlXCIgZGF0YS1iaW5kPVwidmFsdWU6IHNpdGUsIHZhbHVlVXBkYXRlOiAna2V5dXAnXCIgcmVxdWlyZWQ+XG4vLyAgICAgPC9kaXY+XG4vLyAgIDwvZGl2PlxuLy8gICB2YXIgTXlWaWV3TW9kZWwgPSBmdW5jdGlvbih2aWV3X21vZGVsLCBlbCkge1xuLy8gICAgIC8vIHNpdGUgd2lsbCBiZSBkeW5hbWljYWxseSBhdHRhY2hlZCB0byB0aGlzIFZpZXdNb2RlbFxuLy8gICB9XG4vLyBAZXhhbXBsZSBEeW5hbWljYWxseSBiaW5kIGEgZm9ybS5cbi8vICAgPGRpdiBrYi1pbmplY3Q9XCJNeVZpZXdNb2RlbFwiPlxuLy8gICAgICA8Zm9ybSBuYW1lPVwibXlfZm9ybVwiIGRhdGEtYmluZD1cImluamVjdDoga2IuZm9ybVZhbGlkYXRvclwiPlxuLy8gICAgICAgIDxkaXYgY2xhc3M9XCJjb250cm9sLWdyb3VwXCI+XG4vLyAgICAgICAgIDxsYWJlbD5OYW1lPC9sYWJlbD5cbi8vICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5hbWVcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTogbmFtZSwgdmFsdWVVcGRhdGU6ICdrZXl1cCdcIiByZXF1aXJlZD5cbi8vICAgICAgIDwvZGl2PlxuLy8gICAgICAgPGRpdiBjbGFzcz1cImNvbnRyb2wtZ3JvdXBcIj5cbi8vICAgICAgICAgPGxhYmVsPldlYnNpdGU8L2xhYmVsPlxuLy8gICAgICAgICA8aW5wdXQgdHlwZT1cInVybFwiIG5hbWU9XCJzaXRlXCIgZGF0YS1iaW5kPVwidmFsdWU6IHNpdGUsIHZhbHVlVXBkYXRlOiAna2V5dXAnXCIgcmVxdWlyZWQ+XG4vLyAgICAgICA8L2Rpdj5cbi8vICAgICA8L2Zvcm0+XG4vLyAgIDwvZGl2PlxuLy8gICB2YXIgTXlWaWV3TW9kZWwgPSBrYi5WaWV3TW9kZWwuZXh0ZW5kKHtcbi8vICAgICBjb25zdHJ1Y3RvcjogLT5cbi8vICAgICAgIG1vZGVsID0gbmV3IEJhY2tib25lLk1vZGVsKHtuYW1lOiAnJywgc2l0ZTogJ2h0dHA6Ly95b3VyLnVybC5jb20nfSk7XG4vLyAgICAgICBrYi5WaWV3TW9kZWwucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbW9kZWwpO1xuLy8gICB9KTtcblxuY29uc3QgZG9CaW5kID0gKGFwcCkgPT4ge1xuICBsZXQgb3B0aW9ucyA9IHt9O1xuICBsZXQgYWZ0ZXJCaW5kaW5nID0gbnVsbDtcbiAgbGV0IGJlZm9yZUJpbmRpbmcgPSBudWxsO1xuXG4gIC8vIGV2YWx1YXRlIHRoZSBhcHAgZGF0YVxuICBsZXQgZXhwcmVzc2lvbiA9IGFwcC5iaW5kaW5nO1xuICBpZiAoZXhwcmVzc2lvbikge1xuICAgICghfmV4cHJlc3Npb24uc2VhcmNoKC9bOl0vKSkgfHwgKGV4cHJlc3Npb24gPSBgeyR7ZXhwcmVzc2lvbn19YCk7IC8vIHdyYXAgaWYgaXMgYW4gb2JqZWN0XG4gICAgY29uc3QgZGF0YSA9IChuZXcgRnVuY3Rpb24oJycsIGByZXR1cm4gKCAke2V4cHJlc3Npb259IClgKSkoKSB8fCB7fTtcbiAgICBpZiAoZGF0YS5vcHRpb25zKSB7IG9wdGlvbnMgPSBkYXRhLm9wdGlvbnM7IGRlbGV0ZSBkYXRhLm9wdGlvbnM7IH1cbiAgICBhcHAudmlld19tb2RlbCA9IGluamVjdChkYXRhLCBhcHAudmlld19tb2RlbCwgYXBwLmVsLCBudWxsLCBudWxsLCB0cnVlKTtcbiAgICBhZnRlckJpbmRpbmcgPSBhcHAudmlld19tb2RlbC5hZnRlckJpbmRpbmcgfHwgb3B0aW9ucy5hZnRlckJpbmRpbmc7XG4gICAgYmVmb3JlQmluZGluZyA9IGFwcC52aWV3X21vZGVsLmJlZm9yZUJpbmRpbmcgfHwgb3B0aW9ucy5iZWZvcmVCaW5kaW5nO1xuICB9XG5cbiAgLy8gYXV0by1iaW5kXG4gIGlmIChiZWZvcmVCaW5kaW5nKSB7IGJlZm9yZUJpbmRpbmcuY2FsbChhcHAudmlld19tb2RlbCwgYXBwLnZpZXdfbW9kZWwsIGFwcC5lbCwgb3B0aW9ucyk7IH1cbiAga2IuYXBwbHlCaW5kaW5ncyhhcHAudmlld19tb2RlbCwgYXBwLmVsLCBvcHRpb25zKTtcbiAgaWYgKGFmdGVyQmluZGluZykgeyBhZnRlckJpbmRpbmcuY2FsbChhcHAudmlld19tb2RlbCwgYXBwLnZpZXdfbW9kZWwsIGFwcC5lbCwgb3B0aW9ucyk7IH1cbn07XG5cbi8vIFNlYXJjaGVzIHRoZSBET00gZnJvbSByb290IG9yIGRvY3VtZW50IGZvciBlbGVtZW50cyB3aXRoIHRoZSBgJ2tiLWluamVjdCdgIGF0dHJpYnV0ZSBhbmQgY3JlYXRlL2N1c3RvbWl6ZXMgVmlld01vZGVscyBmb3IgdGhlIERPTSB0cmVlIHdoZW4gZW5jb3VudGVyZWQuXG4vLyBBbHNvLCB1c2VkIHdpdGggdGhlIGRhdGEtYmluZCBgJ2luamVjdCdgIGN1c3RvbSBiaW5kaW5nLlxuLy8gQHBhcmFtIFtET00gZWxlbWVudF0gcm9vdCB0aGUgcm9vdCBET00gZWxlbWVudCB0byBzdGFydCBzZWFyY2hpbmcgZm9yIGAna2ItaW5qZWN0J2AgYXR0cmlidXRlcy5cbi8vIEByZXR1cm4gW0FycmF5XSBhcnJheSBvZiBPYmplY3RzIHdpdGggdGhlIERPTSBlbGVtZW50cyBhbmQgVmlld01vZGVscyB0aGF0IHdlcmUgYm91bmQgaW4gdGhlIGZvcm0gYHtlbDogRE9NIGVsZW1lbnQsIHZpZXdfbW9kZWw6IFZpZXdNb2RlbH1gLlxuZXhwb3J0IGNvbnN0IGluamVjdFZpZXdNb2RlbHMgPSAoZWwgPSByb290LmRvY3VtZW50KSA9PiB7XG4gIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgaWYgKCFlbC5fX2tiX2luamVjdGVkKSB7IC8vIGFscmVhZHkgaW5qZWN0ZWQgLT4gc2tpcCwgYnV0IHN0aWxsIHByb2Nlc3MgY2hpbGRyZW4gaW4gY2FzZSB0aGV5IHdlcmUgYWRkZWQgYWZ0ZXJ3YXJkc1xuICAgIGNvbnN0IGF0dHIgPSBfLmZpbmQoZWwuYXR0cmlidXRlcyB8fCBbXSwgeCA9PiB4Lm5hbWUgPT09ICdrYi1pbmplY3QnKTtcbiAgICBpZiAoYXR0cikge1xuICAgICAgZWwuX19rYl9pbmplY3RlZCA9IHRydWU7IC8vIG1hcmsgaW5qZWN0ZWRcbiAgICAgIGNvbnN0IGFwcCA9IHsgZWwsIHZpZXdfbW9kZWw6IHt9LCBiaW5kaW5nOiBhdHRyLnZhbHVlIH07XG4gICAgICBkb0JpbmQoYXBwKTtcbiAgICAgIHJlc3VsdHMucHVzaChhcHApO1xuICAgIH1cbiAgfVxuICBfLmVhY2goZWwuY2hpbGROb2RlcywgKGNoaWxkKSA9PiB7XG4gICAgY29uc3QgY2hpbGRSZXN1bHRzID0gaW5qZWN0Vmlld01vZGVscyhjaGlsZCk7XG4gICAgaWYgKGNoaWxkUmVzdWx0cy5sZW5ndGgpIF8uZWFjaChjaGlsZFJlc3VsdHMsIHggPT4gcmVzdWx0cy5wdXNoKHgpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHRzO1xufTtcblxuLy8gYXV0by1pbmplY3QgcmVjdXJzaXZlbHlcbmNvbnN0IF9rb19hcHBseUJpbmRpbmdzID0ga28uYXBwbHlCaW5kaW5ncztcbmtvLmFwcGx5QmluZGluZ3MgPSAoLi4uYXJncykgPT4ge1xuICBjb25zdCBlbCA9IGFyZ3NbMV07XG4gIGNvbnN0IHJlc3VsdHMgPSBrYi5SRUNVU0lWRV9BVVRPX0lOSkVDVCA/IGluamVjdFZpZXdNb2RlbHMoZWwpIDogW107XG4gIHJldHVybiByZXN1bHRzLmxlbmd0aCA/IHJlc3VsdHMgOiBfa29fYXBwbHlCaW5kaW5ncy5jYWxsKHRoaXMsIC4uLmFyZ3MpO1xufTtcblxuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuLy8gQXV0byBJbmplY3QgcmVzdWx0c1xuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuaWYgKHJvb3QgJiYgKHR5cGVvZiByb290LmRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykpIHtcbiAgLy8gdXNlIHNpbXBsZSByZWFkeSBjaGVja1xuICBjb25zdCBvblJlYWR5ID0gKCkgPT4ge1xuICAgIC8vIGtlZXAgd2FpdGluZyBmb3IgdGhlIGRvY3VtZW50IHRvIGxvYWRcbiAgICBpZiAocm9vdC5kb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnY29tcGxldGUnKSByZXR1cm4gc2V0VGltZW91dChvblJlYWR5LCAwKTtcbiAgICByZXR1cm4gaW5qZWN0Vmlld01vZGVscygpOyAvLyB0aGUgZG9jdW1lbnQgaXMgbG9hZGVkXG4gIH07XG4gIG9uUmVhZHkoKTtcbn1cbiIsIi8qXG4gIGtub2NrYmFjay5qcyAyLjAuMC1hbHBoYS4xXG4gIENvcHlyaWdodCAoYykgIDIwMTEtMjAxNiBLZXZpbiBNYWxha29mZi5cbiAgTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiAgU291cmNlOiBodHRwczovL2dpdGh1Yi5jb20va21hbGFrb2ZmL2tub2NrYmFja1xuICBEZXBlbmRlbmNpZXM6IEtub2Nrb3V0LmpzLCBCYWNrYm9uZS5qcywgYW5kIFVuZGVyc2NvcmUuanMgKG9yIExvRGFzaC5qcykuXG4gIE9wdGlvbmFsIGRlcGVuZGVuY2llczogQmFja2JvbmUuTW9kZWxSZWYuanMgYW5kIEJhY2tib25lT1JNLlxuKi9cblxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgQmFja2JvbmUgZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IGtvIGZyb20gJ2tub2Nrb3V0JztcblxuY29uc3Qgcm9vdCA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgPyB3aW5kb3cgOiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpID8gZ2xvYmFsIDogdGhpcztcblxuY29uc3QgTElGRUNZQ0xFX01FVEhPRFMgPSBbJ3JlbGVhc2UnLCAnZGVzdHJveScsICdkaXNwb3NlJ107XG5cbmNvbnN0IF9pZ25vcmUgPSAoY2FsbGJhY2ssIGNhbGxiYWNrVGFyZ2V0LCBjYWxsYmFja0FyZ3MpID0+IHtcbiAgbGV0IHZhbHVlID0gbnVsbDtcbiAga28uY29tcHV0ZWQoKCkgPT4geyB2YWx1ZSA9IGNhbGxiYWNrLmFwcGx5KGNhbGxiYWNrVGFyZ2V0LCBjYWxsYmFja0FyZ3MgfHwgW10pOyB9KS5kaXNwb3NlKCk7XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbi8vIFRoZSAna2InIG5hbWVzcGFjZSBmb3IgY2xhc3NlcywgZmFjdG9yeSBmdW5jdGlvbnMsIGNvbnN0YW50cywgZXRjLlxuLy9cbi8vIEBtZXRob2QgLmNvbmZpZ3VyZShvcHRpb25zKVxuLy8gICBNZXRob2QgdG8gdXBkYXRlIEtub2NrYmFjayBnbG9iYWwgY29uZmlndXJhdGlvbi5cbi8vICAgQHBhcmFtIFtPYmplY3RdIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbi8vIDEpIG9ybSAtIHNlbGVjdCB0aGUgbGlicmFyeSBmb3IgcmVsYXRpb25zaGlwcyAoZGVmYXVsdCwgYmFja2JvbmUtb3JtLCBiYWNrYm9uZS1hc3NvY2lhdGlvbnMsIGJhY2tib25lLXJlbGF0aW9uYWwpXG4vLyAyKSBkZWVwX3JldGFpbiAtIHRydWUgdG8gbXVsdGlwbHkgcmV0YWluIHZpZXcgbW9kZWxzIGluIHRoZSBzdG9yZVxuLy9cbi8vIEBtZXRob2QgLmNvbGxlY3Rpb25PYnNlcnZhYmxlKGNvbGxlY3Rpb24sIG9wdGlvbnMpXG4vLyAgIEZhY3RvcnkgdG8gY3JlYXRlIGEgbmV3IGtiLkNvbGxlY3Rpb25PYnNlcnZhYmxlLiBTZWUge2tiLkNvbGxlY3Rpb25PYnNlcnZhYmxlI2NvbnN0cnVjdG9yfSBmb3IgaW5mb3JtYXRpb24gb24gb3B0aW9uc1xuLy8gICBAcGFyYW0gW0NvbGxlY3Rpb25dIGNvbGxlY3Rpb24gdGhlIGNvbGxlY3Rpb24gdG8gb2JzZXJ2ZSAoY2FuIGJlIG51bGwpXG4vLyAgIEBwYXJhbSBbT2JqZWN0XSBvcHRpb25zIHRoZSBjcmVhdGUgb3B0aW9uc1xuLy8gICBAcmV0dXJuIFtrby5vYnNlcnZhYmxlQXJyYXldIHRoZSBjb25zdHJ1Y3RvciBkb2VzIG5vdCByZXR1cm4gJ3RoaXMnIGJ1dCBhIGtvLm9ic2VydmFibGVBcnJheVxuLy9cbi8vIEBtZXRob2QgLm9ic2VydmFibGUobW9kZWwsIG9wdGlvbnMsIHZpZXdfbW9kZWwpXG4vLyAgIEZhY3RvcnkgdG8gY3JlYXRlIGEgbmV3IGtiLk9ic2VydmFibGUuIFNlZSB7a2IuT2JzZXJ2YWJsZSNjb25zdHJ1Y3Rvcn0gZm9yIGluZm9ybWF0aW9uIG9uIG9wdGlvbnNcbi8vICAgQHBhcmFtIFtNb2RlbF0gbW9kZWwgdGhlIG1vZGVsIHRvIG9ic2VydmUgKGNhbiBiZSBudWxsKVxuLy8gICBAcGFyYW0gW1N0cmluZ3xBcnJheXxPYmplY3RdIG9wdGlvbnMgdGhlIGNyZWF0ZSBvcHRpb25zLiBTdHJpbmcgaXMgYSBzaW5nbGUgYXR0cmlidXRlIG5hbWUsIEFycmF5IGlzIGFuIGFycmF5IG9mIGF0dHJpYnV0ZSBuYW1lcy5cbi8vICAgQHJldHVybiBba28ub2JzZXJ2YWJsZV0gdGhlIGNvbnN0cnVjdG9yIGRvZXMgbm90IHJldHVybiAndGhpcycgYnV0IGEga28ub2JzZXJ2YWJsZVxuLy9cbi8vIEBtZXRob2QgLnZpZXdNb2RlbChtb2RlbCwgb3B0aW9ucywgdmlld19tb2RlbClcbi8vICAgRmFjdG9yeSB0byBjcmVhdGUgYSBuZXcga2IuVmlld01vZGVsLiBTZWUge2tiLlZpZXdNb2RlbCNjb25zdHJ1Y3Rvcn0gZm9yIGluZm9ybWF0aW9uIG9uIG9wdGlvbnNcbi8vICAgQHBhcmFtIFtNb2RlbHxNb2RlbFJlZl0gbW9kZWwgdGhlIG1vZGVsIHRvIG9ic2VydmUgKGNhbiBiZSBudWxsKVxuLy8gICBAcGFyYW0gW09iamVjdF0gb3B0aW9ucyB0aGUgY3JlYXRlIG9wdGlvbnNcbi8vICAgQHJldHVybiBba28ub2JzZXJ2YWJsZV0gdGhlIGNvbnN0cnVjdG9yIHJldHVybnMgJ3RoaXMnXG4vL1xuLy8gQG1ldGhvZCAuZGVmYXVsdE9ic2VydmFibGUodGFyZ2V0LCBkZWZhdWx0X3ZhbHVlKVxuLy8gICBGYWN0b3J5IHRvIGNyZWF0ZSBhIG5ldyBrYi5EZWZhdWx0T2JzZXJ2YWJsZS4gU2VlIHtrYi5EZWZhdWx0T2JzZXJ2YWJsZSNjb25zdHJ1Y3Rvcn0gZm9yIGluZm9ybWF0aW9uIG9uIG9wdGlvbnMuXG4vLyAgIElmIHlvdSBhcmUgdXNpbmcga25vY2tiYWNrLWNvcmUgb3Iga25vY2tiYWNrLWNvcmUtc3RhY2ssIHlvdSBjYW4gaW5jbHVkZSB0aGlzIGZyb20gdGhlIGxpYi9rbm9ja2JhY2stZGVmYXVsdHMgY29tcG9uZW50LlxuLy8gICBAcGFyYW0gW2tvLm9ic2VydmFibGVdIHRhcmdldF9vYnNlcnZhYmxlIHRoZSBvYnNlcnZhYmxlIHRvIGNoZWNrIGZvciBudWxsLCB1bmRlZmluZWQsIG9yIHRoZSBlbXB0eSBzdHJpbmdcbi8vICAgQHBhcmFtIFtBbnldIGRlZmF1bHRfdmFsdWUgdGhlIGRlZmF1bHQgdmFsdWUuIENhbiBiZSBhIHZhbHVlLCBzdHJpbmcgb3Iga28ub2JzZXJ2YWJsZVxuLy8gICBAcmV0dXJuIFtrby5vYnNlcnZhYmxlXSB0aGUgY29uc3RydWN0b3IgZG9lcyBub3QgcmV0dXJuICd0aGlzJyBidXQgYSBrby5vYnNlcnZhYmxlXG4vL1xuLy8gQG1ldGhvZCAuZm9ybWF0dGVkT2JzZXJ2YWJsZShmb3JtYXQsIGFyZzEsIGFyZzIsIGV0Yylcbi8vICAgRmFjdG9yeSB0byBjcmVhdGUgYSBuZXcga2IuRm9ybWF0dGVkT2JzZXJ2YWJsZS4gU2VlIHtrYi5Gb3JtYXR0ZWRPYnNlcnZhYmxlI2NvbnN0cnVjdG9yfSBmb3IgaW5mb3JtYXRpb24gb24gb3B0aW9ucy5cbi8vICAgSWYgeW91IGFyZSB1c2luZyBrbm9ja2JhY2stY29yZSBvciBrbm9ja2JhY2stY29yZS1zdGFjaywgeW91IGNhbiBpbmNsdWRlIHRoaXMgZnJvbSB0aGUgbGliL2tub2NrYmFjay1mb3JtYXR0aW5nIGNvbXBvbmVudC5cbi8vICAgQHBhcmFtIFtTdHJpbmd8a28ub2JzZXJ2YWJsZV0gZm9ybWF0IHRoZSBmb3JtYXQgc3RyaW5nLlxuLy8gICBGb3JtYXQ6IGBcInswfSBhbmQgezF9XCJgIHdoZXJlIGB7MH1gIGFuZCBgezF9YCB3b3VsZCBiZSBzeW5jaHJvbml6ZWQgd2l0aCB0aGUgYXJndW1lbnRzIChlZy4gXCJCb2IgYW5kIENhcm9sXCIgd2hlcmUgYHswfWAgaXMgQm9iIGFuZCBgezF9YCBpcyBDYXJvbClcbi8vICAgQHBhcmFtIFtBcnJheV0gYXJncyBhcmd1bWVudHMgdG8gYmUgcGFzc2VkIHRvIHRoZSBrYi5Mb2NhbGVNYW5hZ2VyJ3MgZ2V0KCkgbWV0aG9kXG4vLyAgIEByZXR1cm4gW2tvLm9ic2VydmFibGVdIHRoZSBjb25zdHJ1Y3RvciBkb2VzIG5vdCByZXR1cm4gJ3RoaXMnIGJ1dCBhIGtvLm9ic2VydmFibGVcbi8vXG4vLyBAbWV0aG9kIC5sb2NhbGl6ZWRPYnNlcnZhYmxlKHZhbHVlLCBvcHRpb25zLCB2aWV3X21vZGVsKVxuLy8gICBGYWN0b3J5IHRvIGNyZWF0ZSBhIG5ldyBrYi5Mb2NhbGl6ZWRPYnNlcnZhYmxlLiBTZWUge2tiLkxvY2FsaXplZE9ic2VydmFibGUjY29uc3RydWN0b3J9IGZvciBpbmZvcm1hdGlvbiBvbiBvcHRpb25zLlxuLy8gICBJZiB5b3UgYXJlIHVzaW5nIGtub2NrYmFjay1jb3JlIG9yIGtub2NrYmFjay1jb3JlLXN0YWNrLCB5b3UgY2FuIGluY2x1ZGUgdGhpcyBmcm9tIHRoZSBsaWIva25vY2tiYWNrLWxvY2FsaXphdGlvbiBjb21wb25lbnQuXG4vLyAgIEBwYXJhbSBbRGF0YXxrby5vYnNlcnZhYmxlXSB2YWx1ZSB0aGUgdmFsdWUgdG8gbG9jYWxpemVcbi8vICAgQHBhcmFtIFtPYmplY3RdIG9wdGlvbnMgdGhlIGNyZWF0ZSBvcHRpb25zXG4vLyAgIEByZXR1cm4gW2tvLm9ic2VydmFibGVdIHRoZSBjb25zdHJ1Y3RvciBkb2VzIG5vdCByZXR1cm4gJ3RoaXMnIGJ1dCBhIGtvLm9ic2VydmFibGVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGtiIHtcbiAgLy8gS25vY2tiYWNrIGxpYnJhcnkgc2VtYW50aWMgdmVyc2lvblxuICBzdGF0aWMgVkVSU0lPTiA9ICcyLjAuMC1hbHBoYS4xJztcblxuICAvLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAvLyBPQlNFUlZBQkxFIFNUT1JBR0UgVFlQRVNcbiAgLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAvLyBTdG9yZWQgdmFsdWUgdHlwZSBpcyBub3Qga25vd24gbGlrZSBudWxsL3VuZGVmaW5lZCAoY291bGQgYmUgb2JzZXJ2ZWQgYXMgYSBNb2RlbCBvciBhIENvbGxlY3Rpb24gb3IgYSBzaW1wbGUgdHlwZSlcbiAgc3RhdGljIFRZUEVfVU5LTk9XTiA9IDA7XG4gIC8vIFN0b3JlZCB2YWx1ZSB0eXBlIGlzIHNpbXBsZSBsaWtlIGEgU3RyaW5nIG9yIE51bWJlciAtPiBvYnNlcnZhYmxlIHR5cGU6IGtvLm9ic2VydmFibGVcbiAgc3RhdGljIFRZUEVfU0lNUExFID0gMTtcbiAgLy8gU3RvcmVkIHZhbHVlIHR5cGUgaXMgYW4gQXJyYXkgLT4gb2JzZXJ2YWJsZSB0eXBlOiBrby5vYnNlcnZhYmxlQXJyYXlcbiAgc3RhdGljIFRZUEVfQVJSQVkgPSAyO1xuICAvLyBTdG9yZWQgdmFsdWUgdHlwZSBpcyBhIE1vZGVsIC0+IG9ic2VydmFibGUgdHlwZTogVmlld01vZGVsXG4gIHN0YXRpYyBUWVBFX01PREVMID0gMztcbiAgLy8gU3RvcmVkIHZhbHVlIHR5cGUgaXMgYSBDb2xsZWN0aW9uIC0+IG9ic2VydmFibGUgdHlwZToga2IuQ29sbGVjdGlvbk9ic2VydmFibGVcbiAgc3RhdGljIFRZUEVfQ09MTEVDVElPTiA9IDQ7XG5cbiAgLy8gY2FjaGUgbG9jYWwgcmVmZXJlbmNlIHRvIHVuZGVyc2NvcmVcbiAgc3RhdGljIGFzc2lnbiA9IF8uYXNzaWduIHx8IF8uZXh0ZW5kO1xuXG4gIC8vIGNhY2hlIGxvY2FsIHJlZmVyZW5jZSB0byBLbm9ja291dFxuICBzdGF0aWMgaWdub3JlID0ga28uZGVwZW5kZW5jeURldGVjdGlvbiAmJiBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZSA/IGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlIDogX2lnbm9yZTtcblxuICAvLyBDaGVja3MgaWYgYW4gb2JqZWN0IGhhcyBiZWVuIHJlbGVhc2VkLlxuICAvLyBAcGFyYW0gW0FueV0gb2JqIHRoZSBvYmplY3QgdG8gcmVsZWFzZSBhbmQgYWxzbyByZWxlYXNlIGl0cyBrZXlzXG4gIHN0YXRpYyB3YXNSZWxlYXNlZChvYmopIHsgcmV0dXJuICFvYmogfHwgb2JqLl9fa2JfcmVsZWFzZWQ7IH1cblxuICAvLyBDaGVja3MgaWYgYW4gb2JqZWN0IGNhbiBiZSByZWxlYXNlZC4gVXNlZCB0byBwZXJmb3JtIG1pbmltYWwgbmVzdGVkIHJlbGVhc2luZyBvbiBvYmplY3RzIGJ5IGNoZWNraW5nIGlmIHNlbGYgb3IgbmV4dCBsZXZlbCBjb250YWluZWQgaXRlbXMgY2FuIGJlIHJlbGVhc2VkLlxuICAvLyBAcGFyYW0gW0FueV0gb2JqIHRoZSBvYmplY3QgdG8gcmVsZWFzZSBhbmQgYWxzbyByZWxlYXNlIGl0cyBrZXlzXG4gIHN0YXRpYyBpc1JlbGVhc2VhYmxlKG9iaiwgZGVwdGgpIHtcbiAgICBpZiAoZGVwdGggPT0gbnVsbCkgeyBkZXB0aCA9IDA7IH1cbiAgICBpZiAoKCFvYmogfHwgKG9iaiAhPT0gT2JqZWN0KG9iaikpKSB8fCBvYmouX19rYl9yZWxlYXNlZCkgcmV0dXJuIGZhbHNlOyAvLyBtdXN0IGJlIGFuIG9iamVjdCBhbmQgbm90IGFscmVhZHkgcmVsZWFzZWRcbiAgICBpZiAoa28uaXNPYnNlcnZhYmxlKG9iaikgfHwgKG9iaiBpbnN0YW5jZW9mIGtiLlZpZXdNb2RlbCkpIHJldHVybiB0cnVlOyAvLyBhIGtub3duIHR5cGUgdGhhdCBpcyByZWxlYXNhYmxlXG4gICAgaWYgKCh0eXBlb2YgKG9iaikgPT09ICdmdW5jdGlvbicpIHx8IGtiLmlzTW9kZWwob2JqKSB8fCBrYi5pc0NvbGxlY3Rpb24ob2JqKSkgcmV0dXJuIGZhbHNlOyAvLyBhIGtub3duIHR5cGUgdGhhdCBpcyBub3QgcmVsZWFzZWFibGVcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IExJRkVDWUNMRV9NRVRIT0RTLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgbWV0aG9kID0gTElGRUNZQ0xFX01FVEhPRFNbaV07XG4gICAgICBpZiAodHlwZW9mIChvYmpbbWV0aG9kXSkgPT09ICdmdW5jdGlvbicpIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkZXB0aCA+IDApIHJldHVybiBmYWxzZTsgLy8gbWF4IGRlcHRoIGNoZWNrIGZvciBWaWV3TW9kZWwgaW5zaWRlIG9mIFZpZXdNb2RlbFxuICAgIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBvYmpba2V5XTtcbiAgICAgICAgaWYgKChrZXkgIT09ICdfX2tiJykgJiYga2IuaXNSZWxlYXNlYWJsZSh2YWx1ZSwgZGVwdGggKyAxKSkgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFJlbGVhc2VzIGFueSB0eXBlIG9mIHZpZXcgbW9kZWwgb3Igb2JzZXJ2YWJsZSBvciBpdGVtcyBpbiBhbiBhcnJheSB1c2luZyB0aGUgY29udmVudGlvbnMgb2YgcmVsZWFzZSgpLCBkZXN0cm95KCksIGRpc3Bvc2UoKS5cbiAgLy8gQHBhcmFtIFtBbnldIG9iaiB0aGUgb2JqZWN0IHRvIHJlbGVhc2UgYW5kIGFsc28gcmVsZWFzZSBpdHMga2V5c1xuICAvL1xuICAvLyBAZXhhbXBsZVxuICAvLyAgIHZhciB2aWV3X21vZGVsID0ga2Iudmlld01vZGVsKG1vZGVsKTtcbiAgLy8gICBrYi5yZWxlYXNlKHZpZXdfbW9kZWwpOyB2aWV3X21vZGVsID0gbnVsbDtcbiAgLy8gQGV4YW1wbGVcbiAgLy8gICB2YXIgdG9kb3MgPSBrYi5jb2xsZWN0aW9uT2JzZXJ2YWJsZShjb2xsZWN0aW9uKTtcbiAgLy8gICBrYi5yZWxlYXNlKHRvZG9zKTsgdG9kb3MgPSBudWxsO1xuICBzdGF0aWMgcmVsZWFzZShvYmopIHtcbiAgICBpZiAoIWtiLmlzUmVsZWFzZWFibGUob2JqKSkgcmV0dXJuO1xuICAgIG9iai5fX2tiX3JlbGVhc2VkID0gdHJ1ZTsgLy8gbWFyayBhcyByZWxlYXNlZFxuXG4gICAgLy8gcmVsZWFzZSBhcnJheSdzIGl0ZW1zXG4gICAgaWYgKF8uaXNBcnJheShvYmopKSB7XG4gICAgICBfLmVhY2gob2JqLCAodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmIChrYi5pc1JlbGVhc2VhYmxlKHZhbHVlKSkgeyBvYmpbaW5kZXhdID0gbnVsbDsga2IucmVsZWFzZSh2YWx1ZSk7IH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIG9ic2VydmFibGUgb3IgbGlmZWN5Y2xlIG1hbmFnZWRcbiAgICBjb25zdCBhcnJheSA9IGtiLnBlZWsob2JqKTtcbiAgICBpZiAoa28uaXNPYnNlcnZhYmxlKG9iaikgJiYgXy5pc0FycmF5KGFycmF5KSkge1xuICAgICAgaWYgKG9iai5fX2tiX2lzX2NvIHx8IChvYmouX19rYl9pc19vICYmIChvYmoudmFsdWVUeXBlKCkgPT09IGtiLlRZUEVfQ09MTEVDVElPTikpKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqLmRlc3Ryb3kgPT09ICdmdW5jdGlvbicpIG9iai5kZXN0cm95KCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIF8uZWFjaChhcnJheSwgKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAoa2IuaXNSZWxlYXNlYWJsZSh2YWx1ZSkpIHsgYXJyYXlbaW5kZXhdID0gbnVsbDsga2IucmVsZWFzZSh2YWx1ZSk7IH1cbiAgICAgIH0pO1xuICAgICAgaWYgKHR5cGVvZiAob2JqLmRpc3Bvc2UpID09PSAnZnVuY3Rpb24nKSB7IG9iai5kaXNwb3NlKCk7IH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyByZWxlYXNlYWJsZSBzaWduYXR1cmVcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IExJRkVDWUNMRV9NRVRIT0RTLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgbWV0aG9kID0gTElGRUNZQ0xFX01FVEhPRFNbaV07XG4gICAgICBpZiAodHlwZW9mIChvYmpbbWV0aG9kXSkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb2JqW21ldGhvZF0uY2FsbChvYmopO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFrby5pc09ic2VydmFibGUob2JqKSkgdGhpcy5yZWxlYXNlS2V5cyhvYmopOyAvLyB2aWV3IG1vZGVsXG4gIH1cblxuICAvLyBSZWxlYXNlcyBhbmQgY2xlYXJzIGFsbCBvZiB0aGUga2V5cyBvbiBhbiBvYmplY3QgdXNpbmcgdGhlIGNvbnZlbnRpb25zIG9mIHJlbGVhc2UoKSwgZGVzdHJveSgpLCBkaXNwb3NlKCkgd2l0aG91dCByZWxlYXNpbmcgdGhlIHRvcCBsZXZlbCBvYmplY3QgaXRzZWxmLlxuICBzdGF0aWMgcmVsZWFzZUtleXMob2JqKSB7XG4gICAgXy5lYWNoKG9iaiwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIGlmICgoa2V5ICE9PSAnX19rYicpICYmIGtiLmlzUmVsZWFzZWFibGUodmFsdWUpKSB7XG4gICAgICAgIG9ialtrZXldID0gbnVsbDtcbiAgICAgICAga2IucmVsZWFzZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBCaW5kcyBhIGNhbGxiYWNrIHRvIHRoZSBub2RlIHRoYXQgcmVsZWFzZXMgdGhlIHZpZXcgbW9kZWwgd2hlbiB0aGUgbm9kZSBpcyByZW1vdmVkIHVzaW5nIGtvLnJlbW92ZU5vZGUuXG4gIC8vIGBgYFxuICAvLyBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKG5vZGUsIGZ1bmN0aW9uKCkgeyBrYi5yZWxlYXNlKHZpZXdfbW9kZWwpfSApO1xuICAvLyBgYGBcbiAgLy8gQGV4YW1wbGUgVGhlIGhhcmQgd2F5IHRvIHNldCB1cCBhdXRvbWF0aWMgY2FsbGluZyBvZiAna2IucmVsZWFzZSh2aWV3X21vZGVsKScgd2hlbiB0aGUgYm91bmQgZWxlbWVudCBpcyByZWxlYXNlZC5cbiAgLy8gICB2YXIgZWwgPSAkKCc8ZGl2IGRhdGEtYmluZD1cIm5hbWU6IG5hbWVcIj48L2Rpdj4nKVswXTtcbiAgLy8gICB2YXIgdmlld19tb2RlbCA9IGtiLnZpZXdNb2RlbChuZXcgQmFja2JvbmUuTW9kZWwoe25hbWU6ICdCb2InfSkpO1xuICAvLyAgIGtvLmFwcGx5QmluZGluZ3Modmlld19tb2RlbCwgZWwpO1xuICAvLyAgIGtiLnJlbGVhc2VPbk5vZGVSZW1vdmUodmlld19tb2RlbCwgZWwpO1xuICAvLyAgIC4uLlxuICAvLyAgIGtvLnJlbW92ZU5vZGUoZWwpOyAvLyByZW1vdmVzIGVsIGZyb20gdGhlIERPTSBhbmQgY2FsbHMga2IucmVsZWFzZSh2aWV3X21vZGVsKVxuICBzdGF0aWMgcmVsZWFzZU9uTm9kZVJlbW92ZSh2aWV3X21vZGVsLCBub2RlKSB7XG4gICAgdmlld19tb2RlbCB8fCBrYi5fdGhyb3dVbmV4cGVjdGVkKHRoaXMsICdtaXNzaW5nIHZpZXcgbW9kZWwnKTtcbiAgICBub2RlIHx8IGtiLl90aHJvd1VuZXhwZWN0ZWQodGhpcywgJ21pc3Npbmcgbm9kZScpO1xuICAgIHJldHVybiBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKG5vZGUsICgpID0+IGtiLnJlbGVhc2Uodmlld19tb2RlbCkpO1xuICB9XG5cbiAgLy8gUmVuZGVycyBhIHRlbXBsYXRlIGFuZCBiaW5kcyBhIGNhbGxiYWNrIHRvIHRoZSBub2RlIHRoYXQgcmVsZWFzZXMgdGhlIHZpZXcgbW9kZWwgd2hlbiB0aGUgbm9kZSBpcyByZW1vdmVkIHVzaW5nIGtvLnJlbW92ZU5vZGUuXG4gIC8vXG4gIC8vIE5PVEU6IGlmIHlvdSBwcm92aWRlIGFuIGFmdGVyUmVuZGVyIG1ldGhvZCBvbiB0aGUgVmlldyBNb2RlbCBhbmQgZG8gbm90IHByb3ZpZGUgYWZ0ZXJSZW5kZXIgaW4gdGhlIG9wdGlvbnMsXG4gIC8vIGFmdGVyUmVuZGVyIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBzaWduYXR1cmU6IGFmdGVyUmVuZGVyKGVsZW1lbnQpIHdoaWNoIGRpZmZlcnMgZnJvbSB0aGUgS25vY2tvdXQgc2lnbnR1cmUgb2YgYWZ0ZXJSZW5kZXIoZWxlbWVudHMpXG4gIC8vXG4gIC8vIEBleGFtcGxlIFRoZSBlYXN5IHdheSB0byBzZXQgdXAgYXV0b21hdGljIGNhbGxpbmcgb2YgJ2tiLnJlbGVhc2Uodmlld19tb2RlbCknIHdoZW4gdGhlIGJvdW5kIGVsZW1lbnQgaXMgcmVsZWFzZWQuXG4gIC8vICAgdmFyIGVsID0ga2IucmVuZGVyVGVtcGxhdGUoJ215X3RlbXBsYXRlJywga2Iudmlld01vZGVsKG5ldyBCYWNrYm9uZS5Nb2RlbCh7bmFtZTogJ0JvYid9KSkpO1xuICAvLyAgIC4uLlxuICAvLyAgIGtvLnJlbW92ZU5vZGUoZWwpOyAvLyByZW1vdmVzIGVsIGZyb20gdGhlIERPTSBhbmQgY2FsbHMga2IucmVsZWFzZSh2aWV3X21vZGVsKVxuICBzdGF0aWMgcmVuZGVyVGVtcGxhdGUodGVtcGxhdGUsIHZpZXdfbW9kZWwsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmICghcm9vdC5kb2N1bWVudCkge1xuICAgICAgKHR5cGVvZiBjb25zb2xlID09PSAndW5kZWZpbmVkJykgfHwgY29uc29sZS5sb2coJ3JlbmRlclRlbXBsYXRlOiBkb2N1bWVudCBpcyB1bmRlZmluZWQnKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgbGV0IGVsID0gcm9vdC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBvYnNlcnZhYmxlID0ga28ucmVuZGVyVGVtcGxhdGUodGVtcGxhdGUsIHZpZXdfbW9kZWwsIG9wdGlvbnMsIGVsLCAncmVwbGFjZUNoaWxkcmVuJyk7XG5cbiAgICAvLyBkbyBub3QgcmV0dXJuIHRoZSB0ZW1wbGF0ZSB3cmFwcGVyIGlmIHBvc3NpYmxlXG4gICAgaWYgKGVsLmNoaWxkTm9kZXMubGVuZ3RoID09PSAxKSBlbCA9IGVsLmNoaWxkTm9kZXNbMF07XG4gICAgZWxzZSBpZiAoZWwuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBlbmQgPSBlbC5jaGlsZE5vZGVzLmxlbmd0aCwgYXNjID0gZW5kID49IDA7IGFzYyA/IGkgPD0gZW5kIDogaSA+PSBlbmQ7IGFzYyA/IGkrKyA6IGktLSkgeyAvLyBlbnN1cmUgdGhlIGNvbnRleHQgaXMgcGFzc2VkIHVwIHRvIHdyYXBwZXIgZnJvbSBhIGNoaWxkXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAga28uc3RvcmVkQmluZGluZ0NvbnRleHRGb3JOb2RlKGVsLCBrby5jb250ZXh0Rm9yKGVsLmNoaWxkTm9kZXNbaV0pKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7IC8qKi8gfVxuICAgICAgfVxuICAgIH1cbiAgICBrYi5yZWxlYXNlT25Ob2RlUmVtb3ZlKHZpZXdfbW9kZWwsIGVsKTtcbiAgICBvYnNlcnZhYmxlLmRpc3Bvc2UoKTsgLy8gd2Ugd2lsbCBoYW5kbGUgbWVtb3J5IG1hbmFnZW1lbnQgd2l0aCBrby5yZW1vdmVOb2RlIChvdGhlcndpc2UgY3JlYXRlcyBtZW1vcnkgbGVhayBvbiBkZWZhdWx0IGJvdW5kIGRpc3Bvc2UgZnVuY3Rpb24pXG5cbiAgICBpZiAodmlld19tb2RlbC5hZnRlclJlbmRlciAmJiAhb3B0aW9ucy5hZnRlclJlbmRlcikgdmlld19tb2RlbC5hZnRlclJlbmRlcihlbCk7IC8vIGNhbGwgYWZ0ZXJSZW5kZXIgZm9yIGN1c3RvbSBzZXR1cCB1bmxlc3MgcHJvdmlkZWQgaW4gb3B0aW9ucyAoc28gZG9lc24ndCBnZXQgZG91YmxlIGNhbGxlZClcbiAgICByZXR1cm4gZWw7XG4gIH1cblxuICAvLyBBcHBsaWVzIGJpbmRpbmdzIGFuZCBiaW5kcyBhIGNhbGxiYWNrIHRvIHRoZSBub2RlIHRoYXQgcmVsZWFzZXMgdGhlIHZpZXcgbW9kZWwgd2hlbiB0aGUgbm9kZSBpcyByZW1vdmVkIHVzaW5nIGtvLnJlbW92ZU5vZGUuXG4gIC8vXG4gIC8vIEBleGFtcGxlIFRoZSBlYXN5IHdheSB0byBzZXQgdXAgYXV0b21hdGljIGNhbGxpbmcgb2YgJ2tiLnJlbGVhc2Uodmlld19tb2RlbCknIHdoZW4gdGhlIGJvdW5kIGVsZW1lbnQgaXMgcmVsZWFzZWQuXG4gIC8vICAgdmFyIGVsID0gJCgnPGRpdiBkYXRhLWJpbmQ9XCJuYW1lOiBuYW1lXCI+PC9kaXY+JylbMF07XG4gIC8vICAga2IuYXBwbHlCaW5kaW5ncyhrYi52aWV3TW9kZWwobmV3IEJhY2tib25lLk1vZGVsKHtuYW1lOiAnQm9iJ30pKSwgZWwpO1xuICAvLyAgIC4uLlxuICAvLyAgIGtvLnJlbW92ZU5vZGUoZWwpOyAvLyByZW1vdmVzIGVsIGZyb20gdGhlIERPTSBhbmQgY2FsbHMga2IucmVsZWFzZSh2aWV3X21vZGVsKVxuICBzdGF0aWMgYXBwbHlCaW5kaW5ncyh2aWV3X21vZGVsLCBub2RlKSB7XG4gICAgaWYgKCFyb290LmRvY3VtZW50KSB7XG4gICAgICAodHlwZW9mIGNvbnNvbGUgPT09ICd1bmRlZmluZWQnKSB8fCBjb25zb2xlLmxvZygncmVuZGVyVGVtcGxhdGU6IGRvY3VtZW50IGlzIHVuZGVmaW5lZCcpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5sZW5ndGgpIHsgLy8gY29udmVydCB0byBhIHJvb3QgZWxlbWVudFxuICAgICAgY29uc3QgY2hpbGRyZW4gPSBub2RlO1xuICAgICAgbm9kZSA9IHJvb3QuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBfLmVhY2goY2hpbGRyZW4sIGNoaWxkID0+IG5vZGUuYXBwZW5kQ2hpbGQoY2hpbGQpKTtcbiAgICB9XG4gICAga28uYXBwbHlCaW5kaW5ncyh2aWV3X21vZGVsLCBub2RlKTtcbiAgICBrYi5yZWxlYXNlT25Ob2RlUmVtb3ZlKHZpZXdfbW9kZWwsIG5vZGUpO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgc3RhdGljIGdldFZhbHVlKG1vZGVsLCBrZXksIGFyZ3MpIHtcbiAgICBpZiAoIW1vZGVsKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGlmICghYXJncykgcmV0dXJuIG1vZGVsLmdldChrZXkpO1xuICAgIHJldHVybiBtb2RlbC5nZXQoLi4uXy5tYXAoW2tleV0uY29uY2F0KGFyZ3MpLCB2YWx1ZSA9PiBrYi5wZWVrKHZhbHVlKSkpO1xuICB9XG5cbiAgc3RhdGljIHNldFZhbHVlKG1vZGVsLCBrZXksIHZhbHVlKSB7XG4gICAgbGV0IGF0dHJpYnV0ZXM7XG4gICAgaWYgKCFtb2RlbCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAoYXR0cmlidXRlcyA9IHt9KVtrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIG1vZGVsLnNldChhdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIC8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIC8vIElOVEVSTkFMIEhFTFBFUlNcbiAgLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgLy8gQG5vZG9jXG4gIHN0YXRpYyBfdGhyb3dNaXNzaW5nKGluc3RhbmNlLCBtZXNzYWdlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke18uaXNTdHJpbmcoaW5zdGFuY2UpID8gaW5zdGFuY2UgOiBpbnN0YW5jZS5jb25zdHJ1Y3Rvci5uYW1lfTogJHttZXNzYWdlfSBpcyBtaXNzaW5nYCk7XG4gIH1cblxuICAvLyBAbm9kb2NcbiAgc3RhdGljIF90aHJvd1VuZXhwZWN0ZWQoaW5zdGFuY2UsIG1lc3NhZ2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7Xy5pc1N0cmluZyhpbnN0YW5jZSkgPyBpbnN0YW5jZSA6IGluc3RhbmNlLmNvbnN0cnVjdG9yLm5hbWV9OiAke21lc3NhZ2V9IGlzIHVuZXhwZWN0ZWRgKTtcbiAgfVxuXG4gIC8vIEBub2RvY1xuICBzdGF0aWMgcHVibGlzaE1ldGhvZHMob2JzZXJ2YWJsZSwgaW5zdGFuY2UsIG1ldGhvZHMpIHtcbiAgICBfLmVhY2gobWV0aG9kcywgKGZuKSA9PiB7IG9ic2VydmFibGVbZm5dID0ga2IuXy5iaW5kKGluc3RhbmNlW2ZuXSwgaW5zdGFuY2UpOyB9KTtcbiAgfVxuXG4gIC8vIEBub2RvY1xuICBzdGF0aWMgcGVlayhvYnMpIHtcbiAgICBpZiAoIWtvLmlzT2JzZXJ2YWJsZShvYnMpKSByZXR1cm4gb2JzO1xuICAgIGlmIChvYnMucGVlaykgcmV0dXJuIG9icy5wZWVrKCk7XG4gICAgcmV0dXJuIGtiLmlnbm9yZSgoKSA9PiBvYnMoKSk7XG4gIH1cblxuICAvLyBAbm9kb2NcbiAgc3RhdGljIGlzTW9kZWwob2JqKSB7IHJldHVybiBvYmogJiYgKChvYmogaW5zdGFuY2VvZiBCYWNrYm9uZS5Nb2RlbCkgfHwgKCh0eXBlb2YgKG9iai5nZXQpID09PSAnZnVuY3Rpb24nKSAmJiAodHlwZW9mIChvYmouYmluZCkgPT09ICdmdW5jdGlvbicpKSk7IH1cblxuICAvLyBAbm9kb2NcbiAgc3RhdGljIGlzQ29sbGVjdGlvbihvYmopIHsgcmV0dXJuIG9iaiAmJiAob2JqIGluc3RhbmNlb2YgQmFja2JvbmUuQ29sbGVjdGlvbik7IH1cbn1cbiIsIi8qXG4gIGtub2NrYmFjay5qcyAyLjAuMC1hbHBoYS4xXG4gIENvcHlyaWdodCAoYykgIDIwMTEtMjAxNiBLZXZpbiBNYWxha29mZi5cbiAgTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiAgU291cmNlOiBodHRwczovL2dpdGh1Yi5jb20va21hbGFrb2ZmL2tub2NrYmFja1xuICBEZXBlbmRlbmNpZXM6IEtub2Nrb3V0LmpzLCBCYWNrYm9uZS5qcywgYW5kIFVuZGVyc2NvcmUuanMgKG9yIExvRGFzaC5qcykuXG4gIE9wdGlvbmFsIGRlcGVuZGVuY2llczogQmFja2JvbmUuTW9kZWxSZWYuanMgYW5kIEJhY2tib25lT1JNLlxuKi9cblxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQga28gZnJvbSAna25vY2tvdXQnO1xuXG5pbXBvcnQga2IgZnJvbSAnLi4va2InO1xuXG4vLyBAbm9kb2NcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFR5cGVkVmFsdWUge1xuICBjb25zdHJ1Y3RvcihjcmVhdGVfb3B0aW9ucykge1xuICAgIHRoaXMuY3JlYXRlX29wdGlvbnMgPSBjcmVhdGVfb3B0aW9ucztcbiAgICB0aGlzLl92byA9IGtvLm9ic2VydmFibGUobnVsbCk7IC8vIGNyZWF0ZSBhIHZhbHVlIG9ic2VydmFibGUgZm9yIHRoZSBmaXJzdCBkZXBlbmRlbmN5XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuX19rYl9yZWxlYXNlZCA9IHRydWU7XG4gICAgY29uc3QgcHJldmlvdXNfdmFsdWUgPSB0aGlzLl9fa2JfdmFsdWU7XG4gICAgaWYgKHByZXZpb3VzX3ZhbHVlKSB7XG4gICAgICB0aGlzLl9fa2JfdmFsdWUgPSBudWxsO1xuICAgICAgaWYgKHRoaXMuY3JlYXRlX29wdGlvbnMuc3RvcmUgJiYga2IudXRpbHMud3JhcHBlZENyZWF0b3IocHJldmlvdXNfdmFsdWUpKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlX29wdGlvbnMuc3RvcmUucmVsZWFzZShwcmV2aW91c192YWx1ZSk7XG4gICAgICB9IGVsc2Uga2IucmVsZWFzZShwcmV2aW91c192YWx1ZSk7XG4gICAgfVxuICAgIHRoaXMuY3JlYXRlX29wdGlvbnMgPSBudWxsO1xuICB9XG5cbiAgdmFsdWUoKSB7IHJldHVybiBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHRoaXMuX3ZvKCkpOyB9XG4gIHJhd1ZhbHVlKCkgeyByZXR1cm4gdGhpcy5fX2tiX3ZhbHVlOyB9XG5cbiAgdmFsdWVUeXBlKG1vZGVsLCBrZXkpIHtcbiAgICBjb25zdCBuZXdfdmFsdWUgPSBrYi5nZXRWYWx1ZShtb2RlbCwga2V5KTtcbiAgICB0aGlzLnZhbHVlX3R5cGUgfHwgdGhpcy5fdXBkYXRlVmFsdWVPYnNlcnZhYmxlKG5ld192YWx1ZSk7IC8vIGNyZWF0ZSBzbyB3ZSBjYW4gY2hlY2sgdGhlIHR5cGVcbiAgICByZXR1cm4gdGhpcy52YWx1ZV90eXBlO1xuICB9XG5cbiAgdXBkYXRlKG5ld192YWx1ZSkge1xuICAgIGlmICh0aGlzLl9fa2JfcmVsZWFzZWQpIHJldHVybiB1bmRlZmluZWQ7IC8vIGRlc3Ryb3llZCwgbm90aGluZyB0byBkb1xuXG4gICAgLy8gZGV0ZXJtaW5lIHRoZSBuZXcgdHlwZVxuICAgIChuZXdfdmFsdWUgIT09IHVuZGVmaW5lZCkgfHwgKG5ld192YWx1ZSA9IG51bGwpOyAvLyBlbnN1cmUgbnVsbCBpbnN0ZWFkIG9mIHVuZGVmaW5lZFxuICAgIGNvbnN0IG5ld190eXBlID0ga2IudXRpbHMudmFsdWVUeXBlKG5ld192YWx1ZSk7XG5cbiAgICBpZiAodGhpcy5fX2tiX3ZhbHVlICYmIHRoaXMuX19rYl92YWx1ZS5fX2tiX3JlbGVhc2VkKSB7IHRoaXMuX19rYl92YWx1ZSA9IHVuZGVmaW5lZDsgdGhpcy52YWx1ZV90eXBlID0gdW5kZWZpbmVkOyB9XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLl9fa2JfdmFsdWU7XG5cbiAgICBzd2l0Y2ggKHRoaXMudmFsdWVfdHlwZSkge1xuICAgICAgY2FzZSBrYi5UWVBFX0NPTExFQ1RJT046XG4gICAgICAgIGlmICgodGhpcy52YWx1ZV90eXBlID09PSBrYi5UWVBFX0NPTExFQ1RJT04pICYmIChuZXdfdHlwZSA9PT0ga2IuVFlQRV9BUlJBWSkpIHJldHVybiB2YWx1ZShuZXdfdmFsdWUpO1xuICAgICAgICBpZiAoKG5ld190eXBlID09PSBrYi5UWVBFX0NPTExFQ1RJT04pIHx8IF8uaXNOdWxsKG5ld192YWx1ZSkpIHtcbiAgICAgICAgICAvLyB1c2UgdGhlIHByb3ZpZGVkIENvbGxlY3Rpb25PYnNlcnZhYmxlXG4gICAgICAgICAgaWYgKG5ld192YWx1ZSAmJiBuZXdfdmFsdWUgaW5zdGFuY2VvZiBrYi5Db2xsZWN0aW9uT2JzZXJ2YWJsZSkgdGhpcy5fdXBkYXRlVmFsdWVPYnNlcnZhYmxlKGtiLnV0aWxzLndyYXBwZWRPYmplY3QobmV3X3ZhbHVlKSwgbmV3X3ZhbHVlKTtcbiAgICAgICAgICBlbHNlIGlmIChrYi5wZWVrKHZhbHVlLmNvbGxlY3Rpb24pICE9PSBuZXdfdmFsdWUpIHZhbHVlLmNvbGxlY3Rpb24obmV3X3ZhbHVlKTsgLy8gY29sbGVjdGlvbiBvYnNlcnZhYmxlcyBhcmUgYWxsb2NhdGVkIG9uY2VcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIGtiLlRZUEVfTU9ERUw6XG4gICAgICAgIGlmICgobmV3X3R5cGUgPT09IGtiLlRZUEVfTU9ERUwpIHx8IF8uaXNOdWxsKG5ld192YWx1ZSkpIHtcbiAgICAgICAgICAvLyB1c2UgdGhlIHByb3ZpZGVkIFZpZXdNb2RlbFxuICAgICAgICAgIGlmIChuZXdfdmFsdWUgJiYgIWtiLmlzTW9kZWwobmV3X3ZhbHVlKSkgdGhpcy5fdXBkYXRlVmFsdWVPYnNlcnZhYmxlKGtiLnV0aWxzLndyYXBwZWRPYmplY3QobmV3X3ZhbHVlKSwgbmV3X3ZhbHVlKTtcbiAgICAgICAgICBlbHNlIGlmIChrYi51dGlscy53cmFwcGVkT2JqZWN0KHZhbHVlKSAhPT0ga2IudXRpbHMucmVzb2x2ZU1vZGVsKG5ld192YWx1ZSkpIHRoaXMuX3VwZGF0ZVZhbHVlT2JzZXJ2YWJsZShuZXdfdmFsdWUpO1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OiBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoKHRoaXMudmFsdWVfdHlwZSA9PT0gbmV3X3R5cGUpICYmICFfLmlzVW5kZWZpbmVkKHRoaXMudmFsdWVfdHlwZSkpIHtcbiAgICAgIGlmIChrYi5wZWVrKHZhbHVlKSAhPT0gbmV3X3ZhbHVlKSByZXR1cm4gdmFsdWUobmV3X3ZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGtiLnBlZWsodmFsdWUpICE9PSBuZXdfdmFsdWUpIHJldHVybiB0aGlzLl91cGRhdGVWYWx1ZU9ic2VydmFibGUobmV3X3ZhbHVlKTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgX3VwZGF0ZVZhbHVlT2JzZXJ2YWJsZShuZXdfdmFsdWUsIG5ld19vYnNlcnZhYmxlKSB7XG4gICAgY29uc3QgeyBjcmVhdGVfb3B0aW9ucyB9ID0gdGhpcztcbiAgICBsZXQgY3JlYXRvciA9IGtiLnV0aWxzLmluZmVyQ3JlYXRvcihuZXdfdmFsdWUsIGNyZWF0ZV9vcHRpb25zLmZhY3RvcnksIGNyZWF0ZV9vcHRpb25zLnBhdGgpO1xuXG4gICAgLy8gcmV0YWluIHByZXZpb3VzIHR5cGVcbiAgICBpZiAoKG5ld192YWx1ZSA9PT0gbnVsbCkgJiYgIWNyZWF0b3IpIHtcbiAgICAgIGlmICh0aGlzLnZhbHVlX3R5cGUgPT09IGtiLlRZUEVfTU9ERUwpIGNyZWF0b3IgPSBrYi5WaWV3TW9kZWw7XG4gICAgICBlbHNlIGlmICh0aGlzLnZhbHVlX3R5cGUgPT09IGtiLlRZUEVfQ09MTEVDVElPTikgY3JlYXRvciA9IGtiLkNvbGxlY3Rpb25PYnNlcnZhYmxlO1xuICAgIH1cbiAgICBjcmVhdGVfb3B0aW9ucy5jcmVhdG9yID0gY3JlYXRvcjtcblxuICAgIGxldCB2YWx1ZV90eXBlID0ga2IuVFlQRV9VTktOT1dOO1xuICAgIGNvbnN0IHByZXZpb3VzX3ZhbHVlID0gdGhpcy5fX2tiX3ZhbHVlO1xuICAgIHRoaXMuX19rYl92YWx1ZSA9IHVuZGVmaW5lZDtcblxuICAgIGxldCB2YWx1ZTtcbiAgICBpZiAobmV3X29ic2VydmFibGUpIHtcbiAgICAgIHZhbHVlID0gbmV3X29ic2VydmFibGU7XG4gICAgICBpZiAoY3JlYXRlX29wdGlvbnMuc3RvcmUpIGNyZWF0ZV9vcHRpb25zLnN0b3JlLnJldGFpbihuZXdfb2JzZXJ2YWJsZSwgbmV3X3ZhbHVlLCBjcmVhdG9yKTtcblxuICAgIC8vIGZvdW5kIGEgY3JlYXRvclxuICAgIH0gZWxzZSBpZiAoY3JlYXRvcikge1xuICAgICAgLy8gaGF2ZSB0aGUgc3RvcmUsIHVzZSBpdCB0byBjcmVhdGVcbiAgICAgIGlmIChjcmVhdGVfb3B0aW9ucy5zdG9yZSkgdmFsdWUgPSBjcmVhdGVfb3B0aW9ucy5zdG9yZS5yZXRhaW5PckNyZWF0ZShuZXdfdmFsdWUsIGNyZWF0ZV9vcHRpb25zLCB0cnVlKTtcblxuICAgICAgLy8gY3JlYXRlIG1hbnVhbGx5XG4gICAgICBlbHNlIGlmIChjcmVhdG9yLm1vZGVsc19vbmx5KSB7IHZhbHVlID0gbmV3X3ZhbHVlOyB2YWx1ZV90eXBlID0ga2IuVFlQRV9TSU1QTEU7IH0gZWxzZSBpZiAoY3JlYXRvci5jcmVhdGUpIHZhbHVlID0gY3JlYXRvci5jcmVhdGUobmV3X3ZhbHVlLCBjcmVhdGVfb3B0aW9ucyk7XG4gICAgICBlbHNlIHZhbHVlID0gbmV3IGNyZWF0b3IobmV3X3ZhbHVlLCBjcmVhdGVfb3B0aW9ucyk7XG5cbiAgICAvLyBjcmVhdGUgYW5kIGNhY2hlIHRoZSB0eXBlXG4gICAgfSBlbHNlIGlmIChfLmlzQXJyYXkobmV3X3ZhbHVlKSkge1xuICAgICAgdmFsdWVfdHlwZSA9IGtiLlRZUEVfQVJSQVk7IHZhbHVlID0ga28ub2JzZXJ2YWJsZUFycmF5KG5ld192YWx1ZSk7XG4gICAgfSBlbHNlIHsgdmFsdWVfdHlwZSA9IGtiLlRZUEVfU0lNUExFOyB2YWx1ZSA9IGtvLm9ic2VydmFibGUobmV3X3ZhbHVlKTsgfVxuXG4gICAgLy8gZGV0ZXJtaW5lIHRoZSB0eXBlXG4gICAgdGhpcy52YWx1ZV90eXBlID0gdmFsdWVfdHlwZTtcbiAgICBpZiAodmFsdWVfdHlwZSA9PT0ga2IuVFlQRV9VTktOT1dOKSB7XG4gICAgICAvLyBhIHZpZXcgbW9kZWwsIHJlY29nbml6ZSB2aWV3X21vZGVscyBhcyBub24tb2JzZXJ2YWJsZVxuICAgICAgaWYgKCFrby5pc09ic2VydmFibGUodmFsdWUpKSB7XG4gICAgICAgIHRoaXMudmFsdWVfdHlwZSA9IGtiLlRZUEVfTU9ERUw7IGtiLnV0aWxzLndyYXBwZWRPYmplY3QodmFsdWUsIGtiLnV0aWxzLnJlc29sdmVNb2RlbChuZXdfdmFsdWUpKTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUuX19rYl9pc19jbykge1xuICAgICAgICB0aGlzLnZhbHVlX3R5cGUgPSBrYi5UWVBFX0NPTExFQ1RJT047IGtiLnV0aWxzLndyYXBwZWRPYmplY3QodmFsdWUsIG5ld192YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLnZhbHVlX3R5cGUpIHRoaXMudmFsdWVfdHlwZSA9IGtiLlRZUEVfU0lNUExFO1xuICAgIH1cblxuICAgIC8vIHJlbGVhc2UgcHJldmlvdXNcbiAgICBpZiAocHJldmlvdXNfdmFsdWUpIHtcbiAgICAgIHRoaXMuY3JlYXRlX29wdGlvbnMuc3RvcmUgPyB0aGlzLmNyZWF0ZV9vcHRpb25zLnN0b3JlLnJlbGVhc2UocHJldmlvdXNfdmFsdWUpIDoga2IucmVsZWFzZShwcmV2aW91c192YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gc3RvcmUgdGhlIHZhbHVlXG4gICAgdGhpcy5fX2tiX3ZhbHVlID0gdmFsdWU7XG4gICAgcmV0dXJuIHRoaXMuX3ZvKHZhbHVlKTtcbiAgfVxufVxuIiwiLypcbiAga25vY2tiYWNrLmpzIDIuMC4wLWFscGhhLjFcbiAgQ29weXJpZ2h0IChjKSAgMjAxMS0yMDE2IEtldmluIE1hbGFrb2ZmLlxuICBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuICBTb3VyY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9rbWFsYWtvZmYva25vY2tiYWNrXG4gIERlcGVuZGVuY2llczogS25vY2tvdXQuanMsIEJhY2tib25lLmpzLCBhbmQgVW5kZXJzY29yZS5qcyAob3IgTG9EYXNoLmpzKS5cbiAgT3B0aW9uYWwgZGVwZW5kZW5jaWVzOiBCYWNrYm9uZS5Nb2RlbFJlZi5qcyBhbmQgQmFja2JvbmVPUk0uXG4qL1xuXG5pbXBvcnQga28gZnJvbSAna25vY2tvdXQnO1xuXG5pbXBvcnQga2IgZnJvbSAnLi4va2InO1xuXG4vLyBBbGxvdyBmb3IgZGVwZW5kZW50IHJlbGVhc2UgdW50aWwgaXMgcmVzb2x2ZWQgaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0L2lzc3Vlcy8xNDY0XG5pZiAoa28uc3Vic2NyaWJhYmxlICYmIGtvLnN1YnNjcmliYWJsZS5mbiAmJiBrby5zdWJzY3JpYmFibGUuZm4uZXh0ZW5kKSB7XG4gIGNvbnN0IF9leHRlbmQgPSBrby5zdWJzY3JpYmFibGUuZm4uZXh0ZW5kO1xuICBrby5zdWJzY3JpYmFibGUuZm4uZXh0ZW5kID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBfZXh0ZW5kLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXG4gICAgLy8gcmVsZWFzZSB0aGUgZXh0ZW5kZWQgb2JzZXJ2YWJsZVxuICAgIGlmICgodGFyZ2V0ICE9PSB0aGlzKSAmJiBrYi5pc1JlbGVhc2VhYmxlKHRoaXMpKSB7XG4gICAgICBjb25zdCBfZGlzcG9zZSA9IHRhcmdldC5kaXNwb3NlO1xuICAgICAgdGFyZ2V0LmRpc3Bvc2UgPSAoLi4uYXJnczIpID0+IHtcbiAgICAgICAgIV9kaXNwb3NlIHx8IF9kaXNwb3NlLmFwcGx5KHRhcmdldCwgYXJnczIpO1xuICAgICAgICByZXR1cm4ga2IucmVsZWFzZSh0aGlzKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcbn1cbiIsIi8qXG4gIGtub2NrYmFjay5qcyAyLjAuMC1hbHBoYS4xXG4gIENvcHlyaWdodCAoYykgIDIwMTEtMjAxNiBLZXZpbiBNYWxha29mZi5cbiAgTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiAgU291cmNlOiBodHRwczovL2dpdGh1Yi5jb20va21hbGFrb2ZmL2tub2NrYmFja1xuICBEZXBlbmRlbmNpZXM6IEtub2Nrb3V0LmpzLCBCYWNrYm9uZS5qcywgYW5kIFVuZGVyc2NvcmUuanMgKG9yIExvRGFzaC5qcykuXG4gIE9wdGlvbmFsIGRlcGVuZGVuY2llczogQmFja2JvbmUuTW9kZWxSZWYuanMgYW5kIEJhY2tib25lT1JNLlxuKi9cblxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQga28gZnJvbSAna25vY2tvdXQnO1xuXG5pbXBvcnQga2IgZnJvbSAnLi9rYic7XG5pbXBvcnQgVHlwZWRWYWx1ZSBmcm9tICcuL2xpYi90eXBlZC12YWx1ZSc7XG5pbXBvcnQgRXZlbnRXYXRjaGVyIGZyb20gJy4vZXZlbnQtd2F0Y2hlcic7XG5cbmNvbnN0IEtFWVNfUFVCTElTSCA9IFsndmFsdWUnLCAndmFsdWVUeXBlJywgJ2Rlc3Ryb3knXTtcbmNvbnN0IEtFWVNfSU5GTyA9IFsnYXJncycsICdyZWFkJywgJ3dyaXRlJ107XG5cbi8vIEJhc2UgY2xhc3MgZm9yIG9ic2VydmluZyBtb2RlbCBhdHRyaWJ1dGVzLlxuLy9cbi8vIEBleGFtcGxlIEhvdyB0byBjcmVhdGUgYSBrby5Db2xsZWN0aW9uT2JzZXJ2YWJsZSB1c2luZyB0aGUga28uY29sbGVjdGlvbk9ic2VydmFibGUgZmFjdG9yeS5cbi8vICAgdmFyIENvbnRhY3RWaWV3TW9kZWwgPSBmdW5jdGlvbihtb2RlbCkge1xuLy8gICAgIHRoaXMubmFtZSA9IGtiLm9ic2VydmFibGUobW9kZWwsICduYW1lJyk7XG4vLyAgICAgdGhpcy5udW1iZXIgPSBrYi5vYnNlcnZhYmxlKG1vZGVsLCB7IGtleTogJ251bWJlcid9KTtcbi8vICAgfTtcbi8vICAgdmFyIG1vZGVsID0gbmV3IENvbnRhY3QoeyBuYW1lOiAnUmluZ28nLCBudW1iZXI6ICc1NTUtNTU1LTU1NTYnIH0pO1xuLy8gICB2YXIgdmlld19tb2RlbCA9IG5ldyBDb250YWN0Vmlld01vZGVsKG1vZGVsKTtcbi8vXG4vLyBAZXhhbXBsZSBIb3cgdG8gY3JlYXRlIGEga2IuT2JzZXJ2YWJsZSB3aXRoIGEgZGVmYXVsdCB2YWx1ZS5cbi8vICAgdmFyIG1vZGVsID0gQmFja2JvbmUuTW9kZWwoe25hbWU6ICdCb2InfSk7XG4vLyAgIHZhciBuYW1lID0ga2Iub2JzZXJ2YWJsZShtb2RlbCwge2tleTonbmFtZScsIGRlZmF1bHQ6ICcobm9uZSknfSk7IC8vIG5hbWUgaXMgQm9iXG4vLyAgIG5hbWUuc2V0VG9EZWZhdWx0KCk7IC8vIG5hbWUgaXMgKG5vbmUpXG4vL1xuLy8gQG1ldGhvZCAjbW9kZWwoKVxuLy8gICBEdWFsLXB1cnBvc2UgZ2V0dGVyL3NldHRlciBrby5jb21wdXRlZCBmb3IgdGhlIG9ic2VydmVkIG1vZGVsLlxuLy8gICBAcmV0dXJuIFtNb2RlbHxNb2RlbFJlZnx2b2lkXSBnZXR0ZXI6IHRoZSBtb2RlbCB3aG9zZSBhdHRyaWJ1dGVzIGFyZSBiZWluZyBvYnNlcnZlZCAoY2FuIGJlIG51bGwpIE9SIHNldHRlcjogdm9pZFxuLy8gICBAZXhhbXBsZVxuLy8gICAgIHZhciBvYnNlcnZhYmxlID0ga2Iub2JzZXJ2YWJsZShuZXcgQmFja2JvbmUuTW9kZWwoe25hbWU6ICdib2InfSksICduYW1lJyk7XG4vLyAgICAgdmFyIHRoZV9tb2RlbCA9IG9ic2VydmFibGUubW9kZWwoKTsgLy8gZ2V0XG4vLyAgICAgb2JzZXJ2YWJsZS5tb2RlbChuZXcgQmFja2JvbmUuTW9kZWwoe25hbWU6ICdmcmVkJ30pKTsgLy8gc2V0XG4vL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT2JzZXJ2YWJsZSB7XG5cbiAgLy8gVXNlZCB0byBjcmVhdGUgYSBuZXcga2IuT2JzZXJ2YWJsZS5cbiAgLy9cbiAgLy8gQHBhcmFtIFtNb2RlbF0gbW9kZWwgdGhlIG1vZGVsIHRvIG9ic2VydmUgKGNhbiBiZSBudWxsKVxuICAvLyBAcGFyYW0gW1N0cmluZ3xBcnJheXxPYmplY3RdIG9wdGlvbnMgdGhlIGNyZWF0ZSBvcHRpb25zLiBTdHJpbmcgaXMgYSBzaW5nbGUgYXR0cmlidXRlIG5hbWUsIEFycmF5IGlzIGFuIGFycmF5IG9mIGF0dHJpYnV0ZSBuYW1lcy5cbiAgLy8gQG9wdGlvbiBvcHRpb25zIFtTdHJpbmddIGtleSB0aGUgbmFtZSBvZiB0aGUgYXR0cmlidXRlLlxuICAvLyBAb3B0aW9uIG9wdGlvbnMgW0Z1bmN0aW9uXSByZWFkIGEgZnVuY3Rpb24gdXNlZCB0byBwcm92aWRlIHRyYW5zZm9ybSB0aGUgYXR0cmlidXRlIHZhbHVlIGJlZm9yZSBwYXNzaW5nIGl0IHRvIHRoZSBjYWxsZXIuIFNpZ25hdHVyZTogcmVhZCgpXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbRnVuY3Rpb25dIHdyaXRlIGEgZnVuY3Rpb24gdXNlZCB0byBwcm92aWRlIHRyYW5zZm9ybSB0aGUgdmFsdWUgYmVmb3JlIHBhc3NpbmcgaXQgdG8gdGhlIG1vZGVsIHNldCBmdW5jdGlvbi4gU2lnbmF0dXJlOiB3cml0ZSh2YWx1ZSlcbiAgLy8gQG9wdGlvbiBvcHRpb25zIFtBcnJheV0gYXJncyBhcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgcmVhZCBhbmQgd3JpdGUgZnVuY3Rpb25zICh0aGV5IGNhbiBiZSBrby5vYnNlcnZhYmxlcykuIENhbiBiZSB1c2VmdWwgZm9yIHBhc3NpbmcgYXJndW1lbnRzIHRvIGEgbG9jYWxlIG1hbmFnZXIuXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbQ29uc3RydWN0b3JdIGxvY2FsaXplciBhIGNvbmNyZXRlIGtiLkxvY2FsaXplZE9ic2VydmFibGUgY29uc3RydWN0b3IgZm9yIGxvY2FsaXphdGlvbi5cbiAgLy8gQG9wdGlvbiBvcHRpb25zIFtEYXRhfGtvLm9ic2VydmFibGVdIGRlZmF1bHQgdGhlIGRlZmF1bHQgdmFsdWUuIENhbiBiZSBhIHZhbHVlLCBzdHJpbmcgb3Iga28ub2JzZXJ2YWJsZS5cbiAgLy8gQG9wdGlvbiBvcHRpb25zIFtTdHJpbmddIHBhdGggdGhlIHBhdGggdG8gdGhlIHZhbHVlICh1c2VkIHRvIGNyZWF0ZSByZWxhdGVkIG9ic2VydmFibGVzIGZyb20gdGhlIGZhY3RvcnkpLlxuICAvLyBAb3B0aW9uIG9wdGlvbnMgW2tiLlN0b3JlXSBzdG9yZSBhIHN0b3JlIHVzZWQgdG8gY2FjaGUgYW5kIHNoYXJlIHZpZXcgbW9kZWxzLlxuICAvLyBAb3B0aW9uIG9wdGlvbnMgW2tiLkZhY3RvcnldIGZhY3RvcnkgYSBmYWN0b3J5IHVzZWQgdG8gY3JlYXRlIHZpZXcgbW9kZWxzLlxuICAvLyBAb3B0aW9uIG9wdGlvbnMgW09iamVjdF0gb3B0aW9ucyBhIHNldCBvZiBvcHRpb25zIG1lcmdlIGludG8gdGhlc2Ugb3B0aW9ucy4gVXNlZnVsIGZvciBleHRlbmRpbmcgb3B0aW9ucyB3aGVuIGRlcml2aW5nIGNsYXNzZXMgcmF0aGVyIHRoYW4gbWVyZ2luZyB0aGVtIGJ5IGhhbmQuXG4gIC8vIEByZXR1cm4gW2tvLm9ic2VydmFibGVdIHRoZSBjb25zdHJ1Y3RvciBkb2VzIG5vdCByZXR1cm4gJ3RoaXMnIGJ1dCBhIGtvLm9ic2VydmFibGVcbiAgLy8gQG5vdGUgdGhlIGNvbnN0cnVjdG9yIGRvZXMgbm90IHJldHVybiAndGhpcycgYnV0IGEga28ub2JzZXJ2YWJsZVxuICBjb25zdHJ1Y3Rvcihtb2RlbCwga2V5X29yX2luZm8sIG9wdGlvbnMsIF92bSkge1xuICAgIGlmIChfdm0gPT0gbnVsbCkgeyBfdm0gPSB7fTsgfSB0aGlzLl92bSA9IF92bTsgcmV0dXJuIGtiLmlnbm9yZSgoKSA9PiB7XG4gICAgICBrZXlfb3JfaW5mbyB8fCBrYi5fdGhyb3dNaXNzaW5nKHRoaXMsICdrZXlfb3JfaW5mbycpO1xuICAgICAgdGhpcy5rZXkgPSBrZXlfb3JfaW5mby5rZXkgfHwga2V5X29yX2luZm87XG4gICAgICBfLm1hcChLRVlTX0lORk8sIChrZXkpID0+IHsgaWYgKGtleV9vcl9pbmZvW2tleV0pIHsgdGhpc1trZXldID0ga2V5X29yX2luZm9ba2V5XTsgfSB9KTtcblxuICAgICAgY29uc3QgY3JlYXRlX29wdGlvbnMgPSBrYi51dGlscy5jb2xsYXBzZU9wdGlvbnMob3B0aW9ucyk7XG4gICAgICBjb25zdCB7IGV2ZW50X3dhdGNoZXIgfSA9IGNyZWF0ZV9vcHRpb25zO1xuICAgICAgZGVsZXRlIGNyZWF0ZV9vcHRpb25zLmV2ZW50X3dhdGNoZXI7XG5cbiAgICAgIC8vIHNldCB1cCBiYXNpY3NcbiAgICAgIHRoaXMuX3ZhbHVlID0gbmV3IFR5cGVkVmFsdWUoY3JlYXRlX29wdGlvbnMpO1xuICAgICAgdGhpcy5fbW9kZWwgPSBrby5vYnNlcnZhYmxlKCk7XG4gICAgICBsZXQgb2JzZXJ2YWJsZSA9IGtiLnV0aWxzLndyYXBwZWRPYnNlcnZhYmxlKHRoaXMsIGtvLmNvbXB1dGVkKHtcbiAgICAgICAgcmVhZDogKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG0gPSB0aGlzLl9tb2RlbCgpO1xuICAgICAgICAgIGNvbnN0IGFyZ3MgPSBbdGhpcy5rZXldLmNvbmNhdCh0aGlzLmFyZ3MgfHwgW10pO1xuICAgICAgICAgIF8uZWFjaChhcmdzLCBhcmcgPT4ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShhcmcpKTtcblxuICAgICAgICAgIGNvbnN0IGV3ID0ga2IudXRpbHMud3JhcHBlZEV2ZW50V2F0Y2hlcih0aGlzKTtcbiAgICAgICAgICAhZXcgfHwgZXcuZW1pdHRlcihtIHx8IG51bGwpO1xuXG4gICAgICAgICAgaWYgKHRoaXMucmVhZCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5yZWFkLmFwcGx5KHRoaXMuX3ZtLCBhcmdzKSk7XG4gICAgICAgICAgfSBlbHNlIGlmICghXy5pc1VuZGVmaW5lZChtKSkge1xuICAgICAgICAgICAga2IuaWdub3JlKCgpID0+IHRoaXMudXBkYXRlKGtiLmdldFZhbHVlKG0sIGtiLnBlZWsodGhpcy5rZXkpLCB0aGlzLmFyZ3MpKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZS52YWx1ZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdyaXRlOiBuZXdfdmFsdWUgPT4ga2IuaWdub3JlKCgpID0+IHtcbiAgICAgICAgICBjb25zdCB1bndyYXBwZWRfbmV3X3ZhbHVlID0ga2IudXRpbHMudW53cmFwTW9kZWxzKG5ld192YWx1ZSk7IC8vIHVud3JhcCBmb3Igc2V0IChrbm9ja291dCBtYXkgcGFzcyB2aWV3IG1vZGVscyB3aGljaCBhcmUgcmVxdWlyZWQgZm9yIHRoZSBvYnNlcnZhYmxlIGJ1dCBub3QgdGhlIG1vZGVsKVxuICAgICAgICAgIGNvbnN0IG0gPSBrYi5wZWVrKHRoaXMuX21vZGVsKTtcbiAgICAgICAgICBpZiAodGhpcy53cml0ZSkge1xuICAgICAgICAgICAgdGhpcy53cml0ZS5jYWxsKHRoaXMuX3ZtLCB1bndyYXBwZWRfbmV3X3ZhbHVlKTtcbiAgICAgICAgICAgIG5ld192YWx1ZSA9IGtiLmdldFZhbHVlKG0sIGtiLnBlZWsodGhpcy5rZXkpLCB0aGlzLmFyZ3MpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobSkge1xuICAgICAgICAgICAga2Iuc2V0VmFsdWUobSwga2IucGVlayh0aGlzLmtleSksIHVud3JhcHBlZF9uZXdfdmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGUobmV3X3ZhbHVlKTtcbiAgICAgICAgfSksXG5cbiAgICAgICAgb3duZXI6IHRoaXMuX3ZtLFxuICAgICAgfSkpO1xuXG4gICAgICBvYnNlcnZhYmxlLl9fa2JfaXNfbyA9IHRydWU7IC8vIG1hcmsgYXMgYSBrYi5PYnNlcnZhYmxlXG4gICAgICBjcmVhdGVfb3B0aW9ucy5zdG9yZSA9IGtiLnV0aWxzLndyYXBwZWRTdG9yZShvYnNlcnZhYmxlLCBjcmVhdGVfb3B0aW9ucy5zdG9yZSk7XG4gICAgICBjcmVhdGVfb3B0aW9ucy5wYXRoID0ga2IudXRpbHMucGF0aEpvaW4oY3JlYXRlX29wdGlvbnMucGF0aCwgdGhpcy5rZXkpO1xuICAgICAgaWYgKGNyZWF0ZV9vcHRpb25zLmZhY3RvcmllcyAmJiAoKHR5cGVvZiAoY3JlYXRlX29wdGlvbnMuZmFjdG9yaWVzKSA9PT0gJ2Z1bmN0aW9uJykgfHwgY3JlYXRlX29wdGlvbnMuZmFjdG9yaWVzLmNyZWF0ZSkpIHtcbiAgICAgICAgY3JlYXRlX29wdGlvbnMuZmFjdG9yeSA9IGtiLnV0aWxzLndyYXBwZWRGYWN0b3J5KG9ic2VydmFibGUsIG5ldyBrYi5GYWN0b3J5KGNyZWF0ZV9vcHRpb25zLmZhY3RvcnkpKTtcbiAgICAgICAgY3JlYXRlX29wdGlvbnMuZmFjdG9yeS5hZGRQYXRoTWFwcGluZyhjcmVhdGVfb3B0aW9ucy5wYXRoLCBjcmVhdGVfb3B0aW9ucy5mYWN0b3JpZXMpO1xuICAgICAgfSBlbHNlIGNyZWF0ZV9vcHRpb25zLmZhY3RvcnkgPSBrYi5GYWN0b3J5LnVzZU9wdGlvbnNPckNyZWF0ZShjcmVhdGVfb3B0aW9ucywgb2JzZXJ2YWJsZSwgY3JlYXRlX29wdGlvbnMucGF0aCk7XG4gICAgICBkZWxldGUgY3JlYXRlX29wdGlvbnMuZmFjdG9yaWVzO1xuXG4gICAgICAvLyBwdWJsaXNoIHB1YmxpYyBpbnRlcmZhY2Ugb24gdGhlIG9ic2VydmFibGUgYW5kIHJldHVybiBpbnN0ZWFkIG9mIHRoaXNcbiAgICAgIGtiLnB1Ymxpc2hNZXRob2RzKG9ic2VydmFibGUsIHRoaXMsIEtFWVNfUFVCTElTSCk7XG5cbiAgICAgIC8vIHVzZSBleHRlcm5hbCBtb2RlbCBvYnNlcnZhYmxlIG9yIGNyZWF0ZVxuICAgICAgdGhpcy5tb2RlbCA9IGtvLmNvbXB1dGVkKHtcbiAgICAgICAgcmVhZDogKCkgPT4ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh0aGlzLl9tb2RlbCksXG4gICAgICAgIHdyaXRlOiBuZXdfbW9kZWwgPT4ga2IuaWdub3JlKCgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5fX2tiX3JlbGVhc2VkIHx8IChrYi5wZWVrKHRoaXMuX21vZGVsKSA9PT0gbmV3X21vZGVsKSkgcmV0dXJuIHVuZGVmaW5lZDsgLy8gZGVzdHJveWVkIG9yIG5vIGNoYW5nZVxuXG4gICAgICAgICAgLy8gdXBkYXRlIHJlZmVyZW5jZXNcbiAgICAgICAgICBjb25zdCBuZXdfdmFsdWUgPSBrYi5nZXRWYWx1ZShuZXdfbW9kZWwsIGtiLnBlZWsodGhpcy5rZXkpLCB0aGlzLmFyZ3MpO1xuICAgICAgICAgIHRoaXMuX21vZGVsKG5ld19tb2RlbCk7XG4gICAgICAgICAgaWYgKCFuZXdfbW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZShudWxsKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCFfLmlzVW5kZWZpbmVkKG5ld192YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZShuZXdfdmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9KSxcbiAgICAgIH0pO1xuICAgICAgb2JzZXJ2YWJsZS5tb2RlbCA9IHRoaXMubW9kZWw7XG5cbiAgICAgIEV2ZW50V2F0Y2hlci51c2VPcHRpb25zT3JDcmVhdGUoeyBldmVudF93YXRjaGVyIH0sIG1vZGVsIHx8IG51bGwsIHRoaXMsIHtcbiAgICAgICAgZW1pdHRlcjogdGhpcy5tb2RlbCxcbiAgICAgICAgdXBkYXRlOiAoKCkgPT4ga2IuaWdub3JlKCgpID0+IHRoaXMudXBkYXRlKCkpKSxcbiAgICAgICAga2V5OiB0aGlzLmtleSxcbiAgICAgICAgcGF0aDogY3JlYXRlX29wdGlvbnMucGF0aCxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fdmFsdWUucmF3VmFsdWUoKSB8fCB0aGlzLl92YWx1ZS51cGRhdGUoKTsgLy8gd2Fzbid0IGxvYWRlZCBzbyBjcmVhdGVcblxuICAgICAgLy8gd3JhcCBvdXJzZWx2ZXMgd2l0aCBhIGxvY2FsaXplclxuICAgICAgaWYgKGtiLkxvY2FsaXplZE9ic2VydmFibGUgJiYga2V5X29yX2luZm8ubG9jYWxpemVyKSBvYnNlcnZhYmxlID0gbmV3IGtleV9vcl9pbmZvLmxvY2FsaXplcihvYnNlcnZhYmxlKTtcblxuICAgICAgLy8gd3JhcCBvdXJzZWx2ZXMgd2l0aCBhIGRlZmF1bHQgdmFsdWVcbiAgICAgIGlmIChrYi5EZWZhdWx0T2JzZXJ2YWJsZSAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoa2V5X29yX2luZm8sICdkZWZhdWx0JykpIG9ic2VydmFibGUgPSBrYi5kZWZhdWx0T2JzZXJ2YWJsZShvYnNlcnZhYmxlLCBrZXlfb3JfaW5mby5kZWZhdWx0KTtcblxuICAgICAgcmV0dXJuIG9ic2VydmFibGU7XG4gICAgfSxcbiAgKTtcbiAgfVxuXG4gIC8vIFJlcXVpcmVkIGNsZWFuIHVwIGZ1bmN0aW9uIHRvIGJyZWFrIGN5Y2xlcywgcmVsZWFzZSB2aWV3IG1vZGVscywgZXRjLlxuICAvLyBDYW4gYmUgY2FsbGVkIGRpcmVjdGx5LCB2aWEga2IucmVsZWFzZShvYmplY3QpIG9yIGFzIGEgY29uc2VxdWVuY2Ugb2Yga28ucmVsZWFzZU5vZGUoZWxlbWVudCkuXG4gIGRlc3Ryb3koKSB7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZSA9IGtiLnV0aWxzLndyYXBwZWRPYnNlcnZhYmxlKHRoaXMpO1xuICAgIHRoaXMuX19rYl9yZWxlYXNlZCA9IHRydWU7XG4gICAgdGhpcy5fdmFsdWUuZGVzdHJveSgpOyB0aGlzLl92YWx1ZSA9IG51bGw7XG4gICAgdGhpcy5tb2RlbC5kaXNwb3NlKCk7IHRoaXMubW9kZWwgPSBudWxsOyBvYnNlcnZhYmxlLm1vZGVsID0gbnVsbDtcbiAgICByZXR1cm4ga2IudXRpbHMud3JhcHBlZERlc3Ryb3kodGhpcyk7XG4gIH1cblxuICAvLyBAcmV0dXJuIFtrYi5Db2xsZWN0aW9uT2JzZXJ2YWJsZXxrYi5WaWV3TW9kZWx8a28ub2JzZXJ2YWJsZV0gZXhwb3NlcyB0aGUgcmF3IHZhbHVlIGluc2lkZSB0aGUga2Iub2JzZXJ2YWJsZS5cbiAgLy8gRm9yIGV4YW1wbGUsIGlmIHlvdXIgYXR0cmlidXRlIGlzIGEgQ29sbGVjdGlvbiwgaXQgd2lsbCBob2xkIGEgQ29sbGVjdGlvbk9ic2VydmFibGUuXG4gIHZhbHVlKCkgeyByZXR1cm4gdGhpcy5fdmFsdWUucmF3VmFsdWUoKTsgfVxuXG4gIC8vIEByZXR1cm4gW2tiLlRZUEVfVU5LTk9XTnxrYi5UWVBFX1NJTVBMRXxrYi5UWVBFX0FSUkFZfGtiLlRZUEVfTU9ERUx8a2IuVFlQRV9DT0xMRUNUSU9OXSBwcm92aWRlcyB0aGUgdHlwZSBvZiB0aGUgd3JhcHBlZCB2YWx1ZS5cbiAgdmFsdWVUeXBlKCkgeyByZXR1cm4gdGhpcy5fdmFsdWUudmFsdWVUeXBlKGtiLnBlZWsodGhpcy5fbW9kZWwpLCBrYi5wZWVrKHRoaXMua2V5KSk7IH1cblxuICAvLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgLy8gSW50ZXJuYWxcbiAgLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIC8vIEBub2RvY1xuICB1cGRhdGUobmV3X3ZhbHVlKSB7XG4gICAgaWYgKHRoaXMuX19rYl9yZWxlYXNlZCkgcmV0dXJuIHVuZGVmaW5lZDsgLy8gZGVzdHJveWVkLCBub3RoaW5nIHRvIGRvXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSBuZXdfdmFsdWUgPSBrYi5nZXRWYWx1ZShrYi5wZWVrKHRoaXMuX21vZGVsKSwga2IucGVlayh0aGlzLmtleSkpO1xuICAgIHJldHVybiB0aGlzLl92YWx1ZS51cGRhdGUobmV3X3ZhbHVlKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgb2JzZXJ2YWJsZSA9ICguLi5hcmdzKSA9PiBuZXcgT2JzZXJ2YWJsZSguLi5hcmdzKTtcbiIsIi8qXG4gIGtub2NrYmFjay5qcyAyLjAuMC1hbHBoYS4xXG4gIENvcHlyaWdodCAoYykgIDIwMTEtMjAxNiBLZXZpbiBNYWxha29mZi5cbiAgTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiAgU291cmNlOiBodHRwczovL2dpdGh1Yi5jb20va21hbGFrb2ZmL2tub2NrYmFja1xuICBEZXBlbmRlbmNpZXM6IEtub2Nrb3V0LmpzLCBCYWNrYm9uZS5qcywgYW5kIFVuZGVyc2NvcmUuanMgKG9yIExvRGFzaC5qcykuXG4gIE9wdGlvbmFsIGRlcGVuZGVuY2llczogQmFja2JvbmUuTW9kZWxSZWYuanMgYW5kIEJhY2tib25lT1JNLlxuKi9cblxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5cbi8vIGtiLlN0YXRpc3RpY3MgaXMgYW4gb3B0aW9uYWwgY29tcG9uZW50cyB0aGF0IGlzIHVzZWZ1bCBmb3IgbWVhc3VyaW5nIHlvdXIgYXBwbGljYXRpb24ncyBwZXJmb3JtYW5jZS5cbi8vIFlvdSBjYW4gcmVjb3JkIGFsbCBvZiB0aGUgQmFja2JvbmUuRXZlbnRzIHRoYXQgaGF2ZSB0cmlnZ2VyZWQga28ub2JzZXJ2YWJsZSBzdWJzY3JpcHRpb24gdXBkYXRlcyBhbmQgdGhlIG1lbW9yeSBmb290cHJpbnQgKGluc3RhbmNlIGNvdW50LW9ubHkpIG9mIHlvdXIgVmlld01vZGVscyBhbmQgY29sbGVjdGlvbiBvYnNlcnZhYmxlcy5cbi8vXG4vLyBrYi5TdGF0aXN0aWNzIGlzIG5vdCBpbmNsdWRlZCBpbiBga25vY2tiYWNrLmpzYCBub3IgYGtub2NrYmFjay1jb3JlLmpzYCBzbyB5b3UgbmVlZCB0byBtYW51YWxseSBpbmNsdWRlIGl0IGZyb20gdGhlIGBsaWJgIGRpcmVjdG9yeS5cbi8vXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0aXN0aWNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5tb2RlbF9ldmVudHNfdHJhY2tlciA9IFtdO1xuICAgIHRoaXMucmVnaXN0ZXJlZF90cmFja2VyID0ge307XG4gIH1cblxuICAvLyBDbGVhciB0aGUgdHJhY2tlZCBtb2RlbCBldmVudHMgKGJ1dCBrZWVwIHRoZSByZWdpc3RlcmVkIG9iamVjdHMgaW50YWN0KVxuICBjbGVhcigpIHsgdGhpcy5tb2RlbF9ldmVudHNfdHJhY2tlciA9IFtdOyB9XG5cbiAgLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIC8vIFJlZ2lzdGVyZWQgRXZlbnRzXG4gIC8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIC8vIFJlZ2lzdGVyIGEgbW9kZWwgZXZlbnRcbiAgYWRkTW9kZWxFdmVudChldmVudCkgeyB0aGlzLm1vZGVsX2V2ZW50c190cmFja2VyLnB1c2goZXZlbnQpOyB9XG5cbiAgLy8gQSBkZWJ1ZyBoZWxwZXIgdG8gc3VtbWFyaXplIHRoZSByZWdpc3RlcmVkIGV2ZW50cyBpbiBodW1hbi1yZWFkYWJsZSBmb3JtXG4gIG1vZGVsRXZlbnRzU3RhdHNTdHJpbmcoKSB7XG4gICAgbGV0IHN0YXRzX3N0cmluZyA9ICcnO1xuICAgIHN0YXRzX3N0cmluZyArPSBgVG90YWwgQ291bnQ6ICR7dGhpcy5tb2RlbF9ldmVudHNfdHJhY2tlci5sZW5ndGh9YDtcbiAgICBjb25zdCBldmVudF9ncm91cHMgPSBfLmdyb3VwQnkodGhpcy5tb2RlbF9ldmVudHNfdHJhY2tlciwgdGVzdCA9PiBgZXZlbnQgbmFtZTogJyR7dGVzdC5uYW1lfScsIGF0dHJpYnV0ZSBuYW1lOiAnJHt0ZXN0LmtleX0nYCk7XG4gICAgXy5lYWNoKGV2ZW50X2dyb3VwcywgKHZhbHVlLCBrZXkpID0+IHsgc3RhdHNfc3RyaW5nICs9IGBcXG4gJHtrZXl9LCBjb3VudDogJHt2YWx1ZS5sZW5ndGh9YDsgfSk7XG4gICAgcmV0dXJuIHN0YXRzX3N0cmluZztcbiAgfVxuXG4gIC8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAvLyBSZWdpc3RlcmVkIE9ic2VydmFibGVzIGFuZCBWaWV3IE1vZGVsc1xuICAvLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAvLyBSZWdpc3RlciBhbiBvYmplY3QgYnkga2V5XG4gIHJlZ2lzdGVyKGtleSwgb2JqKSB7IHRoaXMucmVnaXN0ZXJlZFRyYWNrZXIoa2V5KS5wdXNoKG9iaik7IH1cblxuICAvLyBVbnJlZ2lzdGVyIGFuIG9iamVjdCBieSBrZXlcbiAgdW5yZWdpc3RlcihrZXksIG9iaikge1xuICAgIGNvbnN0IHR5cGVfdHJhY2tlciA9IHRoaXMucmVnaXN0ZXJlZFRyYWNrZXIoa2V5KTtcbiAgICBjb25zdCBpbmRleCA9IF8uaW5kZXhPZih0eXBlX3RyYWNrZXIsIG9iaik7XG4gICAgaWYgKCF+aW5kZXgpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIGNvbnNvbGUubG9nKGBrYi5TdGF0aXN0aWNzOiBmYWlsZWQgdG8gdW5yZWdpc3RlciB0eXBlOiAke2tleX1gKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB0eXBlX3RyYWNrZXIuc3BsaWNlKGluZGV4LCAxKTtcbiAgfVxuXG4gIC8vIEByZXR1cm4gW0ludGVnZXJdIHRoZSBudW1iZXIgb2YgcmVnaXN0ZXJlZCBvYmplY3RzIGJ5IHR5cGVcbiAgcmVnaXN0ZXJlZENvdW50KHR5cGUpIHtcbiAgICBpZiAodHlwZSkgcmV0dXJuIHRoaXMucmVnaXN0ZXJlZFRyYWNrZXIodHlwZSkubGVuZ3RoO1xuXG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBfLmVhY2godGhpcy5yZWdpc3RlcmVkX3RyYWNrZXJbdHlwZV0sICh0eXBlX3RyYWNrZXIpID0+IHsgY291bnQgKz0gdHlwZV90cmFja2VyLmxlbmd0aDsgfSk7XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgLy8gQSBkZWJ1ZyBoZWxwZXIgdG8gc3VtbWFyaXplIHRoZSBjdXJyZW50IHJlZ2lzdGVyZWQgb2JqZWN0cyBieSBrZXlcbiAgLy9cbiAgLy8gQHBhcmFtIFtTdHJpbmddIHN1Y2Nlc3NfbWVzc2FnZSBhIG1lc3NhZ2UgdG8gcmV0dXJuIGlmIHRoZXJlIGFyZSBubyByZWdpc3RlcmVkIG9iamVjdHNcbiAgLy8gQHJldHVybiBbU3RyaW5nXSBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyBzdW1tYXJpemluZyB0aGUgY3VycmVudGx5IHJlZ2lzdGVyZWQgb2JqZWN0cyBvciBzdWNjZXNzX21lc3NhZ2VcbiAgcmVnaXN0ZXJlZFN0YXRzU3RyaW5nKHN1Y2Nlc3NfbWVzc2FnZSkge1xuICAgIGxldCBzdGF0c19zdHJpbmcgPSAnJztcbiAgICBsZXQgd3JpdHRlbiA9IGZhbHNlO1xuICAgIF8uZWFjaCh0aGlzLnJlZ2lzdGVyZWRfdHJhY2tlciwgKHR5cGVfdHJhY2tlciwgdHlwZSkgPT4ge1xuICAgICAgaWYgKCF0eXBlX3RyYWNrZXIubGVuZ3RoKSByZXR1cm47XG4gICAgICBpZiAod3JpdHRlbikgeyBzdGF0c19zdHJpbmcgKz0gJ1xcbiAnOyB9XG4gICAgICBzdGF0c19zdHJpbmcgKz0gYCR7dHlwZSB8fCAnTm8gTmFtZSd9OiAke3R5cGVfdHJhY2tlci5sZW5ndGh9YDtcbiAgICAgIHdyaXR0ZW4gPSB0cnVlO1xuICAgIH0pO1xuICAgIHJldHVybiBzdGF0c19zdHJpbmcgfHwgc3VjY2Vzc19tZXNzYWdlO1xuICB9XG5cbiAgLy8gQG5vZG9jXG4gIHJlZ2lzdGVyZWRUcmFja2VyKGtleSkge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5yZWdpc3RlcmVkX3RyYWNrZXIsIGtleSkpIHsgcmV0dXJuIHRoaXMucmVnaXN0ZXJlZF90cmFja2VyW2tleV07IH1cbiAgICBjb25zdCB0eXBlX3RyYWNrZXIgPSBbXTsgdGhpcy5yZWdpc3RlcmVkX3RyYWNrZXJba2V5XSA9IHR5cGVfdHJhY2tlcjtcbiAgICByZXR1cm4gdHlwZV90cmFja2VyO1xuICB9XG5cbiAgc3RhdGljIGV2ZW50c1N0YXRzKG9iaiwga2V5KSB7XG4gICAgY29uc3Qgc3RhdHMgPSB7IGNvdW50OiAwIH07XG4gICAgY29uc3QgZXZlbnRzID0gb2JqLl9ldmVudHMgfHwgb2JqLl9jYWxsYmFja3MgfHwge307XG4gICAgY29uc3Qga2V5cyA9IGtleSA/IFtrZXldIDogXy5rZXlzKGV2ZW50cyk7XG5cbiAgICBfLmVhY2goa2V5cywgKGtleV8pID0+IHtcbiAgICAgIGxldCBub2RlID0gZXZlbnRzW2tleV9dO1xuICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgaWYgKF8uaXNBcnJheShub2RlKSkge1xuICAgICAgICAgIHN0YXRzW2tleV9dID0gXy5jb21wYWN0KG5vZGUpLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB7IHRhaWwgfSA9IG5vZGU7XG4gICAgICAgICAgc3RhdHNba2V5X10gPSAwO1xuICAgICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICAgICAgd2hpbGUgKG5vZGUgIT09IHRhaWwpIHtcbiAgICAgICAgICAgIHN0YXRzW2tleV9dKys7XG4gICAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdGF0cy5jb3VudCArPSBzdGF0c1trZXlfXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc3RhdHM7XG4gIH1cbn1cbiIsIi8qXG4gIGtub2NrYmFjay5qcyAyLjAuMC1hbHBoYS4xXG4gIENvcHlyaWdodCAoYykgIDIwMTEtMjAxNiBLZXZpbiBNYWxha29mZi5cbiAgTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiAgU291cmNlOiBodHRwczovL2dpdGh1Yi5jb20va21hbGFrb2ZmL2tub2NrYmFja1xuICBEZXBlbmRlbmNpZXM6IEtub2Nrb3V0LmpzLCBCYWNrYm9uZS5qcywgYW5kIFVuZGVyc2NvcmUuanMgKG9yIExvRGFzaC5qcykuXG4gIE9wdGlvbmFsIGRlcGVuZGVuY2llczogQmFja2JvbmUuTW9kZWxSZWYuanMgYW5kIEJhY2tib25lT1JNLlxuKi9cblxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQga28gZnJvbSAna25vY2tvdXQnO1xuXG5pbXBvcnQga2IgZnJvbSAnLi9rYic7XG5cbi8vIFVzZWQgdG8gc2hhcmUgYW5kIG1hbmFnZSB0aGUgcGVyc2lzdGVuY2Ugb2YgVmlld01vZGVscyBhbmQgb2JzZXJ2YWJsZXMuIGtzLlN0b3JlIGNhbiBiZSB1c2VkIHRvIGJyZWFrIHJlbGF0aW9uc2hpcCBjeWNsZXMgYmV0d2VlbiBtb2RlbHMsXG4vLyB0byByZWR1Y2UgbWVtb3J5IHVzYWdlLCBhbmQgdG8gc2hhcmUgdmlldyBtb2RlbHMgYmV0d2VlbiBrYi5Db2xsZWN0aW9uT2JzZXJ2YWJsZXMgKGZvciBleGFtcGxlLCB3aGVuIHVzaW5nIEtub2Nrb3V0LmpzIHNlbGVjdGVkT3B0aW9ucykuXG4vL1xuLy8gQGV4YW1wbGUgSG93IHRvIGNyZWF0ZSBhIGtvLkNvbGxlY3Rpb25PYnNlcnZhYmxlIHVzaW5nIHRoZSBrby5jb2xsZWN0aW9uT2JzZXJ2YWJsZSBmYWN0b3J5LlxuLy8gICB2YXIgY28gPSBrYi5jb2xsZWN0aW9uT2JzZXJ2YWJsZShuZXcgQmFja2JvbmUuQ29sbGVjdGlvbigpKTtcbi8vICAgdmFyIGNvX3NlbGVjdGVkX29wdGlvbnMgPSBrYi5jb2xsZWN0aW9uT2JzZXJ2YWJsZShuZXcgQmFja2JvbmUuQ29sbGVjdGlvbigpLCB7XG4vLyAgICAgc3RvcmU6IGtiLnV0aWxzLndyYXBwZWRTdG9yZShjbylcbi8vICAgfSk7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdG9yZSB7XG4gIC8vIEBub2RvY1xuICBzdGF0aWMgaW5zdGFuY2VzID0gW107XG5cbiAgLy8gVXNlZCB0byBlaXRoZXIgcmVnaXN0ZXIgeW91cnNlbGYgd2l0aCB0aGUgZXhpc3Rpbmcgc3RvcmUgb3IgdG8gY3JlYXRlIGEgbmV3IHN0b3JlLlxuICAvL1xuICAvLyBAcGFyYW0gW09iamVjdF0gb3B0aW9ucyBwbGVhc2UgcGFzcyB0aGUgb3B0aW9ucyBmcm9tIHlvdXIgY29uc3RydWN0b3IgdG8gdGhlIHJlZ2lzdGVyIG1ldGhvZC4gRm9yIGV4YW1wbGUsIGNvbnN0cnVjdG9yKG1vZGVsLCBvcHRpb25zKVxuICAvLyBAcGFyYW0gW0luc3RhbmNlXSBvYmogdGhlIGluc3RhbmNlIHRoYXQgd2lsbCBvd24gb3IgcmVnaXN0ZXIgd2l0aCB0aGUgc3RvcmVcbiAgLy8gQHBhcmFtIFtrby5vYnNlcnZhYmxlXSBvYnNlcnZhYmxlIHRoZSBvYnNlcnZhYmxlIHRoYXQgd2lsbCBvd24gdGhlIHN0b3JlXG4gIC8vIEBleGFtcGxlXG4gIC8vICAga2IuU3RvcmUudXNlT3B0aW9uc09yQ3JlYXRlKG1vZGVsLCB0aGlzLCBvcHRpb25zKTtcbiAgc3RhdGljIHVzZU9wdGlvbnNPckNyZWF0ZShvcHRpb25zLCBvYmosIG9ic2VydmFibGUpIHtcbiAgICBpZiAoIW9wdGlvbnMuc3RvcmUpIHsga2IudXRpbHMud3JhcHBlZFN0b3JlSXNPd25lZChvYnNlcnZhYmxlLCB0cnVlKTsgfVxuICAgIGNvbnN0IHN0b3JlID0ga2IudXRpbHMud3JhcHBlZFN0b3JlKG9ic2VydmFibGUsIG9wdGlvbnMuc3RvcmUgfHwgbmV3IGtiLlN0b3JlKCkpO1xuICAgIHN0b3JlLnJldGFpbihvYnNlcnZhYmxlLCBvYmosIG9wdGlvbnMuY3JlYXRvcik7XG4gICAgcmV0dXJuIHN0b3JlO1xuICB9XG5cbiAgLy8gVXNlZCB0byBjcmVhdGUgYSBuZXcga2IuU3RvcmUuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMub2JzZXJ2YWJsZV9yZWNvcmRzID0ge307XG4gICAgdGhpcy5yZXBsYWNlZF9vYnNlcnZhYmxlcyA9IFtdO1xuICAgIGtiLlN0b3JlLmluc3RhbmNlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgLy8gUmVxdWlyZWQgY2xlYW4gdXAgZnVuY3Rpb24gdG8gYnJlYWsgY3ljbGVzLCByZWxlYXNlIHZpZXcgbW9kZWxzLCBldGMuXG4gIC8vIENhbiBiZSBjYWxsZWQgZGlyZWN0bHksIHZpYSBrYi5yZWxlYXNlKG9iamVjdCkgb3IgYXMgYSBjb25zZXF1ZW5jZSBvZiBrby5yZWxlYXNlTm9kZShlbGVtZW50KS5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl9fa2JfcmVsZWFzZWQgPSB0cnVlO1xuICAgIHRoaXMuY2xlYXIoKTtcbiAgICBjb25zdCBpbmRleCA9IF8uaW5kZXhPZihrYi5TdG9yZS5pbnN0YW5jZXMsIHRoaXMpO1xuICAgIGlmICh+aW5kZXgpIGtiLlN0b3JlLmluc3RhbmNlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG5cbiAgLy8gTWFudWFsbHkgY2xlYXIgdGhlIHN0b3JlXG4gIGNsZWFyKCkge1xuICAgIGNvbnN0IG9ic2VydmFibGVfcmVjb3JkcyA9IHRoaXMub2JzZXJ2YWJsZV9yZWNvcmRzO1xuICAgIHRoaXMub2JzZXJ2YWJsZV9yZWNvcmRzID0ge307XG4gICAgXy5lYWNoKG9ic2VydmFibGVfcmVjb3JkcywgKHJlY29yZHMpID0+IHtcbiAgICAgIF8uZWFjaChyZWNvcmRzLCBvYnNlcnZhYmxlID0+IHRoaXMucmVsZWFzZShvYnNlcnZhYmxlLCB0cnVlKSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCByZXBsYWNlZF9vYnNlcnZhYmxlcyA9IHRoaXMucmVwbGFjZWRfb2JzZXJ2YWJsZXM7XG4gICAgdGhpcy5yZXBsYWNlZF9vYnNlcnZhYmxlcyA9IFtdO1xuICAgIF8uZWFjaChyZXBsYWNlZF9vYnNlcnZhYmxlcywgKG9ic2VydmFibGUpID0+IHtcbiAgICAgIGlmICghb2JzZXJ2YWJsZS5fX2tiX3JlbGVhc2VkKSB0aGlzLnJlbGVhc2Uob2JzZXJ2YWJsZSwgdHJ1ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBNYW51YWxseSBjb21wYWN0IHRoZSBzdG9yZSBieSBzZWFyY2hpbmcgZm9yIHJlbGVhc2VkIHZpZXcgbW9kZWxzXG4gIGNvbXBhY3QoKSB7XG4gICAgXy5lYWNoKHRoaXMub2JzZXJ2YWJsZV9yZWNvcmRzLCAocmVjb3JkcykgPT4ge1xuICAgICAgXy5lYWNoKHJlY29yZHMsIChvYnNlcnZhYmxlLCBjaWQpID0+IHtcbiAgICAgICAgaWYgKG9ic2VydmFibGUuX19rYl9yZWxlYXNlZCkgZGVsZXRlIHJlY29yZHNbY2lkXTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gVXNlZCB0byByZWdpc3RlciBhIG5ldyB2aWV3IG1vZGVsIHdpdGggdGhlIHN0b3JlLlxuICAvL1xuICAvLyBAcGFyYW0gW01vZGVsXSBvYmogdGhlIE1vZGVsXG4gIC8vIEBwYXJhbSBba28ub2JzZXJ2YWJsZV0gb2JzZXJ2YWJsZSB0aGUgb2JzZXJ2YWJsZSB0byBzaGFyZSBmb3IgdGhlIE1vZGVsXG4gIC8vIEBwYXJhbSBbT2JqZWN0XSBvcHRpb25zIHBsZWFzZSBwYXNzIHRoZSBvcHRpb25zIGZyb20geW91ciBjb25zdHJ1Y3RvciB0byB0aGUgcmVnaXN0ZXIgbWV0aG9kLiBGb3IgZXhhbXBsZSwgY29uc3RydWN0b3IobW9kZWwsIG9wdGlvbnMpXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbQ29uc3RydWN0b3J8RnVuY3Rpb25dIGNyZWF0b3IgdGhlIGNvbnN0cnVjdG9yIG9yIGZ1bmN0aW9uIHVzZWQgdG8gY3JlYXRlIHRoZSBvYnNlcnZhYmxlLiBJdCBpcyB1c2VkIHRvIG1hdGNoIG9ic2VydmFibGVzIGluIHRoZSBzdG9yZS5cbiAgLy8gQG9wdGlvbiBvcHRpb25zIFtTdHJpbmddIHBhdGggdGhlIHBhdGggdG8gdGhlIHZhbHVlICh1c2VkIHRvIGNyZWF0ZSByZWxhdGVkIG9ic2VydmFibGVzIGZyb20gdGhlIGZhY3RvcnkpLlxuICAvLyBAb3B0aW9uIG9wdGlvbnMgW2tiLlN0b3JlXSBzdG9yZSBhIHN0b3JlIHVzZWQgdG8gY2FjaGUgYW5kIHNoYXJlIHZpZXcgbW9kZWxzLlxuICAvLyBAb3B0aW9uIG9wdGlvbnMgW2tiLkZhY3RvcnldIGZhY3RvcnkgYSBmYWN0b3J5IHVzZWQgdG8gY3JlYXRlIHZpZXcgbW9kZWxzLlxuICAvL1xuICAvLyBAZXhhbXBsZSByZXRhaW4gYW4gb2JzZXJ2YWJsZSB3aXRoIHRoZSBzdG9yZVxuICAvLyAgIHN0b3JlLnJldGFpbihvYnNlcnZhYmxlLCBvYmosIGNyZWF0b3IpO1xuICByZXRhaW4ob2JzZXJ2YWJsZSwgb2JqLCBjcmVhdG9yKSB7XG4gICAgaWYgKCF0aGlzLl9jYW5SZWdpc3RlcihvYnNlcnZhYmxlKSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBpZiAoIWNyZWF0b3IpIHsgY3JlYXRvciA9IG9ic2VydmFibGUuY29uc3RydWN0b3I7IH0gLy8gZGVmYXVsdCBpcyB0byB1c2UgdGhlIGNvbnN0cnVjdG9yXG5cbiAgICBjb25zdCBjdXJyZW50X29ic2VydmFibGUgPSB0aGlzLmZpbmQob2JqLCBjcmVhdG9yKTtcbiAgICBpZiAoY3VycmVudF9vYnNlcnZhYmxlKSB7XG4gICAgICBpZiAoY3VycmVudF9vYnNlcnZhYmxlID09PSBvYnNlcnZhYmxlKSB7IC8vIGFscmVhZHkgaW4gdGhpcyBzdG9yZVxuICAgICAgICB0aGlzLl9nZXRPckNyZWF0ZVN0b3JlUmVmZXJlbmNlcyhvYnNlcnZhYmxlKS5yZWZfY291bnQrKztcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGU7XG4gICAgICB9XG4gICAgICB0aGlzLl9yZXRpcmUoY3VycmVudF9vYnNlcnZhYmxlKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hZGQob2JzZXJ2YWJsZSwgb2JqLCBjcmVhdG9yKTtcbiAgICB0aGlzLl9nZXRPckNyZWF0ZVN0b3JlUmVmZXJlbmNlcyhvYnNlcnZhYmxlKS5yZWZfY291bnQrKztcbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgfVxuXG4gIC8vIFVzZWQgdG8gZmluZCBhbiBleGlzdGluZyBvYnNlcnZhYmxlIGluIHRoZSBzdG9yZSBvciBjcmVhdGUgYSBuZXcgb25lIGlmIGl0IGRvZXNuJ3QgZXhpc3QuXG4gIC8vXG4gIC8vIEBwYXJhbSBbTW9kZWx8Q29sbGVjdGlvbnxEYXRhXSBvYmogdGhlIG9iamVjdCB0byBjcmVhdGUgdGhlIG9ic2VydmFibGUgZm9yLiBPbmx5IE1vZGVscyBhcmUgY2FjaGVkIGluIHRoZSBzdG9yZS5cbiAgLy8gQHBhcmFtIFtPYmplY3RdIG9wdGlvbnMgcGxlYXNlIHBhc3MgdGhlIG9wdGlvbnMgZnJvbSB5b3VyIGNvbnN0cnVjdG9yIHRvIHRoZSByZWdpc3RlciBtZXRob2QuIEZvciBleGFtcGxlLCBjb25zdHJ1Y3Rvcihtb2RlbCwgb3B0aW9ucylcbiAgLy8gQHBhcmFtIFtib29sZWFuXSBkZWVwX3JldGFpbiBzZXR0aW5nIHRvIHRydWUgcmV0YWlucyBhbiBleGlzdGluZyBvYnNlcnZhYmxlIHdoZW4gZm91bmQuXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbQ29uc3RydWN0b3J8RnVuY3Rpb25dIGNyZWF0b3IgdGhlIGNvbnN0cnVjdG9yIG9yIGZ1bmN0aW9uIHVzZWQgdG8gY3JlYXRlIHRoZSBvYnNlcnZhYmxlLiBJdCBpcyB1c2VkIHRvIG1hdGNoIG9ic2VydmFibGVzIGluIHRoZSBzdG9yZS5cbiAgLy8gQG9wdGlvbiBvcHRpb25zIFtTdHJpbmddIHBhdGggdGhlIHBhdGggdG8gdGhlIHZhbHVlICh1c2VkIHRvIGNyZWF0ZSByZWxhdGVkIG9ic2VydmFibGVzIGZyb20gdGhlIGZhY3RvcnkpLlxuICAvLyBAb3B0aW9uIG9wdGlvbnMgW2tiLlN0b3JlXSBzdG9yZSBhIHN0b3JlIHVzZWQgdG8gY2FjaGUgYW5kIHNoYXJlIHZpZXcgbW9kZWxzLlxuICAvLyBAb3B0aW9uIG9wdGlvbnMgW2tiLkZhY3RvcnldIGZhY3RvcnkgYSBmYWN0b3J5IHVzZWQgdG8gY3JlYXRlIHZpZXcgbW9kZWxzLlxuICAvL1xuICAvLyBAZXhhbXBsZSByZWdpc3RlciBhbiBvYnNlcnZhYmxlIHdpdGggdGhlIHN0b3JlXG4gIC8vICAgb2JzZXJ2YWJsZSA9IHN0b3JlLnJldGFpbk9yQ3JlYXRlKHZhbHVlLCB7cGF0aDoga2IudXRpbHMud3JhcHBlZFBhdGgob2JzZXJ2YWJsZSksIGZhY3Rvcnk6IGtiLnV0aWxzLndyYXBwZWRGYWN0b3J5KG9ic2VydmFibGUpfSlcbiAgcmV0YWluT3JDcmVhdGUob2JqLCBvcHRpb25zLCBkZWVwX3JldGFpbikge1xuICAgIGNvbnN0IGNyZWF0b3IgPSB0aGlzLl9jcmVhdG9yKG9iaiwgb3B0aW9ucyk7XG4gICAgaWYgKCFjcmVhdG9yKSByZXR1cm4ga2IudXRpbHMuY3JlYXRlRnJvbURlZmF1bHRDcmVhdG9yKG9iaiwgb3B0aW9ucyk7XG4gICAgaWYgKGNyZWF0b3IubW9kZWxzX29ubHkpIHJldHVybiBvYmo7XG5cbiAgICBsZXQgb2JzZXJ2YWJsZSA9IHRoaXMuZmluZChvYmosIGNyZWF0b3IpO1xuICAgIGlmIChvYnNlcnZhYmxlKSB7XG4gICAgICByZXR1cm4gKGRlZXBfcmV0YWluICYmIGtiLnNldHRpbmdzLmRlZXBfcmV0YWluID8gdGhpcy5yZXRhaW4ob2JzZXJ2YWJsZSwgb2JqLCBjcmVhdG9yKSA6IG9ic2VydmFibGUpO1xuICAgIH1cbiAgICBpZiAoIV8uaXNGdW5jdGlvbihjcmVhdG9yLmNyZWF0ZSB8fCBjcmVhdG9yKSkgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGZhY3RvcnkgZm9yIFwiJHtvcHRpb25zLnBhdGh9XCJgKTtcblxuICAgIG9ic2VydmFibGUgPSBrYi5pZ25vcmUoKCkgPT4ge1xuICAgICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMoeyBzdG9yZTogdGhpcywgY3JlYXRvciB9LCBvcHRpb25zKTsgLy8gc2V0IG91ciBvd24gY3JlYXRvciBzbyB3ZSBjYW4gcmVnaXN0ZXIgb3Vyc2VsdmVzIGFib3ZlXG4gICAgICBvYnNlcnZhYmxlID0gY3JlYXRvci5jcmVhdGUgPyBjcmVhdG9yLmNyZWF0ZShvYmosIG9wdGlvbnMpIDogbmV3IGNyZWF0b3Iob2JqLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiBvYnNlcnZhYmxlIHx8IGtvLm9ic2VydmFibGUobnVsbCk7XG4gICAgfSk7IC8vIGRlZmF1bHQgdG8gbnVsbFxuXG4gICAgdGhpcy5yZXRhaW4ob2JzZXJ2YWJsZSwgb2JqLCBjcmVhdG9yKTtcbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgfVxuXG4gIC8vIEBub2RvY1xuICByZXVzZShvYnNlcnZhYmxlLCBvYmopIHtcbiAgICBjb25zdCBjdXJyZW50X29iaiA9IGtiLnV0aWxzLndyYXBwZWRPYmplY3Qob2JzZXJ2YWJsZSk7XG4gICAgaWYgKGN1cnJlbnRfb2JqID09PSBvYmopIHJldHVybjtcbiAgICBpZiAoIXRoaXMuX2NhblJlZ2lzdGVyKG9ic2VydmFibGUpKSB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCByZXVzZSBhIHNpbXBsZSBvYnNlcnZhYmxlJyk7XG4gICAgaWYgKHRoaXMuX3JlZkNvdW50KG9ic2VydmFibGUpICE9PSAxKSB0aHJvdyBuZXcgRXJyb3IoYFRyeWluZyB0byBjaGFuZ2UgYSBzaGFyZWQgdmlldyBtb2RlbC4gUmVmIGNvdW50OiAke3RoaXMuX3JlZkNvdW50KG9ic2VydmFibGUpfWApO1xuXG4gICAgY29uc3QgY3JlYXRvciA9IGtiLnV0aWxzLndyYXBwZWRDcmVhdG9yKG9ic2VydmFibGUpIHx8IG9ic2VydmFibGUuY29uc3RydWN0b3I7IC8vIGRlZmF1bHQgaXMgdG8gdXNlIHRoZSBjb25zdHJ1Y3RvclxuICAgIGxldCBjdXJyZW50X29ic2VydmFibGU7XG4gICAgaWYgKCFfLmlzVW5kZWZpbmVkKGN1cnJlbnRfb2JqKSkgY3VycmVudF9vYnNlcnZhYmxlID0gdGhpcy5maW5kKGN1cnJlbnRfb2JqLCBjcmVhdG9yKTtcbiAgICB0aGlzLnJldGFpbihvYnNlcnZhYmxlLCBvYmosIGNyZWF0b3IpO1xuICAgIGlmIChjdXJyZW50X29ic2VydmFibGUpIHRoaXMucmVsZWFzZShjdXJyZW50X29ic2VydmFibGUpO1xuICB9XG5cbiAgLy8gUmVsZWFzZSBhIHJlZmVyZW5jZSB0byBhIGEgVmlld01vZGVsIGluIHRoaXMgc3RvcmUuXG4gIHJlbGVhc2Uob2JzZXJ2YWJsZSwgZm9yY2UpIHtcbiAgICBpZiAoIXRoaXMuX2NhblJlZ2lzdGVyKG9ic2VydmFibGUpKSByZXR1cm4ga2IucmVsZWFzZShvYnNlcnZhYmxlKTsgLy8ganVzdCByZWxlYXNlXG5cbiAgICAvLyBtYXliZSBiZSBleHRlcm5hbGx5IGFkZGVkXG4gICAgY29uc3Qgc3RvcmVfcmVmZXJlbmNlcyA9IHRoaXMuX3N0b3JlUmVmZXJlbmNlcyhvYnNlcnZhYmxlKTtcbiAgICBpZiAoc3RvcmVfcmVmZXJlbmNlcykge1xuICAgICAgaWYgKCFmb3JjZSAmJiAoLS1zdG9yZV9yZWZlcmVuY2VzLnJlZl9jb3VudCA+IDApKSByZXR1cm4gdW5kZWZpbmVkOyAvLyBkbyBub3QgcmVsZWFzZSB5ZXRcbiAgICAgIHRoaXMuX2NsZWFyU3RvcmVSZWZlcmVuY2VzKG9ic2VydmFibGUpO1xuICAgIH1cblxuICAgIHRoaXMuX3JlbW92ZShvYnNlcnZhYmxlKTtcbiAgICBpZiAob2JzZXJ2YWJsZS5fX2tiX3JlbGVhc2VkKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGlmIChmb3JjZSB8fCAodGhpcy5fcmVmQ291bnQob2JzZXJ2YWJsZSkgPD0gMSkpIHJldHVybiBrYi5yZWxlYXNlKG9ic2VydmFibGUpOyAvLyBhbGxvdyBmb3IgYSBzaW5nbGUgaW5pdGlhbCByZWZlcmVuY2UgaW4gYW5vdGhlciBzdG9yZVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvLyBAbm9kb2NcbiAgZmluZChvYmosIGNyZWF0b3IpIHtcbiAgICBjb25zdCByZWNvcmRzID0gdGhpcy5vYnNlcnZhYmxlX3JlY29yZHNbdGhpcy5fY3JlYXRvcklkKGNyZWF0b3IpXTtcbiAgICBpZiAoIXJlY29yZHMpIHJldHVybiBudWxsO1xuXG4gICAgY29uc3Qgb2JzZXJ2YWJsZSA9IHJlY29yZHNbdGhpcy5fY2lkKG9iaildO1xuICAgIGlmIChvYnNlcnZhYmxlICYmIG9ic2VydmFibGUuX19rYl9yZWxlYXNlZCkge1xuICAgICAgZGVsZXRlIHJlY29yZHNbdGhpcy5fY2lkKG9iaildO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9XG5cbiAgLy8gQG5vZG9jXG4gIF9yZWZDb3VudChvYnNlcnZhYmxlKSB7XG4gICAgaWYgKG9ic2VydmFibGUuX19rYl9yZWxlYXNlZCkge1xuICAgICAgKHR5cGVvZiBjb25zb2xlID09PSAndW5kZWZpbmVkJykgfHwgY29uc29sZS5sb2coJ09ic2VydmFibGUgYWxyZWFkeSByZWxlYXNlZCcpO1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGNvbnN0IHN0b3Jlc19yZWZlcmVuY2VzID0ga2IudXRpbHMuZ2V0KG9ic2VydmFibGUsICdzdG9yZXNfcmVmZXJlbmNlcycpO1xuICAgIGlmICghc3RvcmVzX3JlZmVyZW5jZXMpIHJldHVybiAxO1xuICAgIHJldHVybiBfLnJlZHVjZShzdG9yZXNfcmVmZXJlbmNlcywgKChtZW1vLCBzdG9yZV9yZWZlcmVuY2VzKSA9PiBtZW1vICsgc3RvcmVfcmVmZXJlbmNlcy5yZWZfY291bnQpLCAwKTtcbiAgfVxuXG4gIC8vIEBub2RvY1xuICBfY2FuUmVnaXN0ZXIob2JzZXJ2YWJsZSkgeyByZXR1cm4gb2JzZXJ2YWJsZSAmJiAha28uaXNPYnNlcnZhYmxlKG9ic2VydmFibGUpICYmICFvYnNlcnZhYmxlLl9fa2JfaXNfY287IH0gLy8gb25seSByZWdpc3RlciB2aWV3IG1vZGVscyBub3QgYmFzaWMga28ub2JzZXJ2YWJsZXMgbm9yIGtiLkNvbGxlY3Rpb25PYnNlcnZhYmxlc1xuXG4gIC8vIEBub2RvY1xuICBfY2lkKG9iaikge1xuICAgIGlmICghb2JqKSByZXR1cm4gJ251bGwnO1xuICAgIGlmICghb2JqLmNpZCkgb2JqLmNpZCA9IF8udW5pcXVlSWQoJ2MnKTtcbiAgICByZXR1cm4gb2JqLmNpZDtcbiAgfVxuXG4gIC8vIEBub2RvY1xuICBfY3JlYXRvcklkKGNyZWF0b3IpIHtcbiAgICBjb25zdCBjcmVhdGUgPSBjcmVhdG9yLmNyZWF0ZSB8fCBjcmVhdG9yO1xuICAgIGlmICghY3JlYXRlLl9fa2JfY2lkcykgeyBjcmVhdGUuX19rYl9jaWRzID0gW107IH1cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IGNyZWF0ZS5fX2tiX2NpZHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtID0gY3JlYXRlLl9fa2JfY2lkc1tpXTtcbiAgICAgIGlmIChpdGVtLmNyZWF0ZSA9PT0gY3JlYXRlKSByZXR1cm4gaXRlbS5jaWQ7XG4gICAgfVxuICAgIGNvbnN0IGl0ZW0gPSB7IGNyZWF0ZSwgY2lkOiBfLnVuaXF1ZUlkKCdrYicpIH07XG4gICAgY3JlYXRlLl9fa2JfY2lkcy5wdXNoKGl0ZW0pO1xuICAgIHJldHVybiBpdGVtLmNpZDtcbiAgfVxuXG4gIC8vIEBub2RvY1xuICBfc3RvcmVSZWZlcmVuY2VzKG9ic2VydmFibGUpIHtcbiAgICBjb25zdCBzdG9yZXNfcmVmZXJlbmNlcyA9IGtiLnV0aWxzLmdldChvYnNlcnZhYmxlLCAnc3RvcmVzX3JlZmVyZW5jZXMnKTtcbiAgICBpZiAoIXN0b3Jlc19yZWZlcmVuY2VzKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIF8uZmluZChzdG9yZXNfcmVmZXJlbmNlcywgcmVmID0+IHJlZi5zdG9yZSA9PT0gdGhpcyk7XG4gIH1cblxuICAvLyBAbm9kb2NcbiAgX2dldE9yQ3JlYXRlU3RvcmVSZWZlcmVuY2VzKG9ic2VydmFibGUpIHtcbiAgICBjb25zdCBzdG9yZXNfcmVmZXJlbmNlcyA9IGtiLnV0aWxzLm9yU2V0KG9ic2VydmFibGUsICdzdG9yZXNfcmVmZXJlbmNlcycsIFtdKTtcblxuICAgIGxldCByZWYgPSBfLmZpbmQoc3RvcmVzX3JlZmVyZW5jZXMsIHggPT4geC5zdG9yZSA9PT0gdGhpcyk7XG4gICAgaWYgKCFyZWYpIHN0b3Jlc19yZWZlcmVuY2VzLnB1c2gocmVmID0geyBzdG9yZTogdGhpcywgcmVmX2NvdW50OiAwLCByZWxlYXNlOiAoKSA9PiB0aGlzLnJlbGVhc2Uob2JzZXJ2YWJsZSkgfSk7XG4gICAgcmV0dXJuIHJlZjtcbiAgfVxuXG4gIC8vIEBub2RvY1xuICBfY2xlYXJTdG9yZVJlZmVyZW5jZXMob2JzZXJ2YWJsZSkge1xuICAgIGNvbnN0IHN0b3Jlc19yZWZlcmVuY2VzID0ga2IudXRpbHMub3JTZXQob2JzZXJ2YWJsZSwgJ3N0b3Jlc19yZWZlcmVuY2VzJywgW10pO1xuICAgIGlmICghc3RvcmVzX3JlZmVyZW5jZXMpIHJldHVybjtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gb2JzZXJ2YWJsZS5fX2tiLnN0b3Jlc19yZWZlcmVuY2VzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgcmVmID0gb2JzZXJ2YWJsZS5fX2tiLnN0b3Jlc19yZWZlcmVuY2VzW2ldO1xuICAgICAgaWYgKHJlZi5zdG9yZSA9PT0gdGhpcykge1xuICAgICAgICBvYnNlcnZhYmxlLl9fa2Iuc3RvcmVzX3JlZmVyZW5jZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBAbm9kb2NcbiAgX3JldGlyZShvYnNlcnZhYmxlKSB7IHRoaXMuX2NsZWFyU3RvcmVSZWZlcmVuY2VzKG9ic2VydmFibGUpOyB0aGlzLnJlcGxhY2VkX29ic2VydmFibGVzLnB1c2gob2JzZXJ2YWJsZSk7IHJldHVybiB0aGlzLl9yZW1vdmUob2JzZXJ2YWJsZSk7IH1cblxuICAvLyBAbm9kb2NcbiAgX2FkZChvYnNlcnZhYmxlLCBvYmosIGNyZWF0b3IpIHtcbiAgICBpZiAoIWNyZWF0b3IpIGNyZWF0b3IgPSBvYnNlcnZhYmxlLmNvbnN0cnVjdG9yOyAvLyBkZWZhdWx0IGlzIHRvIHVzZSB0aGUgY29uc3RydWN0b3JcbiAgICBrYi51dGlscy53cmFwcGVkT2JqZWN0KG9ic2VydmFibGUsIG9iaik7IGtiLnV0aWxzLndyYXBwZWRDcmVhdG9yKG9ic2VydmFibGUsIGNyZWF0b3IpO1xuXG4gICAgY29uc3QgbmFtZSA9IHRoaXMuX2NyZWF0b3JJZChjcmVhdG9yKTtcbiAgICBpZiAoIXRoaXMub2JzZXJ2YWJsZV9yZWNvcmRzW25hbWVdKSB0aGlzLm9ic2VydmFibGVfcmVjb3Jkc1tuYW1lXSA9IHt9O1xuICAgIHRoaXMub2JzZXJ2YWJsZV9yZWNvcmRzW25hbWVdW3RoaXMuX2NpZChvYmopXSA9IG9ic2VydmFibGU7XG4gICAgcmV0dXJuIG9ic2VydmFibGU7XG4gIH1cblxuICAvLyBAbm9kb2NcbiAgX3JlbW92ZShvYnNlcnZhYmxlKSB7XG4gICAgY29uc3QgY3JlYXRvciA9IGtiLnV0aWxzLndyYXBwZWRDcmVhdG9yKG9ic2VydmFibGUpIHx8IG9ic2VydmFibGUuY29uc3RydWN0b3I7IC8vIGRlZmF1bHQgaXMgdG8gdXNlIHRoZSBjb25zdHJ1Y3RvclxuICAgIGNvbnN0IG9iaiA9IGtiLnV0aWxzLndyYXBwZWRPYmplY3Qob2JzZXJ2YWJsZSk7XG4gICAgY29uc3QgY3VycmVudF9vYnNlcnZhYmxlID0gdGhpcy5maW5kKG9iaiwgY3JlYXRvcik7XG5cbiAgICAvLyBhbHJlYWR5IHJlbGVhc2VkXG4gICAgaWYgKGN1cnJlbnRfb2JzZXJ2YWJsZSAmJiAoY3VycmVudF9vYnNlcnZhYmxlID09PSBvYnNlcnZhYmxlKSkge1xuICAgICAgZGVsZXRlIHRoaXMub2JzZXJ2YWJsZV9yZWNvcmRzW3RoaXMuX2NyZWF0b3JJZChjcmVhdG9yKV1bdGhpcy5fY2lkKG9iaildOyAvLyBub3QgYWxyZWFkeSByZXBsYWNlZFxuICAgIH1cbiAgICBrYi51dGlscy53cmFwcGVkT2JqZWN0KG9ic2VydmFibGUsIG51bGwpO1xuICAgIHJldHVybiBrYi51dGlscy53cmFwcGVkQ3JlYXRvcihvYnNlcnZhYmxlLCBudWxsKTtcbiAgfVxuXG4gIC8vIEBub2RvY1xuICBfY3JlYXRvcihvYmosIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5jcmVhdG9yKSByZXR1cm4gb3B0aW9ucy5jcmVhdG9yO1xuICAgIGNvbnN0IGNyZWF0b3IgPSBrYi51dGlscy5pbmZlckNyZWF0b3Iob2JqLCBvcHRpb25zLmZhY3RvcnksIG9wdGlvbnMucGF0aCk7XG4gICAgaWYgKGNyZWF0b3IpIHJldHVybiBjcmVhdG9yO1xuICAgIGlmIChrYi5pc01vZGVsKG9iaikpIHJldHVybiBrYi5WaWV3TW9kZWw7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuIiwiLypcbiAga25vY2tiYWNrLmpzIDIuMC4wLWFscGhhLjFcbiAgQ29weXJpZ2h0IChjKSAgMjAxMS0yMDE2IEtldmluIE1hbGFrb2ZmLlxuICBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuICBTb3VyY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9rbWFsYWtvZmYva25vY2tiYWNrXG4gIERlcGVuZGVuY2llczogS25vY2tvdXQuanMsIEJhY2tib25lLmpzLCBhbmQgVW5kZXJzY29yZS5qcyAob3IgTG9EYXNoLmpzKS5cbiAgT3B0aW9uYWwgZGVwZW5kZW5jaWVzOiBCYWNrYm9uZS5Nb2RlbFJlZi5qcyBhbmQgQmFja2JvbmVPUk0uXG4qL1xuXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCBCYWNrYm9uZSBmcm9tICdiYWNrYm9uZSc7XG5pbXBvcnQga28gZnJvbSAna25vY2tvdXQnO1xuXG5pbXBvcnQga2IgZnJvbSAnLi9rYic7XG5pbXBvcnQgd3JhcHBlZERlc3Ryb3kgZnJvbSAnLi9mdW5jdGlvbnMvd3JhcHBlZC1kZXN0cm95JztcbmltcG9ydCBjb2xsYXBzZU9wdGlvbnMgZnJvbSAnLi9mdW5jdGlvbnMvY29sbGFwc2Utb3B0aW9ucyc7XG5pbXBvcnQgdW53cmFwTW9kZWxzIGZyb20gJy4vZnVuY3Rpb25zL3Vud3JhcC1tb2RlbHMnO1xuXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbi8vIFB1YmxpYyBBUElcbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4vLyBMaWJyYXJ5IG9mIGdlbmVyYWwtcHVycG9zZSB1dGlsaXRpZXNcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHV0aWxzIHtcbiAgLy8gQ2xlYW4gdXAgZnVuY3Rpb24gdGhhdCByZWxlYXNlcyBhbGwgb2YgdGhlIHdyYXBwZWQgdmFsdWVzIG9uIGFuIG93bmVyLlxuICBzdGF0aWMgd3JhcHBlZERlc3Ryb3kgPSB3cmFwcGVkRGVzdHJveTtcblxuICAvLyBIZWxwZXIgdG8gbWVyZ2Ugb3B0aW9ucyBpbmNsdWRpbmcgVmlld21Nb2RlbCBvcHRpb25zIGxpa2UgYGtleXNgIGFuZCBgZmFjdG9yaWVzYFxuICAvL1xuICAvLyBAcGFyYW0gW09iamVjdF0gb2JqIHRoZSBvYmplY3QgdG8gdGVzdFxuICAvL1xuICAvLyBAZXhhbXBsZVxuICAvLyAgIGtiLnV0aWxzLmNvbGxhcHNlT3B0aW9ucyhvcHRpb25zKTtcbiAgc3RhdGljIGNvbGxhcHNlT3B0aW9ucyA9IGNvbGxhcHNlT3B0aW9ucztcblxuICAvLyB1c2VkIGZvciBhdHRyaWJ1dGUgc2V0dGluZyB0byBlbnN1cmUgYWxsIG1vZGVsIGF0dHJpYnV0ZXMgaGF2ZSB0aGVpciB1bmRlcmx5aW5nIG1vZGVsc1xuICBzdGF0aWMgdW53cmFwTW9kZWxzID0gdW53cmFwTW9kZWxzO1xuXG4gIC8vIEBub2RvY1xuICBzdGF0aWMgZ2V0KG9iaiwga2V5LCBkZWZhdWx0X3ZhbHVlKSB7XG4gICAgcmV0dXJuICghb2JqLl9fa2IgfHwgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmouX19rYiwga2V5KSkgPyBkZWZhdWx0X3ZhbHVlIDogb2JqLl9fa2Jba2V5XTtcbiAgfVxuXG4gIC8vIEBub2RvY1xuICBzdGF0aWMgc2V0KG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIChvYmouX19rYiB8fCAob2JqLl9fa2IgPSB7fSkpW2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvLyBAbm9kb2NcbiAgc3RhdGljIG9yU2V0KG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIGlmICghb2JqLl9fa2IpIG9iai5fX2tiID0ge307XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLl9fa2IsIGtleSkpIG9iai5fX2tiW2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gb2JqLl9fa2Jba2V5XTtcbiAgfVxuXG4gIC8vIEBub2RvY1xuICBzdGF0aWMgaGFzKG9iaiwga2V5KSB7IHJldHVybiBvYmouX19rYiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLl9fa2IsIGtleSk7IH1cblxuICAvLyBEdWFsLXB1cnBvc2UgZ2V0dGVyL3NldHRlciBmb3IgcmV0cmlldmluZyBhbmQgc3RvcmluZyB0aGUgb2JzZXJ2YWJsZSBvbiBhbiBpbnN0YW5jZSB0aGF0IHJldHVybnMgYSBrby5vYnNlcnZhYmxlIGluc3RlYWQgb2YgJ3RoaXMnLiBSZWxldmFudCBmb3I6XG4gIC8vXG4gIC8vICAgKiBba2IuQ29sbGVjdGlvbk9ic2VydmFibGVdKCdjbGFzc2VzL2tiL0NvbGxlY3Rpb25PYnNlcnZhYmxlLmh0bWwnKVxuICAvLyAgICogW2tiLk9ic2VydmFibGVdKCdjbGFzc2VzL2tiL09ic2VydmFibGUuaHRtbCcpXG4gIC8vICAgKiBba2IuRGVmYXVsdE9ic2VydmFibGVdKCdjbGFzc2VzL2tiL0RlZmF1bHRPYnNlcnZhYmxlLmh0bWwnKVxuICAvLyAgICogW2tiLkZvcm1hdHRlZE9ic2VydmFibGVdKCdjbGFzc2VzL2tiL0Zvcm1hdHRlZE9ic2VydmFibGUuaHRtbCcpXG4gIC8vICAgKiBba2IuTG9jYWxpemVkT2JzZXJ2YWJsZV0oJ2NsYXNzZXMva2IvTG9jYWxpemVkT2JzZXJ2YWJsZS5odG1sJylcbiAgLy8gICAqIFtrYi5UcmlnZ2VyZWRPYnNlcnZhYmxlXSgnY2xhc3Nlcy9rYi9UcmlnZ2VyZWRPYnNlcnZhYmxlLmh0bWwnKVxuICAvL1xuICAvLyBAb3ZlcmxvYWQgd3JhcHBlZE9ic2VydmFibGUoaW5zdGFuY2UpXG4gIC8vICAgR2V0cyB0aGUgb2JzZXJ2YWJsZSBmcm9tIGFuIG9iamVjdFxuICAvLyAgIEBwYXJhbSBbQW55XSBpbnN0YW5jZSB0aGUgb3duZXJcbiAgLy8gICBAcmV0dXJuIFtrby5vYnNlcnZhYmxlfGtvLm9ic2VydmFibGVBcnJheV0gdGhlIG9ic2VydmFibGVcbiAgLy8gQG92ZXJsb2FkIHdyYXBwZWRPYnNlcnZhYmxlKGluc3RhbmNlLCBvYnNlcnZhYmxlKVxuICAvLyAgIFNldHMgdGhlIG9ic2VydmFibGUgb24gYW4gb2JqZWN0XG4gIC8vICAgQHBhcmFtIFtBbnldIGluc3RhbmNlIHRoZSBvd25lclxuICAvLyAgIEBwYXJhbSBba28ub2JzZXJ2YWJsZXxrby5vYnNlcnZhYmxlQXJyYXldIG9ic2VydmFibGUgdGhlIG9ic2VydmFibGVcbiAgLy9cbiAgLy8gQGV4YW1wbGVcbiAgLy8gICB2YXIgU2hvcnREYXRlTG9jYWxpemVyID0ga2IuTG9jYWxpemVkT2JzZXJ2YWJsZS5leHRlbmQoe1xuICAvLyAgICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zLCB2aWV3X21vZGVsKSB7XG4gIC8vICAgICAgIGtiLkxvY2FsaXplZE9ic2VydmFibGUucHJvdG90eXBlLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIC8vICAgICAgIHJldHVybiBrYi51dGlscy53cmFwcGVkT2JzZXJ2YWJsZSh0aGlzKTtcbiAgLy8gICAgIH1cbiAgLy8gICB9KTtcbiAgc3RhdGljIHdyYXBwZWRPYnNlcnZhYmxlKG9iaiwgdmFsdWUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGtiLnV0aWxzLmdldChvYmosICdvYnNlcnZhYmxlJyk7XG4gICAgcmV0dXJuIGtiLnV0aWxzLnNldChvYmosICdvYnNlcnZhYmxlJywgdmFsdWUpO1xuICB9XG5cbiAgLy8gRHVhbC1wdXJwb3NlIGdldHRlci9zZXR0ZXIgZm9yIHJldHJpZXZpbmcgYW5kIHN0b3JpbmcgdGhlIE1vZGVsIG9yIENvbGxlY3Rpb24gb24gYW4gb3duZXIuXG4gIC8vIEBub3RlIHRoaXMgaXMgYWxtb3N0IHRoZSBzYW1lIGFzIHtrYi51dGlscy53cmFwcGVkTW9kZWx9IGV4Y2VwdCB0aGF0IGlmIHRoZSBNb2RlbCBkb2Vzbid0IGV4aXN0LCBpdCByZXR1cm5zIG51bGwuXG4gIC8vXG4gIC8vIEBvdmVybG9hZCB3cmFwcGVkT2JqZWN0KG9iailcbiAgLy8gICBHZXRzIHRoZSBvYnNlcnZhYmxlIGZyb20gYW4gb2JqZWN0XG4gIC8vICAgQHBhcmFtIFtPYmplY3R8a2IuVmlld01vZGVsfGtiLkNvbGxlY3Rpb25PYnNlcnZhYmxlXSBvYmogb3duZXIgdGhlIFZpZXdNb2RlbC9Db2xsZWN0aW9uT2JzZXJ2YWJsZSBvd25pbmcgdGhlIEJhY2tib25lLk1vZGVsIG9yIEJhY2tib25lLkNvbGxlY3Rpb24uXG4gIC8vICAgQHJldHVybiBbTW9kZWx8Q29sbGVjdGlvbl0gdGhlIG1vZGVsL2NvbGxlY3Rpb25cbiAgLy8gQG92ZXJsb2FkIHdyYXBwZWRPYmplY3Qob2JqLCB2YWx1ZSlcbiAgLy8gICBTZXRzIHRoZSBvYnNlcnZhYmxlIG9uIGFuIG9iamVjdFxuICAvLyAgIEBwYXJhbSBbT2JqZWN0fGtiLlZpZXdNb2RlbHxrYi5Db2xsZWN0aW9uT2JzZXJ2YWJsZV0gb2JqIG93bmVyIHRoZSBWaWV3TW9kZWwvQ29sbGVjdGlvbk9ic2VydmFibGUgb3duaW5nIHRoZSBCYWNrYm9uZS5Nb2RlbCBvciBCYWNrYm9uZS5Db2xsZWN0aW9uLlxuICAvLyAgIEBwYXJhbSBbTW9kZWx8Q29sbGVjdGlvbl0gdmFsdWUgdGhlIG1vZGVsL2NvbGxlY3Rpb25cbiAgLy9cbiAgLy8gQGV4YW1wbGVcbiAgLy8gICB2YXIgbW9kZWwgPSBrYi51dGlscy53cmFwcGVkT2JqZWN0KHZpZXdfbW9kZWwpO1xuICAvLyAgIHZhciBjb2xsZWN0aW9uID0ga2IudXRpbHMud3JhcHBlZE9iamVjdChjb2xsZWN0aW9uX29ic2VydmFibGUpO1xuICBzdGF0aWMgd3JhcHBlZE9iamVjdChvYmosIHZhbHVlKSB7IGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7IHJldHVybiBrYi51dGlscy5nZXQob2JqLCAnb2JqZWN0Jyk7IH0gcmV0dXJuIGtiLnV0aWxzLnNldChvYmosICdvYmplY3QnLCB2YWx1ZSk7IH1cblxuICAvLyBAbm9kb2NcbiAgc3RhdGljIHdyYXBwZWRDcmVhdG9yKG9iaiwgdmFsdWUpIHsgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHsgcmV0dXJuIGtiLnV0aWxzLmdldChvYmosICdjcmVhdG9yJyk7IH0gcmV0dXJuIGtiLnV0aWxzLnNldChvYmosICdjcmVhdG9yJywgdmFsdWUpOyB9XG5cbiAgLy8gRHVhbC1wdXJwb3NlIGdldHRlci9zZXR0ZXIgZm9yIHJldHJpZXZpbmcgYW5kIHN0b3JpbmcgdGhlIE1vZGVsIG9uIGEgVmlld01vZGVsLlxuICAvLyBAbm90ZSB0aGlzIGlzIGFsbW9zdCB0aGUgc2FtZSBhcyB7a2IudXRpbHMud3JhcHBlZE9iamVjdH0gZXhjZXB0IHRoYXQgaWYgdGhlIE1vZGVsIGRvZXNuJ3QgZXhpc3QsIGl0IHJldHVybnMgdGhlIFZpZXdNb2RlbCBpdHNlbGYgKHdoaWNoIGlzIHVzZWZ1bCBiZWhhdmlvdXIgZm9yIHNvcnRpbmcgYmVjYXVzZVxuICAvLyBpdCB5b3UgY2FuIGl0ZXJhdGUgb3ZlciBhIGtiLkNvbGxlY3Rpb25PYnNlcnZhYmxlJ3Mga28uT2JzZXJ2YWJsZUFycmF5IHdoZXRoZXIgaXQgaG9sZHMgVmlld01vZGVscyBvciBNb2RlbHMgd2l0aCB0aGUgbW9kZWxzX29ubHkgb3B0aW9uKS5cbiAgLy9cbiAgLy8gQG92ZXJsb2FkIHdyYXBwZWRNb2RlbCh2aWV3X21vZGVsKVxuICAvLyAgIEdldHMgdGhlIG1vZGVsIGZyb20gYSBWaWV3TW9kZWxcbiAgLy8gICBAcGFyYW0gW09iamVjdHxrYi5WaWV3TW9kZWxdIHZpZXdfbW9kZWwgdGhlIG93bmluZyBWaWV3TW9kZWwgZm9yIHRoZSBNb2RlbC5cbiAgLy8gICBAcmV0dXJuIFtNb2RlbHxWaWV3TW9kZWxdIHRoZSBNb2RlbCBvciBWaWV3TW9kZWwgaXRzZWxmIGlmIHRoZXJlIGlzIG5vIE1vZGVsXG4gIC8vIEBvdmVybG9hZCB3cmFwcGVkTW9kZWwodmlld19tb2RlbCwgbW9kZWwpXG4gIC8vICAgU2V0cyB0aGUgb2JzZXJ2YWJsZSBvbiBhbiBvYmplY3RcbiAgLy8gICBAcGFyYW0gW09iamVjdHxrYi5WaWV3TW9kZWxdIHZpZXdfbW9kZWwgdGhlIG93bmluZyBWaWV3TW9kZWwgZm9yIHRoZSBNb2RlbC5cbiAgLy8gICBAcGFyYW0gW01vZGVsXSBtb2RlbCB0aGUgTW9kZWxcbiAgc3RhdGljIHdyYXBwZWRNb2RlbChvYmosIHZhbHVlKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDEpIHJldHVybiBrYi51dGlscy5zZXQob2JqLCAnb2JqZWN0JywgdmFsdWUpO1xuICAgIHZhbHVlID0ga2IudXRpbHMuZ2V0KG9iaiwgJ29iamVjdCcpO1xuICAgIHJldHVybiBfLmlzVW5kZWZpbmVkKHZhbHVlKSA/IG9iaiA6IHZhbHVlO1xuICB9XG5cbiAgLy8gRHVhbC1wdXJwb3NlIGdldHRlci9zZXR0ZXIgZm9yIHJldHJpZXZpbmcgYW5kIHN0b3JpbmcgYSBrYi5TdG9yZSBvbiBhbiBvd25lci5cbiAgLy9cbiAgLy8gQG92ZXJsb2FkIHdyYXBwZWRTdG9yZShvYmopXG4gIC8vICAgR2V0cyB0aGUgc3RvcmUgZnJvbSBhbiBvYmplY3RcbiAgLy8gICBAcGFyYW0gW0FueV0gb2JqIHRoZSBvd25lclxuICAvLyAgIEByZXR1cm4gW2tiLlN0b3JlXSB0aGUgc3RvcmVcbiAgLy8gQG92ZXJsb2FkIHdyYXBwZWRTdG9yZShvYmosIHN0b3JlKVxuICAvLyAgIFNldHMgdGhlIHN0b3JlIG9uIGFuIG9iamVjdFxuICAvLyAgIEBwYXJhbSBbQW55XSBvYmogdGhlIG93bmVyXG4gIC8vICAgQHBhcmFtIFtrYi5TdG9yZV0gc3RvcmUgdGhlIHN0b3JlXG4gIC8vXG4gIC8vIEBleGFtcGxlXG4gIC8vICAgdmFyIGNvID0ga2IuY29sbGVjdGlvbk9ic2VydmFibGUobmV3IEJhY2tib25lLkNvbGxlY3Rpb24oKSk7XG4gIC8vICAgdmFyIGNvX3NlbGVjdGVkX29wdGlvbnMgPSBrYi5jb2xsZWN0aW9uT2JzZXJ2YWJsZShuZXcgQmFja2JvbmUuQ29sbGVjdGlvbigpLCB7XG4gIC8vICAgICBzdG9yZToga2IudXRpbHMud3JhcHBlZFN0b3JlKGNvKVxuICAvLyAgIH0pO1xuICBzdGF0aWMgd3JhcHBlZFN0b3JlKG9iaiwgdmFsdWUpIHsgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHsgcmV0dXJuIGtiLnV0aWxzLmdldChvYmosICdzdG9yZScpOyB9IHJldHVybiBrYi51dGlscy5zZXQob2JqLCAnc3RvcmUnLCB2YWx1ZSk7IH1cblxuICAvLyBAcHJpdmF0ZVxuICBzdGF0aWMgd3JhcHBlZFN0b3JlSXNPd25lZChvYmosIHZhbHVlKSB7IGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7IHJldHVybiBrYi51dGlscy5nZXQob2JqLCAnc3RvcmVfaXNfb3duZWQnKTsgfSByZXR1cm4ga2IudXRpbHMuc2V0KG9iaiwgJ3N0b3JlX2lzX293bmVkJywgdmFsdWUpOyB9XG5cbiAgLy8gRHVhbC1wdXJwb3NlIGdldHRlci9zZXR0ZXIgZm9yIHJldHJpZXZpbmcgYW5kIHN0b3JpbmcgYSBrYi5GYWN0b3J5IG9uIGFuIG93bmVyLlxuICAvL1xuICAvLyBAb3ZlcmxvYWQgd3JhcHBlZEZhY3Rvcnkob2JqKVxuICAvLyAgIEdldHMgdGhlIGZhY3RvcnkgZnJvbSBhbiBvYmplY3RcbiAgLy8gICBAcGFyYW0gW0FueV0gb2JqIHRoZSBvd25lclxuICAvLyAgIEByZXR1cm4gW2tiLkZhY3RvcnldIHRoZSBmYWN0b3J5XG4gIC8vIEBvdmVybG9hZCB3cmFwcGVkRmFjdG9yeShvYmosIGZhY3RvcnkpXG4gIC8vICAgU2V0cyB0aGUgZmFjdG9yeSBvbiBhbiBvYmplY3RcbiAgLy8gICBAcGFyYW0gW0FueV0gb2JqIHRoZSBvd25lclxuICAvLyAgIEBwYXJhbSBba2IuRmFjdG9yeV0gZmFjdG9yeSB0aGUgZmFjdG9yeVxuICBzdGF0aWMgd3JhcHBlZEZhY3Rvcnkob2JqLCB2YWx1ZSkgeyBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkgeyByZXR1cm4ga2IudXRpbHMuZ2V0KG9iaiwgJ2ZhY3RvcnknKTsgfSByZXR1cm4ga2IudXRpbHMuc2V0KG9iaiwgJ2ZhY3RvcnknLCB2YWx1ZSk7IH1cblxuICAvLyBEdWFsLXB1cnBvc2UgZ2V0dGVyL3NldHRlciBmb3IgcmV0cmlldmluZyBhbmQgc3RvcmluZyBhIEV2ZW50V2F0Y2hlciBvbiBhbiBvd25lci5cbiAgLy9cbiAgLy8gQG92ZXJsb2FkIHdyYXBwZWRFdmVudFdhdGNoZXIob2JqKVxuICAvLyAgIEdldHMgdGhlIGV2ZW50X3dhdGNoZXIgZnJvbSBhbiBvYmplY3RcbiAgLy8gICBAcGFyYW0gW0FueV0gb2JqIHRoZSBvd25lclxuICAvLyAgIEByZXR1cm4gW0V2ZW50V2F0Y2hlcl0gdGhlIGV2ZW50X3dhdGNoZXJcbiAgLy8gQG92ZXJsb2FkIHdyYXBwZWRFdmVudFdhdGNoZXIob2JqLCBldmVudF93YXRjaGVyKVxuICAvLyAgIFNldHMgdGhlIGV2ZW50X3dhdGNoZXIgb24gYW4gb2JqZWN0XG4gIC8vICAgQHBhcmFtIFtBbnldIG9iaiB0aGUgb3duZXJcbiAgLy8gICBAcGFyYW0gW0V2ZW50V2F0Y2hlcl0gZXZlbnRfd2F0Y2hlciB0aGUgZXZlbnRfd2F0Y2hlclxuICBzdGF0aWMgd3JhcHBlZEV2ZW50V2F0Y2hlcihvYmosIHZhbHVlKSB7IGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7IHJldHVybiBrYi51dGlscy5nZXQob2JqLCAnZXZlbnRfd2F0Y2hlcicpOyB9IHJldHVybiBrYi51dGlscy5zZXQob2JqLCAnZXZlbnRfd2F0Y2hlcicsIHZhbHVlKTsgfVxuXG4gIC8vIEBwcml2YXRlXG4gIHN0YXRpYyB3cmFwcGVkRXZlbnRXYXRjaGVySXNPd25lZChvYmosIHZhbHVlKSB7IGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7IHJldHVybiBrYi51dGlscy5nZXQob2JqLCAnZXZlbnRfd2F0Y2hlcl9pc19vd25lZCcpOyB9IHJldHVybiBrYi51dGlscy5zZXQob2JqLCAnZXZlbnRfd2F0Y2hlcl9pc19vd25lZCcsIHZhbHVlKTsgfVxuXG4gIC8vIFJldHJpZXZlcyB0aGUgdmFsdWUgc3RvcmVkIGluIGEga28ub2JzZXJ2YWJsZS5cbiAgLy9cbiAgLy8gQHNlZSBrYi5PYnNlcnZhYmxlIHZhbHVlVHlwZVxuICAvL1xuICAvLyBAZXhhbXBsZVxuICAvLyAgIHZhciB2aWV3X21vZGVsID0ga2Iudmlld01vZGVsKG5ldyBNb2RlbCh7c2ltcGxlX2F0dHI6IG51bGwsIG1vZGVsX2F0dHI6IG51bGx9KSwge2ZhY3Rvcmllczoge21vZGVsX2F0dHI6IGtiLlZpZXdNb2RlbH0pO1xuICAvLyAgIGtiLnV0aWxzLnZhbHVlVHlwZSh2aWV3X21vZGVsLnNpbXBsZV9hdHRyKTsgLy8ga2IuVFlQRV9TSU1QTEVcbiAgLy8gICBrYi51dGlscy52YWx1ZVR5cGUodmlld19tb2RlbC5tb2RlbF9hdHRyKTsgIC8vIGtiLlRZUEVfTU9ERUxcbiAgc3RhdGljIHZhbHVlVHlwZShvYnNlcnZhYmxlKSB7XG4gICAgaWYgKCFvYnNlcnZhYmxlKSByZXR1cm4ga2IuVFlQRV9VTktOT1dOO1xuICAgIGlmIChvYnNlcnZhYmxlLl9fa2JfaXNfbykgcmV0dXJuIG9ic2VydmFibGUudmFsdWVUeXBlKCk7XG4gICAgaWYgKG9ic2VydmFibGUuX19rYl9pc19jbyB8fCBrYi5pc0NvbGxlY3Rpb24ob2JzZXJ2YWJsZSkpIHJldHVybiBrYi5UWVBFX0NPTExFQ1RJT047XG4gICAgaWYgKChvYnNlcnZhYmxlIGluc3RhbmNlb2Yga2IuVmlld01vZGVsKSB8fCBrYi5pc01vZGVsKG9ic2VydmFibGUpKSByZXR1cm4ga2IuVFlQRV9NT0RFTDtcbiAgICBpZiAoXy5pc0FycmF5KG9ic2VydmFibGUpKSByZXR1cm4ga2IuVFlQRV9BUlJBWTtcbiAgICByZXR1cm4ga2IuVFlQRV9TSU1QTEU7XG4gIH1cblxuICAvLyBIZWxwZXIgdG8gam9pbiBhIGRvdC1kZWxpbWluYXRlZCBwYXRoLlxuICAvL1xuICAvLyBAcGFyYW0gW1N0cmluZ10gcGF0aDEgc3RhcnQgcGF0aC5cbiAgLy8gQHBhcmFtIFtTdHJpbmddIHBhdGgyIGFwcGVuZCBwYXRoLlxuICAvLyBAcmV0dXJuIFtTdHJpbmddIGNvbWJpbmVkIGRvdC1kZWxpbWl0ZWQgcGF0aC5cbiAgLy9cbiAgLy8gQGV4YW1wbGVcbiAgLy8gICBrYi51dGlscy5wYXRoSm9pbignbW9kZWxzJywgJ25hbWUnKTsgLy8gJ21vZGVscy5uYW1lJ1xuICBzdGF0aWMgcGF0aEpvaW4ocGF0aDEsIHBhdGgyKSB7IHJldHVybiAocGF0aDEgPyAocGF0aDFbcGF0aDEubGVuZ3RoIC0gMV0gIT09ICcuJyA/IGAke3BhdGgxfS5gIDogcGF0aDEpIDogJycpICsgcGF0aDI7IH1cblxuICAvLyBIZWxwZXIgdG8gam9pbiBhIGRvdC1kZWxpbWluYXRlZCBwYXRoIHdpdGggdGhlIHBhdGggb24gb3B0aW9ucyBhbmQgcmV0dXJucyBhIG5ldyBvcHRpb25zIG9iamVjdCB3aXRoIHRoZSByZXN1bHQuXG4gIC8vXG4gIC8vIEBwYXJhbSBbT2JqZWN0XSBvcHRpb25zIHdpdGggcGF0aCBwcm9wZXJ0eSBmb3IgdGhlIHN0YXJ0IHBhdGhcbiAgLy8gQHBhcmFtIFtTdHJpbmddIHBhdGggYXBwZW5kIHBhdGguXG4gIC8vIEByZXR1cm4gW09iamVjdF0gbmV3IG9wdGlvbnMgd2l0aCBjb21iaW5lZCBkb3QtZGVsaW1pdGVkIHBhdGggYHtwYXRoOiBjb21iaW5lZF9wYXRofWAuXG4gIC8vXG4gIC8vIEBleGFtcGxlXG4gIC8vICAgdGhpcy5mcmllbmRzID0ga2IuY29sbGVjdGlvbk9ic2VydmFibGUobW9kZWwuZ2V0KCdmcmllbmRzJyksIGtiLnV0aWxzLm9wdGlvbnNQYXRoSm9pbihvcHRpb25zLCAnZnJpZW5kcycpKTtcbiAgc3RhdGljIG9wdGlvbnNQYXRoSm9pbihvcHRpb25zLCBwYXRoKSB7IHJldHVybiBfLmRlZmF1bHRzKHsgcGF0aDogdGhpcy5wYXRoSm9pbihvcHRpb25zLnBhdGgsIHBhdGgpIH0sIG9wdGlvbnMpOyB9XG5cbiAgLy8gSGVscGVyIHRvIGZpbmQgdGhlIGNyZWF0b3IgY29uc3RydWN0b3Igb3IgZnVuY3Rpb24gZnJvbSBhIGZhY3Rvcnkgb3IgT1JNIHNvbHV0aW9uXG4gIHN0YXRpYyBpbmZlckNyZWF0b3IodmFsdWUsIGZhY3RvcnksIHBhdGgpIHtcbiAgICBjb25zdCBjcmVhdG9yID0gZmFjdG9yeSA/IGZhY3RvcnkuY3JlYXRvckZvclBhdGgodmFsdWUsIHBhdGgpIDogbnVsbDtcbiAgICBpZiAoY3JlYXRvcikgeyByZXR1cm4gY3JlYXRvcjsgfVxuXG4gICAgLy8gdHJ5IGZhbGxiYWNrc1xuICAgIGlmICghdmFsdWUpIHJldHVybiBudWxsO1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEJhY2tib25lLk1vZGVsKSB7IHJldHVybiBrYi5WaWV3TW9kZWw7IH1cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBCYWNrYm9uZS5Db2xsZWN0aW9uKSB7IHJldHVybiBrYi5Db2xsZWN0aW9uT2JzZXJ2YWJsZTsgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gQ3JlYXRlcyBhbiBvYnNlcnZhYmxlIGJhc2VkIG9uIGEgdmFsdWUncyB0eXBlLlxuICBzdGF0aWMgY3JlYXRlRnJvbURlZmF1bHRDcmVhdG9yKG9iaiwgb3B0aW9ucykge1xuICAgIGlmIChrYi5pc01vZGVsKG9iaikpIHsgcmV0dXJuIGtiLnZpZXdNb2RlbChvYmosIG9wdGlvbnMpOyB9XG4gICAgaWYgKGtiLmlzQ29sbGVjdGlvbihvYmopKSB7IHJldHVybiBrYi5jb2xsZWN0aW9uT2JzZXJ2YWJsZShvYmosIG9wdGlvbnMpOyB9XG4gICAgaWYgKF8uaXNBcnJheShvYmopKSB7IHJldHVybiBrby5vYnNlcnZhYmxlQXJyYXkob2JqKTsgfVxuICAgIHJldHVybiBrby5vYnNlcnZhYmxlKG9iaik7XG4gIH1cblxuICAvLyBAbm9kb2NcbiAgc3RhdGljIHJlc29sdmVNb2RlbChtb2RlbCkgeyBpZiAobW9kZWwgJiYgQmFja2JvbmUgJiYgQmFja2JvbmUuTW9kZWxSZWYgJiYgbW9kZWwgaW5zdGFuY2VvZiBCYWNrYm9uZS5Nb2RlbFJlZikgeyByZXR1cm4gbW9kZWwubW9kZWwoKTsgfSByZXR1cm4gbW9kZWw7IH1cbn1cbiIsIi8qXG4gIGtub2NrYmFjay5qcyAyLjAuMC1hbHBoYS4xXG4gIENvcHlyaWdodCAoYykgIDIwMTEtMjAxNiBLZXZpbiBNYWxha29mZi5cbiAgTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiAgU291cmNlOiBodHRwczovL2dpdGh1Yi5jb20va21hbGFrb2ZmL2tub2NrYmFja1xuICBEZXBlbmRlbmNpZXM6IEtub2Nrb3V0LmpzLCBCYWNrYm9uZS5qcywgYW5kIFVuZGVyc2NvcmUuanMgKG9yIExvRGFzaC5qcykuXG4gIE9wdGlvbmFsIGRlcGVuZGVuY2llczogQmFja2JvbmUuTW9kZWxSZWYuanMgYW5kIEJhY2tib25lT1JNLlxuKi9cblxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgQmFja2JvbmUgZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IGtvIGZyb20gJ2tub2Nrb3V0JztcblxuaW1wb3J0IGtiIGZyb20gJy4va2InO1xuaW1wb3J0IEV2ZW50V2F0Y2hlciBmcm9tICcuL2V2ZW50LXdhdGNoZXInO1xuXG4vLyBAbm9kb2NcbmNvbnN0IGFzc2lnblZpZXdNb2RlbEtleSA9ICh2bSwga2V5KSA9PiB7XG4gIGNvbnN0IHZtX2tleSA9IHZtLl9fa2IuaW50ZXJuYWxzICYmIH5fLmluZGV4T2Yodm0uX19rYi5pbnRlcm5hbHMsIGtleSkgPyBgXyR7a2V5fWAgOiBrZXk7XG4gIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodm0uX19rYi52aWV3X21vZGVsLCB2bV9rZXkpKSByZXR1cm4gdW5kZWZpbmVkOyAvLyBhbHJlYWR5IGV4aXN0cywgc2tpcFxuICB2bS5fX2tiLnZpZXdfbW9kZWxbdm1fa2V5XSA9IG51bGw7XG4gIHJldHVybiB2bV9rZXk7XG59O1xuXG4vLyBAbm9kb2NcbmNvbnN0IGNyZWF0ZU9ic2VydmFibGUgPSAodm0sIG1vZGVsLCBrZXksIGNyZWF0ZV9vcHRpb25zKSA9PiB7XG4gIGlmICh2bS5fX2tiLmV4Y2x1ZGVzICYmIH5fLmluZGV4T2Yodm0uX19rYi5leGNsdWRlcywga2V5KSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgaWYgKHZtLl9fa2Iuc3RhdGljcyAmJiB+Xy5pbmRleE9mKHZtLl9fa2Iuc3RhdGljcywga2V5KSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgY29uc3Qgdm1fa2V5ID0gYXNzaWduVmlld01vZGVsS2V5KHZtLCBrZXkpO1xuICBpZiAoIXZtX2tleSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgY29uc3Qgb2JzZXJ2YWJsZSA9IGtiLm9ic2VydmFibGUobW9kZWwsIGtleSwgY3JlYXRlX29wdGlvbnMsIHZtKTtcbiAgdm0uX19rYi52aWV3X21vZGVsW3ZtX2tleV0gPSBvYnNlcnZhYmxlOyB2bVt2bV9rZXldID0gb2JzZXJ2YWJsZTtcbiAgcmV0dXJuIG9ic2VydmFibGU7XG59O1xuXG4vLyBAbm9kb2NcbmNvbnN0IGNyZWF0ZVN0YXRpY09ic2VydmFibGVzID0gKHZtLCBtb2RlbCkgPT4ge1xuICBfLmVhY2godm0uX19rYi5zdGF0aWNzLCAoa2V5KSA9PiB7XG4gICAgY29uc3Qgdm1fa2V5ID0gYXNzaWduVmlld01vZGVsS2V5KHZtLCBrZXkpO1xuICAgIGlmICghdm1fa2V5KSByZXR1cm47XG5cbiAgICBpZiAobW9kZWwuaGFzKHZtX2tleSkpIHtcbiAgICAgIHZtLl9fa2Iudmlld19tb2RlbFt2bV9rZXldID0gbW9kZWwuZ2V0KHZtX2tleSk7XG4gICAgICB2bVt2bV9rZXldID0gdm0uX19rYi52aWV3X21vZGVsW3ZtX2tleV07XG4gICAgfSBlbHNlIGlmICh2bS5fX2tiLnN0YXRpY19kZWZhdWx0cyAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodm0uX19rYi5zdGF0aWNfZGVmYXVsdHMsIHZtX2tleSkpIHtcbiAgICAgIHZtLl9fa2Iudmlld19tb2RlbFt2bV9rZXldID0gdm0uX19rYi5zdGF0aWNfZGVmYXVsdHNbdm1fa2V5XTtcbiAgICAgIHZtW3ZtX2tleV0gPSB2bS5fX2tiLnZpZXdfbW9kZWxbdm1fa2V5XTtcbiAgICB9IGVsc2UgZGVsZXRlIHZtLl9fa2Iudmlld19tb2RlbFt2bV9rZXldO1xuICB9KTtcbn07XG5cbmNvbnN0IEtFWVNfT1BUSU9OUyA9IFsna2V5cycsICdpbnRlcm5hbHMnLCAnZXhjbHVkZXMnLCAnc3RhdGljcycsICdzdGF0aWNfZGVmYXVsdHMnXTtcblxuLy8gQmFzZSBjbGFzcyBmb3IgVmlld01vZGVscyBmb3IgTW9kZWxzLlxuLy9cbi8vIEBleGFtcGxlIEhvdyB0byBjcmVhdGUgYSBWaWV3TW9kZWwgd2l0aCBmaXJzdF9uYW1lIGFuZCBsYXN0X25hbWUgb2JzZXJ2YWJsZXMuXG4vLyAgIHZhciB2aWV3X21vZGVsID0ga2Iudmlld01vZGVsKG5ldyBCYWNrYm9uZS5Nb2RlbCh7Zmlyc3RfbmFtZTogXCJQbGFuZXRcIiwgbGFzdF9uYW1lOiBcIkVhcnRoXCJ9KSk7XG4vL1xuLy8gQGV4YW1wbGUgQnVsayBrYi5PYnNlcnZhYmxlIGNyZWF0ZSB1c2luZyAna2V5JyBPYmplY3QgdG8gY3VzdG9taXplIHRoZSBrYi5PYnNlcnZhYmxlIGNyZWF0ZWQgcGVyIGF0dHJpYnV0ZS5cbi8vICAgdmFyIENvbnRhY3RWaWV3TW9kZWwgPSBmdW5jdGlvbihtb2RlbCkge1xuLy8gICAgIHRoaXMubG9hZGluZ19tZXNzYWdlID0gbmV3IGtiLkxvY2FsaXplZFN0cmluZ0xvY2FsaXplcihuZXcgTG9jYWxpemVkU3RyaW5nKCdsb2FkaW5nJykpO1xuLy8gICAgIHRoaXMuX2F1dG8gPSBrYi52aWV3TW9kZWwobW9kZWwsIHtcbi8vICAgICAgIGtleXM6IHtcbi8vICAgICAgICAgbmFtZTogeyBrZXk6ICduYW1lJywgJ2RlZmF1bHQnOiB0aGlzLmxvYWRpbmdfbWVzc2FnZSB9LFxuLy8gICAgICAgICBudW1iZXI6IHsga2V5OiAnbnVtYmVyJywgJ2RlZmF1bHQnOiB0aGlzLmxvYWRpbmdfbWVzc2FnZSB9LFxuLy8gICAgICAgICBkYXRlOiB7IGtleTogJ2RhdGUnLCAnZGVmYXVsdCc6IHRoaXMubG9hZGluZ19tZXNzYWdlLCBsb2NhbGl6ZXI6IGtiLlNob3J0RGF0ZUxvY2FsaXplciB9XG4vLyAgICAgICB9XG4vLyAgICAgfSwgdGhpcyk7XG4vLyAgICAgcmV0dXJuIHRoaXM7XG4vLyAgIH07XG4vL1xuLy8gQGV4YW1wbGUgQ3JlYXRpbmcga28uT2JzZXJ2YWJsZXMgb24gYSB0YXJnZXQgVmlld01vZGVsXG4vLyAgIHZhciB2aWV3X21vZGVsID0ge307XG4vLyAgIGtiLnZpZXdNb2RlbChtb2RlbCwgWyduYW1lJywgJ2RhdGUnXSwgdmlld19tb2RlbCk7IC8vIG9ic2VydmFibGVzIGFyZSBhZGRlZCB0byB2aWV3X21vZGVsXG4vL1xuLy8gQG1ldGhvZCAuZXh0ZW5kKHByb3RvdHlwZV9wcm9wZXJ0aWVzLCBjbGFzc19wcm9wZXJ0aWVzKVxuLy8gICBDbGFzcyBtZXRob2QgZm9yIEphdmFTY3JpcHQgaW5oZXJpdGFuY2UuXG4vLyAgIEBwYXJhbSBbT2JqZWN0XSBwcm90b3R5cGVfcHJvcGVydGllcyB0aGUgcHJvcGVydGllcyB0byBhZGQgdG8gdGhlIHByb3RvdHlwZVxuLy8gICBAcGFyYW0gW09iamVjdF0gY2xhc3NfcHJvcGVydGllcyB0aGUgcHJvcGVydGllcyB0byBhZGQgdG8gdGhlIGNsYXNzXG4vLyAgIEByZXR1cm4gW2tiLlZpZXdNb2RlbF0gdGhlIGNvbnN0cnVjdG9yIHJldHVybnMgJ3RoaXMnXG4vLyAgIEBleGFtcGxlXG4vLyAgICAgdmFyIENvbnRhY3RWaWV3TW9kZWwgPSBrYi5WaWV3TW9kZWwuZXh0ZW5kKHtcbi8vICAgICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbihtb2RlbCkge1xuLy8gICAgICAgICBrYi5WaWV3TW9kZWwucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbW9kZWwsIHtpbnRlcm5hbHM6IFsnZW1haWwnLCAnZGF0ZSddfSk7ICAgLy8gY2FsbCBzdXBlciBjb25zdHJ1Y3RvcjogQG5hbWUsIEBfZW1haWwsIGFuZCBAX2RhdGUgY3JlYXRlZCBpbiBzdXBlciBmcm9tIHRoZSBtb2RlbCBhdHRyaWJ1dGVzXG4vLyAgICAgICAgIHRoaXMuZW1haWwgPSBrYi5kZWZhdWx0T2JzZXJ2YWJsZSh0aGlzLl9lbWFpbCwgJ3lvdXIubmFtZUB5b3VycGxhY2UuY29tJyk7XG4vLyAgICAgICAgIHRoaXMuZGF0ZSA9IG5ldyBMb25nRGF0ZUxvY2FsaXplcih0aGlzLl9kYXRlKTtcbi8vICAgICAgICAgcmV0dXJuIHRoaXM7XG4vLyAgICAgICB9XG4vLyAgICAgfSk7XG4vLyAgIEBleGFtcGxlXG4vLyAgICAgdmFyIFZpZXdNb2RlbCA9IGtiLlZpZXdNb2RlbC5leHRlbmQoe1xuLy8gICAgICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uKG1vZGVsKXtcbi8vICAgICAgICAga2IuVmlld01vZGVsLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuLy8gICAgICAgICB0aGlzLmZ1bGxfbmFtZSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5maXJzdF9uYW1lKCkgKyBcIiBcIiArIHRoaXMubGFzdF9uYW1lKCk7IH0sIHRoaXMpO1xuLy8gICAgICAgfVxuLy8gICAgIH0pO1xuLy8gICAgIHZhciB2aWV3X21vZGVsID0gbmV3IFZpZXdNb2RlbChtb2RlbCk7XG4vL1xuLy8gQG1ldGhvZCAjbW9kZWwoKVxuLy8gICBEdWFsLXB1cnBvc2UgZ2V0dGVyL3NldHRlciBrby5jb21wdXRlZCBmb3IgdGhlIG9ic2VydmVkIG1vZGVsLlxuLy8gICBAcmV0dXJuIFtNb2RlbHxNb2RlbFJlZnx2b2lkXSBnZXR0ZXI6IHRoZSBtb2RlbCB3aG9zZSBhdHRyaWJ1dGVzIGFyZSBiZWluZyBvYnNlcnZlZCAoY2FuIGJlIG51bGwpIE9SIHNldHRlcjogdm9pZFxuLy8gICBAZXhhbXBsZVxuLy8gICAgIHZhciB2aWV3X21vZGVsID0ga2Iudmlld01vZGVsKG5ldyBCYWNrYm9uZS5Nb2RlbCh7bmFtZTogJ2JvYid9KSk7XG4vLyAgICAgdmFyIHRoZV9tb2RlbCA9IHZpZXdfbW9kZWwubW9kZWwoKTsgLy8gZ2V0XG4vLyAgICAgdmlld19tb2RlbC5tb2RlbChuZXcgQmFja2JvbmUuTW9kZWwoe25hbWU6ICdmcmVkJ30pKTsgLy8gc2V0XG4vL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld01vZGVsIHtcbiAgLy8gQG5vZG9jXG4gIHN0YXRpYyBleHRlbmQgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQ7XG4gICAgLy8gZm9yIEJhY2tib25lIG5vbi1Db2ZmZWVzY3JpcHQgaW5oZXJpdGFuY2UgKHVzZSBcImtiLlN1cGVyQ2xhc3MuZXh0ZW5kKHt9KVwiIGluIEphdmFzY3JpcHQgaW5zdGVhZCBvZiBcImNsYXNzIE15Q2xhc3MgZXh0ZW5kcyBrYi5TdXBlckNsYXNzXCIpXG5cbiAgLy8gVXNlZCB0byBjcmVhdGUgYSBuZXcga2IuVmlld01vZGVsLlxuICAvL1xuICAvLyBAcGFyYW0gW01vZGVsfE1vZGVsUmVmXSBtb2RlbCB0aGUgbW9kZWwgdG8gb2JzZXJ2ZSAoY2FuIGJlIG51bGwpXG4gIC8vIEBwYXJhbSBbT2JqZWN0XSBvcHRpb25zIHRoZSBjcmVhdGUgb3B0aW9uc1xuICAvLyBAb3B0aW9uIG9wdGlvbnMgW0FycmF5fFN0cmluZ10gaW50ZXJuYWxzIGFuIGFycmF5IG9mIGF0dHRyaWJ1dGVzIHRoYXQgc2hvdWxkIGJlIHNjb3BlZCB3aXRoIGFuIHVuZGVyc2NvcmUsIGVnLiBuYW1lIC0+IF9uYW1lXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbQXJyYXl8U3RyaW5nXSByZXF1aXJlcyBhbiBhcnJheSBvZiBhdHR0cmlidXRlcyB0aGF0IHdpbGwgaGF2ZSBrYi5PYnNlcnZhYmxlcyBjcmVhdGVkIGV2ZW4gaWYgdGhleSBkbyBub3QgZXhpc3Qgb24gdGhlIE1vZGVsLlxuICAvLyBVc2VmdWwgZm9yIGJpbmRpbmcgVmlld3MgdGhhdCByZXF1aXJlIHNwZWNpZmljIG9ic2VydmFibGVzIHRvIGV4aXN0XG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbQXJyYXl8U3RyaW5nXSBrZXlzIHJlc3RyaWN0cyB0aGUga2V5cyB1c2VkIG9uIGEgbW9kZWwuIFVzZWZ1bCBmb3IgcmVkdWNpbmcgdGhlIG51bWJlciBvZiBrYi5PYnNlcnZhYmxlcyBjcmVhdGVkIGZyb20gYSBsaW1pdGVkIHNldCBvZiBNb2RlbCBhdHRyaWJ1dGVzXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbT2JqZWN0fEFycmF5fFN0cmluZ10gZXhjbHVkZXMgaWYgYW4gYXJyYXkgaXMgc3VwcGxpZWQsIGV4Y2x1ZGVzIGtleXMgdG8gZXhjbHVkZSBvbiB0aGUgdmlldyBtb2RlbDtcbiAgLy8gZm9yIGV4YW1wbGUsIGlmIHlvdSB3YW50IHRvIHByb3ZpZGUgYSBjdXN0b20gaW1wbGVtZW50YXRpb24uIElmIGFuIE9iamVjdCwgaXQgcHJvdmlkZXMgb3B0aW9ucyB0byB0aGUga2IuT2JzZXJ2YWJsZSBjb25zdHJ1Y3Rvci5cbiAgLy8gQG9wdGlvbiBvcHRpb25zIFtBcnJheV0gc3RhdGljcyBjcmVhdGVzIG5vbi1vYnNlcnZhYmxlIHByb3BlcnRpZXMgb24geW91ciB2aWV3IG1vZGVsIGZvciBNb2RlbCBhdHRyaWJ1dGVzIHRoYXQgZG8gbm90IG5lZWQgdG8gYmUgb2JzZXJ2ZWQgZm9yIGNoYW5nZXMuXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbT2JqZWN0XSBzdGF0aWNfZGVmYXVsdHMgcHJvdmlkZXMgZGVmYXVsdCB2YWx1ZXMgZm9yIHN0YXRpY3MuXG4gIC8vIEBvcHRpb24gb3B0aW9ucyBbU3RyaW5nXSBwYXRoIHRoZSBwYXRoIHRvIHRoZSB2YWx1ZSAodXNlZCB0byBjcmVhdGUgcmVsYXRlZCBvYnNlcnZhYmxlcyBmcm9tIHRoZSBmYWN0b3J5KS5cbiAgLy8gQG9wdGlvbiBvcHRpb25zIFtrYi5TdG9yZV0gc3RvcmUgYSBzdG9yZSB1c2VkIHRvIGNhY2hlIGFuZCBzaGFyZSB2aWV3IG1vZGVscy5cbiAgLy8gQG9wdGlvbiBvcHRpb25zIFtPYmplY3RdIGZhY3RvcmllcyBhIG1hcCBvZiBkb3QtZGVsaW1pbmF0ZWQgcGF0aHM7IGZvciBleGFtcGxlIGB7J21vZGVscy5uYW1lJzoga2IuVmlld01vZGVsfWAgdG8gZWl0aGVyIGNvbnN0cnVjdG9ycyBvciBjcmVhdGUgZnVuY3Rpb25zLlxuICAvLyBTaWduYXR1cmU6IGB7J3NvbWUucGF0aCc6IGZ1bmN0aW9uKG9iamVjdCwgb3B0aW9ucyl9YFxuICAvLyBAb3B0aW9uIG9wdGlvbnMgW2tiLkZhY3RvcnldIGZhY3RvcnkgYSBmYWN0b3J5IHVzZWQgdG8gY3JlYXRlIHZpZXcgbW9kZWxzLlxuICAvLyBAb3B0aW9uIG9wdGlvbnMgW09iamVjdF0gb3B0aW9ucyBhIHNldCBvZiBvcHRpb25zIG1lcmdlIGludG8gdGhlc2Ugb3B0aW9ucy4gVXNlZnVsIGZvciBleHRlbmRpbmcgb3B0aW9ucyB3aGVuIGRlcml2aW5nIGNsYXNzZXMgcmF0aGVyIHRoYW4gbWVyZ2luZyB0aGVtIGJ5IGhhbmQuXG4gIC8vIEByZXR1cm4gW2tvLm9ic2VydmFibGVdIHRoZSBjb25zdHJ1Y3RvciByZXR1cm5zICd0aGlzJ1xuICAvLyBAcGFyYW0gW09iamVjdF0gdmlld19tb2RlbCBhIHZpZXcgbW9kZWwgdG8gYWxzbyBzZXQgdGhlIGtiLk9ic2VydmFibGVzIG9uLiBVc2VmdWwgd2hlbiBiYXRjaCBjcmVhdGluZyBvYnNlcnZhYmxlIG9uIGFuIG93bmluZyB2aWV3IG1vZGVsLlxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgcmV0dXJuIGtiLmlnbm9yZSgoKSA9PiB7XG4gICAgICBsZXQgbW9kZWwgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICAhbW9kZWwgfHwga2IuaXNNb2RlbChtb2RlbCkgfHwga2IuX3Rocm93VW5leHBlY3RlZCh0aGlzLCAnbm90IGEgbW9kZWwnKTtcblxuICAgICAgaWYgKF8uaXNBcnJheShhcmdzWzBdKSkgYXJnc1swXSA9IHsga2V5czogYXJnc1swXSB9O1xuICAgICAgaWYgKCF0aGlzLl9fa2IpIHsgdGhpcy5fX2tiID0ge307IH0gdGhpcy5fX2tiLnZpZXdfbW9kZWwgPSAoYXJncy5sZW5ndGggPiAxID8gYXJncy5wb3AoKSA6IHRoaXMpO1xuXG4gICAgICBsZXQgb3B0aW9ucyA9IHt9O1xuICAgICAgXy5lYWNoKGFyZ3MsIChhcmcpID0+IHsga2IuYXNzaWduKG9wdGlvbnMsIGFyZyk7IG9wdGlvbnMgPSBrYi51dGlscy5jb2xsYXBzZU9wdGlvbnMob3B0aW9ucyk7IH0pO1xuICAgICAgXy5lYWNoKEtFWVNfT1BUSU9OUywgKGtleSkgPT4geyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9wdGlvbnMsIGtleSkpIHRoaXMuX19rYltrZXldID0gb3B0aW9uc1trZXldOyB9KTtcblxuICAgICAgLy8gYWx3YXlzIHVzZSBhIHN0b3JlIHRvIGVuc3VyZSByZWN1cnNpdmUgdmlldyBtb2RlbHMgYXJlIGhhbmRsZWQgY29ycmVjdGx5XG4gICAgICBrYi5TdG9yZS51c2VPcHRpb25zT3JDcmVhdGUob3B0aW9ucywgbW9kZWwsIHRoaXMpO1xuXG4gICAgICAvLyB2aWV3IG1vZGVsIGZhY3RvcnlcbiAgICAgIHRoaXMuX19rYi5wYXRoID0gb3B0aW9ucy5wYXRoO1xuICAgICAga2IuRmFjdG9yeS51c2VPcHRpb25zT3JDcmVhdGUob3B0aW9ucywgdGhpcywgb3B0aW9ucy5wYXRoKTtcblxuICAgICAgY29uc3QgZXZlbnRfd2F0Y2hlciA9IGtiLnV0aWxzLndyYXBwZWRFdmVudFdhdGNoZXIodGhpcywgbmV3IEV2ZW50V2F0Y2hlcihtb2RlbCwgdGhpcywge1xuICAgICAgICBlbWl0dGVyOiB0aGlzLl9tb2RlbCxcbiAgICAgICAgdXBkYXRlOiAoKCkgPT4ga2IuaWdub3JlKCgpID0+ICEoZXZlbnRfd2F0Y2hlciAmJiBldmVudF93YXRjaGVyLmVlKSB8fCB0aGlzLmNyZWF0ZU9ic2VydmFibGVzKGV2ZW50X3dhdGNoZXIuZWUpKSksXG4gICAgICB9KSk7XG5cbiAgICAgIGNvbnN0IF9tb2RlbCA9IGtiLnV0aWxzLnNldCh0aGlzLCAnX21vZGVsJywga28ub2JzZXJ2YWJsZSgpKTtcbiAgICAgIHRoaXMubW9kZWwgPSBrby5jb21wdXRlZCh7XG4gICAgICAgIHJlYWQ6ICgpID0+IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoX21vZGVsKSxcbiAgICAgICAgd3JpdGU6IG5ld19tb2RlbCA9PiBrYi5pZ25vcmUoKCkgPT4ge1xuICAgICAgICAgIGlmICgoa2IudXRpbHMud3JhcHBlZE9iamVjdCh0aGlzKSA9PT0gbmV3X21vZGVsKSB8fCBrYi53YXNSZWxlYXNlZCh0aGlzKSB8fCAhZXZlbnRfd2F0Y2hlcikgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgICAgICAgIHRoaXMuX19rYi5zdG9yZS5yZXVzZSh0aGlzLCBrYi51dGlscy5yZXNvbHZlTW9kZWwobmV3X21vZGVsKSk7XG4gICAgICAgICAgZXZlbnRfd2F0Y2hlci5lbWl0dGVyKG5ld19tb2RlbCk7IF9tb2RlbChldmVudF93YXRjaGVyLmVlKTtcbiAgICAgICAgICByZXR1cm4gIWV2ZW50X3dhdGNoZXIuZWUgfHwgdGhpcy5jcmVhdGVPYnNlcnZhYmxlcyhldmVudF93YXRjaGVyLmVlKTtcbiAgICAgICAgfSxcbiAgICAgICksXG4gICAgICB9KTtcblxuICAgICAgbW9kZWwgPSBldmVudF93YXRjaGVyLmVlO1xuICAgICAga2IudXRpbHMud3JhcHBlZE9iamVjdCh0aGlzLCBtb2RlbCk7IF9tb2RlbChldmVudF93YXRjaGVyLmVlKTtcblxuICAgICAgLy8gdXBkYXRlIHRoZSBvYnNlcnZhYmxlc1xuICAgICAgdGhpcy5fX2tiLmNyZWF0ZV9vcHRpb25zID0geyBzdG9yZToga2IudXRpbHMud3JhcHBlZFN0b3JlKHRoaXMpLCBmYWN0b3J5OiBrYi51dGlscy53cmFwcGVkRmFjdG9yeSh0aGlzKSwgcGF0aDogdGhpcy5fX2tiLnBhdGgsIGV2ZW50X3dhdGNoZXI6IGtiLnV0aWxzLndyYXBwZWRFdmVudFdhdGNoZXIodGhpcykgfTtcbiAgICAgICFvcHRpb25zLnJlcXVpcmVzIHx8IHRoaXMuY3JlYXRlT2JzZXJ2YWJsZXMobW9kZWwsIG9wdGlvbnMucmVxdWlyZXMpO1xuICAgICAgIXRoaXMuX19rYi5pbnRlcm5hbHMgfHwgdGhpcy5jcmVhdGVPYnNlcnZhYmxlcyhtb2RlbCwgdGhpcy5fX2tiLmludGVybmFscyk7XG4gICAgICAhb3B0aW9ucy5tYXBwaW5ncyB8fCB0aGlzLmNyZWF0ZU9ic2VydmFibGVzKG1vZGVsLCBvcHRpb25zLm1hcHBpbmdzKTtcbiAgICAgICF0aGlzLl9fa2Iuc3RhdGljcyB8fCBjcmVhdGVTdGF0aWNPYnNlcnZhYmxlcyh0aGlzLCBtb2RlbCk7XG4gICAgICB0aGlzLmNyZWF0ZU9ic2VydmFibGVzKG1vZGVsLCB0aGlzLl9fa2Iua2V5cyk7XG5cbiAgICAgIGlmIChrYi5zdGF0aXN0aWNzKSBrYi5zdGF0aXN0aWNzLnJlZ2lzdGVyKCdWaWV3TW9kZWwnLCB0aGlzKTsgICAgIC8vIGNvbGxlY3QgbWVtb3J5IG1hbmFnZW1lbnQgc3RhdGlzdGljc1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgKTtcbiAgfVxuXG4gIC8vIFJlcXVpcmVkIGNsZWFuIHVwIGZ1bmN0aW9uIHRvIGJyZWFrIGN5Y2xlcywgcmVsZWFzZSB2aWV3IG1vZGVscywgZXRjLlxuICAvLyBDYW4gYmUgY2FsbGVkIGRpcmVjdGx5LCB2aWEga2IucmVsZWFzZShvYmplY3QpIG9yIGFzIGEgY29uc2VxdWVuY2Ugb2Yga28ucmVsZWFzZU5vZGUoZWxlbWVudCkuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5fX2tiX3JlbGVhc2VkID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5fX2tiLnZpZXdfbW9kZWwgIT09IHRoaXMpIHsgXy5lYWNoKHRoaXMuX19rYi52bV9rZXlzLCAoa2V5KSA9PiB7IHRoaXMuX19rYi52aWV3X21vZGVsW2tleV0gPSBudWxsOyB9KTsgfVxuXG4gICAgLy8gY2xlYXIgdGhlIGV4dGVybmFsIHJlZmVyZW5jZXNcbiAgICB0aGlzLl9fa2Iudmlld19tb2RlbCA9IG51bGw7IHRoaXMuX19rYi5jcmVhdGVfb3B0aW9ucyA9IG51bGw7XG4gICAga2IucmVsZWFzZUtleXModGhpcyk7XG4gICAga2IudXRpbHMud3JhcHBlZERlc3Ryb3kodGhpcyk7XG5cbiAgICBpZiAoa2Iuc3RhdGlzdGljcykga2Iuc3RhdGlzdGljcy51bnJlZ2lzdGVyKCdWaWV3TW9kZWwnLCB0aGlzKTsgICAgIC8vIGNvbGxlY3QgbWVtb3J5IG1hbmFnZW1lbnQgc3RhdGlzdGljc1xuICB9XG5cbiAgLy8gR2V0IHRoZSBvcHRpb25zIGZvciBhIG5ldyB2aWV3IG1vZGVsIHRoYXQgY2FuIGJlIHVzZWQgZm9yIHNoYXJpbmcgdmlldyBtb2RlbHMuXG4gIHNoYXJlT3B0aW9ucygpIHsgcmV0dXJuIHsgc3RvcmU6IGtiLnV0aWxzLndyYXBwZWRTdG9yZSh0aGlzKSwgZmFjdG9yeToga2IudXRpbHMud3JhcHBlZEZhY3RvcnkodGhpcykgfTsgfVxuXG4gIC8vIGNyZWF0ZSBvYnNlcnZhYmxlcyBtYW51YWxseVxuICBjcmVhdGVPYnNlcnZhYmxlcyhtb2RlbCwga2V5cykge1xuICAgIGlmICgha2V5cykge1xuICAgICAgaWYgKHRoaXMuX19rYi5rZXlzIHx8ICFtb2RlbCkgcmV0dXJuOyAvLyBvbmx5IHVzZSB0aGUga2V5cyBwcm92aWRlZFxuICAgICAgZm9yIChjb25zdCBrZXkgaW4gbW9kZWwuYXR0cmlidXRlcykge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZGVsLmF0dHJpYnV0ZXMsIGtleSkpIHtcbiAgICAgICAgICBjcmVhdGVPYnNlcnZhYmxlKHRoaXMsIG1vZGVsLCBrZXksIHRoaXMuX19rYi5jcmVhdGVfb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGtiLnNldHRpbmdzLm9ybSAmJiBrYi5zZXR0aW5ncy5vcm0ua2V5cykge1xuICAgICAgICBfLmVhY2goa2Iuc2V0dGluZ3Mub3JtLmtleXMobW9kZWwpLCAoa2V5KSA9PiB7IGNyZWF0ZU9ic2VydmFibGUodGhpcywgbW9kZWwsIGtleSwgdGhpcy5fX2tiLmNyZWF0ZV9vcHRpb25zKTsgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfLmlzQXJyYXkoa2V5cykpIHtcbiAgICAgIF8ubWFwKGtleXMsIGtleSA9PiBjcmVhdGVPYnNlcnZhYmxlKHRoaXMsIG1vZGVsLCBrZXksIHRoaXMuX19rYi5jcmVhdGVfb3B0aW9ucykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfLmVhY2goa2V5cywgKG1hcHBpbmdfaW5mbywga2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IHZtX2tleSA9IGFzc2lnblZpZXdNb2RlbEtleSh0aGlzLCBrZXkpO1xuICAgICAgICBpZiAodm1fa2V5KSB7XG4gICAgICAgICAgaWYgKCFfLmlzU3RyaW5nKG1hcHBpbmdfaW5mbykgJiYgIW1hcHBpbmdfaW5mby5rZXkpIG1hcHBpbmdfaW5mby5rZXkgPSB2bV9rZXk7XG4gICAgICAgICAgdGhpc1t2bV9rZXldID0ga2Iub2JzZXJ2YWJsZShtb2RlbCwgbWFwcGluZ19pbmZvLCB0aGlzLl9fa2IuY3JlYXRlX29wdGlvbnMsIHRoaXMpO1xuICAgICAgICAgIHRoaXMuX19rYi52aWV3X21vZGVsW3ZtX2tleV0gPSB0aGlzW3ZtX2tleV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vLyBGYWN0b3J5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIGtiLlZpZXdNb2RlbC5cbmV4cG9ydCBjb25zdCB2aWV3TW9kZWwgPSAoLi4uYXJncykgPT4gbmV3IFZpZXdNb2RlbCguLi5hcmdzKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9iYWNrYm9uZV9fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9rbm9ja291dF9fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV91bmRlcnNjb3JlX187Il0sInNvdXJjZVJvb3QiOiIifQ==