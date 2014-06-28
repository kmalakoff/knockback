<<<<<<< HEAD
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Backbone"), require("_"), require("ko"), require("default-observable"), require("formatted-observable"), require("localized-observable"), require("statistics"), require("triggered-observable"), require("validation"));
	else if(typeof define === 'function' && define.amd)
		define(["Backbone", "_", "ko", "default-observable", "formatted-observable", "localized-observable", "statistics", "triggered-observable", "validation"], factory);
	else if(typeof exports === 'object')
		exports["knockback"] = factory(require("Backbone"), require("_"), require("ko"), require("default-observable"), require("formatted-observable"), require("localized-observable"), require("statistics"), require("triggered-observable"), require("validation"));
	else
		root["knockback"] = factory(root["Backbone"], root["_"], root["ko"], root["default-observable"], root["formatted-observable"], root["localized-observable"], root["statistics"], root["triggered-observable"], root["validation"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_9__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone, component, err, kb, _i, _len, _ref;

	if (this.Parse) {
	  this.Backbone = this.Parse;
	  this._ = this.Parse._;
	}

	if ((typeof window !== "undefined" && window !== null) && __webpack_require__(10).shim) {
	  __webpack_require__(10).shim([
	    {
	      symbol: '_',
	      path: 'lodash',
	      alias: 'underscore',
	      optional: true
	    }, {
	      symbol: '_',
	      path: 'underscore'
	    }, {
	      symbol: 'Backbone',
	      path: 'backbone'
	    }, {
	      symbol: 'ko',
	      path: 'knockout'
	    }
	  ]);
	}

	module.exports = kb = __webpack_require__(11);

	if (this.Parse) {
	  Backbone = kb.Parse = this.Parse;
	} else {
	  Backbone = kb.Backbone = __webpack_require__(1);
	}

	kb.Collection = Backbone.Collection;

	kb.Model = Backbone.Object || Backbone.Model;

	kb.Events = Backbone.Events;

	kb._ = __webpack_require__(2);

	kb.ko = __webpack_require__(3);

	__webpack_require__(12);

	__webpack_require__(13);

	__webpack_require__(14);

	__webpack_require__(15);

	__webpack_require__(16);

	__webpack_require__(17);

	__webpack_require__(12);

	__webpack_require__(18);

	__webpack_require__(19);

	__webpack_require__(20);

	try {
	  __webpack_require__(4);
	} catch (_error) {
	  err = _error;
	  ({});
	}

	try {
	  __webpack_require__(5);
	} catch (_error) {
	  err = _error;
	  ({});
	}

	try {
	  __webpack_require__(6);
	} catch (_error) {
	  err = _error;
	  ({});
	}

	try {
	  __webpack_require__(7);
	} catch (_error) {
	  err = _error;
	  ({});
	}

	try {
	  __webpack_require__(8);
	} catch (_error) {
	  err = _error;
	  ({});
	}

	try {
	  __webpack_require__(9);
	} catch (_error) {
	  err = _error;
	  ({});
	}

	kb.modules = {};

	_ref = ['underscore', 'backbone', 'knockout'];
	for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	  component = _ref[_i];
	  kb.modules[component] = __webpack_require__(10)(component);
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./collection-observable": 18,
		"./collection-observable.coffee": 18,
		"./event-watcher": 13,
		"./event-watcher.coffee": 13,
		"./factory": 15,
		"./factory.coffee": 15,
		"./inject": 20,
		"./inject.coffee": 20,
		"./kb": 11,
		"./kb.coffee": 11,
		"./observable": 16,
		"./observable.coffee": 16,
		"./orm": 19,
		"./orm.coffee": 19,
		"./store": 14,
		"./store.coffee": 14,
		"./utils": 12,
		"./utils.coffee": 12,
		"./view-model": 17,
		"./view-model.coffee": 17
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var copyProps, kb, ko, _;

	_ = __webpack_require__(2);

	ko = __webpack_require__(3);

	copyProps = function(dest, source) {
	  var key, value;
	  for (key in source) {
	    value = source[key];
	    dest[key] = value;
	  }
	  return dest;
	};

	// Shared empty constructor function to aid in prototype-chain creation.
	var ctor = function(){};

	// Helper function to correctly set up the prototype chain, for subclasses.
	// Similar to 'goog.inherits', but uses a hash of prototype properties and
	// class properties to be extended.
	var inherits = function(parent, protoProps, staticProps) {
	  var child;

	  // The constructor function for the new subclass is either defined by you
	  // (the "constructor" property in your extend definition), or defaulted
	  // by us to simply call the parent's constructor.
	  if (protoProps && protoProps.hasOwnProperty('constructor')) {
	    child = protoProps.constructor;
	  } else {
	    child = function(){ parent.apply(this, arguments); };
	  }

	  // Inherit class (static) properties from parent.
	  copyProps(child, parent);

	  // Set the prototype chain to inherit from parent, without calling
	  // parent's constructor function.
	  ctor.prototype = parent.prototype;
	  child.prototype = new ctor();

	  // Add prototype properties (instance properties) to the subclass,
	  // if supplied.
	  if (protoProps) copyProps(child.prototype, protoProps);

	  // Add static properties to the constructor function, if supplied.
	  if (staticProps) copyProps(child, staticProps);

	  // Correctly set child's 'prototype.constructor'.
	  child.prototype.constructor = child;

	  // Set a convenience property in case the parent's prototype is needed later.
	  child.__super__ = parent.prototype;

	  return child;
	};

	// The self-propagating extend function that BacLCone classes use.
	var extend = function (protoProps, classProps) {
	  var child = inherits(this, protoProps, classProps);
	  child.extend = this.extend;
	  return child;
	};
	;

	module.exports = kb = (function() {
	  var _ref;

	  function kb() {}

	  kb.VERSION = '0.18.6';

	  kb.TYPE_UNKNOWN = 0;

	  kb.TYPE_SIMPLE = 1;

	  kb.TYPE_ARRAY = 2;

	  kb.TYPE_MODEL = 3;

	  kb.TYPE_COLLECTION = 4;

	  kb.wasReleased = function(obj) {
	    return !obj || obj.__kb_released;
	  };

	  kb.isReleaseable = function(obj, depth) {
	    var key, value;
	    if (depth == null) {
	      depth = 0;
	    }
	    if ((!obj || (obj !== Object(obj))) || obj.__kb_released) {
	      return false;
	    } else if (ko.isObservable(obj) || (obj instanceof kb.ViewModel)) {
	      return true;
	    } else if ((typeof obj === 'function') || (obj instanceof kb.Model) || (obj instanceof kb.Collection)) {
	      return false;
	    } else if ((typeof obj.dispose === 'function') || (typeof obj.destroy === 'function') || (typeof obj.release === 'function')) {
	      return true;
	    } else if (depth < 1) {
	      for (key in obj) {
	        value = obj[key];
	        if ((key !== '__kb') && kb.isReleaseable(value, depth + 1)) {
	          return true;
	        }
	      }
	    }
	    return false;
	  };

	  kb.release = function(obj) {
	    var array, index, value;
	    if (!kb.isReleaseable(obj)) {
	      return;
	    }
	    if (_.isArray(obj)) {
	      for (index in obj) {
	        value = obj[index];
	        if (kb.isReleaseable(value)) {
	          obj[index] = null;
	          kb.release(value);
	        }
	      }
	      return;
	    }
	    obj.__kb_released = true;
	    if (ko.isObservable(obj) && _.isArray(array = kb.peek(obj))) {
	      if (obj.__kb_is_co || (obj.__kb_is_o && (obj.valueType() === kb.TYPE_COLLECTION))) {
	        if (obj.destroy) {
	          obj.destroy();
	        } else if (obj.dispose) {
	          obj.dispose();
	        }
	      } else if (array.length) {
	        for (index in array) {
	          value = array[index];
	          if (kb.isReleaseable(value)) {
	            array[index] = null;
	            kb.release(value);
	          }
	        }
	      }
	    } else if (typeof obj.release === 'function') {
	      obj.release();
	    } else if (typeof obj.destroy === 'function') {
	      obj.destroy();
	    } else if (typeof obj.dispose === 'function') {
	      obj.dispose();
	    } else if (!ko.isObservable(obj)) {
	      this.releaseKeys(obj);
	    }
	  };

	  kb.releaseKeys = function(obj) {
	    var key, value;
	    for (key in obj) {
	      value = obj[key];
	      if ((key !== '__kb') && kb.isReleaseable(value)) {
	        obj[key] = null;
	        kb.release(value);
	      }
	    }
	  };

	  kb.releaseOnNodeRemove = function(view_model, node) {
	    view_model || kb._throwUnexpected(this, 'missing view model');
	    node || kb._throwUnexpected(this, 'missing node');
	    return ko.utils.domNodeDisposal.addDisposeCallback(node, function() {
	      return kb.release(view_model);
	    });
	  };

	  kb.renderTemplate = function(template, view_model, options) {
	    var el, observable;
	    if (options == null) {
	      options = {};
	    }
	    if (typeof document === "undefined" || document === null) {
	      return typeof console !== "undefined" && console !== null ? console.log('renderTemplate: document is undefined') : void 0;
	    }
	    el = document.createElement('div');
	    observable = ko.renderTemplate(template, view_model, options, el, 'replaceChildren');
	    if (el.children.length === 1) {
	      el = el.children[0];
	    }
	    kb.releaseOnNodeRemove(view_model, el);
	    observable.dispose();
	    if (view_model.afterRender && !options.afterRender) {
	      view_model.afterRender(el);
	    }
	    return el;
	  };

	  kb.applyBindings = function(view_model, node) {
	    ko.applyBindings(view_model, node);
	    return kb.releaseOnNodeRemove(view_model, node);
	  };

	  kb.getValue = function(model, key, args) {
	    if (!model) {
	      return;
	    }
	    if (_.isFunction(model[key]) && kb.orm.useFunction(model, key)) {
	      return model[key]();
	    }
	    if (!args) {
	      return model.get(key);
	    }
	    return model.get.apply(model, _.map([key].concat(args), function(value) {
	      return kb.peek(value);
	    }));
	  };

	  kb.setValue = function(model, key, value) {
	    var attributes;
	    if (!model) {
	      return;
	    }
	    if (_.isFunction(model[key]) && kb.orm.useFunction(model, key)) {
	      return model[key](value);
	    }
	    (attributes = {})[key] = value;
	    return model.set(attributes);
	  };

	  kb.ignore = ((_ref = ko.dependencyDetection) != null ? _ref.ignore : void 0) || function(callback, callbackTarget, callbackArgs) {
	    var value;
	    value = null;
	    ko.dependentObservable(function() {
	      return value = callback.apply(callbackTarget, callbackArgs || []);
	    }).dispose();
	    return value;
	  };

	  kb.extend = extend;

	  kb._throwMissing = function(instance, message) {
	    throw "" + (_.isString(instance) ? instance : instance.constructor.name) + ": " + message + " is missing";
	  };

	  kb._throwUnexpected = function(instance, message) {
	    throw "" + (_.isString(instance) ? instance : instance.constructor.name) + ": " + message + " is unexpected";
	  };

	  kb.publishMethods = function(observable, instance, methods) {
	    var fn, _i, _len;
	    for (_i = 0, _len = methods.length; _i < _len; _i++) {
	      fn = methods[_i];
	      observable[fn] = kb._.bind(instance[fn], instance);
	    }
	  };

	  kb.peek = function(obs) {
	    if (!ko.isObservable(obs)) {
	      return obs;
	    }
	    if (obs.peek) {
	      return obs.peek();
	    }
	    return kb.ignore(function() {
	      return obs();
	    });
	  };

	  return kb;

	})();


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var kb, ko, _, _argumentsAddKey, _keyArrayToObject, _mergeArray, _mergeObject, _wrappedKey;

	kb = __webpack_require__(11);

	_ = __webpack_require__(2);

	ko = __webpack_require__(3);

	_wrappedKey = kb._wrappedKey = function(obj, key, value) {
	  if (arguments.length === 2) {
	    if (obj && obj.__kb && obj.__kb.hasOwnProperty(key)) {
	      return obj.__kb[key];
	    } else {
	      return void 0;
	    }
	  }
	  obj || kb._throwUnexpected(this, "no obj for wrapping " + key);
	  obj.__kb || (obj.__kb = {});
	  obj.__kb[key] = value;
	  return value;
	};

	_argumentsAddKey = function(args, key) {
	  Array.prototype.splice.call(args, 1, 0, key);
	  return args;
	};

	_mergeArray = function(result, key, value) {
	  result[key] || (result[key] = []);
	  if (!_.isArray(value)) {
	    value = [value];
	  }
	  result[key] = result[key].length ? _.union(result[key], value) : value;
	  return result;
	};

	_mergeObject = function(result, key, value) {
	  result[key] || (result[key] = {});
	  return _.extend(result[key], value);
	};

	_keyArrayToObject = function(value) {
	  var item, result, _i, _len;
	  result = {};
	  for (_i = 0, _len = value.length; _i < _len; _i++) {
	    item = value[_i];
	    result[item] = {
	      key: item
	    };
	  }
	  return result;
	};

	kb.utils = (function() {
	  function utils() {}

	  utils.wrappedObservable = function(obj, value) {
	    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'observable'));
	  };

	  utils.wrappedObject = function(obj, value) {
	    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'object'));
	  };

	  utils.wrappedModel = function(obj, value) {
	    if (arguments.length === 1) {
	      value = _wrappedKey(obj, 'object');
	      if (_.isUndefined(value)) {
	        return obj;
	      } else {
	        return value;
	      }
	    } else {
	      return _wrappedKey(obj, 'object', value);
	    }
	  };

	  utils.wrappedStore = function(obj, value) {
	    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'store'));
	  };

	  utils.wrappedStoreIsOwned = function(obj, value) {
	    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'store_is_owned'));
	  };

	  utils.wrappedFactory = function(obj, value) {
	    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'factory'));
	  };

	  utils.wrappedEventWatcher = function(obj, value) {
	    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'event_watcher'));
	  };

	  utils.wrappedEventWatcherIsOwned = function(obj, value) {
	    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'event_watcher_is_owned'));
	  };

	  utils.wrappedDestroy = function(obj) {
	    var __kb;
	    if (!obj.__kb) {
	      return;
	    }
	    if (obj.__kb.event_watcher) {
	      obj.__kb.event_watcher.releaseCallbacks(obj);
	    }
	    __kb = obj.__kb;
	    obj.__kb = null;
	    if (__kb.observable) {
	      __kb.observable.destroy = __kb.observable.release = null;
	      this.wrappedDestroy(__kb.observable);
	      __kb.observable = null;
	    }
	    __kb.factory = null;
	    if (__kb.event_watcher_is_owned) {
	      __kb.event_watcher.destroy();
	    }
	    __kb.event_watcher = null;
	    if (__kb.store_is_owned) {
	      __kb.store.destroy();
	    }
	    return __kb.store = null;
	  };

	  utils.valueType = function(observable) {
	    if (!observable) {
	      return kb.TYPE_UNKNOWN;
	    }
	    if (observable.__kb_is_o) {
	      return observable.valueType();
	    }
	    if (observable.__kb_is_co || (observable instanceof kb.Collection)) {
	      return kb.TYPE_COLLECTION;
	    }
	    if ((observable instanceof kb.ViewModel) || (observable instanceof kb.Model)) {
	      return kb.TYPE_MODEL;
	    }
	    if (_.isArray(observable)) {
	      return kb.TYPE_ARRAY;
	    }
	    return kb.TYPE_SIMPLE;
	  };

	  utils.pathJoin = function(path1, path2) {
	    return (path1 ? (path1[path1.length - 1] !== '.' ? "" + path1 + "." : path1) : '') + path2;
	  };

	  utils.optionsPathJoin = function(options, path) {
	    return _.defaults({
	      path: this.pathJoin(options.path, path)
	    }, options);
	  };

	  utils.inferCreator = function(value, factory, path, owner, key) {
	    var creator;
	    if (factory) {
	      creator = factory.creatorForPath(value, path);
	    }
	    if (creator) {
	      return creator;
	    }
	    if (!value) {
	      return null;
	    }
	    if (value instanceof kb.Model) {
	      return kb.ViewModel;
	    }
	    if (value instanceof kb.Collection) {
	      return kb.CollectionObservable;
	    }
	    return null;
	  };

	  utils.createFromDefaultCreator = function(obj, options) {
	    if (obj instanceof kb.Model) {
	      return kb.viewModel(obj, options);
	    }
	    if (obj instanceof kb.Collection) {
	      return kb.collectionObservable(obj, options);
	    }
	    if (_.isArray(obj)) {
	      return ko.observableArray(obj);
	    }
	    return ko.observable(obj);
	  };

	  utils.hasModelSignature = function(obj) {
	    return obj && (obj.attributes && !obj.models) && (typeof obj.get === 'function') && (typeof obj.trigger === 'function');
	  };

	  utils.hasCollectionSignature = function(obj) {
	    return obj && obj.models && (typeof obj.get === 'function') && (typeof obj.trigger === 'function');
	  };

	  utils.collapseOptions = function(options) {
	    var key, result, value, _ref;
	    result = {};
	    options = {
	      options: options
	    };
	    while (options.options) {
	      _ref = options.options;
	      for (key in _ref) {
	        value = _ref[key];
	        switch (key) {
	          case 'internals':
	          case 'requires':
	          case 'excludes':
	          case 'statics':
	            _mergeArray(result, key, value);
	            break;
	          case 'keys':
	            if ((_.isObject(value) && !_.isArray(value)) || (_.isObject(result[key]) && !_.isArray(result[key]))) {
	              if (!_.isObject(value)) {
	                value = [value];
	              }
	              if (_.isArray(value)) {
	                value = _keyArrayToObject(value);
	              }
	              if (_.isArray(result[key])) {
	                result[key] = _keyArrayToObject(result[key]);
	              }
	              _mergeObject(result, key, value);
	            } else {
	              _mergeArray(result, key, value);
	            }
	            break;
	          case 'factories':
	            if (_.isFunction(value)) {
	              result[key] = value;
	            } else {
	              _mergeObject(result, key, value);
	            }
	            break;
	          case 'static_defaults':
	            _mergeObject(result, key, value);
	            break;
	          case 'options':
	            break;
	          default:
	            result[key] = value;
	        }
	      }
	      options = options.options;
	    }
	    return result;
	  };

	  utils.unwrapModels = function(obj) {
	    var key, result, value;
	    if (!obj) {
	      return obj;
	    }
	    if (obj.__kb) {
	      if ('object' in obj.__kb) {
	        return obj.__kb.object;
	      } else {
	        return obj;
	      }
	    } else if (_.isArray(obj)) {
	      return _.map(obj, function(test) {
	        return kb.utils.unwrapModels(test);
	      });
	    } else if (_.isObject(obj) && (obj.constructor === {}.constructor)) {
	      result = {};
	      for (key in obj) {
	        value = obj[key];
	        result[key] = kb.utils.unwrapModels(value);
	      }
	      return result;
	    }
	    return obj;
	  };

	  return utils;

	})();


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var kb, ko, _,
	  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	kb = __webpack_require__(11);

	_ = __webpack_require__(2);

	ko = __webpack_require__(3);

	kb.EventWatcher = (function() {
	  EventWatcher.useOptionsOrCreate = function(options, emitter, obj, callback_options) {
	    if (options.event_watcher) {
	      if (!(options.event_watcher.emitter() === emitter || (options.event_watcher.model_ref === emitter))) {
	        kb._throwUnexpected(this, 'emitter not matching');
	      }
	      return kb.utils.wrappedEventWatcher(obj, options.event_watcher).registerCallbacks(obj, callback_options);
	    } else {
	      kb.utils.wrappedEventWatcherIsOwned(obj, true);
	      return kb.utils.wrappedEventWatcher(obj, new kb.EventWatcher(emitter)).registerCallbacks(obj, callback_options);
	    }
	  };

	  function EventWatcher(emitter, obj, callback_options) {
	    this._onModelUnloaded = __bind(this._onModelUnloaded, this);
	    this._onModelLoaded = __bind(this._onModelLoaded, this);
	    this.__kb || (this.__kb = {});
	    this.__kb.callbacks = {};
	    this.__kb._onModelLoaded = _.bind(this._onModelLoaded, this);
	    this.__kb._onModelUnloaded = _.bind(this._onModelUnloaded, this);
	    if (callback_options) {
	      this.registerCallbacks(obj, callback_options);
	    }
	    if (emitter) {
	      this.emitter(emitter);
	    } else {
	      this.ee = null;
	    }
	  }

	  EventWatcher.prototype.destroy = function() {
	    this.emitter(null);
	    this.__kb.callbacks = null;
	    return kb.utils.wrappedDestroy(this);
	  };

	  EventWatcher.prototype.emitter = function(new_emitter) {
	    var callbacks, event_name, info, list, previous_emitter, _i, _len, _ref;
	    if ((arguments.length === 0) || (this.ee === new_emitter)) {
	      return this.ee;
	    }
	    if (this.model_ref) {
	      this.model_ref.unbind('loaded', this.__kb._onModelLoaded);
	      this.model_ref.unbind('unloaded', this.__kb._onModelUnloaded);
	      this.model_ref.release();
	      this.model_ref = null;
	    }
	    if (kb.Backbone && kb.Backbone.ModelRef && (new_emitter instanceof kb.Backbone.ModelRef)) {
	      this.model_ref = new_emitter;
	      this.model_ref.retain();
	      this.model_ref.bind('loaded', this.__kb._onModelLoaded);
	      this.model_ref.bind('unloaded', this.__kb._onModelUnloaded);
	      new_emitter = this.model_ref.model();
	    } else {
	      delete this.model_ref;
	    }
	    previous_emitter = this.ee;
	    this.ee = new_emitter;
	    _ref = this.__kb.callbacks;
	    for (event_name in _ref) {
	      callbacks = _ref[event_name];
	      if (previous_emitter) {
	        previous_emitter.unbind(event_name, callbacks.fn);
	      }
	      if (new_emitter) {
	        this.ee.bind(event_name, callbacks.fn);
	      }
	      list = callbacks.list;
	      for (_i = 0, _len = list.length; _i < _len; _i++) {
	        info = list[_i];
	        if (info.emitter) {
	          info.emitter(this.ee);
	        }
	      }
	    }
	    return new_emitter;
	  };

	  EventWatcher.prototype.registerCallbacks = function(obj, callback_info) {
	    var callbacks, event_name, event_names, event_selector, info, list, _i, _len;
	    obj || kb._throwMissing(this, 'obj');
	    callback_info || kb._throwMissing(this, 'info');
	    event_selector = callback_info.event_selector ? callback_info.event_selector : 'change';
	    event_names = event_selector.split(' ');
	    for (_i = 0, _len = event_names.length; _i < _len; _i++) {
	      event_name = event_names[_i];
	      if (!event_name) {
	        continue;
	      }
	      callbacks = this.__kb.callbacks[event_name];
	      if (!callbacks) {
	        list = [];
	        callbacks = {
	          list: list,
	          fn: (function(_this) {
	            return function(model) {
	              var info, _j, _len1;
	              for (_j = 0, _len1 = list.length; _j < _len1; _j++) {
	                info = list[_j];
	                if (info.update && !info.rel_fn) {
	                  if (model && info.key && (model.hasChanged && !model.hasChanged(ko.utils.unwrapObservable(info.key)))) {
	                    continue;
	                  }
	                  !kb.statistics || kb.statistics.addModelEvent({
	                    name: event_name,
	                    model: model,
	                    key: info.key,
	                    path: info.path
	                  });
	                  info.update();
	                }
	              }
	              return null;
	            };
	          })(this)
	        };
	        this.__kb.callbacks[event_name] = callbacks;
	        if (this.ee) {
	          this.ee.bind(event_name, callbacks.fn);
	        }
	      }
	      info = _.defaults({
	        obj: obj
	      }, callback_info);
	      callbacks.list.push(info);
	    }
	    if (this.ee) {
	      if (__indexOf.call(event_names, 'change') >= 0) {
	        info.unbind_fn = kb.orm.bind(this.ee, info.key, info.update, info.path);
	      }
	      info.emitter(this.ee) && info.emitter;
	    }
	  };

	  EventWatcher.prototype.releaseCallbacks = function(obj) {
	    var callbacks, event_name, index, info, _ref, _ref1;
	    if (!this.__kb.callbacks || !this.ee) {
	      return;
	    }
	    _ref = this.__kb.callbacks;
	    for (event_name in _ref) {
	      callbacks = _ref[event_name];
	      _ref1 = callbacks.list;
	      for (index in _ref1) {
	        info = _ref1[index];
	        if (info.obj !== obj) {
	          continue;
	        }
	        callbacks.list.splice(index, 1);
	        if (info.unbind_fn) {
	          info.unbind_fn();
	          info.unbind_fn = null;
	        }
	        if (!kb.wasReleased(obj) && info.emitter) {
	          info.emitter(null);
	        }
	        return;
	      }
	    }
	  };

	  EventWatcher.prototype._onModelLoaded = function(model) {
	    var callbacks, event_name, info, _i, _len, _ref, _ref1;
	    this.ee = model;
	    _ref = this.__kb.callbacks;
	    for (event_name in _ref) {
	      callbacks = _ref[event_name];
	      model.bind(event_name, callbacks.fn);
	      _ref1 = callbacks.list;
	      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	        info = _ref1[_i];
	        info.unbind_fn = kb.orm.bind(model, info.key, info.update, info.path);
	        if (info.emitter) {
	          info.emitter(model);
	        }
	      }
	    }
	  };

	  EventWatcher.prototype._onModelUnloaded = function(model) {
	    var callbacks, event_name, info, list, _i, _len, _ref;
	    this.ee = null;
	    _ref = this.__kb.callbacks;
	    for (event_name in _ref) {
	      callbacks = _ref[event_name];
	      model.unbind(event_name, callbacks.fn);
	      list = callbacks.list;
	      for (_i = 0, _len = list.length; _i < _len; _i++) {
	        info = list[_i];
	        if (info.unbind_fn) {
	          info.unbind_fn();
	          info.unbind_fn = null;
	        }
	        if (info.emitter) {
	          info.emitter(null);
	        }
	      }
	    }
	  };

	  return EventWatcher;

	})();

	kb.emitterObservable = function(emitter, observable) {
	  return new kb.EventWatcher(emitter, observable);
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var kb, ko, _;

	kb = __webpack_require__(11);

	_ = __webpack_require__(2);

	ko = __webpack_require__(3);

	module.exports = kb.Store = (function() {
	  Store.useOptionsOrCreate = function(options, obj, observable) {
	    if (options.store) {
	      options.store.register(obj, observable, options);
	      return kb.utils.wrappedStore(observable, options.store);
	    } else {
	      kb.utils.wrappedStoreIsOwned(observable, true);
	      return kb.utils.wrappedStore(observable, new kb.Store());
	    }
	  };

	  function Store() {
	    this.observable_records = [];
	    this.replaced_observables = [];
	  }

	  Store.prototype.destroy = function() {
	    return this.clear();
	  };

	  Store.prototype.clear = function() {
	    var record, _i, _len, _ref;
	    _ref = this.observable_records.splice(0, this.observable_records.length);
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      record = _ref[_i];
	      kb.release(record.observable);
	    }
	    kb.release(this.replaced_observables);
	  };

	  Store.prototype.compact = function() {
	    var index, record, removals, _ref, _ref1;
	    removals = [];
	    _ref = this.observable_records;
	    for (index in _ref) {
	      record = _ref[index];
	      if ((_ref1 = record.observable) != null ? _ref1.__kb_released : void 0) {
	        removals.push(record);
	      }
	    }
	    if (removals.length) {
	      this.observable_records = _.difference(this.observable_records, removals);
	    }
	  };

	  Store.prototype.register = function(obj, observable, options) {
	    var creator;
	    if (!observable) {
	      return;
	    }
	    if (ko.isObservable(observable) || observable.__kb_is_co) {
	      return;
	    }
	    kb.utils.wrappedObject(observable, obj);
	    obj || (observable.__kb_null = true);
	    creator = options.creator ? options.creator : (options.path && options.factory ? options.factory.creatorForPath(obj, options.path) : null);
	    if (!creator) {
	      creator = observable.constructor;
	    }
	    this.observable_records.push({
	      obj: obj,
	      observable: observable,
	      creator: creator
	    });
	    return observable;
	  };

	  Store.prototype.findIndex = function(obj, creator) {
	    var index, record, removals, _ref;
	    removals = [];
	    if (!obj || (obj instanceof kb.Model)) {
	      _ref = this.observable_records;
	      for (index in _ref) {
	        record = _ref[index];
	        if (!record.observable) {
	          continue;
	        }
	        if (record.observable.__kb_released) {
	          removals.push(record);
	          continue;
	        }
	        if ((!obj && !record.observable.__kb_null) || (obj && (record.observable.__kb_null || (record.obj !== obj)))) {
	          continue;
	        } else if ((record.creator === creator) || (record.creator.create && (record.creator.create === creator.create))) {
	          if (removals.length) {
	            this.observable_records = _.difference(this.observable_records, removals);
	            return _.indexOf(this.observable_records, record);
	          } else {
	            return index;
	          }
	        }
	      }
	    }
	    if (removals.length) {
	      this.observable_records = _.difference(this.observable_records, removals);
	    }
	    return -1;
	  };

	  Store.prototype.find = function(obj, creator) {
	    var index;
	    if ((index = this.findIndex(obj, creator)) < 0) {
	      return null;
	    } else {
	      return this.observable_records[index].observable;
	    }
	  };

	  Store.prototype.isRegistered = function(observable) {
	    var record, _i, _len, _ref;
	    _ref = this.observable_records;
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      record = _ref[_i];
	      if (record.observable === observable) {
	        return true;
	      }
	    }
	    return false;
	  };

	  Store.prototype.findOrCreate = function(obj, options) {
	    var creator, observable;
	    options.store = this;
	    options.creator || (options.creator = kb.utils.inferCreator(obj, options.factory, options.path));
	    if (!options.creator && (obj instanceof kb.Model)) {
	      options.creator = kb.ViewModel;
	    }
	    creator = options.creator;
	    if (!creator) {
	      return kb.utils.createFromDefaultCreator(obj, options);
	    } else if (creator.models_only) {
	      return obj;
	    }
	    if (creator) {
	      observable = this.find(obj, creator);
	    }
	    if (observable) {
	      return observable;
	    }
	    observable = kb.ignore((function(_this) {
	      return function() {
	        if (creator.create) {
	          observable = creator.create(obj, options);
	        } else {
	          observable = new creator(obj, options);
	        }
	        return observable || ko.observable(null);
	      };
	    })(this));
	    if (!ko.isObservable(observable)) {
	      this.isRegistered(observable) || this.register(obj, observable, options);
	    }
	    return observable;
	  };

	  Store.prototype.findOrReplace = function(obj, creator, observable) {
	    var index, record;
	    obj || kb._throwUnexpected(this, 'obj missing');
	    if ((index = this.findIndex(obj, creator)) < 0) {
	      return this.register(obj, observable, {
	        creator: creator
	      });
	    } else {
	      record = this.observable_records[index];
	      (kb.utils.wrappedObject(record.observable) === obj) || kb._throwUnexpected(this, 'different object');
	      if (record.observable !== observable) {
	        (record.observable.constructor === observable.constructor) || kb._throwUnexpected(this, 'replacing different type');
	        this.replaced_observables.push(record.observable);
	        record.observable = observable;
	      }
	      return observable;
	    }
	  };

	  return Store;

	})();


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var kb, _;

	kb = __webpack_require__(11);

	_ = __webpack_require__(2);

	kb.Factory = (function() {
	  Factory.useOptionsOrCreate = function(options, obj, owner_path) {
	    var factory;
	    if (options.factory && (!options.factories || (options.factories && options.factory.hasPathMappings(options.factories, owner_path)))) {
	      return kb.utils.wrappedFactory(obj, options.factory);
	    }
	    factory = kb.utils.wrappedFactory(obj, new kb.Factory(options.factory));
	    if (options.factories) {
	      factory.addPathMappings(options.factories, owner_path);
	    }
	    return factory;
	  };

	  function Factory(parent_factory) {
	    this.parent_factory = parent_factory;
	    this.paths = {};
	  }

	  Factory.prototype.hasPath = function(path) {
	    return this.paths.hasOwnProperty(path) || (this.parent_factory && this.parent_factory.hasPath(path));
	  };

	  Factory.prototype.addPathMapping = function(path, create_info) {
	    return this.paths[path] = create_info;
	  };

	  Factory.prototype.addPathMappings = function(factories, owner_path) {
	    var create_info, path;
	    for (path in factories) {
	      create_info = factories[path];
	      this.paths[kb.utils.pathJoin(owner_path, path)] = create_info;
	    }
	  };

	  Factory.prototype.hasPathMappings = function(factories, owner_path) {
	    var all_exist, creator, existing_creator, path;
	    all_exist = true;
	    for (path in factories) {
	      creator = factories[path];
	      all_exist &= (existing_creator = this.creatorForPath(null, kb.utils.pathJoin(owner_path, path))) && (creator === existing_creator);
	    }
	    return all_exist;
	  };

	  Factory.prototype.creatorForPath = function(obj, path) {
	    var creator;
	    if ((creator = this.paths[path])) {
	      if (creator.view_model) {
	        return creator.view_model;
	      } else {
	        return creator;
	      }
	    }
	    if (this.parent_factory) {
	      if ((creator = this.parent_factory.creatorForPath(obj, path))) {
	        return creator;
	      }
	    }
	    return null;
	  };

	  return Factory;

	})();


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var kb, ko, _;

	kb = __webpack_require__(11);

	_ = __webpack_require__(2);

	ko = __webpack_require__(3);

	kb.Observable = (function() {
	  function Observable(model, options, _vm) {
	    this._vm = _vm != null ? _vm : {};
	    return kb.ignore((function(_this) {
	      return function() {
	        var create_options, event_watcher, observable;
	        options || kb._throwMissing(_this, 'options');
	        if (_.isString(options) || ko.isObservable(options)) {
	          create_options = _this.create_options = {
	            key: options
	          };
	        } else {
	          create_options = _this.create_options = kb.utils.collapseOptions(options);
	        }
	        _this.key = create_options.key;
	        delete create_options.key;
	        _this.key || kb._throwMissing(_this, 'key');
	        !create_options.args || (_this.args = create_options.args, delete create_options.args);
	        !create_options.read || (_this.read = create_options.read, delete create_options.read);
	        !create_options.write || (_this.write = create_options.write, delete create_options.write);
	        event_watcher = create_options.event_watcher;
	        delete create_options.event_watcher;
	        _this._vo = ko.observable(null);
	        _this._model = ko.observable();
	        observable = kb.utils.wrappedObservable(_this, ko.dependentObservable({
	          read: function() {
	            var arg, args, _i, _len, _model, _ref;
	            _model = _this._model();
	            _ref = args = [_this.key].concat(_this.args || []);
	            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	              arg = _ref[_i];
	              ko.utils.unwrapObservable(arg);
	            }
	            if (_this.read) {
	              _this.update(_this.read.apply(_this._vm, args));
	            } else if (!_.isUndefined(_model)) {
	              kb.ignore(function() {
	                return _this.update(kb.getValue(_model, kb.peek(_this.key), _this.args));
	              });
	            }
	            return ko.utils.unwrapObservable(_this._vo());
	          },
	          write: function(new_value) {
	            return kb.ignore(function() {
	              var unwrapped_new_value, _model;
	              unwrapped_new_value = kb.utils.unwrapModels(new_value);
	              _model = kb.peek(_this._model);
	              if (_this.write) {
	                _this.write.call(_this._vm, unwrapped_new_value);
	                new_value = kb.getValue(_model, kb.peek(_this.key), _this.args);
	              } else if (_model) {
	                kb.setValue(_model, kb.peek(_this.key), unwrapped_new_value);
	              }
	              return _this.update(new_value);
	            });
	          },
	          owner: _this._vm
	        }));
	        observable.__kb_is_o = true;
	        create_options.store = kb.utils.wrappedStore(observable, create_options.store);
	        create_options.path = kb.utils.pathJoin(create_options.path, _this.key);
	        if (create_options.factories && ((typeof create_options.factories === 'function') || create_options.factories.create)) {
	          create_options.factory = kb.utils.wrappedFactory(observable, new kb.Factory(create_options.factory));
	          create_options.factory.addPathMapping(create_options.path, create_options.factories);
	        } else {
	          create_options.factory = kb.Factory.useOptionsOrCreate(create_options, observable, create_options.path);
	        }
	        delete create_options.factories;
	        kb.publishMethods(observable, _this, ['value', 'valueType', 'destroy']);
	        observable.model = _this.model = ko.dependentObservable({
	          read: function() {
	            return ko.utils.unwrapObservable(_this._model);
	          },
	          write: function(new_model) {
	            return kb.ignore(function() {
	              var new_value;
	              if (_this.__kb_released || (kb.peek(_this._model) === new_model)) {
	                return;
	              }
	              new_value = kb.getValue(new_model, kb.peek(_this.key), _this.args);
	              _this._model(new_model);
	              if (!new_model) {
	                return _this.update(null);
	              } else if (!_.isUndefined(new_value)) {
	                return _this.update(new_value);
	              }
	            });
	          }
	        });
	        kb.EventWatcher.useOptionsOrCreate({
	          event_watcher: event_watcher
	        }, model, _this, {
	          emitter: _this.model,
	          update: _.bind(_this.update, _this),
	          key: _this.key,
	          path: create_options.path
	        });
	        _this.__kb_value || _this.update();
	        if (kb.LocalizedObservable && create_options.localizer) {
	          observable = new create_options.localizer(observable);
	          delete create_options.localizer;
	        }
	        if (kb.DefaultObservable && create_options.hasOwnProperty('default')) {
	          observable = kb.defaultObservable(observable, create_options["default"]);
	          delete create_options["default"];
	        }
	        return observable;
	      };
	    })(this));
	  }

	  Observable.prototype.destroy = function() {
	    var observable;
	    observable = kb.utils.wrappedObservable(this);
	    this.__kb_released = true;
	    kb.release(this.__kb_value);
	    this.__kb_value = null;
	    this.model.dispose();
	    this.model = observable.model = null;
	    return kb.utils.wrappedDestroy(this);
	  };

	  Observable.prototype.value = function() {
	    return this.__kb_value;
	  };

	  Observable.prototype.valueType = function() {
	    var new_value;
	    new_value = kb.getValue(kb.peek(this._model), kb.peek(this.key));
	    this.value_type || this._updateValueObservable(new_value);
	    return this.value_type;
	  };

	  Observable.prototype.update = function(new_value) {
	    var new_type, value;
	    if (this.__kb_released) {
	      return;
	    }
	    if (!arguments.length) {
	      new_value = kb.getValue(kb.peek(this._model), kb.peek(this.key));
	    }
	    (new_value !== void 0) || (new_value = null);
	    new_type = kb.utils.valueType(new_value);
	    if (!this.__kb_value || (this.__kb_value.__kb_released || (this.__kb_value.__kb_null && new_value))) {
	      this.__kb_value = void 0;
	      this.value_type = void 0;
	    }
	    value = this.__kb_value;
	    if (_.isUndefined(this.value_type) || (this.value_type !== new_type && new_type !== kb.TYPE_UNKNOWN)) {
	      if ((this.value_type === kb.TYPE_COLLECTION) && (new_type === kb.TYPE_ARRAY)) {
	        return value(new_value);
	      } else {
	        return this._updateValueObservable(new_value);
	      }
	    } else if (this.value_type === kb.TYPE_MODEL) {
	      if (typeof value.model === 'function') {
	        if (value.model() !== new_value) {
	          return value.model(new_value);
	        }
	      } else if (kb.utils.wrappedObject(value) !== new_value) {
	        return this._updateValueObservable(new_value);
	      }
	    } else if (this.value_type === kb.TYPE_COLLECTION) {
	      if (value.collection() !== new_value) {
	        return value.collection(new_value);
	      }
	    } else {
	      if (value() !== new_value) {
	        return value(new_value);
	      }
	    }
	  };

	  Observable.prototype._updateValueObservable = function(new_value) {
	    var create_options, creator, previous_value, value;
	    create_options = this.create_options;
	    create_options.creator = kb.utils.inferCreator(new_value, create_options.factory, create_options.path, kb.peek(this._model), this.key);
	    this.value_type = kb.TYPE_UNKNOWN;
	    creator = create_options.creator;
	    previous_value = this.__kb_value;
	    this.__kb_value = void 0;
	    if (previous_value) {
	      kb.release(previous_value);
	    }
	    if (creator) {
	      if (create_options.store) {
	        value = create_options.store.findOrCreate(new_value, create_options);
	      } else {
	        if (creator.models_only) {
	          value = new_value;
	          this.value_type = kb.TYPE_SIMPLE;
	        } else if (creator.create) {
	          value = creator.create(new_value, create_options);
	        } else {
	          value = new creator(new_value, create_options);
	        }
	      }
	    } else {
	      if (_.isArray(new_value)) {
	        this.value_type = kb.TYPE_ARRAY;
	        value = ko.observableArray(new_value);
	      } else {
	        this.value_type = kb.TYPE_SIMPLE;
	        value = ko.observable(new_value);
	      }
	    }
	    if (this.value_type === kb.TYPE_UNKNOWN) {
	      if (!ko.isObservable(value)) {
	        this.value_type = kb.TYPE_MODEL;
	        if (typeof value.model !== 'function') {
	          kb.utils.wrappedObject(value, new_value);
	        }
	      } else if (value.__kb_is_co) {
	        this.value_type = kb.TYPE_COLLECTION;
	      } else {
	        this.value_type = kb.TYPE_SIMPLE;
	      }
	    }
	    this.__kb_value = value;
	    return this._vo(value);
	  };

	  return Observable;

	})();

	kb.observable = function(model, options, view_model) {
	  return new kb.Observable(model, options, view_model);
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var kb, ko, _;

	kb = __webpack_require__(11);

	_ = __webpack_require__(2);

	ko = __webpack_require__(3);

	kb.ViewModel = (function() {
	  ViewModel.extend = kb.extend;

	  function ViewModel(model, options, view_model) {
	    return kb.ignore((function(_this) {
	      return function() {
	        var attribute_keys, bb_model, event_watcher, keys, mapped_keys, mapping_info, rel_keys, vm_key, _mdl, _ref;
	        !model || (model instanceof kb.Model) || ((typeof model.get === 'function') && (typeof model.bind === 'function')) || kb._throwUnexpected(_this, 'not a model');
	        options || (options = {});
	        view_model || (view_model = {});
	        if (_.isArray(options)) {
	          options = {
	            keys: options
	          };
	        } else {
	          options = kb.utils.collapseOptions(options);
	        }
	        _this.__kb || (_this.__kb = {});
	        _this.__kb.vm_keys = {};
	        _this.__kb.model_keys = {};
	        _this.__kb.view_model = _.isUndefined(view_model) ? _this : view_model;
	        !options.internals || (_this.__kb.internals = options.internals);
	        !options.excludes || (_this.__kb.excludes = options.excludes);
	        !options.statics || (_this.__kb.statics = options.statics);
	        !options.static_defaults || (_this.__kb.static_defaults = options.static_defaults);
	        kb.Store.useOptionsOrCreate(options, model, _this);
	        _this.__kb.path = options.path;
	        kb.Factory.useOptionsOrCreate(options, _this, options.path);
	        _mdl = kb._wrappedKey(_this, '_mdl', ko.observable());
	        _this.model = ko.dependentObservable({
	          read: function() {
	            _mdl();
	            return kb.utils.wrappedObject(_this);
	          },
	          write: function(new_model) {
	            return kb.ignore(function() {
	              var event_watcher, keys, missing, rel_keys;
	              if (kb.utils.wrappedObject(_this) === new_model) {
	                return;
	              }
	              if (_this.__kb_null) {
	                !new_model || kb._throwUnexpected(_this, 'model set on shared null');
	                return;
	              }
	              kb.utils.wrappedObject(_this, new_model);
	              event_watcher = kb.utils.wrappedEventWatcher(_this);
	              if (!event_watcher) {
	                _mdl(new_model);
	                return;
	              }
	              event_watcher.emitter(new_model);
	              if (!(_this.__kb.keys || !new_model || !new_model.attributes)) {
	                keys = _.keys(new_model.attributes);
	                if (new_model && (rel_keys = kb.orm.keys(new_model))) {
	                  keys = _.union(keys, rel_keys);
	                }
	                missing = _.difference(keys, _.keys(_this.__kb.model_keys));
	                if (missing) {
	                  _this.createObservables(new_model, missing);
	                }
	              }
	              _mdl(new_model);
	            });
	          }
	        });
	        event_watcher = kb.utils.wrappedEventWatcher(_this, new kb.EventWatcher(model, _this, {
	          emitter: _this.model
	        }));
	        keys = options.requires;
	        if (_this.__kb.internals) {
	          keys = _.union(keys || [], _this.__kb.internals);
	        }
	        if (model && (rel_keys = kb.orm.keys(model))) {
	          keys = _.union(keys || [], rel_keys);
	        }
	        if (options.keys) {
	          if (_.isObject(options.keys) && !_.isArray(options.keys)) {
	            mapped_keys = {};
	            _ref = options.keys;
	            for (vm_key in _ref) {
	              mapping_info = _ref[vm_key];
	              mapped_keys[_.isString(mapping_info) ? mapping_info : (mapping_info.key ? mapping_info.key : vm_key)] = true;
	            }
	            _this.__kb.keys = _.keys(mapped_keys);
	          } else {
	            _this.__kb.keys = options.keys;
	            keys = keys ? _.union(keys, _this.__kb.keys) : _.clone(_this.__kb.keys);
	          }
	        } else {
	          bb_model = event_watcher.emitter();
	          if (bb_model && bb_model.attributes) {
	            attribute_keys = _.keys(bb_model.attributes);
	            keys = keys ? _.union(keys, attribute_keys) : attribute_keys;
	          }
	        }
	        if (keys && _this.__kb.excludes) {
	          keys = _.difference(keys, _this.__kb.excludes);
	        }
	        if (keys && _this.__kb.statics) {
	          keys = _.difference(keys, _this.__kb.statics);
	        }
	        if (_.isObject(options.keys) && !_.isArray(options.keys)) {
	          _this.mapObservables(model, options.keys);
	        }
	        if (_.isObject(options.requires) && !_.isArray(options.requires)) {
	          _this.mapObservables(model, options.requires);
	        }
	        !options.mappings || _this.mapObservables(model, options.mappings);
	        !keys || _this.createObservables(model, keys);
	        !_this.__kb.statics || _this.createObservables(model, _this.__kb.statics, true);
	        !kb.statistics || kb.statistics.register('ViewModel', _this);
	        return _this;
	      };
	    })(this));
	  }

	  ViewModel.prototype.destroy = function() {
	    var vm_key;
	    if (this.__kb.view_model !== this) {
	      for (vm_key in this.__kb.vm_keys) {
	        this.__kb.view_model[vm_key] = null;
	      }
	    }
	    this.__kb.view_model = null;
	    kb.releaseKeys(this);
	    kb.utils.wrappedDestroy(this);
	    return !kb.statistics || kb.statistics.unregister('ViewModel', this);
	  };

	  ViewModel.prototype.shareOptions = function() {
	    return {
	      store: kb.utils.wrappedStore(this),
	      factory: kb.utils.wrappedFactory(this)
	    };
	  };

	  ViewModel.prototype.createObservables = function(model, keys, is_static) {
	    var create_options, key, static_defaults, vm_key, _i, _len;
	    if (is_static) {
	      static_defaults = this.__kb.static_defaults || {};
	    } else {
	      create_options = {
	        store: kb.utils.wrappedStore(this),
	        factory: kb.utils.wrappedFactory(this),
	        path: this.__kb.path,
	        event_watcher: kb.utils.wrappedEventWatcher(this)
	      };
	    }
	    for (_i = 0, _len = keys.length; _i < _len; _i++) {
	      key = keys[_i];
	      vm_key = this.__kb.internals && _.contains(this.__kb.internals, key) ? "_" + key : key;
	      if (this[vm_key]) {
	        continue;
	      }
	      this.__kb.vm_keys[vm_key] = this.__kb.model_keys[key] = true;
	      if (is_static) {
	        if (model.has(vm_key)) {
	          this[vm_key] = this.__kb.view_model[vm_key] = model.get(vm_key);
	        } else if (vm_key in static_defaults) {
	          this[vm_key] = this.__kb.view_model[vm_key] = static_defaults[vm_key];
	        }
	      } else {
	        create_options.key = key;
	        this[vm_key] = this.__kb.view_model[vm_key] = kb.observable(model, create_options, this);
	      }
	    }
	  };

	  ViewModel.prototype.mapObservables = function(model, mappings) {
	    var create_options, mapping_info, vm_key;
	    create_options = {
	      store: kb.utils.wrappedStore(this),
	      factory: kb.utils.wrappedFactory(this),
	      path: this.__kb.path,
	      event_watcher: kb.utils.wrappedEventWatcher(this)
	    };
	    for (vm_key in mappings) {
	      mapping_info = mappings[vm_key];
	      if (this[vm_key]) {
	        continue;
	      }
	      mapping_info = _.isString(mapping_info) ? {
	        key: mapping_info
	      } : _.clone(mapping_info);
	      mapping_info.key || (mapping_info.key = vm_key);
	      this.__kb.vm_keys[vm_key] = this.__kb.model_keys[mapping_info.key] = true;
	      this[vm_key] = this.__kb.view_model[vm_key] = kb.observable(model, _.defaults(mapping_info, create_options), this);
	    }
	  };

	  return ViewModel;

	})();

	kb.viewModel = function(model, options, view_model) {
	  return new kb.ViewModel(model, options, view_model);
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var COMPARE_ASCENDING, COMPARE_DESCENDING, COMPARE_EQUAL, kb, ko, _,
	  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	kb = __webpack_require__(11);

	_ = __webpack_require__(2);

	ko = __webpack_require__(3);

	COMPARE_EQUAL = 0;

	COMPARE_ASCENDING = -1;

	COMPARE_DESCENDING = 1;

	kb.compare = function(value_a, value_b) {
	  if (_.isString(value_a)) {
	    return value_a.localeCompare("" + value_b);
	  }
	  if (_.isString(value_b)) {
	    return value_b.localeCompare("" + value_a);
	  }
	  if (value_a === value_b) {
	    return COMPARE_EQUAL;
	  } else {
	    if (value_a < value_b) {
	      return COMPARE_ASCENDING;
	    } else {
	      return COMPARE_DESCENDING;
	    }
	  }
	};

	kb.CollectionObservable = (function() {
	  CollectionObservable.extend = kb.extend;

	  function CollectionObservable(collection, options) {
	    return kb.ignore((function(_this) {
	      return function() {
	        var create_options, observable, _ref;
	        if (_.isUndefined(options) && !(collection instanceof kb.Collection)) {
	          _ref = [new kb.Collection(), collection], collection = _ref[0], options = _ref[1];
	        } else if (_.isArray(collection)) {
	          collection = new kb.Collection(collection);
	        }
	        options || (options = {});
	        observable = kb.utils.wrappedObservable(_this, ko.observableArray([]));
	        observable.__kb_is_co = true;
	        _this.in_edit = 0;
	        _this.__kb || (_this.__kb = {});
	        _this.__kb._onCollectionChange = _.bind(_this._onCollectionChange, _this);
	        options = kb.utils.collapseOptions(options);
	        if (options.auto_compact) {
	          _this.auto_compact = true;
	        }
	        if (options.sort_attribute) {
	          _this._comparator = ko.observable(_this._attributeComparator(options.sort_attribute));
	        } else {
	          _this._comparator = ko.observable(options.comparator);
	        }
	        if (options.filters) {
	          _this._filters = ko.observableArray(_.isArray(options.filters) ? options.filters : options.filters ? [options.filters] : void 0);
	        } else {
	          _this._filters = ko.observableArray([]);
	        }
	        create_options = _this.create_options = {
	          store: kb.Store.useOptionsOrCreate(options, collection, observable)
	        };
	        _this.path = options.path;
	        create_options.factory = kb.utils.wrappedFactory(observable, _this._shareOrCreateFactory(options));
	        create_options.path = kb.utils.pathJoin(options.path, 'models');
	        create_options.creator = create_options.factory.creatorForPath(null, create_options.path);
	        if (create_options.creator) {
	          _this.models_only = create_options.creator.models_only;
	        }
	        kb.publishMethods(observable, _this, ['destroy', 'shareOptions', 'filters', 'comparator', 'sortAttribute', 'viewModelByModel', 'hasViewModels']);
	        _this._collection = ko.observable(collection);
	        observable.collection = _this.collection = ko.dependentObservable({
	          read: function() {
	            return _this._collection();
	          },
	          write: function(new_collection) {
	            return kb.ignore(function() {
	              var previous_collection;
	              if ((previous_collection = _this._collection()) === new_collection) {
	                return;
	              }
	              if (previous_collection) {
	                previous_collection.unbind('all', _this.__kb._onCollectionChange);
	              }
	              if (new_collection) {
	                new_collection.bind('all', _this.__kb._onCollectionChange);
	              }
	              return _this._collection(new_collection);
	            });
	          }
	        });
	        if (collection) {
	          collection.bind('all', _this.__kb._onCollectionChange);
	        }
	        _this._mapper = ko.dependentObservable(function() {
	          var comparator, current_collection, filter, filters, models, view_models, _i, _len;
	          comparator = _this._comparator();
	          filters = _this._filters();
	          if (filters) {
	            for (_i = 0, _len = filters.length; _i < _len; _i++) {
	              filter = filters[_i];
	              ko.utils.unwrapObservable(filter);
	            }
	          }
	          current_collection = _this._collection();
	          if (_this.in_edit) {
	            return;
	          }
	          observable = kb.utils.wrappedObservable(_this);
	          if (current_collection) {
	            models = current_collection.models;
	          }
	          if (!models || (current_collection.models.length === 0)) {
	            view_models = [];
	          } else {
	            models = _.filter(models, function(model) {
	              return !filters.length || _this._selectModel(model);
	            });
	            if (comparator) {
	              view_models = _.map(models, function(model) {
	                return _this._createViewModel(model);
	              }).sort(comparator);
	            } else {
	              if (_this.models_only) {
	                view_models = filters.length ? models : models.slice();
	              } else {
	                view_models = _.map(models, function(model) {
	                  return _this._createViewModel(model);
	                });
	              }
	            }
	          }
	          _this.in_edit++;
	          observable(view_models);
	          return _this.in_edit--;
	        });
	        observable.subscribe(_.bind(_this._onObservableArrayChange, _this));
	        !kb.statistics || kb.statistics.register('CollectionObservable', _this);
	        return observable;
	      };
	    })(this));
	  }

	  CollectionObservable.prototype.destroy = function() {
	    var array, collection, observable;
	    observable = kb.utils.wrappedObservable(this);
	    collection = this._collection();
	    if (collection) {
	      collection.unbind('all', this.__kb._onCollectionChange);
	      array = observable();
	      array.splice(0, array.length);
	    }
	    this.collection.dispose();
	    this._collection = observable.collection = this.collection = null;
	    this._mapper.dispose();
	    this._mapper = null;
	    kb.release(this._filters);
	    this._filters = null;
	    this._comparator(null);
	    this._comparator = null;
	    this.create_options = null;
	    observable.collection = null;
	    kb.utils.wrappedDestroy(this);
	    return !kb.statistics || kb.statistics.unregister('CollectionObservable', this);
	  };

	  CollectionObservable.prototype.shareOptions = function() {
	    var observable;
	    observable = kb.utils.wrappedObservable(this);
	    return {
	      store: kb.utils.wrappedStore(observable),
	      factory: kb.utils.wrappedFactory(observable)
	    };
	  };

	  CollectionObservable.prototype.filters = function(filters) {
	    if (filters) {
	      return this._filters(_.isArray(filters) ? filters : [filters]);
	    } else {
	      return this._filters([]);
	    }
	  };

	  CollectionObservable.prototype.comparator = function(comparator) {
	    return this._comparator(comparator);
	  };

	  CollectionObservable.prototype.sortAttribute = function(sort_attribute) {
	    return this._comparator(sort_attribute ? this._attributeComparator(sort_attribute) : null);
	  };

	  CollectionObservable.prototype.viewModelByModel = function(model) {
	    var id_attribute;
	    if (this.models_only) {
	      return null;
	    }
	    id_attribute = model.hasOwnProperty(model.idAttribute) ? model.idAttribute : 'cid';
	    return _.find(kb.peek(kb.utils.wrappedObservable(this)), function(test) {
	      var _ref;
	      if (test != null ? (_ref = test.__kb) != null ? _ref.object : void 0 : void 0) {
	        return test.__kb.object[id_attribute] === model[id_attribute];
	      } else {
	        return false;
	      }
	    });
	  };

	  CollectionObservable.prototype.hasViewModels = function() {
	    return !this.models_only;
	  };

	  CollectionObservable.prototype.compact = function() {
	    return kb.ignore((function(_this) {
	      return function() {
	        var observable;
	        observable = kb.utils.wrappedObservable(_this);
	        if (!kb.utils.wrappedStoreIsOwned(observable)) {
	          return;
	        }
	        kb.utils.wrappedStore(observable).clear();
	        return _this._collection.notifySubscribers(_this._collection());
	      };
	    })(this));
	  };

	  CollectionObservable.prototype._shareOrCreateFactory = function(options) {
	    var absolute_models_path, existing_creator, factories, factory;
	    absolute_models_path = kb.utils.pathJoin(options.path, 'models');
	    factories = options.factories;
	    if ((factory = options.factory)) {
	      if ((existing_creator = factory.creatorForPath(null, absolute_models_path)) && (!factories || (factories['models'] === existing_creator))) {
	        if (!factories) {
	          return factory;
	        }
	        if (factory.hasPathMappings(factories, options.path)) {
	          return factory;
	        }
	      }
	    }
	    factory = new kb.Factory(options.factory);
	    if (factories) {
	      factory.addPathMappings(factories, options.path);
	    }
	    if (!factory.creatorForPath(null, absolute_models_path)) {
	      if (options.hasOwnProperty('models_only')) {
	        if (options.models_only) {
	          factory.addPathMapping(absolute_models_path, {
	            models_only: true
	          });
	        } else {
	          factory.addPathMapping(absolute_models_path, kb.ViewModel);
	        }
	      } else if (options.view_model) {
	        factory.addPathMapping(absolute_models_path, options.view_model);
	      } else if (options.create) {
	        factory.addPathMapping(absolute_models_path, {
	          create: options.create
	        });
	      } else {
	        factory.addPathMapping(absolute_models_path, kb.ViewModel);
	      }
	    }
	    return factory;
	  };

	  CollectionObservable.prototype._onCollectionChange = function(event, arg) {
	    return kb.ignore((function(_this) {
	      return function() {
	        var collection, comparator, observable, view_model;
	        if (_this.in_edit) {
	          return;
	        }
	        switch (event) {
	          case 'reset':
	            if (_this.auto_compact) {
	              _this.compact();
	            } else {
	              _this._collection.notifySubscribers(_this._collection());
	            }
	            break;
	          case 'sort':
	          case 'resort':
	            _this._collection.notifySubscribers(_this._collection());
	            break;
	          case 'new':
	          case 'add':
	            if (!_this._selectModel(arg)) {
	              return;
	            }
	            observable = kb.utils.wrappedObservable(_this);
	            collection = _this._collection();
	            if (collection.indexOf(arg) === -1) {
	              return;
	            }
	            if ((view_model = _this.viewModelByModel(arg))) {
	              return;
	            }
	            _this.in_edit++;
	            view_model = _this._createViewModel(arg);
	            if ((comparator = _this._comparator())) {
	              observable().push(view_model);
	              observable.sort(comparator);
	            } else {
	              observable.splice(collection.indexOf(arg), 0, view_model);
	            }
	            _this.in_edit--;
	            break;
	          case 'remove':
	          case 'destroy':
	            _this._onModelRemove(arg);
	            break;
	          case 'change':
	            if (!_this._selectModel(arg)) {
	              _this._onModelRemove(arg);
	            } else {
	              view_model = _this.models_only ? arg : _this.viewModelByModel(arg);
	              if (view_model) {
	                if ((comparator = _this._comparator())) {
	                  observable = kb.utils.wrappedObservable(_this);
	                  _this.in_edit++;
	                  observable.sort(comparator);
	                  _this.in_edit--;
	                }
	              } else {
	                _this._onCollectionChange('add', arg);
	              }
	            }
	        }
	      };
	    })(this));
	  };

	  CollectionObservable.prototype._onModelRemove = function(model) {
	    var observable, view_model;
	    view_model = this.models_only ? model : this.viewModelByModel(model);
	    if (!view_model) {
	      return;
	    }
	    observable = kb.utils.wrappedObservable(this);
	    this.in_edit++;
	    observable.remove(view_model);
	    return this.in_edit--;
	  };

	  CollectionObservable.prototype._onObservableArrayChange = function(models_or_view_models) {
	    return kb.ignore((function(_this) {
	      return function() {
	        var collection, has_filters, model, models, observable, view_model, view_models, _i, _len;
	        if (_this.in_edit) {
	          return;
	        }
	        (_this.models_only && (!models_or_view_models.length || kb.utils.hasModelSignature(models_or_view_models[0]))) || (!_this.models_only && (!models_or_view_models.length || (_.isObject(models_or_view_models[0]) && !kb.utils.hasModelSignature(models_or_view_models[0])))) || kb._throwUnexpected(_this, 'incorrect type passed');
	        observable = kb.utils.wrappedObservable(_this);
	        collection = kb.peek(_this._collection);
	        has_filters = kb.peek(_this._filters).length;
	        if (!collection) {
	          return;
	        }
	        view_models = models_or_view_models;
	        if (_this.models_only) {
	          models = _.filter(models_or_view_models, function(model) {
	            return !has_filters || _this._selectModel(model);
	          });
	        } else {
	          !has_filters || (view_models = []);
	          models = [];
	          for (_i = 0, _len = models_or_view_models.length; _i < _len; _i++) {
	            view_model = models_or_view_models[_i];
	            model = kb.utils.wrappedObject(view_model);
	            if (has_filters) {
	              if (!_this._selectModel(model)) {
	                continue;
	              }
	              view_models.push(view_model);
	            }
	            _this.create_options.store.findOrReplace(model, _this.create_options.creator, view_model);
	            models.push(model);
	          }
	        }
	        _this.in_edit++;
	        (models_or_view_models.length === view_models.length) || observable(view_models);
	        _.isEqual(collection.models, models) || collection.reset(models);
	        _this.in_edit--;
	      };
	    })(this));
	  };

	  CollectionObservable.prototype._attributeComparator = function(sort_attribute) {
	    var modelAttributeCompare;
	    modelAttributeCompare = function(model_a, model_b) {
	      var attribute_name;
	      attribute_name = ko.utils.unwrapObservable(sort_attribute);
	      return kb.compare(model_a.get(attribute_name), model_b.get(attribute_name));
	    };
	    return (this.models_only ? modelAttributeCompare : function(model_a, model_b) {
	      return modelAttributeCompare(kb.utils.wrappedModel(model_a), kb.utils.wrappedModel(model_b));
	    });
	  };

	  CollectionObservable.prototype._createViewModel = function(model) {
	    if (this.models_only) {
	      return model;
	    }
	    return this.create_options.store.findOrCreate(model, this.create_options);
	  };

	  CollectionObservable.prototype._selectModel = function(model) {
	    var filter, filters, _i, _len, _ref;
	    filters = kb.peek(this._filters);
	    for (_i = 0, _len = filters.length; _i < _len; _i++) {
	      filter = filters[_i];
	      filter = kb.peek(filter);
	      if (_.isFunction(filter)) {
	        if (!filter(model)) {
	          return false;
	        }
	      } else if (_.isArray(filter)) {
	        if (_ref = model.id, __indexOf.call(filter, _ref) < 0) {
	          return false;
	        }
	      } else {
	        if (model.id !== filter) {
	          return false;
	        }
	      }
	    }
	    return true;
	  };

	  return CollectionObservable;

	})();

	kb.collectionObservable = function(collection, options) {
	  return new kb.CollectionObservable(collection, options);
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var ORM, ORMAdapter_BackboneAssociations, ORMAdapter_BackboneRelational, ORMAdapter_Supermodel, kb, _;

	kb = __webpack_require__(11);

	_ = __webpack_require__(2);

	ORM = (function() {
	  function ORM() {
	    this.adapters = [];
	  }

	  ORM.prototype.initialize = function() {
	    this.adapters = _.select(this.adapters, function(adapter) {
	      return adapter.isAvailable();
	    });
	    return this.initialized = true;
	  };

	  ORM.prototype.addAdapter = function(adapter) {
	    this.adapters.push(adapter);
	    return this.initialized = false;
	  };

	  ORM.prototype.keys = function(model) {
	    return this._call('keys', arguments);
	  };

	  ORM.prototype.bind = function(model) {
	    return this._call('bind', arguments);
	  };

	  ORM.prototype.useFunction = function(model) {
	    return this._call('useFunction', arguments);
	  };

	  ORM.prototype._call = function(name, args) {
	    var adpater, result, _i, _len, _ref;
	    if (!this.adapters.length) {
	      return;
	    }
	    if (!this.initialized) {
	      this.initialize();
	    }
	    _ref = this.adapters;
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      adpater = _ref[_i];
	      if (adpater[name] && (result = adpater[name].apply(adpater, args))) {
	        return result;
	      }
	    }
	  };

	  return ORM;

	})();

	kb.orm = new ORM();

	ORMAdapter_BackboneRelational = (function() {
	  function ORMAdapter_BackboneRelational() {}

	  ORMAdapter_BackboneRelational.prototype.isAvailable = function() {
	    var _ref, _ref1;
	    try {
	      ((_ref = kb.Backbone) != null ? _ref.RelationalModel : void 0) || (true ? __webpack_require__(23) : void 0);
	    } catch (_error) {

	    }
	    return !!((_ref1 = kb.Backbone) != null ? _ref1.RelationalModel : void 0);
	  };

	  ORMAdapter_BackboneRelational.prototype.relationType = function(model, key) {
	    var relation;
	    if (!(model instanceof kb.Backbone.RelationalModel)) {
	      return null;
	    }
	    if (!(relation = _.find(model.getRelations(), function(test) {
	      return test.key === key;
	    }))) {
	      return null;
	    }
	    if (relation.collectionType || _.isArray(relation.keyContents)) {
	      return kb.TYPE_COLLECTION;
	    } else {
	      return kb.TYPE_MODEL;
	    }
	  };

	  ORMAdapter_BackboneRelational.prototype.bind = function(model, key, update, path) {
	    var event, events, rel_fn, type, _i, _len;
	    if (!(type = this.relationType(model, key))) {
	      return null;
	    }
	    rel_fn = function(model) {
	      !kb.statistics || kb.statistics.addModelEvent({
	        name: 'update (relational)',
	        model: model,
	        key: key,
	        path: path
	      });
	      return update();
	    };
	    events = Backbone.Relation.prototype.sanitizeOptions ? ['update', 'add', 'remove'] : ['change', 'add', 'remove'];
	    if (type === kb.TYPE_COLLECTION) {
	      for (_i = 0, _len = events.length; _i < _len; _i++) {
	        event = events[_i];
	        model.bind("" + event + ":" + key, rel_fn);
	      }
	    } else {
	      model.bind("" + events[0] + ":" + key, rel_fn);
	    }
	    return function() {
	      var _j, _len1;
	      if (type === kb.TYPE_COLLECTION) {
	        for (_j = 0, _len1 = events.length; _j < _len1; _j++) {
	          event = events[_j];
	          model.unbind("" + event + ":" + key, rel_fn);
	        }
	      } else {
	        model.unbind("" + events[0] + ":" + key, rel_fn);
	      }
	    };
	  };

	  return ORMAdapter_BackboneRelational;

	})();

	kb.orm.addAdapter(new ORMAdapter_BackboneRelational());

	ORMAdapter_BackboneAssociations = (function() {
	  function ORMAdapter_BackboneAssociations() {}

	  ORMAdapter_BackboneAssociations.prototype.isAvailable = function() {
	    var _ref, _ref1;
	    try {
	      ((_ref = kb.Backbone) != null ? _ref.AssociatedModel : void 0) || (true ? __webpack_require__(24) : void 0);
	    } catch (_error) {

	    }
	    return !!((_ref1 = kb.Backbone) != null ? _ref1.AssociatedModel : void 0);
	  };

	  ORMAdapter_BackboneAssociations.prototype.keys = function(model) {
	    if (!(model instanceof kb.Backbone.AssociatedModel)) {
	      return null;
	    }
	    return _.map(model.relations, function(test) {
	      return test.key;
	    });
	  };

	  ORMAdapter_BackboneAssociations.prototype.relationType = function(model, key) {
	    var relation;
	    if (!(model instanceof kb.Backbone.AssociatedModel)) {
	      return null;
	    }
	    if (!(relation = _.find(model.relations, function(test) {
	      return test.key === key;
	    }))) {
	      return null;
	    }
	    if (relation.type === 'Many') {
	      return kb.TYPE_COLLECTION;
	    } else {
	      return kb.TYPE_MODEL;
	    }
	  };

	  return ORMAdapter_BackboneAssociations;

	})();

	kb.orm.addAdapter(new ORMAdapter_BackboneAssociations());

	ORMAdapter_Supermodel = (function() {
	  function ORMAdapter_Supermodel() {}

	  ORMAdapter_Supermodel.prototype.isAvailable = function() {
	    try {
	      (typeof window !== "undefined" && window !== null ? window.Supermodel : void 0) || (true ? __webpack_require__(22) : void 0);
	    } catch (_error) {

	    }
	    return !!(typeof window !== "undefined" && window !== null ? window.Supermodel : void 0);
	  };

	  ORMAdapter_Supermodel.prototype.keys = function(model) {
	    if (!(model instanceof Supermodel.Model)) {
	      return null;
	    }
	    return _.keys(model.constructor.associations());
	  };

	  ORMAdapter_Supermodel.prototype.relationType = function(model, key) {
	    var relation;
	    if (!(model instanceof Supermodel.Model)) {
	      return null;
	    }
	    if (!(relation = model.constructor.associations()[key])) {
	      return null;
	    }
	    if (relation.add) {
	      return kb.TYPE_COLLECTION;
	    } else {
	      return kb.TYPE_MODEL;
	    }
	  };

	  ORMAdapter_Supermodel.prototype.bind = function(model, key, update, path) {
	    var rel_fn, type;
	    if (!(type = this.relationType(model, key))) {
	      return null;
	    }
	    rel_fn = function(model, other) {
	      var previous, relation;
	      !kb.statistics || kb.statistics.addModelEvent({
	        name: 'update (supermodel)',
	        model: model,
	        key: key,
	        path: path
	      });
	      relation = model.constructor.associations()[key];
	      previous = model[relation.store];
	      model[relation.store] = other;
	      update(other);
	      return model[relation.store] = previous;
	    };
	    if (type === kb.TYPE_MODEL) {
	      model.bind("associate:" + key, rel_fn);
	      return function() {
	        return model.unbind("associate:" + key, rel_fn);
	      };
	    }
	  };

	  ORMAdapter_Supermodel.prototype.useFunction = function(model, key) {
	    return !!this.relationType(model, key);
	  };

	  return ORMAdapter_Supermodel;

	})();

	kb.orm.addAdapter(new ORMAdapter_Supermodel());


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var kb, ko, onReady, _, _ko_applyBindings;

	kb = __webpack_require__(11);

	_ = __webpack_require__(2);

	ko = __webpack_require__(3);

	kb.RECUSIVE_AUTO_INJECT = true;

	ko.bindingHandlers['inject'] = {
	  'init': function(element, value_accessor, all_bindings_accessor, view_model) {
	    return kb.Inject.inject(ko.utils.unwrapObservable(value_accessor()), view_model, element, value_accessor, all_bindings_accessor);
	  }
	};

	kb.Inject = (function() {
	  function Inject() {}

	  Inject.inject = function(data, view_model, element, value_accessor, all_bindings_accessor, nested) {
	    var inject, result, wrapper;
	    inject = function(data) {
	      var key, target, value;
	      if (_.isFunction(data)) {
	        view_model = new data(view_model, element, value_accessor, all_bindings_accessor);
	        kb.releaseOnNodeRemove(view_model, element);
	      } else {
	        if (data.view_model) {
	          view_model = new data.view_model(view_model, element, value_accessor, all_bindings_accessor);
	          kb.releaseOnNodeRemove(view_model, element);
	        }
	        for (key in data) {
	          value = data[key];
	          if (key === 'view_model') {
	            continue;
	          }
	          if (key === 'create') {
	            value(view_model, element, value_accessor, all_bindings_accessor);
	          } else if (_.isObject(value) && !_.isFunction(value)) {
	            target = nested || (value && value.create) ? {} : view_model;
	            view_model[key] = kb.Inject.inject(value, target, element, value_accessor, all_bindings_accessor, true);
	          } else {
	            view_model[key] = value;
	          }
	        }
	      }
	      return view_model;
	    };
	    if (nested) {
	      return inject(data);
	    } else {
	      result = (wrapper = ko.dependentObservable(function() {
	        return inject(data);
	      }))();
	      wrapper.dispose();
	      return result;
	    }
	  };

	  Inject.injectViewModels = function(root) {
	    var afterBinding, app, beforeBinding, data, expression, findElements, options, results, _i, _len;
	    results = [];
	    findElements = function(el) {
	      var attr, child_el, _i, _len, _ref;
	      if (!el.__kb_injected) {
	        if (el.attributes && (attr = _.find(el.attributes, function(attr) {
	          return attr.name === 'kb-inject';
	        }))) {
	          el.__kb_injected = true;
	          results.push({
	            el: el,
	            view_model: {},
	            binding: attr.value
	          });
	        }
	      }
	      _ref = el.childNodes;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        child_el = _ref[_i];
	        findElements(child_el);
	      }
	    };
	    if (!root && (typeof document !== "undefined" && document !== null)) {
	      root = document;
	    }
	    findElements(root);
	    for (_i = 0, _len = results.length; _i < _len; _i++) {
	      app = results[_i];
	      if (expression = app.binding) {
	        (expression.search(/[:]/) < 0) || (expression = "{" + expression + "}");
	        data = (new Function("", "return ( " + expression + " )"))();
	        data || (data = {});
	        (!data.options) || (options = data.options, delete data.options);
	        options || (options = {});
	        app.view_model = kb.Inject.inject(data, app.view_model, app.el, null, null, true);
	        afterBinding = app.view_model.afterBinding || options.afterBinding;
	        beforeBinding = app.view_model.beforeBinding || options.beforeBinding;
	      }
	      if (beforeBinding) {
	        beforeBinding(app.view_model, app.el, options);
	      }
	      kb.applyBindings(app.view_model, app.el, options);
	      if (afterBinding) {
	        afterBinding(app.view_model, app.el, options);
	      }
	    }
	    return results;
	  };

	  return Inject;

	})();

	_ko_applyBindings = ko.applyBindings;

	ko.applyBindings = function(context, element) {
	  var results;
	  results = kb.RECUSIVE_AUTO_INJECT ? kb.injectViewModels(element) : [];
	  if (!results.length) {
	    return _ko_applyBindings.apply(this, arguments);
	  }
	};

	kb.injectViewModels = kb.Inject.injectViewModels;

	if (typeof document !== "undefined" && document !== null) {
	  if (this.$) {
	    this.$(function() {
	      return kb.injectViewModels();
	    });
	  } else {
	    (onReady = function() {
	      if (document.readyState !== "complete") {
	        return setTimeout(onReady, 0);
	      }
	      return kb.injectViewModels();
	    })();
	  }
	}


/***/ },
/* 21 */,
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	exports.Model = __webpack_require__(25);
	exports.Collection = __webpack_require__(26);


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 noexpandtab: */
	/**
	 * Backbone-relational.js 0.8.8
	 * (c) 2011-2013 Paul Uithol and contributors (https://github.com/PaulUithol/Backbone-relational/graphs/contributors)
	 *
	 * Backbone-relational may be freely distributed under the MIT license; see the accompanying LICENSE.txt.
	 * For details and documentation: https://github.com/PaulUithol/Backbone-relational.
	 * Depends on Backbone (and thus on Underscore as well): https://github.com/documentcloud/backbone.
	 *
	 * Example:
	 *
		Zoo = Backbone.RelationalModel.extend({
			relations: [ {
				type: Backbone.HasMany,
				key: 'animals',
				relatedModel: 'Animal',
				reverseRelation: {
					key: 'livesIn',
					includeInJSON: 'id'
					// 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
				}
			} ],

			toString: function() {
				return this.get( 'name' );
			}
		});

		Animal = Backbone.RelationalModel.extend({
			toString: function() {
				return this.get( 'species' );
			}
		});

		// Creating the zoo will give it a collection with one animal in it: the monkey.
		// The animal created after that has a relation `livesIn` that points to the zoo it's currently associated with.
		// If you instantiate (or fetch) the zebra later, it will automatically be added.

		var zoo = new Zoo({
			name: 'Artis',
			animals: [ { id: 'monkey-1', species: 'Chimp' }, 'lion-1', 'zebra-1' ]
		});

		var lion = new Animal( { id: 'lion-1', species: 'Lion' } ),
			monkey = zoo.get( 'animals' ).first(),
			sameZoo = lion.get( 'livesIn' );
	 */
	( function( root, factory ) {
		// Set up Backbone-relational for the environment. Start with AMD.
		if ( true ) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ exports, __webpack_require__(1), __webpack_require__(2) ], __WEBPACK_AMD_DEFINE_RESULT__ = (factory.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}
		// Next for Node.js or CommonJS.
		else if ( typeof exports !== 'undefined' ) {
			factory( exports, require( 'backbone' ), require( 'underscore' ) );
		}
		// Finally, as a browser global. Use `root` here as it references `window`.
		else {
			factory( root, root.Backbone, root._ );
		}
	}( this, function( exports, Backbone, _ ) {
		"use strict";

		Backbone.Relational = {
			showWarnings: true
		};

		/**
		 * Semaphore mixin; can be used as both binary and counting.
		 **/
		Backbone.Semaphore = {
			_permitsAvailable: null,
			_permitsUsed: 0,

			acquire: function() {
				if ( this._permitsAvailable && this._permitsUsed >= this._permitsAvailable ) {
					throw new Error( 'Max permits acquired' );
				}
				else {
					this._permitsUsed++;
				}
			},

			release: function() {
				if ( this._permitsUsed === 0 ) {
					throw new Error( 'All permits released' );
				}
				else {
					this._permitsUsed--;
				}
			},

			isLocked: function() {
				return this._permitsUsed > 0;
			},

			setAvailablePermits: function( amount ) {
				if ( this._permitsUsed > amount ) {
					throw new Error( 'Available permits cannot be less than used permits' );
				}
				this._permitsAvailable = amount;
			}
		};

		/**
		 * A BlockingQueue that accumulates items while blocked (via 'block'),
		 * and processes them when unblocked (via 'unblock').
		 * Process can also be called manually (via 'process').
		 */
		Backbone.BlockingQueue = function() {
			this._queue = [];
		};
		_.extend( Backbone.BlockingQueue.prototype, Backbone.Semaphore, {
			_queue: null,

			add: function( func ) {
				if ( this.isBlocked() ) {
					this._queue.push( func );
				}
				else {
					func();
				}
			},

			// Some of the queued events may trigger other blocking events. By
			// copying the queue here it allows queued events to process closer to
			// the natural order.
			//
			// queue events [ 'A', 'B', 'C' ]
			// A handler of 'B' triggers 'D' and 'E'
			// By copying `this._queue` this executes:
			// [ 'A', 'B', 'D', 'E', 'C' ]
			// The same order the would have executed if they didn't have to be
			// delayed and queued.
			process: function() {
				var queue = this._queue;
				this._queue = [];
				while ( queue && queue.length ) {
					queue.shift()();
				}
			},

			block: function() {
				this.acquire();
			},

			unblock: function() {
				this.release();
				if ( !this.isBlocked() ) {
					this.process();
				}
			},

			isBlocked: function() {
				return this.isLocked();
			}
		});
		/**
		 * Global event queue. Accumulates external events ('add:<key>', 'remove:<key>' and 'change:<key>')
		 * until the top-level object is fully initialized (see 'Backbone.RelationalModel').
		 */
		Backbone.Relational.eventQueue = new Backbone.BlockingQueue();

		/**
		 * Backbone.Store keeps track of all created (and destruction of) Backbone.RelationalModel.
		 * Handles lookup for relations.
		 */
		Backbone.Store = function() {
			this._collections = [];
			this._reverseRelations = [];
			this._orphanRelations = [];
			this._subModels = [];
			this._modelScopes = [ exports ];
		};
		_.extend( Backbone.Store.prototype, Backbone.Events, {
			/**
			 * Create a new `Relation`.
			 * @param {Backbone.RelationalModel} [model]
			 * @param {Object} relation
			 * @param {Object} [options]
			 */
			initializeRelation: function( model, relation, options ) {
				var type = !_.isString( relation.type ) ? relation.type : Backbone[ relation.type ] || this.getObjectByName( relation.type );
				if ( type && type.prototype instanceof Backbone.Relation ) {
					new type( model, relation, options ); // Also pushes the new Relation into `model._relations`
				}
				else {
					Backbone.Relational.showWarnings && typeof console !== 'undefined' && console.warn( 'Relation=%o; missing or invalid relation type!', relation );
				}
			},

			/**
			 * Add a scope for `getObjectByName` to look for model types by name.
			 * @param {Object} scope
			 */
			addModelScope: function( scope ) {
				this._modelScopes.push( scope );
			},

			/**
			 * Remove a scope.
			 * @param {Object} scope
			 */
			removeModelScope: function( scope ) {
				this._modelScopes = _.without( this._modelScopes, scope );
			},

			/**
			 * Add a set of subModelTypes to the store, that can be used to resolve the '_superModel'
			 * for a model later in 'setupSuperModel'.
			 *
			 * @param {Backbone.RelationalModel} subModelTypes
			 * @param {Backbone.RelationalModel} superModelType
			 */
			addSubModels: function( subModelTypes, superModelType ) {
				this._subModels.push({
					'superModelType': superModelType,
					'subModels': subModelTypes
				});
			},

			/**
			 * Check if the given modelType is registered as another model's subModel. If so, add it to the super model's
			 * '_subModels', and set the modelType's '_superModel', '_subModelTypeName', and '_subModelTypeAttribute'.
			 *
			 * @param {Backbone.RelationalModel} modelType
			 */
			setupSuperModel: function( modelType ) {
				_.find( this._subModels, function( subModelDef ) {
					return _.filter( subModelDef.subModels || [], function( subModelTypeName, typeValue ) {
						var subModelType = this.getObjectByName( subModelTypeName );

						if ( modelType === subModelType ) {
							// Set 'modelType' as a child of the found superModel
							subModelDef.superModelType._subModels[ typeValue ] = modelType;

							// Set '_superModel', '_subModelTypeValue', and '_subModelTypeAttribute' on 'modelType'.
							modelType._superModel = subModelDef.superModelType;
							modelType._subModelTypeValue = typeValue;
							modelType._subModelTypeAttribute = subModelDef.superModelType.prototype.subModelTypeAttribute;
							return true;
						}
					}, this ).length;
				}, this );
			},

			/**
			 * Add a reverse relation. Is added to the 'relations' property on model's prototype, and to
			 * existing instances of 'model' in the store as well.
			 * @param {Object} relation
			 * @param {Backbone.RelationalModel} relation.model
			 * @param {String} relation.type
			 * @param {String} relation.key
			 * @param {String|Object} relation.relatedModel
			 */
			addReverseRelation: function( relation ) {
				var exists = _.any( this._reverseRelations, function( rel ) {
					return _.all( relation || [], function( val, key ) {
						return val === rel[ key ];
					});
				});

				if ( !exists && relation.model && relation.type ) {
					this._reverseRelations.push( relation );
					this._addRelation( relation.model, relation );
					this.retroFitRelation( relation );
				}
			},

			/**
			 * Deposit a `relation` for which the `relatedModel` can't be resolved at the moment.
			 *
			 * @param {Object} relation
			 */
			addOrphanRelation: function( relation ) {
				var exists = _.any( this._orphanRelations, function( rel ) {
					return _.all( relation || [], function( val, key ) {
						return val === rel[ key ];
					});
				});

				if ( !exists && relation.model && relation.type ) {
					this._orphanRelations.push( relation );
				}
			},

			/**
			 * Try to initialize any `_orphanRelation`s
			 */
			processOrphanRelations: function() {
				// Make sure to operate on a copy since we're removing while iterating
				_.each( this._orphanRelations.slice( 0 ), function( rel ) {
					var relatedModel = Backbone.Relational.store.getObjectByName( rel.relatedModel );
					if ( relatedModel ) {
						this.initializeRelation( null, rel );
						this._orphanRelations = _.without( this._orphanRelations, rel );
					}
				}, this );
			},

			/**
			 *
			 * @param {Backbone.RelationalModel.constructor} type
			 * @param {Object} relation
			 * @private
			 */
			_addRelation: function( type, relation ) {
				if ( !type.prototype.relations ) {
					type.prototype.relations = [];
				}
				type.prototype.relations.push( relation );

				_.each( type._subModels || [], function( subModel ) {
					this._addRelation( subModel, relation );
				}, this );
			},

			/**
			 * Add a 'relation' to all existing instances of 'relation.model' in the store
			 * @param {Object} relation
			 */
			retroFitRelation: function( relation ) {
				var coll = this.getCollection( relation.model, false );
				coll && coll.each( function( model ) {
					if ( !( model instanceof relation.model ) ) {
						return;
					}

					new relation.type( model, relation );
				}, this );
			},

			/**
			 * Find the Store's collection for a certain type of model.
			 * @param {Backbone.RelationalModel} type
			 * @param {Boolean} [create=true] Should a collection be created if none is found?
			 * @return {Backbone.Collection} A collection if found (or applicable for 'model'), or null
			 */
			getCollection: function( type, create ) {
				if ( type instanceof Backbone.RelationalModel ) {
					type = type.constructor;
				}

				var rootModel = type;
				while ( rootModel._superModel ) {
					rootModel = rootModel._superModel;
				}

				var coll = _.find( this._collections, function( item ) {
					return item.model === rootModel;
				});

				if ( !coll && create !== false ) {
					coll = this._createCollection( rootModel );
				}

				return coll;
			},

			/**
			 * Find a model type on one of the modelScopes by name. Names are split on dots.
			 * @param {String} name
			 * @return {Object}
			 */
			getObjectByName: function( name ) {
				var parts = name.split( '.' ),
					type = null;

				_.find( this._modelScopes, function( scope ) {
					type = _.reduce( parts || [], function( memo, val ) {
						return memo ? memo[ val ] : undefined;
					}, scope );

					if ( type && type !== scope ) {
						return true;
					}
				}, this );

				return type;
			},

			_createCollection: function( type ) {
				var coll;

				// If 'type' is an instance, take its constructor
				if ( type instanceof Backbone.RelationalModel ) {
					type = type.constructor;
				}

				// Type should inherit from Backbone.RelationalModel.
				if ( type.prototype instanceof Backbone.RelationalModel ) {
					coll = new Backbone.Collection();
					coll.model = type;

					this._collections.push( coll );
				}

				return coll;
			},

			/**
			 * Find the attribute that is to be used as the `id` on a given object
			 * @param type
			 * @param {String|Number|Object|Backbone.RelationalModel} item
			 * @return {String|Number}
			 */
			resolveIdForItem: function( type, item ) {
				var id = _.isString( item ) || _.isNumber( item ) ? item : null;

				if ( id === null ) {
					if ( item instanceof Backbone.RelationalModel ) {
						id = item.id;
					}
					else if ( _.isObject( item ) ) {
						id = item[ type.prototype.idAttribute ];
					}
				}

				// Make all falsy values `null` (except for 0, which could be an id.. see '/issues/179')
				if ( !id && id !== 0 ) {
					id = null;
				}

				return id;
			},

			/**
			 * Find a specific model of a certain `type` in the store
			 * @param type
			 * @param {String|Number|Object|Backbone.RelationalModel} item
			 */
			find: function( type, item ) {
				var id = this.resolveIdForItem( type, item ),
					coll = this.getCollection( type );

				// Because the found object could be of any of the type's superModel
				// types, only return it if it's actually of the type asked for.
				if ( coll ) {
					var obj = coll.get( id );

					if ( obj instanceof type ) {
						return obj;
					}
				}

				return null;
			},

			/**
			 * Add a 'model' to its appropriate collection. Retain the original contents of 'model.collection'.
			 * @param {Backbone.RelationalModel} model
			 */
			register: function( model ) {
				var coll = this.getCollection( model );

				if ( coll ) {
					var modelColl = model.collection;
					coll.add( model );
					model.collection = modelColl;
				}
			},

			/**
			 * Check if the given model may use the given `id`
			 * @param model
			 * @param [id]
			 */
			checkId: function( model, id ) {
				var coll = this.getCollection( model ),
					duplicate = coll && coll.get( id );

				if ( duplicate && model !== duplicate ) {
					if ( Backbone.Relational.showWarnings && typeof console !== 'undefined' ) {
						console.warn( 'Duplicate id! Old RelationalModel=%o, new RelationalModel=%o', duplicate, model );
					}

					throw new Error( "Cannot instantiate more than one Backbone.RelationalModel with the same id per type!" );
				}
			},

			/**
			 * Explicitly update a model's id in its store collection
			 * @param {Backbone.RelationalModel} model
			 */
			update: function( model ) {
				var coll = this.getCollection( model );

				// Register a model if it isn't yet (which happens if it was created without an id).
				if ( !coll.contains( model ) ) {
					this.register( model );
				}

				// This triggers updating the lookup indices kept in a collection
				coll._onModelEvent( 'change:' + model.idAttribute, model, coll );

				// Trigger an event on model so related models (having the model's new id in their keyContents) can add it.
				model.trigger( 'relational:change:id', model, coll );
			},

			/**
			 * Unregister from the store: a specific model, a collection, or a model type.
			 * @param {Backbone.RelationalModel|Backbone.RelationalModel.constructor|Backbone.Collection} type
			 */
			unregister: function( type ) {
				var coll,
					models;

				if ( type instanceof Backbone.Model ) {
					coll = this.getCollection( type );
					models = [ type ];
				}
				else if ( type instanceof Backbone.Collection ) {
					coll = this.getCollection( type.model );
					models = _.clone( type.models );
				}
				else {
					coll = this.getCollection( type );
					models = _.clone( coll.models );
				}

				_.each( models, function( model ) {
					this.stopListening( model );
					_.invoke( model.getRelations(), 'stopListening' );
				}, this );


				// If we've unregistered an entire store collection, reset the collection (which is much faster).
				// Otherwise, remove each model one by one.
				if ( _.contains( this._collections, type ) ) {
					coll.reset( [] );
				}
				else {
					_.each( models, function( model ) {
						if ( coll.get( model ) ) {
							coll.remove( model );
						}
						else {
							coll.trigger( 'relational:remove', model, coll );
						}
					}, this );
				}
			},

			/**
			 * Reset the `store` to it's original state. The `reverseRelations` are kept though, since attempting to
			 * re-initialize these on models would lead to a large amount of warnings.
			 */
			reset: function() {
				this.stopListening();

				// Unregister each collection to remove event listeners
				_.each( this._collections, function( coll ) {
					this.unregister( coll );
				}, this );

				this._collections = [];
				this._subModels = [];
				this._modelScopes = [ exports ];
			}
		});
		Backbone.Relational.store = new Backbone.Store();

		/**
		 * The main Relation class, from which 'HasOne' and 'HasMany' inherit. Internally, 'relational:<key>' events
		 * are used to regulate addition and removal of models from relations.
		 *
		 * @param {Backbone.RelationalModel} [instance] Model that this relation is created for. If no model is supplied,
		 *      Relation just tries to instantiate it's `reverseRelation` if specified, and bails out after that.
		 * @param {Object} options
		 * @param {string} options.key
		 * @param {Backbone.RelationalModel.constructor} options.relatedModel
		 * @param {Boolean|String} [options.includeInJSON=true] Serialize the given attribute for related model(s)' in toJSON, or just their ids.
		 * @param {Boolean} [options.createModels=true] Create objects from the contents of keys if the object is not found in Backbone.store.
		 * @param {Object} [options.reverseRelation] Specify a bi-directional relation. If provided, Relation will reciprocate
		 *    the relation to the 'relatedModel'. Required and optional properties match 'options', except that it also needs
		 *    {Backbone.Relation|String} type ('HasOne' or 'HasMany').
		 * @param {Object} opts
		 */
		Backbone.Relation = function( instance, options, opts ) {
			this.instance = instance;
			// Make sure 'options' is sane, and fill with defaults from subclasses and this object's prototype
			options = _.isObject( options ) ? options : {};
			this.reverseRelation = _.defaults( options.reverseRelation || {}, this.options.reverseRelation );
			this.options = _.defaults( options, this.options, Backbone.Relation.prototype.options );

			this.reverseRelation.type = !_.isString( this.reverseRelation.type ) ? this.reverseRelation.type :
				Backbone[ this.reverseRelation.type ] || Backbone.Relational.store.getObjectByName( this.reverseRelation.type );

			this.key = this.options.key;
			this.keySource = this.options.keySource || this.key;
			this.keyDestination = this.options.keyDestination || this.keySource || this.key;

			this.model = this.options.model || this.instance.constructor;

			this.relatedModel = this.options.relatedModel;

			if ( _.isFunction( this.relatedModel ) && !( this.relatedModel.prototype instanceof Backbone.RelationalModel ) ) {
				this.relatedModel = _.result( this, 'relatedModel' );
			}
			if ( _.isString( this.relatedModel ) ) {
				this.relatedModel = Backbone.Relational.store.getObjectByName( this.relatedModel );
			}

			if ( !this.checkPreconditions() ) {
				return;
			}

			// Add the reverse relation on 'relatedModel' to the store's reverseRelations
			if ( !this.options.isAutoRelation && this.reverseRelation.type && this.reverseRelation.key ) {
				Backbone.Relational.store.addReverseRelation( _.defaults( {
						isAutoRelation: true,
						model: this.relatedModel,
						relatedModel: this.model,
						reverseRelation: this.options // current relation is the 'reverseRelation' for its own reverseRelation
					},
					this.reverseRelation // Take further properties from this.reverseRelation (type, key, etc.)
				) );
			}

			if ( instance ) {
				var contentKey = this.keySource;
				if ( contentKey !== this.key && typeof this.instance.get( this.key ) === 'object' ) {
					contentKey = this.key;
				}

				this.setKeyContents( this.instance.get( contentKey ) );
				this.relatedCollection = Backbone.Relational.store.getCollection( this.relatedModel );

				// Explicitly clear 'keySource', to prevent a leaky abstraction if 'keySource' differs from 'key'.
				if ( this.keySource !== this.key ) {
					delete this.instance.attributes[ this.keySource ];
				}

				// Add this Relation to instance._relations
				this.instance._relations[ this.key ] = this;

				this.initialize( opts );

				if ( this.options.autoFetch ) {
					this.instance.fetchRelated( this.key, _.isObject( this.options.autoFetch ) ? this.options.autoFetch : {} );
				}

				// When 'relatedModel' are created or destroyed, check if it affects this relation.
				this.listenTo( this.instance, 'destroy', this.destroy )
					.listenTo( this.relatedCollection, 'relational:add relational:change:id', this.tryAddRelated )
					.listenTo( this.relatedCollection, 'relational:remove', this.removeRelated )
			}
		};
		// Fix inheritance :\
		Backbone.Relation.extend = Backbone.Model.extend;
		// Set up all inheritable **Backbone.Relation** properties and methods.
		_.extend( Backbone.Relation.prototype, Backbone.Events, Backbone.Semaphore, {
			options: {
				createModels: true,
				includeInJSON: true,
				isAutoRelation: false,
				autoFetch: false,
				parse: false
			},

			instance: null,
			key: null,
			keyContents: null,
			relatedModel: null,
			relatedCollection: null,
			reverseRelation: null,
			related: null,

			/**
			 * Check several pre-conditions.
			 * @return {Boolean} True if pre-conditions are satisfied, false if they're not.
			 */
			checkPreconditions: function() {
				var i = this.instance,
					k = this.key,
					m = this.model,
					rm = this.relatedModel,
					warn = Backbone.Relational.showWarnings && typeof console !== 'undefined';

				if ( !m || !k || !rm ) {
					warn && console.warn( 'Relation=%o: missing model, key or relatedModel (%o, %o, %o).', this, m, k, rm );
					return false;
				}
				// Check if the type in 'model' inherits from Backbone.RelationalModel
				if ( !( m.prototype instanceof Backbone.RelationalModel ) ) {
					warn && console.warn( 'Relation=%o: model does not inherit from Backbone.RelationalModel (%o).', this, i );
					return false;
				}
				// Check if the type in 'relatedModel' inherits from Backbone.RelationalModel
				if ( !( rm.prototype instanceof Backbone.RelationalModel ) ) {
					warn && console.warn( 'Relation=%o: relatedModel does not inherit from Backbone.RelationalModel (%o).', this, rm );
					return false;
				}
				// Check if this is not a HasMany, and the reverse relation is HasMany as well
				if ( this instanceof Backbone.HasMany && this.reverseRelation.type === Backbone.HasMany ) {
					warn && console.warn( 'Relation=%o: relation is a HasMany, and the reverseRelation is HasMany as well.', this );
					return false;
				}
				// Check if we're not attempting to create a relationship on a `key` that's already used.
				if ( i && _.keys( i._relations ).length ) {
					var existing = _.find( i._relations, function( rel ) {
						return rel.key === k;
					}, this );

					if ( existing ) {
						warn && console.warn( 'Cannot create relation=%o on %o for model=%o: already taken by relation=%o.',
							this, k, i, existing );
						return false;
					}
				}

				return true;
			},

			/**
			 * Set the related model(s) for this relation
			 * @param {Backbone.Model|Backbone.Collection} related
			 */
			setRelated: function( related ) {
				this.related = related;
				this.instance.attributes[ this.key ] = related;
			},

			/**
			 * Determine if a relation (on a different RelationalModel) is the reverse
			 * relation of the current one.
			 * @param {Backbone.Relation} relation
			 * @return {Boolean}
			 */
			_isReverseRelation: function( relation ) {
				return relation.instance instanceof this.relatedModel && this.reverseRelation.key === relation.key &&
					this.key === relation.reverseRelation.key;
			},

			/**
			 * Get the reverse relations (pointing back to 'this.key' on 'this.instance') for the currently related model(s).
			 * @param {Backbone.RelationalModel} [model] Get the reverse relations for a specific model.
			 *    If not specified, 'this.related' is used.
			 * @return {Backbone.Relation[]}
			 */
			getReverseRelations: function( model ) {
				var reverseRelations = [];
				// Iterate over 'model', 'this.related.models' (if this.related is a Backbone.Collection), or wrap 'this.related' in an array.
				var models = !_.isUndefined( model ) ? [ model ] : this.related && ( this.related.models || [ this.related ] );
				_.each( models || [], function( related ) {
					_.each( related.getRelations() || [], function( relation ) {
						if ( this._isReverseRelation( relation ) ) {
							reverseRelations.push( relation );
						}
					}, this );
				}, this );

				return reverseRelations;
			},

			/**
			 * When `this.instance` is destroyed, cleanup our relations.
			 * Get reverse relation, call removeRelated on each.
			 */
			destroy: function() {
				this.stopListening();

				if ( this instanceof Backbone.HasOne ) {
					this.setRelated( null );
				}
				else if ( this instanceof Backbone.HasMany ) {
					this.setRelated( this._prepareCollection() );
				}

				_.each( this.getReverseRelations(), function( relation ) {
					relation.removeRelated( this.instance );
				}, this );
			}
		});

		Backbone.HasOne = Backbone.Relation.extend({
			options: {
				reverseRelation: { type: 'HasMany' }
			},

			initialize: function( opts ) {
				this.listenTo( this.instance, 'relational:change:' + this.key, this.onChange );

				var related = this.findRelated( opts );
				this.setRelated( related );

				// Notify new 'related' object of the new relation.
				_.each( this.getReverseRelations(), function( relation ) {
					relation.addRelated( this.instance, opts );
				}, this );
			},

			/**
			 * Find related Models.
			 * @param {Object} [options]
			 * @return {Backbone.Model}
			 */
			findRelated: function( options ) {
				var related = null;

				options = _.defaults( { parse: this.options.parse }, options );

				if ( this.keyContents instanceof this.relatedModel ) {
					related = this.keyContents;
				}
				else if ( this.keyContents || this.keyContents === 0 ) { // since 0 can be a valid `id` as well
					var opts = _.defaults( { create: this.options.createModels }, options );
					related = this.relatedModel.findOrCreate( this.keyContents, opts );
				}

				// Nullify `keyId` if we have a related model; in case it was already part of the relation
				if ( related ) {
					this.keyId = null;
				}

				return related;
			},

			/**
			 * Normalize and reduce `keyContents` to an `id`, for easier comparison
			 * @param {String|Number|Backbone.Model} keyContents
			 */
			setKeyContents: function( keyContents ) {
				this.keyContents = keyContents;
				this.keyId = Backbone.Relational.store.resolveIdForItem( this.relatedModel, this.keyContents );
			},

			/**
			 * Event handler for `change:<key>`.
			 * If the key is changed, notify old & new reverse relations and initialize the new relation.
			 */
			onChange: function( model, attr, options ) {
				// Don't accept recursive calls to onChange (like onChange->findRelated->findOrCreate->initializeRelations->addRelated->onChange)
				if ( this.isLocked() ) {
					return;
				}
				this.acquire();
				options = options ? _.clone( options ) : {};

				// 'options.__related' is set by 'addRelated'/'removeRelated'. If it is set, the change
				// is the result of a call from a relation. If it's not, the change is the result of
				// a 'set' call on this.instance.
				var changed = _.isUndefined( options.__related ),
					oldRelated = changed ? this.related : options.__related;

				if ( changed ) {
					this.setKeyContents( attr );
					var related = this.findRelated( options );
					this.setRelated( related );
				}

				// Notify old 'related' object of the terminated relation
				if ( oldRelated && this.related !== oldRelated ) {
					_.each( this.getReverseRelations( oldRelated ), function( relation ) {
						relation.removeRelated( this.instance, null, options );
					}, this );
				}

				// Notify new 'related' object of the new relation. Note we do re-apply even if this.related is oldRelated;
				// that can be necessary for bi-directional relations if 'this.instance' was created after 'this.related'.
				// In that case, 'this.instance' will already know 'this.related', but the reverse might not exist yet.
				_.each( this.getReverseRelations(), function( relation ) {
					relation.addRelated( this.instance, options );
				}, this );

				// Fire the 'change:<key>' event if 'related' was updated
				if ( !options.silent && this.related !== oldRelated ) {
					var dit = this;
					this.changed = true;
					Backbone.Relational.eventQueue.add( function() {
						dit.instance.trigger( 'change:' + dit.key, dit.instance, dit.related, options, true );
						dit.changed = false;
					});
				}
				this.release();
			},

			/**
			 * If a new 'this.relatedModel' appears in the 'store', try to match it to the last set 'keyContents'
			 */
			tryAddRelated: function( model, coll, options ) {
				if ( ( this.keyId || this.keyId === 0 ) && model.id === this.keyId ) { // since 0 can be a valid `id` as well
					this.addRelated( model, options );
					this.keyId = null;
				}
			},

			addRelated: function( model, options ) {
				// Allow 'model' to set up its relations before proceeding.
				// (which can result in a call to 'addRelated' from a relation of 'model')
				var dit = this;
				model.queue( function() {
					if ( model !== dit.related ) {
						var oldRelated = dit.related || null;
						dit.setRelated( model );
						dit.onChange( dit.instance, model, _.defaults( { __related: oldRelated }, options ) );
					}
				});
			},

			removeRelated: function( model, coll, options ) {
				if ( !this.related ) {
					return;
				}

				if ( model === this.related ) {
					var oldRelated = this.related || null;
					this.setRelated( null );
					this.onChange( this.instance, model, _.defaults( { __related: oldRelated }, options ) );
				}
			}
		});

		Backbone.HasMany = Backbone.Relation.extend({
			collectionType: null,

			options: {
				reverseRelation: { type: 'HasOne' },
				collectionType: Backbone.Collection,
				collectionKey: true,
				collectionOptions: {}
			},

			initialize: function( opts ) {
				this.listenTo( this.instance, 'relational:change:' + this.key, this.onChange );

				// Handle a custom 'collectionType'
				this.collectionType = this.options.collectionType;
				if ( _.isFunction( this.collectionType ) && this.collectionType !== Backbone.Collection && !( this.collectionType.prototype instanceof Backbone.Collection ) ) {
					this.collectionType = _.result( this, 'collectionType' );
				}
				if ( _.isString( this.collectionType ) ) {
					this.collectionType = Backbone.Relational.store.getObjectByName( this.collectionType );
				}
				if ( this.collectionType !== Backbone.Collection && !( this.collectionType.prototype instanceof Backbone.Collection ) ) {
					throw new Error( '`collectionType` must inherit from Backbone.Collection' );
				}

				var related = this.findRelated( opts );
				this.setRelated( related );
			},

			/**
			 * Bind events and setup collectionKeys for a collection that is to be used as the backing store for a HasMany.
			 * If no 'collection' is supplied, a new collection will be created of the specified 'collectionType' option.
			 * @param {Backbone.Collection} [collection]
			 * @return {Backbone.Collection}
			 */
			_prepareCollection: function( collection ) {
				if ( this.related ) {
					this.stopListening( this.related );
				}

				if ( !collection || !( collection instanceof Backbone.Collection ) ) {
					var options = _.isFunction( this.options.collectionOptions ) ?
						this.options.collectionOptions( this.instance ) : this.options.collectionOptions;

					collection = new this.collectionType( null, options );
				}

				collection.model = this.relatedModel;

				if ( this.options.collectionKey ) {
					var key = this.options.collectionKey === true ? this.options.reverseRelation.key : this.options.collectionKey;

					if ( collection[ key ] && collection[ key ] !== this.instance ) {
						if ( Backbone.Relational.showWarnings && typeof console !== 'undefined' ) {
							console.warn( 'Relation=%o; collectionKey=%s already exists on collection=%o', this, key, this.options.collectionKey );
						}
					}
					else if ( key ) {
						collection[ key ] = this.instance;
					}
				}

				this.listenTo( collection, 'relational:add', this.handleAddition )
					.listenTo( collection, 'relational:remove', this.handleRemoval )
					.listenTo( collection, 'relational:reset', this.handleReset );

				return collection;
			},

			/**
			 * Find related Models.
			 * @param {Object} [options]
			 * @return {Backbone.Collection}
			 */
			findRelated: function( options ) {
				var related = null;

				options = _.defaults( { parse: this.options.parse }, options );

				// Replace 'this.related' by 'this.keyContents' if it is a Backbone.Collection
				if ( this.keyContents instanceof Backbone.Collection ) {
					this._prepareCollection( this.keyContents );
					related = this.keyContents;
				}
				// Otherwise, 'this.keyContents' should be an array of related object ids.
				// Re-use the current 'this.related' if it is a Backbone.Collection; otherwise, create a new collection.
				else {
					var toAdd = [];

					_.each( this.keyContents, function( attributes ) {
						if ( attributes instanceof this.relatedModel ) {
							var model = attributes;
						}
						else {
							// If `merge` is true, update models here, instead of during update.
							model = this.relatedModel.findOrCreate( attributes,
								_.extend( { merge: true }, options, { create: this.options.createModels } )
							);
						}

						model && toAdd.push( model );
					}, this );

					if ( this.related instanceof Backbone.Collection ) {
						related = this.related;
					}
					else {
						related = this._prepareCollection();
					}

					// By now, both `merge` and `parse` will already have been executed for models if they were specified.
					// Disable them to prevent additional calls.
					related.set( toAdd, _.defaults( { merge: false, parse: false }, options ) );
				}

				// Remove entries from `keyIds` that were already part of the relation (and are thus 'unchanged')
				this.keyIds = _.difference( this.keyIds, _.pluck( related.models, 'id' ) );

				return related;
			},

			/**
			 * Normalize and reduce `keyContents` to a list of `ids`, for easier comparison
			 * @param {String|Number|String[]|Number[]|Backbone.Collection} keyContents
			 */
			setKeyContents: function( keyContents ) {
				this.keyContents = keyContents instanceof Backbone.Collection ? keyContents : null;
				this.keyIds = [];

				if ( !this.keyContents && ( keyContents || keyContents === 0 ) ) { // since 0 can be a valid `id` as well
					// Handle cases the an API/user supplies just an Object/id instead of an Array
					this.keyContents = _.isArray( keyContents ) ? keyContents : [ keyContents ];

					_.each( this.keyContents, function( item ) {
						var itemId = Backbone.Relational.store.resolveIdForItem( this.relatedModel, item );
						if ( itemId || itemId === 0 ) {
							this.keyIds.push( itemId );
						}
					}, this );
				}
			},

			/**
			 * Event handler for `change:<key>`.
			 * If the contents of the key are changed, notify old & new reverse relations and initialize the new relation.
			 */
			onChange: function( model, attr, options ) {
				options = options ? _.clone( options ) : {};
				this.setKeyContents( attr );
				this.changed = false;

				var related = this.findRelated( options );
				this.setRelated( related );

				if ( !options.silent ) {
					var dit = this;
					Backbone.Relational.eventQueue.add( function() {
						// The `changed` flag can be set in `handleAddition` or `handleRemoval`
						if ( dit.changed ) {
							dit.instance.trigger( 'change:' + dit.key, dit.instance, dit.related, options, true );
							dit.changed = false;
						}
					});
				}
			},

			/**
			 * When a model is added to a 'HasMany', trigger 'add' on 'this.instance' and notify reverse relations.
			 * (should be 'HasOne', must set 'this.instance' as their related).
			 */
			handleAddition: function( model, coll, options ) {
				//console.debug('handleAddition called; args=%o', arguments);
				options = options ? _.clone( options ) : {};
				this.changed = true;

				_.each( this.getReverseRelations( model ), function( relation ) {
					relation.addRelated( this.instance, options );
				}, this );

				// Only trigger 'add' once the newly added model is initialized (so, has its relations set up)
				var dit = this;
				!options.silent && Backbone.Relational.eventQueue.add( function() {
					dit.instance.trigger( 'add:' + dit.key, model, dit.related, options );
				});
			},

			/**
			 * When a model is removed from a 'HasMany', trigger 'remove' on 'this.instance' and notify reverse relations.
			 * (should be 'HasOne', which should be nullified)
			 */
			handleRemoval: function( model, coll, options ) {
				//console.debug('handleRemoval called; args=%o', arguments);
				options = options ? _.clone( options ) : {};
				this.changed = true;

				_.each( this.getReverseRelations( model ), function( relation ) {
					relation.removeRelated( this.instance, null, options );
				}, this );

				var dit = this;
				!options.silent && Backbone.Relational.eventQueue.add( function() {
					dit.instance.trigger( 'remove:' + dit.key, model, dit.related, options );
				});
			},

			handleReset: function( coll, options ) {
				var dit = this;
				options = options ? _.clone( options ) : {};
				!options.silent && Backbone.Relational.eventQueue.add( function() {
					dit.instance.trigger( 'reset:' + dit.key, dit.related, options );
				});
			},

			tryAddRelated: function( model, coll, options ) {
				var item = _.contains( this.keyIds, model.id );

				if ( item ) {
					this.addRelated( model, options );
					this.keyIds = _.without( this.keyIds, model.id );
				}
			},

			addRelated: function( model, options ) {
				// Allow 'model' to set up its relations before proceeding.
				// (which can result in a call to 'addRelated' from a relation of 'model')
				var dit = this;
				model.queue( function() {
					if ( dit.related && !dit.related.get( model ) ) {
						dit.related.add( model, _.defaults( { parse: false }, options ) );
					}
				});
			},

			removeRelated: function( model, coll, options ) {
				if ( this.related.get( model ) ) {
					this.related.remove( model, options );
				}
			}
		});

		/**
		 * A type of Backbone.Model that also maintains relations to other models and collections.
		 * New events when compared to the original:
		 *  - 'add:<key>' (model, related collection, options)
		 *  - 'remove:<key>' (model, related collection, options)
		 *  - 'change:<key>' (model, related model or collection, options)
		 */
		Backbone.RelationalModel = Backbone.Model.extend({
			relations: null, // Relation descriptions on the prototype
			_relations: null, // Relation instances
			_isInitialized: false,
			_deferProcessing: false,
			_queue: null,
			_attributeChangeFired: false, // Keeps track of `change` event firing under some conditions (like nested `set`s)

			subModelTypeAttribute: 'type',
			subModelTypes: null,

			constructor: function( attributes, options ) {
				// Nasty hack, for cases like 'model.get( <HasMany key> ).add( item )'.
				// Defer 'processQueue', so that when 'Relation.createModels' is used we trigger 'HasMany'
				// collection events only after the model is really fully set up.
				// Example: event for "p.on( 'add:jobs' )" -> "p.get('jobs').add( { company: c.id, person: p.id } )".
				if ( options && options.collection ) {
					var dit = this,
						collection = this.collection = options.collection;

					// Prevent `collection` from cascading down to nested models; they shouldn't go into this `if` clause.
					delete options.collection;

					this._deferProcessing = true;

					var processQueue = function( model ) {
						if ( model === dit ) {
							dit._deferProcessing = false;
							dit.processQueue();
							collection.off( 'relational:add', processQueue );
						}
					};
					collection.on( 'relational:add', processQueue );

					// So we do process the queue eventually, regardless of whether this model actually gets added to 'options.collection'.
					_.defer( function() {
						processQueue( dit );
					});
				}

				Backbone.Relational.store.processOrphanRelations();
				Backbone.Relational.store.listenTo( this, 'relational:unregister', Backbone.Relational.store.unregister );

				this._queue = new Backbone.BlockingQueue();
				this._queue.block();
				Backbone.Relational.eventQueue.block();

				try {
					Backbone.Model.apply( this, arguments );
				}
				finally {
					// Try to run the global queue holding external events
					Backbone.Relational.eventQueue.unblock();
				}
			},

			/**
			 * Override 'trigger' to queue 'change' and 'change:*' events
			 */
			trigger: function( eventName ) {
				if ( eventName.length > 5 && eventName.indexOf( 'change' ) === 0 ) {
					var dit = this,
						args = arguments;

					if ( !Backbone.Relational.eventQueue.isLocked() ) {
						// If we're not in a more complicated nested scenario, fire the change event right away
						Backbone.Model.prototype.trigger.apply( dit, args );
					}
					else {
						Backbone.Relational.eventQueue.add( function() {
							// Determine if the `change` event is still valid, now that all relations are populated
							var changed = true;
							if ( eventName === 'change' ) {
								// `hasChanged` may have gotten reset by nested calls to `set`.
								changed = dit.hasChanged() || dit._attributeChangeFired;
								dit._attributeChangeFired = false;
							}
							else {
								var attr = eventName.slice( 7 ),
									rel = dit.getRelation( attr );

								if ( rel ) {
									// If `attr` is a relation, `change:attr` get triggered from `Relation.onChange`.
									// These take precedence over `change:attr` events triggered by `Model.set`.
									// The relation sets a fourth attribute to `true`. If this attribute is present,
									// continue triggering this event; otherwise, it's from `Model.set` and should be stopped.
									changed = ( args[ 4 ] === true );

									// If this event was triggered by a relation, set the right value in `this.changed`
									// (a Collection or Model instead of raw data).
									if ( changed ) {
										dit.changed[ attr ] = args[ 2 ];
									}
									// Otherwise, this event is from `Model.set`. If the relation doesn't report a change,
									// remove attr from `dit.changed` so `hasChanged` doesn't take it into account.
									else if ( !rel.changed ) {
										delete dit.changed[ attr ];
									}
								}
								else if ( changed ) {
									dit._attributeChangeFired = true;
								}
							}

							changed && Backbone.Model.prototype.trigger.apply( dit, args );
						});
					}
				}
				else if ( eventName === 'destroy' ) {
					Backbone.Model.prototype.trigger.apply( this, arguments );
					Backbone.Relational.store.unregister( this );
				}
				else {
					Backbone.Model.prototype.trigger.apply( this, arguments );
				}

				return this;
			},

			/**
			 * Initialize Relations present in this.relations; determine the type (HasOne/HasMany), then creates a new instance.
			 * Invoked in the first call so 'set' (which is made from the Backbone.Model constructor).
			 */
			initializeRelations: function( options ) {
				this.acquire(); // Setting up relations often also involve calls to 'set', and we only want to enter this function once
				this._relations = {};

				_.each( this.relations || [], function( rel ) {
					Backbone.Relational.store.initializeRelation( this, rel, options );
				}, this );

				this._isInitialized = true;
				this.release();
				this.processQueue();
			},

			/**
			 * When new values are set, notify this model's relations (also if options.silent is set).
			 * (called from `set`; Relation.setRelated locks this model before calling 'set' on it to prevent loops)
			 * @param {Object} [changedAttrs]
			 * @param {Object} [options]
			 */
			updateRelations: function( changedAttrs, options ) {
				if ( this._isInitialized && !this.isLocked() ) {
					_.each( this._relations, function( rel ) {
						if ( !changedAttrs || ( rel.keySource in changedAttrs || rel.key in changedAttrs ) ) {
							// Fetch data in `rel.keySource` if data got set in there, or `rel.key` otherwise
							var value = this.attributes[ rel.keySource ] || this.attributes[ rel.key ],
								attr = changedAttrs && ( changedAttrs[ rel.keySource ] || changedAttrs[ rel.key ] );

							// Update a relation if its value differs from this model's attributes, or it's been explicitly nullified.
							// Which can also happen before the originally intended related model has been found (`val` is null).
							if ( rel.related !== value || ( value === null && attr === null ) ) {
								this.trigger( 'relational:change:' + rel.key, this, value, options || {} );
							}
						}

						// Explicitly clear 'keySource', to prevent a leaky abstraction if 'keySource' differs from 'key'.
						if ( rel.keySource !== rel.key ) {
							delete this.attributes[ rel.keySource ];
						}
					}, this );
				}
			},

			/**
			 * Either add to the queue (if we're not initialized yet), or execute right away.
			 */
			queue: function( func ) {
				this._queue.add( func );
			},

			/**
			 * Process _queue
			 */
			processQueue: function() {
				if ( this._isInitialized && !this._deferProcessing && this._queue.isBlocked() ) {
					this._queue.unblock();
				}
			},

			/**
			 * Get a specific relation.
			 * @param {string} key The relation key to look for.
			 * @return {Backbone.Relation} An instance of 'Backbone.Relation', if a relation was found for 'key', or null.
			 */
			getRelation: function( key ) {
				return this._relations[ key ];
			},

			/**
			 * Get all of the created relations.
			 * @return {Backbone.Relation[]}
			 */
			getRelations: function() {
				return _.values( this._relations );
			},

			/**
			 * Retrieve related objects.
			 * @param {string} key The relation key to fetch models for.
			 * @param {Object} [options] Options for 'Backbone.Model.fetch' and 'Backbone.sync'.
			 * @param {Boolean} [refresh=false] Fetch existing models from the server as well (in order to update them).
			 * @return {jQuery.when[]} An array of request objects
			 */
			fetchRelated: function( key, options, refresh ) {
				// Set default `options` for fetch
				options = _.extend( { update: true, remove: false }, options );

				var models,
					setUrl,
					requests = [],
					rel = this.getRelation( key ),
					idsToFetch = rel && ( ( rel.keyIds && rel.keyIds.slice( 0 ) ) || ( ( rel.keyId || rel.keyId === 0 ) ? [ rel.keyId ] : [] ) );

				// On `refresh`, add the ids for current models in the relation to `idsToFetch`
				if ( refresh ) {
					models = rel.related instanceof Backbone.Collection ? rel.related.models : [ rel.related ];
					_.each( models, function( model ) {
						if ( model.id || model.id === 0 ) {
							idsToFetch.push( model.id );
						}
					});
				}

				if ( idsToFetch && idsToFetch.length ) {
					// Find (or create) a model for each one that is to be fetched
					var created = [];
					models = _.map( idsToFetch, function( id ) {
						var model = rel.relatedModel.findModel( id );

						if ( !model ) {
							var attrs = {};
							attrs[ rel.relatedModel.prototype.idAttribute ] = id;
							model = rel.relatedModel.findOrCreate( attrs, options );
							created.push( model );
						}

						return model;
					}, this );

					// Try if the 'collection' can provide a url to fetch a set of models in one request.
					if ( rel.related instanceof Backbone.Collection && _.isFunction( rel.related.url ) ) {
						setUrl = rel.related.url( models );
					}

					// An assumption is that when 'Backbone.Collection.url' is a function, it can handle building of set urls.
					// To make sure it can, test if the url we got by supplying a list of models to fetch is different from
					// the one supplied for the default fetch action (without args to 'url').
					if ( setUrl && setUrl !== rel.related.url() ) {
						var opts = _.defaults(
							{
								error: function() {
									var args = arguments;
									_.each( created, function( model ) {
										model.trigger( 'destroy', model, model.collection, options );
										options.error && options.error.apply( model, args );
									});
								},
								url: setUrl
							},
							options
						);

						requests = [ rel.related.fetch( opts ) ];
					}
					else {
						requests = _.map( models, function( model ) {
							var opts = _.defaults(
								{
									error: function() {
										if ( _.contains( created, model ) ) {
											model.trigger( 'destroy', model, model.collection, options );
											options.error && options.error.apply( model, arguments );
										}
									}
								},
								options
							);
							return model.fetch( opts );
						}, this );
					}
				}

				return requests;
			},

			get: function( attr ) {
				var originalResult = Backbone.Model.prototype.get.call( this, attr );

				// Use `originalResult` get if dotNotation not enabled or not required because no dot is in `attr`
				if ( !this.dotNotation || attr.indexOf( '.' ) === -1 ) {
					return originalResult;
				}

				// Go through all splits and return the final result
				var splits = attr.split( '.' );
				var result = _.reduce( splits, function( model, split ) {
					if ( _.isNull( model ) || _.isUndefined( model ) ) {
						// Return undefined if the path cannot be expanded
						return undefined;
					}
					else if ( model instanceof Backbone.Model ) {
						return Backbone.Model.prototype.get.call( model, split );
					}
					else if ( model instanceof Backbone.Collection ) {
						return Backbone.Collection.prototype.at.call( model, split )
					}
					else {
						throw new Error( 'Attribute must be an instanceof Backbone.Model or Backbone.Collection. Is: ' + model + ', currentSplit: ' + split );
					}
				}, this );

				if ( originalResult !== undefined && result !== undefined ) {
					throw new Error( "Ambiguous result for '" + attr + "'. direct result: " + originalResult + ", dotNotation: " + result );
				}

				return originalResult || result;
			},

			set: function( key, value, options ) {
				Backbone.Relational.eventQueue.block();

				// Duplicate backbone's behavior to allow separate key/value parameters, instead of a single 'attributes' object
				var attributes;
				if ( _.isObject( key ) || key == null ) {
					attributes = key;
					options = value;
				}
				else {
					attributes = {};
					attributes[ key ] = value;
				}

				try {
					var id = this.id,
						newId = attributes && this.idAttribute in attributes && attributes[ this.idAttribute ];

					// Check if we're not setting a duplicate id before actually calling `set`.
					Backbone.Relational.store.checkId( this, newId );

					var result = Backbone.Model.prototype.set.apply( this, arguments );

					// Ideal place to set up relations, if this is the first time we're here for this model
					if ( !this._isInitialized && !this.isLocked() ) {
						this.constructor.initializeModelHierarchy();

						// Only register models that have an id. A model will be registered when/if it gets an id later on.
						if ( newId || newId === 0 ) {
							Backbone.Relational.store.register( this );
						}

						this.initializeRelations( options );
					}
					// The store should know about an `id` update asap
					else if ( newId && newId !== id ) {
						Backbone.Relational.store.update( this );
					}

					if ( attributes ) {
						this.updateRelations( attributes, options );
					}
				}
				finally {
					// Try to run the global queue holding external events
					Backbone.Relational.eventQueue.unblock();
				}

				return result;
			},

			clone: function() {
				var attributes = _.clone( this.attributes );
				if ( !_.isUndefined( attributes[ this.idAttribute ] ) ) {
					attributes[ this.idAttribute ] = null;
				}

				_.each( this.getRelations(), function( rel ) {
					delete attributes[ rel.key ];
				});

				return new this.constructor( attributes );
			},

			/**
			 * Convert relations to JSON, omits them when required
			 */
			toJSON: function( options ) {
				// If this Model has already been fully serialized in this branch once, return to avoid loops
				if ( this.isLocked() ) {
					return this.id;
				}

				this.acquire();
				var json = Backbone.Model.prototype.toJSON.call( this, options );

				if ( this.constructor._superModel && !( this.constructor._subModelTypeAttribute in json ) ) {
					json[ this.constructor._subModelTypeAttribute ] = this.constructor._subModelTypeValue;
				}

				_.each( this._relations, function( rel ) {
					var related = json[ rel.key ],
						includeInJSON = rel.options.includeInJSON,
						value = null;

					if ( includeInJSON === true ) {
						if ( related && _.isFunction( related.toJSON ) ) {
							value = related.toJSON( options );
						}
					}
					else if ( _.isString( includeInJSON ) ) {
						if ( related instanceof Backbone.Collection ) {
							value = related.pluck( includeInJSON );
						}
						else if ( related instanceof Backbone.Model ) {
							value = related.get( includeInJSON );
						}

						// Add ids for 'unfound' models if includeInJSON is equal to (only) the relatedModel's `idAttribute`
						if ( includeInJSON === rel.relatedModel.prototype.idAttribute ) {
							if ( rel instanceof Backbone.HasMany ) {
								value = value.concat( rel.keyIds );
							}
							else if ( rel instanceof Backbone.HasOne ) {
								value = value || rel.keyId;

								if ( !value && !_.isObject( rel.keyContents ) ) {
									value = rel.keyContents || null;
								}
							}
						}
					}
					else if ( _.isArray( includeInJSON ) ) {
						if ( related instanceof Backbone.Collection ) {
							value = [];
							related.each( function( model ) {
								var curJson = {};
								_.each( includeInJSON, function( key ) {
									curJson[ key ] = model.get( key );
								});
								value.push( curJson );
							});
						}
						else if ( related instanceof Backbone.Model ) {
							value = {};
							_.each( includeInJSON, function( key ) {
								value[ key ] = related.get( key );
							});
						}
					}
					else {
						delete json[ rel.key ];
					}

					if ( includeInJSON ) {
						json[ rel.keyDestination ] = value;
					}

					if ( rel.keyDestination !== rel.key ) {
						delete json[ rel.key ];
					}
				});

				this.release();
				return json;
			}
		},
		{
			/**
			 *
			 * @param superModel
			 * @returns {Backbone.RelationalModel.constructor}
			 */
			setup: function( superModel ) {
				// We don't want to share a relations array with a parent, as this will cause problems with reverse
				// relations. Since `relations` may also be a property or function, only use slice if we have an array.
				this.prototype.relations = ( this.prototype.relations || [] ).slice( 0 );

				this._subModels = {};
				this._superModel = null;

				// If this model has 'subModelTypes' itself, remember them in the store
				if ( this.prototype.hasOwnProperty( 'subModelTypes' ) ) {
					Backbone.Relational.store.addSubModels( this.prototype.subModelTypes, this );
				}
				// The 'subModelTypes' property should not be inherited, so reset it.
				else {
					this.prototype.subModelTypes = null;
				}

				// Initialize all reverseRelations that belong to this new model.
				_.each( this.prototype.relations || [], function( rel ) {
					if ( !rel.model ) {
						rel.model = this;
					}

					if ( rel.reverseRelation && rel.model === this ) {
						var preInitialize = true;
						if ( _.isString( rel.relatedModel ) ) {
							/**
							 * The related model might not be defined for two reasons
							 *  1. it is related to itself
							 *  2. it never gets defined, e.g. a typo
							 *  3. the model hasn't been defined yet, but will be later
							 * In neither of these cases do we need to pre-initialize reverse relations.
							 * However, for 3. (which is, to us, indistinguishable from 2.), we do need to attempt
							 * setting up this relation again later, in case the related model is defined later.
							 */
							var relatedModel = Backbone.Relational.store.getObjectByName( rel.relatedModel );
							preInitialize = relatedModel && ( relatedModel.prototype instanceof Backbone.RelationalModel );
						}

						if ( preInitialize ) {
							Backbone.Relational.store.initializeRelation( null, rel );
						}
						else if ( _.isString( rel.relatedModel ) ) {
							Backbone.Relational.store.addOrphanRelation( rel );
						}
					}
				}, this );

				return this;
			},

			/**
			 * Create a 'Backbone.Model' instance based on 'attributes'.
			 * @param {Object} attributes
			 * @param {Object} [options]
			 * @return {Backbone.Model}
			 */
			build: function( attributes, options ) {
				// 'build' is a possible entrypoint; it's possible no model hierarchy has been determined yet.
				this.initializeModelHierarchy();

				// Determine what type of (sub)model should be built if applicable.
				var model = this._findSubModelType( this, attributes ) || this;

				return new model( attributes, options );
			},

			/**
			 * Determines what type of (sub)model should be built if applicable.
			 * Looks up the proper subModelType in 'this._subModels', recursing into
			 * types until a match is found.  Returns the applicable 'Backbone.Model'
			 * or null if no match is found.
			 * @param {Backbone.Model} type
			 * @param {Object} attributes
			 * @return {Backbone.Model}
			 */
			_findSubModelType: function( type, attributes ) {
				if ( type._subModels && type.prototype.subModelTypeAttribute in attributes ) {
					var subModelTypeAttribute = attributes[ type.prototype.subModelTypeAttribute ];
					var subModelType = type._subModels[ subModelTypeAttribute ];
					if ( subModelType ) {
						return subModelType;
					}
					else {
						// Recurse into subModelTypes to find a match
						for ( subModelTypeAttribute in type._subModels ) {
							subModelType = this._findSubModelType( type._subModels[ subModelTypeAttribute ], attributes );
							if ( subModelType ) {
								return subModelType;
							}
						}
					}
				}
				return null;
			},

			/**
			 *
			 */
			initializeModelHierarchy: function() {
				// Inherit any relations that have been defined in the parent model.
				this.inheritRelations();

				// If we came here through 'build' for a model that has 'subModelTypes' then try to initialize the ones that
				// haven't been resolved yet.
				if ( this.prototype.subModelTypes ) {
					var resolvedSubModels = _.keys( this._subModels );
					var unresolvedSubModels = _.omit( this.prototype.subModelTypes, resolvedSubModels );
					_.each( unresolvedSubModels, function( subModelTypeName ) {
						var subModelType = Backbone.Relational.store.getObjectByName( subModelTypeName );
						subModelType && subModelType.initializeModelHierarchy();
					});
				}
			},

			inheritRelations: function() {
				// Bail out if we've been here before.
				if ( !_.isUndefined( this._superModel ) && !_.isNull( this._superModel ) ) {
					return;
				}
				// Try to initialize the _superModel.
				Backbone.Relational.store.setupSuperModel( this );

				// If a superModel has been found, copy relations from the _superModel if they haven't been inherited automatically
				// (due to a redefinition of 'relations').
				if ( this._superModel ) {
					// The _superModel needs a chance to initialize its own inherited relations before we attempt to inherit relations
					// from the _superModel. You don't want to call 'initializeModelHierarchy' because that could cause sub-models of
					// this class to inherit their relations before this class has had chance to inherit it's relations.
					this._superModel.inheritRelations();
					if ( this._superModel.prototype.relations ) {
						// Find relations that exist on the '_superModel', but not yet on this model.
						var inheritedRelations = _.filter( this._superModel.prototype.relations || [], function( superRel ) {
							return !_.any( this.prototype.relations || [], function( rel ) {
								return superRel.relatedModel === rel.relatedModel && superRel.key === rel.key;
							}, this );
						}, this );

						this.prototype.relations = inheritedRelations.concat( this.prototype.relations );
					}
				}
				// Otherwise, make sure we don't get here again for this type by making '_superModel' false so we fail the
				// isUndefined/isNull check next time.
				else {
					this._superModel = false;
				}
			},

			/**
			 * Find an instance of `this` type in 'Backbone.Relational.store'.
			 * A new model is created if no matching model is found, `attributes` is an object, and `options.create` is true.
			 * - If `attributes` is a string or a number, `findOrCreate` will query the `store` and return a model if found.
			 * - If `attributes` is an object and is found in the store, the model will be updated with `attributes` unless `options.update` is `false`.
			 * @param {Object|String|Number} attributes Either a model's id, or the attributes used to create or update a model.
			 * @param {Object} [options]
			 * @param {Boolean} [options.create=true]
			 * @param {Boolean} [options.merge=true]
			 * @param {Boolean} [options.parse=false]
			 * @return {Backbone.RelationalModel}
			 */
			findOrCreate: function( attributes, options ) {
				options || ( options = {} );
				var parsedAttributes = ( _.isObject( attributes ) && options.parse && this.prototype.parse ) ?
					this.prototype.parse( _.clone( attributes ) ) : attributes;

				// If specified, use a custom `find` function to match up existing models to the given attributes.
				// Otherwise, try to find an instance of 'this' model type in the store
				var model = this.findModel( parsedAttributes );

				// If we found an instance, update it with the data in 'item' (unless 'options.merge' is false).
				// If not, create an instance (unless 'options.create' is false).
				if ( _.isObject( attributes ) ) {
					if ( model && options.merge !== false ) {
						// Make sure `options.collection` and `options.url` doesn't cascade to nested models
						delete options.collection;
						delete options.url;

						model.set( parsedAttributes, options );
					}
					else if ( !model && options.create !== false ) {
						model = this.build( parsedAttributes, _.defaults( { parse: false }, options ) );
					}
				}

				return model;
			},

			/**
			 * Find an instance of `this` type in 'Backbone.Relational.store'.
			 * - If `attributes` is a string or a number, `find` will query the `store` and return a model if found.
			 * - If `attributes` is an object and is found in the store, the model will be updated with `attributes` unless `options.update` is `false`.
			 * @param {Object|String|Number} attributes Either a model's id, or the attributes used to create or update a model.
			 * @param {Object} [options]
			 * @param {Boolean} [options.merge=true]
			 * @param {Boolean} [options.parse=false]
			 * @return {Backbone.RelationalModel}
			 */
			find: function( attributes, options ) {
				options || ( options = {} );
				options.create = false;
				return this.findOrCreate( attributes, options );
			},

			/**
			 * A hook to override the matching when updating (or creating) a model.
			 * The default implementation is to look up the model by id in the store.
			 * @param {Object} attributes
			 * @returns {Backbone.RelationalModel}
			 */
			findModel: function( attributes ) {
				return Backbone.Relational.store.find( this, attributes );
			}
		});
		_.extend( Backbone.RelationalModel.prototype, Backbone.Semaphore );

		/**
		 * Override Backbone.Collection._prepareModel, so objects will be built using the correct type
		 * if the collection.model has subModels.
		 * Attempts to find a model for `attrs` in Backbone.store through `findOrCreate`
		 * (which sets the new properties on it if found), or instantiates a new model.
		 */
		Backbone.Collection.prototype.__prepareModel = Backbone.Collection.prototype._prepareModel;
		Backbone.Collection.prototype._prepareModel = function( attrs, options ) {
			var model;

			if ( attrs instanceof Backbone.Model ) {
				if ( !attrs.collection ) {
					attrs.collection = this;
				}
				model = attrs;
			}
			else {
				options = options ? _.clone( options ) : {};
				options.collection = this;

				if ( typeof this.model.findOrCreate !== 'undefined' ) {
					model = this.model.findOrCreate( attrs, options );
				}
				else {
					model = new this.model( attrs, options );
				}

				if ( model && model.validationError ) {
					this.trigger( 'invalid', this, attrs, options );
					model = false;
				}
			}

			return model;
		};


		/**
		 * Override Backbone.Collection.set, so we'll create objects from attributes where required,
		 * and update the existing models. Also, trigger 'relational:add'.
		 */
		var set = Backbone.Collection.prototype.__set = Backbone.Collection.prototype.set;
		Backbone.Collection.prototype.set = function( models, options ) {
			// Short-circuit if this Collection doesn't hold RelationalModels
			if ( !( this.model.prototype instanceof Backbone.RelationalModel ) ) {
				return set.apply( this, arguments );
			}

			if ( options && options.parse ) {
				models = this.parse( models, options );
			}

			var singular = !_.isArray( models ),
				newModels = [],
				toAdd = [];

			models = singular ? ( models ? [ models ] : [] ) : _.clone( models );

			//console.debug( 'calling add on coll=%o; model=%o, options=%o', this, models, options );
			_.each( models, function( model ) {
				if ( !( model instanceof Backbone.Model ) ) {
					model = Backbone.Collection.prototype._prepareModel.call( this, model, options );
				}

				if ( model ) {
					toAdd.push( model );

					if ( !( this.get( model ) || this.get( model.cid ) ) ) {
						newModels.push( model );
					}
					// If we arrive in `add` while performing a `set` (after a create, so the model gains an `id`),
					// we may get here before `_onModelEvent` has had the chance to update `_byId`.
					else if ( model.id != null ) {
						this._byId[ model.id ] = model;
					}
				}
			}, this );

			// Add 'models' in a single batch, so the original add will only be called once (and thus 'sort', etc).
			// If `parse` was specified, the collection and contained models have been parsed now.
			toAdd = singular ? ( toAdd.length ? toAdd[ 0 ] : null ) : toAdd;
			var result = set.call( this, toAdd, _.defaults( { parse: false }, options ) );

			_.each( newModels, function( model ) {
				// Fire a `relational:add` event for any model in `newModels` that has actually been added to the collection.
				if ( this.get( model ) || this.get( model.cid ) ) {
					this.trigger( 'relational:add', model, this, options );
				}
			}, this );

			return result;
		};

		/**
		 * Override 'Backbone.Collection.remove' to trigger 'relational:remove'.
		 */
		var remove = Backbone.Collection.prototype.__remove = Backbone.Collection.prototype.remove;
		Backbone.Collection.prototype.remove = function( models, options ) {
			// Short-circuit if this Collection doesn't hold RelationalModels
			if ( !( this.model.prototype instanceof Backbone.RelationalModel ) ) {
				return remove.apply( this, arguments );
			}

			var singular = !_.isArray( models ),
				toRemove = [];

			models = singular ? ( models ? [ models ] : [] ) : _.clone( models );
			options || ( options = {} );

			//console.debug('calling remove on coll=%o; models=%o, options=%o', this, models, options );
			_.each( models, function( model ) {
				model = this.get( model ) || ( model && this.get( model.cid ) );
				model && toRemove.push( model );
			}, this );

			var result = remove.call( this, singular ? ( toRemove.length ? toRemove[ 0 ] : null ) : toRemove, options );

			_.each( toRemove, function( model ) {
				this.trigger( 'relational:remove', model, this, options );
			}, this );

			return result;
		};

		/**
		 * Override 'Backbone.Collection.reset' to trigger 'relational:reset'.
		 */
		var reset = Backbone.Collection.prototype.__reset = Backbone.Collection.prototype.reset;
		Backbone.Collection.prototype.reset = function( models, options ) {
			options = _.extend( { merge: true }, options );
			var result = reset.call( this, models, options );

			if ( this.model.prototype instanceof Backbone.RelationalModel ) {
				this.trigger( 'relational:reset', this, options );
			}

			return result;
		};

		/**
		 * Override 'Backbone.Collection.sort' to trigger 'relational:reset'.
		 */
		var sort = Backbone.Collection.prototype.__sort = Backbone.Collection.prototype.sort;
		Backbone.Collection.prototype.sort = function( options ) {
			var result = sort.call( this, options );

			if ( this.model.prototype instanceof Backbone.RelationalModel ) {
				this.trigger( 'relational:reset', this, options );
			}

			return result;
		};

		/**
		 * Override 'Backbone.Collection.trigger' so 'add', 'remove' and 'reset' events are queued until relations
		 * are ready.
		 */
		var trigger = Backbone.Collection.prototype.__trigger = Backbone.Collection.prototype.trigger;
		Backbone.Collection.prototype.trigger = function( eventName ) {
			// Short-circuit if this Collection doesn't hold RelationalModels
			if ( !( this.model.prototype instanceof Backbone.RelationalModel ) ) {
				return trigger.apply( this, arguments );
			}

			if ( eventName === 'add' || eventName === 'remove' || eventName === 'reset' || eventName === 'sort' ) {
				var dit = this,
					args = arguments;

				if ( _.isObject( args[ 3 ] ) ) {
					args = _.toArray( args );
					// the fourth argument is the option object.
					// we need to clone it, as it could be modified while we wait on the eventQueue to be unblocked
					args[ 3 ] = _.clone( args[ 3 ] );
				}

				Backbone.Relational.eventQueue.add( function() {
					trigger.apply( dit, args );
				});
			}
			else {
				trigger.apply( this, arguments );
			}

			return this;
		};

		// Override .extend() to automatically call .setup()
		Backbone.RelationalModel.extend = function( protoProps, classProps ) {
			var child = Backbone.Model.extend.apply( this, arguments );

			child.setup( this );

			return child;
		};
	}));


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	//
	//  Backbone-associations.js 0.5.5
	//
	//  (c) 2013 Dhruva Ray, Jaynti Kanani, Persistent Systems Ltd.
	//  Backbone-associations may be freely distributed under the MIT license.
	//  For all details and documentation:
	//  https://github.com/dhruvaray/backbone-associations/
	//

	// Initial Setup
	// --------------
	(function () {
	    "use strict";

	    // Save a reference to the global object (`window` in the browser, `exports`
	    // on the server).
	    var root = this;

	    // The top-level namespace. All public Backbone classes and modules will be attached to this.
	    // Exported for the browser and CommonJS.
	    var _, Backbone, BackboneModel, BackboneCollection, ModelProto,
	        CollectionProto, AssociatedModel, pathChecker,
	        delimiters, pathSeparator, source;

	    if (true) {
	        _ = __webpack_require__(2);
	        Backbone = __webpack_require__(1);
	        if (typeof module !== 'undefined' && module.exports) {
	            module.exports = Backbone;
	        }
	        exports = Backbone;
	    } else {
	        _ = root._;
	        Backbone = root.Backbone;
	    }
	    // Create local reference `Model` prototype.
	    BackboneModel = Backbone.Model;
	    BackboneCollection = Backbone.Collection;
	    ModelProto = BackboneModel.prototype;
	    CollectionProto = BackboneCollection.prototype;

	    Backbone.Associations = {
	        VERSION: "0.5.5"
	    };

	    // Define `getter` and `setter` for `separator`
	    var getSeparator = function() {
	        return pathSeparator;
	    };
	    // Define `setSeperator`
	    var setSeparator = function(value) {
	        if (!_.isString(value) || _.size(value) < 1) {
	            value = ".";
	        }
	        // set private properties
	        pathSeparator = value;
	        pathChecker = new RegExp("[\\" + pathSeparator + "\\[\\]]+", "g");
	        delimiters = new RegExp("[^\\" + pathSeparator + "\\[\\]]+", "g");
	    };

	    try {
	        // Define `SEPERATOR` property to Backbone.Associations
	        Object.defineProperty(Backbone.Associations, 'SEPARATOR', {
	            enumerable: true,
	            get: getSeparator,
	            set: setSeparator
	        });
	    } catch (e) {}

	    // Backbone.AssociatedModel
	    // --------------

	    //Add `Many` and `One` relations to Backbone Object.
	    Backbone.Associations.Many = Backbone.Many = "Many";
	    Backbone.Associations.One = Backbone.One = "One";
	    Backbone.Associations.Self = Backbone.Self = "Self";
	    // Set default separator
	    Backbone.Associations.SEPARATOR = ".";
	    Backbone.Associations.getSeparator = getSeparator;
	    Backbone.Associations.setSeparator = setSeparator;

	    Backbone.Associations.EVENTS_BUBBLE = true;
	    Backbone.Associations.EVENTS_WILDCARD = true;
	    Backbone.Associations.EVENTS_NC = true;


	    setSeparator();

	    // Define `AssociatedModel` (Extends Backbone.Model).
	    AssociatedModel = Backbone.AssociatedModel = Backbone.Associations.AssociatedModel = BackboneModel.extend({
	        // Define relations with Associated Model.
	        relations:undefined,
	        // Define `Model` property which can keep track of already fired `events`,
	        // and prevent redundant event to be triggered in case of cyclic model graphs.
	        _proxyCalls:undefined,


	        // Get the value of an attribute.
	        get:function (attr) {
	            var obj = ModelProto.get.call(this, attr);
	            return obj ? obj : this._getAttr.apply(this, arguments);
	        },

	        // Set a hash of model attributes on the Backbone Model.
	        set:function (key, value, options) {
	            var attributes, result;
	            // Duplicate backbone's behavior to allow separate key/value parameters,
	            // instead of a single 'attributes' object.
	            if (_.isObject(key) || key == null) {
	                attributes = key;
	                options = value;
	            } else {
	                attributes = {};
	                attributes[key] = value;
	            }
	            result = this._set(attributes, options);
	            // Trigger events which have been blocked until the entire object graph is updated.
	            this._processPendingEvents();
	            return result;

	        },

	        // Works with an attribute hash and options + fully qualified paths
	        _set:function (attributes, options) {
	            var attr, modelMap, modelId, obj, result = this;
	            if (!attributes) return this;
	            for (attr in attributes) {
	                //Create a map for each unique object whose attributes we want to set
	                modelMap || (modelMap = {});
	                if (attr.match(pathChecker)) {
	                    var pathTokens = getPathArray(attr), initials = _.initial(pathTokens),
	                        last = pathTokens[pathTokens.length - 1],
	                        parentModel = this.get(initials);
	                    if (parentModel instanceof AssociatedModel) {
	                        obj = modelMap[parentModel.cid] || (modelMap[parentModel.cid] = {'model':parentModel, 'data':{}});
	                        obj.data[last] = attributes[attr];
	                    }
	                } else {
	                    obj = modelMap[this.cid] || (modelMap[this.cid] = {'model':this, 'data':{}});
	                    obj.data[attr] = attributes[attr];
	                }
	            }

	            if (modelMap) {
	                for (modelId in modelMap) {
	                    obj = modelMap[modelId];
	                    this._setAttr.call(obj.model, obj.data, options) || (result = false);

	                }
	            } else {
	                result = this._setAttr.call(this, attributes, options);
	            }
	            return result;

	        },

	        // Set a hash of model attributes on the object,
	        // fire Backbone `event` with options.
	        // It maintains relations between models during the set operation.
	        // It also bubbles up child events to the parent.
	        _setAttr:function (attributes, options) {
	            var attr;
	            // Extract attributes and options.
	            options || (options = {});
	            if (options.unset) for (attr in attributes) attributes[attr] = void 0;
	            this.parents = this.parents || [];

	            if (this.relations) {
	                // Iterate over `this.relations` and `set` model and collection values
	                // if `relations` are available.
	                _.each(this.relations, function (relation) {
	                    var relationKey = relation.key,
	                        relatedModel = relation.relatedModel,
	                        collectionType = relation.collectionType,
	                        map = relation.map,
	                        currVal = this.attributes[relationKey],
	                        idKey = currVal && currVal.idAttribute,
	                        val, relationOptions, data, relationValue, newCtx = false;

	                    // Call function if relatedModel is implemented as a function
	                    if (relatedModel && !(relatedModel.prototype instanceof BackboneModel))
	                        relatedModel = _.isFunction(relatedModel) ?
	                            relatedModel.call(this, relation, attributes) :
	                            relatedModel;

	                    // Get class if relation and map is stored as a string.
	                    if (relatedModel && _.isString(relatedModel)) {
	                        relatedModel = (relatedModel === Backbone.Self) ? this.constructor : map2Scope(relatedModel);
	                    }
	                    collectionType && _.isString(collectionType) && (collectionType = map2Scope(collectionType));
	                    map && _.isString(map) && (map = map2Scope(map));
	                    // Merge in `options` specific to this relation.
	                    relationOptions = relation.options ? _.extend({}, relation.options, options) : options;

	                    if ((!relatedModel) && (!collectionType))
	                        throw new Error('specify either a relatedModel or collectionType');

	                    if (attributes[relationKey]) {
	                        // Get value of attribute with relation key in `val`.
	                        val = _.result(attributes, relationKey);
	                        // Map `val` if a transformation function is provided.
	                        val = map ? map.call(this, val, collectionType ? collectionType : relatedModel) : val;

	                        // If `relation.type` is `Backbone.Many`,
	                        // Create `Backbone.Collection` with passed data and perform Backbone `set`.
	                        if (relation.type === Backbone.Many) {
	                            // `collectionType` of defined `relation` should be instance of `Backbone.Collection`.
	                            if (collectionType && !collectionType.prototype instanceof BackboneCollection) {
	                                throw new Error('collectionType must inherit from Backbone.Collection');
	                            }

	                            if (currVal) {
	                                // Setting this flag will prevent events from firing immediately. That way clients
	                                // will not get events until the entire object graph is updated.
	                                currVal._deferEvents = true;

	                                // Use Backbone.Collection's `reset` or smart `set` method
	                                currVal[relationOptions.reset ? 'reset' : 'set'](
	                                    val instanceof BackboneCollection ? val.models : val, relationOptions);

	                                data = currVal;

	                            } else {
	                                newCtx = true;

	                                if (val instanceof BackboneCollection) {
	                                    data = val;
	                                } else {
	                                    data = collectionType ? new collectionType() : this._createCollection(relatedModel);
	                                    data[relationOptions.reset ? 'reset' : 'set'](val, relationOptions);
	                                }
	                            }

	                        } else if (relation.type === Backbone.One) {

	                            if (!relatedModel)
	                                throw new Error('specify a relatedModel for Backbone.One type');

	                            if (!(relatedModel.prototype instanceof Backbone.AssociatedModel))
	                                throw new Error('specify an AssociatedModel for Backbone.One type');

	                            data = val instanceof AssociatedModel ? val : new relatedModel(val, relationOptions);
	                            //Is the passed in data for the same key?
	                            if (currVal && data.attributes[idKey] &&
	                                currVal.attributes[idKey] === data.attributes[idKey]) {
	                                // Setting this flag will prevent events from firing immediately. That way clients
	                                // will not get events until the entire object graph is updated.
	                                currVal._deferEvents = true;
	                                // Perform the traditional `set` operation
	                                currVal._set(val instanceof AssociatedModel ? val.attributes : val, relationOptions);
	                                data = currVal;
	                            } else {
	                                newCtx = true;
	                            }

	                        } else {
	                            throw new Error('type attribute must be specified and have the values Backbone.One or Backbone.Many');
	                        }


	                        attributes[relationKey] = data;
	                        relationValue = data;

	                        // Add proxy events to respective parents.
	                        // Only add callback if not defined or new Ctx has been identified.
	                        if (newCtx || (relationValue && !relationValue._proxyCallback)) {
	                            relationValue._proxyCallback = function () {
	                                return Backbone.Associations.EVENTS_BUBBLE &&
	                                    this._bubbleEvent.call(this, relationKey, relationValue, arguments);
	                            };
	                            relationValue.on("all", relationValue._proxyCallback, this);
	                        }

	                    }
	                    //Distinguish between the value of undefined versus a set no-op
	                    if (attributes.hasOwnProperty(relationKey)) {
	                        //Maintain reverse pointers - a.k.a parents
	                        var updated = attributes[relationKey];
	                        var original = this.attributes[relationKey];
	                        if (updated) {
	                            updated.parents = updated.parents || [];
	                            (_.indexOf(updated.parents, this) == -1) && updated.parents.push(this);
	                        } else if (original && original.parents.length > 0) { // New value is undefined
	                            original.parents = _.difference(original.parents, [this]);
	                            // Don't bubble to this parent anymore
	                            original._proxyCallback && original.off("all", original._proxyCallback, this);
	                        }
	                    }
	                }, this);
	            }
	            // Return results for `BackboneModel.set`.
	            return  ModelProto.set.call(this, attributes, options);
	        },


	        // Bubble-up event to `parent` Model
	        _bubbleEvent:function (relationKey, relationValue, eventArguments) {
	            var args = eventArguments,
	                opt = args[0].split(":"),
	                eventType = opt[0],
	                catch_all = args[0] == "nested-change",
	                isChangeEvent = eventType === "change",
	                eventObject = args[1],
	                indexEventObject = -1,
	                _proxyCalls = relationValue._proxyCalls,
	                cargs,
	                eventPath = opt[1],
	                basecolEventPath;


	            // Short circuit the listen in to the nested-graph event
	            if (catch_all) return;

	            // Short circuit the listen in to the wild-card event
	            if (Backbone.Associations.EVENTS_WILDCARD) {
	                if (/\[\*\]/g.test(eventPath)) return this;
	            }

	            if (relationValue instanceof BackboneCollection && (isChangeEvent || eventPath)) {
	                // O(n) search :(
	                indexEventObject = relationValue.indexOf(source || eventObject);
	            }

	            if (this instanceof BackboneModel) {
	                // A quicker way to identify the model which caused an update inside the collection (while bubbling up)
	                source = this;
	            }
	            // Manipulate `eventPath`.
	            eventPath = relationKey + ((indexEventObject !== -1 && (isChangeEvent || eventPath)) ?
	                "[" + indexEventObject + "]" : "") + (eventPath ? pathSeparator + eventPath : "");

	            // Short circuit collection * events

	            if (Backbone.Associations.EVENTS_WILDCARD) {
	                basecolEventPath = eventPath.replace(/\[\d+\]/g, '[*]');
	            }

	            cargs = [];
	            cargs.push.apply(cargs, args);
	            cargs[0] = eventType + ":" + eventPath;

	            // Create a collection modified event with wild-card
	            if (Backbone.Associations.EVENTS_WILDCARD && eventPath !== basecolEventPath) {
	                cargs[0] = cargs[0] + " " + eventType + ":" + basecolEventPath;
	            }

	            // If event has been already triggered as result of same source `eventPath`,
	            // no need to re-trigger event to prevent cycle.
	            _proxyCalls = relationValue._proxyCalls = (_proxyCalls || {});
	            if (this._isEventAvailable.call(this, _proxyCalls, eventPath)) return this;

	            // Add `eventPath` in `_proxyCalls` to keep track of already triggered `event`.
	            _proxyCalls[eventPath] = true;


	            // Set up previous attributes correctly.
	            if (isChangeEvent) {
	                this._previousAttributes[relationKey] = relationValue._previousAttributes;
	                this.changed[relationKey] = relationValue;
	            }

	            // Bubble up event to parent `model` with new changed arguments.

	            this.trigger.apply(this, cargs);

	            //Only fire for change. Not change:attribute
	            if (Backbone.Associations.EVENTS_NC && isChangeEvent && this.get(eventPath) != args[2]) {
	                var ncargs = ["nested-change", eventPath, args[1]];
	                args[2] && ncargs.push(args[2]); //args[2] will be options if present
	                this.trigger.apply(this, ncargs);
	            }

	            // Remove `eventPath` from `_proxyCalls`,
	            // if `eventPath` and `_proxyCalls` are available,
	            // which allow event to be triggered on for next operation of `set`.
	            if (_proxyCalls && eventPath) delete _proxyCalls[eventPath];

	            source = undefined;

	            return this;
	        },

	        // Has event been fired from this source. Used to prevent event recursion in cyclic graphs
	        _isEventAvailable:function (_proxyCalls, path) {
	            return _.find(_proxyCalls, function (value, eventKey) {
	                return path.indexOf(eventKey, path.length - eventKey.length) !== -1;
	            });
	        },

	        // Returns New `collection` of type `relation.relatedModel`.
	        _createCollection:function (type) {
	            var collection, relatedModel = type;
	            _.isString(relatedModel) && (relatedModel = map2Scope(relatedModel));
	            // Creates new `Backbone.Collection` and defines model class.
	            if (relatedModel && (relatedModel.prototype instanceof AssociatedModel) || _.isFunction(relatedModel)) {
	                collection = new BackboneCollection();
	                collection.model = relatedModel;
	            } else {
	                throw new Error('type must inherit from Backbone.AssociatedModel');
	            }
	            return collection;
	        },

	        // Process all pending events after the entire object graph has been updated
	        _processPendingEvents:function () {
	            if (!this._processedEvents) {
	                this._processedEvents = true;

	                this._deferEvents = false;

	                // Trigger all pending events
	                _.each(this._pendingEvents, function (e) {
	                    e.c.trigger.apply(e.c, e.a);
	                });

	                this._pendingEvents = [];

	                // Traverse down the object graph and call process pending events on sub-trees
	                _.each(this.relations, function (relation) {
	                    var val = this.attributes[relation.key];
	                    val && val._processPendingEvents();
	                }, this);

	                delete this._processedEvents;
	            }
	        },

	        // Override trigger to defer events in the object graph.
	        trigger:function (name) {
	            // Defer event processing
	            if (this._deferEvents) {
	                this._pendingEvents = this._pendingEvents || [];
	                // Maintain a queue of pending events to trigger after the entire object graph is updated.
	                this._pendingEvents.push({c:this, a:arguments});
	            } else {
	                ModelProto.trigger.apply(this, arguments);
	            }
	        },

	        // The JSON representation of the model.
	        toJSON:function (options) {
	            var json = {}, aJson;
	            json[this.idAttribute] = this.id;
	            if (!this.visited) {
	                this.visited = true;
	                // Get json representation from `BackboneModel.toJSON`.
	                json = ModelProto.toJSON.apply(this, arguments);
	                // If `this.relations` is defined, iterate through each `relation`
	                // and added it's json representation to parents' json representation.
	                if (this.relations) {
	                    _.each(this.relations, function (relation) {
	                        var key = relation.key,
	                            remoteKey = relation.remoteKey,
	                            attr = this.attributes[key],
	                            serialize = !relation.isTransient;

	                        // Remove default Backbone serialization for associations.
	                        delete json[key];

	                        //Assign to remoteKey if specified. Otherwise use the default key.
	                        //Only for non-transient relationships
	                        if (serialize) {
	                            aJson = attr && attr.toJSON ? attr.toJSON(options) : attr;
	                            json[remoteKey || key] = _.isArray(aJson) ? _.compact(aJson) : aJson;
	                        }

	                    }, this);
	                }
	                delete this.visited;
	            }
	            return json;
	        },

	        // Create a new model with identical attributes to this one.
	        clone:function () {
	            return new this.constructor(this.toJSON());
	        },

	        // Call this if you want to set an `AssociatedModel` to a falsy value like undefined/null directly.
	        // Not calling this will leak memory and have wrong parents.
	        // See test case "parent relations"
	        cleanup:function () {
	            _.each(this.relations, function (relation) {
	                var val = this.attributes[relation.key];
	                val && (val.parents = _.difference(val.parents, [this]));
	            }, this);
	            this.off();
	        },

	        // Navigate the path to the leaf object in the path to query for the attribute value
	        _getAttr:function (path) {

	            var result = this,
	            //Tokenize the path
	                attrs = getPathArray(path),
	                key,
	                i;
	            if (_.size(attrs) < 1) return;
	            for (i = 0; i < attrs.length; i++) {
	                key = attrs[i];
	                if (!result) break;
	                //Navigate the path to get to the result
	                result = result instanceof BackboneCollection
	                    ? (isNaN(key) ? undefined : result.at(key))
	                    : result.attributes[key];
	            }
	            return result;
	        }
	    });

	    // Tokenize the fully qualified event path
	    var getPathArray = function (path) {
	        if (path === '') return [''];
	        return _.isString(path) ? (path.match(delimiters)) : path || [];
	    };

	    var map2Scope = function (path) {
	        return _.reduce(path.split(pathSeparator), function (memo, elem) {
	            return memo[elem];
	        }, root);
	    };

	    //Infer the relation from the collection's parents and find the appropriate map for the passed in `models`
	    var map2models = function (parents, target, models) {
	        var relation, surrogate;
	        //Iterate over collection's parents
	        _.find(parents, function (parent) {
	            //Iterate over relations
	            relation = _.find(parent.relations, function (rel) {
	                return parent.get(rel.key) === target;
	            }, this);
	            if (relation) {
	                surrogate = parent;//surrogate for transformation
	                return true;//break;
	            }
	        }, this);

	        //If we found a relation and it has a mapping function
	        if (relation && relation.map) {
	            return relation.map.call(surrogate, models, target);
	        }
	        return models;
	    };

	    var proxies = {};
	    // Proxy Backbone collection methods
	    _.each(['set', 'remove', 'reset'], function (method) {
	        proxies[method] = BackboneCollection.prototype[method];

	        CollectionProto[method] = function (models, options) {
	            //Short-circuit if this collection doesn't hold `AssociatedModels`
	            if (this.model.prototype instanceof AssociatedModel && this.parents) {
	                //Find a map function if available and perform a transformation
	                arguments[0] = map2models(this.parents, this, models);
	            }
	            return proxies[method].apply(this, arguments);
	        }
	    });

	    // Override trigger to defer events in the object graph.
	    proxies['trigger'] = CollectionProto['trigger'];
	    CollectionProto['trigger'] = function (name) {
	        if (this._deferEvents) {
	            this._pendingEvents = this._pendingEvents || [];
	            // Maintain a queue of pending events to trigger after the entire object graph is updated.
	            this._pendingEvents.push({c:this, a:arguments});
	        } else {
	            proxies['trigger'].apply(this, arguments);
	        }
	    };

	    // Attach process pending event functionality on collections as well. Re-use from `AssociatedModel`
	    CollectionProto._processPendingEvents = AssociatedModel.prototype._processPendingEvents;


	}).call(this);


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var aug = __webpack_require__(28);
	var Events = __webpack_require__(27);

	var Model = function(name) {
	  this.modelName = name;
	};

	Model.prototype = new Events();

	Model.prototype.get = function(key) {
	  return this._data[key];
	};

	Model.prototype.guid = function() {
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	  }).toUpperCase();      
	};

	Model.prototype.set = function(key, value) {
	  if (typeof key !== 'object') {
	    this.emit('change:'+key, this._data[key], value);
	    this.emit('change', key, this._data[key], value);
	    this._data[key] = value;
	  } else {
	    for (var k in key) {
	      this.set(k, key[k]);
	    }
	  }
	};

	Model.prototype.toJSON = function() {
	  return this._data;
	};

	Model.create = function(name, obj) {
	  var Model = function(params) {
	    this.model = Model;
	    this._data = aug(true, {}, this.schema, params);
	    if (!this._data._id)
	      this._data._id = this.guid();
	    if (this.init) {
	      this.init();
	    }
	  };
	  Model.prototype = new this(name);
	  aug(Model.prototype, obj.methods);
	  aug(Model, obj.statics);
	  Model.applyMixin = function(mixin) {
	    aug(this.prototype, mixin.methods);
	    aug(Model, mixin.statics);
	  };
	  return Model;
	};

	module.exports = Model;

	//test
	/*
	var Person = Model.create('Person', {
	  schema: {
	    firstName: '',
	    lastName: '',
	    age: 30
	  },
	  getFullName: function() {
	    return this.get('firstName') + ' ' + this.get('lastName');
	  }
	});
	Person.applyMixin({ testMethod: function() {} });
	var p = new Person();
	console.log(p.testMethod);
	var p = new Person({ firstName: 'Bob', lastName: 'Smith' });
	var p2 = new Person({ firstName: 'Jane', lastName: 'Jones' });
	var p3 = new Person();
	console.log(p.getFullName());
	console.log(p);
	console.log(p2.getFullName());
	console.log(p2);
	console.log(p3);
	*/


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var aug = __webpack_require__(28);

	var Collection = function(name) {
	  this.name = name;
	};

	Collection.prototype.forEach = function(callback) {
	  var i = 0;
	  for (var key in this.items) {
	    callback(this.items[key], i++);
	  }
	};

	Collection.prototype.all = function() {
	  var items = [];
	  this.forEach(function(item) {
	    items.push(item);
	  });
	  return items;
	};

	Collection.prototype.get = function(id) {
	  return this.items[id];
	};


	Collection.prototype.filter = function(f) {
	  var items = [];
	  this.forEach(function(item, i) {
	    if (f(item))
	      items.push(item);
	  });
	  return items;
	};

	Collection.prototype.toJSON = function() {
	  var json = {};
	  for (var id in this.items) {
	    json[id] = this.items[id].toJSON();
	  }
	  return json;
	};

	Collection.prototype.add = function(item) {
	  this.items[item.get('_id')] = item;
	};

	Collection.prototype.remove = function(item) {
	  if (typeof item  !== 'string') {
	    item = item.get('_id');
	  }
	  delete this.items[item];
	};

	Collection.create = function(name, obj) {
	  var Collection = function(items) {
	    this.collection = Collection;
	    this.items = items || {};
	    this.model = obj.model;
	    if (this.init) {
	      this.init();
	    }
	  };
	  Collection.prototype = new this(name);
	  aug(Collection.prototype, obj.methods);
	  aug(Collection, obj.statics);
	  Collection.applyMixin = function(mixin) {
	    aug(this.prototype, mixin.methods);
	    aug(Collection, mixin.statics);
	  };
	  return Collection;
	};


	module.exports = Collection;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var Events = function() {
	  this.cache = {}; 
	};
	Events.prototype.emit = function() {
	  var args = Array.prototype.slice.call(arguments);
	  var topic = args.shift();
	  var subs = this.cache[topic], len = subs ? subs.length : 0;

	  while(len--){
	    subs[len].apply(this, args || []);
	  }
	};
	Events.prototype.on = function(topic, callback) {
	  if(!this.cache[topic]){
	    this.cache[topic] = [];
	  }
	  this.cache[topic].push(callback);
	  return [topic, callback]; // Array
	};
	Events.prototype.off = function(handle) {
	  var subs = this.cache[handle[0]],
	  callback = handle[1],
	  len = subs ? subs.length : 0;

	  while(len--){
	    if(subs[len] === callback){
	      subs.splice(len, 1);
	    }
	  }
	};
	module.exports = Events;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	(function(root) {

	var aug = function __aug() {
	  var args = Array.prototype.slice.call(arguments);
	  var deep = false;
	  var org = args.shift();
	  var type = '';
	  if (typeof org === 'string' || typeof org === 'boolean') {
	    type = (org === true)?'deep':org;
	    org = args.shift();
	    if (type == 'defaults') {
	      org = aug({}, org); //clone defaults into new object
	      type = 'strict';
	    }
	  }
	  for (var i = 0, c = args.length; i < c; i++) {
	    var prop = args[i];
	    for (var name in prop) {
	      if (type == 'deep' && typeof prop[name] === 'object' && typeof org[name] !== 'undefined') {
	        aug(type, org[name], prop[name]);
	      } else if (type != 'strict' || (type == 'strict' && typeof org[name] !== 'undefined')) {
	        org[name] = prop[name];
	      }
	    }
	  }
	  return org;
	};

	if (true) {
	  module.exports = aug;
	} else {
	  if (typeof define === 'function' && define.amd) {
	    define(function() {return aug;});
	  }
	  root.aug = aug;
	}

	}(this));


/***/ }
/******/ ])
})
=======
/*
  knockback-core.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
(function() {
  var globals = {requires: []};
if (typeof window !== "undefined" && !!window.require) globals.requires.push(window.require);
if (typeof require !== "undefined" && !!require) globals.requires.push(require);

/* local-only brunch-like require (based on https://github.com/brunch/commonjs-require-definition) */
(function() {
  'use strict';

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    var _require = function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
    _require.register = globals.require.register;
    _require.shim = globals.require.shim;
    return _require;
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var toString = Object.prototype.toString;
  var isArray = function(obj) { return toString.call(obj) === '[object Array]'; }

  // client shimming to add to local module system
  var shim = function(info) {
    if (typeof window === "undefined") return;
    if (!isArray(info)) info = [info];

    var iterator = function(item) {
      var dep;

      // already registered with local require
      try { if (globals.require(item.path)) { return; } } catch (e) {}

      // use external require
      try { for (var ext_i = 0, ext_length = globals.requires.length; ext_i < ext_length; ext_i++) {if (dep = globals.requires[ext_i](item.path)) break;}} catch (e) {}

      // use symbol path on window
      if (!dep && item.symbol) {
        var components = item.symbol.split('.');
        dep = window;
        for (var i = 0, length = components.length; i < length; i++) { if (!(dep = dep[components[i]])) break; }
      }

      // not found
      if (!dep) {
        if (item.optional) return;
        throw new Error("Missing dependency: " + item.path);
      }

      // register with local require
      globals.require.register(item.path, (function(exports, require, module) { return module.exports = dep; }));
      if (item.alias) { globals.require.register(item.alias, (function(exports, require, module) { return module.exports = dep; })); }
    };

    for (var i = 0, length = info.length; i < length; i++) { iterator(info[i]); }
  };

  globals.require = require;
  globals.require.register = define;
  globals.require.shim = shim;
}).call(this);
var require = globals.require;
require.register('collection-observable', function(exports, require, module) {

/*
  knockback.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
 */
var COMPARE_ASCENDING, COMPARE_DESCENDING, COMPARE_EQUAL, kb, ko, _,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

kb = require('./kb');

_ = require('underscore');

ko = require('knockout');

COMPARE_EQUAL = 0;

COMPARE_ASCENDING = -1;

COMPARE_DESCENDING = 1;

kb.compare = function(value_a, value_b) {
  if (_.isString(value_a)) {
    return value_a.localeCompare("" + value_b);
  }
  if (_.isString(value_b)) {
    return value_b.localeCompare("" + value_a);
  }
  if (value_a === value_b) {
    return COMPARE_EQUAL;
  } else {
    if (value_a < value_b) {
      return COMPARE_ASCENDING;
    } else {
      return COMPARE_DESCENDING;
    }
  }
};

kb.CollectionObservable = (function() {
  CollectionObservable.extend = kb.extend;

  function CollectionObservable(collection, options) {
    return kb.ignore((function(_this) {
      return function() {
        var create_options, observable, _ref;
        if (_.isUndefined(options) && !(collection instanceof kb.Collection)) {
          _ref = [new kb.Collection(), collection], collection = _ref[0], options = _ref[1];
        } else if (_.isArray(collection)) {
          collection = new kb.Collection(collection);
        }
        options || (options = {});
        observable = kb.utils.wrappedObservable(_this, ko.observableArray([]));
        observable.__kb_is_co = true;
        _this.in_edit = 0;
        _this.__kb || (_this.__kb = {});
        _this.__kb._onCollectionChange = _.bind(_this._onCollectionChange, _this);
        options = kb.utils.collapseOptions(options);
        if (options.auto_compact) {
          _this.auto_compact = true;
        }
        if (options.sort_attribute) {
          _this._comparator = ko.observable(_this._attributeComparator(options.sort_attribute));
        } else {
          _this._comparator = ko.observable(options.comparator);
        }
        if (options.filters) {
          _this._filters = ko.observableArray(_.isArray(options.filters) ? options.filters : options.filters ? [options.filters] : void 0);
        } else {
          _this._filters = ko.observableArray([]);
        }
        create_options = _this.create_options = {
          store: kb.Store.useOptionsOrCreate(options, collection, observable)
        };
        _this.path = options.path;
        create_options.factory = kb.utils.wrappedFactory(observable, _this._shareOrCreateFactory(options));
        create_options.path = kb.utils.pathJoin(options.path, 'models');
        create_options.creator = create_options.factory.creatorForPath(null, create_options.path);
        if (create_options.creator) {
          _this.models_only = create_options.creator.models_only;
        }
        kb.publishMethods(observable, _this, ['destroy', 'shareOptions', 'filters', 'comparator', 'sortAttribute', 'viewModelByModel', 'hasViewModels']);
        _this._collection = ko.observable(collection);
        observable.collection = _this.collection = ko.dependentObservable({
          read: function() {
            return _this._collection();
          },
          write: function(new_collection) {
            return kb.ignore(function() {
              var previous_collection;
              if ((previous_collection = _this._collection()) === new_collection) {
                return;
              }
              if (previous_collection) {
                previous_collection.unbind('all', _this.__kb._onCollectionChange);
              }
              if (new_collection) {
                new_collection.bind('all', _this.__kb._onCollectionChange);
              }
              return _this._collection(new_collection);
            });
          }
        });
        if (collection) {
          collection.bind('all', _this.__kb._onCollectionChange);
        }
        _this._mapper = ko.dependentObservable(function() {
          var comparator, current_collection, filter, filters, models, view_models, _i, _len;
          comparator = _this._comparator();
          filters = _this._filters();
          if (filters) {
            for (_i = 0, _len = filters.length; _i < _len; _i++) {
              filter = filters[_i];
              ko.utils.unwrapObservable(filter);
            }
          }
          current_collection = _this._collection();
          if (_this.in_edit) {
            return;
          }
          observable = kb.utils.wrappedObservable(_this);
          if (current_collection) {
            models = current_collection.models;
          }
          if (!models || (current_collection.models.length === 0)) {
            view_models = [];
          } else {
            models = _.filter(models, function(model) {
              return !filters.length || _this._selectModel(model);
            });
            if (comparator) {
              view_models = _.map(models, function(model) {
                return _this._createViewModel(model);
              }).sort(comparator);
            } else {
              if (_this.models_only) {
                view_models = filters.length ? models : models.slice();
              } else {
                view_models = _.map(models, function(model) {
                  return _this._createViewModel(model);
                });
              }
            }
          }
          _this.in_edit++;
          observable(view_models);
          return _this.in_edit--;
        });
        observable.subscribe(_.bind(_this._onObservableArrayChange, _this));
        !kb.statistics || kb.statistics.register('CollectionObservable', _this);
        return observable;
      };
    })(this));
  }

  CollectionObservable.prototype.destroy = function() {
    var array, collection, observable;
    observable = kb.utils.wrappedObservable(this);
    collection = this._collection();
    if (collection) {
      collection.unbind('all', this.__kb._onCollectionChange);
      array = observable();
      array.splice(0, array.length);
    }
    this.collection.dispose();
    this._collection = observable.collection = this.collection = null;
    this._mapper.dispose();
    this._mapper = null;
    kb.release(this._filters);
    this._filters = null;
    this._comparator(null);
    this._comparator = null;
    this.create_options = null;
    observable.collection = null;
    kb.utils.wrappedDestroy(this);
    return !kb.statistics || kb.statistics.unregister('CollectionObservable', this);
  };

  CollectionObservable.prototype.shareOptions = function() {
    var observable;
    observable = kb.utils.wrappedObservable(this);
    return {
      store: kb.utils.wrappedStore(observable),
      factory: kb.utils.wrappedFactory(observable)
    };
  };

  CollectionObservable.prototype.filters = function(filters) {
    if (filters) {
      return this._filters(_.isArray(filters) ? filters : [filters]);
    } else {
      return this._filters([]);
    }
  };

  CollectionObservable.prototype.comparator = function(comparator) {
    return this._comparator(comparator);
  };

  CollectionObservable.prototype.sortAttribute = function(sort_attribute) {
    return this._comparator(sort_attribute ? this._attributeComparator(sort_attribute) : null);
  };

  CollectionObservable.prototype.viewModelByModel = function(model) {
    var id_attribute;
    if (this.models_only) {
      return null;
    }
    id_attribute = model.hasOwnProperty(model.idAttribute) ? model.idAttribute : 'cid';
    return _.find(kb.peek(kb.utils.wrappedObservable(this)), function(test) {
      var _ref;
      if (test != null ? (_ref = test.__kb) != null ? _ref.object : void 0 : void 0) {
        return test.__kb.object[id_attribute] === model[id_attribute];
      } else {
        return false;
      }
    });
  };

  CollectionObservable.prototype.hasViewModels = function() {
    return !this.models_only;
  };

  CollectionObservable.prototype.compact = function() {
    return kb.ignore((function(_this) {
      return function() {
        var observable;
        observable = kb.utils.wrappedObservable(_this);
        if (!kb.utils.wrappedStoreIsOwned(observable)) {
          return;
        }
        kb.utils.wrappedStore(observable).clear();
        return _this._collection.notifySubscribers(_this._collection());
      };
    })(this));
  };

  CollectionObservable.prototype._shareOrCreateFactory = function(options) {
    var absolute_models_path, existing_creator, factories, factory;
    absolute_models_path = kb.utils.pathJoin(options.path, 'models');
    factories = options.factories;
    if ((factory = options.factory)) {
      if ((existing_creator = factory.creatorForPath(null, absolute_models_path)) && (!factories || (factories['models'] === existing_creator))) {
        if (!factories) {
          return factory;
        }
        if (factory.hasPathMappings(factories, options.path)) {
          return factory;
        }
      }
    }
    factory = new kb.Factory(options.factory);
    if (factories) {
      factory.addPathMappings(factories, options.path);
    }
    if (!factory.creatorForPath(null, absolute_models_path)) {
      if (options.hasOwnProperty('models_only')) {
        if (options.models_only) {
          factory.addPathMapping(absolute_models_path, {
            models_only: true
          });
        } else {
          factory.addPathMapping(absolute_models_path, kb.ViewModel);
        }
      } else if (options.view_model) {
        factory.addPathMapping(absolute_models_path, options.view_model);
      } else if (options.create) {
        factory.addPathMapping(absolute_models_path, {
          create: options.create
        });
      } else {
        factory.addPathMapping(absolute_models_path, kb.ViewModel);
      }
    }
    return factory;
  };

  CollectionObservable.prototype._onCollectionChange = function(event, arg) {
    return kb.ignore((function(_this) {
      return function() {
        var collection, comparator, observable, view_model;
        if (_this.in_edit) {
          return;
        }
        switch (event) {
          case 'reset':
            if (_this.auto_compact) {
              _this.compact();
            } else {
              _this._collection.notifySubscribers(_this._collection());
            }
            break;
          case 'sort':
          case 'resort':
            _this._collection.notifySubscribers(_this._collection());
            break;
          case 'new':
          case 'add':
            if (!_this._selectModel(arg)) {
              return;
            }
            observable = kb.utils.wrappedObservable(_this);
            collection = _this._collection();
            if (collection.indexOf(arg) === -1) {
              return;
            }
            if ((view_model = _this.viewModelByModel(arg))) {
              return;
            }
            _this.in_edit++;
            view_model = _this._createViewModel(arg);
            if ((comparator = _this._comparator())) {
              observable().push(view_model);
              observable.sort(comparator);
            } else {
              observable.splice(collection.indexOf(arg), 0, view_model);
            }
            _this.in_edit--;
            break;
          case 'remove':
          case 'destroy':
            _this._onModelRemove(arg);
            break;
          case 'change':
            if (!_this._selectModel(arg)) {
              _this._onModelRemove(arg);
            } else {
              view_model = _this.models_only ? arg : _this.viewModelByModel(arg);
              if (view_model) {
                if ((comparator = _this._comparator())) {
                  observable = kb.utils.wrappedObservable(_this);
                  _this.in_edit++;
                  observable.sort(comparator);
                  _this.in_edit--;
                }
              } else {
                _this._onCollectionChange('add', arg);
              }
            }
        }
      };
    })(this));
  };

  CollectionObservable.prototype._onModelRemove = function(model) {
    var observable, view_model;
    view_model = this.models_only ? model : this.viewModelByModel(model);
    if (!view_model) {
      return;
    }
    observable = kb.utils.wrappedObservable(this);
    this.in_edit++;
    observable.remove(view_model);
    return this.in_edit--;
  };

  CollectionObservable.prototype._onObservableArrayChange = function(models_or_view_models) {
    return kb.ignore((function(_this) {
      return function() {
        var collection, has_filters, model, models, observable, view_model, view_models, _i, _len;
        if (_this.in_edit) {
          return;
        }
        (_this.models_only && (!models_or_view_models.length || kb.utils.hasModelSignature(models_or_view_models[0]))) || (!_this.models_only && (!models_or_view_models.length || (_.isObject(models_or_view_models[0]) && !kb.utils.hasModelSignature(models_or_view_models[0])))) || kb._throwUnexpected(_this, 'incorrect type passed');
        observable = kb.utils.wrappedObservable(_this);
        collection = kb.peek(_this._collection);
        has_filters = kb.peek(_this._filters).length;
        if (!collection) {
          return;
        }
        view_models = models_or_view_models;
        if (_this.models_only) {
          models = _.filter(models_or_view_models, function(model) {
            return !has_filters || _this._selectModel(model);
          });
        } else {
          !has_filters || (view_models = []);
          models = [];
          for (_i = 0, _len = models_or_view_models.length; _i < _len; _i++) {
            view_model = models_or_view_models[_i];
            model = kb.utils.wrappedObject(view_model);
            if (has_filters) {
              if (!_this._selectModel(model)) {
                continue;
              }
              view_models.push(view_model);
            }
            _this.create_options.store.findOrReplace(model, _this.create_options.creator, view_model);
            models.push(model);
          }
        }
        _this.in_edit++;
        (models_or_view_models.length === view_models.length) || observable(view_models);
        _.isEqual(collection.models, models) || collection.reset(models);
        _this.in_edit--;
      };
    })(this));
  };

  CollectionObservable.prototype._attributeComparator = function(sort_attribute) {
    var modelAttributeCompare;
    modelAttributeCompare = function(model_a, model_b) {
      var attribute_name;
      attribute_name = ko.utils.unwrapObservable(sort_attribute);
      return kb.compare(model_a.get(attribute_name), model_b.get(attribute_name));
    };
    return (this.models_only ? modelAttributeCompare : function(model_a, model_b) {
      return modelAttributeCompare(kb.utils.wrappedModel(model_a), kb.utils.wrappedModel(model_b));
    });
  };

  CollectionObservable.prototype._createViewModel = function(model) {
    if (this.models_only) {
      return model;
    }
    return this.create_options.store.findOrCreate(model, this.create_options);
  };

  CollectionObservable.prototype._selectModel = function(model) {
    var filter, filters, _i, _len, _ref;
    filters = kb.peek(this._filters);
    for (_i = 0, _len = filters.length; _i < _len; _i++) {
      filter = filters[_i];
      filter = kb.peek(filter);
      if (_.isFunction(filter)) {
        if (!filter(model)) {
          return false;
        }
      } else if (_.isArray(filter)) {
        if (_ref = model.id, __indexOf.call(filter, _ref) < 0) {
          return false;
        }
      } else {
        if (model.id !== filter) {
          return false;
        }
      }
    }
    return true;
  };

  return CollectionObservable;

})();

kb.collectionObservable = function(collection, options) {
  return new kb.CollectionObservable(collection, options);
};

});
require.register('event-watcher', function(exports, require, module) {

/*
  knockback.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
 */
var kb, ko, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

kb = require('./kb');

_ = require('underscore');

ko = require('knockout');

kb.EventWatcher = (function() {
  EventWatcher.useOptionsOrCreate = function(options, emitter, obj, callback_options) {
    if (options.event_watcher) {
      if (!(options.event_watcher.emitter() === emitter || (options.event_watcher.model_ref === emitter))) {
        kb._throwUnexpected(this, 'emitter not matching');
      }
      return kb.utils.wrappedEventWatcher(obj, options.event_watcher).registerCallbacks(obj, callback_options);
    } else {
      kb.utils.wrappedEventWatcherIsOwned(obj, true);
      return kb.utils.wrappedEventWatcher(obj, new kb.EventWatcher(emitter)).registerCallbacks(obj, callback_options);
    }
  };

  function EventWatcher(emitter, obj, callback_options) {
    this._onModelUnloaded = __bind(this._onModelUnloaded, this);
    this._onModelLoaded = __bind(this._onModelLoaded, this);
    this.__kb || (this.__kb = {});
    this.__kb.callbacks = {};
    this.__kb._onModelLoaded = _.bind(this._onModelLoaded, this);
    this.__kb._onModelUnloaded = _.bind(this._onModelUnloaded, this);
    if (callback_options) {
      this.registerCallbacks(obj, callback_options);
    }
    if (emitter) {
      this.emitter(emitter);
    } else {
      this.ee = null;
    }
  }

  EventWatcher.prototype.destroy = function() {
    this.emitter(null);
    this.__kb.callbacks = null;
    return kb.utils.wrappedDestroy(this);
  };

  EventWatcher.prototype.emitter = function(new_emitter) {
    var callbacks, event_name, info, list, previous_emitter, _i, _len, _ref;
    if ((arguments.length === 0) || (this.ee === new_emitter)) {
      return this.ee;
    }
    if (this.model_ref) {
      this.model_ref.unbind('loaded', this.__kb._onModelLoaded);
      this.model_ref.unbind('unloaded', this.__kb._onModelUnloaded);
      this.model_ref.release();
      this.model_ref = null;
    }
    if (kb.Backbone && kb.Backbone.ModelRef && (new_emitter instanceof kb.Backbone.ModelRef)) {
      this.model_ref = new_emitter;
      this.model_ref.retain();
      this.model_ref.bind('loaded', this.__kb._onModelLoaded);
      this.model_ref.bind('unloaded', this.__kb._onModelUnloaded);
      new_emitter = this.model_ref.model();
    } else {
      delete this.model_ref;
    }
    previous_emitter = this.ee;
    this.ee = new_emitter;
    _ref = this.__kb.callbacks;
    for (event_name in _ref) {
      callbacks = _ref[event_name];
      if (previous_emitter) {
        previous_emitter.unbind(event_name, callbacks.fn);
      }
      if (new_emitter) {
        this.ee.bind(event_name, callbacks.fn);
      }
      list = callbacks.list;
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        info = list[_i];
        if (info.emitter) {
          info.emitter(this.ee);
        }
      }
    }
    return new_emitter;
  };

  EventWatcher.prototype.registerCallbacks = function(obj, callback_info) {
    var callbacks, event_name, event_names, event_selector, info, list, _i, _len;
    obj || kb._throwMissing(this, 'obj');
    callback_info || kb._throwMissing(this, 'info');
    event_selector = callback_info.event_selector ? callback_info.event_selector : 'change';
    event_names = event_selector.split(' ');
    for (_i = 0, _len = event_names.length; _i < _len; _i++) {
      event_name = event_names[_i];
      if (!event_name) {
        continue;
      }
      callbacks = this.__kb.callbacks[event_name];
      if (!callbacks) {
        list = [];
        callbacks = {
          list: list,
          fn: (function(_this) {
            return function(model) {
              var info, _j, _len1;
              for (_j = 0, _len1 = list.length; _j < _len1; _j++) {
                info = list[_j];
                if (info.update && !info.rel_fn) {
                  if (model && info.key && (model.hasChanged && !model.hasChanged(ko.utils.unwrapObservable(info.key)))) {
                    continue;
                  }
                  !kb.statistics || kb.statistics.addModelEvent({
                    name: event_name,
                    model: model,
                    key: info.key,
                    path: info.path
                  });
                  info.update();
                }
              }
              return null;
            };
          })(this)
        };
        this.__kb.callbacks[event_name] = callbacks;
        if (this.ee) {
          this.ee.bind(event_name, callbacks.fn);
        }
      }
      info = _.defaults({
        obj: obj
      }, callback_info);
      callbacks.list.push(info);
    }
    if (this.ee) {
      if (__indexOf.call(event_names, 'change') >= 0) {
        info.unbind_fn = kb.orm.bind(this.ee, info.key, info.update, info.path);
      }
      info.emitter(this.ee) && info.emitter;
    }
  };

  EventWatcher.prototype.releaseCallbacks = function(obj) {
    var callbacks, event_name, index, info, _ref, _ref1;
    if (!this.__kb.callbacks || !this.ee) {
      return;
    }
    _ref = this.__kb.callbacks;
    for (event_name in _ref) {
      callbacks = _ref[event_name];
      _ref1 = callbacks.list;
      for (index in _ref1) {
        info = _ref1[index];
        if (info.obj !== obj) {
          continue;
        }
        callbacks.list.splice(index, 1);
        if (info.unbind_fn) {
          info.unbind_fn();
          info.unbind_fn = null;
        }
        if (!kb.wasReleased(obj) && info.emitter) {
          info.emitter(null);
        }
        return;
      }
    }
  };

  EventWatcher.prototype._onModelLoaded = function(model) {
    var callbacks, event_name, info, _i, _len, _ref, _ref1;
    this.ee = model;
    _ref = this.__kb.callbacks;
    for (event_name in _ref) {
      callbacks = _ref[event_name];
      model.bind(event_name, callbacks.fn);
      _ref1 = callbacks.list;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        info = _ref1[_i];
        info.unbind_fn = kb.orm.bind(model, info.key, info.update, info.path);
        if (info.emitter) {
          info.emitter(model);
        }
      }
    }
  };

  EventWatcher.prototype._onModelUnloaded = function(model) {
    var callbacks, event_name, info, list, _i, _len, _ref;
    this.ee = null;
    _ref = this.__kb.callbacks;
    for (event_name in _ref) {
      callbacks = _ref[event_name];
      model.unbind(event_name, callbacks.fn);
      list = callbacks.list;
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        info = list[_i];
        if (info.unbind_fn) {
          info.unbind_fn();
          info.unbind_fn = null;
        }
        if (info.emitter) {
          info.emitter(null);
        }
      }
    }
  };

  return EventWatcher;

})();

kb.emitterObservable = function(emitter, observable) {
  return new kb.EventWatcher(emitter, observable);
};

});
require.register('factory', function(exports, require, module) {

/*
  knockback.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
 */
var kb, _;

kb = require('./kb');

_ = require('underscore');

kb.Factory = (function() {
  Factory.useOptionsOrCreate = function(options, obj, owner_path) {
    var factory;
    if (options.factory && (!options.factories || (options.factories && options.factory.hasPathMappings(options.factories, owner_path)))) {
      return kb.utils.wrappedFactory(obj, options.factory);
    }
    factory = kb.utils.wrappedFactory(obj, new kb.Factory(options.factory));
    if (options.factories) {
      factory.addPathMappings(options.factories, owner_path);
    }
    return factory;
  };

  function Factory(parent_factory) {
    this.parent_factory = parent_factory;
    this.paths = {};
  }

  Factory.prototype.hasPath = function(path) {
    return this.paths.hasOwnProperty(path) || (this.parent_factory && this.parent_factory.hasPath(path));
  };

  Factory.prototype.addPathMapping = function(path, create_info) {
    return this.paths[path] = create_info;
  };

  Factory.prototype.addPathMappings = function(factories, owner_path) {
    var create_info, path;
    for (path in factories) {
      create_info = factories[path];
      this.paths[kb.utils.pathJoin(owner_path, path)] = create_info;
    }
  };

  Factory.prototype.hasPathMappings = function(factories, owner_path) {
    var all_exist, creator, existing_creator, path;
    all_exist = true;
    for (path in factories) {
      creator = factories[path];
      all_exist &= (existing_creator = this.creatorForPath(null, kb.utils.pathJoin(owner_path, path))) && (creator === existing_creator);
    }
    return all_exist;
  };

  Factory.prototype.creatorForPath = function(obj, path) {
    var creator;
    if ((creator = this.paths[path])) {
      if (creator.view_model) {
        return creator.view_model;
      } else {
        return creator;
      }
    }
    if (this.parent_factory) {
      if ((creator = this.parent_factory.creatorForPath(obj, path))) {
        return creator;
      }
    }
    return null;
  };

  return Factory;

})();

});
require.register('index', function(exports, require, module) {

/*
  knockback.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
 */
var Backbone, component, err, kb, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;

if (this.Parse) {
  this.Backbone = this.Parse;
  this._ = this.Parse._;
}

if ((typeof window !== "undefined" && window !== null) && require.shim) {
  require.shim([
    {
      symbol: '_',
      path: 'lodash',
      alias: 'underscore',
      optional: true
    }, {
      symbol: '_',
      path: 'underscore'
    }, {
      symbol: 'Backbone',
      path: 'backbone'
    }, {
      symbol: 'ko',
      path: 'knockout'
    }
  ]);
}

module.exports = kb = require('./kb');

if (this.Parse) {
  Backbone = kb.Parse = this.Parse;
} else {
  Backbone = kb.Backbone = require('backbone');
}

kb.Collection = Backbone.Collection;

kb.Model = Backbone.Object || Backbone.Model;

kb.Events = Backbone.Events;

kb._ = require('underscore');

kb.ko = require('knockout');

_ref = ['./utils', './event-watcher', './store', './factory', './observable', './view-model', './collection-observable', './orm', './inject'];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  component = _ref[_i];
  require(component);
}

_ref1 = ['./default-observable', './formatted-observable', './localized-observable', './statistics', './triggered-observable', './validation'];
for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
  component = _ref1[_j];
  try {
    require(component);
  } catch (_error) {
    err = _error;
    ({});
  }
}

kb.modules = {};

_ref2 = ['underscore', 'backbone', 'knockout'];
for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
  component = _ref2[_k];
  kb.modules[component] = require(component);
}

});
require.register('inject', function(exports, require, module) {

/*
  knockback.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
 */
var kb, ko, onReady, _, _ko_applyBindings;

kb = require('./kb');

_ = require('underscore');

ko = require('knockout');

kb.RECUSIVE_AUTO_INJECT = true;

ko.bindingHandlers['inject'] = {
  'init': function(element, value_accessor, all_bindings_accessor, view_model) {
    return kb.Inject.inject(ko.utils.unwrapObservable(value_accessor()), view_model, element, value_accessor, all_bindings_accessor);
  }
};

kb.Inject = (function() {
  function Inject() {}

  Inject.inject = function(data, view_model, element, value_accessor, all_bindings_accessor, nested) {
    var inject, result, wrapper;
    inject = function(data) {
      var key, target, value;
      if (_.isFunction(data)) {
        view_model = new data(view_model, element, value_accessor, all_bindings_accessor);
        kb.releaseOnNodeRemove(view_model, element);
      } else {
        if (data.view_model) {
          view_model = new data.view_model(view_model, element, value_accessor, all_bindings_accessor);
          kb.releaseOnNodeRemove(view_model, element);
        }
        for (key in data) {
          value = data[key];
          if (key === 'view_model') {
            continue;
          }
          if (key === 'create') {
            value(view_model, element, value_accessor, all_bindings_accessor);
          } else if (_.isObject(value) && !_.isFunction(value)) {
            target = nested || (value && value.create) ? {} : view_model;
            view_model[key] = kb.Inject.inject(value, target, element, value_accessor, all_bindings_accessor, true);
          } else {
            view_model[key] = value;
          }
        }
      }
      return view_model;
    };
    if (nested) {
      return inject(data);
    } else {
      result = (wrapper = ko.dependentObservable(function() {
        return inject(data);
      }))();
      wrapper.dispose();
      return result;
    }
  };

  Inject.injectViewModels = function(root) {
    var afterBinding, app, beforeBinding, data, expression, findElements, options, results, _i, _len;
    results = [];
    findElements = function(el) {
      var attr, child_el, _i, _len, _ref;
      if (!el.__kb_injected) {
        if (el.attributes && (attr = _.find(el.attributes, function(attr) {
          return attr.name === 'kb-inject';
        }))) {
          el.__kb_injected = true;
          results.push({
            el: el,
            view_model: {},
            binding: attr.value
          });
        }
      }
      _ref = el.childNodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child_el = _ref[_i];
        findElements(child_el);
      }
    };
    if (!root && (typeof document !== "undefined" && document !== null)) {
      root = document;
    }
    findElements(root);
    for (_i = 0, _len = results.length; _i < _len; _i++) {
      app = results[_i];
      if (expression = app.binding) {
        (expression.search(/[:]/) < 0) || (expression = "{" + expression + "}");
        data = (new Function("", "return ( " + expression + " )"))();
        data || (data = {});
        (!data.options) || (options = data.options, delete data.options);
        options || (options = {});
        app.view_model = kb.Inject.inject(data, app.view_model, app.el, null, null, true);
        afterBinding = app.view_model.afterBinding || options.afterBinding;
        beforeBinding = app.view_model.beforeBinding || options.beforeBinding;
      }
      if (beforeBinding) {
        beforeBinding(app.view_model, app.el, options);
      }
      kb.applyBindings(app.view_model, app.el, options);
      if (afterBinding) {
        afterBinding(app.view_model, app.el, options);
      }
    }
    return results;
  };

  return Inject;

})();

_ko_applyBindings = ko.applyBindings;

ko.applyBindings = function(context, element) {
  var results;
  results = kb.RECUSIVE_AUTO_INJECT ? kb.injectViewModels(element) : [];
  if (!results.length) {
    return _ko_applyBindings.apply(this, arguments);
  }
};

kb.injectViewModels = kb.Inject.injectViewModels;

if (typeof document !== "undefined" && document !== null) {
  if (this.$) {
    this.$(function() {
      return kb.injectViewModels();
    });
  } else {
    (onReady = function() {
      if (document.readyState !== "complete") {
        return setTimeout(onReady, 0);
      }
      return kb.injectViewModels();
    })();
  }
}

});
require.register('kb', function(exports, require, module) {

/*
  knockback.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
 */
var copyProps, kb, ko, _;

_ = require('underscore');

ko = require('knockout');

copyProps = function(dest, source) {
  var key, value;
  for (key in source) {
    value = source[key];
    dest[key] = value;
  }
  return dest;
};

// Shared empty constructor function to aid in prototype-chain creation.
var ctor = function(){};

// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to 'goog.inherits', but uses a hash of prototype properties and
// class properties to be extended.
var inherits = function(parent, protoProps, staticProps) {
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your extend definition), or defaulted
  // by us to simply call the parent's constructor.
  if (protoProps && protoProps.hasOwnProperty('constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ parent.apply(this, arguments); };
  }

  // Inherit class (static) properties from parent.
  copyProps(child, parent);

  // Set the prototype chain to inherit from parent, without calling
  // parent's constructor function.
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) copyProps(child.prototype, protoProps);

  // Add static properties to the constructor function, if supplied.
  if (staticProps) copyProps(child, staticProps);

  // Correctly set child's 'prototype.constructor'.
  child.prototype.constructor = child;

  // Set a convenience property in case the parent's prototype is needed later.
  child.__super__ = parent.prototype;

  return child;
};

// The self-propagating extend function that BacLCone classes use.
var extend = function (protoProps, classProps) {
  var child = inherits(this, protoProps, classProps);
  child.extend = this.extend;
  return child;
};
;

module.exports = kb = (function() {
  var _ref;

  function kb() {}

  kb.VERSION = '0.18.6';

  kb.TYPE_UNKNOWN = 0;

  kb.TYPE_SIMPLE = 1;

  kb.TYPE_ARRAY = 2;

  kb.TYPE_MODEL = 3;

  kb.TYPE_COLLECTION = 4;

  kb.wasReleased = function(obj) {
    return !obj || obj.__kb_released;
  };

  kb.isReleaseable = function(obj, depth) {
    var key, value;
    if (depth == null) {
      depth = 0;
    }
    if ((!obj || (obj !== Object(obj))) || obj.__kb_released) {
      return false;
    } else if (ko.isObservable(obj) || (obj instanceof kb.ViewModel)) {
      return true;
    } else if ((typeof obj === 'function') || (obj instanceof kb.Model) || (obj instanceof kb.Collection)) {
      return false;
    } else if ((typeof obj.dispose === 'function') || (typeof obj.destroy === 'function') || (typeof obj.release === 'function')) {
      return true;
    } else if (depth < 1) {
      for (key in obj) {
        value = obj[key];
        if ((key !== '__kb') && kb.isReleaseable(value, depth + 1)) {
          return true;
        }
      }
    }
    return false;
  };

  kb.release = function(obj) {
    var array, index, value;
    if (!kb.isReleaseable(obj)) {
      return;
    }
    if (_.isArray(obj)) {
      for (index in obj) {
        value = obj[index];
        if (kb.isReleaseable(value)) {
          obj[index] = null;
          kb.release(value);
        }
      }
      return;
    }
    obj.__kb_released = true;
    if (ko.isObservable(obj) && _.isArray(array = kb.peek(obj))) {
      if (obj.__kb_is_co || (obj.__kb_is_o && (obj.valueType() === kb.TYPE_COLLECTION))) {
        if (obj.destroy) {
          obj.destroy();
        } else if (obj.dispose) {
          obj.dispose();
        }
      } else if (array.length) {
        for (index in array) {
          value = array[index];
          if (kb.isReleaseable(value)) {
            array[index] = null;
            kb.release(value);
          }
        }
      }
    } else if (typeof obj.release === 'function') {
      obj.release();
    } else if (typeof obj.destroy === 'function') {
      obj.destroy();
    } else if (typeof obj.dispose === 'function') {
      obj.dispose();
    } else if (!ko.isObservable(obj)) {
      this.releaseKeys(obj);
    }
  };

  kb.releaseKeys = function(obj) {
    var key, value;
    for (key in obj) {
      value = obj[key];
      if ((key !== '__kb') && kb.isReleaseable(value)) {
        obj[key] = null;
        kb.release(value);
      }
    }
  };

  kb.releaseOnNodeRemove = function(view_model, node) {
    view_model || kb._throwUnexpected(this, 'missing view model');
    node || kb._throwUnexpected(this, 'missing node');
    return ko.utils.domNodeDisposal.addDisposeCallback(node, function() {
      return kb.release(view_model);
    });
  };

  kb.renderTemplate = function(template, view_model, options) {
    var el, observable;
    if (options == null) {
      options = {};
    }
    if (typeof document === "undefined" || document === null) {
      return typeof console !== "undefined" && console !== null ? console.log('renderTemplate: document is undefined') : void 0;
    }
    el = document.createElement('div');
    observable = ko.renderTemplate(template, view_model, options, el, 'replaceChildren');
    if (el.children.length === 1) {
      el = el.children[0];
    }
    kb.releaseOnNodeRemove(view_model, el);
    observable.dispose();
    if (view_model.afterRender && !options.afterRender) {
      view_model.afterRender(el);
    }
    return el;
  };

  kb.applyBindings = function(view_model, node) {
    ko.applyBindings(view_model, node);
    return kb.releaseOnNodeRemove(view_model, node);
  };

  kb.getValue = function(model, key, args) {
    if (!model) {
      return;
    }
    if (_.isFunction(model[key]) && kb.orm.useFunction(model, key)) {
      return model[key]();
    }
    if (!args) {
      return model.get(key);
    }
    return model.get.apply(model, _.map([key].concat(args), function(value) {
      return kb.peek(value);
    }));
  };

  kb.setValue = function(model, key, value) {
    var attributes;
    if (!model) {
      return;
    }
    if (_.isFunction(model[key]) && kb.orm.useFunction(model, key)) {
      return model[key](value);
    }
    (attributes = {})[key] = value;
    return model.set(attributes);
  };

  kb.ignore = ((_ref = ko.dependencyDetection) != null ? _ref.ignore : void 0) || function(callback, callbackTarget, callbackArgs) {
    var value;
    value = null;
    ko.dependentObservable(function() {
      return value = callback.apply(callbackTarget, callbackArgs || []);
    }).dispose();
    return value;
  };

  kb.extend = extend;

  kb._throwMissing = function(instance, message) {
    throw "" + (_.isString(instance) ? instance : instance.constructor.name) + ": " + message + " is missing";
  };

  kb._throwUnexpected = function(instance, message) {
    throw "" + (_.isString(instance) ? instance : instance.constructor.name) + ": " + message + " is unexpected";
  };

  kb.publishMethods = function(observable, instance, methods) {
    var fn, _i, _len;
    for (_i = 0, _len = methods.length; _i < _len; _i++) {
      fn = methods[_i];
      observable[fn] = kb._.bind(instance[fn], instance);
    }
  };

  kb.peek = function(obs) {
    if (!ko.isObservable(obs)) {
      return obs;
    }
    if (obs.peek) {
      return obs.peek();
    }
    return kb.ignore(function() {
      return obs();
    });
  };

  return kb;

})();

});
require.register('observable', function(exports, require, module) {

/*
  knockback.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
 */
var kb, ko, _;

kb = require('./kb');

_ = require('underscore');

ko = require('knockout');

kb.Observable = (function() {
  function Observable(model, options, _vm) {
    this._vm = _vm != null ? _vm : {};
    return kb.ignore((function(_this) {
      return function() {
        var create_options, event_watcher, observable;
        options || kb._throwMissing(_this, 'options');
        if (_.isString(options) || ko.isObservable(options)) {
          create_options = _this.create_options = {
            key: options
          };
        } else {
          create_options = _this.create_options = kb.utils.collapseOptions(options);
        }
        _this.key = create_options.key;
        delete create_options.key;
        _this.key || kb._throwMissing(_this, 'key');
        !create_options.args || (_this.args = create_options.args, delete create_options.args);
        !create_options.read || (_this.read = create_options.read, delete create_options.read);
        !create_options.write || (_this.write = create_options.write, delete create_options.write);
        event_watcher = create_options.event_watcher;
        delete create_options.event_watcher;
        _this._vo = ko.observable(null);
        _this._model = ko.observable();
        observable = kb.utils.wrappedObservable(_this, ko.dependentObservable({
          read: function() {
            var arg, args, _i, _len, _model, _ref;
            _model = _this._model();
            _ref = args = [_this.key].concat(_this.args || []);
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              arg = _ref[_i];
              ko.utils.unwrapObservable(arg);
            }
            if (_this.read) {
              _this.update(_this.read.apply(_this._vm, args));
            } else if (!_.isUndefined(_model)) {
              kb.ignore(function() {
                return _this.update(kb.getValue(_model, kb.peek(_this.key), _this.args));
              });
            }
            return ko.utils.unwrapObservable(_this._vo());
          },
          write: function(new_value) {
            return kb.ignore(function() {
              var unwrapped_new_value, _model;
              unwrapped_new_value = kb.utils.unwrapModels(new_value);
              _model = kb.peek(_this._model);
              if (_this.write) {
                _this.write.call(_this._vm, unwrapped_new_value);
                new_value = kb.getValue(_model, kb.peek(_this.key), _this.args);
              } else if (_model) {
                kb.setValue(_model, kb.peek(_this.key), unwrapped_new_value);
              }
              return _this.update(new_value);
            });
          },
          owner: _this._vm
        }));
        observable.__kb_is_o = true;
        create_options.store = kb.utils.wrappedStore(observable, create_options.store);
        create_options.path = kb.utils.pathJoin(create_options.path, _this.key);
        if (create_options.factories && ((typeof create_options.factories === 'function') || create_options.factories.create)) {
          create_options.factory = kb.utils.wrappedFactory(observable, new kb.Factory(create_options.factory));
          create_options.factory.addPathMapping(create_options.path, create_options.factories);
        } else {
          create_options.factory = kb.Factory.useOptionsOrCreate(create_options, observable, create_options.path);
        }
        delete create_options.factories;
        kb.publishMethods(observable, _this, ['value', 'valueType', 'destroy']);
        observable.model = _this.model = ko.dependentObservable({
          read: function() {
            return ko.utils.unwrapObservable(_this._model);
          },
          write: function(new_model) {
            return kb.ignore(function() {
              var new_value;
              if (_this.__kb_released || (kb.peek(_this._model) === new_model)) {
                return;
              }
              new_value = kb.getValue(new_model, kb.peek(_this.key), _this.args);
              _this._model(new_model);
              if (!new_model) {
                return _this.update(null);
              } else if (!_.isUndefined(new_value)) {
                return _this.update(new_value);
              }
            });
          }
        });
        kb.EventWatcher.useOptionsOrCreate({
          event_watcher: event_watcher
        }, model, _this, {
          emitter: _this.model,
          update: _.bind(_this.update, _this),
          key: _this.key,
          path: create_options.path
        });
        _this.__kb_value || _this.update();
        if (kb.LocalizedObservable && create_options.localizer) {
          observable = new create_options.localizer(observable);
          delete create_options.localizer;
        }
        if (kb.DefaultObservable && create_options.hasOwnProperty('default')) {
          observable = kb.defaultObservable(observable, create_options["default"]);
          delete create_options["default"];
        }
        return observable;
      };
    })(this));
  }

  Observable.prototype.destroy = function() {
    var observable;
    observable = kb.utils.wrappedObservable(this);
    this.__kb_released = true;
    kb.release(this.__kb_value);
    this.__kb_value = null;
    this.model.dispose();
    this.model = observable.model = null;
    return kb.utils.wrappedDestroy(this);
  };

  Observable.prototype.value = function() {
    return this.__kb_value;
  };

  Observable.prototype.valueType = function() {
    var new_value;
    new_value = kb.getValue(kb.peek(this._model), kb.peek(this.key));
    this.value_type || this._updateValueObservable(new_value);
    return this.value_type;
  };

  Observable.prototype.update = function(new_value) {
    var new_type, value;
    if (this.__kb_released) {
      return;
    }
    if (!arguments.length) {
      new_value = kb.getValue(kb.peek(this._model), kb.peek(this.key));
    }
    (new_value !== void 0) || (new_value = null);
    new_type = kb.utils.valueType(new_value);
    if (!this.__kb_value || (this.__kb_value.__kb_released || (this.__kb_value.__kb_null && new_value))) {
      this.__kb_value = void 0;
      this.value_type = void 0;
    }
    value = this.__kb_value;
    if (_.isUndefined(this.value_type) || (this.value_type !== new_type && new_type !== kb.TYPE_UNKNOWN)) {
      if ((this.value_type === kb.TYPE_COLLECTION) && (new_type === kb.TYPE_ARRAY)) {
        return value(new_value);
      } else {
        return this._updateValueObservable(new_value);
      }
    } else if (this.value_type === kb.TYPE_MODEL) {
      if (typeof value.model === 'function') {
        if (value.model() !== new_value) {
          return value.model(new_value);
        }
      } else if (kb.utils.wrappedObject(value) !== new_value) {
        return this._updateValueObservable(new_value);
      }
    } else if (this.value_type === kb.TYPE_COLLECTION) {
      if (value.collection() !== new_value) {
        return value.collection(new_value);
      }
    } else {
      if (value() !== new_value) {
        return value(new_value);
      }
    }
  };

  Observable.prototype._updateValueObservable = function(new_value) {
    var create_options, creator, previous_value, value;
    create_options = this.create_options;
    create_options.creator = kb.utils.inferCreator(new_value, create_options.factory, create_options.path, kb.peek(this._model), this.key);
    this.value_type = kb.TYPE_UNKNOWN;
    creator = create_options.creator;
    previous_value = this.__kb_value;
    this.__kb_value = void 0;
    if (previous_value) {
      kb.release(previous_value);
    }
    if (creator) {
      if (create_options.store) {
        value = create_options.store.findOrCreate(new_value, create_options);
      } else {
        if (creator.models_only) {
          value = new_value;
          this.value_type = kb.TYPE_SIMPLE;
        } else if (creator.create) {
          value = creator.create(new_value, create_options);
        } else {
          value = new creator(new_value, create_options);
        }
      }
    } else {
      if (_.isArray(new_value)) {
        this.value_type = kb.TYPE_ARRAY;
        value = ko.observableArray(new_value);
      } else {
        this.value_type = kb.TYPE_SIMPLE;
        value = ko.observable(new_value);
      }
    }
    if (this.value_type === kb.TYPE_UNKNOWN) {
      if (!ko.isObservable(value)) {
        this.value_type = kb.TYPE_MODEL;
        if (typeof value.model !== 'function') {
          kb.utils.wrappedObject(value, new_value);
        }
      } else if (value.__kb_is_co) {
        this.value_type = kb.TYPE_COLLECTION;
      } else {
        this.value_type = kb.TYPE_SIMPLE;
      }
    }
    this.__kb_value = value;
    return this._vo(value);
  };

  return Observable;

})();

kb.observable = function(model, options, view_model) {
  return new kb.Observable(model, options, view_model);
};

});
require.register('orm', function(exports, require, module) {

/*
  knockback.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
 */
var ORM, ORMAdapter_BackboneAssociations, ORMAdapter_BackboneRelational, ORMAdapter_Supermodel, kb, _;

kb = require('./kb');

_ = require('underscore');

ORM = (function() {
  function ORM() {
    this.adapters = [];
  }

  ORM.prototype.initialize = function() {
    this.adapters = _.select(this.adapters, function(adapter) {
      return adapter.isAvailable();
    });
    return this.initialized = true;
  };

  ORM.prototype.addAdapter = function(adapter) {
    this.adapters.push(adapter);
    return this.initialized = false;
  };

  ORM.prototype.keys = function(model) {
    return this._call('keys', arguments);
  };

  ORM.prototype.bind = function(model) {
    return this._call('bind', arguments);
  };

  ORM.prototype.useFunction = function(model) {
    return this._call('useFunction', arguments);
  };

  ORM.prototype._call = function(name, args) {
    var adpater, result, _i, _len, _ref;
    if (!this.adapters.length) {
      return;
    }
    if (!this.initialized) {
      this.initialize();
    }
    _ref = this.adapters;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      adpater = _ref[_i];
      if (adpater[name] && (result = adpater[name].apply(adpater, args))) {
        return result;
      }
    }
  };

  return ORM;

})();

kb.orm = new ORM();

ORMAdapter_BackboneRelational = (function() {
  function ORMAdapter_BackboneRelational() {}

  ORMAdapter_BackboneRelational.prototype.isAvailable = function() {
    var _ref, _ref1;
    try {
      ((_ref = kb.Backbone) != null ? _ref.RelationalModel : void 0) || (typeof require === "function" ? require('backbone-relational') : void 0);
    } catch (_error) {

    }
    return !!((_ref1 = kb.Backbone) != null ? _ref1.RelationalModel : void 0);
  };

  ORMAdapter_BackboneRelational.prototype.relationType = function(model, key) {
    var relation;
    if (!(model instanceof kb.Backbone.RelationalModel)) {
      return null;
    }
    if (!(relation = _.find(model.getRelations(), function(test) {
      return test.key === key;
    }))) {
      return null;
    }
    if (relation.collectionType || _.isArray(relation.keyContents)) {
      return kb.TYPE_COLLECTION;
    } else {
      return kb.TYPE_MODEL;
    }
  };

  ORMAdapter_BackboneRelational.prototype.bind = function(model, key, update, path) {
    var event, events, rel_fn, type, _i, _len;
    if (!(type = this.relationType(model, key))) {
      return null;
    }
    rel_fn = function(model) {
      !kb.statistics || kb.statistics.addModelEvent({
        name: 'update (relational)',
        model: model,
        key: key,
        path: path
      });
      return update();
    };
    events = Backbone.Relation.prototype.sanitizeOptions ? ['update', 'add', 'remove'] : ['change', 'add', 'remove'];
    if (type === kb.TYPE_COLLECTION) {
      for (_i = 0, _len = events.length; _i < _len; _i++) {
        event = events[_i];
        model.bind("" + event + ":" + key, rel_fn);
      }
    } else {
      model.bind("" + events[0] + ":" + key, rel_fn);
    }
    return function() {
      var _j, _len1;
      if (type === kb.TYPE_COLLECTION) {
        for (_j = 0, _len1 = events.length; _j < _len1; _j++) {
          event = events[_j];
          model.unbind("" + event + ":" + key, rel_fn);
        }
      } else {
        model.unbind("" + events[0] + ":" + key, rel_fn);
      }
    };
  };

  return ORMAdapter_BackboneRelational;

})();

kb.orm.addAdapter(new ORMAdapter_BackboneRelational());

ORMAdapter_BackboneAssociations = (function() {
  function ORMAdapter_BackboneAssociations() {}

  ORMAdapter_BackboneAssociations.prototype.isAvailable = function() {
    var _ref, _ref1;
    try {
      ((_ref = kb.Backbone) != null ? _ref.AssociatedModel : void 0) || (typeof require === "function" ? require('backbone-associations') : void 0);
    } catch (_error) {

    }
    return !!((_ref1 = kb.Backbone) != null ? _ref1.AssociatedModel : void 0);
  };

  ORMAdapter_BackboneAssociations.prototype.keys = function(model) {
    if (!(model instanceof kb.Backbone.AssociatedModel)) {
      return null;
    }
    return _.map(model.relations, function(test) {
      return test.key;
    });
  };

  ORMAdapter_BackboneAssociations.prototype.relationType = function(model, key) {
    var relation;
    if (!(model instanceof kb.Backbone.AssociatedModel)) {
      return null;
    }
    if (!(relation = _.find(model.relations, function(test) {
      return test.key === key;
    }))) {
      return null;
    }
    if (relation.type === 'Many') {
      return kb.TYPE_COLLECTION;
    } else {
      return kb.TYPE_MODEL;
    }
  };

  return ORMAdapter_BackboneAssociations;

})();

kb.orm.addAdapter(new ORMAdapter_BackboneAssociations());

ORMAdapter_Supermodel = (function() {
  function ORMAdapter_Supermodel() {}

  ORMAdapter_Supermodel.prototype.isAvailable = function() {
    try {
      (typeof window !== "undefined" && window !== null ? window.Supermodel : void 0) || (typeof require === "function" ? require('supermodel') : void 0);
    } catch (_error) {

    }
    return !!(typeof window !== "undefined" && window !== null ? window.Supermodel : void 0);
  };

  ORMAdapter_Supermodel.prototype.keys = function(model) {
    if (!(model instanceof Supermodel.Model)) {
      return null;
    }
    return _.keys(model.constructor.associations());
  };

  ORMAdapter_Supermodel.prototype.relationType = function(model, key) {
    var relation;
    if (!(model instanceof Supermodel.Model)) {
      return null;
    }
    if (!(relation = model.constructor.associations()[key])) {
      return null;
    }
    if (relation.add) {
      return kb.TYPE_COLLECTION;
    } else {
      return kb.TYPE_MODEL;
    }
  };

  ORMAdapter_Supermodel.prototype.bind = function(model, key, update, path) {
    var rel_fn, type;
    if (!(type = this.relationType(model, key))) {
      return null;
    }
    rel_fn = function(model, other) {
      var previous, relation;
      !kb.statistics || kb.statistics.addModelEvent({
        name: 'update (supermodel)',
        model: model,
        key: key,
        path: path
      });
      relation = model.constructor.associations()[key];
      previous = model[relation.store];
      model[relation.store] = other;
      update(other);
      return model[relation.store] = previous;
    };
    if (type === kb.TYPE_MODEL) {
      model.bind("associate:" + key, rel_fn);
      return function() {
        return model.unbind("associate:" + key, rel_fn);
      };
    }
  };

  ORMAdapter_Supermodel.prototype.useFunction = function(model, key) {
    return !!this.relationType(model, key);
  };

  return ORMAdapter_Supermodel;

})();

kb.orm.addAdapter(new ORMAdapter_Supermodel());

});
require.register('store', function(exports, require, module) {

/*
  knockback.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
 */
var kb, ko, _;

kb = require('./kb');

_ = require('underscore');

ko = require('knockout');

module.exports = kb.Store = (function() {
  Store.useOptionsOrCreate = function(options, obj, observable) {
    if (options.store) {
      options.store.register(obj, observable, options);
      return kb.utils.wrappedStore(observable, options.store);
    } else {
      kb.utils.wrappedStoreIsOwned(observable, true);
      return kb.utils.wrappedStore(observable, new kb.Store());
    }
  };

  function Store() {
    this.observable_records = [];
    this.replaced_observables = [];
  }

  Store.prototype.destroy = function() {
    return this.clear();
  };

  Store.prototype.clear = function() {
    var record, _i, _len, _ref;
    _ref = this.observable_records.splice(0, this.observable_records.length);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      record = _ref[_i];
      kb.release(record.observable);
    }
    kb.release(this.replaced_observables);
  };

  Store.prototype.compact = function() {
    var index, record, removals, _ref, _ref1;
    removals = [];
    _ref = this.observable_records;
    for (index in _ref) {
      record = _ref[index];
      if ((_ref1 = record.observable) != null ? _ref1.__kb_released : void 0) {
        removals.push(record);
      }
    }
    if (removals.length) {
      this.observable_records = _.difference(this.observable_records, removals);
    }
  };

  Store.prototype.register = function(obj, observable, options) {
    var creator;
    if (!observable) {
      return;
    }
    if (ko.isObservable(observable) || observable.__kb_is_co) {
      return;
    }
    kb.utils.wrappedObject(observable, obj);
    obj || (observable.__kb_null = true);
    creator = options.creator ? options.creator : (options.path && options.factory ? options.factory.creatorForPath(obj, options.path) : null);
    if (!creator) {
      creator = observable.constructor;
    }
    this.observable_records.push({
      obj: obj,
      observable: observable,
      creator: creator
    });
    return observable;
  };

  Store.prototype.findIndex = function(obj, creator) {
    var index, record, removals, _ref;
    removals = [];
    if (!obj || (obj instanceof kb.Model)) {
      _ref = this.observable_records;
      for (index in _ref) {
        record = _ref[index];
        if (!record.observable) {
          continue;
        }
        if (record.observable.__kb_released) {
          removals.push(record);
          continue;
        }
        if ((!obj && !record.observable.__kb_null) || (obj && (record.observable.__kb_null || (record.obj !== obj)))) {
          continue;
        } else if ((record.creator === creator) || (record.creator.create && (record.creator.create === creator.create))) {
          if (removals.length) {
            this.observable_records = _.difference(this.observable_records, removals);
            return _.indexOf(this.observable_records, record);
          } else {
            return index;
          }
        }
      }
    }
    if (removals.length) {
      this.observable_records = _.difference(this.observable_records, removals);
    }
    return -1;
  };

  Store.prototype.find = function(obj, creator) {
    var index;
    if ((index = this.findIndex(obj, creator)) < 0) {
      return null;
    } else {
      return this.observable_records[index].observable;
    }
  };

  Store.prototype.isRegistered = function(observable) {
    var record, _i, _len, _ref;
    _ref = this.observable_records;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      record = _ref[_i];
      if (record.observable === observable) {
        return true;
      }
    }
    return false;
  };

  Store.prototype.findOrCreate = function(obj, options) {
    var creator, observable;
    options.store = this;
    options.creator || (options.creator = kb.utils.inferCreator(obj, options.factory, options.path));
    if (!options.creator && (obj instanceof kb.Model)) {
      options.creator = kb.ViewModel;
    }
    creator = options.creator;
    if (!creator) {
      return kb.utils.createFromDefaultCreator(obj, options);
    } else if (creator.models_only) {
      return obj;
    }
    if (creator) {
      observable = this.find(obj, creator);
    }
    if (observable) {
      return observable;
    }
    observable = kb.ignore((function(_this) {
      return function() {
        if (creator.create) {
          observable = creator.create(obj, options);
        } else {
          observable = new creator(obj, options);
        }
        return observable || ko.observable(null);
      };
    })(this));
    if (!ko.isObservable(observable)) {
      this.isRegistered(observable) || this.register(obj, observable, options);
    }
    return observable;
  };

  Store.prototype.findOrReplace = function(obj, creator, observable) {
    var index, record;
    obj || kb._throwUnexpected(this, 'obj missing');
    if ((index = this.findIndex(obj, creator)) < 0) {
      return this.register(obj, observable, {
        creator: creator
      });
    } else {
      record = this.observable_records[index];
      (kb.utils.wrappedObject(record.observable) === obj) || kb._throwUnexpected(this, 'different object');
      if (record.observable !== observable) {
        (record.observable.constructor === observable.constructor) || kb._throwUnexpected(this, 'replacing different type');
        this.replaced_observables.push(record.observable);
        record.observable = observable;
      }
      return observable;
    }
  };

  return Store;

})();

});
require.register('utils', function(exports, require, module) {

/*
  knockback.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
 */
var kb, ko, _, _argumentsAddKey, _keyArrayToObject, _mergeArray, _mergeObject, _wrappedKey;

kb = require('./kb');

_ = require('underscore');

ko = require('knockout');

_wrappedKey = kb._wrappedKey = function(obj, key, value) {
  if (arguments.length === 2) {
    if (obj && obj.__kb && obj.__kb.hasOwnProperty(key)) {
      return obj.__kb[key];
    } else {
      return void 0;
    }
  }
  obj || kb._throwUnexpected(this, "no obj for wrapping " + key);
  obj.__kb || (obj.__kb = {});
  obj.__kb[key] = value;
  return value;
};

_argumentsAddKey = function(args, key) {
  Array.prototype.splice.call(args, 1, 0, key);
  return args;
};

_mergeArray = function(result, key, value) {
  result[key] || (result[key] = []);
  if (!_.isArray(value)) {
    value = [value];
  }
  result[key] = result[key].length ? _.union(result[key], value) : value;
  return result;
};

_mergeObject = function(result, key, value) {
  result[key] || (result[key] = {});
  return _.extend(result[key], value);
};

_keyArrayToObject = function(value) {
  var item, result, _i, _len;
  result = {};
  for (_i = 0, _len = value.length; _i < _len; _i++) {
    item = value[_i];
    result[item] = {
      key: item
    };
  }
  return result;
};

kb.utils = (function() {
  function utils() {}

  utils.wrappedObservable = function(obj, value) {
    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'observable'));
  };

  utils.wrappedObject = function(obj, value) {
    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'object'));
  };

  utils.wrappedModel = function(obj, value) {
    if (arguments.length === 1) {
      value = _wrappedKey(obj, 'object');
      if (_.isUndefined(value)) {
        return obj;
      } else {
        return value;
      }
    } else {
      return _wrappedKey(obj, 'object', value);
    }
  };

  utils.wrappedStore = function(obj, value) {
    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'store'));
  };

  utils.wrappedStoreIsOwned = function(obj, value) {
    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'store_is_owned'));
  };

  utils.wrappedFactory = function(obj, value) {
    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'factory'));
  };

  utils.wrappedEventWatcher = function(obj, value) {
    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'event_watcher'));
  };

  utils.wrappedEventWatcherIsOwned = function(obj, value) {
    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'event_watcher_is_owned'));
  };

  utils.wrappedDestroy = function(obj) {
    var __kb;
    if (!obj.__kb) {
      return;
    }
    if (obj.__kb.event_watcher) {
      obj.__kb.event_watcher.releaseCallbacks(obj);
    }
    __kb = obj.__kb;
    obj.__kb = null;
    if (__kb.observable) {
      __kb.observable.destroy = __kb.observable.release = null;
      this.wrappedDestroy(__kb.observable);
      __kb.observable = null;
    }
    __kb.factory = null;
    if (__kb.event_watcher_is_owned) {
      __kb.event_watcher.destroy();
    }
    __kb.event_watcher = null;
    if (__kb.store_is_owned) {
      __kb.store.destroy();
    }
    return __kb.store = null;
  };

  utils.valueType = function(observable) {
    if (!observable) {
      return kb.TYPE_UNKNOWN;
    }
    if (observable.__kb_is_o) {
      return observable.valueType();
    }
    if (observable.__kb_is_co || (observable instanceof kb.Collection)) {
      return kb.TYPE_COLLECTION;
    }
    if ((observable instanceof kb.ViewModel) || (observable instanceof kb.Model)) {
      return kb.TYPE_MODEL;
    }
    if (_.isArray(observable)) {
      return kb.TYPE_ARRAY;
    }
    return kb.TYPE_SIMPLE;
  };

  utils.pathJoin = function(path1, path2) {
    return (path1 ? (path1[path1.length - 1] !== '.' ? "" + path1 + "." : path1) : '') + path2;
  };

  utils.optionsPathJoin = function(options, path) {
    return _.defaults({
      path: this.pathJoin(options.path, path)
    }, options);
  };

  utils.inferCreator = function(value, factory, path, owner, key) {
    var creator;
    if (factory) {
      creator = factory.creatorForPath(value, path);
    }
    if (creator) {
      return creator;
    }
    if (!value) {
      return null;
    }
    if (value instanceof kb.Model) {
      return kb.ViewModel;
    }
    if (value instanceof kb.Collection) {
      return kb.CollectionObservable;
    }
    return null;
  };

  utils.createFromDefaultCreator = function(obj, options) {
    if (obj instanceof kb.Model) {
      return kb.viewModel(obj, options);
    }
    if (obj instanceof kb.Collection) {
      return kb.collectionObservable(obj, options);
    }
    if (_.isArray(obj)) {
      return ko.observableArray(obj);
    }
    return ko.observable(obj);
  };

  utils.hasModelSignature = function(obj) {
    return obj && (obj.attributes && !obj.models) && (typeof obj.get === 'function') && (typeof obj.trigger === 'function');
  };

  utils.hasCollectionSignature = function(obj) {
    return obj && obj.models && (typeof obj.get === 'function') && (typeof obj.trigger === 'function');
  };

  utils.collapseOptions = function(options) {
    var key, result, value, _ref;
    result = {};
    options = {
      options: options
    };
    while (options.options) {
      _ref = options.options;
      for (key in _ref) {
        value = _ref[key];
        switch (key) {
          case 'internals':
          case 'requires':
          case 'excludes':
          case 'statics':
            _mergeArray(result, key, value);
            break;
          case 'keys':
            if ((_.isObject(value) && !_.isArray(value)) || (_.isObject(result[key]) && !_.isArray(result[key]))) {
              if (!_.isObject(value)) {
                value = [value];
              }
              if (_.isArray(value)) {
                value = _keyArrayToObject(value);
              }
              if (_.isArray(result[key])) {
                result[key] = _keyArrayToObject(result[key]);
              }
              _mergeObject(result, key, value);
            } else {
              _mergeArray(result, key, value);
            }
            break;
          case 'factories':
            if (_.isFunction(value)) {
              result[key] = value;
            } else {
              _mergeObject(result, key, value);
            }
            break;
          case 'static_defaults':
            _mergeObject(result, key, value);
            break;
          case 'options':
            break;
          default:
            result[key] = value;
        }
      }
      options = options.options;
    }
    return result;
  };

  utils.unwrapModels = function(obj) {
    var key, result, value;
    if (!obj) {
      return obj;
    }
    if (obj.__kb) {
      if ('object' in obj.__kb) {
        return obj.__kb.object;
      } else {
        return obj;
      }
    } else if (_.isArray(obj)) {
      return _.map(obj, function(test) {
        return kb.utils.unwrapModels(test);
      });
    } else if (_.isObject(obj) && (obj.constructor === {}.constructor)) {
      result = {};
      for (key in obj) {
        value = obj[key];
        result[key] = kb.utils.unwrapModels(value);
      }
      return result;
    }
    return obj;
  };

  return utils;

})();

});
require.register('view-model', function(exports, require, module) {

/*
  knockback.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
 */
var kb, ko, _;

kb = require('./kb');

_ = require('underscore');

ko = require('knockout');

kb.ViewModel = (function() {
  ViewModel.extend = kb.extend;

  function ViewModel(model, options, view_model) {
    return kb.ignore((function(_this) {
      return function() {
        var attribute_keys, bb_model, event_watcher, keys, mapped_keys, mapping_info, rel_keys, vm_key, _mdl, _ref;
        !model || (model instanceof kb.Model) || ((typeof model.get === 'function') && (typeof model.bind === 'function')) || kb._throwUnexpected(_this, 'not a model');
        options || (options = {});
        view_model || (view_model = {});
        if (_.isArray(options)) {
          options = {
            keys: options
          };
        } else {
          options = kb.utils.collapseOptions(options);
        }
        _this.__kb || (_this.__kb = {});
        _this.__kb.vm_keys = {};
        _this.__kb.model_keys = {};
        _this.__kb.view_model = _.isUndefined(view_model) ? _this : view_model;
        !options.internals || (_this.__kb.internals = options.internals);
        !options.excludes || (_this.__kb.excludes = options.excludes);
        !options.statics || (_this.__kb.statics = options.statics);
        !options.static_defaults || (_this.__kb.static_defaults = options.static_defaults);
        kb.Store.useOptionsOrCreate(options, model, _this);
        _this.__kb.path = options.path;
        kb.Factory.useOptionsOrCreate(options, _this, options.path);
        _mdl = kb._wrappedKey(_this, '_mdl', ko.observable());
        _this.model = ko.dependentObservable({
          read: function() {
            _mdl();
            return kb.utils.wrappedObject(_this);
          },
          write: function(new_model) {
            return kb.ignore(function() {
              var event_watcher, keys, missing, rel_keys;
              if (kb.utils.wrappedObject(_this) === new_model) {
                return;
              }
              if (_this.__kb_null) {
                !new_model || kb._throwUnexpected(_this, 'model set on shared null');
                return;
              }
              kb.utils.wrappedObject(_this, new_model);
              event_watcher = kb.utils.wrappedEventWatcher(_this);
              if (!event_watcher) {
                _mdl(new_model);
                return;
              }
              event_watcher.emitter(new_model);
              if (!(_this.__kb.keys || !new_model || !new_model.attributes)) {
                keys = _.keys(new_model.attributes);
                if (new_model && (rel_keys = kb.orm.keys(new_model))) {
                  keys = _.union(keys, rel_keys);
                }
                missing = _.difference(keys, _.keys(_this.__kb.model_keys));
                if (missing) {
                  _this.createObservables(new_model, missing);
                }
              }
              _mdl(new_model);
            });
          }
        });
        event_watcher = kb.utils.wrappedEventWatcher(_this, new kb.EventWatcher(model, _this, {
          emitter: _this.model
        }));
        keys = options.requires;
        if (_this.__kb.internals) {
          keys = _.union(keys || [], _this.__kb.internals);
        }
        if (model && (rel_keys = kb.orm.keys(model))) {
          keys = _.union(keys || [], rel_keys);
        }
        if (options.keys) {
          if (_.isObject(options.keys) && !_.isArray(options.keys)) {
            mapped_keys = {};
            _ref = options.keys;
            for (vm_key in _ref) {
              mapping_info = _ref[vm_key];
              mapped_keys[_.isString(mapping_info) ? mapping_info : (mapping_info.key ? mapping_info.key : vm_key)] = true;
            }
            _this.__kb.keys = _.keys(mapped_keys);
          } else {
            _this.__kb.keys = options.keys;
            keys = keys ? _.union(keys, _this.__kb.keys) : _.clone(_this.__kb.keys);
          }
        } else {
          bb_model = event_watcher.emitter();
          if (bb_model && bb_model.attributes) {
            attribute_keys = _.keys(bb_model.attributes);
            keys = keys ? _.union(keys, attribute_keys) : attribute_keys;
          }
        }
        if (keys && _this.__kb.excludes) {
          keys = _.difference(keys, _this.__kb.excludes);
        }
        if (keys && _this.__kb.statics) {
          keys = _.difference(keys, _this.__kb.statics);
        }
        if (_.isObject(options.keys) && !_.isArray(options.keys)) {
          _this.mapObservables(model, options.keys);
        }
        if (_.isObject(options.requires) && !_.isArray(options.requires)) {
          _this.mapObservables(model, options.requires);
        }
        !options.mappings || _this.mapObservables(model, options.mappings);
        !keys || _this.createObservables(model, keys);
        !_this.__kb.statics || _this.createObservables(model, _this.__kb.statics, true);
        !kb.statistics || kb.statistics.register('ViewModel', _this);
        return _this;
      };
    })(this));
  }

  ViewModel.prototype.destroy = function() {
    var vm_key;
    if (this.__kb.view_model !== this) {
      for (vm_key in this.__kb.vm_keys) {
        this.__kb.view_model[vm_key] = null;
      }
    }
    this.__kb.view_model = null;
    kb.releaseKeys(this);
    kb.utils.wrappedDestroy(this);
    return !kb.statistics || kb.statistics.unregister('ViewModel', this);
  };

  ViewModel.prototype.shareOptions = function() {
    return {
      store: kb.utils.wrappedStore(this),
      factory: kb.utils.wrappedFactory(this)
    };
  };

  ViewModel.prototype.createObservables = function(model, keys, is_static) {
    var create_options, key, static_defaults, vm_key, _i, _len;
    if (is_static) {
      static_defaults = this.__kb.static_defaults || {};
    } else {
      create_options = {
        store: kb.utils.wrappedStore(this),
        factory: kb.utils.wrappedFactory(this),
        path: this.__kb.path,
        event_watcher: kb.utils.wrappedEventWatcher(this)
      };
    }
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      vm_key = this.__kb.internals && _.contains(this.__kb.internals, key) ? "_" + key : key;
      if (this[vm_key]) {
        continue;
      }
      this.__kb.vm_keys[vm_key] = this.__kb.model_keys[key] = true;
      if (is_static) {
        if (model.has(vm_key)) {
          this[vm_key] = this.__kb.view_model[vm_key] = model.get(vm_key);
        } else if (vm_key in static_defaults) {
          this[vm_key] = this.__kb.view_model[vm_key] = static_defaults[vm_key];
        }
      } else {
        create_options.key = key;
        this[vm_key] = this.__kb.view_model[vm_key] = kb.observable(model, create_options, this);
      }
    }
  };

  ViewModel.prototype.mapObservables = function(model, mappings) {
    var create_options, mapping_info, vm_key;
    create_options = {
      store: kb.utils.wrappedStore(this),
      factory: kb.utils.wrappedFactory(this),
      path: this.__kb.path,
      event_watcher: kb.utils.wrappedEventWatcher(this)
    };
    for (vm_key in mappings) {
      mapping_info = mappings[vm_key];
      if (this[vm_key]) {
        continue;
      }
      mapping_info = _.isString(mapping_info) ? {
        key: mapping_info
      } : _.clone(mapping_info);
      mapping_info.key || (mapping_info.key = vm_key);
      this.__kb.vm_keys[vm_key] = this.__kb.model_keys[mapping_info.key] = true;
      this[vm_key] = this.__kb.view_model[vm_key] = kb.observable(model, _.defaults(mapping_info, create_options), this);
    }
  };

  return ViewModel;

})();

kb.viewModel = function(model, options, view_model) {
  return new kb.ViewModel(model, options, view_model);
};

});

  if (typeof define == 'function' && define.amd) {
    define(["require","underscore","backbone","knockout"], function(){ return require('index'); });
  }
  else if (typeof exports == 'object') {
    module.exports = require('index');
  } else {
    this['kb'] = require('index');
  }

}).call(this);
>>>>>>> ec263e728855d379f1e44d8b94b29b32a5379f47
