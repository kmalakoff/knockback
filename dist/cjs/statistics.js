/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */ /*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/ "use strict";
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var kb;
var _ = (kb = require("./kb"))._;
// kb.Statistics is an optional components that is useful for measuring your application's performance. You can record all of the Backbone.Events that have triggered ko.observable subscription updates and the memory footprint (instance count-only) of your ViewModels and collection observables.
//
// kb.Statistics is not included in `knockback.js` nor `knockback-core.js` so you need to manually include it from the `lib` directory.
//
module.exports = kb.Statistics = /*#__PURE__*/ function() {
    "use strict";
    function Statistics() {
        _class_call_check(this, Statistics);
        this.model_events_tracker = [];
        this.registered_tracker = {};
    }
    _create_class(Statistics, [
        {
            // Clear the tracked model events (but keep the registered objects intact)
            key: "clear",
            value: function clear() {
                return this.model_events_tracker = [];
            }
        },
        {
            //##############################
            // Registered Events
            //##############################
            // Register a model event
            key: "addModelEvent",
            value: function addModelEvent(event) {
                return this.model_events_tracker.push(event);
            }
        },
        {
            // A debug helper to summarize the registered events in human-readable form
            key: "modelEventsStatsString",
            value: function modelEventsStatsString() {
                var stats_string = "";
                stats_string += "Total Count: ".concat(this.model_events_tracker.length);
                var event_groups = _.groupBy(this.model_events_tracker, function(test) {
                    return "event name: '".concat(test.name, "', attribute name: '").concat(test.key, "'");
                });
                for(var key in event_groups){
                    var value = event_groups[key];
                    stats_string += "\n ".concat(key, ", count: ").concat(value.length);
                }
                return stats_string;
            }
        },
        {
            //##############################
            // Registered Observables and View Models
            //##############################
            // Register an object by key
            key: "register",
            value: function register(key, obj) {
                return this.registeredTracker(key).push(obj);
            }
        },
        {
            // Unregister an object by key
            key: "unregister",
            value: function unregister(key, obj) {
                var index;
                var type_tracker = this.registeredTracker(key);
                if ((index = _.indexOf(type_tracker, obj)) < 0) {
                    return typeof console !== "undefined" && console !== null ? console.log("kb.Statistics: failed to unregister type: ".concat(key)) : undefined;
                }
                return type_tracker.splice(index, 1);
            }
        },
        {
            // @return [Integer] the number of registered objects by type
            key: "registeredCount",
            value: function registeredCount(type) {
                if (type) {
                    return this.registeredTracker(type).length;
                }
                var count = 0;
                for(type in this.registered_tracker[type]){
                    var type_tracker = this.registered_tracker[type][type];
                    count += type_tracker.length;
                }
                return count;
            }
        },
        {
            // A debug helper to summarize the current registered objects by key
            //
            // @param [String] success_message a message to return if there are no registered objects
            // @return [String] a human readable string summarizing the currently registered objects or success_message
            key: "registeredStatsString",
            value: function registeredStatsString(success_message) {
                var stats_string = "";
                for(var type in this.registered_tracker){
                    var type_tracker = this.registered_tracker[type];
                    if (!type_tracker.length) {
                        continue;
                    }
                    if (written) {
                        stats_string += "\n ";
                    }
                    stats_string += "".concat(type ? type : "No Name", ": ").concat(type_tracker.length);
                    var written = true;
                }
                if (stats_string) {
                    return stats_string;
                }
                return success_message;
            }
        },
        {
            // @nodoc
            key: "registeredTracker",
            value: function registeredTracker(key) {
                if (this.registered_tracker.hasOwnProperty(key)) {
                    return this.registered_tracker[key];
                }
                var type_tracker = [];
                this.registered_tracker[key] = type_tracker;
                return type_tracker;
            }
        }
    ], [
        {
            key: "eventsStats",
            value: function eventsStats(obj, key) {
                var stats = {
                    count: 0
                };
                var events = obj._events || obj._callbacks || {};
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = Array.from(key ? [
                        key
                    ] : _.keys(events))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        key = _step.value;
                        var node;
                        if (node = events[key]) {
                            if (_.isArray(node)) {
                                stats[key] = _.compact(node).length;
                            } else {
                                stats[key] = 0;
                                var tail = node.tail;
                                while((node = node.next) !== tail){
                                    stats[key]++;
                                }
                            }
                            stats.count += stats[key];
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return stats;
            }
        }
    ]);
    return Statistics;
}();
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }