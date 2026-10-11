import type * as Backbone from 'backbone';
import type * as ko from 'knockout';
import { collectionObservable } from './collection-observable.ts';
import { observable } from './observable.ts';
import { type DefaultObservableResult, type DefaultObservable as DefaultObservableType, defaultObservable } from './plugins/defaults/default-observable.ts';
import { formattedObservable } from './plugins/formatting/formatted-observable.ts';
import { type LocalizedObservableOptions, localizedObservable } from './plugins/localization/localized-observable.ts';
import { triggeredObservable } from './plugins/triggering/triggered-observable.ts';
import type { CollectionObservableOptions, CollectionObservableValue, ModelInput, ObservableOptions, ObservableValue, ViewModelOptions } from './types.ts';

export interface ObservableConstructor {
  <T = unknown, M extends Backbone.Model = Backbone.Model>(model: ModelInput<M>, keyOrInfo: string | ObservableOptions, options?: ViewModelOptions, vm?: Record<string, unknown>): ObservableValue<T, M>;
  new <T = unknown, M extends Backbone.Model = Backbone.Model>(model: ModelInput<M>, keyOrInfo: string | ObservableOptions, options?: ViewModelOptions, vm?: Record<string, unknown>): ObservableValue<T, M>;
}

export interface CollectionObservableConstructor {
  <T = unknown, M extends Backbone.Model = Backbone.Model>(collection?: Backbone.Collection<M> | M[], viewModelOrOptions?: CollectionObservableOptions<T, M> | CollectionObservableOptions<T, M>['viewModel'], options?: CollectionObservableOptions<T, M>): CollectionObservableValue<T>;
  new <T = unknown, M extends Backbone.Model = Backbone.Model>(collection?: Backbone.Collection<M> | M[], viewModelOrOptions?: CollectionObservableOptions<T, M> | CollectionObservableOptions<T, M>['viewModel'], options?: CollectionObservableOptions<T, M>): CollectionObservableValue<T>;
}

export interface DefaultObservableConstructor {
  <Stored, Default extends Stored = Stored>(target: ko.Observable<Stored>, defaultValue: Default): DefaultObservableResult<Stored, Stored, Default>;
  <TargetRead, TargetWrite, Default extends TargetWrite = TargetWrite>(target: DefaultObservableType<TargetRead, TargetWrite>, defaultValue: Default): DefaultObservableResult<TargetRead, TargetWrite, Default>;
  new <Stored, Default extends Stored = Stored>(target: ko.Observable<Stored>, defaultValue: Default): DefaultObservableResult<Stored, Stored, Default>;
  new <TargetRead, TargetWrite, Default extends TargetWrite = TargetWrite>(target: DefaultObservableType<TargetRead, TargetWrite>, defaultValue: Default): DefaultObservableResult<TargetRead, TargetWrite, Default>;
}

export interface FormattedObservableConstructor {
  (format: string | ko.Observable<string>, ...args: ko.Observable[]): ReturnType<typeof formattedObservable>;
  new (format: string | ko.Observable<string>, ...args: ko.Observable[]): ReturnType<typeof formattedObservable>;
}

export interface TriggeredObservableConstructor {
  (emitter: Backbone.Events, eventSelector: string): ReturnType<typeof triggeredObservable>;
  new (emitter: Backbone.Events, eventSelector: string): ReturnType<typeof triggeredObservable>;
}

interface LocalizedObservablePrototype {
  read?: (value: unknown, observable?: ko.Observable | null) => unknown;
  write?: (localizedValue: unknown, value: unknown, observable?: ko.Observable | null) => void;
}

export interface LocalizedObservableConstructor {
  new (value: unknown, options?: Partial<LocalizedObservableOptions>, viewModel?: Record<string, unknown>): ReturnType<typeof localizedObservable>;
  prototype: LocalizedObservablePrototype;
  extend<Prototype extends Record<string, unknown> = Record<string, never>, Static extends Record<string, unknown> = Record<string, never>>(
    prototypeProperties?: Prototype & ThisType<LocalizedObservablePrototype & Omit<Prototype, 'constructor'>>,
    staticProperties?: Static
  ): LocalizedObservableConstructor & Static & { __super__: LocalizedObservablePrototype & Omit<Prototype, 'constructor'> };
}

function ObservableConstructorImplementation(model: ModelInput, keyOrInfo: string | ObservableOptions, options?: ViewModelOptions, vm?: Record<string, unknown>) {
  const create = observable as (input: ModelInput, info: string | ObservableOptions, createOptions?: ViewModelOptions, viewModel?: Record<string, unknown>) => ObservableValue;
  return create(model, keyOrInfo, options, vm);
}

function CollectionObservableConstructorImplementation(collection?: Backbone.Collection | Backbone.Model[], viewModelOrOptions?: CollectionObservableOptions | CollectionObservableOptions['viewModel'], options?: CollectionObservableOptions) {
  const create = collectionObservable as (input?: Backbone.Collection | Backbone.Model[], creatorOrOptions?: CollectionObservableOptions | CollectionObservableOptions['viewModel'], createOptions?: CollectionObservableOptions) => CollectionObservableValue;
  return create(collection, viewModelOrOptions, options);
}

function DefaultObservableConstructorImplementation(target: ko.Observable<unknown>, defaultValue: unknown) {
  return defaultObservable(target, defaultValue);
}

function FormattedObservableConstructorImplementation(format: string | ko.Observable<string>, ...args: ko.Observable[]) {
  return formattedObservable(format, ...args);
}

function TriggeredObservableConstructorImplementation(emitter: Backbone.Events, eventSelector: string) {
  return triggeredObservable(emitter, eventSelector);
}

function extendLocalizedObservable<Prototype extends Record<string, unknown>, Static extends Record<string, unknown>>(
  this: LocalizedObservableConstructor,
  prototypeProperties: Prototype = {} as Prototype,
  staticProperties: Static = {} as Static
): LocalizedObservableConstructor & Static & { __super__: LocalizedObservablePrototype & Omit<Prototype, 'constructor'> } {
  const parent = this;
  const constructorValue = (prototypeProperties as Record<string, unknown>).constructor;
  const child = (Object.hasOwn(prototypeProperties, 'constructor') && typeof constructorValue === 'function'
    ? constructorValue
    : function (this: LocalizedObservablePrototype, ...args: unknown[]) {
        Reflect.apply(parent as unknown as (...constructorArgs: unknown[]) => unknown, this, args);
      }) as unknown as LocalizedObservableConstructor & Static & { __super__: LocalizedObservablePrototype & Omit<Prototype, 'constructor'> };

  Object.assign(child, parent);
  child.prototype = Object.create(parent.prototype) as LocalizedObservablePrototype & Omit<Prototype, 'constructor'>;
  Object.assign(child.prototype, prototypeProperties);
  Object.assign(child, staticProperties);
  Object.defineProperty(child.prototype, 'constructor', { configurable: true, enumerable: false, value: child, writable: true });
  child.__super__ = parent.prototype as LocalizedObservablePrototype & Omit<Prototype, 'constructor'>;
  child.extend = parent.extend;
  return child;
}

const LocalizedObservableConstructorImplementation = function (this: LocalizedObservablePrototype, value: unknown, options: Partial<LocalizedObservableOptions> = {}, viewModel?: Record<string, unknown>) {
  const read = options.read ?? (this.read ? this.read.bind(this) : undefined);
  const write = options.write ?? (this.write ? this.write.bind(this) : undefined);
  return localizedObservable(value, { ...options, read, write } as LocalizedObservableOptions, viewModel);
} as unknown as LocalizedObservableConstructor;

LocalizedObservableConstructorImplementation.extend = extendLocalizedObservable;
Object.defineProperty(LocalizedObservableConstructorImplementation.prototype, 'constructor', {
  configurable: true,
  enumerable: false,
  value: LocalizedObservableConstructorImplementation,
  writable: true,
});

/** Published v1 validation namespace marker. Validation behavior lives in the root helpers. */
export class Validation {}

export const Observable = ObservableConstructorImplementation as ObservableConstructor;
export const CollectionObservable = CollectionObservableConstructorImplementation as CollectionObservableConstructor;
export const DefaultObservable = DefaultObservableConstructorImplementation as DefaultObservableConstructor;
export const FormattedObservable = FormattedObservableConstructorImplementation as FormattedObservableConstructor;
export const TriggeredObservable = TriggeredObservableConstructorImplementation as TriggeredObservableConstructor;
export const LocalizedObservable = LocalizedObservableConstructorImplementation;
