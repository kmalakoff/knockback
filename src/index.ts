// Knockback.js - Knockout.js + Backbone.js integration
// Copyright (c) 2011-2024 Kevin Malakoff.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

import Backbone from 'backbone';
import ko from 'knockout';
import _ from 'underscore';

// Core
import kb from './kb.ts';
import utils from './utils.ts';

// Types
export * from './types.ts';
export { TYPE_UNKNOWN, TYPE_SIMPLE, TYPE_ARRAY, TYPE_MODEL, TYPE_COLLECTION } from './types.ts';

// Functions
export { default as extend } from './functions/extend.ts';
export { default as collapseOptions } from './functions/collapse-options.ts';
export { default as unwrapModels } from './functions/unwrap-models.ts';
export { default as wrappedDestroy } from './functions/wrapped-destroy.ts';

// Core classes
export { Factory } from './factory.ts';
export { Store } from './store.ts';
export { EventWatcher, emitterObservable } from './event-watcher.ts';
export { TypedValue } from './typed-value.ts';

// Main classes
export { Observable, observable } from './observable.ts';
export { ViewModel, viewModel } from './view-model.ts';
export { CollectionObservable, collectionObservable, observableCollection, compare } from './collection-observable.ts';

// Plugins
export * from './plugins/index.ts';

// Additional modules
export { configure, registerORM, getRegisteredORMs } from './configure.ts';
export type { ORM, ConfigureOptions } from './configure.ts';
export { Statistics } from './statistics.ts';
export type { ModelEvent, EventStats } from './statistics.ts';
export { Inject, injectViewModels, registerInjectBinding, RECURSIVE_AUTO_INJECT, setRecursiveAutoInject } from './inject.ts';
export type { InjectData, InjectOptions, InjectResult } from './inject.ts';

// Import classes for kb namespace
import { Factory } from './factory.ts';
import { Store } from './store.ts';
import { EventWatcher, emitterObservable } from './event-watcher.ts';
import { Observable, observable } from './observable.ts';
import { ViewModel, viewModel } from './view-model.ts';
import { CollectionObservable, collectionObservable, observableCollection, compare } from './collection-observable.ts';

// Import plugins for kb namespace
import {
  DefaultObservable,
  defaultObservable,
  observableDefault,
  setToDefault,
  FormattedObservable,
  formattedObservable,
  observableFormatted,
  toFormattedString,
  parseFormattedString,
  LocalizedObservable,
  localizedObservable,
  observableLocalized,
  TriggeredObservable,
  triggeredObservable,
  observableTriggered,
  valid,
  hasChangedFn,
  minLengthFn,
  uniqueValueFn,
  untilTrueFn,
  untilFalseFn,
  Validation,
  valueValidator,
  inputValidator,
  formValidator,
} from './plugins/index.ts';

// Import additional modules for kb namespace
import { configure, registerORM, getRegisteredORMs } from './configure.ts';
import { Statistics } from './statistics.ts';
import { Inject, injectViewModels, registerInjectBinding } from './inject.ts';

// Extend kb namespace with classes and factories
const kbExtended = kb as typeof kb & {
  utils: typeof utils;
  Factory: typeof Factory;
  Store: typeof Store;
  EventWatcher: typeof EventWatcher;
  emitterObservable: typeof emitterObservable;
  Observable: typeof Observable;
  observable: typeof observable;
  ViewModel: typeof ViewModel;
  viewModel: typeof viewModel;
  CollectionObservable: typeof CollectionObservable;
  collectionObservable: typeof collectionObservable;
  observableCollection: typeof observableCollection;
  compare: typeof compare;
  // Plugins
  DefaultObservable: typeof DefaultObservable;
  defaultObservable: typeof defaultObservable;
  observableDefault: typeof observableDefault;
  setToDefault: typeof setToDefault;
  FormattedObservable: typeof FormattedObservable;
  formattedObservable: typeof formattedObservable;
  observableFormatted: typeof observableFormatted;
  toFormattedString: typeof toFormattedString;
  parseFormattedString: typeof parseFormattedString;
  LocalizedObservable: typeof LocalizedObservable;
  localizedObservable: typeof localizedObservable;
  observableLocalized: typeof observableLocalized;
  TriggeredObservable: typeof TriggeredObservable;
  triggeredObservable: typeof triggeredObservable;
  observableTriggered: typeof observableTriggered;
  valid: typeof valid;
  hasChangedFn: typeof hasChangedFn;
  minLengthFn: typeof minLengthFn;
  uniqueValueFn: typeof uniqueValueFn;
  untilTrueFn: typeof untilTrueFn;
  untilFalseFn: typeof untilFalseFn;
  Validation: typeof Validation;
  valueValidator: typeof valueValidator;
  inputValidator: typeof inputValidator;
  formValidator: typeof formValidator;
  // Additional modules
  configure: typeof configure;
  registerORM: typeof registerORM;
  getRegisteredORMs: typeof getRegisteredORMs;
  Statistics: typeof Statistics;
  Inject: typeof Inject;
  injectViewModels: typeof injectViewModels;
  registerInjectBinding: typeof registerInjectBinding;
};

kbExtended.utils = utils;
kbExtended.Factory = Factory;
kbExtended.Store = Store;
kbExtended.EventWatcher = EventWatcher;
kbExtended.emitterObservable = emitterObservable;
kbExtended.Observable = Observable;
kbExtended.observable = observable;
kbExtended.ViewModel = ViewModel;
kbExtended.viewModel = viewModel;
kbExtended.CollectionObservable = CollectionObservable;
kbExtended.collectionObservable = collectionObservable;
kbExtended.observableCollection = observableCollection;
kbExtended.compare = compare;

// Add plugins to kb namespace
kbExtended.DefaultObservable = DefaultObservable;
kbExtended.defaultObservable = defaultObservable;
kbExtended.observableDefault = observableDefault;
kbExtended.setToDefault = setToDefault;
kbExtended.FormattedObservable = FormattedObservable;
kbExtended.formattedObservable = formattedObservable;
kbExtended.observableFormatted = observableFormatted;
kbExtended.toFormattedString = toFormattedString;
kbExtended.parseFormattedString = parseFormattedString;
kbExtended.LocalizedObservable = LocalizedObservable;
kbExtended.localizedObservable = localizedObservable;
kbExtended.observableLocalized = observableLocalized;
kbExtended.TriggeredObservable = TriggeredObservable;
kbExtended.triggeredObservable = triggeredObservable;
kbExtended.observableTriggered = observableTriggered;
kbExtended.valid = valid;
kbExtended.hasChangedFn = hasChangedFn;
kbExtended.minLengthFn = minLengthFn;
kbExtended.uniqueValueFn = uniqueValueFn;
kbExtended.untilTrueFn = untilTrueFn;
kbExtended.untilFalseFn = untilFalseFn;
kbExtended.Validation = Validation;
kbExtended.valueValidator = valueValidator;
kbExtended.inputValidator = inputValidator;
kbExtended.formValidator = formValidator;

// Add additional modules to kb namespace
kbExtended.configure = configure;
kbExtended.registerORM = registerORM;
kbExtended.getRegisteredORMs = getRegisteredORMs;
kbExtended.Statistics = Statistics;
kbExtended.Inject = Inject;
kbExtended.injectViewModels = injectViewModels;
kbExtended.registerInjectBinding = registerInjectBinding;

// Export kb namespace and utils
export { kbExtended as kb, utils };

// Re-export dependencies
export { _, ko, Backbone };

// Default export
export default kbExtended;
