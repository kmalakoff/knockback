import type * as Backbone from 'backbone';

// Creator types - union of different creator patterns
export type CreatorObject<T = unknown> = { create?: (obj: unknown, options: CreateOptions) => T; modelsOnly?: boolean };
export type CreatorConstructor<T = unknown> = new (obj: unknown, options: CreateOptions) => T;
export type CreatorFunction<T = unknown> = (obj: unknown, options: CreateOptions) => T;

export type Creator<T = unknown> = CreatorObject<T> | CreatorConstructor<T> | CreatorFunction<T>;

export type FactoriesOption<T = unknown> = Record<string, Creator<T>> | Creator<T>;

// Type guards for Creator discrimination
export function isCreatorObject<T>(creator: Creator<T>): creator is CreatorObject<T> {
  return creator !== null && typeof creator === 'object' && 'create' in creator && typeof creator.create === 'function';
}

export function isCreatorConstructor<T>(creator: Creator<T>): creator is CreatorConstructor<T> {
  // Check if it's a constructor (has prototype and is not an arrow function)
  return typeof creator === 'function' && creator.prototype !== undefined;
}

export function isCreatorFunction<T>(creator: Creator<T>): creator is CreatorFunction<T> {
  return typeof creator === 'function' && !isCreatorObject(creator);
}

export type FilterType = string | ((model: Backbone.Model) => boolean);

export interface CreateOptions {
  /** Path for nested view model creation */
  path?: string;
  /** Custom creator for view models */
  creator?: Creator;
}
