###
  knockback-triggered-observable.js 0.17.2
  (c) 2011-2013 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# Class for observing emitter events.
#
# @example create an observable whose subscriptions are notified with the change event is triggered.
#   var triggered_observable = kb.triggeredObservable(name, 'change');
#
# @example How to watch a emitter for events.
#   var trigger_count = 0;
#   var emitter = new Backbone.Model();
#   var view_emitter = {
#     triggered_observable: kb.triggeredObservable(emitter, 'change')
#   };
#   view_emitter.counter = ko.dependentObservable(function() {
#     view_emitter.triggered_observable() // add a dependency
#     return trigger_count++
#   });
#   emitter.set(name: 'bob');       # trigger_count: 1
#   emitter.set(name: 'george');    # trigger_count: 2
#   emitter.set(last: 'smith');     # trigger_count: 3
class kb.TriggeredObservable

  # Used to create a new kb.Observable.
  #
  # @param [Model] emitter the emitter to observe (can be null)
  # @param [String] event_selector the event name to trigger Knockout subscriptions on.
  # @return [ko.observable] the constructor does not return 'this' but a ko.observable
  # @note the constructor does not return 'this' but a ko.observable
  constructor: (emitter, @event_selector) ->
    emitter or _throwMissing(this, 'emitter')
    @event_selector or _throwMissing(this, 'event_selector')

    # internal state
    @vo = ko.observable()
    observable = kb.utils.wrappedObservable(@, ko.dependentObservable(=> @vo()))

    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)

    # create emitter observable
    kb.utils.wrappedEventWatcher(@, new kb.EventWatcher(emitter, @, {emitter: _.bind(@emitter, @), update: _.bind(@update, @), event_selector: @event_selector}))

    return observable

  # Required clean up function to break cycles, release view models, etc.
  # Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy: -> kb.utils.wrappedDestroy(@)

  # Dual-purpose getter/setter for the observed emitter.
  #
  # @overload emitter()
  #   Gets the emitter or emitter reference
  #   @return [Model|ModelRef|Collection] the emitter whose events are being bound (can be null)
  # @overload emitter(new_emitter)
  #   Sets the emitter or emitter reference
  #   @param [Model|ModelRef|Collection] new_emitter the emitter whose events will be bound (can be null)
  emitter: (new_emitter) ->
    # get or no change
    return @ee if (arguments.length == 0) or (@ee is new_emitter)
    @update() if (@ee = new_emitter)

  ####################################################
  # Internal
  ####################################################
  # @private
  update: ->
    return unless @ee # do not trigger if there is no emitter
    if @vo() isnt @ee then @vo(@ee) else @vo.valueHasMutated() # manually trigger the dependable

# factory function
kb.triggeredObservable = (emitter, event_selector) -> return new kb.TriggeredObservable(emitter, event_selector)