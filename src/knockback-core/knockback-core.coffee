###
  knockback.js 0.16.0beta3
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
###

class kb

  # Library version (semantic)
  @VERSION = '0.16.0beta3'

  # ViewModel lifecycle
  @release = (obj, preRelease) ->
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
      @releaseKeys(obj)

    return @

  @releaseKeys = (obj) ->
    for key, value of obj
      (key is '__kb') or kb.release(value, (-> obj[key] = null))
    return @

  # Node/element with bound ViewModel lifecycle
  @releaseOnNodeRemove = (view_model, node) ->
    view_model or throwUnexpected(@, 'missing view model')
    node or throwUnexpected(@, 'missing node')
    ko.utils.domNodeDisposal.addDisposeCallback(node, -> kb.release(view_model))

  @renderAutoReleasedTemplate = (template, view_model, options={}) ->
    el = document.createElement('div')
    observable = ko.renderTemplate(template, view_model, options, el, 'replaceChildren');
    el = el.children[0] if el.children.length is 1 # do not return the template wrapper if possible
    kb.releaseOnNodeRemove(view_model, el)
    observable.dispose() # we will handle memory management with ko.removeNode (otherwise creates memory leak on default bound dispose function)
    return el

  @applyBindings = (view_model, node) ->
    ko.applyBindings(view_model, node)
    kb.releaseOnNodeRemove(view_model, node)

####################################
# Module
####################################
# export Knockback and kb namespcaes globally and to modules
@Knockback = Knockback = @kb = kb; module.exports = kb if (typeof(exports) isnt 'undefined')

# import and re-export Underscore (or Lo-Dash with precedence), Backbone, and Knockout
if not @_ and (typeof(require) isnt 'undefined') then (try _ = require('lodash') catch e then _ = require('underscore')) else _ = @_
kb._ = _ = if _.hasOwnProperty('_') then _._ else _ # LEGACY
kb.Backbone = Backbone = if not @Backbone and (typeof(require) isnt 'undefined') then require('backbone') else @Backbone
kb.ko = ko = if not @ko and (typeof(require) isnt 'undefined') then require('knockout') else @ko

####################################
# INTERNAL HELPERS
####################################
throwMissing = (instance, message) -> throw "#{instance.constructor.name}: #{message} is missing"
throwUnexpected = (instance, message) -> throw "#{instance.constructor.name}: #{message} is unexpected"

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

# @constant
kb.TYPE_UNKNOWN = KB_TYPE_UNKNOWN = 0
kb.TYPE_SIMPLE = KB_TYPE_SIMPLE = 1
kb.TYPE_ARRAY = KB_TYPE_ARRAY = 2
kb.TYPE_MODEL = KB_TYPE_MODEL = 3
kb.TYPE_COLLECTION = KB_TYPE_COLLECTION = 4