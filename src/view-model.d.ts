import type * as Backbone from 'backbone';
import ko from 'knockout';
import type { InternalCreateOptions, KBMetadata, ObservableOptions, ViewModelOptions } from './types.ts';
import { type KBObject } from './utils.ts';
/**
 * Extended metadata for ViewModels
 * @hidden
 * @internal
 */
interface ViewModelMetadata extends KBMetadata {
  view_model?: ViewModel;
  keys?: string[] | Record<string, ObservableOptions>;
  internals?: string[];
  excludes?: string[];
  statics?: string[];
  static_defaults?: Record<string, unknown>;
  path?: string;
  create_options?: InternalCreateOptions;
  vm_keys?: Record<string, boolean>;
}
/**
 * ViewModel class for Backbone models.
 * Creates Knockout observables for all model attributes automatically.
 */
declare class ViewModel implements KBObject {
  [key: string]: unknown;
  __kb: ViewModelMetadata;
  __kb_released?: boolean;
  __kb_is_vm: boolean;
  model: ko.Computed<Backbone.Model | null>;
  constructor(model: Backbone.Model | null, options?: ViewModelOptions | string[], viewModel?: ViewModel);
  private _initialize;
  destroy(): void;
  shareOptions(): {
    store: unknown;
    factory: unknown;
  };
  createObservables(model: Backbone.Model | null | undefined, keys?: string[] | Record<string, ObservableOptions>): void;
}
export type { ViewModel };
/**
 * Creates a ViewModel for a Backbone model.
 *
 * @param model - The Backbone model
 * @param options - View model options or array of attribute keys
 * @param vm - Parent view model (for nested creation)
 * @returns A new ViewModel instance
 */
export declare function viewModel(model: Backbone.Model | null, options?: ViewModelOptions | string[], vm?: ViewModel): ViewModel;
export default viewModel;
