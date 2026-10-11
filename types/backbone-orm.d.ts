// Type definitions for backbone-orm
declare module 'backbone-orm' {
  import * as Backbone from 'backbone';

  export class Queue {
    constructor(concurrency: number);
    defer(callback: (cb: (err?: Error) => void) => void): void;
    await(callback: (err?: Error) => void): void;
  }

  export function configure(options: { model_cache?: { enabled: boolean; max: number } }): void;

  export interface ModelConstructor {
    new (attributes?: object, options?: object): Backbone.Model;
    prototype: Backbone.Model;
  }

  export function sync(modelClass: ModelConstructor): Backbone.Model['sync'];

  export interface BackboneORMModel extends Backbone.Model {
    model_name?: string;
    schema?: Record<string, unknown>;
    fetchRelated(callback: (err?: Error) => void): void;
  }

  // Default export
  const BackboneORM: {
    Queue: typeof Queue;
    configure: typeof configure;
    sync: typeof sync;
  };
  export default BackboneORM;
}

// Augment global BackboneORM
declare global {
  interface Window {
    BackboneORM?: typeof import('backbone-orm');
  }

  const BackboneORM: typeof import('backbone-orm') | undefined;
}
