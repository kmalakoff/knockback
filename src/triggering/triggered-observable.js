/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

const kb = require('../core');
const EventWatcher = require('../core/event-watcher');

const { _, ko } = kb;

const KEYS_PUBLISH = ['destroy'];

// Class for observing emitter events.
//
// @example create an observable whose subscriptions are notified with the change event is triggered.
//   var triggered_observable = kb.triggeredObservable(name, 'change');
//
// @example How to watch a emitter for events.
//   var trigger_count = 0;
//   var emitter = new Backbone.Model();
//   var view_emitter = {
//     triggered_observable: kb.triggeredObservable(emitter, 'change')
//   };
//   view_emitter.counter = ko.computed(function() {
//     view_emitter.triggered_observable() // add a dependency
//     return trigger_count++
//   });
//   emitter.set(name: 'bob');       # trigger_count: 1
//   emitter.set(name: 'george');    # trigger_count: 2
//   emitter.set(last: 'smith');     # trigger_count: 3
class TriggeredObservable {

  // Used to create a new kb.Observable.
  //
  // @param [Model] emitter the emitter to observe (can be null)
  // @param [String] event_selector the event name to trigger Knockout subscriptions on.
  // @return [ko.observable] the constructor does not return 'this' but a ko.observable
  // @note the constructor does not return 'this' but a ko.observable
  constructor(emitter, event_selector) {
    this.event_selector = event_selector;
    emitter || kb._throwMissing(this, 'emitter');
    this.event_selector || kb._throwMissing(this, 'event_selector');

    // internal state
    this.vo = ko.observable();
    const observable = kb.utils.wrappedObservable(this, ko.computed(() => this.vo()));

    // publish public interface on the observable and return instead of this
    kb.publishMethods(observable, this, KEYS_PUBLISH);

    // create emitter observable
    kb.utils.wrappedEventWatcher(this, new EventWatcher(emitter, this, { emitter: _.bind(this.emitter, this), update: _.bind(this.update, this), event_selector: this.event_selector }));

    return observable;
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy() { return kb.utils.wrappedDestroy(this); }

  // Dual-purpose getter/setter for the observed emitter.
  //
  // @overload emitter()
  //   Gets the emitter or emitter reference
  //   @return [Model|ModelRef|Collection] the emitter whose events are being bound (can be null)
  // @overload emitter(new_emitter)
  //   Sets the emitter or emitter reference
  //   @param [Model|ModelRef|Collection] new_emitter the emitter whose events will be bound (can be null)
  emitter(new_emitter) {
    // get or no change
    if ((arguments.length === 0) || (this.ee === new_emitter)) return this.ee;
    this.ee = new_emitter;
    if (this.ee) return this.update();
    return undefined;
  }

  // ###################################################
  // Internal
  // ###################################################
  // @nodoc
  update() {
    if (!this.ee) return undefined; // do not trigger if there is no emitter
    if (this.vo() !== this.ee) return this.vo(this.ee);
    return this.vo.valueHasMutated();  // manually trigger the dependable
  }
}
kb.TriggeredObservable = TriggeredObservable;
module.exports = TriggeredObservable;

// factory function
kb.triggeredObservable = (...args) => new kb.TriggeredObservable(...args);
kb.observableTriggered = kb.triggeredObservable;
