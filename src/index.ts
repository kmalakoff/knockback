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
// Memory Management
// =============================================================================

import kb from './kb.ts';

/** Release a view model or observable and all its resources */
export const release = kb.release.bind(kb);

/** Bind automatic release to DOM node removal */
export const releaseOnNodeRemove = kb.releaseOnNodeRemove.bind(kb);

/** Apply Knockout bindings with automatic release on node removal */
export const applyBindings = kb.applyBindings.bind(kb);

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

export type { CollectionObservableOptions, CreateOptions, ObservableOptions, ViewModelOptions } from './types.ts';
export { TYPE_ARRAY, TYPE_COLLECTION, TYPE_MODEL, TYPE_SIMPLE, TYPE_UNKNOWN } from './types.ts';

// =============================================================================
// kb namespace (for UMD/legacy support)
// =============================================================================

import { collectionObservable } from './collection-observable.ts';
import { observable } from './observable.ts';
import { defaultObservable, setToDefault } from './plugins/defaults/index.ts';
import { formattedObservable, parseFormattedString, toFormattedString } from './plugins/formatting/index.ts';
import { localizedObservable } from './plugins/localization/index.ts';
import { triggeredObservable } from './plugins/triggering/index.ts';
import { formValidator, hasChangedFn, inputValidator, minLengthFn, uniqueValueFn, untilFalseFn, untilTrueFn, valid, valueValidator } from './plugins/validation/index.ts';
import { viewModel } from './view-model.ts';

const kbNamespace = kb as typeof kb & {
  // Core
  observable: typeof observable;
  viewModel: typeof viewModel;
  collectionObservable: typeof collectionObservable;
  // Plugins
  defaultObservable: typeof defaultObservable;
  setToDefault: typeof setToDefault;
  formattedObservable: typeof formattedObservable;
  toFormattedString: typeof toFormattedString;
  parseFormattedString: typeof parseFormattedString;
  localizedObservable: typeof localizedObservable;
  triggeredObservable: typeof triggeredObservable;
  valueValidator: typeof valueValidator;
  inputValidator: typeof inputValidator;
  formValidator: typeof formValidator;
  valid: typeof valid;
  hasChangedFn: typeof hasChangedFn;
  minLengthFn: typeof minLengthFn;
  uniqueValueFn: typeof uniqueValueFn;
  untilTrueFn: typeof untilTrueFn;
  untilFalseFn: typeof untilFalseFn;
};

// Core
kbNamespace.observable = observable;
kbNamespace.viewModel = viewModel;
kbNamespace.collectionObservable = collectionObservable;

// Plugins
kbNamespace.defaultObservable = defaultObservable;
kbNamespace.setToDefault = setToDefault;
kbNamespace.formattedObservable = formattedObservable;
kbNamespace.toFormattedString = toFormattedString;
kbNamespace.parseFormattedString = parseFormattedString;
kbNamespace.localizedObservable = localizedObservable;
kbNamespace.triggeredObservable = triggeredObservable;
kbNamespace.valueValidator = valueValidator;
kbNamespace.inputValidator = inputValidator;
kbNamespace.formValidator = formValidator;
kbNamespace.valid = valid;
kbNamespace.hasChangedFn = hasChangedFn;
kbNamespace.minLengthFn = minLengthFn;
kbNamespace.uniqueValueFn = uniqueValueFn;
kbNamespace.untilTrueFn = untilTrueFn;
kbNamespace.untilFalseFn = untilFalseFn;

export { kbNamespace as kb };
export default kbNamespace;
