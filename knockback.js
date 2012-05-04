/*
  knockback.js 0.15.0
  (c) 2011 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
*/
var fn, key, _ref;
if (!this.ko) {
  throw new Error('Knockback: Dependency alert! Knockout.js must be included before this file');
}
if (!this.Backbone) {
  throw new Error('Knockback: Dependency alert! Backbone.js must be included before this file');
}
if (!this._ || !this._.VERSION) {
  throw new Error('Knockback: Dependency alert! Underscore.js must be included before this file');
}
this.Knockback || (this.Knockback = {});
this.kb || (this.kb = this.Knockback);
Knockback.VERSION = '0.15.0';
Knockback.locale_manager;
Knockback.utils = {};
Knockback.utils.legacyWarning = function(identifier, message) {
  var _base;
  kb._legacy_warnings || (kb._legacy_warnings = {});
  (_base = kb._legacy_warnings)[identifier] || (_base[identifier] = 0);
  kb._legacy_warnings[identifier]++;
  return console.warn("Legacy warning! '" + identifier + "' has been deprecated. " + message);
};
Knockback.utils.wrappedObservable = function(instance, observable) {
  if (arguments.length === 1) {
    if (!(instance && instance.__kb && instance.__kb.observable)) {
      throw new Error('Knockback: instance is not wrapping an observable');
    }
    return instance.__kb.observable;
  }
  if (!instance) {
    throw new Error('Knockback: no instance for wrapping a observable');
  }
  instance.__kb || (instance.__kb = {});
  if (instance.__kb.observable) {
    instance.__kb.observable.instance = null;
  }
  instance.__kb.observable = observable;
  if (observable) {
    instance.__kb.observable.instance = instance;
  }
  return observable;
};
Knockback.utils.observableInstanceOf = function(observable, type) {
  if (!observable.instance) {
    return false;
  }
  return observable.instance instanceof type;
};
Knockback.utils.wrappedModel = function(instance, model) {
  if (arguments.length === 1) {
    if (instance && instance.__kb && instance.__kb.hasOwnProperty('model')) {
      return instance.__kb.model;
    } else {
      return instance;
    }
  }
  if (!instance) {
    throw new Error('Knockback: no instance for wrapping a model');
  }
  instance.__kb || (instance.__kb = {});
  instance.__kb.model = model;
  return model;
};
Knockback.viewModelGetModel = Knockback.vmModel = function(instance) {
  kb.utils.legacyWarning('kb.vmModel', 'Please use kb.utils.wrappedModel instead');
  return kb.utils.wrappedModel(instance);
};
Knockback.utils.setToDefault = function(obj) {
  var key, observable, _results;
  if (!obj) {
    return;
  }
  if (ko.isObservable(obj)) {
    return typeof obj.setToDefault === "function" ? obj.setToDefault() : void 0;
  } else if (_.isObject(obj)) {
    _results = [];
    for (key in obj) {
      observable = obj[key];
      _results.push((observable && (key !== '__kb') ? kb.utils.setToDefault(observable) : void 0));
    }
    return _results;
  }
};
Knockback.vmSetToDefault = function(view_model) {
  kb.utils.legacyWarning('kb.vmSetToDefault', 'Please use kb.utils.release instead');
  return kb.utils.setToDefault(view_model);
};
Knockback.utils.release = function(obj) {
  var key, value;
  if (ko.isObservable(obj) || (obj instanceof kb.Observables) || (obj instanceof kb.ViewModel_RCBase)) {
    if (obj.release) {
      obj.release();
    } else if (obj.destroy) {
      obj.destroy();
    } else if (obj.dispose) {
      obj.dispose();
    } else {
      return false;
    }
    return true;
  } else if (!_.isFunction(obj)) {
    for (key in obj) {
      value = obj[key];
      if (!value || (key === '__kb')) {
        continue;
      }
      if (kb.utils.release(value)) {
        obj[key] = null;
      }
    }
    return true;
  }
};
Knockback.utils.vmRelease = function(view_model) {
  kb.utils.legacyWarning('kb.vmRelease', 'Please use kb.utils.release instead');
  return kb.utils.release(view_model);
};
Knockback.utils.vmReleaseObservable = function(observable) {
  kb.utils.legacyWarning('kb.vmReleaseObservable', 'Please use kb.utils.release instead');
  return kb.utils.release(observable);
};
_ref = Knockback.utils;
for (key in _ref) {
  fn = _ref[key];
  Knockback[key] = function() {
    kb.utils.legacyWarning("kb." + key, "Please use kb.utils." + key + " instead");
    return kb.utils[key].apply(null, arguments);
  };
}
/*
  knockback_store.js
  (c) 2012 Kevin Malakoff.
  Knockback.Store is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/Knockback.Store = (function() {
  function Store() {
    this.keys = [];
    this.values = [];
  }
  Store.prototype.add = function(key, value) {
    var index;
    index = _.indexOf(this.keys, key);
    if (index >= 0) {
      this.values[index] = value;
    } else {
      this.keys.push(key);
      this.values.push(value);
    }
    return value;
  };
  Store.prototype.resolve = function(key, create_fn, args) {
    var index, value, _base;
    index = _.indexOf(this.keys, key);
    if (index >= 0) {
      if (this.values[index]) {
        if (typeof (_base = this.values[index]).retain === "function") {
          _base.retain();
        }
        return this.values[index];
      }
    } else {
      index = this.keys.length;
      this.keys.push(key);
      this.values.push(void 0);
    }
    value = create_fn.apply(null, Array.prototype.slice.call(arguments, 2));
    if (this.keys[index] !== key) {
      this.add(key, value);
    } else if (!this.values[index]) {
      this.values[index] = value;
    }
    return value;
  };
  Store.prototype.addResolverToOptions = function(options, key) {
    return _.extend(options, {
      __kb_store: this,
      __kb_store_key: key
    });
  };
  Store.resolveFromOptions = function(options, value) {
    if (!(options.__kb_store && options.__kb_store_key)) {
      return;
    }
    return options.__kb_store.add(options.__kb_store_key, value);
  };
  return Store;
})();
/*
  knockback_ref_countable.js
  (c) 2012 Kevin Malakoff.
  Knockback.RefCountable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/Knockback.RefCountable = (function() {
  RefCountable.extend = Backbone.Model.extend;
  function RefCountable() {
    this.__kb || (this.__kb = {});
    this.__kb.rc = {};
    this.__kb.rc.ref_count = 1;
  }
  RefCountable.prototype.__destroy = function() {};
  RefCountable.prototype.retain = function() {
    if (this.__kb.rc.ref_count <= 0) {
      throw new Error("RefCountable: ref_count is corrupt: " + this.__kb.rc.ref_count);
    }
    this.__kb.rc.ref_count++;
    return this;
  };
  RefCountable.prototype.release = function() {
    if (this.__kb.rc.ref_count <= 0) {
      throw new Error("RefCountable: ref_count is corrupt: " + this.__kb.rc.ref_count);
    }
    this.__kb.rc.ref_count--;
    if (!this.__kb.rc.ref_count) {
      this.__destroy();
    }
    return this;
  };
  RefCountable.prototype.refCount = function() {
    return this.__kb.rc.ref_count;
  };
  return RefCountable;
})();
/*
  knockback_collection_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.CollectionObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.CollectionObservable = (function() {
  __extends(CollectionObservable, kb.RefCountable);
  function CollectionObservable(collection, options) {
    var observable;
    if (options == null) {
      options = {};
    }
    if (!collection) {
      throw new Error('CollectionObservable: collection is missing');
    }
    CollectionObservable.__super__.constructor.apply(this, arguments);
    if (ko.isObservable(options) && options.hasOwnProperty('indexOf')) {
      kb.utils.legacyWarning('kb.collectionObservable with an external ko.observableArray', 'Please use the kb.collectionObservable directly instead of passing a ko.observableArray');
      observable = kb.utils.wrappedObservable(this, options);
      options = arguments[2] || {};
    } else {
      observable = kb.utils.wrappedObservable(this, ko.observableArray([]));
    }
    this.__kb.store = options.__kb_store || new kb.Store();
    kb.Store.resolveFromOptions(options, kb.utils.wrappedObservable(this));
    if (options.hasOwnProperty('view_model')) {
      this.view_model_create_fn = options.view_model;
      this.view_model_create_with_new = true;
    } else if (options.hasOwnProperty('view_model_create')) {
      this.view_model_create_fn = options.view_model_create;
    }
    this.sort_attribute = options.sort_attribute;
    this.sorted_index = options.sorted_index;
    this.__kb._onCollectionReset = _.bind(this._onCollectionReset, this);
    this.__kb._onCollectionResort = _.bind(this._onCollectionResort, this);
    this.__kb._onModelAdd = _.bind(this._onModelAdd, this);
    this.__kb._onModelRemove = _.bind(this._onModelRemove, this);
    this.__kb._onModelChange = _.bind(this._onModelChange, this);
    observable.retain = _.bind(this.retain, this);
    observable.refCount = _.bind(this.refCount, this);
    observable.release = _.bind(this.release, this);
    observable.collection = _.bind(this.collection, this);
    observable.viewModelByModel = _.bind(this.viewModelByModel, this);
    observable.sortedIndex = _.bind(this.sortedIndex, this);
    observable.sortAttribute = _.bind(this.sortAttribute, this);
    observable.hasViewModels = _.bind(this.hasViewModels, this);
    observable.bind = _.bind(this.bind, this);
    observable.unbind = _.bind(this.unbind, this);
    observable.trigger = _.bind(this.trigger, this);
    this.collection(collection, {
      silent: true,
      defer: options.defer
    });
    return observable;
  }
  CollectionObservable.prototype.__destroy = function() {
    this.collection(null);
    kb.utils.wrappedObservable(this).destroyAll();
    kb.utils.wrappedObservable(this, null);
    this.view_model_create_fn = null;
    this.__kb.store = null;
    this.__kb.co = null;
    return CollectionObservable.__super__.__destroy.apply(this, arguments);
  };
  CollectionObservable.prototype.collection = function(new_collection, options) {
    var observable, _base, _base2;
    observable = kb.utils.wrappedObservable(this);
    if (arguments.length === 0) {
      observable();
      return this.__kb.collection;
    }
    if (new_collection === this.__kb.collection) {
      return;
    }
    if (this.__kb.collection) {
      this._clear();
      this._collectionUnbind(this.__kb.collection);
      if (typeof (_base = this.__kb.collection).release === "function") {
        _base.release();
      }
      this.__kb.collection = null;
    }
    this.__kb.collection = new_collection;
    if (this.__kb.collection) {
      if (typeof (_base2 = this.__kb.collection).retain === "function") {
        _base2.retain();
      }
      this._collectionBind(this.__kb.collection);
      return this.sortedIndex(this.sorted_index, this.sort_attribute, options);
    }
  };
  CollectionObservable.prototype.sortedIndex = function(sorted_index, sort_attribute, options) {
    var _resync;
    if (options == null) {
      options = {};
    }
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
    _resync = __bind(function() {
      var observable;
      observable = kb.utils.wrappedObservable(this);
      if ((this.__kb.collection.models.length === 0) && (observable().length === 0)) {
        return;
      }
      this._collectionResync(true);
      if (!options.silent) {
        return this.trigger('resort', observable());
      }
    }, this);
    if (options.defer) {
      _.defer(_resync);
    } else {
      _resync();
    }
    return this;
  };
  CollectionObservable.prototype.sortAttribute = function(sort_attribute, sorted_index, silent) {
    return this.sortedIndex(sorted_index, sort_attribute, silent);
  };
  CollectionObservable.prototype.viewModelByModel = function(model) {
    var id_attribute, observable;
    if (!this.hasViewModels()) {
      return null;
    }
    observable = kb.utils.wrappedObservable(this);
    id_attribute = model.hasOwnProperty(model.idAttribute) ? model.idAttribute : 'cid';
    return _.find(observable(), function(test) {
      return test.__kb.model[id_attribute] === model[id_attribute];
    });
  };
  CollectionObservable.prototype.hasViewModels = function() {
    return !!this.view_model_create_fn;
  };
  CollectionObservable.prototype._collectionBind = function(collection) {
    var event, _i, _j, _len, _len2, _ref, _ref2;
    if (!collection) {
      return;
    }
    collection.bind('reset', this.__kb._onCollectionReset);
    if (!this.sorted_index) {
      collection.bind('resort', this.__kb._onCollectionResort);
    }
    _ref = ['new', 'add'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      collection.bind(event, this.__kb._onModelAdd);
    }
    _ref2 = ['remove', 'destroy'];
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      event = _ref2[_j];
      collection.bind(event, this.__kb._onModelRemove);
    }
    return collection.bind('change', this.__kb._onModelChange);
  };
  CollectionObservable.prototype._collectionUnbind = function(collection) {
    var event, _i, _j, _len, _len2, _ref, _ref2;
    if (!collection) {
      return;
    }
    collection.unbind('reset', this.__kb._onCollectionReset);
    if (!this.sorted_index) {
      collection.unbind('resort', this.__kb._onCollectionResort);
    }
    _ref = ['new', 'add'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      collection.unbind(event, this.__kb._onModelAdd);
    }
    _ref2 = ['remove', 'destroy'];
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      event = _ref2[_j];
      collection.unbind(event, this.__kb._onModelRemove);
    }
    return collection.unbind('change', this.__kb._onModelChange);
  };
  CollectionObservable.prototype._onCollectionReset = function() {
    return this._collectionResync();
  };
  CollectionObservable.prototype._onCollectionResort = function(model_or_models) {
    var observable;
    if (this.sorted_index) {
      throw new Error("CollectionObservable: collection sorted_index unexpected");
    }
    if (_.isArray(model_or_models)) {
      this(true);
      observable = kb.utils.wrappedObservable(this);
      return this.trigger('resort', observable());
    } else {
      return this._onModelResort(model_or_models);
    }
  };
  CollectionObservable.prototype._onModelAdd = function(model) {
    var add_index, observable, target;
    target = this.hasViewModels() ? this._createTarget(model) : model;
    observable = kb.utils.wrappedObservable(this);
    if (this.sorted_index) {
      add_index = this.sorted_index(observable(), target);
    } else {
      add_index = this.__kb.collection.indexOf(model);
    }
    observable.splice(add_index, 0, target);
    return this.trigger('add', target, observable());
  };
  CollectionObservable.prototype._onModelRemove = function(model) {
    var observable, target;
    target = this.hasViewModels() ? this.viewModelByModel(model) : model;
    if (!target) {
      return;
    }
    observable = kb.utils.wrappedObservable(this);
    observable.remove(target);
    this.trigger('remove', target, observable);
    if (!this.hasViewModels()) {
      return;
    }
    kb.utils.release(target);
    return kb.utils.wrappedModel(target, null);
  };
  CollectionObservable.prototype._onModelChange = function(model) {
    if (this.sorted_index && (!this.sort_attribute || model.hasChanged(this.sort_attribute))) {
      this._onModelResort(model);
    }
    return kb.utils.wrappedObservable(this).valueHasMutated();
  };
  CollectionObservable.prototype._onModelResort = function(model) {
    var new_index, observable, previous_index, sorted_targets, target;
    observable = kb.utils.wrappedObservable(this);
    target = this.hasViewModels() ? this.viewModelByModel(model) : model;
    previous_index = observable.indexOf(target);
    if (this.sorted_index) {
      sorted_targets = _.clone(observable());
      sorted_targets.splice(previous_index, 1);
      new_index = this.sorted_index(sorted_targets, target);
    } else {
      new_index = this.__kb.collection.indexOf(model);
    }
    if (previous_index === new_index) {
      return;
    }
    observable.splice(previous_index, 1);
    observable.splice(new_index, 0, target);
    return this.trigger('resort', target, observable(), new_index);
  };
  CollectionObservable.prototype._clear = function(silent) {
    var observable, targets, view_model, _i, _len, _results;
    observable = kb.utils.wrappedObservable(this);
    if (!silent) {
      this.trigger('remove', observable());
    }
    targets = observable.removeAll();
    if (!this.hasViewModels()) {
      return;
    }
    _results = [];
    for (_i = 0, _len = targets.length; _i < _len; _i++) {
      view_model = targets[_i];
      _results.push(kb.utils.release(view_model));
    }
    return _results;
  };
  CollectionObservable.prototype._collectionResync = function(silent) {
    var add_index, model, observable, target, targets, _i, _len, _ref;
    this._clear(silent);
    observable = kb.utils.wrappedObservable(this);
    if (this.sorted_index) {
      targets = [];
      _ref = this.__kb.collection.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        model = _ref[_i];
        target = this._createTarget(model);
        add_index = this.sorted_index(targets, target);
        targets.splice(add_index, 0, target);
      }
    } else {
      targets = this.hasViewModels() ? _.map(this.__kb.collection.models, __bind(function(model) {
        return this._createTarget(model);
      }, this)) : _.clone(this.__kb.collection.models);
    }
    observable(targets);
    if (!silent) {
      return this.trigger('add', observable());
    }
  };
  CollectionObservable.prototype._sortAttributeFn = function(sort_attribute) {
    if (this.hasViewModels()) {
      return function(view_models, model) {
        return _.sortedIndex(view_models, model, function(test) {
          return kb.utils.wrappedModel(test).get(sort_attribute);
        });
      };
    } else {
      return function(models, model) {
        return _.sortedIndex(models, model, function(test) {
          return test.get(sort_attribute);
        });
      };
    }
  };
  CollectionObservable.prototype._createTarget = function(model) {
    if (!this.view_model_create_fn) {
      return model;
    }
    return this.__kb.store.resolve(model, __bind(function() {
      var options, view_model;
      options = this.__kb.store.addResolverToOptions({}, model);
      view_model = this.view_model_create_with_new ? new this.view_model_create_fn(model, options) : this.view_model_create_fn(model, options);
      kb.utils.wrappedModel(view_model, model);
      return view_model;
    }, this));
  };
  return CollectionObservable;
})();
__extends(Knockback.CollectionObservable.prototype, Backbone.Events);
Knockback.collectionObservable = function(collection, options, legacy) {
  return new Knockback.CollectionObservable(collection, options, legacy);
};
Knockback.sortedIndexWrapAttr = Knockback.siwa = function(attribute_name, wrapper_constructor) {
  return function(models, model) {
    return _.sortedIndex(models, model, function(test) {
      return new wrapper_constructor(kb.utils.wrappedModel(test).get(attribute_name));
    });
  };
};
/*
  knockback_default_wrapper.js
  (c) 2011 Kevin Malakoff.
  Knockback.DefaultWrapper is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.defaultWrapper = function(target_observable, default_value_observable) {
  var default_wrapper_observable;
  default_wrapper_observable = ko.dependentObservable({
    read: function() {
      var default_value, value;
      value = ko.utils.unwrapObservable(target_observable());
      default_value = ko.utils.unwrapObservable(default_value_observable);
      if (value) {
        return value;
      } else {
        return default_value;
      }
    },
    write: function(value) {
      return target_observable(value);
    }
  });
  default_wrapper_observable.setToDefault = function() {
    return default_wrapper_observable(default_value_observable);
  };
  return default_wrapper_observable;
};
/*
  knockback_formatted_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.FormattedObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.toFormattedString = function(format) {
  var arg, args, index, parameter_index, result, value;
  result = format.slice();
  args = Array.prototype.slice.call(arguments, 1);
  for (index in args) {
    arg = args[index];
    value = ko.utils.unwrapObservable(arg);
    if (!value) {
      value = '';
    }
    parameter_index = format.indexOf("\{" + index + "\}");
    while (parameter_index >= 0) {
      result = result.replace("{" + index + "}", value);
      parameter_index = format.indexOf("\{" + index + "\}", parameter_index + 1);
    }
  }
  return result;
};
Knockback.parseFormattedString = function(string, format) {
  var count, format_indices_to_matched_indices, index, match_index, matches, parameter_count, parameter_index, positions, regex, regex_string, results, sorted_positions, _i, _results;
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
    return _.map((function() {
      _results = [];
      for (var _i = 1; 1 <= count ? _i <= count : _i >= count; 1 <= count ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this), function() {
      return '';
    });
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
Knockback.formattedObservable = function(format, args) {
  var observable_args, result;
  observable_args = Array.prototype.slice.call(arguments, 1);
  result = ko.dependentObservable({
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
      var index, matches, max_count, _results;
      matches = kb.parseFormattedString(value, ko.utils.unwrapObservable(format));
      max_count = Math.min(observable_args.length, matches.length);
      index = 0;
      _results = [];
      while (index < max_count) {
        observable_args[index](matches[index]);
        _results.push(index++);
      }
      return _results;
    }
  });
  return result;
};
/*
  knockback_localized_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.LocalizedObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.LocalizedObservable = (function() {
  LocalizedObservable.extend = Backbone.Model.extend;
  function LocalizedObservable(value, options, view_model) {
    var observable;
    this.value = value;
    this.options = options != null ? options : {};
    this.view_model = view_model != null ? view_model : {};
    if (!(this.options.read || this.read)) {
      throw new Error('LocalizedObservable: options.read is missing');
    }
    if (this.options.read && this.read) {
      throw new Error('LocalizedObservable: options.read and read class function exist. You need to choose one.');
    }
    if (this.options.write && this.write) {
      throw new Error('LocalizedObservable: options.write and write class function exist. You need to choose one.');
    }
    if (!kb.locale_manager) {
      throw new Error('LocalizedObservable: Knockback.locale_manager is not defined');
    }
    this.__kb = {};
    this.__kb._onLocaleChange = _.bind(this._onLocaleChange, this);
    if (this.value) {
      value = ko.utils.unwrapObservable(this.value);
    }
    this.__kb.value_observable = ko.observable(!value ? this._getDefaultValue() : this.read.call(this, value, null));
    if (this.write && !_.isFunction(this.write)) {
      throw new Error('LocalizedObservable: options.write is not a function for read_write model attribute');
    }
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
      read: _.bind(this._onGetValue, this),
      write: this.write ? _.bind(this._onSetValue, this) : (function() {
        throw new Error("Knockback.LocalizedObservable: value is read only");
      }),
      owner: this.view_model
    }));
    observable.destroy = _.bind(this.destroy, this);
    observable.observedValue = _.bind(this.observedValue, this);
    observable.setToDefault = _.bind(this.setToDefault, this);
    observable.resetToCurrent = _.bind(this.resetToCurrent, this);
    kb.locale_manager.bind('change', this.__kb._onLocaleChange);
    return observable;
  }
  LocalizedObservable.prototype.destroy = function() {
    kb.locale_manager.unbind('change', this.__kb._onLocaleChange);
    this.__kb.value_observable = null;
    kb.utils.wrappedObservable(this).dispose();
    kb.utils.wrappedObservable(this, null);
    this.options = {};
    this.view_model = null;
    return this.__kb = null;
  };
  LocalizedObservable.prototype.setToDefault = function() {
    var current_value, default_value;
    if (!this["default"]) {
      return;
    }
    default_value = this._getDefaultValue();
    current_value = this.__kb.value_observable();
    if (current_value !== default_value) {
      return this._onSetValue(default_value);
    } else {
      return this.__kb.value_observable.valueHasMutated();
    }
  };
  LocalizedObservable.prototype.resetToCurrent = function() {
    this.__kb.value_observable(null);
    return this._onSetValue(this._getCurrentValue());
  };
  LocalizedObservable.prototype.observedValue = function(value) {
    if (arguments.length === 0) {
      return this.value;
    }
    this.value = value;
    this._onLocaleChange();
    return this;
  };
  LocalizedObservable.prototype._getDefaultValue = function() {
    if (!this["default"]) {
      return '';
    }
    if (_.isFunction(this["default"])) {
      return this["default"]();
    } else {
      return this["default"];
    }
  };
  LocalizedObservable.prototype._getCurrentValue = function() {
    var observable;
    observable = kb.utils.wrappedObservable(this);
    if (!(this.value && observable)) {
      return this._getDefaultValue();
    }
    return this.read.call(this, ko.utils.unwrapObservable(this.value));
  };
  LocalizedObservable.prototype._onGetValue = function() {
    if (this.value) {
      ko.utils.unwrapObservable(this.value);
    }
    return this.__kb.value_observable();
  };
  LocalizedObservable.prototype._onSetValue = function(value) {
    this.write.call(this, value, ko.utils.unwrapObservable(this.value));
    value = this.read.call(this, ko.utils.unwrapObservable(this.value));
    this.__kb.value_observable(value);
    if (this.options.onChange) {
      return this.options.onChange(value);
    }
  };
  LocalizedObservable.prototype._onLocaleChange = function() {
    var value;
    value = this.read.call(this, ko.utils.unwrapObservable(this.value));
    this.__kb.value_observable(value);
    if (this.options.onChange) {
      return this.options.onChange(value);
    }
  };
  return LocalizedObservable;
})();
Knockback.localizedObservable = function(value, options, view_model) {
  return new Knockback.LocalizedObservable(value, options, view_model);
};
/*
  knockback_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.Observable = (function() {
  function Observable(model, options, view_model) {
    var observable;
    this.model = model;
    this.options = options;
    this.view_model = view_model != null ? view_model : {};
    if (!this.model) {
      throw new Error('Observable: model is missing');
    }
    if (!this.options) {
      throw new Error('Observable: options is missing');
    }
    if (_.isString(this.options) || ko.isObservable(this.options)) {
      this.options = {
        key: this.options
      };
    }
    if (!this.options.key) {
      throw new Error('Observable: options.key is missing');
    }
    this.__kb = {};
    this.__kb._onModelChange = _.bind(this._onModelChange, this);
    this.__kb._onModelLoaded = _.bind(this._onModelLoaded, this);
    this.__kb._onModelUnloaded = _.bind(this._onModelUnloaded, this);
    if (Backbone.ModelRef && (this.model instanceof Backbone.ModelRef)) {
      this.model_ref = this.model;
      this.model_ref.retain();
      this.model_ref.bind('loaded', this.__kb._onModelLoaded);
      this.model_ref.bind('unloaded', this.__kb._onModelUnloaded);
      this.model = this.model_ref.wrappedModel();
    }
    this.__kb.value_observable = ko.observable();
    if (this.options.localizer) {
      this.__kb.localizer = new this.options.localizer(this._getCurrentValue());
    }
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
      read: _.bind(this._onGetValue, this),
      write: this.options.write ? _.bind(this._onSetValue, this) : (function() {
        throw new Error("Knockback.Observable: " + this.options.key + " is read only");
      }),
      owner: this.view_model
    }));
    observable.destroy = _.bind(this.destroy, this);
    observable.setToDefault = _.bind(this.setToDefault, this);
    if (!this.model_ref || this.model_ref.isLoaded()) {
      this.model.bind('change', this.__kb._onModelChange);
    }
    return observable;
  }
  Observable.prototype.destroy = function() {
    this.__kb.value_observable = null;
    kb.utils.wrappedObservable(this).dispose();
    kb.utils.wrappedObservable(this, null);
    if (this.model) {
      this.__kb._onModelUnloaded(this.model);
    }
    if (this.model_ref) {
      this.model_ref.unbind('loaded', this.__kb._onModelLoaded);
      this.model_ref.unbind('unloaded', this.__kb._onModelUnloaded);
      this.model_ref.release();
      this.model_ref = null;
    }
    this.options = null;
    this.view_model = null;
    return this.__kb = null;
  };
  Observable.prototype.setToDefault = function() {
    var value;
    value = this._getDefaultValue();
    if (this.__kb.localizer) {
      this.__kb.localizer.observedValue(value);
      value = this.__kb.localizer();
    }
    return this.__kb.value_observable(value);
  };
  Observable.prototype._getDefaultValue = function() {
    if (!this.options.hasOwnProperty('default')) {
      return '';
    }
    if (_.isFunction(this.options["default"])) {
      return this.options["default"]();
    } else {
      return this.options["default"];
    }
  };
  Observable.prototype._getCurrentValue = function() {
    var arg, args, key, _i, _len, _ref;
    if (!this.model) {
      return this._getDefaultValue();
    }
    key = ko.utils.unwrapObservable(this.options.key);
    args = [key];
    if (!_.isUndefined(this.options.args)) {
      if (_.isArray(this.options.args)) {
        _ref = this.options.args;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          arg = _ref[_i];
          args.push(ko.utils.unwrapObservable(arg));
        }
      } else {
        args.push(ko.utils.unwrapObservable(this.options.args));
      }
    }
    if (this.options.read) {
      return this.options.read.apply(this.view_model, args);
    } else {
      return this.model.get.apply(this.model, args);
    }
  };
  Observable.prototype._onGetValue = function() {
    var arg, value, _i, _len, _ref;
    this.__kb.value_observable();
    ko.utils.unwrapObservable(this.options.key);
    if (!_.isUndefined(this.options.args)) {
      if (_.isArray(this.options.args)) {
        _ref = this.options.args;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          arg = _ref[_i];
          ko.utils.unwrapObservable(arg);
        }
      } else {
        ko.utils.unwrapObservable(this.options.args);
      }
    }
    value = this._getCurrentValue();
    if (this.__kb.localizer) {
      this.__kb.localizer.observedValue(value);
      value = this.__kb.localizer();
    }
    return value;
  };
  Observable.prototype._onSetValue = function(value) {
    var arg, args, set_info, _i, _len, _ref;
    if (this.__kb.localizer) {
      this.__kb.localizer(value);
      value = this.__kb.localizer.observedValue();
    }
    if (this.model) {
      set_info = {};
      set_info[ko.utils.unwrapObservable(this.options.key)] = value;
      args = _.isFunction(this.options.write) ? [value] : [set_info];
      if (!_.isUndefined(this.options.args)) {
        if (_.isArray(this.options.args)) {
          _ref = this.options.args;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            arg = _ref[_i];
            args.push(ko.utils.unwrapObservable(arg));
          }
        } else {
          args.push(ko.utils.unwrapObservable(this.options.args));
        }
      }
      if (_.isFunction(this.options.write)) {
        this.options.write.apply(this.view_model, args);
      } else {
        this.model.set.apply(this.model, args);
      }
    }
    if (this.__kb.localizer) {
      return this.__kb.value_observable(this.__kb.localizer());
    } else {
      return this.__kb.value_observable(value);
    }
  };
  Observable.prototype._modelBind = function(model) {
    if (!model) {
      return;
    }
    model.bind('change', this.__kb._onModelChange);
    if (Backbone.RelationalModel && (model instanceof Backbone.RelationalModel)) {
      model.bind('add', this.__kb._onModelChange);
      model.bind('remove', this.__kb._onModelChange);
      return model.bind('update', this.__kb._onModelChange);
    }
  };
  Observable.prototype._modelUnbind = function(model) {
    if (!model) {
      return;
    }
    model.unbind('change', this.__kb._onModelChange);
    if (Backbone.RelationalModel && (model instanceof Backbone.RelationalModel)) {
      model.unbind('add', this.__kb._onModelChange);
      model.unbind('remove', this.__kb._onModelChange);
      return model.unbind('update', this.__kb._onModelChange);
    }
  };
  Observable.prototype._onModelLoaded = function(model) {
    this.model = model;
    this._modelBind(model);
    return this._updateValue();
  };
  Observable.prototype._onModelUnloaded = function(model) {
    if (this.__kb.localizer && this.__kb.localizer.destroy) {
      this.__kb.localizer.destroy();
      this.__kb.localizer = null;
    }
    this._modelUnbind(model);
    return this.model = null;
  };
  Observable.prototype._onModelChange = function() {
    if ((this.model && this.model.hasChanged) && !this.model.hasChanged(ko.utils.unwrapObservable(this.options.key))) {
      return;
    }
    return this._updateValue();
  };
  Observable.prototype._updateValue = function() {
    var value;
    value = this._getCurrentValue();
    if (this.__kb.localizer) {
      this.__kb.localizer.observedValue(value);
      value = this.__kb.localizer();
    }
    return this.__kb.value_observable(value);
  };
  return Observable;
})();
Knockback.observable = function(model, options, view_model) {
  return new Knockback.Observable(model, options, view_model);
};
/*
  knockback_observables.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observables is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.Observables = (function() {
  function Observables(model, mappings_info, view_model, options_or_writeable) {
    var is_string, mapping_info, view_model_property_name, write, _ref, _ref2;
    this.model = model;
    this.mappings_info = mappings_info;
    this.view_model = view_model;
    if (!this.model) {
      throw new Error('Observables: model is missing');
    }
    if (!this.mappings_info) {
      throw new Error('Observables: mappings_info is missing');
    }
    if (!!options_or_writeable && ((_.isBoolean(options_or_writeable) && options_or_writeable) || !!options_or_writeable.write)) {
      write = _.isBoolean(options_or_writeable) ? options_or_writeable : !!options_or_writeable.write;
      _ref = this.mappings_info;
      for (view_model_property_name in _ref) {
        mapping_info = _ref[view_model_property_name];
        is_string = _.isString(mapping_info);
        if (is_string || !mapping_info.hasOwnProperty(write)) {
          mapping_info = is_string ? {
            key: mapping_info,
            write: write
          } : _.extend({
            write: write
          }, mapping_info);
        }
        this[view_model_property_name] = this.view_model[view_model_property_name] = kb.observable(this.model, mapping_info, this.view_model);
      }
    } else {
      _ref2 = this.mappings_info;
      for (view_model_property_name in _ref2) {
        mapping_info = _ref2[view_model_property_name];
        this[view_model_property_name] = this.view_model[view_model_property_name] = kb.observable(this.model, mapping_info, this.view_model);
      }
    }
  }
  Observables.prototype.destroy = function() {
    var mapping_info, view_model_property_name, _ref;
    _ref = this.mappings_info;
    for (view_model_property_name in _ref) {
      mapping_info = _ref[view_model_property_name];
      if (this.view_model[view_model_property_name]) {
        this.view_model[view_model_property_name].destroy();
      }
      this.view_model[view_model_property_name] = null;
      this[view_model_property_name] = null;
    }
    this.view_model = null;
    this.mappings_info = null;
    return this.model = null;
  };
  Observables.prototype.setToDefault = function() {
    var mapping_info, view_model_property_name, _ref, _results;
    _ref = this.mappings_info;
    _results = [];
    for (view_model_property_name in _ref) {
      mapping_info = _ref[view_model_property_name];
      _results.push(this.view_model[view_model_property_name].setToDefault());
    }
    return _results;
  };
  return Observables;
})();
Knockback.observables = function(model, mappings_info, view_model, options) {
  return new Knockback.Observables(model, mappings_info, view_model, options);
};
/*
  knockback_triggered_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.TriggeredObservable = (function() {
  function TriggeredObservable(model, event_name) {
    var observable;
    this.model = model;
    this.event_name = event_name;
    if (!this.model) {
      throw new Error('Observable: model is missing');
    }
    if (!this.event_name) {
      throw new Error('Observable: event_name is missing');
    }
    this.__kb = {};
    this.__kb._onValueChange = _.bind(this._onValueChange, this);
    this.__kb._onModelLoaded = _.bind(this._onModelLoaded, this);
    this.__kb._onModelUnloaded = _.bind(this._onModelUnloaded, this);
    if (Backbone.ModelRef && (this.model instanceof Backbone.ModelRef)) {
      this.model_ref = this.model;
      this.model_ref.retain();
      this.model_ref.bind('loaded', this.__kb._onModelLoaded);
      this.model_ref.bind('unloaded', this.__kb._onModelUnloaded);
      this.model = this.model_ref.wrappedModel();
    }
    this.__kb.value_observable = ko.observable();
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable(_.bind(this._onGetValue, this)));
    observable.destroy = _.bind(this.destroy, this);
    if (!this.model_ref || this.model_ref.isLoaded()) {
      this._onModelLoaded(this.model);
    }
    return observable;
  }
  TriggeredObservable.prototype.destroy = function() {
    kb.utils.wrappedObservable(this).dispose();
    kb.utils.wrappedObservable(this, null);
    this.__kb.value_observable = null;
    if (this.model) {
      this._onModelUnloaded(this.model);
    }
    if (this.model_ref) {
      this.model_ref.unbind('loaded', this.__kb._onModelLoaded);
      this.model_ref.unbind('unloaded', this.__kb._onModelUnloaded);
      this.model_ref.release();
      this.model_ref = null;
    }
    this.options = null;
    this.view_model = null;
    return this.__kb = null;
  };
  TriggeredObservable.prototype._onGetValue = function() {
    return this.__kb.value_observable();
  };
  TriggeredObservable.prototype._onModelLoaded = function(model) {
    this.model = model;
    this.model.bind(this.event_name, this.__kb._onValueChange);
    return this._onValueChange();
  };
  TriggeredObservable.prototype._onModelUnloaded = function() {
    if (this.__kb.localizer && this.__kb.localizer.destroy) {
      this.__kb.localizer.destroy();
      this.__kb.localizer = null;
    }
    this.model.unbind(this.event_name, this.__kb._onValueChange);
    return this.model = null;
  };
  TriggeredObservable.prototype._onValueChange = function() {
    var current_value;
    current_value = this.__kb.value_observable();
    if (current_value !== this.model) {
      return this.__kb.value_observable(this.model);
    } else {
      return this.__kb.value_observable.valueHasMutated();
    }
  };
  return TriggeredObservable;
})();
Knockback.triggeredObservable = function(model, event_name) {
  return new Knockback.TriggeredObservable(model, event_name);
};
/*
  knockback_attribute_connectors.js
  (c) 2012 Kevin Malakoff.
  Knockback.AttributeConnector is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.AttributeConnector = (function() {
  function AttributeConnector(model, key, options) {
    var observable;
    this.key = key;
    this.options = options != null ? options : {};
    kb.utils.wrappedModel(this, model);
    this.options = _.clone(this.options);
    this.__kb.value_observable = ko.observable();
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
      read: _.bind(this.read, this),
      write: _.bind(this.write, this)
    }));
    observable.destroy = _.bind(this.destroy, this);
    observable.model = _.bind(this.model, this);
    observable.update = _.bind(this.update, this);
    this.__kb.initializing = true;
    this.update();
    this.__kb.initializing = false;
    return observable;
  }
  AttributeConnector.prototype.destroy = function() {
    this.__kb.value_observable = null;
    kb.utils.wrappedObservable(this).dispose();
    return kb.utils.wrappedObservable(this, null);
  };
  AttributeConnector.prototype.read = function() {
    return this.__kb.value_observable();
  };
  AttributeConnector.prototype.write = function(value) {
    var model, set_info;
    model = kb.utils.wrappedModel(this);
    if (!model) {
      return;
    }
    if (this.options.read_only) {
      if (!this.__kb.initializing) {
        throw "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.";
      }
    } else {
      set_info = {};
      set_info[this.key] = value;
      return model.set(set_info);
    }
  };
  AttributeConnector.prototype.model = function(new_model) {
    var model;
    model = kb.utils.wrappedModel(this);
    if (arguments.length === 0) {
      return model;
    }
    if (model === new_model) {
      return;
    }
    kb.utils.wrappedModel(this, new_model);
    return this.update();
  };
  return AttributeConnector;
})();
Knockback.SimpleAttributeConnector = (function() {
  __extends(SimpleAttributeConnector, Knockback.AttributeConnector);
  function SimpleAttributeConnector() {
    SimpleAttributeConnector.__super__.constructor.apply(this, arguments);
    return kb.utils.wrappedObservable(this);
  }
  SimpleAttributeConnector.prototype.destroy = function() {
    this.current_value = null;
    return SimpleAttributeConnector.__super__.destroy.apply(this, arguments);
  };
  SimpleAttributeConnector.prototype.update = function() {
    var current_value, model, value;
    model = kb.utils.wrappedModel(this);
    if (!model) {
      return;
    }
    value = model.get(this.key);
    current_value = this.__kb.value_observable();
    if (!_.isEqual(current_value, value)) {
      return this.__kb.value_observable(value);
    }
  };
  SimpleAttributeConnector.prototype.write = function(value) {
    var model;
    model = kb.utils.wrappedModel(this);
    if (!model) {
      this.__kb.value_observable(value);
      return;
    }
    return SimpleAttributeConnector.__super__.write.apply(this, arguments);
  };
  return SimpleAttributeConnector;
})();
Knockback.simpleAttributeConnector = function(model, key, options) {
  return new Knockback.SimpleAttributeConnector(model, key, options);
};
Knockback.CollectionAttributeConnector = (function() {
  __extends(CollectionAttributeConnector, Knockback.AttributeConnector);
  function CollectionAttributeConnector() {
    CollectionAttributeConnector.__super__.constructor.apply(this, arguments);
    return kb.utils.wrappedObservable(this);
  }
  CollectionAttributeConnector.prototype.destroy = function() {
    var _ref;
    if ((_ref = this.__kb.value_observable()) != null) {
      _ref.release();
    }
    return CollectionAttributeConnector.__super__.destroy.apply(this, arguments);
  };
  CollectionAttributeConnector.prototype.update = function() {
    var current_value, model, value;
    model = kb.utils.wrappedModel(this);
    if (!model) {
      return;
    }
    value = model.get(this.key);
    current_value = this.__kb.value_observable();
    if (!current_value) {
      if (this.options.__kb_store) {
        return this.__kb.value_observable(this.options.__kb_store.resolve(value, __bind(function() {
          return kb.collectionObservable(value, this.options);
        }, this)));
      } else {
        return this.__kb.value_observable(kb.collectionObservable(value, this.options));
      }
    } else {
      if (current_value.collection() !== value) {
        current_value.collection(value);
        return this.__kb.value_observable.valueHasMutated();
      }
    }
  };
  CollectionAttributeConnector.prototype.read = function() {
    var current_value;
    current_value = this.__kb.value_observable();
    if (current_value) {
      return current_value();
    } else {
      return;
    }
  };
  return CollectionAttributeConnector;
})();
Knockback.collectionAttributeConnector = function(model, key, options) {
  return new Knockback.CollectionAttributeConnector(model, key, options);
};
Knockback.ViewModelAttributeConnector = (function() {
  __extends(ViewModelAttributeConnector, Knockback.AttributeConnector);
  function ViewModelAttributeConnector() {
    ViewModelAttributeConnector.__super__.constructor.apply(this, arguments);
    return kb.utils.wrappedObservable(this);
  }
  ViewModelAttributeConnector.prototype.destroy = function() {
    var _ref;
    if ((_ref = this.__kb.value_observable()) != null) {
      if (typeof _ref.release === "function") {
        _ref.release();
      }
    }
    return ViewModelAttributeConnector.__super__.destroy.apply(this, arguments);
  };
  ViewModelAttributeConnector.prototype.update = function() {
    var current_value, model, value, view_model_options;
    model = kb.utils.wrappedModel(this);
    if (!model) {
      return;
    }
    value = model.get(this.key);
    current_value = this.__kb.value_observable();
    if (!current_value) {
      view_model_options = this.options.options ? _.clone(this.options.options) : {};
      if (view_model_options.__kb_store) {
        return this.__kb.value_observable(view_model_options.__kb_store.resolve(value, __bind(function() {
          if (this.options.view_model) {
            return new this.options.view_model(value, view_model_options);
          } else {
            return this.options.view_model_create(value, view_model_options);
          }
        }, this)));
      } else {
        return this.__kb.value_observable(this.options.view_model ? new this.options.view_model(value, view_model_options) : this.options.view_model_create(value, view_model_options));
      }
    } else {
      if (!(current_value.model && _.isFunction(current_value.model))) {
        throw new Error("Knockback.viewModelAttributeConnector: unknown how to model a view model");
      }
      if (current_value.model() !== value) {
        current_value.model(value);
        return this.__kb.value_observable.valueHasMutated();
      }
    }
  };
  return ViewModelAttributeConnector;
})();
Knockback.viewModelAttributeConnector = function(model, key, options) {
  return new Knockback.ViewModelAttributeConnector(model, key, options);
};
Knockback.createOrUpdateAttributeConnector = function(attribute_connector, model, key, options) {
  var attribute_options, value;
  if (attribute_connector) {
    if (kb.utils.observableInstanceOf(attribute_connector, kb.AttributeConnector)) {
      if (attribute_connector.model() !== model) {
        attribute_connector.model(model);
      } else {
        attribute_connector.update();
      }
    }
  } else {
    value = model ? model.get(key) : null;
    if (options.hasOwnProperty('view_model')) {
      attribute_connector = new options.view_model(value, options.options);
    } else if (options.hasOwnProperty('view_model_create')) {
      attribute_connector = options.view_model_create(value, options.options);
    } else if (options.hasOwnProperty('children')) {
      if (_.isFunction(options.children)) {
        attribute_options = {
          view_model: options.children
        };
      } else {
        attribute_options = options.children;
      }
      if (options.__kb_store) {
        options.__kb_store.addResolverToOptions(attribute_options, value);
      }
      attribute_connector = kb.collectionAttributeConnector(model, key, attribute_options);
    } else if (options.hasOwnProperty('create')) {
      attribute_connector = options.create(value, options.options);
    } else if (value instanceof Backbone.Collection) {
      attribute_options = {
        view_model: kb.ViewModel
      };
      if (options.__kb_store) {
        options.__kb_store.addResolverToOptions(attribute_options, value);
      }
      attribute_connector = kb.collectionAttributeConnector(model, key, attribute_options);
    } else if ((value instanceof Backbone.Model) || (Backbone.ModelRef && (value instanceof Backbone.ModelRef))) {
      attribute_options = {
        view_model: kb.ViewModel,
        options: options.options || {}
      };
      if (options.__kb_store) {
        options.__kb_store.addResolverToOptions(attribute_options.options, value);
      }
      attribute_connector = kb.viewModelAttributeConnector(model, key, attribute_options);
    } else {
      attribute_connector = kb.simpleAttributeConnector(model, key, options);
    }
  }
  return attribute_connector;
};
/*
  knockback_view_model.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.ViewModel_RCBase = (function() {
  __extends(ViewModel_RCBase, Knockback.RefCountable);
  function ViewModel_RCBase() {
    ViewModel_RCBase.__super__.constructor.apply(this, arguments);
  }
  ViewModel_RCBase.prototype.__destroy = function() {
    var key, value;
    for (key in this) {
      value = this[key];
      if (!value || (key === '__kb')) {
        continue;
      }
      if (kb.utils.release(value)) {
        this[key] = null;
      }
    }
    return ViewModel_RCBase.__super__.__destroy.apply(this, arguments);
  };
  return ViewModel_RCBase;
})();
Knockback.ViewModel = (function() {
  __extends(ViewModel, Knockback.ViewModel_RCBase);
  function ViewModel(model, options) {
    var key, missing, _i, _len;
    if (options == null) {
      options = {};
    }
    ViewModel.__super__.constructor.apply(this, arguments);
    this.__kb.store = options.__kb_store || new kb.Store();
    kb.Store.resolveFromOptions(options, this);
    this.__kb._onModelChange = _.bind(this._onModelChange, this);
    this.__kb._onModelLoaded = _.bind(this._onModelLoaded, this);
    this.__kb._onModelUnloaded = _.bind(this._onModelUnloaded, this);
    this.__kb.options = options ? _.clone(options) : {};
    if (!model) {
      throw new Error('ViewModel: model is missing');
    }
    kb.utils.wrappedModel(this, model);
    if (Backbone.ModelRef && (model instanceof Backbone.ModelRef)) {
      this.__kb.model_ref = model;
      this.__kb.model_ref.retain();
      kb.utils.wrappedModel(this, this.__kb.model_ref.wrappedModel());
      this.__kb.model_ref.bind('loaded', this.__kb._onModelLoaded);
      this.__kb.model_ref.bind('unloaded', this.__kb._onModelUnloaded);
    }
    if (!this.__kb.model_ref || this.__kb.model_ref.isLoaded()) {
      this._onModelLoaded(this.__kb.model);
    }
    if (!this.__kb.options.internals && !this.__kb.options.requires) {
      return this;
    }
    missing = _.union((this.__kb.options.internals ? this.__kb.options.internals : []), (this.__kb.options.requires ? this.__kb.options.requires : []));
    if (!this.__kb.model_ref || this.__kb.model_ref.isLoaded()) {
      missing = _.difference(missing, _.keys(this.__kb.model.attributes));
    }
    for (_i = 0, _len = missing.length; _i < _len; _i++) {
      key = missing[_i];
      this._updateAttributeConnector(this.__kb.model, key);
    }
  }
  ViewModel.prototype.__destroy = function() {
    var model;
    model = this.__kb.model;
    kb.utils.wrappedModel(this, null);
    this._modelUnbind(model);
    this.__kb.store = null;
    return ViewModel.__super__.__destroy.apply(this, arguments);
  };
  ViewModel.prototype.model = function(new_model) {
    var model;
    model = kb.utils.wrappedModel(this);
    if (arguments.length === 0) {
      return model;
    }
    if (new_model === model) {
      return;
    }
    if (model) {
      this._onModelUnloaded(model);
    }
    if (new_model) {
      return this._onModelLoaded(new_model);
    }
  };
  ViewModel.prototype._modelBind = function(model) {
    if (!model) {
      return;
    }
    model.bind('change', this.__kb._onModelChange);
    if (Backbone.RelationalModel && (model instanceof Backbone.RelationalModel)) {
      model.bind('add', this.__kb._onModelChange);
      model.bind('remove', this.__kb._onModelChange);
      return model.bind('update', this.__kb._onModelChange);
    }
  };
  ViewModel.prototype._modelUnbind = function(model) {
    if (!model) {
      return;
    }
    model.unbind('change', this.__kb._onModelChange);
    if (Backbone.RelationalModel && (model instanceof Backbone.RelationalModel)) {
      model.unbind('add', this.__kb._onModelChange);
      model.unbind('remove', this.__kb._onModelChange);
      return model.unbind('update', this.__kb._onModelChange);
    }
  };
  ViewModel.prototype._onModelLoaded = function(model) {
    var key, _results;
    kb.utils.wrappedModel(this, model);
    this._modelBind(model);
    _results = [];
    for (key in this.__kb.model.attributes) {
      _results.push(this._updateAttributeConnector(this.__kb.model, key));
    }
    return _results;
  };
  ViewModel.prototype._onModelUnloaded = function(model) {
    var key, _results;
    this._modelUnbind(model);
    kb.utils.wrappedModel(this, null);
    _results = [];
    for (key in model.attributes) {
      _results.push(this._updateAttributeConnector(null, key));
    }
    return _results;
  };
  ViewModel.prototype._onModelChange = function() {
    var key, _results, _results2;
    if (this.__kb.model._changed) {
      _results = [];
      for (key in this.__kb.model.attributes) {
        _results.push((this.__kb.model.hasChanged(key) ? this._updateAttributeConnector(this.__kb.model, key) : void 0));
      }
      return _results;
    } else if (this.__kb.model.changed) {
      _results2 = [];
      for (key in this.__kb.model.changed) {
        _results2.push(this._updateAttributeConnector(this.__kb.model, key));
      }
      return _results2;
    }
  };
  ViewModel.prototype._updateAttributeConnector = function(model, key) {
    var vm_key;
    vm_key = this.__kb.options.internals && _.contains(this.__kb.options.internals, key) ? '_' + key : key;
    return this[vm_key] = Knockback.createOrUpdateAttributeConnector(this[vm_key], model, key, this._createOptions(key));
  };
  ViewModel.prototype._createOptions = function(key) {
    var options;
    if (this.__kb.options.children && this.__kb.options.children.hasOwnProperty(key)) {
      options = this.__kb.options.children[key];
      if (_.isFunction(options)) {
        options = {
          view_model: options
        };
      }
      return _.defaults(options, {
        read_only: this.__kb.options.read_only,
        __kb_store: this.__kb.store
      });
    } else {
      return {
        read_only: this.__kb.options.read_only,
        __kb_store: this.__kb.store
      };
    }
  };
  return ViewModel;
})();
Knockback.viewModel = function(model, options) {
  return new Knockback.ViewModel(model, options);
};