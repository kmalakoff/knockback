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

# Validations
class kb.Validation
  @valueValidator: (value, bindings, validation_options={}) ->
    (validation_options and not (typeof(validation_options) is 'function')) or (validation_options = {})
    return ko.dependentObservable(->
      results = {error_count: 0}
      current_value = ko.utils.unwrapObservable(value)
      (not validation_options.disable) or (disable = callOrGet(validation_options.disable))
      priorities = validation_options.priorities or []
      _.isArray(priorities) or (priorities = [priorities]) # ensure priorities is an array

      # then add the rest
      active_index = priorities.length
      for identifier, validator of bindings
        results[identifier] = not disable and callOrGet(validator, current_value) # update validity
        if results[identifier]
          results.error_count++

          if results.active_error and priorities.length and (identifier_index = _.indexOf(priorities, identifier)) >= 0
            (active_index < identifier_index) or (active_index = identifier_index; results.active_error = identifier)
          else
            results.active_error or (results.active_error = identifier)

      # add the inverse and ensure a boolean
      results.valid = results.error_count is 0
      return results
    )

  @inputValidator: (view_model, el, validation_options) ->
    (validation_options and not (typeof(validation_options) is 'function')) or (validation_options = {})
    validators = kb.validators
    $input_el = $(el)
    input_name = null if (input_name = $input_el.attr('name')) and not _.isString(input_name)

    # only set up form elements with a value bindings
    return null unless (bindings = $input_el.attr('data-bind'))
    options = (new Function("sc", "with(sc[0]) { return { #{bindings} } }"))([view_model])
    return null if not (options and options.value)
    (not options.validation_options) or (_.defaults(options.validation_options, validation_options); validation_options = options.validation_options)

    # collect the types to identifier
    bindings = {}
    (not validators[type = $input_el.attr('type')]) or (bindings[type] = validators[type])
    (not $input_el.attr('required')) or (bindings.required = validators.required)
    (not validation_options.disable) or (bindings.disable = validation_options.disable) # global disable
    (not options.validations) or (bindings[identifier] = validator for identifier, validator of options.validations)
    result = kb.valueValidator(options.value, bindings, validation_options)

    # if there is a name, add to the view_model with $scoping
    (not input_name and not validation_options.no_attach) or (view_model["$#{input_name}"] = result)
    return result

  @formValidator: (view_model, el) ->
    results = {error_count: 0}
    validators = []
    $root_el = $(el)
    form_name = null if (form_name = $root_el.attr('name')) and not _.isString(form_name)

    if (bindings = $root_el.attr('data-bind'))
      options = (new Function("sc", "with(sc[0]) { return { #{bindings} } }"))([view_model])
      validation_options = options.validation_options
    validation_options or= {}
    validation_options.no_attach = !!form_name

    # build up the results
    for input_el in $root_el.find('input')
      continue unless (name = $(input_el).attr('name')) # need named inputs to set up an object
      validator = kb.inputValidator(view_model, input_el, validation_options)
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

# returns true if there are errors
kb.validators =
  required: (value) -> !value
  url: (value) -> !URL_REGEXP.test(value)
  email: (value) -> !EMAIL_REGEXP.test(value)
  number: (value) -> !NUMBER_REGEXP.test(value)

#############################
# Aliases
#############################
kb.valueValidator = kb.Validation.valueValidator
kb.inputValidator = kb.Validation.inputValidator
kb.formValidator = kb.Validation.formValidator