import Backbone from 'backbone';
import ko from 'knockout';
import _ from 'underscore';
import collapseOptions from './functions/collapse-options.ts';
import disposeMetadata from './functions/dispose-metadata.ts';
import unwrapModels from './functions/unwrap-models.ts';
import type { KnockbackGlobal, StoredCreator } from './internal-types.ts';
import { isCollection, isModel, isViewModel, peek } from './kb.ts';
import type { EventWatcher, Factory, KBMetadata, ModelReference, ObservableBase, StoreInternal, ValueType, ViewModelOptions } from './types.ts';
import { TYPE_ARRAY, TYPE_COLLECTION, TYPE_MODEL, TYPE_SIMPLE, TYPE_UNKNOWN } from './types.ts';

/**
 * Metadata owners are non-null objects, including callable Knockout values.
 * MetadataOwner exposes only the reserved __kb property to these helpers.
 *
 * @hidden
 * @internal
 */
export type KBObject = object;
type MetadataOwner = { __kb?: KBMetadata | null };

// =============================================================================
// Core metadata accessors
// =============================================================================

/** Get a value from __kb metadata */
export function get<T>(obj: KBObject, key: keyof KBMetadata, defaultValue?: T): T | undefined {
  if (!(obj as MetadataOwner).__kb || !Object.hasOwn((obj as MetadataOwner).__kb as KBMetadata, key)) {
    return defaultValue;
  }
  return ((obj as MetadataOwner).__kb as KBMetadata)[key] as T;
}

/** Set a value in __kb metadata */
export function set<T>(obj: KBObject, key: keyof KBMetadata, value: T): T {
  (obj as MetadataOwner).__kb = (obj as MetadataOwner).__kb || ({} as KBMetadata);
  ((obj as MetadataOwner).__kb as Record<string, unknown>)[key] = value;
  return value;
}

/** Set a value only if it doesn't exist */
export function orSet<T>(obj: KBObject, key: keyof KBMetadata, value: T): T {
  (obj as MetadataOwner).__kb = (obj as MetadataOwner).__kb || ({} as KBMetadata);
  if (!Object.hasOwn((obj as MetadataOwner).__kb as KBMetadata, key)) {
    ((obj as MetadataOwner).__kb as Record<string, unknown>)[key] = value;
  }
  return ((obj as MetadataOwner).__kb as KBMetadata)[key] as T;
}

/** Check if __kb has a key */
export function has(obj: KBObject, key: keyof KBMetadata): boolean {
  return !!(obj as MetadataOwner).__kb && Object.hasOwn((obj as MetadataOwner).__kb as KBMetadata, key);
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
export function getCreator(obj: KBObject): StoredCreator | undefined {
  return get(obj, 'creator');
}

export function setCreator(obj: KBObject, value: StoredCreator): StoredCreator {
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
export function getStore(obj: KBObject): StoreInternal | undefined {
  return get(obj, 'store');
}

export function setStore(obj: KBObject, value: StoreInternal): StoreInternal {
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
  return get(obj, 'eventWatcher');
}

export function setEventWatcher(obj: KBObject, value: EventWatcher): EventWatcher {
  return set(obj, 'eventWatcher', value);
}

// Event watcher ownership
export function getEventWatcherIsOwned(obj: KBObject): boolean | undefined {
  return get(obj, 'eventWatcher_is_owned');
}

export function setEventWatcherIsOwned(obj: KBObject, value: boolean): boolean {
  return set(obj, 'eventWatcher_is_owned', value);
}

// =============================================================================
// Legacy API: Dual-purpose wrappers (deprecated)
// =============================================================================

/** @deprecated Use getObservable/setObservable instead */
export function wrappedObservable(obj: KBObject): ko.Observable | ko.Computed | ko.ObservableArray | undefined;
export function wrappedObservable<T extends ko.Observable | ko.Computed | ko.ObservableArray | undefined>(obj: KBObject, value: T): T;
export function wrappedObservable(obj: KBObject, value?: ko.Observable | ko.Computed | ko.ObservableArray): ko.Observable | ko.Computed | ko.ObservableArray | undefined {
  return arguments.length === 1 ? getObservable(obj) : set(obj, 'observable', value);
}

/** @deprecated Use getObject/setObject instead */
export function wrappedObject(obj: KBObject): Backbone.Model | Backbone.Collection | null | undefined;
export function wrappedObject<T extends Backbone.Model | Backbone.Collection | null | undefined>(obj: KBObject, value: T): T;
export function wrappedObject(obj: KBObject, value?: Backbone.Model | Backbone.Collection | null): Backbone.Model | Backbone.Collection | null | undefined {
  return arguments.length === 1 ? getObject(obj) : set(obj, 'object', value);
}

/** @deprecated Use getCreator/setCreator instead */
export function wrappedCreator(obj: KBObject): StoredCreator | undefined;
export function wrappedCreator<T extends StoredCreator | undefined>(obj: KBObject, value: T): T;
export function wrappedCreator(obj: KBObject, value?: StoredCreator): StoredCreator | undefined {
  return arguments.length === 1 ? getCreator(obj) : set(obj, 'creator', value);
}

/** @deprecated Use getModel/setModel instead */
export function wrappedModel(obj: KBObject): Backbone.Model | KBObject | null | undefined;
export function wrappedModel<T extends Backbone.Model | null | undefined>(obj: KBObject, value: T): T;
export function wrappedModel(obj: KBObject, value?: Backbone.Model | null): Backbone.Model | KBObject | null | undefined {
  return arguments.length === 1 ? getModel(obj) : set(obj, 'object', value);
}

/** @deprecated Use getStore/setStore instead */
export function wrappedStore(obj: KBObject): StoreInternal | undefined;
export function wrappedStore<T extends StoreInternal | undefined>(obj: KBObject, value: T): T;
export function wrappedStore(obj: KBObject, value?: StoreInternal): StoreInternal | undefined {
  return arguments.length === 1 ? getStore(obj) : set(obj, 'store', value);
}

/** @deprecated Use getStoreIsOwned/setStoreIsOwned instead */
export function wrappedStoreIsOwned(obj: KBObject): boolean | undefined;
export function wrappedStoreIsOwned<T extends boolean | undefined>(obj: KBObject, value: T): T;
export function wrappedStoreIsOwned(obj: KBObject, value?: boolean): boolean | undefined {
  return arguments.length === 1 ? getStoreIsOwned(obj) : set(obj, 'store_is_owned', value);
}

/** @deprecated Use getFactory/setFactory instead */
export function wrappedFactory(obj: KBObject): Factory | undefined;
export function wrappedFactory<T extends Factory | undefined>(obj: KBObject, value: T): T;
export function wrappedFactory(obj: KBObject, value?: Factory): Factory | undefined {
  return arguments.length === 1 ? getFactory(obj) : set(obj, 'factory', value);
}

/** @deprecated Use getEventWatcher/setEventWatcher instead */
export function wrappedEventWatcher(obj: KBObject): EventWatcher | undefined;
export function wrappedEventWatcher<T extends EventWatcher | undefined>(obj: KBObject, value: T): T;
export function wrappedEventWatcher(obj: KBObject, value?: EventWatcher): EventWatcher | undefined {
  return arguments.length === 1 ? getEventWatcher(obj) : set(obj, 'eventWatcher', value);
}

/** @deprecated Use getEventWatcherIsOwned/setEventWatcherIsOwned instead */
export function wrappedEventWatcherIsOwned(obj: KBObject): boolean | undefined;
export function wrappedEventWatcherIsOwned<T extends boolean | undefined>(obj: KBObject, value: T): T;
export function wrappedEventWatcherIsOwned(obj: KBObject, value?: boolean): boolean | undefined {
  return arguments.length === 1 ? getEventWatcherIsOwned(obj) : set(obj, 'eventWatcher_is_owned', value);
}

// =============================================================================
// Utility functions
// =============================================================================

export function attachDispose<T extends object>(obj: T, dispose: () => void): void {
  (obj as Record<string, unknown>).dispose = dispose;
}

export function isDisposable(obj: unknown): boolean {
  if (!obj || obj !== Object(obj)) {
    return false;
  }
  const disposable = obj as { __kb_dispose?: number; dispose?: () => void };
  // Check if already disposing or disposed (state >= 1)
  if (disposable.__kb_dispose && disposable.__kb_dispose >= 1) {
    return false;
  }
  return ko.isSubscribable(obj) || typeof disposable.dispose === 'function';
}

function disposeValue(value: unknown): void {
  if (!value) return;

  if (Array.isArray(value)) {
    disposeArray(value);
    return;
  }

  if (ko.isObservable(value)) {
    const peekValue = peek(value as ko.Observable);
    if (Array.isArray(peekValue)) {
      disposeArray(peekValue);
    }
  }

  if (isViewModel(value) || isDisposable(value)) {
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
    if (isViewModel(item) || isDisposable(item)) {
      arr[i] = null;
    }
  }
}

export function disposeDisposableKeys(vm: Record<string, unknown>): void {
  for (const key in vm) {
    if (key === '__kb') continue;
    const value = vm[key];
    disposeValue(value);
    if (isViewModel(value) || isDisposable(value)) {
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
  if (isViewModel(observable) || observable instanceof Backbone.Model) {
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
export function inferCreator(value: unknown, factory: Factory | undefined, path: string): StoredCreator | null {
  if (value === null || value === undefined) return null;

  if (factory) {
    const creator = factory.creatorForPath(value, path);
    if (creator) return creator;
  }

  if (!value) return null;

  // These will be set later when ViewModel and CollectionObservable are defined
  if (value instanceof Backbone.Model) {
    return (globalThis as KnockbackGlobal).ViewModel || null;
  }
  if (value instanceof Backbone.Collection) {
    return (globalThis as KnockbackGlobal).CollectionObservable || null;
  }

  return null;
}

/** Create observable based on value type */
export function createFromDefaultCreator(obj: unknown, options: ViewModelOptions): unknown {
  if (isModel(obj)) {
    return (globalThis as KnockbackGlobal).viewModel ? ((globalThis as KnockbackGlobal).viewModel as NonNullable<KnockbackGlobal['viewModel']>)(obj, options) : ko.observable(obj);
  }
  if (isCollection(obj)) {
    return (globalThis as KnockbackGlobal).collectionObservable ? ((globalThis as KnockbackGlobal).collectionObservable as NonNullable<KnockbackGlobal['collectionObservable']>)(obj, options) : ko.observableArray([]);
  }
  if (Array.isArray(obj)) {
    return ko.observableArray(obj);
  }
  return ko.observable(obj);
}

type BackboneWithModelRef = typeof Backbone & {
  ModelRef?: abstract new (...args: never[]) => ModelReference;
};

/** @internal */
export function isModelReference(model: unknown): model is ModelReference {
  const ModelRef = (Backbone as BackboneWithModelRef).ModelRef;
  return Boolean(model && ModelRef && model instanceof ModelRef);
}

/** @internal */
export function resolveModel(model: unknown): Backbone.Model | null {
  if (isModelReference(model)) {
    return model.model() || null;
  }
  return (model as Backbone.Model | null | undefined) || null;
}

// =============================================================================
// Re-export functions for convenience
// =============================================================================

export { collapseOptions, disposeMetadata, unwrapModels };
