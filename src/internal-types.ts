import type * as Backbone from 'backbone';

export type Creator<T = unknown> = { create?: (obj: unknown, options: CreateOptions) => T; models_only?: boolean } | (new (obj: unknown, options: CreateOptions) => T) | ((obj: unknown, options: CreateOptions) => T);

export type FactoriesOption<T = unknown> = Record<string, Creator<T>> | Creator<T>;

export type FilterType = string | ((model: Backbone.Model) => boolean);

export interface CreateOptions {
  /** Path for nested view model creation */
  path?: string;
  /** Custom creator for view models */
  creator?: Creator;
}
