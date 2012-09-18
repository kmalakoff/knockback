###
  knockback_model_watcher.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

addStatisticsEvent = (model, event_name, info) ->
  not kb.statistics or kb.statistics.addModelEvent({name: event_name, model: model, key: info.key, path: info.path})

# Used to provide a central place to aggregate registered Backbone.Model events rather than having all kb.Observables register for updates independently.
#
class kb.ModelWatcher

  # Used to either register yourself with the existing model watcher or to create a new one.
  #
  # @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
  # @param [Backbone.Model|Backbone.ModelRef] obj the Model that will own or register with the store
  # @param [ko.observable|Object] owner the owners of the model watcher
  # @param [Object] callback_options information about the event and callback to register
  # @option options [Function] model callback for when the model changes (eg. is loaded). Signature: function(new_model)
  # @option options [Function] update callback for when the registered event is triggered. Signature: function(new_value)
  # @option options [String] event_name the name of the event.
  # @option options [String] key the optional key to filter update attribute events.
  @useOptionsOrCreate: (options, model, obj, callback_options) ->
    if options.model_watcher
      throwUnexpected(@, 'model not matching') unless (options.model_watcher.model() is model or (options.model_watcher.model_ref is model))
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

  # Required clean up function to break cycles, release view models, etc.
  # Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy: ->
    @model(null); @__kb.callbacks = null
    kb.utils.wrappedDestroy(@)

  # Dual-purpose getter/setter for the observed model.
  #
  # @overload model()
  #   Gets the model or model reference
  #   @return [Backbone.Model|Backbone.ModelRef] the model whose attributes are being observed (can be null)
  # @overload model(new_model)
  #   Sets the model or model reference
  #   @param [Backbone.Model|Backbone.ModelRef] new_model the model whose attributes will be observed (can be null)
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

  # Used to register callbacks for an owner.
  #
  # @param [Object] obj the owning object.
  # @param [Object] callback_info the callback information
  # @option options [Function] model callback for when the model changes (eg. is loaded). Signature: function(new_model)
  # @option options [Function] update callback for when the registered event is triggered. Signature: function(new_value)
  # @option options [String] event_name the name of the event.
  # @option options [String] key the optional key to filter update attribute events.
  registerCallbacks: (obj, callback_info) ->
    obj or throwMissing(this, 'obj')
    callback_info or throwMissing(this, 'info')
    event_name = if callback_info.event_name then callback_info.event_name else 'change'
    callbacks = @__kb.callbacks[event_name]

    # register new
    unless callbacks
      list = []
      callbacks = {
        list: list
        fn: (model) ->
          for info in list
            if info.update and not info.rel_fn

              # key doesn't match
              continue if model and info.key and (model.hasChanged and not model.hasChanged(ko.utils.unwrapObservable(info.key)))

              # trigger update
              not kb.statistics or addStatisticsEvent(model, event_name, info)
              info.update()

          return null
      }
      @__kb.callbacks[event_name] = callbacks
      @m.bind(event_name, callbacks.fn) if @m # register for the new event type

    # add the callback information
    info = _.defaults({obj: obj}, callback_info)
    callbacks.list.push(info)

    if @m # loaded
      # bind relational updates
      @_modelBindRelatationalInfo(event_name, info) if Backbone.RelationalModel and (@m instanceof Backbone.RelationalModel)

      # trigger now
      info.model(@m) and info.model
    return

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

  # @private
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
    return

  # @private
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
    return

  # @private
  _modelBindRelatationalInfo: (event_name, info) ->
    if (event_name is 'change') and info.key and info.update
      key = ko.utils.unwrapObservable(info.key)
      relation = _.find(@m.getRelations(), (test) -> return test.key is key)
      return unless relation
      info.rel_fn = (model) ->
        not kb.statistics or addStatisticsEvent(model, "#{event_name} (relational)", info)
        info.update()
      if relation.collectionType or _.isArray(relation.keyContents)
        info.is_collection = true
        @m.bind("add:#{info.key}", info.rel_fn)
        @m.bind("remove:#{info.key}", info.rel_fn)
      else
        @m.bind("update:#{info.key}", info.rel_fn)
    return

  # @private
  _modelUnbindRelatationalInfo: (event_name, info) ->
    return unless info.rel_fn
    if info.is_collection
      @m.unbind("add:#{info.key}", info.rel_fn)
      @m.unbind("remove:#{info.key}", info.rel_fn)
    else
      @m.unbind("update:#{info.key}", info.rel_fn)
    info.rel_fn = null
    return

# factory function
kb.modelObservable = (model, observable) -> return new kb.ModelWatcher(model, observable)