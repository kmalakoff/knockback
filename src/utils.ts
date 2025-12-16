import Backbone from 'backbone';
import ko from 'knockout';
import _ from 'underscore';
import kb from './kb.ts';
import collapseOptions from './functions/collapse-options.ts';
import unwrapModels from './functions/unwrap-models.ts';
import wrappedDestroy from './functions/wrapped-destroy.ts';
import { TYPE_ARRAY, TYPE_COLLECTION, TYPE_MODEL, TYPE_SIMPLE, TYPE_UNKNOWN } from './types.ts';
import type { Creator, EventWatcher, Factory, KBMetadata, KBObservable, Store, ValueType, ViewModelOptions } from './types.ts';

interface KBObject {
  __kb?: KBMetadata;
}

// Library of general-purpose utilities
const utils = {
  // Get a value from __kb metadata
  get<T>(obj: KBObject, key: keyof KBMetadata, defaultValue?: T): T | undefined {
    if (!obj.__kb || !Object.prototype.hasOwnProperty.call(obj.__kb, key)) {
      return defaultValue;
    }
    return obj.__kb[key] as T;
  },

  // Set a value in __kb metadata
  set<T>(obj: KBObject, key: keyof KBMetadata, value: T): T {
    obj.__kb = obj.__kb || ({} as KBMetadata);
    (obj.__kb as Record<string, unknown>)[key] = value;
    return value;
  },

  // Set a value only if it doesn't exist
  orSet<T>(obj: KBObject, key: keyof KBMetadata, value: T): T {
    obj.__kb = obj.__kb || ({} as KBMetadata);
    if (!Object.prototype.hasOwnProperty.call(obj.__kb, key)) {
      (obj.__kb as Record<string, unknown>)[key] = value;
    }
    return obj.__kb[key] as T;
  },

  // Check if __kb has a key
  has(obj: KBObject, key: keyof KBMetadata): boolean {
    return !!obj.__kb && Object.prototype.hasOwnProperty.call(obj.__kb, key);
  },

  // Dual-purpose getter/setter for observable
  wrappedObservable(obj: KBObject, value?: ko.Observable | ko.ObservableArray): ko.Observable | ko.ObservableArray | undefined {
    if (arguments.length === 1) {
      return utils.get(obj, 'observable');
    }
    return utils.set(obj, 'observable', value);
  },

  // Dual-purpose getter/setter for object (model/collection)
  wrappedObject(obj: KBObject, value?: Backbone.Model | Backbone.Collection | null): Backbone.Model | Backbone.Collection | null | undefined {
    if (arguments.length === 1) {
      return utils.get(obj, 'object');
    }
    return utils.set(obj, 'object', value);
  },

  // Dual-purpose getter/setter for creator
  wrappedCreator(obj: KBObject, value?: Creator): Creator | undefined {
    if (arguments.length === 1) {
      return utils.get(obj, 'creator');
    }
    return utils.set(obj, 'creator', value);
  },

  // Dual-purpose getter/setter for model (returns obj itself if no model)
  wrappedModel(obj: KBObject, value?: Backbone.Model | null): Backbone.Model | KBObject | null | undefined {
    if (arguments.length === 1) {
      const model = utils.get(obj, 'object');
      return _.isUndefined(model) ? obj : model;
    }
    return utils.set(obj, 'object', value);
  },

  // Dual-purpose getter/setter for store
  wrappedStore(obj: KBObject, value?: Store): Store | undefined {
    if (arguments.length === 1) {
      return utils.get(obj, 'store');
    }
    return utils.set(obj, 'store', value);
  },

  // Dual-purpose getter/setter for store ownership
  wrappedStoreIsOwned(obj: KBObject, value?: boolean): boolean | undefined {
    if (arguments.length === 1) {
      return utils.get(obj, 'store_is_owned');
    }
    return utils.set(obj, 'store_is_owned', value);
  },

  // Dual-purpose getter/setter for factory
  wrappedFactory(obj: KBObject, value?: Factory): Factory | undefined {
    if (arguments.length === 1) {
      return utils.get(obj, 'factory');
    }
    return utils.set(obj, 'factory', value);
  },

  // Dual-purpose getter/setter for event watcher
  wrappedEventWatcher(obj: KBObject, value?: EventWatcher): EventWatcher | undefined {
    if (arguments.length === 1) {
      return utils.get(obj, 'event_watcher');
    }
    return utils.set(obj, 'event_watcher', value);
  },

  // Dual-purpose getter/setter for event watcher ownership
  wrappedEventWatcherIsOwned(obj: KBObject, value?: boolean): boolean | undefined {
    if (arguments.length === 1) {
      return utils.get(obj, 'event_watcher_is_owned');
    }
    return utils.set(obj, 'event_watcher_is_owned', value);
  },

  // Clean up wrapped values
  wrappedDestroy,

  // Get value type from observable
  valueType(observable: unknown): ValueType {
    if (!observable) return TYPE_UNKNOWN;

    const obs = observable as KBObservable;
    if (obs.__kb_is_o && typeof obs.valueType === 'function') {
      return obs.valueType();
    }
    if (obs.__kb_is_co || observable instanceof Backbone.Collection) {
      return TYPE_COLLECTION;
    }
    if (kb.isViewModel(observable) || observable instanceof Backbone.Model) {
      return TYPE_MODEL;
    }
    if (Array.isArray(observable)) {
      return TYPE_ARRAY;
    }
    return TYPE_SIMPLE;
  },

  // Join dot-delimited paths
  pathJoin(path1: string | undefined, path2: string): string {
    if (!path1) return path2;
    const prefix = path1[path1.length - 1] !== '.' ? `${path1}.` : path1;
    return prefix + path2;
  },

  // Join path with options and return new options
  optionsPathJoin<T extends { path?: string }>(options: T, path: string): T & { path: string } {
    return { ...options, path: utils.pathJoin(options.path, path) };
  },

  // Find creator from factory or ORM
  inferCreator(value: unknown, factory: Factory | undefined, path: string): Creator | null {
    if (factory) {
      const creator = factory.creatorForPath(value, path);
      if (creator) return creator;
    }

    if (!value) return null;

    // These will be set later when ViewModel and CollectionObservable are defined
    if (value instanceof Backbone.Model) {
      return (kb as { ViewModel?: Creator }).ViewModel || null;
    }
    if (value instanceof Backbone.Collection) {
      return (kb as { CollectionObservable?: Creator }).CollectionObservable || null;
    }

    return null;
  },

  // Create observable based on value type
  createFromDefaultCreator(obj: unknown, options: ViewModelOptions): unknown {
    if (kb.isModel(obj)) {
      const viewModel = (kb as { viewModel?: (m: unknown, o: unknown) => unknown }).viewModel;
      return viewModel ? viewModel(obj, options) : ko.observable(obj);
    }
    if (kb.isCollection(obj)) {
      const collectionObservable = (kb as { collectionObservable?: (c: unknown, o: unknown) => unknown }).collectionObservable;
      return collectionObservable ? collectionObservable(obj, options) : ko.observableArray([]);
    }
    if (Array.isArray(obj)) {
      return ko.observableArray(obj);
    }
    return ko.observable(obj);
  },

  // Merge options
  collapseOptions,

  // Unwrap models from view models
  unwrapModels,

  // Resolve model ref
  resolveModel(model: unknown): Backbone.Model | null {
    // ModelRef support removed in this version
    return model as Backbone.Model | null;
  },
};

export default utils;
