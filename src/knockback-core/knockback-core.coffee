###
  knockback-core.js 0.16.5
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
###

# The 'kb' namespace for classes, factory functions, constants, etc. Aliased to 'Knockback'
#
# @method .collectionObservable(collection, options)
#   Factory to create a new kb.CollectionObservable. See {kb.CollectionObservable#constructor} for information on options
#   @param [Backbone.Collection] collection the collection to observe (can be null)
#   @param [Object] options the create options
#   @return [ko.observableArray] the constructor does not return 'this' but a ko.observableArray
#
# @method .observable(model, options, view_model)
#   Factory to create a new kb.Observable. See {kb.Observable#constructor} for information on options
#   @param [Backbone.Model] model the model to observe (can be null)
#   @param [String|Array|Object] options the create options. String is a single attribute name, Array is an array of attribute names.
#   @return [ko.observable] the constructor does not return 'this' but a ko.observable
#
# @method .viewModel(model, options, view_model)
#   Factory to create a new kb.ViewModel. See {kb.ViewModel#constructor} for information on options
#   @param [Backbone.Model|Backbone.ModelRef] model the model to observe (can be null)
#   @param [Object] options the create options
#   @return [ko.observable] the constructor returns 'this'
#
# @method .defaultObservable(target, default_value)
#   Factory to create a new kb.DefaultObservable. See {kb.DefaultObservable#constructor} for information on options. If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-defaults component.
#   @param [ko.observable] target_observable the observable to check for null, undefined, or the empty string
#   @param [Any] default_value the default value. Can be a value, string or ko.observable
#   @return [ko.observable] the constructor does not return 'this' but a ko.observable
#
# @method .formattedObservable(format, arg1, arg2, ...)
#   Factory to create a new kb.FormattedObservable. See {kb.FormattedObservable#constructor} for information on options. If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-formatting component.
#   @param [String|ko.observable] format the format string. Format: `"{0} and {1}"` where `{0}` and `{1}` would be synchronized with the arguments (eg. "Bob and Carol" where `{0}` is Bob and `{1}` is Carol)
#   @param [Array] args arguments to be passed to the kb.LocaleManager's get() method
#   @return [ko.observable] the constructor does not return 'this' but a ko.observable
#
# @method .localizedObservable(value, options, view_model)
#   Factory to create a new kb.LocalizedObservable. See {kb.LocalizedObservable#constructor} for information on options. If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-localization component.
#   @param [Data|ko.observable] value the value to localize
#   @param [Object] options the create options
#   @return [ko.observable] the constructor does not return 'this' but a ko.observable
#
# @method .injectViewModels(root)
#   Searches the DOM from root or document for elements with the 'kb-inject' attribute and create/customizes ViewModels for the DOM tree when encountered. Also, used with the data-bind `inject` custom binding.
#   @return [Array] array of Objects with the DOM elements and ViewModels that were bound in the form `{el: DOM element, view_model: ViewModel}`.
#   @note For both the `'kb-inject'` attribute and the data-bind `'inject'` custom binding, the following properties are reserved: `'view_model'` class used to create a new ViewModel instance, `'create'` function used to manually add observables to a view model, `'options'` to pass to ko.applyBindings, `'afterBinding'` callback (can alternatively be in the options), `'beforeBinding'` callback (can alternatively be in the options). Each function/constructor gets called with the following signature `'function(view_model, element)'`.
#   @example Bind your application automatically when the DOM is loaded.
#     <div kb-inject><span data-bind="text: 'Hello World!'"></span></div>
#   @example Bind your application with properties.
#     <div kb-inject="message: ko.observable('Hello World!')"><input data-bind="value: message"></input></div>
#   @example Bind your application creating a specific ViewModel instance when the DOM is loaded.
#     <div kb-inject="MyViewModel"><input data-bind="value: message"></input></div>
#     var MyViewModel = function(view_model, el) {
#       this.message = ko.observable('Hello World!');
#     }
#   @example Bind your application using a function when the DOM is loaded (like Angular.js controllers).
#     <div kb-inject="create: MyController"><input data-bind="value: message"></input></div>
#     var MyController = function(view_model, el) {
#       view_model.message = ko.observable('Hello World!');
#     }
#   @example Bind your application with a specific ViewModel instance and a callback before and after the binding.
#     <div kb-inject="MyViewModel"><input data-bind="value: message"></input></div>
#     var MyViewModel = function(view_model, el) {
#       this.message = ko.observable('Hello World!');
#       this.beforeBinding = function() {alert('before'); };
#       this.afterBinding = function() {alert('after'); };
#     }
#   @example Dynamically inject new properties into your ViewModel.
#     <div kb-inject="MyViewModel">
#       <div class="control-group" data-bind="inject: {site: ko.observable('http://your.url.com')}">
#         <label>Website</label>
#         <input type="url" name="site" data-bind="value: site, valueUpdate: 'keyup'" required>
#       </div>
#     </div>
#     var MyViewModel = function(view_model, el) {
#       // site will be dynamically attached to this ViewModel
#     }
#   @example Dynamically bind a form.
#     <div kb-inject="MyViewModel">
#        <form name="my_form" data-bind="inject: kb.formValidator">
#          <div class="control-group">
#           <label>Name</label>
#           <input type="text" name="name" data-bind="value: name, valueUpdate: 'keyup'" required>
#         </div>
#         <div class="control-group">
#           <label>Website</label>
#           <input type="url" name="site" data-bind="value: site, valueUpdate: 'keyup'" required>
#         </div>
#       </form>
#     </div>
#     var MyViewModel = kb.ViewModel.extend({
#       constructor: ->
#         model = new Backbone.Model({name: '', site: 'http://your.url.com'});
#         kb.ViewModel.prototype.constructor.call(this, model);
#     });
class kb

  # Knockback library semantic version
  @VERSION: '0.16.5'

  ####################################
  # OBSERVABLE STORAGE TYPES
  ####################################

  # Stored value type is not known like null/undefined (could be observed as a Backbone.Model or a Backbone.Collection or a simple type)
  @TYPE_UNKNOWN: 0
  # Stored value type is simple like a String or Number -> observable type: ko.observable
  @TYPE_SIMPLE: 1
  # Stored value type is an Array -> observable type: ko.observableArray
  @TYPE_ARRAY: 2
  # Stored value type is a Backbone.Model -> observable type: ViewModel
  @TYPE_MODEL: 3
  # Stored value type is a Backbone.Collection -> observable type: kb.CollectionObservable
  @TYPE_COLLECTION: 4

  # Releases any type of view model or observable or items in an array using the conventions of release(), destroy(), dispose().
  # @param [Any] obj the object to release and also release its keys
  # @param [Function] pre_release_fn an optional function to clear the key on the object before the key's value is released. Used by kb.releaseKeys.
  #
  # @example
  #   var view_model = kb.viewModel(model);
  #   kb.utils.release(view_model); view_model = null;
  # @example
  #   var todos = kb.collectionObservable(collection);
  #   kb.utils.release(todos); todos = null;
  @release = (obj, pre_release_fn) ->
    if (
      (not obj or (obj isnt Object(obj))) or # must be an object
      ((typeof(obj) is 'function') and not ko.isObservable(obj)) or # not a simple function
      obj.__kb_destroyed or # already destroyed
      ((obj instanceof Backbone.Model) or (obj instanceof Backbone.Collection)) # not a model or collection
    )
      return @

    # release array
    if _.isArray(obj)
      array = obj.splice(0, obj.length)
      kb.release(item) for item in array
      return @

    # release object
    obj.__kb_destroyed = true
    not pre_release_fn or pre_release_fn()

    # observable or lifecycle managed
    if ko.isObservable(obj) or (typeof(obj.dispose) is 'function') or (typeof(obj.destroy) is 'function') or (typeof(obj.release) is 'function')
      if ko.isObservable(obj) and _.isArray(array = obj())
        if obj.__kb_is_co or (obj.__kb_is_o and (obj.valueType() is KB_TYPE_COLLECTION))
          if obj.destroy
            obj.destroy()
          else if obj.dispose # we may be releasing our observable
            obj.dispose()
        else if array.length
          view_models = array.slice(0)
          array.splice(0, array.length)
          kb.release(view_model) for view_model in view_models
      else if obj.release
        obj.release()
      else if obj.destroy
        obj.destroy()
      else if obj.dispose
        obj.dispose()

    # view model
    else
      @releaseKeys(obj)

    return @

  # Releases and clears all of the keys on an object using the conventions of release(), destroy(), dispose() without releasing the top level object itself.
  @releaseKeys = (obj) ->
    for key, value of obj
      (key is '__kb') or kb.release(value, (-> obj[key] = null))
    return @

  # Binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
  # ```
  # ko.utils.domNodeDisposal.addDisposeCallback(node, function() { kb.release(view_model)} );
  # ```
  # @example The hard way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
  #   var el = $('<div data-bind="name: name"></div>')[0];
  #   var view_model = kb.viewModel(new Backbone.Model({name: 'Bob'}));
  #   ko.applyBindings(view_model, el);
  #   kb.releaseOnNodeRemove(view_model, el);
  #   ...
  #   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)
  @releaseOnNodeRemove = (view_model, node) ->
    view_model or throwUnexpected(@, 'missing view model')
    node or throwUnexpected(@, 'missing node')
    ko.utils.domNodeDisposal.addDisposeCallback(node, -> kb.release(view_model))

  # Renders a template and binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
  #
  # @example The easy way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
  #   var el = kb.renderTemplate('my_template', kb.viewModel(new Backbone.Model({name: 'Bob'})));
  #   ...
  #   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)
  @renderTemplate = (template, view_model, options={}) ->
    el = document.createElement('div')
    observable = ko.renderTemplate(template, view_model, options, el, 'replaceChildren');
    el = el.children[0] if el.children.length is 1 # do not return the template wrapper if possible
    kb.releaseOnNodeRemove(view_model, el)
    observable.dispose() # we will handle memory management with ko.removeNode (otherwise creates memory leak on default bound dispose function)
    return el

  # @deprecated Use kb.renderTemplate
  @renderAutoReleasedTemplate = (template, view_model, options={}) ->
    legacyWarning('kb.renderAutoReleasedTemplate', '0.16.3', 'Please use kb.renderTemplate instead')
    @renderTemplate(template, view_model, options={})

  # Applies bindings and binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
  #
  # @example The easy way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
  #   var el = $('<div data-bind="name: name"></div>')[0];
  #   kb.applyBindings(kb.viewModel(new Backbone.Model({name: 'Bob'})), el);
  #   ...
  #   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)
  @applyBindings = (view_model, node) ->
    ko.applyBindings(view_model, node)
    kb.releaseOnNodeRemove(view_model, node)

####################################
# Module
####################################
# export Knockback and kb namespcaes globally and to modules
@Knockback = @kb = kb; module.exports = kb if (typeof(exports) isnt 'undefined')

# import and re-export Underscore (or Lo-Dash with precedence), Backbone, and Knockout
if not @_ and (typeof(require) isnt 'undefined') then (try _ = require('lodash') catch e then _ = require('underscore')) else _ = @_
kb._ = _ = if _.hasOwnProperty('_') then _._ else _ # LEGACY
kb.Backbone = Backbone = if not @Backbone and (typeof(require) isnt 'undefined') then require('backbone') else @Backbone
kb.ko = ko = if not @ko and (typeof(require) isnt 'undefined') then require('knockout') else @ko

####################################
# INTERNAL HELPERS
####################################
throwMissing = (instance, message) -> throw "#{if _.isString(instance) then instance else instance.constructor.name}: #{message} is missing"
throwUnexpected = (instance, message) -> throw "#{if _.isString(instance) then instance else instance.constructor.name}: #{message} is unexpected"

legacyWarning = (identifier, last_version, message) ->
  @_legacy_warnings or= {}
  @_legacy_warnings[identifier] or= 0
  @_legacy_warnings[identifier]++
  console.warn("warning: '#{identifier}' has been deprecated (will be removed in Knockback after #{last_version}). #{message}.")

arraySplice = Array.prototype.splice

collapseOptions = (options) ->
  result = _.clone(options)
  while options.options
    _.defaults(result, options.options)
    options = options.options
  delete result.options
  return result

####################################
# OBSERVABLE STORAGE TYPES
####################################

# constants optimized for internal minimization
KB_TYPE_UNKNOWN = kb.TYPE_UNKNOWN
KB_TYPE_SIMPLE = kb.TYPE_SIMPLE
KB_TYPE_ARRAY = kb.TYPE_ARRAY
KB_TYPE_MODEL = kb.TYPE_MODEL
KB_TYPE_COLLECTION = kb.TYPE_COLLECTION