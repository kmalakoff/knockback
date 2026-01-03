// Knockback.js - Knockout.js + Backbone.js integration
// Copyright (c) 2011-2024 Kevin Malakoff.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

import { collectionObservable } from './collection-observable.ts';
import { applyBindings, dispose, getLocaleManager, getStatistics, isCollection, isModel, isReleaseable, isViewModel, releaseOnNodeRemove, renderTemplate, setLocaleManager, setStatistics, VERSION } from './kb.ts';
import { observable } from './observable.ts';
import { defaultObservable } from './plugins/defaults/index.ts';
import { formattedObservable, parseFormattedString, toFormattedString } from './plugins/formatting/index.ts';
import { localizedObservable } from './plugins/localization/index.ts';
import { triggeredObservable } from './plugins/triggering/index.ts';
import { formValidator, minLengthFn, valid, valueValidator } from './plugins/validation/index.ts';
import { Statistics } from './statistics.ts';
import { TYPE_ARRAY, TYPE_COLLECTION, TYPE_MODEL, TYPE_SIMPLE, TYPE_UNKNOWN } from './types.ts';
import { viewModel } from './view-model.ts';

// =============================================================================
// Core API (named exports, tree-shakeable)
// =============================================================================

export { collectionObservable, observable, viewModel };
export { VERSION };

// =============================================================================
// Memory Management
// =============================================================================

export { applyBindings, dispose, isCollection, isModel, isReleaseable, isViewModel, releaseOnNodeRemove, renderTemplate } from './kb.ts';

// =============================================================================
// Localization
// =============================================================================

export { getLocaleManager, setLocaleManager } from './kb.ts';
export { localizedObservable };

// =============================================================================
// Plugins
// =============================================================================

export { defaultObservable, formattedObservable, parseFormattedString, toFormattedString, triggeredObservable };

// =============================================================================
// Validation
// =============================================================================

export { formValidator, minLengthFn, valid, valueValidator };

// =============================================================================
// Debugging
// =============================================================================

export { getStatistics, setStatistics } from './kb.ts';
export { Statistics };

// =============================================================================
// Types
// =============================================================================

export { TYPE_ARRAY, TYPE_COLLECTION, TYPE_MODEL, TYPE_SIMPLE, TYPE_UNKNOWN };
export type { LocalizedObservableOptions } from './plugins/localization/index.ts';
export type { CollectionObservable, CollectionObservableOptions, LocaleManager, Observable, ObservableOptions, ViewModel, ViewModelOptions } from './types.ts';

// =============================================================================
// Namespace types (kb.Observable, kb.ViewModel, etc.)
// =============================================================================

export namespace kb {
  export type Observable<T = unknown> = import('./types.ts').Observable<T>;
  export type Computed<T = unknown> = import('knockout').Computed<T>;
  export type ObservableArray<T = unknown> = import('knockout').ObservableArray<T>;
  export type CollectionObservable<T = unknown> = import('./types.ts').CollectionObservable<T>;
  export type ViewModel<T extends object = Record<string, unknown>> = import('./types.ts').ViewModel<T>;
}

// =============================================================================
// Default export (backward compatibility)
// =============================================================================

import type * as Backbone from 'backbone';
import type * as ko from 'knockout';
import { ViewModelClass } from './view-model.ts';

export const kb: {
  ViewModel: new (
    ...args: unknown[]
  ) => {
    dispose(): void;
    model: ko.Computed<Backbone.Model | null> & ((value: Backbone.Model | null) => void);
    [key: string]: unknown;
  };
  observable: typeof observable;
  viewModel: typeof viewModel;
  collectionObservable: typeof collectionObservable;
  VERSION: string;
  TYPE_ARRAY: typeof TYPE_ARRAY;
  TYPE_COLLECTION: typeof TYPE_COLLECTION;
  TYPE_MODEL: typeof TYPE_MODEL;
  TYPE_SIMPLE: typeof TYPE_SIMPLE;
  TYPE_UNKNOWN: typeof TYPE_UNKNOWN;
  releaseOnNodeRemove: typeof releaseOnNodeRemove;
  applyBindings: typeof applyBindings;
  renderTemplate: typeof renderTemplate;
  isReleaseable: typeof isReleaseable;
  isModel: typeof isModel;
  isCollection: typeof isCollection;
  isViewModel: typeof isViewModel;
  dispose: typeof dispose;
  getLocaleManager: typeof getLocaleManager;
  setLocaleManager: typeof setLocaleManager;
  localizedObservable: typeof localizedObservable;
  defaultObservable: typeof defaultObservable;
  formattedObservable: typeof formattedObservable;
  parseFormattedString: typeof parseFormattedString;
  toFormattedString: typeof toFormattedString;
  triggeredObservable: typeof triggeredObservable;
  valueValidator: typeof valueValidator;
  formValidator: typeof formValidator;
  minLengthFn: typeof minLengthFn;
  valid: typeof valid;
  getStatistics: typeof getStatistics;
  setStatistics: typeof setStatistics;
  Statistics: typeof Statistics;
} = {
  // Core
  observable,
  viewModel,
  collectionObservable,
  ViewModel: ViewModelClass,
  VERSION,

  // Memory Management
  applyBindings,
  dispose,
  isCollection,
  isModel,
  isReleaseable,
  isViewModel,
  releaseOnNodeRemove,
  renderTemplate,

  // Localization
  getLocaleManager,
  setLocaleManager,
  localizedObservable,

  // Plugins
  defaultObservable,
  formattedObservable,
  parseFormattedString,
  toFormattedString,
  triggeredObservable,

  // Validation
  formValidator,
  minLengthFn,
  valid,
  valueValidator,

  // Debugging
  getStatistics,
  setStatistics,
  Statistics,

  // Types
  TYPE_ARRAY,
  TYPE_COLLECTION,
  TYPE_MODEL,
  TYPE_SIMPLE,
  TYPE_UNKNOWN,
};

Object.defineProperties(kb, {
  locale_manager: {
    enumerable: true,
    get: () => getLocaleManager(),
    set: (manager) => {
      setLocaleManager(manager);
    },
  },
  statistics: {
    enumerable: true,
    get: () => getStatistics(),
    set: (stats) => {
      setStatistics(stats);
    },
  },
});

// Set globalThis.kb for plugin compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as { kb?: typeof kb }).kb = kb;

  // Set up property forwarding for statistics
  Object.defineProperty(globalThis, 'statistics', {
    get() {
      return getStatistics();
    },
    set(stats) {
      setStatistics(stats);
    },
    configurable: true,
  });
}

export default kb;
