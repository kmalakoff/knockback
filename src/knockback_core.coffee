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

# displays legacy warnings to the Knockback library user
Knockback.legacyWarning = (identifier, message) ->
  kb._legacy_warnings or= {}
  kb._legacy_warnings[identifier] or= 0
  kb._legacy_warnings[identifier]++
  console.warn("Legacy warning! '#{identifier}' has been deprecated. #{message}")

# helpers
Knockback.unwrapObservable = (instance) ->
  throw new Error('Knockback: instance is not wrapping an observable') unless instance and instance.__kb.observable
  return instance.__kb.observable
Knockback.wrappedObservable = (instance) -> # LEGACY
  kb.legacyWarning('kb.wrappedObservable', 'Please use kb.unwrapObservable instead')
  return kb.unwrapObservable(instance)

Knockback.wrapModel = (instance, model) ->
  throw new Error('Knockback: no instance for wrapping a model') unless instance
  instance.__kb or= {}
  instance.__kb.model = model
Knockback.unwrapModel = (instance) ->
  return if (instance and instance.__kb and instance.__kb.model) then instance.__kb.model else instance
Knockback.viewModelGetModel = Knockback.vmModel = (instance) ->  # LEGACY
  kb.legacyWarning('kb.vmModel', 'Please use kb.unwrapModel instead')
  return kb.unwrapModel(instance)

Knockback.setToDefault = (observable) -> observable.setToDefault() if observable and observable.setToDefault
Knockback.vmSetToDefault = (view_model) -> kb.setToDefault(observable) for key, observable of view_model

Knockback.vmRelease = (view_model) ->
  (view_model.release(); return) if (view_model instanceof kb.ViewModel_RCBase)
  Knockback.vmReleaseObservables(view_model)

Knockback.vmReleaseObservables = (view_model, keys) ->
  for key, value of view_model
    continue if not value
    continue if not (ko.isObservable(value) or (value instanceof kb.Observables) or (value instanceof kb.ViewModel_RCBase))
    continue if keys and not _.contains(keys, key) # skip
    view_model[key] = null
    kb.vmReleaseObservable(value)

Knockback.vmReleaseObservable = (observable) ->
  return if not (ko.isObservable(observable) or (observable instanceof kb.Observables) or (observable instanceof kb.ViewModel_RCBase))
  if observable.release
    observable.release()
  else if observable.destroy
    observable.destroy()
  else if observable.dispose
    observable.dispose()