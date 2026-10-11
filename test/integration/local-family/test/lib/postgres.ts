// Real private PostgreSQL18.4 core runtime, no global service or runtime provisioning.
import { createHash, randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'assert';
import { safeRmSync } from 'fs-remove-compat';
import knexFactory, { type Knex } from 'knex';
import 'pg';
import { type OwnedProcessResult, runOwnedProcess, startOwnedProcess } from '../../scripts/process.ts';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BINARY_HASHES = {
  initdb: 'b81069a19bcec5d2dd263f5c9bce2ce0b5075ae0f9b8a5c81b79f34bef503c39',
  postgres: '515d8e4c690ecd6ae86074eedd5d6d0ed50df434b3743274085b9692f1e923f9',
};

async function availablePort(): Promise<number> {
  const server = createServer();
  try {
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('No private PostgreSQL port');
    return address.port;
  } finally {
    if (server.listening) await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

export async function startPostgres(runtime: string) {
  if (process.platform !== 'darwin' || process.arch !== 'arm64') throw new Error('FAMILY PostgreSQL requires the reviewed Darwin ARM64 runtime');
  if (Object.keys(process.env).some((key) => key.startsWith('DYLD_') && process.env[key])) throw new Error('FAMILY PostgreSQL does not permit DYLD overrides');
  for (const [name, expected] of Object.entries(BINARY_HASHES))
    assert.strictEqual(
      createHash('sha256')
        .update(readFileSync(path.join(runtime, 'bin', name)))
        .digest('hex'),
      expected
    );
  const scratch = path.join(appRoot, '.tmp/postgres-tests');
  let root: string | undefined;
  let owner: ReturnType<typeof startOwnedProcess> | undefined;
  let database: Knex | undefined;
  type Outcome = { result: OwnedProcessResult } | { failure: unknown };
  let completed: Outcome | undefined;
  let observed: Promise<Outcome> | undefined;
  let closing: Promise<void> | undefined;
  function close(): Promise<void> {
    closing ??= (async () => {
      const failures: unknown[] = [];
      try {
        await database?.destroy();
      } catch (error) {
        failures.push(error);
      }
      let closureConfirmed = !owner;
      if (owner) {
        try {
          await owner.stop();
          closureConfirmed = true;
        } catch (error) {
          failures.push(error);
        }
        const outcome = closureConfirmed ? await observed : completed;
        if (outcome && 'failure' in outcome) failures.push(outcome.failure);
      }
      if (root && closureConfirmed && !failures.length) {
        try {
          safeRmSync(root, { recursive: true, force: true });
          assert.strictEqual(existsSync(root), false);
        } catch (error) {
          failures.push(error);
        }
      }
      if (failures.length) throw new AggregateError(failures, `PostgreSQL cleanup failed; ${closureConfirmed ? 'data retained' : 'closure unconfirmed, data retained'} at ${root ?? 'unacquired root'}`);
    })();
    return closing;
  }
  try {
    const env = { ...process.env, LC_ALL: 'C' };
    for (const name of Object.keys(BINARY_HASHES)) {
      const version = await runOwnedProcess(path.join(runtime, 'bin', name), ['--version'], { cwd: appRoot, env, label: `PostgreSQL ${name} identity`, timeoutMs: 10_000 });
      assert.strictEqual(version.stdout.trim(), `${name} (PostgreSQL) 18.4`);
    }
    const port = await availablePort();
    mkdirSync(scratch, { recursive: true, mode: 0o700 });
    root = mkdtempSync(path.join(scratch, 'postgres-'));
    const data = path.join(root, 'data');
    const password = randomBytes(24).toString('hex');
    const passwordFile = path.join(root, 'password');
    writeFileSync(passwordFile, `${password}\n`, { flag: 'wx', mode: 0o600 });
    await runOwnedProcess(path.join(runtime, 'bin/initdb'), ['-D', data, '-U', 'family_owner', '--encoding=UTF8', '--locale=C', '--auth-local=scram-sha-256', '--auth-host=scram-sha-256', `--pwfile=${passwordFile}`], { cwd: appRoot, env, label: 'private PostgreSQL initdb', timeoutMs: 30_000 });
    mkdirSync(path.join(data, 'socket'), { mode: 0o700 });
    const connection = { database: 'postgres', host: '127.0.0.1', password, port, ssl: false, user: 'family_owner' };
    database = knexFactory({ client: 'pg', connection, acquireConnectionTimeout: 10_000, pool: { max: 1, min: 0 } });
    owner = startOwnedProcess(path.join(runtime, 'bin/postgres'), ['-D', data, '-h', '127.0.0.1', '-p', String(port), '-k', 'socket', '-c', 'max_connections=10', '-c', 'shared_buffers=32MB', '-c', 'shared_preload_libraries=', '-c', 'local_preload_libraries=', '-c', 'session_preload_libraries='], {
      cwd: data,
      env,
      label: 'private FAMILY PostgreSQL',
      timeoutMs: 120_000,
      stopSignal: 'SIGINT',
    });
    observed = owner.result.then(
      (result) => {
        completed = { result };
        return completed;
      },
      (failure: unknown) => {
        completed = { failure };
        return completed;
      }
    );
    let readiness = '';
    owner.child.stderr?.on('data', (chunk: Buffer) => {
      readiness = `${readiness}${chunk.toString()}`.slice(-4096);
    });
    const deadline = Date.now() + 15_000;
    while (!readiness.includes('database system is ready to accept connections')) {
      if (completed) throw 'failure' in completed ? completed.failure : new Error('PostgreSQL exited before readiness');
      if (Date.now() >= deadline) throw new Error('Private PostgreSQL readiness exceeded 15 seconds');
      await new Promise<void>((resolve) => setTimeout(resolve, 20));
    }
    await database.raw('select 1 as ready');
    return { root, database, close, version: '18.4', modelURL: (table: string) => `postgres://family_owner:${password}@127.0.0.1:${port}/postgres/${table}` };
  } catch (error) {
    try {
      await close();
    } catch (cleanup) {
      throw new AggregateError([error, cleanup], 'PostgreSQL startup and cleanup failed');
    }
    throw error;
  }
}

export async function withPostgres<T>(runtime: string, exercise: (server: Awaited<ReturnType<typeof startPostgres>>) => Promise<T>): Promise<T> {
  const server = await startPostgres(runtime);
  let outcome: { value: T } | { failure: unknown };
  try {
    outcome = { value: await exercise(server) };
  } catch (failure) {
    outcome = { failure };
  }
  try {
    await server.close();
  } catch (cleanup) {
    throw 'failure' in outcome ? new AggregateError([outcome.failure, cleanup], 'PostgreSQL application and cleanup failed') : cleanup;
  }
  if ('failure' in outcome) throw outcome.failure;
  console.log(JSON.stringify({ postgresServer: server.version, serverRootRemoved: !existsSync(server.root) }));
  return outcome.value;
}
