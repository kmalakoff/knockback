import path from 'node:path';
import assert from 'assert';
import { runOwnedProcess } from '../local-family/scripts/process.ts';

interface CheckResult {
  error?: string;
  name: string;
  ok: boolean;
}

interface ProcessResult {
  dependencies: Record<string, string>;
  group: string;
  identity: Record<string, boolean>;
  results: CheckResult[];
}

const packageRoot = path.resolve(import.meta.dirname, '../../..');
const exercise = path.join(import.meta.dirname, 'exercise.cjs');
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
  'candidate-alias-conflicts',
  'candidate-validation-corrections',
] as const;

async function exerciseGroup(group: (typeof groups)[number]): Promise<ProcessResult> {
  const result = await runOwnedProcess(process.execPath, [exercise], {
    cwd: packageRoot,
    env: {
      ...process.env,
      KB_COMPAT_GROUP: group,
      KB_COMPAT_PACKAGE_ROOT: packageRoot,
      KB_COMPAT_SPECIFIER: '@mcpeasy/knockback',
    },
    label: `${group} public compatibility process`,
    timeoutMs: 5_000,
  });
  process.stderr.write(result.stderr);
  const line = result.stdout.split(/\r?\n/).find((candidate) => candidate.startsWith('KB_COMPAT_RESULT '));
  assert.ok(line, `${group} did not emit a compatibility result:\n${result.stdout}`);
  return JSON.parse(line.slice('KB_COMPAT_RESULT '.length)) as ProcessResult;
}

describe('published v1 public compatibility', () => {
  for (const group of groups) {
    it(group, async () => {
      const result = await exerciseGroup(group);
      assert.strictEqual(result.group, group);
      assert.deepStrictEqual(result.identity, {
        backbone: true,
        collection: true,
        events: true,
        knockout: true,
        model: true,
        underscore: true,
      });
      if (group === 'nested-alias-conflicts') {
        assert.strictEqual(result.results.length, 4, 'nested alias group must emit all four child checks');
        assert.deepStrictEqual(result.results.map((check) => check.name), [
          'nested legacy models_only overrides outer camel modelsOnly',
          'nested camel modelsOnly overrides outer legacy only in candidate',
          'nested legacy sort_attribute overrides outer camel sortAttribute',
          'nested camel sortAttribute overrides outer legacy only in candidate',
        ]);
      }
      const failures = result.results.filter((check) => !check.ok);
      assert.deepStrictEqual(failures, [], failures.map((check) => `${check.name}: ${check.error ?? 'failed without an error'}`).join('\n'));
    });
  }
});
