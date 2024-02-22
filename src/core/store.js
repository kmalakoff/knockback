/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let kb;
const { _, ko } = (kb = require('./kb'));

// Used to share and manage the persistence of ViewModels and observables. ks.Store can be used to break relationship cycles between models, to reduce memory usage, and to share view models between kb.CollectionObservables (for example, when using Knockout.js selectedOptions).
//
// @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
//   var co = kb.collectionObservable(new Backbone.Collection());
//   var co_selected_options = kb.collectionObservable(new Backbone.Collection(), {
//     store: kb.utils.wrappedStore(co)
//   });
module.exports = (function () {
  const Cls = (kb.Store = class Store {
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
      if (!options.store) {
        kb.utils.wrappedStoreIsOwned(observable, true);
      }
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
      let index;
      this.__kb_released = true;
      this.clear();
      if ((index = _.indexOf(kb.Store.instances, this)) >= 0) {
        return kb.Store.instances.splice(index, 1);
      }
    }

    // Manually clear the store
    clear() {
      let observable;
      let observable_records;
      let replaced_observables;
      [observable_records, this.observable_records] = Array.from([this.observable_records, {}]);
      for (var creator_id in observable_records) {
        var records = observable_records[creator_id];
        for (var cid in records) {
          observable = records[cid];
          this.release(observable, true);
        }
      }

      [replaced_observables, this.replaced_observables] = Array.from([this.replaced_observables, []]);
      for (observable of Array.from(replaced_observables)) {
        if (!observable.__kb_released) {
          this.release(observable, true);
        }
      }
    }

    // Manually compact the store by searching for released view models
    compact() {
      for (var creator_id in this.observable_records) {
        var records = this.observable_records[creator_id];
        for (var cid in records) {
          var observable = records[cid];
          if (observable.__kb_released) {
            delete records[cid];
          }
        }
      }
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
      let current_observable;
      if (!this._canRegister(observable)) {
        return;
      }
      if (!creator) {
        creator = observable.constructor;
      } // default is to use the constructor

      if ((current_observable = this.find(obj, creator))) {
        if (current_observable === observable) {
          this._getOrCreateStoreReferences(observable).ref_count++;
          return observable;
        } // already in this store
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
      let creator;
      let observable;
      if (!(creator = this._creator(obj, options))) {
        return kb.utils.createFromDefaultCreator(obj, options);
      }
      if (creator.models_only) {
        return obj;
      }
      if ((observable = this.find(obj, creator))) {
        return deep_retain && kb.settings.deep_retain ? this.retain(observable, obj, creator) : observable;
      }

      if (!_.isFunction(creator.create || creator)) {
        throw new Error(`Invalid factory for \"${options.path}\"`);
      }

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
      let current_obj;
      let current_observable;
      if ((current_obj = kb.utils.wrappedObject(observable)) === obj) {
        return;
      }
      if (!this._canRegister(observable)) {
        throw new Error('Cannot reuse a simple observable');
      }
      if (this._refCount(observable) !== 1) {
        throw new Error(`Trying to change a shared view model. Ref count: ${this._refCount(observable)}`);
      }

      const creator = kb.utils.wrappedCreator(observable) || observable.constructor; // default is to use the constructor
      if (!_.isUndefined(current_obj)) {
        current_observable = this.find(current_obj, creator);
      }
      this.retain(observable, obj, creator);
      if (current_observable) {
        this.release(current_observable);
      }
    }

    // Release a reference to a a ViewModel in this store.
    release(observable, force) {
      let store_references;
      if (!this._canRegister(observable)) {
        return kb.release(observable);
      } // just release

      // maybe be externally added
      if ((store_references = this._storeReferences(observable))) {
        if (!force && --store_references.ref_count > 0) {
          return;
        } // do not release yet
        this._clearStoreReferences(observable);
      }

      this._remove(observable);
      if (observable.__kb_released) {
        return;
      }
      if (force || this._refCount(observable) <= 1) {
        return kb.release(observable);
      } // allow for a single initial reference in another store
    }

    // @nodoc
    find(obj, creator) {
      let observable;
      let records;
      if (!(records = this.observable_records[this._creatorId(creator)])) {
        return null;
      }
      if (__guard__((observable = records[this._cid(obj)]), (x) => x.__kb_released)) {
        delete records[this._cid(obj)];
        return null;
      }
      return observable;
    }

    // @nodoc
    _refCount(observable) {
      let stores_references;
      if (observable.__kb_released) {
        if (typeof console !== 'undefined' && console !== null) {
          console.log('Observable already released');
        }
        return 0;
      }
      if (!(stores_references = kb.utils.get(observable, 'stores_references'))) {
        return 1;
      }
      return _.reduce(stores_references, (memo, store_references) => memo + store_references.ref_count, 0);
    }

    // @nodoc
    _canRegister(observable) {
      return observable && !ko.isObservable(observable) && !observable.__kb_is_co;
    } // only register view models not basic ko.observables nor kb.CollectionObservables

    // @nodoc
    _cid(obj) {
      let cid;
      return (cid = obj ? obj.cid || (obj.cid = _.uniqueId('c')) : 'null');
    }

    // @nodoc
    _creatorId(creator) {
      let item;
      const create = creator.create || creator;
      if (!create.__kb_cids) {
        create.__kb_cids = [];
      }
      for (item of Array.from(create.__kb_cids)) {
        if (item.create === create) {
          return item.cid;
        }
      }
      create.__kb_cids.push((item = { create, cid: _.uniqueId('kb') }));
      return item.cid;
    }

    // @nodoc
    _storeReferences(observable) {
      let stores_references;
      if (!(stores_references = kb.utils.get(observable, 'stores_references'))) {
        return;
      }
      return _.find(stores_references, (store_references) => store_references.store === this);
    }

    // @nodoc
    _getOrCreateStoreReferences(observable) {
      let store_references;
      const stores_references = kb.utils.orSet(observable, 'stores_references', []);
      if (!(store_references = _.find(stores_references, (store_references) => store_references.store === this))) {
        stores_references.push((store_references = { store: this, ref_count: 0, release: () => this.release(observable) }));
      }
      return store_references;
    }

    // @nodoc
    _clearStoreReferences(observable) {
      let stores_references;
      if ((stores_references = kb.utils.get(observable, 'stores_references'))) {
        for (var index in observable.__kb.stores_references) {
          var store_references = observable.__kb.stores_references[index];
          if (store_references.store === this) {
            observable.__kb.stores_references.splice(index, 1);
            break;
          }
        }
      }
    }

    // @nodoc
    _retire(observable) {
      this._clearStoreReferences(observable);
      this.replaced_observables.push(observable);
      return this._remove(observable);
    }

    // @nodoc
    _add(observable, obj, creator) {
      let name;
      if (!creator) {
        creator = observable.constructor;
      } // default is to use the constructor
      kb.utils.wrappedObject(observable, obj);
      kb.utils.wrappedCreator(observable, creator);
      return ((this.observable_records[(name = this._creatorId(creator))] || (this.observable_records[name] = {}))[this._cid(obj)] = observable);
    }

    // @nodoc
    _remove(observable) {
      let current_observable;
      let obj;
      const creator = kb.utils.wrappedCreator(observable) || observable.constructor; // default is to use the constructor
      if ((current_observable = this.find((obj = kb.utils.wrappedObject(observable)), creator))) {
        // already released
        if (current_observable === observable) {
          delete this.observable_records[this._creatorId(creator)][this._cid(obj)];
        } // not already replaced
      }
      kb.utils.wrappedObject(observable, null);
      return kb.utils.wrappedCreator(observable, null);
    }

    // @nodoc
    _creator(obj, options) {
      let creator;
      if (options.creator) {
        return options.creator;
      }
      if ((creator = kb.utils.inferCreator(obj, options.factory, options.path))) {
        return creator;
      }
      if (kb.isModel(obj)) {
        return kb.ViewModel;
      }
    }
  });
  Cls.initClass();
  return Cls;
})();

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}
