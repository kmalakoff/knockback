###
  knockback-triggered-observable.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# @m is @model

class kb.TriggeredObservable
  constructor: (model, @event_name) ->
    model or throwMissing(this, 'model')
    @event_name or throwMissing(this, 'event_name')

    # internal state
    @vo = ko.observable()
    observable = kb.utils.wrappedObservable(@, ko.dependentObservable(=> @vo()))

    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)

    # create model observable
    kb.utils.wrappedModelWatcher(@, new kb.ModelWatcher(model, @, {model: _.bind(@model, @), update: _.bind(@update, @), event_name: @event_name}))

    return observable

  destroy: -> kb.utils.wrappedDestroy(@)

  model: (new_model) ->
    # get or no change
    return @m if (arguments.length == 0) or (@m is new_model)
    @update() if (@m = new_model)

  update: ->
    return unless @m # do not trigger if there is no model
    if @vo() isnt @m then @vo(@m) else @vo.valueHasMutated() # manually trigger the dependable

# factory function
kb.triggeredObservable = (model, event_name) -> return new kb.TriggeredObservable(model, event_name)