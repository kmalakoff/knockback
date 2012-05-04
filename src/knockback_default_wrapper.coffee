###
  knockback_default_wrapper.js
  (c) 2011 Kevin Malakoff.
  Knockback.DefaultWrapper is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

######################################
# Knockback.defaultWrapper to provide a default value when an target_observable is null, undefined, or the empty string
# Provide a target_observable with observable and/or non observable default argument in the form of:
#   kb.defaultWrapper(some_observable, "blue")
######################################
Knockback.defaultWrapper = (target_observable, default_value_observable) ->
  default_wrapper_observable = ko.dependentObservable({
    read: ->
      value = ko.utils.unwrapObservable(target_observable())
      default_value = ko.utils.unwrapObservable(default_value_observable)
      return if value then value else default_value
    write: (value) -> target_observable(value)
  })
  default_wrapper_observable.setToDefault = -> default_wrapper_observable(default_value_observable)
  return default_wrapper_observable