###
  knockback_formatted_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.FormattedObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###
throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file') if not this.Knockback

Knockback.toFormattedString = (format) ->
  result = format.slice()
  args = Array.prototype.slice.call(arguments, 1)
  for index, arg of args
    value = ko.utils.unwrapObservable(arg)
    value = '' if not value

    parameter_index = format.indexOf("\{#{index}\}")
    while (parameter_index>=0)
      result = result.replace("{#{index}}", value)
      parameter_index = format.indexOf("\{#{index}\}", parameter_index+1)
  return result

Knockback.parseFormattedString = (string, format) ->
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
  return _.map([1..count], -> return '') if not matches or (matches.length!=parameter_count)

  # sort the matches since the parameters could be requested unordered
  sorted_positions = _.sortBy(_.keys(positions), (parameter_index, format_index)->return parseInt(parameter_index,10))
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

######################################
# Knockback.formattedObservable to provide two-way formtted string convertions
# Provide a format string with observable and/or non observable arguments in the form of:
#   kb.formattedObservable("Something {0} and {1} and you know", arg1, arg2)
######################################
Knockback.formattedObservable = (format, args) ->
  observable_args = Array.prototype.slice.call(arguments, 1)
  result = ko.dependentObservable({
    read: ->
      args = [ko.utils.unwrapObservable(format)]
      args.push(ko.utils.unwrapObservable(arg)) for arg in observable_args
      return kb.toFormattedString.apply(null, args)
    write: (value) ->
      matches = kb.parseFormattedString(value, ko.utils.unwrapObservable(format))
      max_count = Math.min(observable_args.length, matches.length); index = 0
      while (index<max_count)
        observable_args[index](matches[index])
        index++
  })
  return result
