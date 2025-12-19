import type * as Backbone from 'backbone';
import ko from 'knockout';
import { TypedValue } from './typed-value.ts';
import type { KBObservable, ObservableOptions, ValueType, ViewModelOptions } from './types.ts';
export interface ObservableInstance {
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
  destroy(): void;
  value(): unknown;
  valueType(): ValueType;
  update(newValue?: unknown): void;
}
/**
 * Creates a Knockout observable bound to a Backbone model attribute.
 *
 * @param model - The Backbone model to observe
 * @param keyOrInfo - Attribute key string or options object
 * @param options - Additional view model options
 * @param vm - Parent view model context
 * @returns A Knockout observable with Knockback extensions
 */
export declare function observable(model: Backbone.Model | null, keyOrInfo: string | ObservableOptions, options?: ViewModelOptions, vm?: Record<string, unknown>): KBObservable;
export default observable;
