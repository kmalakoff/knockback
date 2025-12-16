import type { KBMetadata, KBObservable, StoreReference } from '../types.ts';

interface KBObject {
  __kb?: KBMetadata | null;
}

// Clean up all kb metadata on an object
export default function wrappedDestroy(obj: KBObject): void {
  if (!obj.__kb) return;

  // Release event watcher callbacks
  if (obj.__kb.event_watcher) {
    obj.__kb.event_watcher.releaseCallbacks(obj);
  }

  // Clear reference to break cycles
  const __kb = obj.__kb;
  obj.__kb = null;

  // Clean up nested observable
  if (__kb.observable) {
    const obs = __kb.observable as KBObservable;
    obs.destroy = undefined;
    obs.release = undefined;
    wrappedDestroy(__kb.observable as unknown as KBObject);
    __kb.observable = undefined;
  }

  // Clear factory
  __kb.factory = undefined;

  // Release owned event watcher
  if (__kb.event_watcher_is_owned && __kb.event_watcher) {
    __kb.event_watcher.destroy();
  }
  __kb.event_watcher = undefined;

  // Release owned store
  if (__kb.store_is_owned && __kb.store) {
    __kb.store.destroy();
  }
  __kb.store = undefined;

  // Release store references
  if (__kb.stores_references) {
    let storeRef: StoreReference | undefined;
    while ((storeRef = __kb.stores_references.pop())) {
      if (!storeRef.store.__kb_released) {
        storeRef.store.release(obj);
      }
    }
  }
}
