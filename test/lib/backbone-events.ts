type BackboneEventMap = Record<string, unknown>;

function isBackboneEventMap(value: unknown): value is BackboneEventMap {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function listenerCount(object: object, eventName: string): number {
  const events = '_events' in object ? object._events : undefined;
  if (events === undefined || events === null) return 0;
  if (!isBackboneEventMap(events)) throw new TypeError('Backbone event state must be an object');

  const listeners = events[eventName];
  if (!listeners) return 0;
  return Array.isArray(listeners) ? listeners.length : 1;
}
