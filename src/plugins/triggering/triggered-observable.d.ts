import type * as Backbone from 'backbone';
import ko from 'knockout';
import { EventWatcher } from '../../event-watcher.ts';
export interface TriggeredObservableInstance {
  [key: string]: unknown;
  __kb: {
    observable?: ko.Observable;
    event_watcher?: EventWatcher;
  };
  __kb_released?: boolean;
  event_selector: string;
  vo: ko.Observable<Backbone.Events | null>;
  ee: Backbone.Events | null;
}
/**
 * Creates an observable that triggers subscriptions when specified events occur.
 *
 * @param emitter - The emitter to observe (cannot be null)
 * @param eventSelector - The event name to trigger Knockout subscriptions on
 * @returns A ko.observable that triggers on events
 *
 * @example Create an observable whose subscriptions are notified when the change event is triggered:
 *   const triggered_observable = kb.triggeredObservable(model, 'change');
 *
 * @example Watch an emitter for events:
 *   let trigger_count = 0;
 *   const emitter = new Backbone.Model();
 *   const view_emitter = {
 *     triggered_observable: kb.triggeredObservable(emitter, 'change')
 *   };
 *   view_emitter.counter = ko.computed(() => {
 *     view_emitter.triggered_observable(); // add a dependency
 *     return trigger_count++;
 *   });
 *   emitter.set({name: 'bob'});     // trigger_count: 1
 *   emitter.set({name: 'george'});  // trigger_count: 2
 *   emitter.set({last: 'smith'});   // trigger_count: 3
 */
export declare function triggeredObservable(
  emitter: Backbone.Events,
  eventSelector: string
): ko.Observable & {
  destroy: () => void;
};
export default triggeredObservable;
