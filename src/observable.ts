import type * as Backbone from 'backbone';
import ko from 'knockout';
import { EventWatcher } from './event-watcher.ts';
import { Factory } from './factory.ts';
import { _throwMissing, getValue, ignore, peek, publishMethods, setValue } from './kb.ts';
import { TypedValue } from './typed-value.ts';
import type { InternalObservableOptions, Observable, ObservableBase, ObservableInternal, ObservableOptions, ValueType, ViewModelOptions } from './types.ts';
import { TYPE_UNKNOWN } from './types.ts';
import { attachDispose, collapseOptions, getEventWatcher, pathJoin, setObservable, unwrapModels, wrappedFactory, wrappedStore } from './utils.ts';

const KEYS_PUBLISH = ['value', 'valueType', 'dispose'] as const;
const KEYS_INFO = ['args', 'read', 'write'] as const;

// =============================================================================
// Observable Interface
// =============================================================================

export interface ObservableInstance {
  // Index signature for dynamic property access
  [key: string]: unknown;

  key: string | ko.Observable<string>;
  args?: unknown[];
  read?: (...args: unknown[]) => unknown;
  write?: (value: unknown) => void;
  _vm: Record<string, unknown>;
  _value?: TypedValue;
  _model?: ko.Observable<Backbone.Model | null>;
  model?: ko.Computed<Backbone.Model | null>;
  __kb_released?: boolean;
  __kb?: unknown;

  // Methods
  dispose(): void;
  value(): unknown;
  valueType(): ValueType;
  update(newValue?: unknown): void;
}

// =============================================================================
// Factory Function (Primary API)
// =============================================================================

/**
 * Creates a Knockout observable bound to a Backbone model attribute.
 *
 * @param model - The Backbone model to observe
 * @param keyOrInfo - Attribute key string or options object
 * @param options - Additional view model options
 * @param vm - Parent view model context
 * @returns A Knockout observable with Knockback extensions
 */
export function observable<T = unknown>(model: Backbone.Model | null, keyOrInfo: string | ObservableOptions, options?: ViewModelOptions, vm: Record<string, unknown> = {}): Observable<T> {
  return ignore(() => {
    if (!keyOrInfo) _throwMissing({ constructor: { name: 'Observable' } }, 'key_or_info');

    const info = typeof keyOrInfo === 'string' ? { key: keyOrInfo } : keyOrInfo;

    // Instance state (closure-based)
    const state: ObservableInstance = {
      key: info.key || (keyOrInfo as string),
      _vm: vm,
      __kb_released: false,

      dispose,
      value,
      valueType,
      update,
    };

    // Copy info properties
    for (const key of KEYS_INFO) {
      if (info[key] !== undefined) {
        (state as Record<string, unknown>)[key] = info[key];
      }
    }

    const createOptions = collapseOptions(options) as InternalObservableOptions;
    const eventWatcher = createOptions.event_watcher;
    delete createOptions.event_watcher;

    // Set up basics
    state._value = new TypedValue(createOptions);
    state._model = ko.observable(null);

    const koObservable = setObservable(
      state,
      ko.computed({
        read: () => {
          const _model = state._model?.();
          // Create dependency on args
          const args: unknown[] = [state.key, ...(state.args || [])];
          for (const arg of args) {
            ko.utils.unwrapObservable(arg);
          }

          // Update event watcher
          const ew = getEventWatcher(state);
          ew?.emitter(_model || null);

          if (state.read) {
            updateWithValue(state.read.apply(state._vm, args));
          } else if (_model !== undefined) {
            ignore(() => updateWithValue(getValue(_model, peek(state.key), state.args)));
          }

          return state._value?.value();
        },

        write: (newValue: unknown) => {
          ignore(() => {
            const unwrappedNewValue = unwrapModels(newValue);
            if (!state._model) return;
            const _model = peek(state._model);

            if (state.write) {
              state.write.call(state._vm, unwrappedNewValue);
              newValue = getValue(_model, peek(state.key), state.args);
            } else if (_model) {
              setValue(_model, peek(state.key), unwrappedNewValue);
            }

            updateWithValue(newValue);
          });
        },

        owner: state._vm,
      })
    ) as Observable;

    (koObservable as ObservableBase).__kb_is_o = true;
    createOptions.store = wrappedStore(koObservable, createOptions.store);
    createOptions.path = pathJoin(createOptions.path, state.key as string);

    // Handle factories
    if (createOptions.factories && (typeof createOptions.factories === 'function' || (createOptions.factories as { create?: unknown }).create)) {
      createOptions.factory = wrappedFactory(koObservable, new Factory(createOptions.factory as Factory));
      (createOptions.factory as Factory).addPathMapping(createOptions.path, createOptions.factories);
    } else {
      createOptions.factory = Factory.useOptionsOrCreate(createOptions, koObservable, createOptions.path);
    }
    delete createOptions.factories;

    // Publish methods
    publishMethods(koObservable, state, KEYS_PUBLISH);
    attachDispose(koObservable, dispose);

    // Create model computed
    const modelComputed = ko.computed({
      read: () => ko.utils.unwrapObservable(state._model),
      write: (newModel: Backbone.Model | null) => {
        ignore(() => {
          if (!state._model) return;
          if (state.__kb_released || peek(state._model) === newModel) return;

          const newValue = getValue(newModel, peek(state.key), state.args);
          state._model?.(newModel);

          if (!newModel) {
            updateWithValue(null);
          } else if (newValue !== undefined) {
            updateWithValue(newValue);
          }
        });
      },
    });

    (koObservable as ObservableInternal).model = state.model = modelComputed;

    // Set up event watcher
    EventWatcher.useOptionsOrCreate({ event_watcher: eventWatcher }, model || null, state, {
      obj: state,
      emitter: (m: Backbone.Model | null) => state.model?.(m),
      update: () => ignore(() => update()),
      key: state.key as string,
      path: createOptions.path,
    });

    // Initialize value
    if (!state._value?.rawValue()) {
      state._value?.update();
    }

    // Wrap with localizer if specified
    // biome-ignore lint/suspicious/noExplicitAny: Dynamic wrapper types
    let result: any = koObservable;
    if (info.localizer) {
      result = new info.localizer(result);
    }

    // Wrap with default observable if specified (plugin support)
    const defaultObservableFn = (globalThis as { defaultObservable?: unknown }).defaultObservable;
    if (typeof defaultObservableFn === 'function' && Object.hasOwn(info, 'default')) {
      result = (defaultObservableFn as (obs: unknown, defaultVal: unknown) => unknown)(result, info.default);
    }

    return result as Observable;

    // =============================================================================
    // Instance Methods (closures)
    // =============================================================================

    function dispose(): void {
      if (state.__kb_released) return;
      state.__kb_released = true;
      state._value?.dispose();
      state._value = undefined;
      state.model?.dispose();
      state.model = undefined;
      if (koObservable) {
        (koObservable as unknown as ObservableInternal).model = undefined;
      }
    }

    function value(): unknown {
      return state._value?.rawValue();
    }

    function valueType(): ValueType {
      if (!state._value || !state._model) return TYPE_UNKNOWN;
      return state._value.valueType(peek(state._model), peek(state.key));
    }

    // Update with explicit value (avoids arguments.length check)
    function updateWithValue(newValue: unknown): void {
      if (state.__kb_released) return;
      state._value?.update(newValue);
    }

    // Update by reading from model (no argument)
    function update(): void {
      if (state.__kb_released || !state._model) return;
      const newValue = getValue(peek(state._model), peek(state.key));
      state._value?.update(newValue);
    }
  }) as Observable<T>;
}

export default observable;
