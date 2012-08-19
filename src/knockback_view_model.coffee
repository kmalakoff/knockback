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
####################################################

class kb.ViewModel extends kb.RefCountable
  constructor: (model, options={}, view_model) ->
    super

    kb.statistics.register('kb.ViewModel', @) if kb.statistics     # collect memory management statistics

    # bind and extract options
    options = _.defaults(_.clone(options), options.options) if options.options
    options = {keys: options} if _.isArray(options) 
    @__kb or= {}
    @__kb.vm_keys = {}
    @__kb.model_keys = {}
    @__kb.view_model = if _.isUndefined(view_model) then this else view_model
    @__kb.internals = options.internals

    # always use a store to ensure recursive view models are handled correctly
    kb.Store.useOptionsOrCreate(options, model, @)

    # view model factory
    kb.utils.wrappedPath(@, options.path)
    kb.Factory.useOptionsOrCreate(options, @, options.path)

    # update to set up first values observable
    model_observable = kb.utils.wrappedModelObservable(@, new kb.ModelObservable(model, @, {model: _.bind(@model, @)}))

    # collect the important keys
    if options.keys # don't merge all the keys if keys are specified
      keys = options.keys if _.isArray(options.keys)
    else
      bb_model = model_observable.model(); keys = _.keys(bb_model.attributes) if bb_model
    (keys = if keys then _.union(keys, @__kb.internals) else @__kb.internals) if @__kb.internals
    (keys = if keys then _.union(keys, options.requires) else options.requires) if options.requires and _.isArray(options.requires)

    # initialize
    @_mapObservables(model, options.keys) if _.isObject(options.keys)
    @_mapObservables(model, options.requires) if _.isObject(options.requires)
    @_createObservables(model, keys) if keys

  __destroy: ->
    if @__kb.view_model isnt @ # clear the external references
      for vm_key of @__kb.vm_keys
        @__kb.view_model[vm_key] = null
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
    missing = _.difference(_.keys(model.attributes), _.keys(@__kb.model_keys))
    @_createObservables(new_model, missing) if missing    

  setToDefault: ->
    for vm_key of @__kb.vm_keys
      @[vm_key].setToDefault() if typeof(@[vm_key].setToDefault) == 'function'
    @

  _createObservables: (model, keys) ->
    observable_options = {store: kb.utils.wrappedStore(@), factory: kb.utils.wrappedFactory(@), path: kb.utils.wrappedPath(@), model_observable: kb.utils.wrappedModelObservable(@)}
    for key in keys
      vm_key = if @__kb.internals and _.contains(@__kb.internals, key) then "_#{key}" else key
      continue if @[vm_key] # already exists, skip

      # add to the keys list
      @__kb.vm_keys[vm_key]=true; @__kb.model_keys[key]=true 

      # create
      observable_options.key = key
      @[vm_key] = @__kb.view_model[vm_key] = kb.observable(model, observable_options, @)
    @

  _mapObservables: (model, mapping_info) ->
    observable_options = {store: kb.utils.wrappedStore(@), factory: kb.utils.wrappedFactory(@), path: kb.utils.wrappedPath(@), model_observable: kb.utils.wrappedModelObservable(@)}
    for vm_key, options of mapping_info
      continue if @[vm_key] # already exists, skip
      options = if _.isString(options) then {key: options} else _.clone(options)
      options.key = vm_key unless options.key

      # add to the keys list
      @__kb.vm_keys[vm_key]=true; @__kb.model_keys[options.key]=true 

      # create
      @[vm_key] = @__kb.view_model[vm_key] = kb.observable(model, _.defaults(options, observable_options), @)
    @

# factory function
kb.viewModel = (model, options, view_model) -> return new kb.ViewModel(model, options, view_model)
kb.observables = (model, mappings_info, view_model) -> 
  kb.utils.legacyWarning('ko.observables', '0.16.0', 'Please use kb.viewModel instead')
  return new kb.ViewModel(model, mappings_info, view_model)