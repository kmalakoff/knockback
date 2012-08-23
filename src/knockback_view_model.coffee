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
#   * requires - an array of atttributes that should be stubbed out if they don't exist on the model
#   * keys - only include the provided keys on the model
#   * excludes - keys to exclude on the view model; for exmaple, if you want to provide a custom implementation
####################################################

class kb.ViewModel
  @extend = Backbone.Model.extend # for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")

  constructor: (model, options, view_model) ->
    options or= {}
    view_model or= {}

    # bind and extract options
    options = _.defaults(_.clone(options), options.options) if options.options
    options = {keys: options} if _.isArray(options) 
    @__kb or= {}
    @__kb.vm_keys = {}
    @__kb.model_keys = {}
    @__kb.view_model = if _.isUndefined(view_model) then this else view_model
    not options.internals or @__kb.internals = options.internals
    not options.excludes or @__kb.excludes = options.excludes

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
    keys = _.difference(keys, @__kb.excludes) if keys and @__kb.excludes  # remove excludes
    (keys = if keys then _.union(keys, @__kb.internals) else @__kb.internals) if @__kb.internals
    (keys = if keys then _.union(keys, options.requires) else options.requires) if options.requires and _.isArray(options.requires)

    # initialize
    @_mapObservables(model, options.keys) if _.isObject(options.keys) and not _.isArray(options.keys)
    @_mapObservables(model, options.requires) if _.isObject(options.requires) and not _.isArray(options.requires)
    not options.mappings or @_mapObservables(model, options.mappings)
    not keys or @_createObservables(model, keys)

    not kb.statistics or kb.statistics.register(@)     # collect memory management statistics

  destroy: ->
    if @__kb.view_model isnt @ # clear the external references
      for vm_key of @__kb.vm_keys
        @__kb.view_model[vm_key] = null
    @__kb.view_model = null
    kb.releaseKeys(this)
    kb.utils.wrappedDestroy(@)

    not kb.statistics or kb.statistics.unregister(@)     # collect memory management statistics

  shareOptions: -> 
    return {store: kb.utils.wrappedStore(@), factory: kb.utils.wrappedFactory(@)}

  model: (new_model) ->
    model = kb.utils.wrappedObject(@)
    return model if (arguments.length == 0) or (model is new_model) # get or no change

    # SHARED NULL MODEL - keep it that way
    if this.__kb_null
      not new_model or throwUnexpected(this, 'model set on shared null')
      return 

    # update references
    kb.utils.wrappedObject(@, new_model)
    model_watcher = kb.utils.wrappedModelWatcher(@)
    return unless model_watcher # not yet initialized
    model_watcher.model(new_model) # sync with model_watcher
  
    # sync missing attributes
    return if @__kb.keys or not new_model or not new_model.attributes # only allow specific keys or nothing to add
    # NOTE: this does not remove keys that are different between the models
    missing = _.difference(_.keys(new_model.attributes), _.keys(@__kb.model_keys))
    @_createObservables(new_model, missing) if missing    

  setToDefault: ->
    for vm_key of @__kb.vm_keys
      @[vm_key]?.setToDefault?()
    @

  _createObservables: (model, keys) ->
    c_options = {store: kb.utils.wrappedStore(@), factory: kb.utils.wrappedFactory(@), path: @__kb.path, model_watcher: kb.utils.wrappedModelWatcher(@)}
    for key in keys
      vm_key = if @__kb.internals and _.contains(@__kb.internals, key) then "_#{key}" else key
      continue if @[vm_key] # already exists, skip

      # add to the keys list
      @__kb.vm_keys[vm_key]=true; @__kb.model_keys[key]=true 

      # create
      c_options.key = key
      @[vm_key] = @__kb.view_model[vm_key] = kb.observable(model, c_options, @)
    @

  _mapObservables: (model, mappings) ->
    c_options = {store: kb.utils.wrappedStore(@), factory: kb.utils.wrappedFactory(@), path: @__kb.path, model_watcher: kb.utils.wrappedModelWatcher(@)}
    for vm_key, mapping_info of mappings
      continue if @[vm_key] # already exists, skip
      mapping_info = if _.isString(mapping_info) then {key: mapping_info} else _.clone(mapping_info)
      mapping_info.key or= vm_key

      # add to the keys list
      @__kb.vm_keys[vm_key]=true; @__kb.model_keys[mapping_info.key]=true 

      # create
      @[vm_key] = @__kb.view_model[vm_key] = kb.observable(model, _.defaults(mapping_info, c_options), @)
    @

# factory function
kb.viewModel = (model, options, view_model) -> return new kb.ViewModel(model, options, view_model)
kb.observables = (model, factories_info, view_model) -> 
  legacyWarning('ko.observables', '0.16.0', 'Please use kb.viewModel instead')
  return new kb.ViewModel(model, factories_info, view_model)