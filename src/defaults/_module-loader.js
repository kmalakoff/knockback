/*
  knockback-defaults.js 0.18.0
  (c) 2011-2013 Kevin Malakoff - http://kmalakoff.github.com/knockback/
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
*/
(function() {
  return (function(factory) {
    if (typeof exports == 'object') {
      module.exports = module.exports = factory.call(this, require);
    } else if (typeof define == 'function' && define.amd) {
      define(['require', 'underscore', 'backbone', 'knockout', 'knockback'], factory);
    } else {
      this.kb = factory.call(this, (typeof require !== 'undefined') ? require : undefined);
    }
  })(function(require) {'__REPLACE__'; return kb;});
}).call(this);
