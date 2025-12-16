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

// Import classes for kb namespace
import { Factory } from './factory.ts';
import { Store } from './store.ts';
import { EventWatcher, emitterObservable } from './event-watcher.ts';
import { Observable, observable } from './observable.ts';
import { ViewModel, viewModel } from './view-model.ts';
import { CollectionObservable, collectionObservable, observableCollection, compare } from './collection-observable.ts';

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

// Export kb namespace and utils
export { kbExtended as kb, utils };

// Re-export dependencies
export { _, ko, Backbone };

// Default export
export default kbExtended;
