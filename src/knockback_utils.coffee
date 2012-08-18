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

# displays legacy warnings to the Knockback library user
kb.utils.legacyWarning = (identifier, last_version, message) ->
  kb._legacy_warnings or= {}
  kb._legacy_warnings[identifier] or= 0
  kb._legacy_warnings[identifier]++
  console.warn("warning: '#{identifier}' has been deprecated (will be removed in Knockback after #{last_version}). #{message}.")

kb.utils.throwMissing = (instance, message) ->
  throw "#{instance.constructor.name}: #{message} is missing"

kb.utils.throwUnexpected = (instance, message) ->
  throw "#{instance.constructor.name}: #{message} is unexpected"

kb.utils.wrappedDestroy = (owner) ->
  return unless owner.__kb
  owner.__kb.model_observable.destroy() if owner.__kb.model_observable
  __kb = owner.__kb; owner.__kb = null # clear now to break cycles
  kb.utils.release(__kb.value_observable) if __kb.value_observable and not __kb.store # release the value observable
  if __kb.observable
    kb.utils.wrappedDestroy(__kb.observable)
    __kb.observable.dispose() if __kb.observable.dispose # dispose
  __kb.store.destroy() if __kb.store_is_owned # release the store

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
    obj = kb.utils.wrappedByKey(observable, 'obj')
    return if _.isUndefined(obj) then observable else obj
  else
    return kb.utils.wrappedByKey(observable, 'obj', value)

kb.utils.wrappedObject = (observable, value)          -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'obj') else kb.utils.wrappedByKey(observable, 'obj', value)
kb.utils.wrappedStore = (observable, value)           -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'store') else kb.utils.wrappedByKey(observable, 'store', value)
kb.utils.wrappedStoreIsOwned = (observable, value)    -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'store_is_owned') else kb.utils.wrappedByKey(observable, 'store_is_owned', value)
kb.utils.wrappedFactory = (observable, value)         -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'factory') else kb.utils.wrappedByKey(observable, 'factory', value)
kb.utils.wrappedPath = (observable, value)            -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'path') else kb.utils.wrappedByKey(observable, 'path', value)
kb.utils.wrappedModelObservable = (observable, value) -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'model_observable') else kb.utils.wrappedByKey(observable, 'model_observable', value)

kb.utils.setToDefault = (obj) ->
  return unless obj

  # observable
  if ko.isObservable(obj)
    obj.setToDefault?()

  # view model
  else if _.isObject(obj)
    (kb.utils.setToDefault(observable) if observable and (key != '__kb')) for key, observable of obj

kb.utils.release = (obj, keys_only) ->
  return false unless obj

  # known type
  if not keys_only and (ko.isObservable(obj) or (obj instanceof kb.Observables) or (typeof(obj.release) is 'function') or (typeof(obj.destroy) is 'function'))
    if obj.release
      obj.release()
    else if obj.destroy
      obj.destroy()
    else if obj.dispose
      obj.dispose()

    return true # was released

  # view model
  else if _.isObject(obj) and not (typeof(obj) is 'function')
    for key, value of obj
      continue if !value or (key is '__kb') or ((typeof(value) is 'function') and not ko.isObservable(value))
      obj[key] = null if kb.utils.release(value)

    return true # was released

  return false

kb.utils.valueType = (observable) ->
  return kb.TYPE_UNKNOWN unless observable 
  return kb.TYPE_MODEL if observable instanceof kb.ViewModel
  unless (observable.__kb and observable.__kb.instance)
    return kb.TYPE_MODEL if observable instanceof Backbone.Model
    return kb.TYPE_COLLECTION if observable instanceof Backbone.Collection
    return kb.TYPE_SIMPLE 
  instance = observable.__kb.instance
  return observable.valueType() if instance instanceof kb.DynamicObservable
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

kb.utils.attributeHasChanged = (model, key) ->
  return false unless model

  # COMPATIBILITY: pre-Backbone-0.9.2 changed attributes hash
  return model.hasChanged(key) if model._changed

  # COMPATIBILITY: post-Backbone-0.9.2 changed attributes hash
  return model.changed.hasOwnProperty(key)