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

    # internal state
    kb.utils.wrappedByKey(@, 'vo', ko.observable())
    observable = kb.utils.wrappedObservable(@, ko.dependentObservable(=> kb.utils.wrappedByKey(@, 'vo')()))

    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)

    # update to set up first values observable
    kb.utils.wrappedModelObservable(@, new kb.ModelObservable(model, {model: _.bind(@model, @), update: _.bind(@update, @), event_name: @event_name}))

    return observable

  destroy: ->
    @options  = null; @view_model = null
    kb.utils.wrappedDestroy(@)

  model: (new_model) ->
    observable = kb.utils.wrappedObservable(@)
    model = kb.utils.wrappedObject(observable)

    # get or no change
    return model if (arguments.length == 0) or (model is new_model)
    kb.utils.wrappedObject(observable, new_model)
    @update()

  update: ->
    observable = kb.utils.wrappedObservable(@)
    value_observable = kb.utils.wrappedByKey(@, 'vo')
    current_value = value_observable()
    model = kb.utils.wrappedObject(observable)
    return unless model # do not trigger if there is no model
    if current_value != model then value_observable(model) else value_observable.valueHasMutated() # trigger the dependable

# factory function
kb.triggeredObservable = (model, event_name) -> return new kb.TriggeredObservable(model, event_name)