import type * as Backbone from 'backbone';
import type * as ko from 'knockout';
import type { CollectionObservable, CollectionObservableOptions, LocaleManager, Observable, ObservableOptions, ViewModel, ViewModelOptions } from './types.ts';
import type { LocalizedObservableOptions } from './plugins/localization/index.ts';
import type { Statistics } from './statistics.ts';

export { observable } from './observable.ts';
export { viewModel } from './view-model.ts';
export { collectionObservable } from './collection-observable.ts';

export const VERSION: string;
export const release: typeof import('./kb.ts').default.release;
export const releaseOnNodeRemove: typeof import('./kb.ts').default.releaseOnNodeRemove;
export const applyBindings: typeof import('./kb.ts').default.applyBindings;
export const renderTemplate: typeof import('./kb.ts').default.renderTemplate;
export const wasReleased: typeof import('./kb.ts').default.wasReleased;
export const isReleaseable: typeof import('./kb.ts').default.isReleaseable;
export const isModel: typeof import('./kb.ts').default.isModel;
export const isCollection: typeof import('./kb.ts').default.isCollection;
export const isViewModel: typeof import('./kb.ts').default.isViewModel;

export const getLocaleManager: () => LocaleManager | null;
export const setLocaleManager: (manager: LocaleManager | null) => void;
export { localizedObservable } from './plugins/localization/index.ts';

export { defaultObservable } from './plugins/defaults/index.ts';
export { formattedObservable, parseFormattedString, toFormattedString } from './plugins/formatting/index.ts';
export { triggeredObservable } from './plugins/triggering/index.ts';

export { valueValidator, formValidator, minLengthFn, valid } from './plugins/validation/index.ts';

export const getStatistics: () => Statistics | null;
export const setStatistics: (stats: Statistics | null) => void;
export { Statistics } from './statistics.ts';

export { TYPE_ARRAY, TYPE_COLLECTION, TYPE_MODEL, TYPE_SIMPLE, TYPE_UNKNOWN } from './types.ts';
export type { LocalizedObservableOptions } from './plugins/localization/index.ts';
export type { CollectionObservable, CollectionObservableOptions, LocaleManager, Observable, ObservableOptions, ViewModel, ViewModelOptions } from './types.ts';

export const kb: {
  ViewModel: new (
    ...args: unknown[]
  ) => {
    destroy(): void;
    model: ko.Computed<Backbone.Model | null>;
    createObservables(model: Backbone.Model, keys: string[]): void;
    [key: string]: unknown;
  };
  observable: typeof import('./observable.ts').observable;
  viewModel: typeof import('./view-model.ts').viewModel;
  collectionObservable: typeof import('./collection-observable.ts').collectionObservable;
  VERSION: typeof VERSION;
  TYPE_ARRAY: typeof import('./types.ts').TYPE_ARRAY;
  TYPE_COLLECTION: typeof import('./types.ts').TYPE_COLLECTION;
  TYPE_MODEL: typeof import('./types.ts').TYPE_MODEL;
  TYPE_SIMPLE: typeof import('./types.ts').TYPE_SIMPLE;
  TYPE_UNKNOWN: typeof import('./types.ts').TYPE_UNKNOWN;
  release: typeof release;
  releaseOnNodeRemove: typeof releaseOnNodeRemove;
  applyBindings: typeof applyBindings;
  renderTemplate: typeof renderTemplate;
  wasReleased: typeof wasReleased;
  isReleaseable: typeof isReleaseable;
  isModel: typeof isModel;
  isCollection: typeof isCollection;
  isViewModel: typeof isViewModel;
  localizedObservable: typeof import('./plugins/localization/index.ts').localizedObservable;
  defaultObservable: typeof import('./plugins/defaults/index.ts').defaultObservable;
  formattedObservable: typeof import('./plugins/formatting/index.ts').formattedObservable;
  parseFormattedString: typeof import('./plugins/formatting/index.ts').parseFormattedString;
  toFormattedString: typeof import('./plugins/formatting/index.ts').toFormattedString;
  triggeredObservable: typeof import('./plugins/triggering/index.ts').triggeredObservable;
  valueValidator: typeof import('./plugins/validation/index.ts').valueValidator;
  formValidator: typeof import('./plugins/validation/index.ts').formValidator;
  minLengthFn: typeof import('./plugins/validation/index.ts').minLengthFn;
  valid: typeof import('./plugins/validation/index.ts').valid;
  Statistics: typeof Statistics;
};

export default kb;

export namespace kb {
  export type Observable<T = unknown> = import('./types.ts').Observable<T>;
  export type ObservableOptions = import('./types.ts').ObservableOptions;
  export type CollectionObservable<T = unknown> = import('./types.ts').CollectionObservable<T>;
  export type CollectionObservableOptions<T = unknown> = import('./types.ts').CollectionObservableOptions<T>;
  export type ViewModel<T extends Record<string, unknown> = Record<string, ko.Observable>> = import('./types.ts').ViewModel<T>;
  export type ViewModelOptions = import('./types.ts').ViewModelOptions;
  export type LocaleManager = import('./types.ts').LocaleManager;
  export type LocalizedObservableOptions = import('./plugins/localization/index.ts').LocalizedObservableOptions;
}
