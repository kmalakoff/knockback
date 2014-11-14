###
  knockback.js 0.20.5
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
###

{ko} = kb = require './kb'

# Allow for dependent release until is resolved https://github.com/knockout/knockout/issues/1464
if ko.subscribable?.fn?.extend
  _extend = ko.subscribable.fn.extend
  ko.subscribable.fn.extend = ->
    target = _extend.apply(@, arguments)

    # release the extended observable
    if target isnt @ and kb.isReleaseable(@)
      _dispose = target.dispose
      target.dispose = => _dispose?.apply(target, arguments); kb.release(@)

    return target
