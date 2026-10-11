export type CellKind = 'candidate' | 'published-v1';
export type OrmKind = 'accepted-local' | 'published-0.7.14';

export interface MatrixCell {
  kb: CellKind;
  name: string;
  orm: OrmKind;
}

export interface CleanupObservation {
  childListenersRestored: boolean;
  parentListenersRestored: boolean;
  released: boolean;
}

export interface RelationObservation {
  directChildren: string[] | string;
  directChildrenIdentity: boolean;
  directChildrenType: number | string;
  directPrimary: string | null;
  directPrimaryIdentity: boolean;
  directPrimaryType: number | string;
  viewChildren: string[] | string;
  viewChildrenIdentity: boolean;
  viewChildrenType: number | string;
  viewPrimary: string | null;
  viewPrimaryIdentity: boolean;
  viewPrimaryType: number | string;
}

export interface HistoricalObservation {
  cleanup: CleanupObservation;
  error: string;
  firstAfterSave: RelationObservation;
  initial: RelationObservation;
  kind: 'published-v1-defect';
  phase: 'second relation mutation' | 'second relation save';
}

export interface RuntimeObservation {
  cleanup: CleanupObservation;
  emptyAfterSave: RelationObservation;
  firstAfterSave: RelationObservation;
  initial: RelationObservation;
  kind: 'success';
  secondAfterSave: RelationObservation;
}

export type CellObservation = HistoricalObservation | RuntimeObservation;
