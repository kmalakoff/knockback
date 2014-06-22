/*
  knockback-defaults.js
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
require.register('default-observable', function(exports, require, module) {
var err, kb, ko, _;

try {
  kb = require('knockback');
} catch (_error) {
  err = _error;
  kb = require('./kb');
}

_ = require('underscore');

ko = require('knockout');

require('./extensions');

module.exports = kb.DefaultObservable = (function() {
  function DefaultObservable(target_observable, dv) {
    var observable;
    this.dv = dv;
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
      read: (function(_this) {
        return function() {
          var current_target;
          if ((current_target = ko.utils.unwrapObservable(target_observable()))) {
            return current_target;
          } else {
            return ko.utils.unwrapObservable(_this.dv);
          }
        };
      })(this),
      write: function(value) {
        return target_observable(value);
      }
    }));
    kb.publishMethods(observable, this, ['destroy', 'setToDefault']);
    return observable;
  }

  DefaultObservable.prototype.destroy = function() {
    return kb.utils.wrappedDestroy(this);
  };

  DefaultObservable.prototype.setToDefault = function() {
    return kb.utils.wrappedObservable(this)(this.dv);
  };

  return DefaultObservable;

})();

kb.defaultObservable = function(target, default_value) {
  return new kb.DefaultObservable(target, default_value);
};

});
require.register('extensions', function(exports, require, module) {
var err, kb, ko, _;

try {
  kb = require('knockback');
} catch (_error) {
  err = _error;
  kb = require('./kb');
}

_ = require('underscore');

ko = require('knockout');

kb.Observable.prototype.setToDefault = function() {
  var _ref;
  if ((_ref = this.__kb_value) != null) {
    if (typeof _ref.setToDefault === "function") {
      _ref.setToDefault();
    }
  }
};

kb.ViewModel.prototype.setToDefault = function() {
  var vm_key, _ref;
  for (vm_key in this.__kb.vm_keys) {
    if ((_ref = this[vm_key]) != null) {
      if (typeof _ref.setToDefault === "function") {
        _ref.setToDefault();
      }
    }
  }
};

kb.utils.setToDefault = function(obj) {
  var key, value;
  if (!obj) {
    return;
  }
  if (ko.isObservable(obj)) {
    if (typeof obj.setToDefault === "function") {
      obj.setToDefault();
    }
  } else if (_.isObject(obj)) {
    for (key in obj) {
      value = obj[key];
      if (value && (ko.isObservable(value) || (typeof value !== 'function')) && ((key[0] !== '_') || key.search('__kb'))) {
        this.setToDefault(value);
      }
    }
  }
  return obj;
};

});
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

module.exports = require('./default-observable');

});

  if (typeof define == 'function' && define.amd) {
    define(["require","knockback"], function(){ return require('index'); });
  }
  else if (typeof exports == 'object') {
    module.exports = require('index');
  } else {
    this['knockback-defaults'] = require('index');
  }

}).call(this);