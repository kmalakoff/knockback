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
  constructor: (model, options) ->
    kb.utils.throwMissing(this, 'options') unless options
    kb.utils.throwMissing(this, 'model()') unless typeof(options.model) == 'function'
    kb.utils.throwMissing(this, 'update()') unless typeof(options.update) == 'function'

    # bind callbacks
    @__kb or= {}
    @__kb._onModelLoaded = _.bind(@_onModelLoaded, @)
    @__kb._onModelUnloaded = _.bind(@_onModelUnloaded, @)
    @__kb._onModelChange = _.bind(@_onModelChange, @)
    @__kb.model_callback = options.model
    @__kb.update_callback = options.update
    @__kb.event_name = if options.event_name then options.event_name else 'change'
    @__kb.key = options.key
  
    @model(model) if model # set up

  destroy: ->
    @model(null)
    kb.utils.wrappedDestroy(@)

  model: (new_model) ->
    model = kb.utils.wrappedObject(@)

    # get or no change
    return model if (arguments.length is 0) or (model == new_model)

    # clear and unbind previous
    @_onModelUnloaded(model) if model
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
    kb.utils.wrappedObject(@, new_model)

    # start now
    @_onModelLoaded(new_model) if new_model

  isLoaded: -> return !!kb.utils.wrappedObject(@)

  ####################################################
  # Internal
  ####################################################
  _onModelLoaded: (model) ->
    kb.utils.wrappedObject(@, model)
    model.bind(@__kb.event_name, @__kb._onModelChange)
    if (@__kb.event_name is 'update') and Backbone.RelationalModel and (model instanceof Backbone.RelationalModel)
      model.bind('add', @__kb._onModelChange)
      model.bind('remove', @__kb._onModelChange)
      model.bind('update', @__kb._onModelChange)
    @__kb.model_callback(model)

  _onModelUnloaded: (model) ->
    kb.utils.wrappedObject(@, null)
    model.unbind(@__kb.event_name, @__kb._onModelChange)

    if (@__kb.event_name is 'update') and Backbone.RelationalModel and (model instanceof Backbone.RelationalModel)
      model.unbind('add', @__kb._onModelChange)
      model.unbind('remove', @__kb._onModelChange)
      model.unbind('update', @__kb._onModelChange)
    @__kb.model_callback(null)

  _onModelChange: (model) ->     
    return if @__kb.key and not kb.utils.attributeHasChanged(model, ko.utils.unwrapObservable(@__kb.key)) # filter changes by attribute key
    @__kb.update_callback()

# factory function
kb.modelObservable = (model, observable) -> return new kb.ModelObservable(model, observable)