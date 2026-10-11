import assert from 'node:assert/strict';
import { execFile, spawn } from 'node:child_process';
import { access, mkdtemp, readdir, readFile, rmdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { promisify } from 'node:util';
import { safeRmSync } from 'fs-remove-compat';
import { runGuarded } from '../../lib/test-resource-guard.ts';

const limits = { warnBytes: 128 * 1024 ** 2, stopBytes: 256 * 1024 ** 2, timeoutMs: 4000 };
const slot = path.join(homedir(), '.migration-test-guard', 'active');

describe('macOS migration test resource guard', () => {
  afterEach(async () => {
    await assert.rejects(access(slot), { code: 'ENOENT' });
  });

  it('runs a successful command and releases the shared slot', async () => {
    await runGuarded(process.execPath, ['-e', 'setTimeout(() => {}, 250)'], limits);
  });

  it('preserves a nonzero command failure', async () => {
    await assert.rejects(runGuarded(process.execPath, ['-e', 'setTimeout(() => process.exit(7), 250)'], limits), /exited 7/);
  });

  it('settles short commands whose processes disappear during sampling', async () => {
    for (const duration of [0, 10, 30, 60, 100]) {
      await runGuarded(process.execPath, ['-e', `setTimeout(() => {}, ${duration})`], limits);
    }
  });

  it('settles an actual missing executable', async () => {
    await assert.rejects(runGuarded('/missing-migration-test-executable', [], limits), { code: 'ENOENT' });
  });

  it('stops at a tiny memory threshold without allocating a large buffer', async () => {
    await assert.rejects(runGuarded(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { ...limits, warnBytes: 1, stopBytes: 2 }), /Memory stop threshold exceeded/);
  });

  it('refuses a concurrent launch from the same machine slot', async () => {
    const first = promisify(execFile)(process.execPath, ['scripts/test-safe.ts', '--', process.execPath, '-e', 'setTimeout(() => {}, 1200)'], { timeout: 10000 });
    // Attach rejection ownership before waiting for the first process to acquire its lock.
    const settled = first.then(
      () => ({ error: null }),
      (error: unknown) => ({ error })
    );
    await delay(100);
    await assert.rejects(runGuarded(process.execPath, ['-e', 'throw new Error("must not execute")'], limits), /slot unavailable/);
    const result = await settled;
    if (result.error) throw result.error;
  });

  for (const signal of ['SIGTERM', 'SIGHUP'] as const)
    it(`settles guardian ${signal} and removes its child before unlocking`, async () => {
      const guard = spawn(process.execPath, ['scripts/test-safe.ts', '--', process.execPath, '-e', 'setInterval(() => {}, 1000)'], { stdio: 'ignore' });
      const settled = new Promise<number | null>((resolve, reject) => {
        guard.once('error', reject);
        guard.once('close', resolve);
      });
      const outcome = settled.then(
        (code) => ({ code }),
        (error: unknown) => ({ error })
      );
      let childPid: number | undefined;
      try {
        const deadline = Date.now() + 3000;
        while (!childPid && Date.now() < deadline) {
          try {
            const registry = JSON.parse(await readFile(path.join(slot, 'processes.json'), 'utf8'));
            childPid = registry.childPid;
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== 'ENOENT' && !(error instanceof SyntaxError)) throw error;
          }
          if (!childPid) await delay(50);
        }
        assert.ok(childPid, 'guardian recorded its child');
        guard.kill(signal);
        const result = await outcome;
        if ('error' in result) throw result.error;
        assert.equal(result.code, 1);
        assert.throws(() => process.kill(childPid, 0), { code: 'ESRCH' });
      } finally {
        if (guard.exitCode === null) guard.kill('SIGTERM');
        await outcome;
      }
    });

  it('kills a SIGTERM-resistant child and grandchild before unlocking', async () => {
    const scratch = await mkdtemp(path.resolve('.tmp/resource-guard-'));
    const pidPath = path.join(scratch, 'grandchild.pid');
    const grandchild = `require('node:fs').writeFileSync(${JSON.stringify(pidPath)}, String(process.pid)); process.on('SIGTERM', () => {}); setInterval(() => {}, 1000);`;
    const parent = `require('node:child_process').spawn(process.execPath, ['-e', ${JSON.stringify(grandchild)}], {stdio:'ignore'}); process.on('SIGTERM', () => {}); setInterval(() => {}, 1000);`;
    try {
      await assert.rejects(runGuarded(process.execPath, ['-e', parent], { ...limits, timeoutMs: 1500 }), /wall-clock limit/);
      const pid = Number(await readFile(pidPath, 'utf8'));
      assert.throws(() => process.kill(pid, 0), { code: 'ESRCH' });
    } finally {
      safeRmSync(scratch, { recursive: true, force: true });
    }
  });

  it('still terminates the child when diagnostic persistence fails', async () => {
    const scratch = await mkdtemp(path.resolve('.tmp/resource-guard-'));
    const pidPath = path.join(scratch, 'child.pid');
    const collision = path.join(slot, 'processes.next');
    const body = `const fs=require('node:fs'); fs.writeFileSync(${JSON.stringify(pidPath)},String(process.pid)); setTimeout(()=>fs.mkdirSync(${JSON.stringify(collision)}),150); setInterval(()=>{},1000);`;
    try {
      await assert.rejects(runGuarded(process.execPath, ['-e', body], limits), (error: unknown) => {
        assert.ok(error instanceof AggregateError);
        assert.ok(error.errors.some((cause) => cause.code === 'EISDIR'));
        return true;
      });
      const pid = Number(await readFile(pidPath, 'utf8'));
      assert.throws(() => process.kill(pid, 0), { code: 'ESRCH' });
      assert.deepEqual(await readdir(slot), ['processes.next']);
      await rmdir(collision);
      await rmdir(slot);
    } finally {
      safeRmSync(scratch, { recursive: true, force: true });
    }
  });
});
