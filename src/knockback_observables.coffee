###
  knockback_observables.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observables is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class kb.Observables
  constructor: (model, mappings_info, view_model, options) ->
    throw 'Observables: model is missing' if not model
    throw 'Observables: mappings_info is missing' unless mappings_info and (_.isObject(mappings_info) or _.isArray(mappings_info))

    # wrap information
    @__kb or= {}
    if _.isArray(mappings_info)
      @__kb.mappings_info = {}
      @__kb.mappings_info[key] = {} for key in mappings_info
    else
      @__kb.mappings_info = mappings_info
    @__kb.view_model = if _.isUndefined(view_model) then this else view_model

    # fill in unspecified read attributes with supplied option
    if not _.isUndefined(options)
      for property_name, mapping_info of @__kb.mappings_info
        is_string = _.isString(mapping_info)

        mapping_info = {key: mapping_info} if is_string
        mapping_info.key = property_name unless mapping_info.hasOwnProperty('key') # infer the key
        @[property_name] = @__kb.view_model[property_name] = kb.observable(model, mapping_info, @__kb.view_model)

    else
      for property_name, mapping_info of @__kb.mappings_info
        mapping_info.key = property_name unless mapping_info.hasOwnProperty('key') # infer the key
        @[property_name] = @__kb.view_model[property_name] = kb.observable(model, mapping_info, @__kb.view_model)

  destroy: ->
    for property_name, mapping_info of @__kb.mappings_info
      @__kb.view_model[property_name].destroy() if @__kb.view_model[property_name]
      @__kb.view_model[property_name] = null
      @[property_name] = null
    kb.utils.wrappedDestroy(@)

  setToDefault: ->
    @__kb.view_model[property_name].setToDefault() for property_name, mapping_info of @__kb.mappings_info

# factory function
kb.observables = (model, mappings_info, view_model, options) -> return new kb.Observables(model, mappings_info, view_model, options)