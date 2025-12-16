import type * as Backbone from 'backbone';
import ko from 'knockout';
import _ from 'underscore';
import kb from '../../kb.ts';
import utils from '../../utils.ts';
import extend from '../../functions/extend.ts';
import { defaultObservable } from '../defaults/default-observable.ts';

const KEYS_PUBLISH = ['destroy', 'observedValue', 'resetToCurrent'] as const;

export interface LocaleManager extends Backbone.Events {
  get(attribute: string): unknown;
  getLocale?(): string;
}

export interface LocalizedObservableOptions {
  default?: unknown;
  onChange?: (value: unknown) => void;
}

/**
 * Abstract base class for observing localized data that changes when the locale changes.
 * You must provide the following methods in subclasses:
 *   - read: function(value, observable) - called to get the value and each time the locale changes
 *   - write: function(localized_string, value, observable) - called to set the value (optional)
 *
 * @example
 *   class ShortDateLocalizer extends kb.LocalizedObservable {
 *     read(value) {
 *       return Globalize.format(value, 'd', kb.locale_manager.getLocale());
 *     }
 *     write(localized_string, value) {
 *       const new_value = Globalize.parseDate(localized_string, 'd', kb.locale_manager.getLocale());
 *       if (!(new_value && _.isDate(new_value))) {
 *         return kb.utils.wrappedObservable(this).resetToCurrent();
 *       }
 *       return value.setTime(new_value.valueOf());
 *     }
 *   }
 */
export class LocalizedObservable {
  static extend = extend;

  __kb: {
    observable?: ko.Observable;
    _onLocaleChange?: () => void;
    _onChange?: (value: unknown) => void;
  };
  __kb_released?: boolean;
  value: unknown;
  vo: ko.Observable<unknown>;
  vm: Record<string, unknown>;

  /**
   * Create a new LocalizedObservable. This is an abstract class.
   *
   * @param value - The value to localize
   * @param options - Configuration options
   * @param options.default - A default value when value is null/empty
   * @param options.onChange - Callback when locale changes
   * @param viewModel - The view model context
   * @returns A ko.observable (not 'this')
   */
  constructor(value: unknown, options?: LocalizedObservableOptions, viewModel?: Record<string, unknown>) {
    const opts = options || {};
    this.vm = viewModel || {};
    this.value = value;

    // Validate required methods
    if (!this.read) {
      kb._throwMissing(this, 'read');
    }
    if (!kb.locale_manager) {
      kb._throwMissing(this, 'kb.locale_manager');
    }

    // Initialize __kb
    this.__kb = {};
    this.__kb._onLocaleChange = this._onLocaleChange.bind(this);
    this.__kb._onChange = opts.onChange;

    // Internal state
    const unwrappedValue = this.value ? ko.utils.unwrapObservable(this.value) : null;
    this.vo = ko.observable(unwrappedValue ? this.read(unwrappedValue, null) : null);

    let observable = utils.wrappedObservable(
      this,
      ko.computed({
        read: () => {
          if (this.value) {
            ko.utils.unwrapObservable(this.value);
          }
          this.vo(); // Create a dependency
          return this.read(ko.utils.unwrapObservable(this.value));
        },
        write: (val: unknown) => {
          if (!this.write) {
            kb._throwUnexpected(this, 'writing to read-only');
          }
          this.write(val, ko.utils.unwrapObservable(this.value));
          this.vo(val);
          if (this.__kb._onChange) {
            this.__kb._onChange(val);
          }
        },
        owner: this.vm,
      })
    ) as ko.Observable & { destroy: () => void; observedValue: (value?: unknown) => unknown; resetToCurrent: () => void };

    // Publish public interface on the observable
    kb.publishMethods(observable, this, KEYS_PUBLISH as unknown as string[]);

    // Start listening to locale changes
    const localeManager = kb.locale_manager as LocaleManager;
    if (localeManager?.on) {
      localeManager.on('change', this.__kb._onLocaleChange!);
    }

    // Wrap with default value if specified
    if (Object.prototype.hasOwnProperty.call(opts, 'default')) {
      observable = defaultObservable(observable, opts.default) as typeof observable;
    }

    return observable as unknown as LocalizedObservable;
  }

  /**
   * Abstract method - must be implemented by subclasses.
   * Called to get the localized value.
   */
  read(_value: unknown, _observable?: unknown): unknown {
    throw new Error('read method must be implemented');
  }

  /**
   * Optional method - implement in subclasses for write support.
   * Called to set the value from a localized string.
   */
  write?(_localizedString: unknown, _value: unknown): void;

  /**
   * Required clean up function to break cycles, release view models, etc.
   */
  destroy(): void {
    const localeManager = kb.locale_manager as LocaleManager;
    if (localeManager?.off && this.__kb._onLocaleChange) {
      localeManager.off('change', this.__kb._onLocaleChange);
    }
    this.vm = {};
    utils.wrappedDestroy(this);
  }

  /**
   * Used to reset the value if localization is not possible.
   */
  resetToCurrent(): void {
    const observable = utils.wrappedObservable(this) as ko.Observable;
    const currentValue = this.value ? this.read(ko.utils.unwrapObservable(this.value)) : null;

    if (observable() === currentValue) {
      return;
    }
    observable(currentValue);
  }

  /**
   * Dual purpose set/get for the observed value
   */
  observedValue(value?: unknown): unknown {
    if (arguments.length === 0) {
      return this.value;
    }
    this.value = value;
    this._onLocaleChange();
    return undefined;
  }

  /**
   * Internal handler for locale changes
   * @private
   */
  private _onLocaleChange(): void {
    const value = this.read(ko.utils.unwrapObservable(this.value));
    this.vo(value);
    if (this.__kb._onChange) {
      this.__kb._onChange(value);
    }
  }
}

/**
 * Factory function for creating a LocalizedObservable
 */
export function localizedObservable(value: unknown, options?: LocalizedObservableOptions, viewModel?: Record<string, unknown>): ko.Observable {
  return new LocalizedObservable(value, options, viewModel) as unknown as ko.Observable;
}

// Alias
export const observableLocalized = localizedObservable;

export default LocalizedObservable;
