import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import assert from 'assert';
import { runOwnedProcess } from '../local-family/scripts/process.ts';

interface AcceptedInputs {
  candidate: {
    distAggregateSha256: string;
    entrySha256: string;
    packageJsonSha256: string;
    version: string;
  };
  published: {
    entrySha256: string;
    gitHead: string;
    packageJsonSha256: string;
    version: string;
  };
}

interface CheckResult {
  error?: string;
  name: string;
  observed?: unknown;
  ok: boolean;
}

interface ProcessResult {
  dependencies: Record<string, string>;
  group: string;
  identity: Record<string, boolean>;
  results: CheckResult[];
  version: string;
}

const familyRoot = path.resolve(import.meta.dirname, '../../..');
const projectRoot = path.resolve(familyRoot, '../../..');
const publishedRoot = path.join(projectRoot, 'knockback-v1/packages/npm');
const candidateArgument = process.argv[2];
const candidateRoot = candidateArgument ? path.resolve(familyRoot, candidateArgument) : familyRoot;
const exercise = path.join(import.meta.dirname, 'exercise.cjs');
const accepted = JSON.parse(readFileSync(path.join(import.meta.dirname, 'accepted.json'), 'utf8')) as AcceptedInputs;
const candidateVersion = accepted.candidate.version;
const groups = [
  'namespace-dependencies',
  'factory-aliases',
  'factory-core-helpers',
  'legacy-nested-options',
  'nested-alias-conflicts',
  'localized-constructor',
  'validation-constructor',
  'snake-models-only',
  'snake-view-model',
  'snake-sort-attribute',
  'snake-static-defaults',
  'snake-auto-compact',
  'snake-event-watcher',
  'constructors',
  'validation',
  'disposal-aliases',
  'disposal-ownership',
  'view-model-extend',
] as const;
const candidateGroups = ['candidate-alias-conflicts', 'candidate-validation-corrections'] as const;

function sha256File(file: string): string {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function listFiles(root: string): string[] {
  const files: string[] = [];
  const visit = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory() && entry.name !== '.ts-swc-transform-temp') visit(entryPath);
      else if (entry.isFile()) files.push(entryPath);
    }
  };
  visit(root);
  return files.sort();
}

function aggregate(root: string, directory: string): string {
  const lines = listFiles(path.join(root, directory))
    .map((file) => `${sha256File(file)}  ${path.relative(root, file).split(path.sep).join('/')}\n`)
    .join('');
  return createHash('sha256').update(lines).digest('hex');
}

function verifyInputs(): { distAggregateSha256: string; entrySha256: string; packageJsonSha256: string; root: string } {
  assert.strictEqual(sha256File(path.join(publishedRoot, 'package.json')), accepted.published.packageJsonSha256, 'published v1 package.json changed');
  assert.strictEqual(sha256File(path.join(publishedRoot, 'knockback.js')), accepted.published.entrySha256, 'published v1 entry changed');
  const identity = {
    distAggregateSha256: aggregate(candidateRoot, 'dist'),
    entrySha256: sha256File(path.join(candidateRoot, 'dist/cjs/index.js')),
    packageJsonSha256: sha256File(path.join(candidateRoot, 'package.json')),
    root: candidateRoot,
  };
  if (candidateArgument) {
    assert.strictEqual(identity.distAggregateSha256, accepted.candidate.distAggregateSha256, 'accepted candidate dist changed');
    assert.strictEqual(identity.entrySha256, accepted.candidate.entrySha256, 'accepted candidate entry changed');
    assert.strictEqual(identity.packageJsonSha256, accepted.candidate.packageJsonSha256, 'accepted candidate package.json changed');
  }
  return identity;
}

async function exerciseGroup(label: 'candidate' | 'published', group: string): Promise<ProcessResult> {
  const packageRoot = label === 'published' ? publishedRoot : candidateRoot;
  const entry = label === 'published' ? path.join(publishedRoot, 'knockback.js') : candidateArgument ? path.join(candidateRoot, 'dist/cjs/index.js') : undefined;
  const result = await runOwnedProcess(process.execPath, [exercise], {
    cwd: familyRoot,
    env: {
      ...process.env,
      ...(entry ? { KB_COMPAT_ENTRY: entry } : { KB_COMPAT_SPECIFIER: '@mcpeasy/knockback' }),
      KB_COMPAT_GROUP: group,
      KB_COMPAT_PACKAGE_ROOT: packageRoot,
      NODE_PATH: path.join(candidateRoot, 'node_modules'),
    },
    label: `${label} ${group} compatibility process`,
    timeoutMs: 5_000,
  });
  process.stderr.write(result.stderr);
  const line = result.stdout.split(/\r?\n/).find((candidate) => candidate.startsWith('KB_COMPAT_RESULT '));
  if (!line) throw new Error(`${label} ${group} did not emit a compatibility result:\n${result.stdout}`);
  return JSON.parse(line.slice('KB_COMPAT_RESULT '.length)) as ProcessResult;
}

const candidateIdentity = verifyInputs();
const failures: Error[] = [];
const infrastructureFailures: Error[] = [];
const ledger: Array<{ candidate: CheckResult[] | null; group: string; infrastructureError?: string; published: CheckResult[] }> = [];
let sharedDependencies: Record<string, string> | undefined;

for (const group of groups) {
  const published = await exerciseGroup('published', group);
  assert.strictEqual(published.version, accepted.published.version);
  if (sharedDependencies) assert.deepStrictEqual(published.dependencies, sharedDependencies, `${group} changed dependency versions`);
  else sharedDependencies = published.dependencies;
  for (const result of published.results) {
    assert.strictEqual(result.ok, true, `published v1 baseline failed ${group} / ${result.name}: ${result.error}`);
  }

  let candidate: ProcessResult | undefined;
  try {
    candidate = await exerciseGroup('candidate', group);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    infrastructureFailures.push(new Error(`${group}: ${message}`, { cause: error }));
    ledger.push({ candidate: null, group, infrastructureError: message, published: published.results });
    continue;
  }
  assert.strictEqual(candidate.version, candidateVersion);
  assert.deepStrictEqual(candidate.dependencies, published.dependencies, `${group} did not use the same dependency versions`);
  ledger.push({ candidate: candidate.results, group, published: published.results });

  for (const expected of published.results) {
    const actual = candidate.results.find((result) => result.name === expected.name);
    if (!actual) {
      failures.push(new Error(`${group} / ${expected.name}: candidate emitted no result`));
      continue;
    }
    if (!actual.ok) {
      failures.push(new Error(`${group} / ${expected.name}: ${actual.error}`));
      continue;
    }
    try {
      assert.deepStrictEqual(actual.observed, expected.observed);
    } catch (error) {
      failures.push(new Error(`${group} / ${expected.name}: candidate observation differs from published v1`, { cause: error }));
    }
  }
}

for (const group of candidateGroups) {
  let candidate: ProcessResult;
  try {
    candidate = await exerciseGroup('candidate', group);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    infrastructureFailures.push(new Error(`${group}: ${message}`, { cause: error }));
    ledger.push({ candidate: null, group, infrastructureError: message, published: [] });
    continue;
  }
  assert.strictEqual(candidate.version, candidateVersion);
  assert.deepStrictEqual(candidate.dependencies, sharedDependencies, `${group} did not use the verified dependency versions`);
  ledger.push({ candidate: candidate.results, group, published: [] });
  for (const result of candidate.results) {
    if (!result.ok) failures.push(new Error(`${group} / ${result.name}: ${result.error}`));
  }
}

process.stdout.write(`${JSON.stringify({ candidateIdentity, dependencies: sharedDependencies ?? {}, groups: ledger }, null, 2)}\n`);
if (infrastructureFailures.length) {
  throw new AggregateError(infrastructureFailures, `${infrastructureFailures.length} compatibility infrastructure failure(s); ${failures.length} product mismatch(es) measured in completed groups`);
}
if (failures.length) throw new AggregateError(failures, `${failures.length} compatibility contract(s) failed or differed`);
