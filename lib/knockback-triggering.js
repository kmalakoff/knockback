/*
  knockback-triggering.js
  (c) 2011-2014 Kevin Malakoff.
  Knockback is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
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
      symbol: 'ko',
      path: 'knockout'
    }, {
      symbol: 'kb',
      path: 'knockback'
    }
  ]);
}

module.exports = require('./triggered-observable');

});
require.register('triggered-observable', function(exports, require, module) {
var err, kb, ko, _;

try {
  kb = require('knockback');
} catch (_error) {
  err = _error;
  kb = require('./kb');
}

_ = require('underscore');

ko = require('knockout');

module.exports = kb.TriggeredObservable = (function() {
  function TriggeredObservable(emitter, event_selector) {
    var observable;
    this.event_selector = event_selector;
    emitter || kb._throwMissing(this, 'emitter');
    this.event_selector || kb._throwMissing(this, 'event_selector');
    this.vo = ko.observable();
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable((function(_this) {
      return function() {
        return _this.vo();
      };
    })(this)));
    kb.publishMethods(observable, this, ['destroy']);
    kb.utils.wrappedEventWatcher(this, new kb.EventWatcher(emitter, this, {
      emitter: _.bind(this.emitter, this),
      update: _.bind(this.update, this),
      event_selector: this.event_selector
    }));
    return observable;
  }

  TriggeredObservable.prototype.destroy = function() {
    return kb.utils.wrappedDestroy(this);
  };

  TriggeredObservable.prototype.emitter = function(new_emitter) {
    if ((arguments.length === 0) || (this.ee === new_emitter)) {
      return this.ee;
    }
    if ((this.ee = new_emitter)) {
      return this.update();
    }
  };

  TriggeredObservable.prototype.update = function() {
    if (!this.ee) {
      return;
    }
    if (this.vo() !== this.ee) {
      return this.vo(this.ee);
    } else {
      return this.vo.valueHasMutated();
    }
  };

  return TriggeredObservable;

})();

kb.triggeredObservable = function(emitter, event_selector) {
  return new kb.TriggeredObservable(emitter, event_selector);
};

});

  if (typeof define == 'function' && define.amd) {
    define(["require","knockback"], function(){ return require('index'); });
  }
  else if (typeof exports == 'object') {
    module.exports = require('index');
  } else {
    this['knockback-triggering'] = require('index');
  }

}).call(this);