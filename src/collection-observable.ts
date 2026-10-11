import Backbone from 'backbone';
import ko from 'knockout';
import _ from 'underscore';
import { KB_DISPOSE_STATE } from './constants.ts';
import { NotInitializedError } from './errors/index.ts';
import { Factory } from './factory.ts';
import type { CreateOptions, FactoriesOption, KnockbackGlobal, StoredCreator } from './internal-types.ts';
import { _throwUnexpected, ignore, isModel, peek, publishMethods, wasReleased } from './kb.ts';
import { Store } from './store.ts';
import type { CollectionCreator, CollectionCreatorItem, CollectionObservable, CollectionObservableInternal, CollectionObservableOptions, InternalCollectionObservableOptions, InternalCreateOptions, Observable, ViewModel } from './types.ts';
import { attachDispose, collapseOptions, disposeMetadata, getObservable, pathJoin, setObservable, wrappedFactory, wrappedModel, wrappedObject, wrappedStore, wrappedStoreIsOwned } from './utils.ts';
import { viewModel as viewModelFactory } from './view-model.ts';

const COMPARE_EQUAL = 0;
const COMPARE_ASCENDING = -1;
const COMPARE_DESCENDING = 1;

const KEYS_PUBLISH = ['dispose', 'shareOptions', 'filters', 'comparator', 'sortAttribute', 'viewModelByModel', 'hasViewModels'] as const;

type StoredComparator = (valueA: never, valueB: never) => number;
type FilterFn = (model: Backbone.Model) => boolean;

// =============================================================================
// CollectionObservable Interface
// =============================================================================

export interface CollectionObservableInstance {
  __kb: Record<string, unknown>;
  __kb_dispose?: number;
  in_edit: number;
  modelsOnly?: boolean;
  autoCompact?: boolean;
  path?: string;
  create_options?: InternalCreateOptions;
  collection?: ko.Computed<Backbone.Collection | null>;

  // Methods
  dispose(): void;
  shareOptions(): { store: unknown; factory: unknown };
  filters(filters?: unknown | unknown[]): void;
  comparator(comparator: StoredComparator | null): void;
  sortAttribute(sortAttribute: string | null): void;
  viewModelByModel(model: Backbone.Model): unknown | null;
  hasViewModels(): boolean;
  compact(): void;
}

// Compare two values
export function compare(valueA: unknown, valueB: unknown): number {
  if (typeof valueA === 'string') {
    return valueA.localeCompare(String(valueB));
  }
  if (typeof valueB === 'string') {
    return valueB.localeCompare(String(valueA));
  }
  return valueA === valueB ? COMPARE_EQUAL : (valueA as never) < (valueB as never) ? COMPARE_ASCENDING : COMPARE_DESCENDING;
}

// =============================================================================
// Factory Function (Primary API)
// =============================================================================

/**
 * Creates an observable array bound to a Backbone collection.
 *
 * @param inputCollection - Backbone collection or array of models
 * @param viewModelOrOptions - ViewModel constructor or options
 * @param options - Additional options
 * @returns A Knockout observable array with Knockback extensions
 */
type DefaultCollectionView<M extends Backbone.Model> = ViewModel<Record<string, unknown>, M>;

type DirectCollectionCreator<M extends Backbone.Model> = (((model: M, options: CreateOptions) => unknown) & { modelsOnly?: boolean }) | ((new (model: M, options: CreateOptions) => unknown) & { modelsOnly?: boolean });
type NonFalsy<T> = Exclude<T, false | null | undefined>;
type RetainedCreatorResult<T> = T extends object ? T : unknown;
type HasPossiblyTruthyProperty<O, K extends PropertyKey> = K extends keyof O ? (NonFalsy<O[K]> extends never ? false : true) : false;
type CreatedOptionItem<O, M extends Backbone.Model> = 'create' extends keyof O ? (NonFalsy<O['create']> extends (model: M, options: CreateOptions) => infer T ? RetainedCreatorResult<T> : never) | (undefined extends O['create'] ? DefaultCollectionView<M> : never) : DefaultCollectionView<M>;
type CreatorOptionItem<O, M extends Backbone.Model> = 'viewModel' extends keyof O ? (NonFalsy<O['viewModel']> extends infer C ? (C extends CollectionCreator<unknown, M> ? CollectionCreatorItem<C, M> : never) : never) | (undefined extends O['viewModel'] ? CreatedOptionItem<O, M> : never) : CreatedOptionItem<O, M>;
type PresentModeItem<F, M extends Backbone.Model> = (true extends F ? M : never) | (Extract<F, false | undefined> extends never ? never : DefaultCollectionView<M>);
type ModeOptionItem<O, M extends Backbone.Model> = 'modelsOnly' extends keyof O ? PresentModeItem<O['modelsOnly'], M> | CreatorOptionItem<O, M> : CreatorOptionItem<O, M>;
type CollectionOptionsItem<O, M extends Backbone.Model> = HasPossiblyTruthyProperty<O, 'factory'> extends true ? unknown : HasPossiblyTruthyProperty<O, 'factories'> extends true ? unknown : HasPossiblyTruthyProperty<O, 'options'> extends true ? unknown : ModeOptionItem<O, M> | DefaultCollectionView<M>;
type CollectionInferenceOptions<T, M extends Backbone.Model> = Omit<CollectionObservableOptions<T, M>, 'viewModel' | 'create' | 'modelsOnly' | 'factory' | 'factories'> & {
  viewModel?: CollectionCreator<unknown, M>;
  create?: (model: M, options: CreateOptions) => unknown;
  modelsOnly?: boolean;
  factory?: unknown;
  factories?: FactoriesOption;
};

export function collectionObservable<M extends Backbone.Model, C extends DirectCollectionCreator<NoInfer<M>>>(inputCollection: Backbone.Collection<M> | M[], viewModelOrOptions: C): CollectionObservable<CollectionCreatorItem<C, M>>;
export function collectionObservable<M extends Backbone.Model, O extends Record<string, unknown>>(inputCollection: Backbone.Collection<M> | M[], viewModelOrOptions: O & CollectionInferenceOptions<CollectionOptionsItem<O, M>, NoInfer<M>>): CollectionObservable<CollectionOptionsItem<O, M>>;
export function collectionObservable<T = unknown, M extends Backbone.Model = Backbone.Model>(
  inputCollection: Backbone.Collection<M> | M[] | Record<string, unknown>[],
  viewModelOrOptions?: CollectionObservableOptions<NoInfer<T>, M> | CollectionObservableOptions<NoInfer<T>, M>['viewModel'],
  options?: CollectionObservableOptions<NoInfer<T>, M>
): CollectionObservable<T>;
export function collectionObservable<T = unknown>(inputCollection?: Backbone.Collection | unknown[], viewModelOrOptions?: unknown, options?: CollectionObservableOptions<T>): CollectionObservable<T> {
  return ignore(() => {
    // Normalize arguments
    let collection: Backbone.Collection;
    if (inputCollection instanceof Backbone.Collection) {
      collection = inputCollection;
    } else if (Array.isArray(inputCollection)) {
      collection = new Backbone.Collection(inputCollection as Backbone.Model[]);
    } else {
      collection = new Backbone.Collection();
    }

    // Handle viewModel as function
    let mergedOptions: InternalCollectionObservableOptions<T> = {};
    if (typeof viewModelOrOptions === 'function') {
      mergedOptions = { viewModel: viewModelOrOptions as StoredCreator };
    } else if (viewModelOrOptions && typeof viewModelOrOptions === 'object') {
      Object.assign(mergedOptions, viewModelOrOptions);
    }
    if (options && typeof options === 'object') {
      Object.assign(mergedOptions, options);
    }

    // Instance state (closure-based)
    const state: CollectionObservableInstance = {
      __kb: {},
      in_edit: 0,
      modelsOnly: undefined,
      autoCompact: undefined,
      path: undefined,

      dispose,
      shareOptions,
      filters,
      comparator: setComparator,
      sortAttribute,
      viewModelByModel,
      hasViewModels,
      compact,
    };

    // Private state
    let _collection: ko.Observable<Backbone.Collection | null>;
    let _comparator: ko.Observable<StoredComparator | null>;
    let _filters: ko.ObservableArray<unknown>;
    let _mapper: ko.Computed<void>;

    // Create the observable array - cast to internal type to allow property assignments
    const observable = setObservable(state, ko.observableArray([])) as unknown as CollectionObservableInternal<T>;
    observable.__kb_is_co = true;

    // Options
    mergedOptions = collapseOptions(mergedOptions) as InternalCollectionObservableOptions<T>;
    if (mergedOptions.autoCompact) {
      state.autoCompact = true;
    }

    // Comparator
    if (mergedOptions.sortAttribute) {
      _comparator = ko.observable<StoredComparator | null>(attributeComparator(mergedOptions.sortAttribute));
    } else {
      _comparator = ko.observable<StoredComparator | null>(mergedOptions.comparator || null);
    }

    // Filters
    if (mergedOptions.filters) {
      _filters = ko.observableArray<unknown>(Array.isArray(mergedOptions.filters) ? mergedOptions.filters : [mergedOptions.filters]);
    } else {
      _filters = ko.observableArray<unknown>([]);
    }

    // Store
    const createOptions: InternalCreateOptions = {
      store: Store.useOptionsOrCreate(mergedOptions as InternalCollectionObservableOptions, collection, observable),
    };
    state.create_options = createOptions;
    wrappedObject(observable, collection);

    // Factory
    state.path = mergedOptions.path;
    createOptions.factory = wrappedFactory(observable, shareOrCreateFactory(mergedOptions));
    createOptions.path = pathJoin(mergedOptions.path, 'models');

    // Check for modelsOnly
    createOptions.creator = (createOptions.factory as Factory).creatorForPath(null, createOptions.path);
    if (createOptions.creator) {
      state.modelsOnly = (createOptions.creator as { modelsOnly?: boolean }).modelsOnly;
    }

    // Publish methods
    publishMethods(observable, state, KEYS_PUBLISH);
    attachDispose(observable, dispose);

    // Collection observable
    _collection = ko.observable<Backbone.Collection | null>(collection);

    const collectionComputed = ko.computed({
      read: () => _collection(),
      write: (newCollection: Backbone.Collection | null) => {
        ignore(() => {
          const previousCollection = _collection();
          if (previousCollection === newCollection) return;

          wrappedObject(observable, newCollection);

          // Unbind from previous
          if (previousCollection) {
            previousCollection.off('all', onCollectionChange);
          }

          // Bind to new
          if (newCollection) {
            newCollection.on('all', onCollectionChange);
          }

          _collection(newCollection);
        });
      },
    });

    (observable as CollectionObservableInternal).collection = state.collection = collectionComputed;

    // Bind to initial collection
    if (collection) {
      collection.on('all', onCollectionChange);
    }

    // Mapper computed
    _mapper = ko.computed(() => {
      const comparatorFn = _comparator();
      const filterList = _filters();

      // Create dependencies on filters
      if (filterList) {
        for (const filter of filterList) {
          ko.utils.unwrapObservable(filter);
        }
      }

      const currentCollection = _collection();
      if (state.in_edit) return;

      const obs = getObservable(state) as ko.ObservableArray;
      const models = currentCollection?.models;

      let viewModels: unknown[];

      if (!models || models.length === 0) {
        viewModels = [];
      } else {
        // Apply filters
        const filteredModels = filterList.length ? models.filter((model: Backbone.Model) => selectModel(model)) : models;

        // Apply sorting
        if (comparatorFn) {
          viewModels = filteredModels.map((model: Backbone.Model) => createViewModel(model)).sort(comparatorFn as (valueA: unknown, valueB: unknown) => number);
        } else {
          if (state.modelsOnly) {
            viewModels = filterList.length ? filteredModels : filteredModels.slice();
          } else {
            viewModels = filteredModels.map((model: Backbone.Model) => createViewModel(model));
          }
        }
      }

      // Update observable array
      state.in_edit++;
      obs(viewModels);
      state.in_edit--;
    });

    // Subscribe to changes
    observable.subscribe(onObservableArrayChange);

    // Statistics
    if ((globalThis as KnockbackGlobal).statistics) {
      ((globalThis as KnockbackGlobal).statistics as NonNullable<KnockbackGlobal['statistics']>).register('CollectionObservable', state);
    }

    return observable as CollectionObservable<T>;

    // =============================================================================
    // Instance Methods (closures)
    // =============================================================================

    function dispose(): void {
      if (state.__kb_dispose && state.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) return;
      state.__kb_dispose = KB_DISPOSE_STATE.DISPOSED;
      const obs = getObservable(state) as Observable & ko.ObservableArray;
      const coll = peek(_collection);

      wrappedObject(obs, null);

      if (coll) {
        coll.off('all', onCollectionChange);
        const array = peek(obs) as unknown[];
        array.splice(0, array.length);
      }

      state.collection?.dispose();
      (obs as unknown as Record<string, unknown>).collection = state.collection = undefined;

      _mapper.dispose();

      _filters([]);
      _filters = null as unknown as ko.ObservableArray<unknown>;

      _comparator(null);

      state.create_options = undefined;
      disposeMetadata(state);

      if ((globalThis as KnockbackGlobal).statistics) {
        ((globalThis as KnockbackGlobal).statistics as NonNullable<KnockbackGlobal['statistics']>).unregister('CollectionObservable', state);
      }
    }

    function shareOptions(): { store: unknown; factory: unknown } {
      const obs = observable;
      return {
        store: wrappedStore(obs),
        factory: wrappedFactory(obs),
      };
    }

    function filters(newFilters?: unknown | unknown[]): void {
      if (newFilters) {
        _filters(Array.isArray(newFilters) ? newFilters : [newFilters]);
      } else {
        _filters([]);
      }
    }

    function setComparator(comparatorFn: StoredComparator | null): void {
      _comparator(comparatorFn);
    }

    function sortAttribute(attr: string | null): void {
      _comparator(attr ? attributeComparator(attr) : null);
    }

    function viewModelByModel(model: Backbone.Model): unknown | null {
      if (state.modelsOnly) return null;

      const idAttribute = Object.hasOwn(model, model.idAttribute) ? model.idAttribute : 'cid';
      const obs = getObservable(state) as ko.ObservableArray;

      return (
        peek(obs).find((test: unknown) => {
          const testObj = test as { __kb?: { object?: Backbone.Model } };
          if (testObj?.__kb?.object) {
            const testModel = testObj.__kb.object as unknown as Record<string, unknown>;
            const sourceModel = model as unknown as Record<string, unknown>;
            return testModel[idAttribute] === sourceModel[idAttribute];
          }
          return false;
        }) || null
      );
    }

    function hasViewModels(): boolean {
      return !state.modelsOnly;
    }

    function compact(): void {
      ignore(() => {
        const obs = observable;
        if (!wrappedStoreIsOwned(obs)) return;

        const store = wrappedStore(obs) as Store;
        store.clear();
        _collection.notifySubscribers(_collection());
      });
    }

    // =============================================================================
    // Private Helpers (closures)
    // =============================================================================

    function shareOrCreateFactory(opts: InternalCollectionObservableOptions<T>): Factory {
      const absoluteModelsPath = pathJoin(opts.path, 'models');
      const factories = opts.factories;

      // Check existing factory
      const existingFactory = opts.factory as Factory | undefined;
      if (existingFactory) {
        const existingCreator = existingFactory.creatorForPath(null, absoluteModelsPath);
        if (existingCreator && (!factories || (factories as Record<string, unknown>).models === existingCreator)) {
          if (!factories) return existingFactory;
          if (existingFactory.hasPathMappings(factories, opts.path)) {
            return existingFactory;
          }
        }
      }

      // Create new factory
      const factory = new Factory(existingFactory);
      if (factories) {
        factory.addPathMappings(factories, opts.path);
      }

      // Set up default creator
      if (!factory.creatorForPath(null, absoluteModelsPath)) {
        if (Object.hasOwn(opts, 'modelsOnly')) {
          if (opts.modelsOnly) {
            factory.addPathMapping(absoluteModelsPath, { modelsOnly: true });
          } else {
            factory.addPathMapping(absoluteModelsPath, viewModelFactory);
          }
        } else if (opts.viewModel) {
          factory.addPathMapping(absoluteModelsPath, opts.viewModel);
        } else if (opts.create) {
          factory.addPathMapping(absoluteModelsPath, { create: opts.create });
        } else {
          factory.addPathMapping(absoluteModelsPath, viewModelFactory);
        }
      }

      return factory;
    }

    function onCollectionChange(event: string, arg: Backbone.Model): void {
      ignore(() => {
        if (state.in_edit || wasReleased(state)) return;

        switch (event) {
          case 'reset':
            if (state.autoCompact) {
              compact();
            } else {
              _collection.notifySubscribers(_collection());
            }
            break;

          case 'sort':
          case 'resort':
            _collection.notifySubscribers(_collection());
            break;

          case 'new':
          case 'add': {
            if (!selectModel(arg)) return;

            const obs = getObservable(state) as ko.ObservableArray;
            const coll = _collection();
            if (!coll || coll.indexOf(arg) === -1) return;
            if (viewModelByModel(arg)) return;

            state.in_edit++;
            const comp = _comparator();
            if (comp) {
              (obs as ko.ObservableArray)().push(createViewModel(arg));
              obs.sort(comp as (valueA: unknown, valueB: unknown) => number);
            } else {
              obs.splice(coll.indexOf(arg), 0, createViewModel(arg));
            }
            state.in_edit--;
            break;
          }

          case 'remove':
          case 'dispose':
            onModelRemove(arg);
            break;

          case 'change': {
            if (!selectModel(arg)) {
              onModelRemove(arg);
              return;
            }

            const vm = state.modelsOnly ? arg : viewModelByModel(arg);
            if (!vm) {
              onCollectionChange('add', arg);
              return;
            }

            const comp = _comparator();
            if (!comp) return;

            state.in_edit++;
            (getObservable(state) as ko.ObservableArray).sort(comp as (valueA: unknown, valueB: unknown) => number);
            state.in_edit--;
            break;
          }
        }
      });
    }

    function onModelRemove(model: Backbone.Model): void {
      const vm = state.modelsOnly ? model : viewModelByModel(model);
      if (!vm) return;

      const obs = getObservable(state) as ko.ObservableArray;
      state.in_edit++;
      obs.remove(vm);
      state.in_edit--;
    }

    function onObservableArrayChange(modelsOrViewModels: unknown[]): void {
      ignore(() => {
        if (state.in_edit) return;

        const obs = getObservable(state) as ko.ObservableArray;
        const coll = peek(_collection);
        const hasFilters = peek(_filters).length > 0;

        if (!coll) return;

        let viewModels = modelsOrViewModels;
        let models: Backbone.Model[];

        if (state.modelsOnly) {
          models = hasFilters ? (modelsOrViewModels.filter((model) => selectModel(model as Backbone.Model)) as Backbone.Model[]) : (modelsOrViewModels as Backbone.Model[]);
        } else {
          const candidates = modelsOrViewModels.map((viewModel) => {
            if ((typeof viewModel !== 'object' || viewModel === null) && typeof viewModel !== 'function') {
              throw new TypeError('CollectionObservable array items must be objects or functions');
            }
            const model = wrappedObject(viewModel);
            if (!isModel(model)) {
              throw new TypeError('CollectionObservable array items must wrap a model');
            }
            return { model, viewModel };
          });
          const selected = hasFilters ? candidates.filter(({ model }) => selectModel(model)) : candidates;

          if (hasFilters) viewModels = selected.map(({ viewModel }) => viewModel);
          models = [];
          const store = state.create_options?.store as Store;
          const creator = state.create_options?.creator;
          const planned = new Map<string | Backbone.Model, object>();

          for (const { model, viewModel } of selected) {
            const cachedViewModel = creator ? store.find(model, creator) : null;
            const key = model.cid || model;
            const currentViewModel = creator ? planned.get(key) || cachedViewModel : null;
            if (currentViewModel) {
              if (currentViewModel.constructor !== viewModel.constructor) {
                _throwUnexpected({ constructor: { name: 'CollectionObservable' } }, 'replacing different type of view model');
              }
            }
            if (creator) planned.set(key, viewModel);
          }

          for (const { model, viewModel } of selected) {
            // Retain in store
            store.retain(viewModel, model, creator);
            models.push(model);
          }
        }

        state.in_edit++;
        if (modelsOrViewModels.length !== viewModels.length) {
          obs(viewModels);
        }
        if (!_.isEqual(coll.models, models)) {
          coll.reset(models);
        }
        state.in_edit--;
      });
    }

    function attributeComparator(attr: string): StoredComparator {
      const modelAttributeCompare = (modelA: Backbone.Model, modelB: Backbone.Model): number => {
        const attributeName = ko.utils.unwrapObservable(attr);
        return compare(modelA.get(attributeName), modelB.get(attributeName));
      };

      if (state.modelsOnly) {
        return modelAttributeCompare;
      }

      return (a: unknown, b: unknown): number => {
        return modelAttributeCompare(wrappedModel(a as object) as Backbone.Model, wrappedModel(b as object) as Backbone.Model);
      };
    }

    function createViewModel(model: Backbone.Model): unknown {
      if (state.modelsOnly) return model;
      if (!state.create_options) throw new NotInitializedError('CollectionObservable', 'create_options');
      const store = state.create_options.store as Store;
      return store.retainOrCreate(model, state.create_options);
    }

    function selectModel(model: Backbone.Model): boolean {
      const filterList = peek(_filters);

      for (let filter of filterList) {
        filter = peek(filter);

        if (typeof filter === 'function') {
          if (!(filter as FilterFn)(model)) return false;
        } else if (Array.isArray(filter)) {
          if (!filter.includes(model.id)) return false;
        } else {
          if (model.id !== filter) return false;
        }
      }

      return true;
    }
  }) as CollectionObservable<T>;
}

export default collectionObservable;
