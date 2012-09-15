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
    kb.inject(ko.utils.unwrapObservable(value_accessor()), view_model, element, value_accessor, all_bindings_accessor)

# inject
kb.inject = (data, view_model, element, value_accessor, all_bindings_accessor) ->
  # wrap to avoid dependencies propagating to the template
  wrapper = ko.dependentObservable(->
    if _.isFunction(data)
      result = new data(view_model, element, value_accessor, all_bindings_accessor) # use 'new' to allow for classes in addition to functions
    else
      for key, value of data

        # view_model function
        if (key is 'view_model')
          # constructor
          if _.isFunction(value)
            result = view_model[key] = new value(view_model, element, value_accessor, all_bindings_accessor)

          # mixin
          else
            kb.inject(value, view_model, element, value_accessor, all_bindings_accessor)

        # create function
        else if (key is 'create')
          value(view_model, element, value_accessor, all_bindings_accessor)

        # resolve nested
        else if _.isObject(value) and not _.isFunction(value)
            view_model[key] = kb.inject(value, view_model, element, value_accessor, all_bindings_accessor)

        # simple set
        else
            view_model[key] = value
    return result or view_model
  )
  result = wrapper()
  wrapper.dispose() # done with the wrapper
  return result

# inject apps only once if they exist
kb.injectApps = (root) ->
  # helper
  getAppElements = (el) ->
    unless el.__kb_injected # already injected -> skip, but still process children in case they were added afterwards
      if el.attributes and (attr = _.find(el.attributes, (attr)-> attr.name is 'kb-app'))
        el.__kb_injected = true # mark injected
        apps.push({el: el, view_model: {}, binding: attr.value})
    getAppElements(child_el) for child_el in el.childNodes
    return

  # helper from Knockout.js (function gets lost in minimization): http://knockoutjs.com/
  buildEvalWithinScopeFunction = (expression, scopeLevels) ->
    functionBody = "return ( #{expression} )"
    i = -1
    while (++i < scopeLevels)
      functionBody = "with(sc[#{i}]) { #{functionBody} }"
    return new Function("sc", functionBody)

  # find all of the app elements
  apps = []
  getAppElements(root or document)

  # create the apps
  for app in apps
    # evaluate the app data
    if expression = app.binding
      (expression.search(/[:]/) < 0) or (expression = "{#{expression}}") # wrap if is an object
      data = buildEvalWithinScopeFunction(expression, 0)()
      data or (data = {}) # no data
      (not data.options) or (options = data.options; delete data.options) # extract options
      app.view_model = kb.inject(data, app.view_model, app.el, null, null)

    # auto-bind
    options.beforeBinding(app.view_model, app.el, options) if options and options.beforeBinding
    kb.applyBindings(app.view_model, app.el, options)
    options.afterBinding(app.view_model, app.el, options) if options and options.afterBinding
  return apps

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