###
  knockback.js 0.20.5
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
###

{_, ko} = kb = require './kb'

# Used to provide a central place to aggregate registered Model events rather than having all kb.Observables register for updates independently.
#
class kb.EventWatcher

  # Used to either register yourself with the existing emitter watcher or to create a new one.
  #
  # @param [Object] options please pass the options from your constructor to the register method. For example, constructor(emitter, options)
  # @param [Model|ModelRef] obj the Model that will own or register with the store
  # @param [ko.observable|Object] emitter the emitters of the event watcher
  # @param [Object] callback_options information about the event and callback to register
  # @option options [Function] emitter callback for when the emitter changes (eg. is loaded). Signature: function(new_emitter)
  # @option options [Function] update callback for when the registered event is triggered. Signature: function(new_value)
  # @option options [String] event_selector the name or names of events.
  # @option options [String] key the optional key to filter update attribute events.
  @useOptionsOrCreate: (options, emitter, obj, callback_options) ->
    if options.event_watcher
      kb._throwUnexpected(@, 'emitter not matching') unless (options.event_watcher.emitter() is emitter or (options.event_watcher.model_ref is emitter))
      return kb.utils.wrappedEventWatcher(obj, options.event_watcher).registerCallbacks(obj, callback_options)
    else
      kb.utils.wrappedEventWatcherIsOwned(obj, true)
      return kb.utils.wrappedEventWatcher(obj, new kb.EventWatcher(emitter)).registerCallbacks(obj, callback_options)

  constructor: (emitter, obj, callback_options) ->
    @__kb or= {}
    @__kb.callbacks = {}

    @ee = null
    @registerCallbacks(obj, callback_options) if callback_options
    @emitter(emitter) if emitter

  # Required clean up function to break cycles, release view emitters, etc.
  # Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy: ->
    @emitter(null); @__kb.callbacks = null
    kb.utils.wrappedDestroy(@)

  # Dual-purpose getter/setter for the observed emitter.
  #
  # @overload emitter()
  #   Gets the emitter or emitter reference
  #   @return [Model|ModelRef] the emitter whose attributes are being observed (can be null)
  # @overload emitter(new_emitter)
  #   Sets the emitter or emitter reference
  #   @param [Model|ModelRef] new_emitter the emitter whose attributes will be observed (can be null)
  emitter: (new_emitter) ->
    # get or no change
    return @ee if (arguments.length is 0) or (@ee is new_emitter)

    # clear and unbind previous
    if @model_ref
      @model_ref.unbind('loaded', @_onModelLoaded)
      @model_ref.unbind('unloaded', @_onModelUnloaded)
      @model_ref.release(); @model_ref = null

    # set up current
    if kb.Backbone and kb.Backbone.ModelRef and (new_emitter instanceof kb.Backbone.ModelRef)
      @model_ref = new_emitter; @model_ref.retain()
      @model_ref.bind('loaded', @_onModelLoaded)
      @model_ref.bind('unloaded', @_onModelUnloaded)
      new_emitter = @model_ref.model() or null
    else
      delete @model_ref

    # switch bindings
    if @ee isnt new_emitter
      if new_emitter then @_onModelLoaded(new_emitter) else @_onModelUnloaded(@ee)
    return new_emitter

  # Used to register callbacks for an emitter.
  #
  # @param [Object] obj the owning object.
  # @param [Object] callback_info the callback information
  # @option options [Function] emitter callback for when the emitter changes (eg. is loaded). Signature: function(new_emitter)
  # @option options [Function] update callback for when the registered emitter is triggered. Signature: function(new_value)
  # @option options [String] emitter_name the name of the emitter.
  # @option options [String] key the optional key to filter update attribute events.
  registerCallbacks: (obj, callback_info) ->
    obj or kb._throwMissing(this, 'obj')
    callback_info or kb._throwMissing(this, 'callback_info')
    event_names = if callback_info.event_selector then callback_info.event_selector.split(' ') else ['change']
    model = @ee

    for event_name in event_names
      continue unless event_name # extra spaces
      do (event_name) =>
        unless callbacks = @__kb.callbacks[event_name]
          callbacks = @__kb.callbacks[event_name] = {
            model: null
            list: []
            fn: (model) =>
              for info in callbacks.list
                continue unless  info.update
                continue if model and info.key and (model.hasChanged and not model.hasChanged(ko.utils.unwrapObservable(info.key))) # key doesn't match
                not kb.statistics or kb.statistics.addModelEvent({name: event_name, model: model, key: info.key, path: info.path})
                info.update() # trigger update
              return null
            }

        callbacks.list.push(info = _.defaults({obj: obj}, callback_info)) # store the callback information
        @_onModelLoaded(model) if model
    return @

  releaseCallbacks: (obj) ->
    @ee = null
    @_unbindCallbacks(event_name, callbacks, kb.wasReleased(obj)) for event_name, callbacks of @__kb.callbacks # unbind all events
    delete @__kb.callbacks

  ####################################################
  # Internal
  ####################################################

  # @nodoc
  # NOTE: this is called by registerCallbacks so the model could already be bound and we just want to bind the new info
  # NOTE: this is called by emitter so it may be used to clear a previous emitter without triggering an intermediate change
  _onModelLoaded: (model) =>
    @ee = model
    for event_name, callbacks of @__kb.callbacks # bind all events
      @_unbindCallbacks(event_name, callbacks, true) if callbacks.model and (callbacks.model isnt model)

      (callbacks.model = model; model.bind(event_name, callbacks.fn)) unless callbacks.model
      for info in callbacks.list
        info.unbind_fn or= kb.orm?.bind(model, info.key, info.update, info.path)
        (info.emitter(model) if info.emitter)
    return

  # @nodoc
  _onModelUnloaded: (model) =>
    return if @ee isnt model
    @ee = null
    @_unbindCallbacks(event_name, callbacks) for event_name, callbacks of @__kb.callbacks # unbind all events
    return

  # @nodoc
  _unbindCallbacks: (event_name, callbacks, skip_emitter) =>
    (callbacks.model.unbind(event_name, callbacks.fn); callbacks.model = null) if callbacks.model
    for info in callbacks.list
      (info.unbind_fn(); info.unbind_fn = null) if info.unbind_fn
      info.emitter(null) if info.emitter and not skip_emitter and not kb.wasReleased(info.obj)
    return

# factory function
kb.emitterObservable = (emitter, observable) -> return new kb.EventWatcher(emitter, observable)
