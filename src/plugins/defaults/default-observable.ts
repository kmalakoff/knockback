import ko from 'knockout';
import _ from 'underscore';
import kb from '../../kb.ts';
import utils from '../../utils.ts';

const KEYS_PUBLISH = ['destroy', 'setToDefault'] as const;

// =============================================================================
// Interface
// =============================================================================

export interface DefaultObservableInstance {
  [key: string]: unknown;
  __kb: { observable?: ko.Observable };
  __kb_released?: boolean;
  dv: unknown;
  destroy(): void;
  setToDefault(): void;
}

// =============================================================================
// Factory Function (Primary API)
// =============================================================================

/**
 * Creates an observable that provides a default value when the target is null, undefined, or empty.
 *
 * @param targetObservable - The observable to check for null, undefined, or empty string
 * @param defaultValue - The default value. Can be a value, string or ko.observable
 * @returns A ko.observable with default value support
 *
 * @example
 *   const wrapped_name = kb.defaultObservable(kb.observable(model, 'name'), '(no name)');
 */
export function defaultObservable(targetObservable: ko.Observable, defaultValue: unknown): ko.Observable & { destroy: () => void; setToDefault: () => void } {
  // Instance state (closure-based)
  const state: DefaultObservableInstance = {
    __kb: {},
    __kb_released: false,
    dv: defaultValue,
    destroy,
    setToDefault,
  };

  const observable = utils.setObservable(
    state,
    ko.computed({
      read: () => {
        const currentTarget = ko.utils.unwrapObservable(targetObservable());
        if (_.isNull(currentTarget) || _.isUndefined(currentTarget)) {
          return ko.utils.unwrapObservable(state.dv);
        }
        return currentTarget;
      },
      write: (value: unknown) => {
        targetObservable(value);
      },
    })
  ) as ko.Observable & { destroy: () => void; setToDefault: () => void };

  // Publish public interface on the observable
  kb.publishMethods(observable, state, KEYS_PUBLISH as unknown as string[]);

  return observable;

  // =============================================================================
  // Instance Methods (closures)
  // =============================================================================

  function destroy(): void {
    utils.wrappedDestroy(state);
  }

  function setToDefault(): void {
    const obs = utils.getObservable(state) as ko.Observable;
    if (obs) {
      obs(state.dv);
    }
  }
}

export default defaultObservable;
