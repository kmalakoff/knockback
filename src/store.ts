import ko from 'knockout';
import _ from 'underscore';
import { UnexpectedValueError } from './errors/index.ts';
import type { CreateOptions, Creator } from './internal-types.ts';
import { isCreatorConstructor, isCreatorObject } from './internal-types.ts';
import { ignore, isModel, settings } from './kb.ts';
import type { InternalCreateOptions, InternalViewModelOptions, ObservableBase, StoreReference, ViewModelOptions } from './types.ts';
import { createFromDefaultCreator, disposeDisposableKeys, get, inferCreator, orSet, wrappedCreator, wrappedObject, wrappedStore, wrappedStoreIsOwned } from './utils.ts';

interface ObservableRecord {
  [cid: string]: unknown;
}

// Store for caching and sharing view models
export class Store {
  static instances: Store[] = [];

  __kb_released = false;
  observable_records: Record<string, ObservableRecord> = {};
  replaced_observables: unknown[] = [];

  // Use existing store from options or create a new one
  static useOptionsOrCreate(options: InternalViewModelOptions, obj: unknown, observable: ObservableBase): Store {
    if (!options.store) {
      wrappedStoreIsOwned(observable, true);
    }

    const store = wrappedStore(observable, (options.store as Store) || new Store()) as Store;
    store.retain(observable, obj, options.creator);
    return store;
  }

  constructor() {
    Store.instances.push(this);
  }

  // Clean up the store
  dispose(): void {
    if (this.__kb_released) return;
    this.__kb_released = true;
    this.clear();

    const index = Store.instances.indexOf(this);
    if (index >= 0) {
      Store.instances.splice(index, 1);
    }
  }

  // Clear all stored observables
  clear(): void {
    const observableRecords = this.observable_records;
    this.observable_records = {};

    for (const creatorId in observableRecords) {
      const records = observableRecords[creatorId];
      for (const cid in records) {
        this.release(records[cid], true);
      }
    }

    const replacedObservables = this.replaced_observables;
    this.replaced_observables = [];

    for (const observable of replacedObservables) {
      if (!(observable as { __kb_released?: boolean }).__kb_released) {
        this.release(observable, true);
      }
    }
  }

  // Compact by removing released observables
  compact(): void {
    for (const creatorId in this.observable_records) {
      const records = this.observable_records[creatorId];
      for (const cid in records) {
        if ((records[cid] as { __kb_released?: boolean }).__kb_released) {
          delete records[cid];
        }
      }
    }
  }

  // Retain an observable in the store
  retain(observable: unknown, obj: unknown, creator?: Creator): unknown {
    if (!this._canRegister(observable)) return observable;

    creator = creator || (observable as { constructor: Creator }).constructor;

    const currentObservable = this.find(obj, creator);
    if (currentObservable) {
      if (currentObservable === observable) {
        // Already in store, increment ref count
        this._getOrCreateStoreReferences(observable).ref_count++;
        return observable;
      }
      this._retire(currentObservable);
    }

    this._add(observable, obj, creator);
    this._getOrCreateStoreReferences(observable).ref_count++;
    return observable;
  }

  // Find or create an observable
  retainOrCreate(obj: unknown, options: InternalCreateOptions, deepRetain?: boolean): unknown {
    const creator = this._creator(obj, options);
    if (!creator) {
      return createFromDefaultCreator(obj, options as ViewModelOptions);
    }

    if ((creator as { models_only?: boolean }).models_only) {
      return obj;
    }

    const existing = this.find(obj, creator);
    if (existing) {
      if (deepRetain && settings.deep_retain) {
        return this.retain(existing, obj, creator);
      }
      return existing;
    }

    // Determine the create function based on creator type
    let createFn: ((obj: unknown, opts: CreateOptions) => unknown) | undefined;
    if (isCreatorObject(creator)) {
      createFn = creator.create;
    } else if (typeof creator === 'function') {
      createFn = creator as (obj: unknown, opts: CreateOptions) => unknown;
    }

    if (!createFn) {
      throw new UnexpectedValueError('Store', `Invalid factory for "${options.path}"`);
    }

    const newObservable = ignore(() => {
      const createOptions = { store: this, creator, ...options };
      let result: unknown;

      if (isCreatorObject(creator)) {
        result = creator.create(obj, createOptions);
      } else if (isCreatorConstructor(creator)) {
        result = new creator(obj, createOptions);
      } else {
        result = creator(obj, createOptions);
      }

      return result || ko.observable(null);
    });

    this.retain(newObservable, obj, creator);
    return newObservable;
  }

  // Reuse an observable with a different object
  reuse(observable: unknown, obj: unknown): void {
    const currentObj = wrappedObject(observable);
    if (currentObj === obj) return;

    if (!this._canRegister(observable)) {
      throw new UnexpectedValueError('Store', 'Cannot reuse a simple observable');
    }

    if (this._refCount(observable) !== 1) {
      throw new UnexpectedValueError('Store', `Trying to change a shared view model. Ref count: ${this._refCount(observable)}`);
    }

    const creator = wrappedCreator(observable) || (observable as { constructor: Creator }).constructor;
    const currentObservable = !_.isUndefined(currentObj) ? this.find(currentObj, creator) : undefined;

    this.retain(observable, obj, creator);

    if (currentObservable) {
      this.release(currentObservable);
    }
  }

  // Release an observable
  release(observable: unknown, force?: boolean): void {
    if (!this._canRegister(observable)) {
      (observable as { dispose?: () => void }).dispose?.();
      return;
    }

    const storeReferences = this._storeReferences(observable);
    if (storeReferences) {
      if (!force && --storeReferences.ref_count > 0) {
        return; // Don't release yet
      }
      this._clearStoreReferences(observable);
    }

    this._remove(observable);

    if ((observable as { __kb_released?: boolean }).__kb_released) return;

    if (force || this._refCount(observable) <= 1) {
      const disposable = observable as { dispose?: () => void };
      if (typeof disposable.dispose === 'function') {
        disposable.dispose();
      } else if (observable && typeof observable === 'object') {
        disposeDisposableKeys(observable as Record<string, unknown>);
      }
    }
  }

  // Find an observable by object and creator
  find(obj: unknown, creator: Creator): unknown {
    const records = this.observable_records[this._creatorId(creator)];
    if (!records) return null;

    const cid = this._cid(obj);
    const observable = records[cid];

    if (observable && (observable as { __kb_released?: boolean }).__kb_released) {
      delete records[cid];
      return null;
    }

    return observable || null;
  }

  // Get total reference count across all stores
  private _refCount(observable: unknown): number {
    if ((observable as { __kb_released?: boolean }).__kb_released) {
      console?.log?.('Observable already released');
      return 0;
    }

    const storesReferences = get(observable, 'stores_references') as StoreReference[] | undefined;
    if (!storesReferences) return 1;

    return storesReferences.reduce((memo, ref) => memo + ref.ref_count, 0);
  }

  // Check if observable can be registered (not a basic ko.observable or CollectionObservable)
  private _canRegister(observable: unknown): boolean {
    if (!observable) return false;
    if (ko.isObservable(observable)) return false;
    if ((observable as ObservableBase).__kb_is_co) return false;
    return true;
  }

  // Get or create cid for object
  private _cid(obj: unknown): string {
    if (!obj) return 'null';
    const model = obj as { cid?: string };
    if (!model.cid) {
      model.cid = _.uniqueId('c');
    }
    return model.cid;
  }

  // Get or create id for creator
  private _creatorId(creator: Creator): string {
    const createFn = isCreatorObject(creator) ? creator.create : creator;
    const fnWithCids = createFn as { __kb_cids?: Array<{ create: unknown; cid: string }> };

    fnWithCids.__kb_cids = fnWithCids.__kb_cids || [];

    for (const item of fnWithCids.__kb_cids) {
      if (item.create === createFn) {
        return item.cid;
      }
    }

    const item = { create: createFn, cid: _.uniqueId('kb') };
    fnWithCids.__kb_cids.push(item);
    return item.cid;
  }

  // Get store references for this store
  private _storeReferences(observable: unknown): StoreReference | undefined {
    const storesReferences = get(observable, 'stores_references') as StoreReference[] | undefined;
    if (!storesReferences) return undefined;
    return storesReferences.find((ref) => ref.store === this);
  }

  // Get or create store references
  private _getOrCreateStoreReferences(observable: unknown): StoreReference {
    const storesReferences = orSet(observable, 'stores_references', []) as StoreReference[];
    let storeRef = storesReferences.find((ref) => ref.store === this);

    if (!storeRef) {
      storeRef = {
        store: this,
        ref_count: 0,
        release: () => this.release(observable),
      };
      storesReferences.push(storeRef);
    }

    return storeRef;
  }

  // Clear store references
  private _clearStoreReferences(observable: unknown): void {
    const obj = observable as { __kb?: { stores_references?: StoreReference[] } };
    if (obj.__kb?.stores_references) {
      const index = obj.__kb.stores_references.findIndex((ref) => ref.store === this);
      if (index >= 0) {
        obj.__kb.stores_references.splice(index, 1);
      }
    }
  }

  // Retire an observable (move to replaced list)
  private _retire(observable: unknown): void {
    this._clearStoreReferences(observable);
    this.replaced_observables.push(observable);
    this._remove(observable);
  }

  // Add observable to store
  private _add(observable: unknown, obj: unknown, creator?: Creator): void {
    creator = creator || (observable as { constructor: Creator }).constructor;
    wrappedObject(observable, obj as Backbone.Model | Backbone.Collection | null);
    wrappedCreator(observable, creator);

    const creatorId = this._creatorId(creator);
    this.observable_records[creatorId] = this.observable_records[creatorId] || {};
    this.observable_records[creatorId][this._cid(obj)] = observable;
  }

  // Remove observable from store
  private _remove(observable: unknown): void {
    const creator = wrappedCreator(observable) || (observable as { constructor: Creator }).constructor;
    const obj = wrappedObject(observable);

    const currentObservable = this.find(obj, creator);
    if (currentObservable === observable) {
      const creatorId = this._creatorId(creator);
      delete this.observable_records[creatorId][this._cid(obj)];
    }

    wrappedObject(observable, null);
    wrappedCreator(observable, undefined);
  }

  // Get creator for object
  private _creator(obj: unknown, options: InternalCreateOptions): Creator | undefined {
    if (options.creator) return options.creator;

    const creator = inferCreator(obj, options.factory, options.path || '');
    if (creator) return creator;

    if (isModel(obj)) {
      return globalThis.ViewModel;
    }

    return undefined;
  }
}

export default Store;
