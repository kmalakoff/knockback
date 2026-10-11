import { existsSync, lstatSync, mkdirSync, readFileSync, readlinkSync, realpathSync, renameSync, symlinkSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { safeRmSync } from 'fs-remove-compat';
import { sha256File, type TreeEntry, treeManifest } from './immutable-tree.ts';

export const LOCAL_FAMILY_PACKAGES = [
  { directory: 'knockback', name: '@mcpeasy/knockback' },
  { directory: 'orm', name: 'backbone-orm' },
  { directory: 'modelref', name: 'backbone-modelref' },
  { directory: 'sql', name: 'backbone-sql' },
  { directory: 'mongo', name: 'backbone-mongo' },
] as const;

interface InstallSnapshotOptions {
  applicationNodeModules: string;
  canonicalBackbone: string;
  nextRoot: string;
  snapshotRoot: string;
}

export interface SnapshotPackageProvenance {
  packageJson: { name: string; version: string };
  payload: TreeEntry[];
  tarballSha256: string;
}

interface PrepareInstallOptions {
  applicationNodeModules: string;
  canonicalBackbone: string;
  packages: Record<string, SnapshotPackageProvenance>;
  snapshotRoot: string;
  snapshotsRoot: string;
}

export interface InstallPreparationReceipt {
  snapshotRoot: string;
  state: 'verified' | 'complete' | 'partial';
  links: {
    name: string;
    path: string;
    target: string;
    realpath: string;
    device: number;
    inode: number;
    detached: boolean;
  }[];
}

export class InstallPreparationError extends Error {
  readonly receipt: InstallPreparationReceipt;

  constructor(cause: unknown, receipt: InstallPreparationReceipt) {
    super(`Install preparation stopped after detaching ${receipt.links.filter((link) => link.detached).length}/${receipt.links.length} application links; do not install dependencies.`, { cause });
    this.receipt = receipt;
  }
}

function assertIdentity(actual: string, expected: string, label: string): void {
  if (actual !== expected) throw new Error(`${label} changed: expected ${expected}, received ${actual}`);
}

function assertSameManifest(expected: TreeEntry[], actual: TreeEntry[], label: string): void {
  assertIdentity(String(actual.length), String(expected.length), `${label} file count`);
  for (let index = 0; index < expected.length; index += 1) {
    assertIdentity(actual[index]?.path ?? 'missing', expected[index].path, `${label} path ${index}`);
    assertIdentity(actual[index]?.sha256 ?? 'missing', expected[index].sha256, `${label} ${expected[index].path}`);
  }
}

function backboneLinkPath(root: string, directory: string): string {
  return path.join(root, 'packages', directory, 'node_modules/backbone');
}

function linkDirectory(target: string, linkPath: string): void {
  mkdirSync(path.dirname(linkPath), { recursive: true });
  safeRmSync(linkPath, { force: true, recursive: true });
  const linkTarget = process.platform === 'win32' ? target : path.relative(path.dirname(linkPath), target);
  symlinkSync(linkTarget, linkPath, process.platform === 'win32' ? 'junction' : 'dir');
  assertIdentity(realpathSync(linkPath), realpathSync(target), `symlink ${linkPath}`);
}

export function snapshotDependencyLinks(): ReadonlySet<string> {
  return new Set([...LOCAL_FAMILY_PACKAGES.map(({ directory }) => `packages/${directory}/node_modules/backbone`), 'packages/sql/node_modules/backbone-orm', 'packages/mongo/node_modules/backbone-orm', 'packages/mongo/node_modules/queue-cb']);
}

function queueProvider(applicationNodeModules: string): string {
  const queueRoot = realpathSync(path.join(applicationNodeModules, 'mongo-queue-cb'));
  const queueManifest = JSON.parse(readFileSync(path.join(queueRoot, 'package.json'), 'utf8')) as { name: string; version: string };
  assertIdentity(queueManifest.name, 'queue-cb', 'Mongo queue alias package');
  assertIdentity(queueManifest.version, '1.6.3', 'Mongo queue alias version');
  return queueRoot;
}

function assertSnapshotDependencies(snapshotRoot: string, canonicalBackboneRoot: string, queueRoot: string): void {
  for (const entry of LOCAL_FAMILY_PACKAGES) {
    const backboneLink = backboneLinkPath(snapshotRoot, entry.directory);
    if (!existsSync(backboneLink) || !lstatSync(backboneLink).isSymbolicLink()) {
      throw new Error(`Existing immutable snapshot is missing its Backbone symlink: ${backboneLink}`);
    }
    assertIdentity(realpathSync(backboneLink), canonicalBackboneRoot, `existing ${entry.name} Backbone symlink`);
  }
  for (const directory of ['sql', 'mongo']) {
    const ormLink = path.join(snapshotRoot, `packages/${directory}/node_modules/backbone-orm`);
    if (!existsSync(ormLink) || !lstatSync(ormLink).isSymbolicLink()) throw new Error(`Existing immutable snapshot is missing its ORM symlink: ${ormLink}`);
    assertIdentity(realpathSync(ormLink), realpathSync(path.join(snapshotRoot, 'packages/orm')), `existing backbone-${directory} ORM symlink`);
  }
  const queueLink = path.join(snapshotRoot, 'packages/mongo/node_modules/queue-cb');
  if (!existsSync(queueLink) || !lstatSync(queueLink).isSymbolicLink()) throw new Error(`Existing immutable snapshot is missing its queue symlink: ${queueLink}`);
  assertIdentity(realpathSync(queueLink), queueRoot, 'existing backbone-mongo queue symlink');
}

export function prepareInstall(options: PrepareInstallOptions): InstallPreparationReceipt {
  const snapshotStats = lstatSync(options.snapshotRoot);
  if (snapshotStats.isSymbolicLink() || !snapshotStats.isDirectory()) throw new Error('Selected immutable snapshot is not a directory');
  const snapshotRoot = realpathSync(options.snapshotRoot);
  if (path.dirname(snapshotRoot) !== realpathSync(options.snapshotsRoot)) throw new Error('Selected snapshot is outside the owned snapshots directory');
  const backboneStats = lstatSync(options.canonicalBackbone);
  if (backboneStats.isSymbolicLink() || !backboneStats.isDirectory()) throw new Error('Expected a private installed Backbone directory before install preparation');
  const canonicalBackbone = realpathSync(options.canonicalBackbone);
  const queueRoot = queueProvider(options.applicationNodeModules);
  treeManifest(snapshotRoot, { allowedSymlinks: snapshotDependencyLinks() });
  assertIdentity(String(Object.keys(options.packages).length), String(LOCAL_FAMILY_PACKAGES.length), 'selected snapshot package count');
  for (const entry of LOCAL_FAMILY_PACKAGES) {
    const expected = options.packages[entry.name];
    if (!expected) throw new Error(`Selected snapshot provenance is missing ${entry.name}`);
    assertIdentity(expected.packageJson.name, entry.name, 'selected snapshot package name');
    const prefix = `packages/${entry.directory}/`;
    const allowedSymlinks = new Set([...snapshotDependencyLinks()].filter((link) => link.startsWith(prefix)).map((link) => link.slice(prefix.length)));
    assertSameManifest(expected.payload, treeManifest(path.join(snapshotRoot, 'packages', entry.directory), { allowedSymlinks }), `selected ${entry.name} payload`);
    const tarball = `${entry.name.replace('@', '').replace('/', '-')}-${expected.packageJson.version}.tgz`;
    assertIdentity(sha256File(path.join(snapshotRoot, 'artifacts', tarball)), expected.tarballSha256, `selected ${entry.name} tarball`);
  }
  assertSnapshotDependencies(snapshotRoot, canonicalBackbone, queueRoot);
  const links = LOCAL_FAMILY_PACKAGES.map((entry) => {
    const linkPath = path.join(options.applicationNodeModules, ...entry.name.split('/'));
    const stats = lstatSync(linkPath);
    if (!stats.isSymbolicLink()) throw new Error(`Application package is not an owned symlink: ${entry.name}`);
    const expected = realpathSync(path.join(snapshotRoot, 'packages', entry.directory));
    assertIdentity(realpathSync(linkPath), expected, `application ${entry.name} snapshot ownership`);
    return { name: entry.name, path: linkPath, target: readlinkSync(linkPath), realpath: expected, device: stats.dev, inode: stats.ino, detached: false };
  });
  return { snapshotRoot, state: 'verified', links };
}

function assertCapturedLink(link: InstallPreparationReceipt['links'][number]): void {
  const current = lstatSync(link.path);
  if (!current.isSymbolicLink() || current.dev !== link.device || current.ino !== link.inode || readlinkSync(link.path) !== link.target || realpathSync(link.path) !== link.realpath) {
    throw new Error(`Application link ownership changed before detach: ${link.name}`);
  }
}

export function detachApplicationLinks(receipt: InstallPreparationReceipt): void {
  try {
    if (receipt.state !== 'verified' || receipt.links.some((link) => link.detached)) throw new Error('Install preparation receipt has already been executed');
    for (const link of receipt.links) assertCapturedLink(link);
    for (const link of receipt.links) {
      assertCapturedLink(link);
      unlinkSync(link.path);
      link.detached = true;
    }
    receipt.state = 'complete';
  } catch (cause) {
    receipt.state = 'partial';
    throw new InstallPreparationError(cause, receipt);
  }
}

export function installSnapshot(options: InstallSnapshotOptions): boolean {
  const canonicalBackboneRoot = realpathSync(options.canonicalBackbone);
  const queueRoot = queueProvider(options.applicationNodeModules);
  const nextManifest = treeManifest(options.nextRoot);
  const reusedSnapshot = existsSync(options.snapshotRoot);

  if (reusedSnapshot) {
    const snapshotStats = lstatSync(options.snapshotRoot);
    if (snapshotStats.isSymbolicLink() || !snapshotStats.isDirectory()) {
      throw new Error(`Immutable snapshot destination is not a directory: ${options.snapshotRoot}`);
    }
    const existingManifest = treeManifest(options.snapshotRoot, { allowedSymlinks: snapshotDependencyLinks() });
    assertSameManifest(nextManifest, existingManifest, `existing immutable snapshot ${path.basename(options.snapshotRoot)}`);
    assertSnapshotDependencies(options.snapshotRoot, canonicalBackboneRoot, queueRoot);
    safeRmSync(options.nextRoot, { force: true, recursive: true });
  } else {
    mkdirSync(path.dirname(options.snapshotRoot), { recursive: true });
    renameSync(options.nextRoot, options.snapshotRoot);
    for (const entry of LOCAL_FAMILY_PACKAGES) {
      linkDirectory(options.canonicalBackbone, backboneLinkPath(options.snapshotRoot, entry.directory));
    }
    linkDirectory(path.join(options.snapshotRoot, 'packages/orm'), path.join(options.snapshotRoot, 'packages/sql/node_modules/backbone-orm'));
    linkDirectory(path.join(options.snapshotRoot, 'packages/orm'), path.join(options.snapshotRoot, 'packages/mongo/node_modules/backbone-orm'));
    linkDirectory(queueRoot, path.join(options.snapshotRoot, 'packages/mongo/node_modules/queue-cb'));
  }

  for (const entry of LOCAL_FAMILY_PACKAGES) {
    linkDirectory(path.join(options.snapshotRoot, 'packages', entry.directory), path.join(options.applicationNodeModules, ...entry.name.split('/')));
  }
  return reusedSnapshot;
}
