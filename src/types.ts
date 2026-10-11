import type * as Backbone from 'backbone';
import type * as ko from 'knockout';
import type { CreateOptions, Creator, FactoriesOption, StoredCreator } from './internal-types.ts';

// =============================================================================
// Value type constants
// =============================================================================

export const TYPE_UNKNOWN = 0;
export const TYPE_SIMPLE = 1;
export const TYPE_ARRAY = 2;
export const TYPE_MODEL = 3;
export const TYPE_COLLECTION = 4;

export type ValueType = typeof TYPE_UNKNOWN | typeof TYPE_SIMPLE | typeof TYPE_ARRAY | typeof TYPE_MODEL | typeof TYPE_COLLECTION;

/** Optional lazy model reference supported when its constructor is installed on Backbone. */
export interface ModelReference<M extends Backbone.Model = Backbone.Model> {
  model(): M | null | undefined;
  retain(): unknown;
  release(): unknown;
  bind(eventName: 'loaded' | 'unloaded', callback: (model: M) => void): unknown;
  unbind(eventName: 'loaded' | 'unloaded', callback: (model: M) => void): unknown;
}

/** A concrete Backbone model or an optional lazy reference to one. */
export type ModelInput<M extends Backbone.Model = Backbone.Model> = M | ModelReference<M> | null;

// =============================================================================
// Public options interfaces - what users provide
// =============================================================================

/** Options for creating observables and view models */
/** Options for kb.observable() */
type ObservableArguments<Args extends unknown[]> = [] extends Args ? { args?: Args } : { args: Args };

export type ObservableOptions<Presented = unknown, Args extends unknown[] = unknown[], RawRead = Presented, RawWrite = Presented> = {
  /** Model attribute key to observe */
  key?: string;
  /** Custom read function. Direct option calls may receive a non-string key. */
  read?: (key: unknown, ...args: Args) => RawRead;
  /** Custom write function */
  write?: (value: RawWrite) => void;
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
} & ObservableArguments<Args>;

/** Options for kb.viewModel() */
export interface ViewModelOptions<T extends object = Record<string, unknown>, M extends Backbone.Model = Backbone.Model> {
  /** Specific keys to create observables for */
  keys?: string[] | Record<string, ObservableOptions>;
  /** Keys to prefix with underscore */
  internals?: string[];
  /** Keys to exclude from observable creation */
  excludes?: string[];
  /** Keys to copy as static values (not observables) */
  statics?: string[];
  /** Default values for static keys */
  staticDefaults?: Record<string, unknown>;
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
  options?: ViewModelOptions<T, M>;
  /** Shared store for view model reuse */
  store?: unknown;
  /** Event watcher for model events */
  eventWatcher?: unknown;
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
  extend?: ((vm: ViewModel<T, M>, model: M | null) => void | Partial<T>) | Partial<T>;
}

type CollectionCreatorFunction<T, M extends Backbone.Model> = ((model: M, options: CreateOptions) => T) & { modelsOnly?: boolean };
type CollectionCreatorConstructor<T, M extends Backbone.Model> = (new (model: M, options: CreateOptions) => T) & { modelsOnly?: boolean };
type CollectionCreatorObject<T, M extends Backbone.Model> = { create: (model: M, options: CreateOptions) => T; modelsOnly?: boolean };

/** Constructor, callable, or create object used for collection items. */
export type CollectionCreator<T, M extends Backbone.Model = Backbone.Model> = CollectionCreatorObject<T, M> | CollectionCreatorConstructor<T, M> | CollectionCreatorFunction<T, M>;

/** The value returned by a collection creator before its modelsOnly flag is applied. */
export type CollectionCreatorResult<C> = C extends new (...args: infer _Args) => infer T ? T : C extends (...args: infer _Args) => infer T ? T : C extends { create: (...args: infer _Args) => infer T } ? T : never;

/** A creator result that can be retained as Knockback metadata owner. */
type CollectionRetainedResult<T> = T extends object ? T : unknown;

/** Conservatively presented result of a creator after runtime dispatch and retention. */
type CollectionCreatorPresentedResult<C> = CollectionRetainedResult<CollectionCreatorResult<C>>;

/** The item presented by a creator whose modelsOnly flag is known or widened. */
export type CollectionCreatorItem<C, M extends Backbone.Model> = C extends { modelsOnly: true }
  ? M
  : C extends { modelsOnly: false }
    ? CollectionCreatorPresentedResult<C>
    : C extends { modelsOnly: boolean }
      ? M | CollectionCreatorPresentedResult<C>
      : C extends { modelsOnly?: infer Flag }
        ? true extends Flag
          ? M | CollectionCreatorPresentedResult<C>
          : CollectionCreatorPresentedResult<C>
        : CollectionCreatorPresentedResult<C>;

/** Options for kb.collectionObservable() */
export interface CollectionObservableOptions<T = unknown, M extends Backbone.Model = Backbone.Model> {
  /** Shared store for view model reuse */
  store?: unknown;
  /** Shared factory for nested mappings */
  factory?: unknown;
  /** View model constructor or creator for collection items */
  viewModel?: CollectionCreator<T, M>;
  /** Custom create function for collection items */
  create?: (model: M, options: CreateOptions) => T;
  /** If true, array contains models instead of view models */
  modelsOnly?: boolean;
  /** Auto-compact the store when items are removed */
  autoCompact?: boolean;
  /** Comparator function for sorting */
  comparator?: (a: T, b: T) => number;
  /** Model attribute to sort by */
  sortAttribute?: string;
  /** Filter(s) for which models to include */
  filters?: string | ((model: M) => boolean) | Array<string | ((model: M) => boolean)>;
  /** Factory mappings for nested view models */
  factories?: FactoriesOption;
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
export interface Observable<T = unknown, M extends Backbone.Model = Backbone.Model> extends ko.Observable<T> {
  /** Dispose and release all resources (called by releaseOnNodeRemove / KO component disposal) */
  dispose(): void;
  /** Get the current value type (TYPE_SIMPLE, TYPE_MODEL, etc.) */
  valueType(): typeof TYPE_UNKNOWN | typeof TYPE_SIMPLE | typeof TYPE_ARRAY | typeof TYPE_MODEL | typeof TYPE_COLLECTION;
  /** Observable for the underlying model */
  readonly model: ko.Computed<M | null> & ((value: M | null) => void);
}

/** Public observable type alias */
/**
 * Knockback collection observable - a ko.ObservableArray bound to a collection.
 * Created via `collectionObservable(collection, options)`.
 */
export interface CollectionObservable<T = unknown> extends ko.ObservableArray<T> {
  /** Dispose and release all resources (called by releaseOnNodeRemove / KO component disposal) */
  dispose(): void;
  /** Observable for the underlying collection */
  readonly collection: ko.Computed<Backbone.Collection | null> & ((value: Backbone.Collection | null) => void);
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
export type ViewModel<T extends object = Record<string, unknown>, M extends Backbone.Model = Backbone.Model> = {
  /** Dispose and release all resources (called by releaseOnNodeRemove / KO component disposal) */
  dispose(): void;
  /** Observable for the underlying model */
  readonly model: ko.Computed<M | null> & ((value: ModelInput<M>) => void);
} & T;

// =============================================================================
// Settings interface
// =============================================================================

/** Global settings for Knockback */
export interface KBSettings {
  orm?: {
    useFunction?: (model: Backbone.Model, key: string) => boolean;
    keys?: (model: Backbone.Model) => string[] | null;
    bind?: (model: Backbone.Model, key: string, update: () => void, path: string) => (() => void) | null | undefined;
  } | null;
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
// Public Store interface
// =============================================================================

/**
 * Store for caching and sharing view models.
 *
 * The Store provides view model caching for efficient memory usage when
 * multiple observables reference the same underlying models.
 *
 * @example
 * // Create a shared store for a collection of view models
 * const store = new kb.Store();
 * const vm = kb.collectionObservable(collection, { store });
 *
 * // Later, dispose the store and all cached view models
 * kb.dispose(store);
 */
export interface Store {
  /** Dispose and release all cached view models */
  dispose(): void;
  /** Clear all stored observables without disposing the store */
  clear(): void;
  /** Compact by removing already-disposed observables */
  compact(): void;
}

// =============================================================================
// Internal types - not part of public API
// =============================================================================

/**
 * Internal Store interface with all methods (for internal knockback use)
 * @internal
 */
export interface StoreInternal extends Store {
  __kb_dispose?: number;
  observable_records: Record<string, unknown>;
  replaced_observables: unknown[];
  release(observable: unknown, force?: boolean): void;
  retain(observable: unknown, obj: unknown, creator?: StoredCreator | null, state?: StoreRetainState): unknown;
  retainOrCreate(obj: unknown, options: InternalCreateOptions, deepRetain?: boolean, state?: StoreRetainState): unknown;
  reuse(observable: unknown, obj: unknown): void;
  find(obj: unknown, creator: StoredCreator): unknown;
}

/** @internal Records ownership acquired by one Store operation. */
export interface StoreRetainState {
  created: boolean;
  retained: boolean;
  cancelled?: boolean;
  value?: unknown;
  rollback?: () => void;
  commit?: (releasePrevious?: boolean) => void;
  publish?: () => void;
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
  creatorForPath(obj: unknown, path: string): StoredCreator | undefined;
}

/**
 * Aggregates model events for efficient event handling
 * @internal
 */
export interface EventWatcher {
  __kb: { callbacks?: Record<string, unknown> | null };
  __kb_dispose?: number;
  ee: Backbone.Model | null;
  modelRef: ModelReference | null;
  dispose(): void;
  emitter(): Backbone.Model | null;
  emitter(newEmitter: ModelInput): Backbone.Model | null;
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
  eventSelector?: string;
}

/**
 * Internal metadata stored on Knockback objects
 * @internal
 */
export interface KBMetadata {
  observable?: ko.Observable | ko.Computed | ko.ObservableArray;
  object?: Backbone.Model | Backbone.Collection | null;
  creator?: StoredCreator;
  store?: StoreInternal;
  store_is_owned?: boolean;
  factory?: Factory;
  eventWatcher?: EventWatcher;
  eventWatcher_is_owned?: boolean;
  stores_references?: StoreReference[];
}

/**
 * Reference to a Store for memory management
 * @internal
 */
export interface StoreReference {
  store: StoreInternal;
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
  __kb_dispose?: number;
  /** Writable during construction, readonly after */
  model: ko.Computed<Backbone.Model | null> & ((value: Backbone.Model | null) => void);
}

/**
 * Internal collection observable type with __kb markers.
 * Extends the public CollectionObservable with internal implementation details.
 * @internal
 */
export interface CollectionObservableInternal<T = unknown> extends Omit<CollectionObservable<T>, 'collection'> {
  __kb?: KBMetadata;
  __kb_is_co?: boolean;
  __kb_dispose?: number;
  /** Writable during construction, readonly after */
  collection: ko.Computed<Backbone.Collection | null> & ((value: Backbone.Collection | null) => void);
}

/**
 * Internal view model type with __kb markers.
 * @internal
 */
export interface ViewModelInternal
  extends Omit<
    {
      dispose(): void;
      readonly model: ko.Computed<Backbone.Model | null>;
      createObservables(model: Backbone.Model, keys: string[]): void;
    },
    'model'
  > {
  __kb?: KBMetadata;
  __kb_is_vm?: boolean;
  __kb_dispose?: number;
  /** Writable during construction, readonly after */
  model: ko.Computed<Backbone.Model | null> & ((value: Backbone.Model | null) => void);
}

/**
 * Base type for checking any Knockback object (internal)
 * Used for type guards and disposal logic.
 * @internal
 */
export interface ObservableBase {
  __kb?: KBMetadata;
  __kb_is_o?: boolean;
  __kb_is_co?: boolean;
  __kb_is_vm?: boolean;
  __kb_dispose?: number;
  dispose?: () => void;
  valueType?: () => ValueType;
  model?: ko.Computed<Backbone.Model | null>;
}

// =============================================================================
// Internal options interfaces - extend public with internal properties
// =============================================================================

/**
 * Internal create options with store/factory/eventWatcher
 * @internal
 */
export interface InternalCreateOptions extends Omit<CreateOptions, 'creator'> {
  creator?: StoredCreator | null;
  store?: StoreInternal;
  factory?: Factory;
  eventWatcher?: EventWatcher;
}

/**
 * Internal observable options
 * @internal
 */
export type InternalObservableOptions = ObservableOptions & {
  store?: StoreInternal;
  factory?: Factory;
  eventWatcher?: EventWatcher;
};

/**
 * Internal view model options
 * @internal
 */
export interface InternalViewModelOptions extends ViewModelOptions {
  store?: StoreInternal;
  factory?: Factory;
}

/**
 * Internal collection observable options
 * @internal
 */
export interface InternalCollectionObservableOptions<T = unknown> extends Omit<CollectionObservableOptions<T>, 'viewModel'> {
  viewModel?: StoredCreator;
  store?: StoreInternal;
  factory?: Factory;
}
