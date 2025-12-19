import type * as Backbone from 'backbone';
import ko from 'knockout';
export type ValidatorFn = (value: unknown) => boolean | unknown;
/**
 * A validator should return true if there are errors
 * (similar to the binding check in HTML, eg. $name().required)
 */
export declare const valid: {
  required: (value: unknown) => boolean;
  url: (value: unknown) => boolean;
  email: (value: unknown) => boolean;
  number: (value: unknown) => boolean;
};
/**
 * Creates a function that returns true when the model has changed from its initial state.
 * @param model - The model to watch for changes
 * @returns A function that returns true if model has changed
 */
export declare function hasChangedFn(model: Backbone.Model | ko.Observable<Backbone.Model | null>): () => boolean;
/**
 * Creates a validator that checks if a value meets a minimum length.
 * Returns true (invalid) if value doesn't exist or length is less than minimum.
 * @param length - The minimum length required
 * @returns A validator function
 */
export declare function minLengthFn(length: number): ValidatorFn;
/**
 * Creates a validator that checks for unique value in a collection.
 * @param model - The model being validated
 * @param key - The attribute key to check
 * @param collection - The collection to check against
 * @returns A validator function that returns true if value is not unique
 */
export declare function uniqueValueFn(model: Backbone.Model | ko.Observable<Backbone.Model | null>, key: string | ko.Observable<string>, collection: Backbone.Collection | ko.Observable<Backbone.Collection | null>): ValidatorFn;
/**
 * Creates a validator that returns a stand-in value until the wrapped function returns true.
 * @param standIn - The value to return until condition is met
 * @param fn - The validator function to wrap
 * @param model - Optional model observable (will reset when model changes)
 * @returns A validator function
 */
export declare function untilTrueFn(standIn: unknown, fn: ValidatorFn | ko.Observable<ValidatorFn | null>, model?: ko.Observable<unknown>): ValidatorFn;
/**
 * Creates a validator that returns a stand-in value until the wrapped function returns false.
 * @param standIn - The value to return until condition is met
 * @param fn - The validator function to wrap
 * @param model - Optional model observable (will reset when model changes)
 * @returns A validator function
 */
export declare function untilFalseFn(standIn: unknown, fn: ValidatorFn | ko.Observable<ValidatorFn | null>, model?: ko.Observable<unknown>): ValidatorFn;
export default valid;
