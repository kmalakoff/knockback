/*!
 * Lo-Dash v0.3.2 <http://lodash.com>
 * Copyright 2012 John-David Dalton <http://allyoucanleet.com/>
 * Based on Underscore.js 1.3.3, copyright 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
 * <http://documentcloud.github.com/underscore>
 * Available under MIT license <http://lodash.com/license>
 */
(function (window, undefined) {
  "use strict";

  /** Detect free variable `exports` */
  var freeExports =
    typeof exports == "object" &&
    exports &&
    (typeof global == "object" &&
      global &&
      global == global.global &&
      (window = global),
    exports);

  /**
   * Detect the JScript [[DontEnum]] bug:
   * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
   * made non-enumerable as well.
   */
  var hasDontEnumBug = !{ valueOf: 0 }.propertyIsEnumerable("valueOf");

  /** Used to generate unique IDs */
  var idCounter = 0;

  /** Used to restore the original `_` reference in `noConflict` */
  var oldDash = window._;

  /** Used to detect if a method is native */
  var reNative = RegExp(
    "^" +
      ({}.valueOf + "")
        .replace(/[.*+?^=!:${}()|[\]\/\\]/g, "\\$&")
        .replace(/valueOf|for [^\]]+/g, ".+?") +
      "$"
  );

  /** Used to match tokens in template text */
  var reToken = /__token__(\d+)/g;

  /** Used to match unescaped characters in HTML */
  var reUnescapedHtml = /[&<"']/g;

  /** Used to match unescaped characters in compiled string literals */
  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

  /** Used to fix the JScript [[DontEnum]] bug */
  var shadowed = [
    "constructor",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "toLocaleString",
    "toString",
    "valueOf",
  ];

  /** Used to make template sourceURLs easier to identify */
  var templateCounter = 0;

  /** Used to replace template delimiters */
  var token = "__token__";

  /** Used to store tokenized template text snippets */
  var tokenized = [];

  /** Detect if sourceURL syntax is usable without erroring */
  try {
    // Adobe's and Narwhal's JS engines will error
    var useSourceURL = (Function("//@")(), true);
  } catch (e) {}

  /**
   * Used to escape characters for inclusion in HTML.
   * The `>` and `/` characters don't require escaping in HTML and have no
   * special meaning unless they're part of a tag or an unquoted attribute value
   * http://mathiasbynens.be/notes/ambiguous-ampersands (semi-related fun fact)
   */
  var htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    '"': "&quot;",
    "'": "&#x27;",
  };

  /** Used to determine if values are of the language type Object */
  var valueTypes = {
    boolean: false,
    function: true,
    object: true,
    number: false,
    string: false,
    undefined: false,
  };

  /** Used to escape characters for inclusion in compiled string literals */
  var stringEscapes = {
    "\\": "\\",
    "'": "'",
    "\n": "n",
    "\r": "r",
    "\t": "t",
    "\u2028": "u2028",
    "\u2029": "u2029",
  };

  /** Object#toString result shortcuts */
  var arrayClass = "[object Array]",
    boolClass = "[object Boolean]",
    dateClass = "[object Date]",
    funcClass = "[object Function]",
    numberClass = "[object Number]",
    regexpClass = "[object RegExp]",
    stringClass = "[object String]";

  /** Native prototype shortcuts */
  var ArrayProto = Array.prototype,
    ObjectProto = Object.prototype;

  /** Native method shortcuts */
  var concat = ArrayProto.concat,
    hasOwnProperty = ObjectProto.hasOwnProperty,
    push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjectProto.toString;

  /* Used if `Function#bind` exists and is inferred to be fast (i.e. all but V8) */
  var nativeBind =
    reNative.test((nativeBind = slice.bind)) &&
    /\n|Opera/.test(nativeBind + toString.call(window.opera)) &&
    nativeBind;

  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeIsArray =
      reNative.test((nativeIsArray = Array.isArray)) && nativeIsArray,
    nativeIsFinite = window.isFinite,
    nativeKeys = reNative.test((nativeKeys = Object.keys)) && nativeKeys;

  /** Timer shortcuts */
  var clearTimeout = window.clearTimeout,
    setTimeout = window.setTimeout;

  /*--------------------------------------------------------------------------*/

  /**
   * The `lodash` function.
   *
   * @name _
   * @constructor
   * @param {Mixed} value The value to wrap in a `LoDash` instance.
   * @returns {Object} Returns a `LoDash` instance.
   */
  function lodash(value) {
    // allow invoking `lodash` without the `new` operator
    return new LoDash(value);
  }

  /**
   * Creates a `LoDash` instance that wraps a value to allow chaining.
   *
   * @private
   * @constructor
   * @param {Mixed} value The value to wrap.
   */
  function LoDash(value) {
    // exit early if already wrapped
    if (value && value._wrapped) {
      return value;
    }
    this._wrapped = value;
  }

  /**
   * By default, Lo-Dash uses ERB-style template delimiters, change the
   * following template settings to use alternative delimiters.
   *
   * @static
   * @memberOf _
   * @type Object
   */
  lodash.templateSettings = {
    /**
     * Used to detect `data` property values to be HTML-escaped.
     *
     * @static
     * @memberOf _.templateSettings
     * @type RegExp
     */
    escape: /<%-([\s\S]+?)%>/g,

    /**
     * Used to detect code to be evaluated.
     *
     * @static
     * @memberOf _.templateSettings
     * @type RegExp
     */
    evaluate: /<%([\s\S]+?)%>/g,

    /**
     * Used to detect `data` property values to inject.
     *
     * @static
     * @memberOf _.templateSettings
     * @type RegExp
     */
    interpolate: /<%=([\s\S]+?)%>/g,

    /**
     * Used to reference the data object in the template text.
     *
     * @static
     * @memberOf _.templateSettings
     * @type String
     */
    variable: "obj",
  };

  /*--------------------------------------------------------------------------*/

  /**
   * The template used to create iterator functions.
   *
   * @private
   * @param {Obect} data The data object used to populate the text.
   * @returns {String} Returns the interpolated text.
   */
  var iteratorTemplate = template(
    // assign the `result` variable an initial value
    "var index, result<% if (init) { %> = <%= init %><% } %>;\n" +
      // add code to exit early or do so if the first argument is falsey
      "<%= exit %>;\n" +
      // add code after the exit snippet but before the iteration branches
      "<%= top %>;\n" +
      // the following branch is for iterating arrays and array-like objects
      "<% if (arrayBranch) { %>" +
      "var length = <%= firstArg %>.length; index = -1;" +
      "  <% if (objectBranch) { %>\nif (length === length >>> 0) {<% } %>\n" +
      "  <%= arrayBranch.beforeLoop %>;\n" +
      "  while (<%= arrayBranch.loopExp %>) {\n" +
      "    <%= arrayBranch.inLoop %>;\n" +
      "  }" +
      "  <% if (objectBranch) { %>\n}\n<% }" +
      "}" +
      // the following branch is for iterating an object's own/inherited properties
      "if (objectBranch) {" +
      "  if (arrayBranch) { %>else {\n<% }" +
      "  if (!hasDontEnumBug) { %>  var skipProto = typeof <%= iteratedObject %> == 'function';\n<% } %>" +
      "  <%= objectBranch.beforeLoop %>;\n" +
      "  for (<%= objectBranch.loopExp %>) {" +
      "  \n<%" +
      "  if (hasDontEnumBug) {" +
      "    if (useHas) { %>    if (<%= hasExp %>) {\n  <% } %>" +
      "    <%= objectBranch.inLoop %>;<%" +
      "    if (useHas) { %>\n    }<% }" +
      "  }" +
      "  else {" +
      "  %>" +
      // Firefox < 3.6, Opera > 9.50 - Opera < 11.60, and Safari < 5.1
      // (if the prototype or a property on the prototype has been set)
      // incorrectly sets a function's `prototype` property [[Enumerable]]
      // value to `true`. Because of this Lo-Dash standardizes on skipping
      // the the `prototype` property of functions regardless of its
      // [[Enumerable]] value.
      "    if (!(skipProto && index == 'prototype')<% if (useHas) { %> && <%= hasExp %><% } %>) {\n" +
      "      <%= objectBranch.inLoop %>;\n" +
      "    }" +
      "  <% } %>\n" +
      "  }" +
      // Because IE < 9 can't set the `[[Enumerable]]` attribute of an
      // existing property and the `constructor` property of a prototype
      // defaults to non-enumerable, Lo-Dash skips the `constructor`
      // property when it infers it's iterating over a `prototype` object.
      "  <% if (hasDontEnumBug) { %>\n" +
      "  var ctor = <%= iteratedObject %>.constructor;\n" +
      "  <% for (var k = 0; k < 7; k++) { %>\n" +
      "  index = '<%= shadowed[k] %>';\n" +
      "  if (<%" +
      "      if (shadowed[k] == 'constructor') {" +
      "        %>!(ctor && ctor.prototype === <%= iteratedObject %>) && <%" +
      "      } %><%= hasExp %>) {\n" +
      "    <%= objectBranch.inLoop %>;\n" +
      "  }<%" +
      "     }" +
      "   }" +
      "   if (arrayBranch) { %>\n}<% }" +
      "} %>\n" +
      // add code to the bottom of the iteration function
      "<%= bottom %>;\n" +
      // finally, return the `result`
      "return result"
  );

  /**
   * Reusable iterator options shared by
   * `every`, `filter`, `find`, `forEach`, `forIn`, `forOwn`, `map`, `reject`, and `some`.
   */
  var baseIteratorOptions = {
    args: "collection, callback, thisArg",
    init: "collection",
    top:
      "if (!callback) {\n" +
      "  callback = identity\n" +
      "}\n" +
      "else if (thisArg) {\n" +
      "  callback = iteratorBind(callback, thisArg)\n" +
      "}",
    inLoop: "callback(collection[index], index, collection)",
  };

  /** Reusable iterator options for `every` and `some` */
  var everyIteratorOptions = {
    init: "true",
    inLoop:
      "if (!callback(collection[index], index, collection)) return !result",
  };

  /** Reusable iterator options for `defaults` and `extend` */
  var extendIteratorOptions = {
    args: "object",
    init: "object",
    top:
      "for (var source, sourceIndex = 1, length = arguments.length; sourceIndex < length; sourceIndex++) {\n" +
      "  source = arguments[sourceIndex];\n" +
      (hasDontEnumBug ? "  if (source) {" : ""),
    loopExp: "index in source",
    useHas: false,
    inLoop: "object[index] = source[index]",
    bottom: (hasDontEnumBug ? "  }\n" : "") + "}",
  };

  /** Reusable iterator options for `filter` and `reject` */
  var filterIteratorOptions = {
    init: "[]",
    inLoop:
      "callback(collection[index], index, collection) && result.push(collection[index])",
  };

  /** Reusable iterator options for `find`, `forEach`, `forIn`, and `forOwn` */
  var forEachIteratorOptions = {
    top: "if (thisArg) callback = iteratorBind(callback, thisArg)",
  };

  /** Reusable iterator options for `forIn` and `forOwn` */
  var forOwnIteratorOptions = {
    inLoop: {
      object: baseIteratorOptions.inLoop,
    },
  };

  /** Reusable iterator options for `invoke`, `map`, and `pluck` */
  var mapIteratorOptions = {
    init: "",
    exit: "if (!collection) return []",
    beforeLoop: {
      array: "result = Array(length)",
      object: "result = []",
    },
    inLoop: {
      array: "result[index] = callback(collection[index], index, collection)",
      object: "result.push(callback(collection[index], index, collection))",
    },
  };

  /*--------------------------------------------------------------------------*/

  /**
   * Creates compiled iteration functions. The iteration function will be created
   * to iterate over only objects if the first argument of `options.args` is
   * "object" or `options.inLoop.array` is falsey.
   *
   * @private
   * @param {Object} [options1, options2, ...] The compile options objects.
   *
   *  args - A string of comma separated arguments the iteration function will
   *   accept.
   *
   *  init - A string to specify the initial value of the `result` variable.
   *
   *  exit - A string of code to use in place of the default exit-early check
   *   of `if (!arguments[0]) return result`.
   *
   *  top - A string of code to execute after the exit-early check but before
   *   the iteration branches.
   *
   *  beforeLoop - A string or object containing an "array" or "object" property
   *   of code to execute before the array or object loops.
   *
   *  loopExp - A string or object containing an "array" or "object" property
   *   of code to execute as the array or object loop expression.
   *
   *  useHas - A boolean to specify whether or not to use `hasOwnProperty` checks
   *   in the object loop.
   *
   *  inLoop - A string or object containing an "array" or "object" property
   *   of code to execute in the array or object loops.
   *
   *  bottom - A string of code to execute after the iteration branches but
   *   before the `result` is returned.
   *
   * @returns {Function} Returns the compiled function.
   */
  function createIterator() {
    var object,
      prop,
      value,
      index = -1,
      length = arguments.length;

    // merge options into a template data object
    var data = {
      bottom: "",
      exit: "",
      init: "",
      top: "",
      arrayBranch: { beforeLoop: "", loopExp: "++index < length" },
      objectBranch: { beforeLoop: "" },
    };

    while (++index < length) {
      object = arguments[index];
      for (prop in object) {
        value = (value = object[prop]) == null ? "" : value;
        // keep this regexp explicit for the build pre-process
        if (/beforeLoop|loopExp|inLoop/.test(prop)) {
          if (typeof value == "string") {
            value = { array: value, object: value };
          }
          data.arrayBranch[prop] = value.array;
          data.objectBranch[prop] = value.object;
        } else {
          data[prop] = value;
        }
      }
    }
    // set additional template data values
    var args = data.args,
      arrayBranch = data.arrayBranch,
      objectBranch = data.objectBranch,
      firstArg = /^[^,]+/.exec(args)[0],
      loopExp = objectBranch.loopExp,
      iteratedObject = /\S+$/.exec(loopExp || firstArg)[0];

    data.firstArg = firstArg;
    data.hasDontEnumBug = hasDontEnumBug;
    data.hasExp = "hasOwnProperty.call(" + iteratedObject + ", index)";
    data.iteratedObject = iteratedObject;
    data.shadowed = shadowed;
    data.useHas = data.useHas !== false;

    if (!data.exit) {
      data.exit = "if (!" + firstArg + ") return result";
    }
    if (firstArg == "object" || !arrayBranch.inLoop) {
      data.arrayBranch = null;
    }
    if (!loopExp) {
      objectBranch.loopExp = "index in " + iteratedObject;
    }
    // create the function factory
    var factory = Function(
      "arrayClass, funcClass, hasOwnProperty, identity, iteratorBind, valueTypes, " +
        "slice, stringClass, toString, undefined",
      '"use strict"; return function(' +
        args +
        ") {\n" +
        iteratorTemplate(data) +
        "\n}"
    );
    // return the compiled function
    return factory(
      arrayClass,
      funcClass,
      hasOwnProperty,
      identity,
      iteratorBind,
      valueTypes,
      slice,
      stringClass,
      toString
    );
  }

  /**
   * Used by `template()` to replace tokens with their corresponding code snippets.
   *
   * @private
   * @param {String} match The matched token.
   * @param {String} index The `tokenized` index of the code snippet.
   * @returns {String} Returns the code snippet.
   */
  function detokenize(match, index) {
    return tokenized[index];
  }

  /**
   * Used by `template()` to escape characters for inclusion in compiled
   * string literals.
   *
   * @private
   * @param {String} match The matched character to escape.
   * @returns {String} Returns the escaped character.
   */
  function escapeStringChar(match) {
    return "\\" + stringEscapes[match];
  }

  /**
   * Used by `escape()` to escape characters for inclusion in HTML.
   *
   * @private
   * @param {String} match The matched character to escape.
   * @returns {String} Returns the escaped character.
   */
  function escapeHtmlChar(match) {
    return htmlEscapes[match];
  }

  /**
   * Creates a new function that, when called, invokes `func` with the `this`
   * binding of `thisArg` and the arguments (value, index, object).
   *
   * @private
   * @param {Function} func The function to bind.
   * @param {Mixed} [thisArg] The `this` binding of `func`.
   * @returns {Function} Returns the new bound function.
   */
  function iteratorBind(func, thisArg) {
    return function (value, index, object) {
      return func.call(thisArg, value, index, object);
    };
  }

  /**
   * A no-operation function.
   *
   * @private
   */
  function noop() {
    // no operation performed
  }

  /**
   * A shim implementation of `Object.keys` that produces an array of the given
   * object's own enumerable property names.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns a new array of property names.
   */
  var shimKeys = createIterator({
    args: "object",
    exit: "if (!valueTypes[typeof object] || object === null) throw TypeError()",
    init: "[]",
    inLoop: "result.push(index)",
  });

  /**
   * Used by `template()` to replace "escape" template delimiters with tokens.
   *
   * @private
   * @param {String} match The matched template delimiter.
   * @param {String} value The delimiter value.
   * @returns {String} Returns a token.
   */
  function tokenizeEscape(match, value) {
    var index = tokenized.length;
    tokenized[index] = "'+\n_.escape(" + value + ") +\n'";
    return token + index;
  }

  /**
   * Used by `template()` to replace "interpolate" template delimiters with tokens.
   *
   * @private
   * @param {String} match The matched template delimiter.
   * @param {String} value The delimiter value.
   * @returns {String} Returns a token.
   */
  function tokenizeInterpolate(match, value) {
    var index = tokenized.length;
    tokenized[index] = "'+\n((__t = (" + value + ")) == null ? '' : __t) +\n'";
    return token + index;
  }

  /**
   * Used by `template()` to replace "evaluate" template delimiters with tokens.
   *
   * @private
   * @param {String} match The matched template delimiter.
   * @param {String} value The delimiter value.
   * @returns {String} Returns a token.
   */
  function tokenizeEvaluate(match, value) {
    var index = tokenized.length;
    tokenized[index] = "';\n" + value + ";\n__p += '";
    return token + index;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Checks if a given `target` value is present in a `collection` using strict
   * equality for comparisons, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @alias include
   * @category Collections
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Mixed} target The value to check for.
   * @returns {Boolean} Returns `true` if `target` value is found, else `false`.
   * @example
   *
   * _.contains([1, 2, 3], 3);
   * // => true
   */
  var contains = createIterator({
    args: "collection, target",
    init: "false",
    inLoop: "if (collection[index] === target) return true",
  });

  /**
   * Checks if the `callback` returns a truthy value for **all** elements of a
   * `collection`. The `callback` is bound to `thisArg` and invoked with 3
   * arguments; for arrays they are (value, index, array) and for objects they
   * are (value, key, object).
   *
   * @static
   * @memberOf _
   * @alias all
   * @category Collections
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Boolean} Returns `true` if all values pass the callback check, else `false`.
   * @example
   *
   * _.every([true, 1, null, 'yes'], Boolean);
   * // => false
   */
  var every = createIterator(baseIteratorOptions, everyIteratorOptions);

  /**
   * Examines each value in a `collection`, returning an array of all values the
   * `callback` returns truthy for. The `callback` is bound to `thisArg` and
   * invoked with 3 arguments; for arrays they are (value, index, array) and for
   * objects they are (value, key, object).
   *
   * @static
   * @memberOf _
   * @alias select
   * @category Collections
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Array} Returns a new array of values that passed callback check.
   * @example
   *
   * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
   * // => [2, 4, 6]
   */
  var filter = createIterator(baseIteratorOptions, filterIteratorOptions);

  /**
   * Examines each value in a `collection`, returning the first one the `callback`
   * returns truthy for. The function returns as soon as it finds an acceptable
   * value, and does not iterate over the entire `collection`. The `callback` is
   * bound to `thisArg` and invoked with 3 arguments; for arrays they are
   * (value, index, array) and for objects they are (value, key, object).
   *
   * @static
   * @memberOf _
   * @alias detect
   * @category Collections
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} callback The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Mixed} Returns the value that passed the callback check, else `undefined`.
   * @example
   *
   * var even = _.find([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
   * // => 2
   */
  var find = createIterator(baseIteratorOptions, forEachIteratorOptions, {
    init: "",
    inLoop:
      "if (callback(collection[index], index, collection)) return collection[index]",
  });

  /**
   * Iterates over a `collection`, executing the `callback` for each value in the
   * `collection`. The `callback` is bound to `thisArg` and invoked with 3
   * arguments; for arrays they are (value, index, array) and for objects they
   * are (value, key, object).
   *
   * @static
   * @memberOf _
   * @alias each
   * @category Collections
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} callback The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Array|Object} Returns the `collection`.
   * @example
   *
   * _([1, 2, 3]).forEach(alert).join(',');
   * // => alerts each number and returns '1,2,3'
   *
   * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, alert);
   * // => alerts each number (order is not guaranteed)
   */
  var forEach = createIterator(baseIteratorOptions, forEachIteratorOptions);

  /**
   * Invokes the method named by `methodName` on each element in the `collection`.
   * Additional arguments will be passed to each invoked method. If `methodName`
   * is a function it will be invoked for, and `this` bound to, each element
   * in the `collection`.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function|String} methodName The name of the method to invoke or
   *  the function invoked per iteration.
   * @param {Mixed} [arg1, arg2, ...] Arguments to invoke the method with.
   * @returns {Array} Returns a new array of values returned from each invoked method.
   * @example
   *
   * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
   * // => [[1, 5, 7], [1, 2, 3]]
   *
   * _.invoke([123, 456], String.prototype.split, '');
   * // => [['1', '2', '3'], ['4', '5', '6']]
   */
  var invoke = createIterator(mapIteratorOptions, {
    args: "collection, methodName",
    top:
      "var args = slice.call(arguments, 2),\n" +
      "    isFunc = typeof methodName == 'function'",
    inLoop: {
      array:
        "result[index] = (isFunc ? methodName : collection[index][methodName]).apply(collection[index], args)",
      object:
        "result.push((isFunc ? methodName : collection[index][methodName]).apply(collection[index], args))",
    },
  });

  /**
   * Produces a new array of values by mapping each element in the `collection`
   * through a transformation `callback`. The `callback` is bound to `thisArg`
   * and invoked with 3 arguments; for arrays they are (value, index, array)
   * and for objects they are (value, key, object).
   *
   * @static
   * @memberOf _
   * @alias collect
   * @category Collections
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Array} Returns a new array of values returned by the callback.
   * @example
   *
   * _.map([1, 2, 3], function(num) { return num * 3; });
   * // => [3, 6, 9]
   *
   * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
   * // => [3, 6, 9] (order is not guaranteed)
   */
  var map = createIterator(baseIteratorOptions, mapIteratorOptions);

  /**
   * Retrieves the value of a specified property from all elements in
   * the `collection`.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object} collection The collection to iterate over.
   * @param {String} property The property to pluck.
   * @returns {Array} Returns a new array of property values.
   * @example
   *
   * var stooges = [
   *   { 'name': 'moe', 'age': 40 },
   *   { 'name': 'larry', 'age': 50 },
   *   { 'name': 'curly', 'age': 60 }
   * ];
   *
   * _.pluck(stooges, 'name');
   * // => ['moe', 'larry', 'curly']
   */
  var pluck = createIterator(mapIteratorOptions, {
    args: "collection, property",
    inLoop: {
      array: "result[index] = collection[index][property]",
      object: "result.push(collection[index][property])",
    },
  });

  /**
   * Boils down a `collection` to a single value. The initial state of the
   * reduction is `accumulator` and each successive step of it should be returned
   * by the `callback`. The `callback` is bound to `thisArg` and invoked with 4
   * arguments; for arrays they are (accumulator, value, index, array) and for
   * objects they are (accumulator, value, key, object).
   *
   * @static
   * @memberOf _
   * @alias foldl, inject
   * @category Collections
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} callback The function called per iteration.
   * @param {Mixed} [accumulator] Initial value of the accumulator.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Mixed} Returns the accumulated value.
   * @example
   *
   * var sum = _.reduce([1, 2, 3], function(memo, num) { return memo + num; });
   * // => 6
   */
  var reduce = createIterator({
    args: "collection, callback, accumulator, thisArg",
    init: "accumulator",
    top:
      "var noaccum = arguments.length < 3;\n" +
      "if (thisArg) callback = iteratorBind(callback, thisArg)",
    beforeLoop: {
      array: "if (noaccum) result = collection[++index]",
    },
    inLoop: {
      array: "result = callback(result, collection[index], index, collection)",
      object:
        "result = noaccum\n" +
        "  ? (noaccum = false, collection[index])\n" +
        "  : callback(result, collection[index], index, collection)",
    },
  });

  /**
   * The right-associative version of `_.reduce`.
   *
   * @static
   * @memberOf _
   * @alias foldr
   * @category Collections
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} callback The function called per iteration.
   * @param {Mixed} [accumulator] Initial value of the accumulator.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Mixed} Returns the accumulated value.
   * @example
   *
   * var list = [[0, 1], [2, 3], [4, 5]];
   * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
   * // => [4, 5, 2, 3, 0, 1]
   */
  function reduceRight(collection, callback, accumulator, thisArg) {
    if (!collection) {
      return accumulator;
    }

    var length = collection.length,
      noaccum = arguments.length < 3;

    if (thisArg) {
      callback = iteratorBind(callback, thisArg);
    }
    if (length === length >>> 0) {
      if (length && noaccum) {
        accumulator = collection[--length];
      }
      while (length--) {
        accumulator = callback(
          accumulator,
          collection[length],
          length,
          collection
        );
      }
      return accumulator;
    }

    var prop,
      props = keys(collection);

    length = props.length;
    if (length && noaccum) {
      accumulator = collection[props[--length]];
    }
    while (length--) {
      prop = props[length];
      accumulator = callback(accumulator, collection[prop], prop, collection);
    }
    return accumulator;
  }

  /**
   * The opposite of `_.filter`, this method returns the values of a `collection`
   * that `callback` does **not** return truthy for.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Array} Returns a new array of values that did **not** pass the callback check.
   * @example
   *
   * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
   * // => [1, 3, 5]
   */
  var reject = createIterator(baseIteratorOptions, filterIteratorOptions, {
    inLoop: "!" + filterIteratorOptions.inLoop,
  });

  /**
   * Checks if the `callback` returns a truthy value for **any** element of a
   * `collection`. The function returns as soon as it finds passing value, and
   * does not iterate over the entire `collection`. The `callback` is bound to
   * `thisArg` and invoked with 3 arguments; for arrays they are
   * (value, index, array) and for objects they are (value, key, object).
   *
   * @static
   * @memberOf _
   * @alias any
   * @category Collections
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Boolean} Returns `true` if any value passes the callback check, else `false`.
   * @example
   *
   * _.some([null, 0, 'yes', false]);
   * // => true
   */
  var some = createIterator(baseIteratorOptions, everyIteratorOptions, {
    init: "false",
    inLoop: everyIteratorOptions.inLoop.replace("!", ""),
  });

  /**
   * Converts the `collection`, into an array. Useful for converting the
   * `arguments` object.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object} collection The collection to convert.
   * @returns {Array} Returns the new converted array.
   * @example
   *
   * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
   * // => [2, 3, 4]
   */
  function toArray(collection) {
    if (!collection) {
      return [];
    }
    if (toString.call(collection.toArray) == funcClass) {
      return collection.toArray();
    }
    var length = collection.length;
    if (length === length >>> 0) {
      return slice.call(collection);
    }
    return values(collection);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Produces a new array with all falsey values of `array` removed. The values
   * `false`, `null`, `0`, `""`, `undefined` and `NaN` are all falsey.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to compact.
   * @returns {Array} Returns a new filtered array.
   * @example
   *
   * _.compact([0, 1, false, 2, '', 3]);
   * // => [1, 2, 3]
   */
  function compact(array) {
    var result = [];
    if (!array) {
      return result;
    }
    var index = -1,
      length = array.length;

    while (++index < length) {
      if (array[index]) {
        result.push(array[index]);
      }
    }
    return result;
  }

  /**
   * Produces a new array of `array` values not present in the other arrays
   * using strict equality for comparisons, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to process.
   * @param {Array} [array1, array2, ...] Arrays to check.
   * @returns {Array} Returns a new array of `array` values not present in the
   *  other arrays.
   * @example
   *
   * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
   * // => [1, 3, 4]
   */
  function difference(array) {
    var result = [];
    if (!array) {
      return result;
    }
    var index = -1,
      length = array.length,
      flattened = concat.apply(result, slice.call(arguments, 1));

    while (++index < length) {
      if (indexOf(flattened, array[index]) < 0) {
        result.push(array[index]);
      }
    }
    return result;
  }

  /**
   * Gets the first value of the `array`. Pass `n` to return the first `n` values
   * of the `array`.
   *
   * @static
   * @memberOf _
   * @alias head, take
   * @category Arrays
   * @param {Array} array The array to query.
   * @param {Number} [n] The number of elements to return.
   * @param {Object} [guard] Internally used to allow this method to work with
   *  others like `_.map` without using their callback `index` argument for `n`.
   * @returns {Mixed} Returns the first value or an array of the first `n` values
   *  of `array`.
   * @example
   *
   * _.first([5, 4, 3, 2, 1]);
   * // => 5
   */
  function first(array, n, guard) {
    if (array) {
      return n == undefined || guard ? array[0] : slice.call(array, 0, n);
    }
  }

  /**
   * Flattens a nested array (the nesting can be to any depth). If `shallow` is
   * truthy, `array` will only be flattened a single level.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to compact.
   * @param {Boolean} shallow A flag to indicate only flattening a single level.
   * @returns {Array} Returns a new flattened array.
   * @example
   *
   * _.flatten([1, [2], [3, [[4]]]]);
   * // => [1, 2, 3, 4];
   *
   * _.flatten([1, [2], [3, [[4]]]], true);
   * // => [1, 2, 3, [[4]]];
   */
  function flatten(array, shallow) {
    var result = [];
    if (!array) {
      return result;
    }
    var value,
      index = -1,
      length = array.length;

    while (++index < length) {
      value = array[index];
      if (isArray(value)) {
        push.apply(result, shallow ? value : flatten(value));
      } else {
        result.push(value);
      }
    }
    return result;
  }

  /**
   * Splits `array` into sets, grouped by the result of running each value
   * through `callback`. The `callback` is bound to `thisArg` and invoked with 3
   * arguments; (value, index, array). The `callback` argument may also be the
   * name of a property to group by.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to iterate over.
   * @param {Function|String} callback The function called per iteration or
   *  property name to group by.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Object} Returns an object of grouped values.
   * @example
   *
   * _.groupBy([1.3, 2.1, 2.4], function(num) { return Math.floor(num); });
   * // => { '1': [1.3], '2': [2.1, 2.4] }
   *
   * _.groupBy([1.3, 2.1, 2.4], function(num) { return this.floor(num); }, Math);
   * // => { '1': [1.3], '2': [2.1, 2.4] }
   *
   * _.groupBy(['one', 'two', 'three'], 'length');
   * // => { '3': ['one', 'two'], '5': ['three'] }
   */
  function groupBy(array, callback, thisArg) {
    var result = {};
    if (!array) {
      return result;
    }
    var prop,
      value,
      index = -1,
      isFunc = typeof callback == "function",
      length = array.length;

    if (isFunc && thisArg) {
      callback = iteratorBind(callback, thisArg);
    }
    while (++index < length) {
      value = array[index];
      prop = isFunc ? callback(value, index, array) : value[callback];
      (hasOwnProperty.call(result, prop)
        ? result[prop]
        : (result[prop] = [])
      ).push(value);
    }
    return result;
  }

  /**
   * Gets the index at which the first occurrence of `value` is found using
   * strict equality for comparisons, i.e. `===`. If the `array` is already
   * sorted, passing `true` for `isSorted` will run a faster binary search.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to search.
   * @param {Mixed} value The value to search for.
   * @param {Boolean|Number} [fromIndex=0] The index to start searching from or
   *  `true` to perform a binary search on a sorted `array`.
   * @returns {Number} Returns the index of the matched value or `-1`.
   * @example
   *
   * _.indexOf([1, 2, 3, 1, 2, 3], 2);
   * // => 1
   *
   * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
   * // => 4
   *
   * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
   * // => 2
   */
  function indexOf(array, value, fromIndex) {
    if (!array) {
      return -1;
    }
    var index = -1,
      length = array.length;

    if (fromIndex) {
      if (typeof fromIndex == "number") {
        index =
          (fromIndex < 0 ? Math.max(0, length + fromIndex) : fromIndex) - 1;
      } else {
        index = sortedIndex(array, value);
        return array[index] === value ? index : -1;
      }
    }
    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Gets all but the last value of `array`. Pass `n` to exclude the last `n`
   * values from the result.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to query.
   * @param {Number} [n] The number of elements to return.
   * @param {Object} [guard] Internally used to allow this method to work with
   *  others like `_.map` without using their callback `index` argument for `n`.
   * @returns {Array} Returns all but the last value or `n` values of `array`.
   * @example
   *
   * _.initial([3, 2, 1]);
   * // => [3, 2]
   */
  function initial(array, n, guard) {
    if (!array) {
      return [];
    }
    return slice.call(array, 0, -(n == undefined || guard ? 1 : n));
  }

  /**
   * Computes the intersection of all the passed-in arrays.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} [array1, array2, ...] Arrays to process.
   * @returns {Array} Returns a new array of unique values, in order, that are
   *  present in **all** of the arrays.
   * @example
   *
   * _.intersection([1, 2, 3], [101, 2, 1, 10], [2, 1]);
   * // => [1, 2]
   */
  function intersection(array) {
    var result = [];
    if (!array) {
      return result;
    }
    var value,
      index = -1,
      length = array.length,
      others = slice.call(arguments, 1);

    while (++index < length) {
      value = array[index];
      if (
        indexOf(result, value) < 0 &&
        every(others, function (other) {
          return indexOf(other, value) > -1;
        })
      ) {
        result.push(value);
      }
    }
    return result;
  }

  /**
   * Gets the last value of the `array`. Pass `n` to return the lasy `n` values
   * of the `array`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to query.
   * @param {Number} [n] The number of elements to return.
   * @param {Object} [guard] Internally used to allow this method to work with
   *  others like `_.map` without using their callback `index` argument for `n`.
   * @returns {Mixed} Returns the last value or an array of the last `n` values
   *  of `array`.
   * @example
   *
   * _.last([3, 2, 1]);
   * // => 1
   */
  function last(array, n, guard) {
    if (array) {
      var length = array.length;
      return n == undefined || guard
        ? array[length - 1]
        : slice.call(array, -n || length);
    }
  }

  /**
   * Gets the index at which the last occurrence of `value` is found using
   * strict equality for comparisons, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to search.
   * @param {Mixed} value The value to search for.
   * @param {Number} [fromIndex=array.length-1] The index to start searching from.
   * @returns {Number} Returns the index of the matched value or `-1`.
   * @example
   *
   * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
   * // => 4
   *
   * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
   * // => 1
   */
  function lastIndexOf(array, value, fromIndex) {
    if (!array) {
      return -1;
    }
    var index = array.length;
    if (fromIndex && typeof fromIndex == "number") {
      index =
        (fromIndex < 0
          ? Math.max(0, index + fromIndex)
          : Math.min(fromIndex, index - 1)) + 1;
    }
    while (index--) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Retrieves the maximum value of an `array`. If `callback` is passed,
   * it will be executed for each value in the `array` to generate the
   * criterion by which the value is ranked. The `callback` is bound to
   * `thisArg` and invoked with 3 arguments; (value, index, array).
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to iterate over.
   * @param {Function} [callback] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Mixed} Returns the maximum value.
   * @example
   *
   * var stooges = [
   *   { 'name': 'moe', 'age': 40 },
   *   { 'name': 'larry', 'age': 50 },
   *   { 'name': 'curly', 'age': 60 }
   * ];
   *
   * _.max(stooges, function(stooge) { return stooge.age; });
   * // => { 'name': 'curly', 'age': 60 };
   */
  function max(array, callback, thisArg) {
    var computed = -Infinity,
      result = computed;

    if (!array) {
      return result;
    }
    var current,
      index = -1,
      length = array.length;

    if (!callback) {
      while (++index < length) {
        if (array[index] > result) {
          result = array[index];
        }
      }
      return result;
    }
    if (thisArg) {
      callback = iteratorBind(callback, thisArg);
    }
    while (++index < length) {
      current = callback(array[index], index, array);
      if (current > computed) {
        computed = current;
        result = array[index];
      }
    }
    return result;
  }

  /**
   * Retrieves the minimum value of an `array`. If `callback` is passed,
   * it will be executed for each value in the `array` to generate the
   * criterion by which the value is ranked. The `callback` is bound to `thisArg`
   * and invoked with 3 arguments; (value, index, array).
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to iterate over.
   * @param {Function} [callback] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Mixed} Returns the minimum value.
   * @example
   *
   * _.min([10, 5, 100, 2, 1000]);
   * // => 2
   */
  function min(array, callback, thisArg) {
    var computed = Infinity,
      result = computed;

    if (!array) {
      return result;
    }
    var current,
      index = -1,
      length = array.length;

    if (!callback) {
      while (++index < length) {
        if (array[index] < result) {
          result = array[index];
        }
      }
      return result;
    }
    if (thisArg) {
      callback = iteratorBind(callback, thisArg);
    }
    while (++index < length) {
      current = callback(array[index], index, array);
      if (current < computed) {
        computed = current;
        result = array[index];
      }
    }
    return result;
  }

  /**
   * Creates an array of numbers (positive and/or negative) progressing from
   * `start` up to but not including `stop`. This method is a port of Python's
   * `range()` function. See http://docs.python.org/library/functions.html#range.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Number} [start=0] The start of the range.
   * @param {Number} end The end of the range.
   * @param {Number} [step=1] The value to increment or descrement by.
   * @returns {Array} Returns a new range array.
   * @example
   *
   * _.range(10);
   * // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
   *
   * _.range(1, 11);
   * // => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
   *
   * _.range(0, 30, 5);
   * // => [0, 5, 10, 15, 20, 25]
   *
   * _.range(0, -10, -1);
   * // => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
   *
   * _.range(0);
   * // => []
   */
  function range(start, end, step) {
    step || (step = 1);
    if (arguments.length < 2) {
      end = start || 0;
      start = 0;
    }

    var index = -1,
      length = Math.max(Math.ceil((end - start) / step), 0),
      result = Array(length);

    while (++index < length) {
      result[index] = start;
      start += step;
    }
    return result;
  }

  /**
   * The opposite of `_.initial`, this method gets all but the first value of
   * `array`. Pass `n` to exclude the first `n` values from the result.
   *
   * @static
   * @memberOf _
   * @alias tail
   * @category Arrays
   * @param {Array} array The array to query.
   * @param {Number} [n] The number of elements to return.
   * @param {Object} [guard] Internally used to allow this method to work with
   *  others like `_.map` without using their callback `index` argument for `n`.
   * @returns {Array} Returns all but the first value or `n` values of `array`.
   * @example
   *
   * _.rest([3, 2, 1]);
   * // => [2, 1]
   */
  function rest(array, n, guard) {
    if (!array) {
      return [];
    }
    return slice.call(array, n == undefined || guard ? 1 : n);
  }

  /**
   * Produces a new array of shuffled `array` values, using a version of the
   * Fisher-Yates shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to shuffle.
   * @returns {Array} Returns a new shuffled array.
   * @example
   *
   * _.shuffle([1, 2, 3, 4, 5, 6]);
   * // => [4, 1, 6, 3, 5, 2]
   */
  function shuffle(array) {
    if (!array) {
      return [];
    }
    var rand,
      index = -1,
      length = array.length,
      result = Array(length);

    while (++index < length) {
      rand = Math.floor(Math.random() * (index + 1));
      result[index] = result[rand];
      result[rand] = array[index];
    }
    return result;
  }

  /**
   * Produces a new sorted array, ranked in ascending order by the results of
   * running each element of `array` through `callback`. The `callback` is
   * bound to `thisArg` and invoked with 3 arguments; (value, index, array). The
   * `callback` argument may also be the name of a property to sort by (e.g. 'length').
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to iterate over.
   * @param {Function|String} callback The function called per iteration or
   *  property name to sort by.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Array} Returns a new array of sorted values.
   * @example
   *
   * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
   * // => [3, 1, 2]
   *
   * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
   * // => [3, 1, 2]
   *
   * _.sortBy(['larry', 'brendan', 'moe'], 'length');
   * // => ['moe', 'larry', 'brendan']
   */
  function sortBy(array, callback, thisArg) {
    if (!array) {
      return [];
    }
    if (typeof callback == "string") {
      var prop = callback;
      callback = function (array) {
        return array[prop];
      };
    } else if (thisArg) {
      callback = iteratorBind(callback, thisArg);
    }
    var index = -1,
      length = array.length,
      result = Array(length);

    while (++index < length) {
      result[index] = {
        criteria: callback(array[index], index, array),
        value: array[index],
      };
    }
    result.sort(function (left, right) {
      var a = left.criteria,
        b = right.criteria;

      if (a === undefined) {
        return 1;
      }
      if (b === undefined) {
        return -1;
      }
      return a < b ? -1 : a > b ? 1 : 0;
    });

    while (length--) {
      result[length] = result[length].value;
    }
    return result;
  }

  /**
   * Uses a binary search to determine the smallest index at which the `value`
   * should be inserted into `array` in order to maintain the sort order of the
   * sorted `array`. If `callback` is passed, it will be executed for `value` and
   * each element in `array` to compute their sort ranking. The `callback` is
   * bound to `thisArg` and invoked with 1 argument; (value).
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to iterate over.
   * @param {Mixed} value The value to evaluate.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Number} Returns the index at which the value should be inserted
   *  into `array`.
   * @example
   *
   * _.sortedIndex([20, 30, 40], 35);
   * // => 2
   *
   * var dict = {
   *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'thirty-five': 35, 'fourty': 40 }
   * };
   *
   * _.sortedIndex(['twenty', 'thirty', 'fourty'], 'thirty-five', function(word) {
   *   return dict.wordToNumber[word];
   * });
   * // => 2
   *
   * _.sortedIndex(['twenty', 'thirty', 'fourty'], 'thirty-five', function(word) {
   *   return this.wordToNumber[word];
   * }, dict);
   * // => 2
   */
  function sortedIndex(array, value, callback, thisArg) {
    if (!array) {
      return 0;
    }
    var mid,
      low = 0,
      high = array.length;

    if (callback) {
      if (thisArg) {
        callback = bind(callback, thisArg);
      }
      value = callback(value);
      while (low < high) {
        mid = (low + high) >>> 1;
        callback(array[mid]) < value ? (low = mid + 1) : (high = mid);
      }
    } else {
      while (low < high) {
        mid = (low + high) >>> 1;
        array[mid] < value ? (low = mid + 1) : (high = mid);
      }
    }
    return low;
  }

  /**
   * Computes the union of the passed-in arrays.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} [array1, array2, ...] Arrays to process.
   * @returns {Array} Returns a new array of unique values, in order, that are
   *  present in one or more of the arrays.
   * @example
   *
   * _.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);
   * // => [1, 2, 3, 101, 10]
   */
  function union() {
    var index = -1,
      result = [],
      flattened = concat.apply(result, arguments),
      length = flattened.length;

    while (++index < length) {
      if (indexOf(result, flattened[index]) < 0) {
        result.push(flattened[index]);
      }
    }
    return result;
  }

  /**
   * Produces a duplicate-value-free version of the `array` using strict equality
   * for comparisons, i.e. `===`. If the `array` is already sorted, passing `true`
   * for `isSorted` will run a faster algorithm. If `callback` is passed,
   * each value of `array` is passed through a transformation `callback` before
   * uniqueness is computed. The `callback` is bound to `thisArg` and invoked
   * with 3 arguments; (value, index, array).
   *
   * @static
   * @memberOf _
   * @alias unique
   * @category Arrays
   * @param {Array} array The array to process.
   * @param {Boolean} [isSorted=false] A flag to indicate that the `array` is already sorted.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Array} Returns a duplicate-value-free array.
   * @example
   *
   * _.uniq([1, 2, 1, 3, 1]);
   * // => [1, 2, 3]
   *
   * _.uiq([1, 1, 2, 2, 3], true);
   * // => [1, 2, 3]
   *
   * _.uniq([1, 2, 1.5, 3, 2.5], function(num) { return Math.floor(num); });
   * // => [1, 2, 3]
   *
   * _.uniq([1, 2, 1.5, 3, 2.5], function(num) { return this.floor(num); }, Math);
   * // => [1, 2, 3]
   */
  function uniq(array, isSorted, callback, thisArg) {
    var result = [];
    if (!array) {
      return result;
    }
    var computed,
      index = -1,
      length = array.length,
      seen = [];

    // juggle arguments
    if (typeof isSorted == "function") {
      thisArg = callback;
      callback = isSorted;
      isSorted = false;
    }
    if (!callback) {
      callback = identity;
    } else if (thisArg) {
      callback = iteratorBind(callback, thisArg);
    }
    while (++index < length) {
      computed = callback(array[index], index, array);
      if (
        isSorted
          ? !index || seen[seen.length - 1] !== computed
          : indexOf(seen, computed) < 0
      ) {
        seen.push(computed);
        result.push(array[index]);
      }
    }
    return result;
  }

  /**
   * Produces a new array with all occurrences of the passed values removed using
   * strict equality for comparisons, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to filter.
   * @param {Mixed} [value1, value2, ...] Values to remove.
   * @returns {Array} Returns a new filtered array.
   * @example
   *
   * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
   * // => [2, 3, 4]
   */
  function without(array) {
    var result = [];
    if (!array) {
      return result;
    }
    var excluded = slice.call(arguments, 1),
      index = -1,
      length = array.length;

    while (++index < length) {
      if (indexOf(excluded, array[index]) < 0) {
        result.push(array[index]);
      }
    }
    return result;
  }

  /**
   * Merges together the values of each of the arrays with the value at the
   * corresponding position. Useful for separate data sources that are coordinated
   * through matching array indexes. For a matrix of nested arrays, `_.zip.apply(...)`
   * can transpose the matrix in a similar fashion.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} [array1, array2, ...] Arrays to process.
   * @returns {Array} Returns a new array of merged arrays.
   * @example
   *
   * _.zip(['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]);
   * // => [['moe', 30, true], ['larry', 40, false], ['curly', 50, false]]
   */
  function zip(array) {
    if (!array) {
      return [];
    }
    var index = -1,
      length = max(pluck(arguments, "length")),
      result = Array(length);

    while (++index < length) {
      result[index] = pluck(arguments, index);
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a new function that is restricted to executing only after it is
   * called `n` times.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Number} n The number of times the function must be called before
   * it is executed.
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * var renderNotes = _.after(notes.length, render);
   * _.forEach(notes, function(note) {
   *   note.asyncSave({ 'success': renderNotes });
   * });
   * // `renderNotes` is run once, after all notes have saved
   */
  function after(n, func) {
    if (n < 1) {
      return func();
    }
    return function () {
      if (--n < 1) {
        return func.apply(this, arguments);
      }
    };
  }

  /**
   * Creates a new function that, when called, invokes `func` with the `this`
   * binding of `thisArg` and prepends any additional `bind` arguments to those
   * passed to the bound function. Lazy defined methods may be bound by passing
   * the object they are bound to as `func` and the method name as `thisArg`.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function|Object} func The function to bind or the object the method belongs to.
   * @param {Mixed} [thisArg] The `this` binding of `func` or the method name.
   * @param {Mixed} [arg1, arg2, ...] Arguments to be partially applied.
   * @returns {Function} Returns the new bound function.
   * @example
   *
   * // basic bind
   * var func = function(greeting) {
   *   return greeting + ': ' + this.name;
   * };
   *
   * func = _.bind(func, { 'name': 'moe' }, 'hi');
   * func();
   * // => 'hi: moe'
   *
   * // lazy bind
   * var object = {
   *   'name': 'moe',
   *   'greet': function(greeting) {
   *     return greeting + ': ' + this.name;
   *   }
   * };
   *
   * var func = _.bind(object, 'greet', 'hi');
   * func();
   * // => 'hi: moe'
   *
   * object.greet = function(greeting) {
   *   return greeting + ', ' + this.name + '!';
   * };
   *
   * func();
   * // => 'hi, moe!'
   */
  function bind(func, thisArg) {
    var methodName,
      isFunc = toString.call(func) == funcClass;

    // juggle arguments
    if (!isFunc) {
      methodName = thisArg;
      thisArg = func;
    }
    // use if `Function#bind` is faster
    else if (nativeBind) {
      return nativeBind.call.apply(nativeBind, arguments);
    }

    var partialArgs = slice.call(arguments, 2);

    function bound() {
      // `Function#bind` spec
      // http://es5.github.com/#x15.3.4.5
      var args = arguments,
        thisBinding = thisArg;

      if (!isFunc) {
        func = thisArg[methodName];
      }
      if (partialArgs.length) {
        args = args.length ? concat.apply(partialArgs, args) : partialArgs;
      }
      if (this instanceof bound) {
        // get `func` instance if `bound` is invoked in a `new` expression
        noop.prototype = func.prototype;
        thisBinding = new noop();

        // mimic the constructor's `return` behavior
        // http://es5.github.com/#x13.2.2
        var result = func.apply(thisBinding, args);
        return valueTypes[typeof result] && result !== null
          ? result
          : thisBinding;
      }
      return func.apply(thisBinding, args);
    }

    return bound;
  }

  /**
   * Binds methods on `object` to `object`, overwriting the existing method.
   * If no method names are provided, all the function properties of `object`
   * will be bound.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Object} object The object to bind and assign the bound methods to.
   * @param {String} [methodName1, methodName2, ...] Method names on the object to bind.
   * @returns {Object} Returns the `object`.
   * @example
   *
   * var buttonView = {
   *  'label': 'lodash',
   *  'onClick': function() { alert('clicked: ' + this.label); },
   *  'onHover': function() { console.log('hovering: ' + this.label); }
   * };
   *
   * _.bindAll(buttonView);
   * jQuery('#lodash_button').on('click', buttonView.onClick);
   * // => When the button is clicked, `this.label` will have the correct value
   */
  function bindAll(object) {
    var funcs = arguments,
      index = 1;

    if (funcs.length == 1) {
      index = 0;
      funcs = functions(object);
    }
    for (var length = funcs.length; index < length; index++) {
      object[funcs[index]] = bind(object[funcs[index]], object);
    }
    return object;
  }

  /**
   * Creates a new function that is the composition of the passed functions,
   * where each function consumes the return value of the function that follows.
   * In math terms, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} [func1, func2, ...] Functions to compose.
   * @returns {Function} Returns the new composed function.
   * @example
   *
   * var greet = function(name) { return 'hi: ' + name; };
   * var exclaim = function(statement) { return statement + '!'; };
   * var welcome = _.compose(exclaim, greet);
   * welcome('moe');
   * // => 'hi: moe!'
   */
  function compose() {
    var funcs = arguments;
    return function () {
      var args = arguments,
        length = funcs.length;

      while (length--) {
        args = [funcs[length].apply(this, args)];
      }
      return args[0];
    };
  }

  /**
   * Creates a new function that will delay the execution of `func` until after
   * `wait` milliseconds have elapsed since the last time it was invoked. Pass
   * `true` for `immediate` to cause debounce to invoke `func` on the leading,
   * instead of the trailing, edge of the `wait` timeout. Subsequent calls to
   * the debounced function will return the result of the last `func` call.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to debounce.
   * @param {Number} wait The number of milliseconds to delay.
   * @param {Boolean} immediate A flag to indicate execution is on the leading
   *  edge of the timeout.
   * @returns {Function} Returns the new debounced function.
   * @example
   *
   * var lazyLayout = _.debounce(calculateLayout, 300);
   * jQuery(window).on('resize', lazyLayout);
   */
  function debounce(func, wait, immediate) {
    var args, result, thisArg, timeoutId;

    function delayed() {
      timeoutId = undefined;
      if (!immediate) {
        func.apply(thisArg, args);
      }
    }

    return function () {
      var isImmediate = immediate && !timeoutId;
      args = arguments;
      thisArg = this;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(delayed, wait);

      if (isImmediate) {
        result = func.apply(thisArg, args);
      }
      return result;
    };
  }

  /**
   * Executes the `func` function after `wait` milliseconds. Additional arguments
   * are passed to `func` when it is invoked.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to delay.
   * @param {Number} wait The number of milliseconds to delay execution.
   * @param {Mixed} [arg1, arg2, ...] Arguments to invoke the function with.
   * @returns {Number} Returns the `setTimeout` timeout id.
   * @example
   *
   * var log = _.bind(console.log, console);
   * _.delay(log, 1000, 'logged later');
   * // => 'logged later' (Appears after one second.)
   */
  function delay(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function () {
      return func.apply(undefined, args);
    }, wait);
  }

  /**
   * Defers executing the `func` function until the current call stack has cleared.
   * Additional arguments are passed to `func` when it is invoked.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to defer.
   * @param {Mixed} [arg1, arg2, ...] Arguments to invoke the function with.
   * @returns {Number} Returns the `setTimeout` timeout id.
   * @example
   *
   * _.defer(function() { alert('deferred'); });
   * // returns from the function before `alert` is called
   */
  function defer(func) {
    var args = slice.call(arguments, 1);
    return setTimeout(function () {
      return func.apply(undefined, args);
    }, 1);
  }

  /**
   * Creates a new function that memoizes the result of `func`. If `resolver` is
   * passed, it will be used to determine the cache key for storing the result
   * based on the arguments passed to the memoized function. By default, the first
   * argument passed to the memoized function is used as the cache key.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] A function used to resolve the cache key.
   * @returns {Function} Returns the new memoizing function.
   * @example
   *
   * var fibonacci = _.memoize(function(n) {
   *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
   * });
   */
  function memoize(func, resolver) {
    var cache = {};
    return function () {
      var prop = resolver ? resolver.apply(this, arguments) : arguments[0];
      return hasOwnProperty.call(cache, prop)
        ? cache[prop]
        : (cache[prop] = func.apply(this, arguments));
    };
  }

  /**
   * Creates a new function that is restricted to one execution. Repeat calls to
   * the function will return the value of the first call.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * var initialize = _.once(createApplication);
   * initialize();
   * initialize();
   * // Application is only created once.
   */
  function once(func) {
    var result,
      ran = false;

    return function () {
      if (ran) {
        return result;
      }
      ran = true;
      result = func.apply(this, arguments);
      return result;
    };
  }

  /**
   * Creates a new function that, when called, invokes `func` with any additional
   * `partial` arguments prepended to those passed to the partially applied
   * function. This method is similar `bind`, except it does **not** alter the
   * `this` binding.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to partially apply arguments to.
   * @param {Mixed} [arg1, arg2, ...] Arguments to be partially applied.
   * @returns {Function} Returns the new partially applied function.
   * @example
   *
   * var greet = function(greeting, name) { return greeting + ': ' + name; };
   * var hi = _.partial(greet, 'hi');
   * hi('moe');
   * // => 'hi: moe'
   */
  function partial(func) {
    var args = slice.call(arguments, 1),
      argsLength = args.length;

    return function () {
      var result,
        others = arguments;

      if (others.length) {
        args.length = argsLength;
        push.apply(args, others);
      }
      result =
        args.length == 1 ? func.call(this, args[0]) : func.apply(this, args);
      args.length = argsLength;
      return result;
    };
  }

  /**
   * Creates a new function that, when executed, will only call the `func`
   * function at most once per every `wait` milliseconds. If the throttled
   * function is invoked more than once during the `wait` timeout, `func` will
   * also be called on the trailing edge of the timeout. Subsequent calls to the
   * throttled function will return the result of the last `func` call.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to throttle.
   * @param {Number} wait The number of milliseconds to throttle executions to.
   * @returns {Function} Returns the new throttled function.
   * @example
   *
   * var throttled = _.throttle(updatePosition, 100);
   * jQuery(window).on('scroll', throttled);
   */
  function throttle(func, wait) {
    var args,
      result,
      thisArg,
      timeoutId,
      lastCalled = 0;

    function trailingCall() {
      lastCalled = new Date();
      timeoutId = undefined;
      func.apply(thisArg, args);
    }

    return function () {
      var now = new Date(),
        remain = wait - (now - lastCalled);

      args = arguments;
      thisArg = this;

      if (remain <= 0) {
        lastCalled = now;
        result = func.apply(thisArg, args);
      } else if (!timeoutId) {
        timeoutId = setTimeout(trailingCall, remain);
      }
      return result;
    };
  }

  /**
   * Create a new function that passes the `func` function to the `wrapper`
   * function as its first argument. Additional arguments are appended to those
   * passed to the `wrapper` function.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to wrap.
   * @param {Function} wrapper The wrapper function.
   * @param {Mixed} [arg1, arg2, ...] Arguments to append to those passed to the wrapper.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var hello = function(name) { return 'hello: ' + name; };
   * hello = _.wrap(hello, function(func) {
   *   return 'before, ' + func('moe') + ', after';
   * });
   * hello();
   * // => 'before, hello: moe, after'
   */
  function wrap(func, wrapper) {
    return function () {
      var args = [func];
      if (arguments.length) {
        push.apply(args, arguments);
      }
      return wrapper.apply(this, args);
    };
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a shallow clone of the `value`. Any nested objects or arrays will be
   * assigned by reference and not cloned.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to clone.
   * @returns {Mixed} Returns the cloned `value`.
   * @example
   *
   * _.clone({ 'name': 'moe' });
   * // => { 'name': 'moe' };
   */
  function clone(value) {
    return valueTypes[typeof value] && value !== null
      ? isArray(value)
        ? value.slice()
        : extend({}, value)
      : value;
  }

  /**
   * Assigns missing properties on `object` with default values from the defaults
   * objects. Once a property is set, additional defaults of the same property
   * will be ignored.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to populate.
   * @param {Object} [defaults1, defaults2, ...] The defaults objects to apply to `object`.
   * @returns {Object} Returns `object`.
   * @example
   *
   * var iceCream = { 'flavor': 'chocolate' };
   * _.defaults(iceCream, { 'flavor': 'vanilla', 'sprinkles': 'rainbow' });
   * // => { 'flavor': 'chocolate', 'sprinkles': 'rainbow' }
   */
  var defaults = createIterator(extendIteratorOptions, {
    inLoop: "if (object[index] == undefined)" + extendIteratorOptions.inLoop,
  });

  /**
   * Copies enumerable properties from the source objects to the `destination` object.
   * Subsequent sources will overwrite propery assignments of previous sources.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The destination object.
   * @param {Object} [source1, source2, ...] The source objects.
   * @returns {Object} Returns the destination object.
   * @example
   *
   * _.extend({ 'name': 'moe' }, { 'age': 40 });
   * // => { 'name': 'moe', 'age': 40 }
   */
  var extend = createIterator(extendIteratorOptions);

  /**
   * Iterates over `object`'s own and inherited enumerable properties, executing
   * the `callback` for each property. The `callback` is bound to `thisArg` and
   * invoked with 3 arguments; (value, key, object).
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to iterate over.
   * @param {Function} callback The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Object} Returns the `object`.
   * @example
   *
   * function Dog(name) {
   *   this.name = name;
   * }
   *
   * Dog.prototype.bark = function() {
   *   alert('Woof, woof!');
   * };
   *
   * _.forIn(new Dog('Dagny'), function(value, key) {
   *   alert(key);
   * });
   * // => alerts 'name' and 'bark' (order is not guaranteed)
   */
  var forIn = createIterator(
    baseIteratorOptions,
    forEachIteratorOptions,
    forOwnIteratorOptions,
    {
      useHas: false,
    }
  );

  /**
   * Iterates over `object`'s own enumerable properties, executing the `callback`
   * for each property. The `callback` is bound to `thisArg` and invoked with 3
   * arguments; (value, key, object).
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to iterate over.
   * @param {Function} callback The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Object} Returns the `object`.
   * @example
   *
   * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
   *   alert(key);
   * });
   * // => alerts '0', '1', and 'length' (order is not guaranteed)
   */
  var forOwn = createIterator(
    baseIteratorOptions,
    forEachIteratorOptions,
    forOwnIteratorOptions
  );

  /**
   * Produces a sorted array of the enumerable properties, own and inherited,
   * of `object` that have function values.
   *
   * @static
   * @memberOf _
   * @alias methods
   * @category Objects
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns a new array of property names that have function values.
   * @example
   *
   * _.functions(_);
   * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
   */
  var functions = createIterator({
    args: "object",
    init: "[]",
    useHas: false,
    inLoop: "if (toString.call(object[index]) == funcClass) result.push(index)",
    bottom: "result.sort()",
  });

  /**
   * Checks if the specified object `property` exists and is a direct property,
   * instead of an inherited property.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to check.
   * @param {String} property The property to check for.
   * @returns {Boolean} Returns `true` if key is a direct property, else `false`.
   * @example
   *
   * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
   * // => true
   */
  function has(object, property) {
    return hasOwnProperty.call(object, property);
  }

  /**
   * Checks if `value` is an `arguments` object.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
   * @example
   *
   * (function() { return _.isArguments(arguments); })(1, 2, 3);
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = function (value) {
    return toString.call(value) == "[object Arguments]";
  };
  // fallback for browser like IE < 9 which detect `arguments` as `[object Object]`
  if (!isArguments(arguments)) {
    isArguments = function (value) {
      return !!(value && hasOwnProperty.call(value, "callee"));
    };
  }

  /**
   * Checks if `value` is an array.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is an array, else `false`.
   * @example
   *
   * (function() { return _.isArray(arguments); })();
   * // => false
   *
   * _.isArray([1, 2, 3]);
   * // => true
   */
  var isArray =
    nativeIsArray ||
    function (value) {
      return toString.call(value) == arrayClass;
    };

  /**
   * Checks if `value` is a boolean (`true` or `false`) value.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a boolean value, else `false`.
   * @example
   *
   * _.isBoolean(null);
   * // => false
   */
  function isBoolean(value) {
    return (
      value === true || value === false || toString.call(value) == boolClass
    );
  }

  /**
   * Checks if `value` is a date.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a date, else `false`.
   * @example
   *
   * _.isDate(new Date);
   * // => true
   */
  function isDate(value) {
    return toString.call(value) == dateClass;
  }

  /**
   * Checks if `value` is a DOM element.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a DOM element, else `false`.
   * @example
   *
   * _.isElement(document.body);
   * // => true
   */
  function isElement(value) {
    return !!(value && value.nodeType == 1);
  }

  /**
   * Checks if `value` is empty. Arrays or strings with a length of `0` and
   * objects with no own enumerable properties are considered "empty".
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Array|Object|String} value The value to inspect.
   * @returns {Boolean} Returns `true` if the `value` is empty, else `false`.
   * @example
   *
   * _.isEmpty([1, 2, 3]);
   * // => false
   *
   * _.isEmpty({});
   * // => true
   */
  var isEmpty = createIterator({
    args: "value",
    init: "true",
    top:
      "var className = toString.call(value);\n" +
      "if (className == arrayClass || className == stringClass) return !value.length",
    inLoop: {
      object: "return false",
    },
  });

  /**
   * Performs a deep comparison between two values to determine if they are
   * equivalent to each other.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} a The value to compare.
   * @param {Mixed} b The other value to compare.
   * @param {Array} [stack] Internally used to keep track of "seen" objects to
   *  avoid circular references.
   * @returns {Boolean} Returns `true` if the values are equvalent, else `false`.
   * @example
   *
   * var moe = { 'name': 'moe', 'luckyNumbers': [13, 27, 34] };
   * var clone = { 'name': 'moe', 'luckyNumbers': [13, 27, 34] };
   *
   * moe == clone;
   * // => false
   *
   * _.isEqual(moe, clone);
   * // => true
   */
  function isEqual(a, b, stack) {
    stack || (stack = []);

    // exit early for identical values
    if (a === b) {
      // treat `+0` vs. `-0` as not equal
      return a !== 0 || 1 / a == 1 / b;
    }
    // a strict comparison is necessary because `null == undefined`
    if (a == undefined || b == undefined) {
      return a === b;
    }
    // unwrap any wrapped objects
    if (a._chain) {
      a = a._wrapped;
    }
    if (b._chain) {
      b = b._wrapped;
    }
    // invoke a custom `isEqual` method if one is provided
    if (a.isEqual && toString.call(a.isEqual) == funcClass) {
      return a.isEqual(b);
    }
    if (b.isEqual && toString.call(b.isEqual) == funcClass) {
      return b.isEqual(a);
    }
    // compare [[Class]] names
    var className = toString.call(a);
    if (className != toString.call(b)) {
      return false;
    }
    switch (className) {
      // strings, numbers, dates, and booleans are compared by value
      case stringClass:
        // primitives and their corresponding object instances are equivalent;
        // thus, `'5'` is quivalent to `new String('5')`
        return a == String(b);

      case numberClass:
        // treat `NaN` vs. `NaN` as equal
        return a != +a
          ? b != +b
          : // but treat `+0` vs. `-0` as not equal
          a == 0
          ? 1 / a == 1 / b
          : a == +b;

      case boolClass:
      case dateClass:
        // coerce dates and booleans to numeric values, dates to milliseconds and booleans to 1 or 0;
        // treat invalid dates coerced to `NaN` as not equal
        return +a == +b;

      // regexps are compared by their source and flags
      case regexpClass:
        return (
          a.source == b.source &&
          a.global == b.global &&
          a.multiline == b.multiline &&
          a.ignoreCase == b.ignoreCase
        );
    }
    if (typeof a != "object" || typeof b != "object") {
      return false;
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (stack[length] == a) {
        return true;
      }
    }

    var index = -1,
      result = true,
      size = 0;

    // add the first collection to the stack of traversed objects
    stack.push(a);

    // recursively compare objects and arrays
    if (className == arrayClass) {
      // compare array lengths to determine if a deep comparison is necessary
      size = a.length;
      result = size == b.length;

      if (result) {
        // deep compare the contents, ignoring non-numeric properties
        while (size--) {
          if (!(result = isEqual(a[size], b[size], stack))) {
            break;
          }
        }
      }
    } else {
      // objects with different constructors are not equivalent
      if (
        "constructor" in a != "constructor" in b ||
        a.constructor != b.constructor
      ) {
        return false;
      }
      // deep compare objects.
      for (var prop in a) {
        if (hasOwnProperty.call(a, prop)) {
          // count the number of properties.
          size++;
          // deep compare each property value.
          if (
            !(result =
              hasOwnProperty.call(b, prop) && isEqual(a[prop], b[prop], stack))
          ) {
            break;
          }
        }
      }
      // ensure both objects have the same number of properties
      if (result) {
        for (prop in b) {
          // Adobe's JS engine, embedded in applications like InDesign, has a
          // bug that causes `!size--` to throw an error so it must be wrapped
          // in parentheses.
          // https://github.com/documentcloud/underscore/issues/355
          if (hasOwnProperty.call(b, prop) && !size--) {
            break;
          }
        }
        result = !size;
      }
      // handle JScript [[DontEnum]] bug
      if (result && hasDontEnumBug) {
        while (++index < 7) {
          prop = shadowed[index];
          if (hasOwnProperty.call(a, prop)) {
            if (
              !(result =
                hasOwnProperty.call(b, prop) &&
                isEqual(a[prop], b[prop], stack))
            ) {
              break;
            }
          }
        }
      }
    }
    // remove the first collection from the stack of traversed objects
    stack.pop();
    return result;
  }

  /**
   * Checks if `value` is a finite number.
   * Note: This is not the same as native `isFinite`, which will return true for
   * booleans and other values. See http://es5.github.com/#x15.1.2.5.
   *
   * @deprecated
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a finite number, else `false`.
   * @example
   *
   * _.isFinite(-101);
   * // => true
   *
   * _.isFinite('10');
   * // => false
   *
   * _.isFinite(Infinity);
   * // => false
   */
  function isFinite(value) {
    return nativeIsFinite(value) && toString.call(value) == numberClass;
  }

  /**
   * Checks if `value` is a function.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(''.concat);
   * // => true
   */
  function isFunction(value) {
    return toString.call(value) == funcClass;
  }

  /**
   * Checks if `value` is the language type of Object.
   * (e.g. arrays, functions, objects, regexps, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject(1);
   * // => false
   */
  function isObject(value) {
    // check if the value is the ECMAScript language type of Object
    // http://es5.github.com/#x8
    return valueTypes[typeof value] && value !== null;
  }

  /**
   * Checks if `value` is `NaN`.
   * Note: This is not the same as native `isNaN`, which will return true for
   * `undefined` and other values. See http://es5.github.com/#x15.1.2.4.
   *
   * @deprecated
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is `NaN`, else `false`.
   * @example
   *
   * _.isNaN(NaN);
   * // => true
   *
   * _.isNaN(new Number(NaN));
   * // => true
   *
   * isNaN(undefined);
   * // => true
   *
   * _.isNaN(undefined);
   * // => false
   */
  function isNaN(value) {
    // `NaN` as a primitive is the only value that is not equal to itself
    // (perform the [[Class]] check first to avoid errors with some host objects in IE)
    return toString.call(value) == numberClass && value != +value;
  }

  /**
   * Checks if `value` is `null`.
   *
   * @deprecated
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is `null`, else `false`.
   * @example
   *
   * _.isNull(null);
   * // => true
   *
   * _.isNull(undefined);
   * // => false
   */
  function isNull(value) {
    return value === null;
  }

  /**
   * Checks if `value` is a number.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a number, else `false`.
   * @example
   *
   * _.isNumber(8.4 * 5;
   * // => true
   */
  function isNumber(value) {
    return toString.call(value) == numberClass;
  }

  /**
   * Checks if `value` is a regular expression.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a regular expression, else `false`.
   * @example
   *
   * _.isRegExp(/moe/);
   * // => true
   */
  function isRegExp(value) {
    return toString.call(value) == regexpClass;
  }

  /**
   * Checks if `value` is a string.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a string, else `false`.
   * @example
   *
   * _.isString('moe');
   * // => true
   */
  function isString(value) {
    return toString.call(value) == stringClass;
  }

  /**
   * Checks if `value` is `undefined`.
   *
   * @deprecated
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is `undefined`, else `false`.
   * @example
   *
   * _.isUndefined(void 0);
   * // => true
   */
  function isUndefined(value) {
    return value === undefined;
  }

  /**
   * Produces an array of object`'s own enumerable property names.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns a new array of property names.
   * @example
   *
   * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
   * // => ['one', 'two', 'three'] (order is not guaranteed)
   */
  var keys = !nativeKeys
    ? shimKeys
    : function (object) {
        // avoid iterating over the `prototype` property
        return typeof object == "function"
          ? shimKeys(object)
          : nativeKeys(object);
      };

  /**
   * Creates an object composed of the specified properties. Property names may
   * be specified as individual arguments or as arrays of property names.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to pluck.
   * @param {Object} [prop1, prop2, ...] The properties to pick.
   * @returns {Object} Returns an object composed of the picked properties.
   * @example
   *
   * _.pick({ 'name': 'moe', 'age': 40, 'userid': 'moe1' }, 'name', 'age');
   * // => { 'name': 'moe', 'age': 40 }
   */
  function pick(object) {
    var prop,
      index = 0,
      props = concat.apply(ArrayProto, arguments),
      length = props.length,
      result = {};

    // start `index` at `1` to skip `object`
    while (++index < length) {
      prop = props[index];
      if (prop in object) {
        result[prop] = object[prop];
      }
    }
    return result;
  }

  /**
   * Gets the size of `value` by returning `value.length` if `value` is a string
   * or array, or the number of own enumerable properties if `value` is an object.
   *
   * @deprecated
   * @static
   * @memberOf _
   * @category Objects
   * @param {Array|Object|String} value The value to inspect.
   * @returns {Number} Returns `value.length` if `value` is a string or array,
   *  or the number of own enumerable properties if `value` is an object.
   * @example
   *
   * _.size([1, 2]);
   * // => 2
   *
   * _.size({ 'one': 1, 'two': 2, 'three': 3 });
   * // => 3
   *
   * _.size('curly');
   * // => 5
   */
  function size(value) {
    var className = toString.call(value);
    return className == arrayClass || className == stringClass
      ? value.length
      : keys(value).length;
  }

  /**
   * Produces an array of `object`'s own enumerable property values.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns a new array of property values.
   * @example
   *
   * _.values({ 'one': 1, 'two': 2, 'three': 3 });
   * // => [1, 2, 3]
   */
  var values = createIterator({
    args: "object",
    init: "[]",
    inLoop: "result.push(object[index])",
  });

  /*--------------------------------------------------------------------------*/

  /**
   * Escapes a string for inclusion in HTML, replacing `&`, `<`, `"`, and `'`
   * characters.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {String} string The string to escape.
   * @returns {String} Returns the escaped string.
   * @example
   *
   * _.escape('Curly, Larry & Moe');
   * // => "Curly, Larry &amp; Moe"
   */
  function escape(string) {
    return string == null
      ? ""
      : (string + "").replace(reUnescapedHtml, escapeHtmlChar);
  }

  /**
   * This function returns the first argument passed to it.
   * Note: It is used throughout Lo-Dash as a default callback.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Mixed} value Any value.
   * @returns {Mixed} Returns `value`.
   * @example
   *
   * var moe = { 'name': 'moe' };
   * moe === _.identity(moe);
   * // => true
   */
  function identity(value) {
    return value;
  }

  /**
   * Adds functions properties of `object` to the `lodash` function and chainable
   * wrapper.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Object} object The object of function properties to add to `lodash`.
   * @example
   *
   * _.mixin({
   *   'capitalize': function(string) {
   *     return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
   *   }
   * });
   *
   * _.capitalize('curly');
   * // => 'Curly'
   *
   * _('larry').capitalize();
   * // => 'Larry'
   */
  function mixin(object) {
    forEach(functions(object), function (methodName) {
      var func = (lodash[methodName] = object[methodName]);

      LoDash.prototype[methodName] = function () {
        var args = [this._wrapped];
        if (arguments.length) {
          push.apply(args, arguments);
        }
        var result = func.apply(lodash, args);
        if (this._chain) {
          result = new LoDash(result);
          result._chain = true;
        }
        return result;
      };
    });
  }

  /**
   * Reverts the '_' variable to its previous value and returns a reference to
   * the `lodash` function.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @returns {Function} Returns the `lodash` function.
   * @example
   *
   * var lodash = _.noConflict();
   */
  function noConflict() {
    window._ = oldDash;
    return this;
  }

  /**
   * Resolves the value of `property` on `object`. If `property` is a function
   * it will be invoked and its result returned, else the property value is
   * returned. If `object` is falsey, then `null` is returned.
   *
   * @deprecated
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Object} object The object to inspect.
   * @param {String} property The property to get the result of.
   * @returns {Mixed} Returns the resolved value.
   * @example
   *
   * var object = {
   *   'cheese': 'crumpets',
   *   'stuff': function() {
   *     return 'nonsense';
   *   }
   * };
   *
   * _.result(object, 'cheese');
   * // => 'crumpets'
   *
   * _.result(object, 'stuff');
   * // => 'nonsense'
   */
  function result(object, property) {
    // based on Backbone's private `getValue` function
    // https://github.com/documentcloud/backbone/blob/0.9.9/backbone.js#L1419-1424
    if (!object) {
      return null;
    }
    var value = object[property];
    return toString.call(value) == funcClass ? object[property]() : value;
  }

  /**
   * A micro-templating method, similar to John Resig's implementation.
   * Lo-Dash templating handles arbitrary delimiters, preserves whitespace, and
   * correctly escapes quotes within interpolated code.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {String} text The template text.
   * @param {Obect} data The data object used to populate the text.
   * @param {Object} options The options object.
   * @returns {Function|String} Returns a compiled function when no `data` object
   *  is given, else it returns the interpolated text.
   * @example
   *
   * // using compiled template
   * var compiled = _.template('hello: <%= name %>');
   * compiled({ 'name': 'moe' });
   * // => 'hello: moe'
   *
   * var list = '<% _.forEach(people, function(name) { %> <li><%= name %></li> <% }); %>';
   * _.template(list, { 'people': ['moe', 'curly', 'larry'] });
   * // => '<li>moe</li><li>curly</li><li>larry</li>'
   *
   * var template = _.template('<b><%- value %></b>');
   * template({ 'value': '<script>' });
   * // => '<b>&lt;script></b>'
   *
   * // using `print`
   * var compiled = _.template('<% print("Hello " + epithet); %>');
   * compiled({ 'epithet': 'stooge' });
   * // => 'Hello stooge.'
   *
   * // using custom template settings
   * _.templateSettings = {
   *   'interpolate': /\{\{(.+?)\}\}/g
   * };
   *
   * var template = _.template('Hello {{ name }}!');
   * template({ 'name': 'Mustache' });
   * // => 'Hello Mustache!'
   *
   * // using the `variable` option
   * _.template('<%= data.hasWith %>', { 'hasWith': 'no' }, { 'variable': 'data' });
   * // => 'no'
   *
   * // using the `source` property
   * <script>
   *   JST.project = <%= _.template(jstText).source %>;
   * </script>
   */
  function template(text, data, options) {
    options || (options = {});

    var result,
      defaults = lodash.templateSettings,
      escapeDelimiter = options.escape,
      evaluateDelimiter = options.evaluate,
      interpolateDelimiter = options.interpolate,
      variable = options.variable;

    // use template defaults if no option is provided
    if (escapeDelimiter == null) {
      escapeDelimiter = defaults.escape;
    }
    if (evaluateDelimiter == null) {
      evaluateDelimiter = defaults.evaluate;
    }
    if (interpolateDelimiter == null) {
      interpolateDelimiter = defaults.interpolate;
    }

    // tokenize delimiters to avoid escaping them
    if (escapeDelimiter) {
      text = text.replace(escapeDelimiter, tokenizeEscape);
    }
    if (interpolateDelimiter) {
      text = text.replace(interpolateDelimiter, tokenizeInterpolate);
    }
    if (evaluateDelimiter) {
      text = text.replace(evaluateDelimiter, tokenizeEvaluate);
    }

    // escape characters that cannot be included in string literals and
    // detokenize delimiter code snippets
    text =
      "__p='" +
      text
        .replace(reUnescapedString, escapeStringChar)
        .replace(reToken, detokenize) +
      "';\n";

    // clear stored code snippets
    tokenized.length = 0;

    // if `options.variable` is not specified, add `data` to the top of the scope chain
    if (!variable) {
      variable = defaults.variable;
      text = "with (" + variable + " || {}) {\n" + text + "\n}\n";
    }

    text =
      "function(" +
      variable +
      ") {\n" +
      "var __p, __t, __j = Array.prototype.join;\n" +
      "function print() { __p += __j.call(arguments, '') }\n" +
      text +
      "return __p\n}";

    // add a sourceURL for easier debugging
    // http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
    if (useSourceURL) {
      text +=
        "\n//@ sourceURL=/lodash/template/source[" + templateCounter++ + "]";
    }

    result = Function("_", "return " + text)(lodash);

    if (data) {
      return result(data);
    }
    // provide the compiled function's source via its `toString()` method, in
    // supported environments, or the `source` property as a convenience for
    // build time precompilation
    result.source = text;
    return result;
  }

  /**
   * Executes the `callback` function `n` times. The `callback` is bound to
   * `thisArg` and invoked with 1 argument; (index).
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Number} n The number of times to execute the callback.
   * @param {Function} callback The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @example
   *
   * _.times(3, function() { genie.grantWish(); });
   * // => calls `genie.grantWish()` 3 times
   *
   * _.times(3, function() { this.grantWish(); }, genie);
   * // => also calls `genie.grantWish()` 3 times
   */
  function times(n, callback, thisArg) {
    var index = -1;
    if (thisArg) {
      while (++index < n) {
        callback.call(thisArg, index);
      }
    } else {
      while (++index < n) {
        callback(index);
      }
    }
  }

  /**
   * Generates a unique id. If `prefix` is passed, the id will be appended to it.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {String} [prefix] The value to prefix the id with.
   * @returns {Number|String} Returns a numeric id if no prefix is passed, else
   *  a string id may be returned.
   * @example
   *
   * _.uniqueId('contact_');
   * // => 'contact_104'
   */
  function uniqueId(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Wraps the value in a `lodash` wrapper object.
   *
   * @static
   * @memberOf _
   * @category Chaining
   * @param {Mixed} value The value to wrap.
   * @returns {Object} Returns the wrapper object.
   * @example
   *
   * var stooges = [
   *   { 'name': 'moe', 'age': 40 },
   *   { 'name': 'larry', 'age': 50 },
   *   { 'name': 'curly', 'age': 60 }
   * ];
   *
   * var youngest = _.chain(stooges)
   *     .sortBy(function(stooge) { return stooge.age; })
   *     .map(function(stooge) { return stooge.name + ' is ' + stooge.age; })
   *     .first()
   *     .value();
   * // => 'moe is 40'
   */
  function chain(value) {
    value = new LoDash(value);
    value._chain = true;
    return value;
  }

  /**
   * Invokes `interceptor` with the `value` as the first argument, and then
   * returns `value`. The purpose of this method is to "tap into" a method chain,
   * in order to perform operations on intermediate results within the chain.
   *
   * @static
   * @memberOf _
   * @category Chaining
   * @param {Mixed} value The value to pass to `callback`.
   * @param {Function} interceptor The function to invoke.
   * @returns {Mixed} Returns `value`.
   * @example
   *
   * _.chain([1,2,3,200])
   *  .filter(function(num) { return num % 2 == 0; })
   *  .tap(alert)
   *  .map(function(num) { return num * num })
   *  .value();
   * // => // [2, 200] (alerted)
   * // => [4, 40000]
   */
  function tap(value, interceptor) {
    interceptor(value);
    return value;
  }

  /**
   * Enables method chaining on the wrapper object.
   *
   * @name chain
   * @deprecated
   * @memberOf _
   * @category Chaining
   * @returns {Mixed} Returns the wrapper object.
   * @example
   *
   * _([1, 2, 3]).value();
   * // => [1, 2, 3]
   */
  function wrapperChain() {
    this._chain = true;
    return this;
  }

  /**
   * Extracts the wrapped value.
   *
   * @name value
   * @memberOf _
   * @category Chaining
   * @returns {Mixed} Returns the wrapped value.
   * @example
   *
   * _([1, 2, 3]).value();
   * // => [1, 2, 3]
   */
  function wrapperValue() {
    return this._wrapped;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type String
   */
  lodash.VERSION = "0.3.2";

  // assign static methods
  lodash.after = after;
  lodash.bind = bind;
  lodash.bindAll = bindAll;
  lodash.chain = chain;
  lodash.clone = clone;
  lodash.compact = compact;
  lodash.compose = compose;
  lodash.contains = contains;
  lodash.debounce = debounce;
  lodash.defaults = defaults;
  lodash.defer = defer;
  lodash.delay = delay;
  lodash.difference = difference;
  lodash.escape = escape;
  lodash.every = every;
  lodash.extend = extend;
  lodash.filter = filter;
  lodash.find = find;
  lodash.first = first;
  lodash.flatten = flatten;
  lodash.forEach = forEach;
  lodash.forIn = forIn;
  lodash.forOwn = forOwn;
  lodash.functions = functions;
  lodash.groupBy = groupBy;
  lodash.has = has;
  lodash.identity = identity;
  lodash.indexOf = indexOf;
  lodash.initial = initial;
  lodash.intersection = intersection;
  lodash.invoke = invoke;
  lodash.isArguments = isArguments;
  lodash.isArray = isArray;
  lodash.isBoolean = isBoolean;
  lodash.isDate = isDate;
  lodash.isElement = isElement;
  lodash.isEmpty = isEmpty;
  lodash.isEqual = isEqual;
  lodash.isFinite = isFinite;
  lodash.isFunction = isFunction;
  lodash.isNaN = isNaN;
  lodash.isNull = isNull;
  lodash.isNumber = isNumber;
  lodash.isObject = isObject;
  lodash.isRegExp = isRegExp;
  lodash.isString = isString;
  lodash.isUndefined = isUndefined;
  lodash.keys = keys;
  lodash.last = last;
  lodash.lastIndexOf = lastIndexOf;
  lodash.map = map;
  lodash.max = max;
  lodash.memoize = memoize;
  lodash.min = min;
  lodash.mixin = mixin;
  lodash.noConflict = noConflict;
  lodash.once = once;
  lodash.partial = partial;
  lodash.pick = pick;
  lodash.pluck = pluck;
  lodash.range = range;
  lodash.reduce = reduce;
  lodash.reduceRight = reduceRight;
  lodash.reject = reject;
  lodash.rest = rest;
  lodash.result = result;
  lodash.shuffle = shuffle;
  lodash.size = size;
  lodash.some = some;
  lodash.sortBy = sortBy;
  lodash.sortedIndex = sortedIndex;
  lodash.tap = tap;
  lodash.template = template;
  lodash.throttle = throttle;
  lodash.times = times;
  lodash.toArray = toArray;
  lodash.union = union;
  lodash.uniq = uniq;
  lodash.uniqueId = uniqueId;
  lodash.values = values;
  lodash.without = without;
  lodash.wrap = wrap;
  lodash.zip = zip;

  // assign aliases
  lodash.all = every;
  lodash.any = some;
  lodash.collect = map;
  lodash.detect = find;
  lodash.each = forEach;
  lodash.foldl = reduce;
  lodash.foldr = reduceRight;
  lodash.head = first;
  lodash.include = contains;
  lodash.inject = reduce;
  lodash.methods = functions;
  lodash.select = filter;
  lodash.tail = rest;
  lodash.take = first;
  lodash.unique = uniq;

  // add pseudo private properties used and removed during the build process
  lodash._iteratorTemplate = iteratorTemplate;
  lodash._shimKeys = shimKeys;

  /*--------------------------------------------------------------------------*/

  // assign private `LoDash` constructor's prototype
  LoDash.prototype = lodash.prototype;

  // add all static functions to `LoDash.prototype`
  mixin(lodash);

  // add `LoDash.prototype.chain` after calling `mixin()` to avoid overwriting
  // it with the wrapped `lodash.chain`
  LoDash.prototype.chain = wrapperChain;
  LoDash.prototype.value = wrapperValue;

  // add all mutator Array functions to the wrapper.
  forEach(
    ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"],
    function (methodName) {
      var func = ArrayProto[methodName];

      LoDash.prototype[methodName] = function () {
        var value = this._wrapped;
        func.apply(value, arguments);

        // IE compatibility mode and IE < 9 have buggy Array `shift()` and `splice()`
        // functions that fail to remove the last element, `value[0]`, of
        // array-like objects even though the `length` property is set to `0`.
        // The `shift()` method is buggy in IE 8 compatibility mode, while `splice()`
        // is buggy regardless of mode in IE < 9 and buggy in compatibility mode in IE 9.
        if (value.length === 0) {
          delete value[0];
        }
        if (this._chain) {
          value = new LoDash(value);
          value._chain = true;
        }
        return value;
      };
    }
  );

  // add all accessor Array functions to the wrapper.
  forEach(["concat", "join", "slice"], function (methodName) {
    var func = ArrayProto[methodName];

    LoDash.prototype[methodName] = function () {
      var value = this._wrapped,
        result = func.apply(value, arguments);

      if (this._chain) {
        result = new LoDash(result);
        result._chain = true;
      }
      return result;
    };
  });

  /*--------------------------------------------------------------------------*/

  // expose Lo-Dash
  // some AMD build optimizers, like r.js, check for specific condition patterns like the following:
  if (
    typeof define == "function" &&
    typeof define.amd == "object" &&
    define.amd
  ) {
    // Expose Lo-Dash to the global object even when an AMD loader is present in
    // case Lo-Dash was injected by a third-party script and not intended to be
    // loaded as a module. The global assignment can be reverted in the Lo-Dash
    // module via its `noConflict()` method.
    window._ = lodash;

    // define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module
    define(function () {
      return lodash;
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports) {
    // in Node.js or RingoJS v0.8.0+
    if (typeof module == "object" && module && module.exports == freeExports) {
      (module.exports = lodash)._ = lodash;
    }
    // in Narwhal or RingoJS v0.7.0-
    else {
      freeExports._ = lodash;
    }
  } else {
    // in a browser or Rhino
    window._ = lodash;
  }
})(this);
