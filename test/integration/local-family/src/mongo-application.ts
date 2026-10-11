import { readFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import kb from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ModelRef from 'backbone-modelref';
import Mongo, { type MongoConnectionControl, type MongoDocument } from 'backbone-mongo';
import ORM, { type CursorInstance } from 'backbone-orm';
import ko from 'knockout';
import { type Collection, ObjectId } from 'mongodb';

interface Attributes {
  id?: number | string;
  name?: string;
  _rev?: number;
}

function call(host: object, name: string, args: unknown[] = []): unknown {
  const method: unknown = Reflect.get(host, name);
  assert.ok(typeof method === 'function', `Missing public ${name}`);
  return Reflect.apply(method, host, args);
}

function connection(host: object): MongoConnectionControl {
  const db = call(host, 'db');
  assert.ok(typeof db === 'object' && db !== null);
  const control: unknown = Reflect.get(db, 'connection');
  assert.ok(isConnection(control));
  return control;
}

function isConnection(value: unknown): value is MongoConnectionControl {
  return typeof value === 'object' && value !== null && typeof Reflect.get(value, 'url') === 'string' && typeof Reflect.get(value, 'collection') === 'function' && typeof Reflect.get(value, 'destroy') === 'function';
}

function nativeCollection(control: MongoConnectionControl): Promise<Collection<MongoDocument>> {
  return new Promise((resolve, reject) => control.collection((error, value) => (error ? reject(error) : value ? resolve(value) : reject(new Error('Missing native collection')))));
}

function save(model: Backbone.Model, attributes: Backbone.ObjectHash | null = null): Promise<void> {
  return new Promise((resolve, reject) => {
    const returned: unknown = model.save(attributes, { success: () => resolve(), error: (_model, error: unknown) => reject(error) });
    assert.strictEqual(returned, undefined);
  });
}

function fetch(model: Backbone.Model, force = false): Promise<void> {
  let notifications = 0;
  return new Promise<void>((resolve, reject) => {
    const options = {
      force,
      success: () => {
        notifications++;
        resolve();
      },
      error: (_model: unknown, error: unknown) => {
        notifications++;
        reject(error);
      },
    };
    const returned: unknown = model.fetch(options);
    assert.strictEqual(returned, undefined);
  }).then(() => assert.strictEqual(notifications, 1));
}

async function find(type: object, id: number | string): Promise<Backbone.Model[]> {
  const request = call(type, 'find', [{ id }]);
  assert.ok(request instanceof Promise);
  const models: unknown = await request;
  assert.ok(Array.isArray(models));
  return models.map((model: unknown) => {
    assert.ok(model instanceof Backbone.Model);
    return model;
  });
}

async function materialize(type: object, query: number | string | Record<string, unknown>): Promise<Backbone.Model[]> {
  const cursor = call(type, 'cursor', [typeof query === 'object' ? query : { id: query }]);
  assert.ok(cursor instanceof ORM.Cursor);
  const publicCursor: CursorInstance = cursor;
  let notifications = 0;
  const models = await new Promise<Backbone.Model[]>((resolve, reject) => {
    const returned = publicCursor.toModels((error, value) => {
      notifications++;
      if (error) reject(error);
      else if (!Array.isArray(value)) reject(new Error('Expected full Mongo model array'));
      else resolve(value);
    });
    assert.strictEqual(returned, undefined);
  });
  assert.strictEqual(notifications, 1);
  return models;
}

function listenerCount(target: object): number {
  const events: unknown = Reflect.get(target, '_events');
  if (!events) return 0;
  assert.ok(typeof events === 'object');
  return Object.values(events).reduce<number>((total, listeners: unknown) => total + (Array.isArray(listeners) ? listeners.length : 1), 0);
}

function once(cleanup: () => void | Promise<void>): () => void | Promise<void> {
  let attempted = false;
  return () => {
    if (attempted) return;
    attempted = true;
    return cleanup();
  };
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

async function saveRelations(model: Backbone.Model): Promise<void> {
  let notifications = 0;
  await new Promise<void>((resolve, reject) => {
    const returned: unknown = model.save(null, {
      success: () => {
        notifications++;
        resolve();
      },
      error: (_model, error: unknown) => {
        notifications++;
        reject(error);
      },
    });
    assert.strictEqual(returned, undefined);
  });
  await new Promise<void>((resolve) => setImmediate(resolve));
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
  assert.ok(ko.isObservable(one) && ko.isObservable(many));
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

function primaryForeignKey(type: object): string {
  const relation: unknown = call(type, 'relation', ['primary']);
  assert.ok(typeof relation === 'object' && relation !== null);
  assert.strictEqual(Reflect.get(relation, 'key'), 'primary');
  assert.strictEqual(Reflect.get(relation, 'type'), 'belongsTo');
  assert.ok(Reflect.get(relation, 'model_type') === type, 'Primary relation must belong to the exact registered Parent');
  const field: unknown = Reflect.get(relation, 'foreign_key');
  assert.ok(typeof field === 'string' && field.length > 0);
  return field;
}

async function includedParent(type: object, id: string, primary: string | null, children: string[], enabled: boolean, owner: Backbone.Model, initial = false): Promise<void> {
  const field = primaryForeignKey(type);
  const native = await nativeCollection(connection(type));
  const stored = await native.findOne({ _id: new ObjectId(id) });
  assert.ok(stored && stored._id instanceof ObjectId);
  assert.strictEqual(stored._id.toHexString(), id);
  if (initial) {
    assert.strictEqual(primary, null);
    assert.deepStrictEqual(children, []);
    assert.strictEqual(Reflect.getOwnPropertyDescriptor(stored, field), undefined, 'Initial unpaired null must have no native FK field');
    assert.strictEqual(stored[field], undefined);
  } else {
    assert.ok(Reflect.getOwnPropertyDescriptor(stored, field), 'Linked and post-unlink rows must retain their native FK field');
    assert.strictEqual(stored[field], primary);
  }
  assert.strictEqual(stored.primary, undefined);
  assert.strictEqual(stored.children, undefined);
  const query = Object.freeze({ id, $include: Object.freeze(['primary', 'children']) });
  const cursor = call(type, 'cursor', [query]);
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
  const request = call(type, 'find', [query]);
  assert.ok(request instanceof Promise);
  const found: unknown = await request;
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
  const models = await materialize(type, query);
  assert.strictEqual(models.length, 1);
  if (enabled) assert.strictEqual(models[0], owner);
  else assert.notStrictEqual(models[0], owner);
  assert.deepStrictEqual(query, { id, $include: ['primary', 'children'] });
}

async function exerciseRelations(format: 'cjs' | 'esm', enabled: boolean, uri: string, flatControl: MongoConnectionControl, cleanups: (() => void | Promise<void>)[]): Promise<object> {
  const suffix = `${format}_${enabled ? 'on' : 'off'}`;
  const sharedClient: unknown = ORM.ConnectionPool.get(flatControl.url);
  assert.ok(typeof sharedClient === 'object' && sharedClient !== null, 'Flat Mongo must retain its acquired client');
  const acquired = new Set<MongoConnectionControl>();
  function capture(type: object): void {
    const control = connection(type);
    if (!acquired.has(control)) {
      acquired.add(control);
      cleanups.push(
        once(async () => {
          await control.destroy();
          assert.ok(ORM.ConnectionPool.get(flatControl.url) === sharedClient, 'Relation cleanup must preserve the exact flat Mongo lease');
        })
      );
    }
    assert.ok(control.url === flatControl.url, 'Relation models must share the exact flat Mongo pool identity');
    assert.ok(ORM.ConnectionPool.get(control.url) === sharedClient, 'Relation models must share the exact acquired Mongo client');
  }
  class Child extends Backbone.Model<Attributes> {
    urlRoot = `${uri}/family_relation_children_${suffix}`;
    schema(): object {
      return {
        name: () => {
          capture(Child);
          return 'String';
        },
      };
    }
  }
  class Parent extends Backbone.Model {
    urlRoot = `${uri}/family_relation_parents_${suffix}`;
    schema(): object {
      return {
        name: () => {
          capture(Parent);
          return 'String';
        },
        primary: () => ['belongsTo', Child],
        children: () => ['hasMany', Child],
      };
    }
  }
  Child.prototype.sync = Mongo.sync(Child);
  capture(Child);
  assert.strictEqual(Parent.prototype.sync, Backbone.Model.prototype.sync, 'Parent must receive only its first Mongo configuration');
  Parent.prototype.sync = Mongo.sync(Parent);
  capture(Parent);
  assert.strictEqual(acquired.size, 2);
  const relation: unknown = call(Parent, 'relation', ['children']);
  assert.ok(typeof relation === 'object' && relation !== null);
  const reverse: unknown = Reflect.get(relation, 'reverse_relation');
  assert.ok(typeof reverse === 'object' && reverse !== null);
  assert.strictEqual(Reflect.get(reverse, 'type'), 'belongsTo');
  const foreignKey: unknown = Reflect.get(reverse, 'foreign_key');
  assert.ok(typeof foreignKey === 'string' && foreignKey.length > 0);
  const nativeChildren = await nativeCollection(connection(Child));
  const first = new Child({ name: 'relation first' });
  const second = new Child({ name: 'relation second' });
  const survivor = new Child({ name: 'relation survivor' });
  for (const child of [first, second, survivor]) {
    await saveRelations(child);
    assert.ok(typeof child.id === 'string');
    assert.match(child.id, /^[0-9a-f]{24}$/);
  }
  assert.ok(typeof first.id === 'string' && typeof second.id === 'string' && typeof survivor.id === 'string');
  const beforeSurvivor = listenerCount(survivor);
  const parent = new Parent({ name: 'relation parent', primary: null, children: [] });
  const initialField = primaryForeignKey(Parent);
  assert.strictEqual(Reflect.getOwnPropertyDescriptor(parent.attributes, 'primary'), undefined, 'Initial unpaired null must not create an own primary attribute');
  const initialJSON: unknown = parent.toJSON();
  assert.ok(typeof initialJSON === 'object' && initialJSON !== null);
  assert.strictEqual(Reflect.getOwnPropertyDescriptor(initialJSON, initialField), undefined, 'Initial JSON must omit the unpaired null FK');
  assert.strictEqual(Reflect.get(initialJSON, initialField), undefined);
  await saveRelations(parent);
  assert.ok(typeof parent.id === 'string');
  const id: string = parent.id;
  assert.match(id, /^[0-9a-f]{24}$/);
  const beforeParent = listenerCount(parent);
  const view = kb.viewModel(parent, { keys: ['name', 'primary', 'children'] });
  const disposeView = once(() => view.dispose());
  cleanups.push(disposeView);
  const primary = view.primary;
  const children = view.children;
  assert.ok(ko.isObservable(primary) && ko.isObservable(children));
  assert.strictEqual(call(primary, 'valueType'), kb.TYPE_MODEL);
  assert.strictEqual(call(children, 'valueType'), kb.TYPE_COLLECTION);
  relationViewState(view, null, []);
  await includedParent(Parent, id, null, [], enabled, parent, true);
  const primaryChanges: unknown[] = [];
  const subscription = primary.subscribe((value: unknown) => primaryChanges.push(value === null ? null : childViewName(value)));
  const disposeSubscription = once(() => subscription.dispose());
  cleanups.push(disposeSubscription);
  parent.set({ primary: first, children: [first] });
  relationViewState(view, 'relation first', ['relation first']);
  await saveRelations(parent);
  await includedParent(Parent, id, first.id, [first.id], enabled, parent);
  const firstRow = await nativeChildren.findOne({ _id: new ObjectId(first.id) });
  assert.ok(firstRow && firstRow._id instanceof ObjectId);
  assert.strictEqual(firstRow[foreignKey], id);
  const fetched = new Parent({ id });
  await fetch(fetched, true);
  assert.strictEqual(fetched.get('name'), 'relation parent');
  let loads = 0;
  let returnedChildren: unknown;
  const fetchedChildren: unknown = await new Promise<unknown>((resolve, reject) => {
    returnedChildren = call(fetched, 'get', [
      'children',
      (error: unknown, models: unknown) => {
        loads++;
        if (error) reject(error);
        else resolve(models);
      },
    ]);
    assert.ok(returnedChildren instanceof Backbone.Collection);
  });
  assert.strictEqual(loads, 1);
  assert.ok(Array.isArray(fetchedChildren));
  assert.ok(returnedChildren instanceof Backbone.Collection);
  assert.strictEqual(fetchedChildren, returnedChildren.models);
  assert.deepStrictEqual(
    fetchedChildren.map((child: unknown) => {
      assert.ok(child instanceof Child);
      return child.id;
    }),
    [first.id]
  );
  let primaryLoads = 0;
  let returnedPrimary: unknown;
  const fetchedPrimary: unknown = await new Promise<unknown>((resolve, reject) => {
    returnedPrimary = call(fetched, 'get', [
      'primary',
      (error: unknown, model: unknown) => {
        primaryLoads++;
        if (error) reject(error);
        else resolve(model);
      },
    ]);
  });
  assert.strictEqual(primaryLoads, 1);
  assert.ok(fetchedPrimary instanceof Child);
  assert.strictEqual(fetchedPrimary, returnedPrimary);
  assert.strictEqual(fetchedPrimary.id, first.id);
  parent.set({ primary: second, children: [second] });
  relationViewState(view, 'relation second', ['relation second']);
  await saveRelations(parent);
  await includedParent(Parent, id, second.id, [second.id], enabled, parent);
  assert.strictEqual((await nativeChildren.findOne({ _id: new ObjectId(first.id) }))?.[foreignKey], null);
  assert.strictEqual((await nativeChildren.findOne({ _id: new ObjectId(second.id) }))?.[foreignKey], id);
  parent.set({ primary: null, children: [] });
  relationViewState(view, null, []);
  await saveRelations(parent);
  await includedParent(Parent, id, null, [], enabled, parent);
  assert.strictEqual((await nativeChildren.findOne({ _id: new ObjectId(second.id) }))?.[foreignKey], null);
  assert.strictEqual(view.primary, primary);
  assert.strictEqual(view.children, children);
  assert.deepStrictEqual(primaryChanges, ['relation first', 'relation second', null]);
  await disposeSubscription();
  await disposeView();
  assert.strictEqual(listenerCount(parent), beforeParent);

  const collection = new Backbone.Collection<Parent>();
  const collectionListeners = listenerCount(collection);
  const clearCollection = once(() => {
    collection.reset([]);
  });
  cleanups.push(clearCollection);
  const reference = new ModelRef<Parent>(collection, id);
  const releaseReference = once(() => {
    reference.release();
  });
  cleanups.push(releaseReference);
  const refView = kb.viewModel(reference, { keys: ['name', 'primary', 'children'] });
  const disposeReferenceView = once(() => refView.dispose());
  cleanups.push(disposeReferenceView);
  const refName = refView.name;
  const refPrimary = refView.primary;
  const refChildren = refView.children;
  assert.ok(ko.isObservable(refName) && ko.isObservable(refPrimary) && ko.isObservable(refChildren));
  assert.strictEqual(refView.model(), null);
  assert.strictEqual(refName(), null);
  assert.strictEqual(refPrimary(), null);
  assert.strictEqual(refChildren(), null);
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
  const beforeReplacement = listenerCount(replacement);
  collection.reset([replacement]);
  assert.strictEqual(refView.model(), replacement);
  assert.strictEqual(refName(), 'relation replacement');
  relationViewState(refView, 'relation second', ['relation second']);
  assert.strictEqual(bindingCount(parent, 'change', rootChangeCallback, undefined), 0);
  assert.strictEqual(bindingCount(parent, 'all', membershipCallback, collection), 0);
  assert.strictEqual(listenerCount(parent), beforeParent);
  assert.strictEqual(bindingCount(replacement, 'change', rootChangeCallback, undefined), 1);
  assert.strictEqual(bindingCount(replacement, 'all', membershipCallback, collection), 1);
  collection.remove(replacement);
  assert.strictEqual(refView.model(), null);
  assert.strictEqual(refName(), null);
  relationViewState(refView, null, []);
  // Direct bindings detach on unload; cached relation views stay owned until root Store disposal.
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
  await disposeReferenceView();
  assert.strictEqual(reference.ref_count, 1);
  assert.strictEqual(listenerCount(reference), 0);
  assert.strictEqual(kb.wasReleased(store), true);
  const stores: unknown = Reflect.get(kb.Store, 'instances');
  assert.ok(Array.isArray(stores));
  assert.ok(!stores.includes(store), 'Disposed root Store must release its global ownership');
  await releaseReference();
  assert.strictEqual(reference.ref_count, 0);
  assert.strictEqual(listenerCount(collection), collectionListeners);
  await clearCollection();
  assert.strictEqual(listenerCount(parent), beforeParent);
  assert.strictEqual(listenerCount(replacement), beforeReplacement);
  for (const child of [first, second, survivor]) {
    assert.ok(typeof child.id === 'string');
    const remaining = await materialize(Child, child.id);
    assert.strictEqual(remaining.length, 1);
    assert.strictEqual(remaining[0].get('name'), child.get('name'));
    if (enabled) assert.strictEqual(remaining[0], child);
  }
  assert.strictEqual(listenerCount(survivor), beforeSurvivor);
  return { nativeObjectIds: true, firstConfiguration: true, includesReplacementAndNullEmpty: true, relationObservables: true, modelRefCleanup: true, independentSurvivors: true };
}

async function exerciseHasOne(format: 'cjs' | 'esm', enabled: boolean, uri: string, flatControl: MongoConnectionControl, cleanups: (() => void | Promise<void>)[]): Promise<object> {
  const suffix = `${format}_${enabled ? 'on' : 'off'}`;
  const sharedClient: unknown = ORM.ConnectionPool.get(flatControl.url);
  assert.ok(typeof sharedClient === 'object' && sharedClient !== null);
  const acquired = new Set<MongoConnectionControl>();
  function capture(type: object): void {
    const retained = connection(type);
    if (!acquired.has(retained)) {
      acquired.add(retained);
      cleanups.push(
        once(async () => {
          await retained.destroy();
          assert.ok(ORM.ConnectionPool.get(flatControl.url) === sharedClient, 'HasOne cleanup must preserve the exact flat Mongo lease');
        })
      );
    }
    assert.ok(retained.url === flatControl.url, 'HasOne must use the exact flat Mongo pool identity');
    assert.ok(ORM.ConnectionPool.get(retained.url) === sharedClient, 'HasOne must retain the exact acquired Mongo client');
  }
  class Profile extends Backbone.Model<Attributes> {
    urlRoot = `${uri}/family_hasone_profiles_${suffix}`;
    schema(): object {
      return {
        name: () => {
          capture(Profile);
          return 'String';
        },
      };
    }
  }
  class Owner extends Backbone.Model {
    urlRoot = `${uri}/family_hasone_owners_${suffix}`;
    schema(): object {
      return {
        name: () => {
          capture(Owner);
          return 'String';
        },
        profile: () => ['hasOne', Profile],
      };
    }
  }
  Profile.prototype.sync = Mongo.sync(Profile);
  capture(Profile);
  assert.strictEqual(Owner.prototype.sync, Backbone.Model.prototype.sync, 'HasOne Owner must receive only its first Mongo configuration');
  Owner.prototype.sync = Mongo.sync(Owner);
  capture(Owner);
  assert.strictEqual(acquired.size, 2);
  const profileControl = connection(Profile);
  const ownerControl = connection(Owner);
  assert.ok(acquired.has(profileControl) && acquired.has(ownerControl));
  const relation: unknown = call(Owner, 'relation', ['profile']);
  assert.ok(typeof relation === 'object' && relation !== null);
  assert.strictEqual(Reflect.get(relation, 'type'), 'hasOne');
  assert.ok(Reflect.get(relation, 'model_type') === Owner);
  assert.ok(Reflect.get(relation, 'reverse_model_type') === Profile);
  const reverse: unknown = Reflect.get(relation, 'reverse_relation');
  assert.ok(typeof reverse === 'object' && reverse !== null);
  assert.strictEqual(Reflect.get(reverse, 'type'), 'belongsTo');
  assert.ok(Reflect.get(reverse, 'model_type') === Profile);
  assert.ok(Reflect.get(reverse, 'reverse_model_type') === Owner);
  assert.strictEqual(Reflect.get(reverse, 'reverse_relation'), relation);
  const reverseKey: unknown = Reflect.get(reverse, 'key');
  const foreignKey: unknown = Reflect.get(reverse, 'foreign_key');
  assert.ok(typeof reverseKey === 'string' && reverseKey.length > 0);
  assert.ok(typeof foreignKey === 'string' && foreignKey.length > 0);
  const nativeProfiles = await nativeCollection(profileControl);
  const nativeOwners = await nativeCollection(ownerControl);
  const first = new Profile({ name: 'hasOne first' });
  const second = new Profile({ name: 'hasOne second' });
  const survivor = new Profile({ name: 'hasOne survivor' });
  for (const current of [first, second, survivor]) {
    await saveRelations(current);
    assert.ok(typeof current.id === 'string');
    assert.match(current.id, /^[0-9a-f]{24}$/);
    assert.strictEqual(current.get('_rev'), 1);
    const stored = await nativeProfiles.findOne({ _id: new ObjectId(current.id) });
    assert.ok(stored && stored._id instanceof ObjectId);
    assert.strictEqual(stored._id.toHexString(), current.id);
    assert.strictEqual(stored._rev, 1);
  }
  assert.ok(typeof first.id === 'string' && typeof second.id === 'string' && typeof survivor.id === 'string');
  const owner = new Owner({ name: 'hasOne owner', profile: null });
  const other = new Owner({ name: 'hasOne independent', profile: survivor });
  await saveRelations(owner);
  await saveRelations(other);
  assert.ok(typeof owner.id === 'string' && typeof other.id === 'string');
  assert.match(owner.id, /^[0-9a-f]{24}$/);
  assert.match(other.id, /^[0-9a-f]{24}$/);
  const id: string = owner.id;
  const survivorBefore = await nativeProfiles.findOne({ _id: new ObjectId(survivor.id) });
  const otherBefore = await nativeOwners.findOne({ _id: new ObjectId(other.id) });
  assert.ok(survivorBefore && otherBefore);
  assert.ok(otherBefore._id instanceof ObjectId && survivorBefore._id instanceof ObjectId);
  assert.strictEqual(otherBefore._id.toHexString(), other.id);
  assert.strictEqual(survivorBefore._id.toHexString(), survivor.id);
  assert.strictEqual(survivorBefore[foreignKey], other.id);

  const profileCache: unknown = Reflect.get(Profile, 'cache');
  if (enabled) assert.ok(typeof profileCache === 'object' && profileCache !== null);
  assert.strictEqual(survivorBefore._rev, 2);
  assert.strictEqual(otherBefore._rev, 1);

  async function included(expected: Profile | null): Promise<void> {
    const query = Object.freeze({ id, $one: true, $include: Object.freeze(['profile']) });
    const cursor = call(Owner, 'cursor', [query]);
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
    assert.ok(typeof rows === 'object' && rows !== null && !Array.isArray(rows));
    const selected: unknown = Reflect.get(rows, 'profile');
    if (expected === null) assert.strictEqual(selected, null);
    else {
      assert.ok(typeof selected === 'object' && selected !== null && !Array.isArray(selected));
      assert.strictEqual(Reflect.get(selected, 'id'), expected.id);
      assert.strictEqual(Reflect.get(selected, 'name'), expected.get('name'));
      assert.strictEqual(Reflect.get(selected, '_rev'), expected.get('_rev'));
    }
    const modelQuery = Object.freeze({ id, $include: Object.freeze(['profile']) });
    const request = call(Owner, 'find', [modelQuery]);
    assert.ok(request instanceof Promise);
    const found: unknown = await request;
    const models = await materialize(Owner, modelQuery);
    assert.ok(Array.isArray(found) && found.length === 1 && found[0] instanceof Owner);
    assert.strictEqual(models.length, 1);
    assert.ok(models[0] instanceof Owner);
    for (const model of [found[0], models[0]]) {
      if (enabled) assert.strictEqual(model, owner);
      else assert.notStrictEqual(model, owner);
    }
    for (const model of [found[0], models[0]]) {
      const selectedModel: unknown = model.get('profile');
      if (expected === null) assert.strictEqual(selectedModel, null);
      else {
        assert.ok(selectedModel instanceof Profile);
        assert.strictEqual(selectedModel.id, expected.id);
        assert.strictEqual(selectedModel.get('_rev'), expected.get('_rev'));
        if (enabled) assert.strictEqual(selectedModel, expected);
      }
    }
    assert.deepStrictEqual(query, { id, $one: true, $include: ['profile'] });
    assert.deepStrictEqual(modelQuery, { id, $include: ['profile'] });
  }
  await included(null);
  const beforeOwner = listenerCount(owner);
  const beforeFirst = listenerCount(first);
  const beforeSecond = listenerCount(second);
  const beforeSurvivor = listenerCount(survivor);
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
  const linkedFirst = await nativeProfiles.findOne({ _id: new ObjectId(first.id) });
  assert.ok(linkedFirst && Reflect.getOwnPropertyDescriptor(linkedFirst, foreignKey));
  assert.strictEqual(linkedFirst[foreignKey], id);
  assert.strictEqual(linkedFirst._rev, 2);
  assert.strictEqual(first.get('_rev'), linkedFirst._rev);
  await included(first);
  owner.set('profile', second);
  state(view, 'hasOne second');
  await saveRelations(owner);
  const detachedFirst = await nativeProfiles.findOne({ _id: new ObjectId(first.id) });
  const linkedSecond = await nativeProfiles.findOne({ _id: new ObjectId(second.id) });
  assert.ok(detachedFirst && linkedSecond);
  assert.ok(Reflect.getOwnPropertyDescriptor(detachedFirst, foreignKey));
  assert.strictEqual(detachedFirst[foreignKey], null);
  assert.strictEqual(detachedFirst._rev, 3);
  assert.strictEqual(linkedSecond[foreignKey], id);
  assert.strictEqual(linkedSecond._rev, 2);
  assert.strictEqual(second.get('_rev'), linkedSecond._rev);
  assert.strictEqual((await nativeOwners.findOne({ _id: new ObjectId(id) }))?._rev, 3);
  if (enabled) {
    assert.ok(typeof profileCache === 'object' && profileCache !== null);
    assert.strictEqual(call(profileCache, 'get', [first.id]), first);
    assert.strictEqual(first.get('_rev'), detachedFirst._rev, 'Cached detached Profile must match native before any include');
    assert.strictEqual(call(first, 'get', [reverseKey]), null);
    await save(first, { name: 'resaved detached first' });
    const followed = await nativeProfiles.findOne({ _id: new ObjectId(first.id) });
    assert.ok(followed);
    assert.strictEqual(followed[foreignKey], null);
    assert.strictEqual(followed._rev, 4);
    assert.strictEqual(followed.name, 'resaved detached first');
    assert.strictEqual(first.get('_rev'), 4);
    assert.strictEqual(call(profileCache, 'get', [first.id]), first);
    assert.strictEqual((await nativeOwners.findOne({ _id: new ObjectId(id) }))?._rev, 3);
  }
  await included(second);
  owner.set('profile', null);
  state(view, null);
  await saveRelations(owner);
  const detachedSecond = await nativeProfiles.findOne({ _id: new ObjectId(second.id) });
  assert.ok(detachedSecond && Reflect.getOwnPropertyDescriptor(detachedSecond, foreignKey));
  assert.strictEqual(detachedSecond[foreignKey], null, 'Final hasOne save must clear the native reverse FK before include');
  assert.strictEqual(detachedSecond._rev, 3);
  assert.strictEqual((await nativeOwners.findOne({ _id: new ObjectId(id) }))?._rev, 4);
  if (enabled) {
    assert.ok(typeof profileCache === 'object' && profileCache !== null);
    assert.strictEqual(call(profileCache, 'get', [second.id]), second);
    assert.strictEqual(second.get('_rev'), detachedSecond._rev, 'Cached unlinked Profile must match native before any include');
    assert.strictEqual(call(second, 'get', [reverseKey]), null);
    await save(second, { name: 'resaved unlinked second' });
    const followed = await nativeProfiles.findOne({ _id: new ObjectId(second.id) });
    assert.ok(followed);
    assert.strictEqual(followed[foreignKey], null);
    assert.strictEqual(followed._rev, 4);
    assert.strictEqual(followed.name, 'resaved unlinked second');
    assert.strictEqual(second.get('_rev'), 4);
    assert.strictEqual(call(profileCache, 'get', [second.id]), second);
    assert.strictEqual((await nativeOwners.findOne({ _id: new ObjectId(id) }))?._rev, 4);
  }
  await included(null);
  const fetched = new Owner({ id });
  await fetch(fetched, true);
  let loads = 0;
  let returnedProfile: unknown;
  const fetchedProfile: unknown = await new Promise<unknown>((resolve, reject) => {
    returnedProfile = call(fetched, 'get', [
      'profile',
      (error: unknown, value: unknown) => {
        loads++;
        if (error) reject(error);
        else resolve(value);
      },
    ]);
  });
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.strictEqual(loads, 1);
  assert.strictEqual(returnedProfile, null);
  assert.strictEqual(fetchedProfile, null);
  assert.strictEqual(view.profile, profile);
  assert.deepStrictEqual(changes, ['hasOne first', 'hasOne second', null]);
  await disposeSubscription();
  await disposeView();
  assert.strictEqual(listenerCount(owner), beforeOwner);

  const collection = new Backbone.Collection<Owner>();
  const collectionListeners = listenerCount(collection);
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
  const beforeReplacement = listenerCount(replacement);
  collection.reset([replacement]);
  assert.strictEqual(refView.model(), replacement);
  assert.strictEqual(refName(), 'hasOne reference replacement');
  state(refView, enabled ? 'resaved unlinked second' : 'hasOne second');
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
  await disposeReferenceView();
  assert.strictEqual(reference.ref_count, 1);
  assert.strictEqual(listenerCount(reference), 0);
  assert.strictEqual(kb.wasReleased(store), true);
  const stores: unknown = Reflect.get(kb.Store, 'instances');
  assert.ok(Array.isArray(stores));
  assert.ok(!stores.includes(store), 'Disposed hasOne Store must release its global ownership');
  await releaseReference();
  assert.strictEqual(reference.ref_count, 0);
  assert.strictEqual(listenerCount(collection), collectionListeners);
  await clearCollection();
  assert.strictEqual(listenerCount(owner), beforeOwner);
  assert.strictEqual(listenerCount(replacement), beforeReplacement);
  assert.strictEqual(listenerCount(first), beforeFirst);
  assert.strictEqual(listenerCount(second), beforeSecond);
  assert.strictEqual(listenerCount(survivor), beforeSurvivor);
  for (const current of [first, second, survivor]) {
    assert.ok(typeof current.id === 'string');
    const models = await materialize(Profile, current.id);
    assert.strictEqual(models.length, 1);
    assert.strictEqual(models[0].get('name'), current.get('name'));
    if (enabled) assert.strictEqual(models[0], current);
  }
  assert.deepStrictEqual(await nativeProfiles.findOne({ _id: new ObjectId(survivor.id) }), survivorBefore);
  assert.deepStrictEqual(await nativeOwners.findOne({ _id: new ObjectId(other.id) }), otherBefore);
  assert.strictEqual(await nativeProfiles.countDocuments(), 3);
  assert.strictEqual(await nativeOwners.countDocuments(), 2);
  assert.strictEqual(await nativeProfiles.countDocuments({ [foreignKey]: id }), 0);
  assert.ok(connection(Profile) === profileControl && connection(Owner) === ownerControl, 'HasOne Mongo control identity changed');
  return { nativeObjectIds: true, generatedInverse: true, nativeNullSave: true, cachedRevisions: enabled, sameInstanceFollowUp: enabled, materialization: true, observableChanges: true, modelRefCleanup: true, independentSurvivors: true };
}

export async function runMongoFamily(format: 'cjs' | 'esm', uri: string): Promise<object> {
  assert.ok(uri.startsWith('mongodb://127.0.0.1:'), 'Application requires its owned loopback Mongo URI');
  assert.strictEqual(Mongo.Backbone, Backbone);
  assert.strictEqual(Mongo.modules['backbone-orm'], ORM);
  assert.strictEqual(ORM.Backbone, Backbone);
  const ownFile = typeof __filename === 'undefined' ? fileURLToPath(import.meta.url) : __filename;
  const ownRequire = createRequire(ownFile);
  const mongoRoot = path.dirname(ownRequire.resolve('backbone-mongo/package.json'));
  const mongoRequire = createRequire(path.join(mongoRoot, 'package.json'));
  const appRoot = path.resolve(path.dirname(ownFile), '../..');
  for (const name of ['backbone', 'backbone-orm', 'mongodb', 'mongodb-connection-string-url']) assert.strictEqual(realpathSync(mongoRequire.resolve(name)), realpathSync(ownRequire.resolve(name)));
  assert.strictEqual(realpathSync(mongoRequire.resolve('queue-cb')), realpathSync(ownRequire.resolve('mongo-queue-cb')));
  const providers = Object.fromEntries(
    [
      ['mongodb', '7.7.0'],
      ['mongodb-connection-string-url', '7.0.2'],
      ['mongo-queue-cb', '1.6.3'],
      ['queue-cb', '1.6.8'],
    ].map(([name, version]) => {
      const root = realpathSync(path.join(appRoot, 'node_modules', name));
      assert.ok(realpathSync(ownRequire.resolve(name)).startsWith(`${root}${path.sep}`));
      assert.strictEqual(JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')).version, version);
      return [name, { root, version }];
    })
  );
  const cells: object[] = [];
  const applicationFailures: unknown[] = [];
  try {
    for (const enabled of [false, true])
      for (const manual of [false, true]) {
        let control: MongoConnectionControl | undefined;
        const cleanups: (() => void | Promise<void>)[] = [];
        const failures: unknown[] = [];
        try {
          ORM.configure({ model_cache: { enabled, max: 100 } });
          kb.configure({ orm: 'backbone-orm' });
          class Item extends Backbone.Model<Attributes> {
            urlRoot = `${uri}/family_${format}_${enabled ? 'on' : 'off'}_${manual ? 'zero' : 'native'}`;
            schema(): object {
              return manual ? { id: ['Integer', { manual: true }] } : {};
            }
          }
          Item.prototype.sync = Mongo.sync(Item);
          const acquiredControl = connection(Item);
          control = acquiredControl;
          const saved = new Item({ name: 'first', ...(manual ? { id: 0 } : {}) });
          const survivor = new Item({ name: 'survivor', ...(manual ? { id: 1 } : {}) });
          await save(saved);
          await save(survivor);
          const id: unknown = saved.id;
          assert.ok(typeof id === 'string' || typeof id === 'number');
          if (manual) assert.strictEqual(id, 0);
          else assert.match(String(id), /^[0-9a-f]{24}$/);
          const native = await nativeCollection(acquiredControl);
          const selector = manual ? { id: 0 } : { _id: new ObjectId(String(id)) };
          assert.strictEqual((await native.findOne(selector))?.name, 'first');
          const first = await materialize(Item, id);
          const repeated = await materialize(Item, id);
          const found = await find(Item, id);
          const foundAgain = await find(Item, id);
          for (const models of [first, repeated, found, foundAgain]) {
            assert.strictEqual(models.length, 1);
            assert.ok(models[0] instanceof Item);
            assert.deepStrictEqual(models[0].toJSON(), { id, name: 'first', _rev: 1 });
          }
          if (enabled) {
            for (const models of [first, repeated, found, foundAgain]) assert.strictEqual(models[0], saved);
          } else {
            assert.notStrictEqual(first[0], saved);
            assert.notStrictEqual(repeated[0], first[0]);
            assert.notStrictEqual(found[0], first[0]);
            assert.notStrictEqual(foundAgain[0], found[0]);
          }
          const beforeListeners = listenerCount(saved);
          const view = kb.viewModel(saved, { keys: ['name'] });
          cleanups.push(() => view.dispose());
          const name = view.name;
          assert.ok(ko.isObservable(name));
          const changes: unknown[] = [];
          const subscription = name.subscribe((value: unknown) => changes.push(value));
          cleanups.push(() => subscription.dispose());
          assert.strictEqual(name(), 'first');
          await save(saved, { name: 'saved' });
          assert.strictEqual(view.name, name);
          assert.strictEqual(name(), 'saved');
          assert.deepStrictEqual(changes, ['saved']);
          assert.strictEqual(saved.get('_rev'), 2);
          const updated = await native.updateOne(selector, { $set: { name: 'fetched', _rev: 3 } });
          assert.strictEqual(updated.matchedCount, 1);
          await fetch(saved, true);
          assert.strictEqual(view.name, name);
          assert.strictEqual(name(), 'fetched');
          assert.deepStrictEqual(changes, ['saved', 'fetched']);
          assert.strictEqual(saved.get('_rev'), 3);
          const fresh = await materialize(Item, id);
          assert.deepStrictEqual(fresh[0].toJSON(), { id, name: 'fetched', _rev: 3 });
          if (enabled) assert.strictEqual(fresh[0], saved);
          else assert.notStrictEqual(fresh[0], saved);

          const compound = Object.freeze({
            $and: Object.freeze([Object.freeze({ id: Object.freeze({ $in: Object.freeze([id]) }) }), Object.freeze({ name: Object.freeze({ $eq: 'fetched' }) })]),
            $sort: 'name',
          });
          const selected = await materialize(Item, compound);
          const selectedAgain = await materialize(Item, compound);
          for (const models of [selected, selectedAgain]) {
            assert.strictEqual(models.length, 1);
            assert.ok(models[0] instanceof Item);
            assert.deepStrictEqual(models[0].toJSON(), { id, name: 'fetched', _rev: 3 });
          }
          if (enabled) {
            assert.strictEqual(selected[0], saved);
            assert.strictEqual(selectedAgain[0], saved);
          } else {
            assert.notStrictEqual(selected[0], saved);
            assert.notStrictEqual(selectedAgain[0], selected[0]);
          }
          assert.deepStrictEqual(compound, { $and: [{ id: { $in: [id] } }, { name: { $eq: 'fetched' } }], $sort: 'name' });
          const selectedListeners = listenerCount(selected[0]);
          const survivorListeners = listenerCount(survivor);
          const selectedView = kb.viewModel(selected[0], { keys: ['name'] });
          cleanups.push(() => selectedView.dispose());
          const selectedName = selectedView.name;
          assert.ok(ko.isObservable(selectedName));
          assert.strictEqual(selectedName(), 'fetched');
          const selectedChanges: unknown[] = [];
          const selectedSubscription = selectedName.subscribe((value: unknown) => selectedChanges.push(value));
          cleanups.push(() => selectedSubscription.dispose());
          selectedView.model(survivor);
          assert.strictEqual(selectedView.model(), survivor);
          assert.strictEqual(selectedView.name, selectedName);
          assert.strictEqual(selectedName(), 'survivor');
          assert.deepStrictEqual(selectedChanges, ['survivor']);
          assert.strictEqual(listenerCount(selected[0]), selectedListeners);
          selectedSubscription.dispose();
          cleanups.pop();
          selectedView.dispose();
          cleanups.pop();
          assert.strictEqual(listenerCount(survivor), survivorListeners);

          const references = new Backbone.Collection<Item>();
          const collectionListeners = listenerCount(references);
          const reference = new ModelRef<Item>(references, id);
          cleanups.push(() => {
            reference.release();
          });
          const events: { event: string; model: unknown }[] = [];
          const loaded = (model: unknown) => events.push({ event: 'loaded', model });
          const unloaded = (model: unknown) => events.push({ event: 'unloaded', model });
          reference.on('loaded', loaded);
          reference.on('unloaded', unloaded);
          cleanups.push(() => {
            reference.off('loaded', loaded);
            reference.off('unloaded', unloaded);
          });
          const referenceListeners = listenerCount(reference);
          const referenceView = kb.viewModel(reference, { keys: ['name'] });
          cleanups.push(() => referenceView.dispose());
          const referencedName = referenceView.name;
          assert.ok(ko.isObservable(referencedName));
          assert.strictEqual(referenceView.model(), null);
          assert.strictEqual(referencedName(), null);
          references.add(saved);
          assert.strictEqual(referenceView.model(), saved);
          assert.strictEqual(referencedName(), 'fetched');
          const replacement = new Item({ id, name: 'replacement', _rev: 3 });
          assert.notStrictEqual(replacement, saved);
          references.reset([replacement]);
          assert.strictEqual(referenceView.model(), replacement);
          assert.strictEqual(referenceView.name, referencedName);
          assert.strictEqual(referencedName(), 'replacement');
          references.remove(replacement);
          assert.strictEqual(referenceView.model(), null);
          assert.strictEqual(referencedName(), null);
          references.add(replacement);
          assert.strictEqual(referenceView.model(), replacement);
          assert.strictEqual(referencedName(), 'replacement');
          assert.deepStrictEqual(
            events.map(({ event }) => event),
            ['loaded', 'unloaded', 'loaded', 'unloaded', 'loaded']
          );
          [saved, saved, replacement, replacement, replacement].forEach((expected, index) => assert.strictEqual(events[index].model, expected));
          referenceView.dispose();
          cleanups.pop();
          assert.strictEqual(listenerCount(reference), referenceListeners);
          assert.strictEqual(reference.ref_count, 1);
          reference.off('loaded', loaded);
          reference.off('unloaded', unloaded);
          cleanups.pop();
          reference.release();
          cleanups.pop();
          assert.strictEqual(reference.ref_count, 0);
          assert.strictEqual(listenerCount(reference), 0);
          assert.strictEqual(listenerCount(references), collectionListeners);
          subscription.dispose();
          view.dispose();
          cleanups.length = 0;
          assert.strictEqual(listenerCount(saved), beforeListeners);
          const before = await find(Item, survivor.id);
          let notifications = 0;
          await new Promise<void>((resolve, reject) => {
            const returned: unknown = saved.destroy({
              success: () => {
                notifications++;
                resolve();
              },
              error: (_model, error: unknown) => {
                notifications++;
                reject(error);
              },
            });
            assert.strictEqual(returned, undefined);
          });
          assert.strictEqual(notifications, 1);
          await assert.rejects(fetch(new Item({ id })), /Model not found/);
          assert.deepStrictEqual(await find(Item, id), []);
          assert.deepStrictEqual(await materialize(Item, id), []);
          const after = await find(Item, survivor.id);
          assert.strictEqual(after.length, 1);
          assert.deepStrictEqual(after[0].toJSON(), { id: survivor.id, name: 'survivor', _rev: 1 });
          if (enabled) {
            assert.strictEqual(before[0], survivor);
            assert.strictEqual(after[0], survivor);
          } else assert.notStrictEqual(after[0], before[0]);
          assert.strictEqual(await native.countDocuments(), 1);
          const relations = manual ? undefined : await exerciseRelations(format, enabled, uri, acquiredControl, cleanups);
          const hasOne = manual ? undefined : await exerciseHasOne(format, enabled, uri, acquiredControl, cleanups);
          cells.push({ cache: enabled, manualZero: manual, compoundQueryChanges: selectedChanges, observableChanges: changes, modelRefEvents: events.map(({ event }) => event), deletion: true, ...(relations ? { relations } : {}), ...(hasOne ? { hasOne } : {}) });
        } catch (error) {
          failures.push(error);
        } finally {
          for (const cleanup of cleanups.reverse()) {
            try {
              await cleanup();
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
            if (control) {
              await control.destroy();
              assert.strictEqual(ORM.ConnectionPool.get(control.url), undefined);
            }
          } catch (error) {
            failures.push(error);
          }
          try {
            kb.configure({ orm: undefined });
          } catch (error) {
            failures.push(error);
          }
        }
        if (failures.length) throw new AggregateError(failures, `Flat Mongo ${format} cache=${enabled} manual=${manual} application failed`);
      }
  } catch (error) {
    applicationFailures.push(error);
  } finally {
    try {
      await ORM.ConnectionPool.disposeAll();
    } catch (error) {
      applicationFailures.push(error);
    }
    try {
      ORM.configure({ model_cache: { enabled: false } });
    } catch (error) {
      applicationFailures.push(error);
    }
    try {
      kb.configure({ orm: undefined });
    } catch (error) {
      applicationFailures.push(error);
    }
  }
  if (applicationFailures.length === 1) throw applicationFailures[0];
  if (applicationFailures.length) throw new AggregateError(applicationFailures, `Flat Mongo ${format} application and cleanup failed`);
  return { format, node: process.version, sharedBackbone: true, sharedORM: true, providers, cells, cleanup: true };
}
