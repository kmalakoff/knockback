/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

import _ from 'underscore';
import Backbone from 'backbone';
import ko from 'knockout';

import kb from 'knockback';

const KEYS_PUBLISH = ['destroy', 'observedValue', 'resetToCurrent'];

// @abstract You must provide the following two methods:
//   * read: function(value, observable) called to get the value and each time the locale changes
//   * write: function(localized_string, value, observable) called to set the value (optional)
//
// Base class for observing localized data that changes when the locale changes.
//
// @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
//   kb.ShortDateLocalizer = kb.LocalizedObservable.extend({
//     constructor: function(value, options, view_model) {
//       kb.LocalizedObservable.prototype.constructor.apply(this, arguments);
//       return kb.utils.wrappedObservable(this);
//     },
//     read: function(value) {
//       return Globalize.format(value, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale());
//     },
//     write: function(localized_string, value) {
//       var new_value;
//       new_value = Globalize.parseDate(localized_string, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale());
//       if (!(new_value && _.isDate(new_value))) {
//         return kb.utils.wrappedObservable(this).resetToCurrent();
//       }
//       return value.setTime(new_value.valueOf());
//     }
//   });
//   var ViewModel = function(model) {
//     this.localized_date = kb.observable(model, {
//       key: 'date',
//       'default': this.loading_message,
//       localizer: ShortDateLocalizer
//     }, this);
//   };
//   var view_model = new ViewModel(new Backbone.Model({date: new Date()}));
//
// @method .extend(prototype_properties, class_properties)
//   Class method for JavaScript inheritance.
//   @param [Object] prototype_properties the properties to add to the prototype
//   @param [Object] class_properties the properties to add to the class
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
//   @example
//     var MyLocalizedObservable = kb.LocalizedObservable.extend({
//        constructor: function(value, options, view_model) {
//          // the constructor does not return 'this' but a ko.observable
//          return kb.LocalizedObservable.prototype.constructor.apply(this, arguments);
//        }
//     });
export default class LocalizedObservable {
  static extend = Backbone.Model.extend;
    // for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")

  // Used to create a new kb.LocalizedObservable. This an abstract class.
  //
  // @param [Data|ko.observable] value the value to localize
  // @param [Object] options the create options
  // @option options [Data|ko.observable] default a default value to present when the value is null, an empty string, etc.
  // @option options [Function] onChange a notification that gets called when the locale changes. Signature: function(localized_string, value, observable)
  // @return [ko.observable] the constructor does not return 'this' but a ko.observable
  // @note the constructor does not return 'this' but a ko.observable
  constructor(value, options, vm) { // @vm is view_model
    this.value = value;
    this.vm = vm;
    if (!options) { options = {}; } if (!this.vm) { this.vm = {}; }
    this.read || kb._throwMissing(this, 'read');
    kb.locale_manager || kb._throwMissing(this, 'kb.locale_manager');

    // bind callbacks
    if (!this.__kb) { this.__kb = {}; }
    this.__kb._onLocaleChange = _.bind(this._onLocaleChange, this);
    this.__kb._onChange = options.onChange;

    // internal state
    const currentValue = this.value ? ko.utils.unwrapObservable(this.value) : null;
    this.vo = ko.observable(!currentValue ? null : this.read(currentValue, null));

    let observable = kb.utils.wrappedObservable(this, ko.computed({
      read: () => {
        if (this.value) ko.utils.unwrapObservable(this.value);
        this.vo(); // create a depdenency
        return this.read(ko.utils.unwrapObservable(this.value));
      },

      write: (x) => {
        this.write || kb._throwUnexpected(this, 'writing to read-only');
        this.write(x, ko.utils.unwrapObservable(this.value));
        this.vo(x);
        !this.__kb._onChange || this.__kb._onChange(x);
      },

      owner: this.vm,
    }));

    // publish public interface on the observable and return instead of this
    kb.publishMethods(observable, this, KEYS_PUBLISH);

    // start
    kb.locale_manager.bind('change', this.__kb._onLocaleChange);

    // wrap ourselves with a default value
    if (Object.prototype.hasOwnProperty.call(options, 'default')) { observable = kb.DefaultObservable && ko.defaultObservable(observable, options.default); }

    return observable;
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy() {
    kb.locale_manager.unbind('change', this.__kb._onLocaleChange);
    this.vm = null;
    return kb.utils.wrappedDestroy(this);
  }

  // Used to reset the value if localization is not possible.
  resetToCurrent() {
    const observable = kb.utils.wrappedObservable(this);
    const current_value = this.value ? this.read(ko.utils.unwrapObservable(this.value)) : null;
    if (observable() === current_value) return undefined;
    return observable(current_value);
  }

  // Dual purpose set/get
  observedValue(value) {
    if (arguments.length === 0) return this.value;
    this.value = value; this._onLocaleChange();
    return undefined;
  }

  // ###################################################
  // Internal
  // ###################################################

  // @nodoc
  _onLocaleChange() {
    const value = this.read(ko.utils.unwrapObservable(this.value));
    this.vo(value);
    if (this.__kb._onChange) return this.__kb._onChange(value);
    return undefined;
  }
}

// factory function
export const localizedObservable = (...args) => new LocalizedObservable(...args);
