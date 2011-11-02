###
  knockback_model_attribute_observables.js
  (c) 2011 Kevin Malakoff.
  Knockback.ModelAttributeObservables is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###
throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file') if not this.Knockback

class Knockback.ModelAttributeObservables
  constructor: (@model, @mappings_info, @view_model) ->
    throw new Error('ModelAttributeObservables: model is missing') if not @model
    throw new Error('ModelAttributeObservables: mappings_info is missing') if not @mappings_info

    (@view_model[view_model_property_name] = new Knockback.ModelAttributeObservable(@model, mapping_info, @view_model)) for view_model_property_name, mapping_info of @mappings_info
    return this

  destroy: ->
    (@view_model[view_model_property_name].destroy(); delete @view_model[view_model_property_name]) for view_model_property_name, mapping_info of @mappings_info; @view_model = null
    @mappings_info = null
    @model = null

  forceRefresh: ->
    @view_model[view_model_property_name].forceRefresh() for view_model_property_name, mapping_info of @mappings_info
