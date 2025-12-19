import ko from 'knockout';
import type { LocaleManager } from '../../types.ts';
export type { LocaleManager };
export interface LocalizedObservableOptions {
  /** Required: function to read/format the localized value */
  read: (value: unknown) => unknown;
  /** Optional: function to write/parse the localized value back */
  write?: (localizedString: unknown, value: unknown) => void;
  /** Optional: default value when value is null/empty */
  default?: unknown;
  /** Optional: callback when locale changes */
  onChange?: (value: unknown) => void;
}
/**
 * Creates a localized observable that updates when the locale changes.
 *
 * @param value - The value to localize (can be an observable)
 * @param options - Configuration options including read/write functions
 * @param viewModel - Optional view model context
 * @returns A ko.observable that updates on locale changes
 *
 * @example
 *   // Simple translation lookup
 *   const greeting = kb.localizedObservable('greeting_key', {
 *     read: (key) => kb.locale_manager.get(key)
 *   });
 *
 * @example
 *   // Date formatting with write support
 *   const localizedDate = kb.localizedObservable(dateValue, {
 *     read: (date) => new Intl.DateTimeFormat(kb.locale_manager.getLocale()).format(date),
 *     write: (str, date) => {
 *       const parsed = new Date(str);
 *       if (!isNaN(parsed.getTime())) date.setTime(parsed.getTime());
 *     }
 *   });
 */
export declare function localizedObservable(
  value: unknown,
  options: LocalizedObservableOptions,
  viewModel?: Record<string, unknown>
): ko.Observable & {
  destroy: () => void;
  observedValue: (value?: unknown) => unknown;
  resetToCurrent: () => void;
};
export default localizedObservable;
