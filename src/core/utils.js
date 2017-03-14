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

// ###################################################
// Public API
// ###################################################

// Library of general-purpose utilities
class utils {
  static initClass() {
    // Clean up function that releases all of the wrapped values on an owner.
    this.wrappedDestroy = require('./functions/wrapped_destroy');

    // Helper to merge options including ViewmModel options like `keys` and `factories`
    //
    // @param [Object] obj the object to test
    //
    // @example
    //   kb.utils.collapseOptions(options);
    this.collapseOptions = require('./functions/collapse_options');

    // used for attribute setting to ensure all model attributes have their underlying models
    this.unwrapModels = require('./functions/unwrap_models');
  }

  // @nodoc
  static get(obj, key, default_value) { return !obj.__kb || !obj.__kb.hasOwnProperty(key) ? default_value : obj.__kb[key]; }

  // @nodoc
  static set(obj, key, value) { return ((obj.__kb || (obj.__kb = {})))[key] = value; }

  // @nodoc
  static orSet(obj, key, value) {
    if (!obj.__kb) obj.__kb = {};
    if (!obj.__kb.hasOwnProperty(key)) obj.__kb[key] = value;
    return obj.__kb[key];
  }

  // @nodoc
  static has(obj, key) { return obj.__kb && obj.__kb.hasOwnProperty(key); }

  // Dual-purpose getter/setter for retrieving and storing the observable on an instance that returns a ko.observable instead of 'this'. Relevant for:
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
  static wrappedObservable(obj, value) { if (arguments.length === 1) { return kb.utils.get(obj, 'observable'); } return kb.utils.set(obj, 'observable', value); }

  // Dual-purpose getter/setter for retrieving and storing the Model or Collection on an owner.
  // @note this is almost the same as {kb.utils.wrappedModel} except that if the Model doesn't exist, it returns null.
  //
  // @overload wrappedObject(obj)
  //   Gets the observable from an object
  //   @param [Object|kb.ViewModel|kb.CollectionObservable] obj owner the ViewModel/CollectionObservable owning the kb.Model or kb.Collection.
  //   @return [Model|Collection] the model/collection
  // @overload wrappedObject(obj, value)
  //   Sets the observable on an object
  //   @param [Object|kb.ViewModel|kb.CollectionObservable] obj owner the ViewModel/CollectionObservable owning the kb.Model or kb.Collection.
  //   @param [Model|Collection] value the model/collection
  //
  // @example
  //   var model = kb.utils.wrappedObject(view_model);
  //   var collection = kb.utils.wrappedObject(collection_observable);
  static wrappedObject(obj, value) { if (arguments.length === 1) { return kb.utils.get(obj, 'object'); } return kb.utils.set(obj, 'object', value); }

  // @nodoc
  static wrappedCreator(obj, value) { if (arguments.length === 1) { return kb.utils.get(obj, 'creator'); } return kb.utils.set(obj, 'creator', value); }

  // Dual-purpose getter/setter for retrieving and storing the Model on a ViewModel.
  // @note this is almost the same as {kb.utils.wrappedObject} except that if the Model doesn't exist, it returns the ViewModel itself (which is useful behaviour for sorting because it you can iterate over a kb.CollectionObservable's ko.ObservableArray whether it holds ViewModels or Models with the models_only option).
  //
  // @overload wrappedModel(view_model)
  //   Gets the model from a ViewModel
  //   @param [Object|kb.ViewModel] view_model the owning ViewModel for the Model.
  //   @return [Model|ViewModel] the Model or ViewModel itself if there is no Model
  // @overload wrappedModel(view_model, model)
  //   Sets the observable on an object
  //   @param [Object|kb.ViewModel] view_model the owning ViewModel for the Model.
  //   @param [Model] model the Model
  static wrappedModel(obj, value) {
    if (arguments.length !== 1) return kb.utils.set(obj, 'object', value);
    value = kb.utils.get(obj, 'object');
    return _.isUndefined(value) ? obj : value;
  }

  // Dual-purpose getter/setter for retrieving and storing a kb.Store on an owner.
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
  static wrappedStore(obj, value) { if (arguments.length === 1) { return kb.utils.get(obj, 'store'); } return kb.utils.set(obj, 'store', value); }

  // @private
  static wrappedStoreIsOwned(obj, value) { if (arguments.length === 1) { return kb.utils.get(obj, 'store_is_owned'); } return kb.utils.set(obj, 'store_is_owned', value); }

  // Dual-purpose getter/setter for retrieving and storing a kb.Factory on an owner.
  //
  // @overload wrappedFactory(obj)
  //   Gets the factory from an object
  //   @param [Any] obj the owner
  //   @return [kb.Factory] the factory
  // @overload wrappedFactory(obj, factory)
  //   Sets the factory on an object
  //   @param [Any] obj the owner
  //   @param [kb.Factory] factory the factory
  static wrappedFactory(obj, value) { if (arguments.length === 1) { return kb.utils.get(obj, 'factory'); } return kb.utils.set(obj, 'factory', value); }

  // Dual-purpose getter/setter for retrieving and storing a kb.EventWatcher on an owner.
  //
  // @overload wrappedEventWatcher(obj)
  //   Gets the event_watcher from an object
  //   @param [Any] obj the owner
  //   @return [kb.EventWatcher] the event_watcher
  // @overload wrappedEventWatcher(obj, event_watcher)
  //   Sets the event_watcher on an object
  //   @param [Any] obj the owner
  //   @param [kb.EventWatcher] event_watcher the event_watcher
  static wrappedEventWatcher(obj, value) { if (arguments.length === 1) { return kb.utils.get(obj, 'event_watcher'); } return kb.utils.set(obj, 'event_watcher', value); }

  // @private
  static wrappedEventWatcherIsOwned(obj, value) { if (arguments.length === 1) { return kb.utils.get(obj, 'event_watcher_is_owned'); } return kb.utils.set(obj, 'event_watcher_is_owned', value); }

  // Retrieves the value stored in a ko.observable.
  //
  // @see kb.Observable valueType
  //
  // @example
  //   var view_model = kb.viewModel(new Model({simple_attr: null, model_attr: null}), {factories: {model_attr: kb.ViewModel});
  //   kb.utils.valueType(view_model.simple_attr); // kb.TYPE_SIMPLE
  //   kb.utils.valueType(view_model.model_attr);  // kb.TYPE_MODEL
  static valueType(observable) {
    if (!observable) { return kb.TYPE_UNKNOWN; }
    if (observable.__kb_is_o) { return observable.valueType(); }
    if (observable.__kb_is_co || (observable instanceof kb.Collection)) { return kb.TYPE_COLLECTION; }
    if ((observable instanceof kb.ViewModel) || (observable instanceof kb.Model)) { return kb.TYPE_MODEL; }
    if (_.isArray(observable)) { return kb.TYPE_ARRAY; }
    return kb.TYPE_SIMPLE;
  }

  // Helper to join a dot-deliminated path.
  //
  // @param [String] path1 start path.
  // @param [String] path2 append path.
  // @return [String] combined dot-delimited path.
  //
  // @example
  //   kb.utils.pathJoin('models', 'name'); // 'models.name'
  static pathJoin(path1, path2) { return (path1 ? (path1[path1.length - 1] !== '.' ? `${path1}.` : path1) : '') + path2; }

  // Helper to join a dot-deliminated path with the path on options and returns a new options object with the result.
  //
  // @param [Object] options with path property for the start path
  // @param [String] path append path.
  // @return [Object] new options with combined dot-delimited path `{path: combined_path}`.
  //
  // @example
  //   this.friends = kb.collectionObservable(model.get('friends'), kb.utils.optionsPathJoin(options, 'friends'));
  static optionsPathJoin(options, path) { return _.defaults({ path: this.pathJoin(options.path, path) }, options); }

  // Helper to find the creator constructor or function from a factory or ORM solution
  static inferCreator(value, factory, path) {
    let creator;
    if (factory && (creator = factory.creatorForPath(value, path))) { return creator; }

    // try fallbacks
    if (!value) { return null; }
    if (value instanceof kb.Model) { return kb.ViewModel; }
    if (value instanceof kb.Collection) { return kb.CollectionObservable; }
    return null;
  }

  // Creates an observable based on a value's type.
  static createFromDefaultCreator(obj, options) {
    if (kb.isModel(obj)) { return kb.viewModel(obj, options); }
    if (kb.isCollection(obj)) { return kb.collectionObservable(obj, options); }
    if (_.isArray(obj)) { return ko.observableArray(obj); }
    return ko.observable(obj);
  }

  // @nodoc
  static resolveModel(model) { if (model && kb.Backbone && kb.Backbone.ModelRef && model instanceof kb.Backbone.ModelRef) { return model.model(); } return model; }
}
utils.initClass();
kb.utils = utils;
