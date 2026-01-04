import type * as Backbone from 'backbone';
import ko from 'knockout';
import { KB_DISPOSE_STATE } from '../../constants.ts';
import { EventWatcher } from '../../event-watcher.ts';
import { _throwMissing, publishMethods } from '../../kb.ts';
import { attachDispose, disposeMetadata, setEventWatcher, setObservable } from '../../utils.ts';

const KEYS_PUBLISH = ['dispose'] as const;

// =============================================================================
// Interface
// =============================================================================

export interface TriggeredObservableInstance {
  [key: string]: unknown;
  __kb: { observable?: ko.Observable; eventWatcher?: EventWatcher };
  __kb_dispose?: number;
  eventSelector: string;
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
export function triggeredObservable(emitter: Backbone.Events, eventSelector: string): ko.Observable & { dispose: () => void } {
  if (!emitter) {
    _throwMissing({ constructor: { name: 'TriggeredObservable' } }, 'emitter');
  }
  if (!eventSelector) {
    _throwMissing({ constructor: { name: 'TriggeredObservable' } }, 'eventSelector');
  }

  // Instance state (closure-based)
  const state: TriggeredObservableInstance = {
    __kb: {},
    eventSelector: eventSelector,
    vo: ko.observable(null),
    ee: null,
  };

  const observable = setObservable(
    state,
    ko.computed(() => state.vo())
  ) as ko.Observable & { dispose: () => void };

  // Add dispose method to state for publishMethods
  const dispose = () => {
    if (state.__kb_dispose && state.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) return;
    state.__kb_dispose = KB_DISPOSE_STATE.DISPOSED;
    disposeMetadata(state);
  };

  const stateWithMethods = state as unknown as Record<string, unknown>;
  stateWithMethods.dispose = dispose;

  // Publish public interface on the observable
  publishMethods(observable, stateWithMethods, KEYS_PUBLISH);
  attachDispose(observable, dispose);

  // Create emitter observable via EventWatcher
  setEventWatcher(
    state,
    new EventWatcher(emitter as Backbone.Model, state, {
      obj: state,
      emitter: (e: Backbone.Model | null) => setEmitter(e),
      update,
      eventSelector: state.eventSelector,
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
