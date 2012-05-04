###
  knockback_observables.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observables is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class Knockback.Observables
  constructor: (@model, @mappings_info, @view_model, options_or_read_only) ->
    throw new Error('Observables: model is missing') if not @model
    throw new Error('Observables: mappings_info is missing') if not @mappings_info

    options_or_read_only.read_only = !options_or_read_only.write if options_or_read_only and options_or_read_only.hasOwnProperty('write') # LEGACY

    # fill in unspecified read attributes with supplied option
    if !!options_or_read_only and ((_.isBoolean(options_or_read_only) and !options_or_read_only) or !options_or_read_only.read_only)
      read_only = if _.isBoolean(options_or_read_only) then options_or_read_only else options_or_read_only.read_only
      for view_model_property_name, mapping_info of @mappings_info
        is_string = _.isString(mapping_info)
        if is_string or not mapping_info.hasOwnProperty('read_only') or not mapping_info.hasOwnProperty('write') # LEGACY
          mapping_info = if is_string then {key: mapping_info, read_only: read_only} else _.extend({read_only: read_only}, mapping_info)
        @[view_model_property_name] = @view_model[view_model_property_name] = kb.observable(@model, mapping_info, @view_model)

    else
      (@[view_model_property_name] = @view_model[view_model_property_name] = kb.observable(@model, mapping_info, @view_model)) for view_model_property_name, mapping_info of @mappings_info

  destroy: ->
    for view_model_property_name, mapping_info of @mappings_info
      @view_model[view_model_property_name].destroy() if @view_model[view_model_property_name]
      @view_model[view_model_property_name] = null
      @[view_model_property_name] = null
    @view_model = null
    @mappings_info = null
    @model = null

  setToDefault: ->
    @view_model[view_model_property_name].setToDefault() for view_model_property_name, mapping_info of @mappings_info

# factory function
Knockback.observables = (model, mappings_info, view_model, options) -> return new Knockback.Observables(model, mappings_info, view_model, options)