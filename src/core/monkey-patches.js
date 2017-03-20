/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

const kb = require('./kb');

const { ko } = kb;

// Allow for dependent release until is resolved https://github.com/knockout/knockout/issues/1464
if (ko.subscribable && ko.subscribable.fn && ko.subscribable.fn.extend) {
  const _extend = ko.subscribable.fn.extend;
  ko.subscribable.fn.extend = function () {
    const target = _extend.apply(this, arguments);

    // release the extended observable
    if ((target !== this) && kb.isReleaseable(this)) {
      const _dispose = target.dispose;
      target.dispose = () => {
        if (_dispose != null) _dispose.apply(target, arguments);
        return kb.release(this);
      };
    }

    return target;
  };
}
