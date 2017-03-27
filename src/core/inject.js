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

const root = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : this;

export const RECUSIVE_AUTO_INJECT = true;

// custom Knockout `inject` binding
const inject = (data, view_model, element, value_accessor, all_bindings_accessor, nested) => {
  const doInject = function (value) {
    if (_.isFunction(value)) {
      view_model = new value(view_model, element, value_accessor, all_bindings_accessor); // use 'new' to allow for classes in addition to functions
      kb.releaseOnNodeRemove(view_model, element);
    } else {
      // view_model constructor causes a scope change
      if (value.view_model) {
        // specifying a view_model changes the scope so we need to bind a destroy
        view_model = new value.view_model(view_model, element, value_accessor, all_bindings_accessor);
        kb.releaseOnNodeRemove(view_model, element);
      }

      // resolve and merge in each key
      _.each(value, (item, key) => {
        if (key === 'view_model') return;

        // create function
        if (key === 'create') item(view_model, element, value_accessor, all_bindings_accessor);

        // resolve nested with assign or not
        else if (_.isObject(item) && !_.isFunction(item)) {
          const target = nested || (item && item.create) ? {} : view_model;
          view_model[key] = kb.Inject.inject(item, target, element, value_accessor, all_bindings_accessor, true);

        // simple set
        } else view_model[key] = item;
      });
    }

    return view_model;
  };

  // in recursive calls, we are already protected from propagating dependencies to the template
  return nested ? doInject(data) : kb.ignore(() => doInject(data));
};

ko.bindingHandlers.inject = {
  init(element, value_accessor, all_bindings_accessor, view_model) {
    return inject(ko.utils.unwrapObservable(value_accessor()), view_model, element, value_accessor, all_bindings_accessor);
  },
};

// Used to inject ViewModels and observables dynamically from your HTML Views. For both the `'kb-inject'` attribute and the data-bind `'inject'` custom binding, the following properties are reserved:
//
// * `'view_model'` class used to create a new ViewModel instance
// * `'create'` function used to manually add observables to a view model
// * `'options'` to pass to ko.applyBindings
// * `'afterBinding'` callback (can alternatively be in the options)
// * `'beforeBinding'` callback (can alternatively be in the options)
//
// Each function/constructor gets called with the following signature `'function(view_model, element)'`.
//
// @example Bind your application automatically when the DOM is loaded.
//   <div kb-inject><span data-bind="text: 'Hello World!'"></span></div>
// @example Bind your application with properties.
//   <div kb-inject="message: ko.observable('Hello World!')"><input data-bind="value: message"></input></div>
// @example Bind your application creating a specific ViewModel instance when the DOM is loaded.
//   <div kb-inject="MyViewModel"><input data-bind="value: message"></input></div>
//   var MyViewModel = function(view_model, el) {
//     this.message = ko.observable('Hello World!');
//   }
// @example Bind your application using a function when the DOM is loaded (like Angular.js controllers).
//   <div kb-inject="create: MyController"><input data-bind="value: message"></input></div>
//   var MyController = function(view_model, el) {
//     view_model.message = ko.observable('Hello World!');
//   }
// @example Bind your application with a specific ViewModel instance and a callback before and after the binding.
//   <div kb-inject="MyViewModel"><input data-bind="value: message"></input></div>
//   var MyViewModel = function(view_model, el) {
//     this.message = ko.observable('Hello World!');
//     this.beforeBinding = function() {alert('before'); };
//     this.afterBinding = function() {alert('after'); };
//   }
// @example Dynamically inject new properties into your ViewModel.
//   <div kb-inject="MyViewModel">
//     <div class="control-group" data-bind="inject: {site: ko.observable('http://your.url.com')}">
//       <label>Website</label>
//       <input type="url" name="site" data-bind="value: site, valueUpdate: 'keyup'" required>
//     </div>
//   </div>
//   var MyViewModel = function(view_model, el) {
//     // site will be dynamically attached to this ViewModel
//   }
// @example Dynamically bind a form.
//   <div kb-inject="MyViewModel">
//      <form name="my_form" data-bind="inject: kb.formValidator">
//        <div class="control-group">
//         <label>Name</label>
//         <input type="text" name="name" data-bind="value: name, valueUpdate: 'keyup'" required>
//       </div>
//       <div class="control-group">
//         <label>Website</label>
//         <input type="url" name="site" data-bind="value: site, valueUpdate: 'keyup'" required>
//       </div>
//     </form>
//   </div>
//   var MyViewModel = kb.ViewModel.extend({
//     constructor: ->
//       model = new Backbone.Model({name: '', site: 'http://your.url.com'});
//       kb.ViewModel.prototype.constructor.call(this, model);
//   });

const doBind = (app) => {
  let options = {};
  let afterBinding = null;
  let beforeBinding = null;

  // evaluate the app data
  let expression = app.binding;
  if (expression) {
    (!~expression.search(/[:]/)) || (expression = `{${expression}}`); // wrap if is an object
    const data = (new Function('', `return ( ${expression} )`))() || {};
    if (data.options) { options = data.options; delete data.options; }
    app.view_model = inject(data, app.view_model, app.el, null, null, true);
    afterBinding = app.view_model.afterBinding || options.afterBinding;
    beforeBinding = app.view_model.beforeBinding || options.beforeBinding;
  }

  // auto-bind
  if (beforeBinding) { beforeBinding.call(app.view_model, app.view_model, app.el, options); }
  kb.applyBindings(app.view_model, app.el, options);
  if (afterBinding) { afterBinding.call(app.view_model, app.view_model, app.el, options); }
};

// Searches the DOM from root or document for elements with the `'kb-inject'` attribute and create/customizes ViewModels for the DOM tree when encountered.
// Also, used with the data-bind `'inject'` custom binding.
// @param [DOM element] root the root DOM element to start searching for `'kb-inject'` attributes.
// @return [Array] array of Objects with the DOM elements and ViewModels that were bound in the form `{el: DOM element, view_model: ViewModel}`.
export const injectViewModels = (el = root.document) => {
  const results = [];
  if (!el.__kb_injected) { // already injected -> skip, but still process children in case they were added afterwards
    const attr = _.find(el.attributes || [], x => x.name === 'kb-inject');
    if (attr) {
      el.__kb_injected = true; // mark injected
      const app = { el, view_model: {}, binding: attr.value };
      doBind(app);
      results.push(app);
    }
  }
  _.each(el.childNodes, (child) => {
    const childResults = injectViewModels(child);
    if (childResults.length) _.each(childResults, x => results.push(x));
  });
  return results;
};

// auto-inject recursively
const _ko_applyBindings = ko.applyBindings;
ko.applyBindings = (...args) => {
  const el = args[1];
  const results = kb.RECUSIVE_AUTO_INJECT ? injectViewModels(el) : [];
  return results.length ? results : _ko_applyBindings.call(this, ...args);
};

// ############################
// Auto Inject results
// ############################
if (root && (typeof root.document !== 'undefined')) {
  // use simple ready check
  const onReady = () => {
    // keep waiting for the document to load
    if (root.document.readyState !== 'complete') return setTimeout(onReady, 0);
    return injectViewModels(); // the document is loaded
  };
  onReady();
}
