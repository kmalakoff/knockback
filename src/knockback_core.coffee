###
  knockback.js 0.16.0beta2
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
###

# import Underscore (or Lo-Dash with precedence), Backbone, and Knockout
if (typeof(require) != 'undefined') then (try _ = require('lodash') catch e then _ = require('underscore')) else _ = @_
_ = _._ if _ and (_.hasOwnProperty('_')) # LEGACY
Backbone = if not @Backbone and (typeof(require) != 'undefined') then require('backbone') else @Backbone
ko = if not @ko and (typeof(require) != 'undefined') then require('knockout') else @ko

# export or create Knockback namespace and kb alias
Knockback = kb = @Knockback = @kb = if (typeof(exports) != 'undefined') then exports else {}
kb.VERSION = '0.16.0beta2'

####################################
# OBSERVABLE STORAGE TYPES
####################################
kb.TYPE_UNKNOWN = KB_TYPE_UNKNOWN = 0
kb.TYPE_SIMPLE = KB_TYPE_SIMPLE = 1
kb.TYPE_ARRAY = KB_TYPE_ARRAY = 2
kb.TYPE_MODEL = KB_TYPE_MODEL = 3
kb.TYPE_COLLECTION = KB_TYPE_COLLECTION = 4

####################################
# HELPERS
####################################
arraySlice = Array.prototype.slice
arraySplice = Array.prototype.splice
throwMissing = (instance, message) -> throw "#{instance.constructor.name}: #{message} is missing"
throwUnexpected = (instance, message) -> throw "#{instance.constructor.name}: #{message} is unexpected"

legacyWarning = (identifier, last_version, message) ->
  kb._legacy_warnings or= {}
  kb._legacy_warnings[identifier] or= 0
  kb._legacy_warnings[identifier]++
  console.warn("warning: '#{identifier}' has been deprecated (will be removed in Knockback after #{last_version}). #{message}.")

####################################
# Memory Management
####################################
kb.removeNode = ko.removeNode

kb.releaseOnRemoveNode = (view_model, node) ->
  view_model or throwUnexpected(@, 'missing view model')
  node or throwUnexpected(@, 'missing node')
  ko.utils.domNodeDisposal.addDisposeCallback(node, -> kb.release(view_model))

kb.applyBindings = (view_model, node, skip_auto) ->
  ko.applyBindings(view_model, node)
  kb.releaseOnRemoveNode(view_model, node) if (arguments.length is 2) or not skip_auto

kb.releaseKeys = (obj) ->
  for key, value of obj
    (key is '__kb') or kb.release(value, -> obj[key] = null)
  return

kb.release = (obj, preRelease) ->
  return if not obj or not _.isObject(obj) or obj.__kb_destroyed or (typeof(obj) is 'function' and not ko.isObservable(obj))
  obj.__kb_destroyed = true
  not preRelease or preRelease()

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
    for key, value of obj
      (key is '__kb') or kb.release(value, -> obj[key] = null)

  return

####################################
# Localization
####################################
# Locale Manager - if you are using localization, set this property.
# It must have Backbone.Events mixed in and implement a get method like Backbone.Model, eg. get: (attribute_name) -> return somthing
kb.locale_manager = undefined
