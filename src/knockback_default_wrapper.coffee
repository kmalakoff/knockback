###
  knockback_default_wrapper.js
  (c) 2011 Kevin Malakoff.
  Knockback.DefaultWrapper is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###
throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file') if not this.Knockback

######################################
# kb.defaultWrapper to provide a default value when an observable is null, undefined, or the empty string
# Provide a observable with observable and/or non observable default argument in the form of:
#   kb.defaultWrapper(some_observable, "blue")
######################################
class kb.DefaultWrapper
  constructor: (target_observable, @default_value_observable) ->
    @__kb = {}
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
      read: =>
        current_target = ko.utils.unwrapObservable(target_observable())
        current_default = ko.utils.unwrapObservable(@default_value_observable)
        return if not current_target then current_default else current_target
      write: (value) -> target_observable(value)
    }))

    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)
    observable.setToDefault = _.bind(@setToDefault, @)

    return observable

  destroy: ->
    kb.utils.wrappedObservable(this, null)
    @default_value = null

  setToDefault: ->
    observable = kb.utils.wrappedObservable(this)
    observable(@default_value_observable)

kb.defaultWrapper = (target, default_value) -> return new kb.DefaultWrapper(target, default_value)
