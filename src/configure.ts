import _ from 'underscore';
import kb from './kb.ts';

export interface ORM {
  isAvailable(): boolean;
  keys?(model: unknown): string[] | null;
}

export interface ConfigureOptions {
  orm?: string | ORM;
  [key: string]: unknown;
}

// Available ORMs registry
const ALL_ORMS: Record<string, ORM | null> = {
  default: null,
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
          if (!Object.prototype.hasOwnProperty.call(ALL_ORMS, value)) {
            console.log(`Knockback configure: could not find orm: ${value}. Available: ${Object.keys(ALL_ORMS).join(', ')}`);
            continue;
          }
          const orm = ALL_ORMS[value];
          if (orm && !orm.isAvailable()) {
            console.log(`Knockback configure: could not enable orm ${value}. Make sure it is included before Knockback`);
            continue;
          }
          kb.settings.orm = orm;
        }
        // Set by functions/object
        else {
          kb.settings.orm = value as ORM | null;
        }
        break;

      default:
        (kb.settings as Record<string, unknown>)[key] = value;
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
  if (orm?.isAvailable() && !kb.settings.orm) {
    kb.settings.orm = orm;
  }
}

/**
 * Get list of registered ORMs
 */
export function getRegisteredORMs(): string[] {
  return Object.keys(ALL_ORMS);
}

export default configure;
