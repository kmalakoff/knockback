import { execFile, spawn } from 'node:child_process';
import { mkdir, readFile, rename, rmdir, unlink, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { promisify } from 'node:util';

const execute = promisify(execFile);
const GiB = 1024 ** 3;
const lockRoot = path.join(homedir(), '.migration-test-guard');
const lockPath = path.join(lockRoot, 'active');

export interface Limits {
  warnBytes: number;
  stopBytes: number;
  timeoutMs: number;
}

interface ProcessRow {
  pid: number;
  parent: number;
  group: number;
  identity: string;
  state: string;
}

async function command(file: string, args: string[]) {
  return (await execute(file, args, { timeout: 3000, maxBuffer: 4 * 1024 * 1024 })).stdout;
}

async function processes(): Promise<ProcessRow[]> {
  const output = await command('ps', ['-axo', 'pid=,ppid=,pgid=,stat=,lstart=']);
  return output
    .trim()
    .split('\n')
    .map((line) => {
      const [pid, parent, group, state, ...started] = line.trim().split(/\s+/);
      return { pid: Number(pid), parent: Number(parent), group: Number(group), state, identity: started.join(' ') };
    });
}

async function assertPressureNormal() {
  const pressure = (await command('sysctl', ['-n', 'kern.memorystatus_vm_pressure_level'])).trim();
  if (pressure !== '1') throw new Error(`Machine memory pressure is not normal (${pressure}); test run refused/stopped`);
}

export async function readLimits(): Promise<Limits> {
  const configPath = path.join(homedir(), '.config', 'migration-test-guard', 'config.json');
  const limits: Limits = JSON.parse(await readFile(configPath, 'utf8'));
  if (![limits.warnBytes, limits.stopBytes, limits.timeoutMs].every((value) => Number.isSafeInteger(value) && value > 0) || limits.warnBytes >= limits.stopBytes) throw new Error(`Invalid resource limits in ${configPath}`);
  return limits;
}

// Host administration uses macOS footprint, including compressed physical footprint.
// This sampled stop threshold is not a kernel-enforced allocation ceiling.
export async function runGuarded(file: string, args: string[], limits: Limits): Promise<void> {
  if (process.platform !== 'darwin') throw new Error('The migration test guard currently supports macOS only');
  await mkdir(lockRoot, { recursive: true, mode: 0o700 });
  try {
    await mkdir(lockPath, { mode: 0o700 });
  } catch (error) {
    throw new Error(`Heavy-test slot unavailable at ${lockPath}; never remove it without checking its owner`, { cause: error });
  }
  let safeToUnlock = true;
  let failure: unknown;
  let interrupted: string | undefined;
  let peak = 0;
  const interrupt = (signal: string) => {
    interrupted = signal;
  };
  const onInt = () => interrupt('SIGINT');
  const onTerm = () => interrupt('SIGTERM');
  const onHangup = () => interrupt('SIGHUP');
  process.on('SIGINT', onInt);
  process.on('SIGTERM', onTerm);
  process.on('SIGHUP', onHangup);
  try {
    await writeFile(path.join(lockPath, 'owner.json'), JSON.stringify({ pid: process.pid, cwd: process.cwd(), file, args, started: new Date().toISOString() }), { mode: 0o600 });
    await assertPressureNormal();
    const child = spawn(file, args, {
      detached: true,
      stdio: 'inherit',
      env: { ...process.env, NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --max-old-space-size=2048`.trim() },
    });
    safeToUnlock = false;
    let closed = false;
    let exitCode: number | null = null;
    let childError: Error | undefined;
    child.once('error', (error) => {
      childError = error;
    });
    child.once('close', (code, signal) => {
      closed = true;
      exitCode = code;
      if (signal && !childError) childError = new Error(`Command terminated by ${signal}`);
    });
    const known = new Map<number, string>();
    let registryError: unknown;
    const owned = async () => {
      const rows = await processes();
      let changed = true;
      while (changed) {
        changed = false;
        for (const row of rows) {
          if (row.pid === process.pid || row.state.startsWith('Z')) continue;
          const parent = rows.find((entry) => entry.pid === row.parent);
          if (row.pid === child.pid || (child.pid && row.group === child.pid) || (parent && known.get(parent.pid) === parent.identity)) {
            if (!known.has(row.pid)) {
              known.set(row.pid, row.identity);
              changed = true;
            }
          }
        }
      }
      const result = rows.filter((row) => !row.state.startsWith('Z') && known.get(row.pid) === row.identity);
      try {
        await writeFile(path.join(lockPath, 'processes.next'), JSON.stringify({ childPid: child.pid, known: [...known], live: result }), { mode: 0o600 });
        await rename(path.join(lockPath, 'processes.next'), path.join(lockPath, 'processes.json'));
      } catch (error) {
        registryError ||= error;
      }
      return result;
    };
    const signalErrors: unknown[] = [];
    const signalOwned = async (signal: NodeJS.Signals) => {
      const rows = await owned();
      for (const pid of [...new Set(rows.map((row) => row.pid))]) {
        try {
          process.kill(pid, signal);
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'ESRCH') signalErrors.push(error);
        }
      }
      if (child.pid && rows.some((row) => row.group === child.pid)) {
        try {
          process.kill(-child.pid, signal);
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'ESRCH') signalErrors.push(error);
        }
      }
    };
    try {
      const start = Date.now();
      let warned = false;
      while (!closed) {
        if (childError) throw childError;
        if (interrupted) throw new Error(`Guard interrupted by ${interrupted}`);
        if (Date.now() - start >= limits.timeoutMs) throw new Error('Test command exceeded its wall-clock limit');
        await assertPressureNormal();
        const rows = await owned();
        if (registryError) throw registryError;
        if (rows.length) {
          let output: string;
          try {
            output = await command('footprint', ['--noCategories', '--swapped', '-f', 'bytes', ...rows.flatMap((row) => ['-p', String(row.pid)])]);
          } catch (error) {
            const remaining = await owned();
            if (rows.some((row) => remaining.some((current) => current.pid === row.pid && current.identity === row.identity))) throw error;
            console.error('Resource guard: sampled processes exited before footprint completed');
            output = '';
          }
          const headers = [...output.matchAll(/^[^\n]*\[(\d+)\]:[^\n]*$/gm)];
          const measured = new Map<number, number>();
          for (let index = 0; index < headers.length; index++) {
            const section = output.slice(headers[index].index, headers[index + 1]?.index);
            const value = section.match(/^\s+phys_footprint:\s+(\d+) B\s*$/m);
            if (value) measured.set(Number(headers[index][1]), Number(value[1]));
          }
          const live = await owned();
          const missing = rows.filter((row) => !measured.has(row.pid) && live.some((current) => current.pid === row.pid && current.identity === row.identity));
          if (missing.length) {
            await writeFile(path.join(lockRoot, 'last-incomplete-footprint.txt'), output, { mode: 0o600 });
            throw new Error(`Incomplete footprint measurement for live PIDs ${missing.map((row) => row.pid).join(',')}; retained ${lockRoot}/last-incomplete-footprint.txt`);
          }
          {
            const total = [...measured.values()].reduce((sum, value) => sum + value, 0);
            peak = Math.max(peak, total);
            if (total >= limits.stopBytes) throw new Error(`Memory stop threshold exceeded: ${total} >= ${limits.stopBytes} bytes`);
            if (!warned && total >= limits.warnBytes) {
              warned = true;
              console.error(`Resource warning: test tree uses ${(total / GiB).toFixed(2)} GiB`);
            }
          }
        }
        if (!closed) await delay(500);
      }
      if (childError) throw childError;
      if (exitCode !== 0) throw new Error(`Command exited ${exitCode}`);
    } catch (error) {
      failure = error;
    }
    try {
      await signalOwned('SIGTERM');
      const grace = Date.now() + 2000;
      while ((!closed || (await owned()).length) && Date.now() < grace) await delay(100);
      await signalOwned('SIGKILL');
      const deadline = Date.now() + 3000;
      while ((!closed || (await owned()).length) && Date.now() < deadline) await delay(100);
      if (!closed || (await owned()).length) throw new AggregateError(signalErrors, `Process cleanup unresolved; slot retained at ${lockPath}`);
      safeToUnlock = true;
      if (signalErrors.length) console.error('Process signaling errors, followed by confirmed process exit:', signalErrors);
    } catch (error) {
      failure = failure ? new AggregateError([failure, error], 'Command and process cleanup failed') : error;
    }
    if (registryError && failure !== registryError) failure = failure ? new AggregateError([failure, registryError], 'Command and diagnostic persistence failed') : registryError;
    console.error(`Resource guard: peak sampled tree footprint ${(peak / GiB).toFixed(3)} GiB; cleanup ${safeToUnlock ? 'confirmed' : 'UNRESOLVED'}`);
  } catch (error) {
    failure = failure ? new AggregateError([failure, error], 'Resource guard failed') : error;
  } finally {
    process.removeListener('SIGINT', onInt);
    process.removeListener('SIGTERM', onTerm);
    process.removeListener('SIGHUP', onHangup);
  }
  if (safeToUnlock) {
    try {
      try {
        await unlink(path.join(lockPath, 'owner.json'));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      }
      try {
        await unlink(path.join(lockPath, 'processes.json'));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      }
      try {
        await unlink(path.join(lockPath, 'processes.next'));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      }
      await rmdir(lockPath);
    } catch (error) {
      failure = failure ? new AggregateError([failure, error], 'Command and slot cleanup failed') : error;
    }
  }
  if (failure) throw failure;
}
