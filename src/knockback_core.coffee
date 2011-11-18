###
  knockback.js 0.11.0
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
Knockback.VERSION = '0.11.0'

# Locale Manager - if you are using localization, set this property.
# It must have Backbone.Events mixed in and implement a get method like Backbone.Model, eg. get: (attribute_name) -> return somthing
Knockback.locale_manager

# helpers
Knockback.wrappedObservable = (instance) ->
  throw new Error('Knockback: _kb_observable missing from your instance') if not instance._kb_observable
  return instance._kb_observable

Knockback.vmRelease = (view_model) ->
  (view_model.release(); return) if (view_model instanceof kb.ViewModel)
  Knockback.vmDestroyObservables(view_model)

Knockback.vmDestroyObservables = (view_model, keys) ->
  for key, observable of view_model
    do (key, observable) ->
      return if keys and not _.contains(keys, key) # skip
      return if not observable or not (ko.isObservable(observable) or (observable instanceof kb.Observables))
      if observable.destroy
        observable.destroy()
      else if observable.dispose
        observable.dispose()
      view_model[key] = null

Knockback.attributeConnector = (model, key, read_only) ->
  result = ko.observable(model.get(key))
  result.subscription = result.subscribe((value) ->
    if read_only
      value = model.get(key)
      return if result() == value
      result(value)
      throw "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters."
    set_info = {}; set_info[key] = value
    model.set(set_info)
  )
  return result