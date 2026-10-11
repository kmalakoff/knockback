import Backbone from 'backbone';
import type { ORM } from '../configure.ts';
import type { ValueType } from '../types.ts';
import { TYPE_COLLECTION, TYPE_MODEL } from '../types.ts';

interface Association {
  key: string;
  type: unknown;
}

interface AssociatedModel extends Backbone.Model {
  relations?: Association[];
}

function associatedModelConstructor(): (new (...args: never[]) => AssociatedModel) | undefined {
  return (Backbone as typeof Backbone & { AssociatedModel?: new (...args: never[]) => AssociatedModel }).AssociatedModel;
}

class BackboneAssociationsORM implements ORM<AssociatedModel> {
  isAvailable(): boolean {
    return Boolean(associatedModelConstructor());
  }

  isModel(model: Backbone.Model): model is AssociatedModel {
    const AssociatedModel = associatedModelConstructor();
    return Boolean(AssociatedModel && model instanceof AssociatedModel);
  }

  keys(model: AssociatedModel): string[] | null {
    if (!this.isModel(model)) return null;
    return (model.relations || []).map((relation) => relation.key);
  }

  relationType(model: AssociatedModel, key: string): ValueType | null {
    if (!this.isModel(model)) return null;
    const relation = (model.relations || []).find((candidate) => candidate.key === key);
    if (!relation) return null;
    return relation.type === (Backbone as typeof Backbone & { Many?: unknown }).Many ? TYPE_COLLECTION : TYPE_MODEL;
  }

  useFunction(): boolean {
    return false;
  }
}

export default new BackboneAssociationsORM();
