/*
  knockback-statistics.js
  (c) 2011-2014 Kevin Malakoff.
  Knockback is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
    Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
(function() {
  var globals = {requires: []};
if (window.require) globals.requires.push(window.require);
if (typeof require !== "undefined" && require !== null) globals.requires.push(require);

/* local-only brunch-like require (based on https://github.com/brunch/commonjs-require-definition) */
(function() {
  'use strict';

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    var _require = function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
    _require.register = globals.require.register;
    _require.shim = globals.require.shim;
    return _require;
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var toString = Object.prototype.toString;
  var isArray = function(obj) { return toString.call(obj) === '[object Array]'; }

  // client shimming to add to local module system
  var shim = function(info) {
    if (typeof window === "undefined") return;
    if (!isArray(info)) info = [info];

    var iterator = function(item) {
      var dep;

      // already registered with local require
      try { if (globals.require(item.path)) { return; } } catch (e) {}

      // use external require
      try { for (var ext_i = 0, ext_length = globals.requires.length; ext_i < ext_length; ext_i++) {if (dep = globals.requires[ext_i](item.path)) break;}} catch (e) {}

      // use symbol path on window
      if (!dep && item.symbol) {
        var components = item.symbol.split('.');
        dep = window;
        for (var i = 0, length = components.length; i < length; i++) { if (!(dep = dep[components[i]])) break; }
      }

      // not found
      if (!dep) {
        if (item.optional) return;
        throw new Error("Missing dependency: " + item.path);
      }

      // register with local require
      globals.require.register(item.path, (function(exports, require, module) { return module.exports = dep; }));
      if (item.alias) { globals.require.register(item.alias, (function(exports, require, module) { return module.exports = dep; })); }
    };

    for (var i = 0, length = info.length; i < length; i++) { iterator(info[i]); }
  };

  globals.require = require;
  globals.require.register = define;
  globals.require.shim = shim;
}).call(this);
var require = globals.require;
require.register('index', function(exports, require, module) {
if ((typeof window !== "undefined" && window !== null) && require.shim) {
  require.shim([
    {
      symbol: '_',
      path: 'lodash',
      alias: 'underscore',
      optional: true
    }, {
      symbol: '_',
      path: 'underscore'
    }, {
      symbol: 'kb',
      path: 'knockback'
    }
  ]);
}

module.exports = require('./statistics');

});
require.register('statistics', function(exports, require, module) {
var err, kb, _;

try {
  kb = require('knockback');
} catch (_error) {
  err = _error;
  kb = require('./kb');
}

_ = require('underscore');

module.exports = kb.Statistics = (function() {
  function Statistics() {
    this.model_events_tracker = [];
    this.registered_tracker = {};
  }

  Statistics.prototype.clear = function() {
    return this.model_events_tracker = [];
  };

  Statistics.prototype.addModelEvent = function(event) {
    return this.model_events_tracker.push(event);
  };

  Statistics.prototype.modelEventsStatsString = function() {
    var event_groups, key, stats_string, value;
    stats_string = '';
    stats_string += "Total Count: " + this.model_events_tracker.length;
    event_groups = _.groupBy(this.model_events_tracker, function(test) {
      return "event name: '" + test.name + "', attribute name: '" + test.key + "'";
    });
    for (key in event_groups) {
      value = event_groups[key];
      stats_string += "\n " + key + ", count: " + value.length;
    }
    return stats_string;
  };

  Statistics.prototype.register = function(key, obj) {
    return this.registeredTracker(key).push(obj);
  };

  Statistics.prototype.unregister = function(key, obj) {
    var index, type_tracker;
    type_tracker = this.registeredTracker(key);
    index = _.indexOf(type_tracker, obj);
    if (index < 0) {
      if (typeof console !== "undefined" && console !== null) {
        console.log("kb.Statistics: failed to unregister type: " + key);
      }
    }
    return type_tracker.splice(index, 1);
  };

  Statistics.prototype.registeredCount = function(type) {
    var count, type_tracker, _ref;
    if (type) {
      return this.registeredTracker(type).length;
    }
    count = 0;
    _ref = this.registered_tracker[type];
    for (type in _ref) {
      type_tracker = _ref[type];
      count += type_tracker.length;
    }
    return count;
  };

  Statistics.prototype.registeredStatsString = function(success_message) {
    var stats_string, type, type_tracker, written, _ref;
    stats_string = '';
    _ref = this.registered_tracker;
    for (type in _ref) {
      type_tracker = _ref[type];
      if (!type_tracker.length) {
        continue;
      }
      if (written) {
        stats_string += '\n ';
      }
      stats_string += "" + (type ? type : 'No Name') + ": " + type_tracker.length;
      written = true;
    }
    if (stats_string) {
      return stats_string;
    } else {
      return success_message;
    }
  };

  Statistics.prototype.registeredTracker = function(key) {
    var type_tracker;
    if (this.registered_tracker.hasOwnProperty(key)) {
      return this.registered_tracker[key];
    }
    type_tracker = [];
    this.registered_tracker[key] = type_tracker;
    return type_tracker;
  };

  return Statistics;

})();

});

  if (typeof define == 'function' && define.amd) {
    define(["require","knockback"], function(){ return require('index'); });
  }
  else if (typeof exports == 'object') {
    module.exports = require('index');
  } else {
    this['knockback-statistics'] = require('index');
  }

}).call(this);