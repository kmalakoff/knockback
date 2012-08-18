###
  knockback_model_observable.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

####################################################
# options
#   * model() - called to set and clear the model
#   * update() - called when the event is triggered
#   * event_name - optional name of the event to register for on the model (default is update)
####################################################

class kb.ModelObservable
  @useOptionsOrCreate: (options, model, obj, callback_options) ->
    if options.model_observable and options.model_observable.model() is model
      model_observable = kb.utils.wrappedModelObservable(obj, options.model_observable)
    else
      model_observable = kb.utils.wrappedModelObservable(obj, new kb.ModelObservable(model))
      kb.utils.wrappedModelObservableIsOwned(obj, true)
    model_observable.registerCallbacks(obj, callback_options)

  constructor: (model, obj, callback_options) ->
    @__kb or= {}
    @__kb.callbacks = {}
    @__kb._onModelLoaded = _.bind(@_onModelLoaded, @) 
    @__kb._onModelUnloaded = _.bind(@_onModelUnloaded, @) 

    @registerCallbacks(obj, callback_options) if callback_options 

    @model(model) if model # set up

  destroy: ->
    @model(null); @__kb.callbacks = null
    kb.utils.wrappedDestroy(@)

  model: (new_model) ->
    model = kb.utils.wrappedObject(@)

    # get or no change
    return model if (arguments.length is 0) or (model == new_model)

    # clear and unbind previous
    @__kb._onModelUnloaded(model) if model
    if @model_ref
      @model_ref.unbind('loaded', @__kb._onModelLoaded)
      @model_ref.unbind('unloaded', @__kb._onModelUnloaded)
      @model_ref.release(); @model_ref = null

    # a model ref
    if Backbone.ModelRef and (new_model instanceof Backbone.ModelRef)
      @model_ref = new_model; @model_ref.retain()
      @model_ref.bind('loaded', @__kb._onModelLoaded)
      @model_ref.bind('unloaded', @__kb._onModelUnloaded)
      new_model = @model_ref.model()
    else
      @model_ref = null
    model = kb.utils.wrappedObject(@, new_model)

    # start now
    @__kb._onModelLoaded(model) if model

  registerCallbacks: (obj, options) ->
    kb.utils.throwMissing(this, 'obj') unless obj
    kb.utils.throwMissing(this, 'options') unless options
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
            info.update() if info.update and (not info.key or kb.utils.attributeHasChanged(model, info.key))
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

    # trigger now
    info.model(model) if model and info.model

  unregisterCallbacks: (obj) ->
    model = kb.utils.wrappedObject(@)
    for event_name, callbacks of @__kb.callbacks
      for index, info of callbacks.list
        if info.obj is obj
          callbacks.list.splice(index, 1)
          info.model(null) if info.model
          return

  ####################################################
  # Internal
  ####################################################
  _onModelLoaded: (model) =>
    kb.utils.wrappedObject(@, model)

    # bind all events
    for event_name, callbacks of @__kb.callbacks
      model.bind(event_name, callbacks.fn)
      if (event_name is 'update') and Backbone.RelationalModel and (model instanceof Backbone.RelationalModel)
        model.bind('add', callbacks.fn)
        model.bind('remove', callbacks.fn)
        model.bind('update', callbacks.fn)

      # notify
      for info in callbacks.list
        info.model(model) if info.model

  _onModelUnloaded: (model) => 
    kb.utils.wrappedObject(@, null)

    # unbind all events
    for event_name, callbacks of @__kb.callbacks
      model.unbind(event_name, callbacks.fn)
      if (event_name is 'update') and Backbone.RelationalModel and (model instanceof Backbone.RelationalModel)
        model.unbind('add', callbacks.fn)
        model.unbind('remove', callbacks.fn)
        model.unbind('update', callbacks.fn)

      # notify
      for info in callbacks.list
        info.model(null) if info.model
  
# factory function
kb.modelObservable = (model, observable) -> return new kb.ModelObservable(model, observable)