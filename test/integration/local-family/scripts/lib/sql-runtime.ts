import { readFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import assert from 'assert';
import { satisfiesSemverSync } from 'node-exec-path';
import { runOwnedProcess } from '../process.ts';

const appRoot = path.resolve(import.meta.dirname, '../..');
const appRequire = createRequire(path.join(appRoot, 'package.json'));

export async function sqliteNode(): Promise<string> {
  const resolverRoot = realpathSync(path.join(appRoot, 'node_modules/node-exec-path'));
  assert.strictEqual(realpathSync(path.dirname(appRequire.resolve('node-exec-path/package.json'))), resolverRoot);
  const resolverManifest = JSON.parse(readFileSync(path.join(resolverRoot, 'package.json'), 'utf8')) as { version: string };
  assert.strictEqual(resolverManifest.version, '1.2.4');
  const command = satisfiesSemverSync('20.20.2', { env: process.env });
  if (!command) throw new Error('Local-family SQLite requires an already-installed Node20.20.2 on PATH. No runtime will be provisioned.');
  const result = await runOwnedProcess(command, ['-e', 'process.stdout.write(JSON.stringify({ version: process.version, abi: process.versions.modules }))'], {
    cwd: appRoot,
    env: { ...process.env, PATH: `${path.dirname(command)}${path.delimiter}${process.env.PATH ?? ''}` },
    label: 'approved SQLite Node runtime identity',
    timeoutMs: 10_000,
  });
  assert.deepStrictEqual(JSON.parse(result.stdout), { version: 'v20.20.2', abi: '115' });
  console.log(JSON.stringify({ sqliteNode: command, resolverRoot, resolverVersion: resolverManifest.version, ...JSON.parse(result.stdout) }));
  return command;
}
