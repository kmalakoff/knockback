import type * as Backbone from 'backbone';
import ko from 'knockout';
import { KB_DISPOSE_STATE } from './constants.ts';
import { EventWatcher } from './event-watcher.ts';
import { Factory } from './factory.ts';
import type { KnockbackGlobal } from './internal-types.ts';
import { _throwMissing, getValue, ignore, peek, publishMethods, setValue } from './kb.ts';
import { TypedValue } from './typed-value.ts';
import type { InternalObservableOptions, KBMetadata, ModelInput, Observable, ObservableBase, ObservableInternal, ObservableOptions, ObservableValue, ValueType, ViewModelOptions } from './types.ts';
import { TYPE_UNKNOWN } from './types.ts';
import { attachDispose, collapseOptions, disposeMetadata, getEventWatcher, pathJoin, setObservable, unwrapModels, wrappedFactory, wrappedStore } from './utils.ts';

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
  __kb_dispose?: number;
  __kb?: KBMetadata | null;

  // Methods
  dispose(): void;
  value(): unknown;
  valueType(): ValueType;
  update(newValue?: unknown): void;
}

/** Creates a typed Knockout observable bound to a Backbone model attribute. */
export function observable<T = unknown, M extends Backbone.Model = Backbone.Model>(model: ModelInput<M>, keyOrInfo: string, options?: ViewModelOptions, vm?: Record<string, unknown>): ObservableValue<T, M>;
export function observable<T = unknown, M extends Backbone.Model = Backbone.Model, Args extends unknown[] = unknown[], RawRead = T, RawWrite = T>(
  model: ModelInput<M>,
  keyOrInfo: ObservableOptions<NoInfer<T>, Args, NoInfer<RawRead>, NoInfer<RawWrite>>,
  options?: ViewModelOptions,
  vm?: Record<string, unknown>
): ObservableValue<T, M>;

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
export function observable<T = unknown, M extends Backbone.Model = Backbone.Model>(model: ModelInput<M>, keyOrInfo: string | ObservableOptions, options?: ViewModelOptions, vm: Record<string, unknown> = {}): ObservableValue<T, M> {
  return ignore(() => {
    if (!keyOrInfo) _throwMissing({ constructor: { name: 'Observable' } }, 'key_or_info');

    const info = typeof keyOrInfo === 'string' ? { key: keyOrInfo } : keyOrInfo;

    // Instance state (closure-based)
    const state: ObservableInstance = {
      key: info.key || (keyOrInfo as string),
      _vm: vm,

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
    const eventWatcher = createOptions.eventWatcher;
    let activeEventWatcher = eventWatcher as EventWatcher | undefined;
    delete createOptions.eventWatcher;

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
          if (!ew?.modelRef) {
            ew?.emitter(_model || null);
          }

          if (state.read) {
            updateWithValue(state.read.apply(state._vm, args));
          } else if (_model !== undefined) {
            ignore(() => updateWithValue(getValue(_model, peek(state.key), state.args, activeEventWatcher?.orm)));
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
              newValue = getValue(_model, peek(state.key), state.args, activeEventWatcher?.orm);
            } else if (_model) {
              setValue(_model, peek(state.key), unwrappedNewValue, activeEventWatcher?.orm);
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
      read: () => ko.utils.unwrapObservable(state._model as NonNullable<typeof state._model>),
      write: (newModel: Backbone.Model | null) => {
        ignore(() => {
          if (state.__kb_dispose && state.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) return;
          activeEventWatcher?.emitter(newModel);
        });
      },
    });

    (koObservable as ObservableInternal).model = state.model = modelComputed;

    // Set up event watcher
    activeEventWatcher = EventWatcher.useOptionsOrCreate({ eventWatcher }, model || null, state, {
      obj: state,
      emitter: (m: Backbone.Model | null) => updateModel(m),
      update: () => ignore(() => update()),
      key: state.key as string,
      path: createOptions.path,
    });

    // Initialize value after the event watcher has captured its model adapter.
    update();

    // Wrap with localizer if specified
    // biome-ignore lint/suspicious/noExplicitAny: Dynamic wrapper types
    let result: any = koObservable;
    if (info.localizer) {
      result = new info.localizer(result);
    }

    // Wrap with default observable if specified (plugin support)
    if (typeof (globalThis as KnockbackGlobal).defaultObservable === 'function' && Object.hasOwn(info, 'default')) {
      result = ((globalThis as KnockbackGlobal).defaultObservable as NonNullable<KnockbackGlobal['defaultObservable']>)(result, info.default);
    }

    return result as Observable<T, M>;

    // =============================================================================
    // Instance Methods (closures)
    // =============================================================================

    function dispose(): void {
      if (state.__kb_dispose && state.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) return;
      state.__kb_dispose = KB_DISPOSE_STATE.DISPOSED;
      state._value?.dispose();
      state._value = undefined;
      state.model?.dispose();
      state.model = undefined;
      if (koObservable) {
        (koObservable as unknown as { model?: ObservableInternal['model'] }).model = undefined;
      }
      disposeMetadata(state);
    }

    function value(): unknown {
      return state._value?.rawValue();
    }

    function valueType(): ValueType {
      if (!state._value || !state._model) return TYPE_UNKNOWN;
      return state._value.valueType(peek(state._model), peek(state.key), activeEventWatcher?.orm);
    }

    // Update with explicit value (avoids arguments.length check)
    function updateWithValue(newValue: unknown): void {
      if (state.__kb_dispose && state.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) return;
      const model = state._model ? peek(state._model) : null;
      const key = peek(state.key);
      state._value?.update(newValue, model ? activeEventWatcher?.orm?.relationType?.(model, key) : null);
    }

    function updateModel(newModel: Backbone.Model | null): void {
      if (!state._model) return;
      if ((state.__kb_dispose && state.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) || peek(state._model) === newModel) return;

      const newValue = getValue(newModel, peek(state.key), state.args, activeEventWatcher?.orm);
      state._model(newModel);

      if (!newModel) {
        updateWithValue(null);
      } else {
        updateWithValue(newValue);
      }
    }

    // Update by reading from model (no argument)
    function update(): void {
      if ((state.__kb_dispose && state.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) || !state._model) return;
      const model = peek(state._model);
      const newValue = getValue(model, peek(state.key), undefined, activeEventWatcher?.orm);
      updateWithValue(newValue);
    }
  }) as unknown as Observable<T, M>;
}

export default observable;
