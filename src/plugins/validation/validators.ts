import type * as Backbone from 'backbone';
import ko from 'knockout';
import _ from 'underscore';

// Regular expressions from Angular.js: https://github.com/angular/angular.js
const URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
const EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
const NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

export type ValidatorFn = (value: unknown) => boolean;

/**
 * A validator should return true if there are errors
 * (similar to the binding check in HTML, eg. $name().required)
 */
export const valid = {
  required: (value: unknown): boolean => !value,
  url: (value: unknown): boolean => !URL_REGEXP.test(String(value || '')),
  email: (value: unknown): boolean => !EMAIL_REGEXP.test(String(value || '')),
  number: (value: unknown): boolean => !NUMBER_REGEXP.test(String(value || '')),
};

/**
 * Creates a function that returns true when the model has changed from its initial state.
 * @param model - The model to watch for changes
 * @returns A function that returns true if model has changed
 */
export function hasChangedFn(model: Backbone.Model | ko.Observable<Backbone.Model | null>): () => boolean {
  let m: Backbone.Model | null = null;
  let attributes: Record<string, unknown> | null = null;

  return (): boolean => {
    const currentModel = ko.utils.unwrapObservable(model) as Backbone.Model | null;

    // Change in model
    if (m !== currentModel) {
      m = currentModel;
      attributes = m ? m.toJSON() : null;
      return false;
    }

    if (!m || !attributes) {
      return false;
    }

    return !_.isEqual(m.toJSON(), attributes);
  };
}

/**
 * Creates a validator that checks if a value meets a minimum length.
 * Returns true (invalid) if value doesn't exist or length is less than minimum.
 * @param length - The minimum length required
 * @returns A validator function
 */
export function minLengthFn(length: number): ValidatorFn {
  return (value: unknown): boolean => {
    if (!value) return true;
    const strValue = String(value);
    return strValue.length < length;
  };
}

/**
 * Creates a validator that checks for unique value in a collection.
 * @param model - The model being validated
 * @param key - The attribute key to check
 * @param collection - The collection to check against
 * @returns A validator function that returns true if value is not unique
 */
export function uniqueValueFn(
  model: Backbone.Model | ko.Observable<Backbone.Model | null>,
  key: string | ko.Observable<string>,
  collection: Backbone.Collection | ko.Observable<Backbone.Collection | null>
): ValidatorFn {
  return (value: unknown): boolean => {
    const m = ko.utils.unwrapObservable(model) as Backbone.Model | null;
    const k = ko.utils.unwrapObservable(key);
    const c = ko.utils.unwrapObservable(collection) as Backbone.Collection | null;

    if (!m || !k || !c) {
      return false;
    }

    return !!_.find(c.models, (test: Backbone.Model) => test !== m && test.get(k) === value);
  };
}

/**
 * Creates a validator that returns a stand-in value until the wrapped function returns true.
 * @param standIn - The value to return until condition is met
 * @param fn - The validator function to wrap
 * @param model - Optional model observable (will reset when model changes)
 * @returns A validator function
 */
export function untilTrueFn(
  standIn: unknown,
  fn: ValidatorFn | ko.Observable<ValidatorFn | null>,
  model?: ko.Observable<unknown>
): ValidatorFn {
  let wasTrue = false;

  // Reset if the model changes
  if (model && ko.isObservable(model)) {
    model.subscribe(() => {
      wasTrue = false;
    });
  }

  return (value: unknown): unknown => {
    const f = ko.utils.unwrapObservable(fn) as ValidatorFn | null;
    if (!f) {
      return ko.utils.unwrapObservable(standIn);
    }

    const result = f(ko.utils.unwrapObservable(value));
    wasTrue = wasTrue || !!result;

    return wasTrue ? result : ko.utils.unwrapObservable(standIn);
  };
}

/**
 * Creates a validator that returns a stand-in value until the wrapped function returns false.
 * @param standIn - The value to return until condition is met
 * @param fn - The validator function to wrap
 * @param model - Optional model observable (will reset when model changes)
 * @returns A validator function
 */
export function untilFalseFn(
  standIn: unknown,
  fn: ValidatorFn | ko.Observable<ValidatorFn | null>,
  model?: ko.Observable<unknown>
): ValidatorFn {
  let wasFalse = false;

  // Reset if the model changes
  if (model && ko.isObservable(model)) {
    model.subscribe(() => {
      wasFalse = false;
    });
  }

  return (value: unknown): unknown => {
    const f = ko.utils.unwrapObservable(fn) as ValidatorFn | null;
    if (!f) {
      return ko.utils.unwrapObservable(standIn);
    }

    const result = f(ko.utils.unwrapObservable(value));
    wasFalse = wasFalse || !result;

    return wasFalse ? result : ko.utils.unwrapObservable(standIn);
  };
}

export default valid;
