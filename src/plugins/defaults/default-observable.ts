import ko from 'knockout';
import _ from 'underscore';
import kb from '../../kb.ts';
import utils from '../../utils.ts';

const KEYS_PUBLISH = ['destroy', 'setToDefault'] as const;

/**
 * Used to provide a default value when an observable is null, undefined, or the empty string.
 *
 * @example
 *   const wrapped_name = kb.defaultObservable(kb.observable(model, 'name'), '(no name)');
 */
export class DefaultObservable {
  __kb: { observable?: ko.Observable };
  __kb_released?: boolean;
  dv: unknown;

  /**
   * Create a new DefaultObservable.
   *
   * @param targetObservable - The observable to check for null, undefined, or empty string
   * @param defaultValue - The default value. Can be a value, string or ko.observable
   * @returns A ko.observable (not 'this')
   */
  constructor(targetObservable: ko.Observable, defaultValue: unknown) {
    this.__kb = {};
    this.dv = defaultValue;

    const observable = utils.wrappedObservable(
      this,
      ko.computed({
        read: () => {
          const currentTarget = ko.utils.unwrapObservable(targetObservable());
          if (_.isNull(currentTarget) || _.isUndefined(currentTarget)) {
            return ko.utils.unwrapObservable(this.dv);
          }
          return currentTarget;
        },
        write: (value: unknown) => {
          targetObservable(value);
        },
      })
    ) as ko.Observable & { destroy: () => void; setToDefault: () => void };

    // Publish public interface on the observable and return instead of this
    kb.publishMethods(observable, this, KEYS_PUBLISH as unknown as string[]);

    return observable as unknown as DefaultObservable;
  }

  /**
   * Required clean up function to break cycles, release view models, etc.
   * Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
   */
  destroy(): void {
    utils.wrappedDestroy(this);
  }

  /**
   * Forces the observable to take the default value.
   * Can be used with kb.utils.setToDefault, kb.Observable.setToDefault, kb.ViewModel.setToDefault
   */
  setToDefault(): void {
    const observable = utils.wrappedObservable(this) as ko.Observable;
    if (observable) {
      observable(this.dv);
    }
  }
}

/**
 * Factory function for creating a DefaultObservable
 */
export function defaultObservable(target: ko.Observable, defaultValue: unknown): ko.Observable {
  return new DefaultObservable(target, defaultValue) as unknown as ko.Observable;
}

// Alias
export const observableDefault = defaultObservable;

export default DefaultObservable;
