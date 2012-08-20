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

kb.utils.wrappedDestroy = (owner) ->
  return unless owner.__kb
  owner.__kb.model_observable.releaseCallbacks(owner) if owner.__kb.model_observable
  __kb = owner.__kb; owner.__kb = null # clear now to break cycles
  kb.utils.wrappedDestroy(__kb.observable) if __kb.observable
  __kb.factory = null
  __kb.model_observable.destroy() if __kb.model_observable_is_owned # release the model_observable
  __kb.model_observable = null
  __kb.store.destroy() if __kb.store_is_owned # release the store
  __kb.store = null
  kb.release(__kb, true) # release everything that remains

kb.utils.wrappedByKey = (owner, key, value) ->
  # get
  if arguments.length is 2
    return if (owner and owner.__kb and owner.__kb.hasOwnProperty(key)) then owner.__kb[key] else undefined

  # set
  throw "Knockback: no owner for wrapping #{key}" unless owner
  owner.__kb or= {}
  owner.__kb[key] = value
  return value

kb.utils.wrappedObservable = (instance, observable) ->
  # get
  return kb.utils.wrappedByKey(instance, 'observable') if arguments.length is 1

  # set
  kb.utils.wrappedByKey(instance, 'observable', observable)
  kb.utils.wrappedByKey(observable, 'instance', instance) if observable
  return observable

kb.utils.wrappedModel = (observable, value) ->
  # get
  if (arguments.length is 1)
    obj = kb.utils.wrappedByKey(observable, 'object')
    return if _.isUndefined(obj) then observable else obj
  else
    return kb.utils.wrappedByKey(observable, 'object', value)

kb.utils.wrappedObject = (observable, value)                  -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'object') else kb.utils.wrappedByKey(observable, 'object', value)
kb.utils.wrappedStore = (observable, value)                   -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'store') else kb.utils.wrappedByKey(observable, 'store', value)
kb.utils.wrappedStoreIsOwned = (observable, value)            -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'store_is_owned') else kb.utils.wrappedByKey(observable, 'store_is_owned', value)
kb.utils.wrappedFactory = (observable, value)                 -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'factory') else kb.utils.wrappedByKey(observable, 'factory', value)
kb.utils.wrappedPath = (observable, value)                    -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'path') else kb.utils.wrappedByKey(observable, 'path', value)
kb.utils.wrappedModelObservable = (observable, value)         -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'model_observable') else kb.utils.wrappedByKey(observable, 'model_observable', value)
kb.utils.wrappedModelObservableIsOwned = (observable, value)  -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'model_observable_is_owned') else kb.utils.wrappedByKey(observable, 'model_observable_is_owned', value)

kb.utils.setToDefault = (obj) ->
  return unless obj

  # observable
  if ko.isObservable(obj)
    obj.setToDefault?()

  # view model
  else if _.isObject(obj)
    (kb.utils.setToDefault(observable) if observable and (key != '__kb')) for key, observable of obj
  return obj

kb.utils.release = (obj, keys_only) ->
  kb.legacyWarning('kb.utils.release', '0.16.0', 'Please use kb.release instead')
  return kb.release(obj, keys_only)

kb.utils.valueType = (observable) ->
  return kb.TYPE_UNKNOWN unless observable 
  return kb.TYPE_MODEL if observable instanceof kb.ViewModel
  unless (observable.__kb and observable.__kb.instance)
    return kb.TYPE_MODEL if observable instanceof Backbone.Model
    return kb.TYPE_COLLECTION if observable instanceof Backbone.Collection
    return kb.TYPE_SIMPLE 
  instance = observable.__kb.instance
  return observable.valueType() if instance instanceof kb.Observable
  return kb.TYPE_COLLECTION if instance instanceof kb.CollectionObservable
  return kb.TYPE_SIMPLE

kb.utils.observableInstanceOf = (observable, type) ->
  return false unless observable
  return false unless observable.__kb and observable.__kb.instance
  return (observable.__kb.instance instanceof type)

kb.utils.pathJoin = (path1, path2) ->
  if not path1
    path = ''
  else
    path = if path1[path1.length-1] isnt '.' then "#{path1}." else path1
  path += path2
  return path

kb.utils.optionsPathJoin = (options, path) ->
  return _.defaults({path: kb.utils.pathJoin(options.path, path)}, options)