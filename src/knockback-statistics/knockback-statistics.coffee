###
  knockback_statistics.js 0.17.2
  (c) 2012 Kevin Malakoff.
  Knockback.Stats is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# kb.Statistics is an optional components that is useful for measuring your application's performance. You can record all of the Backbone.Events that have triggered ko.observable subscription updates and the memory footprint (instance count-only) of your ViewModels and collection observables.
#
# kb.Statistics is not included in `knockback.js` nor `knockback-core.js` so you need to manually include it from the `lib` directory.
#
class kb.Statistics
  constructor: ->
    @model_events_tracker = []
    @registered_tracker = {}

  # Clear the tracked model events (but keep the registered objects intact)
  clear: ->
    @model_events_tracker = []

  ###############################
  # Registered Events
  ###############################

  # Register a model event
  addModelEvent: (event) ->
    @model_events_tracker.push(event)

  # A debug helper to summarize the registered events in human-readable form
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

  # Register an object by key
  register: (key, obj) ->
    @registeredTracker(key).push(obj)

  # Unregister an object by key
  unregister: (key, obj) ->
    type_tracker = @registeredTracker(key)
    index = _.indexOf(type_tracker, obj)
    console.log("kb.Statistics: failed to unregister type: #{key}") if index < 0
    type_tracker.splice(index, 1)

  # @return [Integer] the number of registered objects by type
  registeredCount: (type) ->
    return @registeredTracker(type).length if type
    count = 0
    count += type_tracker.length for type, type_tracker of @registered_tracker[type]
    return count

  # A debug helper to summarize the current registered objects by key
  #
  # @param [String] success_message a message to return if there are no registered objects
  # @return [String] a human readable string summarizing the currently registered objects or success_message
  registeredStatsString: (success_message) ->
    stats_string = ''
    for type, type_tracker of @registered_tracker
      continue unless type_tracker.length
      stats_string += '\n ' if written
      stats_string += "#{if type then type else 'No Name'}: #{type_tracker.length}"
      written = true
    return if stats_string then stats_string else success_message

  # @private
  registeredTracker: (key) ->
    return @registered_tracker[key] if @registered_tracker.hasOwnProperty(key)
    type_tracker = []; @registered_tracker[key] = type_tracker
    return type_tracker