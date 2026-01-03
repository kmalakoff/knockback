// Knockback error classes with structured error codes and context

/**
 * Base error class for all Knockback errors
 */
export class KnockbackError extends Error {
  readonly code: string;
  readonly context: Record<string, unknown>;

  constructor(code: string, context: Record<string, unknown>, message: string) {
    super(message);
    this.name = 'KnockbackError';
    this.code = code;
    this.context = context;

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Thrown when a required property or parameter is missing
 *
 * @example
 * throw new MissingPropertyError('Observable', 'key');
 * // Error: Observable: key is missing
 */
export class MissingPropertyError extends KnockbackError {
  constructor(instance: string, property: string) {
    super('KB_MISSING_PROPERTY', { instance, property }, `${instance}: ${property} is missing`);
    this.name = 'MissingPropertyError';
  }
}

/**
 * Thrown when an unexpected value or condition is encountered
 *
 * @example
 * throw new UnexpectedValueError('ViewModel', 'model must be a Backbone.Model');
 * // Error: ViewModel: model must be a Backbone.Model is unexpected
 */
export class UnexpectedValueError extends KnockbackError {
  constructor(instance: string, message: string) {
    super('KB_UNEXPECTED_VALUE', { instance, message }, `${instance}: ${message} is unexpected`);
    this.name = 'UnexpectedValueError';
  }
}

/**
 * Thrown when attempting to operate on a released/disposed object
 *
 * @example
 * throw new ReleasedObjectError('Observable');
 * // Error: Cannot operate on released Observable
 */
export class ReleasedObjectError extends KnockbackError {
  constructor(instance: string) {
    super('KB_RELEASED_OBJECT', { instance }, `Cannot operate on released ${instance}`);
    this.name = 'ReleasedObjectError';
  }
}

/**
 * Thrown when a required initialization step is missing
 *
 * @example
 * throw new NotInitializedError('TypedValue', 'create_options');
 * // Error: TypedValue: create_options not initialized
 */
export class NotInitializedError extends KnockbackError {
  constructor(instance: string, property: string) {
    super('KB_NOT_INITIALIZED', { instance, property }, `${instance}: ${property} not initialized`);
    this.name = 'NotInitializedError';
  }
}
