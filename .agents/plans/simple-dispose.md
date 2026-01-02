# Simple Dispose Plan (Knockback V2)

## Goal
Automate disposal of Knockback graphs by reusing Knockout’s lifecycle mechanisms so users only need `dispose()`. Remove `destroy` and remove `kb.release` from the public API. Keep a small public wrapper for KO DOM disposal (`kb.releaseOnNodeRemove`) as a convenience only.

## Inventory: Creation Patterns We Must Support

### 1) ViewModel creation
- `kb.viewModel(model, options)` (factory)
- `new kb.ViewModel(model, options)` (class)
- `kb.viewModel(model, { keys, factories, mappings, extend })`
- `kb.viewModel` used with `extend` returning object, or mutating `vm`.
- ViewModel created inside other view models / collection observables.

### 2) Observable creation (model-bound)
- `kb.observable(model, key | options)`
- `kb.observable(model, options, viewModel?)` (binds to a VM for dependency cleanup)

### 3) Collection observable creation
- `kb.collectionObservable(collection, options)`
- `kb.collectionObservable(collection, { view_model: { create } })`
- `kb.collectionObservable(collection, { view_model: { constructor } })`

### 4) Plugins / extensions
- `kb.defaultObservable(...)`
- `kb.formattedObservable(...)`
- `kb.localizedObservable(...)`
- `kb.triggeredObservable(...)`
- (potential future plugins should follow the same disposal contract)

### 5) Store / TypedValue / internal helpers
- `kb.Store` caches VMs/observables and has its own release rules.
- `TypedValue` wraps/normalizes values and retains/replaces nested objects.
- `EventWatcher` binds/unbinds model/collection events.

### 6) DOM binding + rendering
- `kb.applyBindings(viewModel, node)`
- `kb.renderTemplate(template, viewModel, options)`
- Knockout component `createViewModel` or `viewModel` factory

## Inventory: Disposal Primitives We Must Handle

### Public disposal surface target
- `obj.dispose()` — attached via `utils.attachDispose()` for KB objects
- `kb.releaseOnNodeRemove(viewModel, node)` — thin wrapper around KO’s `domNodeDisposal.addDisposeCallback`

### Internal disposal surfaces
- `viewModel.dispose()` (currently calls `kb.releaseKeys`)
- `observable.dispose()` (releases model/value, watchers)
- `collectionObservable.dispose()` (releases mapper, collection, filters, VMs)
- plugin observables `dispose()`
- `Store.release` / `Store.destroy`
- `EventWatcher.destroy`
- `TypedValue.destroy`

## Current Behavior (Baseline)

### Automatic disposal that already exists
- `kb.applyBindings` and `kb.renderTemplate` call `kb.releaseOnNodeRemove` for the root VM.
- `releaseOnNodeRemove` uses `ko.utils.domNodeDisposal.addDisposeCallback`.
- KB factory observables attach `dispose()`.

### Manual disposal required today
- Any VM/observable created without DOM attachment needs explicit `dispose()`.
- KO component VMs created by `createViewModel` are not automatically released unless the root VM defines `dispose()` that handles nested KB objects.
- Nested VMs inside collections are released when parent collection observable is disposed.

## Knockout Lifecycle Hooks We Can Reuse

### Knockout DOM disposal
- `ko.utils.domNodeDisposal.addDisposeCallback(node, callback)`
- KO automatically calls `dispose` on a component VM if it defines `dispose` (or via KO component lifecycle).
- KO cleans bindings and subscriptions on node removal.

### Knockout computed/subscriptions
- `ko.computed` / `ko.pureComputed` return disposables; KO only auto-disposes when tied to node lifecycles or when user calls `.dispose()`.

## Proposed Automation Strategy (Single V2 Direction)
1) Remove public `kb.release` and all `destroy()` APIs.
2) Every KB-created object implements `dispose()`.
3) Ownership-driven disposal: each object disposes only what it created/owns, tracked in its internal `__kb` metadata.
4) KO DOM lifecycle triggers disposal only for root VMs; nested KB objects must be disposed by the root VM’s `dispose()`.
5) Keep `kb.releaseOnNodeRemove` as a small public convenience wrapper for KO’s DOM disposal callback.

## Required Changes (if we proceed)

### API surface
- Remove `kb.release` from public API.
- Keep `kb.releaseOnNodeRemove` as a public wrapper for KO DOM disposal (no `kb.release` usage).
- Replace `destroy()` with `dispose()` for Store/EventWatcher/TypedValue and internal helpers.
- Ensure all KB factory objects attach `dispose`.

### Docs
- Explain that KO component lifecycle will call `dispose()` only on the root VM; nested KB objects must be disposed by the root.
- Prefer KO lifecycle usage; document when manual `dispose()` is required (headless, long-lived VMs).

### Tests
- Ensure double-dispose safety (idempotent).
- Verify root VM dispose cascades to owned KB objects.

## Audit Notes
- Confirm no internal KB primitives require special opt-out from transitive disposal; current ownership tracking via `__kb` should remain the guardrail.
