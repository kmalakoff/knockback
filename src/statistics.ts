import _ from 'underscore';

/**
 * Statistics is an optional component useful for measuring application performance.
 * You can record Backbone.Events that trigger ko.observable subscription updates
 * and track the memory footprint (instance count) of ViewModels and collection observables.
 */
export class Statistics {
  modelEventsTracker: Array<{ name: string; key: string; [key: string]: unknown }> = [];
  registeredTracker: Record<string, unknown[]> = {};

  constructor() {
    this.modelEventsTracker = [];
    this.registeredTracker = {};
  }

  /**
   * Clear the tracked model events (but keep registered objects intact)
   */
  clear(): void {
    this.modelEventsTracker = [];
  }

  /**
   * Register a model event
   * @param event - The event to track
   */
  addModelEvent(event: { name: string; key: string; [key: string]: unknown }): void {
    this.modelEventsTracker.push(event);
  }

  /**
   * Get a debug summary of registered events in human-readable form
   * @returns A formatted string summarizing the tracked events
   */
  modelEventsStatsString(): string {
    let statsString = '';
    statsString += `Total Count: ${this.modelEventsTracker.length}`;

    const eventGroups = _.groupBy(this.modelEventsTracker, (test) => `event name: '${test.name}', attribute name: '${test.key}'`);

    for (const key in eventGroups) {
      const value = eventGroups[key];
      statsString += `\n ${key}, count: ${value.length}`;
    }

    return statsString;
  }

  /**
   * Register an object by key
   * @param key - The type key (e.g., 'ViewModel', 'Observable')
   * @param obj - The object to register
   */
  register(key: string, obj: unknown): void {
    this.getRegisteredTracker(key).push(obj);
  }

  /**
   * Unregister an object by key
   * @param key - The type key
   * @param obj - The object to unregister
   */
  unregister(key: string, obj: unknown): void {
    const typeTracker = this.getRegisteredTracker(key);
    const index = typeTracker.indexOf(obj);

    if (index < 0) {
      console?.log(`kb.Statistics: failed to unregister type: ${key}`);
      return;
    }

    typeTracker.splice(index, 1);
  }

  /**
   * Get the count of registered objects
   * @param type - Optional type to filter by
   * @returns The number of registered objects
   */
  registeredCount(type?: string): number {
    if (type) {
      return this.getRegisteredTracker(type).length;
    }

    let count = 0;
    for (const typeKey in this.registeredTracker) {
      count += this.registeredTracker[typeKey].length;
    }
    return count;
  }

  /**
   * Get a debug summary of currently registered objects by key
   * @param successMessage - Message to return if no objects are registered
   * @returns A human-readable summary string
   */
  registeredStatsString(successMessage?: string): string {
    let statsString = '';
    let written = false;

    for (const type in this.registeredTracker) {
      const typeTracker = this.registeredTracker[type];
      if (!typeTracker.length) continue;

      if (written) {
        statsString += '\n ';
      }
      statsString += `${type || 'No Name'}: ${typeTracker.length}`;
      written = true;
    }

    return statsString || successMessage || '';
  }

  /**
   * Get or create a tracker array for a type
   * @private
   */
  private getRegisteredTracker(key: string): unknown[] {
    if (Object.hasOwn(this.registeredTracker, key)) {
      return this.registeredTracker[key];
    }
    const typeTracker: unknown[] = [];
    this.registeredTracker[key] = typeTracker;
    return typeTracker;
  }

  /**
   * Get event statistics for an object
   * @param obj - The object with events (_events or _callbacks), typically a Backbone.Model or Collection
   * @param key - Optional specific event key to check
   * @returns Statistics about the events
   */
  static eventsStats(obj: unknown, key?: string): { count: number; [key: string]: number } {
    const stats: { count: number; [key: string]: number } = { count: 0 };
    // biome-ignore lint/suspicious/noExplicitAny: Backbone internals
    const objAny = obj as any;
    const events = objAny._events || objAny._callbacks || {};
    const keys = key ? [key] : Object.keys(events);

    for (const eventKey of keys) {
      const node = events[eventKey];
      if (!node) continue;

      if (Array.isArray(node)) {
        stats[eventKey] = _.compact(node).length;
      } else {
        // Handle linked list structure (older Backbone versions)
        stats[eventKey] = 0;
        const linkedNode = node as { next?: unknown; tail?: unknown };
        if (linkedNode.next && linkedNode.tail) {
          let current = linkedNode;
          while (current.next !== linkedNode.tail) {
            stats[eventKey]++;
            current = current.next as typeof linkedNode;
          }
        }
      }

      stats.count += stats[eventKey];
    }

    return stats;
  }
}

export default Statistics;
