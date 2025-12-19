import type { Creator, FactoriesOption, InternalViewModelOptions } from './types.ts';
interface PathMapping {
  view_model?: Creator;
  [key: string]: unknown;
}
export declare class Factory {
  paths: Record<string, Creator | PathMapping>;
  parent_factory?: Factory;
  static useOptionsOrCreate(options: InternalViewModelOptions, obj: unknown, ownerPath?: string): Factory;
  constructor(parentFactory?: Factory);
  hasPath(path: string): boolean;
  addPathMapping(path: string, createInfo: Creator | PathMapping): void;
  addPathMappings(factories: FactoriesOption, ownerPath?: string): void;
  hasPathMappings(factories: FactoriesOption, ownerPath?: string): boolean;
  creatorForPath(_obj: unknown, path: string): Creator | undefined;
}
export default Factory;
