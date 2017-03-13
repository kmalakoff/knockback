/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let kb;
const { _ } = (kb = require('./kb'));

// kb.Statistics is an optional components that is useful for measuring your application's performance. You can record all of the Backbone.Events that have triggered ko.observable subscription updates and the memory footprint (instance count-only) of your ViewModels and collection observables.
//
// kb.Statistics is not included in `knockback.js` nor `knockback-core.js` so you need to manually include it from the `lib` directory.
//
module.exports = kb.Statistics = class Statistics {
  constructor() {
    this.model_events_tracker = [];
    this.registered_tracker = {};
  }

  // Clear the tracked model events (but keep the registered objects intact)
  clear() {
    return this.model_events_tracker = [];
  }

  // ##############################
  // Registered Events
  // ##############################

  // Register a model event
  addModelEvent(event) {
    return this.model_events_tracker.push(event);
  }

  // A debug helper to summarize the registered events in human-readable form
  modelEventsStatsString() {
    let stats_string = '';
    stats_string += `Total Count: ${this.model_events_tracker.length}`;
    const event_groups = _.groupBy(this.model_events_tracker, test => `event name: '${test.name}', attribute name: '${test.key}'`);
    for (const key in event_groups) {
      const value = event_groups[key];
      stats_string += `\n ${key}, count: ${value.length}`;
    }
    return stats_string;
  }

  // ##############################
  // Registered Observables and View Models
  // ##############################

  // Register an object by key
  register(key, obj) {
    return this.registeredTracker(key).push(obj);
  }

  // Unregister an object by key
  unregister(key, obj) {
    let index;
    const type_tracker = this.registeredTracker(key);
    if ((index = _.indexOf(type_tracker, obj)) < 0) { return (typeof console !== 'undefined' && console !== null ? console.log(`kb.Statistics: failed to unregister type: ${key}`) : undefined); }
    return type_tracker.splice(index, 1);
  }

  // @return [Integer] the number of registered objects by type
  registeredCount(type) {
    if (type) { return this.registeredTracker(type).length; }
    let count = 0;
    for (type in this.registered_tracker[type]) { const type_tracker = this.registered_tracker[type][type]; count += type_tracker.length; }
    return count;
  }

  // A debug helper to summarize the current registered objects by key
  //
  // @param [String] success_message a message to return if there are no registered objects
  // @return [String] a human readable string summarizing the currently registered objects or success_message
  registeredStatsString(success_message) {
    let stats_string = '';
    for (const type in this.registered_tracker) {
      const type_tracker = this.registered_tracker[type];
      if (!type_tracker.length) { continue; }
      if (written) { stats_string += '\n '; }
      stats_string += `${type || 'No Name'}: ${type_tracker.length}`;
      var written = true;
    }
    return stats_string || success_message;
  }

  // @nodoc
  registeredTracker(key) {
    if (this.registered_tracker.hasOwnProperty(key)) { return this.registered_tracker[key]; }
    const type_tracker = []; this.registered_tracker[key] = type_tracker;
    return type_tracker;
  }

  static eventsStats(obj, key) {
    const stats = { count: 0 };

    const events = obj._events || obj._callbacks || {};
    for (key of (key ? [key] : _.keys(events))) {
      var node;
      if ((node = events[key])) {
        if (_.isArray(node)) {
          stats[key] = _.compact(node).length;
        } else {
          stats[key] = 0; const { tail } = node;
          while ((node = node.next) !== tail) { stats[key]++; }
        }
        stats.count += stats[key];
      }
    }
    return stats;
  }
};
