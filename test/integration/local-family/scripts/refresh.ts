import { createHash, randomUUID } from 'node:crypto';
import { appendFileSync, copyFileSync, cpSync, existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { parseArgs } from 'node:util';
import spawn from 'cross-spawn';
import { safeRmSync } from 'fs-remove-compat';
import { comparePath, listFiles, sha256File, treeManifest } from './lib/immutable-tree.ts';
import { detachApplicationLinks, installSnapshot, LOCAL_FAMILY_PACKAGES, prepareInstall, type SnapshotPackageProvenance } from './lib/snapshot.ts';

interface AcceptedIdentities {
  knockback: {
    distAggregateSha256: string;
    packageJsonSha256: string;
    sourceAggregateSha256: string;
    typedValueSha256: string;
    typedValueTestSha256: string;
  };
  modelref: {
    artifactManifestSha256: string;
    payloadManifestSha256: string;
    producerManifestSha256: string;
    tarballSha256: string;
  };
  mongo: {
    artifactManifestSha256: string;
    packageJsonSha256: string;
    tarballSha256: string;
  };
  orm: {
    artifactManifestSha256: string;
    manifestSha256: string;
    packageJsonSha256: string;
    tarballSha256: string;
    umdSha256: string;
  };
  sql: {
    artifactManifestSha256: string;
    manifestSha256: string;
    packageJsonSha256: string;
    tarballSha256: string;
  };
}

interface PackFile {
  path: string;
}

interface PackResult {
  filename: string;
  files: PackFile[];
  integrity: string;
  name: string;
  shasum: string;
  version: string;
}

const appRoot = path.resolve(import.meta.dirname, '..');
const worktreeRoot = path.resolve(appRoot, '../../..');
const projectRoot = path.resolve(worktreeRoot, '../../..');
const knockbackPackageRoot = worktreeRoot;
const ormProducer = path.join(projectRoot, 'backbone-orm/.worktrees/orm-contracts');
const modelrefProducer = path.join(projectRoot, 'backbone-modelref/.worktrees/modelref-modernization');
const ormSnapshotRoot = path.join(ormProducer, '.tmp/orm-contracts/accepted-oct04-cache-owned-json-ab81fef4-payload');
const ormSnapshotArtifactManifest = path.join(ormSnapshotRoot, 'artifact-sha256.txt');
const ormSnapshotManifest = path.join(ormSnapshotRoot, 'provenance.json');
const sqlSnapshotRoot = path.join(projectRoot, 'backbone-sql/.worktrees/adapter-baseline/.tmp/adapter-baseline/accepted-oct05-postgresql-pivots-payload');
const sqlSnapshotArtifactManifest = path.join(sqlSnapshotRoot, 'artifact-sha256.txt');
const sqlSnapshotManifest = path.join(sqlSnapshotRoot, 'provenance.json');
const mongoSnapshotRoot = path.join(projectRoot, 'backbone-mongo/.worktrees/production-port/.tmp/production-port/accepted-oct04-mongo-hasone-af4a2c7f-payload');
const mongoSnapshotArtifactManifest = path.join(mongoSnapshotRoot, 'artifact-sha256.txt');
const modelrefSnapshotRoot = path.join(modelrefProducer, '.tmp/gate4-local-command-provenance');
const modelrefProducerManifest = path.join(worktreeRoot, 'test/integration/package-types/modelref-producer.sha256');
const modelrefArtifactManifest = path.join(worktreeRoot, 'test/integration/package-types/modelref-artifacts.sha256');
const modelrefPayloadManifest = path.join(appRoot, 'modelref-payload.sha256');
const accepted = JSON.parse(readFileSync(path.join(appRoot, 'accepted.json'), 'utf8')) as AcceptedIdentities;
const scratchRoot = path.join(appRoot, '.tmp');
const npmCache = path.join(scratchRoot, 'npm-cache');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function sha256Text(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

function aggregate(producerRoot: string, directory: string): string {
  const lines = listFiles(path.join(producerRoot, directory))
    .map((file) => `${sha256File(file)}  ${path.relative(producerRoot, file).split(path.sep).join('/')}\n`)
    .join('');
  return sha256Text(lines);
}

function assertIdentity(actual: string, expected: string, label: string): void {
  if (actual !== expected) throw new Error(`${label} changed: expected ${expected}, received ${actual}`);
}

function run(command: string, args: string[], cwd: string): string {
  const result = spawn.sync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, npm_config_cache: npmCache },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed (${result.status}):\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

function npmPack(args: string[]): PackResult {
  const output = run(npmCommand, ['pack', ...args, '--ignore-scripts', '--json'], appRoot);
  const parsed = JSON.parse(output) as PackResult[] | Record<string, PackResult>;
  const results = Array.isArray(parsed) ? parsed : Object.values(parsed);
  if (results.length !== 1) throw new Error(`Expected one npm pack result, received ${results.length}`);
  return results[0];
}

function packFileHashes(producer: string, files: PackFile[]): Map<string, string> {
  return new Map(files.map(({ path: file }) => [file, sha256File(path.join(producer, file))]));
}

function assertSameHashes(before: Map<string, string>, after: Map<string, string>, label: string): void {
  assertIdentity(String(after.size), String(before.size), `${label} file count`);
  for (const [file, hash] of before) assertIdentity(after.get(file) ?? 'missing', hash, `${label} ${file}`);
}

function verifyShaManifest(manifestPath: string, root: string): void {
  for (const line of readFileSync(manifestPath, 'utf8').trim().split('\n')) {
    const match = /^([a-f0-9]{64}) {2}(.+)$/.exec(line);
    if (!match) throw new Error(`Invalid SHA-256 manifest line in ${manifestPath}: ${line}`);
    assertIdentity(sha256File(path.join(root, match[2])), match[1], `${path.basename(manifestPath)} ${match[2]}`);
  }
}

function verifyPrefixedTreeManifest(manifestPath: string, root: string, prefix: string): void {
  const expected = readFileSync(manifestPath, 'utf8')
    .trim()
    .split('\n')
    .map((line) => {
      const match = /^([a-f0-9]{64}) {2}(.+)$/.exec(line);
      if (!match) throw new Error(`Invalid SHA-256 manifest line in ${manifestPath}: ${line}`);
      if (!match[2].startsWith(prefix)) throw new Error(`Manifest path must start with ${prefix}: ${match[2]}`);
      const relativePath = match[2].slice(prefix.length);
      if (!relativePath || relativePath.startsWith('/') || relativePath.split('/').includes('..')) {
        throw new Error(`Invalid prefixed manifest path in ${manifestPath}: ${match[2]}`);
      }
      return { path: relativePath, sha256: match[1] };
    })
    .sort((left, right) => comparePath(left.path, right.path));
  const actual = treeManifest(root);
  assertIdentity(String(actual.length), String(expected.length), `${path.basename(manifestPath)} file count`);
  for (let index = 0; index < expected.length; index += 1) {
    assertIdentity(actual[index]?.path ?? 'missing', expected[index].path, `${path.basename(manifestPath)} path ${index}`);
    assertIdentity(actual[index]?.sha256 ?? 'missing', expected[index].sha256, `${path.basename(manifestPath)} ${expected[index].path}`);
  }
}

function gitHead(root: string): string {
  return run('git', ['rev-parse', 'HEAD'], root).trim();
}

function extractPackage(tarball: string, packageName: string, destination: string, extractionRoot: string): void {
  const root = path.join(extractionRoot, packageName.replaceAll('/', '__'));
  mkdirSync(root, { recursive: true });
  writeFileSync(path.join(root, 'package.json'), `${JSON.stringify({ name: 'local-family-extractor', private: true }, null, 2)}\n`);
  run(npmCommand, ['install', '--ignore-scripts', '--install-links=true', '--legacy-peer-deps', '--package-lock=false', '--no-save', tarball], root);
  const installed = path.join(root, 'node_modules', ...packageName.split('/'));
  if (!existsSync(installed)) throw new Error(`npm did not extract ${packageName} from ${tarball}`);
  if (existsSync(path.join(installed, 'node_modules'))) throw new Error(`${packageName} payload unexpectedly contains node_modules`);
  cpSync(installed, destination, { recursive: true });
}

function verifyKnockbackIdentity(): void {
  assertIdentity(sha256File(path.join(knockbackPackageRoot, 'package.json')), accepted.knockback.packageJsonSha256, 'FAMILY Knockback package.json');
  assertIdentity(aggregate(knockbackPackageRoot, 'src'), accepted.knockback.sourceAggregateSha256, 'FAMILY Knockback source aggregate');
  assertIdentity(aggregate(knockbackPackageRoot, 'dist'), accepted.knockback.distAggregateSha256, 'FAMILY Knockback dist aggregate');
  assertIdentity(sha256File(path.join(knockbackPackageRoot, 'src/typed-value.ts')), accepted.knockback.typedValueSha256, 'FAMILY Knockback TypedValue source');
  assertIdentity(sha256File(path.join(knockbackPackageRoot, 'test/unit/typed-value.test.ts')), accepted.knockback.typedValueTestSha256, 'FAMILY Knockback TypedValue test');
  const knockbackManifest = JSON.parse(readFileSync(path.join(knockbackPackageRoot, 'package.json'), 'utf8')) as { name?: string; version?: string };
  assertIdentity(knockbackManifest.name ?? 'missing', '@mcpeasy/knockback', 'FAMILY Knockback package name');
  assertIdentity(knockbackManifest.version ?? 'missing', '2.0.15', 'FAMILY Knockback package version');
}

function verifyAcceptedInputs(): { knockbackFiles: PackFile[]; knockbackHashes: Map<string, string> } {
  verifyKnockbackIdentity();
  assertIdentity(sha256File(modelrefProducerManifest), accepted.modelref.producerManifestSha256, 'ModelRef producer manifest');
  assertIdentity(sha256File(modelrefArtifactManifest), accepted.modelref.artifactManifestSha256, 'ModelRef artifact manifest');
  assertIdentity(sha256File(modelrefPayloadManifest), accepted.modelref.payloadManifestSha256, 'ModelRef complete payload manifest');
  verifyShaManifest(modelrefProducerManifest, modelrefProducer);
  assertIdentity(sha256File(path.join(modelrefSnapshotRoot, 'artifacts/backbone-modelref-0.1.5.tgz')), accepted.modelref.tarballSha256, 'ModelRef accepted tarball');
  assertIdentity(sha256File(ormSnapshotManifest), accepted.orm.manifestSha256, 'ORM snapshot manifest');
  assertIdentity(sha256File(ormSnapshotArtifactManifest), accepted.orm.artifactManifestSha256, 'ORM artifact manifest');
  assertIdentity(sha256File(path.join(ormSnapshotRoot, 'backbone-orm-0.7.14.tgz')), accepted.orm.tarballSha256, 'ORM accepted tarball');
  const ormPackageFile = path.join(ormSnapshotRoot, 'package/package.json');
  assertIdentity(sha256File(ormPackageFile), accepted.orm.packageJsonSha256, 'sealed ORM package.json');
  verifyPrefixedTreeManifest(ormSnapshotArtifactManifest, path.join(ormSnapshotRoot, 'package'), 'package/');
  assertIdentity(sha256File(sqlSnapshotManifest), accepted.sql.manifestSha256, 'SQL snapshot manifest');
  assertIdentity(sha256File(sqlSnapshotArtifactManifest), accepted.sql.artifactManifestSha256, 'SQL artifact manifest');
  assertIdentity(sha256File(path.join(sqlSnapshotRoot, 'backbone-sql-0.6.6.tgz')), accepted.sql.tarballSha256, 'SQL accepted tarball');
  const sqlPackageFile = path.join(sqlSnapshotRoot, 'package/package.json');
  assertIdentity(sha256File(sqlPackageFile), accepted.sql.packageJsonSha256, 'sealed SQL package.json');
  verifyPrefixedTreeManifest(sqlSnapshotArtifactManifest, path.join(sqlSnapshotRoot, 'package'), 'package/');
  // The sealed SQL manifest pins its historical ORM input; runtime rebinding is fixture-owned.
  assertIdentity(sha256File(mongoSnapshotArtifactManifest), accepted.mongo.artifactManifestSha256, 'Mongo artifact manifest');
  assertIdentity(sha256File(path.join(mongoSnapshotRoot, 'backbone-mongo-0.6.10.tgz')), accepted.mongo.tarballSha256, 'Mongo accepted tarball');
  assertIdentity(sha256File(path.join(mongoSnapshotRoot, 'package/package.json')), accepted.mongo.packageJsonSha256, 'Mongo accepted package.json');
  verifyPrefixedTreeManifest(mongoSnapshotArtifactManifest, path.join(mongoSnapshotRoot, 'package'), 'package/');
  const ormPackage = JSON.parse(readFileSync(ormPackageFile, 'utf8')) as { dependencies: Record<string, string> };
  const appRequire = createRequire(path.join(appRoot, 'package.json'));
  for (const [name, expected] of [
    ['mongodb', '7.7.0'],
    ['mongodb-connection-string-url', '7.0.2'],
    ['mongo-queue-cb', '1.6.3'],
    ['queue-cb', '1.6.8'],
  ]) {
    const providerRoot = realpathSync(path.join(appRoot, 'node_modules', name));
    if (!realpathSync(appRequire.resolve(name)).startsWith(`${providerRoot}${path.sep}`)) throw new Error(`Application provider escaped private owner: ${name}`);
    const installed = JSON.parse(readFileSync(path.join(providerRoot, 'package.json'), 'utf8')) as { version: string };
    assertIdentity(installed.version, expected, `application Mongo provider ${name}`);
  }
  for (const dependency of ['inflection', 'lru-cache']) {
    const installed = JSON.parse(readFileSync(appRequire.resolve(`${dependency}/package.json`), 'utf8')) as { version: string };
    assertIdentity(installed.version, ormPackage.dependencies[dependency], `application cold ORM provider ${dependency}`);
  }

  const dryRun = npmPack([knockbackPackageRoot, '--dry-run']);
  const knockbackHashes = packFileHashes(knockbackPackageRoot, dryRun.files);
  return { knockbackFiles: dryRun.files, knockbackHashes };
}

function main(): void {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: { execute: { type: 'boolean' }, 'prepare-install': { type: 'boolean' } },
    strict: true,
  });
  if (values['prepare-install']) {
    const provenance = JSON.parse(readFileSync(path.join(scratchRoot, 'provenance.json'), 'utf8')) as { snapshotRoot: string; packages: Record<string, SnapshotPackageProvenance> };
    const receipt = prepareInstall({
      applicationNodeModules: path.join(appRoot, 'node_modules'),
      canonicalBackbone: path.join(appRoot, 'node_modules/backbone'),
      packages: provenance.packages,
      snapshotRoot: provenance.snapshotRoot,
      snapshotsRoot: path.join(scratchRoot, 'snapshots'),
    });
    console.log(JSON.stringify(receipt, null, 2));
    if (!values.execute) {
      console.log('Preview only. Add --execute to detach these five verified application links before a dependency install.');
      return;
    }
    const receiptsRoot = path.join(scratchRoot, 'install-preparation-receipts');
    mkdirSync(receiptsRoot, { recursive: true, mode: 0o700 });
    const receiptPath = path.join(receiptsRoot, `${randomUUID()}.jsonl`);
    writeFileSync(receiptPath, `${JSON.stringify(receipt)}\n`, { flag: 'wx', mode: 0o600 });
    console.log(`Install preparation receipt: ${receiptPath}`);
    let failed = false;
    let failure: unknown;
    try {
      detachApplicationLinks(receipt);
    } catch (error) {
      failed = true;
      failure = error;
    }
    console.log(JSON.stringify(receipt, null, 2));
    try {
      appendFileSync(receiptPath, `${JSON.stringify(receipt)}\n`);
    } catch (error) {
      if (failed) throw new AggregateError([failure, error], 'Install preparation failed and its final receipt could not be persisted');
      throw new AggregateError([error], 'Application links detached, but final receipt persistence failed; do not install dependencies');
    }
    if (failed) throw failure;
    console.log('Detached application links only. Install fixture dependencies normally, then run the existing refresh preview and refresh:execute to relink.');
    return;
  }
  const inputs = verifyAcceptedInputs();
  if (!values.execute) {
    console.log('Verified complete FAMILY Knockback source/build, ModelRef provenance, and sealed ORM/SQL/Mongo payloads.');
    console.log('Run `npm run refresh:execute` to replace the private staged snapshot and package symlinks.');
    return;
  }

  mkdirSync(scratchRoot, { recursive: true });
  const nextRoot = path.join(scratchRoot, 'refresh-next');
  safeRmSync(nextRoot, { force: true, recursive: true });
  const artifactsRoot = path.join(nextRoot, 'artifacts');
  const extractionRoot = path.join(nextRoot, 'extract');
  const stagedRoot = path.join(nextRoot, 'packages');
  mkdirSync(artifactsRoot, { recursive: true });
  mkdirSync(extractionRoot, { recursive: true });
  mkdirSync(stagedRoot, { recursive: true });

  const packed = npmPack([knockbackPackageRoot, '--pack-destination', artifactsRoot]);
  assertSameHashes(inputs.knockbackHashes, packFileHashes(knockbackPackageRoot, inputs.knockbackFiles), 'accepted Knockback package');
  verifyKnockbackIdentity();
  const knockbackTarball = path.join(artifactsRoot, packed.filename);
  const modelrefTarball = path.join(artifactsRoot, 'backbone-modelref-0.1.5.tgz');
  const ormTarball = path.join(artifactsRoot, 'backbone-orm-0.7.14.tgz');
  const ormManifest = path.join(artifactsRoot, 'backbone-orm-provenance.json');
  const ormArtifactManifest = path.join(artifactsRoot, 'backbone-orm-artifact-sha256.txt');
  const sqlTarball = path.join(artifactsRoot, 'backbone-sql-0.6.6.tgz');
  const sqlManifest = path.join(artifactsRoot, 'backbone-sql-provenance.json');
  const sqlArtifactManifest = path.join(artifactsRoot, 'backbone-sql-artifact-sha256.txt');
  const mongoTarball = path.join(artifactsRoot, 'backbone-mongo-0.6.10.tgz');
  const mongoArtifactManifest = path.join(artifactsRoot, 'backbone-mongo-artifact-sha256.txt');
  copyFileSync(path.join(modelrefSnapshotRoot, 'artifacts/backbone-modelref-0.1.5.tgz'), modelrefTarball);
  const copiedModelrefPayloadManifest = path.join(artifactsRoot, 'backbone-modelref-payload.sha256');
  copyFileSync(modelrefPayloadManifest, copiedModelrefPayloadManifest);
  assertIdentity(sha256File(copiedModelrefPayloadManifest), accepted.modelref.payloadManifestSha256, 'copied ModelRef complete payload manifest');
  copyFileSync(path.join(ormSnapshotRoot, 'backbone-orm-0.7.14.tgz'), ormTarball);
  copyFileSync(ormSnapshotManifest, ormManifest);
  copyFileSync(ormSnapshotArtifactManifest, ormArtifactManifest);
  copyFileSync(path.join(sqlSnapshotRoot, 'backbone-sql-0.6.6.tgz'), sqlTarball);
  copyFileSync(sqlSnapshotManifest, sqlManifest);
  copyFileSync(sqlSnapshotArtifactManifest, sqlArtifactManifest);
  copyFileSync(path.join(mongoSnapshotRoot, 'backbone-mongo-0.6.10.tgz'), mongoTarball);
  copyFileSync(mongoSnapshotArtifactManifest, mongoArtifactManifest);
  assertIdentity(sha256File(mongoTarball), accepted.mongo.tarballSha256, 'copied Mongo tarball');
  assertIdentity(sha256File(mongoArtifactManifest), accepted.mongo.artifactManifestSha256, 'copied Mongo artifact manifest');
  assertIdentity(sha256File(modelrefTarball), accepted.modelref.tarballSha256, 'copied ModelRef tarball');
  assertIdentity(sha256File(ormTarball), accepted.orm.tarballSha256, 'copied ORM tarball');
  assertIdentity(sha256File(ormManifest), accepted.orm.manifestSha256, 'copied ORM snapshot manifest');
  assertIdentity(sha256File(ormArtifactManifest), accepted.orm.artifactManifestSha256, 'copied ORM artifact manifest');
  assertIdentity(sha256File(sqlTarball), accepted.sql.tarballSha256, 'copied SQL tarball');
  assertIdentity(sha256File(sqlManifest), accepted.sql.manifestSha256, 'copied SQL snapshot manifest');
  assertIdentity(sha256File(sqlArtifactManifest), accepted.sql.artifactManifestSha256, 'copied SQL artifact manifest');
  verifyShaManifest(modelrefProducerManifest, modelrefProducer);

  const tarballs = { knockback: knockbackTarball, modelref: modelrefTarball, orm: ormTarball, sql: sqlTarball, mongo: mongoTarball };
  const packages = LOCAL_FAMILY_PACKAGES.map((entry) => ({ ...entry, tarball: tarballs[entry.directory] }));
  for (const entry of packages) extractPackage(entry.tarball, entry.name, path.join(stagedRoot, entry.directory), extractionRoot);

  const knockbackPayload = treeManifest(path.join(stagedRoot, 'knockback'));
  const packedPaths = new Set(inputs.knockbackFiles.map(({ path: file }) => file));
  assertIdentity(String(knockbackPayload.length), String(packedPaths.size), 'Knockback staged file count');
  for (const entry of knockbackPayload) {
    if (!packedPaths.has(entry.path)) throw new Error(`Unexpected Knockback staged file: ${entry.path}`);
    assertIdentity(entry.sha256, inputs.knockbackHashes.get(entry.path) ?? 'missing', `Knockback staged ${entry.path}`);
  }
  verifyShaManifest(modelrefArtifactManifest, path.join(stagedRoot, 'modelref'));
  verifyPrefixedTreeManifest(modelrefPayloadManifest, path.join(stagedRoot, 'modelref'), '');
  verifyPrefixedTreeManifest(ormArtifactManifest, path.join(stagedRoot, 'orm'), 'package/');
  assertIdentity(sha256File(path.join(stagedRoot, 'orm/package.json')), accepted.orm.packageJsonSha256, 'staged ORM package.json');
  assertIdentity(sha256File(path.join(stagedRoot, 'orm/backbone-orm.js')), accepted.orm.umdSha256, 'staged ORM UMD');
  verifyPrefixedTreeManifest(sqlArtifactManifest, path.join(stagedRoot, 'sql'), 'package/');
  assertIdentity(sha256File(path.join(stagedRoot, 'sql/package.json')), accepted.sql.packageJsonSha256, 'staged SQL package.json');
  verifyPrefixedTreeManifest(mongoArtifactManifest, path.join(stagedRoot, 'mongo'), 'package/');
  assertIdentity(sha256File(path.join(stagedRoot, 'mongo/package.json')), accepted.mongo.packageJsonSha256, 'staged Mongo package.json');
  safeRmSync(extractionRoot, { force: true, recursive: true });

  const identity = packages.map(({ tarball }) => sha256File(tarball).slice(0, 16)).join('-');
  const snapshotRoot = path.join(scratchRoot, 'snapshots', identity);
  const canonicalBackbone = path.join(appRoot, 'node_modules/backbone');
  if (!existsSync(canonicalBackbone) || lstatSync(canonicalBackbone).isSymbolicLink()) {
    throw new Error(`Expected a private installed Backbone directory at ${canonicalBackbone}`);
  }
  const reusedSnapshot = installSnapshot({
    applicationNodeModules: path.join(appRoot, 'node_modules'),
    canonicalBackbone,
    nextRoot,
    snapshotRoot,
  });

  const provenance = {
    createdAt: new Date().toISOString(),
    producers: {
      knockback: {
        head: gitHead(knockbackPackageRoot),
        packageRoot: knockbackPackageRoot,
        packageJsonSha256: sha256File(path.join(knockbackPackageRoot, 'package.json')),
        sourceAggregateSha256: aggregate(knockbackPackageRoot, 'src'),
        distAggregateSha256: aggregate(knockbackPackageRoot, 'dist'),
      },
      modelref: { head: gitHead(modelrefProducer), path: modelrefProducer },
      orm: {
        artifactManifestSha256: accepted.orm.artifactManifestSha256,
        manifestSha256: accepted.orm.manifestSha256,
        snapshot: ormSnapshotRoot,
        tarballSha256: accepted.orm.tarballSha256,
      },
      sql: {
        artifactManifestSha256: accepted.sql.artifactManifestSha256,
        manifestSha256: accepted.sql.manifestSha256,
        snapshot: sqlSnapshotRoot,
        tarballSha256: accepted.sql.tarballSha256,
      },
      mongo: { snapshot: mongoSnapshotRoot, tarballSha256: accepted.mongo.tarballSha256, artifactManifestSha256: accepted.mongo.artifactManifestSha256 },
    },
    reusedSnapshot,
    snapshotRoot,
    packages: Object.fromEntries(
      packages.map((entry) => [
        entry.name,
        {
          packageJson: JSON.parse(readFileSync(path.join(snapshotRoot, 'packages', entry.directory, 'package.json'), 'utf8')),
          payload: treeManifest(path.join(snapshotRoot, 'packages', entry.directory), {
            allowedSymlinks: new Set(['node_modules/backbone', ...(['sql', 'mongo'].includes(entry.directory) ? ['node_modules/backbone-orm'] : []), ...(entry.directory === 'mongo' ? ['node_modules/queue-cb'] : [])]),
          }),
          tarballSha256: sha256File(path.join(snapshotRoot, 'artifacts', path.basename(entry.tarball))),
        },
      ])
    ),
  };
  writeFileSync(path.join(scratchRoot, 'provenance.json'), `${JSON.stringify(provenance, null, 2)}\n`);
  console.log(`Refreshed local family snapshot: ${snapshotRoot}`);
}

main();
