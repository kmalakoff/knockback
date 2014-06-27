/*
  knockback-examples-localization.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
(function() {
  var globals = {requires: []};
if (typeof window !== "undefined" && !!window.require) globals.requires.push(window.require);
if (typeof require !== "undefined" && !!require) globals.requires.push(require);

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

module.exports = require('./locale_manager');

require('./localized_string');

require('./localized_observables');

});
require.register('locale_manager', function(exports, require, module) {
var err, kb,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

try {
  kb = require('knockback');
} catch (_error) {
  err = _error;
  kb = require('./kb');
}

kb.LocaleManager = (function() {
  __extends(LocaleManager.prototype, kb.Events);

  function LocaleManager(locale_identifier, translations_by_locale) {
    this.translations_by_locale = translations_by_locale;
    if (locale_identifier) {
      this.setLocale(locale_identifier);
    }
  }

  LocaleManager.prototype.get = function(string_id, parameters) {
    var arg, culture_map, index, string, _i, _len, _ref;
    if (this.locale_identifier) {
      culture_map = this.translations_by_locale[this.locale_identifier];
    }
    if (!culture_map) {
      return '';
    }
    string = culture_map.hasOwnProperty(string_id) ? culture_map[string_id] : '';
    if (arguments === 1) {
      return string;
    }
    _ref = Array.prototype.slice.call(arguments, 1);
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      arg = _ref[index];
      string = string.replace("{" + index + "}", arg);
    }
    return string;
  };

  LocaleManager.prototype.getLocale = function() {
    return this.locale_identifier;
  };

  LocaleManager.prototype.setLocale = function(locale_identifier) {
    var culture_map, key, value;
    this.locale_identifier = locale_identifier;
    Globalize.culture = Globalize.findClosestCulture(locale_identifier);
    this.trigger('change', this);
    culture_map = this.translations_by_locale[this.locale_identifier];
    if (!culture_map) {
      return;
    }
    for (key in culture_map) {
      value = culture_map[key];
      this.trigger("change:" + key, value);
    }
  };

  LocaleManager.prototype.getLocales = function() {
    var locales, string_id, value, _ref;
    locales = [];
    _ref = this.translations_by_locale;
    for (string_id in _ref) {
      value = _ref[string_id];
      locales.push(string_id);
    }
    return locales;
  };

  return LocaleManager;

})();

});
require.register('localized_observables', function(exports, require, module) {
var err, kb, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

try {
  kb = require('knockback');
} catch (_error) {
  err = _error;
  kb = require('./kb');
}

_ = require('underscore');

kb.LocalizedStringLocalizer = (function(_super) {
  __extends(LocalizedStringLocalizer, _super);

  function LocalizedStringLocalizer() {
    return LocalizedStringLocalizer.__super__.constructor.apply(this, arguments);
  }

  LocalizedStringLocalizer.prototype.read = function(value) {
    if (value.string_id) {
      return kb.locale_manager.get(value.string_id);
    } else {
      return '';
    }
  };

  return LocalizedStringLocalizer;

})(kb.LocalizedObservable);

kb.LongDateLocalizer = (function(_super) {
  __extends(LongDateLocalizer, _super);

  function LongDateLocalizer(value, options, view_model) {
    return LongDateLocalizer.__super__.constructor.apply(this, arguments);
  }

  LongDateLocalizer.prototype.read = function(value) {
    return Globalize.format(value, 'dd MMMM yyyy', kb.locale_manager.getLocale());
  };

  LongDateLocalizer.prototype.write = function(localized_string, value) {
    var new_value;
    new_value = Globalize.parseDate(localized_string, 'dd MMMM yyyy', kb.locale_manager.getLocale());
    if (!(new_value && _.isDate(new_value))) {
      return kb.utils.wrappedObservable(this).resetToCurrent();
    }
    return value.setTime(new_value.valueOf());
  };

  return LongDateLocalizer;

})(kb.LocalizedObservable);

kb.ShortDateLocalizer = kb.LocalizedObservable.extend({
  constructor: function(value, options, view_model) {
    kb.LocalizedObservable.prototype.constructor.apply(this, arguments);
    return kb.utils.wrappedObservable(this);
  },
  read: function(value) {
    return Globalize.format(value, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale());
  },
  write: function(localized_string, value) {
    var new_value;
    new_value = Globalize.parseDate(localized_string, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale());
    if (!(new_value && _.isDate(new_value))) {
      return kb.utils.wrappedObservable(this).resetToCurrent();
    }
    return value.setTime(new_value.valueOf());
  }
});

});
require.register('localized_string', function(exports, require, module) {
var err, kb;

try {
  kb = require('knockback');
} catch (_error) {
  err = _error;
  kb = require('./kb');
}

kb.LocalizedString = (function() {
  function LocalizedString(string_id) {
    this.string_id = string_id;
    if (!kb.locale_manager) {
      throw 'missing kb.locale_manager';
    }
    this.string = kb.locale_manager.get(this.string_id);
  }

  return LocalizedString;

})();

});

  if (typeof define == 'function' && define.amd) {
    define(["require","knockback"], function(){ return require('index'); });
  }
  else if (typeof exports == 'object') {
    module.exports = require('index');
  } else {
    this['knockback-locale-manager'] = require('index');
  }

}).call(this);