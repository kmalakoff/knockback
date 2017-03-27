/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

// @nodoc
export default (obj) => {
  if (!obj.__kb) return;
  if (obj.__kb.event_watcher) obj.__kb.event_watcher.releaseCallbacks(obj);

  const { __kb } = obj;
  obj.__kb = null; // clear now to break cycles

  if (__kb.observable) {
    __kb.observable.destroy = null; __kb.observable.release = null;
    wrappedDestroy(__kb.observable); __kb.observable = null;
  }
  __kb.factory = null;

  // release the event_watcher
  if (__kb.event_watcher_is_owned) __kb.event_watcher.destroy();
  __kb.event_watcher = null;

  // release the store
  if (__kb.store_is_owned) __kb.store.destroy();
  __kb.store = null;

  if (__kb.stores_references) {
    let store_references = __kb.stores_references.pop();
    while (store_references) {
      if (!store_references.store.__kb_released) store_references.store.release(obj);
      store_references = __kb.stores_references.pop();
    }
  }
};
