/**
 * @vitest-environment node
 *
 * Hermetic coverage for q-mp-1090: check-perf kills the Lighthouse child when
 * PERF_LH_TIMEOUT_MS wins the Promise.race (SIGTERM → SIGKILL). Mocks the child;
 * no build, no real Lighthouse, no Chrome.
 */
import { EventEmitter } from 'node:events';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { killChildProcess, runLighthouse } from '../../scripts/check-perf.mjs';

type MockChild = EventEmitter & {
  killed: boolean;
  exitCode: number | null;
  kill: (signal?: NodeJS.Signals) => boolean;
};

function makeMockChild(): { child: MockChild; signals: NodeJS.Signals[] } {
  const signals: NodeJS.Signals[] = [];
  const child = new EventEmitter() as MockChild;
  child.killed = false;
  child.exitCode = null;
  child.kill = (signal = 'SIGTERM') => {
    signals.push(signal);
    if (signal === 'SIGKILL') {
      child.killed = true;
      child.exitCode = null;
      queueMicrotask(() => child.emit('exit', null, signal));
    }
    return true;
  };
  return { child, signals };
}

const TARGET = { id: 'menu', path: '/', label: 'Menu' };

afterEach(() => {
  vi.useRealTimers();
});

describe('killChildProcess (q-mp-1090)', () => {
  it('sends SIGTERM then SIGKILL if the child is still alive', async () => {
    vi.useFakeTimers();
    const { child, signals } = makeMockChild();
    const { signaled } = killChildProcess(child, { graceMs: 40 });
    expect(signaled).toBe(true);
    expect(signals).toEqual(['SIGTERM']);
    await vi.advanceTimersByTimeAsync(40);
    expect(signals).toEqual(['SIGTERM', 'SIGKILL']);
  });

  it('does not escalate after the child exits on SIGTERM', async () => {
    vi.useFakeTimers();
    const signals: NodeJS.Signals[] = [];
    const child = new EventEmitter() as MockChild;
    child.killed = false;
    child.exitCode = null;
    child.kill = (signal = 'SIGTERM') => {
      signals.push(signal);
      child.killed = true;
      child.exitCode = 1;
      queueMicrotask(() => child.emit('exit', 1, signal));
      return true;
    };
    killChildProcess(child, { graceMs: 40 });
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(40);
    expect(signals).toEqual(['SIGTERM']);
  });

  it('no-ops when child is already exited', () => {
    const child = new EventEmitter() as MockChild;
    child.killed = false;
    child.exitCode = 0;
    child.kill = () => {
      throw new Error('should not kill');
    };
    expect(killChildProcess(child).signaled).toBe(false);
  });
});

describe('runLighthouse timeout kills child (q-mp-1090)', () => {
  it('kills the child when the timeout wins the race', async () => {
    vi.useFakeTimers();
    const { child, signals } = makeMockChild();
    const never = new Promise<{
      code: number | null;
      stdout: string;
      stderr: string;
    }>(() => {});

    const pending = runLighthouse(
      'http://127.0.0.1:9',
      'mobile',
      TARGET,
      '/tmp/check-perf-lh-timeout-missing.json',
      {
        timeoutMs: 25,
        killGraceMs: 10,
        runCmd: () => ({ promise: never, child }),
        existsSync: () => false,
      }
    );

    await vi.advanceTimersByTimeAsync(25);
    const row = await pending;
    expect(row.ok).toBe(false);
    expect(row.error).toMatch(/lighthouse timeout/);
    expect(signals[0]).toBe('SIGTERM');

    await vi.advanceTimersByTimeAsync(10);
    expect(signals).toEqual(['SIGTERM', 'SIGKILL']);
  });

  it('does not kill when the command finishes before timeout', async () => {
    const signals: NodeJS.Signals[] = [];
    const child = new EventEmitter() as MockChild;
    child.killed = false;
    child.exitCode = null;
    child.kill = (signal = 'SIGTERM') => {
      signals.push(signal);
      return true;
    };

    const reportPath = 'virtual-lh-report.json';
    const report = {
      categories: { performance: { score: 0.91 } },
      audits: {
        'first-contentful-paint': { displayValue: '1.0 s' },
        'largest-contentful-paint': { displayValue: '1.2 s' },
        'total-blocking-time': { displayValue: '50 ms' },
        'speed-index': { displayValue: '1.1 s' },
        interactive: { displayValue: '1.3 s' },
        'total-byte-weight': {
          numericValue: 1000,
          displayValue: '1.0 KiB',
        },
      },
    };

    const row = await runLighthouse(
      'http://127.0.0.1:9',
      'desktop',
      TARGET,
      reportPath,
      {
        timeoutMs: 60_000,
        runCmd: () => ({
          promise: Promise.resolve({ code: 0, stdout: '', stderr: '' }),
          child,
        }),
        existsSync: (p) => p === reportPath,
        readFileSync: () => JSON.stringify(report),
      }
    );

    expect(row.ok).toBe(true);
    expect(row.score).toBe(91);
    expect(signals).toEqual([]);
  });
});
