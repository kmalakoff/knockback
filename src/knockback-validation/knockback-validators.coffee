###
  knockback-validators.js 0.16.7
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# Helpers for validating forms, inputs, and values.

# Regular expressions from Angular.js: https://github.com/angular/angular.js
URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/
NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/

# identifiers that are not bound on an input
INPUT_RESERVED_IDENTIFIERS = ['value', 'valueUpdate', 'inject']

kb.validators =
  required: (value) -> !!value
  url: (value) -> !!URL_REGEXP.test(value)
  email: (value) -> !!EMAIL_REGEXP.test(value)
  number: (value) -> !!NUMBER_REGEXP.test(value)

kb.valueValidator = (value, bindings) ->
  return ko.dependentObservable(->
    results = {valid: true}
    current_value = ko.utils.unwrapObservable(value)
    for identifier, validator of bindings
      results[identifier]= !ko.utils.unwrapObservable(validator)(current_value) # update validity
      results.valid &= !results[identifier]

    # add the inverse and ensure a boolean
    results.valid = !!results.valid
    results.invalid = !results.valid
    return results
  )

kb.inputValidator = (view_model, el, value_accessor) ->
  $input_el = $(el)
  input_name = null if (input_name = $input_el.attr('name')) and not _.isString(input_name)
  skip_attach = value_accessor and value_accessor.skip_attach

  # only set up form elements with a value bindings
  return null unless (bindings = $input_el.attr('data-bind'))
  options = (new Function("sc", "with(sc[0]) { return { #{bindings} } }"))([view_model])
  return null if not (options and options.value)

  # collect the types to identifier
  bindings = {}
  bindings[type] = kb.validators[type] if kb.validators[type = $input_el.attr('type')]
  bindings.required = kb.validators.required if $input_el.attr('required')
  for identifier, validator of options # check all of the bindings for recognized bindings
    bindings[identifier] = validator if not _.contains(INPUT_RESERVED_IDENTIFIERS, identifier) and (typeof(validator) is 'function')
  result = kb.valueValidator(options.value, bindings)

  # if there is a name, add to the view_model with $scoping
  view_model["$#{input_name}"] = result if input_name and not skip_attach
  return result

kb.formValidator = (view_model, el) ->
  results = {}
  validators = []
  $root_el = $(el)
  form_name = null if (form_name = $root_el.attr('name')) and not _.isString(form_name)

  # build up the results
  for input_el in $root_el.find('input')
    continue unless (name = $(input_el).attr('name')) # need named inputs to set up an object
    validator = kb.inputValidator(view_model, input_el, if form_name then {skip_attach: true} else null)
    not validator or validators.push(results[name] = validator)

  # add the valid state and inverse
  results.valid = ko.dependentObservable(->
    valid = true
    valid &= validator().valid for validator in validators
    return valid
  )
  results.invalid = ko.dependentObservable(-> not results.valid())

  # if there is a name, add to the view_model with $scoping
  view_model["$#{form_name}"] = results if form_name
  return results