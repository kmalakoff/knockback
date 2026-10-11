import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import kb from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ModelRef from 'backbone-modelref';
import ORM, { type ModelConstructor } from 'backbone-orm';
import SQL from 'backbone-sql';
import { safeRmSync } from 'fs-remove-compat';
import ko from 'knockout';

interface FamilyParameters {
  Backbone: typeof Backbone;
  filename: string;
  format: string;
  kb: typeof kb;
  ko: typeof ko;
  ModelRef: typeof ModelRef;
  ORM: typeof ORM;
  SQL: typeof SQL;
  sqlModels: ModelConstructor<Backbone.Model>[];
}

function control(model: ModelConstructor<Backbone.Model>, method: string, ...arguments_: unknown[]): unknown {
  return Reflect.apply(model.prototype.sync, model, [method, ...arguments_]);
}

function completion(invoke: (callback: (error?: unknown) => void) => unknown): Promise<void> {
  return new Promise((resolve, reject) => invoke((error) => (error ? reject(error) : resolve())));
}

export async function runSQLiteFamily(format: 'cjs' | 'esm', exercise: (parameters: FamilyParameters) => Promise<unknown>): Promise<object> {
  assert.strictEqual(process.version, 'v20.20.2');
  assert.strictEqual(process.versions.modules, '115');
  assert.strictEqual(SQL.Backbone, Backbone);
  assert.strictEqual(SQL.modules['backbone-orm'], ORM);
  assert.strictEqual(ORM.Backbone, Backbone);
  const ownFile = typeof __filename === 'undefined' ? fileURLToPath(import.meta.url) : __filename;
  const appRequire = createRequire(ownFile);
  const appRoot = path.resolve(path.dirname(ownFile), '../..');
  const sqlRoot = path.dirname(appRequire.resolve('backbone-sql/package.json'));
  const sqlRequire = createRequire(path.join(sqlRoot, 'package.json'));
  assert.strictEqual(realpathSync(sqlRequire.resolve('backbone')), realpathSync(appRequire.resolve('backbone')));
  assert.strictEqual(realpathSync(sqlRequire.resolve('backbone-orm')), realpathSync(appRequire.resolve('backbone-orm')));
  const versions: Record<string, string> = {};
  for (const [name, expected] of [
    ['knex', '3.3.0'],
    ['better-sqlite3', '11.10.0'],
  ]) {
    const manifestPath = sqlRequire.resolve(`${name}/package.json`);
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { version: string };
    assert.strictEqual(manifest.version, expected);
    assert.strictEqual(realpathSync(manifestPath), realpathSync(appRequire.resolve(`${name}/package.json`)));
    versions[name] = manifest.version;
  }
  const root = path.join(appRoot, '.tmp', `sqlite-family-${format}-${randomUUID()}`);
  const filename = path.join(root, 'family.sqlite3');
  const sqlModels: ModelConstructor<Backbone.Model>[] = [];
  const failures: unknown[] = [];
  let result: unknown;
  mkdirSync(root, { recursive: true });
  try {
    result = await exercise({ Backbone, filename, format: `SQLite${format}`, kb, ko, ModelRef, ORM, SQL, sqlModels });
    assert.ok(existsSync(filename), 'SQL did not create the owned real SQLite database');
    const Parent = sqlModels[1];
    assert.ok(Parent);
    let notifications = 0;
    const missing = new Parent();
    missing.set('id', 999999);
    let observeCallback: (error: unknown) => void = () => assert.fail('Missing-row callback observer is not initialized');
    const callbackObservation = new Promise<unknown>((resolve) => {
      observeCallback = resolve;
    });
    const request: unknown = missing.fetch({
      error: (_model, error: unknown) => {
        notifications += 1;
        observeCallback(error);
      },
      success: () => {
        notifications += 1;
        observeCallback(null);
      },
    });
    assert.ok((typeof request === 'object' && request !== null) || typeof request === 'function', 'missing SQL row fetch must return a request');
    assert.strictEqual(typeof Reflect.get(request, 'then'), 'function', 'missing SQL row request must be thenable');
    const requestOutcome = Promise.resolve(request).then(
      () => assert.fail('missing SQL row request must reject'),
      (error: unknown) => error
    );
    const [error, requestError] = await Promise.all([callbackObservation, requestOutcome]);
    assert.ok(error instanceof Error, 'missing SQL row must notify a real error');
    assert.strictEqual(requestError, error, 'error callback and request rejection must preserve the same Error');
    await new Promise<void>((resolve) => setImmediate(resolve));
    assert.strictEqual(notifications, 1);

    let optionsNotifications = 0;
    const optionsObservation = await new Promise<{ error: unknown; model: unknown }>((resolve) => {
      void missing.fetch({
        error: (model, error: unknown) => {
          optionsNotifications += 1;
          resolve({ error, model });
        },
        success: (model) => {
          optionsNotifications += 1;
          resolve({ error: null, model });
        },
      });
    });
    await new Promise<void>((resolve) => setImmediate(resolve));
    assert.ok(optionsObservation.error instanceof Error, 'ignored options request must notify a real missing-row error');
    assert.strictEqual(optionsObservation.model, missing);
    assert.strictEqual(optionsNotifications, 1);

    let trailingNotifications = 0;
    const trailingObservation = await new Promise<{ error: unknown; model: unknown; response: unknown }>((resolve) => {
      void Reflect.apply(missing.fetch, missing, [
        (error: unknown, model: unknown, response: unknown) => {
          trailingNotifications += 1;
          resolve({ error, model, response });
        },
      ]);
    });
    await new Promise<void>((resolve) => setImmediate(resolve));
    assert.ok(trailingObservation.error instanceof Error, 'ignored trailing request must notify a real missing-row error');
    assert.strictEqual(trailingObservation.model, missing);
    assert.strictEqual(trailingObservation.response, trailingObservation.error);
    assert.strictEqual(trailingNotifications, 1);
  } catch (error) {
    failures.push(error);
  } finally {
    const connections = new Set<object>();
    const connectionModels: ModelConstructor<Backbone.Model>[] = [];
    for (const model of sqlModels) {
      try {
        const db = control(model, 'db');
        assert.ok(typeof db === 'object' && db !== null);
        const connection: unknown = Reflect.get(db, 'connection');
        assert.ok(typeof connection === 'object' && connection !== null);
        if (!connections.has(connection)) connectionModels.push(model);
        connections.add(connection);
      } catch (error) {
        failures.push(error);
      }
    }
    if (sqlModels.length === 2 && connections.size !== 1) failures.push(new Error('SQL relation models did not share one owned connection'));
    for (const model of connectionModels) {
      try {
        await completion((callback) => control(model, 'closeConnection', callback));
      } catch (error) {
        failures.push(error);
      }
    }
    try {
      await ORM.ConnectionPool.disposeAll();
    } catch (error) {
      failures.push(error);
    }
    kb.configure({ orm: undefined });
    try {
      safeRmSync(root, { force: true, recursive: true });
      assert.strictEqual(existsSync(root), false);
    } catch (error) {
      failures.push(error);
    }
  }
  if (failures.length) throw new AggregateError(failures, `SQLite ${format} family failed; cleanup errors retained separately`);
  return {
    cleanup: true,
    errorCallbackOnce: true,
    format,
    ignoredOptionsErrorOnce: true,
    ignoredTrailingErrorOnce: true,
    result,
    sharedBackbone: true,
    sharedORM: true,
    sqliteABI: process.versions.modules,
    versions,
  };
}
