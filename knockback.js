/*
  knockback.js 0.8.0
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
Knockback.VERSION = '0.8.0';
Knockback.locale_manager;
Knockback.wrappedObservable = function(instance) {
  if (!instance._kb_observable) {
    throw new Error('Knockback: _kb_observable missing from your instance');
  }
  return instance._kb_observable;
};
Knockback.viewModelDestroyObservables = Knockback.vmDestroy = function(view_model) {
  var key, observable, _results;
  _results = [];
  for (key in view_model) {
    observable = view_model[key];
    _results.push((function(key, observable) {
      if (!observable || !((ko.isObservable(observable) && observable.destroy) || (observable instanceof kb.Observables))) {
        return;
      }
      observable.destroy();
      return view_model[key] = null;
    })(key, observable));
  }
  return _results;
};
/*
  knockback_collection_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.CollectionObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/
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
Knockback.CollectionObservable = (function() {
  function CollectionObservable(collection, observable_array, options) {
    var event, _i, _j, _len, _len2, _ref, _ref2;
    this.observable_array = observable_array;
    this.options = options;
    if (!collection) {
      throw new Error('CollectionObservable: collection is missing');
    }
    if (!this.observable_array) {
      throw new Error('CollectionObservable: observable_array is missing');
    }
    if (!this.options) {
      throw new Error('CollectionObservable: options is missing');
    }
    if (!this.options.viewModelCreate) {
      throw new Error('CollectionObservable: options.viewModelCreate is missing');
    }
    _.bindAll(this, 'destroy', 'collection', 'sorting', 'viewModelByModel', 'eachViewModel', 'bind', 'unbind', 'trigger');
    _.bindAll(this, '_onGetValue', '_onCollectionReset', '_onCollectionResort', '_onModelAdd', '_onModelRemove', '_onModelChanged');
    this._kb_collection = collection;
    if (this._kb_collection.retain) {
      this._kb_collection.retain();
    }
    this._kb_collection.bind('reset', this._onCollectionReset);
    if (!this.options.sortedIndex) {
      this._kb_collection.bind('resort', this._onCollectionResort);
    }
    _ref = ['new', 'add'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      this._kb_collection.bind(event, this._onModelAdd);
    }
    _ref2 = ['remove', 'destroy'];
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      event = _ref2[_j];
      this._kb_collection.bind(event, this._onModelRemove);
    }
    this._kb_collection.bind('change', this._onModelChanged);
    this._kb_value_observable = ko.observableArray([]);
    this._kb_observable = ko.dependentObservable(this._onGetValue);
    this._kb_observable.destroy = this.destroy;
    this._kb_observable.collection = this.collection;
    this._kb_observable.viewModelByModel = this.viewModelByModel;
    this._kb_observable.eachViewModel = this.eachViewModel;
    this._kb_observable.sorting = this.sorting;
    this._kb_observable.bind = this.bind;
    this._kb_observable.unbind = this.unbind;
    this._kb_observable.trigger = this.trigger;
    this._onCollectionReset(this._kb_collection);
    return kb.wrappedObservable(this);
  }
  CollectionObservable.prototype.destroy = function() {
    var event, _i, _j, _len, _len2, _ref, _ref2;
    this._kb_collection.unbind('reset', this._onCollectionReset);
    if (!this.options.sortedIndex) {
      this._kb_collection.unbind('resort', this._onCollectionResort);
    }
    _ref = ['new', 'add'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      this._kb_collection.unbind(event, this._onModelAdd);
    }
    _ref2 = ['remove', 'destroy'];
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      event = _ref2[_j];
      this._kb_collection.unbind(event, this._onModelRemove);
    }
    this._kb_collection.unbind('change', this._onModelChanged);
    if (this._kb_collection.release) {
      this._kb_collection.release();
    }
    this._kb_collection = null;
    this._kb_value_observable = null;
    this._kb_observable.dispose();
    this._kb_observable = null;
    this.observable_array = null;
    return this.options = null;
  };
  CollectionObservable.prototype.collection = function() {
    this._kb_value_observable();
    return this._kb_collection;
  };
  CollectionObservable.prototype.sorting = function(sortedIndex, sort_attribute) {
    if (arguments.length === 0) {
      return {
        sortedIndex: this.options.sortedIndex,
        sort_attribute: this.options.sort_attribute
      };
    }
    this.options.sort_attribute = sort_attribute;
    this.options.sortedIndex = sortedIndex;
    return this._onCollectionReset();
  };
  CollectionObservable.prototype.viewModelByModel = function(model) {
    var id_attribute;
    id_attribute = model.hasOwnProperty(model.idAttribute) ? model.idAttribute : 'cid';
    return _.find(this.observable_array(), function(test) {
      return test.__kb_model[id_attribute] === model[id_attribute];
    });
  };
  CollectionObservable.prototype.eachViewModel = function(iterator) {
    var view_model, _i, _len, _ref, _results;
    _ref = this.observable_array();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view_model = _ref[_i];
      _results.push(iterator(view_model));
    }
    return _results;
  };
  CollectionObservable.prototype._onGetValue = function() {
    return this._kb_value_observable();
  };
  CollectionObservable.prototype._onCollectionReset = function() {
    var model, models, view_model, view_models, _fn, _i, _j, _k, _len, _len2, _len3, _ref, _ref2;
    this.trigger('remove', this.observable_array());
    view_models = this.observable_array.removeAll();
    for (_i = 0, _len = view_models.length; _i < _len; _i++) {
      view_model = view_models[_i];
      kb.vmDestroy(view_model);
    }
    this._kb_value_observable.removeAll();
    view_models = [];
    if (this.options.sortedIndex) {
      models = [];
      _ref = this._kb_collection.models;
      _fn = __bind(function(model) {
        var add_index;
        view_model = this._viewModelCreate(model);
        add_index = this.options.sortedIndex(models, model);
        models.splice(add_index, 0, model);
        return view_models.splice(add_index, 0, view_model);
      }, this);
      for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
        model = _ref[_j];
        _fn(model);
      }
    } else {
      _ref2 = this._kb_collection.models;
      for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
        model = _ref2[_k];
        view_models.push(this._viewModelCreate(model));
      }
      models = _.clone(this._kb_collection.models);
    }
    this.observable_array(view_models);
    this._kb_value_observable(models);
    return this.trigger('add', this.observable_array());
  };
  CollectionObservable.prototype._onCollectionResort = function(model_or_models) {
    var model, _i, _len;
    if (this.options.sortedIndex) {
      throw new Error("CollectionObservable: collection sorting unexpected");
    }
    if (_.isArray(model_or_models)) {
      for (_i = 0, _len = model_or_models.length; _i < _len; _i++) {
        model = model_or_models[_i];
        this._viewModelResort(this.viewModelByModel(model));
      }
    } else {
      this._viewModelResort(this.viewModelByModel(model_or_models));
    }
    return this.trigger('resort', this.observable_array());
  };
  CollectionObservable.prototype._onModelAdd = function(model) {
    var add_index, sorted_models, view_model;
    view_model = this._viewModelCreate(model);
    if (this.options.sortedIndex) {
      sorted_models = _.pluck(this.observable_array(), '__kb_model');
      add_index = this.options.sortedIndex(sorted_models, model);
    } else {
      add_index = this._kb_collection.indexOf(model);
    }
    this.observable_array.splice(add_index, 0, view_model);
    this._kb_value_observable.splice(add_index, 0, model);
    return this.trigger('add', view_model, this.observable_array());
  };
  CollectionObservable.prototype._onModelRemove = function(model) {
    var view_model;
    view_model = this.viewModelByModel(model);
    if (!view_model) {
      return;
    }
    this.observable_array.remove(view_model);
    this._kb_value_observable.remove(model);
    this.trigger('remove', view_model, this.observable_array());
    kb.vmDestroy(view_model);
    return view_model.__kb_model = null;
  };
  CollectionObservable.prototype._onModelChanged = function(model) {
    var view_model;
    if (this.options.sortedIndex && (!this.options.sort_attribute || model.hasChanged(this.options.sort_attribute))) {
      view_model = this.viewModelByModel(model);
      if (!view_model) {
        throw new Error("CollectionObservable: view_model not found for resort");
      }
      this._viewModelResort(view_model);
    }
    return this._kb_value_observable.valueHasMutated();
  };
  CollectionObservable.prototype._viewModelCreate = function(model) {
    var view_model;
    view_model = this.options.viewModelCreate(model);
    if (view_model.__kb_model) {
      throw new Error("CollectionObservable: __kb_model is reserved");
    }
    view_model.__kb_model = model;
    return view_model;
  };
  CollectionObservable.prototype._viewModelResort = function(view_model) {
    var model, new_index, previous_index, sorted_models;
    previous_index = this.observable_array.indexOf(view_model);
    model = view_model.__kb_model;
    if (this.options.sortedIndex) {
      sorted_models = _.pluck(this.observable_array(), '__kb_model');
      sorted_models.splice(previous_index, 1);
      new_index = this.options.sortedIndex(sorted_models, model);
    } else {
      new_index = this._kb_collection.indexOf(model);
    }
    if (previous_index === new_index) {
      return;
    }
    this.observable_array.splice(previous_index, 1);
    this.observable_array.splice(new_index, 0, view_model);
    this._kb_value_observable.splice(previous_index, 1);
    this._kb_value_observable.splice(new_index, 0, model);
    return this.trigger('resort', view_model, this.observable_array(), new_index);
  };
  return CollectionObservable;
})();
__extends(Knockback.CollectionObservable.prototype, Backbone.Events);
Knockback.collectionObservable = function(collection, observable_array, options) {
  return new Knockback.CollectionObservable(collection, observable_array, options);
};
Knockback.viewModelGetModel = Knockback.vmModel = function(view_model) {
  return view_model.__kb_model;
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
    this.view_model = view_model;
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
    _.bindAll(this, 'destroy', 'setToDefault', 'resetToCurrent', 'getObservedValue', 'setObservedValue', '_onGetValue', '_onSetValue', '_onLocaleChange');
    this._kb_read = this.options.read ? this.options.read : this.read;
    this._kb_write = this.options.write ? this.options.write : this.write;
    this._kb_default = this.options["default"] ? this.options["default"] : this["default"];
    this._kb_value_observable = ko.observable();
    if (this._kb_write) {
      if (!this.view_model) {
        this.view_model = {};
      }
      if (!_.isFunction(this._kb_write)) {
        throw new Error('LocalizedObservable: options.write is not a function for read_write model attribute');
      }
      this._kb_observable = ko.dependentObservable({
        read: this._onGetValue,
        write: this._onSetValue,
        owner: this.view_model
      });
    } else {
      this._kb_observable = ko.dependentObservable(this._onGetValue);
    }
    this._kb_observable.destroy = this.destroy;
    this._kb_observable.getObservedValue = this.getObservedValue;
    this._kb_observable.setObservedValue = this.setObservedValue;
    this._kb_observable.setToDefault = this.setToDefault;
    this._kb_observable.resetToCurrent = this.resetToCurrent;
    kb.locale_manager.bind('change', this._onLocaleChange);
    this._onLocaleChange();
    return kb.wrappedObservable(this);
  }
  LocalizedObservable.prototype.destroy = function() {
    kb.locale_manager.unbind('change', this._onLocaleChange);
    this._kb_value_observable = null;
    this._kb_observable.dispose();
    this._kb_observable = null;
    this.options = {};
    return this.view_model = null;
  };
  LocalizedObservable.prototype.setToDefault = function() {
    var current_value, default_value;
    current_value = this._kb_value_observable();
    default_value = this._getDefaultValue();
    if (current_value !== default_value) {
      return this._onSetValue(default_value);
    } else {
      return this._kb_value_observable.valueHasMutated();
    }
  };
  LocalizedObservable.prototype.resetToCurrent = function() {
    this._kb_value_observable(null);
    return this._onSetValue(this._getCurrentValue());
  };
  LocalizedObservable.prototype.getObservedValue = function() {
    return this.value;
  };
  LocalizedObservable.prototype.setObservedValue = function(value) {
    this.value = value;
    this._onLocaleChange();
    return this;
  };
  LocalizedObservable.prototype._getDefaultValue = function() {
    if (!this._kb_default) {
      return '';
    }
    if (_.isFunction(this._kb_default)) {
      return this._kb_default();
    } else {
      return this._kb_default;
    }
  };
  LocalizedObservable.prototype._getCurrentValue = function() {
    if (!(this.value && this._kb_observable)) {
      return this._getDefaultValue();
    }
    return this._kb_read.call(this, this.value, this._kb_observable);
  };
  LocalizedObservable.prototype._onGetValue = function() {
    return this._kb_value_observable();
  };
  LocalizedObservable.prototype._onSetValue = function(value) {
    this._kb_write.call(this, value, this.value, this._kb_observable);
    value = this._kb_read.call(this, this.value, this._kb_observable);
    this._kb_value_observable(value);
    if (this.options.onChange) {
      return this.options.onChange(value);
    }
  };
  LocalizedObservable.prototype._onLocaleChange = function() {
    var value;
    value = this._kb_read.call(this, this.value, this._kb_observable);
    this._kb_value_observable(value);
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
    this.view_model = view_model;
    if (!this.model) {
      throw new Error('Observable: model is missing');
    }
    if (!this.options) {
      throw new Error('Observable: options is missing');
    }
    if (!this.options.key) {
      throw new Error('Observable: options.key is missing');
    }
    _.bindAll(this, 'destroy', 'setToDefault', '_onGetValue', '_onSetValue', '_onValueChange', '_onModelLoaded', '_onModelUnloaded');
    if (Backbone.ModelRef && (this.model instanceof Backbone.ModelRef)) {
      this.model_ref = this.model;
      this.model_ref.retain();
      this.model_ref.bind('loaded', this._onModelLoaded);
      this.model_ref.bind('unloaded', this._onModelUnloaded);
      this.model = this.model_ref.getModel();
    }
    this._kb_value_observable = ko.observable();
    if (this.options.localizer) {
      this._kb_localizer = this.options.localizer(this._getCurrentValue());
    }
    if (this.options.write) {
      if (!this.view_model) {
        throw new Error('Observable: view_model is missing for read_write model attribute');
      }
      this._kb_observable = ko.dependentObservable({
        read: this._onGetValue,
        write: this._onSetValue,
        owner: this.view_model
      });
    } else {
      this._kb_observable = ko.dependentObservable(this._onGetValue);
    }
    this._kb_observable.destroy = this.destroy;
    this._kb_observable.setToDefault = this.setToDefault;
    if (!this.model_ref || this.model_ref.isLoaded()) {
      this._onModelLoaded(this.model);
    }
    return kb.wrappedObservable(this);
  }
  Observable.prototype.destroy = function() {
    this._kb_value_observable = null;
    this._kb_observable.dispose();
    this._kb_observable = null;
    if (this.model) {
      this._onModelUnloaded(this.model);
    }
    if (this.model_ref) {
      this.model_ref.unbind('loaded', this._onModelLoaded);
      this.model_ref.unbind('unloaded', this._onModelUnloaded);
      this.model_ref.release();
      this.model_ref = null;
    }
    this.options = null;
    return this.view_model = null;
  };
  Observable.prototype.setToDefault = function() {
    var value;
    value = this._getDefaultValue();
    if (this._kb_localizer) {
      this._kb_localizer.setObservedValue(value);
      value = this._kb_localizer();
    }
    return this._kb_value_observable(value);
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
    if (!this.model) {
      return this._getDefaultValue();
    }
    if (this.options.read) {
      return this.options.read.apply(this.view_model, [this.model, this.options.key]);
    } else {
      return this.model.get(this.options.key);
    }
  };
  Observable.prototype._onGetValue = function() {
    var value;
    value = this._kb_value_observable();
    if (!this.model) {
      return this._getDefaultValue();
    }
    if (this._kb_localizer) {
      return this._kb_localizer();
    } else {
      return value;
    }
  };
  Observable.prototype._onSetValue = function(value) {
    var set_info;
    if (this._kb_localizer) {
      this._kb_localizer(value);
      value = this._kb_localizer.getObservedValue();
    }
    if (this.model) {
      set_info = {};
      set_info[this.options.key] = value;
      if (_.isFunction(this.options.write)) {
        this.options.write.apply(this.view_model, [value, this.model, set_info]);
      } else {
        this.model.set(set_info);
      }
    }
    if (this._kb_localizer) {
      return this._kb_value_observable(this._kb_localizer());
    } else {
      return this._kb_value_observable(value);
    }
  };
  Observable.prototype._onModelLoaded = function(model) {
    this.model = model;
    this.model.bind('change', this._onValueChange);
    this.model.bind("change:" + this.options.key, this._onValueChange);
    return this._onValueChange();
  };
  Observable.prototype._onModelUnloaded = function() {
    if (this._kb_localizer && this._kb_localizer.destroy) {
      this._kb_localizer.destroy();
      this._kb_localizer = null;
    }
    this.model.unbind('change', this._onValueChange);
    this.model.unbind("change:" + this.options.key, this._onValueChange);
    return this.model = null;
  };
  Observable.prototype._onValueChange = function() {
    var value;
    value = this._getCurrentValue();
    if (this._kb_localizer) {
      this._kb_localizer.setObservedValue(value);
      value = this._kb_localizer();
    }
    return this._kb_value_observable(value);
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
*/
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.Observables = (function() {
  function Observables(model, mappings_info, view_model) {
    var mapping_info, view_model_property_name, _ref;
    this.model = model;
    this.mappings_info = mappings_info;
    this.view_model = view_model;
    if (!this.model) {
      throw new Error('Observables: model is missing');
    }
    if (!this.mappings_info) {
      throw new Error('Observables: mappings_info is missing');
    }
    _ref = this.mappings_info;
    for (view_model_property_name in _ref) {
      mapping_info = _ref[view_model_property_name];
      this.view_model[view_model_property_name] = kb.observable(this.model, mapping_info, this.view_model);
    }
    return this;
  }
  Observables.prototype.destroy = function() {
    var mapping_info, view_model_property_name, _fn, _ref;
    _ref = this.mappings_info;
    _fn = __bind(function(view_model_property_name, mapping_info) {
      if (this.view_model[view_model_property_name]) {
        this.view_model[view_model_property_name].destroy();
      }
      return this.view_model[view_model_property_name] = null;
    }, this);
    for (view_model_property_name in _ref) {
      mapping_info = _ref[view_model_property_name];
      _fn(view_model_property_name, mapping_info);
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
Knockback.observables = function(model, mappings_info, view_model) {
  return new Knockback.Observables(model, mappings_info, view_model);
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
    _.bindAll(this, 'destroy', '_onGetValue', '_onValueChange', '_onModelLoaded', '_onModelUnloaded');
    if (Backbone.ModelRef && (this.model instanceof Backbone.ModelRef)) {
      this.model_ref = this.model;
      this.model_ref.retain();
      this.model_ref.bind('loaded', this._onModelLoaded);
      this.model_ref.bind('unloaded', this._onModelUnloaded);
      this.model = this.model_ref.getModel();
    }
    this._kb_value_observable = ko.observable();
    this._kb_observable = ko.dependentObservable(this._onGetValue);
    this._kb_observable.destroy = this.destroy;
    if (!this.model_ref || this.model_ref.isLoaded()) {
      this._onModelLoaded(this.model);
    }
    return kb.wrappedObservable(this);
  }
  TriggeredObservable.prototype.destroy = function() {
    this._kb_observable.dispose();
    this._kb_observable = null;
    this._kb_value_observable = null;
    if (this.model) {
      this._onModelUnloaded(this.model);
    }
    if (this.model_ref) {
      this.model_ref.unbind('loaded', this._onModelLoaded);
      this.model_ref.unbind('unloaded', this._onModelUnloaded);
      this.model_ref.release();
      this.model_ref = null;
    }
    this.options = null;
    return this.view_model = null;
  };
  TriggeredObservable.prototype._onGetValue = function() {
    return this._kb_value_observable();
  };
  TriggeredObservable.prototype._onModelLoaded = function(model) {
    this.model = model;
    this.model.bind(this.event_name, this._onValueChange);
    return this._onValueChange();
  };
  TriggeredObservable.prototype._onModelUnloaded = function() {
    if (this._kb_localizer && this._kb_localizer.destroy) {
      this._kb_localizer.destroy();
      this._kb_localizer = null;
    }
    this.model.unbind(this.event_name, this._onValueChange);
    return this.model = null;
  };
  TriggeredObservable.prototype._onValueChange = function() {
    var current_value;
    current_value = this._kb_value_observable();
    if (current_value !== this.model) {
      return this._kb_value_observable(this.model);
    } else {
      return this._kb_value_observable.valueHasMutated();
    }
  };
  return TriggeredObservable;
})();
Knockback.triggeredObservable = function(model, event_name) {
  return new Knockback.TriggeredObservable(model, event_name);
};