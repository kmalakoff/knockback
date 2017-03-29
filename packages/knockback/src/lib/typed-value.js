/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

import _ from 'underscore';
import ko from 'knockout';

import kb from '..';

// @nodoc
export default class TypedValue {
  constructor(create_options) {
    this.create_options = create_options;
    this._vo = ko.observable(null); // create a value observable for the first dependency
  }

  destroy() {
    this.__kb_released = true;
    const previous_value = this.__kb_value;
    if (previous_value) {
      this.__kb_value = null;
      if (this.create_options.store && kb.utils.wrappedCreator(previous_value)) {
        this.create_options.store.release(previous_value);
      } else kb.release(previous_value);
    }
    this.create_options = null;
  }

  value() { return ko.utils.unwrapObservable(this._vo()); }
  rawValue() { return this.__kb_value; }

  valueType(model, key) {
    const new_value = kb.getValue(model, key);
    this.value_type || this._updateValueObservable(new_value); // create so we can check the type
    return this.value_type;
  }

  update(new_value) {
    if (this.__kb_released) return undefined; // destroyed, nothing to do

    // determine the new type
    (new_value !== undefined) || (new_value = null); // ensure null instead of undefined
    const new_type = kb.utils.valueType(new_value);

    if (this.__kb_value && this.__kb_value.__kb_released) { this.__kb_value = undefined; this.value_type = undefined; }
    const value = this.__kb_value;

    switch (this.value_type) {
      case kb.TYPE_COLLECTION:
        if ((this.value_type === kb.TYPE_COLLECTION) && (new_type === kb.TYPE_ARRAY)) return value(new_value);
        if ((new_type === kb.TYPE_COLLECTION) || _.isNull(new_value)) {
          // use the provided CollectionObservable
          if (new_value && new_value instanceof kb.CollectionObservable) this._updateValueObservable(kb.utils.wrappedObject(new_value), new_value);
          else if (kb.peek(value.collection) !== new_value) value.collection(new_value); // collection observables are allocated once
          return undefined;
        }
        break;

      case kb.TYPE_MODEL:
        if ((new_type === kb.TYPE_MODEL) || _.isNull(new_value)) {
          // use the provided ViewModel
          if (new_value && !kb.isModel(new_value)) this._updateValueObservable(kb.utils.wrappedObject(new_value), new_value);
          else if (kb.utils.wrappedObject(value) !== kb.utils.resolveModel(new_value)) this._updateValueObservable(new_value);
          return undefined;
        }
        break;
      default: break;
    }

    if ((this.value_type === new_type) && !_.isUndefined(this.value_type)) {
      if (kb.peek(value) !== new_value) return value(new_value);
    } else if (kb.peek(value) !== new_value) return this._updateValueObservable(new_value);
    return undefined;
  }

  _updateValueObservable(new_value, new_observable) {
    const { create_options } = this;
    let creator = kb.utils.inferCreator(new_value, create_options.factory, create_options.path);

    // retain previous type
    if ((new_value === null) && !creator) {
      if (this.value_type === kb.TYPE_MODEL) creator = kb.ViewModel;
      else if (this.value_type === kb.TYPE_COLLECTION) creator = kb.CollectionObservable;
    }
    create_options.creator = creator;

    let value_type = kb.TYPE_UNKNOWN;
    const previous_value = this.__kb_value;
    this.__kb_value = undefined;

    let value;
    if (new_observable) {
      value = new_observable;
      if (create_options.store) create_options.store.retain(new_observable, new_value, creator);

    // found a creator
    } else if (creator) {
      // have the store, use it to create
      if (create_options.store) value = create_options.store.retainOrCreate(new_value, create_options, true);

      // create manually
      else if (creator.models_only) { value = new_value; value_type = kb.TYPE_SIMPLE; } else if (creator.create) value = creator.create(new_value, create_options);
      else value = new creator(new_value, create_options);

    // create and cache the type
    } else if (_.isArray(new_value)) {
      value_type = kb.TYPE_ARRAY; value = ko.observableArray(new_value);
    } else { value_type = kb.TYPE_SIMPLE; value = ko.observable(new_value); }

    // determine the type
    this.value_type = value_type;
    if (value_type === kb.TYPE_UNKNOWN) {
      // a view model, recognize view_models as non-observable
      if (!ko.isObservable(value)) {
        this.value_type = kb.TYPE_MODEL; kb.utils.wrappedObject(value, kb.utils.resolveModel(new_value));
      } else if (value.__kb_is_co) {
        this.value_type = kb.TYPE_COLLECTION; kb.utils.wrappedObject(value, new_value);
      } else if (!this.value_type) this.value_type = kb.TYPE_SIMPLE;
    }

    // release previous
    if (previous_value) {
      this.create_options.store ? this.create_options.store.release(previous_value) : kb.release(previous_value);
    }

    // store the value
    this.__kb_value = value;
    return this._vo(value);
  }
}
