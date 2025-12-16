import _ from 'underscore';
import utils from './utils.ts';
import type { Creator, FactoriesOption, ViewModelOptions } from './types.ts';

interface PathMapping {
  view_model?: Creator;
  [key: string]: unknown;
}

// Factory for creating view models based on path mappings
export class Factory {
  paths: Record<string, Creator | PathMapping> = {};
  parent_factory?: Factory;

  // Use existing factory from options or create a new one
  static useOptionsOrCreate(options: ViewModelOptions, obj: unknown, ownerPath?: string): Factory {
    // Share existing factory if it has all required mappings
    if (options.factory) {
      const factory = options.factory as Factory;
      if (!options.factories || factory.hasPathMappings(options.factories, ownerPath)) {
        return utils.wrappedFactory(obj, factory) as Factory;
      }
    }

    // Create new factory
    const factory = utils.wrappedFactory(obj, new Factory(options.factory as Factory)) as Factory;
    if (options.factories) {
      factory.addPathMappings(options.factories, ownerPath);
    }
    return factory;
  }

  constructor(parentFactory?: Factory) {
    if (parentFactory) {
      this.parent_factory = parentFactory;
    }
  }

  // Check if a path exists
  hasPath(path: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.paths, path) || (this.parent_factory?.hasPath(path) ?? false);
  }

  // Add a single path mapping
  addPathMapping(path: string, createInfo: Creator | PathMapping): void {
    this.paths[path] = createInfo;
  }

  // Add multiple path mappings with optional owner path prefix
  addPathMappings(factories: FactoriesOption, ownerPath?: string): void {
    if (_.isFunction(factories)) return;

    for (const path in factories as Record<string, Creator>) {
      const createInfo = (factories as Record<string, Creator>)[path];
      this.paths[utils.pathJoin(ownerPath, path)] = createInfo;
    }
  }

  // Check if all factory mappings exist
  hasPathMappings(factories: FactoriesOption, ownerPath?: string): boolean {
    if (_.isFunction(factories)) return true;

    let allExist = true;
    for (const path in factories as Record<string, Creator>) {
      const creator = (factories as Record<string, Creator>)[path];
      const existingCreator = this.creatorForPath(null, utils.pathJoin(ownerPath, path));
      allExist = allExist && !!existingCreator && creator === existingCreator;
    }
    return allExist;
  }

  // Get creator for a path
  creatorForPath(_obj: unknown, path: string): Creator | undefined {
    const creator = this.paths[path];
    if (creator) {
      // Handle view_model property wrapper
      const mapping = creator as PathMapping;
      return mapping.view_model ? mapping.view_model : (creator as Creator);
    }

    if (this.parent_factory) {
      return this.parent_factory.creatorForPath(_obj, path);
    }

    return undefined;
  }
}

export default Factory;
