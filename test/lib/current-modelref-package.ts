import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readdirSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import assert from 'assert';

interface PackageManifest {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  exports?: unknown;
  main?: string;
  name?: string;
  types?: string;
}

export interface ModelRefPackageExpectation {
  readonly inventory: readonly (readonly [file: string, hash: string])[];
  readonly requiredPaths: readonly string[];
}

const packageName = 'backbone-modelref';

function readPackage(root: string): PackageManifest {
  return JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')) as PackageManifest;
}

function artifactManifest(root: string): [file: string, hash: string][] {
  const entries: [file: string, hash: string][] = [];

  function visit(directory: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (directory === root && entry.name !== 'dist' && entry.name !== 'types') continue;
        if (entry.name !== '.ts-swc-transform-temp') visit(file);
        continue;
      }
      const relative = path.relative(root, file).split(path.sep).join('/');
      if (relative !== 'package.json' && !relative.startsWith('types/') && (!relative.startsWith('dist/') || !/(?:package\.json|\.(?:c?js|d\.cts|d\.ts))$/.test(relative))) continue;
      entries.push([relative, createHash('sha256').update(readFileSync(file)).digest('hex')]);
    }
  }

  visit(root);
  return entries.sort((left, right) => left[0].localeCompare(right[0]));
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

function assertRequiredTargets(root: string, requiredPaths: readonly string[]): void {
  for (const file of requiredPaths) {
    const target = path.resolve(root, file);
    const relative = path.relative(root, target);
    assert.ok(relative && !path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`), `ModelRef target escapes its package: ${file}`);
    assert.ok(existsSync(target) && statSync(target).isFile(), `ModelRef package target is missing: ${file}`);
  }
}

export function assertModelRefPayload(root: string, expected: ModelRefPackageExpectation): void {
  assert.deepStrictEqual(artifactManifest(root), expected.inventory, 'ModelRef payload differs from the declared current file producer');
  assertRequiredTargets(root, expected.requiredPaths);
}

export function captureCurrentModelRefPackage(repoRoot: string): { installedRoot: string; expectation: ModelRefPackageExpectation } {
  const consumerRoot = realpathSync(repoRoot);
  const consumerManifest = readPackage(consumerRoot);
  const dependency = consumerManifest.devDependencies?.[packageName] ?? consumerManifest.dependencies?.[packageName];
  assert.ok(typeof dependency === 'string' && dependency.startsWith('file:') && dependency.length > 5, 'Declare the current ModelRef producer as an ordinary file dependency');
  const producerRoot = realpathSync(path.resolve(consumerRoot, dependency.slice(5)));
  assert.ok(statSync(producerRoot).isDirectory(), 'ModelRef file dependency must select a producer directory');
  const producerManifest = readPackage(producerRoot);
  assert.strictEqual(producerManifest.name, packageName, 'ModelRef file dependency selects the wrong package');
  assert.ok(producerManifest.types && producerManifest.exports, 'ModelRef producer must declare its types and exports');

  const expectation: ModelRefPackageExpectation = {
    inventory: artifactManifest(producerRoot),
    requiredPaths: requiredPackagePaths(producerManifest),
  };
  assert.ok(expectation.inventory.some(([file]) => /\.d\.(?:c)?ts$/.test(file)), 'Current ModelRef producer has no declarations');
  assert.ok(expectation.inventory.some(([file]) => /\.(?:c?js)$/.test(file)), 'Current ModelRef producer has no executable artifacts');
  assertRequiredTargets(producerRoot, expectation.requiredPaths);

  const installedRoot = path.join(consumerRoot, 'node_modules', packageName);
  assert.ok(existsSync(installedRoot), 'Missing installed ModelRef package');
  assert.ok(lstatSync(installedRoot).isDirectory(), 'Install ModelRef as a regular package with npm install --install-links');
  assert.notStrictEqual(realpathSync(installedRoot), producerRoot, 'ModelRef producer and installed copy must be separate directories');
  const consumerRequire = createRequire(path.join(consumerRoot, 'package.json'));
  assert.strictEqual(realpathSync(consumerRequire.resolve(`${packageName}/package.json`)), path.join(realpathSync(installedRoot), 'package.json'), 'ModelRef resolution escaped the consumer installation');
  assertModelRefPayload(installedRoot, expectation);

  const modelRefRequire = createRequire(path.join(installedRoot, 'package.json'));
  assert.strictEqual(realpathSync(modelRefRequire.resolve('backbone')), realpathSync(consumerRequire.resolve('backbone')), 'ModelRef must resolve the package Backbone instance');
  return { installedRoot, expectation };
}
