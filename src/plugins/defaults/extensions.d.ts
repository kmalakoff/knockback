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
export declare function setToDefault(obj: unknown): unknown;
export default setToDefault;
