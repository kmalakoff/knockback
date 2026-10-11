import { createHash, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'assert';
import { safeRmSync } from 'fs-remove-compat';
import { MongoClient } from 'mongodb';
import { type OwnedProcessResult, startOwnedProcess } from '../../scripts/process.ts';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const VERSION = '8.2.6';
const BINARY_HASH = '37e1656df8c55deb98928196ada454b243d6b641f2bf76958b9ccd85e6d36b55';

async function availablePort(): Promise<number> {
  const server = createServer();
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  if (!address || typeof address === 'string') throw new Error('No private Mongo port');
  return address.port;
}

export async function startMongo() {
  if (process.platform !== 'darwin' || process.arch !== 'arm64') throw new Error('The local-family Mongo fixture requires the reviewed macOS ARM64 binary');
  // SSPL MongoDB binary is a verified private cache input, not a global service.
  const binary = path.join(appRoot, '.tmp/cache/mongodb-binaries', `mongod-arm64-darwin-${VERSION}`);
  assert.strictEqual(createHash('sha256').update(readFileSync(binary)).digest('hex'), BINARY_HASH);
  const root = path.join(appRoot, '.tmp/mongo-tests', randomUUID());
  let owner: ReturnType<typeof startOwnedProcess> | undefined;
  let client: MongoClient | undefined;
  type ProcessOutcome = { result: OwnedProcessResult } | { failure: unknown };
  let completed: ProcessOutcome | undefined;
  let observed: Promise<ProcessOutcome> | undefined;
  async function close(): Promise<void> {
    const failures: unknown[] = [];
    try {
      await client?.close();
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
      // Only confirmed stop permits waiting for result; a failed deadline must stay bounded.
      const outcome = closureConfirmed ? await observed : completed;
      if (outcome && 'failure' in outcome) failures.push(outcome.failure);
    }
    if (closureConfirmed && !failures.length) {
      try {
        safeRmSync(root, { recursive: true, force: true });
        assert.strictEqual(existsSync(root), false);
      } catch (error) {
        failures.push(error);
      }
    }
    if (failures.length) throw new AggregateError(failures, `Mongo server cleanup failed; ${closureConfirmed ? 'owned data retained' : 'process closure unconfirmed, owned data retained'} at ${root}`);
  }
  try {
    const port = await availablePort();
    const uri = `mongodb://127.0.0.1:${port}/local_family`;
    const databasePath = path.join(root, 'data');
    mkdirSync(databasePath, { recursive: true });
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 });
    owner = startOwnedProcess(binary, ['--port', String(port), '--bind_ip', '127.0.0.1', '--dbpath', databasePath, '--wiredTigerCacheSizeGB', '0.25', '--quiet'], { cwd: appRoot, label: 'private local-family MongoDB', timeoutMs: 120_000 });
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
    await Promise.race([
      client.connect(),
      observed.then((outcome) => {
        if ('failure' in outcome) throw outcome.failure;
        throw new Error(`mongod exited before readiness: ${outcome.result.stdout}${outcome.result.stderr}`);
      }),
    ]);
    const info = await client.db('admin').command({ buildInfo: 1 });
    assert.strictEqual(info.version, VERSION);
    return { uri, root, version: VERSION, close };
  } catch (error) {
    try {
      await close();
    } catch (cleanup) {
      throw new AggregateError([error, cleanup], 'Mongo startup and cleanup failed');
    }
    throw error;
  }
}

export async function withMongo<T>(exercise: (uri: string) => Promise<T>): Promise<T> {
  const server = await startMongo();
  let outcome: { value: T } | { failure: unknown };
  try {
    outcome = { value: await exercise(server.uri) };
  } catch (failure) {
    outcome = { failure };
  }
  try {
    await server.close();
  } catch (cleanup) {
    throw 'failure' in outcome ? new AggregateError([outcome.failure, cleanup], 'Mongo application and server cleanup failed') : cleanup;
  }
  if ('failure' in outcome) throw outcome.failure;
  console.log(JSON.stringify({ mongoServer: server.version, serverRootRemoved: !existsSync(server.root) }));
  return outcome.value;
}
