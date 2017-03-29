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
import root from 'window-or-global';

const LIFECYCLE_METHODS = ['release', 'destroy', 'dispose'];

const _ignore = (callback, callbackTarget, callbackArgs) => {
  let value = null;
  ko.computed(() => { value = callback.apply(callbackTarget, callbackArgs || []); }).dispose();
  return value;
};

// The 'kb' namespace for classes, factory functions, constants, etc.
//
// @method .configure(options)
//   Method to update Knockback global configuration.
//   @param [Object] configuration options.
// 1) orm - select the library for relationships (default, backbone-orm, backbone-associations, backbone-relational)
// 2) deep_retain - true to multiply retain view models in the store
//
// @method .collectionObservable(collection, options)
//   Factory to create a new kb.CollectionObservable. See {kb.CollectionObservable#constructor} for information on options
//   @param [Collection] collection the collection to observe (can be null)
//   @param [Object] options the create options
//   @return [ko.observableArray] the constructor does not return 'this' but a ko.observableArray
//
// @method .observable(model, options, view_model)
//   Factory to create a new kb.Observable. See {kb.Observable#constructor} for information on options
//   @param [Model] model the model to observe (can be null)
//   @param [String|Array|Object] options the create options. String is a single attribute name, Array is an array of attribute names.
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
//
// @method .viewModel(model, options, view_model)
//   Factory to create a new kb.ViewModel. See {kb.ViewModel#constructor} for information on options
//   @param [Model|ModelRef] model the model to observe (can be null)
//   @param [Object] options the create options
//   @return [ko.observable] the constructor returns 'this'
//
// @method .defaultObservable(target, default_value)
//   Factory to create a new kb.DefaultObservable. See {kb.DefaultObservable#constructor} for information on options.
//   If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-defaults component.
//   @param [ko.observable] target_observable the observable to check for null, undefined, or the empty string
//   @param [Any] default_value the default value. Can be a value, string or ko.observable
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
//
// @method .formattedObservable(format, arg1, arg2, etc)
//   Factory to create a new kb.FormattedObservable. See {kb.FormattedObservable#constructor} for information on options.
//   If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-formatting component.
//   @param [String|ko.observable] format the format string.
//   Format: `"{0} and {1}"` where `{0}` and `{1}` would be synchronized with the arguments (eg. "Bob and Carol" where `{0}` is Bob and `{1}` is Carol)
//   @param [Array] args arguments to be passed to the kb.LocaleManager's get() method
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
//
// @method .localizedObservable(value, options, view_model)
//   Factory to create a new kb.LocalizedObservable. See {kb.LocalizedObservable#constructor} for information on options.
//   If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-localization component.
//   @param [Data|ko.observable] value the value to localize
//   @param [Object] options the create options
//   @return [ko.observable] the constructor does not return 'this' but a ko.observable
export default class kb {
  // Knockback library semantic version
  static VERSION = '1.2.2';

  // ###################################
  // OBSERVABLE STORAGE TYPES
  // ###################################

  // Stored value type is not known like null/undefined (could be observed as a Model or a Collection or a simple type)
  static TYPE_UNKNOWN = 0;
  // Stored value type is simple like a String or Number -> observable type: ko.observable
  static TYPE_SIMPLE = 1;
  // Stored value type is an Array -> observable type: ko.observableArray
  static TYPE_ARRAY = 2;
  // Stored value type is a Model -> observable type: ViewModel
  static TYPE_MODEL = 3;
  // Stored value type is a Collection -> observable type: kb.CollectionObservable
  static TYPE_COLLECTION = 4;

  // cache local reference to underscore
  static assign = _.assign || _.extend;

  // cache local reference to Knockout
  static ignore = ko.dependencyDetection && ko.dependencyDetection.ignore ? ko.dependencyDetection.ignore : _ignore;

  // Checks if an object has been released.
  // @param [Any] obj the object to release and also release its keys
  static wasReleased(obj) { return !obj || obj.__kb_released; }

  // Checks if an object can be released. Used to perform minimal nested releasing on objects by checking if self or next level contained items can be released.
  // @param [Any] obj the object to release and also release its keys
  static isReleaseable(obj, depth) {
    if (depth == null) { depth = 0; }
    if ((!obj || (obj !== Object(obj))) || obj.__kb_released) return false; // must be an object and not already released
    if (ko.isObservable(obj) || (obj instanceof kb.ViewModel)) return true; // a known type that is releasable
    if ((typeof (obj) === 'function') || kb.isModel(obj) || kb.isCollection(obj)) return false; // a known type that is not releaseable
    for (let i = 0, l = LIFECYCLE_METHODS.length; i < l; i++) {
      const method = LIFECYCLE_METHODS[i];
      if (typeof (obj[method]) === 'function') return true;
    }

    if (depth > 0) return false; // max depth check for ViewModel inside of ViewModel
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if ((key !== '__kb') && kb.isReleaseable(value, depth + 1)) return true;
      }
    }
    return false;
  }

  // Releases any type of view model or observable or items in an array using the conventions of release(), destroy(), dispose().
  // @param [Any] obj the object to release and also release its keys
  //
  // @example
  //   var view_model = kb.viewModel(model);
  //   kb.release(view_model); view_model = null;
  // @example
  //   var todos = kb.collectionObservable(collection);
  //   kb.release(todos); todos = null;
  static release(obj) {
    if (!kb.isReleaseable(obj)) return;
    obj.__kb_released = true; // mark as released

    // release array's items
    if (_.isArray(obj)) {
      _.each(obj, (value, index) => {
        if (kb.isReleaseable(value)) { obj[index] = null; kb.release(value); }
      });
      return;
    }

    // observable or lifecycle managed
    const array = kb.peek(obj);
    if (ko.isObservable(obj) && _.isArray(array)) {
      if (obj.__kb_is_co || (obj.__kb_is_o && (obj.valueType() === kb.TYPE_COLLECTION))) {
        if (typeof obj.destroy === 'function') obj.destroy();
        return;
      }
      _.each(array, (value, index) => {
        if (kb.isReleaseable(value)) { array[index] = null; kb.release(value); }
      });
      if (typeof (obj.dispose) === 'function') { obj.dispose(); }
      return;
    }

    // releaseable signature
    for (let i = 0, l = LIFECYCLE_METHODS.length; i < l; i++) {
      const method = LIFECYCLE_METHODS[i];
      if (typeof (obj[method]) === 'function') {
        obj[method].call(obj);
        return;
      }
    }

    if (!ko.isObservable(obj)) this.releaseKeys(obj); // view model
  }

  // Releases and clears all of the keys on an object using the conventions of release(), destroy(), dispose() without releasing the top level object itself.
  static releaseKeys(obj) {
    _.each(obj, (value, key) => {
      if ((key !== '__kb') && kb.isReleaseable(value)) {
        obj[key] = null;
        kb.release(value);
      }
    });
  }

  // Binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
  // ```
  // ko.utils.domNodeDisposal.addDisposeCallback(node, function() { kb.release(view_model)} );
  // ```
  // @example The hard way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
  //   var el = $('<div data-bind="name: name"></div>')[0];
  //   var view_model = kb.viewModel(new Backbone.Model({name: 'Bob'}));
  //   ko.applyBindings(view_model, el);
  //   kb.releaseOnNodeRemove(view_model, el);
  //   ...
  //   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)
  static releaseOnNodeRemove(view_model, node) {
    view_model || kb._throwUnexpected(this, 'missing view model');
    node || kb._throwUnexpected(this, 'missing node');
    return ko.utils.domNodeDisposal.addDisposeCallback(node, () => kb.release(view_model));
  }

  // Renders a template and binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
  //
  // NOTE: if you provide an afterRender method on the View Model and do not provide afterRender in the options,
  // afterRender will be called with the following signature: afterRender(element) which differs from the Knockout signture of afterRender(elements)
  //
  // @example The easy way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
  //   var el = kb.renderTemplate('my_template', kb.viewModel(new Backbone.Model({name: 'Bob'})));
  //   ...
  //   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)
  static renderTemplate(template, view_model, options = {}) {
    if (!root.document) {
      (typeof console === 'undefined') || console.log('renderTemplate: document is undefined');
      return undefined;
    }

    let el = root.document.createElement('div');
    const observable = ko.renderTemplate(template, view_model, options, el, 'replaceChildren');

    // do not return the template wrapper if possible
    if (el.childNodes.length === 1) el = el.childNodes[0];
    else if (el.childNodes.length) {
      for (let i = 0, end = el.childNodes.length, asc = end >= 0; asc ? i <= end : i >= end; asc ? i++ : i--) { // ensure the context is passed up to wrapper from a child
        try {
          ko.storedBindingContextForNode(el, ko.contextFor(el.childNodes[i]));
          break;
        } catch (err) { /**/ }
      }
    }
    kb.releaseOnNodeRemove(view_model, el);
    observable.dispose(); // we will handle memory management with ko.removeNode (otherwise creates memory leak on default bound dispose function)

    if (view_model.afterRender && !options.afterRender) view_model.afterRender(el); // call afterRender for custom setup unless provided in options (so doesn't get double called)
    return el;
  }

  // Applies bindings and binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
  //
  // @example The easy way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
  //   var el = $('<div data-bind="name: name"></div>')[0];
  //   kb.applyBindings(kb.viewModel(new Backbone.Model({name: 'Bob'})), el);
  //   ...
  //   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)
  static applyBindings(view_model, node) {
    if (!root.document) {
      (typeof console === 'undefined') || console.log('renderTemplate: document is undefined');
      return undefined;
    }

    if (node.length) { // convert to a root element
      const children = node;
      node = root.document.createElement('div');
      _.each(children, child => node.appendChild(child));
    }
    ko.applyBindings(view_model, node);
    kb.releaseOnNodeRemove(view_model, node);
    return node;
  }

  static getValue(model, key, args) {
    if (!model) return undefined;
    if (!args) return model.get(key);
    return model.get(..._.map([key].concat(args), value => kb.peek(value)));
  }

  static setValue(model, key, value) {
    let attributes;
    if (!model) return undefined;
    (attributes = {})[key] = value;
    return model.set(attributes);
  }

  // ###################################
  // INTERNAL HELPERS
  // ###################################
  // @nodoc
  static _throwMissing(instance, message) {
    throw new Error(`${_.isString(instance) ? instance : instance.constructor.name}: ${message} is missing`);
  }

  // @nodoc
  static _throwUnexpected(instance, message) {
    throw new Error(`${_.isString(instance) ? instance : instance.constructor.name}: ${message} is unexpected`);
  }

  // @nodoc
  static publishMethods(observable, instance, methods) {
    _.each(methods, (fn) => { observable[fn] = kb._.bind(instance[fn], instance); });
  }

  // @nodoc
  static peek(obs) {
    if (!ko.isObservable(obs)) return obs;
    if (obs.peek) return obs.peek();
    return kb.ignore(() => obs());
  }

  // @nodoc
  static isModel(obj) { return obj && ((obj instanceof Backbone.Model) || ((typeof (obj.get) === 'function') && (typeof (obj.bind) === 'function'))); }

  // @nodoc
  static isCollection(obj) { return obj && (obj instanceof Backbone.Collection); }
}
