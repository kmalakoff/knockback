import { readFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import kb from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ModelRef from 'backbone-modelref';
import ORM, { type CursorInstance } from 'backbone-orm';
import SQL from 'backbone-sql';
import ko from 'knockout';

interface Attributes {
  id?: number;
  name?: string;
  score?: number;
}

function once(cleanup: () => void): () => void {
  let attempted = false;
  return () => {
    if (attempted) return;
    attempted = true;
    cleanup();
  };
}

function call(host: object, method: string, ...args: unknown[]): unknown {
  const operation: unknown = Reflect.get(host, method);
  assert.ok(typeof operation === 'function', `Missing public ${method}`);
  return Reflect.apply(operation, host, args);
}

function control(type: object, method: string, ...args: unknown[]): unknown {
  const prototype: unknown = Reflect.get(type, 'prototype');
  assert.ok(typeof prototype === 'object' && prototype !== null);
  const sync: unknown = Reflect.get(prototype, 'sync');
  assert.ok(typeof sync === 'function');
  return Reflect.apply(sync, type, [method, ...args]);
}

function listeners(target: object): number {
  const events: unknown = Reflect.get(target, '_events');
  if (!events) return 0;
  assert.ok(typeof events === 'object');
  return Object.values(events).reduce<number>((total, value: unknown) => total + (Array.isArray(value) ? value.length : 1), 0);
}

function bindingCount(target: object, event: string, callback: unknown, context: unknown): number {
  const events: unknown = Reflect.get(target, '_events');
  if (!events) return 0;
  assert.ok(typeof events === 'object');
  const bindings: unknown = Reflect.get(events, event);
  if (bindings === undefined) return 0;
  assert.ok(Array.isArray(bindings));
  return bindings.reduce<number>((count, binding: unknown) => {
    assert.ok(typeof binding === 'object' && binding !== null);
    const actual: unknown = Reflect.get(binding, 'callback');
    assert.ok(typeof actual === 'function');
    return count + (actual === callback && Reflect.get(binding, 'context') === context ? 1 : 0);
  }, 0);
}

async function materialize(type: object, id: number): Promise<Backbone.Model[]> {
  const cursor = control(type, 'cursor', { id });
  assert.ok(cursor instanceof ORM.Cursor);
  const typed: CursorInstance = cursor;
  let notifications = 0;
  const models = await new Promise<Backbone.Model[]>((resolve, reject) => {
    const returned = typed.toModels((error, value) => {
      notifications++;
      if (error) reject(error);
      else if (!Array.isArray(value)) reject(new Error('Expected full PostgreSQL model array'));
      else resolve(value);
    });
    assert.strictEqual(returned, undefined);
  });
  assert.strictEqual(notifications, 1);
  return models;
}

async function saveRelations(model: Backbone.Model): Promise<void> {
  let notifications = 0;
  await new Promise<void>((resolve, reject) => {
    model.save(null, {
      success: () => {
        notifications++;
        assert.strictEqual(notifications, 1);
        resolve();
      },
      error: (_model, error: unknown) => {
        notifications++;
        assert.strictEqual(notifications, 1);
        reject(error);
      },
    });
  });
  assert.strictEqual(notifications, 1);
}

function childViewName(value: unknown): unknown {
  assert.ok(typeof value === 'object' && value !== null);
  const name: unknown = Reflect.get(value, 'name');
  assert.ok(ko.isObservable(name));
  return name();
}

function relationViewState(view: object, primary: string | null, children: string[]): void {
  const one: unknown = Reflect.get(view, 'primary');
  const many: unknown = Reflect.get(view, 'children');
  assert.ok(ko.isObservable(one));
  assert.ok(ko.isObservable(many));
  const selected: unknown = one();
  if (primary === null) {
    if (selected !== null) {
      assert.ok(selected instanceof kb.ViewModel, 'null primary must be a real ViewModel or literal null');
      assert.ok(selected !== view, 'null primary must not alias the root ViewModel');
      assert.strictEqual(call(selected, 'model'), null, 'null primary must have no live model');
      const metadata: unknown = Reflect.get(selected, '__kb');
      const rootMetadata: unknown = Reflect.get(view, '__kb');
      assert.ok(typeof metadata === 'object' && metadata !== null);
      assert.ok(typeof rootMetadata === 'object' && rootMetadata !== null);
      assert.strictEqual(Reflect.get(metadata, 'object'), null, 'null primary must have no wrapped model');
      const store: unknown = Reflect.get(rootMetadata, 'store');
      assert.ok(store instanceof kb.Store);
      assert.ok(Reflect.get(metadata, 'store') === store, 'null primary must share the root owning Store');
      const name: unknown = Reflect.get(selected, 'name');
      assert.ok(name === undefined || ko.isObservable(name), 'null primary name must be absent or a real observable');
      if (name !== undefined) {
        const observedName: unknown = name();
        assert.ok(observedName === null || observedName === undefined, 'null primary must have no model-name value');
      }
    }
  } else assert.strictEqual(childViewName(selected), primary);
  const values: unknown = many();
  assert.ok(Array.isArray(values));
  assert.deepStrictEqual(values.map(childViewName), children);
}

async function includedParent(type: object, id: number, primary: number | null, children: number[], enabled: boolean, owner: Backbone.Model): Promise<void> {
  const query = { id, $include: ['primary', 'children'] };
  const cursor = control(type, 'cursor', query);
  assert.ok(cursor instanceof ORM.Cursor);
  const typed: CursorInstance = cursor;
  let notifications = 0;
  const rows: unknown = await new Promise<unknown>((resolve, reject) => {
    typed.toJSON((error, value) => {
      notifications++;
      if (error) reject(error);
      else resolve(value);
    });
  });
  assert.strictEqual(notifications, 1);
  assert.ok(Array.isArray(rows) && rows.length === 1);
  const row: unknown = rows[0];
  assert.ok(typeof row === 'object' && row !== null);
  const selected: unknown = Reflect.get(row, 'primary');
  if (primary === null) assert.strictEqual(selected, null);
  else {
    assert.ok(typeof selected === 'object' && selected !== null);
    assert.strictEqual(Reflect.get(selected, 'id'), primary);
  }
  const related: unknown = Reflect.get(row, 'children');
  assert.ok(Array.isArray(related));
  assert.deepStrictEqual(
    related
      .map((child: unknown) => {
        assert.ok(typeof child === 'object' && child !== null);
        return Reflect.get(child, 'id');
      })
      .sort(),
    [...children].sort()
  );
  const found: unknown = await call(type, 'find', query);
  assert.ok(Array.isArray(found) && found.length === 1 && found[0] instanceof Backbone.Model);
  if (enabled) assert.strictEqual(found[0], owner);
  else assert.notStrictEqual(found[0], owner);
  const foundPrimary: unknown = found[0].get('primary');
  if (primary === null) assert.strictEqual(foundPrimary, null);
  else {
    assert.ok(foundPrimary instanceof Backbone.Model);
    assert.strictEqual(foundPrimary.id, primary);
  }
  const foundChildren: unknown = found[0].get('children');
  assert.ok(foundChildren instanceof Backbone.Collection);
  assert.deepStrictEqual(foundChildren.pluck('id').sort(), [...children].sort());
}

async function exerciseRelations(format: 'cjs' | 'esm', enabled: boolean, url: string, connection: unknown, capture: () => void, cleanups: (() => void)[]): Promise<object> {
  const suffix = `${format}_${enabled ? 'on' : 'off'}`;
  class Child extends Backbone.Model<Attributes> {
    urlRoot = `${url}family_pg_children_${suffix}`;
    schema(): object {
      return { name: 'String' };
    }
  }
  class Parent extends Backbone.Model {
    urlRoot = `${url}family_pg_parents_${suffix}`;
    schema(): object {
      return { name: 'String', primary: () => ['belongsTo', Child], children: () => ['hasMany', Child] };
    }
  }
  try {
    Child.prototype.sync = SQL.sync(Child);
    assert.strictEqual(Parent.prototype.sync, Backbone.Model.prototype.sync, 'Parent must receive only its first SQL configuration');
    Parent.prototype.sync = SQL.sync(Parent);
  } finally {
    capture();
  }
  for (const type of [Child, Parent]) {
    const db = control(type, 'db');
    assert.ok(typeof db === 'object' && db !== null);
    assert.ok(Reflect.get(db, 'connection') === connection, 'Relation models must share the exact flat SQL connection');
  }
  let resets = 0;
  await new Promise<void>((resolve, reject) => {
    call(ORM.Utils, 'resetSchemas', [Child, Parent], {}, (error: unknown) => {
      resets++;
      assert.strictEqual(resets, 1);
      if (error) reject(error);
      else resolve();
    });
  });
  assert.strictEqual(resets, 1);
  const first = new Child({ name: 'relation first' });
  const second = new Child({ name: 'relation second' });
  const survivor = new Child({ name: 'relation survivor' });
  for (const child of [first, second, survivor]) await saveRelations(child);
  assert.ok(typeof first.id === 'number' && typeof second.id === 'number' && typeof survivor.id === 'number');
  const beforeSurvivor = listeners(survivor);
  const parent = new Parent({ name: 'relation parent', primary: null, children: [] });
  await saveRelations(parent);
  assert.ok(typeof parent.id === 'number');
  const id: number = parent.id;
  const beforeParent = listeners(parent);
  const view = kb.viewModel(parent, { keys: ['name', 'primary', 'children'] });
  const disposeView = once(() => view.dispose());
  cleanups.push(disposeView);
  const primary = view.primary;
  const children = view.children;
  assert.ok(ko.isObservable(primary) && ko.isObservable(children));
  assert.strictEqual(call(primary, 'valueType'), kb.TYPE_MODEL);
  assert.strictEqual(call(children, 'valueType'), kb.TYPE_COLLECTION);
  relationViewState(view, null, []);
  const primaryChanges: unknown[] = [];
  const primarySubscription = primary.subscribe((value: unknown) => primaryChanges.push(value === null ? null : childViewName(value)));
  cleanups.push(once(() => primarySubscription.dispose()));
  parent.set({ primary: first, children: [first] });
  relationViewState(view, 'relation first', ['relation first']);
  await saveRelations(parent);
  await includedParent(Parent, id, first.id, [first.id], enabled, parent);
  const fetched = new Parent({ id });
  let fetches = 0;
  await new Promise<void>((resolve, reject) => {
    fetched.fetch({
      success: () => {
        fetches++;
        resolve();
      },
      error: (_model, error: unknown) => {
        fetches++;
        reject(error);
      },
    });
  });
  assert.strictEqual(fetches, 1);
  assert.strictEqual(fetched.get('name'), 'relation parent');
  let loads = 0;
  const fetchedChildren: unknown = await new Promise<unknown>((resolve, reject) => {
    call(fetched, 'get', 'children', (error: unknown, models: unknown) => {
      loads++;
      if (error) reject(error);
      else resolve(models);
    });
  });
  assert.strictEqual(loads, 1);
  assert.ok(Array.isArray(fetchedChildren));
  assert.deepStrictEqual(
    fetchedChildren.map((child: unknown) => {
      assert.ok(child instanceof Child);
      return child.id;
    }),
    [first.id]
  );
  assert.strictEqual(view.primary, primary);
  assert.strictEqual(view.children, children);
  parent.set({ primary: second, children: [second] });
  relationViewState(view, 'relation second', ['relation second']);
  await saveRelations(parent);
  await includedParent(Parent, id, second.id, [second.id], enabled, parent);
  assert.strictEqual(view.primary, primary);
  assert.strictEqual(view.children, children);
  parent.set({ primary: null, children: [] });
  relationViewState(view, null, []);
  await saveRelations(parent);
  await includedParent(Parent, id, null, [], enabled, parent);
  assert.strictEqual(view.primary, primary);
  assert.strictEqual(view.children, children);
  assert.deepStrictEqual(primaryChanges, ['relation first', 'relation second', null]);
  disposeView();
  assert.strictEqual(listeners(parent), beforeParent);

  const collection = new Backbone.Collection<Parent>();
  const clearCollection = once(() => collection.reset([]));
  cleanups.push(clearCollection);
  const reference = new ModelRef<Parent>(collection, id);
  const releaseReference = once(() => reference.release());
  cleanups.push(releaseReference);
  const refView = kb.viewModel(reference, { keys: ['name', 'primary', 'children'] });
  const disposeReferenceView = once(() => refView.dispose());
  cleanups.push(disposeReferenceView);
  const refName = refView.name;
  assert.ok(ko.isObservable(refName));
  assert.strictEqual(refName(), null);
  const refPrimary = refView.primary;
  const refChildren = refView.children;
  assert.ok(ko.isObservable(refPrimary) && ko.isObservable(refChildren));
  assert.strictEqual(refPrimary(), null);
  assert.strictEqual(refChildren(), null);
  const metadata: unknown = Reflect.get(refView, '__kb');
  assert.ok(typeof metadata === 'object' && metadata !== null);
  const rootWatcher: unknown = Reflect.get(metadata, 'eventWatcher');
  assert.ok(typeof rootWatcher === 'object' && rootWatcher !== null);
  const watcherMetadata: unknown = Reflect.get(rootWatcher, '__kb');
  assert.ok(typeof watcherMetadata === 'object' && watcherMetadata !== null);
  const callbacks: unknown = Reflect.get(watcherMetadata, 'callbacks');
  assert.ok(typeof callbacks === 'object' && callbacks !== null);
  const changeBinding: unknown = Reflect.get(callbacks, 'change');
  assert.ok(typeof changeBinding === 'object' && changeBinding !== null);
  const rootChangeCallback: unknown = Reflect.get(changeBinding, 'fn');
  assert.ok(typeof rootChangeCallback === 'function');
  const membershipCallback: unknown = Reflect.get(collection, '_onModelEvent');
  assert.ok(typeof membershipCallback === 'function');
  collection.add(parent);
  assert.strictEqual(refView.model(), parent);
  assert.strictEqual(refName(), 'relation parent');
  relationViewState(refView, null, []);
  assert.strictEqual(bindingCount(parent, 'change', rootChangeCallback, undefined), 1);
  assert.strictEqual(bindingCount(parent, 'all', membershipCallback, collection), 1);
  const replacement = new Parent({ id, name: 'relation replacement', primary: second, children: [second] });
  const beforeReplacement = listeners(replacement);
  collection.reset([replacement]);
  assert.strictEqual(refView.model(), replacement);
  assert.strictEqual(refName(), 'relation replacement');
  relationViewState(refView, 'relation second', ['relation second']);
  assert.strictEqual(bindingCount(replacement, 'change', rootChangeCallback, undefined), 1);
  assert.strictEqual(bindingCount(replacement, 'all', membershipCallback, collection), 1);
  assert.strictEqual(bindingCount(parent, 'change', rootChangeCallback, undefined), 0);
  assert.strictEqual(bindingCount(parent, 'all', membershipCallback, collection), 0);
  assert.strictEqual(listeners(parent), beforeParent);
  collection.remove(replacement);
  assert.strictEqual(refView.model(), null);
  assert.strictEqual(refName(), null);
  relationViewState(refView, null, []);
  // Unload detaches the direct emitter; cached relation views remain owned until root Store disposal.
  assert.strictEqual(bindingCount(replacement, 'change', rootChangeCallback, undefined), 0);
  assert.strictEqual(bindingCount(replacement, 'all', membershipCallback, collection), 0);
  collection.add(parent);
  assert.strictEqual(refView.model(), parent);
  assert.strictEqual(refView.name, refName);
  assert.strictEqual(refView.primary, refPrimary);
  assert.strictEqual(refView.children, refChildren);
  relationViewState(refView, null, []);
  assert.strictEqual(bindingCount(parent, 'change', rootChangeCallback, undefined), 1);
  assert.strictEqual(bindingCount(parent, 'all', membershipCallback, collection), 1);
  disposeReferenceView();
  assert.strictEqual(reference.ref_count, 1);
  assert.strictEqual(listeners(reference), 0);
  releaseReference();
  assert.strictEqual(reference.ref_count, 0);
  assert.strictEqual(listeners(collection), 0);
  clearCollection();
  assert.strictEqual(listeners(parent), beforeParent);
  assert.strictEqual(listeners(replacement), beforeReplacement);
  let destroys = 0;
  await new Promise<void>((resolve, reject) => {
    parent.destroy({
      success: () => {
        destroys++;
        resolve();
      },
      error: (_model, error: unknown) => {
        destroys++;
        reject(error);
      },
    });
  });
  assert.strictEqual(destroys, 1);
  assert.deepStrictEqual(await materialize(Parent, id), []);
  for (const child of [first, second, survivor]) {
    assert.ok(typeof child.id === 'number');
    const remaining = await materialize(Child, child.id);
    assert.strictEqual(remaining.length, 1);
    assert.strictEqual(remaining[0].get('name'), child.get('name'));
    if (enabled) assert.strictEqual(remaining[0], child);
  }
  assert.strictEqual(listeners(survivor), beforeSurvivor);
  return { firstConfiguration: true, includesReplacementAndNullEmpty: true, relationObservables: true, modelRefCleanup: true, independentSurvivors: true };
}

async function exerciseHasOne(format: 'cjs' | 'esm', enabled: boolean, url: string, connection: unknown, capture: () => void, cleanups: (() => void)[]): Promise<object> {
  const suffix = `${format}_${enabled ? 'on' : 'off'}`;
  class Profile extends Backbone.Model<Attributes> {
    urlRoot = `${url}family_pg_hasone_profiles_${suffix}`;
    schema(): object {
      return { name: 'String' };
    }
  }
  class Owner extends Backbone.Model {
    urlRoot = `${url}family_pg_hasone_owners_${suffix}`;
    schema(): object {
      return { name: 'String', profile: () => ['hasOne', Profile] };
    }
  }
  try {
    Profile.prototype.sync = SQL.sync(Profile);
    assert.strictEqual(Owner.prototype.sync, Backbone.Model.prototype.sync, 'HasOne Owner must receive only its first SQL configuration');
    Owner.prototype.sync = SQL.sync(Owner);
  } finally {
    capture();
  }
  const profileDB = control(Profile, 'db');
  const ownerDB = control(Owner, 'db');
  assert.ok(typeof profileDB === 'object' && profileDB !== null);
  assert.ok(typeof ownerDB === 'object' && ownerDB !== null);
  for (const db of [profileDB, ownerDB]) {
    assert.ok(typeof db === 'object' && db !== null);
    assert.ok(Reflect.get(db, 'connection') === connection, 'HasOne must retain the exact flat SQL connection');
  }
  const relation: unknown = call(Owner, 'relation', 'profile');
  assert.ok(typeof relation === 'object' && relation !== null);
  assert.strictEqual(Reflect.get(relation, 'type'), 'hasOne');
  assert.ok(Reflect.get(relation, 'model_type') === Owner);
  const reverse: unknown = Reflect.get(relation, 'reverse_relation');
  assert.ok(typeof reverse === 'object' && reverse !== null);
  assert.strictEqual(Reflect.get(reverse, 'type'), 'belongsTo');
  assert.ok(Reflect.get(reverse, 'model_type') === Profile);
  assert.ok(Reflect.get(reverse, 'reverse_model_type') === Owner);
  const reverseKey: unknown = Reflect.get(reverse, 'key');
  const foreignKey: unknown = Reflect.get(reverse, 'foreign_key');
  assert.ok(typeof reverseKey === 'string' && reverseKey.length > 0);
  assert.ok(typeof foreignKey === 'string' && foreignKey.length > 0);
  await new Promise<void>((resolve, reject) => {
    const returned = call(profileDB, 'createOrUpdateTable', {}, (error: unknown) => (error ? reject(error) : resolve()));
    assert.strictEqual(returned, undefined);
  });
  await new Promise<void>((resolve, reject) => {
    const returned = call(ownerDB, 'ensureSchema', (error: unknown) => (error ? reject(error) : resolve()));
    assert.strictEqual(returned, undefined);
  });
  assert.ok(typeof connection === 'object' && connection !== null);
  const databaseValue: unknown = call(connection, 'knex');
  assert.ok(typeof databaseValue === 'function');
  const database = databaseValue;
  async function nativeRow(type: object, id: number): Promise<object> {
    const table: unknown = control(type, 'tableName');
    assert.ok(typeof table === 'string' && table.length > 0);
    const query: unknown = Reflect.apply(database, undefined, [table]);
    assert.ok(typeof query === 'object' && query !== null);
    const filtered: unknown = call(query, 'where', { id });
    assert.ok(typeof filtered === 'object' && filtered !== null);
    const row: unknown = await call(filtered, 'first');
    assert.ok(typeof row === 'object' && row !== null);
    assert.strictEqual(Reflect.get(row, 'id'), id);
    return row;
  }
  const first = new Profile({ name: 'hasOne first' });
  const second = new Profile({ name: 'hasOne second' });
  const survivor = new Profile({ name: 'hasOne survivor' });
  for (const profile of [first, second, survivor]) await saveRelations(profile);
  assert.ok(typeof first.id === 'number' && typeof second.id === 'number' && typeof survivor.id === 'number');
  const owner = new Owner({ name: 'hasOne owner', profile: null });
  const other = new Owner({ name: 'hasOne independent', profile: survivor });
  await saveRelations(owner);
  await saveRelations(other);
  assert.ok(typeof owner.id === 'number' && typeof other.id === 'number');
  const id: number = owner.id;
  const survivorBefore = await nativeRow(Profile, survivor.id);
  const otherBefore = await nativeRow(Owner, other.id);
  assert.strictEqual(Reflect.get(survivorBefore, foreignKey), other.id);

  async function included(expected: Profile | null): Promise<{ foundOwner: Owner; foundProfile: unknown; materializedOwner: Owner; materializedProfile: unknown }> {
    const query = { id, $include: ['profile'] };
    const cursor = control(Owner, 'cursor', query);
    assert.ok(cursor instanceof ORM.Cursor);
    const typed: CursorInstance = cursor;
    let notifications = 0;
    const rows: unknown = await new Promise<unknown>((resolve, reject) => {
      const returned = typed.toJSON((error, value) => {
        notifications++;
        if (error) reject(error);
        else resolve(value);
      });
      assert.strictEqual(returned, undefined);
    });
    assert.strictEqual(notifications, 1);
    assert.ok(Array.isArray(rows) && rows.length === 1);
    assert.ok(typeof rows[0] === 'object' && rows[0] !== null);
    const selected: unknown = Reflect.get(rows[0], 'profile');
    if (expected === null) assert.strictEqual(selected, null);
    else {
      assert.ok(typeof selected === 'object' && selected !== null);
      assert.strictEqual(Reflect.get(selected, 'id'), expected.id);
      assert.strictEqual(Reflect.get(selected, 'name'), expected.get('name'));
    }
    const found: unknown = await call(Owner, 'find', query);
    let modelNotifications = 0;
    const models: unknown = await new Promise<unknown>((resolve, reject) => {
      const returned = typed.toModels((error, value) => {
        modelNotifications++;
        if (error) reject(error);
        else resolve(value);
      });
      assert.strictEqual(returned, undefined);
    });
    assert.strictEqual(modelNotifications, 1);
    assert.ok(Array.isArray(found) && found.length === 1 && found[0] instanceof Owner);
    assert.ok(Array.isArray(models) && models.length === 1 && models[0] instanceof Owner);
    const includedProfiles: unknown[] = [];
    for (const model of [found[0], models[0]]) {
      if (enabled) assert.strictEqual(model, owner);
      else assert.notStrictEqual(model, owner);
      const profile: unknown = model.get('profile');
      includedProfiles.push(profile);
      if (expected === null) assert.strictEqual(profile, null);
      else {
        assert.ok(profile instanceof Profile);
        assert.strictEqual(profile.id, expected.id);
        assert.strictEqual(profile.get('name'), expected.get('name'));
        if (enabled) assert.strictEqual(profile, expected);
      }
    }
    return { foundOwner: found[0], foundProfile: includedProfiles[0], materializedOwner: models[0], materializedProfile: includedProfiles[1] };
  }
  await included(null);
  const beforeOwner = listeners(owner);
  const beforeFirst = listeners(first);
  const beforeSecond = listeners(second);
  const beforeSurvivor = listeners(survivor);
  const view = kb.viewModel(owner, { keys: ['name', 'profile'] });
  const disposeView = once(() => view.dispose());
  cleanups.push(disposeView);
  const profile = view.profile;
  assert.ok(ko.isObservable(profile));
  assert.strictEqual(call(profile, 'valueType'), kb.TYPE_MODEL);
  function state(target: object, expected: string | null): void {
    const observable: unknown = Reflect.get(target, 'profile');
    assert.ok(ko.isObservable(observable));
    const selected: unknown = observable();
    if (expected !== null) assert.strictEqual(childViewName(selected), expected);
    else if (selected !== null) {
      assert.ok(selected instanceof kb.ViewModel && selected !== target);
      assert.strictEqual(call(selected, 'model'), null);
      const metadata: unknown = Reflect.get(selected, '__kb');
      const rootMetadata: unknown = Reflect.get(target, '__kb');
      assert.ok(typeof metadata === 'object' && metadata !== null);
      assert.ok(typeof rootMetadata === 'object' && rootMetadata !== null);
      assert.strictEqual(Reflect.get(metadata, 'object'), null);
      const store: unknown = Reflect.get(rootMetadata, 'store');
      assert.ok(store instanceof kb.Store);
      assert.ok(Reflect.get(metadata, 'store') === store);
      const name: unknown = Reflect.get(selected, 'name');
      assert.ok(name === undefined || ko.isObservable(name));
      if (name !== undefined) assert.ok(name() === null || name() === undefined);
    }
  }
  state(view, null);
  const changes: unknown[] = [];
  const subscription = profile.subscribe((value: unknown) => {
    if (value === null || (value instanceof kb.ViewModel && call(value, 'model') === null)) {
      state(view, null);
      changes.push(null);
    } else changes.push(childViewName(value));
  });
  const disposeSubscription = once(() => subscription.dispose());
  cleanups.push(disposeSubscription);
  owner.set('profile', first);
  state(view, 'hasOne first');
  await saveRelations(owner);
  assert.strictEqual(Reflect.get(await nativeRow(Profile, first.id), foreignKey), id);
  const firstIncluded = await included(first);
  const beforeReplacementProfile: unknown = owner.get('profile');
  const beforeReplacementReverse: unknown = call(first, 'get', reverseKey);
  owner.set('profile', second);
  const afterSetProfile: unknown = owner.get('profile');
  const afterSetReverse: unknown = call(first, 'get', reverseKey);
  state(view, 'hasOne second');
  await saveRelations(owner);
  const afterSaveProfile: unknown = owner.get('profile');
  const afterSaveReverse: unknown = call(first, 'get', reverseKey);
  assert.strictEqual(Reflect.get(await nativeRow(Profile, first.id), foreignKey), null);
  assert.strictEqual(Reflect.get(await nativeRow(Profile, second.id), foreignKey), id);
  console.log(
    JSON.stringify({
      pgHasOneReverseIdentity: {
        cacheEnabled: enabled,
        foundProfileIsFirst: firstIncluded.foundProfile === first,
        materializedProfileIsFirst: firstIncluded.materializedProfile === first,
        beforeReplacement: {
          ownerProfileIsFirst: beforeReplacementProfile === first,
          firstReverseIsOriginalOwner: beforeReplacementReverse === owner,
          firstReverseIsFoundOwner: beforeReplacementReverse === firstIncluded.foundOwner,
          firstReverseIsMaterializedOwner: beforeReplacementReverse === firstIncluded.materializedOwner,
          firstReverseIsNull: beforeReplacementReverse === null,
        },
        afterSet: {
          ownerProfileIsSecond: afterSetProfile === second,
          firstReverseIsOriginalOwner: afterSetReverse === owner,
          firstReverseIsFoundOwner: afterSetReverse === firstIncluded.foundOwner,
          firstReverseIsMaterializedOwner: afterSetReverse === firstIncluded.materializedOwner,
          firstReverseIsNull: afterSetReverse === null,
        },
        afterSave: {
          ownerProfileIsSecond: afterSaveProfile === second,
          firstReverseIsOriginalOwner: afterSaveReverse === owner,
          firstReverseIsFoundOwner: afterSaveReverse === firstIncluded.foundOwner,
          firstReverseIsMaterializedOwner: afterSaveReverse === firstIncluded.materializedOwner,
          firstReverseIsNull: afterSaveReverse === null,
        },
      },
    })
  );
  assert.ok(call(first, 'get', reverseKey) === (enabled ? null : owner), 'Saved old Profile backlink must match exact cache-mode ownership');
  await included(second);
  owner.set('profile', null);
  state(view, null);
  await saveRelations(owner);
  assert.strictEqual(Reflect.get(await nativeRow(Profile, second.id), foreignKey), null, 'Final hasOne save must clear the native reverse FK before include');
  assert.strictEqual(call(second, 'get', reverseKey), null);
  await included(null);
  const fetched = new Owner({ id });
  await call(fetched, 'fetch', { force: true });
  let loads = 0;
  const fetchedProfile: unknown = await new Promise<unknown>((resolve, reject) =>
    call(fetched, 'get', 'profile', (error: unknown, value: unknown) => {
      loads++;
      if (error) reject(error);
      else resolve(value);
    })
  );
  assert.strictEqual(loads, 1);
  assert.strictEqual(fetchedProfile, null);
  assert.strictEqual(view.profile, profile);
  assert.deepStrictEqual(changes, ['hasOne first', 'hasOne second', null]);
  disposeSubscription();
  disposeView();
  assert.strictEqual(listeners(owner), beforeOwner);

  const collection = new Backbone.Collection<Owner>();
  const collectionListeners = listeners(collection);
  const clearCollection = once(() => {
    collection.reset([]);
  });
  cleanups.push(clearCollection);
  const reference = new ModelRef<Owner>(collection, id);
  const releaseReference = once(() => {
    reference.release();
  });
  cleanups.push(releaseReference);
  const refView = kb.viewModel(reference, { keys: ['name', 'profile'] });
  const disposeReferenceView = once(() => refView.dispose());
  cleanups.push(disposeReferenceView);
  const refName = refView.name;
  const refProfile = refView.profile;
  assert.ok(ko.isObservable(refName) && ko.isObservable(refProfile));
  assert.strictEqual(refView.model(), null);
  assert.strictEqual(refName(), null);
  assert.strictEqual(refProfile(), null);
  const metadata: unknown = Reflect.get(refView, '__kb');
  assert.ok(typeof metadata === 'object' && metadata !== null);
  const store: unknown = Reflect.get(metadata, 'store');
  assert.ok(store instanceof kb.Store);
  const watcher: unknown = Reflect.get(metadata, 'eventWatcher');
  assert.ok(typeof watcher === 'object' && watcher !== null);
  const watcherMetadata: unknown = Reflect.get(watcher, '__kb');
  assert.ok(typeof watcherMetadata === 'object' && watcherMetadata !== null);
  const callbacks: unknown = Reflect.get(watcherMetadata, 'callbacks');
  assert.ok(typeof callbacks === 'object' && callbacks !== null);
  const change: unknown = Reflect.get(callbacks, 'change');
  assert.ok(typeof change === 'object' && change !== null);
  const rootCallback: unknown = Reflect.get(change, 'fn');
  const membershipCallback: unknown = Reflect.get(collection, '_onModelEvent');
  assert.ok(typeof rootCallback === 'function' && typeof membershipCallback === 'function');
  collection.add(owner);
  assert.strictEqual(refView.model(), owner);
  assert.strictEqual(refName(), 'hasOne owner');
  state(refView, null);
  const replacement = new Owner({ id, name: 'hasOne reference replacement', profile: second });
  const beforeReplacement = listeners(replacement);
  collection.reset([replacement]);
  assert.strictEqual(refView.model(), replacement);
  assert.strictEqual(refName(), 'hasOne reference replacement');
  state(refView, 'hasOne second');
  assert.strictEqual(bindingCount(owner, 'change', rootCallback, undefined), 0);
  assert.strictEqual(bindingCount(owner, 'all', membershipCallback, collection), 0);
  collection.remove(replacement);
  assert.strictEqual(refView.model(), null);
  assert.strictEqual(refName(), null);
  state(refView, null);
  assert.strictEqual(bindingCount(replacement, 'change', rootCallback, undefined), 0);
  assert.strictEqual(bindingCount(replacement, 'all', membershipCallback, collection), 0);
  collection.add(owner);
  assert.strictEqual(refView.model(), owner);
  assert.strictEqual(refView.name, refName);
  assert.strictEqual(refView.profile, refProfile);
  state(refView, null);
  assert.strictEqual(bindingCount(owner, 'change', rootCallback, undefined), 1);
  assert.strictEqual(bindingCount(owner, 'all', membershipCallback, collection), 1);
  disposeReferenceView();
  assert.strictEqual(reference.ref_count, 1);
  assert.strictEqual(listeners(reference), 0);
  assert.strictEqual(kb.wasReleased(store), true);
  const stores: unknown = Reflect.get(kb.Store, 'instances');
  assert.ok(Array.isArray(stores));
  assert.ok(!stores.includes(store), 'Disposed hasOne Store must release its global ownership');
  releaseReference();
  assert.strictEqual(reference.ref_count, 0);
  assert.strictEqual(listeners(collection), collectionListeners);
  clearCollection();
  assert.strictEqual(listeners(owner), beforeOwner);
  assert.strictEqual(listeners(replacement), beforeReplacement);
  assert.strictEqual(listeners(first), beforeFirst);
  assert.strictEqual(listeners(second), beforeSecond);
  assert.strictEqual(listeners(survivor), beforeSurvivor);
  for (const current of [first, second, survivor]) {
    assert.ok(typeof current.id === 'number');
    const models = await materialize(Profile, current.id);
    assert.strictEqual(models.length, 1);
    assert.strictEqual(models[0].get('name'), current.get('name'));
    if (enabled) assert.strictEqual(models[0], current);
  }
  assert.deepStrictEqual(await nativeRow(Profile, survivor.id), survivorBefore);
  assert.deepStrictEqual(await nativeRow(Owner, other.id), otherBefore);
  assert.ok(control(Profile, 'db') === profileDB && control(Owner, 'db') === ownerDB, 'HasOne database controls changed');
  return { generatedInverse: true, nativeNullSave: true, materialization: true, observableChanges: true, modelRefCleanup: true, independentSurvivors: true };
}

async function exercisePivots(format: 'cjs' | 'esm', enabled: boolean, url: string, connection: unknown, capture: () => void, cleanups: (() => void)[]): Promise<object> {
  const suffix = `${format}_${enabled ? 'on' : 'off'}`;
  class Course extends Backbone.Model<Attributes> {
    urlRoot = `${url}fp_${suffix}_courses`;
    schema(): object {
      return { name: 'String', score: 'Integer', students: () => ['hasMany', Student, { as: 'courses', foreign_key: 'course_alias', join_key: 'pivot_course_id' }] };
    }
  }
  class Student extends Backbone.Model {
    urlRoot = `${url}fp_${suffix}_students`;
    schema(): object {
      return { name: 'String', courses: () => ['hasMany', Course, { as: 'students', foreign_key: 'student_alias', join_key: 'pivot_student_id' }] };
    }
  }
  try {
    assert.ok(Student.prototype.sync === Backbone.Model.prototype.sync && Course.prototype.sync === Backbone.Model.prototype.sync, 'Pivot endpoints must receive first configuration only');
    Student.prototype.sync = SQL.sync(Student);
  } finally {
    capture();
  }
  const relation: unknown = call(Student, 'relation', 'courses');
  assert.ok(typeof relation === 'object' && relation !== null);
  assert.strictEqual(Reflect.get(relation, 'type'), 'hasMany');
  const reverse: unknown = Reflect.get(relation, 'reverse_relation');
  assert.ok(typeof reverse === 'object' && reverse !== null);
  assert.strictEqual(Reflect.get(reverse, 'type'), 'hasMany');
  const pivot: unknown = Reflect.get(relation, 'join_table');
  assert.ok(typeof pivot === 'function');
  assert.ok(Reflect.get(reverse, 'join_table') === pivot, 'Both pivot relations must share their registered table');
  const studentKey: unknown = Reflect.get(relation, 'join_key');
  const courseKey: unknown = Reflect.get(reverse, 'join_key');
  const studentAlias: unknown = Reflect.get(relation, 'foreign_key');
  const courseAlias: unknown = Reflect.get(reverse, 'foreign_key');
  assert.ok(typeof studentAlias === 'string' && typeof courseAlias === 'string');
  assert.strictEqual(studentAlias, 'student_alias');
  assert.strictEqual(courseAlias, 'course_alias');
  assert.strictEqual(studentKey, 'pivot_student_id');
  assert.strictEqual(courseKey, 'pivot_course_id');
  assert.ok(typeof studentKey === 'string' && typeof courseKey === 'string');
  const table: unknown = control(pivot, 'tableName');
  assert.ok(typeof table === 'string' && table.length > 0);
  const controls = [Student, Course, pivot].map((type) => control(type, 'db'));
  for (const db of controls) {
    assert.ok(typeof db === 'object' && db !== null);
    assert.ok(Reflect.get(db, 'connection') === connection, 'Pivot endpoints and table must retain the exact acquired connection');
  }
  const courseTable: unknown = control(Course, 'tableName');
  const studentTable: unknown = control(Student, 'tableName');
  assert.ok(typeof courseTable === 'string' && typeof studentTable === 'string', 'Pivot endpoint table names must be strings');
  assert.strictEqual(courseTable, `fp_${suffix}_courses`);
  assert.strictEqual(studentTable, `fp_${suffix}_students`);
  assert.strictEqual(table, [courseTable, studentTable].sort().join('_'));
  assert.ok(typeof connection === 'object' && connection !== null);
  const databaseValue: unknown = call(connection, 'knex');
  assert.ok(typeof databaseValue === 'function');
  const database = databaseValue;
  const schemaBuilder: unknown = Reflect.get(database, 'schema');
  assert.ok(typeof schemaBuilder === 'object' && schemaBuilder !== null);
  const indexDDL: unknown = call(schemaBuilder, 'createTable', table, (builder: unknown) => {
    assert.ok(typeof builder === 'object' && builder !== null);
    for (const key of [courseKey, studentKey]) {
      const column: unknown = call(builder, 'integer', key);
      assert.ok(typeof column === 'object' && column !== null);
      call(column, 'index');
    }
  });
  assert.ok(typeof indexDDL === 'object' && indexDDL !== null);
  const statements: unknown = call(indexDDL, 'toSQL');
  assert.ok(Array.isArray(statements), 'Pivot index compilation must return SQL statements');
  const indexNames: string[] = [];
  for (const statement of statements) {
    assert.ok(typeof statement === 'object' && statement !== null);
    const sql: unknown = Reflect.get(statement, 'sql');
    assert.ok(typeof sql === 'string');
    const match = /^create index "([^"]+)" on /.exec(sql);
    if (match) indexNames.push(match[1]);
  }
  assert.deepStrictEqual(indexNames, [`${table}_${courseKey}_index`, `${table}_${studentKey}_index`]);
  const names = [courseTable, studentTable, table, ...indexNames];
  assert.strictEqual(new Set(names).size, 5, 'Pivot endpoint, table and index names must be distinct');
  for (const name of names) assert.ok(Buffer.byteLength(name, 'utf8') <= 63, 'Pivot fixture identifier exceeds PostgreSQL byte limit');
  console.log(JSON.stringify({ pgPivotIdentifiers: { format, enabled, names, utf8Bytes: names.map((name) => Buffer.byteLength(name, 'utf8')) } }));
  // Endpoint ensure visits its pivot, not the ordinary related endpoint table.
  for (const db of controls.slice(0, 2)) {
    assert.ok(typeof db === 'object' && db !== null);
    await new Promise<void>((resolve, reject) => {
      const returned = call(db, 'ensureSchema', (error: unknown) => (error ? reject(error) : resolve()));
      assert.strictEqual(returned, undefined);
    });
  }
  const nativePairs = async (): Promise<unknown[]> => {
    const query: unknown = Reflect.apply(database, undefined, [table]);
    assert.ok(typeof query === 'object' && query !== null);
    const selected: unknown = call(query, 'select', studentKey, courseKey);
    assert.ok(typeof selected === 'object' && selected !== null);
    const byStudent: unknown = call(selected, 'orderBy', studentKey);
    assert.ok(typeof byStudent === 'object' && byStudent !== null);
    const rows: unknown = await call(byStudent, 'orderBy', courseKey);
    assert.ok(Array.isArray(rows));
    return rows;
  };
  const json = async (type: object, query: object): Promise<unknown> => {
    const cursor = control(type, 'cursor', query);
    assert.ok(cursor instanceof ORM.Cursor);
    const typed: CursorInstance = cursor;
    let notifications = 0;
    const value = await new Promise<unknown>((resolve, reject) => {
      const returned = typed.toJSON((error, result) => {
        notifications++;
        if (error) reject(error);
        else resolve(result);
      });
      assert.strictEqual(returned, undefined);
    });
    assert.strictEqual(notifications, 1);
    return value;
  };
  const relatedIDs = (row: unknown, key: string): unknown[] => {
    assert.ok(typeof row === 'object' && row !== null);
    const related: unknown = Reflect.get(row, key);
    assert.ok(Array.isArray(related));
    return related
      .map((value: unknown) => {
        assert.ok(typeof value === 'object' && value !== null);
        const id: unknown = Reflect.get(value, 'id');
        assert.ok(typeof id === 'number');
        return id;
      })
      .sort();
  };
  const a = new Course({ name: 'pivot alpha', score: 1 });
  const b = new Course({ name: 'pivot beta', score: 2 });
  const c = new Course({ name: 'pivot gamma', score: 3 });
  for (const course of [a, b, c]) await saveRelations(course);
  const first = new Student({ name: 'first', courses: [a, b] });
  const other = new Student({ name: 'other', courses: [b, c] });
  const empty = new Student({ name: 'empty', courses: [] });
  for (const student of [first, other, empty]) await saveRelations(student);
  assert.ok([a, b, c, first, other, empty].every((model) => typeof model.id === 'number'));
  const id: unknown = first.id;
  assert.ok(typeof id === 'number');
  const otherPairs = [
    { [studentKey]: other.id, [courseKey]: b.id },
    { [studentKey]: other.id, [courseKey]: c.id },
  ];
  assert.deepStrictEqual(await nativePairs(), [{ [studentKey]: id, [courseKey]: a.id }, { [studentKey]: id, [courseKey]: b.id }, ...otherPairs]);
  assert.deepStrictEqual(relatedIDs(await json(Student, { id, $one: true, $include: ['courses'] }), 'courses'), [a.id, b.id].sort());
  assert.deepStrictEqual(relatedIDs(await json(Course, { id: b.id, $one: true, $include: ['students'] }), 'students'), [id, other.id].sort());
  assert.deepStrictEqual(relatedIDs(await json(Student, { id: empty.id, $one: true, $include: ['courses'] }), 'courses'), []);
  assert.strictEqual(await json(Student, { id: -1, $one: true, $include: ['courses'] }), null);
  assert.strictEqual(await json(Student, { 'courses.score': { $in: [1, 2] }, $count: true }), 2);
  const page: unknown = await json(Student, { 'courses.score': { $in: [1, 2] }, $page: true, $sort: ['name', 'id'], $offset: 1, $limit: 1, $include: ['courses'] });
  assert.ok(typeof page === 'object' && page !== null);
  assert.strictEqual(Reflect.get(page, 'total_rows'), 2);
  assert.strictEqual(Reflect.get(page, 'offset'), 1);
  const pageRows: unknown = Reflect.get(page, 'rows');
  assert.ok(Array.isArray(pageRows) && pageRows.length === 1);
  assert.strictEqual(Reflect.get(pageRows[0], 'name'), 'other');
  assert.deepStrictEqual(relatedIDs(pageRows[0], 'courses'), [b.id, c.id].sort(), 'Filtered page must include the complete related set');
  const found: unknown = await call(Student, 'find', { id, $include: ['courses'] });
  assert.ok(Array.isArray(found) && found.length === 1 && found[0] instanceof Student);
  assert.ok(enabled ? found[0] === first : found[0] !== first, 'Pivot materialization must follow the selected cache owner contract');
  const related: unknown = call(found[0], 'get', 'courses');
  assert.ok(related instanceof Backbone.Collection);
  assert.deepStrictEqual(related.pluck('id').sort(), [a.id, b.id].sort());
  const beforeOther = listeners(other);
  const view = kb.viewModel(first, { keys: ['name', 'courses'] });
  const disposeView = once(() => view.dispose());
  cleanups.push(disposeView);
  const viewMetadata: unknown = Reflect.get(view, '__kb');
  assert.ok(typeof viewMetadata === 'object' && viewMetadata !== null);
  const viewStore: unknown = Reflect.get(viewMetadata, 'store');
  assert.ok(viewStore instanceof kb.Store);
  const viewWatcher: unknown = Reflect.get(viewMetadata, 'eventWatcher');
  assert.ok(typeof viewWatcher === 'object' && viewWatcher !== null);
  const viewWatcherMetadata: unknown = Reflect.get(viewWatcher, '__kb');
  assert.ok(typeof viewWatcherMetadata === 'object' && viewWatcherMetadata !== null);
  const viewCallbacks: unknown = Reflect.get(viewWatcherMetadata, 'callbacks');
  assert.ok(typeof viewCallbacks === 'object' && viewCallbacks !== null);
  const viewChange: unknown = Reflect.get(viewCallbacks, 'change');
  assert.ok(typeof viewChange === 'object' && viewChange !== null);
  const viewCallback: unknown = Reflect.get(viewChange, 'fn');
  assert.ok(typeof viewCallback === 'function');
  const courses = view.courses;
  assert.ok(ko.isObservable(courses));
  const state = (target: object, expected: string[]): void => {
    const observable: unknown = Reflect.get(target, 'courses');
    assert.ok(ko.isObservable(observable));
    const values: unknown = observable();
    assert.ok(Array.isArray(values));
    assert.deepStrictEqual(values.map(childViewName).sort(), [...expected].sort());
    if (values.length) {
      const root: unknown = Reflect.get(target, '__kb');
      assert.ok(typeof root === 'object' && root !== null);
      const store: unknown = Reflect.get(root, 'store');
      assert.ok(store instanceof kb.Store);
      for (const nested of values) {
        assert.ok(nested instanceof kb.ViewModel && nested !== target);
        assert.ok(call(nested, 'model') instanceof Course);
        const metadata: unknown = Reflect.get(nested, '__kb');
        assert.ok(typeof metadata === 'object' && metadata !== null);
        assert.ok(Reflect.get(metadata, 'store') === store, 'Nested pivot ViewModels must share the root Store');
      }
    }
  };
  state(view, ['pivot alpha', 'pivot beta']);
  const changes: unknown[][] = [];
  const subscription = courses.subscribe((values: unknown) => {
    assert.ok(Array.isArray(values));
    changes.push(values.map(childViewName).sort());
  });
  const disposeSubscription = once(() => subscription.dispose());
  cleanups.push(disposeSubscription);
  first.set('courses', [b, c]);
  state(view, ['pivot beta', 'pivot gamma']);
  assert.ok(changes.length > 0, 'Pivot replacement must notify the observable');
  await saveRelations(first);
  assert.deepStrictEqual(await nativePairs(), [{ [studentKey]: id, [courseKey]: b.id }, { [studentKey]: id, [courseKey]: c.id }, ...otherPairs]);
  assert.deepStrictEqual(relatedIDs(await json(Student, { id, $one: true, $include: ['courses'] }), 'courses'), [b.id, c.id].sort());
  first.set('courses', []);
  state(view, []);
  await saveRelations(first);
  assert.deepStrictEqual(await nativePairs(), otherPairs);
  assert.deepStrictEqual(relatedIDs(await json(Student, { id, $one: true, $include: ['courses'] }), 'courses'), []);
  assert.ok(view.courses === courses, 'Pivot observable identity changed');
  disposeSubscription();
  disposeView();
  assert.strictEqual(bindingCount(first, 'change', viewCallback, undefined), 0);
  assert.strictEqual(kb.wasReleased(viewStore), true);
  const beforeReferenceFirst = listeners(first);
  const beforeCourses = [a, b, c].map(listeners);

  const collection = new Backbone.Collection<Student>();
  const beforeCollection = listeners(collection);
  const clearCollection = once(() => {
    collection.reset([]);
  });
  cleanups.push(clearCollection);
  const reference = new ModelRef<Student>(collection, id);
  const releaseReference = once(() => {
    reference.release();
  });
  cleanups.push(releaseReference);
  const refView = kb.viewModel(reference, { keys: ['name', 'courses'] });
  const disposeReferenceView = once(() => refView.dispose());
  cleanups.push(disposeReferenceView);
  const refName = refView.name;
  const refCourses = refView.courses;
  assert.ok(ko.isObservable(refName) && ko.isObservable(refCourses));
  const root: unknown = Reflect.get(refView, '__kb');
  assert.ok(typeof root === 'object' && root !== null);
  const store: unknown = Reflect.get(root, 'store');
  assert.ok(store instanceof kb.Store);
  const watcher: unknown = Reflect.get(root, 'eventWatcher');
  assert.ok(typeof watcher === 'object' && watcher !== null);
  const watcherMetadata: unknown = Reflect.get(watcher, '__kb');
  assert.ok(typeof watcherMetadata === 'object' && watcherMetadata !== null);
  const callbacks: unknown = Reflect.get(watcherMetadata, 'callbacks');
  assert.ok(typeof callbacks === 'object' && callbacks !== null);
  const change: unknown = Reflect.get(callbacks, 'change');
  assert.ok(typeof change === 'object' && change !== null);
  const rootCallback: unknown = Reflect.get(change, 'fn');
  const membershipCallback: unknown = Reflect.get(collection, '_onModelEvent');
  assert.ok(typeof rootCallback === 'function' && typeof membershipCallback === 'function');
  assert.ok(refView.model() === null, 'Unloaded pivot reference must have no model');
  assert.strictEqual(refName(), null);
  collection.add(first);
  assert.ok(refView.model() === first, 'Pivot reference must attach the exact first model');
  assert.strictEqual(refName(), 'first');
  state(refView, []);
  const replacement = new Student({ id, name: 'pivot reference replacement', courses: [] });
  const beforeReplacement = listeners(replacement);
  const clearReplacementCourses = once(() => {
    const failures: unknown[] = [];
    try {
      disposeReferenceView();
    } catch (error) {
      failures.push(error);
    }
    try {
      replacement.set('courses', []);
    } catch (error) {
      failures.push(error);
    }
    if (failures.length === 1) throw failures[0];
    if (failures.length > 1) throw new AggregateError(failures, 'Pivot reference disposal and reciprocal cleanup failed');
  });
  cleanups.push(clearReplacementCourses);
  replacement.set('courses', [c]);
  collection.reset([replacement]);
  assert.ok(refView.model() === replacement, 'Pivot reference must attach the exact replacement model');
  assert.strictEqual(refName(), 'pivot reference replacement');
  state(refView, ['pivot gamma']);
  assert.strictEqual(bindingCount(first, 'change', rootCallback, undefined), 0);
  assert.strictEqual(bindingCount(first, 'all', membershipCallback, collection), 0);
  collection.remove(replacement);
  assert.ok(refView.model() === null, 'Removed pivot reference must have no model');
  assert.strictEqual(refName(), null);
  state(refView, []);
  assert.strictEqual(bindingCount(replacement, 'change', rootCallback, undefined), 0);
  assert.strictEqual(bindingCount(replacement, 'all', membershipCallback, collection), 0);
  collection.add(first);
  assert.ok(refView.model() === first, 'Reloaded pivot reference must attach the exact first model');
  assert.ok(refView.name === refName, 'Pivot reference name observable identity changed');
  assert.ok(refView.courses === refCourses, 'Pivot reference relation observable identity changed');
  state(refView, []);
  disposeReferenceView();
  assert.strictEqual(reference.ref_count, 1);
  assert.strictEqual(listeners(reference), 0);
  assert.strictEqual(kb.wasReleased(store), true);
  const stores: unknown = Reflect.get(kb.Store, 'instances');
  assert.ok(Array.isArray(stores) && !stores.includes(store));
  releaseReference();
  assert.strictEqual(reference.ref_count, 0);
  clearCollection();
  clearReplacementCourses();
  assert.strictEqual(listeners(collection), beforeCollection);
  assert.strictEqual(listeners(first), beforeReferenceFirst);
  assert.strictEqual(bindingCount(replacement, 'change', rootCallback, undefined), 0);
  assert.strictEqual(bindingCount(replacement, 'all', membershipCallback, collection), 0);
  assert.strictEqual(listeners(replacement), beforeReplacement);
  assert.deepStrictEqual([a, b, c].map(listeners), beforeCourses);
  assert.strictEqual(listeners(other), beforeOther);
  first.set('courses', [a]);
  await saveRelations(first);
  assert.deepStrictEqual(await nativePairs(), [{ [studentKey]: id, [courseKey]: a.id }, ...otherPairs], 'Destroy must begin with a real persisted target link');
  // Successful deletion observes final relation cleanup, not just the primary request.
  let destroys = 0;
  await new Promise<void>((resolve, reject) =>
    first.destroy({
      success: () => {
        destroys++;
        resolve();
      },
      error: (_model, error: unknown) => {
        destroys++;
        reject(error);
      },
    })
  );
  assert.strictEqual(destroys, 1);
  assert.deepStrictEqual(await materialize(Student, id), []);
  assert.deepStrictEqual(await nativePairs(), otherPairs);
  assert.deepStrictEqual(relatedIDs(await json(Student, { id: other.id, $one: true, $include: ['courses'] }), 'courses'), [b.id, c.id].sort());
  for (const course of [a, b, c]) {
    assert.ok(typeof course.id === 'number');
    const survivors = await materialize(Course, course.id);
    assert.strictEqual(survivors.length, 1);
    assert.strictEqual(survivors[0].get('name'), course.get('name'));
  }
  [Student, Course, pivot].forEach((type, index) => assert.ok(control(type, 'db') === controls[index], 'Pivot database control owner changed'));
  return { nativeLinks: true, completeIncludes: true, parentCountAndPage: true, observableReplacement: true, modelRefCleanup: true, independentSurvivors: true };
}

async function runPostgresApplication(format: 'cjs' | 'esm', url: string, pivotOnly: boolean): Promise<object> {
  assert.strictEqual(process.version, 'v20.20.2');
  assert.strictEqual(process.versions.modules, '115');
  assert.ok(/^postgres:\/\/family_owner:[a-f0-9]+@127\.0\.0\.1:\d+\/postgres\/$/.test(url), 'Application requires the owned private PostgreSQL target');
  assert.strictEqual(SQL.Backbone, Backbone);
  assert.strictEqual(ORM.Backbone, Backbone);
  assert.strictEqual(SQL.modules['backbone-orm'], ORM);
  assert.strictEqual(Backbone.ModelRef, ModelRef);
  const ownFile = typeof __filename === 'undefined' ? fileURLToPath(import.meta.url) : __filename;
  const ownRequire = createRequire(ownFile);
  const appRoot = path.resolve(path.dirname(ownFile), '../..');
  const sqlRequire = createRequire(ownRequire.resolve('backbone-sql/package.json'));
  for (const name of ['backbone', 'backbone-orm', 'knex', 'pg']) assert.strictEqual(realpathSync(sqlRequire.resolve(name)), realpathSync(ownRequire.resolve(name)), `SQL resolved another ${name}`);
  for (const [name, version] of [
    ['knex', '3.3.0'],
    ['pg', '8.20.0'],
  ]) {
    const provider = realpathSync(path.join(appRoot, 'node_modules', name));
    assert.ok(realpathSync(ownRequire.resolve(name)).startsWith(`${provider}${path.sep}`));
    assert.strictEqual(JSON.parse(readFileSync(path.join(provider, 'package.json'), 'utf8')).version, version);
  }
  const initial = new Map<string, unknown>();
  ORM.ConnectionPool.forEach((connection, key) => {
    if (typeof key === 'string') initial.set(key, connection);
  });
  const acquired = new Map<string, unknown>();
  const failures: unknown[] = [];
  const cells: object[] = [];
  function capture(): void {
    ORM.ConnectionPool.forEach((connection, key) => {
      if (typeof key === 'string' && !initial.has(key) && !acquired.has(key)) acquired.set(key, connection);
    });
  }
  try {
    for (const enabled of [false, true]) {
      const cleanups: (() => void)[] = [];
      try {
        ORM.configure({ model_cache: { enabled, max: 100 } });
        kb.configure({ orm: 'backbone-orm' });
        class Item extends Backbone.Model<Attributes> {
          urlRoot = `${url}family_pg_${format}_${enabled ? 'on' : 'off'}`;
          schema(): object {
            return { name: 'String', score: 'Integer' };
          }
        }
        try {
          Item.prototype.sync = SQL.sync(Item);
        } finally {
          capture();
        }
        const db = control(Item, 'db');
        assert.ok(typeof db === 'object' && db !== null);
        const connection: unknown = Reflect.get(db, 'connection');
        assert.ok([...acquired.values()].includes(connection));
        await new Promise<void>((resolve, reject) => {
          const returned = call(db, 'ensureSchema', (error: unknown) => (error ? reject(error) : resolve()));
          assert.strictEqual(returned, undefined);
        });
        if (pivotOnly) {
          const pivots = await exercisePivots(format, enabled, url, connection, capture, cleanups);
          cells.push({ enabled, focusedPivotOnly: true, sharedConnection: true, pivots });
        } else {
          const saved = new Item({ name: 'first', score: 1 });
          const survivor = new Item({ name: 'survivor', score: 9 });
          await saved.save();
          await survivor.save();
          const id: unknown = saved.id;
          assert.ok(typeof id === 'number');
          const survivorID: unknown = survivor.id;
          assert.ok(typeof survivorID === 'number');
          assert.notStrictEqual(survivorID, id);
          const first = await materialize(Item, id);
          const repeated = await materialize(Item, id);
          const found: unknown = await call(Item, 'find', { id });
          assert.ok(Array.isArray(found));
          for (const models of [first, repeated, found]) {
            assert.strictEqual(models.length, 1);
            assert.ok(models[0] instanceof Item);
            assert.deepStrictEqual(models[0].toJSON(), { id, name: 'first', score: 1 });
            if (enabled) assert.strictEqual(models[0], saved);
            else assert.notStrictEqual(models[0], saved);
          }
          if (!enabled) assert.notStrictEqual(first[0], repeated[0]);
          const beforeSaved = listeners(saved);
          const beforeSurvivor = listeners(survivor);
          const view = kb.viewModel(saved, { keys: ['name', 'score'] });
          const disposeView = once(() => view.dispose());
          cleanups.push(disposeView);
          const name = view.name;
          assert.ok(ko.isObservable(name));
          const score = view.score;
          assert.ok(ko.isObservable(score));
          const changes: unknown[] = [];
          const subscription = name.subscribe((value: unknown) => changes.push(value));
          cleanups.push(() => subscription.dispose());
          await saved.save({ name: 'saved', score: 2 });
          assert.strictEqual(view.name, name);
          assert.deepStrictEqual(changes, ['saved']);
          const fetchOptions = { force: true, parse: true };
          await saved.fetch(fetchOptions);
          assert.strictEqual(name(), 'saved');
          assert.strictEqual(score(), 2);
          assert.deepStrictEqual(changes, ['saved']);
          const updated = await materialize(Item, id);
          assert.strictEqual(updated[0].get('name'), 'saved');
          assert.strictEqual(updated[0].get('score'), 2);
          view.model(survivor);
          assert.strictEqual(view.name, name);
          assert.deepStrictEqual(changes, ['saved', 'survivor']);
          assert.strictEqual(listeners(saved), beforeSaved);
          disposeView();
          assert.strictEqual(listeners(survivor), beforeSurvivor);

          const collection = new Backbone.Collection<Item>();
          const clearCollection = once(() => collection.reset([]));
          cleanups.push(clearCollection);
          const reference = new ModelRef<Item>(collection, id);
          const releaseReference = once(() => reference.release());
          cleanups.push(releaseReference);
          const refView = kb.viewModel(reference, { keys: ['name'] });
          const disposeReferenceView = once(() => refView.dispose());
          cleanups.push(disposeReferenceView);
          const refName = refView.name;
          assert.ok(ko.isObservable(refName));
          assert.strictEqual(refName(), null);
          collection.add(saved);
          assert.strictEqual(refView.model(), saved);
          assert.strictEqual(refName(), 'saved');
          const replacement = new Item({ id, name: 'replacement', score: 3 });
          collection.reset([replacement]);
          assert.strictEqual(refView.model(), replacement);
          assert.strictEqual(refView.name, refName);
          assert.strictEqual(refName(), 'replacement');
          collection.remove(replacement);
          assert.strictEqual(refView.model(), null);
          assert.strictEqual(refName(), null);
          collection.add(saved);
          assert.strictEqual(refView.model(), saved);
          disposeReferenceView();
          assert.strictEqual(reference.ref_count, 1);
          assert.strictEqual(listeners(reference), 0);
          releaseReference();
          assert.strictEqual(reference.ref_count, 0);
          assert.strictEqual(listeners(collection), 0);
          clearCollection();
          assert.strictEqual(listeners(saved), beforeSaved);
          await saved.destroy();
          assert.deepStrictEqual(await materialize(Item, id), []);
          const remaining = await materialize(Item, survivorID);
          assert.strictEqual(remaining.length, 1);
          assert.strictEqual(remaining[0].get('name'), 'survivor');
          if (enabled) assert.strictEqual(remaining[0], survivor);
          assert.ok(control(Item, 'db') === db, 'PostgreSQL database control identity changed');
          const relations = await exerciseRelations(format, enabled, url, connection, capture, cleanups);
          const hasOne = await exerciseHasOne(format, enabled, url, connection, capture, cleanups);
          const pivots = await exercisePivots(format, enabled, url, connection, capture, cleanups);
          cells.push({ enabled, id, sharedConnection: true, notifications: changes, modelRefCleanup: true, relations, hasOne, pivots });
        }
      } catch (error) {
        failures.push(error);
      } finally {
        for (const cleanup of cleanups.reverse()) {
          try {
            cleanup();
          } catch (error) {
            failures.push(error);
          }
        }
        try {
          ORM.configure({ model_cache: { enabled: false } });
        } catch (error) {
          failures.push(error);
        }
        try {
          kb.configure({ orm: undefined });
        } catch (error) {
          failures.push(error);
        }
      }
      if (failures.length) break;
    }
  } catch (error) {
    failures.push(error);
  } finally {
    capture();
    if (acquired.size !== 1 && !failures.length) failures.push(new Error('Flat PostgreSQL cells did not share one exact SQL connection'));
    for (const [key, connection] of acquired) {
      try {
        assert.ok(ORM.ConnectionPool.get(key) === connection, 'SQL pool owner changed; replacement not disposed');
        await ORM.ConnectionPool.dispose(key);
        assert.ok(ORM.ConnectionPool.get(key) === undefined, 'Exact SQL pool owner remained after close');
      } catch (error) {
        failures.push(error);
      }
    }
    try {
      ORM.configure({ model_cache: { enabled: false } });
    } catch (error) {
      failures.push(error);
    }
    try {
      kb.configure({ orm: undefined });
    } catch (error) {
      failures.push(error);
    }
  }
  if (failures.length) throw new AggregateError(failures, `PostgreSQL ${format} family operation and exact-owner cleanup failed`);
  return { format, cells, focusedPivotOnly: pivotOnly, sharedBackbone: true, sharedORM: true, cleanup: true, node: process.version, abi: process.versions.modules };
}

export async function runPostgresFamily(format: 'cjs' | 'esm', url: string): Promise<object> {
  return runPostgresApplication(format, url, false);
}

export async function runPostgresPivots(format: 'cjs' | 'esm', url: string): Promise<object> {
  return runPostgresApplication(format, url, true);
}
