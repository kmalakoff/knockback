import type * as Backbone from 'backbone';
import _ from 'underscore';
import { UnexpectedValueError } from './errors/index.ts';
import { settings } from './kb.ts';
import BackboneAssociationsORM from './orms/backbone-associations.ts';
import BackboneORM from './orms/backbone-orm.ts';
import BackboneRelationalORM from './orms/backbone-relational.ts';
import type { ValueType } from './types.ts';

/**
 * ORM adapter interface for integrating with different Backbone ORMs
 */
export type ORM<M extends Backbone.Model = Backbone.Model> = {
  /** Check if the ORM is available in the current environment */
  isAvailable: () => boolean;
  /** Get relationship keys for a model (optional) */
  keys?: (model: M) => string[] | null;
  /** Determine the type of a relationship (optional) */
  relationType?: (model: M, key: string) => ValueType | null;
  /** Bind to relationship changes (optional) */
  bind?: (model: M, key: string, update: () => void, path: string) => (() => void) | null;
  /** Check if a function should be used instead of get/set (optional) */
  useFunction?: (model: M, key: string) => boolean;
} & (Backbone.Model extends M ? { isModel?: (model: Backbone.Model) => model is M } : { isModel: (model: Backbone.Model) => model is M });

/**
 * Configuration options for Knockback
 */
export interface ConfigureOptions<M extends Backbone.Model = Backbone.Model> {
  /** ORM to use - either a string name or ORM object */
  orm?: string | ORM<M> | null;
  /** Additional configuration options */
  [key: string]: unknown;
}

// Available ORMs registry
function asRuntimeORM<M extends Backbone.Model>(orm: ORM<M>): ORM {
  return orm as unknown as ORM;
}

const ALL_ORMS: Record<string, ORM | null> = {
  default: null,
  'backbone-associations': asRuntimeORM(BackboneAssociationsORM),
  'backbone-orm': asRuntimeORM(BackboneORM),
  'backbone-relational': asRuntimeORM(BackboneRelationalORM),
};

const EXPLICIT_ONLY_ORMS = new Set(['backbone-orm']);

type ORMSelection = { kind: 'automatic' } | { kind: 'default' } | { adapter: ORM; kind: 'selected' };

let ormSelection: ORMSelection = { kind: 'automatic' };

function supportsModel(orm: ORM, model: Backbone.Model, requireGuard: boolean): boolean {
  if (!orm.isAvailable()) return false;
  if (!orm.isModel) return !requireGuard;
  return orm.isModel(model);
}

/** Resolve and capture the adapter for a new model attachment. */
export function resolveORM(model: Backbone.Model): ORM | null {
  if (ormSelection.kind === 'default') return null;
  if (ormSelection.kind === 'selected') {
    return supportsModel(ormSelection.adapter, model, false) ? ormSelection.adapter : null;
  }

  const matches: Array<{ name: string; orm: ORM }> = [];
  for (const [name, orm] of Object.entries(ALL_ORMS)) {
    if (!orm || EXPLICIT_ONLY_ORMS.has(name) || !supportsModel(orm, model, true)) continue;
    if (!matches.some((match) => match.orm === orm)) matches.push({ name, orm });
  }
  if (matches.length > 1) {
    const names = matches.map((match) => match.name);
    throw new UnexpectedValueError('ORM', `automatic selection matched multiple adapters (${names.join(', ')}); choose one with configure({ orm: '<name>' })`);
  }
  return matches.length === 1 ? matches[0].orm : null;
}

/**
 * Configure knockback settings
 *
 * @param options - Configuration options
 * @param options.orm - ORM to use (string name or ORM object)
 */
export function configure<M extends Backbone.Model = Backbone.Model>(options: ConfigureOptions<M> = {}): void {
  for (const key in options) {
    const value = options[key];

    switch (key) {
      case 'orm':
        if (value === undefined) {
          ormSelection = { kind: 'automatic' };
          settings.orm = undefined;
          break;
        }

        if (value === null || value === 'default') {
          ormSelection = { kind: 'default' };
          settings.orm = null;
          break;
        }

        // Set by name
        if (_.isString(value)) {
          if (!Object.hasOwn(ALL_ORMS, value)) {
            console.log(`Knockback configure: could not find orm: ${value}. Available: ${Object.keys(ALL_ORMS).join(', ')}`);
            continue;
          }
          const orm = ALL_ORMS[value];
          if (!orm) continue;
          ormSelection = { kind: 'selected', adapter: orm };
          settings.orm = orm;
        }
        // Set by functions/object
        else {
          const orm = asRuntimeORM(value as ORM<M>);
          ormSelection = { kind: 'selected', adapter: orm };
          settings.orm = orm;
        }
        break;

      default:
        (settings as Record<string, unknown>)[key] = value;
    }
  }
}

/**
 * Register an ORM
 * @param name - The name of the ORM
 * @param orm - The ORM implementation
 */
export function registerORM<M extends Backbone.Model = Backbone.Model>(name: string, orm: ORM<M> | null): void {
  ALL_ORMS[name] = orm ? asRuntimeORM(orm) : null;
}

/**
 * Get list of registered ORMs
 */
export function getRegisteredORMs(): string[] {
  return Object.keys(ALL_ORMS);
}

export default configure;
