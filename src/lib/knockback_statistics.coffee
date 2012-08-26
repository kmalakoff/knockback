###
  knockback_statistics.js
  (c) 2012 Kevin Malakoff.
  Knockback.Stats is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

if (typeof(require) != 'undefined') then _ = require('underscore') else _ = window._
_ = _._ if _ and _.hasOwnProperty('_') # LEGACY
kb = if not window.kb and (typeof(require) != 'undefined') then require('knockback') else window.kb

class kb.Statistics
  constructor: ->
    @type_trackers = {}
    @events = []

  typeTracker: (type) ->
    return @type_trackers[type] if @type_trackers.hasOwnProperty(type)
    type_tracker = []; @type_trackers[type] = type_tracker
    return type_tracker

  addEvent: (event) ->
    @events.push(event)

  register: (obj) ->
    @typeTracker(obj.constructor.name).push(obj)

  unregister: (obj) ->
    type_tracker = @typeTracker(obj.constructor.name)
    index = _.indexOf(type_tracker, obj)
    throw "failed to unregister type: #{obj.constructor.name}" if index < 0
    type_tracker.splice(index, 1)

  registeredCount: (type) ->
    return @typeTracker(type).length if type
    count = 0
    count += type_tracker.length for type, type_tracker of @type_trackers[type]
    return count

  registeredTypeStatsString: (success_message) ->
    string = ''
    for type, type_tracker of @type_trackers
      continue unless type_tracker.length
      string += ' | ' if written
      string += "#{type}: #{type_tracker.length}"
      written = true
    return if string then string else success_message