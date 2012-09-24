###
  knockback-validation.js 0.16.7
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# internal helper
callOrGet = (value) ->
  value = ko.utils.unwrapObservable(value)
  return if typeof(value) is 'function' then value.apply(null, Array.prototype.slice.call(arguments, 1)) else value

# Helpers for validating forms, inputs, and values.
class kb.Validation
  @valueValidator: (value, bindings, validation_options={}) ->
    (validation_options and not (typeof(validation_options) is 'function')) or (validation_options = {})
    return ko.dependentObservable(->
      results = {$error_count: 0}
      current_value = ko.utils.unwrapObservable(value)
      not ('disable' of validation_options) or (disabled = callOrGet(validation_options.disable))
      not ('enable' of validation_options) or (disabled = not callOrGet(validation_options.enable))
      priorities = validation_options.priorities or []
      _.isArray(priorities) or (priorities = [priorities]) # ensure priorities is an array

      # then add the rest
      active_index = priorities.length + 1
      for identifier, validator of bindings
        results[identifier] = not disabled and callOrGet(validator, current_value) # update validity
        if results[identifier]
          results.$error_count++

          # check priorities
          (identifier_index = _.indexOf(priorities, identifier)>=0) or (identifier_index = priorities.length)
          if results.$active_error and identifier_index < active_index
            results.$active_error = identifier; active_index = identifier_index
          else
            results.$active_error or (results.$active_error = identifier; active_index = identifier_index)

      # add the inverse and ensure a boolean
      results.$enabled = not disabled
      results.$disable = !!disabled
      results.$valid = results.$error_count is 0
      return results
    )

  @inputValidator: (view_model, el, validation_options) ->
    (validation_options and not (typeof(validation_options) is 'function')) or (validation_options = {})
    validators = kb.valid
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
    (not options.validations) or (bindings[identifier] = validator for identifier, validator of options.validations)
    result = kb.valueValidator(options.value, bindings, validation_options)

    # if there is a name, add to the view_model with $scoping
    (not input_name and not validation_options.no_attach) or (view_model["$#{input_name}"] = result)
    return result

  @formValidator: (view_model, el) ->
    results = {}
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

    # collect stats, error count and valid
    results.$error_count = ko.dependentObservable(->
      error_count = 0
      for validator in validators
        error_count += validator().$error_count
      return error_count
    )
    results.$valid = ko.dependentObservable(-> return results.$error_count() is 0)

    # enabled and disabled
    results.$enabled = ko.dependentObservable(->
      enabled = true
      for validator in validators
        enabled &= validator().$enabled
      return enabled
    )
    results.$disabled = ko.dependentObservable(-> return not results.$enabled())

    # if there is a name, add to the view_model with $scoping
    view_model["$#{form_name}"] = results if form_name
    return results

#############################
# Aliases
#############################
kb.valueValidator = kb.Validation.valueValidator
kb.inputValidator = kb.Validation.inputValidator
kb.formValidator = kb.Validation.formValidator