import type * as Backbone from 'backbone';
import ko from 'knockout';
import { type ORM, resolveORM } from './configure.ts';
import { KB_DISPOSE_STATE } from './constants.ts';
import type { KnockbackGlobal } from './internal-types.ts';
import { _throwMissing, _throwUnexpected, wasReleased } from './kb.ts';
import type { EventCallbackInfo, EventWatcher as EventWatcherInterface, KBMetadata, ModelInput, ModelReference } from './types.ts';
import { disposeMetadata, isModelReference, type KBObject, resolveModel, wrappedEventWatcher, wrappedEventWatcherIsOwned } from './utils.ts';

/** @internal */
export interface CallbackInfo extends EventCallbackInfo {
  unbindFn?: (() => void) | null;
  emitterAfterCallbacks?: boolean;
  emitterPrepare?: (model: Backbone.Model | null, reference: ModelReference | null) => (() => void) | void;
}

interface CallbackRecord {
  model: Backbone.Model | null;
  list: CallbackInfo[];
  fn: (model?: Backbone.Model) => null;
}

interface EventWatcherMetadata extends KBMetadata {
  callbacks?: Record<string, CallbackRecord> | null;
}

function notifyEmitters(callbackInfos: CallbackInfo[], model: Backbone.Model | null, isCurrent: () => boolean): void {
  const deferred: CallbackInfo[] = [];

  for (const info of callbackInfos) {
    if (!isCurrent()) return;
    if (wasReleased(info.obj)) continue;
    if (!info.emitter) continue;
    if (info.emitterAfterCallbacks) {
      deferred.push(info);
    } else {
      info.emitter(model);
    }
  }

  for (const info of deferred) {
    if (!isCurrent()) return;
    if (wasReleased(info.obj)) continue;
    info.emitter?.(model);
  }
}

// Aggregates model events for efficient event handling
export class EventWatcher {
  __kb: EventWatcherMetadata;
  __kb_dispose?: number;
  ee: Backbone.Model | null = null;
  modelRef: ModelReference | null = null;
  orm: ORM | null = null;
  private _attachmentGeneration = 0;

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
    if (this.__kb_dispose && this.__kb_dispose >= KB_DISPOSE_STATE.DISPOSED) return;
    this.__kb_dispose = KB_DISPOSE_STATE.DISPOSED;
    this.emitter(null);
    this.__kb.callbacks = null;
    disposeMetadata(this);
  }

  destroy(): void {
    this.dispose();
  }

  release(): void {
    this.dispose();
  }

  // Get or set the emitter (model)
  emitter(): Backbone.Model | null;
  emitter(newEmitter: ModelInput): Backbone.Model | null;
  emitter(newEmitter?: ModelInput): Backbone.Model | null {
    // Getter
    if (newEmitter === undefined) {
      return this.ee;
    }

    const nextReference = isModelReference(newEmitter) ? newEmitter : null;
    const nextModel = resolveModel(newEmitter);
    this._admitEmitter(nextModel, nextReference);
    if (this.modelRef === nextReference && this.ee === nextModel) return this.ee;
    const referenceChanged = this.modelRef !== nextReference;

    if (referenceChanged && this.modelRef) {
      this.modelRef.unbind('loaded', this._onModelLoaded);
      this.modelRef.unbind('unloaded', this._onModelUnloaded);
      this.modelRef.release();
      this.modelRef = null;
    }

    if (referenceChanged && nextReference) {
      this.modelRef = nextReference;
      this.modelRef.retain();
      this.modelRef.bind('loaded', this._onModelLoaded);
      this.modelRef.bind('unloaded', this._onModelUnloaded);
    }
    if (referenceChanged) this._attachmentGeneration++;

    // Switch bindings
    if (nextModel) {
      this._loadModel(nextModel);
    } else if (this.ee) {
      this._unloadModel();
    }

    return nextModel;
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
    const generation = ++this._attachmentGeneration;
    this.ee = null;
    const callbackInfos: CallbackInfo[] = [];
    if (this.__kb.callbacks) {
      for (const eventName in this.__kb.callbacks) {
        const callbacks = this.__kb.callbacks[eventName];
        const infos = this._unbindCallbacks(eventName, callbacks);
        if (!wasReleased(obj)) callbackInfos.push(...infos);
      }
    }
    notifyEmitters(callbackInfos, null, () => generation === this._attachmentGeneration && this.ee === null);
    delete this.__kb.callbacks;
  }

  private _admitEmitter(model: Backbone.Model | null, reference: ModelReference | null): void {
    const generation = this._attachmentGeneration;
    const emitter = this.ee;
    const previousReference = this.modelRef;
    const preparations: Array<() => void> = [];
    const seen = new Set<NonNullable<CallbackInfo['emitterPrepare']>>();
    for (const callbacks of Object.values(this.__kb.callbacks || {})) {
      for (const info of callbacks.list) {
        if (!info.emitterPrepare || seen.has(info.emitterPrepare) || wasReleased(info.obj)) continue;
        seen.add(info.emitterPrepare);
        const commit = info.emitterPrepare(model, reference);
        if (commit) preparations.push(commit);
      }
    }
    if (generation !== this._attachmentGeneration || this.ee !== emitter || this.modelRef !== previousReference) _throwUnexpected(this, 'emitter changed during attachment admission');
    for (const commit of preparations) commit();
  }

  // Model loaded handler
  private _onModelLoaded = (model: Backbone.Model): void => {
    this._admitEmitter(model, this.modelRef);
    this._loadModel(model);
  };

  private _loadModel(model: Backbone.Model): void {
    const newAttachment = this.ee !== model;
    if (newAttachment) this._attachmentGeneration++;
    const generation = this._attachmentGeneration;
    const isCurrent = (): boolean => generation === this._attachmentGeneration && this.ee === model;
    this.ee = model;
    if (newAttachment) this.orm = resolveORM(model);

    if (!this.__kb.callbacks) return;
    const callbackInfos: CallbackInfo[] = [];

    for (const eventName in this.__kb.callbacks) {
      if (!isCurrent()) return;
      const callbacks = this.__kb.callbacks[eventName];

      // Unbind from old model if different
      if (callbacks.model && callbacks.model !== model) {
        this._unbindCallbacks(eventName, callbacks);
      }
      if (!isCurrent()) return;

      // Bind to new model
      if (!callbacks.model) {
        callbacks.model = model;
        model.on(eventName, callbacks.fn);
      }

      // Process each callback info
      for (const info of callbacks.list) {
        // ORM binding support
        if (!info.unbindFn && info.key && info.update && info.path) {
          const orm = this.orm;
          if (orm?.bind) {
            const unbind = orm.bind(model, info.key as string, info.update, info.path) || null;
            if (!isCurrent()) {
              unbind?.();
              return;
            }
            info.unbindFn = unbind;
          }
        }

        callbackInfos.push(info);
      }
    }

    notifyEmitters(callbackInfos, model, isCurrent);
  }

  // Model unloaded handler
  private _onModelUnloaded = (model: Backbone.Model): void => {
    if (this.ee !== model) return;
    this._admitEmitter(null, this.modelRef);
    this._unloadModel();
  };

  private _unloadModel(): void {
    const generation = ++this._attachmentGeneration;
    const isCurrent = (): boolean => generation === this._attachmentGeneration && this.ee === null;
    this.ee = null;
    const callbackInfos: CallbackInfo[] = [];
    if (this.__kb.callbacks) {
      for (const eventName in this.__kb.callbacks) {
        const callbacks = this.__kb.callbacks[eventName];
        if (!isCurrent()) return;
        callbackInfos.push(...this._unbindCallbacks(eventName, callbacks));
      }
    }
    if (!isCurrent()) return;
    this.orm = null;
    notifyEmitters(callbackInfos, null, isCurrent);
  }

  // Unbind callbacks
  private _unbindCallbacks = (eventName: string, callbacks: CallbackRecord): CallbackInfo[] => {
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

      if (info.emitter && !wasReleased(info.obj)) {
        callbackInfos.push(info);
      }
    }

    return callbackInfos;
  };
}

// Factory function
export function emitterObservable(emitter: ModelInput, observable: unknown): EventWatcher {
  return new EventWatcher(emitter, observable);
}

export default EventWatcher;
