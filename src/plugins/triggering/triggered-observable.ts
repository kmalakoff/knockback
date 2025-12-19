import type * as Backbone from 'backbone';
import ko from 'knockout';
import { EventWatcher } from '../../event-watcher.ts';
import kb from '../../kb.ts';
import utils from '../../utils.ts';

const KEYS_PUBLISH = ['destroy'] as const;

// =============================================================================
// Interface
// =============================================================================

export interface TriggeredObservableInstance {
  [key: string]: unknown;
  __kb: { observable?: ko.Observable; event_watcher?: EventWatcher };
  __kb_released?: boolean;
  event_selector: string;
  vo: ko.Observable<Backbone.Events | null>;
  ee: Backbone.Events | null;
}

// =============================================================================
// Factory Function (Primary API)
// =============================================================================

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
export function triggeredObservable(emitter: Backbone.Events, eventSelector: string): ko.Observable & { destroy: () => void } {
  if (!emitter) {
    kb._throwMissing({ constructor: { name: 'TriggeredObservable' } }, 'emitter');
  }
  if (!eventSelector) {
    kb._throwMissing({ constructor: { name: 'TriggeredObservable' } }, 'event_selector');
  }

  // Instance state (closure-based)
  const state: TriggeredObservableInstance = {
    __kb: {},
    __kb_released: false,
    event_selector: eventSelector,
    vo: ko.observable(null),
    ee: null,
  };

  const observable = utils.setObservable(
    state,
    ko.computed(() => state.vo())
  ) as ko.Observable & { destroy: () => void };

  // Add destroy method to state for publishMethods
  (state as unknown as Record<string, unknown>).destroy = () => utils.wrappedDestroy(state);

  // Publish public interface on the observable
  kb.publishMethods(observable, state, KEYS_PUBLISH as unknown as string[]);

  // Create emitter observable via EventWatcher
  utils.setEventWatcher(
    state,
    new EventWatcher(emitter as Backbone.Model, state, {
      obj: state,
      emitter: (e: Backbone.Model | null) => setEmitter(e),
      update,
      event_selector: state.event_selector,
    })
  );

  return observable;

  // =============================================================================
  // Instance Methods (closures)
  // =============================================================================

  function setEmitter(newEmitter: Backbone.Events | null): void {
    if (state.ee === newEmitter) return;

    state.ee = newEmitter ?? null;
    if (state.ee) {
      update();
    }
  }

  function update(): void {
    if (!state.ee) return; // Do not trigger if there is no emitter

    // Manually trigger the dependable
    if (state.vo() !== state.ee) {
      state.vo(state.ee);
    } else {
      state.vo.valueHasMutated();
    }
  }
}

export default triggeredObservable;
