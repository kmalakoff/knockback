###
  knockback_model_observable.js
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

class kb.ModelObservable
  @useOptionsOrCreate: (options, model, obj, callback_options) ->
    if options.model_observable
      kb.throwUnexpected(this, 'model not matching') unless (options.model_observable.model() is model or (options.model_observable.model_ref is model))
      model_observable = kb.utils.wrappedModelObservable(obj, options.model_observable)
    else
      model_observable = kb.utils.wrappedModelObservable(obj, new kb.ModelObservable(model))
      kb.utils.wrappedModelObservableIsOwned(obj, true)
    model_observable.registerCallbacks(obj, callback_options)
    return model_observable

  constructor: (model, obj, callback_options) ->
    @__kb or= {}
    @__kb.callbacks = {}
    @__kb._onModelLoaded = _.bind(@_onModelLoaded, @) 
    @__kb._onModelUnloaded = _.bind(@_onModelUnloaded, @) 

    @registerCallbacks(obj, callback_options) if callback_options 

    if model # set up
      @model(model) 
    else
      kb.utils.wrappedObject(@, null)

  destroy: ->
    @model(null); @__kb.callbacks = null
    kb.utils.wrappedDestroy(@)

  model: (new_model) ->
    model = kb.utils.wrappedObject(@)

    # get or no change
    return model if (arguments.length is 0) or (model == new_model)

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
    kb.utils.wrappedObject(@, new_model)

    # switch bindings
    for event_name, callbacks of @__kb.callbacks
      model.unbind(event_name, callbacks.fn) if model
      new_model.bind(event_name, callbacks.fn) if new_model

      # notify
      list = callbacks.list
      (info.model(new_model) if info.model) for info in list
    return new_model
  
  registerCallbacks: (obj, options) ->
    kb.throwMissing(this, 'obj') unless obj
    kb.throwMissing(this, 'options') unless options
    model = kb.utils.wrappedObject(@)

    event_name = if options.event_name then options.event_name else 'change'
    callbacks = @__kb.callbacks[event_name]

    # register new
    unless callbacks
      list = []
      callbacks = {
        list: list
        fn: (model) -> 
          for info in list
            continue unless info.update
            
            # key doesn't match
            continue if model and info.key and (model.hasChanged and not model.hasChanged(ko.utils.unwrapObservable(info.key)))

            # trigger update
            info.update() 

          return null
      }
      @__kb.callbacks[event_name] = callbacks
      model.bind(event_name, callbacks.fn) if model # register for the new event type

    # add the callback information
    info = {}
    info.obj = obj
    info.model = options.model if options.model
    info.update = options.update if options.update
    info.key = options.key if options.key
    callbacks.list.push(info)

    return unless model # not loaded

    # bind relational updates
    @_modelBindRelatationalInfo(model, event_name, info) if Backbone.RelationalModel and (model instanceof Backbone.RelationalModel)

    # trigger now
    info.model(model) and info.model

  releaseCallbacks: (obj) ->
    return unless @__kb.callbacks # already destroyed

    model = kb.utils.wrappedObject(@)
    for event_name, callbacks of @__kb.callbacks
      for index, info of callbacks.list
        if info.obj is obj
          callbacks.list.splice(index, 1)

          # unbind relational updates
          @_modelUnbindRelatationalInfo(model, event_name, info) if info.rel_fn 
          info.model(null) if info.model
          return

  ####################################################
  # Internal
  ####################################################
  _onModelLoaded: (model) =>
    is_relational = Backbone.RelationalModel and (model instanceof Backbone.RelationalModel)
    kb.utils.wrappedObject(@, model)

    # bind all events
    for event_name, callbacks of @__kb.callbacks
      model.bind(event_name, callbacks.fn)

      # bind and notify
      list = callbacks.list
      for info in list
        @_modelBindRelatationalInfo(model, event_name, info) if is_relational
        (info.model(model) if info.model) 
    @

  _onModelUnloaded: (model) => 
    kb.utils.wrappedObject(@, null)

    # unbind all events
    for event_name, callbacks of @__kb.callbacks
      model.unbind(event_name, callbacks.fn)

      # notify
      list = callbacks.list
      for info in list
        @_modelUnbindRelatationalInfo(model, event_name, info) if info.rel_fn
        (info.model(null) if info.model) 
    @

  _modelBindRelatationalInfo: (model, event_name, info) ->
    if (event_name is 'change') and info.key and info.update
      key = ko.utils.unwrapObservable(info.key)
      relation = _.find(model.getRelations(), (test) -> return test.key is key)
      return unless relation
      info.rel_fn = -> info.update()
      if relation.collectionKey
        info.is_collection = true
        model.bind("add:#{info.key}", info.rel_fn) 
        model.bind("remove:#{info.key}", info.rel_fn) 
      else
        model.bind("update:#{info.key}", info.rel_fn) 
    @

  _modelUnbindRelatationalInfo: (model, event_name, info) ->
    return unless info.rel_fn
    if info.is_collection
      model.unbind("add:#{info.key}", info.rel_fn) 
      model.unbind("remove:#{info.key}", info.rel_fn) 
    else
      model.unbind("update:#{info.key}", info.rel_fn)
    info.rel_fn = null 
    @

# factory function
kb.modelObservable = (model, observable) -> return new kb.ModelObservable(model, observable)