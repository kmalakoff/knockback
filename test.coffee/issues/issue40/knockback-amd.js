/*
  knockback.js 0.16.2
  (c) 2011-2013 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
*/


(function(window,document,navigator,undefined){
!function(factory) {
    // Support three module loading scenarios
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // [1] CommonJS/Node.js
        var target = module['exports'] || exports; // module.exports is for Node.js
        factory(target);
    } else if (typeof define === 'function' && define['amd']) {
        // [2] AMD anonymous module
        define('knockback', ['underscore', 'backbone', 'knockout'], factory);
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        factory(window['kb'] = {});
    }
}(function() {
  var Backbone, KB_TYPE_ARRAY, KB_TYPE_COLLECTION, KB_TYPE_MODEL, KB_TYPE_SIMPLE, KB_TYPE_UNKNOWN, Knockback, addStatisticsEvent, arraySlice, arraySplice, collapseOptions, kb, ko, legacyWarning, throwMissing, throwUnexpected, _, _argumentsAddKey, _unwrapModels, _wrappedKey,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  kb = (function() {

    function kb() {}

    kb.VERSION = '0.16.2';

    kb.release = function(obj, pre_release_fn) {
      var array, item, view_model, view_models, _i, _j, _len, _len1;
      if ((!obj || (obj !== Object(obj))) || ((typeof obj === 'function') && !ko.isObservable(obj)) || obj.__kb_destroyed || ((obj instanceof Backbone.Model) || (obj instanceof Backbone.Collection))) {
        return this;
      }
      if (_.isArray(obj)) {
        array = obj.splice(0, obj.length);
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          item = array[_i];
          kb.release(item);
        }
        return this;
      }
      obj.__kb_destroyed = true;
      !pre_release_fn || pre_release_fn();
      if (ko.isObservable(obj) || (typeof obj.dispose === 'function') || (typeof obj.destroy === 'function') || (typeof obj.release === 'function')) {
        if (ko.isObservable(obj) && _.isArray(array = obj())) {
          if (obj.__kb_is_co || (obj.__kb_is_o && (obj.valueType() === KB_TYPE_COLLECTION))) {
            if (obj.destroy) {
              obj.destroy();
            } else if (obj.dispose) {
              obj.dispose();
            }
          } else if (array.length) {
            view_models = array.slice(0);
            array.splice(0, array.length);
            for (_j = 0, _len1 = view_models.length; _j < _len1; _j++) {
              view_model = view_models[_j];
              kb.release(view_model);
            }
          }
        } else if (obj.release) {
          obj.release();
        } else if (obj.destroy) {
          obj.destroy();
        } else if (obj.dispose) {
          obj.dispose();
        }
      } else {
        this.releaseKeys(obj);
      }
      return this;
    };

    kb.releaseKeys = function(obj) {
      var key, value;
      for (key in obj) {
        value = obj[key];
        (key === '__kb') || kb.release(value, (function() {
          return obj[key] = null;
        }));
      }
      return this;
    };

    kb.releaseOnNodeRemove = function(view_model, node) {
      view_model || throwUnexpected(this, 'missing view model');
      node || throwUnexpected(this, 'missing node');
      return ko.utils.domNodeDisposal.addDisposeCallback(node, function() {
        return kb.release(view_model);
      });
    };

    kb.renderAutoReleasedTemplate = function(template, view_model, options) {
      var el, observable;
      if (options == null) {
        options = {};
      }
      el = document.createElement('div');
      observable = ko.renderTemplate(template, view_model, options, el, 'replaceChildren');
      if (el.children.length === 1) {
        el = el.children[0];
      }
      kb.releaseOnNodeRemove(view_model, el);
      observable.dispose();
      return el;
    };

    kb.applyBindings = function(view_model, node) {
      ko.applyBindings(view_model, node);
      return kb.releaseOnNodeRemove(view_model, node);
    };

    return kb;

  })();

  this.Knockback = Knockback = this.kb = kb;

  if (typeof exports !== 'undefined') {
    module.exports = kb;
  }

  if (!this._ && (typeof require !== 'undefined')) {
    try {
      _ = require('lodash');
    } catch (e) {
      _ = require('underscore');
    }
  } else {
    _ = this._;
  }

  kb._ = _ = _.hasOwnProperty('_') ? _._ : _;

  kb.Backbone = Backbone = !this.Backbone && (typeof require !== 'undefined') ? require('backbone') : this.Backbone;

  kb.ko = ko = !this.ko && (typeof require !== 'undefined') ? require('knockout') : this.ko;

  throwMissing = function(instance, message) {
    throw "" + instance.constructor.name + ": " + message + " is missing";
  };

  throwUnexpected = function(instance, message) {
    throw "" + instance.constructor.name + ": " + message + " is unexpected";
  };

  legacyWarning = function(identifier, last_version, message) {
    var _base;
    this._legacy_warnings || (this._legacy_warnings = {});
    (_base = this._legacy_warnings)[identifier] || (_base[identifier] = 0);
    this._legacy_warnings[identifier]++;
    return console.warn("warning: '" + identifier + "' has been deprecated (will be removed in Knockback after " + last_version + "). " + message + ".");
  };

  arraySplice = Array.prototype.splice;

  collapseOptions = function(options) {
    var result;
    result = _.clone(options);
    while (options.options) {
      _.defaults(result, options.options);
      options = options.options;
    }
    delete result.options;
    return result;
  };

  kb.TYPE_UNKNOWN = KB_TYPE_UNKNOWN = 0;

  kb.TYPE_SIMPLE = KB_TYPE_SIMPLE = 1;

  kb.TYPE_ARRAY = KB_TYPE_ARRAY = 2;

  kb.TYPE_MODEL = KB_TYPE_MODEL = 3;

  kb.TYPE_COLLECTION = KB_TYPE_COLLECTION = 4;

  /*
    knockback-utils.js
    (c) 2011-2013 Kevin Malakoff.
    Knockback.js is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
    Dependencies: Knockout.js, Backbone.js, and Underscore.js.
      Optional dependency: Backbone.ModelRef.js.
  */


  _wrappedKey = function(obj, key, value) {
    if (arguments.length === 2) {
      if (obj && obj.__kb && obj.__kb.hasOwnProperty(key)) {
        return obj.__kb[key];
      } else {
        return void 0;
      }
    }
    obj || throwUnexpected(this, "no obj for wrapping " + key);
    obj.__kb || (obj.__kb = {});
    obj.__kb[key] = value;
    return value;
  };

  _argumentsAddKey = function(args, key) {
    arraySplice.call(args, 1, 0, key);
    return args;
  };

  _unwrapModels = function(obj) {
    var key, result, value;
    if (!obj) {
      return obj;
    } else if (obj.__kb) {
      if ('object' in obj.__kb) {
        return obj.__kb.object;
      } else {
        return obj;
      }
    } else if (_.isArray(obj)) {
      return _.map(obj, function(test) {
        return _unwrapModels(test);
      });
    } else if (_.isObject(obj) && !ko.isObservable(obj) && !_.isDate(obj) && !_.isString(obj)) {
      result = {};
      for (key in obj) {
        value = obj[key];
        result[key] = _unwrapModels(value);
      }
      return result;
    } else {
      return obj;
    }
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

    utils.wrappedModelWatcher = function(obj, value) {
      return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'model_watcher'));
    };

    utils.wrappedModelWatcherIsOwned = function(obj, value) {
      return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'model_watcher_is_owned'));
    };

    utils.wrappedDestroy = function(obj) {
      var __kb;
      if (!obj.__kb) {
        return;
      }
      if (obj.__kb.model_watcher) {
        obj.__kb.model_watcher.releaseCallbacks(obj);
      }
      __kb = obj.__kb;
      obj.__kb = null;
      if (__kb.observable) {
        __kb.observable.destroy = __kb.observable.release = null;
        this.wrappedDestroy(__kb.observable);
        __kb.observable = null;
      }
      __kb.factory = null;
      if (__kb.model_watcher_is_owned) {
        __kb.model_watcher.destroy();
      }
      __kb.model_watcher = null;
      if (__kb.store_is_owned) {
        __kb.store.destroy();
      }
      return __kb.store = null;
    };

    utils.valueType = function(observable) {
      if (!observable) {
        return KB_TYPE_UNKNOWN;
      }
      if (observable.__kb_is_o) {
        return observable.valueType();
      }
      if (observable.__kb_is_co || (observable instanceof Backbone.Collection)) {
        return KB_TYPE_COLLECTION;
      }
      if ((observable instanceof kb.ViewModel) || (observable instanceof Backbone.Model)) {
        return KB_TYPE_MODEL;
      }
      if (_.isArray(observable)) {
        return KB_TYPE_ARRAY;
      }
      return KB_TYPE_SIMPLE;
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
      var creator, relation;
      if (factory) {
        creator = factory.creatorForPath(value, path);
      }
      if (creator) {
        return creator;
      }
      if (owner && Backbone.RelationalModel && (owner instanceof Backbone.RelationalModel)) {
        key = ko.utils.unwrapObservable(key);
        relation = _.find(owner.getRelations(), function(test) {
          return test.key === key;
        });
        if (relation) {
          if (relation.collectionType || _.isArray(relation.keyContents)) {
            return kb.CollectionObservable;
          } else {
            return kb.ViewModel;
          }
        }
      }
      if (!value) {
        return null;
      }
      if (value instanceof Backbone.Model) {
        return kb.ViewModel;
      }
      if (value instanceof Backbone.Collection) {
        return kb.CollectionObservable;
      }
      return null;
    };

    utils.createFromDefaultCreator = function(obj, options) {
      if (obj instanceof Backbone.Model) {
        return kb.viewModel(obj, options);
      }
      if (obj instanceof Backbone.Collection) {
        return kb.collectionObservable(obj, options);
      }
      if (_.isArray(obj)) {
        return ko.observableArray(obj);
      }
      return ko.observable(obj);
    };

    utils.release = function(obj) {
      legacyWarning('kb.utils.release', '0.16.2', 'Please use kb.release instead');
      return kb.release(obj);
    };

    return utils;

  })();

  /*
    knockback_factory.js
    (c) 2011-2013 Kevin Malakoff.
    Knockback.Factory is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.Factory = (function() {

    Factory.useOptionsOrCreate = function(options, obj, owner_path) {
      var factory;
      if (options.factory && !options.factories) {
        factory = kb.utils.wrappedFactory(obj, options.factory);
      } else {
        factory = kb.utils.wrappedFactory(obj, new kb.Factory(options.factory));
      }
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
      return this;
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

  /*
    knockback_store.js
    (c) 2012 Kevin Malakoff.
    Knockback.Store is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.Store = (function() {

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
      var observable, record, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this.observable_records;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        record = _ref[_i];
        kb.release(record.observable);
      }
      _ref1 = this.replaced_observables;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        observable = _ref1[_j];
        kb.release(observable);
      }
      this.observable_records = null;
      return this.replaced_observables = null;
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
      if (!obj) {
        observable.__kb_null = true;
      }
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
      var index, record, _ref;
      if (!obj || (obj instanceof Backbone.Model)) {
        _ref = this.observable_records;
        for (index in _ref) {
          record = _ref[index];
          if (!record.observable) {
            continue;
          }
          if (record.observable.__kb_destroyed) {
            record.obj = null;
            record.observable = null;
            continue;
          }
          if ((!obj && !record.observable.__kb_null) || (obj && (record.observable.__kb_null || (record.obj !== obj)))) {
            continue;
          } else if ((record.creator === creator) || (record.creator.create && (record.creator.create === creator.create))) {
            return index;
          }
        }
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
      if (!options.creator && (obj instanceof Backbone.Model)) {
        options.creator = kv.ViewModel;
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
      if (creator.create) {
        observable = creator.create(obj, options);
      } else {
        observable = new creator(obj, options);
      }
      observable || (observable = ko.observable(null));
      if (!ko.isObservable(observable)) {
        this.isRegistered(observable) || this.register(obj, observable, options);
      }
      return observable;
    };

    Store.prototype.findOrReplace = function(obj, creator, observable) {
      var index, record;
      obj || raiseUnexpected('obj missing');
      if ((index = this.findIndex(obj, creator)) < 0) {
        return this.register(obj, observable, {
          creator: creator
        });
      } else {
        record = this.observable_records[index];
        (kb.utils.wrappedObject(record.observable) === obj) || throwUnexpected(this, 'different object');
        if (record.observable !== observable) {
          (record.observable.constructor === observable.constructor) || throwUnexpected(this, 'replacing different type');
          this.replaced_observables.push(record.observable);
          record.observable = observable;
        }
        return observable;
      }
    };

    return Store;

  })();

  /*
    knockback_model_watcher.js
    (c) 2011-2013 Kevin Malakoff.
    Knockback.Observable is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  addStatisticsEvent = function(model, event_name, info) {
    return !kb.statistics || kb.statistics.addModelEvent({
      name: event_name,
      model: model,
      key: info.key,
      path: info.path
    });
  };

  kb.ModelWatcher = (function() {

    ModelWatcher.useOptionsOrCreate = function(options, model, obj, callback_options) {
      if (options.model_watcher) {
        if (!(options.model_watcher.model() === model || (options.model_watcher.model_ref === model))) {
          throwUnexpected(this, 'model not matching');
        }
        return kb.utils.wrappedModelWatcher(obj, options.model_watcher).registerCallbacks(obj, callback_options);
      } else {
        kb.utils.wrappedModelWatcherIsOwned(obj, true);
        return kb.utils.wrappedModelWatcher(obj, new kb.ModelWatcher(model)).registerCallbacks(obj, callback_options);
      }
    };

    function ModelWatcher(model, obj, callback_options) {
      this._onModelUnloaded = __bind(this._onModelUnloaded, this);

      this._onModelLoaded = __bind(this._onModelLoaded, this);
      this.__kb || (this.__kb = {});
      this.__kb.callbacks = {};
      this.__kb._onModelLoaded = _.bind(this._onModelLoaded, this);
      this.__kb._onModelUnloaded = _.bind(this._onModelUnloaded, this);
      if (callback_options) {
        this.registerCallbacks(obj, callback_options);
      }
      if (model) {
        this.model(model);
      } else {
        this.m = null;
      }
    }

    ModelWatcher.prototype.destroy = function() {
      this.model(null);
      this.__kb.callbacks = null;
      return kb.utils.wrappedDestroy(this);
    };

    ModelWatcher.prototype.model = function(new_model) {
      var callbacks, event_name, info, list, previous_model, _i, _len, _ref;
      if ((arguments.length === 0) || (this.m === new_model)) {
        return this.m;
      }
      if (this.model_ref) {
        this.model_ref.unbind('loaded', this.__kb._onModelLoaded);
        this.model_ref.unbind('unloaded', this.__kb._onModelUnloaded);
        this.model_ref.release();
        this.model_ref = null;
      }
      if (Backbone.ModelRef && (new_model instanceof Backbone.ModelRef)) {
        this.model_ref = new_model;
        this.model_ref.retain();
        this.model_ref.bind('loaded', this.__kb._onModelLoaded);
        this.model_ref.bind('unloaded', this.__kb._onModelUnloaded);
        new_model = this.model_ref.model();
      } else {
        delete this.model_ref;
      }
      previous_model = this.m;
      this.m = new_model;
      _ref = this.__kb.callbacks;
      for (event_name in _ref) {
        callbacks = _ref[event_name];
        if (previous_model) {
          previous_model.unbind(event_name, callbacks.fn);
        }
        if (new_model) {
          new_model.bind(event_name, callbacks.fn);
        }
        list = callbacks.list;
        for (_i = 0, _len = list.length; _i < _len; _i++) {
          info = list[_i];
          if (info.model) {
            info.model(new_model);
          }
        }
      }
      return new_model;
    };

    ModelWatcher.prototype.registerCallbacks = function(obj, callback_info) {
      var callbacks, event_name, info, list;
      obj || throwMissing(this, 'obj');
      callback_info || throwMissing(this, 'info');
      event_name = callback_info.event_name ? callback_info.event_name : 'change';
      callbacks = this.__kb.callbacks[event_name];
      if (!callbacks) {
        list = [];
        callbacks = {
          list: list,
          fn: function(model) {
            var info, _i, _len;
            for (_i = 0, _len = list.length; _i < _len; _i++) {
              info = list[_i];
              if (info.update && !info.rel_fn) {
                if (model && info.key && (model.hasChanged && !model.hasChanged(ko.utils.unwrapObservable(info.key)))) {
                  continue;
                }
                !kb.statistics || addStatisticsEvent(model, event_name, info);
                info.update();
              }
            }
            return null;
          }
        };
        this.__kb.callbacks[event_name] = callbacks;
        if (this.m) {
          this.m.bind(event_name, callbacks.fn);
        }
      }
      info = _.defaults({
        obj: obj
      }, callback_info);
      callbacks.list.push(info);
      if (this.m) {
        if (Backbone.RelationalModel && (this.m instanceof Backbone.RelationalModel)) {
          this._modelBindRelatationalInfo(event_name, info);
        }
        info.model(this.m) && info.model;
      }
      return this;
    };

    ModelWatcher.prototype.releaseCallbacks = function(obj) {
      var callbacks, event_name, index, info, _ref, _ref1;
      if (!this.__kb.callbacks) {
        return;
      }
      _ref = this.__kb.callbacks;
      for (event_name in _ref) {
        callbacks = _ref[event_name];
        _ref1 = callbacks.list;
        for (index in _ref1) {
          info = _ref1[index];
          if (info.obj === obj) {
            callbacks.list.splice(index, 1);
            if (info.rel_fn) {
              this._modelUnbindRelatationalInfo(event_name, info);
            }
            if (info.model) {
              info.model(null);
            }
            return;
          }
        }
      }
    };

    ModelWatcher.prototype._onModelLoaded = function(model) {
      var callbacks, event_name, info, is_relational, list, _i, _len, _ref;
      is_relational = Backbone.RelationalModel && (model instanceof Backbone.RelationalModel);
      this.m = model;
      _ref = this.__kb.callbacks;
      for (event_name in _ref) {
        callbacks = _ref[event_name];
        model.bind(event_name, callbacks.fn);
        list = callbacks.list;
        for (_i = 0, _len = list.length; _i < _len; _i++) {
          info = list[_i];
          if (is_relational) {
            this._modelBindRelatationalInfo(event_name, info);
          }
          if (info.model) {
            info.model(model);
          }
        }
      }
      return this;
    };

    ModelWatcher.prototype._onModelUnloaded = function(model) {
      var callbacks, event_name, info, list, _i, _len, _ref;
      this.m = null;
      _ref = this.__kb.callbacks;
      for (event_name in _ref) {
        callbacks = _ref[event_name];
        model.unbind(event_name, callbacks.fn);
        list = callbacks.list;
        for (_i = 0, _len = list.length; _i < _len; _i++) {
          info = list[_i];
          if (info.rel_fn) {
            this._modelUnbindRelatationalInfo(event_name, info);
          }
          if (info.model) {
            info.model(null);
          }
        }
      }
      return this;
    };

    ModelWatcher.prototype._modelBindRelatationalInfo = function(event_name, info) {
      var key, relation;
      if ((event_name === 'change') && info.key && info.update) {
        key = ko.utils.unwrapObservable(info.key);
        relation = _.find(this.m.getRelations(), function(test) {
          return test.key === key;
        });
        if (!relation) {
          return;
        }
        info.rel_fn = function(model) {
          !kb.statistics || addStatisticsEvent(model, "" + event_name + " (relational)", info);
          return info.update();
        };
        if (relation.collectionType || _.isArray(relation.keyContents)) {
          info.is_collection = true;
          this.m.bind("add:" + info.key, info.rel_fn);
          this.m.bind("remove:" + info.key, info.rel_fn);
        } else {
          this.m.bind("update:" + info.key, info.rel_fn);
        }
      }
      return this;
    };

    ModelWatcher.prototype._modelUnbindRelatationalInfo = function(event_name, info) {
      if (!info.rel_fn) {
        return;
      }
      if (info.is_collection) {
        this.m.unbind("add:" + info.key, info.rel_fn);
        this.m.unbind("remove:" + info.key, info.rel_fn);
      } else {
        this.m.unbind("update:" + info.key, info.rel_fn);
      }
      info.rel_fn = null;
      return this;
    };

    return ModelWatcher;

  })();

  kb.modelObservable = function(model, observable) {
    return new kb.ModelWatcher(model, observable);
  };

  /*
    knockback-observable.js
    (c) 2012 Kevin Malakoff.
    Knockback.Observable is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.Observable = (function() {

    function Observable(model, options, vm) {
      var create_options, model_watcher, observable,
        _this = this;
      this.vm = vm;
      options || throwMissing(this, 'options');
      this.vm || (this.vm = {});
      if (_.isString(options) || ko.isObservable(options)) {
        create_options = this.create_options = {
          key: options
        };
      } else {
        create_options = this.create_options = collapseOptions(options);
      }
      this.key = create_options.key;
      delete create_options.key;
      this.key || throwMissing(this, 'key');
      !create_options.args || (this.args = create_options.args, delete create_options.args);
      !create_options.read || (this.read = create_options.read, delete create_options.read);
      !create_options.write || (this.write = create_options.write, delete create_options.write);
      model_watcher = create_options.model_watcher;
      delete create_options.model_watcher;
      this.vo = ko.observable(null);
      observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
        read: function() {
          var arg, args, new_value, _i, _len, _ref;
          args = [ko.utils.unwrapObservable(_this.key)];
          if (_this.args) {
            if (_.isArray(_this.args)) {
              _ref = _this.args;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                arg = _ref[_i];
                args.push(ko.utils.unwrapObservable(arg));
              }
            } else {
              args.push(ko.utils.unwrapObservable(_this.args));
            }
          }
          if (_this.m) {
            new_value = _this.read ? _this.read.apply(_this.vm, args) : _this.m.get.apply(_this.m, args);
            _this.update(new_value);
          }
          return ko.utils.unwrapObservable(_this.vo());
        },
        write: function(new_value) {
          var arg, args, set_info, unwrapped_new_value, _i, _len, _ref;
          unwrapped_new_value = _unwrapModels(new_value);
          set_info = {};
          set_info[ko.utils.unwrapObservable(_this.key)] = unwrapped_new_value;
          args = _this.write ? [unwrapped_new_value] : [set_info];
          if (_this.args) {
            if (_.isArray(_this.args)) {
              _ref = _this.args;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                arg = _ref[_i];
                args.push(ko.utils.unwrapObservable(arg));
              }
            } else {
              args.push(ko.utils.unwrapObservable(_this.args));
            }
          }
          if (_this.m) {
            if (_this.write) {
              _this.write.apply(_this.vm, args);
            } else {
              _this.m.set.apply(_this.m, args);
            }
          }
          return _this.update(new_value);
        },
        owner: this.vm
      }));
      observable.__kb_is_o = true;
      create_options.store = kb.utils.wrappedStore(observable, create_options.store);
      create_options.path = kb.utils.pathJoin(create_options.path, this.key);
      if (create_options.factories && ((typeof create_options.factories === 'function') || create_options.factories.create)) {
        create_options.factory = kb.utils.wrappedFactory(observable, new kb.Factory(create_options.factory));
        create_options.factory.addPathMapping(create_options.path, create_options.factories);
      } else {
        create_options.factory = kb.Factory.useOptionsOrCreate(create_options, observable, create_options.path);
      }
      delete create_options.factories;
      observable.value = _.bind(this.value, this);
      observable.valueType = _.bind(this.valueType, this);
      observable.destroy = _.bind(this.destroy, this);
      kb.ModelWatcher.useOptionsOrCreate({
        model_watcher: model_watcher
      }, model, this, {
        model: _.bind(this.model, this),
        update: _.bind(this.update, this),
        key: this.key,
        path: create_options.path
      });
      this.__kb_value || this.update();
      if (kb.LocalizedObservable && create_options.localizer) {
        observable = new create_options.localizer(observable);
        delete create_options.localizer;
      }
      if (kb.DefaultObservable && create_options.hasOwnProperty('default')) {
        observable = kb.defaultObservable(observable, create_options["default"]);
        delete create_options["default"];
      }
      return observable;
    }

    Observable.prototype.destroy = function() {
      this.__kb_destroyed = true;
      kb.release(this.__kb_value);
      this.__kb_value = null;
      this.vm = null;
      this.create_options = null;
      return kb.utils.wrappedDestroy(this);
    };

    Observable.prototype.value = function() {
      return this.__kb_value;
    };

    Observable.prototype.valueType = function() {
      var new_value;
      new_value = this.m ? this.m.get(this.key) : null;
      this.value_type || this._updateValueObservable(new_value);
      return this.value_type;
    };

    Observable.prototype.model = function(new_model) {
      if ((arguments.length === 0) || (this.m === new_model)) {
        return this.m;
      }
      this.m = new_model;
      return this.__kb_destroyed || this.update();
    };

    Observable.prototype.update = function(new_value) {
      var new_type, value;
      if (this.m && !arguments.length) {
        new_value = this.m.get(ko.utils.unwrapObservable(this.key));
      }
      new_value || (new_value = null);
      new_type = kb.utils.valueType(new_value);
      if (!this.__kb_value || (this.__kb_value.__kb_destroyed || (this.__kb_value.__kb_null && new_value))) {
        this.__kb_value = null;
        this.value_type = void 0;
      }
      value = this.__kb_value;
      if (_.isUndefined(this.value_type) || (this.value_type !== new_type && new_type !== KB_TYPE_UNKNOWN)) {
        if ((this.value_type === KB_TYPE_COLLECTION) && (new_type === KB_TYPE_ARRAY)) {
          return value(new_value);
        } else {
          return this._updateValueObservable(new_value);
        }
      } else if (this.value_type === KB_TYPE_MODEL) {
        if (typeof value.model === 'function') {
          if (value.model() !== new_value) {
            return value.model(new_value);
          }
        } else if (kb.utils.wrappedObject(value) !== new_value) {
          return this._updateValueObservable(new_value);
        }
      } else if (this.value_type === KB_TYPE_COLLECTION) {
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
      create_options.creator = kb.utils.inferCreator(new_value, create_options.factory, create_options.path, this.m, this.key);
      this.value_type = KB_TYPE_UNKNOWN;
      creator = create_options.creator;
      previous_value = this.__kb_value;
      this.__kb_value = null;
      if (previous_value) {
        kb.release(previous_value);
      }
      if (creator) {
        if (create_options.store) {
          value = create_options.store.findOrCreate(new_value, create_options);
        } else {
          if (creator.models_only) {
            value = new_value;
            this.value_type = KB_TYPE_SIMPLE;
          } else if (creator.create) {
            value = creator.create(new_value, create_options);
          } else {
            value = new creator(new_value, create_options);
          }
        }
      } else {
        this.value_type = KB_TYPE_SIMPLE;
        if (_.isArray(new_value)) {
          value = ko.observableArray(new_value);
        } else {
          value = ko.observable(new_value);
        }
      }
      if (this.value_type === KB_TYPE_UNKNOWN) {
        if (!ko.isObservable(value)) {
          this.value_type = KB_TYPE_MODEL;
          if (typeof value.model !== 'function') {
            kb.utils.wrappedObject(value, new_value);
          }
        } else if (value.__kb_is_co) {
          this.value_type = KB_TYPE_COLLECTION;
        } else {
          this.value_type = KB_TYPE_SIMPLE;
        }
      }
      this.__kb_value = value;
      return this.vo(value);
    };

    return Observable;

  })();

  kb.observable = function(model, options, view_model) {
    return new kb.Observable(model, options, view_model);
  };

  /*
    knockback-view-model.js
    (c) 2011-2013 Kevin Malakoff.
    Knockback.Observable is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.ViewModel = (function() {

    ViewModel.extend = Backbone.Model.extend;

    function ViewModel(model, options, view_model) {
      var attribute_keys, bb_model, keys, mapped_keys, mapping_info, model_watcher, vm_key, _ref;
      !model || (model instanceof Backbone.Model) || ((typeof model.get === 'function') && (typeof model.bind === 'function')) || throwUnexpected(this, 'not a model');
      options || (options = {});
      view_model || (view_model = {});
      if (_.isArray(options)) {
        options = {
          keys: options
        };
      } else {
        options = collapseOptions(options);
      }
      this.__kb || (this.__kb = {});
      this.__kb.vm_keys = {};
      this.__kb.model_keys = {};
      this.__kb.view_model = _.isUndefined(view_model) ? this : view_model;
      !options.internals || (this.__kb.internals = options.internals);
      !options.excludes || (this.__kb.excludes = options.excludes);
      kb.Store.useOptionsOrCreate(options, model, this);
      this.__kb.path = options.path;
      kb.Factory.useOptionsOrCreate(options, this, options.path);
      model_watcher = kb.utils.wrappedModelWatcher(this, new kb.ModelWatcher(model, this, {
        model: _.bind(this.model, this)
      }));
      if (options.requires && _.isArray(options.requires)) {
        keys = _.clone(options.requires);
      }
      if (this.__kb.internals) {
        keys = keys ? _.union(keys, this.__kb.internals) : _.clone(this.__kb.internals);
      }
      if (options.keys) {
        if (_.isArray(options.keys)) {
          this.__kb.keys = options.keys;
          keys = keys ? _.union(keys, options.keys) : _.clone(options.keys);
        } else {
          mapped_keys = {};
          _ref = options.keys;
          for (vm_key in _ref) {
            mapping_info = _ref[vm_key];
            mapped_keys[_.isString(mapping_info) ? mapping_info : (mapping_info.key ? mapping_info.key : vm_key)] = true;
          }
          this.__kb.keys = _.keys(mapped_keys);
        }
      } else {
        bb_model = model_watcher.model();
        if (bb_model && bb_model.attributes) {
          attribute_keys = _.keys(bb_model.attributes);
          keys = keys ? _.union(keys, attribute_keys) : attribute_keys;
        }
      }
      if (keys && this.__kb.excludes) {
        keys = _.difference(keys, this.__kb.excludes);
      }
      if (_.isObject(options.keys) && !_.isArray(options.keys)) {
        this._mapObservables(model, options.keys);
      }
      if (_.isObject(options.requires) && !_.isArray(options.requires)) {
        this._mapObservables(model, options.requires);
      }
      !options.mappings || this._mapObservables(model, options.mappings);
      !keys || this._createObservables(model, keys);
      !kb.statistics || kb.statistics.register('ViewModel', this);
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

    ViewModel.prototype.model = function(new_model) {
      var missing, model, model_watcher;
      model = kb.utils.wrappedObject(this);
      if ((arguments.length === 0) || (model === new_model)) {
        return model;
      }
      if (this.__kb_null) {
        !new_model || throwUnexpected(this, 'model set on shared null');
        return;
      }
      kb.utils.wrappedObject(this, new_model);
      model_watcher = kb.utils.wrappedModelWatcher(this);
      if (!model_watcher) {
        return;
      }
      model_watcher.model(new_model);
      if (this.__kb.keys || !new_model || !new_model.attributes) {
        return;
      }
      missing = _.difference(_.keys(new_model.attributes), _.keys(this.__kb.model_keys));
      if (missing) {
        return this._createObservables(new_model, missing);
      }
    };

    ViewModel.prototype._createObservables = function(model, keys) {
      var create_options, key, vm_key, _i, _len;
      create_options = {
        store: kb.utils.wrappedStore(this),
        factory: kb.utils.wrappedFactory(this),
        path: this.__kb.path,
        model_watcher: kb.utils.wrappedModelWatcher(this)
      };
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        vm_key = this.__kb.internals && ~_.indexOf(this.__kb.internals, key) ? "_" + key : key;
        if (this[vm_key]) {
          continue;
        }
        this.__kb.vm_keys[vm_key] = true;
        this.__kb.model_keys[key] = true;
        create_options.key = key;
        this[vm_key] = this.__kb.view_model[vm_key] = kb.observable(model, create_options, this);
      }
      return this;
    };

    ViewModel.prototype._mapObservables = function(model, mappings) {
      var create_options, mapping_info, vm_key;
      create_options = {
        store: kb.utils.wrappedStore(this),
        factory: kb.utils.wrappedFactory(this),
        path: this.__kb.path,
        model_watcher: kb.utils.wrappedModelWatcher(this)
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
        this.__kb.vm_keys[vm_key] = true;
        this.__kb.model_keys[mapping_info.key] = true;
        this[vm_key] = this.__kb.view_model[vm_key] = kb.observable(model, _.defaults(mapping_info, create_options), this);
      }
      return this;
    };

    return ViewModel;

  })();

  kb.viewModel = function(model, options, view_model) {
    return new kb.ViewModel(model, options, view_model);
  };

  kb.observables = function(model, binding_info, view_model) {
    legacyWarning('ko.observables', '0.16.2', 'Please use kb.viewModel instead');
    return new kb.ViewModel(model, binding_info, view_model);
  };

  /*
    knockback-collection-observable.js
    (c) 2011-2013 Kevin Malakoff.
    Knockback.CollectionObservable is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.CollectionObservable = (function() {

    CollectionObservable.extend = Backbone.Model.extend;

    function CollectionObservable(collection, options) {
      var create_options, factory, observable;
      !collection || (collection instanceof Backbone.Collection) || throwUnexpected(this, 'not a collection');
      options || (options = {});
      observable = kb.utils.wrappedObservable(this, ko.observableArray([]));
      observable.__kb_is_co = true;
      this.in_edit = 0;
      this.__kb || (this.__kb = {});
      this.__kb._onCollectionChange = _.bind(this._onCollectionChange, this);
      options = collapseOptions(options);
      this.sort_attribute = options.sort_attribute;
      this.sorted_index = options.sorted_index;
      this.filters = _.isArray(options.filters) ? options.filters : options.filters ? [options.filters] : void 0;
      create_options = this.create_options = {
        store: kb.Store.useOptionsOrCreate(options, collection, observable)
      };
      this.path = options.path;
      factory = create_options.factory = kb.utils.wrappedFactory(observable, new kb.Factory(options.factory));
      if (options.factories) {
        factory.addPathMappings(options.factories, options.path);
      }
      create_options.path = kb.utils.pathJoin(options.path, 'models');
      create_options.creator = factory.creatorForPath(null, create_options.path);
      if (create_options.creator) {
        this.models_only = create_options.creator.models_only;
      } else {
        if (options.hasOwnProperty('models_only')) {
          if (options.models_only) {
            factory.addPathMapping(create_options.path, {
              models_only: options.models_only
            });
            this.models_only = options.models_only;
          } else {
            factory.addPathMapping(create_options.path, kb.ViewModel);
          }
        } else if (options.view_model) {
          factory.addPathMapping(create_options.path, options.view_model);
        } else if (options.create) {
          factory.addPathMapping(create_options.path, {
            create: options.create
          });
        } else {
          factory.addPathMapping(create_options.path, kb.ViewModel);
        }
        create_options.creator = factory.creatorForPath(null, create_options.path);
      }
      observable.destroy = _.bind(this.destroy, this);
      observable.shareOptions = _.bind(this.shareOptions, this);
      observable.collection = _.bind(this.collection, this);
      observable.viewModelByModel = _.bind(this.viewModelByModel, this);
      observable.sortedIndex = _.bind(this.sortedIndex, this);
      observable.sortAttribute = _.bind(this.sortAttribute, this);
      observable.hasViewModels = _.bind(this.hasViewModels, this);
      observable.bind = _.bind(this.bind, this);
      observable.unbind = _.bind(this.unbind, this);
      observable.trigger = _.bind(this.trigger, this);
      kb.utils.wrappedObject(observable, null);
      if (collection) {
        this.collection(collection, {
          silent: true,
          'defer': options['defer']
        });
      }
      observable.subscribe(_.bind(this._onObservableArrayChange, this));
      !kb.statistics || kb.statistics.register('CollectionObservable', this);
      return observable;
    }

    CollectionObservable.prototype.destroy = function() {
      var collection, observable;
      observable = kb.utils.wrappedObservable(this);
      collection = kb.utils.wrappedObject(observable);
      if (collection) {
        collection.unbind('all', this.__kb._onCollectionChange);
        this._clear(true);
        kb.utils.wrappedObject(observable, null);
      }
      this.filters = null;
      this.sorted_index;
      this.create_options = null;
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

    CollectionObservable.prototype.collection = function(collection, options) {
      var observable, previous_collection;
      observable = kb.utils.wrappedObservable(this);
      previous_collection = kb.utils.wrappedObject(observable);
      if ((arguments.length === 0) || (collection === previous_collection)) {
        observable();
        return previous_collection;
      }
      if (collection) {
        if (typeof collection.retain === "function") {
          collection.retain();
        }
      }
      if (previous_collection) {
        previous_collection.unbind('all', this.__kb._onCollectionChange);
        if (typeof previous_collection.release === "function") {
          previous_collection.release();
        }
      }
      kb.utils.wrappedObject(observable, collection);
      if (collection) {
        collection.bind('all', this.__kb._onCollectionChange);
        this.sortedIndex(this.sorted_index, this.sort_attribute, options);
      } else {
        this._clear();
      }
      return collection;
    };

    CollectionObservable.prototype.sortedIndex = function(sorted_index, sort_attribute, options) {
      var _resync,
        _this = this;
      options || (options = {});
      if (sorted_index) {
        this.sorted_index = sorted_index;
        this.sort_attribute = sort_attribute;
      } else if (sort_attribute) {
        this.sort_attribute = sort_attribute;
        this.sorted_index = this._sortAttributeFn(sort_attribute);
      } else {
        this.sort_attribute = null;
        this.sorted_index = null;
      }
      _resync = function() {
        var collection, observable;
        observable = kb.utils.wrappedObservable(_this);
        collection = kb.utils.wrappedObject(observable);
        if ((collection.models.length === 0) && (observable().length === 0)) {
          return;
        }
        _this._collectionResync(true);
        if (!options.silent) {
          return _this.trigger('resort', observable());
        }
      };
      if (options['defer']) {
        _.defer(_resync);
      } else {
        _resync();
      }
      return this;
    };

    CollectionObservable.prototype.sortAttribute = function(sort_attribute, sorted_index, options) {
      return this.sortedIndex(sorted_index, sort_attribute, options);
    };

    CollectionObservable.prototype.viewModelByModel = function(model) {
      var id_attribute;
      if (this.models_only) {
        return null;
      }
      id_attribute = model.hasOwnProperty(model.idAttribute) ? model.idAttribute : 'cid';
      return _.find(kb.utils.wrappedObservable(this)(), function(test) {
        return test.__kb.object[id_attribute] === model[id_attribute];
      });
    };

    CollectionObservable.prototype.hasViewModels = function() {
      return !this.models_only;
    };

    CollectionObservable.prototype._onCollectionChange = function(event, arg) {
      var add_index, collection, observable, view_model;
      if (this.in_edit) {
        return;
      }
      switch (event) {
        case 'reset':
          return this._collectionResync();
        case 'resort':
          return !this.sorted_index;
          if (_.isArray(arg)) {
            return this.trigger('resort', kb.utils.wrappedObservable(this)());
          } else {
            return this._onModelResort(arg);
          }
          break;
        case 'new':
        case 'add':
          if (this._modelIsFiltered(arg)) {
            return;
          }
          observable = kb.utils.wrappedObservable(this);
          collection = kb.utils.wrappedObject(observable);
          view_model = this._createViewModel(arg);
          add_index = this.sorted_index ? this.sorted_index(observable(), view_model) : collection.indexOf(arg);
          this.in_edit++;
          observable.splice(add_index, 0, view_model);
          this.in_edit--;
          return this.trigger('add', view_model, observable());
        case 'remove':
        case 'destroy':
          return this._onModelRemove(arg);
        case 'change':
          return this._onModelChange(arg);
      }
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
      this.in_edit--;
      return this.trigger('remove', view_model, observable);
    };

    CollectionObservable.prototype._onModelChange = function(model) {
      if (this._modelIsFiltered(model)) {
        return this._onModelRemove(model);
      } else {
        if (this.sorted_index && (!this.sort_attribute || model.hasChanged(this.sort_attribute))) {
          return this._onModelResort(model);
        }
      }
    };

    CollectionObservable.prototype._onModelResort = function(model) {
      var collection, new_index, observable, previous_index, sorted_view_models, view_model;
      observable = kb.utils.wrappedObservable(this);
      collection = kb.utils.wrappedObject(observable);
      view_model = this.models_only ? model : this.viewModelByModel(model);
      previous_index = observable.indexOf(view_model);
      if (this.sorted_index) {
        sorted_view_models = _.clone(observable());
        sorted_view_models.splice(previous_index, 1);
        new_index = this.sorted_index(sorted_view_models, view_model);
      } else {
        new_index = collection.indexOf(model);
      }
      if (previous_index === new_index) {
        return;
      }
      this.in_edit++;
      observable.splice(previous_index, 1);
      observable.splice(new_index, 0, view_model);
      this.in_edit--;
      return this.trigger('resort', view_model, observable(), new_index);
    };

    CollectionObservable.prototype._onObservableArrayChange = function(values) {
      var collection, has_view_model, models, observable, value, _i, _j, _len, _len1,
        _this = this;
      if (this.in_edit) {
        return;
      }
      observable = kb.utils.wrappedObservable(this);
      collection = kb.utils.wrappedObject(observable);
      if (!this.models_only) {
        for (_i = 0, _len = values.length; _i < _len; _i++) {
          value = values[_i];
          if (value && !(value instanceof Backbone.Model)) {
            has_view_model = true;
            break;
          }
        }
        if (has_view_model) {
          for (_j = 0, _len1 = values.length; _j < _len1; _j++) {
            value = values[_j];
            this.create_options.store.findOrReplace(kb.utils.wrappedObject(value), this.create_options.creator, value);
          }
        }
      }
      models = _.map(values, function(test) {
        return kb.utils.wrappedModel(test);
      });
      if (this.filters) {
        models = _.filter(models, function(model) {
          return !_this._modelIsFiltered(model);
        });
      }
      if ((models.length !== values.length) || _.difference(collection.models, models).length) {
        this.in_edit++;
        collection.reset(models);
        return this.in_edit--;
      }
    };

    CollectionObservable.prototype._clear = function(silent) {
      var array, observable;
      observable = kb.utils.wrappedObservable(this);
      if (!silent) {
        this.trigger('remove', observable());
      }
      if (silent) {
        array = observable();
        array.splice(0, array.length);
      } else {
        this.in_edit++;
        observable.removeAll();
        this.in_edit--;
      }
      return this;
    };

    CollectionObservable.prototype._collectionResync = function(silent) {
      var add_index, array, collection, model, models, observable, view_model, view_models, _i, _len,
        _this = this;
      observable = kb.utils.wrappedObservable(this);
      collection = kb.utils.wrappedObject(observable);
      if (!silent) {
        this.trigger('remove', observable());
      }
      array = observable();
      array.splice(0, array.length);
      if (this.filters) {
        models = _.filter(collection.models, function(model) {
          return !_this._modelIsFiltered(model);
        });
      } else {
        models = collection.models;
      }
      if (this.sorted_index) {
        view_models = [];
        for (_i = 0, _len = models.length; _i < _len; _i++) {
          model = models[_i];
          view_model = this._createViewModel(model);
          add_index = this.sorted_index(view_models, view_model);
          view_models.splice(add_index, 0, view_model);
        }
      } else {
        view_models = this.models_only ? (this.filters ? models : _.clone(models)) : _.map(models, function(model) {
          return _this._createViewModel(model);
        });
      }
      this.in_edit++;
      observable(view_models);
      this.in_edit--;
      if (!silent) {
        return this.trigger('add', observable());
      }
    };

    CollectionObservable.prototype._sortAttributeFn = function(sort_attribute) {
      if (this.models_only) {
        return function(models, model) {
          return _.sortedIndex(models, model, function(test) {
            return test.get(sort_attribute);
          });
        };
      } else {
        return function(view_models, model) {
          return _.sortedIndex(view_models, model, function(test) {
            return kb.utils.wrappedModel(test).get(sort_attribute);
          });
        };
      }
    };

    CollectionObservable.prototype._createViewModel = function(model) {
      if (this.models_only) {
        return model;
      } else {
        return this.create_options.store.findOrCreate(model, this.create_options);
      }
    };

    CollectionObservable.prototype._modelIsFiltered = function(model) {
      var filter, _i, _len, _ref;
      if (this.filters) {
        _ref = this.filters;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          filter = _ref[_i];
          filter = ko.utils.unwrapObservable(filter);
          if (((typeof filter === 'function') && filter(model)) || (model && (model.id === filter))) {
            return true;
          }
        }
      }
      return false;
    };

    return CollectionObservable;

  })();

  __extends(kb.CollectionObservable.prototype, Backbone.Events);

  kb.collectionObservable = function(collection, options) {
    return new kb.CollectionObservable(collection, options);
  };

  kb.sortedIndexWrapAttr = kb.siwa = function(attribute_name, wrapper_constructor) {
    return function(models, model) {
      return _.sortedIndex(models, model, function(test) {
        return new wrapper_constructor(kb.utils.wrappedModel(test).get(attribute_name));
      });
    };
  };

  /*
    knockback_default_wrapper.js
    (c) 2011-2013 Kevin Malakoff.
    Knockback.DefaultObservable is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.DefaultObservable = (function() {

    function DefaultObservable(target_observable, dv) {
      var observable,
        _this = this;
      this.dv = dv;
      observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
        read: function() {
          var current_target;
          if ((current_target = ko.utils.unwrapObservable(target_observable()))) {
            return current_target;
          } else {
            return ko.utils.unwrapObservable(_this.dv);
          }
        },
        write: function(value) {
          return target_observable(value);
        }
      }));
      observable.destroy = _.bind(this.destroy, this);
      observable.setToDefault = _.bind(this.setToDefault, this);
      return observable;
    }

    DefaultObservable.prototype.destroy = function() {
      return kb.utils.wrappedDestroy(this);
    };

    DefaultObservable.prototype.setToDefault = function() {
      return kb.utils.wrappedObservable(this)(this.dv);
    };

    return DefaultObservable;

  })();

  kb.defaultObservable = function(target, default_value) {
    return new kb.DefaultObservable(target, default_value);
  };

  kb.defaultWrapper = function(target, default_value) {
    legacyWarning('ko.defaultWrapper', '0.16.2', 'Please use kb.defaultObservable instead');
    return new kb.DefaultObservable(target, default_value);
  };

  /*
    knockback-formatted-observable.js
    (c) 2011-2013 Kevin Malakoff.
    Knockback.FormattedObservable is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  arraySlice = Array.prototype.slice;

  kb.toFormattedString = function(format) {
    var arg, args, index, parameter_index, result, value;
    result = format.slice();
    args = arraySlice.call(arguments, 1);
    for (index in args) {
      arg = args[index];
      value = ko.utils.unwrapObservable(arg);
      value || (value = '');
      parameter_index = format.indexOf("\{" + index + "\}");
      while (parameter_index >= 0) {
        result = result.replace("{" + index + "}", value);
        parameter_index = format.indexOf("\{" + index + "\}", parameter_index + 1);
      }
    }
    return result;
  };

  kb.parseFormattedString = function(string, format) {
    var count, format_indices_to_matched_indices, index, match_index, matches, parameter_count, parameter_index, positions, regex, regex_string, result, results, sorted_positions;
    regex_string = format.slice();
    index = 0;
    parameter_count = 0;
    positions = {};
    while (regex_string.search("\\{" + index + "\\}") >= 0) {
      parameter_index = format.indexOf("\{" + index + "\}");
      while (parameter_index >= 0) {
        regex_string = regex_string.replace("\{" + index + "\}", '(.*)');
        positions[parameter_index] = index;
        parameter_count++;
        parameter_index = format.indexOf("\{" + index + "\}", parameter_index + 1);
      }
      index++;
    }
    count = index;
    regex = new RegExp(regex_string);
    matches = regex.exec(string);
    if (matches) {
      matches.shift();
    }
    if (!matches || (matches.length !== parameter_count)) {
      result = [];
      while (count-- > 0) {
        result.push('');
      }
      return result;
    }
    sorted_positions = _.sortBy(_.keys(positions), function(parameter_index, format_index) {
      return parseInt(parameter_index, 10);
    });
    format_indices_to_matched_indices = {};
    for (match_index in sorted_positions) {
      parameter_index = sorted_positions[match_index];
      index = positions[parameter_index];
      if (format_indices_to_matched_indices.hasOwnProperty(index)) {
        continue;
      }
      format_indices_to_matched_indices[index] = match_index;
    }
    results = [];
    index = 0;
    while (index < count) {
      results.push(matches[format_indices_to_matched_indices[index]]);
      index++;
    }
    return results;
  };

  kb.FormattedObservable = (function() {

    function FormattedObservable(format, args) {
      var observable, observable_args;
      if (_.isArray(args)) {
        format = format;
        observable_args = args;
      } else {
        observable_args = arraySlice.call(arguments, 1);
      }
      observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
        read: function() {
          var arg, _i, _len;
          args = [ko.utils.unwrapObservable(format)];
          for (_i = 0, _len = observable_args.length; _i < _len; _i++) {
            arg = observable_args[_i];
            args.push(ko.utils.unwrapObservable(arg));
          }
          return kb.toFormattedString.apply(null, args);
        },
        write: function(value) {
          var index, matches, max_count;
          matches = kb.parseFormattedString(value, ko.utils.unwrapObservable(format));
          max_count = Math.min(observable_args.length, matches.length);
          index = 0;
          while (index < max_count) {
            observable_args[index](matches[index]);
            index++;
          }
          return this;
        }
      }));
      return observable;
    }

    FormattedObservable.prototype.destroy = function() {
      return kb.utils.wrappedDestroy(this);
    };

    return FormattedObservable;

  })();

  kb.formattedObservable = function(format, args) {
    return new kb.FormattedObservable(format, arraySlice.call(arguments, 1));
  };

  /*
    knockback-localized-observable.js
    (c) 2011-2013 Kevin Malakoff.
    Knockback.LocalizedObservable is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.LocalizedObservable = (function() {

    LocalizedObservable.extend = Backbone.Model.extend;

    function LocalizedObservable(value, options, vm) {
      var observable,
        _this = this;
      this.value = value;
      this.vm = vm;
      options || (options = {});
      this.vm || (this.vm = {});
      this.read || throwMissing(this, 'read');
      kb.locale_manager || throwMissing(this, 'kb.locale_manager');
      this.__kb || (this.__kb = {});
      this.__kb._onLocaleChange = _.bind(this._onLocaleChange, this);
      this.__kb._onChange = options.onChange;
      if (this.value) {
        value = ko.utils.unwrapObservable(this.value);
      }
      this.vo = ko.observable(!value ? null : this.read(value, null));
      observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
        read: function() {
          if (_this.value) {
            ko.utils.unwrapObservable(_this.value);
          }
          _this.vo();
          return _this.read(ko.utils.unwrapObservable(_this.value));
        },
        write: function(value) {
          _this.write || throwUnexpected(_this, 'writing to read-only');
          _this.write(value, ko.utils.unwrapObservable(_this.value));
          _this.vo(value);
          if (_this.__kb._onChange) {
            return _this.__kb._onChange(value);
          }
        },
        owner: this.vm
      }));
      observable.destroy = _.bind(this.destroy, this);
      observable.observedValue = _.bind(this.observedValue, this);
      observable.resetToCurrent = _.bind(this.resetToCurrent, this);
      kb.locale_manager.bind('change', this.__kb._onLocaleChange);
      if (options.hasOwnProperty('default')) {
        observable = kb.DefaultObservable && ko.defaultObservable(observable, options["default"]);
      }
      return observable;
    }

    LocalizedObservable.prototype.destroy = function() {
      kb.locale_manager.unbind('change', this.__kb._onLocaleChange);
      this.vm = null;
      return kb.utils.wrappedDestroy(this);
    };

    LocalizedObservable.prototype.resetToCurrent = function() {
      var current_value, observable;
      observable = kb.utils.wrappedObservable(this);
      current_value = this.value ? this.read(ko.utils.unwrapObservable(this.value)) : null;
      if (observable() === current_value) {
        return;
      }
      return observable(current_value);
    };

    LocalizedObservable.prototype.observedValue = function(value) {
      if (arguments.length === 0) {
        return this.value;
      }
      this.value = value;
      this._onLocaleChange();
      return this;
    };

    LocalizedObservable.prototype._onLocaleChange = function() {
      var value;
      value = this.read(ko.utils.unwrapObservable(this.value));
      this.vo(value);
      if (this.__kb._onChange) {
        return this.__kb._onChange(value);
      }
    };

    return LocalizedObservable;

  })();

  kb.localizedObservable = function(value, options, view_model) {
    return new kb.LocalizedObservable(value, options, view_model);
  };

  /*
    knockback-triggered-observable.js
    (c) 2011-2013 Kevin Malakoff.
    Knockback.Observable is freely distributable under the MIT license.
    See the following for full license details:
      https://github.com/kmalakoff/knockback/blob/master/LICENSE
  */


  kb.TriggeredObservable = (function() {

    function TriggeredObservable(model, event_name) {
      var observable,
        _this = this;
      this.event_name = event_name;
      model || throwMissing(this, 'model');
      this.event_name || throwMissing(this, 'event_name');
      this.vo = ko.observable();
      observable = kb.utils.wrappedObservable(this, ko.dependentObservable(function() {
        return _this.vo();
      }));
      observable.destroy = _.bind(this.destroy, this);
      kb.utils.wrappedModelWatcher(this, new kb.ModelWatcher(model, this, {
        model: _.bind(this.model, this),
        update: _.bind(this.update, this),
        event_name: this.event_name
      }));
      return observable;
    }

    TriggeredObservable.prototype.destroy = function() {
      return kb.utils.wrappedDestroy(this);
    };

    TriggeredObservable.prototype.model = function(new_model) {
      if ((arguments.length === 0) || (this.m === new_model)) {
        return this.m;
      }
      if ((this.m = new_model)) {
        return this.update();
      }
    };

    TriggeredObservable.prototype.update = function() {
      if (!this.m) {
        return;
      }
      if (this.vo() !== this.m) {
        return this.vo(this.m);
      } else {
        return this.vo.valueHasMutated();
      }
    };

    return TriggeredObservable;

  })();

  kb.triggeredObservable = function(model, event_name) {
    return new kb.TriggeredObservable(model, event_name);
  };

  return kb;
});
})(window,document,navigator);
