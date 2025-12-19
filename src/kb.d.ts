import Backbone from 'backbone';
import ko from 'knockout';
import type { KBSettings, LocaleManager } from './types.ts';
interface StatisticsLike {
  register: (name: string, obj: unknown) => void;
  unregister: (name: string, obj: unknown) => void;
  addModelEvent: (event: unknown) => void;
}
declare const kb: {
  VERSION: string;
  settings: KBSettings;
  locale_manager: LocaleManager | null;
  statistics: StatisticsLike | null;
  wasReleased(obj: unknown): boolean;
  isReleaseable(obj: unknown, depth?: number): boolean;
  release(obj: unknown): void;
  releaseKeys(obj: Record<string, unknown>): void;
  releaseOnNodeRemove(view_model: unknown, node: Node): void;
  renderTemplate(
    template: string,
    view_model: {
      afterRender?: (el: Element) => void;
    },
    options?: {
      afterRender?: () => void;
    }
  ): Element | null;
  applyBindings(view_model: unknown, node: Element | NodeList | HTMLCollection): Element;
  getValue(model: Backbone.Model | null, key: string, args?: unknown[]): unknown;
  setValue(model: Backbone.Model | null, key: string, value: unknown): void;
  ignore: <T>(callback: () => T, callbackTarget?: unknown, callbackArgs?: unknown[]) => T;
  peek<T>(obs: T | ko.Observable<T>): T;
  isModel(obj: unknown): obj is Backbone.Model;
  isCollection(obj: unknown): obj is Backbone.Collection;
  isViewModel(obj: unknown): boolean;
  _throwMissing(
    instance:
      | string
      | {
          constructor: {
            name: string;
          };
        },
    message: string
  ): never;
  _throwUnexpected(
    instance:
      | string
      | {
          constructor: {
            name: string;
          };
        },
    message: string
  ): never;
  publishMethods(observable: any, instance: Record<string, unknown>, methods: string[]): void;
};
export default kb;
