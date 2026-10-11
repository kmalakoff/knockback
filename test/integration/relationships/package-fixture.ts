import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import assert from 'assert';
import { safeRmSync } from 'fs-remove-compat';
import { CORE_PEER_VERSIONS, type CorePeerCombination, RELATIONSHIP_VERSIONS } from './cases.ts';
import { runOwnedProcess } from './process.ts';

const EXACT_PACKAGES = {
  'backbone-associations': RELATIONSHIP_VERSIONS.associations,
  'backbone-orm': RELATIONSHIP_VERSIONS.orm,
  'backbone-relational': RELATIONSHIP_VERSIONS.relational,
  underscore: CORE_PEER_VERSIONS.underscore,
} as const;

type ArtifactEntry = [file: string, hash: string];

interface ModelRefArtifact {
  archive: string;
  root: string;
}

const modelRefManifestPath = 'test/integration/package-types/modelref-artifacts.sha256';
const modelRefArtifactRoots: string[] = [];
let modelRefArtifactPromise: Promise<ModelRefArtifact> | undefined;

function hash(file: string): string {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function artifactManifest(root: string): ArtifactEntry[] {
  const entries: ArtifactEntry[] = [];

  function visit(directory: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (directory === root && entry.name !== 'dist') continue;
        if (entry.name !== '.ts-swc-transform-temp') visit(file);
        continue;
      }
      const relative = path.relative(root, file).split(path.sep).join('/');
      if (relative !== 'package.json' && (!relative.startsWith('dist/') || !/(?:package\.json|\.(?:c?js|d\.cts|d\.ts))$/.test(relative))) continue;
      entries.push([relative, hash(file)]);
    }
  }

  visit(root);
  return entries;
}

function readExpectedManifest(repoRoot: string): ArtifactEntry[] {
  return readFileSync(path.join(repoRoot, modelRefManifestPath), 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line): ArtifactEntry => {
      const separator = line.indexOf('  ');
      assert.ok(separator > 0, `Malformed ModelRef artifact manifest line: ${line}`);
      return [line.slice(separator + 2), line.slice(0, separator)];
    })
    .sort((left, right) => left[0].localeCompare(right[0]));
}

function assertModelRefPayload(root: string, expected: ArtifactEntry[]): void {
  assert.deepStrictEqual(
    artifactManifest(root).sort((left, right) => left[0].localeCompare(right[0])),
    expected,
    `ModelRef payload differs from ${modelRefManifestPath}`
  );
}

function npmEnvironment(repoRoot: string): NodeJS.ProcessEnv {
  return {
    ...process.env,
    npm_config_cache: path.join(repoRoot, '.tmp/npm-cache'),
    npm_config_tmp: path.join(repoRoot, '.tmp/npm-tmp'),
  };
}

async function coldVerifyModelRef(repoRoot: string, fixtureParent: string, archive: string, expected: ArtifactEntry[]): Promise<void> {
  const root = mkdtempSync(path.join(fixtureParent, 'core-peer-modelref-cold-'));
  modelRefArtifactRoots.push(root);
  try {
    writeFileSync(path.join(root, 'package.json'), `${JSON.stringify({ name: 'core-peer-modelref-cold', private: true, dependencies: { 'backbone-modelref': `file:${archive}` } }, null, 2)}\n`);
    await runOwnedProcess(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false', '--install-strategy=hoisted'], {
      cwd: root,
      env: npmEnvironment(repoRoot),
      label: 'ModelRef cold install',
      timeoutMs: 120_000,
    });
    assertModelRefPayload(path.join(root, 'node_modules/backbone-modelref'), expected);
  } finally {
    safeRmSync(root, { recursive: true, force: true });
    const index = modelRefArtifactRoots.indexOf(root);
    if (index >= 0) modelRefArtifactRoots.splice(index, 1);
  }
}

async function packModelRef(repoRoot: string, sourceRoot: string, artifactRoot: string, label: string): Promise<string> {
  const result = await runOwnedProcess(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['pack', sourceRoot, '--pack-destination', artifactRoot, '--ignore-scripts'], {
    cwd: repoRoot,
    env: npmEnvironment(repoRoot),
    label,
    timeoutMs: 120_000,
  });
  const archives = readdirSync(artifactRoot).filter((entry) => entry.endsWith('.tgz'));
  assert.strictEqual(archives.length, 1, `${label} did not produce exactly one archive: ${result.stdout}`);
  return path.join(artifactRoot, archives[0]);
}

async function createModelRefArtifact(repoRoot: string, fixtureParent: string): Promise<ModelRefArtifact> {
  const expected = readExpectedManifest(repoRoot);
  const installedRoot = path.join(repoRoot, 'node_modules/backbone-modelref');
  assert.ok(existsSync(installedRoot), 'Missing installed ModelRef package');
  assertModelRefPayload(installedRoot, expected);

  const root = mkdtempSync(path.join(fixtureParent, 'core-peer-modelref-artifact-'));
  modelRefArtifactRoots.push(root);
  try {
    const archiveRoot = path.join(root, 'archives');
    mkdirSync(archiveRoot);
    const archive = await packModelRef(repoRoot, installedRoot, archiveRoot, 'ModelRef artifact pack');
    await coldVerifyModelRef(repoRoot, fixtureParent, archive, expected);

    const alteredSource = path.join(root, 'altered-source');
    cpSync(installedRoot, alteredSource, { recursive: true });
    const installedVersion = (JSON.parse(readFileSync(path.join(installedRoot, 'package.json'), 'utf8')) as { version: string }).version;
    const alteredVersion = (JSON.parse(readFileSync(path.join(alteredSource, 'package.json'), 'utf8')) as { version: string }).version;
    assert.strictEqual(alteredVersion, installedVersion, 'Altered ModelRef fixture must retain the installed package version');
    const alteredFile = path.join(alteredSource, 'dist/cjs/index.js');
    writeFileSync(alteredFile, `${readFileSync(alteredFile, 'utf8')}\n// same-version alteration\n`);
    const alteredArchiveRoot = path.join(root, 'altered-archives');
    mkdirSync(alteredArchiveRoot);
    const alteredArchive = await packModelRef(repoRoot, alteredSource, alteredArchiveRoot, 'Altered ModelRef artifact pack');
    await assert.rejects(coldVerifyModelRef(repoRoot, fixtureParent, alteredArchive, expected), /ModelRef payload differs/);
    return { archive, root };
  } catch (error) {
    safeRmSync(root, { recursive: true, force: true });
    const index = modelRefArtifactRoots.indexOf(root);
    if (index >= 0) modelRefArtifactRoots.splice(index, 1);
    throw error;
  }
}

async function modelRefArtifact(repoRoot: string, fixtureParent: string): Promise<ModelRefArtifact> {
  modelRefArtifactPromise ||= createModelRefArtifact(repoRoot, fixtureParent);
  return modelRefArtifactPromise;
}

export function cleanupCorePeerArtifacts(): void {
  for (const root of [...modelRefArtifactRoots]) safeRmSync(root, { recursive: true, force: true });
  modelRefArtifactRoots.length = 0;
}

function packageVersion(root: string, packageName: string): string {
  return (JSON.parse(readFileSync(path.join(root, 'node_modules', packageName, 'package.json'), 'utf8')) as { version: string }).version;
}

function assertSharedBackbone(root: string): void {
  const fixtureRequire = createRequire(path.join(root, 'package.json'));
  const backbonePath = realpathSync(fixtureRequire.resolve('backbone'));
  for (const packageName of ['@mcpeasy/knockback', 'backbone-associations', 'backbone-modelref', 'backbone-orm', 'backbone-relational']) {
    const packageRequire = createRequire(path.join(root, 'node_modules', packageName, 'package.json'));
    assert.strictEqual(realpathSync(packageRequire.resolve('backbone')), backbonePath, `${packageName} must resolve the cell's shared Backbone`);
  }
}

function stageCandidate(repoRoot: string, root: string): void {
  const target = path.join(root, 'node_modules/@mcpeasy/knockback');
  mkdirSync(target, { recursive: true });
  cpSync(path.join(repoRoot, 'package.json'), path.join(target, 'package.json'));
  cpSync(path.join(repoRoot, 'dist'), path.join(target, 'dist'), {
    recursive: true,
  });
}

export async function prepareCorePeerPackageFixture(repoRoot: string, fixtureParent: string, testCase: CorePeerCombination): Promise<string> {
  const modelRef = await modelRefArtifact(repoRoot, fixtureParent);
  assert.ok(existsSync(path.join(repoRoot, 'dist/cjs/index.js')), 'Build the local Knockback candidate before the core peer matrix');

  mkdirSync(fixtureParent, { recursive: true });
  const root = mkdtempSync(path.join(fixtureParent, `${testCase.name}-`));
  const dependencies = {
    ...EXACT_PACKAGES,
    backbone: testCase.backboneVersion,
    'backbone-modelref': `file:${modelRef.archive}`,
    knockout: testCase.knockoutVersion,
  };
  writeFileSync(path.join(root, 'package.json'), `${JSON.stringify({ name: testCase.name, private: true, dependencies }, null, 2)}\n`);

  try {
    await runOwnedProcess(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false', '--install-strategy=hoisted'], {
      cwd: root,
      env: npmEnvironment(repoRoot),
      label: `Core peer install ${testCase.name}`,
      timeoutMs: 120_000,
    });

    stageCandidate(repoRoot, root);
    assert.strictEqual(packageVersion(root, 'backbone'), testCase.backboneVersion);
    assert.strictEqual(packageVersion(root, 'knockout'), testCase.knockoutVersion);
    assert.strictEqual(packageVersion(root, 'underscore'), CORE_PEER_VERSIONS.underscore);
    assertModelRefPayload(path.join(root, 'node_modules/backbone-modelref'), readExpectedManifest(repoRoot));
    assert.strictEqual(packageVersion(root, 'backbone-relational'), RELATIONSHIP_VERSIONS.relational);
    assert.strictEqual(packageVersion(root, 'backbone-associations'), RELATIONSHIP_VERSIONS.associations);
    assert.strictEqual(packageVersion(root, 'backbone-orm'), RELATIONSHIP_VERSIONS.orm);
    assertSharedBackbone(root);
    return root;
  } catch (error) {
    safeRmSync(root, { recursive: true, force: true });
    throw error;
  }
}
