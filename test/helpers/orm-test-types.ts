/**
 * Shared type definitions for ORM integration tests.
 *
 * These types provide proper typing for view models created from
 * Person and Building models with BackboneORM or Backbone-Relational.
 */
import type Backbone from 'backbone';
import type ko from 'knockout';

// =============================================================================
// Model Attribute Interfaces
// =============================================================================

export interface PersonAttributes {
  id?: string;
  name?: string;
  friends?: string[] | Backbone.Model[];
  friends_with_me?: string[] | Backbone.Model[];
  best_friend?: string | Backbone.Model | null;
  best_friends_with_me?: string[] | Backbone.Model[];
  occupies?: string | Backbone.Model | null;
}

export interface BuildingAttributes {
  id?: string;
  location?: string;
  name?: string;
  occupants?: string[] | Backbone.Model[];
}

// =============================================================================
// ViewModel Interfaces
// =============================================================================

export interface PersonViewModel {
  name: ko.Observable<string>;
  friends: ko.ObservableArray<PersonViewModel>;
  friendsWithMe: ko.ObservableArray<PersonViewModel>;
  bestFriend: ko.Observable<PersonViewModel | null>;
  bestFriendsWithMe: ko.ObservableArray<PersonViewModel>;
  occupies: ko.Observable<BuildingViewModel | null>;
}

export interface BuildingViewModel {
  id: ko.Observable<string>;
  location: ko.Observable<string>;
  name: ko.Observable<string>;
  occupants: ko.ObservableArray<PersonViewModel>;
}

// =============================================================================
// Memory Management Test Helpers
// =============================================================================

/**
 * ViewModel with reference counting for testing kb's retain/release behavior.
 * Tracks all instances in a static array for verification.
 */
export class RefCountableViewModel {
  static viewModels: RefCountableViewModel[] = [];

  private _refCount = 1;
  private _isDestroyed = false;

  constructor() {
    RefCountableViewModel.viewModels.push(this);
  }

  refCount(): number {
    return this._refCount;
  }

  retain(): this {
    this._refCount++;
    return this;
  }

  release(): this {
    this._refCount--;
    if (this._refCount < 0) {
      throw new Error('ref count is corrupt');
    }
    if (this._refCount === 0) {
      this._isDestroyed = true;
      this._destroy();
    }
    return this;
  }

  /** Called by kb.dispose() */
  dispose(): void {
    this.release();
  }

  isDestroyed(): boolean {
    return this._isDestroyed;
  }

  private _destroy(): void {
    const index = RefCountableViewModel.viewModels.indexOf(this);
    if (index >= 0) {
      RefCountableViewModel.viewModels.splice(index, 1);
    }
  }

  /** Reset static state between tests */
  static reset(): void {
    RefCountableViewModel.viewModels = [];
  }
}

/**
 * ViewModel with destroy() method for testing kb's cleanup behavior.
 * Tracks all instances in a static array for verification.
 */
export class DestroyableViewModel {
  static viewModels: DestroyableViewModel[] = [];

  constructor() {
    DestroyableViewModel.viewModels.push(this);
  }

  /** Called by kb.dispose() */
  dispose(): void {
    const index = DestroyableViewModel.viewModels.indexOf(this);
    if (index >= 0) {
      DestroyableViewModel.viewModels.splice(index, 1);
    }
  }

  /** Reset static state between tests */
  static reset(): void {
    DestroyableViewModel.viewModels = [];
  }
}

/**
 * Simple ViewModel without dispose for testing kb's fallback cleanup.
 * Tracks all instances in a static array for verification.
 */
export class SimpleViewModel {
  static viewModels: SimpleViewModel[] = [];

  prop: ko.Observable<unknown> | null;

  constructor() {
    // Import ko dynamically to avoid circular deps
    const ko = require('knockout');
    this.prop = ko.observable();
    SimpleViewModel.viewModels.push(this);
  }

  /** Reset static state between tests */
  static reset(): void {
    SimpleViewModel.viewModels = [];
  }
}

// =============================================================================
// Backbone-Relational Type Augmentation
// =============================================================================

/**
 * Extended Backbone type with Relational support.
 * Use this to access Backbone.RelationalModel, Backbone.HasOne, etc.
 */
export interface BackboneWithRelational {
  Model: typeof Backbone.Model;
  Collection: typeof Backbone.Collection;
  RelationalModel: {
    extend<T extends object>(protoProps: T): new (attrs?: object) => Backbone.Model & T;
  };
  HasOne: symbol;
  HasMany: symbol;
  Store: new () => {
    addModelScope?(scope: object): void;
  };
  Relational: {
    store: {
      addModelScope?(scope: object): void;
    };
  };
}

/**
 * Type guard to check if Backbone has Relational loaded.
 */
export function hasBackboneRelational(backbone: typeof Backbone): backbone is typeof Backbone & BackboneWithRelational {
  return 'RelationalModel' in backbone && 'Relational' in backbone;
}

// =============================================================================
// BackboneORM Type Augmentation
// =============================================================================

export interface BackboneORMStatic {
  Queue: new (
    concurrency: number
  ) => {
    defer(task: (callback: (err?: Error) => void) => void): void;
    await(callback: (err?: Error) => void): void;
  };
  configure(options: { model_cache?: { enabled: boolean; max: number } }): void;
  sync(ModelClass: { model_name: string; schema: object }): typeof Backbone.sync;
}
