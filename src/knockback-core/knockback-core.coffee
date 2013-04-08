###
  knockback-core.js 0.17.2
  (c) 2011-2013 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
###

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
class kb

  # Knockback library semantic version
  @VERSION: '0.17.2'

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
  @wasReleased = (obj) -> return not obj or obj.__kb_released

  # Checks if an object can be released. Used to perform minimal nested releasing on objects by checking if self or next level contained items can be released.
  # @param [Any] obj the object to release and also release its keys
  @isReleaseable = (obj, depth=0) ->
    # must be an object and not already released
    if (not obj or (obj isnt Object(obj))) or obj.__kb_released
      return false

    # a known type that is releasable
    else if ko.isObservable(obj) or (obj instanceof kb.ViewModel)
      return true

    # a known type that is not releaseable
    else if (typeof(obj) is 'function') or (obj instanceof kb.Model) or (obj instanceof kb.Collection)
      return false

    # a releaseable signature
    else if (typeof(obj.dispose) is 'function') or (typeof(obj.destroy) is 'function') or (typeof(obj.release) is 'function')
      return true

    # max depth check for ViewModel inside of ViewModel
    else if depth < 1
      for key, value of obj
        return true if (key isnt '__kb') and kb.isReleaseable(value, depth+1)

    return false

  # Releases any type of view model or observable or items in an array using the conventions of release(), destroy(), dispose().
  # @param [Any] obj the object to release and also release its keys
  #
  # @example
  #   var view_model = kb.viewModel(model);
  #   kb.utils.release(view_model); view_model = null;
  # @example
  #   var todos = kb.collectionObservable(collection);
  #   kb.utils.release(todos); todos = null;
  @release = (obj) ->
    return unless kb.isReleaseable(obj)

    # release array's items
    if _.isArray(obj)
      ((obj[index] = null; kb.release(value)) if kb.isReleaseable(value)) for index, value of obj
      return

    obj.__kb_released = true # mark as released

    # observable or lifecycle managed
    if ko.isObservable(obj) and _.isArray(array = obj())
      if obj.__kb_is_co or (obj.__kb_is_o and (obj.valueType() is KB_TYPE_COLLECTION))
        if obj.destroy
          obj.destroy()
        else if obj.dispose # we may be releasing our observable
          obj.dispose()
      else if array.length
        ((array[index] = null; kb.release(value)) if kb.isReleaseable(value)) for index, value of array

    # releaseable signature
    else if (typeof(obj.release) is 'function')
      obj.release()
    else if (typeof(obj.destroy) is 'function')
      obj.destroy()
    else if (typeof(obj.dispose) is 'function')
      obj.dispose()

    # view model
    else if not ko.isObservable(obj)
      @releaseKeys(obj)

    return

  # Releases and clears all of the keys on an object using the conventions of release(), destroy(), dispose() without releasing the top level object itself.
  @releaseKeys = (obj) ->
    ((obj[key] = null; kb.release(value)) if (key isnt '__kb') and kb.isReleaseable(value)) for key, value of obj
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
  @releaseOnNodeRemove = (view_model, node) ->
    view_model or _throwUnexpected(@, 'missing view model')
    node or _throwUnexpected(@, 'missing node')
    ko.utils.domNodeDisposal.addDisposeCallback(node, -> kb.release(view_model))

  # Renders a template and binds a callback to the node that releases the view model when the node is removed using ko.removeNode.
  #
  # NOTE: if you provide an afterRender method on the View Model and do not provide afterRender in the options, afterRender will be called with the following signature: afterRender(element) which differs from the Knockout signture of afterRender(elements)
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

    view_model.afterRender(el) if view_model.afterRender and not options.afterRender # call afterRender for custom setup unless provided in options (so doesn't get double called)
    return el

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

# use Parse
if (@Parse)
  kb._ = _ = @Parse._
  kb.Parse = @Parse
  kb.Collection = @Parse.Collection
  kb.Model = @Parse.Object
  kb.Events = @Parse.Events
else
  # import and re-export Underscore (or Lo-Dash with precedence), Backbone, and Knockout
  if not @_ and (typeof(require) isnt 'undefined') then (try _ = require('lodash') catch e then _ = require('underscore')) else _ = @_
  kb._ = _ = if _.hasOwnProperty('_') then _._ else _ # LEGACY
  _.mixin({findWhere: (obj, attrs) -> result = _.where(obj, attrs); if result.length then result[0] else null}) if _.where and not _.findWhere # PATCH: lo-dash REMOVE AFTER _.findWhere IS ADDED
  kb.Backbone = if not @Backbone and (typeof(require) isnt 'undefined') then require('backbone') else @Backbone
  kb.Collection = kb.Backbone.Collection
  kb.Model = kb.Backbone.Model
  kb.Events = kb.Backbone.Events
kb.ko = ko = if not @ko and (typeof(require) isnt 'undefined') then require('knockout') else @ko

####################################
# INTERNAL HELPERS
####################################
_throwMissing = (instance, message) -> throw "#{if _.isString(instance) then instance else instance.constructor.name}: #{message} is missing"
_throwUnexpected = (instance, message) -> throw "#{if _.isString(instance) then instance else instance.constructor.name}: #{message} is unexpected"

_legacyWarning = (identifier, last_version, message) ->
  @_legacy_warnings or= {}
  @_legacy_warnings[identifier] or= 0
  @_legacy_warnings[identifier]++
  console.warn("warning: '#{identifier}' has been deprecated (will be removed in Knockback after #{last_version}). #{message}.")

_arraySplice = Array.prototype.splice

_unwrapObservable = ko.utils.unwrapObservable

collapseOptions = (options) ->
  result = _.clone(options)
  while options.options
    _.defaults(result, options.options)
    options = options.options
  delete result.options
  return result

# From Backbone.js (https:github.com/documentcloud/backbone)
copyProps = (dest, source) ->
  (dest[key] = value) for key, value of source
  return dest

`// Shared empty constructor function to aid in prototype-chain creation.
var ctor = function(){};

// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to 'goog.inherits', but uses a hash of prototype properties and
// class properties to be extended.
var inherits = function(parent, protoProps, staticProps) {
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your extend definition), or defaulted
  // by us to simply call the parent's constructor.
  if (protoProps && protoProps.hasOwnProperty('constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ parent.apply(this, arguments); };
  }

  // Inherit class (static) properties from parent.
  copyProps(child, parent);

  // Set the prototype chain to inherit from parent, without calling
  // parent's constructor function.
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) copyProps(child.prototype, protoProps);

  // Add static properties to the constructor function, if supplied.
  if (staticProps) copyProps(child, staticProps);

  // Correctly set child's 'prototype.constructor'.
  child.prototype.constructor = child;

  // Set a convenience property in case the parent's prototype is needed later.
  child.__super__ = parent.prototype;

  return child;
};

// The self-propagating extend function that BacLCone classes use.
var extend = function (protoProps, classProps) {
  var child = inherits(this, protoProps, classProps);
  child.extend = this.extend;
  return child;
};
`
kb.extend = extend

####################################
# OBSERVABLE STORAGE TYPES
####################################

# constants optimized for internal minimization
KB_TYPE_UNKNOWN = kb.TYPE_UNKNOWN
KB_TYPE_SIMPLE = kb.TYPE_SIMPLE
KB_TYPE_ARRAY = kb.TYPE_ARRAY
KB_TYPE_MODEL = kb.TYPE_MODEL
KB_TYPE_COLLECTION = kb.TYPE_COLLECTION