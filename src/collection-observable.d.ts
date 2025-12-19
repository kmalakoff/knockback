import Backbone from 'backbone';
import ko from 'knockout';
import type { CollectionObservableOptions, InternalCreateOptions, KBCollectionObservable } from './types.ts';
type ComparatorFn = (a: unknown, b: unknown) => number;
export interface CollectionObservableInstance {
  __kb: Record<string, unknown>;
  __kb_released?: boolean;
  in_edit: number;
  models_only?: boolean;
  auto_compact?: boolean;
  path?: string;
  create_options: InternalCreateOptions;
  collection: ko.Computed<Backbone.Collection | null>;
  destroy(): void;
  shareOptions(): {
    store: unknown;
    factory: unknown;
  };
  filters(filters?: unknown | unknown[]): void;
  comparator(comparator: ComparatorFn | null): void;
  sortAttribute(sortAttribute: string | null): void;
  viewModelByModel(model: Backbone.Model): unknown | null;
  hasViewModels(): boolean;
  compact(): void;
}
export declare function compare(valueA: unknown, valueB: unknown): number;
/**
 * Creates an observable array bound to a Backbone collection.
 *
 * @param inputCollection - Backbone collection or array of models
 * @param viewModelOrOptions - ViewModel constructor or options
 * @param options - Additional options
 * @returns A Knockout observable array with Knockback extensions
 */
export declare function collectionObservable(inputCollection?: Backbone.Collection | unknown[], viewModelOrOptions?: unknown, options?: CollectionObservableOptions): KBCollectionObservable;
export default collectionObservable;
