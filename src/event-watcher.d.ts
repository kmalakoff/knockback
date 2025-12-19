import type * as Backbone from 'backbone';
import type { EventCallbackInfo, EventWatcher as EventWatcherInterface, KBMetadata } from './types.ts';
/** @internal */
export interface CallbackInfo extends EventCallbackInfo {
  unbind_fn?: (() => void) | null;
}
interface CallbackRecord {
  model: Backbone.Model | null;
  list: CallbackInfo[];
  fn: (model?: Backbone.Model) => null;
}
interface EventWatcherMetadata extends KBMetadata {
  callbacks?: Record<string, CallbackRecord> | null;
}
export declare class EventWatcher {
  __kb: EventWatcherMetadata;
  ee: Backbone.Model | null;
  static useOptionsOrCreate(
    options: {
      event_watcher?: EventWatcherInterface;
    },
    emitter: Backbone.Model | null,
    obj: unknown,
    callbackOptions: CallbackInfo
  ): EventWatcher;
  constructor(emitter?: Backbone.Model | null, obj?: unknown, callbackOptions?: CallbackInfo);
  destroy(): void;
  emitter(): Backbone.Model | null;
  emitter(newEmitter: Backbone.Model | null): Backbone.Model | null;
  registerCallbacks(obj: unknown, callbackInfo: CallbackInfo): this;
  releaseCallbacks(obj: unknown): void;
  private _onModelLoaded;
  private _onModelUnloaded;
  private _unbindCallbacks;
}
export declare function emitterObservable(emitter: Backbone.Model, observable: unknown): EventWatcher;
export default EventWatcher;
