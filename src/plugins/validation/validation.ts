import ko from 'knockout';
import _ from 'underscore';
import { type ValidatorFn, valid } from './validators.ts';

/**
 * Helper to call a function or get a value
 */
function callOrGet(value: unknown, ...args: unknown[]): unknown {
  const unwrapped = ko.utils.unwrapObservable(value);
  if (typeof unwrapped === 'function') {
    return unwrapped(...args);
  }
  return unwrapped;
}

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
export function valueValidator(value: ko.Observable<unknown>, bindings: Record<string, ValidatorFn>, validationOptions: ValidationOptions = {}): ko.Computed<ValidationResult> {
  const opts = typeof validationOptions === 'function' ? {} : validationOptions || {};

  return ko.computed(() => {
    const results: ValidationResult = {
      $error_count: 0,
      $valid: true,
      $enabled: true,
      $disable: false,
    };

    const currentValue = ko.utils.unwrapObservable(value);

    // Check disable/enable options
    let disabled = false;
    if ('disable' in opts) {
      disabled = !!callOrGet(opts.disable);
    }
    if ('enable' in opts) {
      disabled = !callOrGet(opts.enable);
    }

    // Ensure priorities is an array
    let priorities = opts.priorities || [];
    if (!Array.isArray(priorities)) {
      priorities = [priorities];
    }

    // Run validators
    let activeIndex = priorities.length + 1;

    for (const identifier in bindings) {
      const validator = bindings[identifier];
      results[identifier] = !disabled && !!callOrGet(validator, currentValue);

      if (results[identifier]) {
        results.$error_count++;

        // Check priorities
        let identifierIndex = priorities.indexOf(identifier);
        if (identifierIndex < 0) {
          identifierIndex = priorities.length;
        }

        if (results.$active_error && identifierIndex < activeIndex) {
          results.$active_error = identifier;
          activeIndex = identifierIndex;
        } else if (!results.$active_error) {
          results.$active_error = identifier;
          activeIndex = identifierIndex;
        }
      }
    }

    // Add inverse and ensure boolean
    results.$enabled = !disabled;
    results.$disable = !!disabled;
    results.$valid = results.$error_count === 0;

    return results;
  });
}

/**
 * Creates an observable that wraps all validators for an HTML input element.
 * Automatically generates validators from input attributes for url, email, number, and required.
 *
 * @param viewModel - The view model
 * @param el - The input element
 * @param validationOptions - Validation options
 * @returns A computed observable with validation results, or null if not applicable
 */
export function inputValidator(viewModel: Record<string, unknown>, el: HTMLElement, validationOptions: ValidationOptions = {}): ko.Computed<ValidationResult> | null {
  const opts = typeof validationOptions === 'function' ? {} : validationOptions || {};
  const validators = valid;
  let inputName: string | null = el.getAttribute('name');
  if (inputName && typeof inputName !== 'string') {
    inputName = null;
  }

  // Only set up form elements with a value binding
  const bindingsAttr = el.getAttribute('data-bind');
  if (!bindingsAttr) {
    return null;
  }

  // Parse data-bind attribute
  let options: { value?: ko.Observable; validation_options?: ValidationOptions; validations?: Record<string, ValidatorFn> };
  try {
    // Use Function constructor to parse the bindings (same as Knockout does)
    const fn = new Function('sc', `with(sc[0]) { return { ${bindingsAttr} } }`);
    options = fn([viewModel]);
  } catch {
    return null;
  }

  if (!options?.value) {
    return null;
  }

  // Merge validation options
  if (options.validation_options) {
    _.defaults(options.validation_options, opts);
    Object.assign(opts, options.validation_options);
  }

  // Collect validators
  const bindings: Record<string, ValidatorFn> = {};

  // Add type-based validator
  const type = el.getAttribute('type');
  if (type && type in validators) {
    bindings[type] = validators[type as keyof typeof validators];
  }

  // Add required validator
  if (el.hasAttribute('required')) {
    bindings.required = validators.required;
  }

  // Add custom validations
  if (options.validations) {
    for (const identifier in options.validations) {
      bindings[identifier] = options.validations[identifier];
    }
  }

  const result = valueValidator(options.value, bindings, opts);

  // If there is a name, add to the view_model with $ scoping
  if (inputName && !opts.no_attach) {
    viewModel[`$${inputName}`] = result;
  }

  return result;
}

/**
 * Creates an observable that wraps all validators for all inputs on an HTML form element.
 * Aggregates helpers for $valid, $error_count, $enabled, and $disabled.
 *
 * @param viewModel - The view model
 * @param el - The form element
 * @returns An object with all validators and generated helpers
 */
export function formValidator(viewModel: Record<string, unknown>, el: HTMLElement): FormValidationResult {
  const results: Partial<FormValidationResult> = {};
  const validators: ko.Computed<ValidationResult>[] = [];

  let formName: string | null = el.getAttribute('name');
  if (formName && typeof formName !== 'string') {
    formName = null;
  }

  // Parse form's data-bind attribute for validation_options
  let validationOptions: ValidationOptions = {};
  const bindingsAttr = el.getAttribute('data-bind');
  if (bindingsAttr) {
    try {
      const fn = new Function('sc', `with(sc[0]) { return { ${bindingsAttr} } }`);
      const options = fn([viewModel]);
      if (options?.validation_options) {
        validationOptions = options.validation_options;
      }
    } catch {
      // Ignore parsing errors
    }
  }

  validationOptions.no_attach = !!formName;

  // Build up results from all inputs
  const inputs = el.getElementsByTagName('input');
  for (let i = 0; i < inputs.length; i++) {
    const inputEl = inputs[i];
    const name = inputEl.getAttribute('name');
    if (!name) continue;

    const validator = inputValidator(viewModel, inputEl, validationOptions);
    if (validator) {
      validators.push(validator);
      results[name] = validator;
    }
  }

  // Aggregate error count
  results.$error_count = ko.computed(() => {
    let errorCount = 0;
    for (const validator of validators) {
      errorCount += validator().$error_count;
    }
    return errorCount;
  });

  // Aggregate valid
  results.$valid = ko.computed(() => results.$error_count?.() === 0);

  // Aggregate enabled
  results.$enabled = ko.computed(() => {
    let enabled = true;
    for (const validator of validators) {
      enabled = enabled && validator().$enabled;
    }
    return enabled;
  });

  // Aggregate disabled
  results.$disabled = ko.computed(() => !results.$enabled?.());

  // If there is a name, add to the view_model with $ scoping
  if (formName) {
    viewModel[`$${formName}`] = results;
  }

  return results as FormValidationResult;
}

export default valueValidator;
