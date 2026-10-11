import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import assert from 'assert';
import type { CellObservation, HistoricalObservation, MatrixCell, RelationObservation, RuntimeObservation } from './types.ts';

interface RuntimePackage {
  Backbone?: unknown;
  TYPE_COLLECTION?: number;
  TYPE_MODEL?: number;
  configure(options: { orm?: string }): void;
  observable(model: unknown, key: string): unknown;
  release(value: unknown): void;
  viewModel(model: unknown): Record<string, unknown>;
  wasReleased(value: unknown): boolean;
}

interface RuntimeOrm {
  Backbone?: unknown;
  configure(options: { model_cache: { enabled: boolean; max: number } }): void;
  sync(modelType: unknown): unknown;
}

interface RuntimeObservable {
  (): unknown;
  valueType?: () => number;
}

interface RuntimeModel {
  _events?: Record<string, unknown | unknown[]>;
  save(callback: (error?: Error | null) => void): void;
  set(values: object): void;
}

interface RuntimeModelConstructor {
  new (attributes: Record<string, unknown>): RuntimeModel;
  prototype: RuntimeModel & { sync: unknown };
}

interface RuntimeBackbone {
  Model: {
    extend(properties: Record<string, unknown>): unknown;
  };
}

function isRuntimeModelConstructor(value: unknown): value is RuntimeModelConstructor {
  if (typeof value !== 'function') return false;
  const prototype: unknown = Reflect.get(value, 'prototype');
  return prototype !== null && typeof prototype === 'object' && typeof Reflect.get(prototype, 'save') === 'function' && typeof Reflect.get(prototype, 'set') === 'function' && typeof Reflect.get(prototype, 'sync') === 'function';
}

function isRuntimeBackbone(value: unknown): value is RuntimeBackbone {
  if (value === null || typeof value !== 'object') return false;
  const model: unknown = Reflect.get(value, 'Model');
  return isRuntimeModelConstructor(model) && typeof Reflect.get(model, 'extend') === 'function';
}

function listenerCount(target: { _events?: Record<string, unknown | unknown[]> }): number {
  if (!target._events) return 0;
  return Object.values(target._events).reduce((count, listeners) => count + (Array.isArray(listeners) ? listeners.length : 1), 0);
}

function save(model: { save(callback: (error?: Error | null) => void): void }): Promise<void> {
  return new Promise((resolve, reject) => {
    model.save((error) => (error ? reject(error) : resolve()));
  });
}

function nonObservable(value: unknown): string {
  return `non-observable:${value === null ? 'null' : typeof value}`;
}

function observableName(observable: unknown): string | null {
  if (typeof observable !== 'function') return nonObservable(observable);
  const value = observable();
  if (value == null) return null;
  if (typeof value !== 'object') return String(value);
  const name = (value as { name?: unknown }).name;
  if (typeof name === 'function') return String((name as () => unknown)());
  return `[${Object.prototype.toString.call(value)}]`;
}

function observableNames(observable: unknown): string[] | string {
  if (typeof observable !== 'function') return nonObservable(observable);
  const value = observable();
  if (!Array.isArray(value)) return value == null ? String(value) : `[${Object.prototype.toString.call(value)}]`;
  return value.map((entry) => {
    const name = (entry as { name?: unknown }).name;
    return typeof name === 'function' ? String((name as () => unknown)()) : `[${Object.prototype.toString.call(entry)}]`;
  });
}

function observableType(kb: RuntimePackage, observable: unknown): number | string {
  if (typeof observable !== 'function' || typeof (observable as RuntimeObservable).valueType !== 'function') return 'missing';
  const valueType = (observable as RuntimeObservable).valueType?.();
  if (kb.TYPE_MODEL !== undefined && valueType === kb.TYPE_MODEL) return 'model';
  if (kb.TYPE_COLLECTION !== undefined && valueType === kb.TYPE_COLLECTION) return 'collection';
  return valueType;
}

function observeRelations(kb: RuntimePackage, view: Record<string, unknown>, original: { children: RuntimeObservable; directChildren: RuntimeObservable; directPrimary: RuntimeObservable; primary: RuntimeObservable }, direct: { children: RuntimeObservable; primary: RuntimeObservable }): RelationObservation {
  const viewChildren = view.children;
  const viewPrimary = view.primary;
  return {
    directChildren: observableNames(direct.children),
    directChildrenIdentity: direct.children === original.directChildren,
    directChildrenType: observableType(kb, direct.children),
    directPrimary: observableName(direct.primary),
    directPrimaryIdentity: direct.primary === original.directPrimary,
    directPrimaryType: observableType(kb, direct.primary),
    viewChildren: observableNames(viewChildren),
    viewChildrenIdentity: viewChildren === original.children,
    viewChildrenType: observableType(kb, viewChildren),
    viewPrimary: observableName(viewPrimary),
    viewPrimaryIdentity: viewPrimary === original.primary,
    viewPrimaryType: observableType(kb, viewPrimary),
  };
}

function errorText(error: unknown): string {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
}

function releaseObservables(kb: RuntimePackage, direct: { children: RuntimeObservable; primary: RuntimeObservable }, view: Record<string, unknown>): boolean {
  kb.release(direct.primary);
  kb.release(direct.children);
  kb.release(view);
  return kb.wasReleased(direct.primary) && kb.wasReleased(direct.children) && kb.wasReleased(view);
}

async function historicalFailure(
  cell: MatrixCell,
  error: unknown,
  phase: HistoricalObservation['phase'],
  state: {
    direct: { children: RuntimeObservable; primary: RuntimeObservable };
    first: { _events?: Record<string, unknown | unknown[]> };
    firstAfterSave: RelationObservation;
    initial: RelationObservation;
    kb: RuntimePackage;
    listenersBefore: { first: number; parent: number; second: number };
    parent: { _events?: Record<string, unknown | unknown[]>; save(callback: (error?: Error | null) => void): void; set(values: object): void };
    second: { _events?: Record<string, unknown | unknown[]> };
    view: Record<string, unknown>;
  }
): Promise<HistoricalObservation> {
  assert.strictEqual(cell.kb, 'published-v1', `${cell.name} candidate failed during ${phase}`);
  const released = releaseObservables(state.kb, state.direct, state.view);
  state.parent.set({ children: [], primary: null });
  await save(state.parent);
  state.kb.configure({ orm: 'default' });
  return {
    cleanup: {
      childListenersRestored: listenerCount(state.first) === state.listenersBefore.first && listenerCount(state.second) === state.listenersBefore.second,
      parentListenersRestored: listenerCount(state.parent) === state.listenersBefore.parent,
      released,
    },
    error: errorText(error),
    firstAfterSave: state.firstAfterSave,
    initial: state.initial,
    kind: 'published-v1-defect',
    phase,
  };
}

async function exerciseCell(cell: MatrixCell, root: string): Promise<CellObservation> {
  const cellRequire = createRequire(path.join(root, 'package.json'));
  const Backbone: unknown = cellRequire('backbone');
  assert.ok(isRuntimeBackbone(Backbone), `${cell.name} did not load the Backbone model runtime`);
  const knockbackName = cell.kb === 'candidate' ? '@mcpeasy/knockback' : 'knockback';
  const knockbackRoot = path.join(root, 'node_modules', ...knockbackName.split('/'));
  const ormRoot = path.join(root, 'node_modules/backbone-orm');
  const backboneEntry = cellRequire.resolve('backbone');
  const knockbackRequire = createRequire(path.join(knockbackRoot, 'package.json'));
  const ormRequire = createRequire(path.join(ormRoot, 'package.json'));
  assert.strictEqual(knockbackRequire.resolve('backbone'), backboneEntry, `${cell.name} Knockback does not use the cell Backbone`);
  assert.strictEqual(ormRequire.resolve('backbone'), backboneEntry, `${cell.name} ORM does not use the cell Backbone`);
  assert.strictEqual(cellRequire.resolve(knockbackName), path.join(knockbackRoot, cell.kb === 'candidate' ? 'dist/cjs/index.js' : 'knockback.js'), `${cell.name} did not resolve the selected Knockback public entry`);
  assert.strictEqual(cellRequire.resolve('backbone-orm'), path.join(ormRoot, cell.orm === 'accepted-local' ? 'dist/cjs/index.js' : 'backbone-orm.js'), `${cell.name} did not resolve the selected ORM public entry`);

  const loadedKb = cellRequire(knockbackName) as RuntimePackage & { default?: RuntimePackage };
  const kb = loadedKb.default ?? loadedKb;
  const loadedOrm = cellRequire('backbone-orm') as RuntimeOrm & { default?: RuntimeOrm };
  const ORM = loadedOrm.default ?? loadedOrm;
  assert.strictEqual(kb.Backbone, Backbone, `${cell.name} Knockback exported a different Backbone`);
  assert.strictEqual(ORM.Backbone, Backbone, `${cell.name} ORM exported a different Backbone`);

  kb.configure({ orm: 'backbone-orm' });
  ORM.configure({ model_cache: { enabled: true, max: 20 } });
  const suffix = cell.name.replaceAll('-', '_');
  const Child = Backbone.Model.extend({
    model_name: `UpgradeChild_${suffix}`,
    schema() {
      return { id: [{ manual: true }], name: 'String' };
    },
  });
  assert.ok(isRuntimeModelConstructor(Child), `${cell.name} did not extend the child model constructor`);
  const Parent = Backbone.Model.extend({
    model_name: `UpgradeParent_${suffix}`,
    schema() {
      return {
        children: () => ['hasMany', Child],
        id: [{ manual: true }],
        name: 'String',
        primary: () => ['belongsTo', Child],
      };
    },
  });
  assert.ok(isRuntimeModelConstructor(Parent), `${cell.name} did not extend the parent model constructor`);
  Child.prototype.sync = ORM.sync(Child);
  Parent.prototype.sync = ORM.sync(Parent);

  const first = new Child({ id: 101, name: 'first' });
  const second = new Child({ id: 102, name: 'second' });
  await save(first);
  await save(second);
  const parent = new Parent({ children: [], id: 1, name: 'parent', primary: null });
  await save(parent);
  const listenersBefore = { first: listenerCount(first), parent: listenerCount(parent), second: listenerCount(second) };

  const view = kb.viewModel(parent);
  const direct = {
    children: kb.observable(parent, 'children') as RuntimeObservable,
    primary: kb.observable(parent, 'primary') as RuntimeObservable,
  };
  const original = {
    children: view.children as RuntimeObservable,
    directChildren: direct.children,
    directPrimary: direct.primary,
    primary: view.primary as RuntimeObservable,
  };
  const initial = observeRelations(kb, view, original, direct);

  parent.set({ children: [first], primary: first });
  await save(parent);
  const firstAfterSave = observeRelations(kb, view, original, direct);
  const historicalState = { direct, first, firstAfterSave, initial, kb, listenersBefore, parent, second, view };

  try {
    parent.set({ children: [second], primary: second });
  } catch (error) {
    return historicalFailure(cell, error, 'second relation mutation', historicalState);
  }
  try {
    await save(parent);
  } catch (error) {
    return historicalFailure(cell, error, 'second relation save', historicalState);
  }
  const secondAfterSave = observeRelations(kb, view, original, direct);

  parent.set({ children: [], primary: null });
  await save(parent);
  const emptyAfterSave = observeRelations(kb, view, original, direct);
  const released = releaseObservables(kb, direct, view);
  const cleanup = {
    childListenersRestored: listenerCount(first) === listenersBefore.first && listenerCount(second) === listenersBefore.second,
    parentListenersRestored: listenerCount(parent) === listenersBefore.parent,
    released,
  };
  kb.configure({ orm: 'default' });
  const observation: RuntimeObservation = { cleanup, emptyAfterSave, firstAfterSave, initial, kind: 'success', secondAfterSave };
  return observation;
}

const root = process.argv[2];
assert.ok(root, 'Expected the staged cell root as argv[2]');
const cell = JSON.parse(await readFile(path.join(root, 'case.json'), 'utf8')) as MatrixCell;
const observation = await exerciseCell(cell, root);
process.stdout.write(`UPGRADE_MATRIX_RESULT ${JSON.stringify(observation)}\n`);
