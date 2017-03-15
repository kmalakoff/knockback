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

// Used to provide a central place to aggregate registered Model events rather than having all kb.Observables register for updates independently.
//
kb.EventWatcher = class EventWatcher {

  // Used to either register yourself with the existing emitter watcher or to create a new one.
  //
  // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(emitter, options)
  // @param [Model|ModelRef] obj the Model that will own or register with the store
  // @param [ko.observable|Object] emitter the emitters of the event watcher
  // @param [Object] callback_options information about the event and callback to register
  // @option options [Function] emitter callback for when the emitter changes (eg. is loaded). Signature: function(new_emitter)
  // @option options [Function] update callback for when the registered event is triggered. Signature: function(new_value)
  // @option options [String] event_selector the name or names of events.
  // @option options [String] key the optional key to filter update attribute events.
  static useOptionsOrCreate(options, emitter, obj, callback_options) {
    if (options.event_watcher) {
      if ((options.event_watcher.emitter() !== emitter) && (options.event_watcher.model_ref !== emitter)) { kb._throwUnexpected(this, 'emitter not matching'); }
      return kb.utils.wrappedEventWatcher(obj, options.event_watcher).registerCallbacks(obj, callback_options);
    }
    kb.utils.wrappedEventWatcherIsOwned(obj, true);
    return kb.utils.wrappedEventWatcher(obj, new kb.EventWatcher(emitter)).registerCallbacks(obj, callback_options);
  }

  constructor(emitter, obj, callback_options) {
    if (!this.__kb) { this.__kb = {}; }
    this.__kb.callbacks = {};

    this.ee = null;
    if (callback_options) { this.registerCallbacks(obj, callback_options); }
    if (emitter) { this.emitter(emitter); }
  }

  // Required clean up function to break cycles, release view emitters, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy() {
    this.emitter(null); this.__kb.callbacks = null;
    return kb.utils.wrappedDestroy(this);
  }

  // Dual-purpose getter/setter for the observed emitter.
  //
  // @overload emitter()
  //   Gets the emitter or emitter reference
  //   @return [Model|ModelRef] the emitter whose attributes are being observed (can be null)
  // @overload emitter(new_emitter)
  //   Sets the emitter or emitter reference
  //   @param [Model|ModelRef] new_emitter the emitter whose attributes will be observed (can be null)
  emitter(new_emitter) {
    // get or no change
    if ((arguments.length === 0) || (this.ee === new_emitter)) return this.ee;

    // clear and unbind previous
    if (this.model_ref) {
      this.model_ref.unbind('loaded', this._onModelLoaded);
      this.model_ref.unbind('unloaded', this._onModelUnloaded);
      this.model_ref.release(); this.model_ref = null;
    }

    // set up current
    if (kb.Backbone && kb.Backbone.ModelRef && (new_emitter instanceof kb.Backbone.ModelRef)) {
      this.model_ref = new_emitter; this.model_ref.retain();
      this.model_ref.bind('loaded', this._onModelLoaded);
      this.model_ref.bind('unloaded', this._onModelUnloaded);
      new_emitter = this.model_ref.model() || null;
    } else {
      delete this.model_ref;
    }

    // switch bindings
    if (this.ee !== new_emitter) {
      if (new_emitter) { this._onModelLoaded(new_emitter); } else { this._onModelUnloaded(this.ee); }
    }
    return new_emitter;
  }

  // Used to register callbacks for an emitter.
  //
  // @param [Object] obj the owning object.
  // @param [Object] callback_info the callback information
  // @option options [Function] emitter callback for when the emitter changes (eg. is loaded). Signature: function(new_emitter)
  // @option options [Function] update callback for when the registered emitter is triggered. Signature: function(new_value)
  // @option options [String] emitter_name the name of the emitter.
  // @option options [String] key the optional key to filter update attribute events.
  registerCallbacks(obj, callback_info) {
    obj || kb._throwMissing(this, 'obj');
    callback_info || kb._throwMissing(this, 'callback_info');
    const event_names = callback_info.event_selector ? callback_info.event_selector.split(' ') : ['change'];
    const model = this.ee;

    event_names.forEach((event_name) => {
      if (!event_name) return; // extra spaces

      let callbacks,
        info;
      if (!(callbacks = this.__kb.callbacks[event_name])) {
        callbacks = (this.__kb.callbacks[event_name] = {
          model: null,
          list: [],
          fn: (model) => {
            callbacks.list.forEach((info) => {
              if (!info.update) return;
              if (model && info.key && (model.hasChanged && !model.hasChanged(ko.utils.unwrapObservable(info.key)))) return; // key doesn't match
              !kb.statistics || kb.statistics.addModelEvent({ name: event_name, model, key: info.key, path: info.path });
              info.update();
            }); // trigger update
          },
        });
      }

      callbacks.list.push(info = _.defaults({ obj }, callback_info)); // store the callback information
      if (model) return this._onModelLoaded(model);
    });
    return this;
  }

  releaseCallbacks(obj) {
    let callbacks;
    this.ee = null;
    for (const event_name in this.__kb.callbacks) { callbacks = this.__kb.callbacks[event_name]; this._unbindCallbacks(event_name, callbacks, kb.wasReleased(obj)); } // unbind all events
    return delete this.__kb.callbacks;
  }

  // ###################################################
  // Internal
  // ###################################################

  // @nodoc
  // NOTE: this is called by registerCallbacks so the model could already be bound and we just want to bind the new info
  // NOTE: this is called by emitter so it may be used to clear a previous emitter without triggering an intermediate change
  _onModelLoaded = (model) => {
    this.ee = model;
    for (const event_name in this.__kb.callbacks) { // bind all events
      const callbacks = this.__kb.callbacks[event_name];
      if (callbacks.model && (callbacks.model !== model)) { this._unbindCallbacks(event_name, callbacks, true); }

      if (!callbacks.model) { ((callbacks.model = model), model.bind(event_name, callbacks.fn)); }
      callbacks.list.forEach((info) => {
        if (!info.unbind_fn) { info.unbind_fn = kb.settings.orm != null ? kb.settings.orm.bind(model, info.key, info.update, info.path) : undefined; }
        (info.emitter ? info.emitter(model) : undefined);
      });
    }
  }

  // @nodoc
  _onModelUnloaded = (model) => {
    if (this.ee !== model) return;
    this.ee = null;
    for (const event_name in this.__kb.callbacks) { const callbacks = this.__kb.callbacks[event_name]; this._unbindCallbacks(event_name, callbacks); } // unbind all events
  }

  // @nodoc
  _unbindCallbacks = (event_name, callbacks, skip_emitter) => {
    if (callbacks.model) {
      callbacks.model.unbind(event_name, callbacks.fn);
      callbacks.model = null;
    }

    callbacks.list.forEach((info) => {
      if (info.unbind_fn) { (info.unbind_fn(), (info.unbind_fn = null)); }
      if (info.emitter && !skip_emitter && !kb.wasReleased(info.obj)) { info.emitter(null); }
    });
  }
};

// factory function
kb.emitterObservable = (emitter, observable) => new kb.EventWatcher(emitter, observable);
