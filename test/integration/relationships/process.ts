import { type ChildProcess, spawn } from 'node:child_process';

export interface OwnedProcessResult {
  code: number | null;
  stderr: string;
  stdout: string;
}

export interface OwnedProcessOptions {
  cwd: string;
  env?: NodeJS.ProcessEnv;
  label: string;
  timeoutMs: number;
}

export async function terminateProcessTree(child: ChildProcess): Promise<void> {
  const pid = child.pid;
  if (!pid) return;

  if (process.platform === 'win32') {
    await new Promise<void>((resolve, reject) => {
      const killer = spawn('taskkill', ['/pid', String(pid), '/T', '/F'], { stdio: 'ignore' });
      let spawnError: Error | undefined;
      killer.once('error', (error) => {
        spawnError = error;
        child.kill('SIGKILL');
      });
      killer.once('close', (code) => {
        if (spawnError) {
          reject(spawnError);
        } else if (code && child.exitCode === null) {
          child.kill('SIGKILL');
          reject(new Error(`taskkill exited ${code} for owned process ${pid}`));
        } else {
          resolve();
        }
      });
    });
    return;
  }

  let terminationError: Error | undefined;
  for (const signal of ['SIGTERM', 'SIGKILL'] as const) {
    try {
      process.kill(-pid, signal);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ESRCH') terminationError ||= error as Error;
    }
    if (signal === 'SIGTERM') await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (terminationError) throw terminationError;
}

export function runOwnedProcess(command: string, args: string[], options: OwnedProcessOptions): Promise<OwnedProcessResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      detached: process.platform !== 'win32',
      env: options.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    let originalError: Error | undefined;
    let cleanupError: Error | undefined;
    let cleanup = Promise.resolve();

    child.stdout?.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    let cleanupStarted = false;
    const cleanupOwnedProcess = (): Promise<void> => {
      if (cleanupStarted) return cleanup;
      cleanupStarted = true;
      cleanup = terminateProcessTree(child).catch((error: Error) => {
        cleanupError = error;
      });
      return cleanup;
    };
    const timer = setTimeout(() => {
      originalError ||= new Error(`${options.label} timed out:\n${stdout}${stderr}`);
      void cleanupOwnedProcess();
    }, options.timeoutMs);
    child.on('error', (error) => {
      originalError ||= error;
    });
    child.on('close', (code, signal) => {
      clearTimeout(timer);
      if (!originalError && code !== 0) {
        originalError = new Error(`${options.label} ${signal ? `terminated by ${signal}` : `exited ${code}`}:\n${stdout}${stderr}`);
      }
      const settle = () => {
        if (originalError) {
          reject(cleanupError ? new AggregateError([originalError, cleanupError], `${options.label} failed and process cleanup also failed`) : originalError);
        } else if (code === 0) {
          resolve({ code, stderr, stdout });
        }
      };
      if (originalError || code !== 0) void cleanupOwnedProcess().then(settle);
      else settle();
    });
  });
}
