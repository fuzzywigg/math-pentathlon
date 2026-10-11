/**
 * @vitest-environment node
 *
 * Hermetic coverage for q-mp-1293: runLighthouse must reject stale /
 * non-fresh output JSON. Pre-unlink before spawn so exit 0 + a leftover
 * score file cannot green-wash yesterday's score. No network, no real
 * Lighthouse, no Chrome. Leave waitForUrl (q-mp-1287) alone.
 */
import { EventEmitter } from 'node:events';
import { describe, expect, it } from 'vitest';
import { runLighthouse, unlinkLhOutput } from '../../scripts/check-perf.mjs';

type MockChild = EventEmitter & {
  killed: boolean;
  exitCode: number | null;
  kill: (signal?: NodeJS.Signals) => boolean;
};

function makeMockChild(): MockChild {
  const child = new EventEmitter() as MockChild;
  child.killed = false;
  child.exitCode = null;
  child.kill = () => true;
  return child;
}

const TARGET = { id: 'menu', path: '/', label: 'Menu' };

const FRESH_REPORT = {
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
  categories: { performance: { score: 0.91 } },
};

const STALE_REPORT = {
  audits: {},
  categories: { performance: { score: 0.99 } },
};

describe('unlinkLhOutput (q-mp-1293)', () => {
  it('ignores ENOENT from unlinkSync', () => {
    expect(() =>
      unlinkLhOutput('virtual-missing.json', () => {
        const err = new Error('ENOENT') as Error & { code: string };
        err.code = 'ENOENT';
        throw err;
      })
    ).not.toThrow();
  });

  it('propagates non-ENOENT unlink errors', () => {
    expect(() =>
      unlinkLhOutput('virtual-locked.json', () => {
        const err = new Error('EPERM') as Error & { code: string };
        err.code = 'EPERM';
        throw err;
      })
    ).toThrow(/EPERM/);
  });
});

describe('runLighthouse stale vs fresh output (q-mp-1293)', () => {
  it('returns ok:false when exit 0 leaves no fresh output after unlink', async () => {
    const reportPath = 'virtual-lh-stale.json';
    /** @type {Set<string>} */
    const files = new Set([reportPath]); // pre-existing stale file
    let body = JSON.stringify(STALE_REPORT);

    const row = await runLighthouse(
      'http://127.0.0.1:9',
      'mobile',
      TARGET,
      reportPath,
      {
        timeoutMs: 60_000,
        runCmd: () => ({
          // Child "succeeds" but never writes a new file.
          promise: Promise.resolve({ code: 0, stdout: '', stderr: '' }),
          child: makeMockChild(),
        }),
        unlinkSync: (p) => {
          files.delete(p);
        },
        existsSync: (p) => files.has(p),
        readFileSync: () => body,
      }
    );

    expect(row.ok).toBe(false);
    if (!row.ok) {
      expect(row.error).toMatch(/missing fresh Lighthouse output/);
    }
    expect(row).not.toHaveProperty('score');
    expect(files.has(reportPath)).toBe(false);
  });

  it('returns ok:true when child writes a fresh report after unlink', async () => {
    const reportPath = 'virtual-lh-fresh.json';
    /** @type {Set<string>} */
    const files = new Set([reportPath]);
    let body = JSON.stringify(STALE_REPORT);

    const row = await runLighthouse(
      'http://127.0.0.1:9',
      'mobile',
      TARGET,
      reportPath,
      {
        timeoutMs: 60_000,
        runCmd: () => {
          // Simulate a fresh write after pre-unlink.
          files.add(reportPath);
          body = JSON.stringify(FRESH_REPORT);
          return {
            promise: Promise.resolve({ code: 0, stdout: '', stderr: '' }),
            child: makeMockChild(),
          };
        },
        unlinkSync: (p) => {
          files.delete(p);
        },
        existsSync: (p) => files.has(p),
        readFileSync: () => body,
      }
    );

    expect(row.ok).toBe(true);
    if (row.ok) {
      expect(row.score).toBe(91);
    }
  });
});
