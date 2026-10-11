// Knockback.js - Knockout.js + Backbone.js integration
// Copyright (c) 2011-2024 Kevin Malakoff.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

import Backbone from 'backbone';
import ko from 'knockout';
import _ from 'underscore';
import { collectionObservable, compare } from './collection-observable.ts';
import { configure, getRegisteredORMs, registerORM } from './configure.ts';
import { EventWatcher, emitterObservable } from './event-watcher.ts';
import { Factory } from './factory.ts';
import { Inject, injectViewModels, registerInjectBinding } from './inject.ts';
import type { KnockbackGlobal } from './internal-types.ts';
import { applyBindings, dispose, getLocaleManager, getStatistics, ignore, isCollection, isModel, isReleaseable, isViewModel, peek, release, releaseKeys, releaseOnNodeRemove, renderTemplate, setLocaleManager, setStatistics, VERSION, wasReleased } from './kb.ts';
import { FormattedObservable, CollectionObservable as LegacyCollectionObservable, DefaultObservable as LegacyDefaultObservable, Observable as LegacyObservable, LocalizedObservable, TriggeredObservable, Validation } from './legacy-constructors.ts';
import { observable } from './observable.ts';
import { defaultObservable } from './plugins/defaults/index.ts';
import { formattedObservable, parseFormattedString, toFormattedString } from './plugins/formatting/index.ts';
import { localizedObservable } from './plugins/localization/index.ts';
import { triggeredObservable } from './plugins/triggering/index.ts';
import { formValidator, hasChangedFn, inputValidator, minLengthFn, uniqueValueFn, untilFalseFn, untilTrueFn, valid, valueValidator } from './plugins/validation/index.ts';
import { Statistics } from './statistics.ts';
import { Store as StoreClass } from './store.ts';
import type { CollectionObservable as CollectionObservableType, LocaleManager, Observable as ObservableType, Store, ViewModel as ViewModelType } from './types.ts';
import { TYPE_ARRAY, TYPE_COLLECTION, TYPE_MODEL, TYPE_SIMPLE, TYPE_UNKNOWN } from './types.ts';
import { ViewModel as LegacyViewModel, ViewModelClass, viewModel } from './view-model.ts';

registerInjectBinding();

// =============================================================================
// Core API (named exports, tree-shakeable)
// =============================================================================

export const CollectionObservable = LegacyCollectionObservable;
export type CollectionObservable<T = unknown> = CollectionObservableType<T>;
export const DefaultObservable = LegacyDefaultObservable;
export type DefaultObservable<Read, Write = Read> = import('./plugins/defaults/default-observable.ts').DefaultObservable<Read, Write>;
export { collectionObservable, compare, Factory, FormattedObservable, Inject, injectViewModels, LocalizedObservable, observable, TriggeredObservable, Validation, VERSION, viewModel };
export const Observable = LegacyObservable;
export type Observable<T = unknown, M extends import('backbone').Model = import('backbone').Model> = ObservableType<T, M>;
export const ViewModel = LegacyViewModel;
export type ViewModel<T extends object = Record<string, unknown>, M extends import('backbone').Model = import('backbone').Model> = ViewModelType<T, M>;

// =============================================================================
// Configuration
// =============================================================================

export { configure, getRegisteredORMs, registerORM } from './configure.ts';

// =============================================================================
// Memory Management
// =============================================================================

export { EventWatcher } from './event-watcher.ts';
export { applyBindings, dispose, ignore, isCollection, isModel, isReleaseable, isViewModel, peek, release, releaseKeys, releaseOnNodeRemove, renderTemplate, wasReleased } from './kb.ts';

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

export { formValidator, hasChangedFn, inputValidator, minLengthFn, uniqueValueFn, untilFalseFn, untilTrueFn, valid, valueValidator };

// =============================================================================
// Debugging
// =============================================================================

export { getStatistics, setStatistics } from './kb.ts';
export { Statistics };

// =============================================================================
// Errors
// =============================================================================

export { KnockbackError, MissingPropertyError, NotInitializedError, ReleasedObjectError, UnexpectedValueError } from './errors/index.ts';

// =============================================================================
// Types
// =============================================================================

export type { ConfigureOptions, ORM } from './configure.ts';
export type { InjectData, InjectOptions, InjectResult } from './inject.ts';
export type { DefaultObservableValue } from './plugins/defaults/default-observable.ts';
export type { LocalizedObservableOptions } from './plugins/localization/index.ts';
export type { ReadableObservable, ValidationOptions, ValidationResult } from './plugins/validation/index.ts';
export type { CollectionCreator, CollectionObservableOptions, CollectionObservableValue, LocaleManager, ModelInput, ModelReference, ObservableOptions, ObservableValue, Store, ValueType, ViewModelOptions, ViewModelValue } from './types.ts';
export type { LegacyViewModelInstance } from './view-model.ts';
export { TYPE_ARRAY, TYPE_COLLECTION, TYPE_MODEL, TYPE_SIMPLE, TYPE_UNKNOWN };

// =============================================================================
// Namespace types (kb.Observable, kb.ViewModel, etc.)
// =============================================================================

export namespace kb {
  export type Observable<T = unknown, M extends import('backbone').Model = import('backbone').Model> = import('./types.ts').Observable<T, M>;
  export type Computed<T = unknown> = import('knockout').Computed<T>;
  export type ObservableArray<T = unknown> = import('knockout').ObservableArray<T>;
  export type CollectionObservable<T = unknown> = import('./types.ts').CollectionObservable<T>;
  export type ViewModel<T extends object = Record<string, unknown>, M extends import('backbone').Model = import('backbone').Model> = import('./types.ts').ViewModel<T, M>;
}

// =============================================================================
// Default export (backward compatibility)
// =============================================================================

import { KnockbackError, MissingPropertyError, NotInitializedError, ReleasedObjectError, UnexpectedValueError } from './errors/index.ts';
export const kb: {
  ViewModel: typeof ViewModel;
  Observable: typeof Observable;
  CollectionObservable: typeof CollectionObservable;
  DefaultObservable: typeof DefaultObservable;
  FormattedObservable: typeof FormattedObservable;
  TriggeredObservable: typeof TriggeredObservable;
  LocalizedObservable: typeof LocalizedObservable;
  Validation: typeof Validation;
  Factory: typeof Factory;
  Inject: typeof Inject;
  EventWatcher: typeof EventWatcher;
  Backbone: typeof Backbone;
  Collection: typeof Backbone.Collection;
  Events: typeof Backbone.Events;
  Model: typeof Backbone.Model;
  ko: typeof ko;
  _: typeof _;
  modules: {
    backbone: typeof Backbone;
    knockout: typeof ko;
    underscore: typeof _;
  };
  compare: typeof compare;
  ignore: typeof ignore;
  peek: typeof peek;
  injectViewModels: typeof injectViewModels;
  observable: typeof observable;
  observableCollection: typeof collectionObservable;
  observableDefault: typeof defaultObservable;
  observableFormatted: typeof formattedObservable;
  observableLocalized: typeof localizedObservable;
  observableTriggered: typeof triggeredObservable;
  emitterObservable: typeof emitterObservable;
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
  release: typeof release;
  releaseKeys: typeof releaseKeys;
  wasReleased: typeof wasReleased;
  configure: typeof configure;
  registerORM: typeof registerORM;
  getRegisteredORMs: typeof getRegisteredORMs;
  getLocaleManager: typeof getLocaleManager;
  setLocaleManager: typeof setLocaleManager;
  localeManager: LocaleManager | null;
  locale_manager: LocaleManager | null;
  localizedObservable: typeof localizedObservable;
  defaultObservable: typeof defaultObservable;
  formattedObservable: typeof formattedObservable;
  parseFormattedString: typeof parseFormattedString;
  toFormattedString: typeof toFormattedString;
  triggeredObservable: typeof triggeredObservable;
  valueValidator: typeof valueValidator;
  inputValidator: typeof inputValidator;
  formValidator: typeof formValidator;
  hasChangedFn: typeof hasChangedFn;
  minLengthFn: typeof minLengthFn;
  uniqueValueFn: typeof uniqueValueFn;
  untilFalseFn: typeof untilFalseFn;
  untilTrueFn: typeof untilTrueFn;
  valid: typeof valid;
  getStatistics: typeof getStatistics;
  setStatistics: typeof setStatistics;
  statistics: Statistics | null;
  Statistics: typeof Statistics;
  Store: new () => Store;
  KnockbackError: typeof KnockbackError;
  MissingPropertyError: typeof MissingPropertyError;
  UnexpectedValueError: typeof UnexpectedValueError;
  NotInitializedError: typeof NotInitializedError;
  ReleasedObjectError: typeof ReleasedObjectError;
} = {
  // Core
  observable,
  viewModel,
  collectionObservable,
  ViewModel,
  Observable,
  CollectionObservable,
  DefaultObservable,
  FormattedObservable,
  TriggeredObservable,
  LocalizedObservable,
  Validation,
  Factory,
  Inject,
  EventWatcher,
  Backbone,
  Collection: Backbone.Collection,
  Events: Backbone.Events,
  Model: Backbone.Model,
  ko,
  _,
  modules: {
    backbone: Backbone,
    knockout: ko,
    underscore: _,
  },
  compare,
  ignore,
  peek,
  injectViewModels,
  VERSION,

  // Memory Management
  applyBindings,
  dispose,
  release,
  releaseKeys,
  wasReleased,
  isCollection,
  isModel,
  isReleaseable,
  isViewModel,
  releaseOnNodeRemove,
  renderTemplate,

  // Configuration
  configure,
  registerORM,
  getRegisteredORMs,

  // Localization
  getLocaleManager,
  setLocaleManager,
  localeManager: getLocaleManager(),
  locale_manager: getLocaleManager(),
  localizedObservable,
  observableLocalized: localizedObservable,

  // Plugins
  defaultObservable,
  observableDefault: defaultObservable,
  formattedObservable,
  observableFormatted: formattedObservable,
  parseFormattedString,
  toFormattedString,
  triggeredObservable,
  observableTriggered: triggeredObservable,
  observableCollection: collectionObservable,
  emitterObservable,

  // Validation
  formValidator,
  hasChangedFn,
  inputValidator,
  minLengthFn,
  uniqueValueFn,
  untilFalseFn,
  untilTrueFn,
  valid,
  valueValidator,

  // Debugging
  getStatistics,
  setStatistics,
  statistics: getStatistics(),
  Statistics,
  Store: StoreClass,

  // Types
  TYPE_ARRAY,
  TYPE_COLLECTION,
  TYPE_MODEL,
  TYPE_SIMPLE,
  TYPE_UNKNOWN,

  // Errors
  KnockbackError,
  MissingPropertyError,
  UnexpectedValueError,
  NotInitializedError,
  ReleasedObjectError,
};

Object.defineProperties(kb, {
  locale_manager: {
    enumerable: true,
    get: () => getLocaleManager(),
    set: (manager) => {
      setLocaleManager(manager);
    },
  },
  localeManager: {
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
  (globalThis as KnockbackGlobal).kb = kb;
  (globalThis as KnockbackGlobal).ViewModel = ViewModelClass;
  (globalThis as KnockbackGlobal).CollectionObservable = collectionObservable;
  (globalThis as KnockbackGlobal).viewModel = viewModel;
  (globalThis as KnockbackGlobal).collectionObservable = collectionObservable;
  (globalThis as KnockbackGlobal).defaultObservable = defaultObservable;

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
