import ko from 'knockout';
export interface DefaultObservableInstance {
  [key: string]: unknown;
  __kb: {
    observable?: ko.Observable;
  };
  __kb_released?: boolean;
  dv: unknown;
  destroy(): void;
  setToDefault(): void;
}
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
export declare function defaultObservable(
  targetObservable: ko.Observable,
  defaultValue: unknown
): ko.Observable & {
  destroy: () => void;
  setToDefault: () => void;
};
export default defaultObservable;
