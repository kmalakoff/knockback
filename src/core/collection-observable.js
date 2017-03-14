/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let kb;
const { _, ko } = (kb = require('./kb'));
const extend = require('./functions/extend');

const COMPARE_EQUAL = 0;
const COMPARE_ASCENDING = -1;
const COMPARE_DESCENDING = 1;

const KEYS_PUBLISH = ['destroy', 'shareOptions', 'filters', 'comparator', 'sortAttribute', 'viewModelByModel', 'hasViewModels'];

kb.compare = function (value_a, value_b) {
  // String compare
  if (_.isString(value_a)) { return value_a.localeCompare(`${value_b}`); }
  if (_.isString(value_b)) { return value_b.localeCompare(`${value_a}`); }

  // compare raw values
  return (value_a === value_b) ? COMPARE_EQUAL : ((value_a < value_b) ? COMPARE_ASCENDING : COMPARE_DESCENDING);
};

// Base class for observing collections.
//
// @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
//   var collection = new Collection([{name: 'name1'}, {name: 'name2'}]);
//   var view_model = {
//     todos: kb.collectionObservable(collection)
//   };
//
// @example How to access and change the observed collection.
//    var todos = new kb.CollectionObservable(new kb.Collection([{name: 'name1'}, {name: 'name2'}]);
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
class CollectionObservable {
  static initClass() {
    // @nodoc
    this.extend = extend;
     // for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")
  }

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
  // @option options [Object] factories a map of dot-deliminated paths; for example 'models.owner': kb.ViewModel to either constructors or create functions. Signature: 'some.path': function(object, options)
  // @option options [Function] comparator a function that is used to sort an object. Signature: `function(model_a, model_b)` returns negative value for ascending, 0 for equal, and positive for descending
  // @option options [String] sort_attribute the name of an attribute. Default: resort on all changes to a model.
  // @option options [Id|Function|Array] filters filters can be individual ids (observable or simple) or arrays of ids, functions, or arrays of functions.
  // @option options [String] path the path to the value (used to create related observables from the factory).
  // @option options [kb.Store] store a store used to cache and share view models.
  // @option options [kb.Factory] factory a factory used to create view models.
  // @option options [Object] options a set of options merge into these options. Useful for extending options when deriving classes rather than merging them by hand.
  // @return [ko.observableArray] the constructor does not return 'this' but a ko.observableArray
  // @note the constructor does not return 'this' but a ko.observableArray
  constructor(collection, view_model, options) {
    this._onCollectionChange = this._onCollectionChange.bind(this);
    const args = Array.prototype.slice.call(_.isArguments(collection) ? collection : arguments);
    return kb.ignore(() => {
      collection = args[0] instanceof kb.Collection ? args.shift() : (_.isArray(args[0]) ? new kb.Collection(args.shift()) : new kb.Collection());
      if (_.isFunction(args[0])) { args[0] = { view_model: args[0] }; }

      options = {};
      args.forEach(arg => _.extend(options, arg));

      let observable = kb.utils.wrappedObservable(this, ko.observableArray([]));
      observable.__kb_is_co = true; // mark as a kb.CollectionObservable
      this.in_edit = 0;

      // bind callbacks
      if (!this.__kb) { this.__kb = {}; }

      // options
      options = kb.utils.collapseOptions(options);
      if (options.auto_compact) { this.auto_compact = true; }
      if (options.sort_attribute) {
        this._comparator = ko.observable(this._attributeComparator(options.sort_attribute));
      } else {
        this._comparator = ko.observable(options.comparator);
      }
      if (options.filters) {
        this._filters = ko.observableArray((() => {
          if (_.isArray(options.filters)) { return options.filters; } else if (options.filters) { return [options.filters]; }
        })());
      } else {
        this._filters = ko.observableArray([]);
      }
      const create_options = (this.create_options = { store: kb.Store.useOptionsOrCreate(options, collection, observable) }); // create options
      kb.utils.wrappedObject(observable, collection);

    // view model factory create factories
      this.path = options.path;
      create_options.factory = kb.utils.wrappedFactory(observable, this._shareOrCreateFactory(options));
      create_options.path = kb.utils.pathJoin(options.path, 'models');

    // check for models only
      create_options.creator = create_options.factory.creatorForPath(null, create_options.path);
      if (create_options.creator) { this.models_only = create_options.creator.models_only; }

    // publish public interface on the observable and return instead of this
      kb.publishMethods(observable, this, KEYS_PUBLISH);

    // start the processing
      this._collection = ko.observable(collection);
      observable.collection = (this.collection = ko.computed({
        read: () => this._collection(),
        write: new_collection => kb.ignore(() => {
          let previous_collection;
          if ((previous_collection = this._collection()) === new_collection) { return; } // no change
        // @create_options.store.reuse(@, new_collection) # not meant to be shared
          kb.utils.wrappedObject(observable, new_collection);

        // clean up
          if (previous_collection) { previous_collection.unbind('all', this._onCollectionChange); }

        // store in _kb_collection so that a collection() function can be exposed on the observable and so the collection can be
          if (new_collection) { new_collection.bind('all', this._onCollectionChange); }

        // update references (including notification)
          return this._collection(new_collection);
        },
      ),
      }));
      if (collection) { collection.bind('all', this._onCollectionChange); } // bind now

    // observable that will re-trigger when sort or filters or collection changes
      this._mapper = ko.computed(() => {
        let filter,
          models,
          view_models;
        const comparator = this._comparator(); // create dependency
        const filters = this._filters(); // create dependency
        if (filters) {
          ((() => filters.map(filter => ko.utils.unwrapObservable(filter)))());
        } // create a dependency
        const current_collection = this._collection(); // create dependency
        if (this.in_edit) { return; } // we are doing the editing

      // no models
        observable = kb.utils.wrappedObservable(this);
        const previous_view_models = kb.peek(observable);
        if (current_collection) { ({ models } = current_collection); }
        if (!models || (current_collection.models.length === 0)) {
          view_models = [];

      // process filters, sorting, etc
        } else {
          // apply filters
          models = _.filter(models, model => !filters.length || this._selectModel(model));

          // apply sorting
          if (comparator) {
            view_models = _.map(models, model => this._createViewModel(model)).sort(comparator);

          // no sorting
          } else if (this.models_only) {
            view_models = filters.length ? models : models.slice(); // clone the array if it wasn't filtered
          } else {
            view_models = _.map(models, model => this._createViewModel(model));
          }
        }

      // update the observable array for this collection observable
        this.in_edit++;
        observable(view_models);
        this.in_edit--;

      // TODO: release previous
      // unless @models_only
      //   create_options.store.release(view_model) for view_model in previous_view_models
      },
    );

    // start subscribing
      observable.subscribe(_.bind(this._onObservableArrayChange, this));

      !kb.statistics || kb.statistics.register('CollectionObservable', this);     // collect memory management statistics

      return observable;
    },
  );
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy() {
    this.__kb_released = true;
    const observable = kb.utils.wrappedObservable(this);
    const collection = kb.peek(this._collection); kb.utils.wrappedObject(observable, null);
    if (collection) {
      collection.unbind('all', this._onCollectionChange);
      const array = kb.peek(observable); array.splice(0, array.length); // clear the view models or models
    }
    this.collection.dispose(); this._collection = (observable.collection = (this.collection = null));
    this._mapper.dispose(); this._mapper = null;
    kb.release(this._filters); this._filters = null;
    this._comparator(null); this._comparator = null;
    this.create_options = null;
    observable.collection = null; kb.utils.wrappedDestroy(this);

    return !kb.statistics || kb.statistics.unregister('CollectionObservable', this);     // collect memory management statistics
  }

  // Get the options for a new collection that can be used for sharing view models.
  //
  // @example Sharing view models for an HTML select element.
  //   var selected_collection = new Backbone.Collection();
  //   var available_collection = new Backbone.Collection([{name: 'Bob'}, {name: 'Fred'}]);
  //   var selected = kb.collectionObservable(available_collection);
  //   var available = kb.collectionObservable(available_collection, available_collection.shareOptions()); // view models shared with selected collection observable
  shareOptions() {
    const observable = kb.utils.wrappedObservable(this);
    return { store: kb.utils.wrappedStore(observable), factory: kb.utils.wrappedFactory(observable) };
  }

  // Setter for the filters array for excluding models in the collection observable.
  //
  // @param [Id|Function|Array] filters filters can be individual ids (observable or simple) or arrays of ids, functions, or arrays of functions.
  //
  // @example
  //    // exclude a single model by id
  //    collection_observable.filters(model.id);
  filters(filters) {
    if (filters) {
      return this._filters(_.isArray(filters) ? filters : [filters]);
    }
    return this._filters([]);
  }

  // Setter for the sorted index function for auto-sorting the ViewModels or Models in a kb.CollectionObservable.
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
  comparator(comparator) { return this._comparator(comparator); }

  // Setter for the sort attribute name for auto-sorting the ViewModels or Models in a kb.CollectionObservable.
  //
  // @param [String] sort_attribute the name of an attribute. Default: resort on all changes to a model.
  //
  // @example
  //    var todos = new kb.CollectionObservable(new Backbone.Collection([{name: 'Zanadu', name: 'Alex'}]));
  //    // in order of Zanadu then Alex
  //    todos.sortAttribute('name');
  //    // in order of Alex then Zanadu
  sortAttribute(sort_attribute) { return this._comparator(sort_attribute ? this._attributeComparator(sort_attribute) : null); }

  // Reverse lookup for a view model by model. If created with models_only option, will return null.
  viewModelByModel(model) {
    if (this.models_only) { return null; }
    const id_attribute = model.hasOwnProperty(model.idAttribute) ? model.idAttribute : 'cid';
    return _.find(kb.peek(kb.utils.wrappedObservable(this)), test => __guard__(test != null ? test.__kb : undefined, x => x.object) ? (test.__kb.object[id_attribute] === model[id_attribute]) : false);
  }

  // Will return true unless created with models_only option.
  //
  // @example
  //   var todos1 = new kb.CollectionObservable(new Backbone.Collection(), {models_only: true});
  //   todos1.hasViewModels();     // false
  //   var todos2 = new kb.CollectionObservable(new Backbone.Collection());
  //   todos2.hasViewModels();     // true
  hasViewModels() { return !this.models_only; }

  // Compacts the Collection Observable to use the least amount of memory. Currently, this is brute force meaning it releases than regenerates all view models when called.
  //
  compact() {
    return kb.ignore(() => {
      const observable = kb.utils.wrappedObservable(this);
      if (!kb.utils.wrappedStoreIsOwned(observable)) { return; }
      kb.utils.wrappedStore(observable).clear();
      return this._collection.notifySubscribers(this._collection());
    },
  );
  }

  // ###################################################
  // Internal
  // ###################################################

  // @nodoc
  _shareOrCreateFactory(options) {
    let factory;
    const absolute_models_path = kb.utils.pathJoin(options.path, 'models');
    const { factories } = options;

    // check the existing factory
    if (factory = options.factory) {
      // models matches, check additional paths
      let existing_creator;
      if ((existing_creator = factory.creatorForPath(null, absolute_models_path)) && (!factories || (factories.models === existing_creator))) {
        if (!factories) { return factory; } // all match, share the factory

        // all match, share the factory
        if (factory.hasPathMappings(factories, options.path)) { return factory; }
      }
    }

    // need to create a new factory
    factory = new kb.Factory(options.factory);
    if (factories) { factory.addPathMappings(factories, options.path); }

    // set up the default create function
    if (!factory.creatorForPath(null, absolute_models_path)) {
      if (options.hasOwnProperty('models_only')) {
        if (options.models_only) {
          factory.addPathMapping(absolute_models_path, { models_only: true });
        } else {
          factory.addPathMapping(absolute_models_path, kb.ViewModel);
        }
      } else if (options.view_model) {
        factory.addPathMapping(absolute_models_path, options.view_model);
      } else if (options.create) {
        factory.addPathMapping(absolute_models_path, { create: options.create });
      } else {
        factory.addPathMapping(absolute_models_path, kb.ViewModel);
      }
    }
    return factory;
  }

  // @nodoc
  _onCollectionChange(event, arg) {
    return kb.ignore(() => {
      let comparator,
        view_model;
      if (this.in_edit || kb.wasReleased(this)) { return; } // we are doing the editing or have been released

      switch (event) {
        case 'reset':
          if (this.auto_compact) { this.compact(); } else { this._collection.notifySubscribers(this._collection()); }
          break;
        case 'sort': case 'resort':
          this._collection.notifySubscribers(this._collection());
          break;

        case 'new': case 'add':
          if (!this._selectModel(arg)) { return; } // filtered

          const observable = kb.utils.wrappedObservable(this);
          const collection = this._collection();
          if (collection.indexOf(arg) === -1) { return; } // the model may have been removed before we got a chance to add it
          if (view_model = this.viewModelByModel(arg)) { return; } // it may have already been added by a change event
          this.in_edit++;
          if (comparator = this._comparator()) {
            observable().push(this._createViewModel(arg));
            observable.sort(comparator);
          } else {
            observable.splice(collection.indexOf(arg), 0, this._createViewModel(arg));
          }
          this.in_edit--;
          break;

        case 'remove': case 'destroy': this._onModelRemove(arg); break;
        case 'change':
        // filtered, remove
          if (!this._selectModel(arg)) { return this._onModelRemove(arg); }

          view_model = this.models_only ? arg : this.viewModelByModel(arg);
          if (!view_model) { return this._onCollectionChange('add', arg); } // add new
          if (!(comparator = this._comparator())) { return; }

          this.in_edit++;
          kb.utils.wrappedObservable(this).sort(comparator);
          this.in_edit--;
          break;
      }
    },
  );
  }

  // @nodoc
  _onModelRemove(model) {
    const view_model = this.models_only ? model : this.viewModelByModel(model); // either remove a view model or a model
    if (!view_model) { return; }  // it may have already been removed
    const observable = kb.utils.wrappedObservable(this);
    this.in_edit++;
    observable.remove(view_model);
    return this.in_edit--;
  }

  // @nodoc
  _onObservableArrayChange(models_or_view_models) {
    return kb.ignore(() => {
      let models;
      if (this.in_edit) { return; } // we are doing the editing

    // validate input
      (this.models_only && (!models_or_view_models.length || kb.isModel(models_or_view_models[0]))) || (!this.models_only && (!models_or_view_models.length || (_.isObject(models_or_view_models[0]) && !kb.isModel(models_or_view_models[0])))) || kb._throwUnexpected(this, 'incorrect type passed');

      const observable = kb.utils.wrappedObservable(this);
      const collection = kb.peek(this._collection);
      const has_filters = kb.peek(this._filters).length;
      if (!collection) { return; } // no collection or we are updating ourselves

      let view_models = models_or_view_models;

    // set Models
      if (this.models_only) {
        models = _.filter(models_or_view_models, model => !has_filters || this._selectModel(model));

    // set ViewModels
      } else {
        !has_filters || (view_models = []); // check for filtering of ViewModels
        models = [];
        models_or_view_models.forEach((view_model) => {
          let current_view_model;
          const model = kb.utils.wrappedObject(view_model);
          if (has_filters) {
            if (!this._selectModel(model)) return; // filtered so skip
            view_models.push(view_model);
          }

          // check for view models being different (will occur if a ko select selectedOptions is bound to this collection observable) -> update our store
          if (current_view_model = this.create_options.store.find(model, this.create_options.creator)) {
            (current_view_model.constructor === view_model.constructor) || kb._throwUnexpected(this, 'replacing different type of view model');
          }
          this.create_options.store.retain(view_model, model, this.create_options.creator);
          models.push(model);
        });
      }

    // a change, update models
      this.in_edit++;
      (models_or_view_models.length === view_models.length) || observable(view_models); // replace the ViewModels because they were filtered
      _.isEqual(collection.models, models) || collection.reset(models);
      this.in_edit--;
    },
  );
  }

  // @nodoc
  _attributeComparator(sort_attribute) {
    const modelAttributeCompare = function (model_a, model_b) {
      const attribute_name = ko.utils.unwrapObservable(sort_attribute);
      return kb.compare(model_a.get(attribute_name), model_b.get(attribute_name));
    };
    return (this.models_only ? modelAttributeCompare : (model_a, model_b) => modelAttributeCompare(kb.utils.wrappedModel(model_a), kb.utils.wrappedModel(model_b)));
  }

  // @nodoc
  _createViewModel(model) {
    if (this.models_only) { return model; }
    return this.create_options.store.retainOrCreate(model, this.create_options);
  }

  // @nodoc
  _selectModel(model) {
    const filters = kb.peek(this._filters);
    for (let i = 0, l = filters.length; i < l; i++) {
      let filter = filters[i];
      filter = kb.peek(filter);
      if (_.isFunction(filter)) {
        if (!filter(model)) return false;
      } else if (_.isArray(filter)) {
        if (!filter.includes(model.id)) return false;
      } else if (model.id !== filter) return false;
    }
    return true;
  }
}
CollectionObservable.initClass();
kb.CollectionObservable = CollectionObservable;

// factory function
kb.collectionObservable = function (collection, view_model, options) { return new kb.CollectionObservable(arguments); };
kb.observableCollection = kb.collectionObservable;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
