###
  knockback-utils.js
  (c) 2011-2013 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
###

####################################################
# Internal
####################################################
_wrappedKey = (obj, key, value) ->
  # get
  if arguments.length is 2
    return if (obj and obj.__kb and obj.__kb.hasOwnProperty(key)) then obj.__kb[key] else undefined

  # set
  obj or _throwUnexpected(@, "no obj for wrapping #{key}")
  obj.__kb or= {}
  obj.__kb[key] = value
  return value

_argumentsAddKey = (args, key) ->
  _arraySplice.call(args, 1, 0, key)
  return args

# used for attribute setting to ensure all model attributes have their underlying models
_unwrapModels = (obj) ->
  return obj if not obj

  if obj.__kb
    return if ('object' of obj.__kb) then obj.__kb.object else obj

  else if _.isArray(obj)
    return _.map(obj, (test) -> return _unwrapModels(test))

  else if _.isObject(obj) and (obj.constructor is {}.constructor) # a simple object
    result = {}
    for key, value of obj
      result[key] = _unwrapModels(value)
    return result

  return obj

####################################################
# Public API
####################################################

# Library of general-purpose utilities
class kb.utils

  # Dual-purpose getter/setter for retrieving and storing the observable on an instance that returns a ko.observable instead of 'this'. Relevant for:
  #
  #   * [kb.CollectionObservable]('classes/kb/CollectionObservable.html')
  #   * [kb.Observable]('classes/kb/Observable.html')
  #   * [kb.DefaultObservable]('classes/kb/DefaultObservable.html')
  #   * [kb.FormattedObservable]('classes/kb/FormattedObservable.html')
  #   * [kb.LocalizedObservable]('classes/kb/LocalizedObservable.html')
  #   * [kb.TriggeredObservable]('classes/kb/TriggeredObservable.html')
  #
  # @overload wrappedObservable(instance)
  #   Gets the observable from an object
  #   @param [Any] instance the owner
  #   @return [ko.observable|ko.observableArray] the observable
  # @overload wrappedObservable(instance, observable)
  #   Sets the observable on an object
  #   @param [Any] instance the owner
  #   @param [ko.observable|ko.observableArray] observable the observable
  #
  # @example
  #   var ShortDateLocalizer = kb.LocalizedObservable.extend({
  #     constructor: function(value, options, view_model) {
  #       kb.LocalizedObservable.prototype.constructor.apply(this, arguments);
  #       return kb.utils.wrappedObservable(this);
  #     }
  #   });
  @wrappedObservable = (obj, value)           -> return _wrappedKey.apply(@, _argumentsAddKey(arguments, 'observable'))

  # Dual-purpose getter/setter for retrieving and storing the Model or Collection on an owner.
  # @note this is almost the same as {kb.utils.wrappedModel} except that if the Model doesn't exist, it returns null.
  #
  # @overload wrappedObject(obj)
  #   Gets the observable from an object
  #   @param [Object|kb.ViewModel|kb.CollectionObservable] obj owner the ViewModel/CollectionObservable owning the kb.Model or kb.Collection.
  #   @return [Model|Collection] the model/collection
  # @overload wrappedObject(obj, value)
  #   Sets the observable on an object
  #   @param [Object|kb.ViewModel|kb.CollectionObservable] obj owner the ViewModel/CollectionObservable owning the kb.Model or kb.Collection.
  #   @param [Model|Collection] value the model/collection
  #
  # @example
  #   var model = kb.utils.wrappedObject(view_model);
  #   var collection = kb.utils.wrappedObject(collection_observable);
  @wrappedObject = (obj, value)               -> return _wrappedKey.apply(@, _argumentsAddKey(arguments, 'object'))

  # Dual-purpose getter/setter for retrieving and storing the Model on a ViewModel.
  # @note this is almost the same as {kb.utils.wrappedObject} except that if the Model doesn't exist, it returns the ViewModel itself (which is useful behaviour for sorting because it you can iterate over a kb.CollectionObservable's ko.ObservableArray whether it holds ViewModels or Models with the models_only option).
  #
  # @overload wrappedModel(view_model)
  #   Gets the model from a ViewModel
  #   @param [Object|kb.ViewModel] view_model the owning ViewModel for the Model.
  #   @return [Model|ViewModel] the Model or ViewModel itself if there is no Model
  # @overload wrappedModel(view_model, model)
  #   Sets the observable on an object
  #   @param [Object|kb.ViewModel] view_model the owning ViewModel for the Model.
  #   @param [Model] model the Model
  @wrappedModel = (obj, value) ->
    # get
    if (arguments.length is 1)
      value = _wrappedKey(obj, 'object')
      return if _.isUndefined(value) then obj else value
    else
      return _wrappedKey(obj, 'object', value)

  # Dual-purpose getter/setter for retrieving and storing a kb.Store on an owner.
  #
  # @overload wrappedStore(obj)
  #   Gets the store from an object
  #   @param [Any] obj the owner
  #   @return [kb.Store] the store
  # @overload wrappedStore(obj, store)
  #   Sets the store on an object
  #   @param [Any] obj the owner
  #   @param [kb.Store] store the store
  #
  # @example
  #   var co = kb.collectionObservable(new Backbone.Collection());
  #   var co_selected_options = kb.collectionObservable(new Backbone.Collection(), {
  #     store: kb.utils.wrappedStore(co)
  #   });
  @wrappedStore = (obj, value)                -> return _wrappedKey.apply(@, _argumentsAddKey(arguments, 'store'))

  # @private
  @wrappedStoreIsOwned = (obj, value)         -> return _wrappedKey.apply(@, _argumentsAddKey(arguments, 'store_is_owned'))

  # Dual-purpose getter/setter for retrieving and storing a kb.Factory on an owner.
  #
  # @overload wrappedFactory(obj)
  #   Gets the factory from an object
  #   @param [Any] obj the owner
  #   @return [kb.Factory] the factory
  # @overload wrappedFactory(obj, factory)
  #   Sets the factory on an object
  #   @param [Any] obj the owner
  #   @param [kb.Factory] factory the factory
  @wrappedFactory = (obj, value)              -> return _wrappedKey.apply(@, _argumentsAddKey(arguments, 'factory'))

  # Dual-purpose getter/setter for retrieving and storing a kb.EventWatcher on an owner.
  #
  # @overload wrappedEventWatcher(obj)
  #   Gets the event_watcher from an object
  #   @param [Any] obj the owner
  #   @return [kb.EventWatcher] the event_watcher
  # @overload wrappedEventWatcher(obj, event_watcher)
  #   Sets the event_watcher on an object
  #   @param [Any] obj the owner
  #   @param [kb.EventWatcher] event_watcher the event_watcher
  @wrappedEventWatcher = (obj, value)         -> return _wrappedKey.apply(@, _argumentsAddKey(arguments, 'event_watcher'))

  # @private
  @wrappedEventWatcherIsOwned = (obj, value)  -> return _wrappedKey.apply(@, _argumentsAddKey(arguments, 'event_watcher_is_owned'))

  # Clean up function that releases all of the wrapped values on an owner.
  @wrappedDestroy = (obj) ->
    return unless obj.__kb
    obj.__kb.event_watcher.releaseCallbacks(obj) if obj.__kb.event_watcher
    __kb = obj.__kb; obj.__kb = null # clear now to break cycles
    if __kb.observable
      __kb.observable.destroy = __kb.observable.release = null
      @wrappedDestroy(__kb.observable)
      __kb.observable = null
    __kb.factory = null
    __kb.event_watcher.destroy() if __kb.event_watcher_is_owned # release the event_watcher
    __kb.event_watcher = null
    __kb.store.destroy() if __kb.store_is_owned # release the store
    __kb.store = null
    # kb.release(__kb, true) # release everything that remains

  # Retrieves the value stored in a ko.observable.
  #
  # @see kb.Observable valueType
  #
  # @example
  #   var view_model = kb.viewModel(new Model({simple_attr: null, model_attr: null}), {factories: {model_attr: kb.ViewModel});
  #   kb.utils.valueType(view_model.simple_attr); // kb.TYPE_SIMPLE
  #   kb.utils.valueType(view_model.model_attr);  // kb.TYPE_MODEL
  @valueType = (observable) ->
    return KB_TYPE_UNKNOWN        unless observable
    return observable.valueType() if observable.__kb_is_o
    return KB_TYPE_COLLECTION     if observable.__kb_is_co or (observable instanceof kb.Collection)
    return KB_TYPE_MODEL          if (observable instanceof kb.ViewModel) or (observable instanceof kb.Model)
    return KB_TYPE_ARRAY          if _.isArray(observable)
    return KB_TYPE_SIMPLE

  # Helper to join a dot-deliminated path.
  #
  # @param [String] path1 start path.
  # @param [String] path2 append path.
  # @return [String] combined dot-delimited path.
  #
  # @example
  #   kb.utils.pathJoin('models', 'name'); // 'models.name'
  @pathJoin = (path1, path2) ->
    return (if path1 then (if path1[path1.length-1] isnt '.' then "#{path1}." else path1) else '') + path2

  # Helper to join a dot-deliminated path with the path on options and returns a new options object with the result.
  #
  # @param [Object] options with path property for the start path
  # @param [String] path append path.
  # @return [Object] new options with combined dot-delimited path `{path: combined_path}`.
  #
  # @example
  #   this.friends = kb.collectionObservable(model.get('friends'), kb.utils.optionsPathJoin(options, 'friends'));
  @optionsPathJoin = (options, path) ->
    return _.defaults({path: @pathJoin(options.path, path)}, options)

  # Helper to find the creator constructor or function from a factory or Backbone.RelationalModel or by the value's type.
  @inferCreator = (value, factory, path, owner, key) ->
    creator = factory.creatorForPath(value, path) if factory
    return creator if creator

    # infer Backbone.Relational types
    if owner and kb.Backbone and kb.Backbone.RelationalModel and (owner instanceof kb.Backbone.RelationalModel)
      key = _unwrapObservable(key)
      relation = _.find(owner.getRelations(), (test) -> return test.key is key)
      if relation
        return if (relation.collectionType or _.isArray(relation.keyContents)) then kb.CollectionObservable else kb.ViewModel

    # try fallbacks
    return null                         unless value
    return kb.ViewModel                 if value instanceof kb.Model
    return kb.CollectionObservable      if value instanceof kb.Collection
    return null

  # Creates an observable based on a value's type.
  @createFromDefaultCreator = (obj, options) ->
    return kb.viewModel(obj, options)                   if obj instanceof kb.Model
    return kb.collectionObservable(obj, options)        if obj instanceof kb.Collection
    return ko.observableArray(obj)                      if _.isArray(obj)
    return ko.observable(obj)

  # Helper to check an object for having a Model signature. For example, locale managers and ModelRef don't need to derive from Model
  #
  # @param [Object] obj the object to test
  #
  # @example
  #   kb.utils.hasModelSignature(new Model());
  @hasModelSignature = (obj) ->
    return obj and (obj.attributes and not obj.models) and (typeof(obj.get) is 'function') and (typeof(obj.trigger) is 'function')

  # Helper to check an object for having a Model signature. For example, locale managers and ModelRef don't need to derive from Model
  #
  # @param [Object] obj the object to test
  #
  # @example
  #   kb.utils.hasModelSignature(new Model());
  @hasCollectionSignature = (obj) ->
    return obj and obj.models and (typeof(obj.get) is 'function') and (typeof(obj.trigger) is 'function')