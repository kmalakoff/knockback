###
  knockback.js 0.20.5
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
###

{_} = require '../kb'

# @nodoc
module.exports = wrappedDestroy = (obj) ->
  return unless obj.__kb
  obj.__kb.event_watcher.releaseCallbacks(obj) if obj.__kb.event_watcher

  __kb = obj.__kb; obj.__kb = null # clear now to break cycles

  if __kb.observable
    __kb.observable.destroy = __kb.observable.release = null
    wrappedDestroy(__kb.observable)
    __kb.observable = null

  __kb.factory = null

  __kb.event_watcher.destroy() if __kb.event_watcher_is_owned # release the event_watcher
  __kb.event_watcher = null

  __kb.store.destroy() if __kb.store_is_owned # release the store
  __kb.store = null
  if __kb.stores_references
    while store_references = __kb.stores_references.pop()
      store_references.store.release(obj) unless store_references.store.__kb_released
  return
