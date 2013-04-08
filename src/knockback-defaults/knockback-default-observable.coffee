###
  knockback_default_observable.js 0.17.2
  (c) 2011-2013 Kevin Malakoff.
  Knockback.DefaultObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# Used to provide a default value when an observable is null, undefined, or the empty string.
#
# @example Provide a observable with observable and/or non observable default argument in the form of:
#   var wrapped_name = kb.defaultObservable(kb.observable(model, 'name'), '(no name)');
class kb.DefaultObservable

  # Used to create a new kb.DefaultObservable.
  #
  # @param [ko.observable] target_observable the observable to check for null, undefined, or the empty string
  # @param [Any] default_value the default value. Can be a value, string or ko.observable
  # @return [ko.observable] the constructor does not return 'this' but a ko.observable
  # @note the constructor does not return 'this' but a ko.observable
  constructor: (target_observable, @dv) -> # @dv is default value
    observable = kb.utils.wrappedObservable(@, ko.dependentObservable({
      read: =>
        return if (current_target = _unwrapObservable(target_observable())) then current_target else _unwrapObservable(@dv)
      write: (value) -> target_observable(value)
    }))

    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)
    observable.setToDefault = _.bind(@setToDefault, @)

    return observable

  # Required clean up function to break cycles, release view models, etc.
  # Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy: -> kb.utils.wrappedDestroy(@)

  # Forces the observable to take the default value.
  # @note Can be used with kb.utils.setToDefault, kb.Observable.setToDefault, kb.ViewModel.setToDefault
  setToDefault: -> kb.utils.wrappedObservable(@)(@dv)

kb.defaultObservable = (target, default_value) -> return new kb.DefaultObservable(target, default_value)