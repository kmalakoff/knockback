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

_peekObservable = (obs) ->
  return obs unless ko.isObservable(obs)
  return obs.peek() if obs.peek
  return kb.utils.ignore -> obs()

_publishMethods = kb._publishMethods = (observable, instance, methods) ->
  observable[fn] = kb._.bind(instance[fn], instance) for fn in methods
  return

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