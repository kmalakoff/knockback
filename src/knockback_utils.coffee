###
  knockback_utils.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
###

# utilities namespace
kb.utils = {}

kb.utils.wrappedDestroy = (obj) ->
  return unless obj.__kb
  obj.__kb.model_watcher.releaseCallbacks(obj) if obj.__kb.model_watcher
  __kb = obj.__kb; obj.__kb = null # clear now to break cycles
  if __kb.observable
    __kb.observable.destroy = __kb.observable.release = null
    kb.utils.wrappedDestroy(__kb.observable)
    __kb.observable = null
  __kb.factory = null
  __kb.model_watcher.destroy() if __kb.model_watcher_is_owned # release the model_watcher
  __kb.model_watcher = null
  __kb.store.destroy() if __kb.store_is_owned # release the store
  __kb.store = null
  # kb.release(__kb, true) # release everything that remains

wrappedKey = (obj, key, value) ->
  # get
  if arguments.length is 2
    return if (obj and obj.__kb and obj.__kb.hasOwnProperty(key)) then obj.__kb[key] else undefined

  # set
  obj or throwUnexpected(this, "no obj for wrapping #{key}")
  obj.__kb or= {}
  obj.__kb[key] = value
  return value

argumentsAddKey = (args, key) ->
  arraySplice.call(args, 1, 0, key)
  return args

kb.utils.wrappedModel = (obj, value) ->
  # get
  if (arguments.length is 1)
    value = wrappedKey(obj, 'object')
    return if _.isUndefined(value) then obj else value
  else
    return wrappedKey(obj, 'object', value)

kb.utils.wrappedObservable = (obj, value)           -> return wrappedKey.apply(@, argumentsAddKey(arguments, 'observable'))
kb.utils.wrappedObject = (obj, value)               -> return wrappedKey.apply(@, argumentsAddKey(arguments, 'object'))
kb.utils.wrappedStore = (obj, value)                -> return wrappedKey.apply(@, argumentsAddKey(arguments, 'store'))
kb.utils.wrappedStoreIsOwned = (obj, value)         -> return wrappedKey.apply(@, argumentsAddKey(arguments, 'store_is_owned'))
kb.utils.wrappedFactory = (obj, value)              -> return wrappedKey.apply(@, argumentsAddKey(arguments, 'factory'))
kb.utils.wrappedModelWatcher = (obj, value)         -> return wrappedKey.apply(@, argumentsAddKey(arguments, 'model_watcher'))
kb.utils.wrappedModelWatcherIsOwned = (obj, value)  -> return wrappedKey.apply(@, argumentsAddKey(arguments, 'model_watcher_is_owned'))

kb.utils.setToDefault = (obj) ->
  return unless obj

  # observable
  if ko.isObservable(obj)
    obj.setToDefault?()

  # view model
  else if _.isObject(obj)
    for key, value of obj
      kb.utils.setToDefault(value) if value and (ko.isObservable(value) or (typeof(value) isnt 'function')) and ((key[0] isnt '_') or key.search('__kb'))
  return obj

kb.utils.release = (obj) ->
  legacyWarning('kb.utils.release', '0.16.0', 'Please use kb.release instead')
  return kb.release(obj)

kb.utils.valueType = (observable) ->
  return KB_TYPE_UNKNOWN        unless observable 
  return observable.valueType() if observable.__kb_is_o
  return KB_TYPE_COLLECTION     if observable.__kb_is_co or (observable instanceof Backbone.Collection)
  return KB_TYPE_MODEL          if (observable instanceof kb.ViewModel) or (observable instanceof Backbone.Model)
  return KB_TYPE_ARRAY          if _.isArray(observable)
  return KB_TYPE_SIMPLE

kb.utils.pathJoin = (path1, path2) ->
  return (if path1 then (if path1[path1.length-1] isnt '.' then "#{path1}." else path1) else '') + path2

kb.utils.optionsPathJoin = (options, path) ->
  return _.defaults({path: kb.utils.pathJoin(options.path, path)}, options)

kb.utils.inferCreator = (value, factory, path, owner, key) ->
  creator = factory.creatorForPath(value, path) if factory
  return creator if creator

  # infer Backbone.Relational types
  if owner and Backbone.RelationalModel and (owner instanceof Backbone.RelationalModel)
    key = ko.utils.unwrapObservable(key)
    relation = _.find(owner.getRelations(), (test) -> return test.key is key)
    if relation
      return if (relation.collectionType or _.isArray(relation.keyContents)) then kb.CollectionObservable else kb.ViewModel

  # try fallbacks
  return null                         unless value
  return kb.ViewModel                 if value instanceof Backbone.Model
  return kb.CollectionObservable      if value instanceof Backbone.Collection
  return null

kb.utils.createDefaultObservable = (obj, options) ->
  return kb.viewModel(obj, options)                   if obj instanceof Backbone.Model
  return kb.collectionObservable(obj, options)        if obj instanceof Backbone.Collection
  return ko.observableArray(obj)                      if _.isArray(obj)
  return ko.observable(obj)
