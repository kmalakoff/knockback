import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import assert from 'assert';
import { safeRmSync } from 'fs-remove-compat';
import { assertModelRefPayload, captureCurrentModelRefPackage, type ModelRefPackageExpectation } from '../../lib/current-modelref-package.ts';
import { CORE_PEER_VERSIONS, type CorePeerCombination, RELATIONSHIP_VERSIONS } from './cases.ts';
import { runOwnedProcess } from './process.ts';

const EXACT_PACKAGES = {
  'backbone-associations': RELATIONSHIP_VERSIONS.associations,
  'backbone-relational': RELATIONSHIP_VERSIONS.relational,
  underscore: CORE_PEER_VERSIONS.underscore,
} as const;

const ACCEPTED_ORM_FILES = {
  'backbone-orm.js': '967b374060b69d5e4067f3193885f3ef3cd115217ec71a63587598e7fa4c7ea7',
  'dist/cjs/index.js': '1c8655de7ad84597603675085587e392b9289fe176cf369127d21c739d74d5ed',
  'dist/esm/browser.js': 'd297c9e80c34b66fd9e89fb1003c97514c484845c0828d430f767374c694b645',
  'dist/esm/index.js': '6044cddf40c20577ca1bf252d5a70b7e89572d6f04e7a23b71f0583acdc7554d',
  'package.json': '721d34d267e0e920c4fe9e48e18ead07cb26f5c64936fe6d98c9adf763a80f36',
} as const;

interface ModelRefArtifact {
  archive: string;
  root: string;
}

interface CurrentModelRefArtifact extends ModelRefArtifact {
  expectation: ModelRefPackageExpectation;
}

const modelRefArtifactRoots: string[] = [];
let modelRefArtifactPromise: Promise<CurrentModelRefArtifact> | undefined;
let ormArtifactPromise: Promise<ModelRefArtifact> | undefined;

function hash(file: string): string {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function assertAcceptedOrmPayload(root: string): void {
  for (const [relativePath, expected] of Object.entries(ACCEPTED_ORM_FILES)) assert.strictEqual(hash(path.join(root, relativePath)), expected, `BackboneORM accepted payload changed: ${relativePath}`);
  const packageRequire = createRequire(path.join(root, 'package.json'));
  assert.strictEqual(realpathSync(packageRequire.resolve('backbone-orm/browser')), realpathSync(path.join(root, 'dist/esm/browser.js')));
  assert.strictEqual(realpathSync(packageRequire.resolve('backbone-orm/umd')), realpathSync(path.join(root, 'backbone-orm.js')));
}

function npmEnvironment(repoRoot: string): NodeJS.ProcessEnv {
  return {
    ...process.env,
    npm_config_cache: path.join(repoRoot, '.tmp/npm-cache'),
    npm_config_tmp: path.join(repoRoot, '.tmp/npm-tmp'),
  };
}

async function coldVerifyModelRef(repoRoot: string, fixtureParent: string, archive: string, expected: ModelRefPackageExpectation): Promise<void> {
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

async function packPackage(repoRoot: string, sourceRoot: string, artifactRoot: string, label: string): Promise<string> {
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

async function createModelRefArtifact(repoRoot: string, fixtureParent: string): Promise<CurrentModelRefArtifact> {
  const { installedRoot, expectation } = captureCurrentModelRefPackage(repoRoot);

  const root = mkdtempSync(path.join(fixtureParent, 'core-peer-modelref-artifact-'));
  modelRefArtifactRoots.push(root);
  try {
    const archiveRoot = path.join(root, 'archives');
    mkdirSync(archiveRoot);
    const archive = await packPackage(repoRoot, installedRoot, archiveRoot, 'ModelRef artifact pack');
    await coldVerifyModelRef(repoRoot, fixtureParent, archive, expectation);

    const alteredSource = path.join(root, 'altered-source');
    cpSync(installedRoot, alteredSource, { recursive: true });
    const installedVersion = (JSON.parse(readFileSync(path.join(installedRoot, 'package.json'), 'utf8')) as { version: string }).version;
    const alteredVersion = (JSON.parse(readFileSync(path.join(alteredSource, 'package.json'), 'utf8')) as { version: string }).version;
    assert.strictEqual(alteredVersion, installedVersion, 'Altered ModelRef fixture must retain the installed package version');
    const alteredFile = path.join(alteredSource, 'dist/cjs/index.js');
    writeFileSync(alteredFile, `${readFileSync(alteredFile, 'utf8')}\n// same-version alteration\n`);
    const alteredArchiveRoot = path.join(root, 'altered-archives');
    mkdirSync(alteredArchiveRoot);
    const alteredArchive = await packPackage(repoRoot, alteredSource, alteredArchiveRoot, 'Altered ModelRef artifact pack');
    await assert.rejects(coldVerifyModelRef(repoRoot, fixtureParent, alteredArchive, expectation), /ModelRef payload differs/);
    return { archive, root, expectation };
  } catch (error) {
    safeRmSync(root, { recursive: true, force: true });
    const index = modelRefArtifactRoots.indexOf(root);
    if (index >= 0) modelRefArtifactRoots.splice(index, 1);
    throw error;
  }
}

async function modelRefArtifact(repoRoot: string, fixtureParent: string): Promise<CurrentModelRefArtifact> {
  modelRefArtifactPromise ||= createModelRefArtifact(repoRoot, fixtureParent);
  return modelRefArtifactPromise;
}

async function createOrmArtifact(repoRoot: string, fixtureParent: string): Promise<ModelRefArtifact> {
  const installedRoot = path.join(repoRoot, 'node_modules/backbone-orm');
  assertAcceptedOrmPayload(installedRoot);
  const root = mkdtempSync(path.join(fixtureParent, 'core-peer-orm-artifact-'));
  modelRefArtifactRoots.push(root);
  try {
    const archiveRoot = path.join(root, 'archives');
    mkdirSync(archiveRoot);
    return { archive: await packPackage(repoRoot, installedRoot, archiveRoot, 'BackboneORM artifact pack'), root };
  } catch (error) {
    safeRmSync(root, { recursive: true, force: true });
    const index = modelRefArtifactRoots.indexOf(root);
    if (index >= 0) modelRefArtifactRoots.splice(index, 1);
    throw error;
  }
}

async function ormArtifact(repoRoot: string, fixtureParent: string): Promise<ModelRefArtifact> {
  ormArtifactPromise ||= createOrmArtifact(repoRoot, fixtureParent);
  return ormArtifactPromise;
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
  const orm = await ormArtifact(repoRoot, fixtureParent);
  assert.ok(existsSync(path.join(repoRoot, 'dist/cjs/index.js')), 'Build the local Knockback candidate before the core peer matrix');

  mkdirSync(fixtureParent, { recursive: true });
  const root = mkdtempSync(path.join(fixtureParent, `${testCase.name}-`));
  const dependencies = {
    ...EXACT_PACKAGES,
    backbone: testCase.backboneVersion,
    'backbone-modelref': `file:${modelRef.archive}`,
    'backbone-orm': `file:${orm.archive}`,
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
    assertModelRefPayload(path.join(root, 'node_modules/backbone-modelref'), modelRef.expectation);
    assert.strictEqual(packageVersion(root, 'backbone-relational'), RELATIONSHIP_VERSIONS.relational);
    assert.strictEqual(packageVersion(root, 'backbone-associations'), RELATIONSHIP_VERSIONS.associations);
    assert.strictEqual(packageVersion(root, 'backbone-orm'), RELATIONSHIP_VERSIONS.orm);
    assertAcceptedOrmPayload(path.join(root, 'node_modules/backbone-orm'));
    assertSharedBackbone(root);
    return root;
  } catch (error) {
    safeRmSync(root, { recursive: true, force: true });
    throw error;
  }
}
