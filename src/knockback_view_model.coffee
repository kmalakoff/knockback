###
  knockback_view_model.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###
throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file') if not @Knockback

class Knockback.ViewModel_RCBase extends Knockback.RefCountable
  __destroy: ->
    for key, value of this
      continue if !value or (key == '__kb')
      continue if not (ko.isObservable(value) or (value instanceof kb.Observables) or (value instanceof kb.ViewModel_RCBase))
      @[key] = null
      kb.utils.release(value)
    super

####################################################
# options
#   * read_only - default is read_write
#   * internals - an array of atttributes that should be scoped with an underscore, eg. name -> _name
#       internals can be used to ensure a required attribute observable exists for later use, eg. for a lazy loaded model
#   * requires - an array of atttributes that should be stubbed out if they don't exist on the model
#       used to ensure a required attribute observable exists for later use, eg. for a lazy loaded model
####################################################

class Knockback.ViewModel extends Knockback.ViewModel_RCBase
  constructor: (model, options={}) ->
    super

    # register ourselves to handle recursive view models
    @__kb.store = options.__kb_store || new kb.Store()
    @__kb.store.add(options.__kb_store_key, this) if options.__kb_store_key

    @__kb._onModelChange = _.bind(@_onModelChange, @)
    @__kb._onModelLoaded = _.bind(@_onModelLoaded, @)
    @__kb._onModelUnloaded = _.bind(@_onModelUnloaded, @)
    @__kb.internals = options.internals
    @__kb.requires = options.requires
    @__kb.read_only = options.read_only
    @__kb.children = options.children

    throw new Error('ViewModel: model is missing') unless model
    kb.utils.wrappedModel(this, model)

    # determine model or model_ref type
    if Backbone.ModelRef and (model instanceof Backbone.ModelRef)
      @__kb.model_ref = model; @__kb.model_ref.retain()
      kb.utils.wrappedModel(this, @__kb.model_ref.wrappedModel())
      @__kb.model_ref.bind('loaded', @__kb._onModelLoaded)
      @__kb.model_ref.bind('unloaded', @__kb._onModelUnloaded)

    # start
    @_onModelLoaded(@__kb.model) if not @__kb.model_ref or @__kb.model_ref.isLoaded()

    return @ if not @__kb.internals and not @__kb.requires
    missing = _.union((if @__kb.internals then @__kb.internals else []), (if @__kb.requires then @__kb.requires else []))
    missing = _.difference(missing, _.keys(@__kb.model.attributes)) if not @__kb.model_ref or @__kb.model_ref.isLoaded()
    @_updateAttributeConnector(@__kb.model, key) for key in missing

  __destroy: ->
    model = @__kb.model; kb.utils.wrappedModel(this, null)
    @_modelUnbind(model)
    @__kb.store = null
    super

  model: (new_model) ->
    model = kb.utils.wrappedModel(this)
    return model if (arguments.length == 0)

    # no change
    return if (new_model == model)

    @_onModelUnloaded(model) if model
    @_onModelLoaded(new_model) if new_model

  ####################################################
  # Internal
  ####################################################
  _modelBind: (model) ->
    return unless model
    model.bind('change', @__kb._onModelChange)
    if Backbone.RelationalModel and (model instanceof Backbone.RelationalModel)
      model.bind('add', @__kb._onModelChange)
      model.bind('remove', @__kb._onModelChange)
      model.bind('update', @__kb._onModelChange)

  _modelUnbind: (model) ->
    return unless model
    model.unbind('change', @__kb._onModelChange)
    if Backbone.RelationalModel and (model instanceof Backbone.RelationalModel)
      model.unbind('add', @__kb._onModelChange)
      model.unbind('remove', @__kb._onModelChange)
      model.unbind('update', @__kb._onModelChange)

  _onModelLoaded: (model) ->
    kb.utils.wrappedModel(this, model)
    @_modelBind(model)
    @_updateAttributeConnector(@__kb.model, key) for key of @__kb.model.attributes

  _onModelUnloaded: (model) ->
    @_modelUnbind(model)
    kb.utils.wrappedModel(this, null)
    @_updateAttributeConnector(null, key) for key of model.attributes

  _onModelChange: ->
    # COMPATIBILITY: pre-Backbone-0.9.2 changed attributes hash
    if @__kb.model._changed
      (@_updateAttributeConnector(@__kb.model, key) if @__kb.model.hasChanged(key)) for key of @__kb.model.attributes

    # COMPATIBILITY: post-Backbone-0.9.2 changed attributes hash
    else if @__kb.model.changed
      @_updateAttributeConnector(@__kb.model, key) for key of @__kb.model.changed

  _updateAttributeConnector: (model, key) ->
    vm_key = if @__kb.internals and _.contains(@__kb.internals, key) then '_' + key else key
    value = if model then model.get(key) else null

    # update an existing connector
    if (@hasOwnProperty(vm_key))
      attribute_connector = @[vm_key]
      throw new Error("Knockback.ViewModel: property '#{vm_key}' has been unexpectedly removed") unless attribute_connector
      if attribute_connector.model() != model
        attribute_connector.model(model)
      else
        attribute_connector.update()

    # create a new connector
    else
      if (value instanceof Backbone.Collection)
        @[vm_key] = kb.collectionAttributeConnector(model, key, {__kb_store: @__kb.store, __kb_store_key: value, view_model: @constructor})

      else if (value instanceof Backbone.Model) or (Backbone.ModelRef and (value instanceof Backbone.ModelRef))
        @[vm_key] = kb.viewModelAttributeConnector(model, key, {view_model: @constructor, options: {__kb_store: @__kb.store, __kb_store_key: value}})

      else
        @[vm_key] = kb.simpleAttributeConnector(model, key, {read_only: @__kb.read_only})

# factory function
Knockback.viewModel = (model, options) -> return new Knockback.ViewModel(model, options)