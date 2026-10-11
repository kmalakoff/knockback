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
  stopSignal?: 'SIGINT';
  timeoutMs: number;
}

const STOP_TIMEOUT_MS = 10_000;

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

export function startOwnedProcess(command: string, args: string[], options: OwnedProcessOptions) {
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
  let intentionalStop = false;
  let closeOutcome: { code: number | null; failure?: Error } | undefined;

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
  const closed = new Promise<{ code: number | null; failure?: Error }>((resolve) =>
    child.once('close', (code, signal) => {
      clearTimeout(timer);
      if (!originalError && code !== 0 && !intentionalStop) originalError = new Error(`${options.label} ${signal ? `terminated by ${signal}` : `exited ${code}`}:\n${stdout}${stderr}`);
      closeOutcome = { code, failure: originalError };
      resolve(closeOutcome);
    })
  );
  const result = closed.then(async ({ code, failure }) => {
    // A failed parent's process group can still own descendants after its close event.
    if (failure || intentionalStop) await cleanupOwnedProcess();
    if (failure) throw cleanupError ? new AggregateError([failure, cleanupError], `${options.label} failed and process cleanup also failed`) : failure;
    if (cleanupError) throw cleanupError;
    return { code, stderr, stdout };
  });
  let stopping: Promise<void> | undefined;
  function stop(): Promise<void> {
    stopping ??= new Promise<void>((resolve, reject) => {
      const cleanupTimer = setTimeout(() => {
        void cleanupOwnedProcess();
        reject(new Error(`${options.label} termination and close not confirmed within ${STOP_TIMEOUT_MS}ms`));
      }, STOP_TIMEOUT_MS);
      if (!closeOutcome) intentionalStop = true;
      // A successful closed owner needs no late signal; failed groups still need cleanup.
      let termination: Promise<void>;
      if (!closeOutcome && options.stopSignal === 'SIGINT' && !cleanupStarted) {
        try {
          if (child.pid) child.kill('SIGINT');
          termination = closed.then(() => cleanupOwnedProcess());
        } catch (error) {
          termination = cleanupOwnedProcess().then(() => {
            throw cleanupError ? new AggregateError([error, cleanupError], `${options.label} graceful signal and owned cleanup failed`) : error;
          });
        }
      } else {
        termination = !closeOutcome || closeOutcome.failure || cleanupStarted ? cleanupOwnedProcess() : Promise.resolve();
      }
      void Promise.all([termination, closed]).then(
        () => {
          clearTimeout(cleanupTimer);
          if (cleanupError) reject(cleanupError);
          else resolve();
        },
        (error: unknown) => {
          clearTimeout(cleanupTimer);
          reject(error);
        }
      );
    });
    return stopping;
  }
  return { child, result, stop };
}

export function runOwnedProcess(command: string, args: string[], options: OwnedProcessOptions): Promise<OwnedProcessResult> {
  return startOwnedProcess(command, args, options).result;
}
