import kb, { type ORM, TYPE_COLLECTION, TYPE_MODEL } from '@mcpeasy/knockback';
import Backbone from 'backbone';
import ModelRef from 'backbone-modelref';
import Mongo, { type MongoConnectionControl, type MongoSyncOptions } from 'backbone-mongo';
import type { ConfiguredModelConstructor, ResultCallback } from 'backbone-orm';
import BackboneORM from 'backbone-orm';
import BrowserORM, { type BrowserRuntimeGlobal, installBrowserRuntime } from 'backbone-orm/browser';
import SQL, { type PostgreSQLDatabaseControl, type SQLiteDatabaseControl, type SQLSyncOptions } from 'backbone-sql';

interface ChildAttributes extends Backbone.ObjectHash {
  id: number;
  name: string;
}

interface ParentAttributes extends Backbone.ObjectHash {
  children: Child[];
  id: number;
  name: string;
  primary: Child | null;
}

class Child extends Backbone.Model<ChildAttributes> {
  static model_name = 'LocalFamilyTypeChild';

  schema(): object {
    return { id: ['Integer', { manual: true }], name: 'String' };
  }
}

class Parent extends Backbone.Model<ParentAttributes> {
  static model_name = 'LocalFamilyTypeParent';

  fetchRelated(): void {}

  relation(key: string): { type: 'belongsTo' | 'hasMany' } | undefined {
    if (key === 'children') return { type: 'hasMany' };
    if (key === 'primary') return { type: 'belongsTo' };
    return undefined;
  }

  schema(): { relations: Record<string, { type: 'belongsTo' | 'hasMany' }> } {
    return {
      relations: {
        children: { type: 'hasMany' },
        primary: { type: 'belongsTo' },
      },
    };
  }
}

const adapter: ORM<Parent> = {
  isAvailable: () => true,
  isModel: (model): model is Parent => model instanceof Parent,
  keys: (model) => Object.keys(model.schema().relations),
  relationType: (model, key) => {
    const relation = model.relation(key);
    if (!relation) return null;
    return relation.type === 'hasMany' ? TYPE_COLLECTION : TYPE_MODEL;
  },
  useFunction: () => false,
};

kb.configure({ orm: adapter });
const ConfiguredChild: ConfiguredModelConstructor<typeof Child> = BackboneORM.configureModel(Child);
const ConfiguredParent: ConfiguredModelConstructor<typeof Parent> = BackboneORM.configureModel(Parent);
const child = new ConfiguredChild({ id: 1, name: 'typed child' });
const parent = new ConfiguredParent({ children: [child], id: 2, name: 'typed parent', primary: child });
const view = kb.viewModel(parent);
const primary: unknown = view.primary;
const reference = new ModelRef<Child>(new Backbone.Collection<Child>([child]), child.id);
const referenced = kb.viewModel(reference, { keys: ['name'] });
const promiseResult: Promise<Parent[]> = ConfiguredParent.find({ id: 2 });
const callback: ResultCallback<Parent[]> = (error, parents) => {
  if (error) throw error;
  parents?.forEach((candidate) => candidate.get('name'));
};
ConfiguredParent.find({ id: 2 }, callback);
const browserGlobal: BrowserRuntimeGlobal = { Backbone, BackboneORM: BrowserORM };
const installedBrowserRuntime: typeof BrowserORM = installBrowserRuntime(browserGlobal);

void [browserGlobal, installedBrowserRuntime, promiseResult, primary, referenced];

class SQLiteChild extends Backbone.Model<{ name: string }> {
  urlRoot = 'sqlite3:///typed_children';
}

const sqlOptions: SQLSyncOptions = { filename: 'private-fixture.sqlite3' };
SQLiteChild.prototype.sync = SQL.sync(SQLiteChild, sqlOptions);
const ConfiguredSQLiteChild = BackboneORM.configureModel(SQLiteChild);
const sqliteResult: Promise<SQLiteChild[]> = ConfiguredSQLiteChild.find({ name: 'typed child' });

function useSQLiteControl(control: SQLiteDatabaseControl): void {
  control.ensureSchema((error) => {
    if (error) throw error;
  });
  control.resetSchema({ verbose: false }, (error) => {
    if (error) throw error;
  });
  const closed: Promise<void> = control.connection.destroy();
  control.connection.destroy((error) => {
    if (error) throw error;
  });
  // @ts-expect-error Schema controls require their completion callback.
  control.ensureSchema();
  void closed;
}

// @ts-expect-error SQLite filenames are strings, not native database handles.
SQL.sync(SQLiteChild, { filename: 123 });

void [sqliteResult, useSQLiteControl];

class PostgreSQLItem extends Backbone.Model<{ name?: string }> {
  urlRoot = 'postgres://family_owner:private@127.0.0.1:5432/postgres/typed_items';
}
PostgreSQLItem.prototype.sync = SQL.sync(PostgreSQLItem);
const pgRef = new ModelRef<PostgreSQLItem>(new Backbone.Collection<PostgreSQLItem>(), 1);
const pgView = kb.viewModel(pgRef, { keys: ['name'] });
function usePostgreSQLControl(control: PostgreSQLDatabaseControl): Promise<void> {
  control.ensureSchema((error) => {
    if (error) throw error;
  });
  // @ts-expect-error Schema controls require their completion callback.
  control.ensureSchema();
  return control.connection.destroy();
}
void [pgView, usePostgreSQLControl];

class MongoItem extends Backbone.Model<{ id?: number | string; name?: string; _rev?: number }> {
  urlRoot = 'mongodb://127.0.0.1:27017/typed_family/items';
}
const mongoOptions: MongoSyncOptions = { serverSelectionTimeoutMS: 10_000, forceServerObjectId: false };
MongoItem.prototype.sync = Mongo.sync(MongoItem, mongoOptions);
const mongoModel = new MongoItem({ id: 0 });
const mongoRef = new ModelRef<MongoItem>(new Backbone.Collection<MongoItem>(), 0);
const mongoView = kb.viewModel(mongoRef, { keys: ['name'] });
function useMongoControl(control: MongoConnectionControl): Promise<void> {
  control.collection((error, collection) => {
    if (error) throw error;
    void collection?.findOne({ id: 0 });
  });
  return control.destroy();
}
// @ts-expect-error The adapter requires its returned native ID.
Mongo.sync(MongoItem, { forceServerObjectId: true });
void [mongoModel, mongoView, useMongoControl];
