import ko from 'knockout';
import _ from 'underscore';
import utils from '../../utils.ts';

/**
 * Converts arguments to a formatted string using {0}, {1}, etc. placeholders
 * @param format - The format string with placeholders
 * @param args - Arguments to substitute into placeholders
 * @returns The formatted string
 */
export function toFormattedString(format: string, ...args: unknown[]): string {
  let result = format.slice();

  for (let index = 0; index < args.length; index++) {
    let value = ko.utils.unwrapObservable(args[index]);
    if (_.isUndefined(value) || _.isNull(value)) {
      value = '';
    }

    const placeholder = `{${index}}`;
    let parameterIndex = result.indexOf(placeholder);
    while (parameterIndex >= 0) {
      result = result.replace(placeholder, String(value));
      parameterIndex = result.indexOf(placeholder, parameterIndex + 1);
    }
  }

  return result;
}

/**
 * Parses a formatted string back into its component values
 * @param string - The string to parse
 * @param format - The format string used to create it
 * @returns Array of parsed values
 */
export function parseFormattedString(string: string, format: string): string[] {
  let regexString = format.slice();
  let index = 0;
  let parameterCount = 0;
  const positions: Record<number, number> = {};

  // Build regex and track positions
  while (regexString.indexOf(`{${index}}`) >= 0) {
    const placeholder = `{${index}}`;
    let parameterIndex = format.indexOf(placeholder);

    while (parameterIndex >= 0) {
      regexString = regexString.replace(placeholder, '(.*)');
      positions[parameterIndex] = index;
      parameterCount++;
      parameterIndex = format.indexOf(placeholder, parameterIndex + 1);
    }
    index++;
  }

  const count = index;
  const regex = new RegExp(regexString);
  const matches = regex.exec(string);

  if (matches) {
    matches.shift(); // Remove full match
  }

  // Return fake empty data if no matches
  if (!matches || matches.length !== parameterCount) {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push('');
    }
    return result;
  }

  // Sort positions and map format indices to match indices
  const sortedPositions = Object.keys(positions)
    .map((k) => parseInt(k, 10))
    .sort((a, b) => a - b);

  const formatIndicesToMatchedIndices: Record<number, number> = {};
  for (let matchIndex = 0; matchIndex < sortedPositions.length; matchIndex++) {
    const parameterIndex = sortedPositions[matchIndex];
    const formatIndex = positions[parameterIndex];
    if (!Object.prototype.hasOwnProperty.call(formatIndicesToMatchedIndices, formatIndex)) {
      formatIndicesToMatchedIndices[formatIndex] = matchIndex;
    }
  }

  const results: string[] = [];
  for (let i = 0; i < count; i++) {
    results.push(matches[formatIndicesToMatchedIndices[i]]);
  }

  return results;
}

/**
 * Handles two-way formatted string conversions and will reformat a string
 * when any argument changes. The format string can also be an observable.
 *
 * @example
 *   const observable = kb.formattedObservable("{0} and {1}", arg1, arg2);
 */
export class FormattedObservable {
  __kb: { observable?: ko.Observable };
  __kb_released?: boolean;

  /**
   * Create a new FormattedObservable
   *
   * @param format - The format string or observable. Format: "{0} and {1}"
   * @param args - Arguments to be formatted
   * @returns A ko.observable (not 'this')
   */
  constructor(format: string | ko.Observable<string>, args: ko.Observable[]) {
    this.__kb = {};

    const observableArgs = args;

    const observable = utils.wrappedObservable(
      this,
      ko.computed({
        read: () => {
          const formatStr = ko.utils.unwrapObservable(format) as string;
          const values = observableArgs.map((arg) => ko.utils.unwrapObservable(arg));
          return toFormattedString(formatStr, ...values);
        },
        write: (value: string) => {
          const formatStr = ko.utils.unwrapObservable(format) as string;
          const matches = parseFormattedString(value, formatStr);
          const maxCount = Math.min(observableArgs.length, matches.length);

          for (let i = 0; i < maxCount; i++) {
            observableArgs[i](matches[i]);
          }
        },
      })
    );

    return observable as unknown as FormattedObservable;
  }

  /**
   * Required clean up function to break cycles, release view models, etc.
   */
  destroy(): void {
    utils.wrappedDestroy(this);
  }
}

/**
 * Factory function for creating a FormattedObservable
 */
export function formattedObservable(format: string | ko.Observable<string>, ...args: ko.Observable[]): ko.Observable<string> {
  return new FormattedObservable(format, args) as unknown as ko.Observable<string>;
}

// Alias
export const observableFormatted = formattedObservable;

export default FormattedObservable;
