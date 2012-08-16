###
  knockback_utils.js 0.16.0beta1
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

kb.utils.wrappedDestroy = (owner) ->
  return unless owner.__kb
  __kb = owner.__kb; owner.__kb = null # clear now to break cycles
  kb.utils.wrappedModelRef(owner, null) if __kb.model_ref # clear the model ref (including unbinding)
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

kb.utils.observableInstanceOf = (observable, type) ->
  return false unless observable
  return false unless observable.__kb and observable.__kb.instance
  return (observable.__kb.instance instanceof type)

kb.utils.wrappedModel = (observable, value) ->
  # get
  if (arguments.length is 1)
    obj = kb.utils.wrappedByKey(observable, 'obj')
    return if _.isUndefined(obj) then observable else obj
  else
    return kb.utils.wrappedByKey(observable, 'obj', value)

kb.utils.wrappedModelRef = (observable, value, options) ->
  # get
  previous_value = kb.utils.wrappedByKey(observable, 'model_ref')
  if (arguments.length is 1)
    return previous_value

  # set, no change
  return value if value == previous_value

  value.retain() if value # retain now so not released from under us
  if previous_value
    previous_options = kb.utils.wrappedByKey(observable, 'model_ref_options')
    previous_value.unbind('loaded', previous_options.loaded) previous_options.loaded
    previous_value.unbind('unloaded', previous_options.unloaded) previous_options.unloaded
    previous_value.release()

  kb.utils.wrappedByKey(observable, 'model_ref', value)
  if value
    options = kb.utils.wrappedByKey(observable, 'model_ref_options', if options then options else {})
    value.bind('loaded', options.loaded) if options.loaded
    value.bind('unloaded', options.unloaded) if options.unloaded
  return value

kb.utils.wrappedObject = (observable, value)        -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'obj') else kb.utils.wrappedByKey(observable, 'obj', value)
kb.utils.wrappedStore = (observable, value)         -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'store') else kb.utils.wrappedByKey(observable, 'store', value)
kb.utils.wrappedStoreIsOwned = (observable, value)  -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'store_is_owned') else kb.utils.wrappedByKey(observable, 'store_is_owned', value)
kb.utils.wrappedFactory = (observable, value)       -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'factory') else kb.utils.wrappedByKey(observable, 'factory', value)
kb.utils.wrappedPath = (observable, value)          -> return if arguments.length is 1 then kb.utils.wrappedByKey(observable, 'path') else kb.utils.wrappedByKey(observable, 'path', value)

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

kb.utils.pathJoin = (path1, path2) ->
  if not path1
    path = ''
  else
    path = if path1[path1.length-1] isnt '.' then "#{path1}." else path1
  path += path2
  return path