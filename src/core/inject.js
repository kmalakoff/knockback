/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

const root = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : this;

const kb = require('./kb');
const { _, ko } = kb;

kb.RECUSIVE_AUTO_INJECT = true;

// custom Knockout `inject` binding
ko.bindingHandlers.inject = {
  init(element, value_accessor, all_bindings_accessor, view_model) {
    return kb.Inject.inject(ko.utils.unwrapObservable(value_accessor()), view_model, element, value_accessor, all_bindings_accessor);
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
kb.Inject = class Inject {
  // @private
  static inject(data, view_model, element, value_accessor, all_bindings_accessor, nested) {
    const inject = function (data) {
      if (_.isFunction(data)) {
        view_model = new data(view_model, element, value_accessor, all_bindings_accessor); // use 'new' to allow for classes in addition to functions
        kb.releaseOnNodeRemove(view_model, element);
      } else {
        // view_model constructor causes a scope change
        if (data.view_model) {
          // specifying a view_model changes the scope so we need to bind a destroy
          view_model = new data.view_model(view_model, element, value_accessor, all_bindings_accessor);
          kb.releaseOnNodeRemove(view_model, element);
        }

        // resolve and merge in each key
        for (const key in data) {
          const value = data[key];
          if (key === 'view_model') { continue; }

          // create function
          if (key === 'create') {
            value(view_model, element, value_accessor, all_bindings_accessor);

          // resolve nested with assign or not
          } else if (_.isObject(value) && !_.isFunction(value)) {
            const target = nested || (value && value.create) ? {} : view_model;
            view_model[key] = kb.Inject.inject(value, target, element, value_accessor, all_bindings_accessor, true);

          // simple set
          } else {
            view_model[key] = value;
          }
        }
      }

      return view_model;
    };

    // in recursive calls, we are already protected from propagating dependencies to the template
    return nested ? inject(data) : kb.ignore(() => inject(data));
  }

  // Searches the DOM from root or document for elements with the `'kb-inject'` attribute and create/customizes ViewModels for the DOM tree when encountered. Also, used with the data-bind `'inject'` custom binding.
  // @param [DOM element] root the root DOM element to start searching for `'kb-inject'` attributes.
  // @return [Array] array of Objects with the DOM elements and ViewModels that were bound in the form `{el: DOM element, view_model: ViewModel}`.
  static injectViewModels(el) {
    if (!el) return;

    // find all of the app elements
    const results = [];
    const findElements = (el) => {
      if (!el.__kb_injected) { // already injected -> skip, but still process children in case they were added afterwards
        const attr = _.find(el.attributes || [], attr => attr.name === 'kb-inject');
        if (attr) {
          el.__kb_injected = true; // mark injected
          results.push({ el, view_model: {}, binding: attr.value });
        }
      }
      _.each(el.childNodes, child => findElements(child));
    };
    findElements(el);

    // bind the view models
    _.each(results, (app) => {
      let options = {};
      let afterBinding = null;
      let beforeBinding = null;

      // evaluate the app data
      let expression = app.binding;
      if (expression) {
        (!~expression.search(/[:]/)) || (expression = `{${expression}}`); // wrap if is an object
        const data = (new Function('', `return ( ${expression} )`))() || {};
        if (data.options) { options = data.options; delete data.options; }
        app.view_model = kb.Inject.inject(data, app.view_model, app.el, null, null, true);
        afterBinding = app.view_model.afterBinding || options.afterBinding;
        beforeBinding = app.view_model.beforeBinding || options.beforeBinding;
      }

      // auto-bind
      if (beforeBinding) { beforeBinding.call(app.view_model, app.view_model, app.el, options); }
      kb.applyBindings(app.view_model, app.el, options);
      if (afterBinding) { afterBinding.call(app.view_model, app.view_model, app.el, options); }
    });
    return results;
  }
};

// auto-inject recursively
const _ko_applyBindings = ko.applyBindings;
ko.applyBindings = function (context, element) {
  const results = kb.RECUSIVE_AUTO_INJECT ? kb.injectViewModels(element) : [];
  if (!results.length) return _ko_applyBindings.apply(this, arguments);
};

// ############################
// Aliases
// ############################
kb.injectViewModels = kb.Inject.injectViewModels;

// ############################
// Auto Inject results
// ############################
if (root && (typeof root.document !== 'undefined')) {
  // use simple ready check
  const onReady = () => {
    if (root.document.readyState !== 'complete') return setTimeout(onReady, 0); // keep waiting for the document to load
    kb.injectViewModels(root.document); // the document is loaded
  };
  onReady();
}
