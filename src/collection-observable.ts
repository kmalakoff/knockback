import Backbone from 'backbone';
import ko from 'knockout';
import _ from 'underscore';
import { KB_DISPOSE_STATE } from './constants.ts';
import { NotInitializedError } from './errors/index.ts';
import { Factory } from './factory.ts';
import type { Creator } from './internal-types.ts';
import { _throwUnexpected, ignore, peek, publishMethods, wasReleased } from './kb.ts';
import { Store } from './store.ts';
import type { CollectionObservable, CollectionObservableInternal, CollectionObservableOptions, InternalCollectionObservableOptions, InternalCreateOptions, Observable } from './types.ts';
import { attachDispose, collapseOptions, disposeMetadata, getObservable, pathJoin, setObservable, wrappedFactory, wrappedModel, wrappedObject, wrappedStore, wrappedStoreIsOwned } from './utils.ts';
import { viewModel as viewModelFactory } from './view-model.ts';

const COMPARE_EQUAL = 0;
const COMPARE_ASCENDING = -1;
const COMPARE_DESCENDING = 1;

const KEYS_PUBLISH = ['dispose', 'shareOptions', 'filters', 'comparator', 'sortAttribute', 'viewModelByModel', 'hasViewModels'] as const;

type ComparatorFn = (a: unknown, b: unknown) => number;
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
  comparator(comparator: ComparatorFn | null): void;
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
  return valueA === valueB ? COMPARE_EQUAL : valueA < valueB ? COMPARE_ASCENDING : COMPARE_DESCENDING;
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
export function collectionObservable<T = unknown>(inputCollection: Backbone.Collection | Backbone.Model[] | Record<string, unknown>[], viewModelOrOptions?: CollectionObservableOptions<T> | CollectionObservableOptions<T>['viewModel'], options?: CollectionObservableOptions<T>): CollectionObservable<T>;
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
    let mergedOptions: CollectionObservableOptions<T> = {};
    if (typeof viewModelOrOptions === 'function') {
      mergedOptions = { viewModel: viewModelOrOptions as Creator<T> };
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
    let _comparator: ko.Observable<ComparatorFn | null>;
    let _filters: ko.ObservableArray<unknown>;
    let _mapper: ko.Computed<void>;

    // Create the observable array - cast to internal type to allow property assignments
    const observable = setObservable(state, ko.observableArray([])) as unknown as CollectionObservableInternal<T>;
    observable.__kb_is_co = true;

    // Options
    mergedOptions = collapseOptions(mergedOptions) as CollectionObservableOptions<T>;
    if (mergedOptions.autoCompact) {
      state.autoCompact = true;
    }

    // Comparator
    if (mergedOptions.sortAttribute) {
      _comparator = ko.observable(attributeComparator(mergedOptions.sortAttribute));
    } else {
      _comparator = ko.observable(mergedOptions.comparator || null);
    }

    // Filters
    if (mergedOptions.filters) {
      _filters = ko.observableArray(Array.isArray(mergedOptions.filters) ? mergedOptions.filters : [mergedOptions.filters]);
    } else {
      _filters = ko.observableArray([]);
    }

    // Store
    const createOptions: InternalCreateOptions = {
      store: Store.useOptionsOrCreate(mergedOptions as InternalCollectionObservableOptions, collection, observable),
    };
    state.create_options = createOptions;
    wrappedObject(observable, collection);

    // Factory
    state.path = mergedOptions.path;
    createOptions.factory = wrappedFactory(observable, shareOrCreateFactory(mergedOptions as InternalCollectionObservableOptions));
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
    _collection = ko.observable(collection);

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
          viewModels = filteredModels.map((model: Backbone.Model) => createViewModel(model)).sort(comparatorFn);
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
    if (globalThis.statistics) {
      globalThis.statistics.register('CollectionObservable', state);
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

      if (globalThis.statistics) {
        globalThis.statistics.unregister('CollectionObservable', state);
      }
    }

    function shareOptions(): { store: unknown; factory: unknown } {
      const obs = getObservable(state);
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

    function setComparator(comparatorFn: ComparatorFn | null): void {
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
        const obs = getObservable(state);
        if (!wrappedStoreIsOwned(obs)) return;

        const store = wrappedStore(obs) as Store;
        store.clear();
        _collection.notifySubscribers(_collection());
      });
    }

    // =============================================================================
    // Private Helpers (closures)
    // =============================================================================

    function shareOrCreateFactory(opts: InternalCollectionObservableOptions): Factory {
      const absoluteModelsPath = pathJoin(opts.path, 'models');
      const factories = opts.factories;

      // Check existing factory
      const existingFactory = opts.factory as Factory | undefined;
      if (existingFactory) {
        const existingCreator = existingFactory.creatorForPath(null, absoluteModelsPath);
        if (existingCreator && (!factories || (factories as Record<string, Creator>).models === existingCreator)) {
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
            factory.addPathMapping(absoluteModelsPath, viewModelFactory as unknown as Creator);
          }
        } else if (opts.viewModel) {
          factory.addPathMapping(absoluteModelsPath, opts.viewModel);
        } else if (opts.create) {
          factory.addPathMapping(absoluteModelsPath, { create: opts.create });
        } else {
          factory.addPathMapping(absoluteModelsPath, viewModelFactory as unknown as Creator);
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
              obs.sort(comp);
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
            (getObservable(state) as ko.ObservableArray).sort(comp);
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
          if (hasFilters) viewModels = [];
          models = [];

          for (const vm of modelsOrViewModels) {
            const model = wrappedObject(vm) as Backbone.Model;

            if (hasFilters) {
              if (!selectModel(model)) continue;
              (viewModels as unknown[]).push(vm);
            }

            // Retain in store
            const store = state.create_options?.store as Store;
            const currentViewModel = state.create_options?.creator ? store.find(model, state.create_options?.creator) : null;
            if (currentViewModel) {
              if (currentViewModel.constructor !== (vm as object).constructor) {
                _throwUnexpected({ constructor: { name: 'CollectionObservable' } }, 'replacing different type of view model');
              }
            }
            store.retain(vm, model, state.create_options?.creator);
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

    function attributeComparator(attr: string): ComparatorFn {
      const modelAttributeCompare = (modelA: Backbone.Model, modelB: Backbone.Model): number => {
        const attributeName = ko.utils.unwrapObservable(attr);
        return compare(modelA.get(attributeName), modelB.get(attributeName));
      };

      if (state.modelsOnly) {
        return modelAttributeCompare;
      }

      return (a: unknown, b: unknown): number => {
        return modelAttributeCompare(wrappedModel(a) as Backbone.Model, wrappedModel(b) as Backbone.Model);
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
