###
  knockback_default_wrapper.js
  (c) 2011 Kevin Malakoff.
  Knockback.DefaultWrapper is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###
throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file') if not this.Knockback

######################################
# Knockback.defaultWrapper to provide a default value when an observable is null, undefined, or the empty string
# Provide a observable with observable and/or non observable default argument in the form of:
#   kb.defaultWrapper(some_observable, "blue")
######################################
class Knockback.DefaultWrapper
  constructor: (observable, @default_value) ->
    @__kb = {}
    @__kb.observable = ko.dependentObservable({
      read: =>
        value = ko.utils.unwrapObservable(observable())
        return if not value then ko.utils.unwrapObservable(@default_value) else value
      write: (value) -> observable(value)
    })

    # publish public interface on the observable and return instead of this
    @__kb.observable.destroy = _.bind(@destroy, @)
    @__kb.observable.setToDefault = _.bind(@setToDefault, @)

    return kb.unwrapObservable(this)

  destroy: ->
    @__kb.observable = null
    @default_value = null

  setToDefault: -> @__kb.observable(@default_value)

Knockback.defaultWrapper = (observable, default_value) -> return new Knockback.DefaultWrapper(observable, default_value)
