import type { Creator, InternalCreateOptions, InternalViewModelOptions } from './types.ts';
interface ObservableRecord {
  [cid: string]: unknown;
}
export declare class Store {
  static instances: Store[];
  __kb_released: boolean;
  observable_records: Record<string, ObservableRecord>;
  replaced_observables: unknown[];
  static useOptionsOrCreate(options: InternalViewModelOptions, obj: unknown, observable: any): Store;
  constructor();
  destroy(): void;
  clear(): void;
  compact(): void;
  retain(observable: unknown, obj: unknown, creator?: Creator): unknown;
  retainOrCreate(obj: unknown, options: InternalCreateOptions, deepRetain?: boolean): unknown;
  reuse(observable: unknown, obj: unknown): void;
  release(observable: unknown, force?: boolean): void;
  find(obj: unknown, creator: Creator): unknown;
  private _refCount;
  private _canRegister;
  private _cid;
  private _creatorId;
  private _storeReferences;
  private _getOrCreateStoreReferences;
  private _clearStoreReferences;
  private _retire;
  private _add;
  private _remove;
  private _creator;
}
export default Store;
