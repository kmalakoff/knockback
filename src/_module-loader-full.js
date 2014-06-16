/*
  knockback.js 0.18.6 (full version)
  (c) 2011-2013 Kevin Malakoff - http://kmalakoff.github.com/knockback/
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
*/
(function() {
  return (function(factory) {
    if (typeof define == 'function' && define.amd) {
      define(['require', 'underscore', 'backbone', 'knockout'], factory);
    } else if (typeof exports == 'object') {
      module.exports = module.exports = factory.call(this, require);
    } else {
      this.kb = factory.call(this, (typeof require !== 'undefined') ? require : undefined);
    }
  })(function(require) {'__REPLACE__'; return kb;});
}).call(this);
