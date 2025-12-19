import ko from 'knockout';
import { type ValidatorFn } from './validators.ts';
export interface ValidationOptions {
  disable?: boolean | (() => boolean);
  enable?: boolean | (() => boolean);
  priorities?: string | string[];
  no_attach?: boolean;
}
export interface ValidationResult {
  [key: string]: boolean | number | string | undefined;
  $error_count: number;
  $valid: boolean;
  $enabled: boolean;
  $disable: boolean;
  $active_error?: string;
}
export interface FormValidationResult {
  [key: string]: ko.Computed<ValidationResult> | ko.Computed<number> | ko.Computed<boolean>;
  $error_count: ko.Computed<number>;
  $valid: ko.Computed<boolean>;
  $enabled: ko.Computed<boolean>;
  $disabled: ko.Computed<boolean>;
}
/**
 * Creates an observable that wraps all validators for a value and generates helpers
 * for $valid, $error_count, $enabled, $disabled, and $active_error.
 *
 * @param value - The value to validate
 * @param bindings - Named validators to use
 * @param validationOptions - Validation options
 * @returns A computed observable with validation results
 */
export declare function valueValidator(value: ko.Observable<unknown>, bindings: Record<string, ValidatorFn>, validationOptions?: ValidationOptions): ko.Computed<ValidationResult>;
/**
 * Creates an observable that wraps all validators for an HTML input element.
 * Automatically generates validators from input attributes for url, email, number, and required.
 *
 * @param viewModel - The view model
 * @param el - The input element
 * @param validationOptions - Validation options
 * @returns A computed observable with validation results, or null if not applicable
 */
export declare function inputValidator(viewModel: Record<string, unknown>, el: HTMLElement, validationOptions?: ValidationOptions): ko.Computed<ValidationResult> | null;
/**
 * Creates an observable that wraps all validators for all inputs on an HTML form element.
 * Aggregates helpers for $valid, $error_count, $enabled, and $disabled.
 *
 * @param viewModel - The view model
 * @param el - The form element
 * @returns An object with all validators and generated helpers
 */
export declare function formValidator(viewModel: Record<string, unknown>, el: HTMLElement): FormValidationResult;
export default valueValidator;
