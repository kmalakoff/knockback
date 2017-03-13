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

// Regular expressions from Angular.js: https://github.com/angular/angular.js
const URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
const EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
const NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

// A validator should return true if there are errors (similar to the binding check in HTML, eg. $name().required).
kb.valid = {
  required(value) { return !value; },
  url(value) { return !URL_REGEXP.test(value); },
  email(value) { return !EMAIL_REGEXP.test(value); },
  number(value) { return !NUMBER_REGEXP.test(value); },
};

// Convention is that if they end in Fn then returns a function pointer based on parameters passed.
kb.hasChangedFn = function (model) {
  let m = null; let attributes = null;
  return function () {
    let current_model;
    if (m !== (current_model = ko.utils.unwrapObservable(model))) { // change in model
      m = current_model;
      attributes = (m ? m.toJSON() : null);
      return false;
    }
    if (!(m && attributes)) { return false; }
    return !_.isEqual(m.toJSON(), attributes);
  };
};

kb.minLengthFn = length => value => !value || (value.length < length);

kb.uniqueValueFn = (model, key, collection) =>
  function (value) {
    const m = ko.utils.unwrapObservable(model); const k = ko.utils.unwrapObservable(key); const c = ko.utils.unwrapObservable(collection);
    if (!(m && k && c)) { return false; }
    return !!_.find(c.models, test => (test !== m) && (test.get(k) === value));
  }
;

kb.untilTrueFn = function (stand_in, fn, model) {
  let was_true = false;
  if (model && ko.isObservable(model)) { model.subscribe(() => was_true = false); } // reset if the model changes
  return function (value) {
    let f,
      result;
    if (!(f = ko.utils.unwrapObservable(fn))) { return ko.utils.unwrapObservable(stand_in); }
    was_true |= !!(result = f(ko.utils.unwrapObservable(value)));
    return (was_true ? result : ko.utils.unwrapObservable(stand_in));
  };
};

kb.untilFalseFn = function (stand_in, fn, model) {
  let was_false = false;
  if (model && ko.isObservable(model)) { model.subscribe(() => was_false = false); } // reset if the model changes
  return function (value) {
    let f,
      result;
    if (!(f = ko.utils.unwrapObservable(fn))) { return ko.utils.unwrapObservable(stand_in); }
    was_false |= !(result = f(ko.utils.unwrapObservable(value)));
    return (was_false ? result : ko.utils.unwrapObservable(stand_in));
  };
};
