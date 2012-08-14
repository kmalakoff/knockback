###
  knockback_triggered_observable.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class kb.TriggeredObservable
  constructor: (@model, @event_name) ->
    throw 'Observable: model is missing' if not @model
    throw 'Observable: event_name is missing' if not @event_name

    @__kb = {}
    @__kb._onValueChange = _.bind(@_onValueChange, @)
    @__kb._onModelLoaded = _.bind(@_onModelLoaded, @)
    @__kb._onModelUnloaded = _.bind(@_onModelUnloaded, @)

    # determine model or model_ref type
    if Backbone.ModelRef and (@model instanceof Backbone.ModelRef)
      @model_ref = @model; @model_ref.retain()
      @model_ref.bind('loaded', @__kb._onModelLoaded)
      @model_ref.bind('unloaded', @__kb._onModelUnloaded)
      @model = @model_ref.getModel()

    # internal state
    kb.utils.wrappedValueObservable(@, ko.observable())
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable(_.bind(@_onGetValue, @)))

    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)

    # start
    @_onModelLoaded(@model) if not @model_ref or @model_ref.isLoaded()

    return observable

  destroy: ->
    @_onModelUnloaded(@model) if @model
    if @model_ref
      @model_ref.unbind('loaded', @__kb._onModelLoaded)
      @model_ref.unbind('unloaded', @__kb._onModelUnloaded)
      @model_ref.release(); @model_ref = null
    @options  = null; @view_model = null
    kb.utils.wrappedDestroy(@)

  ####################################################
  # Internal
  ####################################################
  _onGetValue: ->
    value_observable = kb.utils.wrappedValueObservable(@)
    return value_observable()

  _onModelLoaded:   (model) ->
    @model = model
    @model.bind(@event_name, @__kb._onValueChange) # all attributes
    @_onValueChange()

  _onModelUnloaded: ->
    (@__kb.localizer.destroy(); @__kb.localizer = null) if @__kb.localizer and @__kb.localizer.destroy
    @model.unbind(@event_name, @__kb._onValueChange) # all attributes
    @model = null

  _onValueChange: ->
    value_observable = kb.utils.wrappedValueObservable(@)
    current_value = value_observable()
    if current_value != @model then value_observable(@model) else value_observable.valueHasMutated() # trigger the dependable

# factory function
kb.triggeredObservable = (model, event_name) -> return new kb.TriggeredObservable(model, event_name)