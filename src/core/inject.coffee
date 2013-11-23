###
  knockback-inject.js
  (c) 2011-2013 Kevin Malakoff.
  Knockback.Inject is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

kb.RECUSIVE_AUTO_INJECT = false # disable until bug resolved: https://github.com/kmalakoff/knockback/issues/63

# custom Knockout `inject` binding
ko.bindingHandlers['inject'] =
  'init': (element, value_accessor, all_bindings_accessor, view_model) ->
    kb.Inject.inject(_unwrapObservable(value_accessor()), view_model, element, value_accessor, all_bindings_accessor)

# Used to inject ViewModels and observables dynamically from your HTML Views. For both the `'kb-inject'` attribute and the data-bind `'inject'` custom binding, the following properties are reserved:
#
# * `'view_model'` class used to create a new ViewModel instance
# * `'create'` function used to manually add observables to a view model
# * `'options'` to pass to ko.applyBindings
# * `'afterBinding'` callback (can alternatively be in the options)
# * `'beforeBinding'` callback (can alternatively be in the options)
#
# Each function/constructor gets called with the following signature `'function(view_model, element)'`.
#
# @example Bind your application automatically when the DOM is loaded.
#   <div kb-inject><span data-bind="text: 'Hello World!'"></span></div>
# @example Bind your application with properties.
#   <div kb-inject="message: ko.observable('Hello World!')"><input data-bind="value: message"></input></div>
# @example Bind your application creating a specific ViewModel instance when the DOM is loaded.
#   <div kb-inject="MyViewModel"><input data-bind="value: message"></input></div>
#   var MyViewModel = function(view_model, el) {
#     this.message = ko.observable('Hello World!');
#   }
# @example Bind your application using a function when the DOM is loaded (like Angular.js controllers).
#   <div kb-inject="create: MyController"><input data-bind="value: message"></input></div>
#   var MyController = function(view_model, el) {
#     view_model.message = ko.observable('Hello World!');
#   }
# @example Bind your application with a specific ViewModel instance and a callback before and after the binding.
#   <div kb-inject="MyViewModel"><input data-bind="value: message"></input></div>
#   var MyViewModel = function(view_model, el) {
#     this.message = ko.observable('Hello World!');
#     this.beforeBinding = function() {alert('before'); };
#     this.afterBinding = function() {alert('after'); };
#   }
# @example Dynamically inject new properties into your ViewModel.
#   <div kb-inject="MyViewModel">
#     <div class="control-group" data-bind="inject: {site: ko.observable('http://your.url.com')}">
#       <label>Website</label>
#       <input type="url" name="site" data-bind="value: site, valueUpdate: 'keyup'" required>
#     </div>
#   </div>
#   var MyViewModel = function(view_model, el) {
#     // site will be dynamically attached to this ViewModel
#   }
# @example Dynamically bind a form.
#   <div kb-inject="MyViewModel">
#      <form name="my_form" data-bind="inject: kb.formValidator">
#        <div class="control-group">
#         <label>Name</label>
#         <input type="text" name="name" data-bind="value: name, valueUpdate: 'keyup'" required>
#       </div>
#       <div class="control-group">
#         <label>Website</label>
#         <input type="url" name="site" data-bind="value: site, valueUpdate: 'keyup'" required>
#       </div>
#     </form>
#   </div>
#   var MyViewModel = kb.ViewModel.extend({
#     constructor: ->
#       model = new Backbone.Model({name: '', site: 'http://your.url.com'});
#       kb.ViewModel.prototype.constructor.call(this, model);
#   });
class kb.Inject
  # @private
  @inject: (data, view_model, element, value_accessor, all_bindings_accessor, nested) ->
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
            view_model[key] = kb.Inject.inject(value, target, element, value_accessor, all_bindings_accessor, true)

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

  # Searches the DOM from root or document for elements with the `'kb-inject'` attribute and create/customizes ViewModels for the DOM tree when encountered. Also, used with the data-bind `'inject'` custom binding.
  # @param [DOM element] root the root DOM element to start searching for `'kb-inject'` attributes.
  # @return [Array] array of Objects with the DOM elements and ViewModels that were bound in the form `{el: DOM element, view_model: ViewModel}`.
  @injectViewModels: (root) ->
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
        app.view_model = kb.Inject.inject(data, app.view_model, app.el, null, null, true)
        afterBinding = app.view_model.afterBinding or options.afterBinding
        beforeBinding = app.view_model.beforeBinding or options.beforeBinding

      # auto-bind
      beforeBinding(app.view_model, app.el, options) if beforeBinding
      kb.applyBindings(app.view_model, app.el, options)
      afterBinding(app.view_model, app.el, options) if afterBinding
    return results

# auto-inject recursively
_ko_applyBindings = ko.applyBindings
ko.applyBindings = (context, element) ->
  results = if kb.RECUSIVE_AUTO_INJECT then kb.injectViewModels(element) else []
  _ko_applyBindings.apply(@, arguments) unless results.length

#############################
# Aliases
#############################
kb.injectViewModels = kb.Inject.injectViewModels

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