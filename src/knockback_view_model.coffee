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

    kb.statistics.register('kb.ViewModel', @) if kb.statistics     # collect memory management statistics

    # always use a store to ensure recursive view models are handled correctly
    kb.Store.registerOrCreateStoreFromOptions(model, @, options)

    # view model factory
    factory = kb.utils.wrappedFactory(@, new kb.Factory(options.factory))
    kb.utils.wrappedPath(@, options.path)
    factory.addPathMappings(options.mappings) if options.mappings

    # bind and extract options
    @__kb._onModelChange = _.bind(@_onModelChange, @)
    @__kb._onModelLoaded = _.bind(@_onModelLoaded, @)
    @__kb._onModelUnloaded = _.bind(@_onModelUnloaded, @)
    @__kb.internals = options.internals
    @__kb.requires = options.requires

    # determine model or model_ref type
    if Backbone.ModelRef and (model instanceof Backbone.ModelRef)
      kb.utils.wrappedModelRef(@, model, {loaded: @__kb._onModelLoaded, unloaded: @__kb._onModelUnloaded})
      model_ref = model; model =  model_ref.model()
    else
      kb.utils.wrappedObject(@, model)

    # start
    @_onModelLoaded(model) if model

    return @ if not @__kb.internals and not @__kb.requires
    missing = _.union((if @__kb.internals then @__kb.internals else []), (if @__kb.requires then @__kb.requires else []))
    missing = _.difference(missing, _.keys(model.attributes)) if not model_ref or model_ref.isLoaded()
    @_updateDynamicObservable(model, key) for key in missing

  __destroy: ->
    @_modelUnbind(kb.utils.wrappedObject(@))
    kb.utils.release(this, true) # release the observables
    kb.utils.wrappedDestroy(@)
    super

    kb.statistics.unregister('kb.ViewModel', @) if kb.statistics     # collect memory management statistics

  model: (new_model) ->
    model = kb.utils.wrappedObject(@)
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
    kb.utils.wrappedObject(@, model)
    @_modelBind(model)
    @_updateDynamicObservable(model, key) for key of model.attributes

  _onModelUnloaded: (model) ->
    @_modelUnbind(model)
    kb.utils.wrappedObject(@, null)
    @_updateDynamicObservable(null, key) for key of model.attributes

  _onModelChange: ->
    model = kb.utils.wrappedObject(@)

    # COMPATIBILITY: pre-Backbone-0.9.2 changed attributes hash
    if model._changed
      (@_updateDynamicObservable(model, key) if model.hasChanged(key)) for key of model.attributes

    # COMPATIBILITY: post-Backbone-0.9.2 changed attributes hash
    else if model.changed
      @_updateDynamicObservable(model, key) for key of model.changed

  _updateDynamicObservable: (model, key) ->
    vm_key = if @__kb.internals and _.contains(@__kb.internals, key) then '_' + key else key
    observable = @[vm_key]
    if observable
      if observable.model() isnt model
        observable.model(model)
      else
        observable.update()
    else
      @[vm_key] = kb.dynamicObservable(model, {key: key, store: kb.utils.wrappedStore(@), factory: kb.utils.wrappedFactory(@), path: kb.utils.wrappedPath(@)})

# factory function
kb.viewModel = (model, options) -> return new kb.ViewModel(model, options)