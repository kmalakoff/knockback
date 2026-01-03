import Backbone from 'backbone';
import ko from 'knockout';
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
interface StatisticsLike {
  register: (name: string, obj: unknown) => void;
  unregister: (name: string, obj: unknown) => void;
  addModelEvent: (event: unknown) => void;
}

// The 'kb' namespace for classes, factory functions, constants, etc.
const kb = {
  // Knockback library semantic version
  VERSION: '2.0.0',

  // Settings
  settings: {} as KBSettings,

  // Locale manager (for localized observables)
  locale_manager: null as LocaleManager | null,

  // Statistics (for debugging/testing)
  statistics: null as StatisticsLike | null,

  // Checks if an object has been released (internal)
  wasReleased(obj: unknown): boolean {
    return !obj || (obj as { __kb_released?: boolean }).__kb_released === true;
  },

  // Checks if an object can be disposed
  isReleaseable(obj: unknown): boolean {
    return !!obj && (ko.isSubscribable(obj) || typeof (obj as { dispose?: () => void }).dispose === 'function');
  },

  // Disposes an object or collection (public helper for plain objects)
  // Use when you created a plain object that contains Knockback observables.
  dispose(obj: unknown): void {
    if (!obj) return;

    const disposable = obj as { dispose?: () => void };
    if (typeof disposable.dispose === 'function') {
      disposable.dispose();
      return;
    }

    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const value = obj[i];
        if (kb.isReleaseable(value)) {
          obj[i] = null;
          (value as { dispose?: () => void }).dispose?.();
        }
      }
      return;
    }

    if (obj === Object(obj)) {
      for (const key in obj as Record<string, unknown>) {
        if (key === '__kb') continue;
        const value = (obj as Record<string, unknown>)[key];
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            const item = value[i];
            if (kb.isReleaseable(item)) {
              value[i] = null;
              (item as { dispose?: () => void }).dispose?.();
            }
          }
          continue;
        }
        if (kb.isReleaseable(value)) {
          (obj as Record<string, unknown>)[key] = null;
          (value as { dispose?: () => void }).dispose?.();
        }
      }
    }
  },

  // Binds a callback to the node that disposes the view model when the node is removed
  releaseOnNodeRemove(view_model: unknown, node: Node): void {
    if (!view_model) kb._throwUnexpected('kb', 'missing view model');
    if (!node) kb._throwUnexpected('kb', 'missing node');
    ko.utils.domNodeDisposal.addDisposeCallback(node, () => {
      (view_model as { dispose?: () => void }).dispose?.();
    });
  },

  // Renders a template and binds automatic disposal
  renderTemplate(template: string, view_model: { afterRender?: (el: Element) => void }, options: { afterRender?: () => void } = {}): Element | null {
    if (!globalWindow?.document) {
      console?.log?.('renderTemplate: document is undefined');
      return null;
    }
    const doc = globalWindow.document;

    let el: Element = doc.createElement('div');
    const observable = ko.renderTemplate(template, view_model, options, el, 'replaceChildren');

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

    kb.releaseOnNodeRemove(view_model, el);
    observable.dispose();

    if (view_model.afterRender && !options.afterRender) {
      view_model.afterRender(el);
    }

    return el;
  },

  // Applies bindings and binds automatic disposal
  applyBindings(view_model: unknown, node: Element | NodeList | HTMLCollection): Element {
    // Convert NodeList/HTMLCollection to root element
    if ('length' in node) {
      if (!globalWindow?.document) {
        throw new Error('applyBindings: document is undefined');
      }
      const doc = globalWindow.document;
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
    // biome-ignore lint/suspicious/noExplicitAny: Backbone Model may have custom methods
    const modelAny = model as any;
    if (typeof modelAny[key] === 'function' && kb.settings.orm?.useFunction?.(model, key)) {
      return modelAny[key]();
    }

    if (!args) {
      return model.get(key);
    }

    const allArgs = [key, ...args].map((value) => kb.peek(value));
    // biome-ignore lint/suspicious/noExplicitAny: Using get with spread args
    return (model.get as any).apply(model, allArgs);
  },

  // Set value on model
  setValue(model: Backbone.Model | null, key: string, value: unknown): void {
    if (!model) return;

    // Check if ORM wants to use a function
    // biome-ignore lint/suspicious/noExplicitAny: Backbone Model may have custom methods
    const modelAny = model as any;
    if (typeof modelAny[key] === 'function' && kb.settings.orm?.useFunction?.(model, key)) {
      modelAny[key](value);
      return;
    }

    model.set({ [key]: value });
  },

  // Helper to ignore dependencies in a function
  ignore:
    (ko as unknown as KoExtended).dependencyDetection?.ignore ||
    (<T>(callback: () => T, callbackTarget?: unknown, callbackArgs?: unknown[]): T => {
      let value: T = null as T;
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
  publishMethods<T extends object, S extends object, K extends readonly (keyof S)[]>(observable: T, instance: S, methods: K): void {
    for (const fn of methods) {
      const key = fn as keyof S;
      (observable as Record<string, unknown>)[fn as string] = (instance[key] as (...args: unknown[]) => unknown).bind(instance);
    }
  },
};

export default kb;
