import type * as Backbone from 'backbone';

export type KnockbackGlobal = typeof globalThis & {
  kb?: {
    VERSION: string;
    localeManager?: import('./types.ts').LocaleManager | null;
  };
  statistics?: import('./statistics.ts').Statistics | null;
  ViewModel?: typeof import('./view-model.ts').ViewModelClass;
  CollectionObservable?: typeof import('./collection-observable.ts').collectionObservable;
  viewModel?: typeof import('./view-model.ts').viewModel;
  collectionObservable?: typeof import('./collection-observable.ts').collectionObservable;
  defaultObservable?: typeof import('./plugins/defaults/default-observable.ts').defaultObservable;
};

// Creator types - union of different creator patterns
export type CreatorObject<T = unknown, Input = unknown, Options = CreateOptions> = { create?: (obj: Input, options: Options) => T; modelsOnly?: boolean };
export type CreatorConstructor<T = unknown, Input = unknown, Options = CreateOptions> = new (obj: Input, options: Options) => T;
export type CreatorFunction<T = unknown, Input = unknown, Options = CreateOptions> = (obj: Input, options: Options) => T;

export type Creator<T = unknown, Input = unknown, Options = CreateOptions> = CreatorObject<T, Input, Options> | CreatorConstructor<T, Input, Options> | CreatorFunction<T, Input, Options>;

// Stored creators are identities; dispatch sites re-establish their dynamic call contract.
export type StoredCreator = Creator<unknown, never, never>;

export type FactoriesOption<T = unknown> = Record<string, unknown> | Creator<T, never, never>;

// Type guards for Creator discrimination
export function isCreatorObject<T, Input = unknown, Options = CreateOptions>(creator: Creator<T, Input, Options>): creator is CreatorObject<T, Input, Options> & { create: NonNullable<CreatorObject<T, Input, Options>['create']> } {
  return creator !== null && typeof creator === 'object' && 'create' in creator && typeof creator.create === 'function';
}

export function isCreatorConstructor<T, Input = unknown, Options = CreateOptions>(creator: Creator<T, Input, Options>): creator is CreatorConstructor<T, Input, Options> {
  // Check if it's a constructor (has prototype and is not an arrow function)
  return typeof creator === 'function' && creator.prototype !== undefined;
}

export function isCreatorFunction<T, Input = unknown, Options = CreateOptions>(creator: Creator<T, Input, Options>): creator is CreatorFunction<T, Input, Options> {
  return typeof creator === 'function' && !isCreatorObject(creator);
}

export type FilterType = string | ((model: Backbone.Model) => boolean);

export interface CreateOptions {
  /** Path for nested view model creation */
  path?: string;
  /** Custom creator for view models */
  creator?: Creator;
}
