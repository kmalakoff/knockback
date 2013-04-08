###
  knockback-formatted-observable.js 0.17.2
  (c) 2011-2013 Kevin Malakoff.
  Knockback.FormattedObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

arraySlice = Array.prototype.slice

kb.toFormattedString = (format) ->
  result = format.slice()
  args = arraySlice.call(arguments, 1)
  for index, arg of args
    value = _unwrapObservable(arg)
    value or= ''

    parameter_index = format.indexOf("\{#{index}\}")
    while (parameter_index>=0)
      result = result.replace("{#{index}}", value)
      parameter_index = format.indexOf("\{#{index}\}", parameter_index+1)
  return result

kb.parseFormattedString = (string, format) ->
  regex_string = format.slice(); index = 0; parameter_count = 0; positions = {}
  while(regex_string.search("\\{#{index}\\}")>=0)
    # store the positions of the replacements
    parameter_index = format.indexOf("\{#{index}\}")
    while (parameter_index>=0)
      regex_string = regex_string.replace("\{#{index}\}", '(.*)')
      positions[parameter_index] = index; parameter_count++
      parameter_index = format.indexOf("\{#{index}\}", parameter_index+1)
    index++
  count = index

  regex = new RegExp(regex_string)
  matches = regex.exec(string)
  matches.shift() if (matches)
  # return fake empty data
  if not matches or (matches.length isnt parameter_count)
    result = []
    result.push('') while count-- > 0
    return result

  # sort the matches since the parameters could be requested unordered
  sorted_positions = _.sortBy(_.keys(positions), (parameter_index, format_index) -> return parseInt(parameter_index,10))
  format_indices_to_matched_indices = {}
  for match_index, parameter_index of sorted_positions
    index = positions[parameter_index]
    continue if format_indices_to_matched_indices.hasOwnProperty(index)
    format_indices_to_matched_indices[index] = match_index

  results = []; index=0
  while (index<count)
    results.push(matches[format_indices_to_matched_indices[index]])
    index++
  return results

# Handles two-way formatted string convertions and will reformat a string when any argument changes. The format string can also be an observable.
#
# @example change the formatted name whenever a model's name attribute changes
#   var observable = kb.formattedObservable("{0} and {1}", arg1, arg2);
class kb.FormattedObservable

  # Used to create a new kb.FormattedObservable.
  #
  # @param [String|ko.observable] format the format string. Format: `"{0} and {1}"` where `{0}` and `{1}` would be synchronized with the arguments (eg. "Bob and Carol" where `{0}` is Bob and `{1}` is Carol)
  # @param [Array] args arguments to be passed to the kb.LocaleManager's get() method
  # @return [ko.observable] the constructor does not return 'this' but a ko.observable
  # @note the constructor does not return 'this' but a ko.observable
  constructor: (format, args) ->
    # being called by the factory function
    if _.isArray(args)
      format = format
      observable_args = args
    else
      observable_args = arraySlice.call(arguments, 1)

    observable = kb.utils.wrappedObservable(@, ko.dependentObservable({
      read: ->
        args = [_unwrapObservable(format)]
        args.push(_unwrapObservable(arg)) for arg in observable_args
        return kb.toFormattedString.apply(null, args)
      write: (value) ->
        matches = kb.parseFormattedString(value, _unwrapObservable(format))
        max_count = Math.min(observable_args.length, matches.length); index = 0
        while (index<max_count)
          observable_args[index](matches[index])
          index++
        return
    }))

    return observable

  # Required clean up function to break cycles, release view models, etc.
  # Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy: -> kb.utils.wrappedDestroy(@)

kb.formattedObservable = (format, args) -> return new kb.FormattedObservable(format, arraySlice.call(arguments, 1))