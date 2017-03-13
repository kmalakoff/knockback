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

kb.Observable.prototype.setToDefault = function () { __guardMethod__(this.__kb_value, 'setToDefault', o => o.setToDefault()); };
kb.ViewModel.prototype.setToDefault = function () { for (const vm_key in this.__kb.vm_keys) { __guardMethod__(this[vm_key], 'setToDefault', o => o.setToDefault()); return; } };

// @example
//   var model = new Backbone.Model({name: 'Bob'});
//   var view_model = {
//     wrapped_name: kb.defaultWrapper(kb.observable(model, 'name'), '(no name)')
//   }; // view_model.wrapped name: Bob
//   kb.utils.setToDefault(view_model); // view_model.wrapped name: (no name)
kb.utils.setToDefault = function (obj) {
  if (!obj) { return; }

  // observable
  if (ko.isObservable(obj)) {
    if (typeof obj.setToDefault === 'function') {
      obj.setToDefault();
    }

  // view model
  } else if (_.isObject(obj)) {
    for (const key in obj) {
      const value = obj[key];
      if (value && (ko.isObservable(value) || (typeof (value) !== 'function')) && ((key[0] !== '_') || key.search('__kb'))) { this.setToDefault(value); }
    }
  }
  return obj;
};
function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  }
  return undefined;
}
