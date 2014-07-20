/*
  backbone-orm.js 0.6.0
  Copyright (c) 2013-2014 Vidigami
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/vidigami/backbone-orm
  Dependencies: Backbone.js and Underscore.js.
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("underscore"), require("backbone"), (function webpackLoadOptionalExternalModule() { try { return require("stream"); } catch(e) {} }()));
	else if(typeof define === 'function' && define.amd)
		define(["underscore", "backbone"], (function webpackLoadOptionalExternalModuleAmd(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) { return factory(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, root["stream"]); }));
	else if(typeof exports === 'object')
		exports["BackboneORM"] = factory(require("underscore"), require("backbone"), (function webpackLoadOptionalExternalModule() { try { return require("stream"); } catch(e) {} }()));
	else
		root["BackboneORM"] = factory(root["_"], root["Backbone"], root["stream"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
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

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var BackboneORM, publish;

	module.exports = BackboneORM = __webpack_require__(4);

	publish = {
	  configure: __webpack_require__(6),
	  sync: __webpack_require__(5),
	  Utils: __webpack_require__(7),
	  JSONUtils: __webpack_require__(8),
	  DateUtils: __webpack_require__(9),
	  Queue: __webpack_require__(10),
	  DatabaseURL: __webpack_require__(11),
	  Fabricator: __webpack_require__(12),
	  MemoryStore: __webpack_require__(16),
	  Cursor: __webpack_require__(13),
	  Schema: __webpack_require__(14),
	  ConnectionPool: __webpack_require__(15),
	  BaseConvention: __webpack_require__(17),
	  _: __webpack_require__(1),
	  Backbone: __webpack_require__(2)
	};

	publish._.extend(BackboneORM, publish);

	BackboneORM.modules = {
	  underscore: __webpack_require__(1),
	  backbone: __webpack_require__(2),
	  url: __webpack_require__(18),
	  querystring: __webpack_require__(19),
	  'lru-cache': __webpack_require__(25),
	  inflection: __webpack_require__(26)
	};

	try {
	  BackboneORM.modules.stream = __webpack_require__(3);
	} catch (_error) {}


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

	if(typeof __WEBPACK_EXTERNAL_MODULE_3__ === 'undefined') {var e = new Error("Cannot find module \"stream\""); e.code = 'MODULE_NOT_FOUND'; throw e;}
	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var Backbone, BackboneORM, CAPABILITIES, DESTROY_BATCH_LIMIT, JSONUtils, MemoryCursor, MemorySync, Queue, Schema, Utils, _;

	_ = __webpack_require__(1);

	Backbone = __webpack_require__(2);

	BackboneORM = __webpack_require__(4);

	Queue = __webpack_require__(10);

	MemoryCursor = __webpack_require__(20);

	Schema = __webpack_require__(14);

	Utils = __webpack_require__(7);

	JSONUtils = __webpack_require__(8);

	DESTROY_BATCH_LIMIT = 1000;

	CAPABILITIES = {
	  embed: true,
	  json: true,
	  self_reference: true
	};

	MemorySync = (function() {
	  function MemorySync(model_type) {
	    var _base;
	    this.model_type = model_type;
	    this.model_type.model_name = Utils.findOrGenerateModelName(this.model_type);
	    this.schema = new Schema(this.model_type, {
	      id: {
	        type: 'Integer'
	      }
	    });
	    this.store = (_base = this.model_type).store || (_base.store = {});
	    this.id = 0;
	  }

	  MemorySync.prototype.initialize = function() {
	    if (this.is_initialized) {
	      return;
	    }
	    this.is_initialized = true;
	    return this.schema.initialize();
	  };

	  MemorySync.prototype.read = function(model, options) {
	    var id, model_json;
	    if (model.models) {
	      return options.success((function() {
	        var _ref, _results;
	        _ref = this.store;
	        _results = [];
	        for (id in _ref) {
	          model_json = _ref[id];
	          _results.push(JSONUtils.deepClone(model_json));
	        }
	        return _results;
	      }).call(this));
	    } else {
	      if (_.isUndefined(this.store[model.id])) {
	        return options.error(new Error("Model not found with id: " + model.id));
	      }
	      return options.success(JSONUtils.deepClone(this.store[model.id]));
	    }
	  };

	  MemorySync.prototype.create = function(model, options) {
	    var attributes, model_json;
	    (attributes = {})[this.model_type.prototype.idAttribute] = ++this.id;
	    model.set(attributes);
	    model_json = this.store[model.id] = model.toJSON();
	    return options.success(JSONUtils.deepClone(model_json));
	  };

	  MemorySync.prototype.update = function(model, options) {
	    var model_json;
	    this.store[model.id] = model_json = model.toJSON();
	    return options.success(JSONUtils.deepClone(model_json));
	  };

	  MemorySync.prototype["delete"] = function(model, options) {
	    if (!this.store[model.id]) {
	      return options.error(new Error('Model not found'));
	    }
	    delete this.store[model.id];
	    return options.success();
	  };

	  MemorySync.prototype.resetSchema = function(options, callback) {
	    return this.destroy({}, callback);
	  };

	  MemorySync.prototype.cursor = function(query) {
	    if (query == null) {
	      query = {};
	    }
	    return new MemoryCursor(query, _.pick(this, ['model_type', 'store']));
	  };

	  MemorySync.prototype.destroy = function(query, callback) {
	    var _ref;
	    if (arguments.length === 1) {
	      _ref = [{}, query], query = _ref[0], callback = _ref[1];
	    }
	    return this.model_type.each(_.extend({
	      $each: {
	        limit: DESTROY_BATCH_LIMIT,
	        json: true
	      }
	    }, query), ((function(_this) {
	      return function(model_json, callback) {
	        return Utils.patchRemoveByJSON(_this.model_type, model_json, function(err) {
	          if (!err) {
	            delete _this.store[model_json[_this.model_type.prototype.idAttribute]];
	          }
	          return callback(err);
	        });
	      };
	    })(this)), callback);
	  };

	  return MemorySync;

	})();

	module.exports = function(type) {
	  var model_type, sync, sync_fn;
	  if (Utils.isCollection(new type())) {
	    model_type = Utils.configureCollectionModelType(type, module.exports);
	    return type.prototype.sync = model_type.prototype.sync;
	  }
	  sync = new MemorySync(type);
	  type.prototype.sync = sync_fn = function(method, model, options) {
	    if (options == null) {
	      options = {};
	    }
	    sync.initialize();
	    if (method === 'createSync') {
	      return module.exports.apply(null, Array.prototype.slice.call(arguments, 1));
	    }
	    if (method === 'sync') {
	      return sync;
	    }
	    if (method === 'isRemote') {
	      return false;
	    }
	    if (method === 'schema') {
	      return sync.schema;
	    }
	    if (method === 'tableName') {
	      return void 0;
	    }
	    if (sync[method]) {
	      return sync[method].apply(sync, Array.prototype.slice.call(arguments, 1));
	    } else {
	      return void 0;
	    }
	  };
	  Utils.configureModelType(type);
	  return BackboneORM.model_cache.configureSync(type, sync_fn);
	};

	module.exports.Sync = MemorySync;

	module.exports.Cursor = MemoryCursor;

	module.exports.capabilities = function(url) {
	  return CAPABILITIES;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var ALL_CONVENTIONS, BackboneORM, configure, _;

	_ = __webpack_require__(1);

	BackboneORM = __webpack_require__(4);

	ALL_CONVENTIONS = {
	  "default": __webpack_require__(21),
	  underscore: __webpack_require__(21),
	  camelize: __webpack_require__(22),
	  classify: __webpack_require__(23)
	};

	BackboneORM.naming_conventions = ALL_CONVENTIONS["default"];

	BackboneORM.model_cache = new (__webpack_require__(24))();

	module.exports = configure = function(options) {
	  var convention, key, value, _results;
	  if (options == null) {
	    options = {};
	  }
	  _results = [];
	  for (key in options) {
	    value = options[key];
	    switch (key) {
	      case 'model_cache':
	        _results.push(BackboneORM.model_cache.configure(options.model_cache));
	        break;
	      case 'naming_conventions':
	        if (_.isString(value)) {
	          if (convention = ALL_CONVENTIONS[value]) {
	            BackboneORM.naming_conventions = convention;
	            continue;
	          }
	          _results.push(console.log("BackboneORM configure: could not find naming_conventions: " + value + ". Available: " + (_.keys(ALL_CONVENTIONS).join(', '))));
	        } else {
	          _results.push(BackboneORM.naming_conventions = value);
	        }
	        break;
	      default:
	        _results.push(BackboneORM[key] = value);
	    }
	  }
	  return _results;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var Backbone, BackboneORM, DatabaseURL, JSONUtils, Queue, URL, Utils, modelExtensions, _,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	URL = __webpack_require__(18);

	Backbone = __webpack_require__(2);

	_ = __webpack_require__(1);

	BackboneORM = __webpack_require__(4);

	DatabaseURL = __webpack_require__(11);

	Queue = __webpack_require__(10);

	JSONUtils = __webpack_require__(8);

	modelExtensions = null;

	module.exports = Utils = (function() {
	  function Utils() {}

	  Utils.resetSchemas = function(model_types, options, callback) {
	    var failed_schemas, model_type, queue, _fn, _i, _j, _len, _len1, _ref;
	    if (arguments.length === 2) {
	      _ref = [{}, options], options = _ref[0], callback = _ref[1];
	    }
	    for (_i = 0, _len = model_types.length; _i < _len; _i++) {
	      model_type = model_types[_i];
	      model_type.schema();
	    }
	    failed_schemas = [];
	    queue = new Queue(1);
	    _fn = function(model_type) {
	      return queue.defer(function(callback) {
	        return model_type.resetSchema(options, function(err) {
	          if (err) {
	            failed_schemas.push(model_type.model_name);
	            console.log("Error when dropping schema for " + model_type.model_name + ". " + err);
	          }
	          return callback();
	        });
	      });
	    };
	    for (_j = 0, _len1 = model_types.length; _j < _len1; _j++) {
	      model_type = model_types[_j];
	      _fn(model_type);
	    }
	    return queue.await(function(err) {
	      if (options.verbose) {
	        console.log("" + (model_types.length - failed_schemas.length) + " schemas dropped.");
	      }
	      BackboneORM.model_cache.reset();
	      if (failed_schemas.length) {
	        return callback(new Error("Failed to migrate schemas: " + (failed_schemas.join(', '))));
	      }
	      return callback();
	    });
	  };

	  Utils.debounceCallback = function(callback) {
	    var debounced_callback;
	    return debounced_callback = function() {
	      if (debounced_callback.was_called) {
	        return;
	      }
	      debounced_callback.was_called = true;
	      return callback.apply(null, Array.prototype.slice.call(arguments, 0));
	    };
	  };

	  Utils.bbCallback = function(callback) {
	    return {
	      success: (function(model, resp, options) {
	        return callback(null, model, resp, options);
	      }),
	      error: (function(model, resp, options) {
	        return callback(resp || new Error('Backbone call failed'), model, resp, options);
	      })
	    };
	  };

	  Utils.wrapOptions = function(options, callback) {
	    if (options == null) {
	      options = {};
	    }
	    if (_.isFunction(options)) {
	      options = Utils.bbCallback(options);
	    }
	    return _.defaults(Utils.bbCallback(function(err, model, resp, modified_options) {
	      return callback(err, model, resp, options);
	    }), options);
	  };

	  Utils.isModel = function(obj) {
	    return obj && obj.attributes && ((obj instanceof Backbone.Model) || (obj.parse && obj.fetch));
	  };

	  Utils.isCollection = function(obj) {
	    return obj && obj.models && ((obj instanceof Backbone.Collection) || (obj.reset && obj.fetch));
	  };

	  Utils.get = function(model, key, default_value) {
	    model._orm || (model._orm = {});
	    if (model._orm.hasOwnProperty(key)) {
	      return model._orm[key];
	    } else {
	      return default_value;
	    }
	  };

	  Utils.set = function(model, key, value) {
	    model._orm || (model._orm = {});
	    model._orm[key] = value;
	    return model._orm[key];
	  };

	  Utils.orSet = function(model, key, value) {
	    model._orm || (model._orm = {});
	    if (!model._orm.hasOwnProperty(key)) {
	      model._orm[key] = value;
	    }
	    return model._orm[key];
	  };

	  Utils.unset = function(model, key) {
	    model._orm || (model._orm = {});
	    return delete model._orm[key];
	  };

	  Utils.findOrGenerateModelName = function(model_type) {
	    var model_name, url;
	    if (model_type.prototype.model_name) {
	      return model_type.prototype.model_name;
	    }
	    if (url = _.result(new model_type, 'url')) {
	      if (model_name = (new DatabaseURL(url)).modelName()) {
	        return model_name;
	      }
	    }
	    if (model_type.name) {
	      return model_type.name;
	    }
	    throw "Could not find or generate model name for " + model_type;
	  };

	  Utils.configureCollectionModelType = function(type, sync) {
	    var ORMModel, modelURL, model_type;
	    modelURL = function() {
	      var url, url_parts;
	      url = _.result(this.collection || type.prototype, 'url');
	      if (!this.isNew()) {
	        url_parts = URL.parse(url);
	        url_parts.pathname = "" + url_parts.pathname + "/encodeURIComponent(@id)";
	        url = URL.format(url_parts);
	      }
	      return url;
	    };
	    model_type = type.prototype.model;
	    if (!model_type || (model_type === Backbone.Model)) {
	      ORMModel = (function(_super) {
	        __extends(ORMModel, _super);

	        function ORMModel() {
	          return ORMModel.__super__.constructor.apply(this, arguments);
	        }

	        ORMModel.prototype.url = modelURL;

	        ORMModel.prototype.schema = type.prototype.schema;

	        ORMModel.prototype.sync = sync(ORMModel);

	        return ORMModel;

	      })(Backbone.Model);
	      return type.prototype.model = ORMModel;
	    } else if (model_type.prototype.sync === Backbone.Model.prototype.sync) {
	      model_type.prototype.url = modelURL;
	      model_type.prototype.schema = type.prototype.schema;
	      model_type.prototype.sync = sync(model_type);
	    }
	    return model_type;
	  };

	  Utils.configureModelType = function(type) {
	    modelExtensions || (modelExtensions = __webpack_require__(27));
	    return modelExtensions(type);
	  };

	  Utils.patchRemoveByJSON = function(model_type, model_json, callback) {
	    var key, queue, relation, schema, _fn, _i, _len;
	    if (!(schema = model_type.schema())) {
	      return callback();
	    }
	    queue = new Queue(1);
	    _fn = function(relation) {
	      return queue.defer(function(callback) {
	        return relation.patchRemove(model_json, callback);
	      });
	    };
	    for (relation = _i = 0, _len = schema.length; _i < _len; relation = ++_i) {
	      key = schema[relation];
	      _fn(relation);
	    }
	    return queue.await(callback);
	  };

	  Utils.presaveBelongsToRelationships = function(model, callback) {
	    var key, queue, related_model, related_models, relation, schema, value, _fn, _i, _len, _ref;
	    if (!model.schema) {
	      return callback();
	    }
	    queue = new Queue(1);
	    schema = model.schema();
	    _ref = schema.relations;
	    for (key in _ref) {
	      relation = _ref[key];
	      if (relation.type !== 'belongsTo' || relation.isVirtual() || !(value = model.get(key))) {
	        continue;
	      }
	      related_models = value.models ? value.models : [value];
	      _fn = (function(_this) {
	        return function(related_model) {
	          return queue.defer(function(callback) {
	            return related_model.save(callback);
	          });
	        };
	      })(this);
	      for (_i = 0, _len = related_models.length; _i < _len; _i++) {
	        related_model = related_models[_i];
	        if (related_model.id) {
	          continue;
	        }
	        _fn(related_model);
	      }
	    }
	    return queue.await(callback);
	  };

	  Utils.dataId = function(data) {
	    if (_.isObject(data)) {
	      return data.id;
	    } else {
	      return data;
	    }
	  };

	  Utils.dataIsSameModel = function(data1, data2) {
	    if (Utils.dataId(data1) || Utils.dataId(data2)) {
	      return Utils.dataId(data1) === Utils.dataId(data2);
	    }
	    return _.isEqual(data1, data2);
	  };

	  Utils.dataToModel = function(data, model_type) {
	    var attributes, item, model;
	    if (!data) {
	      return null;
	    }
	    if (_.isArray(data)) {
	      return (function() {
	        var _i, _len, _results;
	        _results = [];
	        for (_i = 0, _len = data.length; _i < _len; _i++) {
	          item = data[_i];
	          _results.push(Utils.dataToModel(item, model_type));
	        }
	        return _results;
	      })();
	    }
	    if (Utils.isModel(data)) {
	      model = data;
	    } else if (Utils.dataId(data) !== data) {
	      model = new model_type(model_type.prototype.parse(data));
	    } else {
	      (attributes = {})[model_type.prototype.idAttribute] = data;
	      model = new model_type(attributes);
	      model.setLoaded(false);
	    }
	    return model;
	  };

	  Utils.updateModel = function(model, data) {
	    if (!data || (model === data) || data._orm_needs_load) {
	      return model;
	    }
	    if (Utils.isModel(data)) {
	      data = data.toJSON();
	    }
	    if (Utils.dataId(data) !== data) {
	      model.setLoaded(true);
	      model.set(data);
	    }
	    return model;
	  };

	  Utils.updateOrNew = function(data, model_type) {
	    var cache, id, model;
	    if ((cache = model_type.cache) && (id = Utils.dataId(data))) {
	      if (model = cache.get(id)) {
	        Utils.updateModel(model, data);
	      }
	    }
	    if (!model) {
	      model = Utils.isModel(data) ? data : Utils.dataToModel(data, model_type);
	      if (model && cache) {
	        cache.set(model.id, model);
	      }
	    }
	    return model;
	  };

	  Utils.modelJSONSave = function(model_json, model_type, callback) {
	    var model;
	    model = new Backbone.Model(model_json);
	    model._orm_never_cache = true;
	    model.urlRoot = (function(_this) {
	      return function() {
	        var e, url;
	        try {
	          url = _.result(new model_type, 'url');
	        } catch (_error) {
	          e = _error;
	        }
	        return url;
	      };
	    })(this);
	    return model_type.prototype.sync('update', model, Utils.bbCallback(callback));
	  };

	  Utils.isSorted = function(models, fields) {
	    var last_model, model, _i, _len;
	    fields = _.uniq(fields);
	    for (_i = 0, _len = models.length; _i < _len; _i++) {
	      model = models[_i];
	      if (last_model && this.fieldCompare(last_model, model, fields) === 1) {
	        return false;
	      }
	      last_model = model;
	    }
	    return true;
	  };

	  Utils.fieldCompare = function(model, other_model, fields) {
	    var desc, field;
	    field = fields[0];
	    if (_.isArray(field)) {
	      field = field[0];
	    }
	    if (field.charAt(0) === '-') {
	      field = field.substr(1);
	      desc = true;
	    }
	    if (model.get(field) === other_model.get(field)) {
	      if (fields.length > 1) {
	        return this.fieldCompare(model, other_model, fields.splice(1));
	      } else {
	        return 0;
	      }
	    }
	    if (desc) {
	      if (model.get(field) < other_model.get(field)) {
	        return 1;
	      } else {
	        return -1;
	      }
	    } else {
	      if (model.get(field) > other_model.get(field)) {
	        return 1;
	      } else {
	        return -1;
	      }
	    }
	  };

	  Utils.jsonFieldCompare = function(model, other_model, fields) {
	    var desc, field;
	    field = fields[0];
	    if (_.isArray(field)) {
	      field = field[0];
	    }
	    if (field.charAt(0) === '-') {
	      field = field.substr(1);
	      desc = true;
	    }
	    if (model[field] === other_model[field]) {
	      if (fields.length > 1) {
	        return this.jsonFieldCompare(model, other_model, fields.splice(1));
	      } else {
	        return 0;
	      }
	    }
	    if (desc) {
	      if (JSONUtils.stringify(model[field]) < JSONUtils.stringify(other_model[field])) {
	        return 1;
	      } else {
	        return -1;
	      }
	    } else {
	      if (JSONUtils.stringify(model[field]) > JSONUtils.stringify(other_model[field])) {
	        return 1;
	      } else {
	        return -1;
	      }
	    }
	  };

	  return Utils;

	})();


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var JSONUtils, Queue, Utils, _;

	_ = __webpack_require__(1);

	Queue = __webpack_require__(10);

	Utils = __webpack_require__(7);

	module.exports = JSONUtils = (function() {
	  function JSONUtils() {}

	  JSONUtils.stringify = function(json) {
	    var err;
	    try {
	      return JSON.stringify(json);
	    } catch (_error) {
	      err = _error;
	      return 'Failed to stringify';
	    }
	  };

	  JSONUtils.parseParams = function(params) {
	    var key, result, value;
	    result = {};
	    for (key in params) {
	      value = params[key];
	      result[key] = JSON.parse(value);
	    }
	    return result;
	  };

	  JSONUtils.parse = function(values, model_type) {
	    var date, key, match, parsed_values, result, value;
	    if (_.isNull(values) || (values === 'null')) {
	      return null;
	    }
	    if (_.isDate(values)) {
	      return values;
	    }
	    if (_.isArray(values)) {
	      return (function() {
	        var _i, _len, _results;
	        _results = [];
	        for (_i = 0, _len = values.length; _i < _len; _i++) {
	          value = values[_i];
	          _results.push(JSONUtils.parse(value));
	        }
	        return _results;
	      })();
	    }
	    if (_.isObject(values)) {
	      result = {};
	      for (key in values) {
	        value = values[key];
	        result[key] = JSONUtils.parse(value);
	        if (!(_.isString(result[key]) && result[key].length)) {
	          continue;
	        }
	        if (key[0] === '$') {
	          if (!_.isNaN(value = +result[key])) {
	            result[key] = value;
	          }
	        } else if ((model_type != null ? model_type.schema().idType(key) : void 0) === 'Integer') {
	          if (_.isNaN(value = +result[key])) {
	            console.log("Warning: failed to convert '" + key + "' type to integer. Model: " + model_type.model_name + " value: " + result[key]);
	            continue;
	          }
	          result[key] = value;
	        }
	      }
	      return result;
	    } else if (_.isString(values)) {
	      if ((values.length >= 20) && values[values.length - 1] === 'Z') {
	        if (_.isNaN((date = new Date(values)).getTime())) {
	          return values;
	        } else {
	          return date;
	        }
	      }
	      if (values === 'true') {
	        return true;
	      }
	      if (values === 'false') {
	        return false;
	      }
	      if (match = /^\"(.*)\"$/.exec(values)) {
	        return match[0];
	      }
	      if (values[0] === '{' || values[0] === '[') {
	        try {
	          if (parsed_values = JSON.parse(values)) {
	            return JSONUtils.parse(parsed_values);
	          }
	        } catch (_error) {}
	      }
	    }
	    return values;
	  };

	  JSONUtils.toQuery = function(values, depth) {
	    var key, result, value;
	    if (depth == null) {
	      depth = 0;
	    }
	    if (_.isNull(values)) {
	      return 'null';
	    }
	    if (_.isArray(values)) {
	      return JSONUtils.stringify(values);
	    }
	    if (_.isDate(values) || values.toJSON) {
	      return values.toJSON();
	    }
	    if (_.isObject(values)) {
	      if (depth > 0) {
	        return JSONUtils.stringify(values);
	      }
	      result = {};
	      for (key in values) {
	        value = values[key];
	        result[key] = JSONUtils.toQuery(value, 1);
	      }
	      return result;
	    }
	    return values;
	  };

	  JSONUtils.renderTemplate = function(models, template, options, callback) {
	    var model, queue, results, _fn, _i, _len;
	    if (arguments.length === 3) {
	      callback = options;
	      options = {};
	    }
	    if (!_.isArray(models)) {
	      if (!models) {
	        return callback(null, null);
	      }
	      if (_.isString(template)) {
	        return JSONUtils.renderKey(models, template, options, callback);
	      }
	      if (_.isArray(template)) {
	        return JSONUtils.renderKeys(models, template, options, callback);
	      }
	      if (_.isFunction(template)) {
	        return template(models, options, callback);
	      }
	      return JSONUtils.renderDSL(models, template, options, callback);
	    } else {
	      results = [];
	      queue = new Queue(1);
	      _fn = function(model) {
	        return queue.defer(function(callback) {
	          return JSONUtils.renderTemplate(model, template, options, function(err, related_json) {
	            if (err) {
	              return callback(err);
	            }
	            results.push(related_json);
	            return callback();
	          });
	        });
	      };
	      for (_i = 0, _len = models.length; _i < _len; _i++) {
	        model = models[_i];
	        _fn(model);
	      }
	      return queue.await(function(err) {
	        return callback(err, err ? void 0 : results);
	      });
	    }
	  };

	  JSONUtils.renderDSL = function(model, dsl, options, callback) {
	    var args, key, queue, result, _fn;
	    if (arguments.length === 3) {
	      callback = options;
	      options = {};
	    }
	    queue = new Queue();
	    result = {};
	    _fn = function(key, args) {
	      return queue.defer(function(callback) {
	        var field, fn_args, query, relation, template;
	        field = args.key || key;
	        if (relation = model.relation(field)) {
	          if (args.query) {
	            query = args.query;
	            template = args.template;
	          } else if (args.$count) {
	            query = _.clone(args);
	            delete query.key;
	          } else if (_.isFunction(args)) {
	            template = args;
	          } else if (args.template) {
	            if (_.isObject(args.template) && !_.isFunction(args.template)) {
	              query = args.template;
	            } else {
	              template = args.template;
	              query = _.clone(args);
	              delete query.key;
	              delete query.template;
	              if (_.size(query) === 0) {
	                query = null;
	              }
	            }
	          } else {
	            template = _.clone(args);
	            delete template.key;
	          }
	          if (template) {
	            if (query) {
	              return relation.cursor(model, field, query).toModels(function(err, models) {
	                if (err) {
	                  return callback(err);
	                }
	                return JSONUtils.renderTemplate(models, template, options, function(err, json) {
	                  result[key] = json;
	                  return callback(err);
	                });
	              });
	            } else {
	              return model.get(field, function(err, related_model) {
	                if (err) {
	                  return callback(err);
	                }
	                return JSONUtils.renderTemplate(related_model, template, options, function(err, json) {
	                  result[key] = json;
	                  return callback(err);
	                });
	              });
	            }
	          } else {
	            return relation.cursor(model, field, query).toJSON(function(err, json) {
	              result[key] = json;
	              return callback(err);
	            });
	          }
	        } else {
	          if (key.length > 1 && key[key.length - 1] === '_') {
	            key = key.slice(0, +(key.length - 2) + 1 || 9e9);
	          }
	          if (key === '$select') {
	            if (_.isString(args)) {
	              return JSONUtils.renderKey(model, args, options, function(err, json) {
	                result[args] = json;
	                return callback(err);
	              });
	            } else {
	              return JSONUtils.renderKeys(model, args, options, function(err, json) {
	                _.extend(result, json);
	                return callback(err);
	              });
	            }
	          } else if (_.isString(args)) {
	            return JSONUtils.renderKey(model, args, options, function(err, json) {
	              result[key] = json;
	              return callback(err);
	            });
	          } else if (_.isFunction(args)) {
	            return args(model, options, function(err, json) {
	              result[key] = json;
	              return callback(err);
	            });
	          } else if (_.isString(args.method)) {
	            fn_args = _.isArray(args.args) ? args.args.slice() : (args.args ? [args.args] : []);
	            fn_args.push(function(err, json) {
	              result[key] = json;
	              return callback(err);
	            });
	            return model[args.method].apply(model, fn_args);
	          } else {
	            console.trace("Unknown DSL action: " + key + ": ", args);
	            return callback(new Error("Unknown DSL action: " + key + ": ", args));
	          }
	        }
	      });
	    };
	    for (key in dsl) {
	      args = dsl[key];
	      _fn(key, args);
	    }
	    return queue.await(function(err) {
	      return callback(err, err ? void 0 : result);
	    });
	  };

	  JSONUtils.renderKeys = function(model, keys, options, callback) {
	    var key, queue, result, _fn, _i, _len;
	    if (arguments.length === 3) {
	      callback = options;
	      options = {};
	    }
	    result = {};
	    queue = new Queue();
	    _fn = function(key) {
	      return queue.defer(function(callback) {
	        return JSONUtils.renderKey(model, key, options, function(err, value) {
	          if (err) {
	            return callback(err);
	          }
	          result[key] = value;
	          return callback();
	        });
	      });
	    };
	    for (_i = 0, _len = keys.length; _i < _len; _i++) {
	      key = keys[_i];
	      _fn(key);
	    }
	    return queue.await(function(err) {
	      return callback(err, err ? void 0 : result);
	    });
	  };

	  JSONUtils.renderKey = function(model, key, options, callback) {
	    if (arguments.length === 3) {
	      callback = options;
	      options = {};
	    }
	    return model.get(key, function(err, value) {
	      var item;
	      if (err) {
	        return callback(err);
	      }
	      if (model.relation(key)) {
	        if (_.isArray(value)) {
	          return callback(null, (function() {
	            var _i, _len, _results;
	            _results = [];
	            for (_i = 0, _len = value.length; _i < _len; _i++) {
	              item = value[_i];
	              _results.push(item.toJSON());
	            }
	            return _results;
	          })());
	        }
	        if (value && value.toJSON) {
	          return callback(null, value = value.toJSON());
	        }
	      }
	      return callback(null, value);
	    });
	  };

	  JSONUtils.renderRelated = function(models, attribute_name, template, options, callback) {
	    var model, queue, results, _fn, _i, _len;
	    if (arguments.length === 4) {
	      callback = options;
	      options = {};
	    }
	    if (!_.isArray(models)) {
	      return models.get(attribute_name, function(err, related_models) {
	        if (err) {
	          callback(err);
	        }
	        return JSONUtils.renderTemplate(related_models, template, options, callback);
	      });
	    } else {
	      results = [];
	      queue = new Queue();
	      _fn = function(model) {
	        return queue.defer(function(callback) {
	          return model.get(attribute_name, function(err, related_models) {
	            if (err) {
	              callback(err);
	            }
	            return JSONUtils.renderTemplate(related_models, template, options, function(err, related_json) {
	              if (err) {
	                return callback(err);
	              }
	              results.push(related_json);
	              return callback();
	            });
	          });
	        });
	      };
	      for (_i = 0, _len = models.length; _i < _len; _i++) {
	        model = models[_i];
	        _fn(model);
	      }
	      return queue.await(function(err) {
	        return callback(err, err ? void 0 : results);
	      });
	    }
	  };

	  JSONUtils.deepClone = function(obj, depth) {
	    var clone, key;
	    if (!obj || (typeof obj !== 'object')) {
	      return obj;
	    }
	    if (_.isString(obj)) {
	      return String.prototype.slice.call(obj);
	    }
	    if (_.isDate(obj)) {
	      return new Date(obj.getTime());
	    }
	    if (_.isFunction(obj.clone)) {
	      return obj.clone();
	    }
	    if (_.isArray(obj)) {
	      clone = Array.prototype.slice.call(obj);
	    } else if (obj.constructor !== {}.constructor) {
	      return obj;
	    } else {
	      clone = _.extend({}, obj);
	    }
	    if (!_.isUndefined(depth) && (depth > 0)) {
	      for (key in clone) {
	        clone[key] = JSONUtils.deepClone(clone[key], depth - 1);
	      }
	    }
	    return clone;
	  };

	  return JSONUtils;

	})();


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var DateUtils, UNITS_TO_MS, _;

	_ = __webpack_require__(1);

	UNITS_TO_MS = {
	  milliseconds: {
	    milliseconds: 1
	  },
	  seconds: {
	    milliseconds: 1000
	  },
	  minutes: {
	    milliseconds: 60 * 1000
	  },
	  hours: {
	    milliseconds: 24 * 60 * 1000
	  },
	  days: {
	    days: 1
	  },
	  weeks: {
	    days: 7
	  },
	  months: {
	    months: 1
	  },
	  years: {
	    years: 1
	  }
	};

	module.exports = DateUtils = (function() {
	  function DateUtils() {}

	  DateUtils.durationAsMilliseconds = function(count, units) {
	    var lookup;
	    if (!(lookup = UNITS_TO_MS[units])) {
	      throw new Error("DateUtils.durationAsMilliseconds :Unrecognized units: " + units);
	    }
	    if (lookup.milliseconds) {
	      return count * lookup.milliseconds;
	    }
	    if (lookup.days) {
	      return count * 864e5 * lookup.days;
	    }
	    if (lookup.months) {
	      return count * lookup.months * 2592e6;
	    }
	    if (lookup.years) {
	      return count * lookup.years * 31536e6;
	    }
	  };

	  DateUtils.isBefore = function(mv, tv) {
	    return mv.getTime() < tv.getTime();
	  };

	  DateUtils.isAfter = function(mv, tv) {
	    return mv.getTime() > tv.getTime();
	  };

	  return DateUtils;

	})();


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var Queue,
	  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	module.exports = Queue = (function() {
	  function Queue(parallelism) {
	    this.parallelism = parallelism;
	    this._doneTask = __bind(this._doneTask, this);
	    this.parallelism || (this.parallelism = Infinity);
	    this.tasks = [];
	    this.running_count = 0;
	    this.error = null;
	    this.await_callback = null;
	  }

	  Queue.prototype.defer = function(callback) {
	    this.tasks.push(callback);
	    return this._runTasks();
	  };

	  Queue.prototype.await = function(callback) {
	    if (this.await_callback) {
	      throw new Error("Awaiting callback was added twice: " + callback);
	    }
	    this.await_callback = callback;
	    if (this.error || !(this.tasks.length + this.running_count)) {
	      return this._callAwaiting();
	    }
	  };

	  Queue.prototype._doneTask = function(err) {
	    this.running_count--;
	    this.error || (this.error = err);
	    return this._runTasks();
	  };

	  Queue.prototype._runTasks = function() {
	    var current;
	    if (this.error || !(this.tasks.length + this.running_count)) {
	      return this._callAwaiting();
	    }
	    while (this.running_count < this.parallelism) {
	      if (!this.tasks.length) {
	        return;
	      }
	      current = this.tasks.shift();
	      this.running_count++;
	      current(this._doneTask);
	    }
	  };

	  Queue.prototype._callAwaiting = function() {
	    if (this.await_called || !this.await_callback) {
	      return;
	    }
	    this.await_called = true;
	    return this.await_callback(this.error);
	  };

	  return Queue;

	})();


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var BackboneORM, DatabaseURL, SUPPORTED_KEYS, URL, _;

	_ = __webpack_require__(1);

	URL = __webpack_require__(18);

	BackboneORM = __webpack_require__(4);

	SUPPORTED_KEYS = ['protocol', 'slashes', 'auth', 'host', 'hostname', 'port', 'search', 'query', 'hash', 'href'];

	module.exports = DatabaseURL = (function() {
	  function DatabaseURL(url, parse_query_string, slashes_denote_host) {
	    var database, database_parts, databases, databases_string, host, key, parts, path_paths, start_parts, start_url, url_parts, _i, _j, _k, _len, _len1, _len2, _ref;
	    url_parts = URL.parse(url, parse_query_string, slashes_denote_host);
	    parts = url_parts.pathname.split(',');
	    if (parts.length > 1) {
	      start_parts = _.pick(url_parts, 'protocol', 'auth', 'slashes');
	      start_parts.host = '{1}';
	      start_parts.pathname = '{2}';
	      start_url = URL.format(start_parts);
	      start_url = start_url.replace('{1}/{2}', '');
	      path_paths = url_parts.pathname.split('/');
	      url_parts.pathname = "/" + path_paths[path_paths.length - 2] + "/" + path_paths[path_paths.length - 1];
	      databases_string = url.replace(start_url, '');
	      databases_string = databases_string.substring(0, databases_string.indexOf(url_parts.pathname));
	      databases = databases_string.split(',');
	      _ref = ['host', 'hostname', 'port'];
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        key = _ref[_i];
	        delete url_parts[key];
	      }
	      this.hosts = [];
	      for (_j = 0, _len1 = databases.length; _j < _len1; _j++) {
	        database = databases[_j];
	        host = database.split(':');
	        this.hosts.push(host.length === 1 ? {
	          host: host[0],
	          hostname: host[0]
	        } : {
	          host: host[0],
	          hostname: "" + host[0] + ":" + host[1],
	          port: host[1]
	        });
	      }
	    }
	    database_parts = url_parts.pathname.split('/');
	    this.table = database_parts.pop();
	    this.database = database_parts[database_parts.length - 1];
	    for (_k = 0, _len2 = SUPPORTED_KEYS.length; _k < _len2; _k++) {
	      key = SUPPORTED_KEYS[_k];
	      if (url_parts.hasOwnProperty(key)) {
	        this[key] = url_parts[key];
	      }
	    }
	  }

	  DatabaseURL.prototype.format = function(options) {
	    var host_strings, url, url_parts;
	    if (options == null) {
	      options = {};
	    }
	    url_parts = _.pick(this, SUPPORTED_KEYS);
	    url_parts.pathname = '';
	    if (this.hosts) {
	      host_strings = _.map(this.hosts, function(host) {
	        return "" + host.host + (host.port ? ':' + host.port : '');
	      });
	      url_parts.pathname += host_strings.join(',');
	      url_parts.host = "{1}";
	    }
	    if (this.database) {
	      url_parts.pathname += "/" + this.database;
	    }
	    if (this.table && !options.exclude_table) {
	      url_parts.pathname += "/" + this.table;
	    }
	    if (options.exclude_search || options.exclude_query) {
	      delete url_parts.search;
	      delete url_parts.query;
	    }
	    url = URL.format(url_parts);
	    if (this.hosts) {
	      url = url.replace("{1}/" + url_parts.pathname, url_parts.pathname);
	    }
	    return url;
	  };

	  DatabaseURL.prototype.parseAuth = function() {
	    var auth_parts, result;
	    if (!this.auth) {
	      return null;
	    }
	    auth_parts = this.auth.split(':');
	    result = {
	      user: auth_parts[0]
	    };
	    result.password = auth_parts.length > 1 ? auth_parts[1] : null;
	    return result;
	  };

	  DatabaseURL.prototype.modelName = function() {
	    if (this.table) {
	      return BackboneORM.naming_conventions.modelName(this.table, false);
	    } else {
	      return null;
	    }
	  };

	  return DatabaseURL;

	})();


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var Fabricator, Queue, _;

	_ = __webpack_require__(1);

	Queue = __webpack_require__(10);

	module.exports = Fabricator = (function() {
	  function Fabricator() {}

	  Fabricator["new"] = function(model_type, count, attributes_info) {
	    var attributes, key, results, value;
	    results = [];
	    while (count-- > 0) {
	      attributes = {};
	      for (key in attributes_info) {
	        value = attributes_info[key];
	        attributes[key] = _.isFunction(value) ? value() : value;
	      }
	      results.push(new model_type(attributes));
	    }
	    return results;
	  };

	  Fabricator.create = function(model_type, count, attributes_info, callback) {
	    var model, models, queue, _fn, _i, _len;
	    models = Fabricator["new"](model_type, count, attributes_info);
	    queue = new Queue();
	    _fn = function(model) {
	      return queue.defer(function(callback) {
	        return model.save(callback);
	      });
	    };
	    for (_i = 0, _len = models.length; _i < _len; _i++) {
	      model = models[_i];
	      _fn(model);
	    }
	    return queue.await(function(err) {
	      return callback(err, models);
	    });
	  };

	  Fabricator.value = function(value) {
	    if (arguments.length === 0) {
	      return void 0;
	    }
	    return function() {
	      return value;
	    };
	  };

	  Fabricator.uniqueId = function(prefix) {
	    if (arguments.length === 0) {
	      return _.uniqueId();
	    }
	    return function() {
	      return _.uniqueId(prefix);
	    };
	  };

	  Fabricator.uniqueString = Fabricator.uniqueId;

	  Fabricator.date = function(start, step_ms) {
	    var current_ms, now, _ref;
	    now = new Date();
	    if (arguments.length === 0) {
	      return now;
	    }
	    if (arguments.length === 1) {
	      _ref = [now, start], start = _ref[0], step_ms = _ref[1];
	    }
	    current_ms = start.getTime();
	    return function() {
	      var current;
	      current = new Date(current_ms);
	      current_ms += step_ms;
	      return current;
	    };
	  };

	  return Fabricator;

	})();


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var CURSOR_KEYS, Cursor, Utils, _,
	  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	_ = __webpack_require__(1);

	Utils = __webpack_require__(7);

	CURSOR_KEYS = ['$count', '$exists', '$zero', '$one', '$offset', '$limit', '$page', '$sort', '$white_list', '$select', '$include', '$values', '$ids', '$or'];

	module.exports = Cursor = (function() {
	  function Cursor(query, options) {
	    this.relatedModelTypesInQuery = __bind(this.relatedModelTypesInQuery, this);
	    var key, parsed_query, value, _i, _len, _ref;
	    for (key in options) {
	      value = options[key];
	      this[key] = value;
	    }
	    parsed_query = Cursor.parseQuery(query, this.model_type);
	    this._find = parsed_query.find;
	    this._cursor = parsed_query.cursor;
	    _ref = ['$white_list', '$select', '$values'];
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      key = _ref[_i];
	      if (this._cursor[key] && !_.isArray(this._cursor[key])) {
	        this._cursor[key] = [this._cursor[key]];
	      }
	    }
	  }

	  Cursor.validateQuery = function(query, memo, model_type) {
	    var full_key, key, value, _results;
	    _results = [];
	    for (key in query) {
	      value = query[key];
	      if (!(_.isUndefined(value) || _.isObject(value))) {
	        continue;
	      }
	      full_key = memo ? "" + memo + "." + key : key;
	      if (_.isUndefined(value)) {
	        throw new Error("Unexpected undefined for query key '" + full_key + "' on " + (model_type != null ? model_type.model_name : void 0));
	      }
	      if (_.isObject(value)) {
	        _results.push(Cursor.validateQuery(value, full_key, model_type));
	      } else {
	        _results.push(void 0);
	      }
	    }
	    return _results;
	  };

	  Cursor.parseQuery = function(query, model_type) {
	    var e, key, parsed_query, value;
	    if (!query) {
	      return {
	        find: {},
	        cursor: {}
	      };
	    } else if (!_.isObject(query)) {
	      return {
	        find: {
	          id: query
	        },
	        cursor: {
	          $one: true
	        }
	      };
	    } else if (query.find || query.cursor) {
	      return {
	        find: query.find || {},
	        cursor: query.cursor || {}
	      };
	    } else {
	      try {
	        Cursor.validateQuery(query, null, model_type);
	      } catch (_error) {
	        e = _error;
	        throw new Error("Error: " + e + ". Query: ", query);
	      }
	      parsed_query = {
	        find: {},
	        cursor: {}
	      };
	      for (key in query) {
	        value = query[key];
	        if (key[0] !== '$') {
	          parsed_query.find[key] = value;
	        } else {
	          parsed_query.cursor[key] = value;
	        }
	      }
	      return parsed_query;
	    }
	  };

	  Cursor.prototype.offset = function(offset) {
	    this._cursor.$offset = offset;
	    return this;
	  };

	  Cursor.prototype.limit = function(limit) {
	    this._cursor.$limit = limit;
	    return this;
	  };

	  Cursor.prototype.sort = function(sort) {
	    this._cursor.$sort = sort;
	    return this;
	  };

	  Cursor.prototype.whiteList = function(args) {
	    var keys;
	    keys = _.flatten(arguments);
	    this._cursor.$white_list = this._cursor.$white_list ? _.intersection(this._cursor.$white_list, keys) : keys;
	    return this;
	  };

	  Cursor.prototype.select = function(args) {
	    var keys;
	    keys = _.flatten(arguments);
	    this._cursor.$select = this._cursor.$select ? _.intersection(this._cursor.$select, keys) : keys;
	    return this;
	  };

	  Cursor.prototype.include = function(args) {
	    var keys;
	    keys = _.flatten(arguments);
	    this._cursor.$include = this._cursor.$include ? _.intersection(this._cursor.$include, keys) : keys;
	    return this;
	  };

	  Cursor.prototype.values = function(args) {
	    var keys;
	    keys = _.flatten(arguments);
	    this._cursor.$values = this._cursor.$values ? _.intersection(this._cursor.$values, keys) : keys;
	    return this;
	  };

	  Cursor.prototype.ids = function() {
	    this._cursor.$values = ['id'];
	    return this;
	  };

	  Cursor.prototype.count = function(callback) {
	    return this.execWithCursorQuery('$count', 'toJSON', callback);
	  };

	  Cursor.prototype.exists = function(callback) {
	    return this.execWithCursorQuery('$exists', 'toJSON', callback);
	  };

	  Cursor.prototype.toModel = function(callback) {
	    return this.execWithCursorQuery('$one', 'toModels', callback);
	  };

	  Cursor.prototype.toModels = function(callback) {
	    if (this._cursor.$values) {
	      return callback(new Error("Cannot call toModels on cursor with values for model " + this.model_type.model_name + ". Values: " + (JSONUtils.stringify(this._cursor.$values))));
	    }
	    return this.toJSON((function(_this) {
	      return function(err, json) {
	        if (err) {
	          return callback(err);
	        }
	        if (_this._cursor.$one && !json) {
	          return callback(null, null);
	        }
	        if (!_.isArray(json)) {
	          json = [json];
	        }
	        return _this.prepareIncludes(json, function(err, json) {
	          var can_cache, item, model, models;
	          if (can_cache = !(_this._cursor.$select || _this._cursor.$whitelist)) {
	            models = (function() {
	              var _i, _len, _results;
	              _results = [];
	              for (_i = 0, _len = json.length; _i < _len; _i++) {
	                item = json[_i];
	                _results.push(Utils.updateOrNew(item, this.model_type));
	              }
	              return _results;
	            }).call(_this);
	          } else {
	            models = (function() {
	              var _i, _len, _results;
	              _results = [];
	              for (_i = 0, _len = json.length; _i < _len; _i++) {
	                item = json[_i];
	                _results.push((model = new this.model_type(this.model_type.prototype.parse(item)), model.setPartial(true), model));
	              }
	              return _results;
	            }).call(_this);
	          }
	          return callback(null, _this._cursor.$one ? models[0] : models);
	        });
	      };
	    })(this));
	  };

	  Cursor.prototype.toJSON = function(callback) {
	    var model_types, parsed_query;
	    parsed_query = _.extend({}, _.pick(this._cursor, CURSOR_KEYS), this._find);
	    model_types = this.relatedModelTypesInQuery();
	    return this.queryToJSON(callback);
	  };

	  Cursor.prototype.queryToJSON = function(callback) {
	    throw new Error('toJSON must be implemented by a concrete cursor for a Backbone Sync type');
	  };

	  Cursor.prototype.hasCursorQuery = function(key) {
	    return this._cursor[key] || (this._cursor[key] === '');
	  };

	  Cursor.prototype.execWithCursorQuery = function(key, method, callback) {
	    var value;
	    value = this._cursor[key];
	    this._cursor[key] = true;
	    return this[method]((function(_this) {
	      return function(err, json) {
	        if (_.isUndefined(value)) {
	          delete _this._cursor[key];
	        } else {
	          _this._cursor[key] = value;
	        }
	        return callback(err, json);
	      };
	    })(this));
	  };

	  Cursor.prototype.relatedModelTypesInQuery = function() {
	    var key, related_fields, related_model_types, relation, relation_key, reverse_relation, value, _i, _len, _ref, _ref1, _ref2;
	    related_fields = [];
	    related_model_types = [];
	    _ref = this._find;
	    for (key in _ref) {
	      value = _ref[key];
	      if (key.indexOf('.') > 0) {
	        _ref1 = key.split('.'), relation_key = _ref1[0], key = _ref1[1];
	        related_fields.push(relation_key);
	      } else if ((reverse_relation = this.model_type.reverseRelation(key)) && reverse_relation.join_table) {
	        related_model_types.push(reverse_relation.model_type);
	        related_model_types.push(reverse_relation.join_table);
	      }
	    }
	    if ((_ref2 = this._cursor) != null ? _ref2.$include : void 0) {
	      related_fields = related_fields.concat(this._cursor.$include);
	    }
	    for (_i = 0, _len = related_fields.length; _i < _len; _i++) {
	      relation_key = related_fields[_i];
	      if (relation = this.model_type.relation(relation_key)) {
	        related_model_types.push(relation.reverse_model_type);
	        if (relation.join_table) {
	          related_model_types.push(relation.join_table);
	        }
	      }
	    }
	    return related_model_types;
	  };

	  Cursor.prototype.selectResults = function(json) {
	    var $select, $values, item, key;
	    if (this._cursor.$one) {
	      json = json.slice(0, 1);
	    }
	    if (this._cursor.$values) {
	      $values = this._cursor.$white_list ? _.intersection(this._cursor.$values, this._cursor.$white_list) : this._cursor.$values;
	      if (this._cursor.$values.length === 1) {
	        key = this._cursor.$values[0];
	        json = $values.length ? (function() {
	          var _i, _len, _results;
	          _results = [];
	          for (_i = 0, _len = json.length; _i < _len; _i++) {
	            item = json[_i];
	            _results.push(item.hasOwnProperty(key) ? item[key] : null);
	          }
	          return _results;
	        })() : _.map(json, function() {
	          return null;
	        });
	      } else {
	        json = (function() {
	          var _i, _len, _results;
	          _results = [];
	          for (_i = 0, _len = json.length; _i < _len; _i++) {
	            item = json[_i];
	            _results.push((function() {
	              var _j, _len1, _results1;
	              _results1 = [];
	              for (_j = 0, _len1 = $values.length; _j < _len1; _j++) {
	                key = $values[_j];
	                if (item.hasOwnProperty(key)) {
	                  _results1.push(item[key]);
	                }
	              }
	              return _results1;
	            })());
	          }
	          return _results;
	        })();
	      }
	    } else if (this._cursor.$select) {
	      $select = this._cursor.$white_list ? _.intersection(this._cursor.$select, this._cursor.$white_list) : this._cursor.$select;
	      json = (function() {
	        var _i, _len, _results;
	        _results = [];
	        for (_i = 0, _len = json.length; _i < _len; _i++) {
	          item = json[_i];
	          _results.push(_.pick(item, $select));
	        }
	        return _results;
	      })();
	    } else if (this._cursor.$white_list) {
	      json = (function() {
	        var _i, _len, _results;
	        _results = [];
	        for (_i = 0, _len = json.length; _i < _len; _i++) {
	          item = json[_i];
	          _results.push(_.pick(item, this._cursor.$white_list));
	        }
	        return _results;
	      }).call(this);
	    }
	    if (this.hasCursorQuery('$page')) {
	      return json;
	    }
	    if (this._cursor.$one) {
	      return json[0] || null;
	    } else {
	      return json;
	    }
	  };

	  Cursor.prototype.selectFromModels = function(models, callback) {
	    var $select, item, model;
	    if (this._cursor.$select) {
	      $select = this._cursor.$white_list ? _.intersection(this._cursor.$select, this._cursor.$white_list) : this._cursor.$select;
	      models = ((function() {
	        var _i, _len, _results;
	        model = new this.model_type(_.pick(model.attributes, $select));
	        model.setPartial(true);
	        _results = [];
	        for (_i = 0, _len = models.length; _i < _len; _i++) {
	          item = models[_i];
	          _results.push(model);
	        }
	        return _results;
	      }).call(this));
	    } else if (this._cursor.$white_list) {
	      models = ((function() {
	        var _i, _len, _results;
	        model = new this.model_type(_.pick(model.attributes, this._cursor.$white_list));
	        model.setPartial(true);
	        _results = [];
	        for (_i = 0, _len = models.length; _i < _len; _i++) {
	          item = models[_i];
	          _results.push(model);
	        }
	        return _results;
	      }).call(this));
	    }
	    return models;
	  };

	  Cursor.prototype.prepareIncludes = function(json, callback) {
	    var findOrNew, include, item, model_json, related_json, relation, schema, shared_related_models, _i, _j, _len, _len1, _ref;
	    if (!_.isArray(this._cursor.$include) || _.isEmpty(this._cursor.$include)) {
	      return callback(null, json);
	    }
	    schema = this.model_type.schema();
	    shared_related_models = {};
	    findOrNew = (function(_this) {
	      return function(related_json, reverse_model_type) {
	        var related_id;
	        related_id = related_json[reverse_model_type.prototype.idAttribute];
	        if (!shared_related_models[related_id]) {
	          if (reverse_model_type.cache) {
	            if (!(shared_related_models[related_id] = reverse_model_type.cache.get(related_id))) {
	              reverse_model_type.cache.set(related_id, shared_related_models[related_id] = new reverse_model_type(related_json));
	            }
	          } else {
	            shared_related_models[related_id] = new reverse_model_type(related_json);
	          }
	        }
	        return shared_related_models[related_id];
	      };
	    })(this);
	    _ref = this._cursor.$include;
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      include = _ref[_i];
	      relation = schema.relation(include);
	      shared_related_models = {};
	      for (_j = 0, _len1 = json.length; _j < _len1; _j++) {
	        model_json = json[_j];
	        if (_.isArray(related_json = model_json[include])) {
	          model_json[include] = (function() {
	            var _k, _len2, _results;
	            _results = [];
	            for (_k = 0, _len2 = related_json.length; _k < _len2; _k++) {
	              item = related_json[_k];
	              _results.push(findOrNew(item, relation.reverse_model_type));
	            }
	            return _results;
	          })();
	        } else if (related_json) {
	          model_json[include] = findOrNew(related_json, relation.reverse_model_type);
	        }
	      }
	    }
	    return callback(null, json);
	  };

	  return Cursor;

	})();


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var Backbone, BackboneORM, DatabaseURL, Many, One, RELATION_VARIANTS, Schema, Utils, _,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	_ = __webpack_require__(1);

	Backbone = __webpack_require__(2);

	BackboneORM = __webpack_require__(4);

	One = __webpack_require__(28);

	Many = __webpack_require__(29);

	DatabaseURL = __webpack_require__(11);

	Utils = __webpack_require__(7);

	RELATION_VARIANTS = {
	  'hasOne': 'hasOne',
	  'has_one': 'hasOne',
	  'HasOne': 'hasOne',
	  'belongsTo': 'belongsTo',
	  'belongs_to': 'belongsTo',
	  'BelongsTo': 'belongsTo',
	  'hasMany': 'hasMany',
	  'has_many': 'hasMany',
	  'HasMany': 'hasMany'
	};

	module.exports = Schema = (function() {
	  function Schema(model_type, type_overrides) {
	    this.model_type = model_type;
	    this.type_overrides = type_overrides != null ? type_overrides : {};
	    this.raw = _.clone(_.result(new this.model_type(), 'schema') || {});
	    this.fields = {};
	    this.relations = {};
	    this.virtual_accessors = {};
	  }

	  Schema.prototype.initialize = function() {
	    var info, key, relation, _ref, _ref1;
	    if (this.is_initialized) {
	      return;
	    }
	    this.is_initialized = true;
	    _ref = this.raw;
	    for (key in _ref) {
	      info = _ref[key];
	      this._parseField(key, info);
	    }
	    _ref1 = this.relations;
	    for (key in _ref1) {
	      relation = _ref1[key];
	      relation.initialize();
	    }
	  };

	  Schema.prototype.type = function(key, type) {
	    var _base, _ref, _ref1, _ref2, _ref3;
	    if (arguments.length === 2) {
	      return ((_base = this.type_overrides)[key] || (_base[key] = {}))['type'] = type;
	    } else {
	      return ((_ref = this.type_overrides[key]) != null ? _ref.type : void 0) || ((_ref1 = this.fields[key]) != null ? _ref1.type : void 0) || ((_ref2 = this.relation(key)) != null ? _ref2.reverse_model_type : void 0) || ((_ref3 = this.reverseRelation(key)) != null ? _ref3.model_type : void 0);
	    }
	  };

	  Schema.prototype.idType = function(key) {
	    var index, other, type;
	    if ((index = key.indexOf('.')) >= 0) {
	      other = key.substr(index + 1);
	      key = key.substr(0, index);
	    }
	    if (!(type = this.type(key))) {
	      return;
	    }
	    return (typeof type.schema === "function" ? type.schema().type(other || 'id') : void 0) || type;
	  };

	  Schema.prototype.relation = function(key) {
	    return this.relations[key] || this.virtual_accessors[key];
	  };

	  Schema.prototype.reverseRelation = function(reverse_key) {
	    var key, relation, _ref;
	    _ref = this.relations;
	    for (key in _ref) {
	      relation = _ref[key];
	      if (relation.reverse_relation && (relation.reverse_relation.join_key === reverse_key)) {
	        return relation.reverse_relation;
	      }
	    }
	    return null;
	  };

	  Schema.prototype.columns = function() {
	    var columns, key, relation, _ref;
	    columns = _.keys(this.fields);
	    if (!_.find(columns, function(column) {
	      return column === 'id';
	    })) {
	      columns.push('id');
	    }
	    _ref = this.relations;
	    for (key in _ref) {
	      relation = _ref[key];
	      if ((relation.type === 'belongsTo') && !relation.isVirtual() && !relation.isEmbedded()) {
	        columns.push(relation.foreign_key);
	      }
	    }
	    return columns;
	  };

	  Schema.prototype.joinTables = function() {
	    var key, relation;
	    return (function() {
	      var _ref, _results;
	      _ref = this.relations;
	      _results = [];
	      for (key in _ref) {
	        relation = _ref[key];
	        if (!relation.isVirtual() && relation.join_table) {
	          _results.push(relation.join_table);
	        }
	      }
	      return _results;
	    }).call(this);
	  };

	  Schema.prototype.relatedModels = function() {
	    var key, related_model_types, relation, _ref;
	    related_model_types = [];
	    _ref = this.relations;
	    for (key in _ref) {
	      relation = _ref[key];
	      related_model_types.push(relation.reverse_model_type);
	      if (relation.join_table) {
	        related_model_types.push(relation.join_table);
	      }
	    }
	    return related_model_types;
	  };

	  Schema.prototype.allColumns = function() {
	    return this.columns();
	  };

	  Schema.prototype.allRelations = function() {
	    return this.relatedModels();
	  };

	  Schema.prototype.generateBelongsTo = function(reverse_model_type) {
	    var key, relation;
	    key = BackboneORM.naming_conventions.attribute(reverse_model_type.model_name);
	    if (relation = this.relations[key]) {
	      return relation;
	    }
	    if (this.raw[key]) {
	      relation = this._parseField(key, this.raw[key]);
	      relation.initialize();
	      return relation;
	    }
	    relation = this._parseField(key, this.raw[key] = [
	      'belongsTo', reverse_model_type, {
	        manual_fetch: true
	      }
	    ]);
	    relation.initialize();
	    return relation;
	  };

	  Schema.joinTableURL = function(relation) {
	    var table_name1, table_name2;
	    table_name1 = BackboneORM.naming_conventions.tableName(relation.model_type.model_name);
	    table_name2 = BackboneORM.naming_conventions.tableName(relation.reverse_relation.model_type.model_name);
	    if (table_name1.localeCompare(table_name2) < 0) {
	      return "" + table_name1 + "_" + table_name2;
	    } else {
	      return "" + table_name2 + "_" + table_name1;
	    }
	  };

	  Schema.prototype.generateJoinTable = function(relation) {
	    var JoinTable, name, schema, type, url, _ref;
	    schema = {};
	    schema[relation.join_key] = [
	      type = relation.model_type.schema().type('id'), {
	        indexed: true
	      }
	    ];
	    schema[relation.reverse_relation.join_key] = [
	      ((_ref = relation.reverse_model_type) != null ? _ref.schema().type('id') : void 0) || type, {
	        indexed: true
	      }
	    ];
	    url = Schema.joinTableURL(relation);
	    name = BackboneORM.naming_conventions.modelName(url, true);
	    try {
	      JoinTable = (function(_super) {
	        __extends(JoinTable, _super);

	        function JoinTable() {
	          return JoinTable.__super__.constructor.apply(this, arguments);
	        }

	        JoinTable.prototype.model_name = name;

	        JoinTable.prototype.urlRoot = "" + ((new DatabaseURL(_.result(new relation.model_type, 'url'))).format({
	          exclude_table: true
	        })) + "/" + url;

	        JoinTable.prototype.schema = schema;

	        JoinTable.prototype.sync = relation.model_type.createSync(JoinTable);

	        return JoinTable;

	      })(Backbone.Model);
	    } catch (_error) {
	      JoinTable = (function(_super) {
	        __extends(JoinTable, _super);

	        function JoinTable() {
	          return JoinTable.__super__.constructor.apply(this, arguments);
	        }

	        JoinTable.prototype.model_name = name;

	        JoinTable.prototype.urlRoot = "/" + url;

	        JoinTable.prototype.schema = schema;

	        JoinTable.prototype.sync = relation.model_type.createSync(JoinTable);

	        return JoinTable;

	      })(Backbone.Model);
	    }
	    return JoinTable;
	  };

	  Schema.prototype._parseField = function(key, info) {
	    var options, relation, type;
	    options = this._fieldInfoToOptions(_.isFunction(info) ? info() : info);
	    if (!options.type) {
	      return this.fields[key] = options;
	    }
	    if (!(type = RELATION_VARIANTS[options.type])) {
	      if (!_.isString(options.type)) {
	        throw new Error("Unexpected type name is not a string: " + (JSONUtils.stringify(options)));
	      }
	      return this.fields[key] = options;
	    }
	    options.type = type;
	    relation = this.relations[key] = type === 'hasMany' ? new Many(this.model_type, key, options) : new One(this.model_type, key, options);
	    if (relation.virtual_id_accessor) {
	      this.virtual_accessors[relation.virtual_id_accessor] = relation;
	    }
	    if (type === 'belongsTo') {
	      this.virtual_accessors[relation.foreign_key] = relation;
	    }
	    return relation;
	  };

	  Schema.prototype._fieldInfoToOptions = function(options) {
	    var result;
	    if (_.isString(options)) {
	      return {
	        type: options
	      };
	    }
	    if (!_.isArray(options)) {
	      return options;
	    }
	    result = {};
	    if (_.isString(options[0])) {
	      result.type = options[0];
	      options = options.slice(1);
	      if (options.length === 0) {
	        return result;
	      }
	    }
	    if (_.isFunction(options[0])) {
	      result.reverse_model_type = options[0];
	      options = options.slice(1);
	    }
	    if (options.length > 1) {
	      throw new Error("Unexpected field options array: " + (JSONUtils.stringify(options)));
	    }
	    if (options.length === 1) {
	      _.extend(result, options[0]);
	    }
	    return result;
	  };

	  return Schema;

	})();


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var MemoryStore;

	MemoryStore = __webpack_require__(16);

	module.exports = new MemoryStore({
	  destroy: function(url, connection) {
	    return connection.destroy();
	  }
	});


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var LRU, MemoryStore, _,
	  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	_ = __webpack_require__(1);

	LRU = __webpack_require__(25);

	module.exports = MemoryStore = (function() {
	  function MemoryStore(options) {
	    var max_age;
	    if (options == null) {
	      options = {};
	    }
	    this.forEach = __bind(this.forEach, this);
	    this.reset = __bind(this.reset, this);
	    this.destroy = __bind(this.destroy, this);
	    this.get = __bind(this.get, this);
	    this.set = __bind(this.set, this);
	    if (max_age = options.max_age) {
	      (options = _.omit(options, 'max_age'))['maxAge'] = max_age;
	    }
	    this.cache = new LRU(options);
	  }

	  MemoryStore.prototype.set = function(key, value, callback) {
	    if (value._orm_never_cache) {
	      return (typeof callback === "function" ? callback(null, value) : void 0) || this;
	    }
	    this.cache.set(key, value);
	    if (typeof callback === "function") {
	      callback(null, value);
	    }
	    return this;
	  };

	  MemoryStore.prototype.get = function(key, callback) {
	    var value;
	    value = this.cache.get(key);
	    if (typeof callback === "function") {
	      callback(null, value);
	    }
	    return value;
	  };

	  MemoryStore.prototype.destroy = function(key, callback) {
	    this.cache.del(key);
	    if (typeof callback === "function") {
	      callback();
	    }
	    return this;
	  };

	  MemoryStore.prototype.del = MemoryStore.prototype.destroy;

	  MemoryStore.prototype.reset = function(callback) {
	    this.cache.reset();
	    if (typeof callback === "function") {
	      callback();
	    }
	    return this;
	  };

	  MemoryStore.prototype.forEach = function(callback) {
	    return this.cache.forEach(callback);
	  };

	  return MemoryStore;

	})();


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var BaseConvention, inflection;

	inflection = __webpack_require__(26);

	module.exports = BaseConvention = (function() {
	  function BaseConvention() {}

	  BaseConvention.modelName = function(table_name, plural) {
	    return inflection[plural ? 'pluralize' : 'singularize'](inflection.classify(table_name));
	  };

	  BaseConvention.tableName = function(model_name) {
	    return inflection.pluralize(inflection.underscore(model_name));
	  };

	  BaseConvention.foreignKey = function(model_name, plural) {
	    if (plural) {
	      return inflection.singularize(inflection.underscore(model_name)) + '_ids';
	    } else {
	      return inflection.underscore(model_name) + '_id';
	    }
	  };

	  BaseConvention.attribute = function(model_name, plural) {
	    return inflection[plural ? 'pluralize' : 'singularize'](inflection.underscore(model_name));
	  };

	  return BaseConvention;

	})();


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var punycode = { encode : function (s) { return s } };
	var _ = __webpack_require__(1);
	var shims = __webpack_require__(30);

	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;

	exports.Url = Url;

	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}

	// Reference: RFC 3986, RFC 1808, RFC 2396

	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,

	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(19);

	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && _.isObject(url) && url instanceof Url) return url;

	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}

	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!_.isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }

	  // Copy chrome, IE, opera backslash-handling behavior.
	  // See: https://code.google.com/p/chromium/issues/detail?id=25916
	  var hashSplit = url.split('#');
	  hashSplit[0] = hashSplit[0].replace(/\\/g, '/');
	  url = hashSplit.join('#');

	  var rest = url;

	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();

	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }

	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {

	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c

	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.

	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }

	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }

	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }

	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;

	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);

	    // pull out port.
	    this.parseHost();

	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';

	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';

	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }

	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a puny coded representation of "domain".
	      // It only converts the part of the domain name that
	      // has non ASCII characters. I.e. it dosent matter if
	      // you call it with a domain that already is in ASCII.
	      var domainArray = this.hostname.split('.');
	      var newOut = [];
	      for (var i = 0; i < domainArray.length; ++i) {
	        var s = domainArray[i];
	        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
	            'xn--' + punycode.encode(s) : s);
	      }
	      this.hostname = newOut.join('.');
	    }

	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;

	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }

	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {

	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }


	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }

	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }

	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};

	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (_.isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}

	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }

	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';

	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }

	  if (this.query &&
	      _.isObject(this.query) &&
	      Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }

	  var search = this.search || (query && ('?' + query)) || '';

	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }

	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;

	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');

	  return protocol + host + pathname + search + hash;
	};

	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}

	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};

	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}

	Url.prototype.resolveObject = function(relative) {
	  if (_.isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }

	  var result = new Url();
	  Object.keys(this).forEach(function(k) {
	    result[k] = this[k];
	  }, this);

	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;

	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    Object.keys(relative).forEach(function(k) {
	      if (k !== 'protocol')
	        result[k] = relative[k];
	    });

	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }

	    result.href = result.format();
	    return result;
	  }

	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      Object.keys(relative).forEach(function(k) {
	        result[k] = relative[k];
	      });
	      result.href = result.format();
	      return result;
	    }

	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }

	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];

	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }

	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!(_.isNull(relative.search) || _.isUndefined(relative.search))) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especialy happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!_.isNull(result.pathname) || !_.isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }

	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }

	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host) && (last === '.' || last === '..') ||
	      last === '');

	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last === '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }

	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }

	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');

	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especialy happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }

	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }

	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }

	  //to support request.http
	  if (!_.isNull(result.pathname) || !_.isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};

	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// Query String Utilities

	var QueryString = exports;
	var _ = __webpack_require__(1);


	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}


	function charCode(c) {
	  return c.charCodeAt(0);
	}


	// a safe fast alternative to decodeURIComponent
	QueryString.unescapeBuffer = function(s, decodeSpaces) {
	  var out = new Buffer(s.length);
	  var state = 'CHAR'; // states: CHAR, HEX0, HEX1
	  var n, m, hexchar;

	  for (var inIndex = 0, outIndex = 0; inIndex <= s.length; inIndex++) {
	    var c = s.charCodeAt(inIndex);
	    switch (state) {
	      case 'CHAR':
	        switch (c) {
	          case charCode('%'):
	            n = 0;
	            m = 0;
	            state = 'HEX0';
	            break;
	          case charCode('+'):
	            if (decodeSpaces) c = charCode(' ');
	            // pass thru
	          default:
	            out[outIndex++] = c;
	            break;
	        }
	        break;

	      case 'HEX0':
	        state = 'HEX1';
	        hexchar = c;
	        if (charCode('0') <= c && c <= charCode('9')) {
	          n = c - charCode('0');
	        } else if (charCode('a') <= c && c <= charCode('f')) {
	          n = c - charCode('a') + 10;
	        } else if (charCode('A') <= c && c <= charCode('F')) {
	          n = c - charCode('A') + 10;
	        } else {
	          out[outIndex++] = charCode('%');
	          out[outIndex++] = c;
	          state = 'CHAR';
	          break;
	        }
	        break;

	      case 'HEX1':
	        state = 'CHAR';
	        if (charCode('0') <= c && c <= charCode('9')) {
	          m = c - charCode('0');
	        } else if (charCode('a') <= c && c <= charCode('f')) {
	          m = c - charCode('a') + 10;
	        } else if (charCode('A') <= c && c <= charCode('F')) {
	          m = c - charCode('A') + 10;
	        } else {
	          out[outIndex++] = charCode('%');
	          out[outIndex++] = hexchar;
	          out[outIndex++] = c;
	          break;
	        }
	        out[outIndex++] = 16 * n + m;
	        break;
	    }
	  }

	  // TODO support returning arbitrary buffers.

	  return out.slice(0, outIndex - 1);
	};


	QueryString.unescape = function(s, decodeSpaces) {
	  return QueryString.unescapeBuffer(s, decodeSpaces).toString();
	};


	QueryString.escape = function(str) {
	  return encodeURIComponent(str);
	};

	var stringifyPrimitive = function(v) {
	  if (_.isString(v))
	    return v;
	  if (_.isBoolean(v))
	    return v ? 'true' : 'false';
	  if (_.isNumber(v))
	    return isFinite(v) ? v : '';
	  return '';
	};


	QueryString.stringify = QueryString.encode = function(obj, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (_.isNull(obj)) {
	    obj = undefined;
	  }

	  var encode = QueryString.escape;
	  if (options && typeof options.encodeURIComponent === 'function') {
	    encode = options.encodeURIComponent;
	  }

	  if (_.isObject(obj)) {
	    return Object.keys(obj).map(function(k) {
	      var ks = encode(stringifyPrimitive(k)) + eq;
	      if (_.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encode(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encode(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);
	  }
	  return '';
	};

	// Parse a key=val string.
	QueryString.parse = QueryString.decode = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (!_.isString(qs) || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && _.isNumber(options.maxKeys)) {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  var decode = decodeURIComponent;
	  if (options && typeof options.decodeURIComponent === 'function') {
	    decode = options.decodeURIComponent;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    try {
	      k = decode(kstr);
	      v = decode(vstr);
	    } catch (e) {
	      k = QueryString.unescape(kstr, true);
	      v = QueryString.unescape(vstr, true);
	    }

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (_.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(32).Buffer))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var Cursor, DateUtils, IS_MATCH_FNS, IS_MATCH_OPERATORS, JSONUtils, MemoryCursor, Queue, Utils, mergeQuery, valueToArray, _,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	_ = __webpack_require__(1);

	Queue = __webpack_require__(10);

	Utils = __webpack_require__(7);

	JSONUtils = __webpack_require__(8);

	DateUtils = __webpack_require__(9);

	Cursor = __webpack_require__(13);

	IS_MATCH_FNS = {
	  $ne: function(mv, tv) {
	    return !_.isEqual(mv, tv);
	  },
	  $lt: function(mv, tv) {
	    if (_.isNull(tv)) {
	      throw Error('Cannot compare to null');
	    }
	    return (_.isDate(tv) ? DateUtils.isBefore(mv, tv) : mv < tv);
	  },
	  $lte: function(mv, tv) {
	    if (_.isNull(tv)) {
	      throw Error('Cannot compare to null');
	    }
	    if (_.isDate(tv)) {
	      return !DateUtils.isAfter(mv, tv);
	    } else {
	      return mv <= tv;
	    }
	  },
	  $gt: function(mv, tv) {
	    if (_.isNull(tv)) {
	      throw Error('Cannot compare to null');
	    }
	    return (_.isDate(tv) ? DateUtils.isAfter(mv, tv) : mv > tv);
	  },
	  $gte: function(mv, tv) {
	    if (_.isNull(tv)) {
	      throw Error('Cannot compare to null');
	    }
	    if (_.isDate(tv)) {
	      return !DateUtils.isBefore(mv, tv);
	    } else {
	      return mv >= tv;
	    }
	  }
	};

	IS_MATCH_OPERATORS = _.keys(IS_MATCH_FNS);

	valueToArray = function(value) {
	  return (_.isArray(value) ? value : (_.isNull(value) ? [] : (value.$in ? value.$in : [value])));
	};

	mergeQuery = function(query, key, value) {
	  return query[key] = query.hasOwnProperty(key) ? {
	    $in: _.intersection(valueToArray(query[key]), valueToArray(value))
	  } : value;
	};

	module.exports = MemoryCursor = (function(_super) {
	  __extends(MemoryCursor, _super);

	  function MemoryCursor() {
	    return MemoryCursor.__super__.constructor.apply(this, arguments);
	  }

	  MemoryCursor.prototype.queryToJSON = function(callback) {
	    var exists;
	    if (this.hasCursorQuery('$zero')) {
	      return callback(null, this.hasCursorQuery('$one') ? null : []);
	    }
	    exists = this.hasCursorQuery('$exists');
	    return this.buildFindQuery((function(_this) {
	      return function(err, find_query) {
	        var json, keys, queue;
	        if (err) {
	          return callback(err);
	        }
	        json = [];
	        keys = _.keys(find_query);
	        queue = new Queue(1);
	        queue.defer(function(callback) {
	          var find_queue, id, ins, ins_size, key, model_json, nins, nins_size, value, _fn, _ref, _ref1, _ref2, _ref3, _ref4;
	          _ref = [{}, {}], ins = _ref[0], nins = _ref[1];
	          for (key in find_query) {
	            value = find_query[key];
	            if (value != null ? value.$in : void 0) {
	              delete find_query[key];
	              ins[key] = value.$in;
	            }
	            if (value != null ? value.$nin : void 0) {
	              delete find_query[key];
	              nins[key] = value.$nin;
	            }
	          }
	          _ref1 = [_.size(ins), _.size(nins)], ins_size = _ref1[0], nins_size = _ref1[1];
	          if (keys.length || ins_size || nins_size) {
	            if (_this._cursor.$ids) {
	              _ref2 = _this.store;
	              for (id in _ref2) {
	                model_json = _ref2[id];
	                if (_.contains(_this._cursor.$ids, model_json.id) && _.isEqual(_.pick(model_json, keys), find_query)) {
	                  json.push(JSONUtils.deepClone(model_json));
	                }
	              }
	              return callback();
	            } else {
	              find_queue = new Queue();
	              _ref3 = _this.store;
	              _fn = function(model_json) {
	                return find_queue.defer(function(callback) {
	                  var find_keys, next;
	                  if (exists && json.length) {
	                    return callback();
	                  }
	                  find_keys = _.keys(find_query);
	                  next = function(err, is_match) {
	                    if (err || !is_match) {
	                      return callback(err);
	                    }
	                    if (!find_keys.length) {
	                      json.push(JSONUtils.deepClone(model_json));
	                      return callback();
	                    }
	                    return _this._valueIsMatch(find_query, find_keys.pop(), model_json, next);
	                  };
	                  return next(null, true);
	                });
	              };
	              for (id in _ref3) {
	                model_json = _ref3[id];
	                _fn(model_json);
	              }
	              return find_queue.await(function(err) {
	                if (err) {
	                  return callback(err);
	                }
	                if (ins_size) {
	                  json = _.filter(json, function(model_json) {
	                    var values, _ref4;
	                    for (key in ins) {
	                      values = ins[key];
	                      if (_ref4 = model_json[key], __indexOf.call(values, _ref4) >= 0) {
	                        return true;
	                      }
	                    }
	                  });
	                }
	                if (nins_size) {
	                  json = _.filter(json, function(model_json) {
	                    var values, _ref4;
	                    for (key in nins) {
	                      values = nins[key];
	                      if (_ref4 = model_json[key], __indexOf.call(values, _ref4) < 0) {
	                        return true;
	                      }
	                    }
	                  });
	                }
	                return callback();
	              });
	            }
	          } else {
	            if (_this._cursor.$ids) {
	              _ref4 = _this.store;
	              for (id in _ref4) {
	                model_json = _ref4[id];
	                if (_.contains(_this._cursor.$ids, model_json.id)) {
	                  json.push(JSONUtils.deepClone(model_json));
	                }
	              }
	            } else {
	              json = (function() {
	                var _ref5, _results;
	                _ref5 = this.store;
	                _results = [];
	                for (id in _ref5) {
	                  model_json = _ref5[id];
	                  _results.push(JSONUtils.deepClone(model_json));
	                }
	                return _results;
	              }).call(_this);
	            }
	            return callback();
	          }
	        });
	        if (!exists) {
	          queue.defer(function(callback) {
	            var $sort_fields, number;
	            if (_this._cursor.$sort) {
	              $sort_fields = _.isArray(_this._cursor.$sort) ? _this._cursor.$sort : [_this._cursor.$sort];
	              json.sort(function(model, next_model) {
	                return Utils.jsonFieldCompare(model, next_model, $sort_fields);
	              });
	            }
	            if (_this._cursor.$offset) {
	              number = json.length - _this._cursor.$offset;
	              if (number < 0) {
	                number = 0;
	              }
	              json = number ? json.slice(_this._cursor.$offset, _this._cursor.$offset + number) : [];
	            }
	            if (_this._cursor.$one) {
	              json = json.slice(0, 1);
	            } else if (_this._cursor.$limit) {
	              json = json.splice(0, Math.min(json.length, _this._cursor.$limit));
	            }
	            return callback();
	          });
	          queue.defer(function(callback) {
	            return _this.fetchIncludes(json, callback);
	          });
	        }
	        queue.await(function() {
	          var count_cursor;
	          if (_this.hasCursorQuery('$count')) {
	            return callback(null, (_.isArray(json) ? json.length : (json ? 1 : 0)));
	          }
	          if (exists) {
	            return callback(null, (_.isArray(json) ? !!json.length : json));
	          }
	          if (_this.hasCursorQuery('$page')) {
	            count_cursor = new MemoryCursor(_this._find, _.extend(_.pick(_this, ['model_type', 'store'])));
	            return count_cursor.count(function(err, count) {
	              if (err) {
	                return callback(err);
	              }
	              return callback(null, {
	                offset: _this._cursor.$offset || 0,
	                total_rows: count,
	                rows: _this.selectResults(json)
	              });
	            });
	          } else {
	            return callback(null, _this.selectResults(json));
	          }
	        });
	      };
	    })(this));
	  };

	  MemoryCursor.prototype.buildFindQuery = function(callback) {
	    var find_query, key, queue, relation_key, reverse_relation, value, value_key, _fn, _ref, _ref1;
	    queue = new Queue();
	    find_query = {};
	    _ref = this._find;
	    _fn = (function(_this) {
	      return function(relation_key, value_key, value) {
	        return queue.defer(function(callback) {
	          var related_query, relation;
	          if (!(relation = _this.model_type.relation(relation_key))) {
	            mergeQuery(find_query, key, value);
	            return callback();
	          }
	          if (!relation.join_table && (value_key === 'id')) {
	            mergeQuery(find_query, relation.foreign_key, value);
	            return callback();
	          } else if (relation.join_table || (relation.type === 'belongsTo')) {
	            (related_query = {
	              $values: 'id'
	            })[value_key] = value;
	            return relation.reverse_relation.model_type.cursor(related_query).toJSON(function(err, related_ids) {
	              var join_query;
	              if (err) {
	                return callback(err);
	              }
	              if (relation.join_table) {
	                (join_query = {})[relation.reverse_relation.join_key] = {
	                  $in: related_ids
	                };
	                join_query.$values = relation.foreign_key;
	                return relation.join_table.cursor(join_query).toJSON(function(err, model_ids) {
	                  if (err) {
	                    return callback(err);
	                  }
	                  mergeQuery(find_query, 'id', {
	                    $in: model_ids
	                  });
	                  return callback();
	                });
	              } else {
	                mergeQuery(find_query, relation.foreign_key, {
	                  $in: related_ids
	                });
	                return callback();
	              }
	            });
	          } else {
	            (related_query = {})[value_key] = value;
	            related_query.$values = relation.foreign_key;
	            return relation.reverse_model_type.cursor(related_query).toJSON(function(err, model_ids) {
	              if (err) {
	                return callback(err);
	              }
	              mergeQuery(find_query, 'id', {
	                $in: model_ids
	              });
	              return callback();
	            });
	          }
	        });
	      };
	    })(this);
	    for (key in _ref) {
	      value = _ref[key];
	      if (key.indexOf('.') < 0) {
	        if (!(reverse_relation = this.model_type.reverseRelation(key))) {
	          mergeQuery(find_query, key, value);
	          continue;
	        }
	        if (!reverse_relation.embed && !reverse_relation.join_table) {
	          mergeQuery(find_query, key, value);
	          continue;
	        }
	        (function(_this) {
	          return (function(key, value, reverse_relation) {
	            return queue.defer(function(callback) {
	              var related_query;
	              if (reverse_relation.embed) {
	                throw Error("Embedded find is not yet supported. @_find: " + (JSONUtils.stringify(_this._find)));
	                (related_query = {}).id = value;
	                return reverse_relation.model_type.cursor(related_query).toJSON(function(err, models_json) {
	                  if (err) {
	                    return callback(err);
	                  }
	                  mergeQuery(find_query, '_json', _.map(models_json, function(test) {
	                    return test[reverse_relation.key];
	                  }));
	                  return callback();
	                });
	              } else {
	                (related_query = {})[key] = value;
	                related_query.$values = reverse_relation.reverse_relation.join_key;
	                return reverse_relation.join_table.cursor(related_query).toJSON(function(err, model_ids) {
	                  if (err) {
	                    return callback(err);
	                  }
	                  mergeQuery(find_query, 'id', {
	                    $in: model_ids
	                  });
	                  return callback();
	                });
	              }
	            });
	          });
	        })(this)(key, value, reverse_relation);
	        continue;
	      }
	      _ref1 = key.split('.'), relation_key = _ref1[0], value_key = _ref1[1];
	      if (this.model_type.relationIsEmbedded(relation_key)) {
	        mergeQuery(find_query, key, value);
	        continue;
	      }
	      _fn(relation_key, value_key, value);
	    }
	    return queue.await((function(_this) {
	      return function(err) {
	        return callback(err, find_query);
	      };
	    })(this));
	  };

	  MemoryCursor.prototype.fetchIncludes = function(json, callback) {
	    var include_keys, key, load_queue, model_json, relation, _fn, _i, _j, _len, _len1;
	    if (!this._cursor.$include) {
	      return callback();
	    }
	    load_queue = new Queue(1);
	    include_keys = _.isArray(this._cursor.$include) ? this._cursor.$include : [this._cursor.$include];
	    for (_i = 0, _len = include_keys.length; _i < _len; _i++) {
	      key = include_keys[_i];
	      if (this.model_type.relationIsEmbedded(key)) {
	        continue;
	      }
	      if (!(relation = this.model_type.relation(key))) {
	        return callback(new Error("Included relation '" + key + "' is not a relation"));
	      }
	      _fn = (function(_this) {
	        return function(key, model_json) {
	          return load_queue.defer(function(callback) {
	            return relation.cursor(model_json, key).toJSON(function(err, related_json) {
	              if (err) {
	                return calback(err);
	              }
	              delete model_json[relation.foriegn_key];
	              model_json[key] = related_json;
	              return callback();
	            });
	          });
	        };
	      })(this);
	      for (_j = 0, _len1 = json.length; _j < _len1; _j++) {
	        model_json = json[_j];
	        _fn(key, model_json);
	      }
	    }
	    return load_queue.await(callback);
	  };

	  MemoryCursor.prototype._valueIsMatch = function(find_query, key_path, model_json, callback) {
	    var key_components, model_type, next;
	    key_components = key_path.split('.');
	    model_type = this.model_type;
	    next = (function(_this) {
	      return function(err, models_json) {
	        var find_value, is_match, key, model_value, operator, relation, was_handled, _i, _j, _len, _len1;
	        if (err) {
	          return callback(err);
	        }
	        key = key_components.shift();
	        if (key === 'id') {
	          key = model_type.prototype.idAttribute;
	        }
	        if (!key_components.length) {
	          was_handled = false;
	          find_value = find_query[key_path];
	          if (!_.isArray(models_json)) {
	            models_json = [models_json];
	          }
	          for (_i = 0, _len = models_json.length; _i < _len; _i++) {
	            model_json = models_json[_i];
	            model_value = model_json[key];
	            if (_.isObject(find_value)) {
	              for (_j = 0, _len1 = IS_MATCH_OPERATORS.length; _j < _len1; _j++) {
	                operator = IS_MATCH_OPERATORS[_j];
	                if (!(find_value.hasOwnProperty(operator))) {
	                  continue;
	                }
	                was_handled = true;
	                if (!(is_match = IS_MATCH_FNS[operator](model_value, find_value[operator]))) {
	                  break;
	                }
	              }
	            }
	            if (was_handled) {
	              if (is_match) {
	                return callback(null, is_match);
	              }
	            } else if (is_match = _.isEqual(model_value, find_value)) {
	              return callback(null, is_match);
	            }
	          }
	          return callback(null, false);
	        }
	        if ((relation = model_type.relation(key)) && !relation.embed) {
	          return relation.cursor(model_json, key).toJSON(next);
	        }
	        return next(null, model_json[key]);
	      };
	    })(this);
	    return next(null, model_json);
	  };

	  return MemoryCursor;

	})(Cursor);


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var BaseConvention, UnderscoreConvention, inflection,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	inflection = __webpack_require__(26);

	BaseConvention = __webpack_require__(17);

	module.exports = UnderscoreConvention = (function(_super) {
	  __extends(UnderscoreConvention, _super);

	  function UnderscoreConvention() {
	    return UnderscoreConvention.__super__.constructor.apply(this, arguments);
	  }

	  UnderscoreConvention.attribute = function(model_name, plural) {
	    return inflection[plural ? 'pluralize' : 'singularize'](inflection.underscore(model_name));
	  };

	  return UnderscoreConvention;

	})(BaseConvention);


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var BaseConvention, CamelizeConvention, inflection,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	inflection = __webpack_require__(26);

	BaseConvention = __webpack_require__(17);

	module.exports = CamelizeConvention = (function(_super) {
	  __extends(CamelizeConvention, _super);

	  function CamelizeConvention() {
	    return CamelizeConvention.__super__.constructor.apply(this, arguments);
	  }

	  CamelizeConvention.attribute = function(model_name, plural) {
	    return inflection[plural ? 'pluralize' : 'singularize'](inflection.camelize(model_name, true));
	  };

	  return CamelizeConvention;

	})(BaseConvention);


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var BaseConvention, ClassifyConvention, inflection,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	inflection = __webpack_require__(26);

	BaseConvention = __webpack_require__(17);

	module.exports = ClassifyConvention = (function(_super) {
	  __extends(ClassifyConvention, _super);

	  function ClassifyConvention() {
	    return ClassifyConvention.__super__.constructor.apply(this, arguments);
	  }

	  ClassifyConvention.attribute = function(model_name, plural) {
	    return inflection[plural ? 'pluralize' : 'singularize'](inflection.camelize(model_name, false));
	  };

	  return ClassifyConvention;

	})(BaseConvention);


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var Backbone, MemoryStore, ModelCache, Queue, _;

	Backbone = __webpack_require__(2);

	_ = __webpack_require__(1);

	Queue = __webpack_require__(10);

	MemoryStore = __webpack_require__(16);

	module.exports = ModelCache = (function() {
	  function ModelCache() {
	    this.enabled = false;
	    this.caches = {};
	    this.options = {
	      modelTypes: {}
	    };
	    this.verbose = false;
	  }

	  ModelCache.prototype.configure = function(options) {
	    var key, value, value_key, value_value, values, _base;
	    if (options == null) {
	      options = {};
	    }
	    this.enabled = options.enabled;
	    for (key in options) {
	      value = options[key];
	      if (_.isObject(value)) {
	        (_base = this.options)[key] || (_base[key] = {});
	        values = this.options[key];
	        for (value_key in value) {
	          value_value = value[value_key];
	          values[value_key] = value_value;
	        }
	      } else {
	        this.options[key] = value;
	      }
	    }
	    return this.reset();
	  };

	  ModelCache.prototype.configureSync = function(model_type, sync_fn) {
	    if (model_type.prototype._orm_never_cache || !this.createCache(model_type)) {
	      return sync_fn;
	    }
	    return (__webpack_require__(31))(model_type, sync_fn);
	  };

	  ModelCache.prototype.reset = function() {
	    var key, value, _ref, _results;
	    _ref = this.caches;
	    _results = [];
	    for (key in _ref) {
	      value = _ref[key];
	      _results.push(this.createCache(value.model_type));
	    }
	    return _results;
	  };

	  ModelCache.prototype.createCache = function(model_type) {
	    var cache_info, cuid, model_name, options;
	    if (!(model_name = model_type != null ? model_type.model_name : void 0)) {
	      throw new Error("Missing model name for cache");
	    }
	    cuid = model_type.cuid || (model_type.cuid = _.uniqueId('cuid'));
	    if (cache_info = this.caches[cuid]) {
	      delete this.caches[cuid];
	      cache_info.cache.reset();
	      cache_info.model_type.cache = null;
	    }
	    if (!this.enabled) {
	      return null;
	    }
	    if (!(options = this.options.modelTypes[model_name])) {
	      if (!(this.options.store || this.options.max || this.options.max_age)) {
	        return null;
	      }
	      options = this.options;
	    }
	    cache_info = this.caches[cuid] = {
	      cache: (typeof options.store === "function" ? options.store() : void 0) || new MemoryStore(options),
	      model_type: model_type
	    };
	    return model_type.cache = cache_info.cache;
	  };

	  return ModelCache;

	})();


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	;(function () { // closure for web browsers

	if (typeof module === 'object' && module.exports) {
	  module.exports = LRUCache
	} else {
	  // just set the global for non-node platforms.
	  this.LRUCache = LRUCache
	}

	function hOP (obj, key) {
	  return Object.prototype.hasOwnProperty.call(obj, key)
	}

	function naiveLength () { return 1 }

	function LRUCache (options) {
	  if (!(this instanceof LRUCache))
	    return new LRUCache(options)

	  if (typeof options === 'number')
	    options = { max: options }

	  if (!options)
	    options = {}

	  this._max = options.max
	  // Kind of weird to have a default max of Infinity, but oh well.
	  if (!this._max || !(typeof this._max === "number") || this._max <= 0 )
	    this._max = Infinity

	  this._lengthCalculator = options.length || naiveLength
	  if (typeof this._lengthCalculator !== "function")
	    this._lengthCalculator = naiveLength

	  this._allowStale = options.stale || false
	  this._maxAge = options.maxAge || null
	  this._dispose = options.dispose
	  this.reset()
	}

	// resize the cache when the max changes.
	Object.defineProperty(LRUCache.prototype, "max",
	  { set : function (mL) {
	      if (!mL || !(typeof mL === "number") || mL <= 0 ) mL = Infinity
	      this._max = mL
	      if (this._length > this._max) trim(this)
	    }
	  , get : function () { return this._max }
	  , enumerable : true
	  })

	// resize the cache when the lengthCalculator changes.
	Object.defineProperty(LRUCache.prototype, "lengthCalculator",
	  { set : function (lC) {
	      if (typeof lC !== "function") {
	        this._lengthCalculator = naiveLength
	        this._length = this._itemCount
	        for (var key in this._cache) {
	          this._cache[key].length = 1
	        }
	      } else {
	        this._lengthCalculator = lC
	        this._length = 0
	        for (var key in this._cache) {
	          this._cache[key].length = this._lengthCalculator(this._cache[key].value)
	          this._length += this._cache[key].length
	        }
	      }

	      if (this._length > this._max) trim(this)
	    }
	  , get : function () { return this._lengthCalculator }
	  , enumerable : true
	  })

	Object.defineProperty(LRUCache.prototype, "length",
	  { get : function () { return this._length }
	  , enumerable : true
	  })


	Object.defineProperty(LRUCache.prototype, "itemCount",
	  { get : function () { return this._itemCount }
	  , enumerable : true
	  })

	LRUCache.prototype.forEach = function (fn, thisp) {
	  thisp = thisp || this
	  var i = 0;
	  for (var k = this._mru - 1; k >= 0 && i < this._itemCount; k--) if (this._lruList[k]) {
	    i++
	    var hit = this._lruList[k]
	    if (this._maxAge && (Date.now() - hit.now > this._maxAge)) {
	      del(this, hit)
	      if (!this._allowStale) hit = undefined
	    }
	    if (hit) {
	      fn.call(thisp, hit.value, hit.key, this)
	    }
	  }
	}

	LRUCache.prototype.keys = function () {
	  var keys = new Array(this._itemCount)
	  var i = 0
	  for (var k = this._mru - 1; k >= 0 && i < this._itemCount; k--) if (this._lruList[k]) {
	    var hit = this._lruList[k]
	    keys[i++] = hit.key
	  }
	  return keys
	}

	LRUCache.prototype.values = function () {
	  var values = new Array(this._itemCount)
	  var i = 0
	  for (var k = this._mru - 1; k >= 0 && i < this._itemCount; k--) if (this._lruList[k]) {
	    var hit = this._lruList[k]
	    values[i++] = hit.value
	  }
	  return values
	}

	LRUCache.prototype.reset = function () {
	  if (this._dispose && this._cache) {
	    for (var k in this._cache) {
	      this._dispose(k, this._cache[k].value)
	    }
	  }

	  this._cache = Object.create(null) // hash of items by key
	  this._lruList = Object.create(null) // list of items in order of use recency
	  this._mru = 0 // most recently used
	  this._lru = 0 // least recently used
	  this._length = 0 // number of items in the list
	  this._itemCount = 0
	}

	// Provided for debugging/dev purposes only. No promises whatsoever that
	// this API stays stable.
	LRUCache.prototype.dump = function () {
	  return this._cache
	}

	LRUCache.prototype.dumpLru = function () {
	  return this._lruList
	}

	LRUCache.prototype.set = function (key, value) {
	  if (hOP(this._cache, key)) {
	    // dispose of the old one before overwriting
	    if (this._dispose) this._dispose(key, this._cache[key].value)
	    if (this._maxAge) this._cache[key].now = Date.now()
	    this._cache[key].value = value
	    this.get(key)
	    return true
	  }

	  var len = this._lengthCalculator(value)
	  var age = this._maxAge ? Date.now() : 0
	  var hit = new Entry(key, value, this._mru++, len, age)

	  // oversized objects fall out of cache automatically.
	  if (hit.length > this._max) {
	    if (this._dispose) this._dispose(key, value)
	    return false
	  }

	  this._length += hit.length
	  this._lruList[hit.lu] = this._cache[key] = hit
	  this._itemCount ++

	  if (this._length > this._max) trim(this)
	  return true
	}

	LRUCache.prototype.has = function (key) {
	  if (!hOP(this._cache, key)) return false
	  var hit = this._cache[key]
	  if (this._maxAge && (Date.now() - hit.now > this._maxAge)) {
	    return false
	  }
	  return true
	}

	LRUCache.prototype.get = function (key) {
	  return get(this, key, true)
	}

	LRUCache.prototype.peek = function (key) {
	  return get(this, key, false)
	}

	LRUCache.prototype.pop = function () {
	  var hit = this._lruList[this._lru]
	  del(this, hit)
	  return hit || null
	}

	LRUCache.prototype.del = function (key) {
	  del(this, this._cache[key])
	}

	function get (self, key, doUse) {
	  var hit = self._cache[key]
	  if (hit) {
	    if (self._maxAge && (Date.now() - hit.now > self._maxAge)) {
	      del(self, hit)
	      if (!self._allowStale) hit = undefined
	    } else {
	      if (doUse) use(self, hit)
	    }
	    if (hit) hit = hit.value
	  }
	  return hit
	}

	function use (self, hit) {
	  shiftLU(self, hit)
	  hit.lu = self._mru ++
	  self._lruList[hit.lu] = hit
	}

	function trim (self) {
	  while (self._lru < self._mru && self._length > self._max)
	    del(self, self._lruList[self._lru])
	}

	function shiftLU (self, hit) {
	  delete self._lruList[ hit.lu ]
	  while (self._lru < self._mru && !self._lruList[self._lru]) self._lru ++
	}

	function del (self, hit) {
	  if (hit) {
	    if (self._dispose) self._dispose(hit.key, hit.value)
	    self._length -= hit.length
	    self._itemCount --
	    delete self._cache[ hit.key ]
	    shiftLU(self, hit)
	  }
	}

	// classy, since V8 prefers predictable objects.
	function Entry (key, value, lu, length, now) {
	  this.key = key
	  this.value = value
	  this.lu = lu
	  this.length = length
	  this.now = now
	}

	})()


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * inflection
	 * Copyright(c) 2011 Ben Lin <ben@dreamerslab.com>
	 * MIT Licensed
	 *
	 * @fileoverview
	 * A port of inflection-js to node.js module.
	 */

	( function ( root, factory ){
	  if( true ){
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (factory.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }else if( typeof exports === 'object' ){
	    module.exports = factory();
	  }else{
	    root.inflection = factory();
	  }
	}( this, function (){

	  /**
	   * @description This is a list of nouns that use the same form for both singular and plural.
	   *              This list should remain entirely in lower case to correctly match Strings.
	   * @private
	   */
	  var uncountable_words = [
	    'equipment', 'information', 'rice', 'money', 'species',
	    'series', 'fish', 'sheep', 'moose', 'deer', 'news'
	  ];

	  /**
	   * @description These rules translate from the singular form of a noun to its plural form.
	   * @private
	   */
	  var plural_rules = [

	    // do not replace if its already a plural word
	    [ new RegExp( '(m)en$',      'gi' )],
	    [ new RegExp( '(pe)ople$',   'gi' )],
	    [ new RegExp( '(child)ren$', 'gi' )],
	    [ new RegExp( '([ti])a$',    'gi' )],
	    [ new RegExp( '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$','gi' )],
	    [ new RegExp( '(hive)s$',           'gi' )],
	    [ new RegExp( '(tive)s$',           'gi' )],
	    [ new RegExp( '(curve)s$',          'gi' )],
	    [ new RegExp( '([lr])ves$',         'gi' )],
	    [ new RegExp( '([^fo])ves$',        'gi' )],
	    [ new RegExp( '([^aeiouy]|qu)ies$', 'gi' )],
	    [ new RegExp( '(s)eries$',          'gi' )],
	    [ new RegExp( '(m)ovies$',          'gi' )],
	    [ new RegExp( '(x|ch|ss|sh)es$',    'gi' )],
	    [ new RegExp( '([m|l])ice$',        'gi' )],
	    [ new RegExp( '(bus)es$',           'gi' )],
	    [ new RegExp( '(o)es$',             'gi' )],
	    [ new RegExp( '(shoe)s$',           'gi' )],
	    [ new RegExp( '(cris|ax|test)es$',  'gi' )],
	    [ new RegExp( '(octop|vir)i$',      'gi' )],
	    [ new RegExp( '(alias|status)es$',  'gi' )],
	    [ new RegExp( '^(ox)en',            'gi' )],
	    [ new RegExp( '(vert|ind)ices$',    'gi' )],
	    [ new RegExp( '(matr)ices$',        'gi' )],
	    [ new RegExp( '(quiz)zes$',         'gi' )],

	    // original rule
	    [ new RegExp( '(m)an$', 'gi' ),                 '$1en' ],
	    [ new RegExp( '(pe)rson$', 'gi' ),              '$1ople' ],
	    [ new RegExp( '(child)$', 'gi' ),               '$1ren' ],
	    [ new RegExp( '^(ox)$', 'gi' ),                 '$1en' ],
	    [ new RegExp( '(ax|test)is$', 'gi' ),           '$1es' ],
	    [ new RegExp( '(octop|vir)us$', 'gi' ),         '$1i' ],
	    [ new RegExp( '(alias|status)$', 'gi' ),        '$1es' ],
	    [ new RegExp( '(bu)s$', 'gi' ),                 '$1ses' ],
	    [ new RegExp( '(buffal|tomat|potat)o$', 'gi' ), '$1oes' ],
	    [ new RegExp( '([ti])um$', 'gi' ),              '$1a' ],
	    [ new RegExp( 'sis$', 'gi' ),                   'ses' ],
	    [ new RegExp( '(?:([^f])fe|([lr])f)$', 'gi' ),  '$1$2ves' ],
	    [ new RegExp( '(hive)$', 'gi' ),                '$1s' ],
	    [ new RegExp( '([^aeiouy]|qu)y$', 'gi' ),       '$1ies' ],
	    [ new RegExp( '(x|ch|ss|sh)$', 'gi' ),          '$1es' ],
	    [ new RegExp( '(matr|vert|ind)ix|ex$', 'gi' ),  '$1ices' ],
	    [ new RegExp( '([m|l])ouse$', 'gi' ),           '$1ice' ],
	    [ new RegExp( '(quiz)$', 'gi' ),                '$1zes' ],

	    [ new RegExp( 's$', 'gi' ), 's' ],
	    [ new RegExp( '$', 'gi' ),  's' ]
	  ];

	  /**
	   * @description These rules translate from the plural form of a noun to its singular form.
	   * @private
	   */
	  var singular_rules = [

	    // do not replace if its already a singular word
	    [ new RegExp( '(m)an$',                 'gi' )],
	    [ new RegExp( '(pe)rson$',              'gi' )],
	    [ new RegExp( '(child)$',               'gi' )],
	    [ new RegExp( '^(ox)$',                 'gi' )],
	    [ new RegExp( '(ax|test)is$',           'gi' )],
	    [ new RegExp( '(octop|vir)us$',         'gi' )],
	    [ new RegExp( '(alias|status)$',        'gi' )],
	    [ new RegExp( '(bu)s$',                 'gi' )],
	    [ new RegExp( '(buffal|tomat|potat)o$', 'gi' )],
	    [ new RegExp( '([ti])um$',              'gi' )],
	    [ new RegExp( 'sis$',                   'gi' )],
	    [ new RegExp( '(?:([^f])fe|([lr])f)$',  'gi' )],
	    [ new RegExp( '(hive)$',                'gi' )],
	    [ new RegExp( '([^aeiouy]|qu)y$',       'gi' )],
	    [ new RegExp( '(x|ch|ss|sh)$',          'gi' )],
	    [ new RegExp( '(matr|vert|ind)ix|ex$',  'gi' )],
	    [ new RegExp( '([m|l])ouse$',           'gi' )],
	    [ new RegExp( '(quiz)$',                'gi' )],

	    // original rule
	    [ new RegExp( '(m)en$', 'gi' ),                                                       '$1an' ],
	    [ new RegExp( '(pe)ople$', 'gi' ),                                                    '$1rson' ],
	    [ new RegExp( '(child)ren$', 'gi' ),                                                  '$1' ],
	    [ new RegExp( '([ti])a$', 'gi' ),                                                     '$1um' ],
	    [ new RegExp( '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$','gi' ), '$1$2sis' ],
	    [ new RegExp( '(hive)s$', 'gi' ),                                                     '$1' ],
	    [ new RegExp( '(tive)s$', 'gi' ),                                                     '$1' ],
	    [ new RegExp( '(curve)s$', 'gi' ),                                                    '$1' ],
	    [ new RegExp( '([lr])ves$', 'gi' ),                                                   '$1f' ],
	    [ new RegExp( '([^fo])ves$', 'gi' ),                                                  '$1fe' ],
	    [ new RegExp( '(m)ovies$', 'gi' ),                                                    '$1ovie' ],
	    [ new RegExp( '([^aeiouy]|qu)ies$', 'gi' ),                                           '$1y' ],
	    [ new RegExp( '(s)eries$', 'gi' ),                                                    '$1eries' ],
	    [ new RegExp( '(x|ch|ss|sh)es$', 'gi' ),                                              '$1' ],
	    [ new RegExp( '([m|l])ice$', 'gi' ),                                                  '$1ouse' ],
	    [ new RegExp( '(bus)es$', 'gi' ),                                                     '$1' ],
	    [ new RegExp( '(o)es$', 'gi' ),                                                       '$1' ],
	    [ new RegExp( '(shoe)s$', 'gi' ),                                                     '$1' ],
	    [ new RegExp( '(cris|ax|test)es$', 'gi' ),                                            '$1is' ],
	    [ new RegExp( '(octop|vir)i$', 'gi' ),                                                '$1us' ],
	    [ new RegExp( '(alias|status)es$', 'gi' ),                                            '$1' ],
	    [ new RegExp( '^(ox)en', 'gi' ),                                                      '$1' ],
	    [ new RegExp( '(vert|ind)ices$', 'gi' ),                                              '$1ex' ],
	    [ new RegExp( '(matr)ices$', 'gi' ),                                                  '$1ix' ],
	    [ new RegExp( '(quiz)zes$', 'gi' ),                                                   '$1' ],
	    [ new RegExp( 'ss$', 'gi' ),                                                          'ss' ],
	    [ new RegExp( 's$', 'gi' ),                                                           '' ]
	  ];

	  /**
	   * @description This is a list of words that should not be capitalized for title case.
	   * @private
	   */
	  var non_titlecased_words = [
	    'and', 'or', 'nor', 'a', 'an', 'the', 'so', 'but', 'to', 'of', 'at','by',
	    'from', 'into', 'on', 'onto', 'off', 'out', 'in', 'over', 'with', 'for'
	  ];

	  /**
	   * @description These are regular expressions used for converting between String formats.
	   * @private
	   */
	  var id_suffix         = new RegExp( '(_ids|_id)$', 'g' );
	  var underbar          = new RegExp( '_', 'g' );
	  var space_or_underbar = new RegExp( '[\ _]', 'g' );
	  var uppercase         = new RegExp( '([A-Z])', 'g' );
	  var underbar_prefix   = new RegExp( '^_' );

	  var inflector = {

	  /**
	   * A helper method that applies rules based replacement to a String.
	   * @private
	   * @function
	   * @param {String} str String to modify and return based on the passed rules.
	   * @param {Array: [RegExp, String]} rules Regexp to match paired with String to use for replacement
	   * @param {Array: [String]} skip Strings to skip if they match
	   * @param {String} override String to return as though this method succeeded (used to conform to APIs)
	   * @returns {String} Return passed String modified by passed rules.
	   * @example
	   *
	   *     this._apply_rules( 'cows', singular_rules ); // === 'cow'
	   */
	    _apply_rules : function ( str, rules, skip, override ){
	      if( override ){
	        str = override;
	      }else{
	        var ignore = ( inflector.indexOf( skip, str.toLowerCase()) > -1 );

	        if( !ignore ){
	          var i = 0;
	          var j = rules.length;

	          for( ; i < j; i++ ){
	            if( str.match( rules[ i ][ 0 ])){
	              if( rules[ i ][ 1 ] !== undefined ){
	                str = str.replace( rules[ i ][ 0 ], rules[ i ][ 1 ]);
	              }
	              break;
	            }
	          }
	        }
	      }

	      return str;
	    },



	  /**
	   * This lets us detect if an Array contains a given element.
	   * @public
	   * @function
	   * @param {Array} arr The subject array.
	   * @param {Object} item Object to locate in the Array.
	   * @param {Number} from_index Starts checking from this position in the Array.(optional)
	   * @param {Function} compare_func Function used to compare Array item vs passed item.(optional)
	   * @returns {Number} Return index position in the Array of the passed item.
	   * @example
	   *
	   *     var inflection = require( 'inflection' );
	   *
	   *     inflection.indexOf([ 'hi','there' ], 'guys' ); // === -1
	   *     inflection.indexOf([ 'hi','there' ], 'hi' ); // === 0
	   */
	    indexOf : function ( arr, item, from_index, compare_func ){
	      if( !from_index ){
	        from_index = -1;
	      }

	      var index = -1;
	      var i     = from_index;
	      var j     = arr.length;

	      for( ; i < j; i++ ){
	        if( arr[ i ]  === item || compare_func && compare_func( arr[ i ], item )){
	          index = i;
	          break;
	        }
	      }

	      return index;
	    },



	  /**
	   * This function adds pluralization support to every String object.
	   * @public
	   * @function
	   * @param {String} str The subject string.
	   * @param {String} plural Overrides normal output with said String.(optional)
	   * @returns {String} Singular English language nouns are returned in plural form.
	   * @example
	   *
	   *     var inflection = require( 'inflection' );
	   *
	   *     inflection.pluralize( 'person' ); // === 'people'
	   *     inflection.pluralize( 'octopus' ); // === 'octopi'
	   *     inflection.pluralize( 'Hat' ); // === 'Hats'
	   *     inflection.pluralize( 'person', 'guys' ); // === 'guys'
	   */
	    pluralize : function ( str, plural ){
	      return inflector._apply_rules( str, plural_rules, uncountable_words, plural );
	    },



	  /**
	   * This function adds singularization support to every String object.
	   * @public
	   * @function
	   * @param {String} str The subject string.
	   * @param {String} singular Overrides normal output with said String.(optional)
	   * @returns {String} Plural English language nouns are returned in singular form.
	   * @example
	   *
	   *     var inflection = require( 'inflection' );
	   *
	   *     inflection.singularize( 'people' ); // === 'person'
	   *     inflection.singularize( 'octopi' ); // === 'octopus'
	   *     inflection.singularize( 'Hats' ); // === 'Hat'
	   *     inflection.singularize( 'guys', 'person' ); // === 'person'
	   */
	    singularize : function ( str, singular ){
	      return inflector._apply_rules( str, singular_rules, uncountable_words, singular );
	    },



	  /**
	   * This function adds camelization support to every String object.
	   * @public
	   * @function
	   * @param {String} str The subject string.
	   * @param {Boolean} low_first_letter Default is to capitalize the first letter of the results.(optional)
	   *                                 Passing true will lowercase it.
	   * @returns {String} Lower case underscored words will be returned in camel case.
	   *                  additionally '/' is translated to '::'
	   * @example
	   *
	   *     var inflection = require( 'inflection' );
	   *
	   *     inflection.camelize( 'message_properties' ); // === 'MessageProperties'
	   *     inflection.camelize( 'message_properties', true ); // === 'messageProperties'
	   */
	    camelize : function ( str, low_first_letter ){
	      var str_path = str.split( '/' );
	      var i        = 0;
	      var j        = str_path.length;
	      var str_arr, init_x, k, l, first;

	      for( ; i < j; i++ ){
	        str_arr = str_path[ i ].split( '_' );
	        k       = 0;
	        l       = str_arr.length;

	        for( ; k < l; k++ ){
	          if( k !== 0 ){
	            str_arr[ k ] = str_arr[ k ].toLowerCase();
	          }

	          first = str_arr[ k ].charAt( 0 );
	          first = low_first_letter && i === 0 && k === 0
	            ? first.toLowerCase() : first.toUpperCase();
	          str_arr[ k ] = first + str_arr[ k ].substring( 1 );
	        }

	        str_path[ i ] = str_arr.join( '' );
	      }

	      return str_path.join( '::' );
	    },



	  /**
	   * This function adds underscore support to every String object.
	   * @public
	   * @function
	   * @param {String} str The subject string.
	   * @param {Boolean} all_upper_case Default is to lowercase and add underscore prefix.(optional)
	   *                  Passing true will return as entered.
	   * @returns {String} Camel cased words are returned as lower cased and underscored.
	   *                  additionally '::' is translated to '/'.
	   * @example
	   *
	   *     var inflection = require( 'inflection' );
	   *
	   *     inflection.underscore( 'MessageProperties' ); // === 'message_properties'
	   *     inflection.underscore( 'messageProperties' ); // === 'message_properties'
	   *     inflection.underscore( 'MP', true ); // === 'MP'
	   */
	    underscore : function ( str, all_upper_case ){
	      if( all_upper_case && str === str.toUpperCase()) return str;

	      var str_path = str.split( '::' );
	      var i        = 0;
	      var j        = str_path.length;

	      for( ; i < j; i++ ){
	        str_path[ i ] = str_path[ i ].replace( uppercase, '_$1' );
	        str_path[ i ] = str_path[ i ].replace( underbar_prefix, '' );
	      }

	      return str_path.join( '/' ).toLowerCase();
	    },



	  /**
	   * This function adds humanize support to every String object.
	   * @public
	   * @function
	   * @param {String} str The subject string.
	   * @param {Boolean} low_first_letter Default is to capitalize the first letter of the results.(optional)
	   *                                 Passing true will lowercase it.
	   * @returns {String} Lower case underscored words will be returned in humanized form.
	   * @example
	   *
	   *     var inflection = require( 'inflection' );
	   *
	   *     inflection.humanize( 'message_properties' ); // === 'Message properties'
	   *     inflection.humanize( 'message_properties', true ); // === 'message properties'
	   */
	    humanize : function ( str, low_first_letter ){
	      str = str.toLowerCase();
	      str = str.replace( id_suffix, '' );
	      str = str.replace( underbar, ' ' );

	      if( !low_first_letter ){
	        str = inflector.capitalize( str );
	      }

	      return str;
	    },



	  /**
	   * This function adds capitalization support to every String object.
	   * @public
	   * @function
	   * @param {String} str The subject string.
	   * @returns {String} All characters will be lower case and the first will be upper.
	   * @example
	   *
	   *     var inflection = require( 'inflection' );
	   *
	   *     inflection.capitalize( 'message_properties' ); // === 'Message_properties'
	   *     inflection.capitalize( 'message properties', true ); // === 'Message properties'
	   */
	    capitalize : function ( str ){
	      str = str.toLowerCase();

	      return str.substring( 0, 1 ).toUpperCase() + str.substring( 1 );
	    },



	  /**
	   * This function adds dasherization support to every String object.
	   * @public
	   * @function
	   * @param {String} str The subject string.
	   * @returns {String} Replaces all spaces or underbars with dashes.
	   * @example
	   *
	   *     var inflection = require( 'inflection' );
	   *
	   *     inflection.dasherize( 'message_properties' ); // === 'message-properties'
	   *     inflection.dasherize( 'Message Properties' ); // === 'Message-Properties'
	   */
	    dasherize : function ( str ){
	      return str.replace( space_or_underbar, '-' );
	    },



	  /**
	   * This function adds titleize support to every String object.
	   * @public
	   * @function
	   * @param {String} str The subject string.
	   * @returns {String} Capitalizes words as you would for a book title.
	   * @example
	   *
	   *     var inflection = require( 'inflection' );
	   *
	   *     inflection.titleize( 'message_properties' ); // === 'Message Properties'
	   *     inflection.titleize( 'message properties to keep' ); // === 'Message Properties to Keep'
	   */
	    titleize : function ( str ){
	      str         = str.toLowerCase().replace( underbar, ' ' );
	      var str_arr = str.split( ' ' );
	      var i       = 0;
	      var j       = str_arr.length;
	      var d, k, l;

	      for( ; i < j; i++ ){
	        d = str_arr[ i ].split( '-' );
	        k = 0;
	        l = d.length;

	        for( ; k < l; k++){
	          if( inflector.indexOf( non_titlecased_words, d[ k ].toLowerCase()) < 0 ){
	            d[ k ] = inflector.capitalize( d[ k ]);
	          }
	        }

	        str_arr[ i ] = d.join( '-' );
	      }

	      str = str_arr.join( ' ' );
	      str = str.substring( 0, 1 ).toUpperCase() + str.substring( 1 );

	      return str;
	    },



	  /**
	   * This function adds demodulize support to every String object.
	   * @public
	   * @function
	   * @param {String} str The subject string.
	   * @returns {String} Removes module names leaving only class names.(Ruby style)
	   * @example
	   *
	   *     var inflection = require( 'inflection' );
	   *
	   *     inflection.demodulize( 'Message::Bus::Properties' ); // === 'Properties'
	   */
	    demodulize : function ( str ){
	      var str_arr = str.split( '::' );

	      return str_arr[ str_arr.length - 1 ];
	    },



	  /**
	   * This function adds tableize support to every String object.
	   * @public
	   * @function
	   * @param {String} str The subject string.
	   * @returns {String} Return camel cased words into their underscored plural form.
	   * @example
	   *
	   *     var inflection = require( 'inflection' );
	   *
	   *     inflection.tableize( 'MessageBusProperty' ); // === 'message_bus_properties'
	   */
	    tableize : function ( str ){
	      str = inflector.underscore( str );
	      str = inflector.pluralize( str );

	      return str;
	    },



	  /**
	   * This function adds classification support to every String object.
	   * @public
	   * @function
	   * @param {String} str The subject string.
	   * @returns {String} Underscored plural nouns become the camel cased singular form.
	   * @example
	   *
	   *     var inflection = require( 'inflection' );
	   *
	   *     inflection.classify( 'message_bus_properties' ); // === 'MessageBusProperty'
	   */
	    classify : function ( str ){
	      str = inflector.camelize( str );
	      str = inflector.singularize( str );

	      return str;
	    },



	  /**
	   * This function adds foreign key support to every String object.
	   * @public
	   * @function
	   * @param {String} str The subject string.
	   * @param {Boolean} drop_id_ubar Default is to seperate id with an underbar at the end of the class name,
	                                 you can pass true to skip it.(optional)
	   * @returns {String} Underscored plural nouns become the camel cased singular form.
	   * @example
	   *
	   *     var inflection = require( 'inflection' );
	   *
	   *     inflection.foreign_key( 'MessageBusProperty' ); // === 'message_bus_property_id'
	   *     inflection.foreign_key( 'MessageBusProperty', true ); // === 'message_bus_propertyid'
	   */
	    foreign_key : function ( str, drop_id_ubar ){
	      str = inflector.demodulize( str );
	      str = inflector.underscore( str ) + (( drop_id_ubar ) ? ( '' ) : ( '_' )) + 'id';

	      return str;
	    },



	  /**
	   * This function adds ordinalize support to every String object.
	   * @public
	   * @function
	   * @param {String} str The subject string.
	   * @returns {String} Return all found numbers their sequence like '22nd'.
	   * @example
	   *
	   *     var inflection = require( 'inflection' );
	   *
	   *     inflection.ordinalize( 'the 1 pitch' ); // === 'the 1st pitch'
	   */
	    ordinalize : function ( str ){
	      var str_arr = str.split( ' ' );
	      var i       = 0;
	      var j       = str_arr.length;

	      for( ; i < j; i++ ){
	        var k = parseInt( str_arr[ i ], 10 );

	        if( !isNaN( k )){
	          var ltd = str_arr[ i ].substring( str_arr[ i ].length - 2 );
	          var ld  = str_arr[ i ].substring( str_arr[ i ].length - 1 );
	          var suf = 'th';

	          if( ltd != '11' && ltd != '12' && ltd != '13' ){
	            if( ld === '1' ){
	              suf = 'st';
	            }else if( ld === '2' ){
	              suf = 'nd';
	            }else if( ld === '3' ){
	              suf = 'rd';
	            }
	          }

	          str_arr[ i ] += suf;
	        }
	      }

	      return str_arr.join( ' ' );
	    },

	  /**
	   * This function performs multiple inflection methods on a string
	   * @public
	   * @function
	   * @param {String} str The subject string.
	   * @param {Array} arr An array of inflection methods.
	   * @returns {String}
	   * @example
	   *
	   *     var inflection = require( 'inflection' );
	   *
	   *     inflection.transform( 'all job', [ 'pluralize', 'capitalize', 'dasherize' ]); // === 'All-jobs'
	   */
	    transform : function ( str, arr ){
	      var i = 0;
	      var j = arr.length;

	      for( ;i < j; i++ ){
	        var method = arr[ i ];

	        if( this.hasOwnProperty( method )){
	          str = this[ method ]( str );
	        }
	      }

	      return str;
	    }
	  };

	/**
	 * @public
	 */
	  inflector.version = '1.3.8';

	  return inflector;
	}));


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var Backbone, DatabaseURL, ModelStream, Queue, Utils, modelEach, modelInterval, _;

	_ = __webpack_require__(1);

	Backbone = __webpack_require__(2);

	Queue = __webpack_require__(10);

	Utils = __webpack_require__(7);

	DatabaseURL = __webpack_require__(11);

	ModelStream = __webpack_require__(33);

	modelEach = __webpack_require__(34);

	modelInterval = __webpack_require__(35);

	__webpack_require__(36);

	module.exports = function(model_type) {
	  var BackboneModelExtensions, fn, key, overrides, _findOrClone, _results;
	  BackboneModelExtensions = (function() {
	    function BackboneModelExtensions() {}

	    return BackboneModelExtensions;

	  })();
	  model_type.createSync = function(target_model_type) {
	    return model_type.prototype.sync('createSync', target_model_type);
	  };
	  model_type.resetSchema = function(options, callback) {
	    var _ref;
	    if (arguments.length === 1) {
	      _ref = [{}, options], options = _ref[0], callback = _ref[1];
	    }
	    return model_type.prototype.sync('resetSchema', options, callback);
	  };
	  model_type.cursor = function(query) {
	    if (query == null) {
	      query = {};
	    }
	    return model_type.prototype.sync('cursor', query);
	  };
	  model_type.destroy = function(query, callback) {
	    var _ref;
	    if (arguments.length === 1) {
	      _ref = [{}, query], query = _ref[0], callback = _ref[1];
	    }
	    if (!_.isObject(query)) {
	      query = {
	        id: query
	      };
	    }
	    return model_type.prototype.sync('destroy', query, callback);
	  };
	  model_type.db = function() {
	    return model_type.prototype.sync('db');
	  };
	  model_type.exists = function(query, callback) {
	    var _ref;
	    if (arguments.length === 1) {
	      _ref = [{}, query], query = _ref[0], callback = _ref[1];
	    }
	    return model_type.prototype.sync('cursor', query).exists(callback);
	  };
	  model_type.count = function(query, callback) {
	    var _ref;
	    if (arguments.length === 1) {
	      _ref = [{}, query], query = _ref[0], callback = _ref[1];
	    }
	    return model_type.prototype.sync('cursor', query).count(callback);
	  };
	  model_type.all = function(callback) {
	    return model_type.prototype.sync('cursor', {}).toModels(callback);
	  };
	  model_type.find = function(query, callback) {
	    var _ref;
	    if (arguments.length === 1) {
	      _ref = [{}, query], query = _ref[0], callback = _ref[1];
	    }
	    return model_type.prototype.sync('cursor', query).toModels(callback);
	  };
	  model_type.findOne = function(query, callback) {
	    var _ref;
	    if (arguments.length === 1) {
	      _ref = [{}, query], query = _ref[0], callback = _ref[1];
	    }
	    query = _.isObject(query) ? _.extend({
	      $one: true
	    }, query) : {
	      id: query,
	      $one: true
	    };
	    return model_type.prototype.sync('cursor', query).toModels(callback);
	  };
	  model_type.findOrCreate = function(data, callback) {
	    var query;
	    if (!_.isObject(data) || Utils.isModel(data) || Utils.isCollection(data)) {
	      throw 'findOrCreate requires object data';
	    }
	    query = _.extend({
	      $one: true
	    }, data);
	    return model_type.prototype.sync('cursor', query).toModels(function(err, model) {
	      if (err) {
	        return callback(err);
	      }
	      if (model) {
	        return callback(null, model);
	      }
	      return (new model_type(data)).save(callback);
	    });
	  };
	  model_type.findOneNearestDate = function(date, options, query, callback) {
	    var functions, key, _ref, _ref1;
	    if (!(key = options.key)) {
	      throw new Error("Missing options key");
	    }
	    if (arguments.length === 2) {
	      _ref = [{}, query], query = _ref[0], callback = _ref[1];
	    } else if (arguments.length === 3) {
	      _ref1 = [new Date(), {}, query], options = _ref1[0], query = _ref1[1], callback = _ref1[2];
	    } else {
	      query = _.clone(query);
	    }
	    query.$one = true;
	    functions = [
	      ((function(_this) {
	        return function(callback) {
	          query[key] = {
	            $lte: date
	          };
	          return model_type.cursor(query).sort("-" + key).toModels(callback);
	        };
	      })(this)), ((function(_this) {
	        return function(callback) {
	          query[key] = {
	            $gte: date
	          };
	          return model_type.cursor(query).sort(key).toModels(callback);
	        };
	      })(this))
	    ];
	    if (options.reverse) {
	      functions = [functions[1], functions[0]];
	    }
	    return functions[0](function(err, model) {
	      if (err) {
	        return callback(err);
	      }
	      if (model) {
	        return callback(null, model);
	      }
	      return functions[1](callback);
	    });
	  };
	  model_type.each = function(query, iterator, callback) {
	    var _ref;
	    if (arguments.length === 2) {
	      _ref = [{}, query, iterator], query = _ref[0], iterator = _ref[1], callback = _ref[2];
	    }
	    return modelEach(model_type, query, iterator, callback);
	  };
	  model_type.eachC = function(query, callback, iterator) {
	    var _ref;
	    if (arguments.length === 2) {
	      _ref = [{}, query, callback], query = _ref[0], callback = _ref[1], iterator = _ref[2];
	    }
	    return modelEach(model_type, query, iterator, callback);
	  };
	  model_type.stream = function(query) {
	    if (query == null) {
	      query = {};
	    }
	    if (!_.isFunction(ModelStream)) {
	      throw new Error('Stream is a large dependency so you need to manually include "stream.js" in the browser.');
	    }
	    return new ModelStream(model_type, query);
	  };
	  model_type.interval = function(query, iterator, callback) {
	    return modelInterval(model_type, query, iterator, callback);
	  };
	  model_type.intervalC = function(query, callback, iterator) {
	    return modelInterval(model_type, query, iterator, callback);
	  };
	  model_type.prototype.modelName = function() {
	    return model_type.model_name;
	  };
	  model_type.prototype.cache = function() {
	    return model_type.cache;
	  };
	  model_type.prototype.schema = model_type.schema = function() {
	    return model_type.prototype.sync('schema');
	  };
	  model_type.prototype.tableName = model_type.tableName = function() {
	    return model_type.prototype.sync('tableName');
	  };
	  model_type.prototype.relation = model_type.relation = function(key) {
	    var schema;
	    if (schema = model_type.prototype.sync('schema')) {
	      return schema.relation(key);
	    } else {
	      return void 0;
	    }
	  };
	  model_type.prototype.relationIsEmbedded = model_type.relationIsEmbedded = function(key) {
	    var relation;
	    if (relation = model_type.relation(key)) {
	      return !!relation.embed;
	    } else {
	      return false;
	    }
	  };
	  model_type.prototype.reverseRelation = model_type.reverseRelation = function(key) {
	    var schema;
	    if (schema = model_type.prototype.sync('schema')) {
	      return schema.reverseRelation(key);
	    } else {
	      return void 0;
	    }
	  };
	  model_type.prototype.isLoaded = function(key) {
	    if (arguments.length === 0) {
	      key = '__model__';
	    }
	    return !Utils.orSet(this, 'needs_load', {})[key];
	  };
	  model_type.prototype.setLoaded = function(key, is_loaded) {
	    var needs_load, _ref;
	    if (arguments.length === 1) {
	      _ref = ['__model__', key], key = _ref[0], is_loaded = _ref[1];
	    }
	    needs_load = Utils.orSet(this, 'needs_load', {});
	    if (is_loaded && Utils.get(this, 'is_initialized')) {
	      delete needs_load[key];
	      return;
	    }
	    return needs_load[key] = !is_loaded;
	  };
	  model_type.prototype.isLoadedExists = function(key) {
	    if (arguments.length === 0) {
	      key = '__model__';
	    }
	    return Utils.orSet(this, 'needs_load', {}).hasOwnProperty(key);
	  };
	  model_type.prototype.isPartial = function() {
	    return !!Utils.get(this, 'partial');
	  };
	  model_type.prototype.setPartial = function(is_partial) {
	    if (is_partial) {
	      return Utils.set(this, 'partial', true);
	    } else {
	      return Utils.unset(this, 'partial');
	    }
	  };
	  model_type.prototype.addUnset = function(key) {
	    var unsets;
	    unsets = Utils.orSet(this, 'unsets', []);
	    if (unsets.indexOf(key) < 0) {
	      return unsets.push(key);
	    }
	  };
	  model_type.prototype.removeUnset = function(key) {
	    var index, unsets;
	    if (!(unsets = Utils.get(this, 'unsets', null))) {
	      return;
	    }
	    if ((index = unsets.indexOf(key)) >= 0) {
	      return unsets.splice(index, 1);
	    }
	  };
	  model_type.prototype.fetchRelated = function(relations, callback) {
	    var queue, _ref;
	    if (arguments.length === 1) {
	      _ref = [null, relations], relations = _ref[0], callback = _ref[1];
	    }
	    queue = new Queue(1);
	    queue.defer((function(_this) {
	      return function(callback) {
	        if (_this.isLoaded()) {
	          return callback();
	        }
	        return _this.fetch(callback);
	      };
	    })(this));
	    queue.defer((function(_this) {
	      return function(callback) {
	        var key, keys, relations_queue, _fn, _i, _len;
	        keys = _.keys(Utils.orSet(_this, 'needs_load', {}));
	        if (relations && !_.isArray(relations)) {
	          relations = [relations];
	        }
	        if (_.isArray(relations)) {
	          keys = _.intersection(keys, relations);
	        }
	        relations_queue = new Queue();
	        _fn = function(key) {
	          return relations_queue.defer(function(callback) {
	            return _this.get(key, callback);
	          });
	        };
	        for (_i = 0, _len = keys.length; _i < _len; _i++) {
	          key = keys[_i];
	          _fn(key);
	        }
	        return relations_queue.await(callback);
	      };
	    })(this));
	    return queue.await(callback);
	  };
	  model_type.prototype.patchAdd = function(key, relateds, callback) {
	    var relation;
	    if (!(relation = this.relation(key))) {
	      return callback(new Error("patchAdd: relation '" + key + "' unrecognized"));
	    }
	    if (!relateds) {
	      return callback(new Error("patchAdd: missing relateds for '" + key + "'"));
	    }
	    return relation.patchAdd(this, relateds, callback);
	  };
	  model_type.prototype.patchRemove = function(key, relateds, callback) {
	    var queue, relation, schema, _fn, _ref;
	    if (arguments.length === 1) {
	      callback = key;
	      schema = model_type.schema();
	      queue = new Queue(1);
	      _ref = schema.relations;
	      _fn = (function(_this) {
	        return function(relation) {
	          return queue.defer(function(callback) {
	            return relation.patchRemove(_this, callback);
	          });
	        };
	      })(this);
	      for (key in _ref) {
	        relation = _ref[key];
	        _fn(relation);
	      }
	      return queue.await(callback);
	    } else {
	      if (!(relation = this.relation(key))) {
	        return callback(new Error("patchRemove: relation '" + key + "' unrecognized"));
	      }
	      if (arguments.length === 2) {
	        callback = relateds;
	        return relation.patchRemove(this, callback);
	      } else {
	        if (!relateds) {
	          return callback(new Error("patchRemove: missing relateds for '" + key + "'"));
	        }
	        return relation.patchRemove(this, relateds, callback);
	      }
	    }
	  };
	  model_type.prototype.cursor = function(key, query) {
	    var relation, schema;
	    if (query == null) {
	      query = {};
	    }
	    if (model_type.schema) {
	      schema = model_type.schema();
	    }
	    if (schema && (relation = schema.relation(key))) {
	      return relation.cursor(this, key, query);
	    } else {
	      throw new Error("" + schema.model_name + "::cursor: Unexpected key: " + key + " is not a relation");
	    }
	  };
	  _findOrClone = function(model, options) {
	    var cache, clone, _base, _name;
	    if (model.isNew() || !model.modelName) {
	      return model.clone(options);
	    }
	    cache = (_base = options._cache)[_name = model.modelName()] || (_base[_name] = {});
	    if (!(clone = cache[model.id])) {
	      clone = cache[model.id] = model.clone(options);
	    }
	    return clone;
	  };
	  overrides = {
	    initialize: function(attributes) {
	      var key, needs_load, relation, schema, value, _ref;
	      if (model_type.schema && (schema = model_type.schema())) {
	        _ref = schema.relations;
	        for (key in _ref) {
	          relation = _ref[key];
	          relation.initializeModel(this);
	        }
	        needs_load = Utils.orSet(this, 'needs_load', {});
	        for (key in needs_load) {
	          value = needs_load[key];
	          if (!value) {
	            delete needs_load[key];
	          }
	        }
	        Utils.set(this, 'is_initialized', true);
	      }
	      return model_type.prototype._orm_original_fns.initialize.apply(this, arguments);
	    },
	    fetch: function(options) {
	      var callback;
	      if (_.isFunction(callback = arguments[arguments.length - 1])) {
	        switch (arguments.length) {
	          case 1:
	            options = Utils.wrapOptions({}, callback);
	            break;
	          case 2:
	            options = Utils.wrapOptions(options, callback);
	        }
	      } else {
	        options || (options = {});
	      }
	      return model_type.prototype._orm_original_fns.fetch.call(this, Utils.wrapOptions(options, (function(_this) {
	        return function(err, model, resp, options) {
	          if (err) {
	            return typeof options.error === "function" ? options.error(_this, resp, options) : void 0;
	          }
	          _this.setLoaded(true);
	          return typeof options.success === "function" ? options.success(_this, resp, options) : void 0;
	        };
	      })(this)));
	    },
	    unset: function(key) {
	      var id;
	      this.addUnset(key);
	      id = this.id;
	      model_type.prototype._orm_original_fns.unset.apply(this, arguments);
	      if (key === 'id' && model_type.cache && id && (model_type.cache.get(id) === this)) {
	        return model_type.cache.destroy(id);
	      }
	    },
	    set: function(key, value, options) {
	      var attributes, relation, relational_attributes, schema, simple_attributes;
	      if (!(model_type.schema && (schema = model_type.schema()))) {
	        return model_type.prototype._orm_original_fns.set.apply(this, arguments);
	      }
	      if (_.isString(key)) {
	        (attributes = {})[key] = value;
	      } else {
	        attributes = key;
	        options = value;
	      }
	      simple_attributes = {};
	      relational_attributes = {};
	      for (key in attributes) {
	        value = attributes[key];
	        if (relation = schema.relation(key)) {
	          relational_attributes[key] = relation;
	        } else {
	          simple_attributes[key] = value;
	        }
	      }
	      if (_.size(simple_attributes)) {
	        model_type.prototype._orm_original_fns.set.call(this, simple_attributes, options);
	      }
	      for (key in relational_attributes) {
	        relation = relational_attributes[key];
	        relation.set(this, key, attributes[key], options);
	      }
	      return this;
	    },
	    get: function(key, callback) {
	      var relation, schema, value;
	      if (model_type.schema) {
	        schema = model_type.schema();
	      }
	      if (schema && (relation = schema.relation(key))) {
	        return relation.get(this, key, callback);
	      }
	      value = model_type.prototype._orm_original_fns.get.call(this, key);
	      if (callback) {
	        callback(null, value);
	      }
	      return value;
	    },
	    toJSON: function(options) {
	      var json, key, keys, relation, schema, value, _base, _i, _len;
	      if (options == null) {
	        options = {};
	      }
	      if (model_type.schema) {
	        schema = model_type.schema();
	      }
	      this._orm || (this._orm = {});
	      if (this._orm.json > 0) {
	        return this.id;
	      }
	      (_base = this._orm).json || (_base.json = 0);
	      this._orm.json++;
	      json = {};
	      keys = options.keys || this.whitelist || _.keys(this.attributes);
	      for (_i = 0, _len = keys.length; _i < _len; _i++) {
	        key = keys[_i];
	        value = this.attributes[key];
	        if (schema && (relation = schema.relation(key))) {
	          relation.appendJSON(json, this);
	        } else if (Utils.isCollection(value)) {
	          json[key] = _.map(value.models, function(model) {
	            if (model) {
	              return model.toJSON(options);
	            } else {
	              return null;
	            }
	          });
	        } else if (Utils.isModel(value)) {
	          json[key] = value.toJSON(options);
	        } else {
	          json[key] = value;
	        }
	      }
	      --this._orm.json;
	      return json;
	    },
	    save: function(key, value, options) {
	      var attributes, callback, _base;
	      if (_.isFunction(callback = arguments[arguments.length - 1])) {
	        switch (arguments.length) {
	          case 1:
	            attributes = {};
	            options = Utils.wrapOptions({}, callback);
	            break;
	          case 2:
	            attributes = key;
	            options = Utils.wrapOptions({}, callback);
	            break;
	          case 3:
	            attributes = key;
	            options = Utils.wrapOptions(value, callback);
	            break;
	          case 4:
	            (attributes = {})[key] = value;
	            options = Utils.wrapOptions(options, callback);
	        }
	      } else {
	        if (arguments.length === 0) {
	          attributes = {};
	          options = {};
	        } else if (key === null || _.isObject(key)) {
	          attributes = key;
	          options = value;
	        } else {
	          (attributes = {})[key] = value;
	        }
	      }
	      if (!this.isLoaded()) {
	        return typeof options.error === "function" ? options.error(this, new Error("An unloaded model is trying to be saved: " + model_type.model_name)) : void 0;
	      }
	      this._orm || (this._orm = {});
	      if (this._orm.save > 0) {
	        if (this.id) {
	          return typeof options.success === "function" ? options.success(this, {}, options) : void 0;
	        }
	        return typeof options.error === "function" ? options.error(this, new Error("Model is in a save loop: " + model_type.model_name)) : void 0;
	      }
	      (_base = this._orm).save || (_base.save = 0);
	      this._orm.save++;
	      this.set(attributes, options);
	      attributes = {};
	      return Utils.presaveBelongsToRelationships(this, (function(_this) {
	        return function(err) {
	          if (err) {
	            return typeof options.error === "function" ? options.error(_this, err) : void 0;
	          }
	          return model_type.prototype._orm_original_fns.save.call(_this, attributes, Utils.wrapOptions(options, function(err, model, resp, options) {
	            var queue, relation, schema, _fn, _ref;
	            Utils.unset(_this, 'unsets');
	            --_this._orm.save;
	            if (err) {
	              return typeof options.error === "function" ? options.error(_this, resp, options) : void 0;
	            }
	            queue = new Queue(1);
	            if (model_type.schema) {
	              schema = model_type.schema();
	              _ref = schema.relations;
	              _fn = function(relation) {
	                return queue.defer(function(callback) {
	                  return relation.save(_this, callback);
	                });
	              };
	              for (key in _ref) {
	                relation = _ref[key];
	                _fn(relation);
	              }
	            }
	            return queue.await(function(err) {
	              var cache;
	              if (err) {
	                return typeof options.error === "function" ? options.error(_this, Error("Failed to save relations. " + err, options)) : void 0;
	              }
	              if (cache = model_type.cache) {
	                cache.set(_this.id, _this);
	              }
	              return typeof options.success === "function" ? options.success(_this, resp, options) : void 0;
	            });
	          }));
	        };
	      })(this));
	    },
	    destroy: function(options) {
	      var cache, callback, schema, _base;
	      if (_.isFunction(callback = arguments[arguments.length - 1])) {
	        switch (arguments.length) {
	          case 1:
	            options = Utils.wrapOptions({}, callback);
	            break;
	          case 2:
	            options = Utils.wrapOptions(options, callback);
	        }
	      }
	      if (cache = this.cache()) {
	        cache.destroy(this.id);
	      }
	      if (!(model_type.schema && (schema = model_type.schema()))) {
	        return model_type.prototype._orm_original_fns.destroy.call(this, options);
	      }
	      this._orm || (this._orm = {});
	      if (this._orm.destroy > 0) {
	        throw new Error("Model is in a destroy loop: " + model_type.model_name);
	      }
	      (_base = this._orm).destroy || (_base.destroy = 0);
	      this._orm.destroy++;
	      return model_type.prototype._orm_original_fns.destroy.call(this, Utils.wrapOptions(options, (function(_this) {
	        return function(err, model, resp, options) {
	          --_this._orm.destroy;
	          if (err) {
	            return typeof options.error === "function" ? options.error(_this, resp, options) : void 0;
	          }
	          return _this.patchRemove(function(err) {
	            if (err) {
	              return typeof options.error === "function" ? options.error(_this, new Error("Failed to destroy relations. " + err, options)) : void 0;
	            }
	            return typeof options.success === "function" ? options.success(_this, resp, options) : void 0;
	          });
	        };
	      })(this)));
	    },
	    clone: function(options) {
	      var cache, clone, key, keys, model, value, _base, _base1, _i, _len, _name, _ref;
	      if (!model_type.schema) {
	        return model_type.prototype._orm_original_fns.clone.apply(this, arguments);
	      }
	      options || (options = {});
	      options._cache || (options._cache = {});
	      cache = (_base = options._cache)[_name = this.modelName()] || (_base[_name] = {});
	      this._orm || (this._orm = {});
	      if (this._orm.clone > 0) {
	        if (this.id) {
	          return cache[this.id];
	        } else {
	          return model_type.prototype._orm_original_fns.clone.apply(this, arguments);
	        }
	      }
	      (_base1 = this._orm).clone || (_base1.clone = 0);
	      this._orm.clone++;
	      if (this.id) {
	        if (!(clone = cache[this.id])) {
	          cache[this.id] = clone = new this.constructor();
	        }
	      } else {
	        clone = new this.constructor();
	      }
	      if (this.attributes.id) {
	        clone.id = this.attributes.id;
	      }
	      keys = options.keys || _.keys(this.attributes);
	      for (_i = 0, _len = keys.length; _i < _len; _i++) {
	        key = keys[_i];
	        value = this.attributes[key];
	        if (Utils.isCollection(value)) {
	          if (!((_ref = clone.attributes[key]) != null ? _ref.values : void 0)) {
	            clone.attributes[key] = new value.constructor();
	          }
	          clone.attributes[key].models = (function() {
	            var _j, _len1, _ref1, _results;
	            _ref1 = value.models;
	            _results = [];
	            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
	              model = _ref1[_j];
	              _results.push(_findOrClone(model, options));
	            }
	            return _results;
	          })();
	        } else if (Utils.isModel(value)) {
	          clone.attributes[key] = _findOrClone(value, options);
	        } else {
	          clone.attributes[key] = value;
	        }
	      }
	      --this._orm.clone;
	      return clone;
	    }
	  };
	  if (!model_type.prototype._orm_original_fns) {
	    model_type.prototype._orm_original_fns = {};
	    _results = [];
	    for (key in overrides) {
	      fn = overrides[key];
	      model_type.prototype._orm_original_fns[key] = model_type.prototype[key];
	      _results.push(model_type.prototype[key] = fn);
	    }
	    return _results;
	  }
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var Backbone, BackboneORM, One, Queue, Utils, _,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	_ = __webpack_require__(1);

	Backbone = __webpack_require__(2);

	BackboneORM = __webpack_require__(4);

	Queue = __webpack_require__(10);

	Utils = __webpack_require__(7);

	module.exports = One = (function(_super) {
	  __extends(One, _super);

	  function One(model_type, key, options) {
	    var value;
	    this.model_type = model_type;
	    this.key = key;
	    for (key in options) {
	      value = options[key];
	      this[key] = value;
	    }
	    this.virtual_id_accessor || (this.virtual_id_accessor = BackboneORM.naming_conventions.foreignKey(this.key));
	    if (!this.join_key) {
	      this.join_key = this.foreign_key || BackboneORM.naming_conventions.foreignKey(this.model_type.model_name);
	    }
	    if (!this.foreign_key) {
	      this.foreign_key = BackboneORM.naming_conventions.foreignKey(this.type === 'belongsTo' ? this.key : this.as || this.model_type.model_name);
	    }
	  }

	  One.prototype.initialize = function() {
	    var _ref;
	    this.reverse_relation = this._findOrGenerateReverseRelation(this);
	    if (this.embed && this.reverse_relation && this.reverse_relation.embed) {
	      throw new Error("Both relationship directions cannot embed (" + this.model_type.model_name + " and " + this.reverse_model_type.model_name + "). Choose one or the other.");
	    }
	    if (this.embed) {
	      this.model_type.schema().type('id', this.reverse_model_type.schema().type('id'));
	    }
	    return (_ref = this.reverse_model_type) != null ? _ref.schema().type(this.foreign_key, this.model_type) : void 0;
	  };

	  One.prototype.initializeModel = function(model) {
	    if (!model.isLoadedExists(this.key)) {
	      model.setLoaded(this.key, this.isEmbedded());
	    }
	    return this._bindBacklinks(model);
	  };

	  One.prototype.releaseModel = function(model) {
	    this._unbindBacklinks(model);
	    return delete model._orm;
	  };

	  One.prototype.set = function(model, key, value, options) {
	    var is_model, merge_into_existing, new_related_id, previous_related_id, previous_related_model;
	    if (!((key === this.key) || (key === this.virtual_id_accessor) || (key === this.foreign_key))) {
	      throw new Error("One.set: Unexpected key " + key + ". Expecting: " + this.key + " or " + this.virtual_id_accessor + " or " + this.foreign_key);
	    }
	    if (_.isArray(value)) {
	      throw new Error("One.set: cannot set an array for attribute " + this.key + " on " + this.model_type.model_name);
	    }
	    if (_.isUndefined(value)) {
	      value = null;
	    }
	    if (value === (previous_related_model = model.get(this.key))) {
	      return this;
	    }
	    is_model = Utils.isModel(value);
	    new_related_id = Utils.dataId(value);
	    previous_related_id = Utils.dataId(previous_related_model);
	    Utils.orSet(model, 'rel_dirty', {})[this.key] = true;
	    if ((previous_related_id !== new_related_id) || !model.isLoaded(this.key)) {
	      if ((is_model && (value.isLoaded())) && (new_related_id !== value)) {
	        model.setLoaded(this.key, true);
	      } else {
	        model.setLoaded(this.key, _.isNull(value));
	      }
	    }
	    if (value && !is_model) {
	      if (!(merge_into_existing = previous_related_id === new_related_id)) {
	        value = Utils.updateOrNew(value, this.reverse_model_type);
	      }
	    }
	    if (!merge_into_existing) {
	      Backbone.Model.prototype.set.call(model, this.key, value, options);
	    }
	    if (merge_into_existing) {
	      Utils.updateModel(previous_related_model, value);
	    } else if ((value === null) && this.reverse_relation && (this.reverse_relation.type === 'hasOne' || this.reverse_relation.type === 'belongsTo')) {
	      if (!(this.embed || this.reverse_relation.embed)) {
	        if (model.isLoaded(this.key) && previous_related_model && (previous_related_model.get(this.reverse_relation.key) === model)) {
	          previous_related_model.set(this.reverse_relation.key, null);
	        }
	      }
	    }
	    return this;
	  };

	  One.prototype.get = function(model, key, callback) {
	    var is_loaded, result, returnValue;
	    if (!((key === this.key) || (key === this.virtual_id_accessor) || (key === this.foreign_key))) {
	      throw new Error("One.get: Unexpected key " + key + ". Expecting: " + this.key + " or " + this.virtual_id_accessor + " or " + this.foreign_key);
	    }
	    returnValue = (function(_this) {
	      return function() {
	        var related_model;
	        if (!(related_model = model.attributes[_this.key])) {
	          return null;
	        }
	        if (key === _this.virtual_id_accessor) {
	          return related_model.id;
	        } else {
	          return related_model;
	        }
	      };
	    })(this);
	    if (callback && !this.isVirtual() && !this.manual_fetch && !(is_loaded = model.isLoaded(this.key))) {
	      this.cursor(model, key).toJSON((function(_this) {
	        return function(err, json) {
	          var previous_related_model, related_model;
	          if (err) {
	            return callback(err);
	          }
	          if (key !== _this.virtual_id_accessor) {
	            model.setLoaded(_this.key, true);
	          }
	          previous_related_model = model.get(_this.key);
	          if (previous_related_model && (previous_related_model.id === (json != null ? json.id : void 0))) {
	            Utils.updateModel(previous_related_model, json);
	          } else {
	            related_model = json ? Utils.updateOrNew(json, _this.reverse_model_type) : null;
	            model.set(_this.key, related_model);
	          }
	          return callback(null, returnValue());
	        };
	      })(this));
	    }
	    result = returnValue();
	    if (callback && (is_loaded || this.manual_fetch)) {
	      callback(null, result);
	    }
	    return result;
	  };

	  One.prototype.save = function(model, callback) {
	    var related_model;
	    if (!this._hasChanged(model)) {
	      return callback();
	    }
	    delete Utils.orSet(model, 'rel_dirty', {})[this.key];
	    if (!(related_model = model.attributes[this.key])) {
	      return callback();
	    }
	    return this._saveRelated(model, [related_model], callback);
	  };

	  One.prototype.patchAdd = function(model, related, callback) {
	    var found_related, related_id;
	    if (!model.id) {
	      return callback(new Error("One.patchAdd: model has null id for: " + this.key));
	    }
	    if (!related) {
	      return callback(new Error("One.patchAdd: missing model for: " + this.key));
	    }
	    if (_.isArray(related)) {
	      return callback(new Error("One.patchAdd: should be provided with one model only for key: " + this.key));
	    }
	    if (!(related_id = Utils.dataId(related))) {
	      return callback(new Error("One.patchAdd: cannot add a new model. Please save first."));
	    }
	    if (this.reverse_model_type.cache && !Utils.isModel(related)) {
	      if (found_related = this.reverse_model_type.cache.get(related_id)) {
	        Utils.updateModel(found_related, related);
	        related = found_related;
	      }
	    }
	    model.set(this.key, related);
	    if (this.type === 'belongsTo') {
	      return this.model_type.cursor({
	        id: model.id,
	        $one: true
	      }).toJSON((function(_this) {
	        return function(err, model_json) {
	          if (err) {
	            return callback(err);
	          }
	          if (!model_json) {
	            return callback(new Error("Failed to fetch model with id: " + model.id));
	          }
	          model_json[_this.foreign_key] = related_id;
	          return model.save(model_json, callback);
	        };
	      })(this));
	    } else {
	      return this.cursor(model, this.key).toJSON((function(_this) {
	        return function(err, current_related_json) {
	          var queue;
	          if (err) {
	            return callback(err);
	          }
	          if (current_related_json && (related_id === current_related_json[_this.reverse_model_type.prototype.idAttribute])) {
	            return callback();
	          }
	          queue = new Queue(1);
	          if (current_related_json) {
	            queue.defer(function(callback) {
	              return _this.patchRemove(model, current_related_json, callback);
	            });
	          }
	          queue.defer(function(callback) {
	            var query, related_json;
	            if (Utils.isModel(related)) {
	              if (related.isLoaded()) {
	                related_json = related.toJSON();
	              }
	            } else if (related_id !== related) {
	              related_json = related;
	            }
	            if (related_json) {
	              related_json[_this.reverse_relation.foreign_key] = model.id;
	              return Utils.modelJSONSave(related_json, _this.reverse_model_type, callback);
	            } else {
	              query = {
	                $one: true
	              };
	              query.id = related_id;
	              return _this.reverse_model_type.cursor(query).toJSON(function(err, related_json) {
	                if (err) {
	                  return callback(err);
	                }
	                if (!related_json) {
	                  return callback();
	                }
	                related_json[_this.reverse_relation.foreign_key] = model.id;
	                return Utils.modelJSONSave(related_json, _this.reverse_model_type, callback);
	              });
	            }
	          });
	          return queue.await(callback);
	        };
	      })(this));
	    }
	  };

	  One.prototype.patchRemove = function(model, relateds, callback) {
	    var current_related_model, related, related_ids, _i, _len;
	    if (arguments.length === 2) {
	      callback = relateds;
	      relateds = void 0;
	    }
	    if (!model.id) {
	      return callback(new Error("One.patchRemove: model has null id for: " + this.key));
	    }
	    if (arguments.length === 2) {
	      if (!this.reverse_relation) {
	        return callback();
	      }
	      if (Utils.isModel(model)) {
	        delete Utils.orSet(model, 'rel_dirty', {})[this.key];
	      }
	      this.cursor(model, this.key).toJSON((function(_this) {
	        return function(err, related_json) {
	          if (err) {
	            return callback(err);
	          }
	          if (!related_json) {
	            return callback();
	          }
	          related_json[_this.reverse_relation.foreign_key] = null;
	          return Utils.modelJSONSave(related_json, _this.reverse_model_type, callback);
	        };
	      })(this));
	      return;
	    }
	    if (this.isEmbedded()) {
	      return callback(new Error('One.patchRemove: embedded relationships are not supported'));
	    }
	    if (!relateds) {
	      return callback(new Error('One.patchRemove: missing model for remove'));
	    }
	    if (!_.isArray(relateds)) {
	      relateds = [relateds];
	    }
	    if (current_related_model = model.get(this.key)) {
	      for (_i = 0, _len = relateds.length; _i < _len; _i++) {
	        related = relateds[_i];
	        if (Utils.dataIsSameModel(current_related_model, related)) {
	          model.set(this.key, null);
	          break;
	        }
	      }
	    }
	    related_ids = (function() {
	      var _j, _len1, _results;
	      _results = [];
	      for (_j = 0, _len1 = relateds.length; _j < _len1; _j++) {
	        related = relateds[_j];
	        _results.push(Utils.dataId(related));
	      }
	      return _results;
	    })();
	    if (this.type === 'belongsTo') {
	      return this.model_type.cursor({
	        id: model.id,
	        $one: true
	      }).toJSON((function(_this) {
	        return function(err, model_json) {
	          if (err) {
	            return callback(err);
	          }
	          if (!model_json) {
	            return callback();
	          }
	          if (!_.contains(related_ids, model_json[_this.foreign_key])) {
	            return callback();
	          }
	          model_json[_this.foreign_key] = null;
	          return Utils.modelJSONSave(model_json, _this.model_type, callback);
	        };
	      })(this));
	    } else {
	      return this.cursor(model, this.key).toJSON((function(_this) {
	        return function(err, related_json) {
	          if (err) {
	            return callback(err);
	          }
	          if (!related_json) {
	            return callback();
	          }
	          if (!_.contains(related_ids, related_json[_this.reverse_model_type.prototype.idAttribute])) {
	            return callback();
	          }
	          related_json[_this.reverse_relation.foreign_key] = null;
	          return Utils.modelJSONSave(related_json, _this.reverse_model_type, callback);
	        };
	      })(this));
	    }
	  };

	  One.prototype.appendJSON = function(json, model) {
	    var json_key, related_model;
	    if (this.isVirtual()) {
	      return;
	    }
	    json_key = this.embed ? this.key : this.foreign_key;
	    if (!(related_model = model.attributes[this.key])) {
	      if (this.embed || this.type === 'belongsTo') {
	        json[json_key] = null;
	      }
	      return;
	    }
	    if (this.embed) {
	      return json[json_key] = related_model.toJSON();
	    }
	    if (this.type === 'belongsTo') {
	      return json[json_key] = related_model.id;
	    }
	  };

	  One.prototype.cursor = function(model, key, query) {
	    var _ref;
	    query = _.extend({
	      $one: true
	    }, query || {});
	    if (Utils.isModel(model)) {
	      if (this.type === 'belongsTo') {
	        if (!(query.id = (_ref = model.attributes[this.key]) != null ? _ref.id : void 0)) {
	          query.$zero = true;
	          delete query.id;
	        }
	      } else {
	        if (!model.id) {
	          throw new Error('Cannot create cursor for non-loaded model');
	        }
	        query[this.reverse_relation.foreign_key] = model.id;
	      }
	    } else {
	      if (this.type === 'belongsTo') {
	        if (!(query.id = model[this.foreign_key])) {
	          query.$zero = true;
	          delete query.id;
	        }
	      } else {
	        if (!model.id) {
	          throw new Error('Cannot create cursor for non-loaded model');
	        }
	        query[this.reverse_relation.foreign_key] = model.id;
	      }
	    }
	    if (key === this.virtual_id_accessor) {
	      query.$values = ['id'];
	    }
	    return this.reverse_model_type.cursor(query);
	  };

	  One.prototype._bindBacklinks = function(model) {
	    var events, related_model, setBacklink;
	    if (!this.reverse_relation) {
	      return;
	    }
	    events = Utils.set(model, 'events', {});
	    setBacklink = (function(_this) {
	      return function(related_model) {
	        if (_this.reverse_relation.add) {
	          return _this.reverse_relation.add(related_model, model);
	        } else {
	          return related_model.set(_this.reverse_relation.key, model);
	        }
	      };
	    })(this);
	    events.change = (function(_this) {
	      return function(model) {
	        var current_model, previous_related_model, related_model;
	        related_model = model.get(_this.key);
	        previous_related_model = model.previous(_this.key);
	        if (Utils.dataId(related_model) === Utils.dataId(previous_related_model)) {
	          return;
	        }
	        if (previous_related_model && (_this.reverse_relation && _this.reverse_relation.type !== 'belongsTo')) {
	          if (_this.reverse_relation.remove) {
	            if (!_this.isVirtual() || !related_model) {
	              _this.reverse_relation.remove(previous_related_model, model);
	            }
	          } else {
	            current_model = previous_related_model.get(_this.reverse_relation.key);
	            if (Utils.dataId(current_model) === model.id) {
	              previous_related_model.set(_this.reverse_relation.key, null);
	            }
	          }
	        }
	        if (related_model) {
	          return setBacklink(related_model);
	        }
	      };
	    })(this);
	    model.on("change:" + this.key, events.change);
	    if (related_model = model.get(this.key)) {
	      setBacklink(related_model);
	    } else {
	      model.attributes[this.key] = null;
	    }
	    return model;
	  };

	  One.prototype._unbindBacklinks = function(model) {
	    var events;
	    if (!(events = Utils.get(model, 'events'))) {
	      return;
	    }
	    Utils.unset(model, 'events');
	    model.attributes[this.key] = null;
	    model.off("change:" + this.key, events.change);
	    events.change = null;
	  };

	  One.prototype._hasChanged = function(model) {
	    var related_model;
	    return !!Utils.orSet(model, 'rel_dirty', {})[this.key] || model.hasChanged(this.key);
	    if (!this.reverse_relation) {
	      return false;
	    }
	    if (!(related_model = model.attributes[this.key])) {
	      return false;
	    }
	    return related_model.hasChanged(this.reverse_relation.foreign_key);
	  };

	  return One;

	})(__webpack_require__(37));


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var Backbone, BackboneORM, Many, Queue, Utils, _,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	Backbone = __webpack_require__(2);

	_ = __webpack_require__(1);

	BackboneORM = __webpack_require__(4);

	Queue = __webpack_require__(10);

	Utils = __webpack_require__(7);

	module.exports = Many = (function(_super) {
	  __extends(Many, _super);

	  function Many(model_type, key, options) {
	    var Collection, reverse_model_type, value;
	    this.model_type = model_type;
	    this.key = key;
	    for (key in options) {
	      value = options[key];
	      this[key] = value;
	    }
	    this.virtual_id_accessor || (this.virtual_id_accessor = BackboneORM.naming_conventions.foreignKey(this.key, true));
	    if (!this.join_key) {
	      this.join_key = this.foreign_key || BackboneORM.naming_conventions.foreignKey(this.model_type.model_name);
	    }
	    if (!this.foreign_key) {
	      this.foreign_key = BackboneORM.naming_conventions.foreignKey(this.as || this.model_type.model_name);
	    }
	    this._adding_ids = {};
	    if (!this.collection_type) {
	      reverse_model_type = this.reverse_model_type;
	      Collection = (function(_super1) {
	        __extends(Collection, _super1);

	        function Collection() {
	          return Collection.__super__.constructor.apply(this, arguments);
	        }

	        Collection.prototype.model = reverse_model_type;

	        return Collection;

	      })(Backbone.Collection);
	      this.collection_type = Collection;
	    }
	  }

	  Many.prototype.initialize = function() {
	    var _ref, _ref1;
	    this.reverse_relation = this._findOrGenerateReverseRelation(this);
	    if (this.embed && this.reverse_relation && this.reverse_relation.embed) {
	      throw new Error("Both relationship directions cannot embed (" + this.model_type.model_name + " and " + this.reverse_model_type.model_name + "). Choose one or the other.");
	    }
	    if (((_ref = this.reverse_relation) != null ? _ref.type : void 0) === 'hasOne') {
	      throw new Error("The reverse of a hasMany relation should be `belongsTo`, not `hasOne` (" + this.model_type.model_name + " and " + this.reverse_model_type.model_name + ").");
	    }
	    if (this.embed) {
	      this.model_type.schema().type('id', this.reverse_model_type.schema().type('id'));
	    }
	    if ((_ref1 = this.reverse_model_type) != null) {
	      _ref1.schema().type(this.foreign_key, this.model_type);
	    }
	    if (this.reverse_relation.type === 'hasMany') {
	      return this.join_table = this.findOrGenerateJoinTable(this);
	    }
	  };

	  Many.prototype.initializeModel = function(model) {
	    if (!model.isLoadedExists(this.key)) {
	      model.setLoaded(this.key, false);
	    }
	    return this._bindBacklinks(model);
	  };

	  Many.prototype.releaseModel = function(model) {
	    this._unbindBacklinks(model);
	    return delete model._orm;
	  };

	  Many.prototype.set = function(model, key, value, options) {
	    var collection, item, model_ids, models, previous_models, related_model, _i, _len;
	    if (!((key === this.key) || (key === this.virtual_id_accessor) || (key === this.foreign_key))) {
	      throw new Error("Many.set: Unexpected key " + key + ". Expecting: " + this.key + " or " + this.virtual_id_accessor + " or " + this.foreign_key);
	    }
	    collection = this._bindBacklinks(model);
	    if (Utils.isCollection(value)) {
	      value = value.models;
	    }
	    if (_.isUndefined(value)) {
	      value = [];
	    }
	    if (!_.isArray(value)) {
	      throw new Error("HasMany.set: Unexpected type to set " + key + ". Expecting array: " + (JSONUtils.stringify(value)));
	    }
	    Utils.orSet(model, 'rel_dirty', {})[this.key] = true;
	    model.setLoaded(this.key, _.all(value, function(item) {
	      return Utils.dataId(item) !== item;
	    }));
	    models = (function() {
	      var _i, _len, _results;
	      _results = [];
	      for (_i = 0, _len = value.length; _i < _len; _i++) {
	        item = value[_i];
	        _results.push((related_model = collection.get(Utils.dataId(item))) ? Utils.updateModel(related_model, item) : Utils.updateOrNew(item, this.reverse_model_type));
	      }
	      return _results;
	    }).call(this);
	    model.setLoaded(this.key, _.all(models, function(model) {
	      return model.isLoaded();
	    }));
	    previous_models = _.clone(collection.models);
	    collection.reset(models);
	    if (this.reverse_relation.type === 'belongsTo') {
	      model_ids = _.pluck(models, 'id');
	      for (_i = 0, _len = previous_models.length; _i < _len; _i++) {
	        related_model = previous_models[_i];
	        if (!_.contains(model_ids, related_model.id)) {
	          related_model.set(this.foreign_key, null);
	        }
	      }
	    }
	    return this;
	  };

	  Many.prototype.get = function(model, key, callback) {
	    var collection, is_loaded, result, returnValue;
	    if (!((key === this.key) || (key === this.virtual_id_accessor) || (key === this.foreign_key))) {
	      throw new Error("Many.get: Unexpected key " + key + ". Expecting: " + this.key + " or " + this.virtual_id_accessor + " or " + this.foreign_key);
	    }
	    collection = this._ensureCollection(model);
	    returnValue = (function(_this) {
	      return function() {
	        var related_model, _i, _len, _ref, _results;
	        if (key === _this.virtual_id_accessor) {
	          _ref = collection.models;
	          _results = [];
	          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	            related_model = _ref[_i];
	            _results.push(related_model.id);
	          }
	          return _results;
	        } else {
	          return collection;
	        }
	      };
	    })(this);
	    if (callback && !this.isVirtual() && !this.manual_fetch && !(is_loaded = model.isLoaded(this.key))) {
	      this.cursor(model, this.key).toJSON((function(_this) {
	        return function(err, json) {
	          var cache, model_json, related_model, result, _i, _j, _len, _len1, _ref;
	          if (err) {
	            return callback(err);
	          }
	          model.setLoaded(_this.key, true);
	          for (_i = 0, _len = json.length; _i < _len; _i++) {
	            model_json = json[_i];
	            if (related_model = collection.get(model_json[_this.reverse_model_type.prototype.idAttribute])) {
	              related_model.set(model_json);
	            } else {
	              collection.add(related_model = Utils.updateOrNew(model_json, _this.reverse_model_type));
	            }
	          }
	          if (cache = _this.reverse_model_type.cache) {
	            _ref = collection.models;
	            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
	              related_model = _ref[_j];
	              cache.set(related_model.id, related_model);
	            }
	          }
	          result = returnValue();
	          return callback(null, result.models ? result.models : result);
	        };
	      })(this));
	    }
	    result = returnValue();
	    if (callback && (is_loaded || this.manual_fetch)) {
	      callback(null, result.models ? result.models : result);
	    }
	    return result;
	  };

	  Many.prototype.save = function(model, callback) {
	    var collection;
	    if (!this._hasChanged(model)) {
	      return callback();
	    }
	    delete Utils.orSet(model, 'rel_dirty', {})[this.key];
	    collection = this._ensureCollection(model);
	    return this._saveRelated(model, _.clone(collection.models), callback);
	  };

	  Many.prototype.appendJSON = function(json, model) {
	    var collection, json_key;
	    if (this.isVirtual()) {
	      return;
	    }
	    collection = this._ensureCollection(model);
	    json_key = this.embed ? this.key : this.virtual_id_accessor;
	    if (this.embed) {
	      return json[json_key] = collection.toJSON();
	    }
	  };

	  Many.prototype.add = function(model, related_model) {
	    var adding_count, collection, current_related_model, return_value;
	    if (related_model.id) {
	      adding_count = this._adding_ids[related_model.id] = (this._adding_ids[related_model.id] || 0) + 1;
	    }
	    collection = this._ensureCollection(model);
	    current_related_model = collection.get(related_model.id);
	    if (current_related_model === related_model) {
	      return;
	    }
	    if (current_related_model) {
	      collection.remove(current_related_model);
	    }
	    if (this.reverse_model_type.cache && related_model.id) {
	      this.reverse_model_type.cache.set(related_model.id, related_model);
	    }
	    return_value = collection.add(related_model, {
	      silent: adding_count > 1
	    });
	    if (related_model.id) {
	      this._adding_ids[related_model.id]--;
	    }
	    return return_value;
	  };

	  Many.prototype.remove = function(model, related_model) {
	    var collection, current_related_model;
	    collection = this._ensureCollection(model);
	    if (!(current_related_model = collection.get(related_model.id))) {
	      return;
	    }
	    return collection.remove(current_related_model);
	  };

	  Many.prototype.patchAdd = function(model, relateds, callback) {
	    var collection, item, query, queue, related, related_id, related_ids, related_model, _fn, _i, _j, _len, _len1;
	    if (!model.id) {
	      return callback(new Error("Many.patchAdd: model has null id for: " + this.key));
	    }
	    if (!relateds) {
	      return callback(new Error("Many.patchAdd: missing model for: " + this.key));
	    }
	    if (!_.isArray(relateds)) {
	      relateds = [relateds];
	    }
	    collection = this._ensureCollection(model);
	    relateds = (function() {
	      var _i, _len, _results;
	      _results = [];
	      for (_i = 0, _len = relateds.length; _i < _len; _i++) {
	        item = relateds[_i];
	        _results.push((related_model = collection.get(Utils.dataId(item))) ? Utils.updateModel(related_model, item) : Utils.updateOrNew(item, this.reverse_model_type));
	      }
	      return _results;
	    }).call(this);
	    related_ids = (function() {
	      var _i, _len, _results;
	      _results = [];
	      for (_i = 0, _len = relateds.length; _i < _len; _i++) {
	        related = relateds[_i];
	        _results.push(Utils.dataId(related));
	      }
	      return _results;
	    })();
	    collection.add(relateds);
	    if (model.isLoaded(this.key)) {
	      for (_i = 0, _len = relateds.length; _i < _len; _i++) {
	        related = relateds[_i];
	        if (!related.isLoaded()) {
	          model.setLoaded(this.key, false);
	          break;
	        }
	      }
	    }
	    if (this.join_table) {
	      queue = new Queue(1);
	      _fn = (function(_this) {
	        return function(related_id) {
	          return queue.defer(function(callback) {
	            var add, query;
	            if (!related_id) {
	              return callback(new Error("Many.patchAdd: cannot add an new model. Please save first."));
	            }
	            add = function(callback) {
	              var attributes;
	              (attributes = {})[_this.foreign_key] = model.id;
	              attributes[_this.reverse_relation.foreign_key] = related_id;
	              return _this.join_table.exists(attributes, function(err, exists) {
	                if (err) {
	                  return callback(err);
	                }
	                if (exists) {
	                  return callback(new Error("Join already exists: " + (JSON.stringify(attributes))));
	                }
	                return new _this.join_table(attributes).save(callback);
	              });
	            };
	            if (_this.reverse_relation.type === 'hasMany') {
	              return add(callback);
	            }
	            (query = {
	              $one: true
	            })[_this.reverse_relation.foreign_key] = related_id;
	            return _this.join_table.cursor(query).toJSON(function(err, join_table_json) {
	              if (err) {
	                return callback(err);
	              }
	              if (!join_table_json) {
	                return add(callback);
	              }
	              if (join_table_json[_this.foreign_key] === model.id) {
	                return callback();
	              }
	              join_table_json[_this.foreign_key] = model.id;
	              return Utils.modelJSONSave(join_table_json, _this.join_table, callback);
	            });
	          });
	        };
	      })(this);
	      for (_j = 0, _len1 = related_ids.length; _j < _len1; _j++) {
	        related_id = related_ids[_j];
	        _fn(related_id);
	      }
	      return queue.await(callback);
	    } else {
	      query = {
	        id: {
	          $in: related_ids
	        }
	      };
	      return this.reverse_model_type.cursor(query).toJSON((function(_this) {
	        return function(err, related_jsons) {
	          var related_json, _fn1, _k, _len2;
	          queue = new Queue(1);
	          _fn1 = function(related_json) {
	            return queue.defer(function(callback) {
	              related_json[_this.reverse_relation.foreign_key] = model.id;
	              return Utils.modelJSONSave(related_json, _this.reverse_model_type, callback);
	            });
	          };
	          for (_k = 0, _len2 = related_jsons.length; _k < _len2; _k++) {
	            related_json = related_jsons[_k];
	            _fn1(related_json);
	          }
	          return queue.await(callback);
	        };
	      })(this));
	    }
	  };

	  Many.prototype.patchRemove = function(model, relateds, callback) {
	    var cache, collection, current_related_model, json, query, related, related_ids, related_model, related_models, _i, _j, _k, _len, _len1, _len2, _ref;
	    if (!model.id) {
	      return callback(new Error("Many.patchRemove: model has null id for: " + this.key));
	    }
	    if (arguments.length === 2) {
	      callback = relateds;
	      if (!this.reverse_relation) {
	        return callback();
	      }
	      if (Utils.isModel(model)) {
	        delete Utils.orSet(model, 'rel_dirty', {})[this.key];
	        collection = this._ensureCollection(model);
	        related_models = _.clone(collection.models);
	      } else {
	        related_models = (function() {
	          var _i, _len, _ref, _results;
	          _ref = model[this.key] || [];
	          _results = [];
	          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	            json = _ref[_i];
	            _results.push(new this.reverse_model_type(json));
	          }
	          return _results;
	        }).call(this);
	      }
	      for (_i = 0, _len = related_models.length; _i < _len; _i++) {
	        related_model = related_models[_i];
	        related_model.set(this.foreign_key, null);
	        if (cache = related_model.cache()) {
	          cache.set(related_model.id, related_model);
	        }
	      }
	      if (this.join_table) {
	        (query = {})[this.join_key] = model.id;
	        return this.join_table.destroy(query, callback);
	      } else {
	        (query = {})[this.reverse_relation.foreign_key] = model.id;
	        this.reverse_model_type.cursor(query).toJSON((function(_this) {
	          return function(err, json) {
	            var queue, related_json, _fn, _j, _len1;
	            if (err) {
	              return callback(err);
	            }
	            queue = new Queue(1);
	            _fn = function(related_json) {
	              return queue.defer(function(callback) {
	                related_json[_this.reverse_relation.foreign_key] = null;
	                return Utils.modelJSONSave(related_json, _this.reverse_model_type, callback);
	              });
	            };
	            for (_j = 0, _len1 = json.length; _j < _len1; _j++) {
	              related_json = json[_j];
	              _fn(related_json);
	            }
	            return queue.await(callback);
	          };
	        })(this));
	      }
	      return;
	    }
	    if (this.isEmbedded()) {
	      return callback(new Error('Many.patchRemove: embedded relationships are not supported'));
	    }
	    if (!relateds) {
	      return callback(new Error('One.patchRemove: missing model for remove'));
	    }
	    if (!_.isArray(relateds)) {
	      relateds = [relateds];
	    }
	    collection = this._ensureCollection(model);
	    for (_j = 0, _len1 = relateds.length; _j < _len1; _j++) {
	      related = relateds[_j];
	      _ref = collection.models;
	      for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
	        current_related_model = _ref[_k];
	        if (Utils.dataIsSameModel(current_related_model, related)) {
	          collection.remove(current_related_model);
	          break;
	        }
	      }
	    }
	    related_ids = (function() {
	      var _l, _len3, _results;
	      _results = [];
	      for (_l = 0, _len3 = relateds.length; _l < _len3; _l++) {
	        related = relateds[_l];
	        _results.push(Utils.dataId(related));
	      }
	      return _results;
	    })();
	    if (this.join_table) {
	      query = {};
	      query[this.join_key] = model.id;
	      query[this.reverse_relation.join_key] = {
	        $in: related_ids
	      };
	      return this.join_table.destroy(query, callback);
	    } else {
	      query = {};
	      query[this.reverse_relation.foreign_key] = model.id;
	      query.id = {
	        $in: related_ids
	      };
	      return this.reverse_model_type.cursor(query).toJSON((function(_this) {
	        return function(err, json) {
	          var queue, related_json, _fn, _l, _len3;
	          if (err) {
	            return callback(err);
	          }
	          queue = new Queue(1);
	          _fn = function(related_json) {
	            return queue.defer(function(callback) {
	              related_json[_this.reverse_relation.foreign_key] = null;
	              return Utils.modelJSONSave(related_json, _this.reverse_model_type, callback);
	            });
	          };
	          for (_l = 0, _len3 = json.length; _l < _len3; _l++) {
	            related_json = json[_l];
	            _fn(related_json);
	          }
	          return queue.await(callback);
	        };
	      })(this));
	    }
	  };

	  Many.prototype.cursor = function(model, key, query) {
	    var json;
	    json = Utils.isModel(model) ? model.attributes : model;
	    (query = _.clone(query || {}))[this.join_table ? this.join_key : this.reverse_relation.foreign_key] = json[this.model_type.prototype.idAttribute];
	    if (key === this.virtual_id_accessor) {
	      (query.$values || (query.$values = [])).push('id');
	    }
	    return this.reverse_model_type.cursor(query);
	  };

	  Many.prototype._bindBacklinks = function(model) {
	    var collection, events, method, _i, _len, _ref;
	    if ((collection = model.attributes[this.key]) instanceof this.collection_type) {
	      return collection;
	    }
	    collection = model.attributes[this.key] = new this.collection_type();
	    if (!this.reverse_relation) {
	      return collection;
	    }
	    events = Utils.set(collection, 'events', {});
	    events.add = (function(_this) {
	      return function(related_model) {
	        var current_model, is_current;
	        if (_this.reverse_relation.add) {
	          return _this.reverse_relation.add(related_model, model);
	        } else {
	          current_model = related_model.get(_this.reverse_relation.key);
	          is_current = model.id && (Utils.dataId(current_model) === model.id);
	          if (!is_current || (is_current && !current_model.isLoaded())) {
	            return related_model.set(_this.reverse_relation.key, model);
	          }
	        }
	      };
	    })(this);
	    events.remove = (function(_this) {
	      return function(related_model) {
	        var current_model;
	        if (_this.reverse_relation.remove) {
	          return _this.reverse_relation.remove(related_model, model);
	        } else {
	          current_model = related_model.get(_this.reverse_relation.key);
	          if (Utils.dataId(current_model) === model.id) {
	            return related_model.set(_this.reverse_relation.key, null);
	          }
	        }
	      };
	    })(this);
	    events.reset = (function(_this) {
	      return function(collection, options) {
	        var added, changes, current_models, previous_models, related_model, _i, _j, _len, _len1, _ref, _results;
	        current_models = collection.models;
	        previous_models = options.previousModels || [];
	        changes = _.groupBy(previous_models, function(test) {
	          if (!!_.find(current_models, function(current_model) {
	            return current_model.id === test.id;
	          })) {
	            return 'kept';
	          } else {
	            return 'removed';
	          }
	        });
	        added = changes.kept ? _.select(current_models, function(test) {
	          return !_.find(changes.kept, function(keep_model) {
	            return keep_model.id === test.id;
	          });
	        }) : current_models;
	        if (changes.removed) {
	          _ref = changes.removed;
	          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	            related_model = _ref[_i];
	            events.remove(related_model);
	          }
	        }
	        _results = [];
	        for (_j = 0, _len1 = added.length; _j < _len1; _j++) {
	          related_model = added[_j];
	          _results.push(events.add(related_model));
	        }
	        return _results;
	      };
	    })(this);
	    _ref = ['add', 'remove', 'reset'];
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      method = _ref[_i];
	      collection.on(method, events[method]);
	    }
	    return collection;
	  };

	  Many.prototype._unbindBacklinks = function(model) {
	    var collection, events, method, _i, _len, _ref;
	    if (!(events = Utils.get(model, 'events'))) {
	      return;
	    }
	    Utils.unset(model, 'events');
	    collection = model.attributes[this.key];
	    collection.models.splice();
	    events = _.clone();
	    _ref = ['add', 'remove', 'reset'];
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      method = _ref[_i];
	      collection.off(method, events[method]);
	      events[method] = null;
	    }
	  };

	  Many.prototype._ensureCollection = function(model) {
	    return this._bindBacklinks(model);
	  };

	  Many.prototype._hasChanged = function(model) {
	    var collection, _i, _len, _ref;
	    return !!Utils.orSet(model, 'rel_dirty', {})[this.key] || model.hasChanged(this.key);
	    if (!this.reverse_relation) {
	      return false;
	    }
	    collection = this._ensureCollection(model);
	    _ref = model.models;
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      model = _ref[_i];
	      if (model.hasChanged(this.reverse_relation.foreign_key)) {
	        return true;
	      }
	    }
	    return false;
	  };

	  return Many;

	})(__webpack_require__(37));


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	//
	// The shims in this file are not fully implemented shims for the ES5
	// features, but do work for the particular usecases there is in
	// the other modules.
	//

	// Array.prototype.forEach is supported in IE9
	exports.forEach = function forEach(xs, fn, self) {
	  if (xs.forEach) return xs.forEach(fn, self);
	  for (var i = 0; i < xs.length; i++) {
	    fn.call(self, xs[i], i, xs);
	  }
	};

	// String.prototype.substr - negative index don't work in IE8
	if ('ab'.substr(-1) !== 'b') {
	  exports.substr = function (str, start, length) {
	    // did we get a negative start, calculate how much it is from the beginning of the string
	    if (start < 0) start = str.length + start;

	    // call the original function
	    return str.substr(start, length);
	  };
	} else {
	  exports.substr = function (str, start, length) {
	    return str.substr(start, length);
	  };
	}

	// String.prototype.trim is supported in IE9
	exports.trim = function (str) {
	  if (str.trim) return str.trim();
	  return str.replace(/^\s+|\s+$/g, '');
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var CacheCursor, CacheSync, DESTROY_BATCH_LIMIT, DESTROY_THREADS, Schema, Utils, bbCallback, _;

	_ = __webpack_require__(1);

	CacheCursor = __webpack_require__(38);

	Schema = __webpack_require__(14);

	Utils = __webpack_require__(7);

	bbCallback = Utils.bbCallback;

	DESTROY_BATCH_LIMIT = 1000;

	DESTROY_THREADS = 100;

	CacheSync = (function() {
	  function CacheSync(model_type, wrapped_sync_fn) {
	    this.model_type = model_type;
	    this.wrapped_sync_fn = wrapped_sync_fn;
	  }

	  CacheSync.prototype.initialize = function() {
	    if (this.is_initialized) {
	      return;
	    }
	    this.is_initialized = true;
	    this.wrapped_sync_fn('initialize');
	    if (!this.model_type.model_name) {
	      throw new Error('Missing model_name for model');
	    }
	  };

	  CacheSync.prototype.read = function(model, options) {
	    var cached_model;
	    if (!options.force && (cached_model = this.model_type.cache.get(model.id))) {
	      return options.success(cached_model.toJSON());
	    }
	    return this.wrapped_sync_fn('read', model, options);
	  };

	  CacheSync.prototype.create = function(model, options) {
	    return this.wrapped_sync_fn('create', model, bbCallback((function(_this) {
	      return function(err, json) {
	        var attributes, cache_model;
	        if (err) {
	          return options.error(err);
	        }
	        (attributes = {})[_this.model_type.prototype.idAttribute] = json[_this.model_type.prototype.idAttribute];
	        model.set(attributes);
	        if (cache_model = _this.model_type.cache.get(model.id)) {
	          if (cache_model !== model) {
	            Utils.updateModel(cache_model, model);
	          }
	        } else {
	          _this.model_type.cache.set(model.id, model);
	        }
	        return options.success(json);
	      };
	    })(this)));
	  };

	  CacheSync.prototype.update = function(model, options) {
	    return this.wrapped_sync_fn('update', model, bbCallback((function(_this) {
	      return function(err, json) {
	        var cache_model;
	        if (err) {
	          return options.error(err);
	        }
	        if (cache_model = _this.model_type.cache.get(model.id)) {
	          if (cache_model !== model) {
	            Utils.updateModel(cache_model, model);
	          }
	        } else {
	          _this.model_type.cache.set(model.id, model);
	        }
	        return options.success(json);
	      };
	    })(this)));
	  };

	  CacheSync.prototype["delete"] = function(model, options) {
	    this.model_type.cache.destroy(model.id);
	    return this.wrapped_sync_fn('delete', model, bbCallback((function(_this) {
	      return function(err, json) {
	        if (err) {
	          return options.error(err);
	        }
	        return options.success(json);
	      };
	    })(this)));
	  };

	  CacheSync.prototype.resetSchema = function(options, callback) {
	    return this.model_type.cache.reset((function(_this) {
	      return function(err) {
	        if (err) {
	          return callback(err);
	        }
	        return _this.wrapped_sync_fn('resetSchema', options, callback);
	      };
	    })(this));
	  };

	  CacheSync.prototype.cursor = function(query) {
	    if (query == null) {
	      query = {};
	    }
	    return new CacheCursor(query, _.pick(this, ['model_type', 'wrapped_sync_fn']));
	  };

	  CacheSync.prototype.destroy = function(query, callback) {
	    return this.model_type.each(_.extend({
	      $each: {
	        limit: DESTROY_BATCH_LIMIT,
	        threads: DESTROY_THREADS
	      }
	    }, query), ((function(_this) {
	      return function(model, callback) {
	        return model.destroy(callback);
	      };
	    })(this)), callback);
	  };

	  CacheSync.prototype.connect = function(url) {
	    this.model_type.cache.reset();
	    return this.wrapped_sync_fn('connect');
	  };

	  return CacheSync;

	})();

	module.exports = function(model_type, wrapped_sync_fn) {
	  var sync, sync_fn;
	  sync = new CacheSync(model_type, wrapped_sync_fn);
	  model_type.prototype.sync = sync_fn = function(method, model, options) {
	    if (options == null) {
	      options = {};
	    }
	    sync.initialize();
	    if (method === 'createSync') {
	      return wrapped_sync_fn.apply(null, arguments);
	    }
	    if (method === 'sync') {
	      return sync;
	    }
	    if (sync[method]) {
	      return sync[method].apply(sync, Array.prototype.slice.call(arguments, 1));
	    }
	    return wrapped_sync_fn.apply(wrapped_sync_fn, Array.prototype.slice.call(arguments));
	  };
	  return sync_fn;
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */

	var base64 = __webpack_require__(40)
	var ieee754 = __webpack_require__(39)

	exports.Buffer = Buffer
	exports.SlowBuffer = Buffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192

	/**
	 * If `Buffer._useTypedArrays`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (compatible down to IE6)
	 */
	Buffer._useTypedArrays = (function () {
	  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
	  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
	  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
	  // because we need to be able to add all the node Buffer API methods. This is an issue
	  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
	  try {
	    var buf = new ArrayBuffer(0)
	    var arr = new Uint8Array(buf)
	    arr.foo = function () { return 42 }
	    return 42 === arr.foo() &&
	        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
	  } catch (e) {
	    return false
	  }
	})()

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (subject, encoding, noZero) {
	  if (!(this instanceof Buffer))
	    return new Buffer(subject, encoding, noZero)

	  var type = typeof subject

	  // Find the length
	  var length
	  if (type === 'number')
	    length = subject > 0 ? subject >>> 0 : 0
	  else if (type === 'string') {
	    if (encoding === 'base64')
	      subject = base64clean(subject)
	    length = Buffer.byteLength(subject, encoding)
	  } else if (type === 'object' && subject !== null) { // assume object is array-like
	    if (subject.type === 'Buffer' && Array.isArray(subject.data))
	      subject = subject.data
	    length = +subject.length > 0 ? Math.floor(+subject.length) : 0
	  } else
	    throw new Error('First argument needs to be a number, array or string.')

	  var buf
	  if (Buffer._useTypedArrays) {
	    // Preferred: Return an augmented `Uint8Array` instance for best performance
	    buf = Buffer._augment(new Uint8Array(length))
	  } else {
	    // Fallback: Return THIS instance of Buffer (created by `new`)
	    buf = this
	    buf.length = length
	    buf._isBuffer = true
	  }

	  var i
	  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
	    // Speed optimization -- use set if we're copying from a typed array
	    buf._set(subject)
	  } else if (isArrayish(subject)) {
	    // Treat array-ish objects as a byte array
	    if (Buffer.isBuffer(subject)) {
	      for (i = 0; i < length; i++)
	        buf[i] = subject.readUInt8(i)
	    } else {
	      for (i = 0; i < length; i++)
	        buf[i] = ((subject[i] % 256) + 256) % 256
	    }
	  } else if (type === 'string') {
	    buf.write(subject, 0, encoding)
	  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
	    for (i = 0; i < length; i++) {
	      buf[i] = 0
	    }
	  }

	  return buf
	}

	// STATIC METHODS
	// ==============

	Buffer.isEncoding = function (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.isBuffer = function (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.byteLength = function (str, encoding) {
	  var ret
	  str = str.toString()
	  switch (encoding || 'utf8') {
	    case 'hex':
	      ret = str.length / 2
	      break
	    case 'utf8':
	    case 'utf-8':
	      ret = utf8ToBytes(str).length
	      break
	    case 'ascii':
	    case 'binary':
	    case 'raw':
	      ret = str.length
	      break
	    case 'base64':
	      ret = base64ToBytes(str).length
	      break
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      ret = str.length * 2
	      break
	    default:
	      throw new Error('Unknown encoding')
	  }
	  return ret
	}

	Buffer.concat = function (list, totalLength) {
	  assert(isArray(list), 'Usage: Buffer.concat(list[, length])')

	  if (list.length === 0) {
	    return new Buffer(0)
	  } else if (list.length === 1) {
	    return list[0]
	  }

	  var i
	  if (totalLength === undefined) {
	    totalLength = 0
	    for (i = 0; i < list.length; i++) {
	      totalLength += list[i].length
	    }
	  }

	  var buf = new Buffer(totalLength)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}

	Buffer.compare = function (a, b) {
	  assert(Buffer.isBuffer(a) && Buffer.isBuffer(b), 'Arguments must be Buffers')
	  var x = a.length
	  var y = b.length
	  for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }
	  if (x < y) {
	    return -1
	  }
	  if (y < x) {
	    return 1
	  }
	  return 0
	}

	// BUFFER INSTANCE METHODS
	// =======================

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  assert(strLen % 2 === 0, 'Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var byte = parseInt(string.substr(i * 2, 2), 16)
	    assert(!isNaN(byte), 'Invalid hex string')
	    buf[offset + i] = byte
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  var charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
	  return charsWritten
	}

	function asciiWrite (buf, string, offset, length) {
	  var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
	  return charsWritten
	}

	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
	  return charsWritten
	}

	function utf16leWrite (buf, string, offset, length) {
	  var charsWritten = blitBuffer(utf16leToBytes(string), buf, offset, length)
	  return charsWritten
	}

	Buffer.prototype.write = function (string, offset, length, encoding) {
	  // Support both (string, offset, length, encoding)
	  // and the legacy (string, encoding, offset, length)
	  if (isFinite(offset)) {
	    if (!isFinite(length)) {
	      encoding = length
	      length = undefined
	    }
	  } else {  // legacy
	    var swap = encoding
	    encoding = offset
	    offset = length
	    length = swap
	  }

	  offset = Number(offset) || 0
	  var remaining = this.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	  encoding = String(encoding || 'utf8').toLowerCase()

	  var ret
	  switch (encoding) {
	    case 'hex':
	      ret = hexWrite(this, string, offset, length)
	      break
	    case 'utf8':
	    case 'utf-8':
	      ret = utf8Write(this, string, offset, length)
	      break
	    case 'ascii':
	      ret = asciiWrite(this, string, offset, length)
	      break
	    case 'binary':
	      ret = binaryWrite(this, string, offset, length)
	      break
	    case 'base64':
	      ret = base64Write(this, string, offset, length)
	      break
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      ret = utf16leWrite(this, string, offset, length)
	      break
	    default:
	      throw new Error('Unknown encoding')
	  }
	  return ret
	}

	Buffer.prototype.toString = function (encoding, start, end) {
	  var self = this

	  encoding = String(encoding || 'utf8').toLowerCase()
	  start = Number(start) || 0
	  end = (end === undefined) ? self.length : Number(end)

	  // Fastpath empty strings
	  if (end === start)
	    return ''

	  var ret
	  switch (encoding) {
	    case 'hex':
	      ret = hexSlice(self, start, end)
	      break
	    case 'utf8':
	    case 'utf-8':
	      ret = utf8Slice(self, start, end)
	      break
	    case 'ascii':
	      ret = asciiSlice(self, start, end)
	      break
	    case 'binary':
	      ret = binarySlice(self, start, end)
	      break
	    case 'base64':
	      ret = base64Slice(self, start, end)
	      break
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      ret = utf16leSlice(self, start, end)
	      break
	    default:
	      throw new Error('Unknown encoding')
	  }
	  return ret
	}

	Buffer.prototype.toJSON = function () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	Buffer.prototype.equals = function (b) {
	  assert(Buffer.isBuffer(b), 'Argument must be a Buffer')
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.compare = function (b) {
	  assert(Buffer.isBuffer(b), 'Argument must be a Buffer')
	  return Buffer.compare(this, b)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function (target, target_start, start, end) {
	  var source = this

	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (!target_start) target_start = 0

	  // Copy 0 bytes; we're done
	  if (end === start) return
	  if (target.length === 0 || source.length === 0) return

	  // Fatal error conditions
	  assert(end >= start, 'sourceEnd < sourceStart')
	  assert(target_start >= 0 && target_start < target.length,
	      'targetStart out of bounds')
	  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
	  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length)
	    end = this.length
	  if (target.length - target_start < end - start)
	    end = target.length - target_start + start

	  var len = end - start

	  if (len < 100 || !Buffer._useTypedArrays) {
	    for (var i = 0; i < len; i++) {
	      target[i + target_start] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), target_start)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  var res = ''
	  var tmp = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    if (buf[i] <= 0x7F) {
	      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
	      tmp = ''
	    } else {
	      tmp += '%' + buf[i].toString(16)
	    }
	  }

	  return res + decodeUtf8Char(tmp)
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function binarySlice (buf, start, end) {
	  return asciiSlice(buf, start, end)
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len;
	    if (start < 0)
	      start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0)
	      end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start)
	    end = start

	  if (Buffer._useTypedArrays) {
	    return Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    var newBuf = new Buffer(sliceLen, undefined, true)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	    return newBuf
	  }
	}

	// `get` will be removed in Node 0.13+
	Buffer.prototype.get = function (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}

	// `set` will be removed in Node 0.13+
	Buffer.prototype.set = function (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}

	Buffer.prototype.readUInt8 = function (offset, noAssert) {
	  if (!noAssert) {
	    assert(offset !== undefined && offset !== null, 'missing offset')
	    assert(offset < this.length, 'Trying to read beyond buffer length')
	  }

	  if (offset >= this.length)
	    return

	  return this[offset]
	}

	function readUInt16 (buf, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
	    assert(offset !== undefined && offset !== null, 'missing offset')
	    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
	  }

	  var len = buf.length
	  if (offset >= len)
	    return

	  var val
	  if (littleEndian) {
	    val = buf[offset]
	    if (offset + 1 < len)
	      val |= buf[offset + 1] << 8
	  } else {
	    val = buf[offset] << 8
	    if (offset + 1 < len)
	      val |= buf[offset + 1]
	  }
	  return val
	}

	Buffer.prototype.readUInt16LE = function (offset, noAssert) {
	  return readUInt16(this, offset, true, noAssert)
	}

	Buffer.prototype.readUInt16BE = function (offset, noAssert) {
	  return readUInt16(this, offset, false, noAssert)
	}

	function readUInt32 (buf, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
	    assert(offset !== undefined && offset !== null, 'missing offset')
	    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
	  }

	  var len = buf.length
	  if (offset >= len)
	    return

	  var val
	  if (littleEndian) {
	    if (offset + 2 < len)
	      val = buf[offset + 2] << 16
	    if (offset + 1 < len)
	      val |= buf[offset + 1] << 8
	    val |= buf[offset]
	    if (offset + 3 < len)
	      val = val + (buf[offset + 3] << 24 >>> 0)
	  } else {
	    if (offset + 1 < len)
	      val = buf[offset + 1] << 16
	    if (offset + 2 < len)
	      val |= buf[offset + 2] << 8
	    if (offset + 3 < len)
	      val |= buf[offset + 3]
	    val = val + (buf[offset] << 24 >>> 0)
	  }
	  return val
	}

	Buffer.prototype.readUInt32LE = function (offset, noAssert) {
	  return readUInt32(this, offset, true, noAssert)
	}

	Buffer.prototype.readUInt32BE = function (offset, noAssert) {
	  return readUInt32(this, offset, false, noAssert)
	}

	Buffer.prototype.readInt8 = function (offset, noAssert) {
	  if (!noAssert) {
	    assert(offset !== undefined && offset !== null,
	        'missing offset')
	    assert(offset < this.length, 'Trying to read beyond buffer length')
	  }

	  if (offset >= this.length)
	    return

	  var neg = this[offset] & 0x80
	  if (neg)
	    return (0xff - this[offset] + 1) * -1
	  else
	    return this[offset]
	}

	function readInt16 (buf, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
	    assert(offset !== undefined && offset !== null, 'missing offset')
	    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
	  }

	  var len = buf.length
	  if (offset >= len)
	    return

	  var val = readUInt16(buf, offset, littleEndian, true)
	  var neg = val & 0x8000
	  if (neg)
	    return (0xffff - val + 1) * -1
	  else
	    return val
	}

	Buffer.prototype.readInt16LE = function (offset, noAssert) {
	  return readInt16(this, offset, true, noAssert)
	}

	Buffer.prototype.readInt16BE = function (offset, noAssert) {
	  return readInt16(this, offset, false, noAssert)
	}

	function readInt32 (buf, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
	    assert(offset !== undefined && offset !== null, 'missing offset')
	    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
	  }

	  var len = buf.length
	  if (offset >= len)
	    return

	  var val = readUInt32(buf, offset, littleEndian, true)
	  var neg = val & 0x80000000
	  if (neg)
	    return (0xffffffff - val + 1) * -1
	  else
	    return val
	}

	Buffer.prototype.readInt32LE = function (offset, noAssert) {
	  return readInt32(this, offset, true, noAssert)
	}

	Buffer.prototype.readInt32BE = function (offset, noAssert) {
	  return readInt32(this, offset, false, noAssert)
	}

	function readFloat (buf, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
	    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
	  }

	  return ieee754.read(buf, offset, littleEndian, 23, 4)
	}

	Buffer.prototype.readFloatLE = function (offset, noAssert) {
	  return readFloat(this, offset, true, noAssert)
	}

	Buffer.prototype.readFloatBE = function (offset, noAssert) {
	  return readFloat(this, offset, false, noAssert)
	}

	function readDouble (buf, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
	    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
	  }

	  return ieee754.read(buf, offset, littleEndian, 52, 8)
	}

	Buffer.prototype.readDoubleLE = function (offset, noAssert) {
	  return readDouble(this, offset, true, noAssert)
	}

	Buffer.prototype.readDoubleBE = function (offset, noAssert) {
	  return readDouble(this, offset, false, noAssert)
	}

	Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
	  if (!noAssert) {
	    assert(value !== undefined && value !== null, 'missing value')
	    assert(offset !== undefined && offset !== null, 'missing offset')
	    assert(offset < this.length, 'trying to write beyond buffer length')
	    verifuint(value, 0xff)
	  }

	  if (offset >= this.length) return

	  this[offset] = value
	  return offset + 1
	}

	function writeUInt16 (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    assert(value !== undefined && value !== null, 'missing value')
	    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
	    assert(offset !== undefined && offset !== null, 'missing offset')
	    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
	    verifuint(value, 0xffff)
	  }

	  var len = buf.length
	  if (offset >= len)
	    return

	  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
	    buf[offset + i] =
	        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	            (littleEndian ? i : 1 - i) * 8
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
	  return writeUInt16(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
	  return writeUInt16(this, value, offset, false, noAssert)
	}

	function writeUInt32 (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    assert(value !== undefined && value !== null, 'missing value')
	    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
	    assert(offset !== undefined && offset !== null, 'missing offset')
	    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
	    verifuint(value, 0xffffffff)
	  }

	  var len = buf.length
	  if (offset >= len)
	    return

	  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
	    buf[offset + i] =
	        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
	  return writeUInt32(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
	  return writeUInt32(this, value, offset, false, noAssert)
	}

	Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
	  if (!noAssert) {
	    assert(value !== undefined && value !== null, 'missing value')
	    assert(offset !== undefined && offset !== null, 'missing offset')
	    assert(offset < this.length, 'Trying to write beyond buffer length')
	    verifsint(value, 0x7f, -0x80)
	  }

	  if (offset >= this.length)
	    return

	  if (value >= 0)
	    this.writeUInt8(value, offset, noAssert)
	  else
	    this.writeUInt8(0xff + value + 1, offset, noAssert)
	  return offset + 1
	}

	function writeInt16 (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    assert(value !== undefined && value !== null, 'missing value')
	    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
	    assert(offset !== undefined && offset !== null, 'missing offset')
	    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
	    verifsint(value, 0x7fff, -0x8000)
	  }

	  var len = buf.length
	  if (offset >= len)
	    return

	  if (value >= 0)
	    writeUInt16(buf, value, offset, littleEndian, noAssert)
	  else
	    writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
	  return offset + 2
	}

	Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
	  return writeInt16(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
	  return writeInt16(this, value, offset, false, noAssert)
	}

	function writeInt32 (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    assert(value !== undefined && value !== null, 'missing value')
	    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
	    assert(offset !== undefined && offset !== null, 'missing offset')
	    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
	    verifsint(value, 0x7fffffff, -0x80000000)
	  }

	  var len = buf.length
	  if (offset >= len)
	    return

	  if (value >= 0)
	    writeUInt32(buf, value, offset, littleEndian, noAssert)
	  else
	    writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
	  return offset + 4
	}

	Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
	  return writeInt32(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
	  return writeInt32(this, value, offset, false, noAssert)
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    assert(value !== undefined && value !== null, 'missing value')
	    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
	    assert(offset !== undefined && offset !== null, 'missing offset')
	    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
	    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }

	  var len = buf.length
	  if (offset >= len)
	    return

	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    assert(value !== undefined && value !== null, 'missing value')
	    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
	    assert(offset !== undefined && offset !== null, 'missing offset')
	    assert(offset + 7 < buf.length,
	        'Trying to write beyond buffer length')
	    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }

	  var len = buf.length
	  if (offset >= len)
	    return

	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length

	  assert(end >= start, 'end < start')

	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return

	  assert(start >= 0 && start < this.length, 'start out of bounds')
	  assert(end >= 0 && end <= this.length, 'end out of bounds')

	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }

	  return this
	}

	Buffer.prototype.inspect = function () {
	  var out = []
	  var len = this.length
	  for (var i = 0; i < len; i++) {
	    out[i] = toHex(this[i])
	    if (i === exports.INSPECT_MAX_BYTES) {
	      out[i + 1] = '...'
	      break
	    }
	  }
	  return '<Buffer ' + out.join(' ') + '>'
	}

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer._useTypedArrays) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new Error('Buffer.toArrayBuffer not supported in this browser')
	  }
	}

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function (arr) {
	  arr._isBuffer = true

	  // save reference to original Uint8Array get/set methods before overwriting
	  arr._get = arr.get
	  arr._set = arr.set

	  // deprecated, will be removed in node 0.13+
	  arr.get = BP.get
	  arr.set = BP.set

	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer

	  return arr
	}

	var INVALID_BASE64_RE = /[^+\/0-9A-z]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function isArray (subject) {
	  return (Array.isArray || function (subject) {
	    return Object.prototype.toString.call(subject) === '[object Array]'
	  })(subject)
	}

	function isArrayish (subject) {
	  return isArray(subject) || Buffer.isBuffer(subject) ||
	      subject && typeof subject === 'object' &&
	      typeof subject.length === 'number'
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    var b = str.charCodeAt(i)
	    if (b <= 0x7F) {
	      byteArray.push(b)
	    } else {
	      var start = i
	      if (b >= 0xD800 && b <= 0xDFFF) i++
	      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
	      for (var j = 0; j < h.length; j++) {
	        byteArray.push(parseInt(h[j], 16))
	      }
	    }
	  }
	  return byteArray
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(str)
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length))
	      break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	function decodeUtf8Char (str) {
	  try {
	    return decodeURIComponent(str)
	  } catch (err) {
	    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
	  }
	}

	/*
	 * We have to make sure that the value is a valid integer. This means that it
	 * is non-negative. It has no fractional component and that it does not
	 * exceed the maximum allowed value.
	 */
	function verifuint (value, max) {
	  assert(typeof value === 'number', 'cannot write a non-number as a number')
	  assert(value >= 0, 'specified a negative value for writing an unsigned value')
	  assert(value <= max, 'value is larger than maximum value for type')
	  assert(Math.floor(value) === value, 'value has a fractional component')
	}

	function verifsint (value, max, min) {
	  assert(typeof value === 'number', 'cannot write a non-number as a number')
	  assert(value <= max, 'value larger than maximum allowed value')
	  assert(value >= min, 'value smaller than minimum allowed value')
	  assert(Math.floor(value) === value, 'value has a fractional component')
	}

	function verifIEEE754 (value, max, min) {
	  assert(typeof value === 'number', 'cannot write a non-number as a number')
	  assert(value <= max, 'value larger than maximum allowed value')
	  assert(value >= min, 'value smaller than minimum allowed value')
	}

	function assert (test, message) {
	  if (!test) throw new Error(message || 'Failed assertion')
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(32).Buffer))

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var ModelStream, stream,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	try {
	  stream = __webpack_require__(3);
	} catch (_error) {}

	if (stream != null ? stream.Readable : void 0) {
	  module.exports = ModelStream = (function(_super) {
	    __extends(ModelStream, _super);

	    function ModelStream(model_type, query) {
	      this.model_type = model_type;
	      this.query = query != null ? query : {};
	      ModelStream.__super__.constructor.call(this, {
	        objectMode: true
	      });
	    }

	    ModelStream.prototype._read = function() {
	      var done;
	      if (this.ended || this.started) {
	        return;
	      }
	      this.started = true;
	      done = (function(_this) {
	        return function(err) {
	          _this.ended = true;
	          if (err) {
	            _this.emit('error', err);
	          }
	          return _this.push(null);
	        };
	      })(this);
	      return this.model_type.each(this.query, ((function(_this) {
	        return function(model, callback) {
	          _this.push(model);
	          return callback();
	        };
	      })(this)), done);
	    };

	    return ModelStream;

	  })(stream.Readable);
	}


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var Cursor, Queue, _;

	_ = __webpack_require__(1);

	Queue = __webpack_require__(10);

	Cursor = null;

	module.exports = function(model_type, query, iterator, callback) {
	  var method, model_limit, options, parsed_query, processed_count, runBatch;
	  if (!Cursor) {
	    Cursor = __webpack_require__(20);
	  }
	  options = query.$each || {};
	  method = options.json ? 'toJSON' : 'toModels';
	  processed_count = 0;
	  parsed_query = Cursor.parseQuery(_.omit(query, '$each'));
	  _.defaults(parsed_query.cursor, {
	    $offset: 0,
	    $sort: 'id'
	  });
	  model_limit = parsed_query.cursor.$limit || Infinity;
	  if (options.fetch) {
	    parsed_query.cursor.$limit = options.fetch;
	  }
	  runBatch = function() {
	    var cursor;
	    cursor = model_type.cursor(parsed_query);
	    return cursor[method].call(cursor, function(err, models) {
	      var model, queue, _fn, _i, _len;
	      if (err || !models) {
	        return callback(new Error("Failed to get models. Error: " + err));
	      }
	      if (!models.length) {
	        return callback(null, processed_count);
	      }
	      queue = new Queue(options.threads);
	      _fn = function(model) {
	        return queue.defer(function(callback) {
	          return iterator(model, callback);
	        });
	      };
	      for (_i = 0, _len = models.length; _i < _len; _i++) {
	        model = models[_i];
	        if (processed_count++ >= model_limit) {
	          break;
	        }
	        _fn(model);
	      }
	      return queue.await(function(err) {
	        if (err) {
	          return callback(err);
	        }
	        if ((processed_count >= model_limit) || (models.length < parsed_query.cursor.$limit) || !parsed_query.cursor.$limit) {
	          return callback(null, processed_count);
	        }
	        parsed_query.cursor.$offset += parsed_query.cursor.$limit;
	        return runBatch();
	      });
	    });
	  };
	  return runBatch();
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var DateUtils, INTERVAL_TYPES, Queue, Utils, _;

	_ = __webpack_require__(1);

	Queue = __webpack_require__(10);

	Utils = __webpack_require__(7);

	DateUtils = __webpack_require__(9);

	INTERVAL_TYPES = ['milliseconds', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'];

	module.exports = function(model_type, query, iterator, callback) {
	  var iteration_info, key, no_models, options, queue, range;
	  options = query.$interval || {};
	  if (!(key = options.key)) {
	    throw new Error('missing option: key');
	  }
	  if (!options.type) {
	    throw new Error('missing option: type');
	  }
	  if (!_.contains(INTERVAL_TYPES, options.type)) {
	    throw new Error("type is not recognized: " + options.type + ", " + (_.contains(INTERVAL_TYPES, options.type)));
	  }
	  iteration_info = _.clone(options);
	  if (!iteration_info.range) {
	    iteration_info.range = {};
	  }
	  range = iteration_info.range;
	  no_models = false;
	  queue = new Queue(1);
	  queue.defer(function(callback) {
	    var start;
	    if (!(start = range.$gte || range.$gt)) {
	      return model_type.cursor(query).limit(1).sort(key).toModels(function(err, models) {
	        if (err) {
	          return callback(err);
	        }
	        if (!models.length) {
	          no_models = true;
	          return callback();
	        }
	        range.start = iteration_info.first = models[0].get(key);
	        return callback();
	      });
	    } else {
	      range.start = start;
	      return model_type.findOneNearestDate(start, {
	        key: key,
	        reverse: true
	      }, query, function(err, model) {
	        if (err) {
	          return callback(err);
	        }
	        if (!model) {
	          no_models = true;
	          return callback();
	        }
	        iteration_info.first = model.get(key);
	        return callback();
	      });
	    }
	  });
	  queue.defer(function(callback) {
	    var end;
	    if (no_models) {
	      return callback();
	    }
	    if (!(end = range.$lte || range.$lt)) {
	      return model_type.cursor(query).limit(1).sort("-" + key).toModels(function(err, models) {
	        if (err) {
	          return callback(err);
	        }
	        if (!models.length) {
	          no_models = true;
	          return callback();
	        }
	        range.end = iteration_info.last = models[0].get(key);
	        return callback();
	      });
	    } else {
	      range.end = end;
	      return model_type.findOneNearestDate(end, {
	        key: key
	      }, query, function(err, model) {
	        if (err) {
	          return callback(err);
	        }
	        if (!model) {
	          no_models = true;
	          return callback();
	        }
	        iteration_info.last = model.get(key);
	        return callback();
	      });
	    }
	  });
	  return queue.await(function(err) {
	    var length_ms, processed_count, runInterval, start_ms;
	    if (err) {
	      return callback(err);
	    }
	    if (no_models) {
	      return callback();
	    }
	    start_ms = range.start.getTime();
	    length_ms = DateUtils.durationAsMilliseconds((_.isUndefined(options.length) ? 1 : options.length), options.type);
	    if (!length_ms) {
	      throw Error("length_ms is invalid: " + length_ms + " for range: " + (JSONUtils.stringify(range)));
	    }
	    query = _.omit(query, '$interval');
	    query.$sort = [key];
	    processed_count = 0;
	    iteration_info.index = 0;
	    runInterval = function(current) {
	      if (DateUtils.isAfter(current, range.end)) {
	        return callback();
	      }
	      query[key] = {
	        $gte: current,
	        $lte: iteration_info.last
	      };
	      return model_type.findOne(query, function(err, model) {
	        var next;
	        if (err) {
	          return callback(err);
	        }
	        if (!model) {
	          return callback();
	        }
	        next = model.get(key);
	        iteration_info.index = Math.floor((next.getTime() - start_ms) / length_ms);
	        current = new Date(range.start.getTime() + iteration_info.index * length_ms);
	        iteration_info.start = current;
	        next = new Date(current.getTime() + length_ms);
	        iteration_info.end = next;
	        query[key] = {
	          $gte: current,
	          $lt: next
	        };
	        return iterator(query, iteration_info, function(err) {
	          if (err) {
	            return callback(err);
	          }
	          return runInterval(next);
	        });
	      });
	    };
	    return runInterval(range.start);
	  });
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var Backbone, Utils, collection_type, fn, key, overrides, _;

	_ = __webpack_require__(1);

	Backbone = __webpack_require__(2);

	Utils = __webpack_require__(7);

	collection_type = Backbone.Collection;

	overrides = {
	  fetch: function(options) {
	    var callback;
	    if (_.isFunction(callback = arguments[arguments.length - 1])) {
	      switch (arguments.length) {
	        case 1:
	          options = Utils.wrapOptions({}, callback);
	          break;
	        case 2:
	          options = Utils.wrapOptions(options, callback);
	      }
	    }
	    return collection_type.prototype._orm_original_fns.fetch.call(this, Utils.wrapOptions(options, (function(_this) {
	      return function(err, model, resp, options) {
	        if (err) {
	          return typeof options.error === "function" ? options.error(_this, resp, options) : void 0;
	        }
	        return typeof options.success === "function" ? options.success(model, resp, options) : void 0;
	      };
	    })(this)));
	  },
	  _prepareModel: function(attrs, options) {
	    var id, is_new, model;
	    if (!Utils.isModel(attrs) && (id = Utils.dataId(attrs))) {
	      if (this.model.cache) {
	        is_new = !!this.model.cache.get(id);
	      }
	      model = Utils.updateOrNew(attrs, this.model);
	      if (is_new && !model._validate(attrs, options)) {
	        this.trigger('invalid', this, attrs, options);
	        return false;
	      }
	      return model;
	    }
	    return collection_type.prototype._orm_original_fns._prepareModel.call(this, attrs, options);
	  }
	};

	if (!collection_type.prototype._orm_original_fns) {
	  collection_type.prototype._orm_original_fns = {};
	  for (key in overrides) {
	    fn = overrides[key];
	    collection_type.prototype._orm_original_fns[key] = collection_type.prototype[key];
	    collection_type.prototype[key] = fn;
	  }
	}


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var Backbone, BackboneORM, Queue, Relation, Utils, _;

	_ = __webpack_require__(1);

	Backbone = __webpack_require__(2);

	BackboneORM = __webpack_require__(4);

	Queue = __webpack_require__(10);

	Utils = __webpack_require__(7);

	module.exports = Relation = (function() {
	  function Relation() {}

	  Relation.prototype.isEmbedded = function() {
	    return !!(this.embed || (this.reverse_relation && this.reverse_relation.embed));
	  };

	  Relation.prototype.isVirtual = function() {
	    return !!(this.virtual || (this.reverse_relation && this.reverse_relation.virtual));
	  };

	  Relation.prototype.findOrGenerateJoinTable = function() {
	    var join_table;
	    if (join_table = this.join_table || this.reverse_relation.join_table) {
	      return join_table;
	    }
	    return this.model_type.schema().generateJoinTable(this);
	  };

	  Relation.prototype._findOrGenerateReverseRelation = function() {
	    var model_type, reverse_model_type, reverse_relation;
	    model_type = this.model_type;
	    reverse_model_type = this.reverse_model_type;
	    if (!_.isFunction(reverse_model_type.schema)) {
	      reverse_model_type.sync = model_type.createSync(reverse_model_type);
	    }
	    reverse_relation = reverse_model_type.relation(this.as);
	    if (!reverse_relation) {
	      reverse_relation = reverse_model_type.relation(BackboneORM.naming_conventions.attribute(model_type.model_name, false));
	    }
	    if (!reverse_relation) {
	      reverse_relation = reverse_model_type.relation(BackboneORM.naming_conventions.attribute(model_type.model_name, true));
	    }
	    if (!reverse_relation && (this.type !== 'belongsTo')) {
	      reverse_relation = reverse_model_type.schema().generateBelongsTo(model_type);
	    }
	    if (reverse_relation && !reverse_relation.reverse_relation) {
	      reverse_relation.reverse_relation = this;
	    }
	    return reverse_relation;
	  };

	  Relation.prototype._saveRelated = function(model, related_models, callback) {
	    if (this.embed || !this.reverse_relation || (this.type === 'belongsTo')) {
	      return callback();
	    }
	    if (this.isVirtual()) {
	      return callback();
	    }
	    return this.cursor(model, this.key).toJSON((function(_this) {
	      return function(err, json) {
	        var added_id, added_ids, changes, queue, related_id, related_ids, related_json, related_model, test, _fn, _fn1, _fn2, _i, _j, _k, _len, _len1, _len2, _ref;
	        if (err) {
	          return callback(err);
	        }
	        if (!_.isArray(json)) {
	          json = (json ? [json] : []);
	        }
	        queue = new Queue(1);
	        related_ids = _.pluck(related_models, 'id');
	        changes = _.groupBy(json, function(test) {
	          if (_.contains(related_ids, test.id)) {
	            return 'kept';
	          } else {
	            return 'removed';
	          }
	        });
	        added_ids = changes.kept ? _.difference(related_ids, (function() {
	          var _i, _len, _ref, _results;
	          _ref = changes.kept;
	          _results = [];
	          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	            test = _ref[_i];
	            _results.push(test.id);
	          }
	          return _results;
	        })()) : related_ids;
	        if (changes.removed) {
	          if (_this.join_table) {
	            queue.defer(function(callback) {
	              var query, related_json;
	              query = {};
	              query[_this.reverse_relation.join_key] = {
	                $in: (function() {
	                  var _i, _len, _ref, _results;
	                  _ref = changes.removed;
	                  _results = [];
	                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	                    related_json = _ref[_i];
	                    _results.push(related_json[this.reverse_model_type.prototype.idAttribute]);
	                  }
	                  return _results;
	                }).call(_this)
	              };
	              return _this.join_table.destroy(query, callback);
	            });
	          } else {
	            _ref = changes.removed;
	            _fn = function(related_json) {
	              return queue.defer(function(callback) {
	                related_json[_this.reverse_relation.foreign_key] = null;
	                return Utils.modelJSONSave(related_json, _this.reverse_model_type, callback);
	              });
	            };
	            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	              related_json = _ref[_i];
	              _fn(related_json);
	            }
	          }
	        }
	        if (added_ids.length) {
	          if (_this.join_table) {
	            _fn1 = function(related_id) {
	              return queue.defer(function(callback) {
	                var attributes, join;
	                attributes = {};
	                attributes[_this.foreign_key] = model.id;
	                attributes[_this.reverse_relation.foreign_key] = related_id;
	                join = new _this.join_table(attributes);
	                return join.save(callback);
	              });
	            };
	            for (_j = 0, _len1 = added_ids.length; _j < _len1; _j++) {
	              related_id = added_ids[_j];
	              _fn1(related_id);
	            }
	          } else {
	            _fn2 = function(related_model) {
	              return queue.defer(function(callback) {
	                return related_model.save(function(err, saved_model) {
	                  var cache;
	                  if (!err && (cache = _this.reverse_model_type.cache)) {
	                    cache.set(saved_model.id, saved_model);
	                  }
	                  return callback(err);
	                });
	              });
	            };
	            for (_k = 0, _len2 = added_ids.length; _k < _len2; _k++) {
	              added_id = added_ids[_k];
	              related_model = _.find(related_models, function(test) {
	                return test.id === added_id;
	              });
	              if (!_this.reverse_relation._hasChanged(related_model)) {
	                continue;
	              }
	              _fn2(related_model);
	            }
	          }
	        }
	        return queue.await(callback);
	      };
	    })(this));
	  };

	  return Relation;

	})();


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-orm.js 0.6.0
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-orm
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var CacheCursor, _,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	_ = __webpack_require__(1);

	module.exports = CacheCursor = (function(_super) {
	  __extends(CacheCursor, _super);

	  function CacheCursor() {
	    return CacheCursor.__super__.constructor.apply(this, arguments);
	  }

	  CacheCursor.prototype.toJSON = function(callback) {
	    return this.wrapped_sync_fn('cursor', _.extend({}, this._find, this._cursor)).toJSON(callback);
	  };

	  return CacheCursor;

	})(__webpack_require__(20));


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	exports.read = function(buffer, offset, isLE, mLen, nBytes) {
	  var e, m,
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      nBits = -7,
	      i = isLE ? (nBytes - 1) : 0,
	      d = isLE ? -1 : 1,
	      s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity);
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	};

	exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c,
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
	      i = isLE ? 0 : (nBytes - 1),
	      d = isLE ? 1 : -1,
	      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

	  buffer[offset + i - d] |= s * 128;
	};


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array

		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)

		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS)
				return 62 // '+'
			if (code === SLASH)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}

		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length

			var L = 0

			function push (v) {
				arr[L++] = v
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}

			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}

			return arr
		}

		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length

			function encode (num) {
				return lookup.charAt(num)
			}

			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}

			return output
		}

		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))


/***/ }
/******/ ])
})
