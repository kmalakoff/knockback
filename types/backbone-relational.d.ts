// Type definitions for backbone-relational
declare module 'backbone-relational' {
  import * as Backbone from 'backbone';

  export interface RelationOptions {
    type: typeof Backbone.HasOne | typeof Backbone.HasMany;
    key: string;
    relatedModel: string | typeof Backbone.RelationalModel;
    collectionType?: typeof Backbone.Collection;
    reverseRelation?: {
      type: typeof Backbone.HasOne | typeof Backbone.HasMany;
      key: string;
    };
  }

  export interface BackboneRelationalStore {
    addModelScope?(scope: unknown): void;
  }

  namespace Backbone {
    export class RelationalModel extends Model {
      getRelations(): Array<{
        key: string;
        collectionType?: unknown;
        keyContents?: unknown;
      }>;
    }

    export const HasOne: unique symbol;
    export const HasMany: unique symbol;

    export class Store {
      constructor();
      addModelScope?(scope: unknown): void;
    }

    export namespace Relational {
      export let store: Store;
    }

    export class Relation {
      prototype: {
        sanitizeOptions?: unknown;
      };
    }
  }

  // Augment global Backbone
  export interface BackboneStatic {
    RelationalModel: typeof Backbone.RelationalModel;
    HasOne: typeof Backbone.HasOne;
    HasMany: typeof Backbone.HasMany;
    Store: typeof Backbone.Store;
    Relational: typeof Backbone.Relational;
    Relation: typeof Backbone.Relation;
  }
}

// Global augmentation
declare global {
  interface Window {
    Backbone?: typeof import('backbone') & import('backbone-relational').BackboneStatic;
  }
}
