/*
  knockback-full-stack.js 0.16.6
  (c) 2011, 2012 Kevin Malakoff - http://kmalakoff.github.com/knockback/
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
*/
//     Underscore.js 1.3.3
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.3.3';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    if (obj.length === +obj.length) results.length = obj.length;
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = _.toArray(obj).reverse();
    if (context && !initial) iterator = _.bind(iterator, context);
    return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
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
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    found = any(obj, function(value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.max.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.min.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var shuffled = [], rand;
    each(obj, function(value, index, list) {
      rand = Math.floor(Math.random() * (index + 1));
      shuffled[index] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, val, context) {
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      if (a === void 0) return 1;
      if (b === void 0) return -1;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, val) {
    var result = {};
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj)                                     return [];
    if (_.isArray(obj))                           return slice.call(obj);
    if (_.isArguments(obj))                       return slice.call(obj);
    if (obj.toArray && _.isFunction(obj.toArray)) return obj.toArray();
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.isArray(obj) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especcialy useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var results = [];
    // The `isSorted` flag is irrelevant if the array only contains two elements.
    if (array.length < 3) isSorted = true;
    _.reduce(initial, function (memo, value, index) {
      if (isSorted ? _.last(memo) !== value || !memo.length : !_.include(memo, value)) {
        memo.push(value);
        results.push(array[index]);
      }
      return memo;
    }, []);
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = _.flatten(slice.call(arguments, 1), true);
    return _.filter(array, function(value){ return !_.include(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
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
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more, result;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
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
  _.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
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
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var result = {};
    each(_.flatten(slice.call(arguments, 1)), function(key) {
      if (key in obj) result[key] = obj[key];
    });
    return result;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
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
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
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
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          // Ensure commutative equality for sparse arrays.
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent.
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
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
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    stack.pop();
    return result;
  }

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return toString.call(obj) == '[object Arguments]';
  };
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Is a given value a function?
  _.isFunction = function(obj) {
    return toString.call(obj) == '[object Function]';
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return toString.call(obj) == '[object String]';
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return toString.call(obj) == '[object Number]';
  };

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return _.isNumber(obj) && isFinite(obj);
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    // `NaN` is the only value for which `===` is not reflexive.
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return toString.call(obj) == '[object Date]';
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return toString.call(obj) == '[object RegExp]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Has own property?
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Escape a string for HTML interpolation.
  _.escape = function(string) {
    return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /.^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    '\\': '\\',
    "'": "'",
    'r': '\r',
    'n': '\n',
    't': '\t',
    'u2028': '\u2028',
    'u2029': '\u2029'
  };

  for (var p in escapes) escapes[escapes[p]] = p;
  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

  // Within an interpolation, evaluation, or escaping, remove HTML escaping
  // that had been previously added.
  var unescape = function(code) {
    return code.replace(unescaper, function(match, escape) {
      return escapes[escape];
    });
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    settings = _.defaults(settings || {}, _.templateSettings);

    // Compile the template source, taking care to escape characters that
    // cannot be included in a string literal and then unescape them in code
    // blocks.
    var source = "__p+='" + text
      .replace(escaper, function(match) {
        return '\\' + escapes[match];
      })
      .replace(settings.escape || noMatch, function(match, code) {
        return "'+\n_.escape(" + unescape(code) + ")+\n'";
      })
      .replace(settings.interpolate || noMatch, function(match, code) {
        return "'+\n(" + unescape(code) + ")+\n'";
      })
      .replace(settings.evaluate || noMatch, function(match, code) {
        return "';\n" + unescape(code) + "\n;__p+='";
      }) + "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __p='';" +
      "var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" +
      source + "return __p;\n";

    var render = new Function(settings.variable || 'obj', '_', source);
    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for build time
    // precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' +
      source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      var wrapped = this._wrapped;
      method.apply(wrapped, arguments);
      var length = wrapped.length;
      if ((name == 'shift' || name == 'splice') && length === 0) delete wrapped[0];
      return result(wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

}).call(this);
//     Backbone.js 0.9.2

//     (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `global`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create a local reference to slice/splice.
  var slice = Array.prototype.slice;
  var splice = Array.prototype.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '0.9.2';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, or Ender owns the `$` variable.
  var $ = root.jQuery || root.Zepto || root.ender;

  // Set the JavaScript library that will be used for DOM manipulation and
  // Ajax calls (a.k.a. the `$` variable). By default Backbone will use: jQuery,
  // Zepto, or Ender; but the `setDomLibrary()` method lets you inject an
  // alternate JavaScript library (or a mock library for testing your views
  // outside of a browser).
  Backbone.setDomLibrary = function(lib) {
    $ = lib;
  };

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // -----------------

  // Regular expression used to split event strings
  var eventSplitter = /\s+/;

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback functions
  // to an event; trigger`-ing an event fires all callbacks in succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind one or more space separated events, `events`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    on: function(events, callback, context) {

      var calls, event, node, tail, list;
      if (!callback) return this;
      events = events.split(eventSplitter);
      calls = this._callbacks || (this._callbacks = {});

      // Create an immutable callback list, allowing traversal during
      // modification.  The tail is an empty object that will always be used
      // as the next node.
      while (event = events.shift()) {
        list = calls[event];
        node = list ? list.tail : {};
        node.next = tail = {};
        node.context = context;
        node.callback = callback;
        calls[event] = {tail: tail, next: list ? list.next : node};
      }

      return this;
    },

    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `events` is null, removes all bound callbacks for all events.
    off: function(events, callback, context) {
      var event, calls, node, tail, cb, ctx;

      // No events, or removing *all* events.
      if (!(calls = this._callbacks)) return;
      if (!(events || callback || context)) {
        delete this._callbacks;
        return this;
      }

      // Loop through the listed events and contexts, splicing them out of the
      // linked list of callbacks if appropriate.
      events = events ? events.split(eventSplitter) : _.keys(calls);
      while (event = events.shift()) {
        node = calls[event];
        delete calls[event];
        if (!node || !(callback || context)) continue;
        // Create a new list, omitting the indicated callbacks.
        tail = node.tail;
        while ((node = node.next) !== tail) {
          cb = node.callback;
          ctx = node.context;
          if ((callback && cb !== callback) || (context && ctx !== context)) {
            this.on(event, cb, ctx);
          }
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(events) {
      var event, node, calls, tail, args, all, rest;
      if (!(calls = this._callbacks)) return this;
      all = calls.all;
      events = events.split(eventSplitter);
      rest = slice.call(arguments, 1);

      // For each event, walk through the linked list of callbacks twice,
      // first to trigger the event, then to trigger any `"all"` callbacks.
      while (event = events.shift()) {
        if (node = calls[event]) {
          tail = node.tail;
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, rest);
          }
        }
        if (node = all) {
          tail = node.tail;
          args = [event].concat(rest);
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, args);
          }
        }
      }

      return this;
    }

  };

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Backbone.Model
  // --------------

  // Create a new model, with defined attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var defaults;
    attributes || (attributes = {});
    if (options && options.parse) attributes = this.parse(attributes);
    if (defaults = getValue(this, 'defaults')) {
      attributes = _.extend({}, defaults, attributes);
    }
    if (options && options.collection) this.collection = options.collection;
    this.attributes = {};
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this.set(attributes, {silent: true});
    // Reset change tracking.
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this._previousAttributes = _.clone(this.attributes);
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // A hash of attributes that have silently changed since the last time
    // `change` was called.  Will become pending attributes on the next call.
    _silent: null,

    // A hash of attributes that have changed since the last `'change'` event
    // began.
    _pending: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      var html;
      if (html = this._escapedAttributes[attr]) return html;
      var val = this.get(attr);
      return this._escapedAttributes[attr] = _.escape(val == null ? '' : '' + val);
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"` unless
    // you choose to silence it.
    set: function(key, value, options) {
      var attrs, attr, val;

      // Handle both
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }

      // Extract attributes and options.
      options || (options = {});
      if (!attrs) return this;
      if (attrs instanceof Model) attrs = attrs.attributes;
      if (options.unset) for (attr in attrs) attrs[attr] = void 0;

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      var changes = options.changes = {};
      var now = this.attributes;
      var escaped = this._escapedAttributes;
      var prev = this._previousAttributes || {};

      // For each `set` attribute...
      for (attr in attrs) {
        val = attrs[attr];

        // If the new and current value differ, record the change.
        if (!_.isEqual(now[attr], val) || (options.unset && _.has(now, attr))) {
          delete escaped[attr];
          (options.silent ? this._silent : changes)[attr] = true;
        }

        // Update or delete the current value.
        options.unset ? delete now[attr] : now[attr] = val;

        // If the new and previous value differ, record the change.  If not,
        // then remove changes for this attribute.
        if (!_.isEqual(prev[attr], val) || (_.has(now, attr) != _.has(prev, attr))) {
          this.changed[attr] = val;
          if (!options.silent) this._pending[attr] = true;
        } else {
          delete this.changed[attr];
          delete this._pending[attr];
        }
      }

      // Fire the `"change"` events.
      if (!options.silent) this.change(options);
      return this;
    },

    // Remove an attribute from the model, firing `"change"` unless you choose
    // to silence it. `unset` is a noop if the attribute doesn't exist.
    unset: function(attr, options) {
      (options || (options = {})).unset = true;
      return this.set(attr, null, options);
    },

    // Clear all attributes on the model, firing `"change"` unless you choose
    // to silence it.
    clear: function(options) {
      (options || (options = {})).unset = true;
      return this.set(_.clone(this.attributes), options);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overriden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp);
      };
      options.error = Backbone.wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, value, options) {
      var attrs, current;

      // Handle both `("key", value)` and `({key: value})` -style calls.
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }
      options = options ? _.clone(options) : {};

      // If we're "wait"-ing to set changed attributes, validate early.
      if (options.wait) {
        if (!this._validate(attrs, options)) return false;
        current = _.clone(this.attributes);
      }

      // Regular saves `set` attributes before persisting to the server.
      var silentOptions = _.extend({}, options, {silent: true});
      if (attrs && !this.set(attrs, options.wait ? silentOptions : options)) {
        return false;
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        var serverAttrs = model.parse(resp, xhr);
        if (options.wait) {
          delete options.wait;
          serverAttrs = _.extend(attrs || {}, serverAttrs);
        }
        if (!model.set(serverAttrs, options)) return false;
        if (success) {
          success(model, resp);
        } else {
          model.trigger('sync', model, resp, options);
        }
      };

      // Finish configuring and sending the Ajax request.
      options.error = Backbone.wrapError(options.error, model, options);
      var method = this.isNew() ? 'create' : 'update';
      var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
      if (options.wait) this.set(current, silentOptions);
      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var triggerDestroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      if (this.isNew()) {
        triggerDestroy();
        return false;
      }

      options.success = function(resp) {
        if (options.wait) triggerDestroy();
        if (success) {
          success(model, resp);
        } else {
          model.trigger('sync', model, resp, options);
        }
      };

      options.error = Backbone.wrapError(options.error, model, options);
      var xhr = (this.sync || Backbone.sync).call(this, 'delete', this, options);
      if (!options.wait) triggerDestroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = getValue(this, 'urlRoot') || getValue(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, xhr) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Call this method to manually fire a `"change"` event for this model and
    // a `"change:attribute"` event for each changed attribute.
    // Calling this will cause all objects observing the model to update.
    change: function(options) {
      options || (options = {});
      var changing = this._changing;
      this._changing = true;

      // Silent changes become pending changes.
      for (var attr in this._silent) this._pending[attr] = true;

      // Silent changes are triggered.
      var changes = _.extend({}, options.changes, this._silent);
      this._silent = {};
      for (var attr in changes) {
        this.trigger('change:' + attr, this, this.get(attr), options);
      }
      if (changing) return this;

      // Continue firing `"change"` events while there are pending changes.
      while (!_.isEmpty(this._pending)) {
        this._pending = {};
        this.trigger('change', this, options);
        // Pending and silent changes still remain.
        for (var attr in this.changed) {
          if (this._pending[attr] || this._silent[attr]) continue;
          delete this.changed[attr];
        }
        this._previousAttributes = _.clone(this.attributes);
      }

      this._changing = false;
      return this;
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (!arguments.length) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false, old = this._previousAttributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (!arguments.length || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Check if the model is currently in a valid state. It's only possible to
    // get into an *invalid* state if you're using silent changes.
    isValid: function() {
      return !this.validate(this.attributes);
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. If a specific `error` callback has
    // been passed, call that instead of firing the general `"error"` event.
    _validate: function(attrs, options) {
      if (options.silent || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validate(attrs, options);
      if (!error) return true;
      if (options && options.error) {
        options.error(this, error, options);
      } else {
        this.trigger('error', this, error, options);
      }
      return false;
    }

  });

  // Backbone.Collection
  // -------------------

  // Provides a standard collection class for our sets of models, ordered
  // or unordered. If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, {silent: true, parse: options.parse});
  };

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Add a model, or list of models to the set. Pass **silent** to avoid
    // firing the `add` event for every new model.
    add: function(models, options) {
      var i, index, length, model, cid, id, cids = {}, ids = {}, dups = [];
      options || (options = {});
      models = _.isArray(models) ? models.slice() : [models];

      // Begin by turning bare objects into model references, and preventing
      // invalid models or duplicate models from being added.
      for (i = 0, length = models.length; i < length; i++) {
        if (!(model = models[i] = this._prepareModel(models[i], options))) {
          throw new Error("Can't add an invalid model to a collection");
        }
        cid = model.cid;
        id = model.id;
        if (cids[cid] || this._byCid[cid] || ((id != null) && (ids[id] || this._byId[id]))) {
          dups.push(i);
          continue;
        }
        cids[cid] = ids[id] = model;
      }

      // Remove duplicates.
      i = dups.length;
      while (i--) {
        models.splice(dups[i], 1);
      }

      // Listen to added models' events, and index models for lookup by
      // `id` and by `cid`.
      for (i = 0, length = models.length; i < length; i++) {
        (model = models[i]).on('all', this._onModelEvent, this);
        this._byCid[model.cid] = model;
        if (model.id != null) this._byId[model.id] = model;
      }

      // Insert models into the collection, re-sorting if needed, and triggering
      // `add` events unless silenced.
      this.length += length;
      index = options.at != null ? options.at : this.models.length;
      splice.apply(this.models, [index, 0].concat(models));
      if (this.comparator) this.sort({silent: true});
      if (options.silent) return this;
      for (i = 0, length = this.models.length; i < length; i++) {
        if (!cids[(model = this.models[i]).cid]) continue;
        options.index = i;
        model.trigger('add', model, this, options);
      }
      return this;
    },

    // Remove a model, or a list of models from the set. Pass silent to avoid
    // firing the `remove` event for every model removed.
    remove: function(models, options) {
      var i, l, index, model;
      options || (options = {});
      models = _.isArray(models) ? models.slice() : [models];
      for (i = 0, l = models.length; i < l; i++) {
        model = this.getByCid(models[i]) || this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byCid[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, options);
      return model;
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: 0}, options));
      return model;
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Get a model from the set by id.
    get: function(id) {
      if (id == null) return void 0;
      return this._byId[id.id != null ? id.id : id];
    },

    // Get a model from the set by client id.
    getByCid: function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of `filter`.
    where: function(attrs) {
      if (_.isEmpty(attrs)) return [];
      return this.filter(function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      options || (options = {});
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      var boundComparator = _.bind(this.comparator, this);
      if (this.comparator.length == 1) {
        this.models = this.sortBy(boundComparator);
      } else {
        this.models.sort(boundComparator);
      }
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.map(this.models, function(model){ return model.get(attr); });
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `add` or `remove` events. Fires `reset` when finished.
    reset: function(models, options) {
      models  || (models = []);
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      this._reset();
      this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `add: true` is passed, appends the
    // models to the collection instead of resetting.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === undefined) options.parse = true;
      var collection = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
        if (success) success(collection, resp);
      };
      options.error = Backbone.wrapError(options.error, collection, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      var coll = this;
      options = options ? _.clone(options) : {};
      model = this._prepareModel(model, options);
      if (!model) return false;
      if (!options.wait) coll.add(model, options);
      var success = options.success;
      options.success = function(nextModel, resp, xhr) {
        if (options.wait) coll.add(nextModel, options);
        if (success) {
          success(nextModel, resp);
        } else {
          nextModel.trigger('sync', model, resp, options);
        }
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, xhr) {
      return resp;
    },

    // Proxy to _'s chain. Can't be proxied the same way the rest of the
    // underscore methods are proxied because it relies on the underscore
    // constructor.
    chain: function () {
      return _(this.models).chain();
    },

    // Reset all internal state. Called when the collection is reset.
    _reset: function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    // Prepare a model or hash of attributes to be added to this collection.
    _prepareModel: function(model, options) {
      options || (options = {});
      if (!(model instanceof Model)) {
        var attrs = model;
        options.collection = this;
        model = new this.model(attrs, options);
        if (!model._validate(model.attributes, options)) model = false;
      } else if (!model.collection) {
        model.collection = this;
      }
      return model;
    },

    // Internal method to remove a model's ties to a collection.
    _removeReference: function(model) {
      if (this == model.collection) {
        delete model.collection;
      }
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event == 'add' || event == 'remove') && collection != this) return;
      if (event == 'destroy') {
        this.remove(model, options);
      }
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find',
    'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any',
    'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex',
    'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf',
    'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  // Backbone.Router
  // -------------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam    = /:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      Backbone.history || (Backbone.history = new History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (!callback) callback = this[name];
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback && callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
        Backbone.history.trigger('route', this, name, args);
      }, this));
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      var routes = [];
      for (var route in this.routes) {
        routes.unshift([route, this.routes[route]]);
      }
      for (var i = 0, l = routes.length; i < l; i++) {
        this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(namedParam, '([^\/]+)')
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters: function(route, fragment) {
      return route.exec(fragment).slice(1);
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on URL fragments. If the
  // browser does not support `onhashchange`, falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');
  };

  // Cached regex for cleaning leading hashes and slashes .
  var routeStripper = /^[#\/]/;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(windowOverride) {
      var loc = windowOverride ? windowOverride.location : window.location;
      var match = loc.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || forcePushState) {
          fragment = window.location.pathname;
          var search = window.location.search;
          if (search) fragment += search;
        } else {
          fragment = this.getHash();
        }
      }
      if (!fragment.indexOf(this.options.root)) fragment = fragment.substr(this.options.root.length);
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && window.history && window.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      if (oldIE) {
        this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        $(window).bind('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        $(window).bind('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = window.location;
      var atRoot  = loc.pathname == this.options.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        window.location.replace(this.options.root + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

      // Or if we've started out with a hash-based route, but we're currently
      // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '');
        window.history.replaceState({}, document.title, loc.protocol + '//' + loc.host + this.options.root + this.fragment);
      }

      if (!this.options.silent) {
        return this.loadUrl();
      }
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      $(window).unbind('popstate', this.checkUrl).unbind('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current == this.fragment && this.iframe) current = this.getFragment(this.getHash(this.iframe));
      if (current == this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(this.getHash());
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
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
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: options};
      var frag = (fragment || '').replace(routeStripper, '');
      if (this.fragment == frag) return;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        if (frag.indexOf(this.options.root) != 0) frag = this.options.root + frag;
        this.fragment = frag;
        window.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, frag);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this.fragment = frag;
        this._updateHash(window.location, frag, options.replace);
        if (this.iframe && (frag != this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a history entry on hash-tag change.
          // When replace is true, we don't want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, frag, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        window.location.assign(this.options.root + fragment);
      }
      if (options.trigger) this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        location.replace(location.toString().replace(/(javascript:|#).*$/, '') + '#' + fragment);
      } else {
        location.hash = fragment;
      }
    }
  });

  // Backbone.View
  // -------------

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be prefered to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view from the DOM. Note that the view isn't present in the
    // DOM by default, so calling this method may be a no-op.
    remove: function() {
      this.$el.remove();
      return this;
    },

    // For small amounts of DOM Elements, where a full-blown template isn't
    // needed, use **make** to manufacture elements, one at a time.
    //
    //     var el = this.make('li', {'class': 'row'}, this.model.escape('title'));
    //
    make: function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) $(el).attr(attributes);
      if (content) $(el).html(content);
      return el;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = (element instanceof $) ? element : $(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = getValue(this, 'events')))) return;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) throw new Error('Method "' + events[key] + '" does not exist');
        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.bind(eventName, method);
        } else {
          this.$el.delegate(selector, eventName, method);
        }
      }
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.unbind('.delegateEvents' + this.cid);
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure: function(options) {
      if (this.options) options = _.extend({}, this.options, options);
      for (var i = 0, l = viewOptions.length; i < l; i++) {
        var attr = viewOptions[i];
        if (options[attr]) this[attr] = options[attr];
      }
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = getValue(this, 'attributes') || {};
        if (this.id) attrs.id = this.id;
        if (this.className) attrs['class'] = this.className;
        this.setElement(this.make(this.tagName, attrs), false);
      } else {
        this.setElement(this.el, false);
      }
    }

  });

  // The self-propagating extend function that Backbone classes use.
  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  // Set up inheritance for the model, collection, and view.
  Model.extend = Collection.extend = Router.extend = View.extend = extend;

  // Backbone.sync
  // -------------

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    options || (options = {});

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = getValue(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (!options.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
        };
      }
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }

    // Make the request, allowing the user to override any Ajax options.
    return $.ajax(_.extend(params, options));
  };

  // Wrap an optional error callback with a fallback error event.
  Backbone.wrapError = function(onError, originalModel, options) {
    return function(model, resp) {
      resp = model === originalModel ? resp : model;
      if (onError) {
        onError(originalModel, resp, options);
      } else {
        originalModel.trigger('error', originalModel, resp, options);
      }
    };
  };

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Helper function to get a value from a Backbone object as a property
  // or as a function.
  var getValue = function(object, prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  };

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

}).call(this);
// Knockout JavaScript library v2.1.0
// (c) Steven Sanderson - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function(window,document,navigator,undefined){
var DEBUG=true;
!function(factory) {
    // Support three module loading scenarios
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // [1] CommonJS/Node.js
        var target = module['exports'] || exports; // module.exports is for Node.js
        factory(target);
    } else if (typeof define === 'function' && define['amd']) {
        // [2] AMD anonymous module
        define(['exports'], factory);
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        factory(window['ko'] = {});
    }
}(function(koExports){
// Internally, all KO objects are attached to koExports (even the non-exported ones whose names will be minified by the closure compiler).
// In the future, the following "ko" variable may be made distinct from "koExports" so that private objects are not externally reachable.
var ko = typeof koExports !== 'undefined' ? koExports : {};
// Google Closure Compiler helpers (used only to make the minified file smaller)
ko.exportSymbol = function(koPath, object) {
	var tokens = koPath.split(".");

	// In the future, "ko" may become distinct from "koExports" (so that non-exported objects are not reachable)
	// At that point, "target" would be set to: (typeof koExports !== "undefined" ? koExports : ko)
	var target = ko;

	for (var i = 0; i < tokens.length - 1; i++)
		target = target[tokens[i]];
	target[tokens[tokens.length - 1]] = object;
};
ko.exportProperty = function(owner, publicName, object) {
  owner[publicName] = object;
};
ko.version = "2.1.0";

ko.exportSymbol('version', ko.version);
ko.utils = new (function () {
    var stringTrimRegex = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;

    // Represent the known event types in a compact way, then at runtime transform it into a hash with event name as key (for fast lookup)
    var knownEvents = {}, knownEventTypesByEventName = {};
    var keyEventTypeName = /Firefox\/2/i.test(navigator.userAgent) ? 'KeyboardEvent' : 'UIEvents';
    knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
    knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
    for (var eventType in knownEvents) {
        var knownEventsForType = knownEvents[eventType];
        if (knownEventsForType.length) {
            for (var i = 0, j = knownEventsForType.length; i < j; i++)
                knownEventTypesByEventName[knownEventsForType[i]] = eventType;
        }
    }
    var eventsThatMustBeRegisteredUsingAttachEvent = { 'propertychange': true }; // Workaround for an IE9 issue - https://github.com/SteveSanderson/knockout/issues/406

    // Detect IE versions for bug workarounds (uses IE conditionals, not UA string, for robustness)
    var ieVersion = (function() {
        var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');

        // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
        while (
            div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
            iElems[0]
        );
        return version > 4 ? version : undefined;
    }());
    var isIe6 = ieVersion === 6,
        isIe7 = ieVersion === 7;

    function isClickOnCheckableElement(element, eventType) {
        if ((ko.utils.tagNameLower(element) !== "input") || !element.type) return false;
        if (eventType.toLowerCase() != "click") return false;
        var inputType = element.type;
        return (inputType == "checkbox") || (inputType == "radio");
    }

    return {
        fieldsIncludedWithJsonPost: ['authenticity_token', /^__RequestVerificationToken(_.*)?$/],

        arrayForEach: function (array, action) {
            for (var i = 0, j = array.length; i < j; i++)
                action(array[i]);
        },

        arrayIndexOf: function (array, item) {
            if (typeof Array.prototype.indexOf == "function")
                return Array.prototype.indexOf.call(array, item);
            for (var i = 0, j = array.length; i < j; i++)
                if (array[i] === item)
                    return i;
            return -1;
        },

        arrayFirst: function (array, predicate, predicateOwner) {
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate.call(predicateOwner, array[i]))
                    return array[i];
            return null;
        },

        arrayRemoveItem: function (array, itemToRemove) {
            var index = ko.utils.arrayIndexOf(array, itemToRemove);
            if (index >= 0)
                array.splice(index, 1);
        },

        arrayGetDistinctValues: function (array) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++) {
                if (ko.utils.arrayIndexOf(result, array[i]) < 0)
                    result.push(array[i]);
            }
            return result;
        },

        arrayMap: function (array, mapping) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                result.push(mapping(array[i]));
            return result;
        },

        arrayFilter: function (array, predicate) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate(array[i]))
                    result.push(array[i]);
            return result;
        },

        arrayPushAll: function (array, valuesToPush) {
            if (valuesToPush instanceof Array)
                array.push.apply(array, valuesToPush);
            else
                for (var i = 0, j = valuesToPush.length; i < j; i++)
                    array.push(valuesToPush[i]);
            return array;
        },

        extend: function (target, source) {
            if (source) {
                for(var prop in source) {
                    if(source.hasOwnProperty(prop)) {
                        target[prop] = source[prop];
                    }
                }
            }
            return target;
        },

        emptyDomNode: function (domNode) {
            while (domNode.firstChild) {
                ko.removeNode(domNode.firstChild);
            }
        },

        moveCleanedNodesToContainerElement: function(nodes) {
            // Ensure it's a real array, as we're about to reparent the nodes and
            // we don't want the underlying collection to change while we're doing that.
            var nodesArray = ko.utils.makeArray(nodes);

            var container = document.createElement('div');
            for (var i = 0, j = nodesArray.length; i < j; i++) {
                ko.cleanNode(nodesArray[i]);
                container.appendChild(nodesArray[i]);
            }
            return container;
        },

        setDomNodeChildren: function (domNode, childNodes) {
            ko.utils.emptyDomNode(domNode);
            if (childNodes) {
                for (var i = 0, j = childNodes.length; i < j; i++)
                    domNode.appendChild(childNodes[i]);
            }
        },

        replaceDomNodes: function (nodeToReplaceOrNodeArray, newNodesArray) {
            var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
            if (nodesToReplaceArray.length > 0) {
                var insertionPoint = nodesToReplaceArray[0];
                var parent = insertionPoint.parentNode;
                for (var i = 0, j = newNodesArray.length; i < j; i++)
                    parent.insertBefore(newNodesArray[i], insertionPoint);
                for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
                    ko.removeNode(nodesToReplaceArray[i]);
                }
            }
        },

        setOptionNodeSelectionState: function (optionNode, isSelected) {
            // IE6 sometimes throws "unknown error" if you try to write to .selected directly, whereas Firefox struggles with setAttribute. Pick one based on browser.
            if (navigator.userAgent.indexOf("MSIE 6") >= 0)
                optionNode.setAttribute("selected", isSelected);
            else
                optionNode.selected = isSelected;
        },

        stringTrim: function (string) {
            return (string || "").replace(stringTrimRegex, "");
        },

        stringTokenize: function (string, delimiter) {
            var result = [];
            var tokens = (string || "").split(delimiter);
            for (var i = 0, j = tokens.length; i < j; i++) {
                var trimmed = ko.utils.stringTrim(tokens[i]);
                if (trimmed !== "")
                    result.push(trimmed);
            }
            return result;
        },

        stringStartsWith: function (string, startsWith) {
            string = string || "";
            if (startsWith.length > string.length)
                return false;
            return string.substring(0, startsWith.length) === startsWith;
        },

        buildEvalWithinScopeFunction: function (expression, scopeLevels) {
            // Build the source for a function that evaluates "expression"
            // For each scope variable, add an extra level of "with" nesting
            // Example result: with(sc[1]) { with(sc[0]) { return (expression) } }
            var functionBody = "return (" + expression + ")";
            for (var i = 0; i < scopeLevels; i++) {
                functionBody = "with(sc[" + i + "]) { " + functionBody + " } ";
            }
            return new Function("sc", functionBody);
        },

        domNodeIsContainedBy: function (node, containedByNode) {
            if (containedByNode.compareDocumentPosition)
                return (containedByNode.compareDocumentPosition(node) & 16) == 16;
            while (node != null) {
                if (node == containedByNode)
                    return true;
                node = node.parentNode;
            }
            return false;
        },

        domNodeIsAttachedToDocument: function (node) {
            return ko.utils.domNodeIsContainedBy(node, node.ownerDocument);
        },

        tagNameLower: function(element) {
            // For HTML elements, tagName will always be upper case; for XHTML elements, it'll be lower case.
            // Possible future optimization: If we know it's an element from an XHTML document (not HTML),
            // we don't need to do the .toLowerCase() as it will always be lower case anyway.
            return element && element.tagName && element.tagName.toLowerCase();
        },

        registerEventHandler: function (element, eventType, handler) {
            var mustUseAttachEvent = ieVersion && eventsThatMustBeRegisteredUsingAttachEvent[eventType];
            if (!mustUseAttachEvent && typeof jQuery != "undefined") {
                if (isClickOnCheckableElement(element, eventType)) {
                    // For click events on checkboxes, jQuery interferes with the event handling in an awkward way:
                    // it toggles the element checked state *after* the click event handlers run, whereas native
                    // click events toggle the checked state *before* the event handler.
                    // Fix this by intecepting the handler and applying the correct checkedness before it runs.
                    var originalHandler = handler;
                    handler = function(event, eventData) {
                        var jQuerySuppliedCheckedState = this.checked;
                        if (eventData)
                            this.checked = eventData.checkedStateBeforeEvent !== true;
                        originalHandler.call(this, event);
                        this.checked = jQuerySuppliedCheckedState; // Restore the state jQuery applied
                    };
                }
                jQuery(element)['bind'](eventType, handler);
            } else if (!mustUseAttachEvent && typeof element.addEventListener == "function")
                element.addEventListener(eventType, handler, false);
            else if (typeof element.attachEvent != "undefined")
                element.attachEvent("on" + eventType, function (event) {
                    handler.call(element, event);
                });
            else
                throw new Error("Browser doesn't support addEventListener or attachEvent");
        },

        triggerEvent: function (element, eventType) {
            if (!(element && element.nodeType))
                throw new Error("element must be a DOM node when calling triggerEvent");

            if (typeof jQuery != "undefined") {
                var eventData = [];
                if (isClickOnCheckableElement(element, eventType)) {
                    // Work around the jQuery "click events on checkboxes" issue described above by storing the original checked state before triggering the handler
                    eventData.push({ checkedStateBeforeEvent: element.checked });
                }
                jQuery(element)['trigger'](eventType, eventData);
            } else if (typeof document.createEvent == "function") {
                if (typeof element.dispatchEvent == "function") {
                    var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
                    var event = document.createEvent(eventCategory);
                    event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
                    element.dispatchEvent(event);
                }
                else
                    throw new Error("The supplied element doesn't support dispatchEvent");
            } else if (typeof element.fireEvent != "undefined") {
                // Unlike other browsers, IE doesn't change the checked state of checkboxes/radiobuttons when you trigger their "click" event
                // so to make it consistent, we'll do it manually here
                if (isClickOnCheckableElement(element, eventType))
                    element.checked = element.checked !== true;
                element.fireEvent("on" + eventType);
            }
            else
                throw new Error("Browser doesn't support triggering events");
        },

        unwrapObservable: function (value) {
            return ko.isObservable(value) ? value() : value;
        },

        toggleDomNodeCssClass: function (node, className, shouldHaveClass) {
            var currentClassNames = (node.className || "").split(/\s+/);
            var hasClass = ko.utils.arrayIndexOf(currentClassNames, className) >= 0;

            if (shouldHaveClass && !hasClass) {
                node.className += (currentClassNames[0] ? " " : "") + className;
            } else if (hasClass && !shouldHaveClass) {
                var newClassName = "";
                for (var i = 0; i < currentClassNames.length; i++)
                    if (currentClassNames[i] != className)
                        newClassName += currentClassNames[i] + " ";
                node.className = ko.utils.stringTrim(newClassName);
            }
        },

        setTextContent: function(element, textContent) {
            var value = ko.utils.unwrapObservable(textContent);
            if ((value === null) || (value === undefined))
                value = "";

            'innerText' in element ? element.innerText = value
                                   : element.textContent = value;

            if (ieVersion >= 9) {
                // Believe it or not, this actually fixes an IE9 rendering bug
                // (See https://github.com/SteveSanderson/knockout/issues/209)
                element.style.display = element.style.display;
            }
        },

        ensureSelectElementIsRenderedCorrectly: function(selectElement) {
            // Workaround for IE9 rendering bug - it doesn't reliably display all the text in dynamically-added select boxes unless you force it to re-render by updating the width.
            // (See https://github.com/SteveSanderson/knockout/issues/312, http://stackoverflow.com/questions/5908494/select-only-shows-first-char-of-selected-option)
            if (ieVersion >= 9) {
                var originalWidth = selectElement.style.width;
                selectElement.style.width = 0;
                selectElement.style.width = originalWidth;
            }
        },

        range: function (min, max) {
            min = ko.utils.unwrapObservable(min);
            max = ko.utils.unwrapObservable(max);
            var result = [];
            for (var i = min; i <= max; i++)
                result.push(i);
            return result;
        },

        makeArray: function(arrayLikeObject) {
            var result = [];
            for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
                result.push(arrayLikeObject[i]);
            };
            return result;
        },

        isIe6 : isIe6,
        isIe7 : isIe7,
        ieVersion : ieVersion,

        getFormFields: function(form, fieldName) {
            var fields = ko.utils.makeArray(form.getElementsByTagName("input")).concat(ko.utils.makeArray(form.getElementsByTagName("textarea")));
            var isMatchingField = (typeof fieldName == 'string')
                ? function(field) { return field.name === fieldName }
                : function(field) { return fieldName.test(field.name) }; // Treat fieldName as regex or object containing predicate
            var matches = [];
            for (var i = fields.length - 1; i >= 0; i--) {
                if (isMatchingField(fields[i]))
                    matches.push(fields[i]);
            };
            return matches;
        },

        parseJson: function (jsonString) {
            if (typeof jsonString == "string") {
                jsonString = ko.utils.stringTrim(jsonString);
                if (jsonString) {
                    if (window.JSON && window.JSON.parse) // Use native parsing where available
                        return window.JSON.parse(jsonString);
                    return (new Function("return " + jsonString))(); // Fallback on less safe parsing for older browsers
                }
            }
            return null;
        },

        stringifyJson: function (data, replacer, space) {   // replacer and space are optional
            if ((typeof JSON == "undefined") || (typeof JSON.stringify == "undefined"))
                throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
            return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space);
        },

        postJson: function (urlOrForm, data, options) {
            options = options || {};
            var params = options['params'] || {};
            var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
            var url = urlOrForm;

            // If we were given a form, use its 'action' URL and pick out any requested field values
            if((typeof urlOrForm == 'object') && (ko.utils.tagNameLower(urlOrForm) === "form")) {
                var originalForm = urlOrForm;
                url = originalForm.action;
                for (var i = includeFields.length - 1; i >= 0; i--) {
                    var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
                    for (var j = fields.length - 1; j >= 0; j--)
                        params[fields[j].name] = fields[j].value;
                }
            }

            data = ko.utils.unwrapObservable(data);
            var form = document.createElement("form");
            form.style.display = "none";
            form.action = url;
            form.method = "post";
            for (var key in data) {
                var input = document.createElement("input");
                input.name = key;
                input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
                form.appendChild(input);
            }
            for (var key in params) {
                var input = document.createElement("input");
                input.name = key;
                input.value = params[key];
                form.appendChild(input);
            }
            document.body.appendChild(form);
            options['submitter'] ? options['submitter'](form) : form.submit();
            setTimeout(function () { form.parentNode.removeChild(form); }, 0);
        }
    }
})();

ko.exportSymbol('utils', ko.utils);
ko.exportSymbol('utils.arrayForEach', ko.utils.arrayForEach);
ko.exportSymbol('utils.arrayFirst', ko.utils.arrayFirst);
ko.exportSymbol('utils.arrayFilter', ko.utils.arrayFilter);
ko.exportSymbol('utils.arrayGetDistinctValues', ko.utils.arrayGetDistinctValues);
ko.exportSymbol('utils.arrayIndexOf', ko.utils.arrayIndexOf);
ko.exportSymbol('utils.arrayMap', ko.utils.arrayMap);
ko.exportSymbol('utils.arrayPushAll', ko.utils.arrayPushAll);
ko.exportSymbol('utils.arrayRemoveItem', ko.utils.arrayRemoveItem);
ko.exportSymbol('utils.extend', ko.utils.extend);
ko.exportSymbol('utils.fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost);
ko.exportSymbol('utils.getFormFields', ko.utils.getFormFields);
ko.exportSymbol('utils.postJson', ko.utils.postJson);
ko.exportSymbol('utils.parseJson', ko.utils.parseJson);
ko.exportSymbol('utils.registerEventHandler', ko.utils.registerEventHandler);
ko.exportSymbol('utils.stringifyJson', ko.utils.stringifyJson);
ko.exportSymbol('utils.range', ko.utils.range);
ko.exportSymbol('utils.toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass);
ko.exportSymbol('utils.triggerEvent', ko.utils.triggerEvent);
ko.exportSymbol('utils.unwrapObservable', ko.utils.unwrapObservable);

if (!Function.prototype['bind']) {
    // Function.prototype.bind is a standard part of ECMAScript 5th Edition (December 2009, http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)
    // In case the browser doesn't implement it natively, provide a JavaScript implementation. This implementation is based on the one in prototype.js
    Function.prototype['bind'] = function (object) {
        var originalFunction = this, args = Array.prototype.slice.call(arguments), object = args.shift();
        return function () {
            return originalFunction.apply(object, args.concat(Array.prototype.slice.call(arguments)));
        };
    };
}

ko.utils.domData = new (function () {
    var uniqueId = 0;
    var dataStoreKeyExpandoPropertyName = "__ko__" + (new Date).getTime();
    var dataStore = {};
    return {
        get: function (node, key) {
            var allDataForNode = ko.utils.domData.getAll(node, false);
            return allDataForNode === undefined ? undefined : allDataForNode[key];
        },
        set: function (node, key, value) {
            if (value === undefined) {
                // Make sure we don't actually create a new domData key if we are actually deleting a value
                if (ko.utils.domData.getAll(node, false) === undefined)
                    return;
            }
            var allDataForNode = ko.utils.domData.getAll(node, true);
            allDataForNode[key] = value;
        },
        getAll: function (node, createIfNotFound) {
            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
            var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null");
            if (!hasExistingDataStore) {
                if (!createIfNotFound)
                    return undefined;
                dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
                dataStore[dataStoreKey] = {};
            }
            return dataStore[dataStoreKey];
        },
        clear: function (node) {
            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
            if (dataStoreKey) {
                delete dataStore[dataStoreKey];
                node[dataStoreKeyExpandoPropertyName] = null;
            }
        }
    }
})();

ko.exportSymbol('utils.domData', ko.utils.domData);
ko.exportSymbol('utils.domData.clear', ko.utils.domData.clear); // Exporting only so specs can clear up after themselves fully

ko.utils.domNodeDisposal = new (function () {
    var domDataKey = "__ko_domNodeDisposal__" + (new Date).getTime();
    var cleanableNodeTypes = { 1: true, 8: true, 9: true };       // Element, Comment, Document
    var cleanableNodeTypesWithDescendants = { 1: true, 9: true }; // Element, Document

    function getDisposeCallbacksCollection(node, createIfNotFound) {
        var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
        if ((allDisposeCallbacks === undefined) && createIfNotFound) {
            allDisposeCallbacks = [];
            ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
        }
        return allDisposeCallbacks;
    }
    function destroyCallbacksCollection(node) {
        ko.utils.domData.set(node, domDataKey, undefined);
    }

    function cleanSingleNode(node) {
        // Run all the dispose callbacks
        var callbacks = getDisposeCallbacksCollection(node, false);
        if (callbacks) {
            callbacks = callbacks.slice(0); // Clone, as the array may be modified during iteration (typically, callbacks will remove themselves)
            for (var i = 0; i < callbacks.length; i++)
                callbacks[i](node);
        }

        // Also erase the DOM data
        ko.utils.domData.clear(node);

        // Special support for jQuery here because it's so commonly used.
        // Many jQuery plugins (including jquery.tmpl) store data using jQuery's equivalent of domData
        // so notify it to tear down any resources associated with the node & descendants here.
        if ((typeof jQuery == "function") && (typeof jQuery['cleanData'] == "function"))
            jQuery['cleanData']([node]);

        // Also clear any immediate-child comment nodes, as these wouldn't have been found by
        // node.getElementsByTagName("*") in cleanNode() (comment nodes aren't elements)
        if (cleanableNodeTypesWithDescendants[node.nodeType])
            cleanImmediateCommentTypeChildren(node);
    }

    function cleanImmediateCommentTypeChildren(nodeWithChildren) {
        var child, nextChild = nodeWithChildren.firstChild;
        while (child = nextChild) {
            nextChild = child.nextSibling;
            if (child.nodeType === 8)
                cleanSingleNode(child);
        }
    }

    return {
        addDisposeCallback : function(node, callback) {
            if (typeof callback != "function")
                throw new Error("Callback must be a function");
            getDisposeCallbacksCollection(node, true).push(callback);
        },

        removeDisposeCallback : function(node, callback) {
            var callbacksCollection = getDisposeCallbacksCollection(node, false);
            if (callbacksCollection) {
                ko.utils.arrayRemoveItem(callbacksCollection, callback);
                if (callbacksCollection.length == 0)
                    destroyCallbacksCollection(node);
            }
        },

        cleanNode : function(node) {
            // First clean this node, where applicable
            if (cleanableNodeTypes[node.nodeType]) {
                cleanSingleNode(node);

                // ... then its descendants, where applicable
                if (cleanableNodeTypesWithDescendants[node.nodeType]) {
                    // Clone the descendants list in case it changes during iteration
                    var descendants = [];
                    ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
                    for (var i = 0, j = descendants.length; i < j; i++)
                        cleanSingleNode(descendants[i]);
                }
            }
        },

        removeNode : function(node) {
            ko.cleanNode(node);
            if (node.parentNode)
                node.parentNode.removeChild(node);
        }
    }
})();
ko.cleanNode = ko.utils.domNodeDisposal.cleanNode; // Shorthand name for convenience
ko.removeNode = ko.utils.domNodeDisposal.removeNode; // Shorthand name for convenience
ko.exportSymbol('cleanNode', ko.cleanNode);
ko.exportSymbol('removeNode', ko.removeNode);
ko.exportSymbol('utils.domNodeDisposal', ko.utils.domNodeDisposal);
ko.exportSymbol('utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
ko.exportSymbol('utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);
(function () {
    var leadingCommentRegex = /^(\s*)<!--(.*?)-->/;

    function simpleHtmlParse(html) {
        // Based on jQuery's "clean" function, but only accounting for table-related elements.
        // If you have referenced jQuery, this won't be used anyway - KO will use jQuery's "clean" function directly

        // Note that there's still an issue in IE < 9 whereby it will discard comment nodes that are the first child of
        // a descendant node. For example: "<div><!-- mycomment -->abc</div>" will get parsed as "<div>abc</div>"
        // This won't affect anyone who has referenced jQuery, and there's always the workaround of inserting a dummy node
        // (possibly a text node) in front of the comment. So, KO does not attempt to workaround this IE issue automatically at present.

        // Trim whitespace, otherwise indexOf won't work as expected
        var tags = ko.utils.stringTrim(html).toLowerCase(), div = document.createElement("div");

        // Finds the first match from the left column, and returns the corresponding "wrap" data from the right column
        var wrap = tags.match(/^<(thead|tbody|tfoot)/)              && [1, "<table>", "</table>"] ||
                   !tags.indexOf("<tr")                             && [2, "<table><tbody>", "</tbody></table>"] ||
                   (!tags.indexOf("<td") || !tags.indexOf("<th"))   && [3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
                   /* anything else */                                 [0, "", ""];

        // Go to html and back, then peel off extra wrappers
        // Note that we always prefix with some dummy text, because otherwise, IE<9 will strip out leading comment nodes in descendants. Total madness.
        var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
        if (typeof window['innerShiv'] == "function") {
            div.appendChild(window['innerShiv'](markup));
        } else {
            div.innerHTML = markup;
        }

        // Move to the right depth
        while (wrap[0]--)
            div = div.lastChild;

        return ko.utils.makeArray(div.lastChild.childNodes);
    }

    function jQueryHtmlParse(html) {
        var elems = jQuery['clean']([html]);

        // As of jQuery 1.7.1, jQuery parses the HTML by appending it to some dummy parent nodes held in an in-memory document fragment.
        // Unfortunately, it never clears the dummy parent nodes from the document fragment, so it leaks memory over time.
        // Fix this by finding the top-most dummy parent element, and detaching it from its owner fragment.
        if (elems && elems[0]) {
            // Find the top-most parent element that's a direct child of a document fragment
            var elem = elems[0];
            while (elem.parentNode && elem.parentNode.nodeType !== 11 /* i.e., DocumentFragment */)
                elem = elem.parentNode;
            // ... then detach it
            if (elem.parentNode)
                elem.parentNode.removeChild(elem);
        }

        return elems;
    }

    ko.utils.parseHtmlFragment = function(html) {
        return typeof jQuery != 'undefined' ? jQueryHtmlParse(html)   // As below, benefit from jQuery's optimisations where possible
                                            : simpleHtmlParse(html);  // ... otherwise, this simple logic will do in most common cases.
    };

    ko.utils.setHtml = function(node, html) {
        ko.utils.emptyDomNode(node);

        if ((html !== null) && (html !== undefined)) {
            if (typeof html != 'string')
                html = html.toString();

            // jQuery contains a lot of sophisticated code to parse arbitrary HTML fragments,
            // for example <tr> elements which are not normally allowed to exist on their own.
            // If you've referenced jQuery we'll use that rather than duplicating its code.
            if (typeof jQuery != 'undefined') {
                jQuery(node)['html'](html);
            } else {
                // ... otherwise, use KO's own parsing logic.
                var parsedNodes = ko.utils.parseHtmlFragment(html);
                for (var i = 0; i < parsedNodes.length; i++)
                    node.appendChild(parsedNodes[i]);
            }
        }
    };
})();

ko.exportSymbol('utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
ko.exportSymbol('utils.setHtml', ko.utils.setHtml);

ko.memoization = (function () {
    var memos = {};

    function randomMax8HexChars() {
        return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
    }
    function generateRandomId() {
        return randomMax8HexChars() + randomMax8HexChars();
    }
    function findMemoNodes(rootNode, appendToArray) {
        if (!rootNode)
            return;
        if (rootNode.nodeType == 8) {
            var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
            if (memoId != null)
                appendToArray.push({ domNode: rootNode, memoId: memoId });
        } else if (rootNode.nodeType == 1) {
            for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++)
                findMemoNodes(childNodes[i], appendToArray);
        }
    }

    return {
        memoize: function (callback) {
            if (typeof callback != "function")
                throw new Error("You can only pass a function to ko.memoization.memoize()");
            var memoId = generateRandomId();
            memos[memoId] = callback;
            return "<!--[ko_memo:" + memoId + "]-->";
        },

        unmemoize: function (memoId, callbackParams) {
            var callback = memos[memoId];
            if (callback === undefined)
                throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
            try {
                callback.apply(null, callbackParams || []);
                return true;
            }
            finally { delete memos[memoId]; }
        },

        unmemoizeDomNodeAndDescendants: function (domNode, extraCallbackParamsArray) {
            var memos = [];
            findMemoNodes(domNode, memos);
            for (var i = 0, j = memos.length; i < j; i++) {
                var node = memos[i].domNode;
                var combinedParams = [node];
                if (extraCallbackParamsArray)
                    ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
                ko.memoization.unmemoize(memos[i].memoId, combinedParams);
                node.nodeValue = ""; // Neuter this node so we don't try to unmemoize it again
                if (node.parentNode)
                    node.parentNode.removeChild(node); // If possible, erase it totally (not always possible - someone else might just hold a reference to it then call unmemoizeDomNodeAndDescendants again)
            }
        },

        parseMemoText: function (memoText) {
            var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
            return match ? match[1] : null;
        }
    };
})();

ko.exportSymbol('memoization', ko.memoization);
ko.exportSymbol('memoization.memoize', ko.memoization.memoize);
ko.exportSymbol('memoization.unmemoize', ko.memoization.unmemoize);
ko.exportSymbol('memoization.parseMemoText', ko.memoization.parseMemoText);
ko.exportSymbol('memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
ko.extenders = {
    'throttle': function(target, timeout) {
        // Throttling means two things:

        // (1) For dependent observables, we throttle *evaluations* so that, no matter how fast its dependencies
        //     notify updates, the target doesn't re-evaluate (and hence doesn't notify) faster than a certain rate
        target['throttleEvaluation'] = timeout;

        // (2) For writable targets (observables, or writable dependent observables), we throttle *writes*
        //     so the target cannot change value synchronously or faster than a certain rate
        var writeTimeoutInstance = null;
        return ko.dependentObservable({
            'read': target,
            'write': function(value) {
                clearTimeout(writeTimeoutInstance);
                writeTimeoutInstance = setTimeout(function() {
                    target(value);
                }, timeout);
            }
        });
    },

    'notify': function(target, notifyWhen) {
        target["equalityComparer"] = notifyWhen == "always"
            ? function() { return false } // Treat all values as not equal
            : ko.observable["fn"]["equalityComparer"];
        return target;
    }
};

function applyExtenders(requestedExtenders) {
    var target = this;
    if (requestedExtenders) {
        for (var key in requestedExtenders) {
            var extenderHandler = ko.extenders[key];
            if (typeof extenderHandler == 'function') {
                target = extenderHandler(target, requestedExtenders[key]);
            }
        }
    }
    return target;
}

ko.exportSymbol('extenders', ko.extenders);

ko.subscription = function (target, callback, disposeCallback) {
    this.target = target;
    this.callback = callback;
    this.disposeCallback = disposeCallback;
    ko.exportProperty(this, 'dispose', this.dispose);
};
ko.subscription.prototype.dispose = function () {
    this.isDisposed = true;
    this.disposeCallback();
};

ko.subscribable = function () {
    this._subscriptions = {};

    ko.utils.extend(this, ko.subscribable['fn']);
    ko.exportProperty(this, 'subscribe', this.subscribe);
    ko.exportProperty(this, 'extend', this.extend);
    ko.exportProperty(this, 'getSubscriptionsCount', this.getSubscriptionsCount);
}

var defaultEvent = "change";

ko.subscribable['fn'] = {
    subscribe: function (callback, callbackTarget, event) {
        event = event || defaultEvent;
        var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;

        var subscription = new ko.subscription(this, boundCallback, function () {
            ko.utils.arrayRemoveItem(this._subscriptions[event], subscription);
        }.bind(this));

        if (!this._subscriptions[event])
            this._subscriptions[event] = [];
        this._subscriptions[event].push(subscription);
        return subscription;
    },

    "notifySubscribers": function (valueToNotify, event) {
        event = event || defaultEvent;
        if (this._subscriptions[event]) {
            ko.utils.arrayForEach(this._subscriptions[event].slice(0), function (subscription) {
                // In case a subscription was disposed during the arrayForEach cycle, check
                // for isDisposed on each subscription before invoking its callback
                if (subscription && (subscription.isDisposed !== true))
                    subscription.callback(valueToNotify);
            });
        }
    },

    getSubscriptionsCount: function () {
        var total = 0;
        for (var eventName in this._subscriptions) {
            if (this._subscriptions.hasOwnProperty(eventName))
                total += this._subscriptions[eventName].length;
        }
        return total;
    },

    extend: applyExtenders
};


ko.isSubscribable = function (instance) {
    return typeof instance.subscribe == "function" && typeof instance["notifySubscribers"] == "function";
};

ko.exportSymbol('subscribable', ko.subscribable);
ko.exportSymbol('isSubscribable', ko.isSubscribable);

ko.dependencyDetection = (function () {
    var _frames = [];

    return {
        begin: function (callback) {
            _frames.push({ callback: callback, distinctDependencies:[] });
        },

        end: function () {
            _frames.pop();
        },

        registerDependency: function (subscribable) {
            if (!ko.isSubscribable(subscribable))
                throw new Error("Only subscribable things can act as dependencies");
            if (_frames.length > 0) {
                var topFrame = _frames[_frames.length - 1];
                if (ko.utils.arrayIndexOf(topFrame.distinctDependencies, subscribable) >= 0)
                    return;
                topFrame.distinctDependencies.push(subscribable);
                topFrame.callback(subscribable);
            }
        }
    };
})();
var primitiveTypes = { 'undefined':true, 'boolean':true, 'number':true, 'string':true };

ko.observable = function (initialValue) {
    var _latestValue = initialValue;

    function observable() {
        if (arguments.length > 0) {
            // Write

            // Ignore writes if the value hasn't changed
            if ((!observable['equalityComparer']) || !observable['equalityComparer'](_latestValue, arguments[0])) {
                observable.valueWillMutate();
                _latestValue = arguments[0];
                if (DEBUG) observable._latestValue = _latestValue;
                observable.valueHasMutated();
            }
            return this; // Permits chained assignments
        }
        else {
            // Read
            ko.dependencyDetection.registerDependency(observable); // The caller only needs to be notified of changes if they did a "read" operation
            return _latestValue;
        }
    }
    if (DEBUG) observable._latestValue = _latestValue;
    ko.subscribable.call(observable);
    observable.valueHasMutated = function () { observable["notifySubscribers"](_latestValue); }
    observable.valueWillMutate = function () { observable["notifySubscribers"](_latestValue, "beforeChange"); }
    ko.utils.extend(observable, ko.observable['fn']);

    ko.exportProperty(observable, "valueHasMutated", observable.valueHasMutated);
    ko.exportProperty(observable, "valueWillMutate", observable.valueWillMutate);

    return observable;
}

ko.observable['fn'] = {
    "equalityComparer": function valuesArePrimitiveAndEqual(a, b) {
        var oldValueIsPrimitive = (a === null) || (typeof(a) in primitiveTypes);
        return oldValueIsPrimitive ? (a === b) : false;
    }
};

var protoProperty = ko.observable.protoProperty = "__ko_proto__";
ko.observable['fn'][protoProperty] = ko.observable;

ko.hasPrototype = function(instance, prototype) {
    if ((instance === null) || (instance === undefined) || (instance[protoProperty] === undefined)) return false;
    if (instance[protoProperty] === prototype) return true;
    return ko.hasPrototype(instance[protoProperty], prototype); // Walk the prototype chain
};

ko.isObservable = function (instance) {
    return ko.hasPrototype(instance, ko.observable);
}
ko.isWriteableObservable = function (instance) {
    // Observable
    if ((typeof instance == "function") && instance[protoProperty] === ko.observable)
        return true;
    // Writeable dependent observable
    if ((typeof instance == "function") && (instance[protoProperty] === ko.dependentObservable) && (instance.hasWriteFunction))
        return true;
    // Anything else
    return false;
}


ko.exportSymbol('observable', ko.observable);
ko.exportSymbol('isObservable', ko.isObservable);
ko.exportSymbol('isWriteableObservable', ko.isWriteableObservable);
ko.observableArray = function (initialValues) {
    if (arguments.length == 0) {
        // Zero-parameter constructor initializes to empty array
        initialValues = [];
    }
    if ((initialValues !== null) && (initialValues !== undefined) && !('length' in initialValues))
        throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");

    var result = ko.observable(initialValues);
    ko.utils.extend(result, ko.observableArray['fn']);
    return result;
}

ko.observableArray['fn'] = {
    'remove': function (valueOrPredicate) {
        var underlyingArray = this();
        var removedValues = [];
        var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        for (var i = 0; i < underlyingArray.length; i++) {
            var value = underlyingArray[i];
            if (predicate(value)) {
                if (removedValues.length === 0) {
                    this.valueWillMutate();
                }
                removedValues.push(value);
                underlyingArray.splice(i, 1);
                i--;
            }
        }
        if (removedValues.length) {
            this.valueHasMutated();
        }
        return removedValues;
    },

    'removeAll': function (arrayOfValues) {
        // If you passed zero args, we remove everything
        if (arrayOfValues === undefined) {
            var underlyingArray = this();
            var allValues = underlyingArray.slice(0);
            this.valueWillMutate();
            underlyingArray.splice(0, underlyingArray.length);
            this.valueHasMutated();
            return allValues;
        }
        // If you passed an arg, we interpret it as an array of entries to remove
        if (!arrayOfValues)
            return [];
        return this['remove'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'destroy': function (valueOrPredicate) {
        var underlyingArray = this();
        var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        this.valueWillMutate();
        for (var i = underlyingArray.length - 1; i >= 0; i--) {
            var value = underlyingArray[i];
            if (predicate(value))
                underlyingArray[i]["_destroy"] = true;
        }
        this.valueHasMutated();
    },

    'destroyAll': function (arrayOfValues) {
        // If you passed zero args, we destroy everything
        if (arrayOfValues === undefined)
            return this['destroy'](function() { return true });

        // If you passed an arg, we interpret it as an array of entries to destroy
        if (!arrayOfValues)
            return [];
        return this['destroy'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'indexOf': function (item) {
        var underlyingArray = this();
        return ko.utils.arrayIndexOf(underlyingArray, item);
    },

    'replace': function(oldItem, newItem) {
        var index = this['indexOf'](oldItem);
        if (index >= 0) {
            this.valueWillMutate();
            this()[index] = newItem;
            this.valueHasMutated();
        }
    }
}

// Populate ko.observableArray.fn with read/write functions from native arrays
ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        var underlyingArray = this();
        this.valueWillMutate();
        var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
        this.valueHasMutated();
        return methodCallResult;
    };
});

// Populate ko.observableArray.fn with read-only functions from native arrays
ko.utils.arrayForEach(["slice"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        var underlyingArray = this();
        return underlyingArray[methodName].apply(underlyingArray, arguments);
    };
});

ko.exportSymbol('observableArray', ko.observableArray);
ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
    var _latestValue,
        _hasBeenEvaluated = false,
        _isBeingEvaluated = false,
        readFunction = evaluatorFunctionOrOptions;

    if (readFunction && typeof readFunction == "object") {
        // Single-parameter syntax - everything is on this "options" param
        options = readFunction;
        readFunction = options["read"];
    } else {
        // Multi-parameter syntax - construct the options according to the params passed
        options = options || {};
        if (!readFunction)
            readFunction = options["read"];
    }
    // By here, "options" is always non-null
    if (typeof readFunction != "function")
        throw new Error("Pass a function that returns the value of the ko.computed");

    var writeFunction = options["write"];
    if (!evaluatorFunctionTarget)
        evaluatorFunctionTarget = options["owner"];

    var _subscriptionsToDependencies = [];
    function disposeAllSubscriptionsToDependencies() {
        ko.utils.arrayForEach(_subscriptionsToDependencies, function (subscription) {
            subscription.dispose();
        });
        _subscriptionsToDependencies = [];
    }
    var dispose = disposeAllSubscriptionsToDependencies;

    // Build "disposeWhenNodeIsRemoved" and "disposeWhenNodeIsRemovedCallback" option values
    // (Note: "disposeWhenNodeIsRemoved" option both proactively disposes as soon as the node is removed using ko.removeNode(),
    // plus adds a "disposeWhen" callback that, on each evaluation, disposes if the node was removed by some other means.)
    var disposeWhenNodeIsRemoved = (typeof options["disposeWhenNodeIsRemoved"] == "object") ? options["disposeWhenNodeIsRemoved"] : null;
    var disposeWhen = options["disposeWhen"] || function() { return false; };
    if (disposeWhenNodeIsRemoved) {
        dispose = function() {
            ko.utils.domNodeDisposal.removeDisposeCallback(disposeWhenNodeIsRemoved, arguments.callee);
            disposeAllSubscriptionsToDependencies();
        };
        ko.utils.domNodeDisposal.addDisposeCallback(disposeWhenNodeIsRemoved, dispose);
        var existingDisposeWhenFunction = disposeWhen;
        disposeWhen = function () {
            return !ko.utils.domNodeIsAttachedToDocument(disposeWhenNodeIsRemoved) || existingDisposeWhenFunction();
        }
    }

    var evaluationTimeoutInstance = null;
    function evaluatePossiblyAsync() {
        var throttleEvaluationTimeout = dependentObservable['throttleEvaluation'];
        if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
            clearTimeout(evaluationTimeoutInstance);
            evaluationTimeoutInstance = setTimeout(evaluateImmediate, throttleEvaluationTimeout);
        } else
            evaluateImmediate();
    }

    function evaluateImmediate() {
        if (_isBeingEvaluated) {
            // If the evaluation of a ko.computed causes side effects, it's possible that it will trigger its own re-evaluation.
            // This is not desirable (it's hard for a developer to realise a chain of dependencies might cause this, and they almost
            // certainly didn't intend infinite re-evaluations). So, for predictability, we simply prevent ko.computeds from causing
            // their own re-evaluation. Further discussion at https://github.com/SteveSanderson/knockout/pull/387
            return;
        }

        // Don't dispose on first evaluation, because the "disposeWhen" callback might
        // e.g., dispose when the associated DOM element isn't in the doc, and it's not
        // going to be in the doc until *after* the first evaluation
        if (_hasBeenEvaluated && disposeWhen()) {
            dispose();
            return;
        }

        _isBeingEvaluated = true;
        try {
            // Initially, we assume that none of the subscriptions are still being used (i.e., all are candidates for disposal).
            // Then, during evaluation, we cross off any that are in fact still being used.
            var disposalCandidates = ko.utils.arrayMap(_subscriptionsToDependencies, function(item) {return item.target;});

            ko.dependencyDetection.begin(function(subscribable) {
                var inOld;
                if ((inOld = ko.utils.arrayIndexOf(disposalCandidates, subscribable)) >= 0)
                    disposalCandidates[inOld] = undefined; // Don't want to dispose this subscription, as it's still being used
                else
                    _subscriptionsToDependencies.push(subscribable.subscribe(evaluatePossiblyAsync)); // Brand new subscription - add it
            });

            var newValue = readFunction.call(evaluatorFunctionTarget);

            // For each subscription no longer being used, remove it from the active subscriptions list and dispose it
            for (var i = disposalCandidates.length - 1; i >= 0; i--) {
                if (disposalCandidates[i])
                    _subscriptionsToDependencies.splice(i, 1)[0].dispose();
            }
            _hasBeenEvaluated = true;

            dependentObservable["notifySubscribers"](_latestValue, "beforeChange");
            _latestValue = newValue;
            if (DEBUG) dependentObservable._latestValue = _latestValue;
        } finally {
            ko.dependencyDetection.end();
        }

        dependentObservable["notifySubscribers"](_latestValue);
        _isBeingEvaluated = false;

    }

    function dependentObservable() {
        if (arguments.length > 0) {
            set.apply(dependentObservable, arguments);
        } else {
            return get();
        }
    }

    function set() {
        if (typeof writeFunction === "function") {
            // Writing a value
            writeFunction.apply(evaluatorFunctionTarget, arguments);
        } else {
            throw new Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
        }
    }

    function get() {
        // Reading the value
        if (!_hasBeenEvaluated)
            evaluateImmediate();
        ko.dependencyDetection.registerDependency(dependentObservable);
        return _latestValue;
    }

    dependentObservable.getDependenciesCount = function () { return _subscriptionsToDependencies.length; };
    dependentObservable.hasWriteFunction = typeof options["write"] === "function";
    dependentObservable.dispose = function () { dispose(); };

    ko.subscribable.call(dependentObservable);
    ko.utils.extend(dependentObservable, ko.dependentObservable['fn']);

    if (options['deferEvaluation'] !== true)
        evaluateImmediate();

    ko.exportProperty(dependentObservable, 'dispose', dependentObservable.dispose);
    ko.exportProperty(dependentObservable, 'getDependenciesCount', dependentObservable.getDependenciesCount);

    return dependentObservable;
};

ko.isComputed = function(instance) {
    return ko.hasPrototype(instance, ko.dependentObservable);
};

var protoProp = ko.observable.protoProperty; // == "__ko_proto__"
ko.dependentObservable[protoProp] = ko.observable;

ko.dependentObservable['fn'] = {};
ko.dependentObservable['fn'][protoProp] = ko.dependentObservable;

ko.exportSymbol('dependentObservable', ko.dependentObservable);
ko.exportSymbol('computed', ko.dependentObservable); // Make "ko.computed" an alias for "ko.dependentObservable"
ko.exportSymbol('isComputed', ko.isComputed);

(function() {
    var maxNestedObservableDepth = 10; // Escape the (unlikely) pathalogical case where an observable's current value is itself (or similar reference cycle)

    ko.toJS = function(rootObject) {
        if (arguments.length == 0)
            throw new Error("When calling ko.toJS, pass the object you want to convert.");

        // We just unwrap everything at every level in the object graph
        return mapJsObjectGraph(rootObject, function(valueToMap) {
            // Loop because an observable's value might in turn be another observable wrapper
            for (var i = 0; ko.isObservable(valueToMap) && (i < maxNestedObservableDepth); i++)
                valueToMap = valueToMap();
            return valueToMap;
        });
    };

    ko.toJSON = function(rootObject, replacer, space) {     // replacer and space are optional
        var plainJavaScriptObject = ko.toJS(rootObject);
        return ko.utils.stringifyJson(plainJavaScriptObject, replacer, space);
    };

    function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects) {
        visitedObjects = visitedObjects || new objectLookup();

        rootObject = mapInputCallback(rootObject);
        var canHaveProperties = (typeof rootObject == "object") && (rootObject !== null) && (rootObject !== undefined) && (!(rootObject instanceof Date));
        if (!canHaveProperties)
            return rootObject;

        var outputProperties = rootObject instanceof Array ? [] : {};
        visitedObjects.save(rootObject, outputProperties);

        visitPropertiesOrArrayEntries(rootObject, function(indexer) {
            var propertyValue = mapInputCallback(rootObject[indexer]);

            switch (typeof propertyValue) {
                case "boolean":
                case "number":
                case "string":
                case "function":
                    outputProperties[indexer] = propertyValue;
                    break;
                case "object":
                case "undefined":
                    var previouslyMappedValue = visitedObjects.get(propertyValue);
                    outputProperties[indexer] = (previouslyMappedValue !== undefined)
                        ? previouslyMappedValue
                        : mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
                    break;
            }
        });

        return outputProperties;
    }

    function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
        if (rootObject instanceof Array) {
            for (var i = 0; i < rootObject.length; i++)
                visitorCallback(i);

            // For arrays, also respect toJSON property for custom mappings (fixes #278)
            if (typeof rootObject['toJSON'] == 'function')
                visitorCallback('toJSON');
        } else {
            for (var propertyName in rootObject)
                visitorCallback(propertyName);
        }
    };

    function objectLookup() {
        var keys = [];
        var values = [];
        this.save = function(key, value) {
            var existingIndex = ko.utils.arrayIndexOf(keys, key);
            if (existingIndex >= 0)
                values[existingIndex] = value;
            else {
                keys.push(key);
                values.push(value);
            }
        };
        this.get = function(key) {
            var existingIndex = ko.utils.arrayIndexOf(keys, key);
            return (existingIndex >= 0) ? values[existingIndex] : undefined;
        };
    };
})();

ko.exportSymbol('toJS', ko.toJS);
ko.exportSymbol('toJSON', ko.toJSON);
(function () {
    var hasDomDataExpandoProperty = '__ko__hasDomDataOptionValue__';

    // Normally, SELECT elements and their OPTIONs can only take value of type 'string' (because the values
    // are stored on DOM attributes). ko.selectExtensions provides a way for SELECTs/OPTIONs to have values
    // that are arbitrary objects. This is very convenient when implementing things like cascading dropdowns.
    ko.selectExtensions = {
        readValue : function(element) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    if (element[hasDomDataExpandoProperty] === true)
                        return ko.utils.domData.get(element, ko.bindingHandlers.options.optionValueDomDataKey);
                    return element.getAttribute("value");
                case 'select':
                    return element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
                default:
                    return element.value;
            }
        },

        writeValue: function(element, value) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    switch(typeof value) {
                        case "string":
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, undefined);
                            if (hasDomDataExpandoProperty in element) { // IE <= 8 throws errors if you delete non-existent properties from a DOM node
                                delete element[hasDomDataExpandoProperty];
                            }
                            element.value = value;
                            break;
                        default:
                            // Store arbitrary object using DomData
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, value);
                            element[hasDomDataExpandoProperty] = true;

                            // Special treatment of numbers is just for backward compatibility. KO 1.2.1 wrote numerical values to element.value.
                            element.value = typeof value === "number" ? value : "";
                            break;
                    }
                    break;
                case 'select':
                    for (var i = element.options.length - 1; i >= 0; i--) {
                        if (ko.selectExtensions.readValue(element.options[i]) == value) {
                            element.selectedIndex = i;
                            break;
                        }
                    }
                    break;
                default:
                    if ((value === null) || (value === undefined))
                        value = "";
                    element.value = value;
                    break;
            }
        }
    };
})();

ko.exportSymbol('selectExtensions', ko.selectExtensions);
ko.exportSymbol('selectExtensions.readValue', ko.selectExtensions.readValue);
ko.exportSymbol('selectExtensions.writeValue', ko.selectExtensions.writeValue);

ko.jsonExpressionRewriting = (function () {
    var restoreCapturedTokensRegex = /\@ko_token_(\d+)\@/g;
    var javaScriptAssignmentTarget = /^[\_$a-z][\_$a-z0-9]*(\[.*?\])*(\.[\_$a-z][\_$a-z0-9]*(\[.*?\])*)*$/i;
    var javaScriptReservedWords = ["true", "false"];

    function restoreTokens(string, tokens) {
        var prevValue = null;
        while (string != prevValue) { // Keep restoring tokens until it no longer makes a difference (they may be nested)
            prevValue = string;
            string = string.replace(restoreCapturedTokensRegex, function (match, tokenIndex) {
                return tokens[tokenIndex];
            });
        }
        return string;
    }

    function isWriteableValue(expression) {
        if (ko.utils.arrayIndexOf(javaScriptReservedWords, ko.utils.stringTrim(expression).toLowerCase()) >= 0)
            return false;
        return expression.match(javaScriptAssignmentTarget) !== null;
    }

    function ensureQuoted(key) {
        var trimmedKey = ko.utils.stringTrim(key);
        switch (trimmedKey.length && trimmedKey.charAt(0)) {
            case "'":
            case '"':
                return key;
            default:
                return "'" + trimmedKey + "'";
        }
    }

    return {
        bindingRewriteValidators: [],

        parseObjectLiteral: function(objectLiteralString) {
            // A full tokeniser+lexer would add too much weight to this library, so here's a simple parser
            // that is sufficient just to split an object literal string into a set of top-level key-value pairs

            var str = ko.utils.stringTrim(objectLiteralString);
            if (str.length < 3)
                return [];
            if (str.charAt(0) === "{")// Ignore any braces surrounding the whole object literal
                str = str.substring(1, str.length - 1);

            // Pull out any string literals and regex literals
            var tokens = [];
            var tokenStart = null, tokenEndChar;
            for (var position = 0; position < str.length; position++) {
                var c = str.charAt(position);
                if (tokenStart === null) {
                    switch (c) {
                        case '"':
                        case "'":
                        case "/":
                            tokenStart = position;
                            tokenEndChar = c;
                            break;
                    }
                } else if ((c == tokenEndChar) && (str.charAt(position - 1) !== "\\")) {
                    var token = str.substring(tokenStart, position + 1);
                    tokens.push(token);
                    var replacement = "@ko_token_" + (tokens.length - 1) + "@";
                    str = str.substring(0, tokenStart) + replacement + str.substring(position + 1);
                    position -= (token.length - replacement.length);
                    tokenStart = null;
                }
            }

            // Next pull out balanced paren, brace, and bracket blocks
            tokenStart = null;
            tokenEndChar = null;
            var tokenDepth = 0, tokenStartChar = null;
            for (var position = 0; position < str.length; position++) {
                var c = str.charAt(position);
                if (tokenStart === null) {
                    switch (c) {
                        case "{": tokenStart = position; tokenStartChar = c;
                                  tokenEndChar = "}";
                                  break;
                        case "(": tokenStart = position; tokenStartChar = c;
                                  tokenEndChar = ")";
                                  break;
                        case "[": tokenStart = position; tokenStartChar = c;
                                  tokenEndChar = "]";
                                  break;
                    }
                }

                if (c === tokenStartChar)
                    tokenDepth++;
                else if (c === tokenEndChar) {
                    tokenDepth--;
                    if (tokenDepth === 0) {
                        var token = str.substring(tokenStart, position + 1);
                        tokens.push(token);
                        var replacement = "@ko_token_" + (tokens.length - 1) + "@";
                        str = str.substring(0, tokenStart) + replacement + str.substring(position + 1);
                        position -= (token.length - replacement.length);
                        tokenStart = null;
                    }
                }
            }

            // Now we can safely split on commas to get the key/value pairs
            var result = [];
            var keyValuePairs = str.split(",");
            for (var i = 0, j = keyValuePairs.length; i < j; i++) {
                var pair = keyValuePairs[i];
                var colonPos = pair.indexOf(":");
                if ((colonPos > 0) && (colonPos < pair.length - 1)) {
                    var key = pair.substring(0, colonPos);
                    var value = pair.substring(colonPos + 1);
                    result.push({ 'key': restoreTokens(key, tokens), 'value': restoreTokens(value, tokens) });
                } else {
                    result.push({ 'unknown': restoreTokens(pair, tokens) });
                }
            }
            return result;
        },

        insertPropertyAccessorsIntoJson: function (objectLiteralStringOrKeyValueArray) {
            var keyValueArray = typeof objectLiteralStringOrKeyValueArray === "string"
                ? ko.jsonExpressionRewriting.parseObjectLiteral(objectLiteralStringOrKeyValueArray)
                : objectLiteralStringOrKeyValueArray;
            var resultStrings = [], propertyAccessorResultStrings = [];

            var keyValueEntry;
            for (var i = 0; keyValueEntry = keyValueArray[i]; i++) {
                if (resultStrings.length > 0)
                    resultStrings.push(",");

                if (keyValueEntry['key']) {
                    var quotedKey = ensureQuoted(keyValueEntry['key']), val = keyValueEntry['value'];
                    resultStrings.push(quotedKey);
                    resultStrings.push(":");
                    resultStrings.push(val);

                    if (isWriteableValue(ko.utils.stringTrim(val))) {
                        if (propertyAccessorResultStrings.length > 0)
                            propertyAccessorResultStrings.push(", ");
                        propertyAccessorResultStrings.push(quotedKey + " : function(__ko_value) { " + val + " = __ko_value; }");
                    }
                } else if (keyValueEntry['unknown']) {
                    resultStrings.push(keyValueEntry['unknown']);
                }
            }

            var combinedResult = resultStrings.join("");
            if (propertyAccessorResultStrings.length > 0) {
                var allPropertyAccessors = propertyAccessorResultStrings.join("");
                combinedResult = combinedResult + ", '_ko_property_writers' : { " + allPropertyAccessors + " } ";
            }

            return combinedResult;
        },

        keyValueArrayContainsKey: function(keyValueArray, key) {
            for (var i = 0; i < keyValueArray.length; i++)
                if (ko.utils.stringTrim(keyValueArray[i]['key']) == key)
                    return true;
            return false;
        },

        // Internal, private KO utility for updating model properties from within bindings
        // property:            If the property being updated is (or might be) an observable, pass it here
        //                      If it turns out to be a writable observable, it will be written to directly
        // allBindingsAccessor: All bindings in the current execution context.
        //                      This will be searched for a '_ko_property_writers' property in case you're writing to a non-observable
        // key:                 The key identifying the property to be written. Example: for { hasFocus: myValue }, write to 'myValue' by specifying the key 'hasFocus'
        // value:               The value to be written
        // checkIfDifferent:    If true, and if the property being written is a writable observable, the value will only be written if
        //                      it is !== existing value on that writable observable
        writeValueToProperty: function(property, allBindingsAccessor, key, value, checkIfDifferent) {
            if (!property || !ko.isWriteableObservable(property)) {
                var propWriters = allBindingsAccessor()['_ko_property_writers'];
                if (propWriters && propWriters[key])
                    propWriters[key](value);
            } else if (!checkIfDifferent || property() !== value) {
                property(value);
            }
        }
    };
})();

ko.exportSymbol('jsonExpressionRewriting', ko.jsonExpressionRewriting);
ko.exportSymbol('jsonExpressionRewriting.bindingRewriteValidators', ko.jsonExpressionRewriting.bindingRewriteValidators);
ko.exportSymbol('jsonExpressionRewriting.parseObjectLiteral', ko.jsonExpressionRewriting.parseObjectLiteral);
ko.exportSymbol('jsonExpressionRewriting.insertPropertyAccessorsIntoJson', ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson);
(function() {
    // "Virtual elements" is an abstraction on top of the usual DOM API which understands the notion that comment nodes
    // may be used to represent hierarchy (in addition to the DOM's natural hierarchy).
    // If you call the DOM-manipulating functions on ko.virtualElements, you will be able to read and write the state
    // of that virtual hierarchy
    //
    // The point of all this is to support containerless templates (e.g., <!-- ko foreach:someCollection -->blah<!-- /ko -->)
    // without having to scatter special cases all over the binding and templating code.

    // IE 9 cannot reliably read the "nodeValue" property of a comment node (see https://github.com/SteveSanderson/knockout/issues/186)
    // but it does give them a nonstandard alternative property called "text" that it can read reliably. Other browsers don't have that property.
    // So, use node.text where available, and node.nodeValue elsewhere
    var commentNodesHaveTextProperty = document.createComment("test").text === "<!--test-->";

    var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko\s+(.*\:.*)\s*-->$/ : /^\s*ko\s+(.*\:.*)\s*$/;
    var endCommentRegex =   commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
    var htmlTagsWithOptionallyClosingChildren = { 'ul': true, 'ol': true };

    function isStartComment(node) {
        return (node.nodeType == 8) && (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
    }

    function isEndComment(node) {
        return (node.nodeType == 8) && (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(endCommentRegex);
    }

    function getVirtualChildren(startComment, allowUnbalanced) {
        var currentNode = startComment;
        var depth = 1;
        var children = [];
        while (currentNode = currentNode.nextSibling) {
            if (isEndComment(currentNode)) {
                depth--;
                if (depth === 0)
                    return children;
            }

            children.push(currentNode);

            if (isStartComment(currentNode))
                depth++;
        }
        if (!allowUnbalanced)
            throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue);
        return null;
    }

    function getMatchingEndComment(startComment, allowUnbalanced) {
        var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
        if (allVirtualChildren) {
            if (allVirtualChildren.length > 0)
                return allVirtualChildren[allVirtualChildren.length - 1].nextSibling;
            return startComment.nextSibling;
        } else
            return null; // Must have no matching end comment, and allowUnbalanced is true
    }

    function getUnbalancedChildTags(node) {
        // e.g., from <div>OK</div><!-- ko blah --><span>Another</span>, returns: <!-- ko blah --><span>Another</span>
        //       from <div>OK</div><!-- /ko --><!-- /ko -->,             returns: <!-- /ko --><!-- /ko -->
        var childNode = node.firstChild, captureRemaining = null;
        if (childNode) {
            do {
                if (captureRemaining)                   // We already hit an unbalanced node and are now just scooping up all subsequent nodes
                    captureRemaining.push(childNode);
                else if (isStartComment(childNode)) {
                    var matchingEndComment = getMatchingEndComment(childNode, /* allowUnbalanced: */ true);
                    if (matchingEndComment)             // It's a balanced tag, so skip immediately to the end of this virtual set
                        childNode = matchingEndComment;
                    else
                        captureRemaining = [childNode]; // It's unbalanced, so start capturing from this point
                } else if (isEndComment(childNode)) {
                    captureRemaining = [childNode];     // It's unbalanced (if it wasn't, we'd have skipped over it already), so start capturing
                }
            } while (childNode = childNode.nextSibling);
        }
        return captureRemaining;
    }

    ko.virtualElements = {
        allowedBindings: {},

        childNodes: function(node) {
            return isStartComment(node) ? getVirtualChildren(node) : node.childNodes;
        },

        emptyNode: function(node) {
            if (!isStartComment(node))
                ko.utils.emptyDomNode(node);
            else {
                var virtualChildren = ko.virtualElements.childNodes(node);
                for (var i = 0, j = virtualChildren.length; i < j; i++)
                    ko.removeNode(virtualChildren[i]);
            }
        },

        setDomNodeChildren: function(node, childNodes) {
            if (!isStartComment(node))
                ko.utils.setDomNodeChildren(node, childNodes);
            else {
                ko.virtualElements.emptyNode(node);
                var endCommentNode = node.nextSibling; // Must be the next sibling, as we just emptied the children
                for (var i = 0, j = childNodes.length; i < j; i++)
                    endCommentNode.parentNode.insertBefore(childNodes[i], endCommentNode);
            }
        },

        prepend: function(containerNode, nodeToPrepend) {
            if (!isStartComment(containerNode)) {
                if (containerNode.firstChild)
                    containerNode.insertBefore(nodeToPrepend, containerNode.firstChild);
                else
                    containerNode.appendChild(nodeToPrepend);
            } else {
                // Start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToPrepend, containerNode.nextSibling);
            }
        },

        insertAfter: function(containerNode, nodeToInsert, insertAfterNode) {
            if (!isStartComment(containerNode)) {
                // Insert after insertion point
                if (insertAfterNode.nextSibling)
                    containerNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
                else
                    containerNode.appendChild(nodeToInsert);
            } else {
                // Children of start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
            }
        },

        firstChild: function(node) {
            if (!isStartComment(node))
                return node.firstChild;
            if (!node.nextSibling || isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        nextSibling: function(node) {
            if (isStartComment(node))
                node = getMatchingEndComment(node);
            if (node.nextSibling && isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        virtualNodeBindingValue: function(node) {
            var regexMatch = isStartComment(node);
            return regexMatch ? regexMatch[1] : null;
        },

        normaliseVirtualElementDomStructure: function(elementVerified) {
            // Workaround for https://github.com/SteveSanderson/knockout/issues/155
            // (IE <= 8 or IE 9 quirks mode parses your HTML weirdly, treating closing </li> tags as if they don't exist, thereby moving comment nodes
            // that are direct descendants of <ul> into the preceding <li>)
            if (!htmlTagsWithOptionallyClosingChildren[ko.utils.tagNameLower(elementVerified)])
                return;

            // Scan immediate children to see if they contain unbalanced comment tags. If they do, those comment tags
            // must be intended to appear *after* that child, so move them there.
            var childNode = elementVerified.firstChild;
            if (childNode) {
                do {
                    if (childNode.nodeType === 1) {
                        var unbalancedTags = getUnbalancedChildTags(childNode);
                        if (unbalancedTags) {
                            // Fix up the DOM by moving the unbalanced tags to where they most likely were intended to be placed - *after* the child
                            var nodeToInsertBefore = childNode.nextSibling;
                            for (var i = 0; i < unbalancedTags.length; i++) {
                                if (nodeToInsertBefore)
                                    elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore);
                                else
                                    elementVerified.appendChild(unbalancedTags[i]);
                            }
                        }
                    }
                } while (childNode = childNode.nextSibling);
            }
        }
    };
})();
ko.exportSymbol('virtualElements', ko.virtualElements);
ko.exportSymbol('virtualElements.allowedBindings', ko.virtualElements.allowedBindings);
ko.exportSymbol('virtualElements.emptyNode', ko.virtualElements.emptyNode);
//ko.exportSymbol('virtualElements.firstChild', ko.virtualElements.firstChild);     // firstChild is not minified
ko.exportSymbol('virtualElements.insertAfter', ko.virtualElements.insertAfter);
//ko.exportSymbol('virtualElements.nextSibling', ko.virtualElements.nextSibling);   // nextSibling is not minified
ko.exportSymbol('virtualElements.prepend', ko.virtualElements.prepend);
ko.exportSymbol('virtualElements.setDomNodeChildren', ko.virtualElements.setDomNodeChildren);
(function() {
    var defaultBindingAttributeName = "data-bind";

    ko.bindingProvider = function() {
        this.bindingCache = {};
    };

    ko.utils.extend(ko.bindingProvider.prototype, {
        'nodeHasBindings': function(node) {
            switch (node.nodeType) {
                case 1: return node.getAttribute(defaultBindingAttributeName) != null;   // Element
                case 8: return ko.virtualElements.virtualNodeBindingValue(node) != null; // Comment node
                default: return false;
            }
        },

        'getBindings': function(node, bindingContext) {
            var bindingsString = this['getBindingsString'](node, bindingContext);
            return bindingsString ? this['parseBindingsString'](bindingsString, bindingContext) : null;
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'getBindingsString': function(node, bindingContext) {
            switch (node.nodeType) {
                case 1: return node.getAttribute(defaultBindingAttributeName);   // Element
                case 8: return ko.virtualElements.virtualNodeBindingValue(node); // Comment node
                default: return null;
            }
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'parseBindingsString': function(bindingsString, bindingContext) {
            try {
                var viewModel = bindingContext['$data'],
                    scopes = (typeof viewModel == 'object' && viewModel != null) ? [viewModel, bindingContext] : [bindingContext],
                    bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, scopes.length, this.bindingCache);
                return bindingFunction(scopes);
            } catch (ex) {
                throw new Error("Unable to parse bindings.\nMessage: " + ex + ";\nBindings value: " + bindingsString);
            }
        }
    });

    ko.bindingProvider['instance'] = new ko.bindingProvider();

    function createBindingsStringEvaluatorViaCache(bindingsString, scopesCount, cache) {
        var cacheKey = scopesCount + '_' + bindingsString;
        return cache[cacheKey]
            || (cache[cacheKey] = createBindingsStringEvaluator(bindingsString, scopesCount));
    }

    function createBindingsStringEvaluator(bindingsString, scopesCount) {
        var rewrittenBindings = " { " + ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson(bindingsString) + " } ";
        return ko.utils.buildEvalWithinScopeFunction(rewrittenBindings, scopesCount);
    }
})();

ko.exportSymbol('bindingProvider', ko.bindingProvider);
(function () {
    ko.bindingHandlers = {};

    ko.bindingContext = function(dataItem, parentBindingContext) {
        if (parentBindingContext) {
            ko.utils.extend(this, parentBindingContext); // Inherit $root and any custom properties
            this['$parentContext'] = parentBindingContext;
            this['$parent'] = parentBindingContext['$data'];
            this['$parents'] = (parentBindingContext['$parents'] || []).slice(0);
            this['$parents'].unshift(this['$parent']);
        } else {
            this['$parents'] = [];
            this['$root'] = dataItem;
        }
        this['$data'] = dataItem;
    }
    ko.bindingContext.prototype['createChildContext'] = function (dataItem) {
        return new ko.bindingContext(dataItem, this);
    };
    ko.bindingContext.prototype['extend'] = function(properties) {
        var clone = ko.utils.extend(new ko.bindingContext(), this);
        return ko.utils.extend(clone, properties);
    };

    function validateThatBindingIsAllowedForVirtualElements(bindingName) {
        var validator = ko.virtualElements.allowedBindings[bindingName];
        if (!validator)
            throw new Error("The binding '" + bindingName + "' cannot be used with virtual elements")
    }

    function applyBindingsToDescendantsInternal (viewModel, elementOrVirtualElement, bindingContextsMayDifferFromDomParentElement) {
        var currentChild, nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement);
        while (currentChild = nextInQueue) {
            // Keep a record of the next child *before* applying bindings, in case the binding removes the current child from its position
            nextInQueue = ko.virtualElements.nextSibling(currentChild);
            applyBindingsToNodeAndDescendantsInternal(viewModel, currentChild, bindingContextsMayDifferFromDomParentElement);
        }
    }

    function applyBindingsToNodeAndDescendantsInternal (viewModel, nodeVerified, bindingContextMayDifferFromDomParentElement) {
        var shouldBindDescendants = true;

        // Perf optimisation: Apply bindings only if...
        // (1) We need to store the binding context on this node (because it may differ from the DOM parent node's binding context)
        //     Note that we can't store binding contexts on non-elements (e.g., text nodes), as IE doesn't allow expando properties for those
        // (2) It might have bindings (e.g., it has a data-bind attribute, or it's a marker for a containerless template)
        var isElement = (nodeVerified.nodeType === 1);
        if (isElement) // Workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(nodeVerified);

        var shouldApplyBindings = (isElement && bindingContextMayDifferFromDomParentElement)             // Case (1)
                               || ko.bindingProvider['instance']['nodeHasBindings'](nodeVerified);       // Case (2)
        if (shouldApplyBindings)
            shouldBindDescendants = applyBindingsToNodeInternal(nodeVerified, null, viewModel, bindingContextMayDifferFromDomParentElement).shouldBindDescendants;

        if (shouldBindDescendants) {
            // We're recursing automatically into (real or virtual) child nodes without changing binding contexts. So,
            //  * For children of a *real* element, the binding context is certainly the same as on their DOM .parentNode,
            //    hence bindingContextsMayDifferFromDomParentElement is false
            //  * For children of a *virtual* element, we can't be sure. Evaluating .parentNode on those children may
            //    skip over any number of intermediate virtual elements, any of which might define a custom binding context,
            //    hence bindingContextsMayDifferFromDomParentElement is true
            applyBindingsToDescendantsInternal(viewModel, nodeVerified, /* bindingContextsMayDifferFromDomParentElement: */ !isElement);
        }
    }

    function applyBindingsToNodeInternal (node, bindings, viewModelOrBindingContext, bindingContextMayDifferFromDomParentElement) {
        // Need to be sure that inits are only run once, and updates never run until all the inits have been run
        var initPhase = 0; // 0 = before all inits, 1 = during inits, 2 = after all inits

        // Each time the dependentObservable is evaluated (after data changes),
        // the binding attribute is reparsed so that it can pick out the correct
        // model properties in the context of the changed data.
        // DOM event callbacks need to be able to access this changed data,
        // so we need a single parsedBindings variable (shared by all callbacks
        // associated with this node's bindings) that all the closures can access.
        var parsedBindings;
        function makeValueAccessor(bindingKey) {
            return function () { return parsedBindings[bindingKey] }
        }
        function parsedBindingsAccessor() {
            return parsedBindings;
        }

        var bindingHandlerThatControlsDescendantBindings;
        ko.dependentObservable(
            function () {
                // Ensure we have a nonnull binding context to work with
                var bindingContextInstance = viewModelOrBindingContext && (viewModelOrBindingContext instanceof ko.bindingContext)
                    ? viewModelOrBindingContext
                    : new ko.bindingContext(ko.utils.unwrapObservable(viewModelOrBindingContext));
                var viewModel = bindingContextInstance['$data'];

                // Optimization: Don't store the binding context on this node if it's definitely the same as on node.parentNode, because
                // we can easily recover it just by scanning up the node's ancestors in the DOM
                // (note: here, parent node means "real DOM parent" not "virtual parent", as there's no O(1) way to find the virtual parent)
                if (bindingContextMayDifferFromDomParentElement)
                    ko.storedBindingContextForNode(node, bindingContextInstance);

                // Use evaluatedBindings if given, otherwise fall back on asking the bindings provider to give us some bindings
                var evaluatedBindings = (typeof bindings == "function") ? bindings() : bindings;
                parsedBindings = evaluatedBindings || ko.bindingProvider['instance']['getBindings'](node, bindingContextInstance);

                if (parsedBindings) {
                    // First run all the inits, so bindings can register for notification on changes
                    if (initPhase === 0) {
                        initPhase = 1;
                        for (var bindingKey in parsedBindings) {
                            var binding = ko.bindingHandlers[bindingKey];
                            if (binding && node.nodeType === 8)
                                validateThatBindingIsAllowedForVirtualElements(bindingKey);

                            if (binding && typeof binding["init"] == "function") {
                                var handlerInitFn = binding["init"];
                                var initResult = handlerInitFn(node, makeValueAccessor(bindingKey), parsedBindingsAccessor, viewModel, bindingContextInstance);

                                // If this binding handler claims to control descendant bindings, make a note of this
                                if (initResult && initResult['controlsDescendantBindings']) {
                                    if (bindingHandlerThatControlsDescendantBindings !== undefined)
                                        throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + bindingKey + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
                                    bindingHandlerThatControlsDescendantBindings = bindingKey;
                                }
                            }
                        }
                        initPhase = 2;
                    }

                    // ... then run all the updates, which might trigger changes even on the first evaluation
                    if (initPhase === 2) {
                        for (var bindingKey in parsedBindings) {
                            var binding = ko.bindingHandlers[bindingKey];
                            if (binding && typeof binding["update"] == "function") {
                                var handlerUpdateFn = binding["update"];
                                handlerUpdateFn(node, makeValueAccessor(bindingKey), parsedBindingsAccessor, viewModel, bindingContextInstance);
                            }
                        }
                    }
                }
            },
            null,
            { 'disposeWhenNodeIsRemoved' : node }
        );

        return {
            shouldBindDescendants: bindingHandlerThatControlsDescendantBindings === undefined
        };
    };

    var storedBindingContextDomDataKey = "__ko_bindingContext__";
    ko.storedBindingContextForNode = function (node, bindingContext) {
        if (arguments.length == 2)
            ko.utils.domData.set(node, storedBindingContextDomDataKey, bindingContext);
        else
            return ko.utils.domData.get(node, storedBindingContextDomDataKey);
    }

    ko.applyBindingsToNode = function (node, bindings, viewModel) {
        if (node.nodeType === 1) // If it's an element, workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(node);
        return applyBindingsToNodeInternal(node, bindings, viewModel, true);
    };

    ko.applyBindingsToDescendants = function(viewModel, rootNode) {
        if (rootNode.nodeType === 1 || rootNode.nodeType === 8)
            applyBindingsToDescendantsInternal(viewModel, rootNode, true);
    };

    ko.applyBindings = function (viewModel, rootNode) {
        if (rootNode && (rootNode.nodeType !== 1) && (rootNode.nodeType !== 8))
            throw new Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
        rootNode = rootNode || window.document.body; // Make "rootNode" parameter optional

        applyBindingsToNodeAndDescendantsInternal(viewModel, rootNode, true);
    };

    // Retrieving binding context from arbitrary nodes
    ko.contextFor = function(node) {
        // We can only do something meaningful for elements and comment nodes (in particular, not text nodes, as IE can't store domdata for them)
        switch (node.nodeType) {
            case 1:
            case 8:
                var context = ko.storedBindingContextForNode(node);
                if (context) return context;
                if (node.parentNode) return ko.contextFor(node.parentNode);
                break;
        }
        return undefined;
    };
    ko.dataFor = function(node) {
        var context = ko.contextFor(node);
        return context ? context['$data'] : undefined;
    };

    ko.exportSymbol('bindingHandlers', ko.bindingHandlers);
    ko.exportSymbol('applyBindings', ko.applyBindings);
    ko.exportSymbol('applyBindingsToDescendants', ko.applyBindingsToDescendants);
    ko.exportSymbol('applyBindingsToNode', ko.applyBindingsToNode);
    ko.exportSymbol('contextFor', ko.contextFor);
    ko.exportSymbol('dataFor', ko.dataFor);
})();
// For certain common events (currently just 'click'), allow a simplified data-binding syntax
// e.g. click:handler instead of the usual full-length event:{click:handler}
var eventHandlersWithShortcuts = ['click'];
ko.utils.arrayForEach(eventHandlersWithShortcuts, function(eventName) {
    ko.bindingHandlers[eventName] = {
        'init': function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var newValueAccessor = function () {
                var result = {};
                result[eventName] = valueAccessor();
                return result;
            };
            return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindingsAccessor, viewModel);
        }
    }
});


ko.bindingHandlers['event'] = {
    'init' : function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var eventsToHandle = valueAccessor() || {};
        for(var eventNameOutsideClosure in eventsToHandle) {
            (function() {
                var eventName = eventNameOutsideClosure; // Separate variable to be captured by event handler closure
                if (typeof eventName == "string") {
                    ko.utils.registerEventHandler(element, eventName, function (event) {
                        var handlerReturnValue;
                        var handlerFunction = valueAccessor()[eventName];
                        if (!handlerFunction)
                            return;
                        var allBindings = allBindingsAccessor();

                        try {
                            // Take all the event args, and prefix with the viewmodel
                            var argsForHandler = ko.utils.makeArray(arguments);
                            argsForHandler.unshift(viewModel);
                            handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
                        } finally {
                            if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                                if (event.preventDefault)
                                    event.preventDefault();
                                else
                                    event.returnValue = false;
                            }
                        }

                        var bubble = allBindings[eventName + 'Bubble'] !== false;
                        if (!bubble) {
                            event.cancelBubble = true;
                            if (event.stopPropagation)
                                event.stopPropagation();
                        }
                    });
                }
            })();
        }
    }
};

ko.bindingHandlers['submit'] = {
    'init': function (element, valueAccessor, allBindingsAccessor, viewModel) {
        if (typeof valueAccessor() != "function")
            throw new Error("The value for a submit binding must be a function");
        ko.utils.registerEventHandler(element, "submit", function (event) {
            var handlerReturnValue;
            var value = valueAccessor();
            try { handlerReturnValue = value.call(viewModel, element); }
            finally {
                if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                }
            }
        });
    }
};

ko.bindingHandlers['visible'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var isCurrentlyVisible = !(element.style.display == "none");
        if (value && !isCurrentlyVisible)
            element.style.display = "";
        else if ((!value) && isCurrentlyVisible)
            element.style.display = "none";
    }
}

ko.bindingHandlers['enable'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value && element.disabled)
            element.removeAttribute("disabled");
        else if ((!value) && (!element.disabled))
            element.disabled = true;
    }
};

ko.bindingHandlers['disable'] = {
    'update': function (element, valueAccessor) {
        ko.bindingHandlers['enable']['update'](element, function() { return !ko.utils.unwrapObservable(valueAccessor()) });
    }
};

function ensureDropdownSelectionIsConsistentWithModelValue(element, modelValue, preferModelValue) {
    if (preferModelValue) {
        if (modelValue !== ko.selectExtensions.readValue(element))
            ko.selectExtensions.writeValue(element, modelValue);
    }

    // No matter which direction we're syncing in, we want the end result to be equality between dropdown value and model value.
    // If they aren't equal, either we prefer the dropdown value, or the model value couldn't be represented, so either way,
    // change the model value to match the dropdown.
    if (modelValue !== ko.selectExtensions.readValue(element))
        ko.utils.triggerEvent(element, "change");
};

ko.bindingHandlers['value'] = {
    'init': function (element, valueAccessor, allBindingsAccessor) {
        // Always catch "change" event; possibly other events too if asked
        var eventsToCatch = ["change"];
        var requestedEventsToCatch = allBindingsAccessor()["valueUpdate"];
        if (requestedEventsToCatch) {
            if (typeof requestedEventsToCatch == "string") // Allow both individual event names, and arrays of event names
                requestedEventsToCatch = [requestedEventsToCatch];
            ko.utils.arrayPushAll(eventsToCatch, requestedEventsToCatch);
            eventsToCatch = ko.utils.arrayGetDistinctValues(eventsToCatch);
        }

        var valueUpdateHandler = function() {
            var modelValue = valueAccessor();
            var elementValue = ko.selectExtensions.readValue(element);
            ko.jsonExpressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, 'value', elementValue, /* checkIfDifferent: */ true);
        }

        // Workaround for https://github.com/SteveSanderson/knockout/issues/122
        // IE doesn't fire "change" events on textboxes if the user selects a value from its autocomplete list
        var ieAutoCompleteHackNeeded = ko.utils.ieVersion && element.tagName.toLowerCase() == "input" && element.type == "text"
                                       && element.autocomplete != "off" && (!element.form || element.form.autocomplete != "off");
        if (ieAutoCompleteHackNeeded && ko.utils.arrayIndexOf(eventsToCatch, "propertychange") == -1) {
            var propertyChangedFired = false;
            ko.utils.registerEventHandler(element, "propertychange", function () { propertyChangedFired = true });
            ko.utils.registerEventHandler(element, "blur", function() {
                if (propertyChangedFired) {
                    propertyChangedFired = false;
                    valueUpdateHandler();
                }
            });
        }

        ko.utils.arrayForEach(eventsToCatch, function(eventName) {
            // The syntax "after<eventname>" means "run the handler asynchronously after the event"
            // This is useful, for example, to catch "keydown" events after the browser has updated the control
            // (otherwise, ko.selectExtensions.readValue(this) will receive the control's value *before* the key event)
            var handler = valueUpdateHandler;
            if (ko.utils.stringStartsWith(eventName, "after")) {
                handler = function() { setTimeout(valueUpdateHandler, 0) };
                eventName = eventName.substring("after".length);
            }
            ko.utils.registerEventHandler(element, eventName, handler);
        });
    },
    'update': function (element, valueAccessor) {
        var valueIsSelectOption = ko.utils.tagNameLower(element) === "select";
        var newValue = ko.utils.unwrapObservable(valueAccessor());
        var elementValue = ko.selectExtensions.readValue(element);
        var valueHasChanged = (newValue != elementValue);

        // JavaScript's 0 == "" behavious is unfortunate here as it prevents writing 0 to an empty text box (loose equality suggests the values are the same).
        // We don't want to do a strict equality comparison as that is more confusing for developers in certain cases, so we specifically special case 0 != "" here.
        if ((newValue === 0) && (elementValue !== 0) && (elementValue !== "0"))
            valueHasChanged = true;

        if (valueHasChanged) {
            var applyValueAction = function () { ko.selectExtensions.writeValue(element, newValue); };
            applyValueAction();

            // Workaround for IE6 bug: It won't reliably apply values to SELECT nodes during the same execution thread
            // right after you've changed the set of OPTION nodes on it. So for that node type, we'll schedule a second thread
            // to apply the value as well.
            var alsoApplyAsynchronously = valueIsSelectOption;
            if (alsoApplyAsynchronously)
                setTimeout(applyValueAction, 0);
        }

        // If you try to set a model value that can't be represented in an already-populated dropdown, reject that change,
        // because you're not allowed to have a model value that disagrees with a visible UI selection.
        if (valueIsSelectOption && (element.length > 0))
            ensureDropdownSelectionIsConsistentWithModelValue(element, newValue, /* preferModelValue */ false);
    }
};

ko.bindingHandlers['options'] = {
    'update': function (element, valueAccessor, allBindingsAccessor) {
        if (ko.utils.tagNameLower(element) !== "select")
            throw new Error("options binding applies only to SELECT elements");

        var selectWasPreviouslyEmpty = element.length == 0;
        var previousSelectedValues = ko.utils.arrayMap(ko.utils.arrayFilter(element.childNodes, function (node) {
            return node.tagName && (ko.utils.tagNameLower(node) === "option") && node.selected;
        }), function (node) {
            return ko.selectExtensions.readValue(node) || node.innerText || node.textContent;
        });
        var previousScrollTop = element.scrollTop;

        var value = ko.utils.unwrapObservable(valueAccessor());
        var selectedValue = element.value;

        // Remove all existing <option>s.
        // Need to use .remove() rather than .removeChild() for <option>s otherwise IE behaves oddly (https://github.com/SteveSanderson/knockout/issues/134)
        while (element.length > 0) {
            ko.cleanNode(element.options[0]);
            element.remove(0);
        }

        if (value) {
            var allBindings = allBindingsAccessor();
            if (typeof value.length != "number")
                value = [value];
            if (allBindings['optionsCaption']) {
                var option = document.createElement("option");
                ko.utils.setHtml(option, allBindings['optionsCaption']);
                ko.selectExtensions.writeValue(option, undefined);
                element.appendChild(option);
            }
            for (var i = 0, j = value.length; i < j; i++) {
                var option = document.createElement("option");

                // Apply a value to the option element
                var optionValue = typeof allBindings['optionsValue'] == "string" ? value[i][allBindings['optionsValue']] : value[i];
                optionValue = ko.utils.unwrapObservable(optionValue);
                ko.selectExtensions.writeValue(option, optionValue);

                // Apply some text to the option element
                var optionsTextValue = allBindings['optionsText'];
                var optionText;
                if (typeof optionsTextValue == "function")
                    optionText = optionsTextValue(value[i]); // Given a function; run it against the data value
                else if (typeof optionsTextValue == "string")
                    optionText = value[i][optionsTextValue]; // Given a string; treat it as a property name on the data value
                else
                    optionText = optionValue;				 // Given no optionsText arg; use the data value itself
                if ((optionText === null) || (optionText === undefined))
                    optionText = "";

                ko.utils.setTextContent(option, optionText);

                element.appendChild(option);
            }

            // IE6 doesn't like us to assign selection to OPTION nodes before they're added to the document.
            // That's why we first added them without selection. Now it's time to set the selection.
            var newOptions = element.getElementsByTagName("option");
            var countSelectionsRetained = 0;
            for (var i = 0, j = newOptions.length; i < j; i++) {
                if (ko.utils.arrayIndexOf(previousSelectedValues, ko.selectExtensions.readValue(newOptions[i])) >= 0) {
                    ko.utils.setOptionNodeSelectionState(newOptions[i], true);
                    countSelectionsRetained++;
                }
            }

            element.scrollTop = previousScrollTop;

            if (selectWasPreviouslyEmpty && ('value' in allBindings)) {
                // Ensure consistency between model value and selected option.
                // If the dropdown is being populated for the first time here (or was otherwise previously empty),
                // the dropdown selection state is meaningless, so we preserve the model value.
                ensureDropdownSelectionIsConsistentWithModelValue(element, ko.utils.unwrapObservable(allBindings['value']), /* preferModelValue */ true);
            }

            // Workaround for IE9 bug
            ko.utils.ensureSelectElementIsRenderedCorrectly(element);
        }
    }
};
ko.bindingHandlers['options'].optionValueDomDataKey = '__ko.optionValueDomData__';

ko.bindingHandlers['selectedOptions'] = {
    getSelectedValuesFromSelectNode: function (selectNode) {
        var result = [];
        var nodes = selectNode.childNodes;
        for (var i = 0, j = nodes.length; i < j; i++) {
            var node = nodes[i], tagName = ko.utils.tagNameLower(node);
            if (tagName == "option" && node.selected)
                result.push(ko.selectExtensions.readValue(node));
            else if (tagName == "optgroup") {
                var selectedValuesFromOptGroup = ko.bindingHandlers['selectedOptions'].getSelectedValuesFromSelectNode(node);
                Array.prototype.splice.apply(result, [result.length, 0].concat(selectedValuesFromOptGroup)); // Add new entries to existing 'result' instance
            }
        }
        return result;
    },
    'init': function (element, valueAccessor, allBindingsAccessor) {
        ko.utils.registerEventHandler(element, "change", function () {
            var value = valueAccessor();
            var valueToWrite = ko.bindingHandlers['selectedOptions'].getSelectedValuesFromSelectNode(this);
            ko.jsonExpressionRewriting.writeValueToProperty(value, allBindingsAccessor, 'value', valueToWrite);
        });
    },
    'update': function (element, valueAccessor) {
        if (ko.utils.tagNameLower(element) != "select")
            throw new Error("values binding applies only to SELECT elements");

        var newValue = ko.utils.unwrapObservable(valueAccessor());
        if (newValue && typeof newValue.length == "number") {
            var nodes = element.childNodes;
            for (var i = 0, j = nodes.length; i < j; i++) {
                var node = nodes[i];
                if (ko.utils.tagNameLower(node) === "option")
                    ko.utils.setOptionNodeSelectionState(node, ko.utils.arrayIndexOf(newValue, ko.selectExtensions.readValue(node)) >= 0);
            }
        }
    }
};

ko.bindingHandlers['text'] = {
    'update': function (element, valueAccessor) {
        ko.utils.setTextContent(element, valueAccessor());
    }
};

ko.bindingHandlers['html'] = {
    'init': function() {
        // Prevent binding on the dynamically-injected HTML (as developers are unlikely to expect that, and it has security implications)
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        ko.utils.setHtml(element, value);
    }
};

ko.bindingHandlers['css'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor() || {});
        for (var className in value) {
            if (typeof className == "string") {
                var shouldHaveClass = ko.utils.unwrapObservable(value[className]);
                ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass);
            }
        }
    }
};

ko.bindingHandlers['style'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor() || {});
        for (var styleName in value) {
            if (typeof styleName == "string") {
                var styleValue = ko.utils.unwrapObservable(value[styleName]);
                element.style[styleName] = styleValue || ""; // Empty string removes the value, whereas null/undefined have no effect
            }
        }
    }
};

ko.bindingHandlers['uniqueName'] = {
    'init': function (element, valueAccessor) {
        if (valueAccessor()) {
            element.name = "ko_unique_" + (++ko.bindingHandlers['uniqueName'].currentIndex);

            // Workaround IE 6/7 issue
            // - https://github.com/SteveSanderson/knockout/issues/197
            // - http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
            if (ko.utils.isIe6 || ko.utils.isIe7)
                element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false);
        }
    }
};
ko.bindingHandlers['uniqueName'].currentIndex = 0;

ko.bindingHandlers['checked'] = {
    'init': function (element, valueAccessor, allBindingsAccessor) {
        var updateHandler = function() {
            var valueToWrite;
            if (element.type == "checkbox") {
                valueToWrite = element.checked;
            } else if ((element.type == "radio") && (element.checked)) {
                valueToWrite = element.value;
            } else {
                return; // "checked" binding only responds to checkboxes and selected radio buttons
            }

            var modelValue = valueAccessor();
            if ((element.type == "checkbox") && (ko.utils.unwrapObservable(modelValue) instanceof Array)) {
                // For checkboxes bound to an array, we add/remove the checkbox value to that array
                // This works for both observable and non-observable arrays
                var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.unwrapObservable(modelValue), element.value);
                if (element.checked && (existingEntryIndex < 0))
                    modelValue.push(element.value);
                else if ((!element.checked) && (existingEntryIndex >= 0))
                    modelValue.splice(existingEntryIndex, 1);
            } else {
                ko.jsonExpressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, 'checked', valueToWrite, true);
            }
        };
        ko.utils.registerEventHandler(element, "click", updateHandler);

        // IE 6 won't allow radio buttons to be selected unless they have a name
        if ((element.type == "radio") && !element.name)
            ko.bindingHandlers['uniqueName']['init'](element, function() { return true });
    },
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());

        if (element.type == "checkbox") {
            if (value instanceof Array) {
                // When bound to an array, the checkbox being checked represents its value being present in that array
                element.checked = ko.utils.arrayIndexOf(value, element.value) >= 0;
            } else {
                // When bound to anything other value (not an array), the checkbox being checked represents the value being trueish
                element.checked = value;
            }
        } else if (element.type == "radio") {
            element.checked = (element.value == value);
        }
    }
};

var attrHtmlToJavascriptMap = { 'class': 'className', 'for': 'htmlFor' };
ko.bindingHandlers['attr'] = {
    'update': function(element, valueAccessor, allBindingsAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()) || {};
        for (var attrName in value) {
            if (typeof attrName == "string") {
                var attrValue = ko.utils.unwrapObservable(value[attrName]);

                // To cover cases like "attr: { checked:someProp }", we want to remove the attribute entirely
                // when someProp is a "no value"-like value (strictly null, false, or undefined)
                // (because the absence of the "checked" attr is how to mark an element as not checked, etc.)
                var toRemove = (attrValue === false) || (attrValue === null) || (attrValue === undefined);
                if (toRemove)
                    element.removeAttribute(attrName);

                // In IE <= 7 and IE8 Quirks Mode, you have to use the Javascript property name instead of the
                // HTML attribute name for certain attributes. IE8 Standards Mode supports the correct behavior,
                // but instead of figuring out the mode, we'll just set the attribute through the Javascript
                // property for IE <= 8.
                if (ko.utils.ieVersion <= 8 && attrName in attrHtmlToJavascriptMap) {
                    attrName = attrHtmlToJavascriptMap[attrName];
                    if (toRemove)
                        element.removeAttribute(attrName);
                    else
                        element[attrName] = attrValue;
                } else if (!toRemove) {
                    element.setAttribute(attrName, attrValue.toString());
                }
            }
        }
    }
};

ko.bindingHandlers['hasfocus'] = {
    'init': function(element, valueAccessor, allBindingsAccessor) {
        var writeValue = function(valueToWrite) {
            var modelValue = valueAccessor();
            ko.jsonExpressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, 'hasfocus', valueToWrite, true);
        };
        ko.utils.registerEventHandler(element, "focus", function() { writeValue(true) });
        ko.utils.registerEventHandler(element, "focusin", function() { writeValue(true) }); // For IE
        ko.utils.registerEventHandler(element, "blur",  function() { writeValue(false) });
        ko.utils.registerEventHandler(element, "focusout",  function() { writeValue(false) }); // For IE
    },
    'update': function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        value ? element.focus() : element.blur();
        ko.utils.triggerEvent(element, value ? "focusin" : "focusout"); // For IE, which doesn't reliably fire "focus" or "blur" events synchronously
    }
};

// "with: someExpression" is equivalent to "template: { if: someExpression, data: someExpression }"
ko.bindingHandlers['with'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() { var value = valueAccessor(); return { 'if': value, 'data': value, 'templateEngine': ko.nativeTemplateEngine.instance } };
    },
    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['with'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['with'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
    }
};
ko.jsonExpressionRewriting.bindingRewriteValidators['with'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['with'] = true;

// "if: someExpression" is equivalent to "template: { if: someExpression }"
ko.bindingHandlers['if'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() { return { 'if': valueAccessor(), 'templateEngine': ko.nativeTemplateEngine.instance } };
    },
    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['if'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['if'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
    }
};
ko.jsonExpressionRewriting.bindingRewriteValidators['if'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['if'] = true;

// "ifnot: someExpression" is equivalent to "template: { ifnot: someExpression }"
ko.bindingHandlers['ifnot'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() { return { 'ifnot': valueAccessor(), 'templateEngine': ko.nativeTemplateEngine.instance } };
    },
    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['ifnot'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['ifnot'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
    }
};
ko.jsonExpressionRewriting.bindingRewriteValidators['ifnot'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['ifnot'] = true;

// "foreach: someExpression" is equivalent to "template: { foreach: someExpression }"
// "foreach: { data: someExpression, afterAdd: myfn }" is equivalent to "template: { foreach: someExpression, afterAdd: myfn }"
ko.bindingHandlers['foreach'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() {
            var bindingValue = ko.utils.unwrapObservable(valueAccessor());

            // If bindingValue is the array, just pass it on its own
            if ((!bindingValue) || typeof bindingValue.length == "number")
                return { 'foreach': bindingValue, 'templateEngine': ko.nativeTemplateEngine.instance };

            // If bindingValue.data is the array, preserve all relevant options
            return {
                'foreach': bindingValue['data'],
                'includeDestroyed': bindingValue['includeDestroyed'],
                'afterAdd': bindingValue['afterAdd'],
                'beforeRemove': bindingValue['beforeRemove'],
                'afterRender': bindingValue['afterRender'],
                'templateEngine': ko.nativeTemplateEngine.instance
            };
        };
    },
    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
    }
};
ko.jsonExpressionRewriting.bindingRewriteValidators['foreach'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['foreach'] = true;
// If you want to make a custom template engine,
//
// [1] Inherit from this class (like ko.nativeTemplateEngine does)
// [2] Override 'renderTemplateSource', supplying a function with this signature:
//
//        function (templateSource, bindingContext, options) {
//            // - templateSource.text() is the text of the template you should render
//            // - bindingContext.$data is the data you should pass into the template
//            //   - you might also want to make bindingContext.$parent, bindingContext.$parents,
//            //     and bindingContext.$root available in the template too
//            // - options gives you access to any other properties set on "data-bind: { template: options }"
//            //
//            // Return value: an array of DOM nodes
//        }
//
// [3] Override 'createJavaScriptEvaluatorBlock', supplying a function with this signature:
//
//        function (script) {
//            // Return value: Whatever syntax means "Evaluate the JavaScript statement 'script' and output the result"
//            //               For example, the jquery.tmpl template engine converts 'someScript' to '${ someScript }'
//        }
//
//     This is only necessary if you want to allow data-bind attributes to reference arbitrary template variables.
//     If you don't want to allow that, you can set the property 'allowTemplateRewriting' to false (like ko.nativeTemplateEngine does)
//     and then you don't need to override 'createJavaScriptEvaluatorBlock'.

ko.templateEngine = function () { };

ko.templateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
    throw new Error("Override renderTemplateSource");
};

ko.templateEngine.prototype['createJavaScriptEvaluatorBlock'] = function (script) {
    throw new Error("Override createJavaScriptEvaluatorBlock");
};

ko.templateEngine.prototype['makeTemplateSource'] = function(template, templateDocument) {
    // Named template
    if (typeof template == "string") {
        templateDocument = templateDocument || document;
        var elem = templateDocument.getElementById(template);
        if (!elem)
            throw new Error("Cannot find template with ID " + template);
        return new ko.templateSources.domElement(elem);
    } else if ((template.nodeType == 1) || (template.nodeType == 8)) {
        // Anonymous template
        return new ko.templateSources.anonymousTemplate(template);
    } else
        throw new Error("Unknown template type: " + template);
};

ko.templateEngine.prototype['renderTemplate'] = function (template, bindingContext, options, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    return this['renderTemplateSource'](templateSource, bindingContext, options);
};

ko.templateEngine.prototype['isTemplateRewritten'] = function (template, templateDocument) {
    // Skip rewriting if requested
    if (this['allowTemplateRewriting'] === false)
        return true;

    // Perf optimisation - see below
    var templateIsInExternalDocument = templateDocument && templateDocument != document;
    if (!templateIsInExternalDocument && this.knownRewrittenTemplates && this.knownRewrittenTemplates[template])
        return true;

    return this['makeTemplateSource'](template, templateDocument)['data']("isRewritten");
};

ko.templateEngine.prototype['rewriteTemplate'] = function (template, rewriterCallback, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    var rewritten = rewriterCallback(templateSource['text']());
    templateSource['text'](rewritten);
    templateSource['data']("isRewritten", true);

    // Perf optimisation - for named templates, track which ones have been rewritten so we can
    // answer 'isTemplateRewritten' *without* having to use getElementById (which is slow on IE < 8)
    //
    // Note that we only cache the status for templates in the main document, because caching on a per-doc
    // basis complicates the implementation excessively. In a future version of KO, we will likely remove
    // this 'isRewritten' cache entirely anyway, because the benefit is extremely minor and only applies
    // to rewritable templates, which are pretty much deprecated since KO 2.0.
    var templateIsInExternalDocument = templateDocument && templateDocument != document;
    if (!templateIsInExternalDocument && typeof template == "string") {
        this.knownRewrittenTemplates = this.knownRewrittenTemplates || {};
        this.knownRewrittenTemplates[template] = true;
    }
};

ko.exportSymbol('templateEngine', ko.templateEngine);

ko.templateRewriting = (function () {
    var memoizeDataBindingAttributeSyntaxRegex = /(<[a-z]+\d*(\s+(?!data-bind=)[a-z0-9\-]+(=(\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind=(["'])([\s\S]*?)\5/gi;
    var memoizeVirtualContainerBindingSyntaxRegex = /<!--\s*ko\b\s*([\s\S]*?)\s*-->/g;

    function validateDataBindValuesForRewriting(keyValueArray) {
        var allValidators = ko.jsonExpressionRewriting.bindingRewriteValidators;
        for (var i = 0; i < keyValueArray.length; i++) {
            var key = keyValueArray[i]['key'];
            if (allValidators.hasOwnProperty(key)) {
                var validator = allValidators[key];

                if (typeof validator === "function") {
                    var possibleErrorMessage = validator(keyValueArray[i]['value']);
                    if (possibleErrorMessage)
                        throw new Error(possibleErrorMessage);
                } else if (!validator) {
                    throw new Error("This template engine does not support the '" + key + "' binding within its templates");
                }
            }
        }
    }

    function constructMemoizedTagReplacement(dataBindAttributeValue, tagToRetain, templateEngine) {
        var dataBindKeyValueArray = ko.jsonExpressionRewriting.parseObjectLiteral(dataBindAttributeValue);
        validateDataBindValuesForRewriting(dataBindKeyValueArray);
        var rewrittenDataBindAttributeValue = ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson(dataBindKeyValueArray);

        // For no obvious reason, Opera fails to evaluate rewrittenDataBindAttributeValue unless it's wrapped in an additional
        // anonymous function, even though Opera's built-in debugger can evaluate it anyway. No other browser requires this
        // extra indirection.
        var applyBindingsToNextSiblingScript = "ko.templateRewriting.applyMemoizedBindingsToNextSibling(function() { \
            return (function() { return { " + rewrittenDataBindAttributeValue + " } })() \
        })";
        return templateEngine['createJavaScriptEvaluatorBlock'](applyBindingsToNextSiblingScript) + tagToRetain;
    }

    return {
        ensureTemplateIsRewritten: function (template, templateEngine, templateDocument) {
            if (!templateEngine['isTemplateRewritten'](template, templateDocument))
                templateEngine['rewriteTemplate'](template, function (htmlString) {
                    return ko.templateRewriting.memoizeBindingAttributeSyntax(htmlString, templateEngine);
                }, templateDocument);
        },

        memoizeBindingAttributeSyntax: function (htmlString, templateEngine) {
            return htmlString.replace(memoizeDataBindingAttributeSyntaxRegex, function () {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[6], /* tagToRetain: */ arguments[1], templateEngine);
            }).replace(memoizeVirtualContainerBindingSyntaxRegex, function() {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[1], /* tagToRetain: */ "<!-- ko -->", templateEngine);
            });
        },

        applyMemoizedBindingsToNextSibling: function (bindings) {
            return ko.memoization.memoize(function (domNode, bindingContext) {
                if (domNode.nextSibling)
                    ko.applyBindingsToNode(domNode.nextSibling, bindings, bindingContext);
            });
        }
    }
})();

ko.exportSymbol('templateRewriting', ko.templateRewriting);
ko.exportSymbol('templateRewriting.applyMemoizedBindingsToNextSibling', ko.templateRewriting.applyMemoizedBindingsToNextSibling); // Exported only because it has to be referenced by string lookup from within rewritten template
(function() {
    // A template source represents a read/write way of accessing a template. This is to eliminate the need for template loading/saving
    // logic to be duplicated in every template engine (and means they can all work with anonymous templates, etc.)
    //
    // Two are provided by default:
    //  1. ko.templateSources.domElement       - reads/writes the text content of an arbitrary DOM element
    //  2. ko.templateSources.anonymousElement - uses ko.utils.domData to read/write text *associated* with the DOM element, but
    //                                           without reading/writing the actual element text content, since it will be overwritten
    //                                           with the rendered template output.
    // You can implement your own template source if you want to fetch/store templates somewhere other than in DOM elements.
    // Template sources need to have the following functions:
    //   text() 			- returns the template text from your storage location
    //   text(value)		- writes the supplied template text to your storage location
    //   data(key)			- reads values stored using data(key, value) - see below
    //   data(key, value)	- associates "value" with this template and the key "key". Is used to store information like "isRewritten".
    //
    // Optionally, template sources can also have the following functions:
    //   nodes()            - returns a DOM element containing the nodes of this template, where available
    //   nodes(value)       - writes the given DOM element to your storage location
    // If a DOM element is available for a given template source, template engines are encouraged to use it in preference over text()
    // for improved speed. However, all templateSources must supply text() even if they don't supply nodes().
    //
    // Once you've implemented a templateSource, make your template engine use it by subclassing whatever template engine you were
    // using and overriding "makeTemplateSource" to return an instance of your custom template source.

    ko.templateSources = {};

    // ---- ko.templateSources.domElement -----

    ko.templateSources.domElement = function(element) {
        this.domElement = element;
    }

    ko.templateSources.domElement.prototype['text'] = function(/* valueToWrite */) {
        var tagNameLower = ko.utils.tagNameLower(this.domElement),
            elemContentsProperty = tagNameLower === "script" ? "text"
                                 : tagNameLower === "textarea" ? "value"
                                 : "innerHTML";

        if (arguments.length == 0) {
            return this.domElement[elemContentsProperty];
        } else {
            var valueToWrite = arguments[0];
            if (elemContentsProperty === "innerHTML")
                ko.utils.setHtml(this.domElement, valueToWrite);
            else
                this.domElement[elemContentsProperty] = valueToWrite;
        }
    };

    ko.templateSources.domElement.prototype['data'] = function(key /*, valueToWrite */) {
        if (arguments.length === 1) {
            return ko.utils.domData.get(this.domElement, "templateSourceData_" + key);
        } else {
            ko.utils.domData.set(this.domElement, "templateSourceData_" + key, arguments[1]);
        }
    };

    // ---- ko.templateSources.anonymousTemplate -----
    // Anonymous templates are normally saved/retrieved as DOM nodes through "nodes".
    // For compatibility, you can also read "text"; it will be serialized from the nodes on demand.
    // Writing to "text" is still supported, but then the template data will not be available as DOM nodes.

    var anonymousTemplatesDomDataKey = "__ko_anon_template__";
    ko.templateSources.anonymousTemplate = function(element) {
        this.domElement = element;
    }
    ko.templateSources.anonymousTemplate.prototype = new ko.templateSources.domElement();
    ko.templateSources.anonymousTemplate.prototype['text'] = function(/* valueToWrite */) {
        if (arguments.length == 0) {
            var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
            if (templateData.textData === undefined && templateData.containerData)
                templateData.textData = templateData.containerData.innerHTML;
            return templateData.textData;
        } else {
            var valueToWrite = arguments[0];
            ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {textData: valueToWrite});
        }
    };
    ko.templateSources.domElement.prototype['nodes'] = function(/* valueToWrite */) {
        if (arguments.length == 0) {
            var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
            return templateData.containerData;
        } else {
            var valueToWrite = arguments[0];
            ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {containerData: valueToWrite});
        }
    };

    ko.exportSymbol('templateSources', ko.templateSources);
    ko.exportSymbol('templateSources.domElement', ko.templateSources.domElement);
    ko.exportSymbol('templateSources.anonymousTemplate', ko.templateSources.anonymousTemplate);
})();
(function () {
    var _templateEngine;
    ko.setTemplateEngine = function (templateEngine) {
        if ((templateEngine != undefined) && !(templateEngine instanceof ko.templateEngine))
            throw new Error("templateEngine must inherit from ko.templateEngine");
        _templateEngine = templateEngine;
    }

    function invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, action) {
        var node, nextInQueue = firstNode, firstOutOfRangeNode = ko.virtualElements.nextSibling(lastNode);
        while (nextInQueue && ((node = nextInQueue) !== firstOutOfRangeNode)) {
            nextInQueue = ko.virtualElements.nextSibling(node);
            if (node.nodeType === 1 || node.nodeType === 8)
                action(node);
        }
    }

    function activateBindingsOnContinuousNodeArray(continuousNodeArray, bindingContext) {
        // To be used on any nodes that have been rendered by a template and have been inserted into some parent element
        // Walks through continuousNodeArray (which *must* be continuous, i.e., an uninterrupted sequence of sibling nodes, because
        // the algorithm for walking them relies on this), and for each top-level item in the virtual-element sense,
        // (1) Does a regular "applyBindings" to associate bindingContext with this node and to activate any non-memoized bindings
        // (2) Unmemoizes any memos in the DOM subtree (e.g., to activate bindings that had been memoized during template rewriting)

        if (continuousNodeArray.length) {
            var firstNode = continuousNodeArray[0], lastNode = continuousNodeArray[continuousNodeArray.length - 1];

            // Need to applyBindings *before* unmemoziation, because unmemoization might introduce extra nodes (that we don't want to re-bind)
            // whereas a regular applyBindings won't introduce new memoized nodes
            invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, function(node) {
                ko.applyBindings(bindingContext, node);
            });
            invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, function(node) {
                ko.memoization.unmemoizeDomNodeAndDescendants(node, [bindingContext]);
            });
        }
    }

    function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
        return nodeOrNodeArray.nodeType ? nodeOrNodeArray
                                        : nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0]
                                        : null;
    }

    function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options) {
        options = options || {};
        var firstTargetNode = targetNodeOrNodeArray && getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
        var templateDocument = firstTargetNode && firstTargetNode.ownerDocument;
        var templateEngineToUse = (options['templateEngine'] || _templateEngine);
        ko.templateRewriting.ensureTemplateIsRewritten(template, templateEngineToUse, templateDocument);
        var renderedNodesArray = templateEngineToUse['renderTemplate'](template, bindingContext, options, templateDocument);

        // Loosely check result is an array of DOM nodes
        if ((typeof renderedNodesArray.length != "number") || (renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType != "number"))
            throw new Error("Template engine must return an array of DOM nodes");

        var haveAddedNodesToParent = false;
        switch (renderMode) {
            case "replaceChildren":
                ko.virtualElements.setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "replaceNode":
                ko.utils.replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "ignoreTargetNode": break;
            default:
                throw new Error("Unknown renderMode: " + renderMode);
        }

        if (haveAddedNodesToParent) {
            activateBindingsOnContinuousNodeArray(renderedNodesArray, bindingContext);
            if (options['afterRender'])
                options['afterRender'](renderedNodesArray, bindingContext['$data']);
        }

        return renderedNodesArray;
    }

    ko.renderTemplate = function (template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode) {
        options = options || {};
        if ((options['templateEngine'] || _templateEngine) == undefined)
            throw new Error("Set a template engine before calling renderTemplate");
        renderMode = renderMode || "replaceChildren";

        if (targetNodeOrNodeArray) {
            var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);

            var whenToDispose = function () { return (!firstTargetNode) || !ko.utils.domNodeIsAttachedToDocument(firstTargetNode); }; // Passive disposal (on next evaluation)
            var activelyDisposeWhenNodeIsRemoved = (firstTargetNode && renderMode == "replaceNode") ? firstTargetNode.parentNode : firstTargetNode;

            return ko.dependentObservable( // So the DOM is automatically updated when any dependency changes
                function () {
                    // Ensure we've got a proper binding context to work with
                    var bindingContext = (dataOrBindingContext && (dataOrBindingContext instanceof ko.bindingContext))
                        ? dataOrBindingContext
                        : new ko.bindingContext(ko.utils.unwrapObservable(dataOrBindingContext));

                    // Support selecting template as a function of the data being rendered
                    var templateName = typeof(template) == 'function' ? template(bindingContext['$data']) : template;

                    var renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext, options);
                    if (renderMode == "replaceNode") {
                        targetNodeOrNodeArray = renderedNodesArray;
                        firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
                    }
                },
                null,
                { 'disposeWhen': whenToDispose, 'disposeWhenNodeIsRemoved': activelyDisposeWhenNodeIsRemoved }
            );
        } else {
            // We don't yet have a DOM node to evaluate, so use a memo and render the template later when there is a DOM node
            return ko.memoization.memoize(function (domNode) {
                ko.renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode");
            });
        }
    };

    ko.renderTemplateForEach = function (template, arrayOrObservableArray, options, targetNode, parentBindingContext) {
        // Since setDomNodeChildrenFromArrayMapping always calls executeTemplateForArrayItem and then
        // activateBindingsCallback for added items, we can store the binding context in the former to use in the latter.
        var arrayItemContext;

        // This will be called by setDomNodeChildrenFromArrayMapping to get the nodes to add to targetNode
        var executeTemplateForArrayItem = function (arrayValue, index) {
            // Support selecting template as a function of the data being rendered
            var templateName = typeof(template) == 'function' ? template(arrayValue) : template;
            arrayItemContext = parentBindingContext['createChildContext'](ko.utils.unwrapObservable(arrayValue));
            arrayItemContext['$index'] = index;
            return executeTemplate(null, "ignoreTargetNode", templateName, arrayItemContext, options);
        }

        // This will be called whenever setDomNodeChildrenFromArrayMapping has added nodes to targetNode
        var activateBindingsCallback = function(arrayValue, addedNodesArray, index) {
            activateBindingsOnContinuousNodeArray(addedNodesArray, arrayItemContext);
            if (options['afterRender'])
                options['afterRender'](addedNodesArray, arrayValue);
        };

        return ko.dependentObservable(function () {
            var unwrappedArray = ko.utils.unwrapObservable(arrayOrObservableArray) || [];
            if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                unwrappedArray = [unwrappedArray];

            // Filter out any entries marked as destroyed
            var filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                return options['includeDestroyed'] || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
            });

            ko.utils.setDomNodeChildrenFromArrayMapping(targetNode, filteredArray, executeTemplateForArrayItem, options, activateBindingsCallback);

        }, null, { 'disposeWhenNodeIsRemoved': targetNode });
    };

    var templateSubscriptionDomDataKey = '__ko__templateSubscriptionDomDataKey__';
    function disposeOldSubscriptionAndStoreNewOne(element, newSubscription) {
        var oldSubscription = ko.utils.domData.get(element, templateSubscriptionDomDataKey);
        if (oldSubscription && (typeof(oldSubscription.dispose) == 'function'))
            oldSubscription.dispose();
        ko.utils.domData.set(element, templateSubscriptionDomDataKey, newSubscription);
    }

    ko.bindingHandlers['template'] = {
        'init': function(element, valueAccessor) {
            // Support anonymous templates
            var bindingValue = ko.utils.unwrapObservable(valueAccessor());
            if ((typeof bindingValue != "string") && (!bindingValue['name']) && (element.nodeType == 1 || element.nodeType == 8)) {
                // It's an anonymous template - store the element contents, then clear the element
                var templateNodes = element.nodeType == 1 ? element.childNodes : ko.virtualElements.childNodes(element),
                    container = ko.utils.moveCleanedNodesToContainerElement(templateNodes); // This also removes the nodes from their current parent
                new ko.templateSources.anonymousTemplate(element)['nodes'](container);
            }
            return { 'controlsDescendantBindings': true };
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var bindingValue = ko.utils.unwrapObservable(valueAccessor());
            var templateName;
            var shouldDisplay = true;

            if (typeof bindingValue == "string") {
                templateName = bindingValue;
            } else {
                templateName = bindingValue['name'];

                // Support "if"/"ifnot" conditions
                if ('if' in bindingValue)
                    shouldDisplay = shouldDisplay && ko.utils.unwrapObservable(bindingValue['if']);
                if ('ifnot' in bindingValue)
                    shouldDisplay = shouldDisplay && !ko.utils.unwrapObservable(bindingValue['ifnot']);
            }

            var templateSubscription = null;

            if ((typeof bindingValue === 'object') && ('foreach' in bindingValue)) { // Note: can't use 'in' operator on strings
                // Render once for each data point (treating data set as empty if shouldDisplay==false)
                var dataArray = (shouldDisplay && bindingValue['foreach']) || [];
                templateSubscription = ko.renderTemplateForEach(templateName || element, dataArray, /* options: */ bindingValue, element, bindingContext);
            } else {
                if (shouldDisplay) {
                    // Render once for this single data point (or use the viewModel if no data was provided)
                    var innerBindingContext = (typeof bindingValue == 'object') && ('data' in bindingValue)
                        ? bindingContext['createChildContext'](ko.utils.unwrapObservable(bindingValue['data'])) // Given an explitit 'data' value, we create a child binding context for it
                        : bindingContext;                                                                       // Given no explicit 'data' value, we retain the same binding context
                    templateSubscription = ko.renderTemplate(templateName || element, innerBindingContext, /* options: */ bindingValue, element);
                } else
                    ko.virtualElements.emptyNode(element);
            }

            // It only makes sense to have a single template subscription per element (otherwise which one should have its output displayed?)
            disposeOldSubscriptionAndStoreNewOne(element, templateSubscription);
        }
    };

    // Anonymous templates can't be rewritten. Give a nice error message if you try to do it.
    ko.jsonExpressionRewriting.bindingRewriteValidators['template'] = function(bindingValue) {
        var parsedBindingValue = ko.jsonExpressionRewriting.parseObjectLiteral(bindingValue);

        if ((parsedBindingValue.length == 1) && parsedBindingValue[0]['unknown'])
            return null; // It looks like a string literal, not an object literal, so treat it as a named template (which is allowed for rewriting)

        if (ko.jsonExpressionRewriting.keyValueArrayContainsKey(parsedBindingValue, "name"))
            return null; // Named templates can be rewritten, so return "no error"
        return "This template engine does not support anonymous templates nested within its templates";
    };

    ko.virtualElements.allowedBindings['template'] = true;
})();

ko.exportSymbol('setTemplateEngine', ko.setTemplateEngine);
ko.exportSymbol('renderTemplate', ko.renderTemplate);

(function () {
    // Simple calculation based on Levenshtein distance.
    function calculateEditDistanceMatrix(oldArray, newArray, maxAllowedDistance) {
        var distances = [];
        for (var i = 0; i <= newArray.length; i++)
            distances[i] = [];

        // Top row - transform old array into empty array via deletions
        for (var i = 0, j = Math.min(oldArray.length, maxAllowedDistance); i <= j; i++)
            distances[0][i] = i;

        // Left row - transform empty array into new array via additions
        for (var i = 1, j = Math.min(newArray.length, maxAllowedDistance); i <= j; i++) {
            distances[i][0] = i;
        }

        // Fill out the body of the array
        var oldIndex, oldIndexMax = oldArray.length, newIndex, newIndexMax = newArray.length;
        var distanceViaAddition, distanceViaDeletion;
        for (oldIndex = 1; oldIndex <= oldIndexMax; oldIndex++) {
            var newIndexMinForRow = Math.max(1, oldIndex - maxAllowedDistance);
            var newIndexMaxForRow = Math.min(newIndexMax, oldIndex + maxAllowedDistance);
            for (newIndex = newIndexMinForRow; newIndex <= newIndexMaxForRow; newIndex++) {
                if (oldArray[oldIndex - 1] === newArray[newIndex - 1])
                    distances[newIndex][oldIndex] = distances[newIndex - 1][oldIndex - 1];
                else {
                    var northDistance = distances[newIndex - 1][oldIndex] === undefined ? Number.MAX_VALUE : distances[newIndex - 1][oldIndex] + 1;
                    var westDistance = distances[newIndex][oldIndex - 1] === undefined ? Number.MAX_VALUE : distances[newIndex][oldIndex - 1] + 1;
                    distances[newIndex][oldIndex] = Math.min(northDistance, westDistance);
                }
            }
        }

        return distances;
    }

    function findEditScriptFromEditDistanceMatrix(editDistanceMatrix, oldArray, newArray) {
        var oldIndex = oldArray.length;
        var newIndex = newArray.length;
        var editScript = [];
        var maxDistance = editDistanceMatrix[newIndex][oldIndex];
        if (maxDistance === undefined)
            return null; // maxAllowedDistance must be too small
        while ((oldIndex > 0) || (newIndex > 0)) {
            var me = editDistanceMatrix[newIndex][oldIndex];
            var distanceViaAdd = (newIndex > 0) ? editDistanceMatrix[newIndex - 1][oldIndex] : maxDistance + 1;
            var distanceViaDelete = (oldIndex > 0) ? editDistanceMatrix[newIndex][oldIndex - 1] : maxDistance + 1;
            var distanceViaRetain = (newIndex > 0) && (oldIndex > 0) ? editDistanceMatrix[newIndex - 1][oldIndex - 1] : maxDistance + 1;
            if ((distanceViaAdd === undefined) || (distanceViaAdd < me - 1)) distanceViaAdd = maxDistance + 1;
            if ((distanceViaDelete === undefined) || (distanceViaDelete < me - 1)) distanceViaDelete = maxDistance + 1;
            if (distanceViaRetain < me - 1) distanceViaRetain = maxDistance + 1;

            if ((distanceViaAdd <= distanceViaDelete) && (distanceViaAdd < distanceViaRetain)) {
                editScript.push({ status: "added", value: newArray[newIndex - 1] });
                newIndex--;
            } else if ((distanceViaDelete < distanceViaAdd) && (distanceViaDelete < distanceViaRetain)) {
                editScript.push({ status: "deleted", value: oldArray[oldIndex - 1] });
                oldIndex--;
            } else {
                editScript.push({ status: "retained", value: oldArray[oldIndex - 1] });
                newIndex--;
                oldIndex--;
            }
        }
        return editScript.reverse();
    }

    ko.utils.compareArrays = function (oldArray, newArray, maxEditsToConsider) {
        if (maxEditsToConsider === undefined) {
            return ko.utils.compareArrays(oldArray, newArray, 1)                 // First consider likely case where there is at most one edit (very fast)
                || ko.utils.compareArrays(oldArray, newArray, 10)                // If that fails, account for a fair number of changes while still being fast
                || ko.utils.compareArrays(oldArray, newArray, Number.MAX_VALUE); // Ultimately give the right answer, even though it may take a long time
        } else {
            oldArray = oldArray || [];
            newArray = newArray || [];
            var editDistanceMatrix = calculateEditDistanceMatrix(oldArray, newArray, maxEditsToConsider);
            return findEditScriptFromEditDistanceMatrix(editDistanceMatrix, oldArray, newArray);
        }
    };
})();

ko.exportSymbol('utils.compareArrays', ko.utils.compareArrays);

(function () {
    // Objective:
    // * Given an input array, a container DOM node, and a function from array elements to arrays of DOM nodes,
    //   map the array elements to arrays of DOM nodes, concatenate together all these arrays, and use them to populate the container DOM node
    // * Next time we're given the same combination of things (with the array possibly having mutated), update the container DOM node
    //   so that its children is again the concatenation of the mappings of the array elements, but don't re-map any array elements that we
    //   previously mapped - retain those nodes, and just insert/delete other ones

    // "callbackAfterAddingNodes" will be invoked after any "mapping"-generated nodes are inserted into the container node
    // You can use this, for example, to activate bindings on those nodes.

    function fixUpVirtualElements(contiguousNodeArray) {
        // Ensures that contiguousNodeArray really *is* an array of contiguous siblings, even if some of the interior
        // ones have changed since your array was first built (e.g., because your array contains virtual elements, and
        // their virtual children changed when binding was applied to them).
        // This is needed so that we can reliably remove or update the nodes corresponding to a given array item

        if (contiguousNodeArray.length > 2) {
            // Build up the actual new contiguous node set
            var current = contiguousNodeArray[0], last = contiguousNodeArray[contiguousNodeArray.length - 1], newContiguousSet = [current];
            while (current !== last) {
                current = current.nextSibling;
                if (!current) // Won't happen, except if the developer has manually removed some DOM elements (then we're in an undefined scenario)
                    return;
                newContiguousSet.push(current);
            }

            // ... then mutate the input array to match this.
            // (The following line replaces the contents of contiguousNodeArray with newContiguousSet)
            Array.prototype.splice.apply(contiguousNodeArray, [0, contiguousNodeArray.length].concat(newContiguousSet));
        }
    }

    function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes, index) {
        // Map this array value inside a dependentObservable so we re-map when any dependency changes
        var mappedNodes = [];
        var dependentObservable = ko.dependentObservable(function() {
            var newMappedNodes = mapping(valueToMap, index) || [];

            // On subsequent evaluations, just replace the previously-inserted DOM nodes
            if (mappedNodes.length > 0) {
                fixUpVirtualElements(mappedNodes);
                ko.utils.replaceDomNodes(mappedNodes, newMappedNodes);
                if (callbackAfterAddingNodes)
                    callbackAfterAddingNodes(valueToMap, newMappedNodes);
            }

            // Replace the contents of the mappedNodes array, thereby updating the record
            // of which nodes would be deleted if valueToMap was itself later removed
            mappedNodes.splice(0, mappedNodes.length);
            ko.utils.arrayPushAll(mappedNodes, newMappedNodes);
        }, null, { 'disposeWhenNodeIsRemoved': containerNode, 'disposeWhen': function() { return (mappedNodes.length == 0) || !ko.utils.domNodeIsAttachedToDocument(mappedNodes[0]) } });
        return { mappedNodes : mappedNodes, dependentObservable : dependentObservable };
    }

    var lastMappingResultDomDataKey = "setDomNodeChildrenFromArrayMapping_lastMappingResult";

    ko.utils.setDomNodeChildrenFromArrayMapping = function (domNode, array, mapping, options, callbackAfterAddingNodes) {
        // Compare the provided array against the previous one
        array = array || [];
        options = options || {};
        var isFirstExecution = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) === undefined;
        var lastMappingResult = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) || [];
        var lastArray = ko.utils.arrayMap(lastMappingResult, function (x) { return x.arrayEntry; });
        var editScript = ko.utils.compareArrays(lastArray, array);

        // Build the new mapping result
        var newMappingResult = [];
        var lastMappingResultIndex = 0;
        var nodesToDelete = [];
        var newMappingResultIndex = 0;
        var nodesAdded = [];
        var insertAfterNode = null;
        for (var i = 0, j = editScript.length; i < j; i++) {
            switch (editScript[i].status) {
                case "retained":
                    // Just keep the information - don't touch the nodes
                    var dataToRetain = lastMappingResult[lastMappingResultIndex];
                    dataToRetain.indexObservable(newMappingResultIndex);
                    newMappingResultIndex = newMappingResult.push(dataToRetain);
                    if (dataToRetain.domNodes.length > 0)
                        insertAfterNode = dataToRetain.domNodes[dataToRetain.domNodes.length - 1];
                    lastMappingResultIndex++;
                    break;

                case "deleted":
                    // Stop tracking changes to the mapping for these nodes
                    lastMappingResult[lastMappingResultIndex].dependentObservable.dispose();

                    // Queue these nodes for later removal
                    fixUpVirtualElements(lastMappingResult[lastMappingResultIndex].domNodes);
                    ko.utils.arrayForEach(lastMappingResult[lastMappingResultIndex].domNodes, function (node) {
                        nodesToDelete.push({
                          element: node,
                          index: i,
                          value: editScript[i].value
                        });
                        insertAfterNode = node;
                    });
                    lastMappingResultIndex++;
                    break;

                case "added":
                    var valueToMap = editScript[i].value;
                    var indexObservable = ko.observable(newMappingResultIndex);
                    var mapData = mapNodeAndRefreshWhenChanged(domNode, mapping, valueToMap, callbackAfterAddingNodes, indexObservable);
                    var mappedNodes = mapData.mappedNodes;

                    // On the first evaluation, insert the nodes at the current insertion point
                    newMappingResultIndex = newMappingResult.push({
                        arrayEntry: editScript[i].value,
                        domNodes: mappedNodes,
                        dependentObservable: mapData.dependentObservable,
                        indexObservable: indexObservable
                    });
                    for (var nodeIndex = 0, nodeIndexMax = mappedNodes.length; nodeIndex < nodeIndexMax; nodeIndex++) {
                        var node = mappedNodes[nodeIndex];
                        nodesAdded.push({
                          element: node,
                          index: i,
                          value: editScript[i].value
                        });
                        if (insertAfterNode == null) {
                            // Insert "node" (the newly-created node) as domNode's first child
                            ko.virtualElements.prepend(domNode, node);
                        } else {
                            // Insert "node" into "domNode" immediately after "insertAfterNode"
                            ko.virtualElements.insertAfter(domNode, node, insertAfterNode);
                        }
                        insertAfterNode = node;
                    }
                    if (callbackAfterAddingNodes)
                        callbackAfterAddingNodes(valueToMap, mappedNodes, indexObservable);
                    break;
            }
        }

        ko.utils.arrayForEach(nodesToDelete, function (node) { ko.cleanNode(node.element) });

        var invokedBeforeRemoveCallback = false;
        if (!isFirstExecution) {
            if (options['afterAdd']) {
                for (var i = 0; i < nodesAdded.length; i++)
                    options['afterAdd'](nodesAdded[i].element, nodesAdded[i].index, nodesAdded[i].value);
            }
            if (options['beforeRemove']) {
                for (var i = 0; i < nodesToDelete.length; i++)
                    options['beforeRemove'](nodesToDelete[i].element, nodesToDelete[i].index, nodesToDelete[i].value);
                invokedBeforeRemoveCallback = true;
            }
        }
        if (!invokedBeforeRemoveCallback && nodesToDelete.length) {
            for (var i = 0; i < nodesToDelete.length; i++) {
                var element = nodesToDelete[i].element;
                if (element.parentNode)
                    element.parentNode.removeChild(element);
            }
        }

        // Store a copy of the array items we just considered so we can difference it next time
        ko.utils.domData.set(domNode, lastMappingResultDomDataKey, newMappingResult);
    }
})();

ko.exportSymbol('utils.setDomNodeChildrenFromArrayMapping', ko.utils.setDomNodeChildrenFromArrayMapping);
ko.nativeTemplateEngine = function () {
    this['allowTemplateRewriting'] = false;
}

ko.nativeTemplateEngine.prototype = new ko.templateEngine();
ko.nativeTemplateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
    var useNodesIfAvailable = !(ko.utils.ieVersion < 9), // IE<9 cloneNode doesn't work properly
        templateNodesFunc = useNodesIfAvailable ? templateSource['nodes'] : null,
        templateNodes = templateNodesFunc ? templateSource['nodes']() : null;

    if (templateNodes) {
        return ko.utils.makeArray(templateNodes.cloneNode(true).childNodes);
    } else {
        var templateText = templateSource['text']();
        return ko.utils.parseHtmlFragment(templateText);
    }
};

ko.nativeTemplateEngine.instance = new ko.nativeTemplateEngine();
ko.setTemplateEngine(ko.nativeTemplateEngine.instance);

ko.exportSymbol('nativeTemplateEngine', ko.nativeTemplateEngine);
(function() {
    ko.jqueryTmplTemplateEngine = function () {
        // Detect which version of jquery-tmpl you're using. Unfortunately jquery-tmpl
        // doesn't expose a version number, so we have to infer it.
        // Note that as of Knockout 1.3, we only support jQuery.tmpl 1.0.0pre and later,
        // which KO internally refers to as version "2", so older versions are no longer detected.
        var jQueryTmplVersion = this.jQueryTmplVersion = (function() {
            if ((typeof(jQuery) == "undefined") || !(jQuery['tmpl']))
                return 0;
            // Since it exposes no official version number, we use our own numbering system. To be updated as jquery-tmpl evolves.
            try {
                if (jQuery['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {
                    // Since 1.0.0pre, custom tags should append markup to an array called "__"
                    return 2; // Final version of jquery.tmpl
                }
            } catch(ex) { /* Apparently not the version we were looking for */ }

            return 1; // Any older version that we don't support
        })();

        function ensureHasReferencedJQueryTemplates() {
            if (jQueryTmplVersion < 2)
                throw new Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
        }

        function executeTemplate(compiledTemplate, data, jQueryTemplateOptions) {
            return jQuery['tmpl'](compiledTemplate, data, jQueryTemplateOptions);
        }

        this['renderTemplateSource'] = function(templateSource, bindingContext, options) {
            options = options || {};
            ensureHasReferencedJQueryTemplates();

            // Ensure we have stored a precompiled version of this template (don't want to reparse on every render)
            var precompiled = templateSource['data']('precompiled');
            if (!precompiled) {
                var templateText = templateSource['text']() || "";
                // Wrap in "with($whatever.koBindingContext) { ... }"
                templateText = "{{ko_with $item.koBindingContext}}" + templateText + "{{/ko_with}}";

                precompiled = jQuery['template'](null, templateText);
                templateSource['data']('precompiled', precompiled);
            }

            var data = [bindingContext['$data']]; // Prewrap the data in an array to stop jquery.tmpl from trying to unwrap any arrays
            var jQueryTemplateOptions = jQuery['extend']({ 'koBindingContext': bindingContext }, options['templateOptions']);

            var resultNodes = executeTemplate(precompiled, data, jQueryTemplateOptions);
            resultNodes['appendTo'](document.createElement("div")); // Using "appendTo" forces jQuery/jQuery.tmpl to perform necessary cleanup work

            jQuery['fragments'] = {}; // Clear jQuery's fragment cache to avoid a memory leak after a large number of template renders
            return resultNodes;
        };

        this['createJavaScriptEvaluatorBlock'] = function(script) {
            return "{{ko_code ((function() { return " + script + " })()) }}";
        };

        this['addTemplate'] = function(templateName, templateMarkup) {
            document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "</script>");
        };

        if (jQueryTmplVersion > 0) {
            jQuery['tmpl']['tag']['ko_code'] = {
                open: "__.push($1 || '');"
            };
            jQuery['tmpl']['tag']['ko_with'] = {
                open: "with($1) {",
                close: "} "
            };
        }
    };

    ko.jqueryTmplTemplateEngine.prototype = new ko.templateEngine();

    // Use this one by default *only if jquery.tmpl is referenced*
    var jqueryTmplTemplateEngineInstance = new ko.jqueryTmplTemplateEngine();
    if (jqueryTmplTemplateEngineInstance.jQueryTmplVersion > 0)
        ko.setTemplateEngine(jqueryTmplTemplateEngineInstance);

    ko.exportSymbol('jqueryTmplTemplateEngine', ko.jqueryTmplTemplateEngine);
})();
});
})(window,document,navigator);
/*
  knockback.js 0.16.6 (full version)
  (c) 2011, 2012 Kevin Malakoff - http://kmalakoff.github.com/knockback/
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
*/
(function() {
  return (function(factory) {
    // AMD
    if (typeof define === 'function' && define.amd) {
      return define('knockback', ['underscore', 'backbone', 'knockout'], factory);
    }
    // CommonJS/NodeJS or No Loader
    else {
      return factory.call(this);
    }
  })(function() {// Generated by CoffeeScript 1.3.3
/*
  knockback-core.js 0.16.6
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
*/

var Backbone, EMAIL_REGEXP, KB_TYPE_ARRAY, KB_TYPE_COLLECTION, KB_TYPE_MODEL, KB_TYPE_SIMPLE, KB_TYPE_UNKNOWN, NUMBER_REGEXP, URL_REGEXP, addStatisticsEvent, arraySlice, arraySplice, buildEvalWithinScopeFunction, collapseOptions, kb, ko, legacyWarning, onReady, throwMissing, throwUnexpected, _, _argumentsAddKey, _unwrapModels, _wrappedKey,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

kb = (function() {

  function kb() {}

  kb.VERSION = '0.16.6';

  kb.TYPE_UNKNOWN = 0;

  kb.TYPE_SIMPLE = 1;

  kb.TYPE_ARRAY = 2;

  kb.TYPE_MODEL = 3;

  kb.TYPE_COLLECTION = 4;

  kb.release = function(obj, pre_release_fn) {
    var array, item, view_model, view_models, _i, _j, _len, _len1;
    if ((!obj || (obj !== Object(obj))) || ((typeof obj === 'function') && !ko.isObservable(obj)) || obj.__kb_destroyed || ((obj instanceof Backbone.Model) || (obj instanceof Backbone.Collection))) {
      return this;
    }
    if (_.isArray(obj)) {
      array = obj.splice(0, obj.length);
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        item = array[_i];
        kb.release(item);
      }
      return this;
    }
    obj.__kb_destroyed = true;
    !pre_release_fn || pre_release_fn();
    if (ko.isObservable(obj) || (typeof obj.dispose === 'function') || (typeof obj.destroy === 'function') || (typeof obj.release === 'function')) {
      if (ko.isObservable(obj) && _.isArray(array = obj())) {
        if (obj.__kb_is_co || (obj.__kb_is_o && (obj.valueType() === KB_TYPE_COLLECTION))) {
          if (obj.destroy) {
            obj.destroy();
          } else if (obj.dispose) {
            obj.dispose();
          }
        } else if (array.length) {
          view_models = array.slice(0);
          array.splice(0, array.length);
          for (_j = 0, _len1 = view_models.length; _j < _len1; _j++) {
            view_model = view_models[_j];
            kb.release(view_model);
          }
        }
      } else if (obj.release) {
        obj.release();
      } else if (obj.destroy) {
        obj.destroy();
      } else if (obj.dispose) {
        obj.dispose();
      }
    } else {
      this.releaseKeys(obj);
    }
    return this;
  };

  kb.releaseKeys = function(obj) {
    var key, value;
    for (key in obj) {
      value = obj[key];
      (key === '__kb') || kb.release(value, (function() {
        return obj[key] = null;
      }));
    }
    return this;
  };

  kb.releaseOnNodeRemove = function(view_model, node) {
    view_model || throwUnexpected(this, 'missing view model');
    node || throwUnexpected(this, 'missing node');
    return ko.utils.domNodeDisposal.addDisposeCallback(node, function() {
      return kb.release(view_model);
    });
  };

  kb.renderTemplate = function(template, view_model, options) {
    var el, observable;
    if (options == null) {
      options = {};
    }
    el = document.createElement('div');
    observable = ko.renderTemplate(template, view_model, options, el, 'replaceChildren');
    if (el.children.length === 1) {
      el = el.children[0];
    }
    kb.releaseOnNodeRemove(view_model, el);
    observable.dispose();
    return el;
  };

  kb.renderAutoReleasedTemplate = function(template, view_model, options) {
    if (options == null) {
      options = {};
    }
    legacyWarning('kb.renderAutoReleasedTemplate', '0.16.3', 'Please use kb.renderTemplate instead');
    return this.renderTemplate(template, view_model, options = {});
  };

  kb.applyBindings = function(view_model, node) {
    ko.applyBindings(view_model, node);
    return kb.releaseOnNodeRemove(view_model, node);
  };

  return kb;

})();

this.Knockback = this.kb = kb;

if (typeof exports !== 'undefined') {
  module.exports = kb;
}

if (!this._ && (typeof require !== 'undefined')) {
  try {
    _ = require('lodash');
  } catch (e) {
    _ = require('underscore');
  }
} else {
  _ = this._;
}

kb._ = _ = _.hasOwnProperty('_') ? _._ : _;

kb.Backbone = Backbone = !this.Backbone && (typeof require !== 'undefined') ? require('backbone') : this.Backbone;

kb.ko = ko = !this.ko && (typeof require !== 'undefined') ? require('knockout') : this.ko;

throwMissing = function(instance, message) {
  throw "" + (_.isString(instance) ? instance : instance.constructor.name) + ": " + message + " is missing";
};

throwUnexpected = function(instance, message) {
  throw "" + (_.isString(instance) ? instance : instance.constructor.name) + ": " + message + " is unexpected";
};

legacyWarning = function(identifier, last_version, message) {
  var _base;
  this._legacy_warnings || (this._legacy_warnings = {});
  (_base = this._legacy_warnings)[identifier] || (_base[identifier] = 0);
  this._legacy_warnings[identifier]++;
  return console.warn("warning: '" + identifier + "' has been deprecated (will be removed in Knockback after " + last_version + "). " + message + ".");
};

arraySplice = Array.prototype.splice;

collapseOptions = function(options) {
  var result;
  result = _.clone(options);
  while (options.options) {
    _.defaults(result, options.options);
    options = options.options;
  }
  delete result.options;
  return result;
};

KB_TYPE_UNKNOWN = kb.TYPE_UNKNOWN;

KB_TYPE_SIMPLE = kb.TYPE_SIMPLE;

KB_TYPE_ARRAY = kb.TYPE_ARRAY;

KB_TYPE_MODEL = kb.TYPE_MODEL;

KB_TYPE_COLLECTION = kb.TYPE_COLLECTION;

/*
  knockback-utils.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
*/


_wrappedKey = function(obj, key, value) {
  if (arguments.length === 2) {
    if (obj && obj.__kb && obj.__kb.hasOwnProperty(key)) {
      return obj.__kb[key];
    } else {
      return void 0;
    }
  }
  obj || throwUnexpected(this, "no obj for wrapping " + key);
  obj.__kb || (obj.__kb = {});
  obj.__kb[key] = value;
  return value;
};

_argumentsAddKey = function(args, key) {
  arraySplice.call(args, 1, 0, key);
  return args;
};

_unwrapModels = function(obj) {
  var key, result, value;
  if (!obj) {
    return obj;
  } else if (obj.__kb) {
    if ('object' in obj.__kb) {
      return obj.__kb.object;
    } else {
      return obj;
    }
  } else if (_.isArray(obj)) {
    return _.map(obj, function(test) {
      return _unwrapModels(test);
    });
  } else if (_.isObject(obj) && !ko.isObservable(obj) && !_.isDate(obj) && !_.isString(obj)) {
    result = {};
    for (key in obj) {
      value = obj[key];
      result[key] = _unwrapModels(value);
    }
    return result;
  } else {
    return obj;
  }
};

kb.utils = (function() {

  function utils() {}

  utils.wrappedObservable = function(obj, value) {
    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'observable'));
  };

  utils.wrappedObject = function(obj, value) {
    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'object'));
  };

  utils.wrappedModel = function(obj, value) {
    if (arguments.length === 1) {
      value = _wrappedKey(obj, 'object');
      if (_.isUndefined(value)) {
        return obj;
      } else {
        return value;
      }
    } else {
      return _wrappedKey(obj, 'object', value);
    }
  };

  utils.wrappedStore = function(obj, value) {
    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'store'));
  };

  utils.wrappedStoreIsOwned = function(obj, value) {
    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'store_is_owned'));
  };

  utils.wrappedFactory = function(obj, value) {
    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'factory'));
  };

  utils.wrappedModelWatcher = function(obj, value) {
    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'model_watcher'));
  };

  utils.wrappedModelWatcherIsOwned = function(obj, value) {
    return _wrappedKey.apply(this, _argumentsAddKey(arguments, 'model_watcher_is_owned'));
  };

  utils.wrappedDestroy = function(obj) {
    var __kb;
    if (!obj.__kb) {
      return;
    }
    if (obj.__kb.model_watcher) {
      obj.__kb.model_watcher.releaseCallbacks(obj);
    }
    __kb = obj.__kb;
    obj.__kb = null;
    if (__kb.observable) {
      __kb.observable.destroy = __kb.observable.release = null;
      this.wrappedDestroy(__kb.observable);
      __kb.observable = null;
    }
    __kb.factory = null;
    if (__kb.model_watcher_is_owned) {
      __kb.model_watcher.destroy();
    }
    __kb.model_watcher = null;
    if (__kb.store_is_owned) {
      __kb.store.destroy();
    }
    return __kb.store = null;
  };

  utils.valueType = function(observable) {
    if (!observable) {
      return KB_TYPE_UNKNOWN;
    }
    if (observable.__kb_is_o) {
      return observable.valueType();
    }
    if (observable.__kb_is_co || (observable instanceof Backbone.Collection)) {
      return KB_TYPE_COLLECTION;
    }
    if ((observable instanceof kb.ViewModel) || (observable instanceof Backbone.Model)) {
      return KB_TYPE_MODEL;
    }
    if (_.isArray(observable)) {
      return KB_TYPE_ARRAY;
    }
    return KB_TYPE_SIMPLE;
  };

  utils.pathJoin = function(path1, path2) {
    return (path1 ? (path1[path1.length - 1] !== '.' ? "" + path1 + "." : path1) : '') + path2;
  };

  utils.optionsPathJoin = function(options, path) {
    return _.defaults({
      path: this.pathJoin(options.path, path)
    }, options);
  };

  utils.inferCreator = function(value, factory, path, owner, key) {
    var creator, relation;
    if (factory) {
      creator = factory.creatorForPath(value, path);
    }
    if (creator) {
      return creator;
    }
    if (owner && Backbone.RelationalModel && (owner instanceof Backbone.RelationalModel)) {
      key = ko.utils.unwrapObservable(key);
      relation = _.find(owner.getRelations(), function(test) {
        return test.key === key;
      });
      if (relation) {
        if (relation.collectionType || _.isArray(relation.keyContents)) {
          return kb.CollectionObservable;
        } else {
          return kb.ViewModel;
        }
      }
    }
    if (!value) {
      return null;
    }
    if (value instanceof Backbone.Model) {
      return kb.ViewModel;
    }
    if (value instanceof Backbone.Collection) {
      return kb.CollectionObservable;
    }
    return null;
  };

  utils.createFromDefaultCreator = function(obj, options) {
    if (obj instanceof Backbone.Model) {
      return kb.viewModel(obj, options);
    }
    if (obj instanceof Backbone.Collection) {
      return kb.collectionObservable(obj, options);
    }
    if (_.isArray(obj)) {
      return ko.observableArray(obj);
    }
    return ko.observable(obj);
  };

  utils.release = function(obj) {
    legacyWarning('kb.utils.release', '0.16.0', 'Please use kb.release instead');
    return kb.release(obj);
  };

  return utils;

})();

/*
  knockback_factory.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Factory is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/


kb.Factory = (function() {

  Factory.useOptionsOrCreate = function(options, obj, owner_path) {
    var factory;
    if (options.factory && (!options.factories || (options.factories && options.factory.hasPathMappings(options.factories, owner_path)))) {
      return kb.utils.wrappedFactory(obj, options.factory);
    }
    factory = kb.utils.wrappedFactory(obj, new kb.Factory(options.factory));
    if (options.factories) {
      factory.addPathMappings(options.factories, owner_path);
    }
    return factory;
  };

  function Factory(parent_factory) {
    this.parent_factory = parent_factory;
    this.paths = {};
  }

  Factory.prototype.hasPath = function(path) {
    return this.paths.hasOwnProperty(path) || (this.parent_factory && this.parent_factory.hasPath(path));
  };

  Factory.prototype.addPathMapping = function(path, create_info) {
    return this.paths[path] = create_info;
  };

  Factory.prototype.addPathMappings = function(factories, owner_path) {
    var create_info, path;
    for (path in factories) {
      create_info = factories[path];
      this.paths[kb.utils.pathJoin(owner_path, path)] = create_info;
    }
  };

  Factory.prototype.hasPathMappings = function(factories, owner_path) {
    var all_exist, creator, existing_creator, path;
    all_exist = true;
    for (path in factories) {
      creator = factories[path];
      all_exist &= (existing_creator = this.creatorForPath(null, kb.utils.pathJoin(owner_path, path))) && (creator === existing_creator);
    }
    return all_exist;
  };

  Factory.prototype.creatorForPath = function(obj, path) {
    var creator;
    if ((creator = this.paths[path])) {
      if (creator.view_model) {
        return creator.view_model;
      } else {
        return creator;
      }
    }
    if (this.parent_factory) {
      if ((creator = this.parent_factory.creatorForPath(obj, path))) {
        return creator;
      }
    }
    return null;
  };

  return Factory;

})();

/*
  knockback_store.js
  (c) 2012 Kevin Malakoff.
  Knockback.Store is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/


kb.Store = (function() {

  Store.useOptionsOrCreate = function(options, obj, observable) {
    if (options.store) {
      options.store.register(obj, observable, options);
      return kb.utils.wrappedStore(observable, options.store);
    } else {
      kb.utils.wrappedStoreIsOwned(observable, true);
      return kb.utils.wrappedStore(observable, new kb.Store());
    }
  };

  function Store() {
    this.observable_records = [];
    this.replaced_observables = [];
  }

  Store.prototype.destroy = function() {
    var observable, record, _i, _j, _len, _len1, _ref, _ref1;
    _ref = this.observable_records;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      record = _ref[_i];
      kb.release(record.observable);
    }
    _ref1 = this.replaced_observables;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      observable = _ref1[_j];
      kb.release(observable);
    }
    this.observable_records = null;
    return this.replaced_observables = null;
  };

  Store.prototype.register = function(obj, observable, options) {
    var creator;
    if (!observable) {
      return;
    }
    if (ko.isObservable(observable) || observable.__kb_is_co) {
      return;
    }
    kb.utils.wrappedObject(observable, obj);
    if (!obj) {
      observable.__kb_null = true;
    }
    creator = options.creator ? options.creator : (options.path && options.factory ? options.factory.creatorForPath(obj, options.path) : null);
    if (!creator) {
      creator = observable.constructor;
    }
    this.observable_records.push({
      obj: obj,
      observable: observable,
      creator: creator
    });
    return observable;
  };

  Store.prototype.findIndex = function(obj, creator) {
    var index, record, _ref;
    if (!obj || (obj instanceof Backbone.Model)) {
      _ref = this.observable_records;
      for (index in _ref) {
        record = _ref[index];
        if (!record.observable) {
          continue;
        }
        if (record.observable.__kb_destroyed) {
          record.obj = null;
          record.observable = null;
          continue;
        }
        if ((!obj && !record.observable.__kb_null) || (obj && (record.observable.__kb_null || (record.obj !== obj)))) {
          continue;
        } else if ((record.creator === creator) || (record.creator.create && (record.creator.create === creator.create))) {
          return index;
        }
      }
    }
    return -1;
  };

  Store.prototype.find = function(obj, creator) {
    var index;
    if ((index = this.findIndex(obj, creator)) < 0) {
      return null;
    } else {
      return this.observable_records[index].observable;
    }
  };

  Store.prototype.isRegistered = function(observable) {
    var record, _i, _len, _ref;
    _ref = this.observable_records;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      record = _ref[_i];
      if (record.observable === observable) {
        return true;
      }
    }
    return false;
  };

  Store.prototype.findOrCreate = function(obj, options) {
    var creator, observable;
    options.store = this;
    options.creator || (options.creator = kb.utils.inferCreator(obj, options.factory, options.path));
    if (!options.creator && (obj instanceof Backbone.Model)) {
      options.creator = kv.ViewModel;
    }
    creator = options.creator;
    if (!creator) {
      return kb.utils.createFromDefaultCreator(obj, options);
    } else if (creator.models_only) {
      return obj;
    }
    if (creator) {
      observable = this.find(obj, creator);
    }
    if (observable) {
      return observable;
    }
    if (creator.create) {
      observable = creator.create(obj, options);
    } else {
      observable = new creator(obj, options);
    }
    observable || (observable = ko.observable(null));
    if (!ko.isObservable(observable)) {
      this.isRegistered(observable) || this.register(obj, observable, options);
    }
    return observable;
  };

  Store.prototype.findOrReplace = function(obj, creator, observable) {
    var index, record;
    obj || raiseUnexpected('obj missing');
    if ((index = this.findIndex(obj, creator)) < 0) {
      return this.register(obj, observable, {
        creator: creator
      });
    } else {
      record = this.observable_records[index];
      (kb.utils.wrappedObject(record.observable) === obj) || throwUnexpected(this, 'different object');
      if (record.observable !== observable) {
        (record.observable.constructor === observable.constructor) || throwUnexpected(this, 'replacing different type');
        this.replaced_observables.push(record.observable);
        record.observable = observable;
      }
      return observable;
    }
  };

  return Store;

})();

/*
  knockback_model_watcher.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/


addStatisticsEvent = function(model, event_name, info) {
  return !kb.statistics || kb.statistics.addModelEvent({
    name: event_name,
    model: model,
    key: info.key,
    path: info.path
  });
};

kb.ModelWatcher = (function() {

  ModelWatcher.useOptionsOrCreate = function(options, model, obj, callback_options) {
    if (options.model_watcher) {
      if (!(options.model_watcher.model() === model || (options.model_watcher.model_ref === model))) {
        throwUnexpected(this, 'model not matching');
      }
      return kb.utils.wrappedModelWatcher(obj, options.model_watcher).registerCallbacks(obj, callback_options);
    } else {
      kb.utils.wrappedModelWatcherIsOwned(obj, true);
      return kb.utils.wrappedModelWatcher(obj, new kb.ModelWatcher(model)).registerCallbacks(obj, callback_options);
    }
  };

  function ModelWatcher(model, obj, callback_options) {
    this._onModelUnloaded = __bind(this._onModelUnloaded, this);

    this._onModelLoaded = __bind(this._onModelLoaded, this);
    this.__kb || (this.__kb = {});
    this.__kb.callbacks = {};
    this.__kb._onModelLoaded = _.bind(this._onModelLoaded, this);
    this.__kb._onModelUnloaded = _.bind(this._onModelUnloaded, this);
    if (callback_options) {
      this.registerCallbacks(obj, callback_options);
    }
    if (model) {
      this.model(model);
    } else {
      this.m = null;
    }
  }

  ModelWatcher.prototype.destroy = function() {
    this.model(null);
    this.__kb.callbacks = null;
    return kb.utils.wrappedDestroy(this);
  };

  ModelWatcher.prototype.model = function(new_model) {
    var callbacks, event_name, info, list, previous_model, _i, _len, _ref;
    if ((arguments.length === 0) || (this.m === new_model)) {
      return this.m;
    }
    if (this.model_ref) {
      this.model_ref.unbind('loaded', this.__kb._onModelLoaded);
      this.model_ref.unbind('unloaded', this.__kb._onModelUnloaded);
      this.model_ref.release();
      this.model_ref = null;
    }
    if (Backbone.ModelRef && (new_model instanceof Backbone.ModelRef)) {
      this.model_ref = new_model;
      this.model_ref.retain();
      this.model_ref.bind('loaded', this.__kb._onModelLoaded);
      this.model_ref.bind('unloaded', this.__kb._onModelUnloaded);
      new_model = this.model_ref.model();
    } else {
      delete this.model_ref;
    }
    previous_model = this.m;
    this.m = new_model;
    _ref = this.__kb.callbacks;
    for (event_name in _ref) {
      callbacks = _ref[event_name];
      if (previous_model) {
        previous_model.unbind(event_name, callbacks.fn);
      }
      if (new_model) {
        new_model.bind(event_name, callbacks.fn);
      }
      list = callbacks.list;
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        info = list[_i];
        if (info.model) {
          info.model(new_model);
        }
      }
    }
    return new_model;
  };

  ModelWatcher.prototype.registerCallbacks = function(obj, callback_info) {
    var callbacks, event_name, info, list;
    obj || throwMissing(this, 'obj');
    callback_info || throwMissing(this, 'info');
    event_name = callback_info.event_name ? callback_info.event_name : 'change';
    callbacks = this.__kb.callbacks[event_name];
    if (!callbacks) {
      list = [];
      callbacks = {
        list: list,
        fn: function(model) {
          var info, _i, _len;
          for (_i = 0, _len = list.length; _i < _len; _i++) {
            info = list[_i];
            if (info.update && !info.rel_fn) {
              if (model && info.key && (model.hasChanged && !model.hasChanged(ko.utils.unwrapObservable(info.key)))) {
                continue;
              }
              !kb.statistics || addStatisticsEvent(model, event_name, info);
              info.update();
            }
          }
          return null;
        }
      };
      this.__kb.callbacks[event_name] = callbacks;
      if (this.m) {
        this.m.bind(event_name, callbacks.fn);
      }
    }
    info = _.defaults({
      obj: obj
    }, callback_info);
    callbacks.list.push(info);
    if (this.m) {
      if (Backbone.RelationalModel && (this.m instanceof Backbone.RelationalModel)) {
        this._modelBindRelatationalInfo(event_name, info);
      }
      info.model(this.m) && info.model;
    }
  };

  ModelWatcher.prototype.releaseCallbacks = function(obj) {
    var callbacks, event_name, index, info, _ref, _ref1;
    if (!this.__kb.callbacks) {
      return;
    }
    _ref = this.__kb.callbacks;
    for (event_name in _ref) {
      callbacks = _ref[event_name];
      _ref1 = callbacks.list;
      for (index in _ref1) {
        info = _ref1[index];
        if (info.obj === obj) {
          callbacks.list.splice(index, 1);
          if (info.rel_fn) {
            this._modelUnbindRelatationalInfo(event_name, info);
          }
          if (info.model) {
            info.model(null);
          }
          return;
        }
      }
    }
  };

  ModelWatcher.prototype._onModelLoaded = function(model) {
    var callbacks, event_name, info, is_relational, list, _i, _len, _ref;
    is_relational = Backbone.RelationalModel && (model instanceof Backbone.RelationalModel);
    this.m = model;
    _ref = this.__kb.callbacks;
    for (event_name in _ref) {
      callbacks = _ref[event_name];
      model.bind(event_name, callbacks.fn);
      list = callbacks.list;
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        info = list[_i];
        if (is_relational) {
          this._modelBindRelatationalInfo(event_name, info);
        }
        if (info.model) {
          info.model(model);
        }
      }
    }
  };

  ModelWatcher.prototype._onModelUnloaded = function(model) {
    var callbacks, event_name, info, list, _i, _len, _ref;
    this.m = null;
    _ref = this.__kb.callbacks;
    for (event_name in _ref) {
      callbacks = _ref[event_name];
      model.unbind(event_name, callbacks.fn);
      list = callbacks.list;
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        info = list[_i];
        if (info.rel_fn) {
          this._modelUnbindRelatationalInfo(event_name, info);
        }
        if (info.model) {
          info.model(null);
        }
      }
    }
  };

  ModelWatcher.prototype._modelBindRelatationalInfo = function(event_name, info) {
    var key, relation;
    if ((event_name === 'change') && info.key && info.update) {
      key = ko.utils.unwrapObservable(info.key);
      relation = _.find(this.m.getRelations(), function(test) {
        return test.key === key;
      });
      if (!relation) {
        return;
      }
      info.rel_fn = function(model) {
        !kb.statistics || addStatisticsEvent(model, "" + event_name + " (relational)", info);
        return info.update();
      };
      if (relation.collectionType || _.isArray(relation.keyContents)) {
        info.is_collection = true;
        this.m.bind("add:" + info.key, info.rel_fn);
        this.m.bind("remove:" + info.key, info.rel_fn);
      } else {
        this.m.bind("update:" + info.key, info.rel_fn);
      }
    }
  };

  ModelWatcher.prototype._modelUnbindRelatationalInfo = function(event_name, info) {
    if (!info.rel_fn) {
      return;
    }
    if (info.is_collection) {
      this.m.unbind("add:" + info.key, info.rel_fn);
      this.m.unbind("remove:" + info.key, info.rel_fn);
    } else {
      this.m.unbind("update:" + info.key, info.rel_fn);
    }
    info.rel_fn = null;
  };

  return ModelWatcher;

})();

kb.modelObservable = function(model, observable) {
  return new kb.ModelWatcher(model, observable);
};

/*
  knockback-observable.js
  (c) 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/


kb.Observable = (function() {

  function Observable(model, options, vm) {
    var create_options, model_watcher, observable,
      _this = this;
    this.vm = vm;
    options || throwMissing(this, 'options');
    this.vm || (this.vm = {});
    if (_.isString(options) || ko.isObservable(options)) {
      create_options = this.create_options = {
        key: options
      };
    } else {
      create_options = this.create_options = collapseOptions(options);
    }
    this.key = create_options.key;
    delete create_options.key;
    this.key || throwMissing(this, 'key');
    !create_options.args || (this.args = create_options.args, delete create_options.args);
    !create_options.read || (this.read = create_options.read, delete create_options.read);
    !create_options.write || (this.write = create_options.write, delete create_options.write);
    model_watcher = create_options.model_watcher;
    delete create_options.model_watcher;
    this.vo = ko.observable(null);
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
      read: function() {
        var arg, args, new_value, _i, _len, _ref;
        args = [ko.utils.unwrapObservable(_this.key)];
        if (_this.args) {
          if (_.isArray(_this.args)) {
            _ref = _this.args;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              arg = _ref[_i];
              args.push(ko.utils.unwrapObservable(arg));
            }
          } else {
            args.push(ko.utils.unwrapObservable(_this.args));
          }
        }
        if (_this.m) {
          new_value = _this.read ? _this.read.apply(_this.vm, args) : _this.m.get.apply(_this.m, args);
          _this.update(new_value);
        }
        return ko.utils.unwrapObservable(_this.vo());
      },
      write: function(new_value) {
        var arg, args, set_info, unwrapped_new_value, _i, _len, _ref;
        unwrapped_new_value = _unwrapModels(new_value);
        set_info = {};
        set_info[ko.utils.unwrapObservable(_this.key)] = unwrapped_new_value;
        args = _this.write ? [unwrapped_new_value] : [set_info];
        if (_this.args) {
          if (_.isArray(_this.args)) {
            _ref = _this.args;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              arg = _ref[_i];
              args.push(ko.utils.unwrapObservable(arg));
            }
          } else {
            args.push(ko.utils.unwrapObservable(_this.args));
          }
        }
        if (_this.m) {
          if (_this.write) {
            _this.write.apply(_this.vm, args);
          } else {
            _this.m.set.apply(_this.m, args);
          }
        }
        return _this.update(new_value);
      },
      owner: this.vm
    }));
    observable.__kb_is_o = true;
    create_options.store = kb.utils.wrappedStore(observable, create_options.store);
    create_options.path = kb.utils.pathJoin(create_options.path, this.key);
    if (create_options.factories && ((typeof create_options.factories === 'function') || create_options.factories.create)) {
      create_options.factory = kb.utils.wrappedFactory(observable, new kb.Factory(create_options.factory));
      create_options.factory.addPathMapping(create_options.path, create_options.factories);
    } else {
      create_options.factory = kb.Factory.useOptionsOrCreate(create_options, observable, create_options.path);
    }
    delete create_options.factories;
    observable.value = _.bind(this.value, this);
    observable.valueType = _.bind(this.valueType, this);
    observable.destroy = _.bind(this.destroy, this);
    kb.ModelWatcher.useOptionsOrCreate({
      model_watcher: model_watcher
    }, model, this, {
      model: _.bind(this.model, this),
      update: _.bind(this.update, this),
      key: this.key,
      path: create_options.path
    });
    this.__kb_value || this.update();
    if (kb.LocalizedObservable && create_options.localizer) {
      observable = new create_options.localizer(observable);
      delete create_options.localizer;
    }
    if (kb.DefaultObservable && create_options.hasOwnProperty('default')) {
      observable = kb.defaultObservable(observable, create_options["default"]);
      delete create_options["default"];
    }
    return observable;
  }

  Observable.prototype.destroy = function() {
    this.__kb_destroyed = true;
    kb.release(this.__kb_value);
    this.__kb_value = null;
    this.vm = null;
    this.create_options = null;
    return kb.utils.wrappedDestroy(this);
  };

  Observable.prototype.value = function() {
    return this.__kb_value;
  };

  Observable.prototype.valueType = function() {
    var new_value;
    new_value = this.m ? this.m.get(this.key) : null;
    this.value_type || this._updateValueObservable(new_value);
    return this.value_type;
  };

  Observable.prototype.model = function(new_model) {
    if (this.__kb_destroyed) {
      return;
    }
    if ((arguments.length === 0) || (this.m === new_model)) {
      return this.m;
    }
    this.m = new_model;
    return this.update();
  };

  Observable.prototype.update = function(new_value) {
    var new_type, value;
    if (this.__kb_destroyed) {
      return;
    }
    if (this.m && !arguments.length) {
      new_value = this.m.get(ko.utils.unwrapObservable(this.key));
    }
    (new_value !== void 0) || (new_value = null);
    new_type = kb.utils.valueType(new_value);
    if (!this.__kb_value || (this.__kb_value.__kb_destroyed || (this.__kb_value.__kb_null && new_value))) {
      this.__kb_value = void 0;
      this.value_type = void 0;
    }
    value = this.__kb_value;
    if (_.isUndefined(this.value_type) || (this.value_type !== new_type && new_type !== KB_TYPE_UNKNOWN)) {
      if ((this.value_type === KB_TYPE_COLLECTION) && (new_type === KB_TYPE_ARRAY)) {
        return value(new_value);
      } else {
        return this._updateValueObservable(new_value);
      }
    } else if (this.value_type === KB_TYPE_MODEL) {
      if (typeof value.model === 'function') {
        if (value.model() !== new_value) {
          return value.model(new_value);
        }
      } else if (kb.utils.wrappedObject(value) !== new_value) {
        return this._updateValueObservable(new_value);
      }
    } else if (this.value_type === KB_TYPE_COLLECTION) {
      if (value.collection() !== new_value) {
        return value.collection(new_value);
      }
    } else {
      if (value() !== new_value) {
        return value(new_value);
      }
    }
  };

  Observable.prototype._updateValueObservable = function(new_value) {
    var create_options, creator, previous_value, value;
    create_options = this.create_options;
    create_options.creator = kb.utils.inferCreator(new_value, create_options.factory, create_options.path, this.m, this.key);
    this.value_type = KB_TYPE_UNKNOWN;
    creator = create_options.creator;
    previous_value = this.__kb_value;
    this.__kb_value = void 0;
    if (previous_value) {
      kb.release(previous_value);
    }
    if (creator) {
      if (create_options.store) {
        value = create_options.store.findOrCreate(new_value, create_options);
      } else {
        if (creator.models_only) {
          value = new_value;
          this.value_type = KB_TYPE_SIMPLE;
        } else if (creator.create) {
          value = creator.create(new_value, create_options);
        } else {
          value = new creator(new_value, create_options);
        }
      }
    } else {
      if (_.isArray(new_value)) {
        this.value_type = KB_TYPE_ARRAY;
        value = ko.observableArray(new_value);
      } else {
        this.value_type = KB_TYPE_SIMPLE;
        value = ko.observable(new_value);
      }
    }
    if (this.value_type === KB_TYPE_UNKNOWN) {
      if (!ko.isObservable(value)) {
        this.value_type = KB_TYPE_MODEL;
        if (typeof value.model !== 'function') {
          kb.utils.wrappedObject(value, new_value);
        }
      } else if (value.__kb_is_co) {
        this.value_type = KB_TYPE_COLLECTION;
      } else {
        this.value_type = KB_TYPE_SIMPLE;
      }
    }
    this.__kb_value = value;
    return this.vo(value);
  };

  return Observable;

})();

kb.observable = function(model, options, view_model) {
  return new kb.Observable(model, options, view_model);
};

/*
  knockback-view-model.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/


kb.ViewModel = (function() {

  ViewModel.extend = Backbone.Model.extend;

  function ViewModel(model, options, view_model) {
    var attribute_keys, bb_model, keys, mapped_keys, mapping_info, model_watcher, vm_key, _ref;
    !model || (model instanceof Backbone.Model) || ((typeof model.get === 'function') && (typeof model.bind === 'function')) || throwUnexpected(this, 'not a model');
    options || (options = {});
    view_model || (view_model = {});
    if (_.isArray(options)) {
      options = {
        keys: options
      };
    } else {
      options = collapseOptions(options);
    }
    this.__kb || (this.__kb = {});
    this.__kb.vm_keys = {};
    this.__kb.model_keys = {};
    this.__kb.view_model = _.isUndefined(view_model) ? this : view_model;
    !options.internals || (this.__kb.internals = options.internals);
    !options.excludes || (this.__kb.excludes = options.excludes);
    kb.Store.useOptionsOrCreate(options, model, this);
    this.__kb.path = options.path;
    kb.Factory.useOptionsOrCreate(options, this, options.path);
    model_watcher = kb.utils.wrappedModelWatcher(this, new kb.ModelWatcher(model, this, {
      model: _.bind(this.model, this)
    }));
    if (options.requires && _.isArray(options.requires)) {
      keys = _.clone(options.requires);
    }
    if (this.__kb.internals) {
      keys = keys ? _.union(keys, this.__kb.internals) : _.clone(this.__kb.internals);
    }
    if (options.keys) {
      if (_.isArray(options.keys)) {
        this.__kb.keys = options.keys;
        keys = keys ? _.union(keys, options.keys) : _.clone(options.keys);
      } else {
        mapped_keys = {};
        _ref = options.keys;
        for (vm_key in _ref) {
          mapping_info = _ref[vm_key];
          mapped_keys[_.isString(mapping_info) ? mapping_info : (mapping_info.key ? mapping_info.key : vm_key)] = true;
        }
        this.__kb.keys = _.keys(mapped_keys);
      }
    } else {
      bb_model = model_watcher.model();
      if (bb_model && bb_model.attributes) {
        attribute_keys = _.keys(bb_model.attributes);
        keys = keys ? _.union(keys, attribute_keys) : attribute_keys;
      }
    }
    if (keys && this.__kb.excludes) {
      keys = _.difference(keys, this.__kb.excludes);
    }
    if (_.isObject(options.keys) && !_.isArray(options.keys)) {
      this._mapObservables(model, options.keys);
    }
    if (_.isObject(options.requires) && !_.isArray(options.requires)) {
      this._mapObservables(model, options.requires);
    }
    !options.mappings || this._mapObservables(model, options.mappings);
    !keys || this._createObservables(model, keys);
    !kb.statistics || kb.statistics.register('ViewModel', this);
  }

  ViewModel.prototype.destroy = function() {
    var vm_key;
    if (this.__kb.view_model !== this) {
      for (vm_key in this.__kb.vm_keys) {
        this.__kb.view_model[vm_key] = null;
      }
    }
    this.__kb.view_model = null;
    kb.releaseKeys(this);
    kb.utils.wrappedDestroy(this);
    return !kb.statistics || kb.statistics.unregister('ViewModel', this);
  };

  ViewModel.prototype.shareOptions = function() {
    return {
      store: kb.utils.wrappedStore(this),
      factory: kb.utils.wrappedFactory(this)
    };
  };

  ViewModel.prototype.model = function(new_model) {
    var missing, model, model_watcher;
    model = kb.utils.wrappedObject(this);
    if ((arguments.length === 0) || (model === new_model)) {
      return model;
    }
    if (this.__kb_null) {
      !new_model || throwUnexpected(this, 'model set on shared null');
      return;
    }
    kb.utils.wrappedObject(this, new_model);
    model_watcher = kb.utils.wrappedModelWatcher(this);
    if (!model_watcher) {
      return;
    }
    model_watcher.model(new_model);
    if (this.__kb.keys || !new_model || !new_model.attributes) {
      return;
    }
    missing = _.difference(_.keys(new_model.attributes), _.keys(this.__kb.model_keys));
    if (missing) {
      return this._createObservables(new_model, missing);
    }
  };

  ViewModel.prototype._createObservables = function(model, keys) {
    var create_options, key, vm_key, _i, _len;
    create_options = {
      store: kb.utils.wrappedStore(this),
      factory: kb.utils.wrappedFactory(this),
      path: this.__kb.path,
      model_watcher: kb.utils.wrappedModelWatcher(this)
    };
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      vm_key = this.__kb.internals && _.contains(this.__kb.internals, key) ? "_" + key : key;
      if (this[vm_key]) {
        continue;
      }
      this.__kb.vm_keys[vm_key] = true;
      this.__kb.model_keys[key] = true;
      create_options.key = key;
      this[vm_key] = this.__kb.view_model[vm_key] = kb.observable(model, create_options, this);
    }
  };

  ViewModel.prototype._mapObservables = function(model, mappings) {
    var create_options, mapping_info, vm_key;
    create_options = {
      store: kb.utils.wrappedStore(this),
      factory: kb.utils.wrappedFactory(this),
      path: this.__kb.path,
      model_watcher: kb.utils.wrappedModelWatcher(this)
    };
    for (vm_key in mappings) {
      mapping_info = mappings[vm_key];
      if (this[vm_key]) {
        continue;
      }
      mapping_info = _.isString(mapping_info) ? {
        key: mapping_info
      } : _.clone(mapping_info);
      mapping_info.key || (mapping_info.key = vm_key);
      this.__kb.vm_keys[vm_key] = true;
      this.__kb.model_keys[mapping_info.key] = true;
      this[vm_key] = this.__kb.view_model[vm_key] = kb.observable(model, _.defaults(mapping_info, create_options), this);
    }
  };

  return ViewModel;

})();

kb.viewModel = function(model, options, view_model) {
  return new kb.ViewModel(model, options, view_model);
};

kb.observables = function(model, binding_info, view_model) {
  legacyWarning('kb.observables', '0.16.0', 'Please use kb.viewModel instead');
  return new kb.ViewModel(model, binding_info, view_model);
};

/*
  knockback-collection-observable.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.CollectionObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/


kb.CollectionObservable = (function() {

  CollectionObservable.extend = Backbone.Model.extend;

  function CollectionObservable(collection, options) {
    var create_options, observable,
      _this = this;
    !collection || (collection instanceof Backbone.Collection) || throwUnexpected(this, 'not a collection');
    options || (options = {});
    observable = kb.utils.wrappedObservable(this, ko.observableArray([]));
    observable.__kb_is_co = true;
    this.in_edit = 0;
    this.__kb || (this.__kb = {});
    this.__kb._onCollectionChange = _.bind(this._onCollectionChange, this);
    options = collapseOptions(options);
    if (options.sort_attribute) {
      this.sorted_index_fn = ko.observable(this._sortAttributeFn(options.sort_attribute));
    } else {
      if (options.sorted_index) {
        legacyWarning(this, '0.16.3', 'use sorted_index_fn instead');
        options.sorted_index_fn = options.sorted_index;
      }
      this.sorted_index_fn = ko.observable(options.sorted_index_fn);
    }
    if (options.filters) {
      this.filters = ko.observableArray(_.isArray(options.filters) ? options.filters : options.filters ? [options.filters] : void 0);
    } else {
      this.filters = ko.observableArray([]);
    }
    create_options = this.create_options = {
      store: kb.Store.useOptionsOrCreate(options, collection, observable)
    };
    this.path = options.path;
    create_options.factory = kb.utils.wrappedFactory(observable, this._shareOrCreateFactory(options));
    create_options.path = kb.utils.pathJoin(options.path, 'models');
    create_options.creator = create_options.factory.creatorForPath(null, create_options.path);
    if (create_options.creator) {
      this.models_only = create_options.creator.models_only;
    }
    observable.destroy = _.bind(this.destroy, this);
    observable.shareOptions = _.bind(this.shareOptions, this);
    observable.collection = _.bind(this.collection, this);
    observable.viewModelByModel = _.bind(this.viewModelByModel, this);
    observable.sortedIndex = _.bind(this.sortedIndex, this);
    observable.sortAttribute = _.bind(this.sortAttribute, this);
    observable.hasViewModels = _.bind(this.hasViewModels, this);
    this._col = ko.observable();
    this.collection(collection);
    this._mapper = ko.dependentObservable(function() {
      var filters, model, models, sorted_index_fn, view_model, view_models, _i, _len;
      if (_this.in_edit) {
        return;
      }
      observable = kb.utils.wrappedObservable(_this);
      collection = _this._col();
      if (collection) {
        models = collection.models;
      }
      sorted_index_fn = _this.sorted_index_fn();
      filters = _this.filters();
      if (!models || (collection.models.length === 0)) {
        view_models = [];
      } else {
        if (filters.length) {
          models = _.filter(models, function(model) {
            return !_this._modelIsFiltered(model);
          });
        }
        if (sorted_index_fn) {
          view_models = [];
          for (_i = 0, _len = models.length; _i < _len; _i++) {
            model = models[_i];
            view_model = _this._createViewModel(model);
            view_models.splice(sorted_index_fn(view_models, view_model), 0, view_model);
          }
        } else {
          if (_this.models_only) {
            view_models = filters.length ? models : models.slice();
          } else {
            view_models = _.map(models, function(model) {
              return _this._createViewModel(model);
            });
          }
        }
      }
      _this.in_edit++;
      observable(view_models);
      return _this.in_edit--;
    });
    observable.subscribe(_.bind(this._onObservableArrayChange, this));
    !kb.statistics || kb.statistics.register('CollectionObservable', this);
    return observable;
  }

  CollectionObservable.prototype.destroy = function() {
    var array, collection, observable;
    observable = kb.utils.wrappedObservable(this);
    collection = this._col();
    if (collection) {
      collection.unbind('all', this.__kb._onCollectionChange);
      array = observable();
      array.splice(0, array.length);
    }
    kb.release(this.filters);
    this.filters = this._col = this.sorted_index_fn = this._mapper = this.create_options = null;
    kb.utils.wrappedDestroy(this);
    return !kb.statistics || kb.statistics.unregister('CollectionObservable', this);
  };

  CollectionObservable.prototype.shareOptions = function() {
    var observable;
    observable = kb.utils.wrappedObservable(this);
    return {
      store: kb.utils.wrappedStore(observable),
      factory: kb.utils.wrappedFactory(observable)
    };
  };

  CollectionObservable.prototype.collection = function(collection) {
    var observable, previous_collection;
    observable = kb.utils.wrappedObservable(this);
    previous_collection = this._col();
    if ((arguments.length === 0) || (collection === previous_collection)) {
      observable();
      return previous_collection;
    }
    if (previous_collection) {
      previous_collection.unbind('all', this.__kb._onCollectionChange);
    }
    if (collection) {
      collection.bind('all', this.__kb._onCollectionChange);
    }
    this._col(collection);
    return collection;
  };

  CollectionObservable.prototype.filters = function(filters) {
    if (filters) {
      return this.filters(_.isArray(filters) ? filters : [filters]);
    } else {
      return this.filters([]);
    }
  };

  CollectionObservable.prototype.sortedIndex = function(sorted_index_fn) {
    return this.sorted_index_fn(sorted_index_fn);
  };

  CollectionObservable.prototype.sortAttribute = function(sort_attribute) {
    return this.sorted_index_fn(sort_attribute ? this._sortAttributeFn(sort_attribute) : null);
  };

  CollectionObservable.prototype.viewModelByModel = function(model) {
    var id_attribute;
    if (this.models_only) {
      return null;
    }
    id_attribute = model.hasOwnProperty(model.idAttribute) ? model.idAttribute : 'cid';
    return _.find(kb.utils.wrappedObservable(this)(), function(test) {
      return test.__kb.object[id_attribute] === model[id_attribute];
    });
  };

  CollectionObservable.prototype.hasViewModels = function() {
    return !this.models_only;
  };

  CollectionObservable.prototype._shareOrCreateFactory = function(options) {
    var absolute_models_path, existing_creator, factories, factory;
    absolute_models_path = kb.utils.pathJoin(options.path, 'models');
    factories = options.factories;
    if ((factory = options.factory)) {
      if ((existing_creator = factory.creatorForPath(null, absolute_models_path)) && (!factories || (factories['models'] === existing_creator))) {
        if (!factories) {
          return factory;
        }
        if (factory.hasPathMappings(factories, options.path)) {
          return factory;
        }
      }
    }
    factory = new kb.Factory(options.factory);
    if (factories) {
      factory.addPathMappings(factories, options.path);
    }
    if (!factory.creatorForPath(null, absolute_models_path)) {
      if (options.hasOwnProperty('models_only')) {
        if (options.models_only) {
          factory.addPathMapping(absolute_models_path, {
            models_only: true
          });
        } else {
          factory.addPathMapping(absolute_models_path, kb.ViewModel);
        }
      } else if (options.view_model) {
        factory.addPathMapping(absolute_models_path, options.view_model);
      } else if (options.create) {
        factory.addPathMapping(absolute_models_path, {
          create: options.create
        });
      } else {
        factory.addPathMapping(absolute_models_path, kb.ViewModel);
      }
    }
    return factory;
  };

  CollectionObservable.prototype._onCollectionChange = function(event, arg) {
    var add_index, collection, observable, sorted_index_fn, view_model;
    if (this.in_edit) {
      return;
    }
    switch (event) {
      case 'reset':
      case 'resort':
        if (event === 'resort' && !this.sorted_index_fn()) {
          return;
        }
        return this._col.notifySubscribers(this._col());
      case 'new':
      case 'add':
        if (this._modelIsFiltered(arg)) {
          return;
        }
        observable = kb.utils.wrappedObservable(this);
        collection = this._col();
        view_model = this._createViewModel(arg);
        if ((sorted_index_fn = this.sorted_index_fn())) {
          add_index = sorted_index_fn(observable(), view_model);
        } else {
          add_index = collection.indexOf(arg);
        }
        this.in_edit++;
        observable.splice(add_index, 0, view_model);
        return this.in_edit--;
      case 'remove':
      case 'destroy':
        return this._onModelRemove(arg);
      case 'change':
        if (this._modelIsFiltered(arg)) {
          return this._onModelRemove(arg);
        } else if (this.sorted_index_fn()) {
          return this._onModelResort(arg);
        }
    }
  };

  CollectionObservable.prototype._onModelRemove = function(model) {
    var observable, view_model;
    view_model = this.models_only ? model : this.viewModelByModel(model);
    if (!view_model) {
      return;
    }
    observable = kb.utils.wrappedObservable(this);
    this.in_edit++;
    observable.remove(view_model);
    return this.in_edit--;
  };

  CollectionObservable.prototype._onModelResort = function(model) {
    var new_index, observable, previous_index, sorted_index_fn, sorted_view_models, view_model;
    observable = kb.utils.wrappedObservable(this);
    view_model = this.models_only ? model : this.viewModelByModel(model);
    previous_index = observable.indexOf(view_model);
    if ((sorted_index_fn = this.sorted_index_fn())) {
      sorted_view_models = _.clone(observable());
      sorted_view_models.splice(previous_index, 1);
      new_index = sorted_index_fn(sorted_view_models, view_model);
    } else {
      new_index = this._col().indexOf(model);
    }
    if (previous_index === new_index) {
      return;
    }
    this.in_edit++;
    observable.splice(previous_index, 1);
    observable.splice(new_index, 0, view_model);
    return this.in_edit--;
  };

  CollectionObservable.prototype._onObservableArrayChange = function(values) {
    var collection, has_view_model, models, observable, value, _i, _j, _len, _len1,
      _this = this;
    if (this.in_edit) {
      return;
    }
    observable = kb.utils.wrappedObservable(this);
    collection = this._col();
    if (!collection) {
      return;
    }
    if (!this.models_only) {
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        value = values[_i];
        if (value && !(value instanceof Backbone.Model)) {
          has_view_model = true;
          break;
        }
      }
      if (has_view_model) {
        for (_j = 0, _len1 = values.length; _j < _len1; _j++) {
          value = values[_j];
          this.create_options.store.findOrReplace(kb.utils.wrappedObject(value), this.create_options.creator, value);
        }
      }
    }
    models = _.map(values, function(test) {
      return kb.utils.wrappedModel(test);
    });
    if (this.filters().length) {
      models = _.filter(models, function(model) {
        return !_this._modelIsFiltered(model);
      });
    }
    this.in_edit++;
    collection.reset(models);
    this.in_edit--;
  };

  CollectionObservable.prototype._sortAttributeFn = function(sort_attribute) {
    if (this.models_only) {
      return function(models, model) {
        var attribute_name;
        attribute_name = ko.utils.unwrapObservable(sort_attribute);
        return _.sortedIndex(models, model, function(test) {
          return test.get(attribute_name);
        });
      };
    } else {
      return function(view_models, model) {
        var attribute_name;
        attribute_name = ko.utils.unwrapObservable(sort_attribute);
        return _.sortedIndex(view_models, model, function(test) {
          return kb.utils.wrappedModel(test).get(attribute_name);
        });
      };
    }
  };

  CollectionObservable.prototype._createViewModel = function(model) {
    if (this.models_only) {
      return model;
    } else {
      return this.create_options.store.findOrCreate(model, this.create_options);
    }
  };

  CollectionObservable.prototype._modelIsFiltered = function(model) {
    var filter, filters, _i, _len;
    filters = this.filters();
    for (_i = 0, _len = filters.length; _i < _len; _i++) {
      filter = filters[_i];
      filter = ko.utils.unwrapObservable(filter);
      if (((typeof filter === 'function') && filter(model)) || (model && (model.id === filter))) {
        return true;
      }
    }
    return false;
  };

  return CollectionObservable;

})();

kb.collectionObservable = function(collection, options) {
  return new kb.CollectionObservable(collection, options);
};

kb.sortedIndexWrapAttr = kb.siwa = function(attribute_name, wrapper_constructor) {
  return function(models, model) {
    return _.sortedIndex(models, model, function(test) {
      return new wrapper_constructor(kb.utils.wrappedModel(test).get(attribute_name));
    });
  };
};

/*
  knockback-inject.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Inject is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/


buildEvalWithinScopeFunction = function(expression, scopeLevels) {
  var functionBody, i;
  functionBody = "return ( " + expression + " )";
  i = -1;
  while (++i < scopeLevels) {
    functionBody = "with(sc[" + i + "]) { " + functionBody + " }";
  }
  return new Function("sc", functionBody);
};

ko.bindingHandlers['inject'] = {
  'init': function(element, value_accessor, all_bindings_accessor, view_model) {
    return kb.inject(ko.utils.unwrapObservable(value_accessor()), view_model, element, value_accessor, all_bindings_accessor);
  }
};

kb.inject = function(data, view_model, element, value_accessor, all_bindings_accessor, nested) {
  var inject, result, wrapper;
  inject = function(data) {
    var key, target, value;
    if (_.isFunction(data)) {
      view_model = new data(view_model, element, value_accessor, all_bindings_accessor);
      kb.releaseOnNodeRemove(view_model, element);
    } else {
      if (data.view_model) {
        view_model = new data.view_model(view_model, element, value_accessor, all_bindings_accessor);
        kb.releaseOnNodeRemove(view_model, element);
      }
      for (key in data) {
        value = data[key];
        if (key === 'view_model') {
          continue;
        }
        if (key === 'create') {
          value(view_model, element, value_accessor, all_bindings_accessor);
        } else if (_.isObject(value) && !_.isFunction(value)) {
          target = nested || (value && value.create) ? {} : view_model;
          view_model[key] = kb.inject(value, target, element, value_accessor, all_bindings_accessor, true);
        } else {
          view_model[key] = value;
        }
      }
    }
    return view_model;
  };
  if (nested) {
    return inject(data);
  } else {
    result = (wrapper = ko.dependentObservable(function() {
      return inject(data);
    }))();
    wrapper.dispose();
    return result;
  }
};

kb.injectViewModels = function(root) {
  var afterBinding, app, beforeBinding, data, expression, findElements, options, results, _i, _len;
  results = [];
  findElements = function(el) {
    var attr, child_el, _i, _len, _ref;
    if (!el.__kb_injected) {
      if (el.attributes && (attr = _.find(el.attributes, function(attr) {
        return attr.name === 'kb-inject';
      }))) {
        el.__kb_injected = true;
        results.push({
          el: el,
          view_model: {},
          binding: attr.value
        });
      }
    }
    _ref = el.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child_el = _ref[_i];
      findElements(child_el);
    }
  };
  findElements(root || document);
  for (_i = 0, _len = results.length; _i < _len; _i++) {
    app = results[_i];
    if (expression = app.binding) {
      (expression.search(/[:]/) < 0) || (expression = "{" + expression + "}");
      data = buildEvalWithinScopeFunction(expression, 0)();
      data || (data = {});
      (!data.options) || (options = data.options, delete data.options);
      options || (options = {});
      app.view_model = kb.inject(data, app.view_model, app.el, null, null, true);
      afterBinding = app.view_model.afterBinding || options.afterBinding;
      beforeBinding = app.view_model.beforeBinding || options.beforeBinding;
    }
    if (beforeBinding) {
      beforeBinding(app.view_model, app.el, options);
    }
    kb.applyBindings(app.view_model, app.el, options);
    if (afterBinding) {
      afterBinding(app.view_model, app.el, options);
    }
  }
  return results;
};

if (this.$) {
  this.$(function() {
    return kb.injectViewModels();
  });
} else {
  (onReady = function() {
    if (document.readyState !== "complete") {
      return setTimeout(onReady, 0);
    }
    return kb.injectViewModels();
  })();
}

/*
  knockback_default_observable.js 0.16.6
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.DefaultObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/


kb.DefaultObservable = (function() {

  function DefaultObservable(target_observable, dv) {
    var observable,
      _this = this;
    this.dv = dv;
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
      read: function() {
        var current_target;
        if ((current_target = ko.utils.unwrapObservable(target_observable()))) {
          return current_target;
        } else {
          return ko.utils.unwrapObservable(_this.dv);
        }
      },
      write: function(value) {
        return target_observable(value);
      }
    }));
    observable.destroy = _.bind(this.destroy, this);
    observable.setToDefault = _.bind(this.setToDefault, this);
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

kb.defaultWrapper = function(target, default_value) {
  legacyWarning('ko.defaultWrapper', '0.16.3', 'Please use kb.defaultObservable instead');
  return new kb.DefaultObservable(target, default_value);
};

/*
  knockback-extensions.js (knockback-defaults)
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
*/


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

/*
  knockback-formatted-observable.js 0.16.6
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.FormattedObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/


arraySlice = Array.prototype.slice;

kb.toFormattedString = function(format) {
  var arg, args, index, parameter_index, result, value;
  result = format.slice();
  args = arraySlice.call(arguments, 1);
  for (index in args) {
    arg = args[index];
    value = ko.utils.unwrapObservable(arg);
    value || (value = '');
    parameter_index = format.indexOf("\{" + index + "\}");
    while (parameter_index >= 0) {
      result = result.replace("{" + index + "}", value);
      parameter_index = format.indexOf("\{" + index + "\}", parameter_index + 1);
    }
  }
  return result;
};

kb.parseFormattedString = function(string, format) {
  var count, format_indices_to_matched_indices, index, match_index, matches, parameter_count, parameter_index, positions, regex, regex_string, result, results, sorted_positions;
  regex_string = format.slice();
  index = 0;
  parameter_count = 0;
  positions = {};
  while (regex_string.search("\\{" + index + "\\}") >= 0) {
    parameter_index = format.indexOf("\{" + index + "\}");
    while (parameter_index >= 0) {
      regex_string = regex_string.replace("\{" + index + "\}", '(.*)');
      positions[parameter_index] = index;
      parameter_count++;
      parameter_index = format.indexOf("\{" + index + "\}", parameter_index + 1);
    }
    index++;
  }
  count = index;
  regex = new RegExp(regex_string);
  matches = regex.exec(string);
  if (matches) {
    matches.shift();
  }
  if (!matches || (matches.length !== parameter_count)) {
    result = [];
    while (count-- > 0) {
      result.push('');
    }
    return result;
  }
  sorted_positions = _.sortBy(_.keys(positions), function(parameter_index, format_index) {
    return parseInt(parameter_index, 10);
  });
  format_indices_to_matched_indices = {};
  for (match_index in sorted_positions) {
    parameter_index = sorted_positions[match_index];
    index = positions[parameter_index];
    if (format_indices_to_matched_indices.hasOwnProperty(index)) {
      continue;
    }
    format_indices_to_matched_indices[index] = match_index;
  }
  results = [];
  index = 0;
  while (index < count) {
    results.push(matches[format_indices_to_matched_indices[index]]);
    index++;
  }
  return results;
};

kb.FormattedObservable = (function() {

  function FormattedObservable(format, args) {
    var observable, observable_args;
    if (_.isArray(args)) {
      format = format;
      observable_args = args;
    } else {
      observable_args = arraySlice.call(arguments, 1);
    }
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
      read: function() {
        var arg, _i, _len;
        args = [ko.utils.unwrapObservable(format)];
        for (_i = 0, _len = observable_args.length; _i < _len; _i++) {
          arg = observable_args[_i];
          args.push(ko.utils.unwrapObservable(arg));
        }
        return kb.toFormattedString.apply(null, args);
      },
      write: function(value) {
        var index, matches, max_count;
        matches = kb.parseFormattedString(value, ko.utils.unwrapObservable(format));
        max_count = Math.min(observable_args.length, matches.length);
        index = 0;
        while (index < max_count) {
          observable_args[index](matches[index]);
          index++;
        }
      }
    }));
    return observable;
  }

  FormattedObservable.prototype.destroy = function() {
    return kb.utils.wrappedDestroy(this);
  };

  return FormattedObservable;

})();

kb.formattedObservable = function(format, args) {
  return new kb.FormattedObservable(format, arraySlice.call(arguments, 1));
};

/*
  knockback-localized-observable.js 0.16.6
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.LocalizedObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/


kb.LocalizedObservable = (function() {

  LocalizedObservable.extend = Backbone.Model.extend;

  function LocalizedObservable(value, options, vm) {
    var observable,
      _this = this;
    this.value = value;
    this.vm = vm;
    options || (options = {});
    this.vm || (this.vm = {});
    this.read || throwMissing(this, 'read');
    kb.locale_manager || throwMissing(this, 'kb.locale_manager');
    this.__kb || (this.__kb = {});
    this.__kb._onLocaleChange = _.bind(this._onLocaleChange, this);
    this.__kb._onChange = options.onChange;
    if (this.value) {
      value = ko.utils.unwrapObservable(this.value);
    }
    this.vo = ko.observable(!value ? null : this.read(value, null));
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
      read: function() {
        if (_this.value) {
          ko.utils.unwrapObservable(_this.value);
        }
        _this.vo();
        return _this.read(ko.utils.unwrapObservable(_this.value));
      },
      write: function(value) {
        _this.write || throwUnexpected(_this, 'writing to read-only');
        _this.write(value, ko.utils.unwrapObservable(_this.value));
        _this.vo(value);
        if (_this.__kb._onChange) {
          return _this.__kb._onChange(value);
        }
      },
      owner: this.vm
    }));
    observable.destroy = _.bind(this.destroy, this);
    observable.observedValue = _.bind(this.observedValue, this);
    observable.resetToCurrent = _.bind(this.resetToCurrent, this);
    kb.locale_manager.bind('change', this.__kb._onLocaleChange);
    if (options.hasOwnProperty('default')) {
      observable = kb.DefaultObservable && ko.defaultObservable(observable, options["default"]);
    }
    return observable;
  }

  LocalizedObservable.prototype.destroy = function() {
    kb.locale_manager.unbind('change', this.__kb._onLocaleChange);
    this.vm = null;
    return kb.utils.wrappedDestroy(this);
  };

  LocalizedObservable.prototype.resetToCurrent = function() {
    var current_value, observable;
    observable = kb.utils.wrappedObservable(this);
    current_value = this.value ? this.read(ko.utils.unwrapObservable(this.value)) : null;
    if (observable() === current_value) {
      return;
    }
    return observable(current_value);
  };

  LocalizedObservable.prototype.observedValue = function(value) {
    if (arguments.length === 0) {
      return this.value;
    }
    this.value = value;
    this._onLocaleChange();
  };

  LocalizedObservable.prototype._onLocaleChange = function() {
    var value;
    value = this.read(ko.utils.unwrapObservable(this.value));
    this.vo(value);
    if (this.__kb._onChange) {
      return this.__kb._onChange(value);
    }
  };

  return LocalizedObservable;

})();

kb.localizedObservable = function(value, options, view_model) {
  return new kb.LocalizedObservable(value, options, view_model);
};

/*
  knockback-extensions.js (knockback-localization)
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
*/


kb.locale_manager = void 0;

/*
  knockback-triggered-observable.js 0.16.6
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/


kb.TriggeredObservable = (function() {

  function TriggeredObservable(model, event_name) {
    var observable,
      _this = this;
    this.event_name = event_name;
    model || throwMissing(this, 'model');
    this.event_name || throwMissing(this, 'event_name');
    this.vo = ko.observable();
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable(function() {
      return _this.vo();
    }));
    observable.destroy = _.bind(this.destroy, this);
    kb.utils.wrappedModelWatcher(this, new kb.ModelWatcher(model, this, {
      model: _.bind(this.model, this),
      update: _.bind(this.update, this),
      event_name: this.event_name
    }));
    return observable;
  }

  TriggeredObservable.prototype.destroy = function() {
    return kb.utils.wrappedDestroy(this);
  };

  TriggeredObservable.prototype.model = function(new_model) {
    if ((arguments.length === 0) || (this.m === new_model)) {
      return this.m;
    }
    if ((this.m = new_model)) {
      return this.update();
    }
  };

  TriggeredObservable.prototype.update = function() {
    if (!this.m) {
      return;
    }
    if (this.vo() !== this.m) {
      return this.vo(this.m);
    } else {
      return this.vo.valueHasMutated();
    }
  };

  return TriggeredObservable;

})();

kb.triggeredObservable = function(model, event_name) {
  return new kb.TriggeredObservable(model, event_name);
};

/*
  knockback-validators.js 0.16.6
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/


buildEvalWithinScopeFunction = function(expression, scopeLevels) {
  var functionBody, i;
  functionBody = "return ( " + expression + " )";
  i = -1;
  while (++i < scopeLevels) {
    functionBody = "with(sc[" + i + "]) { " + functionBody + " }";
  }
  return new Function("sc", functionBody);
};

URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

kb.validators = {
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

kb.valueValidator = function(value, checks) {
  _.isArray(checks) || (checks = [checks]);
  return ko.dependentObservable(function() {
    var check, current_value, results, validator, _i, _len;
    results = {
      invalid: false
    };
    current_value = ko.utils.unwrapObservable(value);
    for (_i = 0, _len = checks.length; _i < _len; _i++) {
      check = checks[_i];
      validator = kb.validators[check];
      if (!validator) {
        continue;
      }
      results[check] = validator(current_value);
      results.invalid |= results[check];
    }
    results.valid = !results.invalid;
    return results;
  });
};

kb.inputValidator = function(view_model, el, value_accessor) {
  var $input_el, bindings, checks, input_name, options, result, skip_attach;
  $input_el = $(el);
  if ((input_name = $input_el.attr('name')) && !_.isString(input_name)) {
    input_name = null;
  }
  skip_attach = value_accessor && value_accessor.skip_attach;
  if (!(bindings = $input_el.attr('data-bind'))) {
    return null;
  }
  options = buildEvalWithinScopeFunction("{" + bindings + "}", 1)([view_model]);
  if (!(options && options.value)) {
    return null;
  }
  checks = [];
  switch ($input_el.attr('type')) {
    case 'url':
      checks.push('url');
      break;
    case 'email':
      checks.push('email');
      break;
    case 'number':
      checks.push('number');
  }
  if ($input_el.attr('required')) {
    checks.push('required');
  }
  result = kb.valueValidator(options.value, checks);
  if (input_name && !skip_attach) {
    view_model["$" + input_name] = result;
  }
  return result;
};

kb.formValidator = function(view_model, el) {
  var $root_el, form_name, input_el, name, results, validator, validators, _i, _len, _ref;
  results = {};
  validators = [];
  $root_el = $(el);
  if ((form_name = $root_el.attr('name')) && !_.isString(form_name)) {
    form_name = null;
  }
  _ref = $root_el.find('input');
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    input_el = _ref[_i];
    if (!(name = $(input_el).attr('name'))) {
      continue;
    }
    validator = kb.inputValidator(view_model, input_el, form_name ? {
      skip_attach: true
    } : null);
    !validator || validators.push(results[name] = validator);
  }
  results.valid = ko.dependentObservable(function() {
    var valid, _j, _len1;
    valid = true;
    for (_j = 0, _len1 = validators.length; _j < _len1; _j++) {
      validator = validators[_j];
      valid &= validator().valid;
    }
    return valid;
  });
  results.invalid = ko.dependentObservable(function() {
    return !results.valid();
  });
  if (form_name) {
    view_model["$" + form_name] = results;
  }
  return results;
};
; return kb;});
}).call(this);