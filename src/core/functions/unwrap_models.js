/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let unwrapModels;
const { _ } = require('../kb');

// @nodoc
module.exports = (unwrapModels = function (obj) {
  if (!obj) { return obj; }

  if (obj.__kb) { return (obj.__kb.hasOwnProperty('object') ? obj.__kb.object : obj); }
  if (_.isArray(obj)) { return _.map(obj, test => unwrapModels(test)); }
  if (_.isObject(obj) && (obj.constructor === {}.constructor)) { // a simple object
    const result = {};
    for (const key in obj) { const value = obj[key]; result[key] = unwrapModels(value); }
    return result;
  }

  return obj;
});
