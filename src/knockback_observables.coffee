###
  knockback_observables.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observables is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class Knockback.Observables
  constructor: (model, mappings_info, view_model, options_or_read_only) ->
    throw new Error('Observables: model is missing') if not model
    throw new Error('Observables: mappings_info is missing') if not mappings_info or not _.isObject(mappings_info)

    @__kb or= {}
    @__kb.model = model
    @__kb.mappings_info = mappings_info
    @__kb.view_model = if _.isUndefined(view_model) then this else view_model

    # LEGACY
    if not _.isUndefined(options_or_read_only) and options_or_read_only.hasOwnProperty('write')
      kb.utils.legacyWarning('Knockback.Observables option.write', '0.16.0', 'Now default is writable so only supply read_only as required')
      options_or_read_only.read_only = !options_or_read_only.write
      delete options_or_read_only['write']

    # fill in unspecified read attributes with supplied option
    if not _.isUndefined(options_or_read_only)
      read_only = if _.isBoolean(options_or_read_only) then options_or_read_only else options_or_read_only.read_only
      for property_name, mapping_info of @__kb.mappings_info
        is_string = _.isString(mapping_info)

        if is_string
          mapping_info = if not _.isUndefined(read_only) then {key: mapping_info, read_only: read_only} else {key: mapping_info}
        else if not _.isUndefined(read_only) and not (mapping_info.hasOwnProperty('read_only') or mapping_info.hasOwnProperty('write'))
          mapping_info.read_only = read_only

        mapping_info.key = property_name unless mapping_info.hasOwnProperty('key') # infer the key
        @[property_name] = @__kb.view_model[property_name] = kb.observable(@__kb.model, mapping_info, @__kb.view_model)

    else
      for property_name, mapping_info of @__kb.mappings_info

        if mapping_info.hasOwnProperty('write') # LEGACY
          kb.utils.legacyWarning('Knockback.Observables option.write', '0.16.0', 'Now default is writable so only supply read_only as required')

        mapping_info.key = property_name unless mapping_info.hasOwnProperty('key') # infer the key
        @[property_name] = @__kb.view_model[property_name] = kb.observable(@__kb.model, mapping_info, @__kb.view_model)

  destroy: ->
    for property_name, mapping_info of @__kb.mappings_info
      @__kb.view_model[property_name].destroy() if @__kb.view_model[property_name]
      @__kb.view_model[property_name] = null
      @[property_name] = null
    @__kb.view_model = null
    @__kb.mappings_info = null
    @__kb.model = null

  setToDefault: ->
    @__kb.view_model[property_name].setToDefault() for property_name, mapping_info of @__kb.mappings_info

# factory function
Knockback.observables = (model, mappings_info, view_model, options) -> return new Knockback.Observables(model, mappings_info, view_model, options)