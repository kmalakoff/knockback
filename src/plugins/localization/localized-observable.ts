import ko from 'knockout';
import { KB_DISPOSE_STATE } from '../../constants.ts';
import { _throwMissing, _throwUnexpected, publishMethods } from '../../kb.ts';
import type { LocaleManager } from '../../types.ts';
import { attachDispose, disposeMetadata, getObservable, setObservable } from '../../utils.ts';
import { defaultObservable } from '../defaults/default-observable.ts';

const KEYS_PUBLISH = ['dispose', 'observedValue', 'resetToCurrent'] as const;

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
  __kb_dispose?: number;
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
 *     read: (key) => kb.localeManager.get(key)
 *   });
 *
 * @example
 *   // Date formatting with write support
 *   const localizedDate = kb.localizedObservable(dateValue, {
 *     read: (date) => new Intl.DateTimeFormat(kb.localeManager.getLocale()).format(date),
 *     write: (str, date) => {
 *       const parsed = new Date(str);
 *       if (!isNaN(parsed.getTime())) date.setTime(parsed.getTime());
 *     }
 *   });
 */
export function localizedObservable(value: unknown, options: LocalizedObservableOptions, viewModel?: Record<string, unknown>): ko.Observable & { dispose: () => void; observedValue: (value?: unknown) => unknown; resetToCurrent: () => void } {
  // Validate required options
  if (!options?.read) {
    _throwMissing({ constructor: { name: 'localizedObservable' } }, 'options.read');
  }
  if (!globalThis.kb?.localeManager) {
    _throwMissing({ constructor: { name: 'localizedObservable' } }, 'kb.localeManager');
  }

  // Instance state (closure-based)
  const state: LocalizedObservableState = {
    __kb: {},
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

  const observable = setObservable(
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
          _throwUnexpected({ constructor: { name: 'localizedObservable' } }, 'writing to read-only');
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
  const stateWithMethods = state as unknown as Record<string, unknown>;
  stateWithMethods.dispose = dispose;
  stateWithMethods.observedValue = observedValue;
  stateWithMethods.resetToCurrent = resetToCurrent;

  // Publish public interface on the observable
  publishMethods(observable, stateWithMethods, KEYS_PUBLISH);
  attachDispose(observable, dispose);

  // Start listening to locale changes
  const localeManager = (globalThis as unknown as { kb?: { localeManager?: LocaleManager } }).kb?.localeManager as LocaleManager | undefined;
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
    if (state.__kb_dispose && state.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) return;
    state.__kb_dispose = KB_DISPOSE_STATE.DISPOSED;
    const localeManager = (globalThis as unknown as { kb?: { localeManager?: LocaleManager } }).kb?.localeManager as LocaleManager | undefined;
    if (localeManager?.off && state.__kb._onLocaleChange) {
      localeManager.off('change', state.__kb._onLocaleChange);
    }
    state.vm = {};
    disposeMetadata(state);
  }

  function resetToCurrent(): void {
    const obs = getObservable(state) as ko.Observable;
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
