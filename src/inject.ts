import ko from 'knockout';
import _ from 'underscore';
import kb from './kb.ts';

// =============================================================================
// Types
// =============================================================================

export interface InjectData {
  view_model?: new (viewModel: unknown, element: Element, valueAccessor?: unknown, allBindingsAccessor?: unknown) => unknown;
  create?: (viewModel: unknown, element: Element, valueAccessor?: unknown, allBindingsAccessor?: unknown) => void;
  options?: InjectOptions;
  [key: string]: unknown;
}

export interface InjectOptions {
  afterBinding?: (viewModel: unknown, element: Element, options?: InjectOptions) => void;
  beforeBinding?: (viewModel: unknown, element: Element, options?: InjectOptions) => void;
  [key: string]: unknown;
}

export interface InjectResult {
  el: Element;
  view_model: unknown;
  binding?: string;
}

// =============================================================================
// Configuration
// =============================================================================

/**
 * Flag to control recursive auto-injection
 */
export let RECURSIVE_AUTO_INJECT = true;

/**
 * Set the recursive auto-inject flag
 */
export function setRecursiveAutoInject(value: boolean): void {
  RECURSIVE_AUTO_INJECT = value;
}

// =============================================================================
// Core Functions
// =============================================================================

/**
 * Inject data into a view model
 * @param data - The data to inject
 * @param viewModel - The target view model
 * @param element - The DOM element
 * @param valueAccessor - Optional value accessor
 * @param allBindingsAccessor - Optional all bindings accessor
 * @param nested - Whether this is a nested call
 * @returns The resulting view model
 */
export function inject(data: InjectData | (new (...args: unknown[]) => unknown), viewModel: Record<string, unknown>, element: Element, valueAccessor?: unknown, allBindingsAccessor?: unknown, nested?: boolean): unknown {
  const doInject = (injectData: InjectData | (new (...args: unknown[]) => unknown)): unknown => {
    if (typeof injectData === 'function') {
      // Use 'new' to allow for classes in addition to functions
      const Constructor = injectData as new (vm: unknown, el: Element, va?: unknown, aba?: unknown) => unknown;
      viewModel = new Constructor(viewModel, element, valueAccessor, allBindingsAccessor) as Record<string, unknown>;
      kb.releaseOnNodeRemove(viewModel, element);
    } else {
      // view_model constructor causes a scope change
      if (injectData.view_model) {
        const VMConstructor = injectData.view_model;
        viewModel = new VMConstructor(viewModel, element, valueAccessor, allBindingsAccessor) as Record<string, unknown>;
        kb.releaseOnNodeRemove(viewModel, element);
      }

      // Resolve and merge in each key
      for (const key in injectData) {
        if (key === 'view_model') continue;

        const value = injectData[key];

        // Create function
        if (key === 'create') {
          (value as InjectData['create'])?.(viewModel, element, valueAccessor, allBindingsAccessor);
        }
        // Resolve nested with assign or not
        else if (_.isObject(value) && !_.isFunction(value)) {
          const nestedData = value as InjectData;
          const target: Record<string, unknown> = nested || nestedData.create ? {} : viewModel;
          viewModel[key] = inject(nestedData, target, element, valueAccessor, allBindingsAccessor, true);
        }
        // Simple set
        else {
          viewModel[key] = value;
        }
      }
    }

    return viewModel;
  };

  // In recursive calls, we are already protected from propagating dependencies
  return nested ? doInject(data) : kb.ignore(() => doInject(data));
}

/**
 * Search the DOM for elements with 'kb-inject' attribute and create/customize ViewModels
 * @param root - The root DOM element to start searching (defaults to document)
 * @returns Array of objects with DOM elements and ViewModels that were bound
 */
export function injectViewModels(root?: Element | Document): InjectResult[] {
  const results: InjectResult[] = [];

  const findElements = (el: Element | Document): void => {
    const element = el as Element & { __kb_injected?: boolean };

    // Skip if already injected, but still process children
    if (!element.__kb_injected) {
      if (element.attributes) {
        const attr = Array.from(element.attributes).find((a) => a.name === 'kb-inject');
        if (attr) {
          element.__kb_injected = true;
          results.push({ el: element, view_model: {}, binding: attr.value });
        }
      }
    }

    // Process children
    if (el.childNodes) {
      for (let i = 0; i < el.childNodes.length; i++) {
        const child = el.childNodes[i];
        if (child.nodeType === 1) {
          // Element node
          findElements(child as Element);
        }
      }
    }
  };

  // Use document if no root provided and we're in a browser
  const rootElement = root || (typeof document !== 'undefined' ? document : null);
  if (rootElement) {
    findElements(rootElement);
  }

  // Bind the view models
  for (const app of results) {
    let options: InjectOptions = {};
    let afterBinding: InjectOptions['afterBinding'];
    let beforeBinding: InjectOptions['beforeBinding'];

    if (app.binding) {
      let expression = app.binding;

      // Wrap if is an object
      if (expression.indexOf(':') >= 0) {
        expression = `{${expression}}`;
      }

      try {
        // Evaluate the expression
        const fn = new Function('', `return ( ${expression} )`);
        let data = fn() as InjectData;
        if (!data) data = {};

        // Extract options
        if (data.options) {
          options = data.options;
          delete data.options;
        }

        app.view_model = inject(data, app.view_model as Record<string, unknown>, app.el, null, null, true);

        const vm = app.view_model as { afterBinding?: InjectOptions['afterBinding']; beforeBinding?: InjectOptions['beforeBinding'] };
        afterBinding = vm.afterBinding || options.afterBinding;
        beforeBinding = vm.beforeBinding || options.beforeBinding;
      } catch (e) {
        console.error('kb.Inject: Error evaluating kb-inject expression:', e);
      }
    }

    // Auto-bind
    if (beforeBinding) {
      beforeBinding.call(app.view_model, app.view_model, app.el, options);
    }

    kb.applyBindings(app.view_model, app.el);

    if (afterBinding) {
      afterBinding.call(app.view_model, app.view_model, app.el, options);
    }
  }

  return results;
}

/**
 * Register the 'inject' binding handler with Knockout
 */
export function registerInjectBinding(): void {
  if (ko.bindingHandlers) {
    ko.bindingHandlers.inject = {
      init: (element: Element, valueAccessor: () => unknown, allBindingsAccessor: ko.AllBindings, viewModel: unknown) => {
        inject(ko.utils.unwrapObservable(valueAccessor()) as InjectData, viewModel as Record<string, unknown>, element, valueAccessor, allBindingsAccessor);
        return { controlsDescendantBindings: false };
      },
    };
  }
}

export default inject;
