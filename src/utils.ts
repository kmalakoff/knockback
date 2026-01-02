import Backbone from 'backbone';
import ko from 'knockout';
import _ from 'underscore';
import collapseOptions from './functions/collapse-options.ts';
import disposeMetadata from './functions/dispose-metadata.ts';
import unwrapModels from './functions/unwrap-models.ts';
import type { Creator } from './internal-types.ts';
import kb from './kb.ts';
import type { EventWatcher, Factory, KBMetadata, ObservableBase, Store, ValueType, ViewModelOptions } from './types.ts';
import { TYPE_ARRAY, TYPE_COLLECTION, TYPE_MODEL, TYPE_SIMPLE, TYPE_UNKNOWN } from './types.ts';

/**
 * Any object that can have __kb metadata.
 * Internal type - not exported from index.ts.
 * Uses 'any' for flexibility since this is only used internally.
 * @hidden
 * @internal
 */
// biome-ignore lint/suspicious/noExplicitAny: Internal type for objects with __kb metadata
export type KBObject = { __kb?: KBMetadata } & Record<string, any>;

// =============================================================================
// Core metadata accessors
// =============================================================================

/** Get a value from __kb metadata */
export function get<T>(obj: KBObject, key: keyof KBMetadata, defaultValue?: T): T | undefined {
  if (!obj.__kb || !Object.hasOwn(obj.__kb, key)) {
    return defaultValue;
  }
  return obj.__kb[key] as T;
}

/** Set a value in __kb metadata */
export function set<T>(obj: KBObject, key: keyof KBMetadata, value: T): T {
  obj.__kb = obj.__kb || ({} as KBMetadata);
  (obj.__kb as Record<string, unknown>)[key] = value;
  return value;
}

/** Set a value only if it doesn't exist */
export function orSet<T>(obj: KBObject, key: keyof KBMetadata, value: T): T {
  obj.__kb = obj.__kb || ({} as KBMetadata);
  if (!Object.hasOwn(obj.__kb, key)) {
    (obj.__kb as Record<string, unknown>)[key] = value;
  }
  return obj.__kb[key] as T;
}

/** Check if __kb has a key */
export function has(obj: KBObject, key: keyof KBMetadata): boolean {
  return !!obj.__kb && Object.hasOwn(obj.__kb, key);
}

// =============================================================================
// New API: Separate get/set functions
// =============================================================================

// Observable (can be Observable, Computed, or ObservableArray)
export function getObservable(obj: KBObject): ko.Observable | ko.Computed | ko.ObservableArray | undefined {
  return get(obj, 'observable');
}

export function setObservable(obj: KBObject, value: ko.Observable | ko.Computed | ko.ObservableArray): ko.Observable | ko.Computed | ko.ObservableArray {
  return set(obj, 'observable', value);
}

// Object (model/collection)
export function getObject(obj: KBObject): Backbone.Model | Backbone.Collection | null | undefined {
  return get(obj, 'object');
}

export function setObject(obj: KBObject, value: Backbone.Model | Backbone.Collection | null): Backbone.Model | Backbone.Collection | null {
  return set(obj, 'object', value);
}

// Creator
export function getCreator(obj: KBObject): Creator | undefined {
  return get(obj, 'creator');
}

export function setCreator(obj: KBObject, value: Creator): Creator {
  return set(obj, 'creator', value);
}

// Model (returns obj itself if no model stored)
export function getModel(obj: KBObject): Backbone.Model | KBObject | null | undefined {
  const model = get(obj, 'object');
  return _.isUndefined(model) ? obj : model;
}

export function setModel(obj: KBObject, value: Backbone.Model | null): Backbone.Model | null {
  return set(obj, 'object', value);
}

// Store
export function getStore(obj: KBObject): Store | undefined {
  return get(obj, 'store');
}

export function setStore(obj: KBObject, value: Store): Store {
  return set(obj, 'store', value);
}

// Store ownership
export function getStoreIsOwned(obj: KBObject): boolean | undefined {
  return get(obj, 'store_is_owned');
}

export function setStoreIsOwned(obj: KBObject, value: boolean): boolean {
  return set(obj, 'store_is_owned', value);
}

// Factory
export function getFactory(obj: KBObject): Factory | undefined {
  return get(obj, 'factory');
}

export function setFactory(obj: KBObject, value: Factory): Factory {
  return set(obj, 'factory', value);
}

// Event watcher
export function getEventWatcher(obj: KBObject): EventWatcher | undefined {
  return get(obj, 'event_watcher');
}

export function setEventWatcher(obj: KBObject, value: EventWatcher): EventWatcher {
  return set(obj, 'event_watcher', value);
}

// Event watcher ownership
export function getEventWatcherIsOwned(obj: KBObject): boolean | undefined {
  return get(obj, 'event_watcher_is_owned');
}

export function setEventWatcherIsOwned(obj: KBObject, value: boolean): boolean {
  return set(obj, 'event_watcher_is_owned', value);
}

// =============================================================================
// Legacy API: Dual-purpose wrappers (deprecated)
// =============================================================================

/** @deprecated Use getObservable/setObservable instead */
export function wrappedObservable(obj: KBObject): ko.Observable | ko.Computed | ko.ObservableArray | undefined;
export function wrappedObservable(obj: KBObject, value: ko.Observable | ko.Computed | ko.ObservableArray): ko.Observable | ko.Computed | ko.ObservableArray;
export function wrappedObservable(obj: KBObject, value?: ko.Observable | ko.Computed | ko.ObservableArray): ko.Observable | ko.Computed | ko.ObservableArray | undefined {
  return value === undefined ? getObservable(obj) : setObservable(obj, value);
}

/** @deprecated Use getObject/setObject instead */
export function wrappedObject(obj: KBObject): Backbone.Model | Backbone.Collection | null | undefined;
export function wrappedObject(obj: KBObject, value: Backbone.Model | Backbone.Collection | null): Backbone.Model | Backbone.Collection | null;
export function wrappedObject(obj: KBObject, value?: Backbone.Model | Backbone.Collection | null): Backbone.Model | Backbone.Collection | null | undefined {
  return value === undefined ? getObject(obj) : setObject(obj, value);
}

/** @deprecated Use getCreator/setCreator instead */
export function wrappedCreator(obj: KBObject): Creator | undefined;
export function wrappedCreator(obj: KBObject, value: Creator): Creator;
export function wrappedCreator(obj: KBObject, value?: Creator): Creator | undefined {
  return value === undefined ? getCreator(obj) : setCreator(obj, value);
}

/** @deprecated Use getModel/setModel instead */
export function wrappedModel(obj: KBObject): Backbone.Model | KBObject | null | undefined;
export function wrappedModel(obj: KBObject, value: Backbone.Model | null): Backbone.Model | null;
export function wrappedModel(obj: KBObject, value?: Backbone.Model | null): Backbone.Model | KBObject | null | undefined {
  return value === undefined ? getModel(obj) : setModel(obj, value);
}

/** @deprecated Use getStore/setStore instead */
export function wrappedStore(obj: KBObject): Store | undefined;
export function wrappedStore(obj: KBObject, value: Store): Store;
export function wrappedStore(obj: KBObject, value?: Store): Store | undefined {
  return value === undefined ? getStore(obj) : setStore(obj, value);
}

/** @deprecated Use getStoreIsOwned/setStoreIsOwned instead */
export function wrappedStoreIsOwned(obj: KBObject): boolean | undefined;
export function wrappedStoreIsOwned(obj: KBObject, value: boolean): boolean;
export function wrappedStoreIsOwned(obj: KBObject, value?: boolean): boolean | undefined {
  return value === undefined ? getStoreIsOwned(obj) : setStoreIsOwned(obj, value);
}

/** @deprecated Use getFactory/setFactory instead */
export function wrappedFactory(obj: KBObject): Factory | undefined;
export function wrappedFactory(obj: KBObject, value: Factory): Factory;
export function wrappedFactory(obj: KBObject, value?: Factory): Factory | undefined {
  return value === undefined ? getFactory(obj) : setFactory(obj, value);
}

/** @deprecated Use getEventWatcher/setEventWatcher instead */
export function wrappedEventWatcher(obj: KBObject): EventWatcher | undefined;
export function wrappedEventWatcher(obj: KBObject, value: EventWatcher): EventWatcher;
export function wrappedEventWatcher(obj: KBObject, value?: EventWatcher): EventWatcher | undefined {
  return value === undefined ? getEventWatcher(obj) : setEventWatcher(obj, value);
}

/** @deprecated Use getEventWatcherIsOwned/setEventWatcherIsOwned instead */
export function wrappedEventWatcherIsOwned(obj: KBObject): boolean | undefined;
export function wrappedEventWatcherIsOwned(obj: KBObject, value: boolean): boolean;
export function wrappedEventWatcherIsOwned(obj: KBObject, value?: boolean): boolean | undefined {
  return value === undefined ? getEventWatcherIsOwned(obj) : setEventWatcherIsOwned(obj, value);
}

// =============================================================================
// Utility functions
// =============================================================================

export function attachDispose(obj: Record<string, unknown>, dispose: () => void): void {
  obj.dispose = dispose;
}

export function isDisposable(obj: unknown): boolean {
  if (!obj || obj !== Object(obj) || (obj as { __kb_released?: boolean }).__kb_released) {
    return false;
  }
  return ko.isSubscribable(obj) || typeof (obj as { dispose?: () => void }).dispose === 'function';
}

function disposeValue(value: unknown): void {
  if (!value) return;

  if (Array.isArray(value)) {
    disposeArray(value);
    return;
  }

  if (ko.isObservable(value)) {
    const peekValue = kb.peek(value as ko.Observable);
    if (Array.isArray(peekValue)) {
      disposeArray(peekValue);
    }
  }

  if (kb.isViewModel(value) || isDisposable(value)) {
    (value as { dispose?: () => void }).dispose?.();
    return;
  }

  if (value === Object(value)) {
    disposeDisposableKeys(value as Record<string, unknown>);
  }
}

export function disposeArray(arr: unknown[]): void {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    disposeValue(item);
    if (kb.isViewModel(item) || isDisposable(item)) {
      arr[i] = null;
    }
  }
}

export function disposeDisposableKeys(vm: Record<string, unknown>): void {
  for (const key in vm) {
    if (key === '__kb') continue;
    const value = vm[key];
    disposeValue(value);
    if (kb.isViewModel(value) || isDisposable(value)) {
      vm[key] = null;
    }
  }
}

/** Get value type from observable */
export function valueType(observable: unknown): ValueType {
  if (!observable) return TYPE_UNKNOWN;

  const obs = observable as ObservableBase;
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
}

/** Join dot-delimited paths */
export function pathJoin(path1: string | undefined, path2: string): string {
  if (!path1) return path2;
  const prefix = path1[path1.length - 1] !== '.' ? `${path1}.` : path1;
  return prefix + path2;
}

/** Join path with options and return new options */
export function optionsPathJoin<T extends { path?: string }>(options: T, path: string): T & { path: string } {
  return { ...options, path: pathJoin(options.path, path) };
}

/** Find creator from factory or ORM */
export function inferCreator(value: unknown, factory: Factory | undefined, path: string): Creator | null {
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
}

/** Create observable based on value type */
export function createFromDefaultCreator(obj: unknown, options: ViewModelOptions): unknown {
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
}

/** Resolve model ref (ModelRef support removed in this version) */
export function resolveModel(model: unknown): Backbone.Model | null {
  return model as Backbone.Model | null;
}

// =============================================================================
// Default export: utils object (for backwards compatibility)
// =============================================================================

const utils = {
  // Core
  get,
  set,
  orSet,
  has,

  // New API
  getObservable,
  setObservable,
  getObject,
  setObject,
  getCreator,
  setCreator,
  getModel,
  setModel,
  getStore,
  setStore,
  getStoreIsOwned,
  setStoreIsOwned,
  getFactory,
  setFactory,
  getEventWatcher,
  setEventWatcher,
  getEventWatcherIsOwned,
  setEventWatcherIsOwned,

  // Legacy (deprecated)
  wrappedObservable,
  wrappedObject,
  wrappedCreator,
  wrappedModel,
  wrappedStore,
  wrappedStoreIsOwned,
  wrappedFactory,
  wrappedEventWatcher,
  wrappedEventWatcherIsOwned,

  // Cleanup
  disposeMetadata,

  // Utilities
  attachDispose,
  disposeArray,
  disposeDisposableKeys,
  isDisposable,
  valueType,
  pathJoin,
  optionsPathJoin,
  inferCreator,
  createFromDefaultCreator,
  collapseOptions,
  unwrapModels,
  resolveModel,
};

export default utils;
