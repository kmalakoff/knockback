import type * as Backbone from 'backbone';
import ko from 'knockout';
import { KB_DISPOSE_STATE } from './constants.ts';
import { EventWatcher } from './event-watcher.ts';
import { Factory } from './factory.ts';
import type { KnockbackGlobal } from './internal-types.ts';
import { _throwUnexpected, ignore, isModel, releaseKeys, wasReleased } from './kb.ts';
import { observable as kbObservable } from './observable.ts';
import { REFERENCE_ATTACHMENT, REFERENCE_ROOT, type ReferenceAttachment, Store } from './store.ts';
import type { InternalCreateOptions, InternalViewModelOptions, KBMetadata, ModelInput, ObservableOptions, ViewModelOptions, ViewModel as ViewModelType, ViewModelValue } from './types.ts';
import { attachDispose, collapseOptions, disposeMetadata, isModelReference, resolveModel, wrappedEventWatcher, wrappedFactory, wrappedObject, wrappedStore } from './utils.ts';

const KEYS_OPTIONS = ['keys', 'internals', 'excludes', 'statics', 'staticDefaults'] as const;

/**
 * Extended metadata for ViewModels
 * @hidden
 * @internal
 */
interface ViewModelMetadata extends KBMetadata {
  [REFERENCE_ROOT]?: boolean;
  [REFERENCE_ATTACHMENT]?: ReferenceAttachment;
  viewModel?: Record<string, unknown>; // Internal: reference to the view model instance
  keys?: string[] | Record<string, ObservableOptions>;
  internals?: string[];
  excludes?: string[];
  statics?: string[];
  staticDefaults?: Record<string, unknown>; // Renamed from staticDefaults
  path?: string;
  create_options?: InternalCreateOptions;
  vm_keys?: Record<string, boolean>;
}

// Assign a key to the view model
function assignViewModelKey(vm: ViewModelClass, key: string): string | undefined {
  const __kb = vm.__kb as ViewModelMetadata;
  const vmKey = __kb.internals && __kb.internals.indexOf(key) >= 0 ? `_${key}` : key;

  const viewModel = __kb.viewModel as Record<string, unknown>;
  if (Object.hasOwn(viewModel, vmKey)) {
    return undefined; // Already exists
  }

  viewModel[vmKey] = null;
  return vmKey;
}

// Create an observable for a key
function createObservable(vm: ViewModelClass, model: Backbone.Model | null, key: string, createOptions: InternalCreateOptions): void {
  const __kb = vm.__kb as ViewModelMetadata;

  if (__kb.excludes && __kb.excludes.indexOf(key) >= 0) return;
  if (__kb.statics && __kb.statics.indexOf(key) >= 0) return;

  const vmKey = assignViewModelKey(vm, key);
  if (!vmKey) return;

  const viewModel = __kb.viewModel as Record<string, unknown>;
  (vm as Record<string, unknown>)[vmKey] = viewModel[vmKey] = kbObservable(model, key, createOptions as ViewModelOptions, vm as unknown as Record<string, unknown>);
}

// Create static observables
function createStaticObservables(vm: ViewModelClass, model: Backbone.Model): void {
  const __kb = vm.__kb as ViewModelMetadata;
  if (!__kb.statics) return;

  for (const key of __kb.statics) {
    const vmKey = assignViewModelKey(vm, key);
    if (!vmKey) continue;

    const viewModel = __kb.viewModel as Record<string, unknown>;

    if (model.has(vmKey)) {
      (vm as Record<string, unknown>)[vmKey] = viewModel[vmKey] = model.get(vmKey);
    } else if (__kb.staticDefaults && vmKey in __kb.staticDefaults) {
      (vm as Record<string, unknown>)[vmKey] = viewModel[vmKey] = __kb.staticDefaults[vmKey];
    } else {
      delete viewModel[vmKey];
    }
  }
}

// =============================================================================
// ViewModel Class
// =============================================================================

/**
 * ViewModel class for Backbone models.
 * Creates Knockout observables for all model attributes automatically.
 */
export class ViewModelClass {
  // Index signature for dynamic property access
  [key: string]: unknown;

  /** @hidden */
  __kb: ViewModelMetadata;
  /** @hidden */
  __kb_dispose?: number;
  /** @hidden */
  __kb_is_vm = true;
  model!: ko.Computed<Backbone.Model | null> & ((value: ModelInput) => void);

  constructor(model: ModelInput, options: ViewModelOptions | string[] = {}, viewModel?: ViewModelType<Record<string, unknown>>) {
    // Initialize metadata first
    this.__kb = {};

    // Run initialization inside ignore to prevent unwanted dependency tracking
    ignore(() => this._initialize(model, options, viewModel));
  }

  // Internal initialization (called in constructor)
  _initialize(modelInput: ModelInput, options: ViewModelOptions | string[], viewModel?: ViewModelType<Record<string, unknown>>): void {
    const model = resolveModel(modelInput);
    // Validate model
    if (model && !isModel(model)) {
      _throwUnexpected(this, 'not a model');
    }

    // Convert array shorthand to keys option
    let opts: ViewModelOptions = {};
    if (Array.isArray(options)) {
      opts = { keys: options };
    } else if (options) {
      opts = options;
    }

    const extend = (
      opts as {
        extend?: ((vm: ViewModelType<Record<string, unknown>>, model: Backbone.Model | null) => void | Partial<Record<string, unknown>>) | Partial<Record<string, unknown>>;
      }
    ).extend;
    if (extend) {
      delete (opts as Record<string, unknown>).extend;
    }

    const __kb = this.__kb as ViewModelMetadata;
    __kb.viewModel = viewModel || this;
    if (isModelReference(modelInput)) __kb[REFERENCE_ROOT] = true;

    // Collapse options
    const mergedOptions = collapseOptions(opts) as InternalViewModelOptions;

    // Copy relevant options to __kb
    for (const key of KEYS_OPTIONS) {
      if (Object.hasOwn(mergedOptions, key)) {
        (__kb as Record<string, unknown>)[key] = mergedOptions[key];
      }
    }

    // Always use a store
    Store.useOptionsOrCreate(mergedOptions, model, this);

    // Factory setup
    __kb.path = mergedOptions.path;
    Factory.useOptionsOrCreate(mergedOptions, this, mergedOptions.path);

    // Model observable (store on instance, not in __kb)
    const _model = ko.observable<Backbone.Model | null>(null);
    this._model = _model;
    let eventWatcher: EventWatcher | null = null;
    let creatingObservables = false;
    const prepareReferenceAttachment = (nextModel: Backbone.Model | null): (() => void) => {
      if (__kb[REFERENCE_ATTACHMENT]) _throwUnexpected(this, 'reentrant reference attachment');
      const store = wrappedStore(this) as Store;
      const attachment: ReferenceAttachment = { store, model: nextModel, prepare: true };
      __kb[REFERENCE_ATTACHMENT] = attachment;
      try {
        store.reuse(this, nextModel);
        if (!attachment.commit) _throwUnexpected(this, 'missing reference attachment');
        return attachment.commit;
      } finally {
        delete __kb[REFERENCE_ATTACHMENT];
      }
    };

    this.model = ko.computed({
      read: () => ko.utils.unwrapObservable(_model),
      write: (newModel: ModelInput) => {
        ignore(() => {
          if (wasReleased(this) || !eventWatcher) return;

          const store = wrappedStore(this) as Store;
          if (!isModelReference(newModel)) store.reuse(this, resolveModel(newModel));
          eventWatcher.emitter(newModel);
          if (wasReleased(this)) return;
          _model(eventWatcher.ee);

          if (eventWatcher.ee) {
            this.createObservables(eventWatcher.ee);
          }
        });
      },
    });

    // Event watcher
    eventWatcher = EventWatcher.useOptionsOrCreate({}, modelInput, this, {
      obj: this,
      emitterAfterCallbacks: true,
      emitterPrepare: (m, reference) => {
        if (wasReleased(this) || !reference) return;
        return prepareReferenceAttachment(m);
      },
      emitter: (m: Backbone.Model | null) => {
        if (creatingObservables || wasReleased(this) || wrappedEventWatcher(this)?.ee !== m) return;

        if (m) {
          creatingObservables = true;
          try {
            this.createObservables(m);
          } finally {
            creatingObservables = false;
          }
        }
        if (wasReleased(this) || wrappedEventWatcher(this)?.ee !== m) return;
        _model(m);
      },
      update: () => {
        ignore(() => {
          if (eventWatcher?.ee) {
            this.createObservables(eventWatcher.ee);
          }
        });
      },
    });

    wrappedObject(this, model || null);
    _model(eventWatcher.ee);

    // Create options for child observables
    __kb.create_options = {
      store: wrappedStore(this),
      factory: wrappedFactory(this),
      path: __kb.path,
      eventWatcher: wrappedEventWatcher(this),
    };

    // Create observables
    if (mergedOptions.requires) {
      this.createObservables(model, mergedOptions.requires);
    }
    if (__kb.internals) {
      this.createObservables(model, __kb.internals);
    }
    if (mergedOptions.mappings) {
      this.createObservables(model, mergedOptions.mappings);
    }
    if (__kb.statics && model) {
      createStaticObservables(this, model);
    }
    this.createObservables(model, __kb.keys);

    if (extend) {
      if (typeof extend === 'function') {
        const extension = extend(this as unknown as ViewModelType<Record<string, unknown>>, model);
        if (extension && typeof extension === 'object') {
          Object.assign(this, extension);
        }
      } else {
        Object.assign(this, extend);
      }
    }

    attachDispose(this, this.dispose.bind(this));

    // Statistics tracking
    if ((globalThis as KnockbackGlobal).statistics) {
      ((globalThis as KnockbackGlobal).statistics as NonNullable<KnockbackGlobal['statistics']>).register('ViewModel', this);
    }
  }

  // Clean up
  dispose(): void {
    if (this.__kb_dispose && this.__kb_dispose >= KB_DISPOSE_STATE.DISPOSED) return;
    this.__kb_dispose = KB_DISPOSE_STATE.DISPOSED;
    const __kb = this.__kb as ViewModelMetadata;

    // Clear external references
    if (__kb.viewModel !== this && __kb.vm_keys) {
      const viewModel = __kb.viewModel as Record<string, unknown>;
      for (const vmKey in __kb.vm_keys) {
        viewModel[vmKey] = null;
      }
    }

    __kb.viewModel = undefined;
    __kb.create_options = undefined;

    releaseKeys(this as unknown as Record<string, unknown>);
    disposeMetadata(this);

    if ((globalThis as KnockbackGlobal).statistics) {
      ((globalThis as KnockbackGlobal).statistics as NonNullable<KnockbackGlobal['statistics']>).unregister('ViewModel', this);
    }
  }

  destroy(): void {
    this.dispose();
  }

  release(): void {
    this.dispose();
  }

  // Get share options for creating related observables
  shareOptions(): { store: unknown; factory: unknown } {
    return {
      store: wrappedStore(this),
      factory: wrappedFactory(this),
    };
  }

  // Create observables for keys
  createObservables(model: Backbone.Model | null | undefined, keys?: string[] | Record<string, ObservableOptions>): void {
    const __kb = this.__kb as ViewModelMetadata;
    const createOptions = __kb.create_options;
    if (!createOptions) return;

    if (!keys) {
      // Use all model keys if no specific keys provided
      if (__kb.keys || !model) return;

      // Create observables for all attributes
      for (const key in model.attributes) {
        createObservable(this, model, key, createOptions);
      }

      // ORM relationship keys
      const orm = wrappedEventWatcher(this)?.orm;
      if (orm?.keys) {
        const relKeys = orm.keys(model);
        if (relKeys) {
          for (const key of relKeys) {
            createObservable(this, model, key, createOptions);
          }
        }
      }
    } else if (Array.isArray(keys)) {
      // Array of key names
      for (const key of keys) {
        createObservable(this, model ?? null, key, createOptions);
      }
    } else {
      // Object with mapping info
      for (const key in keys) {
        const vmKey = assignViewModelKey(this, key);
        if (!vmKey) continue;

        let mappingInfo = keys[key];
        if (typeof mappingInfo !== 'string') {
          mappingInfo = { ...mappingInfo, key: mappingInfo.key || vmKey };
        }

        const viewModel = __kb.viewModel as Record<string, unknown>;
        (this as Record<string, unknown>)[vmKey] = viewModel[vmKey] = kbObservable(model ?? null, mappingInfo, __kb.create_options as ViewModelOptions, this as unknown as Record<string, unknown>);
      }
    }
  }
}

type ViewModelPrototype = Record<string, unknown>;
type MergeStatic<Parent extends Record<string, unknown>, Child extends Record<string, unknown>> = Omit<Parent, keyof Child> & Child;

export type LegacyViewModelInstance<T extends object = Record<string, unknown>, M extends Backbone.Model = Backbone.Model> = ViewModelType<T, M> & {
  createObservables(model: Backbone.Model | null | undefined, keys?: string[] | Record<string, ObservableOptions>): void;
  shareOptions(): { store: unknown; factory: unknown };
};

export interface ViewModelConstructor<Instance extends LegacyViewModelInstance = LegacyViewModelInstance, InheritedStatic extends Record<string, unknown> = Record<string, never>> {
  new <T extends object = Record<string, unknown>, M extends Backbone.Model = Backbone.Model>(model: ModelInput<M>, options?: ViewModelOptions<T, M> | string[], vm?: ViewModelType<Record<string, unknown>>): Instance & LegacyViewModelInstance<T, M>;
  prototype: Instance;
  extend<Prototype extends ViewModelPrototype = ViewModelPrototype, Static extends Record<string, unknown> = Record<string, never>>(
    prototypeProperties?: Prototype & ThisType<Instance & Omit<Prototype, 'constructor'>>,
    staticProperties?: Static
  ): ViewModelConstructor<Instance & Omit<Prototype, 'constructor'>, MergeStatic<InheritedStatic, Static>> & MergeStatic<InheritedStatic, Static> & { __super__: Instance };
}

function extendViewModel<Instance extends LegacyViewModelInstance, InheritedStatic extends Record<string, unknown>, Prototype extends ViewModelPrototype, Static extends Record<string, unknown>>(
  this: ViewModelConstructor<Instance, InheritedStatic>,
  prototypeProperties: Prototype = {} as Prototype,
  staticProperties: Static = {} as Static
): ViewModelConstructor<Instance & Omit<Prototype, 'constructor'>, MergeStatic<InheritedStatic, Static>> & MergeStatic<InheritedStatic, Static> & { __super__: Instance } {
  const parent = this;
  const constructorValue = (prototypeProperties as Record<string, unknown>).constructor;
  const customConstructor = Object.hasOwn(prototypeProperties, 'constructor') && typeof constructorValue === 'function' ? constructorValue : undefined;
  const child = (customConstructor ||
    function (this: Instance, ...args: unknown[]) {
      return parent.apply(this, args as [ModelInput, ViewModelOptions | string[] | undefined, ViewModelType<Record<string, unknown>> | undefined]);
    }) as unknown as ViewModelConstructor<Instance & Omit<Prototype, 'constructor'>, MergeStatic<InheritedStatic, Static>> & MergeStatic<InheritedStatic, Static> & { __super__: Instance };

  Object.assign(child, parent);
  child.prototype = Object.create(parent.prototype) as Instance & Omit<Prototype, 'constructor'>;
  Object.assign(child.prototype, prototypeProperties);
  Object.assign(child, staticProperties);
  Object.defineProperty(child.prototype, 'constructor', { configurable: true, enumerable: false, value: child, writable: true });
  child.__super__ = parent.prototype;
  child.extend = parent.extend;
  return child;
}

const viewModelConstructor = function <T extends object = Record<string, unknown>, M extends Backbone.Model = Backbone.Model>(this: ViewModelClass, model: ModelInput<M>, options: ViewModelOptions<T, M> | string[] = {}, vm?: ViewModelType<Record<string, unknown>>): ViewModelClass & ViewModelType<T, M> {
  this.__kb = {};
  this.__kb_dispose = undefined;
  this.__kb_is_vm = true;
  ignore(() => this._initialize(model, options as ViewModelOptions | string[], vm));
  return this as ViewModelClass & ViewModelType<T, M>;
} as unknown as ViewModelConstructor;

viewModelConstructor.prototype = Object.create(ViewModelClass.prototype) as LegacyViewModelInstance;
viewModelConstructor.extend = extendViewModel as ViewModelConstructor['extend'];
Object.defineProperty(viewModelConstructor.prototype, 'constructor', { configurable: true, enumerable: false, value: viewModelConstructor, writable: true });
Object.defineProperty(viewModelConstructor, Symbol.hasInstance, {
  configurable: true,
  value: (instance: unknown) => instance instanceof ViewModelClass,
});

/** Legacy constructor with Backbone-style extend semantics. */
export const ViewModel: ViewModelConstructor = viewModelConstructor;

/** Creates a typed ViewModel for a Backbone model. */
export function viewModel<T extends object = Record<string, unknown>, M extends Backbone.Model = Backbone.Model>(model: ModelInput<M>, options?: ViewModelOptions<T, M> | string[], vm?: ViewModelType<Record<string, unknown>>): ViewModelValue<T, M>;

// =============================================================================
// Factory Function (Primary API)
// =============================================================================

/**
 * Creates a ViewModel for a Backbone model.
 *
 * @example
 * import { viewModel } from '@mcpeasy/knockback';
 * const vm = viewModel<PersonViewModel>(model);
 *
 * @param model - The Backbone model
 * @param options - View model options or array of attribute keys
 * @param vm - Parent view model (for nested creation)
 * @returns A new ViewModel instance
 */
export function viewModel(model: ModelInput, options?: ViewModelOptions | string[], vm?: ViewModelType<Record<string, unknown>>): ViewModelType<Record<string, unknown>> {
  return new ViewModelClass(model, options, vm);
}

export default viewModel;
