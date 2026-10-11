import path from 'node:path';
import { withMongo } from '../test/lib/mongo.ts';
import { withPostgres } from '../test/lib/postgres.ts';
import { sqliteNode } from './lib/sql-runtime.ts';
import { type OwnedProcessResult, runOwnedProcess } from './process.ts';

const appRoot = path.resolve(import.meta.dirname, '..');
const browserRunner = path.join(appRoot, 'node_modules', '.bin', process.platform === 'win32' ? 'wtr.cmd' : 'wtr');
const failures: Error[] = [];
const sqlNode = await sqliteNode();
const checks: { args: string[]; command: string; label: string; timeoutMs: number; mongo?: boolean; postgres?: boolean }[] = [
  {
    args: ['app.cjs'],
    command: process.execPath,
    label: 'native CJS intended application',
    timeoutMs: 30_000,
  },
  {
    args: ['app.mjs'],
    command: process.execPath,
    label: 'native ESM intended application',
    timeoutMs: 30_000,
  },
  {
    args: ['app-umd.cjs'],
    command: process.execPath,
    label: 'cold native CJS ORM UMD application',
    timeoutMs: 30_000,
  },
  {
    args: ['app-umd.mjs'],
    command: process.execPath,
    label: 'cold native ESM ORM UMD application',
    timeoutMs: 30_000,
  },
  {
    args: ['app-sqlite.cjs'],
    command: sqlNode,
    label: 'native CJS SQLite family application',
    timeoutMs: 30_000,
  },
  {
    args: ['app-sqlite.mjs'],
    command: sqlNode,
    label: 'native ESM SQLite family application',
    timeoutMs: 30_000,
  },
  {
    args: ['app-postgres.cjs'],
    command: sqlNode,
    label: 'native CJS flat PostgreSQL family application',
    timeoutMs: 30_000,
    postgres: true,
  },
  {
    args: ['app-postgres.mjs'],
    command: sqlNode,
    label: 'native ESM flat PostgreSQL family application',
    timeoutMs: 30_000,
    postgres: true,
  },
  {
    args: ['app-mongo.cjs'],
    command: process.execPath,
    label: 'native CJS flat Mongo family application',
    timeoutMs: 30_000,
    mongo: true,
  },
  {
    args: ['app-mongo.mjs'],
    command: process.execPath,
    label: 'native ESM flat Mongo family application',
    timeoutMs: 30_000,
    mongo: true,
  },
  {
    args: ['--config', 'wtr.config.mjs', 'browser/local-family.test.ts', 'browser/orm-import.test.ts'],
    command: browserRunner,
    label: 'real-browser intended application',
    timeoutMs: 120_000,
  },
];

for (const check of checks) {
  try {
    const invoke = (uri?: string, postgresURL?: string) =>
      runOwnedProcess(check.command, check.args, {
        cwd: appRoot,
        env: postgresURL
          ? { ...process.env, LOCAL_FAMILY_POSTGRES_URL: postgresURL, PATH: `${path.dirname(sqlNode)}${path.delimiter}${process.env.PATH ?? ''}` }
          : uri
            ? { ...process.env, LOCAL_FAMILY_MONGO_URI: uri }
            : check.command === sqlNode
              ? { ...process.env, PATH: `${path.dirname(sqlNode)}${path.delimiter}${process.env.PATH ?? ''}` }
              : process.env,
        label: check.label,
        timeoutMs: check.timeoutMs,
      });
    let result: OwnedProcessResult;
    if (check.postgres) {
      const runtime = process.env.TEST_POSTGRES_RUNTIME;
      if (!runtime) throw new Error('Local-family PostgreSQL requires the reviewed TEST_POSTGRES_RUNTIME; no runtime is provisioned.');
      result = await withPostgres(runtime, (server) => invoke(undefined, server.modelURL('')));
    } else result = check.mongo ? await withMongo(invoke) : await invoke();
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
  } catch (error) {
    const failure = error instanceof Error ? error : new Error(`${check.label} failed with a non-Error value: ${String(error)}`);
    failures.push(failure);
    process.stderr.write(`${failure.message}\n`);
  }
}

if (failures.length) {
  throw new AggregateError(failures, `${failures.length} intended local-family integration check(s) failed`);
}
