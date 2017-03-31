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

import kb from '@knockback/core';

kb.Observable.prototype.setToDefault = function () {
  if (this.__kb_value && this.__kb_value.setToDefault) this.__kb_value.setToDefault();
};

kb.ViewModel.prototype.setToDefault = function () {
  _.each(this.__kb.vm_keys, (value) => {
    if (value.__kb_value && value.__kb_value.setToDefault) value.__kb_value.setToDefault();
  });
};

// @example
//   var model = new Backbone.Model({name: 'Bob'});
//   var view_model = {
//     wrapped_name: kb.defaultWrapper(kb.observable(model, 'name'), '(no name)')
//   }; // view_model.wrapped name: Bob
//   kb.utils.setToDefault(view_model); // view_model.wrapped name: (no name)
kb.utils.setToDefault = function (obj) {
  if (!obj) return undefined;

  // observable
  if (ko.isObservable(obj)) {
    if (typeof obj.setToDefault === 'function') obj.setToDefault();

  // view model
  } else if (_.isObject(obj)) {
    _.each(obj, (value, key) => {
      if (value && (ko.isObservable(value) || (typeof (value) !== 'function')) && ((key[0] !== '_') || key.search('__kb'))) this.setToDefault(value);
    });
  }

  return obj;
};
