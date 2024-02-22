/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */ /*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/ "use strict";
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var kb;
var window = window != null ? window : global;
var _ref = kb = require("./kb"), _ = _ref._, ko = _ref.ko;
kb.RECUSIVE_AUTO_INJECT = true;
// custom Knockout `inject` binding
ko.bindingHandlers.inject = {
    init: function init(element, value_accessor, all_bindings_accessor, view_model) {
        return kb.Inject.inject(ko.utils.unwrapObservable(value_accessor()), view_model, element, value_accessor, all_bindings_accessor);
    }
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
kb.Inject = /*#__PURE__*/ function() {
    "use strict";
    function Inject() {
        _class_call_check(this, Inject);
    }
    _create_class(Inject, null, [
        {
            key: "inject",
            value: // @private
            function inject(data, view_model, element, value_accessor, all_bindings_accessor, nested) {
                var inject = function inject(data) {
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
                        for(var key in data){
                            var value = data[key];
                            if (key === "view_model") {
                                continue;
                            }
                            // create function
                            if (key === "create") {
                                value(view_model, element, value_accessor, all_bindings_accessor);
                            // resolve nested with assign or not
                            } else if (_.isObject(value) && !_.isFunction(value)) {
                                var target = nested || value && value.create ? {} : view_model;
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
                if (nested) {
                    return inject(data);
                }
                return kb.ignore(function() {
                    return inject(data);
                });
            }
        },
        {
            key: "injectViewModels",
            value: // Searches the DOM from root or document for elements with the `'kb-inject'` attribute and create/customizes ViewModels for the DOM tree when encountered. Also, used with the data-bind `'inject'` custom binding.
            // @param [DOM element] root the root DOM element to start searching for `'kb-inject'` attributes.
            // @return [Array] array of Objects with the DOM elements and ViewModels that were bound in the form `{el: DOM element, view_model: ViewModel}`.
            function injectViewModels(root) {
                // find all of the app elements
                var results = [];
                var findElements = function findElements1(el) {
                    if (!el.__kb_injected) {
                        // already injected -> skip, but still process children in case they were added afterwards
                        var attr;
                        if (el.attributes && (attr = _.find(el.attributes, function(attr) {
                            return attr.name === "kb-inject";
                        }))) {
                            el.__kb_injected = true; // mark injected
                            results.push({
                                el: el,
                                view_model: {},
                                binding: attr.value
                            });
                        }
                    }
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = Array.from(el.childNodes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var child_el = _step.value;
                            findElements(child_el);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                };
                if (!root && (window != null ? window.document : undefined)) {
                    root = window.document;
                }
                findElements(root);
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    // bind the view models
                    for(var _iterator = Array.from(results)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var app = _step.value;
                        // evaluate the app data
                        var afterBinding;
                        var beforeBinding;
                        var expression;
                        var options;
                        if (expression = app.binding) {
                            expression.search(/[:]/) < 0 || (expression = "{".concat(expression, "}")); // wrap if is an object
                            var data = new Function("", "return ( ".concat(expression, " )"))();
                            data || (data = {}); // no data
                            !data.options || (options = data.options, data.options = undefined); // extract options
                            options || (options = {});
                            app.view_model = kb.Inject.inject(data, app.view_model, app.el, null, null, true);
                            afterBinding = app.view_model.afterBinding || options.afterBinding;
                            beforeBinding = app.view_model.beforeBinding || options.beforeBinding;
                        }
                        // auto-bind
                        if (beforeBinding) {
                            beforeBinding.call(app.view_model, app.view_model, app.el, options);
                        }
                        kb.applyBindings(app.view_model, app.el, options);
                        if (afterBinding) {
                            afterBinding.call(app.view_model, app.view_model, app.el, options);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return results;
            }
        }
    ]);
    return Inject;
}();
// auto-inject recursively
var _ko_applyBindings = ko.applyBindings;
ko.applyBindings = function(_context, element) {
    var results = kb.RECUSIVE_AUTO_INJECT ? kb.injectViewModels(element) : [];
    if (!results.length) {
        return _ko_applyBindings.apply(this, arguments);
    }
};
//############################
// Aliases
//############################
kb.injectViewModels = kb.Inject.injectViewModels;
//############################
// Auto Inject results
//############################
if (typeof document !== "undefined" && document !== null) {
    // use simple ready check
    var onReady;
    (onReady = function() {
        if (document.readyState !== "complete") {
            return setTimeout(onReady, 0);
        } // keep waiting for the document to load
        return kb.injectViewModels(); // the document is loaded
    })();
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }