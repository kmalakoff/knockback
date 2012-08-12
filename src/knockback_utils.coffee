###
  knockback_utils.js 0.16.0.pre
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
kb.utils.legacyWarning = (identifier, remove_version, message) ->
  kb._legacy_warnings or= {}
  kb._legacy_warnings[identifier] or= 0
  kb._legacy_warnings[identifier]++
  console.warn("warning: '#{identifier}' has been deprecated (will be removed in Knockback #{remove_version}). #{message}.")

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

kb.utils.observableInstanceOf = (observable, type) ->
  return true if (observable instanceof type)
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

kb.utils.pathJoin = (path1, path2) ->
  if not path1
    path = ''
  else
    path = if path1[path1.length-1] isnt '.' then "#{path1}." else path1
  path += path2
  return path