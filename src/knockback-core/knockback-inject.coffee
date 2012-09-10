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

ko.bindingHandlers['kb-inject'] =
  'init': (element, value_accessor, all_bindings_accessor, view_model) ->
    data = ko.utils.unwrapObservable(value_accessor())
    # wrap to avoid dependencies propagating to the template
    ko.computed(->
      if _.isFunction(data)
        data(view_model, element, value_accessor, all_bindings_accessor)
      else if _.isObject(data)
        _.extend(view_model, data)
    )

# bind app if it exists after the document body has been loaded
kb.injectApps = (root) ->
  # find all of the app elements
  app_els = []
  getAppElements = (el) ->
    app_els.push(el) if el.attributes and _.find(el.attributes, (attr)-> attr.name is 'kb-app')
    getAppElements(child_el) for child_el in el.childNodes
    return
  getAppElements(root or document)

  # bind the apps
  kb.applyBindings({}, app_el) for app_el in app_els
  return

(onReady = ->
  return setTimeout(onReady, 1) unless document.body # keep waiting
  kb.injectApps()
  return
)()