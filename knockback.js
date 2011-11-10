/*
  knockback.js 0.5.0
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
Knockback.VERSION = '0.5.0';
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
      if (!observable || !(observable.__kb_owner || (observable instanceof kb.Observables) || (observable instanceof kb.CollectionSync))) {
        return;
      }
      observable.destroy();
      return view_model[key] = null;
    })(key, observable));
  }
  return _results;
};
/*
  knockback_collection_sync.js
  (c) 2011 Kevin Malakoff.
  Knockback.CollectionSync is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.CollectionSync = (function() {
  function CollectionSync(collection, observable_array, options) {
    var event, _i, _j, _len, _len2, _ref, _ref2;
    this.collection = collection;
    this.observable_array = observable_array;
    this.options = options;
    if (!this.collection) {
      throw new Error('CollectionSync: collection is missing');
    }
    if (!this.observable_array) {
      throw new Error('CollectionSync: observable_array is missing');
    }
    if (!this.options) {
      throw new Error('CollectionSync: options is missing');
    }
    if (!this.options.viewModelCreate) {
      throw new Error('CollectionSync: options.viewModelCreate is missing');
    }
    _.bindAll(this, '_onCollectionReset', '_onCollectionResort', '_onModelAdd', '_onModelRemove', '_onModelChanged');
    if (this.collection.retain) {
      this.collection.retain();
    }
    this.collection.bind('reset', this._onCollectionReset);
    if (!this.options.sortedIndex) {
      this.collection.bind('resort', this._onCollectionResort);
    }
    _ref = ['new', 'add'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      this.collection.bind(event, this._onModelAdd);
    }
    _ref2 = ['remove', 'destroy'];
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      event = _ref2[_j];
      this.collection.bind(event, this._onModelRemove);
    }
    if (this.options.sortedIndex) {
      this.collection.bind('change', this._onModelChanged);
    }
    this._onCollectionReset(this.collection);
  }
  CollectionSync.prototype.destroy = function() {
    var event, _i, _j, _len, _len2, _ref, _ref2;
    this.collection.unbind('reset', this._onCollectionReset);
    if (!this.options.sortedIndex) {
      this.collection.unbind('resort', this._onCollectionResort);
    }
    _ref = ['new', 'add'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      this.collection.unbind(event, this._onModelAdd);
    }
    _ref2 = ['remove', 'destroy'];
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      event = _ref2[_j];
      this.collection.unbind(event, this._onModelRemove);
    }
    if (this.options.sortedIndex) {
      this.collection.unbind('change', this._onModelChanged);
    }
    if (this.collection.release) {
      this.collection.release();
    }
    this.collection = null;
    this.observable_array;
    return this.options = null;
  };
  CollectionSync.prototype.modelByViewModel = function(view_model) {
    return _.find(this.observable_array(), function(test) {
      return test === view_model;
    });
  };
  CollectionSync.prototype.viewModelByModel = function(model) {
    var id_attribute;
    id_attribute = model.hasOwnProperty(model.idAttribute) ? model.idAttribute : 'cid';
    return _.find(this.observable_array(), function(test) {
      return test.__kb_model[id_attribute] === model[id_attribute];
    });
  };
  CollectionSync.prototype.eachViewModel = function(iterator) {
    var view_model, _i, _len, _ref, _results;
    _ref = this.observable_array();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view_model = _ref[_i];
      _results.push(iterator(view_model));
    }
    return _results;
  };
  CollectionSync.prototype._onCollectionReset = function() {
    var model, sorted_models, view_model, view_models, _fn, _fn2, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref, _ref2, _ref3, _results;
    view_models = this.observable_array.removeAll();
    _fn = __bind(function(view_model) {
      if (this.options.onViewModelRemove) {
        this.options.onViewModelRemove(view_model);
      }
      return kb.vmDestroy(view_model);
    }, this);
    for (_i = 0, _len = view_models.length; _i < _len; _i++) {
      view_model = view_models[_i];
      _fn(view_model);
    }
    view_models = [];
    if (this.options.sortedIndex) {
      sorted_models = [];
      _ref = this.collection.models;
      _fn2 = __bind(function(model) {
        var add_index;
        view_model = this._viewModelCreate(model);
        add_index = this.options.sortedIndex(sorted_models, model);
        sorted_models.splice(add_index, 0, model);
        return view_models.splice(add_index, 0, view_model);
      }, this);
      for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
        model = _ref[_j];
        _fn2(model);
      }
    } else {
      _ref2 = this.collection.models;
      for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
        model = _ref2[_k];
        view_models.push(this._viewModelCreate(model));
      }
    }
    this.observable_array(view_models);
    if (this.options.onViewModelAdd) {
      _ref3 = this.observable_array();
      _results = [];
      for (_l = 0, _len4 = _ref3.length; _l < _len4; _l++) {
        view_model = _ref3[_l];
        _results.push(this.options.onViewModelAdd(view_model));
      }
      return _results;
    }
  };
  CollectionSync.prototype._onCollectionResort = function(model_or_models) {
    var model, _i, _len, _results;
    if (this.options.sortedIndex) {
      throw new Error("CollectionSync: collection sorting unexpected");
    }
    if (_.isArray(model_or_models)) {
      _results = [];
      for (_i = 0, _len = model_or_models.length; _i < _len; _i++) {
        model = model_or_models[_i];
        _results.push(this._viewModelResort(this.viewModelByModel(model)));
      }
      return _results;
    } else {
      return this._viewModelResort(this.viewModelByModel(model_or_models));
    }
  };
  CollectionSync.prototype._onModelAdd = function(model) {
    var add_index, sorted_models, view_model;
    view_model = this._viewModelCreate(model);
    if (this.options.sortedIndex) {
      sorted_models = _.pluck(this.observable_array(), '__kb_model');
      add_index = this.options.sortedIndex(sorted_models, model);
    } else {
      add_index = this.collection.indexOf(model);
    }
    this.observable_array.splice(add_index, 0, view_model);
    if (this.options.onViewModelAdd) {
      return this.options.onViewModelAdd(view_model, this.observable_array());
    }
  };
  CollectionSync.prototype._onModelRemove = function(model) {
    var view_model;
    view_model = this.viewModelByModel(model);
    if (!view_model) {
      throw new Error("CollectionSync: view_model not found for remove");
    }
    this.observable_array.remove(view_model);
    if (this.options.onViewModelRemove) {
      this.options.onViewModelRemove(view_model, this.observable_array());
    }
    kb.vmDestroy(view_model);
    return view_model.__kb_model = null;
  };
  CollectionSync.prototype._onModelChanged = function(model) {
    var view_model;
    if (!this.options.sortedIndex) {
      throw new Error("CollectionSync: change sorting unexpected");
    }
    if (this.options.sort_attribute && !model.hasChanged(this.options.sort_attribute)) {
      return;
    }
    view_model = this.viewModelByModel(model);
    if (!view_model) {
      throw new Error("CollectionSync: view_model not found for resort");
    }
    return this._viewModelResort(view_model);
  };
  CollectionSync.prototype._viewModelCreate = function(model) {
    var view_model;
    view_model = this.options.viewModelCreate(model);
    if (view_model.__kb_model) {
      throw new Error("CollectionSync: __kb_model is reserved");
    }
    view_model.__kb_model = model;
    return view_model;
  };
  CollectionSync.prototype._viewModelResort = function(view_model) {
    var model, new_index, previous_index, sorted_models;
    previous_index = this.observable_array.indexOf(view_model);
    model = view_model.__kb_model;
    if (this.options.sortedIndex) {
      sorted_models = _.pluck(this.observable_array(), '__kb_model');
      sorted_models.splice(previous_index, 1);
      new_index = this.options.sortedIndex(sorted_models, model);
    } else {
      new_index = this.collection.indexOf(model);
    }
    if (previous_index === new_index) {
      return;
    }
    this.observable_array.splice(previous_index, 1);
    this.observable_array.splice(new_index, 0, view_model);
    if (this.options.onViewModelResort) {
      return this.options.onViewModelResort(view_model, this.observable_array(), new_index);
    }
  };
  return CollectionSync;
})();
Knockback.collectionSync = function(collection, observable_array, options) {
  return new Knockback.CollectionSync(collection, observable_array, options);
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
    if (!this.value) {
      throw new Error('LocalizedObservable: value is missing');
    }
    if (!(this.options.read || this.read)) {
      throw new Error('LocalizedObservable: options.read is missing');
    }
    if (this.options.read && this.read) {
      throw new Error('LocalizedObservable: options.read and read class function exist. You need to choose one.');
    }
    if (this.options.write && this.write) {
      throw new Error('LocalizedObservable: options.read and read class function exist. You need to choose one.');
    }
    if (!kb.locale_manager) {
      throw new Error('LocalizedObservable: Knockback.locale_manager is not defined');
    }
    _.bindAll(this, 'destroy', '_onGetValue', '_onSetValue', 'getObservedValue', 'setObservedValue', '_onLocaleChange');
    this._kb_read = this.options.read ? this.options.read : this.read;
    this._kb_write = this.options.write ? this.options.write : this.write;
    if (this.value) {
      this.current_localized_value = this._kb_read.call(this, this.value, this._kb_observable);
    }
    if (this.options.onChange) {
      this.options.onChange(this.current_localized_value);
    }
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
    if (_.isUndefined(this._kb_observable.forceRefresh)) {
      throw new Error('Knockback: forceRefresh is missing. Please upgrade to a compatible version of Knockout.js');
    }
    kb.locale_manager.bind('change', this._onLocaleChange);
    this._kb_observable.getObservedValue = this.getObservedValue;
    this._kb_observable.setObservedValue = this.setObservedValue;
    this._kb_observable.destroy = this.destroy;
    this._kb_observable.__kb_owner = this;
    return kb.wrappedObservable(this);
  }
  LocalizedObservable.prototype.destroy = function() {
    kb.locale_manager.unbind('change', this._onLocaleChange);
    this._kb_observable.dispose();
    this._kb_observable = null;
    this.options = {};
    return this.view_model = null;
  };
  LocalizedObservable.prototype.getObservedValue = function() {
    return this.value;
  };
  LocalizedObservable.prototype.setObservedValue = function(value) {
    this.value = value;
    return this;
  };
  LocalizedObservable.prototype._getDefault = function() {
    if (!this.options.hasOwnProperty('default')) {
      return '';
    }
    if (_.isFunction(this.options["default"])) {
      return this.options["default"]();
    } else {
      return this.options["default"];
    }
  };
  LocalizedObservable.prototype._onGetValue = function() {
    return this.current_localized_value;
  };
  LocalizedObservable.prototype._onSetValue = function(value) {
    return this._kb_write.call(this, value, this.value, this._kb_observable);
  };
  LocalizedObservable.prototype._onLocaleChange = function() {
    this.current_localized_value = !this.value ? this._getDefault() : this._kb_read.call(this, this.value, this._kb_observable);
    this._kb_observable.forceRefresh();
    if (this.options.onChange) {
      return this.options.onChange(this.current_localized_value);
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
  function Observable(model, bind_info, view_model) {
    this.model = model;
    this.bind_info = bind_info;
    this.view_model = view_model;
    if (!this.model) {
      throw new Error('Observable: value is missing');
    }
    if (!this.bind_info) {
      throw new Error('Observable: bind_info is missing');
    }
    if (!this.bind_info.key) {
      throw new Error('Observable: bind_info.key is missing');
    }
    _.bindAll(this, 'destroy', '_onValueChange', '_onGetValue', '_onSetValue', '_onModelLoaded', '_onModelUnloaded');
    if (Backbone.ModelRef && (this.model instanceof Backbone.ModelRef)) {
      this.model_ref = this.model;
      this.model_ref.retain();
      this.model_ref.bind('loaded', this._onModelLoaded);
      this.model_ref.bind('unloaded', this._onModelUnloaded);
      this.model = this.model_ref.getModel();
    }
    this.in_create = true;
    if (this.bind_info.write) {
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
    this.in_create = false;
    if (_.isUndefined(this._kb_observable.forceRefresh)) {
      throw new Error('Knockback: forceRefresh is missing. Please upgrade to a compatible version of Knockout.js');
    }
    this._kb_observable.destroy = this.destroy;
    this._kb_observable.__kb_owner = this;
    if (!this.model_ref || this.model_ref.isLoaded()) {
      this._onModelLoaded(this.model);
    }
    return kb.wrappedObservable(this);
  }
  Observable.prototype.destroy = function() {
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
    this.bind_info = null;
    return this.view_model = null;
  };
  Observable.prototype._getDefault = function() {
    if (!this.bind_info.hasOwnProperty('default')) {
      return;
    }
    if (_.isFunction(this.bind_info["default"])) {
      return this.bind_info["default"]();
    } else {
      return this.bind_info["default"];
    }
  };
  Observable.prototype._onValueChange = function() {
    if (this.localizer && this.localizer.forceRefresh) {
      if (this.model) {
        this.localizer.setObservedValue(this.model.get(this.bind_info.key));
      }
      this.localizer.forceRefresh();
    }
    return this._kb_observable.forceRefresh();
  };
  Observable.prototype._onGetValue = function() {
    var value;
    if (!this.model) {
      return this._getDefault();
    }
    if (this.localizer) {
      return this.localizer();
    }
    value = this.bind_info.read ? this.bind_info.read.apply(this.view_model, [this.model, this.bind_info.key]) : this.model.get(this.bind_info.key);
    if (value) {
      return value;
    } else {
      return this._getDefault();
    }
  };
  Observable.prototype._onSetValue = function(value) {
    var set_info;
    if (!this.model) {
      return;
    }
    if (this.localizer) {
      this.localizer(value);
      return;
    }
    if (value && this.bind_info.localizer) {
      this.localizer = this.bind_info.localizer(value);
    }
    set_info = {};
    set_info[this.bind_info.key] = value;
    if (_.isFunction(this.bind_info.write)) {
      return this.bind_info.write.apply(this.view_model, [value, this.model, set_info]);
    } else {
      return this.model.set(set_info);
    }
  };
  Observable.prototype._onModelLoaded = function(model) {
    var value;
    this.model = model;
    this.model.bind('change', this._onValueChange);
    this.model.bind("change:" + this.bind_info.key, this._onValueChange);
    value = this.bind_info.read ? this.bind_info.read.apply(this.view_model, [this.model, this.bind_info.key]) : this.model.get(this.bind_info.key);
    if (value && this.bind_info.localizer) {
      this.localizer = this.bind_info.localizer(value);
    }
    if (!this.in_create) {
      return this._onValueChange();
    }
  };
  Observable.prototype._onModelUnloaded = function() {
    if (this.localizer && this.localizer.destroy) {
      this.localizer.destroy();
      this.localizer = null;
    }
    this.model.unbind('change', this._onValueChange);
    this.model.unbind("change:" + this.bind_info.key, this._onValueChange);
    return this.model = null;
  };
  return Observable;
})();
Knockback.observable = function(model, bind_info, view_model) {
  return new Knockback.Observable(model, bind_info, view_model);
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
  Observables.prototype.forceRefresh = function() {
    var mapping_info, view_model_property_name, _ref, _results;
    _ref = this.mappings_info;
    _results = [];
    for (view_model_property_name in _ref) {
      mapping_info = _ref[view_model_property_name];
      _results.push(this.view_model[view_model_property_name].forceRefresh());
    }
    return _results;
  };
  return Observables;
})();
Knockback.observables = function(model, mappings_info, view_model) {
  return new Knockback.Observables(model, mappings_info, view_model);
};