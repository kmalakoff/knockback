import Backbone from 'backbone';
import ko from 'knockout';
import _ from 'underscore';
import kb from './kb.ts';
import utils from './utils.ts';
import extend from './functions/extend.ts';
import { Factory } from './factory.ts';
import { Store } from './store.ts';
import type { CollectionObservableOptions, CreateOptions, Creator, KBObservable, ViewModelOptions } from './types.ts';

const COMPARE_EQUAL = 0;
const COMPARE_ASCENDING = -1;
const COMPARE_DESCENDING = 1;

const KEYS_PUBLISH = ['destroy', 'shareOptions', 'filters', 'comparator', 'sortAttribute', 'viewModelByModel', 'hasViewModels'] as const;

type ComparatorFn = (a: unknown, b: unknown) => number;
type FilterFn = (model: Backbone.Model) => boolean;

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

// CollectionObservable for Backbone collections
export class CollectionObservable {
  static extend = extend;

  __kb: Record<string, unknown> = {};
  __kb_released?: boolean;
  in_edit = 0;
  models_only?: boolean;
  auto_compact?: boolean;
  path?: string;
  create_options!: CreateOptions & { creator?: Creator };

  private _collection!: ko.Observable<Backbone.Collection | null>;
  private _comparator!: ko.Observable<ComparatorFn | null>;
  private _filters!: ko.ObservableArray<unknown>;
  private _mapper!: ko.Computed<void>;

  collection!: ko.Computed<Backbone.Collection | null>;

  constructor(collection?: Backbone.Collection | unknown[], viewModel?: unknown, options?: CollectionObservableOptions) {
    return kb.ignore(() => {
      // Handle arguments
      let args = Array.from(arguments);

      // First argument is collection
      let inputCollection: Backbone.Collection;
      if (args[0] instanceof Backbone.Collection) {
        inputCollection = args.shift() as Backbone.Collection;
      } else if (Array.isArray(args[0])) {
        inputCollection = new Backbone.Collection(args.shift() as Backbone.Model[]);
      } else {
        inputCollection = new Backbone.Collection();
      }

      // Second argument can be view_model constructor
      if (typeof args[0] === 'function') {
        args[0] = { view_model: args[0] };
      }

      // Merge remaining options
      let mergedOptions: CollectionObservableOptions = {};
      for (const arg of args) {
        if (arg && typeof arg === 'object') {
          Object.assign(mergedOptions, arg);
        }
      }

      // Create the observable array
      const observable = utils.wrappedObservable(this, ko.observableArray([])) as KBObservable & ko.ObservableArray;
      observable.__kb_is_co = true;

      // Options
      mergedOptions = utils.collapseOptions(mergedOptions) as CollectionObservableOptions;
      if (mergedOptions.auto_compact) {
        this.auto_compact = true;
      }

      // Comparator
      if (mergedOptions.sort_attribute) {
        this._comparator = ko.observable(this._attributeComparator(mergedOptions.sort_attribute));
      } else {
        this._comparator = ko.observable(mergedOptions.comparator || null);
      }

      // Filters
      if (mergedOptions.filters) {
        this._filters = ko.observableArray(Array.isArray(mergedOptions.filters) ? mergedOptions.filters : [mergedOptions.filters]);
      } else {
        this._filters = ko.observableArray([]);
      }

      // Store
      const createOptions: CreateOptions & { creator?: Creator } = {
        store: Store.useOptionsOrCreate(mergedOptions as ViewModelOptions, inputCollection, observable),
      };
      this.create_options = createOptions;
      utils.wrappedObject(observable, inputCollection);

      // Factory
      this.path = mergedOptions.path;
      createOptions.factory = utils.wrappedFactory(observable, this._shareOrCreateFactory(mergedOptions));
      createOptions.path = utils.pathJoin(mergedOptions.path, 'models');

      // Check for models_only
      createOptions.creator = (createOptions.factory as Factory).creatorForPath(null, createOptions.path);
      if (createOptions.creator) {
        this.models_only = (createOptions.creator as { models_only?: boolean }).models_only;
      }

      // Publish methods
      kb.publishMethods(observable as unknown as Record<string, unknown>, this as unknown as Record<string, unknown>, KEYS_PUBLISH as unknown as string[]);

      // Collection observable
      this._collection = ko.observable(inputCollection);

      const collectionComputed = ko.computed({
        read: () => this._collection(),
        write: (newCollection: Backbone.Collection | null) => {
          kb.ignore(() => {
            const previousCollection = this._collection();
            if (previousCollection === newCollection) return;

            utils.wrappedObject(observable, newCollection);

            // Unbind from previous
            if (previousCollection) {
              previousCollection.off('all', this._onCollectionChange);
            }

            // Bind to new
            if (newCollection) {
              newCollection.on('all', this._onCollectionChange);
            }

            this._collection(newCollection);
          });
        },
      });

      observable.collection = this.collection = collectionComputed;

      // Bind to initial collection
      if (inputCollection) {
        inputCollection.on('all', this._onCollectionChange);
      }

      // Mapper computed
      this._mapper = ko.computed(() => {
        const comparator = this._comparator();
        const filters = this._filters();

        // Create dependencies on filters
        if (filters) {
          for (const filter of filters) {
            ko.utils.unwrapObservable(filter);
          }
        }

        const currentCollection = this._collection();
        if (this.in_edit) return;

        const obs = utils.wrappedObservable(this) as ko.ObservableArray;
        const previousViewModels = kb.peek(obs);
        const models = currentCollection?.models;

        let viewModels: unknown[];

        if (!models || models.length === 0) {
          viewModels = [];
        } else {
          // Apply filters
          let filteredModels = filters.length ? models.filter((model: Backbone.Model) => this._selectModel(model)) : models;

          // Apply sorting
          if (comparator) {
            viewModels = filteredModels.map((model: Backbone.Model) => this._createViewModel(model)).sort(comparator);
          } else {
            if (this.models_only) {
              viewModels = filters.length ? filteredModels : filteredModels.slice();
            } else {
              viewModels = filteredModels.map((model: Backbone.Model) => this._createViewModel(model));
            }
          }
        }

        // Update observable array
        this.in_edit++;
        obs(viewModels);
        this.in_edit--;
      });

      // Subscribe to changes
      observable.subscribe(this._onObservableArrayChange.bind(this));

      // Statistics
      const statistics = (kb as { statistics?: { register: (name: string, obj: unknown) => void } }).statistics;
      if (statistics) {
        statistics.register('CollectionObservable', this);
      }

      return observable as unknown as CollectionObservable;
    }) as unknown as CollectionObservable;
  }

  // Clean up
  destroy(): void {
    this.__kb_released = true;
    const observable = utils.wrappedObservable(this) as KBObservable & ko.ObservableArray;
    const collection = kb.peek(this._collection);

    utils.wrappedObject(observable, null);

    if (collection) {
      collection.off('all', this._onCollectionChange);
      const array = kb.peek(observable);
      array.splice(0, array.length);
    }

    this.collection.dispose();
    this._collection = undefined as unknown as ko.Observable<Backbone.Collection | null>;
    (observable as unknown as Record<string, unknown>).collection = this.collection = undefined as unknown as ko.Computed<Backbone.Collection | null>;

    this._mapper.dispose();
    this._mapper = undefined as unknown as ko.Computed<void>;

    kb.release(this._filters);
    this._filters = undefined as unknown as ko.ObservableArray<unknown>;

    this._comparator(null);
    this._comparator = undefined as unknown as ko.Observable<ComparatorFn | null>;

    this.create_options = undefined as unknown as CreateOptions;
    utils.wrappedDestroy(this);

    const statistics = (kb as { statistics?: { unregister: (name: string, obj: unknown) => void } }).statistics;
    if (statistics) {
      statistics.unregister('CollectionObservable', this);
    }
  }

  // Get share options
  shareOptions(): { store: unknown; factory: unknown } {
    const observable = utils.wrappedObservable(this);
    return {
      store: utils.wrappedStore(observable),
      factory: utils.wrappedFactory(observable),
    };
  }

  // Set filters
  filters(filters?: unknown | unknown[]): void {
    if (filters) {
      this._filters(Array.isArray(filters) ? filters : [filters]);
    } else {
      this._filters([]);
    }
  }

  // Set comparator
  comparator(comparator: ComparatorFn | null): void {
    this._comparator(comparator);
  }

  // Set sort attribute
  sortAttribute(sortAttribute: string | null): void {
    this._comparator(sortAttribute ? this._attributeComparator(sortAttribute) : null);
  }

  // Find view model by model
  viewModelByModel(model: Backbone.Model): unknown | null {
    if (this.models_only) return null;

    const idAttribute = Object.prototype.hasOwnProperty.call(model, model.idAttribute) ? model.idAttribute : 'cid';
    const observable = utils.wrappedObservable(this) as ko.ObservableArray;

    return kb.peek(observable).find((test: unknown) => {
      const testObj = test as { __kb?: { object?: Backbone.Model } };
      if (testObj?.__kb?.object) {
        return (testObj.__kb.object as Record<string, unknown>)[idAttribute] === (model as Record<string, unknown>)[idAttribute];
      }
      return false;
    }) || null;
  }

  // Check if has view models
  hasViewModels(): boolean {
    return !this.models_only;
  }

  // Compact the store
  compact(): void {
    kb.ignore(() => {
      const observable = utils.wrappedObservable(this);
      if (!utils.wrappedStoreIsOwned(observable)) return;

      const store = utils.wrappedStore(observable) as Store;
      store.clear();
      this._collection.notifySubscribers(this._collection());
    });
  }

  // Create or share factory
  private _shareOrCreateFactory(options: CollectionObservableOptions): Factory {
    const absoluteModelsPath = utils.pathJoin(options.path, 'models');
    const factories = options.factories;

    // Check existing factory
    const existingFactory = options.factory as Factory | undefined;
    if (existingFactory) {
      const existingCreator = existingFactory.creatorForPath(null, absoluteModelsPath);
      if (existingCreator && (!factories || (factories as Record<string, Creator>)['models'] === existingCreator)) {
        if (!factories) return existingFactory;
        if (existingFactory.hasPathMappings(factories, options.path)) {
          return existingFactory;
        }
      }
    }

    // Create new factory
    const factory = new Factory(existingFactory);
    if (factories) {
      factory.addPathMappings(factories, options.path);
    }

    // Set up default creator
    if (!factory.creatorForPath(null, absoluteModelsPath)) {
      if (Object.prototype.hasOwnProperty.call(options, 'models_only')) {
        if (options.models_only) {
          factory.addPathMapping(absoluteModelsPath, { models_only: true });
        } else {
          factory.addPathMapping(absoluteModelsPath, (kb as { ViewModel?: Creator }).ViewModel!);
        }
      } else if (options.view_model) {
        factory.addPathMapping(absoluteModelsPath, options.view_model);
      } else if (options.create) {
        factory.addPathMapping(absoluteModelsPath, { create: options.create });
      } else {
        factory.addPathMapping(absoluteModelsPath, (kb as { ViewModel?: Creator }).ViewModel!);
      }
    }

    return factory;
  }

  // Collection change handler
  private _onCollectionChange = (event: string, arg: Backbone.Model): void => {
    kb.ignore(() => {
      if (this.in_edit || kb.wasReleased(this)) return;

      switch (event) {
        case 'reset':
          if (this.auto_compact) {
            this.compact();
          } else {
            this._collection.notifySubscribers(this._collection());
          }
          break;

        case 'sort':
        case 'resort':
          this._collection.notifySubscribers(this._collection());
          break;

        case 'new':
        case 'add':
          if (!this._selectModel(arg)) return;

          const observable = utils.wrappedObservable(this) as ko.ObservableArray;
          const collection = this._collection();
          if (!collection || collection.indexOf(arg) === -1) return;
          if (this.viewModelByModel(arg)) return;

          this.in_edit++;
          const comparator = this._comparator();
          if (comparator) {
            (observable as ko.ObservableArray)().push(this._createViewModel(arg));
            observable.sort(comparator);
          } else {
            observable.splice(collection.indexOf(arg), 0, this._createViewModel(arg));
          }
          this.in_edit--;
          break;

        case 'remove':
        case 'destroy':
          this._onModelRemove(arg);
          break;

        case 'change':
          if (!this._selectModel(arg)) {
            this._onModelRemove(arg);
            return;
          }

          const viewModel = this.models_only ? arg : this.viewModelByModel(arg);
          if (!viewModel) {
            this._onCollectionChange('add', arg);
            return;
          }

          const comp = this._comparator();
          if (!comp) return;

          this.in_edit++;
          (utils.wrappedObservable(this) as ko.ObservableArray).sort(comp);
          this.in_edit--;
          break;
      }
    });
  };

  // Model remove handler
  private _onModelRemove(model: Backbone.Model): void {
    const viewModel = this.models_only ? model : this.viewModelByModel(model);
    if (!viewModel) return;

    const observable = utils.wrappedObservable(this) as ko.ObservableArray;
    this.in_edit++;
    observable.remove(viewModel);
    this.in_edit--;
  }

  // Observable array change handler
  private _onObservableArrayChange(modelsOrViewModels: unknown[]): void {
    kb.ignore(() => {
      if (this.in_edit) return;

      const observable = utils.wrappedObservable(this) as ko.ObservableArray;
      const collection = kb.peek(this._collection);
      const hasFilters = kb.peek(this._filters).length > 0;

      if (!collection) return;

      let viewModels = modelsOrViewModels;
      let models: Backbone.Model[];

      if (this.models_only) {
        models = hasFilters
          ? modelsOrViewModels.filter((model) => this._selectModel(model as Backbone.Model)) as Backbone.Model[]
          : modelsOrViewModels as Backbone.Model[];
      } else {
        if (hasFilters) viewModels = [];
        models = [];

        for (const viewModel of modelsOrViewModels) {
          const model = utils.wrappedObject(viewModel) as Backbone.Model;

          if (hasFilters) {
            if (!this._selectModel(model)) continue;
            (viewModels as unknown[]).push(viewModel);
          }

          // Retain in store
          const store = this.create_options.store as Store;
          const currentViewModel = store.find(model, this.create_options.creator!);
          if (currentViewModel) {
            if (currentViewModel.constructor !== (viewModel as object).constructor) {
              kb._throwUnexpected(this, 'replacing different type of view model');
            }
          }
          store.retain(viewModel, model, this.create_options.creator);
          models.push(model);
        }
      }

      this.in_edit++;
      if (modelsOrViewModels.length !== viewModels.length) {
        observable(viewModels);
      }
      if (!_.isEqual(collection.models, models)) {
        collection.reset(models);
      }
      this.in_edit--;
    });
  }

  // Create attribute comparator
  private _attributeComparator(sortAttribute: string): ComparatorFn {
    const modelAttributeCompare = (modelA: Backbone.Model, modelB: Backbone.Model): number => {
      const attributeName = ko.utils.unwrapObservable(sortAttribute);
      return compare(modelA.get(attributeName), modelB.get(attributeName));
    };

    if (this.models_only) {
      return modelAttributeCompare;
    }

    return (a: unknown, b: unknown): number => {
      return modelAttributeCompare(
        utils.wrappedModel(a) as Backbone.Model,
        utils.wrappedModel(b) as Backbone.Model
      );
    };
  }

  // Create view model for model
  private _createViewModel(model: Backbone.Model): unknown {
    if (this.models_only) return model;
    const store = this.create_options.store as Store;
    return store.retainOrCreate(model, this.create_options);
  }

  // Check if model passes filters
  private _selectModel(model: Backbone.Model): boolean {
    const filters = kb.peek(this._filters);

    for (let filter of filters) {
      filter = kb.peek(filter);

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
}

// Factory functions
export function collectionObservable(collection?: Backbone.Collection | unknown[], viewModel?: unknown, options?: CollectionObservableOptions): ko.ObservableArray {
  return new CollectionObservable(collection, viewModel, options) as unknown as ko.ObservableArray;
}

export const observableCollection = collectionObservable;

export default CollectionObservable;
