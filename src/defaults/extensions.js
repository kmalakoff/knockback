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

kb.Observable.prototype.setToDefault = () => { if (this.__kb_value && this.__kb_value.setToDefault) this.__kb_value.setToDefault(); };
kb.ViewModel.prototype.setToDefault = () => {
  for (const vm_key in this.__kb.vm_keys) {
    const value = this[vm_key];
    if (value.__kb_value && value.__kb_value.setToDefault) value.__kb_value.setToDefault();
  }
};

// @example
//   var model = new Backbone.Model({name: 'Bob'});
//   var view_model = {
//     wrapped_name: kb.defaultWrapper(kb.observable(model, 'name'), '(no name)')
//   }; // view_model.wrapped name: Bob
//   kb.utils.setToDefault(view_model); // view_model.wrapped name: (no name)
kb.utils.setToDefault = function (obj) {
  if (!obj) return;

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
