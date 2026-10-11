// Lifecycle cases use the local-family fixture's verified private Mongo binary and loopback service.
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'assert';
import { safeRmSync } from 'fs-remove-compat';
import { runOwnedProcess as runFamilyProcess, startOwnedProcess } from '../local-family/scripts/process.ts';
import { withMongo } from '../local-family/test/lib/mongo.ts';
import { startPostgres, withPostgres } from '../local-family/test/lib/postgres.ts';
import { type CorePeerCase, type ModuleFormat, NODE_CORE_PEER_CASES, NODE_RELATIONSHIP_CASES, RELATIONSHIP_VERSIONS, type RelationshipCase } from './cases.ts';
import { cleanupCorePeerArtifacts, prepareCorePeerPackageFixture } from './package-fixture.ts';
import { runOwnedProcess } from './process.ts';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const fixtureSource = path.join(repoRoot, 'test/integration/relationships/fixtures');
const fixtureParent = path.join(repoRoot, '.tmp');
const fixtures: string[] = [];

describe('local-family owned lifecycle', () => {
  const roots: string[] = [];
  const familyRoot = path.join(repoRoot, 'test/integration/local-family');

  function processFixture(parent: 'timeout' | 'failure'): string {
    const root = mkdtempSync(path.join(fixtureParent, `family-process-${parent}-`));
    roots.push(root);
    for (const kind of ['parent', 'child']) cpSync(path.join(fixtureSource, `${parent}-${kind}.cjs`), path.join(root, `${parent}-${kind}.cjs`));
    return root;
  }

  before(() => mkdirSync(fixtureParent, { recursive: true }));
  after(() => {
    for (const root of roots) safeRmSync(root, { recursive: true, force: true });
  });

  it('observes ENOENT and still finishes stop cleanup', async () => {
    const owner = startOwnedProcess(path.join(fixtureParent, 'missing-family-owned-command'), [], { cwd: repoRoot, label: 'missing family command', timeoutMs: 500 });
    let original: unknown;
    await assert.rejects(owner.result, (error: NodeJS.ErrnoException) => {
      original = error;
      return error.code === 'ENOENT';
    });
    await owner.stop();
    await assert.rejects(owner.result, (error: unknown) => error === original);
  });

  it('does not relabel natural exit 7 when a later close listener stops it', async () => {
    const owner = startOwnedProcess(process.execPath, ['-e', 'process.exit(7)'], { cwd: repoRoot, label: 'natural family failure', timeoutMs: 5_000 });
    const stopped = new Promise<void>((resolve, reject) => owner.child.once('close', () => owner.stop().then(resolve, reject)));
    let original: unknown;
    await Promise.all([
      assert.rejects(owner.result, (error: Error) => {
        original = error;
        return /natural family failure exited 7/.test(error.message);
      }),
      stopped,
    ]);
    await assert.rejects(owner.result, (error: unknown) => error === original);
  });

  it('intentionally stops and reaps an active real process', async () => {
    const owner = startOwnedProcess(process.execPath, ['-e', 'setInterval(() => undefined, 1000)'], { cwd: repoRoot, label: 'active family process', timeoutMs: 5_000 });
    const outcome = owner.result.then(
      (result) => ({ result }),
      (failure: unknown) => ({ failure })
    );
    await new Promise<void>((resolve, reject) => {
      owner.child.once('spawn', resolve);
      owner.child.once('error', reject);
    });
    await owner.stop();
    const finished = await outcome;
    if ('failure' in finished) throw finished.failure;
    assert.notStrictEqual(finished.result.code, 0);
    assert.strictEqual(owner.child.exitCode !== null || owner.child.signalCode !== null, true);
  });

  it('gracefully stops a real SIGINT owner without changing its latched outcome', async () => {
    const owner = startOwnedProcess(process.execPath, ['-e', "process.on('SIGINT', () => { process.stdout.write('graceful'); process.exit(0); }); process.stdout.write('ready'); setInterval(() => undefined, 1000)"], { cwd: repoRoot, label: 'graceful family process', timeoutMs: 5_000, stopSignal: 'SIGINT' });
    const observed = owner.result.then(
      (result) => ({ result }),
      (failure: unknown) => ({ failure })
    );
    await new Promise<void>((resolve, reject) => {
      owner.child.stdout?.once('data', () => resolve());
      owner.child.once('error', reject);
    });
    await owner.stop();
    const outcome = await observed;
    if ('failure' in outcome) throw outcome.failure;
    assert.strictEqual(outcome.result.code, 0);
    assert.strictEqual(outcome.result.stdout, 'readygraceful');
    await owner.stop();
    assert.deepStrictEqual(await owner.result, outcome.result);
  });

  it('rejects missing PostgreSQL admission without creating a fixture root', async () => {
    const dataRoot = path.join(familyRoot, '.tmp/postgres-tests');
    const before = existsSync(dataRoot) ? readdirSync(dataRoot) : [];
    await assert.rejects(startPostgres(path.join(fixtureParent, 'missing-approved-postgres-runtime')), (error: NodeJS.ErrnoException) => error.code === 'ENOENT');
    assert.deepStrictEqual(existsSync(dataRoot) ? readdirSync(dataRoot) : [], before);
  });

  for (const failure of [new Error('real PostgreSQL application body rejected'), 0, undefined]) {
    it(`cleans up PostgreSQL after rejecting with ${failure instanceof Error ? 'the exact Error' : String(failure)}`, async () => {
      const runtime = process.env.TEST_POSTGRES_RUNTIME;
      assert.ok(runtime, 'PostgreSQL lifecycle requires the reviewed TEST_POSTGRES_RUNTIME');
      const dataRoot = path.join(familyRoot, '.tmp/postgres-tests');
      const before = existsSync(dataRoot) ? readdirSync(dataRoot) : [];
      let entered = false;
      let caught = false;
      try {
        await withPostgres(runtime, async (server) => {
          assert.strictEqual(server.version, '18.4');
          entered = true;
          throw failure;
        });
      } catch (error) {
        caught = true;
        assert.strictEqual(error, failure);
      }
      assert.strictEqual(entered, true);
      assert.strictEqual(caught, true);
      assert.deepStrictEqual(readdirSync(dataRoot), before);
    });
  }

  for (const kind of ['timeout', 'failure'] as const) {
    it(`reaps descendants after ${kind === 'timeout' ? 'timeout' : 'early parent failure'}`, async () => {
      const root = processFixture(kind);
      await assert.rejects(runFamilyProcess(process.execPath, [path.join(root, `${kind}-parent.cjs`)], { cwd: repoRoot, label: 'family descendant process', timeoutMs: kind === 'timeout' ? 500 : 5_000 }), kind === 'timeout' ? /timed out/ : /exited 7/);
      const pid = Number(readFileSync(path.join(root, 'descendant.pid'), 'utf8'));
      assert.throws(
        () => process.kill(pid, 0),
        (error: NodeJS.ErrnoException) => error.code === 'ESRCH'
      );
      safeRmSync(root, { recursive: true, force: true });
      assert.strictEqual(existsSync(root), false);
    });
  }

  for (const failure of [new Error('real Mongo application body rejected'), 0, undefined]) {
    it(`cleans up real Mongo after an application rejects with ${failure instanceof Error ? 'the exact Error' : String(failure)}`, async () => {
      const dataRoot = path.join(familyRoot, '.tmp/mongo-tests');
      const before = existsSync(dataRoot) ? readdirSync(dataRoot) : [];
      let entered = false;
      let caught = false;
      try {
        await withMongo(async (uri) => {
          assert.match(uri, /^mongodb:\/\/127\.0\.0\.1:\d+\/local_family$/);
          entered = true;
          throw failure;
        });
      } catch (error) {
        caught = true;
        assert.strictEqual(error, failure);
      }
      assert.strictEqual(entered, true);
      assert.strictEqual(caught, true);
      assert.deepStrictEqual(readdirSync(dataRoot), before);
    });
  }
});

function copyPackage(sourceName: string, targetName: string, nodeModules: string): void {
  const source = path.join(repoRoot, 'node_modules', sourceName);
  assert.ok(existsSync(source), `Missing matrix dependency: ${sourceName}`);
  const target = path.join(nodeModules, targetName);
  mkdirSync(path.dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true });
}

function stageCandidate(nodeModules: string): void {
  const target = path.join(nodeModules, '@mcpeasy/knockback');
  mkdirSync(target, { recursive: true });
  cpSync(path.join(repoRoot, 'package.json'), path.join(target, 'package.json'));
  cpSync(path.join(repoRoot, 'dist'), path.join(target, 'dist'), {
    recursive: true,
  });
}

function prepareFixture(testCase: RelationshipCase): string {
  const root = mkdtempSync(path.join(fixtureParent, `relationships-${testCase.name}-`));
  fixtures.push(root);
  const nodeModules = path.join(root, 'node_modules');
  mkdirSync(nodeModules);
  writeFileSync(path.join(root, 'package.json'), `${JSON.stringify({ name: `relationship-${testCase.name}`, private: true }, null, 2)}\n`);

  copyPackage(testCase.backbone === 'legacy' ? 'backbone-legacy' : 'backbone', 'backbone', nodeModules);
  for (const dependency of ['backbone-associations', 'backbone-orm', 'backbone-relational', 'knockout', 'underscore']) {
    copyPackage(dependency, dependency, nodeModules);
  }
  stageCandidate(nodeModules);

  cpSync(path.join(fixtureSource, 'exercise.cjs'), path.join(root, 'exercise.cjs'));
  cpSync(path.join(fixtureSource, `entry.${testCase.format === 'cjs' ? 'cjs' : 'mjs'}`), path.join(root, `entry.${testCase.format === 'cjs' ? 'cjs' : 'mjs'}`));
  const backboneVersion = testCase.backbone === 'legacy' ? RELATIONSHIP_VERSIONS.legacyBackbone : RELATIONSHIP_VERSIONS.backbone;
  writeFileSync(path.join(root, 'case.json'), `${JSON.stringify({ ...testCase, backboneVersion }, null, 2)}\n`);

  const fixtureRequire = createRequire(path.join(root, 'entry.cjs'));
  assert.strictEqual(realpathSync(fixtureRequire.resolve('backbone')), realpathSync(path.join(nodeModules, 'backbone/backbone.js')));
  for (const plugin of ['backbone-associations', 'backbone-orm', 'backbone-relational']) {
    const pluginRequire = createRequire(path.join(nodeModules, plugin, 'package.json'));
    assert.strictEqual(realpathSync(pluginRequire.resolve('backbone')), realpathSync(fixtureRequire.resolve('backbone')), `${plugin} must use the fixture Backbone`);
  }
  return root;
}

async function prepareCorePeerFixture(testCase: CorePeerCase): Promise<string> {
  const root = await prepareCorePeerPackageFixture(repoRoot, fixtureParent, testCase);
  fixtures.push(root);
  cpSync(path.join(fixtureSource, 'exercise.cjs'), path.join(root, 'exercise.cjs'));
  const entry = `entry.${testCase.format === 'cjs' ? 'cjs' : 'mjs'}`;
  cpSync(path.join(fixtureSource, entry), path.join(root, entry));
  writeFileSync(path.join(root, 'case.json'), `${JSON.stringify(testCase, null, 2)}\n`);
  return root;
}

function runFixtureEntry(root: string, entry: string, timeoutMs = 30_000): Promise<string> {
  return runOwnedProcess(process.execPath, [path.join(root, entry)], {
    cwd: root,
    label: 'Relationship fixture',
    timeoutMs,
  }).then(({ stdout }) => stdout);
}

function runFixture(root: string, format: ModuleFormat): Promise<string> {
  return runFixtureEntry(root, `entry.${format === 'cjs' ? 'cjs' : 'mjs'}`);
}

describe('canonical relationship package matrix', () => {
  before(() => {
    mkdirSync(fixtureParent, { recursive: true });
    assert.ok(existsSync(path.join(repoRoot, 'dist/cjs/index.js')), 'Build the local Knockback candidate before the matrix');
    const packageManifest = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8')) as { name: string };
    assert.strictEqual(packageManifest.name, '@mcpeasy/knockback');
  });

  after(() => {
    for (const fixture of fixtures) safeRmSync(fixture, { recursive: true, force: true });
    cleanupCorePeerArtifacts();
  });

  it('waits for a timed-out fixture process tree before its cwd is removed', async () => {
    const root = mkdtempSync(path.join(fixtureParent, 'relationships-timeout-'));
    fixtures.push(root);
    cpSync(path.join(fixtureSource, 'timeout-parent.cjs'), path.join(root, 'timeout-parent.cjs'));
    cpSync(path.join(fixtureSource, 'timeout-child.cjs'), path.join(root, 'timeout-child.cjs'));

    await assert.rejects(runFixtureEntry(root, 'timeout-parent.cjs', 500), /Relationship fixture timed out/);
    const descendantPid = Number(readFileSync(path.join(root, 'descendant.pid'), 'utf8'));
    assert.throws(
      () => process.kill(descendantPid, 0),
      (error: NodeJS.ErrnoException) => error.code === 'ESRCH'
    );
    safeRmSync(root, { recursive: true, force: true });
    assert.strictEqual(existsSync(root), false);
  });

  it('waits for an early failed fixture process tree before its cwd is removed', async () => {
    const root = mkdtempSync(path.join(fixtureParent, 'relationships-failure-'));
    fixtures.push(root);
    cpSync(path.join(fixtureSource, 'failure-parent.cjs'), path.join(root, 'failure-parent.cjs'));
    cpSync(path.join(fixtureSource, 'failure-child.cjs'), path.join(root, 'failure-child.cjs'));

    await assert.rejects(runFixtureEntry(root, 'failure-parent.cjs'), /Relationship fixture exited 7/);
    const descendantPid = Number(readFileSync(path.join(root, 'descendant.pid'), 'utf8'));
    assert.throws(
      () => process.kill(descendantPid, 0),
      (error: NodeJS.ErrnoException) => error.code === 'ESRCH'
    );
    safeRmSync(root, { recursive: true, force: true });
    assert.strictEqual(existsSync(root), false);
  });

  it('settles a missing owned command without waiting for cwd cleanup', async () => {
    const root = mkdtempSync(path.join(fixtureParent, 'relationships-missing-command-'));
    fixtures.push(root);
    await assert.rejects(
      runOwnedProcess(path.join(root, 'missing-owned-command'), [], {
        cwd: root,
        label: 'Missing owned command',
        timeoutMs: 500,
      }),
      /ENOENT/
    );
    safeRmSync(root, { recursive: true, force: true });
    assert.strictEqual(existsSync(root), false);
  });

  for (const testCase of NODE_RELATIONSHIP_CASES) {
    it(testCase.name, async () => {
      const output = await runFixture(prepareFixture(testCase), testCase.format);
      assert.match(output, new RegExp(`passed ${testCase.name}$`, 'm'));
    });
  }

  for (const testCase of NODE_CORE_PEER_CASES) {
    it(testCase.name, async () => {
      const output = await runFixture(await prepareCorePeerFixture(testCase), testCase.format);
      assert.match(output, new RegExp(`passed ${testCase.name}$`, 'm'));
    });
  }
});
