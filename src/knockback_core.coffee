###
  knockback.js 0.16.0beta2
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
###

# export or create Knockback namespace and kb alias
Knockback = kb = @Knockback = @kb = if (typeof(exports) != 'undefined') then exports else {}
kb.VERSION = '0.16.0beta2'

####################################
# import Underscore (or Lo-Dash with precedence), Backbone, and Knockout
####################################
if (typeof(require) != 'undefined') then (try _ = require('lodash') catch e then _ = require('underscore')) else _ = @_
_ = _._ if _ and _.hasOwnProperty('_') # LEGACY
kb._ = _
kb.Backbone = Backbone = if not @Backbone and (typeof(require) != 'undefined') then require('backbone') else @Backbone
kb.ko = ko = if not @ko and (typeof(require) != 'undefined') then require('knockout') else @ko

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
throwMissing = (instance, message) -> throw "#{instance.constructor.name}: #{message} is missing"
throwUnexpected = (instance, message) -> throw "#{instance.constructor.name}: #{message} is unexpected"

legacyWarning = (identifier, last_version, message) ->
  kb._legacy_warnings or= {}
  kb._legacy_warnings[identifier] or= 0
  kb._legacy_warnings[identifier]++
  console.warn("warning: '#{identifier}' has been deprecated (will be removed in Knockback after #{last_version}). #{message}.")

arraySlice = Array.prototype.slice
arraySplice = Array.prototype.splice

collapseOptions = (options) ->
  result = _.clone(options)
  while options.options
    _.defaults(result, options.options)
    options = options.options
  delete result.options
  return result

####################################
# LifeCycle Management
####################################
kb.renderAutoReleasedTemplate = (template, view_model, options={}) ->
  el = document.createElement('div')
  observable = ko.renderTemplate(template, view_model, options, el, 'replaceChildren');
  el = el.children[0] if el.children.length is 1 # do not return the template wrapper if possible
  kb.releaseOnNodeRemove(view_model, el)
  observable.dispose() # we will handle memory management with ko.removeNode (otherwise creates memory leak on default bound dispose function)
  return el

kb.releaseOnNodeRemove = (view_model, node) ->
  view_model or throwUnexpected(@, 'missing view model')
  node or throwUnexpected(@, 'missing node')
  ko.utils.domNodeDisposal.addDisposeCallback(node, -> kb.release(view_model))

kb.applyBindings = (view_model, node, skip_auto) ->
  ko.applyBindings(view_model, node)
  kb.releaseOnNodeRemove(view_model, node) if (arguments.length is 2) or not skip_auto

kb.release = (obj, preRelease) ->
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
    kb.releaseKeys(obj)

  return @

kb.releaseKeys = (obj) ->
  for key, value of obj
    (key is '__kb') or kb.release(value, (-> obj[key] = null))
  return @

####################################
# Localization
####################################
# Locale Manager - if you are using localization, set this property.
# It must have Backbone.Events mixed in and implement a get method like Backbone.Model, eg. get: (attribute_name) -> return somthing
kb.locale_manager = undefined
