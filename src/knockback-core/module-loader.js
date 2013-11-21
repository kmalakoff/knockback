/*
  knockback-core.js 0.18.0
  (c) 2011-2013 Kevin Malakoff - http://kmalakoff.github.com/knockback/
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
*/
(function() {
  return (function(factory) {
    // AMD
    if (typeof define === 'function' && define.amd) {
      return define(['require', 'underscore', 'backbone', 'knockout'], factory);
    }
    // CommonJS/NodeJS or No Loader
    else {
      var req = (typeof require !== "undefined") ? require : undefined;
      return factory.call(this, req);
    }
  })(function(require) {'__REPLACE__'; return kb;});
}).call(this);
