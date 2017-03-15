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

const arraySlice = Array.prototype.slice;

kb.toFormattedString = function (format) {
  let result = format.slice();
  const args = arraySlice.call(arguments, 1);
  for (const index in args) {
    const arg = args[index];
    let value = ko.utils.unwrapObservable(arg);
    if (_.isUndefined(value) || _.isNull(value)) { value = ''; }

    let parameter_index = format.indexOf(`\{${index}\}`);
    while (parameter_index >= 0) {
      result = result.replace(`{${index}}`, value);
      parameter_index = format.indexOf(`\{${index}\}`, parameter_index + 1);
    }
  }
  return result;
};

kb.parseFormattedString = function (string, format) {
  let parameter_index;
  let regex_string = format.slice(); let index = 0; let parameter_count = 0; const positions = {};
  while (regex_string.search(`\\{${index}\\}`) >= 0) {
    // store the positions of the replacements
    parameter_index = format.indexOf(`\{${index}\}`);
    while (parameter_index >= 0) {
      regex_string = regex_string.replace(`\{${index}\}`, '(.*)');
      positions[parameter_index] = index; parameter_count++;
      parameter_index = format.indexOf(`\{${index}\}`, parameter_index + 1);
    }
    index++;
  }
  let count = index;

  const regex = new RegExp(regex_string);
  const matches = regex.exec(string);
  if (matches) { matches.shift(); }
  // return fake empty data
  if (!matches || (matches.length !== parameter_count)) {
    const result = [];
    while (count-- > 0) { result.push(''); }
    return result;
  }

  // sort the matches since the parameters could be requested unordered
  const sorted_positions = _.sortBy(_.keys(positions), (parameter_index, format_index) => parseInt(parameter_index, 10));
  const format_indices_to_matched_indices = {};
  for (const match_index in sorted_positions) {
    parameter_index = sorted_positions[match_index];
    index = positions[parameter_index];
    if (format_indices_to_matched_indices.hasOwnProperty(index)) { continue; }
    format_indices_to_matched_indices[index] = match_index;
  }

  const results = []; index = 0;
  while (index < count) {
    results.push(matches[format_indices_to_matched_indices[index]]);
    index++;
  }
  return results;
};

// Handles two-way formatted string convertions and will reformat a string when any argument changes. The format string can also be an observable.
//
// @example change the formatted name whenever a model's name attribute changes
//   var observable = kb.formattedObservable("{0} and {1}", arg1, arg2);
module.exports = kb.FormattedObservable = class FormattedObservable {

  // Used to create a new kb.FormattedObservable.
  //
  // @param [String|ko.observable] format the format string. Format: `"{0} and {1}"` where `{0}` and `{1}` would be synchronized with the arguments (eg. "Bob and Carol" where `{0}` is Bob and `{1}` is Carol)
  // @param [Array] args arguments to be passed to the kb.LocaleManager's get() method
  // @return [ko.observable] the constructor does not return 'this' but a ko.observable
  // @note the constructor does not return 'this' but a ko.observable
  constructor(format, args) {
    // being called by the factory function
    const observable_args = _.isArray(args) ? args : arraySlice.call(arguments, 1);
    const observable = kb.utils.wrappedObservable(this, ko.computed({
      read() {
        args = [ko.utils.unwrapObservable(format)];
        _.each(observable_args, arg => args.push(ko.utils.unwrapObservable(arg)));
        return kb.toFormattedString.apply(null, args);
      },
      write(value) {
        const matches = kb.parseFormattedString(value, ko.utils.unwrapObservable(format));
        const max_count = Math.min(observable_args.length, matches.length); let index = 0;
        while (index < max_count) {
          observable_args[index](matches[index]);
          index++;
        }
      },
    }));

    return observable;
  }

  // Required clean up function to break cycles, release view models, etc.
  // Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy() { return kb.utils.wrappedDestroy(this); }
};

kb.formattedObservable = function (format, args) { return new kb.FormattedObservable(format, arraySlice.call(arguments, 1)); };
kb.observableFormatted = kb.formattedObservable;
