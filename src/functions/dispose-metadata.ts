import type { KBMetadata } from '../types.ts';

interface KBObject {
  __kb?: KBMetadata | null;
}

// Clean up all kb metadata on an object
export default function disposeMetadata(obj: KBObject): void {
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
    const obs = __kb.observable as unknown as Record<string, unknown>;
    obs.dispose = undefined;
    obs.release = undefined;
    disposeMetadata(__kb.observable as unknown as KBObject);
    __kb.observable = undefined;
  }

  // Clear factory
  __kb.factory = undefined;

  // Release owned event watcher
  if (__kb.event_watcher_is_owned && __kb.event_watcher) {
    __kb.event_watcher.dispose();
  }
  __kb.event_watcher = undefined;

  // Release owned store
  if (__kb.store_is_owned && __kb.store) {
    __kb.store.dispose();
  }
  __kb.store = undefined;

  // Release store references
  if (__kb.stores_references) {
    for (let storeRef = __kb.stores_references.pop(); storeRef; storeRef = __kb.stores_references.pop()) {
      if (!storeRef.store.__kb_released) {
        storeRef.store.release(obj);
      }
    }
  }
}
