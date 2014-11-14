###
  knockback.js 0.20.5
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
###

window = if window? then window else global
ko = require 'knockout'

LIFECYCLE_METHODS = ['release', 'destroy', 'dispose']

# The 'kb' namespace for classes, factory functions, constants, etc. Aliased to 'Knockback'
#
# @method .collectionObservable(collection, options)
#   Factory to create a new kb.CollectionObservable. See {kb.CollectionObservable#constructor} for information on options
#   @param [Collection] collection the collection to observe (can be null)
#   @param [Object] options the create options
#   @return [ko.observableArray] the constructor does not return 'this' but a ko.observableArray
#
# @method .observable(model, options, view_model)
#   Factory to create a new kb.Observable. See {kb.Observable#constructor} for information on options
#   @param [Model] model the model to observe (can be null)
#   @param [String|Array|Object] options the create options. String is a single attribute name, Array is an array of attribute names.
#   @return [ko.observable] the constructor does not return 'this' but a ko.observable
#
# @method .viewModel(model, options, view_model)
#   Factory to create a new kb.ViewModel. See {kb.ViewModel#constructor} for information on options
#   @param [Model|ModelRef] model the model to observe (can be null)
#   @param [Object] options the create options
#   @return [ko.observable] the constructor returns 'this'
#
# @method .defaultObservable(target, default_value)
#   Factory to create a new kb.DefaultObservable. See {kb.DefaultObservable#constructor} for information on options. If you are using knockback-core or knockback-core-stack, you can include this from the lib/knockback-defaults component.
#   @param [ko.observable] target_observable the observable to check for null, undefined, or the empty string
#   @param [Any] default_value the default value. Can be a value, string or ko.observable
#   @return [ko.observable] the constructor does not return 'this' but a ko.observable
#
# @method .formattedObservable(format, arg1, arg2, etc)
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
module.exports = class kb

  # Knockback library semantic version
  @VERSION: '0.20.5'

  ####################################
  # OBSERVABLE STORAGE TYPES
  ####################################

  # Stored value type is not known like null/undefined (could be observed as a Model or a Collection or a simple type)
  @TYPE_UNKNOWN: 0
  # Stored value type is simple like a String or Number -> observable type: ko.observable
  @TYPE_SIMPLE: 1
  # Stored value type is an Array -> observable type: ko.observableArray
  @TYPE_ARRAY: 2
  # Stored value type is a Model -> observable type: ViewModel
  @TYPE_MODEL: 3
  # Stored value type is a Collection -> observable type: kb.CollectionObservable
  @TYPE_COLLECTION: 4

  # Checks if an object has been released.
  # @param [Any] obj the object to release and also release its keys
  @wasReleased: (obj) -> return not obj or obj.__kb_released

  # Checks if an object can be released. Used to perform minimal nested releasing on objects by checking if self or next level contained items can be released.
  # @param [Any] obj the object to release and also release its keys
  @isReleaseable: (obj, depth=0) ->
    return false if (not obj or (obj isnt Object(obj))) or obj.__kb_released # must be an object and not already released
    return true if ko.isObservable(obj) or (obj instanceof kb.ViewModel) # a known type that is releasable
    return false if (typeof(obj) is 'function') or kb.isModel(obj) or kb.isCollection(obj) # a known type that is not releaseable
    return true for method in LIFECYCLE_METHODS when typeof(obj[method]) is 'function' # a releaseable signature
    return false if depth > 0 # max depth check for ViewModel inside of ViewModel
    return true for key, value of obj when (key isnt '__kb') and kb.isReleaseable(value, depth+1)
    return false

  # Releases any type of view model or observable or items in an array using the conventions of release(), destroy(), dispose().
  # @param [Any] obj the object to release and also release its keys
  #
  # @example
  #   var view_model = kb.viewModel(model);
  #   kb.release(view_model); view_model = null;
  # @example
  #   var todos = kb.collectionObservable(collection);
  #   kb.release(todos); todos = null;
  @release: (obj) ->
    return unless kb.isReleaseable(obj)
    obj.__kb_released = true # mark as released

    # release array's items
    if _.isArray(obj)
      (obj[index] = null; kb.release(value)) for index, value of obj when kb.isReleaseable(value)
      return

    # observable or lifecycle managed
    if ko.isObservable(obj) and _.isArray(array = kb.peek(obj))
      return obj.destroy?() if obj.__kb_is_co or (obj.__kb_is_o and (obj.valueType() is kb.TYPE_COLLECTION))
      (array[index] = null; kb.release(value)) for index, value of array when kb.isReleaseable(value)
      obj.dispose() if typeof(obj.dispose) is 'function'
      return

    # releaseable signature
    return obj[method].call(obj) for method in LIFECYCLE_METHODS when typeof(obj[method]) is 'function' # a releaseable signature
    return @releaseKeys(obj) unless ko.isObservable(obj) # view model
    return

  # Releases and clears all of the keys on an object using the conventions of release(), destroy(), dispose() without releasing the top level object itself.
  @releaseKeys: (obj) ->
    (obj[key] = null; kb.release(value)) for key, value of obj when key isnt '__kb' and kb.isReleaseable(value)
    return

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
  @releaseOnNodeRemove: (view_model, node) ->
    view_model or kb._throwUnexpected(@, 'missing view model')
    node or kb._throwUnexpected(@, 'missing node')
    ko.utils.domNodeDisposal.addDisposeCallback(node, -> kb.release(view_model))

  # Renders a template and binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
  #
  # NOTE: if you provide an afterRender method on the View Model and do not provide afterRender in the options, afterRender will be called with the following signature: afterRender(element) which differs from the Knockout signture of afterRender(elements)
  #
  # @example The easy way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
  #   var el = kb.renderTemplate('my_template', kb.viewModel(new Backbone.Model({name: 'Bob'})));
  #   ...
  #   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)
  @renderTemplate: (template, view_model, options={}) ->
    return console?.log 'renderTemplate: document is undefined' unless document = window?.document

    el = document.createElement('div')
    observable = ko.renderTemplate(template, view_model, options, el, 'replaceChildren');
    if el.childNodes.length is 1 # do not return the template wrapper if possible
      el = el.childNodes[0]
    else if el.childNodes.length
      ko.storedBindingContextForNode(el, ko.contextFor(el.childNodes[0])) # ensure the context is passed up to wrapper
    kb.releaseOnNodeRemove(view_model, el)
    observable.dispose() # we will handle memory management with ko.removeNode (otherwise creates memory leak on default bound dispose function)

    view_model.afterRender(el) if view_model.afterRender and not options.afterRender # call afterRender for custom setup unless provided in options (so doesn't get double called)
    return el

  # Applies bindings and binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
  #
  # @example The easy way to set up automatic calling of 'kb.release(view_model)' when the bound element is released.
  #   var el = $('<div data-bind="name: name"></div>')[0];
  #   kb.applyBindings(kb.viewModel(new Backbone.Model({name: 'Bob'})), el);
  #   ...
  #   ko.removeNode(el); // removes el from the DOM and calls kb.release(view_model)
  @applyBindings: (view_model, node) ->
    if node.length # convert to a root element
      [node, children] = [document.createElement('div'), node]
      node.appendChild(child) for child in children
    ko.applyBindings(view_model, node)
    kb.releaseOnNodeRemove(view_model, node)
    return node

  @getValue: (model, key, args) ->
    return unless model
    return model[key]() if _.isFunction(model[key]) and kb.orm?.useFunction(model, key)
    return model.get(key) unless args
    model.get.apply(model, _.map([key].concat(args), (value) -> kb.peek(value)))

  @setValue: (model, key, value) ->
    return unless model
    return model[key](value) if _.isFunction(model[key]) and kb.orm?.useFunction(model, key)
    (attributes = {})[key] = value
    model.set(attributes)

  # Helper to ignore dependencies in a function
  #
  # @param [Object] obj the object to test
  #
  # @example
  #   kb.ignore(fn);
  @ignore = ko.dependencyDetection?.ignore or (callback, callbackTarget, callbackArgs) -> value = null; ko.computed(-> value = callback.apply(callbackTarget, callbackArgs || [])).dispose(); return value

  ####################################
  # INTERNAL HELPERS
  ####################################
  # @nodoc
  @extend = require './functions/extend'

  # @nodoc
  @_throwMissing: (instance, message) -> throw "#{if _.isString(instance) then instance else instance.constructor.name}: #{message} is missing"

  # @nodoc
  @_throwUnexpected: (instance, message) -> throw "#{if _.isString(instance) then instance else instance.constructor.name}: #{message} is unexpected"

  # @nodoc
  @publishMethods: (observable, instance, methods) -> observable[fn] = kb._.bind(instance[fn], instance) for fn in methods; return

  # @nodoc
  @peek: (obs) -> return obs unless ko.isObservable(obs); return obs.peek() if obs.peek; return kb.ignore -> obs()

  # @nodoc
  @isModel: (obj) -> obj and ((obj instanceof kb.Model) or ((typeof(obj.get) is 'function') and (typeof(obj.bind) is 'function')))

  # @nodoc
  @isCollection: (obj) -> obj and (obj instanceof kb.Collection)

if window.Parse
  Backbone = kb.Parse = window.Parse
  _ = kb._ = window.Parse._
else
  Backbone = kb.Backbone = require 'backbone'
  _ = kb._ = require 'underscore'
kb.ko = ko

# cache local references
kb.Collection = Backbone.Collection
kb.Model = Backbone.Object or Backbone.Model
kb.Events = Backbone.Events

kb.$ = window.jQuery or window.$
try kb.$ or= require 'jquery' # webpack optionals
