// Knockback.js - Knockout.js + Backbone.js integration
// Copyright (c) 2011-2024 Kevin Malakoff.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

// =============================================================================
// Core API
// =============================================================================

// CollectionObservable - bind to a Backbone collection
export { collectionObservable } from './collection-observable.ts';
// Observable - bind to a single model attribute
export { observable } from './observable.ts';
// ViewModel - auto-generate observables for all model attributes
export type { ViewModel } from './view-model.ts';
export { viewModel } from './view-model.ts';

// =============================================================================
// Core Utilities
// =============================================================================

import kb from './kb.ts';
import type { Statistics } from './statistics.ts';

/** Knockback library version */
export const VERSION = kb.VERSION;

/** Global settings for Knockback */
export const settings = kb.settings;

/** Get the locale manager for localized observables */
export const getLocaleManager = () => kb.locale_manager;

/** Set the locale manager for localized observables */
export const setLocaleManager = (manager: typeof kb.locale_manager) => {
  kb.locale_manager = manager;
};

/** Get the statistics instance for debugging */
export const getStatistics = (): Statistics | null => kb.statistics as Statistics | null;

/** Set the statistics instance for debugging */
export const setStatistics = (stats: Statistics | null): void => {
  kb.statistics = stats;
};

// =============================================================================
// Memory Management
// =============================================================================

/** Release a view model or observable and all its resources */
export const release = kb.release.bind(kb);

/** Release all observable keys on an object */
export const releaseKeys = kb.releaseKeys.bind(kb);

/** Bind automatic release to DOM node removal */
export const releaseOnNodeRemove = kb.releaseOnNodeRemove.bind(kb);

/** Apply Knockout bindings with automatic release on node removal */
export const applyBindings = kb.applyBindings.bind(kb);

/** Render a template with automatic release */
export const renderTemplate = kb.renderTemplate.bind(kb);

// =============================================================================
// Type Guards
// =============================================================================

/** Check if an object has been released */
export const wasReleased = kb.wasReleased.bind(kb);

/** Check if an object can be released */
export const isReleaseable = kb.isReleaseable.bind(kb);

/** Check if an object is a Backbone.Model */
export const isModel = kb.isModel.bind(kb);

/** Check if an object is a Backbone.Collection */
export const isCollection = kb.isCollection.bind(kb);

/** Check if an object is a Knockback ViewModel */
export const isViewModel = kb.isViewModel.bind(kb);

// =============================================================================
// Model Helpers
// =============================================================================

/** Get a value from a Backbone model */
export const getValue = kb.getValue.bind(kb);

/** Set a value on a Backbone model */
export const setValue = kb.setValue.bind(kb);

// =============================================================================
// Plugins
// =============================================================================

// Defaults - wrap observables with default values
export { defaultObservable, setToDefault } from './plugins/defaults/index.ts';

// Formatting - two-way string formatting
export { formattedObservable, parseFormattedString, toFormattedString } from './plugins/formatting/index.ts';

// Localization - locale-aware observables
export type { LocaleManager, LocalizedObservableOptions } from './plugins/localization/index.ts';
export { localizedObservable } from './plugins/localization/index.ts';

// Triggering - event-based observable updates
export { triggeredObservable } from './plugins/triggering/index.ts';

// Validation
export type { FormValidationResult, ValidationOptions, ValidationResult, ValidatorFn } from './plugins/validation/index.ts';
export { formValidator, hasChangedFn, inputValidator, minLengthFn, uniqueValueFn, untilFalseFn, untilTrueFn, valid, valueValidator } from './plugins/validation/index.ts';

// =============================================================================
// Debugging
// =============================================================================

export type { EventStats, ModelEvent } from './statistics.ts';
export { Statistics } from './statistics.ts';

// =============================================================================
// Types
// =============================================================================

// Public types only - internal types (Store, Factory, EventWatcher, KBMetadata) are not exported
export type {
  // Options for factory functions
  CollectionObservableOptions,
  CreateOptions,
  // Factory/creator types
  Creator,
  FactoriesOption,
  FilterType,
  // Return types
  KBCollectionObservable,
  KBObservable,
  // Settings
  KBSettings,
  ObservableOptions,
  // Value type
  ValueType,
  ViewModelBase,
  ViewModelOptions,
} from './types.ts';
export { TYPE_ARRAY, TYPE_COLLECTION, TYPE_MODEL, TYPE_SIMPLE, TYPE_UNKNOWN } from './types.ts';
