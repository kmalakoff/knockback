###
  knockback.js 0.20.5
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
###

{_, ko, $} = kb = require '../core/kb'

# Regular expressions from Angular.js: https://github.com/angular/angular.js
URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/
NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/

# A validator should return true if there are errors (similar to the binding check in HTML, eg. $name().required).
kb.valid =
  required: (value) -> !value
  url: (value) -> !URL_REGEXP.test(value)
  email: (value) -> !EMAIL_REGEXP.test(value)
  number: (value) -> !NUMBER_REGEXP.test(value)

# Convention is that if they end in Fn then returns a function pointer based on parameters passed.
kb.hasChangedFn = (model) ->
  m = null; attributes = null
  return ->
    if m isnt (current_model = ko.utils.unwrapObservable(model)) # change in model
      m = current_model
      attributes = (if m then m.toJSON() else null)
      return false
    return false if not (m and attributes)
    return !_.isEqual(m.toJSON(), attributes)

kb.minLengthFn = (length) ->
  return (value) -> return not value or value.length < length

kb.uniqueValueFn = (model, key, collection) ->
  return (value) ->
    m = ko.utils.unwrapObservable(model); k = ko.utils.unwrapObservable(key); c = ko.utils.unwrapObservable(collection)
    return false if not (m and k and c)
    return !!_.find(c.models, (test) => (test isnt m) and test.get(k) is value)

kb.untilTrueFn = (stand_in, fn, model) ->
  was_true = false
  model.subscribe(-> was_true = false) if model and ko.isObservable(model) # reset if the model changes
  return (value) ->
    return ko.utils.unwrapObservable(stand_in) unless (f = ko.utils.unwrapObservable(fn))
    was_true |= !!(result = f(ko.utils.unwrapObservable(value)))
    return (if was_true then result else ko.utils.unwrapObservable(stand_in))

kb.untilFalseFn = (stand_in, fn, model) ->
  was_false = false
  model.subscribe(-> was_false = false) if model and ko.isObservable(model) # reset if the model changes
  return (value) ->
    return ko.utils.unwrapObservable(stand_in) unless (f = ko.utils.unwrapObservable(fn))
    was_false |= !(result = f(ko.utils.unwrapObservable(value)))
    return (if was_false then result else ko.utils.unwrapObservable(stand_in))