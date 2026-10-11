export const RELATIONSHIP_VERSIONS = {
  associations: '0.6.2',
  backbone: '1.6.1',
  legacyBackbone: '1.2.3',
  orm: '0.7.14',
  relational: '0.10.0',
} as const;

export const CORE_PEER_VERSIONS = {
  backbone: ['1.6.1', '1.4.0'],
  knockout: ['3.5.1', '3.5.0'],
  modelRef: '0.1.5',
  underscore: '1.13.8',
} as const;

export type BackboneVersion = 'current' | 'legacy';
export type ModuleFormat = 'cjs' | 'esm';
export type RelationshipScenario = 'associations' | 'boundaries' | 'capture' | 'default' | 'mixed' | 'orm' | 'relational';

export interface CorePeerCombination {
  backboneVersion: (typeof CORE_PEER_VERSIONS.backbone)[number];
  knockoutVersion: (typeof CORE_PEER_VERSIONS.knockout)[number];
  name: string;
}

export interface CorePeerCase extends CorePeerCombination {
  format: ModuleFormat;
  scenario: 'core-peer';
}

export interface RelationshipCase {
  backbone: BackboneVersion;
  format: ModuleFormat;
  name: string;
  scenario: RelationshipScenario;
}

const FORMATS: ModuleFormat[] = ['cjs', 'esm'];

export const CORE_PEER_COMBINATIONS: CorePeerCombination[] = CORE_PEER_VERSIONS.backbone.flatMap((backboneVersion) =>
  CORE_PEER_VERSIONS.knockout.map((knockoutVersion) => ({
    backboneVersion,
    knockoutVersion,
    name: `core-peer-backbone-${backboneVersion}-knockout-${knockoutVersion}`,
  }))
);

export const NODE_CORE_PEER_CASES: CorePeerCase[] = CORE_PEER_COMBINATIONS.flatMap((combination) =>
  FORMATS.map((format) => ({
    ...combination,
    format,
    name: `${combination.name}-${format}`,
    scenario: 'core-peer' as const,
  }))
);

export const NODE_RELATIONSHIP_CASES: RelationshipCase[] = [
  ...FORMATS.flatMap((format) =>
    (['relational', 'associations', 'orm', 'mixed'] as const).map((scenario) => ({
      backbone: 'current' as const,
      format,
      name: `${scenario}-${RELATIONSHIP_VERSIONS.backbone}-${format}`,
      scenario,
    }))
  ),
  ...FORMATS.flatMap((format) =>
    (['relational', 'associations', 'orm'] as const).map((scenario) => ({
      backbone: 'legacy' as const,
      format,
      name: `${scenario}-${RELATIONSHIP_VERSIONS.legacyBackbone}-${format}`,
      scenario,
    }))
  ),
  ...FORMATS.flatMap((format) =>
    (['default', 'capture', 'boundaries'] as const).map((scenario) => ({
      backbone: 'current' as const,
      format,
      name: `${scenario}-${RELATIONSHIP_VERSIONS.backbone}-${format}`,
      scenario,
    }))
  ),
];

export const BROWSER_RELATIONSHIP_CASES = [
  {
    backbone: 'current',
    name: `relational-${RELATIONSHIP_VERSIONS.backbone}`,
    scenario: 'relational',
  },
  {
    backbone: 'current',
    name: `associations-${RELATIONSHIP_VERSIONS.backbone}`,
    scenario: 'associations',
  },
  {
    backbone: 'current',
    name: `orm-${RELATIONSHIP_VERSIONS.backbone}`,
    scenario: 'orm',
  },
  {
    backbone: 'legacy',
    name: `relational-${RELATIONSHIP_VERSIONS.legacyBackbone}`,
    scenario: 'relational',
  },
  {
    backbone: 'legacy',
    name: `associations-${RELATIONSHIP_VERSIONS.legacyBackbone}`,
    scenario: 'associations',
  },
  {
    backbone: 'legacy',
    name: `orm-${RELATIONSHIP_VERSIONS.legacyBackbone}`,
    scenario: 'orm',
  },
] as const;
