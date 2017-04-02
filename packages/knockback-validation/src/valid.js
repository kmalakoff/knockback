/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

// Regular expressions from Angular.js: https://github.com/angular/angular.js
const URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/;
const EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
const NUMBER_REGEXP = /^\s*(-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

// A validator should return true if there are errors (similar to the binding check in HTML, eg. $name().required).
const valid = {
  required(value) { return !value; },
  url(value) { return !URL_REGEXP.test(value); },
  email(value) { return !EMAIL_REGEXP.test(value); },
  number(value) { return !NUMBER_REGEXP.test(value); },
};
export default valid;
