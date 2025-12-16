import type * as Backbone from 'backbone';
import ko from 'knockout';
import _ from 'underscore';
import kb from './kb.ts';
import utils from './utils.ts';
import { EventWatcher } from './event-watcher.ts';
import { Factory } from './factory.ts';
import { TypedValue } from './typed-value.ts';
import type { KBObservable, ObservableOptions, ValueType, ViewModelOptions } from './types.ts';

const KEYS_PUBLISH = ['value', 'valueType', 'destroy'] as const;
const KEYS_INFO = ['args', 'read', 'write'] as const;

interface ObservableInstance {
  key: string | ko.Observable<string>;
  args?: unknown[];
  read?: (...args: unknown[]) => unknown;
  write?: (value: unknown) => void;
  _vm: Record<string, unknown>;
  _value: TypedValue;
  _model: ko.Observable<Backbone.Model | null>;
  model: ko.Computed<Backbone.Model | null>;
  __kb_released?: boolean;
}

// Observable class for model attributes
export class Observable implements ObservableInstance {
  key: string | ko.Observable<string>;
  args?: unknown[];
  read?: (...args: unknown[]) => unknown;
  write?: (value: unknown) => void;
  _vm: Record<string, unknown>;
  _value!: TypedValue;
  _model!: ko.Observable<Backbone.Model | null>;
  model!: ko.Computed<Backbone.Model | null>;
  __kb_released?: boolean;

  constructor(model: Backbone.Model | null, keyOrInfo: string | ObservableOptions, options?: ViewModelOptions, vm: Record<string, unknown> = {}) {
    return kb.ignore(() => {
      if (!keyOrInfo) kb._throwMissing(this, 'key_or_info');

      const info = typeof keyOrInfo === 'string' ? { key: keyOrInfo } : keyOrInfo;
      this.key = info.key || (keyOrInfo as string);
      this._vm = vm;

      // Copy info properties
      for (const key of KEYS_INFO) {
        if (info[key] !== undefined) {
          (this as Record<string, unknown>)[key] = info[key];
        }
      }

      const createOptions = utils.collapseOptions(options) as ViewModelOptions & { event_watcher?: EventWatcher };
      const eventWatcher = createOptions.event_watcher;
      delete createOptions.event_watcher;

      // Set up basics
      this._value = new TypedValue(createOptions);
      this._model = ko.observable(null);

      const observable = utils.wrappedObservable(
        this,
        ko.computed({
          read: () => {
            const _model = this._model();
            // Create dependency on args
            const args = [this.key].concat(this.args || []);
            for (const arg of args) {
              ko.utils.unwrapObservable(arg);
            }

            // Update event watcher
            const ew = utils.wrappedEventWatcher(this) as EventWatcher | undefined;
            ew?.emitter(_model || null);

            if (this.read) {
              this.update(this.read.apply(this._vm, args));
            } else if (_model !== undefined) {
              kb.ignore(() => this.update(kb.getValue(_model, kb.peek(this.key), this.args)));
            }

            return this._value.value();
          },

          write: (newValue: unknown) => {
            kb.ignore(() => {
              const unwrappedNewValue = utils.unwrapModels(newValue);
              const _model = kb.peek(this._model);

              if (this.write) {
                this.write.call(this._vm, unwrappedNewValue);
                newValue = kb.getValue(_model, kb.peek(this.key), this.args);
              } else if (_model) {
                kb.setValue(_model, kb.peek(this.key), unwrappedNewValue);
              }

              this.update(newValue);
            });
          },

          owner: this._vm,
        })
      ) as KBObservable;

      observable.__kb_is_o = true;
      createOptions.store = utils.wrappedStore(observable, createOptions.store);
      createOptions.path = utils.pathJoin(createOptions.path, this.key as string);

      // Handle factories
      if (createOptions.factories && (typeof createOptions.factories === 'function' || (createOptions.factories as { create?: unknown }).create)) {
        createOptions.factory = utils.wrappedFactory(observable, new Factory(createOptions.factory as Factory));
        (createOptions.factory as Factory).addPathMapping(createOptions.path, createOptions.factories);
      } else {
        createOptions.factory = Factory.useOptionsOrCreate(createOptions, observable, createOptions.path);
      }
      delete createOptions.factories;

      // Publish methods
      kb.publishMethods(observable as unknown as Record<string, unknown>, this as unknown as Record<string, unknown>, KEYS_PUBLISH as unknown as string[]);

      // Create model computed
      const modelComputed = ko.computed({
        read: () => ko.utils.unwrapObservable(this._model),
        write: (newModel: Backbone.Model | null) => {
          kb.ignore(() => {
            if (this.__kb_released || kb.peek(this._model) === newModel) return;

            const newValue = kb.getValue(newModel, kb.peek(this.key), this.args);
            this._model(newModel);

            if (!newModel) {
              this.update(null);
            } else if (newValue !== undefined) {
              this.update(newValue);
            }
          });
        },
      });

      observable.model = this.model = modelComputed;

      // Set up event watcher
      EventWatcher.useOptionsOrCreate(
        { event_watcher: eventWatcher },
        model || null,
        this,
        {
          emitter: (m: Backbone.Model | null) => this.model(m),
          update: () => kb.ignore(() => this.update()),
          key: this.key as string,
          path: createOptions.path,
        }
      );

      // Initialize value
      if (!this._value.rawValue()) {
        this._value.update();
      }

      // Wrap with localizer if specified
      let result: ko.Observable = observable;
      const LocalizedObservable = (kb as { LocalizedObservable?: new (o: ko.Observable) => ko.Observable }).LocalizedObservable;
      if (LocalizedObservable && info.localizer) {
        result = new info.localizer(result);
      }

      // Wrap with default observable if specified
      const defaultObservable = (kb as { defaultObservable?: (o: ko.Observable, d: unknown) => ko.Observable }).defaultObservable;
      if (defaultObservable && Object.prototype.hasOwnProperty.call(info, 'default')) {
        result = defaultObservable(result, info.default);
      }

      return result as unknown as Observable;
    }) as unknown as Observable;
  }

  // Clean up
  destroy(): void {
    const observable = utils.wrappedObservable(this);
    this.__kb_released = true;
    this._value.destroy();
    this._value = undefined as unknown as TypedValue;
    this.model.dispose();
    this.model = undefined as unknown as ko.Computed<Backbone.Model | null>;
    if (observable) {
      (observable as KBObservable).model = undefined;
    }
    utils.wrappedDestroy(this);
  }

  // Get raw value
  value(): unknown {
    return this._value.rawValue();
  }

  // Get value type
  valueType(): ValueType {
    return this._value.valueType(kb.peek(this._model), kb.peek(this.key));
  }

  // Update value
  update(newValue?: unknown): void {
    if (this.__kb_released) return;

    if (arguments.length === 0) {
      newValue = kb.getValue(kb.peek(this._model), kb.peek(this.key));
    }

    this._value.update(newValue);
  }
}

// Factory function
export function observable(model: Backbone.Model | null, key: string | ObservableOptions, options?: ViewModelOptions, viewModel?: Record<string, unknown>): ko.Observable {
  return new Observable(model, key, options, viewModel) as unknown as ko.Observable;
}

export default Observable;
