import type * as Backbone from 'backbone';
import ko from 'knockout';
import _ from 'underscore';
import { KB_DISPOSE_STATE } from './constants.ts';
import { NotInitializedError, UnexpectedValueError } from './errors/index.ts';
import type { KnockbackGlobal, StoredCreator } from './internal-types.ts';
import { isCreatorConstructor, isCreatorObject } from './internal-types.ts';
import { getValue, isModel, peek } from './kb.ts';
import type { InternalCreateOptions, Observable, ObservableBase, StoreInternal, StoreRetainState, ValueType } from './types.ts';
import { TYPE_ARRAY, TYPE_COLLECTION, TYPE_MODEL, TYPE_SIMPLE, TYPE_UNKNOWN } from './types.ts';
import { inferCreator, resolveModel, valueType, wrappedCreator, wrappedObject } from './utils.ts';

function isMetadataOwner(value: unknown): value is object {
  return (typeof value === 'object' && value !== null) || typeof value === 'function';
}

function replacementError(error: unknown, cleanupErrors: unknown[]): unknown {
  if (!cleanupErrors.length) return error;
  return new AggregateError([error, ...cleanupErrors], 'TypedValue replacement and cleanup failed');
}

function cleanupError(errors: unknown[]): unknown {
  return errors.length === 1 ? errors[0] : new AggregateError(errors, 'TypedValue cleanup failed');
}

// Internal class for managing typed observable values
export class TypedValue {
  __kb_dispose?: number;
  __kb_value: unknown;
  value_type?: ValueType;
  create_options?: InternalCreateOptions;
  private _vo: ko.Observable<unknown>;
  private _isPreparing = false;
  private _isReleasing = false;
  private _disposePending = false;

  constructor(createOptions: InternalCreateOptions) {
    this.create_options = createOptions;
    this._vo = ko.observable(null);
  }

  dispose(): void {
    if (this.__kb_dispose && this.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) return;
    if (this._isPreparing || this._isReleasing) {
      this._disposePending = true;
      return;
    }
    this.__kb_dispose = KB_DISPOSE_STATE.DISPOSED;
    const previousValue = this.__kb_value;

    if (previousValue) {
      this.__kb_value = undefined;
      const store = this.create_options?.store as StoreInternal;
      if (store && wrappedCreator(previousValue)) {
        store.release(previousValue);
      } else {
        (previousValue as { dispose?: () => void }).dispose?.();
      }
    }

    this.create_options = undefined;
  }

  // Get the unwrapped value
  value(): unknown {
    return ko.utils.unwrapObservable(this._vo());
  }

  // Get the raw value (observable or view model)
  rawValue(): unknown {
    return this.__kb_value;
  }

  // Get the value type
  valueType(model: Backbone.Model | null, key: string): ValueType {
    const newValue = getValue(model, key);
    // Create so we can check the type
    if (!this.value_type) {
      this._updateValueObservable(newValue);
    }
    return this.value_type || TYPE_UNKNOWN;
  }

  // Update with a new value
  update(newValue?: unknown): void {
    if (this._isPreparing || this._isReleasing) throw new UnexpectedValueError('TypedValue', 'reentrant update');
    if (this.__kb_dispose && this.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) return;

    // Ensure null instead of undefined
    if (newValue === undefined) {
      newValue = null;
    }

    const newType = valueType(newValue);

    // Check if previous value was disposed
    const disposable = this.__kb_value as { __kb_dispose?: number } | undefined;
    if (disposable?.__kb_dispose && disposable.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) {
      this.__kb_value = undefined;
      this.value_type = undefined;
    }

    const value = this.__kb_value;

    switch (this.value_type) {
      case TYPE_COLLECTION: {
        // Update collection observable with array
        if (this.value_type === TYPE_COLLECTION && newType === TYPE_ARRAY) {
          (value as ko.ObservableArray)(newValue as unknown[]);
          return;
        }

        if (newType === TYPE_COLLECTION || _.isNull(newValue)) {
          // Use provided CollectionObservable
          if (newValue && (globalThis as KnockbackGlobal).CollectionObservable && newValue instanceof ((globalThis as KnockbackGlobal).CollectionObservable as NonNullable<KnockbackGlobal['CollectionObservable']>)) {
            this._updateValueObservable(wrappedObject(newValue as Observable), newValue);
          } else {
            const collectionFn = value as Observable & { collection?: ko.Computed<Backbone.Collection | null> };
            if (collectionFn.collection && peek(collectionFn.collection) !== newValue) {
              collectionFn.collection(newValue as Backbone.Collection);
            }
          }
          return;
        }
        break;
      }

      case TYPE_MODEL: {
        if (newType === TYPE_MODEL || _.isNull(newValue)) {
          // Use provided ViewModel
          if (newValue && !isModel(newValue)) {
            this._updateValueObservable(wrappedObject(newValue as Observable), newValue);
          } else {
            const resolvedModel = resolveModel(newValue);
            if (wrappedObject(value as Observable) !== resolvedModel) {
              this._updateValueObservable(newValue);
            }
          }
          return;
        }
        break;
      }
    }

    // Same type and defined
    if (this.value_type === newType && this.value_type !== undefined) {
      if (peek(value as ko.Observable) !== newValue) {
        (value as ko.Observable)(newValue);
      }
    } else if (peek(value as ko.Observable) !== newValue) {
      this._updateValueObservable(newValue);
    }
  }

  private _updateValueObservable(newValue: unknown, newObservable?: unknown): void {
    if (this._isPreparing || this._isReleasing) throw new UnexpectedValueError('TypedValue', 'reentrant update');
    if (!this.create_options) throw new NotInitializedError('TypedValue', 'create_options');
    const createOptions = this.create_options;
    const previousCreator = createOptions.creator;
    let creator: StoredCreator | null | undefined = inferCreator(newValue, createOptions.factory, createOptions.path || '');

    // Retain previous type
    if (newValue === null && !creator) {
      if (this.value_type === TYPE_MODEL) {
        creator = (globalThis as KnockbackGlobal).ViewModel;
      } else if (this.value_type === TYPE_COLLECTION) {
        creator = (globalThis as KnockbackGlobal).CollectionObservable;
      }
    }

    createOptions.creator = creator;

    let nextValueType: ValueType = TYPE_UNKNOWN;
    const previousValue = this.__kb_value;
    let value: unknown;
    const retention: StoreRetainState = { created: false, retained: false };
    let preparationFailed = false;
    let preparationError: unknown;
    let previousReleasedByCommit = false;
    this._isPreparing = true;

    try {
      if (newObservable) {
        value = newObservable;
        retention.value = value;
        const store = createOptions.store as StoreInternal;
        if (store) {
          store.retain(newObservable, newValue, creator, retention);
        }
      } else if (creator) {
        // Have the store, use it to create
        const store = createOptions.store as StoreInternal;
        if (store) {
          value = store.retainOrCreate(newValue, createOptions, true, retention);
        } else {
          // Create manually
          if (isCreatorObject(creator) && creator.modelsOnly) {
            value = newValue;
            nextValueType = TYPE_SIMPLE;
          } else if (isCreatorObject(creator)) {
            value = (creator as { create: (obj: unknown, options: InternalCreateOptions) => unknown }).create(newValue, createOptions);
            retention.created = true;
          } else if (isCreatorConstructor(creator)) {
            value = new (creator as new (obj: unknown, options: InternalCreateOptions) => unknown)(newValue, createOptions);
            retention.created = true;
          } else if (typeof creator === 'function') {
            value = (creator as (obj: unknown, options: InternalCreateOptions) => unknown)(newValue, createOptions);
            retention.created = true;
          } else {
            throw new TypeError('creator is not callable');
          }
          retention.value = value;
        }
      } else {
        // Create basic observable
        retention.created = true;
        if (Array.isArray(newValue)) {
          nextValueType = TYPE_ARRAY;
          value = ko.observableArray(newValue);
        } else {
          nextValueType = TYPE_SIMPLE;
          value = ko.observable(newValue);
        }
        retention.value = value;
      }

      // Determine the type
      if (nextValueType === TYPE_UNKNOWN) {
        if (!ko.isObservable(value)) {
          if (!isMetadataOwner(value)) throw new TypeError('TypedValue owner must be an object or function');
          // View model
          nextValueType = TYPE_MODEL;
          if (!retention.commit) wrappedObject(value, resolveModel(newValue) as Backbone.Model | null);
        } else if ((value as ObservableBase).__kb_is_co) {
          nextValueType = TYPE_COLLECTION;
          if (!retention.commit) wrappedObject(value, newValue as Backbone.Collection | null);
        } else {
          nextValueType = TYPE_SIMPLE;
        }
      }
      if (!this._disposePending && retention.commit) {
        previousReleasedByCommit = value === previousValue;
        retention.commit(previousReleasedByCommit);
      }
    } catch (error) {
      preparationFailed = true;
      preparationError = error;
      value = retention.value;
    }

    if (preparationFailed) {
      createOptions.creator = previousCreator;
      const errors: unknown[] = [];
      this._cleanupPrepared(value, previousValue, createOptions.store as StoreInternal, retention, errors, false);
      this._isPreparing = false;
      if (this._disposePending) {
        this._disposePending = false;
        try {
          this.dispose();
        } catch (error) {
          errors.push(error);
        }
      }
      throw replacementError(preparationError, errors);
    }

    if (this._disposePending) {
      const errors: unknown[] = [];
      this._cleanupPrepared(value, previousValue, createOptions.store as StoreInternal, retention, errors, false);
      this._isPreparing = false;
      this._disposePending = false;
      try {
        this.dispose();
      } catch (error) {
        errors.push(error);
      }
      if (errors.length) throw cleanupError(errors);
      return;
    }
    this._isPreparing = false;

    // Release previous
    let releaseFailed = false;
    let releaseError: unknown;
    if (previousValue && (previousValue !== value || retention.retained)) {
      this._isReleasing = true;
      try {
        if (!previousReleasedByCommit) {
          const store = createOptions.store as StoreInternal;
          if (store) {
            store.release(previousValue);
          } else {
            (previousValue as { dispose?: () => void }).dispose?.();
          }
        }
      } catch (error) {
        releaseFailed = true;
        releaseError = error;
      }
    }

    if (retention.cancelled) {
      this._isReleasing = false;
      this._disposePending = false;
      this._finishDisposalAfterRelease();
      if (releaseFailed) throw releaseError;
      return;
    }

    if (releaseFailed) {
      createOptions.creator = previousCreator;
      const errors: unknown[] = [];
      this._cleanupPrepared(value, previousValue, createOptions.store as StoreInternal, retention, errors, false);
      const disposePending = this._disposePending;
      this._isReleasing = false;
      this._disposePending = false;
      if (disposePending) this._finishDisposalAfterRelease();
      throw replacementError(releaseError, errors);
    }

    if (this._disposePending) {
      const errors: unknown[] = [];
      this._cleanupPrepared(value, previousValue, createOptions.store as StoreInternal, retention, errors, true);
      this._isReleasing = false;
      this._disposePending = false;
      this._finishDisposalAfterRelease();
      if (errors.length) throw cleanupError(errors);
      return;
    }
    this._isReleasing = false;

    // Store the value
    retention.publish?.();
    this.value_type = nextValueType;
    this.__kb_value = value;
    this._vo(value);
  }

  private _cleanupPrepared(value: unknown, previousValue: unknown, store: StoreInternal | undefined, retention: StoreRetainState, errors: unknown[], priorReleased: boolean): void {
    if (!isMetadataOwner(value)) return;

    try {
      if (store && retention.retained) {
        if (retention.rollback) {
          retention.rollback();
        } else if (priorReleased && value === previousValue) {
          retention.retained = false;
          store.release(value);
        }
      } else if (retention.created && value !== previousValue) {
        (value as { dispose?: () => void }).dispose?.();
      }
    } catch (error) {
      errors.push(error);
    }
  }

  private _finishDisposalAfterRelease(): void {
    this.__kb_dispose = KB_DISPOSE_STATE.DISPOSED;
    this.__kb_value = undefined;
    this.create_options = undefined;
  }
}

export default TypedValue;
