import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, symlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'assert';
import { safeRmSync } from 'fs-remove-compat';
import { runCommand } from 'ts-dev-stack';
import { captureCurrentModelRefPackage } from '../../lib/current-modelref-package.ts';

interface PackageManifest {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  name?: string;
  version?: string;
  exports?: unknown;
  main?: string;
  source?: string;
  tsds?: {
    commands?: Record<string, string | null>;
    targets?: string[];
  };
  types?: string;
}

type ArtifactEntry = [file: string, hash: string];

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const fixtureSource = path.dirname(fileURLToPath(import.meta.url));
const fixtureParent = path.join(repoRoot, '.tmp');
const packageName = '@mcpeasy/knockback';
const fixtures: string[] = [];
const independentIntegrationRoots = new Set(['local-family', 'v1-compatibility']);
const fullGraphSharedLeaves = ['integration/local-family/scripts/lib/immutable-tree.ts', 'integration/local-family/scripts/process.ts', 'integration/local-family/test/lib/mongo.ts', 'integration/local-family/test/lib/postgres.ts'];
const fullGraphServiceDependencies = ['fs-remove-compat', 'mongodb', 'knex', 'pg'];

function isOwnerTestPath(testRoot: string, file: string): boolean {
  const [first, second] = path.relative(testRoot, file).split(path.sep);
  return first !== 'integration' || !second || !independentIntegrationRoots.has(second);
}

function hash(file: string): string {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function readPackage(root: string): PackageManifest {
  return JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')) as PackageManifest;
}

function artifactManifest(root: string, includeRootTypes = false): ArtifactEntry[] {
  const entries: ArtifactEntry[] = [];

  function visit(directory: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (directory === root && entry.name !== 'dist' && (!includeRootTypes || entry.name !== 'types')) continue;
        if (entry.name !== '.ts-swc-transform-temp') visit(file);
        continue;
      }
      const relative = path.relative(root, file).split(path.sep).join('/');
      if (relative !== 'package.json' && (!relative.startsWith('dist/') || !/(?:package\.json|\.(?:c?js|d\.cts|d\.ts))$/.test(relative)) && (!includeRootTypes || !relative.startsWith('types/') || !/\.d\.(?:c)?ts$/.test(relative))) continue;
      entries.push([relative, hash(file)]);
    }
  }

  visit(root);
  return entries;
}

function requiredPackagePaths(manifest: PackageManifest): string[] {
  const required = new Set<string>();
  if (manifest.main) required.add(manifest.main);
  if (manifest.types) required.add(manifest.types);

  function collect(value: unknown): void {
    if (typeof value === 'string') {
      required.add(value);
      return;
    }
    if (!value || typeof value !== 'object') return;
    for (const nested of Object.values(value)) collect(nested);
  }

  collect(manifest.exports);
  return [...required].map((file) => file.replace(/^\.\//, '')).sort();
}

function linkDependency(nodeModules: string, name: string, ownerRoot = repoRoot): void {
  const source = path.join(ownerRoot, 'node_modules', name);
  if (!existsSync(source)) throw new Error(`Missing type-test dependency: ${name}`);
  const target = path.join(nodeModules, name);
  mkdirSync(path.dirname(target), { recursive: true });
  symlinkSync(source, target, process.platform === 'win32' ? 'junction' : 'dir');
  assert.strictEqual(realpathSync(target), realpathSync(source), `Linked type-test dependency differs from its exact owner: ${name}`);
}

function stagePackage(nodeModules: string): void {
  const packageManifest = readPackage(repoRoot);
  assert.strictEqual(packageManifest.dependencies?.['@types/backbone'], '*', 'Published Backbone declarations require @types/backbone as a package dependency');
  const target = path.join(nodeModules, packageName);
  mkdirSync(target, { recursive: true });
  cpSync(path.join(repoRoot, 'package.json'), path.join(target, 'package.json'));
  cpSync(path.join(repoRoot, 'dist'), path.join(target, 'dist'), { recursive: true });

  const sourceManifest = artifactManifest(repoRoot);
  const installedManifest = artifactManifest(target);
  assert.ok(
    sourceManifest.some(([file]) => /\.d\.(?:c)?ts$/.test(file)),
    'Fresh package has no declarations'
  );
  assert.ok(
    sourceManifest.some(([file]) => /\.(?:c?js)$/.test(file)),
    'Fresh package has no executable artifacts'
  );
  assert.deepStrictEqual(installedManifest, sourceManifest, 'Installed type-test package differs from the fresh build');

  for (const file of requiredPackagePaths(packageManifest)) {
    const source = path.join(repoRoot, file);
    const installed = path.join(target, file);
    assert.ok(existsSync(source), `Fresh package target is missing: ${file}`);
    assert.strictEqual(hash(installed), hash(source), `Installed package target differs: ${file}`);
  }
}

function prepareFixture(name: string, config: string): string {
  const root = mkdtempSync(path.join(fixtureParent, `type-${name}-`));
  fixtures.push(root);
  const configRoot = path.join(fixtureSource, 'fixtures', config);
  cpSync(path.join(configRoot, 'package.json'), path.join(root, 'package.json'));
  cpSync(path.join(configRoot, 'tsconfig.json'), path.join(root, 'tsconfig.json'));

  const nodeModules = path.join(root, 'node_modules');
  mkdirSync(nodeModules);
  for (const dependency of ['@types', 'backbone', 'backbone-modelref', 'backbone-orm', 'backbone-relational', 'knockout', 'tsds-config', 'underscore']) {
    linkDependency(nodeModules, dependency);
  }
  stagePackage(nodeModules);

  const requireFromFixture = createRequire(path.join(root, 'package.json'));
  assert.strictEqual(realpathSync(requireFromFixture.resolve(packageName)), realpathSync(path.join(nodeModules, packageName, 'dist/cjs/index.js')));
  assert.strictEqual(realpathSync(requireFromFixture.resolve(`${packageName}/package.json`)), realpathSync(path.join(nodeModules, packageName, 'package.json')));
  return root;
}

function prepareConsumer(name: string, config: string, sourceDirectory = 'consumers'): string {
  const root = prepareFixture(name, config);
  cpSync(path.join(fixtureSource, sourceDirectory), path.join(root, 'src'), { recursive: true });
  return root;
}

function testFiles(root: string): string[] {
  const files: string[] = [];

  function visit(directory: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (isOwnerTestPath(root, file)) visit(file);
      } else if (entry.name.endsWith('.test.ts')) {
        files.push(path.relative(root, file).split(path.sep).join('/'));
      }
    }
  }

  visit(root);
  return files;
}

function prepareFullGraph(target: 'cjs' | 'esm'): string {
  const root = prepareFixture(`full-${target}`, `full-${target}`);
  cpSync(path.join(repoRoot, 'src'), path.join(root, 'src'), { recursive: true });
  const testRoot = path.join(repoRoot, 'test');
  const stagedTestRoot = path.join(root, 'test');
  cpSync(testRoot, stagedTestRoot, { recursive: true, filter: (file) => isOwnerTestPath(testRoot, file) });
  for (const leaf of fullGraphSharedLeaves) {
    const sharedLeafSource = path.join(testRoot, leaf);
    const sharedLeafTarget = path.join(stagedTestRoot, leaf);
    mkdirSync(path.dirname(sharedLeafTarget), { recursive: true });
    cpSync(sharedLeafSource, sharedLeafTarget);
    assert.strictEqual(hash(sharedLeafTarget), hash(sharedLeafSource), `Staged shared test helper differs: ${leaf}`);
    console.log(`[typecheck shared helper] ${leaf} SHA256 ${hash(sharedLeafTarget)}`);
  }
  const localFamilyRoot = path.join(testRoot, 'integration/local-family');
  const serviceNodeModules = path.join(stagedTestRoot, 'integration/local-family/node_modules');
  const familyManifest = readPackage(localFamilyRoot);
  mkdirSync(serviceNodeModules, { recursive: true });
  for (const dependency of fullGraphServiceDependencies) {
    linkDependency(serviceNodeModules, dependency, localFamilyRoot);
    const target = path.join(serviceNodeModules, dependency);
    const provider = readPackage(target);
    assert.strictEqual(provider.name, dependency, `Staged service type dependency has the wrong package identity: ${dependency}`);
    assert.strictEqual(provider.version, familyManifest.dependencies?.[dependency] ?? familyManifest.devDependencies?.[dependency], `Staged service type dependency differs from the existing exact fixture pin: ${dependency}`);
    console.log(`[typecheck service provider] ${dependency}@${provider.version} ${realpathSync(target)}`);
  }
  cpSync(path.join(repoRoot, 'types'), path.join(root, 'types'), { recursive: true });

  const ownerTests = testFiles(testRoot);
  assert.ok(
    ownerTests.some((file) => file.startsWith('unit/')),
    'Complete-test graph has no unit tests'
  );
  assert.ok(
    ownerTests.some((file) => file.startsWith('integration/')),
    'Complete-test graph has no integration tests'
  );

  const entry = path.join(root, 'typecheck', 'all-tests.ts');
  mkdirSync(path.dirname(entry), { recursive: true });
  const imports = ownerTests.map((file) => `import ${JSON.stringify(`../test/${file}`)};`).join('\n');
  writeFileSync(entry, `/// <reference path="../types/backbone-orm.d.ts" />\n\n${imports}\n`);
  console.log(`Complete ${target.toUpperCase()} graph includes ${ownerTests.length} owner tests.`);
  return root;
}

function buildConfig(root: string): PackageManifest['tsds'] & { source?: string } {
  const fixturePackage = readPackage(root);
  const rootPackage = readPackage(repoRoot);
  return {
    ...fixturePackage.tsds,
    ...(fixturePackage.source ? { source: fixturePackage.source } : {}),
    ...(rootPackage.tsds?.commands ? { commands: rootPackage.tsds.commands } : {}),
  };
}

function build(root: string, label: string): Promise<void> {
  console.log(`\n[typecheck] ${label}`);
  return new Promise((resolve, reject) => {
    runCommand('build', [], { config: buildConfig(root), cwd: root }, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

try {
  mkdirSync(fixtureParent, { recursive: true });
  captureCurrentModelRefPackage(repoRoot);

  await build(prepareFullGraph('cjs'), 'complete owner graph, CJS');
  await build(prepareFullGraph('esm'), 'complete owner graph, ESM');
  await build(prepareConsumer('cjs', 'cjs'), 'package consumer, CJS');
  await build(prepareConsumer('esm', 'esm'), 'package consumer, ESM');
  await build(prepareConsumer('nodenext-esm', 'nodenext-esm'), 'package consumer, NodeNext ESM');
  await build(prepareConsumer('node16-cjs', 'node16-cjs', 'node16'), 'package consumer, Node16 CJS');
  console.log('\nComplete owner graphs and full package consumers passed.');
} finally {
  for (const fixture of fixtures) safeRmSync(fixture, { recursive: true, force: true });
}
