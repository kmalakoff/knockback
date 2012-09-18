###
  knockback-inject.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Inject is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

ko.bindingHandlers['inject'] =
  'init': (element, value_accessor, all_bindings_accessor, view_model) ->
    kb.inject(ko.utils.unwrapObservable(value_accessor()), view_model, element, value_accessor, all_bindings_accessor)

# inject data
kb.inject = (data, view_model, element, value_accessor, all_bindings_accessor, nested) ->
  inject = (data) ->
    if _.isFunction(data)
      view_model = new data(view_model, element, value_accessor, all_bindings_accessor) # use 'new' to allow for classes in addition to functions
      kb.releaseOnNodeRemove(view_model, element)
    else
      # view_model constructor causes a scope change
      if (data.view_model)
        # specifying a view_model changes the scope so we need to bind a destroy
        view_model = new data.view_model(view_model, element, value_accessor, all_bindings_accessor)
        kb.releaseOnNodeRemove(view_model, element)

      # resolve and merge in each key
      for key, value of data
        continue if (key is 'view_model')

        # create function
        if (key is 'create')
          value(view_model, element, value_accessor, all_bindings_accessor)

        # resolve nested with assign or not
        else if _.isObject(value) and not _.isFunction(value)
          target = if nested or (value and value.create) then {} else view_model
          view_model[key] = kb.inject(value, target, element, value_accessor, all_bindings_accessor, true)

        # simple set
        else
          view_model[key] = value

    return view_model

  # in recursive calls, we are already protected from propagating dependencies to the template
  if nested
    return inject(data)

  # wrap to avoid dependencies propagating to the template since we are editing a ViewModel not binding
  else
    result = (wrapper = ko.dependentObservable(-> inject(data)))()
    wrapper.dispose() # done with the wrapper
    return result

# inject ViewModels only once if they exist
kb.injectViewModels = (root) ->
  # find all of the app elements
  results = []
  findElements = (el) ->
    unless el.__kb_injected # already injected -> skip, but still process children in case they were added afterwards
      if el.attributes and (attr = _.find(el.attributes, (attr)-> attr.name is 'kb-inject'))
        el.__kb_injected = true # mark injected
        results.push({el: el, view_model: {}, binding: attr.value})
    findElements(child_el) for child_el in el.childNodes
    return
  findElements(root or document)

  # bind the view models
  for app in results
    # evaluate the app data
    if expression = app.binding
      (expression.search(/[:]/) < 0) or (expression = "{#{expression}}") # wrap if is an object
      data = (new Function("", "return ( #{expression} )"))()
      data or (data = {}) # no data
      (not data.options) or (options = data.options; delete data.options) # extract options
      options or (options={})
      app.view_model = kb.inject(data, app.view_model, app.el, null, null, true)
      afterBinding = app.view_model.afterBinding or options.afterBinding
      beforeBinding = app.view_model.beforeBinding or options.beforeBinding

    # auto-bind
    beforeBinding(app.view_model, app.el, options) if beforeBinding
    kb.applyBindings(app.view_model, app.el, options)
    afterBinding(app.view_model, app.el, options) if afterBinding
  return results

#############################
# Auto Inject results
#############################
# use DOM library ready function
if @$
  @$(->kb.injectViewModels())

# use simple ready check
else
  (onReady = ->
    # keep waiting for the document to load
    return setTimeout(onReady, 0) unless document.readyState is "complete"

    # the document is loaded
    kb.injectViewModels()
  )()