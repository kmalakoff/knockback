import type * as Backbone from 'backbone';
export declare const TYPE_UNKNOWN = 0;
export declare const TYPE_SIMPLE = 1;
export declare const TYPE_ARRAY = 2;
export declare const TYPE_MODEL = 3;
export declare const TYPE_COLLECTION = 4;
export type ValueType = typeof TYPE_UNKNOWN | typeof TYPE_SIMPLE | typeof TYPE_ARRAY | typeof TYPE_MODEL | typeof TYPE_COLLECTION;
/** Filter function or attribute name for filtering collections */
export type FilterType = string | ((model: Backbone.Model) => boolean);
/** Factory mappings for creating view models */
export type FactoriesOption = Record<string, Creator> | Creator;
/** Creator for view models - either a constructor or factory object */
export type Creator =
  | {
      create?: (obj: unknown, options: CreateOptions) => unknown;
      models_only?: boolean;
    }
  | (new (
      obj: unknown,
      options: CreateOptions
    ) => unknown);
/** Options for creating observables and view models */
export interface CreateOptions {
  /** Path for nested view model creation */
  path?: string;
  /** Custom creator for view models */
  creator?: Creator;
}
/** Options for kb.observable() */
export interface ObservableOptions {
  /** Model attribute key to observe */
  key?: string;
  /** Custom read function */
  read?: (...args: unknown[]) => unknown;
  /** Custom write function */
  write?: (value: unknown) => void;
  /** Additional arguments for read/write */
  args?: unknown[];
  /** Default value when model value is null/undefined */
  default?: unknown;
  /** Localizer class for localized values */
  localizer?: new (
    ...args: unknown[]
  ) => unknown;
  /** Factory mappings for nested view models */
  factories?: FactoriesOption;
  /** Path for nested view model creation */
  path?: string;
}
/** Options for kb.viewModel() */
export interface ViewModelOptions {
  /** Specific keys to create observables for */
  keys?: string[] | Record<string, ObservableOptions>;
  /** Keys to prefix with underscore */
  internals?: string[];
  /** Keys to exclude from observable creation */
  excludes?: string[];
  /** Keys to copy as static values (not observables) */
  statics?: string[];
  /** Default values for static keys */
  static_defaults?: Record<string, unknown>;
  /** Required keys that must exist on the model */
  requires?: string[];
  /** Per-key observable options */
  mappings?: Record<string, ObservableOptions>;
  /** Factory mappings for nested view models */
  factories?: FactoriesOption;
  /** Path for nested view model creation */
  path?: string;
  /** Custom creator for this view model */
  creator?: Creator;
  /** Nested options (for inheritance) */
  options?: ViewModelOptions;
}
/** Options for kb.collectionObservable() */
export interface CollectionObservableOptions {
  /** View model constructor or creator for collection items */
  view_model?: Creator;
  /** Custom create function for collection items */
  create?: (model: Backbone.Model, options: CreateOptions) => unknown;
  /** If true, array contains models instead of view models */
  models_only?: boolean;
  /** Auto-compact the store when items are removed */
  auto_compact?: boolean;
  /** Comparator function for sorting */
  comparator?: (a: unknown, b: unknown) => number;
  /** Model attribute to sort by */
  sort_attribute?: string;
  /** Filter(s) for which models to include */
  filters?: FilterType | FilterType[];
  /** Factory mappings for nested view models */
  factories?: FactoriesOption;
  /** Path for nested view model creation */
  path?: string;
}
/** Knockback observable - a ko.Computed bound to a model attribute */
export type KBObservable<T = unknown> = ko.Computed<T> & {
  /** Destroy and release all resources */
  destroy?: () => void;
  /** Get the value type */
  valueType?: () => ValueType;
  /** Observable for the underlying model */
  model?: ko.Computed<Backbone.Model | null>;
};
/** Knockback collection observable - a ko.ObservableArray bound to a collection */
export type KBCollectionObservable<T = unknown> = ko.ObservableArray<T> & {
  /** Observable for the underlying collection */
  collection: ko.Computed<Backbone.Collection | null>;
};
/** Global settings for Knockback */
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
  on?(event: string, callback: (...args: unknown[]) => void, context?: unknown): this;
  off?(event: string, callback?: (...args: unknown[]) => void, context?: unknown): this;
}
/**
 * Store for caching and sharing view models
 * @internal
 */
export interface Store {
  __kb_released?: boolean;
  destroy(): void;
  clear(): void;
  compact(): void;
  release(observable: unknown, force?: boolean): void;
  retain(observable: unknown, obj: unknown, creator?: Creator): unknown;
  retainOrCreate(obj: unknown, options: InternalCreateOptions, deepRetain?: boolean): unknown;
  reuse(observable: unknown, obj: unknown): void;
  find(obj: unknown, creator: Creator): unknown;
}
/**
 * Factory for creating view models based on path mappings
 * @internal
 */
export interface Factory {
  paths: Record<string, unknown>;
  parent_factory?: Factory;
  hasPath(path: string): boolean;
  addPathMapping(path: string, createInfo: unknown): void;
  addPathMappings(factories: FactoriesOption, ownerPath?: string): void;
  hasPathMappings(factories: FactoriesOption, ownerPath?: string): boolean;
  creatorForPath(obj: unknown, path: string): Creator | undefined;
}
/**
 * Aggregates model events for efficient event handling
 * @internal
 */
export interface EventWatcher {
  __kb: {
    callbacks?: Record<string, unknown> | null;
  };
  ee: Backbone.Model | null;
  destroy(): void;
  emitter(): Backbone.Model | null;
  emitter(newEmitter: Backbone.Model | null): Backbone.Model | null;
  registerCallbacks(obj: unknown, callbackInfo: EventCallbackInfo): this;
  releaseCallbacks(obj: unknown): void;
}
/**
 * Callback info for event watcher registration
 * @internal
 */
export interface EventCallbackInfo {
  obj?: unknown;
  key?: string | ko.Observable<string>;
  path?: string;
  update?: () => void;
  emitter?: (model: Backbone.Model | null) => void;
  event_selector?: string;
}
/**
 * Internal metadata stored on Knockback objects
 * @internal
 */
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
/**
 * Reference to a Store for memory management
 * @internal
 */
export interface StoreReference {
  store: Store;
  ref_count: number;
  release: () => void;
}
/**
 * Base type for all Knockback observables (internal)
 * @internal
 */
export interface KBObservableBase {
  __kb?: KBMetadata;
  __kb_is_o?: boolean;
  __kb_is_co?: boolean;
  __kb_released?: boolean;
  destroy?: () => void;
  valueType?: () => ValueType;
  model?: ko.Computed<Backbone.Model | null>;
}
/**
 * Internal create options with store/factory/event_watcher
 * @internal
 */
export interface InternalCreateOptions extends CreateOptions {
  store?: Store;
  factory?: Factory;
  event_watcher?: EventWatcher;
}
/**
 * Internal observable options
 * @internal
 */
export interface InternalObservableOptions extends ObservableOptions {
  store?: Store;
  factory?: Factory;
  event_watcher?: EventWatcher;
}
/**
 * Internal view model options
 * @internal
 */
export interface InternalViewModelOptions extends ViewModelOptions {
  store?: Store;
  factory?: Factory;
}
/**
 * Internal collection observable options
 * @internal
 */
export interface InternalCollectionObservableOptions extends CollectionObservableOptions {
  store?: Store;
  factory?: Factory;
}
