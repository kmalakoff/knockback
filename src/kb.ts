import Backbone from 'backbone';
import ko from 'knockout';
import { KB_DISPOSE_STATE } from './constants.ts';
import { MissingPropertyError, UnexpectedValueError } from './errors/index.ts';
import type { Statistics } from './statistics.ts';
import type { KBSettings, LocaleManager } from './types.ts';

// Get global window object (works in browser and Node)
const globalWindow: (Window & typeof globalThis) | undefined = typeof window !== 'undefined' ? window : undefined;

// Extended Knockout types for internal APIs
interface KoExtended {
  dependencyDetection?: {
    ignore: <T>(callback: () => T, callbackTarget?: unknown, callbackArgs?: unknown[]) => T;
  };
  storedBindingContextForNode?: (node: Node, context: unknown) => void;
}

// Statistics type (avoiding circular import)
export interface StatisticsLike {
  register: (name: string, obj: unknown) => void;
  unregister: (name: string, obj: unknown) => void;
  addModelEvent: (event: unknown) => void;
}

// =============================================================================
// Constants and settings
// =============================================================================

/** Knockback library semantic version */
export const VERSION = '2.0.0';

/** Global settings for Knockback */
export const settings: KBSettings = {};

/** Locale manager for localized observables (internal storage) */
let _locale_manager: LocaleManager | null = null;

/** Statistics tracker for debugging/testing (internal storage) */
let _statistics: Statistics | null = null;

/** Get locale manager */
export function getLocaleManager<T extends LocaleManager = LocaleManager>(): T | null {
  return _locale_manager as T | null;
}

/** Set locale manager */
export function setLocaleManager<T extends LocaleManager>(manager: T | null): void {
  _locale_manager = manager;
}

/** Get statistics */
export function getStatistics(): Statistics | null {
  return _statistics;
}

/** Set statistics */
export function setStatistics(stats: Statistics | null): void {
  _statistics = stats;
}

// =============================================================================
// Helper functions
// =============================================================================

/** Helper to ignore dependencies in a function */
export const ignore: <T>(callback: () => T, callbackTarget?: unknown, callbackArgs?: unknown[]) => T =
  (ko as unknown as KoExtended).dependencyDetection?.ignore ||
  (<T>(callback: () => T, callbackTarget?: unknown, callbackArgs?: unknown[]): T => {
    let value: T = null as T;
    ko.computed(() => {
      value = callback.apply(callbackTarget, callbackArgs || []);
    }).dispose();
    return value;
  });

/** Peek at observable value without creating dependency */
export function peek<T>(obs: T | ko.Observable<T>): T {
  if (!ko.isObservable(obs)) return obs as T;
  const observable = obs as ko.Observable<T> & { peek?: () => T };
  if (observable.peek) return observable.peek();
  return ignore(() => observable()) as T;
}

// =============================================================================
// Type guards
// =============================================================================

/** Check if object is a Backbone Model */
export function isModel(obj: unknown): obj is Backbone.Model {
  if (!obj) return false;
  if (obj instanceof Backbone.Model) return true;
  const model = obj as Record<string, unknown>;
  return typeof model.get === 'function' && typeof model.bind === 'function';
}

/** Check if object is a Backbone Collection */
export function isCollection(obj: unknown): obj is Backbone.Collection {
  return obj instanceof Backbone.Collection;
}

/** Check if object is a Knockback ViewModel */
export function isViewModel(obj: unknown): boolean {
  return !!(obj && (obj as { __kb_is_vm?: boolean }).__kb_is_vm);
}

// =============================================================================
// Memory management
// =============================================================================

/** Checks if an object has been disposed (internal) */
export function wasReleased(obj: unknown): boolean {
  if (!obj) return true;
  const disposable = obj as { __kb_dispose?: number };
  // Check if disposing or disposed (state >= 1)
  return disposable.__kb_dispose !== undefined && disposable.__kb_dispose >= 1;
}

/** Checks if an object can be disposed */
export function isReleaseable(obj: unknown): boolean {
  return !!obj && (ko.isSubscribable(obj) || typeof (obj as { dispose?: () => void }).dispose === 'function');
}

/**
 * Internal helper: Traverse object properties and dispose Knockback children
 * @private
 */
function _traverseAndDisposeChildren(obj: unknown): void {
  if (!obj || obj !== Object(obj)) return;

  // Handle arrays
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const value = obj[i];
      if (isReleaseable(value)) {
        obj[i] = null;
        (value as { dispose?: () => void }).dispose?.();
      }
    }
    return;
  }

  // Handle plain objects - dispose enumerable properties
  for (const key in obj as Record<string, unknown>) {
    if (key === '__kb' || key === '__kb_dispose') continue;

    const value = (obj as Record<string, unknown>)[key];

    // Dispose arrays of disposables
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        if (isReleaseable(item)) {
          value[i] = null;
          (item as { dispose?: () => void }).dispose?.();
        }
      }
      continue;
    }

    // Dispose single disposable property
    if (isReleaseable(value)) {
      (obj as Record<string, unknown>)[key] = null;
      (value as { dispose?: () => void }).dispose?.();
    }
  }
}

/**
 * Dispose an object and all its Knockback children.
 *
 * Handles multiple cases automatically:
 * - Objects with dispose(): Calls it, prevents infinite loops
 * - Plain objects: Traverses and disposes all disposable properties
 * - Already disposing/disposed: Returns immediately (re-entry protection)
 *
 * Uses a single __kb_dispose property with 3 states:
 * - 0 (ACTIVE): Not disposed, will begin disposal
 * - 1 (DISPOSING): Currently disposing, prevents re-entry
 * - 2 (DISPOSED): Disposal complete, prevents double-disposal
 *
 * @param obj - The object to dispose
 *
 * @example
 * // Case 1: Object with custom dispose
 * class MyViewModel {
 *   people = kb.collectionObservable(collection);
 *
 *   dispose() {
 *     kb.dispose(this);  // Safe - won't infinite loop
 *     console.log('cleaned up');
 *   }
 * }
 * kb.dispose(vm);
 *
 * @example
 * // Case 2: Plain object
 * const vm = {
 *   name: kb.observable(model, 'name'),
 *   people: kb.collectionObservable(collection)
 * };
 * kb.dispose(vm);  // Traverses and disposes name & people
 *
 * @example
 * // Case 3: Manual disposal (most efficient)
 * class MyViewModel {
 *   people = kb.collectionObservable(collection);
 *
 *   dispose() {
 *     this.people.dispose();  // Targeted, no traversal
 *   }
 * }
 */
export function dispose(obj: unknown): void {
  if (!obj) return;

  const disposable = obj as {
    dispose?: () => void;
    __kb_dispose?: number;
  };

  // Already disposing or disposed - prevent re-entry and double-disposal
  if (disposable.__kb_dispose && disposable.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) {
    return;
  }

  // Mark as disposing (prevents infinite loop if dispose() calls kb.dispose(this))
  disposable.__kb_dispose = KB_DISPOSE_STATE.DISPOSING;

  try {
    // If object has dispose() method, call it
    if (typeof disposable.dispose === 'function') {
      disposable.dispose();
      // dispose() should handle cleanup
      // If it called kb.dispose(this), the state flag prevented re-entry
    }

    // Always traverse children (safe because children check their own state)
    _traverseAndDisposeChildren(obj);
  } finally {
    // Mark as fully disposed
    disposable.__kb_dispose = KB_DISPOSE_STATE.DISPOSED;
  }
}

/** Binds a callback to the node that disposes the view model when the node is removed */
export function releaseOnNodeRemove(viewModel: unknown, node: Node): void {
  if (!viewModel) _throwUnexpected('kb', 'missing view model');
  if (!node) _throwUnexpected('kb', 'missing node');
  ko.utils.domNodeDisposal.addDisposeCallback(node, () => {
    (viewModel as { dispose?: () => void }).dispose?.();
  });
}

// =============================================================================
// DOM utilities
// =============================================================================

/** Renders a template and binds automatic disposal */
export function renderTemplate(template: string, viewModel: { afterRender?: (el: Element) => void }, options: { afterRender?: () => void } = {}): Element | null {
  if (!globalWindow?.document) {
    console?.log?.('renderTemplate: document is undefined');
    return null;
  }
  const doc = globalWindow.document;

  let el: Element = doc.createElement('div');
  const observable = ko.renderTemplate(template, viewModel, options, el, 'replaceChildren');

  if (el.childNodes.length === 1) {
    el = el.childNodes[0] as Element;
  } else if (el.childNodes.length) {
    const koExt = ko as unknown as KoExtended;
    for (let i = 0; i < el.childNodes.length; i++) {
      try {
        koExt.storedBindingContextForNode?.(el, ko.contextFor(el.childNodes[i] as Element));
        break;
      } catch {
        // Ignore errors
      }
    }
  }

  releaseOnNodeRemove(viewModel, el);
  observable.dispose();

  if (viewModel.afterRender && !options.afterRender) {
    viewModel.afterRender(el);
  }

  return el;
}

/** Applies bindings and binds automatic disposal */
export function applyBindings(viewModel: unknown, node: Element | NodeList | HTMLCollection): Element {
  // Convert NodeList/HTMLCollection to root element
  if ('length' in node) {
    if (!globalWindow?.document) {
      throw new UnexpectedValueError('applyBindings', 'document is undefined');
    }
    const doc = globalWindow.document;
    const children = Array.from(node as NodeList);
    node = doc.createElement('div');
    for (const child of children) {
      (node as Element).appendChild(child);
    }
  }

  ko.applyBindings(viewModel, node as Element);
  releaseOnNodeRemove(viewModel, node as Element);
  return node as Element;
}

// =============================================================================
// Model accessors
// =============================================================================

/** Get value from model */
export function getValue(model: Backbone.Model | null, key: string, args?: unknown[]): unknown {
  if (!model) return undefined;

  // Check if ORM wants to use a function (for Backbone ORMs with custom accessors)
  const modelWithDynamicProps = model as unknown as Record<string, unknown>;
  const prop = modelWithDynamicProps[key];
  if (typeof prop === 'function' && settings.orm?.useFunction?.(model, key)) {
    return (prop as () => unknown)();
  }

  if (!args) {
    return model.get(key);
  }

  const allArgs = [key, ...args].map((value) => peek(value));
  return (model.get as (...args: unknown[]) => unknown).apply(model, allArgs);
}

/** Set value on model */
export function setValue(model: Backbone.Model | null, key: string, value: unknown): void {
  if (!model) return;

  // Check if ORM wants to use a function (for Backbone ORMs with custom accessors)
  const modelWithDynamicProps = model as unknown as Record<string, unknown>;
  const prop = modelWithDynamicProps[key];
  if (typeof prop === 'function' && settings.orm?.useFunction?.(model, key)) {
    (prop as (val: unknown) => void)(value);
    return;
  }

  model.set({ [key]: value });
}

// =============================================================================
// Error helpers (internal)
// =============================================================================

/** @internal Throw error for missing parameter */
export function _throwMissing(instance: string | { constructor: { name: string } }, message: string): never {
  const name = typeof instance === 'string' ? instance : instance.constructor.name;
  throw new MissingPropertyError(name, message);
}

/** @internal Throw error for unexpected value */
export function _throwUnexpected(instance: string | { constructor: { name: string } }, message: string): never {
  const name = typeof instance === 'string' ? instance : instance.constructor.name;
  throw new UnexpectedValueError(name, message);
}

// =============================================================================
// Utility functions (internal)
// =============================================================================

/** @internal Publish methods from instance to observable */
export function publishMethods<T extends object, S extends object, K extends readonly (keyof S)[]>(observable: T, instance: S, methods: K): void {
  for (const fn of methods) {
    const key = fn as keyof S;
    (observable as Record<string, unknown>)[fn as string] = (instance[key] as (...args: unknown[]) => unknown).bind(instance);
  }
}
