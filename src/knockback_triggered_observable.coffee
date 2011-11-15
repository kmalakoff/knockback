###
  knockback_triggered_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###
throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file') if not this.Knockback

####################################################
# Triggers when the given event is triggered using
####################################################

class Knockback.TriggeredObservable
  constructor: (@model, @event_name) ->
    throw new Error('Observable: model is missing') if not @model
    throw new Error('Observable: event_name is missing') if not @event_name

    _.bindAll(this, 'destroy', '_onGetValue', '_onValueChange', '_onModelLoaded', '_onModelUnloaded')

    # determine model or model_ref type
    if Backbone.ModelRef and (@model instanceof Backbone.ModelRef)
      @model_ref = @model; @model_ref.retain()
      @model_ref.bind('loaded', @_onModelLoaded)
      @model_ref.bind('unloaded', @_onModelUnloaded)
      @model = @model_ref.getModel()

    # internal state
    @_kb_value_observable = ko.observable()

    @_kb_observable = ko.dependentObservable(@_onGetValue)

    # publish public interface on the observable and return instead of this
    @_kb_observable.destroy = @destroy

    # start
    @_onModelLoaded(@model) if not @model_ref or @model_ref.isLoaded()

    return kb.wrappedObservable(this)

  destroy: ->
    @_kb_observable.dispose(); @_kb_observable = null
    @_kb_value_observable = null
    @_onModelUnloaded(@model) if @model
    if @model_ref
      @model_ref.unbind('loaded', @_onModelLoaded)
      @model_ref.unbind('unloaded', @_onModelUnloaded)
      @model_ref.release(); @model_ref = null
    @options  = null; @view_model = null

  ####################################################
  # Internal
  ####################################################
  _onGetValue: -> return @_kb_value_observable()

  _onModelLoaded:   (model) ->
    @model = model
    @model.bind(@event_name, @_onValueChange) # all attributes
    @_onValueChange()

  _onModelUnloaded: ->
    (@_kb_localizer.destroy(); @_kb_localizer = null) if @_kb_localizer and @_kb_localizer.destroy
    @model.unbind(@event_name, @_onValueChange) # all attributes
    @model = null

  _onValueChange: ->
    current_value = @_kb_value_observable()
    if current_value != @model then @_kb_value_observable(@model) else @_kb_value_observable.valueHasMutated() # trigger the dependable

# factory function
Knockback.triggeredObservable = (model, event_name) -> return new Knockback.TriggeredObservable(model, event_name)