/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
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
const TypedValue = require('./typed-value');

const KEYS_PUBLISH = ['value', 'valueType', 'destroy'];
const KEYS_INFO = ['args', 'read', 'write'];

// Base class for observing model attributes.
//
// @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
//   var ContactViewModel = function(model) {
//     this.name = kb.observable(model, 'name');
//     this.number = kb.observable(model, { key: 'number'});
//   };
//   var model = new Contact({ name: 'Ringo', number: '555-555-5556' });
//   var view_model = new ContactViewModel(model);
//
// @example How to create a kb.Observable with a default value.
//   var model = Backbone.Model({name: 'Bob'});
//   var name = kb.observable(model, {key:'name', default: '(none)'}); // name is Bob
//   name.setToDefault(); // name is (none)
//
// @method #model()
//   Dual-purpose getter/setter ko.computed for the observed model.
//   @return [Model|ModelRef|void] getter: the model whose attributes are being observed (can be null) OR setter: void
//   @example
//     var observable = kb.observable(new Backbone.Model({name: 'bob'}), 'name');
//     var the_model = observable.model(); // get
//     observable.model(new Backbone.Model({name: 'fred'})); // set
//
kb.Observable = class Observable {
  // Used to create a new kb.Observable.
  //
  // @param [Model] model the model to observe (can be null)
  // @param [String|Array|Object] options the create options. String is a single attribute name, Array is an array of attribute names.
  // @option options [String] key the name of the attribute.
  // @option options [Function] read a function used to provide transform the attribute value before passing it to the caller. Signature: read()
  // @option options [Function] write a function used to provide transform the value before passing it to the model set function. Signature: write(value)
  // @option options [Array] args arguments to pass to the read and write functions (they can be ko.observables). Can be useful for passing arguments to a locale manager.
  // @option options [Constructor] localizer a concrete kb.LocalizedObservable constructor for localization.
  // @option options [Data|ko.observable] default the default value. Can be a value, string or ko.observable.
  // @option options [String] path the path to the value (used to create related observables from the factory).
  // @option options [kb.Store] store a store used to cache and share view models.
  // @option options [kb.Factory] factory a factory used to create view models.
  // @option options [Object] options a set of options merge into these options. Useful for extending options when deriving classes rather than merging them by hand.
  // @return [ko.observable] the constructor does not return 'this' but a ko.observable
  // @note the constructor does not return 'this' but a ko.observable
  constructor(model, key_or_info, options, _vm) {
    if (_vm == null) {
      _vm = {};
    }
    this._vm = _vm;
    return kb.ignore(() => {
      let key;
      key_or_info || kb._throwMissing(this, 'key_or_info');
      this.key = key_or_info.key || key_or_info;
      for (key of Array.from(KEYS_INFO)) {
        if (key_or_info[key]) {
          this[key] = key_or_info[key];
        }
      }

      const create_options = kb.utils.collapseOptions(options);
      const { event_watcher } = create_options;
      create_options.event_watcher = undefined;

      // set up basics
      this._value = new TypedValue(create_options);
      this._model = ko.observable();
      let observable = kb.utils.wrappedObservable(
        this,
        ko.computed({
          read: () => {
            let args;
            const _model = this._model();
            for (var arg of Array.from((args = [this.key].concat(this.args || [])))) {
              ko.utils.unwrapObservable(arg);
            }
            __guard__(kb.utils.wrappedEventWatcher(this), (x) => x.emitter(_model || null)); // update the event watcher
            if (this.read) {
              this.update(this.read.apply(this._vm, args));
            } else if (!_.isUndefined(_model)) {
              kb.ignore(() => this.update(kb.getValue(_model, kb.peek(this.key), this.args)));
            }
            return this._value.value();
          },

          write: (new_value) => {
            return kb.ignore(() => {
              const unwrapped_new_value = kb.utils.unwrapModels(new_value); // unwrap for set (knockout may pass view models which are required for the observable but not the model)
              const _model = kb.peek(this._model);
              if (this.write) {
                this.write.call(this._vm, unwrapped_new_value);
                new_value = kb.getValue(_model, kb.peek(this.key), this.args);
              } else if (_model) {
                kb.setValue(_model, kb.peek(this.key), unwrapped_new_value);
              }
              return this.update(new_value);
            });
          },

          owner: this._vm,
        })
      );

      observable.__kb_is_o = true; // mark as a kb.Observable
      create_options.store = kb.utils.wrappedStore(observable, create_options.store);
      create_options.path = kb.utils.pathJoin(create_options.path, this.key);
      if (create_options.factories && (typeof create_options.factories === 'function' || create_options.factories.create)) {
        create_options.factory = kb.utils.wrappedFactory(observable, new kb.Factory(create_options.factory));
        create_options.factory.addPathMapping(create_options.path, create_options.factories);
      } else {
        create_options.factory = kb.Factory.useOptionsOrCreate(create_options, observable, create_options.path);
      }
      create_options.factories = undefined;

      // publish public interface on the observable and return instead of this
      kb.publishMethods(observable, this, KEYS_PUBLISH);

      // use external model observable or create
      observable.model = this.model = ko.computed({
        read: () => ko.utils.unwrapObservable(this._model),
        write: (new_model) => {
          return kb.ignore(() => {
            if (this.__kb_released || kb.peek(this._model) === new_model) {
              return;
            } // destroyed or no change

            // update references
            const new_value = kb.getValue(new_model, kb.peek(this.key), this.args);
            this._model(new_model);
            if (!new_model) {
              return this.update(null);
            }
            if (!_.isUndefined(new_value)) {
              return this.update(new_value);
            }
          });
        },
      });
      kb.EventWatcher.useOptionsOrCreate({ event_watcher }, model || null, this, { emitter: this.model, update: () => kb.ignore(() => this.update()), key: this.key, path: create_options.path });
      this._value.rawValue() || this._value.update(); // wasn't loaded so create

      if (kb.LocalizedObservable && key_or_info.localizer) {
        observable = new key_or_info.localizer(observable);
      } // wrap ourselves with a localizer
      if (kb.DefaultObservable && key_or_info.hasOwnProperty('default')) {
        observable = kb.defaultObservable(observable, key_or_info.default);
      } // wrap ourselves with a default value

      return observable;
    });
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy() {
    const observable = kb.utils.wrappedObservable(this);
    this.__kb_released = true;
    this._value.destroy();
    this._value = null;
    this.model.dispose();
    this.model = observable.model = null;
    return kb.utils.wrappedDestroy(this);
  }

  // @return [kb.CollectionObservable|kb.ViewModel|ko.observable] exposes the raw value inside the kb.observable. For example, if your attribute is a Collection, it will hold a CollectionObservable.
  value() {
    return this._value.rawValue();
  }

  // @return [kb.TYPE_UNKNOWN|kb.TYPE_SIMPLE|kb.TYPE_ARRAY|kb.TYPE_MODEL|kb.TYPE_COLLECTION] provides the type of the wrapped value.
  valueType() {
    return this._value.valueType(kb.peek(this._model), kb.peek(this.key));
  }

  //###################################################
  // Internal
  //###################################################
  // @nodoc
  update(new_value) {
    if (this.__kb_released) {
      return;
    } // destroyed, nothing to do
    if (!arguments.length) {
      new_value = kb.getValue(kb.peek(this._model), kb.peek(this.key));
    }
    return this._value.update(new_value);
  }
};

kb.observable = (model, key, options, view_model) => new kb.Observable(model, key, options, view_model);

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}
