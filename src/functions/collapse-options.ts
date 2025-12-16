import _ from 'underscore';
import type { ViewModelOptions } from '../types.ts';

// Merge array values (union)
function mergeArray(result: Record<string, unknown>, key: string, value: unknown): Record<string, unknown> {
  result[key] = result[key] || [];
  const arr = Array.isArray(value) ? value : [value];
  const existing = result[key] as unknown[];
  result[key] = existing.length ? _.union(existing, arr) : arr;
  return result;
}

// Merge object values (extend)
function mergeObject(result: Record<string, unknown>, key: string, value: Record<string, unknown>): Record<string, unknown> {
  result[key] = result[key] || {};
  return _.extend(result[key] as Record<string, unknown>, value);
}

// Convert key array to object format
function keyArrayToObject(value: string[]): Record<string, { key: string }> {
  const result: Record<string, { key: string }> = {};
  for (const item of value) {
    result[item] = { key: item };
  }
  return result;
}

// Internal merge function
function mergeOptions(result: Record<string, unknown>, options?: ViewModelOptions): Record<string, unknown> {
  if (!options) return result;

  for (const key in options) {
    const value = (options as Record<string, unknown>)[key];

    switch (key) {
      case 'internals':
      case 'requires':
      case 'excludes':
      case 'statics':
        mergeArray(result, key, value);
        break;

      case 'keys':
        // Handle as object
        if ((_.isObject(value) && !Array.isArray(value)) || (_.isObject(result[key]) && !Array.isArray(result[key]))) {
          let normalizedValue = value;
          if (!_.isObject(normalizedValue)) {
            normalizedValue = [normalizedValue];
          }
          if (Array.isArray(normalizedValue)) {
            normalizedValue = keyArrayToObject(normalizedValue as string[]);
          }
          if (Array.isArray(result[key])) {
            result[key] = keyArrayToObject(result[key] as string[]);
          }
          mergeObject(result, key, normalizedValue as Record<string, unknown>);
        } else {
          // Handle as array
          mergeArray(result, key, value);
        }
        break;

      case 'factories':
        if (_.isFunction(value)) {
          result[key] = value;
        } else {
          mergeObject(result, key, value as Record<string, unknown>);
        }
        break;

      case 'static_defaults':
        mergeObject(result, key, value as Record<string, unknown>);
        break;

      case 'options':
        // Skip here, will be handled recursively
        break;

      default:
        result[key] = value;
    }
  }

  // Recursively merge nested options
  return mergeOptions(result, options.options);
}

// Collapse/merge view model options
export default function collapseOptions(options?: ViewModelOptions): ViewModelOptions {
  return mergeOptions({}, options) as ViewModelOptions;
}
