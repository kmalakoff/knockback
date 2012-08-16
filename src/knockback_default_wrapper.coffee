###
  knockback_default_wrapper.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.DefaultWrapper is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

######################################
# kb.defaultWrapper to provide a default value when an observable is null, undefined, or the empty string
# Provide a observable with observable and/or non observable default argument in the form of:
#   kb.defaultWrapper(some_observable, "blue")
######################################
class kb.DefaultWrapper
  constructor: (target_observable, @default_value) ->
    observable = kb.utils.wrappedObservable(@, ko.dependentObservable({
      read: =>
        current_target = ko.utils.unwrapObservable(target_observable())
        current_default = ko.utils.unwrapObservable(@default_value)
        return if not current_target then current_default else current_target
      write: (value) -> target_observable(value)
    }))

    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)
    observable.setToDefault = _.bind(@setToDefault, @)

    return observable

  destroy: ->
    (@default_value.dispose?(); @default_value = null) if @default_value
    kb.utils.wrappedDestroy(@)

  setToDefault: ->
    observable = kb.utils.wrappedObservable(@)
    observable(@default_value)

kb.defaultWrapper = (target, default_value) -> return new kb.DefaultWrapper(target, default_value)
