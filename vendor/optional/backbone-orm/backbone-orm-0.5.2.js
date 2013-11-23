/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/
(function() {
var globals = {};

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

      // use global require
      try { dep = typeof window.require === "function" ? window.require(item.path) : void 0; } catch (e) {}

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

require.register("_shims", function(exports, require, module) {
//
// The shims in this file are not fully implemented shims for the ES5
// features, but do work for the particular usecases there is in
// the other modules.
//

var toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

// Array.isArray is supported in IE9
function isArray(xs) {
  return toString.call(xs) === '[object Array]';
}
exports.isArray = typeof Array.isArray === 'function' ? Array.isArray : isArray;

// Array.prototype.indexOf is supported in IE9
exports.indexOf = function indexOf(xs, x) {
  if (xs.indexOf) return xs.indexOf(x);
  for (var i = 0; i < xs.length; i++) {
    if (x === xs[i]) return i;
  }
  return -1;
};

// Array.prototype.filter is supported in IE9
exports.filter = function filter(xs, fn) {
  if (xs.filter) return xs.filter(fn);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    if (fn(xs[i], i, xs)) res.push(xs[i]);
  }
  return res;
};

// Array.prototype.forEach is supported in IE9
exports.forEach = function forEach(xs, fn, self) {
  if (xs.forEach) return xs.forEach(fn, self);
  for (var i = 0; i < xs.length; i++) {
    fn.call(self, xs[i], i, xs);
  }
};

// Array.prototype.map is supported in IE9
exports.map = function map(xs, fn) {
  if (xs.map) return xs.map(fn);
  var out = new Array(xs.length);
  for (var i = 0; i < xs.length; i++) {
    out[i] = fn(xs[i], i, xs);
  }
  return out;
};

// Array.prototype.reduce is supported in IE9
exports.reduce = function reduce(array, callback, opt_initialValue) {
  if (array.reduce) return array.reduce(callback, opt_initialValue);
  var value, isValueSet = false;

  if (2 < arguments.length) {
    value = opt_initialValue;
    isValueSet = true;
  }
  for (var i = 0, l = array.length; l > i; ++i) {
    if (array.hasOwnProperty(i)) {
      if (isValueSet) {
        value = callback(value, array[i], i, array);
      }
      else {
        value = array[i];
        isValueSet = true;
      }
    }
  }

  return value;
};

// String.prototype.substr - negative index don't work in IE8
if ('ab'.substr(-1) !== 'b') {
  exports.substr = function (str, start, length) {
    // did we get a negative start, calculate how much it is from the beginning of the string
    if (start < 0) start = str.length + start;

    // call the original function
    return str.substr(start, length);
  };
} else {
  exports.substr = function (str, start, length) {
    return str.substr(start, length);
  };
}

// String.prototype.trim is supported in IE9
exports.trim = function (str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
};

// Function.prototype.bind is supported in IE9
exports.bind = function () {
  var args = Array.prototype.slice.call(arguments);
  var fn = args.shift();
  if (fn.bind) return fn.bind.apply(fn, args);
  var self = args.shift();
  return function () {
    fn.apply(self, args.concat([Array.prototype.slice.call(arguments)]));
  };
};

// Object.create is supported in IE9
function create(prototype, properties) {
  var object;
  if (prototype === null) {
    object = { '__proto__' : null };
  }
  else {
    if (typeof prototype !== 'object') {
      throw new TypeError(
        'typeof prototype[' + (typeof prototype) + '] != \'object\''
      );
    }
    var Type = function () {};
    Type.prototype = prototype;
    object = new Type();
    object.__proto__ = prototype;
  }
  if (typeof properties !== 'undefined' && Object.defineProperties) {
    Object.defineProperties(object, properties);
  }
  return object;
}
exports.create = typeof Object.create === 'function' ? Object.create : create;

// Object.keys and Object.getOwnPropertyNames is supported in IE9 however
// they do show a description and number property on Error objects
function notObject(object) {
  return ((typeof object != "object" && typeof object != "function") || object === null);
}

function keysShim(object) {
  if (notObject(object)) {
    throw new TypeError("Object.keys called on a non-object");
  }

  var result = [];
  for (var name in object) {
    if (hasOwnProperty.call(object, name)) {
      result.push(name);
    }
  }
  return result;
}

// getOwnPropertyNames is almost the same as Object.keys one key feature
//  is that it returns hidden properties, since that can't be implemented,
//  this feature gets reduced so it just shows the length property on arrays
function propertyShim(object) {
  if (notObject(object)) {
    throw new TypeError("Object.getOwnPropertyNames called on a non-object");
  }

  var result = keysShim(object);
  if (exports.isArray(object) && exports.indexOf(object, 'length') === -1) {
    result.push('length');
  }
  return result;
}

var keys = typeof Object.keys === 'function' ? Object.keys : keysShim;
var getOwnPropertyNames = typeof Object.getOwnPropertyNames === 'function' ?
  Object.getOwnPropertyNames : propertyShim;

if (new Error().hasOwnProperty('description')) {
  var ERROR_PROPERTY_FILTER = function (obj, array) {
    if (toString.call(obj) === '[object Error]') {
      array = exports.filter(array, function (name) {
        return name !== 'description' && name !== 'number' && name !== 'message';
      });
    }
    return array;
  };

  exports.keys = function (object) {
    return ERROR_PROPERTY_FILTER(object, keys(object));
  };
  exports.getOwnPropertyNames = function (object) {
    return ERROR_PROPERTY_FILTER(object, getOwnPropertyNames(object));
  };
} else {
  exports.keys = keys;
  exports.getOwnPropertyNames = getOwnPropertyNames;
}

// Object.getOwnPropertyDescriptor - supported in IE8 but only on dom elements
function valueObject(value, key) {
  return { value: value[key] };
}

if (typeof Object.getOwnPropertyDescriptor === 'function') {
  try {
    Object.getOwnPropertyDescriptor({'a': 1}, 'a');
    exports.getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  } catch (e) {
    // IE8 dom element issue - use a try catch and default to valueObject
    exports.getOwnPropertyDescriptor = function (value, key) {
      try {
        return Object.getOwnPropertyDescriptor(value, key);
      } catch (e) {
        return valueObject(value, key);
      }
    };
  }
} else {
  exports.getOwnPropertyDescriptor = valueObject;
}
});

;require.register("lru-cache", function(exports, require, module) {
;(function () { // closure for web browsers

if (typeof module === 'object' && module.exports) {
  module.exports = LRUCache
} else {
  // just set the global for non-node platforms.
  this.LRUCache = LRUCache
}

function hOP (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

function naiveLength () { return 1 }

function LRUCache (options) {
  if (!(this instanceof LRUCache)) {
    return new LRUCache(options)
  }

  var max
  if (typeof options === 'number') {
    max = options
    options = { max: max }
  }

  if (!options) options = {}

  max = options.max

  var lengthCalculator = options.length || naiveLength

  if (typeof lengthCalculator !== "function") {
    lengthCalculator = naiveLength
  }

  if (!max || !(typeof max === "number") || max <= 0 ) {
    // a little bit silly.  maybe this should throw?
    max = Infinity
  }

  var allowStale = options.stale || false

  var maxAge = options.maxAge || null

  var dispose = options.dispose

  var cache = Object.create(null) // hash of items by key
    , lruList = Object.create(null) // list of items in order of use recency
    , mru = 0 // most recently used
    , lru = 0 // least recently used
    , length = 0 // number of items in the list
    , itemCount = 0


  // resize the cache when the max changes.
  Object.defineProperty(this, "max",
    { set : function (mL) {
        if (!mL || !(typeof mL === "number") || mL <= 0 ) mL = Infinity
        max = mL
        // if it gets above double max, trim right away.
        // otherwise, do it whenever it's convenient.
        if (length > max) trim()
      }
    , get : function () { return max }
    , enumerable : true
    })

  // resize the cache when the lengthCalculator changes.
  Object.defineProperty(this, "lengthCalculator",
    { set : function (lC) {
        if (typeof lC !== "function") {
          lengthCalculator = naiveLength
          length = itemCount
          for (var key in cache) {
            cache[key].length = 1
          }
        } else {
          lengthCalculator = lC
          length = 0
          for (var key in cache) {
            cache[key].length = lengthCalculator(cache[key].value)
            length += cache[key].length
          }
        }

        if (length > max) trim()
      }
    , get : function () { return lengthCalculator }
    , enumerable : true
    })

  Object.defineProperty(this, "length",
    { get : function () { return length }
    , enumerable : true
    })


  Object.defineProperty(this, "itemCount",
    { get : function () { return itemCount }
    , enumerable : true
    })

  this.forEach = function (fn, thisp) {
    thisp = thisp || this
    var i = 0;
    for (var k = mru - 1; k >= 0 && i < itemCount; k--) if (lruList[k]) {
      i++
      var hit = lruList[k]
      if (maxAge && (Date.now() - hit.now > maxAge)) {
        del(hit)
        if (!allowStale) hit = undefined
      }
      if (hit) {
        fn.call(thisp, hit.value, hit.key, this)
      }
    }
  }

  this.keys = function () {
    var keys = new Array(itemCount)
    var i = 0
    for (var k = mru - 1; k >= 0 && i < itemCount; k--) if (lruList[k]) {
      var hit = lruList[k]
      keys[i++] = hit.key
    }
    return keys
  }

  this.values = function () {
    var values = new Array(itemCount)
    var i = 0
    for (var k = mru - 1; k >= 0 && i < itemCount; k--) if (lruList[k]) {
      var hit = lruList[k]
      values[i++] = hit.value
    }
    return values
  }

  this.reset = function () {
    if (dispose) {
      for (var k in cache) {
        dispose(k, cache[k].value)
      }
    }
    cache = {}
    lruList = {}
    lru = 0
    mru = 0
    length = 0
    itemCount = 0
  }

  // Provided for debugging/dev purposes only. No promises whatsoever that
  // this API stays stable.
  this.dump = function () {
    return cache
  }

  this.dumpLru = function () {
    return lruList
  }

  this.set = function (key, value) {
    if (hOP(cache, key)) {
      // dispose of the old one before overwriting
      if (dispose) dispose(key, cache[key].value)
      if (maxAge) cache[key].now = Date.now()
      cache[key].value = value
      this.get(key)
      return true
    }

    var len = lengthCalculator(value)
    var age = maxAge ? Date.now() : 0
    var hit = new Entry(key, value, mru++, len, age)

    // oversized objects fall out of cache automatically.
    if (hit.length > max) {
      if (dispose) dispose(key, value)
      return false
    }

    length += hit.length
    lruList[hit.lu] = cache[key] = hit
    itemCount ++

    if (length > max) trim()
    return true
  }

  this.has = function (key) {
    if (!hOP(cache, key)) return false
    var hit = cache[key]
    if (maxAge && (Date.now() - hit.now > maxAge)) {
      return false
    }
    return true
  }

  this.get = function (key) {
    return get(key, true)
  }

  this.peek = function (key) {
    return get(key, false)
  }

  function get (key, doUse) {
    var hit = cache[key]
    if (hit) {
      if (maxAge && (Date.now() - hit.now > maxAge)) {
        del(hit)
        if (!allowStale) hit = undefined
      } else {
        if (doUse) use(hit)
      }
      if (hit) hit = hit.value
    }
    return hit
  }

  function use (hit) {
    shiftLU(hit)
    hit.lu = mru ++
    lruList[hit.lu] = hit
  }

  this.del = function (key) {
    del(cache[key])
  }

  function trim () {
    while (lru < mru && length > max)
      del(lruList[lru])
  }

  function shiftLU(hit) {
    delete lruList[ hit.lu ]
    while (lru < mru && !lruList[lru]) lru ++
  }

  function del(hit) {
    if (hit) {
      if (dispose) dispose(hit.key, hit.value)
      length -= hit.length
      itemCount --
      delete cache[ hit.key ]
      shiftLU(hit)
    }
  }
}

// classy, since V8 prefers predictable objects.
function Entry (key, value, mru, len, age) {
  this.key = key
  this.value = value
  this.lu = mru
  this.length = len
  this.now = age
}

})()

});

;require.register("querystring", function(exports, require, module) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// Query String Utilities

var QueryString = exports;
var util = require('util');
var shims = require('_shims');

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
return Object.prototype.hasOwnProperty.call(obj, prop);
}


function charCode(c) {
return c.charCodeAt(0);
}

// TODO support returning arbitrary buffers.

QueryString.unescape = function(s, decodeSpaces) {
return decodeURIComponent(s/*, decodeSpaces*/);
};


QueryString.escape = function(str) {
return encodeURIComponent(str);
};

var stringifyPrimitive = function(v) {
if (util.isString(v))
  return v;
if (util.isBoolean(v))
  return v ? 'true' : 'false';
if (util.isNumber(v))
  return isFinite(v) ? v : '';
return '';
};


QueryString.stringify = QueryString.encode = function(obj, sep, eq, name) {
sep = sep || '&';
eq = eq || '=';
if (util.isNull(obj)) {
  obj = undefined;
}

if (util.isObject(obj)) {
  return shims.map(shims.keys(obj), function(k) {
    var ks = QueryString.escape(stringifyPrimitive(k)) + eq;
    if (util.isArray(obj[k])) {
      return shims.map(obj[k], function(v) {
        return ks + QueryString.escape(stringifyPrimitive(v));
      }).join(sep);
    } else {
      return ks + QueryString.escape(stringifyPrimitive(obj[k]));
    }
  }).join(sep);

}

if (!name) return '';
return QueryString.escape(stringifyPrimitive(name)) + eq +
       QueryString.escape(stringifyPrimitive(obj));
};

// Parse a key=val string.
QueryString.parse = QueryString.decode = function(qs, sep, eq, options) {
sep = sep || '&';
eq = eq || '=';
var obj = {};

if (!util.isString(qs) || qs.length === 0) {
  return obj;
}

var regexp = /\+/g;
qs = qs.split(sep);

var maxKeys = 1000;
if (options && util.isNumber(options.maxKeys)) {
  maxKeys = options.maxKeys;
}

var len = qs.length;
// maxKeys <= 0 means that we should not limit keys count
if (maxKeys > 0 && len > maxKeys) {
  len = maxKeys;
}

for (var i = 0; i < len; ++i) {
  var x = qs[i].replace(regexp, '%20'),
      idx = x.indexOf(eq),
      kstr, vstr, k, v;

  if (idx >= 0) {
    kstr = x.substr(0, idx);
    vstr = x.substr(idx + 1);
  } else {
    kstr = x;
    vstr = '';
  }

  try {
    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);
  } catch (e) {
    k = QueryString.unescape(kstr, true);
    v = QueryString.unescape(vstr, true);
  }

  if (!hasOwnProperty(obj, k)) {
    obj[k] = v;
  } else if (util.isArray(obj[k])) {
    obj[k].push(v);
  } else {
    obj[k] = [obj[k], v];
  }
}

return obj;
};
});

;require.register("url", function(exports, require, module) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var punycode = { encode : function (s) { return s } };
var util = require('util');
var shims = require('_shims');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = shims.trim(rest);

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a puny coded representation of "domain".
      // It only converts the part of the domain name that
      // has non ASCII characters. I.e. it dosent matter if
      // you call it with a domain that already is in ASCII.
      var domainArray = this.hostname.split('.');
      var newOut = [];
      for (var i = 0; i < domainArray.length; ++i) {
        var s = domainArray[i];
        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
            'xn--' + punycode.encode(s) : s);
      }
      this.hostname = newOut.join('.');
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      shims.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && shims.substr(protocol, -1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  shims.forEach(shims.keys(this), function(k) {
    result[k] = this[k];
  }, this);

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    shims.forEach(shims.keys(relative), function(k) {
      if (k !== 'protocol')
        result[k] = relative[k];
    });

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      shims.forEach(shims.keys(relative), function(k) {
        result[k] = relative[k];
      });
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especialy happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host) && (last === '.' || last === '..') ||
      last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last == '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (shims.substr(srcPath.join('/'), -1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especialy happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

});

;require.register("util", function(exports, require, module) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var shims = require('_shims');

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
return shims.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
return typeof arg === 'string';
}
exports.isString = isString;

function isObject(arg) {
return typeof arg === 'object' && arg;
}
exports.isObject = isObject;

function objectToString(o) {
return Object.prototype.toString.call(o);
}

});

;require.register("backbone-orm/lib/cache/cursor", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var CacheCursor, _, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('underscore');

module.exports = CacheCursor = (function(_super) {
  __extends(CacheCursor, _super);

  function CacheCursor() {
    _ref = CacheCursor.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  CacheCursor.prototype.toJSON = function(callback) {
    return this.wrapped_sync_fn('cursor', _.extend({}, this._find, this._cursor)).toJSON(callback);
  };

  return CacheCursor;

})(require('../cursor'));

});

;require.register("backbone-orm/lib/cache/memory_store", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var LRU, MemoryStore, inflection, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('underscore');

LRU = require('lru-cache');

inflection = require('inflection');

module.exports = MemoryStore = (function() {
  function MemoryStore(options) {
    var key, normalized_options, value;
    if (options == null) {
      options = {};
    }
    this.forEach = __bind(this.forEach, this);
    this.reset = __bind(this.reset, this);
    this.destroy = __bind(this.destroy, this);
    this.get = __bind(this.get, this);
    this.set = __bind(this.set, this);
    normalized_options = {};
    for (key in options) {
      value = options[key];
      if (key === 'destroy') {
        normalized_options.dispose = value;
      } else {
        normalized_options[this._normalizeKey(key)] = value;
      }
    }
    this.cache = new LRU(normalized_options);
  }

  MemoryStore.prototype.set = function(key, value, callback) {
    if (value._orm_never_cache) {
      return (typeof callback === "function" ? callback(null, value) : void 0) || this;
    }
    this.cache.set(key, value);
    if (typeof callback === "function") {
      callback(null, value);
    }
    return this;
  };

  MemoryStore.prototype.get = function(key, callback) {
    var value;
    value = this.cache.get(key);
    if (typeof callback === "function") {
      callback(null, value);
    }
    return value;
  };

  MemoryStore.prototype.destroy = function(key, callback) {
    this.cache.del(key);
    if (typeof callback === "function") {
      callback();
    }
    return this;
  };

  MemoryStore.prototype.reset = function(callback) {
    this.cache.reset();
    if (typeof callback === "function") {
      callback();
    }
    return this;
  };

  MemoryStore.prototype._normalizeKey = function(key) {
    key = inflection.underscore(key);
    if (key.indexOf('_') < 0) {
      return key.toLowerCase();
    }
    return inflection.camelize(key);
  };

  MemoryStore.prototype.forEach = function(callback) {
    return this.cache.forEach(callback);
  };

  return MemoryStore;

})();

});

;require.register("backbone-orm/lib/cache/model_cache", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var Backbone, MEMORY_STORE_KEYS, MemoryStore, ModelCache, Queue, _;

Backbone = require('backbone');

_ = require('underscore');

Queue = require('../queue');

MemoryStore = require('./memory_store');

MEMORY_STORE_KEYS = ['max', 'max_age', 'destroy'];

module.exports = ModelCache = (function() {
  function ModelCache() {
    this.enabled = false;
    this.caches = {};
    this.options = {
      modelTypes: {}
    };
    this.verbose = false;
  }

  ModelCache.prototype.configure = function(options) {
    var key, value, value_key, value_value, values, _base;
    if (options == null) {
      options = {};
    }
    this.enabled = options.enabled;
    this.reset(function() {});
    for (key in options) {
      value = options[key];
      if (_.isObject(value)) {
        (_base = this.options)[key] || (_base[key] = {});
        values = this.options[key];
        for (value_key in value) {
          value_value = value[value_key];
          values[value_key] = value_value;
        }
      } else {
        this.options[key] = value;
      }
    }
    return this;
  };

  ModelCache.prototype.configureSync = function(model_type, sync_fn) {
    var cache;
    if (model_type.prototype._orm_never_cache || !(cache = this.getOrCreateCache(model_type.model_name))) {
      return sync_fn;
    }
    model_type.cache = cache;
    return require('./sync')(model_type, sync_fn);
  };

  ModelCache.prototype.reset = function(callback) {
    var key, queue, value, _fn, _ref;
    queue = new Queue();
    _ref = this.caches;
    _fn = function(value) {
      return queue.defer(function(callback) {
        return value.reset(callback);
      });
    };
    for (key in _ref) {
      value = _ref[key];
      _fn(value);
    }
    return queue.await(callback);
  };

  ModelCache.prototype.hardReset = function() {
    var key, value, _ref;
    this.reset(function() {});
    _ref = this.caches;
    for (key in _ref) {
      value = _ref[key];
      delete this.caches[key];
    }
    return this;
  };

  ModelCache.prototype.getOrCreateCache = function(model_name) {
    var model_cache, options, _base;
    if (!this.enabled) {
      return null;
    }
    if (!model_name) {
      throw new Error("Missing model name for cache");
    }
    if (model_cache = this.caches[model_name]) {
      return model_cache;
    }
    if (options = this.options.modelTypes[model_name]) {
      return this.caches[model_name] = (typeof options.store === "function" ? options.store() : void 0) || new MemoryStore(_.pick(options, MEMORY_STORE_KEYS));
    } else if (this.options.store || this.options.max || this.options.max_age) {
      return this.caches[model_name] = (typeof (_base = this.options).store === "function" ? _base.store() : void 0) || new MemoryStore(_.pick(this.options, MEMORY_STORE_KEYS));
    }
    return null;
  };

  return ModelCache;

})();

});

;require.register("backbone-orm/lib/cache/query_cache", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var CLONE_DEPTH, JSONUtils, MemoryStore, QueryCache, Queue, inflection, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('underscore');

inflection = require('inflection');

Queue = require('../queue');

JSONUtils = require('../json_utils');

MemoryStore = require('./memory_store');

CLONE_DEPTH = 2;

module.exports = QueryCache = (function() {
  function QueryCache() {
    this.storeKeyForModelTypes = __bind(this.storeKeyForModelTypes, this);
    this.getKeysForModelTypes = __bind(this.getKeysForModelTypes, this);
    this.clearMetaForModelTypes = __bind(this.clearMetaForModelTypes, this);
    this.clearModelTypes = __bind(this.clearModelTypes, this);
    this.reset = __bind(this.reset, this);
    this.hardReset = __bind(this.hardReset, this);
    this.getMeta = __bind(this.getMeta, this);
    this.getKey = __bind(this.getKey, this);
    this.get = __bind(this.get, this);
    this.set = __bind(this.set, this);
    this.configure = __bind(this.configure, this);
    this.enabled = false;
  }

  QueryCache.prototype.configure = function(options) {
    if (options == null) {
      options = {};
    }
    this.enabled = options.enabled;
    this.verbose = options.verbose;
    this.hits = this.misses = this.clears = 0;
    this.store = options.store || new MemoryStore();
    return this;
  };

  QueryCache.prototype.cacheKey = function(model_type, query) {
    return "" + model_type.model_id + "_" + (JSON.stringify(query));
  };

  QueryCache.prototype.cacheKeyMeta = function(model_type) {
    return "meta_" + model_type.model_id;
  };

  QueryCache.prototype.set = function(model_type, query, related_model_types, value, callback) {
    var cache_key, m, model_types,
      _this = this;
    if (!this.enabled) {
      return callback();
    }
    if (this.verbose) {
      console.log('QueryCache:set', model_type.model_name, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = related_model_types.length; _i < _len; _i++) {
          m = related_model_types[_i];
          _results.push(m.model_name);
        }
        return _results;
      })(), this.cacheKey(model_type, query), JSON.stringify(value), '\n-----------');
    }
    model_types = [model_type].concat(related_model_types || []);
    cache_key = this.cacheKey(model_type, query);
    return this.store.set(cache_key, JSONUtils.deepClone(value, CLONE_DEPTH), function(err) {
      if (err) {
        return callback(err);
      }
      return _this.storeKeyForModelTypes(model_types, cache_key, callback);
    });
  };

  QueryCache.prototype.get = function(model_type, query, callback) {
    if (!this.enabled) {
      return callback();
    }
    return this.getKey(this.cacheKey(model_type, query), callback);
  };

  QueryCache.prototype.getKey = function(key, callback) {
    var _this = this;
    if (!this.enabled) {
      return callback();
    }
    return this.store.get(key, function(err, value) {
      if (err) {
        return callback(err);
      }
      if (_.isUndefined(value) || _.isNull(value)) {
        _this.misses++;
        if (_this.verbose) {
          console.log('QueryCache:miss', key, value, '\n-----------');
        }
        return callback();
      } else {
        _this.hits++;
        if (_this.verbose) {
          console.log('QueryCache:hit', key, value, '\n-----------');
        }
        return callback(null, JSONUtils.deepClone(value, CLONE_DEPTH));
      }
    });
  };

  QueryCache.prototype.getMeta = function(model_type, callback) {
    if (!this.enabled) {
      return callback();
    }
    return this.store.get(this.cacheKeyMeta(model_type), callback);
  };

  QueryCache.prototype.hardReset = function(callback) {
    if (!this.enabled) {
      return callback();
    }
    if (this.verbose) {
      console.log('QueryCache:hardReset');
    }
    this.hits = this.misses = this.clears = 0;
    if (this.store) {
      return this.store.reset(callback);
    }
    return callback();
  };

  QueryCache.prototype.reset = function(model_types, callback) {
    var model_type, related_model_types, _i, _len;
    if (arguments.length === 1) {
      return this.hardReset(model_types);
    }
    if (!this.enabled) {
      return callback();
    }
    if (!_.isArray(model_types)) {
      model_types = [model_types];
    }
    related_model_types = [];
    for (_i = 0, _len = model_types.length; _i < _len; _i++) {
      model_type = model_types[_i];
      related_model_types = related_model_types.concat(model_type.schema().allRelations());
    }
    model_types = model_types.concat(related_model_types);
    return this.clearModelTypes(model_types, callback);
  };

  QueryCache.prototype.clearModelTypes = function(model_types, callback) {
    var _this = this;
    if (!model_types.length) {
      return callback();
    }
    return this.getKeysForModelTypes(model_types, function(err, to_clear) {
      var key, queue, _fn, _i, _len, _ref;
      if (err) {
        return callback(err);
      }
      queue = new Queue();
      queue.defer(function(callback) {
        return _this.clearMetaForModelTypes(model_types, callback);
      });
      _ref = _.uniq(to_clear);
      _fn = function(key) {
        return queue.defer(function(callback) {
          if (_this.verbose) {
            console.log('QueryCache:cleared', key, '\n-----------');
          }
          _this.clears++;
          return _this.store.destroy(key, callback);
        });
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        _fn(key);
      }
      return queue.await(callback);
    });
  };

  QueryCache.prototype.clearMetaForModelTypes = function(model_types, callback) {
    var model_type, queue, _fn, _i, _len,
      _this = this;
    queue = new Queue();
    _fn = function(model_type) {
      return queue.defer(function(callback) {
        if (_this.verbose) {
          console.log('QueryCache:meta cleared', model_type.model_name, '\n-----------');
        }
        return _this.store.destroy(_this.cacheKeyMeta(model_type), callback);
      });
    };
    for (_i = 0, _len = model_types.length; _i < _len; _i++) {
      model_type = model_types[_i];
      _fn(model_type);
    }
    return queue.await(callback);
  };

  QueryCache.prototype.getKeysForModelTypes = function(model_types, callback) {
    var all_keys, model_type, queue, _fn, _i, _len,
      _this = this;
    all_keys = [];
    queue = new Queue(1);
    _fn = function(model_type) {
      return queue.defer(function(callback) {
        return _this.getMeta(model_type, function(err, keys) {
          if (err || !keys) {
            return callback(err);
          }
          all_keys = all_keys.concat(keys);
          return callback();
        });
      });
    };
    for (_i = 0, _len = model_types.length; _i < _len; _i++) {
      model_type = model_types[_i];
      _fn(model_type);
    }
    return queue.await(function(err) {
      return callback(err, all_keys);
    });
  };

  QueryCache.prototype.storeKeyForModelTypes = function(model_types, cache_key, callback) {
    var model_type, queue, _fn, _i, _len,
      _this = this;
    queue = new Queue(1);
    _fn = function(model_type) {
      return queue.defer(function(callback) {
        var model_type_key;
        model_type_key = _this.cacheKeyMeta(model_type);
        return _this.store.get(model_type_key, function(err, keys) {
          if (err) {
            return callback(err);
          }
          (keys || (keys = [])).push(cache_key);
          return _this.store.set(model_type_key, _.uniq(keys), callback);
        });
      });
    };
    for (_i = 0, _len = model_types.length; _i < _len; _i++) {
      model_type = model_types[_i];
      _fn(model_type);
    }
    return queue.await(callback);
  };

  return QueryCache;

})();

});

;require.register("backbone-orm/lib/cache/singletons", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var e;

module.exports = {
  ModelCache: new (require('./model_cache'))(),
  QueryCache: new (require('./query_cache'))()
};

try {
  module.exports.ModelTypeID = new (require('../node/model_type_id'))();
} catch (_error) {
  e = _error;
}

});

;require.register("backbone-orm/lib/cache/sync", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var CacheCursor, CacheSync, DESTROY_BATCH_LIMIT, DESTROY_THREADS, Schema, Utils, bbCallback, _;

_ = require('underscore');

CacheCursor = require('./cursor');

Schema = require('../schema');

Utils = require('../utils');

bbCallback = Utils.bbCallback;

DESTROY_BATCH_LIMIT = 1000;

DESTROY_THREADS = 100;

CacheSync = (function() {
  function CacheSync(model_type, wrapped_sync_fn) {
    this.model_type = model_type;
    this.wrapped_sync_fn = wrapped_sync_fn;
  }

  CacheSync.prototype.initialize = function() {
    if (this.is_initialized) {
      return;
    }
    this.is_initialized = true;
    this.wrapped_sync_fn('initialize');
    if (!this.model_type.model_name) {
      throw new Error('Missing model_name for model');
    }
  };

  CacheSync.prototype.read = function(model, options) {
    var cached_model;
    if (!options.force && (cached_model = this.model_type.cache.get(model.id))) {
      return options.success(cached_model.toJSON());
    }
    return this.wrapped_sync_fn('read', model, options);
  };

  CacheSync.prototype.create = function(model, options) {
    var _this = this;
    return this.wrapped_sync_fn('create', model, bbCallback(function(err, json) {
      var cache_model;
      if (err) {
        return options.error(err);
      }
      model.set({
        id: json.id
      });
      if (cache_model = _this.model_type.cache.get(model.id)) {
        if (cache_model !== model) {
          Utils.updateModel(cache_model, model);
        }
      } else {
        _this.model_type.cache.set(model.id, model);
      }
      return options.success(json);
    }));
  };

  CacheSync.prototype.update = function(model, options) {
    var _this = this;
    return this.wrapped_sync_fn('update', model, bbCallback(function(err, json) {
      var cache_model;
      if (err) {
        return options.error(err);
      }
      if (cache_model = _this.model_type.cache.get(model.id)) {
        if (cache_model !== model) {
          Utils.updateModel(cache_model, model);
        }
      } else {
        _this.model_type.cache.set(model.id, model);
      }
      return options.success(json);
    }));
  };

  CacheSync.prototype["delete"] = function(model, options) {
    var _this = this;
    this.model_type.cache.destroy(model.id);
    return this.wrapped_sync_fn('delete', model, bbCallback(function(err, json) {
      if (err) {
        return options.error(err);
      }
      return options.success(json);
    }));
  };

  CacheSync.prototype.resetSchema = function(options, callback) {
    var _this = this;
    return this.model_type.cache.reset(function(err) {
      if (err) {
        return callback(err);
      }
      return _this.wrapped_sync_fn('resetSchema', options, callback);
    });
  };

  CacheSync.prototype.cursor = function(query) {
    if (query == null) {
      query = {};
    }
    return new CacheCursor(query, _.pick(this, ['model_type', 'wrapped_sync_fn']));
  };

  CacheSync.prototype.destroy = function(query, callback) {
    var _this = this;
    return this.model_type.each(_.extend({
      $each: {
        limit: DESTROY_BATCH_LIMIT,
        threads: DESTROY_THREADS
      }
    }, query), (function(model, callback) {
      return model.destroy(callback);
    }), callback);
  };

  CacheSync.prototype.connect = function(url) {
    this.model_type.cache.reset();
    return this.wrapped_sync_fn('connect');
  };

  return CacheSync;

})();

module.exports = function(model_type, wrapped_sync_fn) {
  var sync, sync_fn;
  sync = new CacheSync(model_type, wrapped_sync_fn);
  model_type.prototype.sync = sync_fn = function(method, model, options) {
    if (options == null) {
      options = {};
    }
    sync.initialize();
    if (method === 'createSync') {
      return wrapped_sync_fn.apply(null, arguments);
    }
    if (method === 'sync') {
      return sync;
    }
    if (sync[method]) {
      return sync[method].apply(sync, Array.prototype.slice.call(arguments, 1));
    }
    return wrapped_sync_fn.apply(wrapped_sync_fn, Array.prototype.slice.call(arguments));
  };
  return sync_fn;
};

});

;require.register("backbone-orm/lib/connection_pool", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var MemoryStore;

MemoryStore = require('./cache/memory_store');

module.exports = new MemoryStore({
  destroy: function(url, connection) {
    return connection.destroy();
  }
});

});

;require.register("backbone-orm/lib/cursor", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var CURSOR_KEYS, Cursor, QueryCache, Utils, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('underscore');

QueryCache = require('./cache/singletons').QueryCache;

Utils = require('./utils');

CURSOR_KEYS = ['$count', '$exists', '$zero', '$one', '$offset', '$limit', '$page', '$sort', '$white_list', '$select', '$include', '$values', '$ids'];

module.exports = Cursor = (function() {
  var _this = this;

  function Cursor(query, options) {
    this.relatedModelTypesInQuery = __bind(this.relatedModelTypesInQuery, this);
    var key, parsed_query, value, _i, _len, _ref;
    for (key in options) {
      value = options[key];
      this[key] = value;
    }
    parsed_query = Cursor.parseQuery(query, this.model_type);
    this._find = parsed_query.find;
    this._cursor = parsed_query.cursor;
    _ref = ['$white_list', '$select', '$values'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      if (this._cursor[key] && !_.isArray(this._cursor[key])) {
        this._cursor[key] = [this._cursor[key]];
      }
    }
  }

  Cursor.validateQuery = function(query, memo, model_type) {
    var full_key, key, value, _results;
    _results = [];
    for (key in query) {
      value = query[key];
      if (!(_.isUndefined(value) || _.isObject(value))) {
        continue;
      }
      full_key = memo ? "" + memo + "." + key : key;
      if (_.isUndefined(value)) {
        throw new Error("Unexpected undefined for query key '" + full_key + "' on " + (model_type != null ? model_type.model_name : void 0));
      }
      if (_.isObject(value)) {
        _results.push(Cursor.validateQuery(value, full_key, model_type));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Cursor.parseQuery = function(query, model_type) {
    var e, key, parsed_query, value;
    if (!query) {
      return {
        find: {},
        cursor: {}
      };
    } else if (!_.isObject(query)) {
      return {
        find: {
          id: query
        },
        cursor: {
          $one: true
        }
      };
    } else if (query.find || query.cursor) {
      return {
        find: query.find || {},
        cursor: query.cursor || {}
      };
    } else {
      try {
        Cursor.validateQuery(query, null, model_type);
      } catch (_error) {
        e = _error;
        throw new Error("Error: " + e + ". Query: ", query);
      }
      parsed_query = {
        find: {},
        cursor: {}
      };
      for (key in query) {
        value = query[key];
        if (key[0] !== '$') {
          parsed_query.find[key] = value;
        } else {
          parsed_query.cursor[key] = value;
        }
      }
      return parsed_query;
    }
  };

  Cursor.prototype.offset = function(offset) {
    this._cursor.$offset = offset;
    return this;
  };

  Cursor.prototype.limit = function(limit) {
    this._cursor.$limit = limit;
    return this;
  };

  Cursor.prototype.sort = function(sort) {
    this._cursor.$sort = sort;
    return this;
  };

  Cursor.prototype.whiteList = function(args) {
    var keys;
    keys = _.flatten(arguments);
    this._cursor.$white_list = this._cursor.$white_list ? _.intersection(this._cursor.$white_list, keys) : keys;
    return this;
  };

  Cursor.prototype.select = function(args) {
    var keys;
    keys = _.flatten(arguments);
    this._cursor.$select = this._cursor.$select ? _.intersection(this._cursor.$select, keys) : keys;
    return this;
  };

  Cursor.prototype.include = function(args) {
    var keys;
    keys = _.flatten(arguments);
    this._cursor.$include = this._cursor.$include ? _.intersection(this._cursor.$include, keys) : keys;
    return this;
  };

  Cursor.prototype.values = function(args) {
    var keys;
    keys = _.flatten(arguments);
    this._cursor.$values = this._cursor.$values ? _.intersection(this._cursor.$values, keys) : keys;
    return this;
  };

  Cursor.prototype.ids = function() {
    this._cursor.$values = ['id'];
    return this;
  };

  Cursor.prototype.count = function(callback) {
    return this.execWithCursorQuery('$count', 'toJSON', callback);
  };

  Cursor.prototype.exists = function(callback) {
    return this.execWithCursorQuery('$exists', 'toJSON', callback);
  };

  Cursor.prototype.toModel = function(callback) {
    return this.execWithCursorQuery('$one', 'toModels', callback);
  };

  Cursor.prototype.toModels = function(callback) {
    var _this = this;
    if (this._cursor.$values) {
      return callback(new Error("Cannot call toModels on cursor with values for model " + this.model_type.model_name + ". Values: " + (Utils.inspect(this._cursor.$values))));
    }
    return this.toJSON(function(err, json) {
      if (err) {
        return callback(err);
      }
      if (_this._cursor.$one && !json) {
        return callback(null, null);
      }
      if (!_.isArray(json)) {
        json = [json];
      }
      return _this.prepareIncludes(json, function(err, json) {
        var can_cache, item, model, models;
        if (can_cache = !(_this._cursor.$select || _this._cursor.$whitelist)) {
          models = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = json.length; _i < _len; _i++) {
              item = json[_i];
              _results.push(Utils.updateOrNew(item, this.model_type));
            }
            return _results;
          }).call(_this);
        } else {
          models = ((function() {
            var _i, _len, _results;
            model = new this.model_type(this.model_type.prototype.parse(item));
            model.setPartial(true);
            _results = [];
            for (_i = 0, _len = json.length; _i < _len; _i++) {
              item = json[_i];
              _results.push(model);
            }
            return _results;
          }).call(_this));
        }
        return callback(null, _this._cursor.$one ? models[0] : models);
      });
    });
  };

  Cursor.prototype.toJSON = function(callback) {
    var parsed_query,
      _this = this;
    parsed_query = _.extend({}, _.pick(this._cursor, CURSOR_KEYS), this._find);
    return QueryCache.get(this.model_type, parsed_query, function(err, cached_result) {
      var model_types;
      if (err) {
        return callback(err);
      }
      if (!_.isUndefined(cached_result)) {
        return callback(null, cached_result);
      }
      model_types = _this.relatedModelTypesInQuery();
      return _this.queryToJSON(function(err, json) {
        if (err) {
          return callback(err);
        }
        if (!_.isNull(json)) {
          return QueryCache.set(_this.model_type, parsed_query, model_types, json, function(err) {
            if (err) {
              console.log("Error setting query cache: " + err);
            }
            return callback(null, json);
          });
        } else {
          return callback(null, json);
        }
      });
    });
  };

  Cursor.prototype.queryToJSON = function(callback) {
    throw new Error('toJSON must be implemented by a concrete cursor for a Backbone Sync type');
  };

  Cursor.prototype.hasCursorQuery = function(key) {
    return this._cursor[key] || (this._cursor[key] === '');
  };

  Cursor.prototype.execWithCursorQuery = function(key, method, callback) {
    var value,
      _this = this;
    value = this._cursor[key];
    this._cursor[key] = true;
    return this[method](function(err, json) {
      if (_.isUndefined(value)) {
        delete _this._cursor[key];
      } else {
        _this._cursor[key] = value;
      }
      return callback(err, json);
    });
  };

  Cursor.prototype.relatedModelTypesInQuery = function() {
    var key, related_fields, related_model_types, relation, relation_key, reverse_relation, value, _i, _len, _ref, _ref1, _ref2;
    related_fields = [];
    related_model_types = [];
    _ref = this._find;
    for (key in _ref) {
      value = _ref[key];
      if (key.indexOf('.') > 0) {
        _ref1 = key.split('.'), relation_key = _ref1[0], key = _ref1[1];
        related_fields.push(relation_key);
      } else if ((reverse_relation = this.model_type.reverseRelation(key)) && reverse_relation.join_table) {
        related_model_types.push(reverse_relation.model_type);
        related_model_types.push(reverse_relation.join_table);
      }
    }
    if ((_ref2 = this._cursor) != null ? _ref2.$include : void 0) {
      related_fields = related_fields.concat(this._cursor.$include);
    }
    for (_i = 0, _len = related_fields.length; _i < _len; _i++) {
      relation_key = related_fields[_i];
      if (relation = this.model_type.relation(relation_key)) {
        related_model_types.push(relation.reverse_model_type);
        if (relation.join_table) {
          related_model_types.push(relation.join_table);
        }
      }
    }
    return related_model_types;
  };

  Cursor.prototype.selectResults = function(json) {
    var $select, $values, item, key;
    if (this._cursor.$values) {
      $values = this._cursor.$white_list ? _.intersection(this._cursor.$values, this._cursor.$white_list) : this._cursor.$values;
      if (this._cursor.$values.length === 1) {
        key = this._cursor.$values[0];
        json = $values.length ? (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = json.length; _i < _len; _i++) {
            item = json[_i];
            _results.push(item.hasOwnProperty(key) ? item[key] : null);
          }
          return _results;
        })() : _.map(json, function() {
          return null;
        });
      } else {
        json = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = json.length; _i < _len; _i++) {
            item = json[_i];
            _results.push((function() {
              var _j, _len1, _results1;
              _results1 = [];
              for (_j = 0, _len1 = $values.length; _j < _len1; _j++) {
                key = $values[_j];
                if (item.hasOwnProperty(key)) {
                  _results1.push(item[key]);
                }
              }
              return _results1;
            })());
          }
          return _results;
        })();
      }
    } else if (this._cursor.$select) {
      $select = this._cursor.$white_list ? _.intersection(this._cursor.$select, this._cursor.$white_list) : this._cursor.$select;
      json = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = json.length; _i < _len; _i++) {
          item = json[_i];
          _results.push(_.pick(item, $select));
        }
        return _results;
      })();
    } else if (this._cursor.$white_list) {
      json = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = json.length; _i < _len; _i++) {
          item = json[_i];
          _results.push(_.pick(item, this._cursor.$white_list));
        }
        return _results;
      }).call(this);
    }
    if (this._cursor.$one) {
      return json[0] || null;
    } else {
      return json;
    }
  };

  Cursor.prototype.selectFromModels = function(models, callback) {
    var $select, item, model;
    if (this._cursor.$select) {
      $select = this._cursor.$white_list ? _.intersection(this._cursor.$select, this._cursor.$white_list) : this._cursor.$select;
      models = ((function() {
        var _i, _len, _results;
        model = new this.model_type(_.pick(model.attributes, $select));
        model.setPartial(true);
        _results = [];
        for (_i = 0, _len = models.length; _i < _len; _i++) {
          item = models[_i];
          _results.push(model);
        }
        return _results;
      }).call(this));
    } else if (this._cursor.$white_list) {
      models = ((function() {
        var _i, _len, _results;
        model = new this.model_type(_.pick(model.attributes, this._cursor.$white_list));
        model.setPartial(true);
        _results = [];
        for (_i = 0, _len = models.length; _i < _len; _i++) {
          item = models[_i];
          _results.push(model);
        }
        return _results;
      }).call(this));
    }
    return models;
  };

  Cursor.prototype.prepareIncludes = function(json, callback) {
    var findOrNew, include, item, model_json, related_json, relation, schema, shared_related_models, _i, _j, _len, _len1, _ref,
      _this = this;
    if (!_.isArray(this._cursor.$include) || _.isEmpty(this._cursor.$include)) {
      return callback(null, json);
    }
    schema = this.model_type.schema();
    shared_related_models = {};
    findOrNew = function(related_json, reverse_model_type) {
      if (!shared_related_models[related_json.id]) {
        if (reverse_model_type.cache) {
          if (!(shared_related_models[related_json.id] = reverse_model_type.cache.get(related_json.id))) {
            reverse_model_type.cache.set(related_json.id, shared_related_models[related_json.id] = new reverse_model_type(related_json));
          }
        } else {
          shared_related_models[related_json.id] = new reverse_model_type(related_json);
        }
      }
      return shared_related_models[related_json.id];
    };
    _ref = this._cursor.$include;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      include = _ref[_i];
      relation = schema.relation(include);
      shared_related_models = {};
      for (_j = 0, _len1 = json.length; _j < _len1; _j++) {
        model_json = json[_j];
        if (_.isArray(related_json = model_json[include])) {
          model_json[include] = (function() {
            var _k, _len2, _results;
            _results = [];
            for (_k = 0, _len2 = related_json.length; _k < _len2; _k++) {
              item = related_json[_k];
              _results.push(findOrNew(item, relation.reverse_model_type));
            }
            return _results;
          })();
        } else if (related_json) {
          model_json[include] = findOrNew(related_json, relation.reverse_model_type);
        }
      }
    }
    return callback(null, json);
  };

  return Cursor;

}).call(this);

});

;require.register("backbone-orm/lib/database_url", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var DatabaseURL, SUPPORTED_KEYS, URL, inflection, _;

_ = require('underscore');

inflection = require('inflection');

URL = require('url');

SUPPORTED_KEYS = ['protocol', 'slashes', 'auth', 'host', 'hostname', 'port', 'search', 'query', 'hash', 'href'];

module.exports = DatabaseURL = (function() {
  function DatabaseURL(url, parse_query_string, slashes_denote_host) {
    var database, database_parts, databases, databases_string, host, key, parts, path_paths, start_parts, start_url, url_parts, _i, _j, _k, _len, _len1, _len2, _ref;
    url_parts = URL.parse(url, parse_query_string, slashes_denote_host);
    parts = url_parts.pathname.split(',');
    if (parts.length > 1) {
      start_parts = _.pick(url_parts, 'protocol', 'auth', 'slashes');
      start_parts.host = '{1}';
      start_parts.pathname = '{2}';
      start_url = URL.format(start_parts);
      start_url = start_url.replace('{1}/{2}', '');
      path_paths = url_parts.pathname.split('/');
      url_parts.pathname = "/" + path_paths[path_paths.length - 2] + "/" + path_paths[path_paths.length - 1];
      databases_string = url.replace(start_url, '');
      databases_string = databases_string.substring(0, databases_string.indexOf(url_parts.pathname));
      databases = databases_string.split(',');
      _ref = ['host', 'hostname', 'port'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        delete url_parts[key];
      }
      this.hosts = [];
      for (_j = 0, _len1 = databases.length; _j < _len1; _j++) {
        database = databases[_j];
        host = database.split(':');
        this.hosts.push(host.length === 1 ? {
          host: host[0],
          hostname: host[0]
        } : {
          host: host[0],
          hostname: "" + host[0] + ":" + host[1],
          port: host[1]
        });
      }
    }
    database_parts = url_parts.pathname.split('/');
    this.table = database_parts.pop();
    this.database = database_parts[database_parts.length - 1];
    for (_k = 0, _len2 = SUPPORTED_KEYS.length; _k < _len2; _k++) {
      key = SUPPORTED_KEYS[_k];
      if (url_parts.hasOwnProperty(key)) {
        this[key] = url_parts[key];
      }
    }
  }

  DatabaseURL.prototype.format = function(options) {
    var host_strings, url, url_parts;
    if (options == null) {
      options = {};
    }
    url_parts = _.pick(this, SUPPORTED_KEYS);
    url_parts.pathname = '';
    if (this.hosts) {
      host_strings = _.map(this.hosts, function(host) {
        return "" + host.host + (host.port ? ':' + host.port : '');
      });
      url_parts.pathname += host_strings.join(',');
      url_parts.host = "{1}";
    }
    if (this.database) {
      url_parts.pathname += "/" + this.database;
    }
    if (this.table && !options.exclude_table) {
      url_parts.pathname += "/" + this.table;
    }
    if (options.exclude_search || options.exclude_query) {
      delete url_parts.search;
      delete url_parts.query;
    }
    url = URL.format(url_parts);
    if (this.hosts) {
      url = url.replace("{1}/" + url_parts.pathname, url_parts.pathname);
    }
    return url;
  };

  DatabaseURL.prototype.parseAuth = function() {
    var auth_parts, result;
    if (!this.auth) {
      return null;
    }
    auth_parts = this.auth.split(':');
    result = {
      user: auth_parts[0]
    };
    result.password = auth_parts.length > 1 ? auth_parts[1] : null;
    return result;
  };

  DatabaseURL.prototype.modelName = function() {
    if (this.table) {
      return inflection.classify(inflection.singularize(this.table));
    } else {
      return null;
    }
  };

  return DatabaseURL;

})();

});

;require.register("backbone-orm/lib/extensions/collection", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var Backbone, Utils, collection_type, fn, key, overrides, _;

_ = require('underscore');

Backbone = require('backbone');

Utils = require('../utils');

collection_type = Backbone.Collection;

overrides = {
  fetch: function(options) {
    var callback,
      _this = this;
    if (_.isFunction(callback = arguments[arguments.length - 1])) {
      switch (arguments.length) {
        case 1:
          options = Utils.wrapOptions({}, callback);
          break;
        case 2:
          options = Utils.wrapOptions(options, callback);
      }
    }
    return collection_type.prototype._orm_original_fns.fetch.call(this, Utils.wrapOptions(options, function(err, model, resp, options) {
      if (err) {
        return typeof options.error === "function" ? options.error(_this, resp, options) : void 0;
      }
      return typeof options.success === "function" ? options.success(model, resp, options) : void 0;
    }));
  },
  _prepareModel: function(attrs, options) {
    var id, is_new, model;
    if (!Utils.isModel(attrs) && (id = Utils.dataId(attrs))) {
      if (this.model.cache) {
        is_new = !!this.model.cache.get(id);
      }
      model = Utils.updateOrNew(attrs, this.model);
      if (is_new && !model._validate(attrs, options)) {
        this.trigger('invalid', this, attrs, options);
        return false;
      }
      return model;
    }
    return collection_type.prototype._orm_original_fns._prepareModel.call(this, attrs, options);
  }
};

if (!collection_type.prototype._orm_original_fns) {
  collection_type.prototype._orm_original_fns = {};
  for (key in overrides) {
    fn = overrides[key];
    collection_type.prototype._orm_original_fns[key] = collection_type.prototype[key];
    collection_type.prototype[key] = fn;
  }
}

});

;require.register("backbone-orm/lib/extensions/model", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var Backbone, ModelStream, Queue, Utils, modelEach, modelInterval, moment, _;

_ = require('underscore');

Backbone = require('backbone');

moment = require('moment');

Queue = require('../queue');

Utils = require('../utils');

ModelStream = require('./model_stream');

modelEach = require('./model_each');

modelInterval = require('./model_interval');

require('./collection');

module.exports = function(model_type) {
  var BackboneModelExtensions, fn, key, overrides, _findOrClone, _results;
  BackboneModelExtensions = (function() {
    function BackboneModelExtensions() {}

    return BackboneModelExtensions;

  })();
  model_type.createSync = function(target_model_type) {
    return model_type.prototype.sync('createSync', target_model_type);
  };
  model_type.resetSchema = function(options, callback) {
    var _ref;
    if (arguments.length === 1) {
      _ref = [{}, options], options = _ref[0], callback = _ref[1];
    }
    return model_type.prototype.sync('resetSchema', options, callback);
  };
  model_type.cursor = function(query) {
    if (query == null) {
      query = {};
    }
    return model_type.prototype.sync('cursor', query);
  };
  model_type.destroy = function(query, callback) {
    var _ref;
    if (arguments.length === 1) {
      _ref = [{}, query], query = _ref[0], callback = _ref[1];
    }
    if (!_.isObject(query)) {
      query = {
        id: query
      };
    }
    return model_type.prototype.sync('destroy', query, callback);
  };
  model_type.db = function() {
    return model_type.prototype.sync('db');
  };
  model_type.exists = function(query, callback) {
    var _ref;
    if (arguments.length === 1) {
      _ref = [{}, query], query = _ref[0], callback = _ref[1];
    }
    return model_type.prototype.sync('cursor', query).exists(callback);
  };
  model_type.count = function(query, callback) {
    var _ref;
    if (arguments.length === 1) {
      _ref = [{}, query], query = _ref[0], callback = _ref[1];
    }
    return model_type.prototype.sync('cursor', query).count(callback);
  };
  model_type.all = function(callback) {
    return model_type.prototype.sync('cursor', {}).toModels(callback);
  };
  model_type.find = function(query, callback) {
    var _ref;
    if (arguments.length === 1) {
      _ref = [{}, query], query = _ref[0], callback = _ref[1];
    }
    return model_type.prototype.sync('cursor', query).toModels(callback);
  };
  model_type.findOne = function(query, callback) {
    var _ref;
    if (arguments.length === 1) {
      _ref = [{}, query], query = _ref[0], callback = _ref[1];
    }
    query = _.isObject(query) ? _.extend({
      $one: true
    }, query) : {
      id: query,
      $one: true
    };
    return model_type.prototype.sync('cursor', query).toModels(callback);
  };
  model_type.findOrCreate = function(data, callback) {
    var query;
    if (!_.isObject(data) || Utils.isModel(data) || Utils.isCollection(data)) {
      throw 'findOrCreate requires object data';
    }
    query = _.extend({
      $one: true
    }, data);
    return model_type.prototype.sync('cursor', query).toModels(function(err, model) {
      if (err) {
        return callback(err);
      }
      if (model) {
        return callback(null, model);
      }
      model = new model_type(data);
      return model.save({}, function(err) {
        var cache;
        if (err) {
          return callback(err);
        }
        if (cache = model_type.cache) {
          cache.set(model.id, model);
        }
        return callback(null, model);
      });
    });
  };
  model_type.findOneNearestDate = function(date, options, query, callback) {
    var functions, key, _ref, _ref1,
      _this = this;
    if (!(key = options.key)) {
      throw new Error("Missing options key");
    }
    if (arguments.length === 2) {
      _ref = [{}, query], query = _ref[0], callback = _ref[1];
    } else if (arguments.length === 3) {
      _ref1 = [moment.utc().toDate(), {}, query], options = _ref1[0], query = _ref1[1], callback = _ref1[2];
    } else {
      query = _.clone(query);
    }
    query.$one = true;
    functions = [
      (function(callback) {
        query[key] = {
          $lte: date
        };
        return model_type.cursor(query).sort("-" + key).toModels(callback);
      }), (function(callback) {
        query[key] = {
          $gte: date
        };
        return model_type.cursor(query).sort(key).toModels(callback);
      })
    ];
    if (options.reverse) {
      functions = [functions[1], functions[0]];
    }
    return functions[0](function(err, model) {
      if (err) {
        return callback(err);
      }
      if (model) {
        return callback(null, model);
      }
      return functions[1](callback);
    });
  };
  model_type.each = function(query, iterator, callback) {
    var _ref;
    if (arguments.length === 2) {
      _ref = [{}, query, iterator], query = _ref[0], iterator = _ref[1], callback = _ref[2];
    }
    return modelEach(model_type, query, iterator, callback);
  };
  model_type.eachC = function(query, callback, iterator) {
    var _ref;
    if (arguments.length === 2) {
      _ref = [{}, query, callback], query = _ref[0], callback = _ref[1], iterator = _ref[2];
    }
    return modelEach(model_type, query, iterator, callback);
  };
  model_type.stream = function(query) {
    if (query == null) {
      query = {};
    }
    if (!ModelStream) {
      throw new Error('Stream is a large dependency so you need to manually include "stream.js" in the browser.');
    }
    return new ModelStream(model_type, query);
  };
  model_type.interval = function(query, iterator, callback) {
    return modelInterval(model_type, query, iterator, callback);
  };
  model_type.intervalC = function(query, callback, iterator) {
    return modelInterval(model_type, query, iterator, callback);
  };
  model_type.prototype.modelName = function() {
    return model_type.model_name;
  };
  model_type.prototype.cache = function() {
    return model_type.cache;
  };
  model_type.prototype.schema = model_type.schema = function() {
    return model_type.prototype.sync('schema');
  };
  model_type.prototype.tableName = model_type.tableName = function() {
    return model_type.prototype.sync('tableName');
  };
  model_type.prototype.relation = model_type.relation = function(key) {
    var schema;
    if (schema = model_type.prototype.sync('schema')) {
      return schema.relation(key);
    } else {
      return void 0;
    }
  };
  model_type.prototype.relationIsEmbedded = model_type.relationIsEmbedded = function(key) {
    var relation;
    if (relation = model_type.relation(key)) {
      return !!relation.embed;
    } else {
      return false;
    }
  };
  model_type.prototype.reverseRelation = model_type.reverseRelation = function(key) {
    var schema;
    if (schema = model_type.prototype.sync('schema')) {
      return schema.reverseRelation(key);
    } else {
      return void 0;
    }
  };
  model_type.prototype.isLoaded = function(key) {
    if (arguments.length === 0) {
      key = '__model__';
    }
    return !Utils.orSet(this, 'needs_load', {})[key];
  };
  model_type.prototype.setLoaded = function(key, is_loaded) {
    var needs_load, _ref;
    if (arguments.length === 1) {
      _ref = ['__model__', key], key = _ref[0], is_loaded = _ref[1];
    }
    needs_load = Utils.orSet(this, 'needs_load', {});
    if (is_loaded && Utils.get(this, 'is_initialized')) {
      delete needs_load[key];
      return;
    }
    return needs_load[key] = !is_loaded;
  };
  model_type.prototype.isLoadedExists = function(key) {
    if (arguments.length === 0) {
      key = '__model__';
    }
    return Utils.orSet(this, 'needs_load', {}).hasOwnProperty(key);
  };
  model_type.prototype.isPartial = function() {
    return !!Utils.get(this, 'partial');
  };
  model_type.prototype.setPartial = function(is_partial) {
    if (is_partial) {
      return Utils.set(this, 'partial', true);
    } else {
      return Utils.unset(this, 'partial');
    }
  };
  model_type.prototype.patchAdd = function(key, relateds, callback) {
    var relation;
    if (!(relation = this.relation(key))) {
      return callback(new Error("patchAdd: relation '" + key + "' unrecognized"));
    }
    if (!relateds) {
      return callback(new Error("patchAdd: missing relateds for '" + key + "'"));
    }
    return relation.patchAdd(this, relateds, callback);
  };
  model_type.prototype.patchRemove = function(key, relateds, callback) {
    var queue, relation, schema, _fn, _ref,
      _this = this;
    if (arguments.length === 1) {
      callback = key;
      schema = model_type.schema();
      queue = new Queue(1);
      _ref = schema.relations;
      _fn = function(relation) {
        return queue.defer(function(callback) {
          return relation.patchRemove(_this, callback);
        });
      };
      for (key in _ref) {
        relation = _ref[key];
        _fn(relation);
      }
      return queue.await(callback);
    } else {
      if (!(relation = this.relation(key))) {
        return callback(new Error("patchRemove: relation '" + key + "' unrecognized"));
      }
      if (arguments.length === 2) {
        callback = relateds;
        return relation.patchRemove(this, callback);
      } else {
        if (!relateds) {
          return callback(new Error("patchRemove: missing relateds for '" + key + "'"));
        }
        return relation.patchRemove(this, relateds, callback);
      }
    }
  };
  model_type.prototype.cursor = function(key, query) {
    var relation, schema;
    if (query == null) {
      query = {};
    }
    if (model_type.schema) {
      schema = model_type.schema();
    }
    if (schema && (relation = schema.relation(key))) {
      return relation.cursor(this, key, query);
    } else {
      throw new Error("" + schema.model_name + "::cursor: Unexpected key: " + key + " is not a relation");
    }
  };
  _findOrClone = function(model, options) {
    var cache, clone, _base, _name;
    if (model.isNew() || !model.modelName) {
      return model.clone(options);
    }
    cache = (_base = options._cache)[_name = model.modelName()] || (_base[_name] = {});
    if (!(clone = cache[model.id])) {
      clone = cache[model.id] = model.clone(options);
    }
    return clone;
  };
  overrides = {
    initialize: function() {
      var key, needs_load, relation, schema, value, _ref;
      if (model_type.schema && (schema = model_type.schema())) {
        _ref = schema.relations;
        for (key in _ref) {
          relation = _ref[key];
          relation.initializeModel(this);
        }
        needs_load = Utils.orSet(this, 'needs_load', {});
        for (key in needs_load) {
          value = needs_load[key];
          if (!value) {
            delete needs_load[key];
          }
        }
        Utils.set(this, 'is_initialized', true);
      }
      return model_type.prototype._orm_original_fns.initialize.apply(this, arguments);
    },
    fetch: function(options) {
      var callback,
        _this = this;
      if (_.isFunction(callback = arguments[arguments.length - 1])) {
        switch (arguments.length) {
          case 1:
            options = Utils.wrapOptions({}, callback);
            break;
          case 2:
            options = Utils.wrapOptions(options, callback);
        }
      }
      return model_type.prototype._orm_original_fns.fetch.call(this, Utils.wrapOptions(options, function(err, model, resp, options) {
        if (err) {
          return typeof options.error === "function" ? options.error(_this, resp, options) : void 0;
        }
        _this.setLoaded(true);
        return typeof options.success === "function" ? options.success(model, resp, options) : void 0;
      }));
    },
    unset: function(key) {
      var id;
      id = this.id;
      model_type.prototype._orm_original_fns.unset.apply(this, arguments);
      if (key === 'id' && model_type.cache && id && (model_type.cache.get(id) === this)) {
        return model_type.cache.destroy(id);
      }
    },
    set: function(key, value, options) {
      var attributes, relation, relational_attributes, schema, simple_attributes;
      if (!(model_type.schema && (schema = model_type.schema()))) {
        return model_type.prototype._orm_original_fns.set.apply(this, arguments);
      }
      if (_.isString(key)) {
        (attributes = {})[key] = value;
      } else {
        attributes = key;
        options = value;
      }
      simple_attributes = {};
      relational_attributes = {};
      for (key in attributes) {
        value = attributes[key];
        if (relation = schema.relation(key)) {
          relational_attributes[key] = relation;
        } else {
          simple_attributes[key] = value;
        }
      }
      if (_.size(simple_attributes)) {
        model_type.prototype._orm_original_fns.set.call(this, simple_attributes, options);
      }
      for (key in relational_attributes) {
        relation = relational_attributes[key];
        relation.set(this, key, attributes[key], options);
      }
      return this;
    },
    get: function(key, callback) {
      var relation, schema, value;
      if (model_type.schema) {
        schema = model_type.schema();
      }
      if (schema && (relation = schema.relation(key))) {
        return relation.get(this, key, callback);
      }
      value = model_type.prototype._orm_original_fns.get.call(this, key);
      if (callback) {
        callback(null, value);
      }
      return value;
    },
    toJSON: function(options) {
      var json, key, keys, relation, schema, value, _base, _i, _len;
      if (options == null) {
        options = {};
      }
      if (model_type.schema) {
        schema = model_type.schema();
      }
      this._orm || (this._orm = {});
      if (this._orm.json > 0) {
        return this.id;
      }
      (_base = this._orm).json || (_base.json = 0);
      this._orm.json++;
      json = {};
      keys = options.keys || this.whitelist || _.keys(this.attributes);
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        value = this.attributes[key];
        if (schema && (relation = schema.relation(key))) {
          relation.appendJSON(json, this);
        } else if (Utils.isCollection(value)) {
          json[key] = _.map(value.models, function(model) {
            if (model) {
              return model.toJSON(options);
            } else {
              return null;
            }
          });
        } else if (Utils.isModel(value)) {
          json[key] = value.toJSON(options);
        } else {
          json[key] = value;
        }
      }
      --this._orm.json;
      return json;
    },
    save: function(key, value, options) {
      var attributes, callback, _base,
        _this = this;
      if (_.isFunction(callback = arguments[arguments.length - 1])) {
        switch (arguments.length) {
          case 1:
            attributes = {};
            options = Utils.wrapOptions({}, callback);
            break;
          case 2:
            attributes = key;
            options = Utils.wrapOptions({}, callback);
            break;
          case 3:
            attributes = key;
            options = Utils.wrapOptions(value, callback);
            break;
          case 4:
            (attributes = {})[key] = value;
            options = Utils.wrapOptions(options, callback);
        }
      } else {
        if (key === null || _.isObject(key)) {
          attributes = key;
          options = value;
        } else {
          (attributes = {})[key] = value;
        }
      }
      if (!this.isLoaded()) {
        return typeof options.error === "function" ? options.error(this, new Error("An unloaded model is trying to be saved: " + model_type.model_name)) : void 0;
      }
      this._orm || (this._orm = {});
      if (this._orm.save > 0) {
        return typeof options.error === "function" ? options.error(this, new Error("Model is in a save loop: " + model_type.model_name)) : void 0;
      }
      (_base = this._orm).save || (_base.save = 0);
      this._orm.save++;
      this.set(attributes, options);
      attributes = {};
      return Utils.presaveBelongsToRelationships(this, function(err) {
        if (err) {
          return typeof options.error === "function" ? options.error(_this, err) : void 0;
        }
        return model_type.prototype._orm_original_fns.save.call(_this, attributes, Utils.wrapOptions(options, function(err, model, resp, options) {
          var queue, relation, schema, _fn, _ref;
          --_this._orm.save;
          if (err) {
            return typeof options.error === "function" ? options.error(_this, resp, options) : void 0;
          }
          queue = new Queue(1);
          if (model_type.schema) {
            schema = model_type.schema();
            _ref = schema.relations;
            _fn = function(relation) {
              return queue.defer(function(callback) {
                return relation.save(_this, callback);
              });
            };
            for (key in _ref) {
              relation = _ref[key];
              _fn(relation);
            }
          }
          return queue.await(function(err) {
            if (err) {
              return typeof options.error === "function" ? options.error(_this, Error("Failed to save relations. " + err, options)) : void 0;
            }
            return typeof options.success === "function" ? options.success(_this, resp, options) : void 0;
          });
        }));
      });
    },
    destroy: function(options) {
      var cache, callback, schema, _base,
        _this = this;
      if (_.isFunction(callback = arguments[arguments.length - 1])) {
        switch (arguments.length) {
          case 1:
            options = Utils.wrapOptions({}, callback);
            break;
          case 2:
            options = Utils.wrapOptions(options, callback);
        }
      }
      if (cache = this.cache()) {
        cache.destroy(this.id);
      }
      if (!(model_type.schema && (schema = model_type.schema()))) {
        return model_type.prototype._orm_original_fns.destroy.call(this, options);
      }
      this._orm || (this._orm = {});
      if (this._orm.destroy > 0) {
        throw new Error("Model is in a destroy loop: " + model_type.model_name);
      }
      (_base = this._orm).destroy || (_base.destroy = 0);
      this._orm.destroy++;
      return model_type.prototype._orm_original_fns.destroy.call(this, Utils.wrapOptions(options, function(err, model, resp, options) {
        --_this._orm.destroy;
        if (err) {
          return typeof options.error === "function" ? options.error(_this, resp, options) : void 0;
        }
        return _this.patchRemove(function(err) {
          if (err) {
            return typeof options.error === "function" ? options.error(_this, new Error("Failed to destroy relations. " + err, options)) : void 0;
          }
          return typeof options.success === "function" ? options.success(model, resp, options) : void 0;
        });
      }));
    },
    clone: function(options) {
      var cache, clone, key, keys, model, value, _base, _base1, _i, _len, _name, _ref;
      if (!model_type.schema) {
        return model_type.prototype._orm_original_fns.clone.apply(this, arguments);
      }
      options || (options = {});
      options._cache || (options._cache = {});
      cache = (_base = options._cache)[_name = this.modelName()] || (_base[_name] = {});
      this._orm || (this._orm = {});
      if (this._orm.clone > 0) {
        if (this.id) {
          return cache[this.id];
        } else {
          return model_type.prototype._orm_original_fns.clone.apply(this, arguments);
        }
      }
      (_base1 = this._orm).clone || (_base1.clone = 0);
      this._orm.clone++;
      if (this.id) {
        if (!(clone = cache[this.id])) {
          cache[this.id] = clone = new this.constructor();
        }
      } else {
        clone = new this.constructor();
      }
      if (this.attributes.id) {
        clone.id = this.attributes.id;
      }
      keys = options.keys || _.keys(this.attributes);
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        value = this.attributes[key];
        if (Utils.isCollection(value)) {
          if (!((_ref = clone.attributes[key]) != null ? _ref.values : void 0)) {
            clone.attributes[key] = new value.constructor();
          }
          clone.attributes[key].models = (function() {
            var _j, _len1, _ref1, _results;
            _ref1 = value.models;
            _results = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              model = _ref1[_j];
              _results.push(_findOrClone(model, options));
            }
            return _results;
          })();
        } else if (Utils.isModel(value)) {
          clone.attributes[key] = _findOrClone(value, options);
        } else {
          clone.attributes[key] = value;
        }
      }
      --this._orm.clone;
      return clone;
    }
  };
  if (!model_type.prototype._orm_original_fns) {
    model_type.prototype._orm_original_fns = {};
    _results = [];
    for (key in overrides) {
      fn = overrides[key];
      model_type.prototype._orm_original_fns[key] = model_type.prototype[key];
      _results.push(model_type.prototype[key] = fn);
    }
    return _results;
  }
};

});

;require.register("backbone-orm/lib/extensions/model_each", function(exports, require, module) {
var BATCH_DEFAULT_FETCH, Cursor, Queue, _;

_ = require('underscore');

Queue = require('../queue');

Cursor = null;

BATCH_DEFAULT_FETCH = 1000;

module.exports = function(model_type, query, iterator, callback) {
  var method, model_limit, options, parsed_query, processed_count, runBatch;
  if (!Cursor) {
    Cursor = require('../cursor');
  }
  options = query.$each || {};
  method = options.json ? 'toJSON' : 'toModels';
  processed_count = 0;
  parsed_query = Cursor.parseQuery(_.omit(query, '$each'));
  _.defaults(parsed_query.cursor, {
    $offset: 0,
    $sort: 'id'
  });
  model_limit = parsed_query.cursor.$limit || Infinity;
  parsed_query.cursor.$limit = options.fetch || BATCH_DEFAULT_FETCH;
  runBatch = function() {
    var cursor;
    cursor = model_type.cursor(parsed_query);
    return cursor[method].call(cursor, function(err, models) {
      var model, queue, _fn, _i, _len;
      if (err || !models) {
        return callback(new Error("Failed to get models. Error: " + err));
      }
      if (!models.length) {
        return callback(null, processed_count);
      }
      queue = new Queue(options.threads);
      _fn = function(model) {
        return queue.defer(function(callback) {
          return iterator(model, callback);
        });
      };
      for (_i = 0, _len = models.length; _i < _len; _i++) {
        model = models[_i];
        if (processed_count++ >= model_limit) {
          break;
        }
        _fn(model);
      }
      return queue.await(function(err) {
        if (err) {
          return callback(err);
        }
        if (processed_count >= model_limit) {
          return callback(null, processed_count);
        }
        if (models.length < parsed_query.cursor.$limit) {
          return callback(null, processed_count);
        }
        parsed_query.cursor.$offset += parsed_query.cursor.$limit;
        return runBatch();
      });
    });
  };
  return runBatch();
};

});

;require.register("backbone-orm/lib/extensions/model_interval", function(exports, require, module) {
var INTERVAL_TYPES, Queue, moment, _;

_ = require('underscore');

moment = require('moment');

Queue = require('../queue');

INTERVAL_TYPES = ['milliseconds', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'];

module.exports = function(model_type, query, iterator, callback) {
  var iteration_info, key, no_models, options, queue, range;
  options = query.$interval || {};
  if (!(key = options.key)) {
    throw new Error('missing option: key');
  }
  if (!options.type) {
    throw new Error('missing option: type');
  }
  if (!_.contains(INTERVAL_TYPES, options.type)) {
    throw new Error("type is not recognized: " + options.type + ", " + (_.contains(INTERVAL_TYPES, options.type)));
  }
  iteration_info = _.clone(options);
  if (!iteration_info.range) {
    iteration_info.range = {};
  }
  range = iteration_info.range;
  no_models = false;
  queue = new Queue(1);
  queue.defer(function(callback) {
    var start;
    if (!(start = range.$gte || range.$gt)) {
      return model_type.cursor(query).limit(1).sort(key).toModels(function(err, models) {
        if (err) {
          return callback(err);
        }
        if (!models.length) {
          no_models = true;
          return callback();
        }
        range.start = iteration_info.first = models[0].get(key);
        return callback();
      });
    } else {
      range.start = start;
      return model_type.findOneNearestDate(start, {
        key: key,
        reverse: true
      }, query, function(err, model) {
        if (err) {
          return callback(err);
        }
        if (!model) {
          no_models = true;
          return callback();
        }
        iteration_info.first = model.get(key);
        return callback();
      });
    }
  });
  queue.defer(function(callback) {
    var end;
    if (no_models) {
      return callback();
    }
    if (!(end = range.$lte || range.$lt)) {
      return model_type.cursor(query).limit(1).sort("-" + key).toModels(function(err, models) {
        if (err) {
          return callback(err);
        }
        if (!models.length) {
          no_models = true;
          return callback();
        }
        range.end = iteration_info.last = models[0].get(key);
        return callback();
      });
    } else {
      range.end = end;
      return model_type.findOneNearestDate(end, {
        key: key
      }, query, function(err, model) {
        if (err) {
          return callback(err);
        }
        if (!model) {
          no_models = true;
          return callback();
        }
        iteration_info.last = model.get(key);
        return callback();
      });
    }
  });
  return queue.await(function(err) {
    var length_ms, processed_count, runInterval, start_ms;
    if (err) {
      return callback(err);
    }
    if (no_models) {
      return callback();
    }
    start_ms = range.start.getTime();
    length_ms = moment.duration((_.isUndefined(options.length) ? 1 : options.length), options.type).asMilliseconds();
    if (!length_ms) {
      throw Error("length_ms is invalid: " + length_ms + " for range: " + (util.inspect(range)));
    }
    query = _.omit(query, '$interval');
    query.$sort = [key];
    processed_count = 0;
    iteration_info.index = 0;
    runInterval = function(current) {
      if (current.isAfter(range.end)) {
        return callback();
      }
      query[key] = {
        $gte: current.toDate(),
        $lte: iteration_info.last
      };
      return model_type.findOne(query, function(err, model) {
        var next;
        if (err) {
          return callback(err);
        }
        if (!model) {
          return callback();
        }
        next = model.get(key);
        iteration_info.index = Math.floor((next.getTime() - start_ms) / length_ms);
        current = moment.utc(range.start).add({
          milliseconds: iteration_info.index * length_ms
        });
        iteration_info.start = current.toDate();
        next = current.clone().add({
          milliseconds: length_ms
        });
        iteration_info.end = next.toDate();
        query[key] = {
          $gte: current.toDate(),
          $lt: next.toDate()
        };
        return iterator(query, iteration_info, function(err) {
          if (err) {
            return callback(err);
          }
          return runInterval(next);
        });
      });
    };
    return runInterval(moment(range.start));
  });
};

});

;require.register("backbone-orm/lib/extensions/model_stream", function(exports, require, module) {
var ModelStream, e, stream,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

try {
  stream = require('stream');
} catch (_error) {
  e = _error;
}

if (!(stream != null ? stream.Readable : void 0)) {
  module.exports = null;
  return;
}

module.exports = ModelStream = (function(_super) {
  __extends(ModelStream, _super);

  function ModelStream(model_type, query) {
    this.model_type = model_type;
    this.query = query != null ? query : {};
    ModelStream.__super__.constructor.call(this, {
      objectMode: true
    });
  }

  ModelStream.prototype._read = function() {
    var done,
      _this = this;
    if (this.ended || this.started) {
      return;
    }
    this.started = true;
    done = function(err) {
      _this.ended = true;
      if (err) {
        _this.emit('error', err);
      }
      return _this.push(null);
    };
    return this.model_type.each(this.query, (function(model, callback) {
      _this.push(model);
      return callback();
    }), done);
  };

  return ModelStream;

})(stream.Readable);

});

;require.register("backbone-orm/lib/index", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var e;

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
      symbol: 'Backbone',
      path: 'backbone'
    }, {
      symbol: 'moment',
      path: 'moment'
    }, {
      symbol: 'inflection',
      path: 'inflection'
    }, {
      symbol: 'stream',
      path: 'stream',
      optional: true
    }
  ]);
}

module.exports = {
  sync: require('./memory/sync'),
  Utils: require('./utils'),
  JSONUtils: require('./json_utils'),
  Queue: require('./queue'),
  DatabaseURL: require('./database_url'),
  modules: {
    url: require('url'),
    querystring: require('querystring'),
    'lru-cache': require('lru-cache'),
    underscore: require('underscore'),
    backbone: require('backbone'),
    moment: require('moment'),
    inflection: require('inflection')
  },
  Cursor: require('./cursor'),
  Schema: require('./schema'),
  ConnectionPool: require('./connection_pool'),
  CacheSingletons: require('./cache/singletons')
};

try {
  module.exports.modules.stream = require('stream');
} catch (_error) {
  e = _error;
}

});

;require.register("backbone-orm/lib/json_utils", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var JSONUtils, Queue, moment, _;

_ = require('underscore');

moment = require('moment');

Queue = require('./queue');

module.exports = JSONUtils = (function() {
  var _this = this;

  function JSONUtils() {}

  JSONUtils.parseParams = function(params) {
    var key, result, value;
    result = {};
    for (key in params) {
      value = params[key];
      result[key] = JSON.parse(value);
    }
    return result;
  };

  JSONUtils.parse = function(values) {
    var date, err, key, match, result, value;
    if (_.isNull(values) || (values === 'null')) {
      return null;
    }
    if (_.isDate(values)) {
      return values;
    }
    if (_.isArray(values)) {
      return _.map(values, JSONUtils.parse);
    }
    if (_.isObject(values)) {
      result = {};
      for (key in values) {
        value = values[key];
        result[key] = JSONUtils.parse(value);
      }
      return result;
    } else if (_.isString(values)) {
      if ((values.length >= 20) && values[values.length - 1] === 'Z') {
        date = moment.utc(values);
        if (date && date.isValid()) {
          return date.toDate();
        } else {
          return values;
        }
      }
      if (values === 'true') {
        return true;
      }
      if (values === 'false') {
        return false;
      }
      if (match = /^\"(.*)\"$/.exec(values)) {
        return match[0];
      }
      try {
        if (values = JSON.parse(values)) {
          return JSONUtils.parse(values);
        }
      } catch (_error) {
        err = _error;
      }
    }
    return values;
  };

  JSONUtils.toQuery = function(values, depth) {
    var key, result, value;
    if (depth == null) {
      depth = 0;
    }
    if (_.isNull(values)) {
      return 'null';
    }
    if (_.isArray(values)) {
      return JSON.stringify(values);
    }
    if (_.isDate(values) || values.toJSON) {
      return values.toJSON();
    }
    if (_.isObject(values)) {
      if (depth > 0) {
        return JSON.stringify(values);
      }
      result = {};
      for (key in values) {
        value = values[key];
        result[key] = JSONUtils.toQuery(value, 1);
      }
      return result;
    }
    return values;
  };

  JSONUtils.renderTemplate = function(models, template, options, callback) {
    var model, queue, results, _fn, _i, _len;
    if (arguments.length === 3) {
      callback = options;
      options = {};
    }
    if (!_.isArray(models)) {
      if (!models) {
        return callback(null, null);
      }
      if (_.isString(template)) {
        return JSONUtils.renderKey(models, template, options, callback);
      }
      if (_.isArray(template)) {
        return JSONUtils.renderKeys(models, template, options, callback);
      }
      if (_.isFunction(template)) {
        return template(models, options, callback);
      }
      return JSONUtils.renderDSL(models, template, options, callback);
    } else {
      results = [];
      queue = new Queue(1);
      _fn = function(model) {
        return queue.defer(function(callback) {
          return JSONUtils.renderTemplate(model, template, options, function(err, related_json) {
            if (err) {
              return callback(err);
            }
            results.push(related_json);
            return callback();
          });
        });
      };
      for (_i = 0, _len = models.length; _i < _len; _i++) {
        model = models[_i];
        _fn(model);
      }
      return queue.await(function(err) {
        return callback(err, err ? void 0 : results);
      });
    }
  };

  JSONUtils.renderDSL = function(model, dsl, options, callback) {
    var args, key, queue, result, _fn;
    if (arguments.length === 3) {
      callback = options;
      options = {};
    }
    queue = new Queue();
    result = {};
    _fn = function(key, args) {
      return queue.defer(function(callback) {
        var field, fn_args, query, relation, template;
        field = args.key || key;
        if (relation = model.relation(field)) {
          if (args.query) {
            query = args.query;
            template = args.template;
          } else if (args.$count) {
            query = _.clone(args);
            delete query.key;
          } else if (_.isFunction(args)) {
            template = args;
          } else if (args.template) {
            if (_.isObject(args.template) && !_.isFunction(args.template)) {
              query = args.template;
            } else {
              template = args.template;
              query = _.clone(args);
              delete query.key;
              delete query.template;
              if (_.size(query) === 0) {
                query = null;
              }
            }
          } else {
            template = _.clone(args);
            delete template.key;
          }
          if (template) {
            if (query) {
              return relation.cursor(model, field, query).toModels(function(err, models) {
                if (err) {
                  return callback(err);
                }
                return JSONUtils.renderTemplate(models, template, options, function(err, json) {
                  result[key] = json;
                  return callback(err);
                });
              });
            } else {
              return model.get(field, function(err, related_model) {
                if (err) {
                  return callback(err);
                }
                return JSONUtils.renderTemplate(related_model, template, options, function(err, json) {
                  result[key] = json;
                  return callback(err);
                });
              });
            }
          } else {
            return relation.cursor(model, field, query).toJSON(function(err, json) {
              result[key] = json;
              return callback(err);
            });
          }
        } else {
          if (key.length > 1 && key[key.length - 1] === '_') {
            key = key.slice(0, +(key.length - 2) + 1 || 9e9);
          }
          if (key === '$select') {
            if (_.isString(args)) {
              return JSONUtils.renderKey(model, args, options, function(err, json) {
                result[args] = json;
                return callback(err);
              });
            } else {
              return JSONUtils.renderKeys(model, args, options, function(err, json) {
                _.extend(result, json);
                return callback(err);
              });
            }
          } else if (_.isString(args)) {
            return JSONUtils.renderKey(model, args, options, function(err, json) {
              result[key] = json;
              return callback(err);
            });
          } else if (_.isFunction(args)) {
            return args(model, options, function(err, json) {
              result[key] = json;
              return callback(err);
            });
          } else if (_.isString(args.method)) {
            fn_args = _.isArray(args.args) ? args.args.slice() : (args.args ? [args.args] : []);
            fn_args.push(function(err, json) {
              result[key] = json;
              return callback();
            });
            return model[args.method].apply(model, fn_args);
          } else {
            console.trace("Unknown DSL action: " + key + ": ", args);
            return callback(new Error("Unknown DSL action: " + key + ": ", args));
          }
        }
      });
    };
    for (key in dsl) {
      args = dsl[key];
      _fn(key, args);
    }
    return queue.await(function(err) {
      return callback(err, err ? void 0 : result);
    });
  };

  JSONUtils.renderKeys = function(model, keys, options, callback) {
    var key, queue, result, _fn, _i, _len;
    if (arguments.length === 3) {
      callback = options;
      options = {};
    }
    result = {};
    queue = new Queue();
    _fn = function(key) {
      return queue.defer(function(callback) {
        return JSONUtils.renderKey(model, key, options, function(err, value) {
          if (err) {
            return callback(err);
          }
          result[key] = value;
          return callback();
        });
      });
    };
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      _fn(key);
    }
    return queue.await(function(err) {
      return callback(err, err ? void 0 : result);
    });
  };

  JSONUtils.renderKey = function(model, key, options, callback) {
    if (arguments.length === 3) {
      callback = options;
      options = {};
    }
    return model.get(key, function(err, value) {
      var item;
      if (err) {
        return callback(err);
      }
      if (model.relation(key)) {
        if (_.isArray(value)) {
          return callback(null, (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = value.length; _i < _len; _i++) {
              item = value[_i];
              _results.push(item.toJSON());
            }
            return _results;
          })());
        }
        if (value && value.toJSON) {
          return callback(null, value = value.toJSON());
        }
      }
      return callback(null, value);
    });
  };

  JSONUtils.renderRelated = function(models, attribute_name, template, options, callback) {
    var model, queue, results, _fn, _i, _len;
    if (arguments.length === 4) {
      callback = options;
      options = {};
    }
    if (!_.isArray(models)) {
      return models.get(attribute_name, function(err, related_models) {
        if (err) {
          callback(err);
        }
        return JSONUtils.renderTemplate(related_models, template, options, callback);
      });
    } else {
      results = [];
      queue = new Queue();
      _fn = function(model) {
        return queue.defer(function(callback) {
          return model.get(attribute_name, function(err, related_models) {
            if (err) {
              callback(err);
            }
            return JSONUtils.renderTemplate(related_models, template, options, function(err, related_json) {
              if (err) {
                return callback(err);
              }
              results.push(related_json);
              return callback();
            });
          });
        });
      };
      for (_i = 0, _len = models.length; _i < _len; _i++) {
        model = models[_i];
        _fn(model);
      }
      return queue.await(function(err) {
        return callback(err, err ? void 0 : results);
      });
    }
  };

  JSONUtils.deepClone = function(obj, depth) {
    var clone, key;
    if (!obj || (typeof obj !== 'object')) {
      return obj;
    }
    if (_.isString(obj)) {
      return String.prototype.slice.call(obj);
    }
    if (_.isDate(obj)) {
      return new Date(obj.valueOf());
    }
    if (_.isFunction(obj.clone)) {
      return obj.clone();
    }
    if (_.isArray(obj)) {
      clone = Array.prototype.slice.call(obj);
    } else if (obj.constructor !== {}.constructor) {
      return obj;
    } else {
      clone = _.extend({}, obj);
    }
    if (!_.isUndefined(depth) && (depth > 0)) {
      for (key in clone) {
        clone[key] = JSONUtils.deepClone(clone[key], depth - 1);
      }
    }
    return clone;
  };

  return JSONUtils;

}).call(this);

});

;require.register("backbone-orm/lib/memory/cursor", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var Cursor, IS_MATCH_FNS, IS_MATCH_OPERATORS, JSONUtils, MemoryCursor, Queue, Utils, inflection, moment, _, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ = require('underscore');

moment = require('moment');

inflection = require('inflection');

Queue = require('../queue');

Utils = require('../utils');

JSONUtils = require('../json_utils');

Cursor = require('../cursor');

IS_MATCH_FNS = {
  $ne: function(mv, tv) {
    return !_.isEqual(mv, tv);
  },
  $lt: function(mv, tv) {
    if (_.isNull(tv)) {
      throw Error('Cannot compare to null');
    }
    return (_.isDate(tv) ? moment(mv).isBefore(tv) : mv < tv);
  },
  $lte: function(mv, tv) {
    var mvm;
    if (_.isNull(tv)) {
      throw Error('Cannot compare to null');
    }
    if (_.isDate(tv)) {
      mvm = moment(mv);
      return mvm.isBefore(tv) || mvm.isSame(tv);
    } else {
      return (mv < tv) || _.isEqual(mv, tv);
    }
  },
  $gt: function(mv, tv) {
    if (_.isNull(tv)) {
      throw Error('Cannot compare to null');
    }
    return (_.isDate(tv) ? moment(mv).isAfter(tv) : mv > tv);
  },
  $gte: function(mv, tv) {
    var mvm;
    if (_.isNull(tv)) {
      throw Error('Cannot compare to null');
    }
    if (_.isDate(tv)) {
      mvm = moment(mv);
      return mvm.isAfter(tv) || mvm.isSame(tv);
    } else {
      return (mv > tv) || _.isEqual(mv, tv);
    }
  }
};

IS_MATCH_OPERATORS = _.keys(IS_MATCH_FNS);

module.exports = MemoryCursor = (function(_super) {
  __extends(MemoryCursor, _super);

  function MemoryCursor() {
    _ref = MemoryCursor.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  MemoryCursor.prototype.queryToJSON = function(callback) {
    var exists,
      _this = this;
    if (this.hasCursorQuery('$zero')) {
      return callback(null, this.hasCursorQuery('$one') ? null : []);
    }
    exists = this.hasCursorQuery('$exists');
    return this.buildFindQuery(function(err, find_query) {
      var json, keys, queue;
      if (err) {
        return callback(err);
      }
      json = [];
      keys = _.keys(find_query);
      queue = new Queue(1);
      queue.defer(function(callback) {
        var find_queue, id, ins, ins_size, key, model_json, value, _fn, _ref1, _ref2, _ref3;
        ins = {};
        for (key in find_query) {
          value = find_query[key];
          if (value != null ? value.$in : void 0) {
            delete find_query[key];
            ins[key] = value.$in;
          }
        }
        ins_size = _.size(ins);
        if (keys.length || ins_size) {
          if (_this._cursor.$ids) {
            _ref1 = _this.store;
            for (id in _ref1) {
              model_json = _ref1[id];
              if (_.contains(_this._cursor.$ids, model_json.id) && _.isEqual(_.pick(model_json, keys), find_query)) {
                json.push(JSONUtils.deepClone(model_json));
              }
            }
            return callback();
          } else {
            find_queue = new Queue();
            _ref2 = _this.store;
            _fn = function(model_json) {
              return find_queue.defer(function(callback) {
                var find_keys, next;
                find_keys = _.keys(find_query);
                next = function(err, is_match) {
                  if (err) {
                    return callback(err);
                  }
                  if (!is_match) {
                    return callback();
                  }
                  if (!find_keys.length || (exists && (keys.length !== find_keys.length))) {
                    json.push(JSONUtils.deepClone(model_json));
                    return callback();
                  }
                  return _this._valueIsMatch(find_query, find_keys.pop(), model_json, next);
                };
                return next(null, true);
              });
            };
            for (id in _ref2) {
              model_json = _ref2[id];
              _fn(model_json);
            }
            return find_queue.await(function(err) {
              if (err) {
                return callback(err);
              }
              if (ins_size) {
                json = _.filter(json, function(model_json) {
                  var values, _ref3;
                  for (key in ins) {
                    values = ins[key];
                    if (_ref3 = model_json[key], __indexOf.call(values, _ref3) >= 0) {
                      return true;
                    }
                  }
                });
              }
              return callback();
            });
          }
        } else {
          if (_this._cursor.$ids) {
            _ref3 = _this.store;
            for (id in _ref3) {
              model_json = _ref3[id];
              if (_.contains(_this._cursor.$ids, model_json.id)) {
                json.push(JSONUtils.deepClone(model_json));
              }
            }
          } else {
            json = (function() {
              var _ref4, _results;
              _ref4 = this.store;
              _results = [];
              for (id in _ref4) {
                model_json = _ref4[id];
                _results.push(JSONUtils.deepClone(model_json));
              }
              return _results;
            }).call(_this);
          }
          return callback();
        }
      });
      if (!exists) {
        queue.defer(function(callback) {
          var $sort_fields, number;
          if (_this._cursor.$sort) {
            $sort_fields = _.isArray(_this._cursor.$sort) ? _this._cursor.$sort : [_this._cursor.$sort];
            json.sort(function(model, next_model) {
              return Utils.jsonFieldCompare(model, next_model, $sort_fields);
            });
          }
          if (_this._cursor.$offset) {
            number = json.length - _this._cursor.$offset;
            if (number < 0) {
              number = 0;
            }
            json = number ? json.slice(_this._cursor.$offset, _this._cursor.$offset + number) : [];
          }
          if (_this._cursor.$one) {
            json = json.length ? [json[0]] : [];
          } else if (_this._cursor.$limit) {
            json = json.splice(0, Math.min(json.length, _this._cursor.$limit));
          }
          return callback();
        });
        queue.defer(function(callback) {
          return _this.fetchIncludes(json, callback);
        });
      }
      queue.await(function() {
        var count_cursor;
        if (_this.hasCursorQuery('$count')) {
          return callback(null, (_.isArray(json) ? json.length : (json ? 1 : 0)));
        }
        if (exists) {
          return callback(null, (_.isArray(json) ? !!json.length : json));
        }
        json = _this.selectResults(json);
        if (_this.hasCursorQuery('$page')) {
          count_cursor = new MemoryCursor(_this._find, _.extend(_.pick(_this, ['model_type', 'store'])));
          return count_cursor.count(function(err, count) {
            return callback(null, {
              offset: _this._cursor.$offset || 0,
              total_rows: count,
              rows: json
            });
          });
        } else {
          return callback(null, json);
        }
      });
    });
  };

  MemoryCursor.prototype.buildFindQuery = function(callback) {
    var find_query, key, queue, relation_key, reverse_relation, value, value_key, _fn, _ref1, _ref2,
      _this = this;
    queue = new Queue();
    find_query = {};
    _ref1 = this._find;
    _fn = function(relation_key, value_key, value) {
      return queue.defer(function(callback) {
        var related_query, relation;
        if (!(relation = _this.model_type.relation(relation_key))) {
          find_query[key] = value;
          return callback();
        }
        if (!relation.join_table && (value_key === 'id')) {
          find_query[relation.foreign_key] = value;
          return callback();
        } else if (relation.join_table || (relation.type === 'belongsTo')) {
          (related_query = {
            $values: 'id'
          })[value_key] = value;
          return relation.reverse_relation.model_type.cursor(related_query).toJSON(function(err, related_ids) {
            var join_query;
            if (err) {
              return callback(err);
            }
            if (relation.join_table) {
              (join_query = {})[relation.reverse_relation.join_key] = {
                $in: _.compact(related_ids)
              };
              join_query.$values = relation.foreign_key;
              return relation.join_table.cursor(join_query).toJSON(function(err, model_ids) {
                if (err) {
                  return callback(err);
                }
                find_query.id = {
                  $in: _.compact(model_ids)
                };
                return callback();
              });
            } else {
              find_query[relation.foreign_key] = {
                $in: _.compact(related_ids)
              };
              return callback();
            }
          });
        } else {
          (related_query = {})[value_key] = value;
          related_query.$values = relation.foreign_key;
          return relation.reverse_model_type.cursor(related_query).toJSON(function(err, model_ids) {
            if (err) {
              return callback(err);
            }
            find_query.id = {
              $in: _.compact(model_ids)
            };
            return callback();
          });
        }
      });
    };
    for (key in _ref1) {
      value = _ref1[key];
      if (key.indexOf('.') < 0) {
        if (!(reverse_relation = this.model_type.reverseRelation(key))) {
          find_query[key] = value;
          continue;
        }
        if (!reverse_relation.embed && !reverse_relation.join_table) {
          find_query[key] = value;
          continue;
        }
        (function(key, value, reverse_relation) {
          return queue.defer(function(callback) {
            var related_query;
            if (reverse_relation.embed) {
              throw Error("Embedded find is not yet supported. @_find: " + (util.inspect(_this._find)));
              (related_query = {}).id = value;
              return reverse_relation.model_type.cursor(related_query).toJSON(function(err, models_json) {
                if (err) {
                  return callback(err);
                }
                find_query._json = _.map(models_json, function(test) {
                  return test[reverse_relation.key];
                });
                return callback();
              });
            } else {
              (related_query = {})[key] = value;
              related_query.$values = reverse_relation.reverse_relation.join_key;
              return reverse_relation.join_table.cursor(related_query).toJSON(function(err, model_ids) {
                if (err) {
                  return callback(err);
                }
                find_query.id = {
                  $in: model_ids
                };
                return callback();
              });
            }
          });
        })(key, value, reverse_relation);
        continue;
      }
      _ref2 = key.split('.'), relation_key = _ref2[0], value_key = _ref2[1];
      if (this.model_type.relationIsEmbedded(relation_key)) {
        find_query[key] = value;
        continue;
      }
      _fn(relation_key, value_key, value);
    }
    return queue.await(function(err) {
      return callback(err, find_query);
    });
  };

  MemoryCursor.prototype.fetchIncludes = function(json, callback) {
    var include_keys, key, load_queue, model_json, relation, _fn, _i, _j, _len, _len1,
      _this = this;
    if (!this._cursor.$include) {
      return callback();
    }
    load_queue = new Queue(1);
    include_keys = _.isArray(this._cursor.$include) ? this._cursor.$include : [this._cursor.$include];
    for (_i = 0, _len = include_keys.length; _i < _len; _i++) {
      key = include_keys[_i];
      if (this.model_type.relationIsEmbedded(key)) {
        continue;
      }
      if (!(relation = this.model_type.relation(key))) {
        return callback(new Error("Included relation '" + key + "' is not a relation"));
      }
      _fn = function(key, model_json) {
        return load_queue.defer(function(callback) {
          return relation.cursor(model_json, key).toJSON(function(err, related_json) {
            if (err) {
              return calback(err);
            }
            delete model_json[relation.foriegn_key];
            model_json[key] = related_json;
            return callback();
          });
        });
      };
      for (_j = 0, _len1 = json.length; _j < _len1; _j++) {
        model_json = json[_j];
        _fn(key, model_json);
      }
    }
    return load_queue.await(callback);
  };

  MemoryCursor.prototype._valueIsMatch = function(find_query, key_path, model_json, callback) {
    var key_components, model_type, next,
      _this = this;
    key_components = key_path.split('.');
    model_type = this.model_type;
    next = function(err, models_json) {
      var find_value, is_match, key, model_value, operator, relation, was_handled, _i, _j, _len, _len1;
      if (err) {
        return callback(err);
      }
      key = key_components.shift();
      if (!key_components.length) {
        was_handled = false;
        find_value = find_query[key_path];
        if (!_.isArray(models_json)) {
          models_json = [models_json];
        }
        for (_i = 0, _len = models_json.length; _i < _len; _i++) {
          model_json = models_json[_i];
          model_value = model_json[key];
          if (_.isObject(find_value)) {
            for (_j = 0, _len1 = IS_MATCH_OPERATORS.length; _j < _len1; _j++) {
              operator = IS_MATCH_OPERATORS[_j];
              if (!(find_value.hasOwnProperty(operator))) {
                continue;
              }
              was_handled = true;
              if (!(is_match = IS_MATCH_FNS[operator](model_value, find_value[operator]))) {
                break;
              }
            }
          }
          if (was_handled) {
            if (is_match) {
              return callback(null, is_match);
            }
          } else if (is_match = _.isEqual(model_value, find_value)) {
            return callback(null, is_match);
          }
        }
        return callback(null, false);
      }
      if ((relation = model_type.relation(key)) && !relation.embed) {
        return relation.cursor(model_json, key).toJSON(next);
      }
      return next(null, model_json[key]);
    };
    return next(null, model_json);
  };

  return MemoryCursor;

})(Cursor);

});

;require.register("backbone-orm/lib/memory/sync", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var Backbone, DESTROY_BATCH_LIMIT, JSONUtils, MemoryCursor, MemorySync, ModelCache, QueryCache, Queue, STORES, Schema, Utils, _;

_ = require('underscore');

Backbone = require('backbone');

Queue = require('../queue');

MemoryCursor = require('./cursor');

Schema = require('../schema');

Utils = require('../utils');

JSONUtils = require('../json_utils');

ModelCache = require('../cache/singletons').ModelCache;

QueryCache = require('../cache/singletons').QueryCache;

DESTROY_BATCH_LIMIT = 1000;

STORES = {};

MemorySync = (function() {
  function MemorySync(model_type) {
    var _name;
    this.model_type = model_type;
    this.model_type.model_name = Utils.findOrGenerateModelName(this.model_type);
    this.schema = new Schema(this.model_type);
    this.store = this.model_type.store = STORES[_name = this.model_type.model_name] || (STORES[_name] = {});
  }

  MemorySync.prototype.initialize = function() {
    if (this.is_initialized) {
      return;
    }
    this.is_initialized = true;
    return this.schema.initialize();
  };

  MemorySync.prototype.read = function(model, options) {
    var id, model_json;
    if (model.models) {
      return options.success((function() {
        var _ref, _results;
        _ref = this.store;
        _results = [];
        for (id in _ref) {
          model_json = _ref[id];
          _results.push(JSONUtils.deepClone(model_json));
        }
        return _results;
      }).call(this));
    } else {
      if (_.isUndefined(this.store[model.id])) {
        return options.error(new Error("Model not found with id: " + model.id));
      }
      return options.success(JSONUtils.deepClone(this.store[model.id]));
    }
  };

  MemorySync.prototype.create = function(model, options) {
    var _this = this;
    return QueryCache.reset(this.model_type, function(err) {
      var model_json;
      if (err) {
        return typeof options.error === "function" ? options.error(err) : void 0;
      }
      model.set({
        id: Utils.guid()
      });
      model_json = _this.store[model.id] = model.toJSON();
      return options.success(JSONUtils.deepClone(model_json));
    });
  };

  MemorySync.prototype.update = function(model, options) {
    var _this = this;
    return QueryCache.reset(this.model_type, function(err) {
      var model_json;
      if (err) {
        return typeof options.error === "function" ? options.error(err) : void 0;
      }
      _this.store[model.id] = model_json = model.toJSON();
      return options.success(JSONUtils.deepClone(model_json));
    });
  };

  MemorySync.prototype["delete"] = function(model, options) {
    var _this = this;
    return QueryCache.reset(this.model_type, function(err) {
      if (err) {
        return typeof options.error === "function" ? options.error(err) : void 0;
      }
      if (!_this.store[model.id]) {
        return options.error(new Error('Model not found'));
      }
      delete _this.store[model.id];
      return options.success();
    });
  };

  MemorySync.prototype.resetSchema = function(options, callback) {
    var _this = this;
    return QueryCache.reset(this.model_type, function(err) {
      if (err) {
        return callback(err);
      }
      return _this.destroy({}, callback);
    });
  };

  MemorySync.prototype.cursor = function(query) {
    if (query == null) {
      query = {};
    }
    return new MemoryCursor(query, _.pick(this, ['model_type', 'store']));
  };

  MemorySync.prototype.destroy = function(query, callback) {
    var _this = this;
    return QueryCache.reset(this.model_type, function(err) {
      if (err) {
        return callback(err);
      }
      return _this.model_type.each(_.extend({
        $each: {
          limit: DESTROY_BATCH_LIMIT,
          json: true
        }
      }, query), (function(model_json, callback) {
        return Utils.patchRemoveByJSON(_this.model_type, model_json, function(err) {
          if (!err) {
            delete _this.store[model_json.id];
          }
          return callback(err);
        });
      }), callback);
    });
  };

  return MemorySync;

})();

module.exports = function(type) {
  var model_type, sync, sync_fn;
  if (Utils.isCollection(new type())) {
    model_type = Utils.configureCollectionModelType(type, module.exports);
    return type.prototype.sync = model_type.prototype.sync;
  }
  sync = new MemorySync(type);
  type.prototype.sync = sync_fn = function(method, model, options) {
    if (options == null) {
      options = {};
    }
    sync.initialize();
    if (method === 'createSync') {
      return module.exports.apply(null, Array.prototype.slice.call(arguments, 1));
    }
    if (method === 'sync') {
      return sync;
    }
    if (method === 'isRemote') {
      return false;
    }
    if (method === 'schema') {
      return sync.schema;
    }
    if (method === 'tableName') {
      return void 0;
    }
    if (sync[method]) {
      return sync[method].apply(sync, Array.prototype.slice.call(arguments, 1));
    } else {
      return void 0;
    }
  };
  Utils.configureModelType(type);
  return ModelCache.configureSync(type, sync_fn);
};

});

;require.register("backbone-orm/lib/queue", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var Queue,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = Queue = (function() {
  function Queue(parallelism) {
    this.parallelism = parallelism;
    this._doneTask = __bind(this._doneTask, this);
    this.parallelism || (this.parallelism = Infinity);
    this.tasks = [];
    this.running_count = 0;
    this.error = null;
    this.await_callback = null;
  }

  Queue.prototype.defer = function(callback) {
    this.tasks.push(callback);
    return this._runTasks();
  };

  Queue.prototype.await = function(callback) {
    if (this.await_callback) {
      throw new Error("Awaiting callback was added twice: " + callback);
    }
    this.await_callback = callback;
    if (!(this.tasks.length + this.running_count)) {
      return this._callAwaiting();
    }
  };

  Queue.prototype._doneTask = function(err) {
    this.running_count--;
    this.error || (this.error = err);
    return this._runTasks();
  };

  Queue.prototype._runTasks = function() {
    var current;
    if (this.error || !(this.tasks.length + this.running_count)) {
      return this._callAwaiting();
    }
    while (this.running_count < this.parallelism) {
      if (!this.tasks.length) {
        return;
      }
      current = this.tasks.shift();
      this.running_count++;
      current(this._doneTask);
    }
  };

  Queue.prototype._callAwaiting = function() {
    if (this.await_called || !this.await_callback) {
      return;
    }
    this.await_called = true;
    return this.await_callback(this.error);
  };

  return Queue;

})();

});

;require.register("backbone-orm/lib/relations/many", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var Backbone, Many, Queue, Utils, inflection, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require('backbone');

_ = require('underscore');

inflection = require('inflection');

Queue = require('../queue');

Utils = require('../utils');

module.exports = Many = (function(_super) {
  __extends(Many, _super);

  function Many(model_type, key, options) {
    var Collection, value, _ref;
    this.model_type = model_type;
    this.key = key;
    for (key in options) {
      value = options[key];
      this[key] = value;
    }
    this.virtual_id_accessor || (this.virtual_id_accessor = "" + (inflection.singularize(this.key)) + "_ids");
    if (!this.join_key) {
      this.join_key = inflection.foreign_key(this.model_type.model_name);
    }
    if (!this.foreign_key) {
      this.foreign_key = inflection.foreign_key(this.as || this.model_type.model_name);
    }
    if (!this.collection_type) {
      Collection = (function(_super1) {
        __extends(Collection, _super1);

        function Collection() {
          _ref = Collection.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        Collection.prototype.model = Collection.reverse_model_type;

        return Collection;

      })(Backbone.Collection);
      this.collection_type = Collection;
    }
  }

  Many.prototype.initialize = function() {
    var _ref;
    this.reverse_relation = this._findOrGenerateReverseRelation(this);
    if (this.embed && this.reverse_relation && this.reverse_relation.embed) {
      throw new Error("Both relationship directions cannot embed (" + this.model_type.model_name + " and " + this.reverse_model_type.model_name + "). Choose one or the other.");
    }
    if (((_ref = this.reverse_relation) != null ? _ref.type : void 0) === 'hasOne') {
      throw new Error("The reverse of a hasMany relation should be `belongsTo`, not `hasOne` (" + this.model_type.model_name + " and " + this.reverse_model_type.model_name + ").");
    }
    if (this.reverse_relation.type === 'hasMany') {
      return this.join_table = this.findOrGenerateJoinTable(this);
    }
  };

  Many.prototype.initializeModel = function(model) {
    if (!model.isLoadedExists(this.key)) {
      model.setLoaded(this.key, false);
    }
    return this._bindBacklinks(model);
  };

  Many.prototype.releaseModel = function(model) {
    this._unbindBacklinks(model);
    return delete model._orm;
  };

  Many.prototype.set = function(model, key, value, options) {
    var collection, item, model_ids, models, previous_models, related_model, _i, _len;
    if (!((key === this.key) || (key === this.virtual_id_accessor) || (key === this.foreign_key))) {
      throw new Error("Many.set: Unexpected key " + key + ". Expecting: " + this.key + " or " + this.virtual_id_accessor + " or " + this.foreign_key);
    }
    collection = this._bindBacklinks(model);
    if (Utils.isCollection(value)) {
      value = value.models;
    }
    if (_.isUndefined(value)) {
      value = [];
    }
    if (!_.isArray(value)) {
      throw new Error("HasMany.set: Unexpected type to set " + key + ". Expecting array: " + (util.inspect(value)));
    }
    Utils.orSet(model, 'rel_dirty', {})[this.key] = true;
    model.setLoaded(this.key, true);
    models = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = value.length; _i < _len; _i++) {
        item = value[_i];
        _results.push((related_model = collection.get(Utils.dataId(item))) ? Utils.updateModel(related_model, item) : Utils.updateOrNew(item, this.reverse_model_type));
      }
      return _results;
    }).call(this);
    previous_models = _.clone(collection.models);
    collection.reset(models);
    if (this.reverse_relation.type === 'belongsTo') {
      model_ids = _.pluck(models, 'id');
      for (_i = 0, _len = previous_models.length; _i < _len; _i++) {
        related_model = previous_models[_i];
        if (!_.contains(model_ids, related_model.id)) {
          related_model.set(this.foreign_key, null);
        }
      }
    }
    return this;
  };

  Many.prototype.get = function(model, key, callback) {
    var collection, is_loaded, result, returnValue,
      _this = this;
    if (!((key === this.key) || (key === this.virtual_id_accessor) || (key === this.foreign_key))) {
      throw new Error("Many.get: Unexpected key " + key + ". Expecting: " + this.key + " or " + this.virtual_id_accessor + " or " + this.foreign_key);
    }
    collection = this._ensureCollection(model);
    returnValue = function() {
      var related_model, _i, _len, _ref, _results;
      if (key === _this.virtual_id_accessor) {
        _ref = collection.models;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          related_model = _ref[_i];
          _results.push(related_model.id);
        }
        return _results;
      } else {
        return collection;
      }
    };
    if (callback && !this.isVirtual() && !this.manual_fetch && !(is_loaded = model.isLoaded(this.key))) {
      this.cursor(model, this.key).toJSON(function(err, json) {
        var cache, model_json, related_model, result, _i, _j, _len, _len1, _ref;
        if (err) {
          return callback(err);
        }
        model.setLoaded(_this.key, true);
        for (_i = 0, _len = json.length; _i < _len; _i++) {
          model_json = json[_i];
          if (related_model = collection.get(model_json.id)) {
            related_model.set(model_json);
          } else {
            collection.add(related_model = Utils.updateOrNew(model_json, _this.reverse_model_type));
          }
        }
        if (cache = _this.reverse_model_type.cache) {
          _ref = collection.models;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            related_model = _ref[_j];
            cache.set(model.id, related_model);
          }
        }
        result = returnValue();
        return callback(null, result.models ? result.models : result);
      });
    }
    result = returnValue();
    if (callback && (is_loaded || this.manual_fetch)) {
      callback(null, result.models ? result.models : result);
    }
    return result;
  };

  Many.prototype.save = function(model, callback) {
    var collection;
    if (!this._hasChanged(model)) {
      return callback();
    }
    delete Utils.orSet(model, 'rel_dirty', {})[this.key];
    collection = this._ensureCollection(model);
    return this._saveRelated(model, _.clone(collection.models), callback);
  };

  Many.prototype.appendJSON = function(json, model) {
    var collection, json_key;
    if (this.isVirtual()) {
      return;
    }
    collection = this._ensureCollection(model);
    json_key = this.embed ? this.key : this.virtual_id_accessor;
    if (this.embed) {
      return json[json_key] = collection.toJSON();
    }
  };

  Many.prototype.add = function(model, related_model) {
    var collection, current_related_model;
    collection = this._ensureCollection(model);
    current_related_model = collection.get(related_model.id);
    if (current_related_model === related_model) {
      return;
    }
    if (current_related_model) {
      collection.remove(current_related_model);
    }
    if (this.reverse_model_type.cache && related_model.id) {
      this.reverse_model_type.cache.set(related_model.id, related_model);
    }
    return collection.add(related_model);
  };

  Many.prototype.remove = function(model, related_model) {
    var collection, current_related_model;
    collection = this._ensureCollection(model);
    if (!(current_related_model = collection.get(related_model.id))) {
      return;
    }
    return collection.remove(current_related_model);
  };

  Many.prototype.patchAdd = function(model, relateds, callback) {
    var collection, item, query, queue, related, related_id, related_ids, related_model, _fn, _i, _j, _len, _len1,
      _this = this;
    if (!model.id) {
      return callback(new Error("Many.patchAdd: model has null id for: " + this.key));
    }
    if (!relateds) {
      return callback(new Error("Many.patchAdd: missing model for: " + this.key));
    }
    if (!_.isArray(relateds)) {
      relateds = [relateds];
    }
    collection = this._ensureCollection(model);
    relateds = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = relateds.length; _i < _len; _i++) {
        item = relateds[_i];
        _results.push((related_model = collection.get(Utils.dataId(item))) ? Utils.updateModel(related_model, item) : Utils.updateOrNew(item, this.reverse_model_type));
      }
      return _results;
    }).call(this);
    related_ids = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = relateds.length; _i < _len; _i++) {
        related = relateds[_i];
        _results.push(Utils.dataId(related));
      }
      return _results;
    })();
    collection.add(relateds);
    if (model.isLoaded(this.key)) {
      for (_i = 0, _len = relateds.length; _i < _len; _i++) {
        related = relateds[_i];
        if (!related.isLoaded()) {
          model.setLoaded(this.key, false);
          break;
        }
      }
    }
    if (this.join_table) {
      queue = new Queue(1);
      _fn = function(related_id) {
        return queue.defer(function(callback) {
          var add, query;
          if (!related_id) {
            return callback(new Error("Many.patchAdd: cannot add an new model. Please save first."));
          }
          add = function(callback) {
            var attributes, join;
            attributes = {};
            attributes[_this.foreign_key] = model.id;
            attributes[_this.reverse_relation.foreign_key] = related_id;
            join = new _this.join_table(attributes);
            return join.save(callback);
          };
          if (_this.reverse_relation.type === 'hasMany') {
            return add(callback);
          }
          (query = {})[_this.reverse_relation.foreign_key] = related_id;
          return _this.join_table.find(query, function(err, join_table_json) {
            if (err) {
              return callback(err);
            }
            if (!join_table_json) {
              return add(callback);
            }
            if (join_table_json[_this.foreign_key] === model.id) {
              return callback();
            }
            join_table_json[_this.foreign_key] = model.id;
            return Utils.modelJSONSave(join_table_json, _this.join_table, callback);
          });
        });
      };
      for (_j = 0, _len1 = related_ids.length; _j < _len1; _j++) {
        related_id = related_ids[_j];
        _fn(related_id);
      }
      return queue.await(callback);
    } else {
      query = {
        id: {
          $in: related_ids
        }
      };
      return this.reverse_model_type.cursor(query).toJSON(function(err, related_jsons) {
        var related_json, _fn1, _k, _len2;
        queue = new Queue(1);
        _fn1 = function(related_json) {
          return queue.defer(function(callback) {
            related_json[_this.reverse_relation.foreign_key] = model.id;
            return Utils.modelJSONSave(related_json, _this.reverse_model_type, callback);
          });
        };
        for (_k = 0, _len2 = related_jsons.length; _k < _len2; _k++) {
          related_json = related_jsons[_k];
          _fn1(related_json);
        }
        return queue.await(callback);
      });
    }
  };

  Many.prototype.patchRemove = function(model, relateds, callback) {
    var cache, collection, current_related_model, json, query, related, related_ids, related_model, related_models, _i, _j, _k, _len, _len1, _len2, _ref,
      _this = this;
    if (!model.id) {
      return callback(new Error("Many.patchRemove: model has null id for: " + this.key));
    }
    if (arguments.length === 2) {
      callback = relateds;
      if (!this.reverse_relation) {
        return callback();
      }
      if (Utils.isModel(model)) {
        delete Utils.orSet(model, 'rel_dirty', {})[this.key];
        collection = this._ensureCollection(model);
        related_models = _.clone(collection.models);
      } else {
        related_models = (function() {
          var _i, _len, _ref, _results;
          _ref = model[this.key] || [];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            json = _ref[_i];
            _results.push(new this.reverse_model_type(json));
          }
          return _results;
        }).call(this);
      }
      for (_i = 0, _len = related_models.length; _i < _len; _i++) {
        related_model = related_models[_i];
        related_model.set(this.foreign_key, null);
        if (cache = related_model.cache()) {
          cache.set(related_model.id, related_model);
        }
      }
      if (this.join_table) {
        (query = {})[this.join_key] = model.id;
        return this.join_table.destroy(query, callback);
      } else {
        (query = {})[this.reverse_relation.foreign_key] = model.id;
        this.reverse_model_type.cursor(query).toJSON(function(err, json) {
          var queue, related_json, _fn, _j, _len1;
          if (err) {
            return callback(err);
          }
          queue = new Queue(1);
          _fn = function(related_json) {
            return queue.defer(function(callback) {
              related_json[_this.reverse_relation.foreign_key] = null;
              return Utils.modelJSONSave(related_json, _this.reverse_model_type, callback);
            });
          };
          for (_j = 0, _len1 = json.length; _j < _len1; _j++) {
            related_json = json[_j];
            _fn(related_json);
          }
          return queue.await(callback);
        });
      }
      return;
    }
    if (this.isEmbedded()) {
      return callback(new Error('Many.patchRemove: embedded relationships are not supported'));
    }
    if (!relateds) {
      return callback(new Error('One.patchRemove: missing model for remove'));
    }
    if (!_.isArray(relateds)) {
      relateds = [relateds];
    }
    collection = this._ensureCollection(model);
    for (_j = 0, _len1 = relateds.length; _j < _len1; _j++) {
      related = relateds[_j];
      _ref = collection.models;
      for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
        current_related_model = _ref[_k];
        if (Utils.dataIsSameModel(current_related_model, related)) {
          collection.remove(current_related_model);
          break;
        }
      }
    }
    related_ids = (function() {
      var _l, _len3, _results;
      _results = [];
      for (_l = 0, _len3 = relateds.length; _l < _len3; _l++) {
        related = relateds[_l];
        _results.push(Utils.dataId(related));
      }
      return _results;
    })();
    if (this.join_table) {
      query = {};
      query[this.join_key] = model.id;
      query[this.reverse_relation.join_key] = {
        $in: related_ids
      };
      return this.join_table.destroy(query, callback);
    } else {
      query = {};
      query[this.reverse_relation.foreign_key] = model.id;
      query.id = {
        $in: related_ids
      };
      return this.reverse_model_type.cursor(query).toJSON(function(err, json) {
        var queue, related_json, _fn, _l, _len3;
        if (err) {
          return callback(err);
        }
        queue = new Queue(1);
        _fn = function(related_json) {
          return queue.defer(function(callback) {
            related_json[_this.reverse_relation.foreign_key] = null;
            return Utils.modelJSONSave(related_json, _this.reverse_model_type, callback);
          });
        };
        for (_l = 0, _len3 = json.length; _l < _len3; _l++) {
          related_json = json[_l];
          _fn(related_json);
        }
        return queue.await(callback);
      });
    }
  };

  Many.prototype.cursor = function(model, key, query) {
    var json;
    json = Utils.isModel(model) ? model.attributes : model;
    (query = _.clone(query || {}))[this.join_table ? this.join_key : this.reverse_relation.foreign_key] = json.id;
    if (key === this.virtual_id_accessor) {
      (query.$values || (query.$values = [])).push('id');
    }
    return this.reverse_model_type.cursor(query);
  };

  Many.prototype._bindBacklinks = function(model) {
    var collection, events, method, _i, _len, _ref,
      _this = this;
    if ((collection = model.attributes[this.key]) instanceof this.collection_type) {
      return collection;
    }
    collection = model.attributes[this.key] = new this.collection_type();
    if (!this.reverse_relation) {
      return collection;
    }
    events = Utils.set(collection, 'events', {});
    events.add = function(related_model) {
      var current_model, is_current;
      if (_this.reverse_relation.add) {
        return _this.reverse_relation.add(related_model, model);
      } else {
        current_model = related_model.get(_this.reverse_relation.key);
        is_current = model.id && (Utils.dataId(current_model) === model.id);
        if (!is_current || (is_current && !current_model.isLoaded())) {
          return related_model.set(_this.reverse_relation.key, model);
        }
      }
    };
    events.remove = function(related_model) {
      var current_model;
      if (_this.reverse_relation.remove) {
        return _this.reverse_relation.remove(related_model, model);
      } else {
        current_model = related_model.get(_this.reverse_relation.key);
        if (Utils.dataId(current_model) === model.id) {
          return related_model.set(_this.reverse_relation.key, null);
        }
      }
    };
    events.reset = function(collection, options) {
      var added, changes, current_models, previous_models, related_model, _i, _j, _len, _len1, _ref, _results;
      current_models = collection.models;
      previous_models = options.previousModels || [];
      changes = _.groupBy(previous_models, function(test) {
        if (!!_.find(current_models, function(current_model) {
          return current_model.id === test.id;
        })) {
          return 'kept';
        } else {
          return 'removed';
        }
      });
      added = changes.kept ? _.select(current_models, function(test) {
        return !_.find(changes.kept, function(keep_model) {
          return keep_model.id === test.id;
        });
      }) : current_models;
      if (changes.removed) {
        _ref = changes.removed;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          related_model = _ref[_i];
          events.remove(related_model);
        }
      }
      _results = [];
      for (_j = 0, _len1 = added.length; _j < _len1; _j++) {
        related_model = added[_j];
        _results.push(events.add(related_model));
      }
      return _results;
    };
    _ref = ['add', 'remove', 'reset'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      method = _ref[_i];
      collection.on(method, events[method]);
    }
    return collection;
  };

  Many.prototype._unbindBacklinks = function(model) {
    var collection, events, method, _i, _len, _ref;
    if (!(events = Utils.get(model, 'events'))) {
      return;
    }
    Utils.unset(model, 'events');
    collection = model.attributes[this.key];
    collection.models.splice();
    events = _.clone();
    _ref = ['add', 'remove', 'reset'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      method = _ref[_i];
      collection.off(method, events[method]);
      events[method] = null;
    }
  };

  Many.prototype._ensureCollection = function(model) {
    return this._bindBacklinks(model);
  };

  Many.prototype._hasChanged = function(model) {
    var collection, _i, _len, _ref;
    return !!Utils.orSet(model, 'rel_dirty', {})[this.key] || model.hasChanged(this.key);
    if (!this.reverse_relation) {
      return false;
    }
    collection = this._ensureCollection(model);
    _ref = model.models;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      model = _ref[_i];
      if (model.hasChanged(this.reverse_relation.foreign_key)) {
        return true;
      }
    }
    return false;
  };

  return Many;

})(require('./relation'));

});

;require.register("backbone-orm/lib/relations/one", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var Backbone, One, Queue, Utils, inflection, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('underscore');

Backbone = require('backbone');

inflection = require('inflection');

Queue = require('../queue');

Utils = require('../utils');

module.exports = One = (function(_super) {
  __extends(One, _super);

  function One(model_type, key, options) {
    var value;
    this.model_type = model_type;
    this.key = key;
    for (key in options) {
      value = options[key];
      this[key] = value;
    }
    this.virtual_id_accessor || (this.virtual_id_accessor = "" + this.key + "_id");
    if (!this.join_key) {
      this.join_key = inflection.foreign_key(this.model_type.model_name);
    }
    if (!this.foreign_key) {
      this.foreign_key = inflection.foreign_key(this.type === 'belongsTo' ? this.key : this.as || this.model_type.model_name);
    }
  }

  One.prototype.initialize = function() {
    this.reverse_relation = this._findOrGenerateReverseRelation(this);
    if (this.embed && this.reverse_relation && this.reverse_relation.embed) {
      throw new Error("Both relationship directions cannot embed (" + this.model_type.model_name + " and " + this.reverse_model_type.model_name + "). Choose one or the other.");
    }
  };

  One.prototype.initializeModel = function(model) {
    if (!model.isLoadedExists(this.key)) {
      model.setLoaded(this.key, this.isEmbedded());
    }
    return this._bindBacklinks(model);
  };

  One.prototype.releaseModel = function(model) {
    this._unbindBacklinks(model);
    return delete model._orm;
  };

  One.prototype.set = function(model, key, value, options) {
    var is_model, merge_into_existing, new_related_id, previous_related_id, previous_related_model;
    if (!((key === this.key) || (key === this.virtual_id_accessor) || (key === this.foreign_key))) {
      throw new Error("One.set: Unexpected key " + key + ". Expecting: " + this.key + " or " + this.virtual_id_accessor + " or " + this.foreign_key);
    }
    if (_.isArray(value)) {
      throw new Error("One.set: cannot set an array for attribute " + this.key + " on " + this.model_type.model_name);
    }
    if (_.isUndefined(value)) {
      value = null;
    }
    if (value === (previous_related_model = model.get(this.key))) {
      return this;
    }
    is_model = Utils.isModel(value);
    new_related_id = Utils.dataId(value);
    previous_related_id = Utils.dataId(previous_related_model);
    Utils.orSet(model, 'rel_dirty', {})[this.key] = true;
    if ((previous_related_id !== new_related_id) || !model.isLoaded(this.key)) {
      if ((is_model && (value.isLoaded())) && (new_related_id !== value)) {
        model.setLoaded(this.key, true);
      } else {
        model.setLoaded(this.key, _.isNull(value));
      }
    }
    if (value && !is_model) {
      if (!(merge_into_existing = previous_related_id === new_related_id)) {
        value = Utils.updateOrNew(value, this.reverse_model_type);
      }
    }
    if (!merge_into_existing) {
      Backbone.Model.prototype.set.call(model, this.key, value, options);
    }
    if (merge_into_existing) {
      Utils.updateModel(previous_related_model, value);
    } else if ((value === null) && this.reverse_relation && (this.reverse_relation.type === 'hasOne' || this.reverse_relation.type === 'belongsTo')) {
      if (!(this.embed || this.reverse_relation.embed)) {
        if (model.isLoaded(this.key) && previous_related_model && (previous_related_model.get(this.reverse_relation.key) === model)) {
          previous_related_model.set(this.reverse_relation.key, null);
        }
      }
    }
    return this;
  };

  One.prototype.get = function(model, key, callback) {
    var is_loaded, result, returnValue,
      _this = this;
    if (!((key === this.key) || (key === this.virtual_id_accessor) || (key === this.foreign_key))) {
      throw new Error("One.get: Unexpected key " + key + ". Expecting: " + this.key + " or " + this.virtual_id_accessor + " or " + this.foreign_key);
    }
    returnValue = function() {
      var related_model;
      if (!(related_model = model.attributes[_this.key])) {
        return null;
      }
      if (key === _this.virtual_id_accessor) {
        return related_model.id;
      } else {
        return related_model;
      }
    };
    if (callback && !this.isVirtual() && !this.manual_fetch && !(is_loaded = model.isLoaded(this.key))) {
      this.cursor(model, key).toJSON(function(err, json) {
        var previous_related_model, related_model;
        if (err) {
          return callback(err);
        }
        if (key !== _this.virtual_id_accessor) {
          model.setLoaded(_this.key, true);
        }
        previous_related_model = model.get(_this.key);
        if (previous_related_model && (previous_related_model.id === (json != null ? json.id : void 0))) {
          Utils.updateModel(previous_related_model, json);
        } else {
          related_model = json ? Utils.updateOrNew(json, _this.reverse_model_type) : null;
          model.set(_this.key, related_model);
        }
        return callback(null, returnValue());
      });
    }
    result = returnValue();
    if (callback && (is_loaded || this.manual_fetch)) {
      callback(null, result);
    }
    return result;
  };

  One.prototype.save = function(model, callback) {
    var related_model;
    if (!this._hasChanged(model)) {
      return callback();
    }
    delete Utils.orSet(model, 'rel_dirty', {})[this.key];
    if (!(related_model = model.attributes[this.key])) {
      return callback();
    }
    return this._saveRelated(model, [related_model], callback);
  };

  One.prototype.patchAdd = function(model, related, callback) {
    var found_related, related_id,
      _this = this;
    if (!model.id) {
      return callback(new Error("One.patchAdd: model has null id for: " + this.key));
    }
    if (!related) {
      return callback(new Error("One.patchAdd: missing model for: " + this.key));
    }
    if (_.isArray(related)) {
      return callback(new Error("One.patchAdd: should be provided with one model only for key: " + this.key));
    }
    if (!(related_id = Utils.dataId(related))) {
      return callback(new Error("One.patchAdd: cannot add a new model. Please save first."));
    }
    if (this.reverse_model_type.cache && !Utils.isModel(related)) {
      if (found_related = this.reverse_model_type.cache.get(related_id)) {
        Utils.updateModel(found_related, related);
        related = found_related;
      }
    }
    model.set(this.key, related);
    if (this.type === 'belongsTo') {
      return this.model_type.cursor({
        id: model.id,
        $one: true
      }).toJSON(function(err, model_json) {
        if (err) {
          return callback(err);
        }
        if (!model_json) {
          return callback(new Error("Failed to fetch model with id: " + model.id));
        }
        model_json[_this.foreign_key] = related_id;
        return model.save(model_json, callback);
      });
    } else {
      return this.cursor(model, this.key).toJSON(function(err, current_related_json) {
        var queue;
        if (err) {
          return callback(err);
        }
        if (current_related_json && (related_id === current_related_json.id)) {
          return callback();
        }
        queue = new Queue(1);
        if (current_related_json) {
          queue.defer(function(callback) {
            return _this.patchRemove(model, current_related_json, callback);
          });
        }
        queue.defer(function(callback) {
          var query, related_json;
          if (Utils.isModel(related)) {
            if (related.isLoaded()) {
              related_json = related.toJSON();
            }
          } else if (related_id !== related) {
            related_json = related;
          }
          if (related_json) {
            related_json[_this.reverse_relation.foreign_key] = model.id;
            return Utils.modelJSONSave(related_json, _this.reverse_model_type, callback);
          } else {
            query = {
              $one: true
            };
            query.id = related_id;
            return _this.reverse_model_type.cursor(query).toJSON(function(err, related_json) {
              if (err) {
                return callback(err);
              }
              if (!related_json) {
                return callback();
              }
              related_json[_this.reverse_relation.foreign_key] = model.id;
              return Utils.modelJSONSave(related_json, _this.reverse_model_type, callback);
            });
          }
        });
        return queue.await(callback);
      });
    }
  };

  One.prototype.patchRemove = function(model, relateds, callback) {
    var current_related_model, related, related_ids, _i, _len,
      _this = this;
    if (arguments.length === 2) {
      callback = relateds;
      relateds = void 0;
    }
    if (!model.id) {
      return callback(new Error("One.patchRemove: model has null id for: " + this.key));
    }
    if (arguments.length === 2) {
      if (!this.reverse_relation) {
        return callback();
      }
      if (Utils.isModel(model)) {
        delete Utils.orSet(model, 'rel_dirty', {})[this.key];
      }
      this.cursor(model, this.key).toJSON(function(err, related_json) {
        if (err) {
          return callback(err);
        }
        if (!related_json) {
          return callback();
        }
        related_json[_this.reverse_relation.foreign_key] = null;
        return Utils.modelJSONSave(related_json, _this.reverse_model_type, callback);
      });
      return;
    }
    if (this.isEmbedded()) {
      return callback(new Error('One.patchRemove: embedded relationships are not supported'));
    }
    if (!relateds) {
      return callback(new Error('One.patchRemove: missing model for remove'));
    }
    if (!_.isArray(relateds)) {
      relateds = [relateds];
    }
    if (current_related_model = model.get(this.key)) {
      for (_i = 0, _len = relateds.length; _i < _len; _i++) {
        related = relateds[_i];
        if (Utils.dataIsSameModel(current_related_model, related)) {
          model.set(this.key, null);
          break;
        }
      }
    }
    related_ids = (function() {
      var _j, _len1, _results;
      _results = [];
      for (_j = 0, _len1 = relateds.length; _j < _len1; _j++) {
        related = relateds[_j];
        _results.push(Utils.dataId(related));
      }
      return _results;
    })();
    if (this.type === 'belongsTo') {
      return this.model_type.cursor({
        id: model.id,
        $one: true
      }).toJSON(function(err, model_json) {
        if (err) {
          return callback(err);
        }
        if (!model_json) {
          return callback();
        }
        if (!_.contains(related_ids, model_json[_this.foreign_key])) {
          return callback();
        }
        model_json[_this.foreign_key] = null;
        return Utils.modelJSONSave(model_json, _this.model_type, callback);
      });
    } else {
      return this.cursor(model, this.key).toJSON(function(err, related_json) {
        if (err) {
          return callback(err);
        }
        if (!related_json) {
          return callback();
        }
        if (!_.contains(related_ids, related_json.id)) {
          return callback();
        }
        related_json[_this.reverse_relation.foreign_key] = null;
        return Utils.modelJSONSave(related_json, _this.reverse_model_type, callback);
      });
    }
  };

  One.prototype.appendJSON = function(json, model) {
    var json_key, related_model;
    if (this.isVirtual()) {
      return;
    }
    json_key = this.embed ? this.key : this.foreign_key;
    if (!(related_model = model.attributes[this.key])) {
      if (this.embed || this.type === 'belongsTo') {
        json[json_key] = null;
      }
      return;
    }
    if (this.embed) {
      return json[json_key] = related_model.toJSON();
    }
    if (this.type === 'belongsTo') {
      return json[json_key] = related_model.id;
    }
  };

  One.prototype.cursor = function(model, key, query) {
    var _ref;
    query = _.extend({
      $one: true
    }, query || {});
    if (Utils.isModel(model)) {
      if (this.type === 'belongsTo') {
        if (!(query.id = (_ref = model.attributes[this.key]) != null ? _ref.id : void 0)) {
          query.$zero = true;
          delete query.id;
        }
      } else {
        if (!model.id) {
          throw new Error('Cannot create cursor for non-loaded model');
        }
        query[this.reverse_relation.foreign_key] = model.id;
      }
    } else {
      if (this.type === 'belongsTo') {
        if (!(query.id = model[this.foreign_key])) {
          query.$zero = true;
          delete query.id;
        }
      } else {
        if (!model.id) {
          throw new Error('Cannot create cursor for non-loaded model');
        }
        query[this.reverse_relation.foreign_key] = model.id;
      }
    }
    if (key === this.virtual_id_accessor) {
      query.$values = ['id'];
    }
    return this.reverse_model_type.cursor(query);
  };

  One.prototype._bindBacklinks = function(model) {
    var events, related_model, setBacklink,
      _this = this;
    if (!this.reverse_relation) {
      return;
    }
    events = Utils.set(model, 'events', {});
    setBacklink = function(related_model) {
      if (_this.reverse_relation.add) {
        return _this.reverse_relation.add(related_model, model);
      } else {
        return related_model.set(_this.reverse_relation.key, model);
      }
    };
    events.change = function(model) {
      var current_model, previous_related_model, related_model;
      related_model = model.get(_this.key);
      previous_related_model = model.previous(_this.key);
      if (Utils.dataId(related_model) === Utils.dataId(previous_related_model)) {
        return;
      }
      if (previous_related_model && (_this.reverse_relation && _this.reverse_relation.type !== 'belongsTo')) {
        if (_this.reverse_relation.remove) {
          if (!_this.isVirtual() || !related_model) {
            _this.reverse_relation.remove(previous_related_model, model);
          }
        } else {
          current_model = previous_related_model.get(_this.reverse_relation.key);
          if (Utils.dataId(current_model) === model.id) {
            previous_related_model.set(_this.reverse_relation.key, null);
          }
        }
      }
      if (related_model) {
        return setBacklink(related_model);
      }
    };
    model.on("change:" + this.key, events.change);
    if (related_model = model.get(this.key)) {
      setBacklink(related_model);
    }
    return model;
  };

  One.prototype._unbindBacklinks = function(model) {
    var events;
    if (!(events = Utils.get(model, 'events'))) {
      return;
    }
    Utils.unset(model, 'events');
    model.attributes[this.key] = null;
    model.off("change:" + this.key, events.change);
    events.change = null;
  };

  One.prototype._hasChanged = function(model) {
    var related_model;
    return !!Utils.orSet(model, 'rel_dirty', {})[this.key] || model.hasChanged(this.key);
    if (!this.reverse_relation) {
      return false;
    }
    if (!(related_model = model.attributes[this.key])) {
      return false;
    }
    return related_model.hasChanged(this.reverse_relation.foreign_key);
  };

  return One;

})(require('./relation'));

});

;require.register("backbone-orm/lib/relations/relation", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var Backbone, Queue, Relation, Utils, inflection, _;

_ = require('underscore');

Backbone = require('backbone');

Queue = require('../queue');

inflection = require('inflection');

Utils = require('../utils');

module.exports = Relation = (function() {
  function Relation() {}

  Relation.prototype.isEmbedded = function() {
    return !!(this.embed || (this.reverse_relation && this.reverse_relation.embed));
  };

  Relation.prototype.isVirtual = function() {
    return !!(this.virtual || (this.reverse_relation && this.reverse_relation.virtual));
  };

  Relation.prototype.findOrGenerateJoinTable = function() {
    var join_table;
    if (join_table = this.join_table || this.reverse_relation.join_table) {
      return join_table;
    }
    return this.model_type.schema().generateJoinTable(this);
  };

  Relation.prototype._findOrGenerateReverseRelation = function() {
    var key_root, model_type, reverse_model_type, reverse_relation;
    model_type = this.model_type;
    reverse_model_type = this.reverse_model_type;
    if (!_.isFunction(reverse_model_type.schema)) {
      reverse_model_type.sync = model_type.createSync(reverse_model_type);
    }
    key_root = this.as || inflection.underscore(model_type.model_name);
    reverse_relation = reverse_model_type.relation(key_root);
    if (!reverse_relation) {
      reverse_relation = reverse_model_type.relation(inflection.singularize(key_root));
    }
    if (!reverse_relation) {
      reverse_relation = reverse_model_type.relation(inflection.pluralize(key_root));
    }
    if (!reverse_relation && (this.type !== 'belongsTo')) {
      reverse_relation = reverse_model_type.schema().generateBelongsTo(model_type);
    }
    if (reverse_relation && !reverse_relation.reverse_relation) {
      reverse_relation.reverse_relation = this;
    }
    return reverse_relation;
  };

  Relation.prototype._saveRelated = function(model, related_models, callback) {
    var _this = this;
    if (this.embed || !this.reverse_relation || (this.type === 'belongsTo')) {
      return callback();
    }
    if (this.isVirtual()) {
      return callback();
    }
    return this.cursor(model, this.key).toJSON(function(err, json) {
      var added_id, added_ids, changes, queue, related_id, related_ids, related_json, related_model, test, _fn, _fn1, _fn2, _i, _j, _k, _len, _len1, _len2, _ref;
      if (err) {
        return callback(err);
      }
      if (!_.isArray(json)) {
        json = (json ? [json] : []);
      }
      queue = new Queue(1);
      related_ids = _.pluck(related_models, 'id');
      changes = _.groupBy(json, function(test) {
        if (_.contains(related_ids, test.id)) {
          return 'kept';
        } else {
          return 'removed';
        }
      });
      added_ids = changes.kept ? _.difference(related_ids, (function() {
        var _i, _len, _ref, _results;
        _ref = changes.kept;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          test = _ref[_i];
          _results.push(test.id);
        }
        return _results;
      })()) : related_ids;
      if (changes.removed) {
        if (_this.join_table) {
          queue.defer(function(callback) {
            var query, related_json;
            query = {};
            query[_this.reverse_relation.join_key] = {
              $in: (function() {
                var _i, _len, _ref, _results;
                _ref = changes.removed;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  related_json = _ref[_i];
                  _results.push(related_json.id);
                }
                return _results;
              })()
            };
            return _this.join_table.destroy(query, callback);
          });
        } else {
          _ref = changes.removed;
          _fn = function(related_json) {
            return queue.defer(function(callback) {
              related_json[_this.reverse_relation.foreign_key] = null;
              return Utils.modelJSONSave(related_json, _this.reverse_model_type, callback);
            });
          };
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            related_json = _ref[_i];
            _fn(related_json);
          }
        }
      }
      if (added_ids.length) {
        if (_this.join_table) {
          _fn1 = function(related_id) {
            return queue.defer(function(callback) {
              var attributes, join;
              attributes = {};
              attributes[_this.foreign_key] = model.id;
              attributes[_this.reverse_relation.foreign_key] = related_id;
              join = new _this.join_table(attributes);
              return join.save(callback);
            });
          };
          for (_j = 0, _len1 = added_ids.length; _j < _len1; _j++) {
            related_id = added_ids[_j];
            _fn1(related_id);
          }
        } else {
          _fn2 = function(related_model) {
            return queue.defer(function(callback) {
              return related_model.save(function(err, saved_model) {
                var cache;
                if (!err && (cache = _this.reverse_model_type.cache)) {
                  cache.set(saved_model.id, saved_model);
                }
                return callback(err);
              });
            });
          };
          for (_k = 0, _len2 = added_ids.length; _k < _len2; _k++) {
            added_id = added_ids[_k];
            related_model = _.find(related_models, function(test) {
              return test.id === added_id;
            });
            if (!_this.reverse_relation._hasChanged(related_model)) {
              continue;
            }
            _fn2(related_model);
          }
        }
      }
      return queue.await(callback);
    });
  };

  return Relation;

})();

});

;require.register("backbone-orm/lib/schema", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var Backbone, DatabaseURL, Many, One, RELATION_VARIANTS, Schema, inflection, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('underscore');

Backbone = require('backbone');

inflection = require('inflection');

One = require('./relations/one');

Many = require('./relations/many');

DatabaseURL = require('./database_url');

RELATION_VARIANTS = {
  'hasOne': 'hasOne',
  'has_one': 'hasOne',
  'HasOne': 'hasOne',
  'belongsTo': 'belongsTo',
  'belongs_to': 'belongsTo',
  'BelongsTo': 'belongsTo',
  'hasMany': 'hasMany',
  'has_many': 'hasMany',
  'HasMany': 'hasMany'
};

module.exports = Schema = (function() {
  function Schema(model_type) {
    this.model_type = model_type;
    this.raw = _.clone(_.result(new this.model_type(), 'schema') || {});
    this.fields = {};
    this.relations = {};
    this.virtual_accessors = {};
  }

  Schema.prototype.initialize = function() {
    var info, key, relation, _ref, _ref1;
    if (this.is_initialized) {
      return;
    }
    this.is_initialized = true;
    _ref = this.raw;
    for (key in _ref) {
      info = _ref[key];
      this._parseField(key, info);
    }
    _ref1 = this.relations;
    for (key in _ref1) {
      relation = _ref1[key];
      relation.initialize();
    }
  };

  Schema.prototype.relation = function(key) {
    return this.relations[key] || this.virtual_accessors[key];
  };

  Schema.prototype.reverseRelation = function(reverse_key) {
    var key, relation, _ref;
    _ref = this.relations;
    for (key in _ref) {
      relation = _ref[key];
      if (relation.reverse_relation && (relation.reverse_relation.join_key === reverse_key)) {
        return relation.reverse_relation;
      }
    }
    return null;
  };

  Schema.prototype.allRelations = function() {
    var key, related_model_types, relation, _ref;
    related_model_types = [];
    _ref = this.relations;
    for (key in _ref) {
      relation = _ref[key];
      related_model_types.push(relation.reverse_model_type);
      if (relation.join_table) {
        related_model_types.push(relation.join_table);
      }
    }
    return related_model_types;
  };

  Schema.prototype.generateBelongsTo = function(reverse_model_type) {
    var key, relation;
    key = inflection.underscore(reverse_model_type.model_name);
    if (relation = this.relations[key]) {
      return relation;
    }
    if (this.raw[key]) {
      relation = this._parseField(key, this.raw[key]);
      relation.initialize();
      return relation;
    }
    relation = this._parseField(key, this.raw[key] = [
      'belongsTo', reverse_model_type, {
        manual_fetch: true
      }
    ]);
    relation.initialize();
    return relation;
  };

  Schema.joinTableURL = function(relation) {
    var model_name1, model_name2;
    model_name1 = inflection.pluralize(inflection.underscore(relation.model_type.model_name));
    model_name2 = inflection.pluralize(inflection.underscore(relation.reverse_relation.model_type.model_name));
    if (model_name1.localeCompare(model_name2) < 0) {
      return "" + model_name1 + "_" + model_name2;
    } else {
      return "" + model_name2 + "_" + model_name1;
    }
  };

  Schema.prototype.generateJoinTable = function(relation) {
    var JoinTable, name, schema, url, _ref, _ref1;
    schema = {};
    schema[relation.join_key] = [
      'Integer', {
        indexed: true
      }
    ];
    schema[relation.reverse_relation.join_key] = [
      'Integer', {
        indexed: true
      }
    ];
    url = Schema.joinTableURL(relation);
    name = inflection.pluralize(inflection.classify(url));
    try {
      JoinTable = (function(_super) {
        __extends(JoinTable, _super);

        function JoinTable() {
          _ref = JoinTable.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        JoinTable.prototype.model_name = name;

        JoinTable.prototype.urlRoot = "" + ((new DatabaseURL(_.result(relation.model_type.prototype, 'url'))).format({
          exclude_table: true
        })) + "/" + url;

        JoinTable.prototype.schema = schema;

        JoinTable.prototype.sync = relation.model_type.createSync(JoinTable);

        return JoinTable;

      })(Backbone.Model);
    } catch (_error) {
      JoinTable = (function(_super) {
        __extends(JoinTable, _super);

        function JoinTable() {
          _ref1 = JoinTable.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        JoinTable.prototype.model_name = name;

        JoinTable.prototype.urlRoot = "/" + url;

        JoinTable.prototype.schema = schema;

        JoinTable.prototype.sync = relation.model_type.createSync(JoinTable);

        return JoinTable;

      })(Backbone.Model);
    }
    return JoinTable;
  };

  Schema.prototype.allColumns = function() {
    var columns, key, relation, _ref;
    columns = _.keys(this.fields);
    _ref = this.relations;
    for (key in _ref) {
      relation = _ref[key];
      if (relation.type === 'belongsTo') {
        columns.push(relation.foreign_key);
      }
    }
    return columns;
  };

  Schema.prototype._parseField = function(key, info) {
    var options, relation, type;
    options = this._fieldInfoToOptions(_.isFunction(info) ? info() : info);
    if (!options.type) {
      return this.fields[key] = options;
    }
    if (!(type = RELATION_VARIANTS[options.type])) {
      if (!_.isString(options.type)) {
        throw new Error("Unexpected type name is not a string: " + (util.inspect(options)));
      }
      return this.fields[key] = options;
    }
    options.type = type;
    relation = this.relations[key] = type === 'hasMany' ? new Many(this.model_type, key, options) : new One(this.model_type, key, options);
    if (relation.virtual_id_accessor) {
      this.virtual_accessors[relation.virtual_id_accessor] = relation;
    }
    if (type === 'belongsTo') {
      this.virtual_accessors[relation.foreign_key] = relation;
    }
    return relation;
  };

  Schema.prototype._fieldInfoToOptions = function(options) {
    var result;
    if (_.isString(options)) {
      return {
        type: options
      };
    }
    if (!_.isArray(options)) {
      return options;
    }
    result = {};
    if (_.isString(options[0])) {
      result.type = options[0];
      options = options.slice(1);
      if (options.length === 0) {
        return result;
      }
    }
    if (_.isFunction(options[0])) {
      result.reverse_model_type = options[0];
      options = options.slice(1);
    }
    if (options.length > 1) {
      throw new Error("Unexpected field options array: " + (util.inspect(options)));
    }
    if (options.length === 1) {
      _.extend(result, options[0]);
    }
    return result;
  };

  return Schema;

})();

});

;require.register("backbone-orm/lib/utils", function(exports, require, module) {
/*
  backbone-orm.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, and Inflection.js.
*/

var Backbone, DatabaseURL, JSONUtils, Queue, S4, URL, Utils, inflection, modelExtensions, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

URL = require('url');

DatabaseURL = require('./database_url');

Backbone = require('backbone');

_ = require('underscore');

inflection = require('inflection');

Queue = require('./queue');

JSONUtils = require('./json_utils');

modelExtensions = null;

S4 = function() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

module.exports = Utils = (function() {
  function Utils() {}

  Utils.resetSchemas = function(model_types, options, callback) {
    var failed_schemas, model_type, queue, _fn, _i, _j, _len, _len1, _ref;
    if (arguments.length === 2) {
      _ref = [{}, options], options = _ref[0], callback = _ref[1];
    }
    for (_i = 0, _len = model_types.length; _i < _len; _i++) {
      model_type = model_types[_i];
      model_type.schema();
    }
    failed_schemas = [];
    queue = new Queue(1);
    _fn = function(model_type) {
      return queue.defer(function(callback) {
        return model_type.resetSchema(options, function(err) {
          if (err) {
            failed_schemas.push(model_type.model_name);
            console.log("Error when dropping schema for " + model_type.model_name + ". " + err);
          }
          return callback();
        });
      });
    };
    for (_j = 0, _len1 = model_types.length; _j < _len1; _j++) {
      model_type = model_types[_j];
      _fn(model_type);
    }
    return queue.await(function(err) {
      if (options.verbose) {
        console.log("" + (model_types.length - failed_schemas.length) + " schemas dropped.");
      }
      if (failed_schemas.length) {
        return callback(new Error("Failed to migrate schemas: " + (failed_schemas.join(', '))));
      }
      return callback();
    });
  };

  Utils.guid = function() {
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
  };

  Utils.inspect = function(obj) {
    var err;
    try {
      return JSON.stringify(obj);
    } catch (_error) {
      err = _error;
      return "inspect: " + err;
    }
  };

  Utils.bbCallback = function(callback) {
    return {
      success: (function(model, resp, options) {
        return callback(null, model, resp, options);
      }),
      error: (function(model, resp, options) {
        return callback(resp || new Error('Backbone call failed'), model, resp, options);
      })
    };
  };

  Utils.wrapOptions = function(options, callback) {
    if (options == null) {
      options = {};
    }
    if (_.isFunction(options)) {
      options = Utils.bbCallback(options);
    }
    return _.defaults(Utils.bbCallback(function(err, model, resp, modified_options) {
      return callback(err, model, resp, options);
    }), options);
  };

  Utils.isModel = function(obj) {
    return obj && obj.attributes && ((obj instanceof Backbone.Model) || (obj.parse && obj.fetch));
  };

  Utils.isCollection = function(obj) {
    return obj && obj.models && ((obj instanceof Backbone.Collection) || (obj.reset && obj.fetch));
  };

  Utils.get = function(model, key, default_value) {
    model._orm || (model._orm = {});
    if (model._orm.hasOwnProperty(key)) {
      return model._orm[key];
    } else {
      return default_value;
    }
  };

  Utils.set = function(model, key, value) {
    model._orm || (model._orm = {});
    model._orm[key] = value;
    return model._orm[key];
  };

  Utils.orSet = function(model, key, value) {
    model._orm || (model._orm = {});
    if (!model._orm.hasOwnProperty(key)) {
      model._orm[key] = value;
    }
    return model._orm[key];
  };

  Utils.unset = function(model, key) {
    model._orm || (model._orm = {});
    return delete model._orm[key];
  };

  Utils.findOrGenerateModelName = function(model_type) {
    var model_name, url;
    if (model_type.prototype.model_name) {
      return model_type.prototype.model_name;
    }
    if (url = _.result(model_type.prototype, 'url')) {
      if (model_name = (new DatabaseURL(url)).modelName()) {
        return model_name;
      }
    }
    if (model_type.name) {
      return model_type.name;
    }
    throw "Could not find or generate model name for " + model_type;
  };

  Utils.configureCollectionModelType = function(type, sync) {
    var ORMModel, modelURL, model_type, _ref;
    modelURL = function() {
      var url, url_parts;
      url = _.result(this.collection || type.prototype, 'url');
      if (!this.isNew()) {
        url_parts = URL.parse(url);
        url_parts.pathname = "" + url_parts.pathname + "/encodeURIComponent(@id)";
        url = URL.format(url_parts);
      }
      return url;
    };
    model_type = type.prototype.model;
    if (!model_type || (model_type === Backbone.Model)) {
      ORMModel = (function(_super) {
        __extends(ORMModel, _super);

        function ORMModel() {
          _ref = ORMModel.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        ORMModel.prototype.url = modelURL;

        ORMModel.prototype.sync = sync(ORMModel);

        return ORMModel;

      })(Backbone.Model);
      return type.prototype.model = ORMModel;
    } else if (model_type.prototype.sync === Backbone.Model.prototype.sync) {
      model_type.prototype.url = modelURL;
      model_type.prototype.sync = sync(model_type);
    }
    return model_type;
  };

  Utils.configureModelType = function(type) {
    if (!modelExtensions) {
      modelExtensions = require('./extensions/model');
    }
    return modelExtensions(type);
  };

  Utils.patchRemoveByJSON = function(model_type, model_json, callback) {
    var key, queue, relation, schema, _fn, _i, _len;
    if (!(schema = model_type.schema())) {
      return callback();
    }
    queue = new Queue(1);
    _fn = function(relation) {
      return queue.defer(function(callback) {
        return relation.patchRemove(model_json, callback);
      });
    };
    for (relation = _i = 0, _len = schema.length; _i < _len; relation = ++_i) {
      key = schema[relation];
      _fn(relation);
    }
    return queue.await(callback);
  };

  Utils.presaveBelongsToRelationships = function(model, callback) {
    var key, queue, related_model, related_models, relation, schema, value, _fn, _i, _len, _ref,
      _this = this;
    if (!model.schema) {
      return callback();
    }
    queue = new Queue(1);
    schema = model.schema();
    _ref = schema.relations;
    for (key in _ref) {
      relation = _ref[key];
      if (relation.type !== 'belongsTo' || relation.isVirtual() || !(value = model.get(key))) {
        continue;
      }
      related_models = value.models ? value.models : [value];
      _fn = function(related_model) {
        return queue.defer(function(callback) {
          return related_model.save(callback);
        });
      };
      for (_i = 0, _len = related_models.length; _i < _len; _i++) {
        related_model = related_models[_i];
        if (related_model.id) {
          continue;
        }
        _fn(related_model);
      }
    }
    return queue.await(callback);
  };

  Utils.dataId = function(data) {
    if (_.isObject(data)) {
      return data.id;
    } else {
      return data;
    }
  };

  Utils.dataIsSameModel = function(data1, data2) {
    if (Utils.dataId(data1) || Utils.dataId(data2)) {
      return Utils.dataId(data1) === Utils.dataId(data2);
    }
    return _.isEqual(data1, data2);
  };

  Utils.dataToModel = function(data, model_type) {
    var item, model;
    if (!data) {
      return null;
    }
    if (_.isArray(data)) {
      return (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          item = data[_i];
          _results.push(Utils.dataToModel(item, model_type));
        }
        return _results;
      })();
    }
    if (Utils.isModel(data)) {
      model = data;
    } else if (Utils.dataId(data) !== data) {
      model = new model_type(model_type.prototype.parse(data));
    } else {
      model = new model_type({
        id: data
      });
      model.setLoaded(false);
    }
    return model;
  };

  Utils.updateModel = function(model, data) {
    if (!data || (model === data) || data._orm_needs_load) {
      return model;
    }
    if (Utils.isModel(data)) {
      data = data.toJSON();
    }
    if (Utils.dataId(data) !== data) {
      model.setLoaded(true);
      model.set(data);
    }
    return model;
  };

  Utils.updateOrNew = function(data, model_type) {
    var cache, id, model;
    if ((cache = model_type.cache) && (id = Utils.dataId(data))) {
      if (model = cache.get(id)) {
        Utils.updateModel(model, data);
      }
    }
    if (!model) {
      model = Utils.isModel(data) ? data : Utils.dataToModel(data, model_type);
      if (model && cache) {
        cache.set(model.id, model);
      }
    }
    return model;
  };

  Utils.modelJSONSave = function(model_json, model_type, callback) {
    var model,
      _this = this;
    model = new Backbone.Model(model_json);
    model._orm_never_cache = true;
    model.urlRoot = function() {
      var e, url;
      try {
        url = _.result(model_type.prototype, 'url');
      } catch (_error) {
        e = _error;
      }
      return url;
    };
    return model_type.prototype.sync('update', model, Utils.bbCallback(callback));
  };

  Utils.isSorted = function(models, fields) {
    var last_model, model, _i, _len;
    fields = _.uniq(fields);
    for (_i = 0, _len = models.length; _i < _len; _i++) {
      model = models[_i];
      if (last_model && this.fieldCompare(last_model, model, fields) === 1) {
        return false;
      }
      last_model = model;
    }
    return true;
  };

  Utils.fieldCompare = function(model, other_model, fields) {
    var desc, field;
    field = fields[0];
    if (_.isArray(field)) {
      field = field[0];
    }
    if (field.charAt(0) === '-') {
      field = field.substr(1);
      desc = true;
    }
    if (model.get(field) === other_model.get(field)) {
      if (fields.length > 1) {
        return this.fieldCompare(model, other_model, fields.splice(1));
      } else {
        return 0;
      }
    }
    if (desc) {
      if (model.get(field) < other_model.get(field)) {
        return 1;
      } else {
        return -1;
      }
    } else {
      if (model.get(field) > other_model.get(field)) {
        return 1;
      } else {
        return -1;
      }
    }
  };

  Utils.jsonFieldCompare = function(model, other_model, fields) {
    var desc, field;
    field = fields[0];
    if (_.isArray(field)) {
      field = field[0];
    }
    if (field.charAt(0) === '-') {
      field = field.substr(1);
      desc = true;
    }
    if (model[field] === other_model[field]) {
      if (fields.length > 1) {
        return this.jsonFieldCompare(model, other_model, fields.splice(1));
      } else {
        return 0;
      }
    }
    if (desc) {
      if (JSON.stringify(model[field]) < JSON.stringify(other_model[field])) {
        return 1;
      } else {
        return -1;
      }
    } else {
      if (JSON.stringify(model[field]) > JSON.stringify(other_model[field])) {
        return 1;
      } else {
        return -1;
      }
    }
  };

  return Utils;

})();

});

;
if (typeof exports == 'object') {
  module.exports = require('backbone-orm/lib/index');
} else if (typeof define == 'function' && define.amd) {
  define(['require', 'underscore', 'backbone', 'moment', 'inflection'], function(){ return require('backbone-orm/lib/index'); });
} else {
  this.BackboneORM = require('backbone-orm/lib/index');
}
}).call(this);
