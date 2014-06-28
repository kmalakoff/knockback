<<<<<<< HEAD
try kb = require 'knockback' catch err then kb = require '../core/kb'
=======
###
  knockback.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
###

try kb = require 'knockback' catch err then kb = require './kb'
>>>>>>> ec263e728855d379f1e44d8b94b29b32a5379f47
_ = require 'underscore'
ko = require 'knockout'

require './extensions'

# Used to provide a default value when an observable is null, undefined, or the empty string.
#
# @example Provide a observable with observable and/or non observable default argument in the form of:
#   var wrapped_name = kb.defaultObservable(kb.observable(model, 'name'), '(no name)');
module.exports = class kb.DefaultObservable

  # Used to create a new kb.DefaultObservable.
  #
  # @param [ko.observable] target_observable the observable to check for null, undefined, or the empty string
  # @param [Any] default_value the default value. Can be a value, string or ko.observable
  # @return [ko.observable] the constructor does not return 'this' but a ko.observable
  # @note the constructor does not return 'this' but a ko.observable
  constructor: (target_observable, @dv) -> # @dv is default value
    observable = kb.utils.wrappedObservable(@, ko.dependentObservable({
      read: =>
        return if (current_target = ko.utils.unwrapObservable(target_observable())) then current_target else ko.utils.unwrapObservable(@dv)
      write: (value) -> target_observable(value)
    }))

    # publish public interface on the observable and return instead of this
    kb.publishMethods(observable, @, ['destroy', 'setToDefault'])

    return observable

  # Required clean up function to break cycles, release view models, etc.
  # Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy: -> kb.utils.wrappedDestroy(@)

  # Forces the observable to take the default value.
  # @note Can be used with kb.utils.setToDefault, kb.Observable.setToDefault, kb.ViewModel.setToDefault
  setToDefault: -> kb.utils.wrappedObservable(@)(@dv)

kb.defaultObservable = (target, default_value) -> return new kb.DefaultObservable(target, default_value)