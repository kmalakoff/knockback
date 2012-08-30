###
  knockback_statistics.js
  (c) 2012 Kevin Malakoff.
  Knockback.Stats is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

if (typeof(require) isnt 'undefined') then _ = require('underscore') else _ = window._
_ = _._ if _ and _.hasOwnProperty('_') # LEGACY
kb = if not window.kb and (typeof(require) isnt 'undefined') then require('knockback') else window.kb

class kb.Statistics
  constructor: ->
    @model_events_tracker = []
    @registered_tracker = {}

  clear: ->
    @model_events_tracker = []

  ###############################
  # Registered Events
  ###############################
  addModelEvent: (event) ->
    @model_events_tracker.push(event)

  modelEventsStatsString: ->
    stats_string = ''
    stats_string += "Total Count: #{@model_events_tracker.length}"
    event_groups = _.groupBy(@model_events_tracker, (test) -> return "event name: '#{test.name}', attribute name: '#{test.key}'")
    for key, value of event_groups
      stats_string += "\n #{key}, count: #{value.length}"
    return stats_string

  ###############################
  # Registered Observables and View Models
  ###############################
  register: (key, obj) ->
    @registeredTracker(key).push(obj)

  unregister: (key, obj) ->
    type_tracker = @registeredTracker(key)
    index = _.indexOf(type_tracker, obj)
    console.log("kb.Statistics: failed to unregister type: #{key}") if index < 0
    type_tracker.splice(index, 1)

  registeredCount: (type) ->
    return @registeredTracker(type).length if type
    count = 0
    count += type_tracker.length for type, type_tracker of @registered_tracker[type]
    return count

  registeredStatsString: (success_message) ->
    stats_string = ''
    for type, type_tracker of @registered_tracker
      continue unless type_tracker.length
      stats_string += '\n ' if written
      stats_string += "#{if type then type else 'No Name'}: #{type_tracker.length}"
      written = true
    return if stats_string then stats_string else success_message

  registeredTracker: (key) ->
    return @registered_tracker[key] if @registered_tracker.hasOwnProperty(key)
    type_tracker = []; @registered_tracker[key] = type_tracker
    return type_tracker