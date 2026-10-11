import type * as Backbone from 'backbone';
import ko from 'knockout';
import { KB_DISPOSE_STATE } from './constants.ts';
import type { KnockbackGlobal } from './internal-types.ts';
import { _throwMissing, _throwUnexpected, settings, wasReleased } from './kb.ts';
import type { EventCallbackInfo, EventWatcher as EventWatcherInterface, KBMetadata, ModelInput, ModelReference } from './types.ts';
import { disposeMetadata, isModelReference, type KBObject, resolveModel, wrappedEventWatcher, wrappedEventWatcherIsOwned } from './utils.ts';

/** @internal */
export interface CallbackInfo extends EventCallbackInfo {
  unbindFn?: (() => void) | null;
  emitterAfterCallbacks?: boolean;
}

interface CallbackRecord {
  model: Backbone.Model | null;
  list: CallbackInfo[];
  fn: (model?: Backbone.Model) => null;
}

interface EventWatcherMetadata extends KBMetadata {
  callbacks?: Record<string, CallbackRecord> | null;
}

function notifyEmitters(callbackInfos: CallbackInfo[], model: Backbone.Model | null): void {
  const deferred: CallbackInfo[] = [];

  for (const info of callbackInfos) {
    if (!info.emitter) continue;
    if (info.emitterAfterCallbacks) {
      deferred.push(info);
    } else {
      info.emitter(model);
    }
  }

  for (const info of deferred) {
    info.emitter?.(model);
  }
}

// Aggregates model events for efficient event handling
export class EventWatcher {
  __kb: EventWatcherMetadata;
  __kb_dispose?: number;
  ee: Backbone.Model | null = null;
  modelRef: ModelReference | null = null;

  // Use existing event watcher from options or create a new one
  static useOptionsOrCreate(options: { eventWatcher?: EventWatcherInterface }, emitter: ModelInput, obj: KBObject, callbackOptions: CallbackInfo): EventWatcher {
    if (options.eventWatcher) {
      const ew = options.eventWatcher;
      if (ew.emitter() !== emitter && ew.modelRef !== emitter) {
        _throwUnexpected('EventWatcher', 'emitter not matching');
      }
      const watcher = wrappedEventWatcher(obj, ew) as EventWatcher;
      watcher.registerCallbacks(obj, callbackOptions);
      return watcher;
    }

    wrappedEventWatcherIsOwned(obj, true);
    const watcher = wrappedEventWatcher(obj, new EventWatcher(emitter)) as EventWatcher;
    watcher.registerCallbacks(obj, callbackOptions);
    return watcher;
  }

  constructor(emitter?: ModelInput, obj?: unknown, callbackOptions?: CallbackInfo) {
    this.__kb = { callbacks: {} };

    if (callbackOptions && obj) {
      this.registerCallbacks(obj, callbackOptions);
    }
    if (emitter) {
      this.emitter(emitter);
    }
  }

  // Clean up
  dispose(): void {
    if (this.__kb_dispose && this.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) return;
    this.__kb_dispose = KB_DISPOSE_STATE.DISPOSED;
    this.emitter(null);
    this.__kb.callbacks = null;
    disposeMetadata(this);
  }

  // Get or set the emitter (model)
  emitter(): Backbone.Model | null;
  emitter(newEmitter: ModelInput): Backbone.Model | null;
  emitter(newEmitter?: ModelInput): Backbone.Model | null {
    // Getter
    if (newEmitter === undefined) {
      return this.ee;
    }

    // Setter - no change
    if (this.modelRef ? this.modelRef === newEmitter : this.ee === newEmitter) {
      return this.ee;
    }

    if (this.modelRef) {
      this.modelRef.unbind('loaded', this._onModelLoaded);
      this.modelRef.unbind('unloaded', this._onModelUnloaded);
      this.modelRef.release();
      this.modelRef = null;
    }

    if (isModelReference(newEmitter)) {
      this.modelRef = newEmitter;
      this.modelRef.retain();
      this.modelRef.bind('loaded', this._onModelLoaded);
      this.modelRef.bind('unloaded', this._onModelUnloaded);
      newEmitter = resolveModel(this.modelRef);
    }

    // Switch bindings
    if (newEmitter) {
      this._onModelLoaded(newEmitter);
    } else if (this.ee) {
      this._onModelUnloaded(this.ee);
    }

    return newEmitter;
  }

  // Register callbacks for model events
  registerCallbacks(obj: unknown, callbackInfo: CallbackInfo): this {
    if (!obj) _throwMissing(this, 'obj');
    if (!callbackInfo) _throwMissing(this, 'callbackInfo');

    const eventNames = callbackInfo.eventSelector ? callbackInfo.eventSelector.split(' ') : ['change'];
    const model = this.ee;

    for (const eventName of eventNames) {
      if (!eventName) continue; // Skip empty strings from extra spaces

      let callbacks = this.__kb.callbacks?.[eventName];
      if (!callbacks) {
        callbacks = {
          model: null,
          list: [],
          fn: (eventModel?: Backbone.Model): null => {
            const callbackList = callbacks?.list ?? [];
            for (const info of callbackList) {
              if (!info.update) continue;

              // Check if key matches for change events
              if (eventModel && info.key) {
                const key = ko.utils.unwrapObservable(info.key);
                if (eventModel.hasChanged && !eventModel.hasChanged(key)) {
                  continue;
                }
              }

              // Track statistics if available
              if ((globalThis as KnockbackGlobal).statistics) {
                ((globalThis as KnockbackGlobal).statistics as NonNullable<KnockbackGlobal['statistics']>).addModelEvent({
                  name: eventName,
                  model: eventModel,
                  key: info.key,
                  path: info.path,
                });
              }

              info.update();
            }
            return null;
          },
        };
        if (this.__kb.callbacks) {
          this.__kb.callbacks[eventName] = callbacks;
        }
      }

      // Store callback info
      const info: CallbackInfo = { obj, ...callbackInfo };
      callbacks.list.push(info);

      if (model) {
        this._onModelLoaded(model);
      }
    }

    return this;
  }

  // Release callbacks for an object
  releaseCallbacks(obj: unknown): void {
    this.ee = null;

    if (this.__kb.callbacks) {
      for (const eventName in this.__kb.callbacks) {
        const callbacks = this.__kb.callbacks[eventName];
        this._unbindCallbacks(eventName, callbacks, wasReleased(obj));
      }
    }

    delete this.__kb.callbacks;
  }

  // Model loaded handler
  private _onModelLoaded = (model: Backbone.Model): void => {
    this.ee = model;

    if (!this.__kb.callbacks) return;
    const callbackInfos: CallbackInfo[] = [];

    for (const eventName in this.__kb.callbacks) {
      const callbacks = this.__kb.callbacks[eventName];

      // Unbind from old model if different
      if (callbacks.model && callbacks.model !== model) {
        this._unbindCallbacks(eventName, callbacks, true);
      }

      // Bind to new model
      if (!callbacks.model) {
        callbacks.model = model;
        model.on(eventName, callbacks.fn);
      }

      // Process each callback info
      for (const info of callbacks.list) {
        // ORM binding support
        if (!info.unbindFn && info.key && info.update && info.path) {
          const orm = settings.orm;
          if (orm?.bind) {
            info.unbindFn = orm.bind(model, info.key as string, info.update, info.path) || null;
          }
        }

        callbackInfos.push(info);
      }
    }

    notifyEmitters(callbackInfos, model);
  };

  // Model unloaded handler
  private _onModelUnloaded = (model: Backbone.Model): void => {
    if (this.ee !== model) return;

    this.ee = null;

    if (this.__kb.callbacks) {
      for (const eventName in this.__kb.callbacks) {
        const callbacks = this.__kb.callbacks[eventName];
        this._unbindCallbacks(eventName, callbacks);
      }
    }
  };

  // Unbind callbacks
  private _unbindCallbacks = (eventName: string, callbacks: CallbackRecord, skipEmitter?: boolean): void => {
    // Unbind from model
    if (callbacks.model) {
      callbacks.model.off(eventName, callbacks.fn);
      callbacks.model = null;
    }

    const callbackInfos: CallbackInfo[] = [];
    for (const info of callbacks.list) {
      if (info.unbindFn) {
        info.unbindFn();
        info.unbindFn = null;
      }

      if (info.emitter && !skipEmitter && !wasReleased(info.obj)) {
        callbackInfos.push(info);
      }
    }

    notifyEmitters(callbackInfos, null);
  };
}

// Factory function
export function emitterObservable(emitter: ModelInput, observable: unknown): EventWatcher {
  return new EventWatcher(emitter, observable);
}

export default EventWatcher;
