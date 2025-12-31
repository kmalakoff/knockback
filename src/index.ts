// Knockback.js - Knockout.js + Backbone.js integration
// Copyright (c) 2011-2024 Kevin Malakoff.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

import type * as Backbone from 'backbone';
import type * as ko from 'knockout';
import { collectionObservable } from './collection-observable.ts';
import kb from './kb.ts';
import { observable } from './observable.ts';
import { defaultObservable } from './plugins/defaults/index.ts';
import { formattedObservable, parseFormattedString, toFormattedString } from './plugins/formatting/index.ts';
import { localizedObservable } from './plugins/localization/index.ts';
import { triggeredObservable } from './plugins/triggering/index.ts';
import { formValidator, minLengthFn, valid, valueValidator } from './plugins/validation/index.ts';
import { Statistics } from './statistics.ts';
import type { LocaleManager } from './types.ts';
import { TYPE_ARRAY, TYPE_COLLECTION, TYPE_MODEL, TYPE_SIMPLE, TYPE_UNKNOWN } from './types.ts';
import { ViewModelClass, viewModel } from './view-model.ts';

// =============================================================================
// Core API (named exports, tree-shakeable)
// =============================================================================

export { observable, viewModel, collectionObservable };
export const VERSION = kb.VERSION;

// =============================================================================
// Memory Management
// =============================================================================

export const release = kb.release.bind(kb);
export const releaseOnNodeRemove = kb.releaseOnNodeRemove.bind(kb);
export const applyBindings = kb.applyBindings.bind(kb);
export const renderTemplate = kb.renderTemplate.bind(kb);
export const wasReleased = kb.wasReleased.bind(kb);
export const isReleaseable = kb.isReleaseable.bind(kb);
export const isModel = kb.isModel.bind(kb);
export const isCollection = kb.isCollection.bind(kb);
export const isViewModel = kb.isViewModel.bind(kb);

// =============================================================================
// Localization
// =============================================================================

export const getLocaleManager = (): LocaleManager | null => kb.locale_manager;
export const setLocaleManager = (manager: LocaleManager | null): void => {
  kb.locale_manager = manager;
};
export { localizedObservable };

// =============================================================================
// Plugins
// =============================================================================

export { defaultObservable, formattedObservable, parseFormattedString, toFormattedString, triggeredObservable };

// =============================================================================
// Validation
// =============================================================================

export { valueValidator, formValidator, minLengthFn, valid };

// =============================================================================
// Debugging
// =============================================================================

export const getStatistics = (): Statistics | null => kb.statistics as Statistics | null;
export const setStatistics = (stats: Statistics | null): void => {
  kb.statistics = stats;
};
export { Statistics };

// =============================================================================
// Types
// =============================================================================

export { TYPE_ARRAY, TYPE_COLLECTION, TYPE_MODEL, TYPE_SIMPLE, TYPE_UNKNOWN };
export type { LocalizedObservableOptions } from './plugins/localization/index.ts';
export type { CollectionObservable, CollectionObservableOptions, LocaleManager, Observable, ObservableOptions, ViewModel, ViewModelOptions } from './types.ts';

// =============================================================================
// Default export (compat namespace)
// =============================================================================

const kbNamespace: {
  ViewModel: new (
    ...args: unknown[]
  ) => {
    destroy(): void;
    model: ko.Computed<Backbone.Model | null>;
    createObservables(model: Backbone.Model, keys: string[]): void;
    [key: string]: unknown;
  };
  observable: typeof observable;
  viewModel: typeof viewModel;
  collectionObservable: typeof collectionObservable;
  VERSION: typeof VERSION;
  TYPE_ARRAY: typeof TYPE_ARRAY;
  TYPE_COLLECTION: typeof TYPE_COLLECTION;
  TYPE_MODEL: typeof TYPE_MODEL;
  TYPE_SIMPLE: typeof TYPE_SIMPLE;
  TYPE_UNKNOWN: typeof TYPE_UNKNOWN;
  release: typeof release;
  releaseOnNodeRemove: typeof releaseOnNodeRemove;
  applyBindings: typeof applyBindings;
  renderTemplate: typeof renderTemplate;
  wasReleased: typeof wasReleased;
  isReleaseable: typeof isReleaseable;
  isModel: typeof isModel;
  isCollection: typeof isCollection;
  isViewModel: typeof isViewModel;
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
  Statistics: typeof Statistics;
} = {
  observable,
  viewModel,
  ViewModel: ViewModelClass,
  collectionObservable,
  VERSION,
  TYPE_ARRAY,
  TYPE_COLLECTION,
  TYPE_MODEL,
  TYPE_SIMPLE,
  TYPE_UNKNOWN,
  release,
  releaseOnNodeRemove,
  applyBindings,
  renderTemplate,
  wasReleased,
  isReleaseable,
  isModel,
  isCollection,
  isViewModel,
  localizedObservable,
  defaultObservable,
  formattedObservable,
  parseFormattedString,
  toFormattedString,
  triggeredObservable,
  valueValidator,
  formValidator,
  minLengthFn,
  valid,
  Statistics,
};

Object.defineProperties(kbNamespace, {
  locale_manager: {
    enumerable: true,
    get: () => kb.locale_manager,
    set: (manager: LocaleManager | null) => {
      kb.locale_manager = manager;
    },
  },
  statistics: {
    enumerable: true,
    get: () => kb.statistics as Statistics | null,
    set: (stats: Statistics | null) => {
      kb.statistics = stats;
    },
  },
});

export default kbNamespace;
