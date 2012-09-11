###
  knockback-inject.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Inject is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# Helpers for building single page apps using injection.
#
# @example Create an embedded app.
#   TODO
#

ko.bindingHandlers['inject'] =
  'init': (element, value_accessor, all_bindings_accessor, view_model) ->
    data = ko.utils.unwrapObservable(value_accessor())
    # wrap to avoid dependencies propagating to the template
    wrapper = ko.dependentObservable(->
      if _.isFunction(data)
        data(view_model, element, value_accessor, all_bindings_accessor)
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
    if el.attributes and (attr = _.find(el.attributes, (attr)-> attr.name is 'kb-app'))
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

(onReady = ->
  return setTimeout(onReady, 1) unless document.body # keep waiting
  kb.injectApps()
  return
)()