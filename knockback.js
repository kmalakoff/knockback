/*
  knockback.js 0.15.0
  (c) 2011 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
*/if (!this.ko) {
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
Knockback.legacyWarning = function(identifier, message) {
  var _base;
  kb._legacy_warnings || (kb._legacy_warnings = {});
  (_base = kb._legacy_warnings)[identifier] || (_base[identifier] = 0);
  kb._legacy_warnings[identifier]++;
  return console.warn("Legacy warning! '" + identifier + "' has been deprecated. " + message);
};
Knockback.unwrapObservable = function(instance) {
  if (!(instance && instance.__kb.observable)) {
    throw new Error('Knockback: instance is not wrapping an observable');
  }
  return instance.__kb.observable;
};
Knockback.wrappedObservable = function(instance) {
  kb.legacyWarning('kb.wrappedObservable', 'Please use kb.unwrapObservable instead');
  return kb.unwrapObservable(instance);
};
Knockback.unwrapModel = function(instance) {
  if (instance && instance.hasOwnProperty('__kb_model')) {
    return instance.__kb_model;
  } else {
    return instance;
  }
};
Knockback.viewModelGetModel = Knockback.vmModel = function(instance) {
  kb.legacyWarning('kb.vmModel', 'Please use kb.unwrapModel instead');
  return kb.unwrapModel(instance);
};
Knockback.setToDefault = function(observable) {
  if (observable && observable.setToDefault) {
    return observable.setToDefault();
  }
};
Knockback.vmSetToDefault = function(view_model) {
  var key, observable, _results;
  _results = [];
  for (key in view_model) {
    observable = view_model[key];
    _results.push(kb.setToDefault(observable));
  }
  return _results;
};
Knockback.vmRelease = function(view_model) {
  if (view_model instanceof kb.ViewModel_RCBase) {
    view_model.release();
    return;
  }
  return Knockback.vmReleaseObservables(view_model);
};
Knockback.vmReleaseObservables = function(view_model, keys) {
  var key, value, _results;
  _results = [];
  for (key in view_model) {
    value = view_model[key];
    if (!value) {
      continue;
    }
    if (!(ko.isObservable(value) || (value instanceof kb.Observables) || (value instanceof kb.ViewModel_RCBase))) {
      continue;
    }
    if (keys && !_.contains(keys, key)) {
      continue;
    }
    view_model[key] = null;
    _results.push(kb.vmReleaseObservable(value));
  }
  return _results;
};
Knockback.vmReleaseObservable = function(observable) {
  if (!(ko.isObservable(observable) || (observable instanceof kb.Observables) || (observable instanceof kb.ViewModel_RCBase))) {
    return;
  }
  if (observable.release) {
    return observable.release();
  } else if (observable.destroy) {
    return observable.destroy();
  } else if (observable.dispose) {
    return observable.dispose();
  }
};
/*
  knockback_store.js
  (c) 2011 Kevin Malakoff.
  Knockback.Store is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/Knockback.Store = (function() {
  function Store() {
    this.keys = [];
    this.values = [];
  }
  Store.prototype.find = function(key) {
    var index;
    index = _.indexOf(this.keys, key);
    if (index >= 0) {
      return this.values[index];
    } else {
      return;
    }
  };
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
    var index, value;
    index = _.indexOf(this.keys, key);
    if (index >= 0) {
      if (this.values[index]) {
        return this.values[index];
      }
    } else {
      index = this.keys.length;
      this.keys.push(key);
      this.values.push(void 0);
    }
    value = create_fn.apply(null, Array.prototype.slice.call(arguments, 2));
    if (!value) {
      throw new Error("Knockback.Store: no value created");
    }
    if (!this.values[index]) {
      this.values[index] = value;
    }
    return value;
  };
  return Store;
})();
/*
  knockback_ref_countable.js
  (c) 2011 Kevin Malakoff.
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
    var event, _i, _j, _len, _len2, _ref, _ref2;
    if (options == null) {
      options = {};
    }
    if (!collection) {
      throw new Error('CollectionObservable: collection is missing');
    }
    CollectionObservable.__super__.constructor.apply(this, arguments);
    if (ko.isObservable(options) && options.hasOwnProperty('indexOf')) {
      Knockback.legacyWarning('kb.collectionObservable with an external ko.observableArray', 'Please use the kb.collectionObservable directly instead of passing a ko.observableArray');
      this.__kb.observable = options;
      options = arguments[2] || {};
    } else {
      this.__kb.observable = ko.observableArray([]);
    }
    this.__kb.store = options.__kb_store || new kb.Store();
    if (options.__kb_store_key) {
      this.__kb.store.add(options.__kb_store_key, kb.unwrapObservable(this));
    }
    if (options.hasOwnProperty('view_model') || options.hasOwnProperty('view_model_constructor')) {
      this.view_model_create_fn = options.view_model || options.view_model_constructor;
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
    this.__kb._onModelChanged = _.bind(this._onModelChanged, this);
    this.__kb.collection = collection;
    if (this.__kb.collection.retain) {
      this.__kb.collection.retain();
    }
    this.__kb.collection.bind('reset', this.__kb._onCollectionReset);
    if (!this.sorted_index) {
      this.__kb.collection.bind('resort', this.__kb._onCollectionResort);
    }
    _ref = ['new', 'add'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      this.__kb.collection.bind(event, this.__kb._onModelAdd);
    }
    _ref2 = ['remove', 'destroy'];
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      event = _ref2[_j];
      this.__kb.collection.bind(event, this.__kb._onModelRemove);
    }
    this.__kb.collection.bind('change', this.__kb._onModelChanged);
    this.__kb.observable.release = _.bind(this.release, this);
    this.__kb.observable.collection = _.bind(this.collection, this);
    this.__kb.observable.viewModelByModel = _.bind(this.viewModelByModel, this);
    this.__kb.observable.sortedIndex = _.bind(this.sortedIndex, this);
    this.__kb.observable.sortAttribute = _.bind(this.sortAttribute, this);
    this.__kb.observable.hasViewModels = _.bind(this.hasViewModels, this);
    this.__kb.observable.bind = _.bind(this.bind, this);
    this.__kb.observable.unbind = _.bind(this.unbind, this);
    this.__kb.observable.trigger = _.bind(this.trigger, this);
    this.sortedIndex(this.sorted_index, this.sort_attribute, {
      silent: true,
      defer: options.defer
    });
    return kb.unwrapObservable(this);
  }
  CollectionObservable.prototype.__destroy = function() {
    var event, _i, _j, _len, _len2, _ref, _ref2;
    this._clear();
    this.__kb.collection.unbind('reset', this.__kb._onCollectionReset);
    if (!this.sorted_index) {
      this.__kb.collection.unbind('resort', this.__kb._onCollectionResort);
    }
    _ref = ['new', 'add'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      this.__kb.collection.unbind(event, this.__kb._onModelAdd);
    }
    _ref2 = ['remove', 'destroy'];
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      event = _ref2[_j];
      this.__kb.collection.unbind(event, this.__kb._onModelRemove);
    }
    this.__kb.collection.unbind('change', this.__kb._onModelChanged);
    if (this.__kb.collection.release) {
      this.__kb.collection.release();
    }
    this.__kb.collection = null;
    this.__kb.observable.dispose();
    this.__kb.observable = null;
    this.view_model_create_fn = null;
    this.__kb.store = null;
    this.__kb.co = null;
    return CollectionObservable.__super__.__destroy.apply(this, arguments);
  };
  CollectionObservable.prototype.collection = function() {
    this.__kb.observable();
    return this.__kb.collection;
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
      if ((this.__kb.collection.models.length === 0) && (this.__kb.observable().length === 0)) {
        return;
      }
      this._collectionResync(true);
      if (!options.silent) {
        return this.trigger('resort', this.__kb.observable());
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
    var id_attribute;
    if (!this.hasViewModels()) {
      return null;
    }
    id_attribute = model.hasOwnProperty(model.idAttribute) ? model.idAttribute : 'cid';
    return _.find(this.__kb.observable(), function(test) {
      return test.__kb_model[id_attribute] === model[id_attribute];
    });
  };
  CollectionObservable.prototype.hasViewModels = function() {
    return !!this.view_model_create_fn;
  };
  CollectionObservable.prototype._onCollectionReset = function() {
    return this._collectionResync();
  };
  CollectionObservable.prototype._onCollectionResort = function(model_or_models) {
    if (this.sorted_index) {
      throw new Error("CollectionObservable: collection sorted_index unexpected");
    }
    if (_.isArray(model_or_models)) {
      this(true);
      return this.trigger('resort', this.__kb.observable());
    } else {
      return this._onModelResort(model_or_models);
    }
  };
  CollectionObservable.prototype._onModelAdd = function(model) {
    var add_index, target;
    target = this.hasViewModels() ? this._createTarget(model) : model;
    if (this.sorted_index) {
      add_index = this.sorted_index(this.__kb.observable(), target);
    } else {
      add_index = this.__kb.collection.indexOf(model);
    }
    this.__kb.observable.splice(add_index, 0, target);
    return this.trigger('add', target, this.__kb.observable());
  };
  CollectionObservable.prototype._onModelRemove = function(model) {
    var target;
    target = this.hasViewModels() ? this.viewModelByModel(model) : model;
    if (!target) {
      return;
    }
    this.__kb.observable.remove(target);
    this.trigger('remove', target, this.__kb.observable());
    if (!this.hasViewModels()) {
      return;
    }
    kb.vmRelease(target);
    return target.__kb_model = null;
  };
  CollectionObservable.prototype._onModelChanged = function(model) {
    if (this.sorted_index && (!this.sort_attribute || model.hasChanged(this.sort_attribute))) {
      this._onModelResort(model);
    }
    return this.__kb.observable.valueHasMutated();
  };
  CollectionObservable.prototype._onModelResort = function(model) {
    var new_index, previous_index, sorted_targets, target;
    target = this.hasViewModels() ? this.viewModelByModel(model) : model;
    previous_index = this.__kb.observable.indexOf(target);
    if (this.sorted_index) {
      sorted_targets = _.clone(this.__kb.observable());
      sorted_targets.splice(previous_index, 1);
      new_index = this.sorted_index(sorted_targets, target);
    } else {
      new_index = this.__kb.collection.indexOf(model);
    }
    if (previous_index === new_index) {
      return;
    }
    this.__kb.observable.splice(previous_index, 1);
    this.__kb.observable.splice(new_index, 0, target);
    return this.trigger('resort', target, this.__kb.observable(), new_index);
  };
  CollectionObservable.prototype._clear = function(silent) {
    var targets, view_model, _i, _len, _results;
    if (!silent) {
      this.trigger('remove', this.__kb.observable());
    }
    targets = this.__kb.observable.removeAll();
    if (!this.hasViewModels()) {
      return;
    }
    _results = [];
    for (_i = 0, _len = targets.length; _i < _len; _i++) {
      view_model = targets[_i];
      _results.push(kb.vmRelease(view_model));
    }
    return _results;
  };
  CollectionObservable.prototype._collectionResync = function(silent) {
    var add_index, model, target, targets, _i, _len, _ref;
    this._clear(silent);
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
    this.__kb.observable(targets);
    if (!silent) {
      return this.trigger('add', this.__kb.observable());
    }
  };
  CollectionObservable.prototype._sortAttributeFn = function(sort_attribute) {
    if (this.hasViewModels()) {
      return function(view_models, model) {
        return _.sortedIndex(view_models, model, function(test) {
          return kb.unwrapModel(test).get(sort_attribute);
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
      var view_model;
      view_model = this.view_model_create_with_new ? new this.view_model_create_fn(model, {
        __kb_store: this.__kb.store,
        __kb_store_key: model
      }) : this.view_model_create_fn(model, {
        __kb_store: this.__kb.store
      });
      view_model.__kb_model = model;
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
      return new wrapper_constructor(kb.unwrapModel(test).get(attribute_name));
    });
  };
};
/*
  knockback_default_wrapper.js
  (c) 2011 Kevin Malakoff.
  Knockback.DefaultWrapper is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.DefaultWrapper = (function() {
  function DefaultWrapper(observable, default_value) {
    this.default_value = default_value;
    this.__kb = {};
    this.__kb.observable = ko.dependentObservable({
      read: __bind(function() {
        var value;
        value = ko.utils.unwrapObservable(observable());
        if (!value) {
          return ko.utils.unwrapObservable(this.default_value);
        } else {
          return value;
        }
      }, this),
      write: function(value) {
        return observable(value);
      }
    });
    this.__kb.observable.destroy = _.bind(this.destroy, this);
    this.__kb.observable.setToDefault = _.bind(this.setToDefault, this);
    return kb.unwrapObservable(this);
  }
  DefaultWrapper.prototype.destroy = function() {
    this.__kb.observable = null;
    return this.default_value = null;
  };
  DefaultWrapper.prototype.setToDefault = function() {
    return this.__kb.observable(this.default_value);
  };
  return DefaultWrapper;
})();
Knockback.defaultWrapper = function(observable, default_value) {
  return new Knockback.DefaultWrapper(observable, default_value);
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
  function LocalizedObservable(value, options, view_model) {
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
    this.__kb.read = this.options.read ? this.options.read : this.read;
    this.__kb.write = this.options.write ? this.options.write : this.write;
    this.__kb["default"] = this.options["default"] ? this.options["default"] : this["default"];
    if (this.value) {
      value = ko.utils.unwrapObservable(this.value);
    }
    this.__kb.value_observable = ko.observable(!value ? this._getDefaultValue() : this.__kb.read.call(this, value, null));
    if (this.__kb.write && !_.isFunction(this.__kb.write)) {
      throw new Error('LocalizedObservable: options.write is not a function for read_write model attribute');
    }
    this.__kb.observable = ko.dependentObservable({
      read: _.bind(this._onGetValue, this),
      write: this.__kb.write ? _.bind(this._onSetValue, this) : (function() {
        throw new Error("Knockback.LocalizedObservable: value is read only");
      }),
      owner: this.view_model
    });
    this.__kb.observable.destroy = _.bind(this.destroy, this);
    this.__kb.observable.observedValue = _.bind(this.observedValue, this);
    this.__kb.observable.setToDefault = _.bind(this.setToDefault, this);
    this.__kb.observable.resetToCurrent = _.bind(this.resetToCurrent, this);
    kb.locale_manager.bind('change', this.__kb._onLocaleChange);
    return kb.unwrapObservable(this);
  }
  LocalizedObservable.prototype.destroy = function() {
    kb.locale_manager.unbind('change', this.__kb._onLocaleChange);
    this.__kb.value_observable = null;
    this.__kb.observable.dispose();
    this.__kb.observable = null;
    this.options = {};
    this.view_model = null;
    return this.__kb = null;
  };
  LocalizedObservable.prototype.setToDefault = function() {
    var current_value, default_value;
    if (!this.__kb["default"]) {
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
    if (!this.__kb["default"]) {
      return '';
    }
    if (_.isFunction(this.__kb["default"])) {
      return this.__kb["default"]();
    } else {
      return this.__kb["default"];
    }
  };
  LocalizedObservable.prototype._getCurrentValue = function() {
    if (!(this.value && this.__kb.observable)) {
      return this._getDefaultValue();
    }
    return this.__kb.read.call(this, ko.utils.unwrapObservable(this.value), this.__kb.observable);
  };
  LocalizedObservable.prototype._onGetValue = function() {
    if (this.value) {
      ko.utils.unwrapObservable(this.value);
    }
    return this.__kb.value_observable();
  };
  LocalizedObservable.prototype._onSetValue = function(value) {
    this.__kb.write.call(this, value, ko.utils.unwrapObservable(this.value), this.__kb.observable);
    value = this.__kb.read.call(this, ko.utils.unwrapObservable(this.value), this.__kb.observable);
    this.__kb.value_observable(value);
    if (this.options.onChange) {
      return this.options.onChange(value);
    }
  };
  LocalizedObservable.prototype._onLocaleChange = function() {
    var value;
    value = this.__kb.read.call(this, ko.utils.unwrapObservable(this.value), this.__kb.observable);
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
      this.model = this.model_ref.getModel();
    }
    this.__kb.value_observable = ko.observable();
    if (this.options.localizer) {
      this.__kb.localizer = new this.options.localizer(this._getCurrentValue());
    }
    this.__kb.observable = ko.dependentObservable({
      read: _.bind(this._onGetValue, this),
      write: this.options.write ? _.bind(this._onSetValue, this) : (function() {
        throw new Error("Knockback.Observable: " + this.options.key + " is read only");
      }),
      owner: this.view_model
    });
    this.__kb.observable.destroy = _.bind(this.destroy, this);
    this.__kb.observable.setToDefault = _.bind(this.setToDefault, this);
    if (!this.model_ref || this.model_ref.isLoaded()) {
      this.model.bind('change', this.__kb._onModelChange);
    }
    return kb.unwrapObservable(this);
  }
  Observable.prototype.destroy = function() {
    this.__kb.value_observable = null;
    this.__kb.observable.dispose();
    this.__kb.observable = null;
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
  Observable.prototype._onModelLoaded = function(model) {
    this.model = model;
    this.model.bind('change', this.__kb._onModelChange);
    return this._updateValue();
  };
  Observable.prototype._onModelUnloaded = function(model) {
    if (this.__kb.localizer && this.__kb.localizer.destroy) {
      this.__kb.localizer.destroy();
      this.__kb.localizer = null;
    }
    this.model.unbind('change', this.__kb._onModelChange);
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
        this.view_model[view_model_property_name] = kb.observable(this.model, mapping_info, this.view_model);
      }
    } else {
      _ref2 = this.mappings_info;
      for (view_model_property_name in _ref2) {
        mapping_info = _ref2[view_model_property_name];
        this.view_model[view_model_property_name] = kb.observable(this.model, mapping_info, this.view_model);
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
      this.model = this.model_ref.getModel();
    }
    this.__kb.value_observable = ko.observable();
    this.__kb.observable = ko.dependentObservable(_.bind(this._onGetValue, this));
    this.__kb.observable.destroy = _.bind(this.destroy, this);
    if (!this.model_ref || this.model_ref.isLoaded()) {
      this._onModelLoaded(this.model);
    }
    return kb.unwrapObservable(this);
  }
  TriggeredObservable.prototype.destroy = function() {
    this.__kb.observable.dispose();
    this.__kb.observable = null;
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
  knockback_view_model.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/
var AttributeConnector;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
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
AttributeConnector = (function() {
  function AttributeConnector(model, key, read_only) {
    this.key = key;
    this.read_only = read_only;
    this.__kb = {};
    this.__kb.observable = ko.observable();
    this.__kb.observable.subscription = this.__kb.observable.subscribe(__bind(function(value) {
      var set_info;
      if (this.read_only) {
        if (this.model) {
          value = this.model.get(this.key);
          if (this.__kb.observable() === value) {
            return;
          }
          this.__kb.observable(value);
        }
        throw "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.";
      } else if (this.model) {
        set_info = {};
        set_info[this.key] = value;
        return this.model.set(set_info);
      }
    }, this));
    this.__kb.observable.destroy = _.bind(this.destroy, this);
    this.__kb.observable.update = _.bind(this.update, this);
    this.update(model);
    return kb.unwrapObservable(this);
  }
  AttributeConnector.prototype.destroy = function() {
    this.model = null;
    return this.__kb.observable = null;
  };
  AttributeConnector.prototype.update = function(model) {
    var needs_update, value;
    if (model) {
      value = model.get(this.key);
      needs_update = (this.model !== model) || !_.isEqual(this.__kb.observable(), value);
      this.model = model;
      if (needs_update) {
        return this.__kb.observable(value);
      }
    } else {
      return this.model = null;
    }
  };
  return AttributeConnector;
})();
Knockback.ViewModel_RCBase = (function() {
  __extends(ViewModel_RCBase, Knockback.RefCountable);
  function ViewModel_RCBase() {
    ViewModel_RCBase.__super__.constructor.apply(this, arguments);
  }
  ViewModel_RCBase.prototype.__destroy = function() {
    kb.vmReleaseObservables(this);
    return ViewModel_RCBase.__super__.__destroy.apply(this, arguments);
  };
  return ViewModel_RCBase;
})();
Knockback.ViewModel = (function() {
  __extends(ViewModel, Knockback.ViewModel_RCBase);
  function ViewModel(model, options, view_model) {
    var key, missing, _i, _len;
    if (options == null) {
      options = {};
    }
    ViewModel.__super__.constructor.apply(this, arguments);
    this.__kb.store = options.__kb_store || new kb.Store();
    if (options.__kb_store_key) {
      this.__kb.store.add(options.__kb_store_key, this);
    }
    this.__kb._onModelChange = _.bind(this._onModelChange, this);
    this.__kb._onModelLoaded = _.bind(this._onModelLoaded, this);
    this.__kb._onModelUnloaded = _.bind(this._onModelUnloaded, this);
    this.__kb.model = model;
    this.__kb.internals = options.internals;
    this.__kb.requires = options.requires;
    this.__kb.read_only = options.read_only;
    this.__kb.view_model = view_model;
    if (!this.__kb.model) {
      throw new Error('ViewModel: model is missing');
    }
    if (!this.__kb.view_model) {
      this.__kb.view_model = this;
    } else {
      this.__kb.observables = [];
    }
    if (Backbone.ModelRef && (this.__kb.model instanceof Backbone.ModelRef)) {
      this.__kb.model_ref = this.__kb.model;
      this.__kb.model_ref.retain();
      this.__kb.model = this.__kb.model_ref.getModel();
      this.__kb.model_ref.bind('loaded', this.__kb._onModelLoaded);
      this.__kb.model_ref.bind('unloaded', this.__kb._onModelUnloaded);
    }
    if (!this.__kb.model_ref || this.__kb.model_ref.isLoaded()) {
      this._onModelLoaded(this.__kb.model);
    }
    if (!this.__kb.internals && !this.__kb.requires) {
      return this;
    }
    missing = _.union((this.__kb.internals ? this.__kb.internals : []), (this.__kb.requires ? this.__kb.requires : []));
    if (!this.__kb.model_ref || this.__kb.model_ref.isLoaded()) {
      missing = _.difference(missing, _.keys(this.__kb.model.attributes));
    }
    for (_i = 0, _len = missing.length; _i < _len; _i++) {
      key = missing[_i];
      this._updateAttributeObservor(this.__kb.model, key);
    }
  }
  ViewModel.prototype.__destroy = function() {
    var view_model;
    if (this.__kb.model) {
      this.__kb.model.unbind('change', this.__kb._onModelChange);
      this.__kb.model = null;
    }
    view_model = this.__kb.view_model;
    this.__kb.view_model = null;
    kb.vmReleaseObservables(view_model, this.__kb.observables);
    this.__kb.store = null;
    this.__kb.vm = null;
    return ViewModel.__super__.__destroy.apply(this, arguments);
  };
  ViewModel.prototype._onModelLoaded = function(model) {
    var key, _results;
    this.__kb.model = model;
    this.__kb.model.bind('change', this.__kb._onModelChange);
    _results = [];
    for (key in this.__kb.model.attributes) {
      _results.push(this._updateAttributeObservor(this.__kb.model, key));
    }
    return _results;
  };
  ViewModel.prototype._onModelUnloaded = function(model) {
    var key, _results;
    this.__kb.model.unbind('change', this.__kb._onModelChange);
    model = this.__kb.model;
    this.__kb.model = null;
    _results = [];
    for (key in model.attributes) {
      _results.push(this._updateAttributeObservor(this.__kb.model, key));
    }
    return _results;
  };
  ViewModel.prototype._onModelChange = function() {
    var key, _results, _results2;
    if (this.__kb.model._changed) {
      _results = [];
      for (key in this.__kb.model.attributes) {
        _results.push((this.__kb.model.hasChanged(key) ? this._updateAttributeObservor(this.__kb.model, key) : void 0));
      }
      return _results;
    } else if (this.__kb.model.changed) {
      _results2 = [];
      for (key in this.__kb.model.changed) {
        _results2.push(this._updateAttributeObservor(this.__kb.model, key));
      }
      return _results2;
    }
  };
  ViewModel.prototype._updateAttributeObservor = function(model, key) {
    var value, vm_key;
    vm_key = this.__kb.internals && _.contains(this.__kb.internals, key) ? '_' + key : key;
    if (this.__kb.view_model.hasOwnProperty(vm_key)) {
      if (!this.__kb.view_model[vm_key]) {
        throw new Error("Knockback.ViewModel: property '" + vm_key + "' has been unexpectedly removed");
      }
      if (this.__kb.view_model[vm_key].update) {
        return this.__kb.view_model[vm_key].update(model);
      }
    } else {
      if (this.__kb.observables) {
        this.__kb.observables.push(vm_key);
      }
      value = model ? model.get(key) : null;
      if ((value instanceof Backbone.Collection) || (value instanceof Backbone.Model)) {
        return this.__kb.view_model[vm_key] = this.__kb.store.resolve(value, __bind(function() {
          if (value instanceof Backbone.Collection) {
            return kb.collectionObservable(value, {
              view_model_constructor: this.constructor,
              __kb_store: this.__kb.store,
              __kb_store_key: value
            });
          } else {
            return new this.constructor(value, {
              __kb_store: this.__kb.store,
              __kb_store_key: value
            });
          }
        }, this));
      } else {
        return this.__kb.view_model[vm_key] = new AttributeConnector(model, key, this.__kb.read_only);
      }
    }
  };
  return ViewModel;
})();
Knockback.viewModel = function(model, options, view_model) {
  return new Knockback.ViewModel(model, options, view_model);
};