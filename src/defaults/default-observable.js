/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

const kb = require('../core');

const { _, ko } = kb;
require('./extensions');

const KEYS_PUBLISH = ['destroy', 'setToDefault'];

// Used to provide a default value when an observable is null, undefined, or the empty string.
//
// @example Provide a observable with observable and/or non observable default argument in the form of:
//   var wrapped_name = kb.defaultObservable(kb.observable(model, 'name'), '(no name)');
class DefaultObservable {
  // Used to create a new kb.DefaultObservable.
  //
  // @param [ko.observable] target_observable the observable to check for null, undefined, or the empty string
  // @param [Any] default_value the default value. Can be a value, string or ko.observable
  // @return [ko.observable] the constructor does not return 'this' but a ko.observable
  // @note the constructor does not return 'this' but a ko.observable
  constructor(target_observable, dv) { // @dv is default value
    this.dv = dv;
    const observable = kb.utils.wrappedObservable(this, ko.computed({
      read: () => {
        const current_target = ko.utils.unwrapObservable(target_observable());
        return _.isNull(current_target) || _.isUndefined(current_target) ? ko.utils.unwrapObservable(this.dv) : current_target;
      },
      write(value) { return target_observable(value); },
    }));

    // publish public interface on the observable and return instead of this
    kb.publishMethods(observable, this, KEYS_PUBLISH);

    return observable;
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy() { return kb.utils.wrappedDestroy(this); }

  // Forces the observable to take the default value.
  // @note Can be used with kb.utils.setToDefault, kb.Observable.setToDefault, kb.ViewModel.setToDefault
  setToDefault() { return kb.utils.wrappedObservable(this)(this.dv); }
}
kb.DefaultObservable = DefaultObservable;
module.exports = DefaultObservable;

kb.defaultObservable = (...args) => new kb.DefaultObservable(...args);
kb.observableDefault = kb.defaultObservable;
