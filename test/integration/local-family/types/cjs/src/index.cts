import kbPackage = require('@mcpeasy/knockback');
import Backbone = require('backbone');
import ModelRef = require('backbone-modelref');
import BackboneORM = require('backbone-orm');
import SQL = require('backbone-sql');
import Mongo = require('backbone-mongo');

import type { MongoConnectionControl, MongoSyncOptions } from 'backbone-mongo';

import type { PostgreSQLDatabaseControl, SQLiteDatabaseControl, SQLSyncOptions } from 'backbone-sql';

class CommonChild extends Backbone.Model<{ id: number; name: string }> {
  static model_name = 'LocalFamilyCommonTypeChild';
}

const ConfiguredChild = BackboneORM.configureModel(CommonChild);
const child = new ConfiguredChild({ id: 3, name: 'common child' });
const reference = new ModelRef<CommonChild>(new Backbone.Collection<CommonChild>([child]), child.id);
const view = kbPackage.viewModel(reference, { keys: ['name'] });
const result: Promise<CommonChild[]> = ConfiguredChild.find({ id: 3 });

void [result, view];

class CommonSQLiteChild extends Backbone.Model<{ name: string }> {
  urlRoot = 'sqlite3:///common_typed_children';
}

const options: SQLSyncOptions = { filename: 'private-common-fixture.sqlite3' };
CommonSQLiteChild.prototype.sync = SQL.sync(CommonSQLiteChild, options);
const ConfiguredSQLiteChild = BackboneORM.configureModel(CommonSQLiteChild);
const sqliteResult: Promise<CommonSQLiteChild[]> = ConfiguredSQLiteChild.find({ name: 'common child' });
function useSQLiteControl(control: SQLiteDatabaseControl): void {
  control.ensureSchema((error) => {
    if (error) throw error;
  });
  control.resetSchema({ verbose: false }, (error) => {
    if (error) throw error;
  });
  const closed: Promise<void> = control.connection.destroy();
  // @ts-expect-error Schema controls require their completion callback.
  control.ensureSchema();
  void closed;
}

// @ts-expect-error SQLite filenames are strings, not native database handles.
SQL.sync(CommonSQLiteChild, { filename: 123 });

void [sqliteResult, useSQLiteControl];

class CommonPostgreSQLItem extends Backbone.Model<{ name?: string }> {
  urlRoot = 'postgres://family_owner:private@127.0.0.1:5432/postgres/common_typed_items';
}
CommonPostgreSQLItem.prototype.sync = SQL.sync(CommonPostgreSQLItem);
const pgRef = new ModelRef<CommonPostgreSQLItem>(new Backbone.Collection<CommonPostgreSQLItem>(), 1);
const pgView = kbPackage.viewModel(pgRef, { keys: ['name'] });
function usePostgreSQLControl(control: PostgreSQLDatabaseControl): Promise<void> {
  control.ensureSchema((error) => {
    if (error) throw error;
  });
  // @ts-expect-error Schema controls require their completion callback.
  control.ensureSchema();
  return control.connection.destroy();
}
void [pgView, usePostgreSQLControl];

class CommonMongoItem extends Backbone.Model<{ id?: number | string; name?: string; _rev?: number }> {
  urlRoot = 'mongodb://127.0.0.1:27017/common_typed_family/items';
}
const mongoOptions: MongoSyncOptions = { forceServerObjectId: false };
CommonMongoItem.prototype.sync = Mongo.sync(CommonMongoItem, mongoOptions);
const mongoRef = new ModelRef<CommonMongoItem>(new Backbone.Collection<CommonMongoItem>(), 0);
const mongoView = kbPackage.viewModel(mongoRef, { keys: ['name'] });
function useMongoControl(control: MongoConnectionControl): Promise<void> {
  return control.destroy();
}
// @ts-expect-error The adapter requires its returned native ID.
Mongo.sync(CommonMongoItem, { forceServerObjectId: true });
void [mongoView, useMongoControl];
