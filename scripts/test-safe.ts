import { parseArgs } from 'node:util';
import { readLimits, runGuarded } from './lib/test-resource-guard.ts';

const { positionals } = parseArgs({ allowPositionals: true, strict: true });
const [file, ...args] = positionals;
if (!file) throw new Error('Usage: node scripts/test-safe.ts -- <command> [arguments...]');
try {
  await runGuarded(file, args, await readLimits());
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
