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
    @__kb.internals = options.internals
    @__kb.requires = options.requires

    # update to set up first values observable
    model_observable = kb.utils.wrappedModelObservable(@, new kb.ModelObservable(model, {model: _.bind(@model, @), update: _.bind(@update, @)}))
    model = model_observable.model()
    if model
      @_updateDynamicObservable(model, key) for key of model.attributes # set up the attributes

    return @ if not @__kb.internals and not @__kb.requires
    missing = _.union((if @__kb.internals then @__kb.internals else []), (if @__kb.requires then @__kb.requires else []))
    missing = _.difference(missing, _.keys(model.attributes)) if model
    @_updateDynamicObservable(model, key) for key in missing

  __destroy: ->
    kb.utils.release(this, true) # release the observables
    kb.utils.wrappedDestroy(@)
    super

    kb.statistics.unregister('kb.ViewModel', @) if kb.statistics     # collect memory management statistics

  model: (new_model) ->
    model = kb.utils.wrappedObject(@)
    return model if (arguments.length == 0) or (model is new_model) # get or no change
    kb.utils.wrappedObject(@, new_model)
    @update()

  update: ->
    model = kb.utils.wrappedObject(@)
    return unless model # nothing can be updated

    # COMPATIBILITY: pre-Backbone-0.9.2 changed attributes hash
    if model._changed
      (@_updateDynamicObservable(model, key) if model.hasChanged(key)) for key of model.attributes

    # COMPATIBILITY: post-Backbone-0.9.2 changed attributes hash
    else if model.changed
      @_updateDynamicObservable(model, key) for key of model.changed

  ####################################################
  # Internal
  ####################################################

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