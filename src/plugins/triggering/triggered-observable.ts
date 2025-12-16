import type * as Backbone from 'backbone';
import ko from 'knockout';
import _ from 'underscore';
import kb from '../../kb.ts';
import utils from '../../utils.ts';
import { EventWatcher } from '../../event-watcher.ts';

const KEYS_PUBLISH = ['destroy'] as const;

/**
 * Class for observing emitter events.
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
export class TriggeredObservable {
  __kb: { observable?: ko.Observable; event_watcher?: EventWatcher };
  __kb_released?: boolean;
  event_selector: string;
  vo: ko.Observable<Backbone.Events | null>;
  ee: Backbone.Events | null = null;

  /**
   * Create a new TriggeredObservable.
   *
   * @param emitter - The emitter to observe (cannot be null)
   * @param eventSelector - The event name to trigger Knockout subscriptions on
   * @returns A ko.observable (not 'this')
   */
  constructor(emitter: Backbone.Events, eventSelector: string) {
    if (!emitter) {
      kb._throwMissing(this, 'emitter');
    }
    if (!eventSelector) {
      kb._throwMissing(this, 'event_selector');
    }

    this.__kb = {};
    this.event_selector = eventSelector;

    // Internal state
    this.vo = ko.observable(null);

    const observable = utils.wrappedObservable(
      this,
      ko.computed(() => this.vo())
    ) as ko.Observable & { destroy: () => void };

    // Publish public interface on the observable
    kb.publishMethods(observable, this, KEYS_PUBLISH as unknown as string[]);

    // Create emitter observable via EventWatcher
    utils.wrappedEventWatcher(
      this,
      new EventWatcher(emitter as Backbone.Model, this, {
        emitter: this.emitter.bind(this),
        update: this.update.bind(this),
        event_selector: this.event_selector,
      })
    );

    return observable as unknown as TriggeredObservable;
  }

  /**
   * Required clean up function to break cycles, release view models, etc.
   */
  destroy(): void {
    utils.wrappedDestroy(this);
  }

  /**
   * Dual-purpose getter/setter for the observed emitter.
   *
   * @param newEmitter - If provided, sets the emitter; otherwise gets current emitter
   * @returns The current emitter when getting, undefined when setting
   */
  emitter(newEmitter?: Backbone.Events | null): Backbone.Events | null | undefined {
    // Get or no change
    if (arguments.length === 0 || this.ee === newEmitter) {
      return this.ee;
    }

    this.ee = newEmitter ?? null;
    if (this.ee) {
      this.update();
    }

    return undefined;
  }

  /**
   * Internal update handler
   * @private
   */
  private update(): void {
    if (!this.ee) return; // Do not trigger if there is no emitter

    // Manually trigger the dependable
    if (this.vo() !== this.ee) {
      this.vo(this.ee);
    } else {
      this.vo.valueHasMutated();
    }
  }
}

/**
 * Factory function for creating a TriggeredObservable
 */
export function triggeredObservable(emitter: Backbone.Events, eventSelector: string): ko.Observable {
  return new TriggeredObservable(emitter, eventSelector) as unknown as ko.Observable;
}

// Alias
export const observableTriggered = triggeredObservable;

export default TriggeredObservable;
