export interface ModelEvent {
  name: string;
  key: string;
  [key: string]: unknown;
}
export interface EventStats {
  count: number;
  [key: string]: number;
}
/**
 * Statistics is an optional component useful for measuring application performance.
 * You can record Backbone.Events that trigger ko.observable subscription updates
 * and track the memory footprint (instance count) of ViewModels and collection observables.
 */
export declare class Statistics {
  modelEventsTracker: ModelEvent[];
  registeredTracker: Record<string, unknown[]>;
  constructor();
  /**
   * Clear the tracked model events (but keep registered objects intact)
   */
  clear(): void;
  /**
   * Register a model event
   * @param event - The event to track
   */
  addModelEvent(event: ModelEvent): void;
  /**
   * Get a debug summary of registered events in human-readable form
   * @returns A formatted string summarizing the tracked events
   */
  modelEventsStatsString(): string;
  /**
   * Register an object by key
   * @param key - The type key (e.g., 'ViewModel', 'Observable')
   * @param obj - The object to register
   */
  register(key: string, obj: unknown): void;
  /**
   * Unregister an object by key
   * @param key - The type key
   * @param obj - The object to unregister
   */
  unregister(key: string, obj: unknown): void;
  /**
   * Get the count of registered objects
   * @param type - Optional type to filter by
   * @returns The number of registered objects
   */
  registeredCount(type?: string): number;
  /**
   * Get a debug summary of currently registered objects by key
   * @param successMessage - Message to return if no objects are registered
   * @returns A human-readable summary string
   */
  registeredStatsString(successMessage?: string): string;
  /**
   * Get or create a tracker array for a type
   * @private
   */
  private getRegisteredTracker;
  /**
   * Get event statistics for an object
   * @param obj - The object with events (_events or _callbacks), typically a Backbone.Model or Collection
   * @param key - Optional specific event key to check
   * @returns Statistics about the events
   */
  static eventsStats(obj: unknown, key?: string): EventStats;
}
export default Statistics;
