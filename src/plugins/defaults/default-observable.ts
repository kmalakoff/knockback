import ko from 'knockout';
import _ from 'underscore';
import { KB_DISPOSE_STATE } from '../../constants.ts';
import { publishMethods } from '../../kb.ts';
import { attachDispose, disposeMetadata, getObservable, setObservable } from '../../utils.ts';

const KEYS_PUBLISH = ['dispose', 'setToDefault'] as const;

// =============================================================================
// Interface
// =============================================================================

export interface DefaultObservableInstance {
  [key: string]: unknown;
  __kb: { observable?: ko.Observable };
  __kb_dispose?: number;
  dv: unknown;
  dispose(): void;
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
export function defaultObservable<T>(targetObservable: ko.Observable<T>, defaultValue: T): ko.Observable<T> & { dispose: () => void; setToDefault: () => void } {
  // Instance state (closure-based)
  const state: DefaultObservableInstance = {
    __kb: {},
    dv: defaultValue,
    dispose,
    setToDefault,
  };

  const observable = setObservable(
    state,
    ko.computed({
      read: () => {
        const currentTarget = ko.utils.unwrapObservable(targetObservable());
        if (_.isNull(currentTarget) || _.isUndefined(currentTarget)) {
          return ko.utils.unwrapObservable(state.dv);
        }
        return currentTarget;
      },
      write: (value: T) => {
        targetObservable(value);
      },
    })
  ) as ko.Observable<T> & { dispose: () => void; setToDefault: () => void };

  // Publish public interface on the observable
  publishMethods(observable, state, KEYS_PUBLISH);
  attachDispose(observable, dispose);

  return observable;

  // =============================================================================
  // Instance Methods (closures)
  // =============================================================================

  function dispose(): void {
    if (state.__kb_dispose && state.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) return;
    state.__kb_dispose = KB_DISPOSE_STATE.DISPOSED;
    disposeMetadata(state);
  }

  function setToDefault(): void {
    const obs = getObservable(state) as ko.Observable;
    if (obs) {
      obs(state.dv);
    }
  }
}

export default defaultObservable;
