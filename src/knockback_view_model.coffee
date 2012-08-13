###
  knockback_view_model.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

####################################################
# options
#   * internals - an array of atttributes that should be scoped with an underscore, eg. name -> _name
#       internals can be used to ensure a required attribute observable exists for later use, eg. for a lazy loaded model
#   * requires - an array of atttributes that should be stubbed out if they don't exist on the model
#       used to ensure a required attribute observable exists for later use, eg. for a lazy loaded model
#   * TODO: update documentation....children - use to provide a view_model or create or create function per model attribute
####################################################

class kb.ViewModel extends kb.RefCountable
  constructor: (model, options={}) ->
    super

    kb.stats.view_models++ if kb.stats_on        # collect memory management statistics

    # always use a store to ensure recursive view models are handled correctly
    if options.store
      @__kb.store = options.store
      @__kb.store.registerObservable(model, this, options)
    else
      @__kb.store = new kb.Store(); @__kb.store_is_owned = true

    # view model factory
    @__kb.factory = new kb.Factory(options.path, options.factory)
    @__kb.factory.addPathMappings(options.mappings) if options.mappings

    @__kb._onModelChange = _.bind(@_onModelChange, @)
    @__kb._onModelLoaded = _.bind(@_onModelLoaded, @)
    @__kb._onModelUnloaded = _.bind(@_onModelUnloaded, @)
    @__kb.internals = options.internals
    @__kb.requires = options.requires

    # wrap the model
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
    @_updateAttributeObservable(@__kb.model, key) for key in missing

  __destroy: ->
    model = @__kb.model; kb.utils.wrappedModel(this, null)
    @_modelUnbind(model)

    @__kb.store.destroy() if @__kb.store_is_owned; @__kb.store = null
    @__kb.factory = null
    kb.utils.release(this, true)
    super

    kb.stats.view_models-- if kb.stats_on        # collect memory management statistics

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
    @_updateAttributeObservable(@__kb.model, key) for key of model.attributes

  _onModelUnloaded: (model) ->
    @_modelUnbind(model)
    kb.utils.wrappedModel(this, null)
    @_updateAttributeObservable(null, key) for key of model.attributes

  _onModelChange: ->
    # COMPATIBILITY: pre-Backbone-0.9.2 changed attributes hash
    if @__kb.model._changed
      (@_updateAttributeObservable(@__kb.model, key) if @__kb.model.hasChanged(key)) for key of @__kb.model.attributes

    # COMPATIBILITY: post-Backbone-0.9.2 changed attributes hash
    else if @__kb.model.changed
      @_updateAttributeObservable(@__kb.model, key) for key of @__kb.model.changed

  _updateAttributeObservable: (model, key) ->
    vm_key = if @__kb.internals and _.contains(@__kb.internals, key) then '_' + key else key
    observable = @[vm_key]
    if observable
      return unless kb.utils.observableInstanceOf(observable, kb.AttributeObservable) # not something we created, skip
      if observable.model() isnt model
        observable.model(model)
      else
        observable.update()
    else
      @[vm_key] = kb.attributeObservable(model, key, {store: @__kb.store, factory: @__kb.factory, path: @__kb.factory.pathJoin(key)})

# factory function
kb.viewModel = (model, options) -> return new kb.ViewModel(model, options)