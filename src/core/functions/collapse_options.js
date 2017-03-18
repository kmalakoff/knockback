/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

const kb = require('../kb');
const { _ } = kb;

// @nodoc
const _mergeArray = function (result, key, value) {
  if (!result[key]) result[key] = [];
  if (!_.isArray(value)) value = [value];
  result[key] = result[key].length ? _.union(result[key], value) : value;
  return result;
};

// @nodoc
const _mergeObject = function (result, key, value) {
  if (!result[key]) result[key] = {};
  return kb.assign(result[key], value);
};

// @nodoc
const _keyArrayToObject = function (value) {
  const result = {};
  _.each(value, (item) => { result[item] = { key: item }; });
  return result;
};

var _mergeOptions = function (result, options) {
  if (!options) return result;

  for (const key in options) {
    let value = options[key];
    switch (key) {
      case 'internals': case 'requires': case 'excludes': case 'statics': _mergeArray(result, key, value); break;
      case 'keys':
        // an object
        if ((_.isObject(value) && !_.isArray(value)) || (_.isObject(result[key]) && !_.isArray(result[key]))) {
          if (!_.isObject(value)) { value = [value]; }
          if (_.isArray(value)) { value = _keyArrayToObject(value); }
          if (_.isArray(result[key])) { result[key] = _keyArrayToObject(result[key]); }
          _mergeObject(result, key, value);

        // an array
        } else {
          _mergeArray(result, key, value);
        }
        break;

      case 'factories':
        if (_.isFunction(value)) { result[key] = value; } else { _mergeObject(result, key, value); }
        break;
      case 'static_defaults': _mergeObject(result, key, value); break;
      case 'options': break;
      default: result[key] = value; break;
    }
  }

  return _mergeOptions(result, options.options);
};

// @nodoc
module.exports = options => _mergeOptions({}, options);
