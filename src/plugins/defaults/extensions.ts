import ko from 'knockout';
import _ from 'underscore';
import { Observable } from '../../observable.ts';
import { ViewModel } from '../../view-model.ts';

/**
 * Extend Observable prototype with setToDefault
 */
Observable.prototype.setToDefault = function (this: Observable): void {
  const kbValue = (this as unknown as { __kb_value?: { setToDefault?: () => void } }).__kb_value;
  if (kbValue?.setToDefault) {
    kbValue.setToDefault();
  }
};

/**
 * Extend ViewModel prototype with setToDefault
 */
ViewModel.prototype.setToDefault = function (this: ViewModel): void {
  const __kb = this.__kb as { vm_keys?: Record<string, boolean> };
  if (!__kb.vm_keys) return;

  for (const vmKey in __kb.vm_keys) {
    const value = (this as Record<string, unknown>)[vmKey] as { setToDefault?: () => void } | undefined;
    if (value?.setToDefault) {
      value.setToDefault();
    }
  }
};

/**
 * Set all observables to their default values recursively
 * @param obj - The object to process
 * @returns The same object for chaining
 */
export function setToDefault(obj: unknown): unknown {
  if (!obj) return obj;

  // Observable
  if (ko.isObservable(obj)) {
    const observable = obj as ko.Observable & { setToDefault?: () => void };
    if (observable.setToDefault) {
      observable.setToDefault();
    }
  }
  // View model or plain object
  else if (_.isObject(obj)) {
    const record = obj as Record<string, unknown>;
    for (const key in record) {
      const value = record[key];
      if (value && (ko.isObservable(value) || typeof value !== 'function')) {
        // Skip private properties except __kb prefixed ones
        if (key[0] !== '_' || key.indexOf('__kb') >= 0) {
          setToDefault(value);
        }
      }
    }
  }

  return obj;
}

// Augment module declarations for prototype extensions
declare module '../../observable.ts' {
  interface Observable {
    setToDefault(): void;
  }
}

declare module '../../view-model.ts' {
  interface ViewModel {
    setToDefault(): void;
  }
}

export default setToDefault;
