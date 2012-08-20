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

    kb.statistics.register(@) if kb.statistics     # collect memory management statistics

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
    @__kb.path = options.path
    kb.Factory.useOptionsOrCreate(options, @, options.path)

    # update to set up first values observable
    model_watcher = kb.utils.wrappedModelWatcher(@, new kb.ModelWatcher(model, @, {model: _.bind(@model, @)}))

    # collect the important keys
    if options.keys # don't merge all the keys if keys are specified
      if _.isArray(options.keys)
        keys = @__kb.keys = options.keys
      else
        mapped_keys = {}
        for vm_key, mapping_info of options.keys
          mapped_keys[if _.isString(mapping_info) then mapping_info else (if mapping_info.key then mapping_info.key else vm_key)] = true
        @__kb.keys = _.keys(mapped_keys)
    else
      bb_model = model_watcher.model(); keys = _.keys(bb_model.attributes) if bb_model and bb_model.attributes
    (keys = if keys then _.union(keys, @__kb.internals) else @__kb.internals) if @__kb.internals
    (keys = if keys then _.union(keys, options.requires) else options.requires) if options.requires and _.isArray(options.requires)

    # initialize
    @_mapObservables(model, options.keys) if _.isObject(options.keys) and not _.isArray(options.keys)
    @_mapObservables(model, options.requires) if _.isObject(options.requires) and not _.isArray(options.requires)
    @_mapObservables(model, options.mappings) if options.mappings
    @_createObservables(model, keys) if keys

  releaseReferences: ->
    @__kb.references_released = true
    if @__kb.view_model isnt @ # clear the external references
      for vm_key of @__kb.vm_keys
        @__kb.view_model[vm_key] = null
    @__kb.view_model = null
    kb.release(this, true) # release the observables

  __destroy: ->
    @releaseReferences() unless @__kb.references_released
    kb.utils.wrappedDestroy(@)
    super

    kb.statistics.unregister(@) if kb.statistics     # collect memory management statistics

  model: (new_model) ->
    model = kb.utils.wrappedObject(@)
    return model if (arguments.length == 0) or (model is new_model) # get or no change
    model = kb.utils.wrappedObject(@, new_model)
    return unless model # no model
    model_watcher = kb.utils.wrappedModelWatcher(@)
    return new_model unless model_watcher # not yet initialized
    model_watcher.model(model) # sync with model_watcher

    # add all the missing keys
    return if @__kb.keys # only allow specific keys
    # NOTE: this does not remove keys that are different between the models
    missing = _.difference(_.keys(model.attributes), _.keys(@__kb.model_keys))
    @_createObservables(new_model, missing) if missing    

  setToDefault: ->
    for vm_key of @__kb.vm_keys
      @[vm_key].setToDefault() if typeof(@[vm_key].setToDefault) == 'function'
    @

  _createObservables: (model, keys) ->
    observable_options = {store: kb.utils.wrappedStore(@), factory: kb.utils.wrappedFactory(@), path: @__kb.path, model_watcher: kb.utils.wrappedModelWatcher(@)}
    for key in keys
      vm_key = if @__kb.internals and _.contains(@__kb.internals, key) then "_#{key}" else key
      continue if @[vm_key] # already exists, skip

      # add to the keys list
      @__kb.vm_keys[vm_key]=true; @__kb.model_keys[key]=true 

      # create
      observable_options.key = key
      @[vm_key] = @__kb.view_model[vm_key] = kb.observable(model, observable_options, @)
    @

  _mapObservables: (model, mappings) ->
    observable_options = {store: kb.utils.wrappedStore(@), factory: kb.utils.wrappedFactory(@), path: @__kb.path, model_watcher: kb.utils.wrappedModelWatcher(@)}
    for vm_key, mapping_info of mappings
      continue if @[vm_key] # already exists, skip
      mapping_info = if _.isString(mapping_info) then {key: mapping_info} else _.clone(mapping_info)
      mapping_info.key = vm_key unless mapping_info.key

      # add to the keys list
      @__kb.vm_keys[vm_key]=true; @__kb.model_keys[mapping_info.key]=true 

      # create
      @[vm_key] = @__kb.view_model[vm_key] = kb.observable(model, _.defaults(mapping_info, observable_options), @)
    @

# factory function
kb.viewModel = (model, options, view_model) -> return new kb.ViewModel(model, options, view_model)
kb.observables = (model, factories_info, view_model) -> 
  kb.legacyWarning('ko.observables', '0.16.0', 'Please use kb.viewModel instead')
  return new kb.ViewModel(model, factories_info, view_model)