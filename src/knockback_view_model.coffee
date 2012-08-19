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
    store = kb.Store.useOptionsOrCreate(options, model, @)

    # view model factory
    factory = kb.Factory.useOptionsOrCreate(options, @)
    path = kb.utils.wrappedPath(@, options.path)

    # bind and extract options
    @__kb.internals = options.internals
    @__kb.requires = options.requires

    # update to set up first values observable
    model_observable = kb.utils.wrappedModelObservable(@, new kb.ModelObservable(model, @, {model: _.bind(@model, @)}))
    bb_model = model_observable.model()

    # collect the important keys
    keys = _.keys(bb_model.attributes) if bb_model
    if @__kb.internals
      keys = if keys then _.union(keys, @__kb.internals) else @__kb.internals
    if @__kb.requires
      keys = if keys then _.union(keys, @__kb.requires) else @__kb.requires
    @__kb.keys = keys || []

    # set up
    observable_options = {store: store, factory: factory, path: path, model_observable: model_observable}
    for key in @__kb.keys
      vm_key = if @__kb.internals and _.contains(@__kb.internals, key) then '_' + key else key
      observable_options.key = key
      @[vm_key] = kb.observable(model, observable_options, @)

  __destroy: ->
    kb.utils.release(this, true) # release the observables
    kb.utils.wrappedDestroy(@)
    super

    kb.statistics.unregister('kb.ViewModel', @) if kb.statistics     # collect memory management statistics

  model: (new_model) ->
    model = kb.utils.wrappedObject(@)
    return model if (arguments.length == 0) or (model is new_model) # get or no change
    model = kb.utils.wrappedObject(@, new_model)
    return unless model # no model
    model_observable = kb.utils.wrappedModelObservable(@)
    return new_model unless model_observable # not yet initialized
    model_observable.model(model) # sync with model_observable

    # add all the missing keys
    # NOTE: this does not remove keys that are different between the models
    missing = _.difference(@__kb.keys, _.keys(model.attributes))
    return unless missing

    # create all missing observables
    observable_options = {store: kb.utils.wrappedStore(@), factory: kb.utils.wrappedFactory(@), path: kb.utils.wrappedPath(@), model_observable: kb.utils.wrappedModelObservable(@)}
    for key in missing
      @__kb.keys.push(key) # add to the keys list

      vm_key = if @__kb.internals and _.contains(@__kb.internals, key) then '_' + key else key
      observable_options.key = key
      @[vm_key] = kb.observable(model, observable_options, @)
    return new_model

# factory function
kb.viewModel = (model, options) -> return new kb.ViewModel(model, options)