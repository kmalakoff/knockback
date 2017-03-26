/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

const kb = require('./kb');

const { _, ko } = kb;

// Used to share and manage the persistence of ViewModels and observables. ks.Store can be used to break relationship cycles between models,
// to reduce memory usage, and to share view models between kb.CollectionObservables (for example, when using Knockout.js selectedOptions).
//
// @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
//   var co = kb.collectionObservable(new Backbone.Collection());
//   var co_selected_options = kb.collectionObservable(new Backbone.Collection(), {
//     store: kb.utils.wrappedStore(co)
//   });
class Store {
  static initClass() {
    // @nodoc
    Store.instances = [];
  }

  // Used to either register yourself with the existing store or to create a new store.
  //
  // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
  // @param [Instance] obj the instance that will own or register with the store
  // @param [ko.observable] observable the observable that will own the store
  // @example
  //   kb.Store.useOptionsOrCreate(model, this, options);
  static useOptionsOrCreate(options, obj, observable) {
    if (!options.store) { kb.utils.wrappedStoreIsOwned(observable, true); }
    const store = kb.utils.wrappedStore(observable, options.store || new kb.Store());
    store.retain(observable, obj, options.creator);
    return store;
  }

  // Used to create a new kb.Store.
  constructor() {
    this.observable_records = {};
    this.replaced_observables = [];
    kb.Store.instances.push(this);
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy() {
    this.__kb_released = true;
    this.clear();
    const index = _.indexOf(kb.Store.instances, this);
    if (~index) kb.Store.instances.splice(index, 1);
  }

  // Manually clear the store
  clear() {
    const observable_records = this.observable_records;
    this.observable_records = {};
    _.each(observable_records, (records) => {
      _.each(records, observable => this.release(observable, true));
    });

    const replaced_observables = this.replaced_observables;
    this.replaced_observables = [];
    _.each(replaced_observables, (observable) => {
      if (!observable.__kb_released) this.release(observable, true);
    });
  }

  // Manually compact the store by searching for released view models
  compact() {
    _.each(this.observable_records, (records) => {
      _.each(records, (observable, cid) => {
        if (observable.__kb_released) delete records[cid];
      });
    });
  }

  // Used to register a new view model with the store.
  //
  // @param [Model] obj the Model
  // @param [ko.observable] observable the observable to share for the Model
  // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
  // @option options [Constructor|Function] creator the constructor or function used to create the observable. It is used to match observables in the store.
  // @option options [String] path the path to the value (used to create related observables from the factory).
  // @option options [kb.Store] store a store used to cache and share view models.
  // @option options [kb.Factory] factory a factory used to create view models.
  //
  // @example retain an observable with the store
  //   store.retain(observable, obj, creator);
  retain(observable, obj, creator) {
    if (!this._canRegister(observable)) return undefined;
    if (!creator) { creator = observable.constructor; } // default is to use the constructor

    const current_observable = this.find(obj, creator);
    if (current_observable) {
      if (current_observable === observable) { // already in this store
        this._getOrCreateStoreReferences(observable).ref_count++;
        return observable;
      }
      this._retire(current_observable);
    }

    this._add(observable, obj, creator);
    this._getOrCreateStoreReferences(observable).ref_count++;
    return observable;
  }

  // Used to find an existing observable in the store or create a new one if it doesn't exist.
  //
  // @param [Model|Collection|Data] obj the object to create the observable for. Only Models are cached in the store.
  // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
  // @param [boolean] deep_retain setting to true retains an existing observable when found.
  // @option options [Constructor|Function] creator the constructor or function used to create the observable. It is used to match observables in the store.
  // @option options [String] path the path to the value (used to create related observables from the factory).
  // @option options [kb.Store] store a store used to cache and share view models.
  // @option options [kb.Factory] factory a factory used to create view models.
  //
  // @example register an observable with the store
  //   observable = store.retainOrCreate(value, {path: kb.utils.wrappedPath(observable), factory: kb.utils.wrappedFactory(observable)})
  retainOrCreate(obj, options, deep_retain) {
    const creator = this._creator(obj, options);
    if (!creator) return kb.utils.createFromDefaultCreator(obj, options);
    if (creator.models_only) return obj;

    let observable = this.find(obj, creator);
    if (observable) {
      return (deep_retain && kb.settings.deep_retain ? this.retain(observable, obj, creator) : observable);
    }
    if (!_.isFunction(creator.create || creator)) throw new Error(`Invalid factory for "${options.path}"`);

    observable = kb.ignore(() => {
      options = _.defaults({ store: this, creator }, options); // set our own creator so we can register ourselves above
      observable = creator.create ? creator.create(obj, options) : new creator(obj, options);
      return observable || ko.observable(null);
    }); // default to null

    this.retain(observable, obj, creator);
    return observable;
  }

  // @nodoc
  reuse(observable, obj) {
    const current_obj = kb.utils.wrappedObject(observable);
    if (current_obj === obj) return;
    if (!this._canRegister(observable)) throw new Error('Cannot reuse a simple observable');
    if (this._refCount(observable) !== 1) throw new Error(`Trying to change a shared view model. Ref count: ${this._refCount(observable)}`);

    const creator = kb.utils.wrappedCreator(observable) || observable.constructor; // default is to use the constructor
    let current_observable;
    if (!_.isUndefined(current_obj)) current_observable = this.find(current_obj, creator);
    this.retain(observable, obj, creator);
    if (current_observable) this.release(current_observable);
  }

  // Release a reference to a a ViewModel in this store.
  release(observable, force) {
    if (!this._canRegister(observable)) return kb.release(observable); // just release

    // maybe be externally added
    const store_references = this._storeReferences(observable);
    if (store_references) {
      if (!force && (--store_references.ref_count > 0)) return undefined; // do not release yet
      this._clearStoreReferences(observable);
    }

    this._remove(observable);
    if (observable.__kb_released) return undefined;
    if (force || (this._refCount(observable) <= 1)) return kb.release(observable); // allow for a single initial reference in another store
    return undefined;
  }

  // @nodoc
  find(obj, creator) {
    const records = this.observable_records[this._creatorId(creator)];
    if (!records) return null;

    const observable = records[this._cid(obj)];
    if (observable && observable.__kb_released) {
      delete records[this._cid(obj)];
      return null;
    }
    return observable;
  }

  // @nodoc
  _refCount(observable) {
    if (observable.__kb_released) {
      (typeof console === 'undefined') || console.log('Observable already released');
      return 0;
    }
    const stores_references = kb.utils.get(observable, 'stores_references');
    if (!stores_references) return 1;
    return _.reduce(stores_references, ((memo, store_references) => memo + store_references.ref_count), 0);
  }

  // @nodoc
  _canRegister(observable) { return observable && !ko.isObservable(observable) && !observable.__kb_is_co; } // only register view models not basic ko.observables nor kb.CollectionObservables

  // @nodoc
  _cid(obj) {
    if (!obj) return 'null';
    if (!obj.cid) obj.cid = _.uniqueId('c');
    return obj.cid;
  }

  // @nodoc
  _creatorId(creator) {
    const create = creator.create || creator;
    if (!create.__kb_cids) { create.__kb_cids = []; }
    for (let i = 0, l = create.__kb_cids.length; i < l; i++) {
      const item = create.__kb_cids[i];
      if (item.create === create) return item.cid;
    }
    const item = { create, cid: _.uniqueId('kb') };
    create.__kb_cids.push(item);
    return item.cid;
  }

  // @nodoc
  _storeReferences(observable) {
    const stores_references = kb.utils.get(observable, 'stores_references');
    if (!stores_references) return undefined;

    return _.find(stores_references, ref => ref.store === this);
  }

  // @nodoc
  _getOrCreateStoreReferences(observable) {
    const stores_references = kb.utils.orSet(observable, 'stores_references', []);

    let ref = _.find(stores_references, x => x.store === this);
    if (!ref) stores_references.push(ref = { store: this, ref_count: 0, release: () => this.release(observable) });
    return ref;
  }

  // @nodoc
  _clearStoreReferences(observable) {
    const stores_references = kb.utils.orSet(observable, 'stores_references', []);
    if (!stores_references) return;

    for (let i = 0, l = observable.__kb.stores_references.length; i < l; i++) {
      const ref = observable.__kb.stores_references[i];
      if (ref.store === this) {
        observable.__kb.stores_references.splice(i, 1);
        break;
      }
    }
  }

  // @nodoc
  _retire(observable) { this._clearStoreReferences(observable); this.replaced_observables.push(observable); return this._remove(observable); }

  // @nodoc
  _add(observable, obj, creator) {
    if (!creator) creator = observable.constructor; // default is to use the constructor
    kb.utils.wrappedObject(observable, obj); kb.utils.wrappedCreator(observable, creator);

    const name = this._creatorId(creator);
    if (!this.observable_records[name]) this.observable_records[name] = {};
    this.observable_records[name][this._cid(obj)] = observable;
    return observable;
  }

  // @nodoc
  _remove(observable) {
    const creator = kb.utils.wrappedCreator(observable) || observable.constructor; // default is to use the constructor
    const obj = kb.utils.wrappedObject(observable);
    const current_observable = this.find(obj, creator);

    // already released
    if (current_observable && (current_observable === observable)) {
      delete this.observable_records[this._creatorId(creator)][this._cid(obj)]; // not already replaced
    }
    kb.utils.wrappedObject(observable, null);
    return kb.utils.wrappedCreator(observable, null);
  }

  // @nodoc
  _creator(obj, options) {
    if (options.creator) return options.creator;
    const creator = kb.utils.inferCreator(obj, options.factory, options.path);
    if (creator) return creator;
    if (kb.isModel(obj)) return kb.ViewModel;
    return undefined;
  }
}
Store.initClass();
module.exports = Store;
