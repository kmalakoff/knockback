import type * as Backbone from 'backbone';
import ko from 'knockout';
import _ from 'underscore';
import type { CreateOptions, Creator } from './internal-types.ts';
import kb from './kb.ts';
import type { InternalCreateOptions, Observable, ObservableBase, Store, ValueType } from './types.ts';
import { TYPE_ARRAY, TYPE_COLLECTION, TYPE_MODEL, TYPE_SIMPLE, TYPE_UNKNOWN } from './types.ts';
import utils from './utils.ts';

// Internal class for managing typed observable values
export class TypedValue {
  __kb_released = false;
  __kb_value: unknown;
  value_type?: ValueType;
  create_options: InternalCreateOptions;
  private _vo: ko.Observable<unknown>;

  constructor(createOptions: InternalCreateOptions) {
    this.create_options = createOptions;
    this._vo = ko.observable(null);
  }

  destroy(): void {
    this.__kb_released = true;
    const previousValue = this.__kb_value;

    if (previousValue) {
      this.__kb_value = undefined;
      const store = this.create_options.store as Store;
      if (store && utils.wrappedCreator(previousValue)) {
        store.release(previousValue);
      } else {
        kb.release(previousValue);
      }
    }

    this.create_options = undefined as unknown as InternalCreateOptions;
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
    const newValue = kb.getValue(model, key);
    // Create so we can check the type
    if (!this.value_type) {
      this._updateValueObservable(newValue);
    }
    return this.value_type || TYPE_UNKNOWN;
  }

  // Update with a new value
  update(newValue?: unknown): void {
    if (this.__kb_released) return;

    // Ensure null instead of undefined
    if (newValue === undefined) {
      newValue = null;
    }

    const newType = utils.valueType(newValue);

    // Check if previous value was released
    if ((this.__kb_value as { __kb_released?: boolean })?.__kb_released) {
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
          const CollectionObservable = (kb as { CollectionObservable?: { new (...args: unknown[]): unknown } }).CollectionObservable;
          if (newValue && CollectionObservable && newValue instanceof CollectionObservable) {
            this._updateValueObservable(utils.wrappedObject(newValue as Observable), newValue);
          } else {
            const collectionFn = value as Observable & { collection?: ko.Computed<Backbone.Collection | null> };
            if (collectionFn.collection && kb.peek(collectionFn.collection) !== newValue) {
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
          if (newValue && !kb.isModel(newValue)) {
            this._updateValueObservable(utils.wrappedObject(newValue as Observable), newValue);
          } else {
            const resolvedModel = utils.resolveModel(newValue);
            if (utils.wrappedObject(value as Observable) !== resolvedModel) {
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
      if (kb.peek(value as ko.Observable) !== newValue) {
        (value as ko.Observable)(newValue);
      }
    } else if (kb.peek(value as ko.Observable) !== newValue) {
      this._updateValueObservable(newValue);
    }
  }

  private _updateValueObservable(newValue: unknown, newObservable?: unknown): void {
    const createOptions = this.create_options;
    let creator = utils.inferCreator(newValue, createOptions.factory, createOptions.path || '');

    // Retain previous type
    if (newValue === null && !creator) {
      if (this.value_type === TYPE_MODEL) {
        creator = (kb as { ViewModel?: Creator }).ViewModel;
      } else if (this.value_type === TYPE_COLLECTION) {
        creator = (kb as { CollectionObservable?: Creator }).CollectionObservable;
      }
    }

    createOptions.creator = creator;

    let valueType: ValueType = TYPE_UNKNOWN;
    const previousValue = this.__kb_value;
    this.__kb_value = undefined;

    let value: unknown;

    if (newObservable) {
      value = newObservable;
      const store = createOptions.store as Store;
      if (store) {
        store.retain(newObservable, newValue, creator);
      }
    } else if (creator) {
      // Have the store, use it to create
      const store = createOptions.store as Store;
      if (store) {
        value = store.retainOrCreate(newValue, createOptions, true);
      } else {
        // Create manually
        const creatorWithModels = creator as { models_only?: boolean; create?: (o: unknown, opts: CreateOptions) => unknown };
        if (creatorWithModels.models_only) {
          value = newValue;
          valueType = TYPE_SIMPLE;
        } else if (creatorWithModels.create) {
          value = creatorWithModels.create(newValue, createOptions);
        } else {
          value = new (creator as new (o: unknown, opts: CreateOptions) => unknown)(newValue, createOptions);
        }
      }
    } else {
      // Create basic observable
      if (Array.isArray(newValue)) {
        valueType = TYPE_ARRAY;
        value = ko.observableArray(newValue);
      } else {
        valueType = TYPE_SIMPLE;
        value = ko.observable(newValue);
      }
    }

    // Determine the type
    this.value_type = valueType;
    if (valueType === TYPE_UNKNOWN) {
      if (!ko.isObservable(value)) {
        // View model
        this.value_type = TYPE_MODEL;
        utils.wrappedObject(value, utils.resolveModel(newValue) as Backbone.Model | null);
      } else if ((value as ObservableBase).__kb_is_co) {
        this.value_type = TYPE_COLLECTION;
        utils.wrappedObject(value, newValue as Backbone.Collection | null);
      } else if (!this.value_type) {
        this.value_type = TYPE_SIMPLE;
      }
    }

    // Release previous
    if (previousValue) {
      const store = this.create_options?.store as Store;
      if (store) {
        store.release(previousValue);
      } else {
        kb.release(previousValue);
      }
    }

    // Store the value
    this.__kb_value = value;
    this._vo(value);
  }
}

export default TypedValue;
