import { configure, type ORM, registerORM, TYPE_COLLECTION } from '@mcpeasy/knockback';
import Backbone from 'backbone';

class ExternalModel extends Backbone.Model {
  readonly externalKind = 'external';

  relationshipKeys(): string[] {
    return ['members'];
  }
}

class IncompatibleModel extends Backbone.Model {
  readonly incompatibleKind = 'incompatible';
}

export const externalAdapter: ORM<ExternalModel> = {
  isAvailable: () => true,
  isModel: (model): model is ExternalModel => model instanceof ExternalModel,
  keys: (model) => model.relationshipKeys(),
  relationType: (model, key) => (model.relationshipKeys().includes(key) ? TYPE_COLLECTION : null),
  bind: (model, key, update) => {
    model.on(`change:${key}`, update);
    return () => model.off(`change:${key}`, update);
  },
  useFunction: (model, key) => model.relationshipKeys().includes(key),
};

registerORM('external-package-adapter', externalAdapter);
configure({ orm: externalAdapter });
configure({ orm: 'external-package-adapter' });

const inferredGuardedAdapter = {
  isAvailable: () => true,
  isModel: (model: Backbone.Model): model is ExternalModel => model instanceof ExternalModel,
  keys: (model: ExternalModel) => model.relationshipKeys(),
};
configure({ orm: inferredGuardedAdapter });
registerORM('inferred-guarded-package-adapter', inferredGuardedAdapter);
configure({
  orm: {
    isAvailable: () => true,
    isModel: (model: Backbone.Model): model is ExternalModel => model instanceof ExternalModel,
    keys: (model: ExternalModel) => model.relationshipKeys(),
  },
});
registerORM('inline-guarded-package-adapter', {
  isAvailable: () => true,
  isModel: (model: Backbone.Model): model is ExternalModel => model instanceof ExternalModel,
  keys: (model: ExternalModel) => model.relationshipKeys(),
});

const inferredUnguardedAdapter = {
  isAvailable: () => true,
  keys: (model: ExternalModel) => model.relationshipKeys(),
};
// @ts-expect-error inferred narrow hooks require an isModel guard at the direct configuration boundary
configure({ orm: inferredUnguardedAdapter });
// @ts-expect-error inferred narrow hooks require an isModel guard at the registration boundary
registerORM('inferred-unguarded-package-adapter', inferredUnguardedAdapter);
configure({
  // @ts-expect-error inline narrow hooks require an isModel guard at the direct configuration boundary
  orm: {
    isAvailable: () => true,
    keys: (model: ExternalModel) => model.relationshipKeys(),
  },
});
registerORM(
  'inline-unguarded-package-adapter',
  // @ts-expect-error inline narrow hooks require an isModel guard at the registration boundary
  {
    isAvailable: () => true,
    keys: (model: ExternalModel) => model.relationshipKeys(),
  }
);

const inferredUnguardedMethods = {
  isAvailable() {
    return true;
  },
  keys(model: ExternalModel) {
    return model.relationshipKeys();
  },
};
// @ts-expect-error method syntax cannot bypass the guard required for inferred narrow hooks
configure({ orm: inferredUnguardedMethods });
// @ts-expect-error method syntax cannot bypass the guard required for registered narrow hooks
registerORM('inferred-unguarded-methods-package-adapter', inferredUnguardedMethods);

// @ts-expect-error a concrete adapter must guard its narrower model operations
const missingConcreteGuard: ORM<ExternalModel> = {
  isAvailable: () => true,
  keys: (model) => model.relationshipKeys(),
};
void missingConcreteGuard;

const broadLegacyAdapter: ORM = {
  isAvailable: () => true,
  keys: (model) => Object.keys(model.attributes),
};
configure({ orm: broadLegacyAdapter });
registerORM('broad-legacy-package-adapter', broadLegacyAdapter);

const inferredBroadLegacyAdapter = {
  isAvailable: () => true,
  keys: (model: Backbone.Model) => Object.keys(model.attributes),
};
configure({ orm: inferredBroadLegacyAdapter });
registerORM('inferred-broad-legacy-package-adapter', inferredBroadLegacyAdapter);
configure({
  orm: {
    isAvailable: () => true,
    keys: (model: Backbone.Model) => Object.keys(model.attributes),
  },
});
registerORM('inline-broad-legacy-package-adapter', {
  isAvailable: () => true,
  keys: (model: Backbone.Model) => Object.keys(model.attributes),
});

const incompatibleAdapter: ORM<ExternalModel> = {
  isAvailable: () => true,
  // @ts-expect-error a guard for another concrete model does not satisfy this adapter contract
  isModel: (model): model is IncompatibleModel => model instanceof IncompatibleModel,
};
void incompatibleAdapter;
