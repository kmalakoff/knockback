import _ from 'underscore';
import { settings } from './kb.ts';
import BackboneRelationalORM from './orms/backbone-relational.ts';
import type { ValueType } from './types.ts';

/**
 * ORM adapter interface for integrating with different Backbone ORMs
 */
export interface ORM {
  /** Check if the ORM is available in the current environment */
  isAvailable(): boolean;
  /** Get relationship keys for a model (optional) */
  keys?(model: unknown): string[] | null;
  /** Determine the type of a relationship (optional) */
  relationType?(model: unknown, key: string): ValueType | null;
  /** Bind to relationship changes (optional) */
  bind?(model: unknown, key: string, update: () => void, path: string): (() => void) | null;
  /** Check if a function should be used instead of get/set (optional) */
  useFunction?(model: unknown, key: string): boolean;
}

/**
 * Configuration options for Knockback
 */
export interface ConfigureOptions {
  /** ORM to use - either a string name or ORM object */
  orm?: string | ORM;
  /** Additional configuration options */
  [key: string]: unknown;
}

// Available ORMs registry
const ALL_ORMS: Record<string, ORM | null> = {
  default: null,
  'backbone-orm': null, // BackboneORM uses default behavior
  'backbone-relational': BackboneRelationalORM,
};

/**
 * Configure knockback settings
 *
 * @param options - Configuration options
 * @param options.orm - ORM to use (string name or ORM object)
 */
export function configure(options: ConfigureOptions = {}): void {
  for (const key in options) {
    const value = options[key];

    switch (key) {
      case 'orm':
        // Set by name
        if (_.isString(value)) {
          if (!Object.hasOwn(ALL_ORMS, value)) {
            console.log(`Knockback configure: could not find orm: ${value}. Available: ${Object.keys(ALL_ORMS).join(', ')}`);
            continue;
          }
          const orm = ALL_ORMS[value];
          if (orm && !orm.isAvailable()) {
            console.log(`Knockback configure: could not enable orm ${value}. Make sure it is included before Knockback`);
            continue;
          }
          settings.orm = orm;
        }
        // Set by functions/object
        else {
          settings.orm = value as ORM | null;
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
export function registerORM(name: string, orm: ORM | null): void {
  ALL_ORMS[name] = orm;
  // If this ORM is available and we don't have one set, use it
  if (orm?.isAvailable() && !settings.orm) {
    settings.orm = orm;
  }
}

/**
 * Get list of registered ORMs
 */
export function getRegisteredORMs(): string[] {
  return Object.keys(ALL_ORMS);
}

export default configure;
