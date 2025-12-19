import ko from 'knockout';
import _ from 'underscore';

/**
 * Set all observables to their default values recursively.
 * Works with observables created by defaultObservable and view models.
 *
 * @param obj - The object to process (observable, view model, or plain object)
 * @returns The same object for chaining
 *
 * @example
 *   // Reset a single observable
 *   setToDefault(myObservable);
 *
 * @example
 *   // Reset all observables in a view model
 *   setToDefault(viewModel);
 */
export function setToDefault(obj: unknown): unknown {
  if (!obj) return obj;

  // Observable with setToDefault method (from defaultObservable)
  if (ko.isObservable(obj)) {
    const observable = obj as ko.Observable & { setToDefault?: () => void };
    if (observable.setToDefault) {
      observable.setToDefault();
    }
  }
  // View model or plain object - recurse into properties
  else if (_.isObject(obj)) {
    const record = obj as Record<string, unknown>;

    // Check if it's a view model with __kb metadata
    const __kb = record.__kb as { vm_keys?: Record<string, boolean> } | undefined;
    if (__kb?.vm_keys) {
      // View model - only process tracked keys
      for (const vmKey in __kb.vm_keys) {
        const value = record[vmKey] as { setToDefault?: () => void } | undefined;
        if (value?.setToDefault) {
          value.setToDefault();
        }
      }
    } else {
      // Plain object - process all properties
      for (const key in record) {
        const value = record[key];
        if (value && (ko.isObservable(value) || (typeof value !== 'function' && _.isObject(value)))) {
          // Skip private properties except __kb prefixed ones
          if (key[0] !== '_' || key.indexOf('__kb') >= 0) {
            setToDefault(value);
          }
        }
      }
    }
  }

  return obj;
}

export default setToDefault;
