import type * as Backbone from 'backbone';
import ko from 'knockout';
import _ from 'underscore';
import kb from './kb.ts';
import utils from './utils.ts';
import extend from './functions/extend.ts';
import { EventWatcher } from './event-watcher.ts';
import { Factory } from './factory.ts';
import { Store } from './store.ts';
import { observable as kbObservable } from './observable.ts';
import type { CreateOptions, KBMetadata, ObservableOptions, ViewModelOptions } from './types.ts';

const KEYS_OPTIONS = ['keys', 'internals', 'excludes', 'statics', 'static_defaults'] as const;

interface ViewModelMetadata extends KBMetadata {
  view_model?: ViewModel;
  keys?: string[] | Record<string, ObservableOptions>;
  internals?: string[];
  excludes?: string[];
  statics?: string[];
  static_defaults?: Record<string, unknown>;
  path?: string;
  create_options?: CreateOptions;
  vm_keys?: Record<string, boolean>;
}

// Assign a key to the view model
function assignViewModelKey(vm: ViewModel, key: string): string | undefined {
  const __kb = vm.__kb as ViewModelMetadata;
  const vmKey = __kb.internals && __kb.internals.indexOf(key) >= 0 ? `_${key}` : key;

  const viewModel = __kb.view_model as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(viewModel, vmKey)) {
    return undefined; // Already exists
  }

  viewModel[vmKey] = null;
  return vmKey;
}

// Create an observable for a key
function createObservable(vm: ViewModel, model: Backbone.Model | null, key: string, createOptions: CreateOptions): void {
  const __kb = vm.__kb as ViewModelMetadata;

  if (__kb.excludes && __kb.excludes.indexOf(key) >= 0) return;
  if (__kb.statics && __kb.statics.indexOf(key) >= 0) return;

  const vmKey = assignViewModelKey(vm, key);
  if (!vmKey) return;

  const viewModel = __kb.view_model as Record<string, unknown>;
  (vm as Record<string, unknown>)[vmKey] = viewModel[vmKey] = kbObservable(model, key, createOptions as ViewModelOptions, vm as unknown as Record<string, unknown>);
}

// Create static observables
function createStaticObservables(vm: ViewModel, model: Backbone.Model): void {
  const __kb = vm.__kb as ViewModelMetadata;
  if (!__kb.statics) return;

  for (const key of __kb.statics) {
    const vmKey = assignViewModelKey(vm, key);
    if (!vmKey) continue;

    const viewModel = __kb.view_model as Record<string, unknown>;

    if (model.has(vmKey)) {
      (vm as Record<string, unknown>)[vmKey] = viewModel[vmKey] = model.get(vmKey);
    } else if (__kb.static_defaults && vmKey in __kb.static_defaults) {
      (vm as Record<string, unknown>)[vmKey] = viewModel[vmKey] = __kb.static_defaults[vmKey];
    } else {
      delete viewModel[vmKey];
    }
  }
}

// ViewModel class for Backbone models
export class ViewModel {
  static extend = extend;

  __kb: ViewModelMetadata;
  __kb_released?: boolean;
  __kb_is_vm = true;
  model!: ko.Computed<Backbone.Model | null>;

  constructor(model: Backbone.Model | null, options: ViewModelOptions | string[] = {}, viewModel?: ViewModel) {
    return kb.ignore(() => {
      // Validate model
      if (model && !kb.isModel(model)) {
        kb._throwUnexpected(this, 'not a model');
      }

      // Convert array shorthand to keys option
      let opts: ViewModelOptions = {};
      if (Array.isArray(options)) {
        opts = { keys: options };
      } else if (options) {
        opts = options;
      }

      // Initialize __kb
      this.__kb = {};
      const __kb = this.__kb as ViewModelMetadata;
      __kb.view_model = viewModel || this;

      // Collapse options
      const mergedOptions = utils.collapseOptions(opts) as ViewModelOptions;

      // Copy relevant options to __kb
      for (const key of KEYS_OPTIONS) {
        if (Object.prototype.hasOwnProperty.call(mergedOptions, key)) {
          (__kb as Record<string, unknown>)[key] = mergedOptions[key];
        }
      }

      // Always use a store
      Store.useOptionsOrCreate(mergedOptions, model, this as unknown as ko.Observable);

      // Factory setup
      __kb.path = mergedOptions.path;
      Factory.useOptionsOrCreate(mergedOptions, this, mergedOptions.path);

      // Model observable
      const _model = utils.set(this, '_model', ko.observable()) as ko.Observable<Backbone.Model | null>;
      let eventWatcher: EventWatcher | null = null;

      this.model = ko.computed({
        read: () => ko.utils.unwrapObservable(_model),
        write: (newModel: Backbone.Model | null) => {
          kb.ignore(() => {
            if (kb.wasReleased(this) || !eventWatcher) return;

            const store = utils.wrappedStore(this) as Store;
            store.reuse(this, utils.resolveModel(newModel));
            eventWatcher.emitter(newModel);
            _model(eventWatcher.ee);

            if (eventWatcher.ee) {
              this.createObservables(eventWatcher.ee);
            }
          });
        },
      });

      // Event watcher
      eventWatcher = utils.wrappedEventWatcher(
        this,
        new EventWatcher(model || null, this, {
          emitter: (m: Backbone.Model | null) => _model(m),
          update: () => {
            kb.ignore(() => {
              if (eventWatcher?.ee) {
                this.createObservables(eventWatcher.ee);
              }
            });
          },
        })
      ) as EventWatcher;

      utils.wrappedObject(this, model || null);
      _model(eventWatcher.ee);

      // Create options for child observables
      __kb.create_options = {
        store: utils.wrappedStore(this),
        factory: utils.wrappedFactory(this),
        path: __kb.path,
        event_watcher: utils.wrappedEventWatcher(this),
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

      // Statistics tracking
      const statistics = (kb as { statistics?: { register: (name: string, obj: unknown) => void } }).statistics;
      if (statistics) {
        statistics.register('ViewModel', this);
      }

      return this;
    }) as unknown as ViewModel;
  }

  // Clean up
  destroy(): void {
    this.__kb_released = true;
    const __kb = this.__kb as ViewModelMetadata;

    // Clear external references
    if (__kb.view_model !== this && __kb.vm_keys) {
      const viewModel = __kb.view_model as Record<string, unknown>;
      for (const vmKey in __kb.vm_keys) {
        viewModel[vmKey] = null;
      }
    }

    __kb.view_model = undefined;
    __kb.create_options = undefined;

    kb.releaseKeys(this as unknown as Record<string, unknown>);
    utils.wrappedDestroy(this);

    const statistics = (kb as { statistics?: { unregister: (name: string, obj: unknown) => void } }).statistics;
    if (statistics) {
      statistics.unregister('ViewModel', this);
    }
  }

  // Get share options for creating related observables
  shareOptions(): { store: unknown; factory: unknown } {
    return {
      store: utils.wrappedStore(this),
      factory: utils.wrappedFactory(this),
    };
  }

  // Create observables for keys
  createObservables(model: Backbone.Model | null | undefined, keys?: string[] | Record<string, ObservableOptions>): void {
    const __kb = this.__kb as ViewModelMetadata;

    if (!keys) {
      // Use all model keys if no specific keys provided
      if (__kb.keys || !model) return;

      // Create observables for all attributes
      for (const key in model.attributes) {
        createObservable(this, model, key, __kb.create_options!);
      }

      // ORM relationship keys
      const orm = kb.settings.orm;
      if (orm?.keys) {
        const relKeys = orm.keys(model);
        if (relKeys) {
          for (const key of relKeys) {
            createObservable(this, model, key, __kb.create_options!);
          }
        }
      }
    } else if (Array.isArray(keys)) {
      // Array of key names
      for (const key of keys) {
        createObservable(this, model, key, __kb.create_options!);
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

        const viewModel = __kb.view_model as Record<string, unknown>;
        (this as Record<string, unknown>)[vmKey] = viewModel[vmKey] = kbObservable(
          model,
          mappingInfo,
          __kb.create_options as ViewModelOptions,
          this as unknown as Record<string, unknown>
        );
      }
    }
  }
}

// Factory function
export function viewModel(model: Backbone.Model | null, options?: ViewModelOptions | string[], vm?: ViewModel): ViewModel {
  return new ViewModel(model, options, vm);
}

export default ViewModel;
