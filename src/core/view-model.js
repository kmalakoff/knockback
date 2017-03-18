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
const extend = require('./functions/extend');

// @nodoc
const assignViewModelKey = function (vm, key) {
  const vm_key = vm.__kb.internals && ~_.indexOf(vm.__kb.internals, key) ? `_${key}` : key;
  if (vm.__kb.view_model.hasOwnProperty(vm_key)) return; // already exists, skip
  vm.__kb.view_model[vm_key] = null;
  return vm_key;
};

// @nodoc
const createObservable = function (vm, model, key, create_options) {
  let vm_key;
  if (vm.__kb.excludes && ~_.indexOf(vm.__kb.excludes, key)) return;
  if (vm.__kb.statics && ~_.indexOf(vm.__kb.statics, key)) return;
  if (!(vm_key = assignViewModelKey(vm, key))) return;
  return vm[vm_key] = (vm.__kb.view_model[vm_key] = kb.observable(model, key, create_options, vm));
};

// @nodoc
const createStaticObservables = function (vm, model) {
  _.each(vm.__kb.statics, (key) => {
    let vm_key;
    if ((vm_key = assignViewModelKey(vm, key))) {
      if (model.has(vm_key)) {
        vm[vm_key] = (vm.__kb.view_model[vm_key] = model.get(vm_key));
      } else if (vm.__kb.static_defaults && vm_key in vm.__kb.static_defaults) {
        vm[vm_key] = (vm.__kb.view_model[vm_key] = vm.__kb.static_defaults[vm_key]);
      } else {
        delete vm.__kb.view_model[vm_key];
      }
    }
  });
};

const KEYS_OPTIONS = ['keys', 'internals', 'excludes', 'statics', 'static_defaults'];

// Base class for ViewModels for Models.
//
// @example How to create a ViewModel with first_name and last_name observables.
//   var view_model = kb.viewModel(new Backbone.Model({first_name: "Planet", last_name: "Earth"}));
//
// @example Bulk kb.Observable create using 'key' Object to customize the kb.Observable created per attribute.
//   var ContactViewModel = function(model) {
//     this.loading_message = new kb.LocalizedStringLocalizer(new LocalizedString('loading'));
//     this._auto = kb.viewModel(model, {
//       keys: {
//         name: { key: 'name', 'default': this.loading_message },
//         number: { key: 'number', 'default': this.loading_message },
//         date: { key: 'date', 'default': this.loading_message, localizer: kb.ShortDateLocalizer }
//       }
//     }, this);
//     return this;
//   };
//
// @example Creating ko.Observables on a target ViewModel
//   var view_model = {};
//   kb.viewModel(model, ['name', 'date'], view_model); // observables are added to view_model
//
// @method .extend(prototype_properties, class_properties)
//   Class method for JavaScript inheritance.
//   @param [Object] prototype_properties the properties to add to the prototype
//   @param [Object] class_properties the properties to add to the class
//   @return [kb.ViewModel] the constructor returns 'this'
//   @example
//     var ContactViewModel = kb.ViewModel.extend({
//       constructor: function(model) {
//         kb.ViewModel.prototype.constructor.call(this, model, {internals: ['email', 'date']});   // call super constructor: @name, @_email, and @_date created in super from the model attributes
//         this.email = kb.defaultObservable(this._email, 'your.name@yourplace.com');
//         this.date = new LongDateLocalizer(this._date);
//         return this;
//       }
//     });
//   @example
//     var ViewModel = kb.ViewModel.extend({
//       constructor: function(model){
//         kb.ViewModel.prototype.constructor.apply(this, arguments);
//         this.full_name = ko.computed(function() { return this.first_name() + " " + this.last_name(); }, this);
//       }
//     });
//     var view_model = new ViewModel(model);
//
// @method #model()
//   Dual-purpose getter/setter ko.computed for the observed model.
//   @return [Model|ModelRef|void] getter: the model whose attributes are being observed (can be null) OR setter: void
//   @example
//     var view_model = kb.viewModel(new Backbone.Model({name: 'bob'}));
//     var the_model = view_model.model(); // get
//     view_model.model(new Backbone.Model({name: 'fred'})); // set
//
class ViewModel {
  static initClass() {
    // @nodoc
    ViewModel.extend = extend;
     // for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")
  }

  // Used to create a new kb.ViewModel.
  //
  // @param [Model|ModelRef] model the model to observe (can be null)
  // @param [Object] options the create options
  // @option options [Array|String] internals an array of atttributes that should be scoped with an underscore, eg. name -> _name
  // @option options [Array|String] requires an array of atttributes that will have kb.Observables created even if they do not exist on the Model. Useful for binding Views that require specific observables to exist
  // @option options [Array|String] keys restricts the keys used on a model. Useful for reducing the number of kb.Observables created from a limited set of Model attributes
  // @option options [Object|Array|String] excludes if an array is supplied, excludes keys to exclude on the view model; for example, if you want to provide a custom implementation. If an Object, it provides options to the kb.Observable constructor.
  // @option options [Array] statics creates non-observable properties on your view model for Model attributes that do not need to be observed for changes.
  // @option options [Object] static_defaults provides default values for statics.
  // @option options [String] path the path to the value (used to create related observables from the factory).
  // @option options [kb.Store] store a store used to cache and share view models.
  // @option options [Object] factories a map of dot-deliminated paths; for example `{'models.name': kb.ViewModel}` to either constructors or create functions. Signature: `{'some.path': function(object, options)}`
  // @option options [kb.Factory] factory a factory used to create view models.
  // @option options [Object] options a set of options merge into these options. Useful for extending options when deriving classes rather than merging them by hand.
  // @return [ko.observable] the constructor returns 'this'
  // @param [Object] view_model a view model to also set the kb.Observables on. Useful when batch creating observable on an owning view model.
  constructor(model, options = {}, view_model) {
    const args = Array.prototype.slice.call(_.isArguments(model) ? model : arguments);
    return kb.ignore(() => {
      !(model = args.shift()) || kb.isModel(model) || kb._throwUnexpected(this, 'not a model');
      if (_.isArray(args[0])) { args[0] = { keys: args[0] }; }
      if (!this.__kb) { this.__kb = {}; } this.__kb.view_model = (args.length > 1 ? args.pop() : this);
      options = {};
      _.each(args, (arg) => { kb.assign(options, arg); options = kb.utils.collapseOptions(options); });
      _.each(KEYS_OPTIONS, (key) => { if (options.hasOwnProperty(key)) { this.__kb[key] = options[key]; } });

      // always use a store to ensure recursive view models are handled correctly
      kb.Store.useOptionsOrCreate(options, model, this);

      // view model factory
      this.__kb.path = options.path;
      kb.Factory.useOptionsOrCreate(options, this, options.path);

      const _model = kb.utils.set(this, '_model', ko.observable());
      this.model = ko.computed({
        read: () => ko.utils.unwrapObservable(_model),
        write: new_model => kb.ignore(() => {
          if ((kb.utils.wrappedObject(this) === new_model) || kb.wasReleased(this) || !event_watcher) return;

          this.__kb.store.reuse(this, kb.utils.resolveModel(new_model));
          event_watcher.emitter(new_model); _model(event_watcher.ee);
          return !event_watcher.ee || this.createObservables(event_watcher.ee);
        },
      ),
      });
      var event_watcher = kb.utils.wrappedEventWatcher(this, new kb.EventWatcher(model, this, { emitter: this._model, update: (() => kb.ignore(() => !(event_watcher != null ? event_watcher.ee : undefined) || this.createObservables(event_watcher != null ? event_watcher.ee : undefined))) }));
      kb.utils.wrappedObject(this, (model = event_watcher.ee)); _model(event_watcher.ee);

    // update the observables
      this.__kb.create_options = { store: kb.utils.wrappedStore(this), factory: kb.utils.wrappedFactory(this), path: this.__kb.path, event_watcher: kb.utils.wrappedEventWatcher(this) };
      !options.requires || this.createObservables(model, options.requires);
      !this.__kb.internals || this.createObservables(model, this.__kb.internals);
      !options.mappings || this.createObservables(model, options.mappings);
      !this.__kb.statics || createStaticObservables(this, model);
      this.createObservables(model, this.__kb.keys);

      !kb.statistics || kb.statistics.register('ViewModel', this);     // collect memory management statistics
      return this;
    },
  );
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy() {
    this.__kb_released = true;
    if (this.__kb.view_model !== this) {
      ((() => {
        const result = [];
        for (const vm_key in this.__kb.vm_keys) {
          result.push(this.__kb.view_model[vm_key] = null);
        }
        return result;
      })());
    } // clear the external references
    this.__kb.view_model = (this.__kb.create_options = null);
    kb.releaseKeys(this);
    kb.utils.wrappedDestroy(this);

    return !kb.statistics || kb.statistics.unregister('ViewModel', this);     // collect memory management statistics
  }

  // Get the options for a new view model that can be used for sharing view models.
  shareOptions() { return { store: kb.utils.wrappedStore(this), factory: kb.utils.wrappedFactory(this) }; }

  // create observables manually
  createObservables(model, keys) {
    let key;
    if (!keys) {
      let rel_keys;
      if (this.__kb.keys || !model) return; // only use the keys provided
      for (key in model.attributes) { createObservable(this, model, key, this.__kb.create_options); }
      if (rel_keys = __guardMethod__(kb.settings.orm, 'keys', o => o.keys(model))) {
        ((() => rel_keys.map(key => createObservable(this, model, key, this.__kb.create_options)))());
      }
    } else if (_.isArray(keys)) {
      _.map(keys, key => createObservable(this, model, key, this.__kb.create_options));
    } else {
      for (key in keys) {
        var vm_key;
        const mapping_info = keys[key];
        if ((vm_key = assignViewModelKey(this, key))) {
          if (!_.isString(mapping_info)) { if (!mapping_info.key) { mapping_info.key = vm_key; } }
          this[vm_key] = (this.__kb.view_model[vm_key] = kb.observable(model, mapping_info, this.__kb.create_options, this));
        }
      }
    }
  }
}
ViewModel.initClass();
kb.ViewModel = ViewModel;
module.exports = ViewModel;

// Factory function to create a kb.ViewModel.
kb.viewModel = function (model, options, view_model) { return new kb.ViewModel(arguments); };
function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  }
  return undefined;
}
