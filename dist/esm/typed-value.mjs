/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */ let kb;
let TypedValue;
const { _, ko } = kb = require('./kb');
// @nodoc
module.exports = TypedValue = class TypedValue {
    destroy() {
        let previous_value;
        this.__kb_released = true;
        if (previous_value = this.__kb_value) {
            this.__kb_value = null;
            if (this.create_options.store && kb.utils.wrappedCreator(previous_value)) {
                this.create_options.store.release(previous_value);
            } else {
                kb.release(previous_value);
            }
        }
        return this.create_options = null;
    }
    value() {
        return ko.utils.unwrapObservable(this._vo());
    }
    rawValue() {
        return this.__kb_value;
    }
    valueType(model, key) {
        const new_value = kb.getValue(model, key);
        this.value_type || this._updateValueObservable(new_value); // create so we can check the type
        return this.value_type;
    }
    update(new_value) {
        if (this.__kb_released) {
            return;
        } // destroyed, nothing to do
        // determine the new type
        new_value !== undefined || (new_value = null); // ensure null instead of undefined
        const new_type = kb.utils.valueType(new_value);
        if (this.__kb_value != null ? this.__kb_value.__kb_released : undefined) {
            this.__kb_value = this.value_type = undefined;
        }
        const value = this.__kb_value;
        switch(this.value_type){
            case kb.TYPE_COLLECTION:
                if (this.value_type === kb.TYPE_COLLECTION && new_type === kb.TYPE_ARRAY) {
                    return value(new_value);
                }
                if (new_type === kb.TYPE_COLLECTION || _.isNull(new_value)) {
                    // use the provided CollectionObservable
                    if (new_value && new_value instanceof kb.CollectionObservable) {
                        this._updateValueObservable(kb.utils.wrappedObject(new_value), new_value);
                    } else {
                        if (kb.peek(value.collection) !== new_value) {
                            value.collection(new_value);
                        } // collection observables are allocated once
                    }
                    return;
                }
                break;
            case kb.TYPE_MODEL:
                if (new_type === kb.TYPE_MODEL || _.isNull(new_value)) {
                    // use the provided ViewModel
                    if (new_value && !kb.isModel(new_value)) {
                        this._updateValueObservable(kb.utils.wrappedObject(new_value), new_value);
                    } else {
                        if (kb.utils.wrappedObject(value) !== kb.utils.resolveModel(new_value)) {
                            this._updateValueObservable(new_value);
                        }
                    }
                    return;
                }
                break;
        }
        if (this.value_type === new_type && !_.isUndefined(this.value_type)) {
            if (kb.peek(value) !== new_value) {
                return value(new_value);
            }
        } else {
            if (kb.peek(value) !== new_value) {
                return this._updateValueObservable(new_value);
            }
        }
    }
    _updateValueObservable(new_value, new_observable) {
        let previous_value;
        let value;
        const { create_options } = this;
        let creator = kb.utils.inferCreator(new_value, create_options.factory, create_options.path);
        // retain previous type
        if (new_value === null && !creator) {
            if (this.value_type === kb.TYPE_MODEL) {
                creator = kb.ViewModel;
            } else if (this.value_type === kb.TYPE_COLLECTION) {
                creator = kb.CollectionObservable;
            }
        }
        create_options.creator = creator;
        let value_type = kb.TYPE_UNKNOWN;
        [previous_value, this.__kb_value] = Array.from([
            this.__kb_value,
            undefined
        ]);
        if (new_observable) {
            value = new_observable;
            if (create_options.store) {
                create_options.store.retain(new_observable, new_value, creator);
            }
        // found a creator
        } else if (creator) {
            // have the store, use it to create
            if (create_options.store) {
                value = create_options.store.retainOrCreate(new_value, create_options, true);
            // create manually
            } else {
                if (creator.models_only) {
                    value = new_value;
                    value_type = kb.TYPE_SIMPLE;
                } else if (creator.create) {
                    value = creator.create(new_value, create_options);
                } else {
                    value = new creator(new_value, create_options);
                }
            }
        // create and cache the type
        } else {
            if (_.isArray(new_value)) {
                value_type = kb.TYPE_ARRAY;
                value = ko.observableArray(new_value);
            } else {
                value_type = kb.TYPE_SIMPLE;
                value = ko.observable(new_value);
            }
        }
        // determine the type
        if ((this.value_type = value_type) === kb.TYPE_UNKNOWN) {
            if (!ko.isObservable(value)) {
                // a view model, recognize view_models as non-observable
                this.value_type = kb.TYPE_MODEL;
                kb.utils.wrappedObject(value, kb.utils.resolveModel(new_value));
            } else if (value.__kb_is_co) {
                this.value_type = kb.TYPE_COLLECTION;
                kb.utils.wrappedObject(value, new_value);
            } else if (!this.value_type) {
                this.value_type = kb.TYPE_SIMPLE;
            }
        }
        // release previous
        if (previous_value) {
            if (this.create_options.store) {
                this.create_options.store.release(previous_value);
            } else {
                kb.release(previous_value);
            }
        }
        // store the value
        this.__kb_value = value;
        return this._vo(value);
    }
    _inferType(_value) {}
    constructor(create_options){
        this.create_options = create_options;
        this._vo = ko.observable(null); // create a value observable for the first dependency
    }
};
