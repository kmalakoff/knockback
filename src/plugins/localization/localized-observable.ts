import ko from 'knockout';
import kb from '../../kb.ts';
import type { LocaleManager } from '../../types.ts';
import utils from '../../utils.ts';
import { defaultObservable } from '../defaults/default-observable.ts';

const KEYS_PUBLISH = ['dispose', 'observedValue', 'resetToCurrent'] as const;

// Re-export LocaleManager type for backwards compatibility
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

interface LocalizedObservableState {
  __kb: {
    observable?: ko.Observable;
    _onLocaleChange?: () => void;
    _onChange?: (value: unknown) => void;
  };
  __kb_released?: boolean;
  value: unknown;
  vo: ko.Observable<unknown>;
  vm: Record<string, unknown>;
  readFn: (value: unknown) => unknown;
  writeFn?: (localizedString: unknown, value: unknown) => void;
}

// =============================================================================
// Factory Function (Primary API)
// =============================================================================

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
export function localizedObservable(value: unknown, options: LocalizedObservableOptions, viewModel?: Record<string, unknown>): ko.Observable & { dispose: () => void; observedValue: (value?: unknown) => unknown; resetToCurrent: () => void } {
  // Validate required options
  if (!options?.read) {
    kb._throwMissing({ constructor: { name: 'localizedObservable' } }, 'options.read');
  }
  if (!kb.locale_manager) {
    kb._throwMissing({ constructor: { name: 'localizedObservable' } }, 'kb.locale_manager');
  }

  // Instance state (closure-based)
  const state: LocalizedObservableState = {
    __kb: {},
    __kb_released: false,
    value,
    vo: ko.observable(null),
    vm: viewModel || {},
    readFn: options.read,
    writeFn: options.write,
  };

  state.__kb._onLocaleChange = onLocaleChange;
  state.__kb._onChange = options.onChange;

  // Initialize value
  const unwrappedValue = state.value ? ko.utils.unwrapObservable(state.value) : null;
  if (unwrappedValue) {
    state.vo(state.readFn(unwrappedValue));
  }

  const observable = utils.setObservable(
    state,
    ko.computed({
      read: () => {
        if (state.value) {
          ko.utils.unwrapObservable(state.value);
        }
        state.vo(); // Create a dependency
        return state.readFn(ko.utils.unwrapObservable(state.value));
      },
      write: (val: unknown) => {
        if (!state.writeFn) {
          kb._throwUnexpected({ constructor: { name: 'localizedObservable' } }, 'writing to read-only');
        }
        state.writeFn(val, ko.utils.unwrapObservable(state.value));
        state.vo(val);
        if (state.__kb._onChange) {
          state.__kb._onChange(val);
        }
      },
      owner: state.vm,
    })
  ) as ko.Observable & { dispose: () => void; observedValue: (value?: unknown) => unknown; resetToCurrent: () => void };

  // Add methods to state for publishMethods to find
  (state as unknown as Record<string, unknown>).dispose = dispose;
  (state as unknown as Record<string, unknown>).observedValue = observedValue;
  (state as unknown as Record<string, unknown>).resetToCurrent = resetToCurrent;

  // Publish public interface on the observable
  kb.publishMethods(observable as unknown as Record<string, unknown>, state as unknown as Record<string, unknown>, KEYS_PUBLISH as unknown as string[]);
  utils.attachDispose(observable as unknown as Record<string, unknown>, dispose);

  // Start listening to locale changes
  const localeManager = kb.locale_manager as LocaleManager;
  if (localeManager?.on && state.__kb._onLocaleChange) {
    localeManager.on('change', state.__kb._onLocaleChange);
  }

  // Wrap with default value if specified
  // biome-ignore lint/suspicious/noExplicitAny: Wrapping observable with default value changes type
  let result: any = observable;
  if (options.default !== undefined) {
    result = defaultObservable<unknown>(observable, options.default);
  }

  return result;

  // =============================================================================
  // Instance Methods (closures)
  // =============================================================================

  function dispose(): void {
    if (state.__kb_released) return;
    state.__kb_released = true;
    const localeManager = kb.locale_manager as LocaleManager;
    if (localeManager?.off && state.__kb._onLocaleChange) {
      localeManager.off('change', state.__kb._onLocaleChange);
    }
    state.vm = {};
    utils.disposeMetadata(state);
  }

  function resetToCurrent(): void {
    const obs = utils.getObservable(state) as ko.Observable;
    const currentValue = state.value ? state.readFn(ko.utils.unwrapObservable(state.value)) : null;

    if (obs() === currentValue) {
      return;
    }
    obs(currentValue);
  }

  function observedValue(newValue?: unknown): unknown {
    if (newValue === undefined) {
      return state.value;
    }
    state.value = newValue;
    onLocaleChange();
    return undefined;
  }

  function onLocaleChange(): void {
    const localizedValue = state.readFn(ko.utils.unwrapObservable(state.value));
    state.vo(localizedValue);
    if (state.__kb._onChange) {
      state.__kb._onChange(localizedValue);
    }
  }
}

export default localizedObservable;
