###
  knockback-inject.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Inject is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# Helpers for building single page apps using injection.
#
# @example Auto binding using kb-app attribute.
#   TODO
#
# @example Injecting by view model.
#   TODO
#
# @example Injecting by function.
#   TODO
#
# @example Injecting with resolve.
#   TODO
#
ko.bindingHandlers['inject'] =
  'init': (element, value_accessor, all_bindings_accessor, view_model) ->
    data = ko.utils.unwrapObservable(value_accessor())
    # wrap to avoid dependencies propagating to the template
    wrapper = ko.dependentObservable(->
      if _.isFunction(data)
        new data(view_model, element, value_accessor, all_bindings_accessor) # use 'new' to allow for classes in addition to functions
      else if _.isObject(data)
        for key, value of data
          # resolve like a function
          if _.isObject(value) and value.resolve and _.isFunction(value.resolve)
            view_model[key] = value.resolve(view_model, element, value_accessor, all_bindings_accessor)
          else
            view_model[key] = value
    )
    wrapper.dispose() # done with the wrapper

# bind app if it exists after the document body has been loaded
kb.injectApps = (root) ->
  # find all of the app elements
  apps = []
  getAppElements = (el) ->
    unless el.__kb_injected # already injected -> skip, but still process children in case they were added afterwards
      if el.attributes and (attr = _.find(el.attributes, (attr)-> attr.name is 'kb-app'))
        el.__kb_injected = true # mark injected
        apps.push([el, attr])
    getAppElements(child_el) for child_el in el.childNodes
    return
  getAppElements(root or document)

  # create the apps
  for app in apps
    # evaluate the options
    if app[1].value
      options = ko.utils.buildEvalWithinScopeFunction("{#{app[1].value}}", 0)()
    options or= {}
    options.view_model or= {}

    options.beforeBinding(options.view_model, app[0], options) if options.beforeBinding
    kb.applyBindings(options.view_model, app[0], {})
    options.afterBinding(options.view_model, app[0], options) if options.afterBinding
  return

#############################
# Auto Inject Apps
#############################
# use DOM library ready function
if @$
  @$(->kb.injectApps())

# use simple ready check
else
  (onReady = ->
    # keep waiting for the document to load
    return setTimeout(onReady, 0) unless document.readyState is "complete"

    # the document is loaded
    kb.injectApps()
  )()