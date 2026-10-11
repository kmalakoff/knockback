import Backbone from 'backbone';
import _ from 'underscore';
import type { ORM } from '../configure.ts';
import { getStatistics } from '../kb.ts';
import type { ValueType } from '../types.ts';
import { TYPE_COLLECTION, TYPE_MODEL } from '../types.ts';

// Backbone.Relational types (minimal declarations)
interface BackboneRelation {
  key: string;
  collectionType?: unknown;
  keyContents?: unknown;
  sanitizeOptions?: unknown;
}

interface BackboneRelationalModel extends Backbone.Model {
  getRelations(): BackboneRelation[];
}

// Type guard for RelationalModel
function isRelationalModel(model: unknown): model is BackboneRelationalModel {
  const RelationalModel = (Backbone as unknown as { RelationalModel?: new () => BackboneRelationalModel }).RelationalModel;
  if (!RelationalModel) return false;
  return model instanceof RelationalModel;
}

// Check for Backbone.Relation
function hasRelationClass(): boolean {
  const BackboneWithRelation = Backbone as unknown as {
    Relation?: {
      prototype?: {
        sanitizeOptions?: unknown;
      };
    };
  };
  return !!BackboneWithRelation.Relation;
}

class BackboneRelationalORM implements ORM {
  isAvailable(): boolean {
    const RelationalModel = (Backbone as unknown as { RelationalModel?: unknown }).RelationalModel;
    return !!RelationalModel;
  }

  isModel(model: Backbone.Model): model is BackboneRelationalModel {
    return isRelationalModel(model);
  }

  keys(model: Backbone.Model): string[] | null {
    if (!isRelationalModel(model)) return null;
    return model.getRelations().map((relation) => relation.key);
  }

  relationType(model: unknown, key: string): ValueType | null {
    if (!isRelationalModel(model)) return null;

    const relation = _.find(model.getRelations(), (test) => test.key === key);
    if (!relation) return null;

    // HasMany relation
    if (relation.collectionType || _.isArray(relation.keyContents)) {
      return TYPE_COLLECTION;
    }
    // HasOne relation
    return TYPE_MODEL;
  }

  bind(model: unknown, key: string, update: () => void, path: string): (() => void) | null {
    const type = this.relationType(model, key);
    if (!type) return null;

    const backboneModel = model as Backbone.Model;

    const relFn = (model: Backbone.Model) => {
      const stats = getStatistics();
      if (stats) {
        stats.addModelEvent({ name: 'update (relational)', model, key, path });
      }
      update();
    };

    // VERSIONING: pre Backbone-Relational 0.8.0
    const events = hasRelationClass() && (Backbone as unknown as { Relation: { prototype: { sanitizeOptions?: unknown } } }).Relation.prototype.sanitizeOptions ? ['update', 'add', 'remove'] : ['change', 'add', 'remove'];

    if (type === TYPE_COLLECTION) {
      for (const event of events) {
        backboneModel.on(`${event}:${key}`, relFn);
      }
    } else {
      backboneModel.on(`${events[0]}:${key}`, relFn);
    }

    // Return unbind function
    return () => {
      if (type === TYPE_COLLECTION) {
        for (const event of events) {
          backboneModel.off(`${event}:${key}`, relFn);
        }
      } else {
        backboneModel.off(`${events[0]}:${key}`, relFn);
      }
    };
  }

  useFunction(): boolean {
    return false;
  }
}

export default new BackboneRelationalORM();
