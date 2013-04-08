###
  knockback-validators.js 0.17.2
  (c) 2011-2013 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

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
    if m isnt (current_model = _unwrapObservable(model)) # change in model
      m = current_model
      attributes = (if m then m.toJSON() else null)
      return false
    return false if not (m and attributes)
    return !_.isEqual(m.toJSON(), attributes)

kb.minLengthFn = (length) ->
  return (value) -> return not value or value.length < length

kb.uniqueValueFn = (model, key, collection) ->
  return (value) ->
    m = _unwrapObservable(model); k = _unwrapObservable(key); c = _unwrapObservable(collection)
    return false if not (m and k and c)
    return !!_.find(c.models, (test) => (test isnt m) and test.get(k) is value)

kb.untilTrueFn = (stand_in, fn, model) ->
  was_true = false
  model.subscribe(-> was_true = false) if model and ko.isObservable(model) # reset if the model changes
  return (value) ->
    return _unwrapObservable(stand_in) unless (f = _unwrapObservable(fn))
    was_true |= !!(result = f(_unwrapObservable(value)))
    return (if was_true then result else _unwrapObservable(stand_in))

kb.untilFalseFn = (stand_in, fn, model) ->
  was_false = false
  model.subscribe(-> was_false = false) if model and ko.isObservable(model) # reset if the model changes
  return (value) ->
    return _unwrapObservable(stand_in) unless (f = _unwrapObservable(fn))
    was_false |= !(result = f(_unwrapObservable(value)))
    return (if was_false then result else _unwrapObservable(stand_in))