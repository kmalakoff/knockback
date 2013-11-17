/*
  knockback-examples-localization.js 0.17.3
  (c) 2011-2013 Kevin Malakoff - http://kmalakoff.github.com/knockback/
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
*/
(function() {
  return (function(factory) {
    // AMD
    if (typeof define === 'function' && define.amd) {
      var module_name = 'knockback-localization';
      if (require.toUrl(module_name).split('./..').length === 1)
        module_name = 'knockback';
      return define(['underscore', 'backbone', 'knockout', module_name], factory);
    }
    // CommonJS/NodeJS or No Loader
    else {
      return factory.call(this);
    }
  })(function() {'__REPLACE__'; return kb;});
}).call(this);