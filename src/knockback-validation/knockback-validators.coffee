###
  knockback-validators.js 0.16.6
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

kb.validators =
  required: (value) -> !value
  url: (value) -> not URL_REGEXP.test(value)
  email: (value) -> not EMAIL_REGEXP.test(value)
  number: (value) -> not NUMBER_REGEXP.test(value)

kb.valueValidator = (value, checks) ->
  _.isArray(checks) or (checks = [checks])
  return ko.dependentObservable(->
    results = {invalid: false}
    current_value = ko.utils.unwrapObservable(value)
    for check in checks
      validator = kb.validators[check]
      continue unless validator # unrecognized

      # add a result
      results[check] = validator(current_value)
      results.invalid |= results[check]

    # add the inverse
    results.valid = not results.invalid
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

  # collect the types to check
  checks = []
  switch $input_el.attr('type')
    when 'url' then checks.push('url')
    when 'email' then checks.push('email')
    when 'number' then checks.push('number')
  checks.push('required') if $input_el.attr('required')

  result = kb.valueValidator(options.value, checks)

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