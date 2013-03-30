###
  knockback-extensions.js (knockback-defaults)
  (c) 2011-2013 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
###

kb.Observable::setToDefault = ->
  @__kb_value?.setToDefault?()
  return

kb.ViewModel::setToDefault = ->
  @[vm_key]?.setToDefault?() for vm_key of @__kb.vm_keys
  return

# @example
#   var model = new Backbone.Model({name: 'Bob'});
#   var view_model = {
#     wrapped_name: kb.defaultWrapper(kb.observable(model, 'name'), '(no name)')
#   }; // view_model.wrapped name: Bob
#   kb.utils.setToDefault(view_model); // view_model.wrapped name: (no name)
kb.utils.setToDefault = (obj) ->
  return unless obj

  # observable
  if ko.isObservable(obj)
    obj.setToDefault?()

  # view model
  else if _.isObject(obj)
    for key, value of obj
      @setToDefault(value) if value and (ko.isObservable(value) or (typeof(value) isnt 'function')) and ((key[0] isnt '_') or key.search('__kb'))
  return obj