###
  knockback.js 0.15.0
  (c) 2011 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
###
throw new Error('Knockback: Dependency alert! Knockout.js must be included before this file') if not this.ko
throw new Error('Knockback: Dependency alert! Backbone.js must be included before this file') if not this.Backbone
throw new Error('Knockback: Dependency alert! Underscore.js must be included before this file') if not this._ or not this._.VERSION

# define namspaces
this.Knockback||this.Knockback={}; this.kb||this.kb=this.Knockback

# Current version.
Knockback.VERSION = '0.15.0'

# Locale Manager - if you are using localization, set this property.
# It must have Backbone.Events mixed in and implement a get method like Backbone.Model, eg. get: (attribute_name) -> return somthing
Knockback.locale_manager

# utilities
Knockback.utils = {}

# displays legacy warnings to the Knockback library user
Knockback.utils.legacyWarning = (identifier, message) ->
  kb._legacy_warnings or= {}
  kb._legacy_warnings[identifier] or= 0
  kb._legacy_warnings[identifier]++
  console.warn("Legacy warning! '#{identifier}' has been deprecated. #{message}")

Knockback.utils.wrappedObservable = (instance, observable) ->
  # get
  if (arguments.length == 1)
    throw new Error('Knockback: instance is not wrapping an observable') unless instance and instance.__kb and instance.__kb.observable
    return instance.__kb.observable

  # set
  throw new Error('Knockback: no instance for wrapping a observable') unless instance
  instance.__kb or= {}
  instance.__kb.observable.instance = null if instance.__kb.observable
  instance.__kb.observable = observable
  instance.__kb.observable.instance = instance if observable
  return observable

Knockback.utils.observableInstanceOf = (observable, type) ->
  return false unless observable.instance
  return (observable.instance instanceof type)

Knockback.utils.wrappedModel = (instance, model) ->
  # get
  if (arguments.length == 1)
    return if (instance and instance.__kb and instance.__kb.hasOwnProperty('model')) then instance.__kb.model else instance

  # set
  throw new Error('Knockback: no instance for wrapping a model') unless instance
  instance.__kb or= {}
  instance.__kb.model = model
  return model

Knockback.viewModelGetModel = Knockback.vmModel = (instance) ->  # LEGACY
  kb.utils.legacyWarning('kb.vmModel', 'Please use kb.utils.wrappedModel instead')
  return kb.utils.wrappedModel(instance)

Knockback.utils.setToDefault = (obj) ->
  return unless obj

  # observable
  if ko.isObservable(obj)
    obj.setToDefault?()

  # view model
  else if _.isObject(obj)
    (kb.utils.setToDefault(observable) if observable and (key != '__kb')) for key, observable of obj

Knockback.vmSetToDefault = (view_model) ->
  kb.utils.legacyWarning('kb.vmSetToDefault', 'Please use kb.utils.release instead')
  kb.utils.setToDefault(view_model)

Knockback.utils.release = (obj) ->
  # known type
  if ko.isObservable(obj) or (obj instanceof kb.Observables) or (obj instanceof kb.ViewModel_RCBase)
    if obj.release
      obj.release()
    else if obj.destroy
      obj.destroy()
    else if obj.dispose
      obj.dispose()
    else
      return false
    return true # was released

  # view model
  else if not _.isFunction(obj)
    for key, value of obj
      continue if !value or (key == '__kb')
      obj[key] = null if kb.utils.release(value)

    return true

Knockback.utils.vmRelease = (view_model) ->
  kb.utils.legacyWarning('kb.vmRelease', 'Please use kb.utils.release instead')
  return kb.utils.release(view_model)

Knockback.utils.vmReleaseObservable = (observable) ->
  kb.utils.legacyWarning('kb.vmReleaseObservable', 'Please use kb.utils.release instead')
  return kb.utils.release(observable)

# LEGACY support
for key, fn of Knockback.utils
  Knockback[key] = ->
    kb.utils.legacyWarning("kb.#{key}", "Please use kb.utils.#{key} instead")
    return kb.utils[key].apply(null, arguments)
