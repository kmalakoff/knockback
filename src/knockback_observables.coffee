###
  knockback_observables.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observables is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class kb.Observables
  constructor: (model, mappings_info, view_model) ->
    throw 'Observables: mappings_info is missing' unless mappings_info and (_.isObject(mappings_info) or _.isArray(mappings_info))

    # wrap information
    @__kb or= {}
    if _.isArray(mappings_info)
      @__kb.mappings_info = {}
      @__kb.mappings_info[key] = {} for key in mappings_info
    else
      @__kb.mappings_info = mappings_info
    @__kb.view_model = if _.isUndefined(view_model) then this else view_model

    # set up
    model_observable = kb.utils.wrappedModelObservable(@, new kb.ModelObservable(model, @, {model: _.bind(@model, @)}))

    # fill in unspecified read attributes with supplied options
    for key, mapping_info of @__kb.mappings_info
      mapping_info.key = key unless mapping_info.hasOwnProperty('key') # infer the key
      mapping_info.model_observable = model_observable
      @[key] = @__kb.view_model[key] = kb.observable(model, mapping_info, @__kb.view_model)

  destroy: ->
    for key, mapping_info of @__kb.mappings_info
      @[key].destroy() if @[key] and @[key].__kb # not yet released
      @[key] = @__kb.view_model[key] = null
    kb.utils.wrappedDestroy(@)

  setToDefault: ->
    for key, mapping_info of @__kb.mappings_info
      @[key].setToDefault() if typeof(@[key].setToDefault) == 'function'
    @

  model: (new_model) ->
    model = kb.utils.wrappedObject(@)
    return model if (arguments.length == 0) or (model is new_model) # get or no change
    model = kb.utils.wrappedObject(@, new_model)
    return unless model # no model
    model_observable = kb.utils.wrappedModelObservable(@)
    return new_model unless model_observable # not yet initialized
    model_observable.model(model) # sync with model_observable

# factory function
kb.observables = (model, mappings_info, view_model) -> return new kb.Observables(model, mappings_info, view_model)