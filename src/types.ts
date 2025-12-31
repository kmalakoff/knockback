import type * as Backbone from 'backbone';
import type * as ko from 'knockout';
import type { CreateOptions, Creator, FactoriesOption } from './internal-types.ts';

// =============================================================================
// Value type constants
// =============================================================================

export const TYPE_UNKNOWN = 0;
export const TYPE_SIMPLE = 1;
export const TYPE_ARRAY = 2;
export const TYPE_MODEL = 3;
export const TYPE_COLLECTION = 4;

export type ValueType = typeof TYPE_UNKNOWN | typeof TYPE_SIMPLE | typeof TYPE_ARRAY | typeof TYPE_MODEL | typeof TYPE_COLLECTION;

// =============================================================================
// Public options interfaces - what users provide
// =============================================================================

/** Options for creating observables and view models */
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
  factories?: Record<string, unknown> | { create?: (obj: unknown, options: { path?: string; creator?: unknown }) => unknown; models_only?: boolean } | (new (obj: unknown, options: { path?: string; creator?: unknown }) => unknown);
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
  factories?: Record<string, unknown> | { create?: (obj: unknown, options: { path?: string; creator?: unknown }) => unknown; models_only?: boolean } | (new (obj: unknown, options: { path?: string; creator?: unknown }) => unknown);
  /** Path for nested view model creation */
  path?: string;
  /** Custom creator for this view model */
  creator?: { create?: (obj: unknown, options: { path?: string; creator?: unknown }) => unknown; models_only?: boolean } | (new (obj: unknown, options: { path?: string; creator?: unknown }) => unknown);
  /** Nested options (for inheritance) */
  options?: ViewModelOptions;
  /**
   * Extend the view model after observables are created.
   *
   * @example
   * interface PersonViewModel {
   *   name: ko.Observable<string>;
   *   onSave: () => void;
   * }
   * const vm = viewModel<PersonViewModel>(model, {
   *   extend(vm, model) {
   *     vm.onSave = () => model?.save();
   *   },
   * });
   *
   * @example
   * const vm = viewModel<PersonViewModel>(model, {
   *   extend: {
   *     onSave() {
   *       model?.save();
   *     },
   *   },
   * });
   */
  extend?: ((vm: ViewModel<Record<string, unknown>>, model: Backbone.Model | null) => void | Record<string, unknown>) | Record<string, unknown>;
}

/** Options for kb.collectionObservable() */
export interface CollectionObservableOptions<T = unknown> {
  /** View model constructor or creator for collection items */
  view_model?: { create?: (obj: unknown, options: { path?: string; creator?: unknown }) => T; models_only?: boolean } | (new (obj: unknown, options: { path?: string; creator?: unknown }) => T);
  /** Custom create function for collection items */
  create?: (model: Backbone.Model, options: { path?: string; creator?: unknown }) => T;
  /** If true, array contains models instead of view models */
  models_only?: boolean;
  /** Auto-compact the store when items are removed */
  auto_compact?: boolean;
  /** Comparator function for sorting */
  comparator?: (a: T, b: T) => number;
  /** Model attribute to sort by */
  sort_attribute?: string;
  /** Filter(s) for which models to include */
  filters?: string | ((model: Backbone.Model) => boolean) | Array<string | ((model: Backbone.Model) => boolean)>;
  /** Factory mappings for nested view models */
  factories?: Record<string, unknown> | { create?: (obj: unknown, options: { path?: string; creator?: unknown }) => T; models_only?: boolean } | (new (obj: unknown, options: { path?: string; creator?: unknown }) => T);
  /** Path for nested view model creation */
  path?: string;
}

// =============================================================================
// Public observable types
// =============================================================================

/**
 * Knockback observable - a ko.Computed bound to a model attribute.
 * Created via `observable(model, key)` or `observable(model, options)`.
 */
export interface Observable<T = unknown> extends ko.Computed<T> {
  /** Destroy and release all resources */
  destroy(): void;
  /** Get the current value type (TYPE_SIMPLE, TYPE_MODEL, etc.) */
  valueType(): typeof TYPE_UNKNOWN | typeof TYPE_SIMPLE | typeof TYPE_ARRAY | typeof TYPE_MODEL | typeof TYPE_COLLECTION;
  /** Observable for the underlying model */
  readonly model: ko.Computed<Backbone.Model | null>;
}

/** Public observable type alias */
/**
 * Knockback collection observable - a ko.ObservableArray bound to a collection.
 * Created via `collectionObservable(collection, options)`.
 */
export interface CollectionObservable<T = unknown> extends ko.ObservableArray<T> {
  /** Destroy and release all resources */
  destroy(): void;
  /** Observable for the underlying collection */
  readonly collection: ko.Computed<Backbone.Collection | null>;
  /** Set or get filters for which models to include */
  filters(filters?: string | ((model: Backbone.Model) => boolean) | Array<string | ((model: Backbone.Model) => boolean)>): Array<string | ((model: Backbone.Model) => boolean)>;
  /** Set comparator function for sorting */
  comparator(fn: ((a: T, b: T) => number) | null): void;
  /** Sort by a model attribute name */
  sortAttribute(attrName: string | null): void;
  /** Get view model for a specific model */
  viewModelByModel(model: Backbone.Model): T | undefined;
  /** Check if array contains view models (vs raw models) */
  hasViewModels(): boolean;
  /** Compact internal store (release unused cached view models) */
  compact(): void;
}

// =============================================================================
// Public ViewModel types
// =============================================================================

/**
 * Base interface shared by all ViewModels.
 * Contains the common methods available on every ViewModel instance.
 */
/**
 * ViewModel with observables for model attributes.
 * Use the generic parameter to define the shape of your view model.
 *
 * @example
 * interface PersonVM {
 *   name: ko.Observable<string>;
 *   age: ko.Observable<number>;
 * }
 * const vm = viewModel<PersonVM>(model);
 * vm.name(); // returns string
 */
export type ViewModel<T extends Record<string, unknown> = Record<string, unknown>> = {
  /** Destroy and release all resources */
  destroy(): void;
  /** Observable for the underlying model */
  readonly model: ko.Computed<Backbone.Model | null>;
  /** Dynamically create observables for additional keys */
  createObservables(model: Backbone.Model, keys: string[]): void;
  /** Share options (store/factory) with other view models */
  shareOptions(): { store: unknown; factory: unknown };
} & T;

// =============================================================================
// Settings interface
// =============================================================================

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

// =============================================================================
// Internal types - not part of public API
// =============================================================================

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
  __kb: { callbacks?: Record<string, unknown> | null };
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
 * Internal observable type with __kb markers.
 * Extends the public Observable with internal implementation details.
 * Allows writing to model during construction (public type is readonly).
 * @internal
 */
export interface ObservableInternal<T = unknown> extends Omit<Observable<T>, 'model'> {
  __kb?: KBMetadata;
  __kb_is_o?: boolean;
  __kb_released?: boolean;
  /** Writable during construction, readonly after */
  model: ko.Computed<Backbone.Model | null>;
}

/**
 * Internal collection observable type with __kb markers.
 * Extends the public CollectionObservable with internal implementation details.
 * @internal
 */
export interface CollectionObservableInternal<T = unknown> extends Omit<CollectionObservable<T>, 'collection'> {
  __kb?: KBMetadata;
  __kb_is_co?: boolean;
  __kb_released?: boolean;
  /** Writable during construction, readonly after */
  collection: ko.Computed<Backbone.Collection | null>;
}

/**
 * Internal view model type with __kb markers.
 * @internal
 */
export interface ViewModelInternal
  extends Omit<
    {
      destroy(): void;
      readonly model: ko.Computed<Backbone.Model | null>;
      createObservables(model: Backbone.Model, keys: string[]): void;
    },
    'model'
  > {
  __kb?: KBMetadata;
  __kb_is_vm?: boolean;
  __kb_released?: boolean;
  /** Writable during construction, readonly after */
  model: ko.Computed<Backbone.Model | null>;
}

/**
 * Base type for checking any Knockback object (internal)
 * Used for type guards and release logic.
 * @internal
 */
export interface ObservableBase {
  __kb?: KBMetadata;
  __kb_is_o?: boolean;
  __kb_is_co?: boolean;
  __kb_is_vm?: boolean;
  __kb_released?: boolean;
  destroy?: () => void;
  valueType?: () => ValueType;
  model?: ko.Computed<Backbone.Model | null>;
}

// =============================================================================
// Internal options interfaces - extend public with internal properties
// =============================================================================

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
