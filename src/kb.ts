import Backbone from 'backbone';
import ko from 'knockout';
import _ from 'underscore';
import extend from './functions/extend.ts';
import type { KBObservable, KBSettings, ValueType } from './types.ts';
import { TYPE_ARRAY, TYPE_COLLECTION, TYPE_MODEL, TYPE_SIMPLE, TYPE_UNKNOWN } from './types.ts';

const LIFECYCLE_METHODS = ['release', 'destroy', 'dispose'] as const;

// Get global window object (works in browser and Node)
const globalWindow = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : {});

// The 'kb' namespace for classes, factory functions, constants, etc.
const kb = {
  // Knockback library semantic version
  VERSION: '2.0.0',

  // Observable storage types
  TYPE_UNKNOWN,
  TYPE_SIMPLE,
  TYPE_ARRAY,
  TYPE_MODEL,
  TYPE_COLLECTION,

  // Re-exports
  _: _,
  ko: ko,
  Backbone: Backbone,
  Collection: Backbone.Collection,
  Model: Backbone.Model,
  Events: Backbone.Events,

  // Settings
  settings: {} as KBSettings,

  // Backbone-style extend
  extend,

  // Checks if an object has been released
  wasReleased(obj: unknown): boolean {
    return !obj || (obj as { __kb_released?: boolean }).__kb_released === true;
  },

  // Checks if an object can be released
  isReleaseable(obj: unknown, depth = 0): boolean {
    // Must be an object and not already released
    if (!obj || obj !== Object(obj) || (obj as { __kb_released?: boolean }).__kb_released) {
      return false;
    }

    // Known releaseable types
    if (ko.isObservable(obj)) return true;
    if (kb.isViewModel(obj)) return true;

    // Known non-releaseable types
    if (typeof obj === 'function' || kb.isModel(obj) || kb.isCollection(obj)) {
      return false;
    }

    // Check for releaseable signature (has release/destroy/dispose method)
    for (const method of LIFECYCLE_METHODS) {
      if (typeof (obj as Record<string, unknown>)[method] === 'function') {
        return true;
      }
    }

    // Max depth check for ViewModel inside of ViewModel
    if (depth > 0) return false;

    // Check nested properties
    for (const key in obj as Record<string, unknown>) {
      if (key !== '__kb' && kb.isReleaseable((obj as Record<string, unknown>)[key], depth + 1)) {
        return true;
      }
    }

    return false;
  },

  // Releases any type of view model or observable
  release(obj: unknown): void {
    if (!kb.isReleaseable(obj)) return;

    (obj as { __kb_released: boolean }).__kb_released = true;

    // Release array items
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const value = obj[i];
        if (kb.isReleaseable(value)) {
          obj[i] = null;
          kb.release(value);
        }
      }
      return;
    }

    // Observable or lifecycle managed
    if (ko.isObservable(obj)) {
      const kbObs = obj as KBObservable;
      const array = kb.peek(obj);

      if (Array.isArray(array)) {
        if (kbObs.__kb_is_co || (kbObs.__kb_is_o && kbObs.valueType?.() === TYPE_COLLECTION)) {
          kbObs.destroy?.();
          return;
        }

        for (let i = 0; i < array.length; i++) {
          const value = array[i];
          if (kb.isReleaseable(value)) {
            array[i] = null;
            kb.release(value);
          }
        }
      }

      if (typeof (obj as { dispose?: () => void }).dispose === 'function') {
        (obj as { dispose: () => void }).dispose();
      }
      return;
    }

    // Check for lifecycle methods
    for (const method of LIFECYCLE_METHODS) {
      if (typeof (obj as Record<string, unknown>)[method] === 'function') {
        (obj as Record<string, () => void>)[method].call(obj);
        return;
      }
    }

    // View model - release keys
    if (!ko.isObservable(obj)) {
      kb.releaseKeys(obj as Record<string, unknown>);
    }
  },

  // Releases and clears all keys on an object
  releaseKeys(obj: Record<string, unknown>): void {
    for (const key in obj) {
      if (key !== '__kb' && kb.isReleaseable(obj[key])) {
        const value = obj[key];
        obj[key] = null;
        kb.release(value);
      }
    }
  },

  // Binds a callback to the node that releases the view model when the node is removed
  releaseOnNodeRemove(view_model: unknown, node: Node): void {
    if (!view_model) kb._throwUnexpected('kb', 'missing view model');
    if (!node) kb._throwUnexpected('kb', 'missing node');
    ko.utils.domNodeDisposal.addDisposeCallback(node, () => kb.release(view_model));
  },

  // Renders a template and binds automatic release
  renderTemplate(template: string, view_model: { afterRender?: (el: Element) => void }, options: { afterRender?: () => void } = {}): Element | null {
    const doc = globalWindow?.document;
    if (!doc) {
      console?.log?.('renderTemplate: document is undefined');
      return null;
    }

    let el: Element = doc.createElement('div');
    const observable = ko.renderTemplate(template, view_model, options, el, 'replaceChildren');

    if (el.childNodes.length === 1) {
      el = el.childNodes[0] as Element;
    } else if (el.childNodes.length) {
      for (let i = 0; i < el.childNodes.length; i++) {
        try {
          ko.storedBindingContextForNode(el, ko.contextFor(el.childNodes[i] as Element));
          break;
        } catch {
          // Ignore errors
        }
      }
    }

    kb.releaseOnNodeRemove(view_model, el);
    observable.dispose();

    if (view_model.afterRender && !options.afterRender) {
      view_model.afterRender(el);
    }

    return el;
  },

  // Applies bindings and binds automatic release
  applyBindings(view_model: unknown, node: Element | NodeList | HTMLCollection): Element {
    const doc = globalWindow?.document;

    // Convert NodeList/HTMLCollection to root element
    if ('length' in node) {
      const children = Array.from(node as NodeList);
      node = doc.createElement('div');
      for (const child of children) {
        (node as Element).appendChild(child);
      }
    }

    ko.applyBindings(view_model, node as Element);
    kb.releaseOnNodeRemove(view_model, node as Element);
    return node as Element;
  },

  // Get value from model
  getValue(model: Backbone.Model | null, key: string, args?: unknown[]): unknown {
    if (!model) return undefined;

    // Check if ORM wants to use a function
    const modelAny = model as Record<string, unknown>;
    if (typeof modelAny[key] === 'function' && kb.settings.orm?.useFunction?.(model, key)) {
      return (modelAny[key] as (...a: unknown[]) => unknown)();
    }

    if (!args) {
      return model.get(key);
    }

    const allArgs = [key, ...args].map((value) => kb.peek(value));
    return (model.get as (...a: unknown[]) => unknown).apply(model, allArgs);
  },

  // Set value on model
  setValue(model: Backbone.Model | null, key: string, value: unknown): void {
    if (!model) return;

    // Check if ORM wants to use a function
    const modelAny = model as Record<string, unknown>;
    if (typeof modelAny[key] === 'function' && kb.settings.orm?.useFunction?.(model, key)) {
      (modelAny[key] as (v: unknown) => void)(value);
      return;
    }

    model.set({ [key]: value });
  },

  // Helper to ignore dependencies in a function
  ignore: ko.dependencyDetection?.ignore || ((callback: () => unknown, callbackTarget?: unknown, callbackArgs?: unknown[]) => {
    let value: unknown = null;
    ko.computed(() => {
      value = callback.apply(callbackTarget, callbackArgs || []);
    }).dispose();
    return value;
  }),

  // Peek at observable value without creating dependency
  peek<T>(obs: T | ko.Observable<T>): T {
    if (!ko.isObservable(obs)) return obs as T;
    const observable = obs as ko.Observable<T> & { peek?: () => T };
    if (observable.peek) return observable.peek();
    return kb.ignore(() => observable()) as T;
  },

  // Type guards
  isModel(obj: unknown): obj is Backbone.Model {
    if (!obj) return false;
    if (obj instanceof Backbone.Model) return true;
    const model = obj as Record<string, unknown>;
    return typeof model.get === 'function' && typeof model.bind === 'function';
  },

  isCollection(obj: unknown): obj is Backbone.Collection {
    return obj instanceof Backbone.Collection;
  },

  isViewModel(obj: unknown): boolean {
    return !!(obj && (obj as { __kb_is_vm?: boolean }).__kb_is_vm);
  },

  // Error helpers
  _throwMissing(instance: string | { constructor: { name: string } }, message: string): never {
    const name = typeof instance === 'string' ? instance : instance.constructor.name;
    throw new Error(`${name}: ${message} is missing`);
  },

  _throwUnexpected(instance: string | { constructor: { name: string } }, message: string): never {
    const name = typeof instance === 'string' ? instance : instance.constructor.name;
    throw new Error(`${name}: ${message} is unexpected`);
  },

  // Publish methods from instance to observable
  publishMethods(observable: Record<string, unknown>, instance: Record<string, unknown>, methods: string[]): void {
    for (const fn of methods) {
      observable[fn] = (instance[fn] as (...args: unknown[]) => unknown).bind(instance);
    }
  },
};

export default kb;
export { _, ko, Backbone };
export { TYPE_UNKNOWN, TYPE_SIMPLE, TYPE_ARRAY, TYPE_MODEL, TYPE_COLLECTION };
export type { ValueType };
