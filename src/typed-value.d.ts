import type * as Backbone from 'backbone';
import type { InternalCreateOptions, ValueType } from './types.ts';
export declare class TypedValue {
  __kb_released: boolean;
  __kb_value: unknown;
  value_type?: ValueType;
  create_options: InternalCreateOptions;
  private _vo;
  constructor(createOptions: InternalCreateOptions);
  destroy(): void;
  value(): unknown;
  rawValue(): unknown;
  valueType(model: Backbone.Model | null, key: string): ValueType;
  update(newValue?: unknown): void;
  private _updateValueObservable;
}
export default TypedValue;
