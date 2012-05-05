###
  knockback_view_model.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class Knockback.ViewModel_RCBase extends Knockback.RefCountable
  __destroy: ->
    for key, value of this
      continue if !value or (key == '__kb')
      @[key] = null if kb.utils.release(value)

####################################################
# options
#   * read_only - default is read_write
#   * internals - an array of atttributes that should be scoped with an underscore, eg. name -> _name
#       internals can be used to ensure a required attribute observable exists for later use, eg. for a lazy loaded model
#   * requires - an array of atttributes that should be stubbed out if they don't exist on the model
#       used to ensure a required attribute observable exists for later use, eg. for a lazy loaded model
#   * children - use to provide a view_model or view_model_create or create function per model attribute
####################################################

class Knockback.ViewModel extends Knockback.ViewModel_RCBase
  constructor: (model, options={}) ->
    super

    kb.stats.view_models++ if Knockback.stats_on        # collect memory management statistics

    # register ourselves to handle recursive view models
    kb.Store.resolveFromOptions(options, this)
    # always use a store to ensure recursive view models are handled correctly
    if options.__kb_store then (@__kb.store = options.__kb_store) else (@__kb.store = new kb.Store(); @__kb.store_is_owned = true)

    @__kb._onModelChange = _.bind(@_onModelChange, @)
    @__kb._onModelLoaded = _.bind(@_onModelLoaded, @)
    @__kb._onModelUnloaded = _.bind(@_onModelUnloaded, @)
    @__kb.internals = options.internals
    @__kb.requires = options.requires
    @__kb.children = options.children
    @__kb.create = options.create
    @__kb.read_only = options.read_only

    kb.utils.wrappedModel(this, model)

    # determine model or model_ref type
    if Backbone.ModelRef and (model instanceof Backbone.ModelRef)
      @__kb.model_ref = model; @__kb.model_ref.retain()
      kb.utils.wrappedModel(this, @__kb.model_ref.getModel())
      @__kb.model_ref.bind('loaded', @__kb._onModelLoaded)
      @__kb.model_ref.bind('unloaded', @__kb._onModelUnloaded)

    # start
    @_onModelLoaded(@__kb.model) if @__kb.model

    return @ if not @__kb.internals and not @__kb.requires
    missing = _.union((if @__kb.internals then @__kb.internals else []), (if @__kb.requires then @__kb.requires else []))
    missing = _.difference(missing, _.keys(@__kb.model.attributes)) if not @__kb.model_ref or @__kb.model_ref.isLoaded()
    @_updateAttributeConnector(@__kb.model, key) for key in missing

  __destroy: ->
    model = @__kb.model; kb.utils.wrappedModel(this, null)
    @_modelUnbind(model)

    @__kb.store.destroy() if @__kb.store_is_owned; @__kb.store = null
    super

    kb.stats.view_models-- if Knockback.stats_on        # collect memory management statistics

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
    @[vm_key] = kb.AttributeConnector.createOrUpdate(@[vm_key], model, key, @_createOptions(key))

  _createOptions: (key) ->
    if @__kb.children
      if @__kb.children.hasOwnProperty(key)
        options = @__kb.children[key]
        if (typeof(options) == 'function') # a view model short form for a view model
          options = {view_model: options}
        options.options = {read_only: @__kb.read_only, __kb_store: @__kb.store}
        return options
      else if @__kb.children.hasOwnProperty('create')
        return {create: @__kb.children.create, options:{read_only: @__kb.read_only, __kb_store: @__kb.store}}
    else if @__kb.create
      return {create: @__kb.create, options:{read_only: @__kb.read_only, __kb_store: @__kb.store}}

    return {read_only: @__kb.read_only, __kb_store: @__kb.store}

# factory function
Knockback.viewModel = (model, options) -> return new Knockback.ViewModel(model, options)