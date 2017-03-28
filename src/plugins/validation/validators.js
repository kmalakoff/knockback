/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

import _ from 'underscore';
import ko from 'knockout';

// Convention is that if they end in Fn then returns a function pointer based on parameters passed.
export const hasChangedFn = (model) => {
  let m = null; let attributes = null;
  return () => {
    const current_model = ko.utils.unwrapObservable(model);
    if (m !== current_model) { // change in model
      m = current_model;
      attributes = (m ? m.toJSON() : null);
      return false;
    }
    if (!(m && attributes)) return false;
    return !_.isEqual(m.toJSON(), attributes);
  };
};

export const minLengthFn = length => value => !value || (value.length < length);

export const uniqueValueFn = (model, key, collection) =>
  function (value) {
    const m = ko.utils.unwrapObservable(model); const k = ko.utils.unwrapObservable(key); const c = ko.utils.unwrapObservable(collection);
    if (!(m && k && c)) return false;
    return !!_.find(c.models, test => (test !== m) && (test.get(k) === value));
  }
;

export const untilTrueFn = function (stand_in, fn, model) {
  let was_true = false;
  if (model && ko.isObservable(model)) model.subscribe(() => { was_true = false; }); // reset if the model changes
  return function (value) {
    const f = ko.utils.unwrapObservable(fn);
    if (!f) return ko.utils.unwrapObservable(stand_in);
    const result = f(ko.utils.unwrapObservable(value));
    was_true |= !!result;
    return was_true ? result : ko.utils.unwrapObservable(stand_in);
  };
};

export const untilFalseFn = function (stand_in, fn, model) {
  let was_false = false;
  if (model && ko.isObservable(model)) model.subscribe(() => { was_false = false; }); // reset if the model changes
  return function (value) {
    const f = ko.utils.unwrapObservable(fn);
    if (!f) return ko.utils.unwrapObservable(stand_in);
    const result = f(ko.utils.unwrapObservable(value));
    was_false |= !result;
    return was_false ? result : ko.utils.unwrapObservable(stand_in);
  };
};
