###
  knockback-triggered-observable.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# Class for observing model events.
#
# @example create an observable whose subscriptions are notified with the change event is triggered.
#   var triggered_observable = kb.triggeredObservable(name, 'change');
#
# @example How to watch a model for events.
#   var trigger_count = 0;
#   var model = new Backbone.Model();
#   var view_model = {
#     triggered_observable: kb.triggeredObservable(model, 'change')
#   };
#   view_model.counter = ko.dependentObservable(function() {
#     view_model.triggered_observable() // add a dependency
#     return trigger_count++
#   });
#   model.set(name: 'bob');       # trigger_count: 1
#   model.set(name: 'george');    # trigger_count: 2
#   model.set(last: 'smith');     # trigger_count: 3
class kb.TriggeredObservable

  # Used to create a new kb.Observable.
  #
  # @param [Backbone.Model] model the model to observe (can be null)
  # @param [String] event_name the event name to trigger Knockout subscriptions on.
  # @return [ko.observable] the constructor does not return 'this' but a ko.observable
  # @note the constructor does not return 'this' but a ko.observable
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

  # Required clean up function to break cycles, release view models, etc.
  # Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy: -> kb.utils.wrappedDestroy(@)

  # Dual-purpose getter/setter for the observed model.
  #
  # @param [Backbone.Model] model the model whose attribute to observe (can be null)
  # @return [Backbone.Model|void] returns the model only if getter (no parameters)
  model: (new_model) ->
    # get or no change
    return @m if (arguments.length == 0) or (@m is new_model)
    @update() if (@m = new_model)

  ####################################################
  # Internal
  ####################################################
  # @private
  update: ->
    return unless @m # do not trigger if there is no model
    if @vo() isnt @m then @vo(@m) else @vo.valueHasMutated() # manually trigger the dependable

# factory function
kb.triggeredObservable = (model, event_name) -> return new kb.TriggeredObservable(model, event_name)