import type * as Backbone from 'backbone';
import type { ORM } from '../configure.ts';
import type { ValueType } from '../types.ts';
import { TYPE_COLLECTION, TYPE_MODEL } from '../types.ts';

interface BackboneORMRelation {
  manual_fetch?: boolean;
  type?: string;
}

interface BackboneORMSchema {
  relations?: Record<string, BackboneORMRelation>;
}

interface BackboneORMModel extends Backbone.Model {
  fetchRelated: (...args: unknown[]) => unknown;
  relation(key: string): BackboneORMRelation | undefined;
  schema(): BackboneORMSchema | undefined;
}

class BackboneORMAdapter implements ORM<BackboneORMModel> {
  isAvailable(): boolean {
    return true;
  }

  isModel(model: Backbone.Model): model is BackboneORMModel {
    const candidate = model as unknown as Partial<BackboneORMModel>;
    return typeof candidate.fetchRelated === 'function' && typeof candidate.relation === 'function' && typeof candidate.schema === 'function';
  }

  keys(model: BackboneORMModel): string[] | null {
    if (!this.isModel(model)) return null;
    const relations = model.schema()?.relations;
    return relations
      ? Object.entries(relations)
          .filter(([, relation]) => !relation.manual_fetch)
          .map(([key]) => key)
      : null;
  }

  relationType(model: BackboneORMModel, key: string): ValueType | null {
    if (!this.isModel(model)) return null;
    const relation = model.relation(key);
    if (!relation) return null;
    return relation.type === 'hasMany' ? TYPE_COLLECTION : TYPE_MODEL;
  }

  useFunction(): boolean {
    return false;
  }
}

export default new BackboneORMAdapter();
