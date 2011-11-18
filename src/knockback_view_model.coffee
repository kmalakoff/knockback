###
  knockback_view_model.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###
throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file') if not @Knockback

####################################################
# options
#   * read_only - default is read_write
####################################################

class Knockback.ViewModel
  constructor: (@model, @options={}, @view_model) ->
    @ref_count = 1
    throw new Error('ViewModel: model is missing') if not @model
    throw new Error('ViewModel: model cannot be a Backbone.ModelRef because the atrributes may not be laoded') if Backbone.ModelRef and (@model instanceof Backbone.ModelRef)

    _.bindAll(this, '_onModelChange')
    @model.bind('change', @_onModelChange)
    @view_model = this if not @view_model

    @_updateAttributeObservor(@model, key) for key of @model.attributes

  _destroy: ->
    kb.vmDestroyObservables(@view_model, if (@view_model != this) then _.keys(@model.attributes) else undefined); @view_model = null
    @model.unbind('change', @_onModelChange); @model = null

  # reference counting
  retain: ->
    throw new Error("ViewModel: ref_count is corrupt: " + @ref_count) if (@ref_count <= 0)
    @ref_count++
    return this

  release: ->
    throw new Error("ViewModel: ref_count is corrupt: " + @ref_count) if (@ref_count <= 0)
    @ref_count--
    @_destroy(this) if (@ref_count == 0)
    return this

  refCount: -> return @ref_count

  ####################################################
  # Internal
  ####################################################
  _onModelChange: ->
    return if not @model._changed
    (@_updateAttributeObservor(@model, key) if @model.hasChanged(key)) for key of @model.attributes

  _updateAttributeObservor: (model, key) ->
    if (@view_model.hasOwnProperty(key))
      @view_model[key](model.get(key))
    else
      @view_model[key] = kb.attributeConnector(model, key, @options.read_only)

# factory function
Knockback.viewModel = (model, options, view_model) -> return new Knockback.ViewModel(model, options, view_model)