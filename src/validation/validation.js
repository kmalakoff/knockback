/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let kb;
const { _, ko } = (kb = require('../core/kb'));

require('./validators');

// internal helper
const callOrGet = function (value) {
  value = ko.utils.unwrapObservable(value);
  return typeof (value) === 'function' ? value(...Array.prototype.slice.call(arguments, 1)) : value;
};

// Helpers for validating forms, inputs, and values.
// @example A Named Form
//   <form name="myForm">
//      <input name="input1", data-bind="value: input1" required>
//      <input type="url" name="input2", data-bind="value: input2">
//    </form>
//   Because there is a form name, it will add the following property to your ViewModel (wrapped in an observable):
//    $myForm: {
//      input1: {required: boolean, valid: boolean, invalid: boolean},
//      input2: {url: boolean, valid: boolean, invalid: boolean},
//      valid: boolean,
//      invalid: boolean
//    }
// @example A Unnamed Form
//   <form>
//     <input name="input1", data-bind="value: input1" required>
//     <input type="url" name="input2", data-bind="value: input2">
//   </form>
//   Because there is not a form name, it will extend the following on your ViewModel (each wrapped separately in an observable):
//   {
//     $input1: {required: boolean, valid: boolean, invalid: boolean},
//     $input2: {url: boolean, valid: boolean, invalid: boolean}
//   }
//
// @method .valueValidator(value, bindings, validation_options={})
//   Used to create an observable that wraps all of the validators for a value and also generates helpers for $valid, $error_count, $enabled, $disabled, and $active_error.
//   @note Called using `kb.valueValidator` (not  kb.Validation.valueValidator)
//   @param [Observable] value the value to validate
//   @param [Object] bindings the named validators to use to validate the value
//   @param [Object] validation_options the validation options
//   @option validation_options [Boolean|Function] disable the test for disabling validations
//   @option validation_options [Boolean|Function] enable the test for enabling validations
//   @option validation_options [String|Array] priorities the priority order of the validators (used to set $active_error in the case of multiple being active simulateously)
//   @return [ko.computed] a single observable storing an Object with all of the validators and generated helpers
//
// @method .inputValidator(view_model, el, validation_options={})
//   Used to create an observable that wraps all of the validators for an HTML input element using `kb.valueValidator`. See kb.valueValidator for shared options.
//   In addition, you can add custom bindings by including a `validations` Object in your data-bind statement where each property has a function(value) that returns true if there are errors.
//   It will automatically generate validators from the input for the following attributes:
//   * type: for url, email, and number
//   * required: must have a length or a value
//   @note Called using `kb.inputValidator` (not  kb.Validation.inputValidator)
//   @return [ko.computed] a single observable storing an Object with all of the validators and generated helpers
//   @example Binding an input using Knockback inject.
//     <input type="url" name="name" data-bind="value: name, inject: kb.inputValidator" required>
//     Adds the following to your ViewModel:
//       $name: kb.observable({required: Boolean, url: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})
//   @example Binding an input with custom validations using Knockback inject.
//     <input type="url" name="name" data-bind="value: name, inject: kb.inputValidator, validations: {unique: nameTaken}" required>
//     Adds the following to your ViewModel:
//       $name: kb.observable({required: Boolean, url: Boolean, unique: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})
//   @example Binding an input with validation options using Knockback inject.
//     <input type="url" name="name" data-bind="value: name, inject: kb.inputValidator, validation_options: {disable: disable, priorities: 'url'}" required>
//     Adds the following to your ViewModel:
//       $name: kb.observable({required: Boolean, url: Boolean, unique: Boolean, $valid: Boolean, $error_count: Number, $enabled: Boolean, $disabled: Boolean, $active_error: String})
//
// @method .formValidator(view_model, el)
//   Used to create an observable that wraps all of the validators for all the inputs on an HTML form element using `kb.inputValidator`. See kb.inputValidator for per input options.
//   In addition, the formValidator aggregates the following helpers for its inputs: $valid, $error_count, $enabled, and $disabled. Also, if you provide a name attribute for the form, it will attach all of the inputs to a $name property on your view model.
//   @note Called using `kb.formValidator` (not  kb.Validation.formValidator)
//   @return [Object] an Object with all of the validators and generated helpers
//   @example Binding a form by name using Knockback inject.
//     <form name='my_form' data-bind="inject: kb.formValidator, validation_options: {priorities: ['required', 'url']}">
//       <input type="text" name="name" data-bind="value: name" required>
//       <input type="url" name="site" data-bind="value: site" required>
//     </form>
//     Adds the following to your ViewModel:
//     $my_form: {
//       name: kb.observable({required: Boolean, $valid: Boolean, $error_count: Number, $active_error: String}),
//       site: kb.observable({required: Boolean, url: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})
//     }
//   @example Binding a form without a name using Knockback inject.
//     <form data-bind="inject: kb.formValidator, validation_options: {priorities: ['required', 'url']}">
//       <input type="text" name="name" data-bind="value: name" required>
//       <input type="url" name="site" data-bind="value: site" required>
//     </form>
//     Extends your ViewModel with the following Object:
//     {
//       $name: kb.observable({required: Boolean, $valid: Boolean, $error_count: Number, $active_error: String}),
//       $site: kb.observable({required: Boolean, url: Boolean, $valid: Boolean, $error_count: Number, $active_error: String})
//     }
// @method .hasChangedFn(model)
//   A validation helper that can be used to wait for a change before enabling validations.
//   @note Called using `kb.hasChangedFn` (not  kb.Validation.hasChangedFn)
//   @return [Function] Validator function bound with model
//   @example Enabling validations after a change has been made to a model.
//     <form class="form-horizontal" data-bind="inject: kb.formValidator, validation_options: {enable: kb.hasChangedFn(model)}">
// @method .minLengthFn(length)
//   A validator that will be invalid until the length of the value is below a minimum value.
//   @note Called using `kb.minLengthFn` (not  kb.Validation.minLengthFn)
//   @return [Function] Validator function bound with min length
//   @example Validations will be invalid until the name is at least 4 characters long.
//     <input type="text" name="name" data-bind="value: name, validations: {length: kb.minLengthFn(4)}">
// @method .uniqueValueFn(model, key, collection)
//   Checks for a unique attribute value by key in a collection
//   @note Called using `kb.uniqueValueFn` (not  kb.Validation.uniqueValueFn)
//   @return [Function] Validator function bound with model, attribute key, and collection
//   @example Validations will be invalid until the name attribute is unique in the collection.
//     <input type="text" name="name" data-bind="value: name, validations: {unique: kb.uniqueValueFn(model, 'name', some_collection)}">
// @method .untilTrueFn(stand_in, fn, model)
//   Used to combine conditions.
//   @note Called using `kb.untilTrueFn` (not  kb.Validation.untilTrueFn)
//   @return [Function] Validator function bound with stand_in value before condition is met, validator function, and optionally model (will reset if the model changes).
//   @example Filter the minimum length test of name until it has be valid (that way, won't report invalid while typing in a new input).
//     <input type="text" name="name" data-bind="value: name, validations: {length_filtered: kb.untilFalseFn(false, kb.minLengthFn(4), model)}">
// @method .untilFalseFn(stand_in, fn, model)
//   Used to combine conditions.
//   @note Called using `kb.untilFalseFn` (not  kb.Validation.untilFalseFn)
//   @return [Function] Validator function bound with stand_in value before condition is met, validator function, and optionally model (will reset if the model changes).
module.exports = kb.Validation = class Validation {};

// ############################
// Aliases
// ############################
kb.valueValidator = function (value, bindings, validation_options) {
  if (validation_options == null) { validation_options = {}; }
  (validation_options && !(typeof (validation_options) === 'function')) || (validation_options = {});
  return ko.computed(() => {
    let disabled;
    const results = { $error_count: 0 };
    const current_value = ko.utils.unwrapObservable(value);
    !('disable' in validation_options) || (disabled = callOrGet(validation_options.disable));
    !('enable' in validation_options) || (disabled = !callOrGet(validation_options.enable));
    let priorities = validation_options.priorities || [];
    _.isArray(priorities) || (priorities = [priorities]); // ensure priorities is an array

    // then add the rest
    let active_index = priorities.length + 1;
    for (const identifier in bindings) {
      const validator = bindings[identifier];
      results[identifier] = !disabled && callOrGet(validator, current_value); // update validity
      if (results[identifier]) {
        var identifier_index;
        results.$error_count++;

        // check priorities
        (identifier_index = _.indexOf(priorities, identifier) >= 0) || (identifier_index = priorities.length);
        if (results.$active_error && (identifier_index < active_index)) {
          results.$active_error = identifier; active_index = identifier_index;
        } else {
          results.$active_error || ((results.$active_error = identifier), (active_index = identifier_index));
        }
      }
    }

    // add the inverse and ensure a boolean
    results.$enabled = !disabled;
    results.$disable = !!disabled;
    results.$valid = results.$error_count === 0;
    return results;
  });
};

kb.inputValidator = function (view_model, el, validation_options) {
  let bindings,
    input_name,
    type;
  if (validation_options == null) { validation_options = {}; }
  (validation_options && !(typeof (validation_options) === 'function')) || (validation_options = {});
  const validators = kb.valid;
  if ((input_name = el.getAttribute('name')) && !_.isString(input_name)) { input_name = null; }

  // only set up form elements with a value bindings
  if (!(bindings = el.getAttribute('data-bind'))) { return null; }
  const options = (new Function('sc', `with(sc[0]) { return { ${bindings} } }`))([view_model]);
  if (!(options && options.value)) { return null; }
  (!options.validation_options) || (_.defaults(options.validation_options, validation_options), ({ validation_options } = options));

  // collect the types to identifier
  bindings = {};
  (!validators[(type = el.getAttribute('type'))]) || (bindings[type] = validators[type]);
  !el.hasAttribute('required') || (bindings.required = validators.required);
  if (options.validations) {
    for (const identifier in options.validations) { const validator = options.validations[identifier]; bindings[identifier] = validator; }
  }
  const result = kb.valueValidator(options.value, bindings, validation_options);

  // if there is a name, add to the view_model with $scoping
  (!input_name && !validation_options.no_attach) || (view_model[`$${input_name}`] = result);
  return result;
};

kb.formValidator = function (view_model, el) {
  let bindings,
    form_name,
    validation_options,
    validator;
  const results = {};
  const validators = [];
  if ((form_name = el.getAttribute('name')) && !_.isString(form_name)) { form_name = null; }

  if (bindings = el.getAttribute('data-bind')) {
    const options = (new Function('sc', `with(sc[0]) { return { ${bindings} } }`))([view_model]);
    ({ validation_options } = options);
  }
  if (!validation_options) { validation_options = {}; }
  validation_options.no_attach = !!form_name;

  // build up the results
  el.getElementsByTagName('input').forEach((input_el) => {
    let name;
    if (!(name = input_el.getAttribute('name'))) return; // need named inputs to set up an object
    validator = kb.inputValidator(view_model, input_el, validation_options);
    !validator || validators.push(results[name] = validator);
  });

  // collect stats, error count and valid
  results.$error_count = ko.computed(() => {
    let error_count = 0;
    validators.forEach((validator) => { error_count += validator().$error_count; });
    return error_count;
  });
  results.$valid = ko.computed(() => results.$error_count() === 0);

  // enabled and disabled
  results.$enabled = ko.computed(() => {
    let enabled = true;
    validators.forEach((validator) => { enabled &= validator().$enabled; });
    return enabled;
  });
  results.$disabled = ko.computed(() => !results.$enabled());

  // if there is a name, add to the view_model with $scoping
  if (form_name) { view_model[`$${form_name}`] = results; }
  return results;
};
