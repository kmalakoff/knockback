import { chmodSync, cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readlinkSync, realpathSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import assert from 'assert';
import { safeRmSync } from 'fs-remove-compat';
import { treeManifest } from '../scripts/lib/immutable-tree.ts';
import { detachApplicationLinks, InstallPreparationError, installSnapshot, LOCAL_FAMILY_PACKAGES, prepareInstall, type SnapshotPackageProvenance, snapshotDependencyLinks } from '../scripts/lib/snapshot.ts';
import { runOwnedProcess } from '../scripts/process.ts';

interface Fixture {
  applicationRoot: string;
  caseRoot: string;
  nextRoot: string;
  snapshotRoot: string;
}

const packageRoot = path.resolve(import.meta.dirname, '..');
const scratchRoot = path.join(packageRoot, '.tmp', `refresh-reuse-test-${process.pid}`);
const provenance = JSON.parse(readFileSync(path.join(packageRoot, '.tmp/provenance.json'), 'utf8')) as { snapshotRoot: string; packages: Record<string, SnapshotPackageProvenance> };
const acceptedSnapshot = realpathSync(provenance.snapshotRoot);
const acceptedSnapshotsRoot = realpathSync(path.join(packageRoot, '.tmp/snapshots'));
const canonicalBackbone = realpathSync(path.join(packageRoot, 'node_modules/backbone'));
const canonicalQueue = realpathSync(path.join(packageRoot, 'node_modules/mongo-queue-cb'));
const acceptedManifest = treeManifest(acceptedSnapshot, { allowedSymlinks: snapshotDependencyLinks() });
let caseIndex = 0;

assert.ok(acceptedSnapshot.startsWith(`${acceptedSnapshotsRoot}${path.sep}`));

function directoryLink(target: string, linkPath: string): void {
  mkdirSync(path.dirname(linkPath), { recursive: true });
  const linkTarget = process.platform === 'win32' ? target : path.relative(path.dirname(linkPath), target);
  symlinkSync(linkTarget, linkPath, process.platform === 'win32' ? 'junction' : 'dir');
}

function copySnapshotFiles(destination: string): void {
  cpSync(acceptedSnapshot, destination, {
    filter: (source) => !lstatSync(source).isSymbolicLink(),
    recursive: true,
  });
}

function addBackboneLinks(snapshotRoot: string, target = canonicalBackbone): void {
  for (const entry of LOCAL_FAMILY_PACKAGES) {
    directoryLink(target, path.join(snapshotRoot, 'packages', entry.directory, 'node_modules/backbone'));
  }
  directoryLink(path.join(snapshotRoot, 'packages/orm'), path.join(snapshotRoot, 'packages/sql/node_modules/backbone-orm'));
  directoryLink(path.join(snapshotRoot, 'packages/orm'), path.join(snapshotRoot, 'packages/mongo/node_modules/backbone-orm'));
  directoryLink(canonicalQueue, path.join(snapshotRoot, 'packages/mongo/node_modules/queue-cb'));
}

function createFixture(forInstall = false): Fixture {
  caseIndex += 1;
  const caseRoot = path.join(scratchRoot, String(caseIndex));
  const nextRoot = path.join(caseRoot, 'next');
  const applicationRoot = path.join(caseRoot, 'application');
  const snapshotRoot = forInstall ? path.join(applicationRoot, '.tmp/snapshots/selected') : path.join(caseRoot, 'existing');
  copySnapshotFiles(nextRoot);
  copySnapshotFiles(snapshotRoot);
  addBackboneLinks(snapshotRoot);
  mkdirSync(path.join(applicationRoot, 'node_modules'), { recursive: true });
  writeFileSync(path.join(applicationRoot, 'package.json'), `${JSON.stringify({ name: 'refresh-reuse-consumer', private: true }, null, 2)}\n`);
  directoryLink(canonicalBackbone, path.join(applicationRoot, 'node_modules/backbone'));
  directoryLink(canonicalQueue, path.join(applicationRoot, 'node_modules/mongo-queue-cb'));
  for (const entry of LOCAL_FAMILY_PACKAGES) {
    directoryLink(path.join(forInstall ? snapshotRoot : acceptedSnapshot, 'packages', entry.directory), path.join(applicationRoot, 'node_modules', ...entry.name.split('/')));
  }
  return { applicationRoot, caseRoot, nextRoot, snapshotRoot };
}

function applicationTargets(applicationRoot: string): string[] {
  return LOCAL_FAMILY_PACKAGES.map((entry) => realpathSync(path.join(applicationRoot, 'node_modules', ...entry.name.split('/'))));
}

function assertPackageResolution(applicationRoot: string, snapshotRoot: string): void {
  const applicationRequire = createRequire(path.join(applicationRoot, 'package.json'));
  for (const entry of LOCAL_FAMILY_PACKAGES) {
    const packageRoot = realpathSync(path.join(snapshotRoot, 'packages', entry.directory));
    const resolved = realpathSync(applicationRequire.resolve(entry.name));
    assert.ok(resolved.startsWith(`${packageRoot}${path.sep}`), `${entry.name} resolved outside ${packageRoot}`);
  }
}

function assertRejectedBeforeApplicationLinks(fixture: Fixture, mutate: () => void, expectedError: RegExp): void {
  const beforeTargets = applicationTargets(fixture.applicationRoot);
  mutate();
  assert.throws(
    () =>
      installSnapshot({
        applicationNodeModules: path.join(fixture.applicationRoot, 'node_modules'),
        canonicalBackbone,
        nextRoot: fixture.nextRoot,
        snapshotRoot: fixture.snapshotRoot,
      }),
    expectedError
  );
  assert.deepStrictEqual(applicationTargets(fixture.applicationRoot), beforeTargets);
  assert.ok(existsSync(fixture.nextRoot));
  assertPackageResolution(fixture.applicationRoot, acceptedSnapshot);
}

function withFixture(run: (fixture: Fixture) => void): void {
  const fixture = createFixture();
  try {
    run(fixture);
  } finally {
    safeRmSync(fixture.caseRoot, { force: true, recursive: true });
  }
}

function prepareFixture(fixture: Fixture) {
  return prepareInstall({
    applicationNodeModules: path.join(fixture.applicationRoot, 'node_modules'),
    canonicalBackbone,
    packages: provenance.packages,
    snapshotRoot: fixture.snapshotRoot,
    snapshotsRoot: path.dirname(fixture.snapshotRoot),
  });
}

function snapshotLinkTexts(snapshotRoot: string): string[] {
  return [...snapshotDependencyLinks()].map((link) => readlinkSync(path.join(snapshotRoot, link)));
}

function withInstallFixture(run: (fixture: Fixture) => void): void {
  const fixture = createFixture(true);
  try {
    run(fixture);
  } finally {
    safeRmSync(fixture.caseRoot, { force: true, recursive: true });
  }
}

describe('local-family immutable snapshot refresh', () => {
  after(() => {
    try {
      assert.deepStrictEqual(treeManifest(acceptedSnapshot, { allowedSymlinks: snapshotDependencyLinks() }), acceptedManifest);
      for (const entry of LOCAL_FAMILY_PACKAGES) {
        assert.strictEqual(realpathSync(path.join(acceptedSnapshot, 'packages', entry.directory, 'node_modules/backbone')), canonicalBackbone);
      }
      assert.strictEqual(realpathSync(path.join(acceptedSnapshot, 'packages/sql/node_modules/backbone-orm')), realpathSync(path.join(acceptedSnapshot, 'packages/orm')));
      assert.strictEqual(realpathSync(path.join(acceptedSnapshot, 'packages/mongo/node_modules/backbone-orm')), realpathSync(path.join(acceptedSnapshot, 'packages/orm')));
      assert.strictEqual(realpathSync(path.join(acceptedSnapshot, 'packages/mongo/node_modules/queue-cb')), canonicalQueue);
    } finally {
      safeRmSync(scratchRoot, { force: true, recursive: true });
    }
  });

  it('reuses an exact snapshot and resolves the real family by package name', () => {
    withFixture((fixture) => {
      const reused = installSnapshot({
        applicationNodeModules: path.join(fixture.applicationRoot, 'node_modules'),
        canonicalBackbone,
        nextRoot: fixture.nextRoot,
        snapshotRoot: fixture.snapshotRoot,
      });
      assert.strictEqual(reused, true);
      assert.strictEqual(existsSync(fixture.nextRoot), false);
      assertPackageResolution(fixture.applicationRoot, fixture.snapshotRoot);

      const applicationRequire = createRequire(path.join(fixture.applicationRoot, 'package.json'));
      const Backbone = applicationRequire('backbone') as typeof import('backbone');
      const ORM = applicationRequire('backbone-orm') as { Backbone: unknown };
      const ModelRef = applicationRequire('backbone-modelref') as unknown;
      const kb = applicationRequire('@mcpeasy/knockback') as {
        viewModel(model: InstanceType<typeof Backbone.Model>): { dispose(): void; name(): string };
      };
      assert.strictEqual(ORM.Backbone, Backbone);
      assert.strictEqual((Backbone as typeof Backbone & { ModelRef: unknown }).ModelRef, ModelRef);
      const viewModel = kb.viewModel(new Backbone.Model({ name: 'reused' }));
      assert.strictEqual(viewModel.name(), 'reused');
      viewModel.dispose();
    });
  });

  it('rejects a changed snapshot payload before changing application links', () => {
    withFixture((fixture) => {
      const manifest = path.join(fixture.snapshotRoot, 'packages/orm/package.json');
      assertRejectedBeforeApplicationLinks(fixture, () => writeFileSync(manifest, `${readFileSync(manifest, 'utf8')} `), /package\.json changed/);
    });
  });

  it('rejects a missing snapshot payload file before changing application links', () => {
    withFixture((fixture) => {
      assertRejectedBeforeApplicationLinks(fixture, () => unlinkSync(path.join(fixture.snapshotRoot, 'packages/orm/package.json')), /file count changed/);
    });
  });

  it('rejects an extra snapshot payload file before changing application links', () => {
    withFixture((fixture) => {
      assertRejectedBeforeApplicationLinks(fixture, () => writeFileSync(path.join(fixture.snapshotRoot, 'packages/orm/unexpected.txt'), 'unexpected\n'), /file count changed/);
    });
  });

  it('rejects a wrong snapshot Backbone link before changing application links', () => {
    withFixture((fixture) => {
      const wrongBackbone = path.join(fixture.caseRoot, 'wrong-backbone');
      cpSync(canonicalBackbone, wrongBackbone, { recursive: true });
      const backboneLink = path.join(fixture.snapshotRoot, 'packages/orm/node_modules/backbone');
      safeRmSync(backboneLink, { force: true, recursive: true });
      directoryLink(wrongBackbone, backboneLink);
      assertRejectedBeforeApplicationLinks(fixture, () => undefined, /existing backbone-orm Backbone symlink changed/);
    });
  });

  it('rejects an unexpected snapshot symlink before changing application links', () => {
    withFixture((fixture) => {
      assertRejectedBeforeApplicationLinks(fixture, () => directoryLink(canonicalBackbone, path.join(fixture.snapshotRoot, 'packages/orm/unexpected-link')), /Unexpected symbolic link in immutable tree/);
    });
  });

  it('rejects a different SQL ORM link before changing application links', () => {
    withFixture((fixture) => {
      const ormLink = path.join(fixture.snapshotRoot, 'packages/sql/node_modules/backbone-orm');
      unlinkSync(ormLink);
      directoryLink(path.join(acceptedSnapshot, 'packages/orm'), ormLink);
      assertRejectedBeforeApplicationLinks(fixture, () => undefined, /existing backbone-sql ORM symlink changed/);
    });
  });
  it('rejects a different Mongo ORM link before changing application links', () => {
    withFixture((fixture) => {
      const ormLink = path.join(fixture.snapshotRoot, 'packages/mongo/node_modules/backbone-orm');
      unlinkSync(ormLink);
      directoryLink(path.join(acceptedSnapshot, 'packages/orm'), ormLink);
      assertRejectedBeforeApplicationLinks(fixture, () => undefined, /existing backbone-mongo ORM symlink changed/);
    });
  });
  it('rejects a wrong Mongo queue link before changing application links', () => {
    withFixture((fixture) => {
      const queueLink = path.join(fixture.snapshotRoot, 'packages/mongo/node_modules/queue-cb');
      unlinkSync(queueLink);
      directoryLink(path.join(packageRoot, 'node_modules/queue-cb'), queueLink);
      assertRejectedBeforeApplicationLinks(fixture, () => undefined, /existing backbone-mongo queue symlink changed/);
    });
  });
  it('rejects the wrong alias provider before changing application links', () => {
    withFixture((fixture) => {
      const alias = path.join(fixture.applicationRoot, 'node_modules/mongo-queue-cb');
      unlinkSync(alias);
      directoryLink(path.join(packageRoot, 'node_modules/queue-cb'), alias);
      assertRejectedBeforeApplicationLinks(fixture, () => undefined, /Mongo queue alias version changed/);
    });
  });

  it('previews all five exact application owners without changing any links or snapshot bytes', () => {
    withInstallFixture((fixture) => {
      const targets = applicationTargets(fixture.applicationRoot);
      const manifest = treeManifest(fixture.snapshotRoot, { allowedSymlinks: snapshotDependencyLinks() });
      const links = snapshotLinkTexts(fixture.snapshotRoot);
      const receipt = prepareFixture(fixture);
      assert.strictEqual(receipt.state, 'verified');
      assert.strictEqual(receipt.links.length, LOCAL_FAMILY_PACKAGES.length);
      for (const link of receipt.links) {
        assert.strictEqual(link.target, readlinkSync(link.path));
        assert.strictEqual(link.realpath, realpathSync(link.path));
        assert.strictEqual(link.inode, lstatSync(link.path).ino);
        assert.strictEqual(link.device, lstatSync(link.path).dev);
        assert.strictEqual(link.detached, false);
      }
      assert.deepStrictEqual(applicationTargets(fixture.applicationRoot), targets);
      assert.deepStrictEqual(treeManifest(fixture.snapshotRoot, { allowedSymlinks: snapshotDependencyLinks() }), manifest);
      assert.deepStrictEqual(snapshotLinkTexts(fixture.snapshotRoot), links);
    });
  });

  it('detaches only five application symlinks and preserves all snapshot links and bytes', () => {
    withInstallFixture((fixture) => {
      const manifest = treeManifest(fixture.snapshotRoot, { allowedSymlinks: snapshotDependencyLinks() });
      const links = snapshotLinkTexts(fixture.snapshotRoot);
      const receipt = prepareFixture(fixture);
      detachApplicationLinks(receipt);
      assert.strictEqual(receipt.state, 'complete');
      for (const link of receipt.links) {
        assert.strictEqual(link.detached, true);
        assert.strictEqual(existsSync(link.path), false);
      }
      assert.ok(existsSync(path.join(fixture.applicationRoot, 'node_modules/backbone')));
      assert.ok(existsSync(path.join(fixture.applicationRoot, 'node_modules/mongo-queue-cb')));
      assert.deepStrictEqual(treeManifest(fixture.snapshotRoot, { allowedSymlinks: snapshotDependencyLinks() }), manifest);
      assert.deepStrictEqual(snapshotLinkTexts(fixture.snapshotRoot), links);
    });
  });

  it('rejects a wrong final application link before touching any earlier owner', () => {
    withInstallFixture((fixture) => {
      const wrongLink = path.join(fixture.applicationRoot, 'node_modules/backbone-mongo');
      unlinkSync(wrongLink);
      directoryLink(path.join(acceptedSnapshot, 'packages/mongo'), wrongLink);
      const before = applicationTargets(fixture.applicationRoot);
      assert.throws(() => prepareFixture(fixture), /backbone-mongo snapshot ownership changed/);
      assert.deepStrictEqual(applicationTargets(fixture.applicationRoot), before);
    });
  });

  it('rejects a missing final application link and leaves the earlier four linked', () => {
    withInstallFixture((fixture) => {
      unlinkSync(path.join(fixture.applicationRoot, 'node_modules/backbone-mongo'));
      assert.throws(() => prepareFixture(fixture), { code: 'ENOENT' });
      for (const entry of LOCAL_FAMILY_PACKAGES.slice(0, -1)) {
        assert.strictEqual(realpathSync(path.join(fixture.applicationRoot, 'node_modules', ...entry.name.split('/'))), realpathSync(path.join(fixture.snapshotRoot, 'packages', entry.directory)));
      }
    });
  });

  it('rejects a real replacement directory without deleting it or earlier application links', () => {
    withInstallFixture((fixture) => {
      const replacement = path.join(fixture.applicationRoot, 'node_modules/backbone-mongo');
      unlinkSync(replacement);
      mkdirSync(replacement);
      writeFileSync(path.join(replacement, 'owner.txt'), 'replacement');
      assert.throws(() => prepareFixture(fixture), /not an owned symlink: backbone-mongo/);
      assert.strictEqual(readFileSync(path.join(replacement, 'owner.txt'), 'utf8'), 'replacement');
      assert.ok(lstatSync(path.join(fixture.applicationRoot, 'node_modules/backbone-orm')).isSymbolicLink());
    });
  });

  it('rejects changed selected payload before application detachment', () => {
    withInstallFixture((fixture) => {
      const before = applicationTargets(fixture.applicationRoot);
      const manifest = path.join(fixture.snapshotRoot, 'packages/orm/package.json');
      writeFileSync(manifest, `${readFileSync(manifest, 'utf8')} `);
      assert.throws(() => prepareFixture(fixture), /selected backbone-orm payload.*package.json changed/);
      assert.deepStrictEqual(applicationTargets(fixture.applicationRoot), before);
    });
  });

  it('rejects a missing snapshot dependency without repairing it or detaching the application', () => {
    withInstallFixture((fixture) => {
      const before = applicationTargets(fixture.applicationRoot);
      const missing = path.join(fixture.snapshotRoot, 'packages/mongo/node_modules/queue-cb');
      unlinkSync(missing);
      assert.throws(() => prepareFixture(fixture), /missing its queue symlink/);
      assert.strictEqual(existsSync(missing), false);
      assert.deepStrictEqual(applicationTargets(fixture.applicationRoot), before);
    });
  });

  it('rechecks every captured owner before first unlink and never adopts a replacement', () => {
    withInstallFixture((fixture) => {
      const receipt = prepareFixture(fixture);
      const replacement = path.join(fixture.applicationRoot, 'node_modules/backbone-mongo');
      unlinkSync(replacement);
      directoryLink(path.join(acceptedSnapshot, 'packages/mongo'), replacement);
      const before = applicationTargets(fixture.applicationRoot);
      assert.throws(
        () => detachApplicationLinks(receipt),
        (error: unknown) => {
          assert.ok(error instanceof InstallPreparationError);
          assert.strictEqual(error.receipt, receipt);
          assert.strictEqual(receipt.state, 'partial');
          assert.strictEqual(receipt.links.filter((link) => link.detached).length, 0);
          return true;
        }
      );
      assert.deepStrictEqual(applicationTargets(fixture.applicationRoot), before);
    });
  });

  it('retains an exact partial receipt after a real unlink permission failure', function () {
    if (process.platform === 'win32' || process.getuid?.() === 0) this.skip();
    withInstallFixture((fixture) => {
      const receipt = prepareFixture(fixture);
      const manifest = treeManifest(fixture.snapshotRoot, { allowedSymlinks: snapshotDependencyLinks() });
      const links = snapshotLinkTexts(fixture.snapshotRoot);
      const nodeModules = path.join(fixture.applicationRoot, 'node_modules');
      chmodSync(nodeModules, 0o555);
      try {
        assert.throws(
          () => detachApplicationLinks(receipt),
          (error: unknown) => {
            assert.ok(error instanceof InstallPreparationError);
            assert.strictEqual(error.receipt, receipt);
            assert.ok(error.cause instanceof Error);
            assert.strictEqual((error.cause as NodeJS.ErrnoException).code, 'EACCES');
            return true;
          }
        );
        assert.strictEqual(receipt.state, 'partial');
        assert.deepStrictEqual(
          receipt.links.map((link) => link.detached),
          [true, false, false, false, false]
        );
        assert.strictEqual(existsSync(receipt.links[0].path), false);
        for (const link of receipt.links.slice(1)) assert.strictEqual(readlinkSync(link.path), link.target);
        assert.deepStrictEqual(treeManifest(fixture.snapshotRoot, { allowedSymlinks: snapshotDependencyLinks() }), manifest);
        assert.deepStrictEqual(snapshotLinkTexts(fixture.snapshotRoot), links);
      } finally {
        chmodSync(nodeModules, 0o755);
      }
    });
  });

  it('preserves an internal snapshot through a real offline npm install and standard package-name relinking', async () => {
    const npmCli = process.env.npm_execpath;
    assert.ok(npmCli, 'Run this owner through npm run test:refresh so npm owns its executable path');
    const fixture = createFixture(true);
    try {
      const nodeModules = path.join(fixture.applicationRoot, 'node_modules');
      const retainedPackage = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8')) as { dependencies: Record<string, string> };
      const retainedLock = JSON.parse(readFileSync(path.join(packageRoot, 'package-lock.json'), 'utf8')) as { lockfileVersion: number; packages: Record<string, unknown> };
      const dependencies: Record<string, string> = {};
      const lockPackages: Record<string, unknown> = {};
      for (const name of ['backbone', 'underscore', 'knockout', 'mongo-queue-cb']) {
        dependencies[name] = retainedPackage.dependencies[name];
        assert.ok(dependencies[name], `Missing retained provider ${name}`);
        const location = `node_modules/${name}`;
        assert.ok(retainedLock.packages[location], `Missing retained lock record ${name}`);
        lockPackages[location] = retainedLock.packages[location];
        const destination = path.join(nodeModules, name);
        if (existsSync(destination)) unlinkSync(destination);
        cpSync(path.join(packageRoot, location), destination, { recursive: true });
      }
      const manifest = { name: 'snapshot-install-consumer', version: '0.0.0', private: true, dependencies };
      writeFileSync(path.join(fixture.applicationRoot, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
      writeFileSync(
        path.join(fixture.applicationRoot, 'package-lock.json'),
        `${JSON.stringify({ name: manifest.name, version: manifest.version, lockfileVersion: retainedLock.lockfileVersion, requires: true, packages: { '': { name: manifest.name, version: manifest.version, dependencies }, ...lockPackages } }, null, 2)}\n`
      );
      const privateBackbone = path.join(nodeModules, 'backbone');
      for (const entry of LOCAL_FAMILY_PACKAGES) {
        const link = path.join(fixture.snapshotRoot, 'packages', entry.directory, 'node_modules/backbone');
        unlinkSync(link);
        directoryLink(privateBackbone, link);
      }
      const queueLink = path.join(fixture.snapshotRoot, 'packages/mongo/node_modules/queue-cb');
      unlinkSync(queueLink);
      directoryLink(path.join(nodeModules, 'mongo-queue-cb'), queueLink);
      const before = treeManifest(fixture.snapshotRoot, { allowedSymlinks: snapshotDependencyLinks() });
      const links = snapshotLinkTexts(fixture.snapshotRoot);
      const receipt = prepareInstall({ applicationNodeModules: nodeModules, canonicalBackbone: privateBackbone, packages: provenance.packages, snapshotRoot: fixture.snapshotRoot, snapshotsRoot: path.dirname(fixture.snapshotRoot) });
      detachApplicationLinks(receipt);
      const result = await runOwnedProcess(process.execPath, [npmCli, 'install', '--offline', '--ignore-scripts', '--legacy-peer-deps', '--no-audit', '--no-fund', '--cache', path.join(fixture.caseRoot, 'npm-cache')], { cwd: fixture.applicationRoot, label: 'snapshot preservation npm install', timeoutMs: 120_000 });
      console.log(result.stdout);
      if (result.stderr) console.log(result.stderr);
      assert.strictEqual(result.code, 0);
      assert.deepStrictEqual(treeManifest(fixture.snapshotRoot, { allowedSymlinks: snapshotDependencyLinks() }), before);
      assert.deepStrictEqual(snapshotLinkTexts(fixture.snapshotRoot), links);
      assert.strictEqual(installSnapshot({ applicationNodeModules: nodeModules, canonicalBackbone: privateBackbone, nextRoot: fixture.nextRoot, snapshotRoot: fixture.snapshotRoot }), true);
      assertPackageResolution(fixture.applicationRoot, fixture.snapshotRoot);
      const consumer = createRequire(path.join(fixture.applicationRoot, 'package.json'));
      const Backbone = consumer('backbone') as typeof import('backbone');
      const ORM = consumer('backbone-orm') as { Backbone: unknown };
      assert.strictEqual(ORM.Backbone, Backbone);
      for (const entry of LOCAL_FAMILY_PACKAGES) {
        const packageConsumer = createRequire(path.join(fixture.snapshotRoot, 'packages', entry.directory, 'package.json'));
        assert.strictEqual(packageConsumer('backbone'), Backbone);
      }
      const kb = consumer('@mcpeasy/knockback') as { viewModel(model: InstanceType<typeof Backbone.Model>): { dispose(): void; name(): string } };
      const model = new Backbone.Model({ name: 'before' });
      const view = kb.viewModel(model);
      try {
        assert.strictEqual(view.name(), 'before');
        model.set('name', 'after');
        assert.strictEqual(view.name(), 'after');
      } finally {
        view.dispose();
      }
    } finally {
      safeRmSync(fixture.caseRoot, { force: true, recursive: true });
    }
  });
});
