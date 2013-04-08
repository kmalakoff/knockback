###
  knockback-validation.js 0.17.2
  (c) 2011-2013 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# internal helper
callOrGet = (value) ->
  value = _unwrapObservable(value)
  return if typeof(value) is 'function' then value.apply(null, Array.prototype.slice.call(arguments, 1)) else value

# Helpers for validating forms, inputs, and values.
# @example A Named Form
#   <form name="myForm">
#      <input name="input1", data-bind="value: input1" required>
#      <input type="url" name="input2", data-bind="value: input2">
#    </form>
#   Because there is a form name, it will add the following property to your ViewModel (wrapped in an observable):
#    $myForm: {
#      input1: {required: boolean, valid: boolean, invalid: boolean},
#      input2: {url: boolean, valid: boolean, invalid: boolean},
#      valid: boolean,
#      invalid: boolean
#    }
# @example A Unnamed Form
#   <form>
#     <input name="input1", data-bind="value: input1" required>
#     <input type="url" name="input2", data-bind="value: input2">
#   </form>
#   Because there is not a form name, it will extend the following on your ViewModel (each wrapped separately in an observable):
#   {
#     $input1: {required: boolean, valid: boolean, invalid: boolean},
#     $input2: {url: boolean, valid: boolean, invalid: boolean}
#   }
#
# @method .valueValidator(value, bindings, validation_options={})
#   Used to create an observable that wraps all of the validators for a value and also generates helpers for $valid, $error_count, $enabled, $disabled, and $active_error.
#   @note Called using `kb.valueValidator` (not  kb.Validation.valueValidator)
#   @param [Observable] value the value to validate
#   @param [Object] bindings the named validators to use to validate the value
#   @param [Object] validation_options the validation options
#   @option validation_options [Boolean|Function] disable the test for disabling validations
#   @option validation_options [Boolean|Function] enable the test for enabling validations
#   @option validation_options [String|Array] priorities the priority order of the validators (used to set $active_error in the case of multiple being active simulateously)
#   @return [ko.computed] a single observable storing an Object with all of the validators and generated helpers
#
# @method .inputValidator(view_model, el, validation_options={})
#   Used to create an observable that wraps all of the validators for an HTML input element using `kb.valueValidator`. See kb.valueValidator for shared options.
#   In addition, you can add custom bindings by including a `validations` Object in your data-bind statement where each property has a function(value) that returns true if there are errors.
#   It will automatically generate validators from the input for the following attributes:
#   * type: for url, email, and number
#   * required: must have a length or a value
#   @note Called using `kb.inputValidator` (not  kb.Validation.inputValidator)
#   @return [ko.computed] a single observable storing an Object with all of the validators and generated helpers
#   @example Binding an input using Knockback inject.
#     <input type="url" name="name" data-bind="value: name, inject: kb.inputValidator" required>
#     Adds the following to your ViewModel:
#       $name: kb.observable({required: Boolean, url: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})
#   @example Binding an input with custom validations using Knockback inject.
#     <input type="url" name="name" data-bind="value: name, inject: kb.inputValidator, validations: {unique: nameTaken}" required>
#     Adds the following to your ViewModel:
#       $name: kb.observable({required: Boolean, url: Boolean, unique: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})
#   @example Binding an input with validation options using Knockback inject.
#     <input type="url" name="name" data-bind="value: name, inject: kb.inputValidator, validation_options: {disable: disable, priorities: 'url'}" required>
#     Adds the following to your ViewModel:
#       $name: kb.observable({required: Boolean, url: Boolean, unique: Boolean, $valid: Boolean, $error_count: Number, $enabled: Boolean, $disabled: Boolean, $active_error: String})
#
# @method .formValidator(view_model, el)
#   Used to create an observable that wraps all of the validators for all the inputs on an HTML form element using `kb.inputValidator`. See kb.inputValidator for per input options.
#   In addition, the formValidator aggregates the following helpers for its inputs: $valid, $error_count, $enabled, and $disabled. Also, if you provide a name attribute for the form, it will attach all of the inputs to a $name property on your view model.
#   @note Called using `kb.formValidator` (not  kb.Validation.formValidator)
#   @return [Object] an Object with all of the validators and generated helpers
#   @example Binding a form by name using Knockback inject.
#     <form name='my_form' data-bind="inject: kb.formValidator, validation_options: {priorities: ['required', 'url']}">
#       <input type="text" name="name" data-bind="value: name" required>
#       <input type="url" name="site" data-bind="value: site" required>
#     </form>
#     Adds the following to your ViewModel:
#     $my_form: {
#       name: kb.observable({required: Boolean, $valid: Boolean, $error_count: Number, $active_error: String}),
#       site: kb.observable({required: Boolean, url: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})
#     }
#   @example Binding a form without a name using Knockback inject.
#     <form data-bind="inject: kb.formValidator, validation_options: {priorities: ['required', 'url']}">
#       <input type="text" name="name" data-bind="value: name" required>
#       <input type="url" name="site" data-bind="value: site" required>
#     </form>
#     Extends your ViewModel with the following Object:
#     {
#       $name: kb.observable({required: Boolean, $valid: Boolean, $error_count: Number, $active_error: String}),
#       $site: kb.observable({required: Boolean, url: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})
#     }
# @method .hasChangedFn(model)
#   A validation helper that can be used to wait for a change before enabling validations.
#   @note Called using `kb.hasChangedFn` (not  kb.Validation.hasChangedFn)
#   @return [Function] Validator function bound with model
#   @example Enabling validations after a change has been made to a model.
#     <form class="form-horizontal" data-bind="inject: kb.formValidator, validation_options: {enable: kb.hasChangedFn(model)}">
# @method .minLengthFn(length)
#   A validator that will be invalid until the length of the value is below a minimum value.
#   @note Called using `kb.minLengthFn` (not  kb.Validation.minLengthFn)
#   @return [Function] Validator function bound with min length
#   @example Validations will be invalid until the name is at least 4 characters long.
#     <input type="text" name="name" data-bind="value: name, validations: {length: kb.minLengthFn(4)}">
# @method .uniqueValueFn(model, key, collection)
#   Checks for a unique attribute value by key in a collection
#   @note Called using `kb.uniqueValueFn` (not  kb.Validation.uniqueValueFn)
#   @return [Function] Validator function bound with model, attribute key, and collection
#   @example Validations will be invalid until the name attribute is unique in the collection.
#     <input type="text" name="name" data-bind="value: name, validations: {unique: kb.uniqueValueFn(model, 'name', some_collection)}">
# @method .untilTrueFn(stand_in, fn, model)
#   Used to combine conditions.
#   @note Called using `kb.untilTrueFn` (not  kb.Validation.untilTrueFn)
#   @return [Function] Validator function bound with stand_in value before condition is met, validator function, and optionally model (will reset if the model changes).
#   @example Filter the minimum length test of name until it has be valid (that way, won't report invalid while typing in a new input).
#     <input type="text" name="name" data-bind="value: name, validations: {length_filtered: kb.untilFalseFn(false, kb.minLengthFn(4), model)}">
# @method .untilFalseFn(stand_in, fn, model)
#   Used to combine conditions.
#   @note Called using `kb.untilFalseFn` (not  kb.Validation.untilFalseFn)
#   @return [Function] Validator function bound with stand_in value before condition is met, validator function, and optionally model (will reset if the model changes).
class kb.Validation

#############################
# Aliases
#############################
kb.valueValidator = (value, bindings, validation_options={}) ->
  (validation_options and not (typeof(validation_options) is 'function')) or (validation_options = {})
  return ko.dependentObservable(->
    results = {$error_count: 0}
    current_value = _unwrapObservable(value)
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

kb.inputValidator = (view_model, el, validation_options={}) ->
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
  if options.validations
    bindings[identifier] = validator for identifier, validator of options.validations
  result = kb.valueValidator(options.value, bindings, validation_options)

  # if there is a name, add to the view_model with $scoping
  (not input_name and not validation_options.no_attach) or (view_model["$#{input_name}"] = result)
  return result

kb.formValidator = (view_model, el) ->
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