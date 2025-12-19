import type * as Backbone from 'backbone';
import type * as ko from 'knockout';

// Value type constants
export const TYPE_UNKNOWN = 0;
export const TYPE_SIMPLE = 1;
export const TYPE_ARRAY = 2;
export const TYPE_MODEL = 3;
export const TYPE_COLLECTION = 4;

export type ValueType = typeof TYPE_UNKNOWN | typeof TYPE_SIMPLE | typeof TYPE_ARRAY | typeof TYPE_MODEL | typeof TYPE_COLLECTION;

// =============================================================================
// Forward declarations for classes
// These interfaces define the PUBLIC API contract for each class
// =============================================================================

/** Store for caching and sharing view models */
export interface Store {
  __kb_released?: boolean;
  destroy(): void;
  clear(): void;
  compact(): void;
  release(observable: unknown, force?: boolean): void;
  retain(observable: unknown, obj: unknown, creator?: Creator): unknown;
  retainOrCreate(obj: unknown, options: CreateOptions, deepRetain?: boolean): unknown;
  reuse(observable: unknown, obj: unknown): void;
  find(obj: unknown, creator: Creator): unknown;
}

/** Factory for creating view models based on path mappings */
export interface Factory {
  paths: Record<string, unknown>;
  parent_factory?: Factory;
  hasPath(path: string): boolean;
  addPathMapping(path: string, createInfo: unknown): void;
  addPathMappings(factories: FactoriesOption, ownerPath?: string): void;
  hasPathMappings(factories: FactoriesOption, ownerPath?: string): boolean;
  creatorForPath(obj: unknown, path: string): Creator | undefined;
}

/** Aggregates model events for efficient event handling */
export interface EventWatcher {
  __kb: { callbacks?: Record<string, unknown> | null };
  ee: Backbone.Model | null;
  destroy(): void;
  emitter(): Backbone.Model | null;
  emitter(newEmitter: Backbone.Model | null): Backbone.Model | null;
  registerCallbacks(obj: unknown, callbackInfo: EventCallbackInfo): this;
  releaseCallbacks(obj: unknown): void;
}

/** Callback info for event watcher registration */
export interface EventCallbackInfo {
  obj?: unknown;
  key?: string | ko.Observable<string>;
  path?: string;
  update?: () => void;
  emitter?: (model: Backbone.Model | null) => void;
  event_selector?: string;
}

// =============================================================================
// Core options interfaces
// =============================================================================

export interface CreateOptions {
  store?: Store;
  factory?: Factory;
  path?: string;
  creator?: Creator;
  event_watcher?: EventWatcher;
}

export interface ObservableOptions {
  key?: string;
  read?: (...args: unknown[]) => unknown;
  write?: (value: unknown) => void;
  args?: unknown[];
  default?: unknown;
  localizer?: new (...args: unknown[]) => unknown;
  factories?: FactoriesOption;
  path?: string;
  store?: Store;
  factory?: Factory;
  event_watcher?: EventWatcher;
}

export interface ViewModelOptions {
  keys?: string[] | Record<string, ObservableOptions>;
  internals?: string[];
  excludes?: string[];
  statics?: string[];
  static_defaults?: Record<string, unknown>;
  requires?: string[];
  mappings?: Record<string, ObservableOptions>;
  factories?: FactoriesOption;
  path?: string;
  store?: Store;
  factory?: Factory;
  creator?: Creator;
  options?: ViewModelOptions;
}

export interface CollectionObservableOptions {
  view_model?: Creator;
  create?: (model: Backbone.Model, options: CreateOptions) => unknown;
  models_only?: boolean;
  auto_compact?: boolean;
  comparator?: (a: unknown, b: unknown) => number;
  sort_attribute?: string;
  filters?: FilterType | FilterType[];
  factories?: FactoriesOption;
  path?: string;
  store?: Store;
  factory?: Factory;
}

export type FilterType = string | ((model: Backbone.Model) => boolean);
export type FactoriesOption = Record<string, Creator> | Creator;
export type Creator = { create?: (obj: unknown, options: CreateOptions) => unknown; models_only?: boolean } | (new (obj: unknown, options: CreateOptions) => unknown);

// =============================================================================
// Internal metadata interface
// =============================================================================

export interface KBMetadata {
  observable?: ko.Observable | ko.Computed | ko.ObservableArray;
  object?: Backbone.Model | Backbone.Collection | null;
  creator?: Creator;
  store?: Store;
  store_is_owned?: boolean;
  factory?: Factory;
  event_watcher?: EventWatcher;
  event_watcher_is_owned?: boolean;
  stores_references?: StoreReference[];
}

export interface StoreReference {
  store: Store;
  ref_count: number;
  release: () => void;
}

// =============================================================================
// Knockback-enhanced observable types
// =============================================================================

/** Base type for all Knockback observables */
export interface KBObservableBase {
  __kb?: KBMetadata;
  __kb_is_o?: boolean;
  __kb_is_co?: boolean;
  __kb_released?: boolean;
  destroy?: () => void;
  valueType?: () => ValueType;
  model?: ko.Computed<Backbone.Model | null>;
}

/** Knockback observable (wraps ko.Computed internally) */
export type KBObservable<T = unknown> = ko.Computed<T> & KBObservableBase;

/** Knockback collection observable (wraps ko.ObservableArray internally) */
// biome-ignore lint/suspicious/noExplicitAny: ko.ObservableArray.destroy conflicts with our destroy
export type KBCollectionObservable<T = unknown> = ko.ObservableArray<T> & {
  __kb?: KBMetadata;
  __kb_is_co?: boolean;
  __kb_released?: boolean;
  collection: ko.Computed<Backbone.Collection | null>;
};

// =============================================================================
// Settings interface
// =============================================================================

export interface KBSettings {
  orm?: {
    useFunction?: (model: Backbone.Model, key: string) => boolean;
    keys?: (model: Backbone.Model) => string[];
    bind?: (model: Backbone.Model, key: string, update: () => void, path: string) => (() => void) | undefined;
  };
  deep_retain?: boolean;
}

/** Locale manager interface for localized observables */
export interface LocaleManager {
  get(id: string): string;
  getLocale(): string;
  setLocale(locale: string): void;
  // Event methods (from Backbone.Events)
  on?(event: string, callback: (...args: unknown[]) => void, context?: unknown): this;
  off?(event: string, callback?: (...args: unknown[]) => void, context?: unknown): this;
}
