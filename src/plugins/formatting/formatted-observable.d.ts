import ko from 'knockout';
/**
 * Converts arguments to a formatted string using {0}, {1}, etc. placeholders
 * @param format - The format string with placeholders
 * @param args - Arguments to substitute into placeholders
 * @returns The formatted string
 */
export declare function toFormattedString(format: string, ...args: unknown[]): string;
/**
 * Parses a formatted string back into its component values
 * @param string - The string to parse
 * @param format - The format string used to create it
 * @returns Array of parsed values
 */
export declare function parseFormattedString(string: string, format: string): string[];
export interface FormattedObservableInstance {
  __kb: {
    observable?: ko.Observable;
  };
  __kb_released?: boolean;
  destroy(): void;
}
/**
 * Creates an observable that handles two-way formatted string conversions.
 * Will reformat a string when any argument changes. The format string can also be an observable.
 *
 * @param format - The format string or observable. Format: "{0} and {1}"
 * @param args - Arguments to be formatted
 * @returns A ko.observable with formatting support
 *
 * @example
 *   const observable = kb.formattedObservable("{0} and {1}", arg1, arg2);
 */
export declare function formattedObservable(
  format: string | ko.Observable<string>,
  ...args: ko.Observable[]
): ko.Observable<string> & {
  destroy: () => void;
};
export default formattedObservable;
