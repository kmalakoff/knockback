# Simple Dispose Plan V2 (Knockback V2)

## Goal

Automate and simplify disposal of Knockback graphs by:
1. Converging on `dispose()` as the **only public disposal API**
2. Removing `destroy` terminology entirely (use `dispose` everywhere)
3. **Removing `kb.release` from public API** — use `obj.dispose()` directly instead
4. **Disposable-property cleanup** — ViewModel disposal walks attached disposable properties (KB + KO) for automatic cleanup
5. Keeping `kb.releaseOnNodeRemove` as the only public helper for DOM lifecycle
6. Establishing a clear **Internal vs Public API** boundary

---

## Corrections (Based on Review Feedback)

> [!IMPORTANT]
> The original V2 plan had two correctness issues that have been addressed:

### Issue 1: `utils.release` was unsafe

The original plan's `utils.release` set `__kb_released = true` **before** calling `dispose()`. This breaks disposal because `dispose()` uses that flag as its idempotency guard — cleanup would never run.

**Resolution:** Drop `utils.release` entirely. Call `obj?.dispose()` inline wherever needed. Use a minimal `disposeArray()` helper only for array cleanup.

### Issue 2: `releaseKeys` walked arbitrary properties

The original behavior walked **all enumerable keys** on objects, which could dispose things the VM didn't create (user-added observables). However, users commonly attach `kb.observable` or `ko.computed` to a view model and expect automatic cleanup.

**Resolution:** Replace strict ownership with **disposable-property cleanup**: ViewModel disposal will dispose attached properties that are disposable (KB objects or KO subscribables). This preserves automatic cleanup without requiring the clunky ownership parameter, while keeping idempotency. Shared lifetime remains the same as V1: if two VMs share a disposable, disposing one disposes the shared object.

---

## Internal vs Public API

### Public API (exported from `index.ts`)

| API | Description |
|-----|-------------|
| `obj.dispose()` | Every KB object (ViewModel, Observable, CollectionObservable, plugins) |
| `kb.releaseOnNodeRemove(vm, node)` | Convenience wrapper for KO DOM disposal |
| `kb.applyBindings(vm, node)` | Apply bindings + auto-register for node removal |
| `kb.renderTemplate(template, vm, options)` | Render template + auto-register for node removal |
| `kb.wasReleased(obj)` | Check if object was already disposed |
| `kb.isReleaseable(obj)` | Check if object can be disposed (has dispose method) |

### Internal API (in `utils.ts`, not exported)

| API | Description |
|-----|-------------|
| `utils.disposeDisposableKeys(vm)` | Dispose attached disposable properties on a ViewModel (KB + KO) |
| `utils.disposeMetadata(obj)` | Clean up `__kb` metadata (renamed from `wrappedDestroy`) |
| `utils.disposeArray(arr)` | Dispose all items in an array (minimal helper) |
| `utils.attachDispose(obj, fn)` | Attach `dispose` to an object |

> [!NOTE]
> **`utils.release` is intentionally NOT included.** Call `obj?.dispose()` inline instead.

### Internal Classes (not exported, use `dispose()` method)

| Class | Purpose |
|-------|---------|
| `Store` | VM/Observable cache with reference counting |
| `EventWatcher` | Aggregates model events for efficient handling |
| `TypedValue` | Manages typed observable values |
| `Factory` | Creates VMs/observables based on path mappings |

---

## Standard `dispose()` Template

All KB objects **must** follow this pattern:

```typescript
dispose(): void {
  // 1. Idempotency guard - prevent double disposal
  if (this.__kb_released) return;
  this.__kb_released = true;

  // 2. Object-specific cleanup
  //    - Unsubscribe from events (model.off, observable.dispose)
  //    - Clear computed observables
  //    - Release owned children (call child?.dispose() directly)

  // 3. Dispose attached disposable properties (ViewModels only)
  utils.disposeDisposableKeys(this);

  // 4. Clean up __kb metadata
  utils.disposeMetadata(this);

  // 5. Unregister from statistics (if applicable)
  kb.statistics?.unregister('ClassName', this);
}
```


---

## Detailed Changes

### 1. Rename `wrappedDestroy` → `disposeMetadata`

**File:** `src/functions/wrapped-destroy.ts` → `src/functions/dispose-metadata.ts`

**Before:**
```typescript
export default function wrappedDestroy(obj: KBObject): void { ... }
```

**After:**
```typescript
export default function disposeMetadata(obj: KBObject): void { ... }
```

**Changes inside the function:**
- Line 39: `__kb.event_watcher.destroy()` → `__kb.event_watcher.dispose()`
- Line 45: `__kb.store.destroy()` → `__kb.store.dispose()`

**Update imports in:**
- `utils.ts` (line 6)
- All files using `utils.wrappedDestroy()` → `utils.disposeMetadata()`

---

### 2. Remove `kb.release` and `kb.releaseKeys` — Add New Internal Helpers

> [!CAUTION]
> **Do NOT create a `utils.release` function.** The original proposal was unsafe.

**Remove from `kb.ts`:**
- `release()` function (lines 86-155)
- `releaseKeys()` function (lines 157-166)
- `LIFECYCLE_METHODS` constant (line 6)

**Remove from `index.ts`:**
- `export const release = kbCore.release.bind(kbCore);` (line 31)
- `release` from the `kb` namespace object (line 149)

**Add to `utils.ts`:**

```typescript
/**
 * Dispose all items in an array (minimal helper for collection cleanup)
 * @internal
 */
export function disposeArray(arr: unknown[]): void {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item && typeof (item as any).dispose === 'function') {
      arr[i] = null;
      (item as any).dispose();
    }
  }
}

/**
 * Dispose attached disposable properties on a ViewModel (KB + KO).
 * Only touches values that expose dispose or are disposable arrays.
 * @internal
 */
export function disposeDisposableKeys(vm: Record<string, unknown>): void {
  for (const key of Object.keys(vm)) {
    if (key === '__kb') continue;
    const value = vm[key];
    if (Array.isArray(value)) {
      disposeArray(value);
      continue;
    }
    if (isDisposable(value)) {
      vm[key] = null;
      const disposable = value as { dispose?: () => void; [key: symbol]: unknown };
      disposable.dispose?.();
    }
  }
}

/**
 * Checks if an object can be disposed (has dispose method)
 * @internal
 */
export function isDisposable(obj: unknown): boolean {
  if (!obj || obj !== Object(obj) || (obj as any).__kb_released) {
    return false;
  }
  if (typeof (obj as any).dispose === 'function') return true;
  const disposeSymbol = (Symbol as any).dispose;
  if (disposeSymbol && typeof (obj as any)[disposeSymbol] === 'function') {
    return true;
  }
  return false;
}
```

**Inline disposal pattern (replace `kb.release(x)` calls):**

```typescript
// OLD:
kb.release(observable);

// NEW:
observable?.dispose?.();
```


**Update `kb.ts`:**
- Keep `isReleaseable` (simple check for dispose method, unchanged logic)
- Keep `wasReleased` (simple check, no change needed)
- Update `releaseOnNodeRemove` to call `dispose()` directly:
  ```typescript
  releaseOnNodeRemove(view_model: unknown, node: Node): void {
    if (!view_model) kb._throwUnexpected('kb', 'missing view model');
    if (!node) kb._throwUnexpected('kb', 'missing node');
    ko.utils.domNodeDisposal.addDisposeCallback(node, () => {
      (view_model as any)?.dispose?.();
    });
  }
  ```

---

### 3. Rename `destroy()` → `dispose()` on Internal Classes

**Store (`src/store.ts`):**
```diff
- destroy(): void {
+ dispose(): void {
    this.__kb_released = true;
    this.clear();
    const index = Store.instances.indexOf(this);
    if (index >= 0) {
      Store.instances.splice(index, 1);
    }
  }
```

**EventWatcher (`src/event-watcher.ts`):**
```diff
- destroy(): void {
+ dispose(): void {
    this.emitter(null);
    this.__kb.callbacks = null;
-   utils.wrappedDestroy(this);
+   utils.disposeMetadata(this);
  }
```

**TypedValue (`src/typed-value.ts`):**
```diff
- destroy(): void {
+ dispose(): void {
    this.__kb_released = true;
    // ... rest unchanged
  }
```

---

### 4. Update `index.ts` Exports

**Remove:**
```diff
- export const release = kbCore.release.bind(kbCore);
```

**Keep:**
```typescript
export const releaseOnNodeRemove = kbCore.releaseOnNodeRemove.bind(kbCore);
export const wasReleased = kbCore.wasReleased.bind(kbCore);
export const isReleaseable = kbCore.isReleaseable.bind(kbCore);  // Calls utils internally
```

**Remove from `kb` namespace object:**
```diff
  const kb = {
    // ...
-   release,
    releaseOnNodeRemove,
    // ...
  };
```

---

### 5. Update All Internal Usages

**Files calling `kb.release()` → replace with inline `?.dispose?.()`:**
- `src/store.ts` (lines 161, 178) → `observable?.dispose?.()`
- `src/collection-observable.ts` (line 277) → `utils.disposeArray(_filters())`
- `src/typed-value.ts` (lines 33, 206) → `previousValue?.dispose?.()`
- `src/kb.ts` (lines 97, 118, 163, 172) → Remove entirely (no more `kb.release`)

**Files calling `kb.releaseKeys()` → replace with `utils.disposeDisposableKeys()`:**
- `src/view-model.ts` (line 252) → `utils.disposeDisposableKeys(this)`

> [!NOTE]
> `kb.releaseKeys` is no longer needed in `kb.ts` since it was only used by the now-removed `kb.release` function.

**Files calling `utils.wrappedDestroy()` → replace with `utils.disposeMetadata()`:**
- `src/view-model.ts` (line 253) → `utils.disposeMetadata()`
- `src/observable.ts` (line 214) → `utils.disposeMetadata()`
- `src/collection-observable.ts` (line 282) → `utils.disposeMetadata()`
- `src/event-watcher.ts` (line 60) → `utils.disposeMetadata()`
- `src/plugins/defaults/default-observable.ts` (line 72) → `utils.disposeMetadata()`
- `src/plugins/formatting/formatted-observable.ts` (line 164) → `utils.disposeMetadata()`
- `src/plugins/localization/localized-observable.ts` (line 152) → `utils.disposeMetadata()`
- `src/plugins/triggering/triggered-observable.ts` (line 73) → `utils.disposeMetadata()`

---

### 6. Update Type Definitions

**`src/types.ts`:**
```diff
  export interface Store {
-   destroy(): void;
+   dispose(): void;
    // ...
  }

  export interface EventWatcher {
-   destroy(): void;
+   dispose(): void;
    // ...
  }
```

---

## Testing Changes

Testing plan: update existing tests, then add the new cases below (including disposable-property cleanup).

### 1. Update Existing Tests

**Search and replace in test files:**
- `kb.release(` → `obj.dispose()` or verify dispose was called
- `.destroy()` → `.dispose()` for Store/EventWatcher/TypedValue

### 2. New Test Cases Required

#### A. Idempotency Tests
```typescript
describe('dispose idempotency', () => {
  it('should be safe to call dispose() multiple times on ViewModel', () => {
    const vm = kb.viewModel(new Backbone.Model({ name: 'test' }));
    vm.dispose();
    vm.dispose(); // Should not throw
    expect(kb.wasReleased(vm)).toBe(true);
  });

  it('should be safe to call dispose() multiple times on Observable', () => {
    const obs = kb.observable(new Backbone.Model({ name: 'test' }), 'name');
    obs.dispose();
    obs.dispose(); // Should not throw
  });

  it('should be safe to call dispose() multiple times on CollectionObservable', () => {
    const co = kb.collectionObservable(new Backbone.Collection());
    co.dispose();
    co.dispose(); // Should not throw
  });
});
```

#### B. Cascade Disposal Tests
```typescript
describe('cascade disposal', () => {
  it('ViewModel.dispose() should dispose all KB-created observables', () => {
    const model = new Backbone.Model({ name: 'test', age: 25 });
    const vm = kb.viewModel(model);
    
    const nameObs = vm.name;
    const ageObs = vm.age;
    
    vm.dispose();
    
    expect(kb.wasReleased(vm)).toBe(true);
    expect(kb.wasReleased(nameObs)).toBe(true);
    expect(kb.wasReleased(ageObs)).toBe(true);
  });

  it('CollectionObservable.dispose() should dispose all child ViewModels', () => {
    const collection = new Backbone.Collection([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]);
    const co = kb.collectionObservable(collection);
    const vms = co();
    
    co.dispose();
    
    expect(kb.wasReleased(co)).toBe(true);
    for (const vm of vms) {
      expect(kb.wasReleased(vm)).toBe(true);
    }
  });
});
```

#### B2. Disposable Property Cleanup Tests (NEW)
```typescript
describe('disposable property cleanup', () => {
  it('ViewModel.dispose() should dispose user-added kb.observable', () => {
    const model = new Backbone.Model({ name: 'test' });
    const vm = kb.viewModel(model);

    vm.customObs = kb.observable(model, 'name');

    vm.dispose();

    expect(kb.wasReleased(vm)).toBe(true);
    expect(kb.wasReleased(vm.customObs)).toBe(true);
  });

  it('ViewModel.dispose() should dispose user-added ko.computed', () => {
    const model = new Backbone.Model({ name: 'test', age: 25 });
    const vm = kb.viewModel(model, { keys: ['name', 'age'] });

    vm.userComputed = ko.computed(() => `${vm.name()}-${vm.age()}`);

    vm.dispose();

    expect(vm.userComputed.isDisposed).toBe(true);
  });

  it('ViewModel.dispose() should dispose arrays of disposables', () => {
    const model = new Backbone.Model({ name: 'test' });
    const vm = kb.viewModel(model);
    const obs1 = kb.observable(model, 'name');
    const obs2 = kb.observable(model, 'name');

    vm.list = [obs1, obs2];

    vm.dispose();

    expect(kb.wasReleased(obs1)).toBe(true);
    expect(kb.wasReleased(obs2)).toBe(true);
  });

  it('Shared disposable is disposed once (shared lifetime)', () => {
    const model = new Backbone.Model({ name: 'test' });
    const shared = kb.observable(model, 'name');

    const vm1 = kb.viewModel(model);
    const vm2 = kb.viewModel(model);
    vm1.shared = shared;
    vm2.shared = shared;

    vm1.dispose();
    expect(kb.wasReleased(shared)).toBe(true);

    // Disposing again should be idempotent
    expect(() => vm2.dispose()).not.toThrow();
  });
});
```

## Edge Cases (Document + Test)

- Shared disposables across VMs: disposed once; other VM must treat it as invalid after the first dispose.
- User-attached KO computeds/subscriptions: should be disposed automatically when attached to VM.
- Arrays of disposables attached to a VM: should be disposed automatically.
- Non-enumerable properties are not auto-disposed; document this explicitly.
- Root VM disposal is automatic only when KO owns the lifecycle (components/DOM removal); otherwise call `dispose()` manually.

Test coverage in this plan includes shared disposables, KO computeds, and arrays. Non-enumerable behavior is documented (not tested).


#### C. DOM Lifecycle Tests
```typescript
describe('DOM lifecycle disposal', () => {
  it('releaseOnNodeRemove should call dispose when node is removed', () => {
    const vm = kb.viewModel(new Backbone.Model({ name: 'test' }));
    const node = document.createElement('div');
    document.body.appendChild(node);
    
    kb.releaseOnNodeRemove(vm, node);
    
    expect(kb.wasReleased(vm)).toBe(false);
    
    ko.removeNode(node);
    
    expect(kb.wasReleased(vm)).toBe(true);
  });

  it('applyBindings should auto-dispose on node removal', () => {
    const vm = kb.viewModel(new Backbone.Model({ name: 'test' }));
    const node = document.createElement('div');
    node.innerHTML = '<span data-bind="text: name"></span>';
    document.body.appendChild(node);
    
    kb.applyBindings(vm, node);
    
    ko.removeNode(node);
    
    expect(kb.wasReleased(vm)).toBe(true);
  });
});
```

#### D. Store Reference Counting Tests
```typescript
describe('Store reference counting', () => {
  it('should release VM from store when disposed', () => {
    const model = new Backbone.Model({ id: 1, name: 'test' });
    const vm1 = kb.viewModel(model);
    
    const store = vm1.shareOptions().store;
    
    vm1.dispose();
    
    expect(store.find(model, vm1.constructor)).toBeNull();
  });

  it('should not release shared VM until all references disposed', () => {
    const model = new Backbone.Model({ id: 1, name: 'test' });
    const store = new Store();
    
    const vm1 = kb.viewModel(model, { store });
    const vm2 = kb.viewModel(model, { store }); // Same model, should reuse
    
    // They should be the same VM (from store)
    expect(vm1).toBe(vm2);
    
    vm1.dispose();
    expect(kb.wasReleased(vm1)).toBe(false); // Still referenced
    
    vm2.dispose();
    expect(kb.wasReleased(vm1)).toBe(true); // Now released
  });
});
```

#### E. Memory Leak Detection Tests
```typescript
describe('memory leak detection', () => {
  it('should not leak model event listeners after dispose', () => {
    const model = new Backbone.Model({ name: 'test' });
    const initialListeners = model._events?.change?.length || 0;
    
    const vm = kb.viewModel(model);
    const afterBindListeners = model._events?.change?.length || 0;
    expect(afterBindListeners).toBeGreaterThan(initialListeners);
    
    vm.dispose();
    const afterDisposeListeners = model._events?.change?.length || 0;
    expect(afterDisposeListeners).toBe(initialListeners);
  });

  it('should not leak collection event listeners after dispose', () => {
    const collection = new Backbone.Collection();
    const initialListeners = collection._events?.all?.length || 0;
    
    const co = kb.collectionObservable(collection);
    const afterBindListeners = collection._events?.all?.length || 0;
    expect(afterBindListeners).toBeGreaterThan(initialListeners);
    
    co.dispose();
    const afterDisposeListeners = collection._events?.all?.length || 0;
    expect(afterDisposeListeners).toBe(initialListeners);
  });
});
```

#### F. Component Root Disposal Tests (NEW)
```typescript
describe('component root disposal', () => {
  it('component root dispose should clean nested view models', () => {
    const model = new Backbone.Model({ name: 'test' });
    const nested = kb.viewModel(model);
    const root = {
      nested,
      dispose: () => nested.dispose(),
    };

    root.dispose();

    expect(kb.wasReleased(nested)).toBe(true);
  });
});
```

#### G. Non-enumerable Property Tests (Optional)
```typescript
describe('non-enumerable properties', () => {
  it('should not auto-dispose non-enumerable disposables', () => {
    const model = new Backbone.Model({ name: 'test' });
    const vm = kb.viewModel(model);
    const hidden = kb.observable(model, 'name');
    Object.defineProperty(vm, 'hidden', { value: hidden, enumerable: false });

    vm.dispose();

    expect(kb.wasReleased(hidden)).toBe(false);
    hidden.dispose();
    expect(kb.wasReleased(hidden)).toBe(true);
  });
});
```

---

## Migration Guide (for Users)

### Breaking Changes

1. **`kb.release()` removed** — Use `obj.dispose()` instead
   ```diff
   - kb.release(viewModel);
   + viewModel.dispose();
   ```

2. **`kb.releaseKeys()` removed** — Not needed; `dispose()` handles children

3. **Disposable property cleanup** — ViewModels dispose attached KB/KO disposables (including user-added)
   
   > [!WARNING]
   > If you manually added observables to a ViewModel, you must now dispose them yourself:
   
   ```typescript
   // OLD: kb.release would dispose vm.customObs automatically
   const vm = kb.viewModel(model);
   vm.customObs = kb.observable(model, 'custom');
   kb.release(vm);  // customObs was disposed automatically

   // NEW: You must dispose manually-added observables
   const vm = kb.viewModel(model);
   vm.customObs = kb.observable(model, 'custom');
   vm.customObs.dispose();  // Dispose manually-added first
   vm.dispose();            // Then dispose the VM
   ```

4. **Store/EventWatcher `destroy()` → `dispose()`** (internal only, shouldn't affect users)

### No Changes Required For

- `kb.releaseOnNodeRemove()` — Still works the same
- `kb.applyBindings()` — Still auto-disposes on node removal
- `kb.wasReleased()` — Still works the same

---

## Open Questions (Resolved)

1. ~~**Should `Store` be user-disposable?**~~ → Keep internal for V2
3. ~~**Should we add a `Disposable` interface/type?**~~ → Nice to have, not required for V2

---

## Implementation Order

1. **Phase 1: Rename internal functions**
   - [ ] Rename file `src/functions/wrapped-destroy.ts` → `src/functions/dispose-metadata.ts`
   - [ ] Rename function `wrappedDestroy` → `disposeMetadata`
   - [ ] Rename `destroy()` → `dispose()` on Store, EventWatcher, TypedValue
   - [ ] Update all `utils.wrappedDestroy()` calls → `utils.disposeMetadata()`

2. **Phase 2: Add new internal helpers to utils.ts**
   - [ ] Add `disposeDisposableKeys(vm)` — disposable-property cleanup
   - [ ] Add `disposeArray(arr)` — minimal array helper
   - [ ] Keep `isDisposable(obj)` check (rename from `isReleaseable` internally)

3. **Phase 3: Remove kb.release and update usages**
   - [ ] Remove `release()` and `releaseKeys()` from `kb.ts`
   - [ ] Remove `release` export from `index.ts`
   - [ ] Replace all `kb.release(x)` calls with `x?.dispose?.()`
   - [ ] Replace `kb.releaseKeys(vm)` with `utils.disposeDisposableKeys(vm)`
   - [ ] Update `releaseOnNodeRemove` to call `dispose()` directly

4. **Phase 4: Add tests**
   - [ ] Idempotency tests (double-dispose safety)
   - [ ] Cascade disposal tests (parent disposes owned children)
   - [ ] Disposable property tests (user-added disposables auto-disposed)
   - [ ] DOM lifecycle tests
   - [ ] Memory leak detection tests

5. **Phase 5: Documentation**
   - [ ] Update README with V2 dispose pattern
   - [ ] Add migration guide for breaking changes
   - [ ] Document disposable-property cleanup model
   - [ ] Update API docs
