import Backbone from 'backbone';
import ko from 'knockout';
import collapseOptions from './functions/collapse-options.ts';
import unwrapModels from './functions/unwrap-models.ts';
import wrappedDestroy from './functions/wrapped-destroy.ts';
import type { Creator, EventWatcher, Factory, KBMetadata, Store, ValueType, ViewModelOptions } from './types.ts';
/**
 * Any object that can have __kb metadata
 * @hidden
 * @internal
 */
export type KBObject = {
  __kb?: KBMetadata;
} & Record<string, any>;
/** Get a value from __kb metadata */
export declare function get<T>(obj: KBObject, key: keyof KBMetadata, defaultValue?: T): T | undefined;
/** Set a value in __kb metadata */
export declare function set<T>(obj: KBObject, key: keyof KBMetadata, value: T): T;
/** Set a value only if it doesn't exist */
export declare function orSet<T>(obj: KBObject, key: keyof KBMetadata, value: T): T;
/** Check if __kb has a key */
export declare function has(obj: KBObject, key: keyof KBMetadata): boolean;
export declare function getObservable(obj: KBObject): ko.Observable | ko.Computed | ko.ObservableArray | undefined;
export declare function setObservable(obj: KBObject, value: ko.Observable | ko.Computed | ko.ObservableArray): ko.Observable | ko.Computed | ko.ObservableArray;
export declare function getObject(obj: KBObject): Backbone.Model | Backbone.Collection | null | undefined;
export declare function setObject(obj: KBObject, value: Backbone.Model | Backbone.Collection | null): Backbone.Model | Backbone.Collection | null;
export declare function getCreator(obj: KBObject): Creator | undefined;
export declare function setCreator(obj: KBObject, value: Creator): Creator;
export declare function getModel(obj: KBObject): Backbone.Model | KBObject | null | undefined;
export declare function setModel(obj: KBObject, value: Backbone.Model | null): Backbone.Model | null;
export declare function getStore(obj: KBObject): Store | undefined;
export declare function setStore(obj: KBObject, value: Store): Store;
export declare function getStoreIsOwned(obj: KBObject): boolean | undefined;
export declare function setStoreIsOwned(obj: KBObject, value: boolean): boolean;
export declare function getFactory(obj: KBObject): Factory | undefined;
export declare function setFactory(obj: KBObject, value: Factory): Factory;
export declare function getEventWatcher(obj: KBObject): EventWatcher | undefined;
export declare function setEventWatcher(obj: KBObject, value: EventWatcher): EventWatcher;
export declare function getEventWatcherIsOwned(obj: KBObject): boolean | undefined;
export declare function setEventWatcherIsOwned(obj: KBObject, value: boolean): boolean;
/** @deprecated Use getObservable/setObservable instead */
export declare function wrappedObservable(obj: KBObject): ko.Observable | ko.Computed | ko.ObservableArray | undefined;
export declare function wrappedObservable(obj: KBObject, value: ko.Observable | ko.Computed | ko.ObservableArray): ko.Observable | ko.Computed | ko.ObservableArray;
/** @deprecated Use getObject/setObject instead */
export declare function wrappedObject(obj: KBObject): Backbone.Model | Backbone.Collection | null | undefined;
export declare function wrappedObject(obj: KBObject, value: Backbone.Model | Backbone.Collection | null): Backbone.Model | Backbone.Collection | null;
/** @deprecated Use getCreator/setCreator instead */
export declare function wrappedCreator(obj: KBObject): Creator | undefined;
export declare function wrappedCreator(obj: KBObject, value: Creator): Creator;
/** @deprecated Use getModel/setModel instead */
export declare function wrappedModel(obj: KBObject): Backbone.Model | KBObject | null | undefined;
export declare function wrappedModel(obj: KBObject, value: Backbone.Model | null): Backbone.Model | null;
/** @deprecated Use getStore/setStore instead */
export declare function wrappedStore(obj: KBObject): Store | undefined;
export declare function wrappedStore(obj: KBObject, value: Store): Store;
/** @deprecated Use getStoreIsOwned/setStoreIsOwned instead */
export declare function wrappedStoreIsOwned(obj: KBObject): boolean | undefined;
export declare function wrappedStoreIsOwned(obj: KBObject, value: boolean): boolean;
/** @deprecated Use getFactory/setFactory instead */
export declare function wrappedFactory(obj: KBObject): Factory | undefined;
export declare function wrappedFactory(obj: KBObject, value: Factory): Factory;
/** @deprecated Use getEventWatcher/setEventWatcher instead */
export declare function wrappedEventWatcher(obj: KBObject): EventWatcher | undefined;
export declare function wrappedEventWatcher(obj: KBObject, value: EventWatcher): EventWatcher;
/** @deprecated Use getEventWatcherIsOwned/setEventWatcherIsOwned instead */
export declare function wrappedEventWatcherIsOwned(obj: KBObject): boolean | undefined;
export declare function wrappedEventWatcherIsOwned(obj: KBObject, value: boolean): boolean;
/** Get value type from observable */
export declare function valueType(observable: unknown): ValueType;
/** Join dot-delimited paths */
export declare function pathJoin(path1: string | undefined, path2: string): string;
/** Join path with options and return new options */
export declare function optionsPathJoin<
  T extends {
    path?: string;
  },
>(
  options: T,
  path: string
): T & {
  path: string;
};
/** Find creator from factory or ORM */
export declare function inferCreator(value: unknown, factory: Factory | undefined, path: string): Creator | null;
/** Create observable based on value type */
export declare function createFromDefaultCreator(obj: unknown, options: ViewModelOptions): unknown;
/** Resolve model ref (ModelRef support removed in this version) */
export declare function resolveModel(model: unknown): Backbone.Model | null;
declare const utils: {
  get: typeof get;
  set: typeof set;
  orSet: typeof orSet;
  has: typeof has;
  getObservable: typeof getObservable;
  setObservable: typeof setObservable;
  getObject: typeof getObject;
  setObject: typeof setObject;
  getCreator: typeof getCreator;
  setCreator: typeof setCreator;
  getModel: typeof getModel;
  setModel: typeof setModel;
  getStore: typeof getStore;
  setStore: typeof setStore;
  getStoreIsOwned: typeof getStoreIsOwned;
  setStoreIsOwned: typeof setStoreIsOwned;
  getFactory: typeof getFactory;
  setFactory: typeof setFactory;
  getEventWatcher: typeof getEventWatcher;
  setEventWatcher: typeof setEventWatcher;
  getEventWatcherIsOwned: typeof getEventWatcherIsOwned;
  setEventWatcherIsOwned: typeof setEventWatcherIsOwned;
  wrappedObservable: typeof wrappedObservable;
  wrappedObject: typeof wrappedObject;
  wrappedCreator: typeof wrappedCreator;
  wrappedModel: typeof wrappedModel;
  wrappedStore: typeof wrappedStore;
  wrappedStoreIsOwned: typeof wrappedStoreIsOwned;
  wrappedFactory: typeof wrappedFactory;
  wrappedEventWatcher: typeof wrappedEventWatcher;
  wrappedEventWatcherIsOwned: typeof wrappedEventWatcherIsOwned;
  wrappedDestroy: typeof wrappedDestroy;
  valueType: typeof valueType;
  pathJoin: typeof pathJoin;
  optionsPathJoin: typeof optionsPathJoin;
  inferCreator: typeof inferCreator;
  createFromDefaultCreator: typeof createFromDefaultCreator;
  collapseOptions: typeof collapseOptions;
  unwrapModels: typeof unwrapModels;
  resolveModel: typeof resolveModel;
};
export default utils;
