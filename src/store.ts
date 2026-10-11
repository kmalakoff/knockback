import ko from 'knockout';
import _ from 'underscore';
import { KB_DISPOSE_STATE } from './constants.ts';
import { UnexpectedValueError } from './errors/index.ts';
import type { KnockbackGlobal, StoredCreator } from './internal-types.ts';
import { isCreatorConstructor, isCreatorObject } from './internal-types.ts';
import { ignore, isModel, release, settings, wasReleased } from './kb.ts';
import type { InternalCreateOptions, InternalViewModelOptions, KBMetadata, ObservableBase, StoreInternal, StoreReference, StoreRetainState, ViewModelOptions } from './types.ts';
import type { KBObject } from './utils.ts';
import { createFromDefaultCreator, get, inferCreator, orSet, wrappedCreator, wrappedObject, wrappedStore, wrappedStoreIsOwned } from './utils.ts';

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

/** @internal */
export const REFERENCE_ROOT = Symbol('Knockback reference root');
/** @internal */
export const REFERENCE_ATTACHMENT = Symbol('Knockback reference attachment');
const REFERENCE_NULL_CID = Symbol('Knockback reference null CID');

/** @internal */
export interface ReferenceAttachment {
  store: Store;
  model: Backbone.Model | null;
  prepare?: boolean;
  commit?: () => void;
}

interface ReferenceOwnerMetadata extends KBMetadata {
  [REFERENCE_ROOT]?: boolean;
  [REFERENCE_ATTACHMENT]?: ReferenceAttachment;
  [REFERENCE_NULL_CID]?: string;
}

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
    if (this.__kb_dispose && this.__kb_dispose >= KB_DISPOSE_STATE.DISPOSED) return;
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
      if (!wasReleased(observable)) this.release(observable, true);
    }
  }

  // Compact by removing released observables
  compact(): void {
    for (const creatorId in this.observable_records) {
      const records = this.observable_records[creatorId];
      for (const cid in records) {
        if (wasReleased(records[cid])) delete records[cid];
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

    const destinationLookup = this._findRegistration(obj, creator, observable);
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
        const previousRegistration = this._findOwnerRegistration(previousMetadata.object, previousMetadata.creator, observable);
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
          if (reference.ref_count !== previousRefCount + 1 || !this._matchesReversibleMetadata(observable, previousMetadata) || this._findOwnerRegistration(previousMetadata.object, previousMetadata.creator, observable).observable !== observable || this._findRegistration(obj, creator, observable).observable) {
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
    const metadata = (observable as { __kb?: ReferenceOwnerMetadata }).__kb;
    const attachment = metadata?.[REFERENCE_ATTACHMENT];
    if (attachment) {
      if (attachment.store !== this || attachment.model !== obj) {
        throw new UnexpectedValueError('Store', 'Invalid reference-root attachment');
      }
      const commit = this._prepareReferenceOwner(observable, attachment.model, currentObj);
      if (attachment.prepare) attachment.commit = commit;
      else commit();
      return;
    }
    if (currentObj === obj) return;

    if (!this._canRegister(observable)) {
      throw new UnexpectedValueError('Store', 'Cannot reuse a simple observable');
    }

    if (this._refCount(observable) !== 1) {
      throw new UnexpectedValueError('Store', `Trying to change a shared view model. Ref count: ${this._refCount(observable)}`);
    }

    const creator = wrappedCreator(observable) || (observable as { constructor: StoredCreator }).constructor;
    const currentObservable = !_.isUndefined(currentObj) ? this._findOwnerRegistration(currentObj, creator, observable).observable : undefined;

    this.retain(observable, obj, creator);

    if (currentObservable) {
      this.release(currentObservable);
    }
  }

  private _prepareReferenceOwner(observable: KBObject, obj: Backbone.Model | null, currentObj: unknown): () => void {
    if (!this._canRegister(observable)) throw new UnexpectedValueError('Store', 'Cannot attach a simple observable');
    const retained = this._retainedMetadata(observable);
    if (!retained) throw new UnexpectedValueError('Store', 'Reference root has no retained metadata');
    const metadata = retained.metadata as ReferenceOwnerMetadata;
    const { objectDescriptor, creatorDescriptor } = this._writableIdentity(retained.metadata);
    const references = retained.references;
    const referenceSnapshot = references.map((reference) => ({ reference, count: reference.ref_count }));
    const leases = references.filter((reference) => reference.ref_count > 0).map((reference) => ({ reference, count: reference.ref_count, store: reference.store as Store }));
    const marker = Object.getOwnPropertyDescriptor(metadata, REFERENCE_ROOT);
    const nullIdentity = Object.getOwnPropertyDescriptor(metadata, REFERENCE_NULL_CID);
    if ((marker && (!('value' in marker) || !marker.writable)) || (nullIdentity && (!('value' in nullIdentity) || !nullIdentity.writable)) || ((!marker || (!obj && !nullIdentity)) && !Object.isExtensible(metadata))) throw new TypeError(REVERSIBLE_METADATA_ERROR);
    const cid = obj ? this._cid(obj) : metadata[REFERENCE_NULL_CID] || _.uniqueId('kb_reference_null_');
    const plans = leases.map(({ store }) => {
      const sources: StoreRegistration[] = [];
      const destinations = new Map<string, StoreRegistration>();
      for (const creatorId of Object.keys(store.observable_records)) {
        const records = store.observable_records[creatorId];
        for (const sourceCid of Object.keys(records)) {
          if (records[sourceCid] !== observable) continue;
          sources.push({ creatorId, cid: sourceCid, records, observable });
          destinations.set(creatorId, { creatorId, cid, records, observable: records[cid] });
        }
      }
      if (!sources.length) throw new UnexpectedValueError('Store', 'Reference-root registration changed before attachment');
      return { store, records: store.observable_records, sources, destinations: [...destinations.values()] };
    });
    if (!plans.length && !this.replaced_observables.includes(observable)) throw new UnexpectedValueError('Store', 'Reference root has no retained owner');
    const moves = !metadata[REFERENCE_ROOT] || currentObj !== obj || plans.some(({ sources }) => sources.some((source) => source.cid !== cid));
    if (!moves) return () => undefined;
    const check = (): void => {
      const current = this._retainedMetadata(observable);
      if (!current || current.metadata !== metadata || current.references !== references || references.length !== referenceSnapshot.length || referenceSnapshot.some(({ reference, count }, index) => references[index] !== reference || reference.ref_count !== count))
        throw new UnexpectedValueError('Store', 'Reference-root ownership changed before attachment');
      const identity = this._writableIdentity(current.metadata);
      if (identity.objectDescriptor.value !== objectDescriptor.value || identity.creatorDescriptor.value !== creatorDescriptor.value) throw new UnexpectedValueError('Store', 'Reference-root ownership changed before attachment');
      const matches = (key: symbol, expected: PropertyDescriptor | undefined): boolean => {
        const actual = Object.getOwnPropertyDescriptor(metadata, key);
        if (!actual || !expected) return actual === expected;
        return 'value' in actual && actual.value === expected.value && actual.writable === expected.writable && actual.enumerable === expected.enumerable && actual.configurable === expected.configurable;
      };
      if (!matches(REFERENCE_ROOT, marker) || !matches(REFERENCE_NULL_CID, nullIdentity) || ((!marker || (!obj && !nullIdentity)) && !Object.isExtensible(metadata))) throw new UnexpectedValueError('Store', 'Reference-root identity changed before attachment');
      for (const { store, records, sources, destinations } of plans) {
        if (store._reversibleMoves.has(observable) || store._committedMoves.has(observable)) throw new UnexpectedValueError('Store', 'Cannot reattach an owner during a reversible move');
        if (store.observable_records !== records || sources.some((source) => !store._matchesRegistration(source, observable)) || destinations.some((destination) => destination.records?.[cid] !== destination.observable)) throw new UnexpectedValueError('Store', 'Reference-root registration changed before attachment');
        for (const { observable: displaced } of destinations) {
          if (!displaced || displaced === observable) continue;
          if (store._reversibleMoves.has(displaced) || store._committedMoves.has(displaced)) throw new UnexpectedValueError('Store', 'Cannot replace an owner during a reversible move');
          store._reversibleMetadata(displaced);
        }
      }
      if (this._reversibleMoves.has(observable) || this._committedMoves.has(observable)) throw new UnexpectedValueError('Store', 'Cannot reattach an owner during a reversible move');
    };
    check();
    return () => {
      check();
      const retired = new Map<Store, Set<KBObject>>();
      for (const { store, destinations } of plans) {
        for (const destination of destinations) {
          const displaced = destination.observable;
          if (!displaced || displaced === observable || retired.get(store)?.has(displaced)) continue;
          store._retire(displaced);
          const owners = retired.get(store) || new Set<KBObject>();
          owners.add(displaced);
          retired.set(store, owners);
        }
      }
      metadata[REFERENCE_ROOT] = true;
      if (!obj) metadata[REFERENCE_NULL_CID] = cid;
      metadata.object = obj;
      for (const { store, sources, destinations } of plans) {
        for (const source of sources) if (source.cid !== cid) store._removeRecord(observable, currentObj, metadata.creator as StoredCreator, source);
        for (const destination of destinations) if (destination.records) destination.records[cid] = observable;
      }
    };
  }

  /**
   * Release an observable
   * @internal
   */
  release(observable: unknown, force?: boolean): void {
    if (!observable) return;
    if (!this._isMetadataOwner(observable)) {
      throw new TypeError('Store owner must be an object or function');
    }

    if (!this._canRegister(observable)) {
      release(observable);
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

    if (wasReleased(observable)) return;
    if (!force && this._refCount(observable) > 1) return;
    if (typeof observable !== 'function') {
      release(observable);
      return;
    }

    // Callable owners are a v2 Store extension that kb.release skips, so their lifecycle is dispatched here.
    const owner = observable as { destroy?: () => void; dispose?: () => void; release?: () => void };
    if (typeof owner.dispose === 'function') owner.dispose();
    else if (typeof owner.destroy === 'function') owner.destroy();
    else if (typeof owner.release === 'function') owner.release();
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
    if (wasReleased(observable)) {
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

  private _ownerCid(obj: unknown, owner?: KBObject): string {
    if (obj != null || !owner) return this._cid(obj);
    const metadata = (owner as { __kb?: ReferenceOwnerMetadata }).__kb;
    if (metadata?.[REFERENCE_ROOT]) {
      metadata[REFERENCE_NULL_CID] ??= _.uniqueId('kb_reference_null_');
      return metadata[REFERENCE_NULL_CID];
    }
    return this._cid(obj);
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

  private _retainedMetadata(observable: KBObject): { metadata: Record<string, unknown>; references: StoreReference[] } | undefined {
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
    return { metadata, references: referencesDescriptor.value as StoreReference[] };
  }

  private _writableIdentity(metadata: Record<string, unknown>): { objectDescriptor: PropertyDescriptor; creatorDescriptor: PropertyDescriptor } {
    const objectDescriptor = Object.getOwnPropertyDescriptor(metadata, 'object');
    const creatorDescriptor = Object.getOwnPropertyDescriptor(metadata, 'creator');
    if (!objectDescriptor || !('value' in objectDescriptor) || !objectDescriptor.writable || !creatorDescriptor || !('value' in creatorDescriptor) || !creatorDescriptor.writable) {
      throw new TypeError(REVERSIBLE_METADATA_ERROR);
    }
    return { objectDescriptor, creatorDescriptor };
  }

  private _reversibleMetadata(observable: KBObject): ReversibleMetadata | undefined {
    const retained = this._retainedMetadata(observable);
    if (!retained) return undefined;
    const reference = retained.references.find((item) => item.store === this);
    if (!reference) return undefined;
    const { objectDescriptor, creatorDescriptor } = this._writableIdentity(retained.metadata);

    return {
      metadata: retained.metadata,
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
    const cid = this._ownerCid(obj, observable);
    records[cid] = observable;
    return { creatorId, cid, records, observable };
  }

  // Remove observable from store
  private _remove(observable: KBObject): void {
    const creator = wrappedCreator(observable) || (observable as { constructor: StoredCreator }).constructor;
    const obj = wrappedObject(observable);

    const registration = this._findOwnerRegistration(obj, creator, observable);
    if (registration.observable === observable && registration.records && registration.cid !== undefined) {
      delete registration.records[registration.cid];
    }

    wrappedObject(observable, null);
    wrappedCreator(observable, undefined);
  }

  private _removeRecord(observable: KBObject, obj: unknown, creator: StoredCreator, captured?: StoreRegistration): StoreRegistration | undefined {
    const registration = captured || this._findOwnerRegistration(obj, creator, observable);
    if (!this._matchesRegistration(registration, observable) || !registration.records || registration.cid === undefined) return undefined;
    delete registration.records[registration.cid];
    registration.observable = undefined;
    return registration;
  }

  private _findOwnerRegistration(obj: unknown, creator: StoredCreator, owner: KBObject): StoreRegistration {
    const registration = this._findRegistration(obj, creator, owner);
    if (registration.observable === owner || obj != null) return registration;
    const ordinary = this._findRegistration(obj, creator);
    return ordinary.observable === owner ? ordinary : registration;
  }

  private _findRegistration(obj: unknown, creator: StoredCreator, owner?: KBObject): StoreRegistration {
    const creatorId = this._creatorId(creator);
    const records = this.observable_records[creatorId];
    if (!records) return { creatorId };

    const cid = this._ownerCid(obj, owner);
    const observable = records[cid];
    if (observable && wasReleased(observable)) {
      delete records[cid];
      return { creatorId, cid, records };
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
