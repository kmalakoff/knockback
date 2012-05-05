###
  knockback_triggered_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

####################################################
# Triggers when the given event is triggered using
####################################################

class Knockback.TriggeredObservable
  constructor: (@model, @event_name) ->
    throw new Error('Observable: model is missing') if not @model
    throw new Error('Observable: event_name is missing') if not @event_name

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
    @__kb.value_observable = ko.observable()
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable(_.bind(@_onGetValue, @)))

    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)

    # start
    @_onModelLoaded(@model) if not @model_ref or @model_ref.isLoaded()

    return observable

  destroy: ->
    kb.utils.wrappedObservable(this).dispose(); kb.utils.wrappedObservable(this, null)
    @__kb.value_observable = null
    @_onModelUnloaded(@model) if @model
    if @model_ref
      @model_ref.unbind('loaded', @__kb._onModelLoaded)
      @model_ref.unbind('unloaded', @__kb._onModelUnloaded)
      @model_ref.release(); @model_ref = null
    @options  = null; @view_model = null
    @__kb = null

  ####################################################
  # Internal
  ####################################################
  _onGetValue: -> return @__kb.value_observable()

  _onModelLoaded:   (model) ->
    @model = model
    @model.bind(@event_name, @__kb._onValueChange) # all attributes
    @_onValueChange()

  _onModelUnloaded: ->
    (@__kb.localizer.destroy(); @__kb.localizer = null) if @__kb.localizer and @__kb.localizer.destroy
    @model.unbind(@event_name, @__kb._onValueChange) # all attributes
    @model = null

  _onValueChange: ->
    current_value = @__kb.value_observable()
    if current_value != @model then @__kb.value_observable(@model) else @__kb.value_observable.valueHasMutated() # trigger the dependable

# factory function
Knockback.triggeredObservable = (model, event_name) -> return new Knockback.TriggeredObservable(model, event_name)