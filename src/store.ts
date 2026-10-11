import ko from 'knockout';
import _ from 'underscore';
import { KB_DISPOSE_STATE } from './constants.ts';
import { UnexpectedValueError } from './errors/index.ts';
import type { KnockbackGlobal, StoredCreator } from './internal-types.ts';
import { isCreatorConstructor, isCreatorObject } from './internal-types.ts';
import { ignore, isModel, settings } from './kb.ts';
import type { InternalCreateOptions, InternalViewModelOptions, ObservableBase, StoreInternal, StoreReference, StoreRetainState, ViewModelOptions } from './types.ts';
import type { KBObject } from './utils.ts';
import { createFromDefaultCreator, disposeDisposableKeys, get, inferCreator, orSet, wrappedCreator, wrappedObject, wrappedStore, wrappedStoreIsOwned } from './utils.ts';

/**
 * Record of observables cached by model CID
 * @internal
 */
export interface ObservableRecord {
  [cid: string]: KBObject;
}

interface StoreRegistration {
  creatorId: string;
  cid?: string;
  records?: ObservableRecord;
  observable?: KBObject;
}

interface ReversibleMetadata {
  metadata: Record<string, unknown>;
  object: Backbone.Model | Backbone.Collection | null | undefined;
  creator: StoredCreator;
  reference: StoreReference;
}

const REVERSIBLE_METADATA_ERROR = 'Store owner metadata must use writable data properties for reversible retention';

/**
 * Store implementation for caching and sharing view models.
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
export class Store implements StoreInternal {
  static instances: Store[] = [];

  __kb_dispose?: number;
  observable_records: Record<string, ObservableRecord> = {};
  replaced_observables: KBObject[] = [];
  private _reversibleMoves = new WeakMap<KBObject, StoreRetainState>();
  private _committedMoves = new WeakSet<KBObject>();

  /** @internal Use existing store from options or create a new one */
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
    if (this.__kb_dispose && this.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) return;
    this.__kb_dispose = KB_DISPOSE_STATE.DISPOSED;
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
      const disposable = observable as { __kb_dispose?: number };
      if (!disposable.__kb_dispose || disposable.__kb_dispose < KB_DISPOSE_STATE.DISPOSING) {
        this.release(observable, true);
      }
    }
  }

  // Compact by removing released observables
  compact(): void {
    for (const creatorId in this.observable_records) {
      const records = this.observable_records[creatorId];
      for (const cid in records) {
        const disposable = records[cid] as { __kb_dispose?: number };
        if (disposable.__kb_dispose && disposable.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) {
          delete records[cid];
        }
      }
    }
  }

  /**
   * Retain an observable in the store
   * @internal
   */
  retain(observable: unknown, obj: unknown, creator?: StoredCreator | null, state?: StoreRetainState): unknown {
    if (observable && this._isMetadataOwner(observable) && this._reversibleMoves.has(observable)) {
      throw new UnexpectedValueError('Store', 'Cannot retain an owner during a reversible move');
    }
    if (state) {
      state.retained = false;
      state.cancelled = false;
      state.value = observable;
      state.rollback = undefined;
      state.commit = undefined;
      state.publish = undefined;
    }
    if (!observable) return observable;
    if (!this._isMetadataOwner(observable)) {
      throw new TypeError('Store owner must be an object or function');
    }
    if (!this._canRegister(observable)) return observable;

    creator = creator || (observable as { constructor: StoredCreator }).constructor;

    const destinationLookup = this._findRegistration(obj, creator);
    const currentObservable = destinationLookup.observable;
    if (currentObservable && this._committedMoves.has(currentObservable)) {
      throw new UnexpectedValueError('Store', 'Cannot replace an owner before publication');
    }
    if (currentObservable) {
      if (currentObservable === observable) {
        if (state) this._reversibleMetadata(observable);
        // Already in store, increment ref count
        const storeReferences = this._getOrCreateStoreReferences(observable);
        const previousRefCount = storeReferences.ref_count;
        storeReferences.ref_count++;
        if (state) {
          state.retained = true;
          state.rollback = () => {
            if (!state.retained) return;
            const currentReferences = this._storeReferences(observable);
            if (currentReferences !== storeReferences || currentReferences.ref_count <= previousRefCount) {
              state.retained = false;
              throw new UnexpectedValueError('Store', 'Retained owner changed during rollback');
            }
            if (!this._matchesRegistration(destinationLookup, observable) || wrappedObject(observable) !== obj || wrappedCreator(observable) !== creator) {
              currentReferences.ref_count--;
              state.retained = false;
              throw new UnexpectedValueError('Store', 'Retained owner changed during rollback');
            }
            state.retained = false;
            this.release(observable);
          };
        }
        return observable;
      }
      if (state) {
        throw new UnexpectedValueError('Store', 'Cannot replace a cached owner during reversible retain');
      }
      this._retire(currentObservable);
    }

    if (state) {
      const previousMetadata = this._reversibleMetadata(observable);
      if (previousMetadata && (previousMetadata.object !== obj || previousMetadata.creator !== creator)) {
        const previousRegistration = this._findRegistration(previousMetadata.object, previousMetadata.creator);
        if (previousRegistration.observable !== observable) {
          throw new UnexpectedValueError('Store', 'Cannot prepare an unregistered owner move');
        }

        const reference = previousMetadata.reference;
        const previousRefCount = reference.ref_count;
        let committed = false;
        let releasedPrevious = false;
        reference.ref_count++;
        state.retained = true;
        this._reversibleMoves.set(observable, state);
        state.rollback = () => {
          if (!state.retained) return;
          const isActive = this._reversibleMoves.get(observable) === state;
          const expectedRefCount = previousRefCount + 1 - (releasedPrevious ? 1 : 0);
          if (!isActive || !this._hasReversibleReference(observable, previousMetadata) || reference.ref_count !== expectedRefCount) {
            this._reversibleMoves.delete(observable);
            this._committedMoves.delete(observable);
            state.retained = false;
            state.rollback = undefined;
            state.commit = undefined;
            state.publish = undefined;
            throw new UnexpectedValueError('Store', 'Retained owner changed during rollback');
          }
          this._reversibleMoves.delete(observable);
          this._committedMoves.delete(observable);
          state.retained = false;
          state.rollback = undefined;
          state.commit = undefined;
          state.publish = undefined;
          if (committed) {
            this.release(observable);
          } else {
            reference.ref_count--;
          }
        };
        state.commit = (releasePrevious = false) => {
          if (!state.retained || this._reversibleMoves.get(observable) !== state) {
            throw new UnexpectedValueError('Store', 'Retained owner changed before commit');
          }
          if (reference.ref_count !== previousRefCount + 1 || !this._matchesReversibleMetadata(observable, previousMetadata) || this._findRegistration(previousMetadata.object, previousMetadata.creator).observable !== observable || this._findRegistration(obj, creator).observable) {
            throw new UnexpectedValueError('Store', 'Retained owner changed before commit');
          }

          this._add(observable, obj, creator);
          this._removeRecord(observable, previousMetadata.object, previousMetadata.creator);
          committed = true;
          this._committedMoves.add(observable);
          if (releasePrevious) {
            reference.ref_count--;
            releasedPrevious = true;
          }
          state.commit = undefined;
        };
        state.publish = () => {
          if (!committed || !state.retained || this._reversibleMoves.get(observable) !== state) {
            throw new UnexpectedValueError('Store', 'Retained owner changed before publication');
          }
          this._reversibleMoves.delete(observable);
          this._committedMoves.delete(observable);
          state.rollback = undefined;
          state.publish = undefined;
        };
        return observable;
      }
    }

    const destinationRegistration = this._add(observable, obj, creator);
    const storeReferences = this._getOrCreateStoreReferences(observable);
    const previousRefCount = storeReferences.ref_count;
    storeReferences.ref_count++;
    if (state) {
      state.retained = true;
      state.rollback = () => {
        if (!state.retained) return;
        const currentReferences = this._storeReferences(observable);
        if (currentReferences !== storeReferences || currentReferences.ref_count <= previousRefCount) {
          state.retained = false;
          throw new UnexpectedValueError('Store', 'Retained owner changed during rollback');
        }
        if (!this._matchesRegistration(destinationRegistration, observable) || wrappedObject(observable) !== obj || wrappedCreator(observable) !== creator) {
          currentReferences.ref_count--;
          state.retained = false;
          throw new UnexpectedValueError('Store', 'Retained owner changed during rollback');
        }
        state.retained = false;
        this.release(observable);
      };
    }
    return observable;
  }

  /**
   * Find or create an observable
   * @internal
   */
  retainOrCreate(obj: unknown, options: InternalCreateOptions, deepRetain?: boolean, state?: StoreRetainState): unknown {
    if (state) {
      state.created = false;
      state.retained = false;
      state.cancelled = false;
      state.value = undefined;
      state.rollback = undefined;
      state.commit = undefined;
      state.publish = undefined;
    }
    const creator = this._creator(obj, options);
    if (!creator) {
      const value = createFromDefaultCreator(obj, options as ViewModelOptions);
      if (state) {
        state.created = true;
        state.value = value;
      }
      return value;
    }

    if ((creator as { modelsOnly?: boolean }).modelsOnly) {
      return obj;
    }

    const existing = this.find(obj, creator);
    if (existing) {
      if (state) state.value = existing;
      if (deepRetain && settings.deep_retain) {
        return this.retain(existing, obj, creator, state);
      }
      return existing;
    }

    // Determine the create function based on creator type
    let createFn: unknown;
    if (isCreatorObject(creator)) {
      createFn = creator.create;
    } else if (typeof creator === 'function') {
      createFn = creator;
    }

    if (!createFn) {
      throw new UnexpectedValueError('Store', `Invalid factory for "${options.path}"`);
    }

    const newObservable = ignore(() => {
      const createOptions = { store: this, creator, ...options };
      let result: unknown;

      if (isCreatorObject(creator)) {
        result = (creator as { create: (obj: unknown, options: InternalCreateOptions) => unknown }).create(obj, createOptions);
      } else if (isCreatorConstructor(creator)) {
        result = new (creator as new (obj: unknown, options: InternalCreateOptions) => unknown)(obj, createOptions);
      } else if (typeof creator === 'function') {
        result = (creator as (obj: unknown, options: InternalCreateOptions) => unknown)(obj, createOptions);
      } else {
        throw new TypeError('creator is not callable');
      }

      return result || ko.observable(null);
    });

    if (state) {
      state.created = true;
      state.value = newObservable;
    }
    this.retain(newObservable, obj, creator, state);
    return newObservable;
  }

  /**
   * Reuse an observable with a different object
   * @internal
   */
  reuse(observable: unknown, obj: unknown): void {
    if (!this._isMetadataOwner(observable)) {
      throw new TypeError('Store owner must be an object or function');
    }

    const currentObj = wrappedObject(observable);
    if (currentObj === obj) return;

    if (!this._canRegister(observable)) {
      throw new UnexpectedValueError('Store', 'Cannot reuse a simple observable');
    }

    if (this._refCount(observable) !== 1) {
      throw new UnexpectedValueError('Store', `Trying to change a shared view model. Ref count: ${this._refCount(observable)}`);
    }

    const creator = wrappedCreator(observable) || (observable as { constructor: StoredCreator }).constructor;
    const currentObservable = !_.isUndefined(currentObj) ? this.find(currentObj, creator) : undefined;

    this.retain(observable, obj, creator);

    if (currentObservable) {
      this.release(currentObservable);
    }
  }

  /**
   * Release an observable
   * @internal
   */
  release(observable: unknown, force?: boolean): void {
    if (!this._isMetadataOwner(observable)) {
      throw new TypeError('Store owner must be an object or function');
    }

    if (!this._canRegister(observable)) {
      (observable as { dispose?: () => void }).dispose?.();
      return;
    }
    const reversibleMove = this._reversibleMoves.get(observable);
    if (reversibleMove) {
      if (!force) {
        throw new UnexpectedValueError('Store', 'Cannot release an owner during a reversible move');
      }
      reversibleMove.retained = false;
      reversibleMove.cancelled = true;
      reversibleMove.rollback = undefined;
      reversibleMove.commit = undefined;
      reversibleMove.publish = undefined;
      this._reversibleMoves.delete(observable);
      this._committedMoves.delete(observable);
    }

    const storeReferences = this._storeReferences(observable);
    if (storeReferences) {
      if (!force && --storeReferences.ref_count > 0) {
        return; // Don't release yet
      }
      this._clearStoreReferences(observable);
    }

    this._remove(observable);

    const disposable = observable as { __kb_dispose?: number };
    if (disposable.__kb_dispose && disposable.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) return;

    if (force || this._refCount(observable) <= 1) {
      const disposable = observable as { dispose?: () => void };
      if (typeof disposable.dispose === 'function') {
        disposable.dispose();
      } else if (observable && typeof observable === 'object') {
        disposeDisposableKeys(observable as Record<string, unknown>);
      }
    }
  }

  /**
   * Find an observable by object and creator
   * @internal
   */
  find(obj: unknown, creator: StoredCreator): KBObject | null {
    return this._findRegistration(obj, creator).observable || null;
  }

  // Get total reference count across all stores
  private _refCount(observable: KBObject): number {
    const disposable = observable as { __kb_dispose?: number };
    if (disposable.__kb_dispose && disposable.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) {
      console?.log?.('Observable already disposed');
      return 0;
    }

    const storesReferences = get(observable, 'stores_references') as StoreReference[] | undefined;
    if (!storesReferences) return 1;

    return storesReferences.reduce((memo, ref) => memo + ref.ref_count, 0);
  }

  // Check if observable can be registered (not a basic ko.observable or CollectionObservable)
  private _canRegister(observable: KBObject): boolean {
    if (ko.isObservable(observable)) return false;
    if ((observable as ObservableBase).__kb_is_co) return false;
    return true;
  }

  // Check if observable can own Knockback metadata
  private _isMetadataOwner(observable: unknown): observable is KBObject {
    return (typeof observable === 'object' && observable !== null) || typeof observable === 'function';
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
  private _creatorId(creator: StoredCreator): string {
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
  private _storeReferences(observable: KBObject): StoreReference | undefined {
    const storesReferences = get(observable, 'stores_references') as StoreReference[] | undefined;
    if (!storesReferences) return undefined;
    return storesReferences.find((ref) => ref.store === this);
  }

  private _reversibleMetadata(observable: KBObject): ReversibleMetadata | undefined {
    const ownerDescriptor = Object.getOwnPropertyDescriptor(observable, '__kb');
    if (!ownerDescriptor) return undefined;
    if (!('value' in ownerDescriptor) || !ownerDescriptor.writable || !ownerDescriptor.value || typeof ownerDescriptor.value !== 'object') {
      throw new TypeError(REVERSIBLE_METADATA_ERROR);
    }

    const metadata = ownerDescriptor.value as Record<string, unknown>;
    const referencesDescriptor = Object.getOwnPropertyDescriptor(metadata, 'stores_references');
    if (!referencesDescriptor) return undefined;
    if (!('value' in referencesDescriptor) || !referencesDescriptor.writable || !Array.isArray(referencesDescriptor.value)) {
      throw new TypeError(REVERSIBLE_METADATA_ERROR);
    }
    const reference = (referencesDescriptor.value as StoreReference[]).find((item) => item.store === this);
    if (!reference) return undefined;

    const objectDescriptor = Object.getOwnPropertyDescriptor(metadata, 'object');
    const creatorDescriptor = Object.getOwnPropertyDescriptor(metadata, 'creator');
    if (!objectDescriptor || !('value' in objectDescriptor) || !objectDescriptor.writable || !creatorDescriptor || !('value' in creatorDescriptor) || !creatorDescriptor.writable) {
      throw new TypeError(REVERSIBLE_METADATA_ERROR);
    }

    return {
      metadata,
      object: objectDescriptor.value as Backbone.Model | Backbone.Collection | null | undefined,
      creator: (creatorDescriptor.value || (observable as { constructor: StoredCreator }).constructor) as StoredCreator,
      reference,
    };
  }

  private _hasReversibleReference(observable: KBObject, expected: ReversibleMetadata): boolean {
    const ownerDescriptor = Object.getOwnPropertyDescriptor(observable, '__kb');
    if (!ownerDescriptor || !('value' in ownerDescriptor) || ownerDescriptor.value !== expected.metadata) return false;
    const referencesDescriptor = Object.getOwnPropertyDescriptor(expected.metadata, 'stores_references');
    return !!referencesDescriptor && 'value' in referencesDescriptor && Array.isArray(referencesDescriptor.value) && referencesDescriptor.value.includes(expected.reference);
  }

  private _matchesReversibleMetadata(observable: KBObject, expected: ReversibleMetadata): boolean {
    if (!this._hasReversibleReference(observable, expected)) return false;
    const ownerDescriptor = Object.getOwnPropertyDescriptor(observable, '__kb');
    const objectDescriptor = Object.getOwnPropertyDescriptor(expected.metadata, 'object');
    const creatorDescriptor = Object.getOwnPropertyDescriptor(expected.metadata, 'creator');
    const referencesDescriptor = Object.getOwnPropertyDescriptor(expected.metadata, 'stores_references');
    return (
      !!ownerDescriptor &&
      'value' in ownerDescriptor &&
      ownerDescriptor.writable === true &&
      !!objectDescriptor &&
      'value' in objectDescriptor &&
      objectDescriptor.writable === true &&
      objectDescriptor.value === expected.object &&
      !!creatorDescriptor &&
      'value' in creatorDescriptor &&
      creatorDescriptor.writable === true &&
      creatorDescriptor.value === expected.creator &&
      !!referencesDescriptor &&
      'value' in referencesDescriptor &&
      referencesDescriptor.writable === true
    );
  }

  // Get or create store references
  private _getOrCreateStoreReferences(observable: KBObject): StoreReference {
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
  private _clearStoreReferences(observable: KBObject): void {
    const obj = observable as { __kb?: { stores_references?: StoreReference[] } };
    if (obj.__kb?.stores_references) {
      const index = obj.__kb.stores_references.findIndex((ref) => ref.store === this);
      if (index >= 0) {
        obj.__kb.stores_references.splice(index, 1);
      }
    }
  }

  // Retire an observable (move to replaced list)
  private _retire(observable: KBObject): void {
    this._clearStoreReferences(observable);
    this.replaced_observables.push(observable);
    this._remove(observable);
  }

  // Add observable to store
  private _add(observable: KBObject, obj: unknown, creator?: StoredCreator | null): StoreRegistration {
    creator = creator || (observable as { constructor: StoredCreator }).constructor;
    wrappedObject(observable, obj as Backbone.Model | Backbone.Collection | null);
    wrappedCreator(observable, creator);

    const creatorId = this._creatorId(creator);
    this.observable_records[creatorId] = this.observable_records[creatorId] || {};
    const records = this.observable_records[creatorId];
    const cid = this._cid(obj);
    records[cid] = observable;
    return { creatorId, cid, records, observable };
  }

  // Remove observable from store
  private _remove(observable: KBObject): void {
    const creator = wrappedCreator(observable) || (observable as { constructor: StoredCreator }).constructor;
    const obj = wrappedObject(observable);

    const currentObservable = this.find(obj, creator);
    if (currentObservable === observable) {
      const creatorId = this._creatorId(creator);
      delete this.observable_records[creatorId][this._cid(obj)];
    }

    wrappedObject(observable, null);
    wrappedCreator(observable, undefined);
  }

  private _removeRecord(observable: KBObject, obj: unknown, creator: StoredCreator): StoreRegistration | undefined {
    const registration = this._findRegistration(obj, creator);
    if (registration.observable !== observable || !registration.records || registration.cid === undefined) return undefined;
    delete registration.records[registration.cid];
    registration.observable = undefined;
    return registration;
  }

  private _findRegistration(obj: unknown, creator: StoredCreator): StoreRegistration {
    const creatorId = this._creatorId(creator);
    const records = this.observable_records[creatorId];
    if (!records) return { creatorId };

    const cid = this._cid(obj);
    const observable = records[cid];
    if (observable) {
      const disposable = observable as { __kb_dispose?: number };
      if (disposable.__kb_dispose && disposable.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) {
        delete records[cid];
        return { creatorId, cid, records };
      }
    }
    return { creatorId, cid, records, observable };
  }

  private _matchesRegistration(registration: StoreRegistration, observable: KBObject | undefined): boolean {
    return !!registration.records && registration.cid !== undefined && this.observable_records[registration.creatorId] === registration.records && registration.records[registration.cid] === observable;
  }

  // Get creator for object
  private _creator(obj: unknown, options: InternalCreateOptions): StoredCreator | undefined {
    if (options.creator) return options.creator;

    const creator = inferCreator(obj, options.factory, options.path || '');
    if (creator) return creator;

    if (isModel(obj)) {
      return (globalThis as KnockbackGlobal).ViewModel;
    }

    return undefined;
  }
}

export default Store;
