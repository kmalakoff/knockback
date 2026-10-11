import { createHash } from 'node:crypto';
import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'assert';
import { safeRmSync } from 'fs-remove-compat';
import { comparePath, listFiles, sha256File, type TreeEntry, treeManifest } from '../local-family/scripts/lib/immutable-tree.ts';
import { runOwnedProcess } from '../relationships/process.ts';
import type { CellObservation, HistoricalObservation, MatrixCell, RuntimeObservation } from './types.ts';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const projectRoot = path.resolve(repositoryRoot, '../../..');
const originalCheckout = path.join(projectRoot, 'knockback-v2');
const publishedKnockbackRoot = path.join(projectRoot, 'knockback-v1/packages/npm');
const publishedOrmRoot = path.join(originalCheckout, 'node_modules/backbone-orm');
const localFamilyRoot = path.join(repositoryRoot, 'test/integration/local-family');
const cellFixture = path.join(repositoryRoot, 'test/integration/upgrade-matrix/cell.ts');
const tsSwcCli = path.join(repositoryRoot, 'node_modules/ts-swc-loaders/bin/cli.js');
const candidateIdentity = JSON.parse(readFileSync(path.join(repositoryRoot, 'test/integration/upgrade-matrix/candidate-identity.json'), 'utf8')) as {
  distAggregateSha256: string;
  packageJsonSha256: string;
  sourceAggregateSha256: string;
};
const acceptedIdentities = JSON.parse(readFileSync(path.join(localFamilyRoot, 'accepted.json'), 'utf8')) as {
  orm: {
    artifactManifestSha256: string;
    manifestSha256: string;
    tarballSha256: string;
  };
};
const cells: MatrixCell[] = [
  { kb: 'published-v1', name: 'published-kb--published-orm', orm: 'published-0.7.14' },
  { kb: 'published-v1', name: 'published-kb--accepted-orm', orm: 'accepted-local' },
  { kb: 'candidate', name: 'candidate-kb--published-orm', orm: 'published-0.7.14' },
  { kb: 'candidate', name: 'candidate-kb--accepted-orm', orm: 'accepted-local' },
];
const createdRoots: string[] = [];
let acceptedOrmPayload = '';
let acceptedOrmRoot = '';

function sha256Text(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function aggregate(directory: 'dist' | 'src'): string {
  const lines = listFiles(path.join(repositoryRoot, directory))
    .map((file) => `${sha256File(file)}  ${path.relative(repositoryRoot, file).split(path.sep).join('/')}\n`)
    .join('');
  return sha256Text(lines);
}

function assertHash(file: string, expected: string, label: string): void {
  assert.strictEqual(sha256File(file), expected, `${label} changed`);
}

function expectedArtifactManifest(): TreeEntry[] {
  return readFileSync(path.join(acceptedOrmPayload, 'artifact-sha256.txt'), 'utf8')
    .trim()
    .split('\n')
    .map((line): TreeEntry => {
      const match = /^([a-f0-9]{64}) {2}package\/(.+)$/.exec(line);
      assert.ok(match, `Invalid accepted ORM artifact manifest line: ${line}`);
      return { path: match[2], sha256: match[1] };
    })
    .sort((left, right) => comparePath(left.path, right.path));
}

function assertTreeIdentity(root: string, expected: TreeEntry[], label: string): void {
  const actual = treeManifest(root, { allowedSymlinks: new Set(['node_modules/backbone']) });
  assert.deepStrictEqual(actual, expected, `${label} differs from the accepted ${expected.length}-entry ORM artifact manifest`);
}

function verifyAcceptedInputs(): void {
  assertHash(path.join(repositoryRoot, 'package.json'), candidateIdentity.packageJsonSha256, 'reviewed matrix candidate package.json');
  assert.strictEqual(aggregate('src'), candidateIdentity.sourceAggregateSha256, 'reviewed matrix candidate source aggregate changed');
  assert.strictEqual(aggregate('dist'), candidateIdentity.distAggregateSha256, 'reviewed matrix candidate dist aggregate changed');

  assertHash(path.join(publishedKnockbackRoot, 'package.json'), 'b353cee79086a6a72e6b73c1a5870af59a4f5a787a1032166ea594c5f257865c', 'published Knockback 1.2.3 package.json');
  assertHash(path.join(publishedKnockbackRoot, 'knockback.js'), 'eeeefdca830b95d747ee5c8f1d6c9a26a4702d223ac716f9ffd2f8300d45ba6d', 'published Knockback 1.2.3 entry');
  assertHash(path.join(publishedOrmRoot, 'package.json'), '1709d1353356ab6c4935c429e5ccaec44344380cd10f80ec7065ad44b20c85f7', 'published BackboneORM 0.7.14 package.json');
  assertHash(path.join(publishedOrmRoot, 'backbone-orm.js'), 'e393578d3379e26c20a087672eda57ea5143dfe2d3938e37e37e8e08aa5aca6e', 'published BackboneORM 0.7.14 entry');

  const provenance = JSON.parse(readFileSync(path.join(localFamilyRoot, '.tmp/provenance.json'), 'utf8')) as {
    packages?: Record<string, { tarballSha256?: string }>;
    producers?: {
      orm?: {
        artifactManifestSha256?: string;
        manifestSha256?: string;
        snapshot?: string;
        tarballSha256?: string;
      };
    };
    snapshotRoot?: string;
  };
  const producer = provenance.producers?.orm;
  assert.ok(producer?.snapshot, 'The staged family provenance has no immutable ORM producer root');
  const producerStats = lstatSync(producer.snapshot);
  assert.ok(producerStats.isDirectory() && !producerStats.isSymbolicLink(), 'The immutable ORM producer root must be a directory, not a symlink');
  acceptedOrmPayload = realpathSync(producer.snapshot);
  const allowedOrmParent = realpathSync(path.join(projectRoot, 'backbone-orm/.worktrees/orm-contracts/.tmp/orm-contracts'));
  assert.strictEqual(path.dirname(acceptedOrmPayload), allowedOrmParent, 'The immutable ORM producer is outside its owned payload directory');
  assert.strictEqual(producer.tarballSha256, acceptedIdentities.orm.tarballSha256, 'The staged ORM producer records a different tarball');
  assert.strictEqual(producer.manifestSha256, acceptedIdentities.orm.manifestSha256, 'The staged ORM producer records a different provenance manifest');
  assert.strictEqual(producer.artifactManifestSha256, acceptedIdentities.orm.artifactManifestSha256, 'The staged ORM producer records a different artifact manifest');
  assertHash(path.join(acceptedOrmPayload, 'backbone-orm-0.7.14.tgz'), acceptedIdentities.orm.tarballSha256, 'accepted local ORM tarball');
  assertHash(path.join(acceptedOrmPayload, 'provenance.json'), acceptedIdentities.orm.manifestSha256, 'accepted local ORM producer provenance');
  assertHash(path.join(acceptedOrmPayload, 'artifact-sha256.txt'), acceptedIdentities.orm.artifactManifestSha256, 'accepted local ORM artifact manifest');
  const expected = expectedArtifactManifest();
  assert.strictEqual(expected.length, 412, 'The reviewed staged ORM must contain exactly 412 package files');

  assert.ok(provenance.snapshotRoot, 'The accepted local-family snapshot provenance has no snapshot root');
  const snapshotStats = lstatSync(provenance.snapshotRoot);
  assert.ok(snapshotStats.isDirectory() && !snapshotStats.isSymbolicLink(), 'The staged family snapshot must be a directory, not a symlink');
  const allowedSnapshotParent = realpathSync(path.join(localFamilyRoot, '.tmp/snapshots'));
  const resolvedSnapshot = realpathSync(provenance.snapshotRoot);
  assert.strictEqual(path.dirname(resolvedSnapshot), allowedSnapshotParent, 'The accepted snapshot is outside the local-family snapshot directory');
  assert.strictEqual(provenance.packages?.['backbone-orm']?.tarballSha256, acceptedIdentities.orm.tarballSha256, 'The accepted snapshot records a different ORM tarball');
  acceptedOrmRoot = path.join(resolvedSnapshot, 'packages/orm');
  assertTreeIdentity(acceptedOrmRoot, expected, 'accepted extracted ORM');
}

function copyPackage(sourceName: string, targetRoot: string, ownerRoot = repositoryRoot): void {
  const source = path.join(ownerRoot, 'node_modules', sourceName);
  assert.ok(existsSync(source), `Missing local matrix dependency: ${sourceName}`);
  cpSync(source, targetRoot, { recursive: true });
}

function copyAcceptedOrm(targetRoot: string): void {
  cpSync(acceptedOrmRoot, targetRoot, {
    filter(source) {
      const relative = path.relative(acceptedOrmRoot, source);
      return relative !== 'node_modules' && !relative.startsWith(`node_modules${path.sep}`);
    },
    recursive: true,
  });
  assertTreeIdentity(targetRoot, expectedArtifactManifest(), 'staged accepted ORM');
}

function stageAcceptedOrmProviders(root: string): void {
  const providers: Array<{ name: string; version: string; dependencies: Record<string, string> }> = [
    { name: 'inflection', version: '1.8.0', dependencies: {} },
    { name: 'lru-cache', version: '4.0.0', dependencies: { pseudomap: '^1.0.1', yallist: '^2.0.0' } },
    { name: 'pseudomap', version: '1.0.2', dependencies: {} },
    { name: 'yallist', version: '2.1.2', dependencies: {} },
  ];
  const familyRequire = createRequire(path.join(localFamilyRoot, 'package.json'));
  const nodeModules = path.join(root, 'node_modules');
  for (const provider of providers) {
    const source = path.join(localFamilyRoot, 'node_modules', provider.name);
    const sourceStats = lstatSync(source);
    assert.ok(sourceStats.isDirectory() && !sourceStats.isSymbolicLink(), `Expected a private installed ${provider.name} directory`);
    assert.strictEqual(realpathSync(source), source, `${provider.name} escaped its private fixture owner`);
    assert.strictEqual(realpathSync(path.dirname(familyRequire.resolve(`${provider.name}/package.json`))), source, `${provider.name} resolves outside its private fixture owner`);
    assert.ok(realpathSync(familyRequire.resolve(provider.name)).startsWith(`${source}${path.sep}`), `${provider.name} executable entry escaped its private fixture owner`);
    const manifest = JSON.parse(readFileSync(path.join(source, 'package.json'), 'utf8')) as { name: string; version: string; dependencies?: Record<string, string> };
    assert.strictEqual(manifest.name, provider.name, 'Wrong ORM runtime provider name');
    assert.strictEqual(manifest.version, provider.version, `Wrong ${provider.name} ORM runtime provider version`);
    assert.deepStrictEqual(manifest.dependencies ?? {}, provider.dependencies, `Unexpected ${provider.name} runtime dependency closure`);
    const expected = treeManifest(source);
    const target = path.join(nodeModules, provider.name);
    copyPackage(provider.name, target, localFamilyRoot);
    assert.deepStrictEqual(treeManifest(target), expected, `Staged ${provider.name} runtime provider bytes differ`);
  }
  const ormRequire = createRequire(path.join(nodeModules, 'backbone-orm/package.json'));
  const cellRequire = createRequire(path.join(root, 'package.json'));
  const sourceLruRequire = createRequire(path.join(localFamilyRoot, 'node_modules/lru-cache/package.json'));
  const stagedLruRequire = createRequire(path.join(nodeModules, 'lru-cache/package.json'));
  for (const provider of providers) {
    const target = path.join(nodeModules, provider.name);
    assert.strictEqual(realpathSync(path.dirname(ormRequire.resolve(`${provider.name}/package.json`))), target, `${provider.name} resolves outside the staged cell`);
    assert.ok(realpathSync(ormRequire.resolve(provider.name)).startsWith(`${target}${path.sep}`), `${provider.name} executable entry escaped the staged cell`);
    if (provider.name === 'pseudomap' || provider.name === 'yallist') {
      assert.strictEqual(realpathSync(path.dirname(sourceLruRequire.resolve(`${provider.name}/package.json`))), path.join(localFamilyRoot, 'node_modules', provider.name), `Installed lru-cache resolves a foreign ${provider.name}`);
      assert.strictEqual(realpathSync(path.dirname(stagedLruRequire.resolve(`${provider.name}/package.json`))), target, `Staged lru-cache resolves a foreign ${provider.name}`);
      assert.ok(realpathSync(sourceLruRequire.resolve(provider.name)).startsWith(`${path.join(localFamilyRoot, 'node_modules', provider.name)}${path.sep}`), `Installed lru-cache resolves a foreign ${provider.name} entry`);
      assert.ok(realpathSync(stagedLruRequire.resolve(provider.name)).startsWith(`${target}${path.sep}`), `Staged lru-cache resolves a foreign ${provider.name} entry`);
    }
  }
  for (const peer of ['backbone', 'underscore']) assert.strictEqual(ormRequire.resolve(peer), cellRequire.resolve(peer), `ORM does not resolve the cell ${peer}`);
}

function stageCell(cell: MatrixCell, fixtureRoot: string): string {
  const root = path.join(fixtureRoot, cell.name);
  const nodeModules = path.join(root, 'node_modules');
  mkdirSync(nodeModules, { recursive: true });
  writeFileSync(path.join(root, 'package.json'), `${JSON.stringify({ name: cell.name, private: true }, null, 2)}\n`);
  writeFileSync(path.join(root, 'case.json'), `${JSON.stringify(cell, null, 2)}\n`);

  for (const dependency of ['backbone', 'knockout', 'underscore']) copyPackage(dependency, path.join(nodeModules, dependency));

  const knockbackName = cell.kb === 'candidate' ? '@mcpeasy/knockback' : 'knockback';
  const knockbackRoot = path.join(nodeModules, ...knockbackName.split('/'));
  mkdirSync(knockbackRoot, { recursive: true });
  if (cell.kb === 'candidate') {
    cpSync(path.join(repositoryRoot, 'package.json'), path.join(knockbackRoot, 'package.json'));
    cpSync(path.join(repositoryRoot, 'dist'), path.join(knockbackRoot, 'dist'), { recursive: true });
  } else {
    cpSync(path.join(publishedKnockbackRoot, 'package.json'), path.join(knockbackRoot, 'package.json'));
    cpSync(path.join(publishedKnockbackRoot, 'knockback.js'), path.join(knockbackRoot, 'knockback.js'));
  }

  const ormRoot = path.join(nodeModules, 'backbone-orm');
  mkdirSync(ormRoot, { recursive: true });
  if (cell.orm === 'accepted-local') {
    copyAcceptedOrm(ormRoot);
    stageAcceptedOrmProviders(root);
  } else {
    cpSync(path.join(publishedOrmRoot, 'package.json'), path.join(ormRoot, 'package.json'));
    cpSync(path.join(publishedOrmRoot, 'backbone-orm.js'), path.join(ormRoot, 'backbone-orm.js'));
  }
  return root;
}

async function runCell(cell: MatrixCell, root: string): Promise<CellObservation> {
  const { stdout } = await runOwnedProcess(process.execPath, [tsSwcCli, process.execPath, cellFixture, root], {
    cwd: repositoryRoot,
    label: `Upgrade matrix cell ${cell.name}`,
    timeoutMs: 30_000,
  });
  const prefix = 'UPGRADE_MATRIX_RESULT ';
  const resultLine = stdout
    .trim()
    .split('\n')
    .reverse()
    .find((line) => line.startsWith(prefix));
  assert.ok(resultLine, `${cell.name} did not report a matrix result:\n${stdout}`);
  return JSON.parse(resultLine.slice(prefix.length)) as CellObservation;
}

const intendedObservation: RuntimeObservation = {
  cleanup: { childListenersRestored: true, parentListenersRestored: true, released: true },
  emptyAfterSave: {
    directChildren: [],
    directChildrenIdentity: true,
    directChildrenType: 'collection',
    directPrimary: null,
    directPrimaryIdentity: true,
    directPrimaryType: 'model',
    viewChildren: [],
    viewChildrenIdentity: true,
    viewChildrenType: 'collection',
    viewPrimary: null,
    viewPrimaryIdentity: true,
    viewPrimaryType: 'model',
  },
  firstAfterSave: {
    directChildren: ['first'],
    directChildrenIdentity: true,
    directChildrenType: 'collection',
    directPrimary: 'first',
    directPrimaryIdentity: true,
    directPrimaryType: 'model',
    viewChildren: ['first'],
    viewChildrenIdentity: true,
    viewChildrenType: 'collection',
    viewPrimary: 'first',
    viewPrimaryIdentity: true,
    viewPrimaryType: 'model',
  },
  initial: {
    directChildren: [],
    directChildrenIdentity: true,
    directChildrenType: 'collection',
    directPrimary: null,
    directPrimaryIdentity: true,
    directPrimaryType: 'model',
    viewChildren: [],
    viewChildrenIdentity: true,
    viewChildrenType: 'collection',
    viewPrimary: null,
    viewPrimaryIdentity: true,
    viewPrimaryType: 'model',
  },
  kind: 'success',
  secondAfterSave: {
    directChildren: ['second'],
    directChildrenIdentity: true,
    directChildrenType: 'collection',
    directPrimary: 'second',
    directPrimaryIdentity: true,
    directPrimaryType: 'model',
    viewChildren: ['second'],
    viewChildrenIdentity: true,
    viewChildrenType: 'collection',
    viewPrimary: 'second',
    viewPrimaryIdentity: true,
    viewPrimaryType: 'model',
  },
};

const publishedV1Observation: HistoricalObservation = {
  cleanup: { childListenersRestored: true, parentListenersRestored: true, released: true },
  error: "TypeError: Cannot read properties of null (reading 'value')",
  firstAfterSave: intendedObservation.firstAfterSave,
  initial: { ...intendedObservation.initial, directPrimaryType: 1, viewPrimaryType: 1 },
  kind: 'published-v1-defect',
  phase: 'second relation mutation',
};

describe('published/current Knockback and BackboneORM upgrade matrix', () => {
  let roots = new Map<string, string>();

  before(() => {
    verifyAcceptedInputs();
    const fixtureParent = path.join(repositoryRoot, '.tmp');
    mkdirSync(fixtureParent, { recursive: true });
    const fixtureRoot = mkdtempSync(path.join(fixtureParent, 'upgrade-matrix-'));
    createdRoots.push(fixtureRoot);
    roots = new Map(cells.map((cell) => [cell.name, stageCell(cell, fixtureRoot)]));
  });

  after(() => {
    for (const root of createdRoots.splice(0)) safeRmSync(root, { force: true, recursive: true });
  });

  for (const cell of cells) {
    it(cell.name, async () => {
      const root = roots.get(cell.name);
      assert.ok(root, `Missing staged root for ${cell.name}`);
      const observation = await runCell(cell, root);
      assert.deepStrictEqual(observation, cell.kb === 'candidate' ? intendedObservation : publishedV1Observation);
    });
  }
});
