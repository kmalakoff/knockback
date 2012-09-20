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

callOrGet = (value) ->
  value = ko.utils.unwrapObservable(value)
  return if typeof(value) is 'function' then value.apply(null, arraySlice.call(arguments, 1)) else value

arraySlice = Array.prototype.slice;

# returns true if there are errors
kb.validators =
  required: (value) -> !value
  url: (value) -> !URL_REGEXP.test(value)
  email: (value) -> !EMAIL_REGEXP.test(value)
  number: (value) -> !NUMBER_REGEXP.test(value)

kb.valueValidator = (value, bindings) ->
  return ko.dependentObservable(->
    results = {error_count: 0}
    current_value = ko.utils.unwrapObservable(value)
    disable = callOrGet(bindings.disable) if 'disable' of bindings
    for identifier, validator of bindings
      continue if identifier is 'disable'
      results[identifier] = not disable and callOrGet(validator, current_value) # update validity
      if results[identifier]
        results.error_count++
        results.active_error = identifier unless results.active_error

    # add the inverse and ensure a boolean
    results.valid = results.error_count is 0
    return results
  )

kb.inputValidator = (view_model, el, value_accessor) ->
  $input_el = $(el)
  input_name = null if (input_name = $input_el.attr('name')) and not _.isString(input_name)
  if value_accessor
    skip_attach = value_accessor.skip_attach
    disable = value_accessor.disable

  # only set up form elements with a value bindings
  return null unless (bindings = $input_el.attr('data-bind'))
  options = (new Function("sc", "with(sc[0]) { return { #{bindings} } }"))([view_model])
  return null if not (options and options.value)

  # collect the types to identifier
  bindings = {}
  bindings[type] = kb.validators[type] if kb.validators[type = $input_el.attr('type')]
  bindings.required = kb.validators.required if $input_el.attr('required')
  bindings.disable = disable if disable # global disable
  if options.validations
    bindings[identifier] = validator for identifier, validator of options.validations
  result = kb.valueValidator(options.value, bindings)

  # if there is a name, add to the view_model with $scoping
  view_model["$#{input_name}"] = result if input_name and not skip_attach
  return result

kb.formValidator = (view_model, el) ->
  results = {error_count: 0}
  validators = []
  $root_el = $(el)
  form_name = null if (form_name = $root_el.attr('name')) and not _.isString(form_name)

  if (bindings = $root_el.attr('data-bind'))
    options = (new Function("sc", "with(sc[0]) { return { #{bindings} } }"))([view_model])
    disable = options.validations.disable if options and options.validations and options.validations.disable

  # build up the results
  for input_el in $root_el.find('input')
    continue unless (name = $(input_el).attr('name')) # need named inputs to set up an object
    validator = kb.inputValidator(view_model, input_el, if form_name then {skip_attach: true, disable: disable} else {disable: disable})
    not validator or validators.push(results[name] = validator)

  # add the valid state and inverse
  results.valid = ko.dependentObservable(->
    valid = true
    for validator in validators
      results.error_count += validator().error_count
      valid &= validator().valid
    return valid
  )

  # if there is a name, add to the view_model with $scoping
  view_model["$#{form_name}"] = results if form_name
  return results