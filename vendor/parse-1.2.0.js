/*!
 * Parse JavaScript SDK
 * Version: 1.2.0
 * Built: Mon Jan 28 2013 18:16:47
 * http://parse.com
 *
 * Copyright 2013 Parse, Inc.
 * The Parse JavaScript SDK is freely distributable under the MIT license.
 *
 * Includes: Underscore.js
 * Copyright 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
 * Released under the MIT license.
 */
(function (root) {
  root.Parse = root.Parse || {};
  root.Parse.VERSION = "js1.2.0";
})(this);

//     Underscore.js 1.3.3
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function () {
  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype,
    ObjProto = Object.prototype,
    FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice = ArrayProto.slice,
    unshift = ArrayProto.unshift,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeForEach = ArrayProto.forEach,
    nativeMap = ArrayProto.map,
    nativeReduce = ArrayProto.reduce,
    nativeReduceRight = ArrayProto.reduceRight,
    nativeFilter = ArrayProto.filter,
    nativeEvery = ArrayProto.every,
    nativeSome = ArrayProto.some,
    nativeIndexOf = ArrayProto.indexOf,
    nativeLastIndexOf = ArrayProto.lastIndexOf,
    nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeBind = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function (obj) {
    return new wrapper(obj);
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== "undefined") {
    if (typeof module !== "undefined" && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root["_"] = _;
  }

  // Current version.
  _.VERSION = "1.3.3";

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each =
    (_.each =
    _.forEach =
      function (obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) {
          obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
          for (var i = 0, l = obj.length; i < l; i++) {
            if (i in obj && iterator.call(context, obj[i], i, obj) === breaker)
              return;
          }
        } else {
          for (var key in obj) {
            if (_.has(obj, key)) {
              if (iterator.call(context, obj[key], key, obj) === breaker)
                return;
            }
          }
        }
      });

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function (obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function (value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    if (obj.length === +obj.length) results.length = obj.length;
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce =
    _.foldl =
    _.inject =
      function (obj, iterator, memo, context) {
        var initial = arguments.length > 2;
        if (obj == null) obj = [];
        if (nativeReduce && obj.reduce === nativeReduce) {
          if (context) iterator = _.bind(iterator, context);
          return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
        }
        each(obj, function (value, index, list) {
          if (!initial) {
            memo = value;
            initial = true;
          } else {
            memo = iterator.call(context, memo, value, index, list);
          }
        });
        if (!initial)
          throw new TypeError("Reduce of empty array with no initial value");
        return memo;
      };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function (obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial
        ? obj.reduceRight(iterator, memo)
        : obj.reduceRight(iterator);
    }
    var reversed = _.toArray(obj).reverse();
    if (context && !initial) iterator = _.bind(iterator, context);
    return initial
      ? _.reduce(reversed, iterator, memo, context)
      : _.reduce(reversed, iterator);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function (obj, iterator, context) {
    var result;
    any(obj, function (value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function (obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter)
      return obj.filter(iterator, context);
    each(obj, function (value, index, list) {
      if (iterator.call(context, value, index, list))
        results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function (obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function (value, index, list) {
      if (!iterator.call(context, value, index, list))
        results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function (obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery)
      return obj.every(iterator, context);
    each(obj, function (value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list)))
        return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any =
    (_.some =
    _.any =
      function (obj, iterator, context) {
        iterator || (iterator = _.identity);
        var result = false;
        if (obj == null) return result;
        if (nativeSome && obj.some === nativeSome)
          return obj.some(iterator, context);
        each(obj, function (value, index, list) {
          if (result || (result = iterator.call(context, value, index, list)))
            return breaker;
        });
        return !!result;
      });

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function (obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf)
      return obj.indexOf(target) != -1;
    found = any(obj, function (value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function (obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function (value) {
      return (_.isFunction(method) ? method || value : value[method]).apply(
        value,
        args
      );
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function (obj, key) {
    return _.map(obj, function (value) {
      return value[key];
    });
  };

  // Return the maximum element or (element-based computation).
  _.max = function (obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0])
      return Math.max.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = { computed: -Infinity };
    each(obj, function (value, index, list) {
      var computed = iterator
        ? iterator.call(context, value, index, list)
        : value;
      computed >= result.computed &&
        (result = { value: value, computed: computed });
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function (obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0])
      return Math.min.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = { computed: Infinity };
    each(obj, function (value, index, list) {
      var computed = iterator
        ? iterator.call(context, value, index, list)
        : value;
      computed < result.computed &&
        (result = { value: value, computed: computed });
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function (obj) {
    var shuffled = [],
      rand;
    each(obj, function (value, index, list) {
      rand = Math.floor(Math.random() * (index + 1));
      shuffled[index] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function (obj, val, context) {
    var iterator = _.isFunction(val)
      ? val
      : function (obj) {
          return obj[val];
        };
    return _.pluck(
      _.map(obj, function (value, index, list) {
        return {
          value: value,
          criteria: iterator.call(context, value, index, list),
        };
      }).sort(function (left, right) {
        var a = left.criteria,
          b = right.criteria;
        if (a === void 0) return 1;
        if (b === void 0) return -1;
        return a < b ? -1 : a > b ? 1 : 0;
      }),
      "value"
    );
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function (obj, val) {
    var result = {};
    var iterator = _.isFunction(val)
      ? val
      : function (obj) {
          return obj[val];
        };
    each(obj, function (value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function (array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0,
      high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? (low = mid + 1) : (high = mid);
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function (obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isArguments(obj)) return slice.call(obj);
    if (obj.toArray && _.isFunction(obj.toArray)) return obj.toArray();
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function (obj) {
    return _.isArray(obj) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first =
    _.head =
    _.take =
      function (array, n, guard) {
        return n != null && !guard ? slice.call(array, 0, n) : array[0];
      };

  // Returns everything but the last entry of the array. Especcialy useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function (array, n, guard) {
    return slice.call(array, 0, array.length - (n == null || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function (array, n, guard) {
    if (n != null && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function (array, index, guard) {
    return slice.call(array, index == null || guard ? 1 : index);
  };

  // Trim out all falsy values from an array.
  _.compact = function (array) {
    return _.filter(array, function (value) {
      return !!value;
    });
  };

  // Return a completely flattened version of an array.
  _.flatten = function (array, shallow) {
    return _.reduce(
      array,
      function (memo, value) {
        if (_.isArray(value))
          return memo.concat(shallow ? value : _.flatten(value));
        memo[memo.length] = value;
        return memo;
      },
      []
    );
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function (array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function (array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var results = [];
    // The `isSorted` flag is irrelevant if the array only contains two elements.
    if (array.length < 3) isSorted = true;
    _.reduce(
      initial,
      function (memo, value, index) {
        if (
          isSorted
            ? _.last(memo) !== value || !memo.length
            : !_.include(memo, value)
        ) {
          memo.push(value);
          results.push(array[index]);
        }
        return memo;
      },
      []
    );
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function () {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function (array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function (item) {
      return _.every(rest, function (other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function (array) {
    var rest = _.flatten(slice.call(arguments, 1), true);
    return _.filter(array, function (value) {
      return !_.include(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function () {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, "length"));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function (array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf)
      return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++)
      if (i in array && array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function (array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf)
      return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function (start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while (idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function () {};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind)
      return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError();
    args = slice.call(arguments, 2);
    return (bound = function () {
      if (!(this instanceof bound))
        return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor();
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    });
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function (obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function (f) {
      obj[f] = _.bind(obj[f], obj);
    });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function (func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function () {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key)
        ? memo[key]
        : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function (func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function () {
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function (func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function (func, wait) {
    var context, args, timeout, throttling, more, result;
    var whenDone = _.debounce(function () {
      more = throttling = false;
    }, wait);
    return function () {
      context = this;
      args = arguments;
      var later = function () {
        timeout = null;
        if (more) func.apply(context, args);
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        result = func.apply(context, args);
      }
      whenDone();
      throttling = true;
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function (func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      if (immediate && !timeout) func.apply(context, args);
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function (func) {
    var ran = false,
      memo;
    return function () {
      if (ran) return memo;
      ran = true;
      return (memo = func.apply(this, arguments));
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function (func, wrapper) {
    return function () {
      var args = [func].concat(slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function () {
    var funcs = arguments;
    return function () {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function (times, func) {
    if (times <= 0) return func();
    return function () {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys =
    nativeKeys ||
    function (obj) {
      if (obj !== Object(obj)) throw new TypeError("Invalid object");
      var keys = [];
      for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
      return keys;
    };

  // Retrieve the values of an object's properties.
  _.values = function (obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function (obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function (obj) {
    each(slice.call(arguments, 1), function (source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function (obj) {
    var result = {};
    each(_.flatten(slice.call(arguments, 1)), function (key) {
      if (key in obj) result[key] = obj[key];
    });
    return result;
  };

  // Fill in a given object with default properties.
  _.defaults = function (obj) {
    each(slice.call(arguments, 1), function (source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function (obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function (obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function.
  function eq(a, b, stack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // Invoke a custom `isEqual` method if one is provided.
    if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
    if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case "[object String]":
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case "[object Number]":
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;
      case "[object Date]":
      case "[object Boolean]":
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case "[object RegExp]":
        return (
          a.source == b.source &&
          a.global == b.global &&
          a.multiline == b.multiline &&
          a.ignoreCase == b.ignoreCase
        );
    }
    if (typeof a != "object" || typeof b != "object") return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (stack[length] == a) return true;
    }
    // Add the first object to the stack of traversed objects.
    stack.push(a);
    var size = 0,
      result = true;
    // Recursively compare objects and arrays.
    if (className == "[object Array]") {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          // Ensure commutative equality for sparse arrays.
          if (!(result = size in a == size in b && eq(a[size], b[size], stack)))
            break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent.
      if (
        "constructor" in a != "constructor" in b ||
        a.constructor != b.constructor
      )
        return false;
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !size--) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    stack.pop();
    return result;
  }

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function (a, b) {
    return eq(a, b, []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function (obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function (obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray =
    nativeIsArray ||
    function (obj) {
      return toString.call(obj) == "[object Array]";
    };

  // Is a given variable an object?
  _.isObject = function (obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function (obj) {
    return toString.call(obj) == "[object Arguments]";
  };
  if (!_.isArguments(arguments)) {
    _.isArguments = function (obj) {
      return !!(obj && _.has(obj, "callee"));
    };
  }

  // Is a given value a function?
  _.isFunction = function (obj) {
    return toString.call(obj) == "[object Function]";
  };

  // Is a given value a string?
  _.isString = function (obj) {
    return toString.call(obj) == "[object String]";
  };

  // Is a given value a number?
  _.isNumber = function (obj) {
    return toString.call(obj) == "[object Number]";
  };

  // Is a given object a finite number?
  _.isFinite = function (obj) {
    return _.isNumber(obj) && isFinite(obj);
  };

  // Is the given value `NaN`?
  _.isNaN = function (obj) {
    // `NaN` is the only value for which `===` is not reflexive.
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function (obj) {
    return (
      obj === true || obj === false || toString.call(obj) == "[object Boolean]"
    );
  };

  // Is a given value a date?
  _.isDate = function (obj) {
    return toString.call(obj) == "[object Date]";
  };

  // Is the given value a regular expression?
  _.isRegExp = function (obj) {
    return toString.call(obj) == "[object RegExp]";
  };

  // Is a given value equal to null?
  _.isNull = function (obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function (obj) {
    return obj === void 0;
  };

  // Has own property?
  _.has = function (obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function () {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function (value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Escape a string for HTML interpolation.
  _.escape = function (string) {
    return ("" + string)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  };

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function (object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function (obj) {
    each(_.functions(obj), function (name) {
      addToWrapper(name, (_[name] = obj[name]));
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function (prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g,
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /.^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "\\": "\\",
    "'": "'",
    r: "\r",
    n: "\n",
    t: "\t",
    u2028: "\u2028",
    u2029: "\u2029",
  };

  for (var p in escapes) escapes[escapes[p]] = p;
  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

  // Within an interpolation, evaluation, or escaping, remove HTML escaping
  // that had been previously added.
  var unescape = function (code) {
    return code.replace(unescaper, function (match, escape) {
      return escapes[escape];
    });
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function (text, data, settings) {
    settings = _.defaults(settings || {}, _.templateSettings);

    // Compile the template source, taking care to escape characters that
    // cannot be included in a string literal and then unescape them in code
    // blocks.
    var source =
      "__p+='" +
      text
        .replace(escaper, function (match) {
          return "\\" + escapes[match];
        })
        .replace(settings.escape || noMatch, function (match, code) {
          return "'+\n_.escape(" + unescape(code) + ")+\n'";
        })
        .replace(settings.interpolate || noMatch, function (match, code) {
          return "'+\n(" + unescape(code) + ")+\n'";
        })
        .replace(settings.evaluate || noMatch, function (match, code) {
          return "';\n" + unescape(code) + "\n;__p+='";
        }) +
      "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = "with(obj||{}){\n" + source + "}\n";

    source =
      "var __p='';" +
      "var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" +
      source +
      "return __p;\n";

    var render = new Function(settings.variable || "obj", "_", source);
    if (data) return render(data, _);
    var template = function (data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for build time
    // precompilation.
    template.source =
      "function(" + (settings.variable || "obj") + "){\n" + source + "}";

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function (obj) {
    return _(obj).chain();
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function (obj) {
    this._wrapped = obj;
  };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function (obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function (name, func) {
    wrapper.prototype[name] = function () {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(
    ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"],
    function (name) {
      var method = ArrayProto[name];
      wrapper.prototype[name] = function () {
        var wrapped = this._wrapped;
        method.apply(wrapped, arguments);
        var length = wrapped.length;
        if ((name == "shift" || name == "splice") && length === 0)
          delete wrapped[0];
        return result(wrapped, this._chain);
      };
    }
  );

  // Add all accessor Array functions to the wrapper.
  each(["concat", "join", "slice"], function (name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function () {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function () {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function () {
    return this._wrapped;
  };
}.call(this));

/*global _: false, $: false, localStorage: false, XMLHttpRequest: false,
 XDomainRequest: false, exports: false, require: false */
(function (root) {
  root.Parse = root.Parse || {};
  /**
   * Contains all Parse API classes and functions.
   * @name Parse
   * @namespace
   *
   * Contains all Parse API classes and functions.
   */
  var Parse = root.Parse;

  // Import Parse's local copy of underscore.
  if (typeof exports !== "undefined" && exports._) {
    // We're running in Node.js.  Pull in the dependencies.
    Parse._ = exports._.noConflict();
    Parse.localStorage = require("localStorage");
    Parse.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    exports.Parse = Parse;
  } else {
    Parse._ = _.noConflict();
    if (typeof localStorage !== "undefined") {
      Parse.localStorage = localStorage;
    }
    if (typeof XMLHttpRequest !== "undefined") {
      Parse.XMLHttpRequest = XMLHttpRequest;
    }
  }

  // If jQuery or Zepto has been included, grab a reference to it.
  if (typeof $ !== "undefined") {
    Parse.$ = $;
  }

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var EmptyConstructor = function () {};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function (parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty("constructor")) {
      child = protoProps.constructor;
    } else {
      /** @ignore */
      child = function () {
        parent.apply(this, arguments);
      };
    }

    // Inherit class (static) properties from parent.
    Parse._.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    EmptyConstructor.prototype = parent.prototype;
    child.prototype = new EmptyConstructor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) {
      Parse._.extend(child.prototype, protoProps);
    }

    // Add static properties to the constructor function, if supplied.
    if (staticProps) {
      Parse._.extend(child, staticProps);
    }

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is
    // needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set the server for Parse to talk to.
  Parse.serverURL = "https://api.parse.com";

  /**
   * Call this method first to set up your authentication tokens for Parse.
   * You can get your keys from the Data Browser on parse.com.
   * @param {String} applicationId Your Parse Application ID.
   * @param {String} javaScriptKey Your Parse JavaScript Key.
   */
  Parse.initialize = function (applicationId, javaScriptKey) {
    Parse._initialize(applicationId, javaScriptKey);
  };

  /**
   * Call this method first to set up master authentication tokens for Parse.
   * This method is for Parse's own private use.
   * @param {String} applicationId Your Parse Application ID.
   * @param {String} javaScriptKey Your Parse JavaScript Key.
   * @param {String} masterKey Your Parse Master Key.
   */
  Parse._initialize = function (applicationId, javaScriptKey, masterKey) {
    Parse.applicationId = applicationId;
    Parse.javaScriptKey = javaScriptKey;
    Parse.masterKey = masterKey;
    Parse._useMasterKey = false;
  };

  /**
   * Returns prefix for localStorage keys used by this instance of Parse.
   * @param {String} path The relative suffix to append to it.
   *     null or undefined is treated as the empty string.
   * @return {String} The full key name.
   */
  Parse._getParsePath = function (path) {
    if (!Parse.applicationId) {
      throw "You need to call Parse.initialize before using Parse.";
    }
    if (!path) {
      path = "";
    }
    if (!Parse._.isString(path)) {
      throw "Tried to get a localStorage path that wasn't a String.";
    }
    if (path[0] === "/") {
      path = path.substring(1);
    }
    return "Parse/" + Parse.applicationId + "/" + path;
  };

  /**
   * Returns the unique string for this app on this machine.
   * Gets reset when localStorage is cleared.
   */
  Parse._installationId = null;
  Parse._getInstallationId = function () {
    // See if it's cached in RAM.
    if (Parse._installationId) {
      return Parse._installationId;
    }

    // Try to get it from localStorage.
    var path = Parse._getParsePath("installationId");
    Parse._installationId = Parse.localStorage.getItem(path);

    if (!Parse._installationId || Parse._installationId === "") {
      // It wasn't in localStorage, so create a new one.
      var hexOctet = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      };
      Parse._installationId =
        hexOctet() +
        hexOctet() +
        "-" +
        hexOctet() +
        "-" +
        hexOctet() +
        "-" +
        hexOctet() +
        "-" +
        hexOctet() +
        hexOctet() +
        hexOctet();
      Parse.localStorage.setItem(path, Parse._installationId);
    }

    return Parse._installationId;
  };

  Parse._parseDate = function (iso8601) {
    var regexp = new RegExp(
      "^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})" +
        "T" +
        "([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})" +
        "(.([0-9]+))?" +
        "Z$"
    );
    var match = regexp.exec(iso8601);
    if (!match) {
      return null;
    }

    var year = match[1] || 0;
    var month = (match[2] || 1) - 1;
    var day = match[3] || 0;
    var hour = match[4] || 0;
    var minute = match[5] || 0;
    var second = match[6] || 0;
    var milli = match[8] || 0;

    return new Date(Date.UTC(year, month, day, hour, minute, second, milli));
  };

  Parse._ajaxIE8 = function (method, url, data, success, error) {
    var xdr = new XDomainRequest();
    xdr.onload = function () {
      var response;
      try {
        response = JSON.parse(xdr.responseText);
      } catch (e) {
        if (error) {
          error(xdr);
        }
      }
      if (response) {
        if (success) {
          success(response, xdr);
        }
      }
    };
    xdr.onerror = xdr.ontimeout = function () {
      error(xdr);
    };
    xdr.onprogress = function () {};
    xdr.open(method, url);
    xdr.send(data);
  };

  Parse._ajax = function (method, url, data, success, error) {
    if (typeof XDomainRequest !== "undefined") {
      return Parse._ajaxIE8(method, url, data, success, error);
    }

    var handled = false;

    var xhr = new Parse.XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (handled) {
          return;
        }
        handled = true;

        if (xhr.status >= 200 && xhr.status < 300) {
          var response;
          try {
            response = JSON.parse(xhr.responseText);
          } catch (e) {
            if (error) {
              error(xhr);
            }
          }
          if (response) {
            if (success) {
              success(response, xhr);
            }
          }
        } else {
          if (error) {
            error(xhr);
          }
        }
      }
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "text/plain"); // avoid pre-flight.
    xhr.send(data);
  };

  // A self-propagating extend function.
  Parse._extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  /**
   * route is classes, users, login, etc.
   * objectId is null if there is no associated objectId.
   * method is the http method for the REST API.
   * dataObject is the payload as an object, or null if there is none.
   * options is just a success/error callback hash.
   * @ignore
   */
  Parse._request = function (
    route,
    className,
    objectId,
    method,
    dataObject,
    options
  ) {
    if (!Parse.applicationId) {
      throw "You must specify your applicationId using Parse.initialize";
    }

    if (!Parse.javaScriptKey && !Parse.masterKey) {
      throw "You must specify a key using Parse.initialize";
    }

    if (
      route !== "classes" &&
      route !== "push" &&
      route !== "users" &&
      route !== "login" &&
      route !== "functions" &&
      route !== "requestPasswordReset"
    ) {
      throw (
        "First argument must be one of classes, users, functions, or " +
        "login, not '" +
        route +
        "'."
      );
    }

    var url = Parse.serverURL;
    if (url.charAt(url.length - 1) !== "/") {
      url += "/";
    }
    url += "1/" + route;
    if (className) {
      url += "/" + className;
    }
    if (objectId) {
      url += "/" + objectId;
    }

    dataObject = Parse._.clone(dataObject || {});
    if (method !== "POST") {
      dataObject._method = method;
      method = "POST";
    }
    dataObject._ApplicationId = Parse.applicationId;
    if (!Parse._useMasterKey) {
      dataObject._JavaScriptKey = Parse.javaScriptKey;
    } else {
      dataObject._MasterKey = Parse.masterKey;
    }

    dataObject._ClientVersion = Parse.VERSION;
    dataObject._InstallationId = Parse._getInstallationId();
    // Pass the session token on every request.
    var currentUser = Parse.User.current();
    if (currentUser && currentUser._sessionToken) {
      dataObject._SessionToken = currentUser._sessionToken;
    }
    var data = JSON.stringify(dataObject);

    Parse._ajax(method, url, data, options.success, options.error);
  };

  // Helper function to get a value from a Backbone object as a property
  // or as a function.
  Parse._getValue = function (object, prop) {
    if (!(object && object[prop])) {
      return null;
    }
    return Parse._.isFunction(object[prop]) ? object[prop]() : object[prop];
  };

  /**
   * Converts a value in a Parse Object into the appropriate representation.
   * This is the JS equivalent of Java's Parse.maybeReferenceAndEncode(Object)
   * if seenObjects is falsey. Otherwise any Parse.Objects not in
   * seenObjects will be fully embedded rather than encoded
   * as a pointer.  This array will be used to prevent going into an infinite
   * loop because we have circular references.  If <seenObjects>
   * is set, then none of the Parse Objects that are serialized can be dirty.
   */
  Parse._encode = function (value, seenObjects, disallowObjects) {
    var _ = Parse._;
    if (value instanceof Parse.Object) {
      if (disallowObjects) {
        throw "Parse.Objects not allowed here";
      }
      if (!seenObjects || _.include(seenObjects, value) || !value._hasData) {
        return value._toPointer();
      } else if (!value.dirty()) {
        seenObjects = seenObjects.concat(value);
        return Parse._encode(
          value._toFullJSON(seenObjects),
          seenObjects,
          disallowObjects
        );
      } else {
        throw "Can't fully embed a dirty object";
      }
    } else if (value instanceof Parse.ACL) {
      return value.toJSON();
    } else if (_.isDate(value)) {
      return { __type: "Date", iso: value.toJSON() };
    } else if (value instanceof Parse.GeoPoint) {
      return value.toJSON();
    } else if (_.isArray(value)) {
      return _.map(value, function (x) {
        return Parse._encode(x, seenObjects, disallowObjects);
      });
    } else if (_.isRegExp(value)) {
      return value.source;
    } else if (value instanceof Parse.Relation) {
      return value.toJSON();
    } else if (value instanceof Parse.Op) {
      return value.toJSON();
    } else if (value instanceof Object) {
      var output = {};
      Parse._each(value, function (v, k) {
        output[k] = Parse._encode(v, seenObjects, disallowObjects);
      });
      return output;
    } else {
      return value;
    }
  };

  /**
   * The inverse function of Parse._encode.
   * TODO: make decode not mutate value.
   */
  Parse._decode = function (key, value) {
    var _ = Parse._;
    if (!_.isObject(value)) {
      return value;
    } else if (_.isArray(value)) {
      Parse._each(value, function (v, k) {
        value[k] = Parse._decode(k, v);
      });
      return value;
    } else if (value instanceof Parse.Object) {
      return value;
    } else if (value instanceof Parse.Op) {
      return value;
    } else if (value.__op) {
      // Must be a Op.
      return Parse.Op._decode(value);
    } else if (value.__type === "Pointer") {
      var pointer = Parse.Object._create(value.className);
      pointer._finishFetch({ objectId: value.objectId }, false);
      return pointer;
    } else if (value.__type === "Object") {
      // It's an Object included in a query result.
      var className = value.className;
      delete value.__type;
      delete value.className;
      var object = Parse.Object._create(className);
      object._finishFetch(value, true);
      return object;
    } else if (value.__type === "Date") {
      return Parse._parseDate(value.iso);
    } else if (value.__type === "GeoPoint") {
      return new Parse.GeoPoint({
        latitude: value.latitude,
        longitude: value.longitude,
      });
    } else if (key === "ACL") {
      if (value instanceof Parse.ACL) {
        return value;
      } else {
        return new Parse.ACL(value);
      }
    } else if (value.__type === "Relation") {
      var relation = new Parse.Relation(null, key);
      relation.targetClassName = value.className;
      return relation;
    } else {
      Parse._each(value, function (v, k) {
        value[k] = Parse._decode(k, v);
      });
      return value;
    }
  };

  /**
   * This is like _.each, except:
   * * it doesn't work for so-called array-like objects,
   * * it does work for dictionaries with a "length" attribute.
   */
  Parse._each = function (obj, callback) {
    var _ = Parse._;
    if (_.isObject(obj)) {
      _.each(_.keys(obj), function (key) {
        callback(obj[key], key);
      });
    } else {
      _.each(obj, callback);
    }
  };

  // Helper function to check null or undefined.
  Parse._isNullOrUndefined = function (x) {
    return Parse._.isNull(x) || Parse._.isUndefined(x);
  };
})(this);

(function (root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Constructs a new Parse.Error object with the given code and message.
   * @param {Number} code An error code constant from <code>Parse.Error</code>.
   * @param {String} message A detailed description of the error.
   * @class
   *
   * <p>Class used for all objects passed to error callbacks.</p>
   */
  Parse.Error = function (code, message) {
    this.code = code;
    this.message = message;
  };

  _.extend(
    Parse.Error,
    /** @lends Parse.Error */ {
      /**
       * Error code indicating some error other than those enumerated here.
       * @constant
       */
      OTHER_CAUSE: -1,

      /**
       * Error code indicating that something has gone wrong with the server.
       * If you get this error code, it is Parse's fault. Email feedback@parse.com
       * to criticize us.
       * @constant
       */
      INTERNAL_SERVER_ERROR: 1,

      /**
       * Error code indicating the connection to the Parse servers failed.
       * @constant
       */
      CONNECTION_FAILED: 100,

      /**
       * Error code indicating the specified object doesn't exist.
       * @constant
       */
      OBJECT_NOT_FOUND: 101,

      /**
       * Error code indicating you tried to query with a datatype that doesn't
       * support it, like exact matching an array or object.
       * @constant
       */
      INVALID_QUERY: 102,

      /**
       * Error code indicating a missing or invalid classname. Classnames are
       * case-sensitive. They must start with a letter, and a-zA-Z0-9_ are the
       * only valid characters.
       * @constant
       */
      INVALID_CLASS_NAME: 103,

      /**
       * Error code indicating an unspecified object id.
       * @constant
       */
      MISSING_OBJECT_ID: 104,

      /**
       * Error code indicating an invalid key name. Keys are case-sensitive. They
       * must start with a letter, and a-zA-Z0-9_ are the only valid characters.
       * @constant
       */
      INVALID_KEY_NAME: 105,

      /**
       * Error code indicating a malformed pointer. You should not see this unless
       * you have been mucking about changing internal Parse code.
       * @constant
       */
      INVALID_POINTER: 106,

      /**
       * Error code indicating that badly formed JSON was received upstream. This
       * either indicates you have done something unusual with modifying how
       * things encode to JSON, or the network is failing badly.
       * @constant
       */
      INVALID_JSON: 107,

      /**
       * Error code indicating that the feature you tried to access is only
       * available internally for testing purposes.
       * @constant
       */
      COMMAND_UNAVAILABLE: 108,

      /**
       * You must call Parse.initialize before using the Parse library.
       * @constant
       */
      NOT_INITIALIZED: 109,

      /**
       * Error code indicating that a field was set to an inconsistent type.
       * @constant
       */
      INCORRECT_TYPE: 111,

      /**
       * Error code indicating an invalid channel name. A channel name is either
       * an empty string (the broadcast channel) or contains only a-zA-Z0-9_
       * characters and starts with a letter.
       * @constant
       */
      INVALID_CHANNEL_NAME: 112,

      /**
       * Error code indicating that push is misconfigured.
       * @constant
       */
      PUSH_MISCONFIGURED: 115,

      /**
       * Error code indicating that the object is too large.
       * @constant
       */
      OBJECT_TOO_LARGE: 116,

      /**
       * Error code indicating that the operation isn't allowed for clients.
       * @constant
       */
      OPERATION_FORBIDDEN: 119,

      /**
       * Error code indicating the result was not found in the cache.
       * @constant
       */
      CACHE_MISS: 120,

      /**
       * Error code indicating that an invalid key was used in a nested
       * JSONObject.
       * @constant
       */
      INVALID_NESTED_KEY: 121,

      /**
       * Error code indicating that an invalid filename was used for ParseFile.
       * A valid file name contains only a-zA-Z0-9_. characters and is between 1
       * and 128 characters.
       * @constant
       */
      INVALID_FILE_NAME: 122,

      /**
       * Error code indicating an invalid ACL was provided.
       * @constant
       */
      INVALID_ACL: 123,

      /**
       * Error code indicating that the request timed out on the server. Typically
       * this indicates that the request is too expensive to run.
       * @constant
       */
      TIMEOUT: 124,

      /**
       * Error code indicating that the email address was invalid.
       * @constant
       */
      INVALID_EMAIL_ADDRESS: 125,

      /**
       * Error code indicating a missing content type.
       * @constant
       */
      MISSING_CONTENT_TYPE: 126,

      /**
       * Error code indicating a missing content length.
       * @constant
       */
      MISSING_CONTENT_LENGTH: 127,

      /**
       * Error code indicating an invalid content length.
       * @constant
       */
      INVALID_CONTENT_LENGTH: 128,

      /**
       * Error code indicating a file that was too large.
       * @constant
       */
      FILE_TOO_LARGE: 129,

      /**
       * Error code indicating an error saving a file.
       * @constant
       */
      FILE_SAVE_ERROR: 130,

      /**
       * Error code indicating an error deleting a file.
       * @constant
       */
      FILE_DELETE_ERROR: 153,

      /**
       * Error code indicating that a unique field was given a value that is
       * already taken.
       * @constant
       */
      DUPLICATE_VALUE: 137,

      /**
       * Error code indicating that a role's name is invalid.
       * @constant
       */
      INVALID_ROLE_NAME: 139,

      /**
       * Error code indicating that an application quota was exceeded.  Upgrade to
       * resolve.
       * @constant
       */
      EXCEEDED_QUOTA: 140,

      /**
       * Error code indicating that a Cloud Code script failed.
       * @constant
       */
      SCRIPT_FAILED: 141,

      /**
       * Error code indicating that a Cloud Code validation failed.
       * @constant
       */
      VALIDATION_ERROR: 142,

      /**
       * Error code indicating that invalid image data was provided.
       * @constant
       */
      INVALID_IMAGE_DATA: 150,

      /**
       * Error code indicating an unsaved file.
       * @constant
       */
      UNSAVED_FILE_ERROR: 151,

      /**
       * Error code indicating an invalid push time.
       */
      INVALID_PUSH_TIME_ERROR: 152,

      /**
       * Error code indicating that the username is missing or empty.
       * @constant
       */
      USERNAME_MISSING: 200,

      /**
       * Error code indicating that the password is missing or empty.
       * @constant
       */
      PASSWORD_MISSING: 201,

      /**
       * Error code indicating that the username has already been taken.
       * @constant
       */
      USERNAME_TAKEN: 202,

      /**
       * Error code indicating that the email has already been taken.
       * @constant
       */
      EMAIL_TAKEN: 203,

      /**
       * Error code indicating that the email is missing, but must be specified.
       * @constant
       */
      EMAIL_MISSING: 204,

      /**
       * Error code indicating that a user with the specified email was not found.
       * @constant
       */
      EMAIL_NOT_FOUND: 205,

      /**
       * Error code indicating that a user object without a valid session could
       * not be altered.
       * @constant
       */
      SESSION_MISSING: 206,

      /**
       * Error code indicating that a user can only be created through signup.
       * @constant
       */
      MUST_CREATE_USER_THROUGH_SIGNUP: 207,

      /**
       * Error code indicating that an an account being linked is already linked
       * to another user.
       * @constant
       */
      ACCOUNT_ALREADY_LINKED: 208,

      /**
       * Error code indicating that a user cannot be linked to an account because
       * that account's id could not be found.
       * @constant
       */
      LINKED_ID_MISSING: 250,

      /**
       * Error code indicating that a user with a linked (e.g. Facebook) account
       * has an invalid session.
       * @constant
       */
      INVALID_LINKED_SESSION: 251,

      /**
       * Error code indicating that a service being linked (e.g. Facebook or
       * Twitter) is unsupported.
       * @constant
       */
      UNSUPPORTED_SERVICE: 252,
    }
  );
})(this);

/*global _: false */
(function () {
  var root = this;
  var Parse = root.Parse || (root.Parse = {});
  var eventSplitter = /\s+/;
  var slice = Array.prototype.slice;

  /**
   * @class
   *
   * <p>Parse.Events is a fork of Backbone's Events module, provided for your
   * convenience.</p>
   *
   * <p>A module that can be mixed in to any object in order to provide
   * it with custom events. You may bind callback functions to an event
   * with `on`, or remove these functions with `off`.
   * Triggering an event fires all callbacks in the order that `on` was
   * called.
   *
   * <pre>
   *     var object = {};
   *     _.extend(object, Parse.Events);
   *     object.on('expand', function(){ alert('expanded'); });
   *     object.trigger('expand');</pre></p>
   *
   * <p>For more information, see the
   * <a href="http://documentcloud.github.com/backbone/#Events">Backbone
   * documentation</a>.</p>
   */
  Parse.Events = {
    /**
     * Bind one or more space separated events, `events`, to a `callback`
     * function. Passing `"all"` will bind the callback to all events fired.
     */
    on: function (events, callback, context) {
      var calls, event, node, tail, list;
      if (!callback) {
        return this;
      }
      events = events.split(eventSplitter);
      calls = this._callbacks || (this._callbacks = {});

      // Create an immutable callback list, allowing traversal during
      // modification.  The tail is an empty object that will always be used
      // as the next node.
      event = events.shift();
      while (event) {
        list = calls[event];
        node = list ? list.tail : {};
        node.next = tail = {};
        node.context = context;
        node.callback = callback;
        calls[event] = { tail: tail, next: list ? list.next : node };
        event = events.shift();
      }

      return this;
    },

    /**
     * Remove one or many callbacks. If `context` is null, removes all callbacks
     * with that function. If `callback` is null, removes all callbacks for the
     * event. If `events` is null, removes all bound callbacks for all events.
     */
    off: function (events, callback, context) {
      var event, calls, node, tail, cb, ctx;

      // No events, or removing *all* events.
      if (!(calls = this._callbacks)) {
        return;
      }
      if (!(events || callback || context)) {
        delete this._callbacks;
        return this;
      }

      // Loop through the listed events and contexts, splicing them out of the
      // linked list of callbacks if appropriate.
      events = events ? events.split(eventSplitter) : _.keys(calls);
      event = events.shift();
      while (event) {
        node = calls[event];
        delete calls[event];
        if (!node || !(callback || context)) {
          continue;
        }
        // Create a new list, omitting the indicated callbacks.
        tail = node.tail;
        node = node.next;
        while (node !== tail) {
          cb = node.callback;
          ctx = node.context;
          if ((callback && cb !== callback) || (context && ctx !== context)) {
            this.on(event, cb, ctx);
          }
          node = node.next;
        }
        event = events.shift();
      }

      return this;
    },

    /**
     * Trigger one or many events, firing all bound callbacks. Callbacks are
     * passed the same arguments as `trigger` is, apart from the event name
     * (unless you're listening on `"all"`, which will cause your callback to
     * receive the true name of the event as the first argument).
     */
    trigger: function (events) {
      var event, node, calls, tail, args, all, rest;
      if (!(calls = this._callbacks)) {
        return this;
      }
      all = calls.all;
      events = events.split(eventSplitter);
      rest = slice.call(arguments, 1);

      // For each event, walk through the linked list of callbacks twice,
      // first to trigger the event, then to trigger any `"all"` callbacks.
      event = events.shift();
      while (event) {
        node = calls[event];
        if (node) {
          tail = node.tail;
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, rest);
          }
        }
        node = all;
        if (node) {
          tail = node.tail;
          args = [event].concat(rest);
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, args);
          }
        }
        event = events.shift();
      }

      return this;
    },
  };

  /**
   * @function
   */
  Parse.Events.bind = Parse.Events.on;

  /**
   * @function
   */
  Parse.Events.unbind = Parse.Events.off;
}.call(this));

/*global navigator: false */
(function (root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Creates a new GeoPoint with any of the following forms:<br>
   *   <pre>
   *   new GeoPoint(otherGeoPoint)
   *   new GeoPoint(30, 30)
   *   new GeoPoint([30, 30])
   *   new GeoPoint({latitude: 30, longitude: 30})
   *   new GeoPoint()  // defaults to (0, 0)
   *   </pre>
   * @class
   *
   * <p>Represents a latitude / longitude point that may be associated
   * with a key in a ParseObject or used as a reference point for geo queries.
   * This allows proximity-based queries on the key.</p>
   *
   * <p>Only one key in a class may contain a GeoPoint.</p>
   *
   * <p>Example:<pre>
   *   var point = new Parse.GeoPoint(30.0, -20.0);
   *   var object = new Parse.Object("PlaceObject");
   *   object.set("location", point);
   *   object.save();</pre></p>
   */
  Parse.GeoPoint = function (arg1, arg2) {
    if (_.isArray(arg1)) {
      Parse.GeoPoint._validate(arg1[0], arg1[1]);
      this.latitude = arg1[0];
      this.longitude = arg1[1];
    } else if (_.isObject(arg1)) {
      Parse.GeoPoint._validate(arg1.latitude, arg1.longitude);
      this.latitude = arg1.latitude;
      this.longitude = arg1.longitude;
    } else if (_.isNumber(arg1) && _.isNumber(arg2)) {
      Parse.GeoPoint._validate(arg1, arg2);
      this.latitude = arg1;
      this.longitude = arg2;
    } else {
      this.latitude = 0;
      this.longitude = 0;
    }

    // Add properties so that anyone using Webkit or Mozilla will get an error
    // if they try to set values that are out of bounds.
    var self = this;
    if (this.__defineGetter__ && this.__defineSetter__) {
      // Use _latitude and _longitude to actually store the values, and add
      // getters and setters for latitude and longitude.
      this._latitude = this.latitude;
      this._longitude = this.longitude;
      this.__defineGetter__("latitude", function () {
        return self._latitude;
      });
      this.__defineGetter__("longitude", function () {
        return self._longitude;
      });
      this.__defineSetter__("latitude", function (val) {
        Parse.GeoPoint._validate(val, self.longitude);
        self._latitude = val;
      });
      this.__defineSetter__("longitude", function (val) {
        Parse.GeoPoint._validate(self.latitude, val);
        self._longitude = val;
      });
    }
  };

  /**
   * @lends Parse.GeoPoint.prototype
   * @property {float} latitude North-south portion of the coordinate, in range
   *   [-90, 90].  Throws an exception if set out of range in a modern browser.
   * @property {float} longitude East-west portion of the coordinate, in range
   *   [-180, 180].  Throws if set out of range in a modern browser.
   */

  /**
   * Throws an exception if the given lat-long is out of bounds.
   */
  Parse.GeoPoint._validate = function (latitude, longitude) {
    if (latitude < -90.0) {
      throw "Parse.GeoPoint latitude " + latitude + " < -90.0.";
    }
    if (latitude > 90.0) {
      throw "Parse.GeoPoint latitude " + latitude + " > 90.0.";
    }
    if (longitude < -180.0) {
      throw "Parse.GeoPoint longitude " + longitude + " < -180.0.";
    }
    if (longitude > 180.0) {
      throw "Parse.GeoPoint longitude " + longitude + " > 180.0.";
    }
  };

  /**
   * Creates a GeoPoint with the user's current location, if available.
   * Calls options.success with a new GeoPoint instance or calls options.error.
   * @param {Object} options An object with success and error callbacks.
   */
  Parse.GeoPoint.current = function (options) {
    var success = function (location) {
      if (options.success) {
        options.success(
          new Parse.GeoPoint({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          })
        );
      }
    };
    var error = function (e) {
      if (options.error) {
        options.error(e);
      }
    };
    navigator.geolocation.getCurrentPosition(success, error);
  };

  Parse.GeoPoint.prototype = {
    /**
     * Returns a JSON representation of the GeoPoint, suitable for Parse.
     * @return {Object}
     */
    toJSON: function () {
      Parse.GeoPoint._validate(this.latitude, this.longitude);
      return {
        __type: "GeoPoint",
        latitude: this.latitude,
        longitude: this.longitude,
      };
    },

    /**
     * Returns the distance from this GeoPoint to another in radians.
     * @param {Parse.GeoPoint} point the other Parse.GeoPoint.
     * @return {Number}
     */
    radiansTo: function (point) {
      var d2r = Math.PI / 180.0;
      var lat1rad = this.latitude * d2r;
      var long1rad = this.longitude * d2r;
      var lat2rad = point.latitude * d2r;
      var long2rad = point.longitude * d2r;
      var deltaLat = lat1rad - lat2rad;
      var deltaLong = long1rad - long2rad;
      var sinDeltaLatDiv2 = Math.sin(deltaLat / 2);
      var sinDeltaLongDiv2 = Math.sin(deltaLong / 2);
      // Square of half the straight line chord distance between both points.
      var a =
        sinDeltaLatDiv2 * sinDeltaLatDiv2 +
        Math.cos(lat1rad) *
          Math.cos(lat2rad) *
          sinDeltaLongDiv2 *
          sinDeltaLongDiv2;
      a = Math.min(1.0, a);
      return 2 * Math.asin(Math.sqrt(a));
    },

    /**
     * Returns the distance from this GeoPoint to another in kilometers.
     * @param {Parse.GeoPoint} point the other Parse.GeoPoint.
     * @return {Number}
     */
    kilometersTo: function (point) {
      return this.radiansTo(point) * 6371.0;
    },

    /**
     * Returns the distance from this GeoPoint to another in miles.
     * @param {Parse.GeoPoint} point the other Parse.GeoPoint.
     * @return {Number}
     */
    milesTo: function (point) {
      return this.radiansTo(point) * 3958.8;
    },
  };
})(this);

/*global navigator: false */
(function (root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  var PUBLIC_KEY = "*";

  /**
   * Creates a new ACL.
   * If no argument is given, the ACL has no permissions for anyone.
   * If the argument is a Parse.User, the ACL will have read and write
   *   permission for only that user.
   * If the argument is any other JSON object, that object will be interpretted
   *   as a serialized ACL created with toJSON().
   * @see Parse.Object#setACL
   * @class
   *
   * <p>An ACL, or Access Control List can be added to any
   * <code>Parse.Object</code> to restrict access to only a subset of users
   * of your application.</p>
   */
  Parse.ACL = function (arg1) {
    var self = this;
    self.permissionsById = {};
    if (_.isObject(arg1)) {
      if (arg1 instanceof Parse.User) {
        self.setReadAccess(arg1, true);
        self.setWriteAccess(arg1, true);
      } else {
        if (_.isFunction(arg1)) {
          throw "Parse.ACL() called with a function.  Did you forget ()?";
        }
        Parse._each(arg1, function (accessList, userId) {
          if (!_.isString(userId)) {
            throw "Tried to create an ACL with an invalid userId.";
          }
          self.permissionsById[userId] = {};
          Parse._each(accessList, function (allowed, permission) {
            if (permission !== "read" && permission !== "write") {
              throw "Tried to create an ACL with an invalid permission type.";
            }
            if (!_.isBoolean(allowed)) {
              throw "Tried to create an ACL with an invalid permission value.";
            }
            self.permissionsById[userId][permission] = allowed;
          });
        });
      }
    }
  };

  /**
   * Returns a JSON-encoded version of the ACL.
   * @return {Object}
   */
  Parse.ACL.prototype.toJSON = function () {
    return _.clone(this.permissionsById);
  };

  Parse.ACL.prototype._setAccess = function (accessType, userId, allowed) {
    if (userId instanceof Parse.User) {
      userId = userId.id;
    } else if (userId instanceof Parse.Role) {
      userId = "role:" + userId.getName();
    }
    if (!_.isString(userId)) {
      throw "userId must be a string.";
    }
    if (!_.isBoolean(allowed)) {
      throw "allowed must be either true or false.";
    }
    var permissions = this.permissionsById[userId];
    if (!permissions) {
      if (!allowed) {
        // The user already doesn't have this permission, so no action needed.
        return;
      } else {
        permissions = {};
        this.permissionsById[userId] = permissions;
      }
    }

    if (allowed) {
      this.permissionsById[userId][accessType] = true;
    } else {
      delete permissions[accessType];
      if (_.isEmpty(permissions)) {
        delete permissions[userId];
      }
    }
  };

  Parse.ACL.prototype._getAccess = function (accessType, userId) {
    if (userId instanceof Parse.User) {
      userId = userId.id;
    } else if (userId instanceof Parse.Role) {
      userId = "role:" + userId.getName();
    }
    var permissions = this.permissionsById[userId];
    if (!permissions) {
      return false;
    }
    return permissions[accessType] ? true : false;
  };

  /**
   * Set whether the given user is allowed to read this object.
   * @param userId An instance of Parse.User or its objectId.
   * @param {Boolean} allowed Whether that user should have read access.
   */
  Parse.ACL.prototype.setReadAccess = function (userId, allowed) {
    this._setAccess("read", userId, allowed);
  };

  /**
   * Get whether the given user id is *explicitly* allowed to read this object.
   * Even if this returns false, the user may still be able to access it if
   * getPublicReadAccess returns true or a role that the user belongs to has
   * write access.
   * @param userId An instance of Parse.User or its objectId, or a Parse.Role.
   * @return {Boolean}
   */
  Parse.ACL.prototype.getReadAccess = function (userId) {
    return this._getAccess("read", userId);
  };

  /**
   * Set whether the given user id is allowed to write this object.
   * @param userId An instance of Parse.User or its objectId, or a Parse.Role..
   * @param {Boolean} allowed Whether that user should have write access.
   */
  Parse.ACL.prototype.setWriteAccess = function (userId, allowed) {
    this._setAccess("write", userId, allowed);
  };

  /**
   * Get whether the given user id is *explicitly* allowed to write this object.
   * Even if this returns false, the user may still be able to write it if
   * getPublicWriteAccess returns true or a role that the user belongs to has
   * write access.
   * @param userId An instance of Parse.User or its objectId, or a Parse.Role.
   * @return {Boolean}
   */
  Parse.ACL.prototype.getWriteAccess = function (userId) {
    return this._getAccess("write", userId);
  };

  /**
   * Set whether the public is allowed to read this object.
   * @param {Boolean} allowed
   */
  Parse.ACL.prototype.setPublicReadAccess = function (allowed) {
    this.setReadAccess(PUBLIC_KEY, allowed);
  };

  /**
   * Get whether the public is allowed to read this object.
   * @return {Boolean}
   */
  Parse.ACL.prototype.getPublicReadAccess = function () {
    return this.getReadAccess(PUBLIC_KEY);
  };

  /**
   * Set whether the public is allowed to write this object.
   * @param {Boolean} allowed
   */
  Parse.ACL.prototype.setPublicWriteAccess = function (allowed) {
    this.setWriteAccess(PUBLIC_KEY, allowed);
  };

  /**
   * Get whether the public is allowed to write this object.
   * @return {Boolean}
   */
  Parse.ACL.prototype.getPublicWriteAccess = function () {
    return this.getWriteAccess(PUBLIC_KEY);
  };

  /**
   * Get whether users belonging to the given role are allowed
   * to read this object. Even if this returns false, the role may
   * still be able to write it if a parent role has read access.
   *
   * @param role The name of the role, or a Parse.Role object.
   * @return {Boolean} true if the role has read access. false otherwise.
   * @throws {String} If role is neither a Parse.Role nor a String.
   */
  Parse.ACL.prototype.getRoleReadAccess = function (role) {
    if (role instanceof Parse.Role) {
      // Normalize to the String name
      role = role.getName();
    }
    if (_.isString(role)) {
      return this.getReadAccess("role:" + role);
    }
    throw "role must be a Parse.Role or a String";
  };

  /**
   * Get whether users belonging to the given role are allowed
   * to write this object. Even if this returns false, the role may
   * still be able to write it if a parent role has write access.
   *
   * @param role The name of the role, or a Parse.Role object.
   * @return {Boolean} true if the role has write access. false otherwise.
   * @throws {String} If role is neither a Parse.Role nor a String.
   */
  Parse.ACL.prototype.getRoleWriteAccess = function (role) {
    if (role instanceof Parse.Role) {
      // Normalize to the String name
      role = role.getName();
    }
    if (_.isString(role)) {
      return this.getWriteAccess("role:" + role);
    }
    throw "role must be a Parse.Role or a String";
  };

  /**
   * Set whether users belonging to the given role are allowed
   * to read this object.
   *
   * @param role The name of the role, or a Parse.Role object.
   * @param {Boolean} allowed Whether the given role can read this object.
   * @throws {String} If role is neither a Parse.Role nor a String.
   */
  Parse.ACL.prototype.setRoleReadAccess = function (role, allowed) {
    if (role instanceof Parse.Role) {
      // Normalize to the String name
      role = role.getName();
    }
    if (_.isString(role)) {
      this.setReadAccess("role:" + role, allowed);
      return;
    }
    throw "role must be a Parse.Role or a String";
  };

  /**
   * Set whether users belonging to the given role are allowed
   * to write this object.
   *
   * @param role The name of the role, or a Parse.Role object.
   * @param {Boolean} allowed Whether the given role can write this object.
   * @throws {String} If role is neither a Parse.Role nor a String.
   */
  Parse.ACL.prototype.setRoleWriteAccess = function (role, allowed) {
    if (role instanceof Parse.Role) {
      // Normalize to the String name
      role = role.getName();
    }
    if (_.isString(role)) {
      this.setWriteAccess("role:" + role, allowed);
      return;
    }
    throw "role must be a Parse.Role or a String";
  };
})(this);

(function (root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * @class
   * A Parse.Op is an atomic operation that can be applied to a field in a
   * Parse.Object. For example, calling <code>object.set("foo", "bar")</code>
   * is an example of a Parse.Op.Set. Calling <code>object.unset("foo")</code>
   * is a Parse.Op.Unset. These operations are stored in a Parse.Object and
   * sent to the server as part of <code>object.save()</code> operations.
   * Instances of Parse.Op should be immutable.
   *
   * You should not create subclasses of Parse.Op or instantiate Parse.Op
   * directly.
   */
  Parse.Op = function () {
    this._initialize.apply(this, arguments);
  };

  Parse.Op.prototype = {
    _initialize: function () {},
  };

  _.extend(Parse.Op, {
    /**
     * To create a new Op, call Parse.Op._extend();
     */
    _extend: Parse._extend,

    // A map of __op string to decoder function.
    _opDecoderMap: {},

    /**
     * Registers a function to convert a json object with an __op field into an
     * instance of a subclass of Parse.Op.
     */
    _registerDecoder: function (opName, decoder) {
      Parse.Op._opDecoderMap[opName] = decoder;
    },

    /**
     * Converts a json object into an instance of a subclass of Parse.Op.
     */
    _decode: function (json) {
      var decoder = Parse.Op._opDecoderMap[json.__op];
      if (decoder) {
        return decoder(json);
      } else {
        return undefined;
      }
    },
  });

  /*
   * Add a handler for Batch ops.
   */
  Parse.Op._registerDecoder("Batch", function (json) {
    var op = null;
    _.each(json.ops, function (nextOp) {
      nextOp = Parse.Op._decode(nextOp);
      op = nextOp._mergeWithPrevious(op);
    });
    return op;
  });

  /**
   * @class
   * A Set operation indicates that either the field was changed using
   * Parse.Object.set, or it is a mutable container that was detected as being
   * changed.
   */
  Parse.Op.Set = Parse.Op._extend(
    /** @lends Parse.Op.Set.prototype */ {
      _initialize: function (value) {
        this._value = value;
      },

      /**
       * Returns the new value of this field after the set.
       */
      value: function () {
        return this._value;
      },

      /**
       * Returns a JSON version of the operation suitable for sending to Parse.
       * @return {Object}
       */
      toJSON: function () {
        return Parse._encode(this.value());
      },

      _mergeWithPrevious: function (previous) {
        return this;
      },

      _estimate: function (oldValue) {
        return this.value();
      },
    }
  );

  /**
   * A sentinel value that is returned by Parse.Op.Unset._estimate to
   * indicate the field should be deleted. Basically, if you find _UNSET as a
   * value in your object, you should remove that key.
   */
  Parse.Op._UNSET = {};

  /**
   * @class
   * An Unset operation indicates that this field has been deleted from the
   * object.
   */
  Parse.Op.Unset = Parse.Op._extend(
    /** @lends Parse.Op.Unset.prototype */ {
      /**
       * Returns a JSON version of the operation suitable for sending to Parse.
       * @return {Object}
       */
      toJSON: function () {
        return { __op: "Delete" };
      },

      _mergeWithPrevious: function (previous) {
        return this;
      },

      _estimate: function (oldValue) {
        return Parse.Op._UNSET;
      },
    }
  );

  Parse.Op._registerDecoder("Delete", function (json) {
    return new Parse.Op.Unset();
  });

  /**
   * @class
   * An Increment is an atomic operation where the numeric value for the field
   * will be increased by a given amount.
   */
  Parse.Op.Increment = Parse.Op._extend(
    /** @lends Parse.Op.Increment.prototype */ {
      _initialize: function (amount) {
        this._amount = amount;
      },

      /**
       * Returns the amount to increment by.
       * @return {Number} the amount to increment by.
       */
      amount: function () {
        return this._amount;
      },

      /**
       * Returns a JSON version of the operation suitable for sending to Parse.
       * @return {Object}
       */
      toJSON: function () {
        return { __op: "Increment", amount: this._amount };
      },

      _mergeWithPrevious: function (previous) {
        if (!previous) {
          return this;
        } else if (previous instanceof Parse.Op.Unset) {
          return new Parse.Op.Set(this.amount());
        } else if (previous instanceof Parse.Op.Set) {
          return new Parse.Op.Set(previous.value() + this.amount());
        } else if (previous instanceof Parse.Op.Increment) {
          return new Parse.Op.Increment(this.amount() + previous.amount());
        } else {
          throw "Op is invalid after previous op.";
        }
      },

      _estimate: function (oldValue) {
        if (!oldValue) {
          return this.amount();
        }
        return oldValue + this.amount();
      },
    }
  );

  Parse.Op._registerDecoder("Increment", function (json) {
    return new Parse.Op.Increment(json.amount);
  });

  /**
   * @class
   * Add is an atomic operation where the given objects will be appended to the
   * array that is stored in this field.
   */
  Parse.Op.Add = Parse.Op._extend(
    /** @lends Parse.Op.Add.prototype */ {
      _initialize: function (objects) {
        this._objects = objects;
      },

      /**
       * Returns the objects to be added to the array.
       * @return {Array} The objects to be added to the array.
       */
      objects: function () {
        return this._objects;
      },

      /**
       * Returns a JSON version of the operation suitable for sending to Parse.
       * @return {Object}
       */
      toJSON: function () {
        return { __op: "Add", objects: Parse._encode(this.objects()) };
      },

      _mergeWithPrevious: function (previous) {
        if (!previous) {
          return this;
        } else if (previous instanceof Parse.Op.Unset) {
          return new Parse.Op.Set(this.objects());
        } else if (previous instanceof Parse.Op.Set) {
          return new Parse.Op.Set(this._estimate(previous.value()));
        } else if (previous instanceof Parse.Op.Add) {
          return new Parse.Op.Add(previous.objects().concat(this.objects()));
        } else {
          throw "Op is invalid after previous op.";
        }
      },

      _estimate: function (oldValue) {
        if (!oldValue) {
          return _.clone(this.objects());
        } else {
          return oldValue.concat(this.objects());
        }
      },
    }
  );

  Parse.Op._registerDecoder("Add", function (json) {
    return new Parse.Op.Add(Parse._decode(undefined, json.objects));
  });

  /**
   * @class
   * AddUnique is an atomic operation where the given items will be appended to
   * the array that is stored in this field only if they were not already
   * present in the array.
   */
  Parse.Op.AddUnique = Parse.Op._extend(
    /** @lends Parse.Op.AddUnique.prototype */ {
      _initialize: function (objects) {
        this._objects = _.uniq(objects);
      },

      /**
       * Returns the objects to be added to the array.
       * @return {Array} The objects to be added to the array.
       */
      objects: function () {
        return this._objects;
      },

      /**
       * Returns a JSON version of the operation suitable for sending to Parse.
       * @return {Object}
       */
      toJSON: function () {
        return { __op: "AddUnique", objects: Parse._encode(this.objects()) };
      },

      _mergeWithPrevious: function (previous) {
        if (!previous) {
          return this;
        } else if (previous instanceof Parse.Op.Unset) {
          return new Parse.Op.Set(this.objects());
        } else if (previous instanceof Parse.Op.Set) {
          return new Parse.Op.Set(this._estimate(previous.value()));
        } else if (previous instanceof Parse.Op.AddUnique) {
          return new Parse.Op.AddUnique(
            _.union(previous.objects(), this.objects())
          );
        } else {
          throw "Op is invalid after previous op.";
        }
      },

      _estimate: function (oldValue) {
        if (!oldValue) {
          return _.clone(this.objects());
        } else {
          return oldValue.concat(_.difference(this.objects(), oldValue));
        }
      },
    }
  );

  Parse.Op._registerDecoder("AddUnique", function (json) {
    return new Parse.Op.AddUnique(Parse._decode(undefined, json.objects));
  });

  /**
   * @class
   * Remove is an atomic operation where the given objects will be removed from
   * the array that is stored in this field.
   */
  Parse.Op.Remove = Parse.Op._extend(
    /** @lends Parse.Op.Remove.prototype */ {
      _initialize: function (objects) {
        this._objects = _.uniq(objects);
      },

      /**
       * Returns the objects to be removed from the array.
       * @return {Array} The objects to be removed from the array.
       */
      objects: function () {
        return this._objects;
      },

      /**
       * Returns a JSON version of the operation suitable for sending to Parse.
       * @return {Object}
       */
      toJSON: function () {
        return { __op: "Remove", objects: Parse._encode(this.objects()) };
      },

      _mergeWithPrevious: function (previous) {
        if (!previous) {
          return this;
        } else if (previous instanceof Parse.Op.Unset) {
          return previous;
        } else if (previous instanceof Parse.Op.Set) {
          return new Parse.Op.Set(this._estimate(previous.value()));
        } else if (previous instanceof Parse.Op.Remove) {
          return new Parse.Op.Remove(
            _.union(previous.objects(), this.objects())
          );
        } else {
          throw "Op is invalid after previous op.";
        }
      },

      _estimate: function (oldValue) {
        if (!oldValue) {
          return [];
        } else {
          var newValue = _.difference(oldValue, this.objects());
          // If there are saved Parse Objects being removed, also remove them.
          _.each(this.objects(), function (obj) {
            if (obj instanceof Parse.Object && obj.id) {
              newValue = _.reject(newValue, function (other) {
                return other instanceof Parse.Object && other.id === obj.id;
              });
            }
          });
          return newValue;
        }
      },
    }
  );

  Parse.Op._registerDecoder("Remove", function (json) {
    return new Parse.Op.Remove(Parse._decode(undefined, json.objects));
  });

  /**
   * @class
   * A Relation operation indicates that the field is an instance of
   * Parse.Relation, and objects are being added to, or removed from, that
   * relation.
   */
  Parse.Op.Relation = Parse.Op._extend(
    /** @lends Parse.Op.Relation.prototype */ {
      _initialize: function (adds, removes) {
        this._targetClassName = null;

        var self = this;

        var pointerToId = function (object) {
          if (object instanceof Parse.Object) {
            if (!object.id) {
              throw "You can't add an unsaved Parse.Object to a relation.";
            }
            if (!self._targetClassName) {
              self._targetClassName = object.className;
            }
            if (self._targetClassName !== object.className) {
              throw (
                "Tried to create a Parse.Relation with 2 different types: " +
                self._targetClassName +
                " and " +
                object.className +
                "."
              );
            }
            return object.id;
          }
          return object;
        };

        this.relationsToAdd = _.uniq(_.map(adds, pointerToId));
        this.relationsToRemove = _.uniq(_.map(removes, pointerToId));
      },

      /**
       * Returns an array of unfetched Parse.Object that are being added to the
       * relation.
       * @return {Array}
       */
      added: function () {
        var self = this;
        return _.map(this.relationsToAdd, function (objectId) {
          var object = Parse.Object._create(self._targetClassName);
          object.id = objectId;
          return object;
        });
      },

      /**
       * Returns an array of unfetched Parse.Object that are being removed from
       * the relation.
       * @return {Array}
       */
      removed: function () {
        var self = this;
        return _.map(this.relationsToRemove, function (objectId) {
          var object = Parse.Object._create(self._targetClassName);
          object.id = objectId;
          return object;
        });
      },

      /**
       * Returns a JSON version of the operation suitable for sending to Parse.
       * @return {Object}
       */
      toJSON: function () {
        var adds = null;
        var removes = null;
        var self = this;
        var idToPointer = function (id) {
          return {
            __type: "Pointer",
            className: self._targetClassName,
            objectId: id,
          };
        };
        var pointers = null;
        if (this.relationsToAdd.length > 0) {
          pointers = _.map(this.relationsToAdd, idToPointer);
          adds = { __op: "AddRelation", objects: pointers };
        }

        if (this.relationsToRemove.length > 0) {
          pointers = _.map(this.relationsToRemove, idToPointer);
          removes = { __op: "RemoveRelation", objects: pointers };
        }

        if (adds && removes) {
          return { __op: "Batch", ops: [adds, removes] };
        }

        return adds || removes || {};
      },

      _mergeWithPrevious: function (previous) {
        if (!previous) {
          return this;
        } else if (previous instanceof Parse.Op.Unset) {
          throw "You can't modify a relation after deleting it.";
        } else if (previous instanceof Parse.Op.Relation) {
          if (
            previous._targetClassName &&
            previous._targetClassName !== this._targetClassName
          ) {
            throw (
              "Related object must be of class " +
              previous._targetClassName +
              ", but " +
              this._targetClassName +
              " was passed in."
            );
          }
          var newAdd = _.union(
            _.difference(previous.relationsToAdd, this.relationsToRemove),
            this.relationsToAdd
          );
          var newRemove = _.union(
            _.difference(previous.relationsToRemove, this.relationsToAdd),
            this.relationsToRemove
          );

          var newRelation = new Parse.Op.Relation(newAdd, newRemove);
          newRelation._targetClassName = this._targetClassName;
          return newRelation;
        } else {
          throw "Op is invalid after previous op.";
        }
      },

      _estimate: function (oldValue, object, key) {
        if (!oldValue) {
          var relation = new Parse.Relation(object, key);
          relation.targetClassName = this._targetClassName;
        } else if (oldValue instanceof Parse.Relation) {
          if (this._targetClassName) {
            if (oldValue.targetClassName) {
              if (oldValue.targetClassName !== this._targetClassName) {
                throw (
                  "Related object must be a " +
                  oldValue.targetClassName +
                  ", but a " +
                  this._targetClassName +
                  " was passed in."
                );
              }
            } else {
              oldValue.targetClassName = this._targetClassName;
            }
          }
          return oldValue;
        } else {
          throw "Op is invalid after previous op.";
        }
      },
    }
  );

  Parse.Op._registerDecoder("AddRelation", function (json) {
    return new Parse.Op.Relation(Parse._decode(undefined, json.objects), []);
  });
  Parse.Op._registerDecoder("RemoveRelation", function (json) {
    return new Parse.Op.Relation([], Parse._decode(undefined, json.objects));
  });
})(this);

(function (root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Creates a new Relation for the given parent object and key. This
   * constructor should rarely be used directly, but rather created by
   * Parse.Object.relation.
   * @param {Parse.Object} parent The parent of this relation.
   * @param {String} key The key for this relation on the parent.
   * @see Parse.Object#relation
   * @class
   *
   * <p>
   * A class that is used to access all of the children of a many-to-many
   * relationship.  Each instance of Parse.Relation is associated with a
   * particular parent object and key.
   * </p>
   */
  Parse.Relation = function (parent, key) {
    this.parent = parent;
    this.key = key;
    this.targetClassName = null;
  };

  Parse.Relation.prototype = {
    /**
     * Makes sure that this relation has the right parent and key.
     */
    _ensureParentAndKey: function (parent, key) {
      this.parent = this.parent || parent;
      this.key = this.key || key;
      if (this.parent !== parent) {
        throw "Internal Error. Relation retrieved from two different Objects.";
      }
      if (this.key !== key) {
        throw "Internal Error. Relation retrieved from two different keys.";
      }
    },

    /**
     * Adds a Parse.Object or an array of Parse.Objects to the relation.
     * @param {} objects The item or items to add.
     */
    add: function (objects) {
      if (!_.isArray(objects)) {
        objects = [objects];
      }

      var change = new Parse.Op.Relation(objects, []);
      this.parent.set(this.key, change);
      this.targetClassName = change._targetClassName;
    },

    /**
     * Removes a Parse.Object or an array of Parse.Objects from this relation.
     * @param {} objects The item or items to remove.
     */
    remove: function (objects) {
      if (!_.isArray(objects)) {
        objects = [objects];
      }

      var change = new Parse.Op.Relation([], objects);
      this.parent.set(this.key, change);
      this.targetClassName = change._targetClassName;
    },

    /**
     * Returns a JSON version of the object suitable for saving to disk.
     * @return {Object}
     */
    toJSON: function () {
      return { __type: "Relation", className: this.targetClassName };
    },

    /**
     * Returns a Parse.Query that is limited to objects in this
     * relation.
     * @return {Parse.Query}
     */
    query: function () {
      var targetClass;
      var query;
      if (!this.targetClassName) {
        targetClass = Parse.Object._getSubclass(this.parent.className);
        query = new Parse.Query(targetClass);
        query._extraOptions.redirectClassNameForKey = this.key;
      } else {
        targetClass = Parse.Object._getSubclass(this.targetClassName);
        query = new Parse.Query(targetClass);
      }
      query._addCondition("$relatedTo", "object", this.parent._toPointer());
      query._addCondition("$relatedTo", "key", this.key);

      return query;
    },
  };
})(this);

(function (root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * A Promise is returned by async methods as a hook to provide callbacks to be
   * called when the async task is fulfilled.
   *
   * <p>Typical usage would be like:<pre>
   *    query.findAsync().then(function(results) {
   *      results[0].set("foo", "bar");
   *      return results[0].saveAsync();
   *    }).then(function(result) {
   *      console.log("Updated " + result.id);
   *    });
   * </pre></p>
   *
   * @see Parse.Promise.prototype.next
   * @class
   */
  Parse.Promise = function () {
    this._resolved = false;
    this._rejected = false;
    this._resolvedCallbacks = [];
    this._rejectedCallbacks = [];
  };

  _.extend(
    Parse.Promise,
    /** @lends Parse.Promise */ {
      /**
       * Returns true iff the given object fulfils the Promise interface.
       * @return {Boolean}
       */
      is: function (promise) {
        return promise && promise.then && _.isFunction(promise.then);
      },

      /**
       * Returns a new promise that is resolved with a given value.
       * @return {Parse.Promise} the new promise.
       */
      as: function () {
        var promise = new Parse.Promise();
        promise.resolve.apply(promise, arguments);
        return promise;
      },

      /**
       * Returns a new promise that is rejected with a given error.
       * @return {Parse.Promise} the new promise.
       */
      error: function () {
        var promise = new Parse.Promise();
        promise.reject.apply(promise, arguments);
        return promise;
      },

      /**
       * Returns a new promise that is fulfilled when all of the input promises
       * are resolved. If any promise in the list fails, then the returned promise
       * will fail with the last error. If they all succeed, then the returned
       * promise will succeed, with the result being an array with the results of
       * all the input promises.
       * @param {Array} promises a list of promises to wait for.
       * @return {Parse.Promise} the new promise
       */
      when: function (promises) {
        // Allow passing in Promises as separate arguments instead of an Array.
        var objects;
        if (promises && Parse._isNullOrUndefined(promises.length)) {
          objects = arguments;
        } else {
          objects = promises;
        }

        var total = objects.length;
        var hadError = false;
        var results = [];
        var errors = [];
        results.length = objects.length;
        errors.length = objects.length;

        if (total === 0) {
          return Parse.Promise.as.apply(this, results);
        }

        var promise = new Parse.Promise();

        var resolveOne = function () {
          total = total - 1;
          if (total === 0) {
            if (hadError) {
              promise.reject(errors);
            } else {
              promise.resolve.apply(promise, results);
            }
          }
        };

        _.each(objects, function (object, i) {
          if (Parse.Promise.is(object)) {
            object.then(
              function (result) {
                results[i] = result;
                resolveOne();
              },
              function (error) {
                errors[i] = error;
                hadError = true;
                resolveOne();
              }
            );
          } else {
            results[i] = object;
            resolveOne();
          }
        });

        return promise;
      },
    }
  );

  _.extend(
    Parse.Promise.prototype,
    /** @lends Parse.Promise.prototype */ {
      /**
       * Marks this promise as fulfilled, firing any callbacks waiting on it.
       * @param {Object} result the result to pass to the callbacks.
       */
      resolve: function (result) {
        if (this._resolved || this._rejected) {
          throw (
            "A promise was resolved even though it had already been " +
            (this._resolved ? "resolved" : "rejected") +
            "."
          );
        }
        this._resolved = true;
        this._result = arguments;
        var results = arguments;
        _.each(this._resolvedCallbacks, function (resolvedCallback) {
          resolvedCallback.apply(this, results);
        });
      },

      /**
       * Marks this promise as fulfilled, firing any callbacks waiting on it.
       * @param {Object} error the error to pass to the callbacks.
       */
      reject: function (error) {
        if (this._resolved || this._rejected) {
          throw (
            "A promise was rejected even though it had already been " +
            (this._resolved ? "resolved" : "rejected") +
            "."
          );
        }
        this._rejected = true;
        this._error = error;
        _.each(this._rejectedCallbacks, function (rejectedCallback) {
          rejectedCallback(error);
        });
      },

      /**
       * Adds callbacks to be called when this promise is fulfilled. Returns a new
       * Promise that will be fulfilled when the callback is complete. It allows
       * chaining. If the callback itself returns a Promise, then the one returned
       * by "then" will not be fulfilled until that one returned by the callback
       * is fulfilled.
       * @param {Function} resolvedCallback Function that is called when this
       * Promise is resolved. Once the callback is complete, then the Promise
       * returned by "then" will also be fulfilled.
       * @param {Function} rejectedCallback Function that is called when this
       * Promise is rejected with an error. Once the callback is complete, then
       * the promise returned by "then" with be resolved successfully. If
       * rejectedCallback is null, or it returns a rejected Promise, then the
       * Promise returned by "then" will be rejected with that error.
       * @return {Parse.Promise} A new Promise that will be fulfilled after this
       * Promise is fulfilled and either callback has completed. If the callback
       * returned a Promise, then this Promise will not be fulfilled until that
       * one is.
       */
      then: function (resolvedCallback, rejectedCallback) {
        var promise = new Parse.Promise();

        var wrappedResolvedCallback = function () {
          var result = arguments;
          if (resolvedCallback) {
            result = [resolvedCallback.apply(this, result)];
          }
          if (result.length === 1 && Parse.Promise.is(result[0])) {
            result[0].then(
              function () {
                promise.resolve.apply(promise, arguments);
              },
              function (error) {
                promise.reject(error);
              }
            );
          } else {
            promise.resolve.apply(promise, result);
          }
        };

        var wrappedRejectedCallback = function (error) {
          var result = [];
          if (rejectedCallback) {
            result = [rejectedCallback(error)];
            if (result.length === 1 && Parse.Promise.is(result[0])) {
              result[0].then(
                function () {
                  promise.resolve.apply(promise, arguments);
                },
                function (error) {
                  promise.reject(error);
                }
              );
            } else {
              // A Promises/A+ compliant implementation would call:
              // promise.resolve.apply(promise, result);
              promise.reject(result[0]);
            }
          } else {
            promise.reject(error);
          }
        };

        if (this._resolved) {
          wrappedResolvedCallback.apply(this, this._result);
        } else if (this._rejected) {
          wrappedRejectedCallback(this._error);
        } else {
          this._resolvedCallbacks.push(wrappedResolvedCallback);
          this._rejectedCallbacks.push(wrappedRejectedCallback);
        }

        return promise;
      },
    }
  );
})(this);

// Parse.Object is analogous to the Java ParseObject.
// It also implements the same interface as a Backbone model.

(function (root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Creates a new model with defined attributes. A client id (cid) is
   * automatically generated and assigned for you.
   *
   * <p>You won't normally call this method directly.  It is recommended that
   * you use a subclass of <code>Parse.Object</code> instead, created by calling
   * <code>extend</code>.</p>
   *
   * <p>However, if you don't want to use a subclass, or aren't sure which
   * subclass is appropriate, you can use this form:<pre>
   *     var object = new Parse.Object("ClassName");
   * </pre>
   * That is basically equivalent to:<pre>
   *     var MyClass = Parse.Object.extend("ClassName");
   *     var object = new MyClass();
   * </pre></p>
   *
   * @param {Object} attributes The initial set of data to store in the object.
   * @param {Object} options A set of Backbone-like options for creating the
   *     object.  The only option currently supported is "collection".
   * @see Parse.Object.extend
   *
   * @class
   *
   * <p>The fundamental unit of Parse data, which implements the Backbone Model
   * interface.</p>
   */
  Parse.Object = function (attributes, options) {
    // Allow new Parse.Object("ClassName") as a shortcut to _create.
    if (_.isString(attributes)) {
      return Parse.Object._create.apply(this, arguments);
    }

    attributes = attributes || {};
    if (options && options.parse) {
      attributes = this.parse(attributes);
    }
    var defaults = Parse._getValue(this, "defaults");
    if (defaults) {
      attributes = _.extend({}, defaults, attributes);
    }
    if (options && options.collection) {
      this.collection = options.collection;
    }

    this._serverData = {}; // The last known data for this object from cloud.
    this._opSetQueue = [{}]; // List of sets of changes to the data.
    this.attributes = {}; // The best estimate of this's current data.

    this._hashedJSON = {}; // Hash of values of containers at last save.
    this._escapedAttributes = {};
    this.cid = _.uniqueId("c");
    this.changed = {};
    this._silent = {};
    this._pending = {};
    if (!this.set(attributes, { silent: true })) {
      throw new Error("Can't create an invalid Parse.Object");
    }
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this._hasData = true;
    this._previousAttributes = _.clone(this.attributes);
    this.initialize.apply(this, arguments);
  };

  /**
   * @lends Parse.Object.prototype
   * @property {String} id The objectId of the Parse Object.
   */

  /**
   * Internal function for saveAll.  This calls func on every item in list,
   * and adds the results to results.  When it's done, optionsOrCallback is
   * called with the accumulated results.  See saveAll for more info.
   *
   * @param list - A list of Parse.Object.
   * @param func - function(Parse.Object, callback);
   * @param optionsOrCallback - See saveAll.
   */
  var _doAll = function (list, func, optionsOrCallback) {
    var options;
    if (_.isFunction(optionsOrCallback)) {
      var callback = optionsOrCallback;
      options = {
        success: function (list) {
          callback(list, null);
        },
        error: function (e) {
          callback(null, e);
        },
      };
    } else {
      options = optionsOrCallback;
    }
    options = options || {};

    var results = [];
    var promise = new Parse.Promise.as();
    _.each(list, function (item) {
      promise = promise
        .then(function () {
          return func(item);
        })
        .then(function (result) {
          results.push(result);
        });
    });

    promise = promise.then(
      function () {
        if (options.success) {
          options.success(results);
        }
      },
      function (error) {
        if (options.error) {
          options.error(error);
        }
        return Parse.Promise.error(error);
      }
    );

    return promise;
  };

  /**
   * Saves the given list of Parse.Object.
   * If any error is encountered, stops and calls the error handler.
   * There are two ways you can call this function.
   *
   * The Backbone way:<pre>
   *   Parse.Object.saveAll([object1, object2, ...], {
   *     success: function(list) {
   *       // All the objects were saved.
   *     },
   *     error: function(error) {
   *       // An error occurred while saving one of the objects.
   *     },
   *   });
   * </pre>
   * A simplified syntax:<pre>
   *   Parse.Object.saveAll([object1, object2, ...], function(list, error) {
   *     if (list) {
   *       // All the objects were saved.
   *     } else {
   *       // An error occurred.
   *     }
   *   });
   * </pre>
   *
   * @param {Array} list A list of <code>Parse.Object</code>.
   * @param {Object} optionsOrCallback A Backbone-style callback object.
   */
  Parse.Object.saveAll = function (list, optionsOrCallback) {
    return _doAll(
      list,
      function (obj, options) {
        return obj.save(null, options);
      },
      optionsOrCallback
    );
  };

  Parse.Object._signUpAll = function (list, optionsOrCallback) {
    return _doAll(
      list,
      function (obj, options) {
        return obj.signUp(null, options);
      },
      optionsOrCallback
    );
  };

  // Attach all inheritable methods to the Parse.Object prototype.
  _.extend(
    Parse.Object.prototype,
    Parse.Events,
    /** @lends Parse.Object.prototype */ {
      _existed: false,

      /**
       * Initialize is an empty function by default. Override it with your own
       * initialization logic.
       */
      initialize: function () {},

      /**
       * Returns a JSON version of the object suitable for saving to Parse.
       * @return {Object}
       */
      toJSON: function () {
        var json = this._toFullJSON();
        _.each(["__type", "className"], function (key) {
          delete json[key];
        });
        return json;
      },

      _toFullJSON: function (seenObjects) {
        var json = _.clone(this.attributes);
        Parse._each(json, function (val, key) {
          json[key] = Parse._encode(val, seenObjects);
        });
        Parse._each(this._operations, function (val, key) {
          json[key] = val;
        });

        if (_.has(this, "id")) {
          json.objectId = this.id;
        }
        if (_.has(this, "createdAt")) {
          if (_.isDate(this.createdAt)) {
            json.createdAt = this.createdAt.toJSON();
          } else {
            json.createdAt = this.createdAt;
          }
        }

        if (_.has(this, "updatedAt")) {
          if (_.isDate(this.updatedAt)) {
            json.updatedAt = this.updatedAt.toJSON();
          } else {
            json.updatedAt = this.updatedAt;
          }
        }
        json.__type = "Object";
        json.className = this.className;
        return json;
      },

      /**
       * Updates _hashedJSON to reflect the current state of this object.
       * Adds any changed hash values to the set of pending changes.
       */
      _refreshCache: function () {
        var self = this;
        Parse._each(this.attributes, function (value, key) {
          if (value instanceof Parse.Object) {
            value._refreshCache();
          } else if (_.isObject(value)) {
            if (self._resetCacheForKey(key)) {
              self.set(key, new Parse.Op.Set(value), { silent: true });
            }
          }
        });
      },

      /**
       * Returns true if this object has been modified since its last
       * save/refresh.  If an attribute is specified, it returns true only if that
       * particular attribute has been modified since the last save/refresh.
       * @param {String} attr An attribute name (optional).
       * @return {Boolean}
       */
      dirty: function (attr) {
        this._refreshCache();

        var currentChanges = _.last(this._opSetQueue);

        if (attr) {
          return currentChanges[attr] ? true : false;
        }
        if (!this.id) {
          return true;
        }
        if (_.keys(currentChanges).length > 0) {
          return true;
        }
        return false;
      },

      /**
       * Gets a Pointer referencing this Object.
       */
      _toPointer: function () {
        if (!this.id) {
          throw new Error("Can't serialize an unsaved Parse.Object");
        }
        return {
          __type: "Pointer",
          className: this.className,
          objectId: this.id,
        };
      },

      /**
       * Gets the value of an attribute.
       * @param {String} attr The string name of an attribute.
       */
      get: function (attr) {
        return this.attributes[attr];
      },

      /**
       * Gets a relation on the given class for the attribute.
       * @param String attr The attribute to get the relation for.
       */
      relation: function (attr) {
        var value = this.get(attr);
        if (value) {
          if (!(value instanceof Parse.Relation)) {
            throw "Called relation() on non-relation field " + attr;
          }
          value._ensureParentAndKey(this, attr);
          return value;
        } else {
          return new Parse.Relation(this, attr);
        }
      },

      /**
       * Gets the HTML-escaped value of an attribute.
       */
      escape: function (attr) {
        var html = this._escapedAttributes[attr];
        if (html) {
          return html;
        }
        var val = this.attributes[attr];
        var escaped;
        if (Parse._isNullOrUndefined(val)) {
          escaped = "";
        } else {
          escaped = _.escape(val.toString());
        }
        this._escapedAttributes[attr] = escaped;
        return escaped;
      },

      /**
       * Returns <code>true</code> if the attribute contains a value that is not
       * null or undefined.
       * @param {String} attr The string name of the attribute.
       * @return {Boolean}
       */
      has: function (attr) {
        return !Parse._isNullOrUndefined(this.attributes[attr]);
      },

      /**
       * Pulls "special" fields like objectId, createdAt, etc. out of attrs
       * and puts them on "this" directly.  Removes them from attrs.
       * @param attrs - A dictionary with the data for this Parse.Object.
       */
      _mergeMagicFields: function (attrs) {
        // Check for changes of magic fields.
        var model = this;
        _.each(["id", "objectId", "createdAt", "updatedAt"], function (attr) {
          if (attrs[attr]) {
            if (attr === "objectId") {
              model.id = attrs[attr];
            } else if (
              (attr === "createdAt" || attr === "updatedAt") &&
              !_.isDate(attrs[attr])
            ) {
              model[attr] = Parse._parseDate(attrs[attr]);
            } else {
              model[attr] = attrs[attr];
            }
            delete attrs[attr];
          }
        });
      },

      /**
       * Returns the json to be sent to the server.
       */
      _startSave: function () {
        this._opSetQueue.push({});
      },

      /**
       * If any save has been started since the current one running, process the
       * next one in the queue.
       */
      _processSaveQueue: function () {
        if (this._saveQueue && this._saveQueue.length > 0) {
          var nextSave = _.first(this._saveQueue);
          this._saveQueue = _.rest(this._saveQueue);
          nextSave();
        } else {
          this._saving = false;
        }
      },

      /**
       * Called when a save fails because of an error. Any changes that were part
       * of the save need to be merged with changes made after the save. This
       * might throw an exception is you do conflicting operations. For example,
       * if you do:
       *   object.set("foo", "bar");
       *   object.set("invalid field name", "baz");
       *   object.save();
       *   object.increment("foo");
       * then this will throw when the save fails and the client tries to merge
       * "bar" with the +1.
       */
      _cancelSave: function () {
        var self = this;
        var failedChanges = _.first(this._opSetQueue);
        this._opSetQueue = _.rest(this._opSetQueue);
        var nextChanges = _.first(this._opSetQueue);
        Parse._each(failedChanges, function (op, key) {
          var op1 = failedChanges[key];
          var op2 = nextChanges[key];
          if (op1 && op2) {
            nextChanges[key] = op2._mergeWithPrevious(op1);
          } else if (op1) {
            nextChanges[key] = op1;
          }
        });
        this._processSaveQueue();
      },

      /**
       * Called when a save completes successfully. This merges the changes that
       * were saved into the known server data, and overrides it with any data
       * sent directly from the server.
       */
      _finishSave: function (serverData) {
        var savedChanges = _.first(this._opSetQueue);
        this._opSetQueue = _.rest(this._opSetQueue);
        this._applyOpSet(savedChanges, this._serverData);
        this._mergeMagicFields(serverData);
        var self = this;
        Parse._each(serverData, function (value, key) {
          self._serverData[key] = Parse._decode(key, value);
        });
        this._rebuildAllEstimatedData();
        this._processSaveQueue();
      },

      /**
       * Called when a fetch or login is complete to set the known server data to
       * the given object.
       */
      _finishFetch: function (serverData, hasData) {
        // Clear out any changes the user might have made previously.
        this._opSetQueue = [{}];

        // Bring in all the new server data.
        this._mergeMagicFields(serverData);
        var self = this;
        Parse._each(serverData, function (value, key) {
          self._serverData[key] = Parse._decode(key, value);
        });

        // Refresh the attributes.
        this._rebuildAllEstimatedData();

        // Clear out the cache of mutable containers.
        this._refreshCache();
        this._opSetQueue = [{}];

        this._hasData = hasData;
      },

      /**
       * Applies the set of Parse.Op in opSet to the object target.
       */
      _applyOpSet: function (opSet, target) {
        var self = this;
        Parse._.each(opSet, function (change, key) {
          target[key] = change._estimate(target[key], self, key);
          if (target[key] === Parse.Op._UNSET) {
            delete target[key];
          }
        });
      },

      /**
       * Replaces the cached value for key with the current value.
       * Returns true if the new value is different than the old value.
       */
      _resetCacheForKey: function (key) {
        var value = this.attributes[key];
        if (_.isObject(value) && !(value instanceof Parse.Object)) {
          value = value.toJSON ? value.toJSON() : value;
          var json = JSON.stringify(value);
          if (this._hashedJSON[key] !== json) {
            this._hashedJSON[key] = json;
            return true;
          }
        }
        return false;
      },

      /**
       * Populates attributes[key] by starting with the last known data from the
       * server, and applying all of the local changes that have been made to that
       * key since then.
       */
      _rebuildEstimatedDataForKey: function (key) {
        var self = this;
        delete this.attributes[key];
        if (this._serverData[key]) {
          this.attributes[key] = this._serverData[key];
        }
        _.each(this._opSetQueue, function (opSet) {
          var op = opSet[key];
          if (op) {
            self.attributes[key] = op._estimate(
              self.attributes[key],
              self,
              key
            );
            if (self.attributes[key] === Parse.Op._UNSET) {
              delete self.attributes[key];
            } else {
              self._resetCacheForKey(key);
            }
          }
        });
      },

      /**
       * Populates attributes by starting with the last known data from the
       * server, and applying all of the local changes that have been made since
       * then.
       */
      _rebuildAllEstimatedData: function () {
        var self = this;

        var previousAttributes = _.clone(this.attributes);

        this.attributes = _.clone(this._serverData);
        _.each(this._opSetQueue, function (opSet) {
          self._applyOpSet(opSet, self.attributes);
          _.each(opSet, function (op, key) {
            self._resetCacheForKey(key);
          });
        });

        // Trigger change events for anything that changed because of the fetch.
        _.each(previousAttributes, function (oldValue, key) {
          if (self.attributes[key] !== oldValue) {
            self.trigger("change:" + key, self, self.attributes[key], {});
          }
        });
        _.each(this.attributes, function (newValue, key) {
          if (!_.has(previousAttributes, key)) {
            self.trigger("change:" + key, self, newValue, {});
          }
        });
      },

      /**
       * Sets a hash of model attributes on the object, firing
       * <code>"change"</code> unless you choose to silence it.
       *
       * <p>You can call it with an object containing keys and values, or with one
       * key and value.  For example:<pre>
       *   gameTurn.set({
       *     player: player1,
       *     diceRoll: 2
       *   }, {
       *     error: function(gameTurnAgain, error) {
       *       // The set failed validation.
       *     }
       *   });
       *
       *   game.set("currentPlayer", player2, {
       *     error: function(gameTurnAgain, error) {
       *       // The set failed validation.
       *     }
       *   });
       *
       *   game.set("finished", true);</pre></p>
       *
       * @param {String} key The key to set.
       * @param {} value The value to give it.
       * @param {Object} options A set of Backbone-like options for the set.
       *     The only supported options are <code>silent</code>,
       *     <code>error</code>, and <code>promise</code>.
       * @return {Boolean} true if the set succeeded.
       * @see Parse.Object#validate
       * @see Parse.Error
       */
      set: function (key, value, options) {
        var attrs, attr;
        if (_.isObject(key) || Parse._isNullOrUndefined(key)) {
          attrs = key;
          Parse._each(attrs, function (v, k) {
            attrs[k] = Parse._decode(k, v);
          });
          options = value;
        } else {
          attrs = {};
          attrs[key] = Parse._decode(key, value);
        }

        // Extract attributes and options.
        options = options || {};
        if (!attrs) {
          return this;
        }
        if (attrs instanceof Parse.Object) {
          attrs = attrs.attributes;
        }

        // If the unset option is used, every attribute should be a Unset.
        if (options.unset) {
          Parse._each(attrs, function (unused_value, key) {
            attrs[key] = new Parse.Op.Unset();
          });
        }

        // Apply all the attributes to get the estimated values.
        var dataToValidate = _.clone(attrs);
        var self = this;
        Parse._each(dataToValidate, function (value, key) {
          if (value instanceof Parse.Op) {
            dataToValidate[key] = value._estimate(
              self.attributes[key],
              self,
              key
            );
            if (dataToValidate[key] === Parse.Op._UNSET) {
              delete dataToValidate[key];
            }
          }
        });

        // Run validation.
        if (!this._validate(attrs, options)) {
          return false;
        }

        this._mergeMagicFields(attrs);

        options.changes = {};
        var escaped = this._escapedAttributes;
        var prev = this._previousAttributes || {};

        // Update attributes.
        Parse._each(_.keys(attrs), function (attr) {
          var val = attrs[attr];

          // If this is a relation object we need to set the parent correctly,
          // since the location where it was parsed does not have access to
          // this object.
          if (val instanceof Parse.Relation) {
            val.parent = self;
          }

          if (!(val instanceof Parse.Op)) {
            val = new Parse.Op.Set(val);
          }

          // See if this change will actually have any effect.
          var isRealChange = true;
          if (
            val instanceof Parse.Op.Set &&
            _.isEqual(self.attributes[attr], val.value)
          ) {
            isRealChange = false;
          }

          if (isRealChange) {
            delete escaped[attr];
            if (options.silent) {
              self._silent[attr] = true;
            } else {
              options.changes[attr] = true;
            }
          }

          var currentChanges = _.last(self._opSetQueue);
          currentChanges[attr] = val._mergeWithPrevious(currentChanges[attr]);
          self._rebuildEstimatedDataForKey(attr);

          if (isRealChange) {
            self.changed[attr] = self.attributes[attr];
            if (!options.silent) {
              self._pending[attr] = true;
            }
          } else {
            delete self.changed[attr];
            delete self._pending[attr];
          }
        });

        if (!options.silent) {
          this.change(options);
        }
        return this;
      },

      /**
       * Remove an attribute from the model, firing <code>"change"</code> unless
       * you choose to silence it. This is a noop if the attribute doesn't
       * exist.
       */
      unset: function (attr, options) {
        options = options || {};
        options.unset = true;
        return this.set(attr, null, options);
      },

      /**
       * Atomically increments the value of the given attribute the next time the
       * object is saved. If no amount is specified, 1 is used by default.
       *
       * @param attr {String} The key.
       * @param amount {Number} The amount to increment by.
       */
      increment: function (attr, amount) {
        if (_.isUndefined(amount) || _.isNull(amount)) {
          amount = 1;
        }
        return this.set(attr, new Parse.Op.Increment(amount));
      },

      /**
       * Atomically add an object to the end of the array associated with a given
       * key.
       * @param attr {String} The key.
       * @param item {} The item to add.
       */
      add: function (attr, item) {
        return this.set(attr, new Parse.Op.Add([item]));
      },

      /**
       * Atomically add an object to the array associated with a given key, only
       * if it is not already present in the array. The position of the insert is
       * not guaranteed.
       *
       * @param attr {String} The key.
       * @param item {} The object to add.
       */
      addUnique: function (attr, item) {
        return this.set(attr, new Parse.Op.AddUnique([item]));
      },

      /**
       * Atomically remove all instances of an object from the array associated
       * with a given key.
       *
       * @param attr {String} The key.
       * @param item {} The object to remove.
       */
      remove: function (attr, item) {
        return this.set(attr, new Parse.Op.Remove([item]));
      },

      /**
       * Returns an instance of a subclass of Parse.Op describing what kind of
       * modification has been performed on this field since the last time it was
       * saved. For example, after calling object.increment("x"), calling
       * object.op("x") would return an instance of Parse.Op.Increment.
       *
       * @param attr {String} The key.
       * @returns {Parse.Op} The operation, or undefined if none.
       */
      op: function (attr) {
        return _.last(this._opSetQueue)[attr];
      },

      /**
       * Clear all attributes on the model, firing <code>"change"</code> unless
       * you choose to silence it.
       */
      clear: function (options) {
        options = options || {};
        options.unset = true;
        var keysToClear = _.extend(this.attributes, this._operations);
        return this.set(keysToClear, options);
      },

      /**
       * Returns a JSON-encoded set of operations to be sent with the next save
       * request.
       */
      _getSaveJSON: function () {
        var json = _.clone(_.first(this._opSetQueue));
        Parse._each(json, function (op, key) {
          json[key] = op.toJSON();
        });
        return json;
      },

      /**
       * Fetch the model from the server. If the server's representation of the
       * model differs from its current attributes, they will be overriden,
       * triggering a <code>"change"</code> event.
       * @return {Parse.Promise} A promise that is fulfilled when the fetch
       *     completes.
       */
      fetch: function (options) {
        var promise = new Parse.Promise();
        options = options ? _.clone(options) : {};
        var model = this;
        var success = options.success;
        options.success = function (resp, status, xhr) {
          model._finishFetch(model.parse(resp, status, xhr), true);
          if (success) {
            success(model, resp);
          }
          promise.resolve(model);
        };
        options.error = Parse.Object._wrapError(
          options.error,
          model,
          options,
          promise
        );
        Parse._request(
          "classes",
          model.className,
          model.id,
          "GET",
          null,
          options
        );
        return promise;
      },

      /**
       * Set a hash of model attributes, and save the model to the server.
       * updatedAt will be updated when the request returns.
       * You can either call it as:<pre>
       *   object.save();</pre>
       * or<pre>
       *   object.save(null, options);</pre>
       * or<pre>
       *   object.save(attrs, options);</pre>
       * or<pre>
       *   object.save(key, value, options);</pre>
       *
       * For example, <pre>
       *   gameTurn.save({
       *     player: "Jake Cutter",
       *     diceRoll: 2
       *   }, {
       *     success: function(gameTurnAgain) {
       *       // The save was successful.
       *     },
       *     error: function(gameTurnAgain, error) {
       *       // The save failed.  Error is an instance of Parse.Error.
       *     }
       *   });</pre>
       * or with promises:<pre>
       *   gameTurn.save({
       *     player: "Jake Cutter",
       *     diceRoll: 2
       *   }).then(function(gameTurnAgain) {
       *     // The save was successful.
       *   }, function(error) {
       *     // The save failed.  Error is an instance of Parse.Error.
       *   });</pre>
       *
       * @return {Parse.Promise} A promise that is fulfilled when the save
       *     completes.
       * @see Parse.Error
       */
      save: function (arg1, arg2, arg3) {
        var promise = new Parse.Promise();

        var i, attrs, current, options, saved;
        if (_.isObject(arg1) || Parse._isNullOrUndefined(arg1)) {
          attrs = arg1;
          options = arg2;
        } else {
          attrs = {};
          attrs[arg1] = arg2;
          options = arg3;
        }

        // Make save({ success: function() {} }) work.
        if (!options && attrs) {
          var extra_keys = _.reject(attrs, function (value, key) {
            return _.include(["success", "error", "wait"], key);
          });
          if (extra_keys.length === 0) {
            var all_functions = true;
            if (_.has(attrs, "success") && !_.isFunction(attrs.success)) {
              all_functions = false;
            }
            if (_.has(attrs, "error") && !_.isFunction(attrs.error)) {
              all_functions = false;
            }
            if (all_functions) {
              // This attrs object looks like it's really an options object,
              // and there's no other options object, so let's just use it.
              return this.save(null, attrs);
            }
          }
        }

        options = options ? _.clone(options) : {};
        if (options.wait) {
          current = _.clone(this.attributes);
        }
        var setOptions = _.clone(options);
        if (setOptions.wait) {
          setOptions.silent = true;
        }
        setOptions.error = function (model, error) {
          if (options.error) {
            options.error.apply(this, arguments);
          }
          promise.reject(error);
        };
        if (attrs && !this.set(attrs, setOptions)) {
          return promise;
        }
        var oldOptions = options; // Psuedonym more accurate in some contexts.
        var newOptions = _.clone(options);

        var model = this;

        // If there is any unsaved child, save it first.
        model._refreshCache();
        var unsavedChildren = Parse.Object._findUnsavedChildren(
          model.attributes
        );
        if (unsavedChildren.length > 0) {
          return Parse.Object.saveAll(unsavedChildren).then(
            function () {
              return model.save(null, oldOptions);
            },
            function (error) {
              if (options.error) {
                options.error.apply(this, arguments);
              }
              return Parse.Promise.error(error);
            }
          );
        }

        /** ignore */
        newOptions.success = function (resp, status, xhr) {
          var serverAttrs = model.parse(resp, status, xhr);
          if (newOptions.wait) {
            serverAttrs = _.extend(attrs || {}, serverAttrs);
          }

          model._finishSave(serverAttrs);

          if (oldOptions.success) {
            oldOptions.success(model, resp);
          } else {
            model.trigger("sync", model, resp, newOptions);
          }

          promise.resolve(model);
        };

        newOptions.error = function (model, error) {
          model._cancelSave();
          if (oldOptions.error) {
            oldOptions.error.apply(this, arguments);
          }

          promise.reject(error);
        };

        newOptions.error = Parse.Object._wrapError(
          newOptions.error,
          model,
          newOptions
        );

        this._startSave();

        var doSave = function () {
          var method = model.id ? "PUT" : "POST";

          var json = model._getSaveJSON();

          var route = "classes";
          var className = model.className;
          if (model.className === "_User" && !model.id) {
            // Special-case user sign-up.
            route = "users";
            className = null;
          }
          Parse._request(route, className, model.id, method, json, newOptions);
          if (newOptions.wait) {
            model.set(current, setOptions);
          }
        };

        if (this._saving) {
          this._saveQueue = this._saveQueue || [];
          this._saveQueue.push(doSave);
        } else {
          this._saving = true;
          doSave();
        }

        return promise;
      },

      /**
       * Destroy this model on the server if it was already persisted.
       * Optimistically removes the model from its collection, if it has one.
       * If `wait: true` is passed, waits for the server to respond
       * before removal.
       *
       * @return {Parse.Promise} A promise that is fulfilled when the destroy
       *     completes.
       */
      destroy: function (options) {
        var promise = new Parse.Promise();
        options = options ? _.clone(options) : {};
        var model = this;
        var success = options.success;

        var triggerDestroy = function () {
          model.trigger("destroy", model, model.collection, options);
        };

        if (!this.id) {
          return triggerDestroy();
        }
        /** ignore */
        options.success = function (resp) {
          if (options.wait) {
            triggerDestroy();
          }
          if (success) {
            success(model, resp);
          } else {
            model.trigger("sync", model, resp, options);
          }
          promise.resolve(model);
        };
        options.error = Parse.Object._wrapError(
          options.error,
          model,
          options,
          promise
        );

        Parse._request(
          "classes",
          this.className,
          this.id,
          "DELETE",
          null,
          options
        );
        if (!options.wait) {
          triggerDestroy();
        }
        return promise;
      },

      /**
       * Converts a response into the hash of attributes to be set on the model.
       * @ignore
       */
      parse: function (resp, status, xhr) {
        var output = _.clone(resp);
        _(["createdAt", "updatedAt"]).each(function (key) {
          if (output[key]) {
            output[key] = Parse._parseDate(output[key]);
          }
        });
        if (!output.updatedAt) {
          output.updatedAt = output.createdAt;
        }
        if (status) {
          this._existed = status.status !== 201;
        }
        return output;
      },

      /**
       * Creates a new model with identical attributes to this one.
       * @return {Parse.Object}
       */
      clone: function () {
        return new this.constructor(this.attributes);
      },

      /**
       * Returns true if this object has never been saved to Parse.
       * @return {Boolean}
       */
      isNew: function () {
        return !this.id;
      },

      /**
       * Call this method to manually fire a `"change"` event for this model and
       * a `"change:attribute"` event for each changed attribute.
       * Calling this will cause all objects observing the model to update.
       */
      change: function (options) {
        options = options || {};
        var changing = this._changing;
        this._changing = true;

        // Silent changes become pending changes.
        var self = this;
        Parse._each(this._silent, function (attr) {
          self._pending[attr] = true;
        });

        // Silent changes are triggered.
        var changes = _.extend({}, options.changes, this._silent);
        this._silent = {};
        Parse._each(changes, function (unused_value, attr) {
          self.trigger("change:" + attr, self, self.get(attr), options);
        });
        if (changing) {
          return this;
        }

        // This is to get around lint not letting us make a function in a loop.
        var deleteChanged = function (value, attr) {
          if (!self._pending[attr] && !self._silent[attr]) {
            delete self.changed[attr];
          }
        };

        // Continue firing `"change"` events while there are pending changes.
        while (!_.isEmpty(this._pending)) {
          this._pending = {};
          this.trigger("change", this, options);
          // Pending and silent changes still remain.
          Parse._each(this.changed, deleteChanged);
          self._previousAttributes = _.clone(this.attributes);
        }

        this._changing = false;
        return this;
      },

      /**
       * Returns true if this object was created by the Parse server when the
       * object might have already been there (e.g. in the case of a Facebook
       * login)
       */
      existed: function () {
        return this._existed;
      },

      /**
       * Determine if the model has changed since the last <code>"change"</code>
       * event.  If you specify an attribute name, determine if that attribute
       * has changed.
       * @param {String} attr Optional attribute name
       * @return {Boolean}
       */
      hasChanged: function (attr) {
        if (!arguments.length) {
          return !_.isEmpty(this.changed);
        }
        return this.changed && _.has(this.changed, attr);
      },

      /**
       * Returns an object containing all the attributes that have changed, or
       * false if there are no changed attributes. Useful for determining what
       * parts of a view need to be updated and/or what attributes need to be
       * persisted to the server. Unset attributes will be set to undefined.
       * You can also pass an attributes object to diff against the model,
       * determining if there *would be* a change.
       */
      changedAttributes: function (diff) {
        if (!diff) {
          return this.hasChanged() ? _.clone(this.changed) : false;
        }
        var changed = {};
        var old = this._previousAttributes;
        Parse._each(diff, function (diffVal, attr) {
          if (!_.isEqual(old[attr], diffVal)) {
            changed[attr] = diffVal;
          }
        });
        return changed;
      },

      /**
       * Gets the previous value of an attribute, recorded at the time the last
       * <code>"change"</code> event was fired.
       * @param {String} attr Name of the attribute to get.
       */
      previous: function (attr) {
        if (!arguments.length || !this._previousAttributes) {
          return null;
        }
        return this._previousAttributes[attr];
      },

      /**
       * Gets all of the attributes of the model at the time of the previous
       * <code>"change"</code> event.
       * @return {Object}
       */
      previousAttributes: function () {
        return _.clone(this._previousAttributes);
      },

      /**
       * Checks if the model is currently in a valid state. It's only possible to
       * get into an *invalid* state if you're using silent changes.
       * @return {Boolean}
       */
      isValid: function () {
        return !this.validate(this.attributes);
      },

      /**
       * You should not call this function directly unless you subclass
       * <code>Parse.Object</code>, in which case you can override this method
       * to provide additional validation on <code>set</code> and
       * <code>save</code>.  Your implementation should return
       *
       * @param {Object} attrs The current data to validate.
       * @param {Object} options A Backbone-like options object.
       * @return {} False if the data is valid.  An error object otherwise.
       * @see Parse.Object#set
       */
      validate: function (attrs, options) {
        if (_.has(attrs, "ACL") && !(attrs.ACL instanceof Parse.ACL)) {
          return new Parse.Error(
            Parse.Error.OTHER_CAUSE,
            "ACL must be a Parse.ACL."
          );
        }
        return false;
      },

      /**
       * Run validation against a set of incoming attributes, returning `true`
       * if all is well. If a specific `error` callback has been passed,
       * call that instead of firing the general `"error"` event.
       */
      _validate: function (attrs, options) {
        if (options.silent || !this.validate) {
          return true;
        }
        attrs = _.extend({}, this.attributes, attrs);
        var error = this.validate(attrs, options);
        if (!error) {
          return true;
        }
        if (options && options.error) {
          options.error(this, error, options);
        } else {
          this.trigger("error", this, error, options);
        }
        return false;
      },

      /**
       * Returns the ACL for this object.
       * @returns {Parse.ACL} An instance of Parse.ACL.
       * @see Parse.Object#get
       */
      getACL: function () {
        return this.get("ACL");
      },

      /**
       * Sets the ACL to be used for this object.
       * @param {Parse.ACL} acl An instance of Parse.ACL.
       * @param {Object} options Optional Backbone-like options object to be
       *     passed in to set.
       * @return {Boolean} Whether the set passed validation.
       * @see Parse.Object#set
       */
      setACL: function (acl, options) {
        return this.set("ACL", acl, options);
      },
    }
  );

  /**
   * Returns the appropriate subclass for making new instances of the given
   * className string.
   */
  Parse.Object._getSubclass = function (className) {
    if (!_.isString(className)) {
      throw "Parse.Object._getSubclass requires a string argument.";
    }
    var ObjectClass = Parse.Object._classMap[className];
    if (!ObjectClass) {
      ObjectClass = Parse.Object.extend(className);
      Parse.Object._classMap[className] = ObjectClass;
    }
    return ObjectClass;
  };

  /**
   * Creates an instance of a subclass of Parse.Object for the given classname.
   */
  Parse.Object._create = function (className, attributes, options) {
    var ObjectClass = Parse.Object._getSubclass(className);
    return new ObjectClass(attributes, options);
  };

  // Set up a map of className to class so that we can create new instances of
  // Parse Objects from JSON automatically.
  Parse.Object._classMap = {};

  Parse.Object._extend = Parse._extend;

  /**
   * Creates a new subclass of Parse.Object for the given Parse class name.
   *
   * <p>Every extension of a Parse class will inherit from the most recent
   * previous extension of that class. When a Parse.Object is automatically
   * created by parsing JSON, it will use the most recent extension of that
   * class.</p>
   *
   * <p>You should call either:<pre>
   *     var MyClass = Parse.Object.extend("MyClass", {
   *         <i>Instance properties</i>
   *     }, {
   *         <i>Class properties</i>
   *     });</pre>
   * or, for Backbone compatibility:<pre>
   *     var MyClass = Parse.Object.extend({
   *         className: "MyClass",
   *         <i>Other instance properties</i>
   *     }, {
   *         <i>Class properties</i>
   *     });</pre></p>
   *
   * @param {String} className The name of the Parse class backing this model.
   * @param {Object} protoProps Instance properties to add to instances of the
   *     class returned from this method.
   * @param {Object} classProps Class properties to add the class returned from
   *     this method.
   * @return {Class} A new subclass of Parse.Object.
   */
  Parse.Object.extend = function (className, protoProps, classProps) {
    // Handle the case with only two args.
    if (!_.isString(className)) {
      if (className && _.has(className, "className")) {
        return Parse.Object.extend(className.className, className, protoProps);
      } else {
        throw new Error(
          "Parse.Object.extend's first argument should be the className."
        );
      }
    }

    // If someone tries to subclass "User", coerce it to the right type.
    if (className === "User") {
      className = "_User";
    }

    var NewClassObject = null;
    if (_.has(Parse.Object._classMap, className)) {
      var OldClassObject = Parse.Object._classMap[className];
      // This new subclass has been told to extend both from "this" and from
      // OldClassObject. This is multiple inheritance, which isn't supported.
      // For now, let's just pick one.
      NewClassObject = OldClassObject._extend(protoProps, classProps);
    } else {
      protoProps = protoProps || {};
      protoProps.className = className;
      NewClassObject = this._extend(protoProps, classProps);
    }
    // Extending a subclass should reuse the classname automatically.
    NewClassObject.extend = function (arg0) {
      if (_.isString(arg0) || (arg0 && _.has(arg0, "className"))) {
        return Parse.Object.extend.apply(NewClassObject, arguments);
      }
      var newArguments = [className].concat(Parse._.toArray(arguments));
      return Parse.Object.extend.apply(NewClassObject, newArguments);
    };
    Parse.Object._classMap[className] = NewClassObject;
    return NewClassObject;
  };

  /**
   * Wrap an optional error callback with a fallback error event.
   */
  Parse.Object._wrapError = function (
    onError,
    originalModel,
    options,
    promise
  ) {
    return function (model, response) {
      if (model !== originalModel) {
        response = model;
      }
      var error = new Parse.Error(-1, response.responseText);
      if (response.responseText) {
        var errorJSON = JSON.parse(response.responseText);
        if (errorJSON) {
          error = new Parse.Error(errorJSON.code, errorJSON.error);
        }
      }
      if (onError) {
        onError(originalModel, error, options);
      } else {
        originalModel.trigger("error", originalModel, error, options);
      }
      if (promise) {
        promise.reject(error);
      }
    };
  };

  Parse.Object._findUnsavedChildren = function (object) {
    var results = [];
    if (object instanceof Parse.Object) {
      object._refreshCache();
      if (object.dirty()) {
        results = [object];
      }
      results.push.apply(
        results,
        Parse.Object._findUnsavedChildren(object.attributes)
      );
    } else if (object instanceof Parse.Relation) {
      // Nothing needs to be done, but we don't want to recurse into the
      // relation's parent infinitely, so we catch this case.
      var unused = null;
    } else if (_.isArray(object)) {
      _.each(object, function (child) {
        results.push.apply(results, Parse.Object._findUnsavedChildren(child));
      });
    } else if (_.isObject(object)) {
      Parse._each(object, function (child) {
        results.push.apply(results, Parse.Object._findUnsavedChildren(child));
      });
    }
    return results;
  };
})(this);

(function (root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Represents a Role on the Parse server. Roles represent groupings of
   * Users for the purposes of granting permissions (e.g. specifying an ACL
   * for an Object). Roles are specified by their sets of child users and
   * child roles, all of which are granted any permissions that the parent
   * role has.
   *
   * <p>Roles must have a name (which cannot be changed after creation of the
   * role), and must specify an ACL.</p>
   * @class
   * A Parse.Role is a local representation of a role persisted to the Parse
   * cloud.
   */
  Parse.Role = Parse.Object.extend(
    "_Role",
    /** @lends Parse.Role.prototype */ {
      // Instance Methods

      /**
       * Constructs a new ParseRole with the given name and ACL.
       *
       * @param {String} name The name of the Role to create.
       * @param {Parse.ACL} acl The ACL for this role. Roles must have an ACL.
       */
      constructor: function (name, acl) {
        if (_.isString(name) && acl instanceof Parse.ACL) {
          Parse.Object.prototype.constructor.call(this, null, null);
          this.setName(name);
          this.setACL(acl);
        } else {
          Parse.Object.prototype.constructor.call(this, name, acl);
        }
      },

      /**
       * Gets the name of the role.  You can alternatively call role.get("name")
       *
       * @return {String} the name of the role.
       */
      getName: function () {
        return this.get("name");
      },

      /**
       * Sets the name for a role. This value must be set before the role has
       * been saved to the server, and cannot be set once the role has been
       * saved.
       *
       * <p>
       *   A role's name can only contain alphanumeric characters, _, -, and
       *   spaces.
       * </p>
       *
       * <p>This is equivalent to calling role.set("name", name)</p>
       *
       * @param {String} name The name of the role.
       * @param {Object} options Standard options object with success and error
       *     callbacks.
       */
      setName: function (name, options) {
        return this.set("name", name, options);
      },

      /**
       * Gets the Parse.Relation for the Parse.Users that are direct
       * children of this role. These users are granted any privileges that this
       * role has been granted (e.g. read or write access through ACLs). You can
       * add or remove users from the role through this relation.
       *
       * <p>This is equivalent to calling role.relation("users")</p>
       *
       * @return {Parse.Relation} the relation for the users belonging to this
       *     role.
       */
      getUsers: function () {
        return this.relation("users");
      },

      /**
       * Gets the Parse.Relation for the Parse.Roles that are direct
       * children of this role. These roles' users are granted any privileges that
       * this role has been granted (e.g. read or write access through ACLs). You
       * can add or remove child roles from this role through this relation.
       *
       * <p>This is equivalent to calling role.relation("roles")</p>
       *
       * @return {Parse.Relation} the relation for the roles belonging to this
       *     role.
       */
      getRoles: function () {
        return this.relation("roles");
      },

      /**
       * @ignore
       */
      validate: function (attrs, options) {
        if ("name" in attrs && attrs.name !== this.getName()) {
          var newName = attrs.name;
          if (this.id && this.id !== attrs.objectId) {
            // Check to see if the objectId being set matches this.id.
            // This happens during a fetch -- the id is set before calling fetch.
            // Let the name be set in this case.
            return new Parse.Error(
              Parse.Error.OTHER_CAUSE,
              "A role's name can only be set before it has been saved."
            );
          }
          if (!_.isString(newName)) {
            return new Parse.Error(
              Parse.Error.OTHER_CAUSE,
              "A role's name must be a String."
            );
          }
          if (!/^[0-9a-zA-Z\-_ ]+$/.test(newName)) {
            return new Parse.Error(
              Parse.Error.OTHER_CAUSE,
              "A role's name can only contain alphanumeric characters, _," +
                " -, and spaces."
            );
          }
        }
        if (Parse.Object.prototype.validate) {
          return Parse.Object.prototype.validate.call(this, attrs, options);
        }
        return false;
      },
    }
  );
})(this);

/*global _: false */
(function (root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Creates a new instance with the given models and options.  Typically, you
   * will not call this method directly, but will instead make a subclass using
   * <code>Parse.Collection.extend</code>.
   *
   * @param {Array} models An array of instances of <code>Parse.Object</code>.
   *
   * @param {Object} options An optional object with Backbone-style options.
   * Valid options are:<ul>
   *   <li>model: The Parse.Object subclass that this collection contains.
   *   <li>query: An instance of Parse.Query to use when fetching items.
   *   <li>comparator: A string property name or function to sort by.
   * </ul>
   *
   * @see Parse.Collection.extend
   *
   * @class
   *
   * <p>Provides a standard collection class for our sets of models, ordered
   * or unordered.  For more information, see the
   * <a href="http://documentcloud.github.com/backbone/#Collection">Backbone
   * documentation</a>.</p>
   */
  Parse.Collection = function (models, options) {
    options = options || {};
    if (options.comparator) {
      this.comparator = options.comparator;
    }
    if (options.model) {
      this.model = options.model;
    }
    if (options.query) {
      this.query = options.query;
    }
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) {
      this.reset(models, { silent: true, parse: options.parse });
    }
  };

  // Define the Collection's inheritable methods.
  _.extend(
    Parse.Collection.prototype,
    Parse.Events,
    /** @lends Parse.Collection.prototype */ {
      // The default model for a collection is just a Parse.Object.
      // This should be overridden in most cases.

      model: Parse.Object,

      /**
       * Initialize is an empty function by default. Override it with your own
       * initialization logic.
       */
      initialize: function () {},

      /**
       * The JSON representation of a Collection is an array of the
       * models' attributes.
       */
      toJSON: function () {
        return this.map(function (model) {
          return model.toJSON();
        });
      },

      /**
       * Add a model, or list of models to the set. Pass **silent** to avoid
       * firing the `add` event for every new model.
       */
      add: function (models, options) {
        var i,
          index,
          length,
          model,
          cid,
          id,
          cids = {},
          ids = {};
        options = options || {};
        models = _.isArray(models) ? models.slice() : [models];

        // Begin by turning bare objects into model references, and preventing
        // invalid models or duplicate models from being added.
        for (i = 0, length = models.length; i < length; i++) {
          models[i] = this._prepareModel(models[i], options);
          model = models[i];
          if (!model) {
            throw new Error("Can't add an invalid model to a collection");
          }
          cid = model.cid;
          if (cids[cid] || this._byCid[cid]) {
            throw new Error(
              "Duplicate cid: can't add the same model " +
                "to a collection twice"
            );
          }
          id = model.id;
          if (!Parse._isNullOrUndefined(id) && (ids[id] || this._byId[id])) {
            throw new Error(
              "Duplicate id: can't add the same model " +
                "to a collection twice"
            );
          }
          ids[id] = model;
          cids[cid] = model;
        }

        // Listen to added models' events, and index models for lookup by
        // `id` and by `cid`.
        for (i = 0; i < length; i++) {
          (model = models[i]).on("all", this._onModelEvent, this);
          this._byCid[model.cid] = model;
          if (model.id) {
            this._byId[model.id] = model;
          }
        }

        // Insert models into the collection, re-sorting if needed, and triggering
        // `add` events unless silenced.
        this.length += length;
        index = Parse._isNullOrUndefined(options.at)
          ? this.models.length
          : options.at;
        this.models.splice.apply(this.models, [index, 0].concat(models));
        if (this.comparator) {
          this.sort({ silent: true });
        }
        if (options.silent) {
          return this;
        }
        for (i = 0, length = this.models.length; i < length; i++) {
          model = this.models[i];
          if (cids[model.cid]) {
            options.index = i;
            model.trigger("add", model, this, options);
          }
        }
        return this;
      },

      /**
       * Remove a model, or a list of models from the set. Pass silent to avoid
       * firing the <code>remove</code> event for every model removed.
       */
      remove: function (models, options) {
        var i, l, index, model;
        options = options || {};
        models = _.isArray(models) ? models.slice() : [models];
        for (i = 0, l = models.length; i < l; i++) {
          model = this.getByCid(models[i]) || this.get(models[i]);
          if (!model) {
            continue;
          }
          delete this._byId[model.id];
          delete this._byCid[model.cid];
          index = this.indexOf(model);
          this.models.splice(index, 1);
          this.length--;
          if (!options.silent) {
            options.index = index;
            model.trigger("remove", model, this, options);
          }
          this._removeReference(model);
        }
        return this;
      },

      /**
       * Gets a model from the set by id.
       */
      get: function (id) {
        return id && this._byId[id.id || id];
      },

      /**
       * Gets a model from the set by client id.
       */
      getByCid: function (cid) {
        return cid && this._byCid[cid.cid || cid];
      },

      /**
       * Gets the model at the given index.
       */
      at: function (index) {
        return this.models[index];
      },

      /**
       * Forces the collection to re-sort itself. You don't need to call this
       * under normal circumstances, as the set will maintain sort order as each
       * item is added.
       */
      sort: function (options) {
        options = options || {};
        if (!this.comparator) {
          throw new Error("Cannot sort a set without a comparator");
        }
        var boundComparator = _.bind(this.comparator, this);
        if (this.comparator.length === 1) {
          this.models = this.sortBy(boundComparator);
        } else {
          this.models.sort(boundComparator);
        }
        if (!options.silent) {
          this.trigger("reset", this, options);
        }
        return this;
      },

      /**
       * Plucks an attribute from each model in the collection.
       */
      pluck: function (attr) {
        return _.map(this.models, function (model) {
          return model.get(attr);
        });
      },

      /**
       * When you have more items than you want to add or remove individually,
       * you can reset the entire set with a new list of models, without firing
       * any `add` or `remove` events. Fires `reset` when finished.
       */
      reset: function (models, options) {
        var self = this;
        models = models || [];
        options = options || {};
        _.each(this.models, function (model) {
          self._removeReference(model);
        });
        this._reset();
        this.add(models, { silent: true, parse: options.parse });
        if (!options.silent) {
          this.trigger("reset", this, options);
        }
        return this;
      },

      /**
       * Fetches the default set of models for this collection, resetting the
       * collection when they arrive. If `add: true` is passed, appends the
       * models to the collection instead of resetting.
       */
      fetch: function (options) {
        options = options ? _.clone(options) : {};
        if (options.parse === undefined) {
          options.parse = true;
        }
        var collection = this;
        var success = options.success;
        options.success = function (results, resp) {
          if (options.add) {
            collection.add(results, options);
          } else {
            collection.reset(results, options);
          }
          if (success) {
            success(collection, resp);
          }
        };
        options.error = Parse.Object._wrapError(
          options.error,
          collection,
          options
        );
        var query = this.query || new Parse.Query(this.model);
        query.find(options);
      },

      /**
       * Creates a new instance of a model in this collection. Add the model to
       * the collection immediately, unless `wait: true` is passed, in which case
       * we wait for the server to agree.
       */
      create: function (model, options) {
        var coll = this;
        options = options ? _.clone(options) : {};
        model = this._prepareModel(model, options);
        if (!model) {
          return false;
        }
        if (!options.wait) {
          coll.add(model, options);
        }
        var success = options.success;
        options.success = function (nextModel, resp, xhr) {
          if (options.wait) {
            coll.add(nextModel, options);
          }
          if (success) {
            success(nextModel, resp);
          } else {
            nextModel.trigger("sync", model, resp, options);
          }
        };
        model.save(null, options);
        return model;
      },

      /**
       * Converts a response into a list of models to be added to the collection.
       * The default implementation is just to pass it through.
       * @ignore
       */
      parse: function (resp, xhr) {
        return resp;
      },

      /**
       * Proxy to _'s chain. Can't be proxied the same way the rest of the
       * underscore methods are proxied because it relies on the underscore
       * constructor.
       */
      chain: function () {
        return _(this.models).chain();
      },

      /**
       * Reset all internal state. Called when the collection is reset.
       */
      _reset: function (options) {
        this.length = 0;
        this.models = [];
        this._byId = {};
        this._byCid = {};
      },

      /**
       * Prepare a model or hash of attributes to be added to this collection.
       */
      _prepareModel: function (model, options) {
        if (!(model instanceof Parse.Object)) {
          var attrs = model;
          options.collection = this;
          model = new this.model(attrs, options);
          if (!model._validate(model.attributes, options)) {
            model = false;
          }
        } else if (!model.collection) {
          model.collection = this;
        }
        return model;
      },

      /**
       * Internal method to remove a model's ties to a collection.
       */
      _removeReference: function (model) {
        if (this === model.collection) {
          delete model.collection;
        }
        model.off("all", this._onModelEvent, this);
      },

      /**
       * Internal method called every time a model in the set fires an event.
       * Sets need to update their indexes when models change ids. All other
       * events simply proxy through. "add" and "remove" events that originate
       * in other collections are ignored.
       */
      _onModelEvent: function (ev, model, collection, options) {
        if ((ev === "add" || ev === "remove") && collection !== this) {
          return;
        }
        if (ev === "destroy") {
          this.remove(model, options);
        }
        if (model && ev === "change:objectId") {
          delete this._byId[model.previous("objectId")];
          this._byId[model.id] = model;
        }
        this.trigger.apply(this, arguments);
      },
    }
  );

  // Underscore methods that we want to implement on the Collection.
  var methods = [
    "forEach",
    "each",
    "map",
    "reduce",
    "reduceRight",
    "find",
    "detect",
    "filter",
    "select",
    "reject",
    "every",
    "all",
    "some",
    "any",
    "include",
    "contains",
    "invoke",
    "max",
    "min",
    "sortBy",
    "sortedIndex",
    "toArray",
    "size",
    "first",
    "initial",
    "rest",
    "last",
    "without",
    "indexOf",
    "shuffle",
    "lastIndexOf",
    "isEmpty",
    "groupBy",
  ];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function (method) {
    Parse.Collection.prototype[method] = function () {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  /**
   * Creates a new subclass of <code>Parse.Collection</code>.  For example,<pre>
   *   var MyCollection = Parse.Collection.extend({
   *     // Instance properties
   *
   *     model: MyClass,
   *     query: MyQuery,
   *
   *     getFirst: function() {
   *       return this.at(0);
   *     }
   *   }, {
   *     // Class properties
   *
   *     makeOne: function() {
   *       return new MyCollection();
   *     }
   *   });
   *
   *   var collection = new MyCollection();
   * </pre>
   *
   * @function
   * @param {Object} instanceProps Instance properties for the collection.
   * @param {Object} classProps Class properies for the collection.
   * @return {Class} A new subclass of <code>Parse.Collection</code>.
   */
  Parse.Collection.extend = Parse._extend;
})(this);

/*global _: false, document: false */
(function (root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Creating a Parse.View creates its initial element outside of the DOM,
   * if an existing element is not provided...
   * @class
   *
   * <p>A fork of Backbone.View, provided for your convenience.  If you use this
   * class, you must also include jQuery, or another library that provides a
   * jQuery-compatible $ function.  For more information, see the
   * <a href="http://documentcloud.github.com/backbone/#View">Backbone
   * documentation</a>.</p>
   * <p><strong><em>Available in the client SDK only.</em></strong></p>
   */
  Parse.View = function (options) {
    this.cid = _.uniqueId("view");
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var eventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.

  var viewOptions = [
    "model",
    "collection",
    "el",
    "id",
    "attributes",
    "className",
    "tagName",
  ];

  // Set up all inheritable **Parse.View** properties and methods.
  _.extend(
    Parse.View.prototype,
    Parse.Events,
    /** @lends Parse.View.prototype */ {
      // The default `tagName` of a View's element is `"div"`.
      tagName: "div",

      /**
       * jQuery delegate for element lookup, scoped to DOM elements within the
       * current view. This should be prefered to global lookups where possible.
       */
      $: function (selector) {
        return this.$el.find(selector);
      },

      /**
       * Initialize is an empty function by default. Override it with your own
       * initialization logic.
       */
      initialize: function () {},

      /**
       * The core function that your view should override, in order
       * to populate its element (`this.el`), with the appropriate HTML. The
       * convention is for **render** to always return `this`.
       */
      render: function () {
        return this;
      },

      /**
       * Remove this view from the DOM. Note that the view isn't present in the
       * DOM by default, so calling this method may be a no-op.
       */
      remove: function () {
        this.$el.remove();
        return this;
      },

      /**
       * For small amounts of DOM Elements, where a full-blown template isn't
       * needed, use **make** to manufacture elements, one at a time.
       * <pre>
       *     var el = this.make('li', {'class': 'row'},
       *                        this.model.escape('title'));</pre>
       */
      make: function (tagName, attributes, content) {
        var el = document.createElement(tagName);
        if (attributes) {
          Parse.$(el).attr(attributes);
        }
        if (content) {
          Parse.$(el).html(content);
        }
        return el;
      },

      /**
       * Changes the view's element (`this.el` property), including event
       * re-delegation.
       */
      setElement: function (element, delegate) {
        this.$el = Parse.$(element);
        this.el = this.$el[0];
        if (delegate !== false) {
          this.delegateEvents();
        }
        return this;
      },

      /**
       * Set callbacks.  <code>this.events</code> is a hash of
       * <pre>
       * *{"event selector": "callback"}*
       *
       *     {
       *       'mousedown .title':  'edit',
       *       'click .button':     'save'
       *       'click .open':       function(e) { ... }
       *     }
       * </pre>
       * pairs. Callbacks will be bound to the view, with `this` set properly.
       * Uses event delegation for efficiency.
       * Omitting the selector binds the event to `this.el`.
       * This only works for delegate-able events: not `focus`, `blur`, and
       * not `change`, `submit`, and `reset` in Internet Explorer.
       */
      delegateEvents: function (events) {
        events = events || Parse._getValue(this, "events");
        if (!events) {
          return;
        }
        this.undelegateEvents();
        var self = this;
        Parse._each(events, function (method, key) {
          if (!_.isFunction(method)) {
            method = self[events[key]];
          }
          if (!method) {
            throw new Error('Event "' + events[key] + '" does not exist');
          }
          var match = key.match(eventSplitter);
          var eventName = match[1],
            selector = match[2];
          method = _.bind(method, self);
          eventName += ".delegateEvents" + self.cid;
          if (selector === "") {
            self.$el.bind(eventName, method);
          } else {
            self.$el.delegate(selector, eventName, method);
          }
        });
      },

      /**
       * Clears all callbacks previously bound to the view with `delegateEvents`.
       * You usually don't need to use this, but may wish to if you have multiple
       * Backbone views attached to the same DOM element.
       */
      undelegateEvents: function () {
        this.$el.unbind(".delegateEvents" + this.cid);
      },

      /**
       * Performs the initial configuration of a View with a set of options.
       * Keys with special meaning *(model, collection, id, className)*, are
       * attached directly to the view.
       */
      _configure: function (options) {
        if (this.options) {
          options = _.extend({}, this.options, options);
        }
        var self = this;
        _.each(viewOptions, function (attr) {
          if (options[attr]) {
            self[attr] = options[attr];
          }
        });
        this.options = options;
      },

      /**
       * Ensure that the View has a DOM element to render into.
       * If `this.el` is a string, pass it through `$()`, take the first
       * matching element, and re-assign it to `el`. Otherwise, create
       * an element from the `id`, `className` and `tagName` properties.
       */
      _ensureElement: function () {
        if (!this.el) {
          var attrs = Parse._getValue(this, "attributes") || {};
          if (this.id) {
            attrs.id = this.id;
          }
          if (this.className) {
            attrs["class"] = this.className;
          }
          this.setElement(this.make(this.tagName, attrs), false);
        } else {
          this.setElement(this.el, false);
        }
      },
    }
  );

  /**
   * @function
   * @param {Object} instanceProps Instance properties for the view.
   * @param {Object} classProps Class properies for the view.
   * @return {Class} A new subclass of <code>Parse.View</code>.
   */
  Parse.View.extend = Parse._extend;
})(this);

(function (root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * @class
   *
   * <p>A Parse.User object is a local representation of a user persisted to the
   * Parse cloud. This class is a subclass of a Parse.Object, and retains the
   * same functionality of a Parse.Object, but also extends it with various
   * user specific methods, like authentication, signing up, and validation of
   * uniqueness.</p>
   */
  Parse.User = Parse.Object.extend(
    "_User",
    /** @lends Parse.User.prototype */ {
      // Instance Variables
      _isCurrentUser: false,

      // Instance Methods

      /**
       * Internal method to handle special fields in a _User response.
       */
      _mergeMagicFields: function (attrs) {
        if (attrs.sessionToken) {
          this._sessionToken = attrs.sessionToken;
          delete attrs.sessionToken;
        }
        Parse.User.__super__._mergeMagicFields.call(this, attrs);
      },

      /**
       * Removes null values from authData (which exist temporarily for
       * unlinking)
       */
      _cleanupAuthData: function () {
        if (!this.isCurrent()) {
          return;
        }
        var authData = this.get("authData");
        if (!authData) {
          return;
        }
        _.each(this.get("authData"), function (value, key) {
          if (!authData[key]) {
            delete authData[key];
          }
        });
      },

      /**
       * Synchronizes authData for all providers.
       */
      _synchronizeAllAuthData: function () {
        var authData = this.get("authData");
        if (!authData) {
          return;
        }

        var self = this;
        _.each(this.get("authData"), function (value, key) {
          self._synchronizeAuthData(key);
        });
      },

      /**
       * Synchronizes auth data for a provider (e.g. puts the access token in the
       * right place to be used by the Facebook SDK).
       */
      _synchronizeAuthData: function (provider) {
        if (!this.isCurrent()) {
          return;
        }
        var authType;
        if (_.isString(provider)) {
          authType = provider;
          provider = Parse.User._authProviders[authType];
        } else {
          authType = provider.getAuthType();
        }
        var authData = this.get("authData");
        if (!authData || !provider) {
          return;
        }
        var success = provider.restoreAuthentication(authData[authType]);
        if (!success) {
          this._unlinkFrom(provider);
        }
      },

      _handleSaveResult: function (makeCurrent) {
        // Clean up and synchronize the authData object, removing any unset values
        if (makeCurrent) {
          this._isCurrentUser = true;
        }
        this._cleanupAuthData();
        this._synchronizeAllAuthData();
        // Don't keep the password around.
        delete this._serverData.password;
        this._rebuildEstimatedDataForKey("password");
        this._refreshCache();
        if (makeCurrent || this.isCurrent()) {
          Parse.User._saveCurrentUser(this);
        }
      },

      /**
       * Unlike in the Android/iOS SDKs, logInWith is unnecessary, since you can
       * call linkWith on the user (even if it doesn't exist yet on the server).
       */
      _linkWith: function (provider, options) {
        var authType;
        if (_.isString(provider)) {
          authType = provider;
          provider = Parse.User._authProviders[provider];
        } else {
          authType = provider.getAuthType();
        }
        if (_.has(options, "authData")) {
          var authData = this.get("authData") || {};
          authData[authType] = options.authData;
          this.set("authData", authData);

          // Overridden so that the user can be made the current user.
          var newOptions = _.clone(options);
          newOptions.success = function (model) {
            model._handleSaveResult(true);
            if (options.success) {
              options.success.apply(this, arguments);
            }
          };
          return this.save({ authData: authData }, newOptions);
        } else {
          var self = this;
          return provider.authenticate({
            success: function (provider, result) {
              self._linkWith(provider, {
                authData: result,
                success: options.success,
                error: options.error,
              });
            },
            error: function (provider, error) {
              if (options.error) {
                options.error(self, error);
              }
            },
          });
        }
      },

      /**
       * Unlinks a user from a service.
       */
      _unlinkFrom: function (provider, options) {
        var authType;
        if (_.isString(provider)) {
          authType = provider;
          provider = Parse.User._authProviders[provider];
        } else {
          authType = provider.getAuthType();
        }
        var newOptions = _.clone(options);
        var self = this;
        newOptions.authData = null;
        newOptions.success = function (model) {
          self._synchronizeAuthData(provider);
          if (options.success) {
            options.success.apply(this, arguments);
          }
        };
        return this._linkWith(provider, newOptions);
      },

      /**
       * Checks whether a user is linked to a service.
       */
      _isLinked: function (provider) {
        var authType;
        if (_.isString(provider)) {
          authType = provider;
        } else {
          authType = provider.getAuthType();
        }
        var authData = this.get("authData") || {};
        return !!authData[authType];
      },

      /**
       * Deauthenticates all providers.
       */
      _logOutWithAll: function () {
        var authData = this.get("authData");
        if (!authData) {
          return;
        }
        var self = this;
        _.each(this.get("authData"), function (value, key) {
          self._logOutWith(key);
        });
      },

      /**
       * Deauthenticates a single provider (e.g. removing access tokens from the
       * Facebook SDK).
       */
      _logOutWith: function (provider) {
        if (!this.isCurrent()) {
          return;
        }
        if (_.isString(provider)) {
          provider = Parse.User._authProviders[provider];
        }
        if (provider && provider.deauthenticate) {
          provider.deauthenticate();
        }
      },

      /**
       * Signs up a new user. You should call this instead of save for
       * new Parse.Users. This will create a new Parse.User on the server, and
       * also persist the session on disk so that you can access the user using
       * <code>current</code>.
       *
       * <p>A username and password must be set before calling signUp.</p>
       *
       * <p>Calls options.success or options.error on completion.</p>
       *
       * @param {Object} attrs Extra fields to set on the new user, or null.
       * @param {Object} options A Backbone-style options object.
       * @return {Parse.Promise} A promise that is fulfilled when the signup
       *     finishes.
       * @see Parse.User.signUp
       */
      signUp: function (attrs, options) {
        var error;
        options = options || {};

        var username = (attrs && attrs.username) || this.get("username");
        if (!username || username === "") {
          error = new Parse.Error(
            Parse.Error.OTHER_CAUSE,
            "Cannot sign up user with an empty name."
          );
          if (options && options.error) {
            options.error(this, error);
          }
          return Parse.Promise.error(error);
        }

        var password = (attrs && attrs.password) || this.get("password");
        if (!password || password === "") {
          error = new Parse.Error(
            Parse.Error.OTHER_CAUSE,
            "Cannot sign up user with an empty password."
          );
          if (options && options.error) {
            options.error(this, error);
          }
          return Parse.Promise.error(error);
        }

        // Overridden so that the user can be made the current user.
        var newOptions = _.clone(options);
        newOptions.success = function (model) {
          model._handleSaveResult(true);
          if (options.success) {
            options.success.apply(this, arguments);
          }
        };
        return this.save(attrs, newOptions);
      },

      /**
       * Logs in a Parse.User. On success, this saves the session to localStorage,
       * so you can retrieve the currently logged in user using
       * <code>current</code>.
       *
       * <p>A username and password must be set before calling logIn.</p>
       *
       * <p>Calls options.success or options.error on completion.</p>
       *
       * @param {Object} options A Backbone-style options object.
       * @see Parse.User.logIn
       * @return {Parse.Promise} A promise that is fulfilled with the user when
       *     the login is complete.
       */
      logIn: function (options) {
        var promise = new Parse.Promise();
        var model = this;
        var newOptions = options ? _.clone(options) : {};
        newOptions.success = function (resp, status, xhr) {
          var serverAttrs = model.parse(resp, status, xhr);
          model._finishFetch(serverAttrs);
          model._handleSaveResult(true);
          if (options && options.success) {
            options.success(model, resp);
          } else {
            model.trigger("sync", model, resp, newOptions);
          }
          promise.resolve(model);
        };
        newOptions.error = Parse.Object._wrapError(
          newOptions.error,
          model,
          newOptions,
          promise
        );
        Parse._request("login", null, null, "GET", this.toJSON(), newOptions);
        return promise;
      },

      /**
       * @see Parse.Object#save
       */
      save: function (arg1, arg2, arg3) {
        var i, attrs, current, options, saved;
        if (_.isObject(arg1) || _.isNull(arg1) || _.isUndefined(arg1)) {
          attrs = arg1;
          options = arg2;
        } else {
          attrs = {};
          attrs[arg1] = arg2;
          options = arg3;
        }
        options = options || {};

        var newOptions = _.clone(options);
        newOptions.success = function (model) {
          model._handleSaveResult(false);
          if (options.success) {
            options.success.apply(this, arguments);
          }
        };
        return Parse.Object.prototype.save.call(this, attrs, newOptions);
      },

      /**
       * @see Parse.Object#fetch
       */
      fetch: function (options) {
        var newOptions = _.clone(options);
        newOptions.success = function (model) {
          model._handleSaveResult(false);
          if (options.success) {
            options.success.apply(this, arguments);
          }
        };
        return Parse.Object.prototype.fetch.call(this, newOptions);
      },

      /**
       * Returns true if <code>current</code> would return this user.
       * @see Parse.User#current
       */
      isCurrent: function () {
        return this._isCurrentUser;
      },

      /**
       * Returns get("username").
       * @return {String}
       * @see Parse.Object#get
       */
      getUsername: function () {
        return this.get("username");
      },

      /**
       * Calls set("username", username, options) and returns the result.
       * @param {String} username
       * @param {Object} options A Backbone-style options object.
       * @return {Boolean}
       * @see Parse.Object.set
       */
      setUsername: function (username, options) {
        return this.set("username", username, options);
      },

      /**
       * Calls set("password", password, options) and returns the result.
       * @param {String} password
       * @param {Object} options A Backbone-style options object.
       * @return {Boolean}
       * @see Parse.Object.set
       */
      setPassword: function (password, options) {
        return this.set("password", password, options);
      },

      /**
       * Returns get("email").
       * @return {String}
       * @see Parse.Object#get
       */
      getEmail: function () {
        return this.get("email");
      },

      /**
       * Calls set("email", email, options) and returns the result.
       * @param {String} email
       * @param {Object} options A Backbone-style options object.
       * @return {Boolean}
       * @see Parse.Object.set
       */
      setEmail: function (email, options) {
        return this.set("email", email, options);
      },

      /**
       * Checks whether this user is the current user and has been authenticated.
       * @return (Boolean) whether this user is the current user and is logged in.
       */
      authenticated: function () {
        return (
          !!this._sessionToken &&
          Parse.User.current() &&
          Parse.User.current().id === this.id
        );
      },
    },
    /** @lends Parse.User */ {
      // Class Variables

      // The currently logged-in user.
      _currentUser: null,

      // Whether currentUser is known to match the serialized version on disk.
      // This is useful for saving a localstorage check if you try to load
      // _currentUser frequently while there is none stored.
      _currentUserMatchesDisk: false,

      // The localStorage key suffix that the current user is stored under.
      _CURRENT_USER_KEY: "currentUser",

      // The mapping of auth provider names to actual providers
      _authProviders: {},

      // Class Methods

      /**
       * Signs up a new user with a username (or email) and password.
       * This will create a new Parse.User on the server, and also persist the
       * session in localStorage so that you can access the user using
       * {@link #current}.
       *
       * <p>Calls options.success or options.error on completion.</p>
       *
       * @param {String} username The username (or email) to sign up with.
       * @param {String} password The password to sign up with.
       * @param {Object} attrs Extra fields to set on the new user.
       * @param {Object} options A Backbone-style options object.
       * @return {Parse.Promise} A promise that is fulfilled with the user when
       *     the signup completes.
       * @see Parse.User#signUp
       */
      signUp: function (username, password, attrs, options) {
        attrs = attrs || {};
        attrs.username = username;
        attrs.password = password;
        var user = Parse.Object._create("_User");
        return user.signUp(attrs, options);
      },

      /**
       * Logs in a user with a username (or email) and password. On success, this
       * saves the session to disk, so you can retrieve the currently logged in
       * user using <code>current</code>.
       *
       * <p>Calls options.success or options.error on completion.</p>
       *
       * @param {String} username The username (or email) to log in with.
       * @param {String} password The password to log in with.
       * @param {Object} options A Backbone-style options object.
       * @return {Parse.Promise} A promise that is fulfilled with the user when
       *     the login completes.
       * @see Parse.User#logIn
       */
      logIn: function (username, password, options) {
        var user = Parse.Object._create("_User");
        user._finishFetch({ username: username, password: password });
        return user.logIn(options);
      },

      /**
       * Logs out the currently logged in user session. This will remove the
       * session from disk, log out of linked services, and future calls to
       * <code>current</code> will return <code>null</code>.
       */
      logOut: function () {
        if (Parse.User._currentUser !== null) {
          Parse.User._currentUser._logOutWithAll();
          Parse.User._currentUser._isCurrentUser = false;
        }
        Parse.User._currentUserMatchesDisk = true;
        Parse.User._currentUser = null;
        Parse.localStorage.removeItem(
          Parse._getParsePath(Parse.User._CURRENT_USER_KEY)
        );
      },

      /**
       * Requests a password reset email to be sent to the specified email address
       * associated with the user account. This email allows the user to securely
       * reset their password on the Parse site.
       *
       * <p>Calls options.success or options.error on completion.</p>
       *
       * @param {String} email The email address associated with the user that
       *     forgot their password.
       * @param {Object} options A Backbone-style options object.
       */
      requestPasswordReset: function (email, options) {
        var json = { email: email };
        options.error = Parse.Query._wrapError(options.error, options);
        Parse._request(
          "requestPasswordReset",
          null,
          null,
          "POST",
          json,
          options
        );
      },

      /**
       * Retrieves the currently logged in ParseUser with a valid session,
       * either from memory or localStorage, if necessary.
       * @return {Parse.Object} The currently logged in Parse.User.
       */
      current: function () {
        if (Parse.User._currentUser) {
          return Parse.User._currentUser;
        }

        if (Parse.User._currentUserMatchesDisk) {
          return Parse.User._currentUser;
        }

        // Load the user from local storage.
        Parse.User._currentUserMatchesDisk = true;

        var userData = Parse.localStorage.getItem(
          Parse._getParsePath(Parse.User._CURRENT_USER_KEY)
        );
        if (!userData) {
          return null;
        }
        Parse.User._currentUser = new Parse.Object._create("_User");
        Parse.User._currentUser._isCurrentUser = true;

        var json = JSON.parse(userData);
        Parse.User._currentUser.id = json._id;
        delete json._id;
        Parse.User._currentUser._sessionToken = json._sessionToken;
        delete json._sessionToken;
        Parse.User._currentUser.set(json);

        Parse.User._currentUser._synchronizeAllAuthData();
        Parse.User._currentUser._refreshCache();
        Parse.User._currentUser._opSetQueue = [{}];
        return Parse.User._currentUser;
      },

      /**
       * Persists a user as currentUser to localStorage, and into the singleton.
       */
      _saveCurrentUser: function (user) {
        if (Parse.User._currentUser !== user) {
          Parse.User.logOut();
        }
        user._isCurrentUser = true;
        Parse.User._currentUser = user;
        Parse.User._currentUserMatchesDisk = true;

        var json = user.toJSON();
        json._id = user.id;
        json._sessionToken = user._sessionToken;
        Parse.localStorage.setItem(
          Parse._getParsePath(Parse.User._CURRENT_USER_KEY),
          JSON.stringify(json)
        );
      },

      _registerAuthenticationProvider: function (provider) {
        Parse.User._authProviders[provider.getAuthType()] = provider;
        // Synchronize the current user with the auth provider.
        if (Parse.User.current()) {
          Parse.User.current()._synchronizeAuthData(provider.getAuthType());
        }
      },

      _logInWith: function (provider, options) {
        var user = new Parse.User();
        return user._linkWith(provider, options);
      },
    }
  );
})(this);

// Parse.Query is a way to create a list of Parse.Objects.
(function (root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Creates a new parse Parse.Query for the given Parse.Object subclass.
   * @param objectClass -
   *   An instance of a subclass of Parse.Object, or a Parse className string.
   * @class
   *
   * <p>Parse.Query defines a query that is used to fetch Parse.Objects. The
   * most common use case is finding all objects that match a query through the
   * <code>find</code> method. For example, this sample code fetches all objects
   * of class <code>MyClass</code>. It calls a different function depending on
   * whether the fetch succeeded or not.
   *
   * <pre>
   * var query = new Parse.Query(MyClass);
   * query.find({
   *   success: function(results) {
   *     // results is an array of Parse.Object.
   *   },
   *
   *   error: function(error) {
   *     // error is an instance of Parse.Error.
   *   }
   * });</pre></p>
   *
   * <p>A Parse.Query can also be used to retrieve a single object whose id is
   * known, through the get method. For example, this sample code fetches an
   * object of class <code>MyClass</code> and id <code>myId</code>. It calls a
   * different function depending on whether the fetch succeeded or not.
   *
   * <pre>
   * var query = new Parse.Query(MyClass);
   * query.get(myId, {
   *   success: function(object) {
   *     // object is an instance of Parse.Object.
   *   },
   *
   *   error: function(object, error) {
   *     // error is an instance of Parse.Error.
   *   }
   * });</pre></p>
   *
   * <p>A Parse.Query can also be used to count the number of objects that match
   * the query without retrieving all of those objects. For example, this
   * sample code counts the number of objects of the class <code>MyClass</code>
   * <pre>
   * var query = new Parse.Query(MyClass);
   * query.count({
   *   success: function(number) {
   *     // There are number instances of MyClass.
   *   },
   *
   *   error: function(error) {
   *     // error is an instance of Parse.Error.
   *   }
   * });</pre></p>
   */
  Parse.Query = function (objectClass) {
    if (_.isString(objectClass)) {
      objectClass = Parse.Object._getSubclass(objectClass);
    }

    this.objectClass = objectClass;

    this.className = objectClass.prototype.className;

    this._where = {};
    this._include = [];
    this._limit = -1; // negative limit means, do not send a limit
    this._skip = 0;
    this._extraOptions = {};
  };

  /**
   * Constructs a Parse.Query that is the OR of the passed in queries.  For
   * example:
   * <pre>var compoundQuery = Parse.Query.or(query1, query2, query3);</pre>
   *
   * will create a compoundQuery that is an or of the query1, query2, and
   * query3.
   * @param {...Parse.Query} var_args The list of queries to OR.
   * @return {Parse.Query} The query that is the OR of the passed in queries.
   */
  Parse.Query.or = function () {
    var queries = _.toArray(arguments);
    var className = null;
    _.each(queries, function (q) {
      if (_.isNull(className)) {
        className = q.className;
      }

      if (className !== q.className) {
        throw "All queries must be for the same class";
      }
    });
    var query = new Parse.Query(className);
    query._orQuery(queries);
    return query;
  };

  Parse.Query.prototype = {
    /**
     * Constructs a Parse.Object whose id is already known by fetching data from
     * the server.  Either options.success or options.error is called when the
     * find completes.
     *
     * @param {} objectId The id of the object to be fetched.
     * @param {Object} options A Backbone-style options object.
     */
    get: function (objectId, options) {
      var self = this;
      var success = options.success || function () {};
      var error = options.error || function () {};
      var promise = new Parse.Promise();

      /** ignore */
      var ajaxOptions = {
        error: function (errorObject) {
          error(null, errorObject);
          promise.reject(errorObject);
        },
        success: function (response) {
          if (response) {
            success(response);
            promise.resolve(response);
          } else {
            var errorObject = new Parse.Error(
              Parse.Error.OBJECT_NOT_FOUND,
              "Object not found."
            );
            error(null, errorObject);
            promise.reject(errorObject);
          }
        },
      };

      self.equalTo("objectId", objectId);
      self.first(ajaxOptions);
      return promise;
    },

    /**
     * Returns a JSON representation of this query.
     * @return {Object}
     */
    toJSON: function () {
      var params = {
        where: this._where,
      };

      if (this._include.length > 0) {
        params.include = this._include.join(",");
      }
      if (this._limit >= 0) {
        params.limit = this._limit;
      }
      if (this._skip > 0) {
        params.skip = this._skip;
      }
      if (this._order !== undefined) {
        params.order = this._order;
      }

      Parse._each(this._extraOptions, function (v, k) {
        params[k] = v;
      });

      return params;
    },

    /**
     * Retrieves a list of ParseObjects that satisfy this query.
     * Either options.success or options.error is called when the find
     * completes.
     *
     * @param {Object} options A Backbone-style options object.
     * @return {Parse.Promise} A promise that is resolved with the results when
     * the query completes.
     */
    find: function (options) {
      var self = this;
      options = options || {};
      var success = options.success || function () {};
      var promise = new Parse.Promise();

      /** ignore */
      var ajaxOptions = {
        error: options.error,
        success: function (response) {
          var results = _.map(response.results, function (json) {
            var obj;
            if (response.className) {
              obj = new Parse.Object(response.className);
            } else {
              obj = new self.objectClass();
            }
            obj._finishFetch(json, true);
            return obj;
          });
          success(results);
          promise.resolve(results);
        },
      };

      var params = this.toJSON();
      ajaxOptions.error = Parse.Query._wrapError(
        options.error,
        ajaxOptions,
        promise
      );
      Parse._request(
        "classes",
        this.className,
        null,
        "GET",
        params,
        ajaxOptions
      );
      return promise;
    },

    /**
     * Counts the number of objects that match this query.
     * Either options.success or options.error is called when the count
     * completes.
     *
     * @param {Object} options A Backbone-style options object.
     * @return {Parse.Promise} A promise that is resolved with the count when
     * the query completes.
     */
    count: function (options) {
      var self = this;
      options = options || {};
      var success = options.success || function () {};
      var promise = new Parse.Promise();

      /** ignore */
      var ajaxOptions = {
        error: options.error,
        success: function (response) {
          success(response.count);
          promise.resolve(response.count);
        },
      };

      var params = this.toJSON();
      params.limit = 0;
      params.count = 1;
      ajaxOptions.error = Parse.Query._wrapError(
        options.error,
        ajaxOptions,
        promise
      );
      Parse._request(
        "classes",
        this.className,
        null,
        "GET",
        params,
        ajaxOptions
      );
      return promise;
    },

    /**
     * Retrieves at most one Parse.Object that satisfies this query.
     *
     * Either options.success or options.error is called when it completes.
     * success is passed the object if there is one. otherwise, undefined.
     *
     * @param {Object} options A Backbone-style options object.
     * @return {Parse.Promise} A promise that is resolved with the object when
     * the query completes.
     */
    first: function (options) {
      var self = this;
      options = options || {};
      var success = options.success || function () {};
      var promise = new Parse.Promise();

      /** ignore */
      var ajaxOptions = {
        error: options.error,
        success: function (response) {
          var result = _.map(response.results, function (json) {
            var obj = new self.objectClass();
            obj._finishFetch(json, true);
            return obj;
          })[0];
          success(result);
          promise.resolve(result);
        },
      };

      var params = this.toJSON();
      params.limit = 1;
      ajaxOptions.error = Parse.Query._wrapError(
        options.error,
        ajaxOptions,
        promise
      );
      Parse._request(
        "classes",
        this.className,
        null,
        "GET",
        params,
        ajaxOptions
      );
      return promise;
    },

    /**
     * Returns a new instance of Parse.Collection backed by this query.
     * @return {Parse.Collection}
     */
    collection: function (items, options) {
      options = options || {};
      return new Parse.Collection(
        items,
        _.extend(options, {
          model: this.objectClass,
          query: this,
        })
      );
    },

    /**
     * Sets the number of results to skip before returning any results.
     * This is useful for pagination.
     * Default is to skip zero results.
     * @param {Number} n the number of results to skip.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    skip: function (n) {
      this._skip = n;
      return this;
    },

    /**
     * Sets the limit of the number of results to return.
     * @param {Number} n the number of results to limit to.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    limit: function (n) {
      this._limit = n;
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be equal to the provided value.
     * @param {String} key The key to check.
     * @param value The value that the Parse.Object must contain.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    equalTo: function (key, value) {
      this._where[key] = Parse._encode(value);
      return this;
    },

    /**
     * Helper for condition queries
     */
    _addCondition: function (key, condition, value) {
      // Check if we already have a condition
      if (!this._where[key]) {
        this._where[key] = {};
      }
      this._where[key][condition] = Parse._encode(value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be not equal to the provided value.
     * @param {String} key The key to check.
     * @param value The value that must not be equalled.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    notEqualTo: function (key, value) {
      this._addCondition(key, "$ne", value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be less than the provided value.
     * @param {String} key The key to check.
     * @param value The value that provides an upper bound.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    lessThan: function (key, value) {
      this._addCondition(key, "$lt", value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be greater than the provided value.
     * @param {String} key The key to check.
     * @param value The value that provides an lower bound.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    greaterThan: function (key, value) {
      this._addCondition(key, "$gt", value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be less than or equal to the provided value.
     * @param {String} key The key to check.
     * @param value The value that provides an upper bound.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    lessThanOrEqualTo: function (key, value) {
      this._addCondition(key, "$lte", value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be greater than or equal to the provided value.
     * @param {String} key The key to check.
     * @param value The value that provides an lower bound.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    greaterThanOrEqualTo: function (key, value) {
      this._addCondition(key, "$gte", value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be contained in the provided list of values.
     * @param {String} key The key to check.
     * @param {Array} values The values that will match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    containedIn: function (key, values) {
      this._addCondition(key, "$in", values);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * not be contained in the provided list of values.
     * @param {String} key The key to check.
     * @param {Array} values The values that will not match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    notContainedIn: function (key, values) {
      this._addCondition(key, "$nin", values);
      return this;
    },

    /**
     * Add a constraint for finding objects that contain the given key.
     * @param {String} key The key that should exist.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    exists: function (key) {
      this._addCondition(key, "$exists", true);
      return this;
    },

    /**
     * Add a constraint for finding objects that do not contain a given key.
     * @param {String} key The key that should not exist
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    doesNotExist: function (key) {
      this._addCondition(key, "$exists", false);
      return this;
    },

    /**
     * Add a regular expression constraint for finding string values that match
     * the provided regular expression.
     * This may be slow for large datasets.
     * @param {String} key The key that the string to match is stored in.
     * @param {RegExp} regex The regular expression pattern to match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    matches: function (key, regex, modifiers) {
      this._addCondition(key, "$regex", regex);
      if (!modifiers) {
        modifiers = "";
      }
      // Javascript regex options support mig as inline options but store them
      // as properties of the object. We support mi & should migrate them to
      // modifiers
      if (regex.ignoreCase) {
        modifiers += "i";
      }
      if (regex.multiline) {
        modifiers += "m";
      }

      if (modifiers && modifiers.length) {
        this._addCondition(key, "$options", modifiers);
      }
      return this;
    },

    /**
     * Add a constraint that requires that a key's value matches a Parse.Query
     * constraint.
     * @param {String} key The key that the contains the object to match the
     *                     query.
     * @param {Parse.Query} query The query that should match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    matchesQuery: function (key, query) {
      var queryJSON = query.toJSON();
      queryJSON.className = query.className;
      this._addCondition(key, "$inQuery", queryJSON);
      return this;
    },

    /**
     * Add a constraint that requires that a key's value not matches a
     * Parse.Query constraint.
     * @param {String} key The key that the contains the object to match the
     *                     query.
     * @param {Parse.Query} query The query that should not match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    doesNotMatchQuery: function (key, query) {
      var queryJSON = query.toJSON();
      queryJSON.className = query.className;
      this._addCondition(key, "$notInQuery", queryJSON);
      return this;
    },

    /**
     * Add a constraint that requires that a key's value matches a value in
     * an object returned by a different Parse.Query.
     * @param {String} key The key that contains the value that is being
     *                     matched.
     * @param {String} queryKey The key in the objects returned by the query to
     *                          match against.
     * @param {Parse.Query} query The query to run.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    matchesKeyInQuery: function (key, queryKey, query) {
      var queryJSON = query.toJSON();
      queryJSON.className = query.className;
      this._addCondition(key, "$select", { key: queryKey, query: queryJSON });
      return this;
    },

    /**
     * Add a constraint that requires that a key's value not match a value in
     * an object returned by a different Parse.Query.
     * @param {String} key The key that contains the value that is being
     *                     excluded.
     * @param {String} queryKey The key in the objects returned by the query to
     *                          match against.
     * @param {Parse.Query} query The query to run.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    doesNotMatchKeyInQuery: function (key, queryKey, query) {
      var queryJSON = query.toJSON();
      queryJSON.className = query.className;
      this._addCondition(key, "$dontSelect", {
        key: queryKey,
        query: queryJSON,
      });
      return this;
    },

    /**
     * Add constraint that at least one of the passed in queries matches.
     * @param {Array} queries
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    _orQuery: function (queries) {
      var queryJSON = _.map(queries, function (q) {
        return q.toJSON().where;
      });

      this._where.$or = queryJSON;
      return this;
    },

    /**
     * Converts a string into a regex that matches it.
     * Surrounding with \Q .. \E does this, we just need to escape \E's in
     * the text separately.
     */
    _quote: function (s) {
      return "\\Q" + s.replace("\\E", "\\E\\\\E\\Q") + "\\E";
    },

    /**
     * Add a constraint for finding string values that contain a provided
     * string.  This may be slow for large datasets.
     * @param {String} key The key that the string to match is stored in.
     * @param {String} substring The substring that the value must contain.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    contains: function (key, value) {
      this._addCondition(key, "$regex", this._quote(value));
      return this;
    },

    /**
     * Add a constraint for finding string values that start with a provided
     * string.  This query will use the backend index, so it will be fast even
     * for large datasets.
     * @param {String} key The key that the string to match is stored in.
     * @param {String} prefix The substring that the value must start with.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    startsWith: function (key, value) {
      this._addCondition(key, "$regex", "^" + this._quote(value));
      return this;
    },

    /**
     * Add a constraint for finding string values that end with a provided
     * string.  This will be slow for large datasets.
     * @param {String} key The key that the string to match is stored in.
     * @param {String} suffix The substring that the value must end with.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    endsWith: function (key, value) {
      this._addCondition(key, "$regex", this._quote(value) + "$");
      return this;
    },

    /**
     * Sorts the results in ascending order by the given key.
     *
     * @param {String} key The key to order by.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    ascending: function (key) {
      this._order = key;
      return this;
    },

    /**
     * Sorts the results in descending order by the given key.
     *
     * @param {String} key The key to order by.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    descending: function (key) {
      this._order = "-" + key;
      return this;
    },

    /**
     * Add a proximity based constraint for finding objects with key point
     * values near the point given.
     * @param {String} key The key that the Parse.GeoPoint is stored in.
     * @param {Parse.GeoPoint} point The reference Parse.GeoPoint that is used.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    near: function (key, point) {
      if (!(point instanceof Parse.GeoPoint)) {
        // Try to cast it to a GeoPoint, so that near("loc", [20,30]) works.
        point = new Parse.GeoPoint(point);
      }
      this._addCondition(key, "$nearSphere", point);
      return this;
    },

    /**
     * Add a proximity based constraint for finding objects with key point
     * values near the point given and within the maximum distance given.
     * @param {String} key The key that the Parse.GeoPoint is stored in.
     * @param {Parse.GeoPoint} point The reference Parse.GeoPoint that is used.
     * @param maxDistance Maximum distance (in radians) of results to return.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    withinRadians: function (key, point, distance) {
      this.near(key, point);
      this._addCondition(key, "$maxDistance", distance);
      return this;
    },

    /**
     * Add a proximity based constraint for finding objects with key point
     * values near the point given and within the maximum distance given.
     * Radius of earth used is 3958.8 miles.
     * @param {String} key The key that the Parse.GeoPoint is stored in.
     * @param {Parse.GeoPoint} point The reference Parse.GeoPoint that is used.
     * @param {Number} maxDistance Maximum distance (in miles) of results to
     *     return.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    withinMiles: function (key, point, distance) {
      return this.withinRadians(key, point, distance / 3958.8);
    },

    /**
     * Add a proximity based constraint for finding objects with key point
     * values near the point given and within the maximum distance given.
     * Radius of earth used is 6371.0 kilometers.
     * @param {String} key The key that the Parse.GeoPoint is stored in.
     * @param {Parse.GeoPoint} point The reference Parse.GeoPoint that is used.
     * @param {Number} maxDistance Maximum distance (in kilometers) of results
     *     to return.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    withinKilometers: function (key, point, distance) {
      return this.withinRadians(key, point, distance / 6371.0);
    },

    /**
     * Add a constraint to the query that requires a particular key's
     * coordinates be contained within a given rectangular geographic bounding
     * box.
     * @param {String} key The key to be constrained.
     * @param {Parse.GeoPoint} southwest
     *     The lower-left inclusive corner of the box.
     * @param {Parse.GeoPoint} northeast
     *     The upper-right inclusive corner of the box.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    withinGeoBox: function (key, southwest, northeast) {
      if (!(southwest instanceof Parse.GeoPoint)) {
        southwest = new Parse.GeoPoint(southwest);
      }
      if (!(northeast instanceof Parse.GeoPoint)) {
        northeast = new Parse.GeoPoint(northeast);
      }
      this._addCondition(key, "$within", { $box: [southwest, northeast] });
      return this;
    },

    /**
     * Include nested Parse.Objects for the provided key.  You can use dot
     * notation to specify which fields in the included object are also fetch.
     * @param {String} key The name of the key to include.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    include: function (key) {
      if (_.isArray(key)) {
        this._include = this._include.concat(key);
      } else {
        this._include.push(key);
      }
      return this;
    },
  };

  // Wrap an optional error callback with a fallback error event.
  Parse.Query._wrapError = function (onError, options, promise) {
    return function (response) {
      var error;
      if (response.responseText) {
        var errorJSON = JSON.parse(response.responseText);
        if (errorJSON) {
          error = new Parse.Error(errorJSON.code, errorJSON.error);
        }
      }
      error = error || new Parse.Error(-1, response.responseText);
      if (onError) {
        onError(error, options);
      }
      if (promise) {
        promise.reject(error);
      }
    };
  };
})(this);

/*global FB: false */
(function (root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  var PUBLIC_KEY = "*";

  var initialized = false;
  var requestedPermissions;
  var initOptions;
  var provider = {
    authenticate: function (options) {
      var self = this;
      FB.login(
        function (response) {
          if (response.authResponse) {
            if (options.success) {
              options.success(self, {
                id: response.authResponse.userID,
                access_token: response.authResponse.accessToken,
                expiration_date: new Date(
                  response.authResponse.expiresIn * 1000 + new Date().getTime()
                ).toJSON(),
              });
            }
          } else {
            if (options.error) {
              options.error(self, response);
            }
          }
        },
        {
          scope: requestedPermissions,
        }
      );
    },
    restoreAuthentication: function (authData) {
      if (authData) {
        var authResponse = {
          userID: authData.id,
          accessToken: authData.access_token,
          expiresIn:
            (Parse._parseDate(authData.expiration_date).getTime() -
              new Date().getTime()) /
            1000,
        };
        var newOptions = _.clone(initOptions);
        newOptions.authResponse = authResponse;
        FB.init(newOptions);
      }
      return true;
    },
    getAuthType: function () {
      return "facebook";
    },
    deauthenticate: function () {
      this.restoreAuthentication(null);
      FB.logout();
    },
  };

  /**
   * Provides a set of utilities for using Parse with Facebook.
   * @namespace
   * Provides a set of utilities for using Parse with Facebook.
   */
  Parse.FacebookUtils = {
    /**
     * Initializes Parse Facebook integration.  Call this function after you
     * have loaded the Facebook Javascript SDK with the same parameters
     * as you would pass to<code>
     * <a href=
     * "https://developers.facebook.com/docs/reference/javascript/FB.init/">
     * FB.init()</a></code>.  Parse.FacebookUtils will invoke FB.init() for you
     * with these arguments.
     *
     * @param {Object} options Facebook options argument as described here:
     *   <a href=
     *   "https://developers.facebook.com/docs/reference/javascript/FB.init/">
     *   FB.init()</a>
     */
    init: function (options) {
      if (typeof FB === "undefined") {
        throw "The Javascript Facebook SDK must be loaded before calling init.";
      }
      initOptions = _.clone(options);
      FB.init(initOptions);
      Parse.User._registerAuthenticationProvider(provider);
      initialized = true;
    },

    /**
     * Gets whether the user has their account linked to Facebook.
     *
     * @param {Parse.User} user User to check for a facebook link.
     *     The user must be logged in on this device.
     * @return {Boolean} <code>true</code> if the user has their account
     *     linked to Facebook.
     */
    isLinked: function (user) {
      return user._isLinked("facebook");
    },

    /**
     * Logs in a user using Facebook. This method delegates to the Facebook
     * SDK to authenticate the user, and then automatically logs in (or
     * creates, in the case where it is a new user) a Parse.User.
     *
     * @param {String, Object} permissions The permissions required for Facebook
     *    log in.  This is a comma-separated string of permissions.
     *    Alternatively, supply a Facebook authData object as described in our
     *    REST API docs if you want to handle getting facebook auth tokens
     *    yourself.
     * @param {Object} options Standard options object with success and error
     *    callbacks.
     */
    logIn: function (permissions, options) {
      if (!permissions || _.isString(permissions)) {
        if (!initialized) {
          throw "You must initialize FacebookUtils before calling logIn.";
        }
        requestedPermissions = permissions;
        return Parse.User._logInWith("facebook", options);
      } else {
        var newOptions = _.clone(options);
        newOptions.authData = permissions;
        return Parse.User._logInWith("facebook", newOptions);
      }
    },

    /**
     * Links Facebook to an existing PFUser. This method delegates to the
     * Facebook SDK to authenticate the user, and then automatically links
     * the account to the Parse.User.
     *
     * @param {Parse.User} user User to link to Facebook. This must be the
     *     current user.
     * @param {String, Object} permissions The permissions required for Facebook
     *    log in.  This is a comma-separated string of permissions.
     *    Alternatively, supply a Facebook authData object as described in our
     *    REST API docs if you want to handle getting facebook auth tokens
     *    yourself.
     * @param {Object} options Standard options object with success and error
     *    callbacks.
     */
    link: function (user, permissions, options) {
      if (!permissions || _.isString(permissions)) {
        if (!initialized) {
          throw "You must initialize FacebookUtils before calling link.";
        }
        requestedPermissions = permissions;
        return user._linkWith("facebook", options);
      } else {
        var newOptions = _.clone(options);
        newOptions.authData = permissions;
        return user._linkWith("facebook", newOptions);
      }
    },

    /**
     * Unlinks the Parse.User from a Facebook account.
     *
     * @param {Parse.User} user User to unlink from Facebook. This must be the
     *     current user.
     * @param {Object} options Standard options object with success and error
     *    callbacks.
     */
    unlink: function (user, options) {
      if (!initialized) {
        throw "You must initialize FacebookUtils before calling unlink.";
      }
      return user._unlinkFrom("facebook", options);
    },
  };
})(this);

/*global _: false, document: false, window: false, navigator: false */
(function (root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * History serves as a global router (per frame) to handle hashchange
   * events or pushState, match the appropriate route, and trigger
   * callbacks. You shouldn't ever have to create one of these yourself
   * — you should use the reference to <code>Parse.history</code>
   * that will be created for you automatically if you make use of
   * Routers with routes.
   * @class
   *
   * <p>A fork of Backbone.History, provided for your convenience.  If you
   * use this class, you must also include jQuery, or another library
   * that provides a jQuery-compatible $ function.  For more information,
   * see the <a href="http://documentcloud.github.com/backbone/#History">
   * Backbone documentation</a>.</p>
   * <p><strong><em>Available in the client SDK only.</em></strong></p>
   */
  Parse.History = function () {
    this.handlers = [];
    _.bindAll(this, "checkUrl");
  };

  // Cached regex for cleaning leading hashes and slashes .
  var routeStripper = /^[#\/]/;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Has the history handling already been started?
  Parse.History.started = false;

  // Set up all inheritable **Parse.History** properties and methods.
  _.extend(
    Parse.History.prototype,
    Parse.Events,
    /** @lends Parse.History.prototype */ {
      // The default interval to poll for hash changes, if necessary, is
      // twenty times a second.
      interval: 50,

      // Gets the true hash value. Cannot use location.hash directly due to bug
      // in Firefox where location.hash will always be decoded.
      getHash: function (windowOverride) {
        var loc = windowOverride ? windowOverride.location : window.location;
        var match = loc.href.match(/#(.*)$/);
        return match ? match[1] : "";
      },

      // Get the cross-browser normalized URL fragment, either from the URL,
      // the hash, or the override.
      getFragment: function (fragment, forcePushState) {
        if (Parse._isNullOrUndefined(fragment)) {
          if (this._hasPushState || forcePushState) {
            fragment = window.location.pathname;
            var search = window.location.search;
            if (search) {
              fragment += search;
            }
          } else {
            fragment = this.getHash();
          }
        }
        if (!fragment.indexOf(this.options.root)) {
          fragment = fragment.substr(this.options.root.length);
        }
        return fragment.replace(routeStripper, "");
      },

      /**
       * Start the hash change handling, returning `true` if the current
       * URL matches an existing route, and `false` otherwise.
       */
      start: function (options) {
        if (Parse.History.started) {
          throw new Error("Parse.history has already been started");
        }
        Parse.History.started = true;

        // Figure out the initial configuration. Do we need an iframe?
        // Is pushState desired ... is it available?
        this.options = _.extend({}, { root: "/" }, this.options, options);
        this._wantsHashChange = this.options.hashChange !== false;
        this._wantsPushState = !!this.options.pushState;
        this._hasPushState = !!(
          this.options.pushState &&
          window.history &&
          window.history.pushState
        );
        var fragment = this.getFragment();
        var docMode = document.documentMode;
        var oldIE =
          isExplorer.exec(navigator.userAgent.toLowerCase()) &&
          (!docMode || docMode <= 7);

        if (oldIE) {
          this.iframe = Parse.$('<iframe src="javascript:0" tabindex="-1" />')
            .hide()
            .appendTo("body")[0].contentWindow;
          this.navigate(fragment);
        }

        // Depending on whether we're using pushState or hashes, and whether
        // 'onhashchange' is supported, determine how we check the URL state.
        if (this._hasPushState) {
          Parse.$(window).bind("popstate", this.checkUrl);
        } else if (
          this._wantsHashChange &&
          "onhashchange" in window &&
          !oldIE
        ) {
          Parse.$(window).bind("hashchange", this.checkUrl);
        } else if (this._wantsHashChange) {
          this._checkUrlInterval = window.setInterval(
            this.checkUrl,
            this.interval
          );
        }

        // Determine if we need to change the base url, for a pushState link
        // opened by a non-pushState browser.
        this.fragment = fragment;
        var loc = window.location;
        var atRoot = loc.pathname === this.options.root;

        // If we've started off with a route from a `pushState`-enabled browser,
        // but we're currently in a browser that doesn't support it...
        if (
          this._wantsHashChange &&
          this._wantsPushState &&
          !this._hasPushState &&
          !atRoot
        ) {
          this.fragment = this.getFragment(null, true);
          window.location.replace(this.options.root + "#" + this.fragment);
          // Return immediately as browser will do redirect to new url
          return true;

          // Or if we've started out with a hash-based route, but we're currently
          // in a browser where it could be `pushState`-based instead...
        } else if (
          this._wantsPushState &&
          this._hasPushState &&
          atRoot &&
          loc.hash
        ) {
          this.fragment = this.getHash().replace(routeStripper, "");
          window.history.replaceState(
            {},
            document.title,
            loc.protocol + "//" + loc.host + this.options.root + this.fragment
          );
        }

        if (!this.options.silent) {
          return this.loadUrl();
        }
      },

      // Disable Parse.history, perhaps temporarily. Not useful in a real app,
      // but possibly useful for unit testing Routers.
      stop: function () {
        Parse.$(window)
          .unbind("popstate", this.checkUrl)
          .unbind("hashchange", this.checkUrl);
        window.clearInterval(this._checkUrlInterval);
        Parse.History.started = false;
      },

      // Add a route to be tested when the fragment changes. Routes added later
      // may override previous routes.
      route: function (route, callback) {
        this.handlers.unshift({ route: route, callback: callback });
      },

      // Checks the current URL to see if it has changed, and if it has,
      // calls `loadUrl`, normalizing across the hidden iframe.
      checkUrl: function (e) {
        var current = this.getFragment();
        if (current === this.fragment && this.iframe) {
          current = this.getFragment(this.getHash(this.iframe));
        }
        if (current === this.fragment) {
          return false;
        }
        if (this.iframe) {
          this.navigate(current);
        }
        if (!this.loadUrl()) {
          this.loadUrl(this.getHash());
        }
      },

      // Attempt to load the current URL fragment. If a route succeeds with a
      // match, returns `true`. If no defined routes matches the fragment,
      // returns `false`.
      loadUrl: function (fragmentOverride) {
        var fragment = (this.fragment = this.getFragment(fragmentOverride));
        var matched = _.any(this.handlers, function (handler) {
          if (handler.route.test(fragment)) {
            handler.callback(fragment);
            return true;
          }
        });
        return matched;
      },

      // Save a fragment into the hash history, or replace the URL state if the
      // 'replace' option is passed. You are responsible for properly URL-encoding
      // the fragment in advance.
      //
      // The options object can contain `trigger: true` if you wish to have the
      // route callback be fired (not usually desirable), or `replace: true`, if
      // you wish to modify the current URL without adding an entry to the
      // history.
      navigate: function (fragment, options) {
        if (!Parse.History.started) {
          return false;
        }
        if (!options || options === true) {
          options = { trigger: options };
        }
        var frag = (fragment || "").replace(routeStripper, "");
        if (this.fragment === frag) {
          return;
        }

        // If pushState is available, we use it to set the fragment as a real URL.
        if (this._hasPushState) {
          if (frag.indexOf(this.options.root) !== 0) {
            frag = this.options.root + frag;
          }
          this.fragment = frag;
          var replaceOrPush = options.replace ? "replaceState" : "pushState";
          window.history[replaceOrPush]({}, document.title, frag);

          // If hash changes haven't been explicitly disabled, update the hash
          // fragment to store history.
        } else if (this._wantsHashChange) {
          this.fragment = frag;
          this._updateHash(window.location, frag, options.replace);
          if (
            this.iframe &&
            frag !== this.getFragment(this.getHash(this.iframe))
          ) {
            // Opening and closing the iframe tricks IE7 and earlier
            // to push a history entry on hash-tag change.
            // When replace is true, we don't want this.
            if (!options.replace) {
              this.iframe.document.open().close();
            }
            this._updateHash(this.iframe.location, frag, options.replace);
          }

          // If you've told us that you explicitly don't want fallback hashchange-
          // based history, then `navigate` becomes a page refresh.
        } else {
          window.location.assign(this.options.root + fragment);
        }
        if (options.trigger) {
          this.loadUrl(fragment);
        }
      },

      // Update the hash location, either replacing the current entry, or adding
      // a new one to the browser history.
      _updateHash: function (location, fragment, replace) {
        if (replace) {
          var s = location.toString().replace(/(javascript:|#).*$/, "");
          location.replace(s + "#" + fragment);
        } else {
          location.hash = fragment;
        }
      },
    }
  );
})(this);

/*global _: false*/
(function (root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Routers map faux-URLs to actions, and fire events when routes are
   * matched. Creating a new one sets its `routes` hash, if not set statically.
   * @class
   *
   * <p>A fork of Backbone.Router, provided for your convenience.
   * For more information, see the
   * <a href="http://documentcloud.github.com/backbone/#Router">Backbone
   * documentation</a>.</p>
   * <p><strong><em>Available in the client SDK only.</em></strong></p>
   */
  Parse.Router = function (options) {
    options = options || {};
    if (options.routes) {
      this.routes = options.routes;
    }
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam = /:\w+/g;
  var splatParam = /\*\w+/g;
  var escapeRegExp = /[\-\[\]{}()+?.,\\\^\$\|#\s]/g;

  // Set up all inheritable **Parse.Router** properties and methods.
  _.extend(
    Parse.Router.prototype,
    Parse.Events,
    /** @lends Parse.Router.prototype */ {
      /**
       * Initialize is an empty function by default. Override it with your own
       * initialization logic.
       */
      initialize: function () {},

      /**
       * Manually bind a single named route to a callback. For example:
       *
       * <pre>this.route('search/:query/p:num', 'search', function(query, num) {
       *       ...
       *     });</pre>
       */
      route: function (route, name, callback) {
        Parse.history = Parse.history || new Parse.History();
        if (!_.isRegExp(route)) {
          route = this._routeToRegExp(route);
        }
        if (!callback) {
          callback = this[name];
        }
        Parse.history.route(
          route,
          _.bind(function (fragment) {
            var args = this._extractParameters(route, fragment);
            if (callback) {
              callback.apply(this, args);
            }
            this.trigger.apply(this, ["route:" + name].concat(args));
            Parse.history.trigger("route", this, name, args);
          }, this)
        );
        return this;
      },

      /**
       * Whenever you reach a point in your application that you'd
       * like to save as a URL, call navigate in order to update the
       * URL. If you wish to also call the route function, set the
       * trigger option to true. To update the URL without creating
       * an entry in the browser's history, set the replace option
       * to true.
       */
      navigate: function (fragment, options) {
        Parse.history.navigate(fragment, options);
      },

      // Bind all defined routes to `Parse.history`. We have to reverse the
      // order of the routes here to support behavior where the most general
      // routes can be defined at the bottom of the route map.
      _bindRoutes: function () {
        if (!this.routes) {
          return;
        }
        var routes = [];
        for (var route in this.routes) {
          if (this.routes.hasOwnProperty(route)) {
            routes.unshift([route, this.routes[route]]);
          }
        }
        for (var i = 0, l = routes.length; i < l; i++) {
          this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
        }
      },

      // Convert a route string into a regular expression, suitable for matching
      // against the current location hash.
      _routeToRegExp: function (route) {
        route = route
          .replace(escapeRegExp, "\\$&")
          .replace(namedParam, "([^/]+)")
          .replace(splatParam, "(.*?)");
        return new RegExp("^" + route + "$");
      },

      // Given a route, and a URL fragment that it matches, return the array of
      // extracted parameters.
      _extractParameters: function (route, fragment) {
        return route.exec(fragment).slice(1);
      },
    }
  );

  /**
   * @function
   * @param {Object} instanceProps Instance properties for the router.
   * @param {Object} classProps Class properies for the router.
   * @return {Class} A new subclass of <code>Parse.Router</code>.
   */
  Parse.Router.extend = Parse._extend;
})(this);
(function (root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   *
   *
   * @namespace Contains functions for calling and declaring
   * <a href="/docs/cloud_code_guide#functions">cloud functions</a>.
   * <p><strong><em>
   *   Some functions are only available from Cloud Code.
   * </em></strong></p>
   */
  Parse.Cloud = {
    /**
     * Makes a call to a cloud function.
     * @param {String} name The function name.
     * @param {Object} data The parameters to send to the cloud function.
     * @param {Object} options A Backbone-style options object
     * options.success, if set, should be a function to handle a successful
     * call to a cloud function.  options.error should be a function that
     * handles an error running the cloud function.  Both functions are
     * optional.  Both functions take a single argument.
     */
    run: function (name, data, options) {
      var oldOptions = options;
      var newOptions = _.clone(options);
      newOptions.success = function (resp) {
        var results = Parse._decode(null, resp);
        if (oldOptions.success) {
          oldOptions.success(results.result);
        }
      };

      newOptions.error = Parse.Cloud._wrapError(oldOptions.error, options);
      Parse._request(
        "functions",
        name,
        null,
        "POST",
        Parse._encode(data, null, true),
        newOptions
      );
    },

    _wrapError: function (onError, options) {
      return function (response) {
        if (onError) {
          var error = new Parse.Error(-1, response.responseText);
          if (response.responseText) {
            var errorJSON = JSON.parse(response.responseText);
            if (errorJSON) {
              error = new Parse.Error(errorJSON.code, errorJSON.error);
            }
          }
          onError(error, options);
        }
      };
    },
  };
})(this);

(function (root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;

  Parse.Installation = Parse.Object.extend("_Installation");

  /**
   * Contains functions to deal with Push in Parse
   * @name Parse.Push
   * @namespace
   */
  Parse.Push = Parse.Push || {};

  /**
   * Sends a push notification.
   * @param {Object} data -  The data of the push notification.  Valid fields
   * are:
   *   <ol>
   *     <li>channels - An Array of channels to push to.</li>
   *     <li>push_time - A Date object for when to send the push.</li>
   *     <li>expiration_time -  A Date object for when to expire
   *         the push.</li>
   *     <li>expiration_interval - The seconds from now to expire the push.</li>
   *     <li>where - A Parse.Query over Parse.Installation that is used to match
   *         a set of installations to push to.</li>
   *     <li>data - The data to send as part of the push</li>
   *   <ol>
   * @param {Object} options An object that has an optional success function,
   * that takes no arguments and will be called on a successful push, and
   * an error function that takes a Parse.Error and will be called if the push
   * failed.
   */
  Parse.Push.send = function (data, options) {
    if (data.where) {
      data.where = data.where.toJSON().where;
    }

    if (data.push_time) {
      data.push_time = data.push_time.toJSON();
    }

    if (data.expiration_time) {
      data.expiration_time = data.expiration_time.toJSON();
    }

    if (data.expiration_time && data.expiration_time_interval) {
      throw "Both expiration_time and expiration_time_interval can't be set";
    }
    var ajaxOptions = {
      error: options.error,
      success: options.success,
    };
    ajaxOptions.error = Parse.Query._wrapError(options.error, ajaxOptions);
    Parse._request("push", null, null, "POST", data, ajaxOptions);
  };
})(this);
