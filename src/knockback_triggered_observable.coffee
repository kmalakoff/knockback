###
  knockback_triggered_observable.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class kb.TriggeredObservable
  constructor: (model, @event_name) ->
    kb.utils.throwMissing(this, 'model') unless model
    kb.utils.throwMissing(this, 'event_name') unless @event_name

    # bind callbacks
    @__kb or= {}
    @__kb._onValueChange = _.bind(@_onValueChange, @)
    @__kb._onModelLoaded = _.bind(@_onModelLoaded, @)
    @__kb._onModelUnloaded = _.bind(@_onModelUnloaded, @)

    # internal state
    kb.utils.wrappedByKey(@, 'vo', ko.observable())
    observable = kb.utils.wrappedObservable(@, ko.dependentObservable(_.bind(@_onGetValue, @)))

    # determine model or model_ref type
    if Backbone.ModelRef and (model instanceof Backbone.ModelRef)
      kb.utils.wrappedModelRef(observable, model, {loaded: @__kb._onModelLoaded, unloaded: @__kb._onModelUnloaded})
      model_ref = model; model =  model_ref.model()
    else
      kb.utils.wrappedObject(observable, model)

    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)

    # start
    @_onModelLoaded(model) if not model_ref or model_ref.isLoaded()

    return observable

  destroy: ->
    model = kb.utils.wrappedObject(kb.utils.wrappedObservable(@))
    @_onModelUnloaded(model) if model
    @options  = null; @view_model = null
    kb.utils.wrappedDestroy(@)

  ####################################################
  # Internal
  ####################################################
  _onGetValue: -> return kb.utils.wrappedByKey(@, 'vo')()

  _onModelLoaded:   (model) ->
    kb.utils.wrappedObject(kb.utils.wrappedObservable(@), model)
    model.bind(@event_name, @__kb._onValueChange) # all attributes
    @_onValueChange()

  _onModelUnloaded: (model) ->
    observable = kb.utils.wrappedObservable(@)
    model.unbind(@event_name, @__kb._onValueChange) # all attributes
    kb.utils.wrappedObject(observable, null)

  _onValueChange: ->
    observable = kb.utils.wrappedObservable(@)
    value_observable = kb.utils.wrappedByKey(@, 'vo')
    current_value = value_observable()
    model = kb.utils.wrappedObject(observable)
    if current_value != model then value_observable(model) else value_observable.valueHasMutated() # trigger the dependable

# factory function
kb.triggeredObservable = (model, event_name) -> return new kb.TriggeredObservable(model, event_name)