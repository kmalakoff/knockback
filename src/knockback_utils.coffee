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
  __kb.factory = null
  __kb.model_watcher.destroy() if __kb.model_watcher_is_owned # release the model_watcher
  __kb.model_watcher = null
  __kb.store.destroy() if __kb.store_is_owned # release the store
  __kb.store = null
  kb.release(__kb, true) # release everything that remains

kb.utils.wrappedKey = (obj, key, value) ->
  # get
  if arguments.length is 2
    return if (obj and obj.__kb and obj.__kb.hasOwnProperty(key)) then obj.__kb[key] else undefined

  # set
  obj or throwUnexpected(this, "no obj for wrapping #{key}")
  obj.__kb or= {}
  obj.__kb[key] = value
  return value

kb.utils.wrappedModel = (obj, value) ->
  # get
  if (arguments.length is 1)
    value = kb.utils.wrappedKey(obj, 'object')
    return if _.isUndefined(value) then obj else value
  else
    return kb.utils.wrappedKey(obj, 'object', value)

kb.utils.wrappedObservable = (obj, value)           -> arraySplice.call(arguments, 1, 0, 'observable');             return kb.utils.wrappedKey.apply(@, arguments)
kb.utils.wrappedObject = (obj, value)               -> arraySplice.call(arguments, 1, 0, 'object');                 return kb.utils.wrappedKey.apply(@, arguments)
kb.utils.wrappedStore = (obj, value)                -> arraySplice.call(arguments, 1, 0, 'store');                  return kb.utils.wrappedKey.apply(@, arguments)
kb.utils.wrappedStoreIsOwned = (obj, value)         -> arraySplice.call(arguments, 1, 0, 'store_is_owned');         return kb.utils.wrappedKey.apply(@, arguments)
kb.utils.wrappedFactory = (obj, value)              -> arraySplice.call(arguments, 1, 0, 'factory');                return kb.utils.wrappedKey.apply(@, arguments)
kb.utils.wrappedModelWatcher = (obj, value)         -> arraySplice.call(arguments, 1, 0, 'model_watcher');          return kb.utils.wrappedKey.apply(@, arguments)
kb.utils.wrappedModelWatcherIsOwned = (obj, value)  -> arraySplice.call(arguments, 1, 0, 'model_watcher_is_owned'); return kb.utils.wrappedKey.apply(@, arguments)

kb.utils.setToDefault = (obj) ->
  return unless obj

  # observable
  if ko.isObservable(obj)
    obj.setToDefault?()

  # view model
  else if _.isObject(obj)
    for key, observable of obj
      (kb.utils.setToDefault(observable) if observable and (key != '__kb'))
  return obj

kb.utils.release = (obj, keys_only) ->
  legacyWarning('kb.utils.release', '0.16.0', 'Please use kb.release instead')
  return kb.release(obj, keys_only)

kb.utils.valueType = (observable) ->
  return kb.TYPE_UNKNOWN        unless observable 
  return observable.valueType() if observable.__kb_is_o
  return kb.TYPE_COLLECTION     if observable.__kb_is_co or (observable instanceof Backbone.Collection)
  return kb.TYPE_MODEL          if (observable instanceof kb.ViewModel) or (observable instanceof Backbone.Model)
  return kb.TYPE_SIMPLE

kb.utils.pathJoin = (path1, path2) ->
  return (if path1 then (if path1[path1.length-1] isnt '.' then "#{path1}." else path1) else '') + path2

kb.utils.optionsPathJoin = (options, path) ->
  return _.defaults({path: kb.utils.pathJoin(options.path, path)}, options)