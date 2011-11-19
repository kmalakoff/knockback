###
  knockback.js 0.11.1
  (c) 2011 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
###
throw new Error('Knockback: Dependency alert! Knockout.js must be included before this file') if not this.ko
throw new Error('Knockback: Dependency alert! Backbone.js must be included before this file') if not this.Backbone
throw new Error('Knockback: Dependency alert! Underscore.js must be included before this file') if not this._ or not this._.VERSION

# define namspaces
this.Knockback||this.Knockback={}; this.kb||this.kb=this.Knockback

# Current version.
Knockback.VERSION = '0.11.1'

# Locale Manager - if you are using localization, set this property.
# It must have Backbone.Events mixed in and implement a get method like Backbone.Model, eg. get: (attribute_name) -> return somthing
Knockback.locale_manager

# helpers
Knockback.wrappedObservable = (instance) ->
  throw new Error('Knockback: _kb_observable missing from your instance') if not instance._kb_observable
  return instance._kb_observable

Knockback.vmRelease = (view_model) ->
  (view_model.release(); return) if (view_model instanceof kb.ViewModel)
  Knockback.vmDestroyObservables(view_model)

Knockback.vmDestroyObservables = (view_model, keys) ->
  for key, value of view_model
    do (key, value) ->
      return if not value
      return if keys and not _.contains(keys, key) # skip
      return if not (ko.isObservable(value) or (value instanceof kb.Observables) or (value instanceof kb.ViewModel))
      view_model[key] = null
      if value.destroy
        value.destroy()
      else if value.dispose
        value.dispose()
      else if value.release
        value.release()

Knockback.attributeConnector = (model, key, read_only) ->
  result = ko.observable(model.get(key))
  result.subscription = result.subscribe((value) ->
    if read_only
      value = model.get(key)
      return if result() == value
      result(value)
      throw "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters."
    set_info = {}; set_info[key] = value
    model.set(set_info)
  )
  return result

Knockback.defaultWrapper = (observable, default_value) ->
  result = ko.dependentObservable({
    read: ->
      value = ko.utils.unwrapObservable(observable())
      return if not value then ko.utils.unwrapObservable(default_value) else value
    write: (value) -> observable(value)
    owner: {}
  })
  return result

Knockback.toFormattedString = (format) ->
  result = format.slice()
  args = Array.prototype.slice.call(arguments, 1)
  for index, arg of args
    do (index, arg) ->
      value = ko.utils.unwrapObservable(arg)
      value = '' if not value
      result = result.replace("{#{index}}", value)
  return result

Knockback.parseFormattedString = (string, format) ->
  regex_string = format.slice(); index = 0; positions = {}
  while(regex_string.search("\\{#{index}\\}")>=0)
    regex_string = regex_string.replace("\{#{index}\}", '(.*)')

    # store the positions of the replacements
    parameter_index = format.indexOf("\{#{index}\}")
    while (parameter_index>=0)
      positions[parameter_index] = index
      parameter_index = format.indexOf("\{#{index}\}", parameter_index+1)
    index++
  count = index

  regex = new RegExp(regex_string)
  matches = regex.exec(string)
  matches.shift() if (matches)
  return null if not matches or (matches.length!=index)

  # sort the matches since the parameters could be requested unordered
  sorted_positions = _.sortBy(_.keys(positions), (parameter_index, format_index)->return parseInt(parameter_index,10))
  format_indices_to_matched_indices = {}
  for match_index, parameter_index of sorted_positions
    do (match_index, parameter_index) ->
      index = positions[parameter_index]
      return if format_indices_to_matched_indices.hasOwnProperty(index)
      format_indices_to_matched_indices[index] = match_index

  results = []; index=0
  while (index<count)
    results.push(matches[format_indices_to_matched_indices[index]])
    index++
  return results

Knockback.formatWrapper = (format, args) ->
  observable_args = Array.prototype.slice.call(arguments, 1)
  result = ko.dependentObservable({
    read: ->
      args = [format]
      args.push(ko.utils.unwrapObservable(arg)) for arg in observable_args
      return kb.toFormattedString.apply(null, args)
    write: (value) ->
      matches = kb.parseFormattedString(value, format)
      max_count = Math.min(observable_args.length, matches.length); index = 0
      while (index<max_count)
        observable_args[index](matches[index])
        index++
    owner: {}
  })
  return result

