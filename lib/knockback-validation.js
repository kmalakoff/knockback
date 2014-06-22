/*
  
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

module.exports = require('./validation');

require('./validators');

});
require.register('validation', function(exports, require, module) {
var callOrGet, err, kb, ko, _;

try {
  kb = require('knockback');
} catch (_error) {
  err = _error;
  kb = require('./kb');
}

_ = require('underscore');

ko = require('knockout');

callOrGet = function(value) {
  value = ko.utils.unwrapObservable(value);
  if (typeof value === 'function') {
    return value.apply(null, Array.prototype.slice.call(arguments, 1));
  } else {
    return value;
  }
};

module.exports = kb.Validation = (function() {
  function Validation() {}

  return Validation;

})();

kb.valueValidator = function(value, bindings, validation_options) {
  if (validation_options == null) {
    validation_options = {};
  }
  (validation_options && !(typeof validation_options === 'function')) || (validation_options = {});
  return ko.dependentObservable(function() {
    var active_index, current_value, disabled, identifier, identifier_index, priorities, results, validator;
    results = {
      $error_count: 0
    };
    current_value = ko.utils.unwrapObservable(value);
    !('disable' in validation_options) || (disabled = callOrGet(validation_options.disable));
    !('enable' in validation_options) || (disabled = !callOrGet(validation_options.enable));
    priorities = validation_options.priorities || [];
    _.isArray(priorities) || (priorities = [priorities]);
    active_index = priorities.length + 1;
    for (identifier in bindings) {
      validator = bindings[identifier];
      results[identifier] = !disabled && callOrGet(validator, current_value);
      if (results[identifier]) {
        results.$error_count++;
        (identifier_index = _.indexOf(priorities, identifier) >= 0) || (identifier_index = priorities.length);
        if (results.$active_error && identifier_index < active_index) {
          results.$active_error = identifier;
          active_index = identifier_index;
        } else {
          results.$active_error || (results.$active_error = identifier, active_index = identifier_index);
        }
      }
    }
    results.$enabled = !disabled;
    results.$disable = !!disabled;
    results.$valid = results.$error_count === 0;
    return results;
  });
};

kb.inputValidator = function(view_model, el, validation_options) {
  var $input_el, bindings, identifier, input_name, options, result, type, validator, validators, _ref;
  if (validation_options == null) {
    validation_options = {};
  }
  (validation_options && !(typeof validation_options === 'function')) || (validation_options = {});
  validators = kb.valid;
  $input_el = $(el);
  if ((input_name = $input_el.attr('name')) && !_.isString(input_name)) {
    input_name = null;
  }
  if (!(bindings = $input_el.attr('data-bind'))) {
    return null;
  }
  options = (new Function("sc", "with(sc[0]) { return { " + bindings + " } }"))([view_model]);
  if (!(options && options.value)) {
    return null;
  }
  (!options.validation_options) || (_.defaults(options.validation_options, validation_options), validation_options = options.validation_options);
  bindings = {};
  (!validators[type = $input_el.attr('type')]) || (bindings[type] = validators[type]);
  (!$input_el.attr('required')) || (bindings.required = validators.required);
  if (options.validations) {
    _ref = options.validations;
    for (identifier in _ref) {
      validator = _ref[identifier];
      bindings[identifier] = validator;
    }
  }
  result = kb.valueValidator(options.value, bindings, validation_options);
  (!input_name && !validation_options.no_attach) || (view_model["$" + input_name] = result);
  return result;
};

kb.formValidator = function(view_model, el) {
  var $root_el, bindings, form_name, input_el, name, options, results, validation_options, validator, validators, _i, _len, _ref;
  results = {};
  validators = [];
  $root_el = $(el);
  if ((form_name = $root_el.attr('name')) && !_.isString(form_name)) {
    form_name = null;
  }
  if ((bindings = $root_el.attr('data-bind'))) {
    options = (new Function("sc", "with(sc[0]) { return { " + bindings + " } }"))([view_model]);
    validation_options = options.validation_options;
  }
  validation_options || (validation_options = {});
  validation_options.no_attach = !!form_name;
  _ref = $root_el.find('input');
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    input_el = _ref[_i];
    if (!(name = $(input_el).attr('name'))) {
      continue;
    }
    validator = kb.inputValidator(view_model, input_el, validation_options);
    !validator || validators.push(results[name] = validator);
  }
  results.$error_count = ko.dependentObservable(function() {
    var error_count, _j, _len1;
    error_count = 0;
    for (_j = 0, _len1 = validators.length; _j < _len1; _j++) {
      validator = validators[_j];
      error_count += validator().$error_count;
    }
    return error_count;
  });
  results.$valid = ko.dependentObservable(function() {
    return results.$error_count() === 0;
  });
  results.$enabled = ko.dependentObservable(function() {
    var enabled, _j, _len1;
    enabled = true;
    for (_j = 0, _len1 = validators.length; _j < _len1; _j++) {
      validator = validators[_j];
      enabled &= validator().$enabled;
    }
    return enabled;
  });
  results.$disabled = ko.dependentObservable(function() {
    return !results.$enabled();
  });
  if (form_name) {
    view_model["$" + form_name] = results;
  }
  return results;
};

});
require.register('validators', function(exports, require, module) {
var EMAIL_REGEXP, NUMBER_REGEXP, URL_REGEXP, err, kb, ko, _;

try {
  kb = require('knockback');
} catch (_error) {
  err = _error;
  kb = require('./kb');
}

_ = require('underscore');

ko = require('knockout');

URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

kb.valid = {
  required: function(value) {
    return !value;
  },
  url: function(value) {
    return !URL_REGEXP.test(value);
  },
  email: function(value) {
    return !EMAIL_REGEXP.test(value);
  },
  number: function(value) {
    return !NUMBER_REGEXP.test(value);
  }
};

kb.hasChangedFn = function(model) {
  var attributes, m;
  m = null;
  attributes = null;
  return function() {
    var current_model;
    if (m !== (current_model = ko.utils.unwrapObservable(model))) {
      m = current_model;
      attributes = (m ? m.toJSON() : null);
      return false;
    }
    if (!(m && attributes)) {
      return false;
    }
    return !_.isEqual(m.toJSON(), attributes);
  };
};

kb.minLengthFn = function(length) {
  return function(value) {
    return !value || value.length < length;
  };
};

kb.uniqueValueFn = function(model, key, collection) {
  return function(value) {
    var c, k, m;
    m = ko.utils.unwrapObservable(model);
    k = ko.utils.unwrapObservable(key);
    c = ko.utils.unwrapObservable(collection);
    if (!(m && k && c)) {
      return false;
    }
    return !!_.find(c.models, (function(_this) {
      return function(test) {
        return (test !== m) && test.get(k) === value;
      };
    })(this));
  };
};

kb.untilTrueFn = function(stand_in, fn, model) {
  var was_true;
  was_true = false;
  if (model && ko.isObservable(model)) {
    model.subscribe(function() {
      return was_true = false;
    });
  }
  return function(value) {
    var f, result;
    if (!(f = ko.utils.unwrapObservable(fn))) {
      return ko.utils.unwrapObservable(stand_in);
    }
    was_true |= !!(result = f(ko.utils.unwrapObservable(value)));
    return (was_true ? result : ko.utils.unwrapObservable(stand_in));
  };
};

kb.untilFalseFn = function(stand_in, fn, model) {
  var was_false;
  was_false = false;
  if (model && ko.isObservable(model)) {
    model.subscribe(function() {
      return was_false = false;
    });
  }
  return function(value) {
    var f, result;
    if (!(f = ko.utils.unwrapObservable(fn))) {
      return ko.utils.unwrapObservable(stand_in);
    }
    was_false |= !(result = f(ko.utils.unwrapObservable(value)));
    return (was_false ? result : ko.utils.unwrapObservable(stand_in));
  };
};

});

  if (typeof define == 'function' && define.amd) {
    define(["require","knockback"], function(){ return require('index'); });
  }
  else if (typeof exports == 'object') {
    module.exports = require('index');
  } else {
    this['knockback-validation'] = require('index');
  }

}).call(this);