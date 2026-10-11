import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'assert';
import { safeRmSync } from 'fs-remove-compat';
import { assertModelRefPayload, captureCurrentModelRefPackage } from '../../lib/current-modelref-package.ts';

interface PackageManifest {
  dependencies?: Record<string, string>;
  exports?: unknown;
  name?: string;
  types?: string;
}

interface PackFile {
  path: string;
  size: number;
}

interface PackResult {
  filename: string;
  files: PackFile[];
  name: string;
  version: string;
}

interface ProcessResult {
  code: number | null;
  signal: NodeJS.Signals | null;
  stderr: string;
  stdout: string;
}

class UnresolvedProcessError extends Error {
  readonly preserveScratch = true;
  readonly cause: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'UnresolvedProcessError';
    this.cause = cause;
  }
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const fixtureRoot = path.dirname(fileURLToPath(import.meta.url));
const packageName = '@mcpeasy/knockback';
const modelRefName = 'backbone-modelref';
const npmCli = process.env.npm_execpath;
const compiler = path.join(repoRoot, 'node_modules', 'typescript', 'bin', 'tsc');
const repositoryParent = path.basename(path.dirname(repoRoot)) === '.worktrees' ? path.dirname(path.dirname(path.dirname(repoRoot))) : path.dirname(repoRoot);
const isolationParent = path.resolve(process.env.KNOCKBACK_PACKED_TEST_ROOT ?? path.join(repositoryParent, '.tmp'));
const timeoutMs = 120_000;
const closeWaitMs = 5_000;

assert.ok(npmCli && existsSync(npmCli), 'Run this gate through npm so its exact npm CLI is available');
assert.ok(existsSync(compiler), 'Missing project-local TypeScript compiler');
assert.ok(!isWithin(repoRoot, isolationParent), 'Packed applications must be outside the repository dependency ancestry');

function isWithin(parent: string, child: string): boolean {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function hash(file: string): string {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function readPackage(root: string): PackageManifest {
  return JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')) as PackageManifest;
}

function listFiles(root: string): string[] {
  const files: string[] = [];

  function visit(directory: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else files.push(path.relative(root, file).split(path.sep).join('/'));
    }
  }

  visit(root);
  return files;
}

function requiredPackagePaths(manifest: PackageManifest): string[] {
  const required = new Set<string>();
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

function groupExists(processGroup: number): boolean {
  try {
    process.kill(-processGroup, 0);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ESRCH') return false;
    throw error;
  }
}

function sendGroupSignal(processGroup: number, signal: NodeJS.Signals): void {
  try {
    process.kill(-processGroup, signal);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error;
  }
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function terminateTree(pid: number): Promise<void> {
  if (process.platform === 'win32') {
    await new Promise<void>((resolve, reject) => {
      const killer = spawn('taskkill.exe', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
      killer.once('error', reject);
      killer.once('close', () => resolve());
    });
    return;
  }

  if (!groupExists(pid)) return;
  sendGroupSignal(pid, 'SIGTERM');
  await wait(2_000);
  if (groupExists(pid)) sendGroupSignal(pid, 'SIGKILL');
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}

function combineErrors(label: string, primary: unknown, cleanup: unknown): Error | undefined {
  if (!primary && !cleanup) return undefined;
  if (!cleanup) return toError(primary);
  if (!primary) return toError(cleanup);
  const primaryError = toError(primary);
  const cleanupError = toError(cleanup);
  return new AggregateError([primaryError, cleanupError], `${label}: ${primaryError.message}; cleanup: ${cleanupError.message}`);
}

async function runProcess(label: string, command: string, args: string[], cwd: string, expectedFailure = false, printOutput = true, processTimeoutMs = timeoutMs): Promise<ProcessResult> {
  const environment = { ...process.env };
  delete environment.NODE_PATH;

  const child = spawn(command, args, {
    cwd,
    detached: process.platform !== 'win32',
    env: environment,
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });
  let stdout = '';
  let stderr = '';
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (chunk: string) => {
    stdout += chunk;
  });
  child.stderr.on('data', (chunk: string) => {
    stderr += chunk;
  });

  let timedOut = false;
  let termination: Promise<void> | undefined;
  let terminationError: unknown;
  let spawnError: Error | undefined;
  let closeDeadline: ReturnType<typeof setTimeout> | undefined;
  let rejectClose: (error: Error) => void = () => {};
  let closeSettled = false;

  function beginCloseDeadline(): void {
    if (closeDeadline) return;
    closeDeadline = setTimeout(() => {
      if (!closeSettled) {
        const originalError = combineErrors(label, spawnError, terminationError);
        const detail = originalError ? `; original: ${originalError.message}` : '';
        preserveScratch = true;
        rejectClose(new UnresolvedProcessError(`${label} did not close within ${closeWaitMs}ms after process termination began${detail}`, originalError));
      }
    }, closeWaitMs);
  }

  const timer = setTimeout(() => {
    if (!child.pid) return;
    timedOut = true;
    beginCloseDeadline();
    const rawTermination = terminateTree(child.pid);
    termination = rawTermination.catch((error) => {
      terminationError = error;
    });
  }, processTimeoutMs);

  let result: ProcessResult;
  result = await new Promise<ProcessResult>((resolve, reject) => {
    rejectClose = reject;
    child.once('error', (error) => {
      spawnError = toError(error);
      beginCloseDeadline();
    });
    child.once('close', (code, signal) => {
      closeSettled = true;
      if (closeDeadline) clearTimeout(closeDeadline);
      resolve({ code, signal, stderr, stdout });
    });
  }).finally(() => {
    clearTimeout(timer);
    if (closeDeadline) clearTimeout(closeDeadline);
  });

  let cleanupError: unknown;
  if (timedOut) {
    try {
      await termination;
    } catch (error) {
      cleanupError = error;
      preserveScratch = true;
    }
    if (!cleanupError && terminationError) {
      cleanupError = terminationError;
      preserveScratch = true;
    }
  } else if (process.platform !== 'win32' && child.pid) {
    try {
      if (groupExists(child.pid)) await terminateTree(child.pid);
    } catch (error) {
      cleanupError = error;
      preserveScratch = true;
    }
  }

  if (spawnError) {
    const combinedError = combineErrors(label, spawnError, cleanupError);
    if (combinedError) throw combinedError;
  }
  if (timedOut) {
    const timeoutError = new Error(`${label} exceeded ${processTimeoutMs}ms\n${stdout}${stderr}`);
    const combinedError = combineErrors(label, timeoutError, cleanupError);
    if (combinedError) throw combinedError;
  }

  const failed = result.code !== 0;
  if (failed !== expectedFailure) {
    const commandError = new Error(`${label} ${expectedFailure ? 'unexpectedly passed' : `failed with ${result.code ?? result.signal}`}\n${stdout}${stderr}`);
    const combinedError = combineErrors(label, commandError, cleanupError);
    if (combinedError) throw combinedError;
  }
  if (cleanupError) throw toError(cleanupError);
  if (!expectedFailure && printOutput) {
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
  }
  return result;
}

async function runNpm(label: string, args: string[], cwd: string, expectedFailure = false): Promise<ProcessResult> {
  return runProcess(label, process.execPath, [npmCli as string, ...args], cwd, expectedFailure, false);
}

async function assertNpmRoot(root: string, expectedName: string): Promise<void> {
  const exactRoot = realpathSync(root);
  const manifest = readPackage(exactRoot);
  assert.strictEqual(manifest.name, expectedName, `Unexpected npm mutation manifest at ${exactRoot}`);
  const prefix = await runNpm(`npm prefix for ${expectedName}`, ['prefix'], exactRoot);
  assert.strictEqual(realpathSync(prefix.stdout.trim()), exactRoot, `npm prefix escaped ${exactRoot}`);
}

function assertCleanAncestors(root: string): void {
  const blocked = [path.join('node_modules', '@mcpeasy', 'knockback'), path.join('node_modules', '@types', 'backbone'), path.join('node_modules', 'backbone-modelref'), path.join('node_modules', 'backbone-orm'), path.join('node_modules', 'backbone-relational')];
  let current = path.dirname(root);
  while (true) {
    for (const relative of blocked) assert.ok(!existsSync(path.join(current, relative)), `Packed application ancestor exposes ${relative}: ${current}`);
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
}

async function packPackage(source: string, expectedName: string, artifactRoot: string): Promise<{ pack: PackResult; tarball: string }> {
  await assertNpmRoot(repoRoot, packageName);
  const result = await runNpm(`pack ${expectedName}`, ['pack', source, '--ignore-scripts', '--json', '--pack-destination', artifactRoot], repoRoot);
  const parsed = JSON.parse(result.stdout) as PackResult[] | Record<string, PackResult>;
  const packs = Array.isArray(parsed) ? parsed : Object.values(parsed);
  assert.strictEqual(packs.length, 1, `Expected one packed ${expectedName} artifact`);
  const pack = packs[0];
  assert.strictEqual(pack.name, expectedName);
  const tarball = path.join(artifactRoot, pack.filename);
  assert.ok(existsSync(tarball), `Missing packed artifact: ${tarball}`);
  return { pack, tarball };
}

function verifyPackContents(installedRoot: string, sourceRoot: string, pack: PackResult): void {
  const packedFiles = pack.files.map(({ path: file }) => file).sort((left, right) => left.localeCompare(right));
  assert.deepStrictEqual(listFiles(installedRoot), packedFiles, `Installed ${pack.name} file set differs from npm pack`);
  for (const file of pack.files) {
    const source = path.join(sourceRoot, file.path);
    const installed = path.join(installedRoot, file.path);
    assert.ok(existsSync(source), `Packed source file is missing: ${pack.name}/${file.path}`);
    assert.strictEqual(statSync(installed).size, file.size, `Packed file size differs: ${pack.name}/${file.path}`);
    assert.strictEqual(hash(installed), hash(source), `Packed file bytes differ: ${pack.name}/${file.path}`);
  }
  for (const file of requiredPackagePaths(readPackage(installedRoot))) assert.ok(existsSync(path.join(installedRoot, file)), `Installed export target is missing: ${pack.name}/${file}`);
}

function assertResolution(appRoot: string, specifier: string): string {
  const appRequire = createRequire(path.join(appRoot, 'package.json'));
  const resolved = realpathSync(appRequire.resolve(specifier));
  assert.ok(isWithin(realpathSync(path.join(appRoot, 'node_modules')), resolved), `${specifier} escaped the packed application: ${resolved}`);
  return resolved;
}

function assertMissingResolution(appRoot: string, specifier: string): void {
  const appRequire = createRequire(path.join(appRoot, 'package.json'));
  assert.throws(() => appRequire.resolve(specifier), { code: 'MODULE_NOT_FOUND' }, `${specifier} leaked into ${appRoot}`);
}

async function installApplication(root: string, name: string, dependencies: Record<string, string>, cache: string): Promise<void> {
  mkdirSync(root, { recursive: true });
  writeFileSync(path.join(root, 'package.json'), `${JSON.stringify({ name, version: '0.0.0', private: true, dependencies }, null, 2)}\n`);
  await assertNpmRoot(root, name);
  await runNpm(`install ${name}`, ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--cache', cache], root);
}

function prepareTypeMode(appRoot: string, mode: 'cjs' | 'esm' | 'node16' | 'nodenext', source: string): string {
  const root = path.join(appRoot, 'typechecks', mode);
  mkdirSync(path.join(root, 'src'), { recursive: true });
  cpSync(path.join(fixtureRoot, 'packed-fixtures', mode, 'tsconfig.json'), path.join(root, 'tsconfig.json'));
  cpSync(source, path.join(root, 'src', path.basename(source)));
  writeFileSync(path.join(root, 'package.json'), `${JSON.stringify({ private: true, type: mode === 'cjs' || mode === 'node16' ? 'commonjs' : 'module' }, null, 2)}\n`);
  return root;
}

async function compileMode(appRoot: string, mode: 'cjs' | 'esm' | 'node16' | 'nodenext', source: string, expectedFailure = false): Promise<ProcessResult> {
  const root = path.join(appRoot, 'typechecks', mode);
  if (!existsSync(root)) prepareTypeMode(appRoot, mode, source);
  const result = await runProcess(`compile ${path.basename(appRoot)} ${mode}`, process.execPath, [compiler, '--project', path.join(root, 'tsconfig.json')], appRoot, expectedFailure);
  if (!expectedFailure) console.log(`[typecheck] ${path.basename(appRoot)} ${mode}`);
  return result;
}

async function compileApplication(appRoot: string, modelRef: boolean): Promise<void> {
  const standardSource = path.join(fixtureRoot, modelRef ? 'modelref-consumers/index.ts' : 'ordinary-consumers/index.ts');
  const node16Source = path.join(fixtureRoot, modelRef ? 'modelref-node16/index.cts' : 'ordinary-node16/index.cts');
  await compileMode(appRoot, 'cjs', standardSource);
  await compileMode(appRoot, 'esm', standardSource);
  await compileMode(appRoot, 'node16', node16Source);
  await compileMode(appRoot, 'nodenext', standardSource);
}

async function expectMissingTypeDependency(appRoot: string): Promise<void> {
  const present = path.join(appRoot, 'node_modules', '@types', 'backbone');
  const omitted = `${present}.omitted`;
  renameSync(present, omitted);
  try {
    const result = await compileMode(appRoot, 'nodenext', path.join(fixtureRoot, 'ordinary-consumers/index.ts'), true);
    assert.match(`${result.stdout}${result.stderr}`, /backbone/i, 'Missing declaration sentinel failed for an unrelated reason');
    console.log('[sentinel] core application rejects missing @types/backbone');
  } finally {
    renameSync(omitted, present);
  }
}

async function expectMissingModelRefPackage(appRoot: string): Promise<void> {
  const present = path.join(appRoot, 'node_modules', modelRefName);
  const omitted = `${present}.omitted`;
  renameSync(present, omitted);
  try {
    const result = await compileMode(appRoot, 'node16', path.join(fixtureRoot, 'modelref-node16/index.cts'), true);
    assert.match(`${result.stdout}${result.stderr}`, /backbone-modelref/i, 'Missing package sentinel failed for an unrelated reason');
    console.log('[sentinel] ModelRef application rejects missing backbone-modelref');
  } finally {
    renameSync(omitted, present);
  }
}

async function expectMissingModelRefDeclaration(appRoot: string): Promise<void> {
  const present = path.join(appRoot, 'node_modules', modelRefName, 'types', 'index.d.cts');
  const omitted = `${present}.omitted`;
  renameSync(present, omitted);
  try {
    const result = await compileMode(appRoot, 'node16', path.join(fixtureRoot, 'modelref-node16/index.cts'), true);
    assert.match(`${result.stdout}${result.stderr}`, /backbone-modelref/i, 'Missing declaration-file sentinel failed for an unrelated reason');
    console.log('[sentinel] ModelRef application rejects missing CommonJS declaration facade');
  } finally {
    renameSync(omitted, present);
  }
}

async function runRuntime(appRoot: string, fixture: string): Promise<void> {
  const target = path.join(appRoot, path.basename(fixture));
  cpSync(fixture, target);
  await runProcess(`runtime ${path.basename(appRoot)} ${path.basename(fixture)}`, process.execPath, [target], appRoot);
}

async function runLifecycleChecks(runRoot: string): Promise<void> {
  let spawnFailure: Error | undefined;
  try {
    await runProcess('ENOENT lifecycle check', path.join(runRoot, 'missing-command'), [], runRoot);
  } catch (error) {
    if (error instanceof UnresolvedProcessError) throw error;
    spawnFailure = toError(error);
  }
  assert.ok(spawnFailure, 'ENOENT lifecycle check unexpectedly passed');
  assert.match(spawnFailure.message, /ENOENT/);
  assert.ok(!(spawnFailure instanceof UnresolvedProcessError), 'ENOENT lifecycle check did not settle close');
  console.log('[lifecycle] ENOENT spawn failure preserved after child close');

  try {
    await runProcess('timeout lifecycle check', process.execPath, ['-e', "process.on('SIGTERM', () => {}); setInterval(() => {}, 1000);"], runRoot, false, false, 100);
    assert.fail('Timeout lifecycle check unexpectedly passed');
  } catch (error) {
    if (error instanceof UnresolvedProcessError) throw error;
    const timeoutFailure = toError(error);
    assert.ok(!(error instanceof UnresolvedProcessError), 'Timeout lifecycle check did not settle close');
    assert.match(timeoutFailure.message, /exceeded 100ms/);
  }
  assert.ok(existsSync(runRoot), 'Lifecycle checks removed their active scratch root');
  console.log('[lifecycle] timeout termination awaited process-group close');
}

mkdirSync(isolationParent, { recursive: true });
const runRoot = mkdtempSync(path.join(isolationParent, 'knockback-packed-'));
assertCleanAncestors(runRoot);
let preserveScratch = false;

try {
  const { installedRoot: modelRefRoot, expectation } = captureCurrentModelRefPackage(repoRoot);
  await runLifecycleChecks(runRoot);

  const artifactRoot = path.join(runRoot, 'artifacts');
  const cache = path.join(runRoot, 'npm-cache');
  mkdirSync(artifactRoot);
  const knockbackArtifact = await packPackage('.', packageName, artifactRoot);
  const modelRefArtifact = await packPackage(modelRefRoot, modelRefName, artifactRoot);

  for (const file of requiredPackagePaths(readPackage(repoRoot)))
    assert.ok(
      knockbackArtifact.pack.files.some((entry) => entry.path === file),
      `Knockback tarball omits ${file}`
    );
  for (const file of requiredPackagePaths(readPackage(modelRefRoot)))
    assert.ok(
      modelRefArtifact.pack.files.some((entry) => entry.path === file),
      `ModelRef tarball omits ${file}`
    );

  const commonDependencies = {
    [packageName]: pathToFileURL(knockbackArtifact.tarball).href,
    backbone: '1.6.1',
    knockout: '3.5.1',
    underscore: '1.13.8',
  };
  const coreRoot = path.join(runRoot, 'core-application');
  const modelRefAppRoot = path.join(runRoot, 'modelref-application');
  await installApplication(coreRoot, 'knockback-packed-core-application', commonDependencies, cache);
  await installApplication(modelRefAppRoot, 'knockback-packed-modelref-application', { ...commonDependencies, [modelRefName]: pathToFileURL(modelRefArtifact.tarball).href }, cache);

  const coreKnockback = path.join(coreRoot, 'node_modules', '@mcpeasy', 'knockback');
  const modelRefKnockback = path.join(modelRefAppRoot, 'node_modules', '@mcpeasy', 'knockback');
  const installedModelRef = path.join(modelRefAppRoot, 'node_modules', modelRefName);
  verifyPackContents(coreKnockback, repoRoot, knockbackArtifact.pack);
  verifyPackContents(modelRefKnockback, repoRoot, knockbackArtifact.pack);
  verifyPackContents(installedModelRef, modelRefRoot, modelRefArtifact.pack);
  assertModelRefPayload(installedModelRef, expectation);

  for (const appRoot of [coreRoot, modelRefAppRoot]) {
    for (const specifier of [`${packageName}/package.json`, '@types/backbone/package.json', 'backbone', 'knockout', 'underscore']) assertResolution(appRoot, specifier);
    for (const optionalPlugin of ['backbone-orm', 'backbone-relational', '@types/knockout/package.json']) assertMissingResolution(appRoot, optionalPlugin);
    assert.ok(!existsSync(path.join(appRoot, 'node_modules', 'typescript')), 'Compiler tooling leaked into a packed application');
  }
  assertMissingResolution(coreRoot, `${modelRefName}/package.json`);
  assertResolution(modelRefAppRoot, `${modelRefName}/package.json`);

  const appRequire = createRequire(path.join(modelRefAppRoot, 'package.json'));
  const modelRefRequire = createRequire(appRequire.resolve(`${modelRefName}/package.json`));
  assert.strictEqual(realpathSync(appRequire.resolve('backbone')), realpathSync(modelRefRequire.resolve('backbone')), 'ModelRef and the application must share one Backbone');

  await compileApplication(coreRoot, false);
  await compileApplication(modelRefAppRoot, true);
  await runRuntime(coreRoot, path.join(fixtureRoot, 'packed-runtime', 'core.cjs'));
  await runRuntime(coreRoot, path.join(fixtureRoot, 'packed-runtime', 'core.mjs'));
  await runRuntime(modelRefAppRoot, path.join(fixtureRoot, 'packed-runtime', 'modelref.cjs'));
  await runRuntime(modelRefAppRoot, path.join(fixtureRoot, 'packed-runtime', 'modelref.mjs'));

  await expectMissingTypeDependency(coreRoot);
  await expectMissingModelRefPackage(modelRefAppRoot);
  await expectMissingModelRefDeclaration(modelRefAppRoot);

  console.log(`Packed install gate passed: ${knockbackArtifact.pack.files.length} Knockback files, ${modelRefArtifact.pack.files.length} ModelRef files, 2 lifecycle checks, 8 compiler legs, 4 native runtime legs, and 3 omission sentinels.`);
} finally {
  if (preserveScratch) {
    console.error(`Preserving unresolved packed scratch: ${runRoot}`);
  } else {
    safeRmSync(runRoot, { recursive: true, force: true });
    assert.ok(!existsSync(runRoot), `Packed application scratch survived cleanup: ${runRoot}`);
  }
}
