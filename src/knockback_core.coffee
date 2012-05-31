###
  knockback.js 0.15.3
  (c) 2011 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
###

# export or create Knockback namespace and kb alias
Knockback = kb = @Knockback = @kb = if (typeof(exports) != 'undefined') then exports else {}

# Current version.
kb.VERSION = '0.15.3'

# import Underscore, Backbone, and Knockout
_ = if not @_ and (typeof(require) != 'undefined') then require('underscore') else @_
Backbone = if not @Backbone and (typeof(require) != 'undefined') then require('backbone') else @Backbone
ko = if not @ko and (typeof(require) != 'undefined') then require('knockout') else @ko

# Locale Manager - if you are using localization, set this property.
# It must have Backbone.Events mixed in and implement a get method like Backbone.Model, eg. get: (attribute_name) -> return somthing
kb.locale_manager

# stats
kb.stats = {collection_observables: 0, view_models: 0}
kb.stats_on = false

# utilities
kb.utils = {}

# displays legacy warnings to the Knockback library user
kb.utils.legacyWarning = (identifier, remove_version, message) ->
  kb._legacy_warnings or= {}
  kb._legacy_warnings[identifier] or= 0
  kb._legacy_warnings[identifier]++
  console.warn("Legacy warning! '#{identifier}' has been deprecated (will be removed in Knockback #{remove_version}). #{message}.")

kb.utils.wrappedObservable = (instance, observable) ->
  # get
  if (arguments.length == 1)
    throw 'Knockback: instance is not wrapping an observable' unless instance and instance.__kb and instance.__kb.observable
    return instance.__kb.observable

  # set
  throw 'Knockback: no instance for wrapping a observable' unless instance
  instance.__kb or= {}
  instance.__kb.observable.__kb.instance = null if instance.__kb.observable and instance.__kb.observable.__kb
  instance.__kb.observable = observable
  if observable
    observable.__kb or= {}
    observable.__kb.instance = instance
  return observable

kb.wrappedObservable = (instance) ->  # LEGACY
  kb.utils.legacyWarning('kb.wrappedObservable', '0.16.0', 'Please use kb.utils.wrappedObservable instead')
  return kb.utils.wrappedObservable(instance)

kb.utils.observableInstanceOf = (observable, type) ->
  return false unless observable
  return false unless observable.__kb and observable.__kb.instance
  return (observable.__kb.instance instanceof type)

kb.utils.wrappedModel = (view_model, model) ->
  # get
  if (arguments.length == 1)
    return if (view_model and view_model.__kb and view_model.__kb.hasOwnProperty('model')) then view_model.__kb.model else view_model

  # set
  throw 'Knockback: no view_model for wrapping a model' unless view_model
  view_model.__kb or= {}
  view_model.__kb.model = model
  return model

kb.viewModelGetModel = kb.vmModel = (view_model) ->  # LEGACY
  kb.utils.legacyWarning('kb.vmModel', '0.16.0', 'Please use kb.utils.wrappedModel instead')
  return kb.utils.wrappedModel(view_model)

kb.utils.setToDefault = (obj) ->
  return unless obj

  # observable
  if ko.isObservable(obj)
    obj.setToDefault?()

  # view model
  else if _.isObject(obj)
    (kb.utils.setToDefault(observable) if observable and (key != '__kb')) for key, observable of obj

kb.vmSetToDefault = (view_model) ->
  kb.utils.legacyWarning('kb.vmSetToDefault', '0.16.0', 'Please use kb.utils.release instead')
  kb.utils.setToDefault(view_model)

kb.utils.release = (obj, keys_only) ->
  return false unless obj

  # known type
  if not keys_only and (ko.isObservable(obj) or (obj instanceof kb.Observables) or (typeof(obj.release) == 'function') or (typeof(obj.destroy) == 'function'))
    if obj.release
      obj.release()
    else if obj.destroy
      obj.destroy()
    else if obj.dispose
      obj.dispose()

    return true # was released

  # view model
  else if _.isObject(obj) and not (typeof(obj) == 'function')
    for key, value of obj
      continue if !value or (key == '__kb')
      obj[key] = null if kb.utils.release(value)

    return true # was released

  return false

kb.vmRelease = (view_model) ->
  kb.utils.legacyWarning('kb.vmRelease', '0.16.0', 'Please use kb.utils.release instead')
  return kb.utils.release(view_model)

kb.vmReleaseObservable = (observable) ->
  kb.utils.legacyWarning('kb.vmReleaseObservable', '0.16.0', 'Please use kb.utils.release instead')
  return kb.utils.release(observable)

kb.utils.optionsCreateClear = (options) ->
  delete options['create']
  delete options['children']
  delete options['view_model']
  delete options['view_model_create']

kb.utils.optionsCreateOverride = (options, create_options) ->
  kb.utils.optionsCreateClear(options)
  return _.extend(options, create_options)