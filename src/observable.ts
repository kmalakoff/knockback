import type * as Backbone from 'backbone';
import ko from 'knockout';
import { EventWatcher } from './event-watcher.ts';
import { Factory } from './factory.ts';
import kb from './kb.ts';
import { TypedValue } from './typed-value.ts';
import type { KBObservable, ObservableOptions, ValueType, ViewModelOptions } from './types.ts';
import utils from './utils.ts';

const KEYS_PUBLISH = ['value', 'valueType', 'destroy'] as const;
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
  _value: TypedValue;
  _model: ko.Observable<Backbone.Model | null>;
  model: ko.Computed<Backbone.Model | null>;
  __kb_released?: boolean;
  __kb?: unknown;

  // Methods
  destroy(): void;
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
export function observable(model: Backbone.Model | null, keyOrInfo: string | ObservableOptions, options?: ViewModelOptions, vm: Record<string, unknown> = {}): KBObservable {
  return kb.ignore(() => {
    if (!keyOrInfo) kb._throwMissing({ constructor: { name: 'Observable' } }, 'key_or_info');

    const info = typeof keyOrInfo === 'string' ? { key: keyOrInfo } : keyOrInfo;

    // Instance state (closure-based)
    const state: ObservableInstance = {
      key: info.key || (keyOrInfo as string),
      _vm: vm,
      _value: undefined as unknown as TypedValue,
      _model: undefined as unknown as ko.Observable<Backbone.Model | null>,
      model: undefined as unknown as ko.Computed<Backbone.Model | null>,
      __kb_released: false,

      destroy,
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

    const createOptions = utils.collapseOptions(options) as ViewModelOptions & { event_watcher?: EventWatcher };
    const eventWatcher = createOptions.event_watcher;
    delete createOptions.event_watcher;

    // Set up basics
    state._value = new TypedValue(createOptions);
    state._model = ko.observable(null);

    const koObservable = utils.setObservable(
      state,
      ko.computed({
        read: () => {
          const _model = state._model();
          // Create dependency on args
          const args: unknown[] = [state.key, ...(state.args || [])];
          for (const arg of args) {
            ko.utils.unwrapObservable(arg);
          }

          // Update event watcher
          const ew = utils.getEventWatcher(state);
          ew?.emitter(_model || null);

          if (state.read) {
            updateWithValue(state.read.apply(state._vm, args));
          } else if (_model !== undefined) {
            kb.ignore(() => updateWithValue(kb.getValue(_model, kb.peek(state.key), state.args)));
          }

          return state._value.value();
        },

        write: (newValue: unknown) => {
          kb.ignore(() => {
            const unwrappedNewValue = utils.unwrapModels(newValue);
            const _model = kb.peek(state._model);

            if (state.write) {
              state.write.call(state._vm, unwrappedNewValue);
              newValue = kb.getValue(_model, kb.peek(state.key), state.args);
            } else if (_model) {
              kb.setValue(_model, kb.peek(state.key), unwrappedNewValue);
            }

            updateWithValue(newValue);
          });
        },

        owner: state._vm,
      })
    ) as KBObservable;

    koObservable.__kb_is_o = true;
    createOptions.store = utils.wrappedStore(koObservable, createOptions.store);
    createOptions.path = utils.pathJoin(createOptions.path, state.key as string);

    // Handle factories
    if (createOptions.factories && (typeof createOptions.factories === 'function' || (createOptions.factories as { create?: unknown }).create)) {
      createOptions.factory = utils.wrappedFactory(koObservable, new Factory(createOptions.factory as Factory));
      (createOptions.factory as Factory).addPathMapping(createOptions.path, createOptions.factories);
    } else {
      createOptions.factory = Factory.useOptionsOrCreate(createOptions, koObservable, createOptions.path);
    }
    delete createOptions.factories;

    // Publish methods
    kb.publishMethods(koObservable as unknown as Record<string, unknown>, state as unknown as Record<string, unknown>, KEYS_PUBLISH as unknown as string[]);

    // Create model computed
    const modelComputed = ko.computed({
      read: () => ko.utils.unwrapObservable(state._model),
      write: (newModel: Backbone.Model | null) => {
        kb.ignore(() => {
          if (state.__kb_released || kb.peek(state._model) === newModel) return;

          const newValue = kb.getValue(newModel, kb.peek(state.key), state.args);
          state._model(newModel);

          if (!newModel) {
            updateWithValue(null);
          } else if (newValue !== undefined) {
            updateWithValue(newValue);
          }
        });
      },
    });

    koObservable.model = state.model = modelComputed;

    // Set up event watcher
    EventWatcher.useOptionsOrCreate({ event_watcher: eventWatcher }, model || null, state, {
      obj: state,
      emitter: (m: Backbone.Model | null) => state.model(m),
      update: () => kb.ignore(() => update()),
      key: state.key as string,
      path: createOptions.path,
    });

    // Initialize value
    if (!state._value.rawValue()) {
      state._value.update();
    }

    // Wrap with localizer if specified
    // biome-ignore lint/suspicious/noExplicitAny: Dynamic wrapper types
    let result: any = koObservable;
    if (info.localizer) {
      result = new info.localizer(result);
    }

    // Wrap with default observable if specified
    // biome-ignore lint/suspicious/noExplicitAny: Dynamic kb method access
    const defaultObservableFn = (kb as any).defaultObservable;
    if (defaultObservableFn && Object.hasOwn(info, 'default')) {
      result = defaultObservableFn(result, info.default);
    }

    return result as KBObservable;

    // =============================================================================
    // Instance Methods (closures)
    // =============================================================================

    function destroy(): void {
      const obs = utils.getObservable(state);
      state.__kb_released = true;
      state._value.destroy();
      state._value = undefined as unknown as TypedValue;
      state.model.dispose();
      state.model = undefined as unknown as ko.Computed<Backbone.Model | null>;
      if (obs) {
        (obs as KBObservable).model = undefined;
      }
      utils.wrappedDestroy(state);
    }

    function value(): unknown {
      return state._value.rawValue();
    }

    function valueType(): ValueType {
      return state._value.valueType(kb.peek(state._model), kb.peek(state.key));
    }

    // Update with explicit value (avoids arguments.length check)
    function updateWithValue(newValue: unknown): void {
      if (state.__kb_released) return;
      state._value.update(newValue);
    }

    // Update by reading from model (no argument)
    function update(): void {
      if (state.__kb_released) return;
      const newValue = kb.getValue(kb.peek(state._model), kb.peek(state.key));
      state._value.update(newValue);
    }
  }) as KBObservable;
}

export default observable;
