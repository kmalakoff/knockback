import type * as Backbone from 'backbone';
import type * as ko from 'knockout';

// Value type constants
export const TYPE_UNKNOWN = 0;
export const TYPE_SIMPLE = 1;
export const TYPE_ARRAY = 2;
export const TYPE_MODEL = 3;
export const TYPE_COLLECTION = 4;

export type ValueType = typeof TYPE_UNKNOWN | typeof TYPE_SIMPLE | typeof TYPE_ARRAY | typeof TYPE_MODEL | typeof TYPE_COLLECTION;

// Core options interfaces
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
  options?: ViewModelOptions;
}

export interface CollectionObservableOptions {
  view_model?: new (model: Backbone.Model, options: CreateOptions) => unknown;
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

// Internal metadata interface
export interface KBMetadata {
  observable?: ko.Observable | ko.ObservableArray;
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

// Forward declarations for classes (will be replaced with actual imports)
export interface Store {
  __kb_released?: boolean;
  destroy(): void;
  release(obj: unknown): void;
  retain(observable: ko.Observable, obj: unknown, creator: Creator): void;
  retainOrCreate(obj: unknown, options: CreateOptions, deep_retain?: boolean): unknown;
  reuse(observable: ko.Observable, obj: unknown): void;
  find(obj: unknown, creator: Creator): unknown;
}

export interface Factory {
  creatorForPath(obj: unknown, path: string): Creator | undefined;
}

export interface EventWatcher {
  destroy(): void;
  releaseCallbacks(obj: unknown): void;
  registerCallbacks(obj: unknown, callbacks: EventCallbacks): void;
  model(): Backbone.Model | null;
}

export interface EventCallbacks {
  [event: string]: () => void;
}

// Knockback-enhanced observable
export interface KBObservable<T = unknown> extends ko.Observable<T> {
  __kb?: KBMetadata;
  __kb_is_o?: boolean;
  __kb_is_co?: boolean;
  destroy?: () => void;
  release?: () => void;
  dispose?: () => void;
  valueType?: () => ValueType;
  model?: ko.Computed<Backbone.Model | null>;
}

// Settings interface
export interface KBSettings {
  orm?: {
    useFunction?: (model: Backbone.Model, key: string) => boolean;
    keys?: (model: Backbone.Model) => string[];
    bind?: (model: Backbone.Model, key: string, update: () => void, path: string) => void;
  };
  deep_retain?: boolean;
}
