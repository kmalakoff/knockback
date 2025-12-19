import _ from 'underscore';
import type { KBMetadata } from '../types.ts';

interface KBObject {
  __kb?: KBMetadata;
}

// Recursively unwrap models from view models for Backbone operations
export default function unwrapModels(obj: unknown): unknown {
  if (!obj) return obj;

  // Check if it's a kb-wrapped object
  const kbObj = obj as KBObject;
  if (kbObj.__kb) {
    return Object.hasOwn(kbObj.__kb, 'object') ? kbObj.__kb.object : obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return _.map(obj, (item: unknown) => unwrapModels(item));
  }

  // Handle plain objects
  if (_.isObject(obj) && (obj as object).constructor === {}.constructor) {
    const result: Record<string, unknown> = {};
    for (const key in obj as Record<string, unknown>) {
      result[key] = unwrapModels((obj as Record<string, unknown>)[key]);
    }
    return result;
  }

  return obj;
}
