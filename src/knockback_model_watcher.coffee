###
  knockback_model_watcher.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

####################################################
# options
#   * model - called to set and clear the model
#   * update - called when the event is triggered
#   * event_name - optional name of the event to register for on the model (default is update)
#   * key - if provided, will only call update if the model attribute with name key has changed 
####################################################

# @m is @model

class kb.ModelWatcher
  @useOptionsOrCreate: (options, model, obj, callback_options) ->
    if options.model_watcher
      throwUnexpected(this, 'model not matching') unless (options.model_watcher.model() is model or (options.model_watcher.model_ref is model))
      return kb.utils.wrappedModelWatcher(obj, options.model_watcher).registerCallbacks(obj, callback_options)
    else
      kb.utils.wrappedModelWatcherIsOwned(obj, true)
      return kb.utils.wrappedModelWatcher(obj, new kb.ModelWatcher(model)).registerCallbacks(obj, callback_options)

  constructor: (model, obj, callback_options) ->
    @__kb or= {}
    @__kb.callbacks = {}
    @__kb._onModelLoaded = _.bind(@_onModelLoaded, @) 
    @__kb._onModelUnloaded = _.bind(@_onModelUnloaded, @) 

    @registerCallbacks(obj, callback_options) if callback_options 

    if model then @model(model) else (@m = null)

  destroy: ->
    @model(null); @__kb.callbacks = null
    kb.utils.wrappedDestroy(@)

  model: (new_model) ->
    # get or no change
    return @m if (arguments.length is 0) or (@m == new_model)

    # clear and unbind previous
    if @model_ref
      @model_ref.unbind('loaded', @__kb._onModelLoaded)
      @model_ref.unbind('unloaded', @__kb._onModelUnloaded)
      @model_ref.release(); @model_ref = null

    # set up current
    if Backbone.ModelRef and (new_model instanceof Backbone.ModelRef)
      @model_ref = new_model; @model_ref.retain()
      @model_ref.bind('loaded', @__kb._onModelLoaded)
      @model_ref.bind('unloaded', @__kb._onModelUnloaded)
      new_model = @model_ref.model()
    else
      delete @model_ref
    previous_model = @m
    @m = new_model

    # switch bindings
    for event_name, callbacks of @__kb.callbacks
      previous_model.unbind(event_name, callbacks.fn) if previous_model
      new_model.bind(event_name, callbacks.fn) if new_model

      # notify
      list = callbacks.list
      (info.model(new_model) if info.model) for info in list
    return new_model
  
  registerCallbacks: (obj, options) ->
    obj or throwMissing(this, 'obj')
    options or throwMissing(this, 'options')
    event_name = if options.event_name then options.event_name else 'change'
    callbacks = @__kb.callbacks[event_name]

    # register new
    unless callbacks
      list = []
      callbacks = {
        list: list
        fn: (model) -> 
          for info in list
            if info.update
            
              # key doesn't match
              continue if model and info.key and (model.hasChanged and not model.hasChanged(ko.utils.unwrapObservable(info.key)))

              # trigger update
              info.update() 

          return null
      }
      @__kb.callbacks[event_name] = callbacks
      @m.bind(event_name, callbacks.fn) if @m # register for the new event type

    # add the callback information
    info = {}
    info.obj = obj
    info.model = options.model
    info.update = options.update
    info.key = options.key
    callbacks.list.push(info)

    if @m # loaded
      # bind relational updates
      @_modelBindRelatationalInfo(event_name, info) if Backbone.RelationalModel and (@m instanceof Backbone.RelationalModel)

      # trigger now
      info.model(@m) and info.model
    @

  releaseCallbacks: (obj) ->
    return unless @__kb.callbacks # already destroyed

    for event_name, callbacks of @__kb.callbacks
      for index, info of callbacks.list
        if info.obj is obj
          callbacks.list.splice(index, 1)

          # unbind relational updates
          @_modelUnbindRelatationalInfo(event_name, info) if info.rel_fn 
          info.model(null) if info.model
          return

  ####################################################
  # Internal
  ####################################################
  _onModelLoaded: (model) =>
    is_relational = Backbone.RelationalModel and (model instanceof Backbone.RelationalModel)
    @m = model

    # bind all events
    for event_name, callbacks of @__kb.callbacks
      model.bind(event_name, callbacks.fn)

      # bind and notify
      list = callbacks.list
      for info in list
        @_modelBindRelatationalInfo(event_name, info) if is_relational
        (info.model(model) if info.model) 
    @

  _onModelUnloaded: (model) => 
    @m = null

    # unbind all events
    for event_name, callbacks of @__kb.callbacks
      model.unbind(event_name, callbacks.fn)

      # notify
      list = callbacks.list
      for info in list
        @_modelUnbindRelatationalInfo(event_name, info) if info.rel_fn
        info.model(null) if info.model
    @

  _modelBindRelatationalInfo: (event_name, info) ->
    if (event_name is 'change') and info.key and info.update
      key = ko.utils.unwrapObservable(info.key)
      relation = _.find(@m.getRelations(), (test) -> return test.key is key)
      return unless relation
      info.rel_fn = -> info.update()
      if relation.collectionKey
        info.is_collection = true
        @m.bind("add:#{info.key}", info.rel_fn) 
        @m.bind("remove:#{info.key}", info.rel_fn) 
      else
        @m.bind("update:#{info.key}", info.rel_fn) 
    @

  _modelUnbindRelatationalInfo: (event_name, info) ->
    return unless info.rel_fn
    if info.is_collection
      @m.unbind("add:#{info.key}", info.rel_fn) 
      @m.unbind("remove:#{info.key}", info.rel_fn) 
    else
      @m.unbind("update:#{info.key}", info.rel_fn)
    info.rel_fn = null 
    @

# factory function
kb.modelObservable = (model, observable) -> return new kb.ModelWatcher(model, observable)