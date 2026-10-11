/**
 * @vitest-environment node
 *
 * Hermetic coverage for q-mp-1246: check-perf rejects Lighthouse performance
 * scores outside the documented [0, 1] fraction range. Fixture JSON only —
 * no network, no real Lighthouse, no Chrome. Leave q-mp-1208 missing-score
 * and q-mp-1090 child-kill paths alone.
 */
import { EventEmitter } from 'node:events';
import { describe, expect, it } from 'vitest';
import {
  runLighthouse,
  shapeLhPerformanceScore,
} from '../../scripts/check-perf.mjs';

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

const AUDITS = {
  'first-contentful-paint': { displayValue: '1.0 s' },
  'largest-contentful-paint': { displayValue: '1.2 s' },
  'total-blocking-time': { displayValue: '50 ms' },
  'speed-index': { displayValue: '1.1 s' },
  interactive: { displayValue: '1.3 s' },
  'total-byte-weight': {
    numericValue: 1000,
    displayValue: '1.0 KiB',
  },
};

/**
 * Drive runLighthouse with in-memory fixture JSON (no disk, no network).
 */
async function runWithFixture(report: unknown) {
  const reportPath = 'virtual-lh-out-of-range-score.json';
  return runLighthouse('http://127.0.0.1:9', 'mobile', TARGET, reportPath, {
    timeoutMs: 60_000,
    runCmd: () => ({
      promise: Promise.resolve({ code: 0, stdout: '', stderr: '' }),
      child: makeMockChild(),
    }),
    existsSync: (p) => p === reportPath,
    readFileSync: () => JSON.stringify(report),
  });
}

describe('shapeLhPerformanceScore out-of-range (q-mp-1246)', () => {
  it('fails closed when score is above 1', () => {
    expect(
      shapeLhPerformanceScore({
        categories: { performance: { score: 1.2 } },
      })
    ).toEqual({
      ok: false,
      error: 'out-of-range Lighthouse performance score',
    });
  });

  it('fails closed when score is below 0', () => {
    expect(
      shapeLhPerformanceScore({
        categories: { performance: { score: -0.1 } },
      })
    ).toEqual({
      ok: false,
      error: 'out-of-range Lighthouse performance score',
    });
  });

  it('keeps in-range 0.85 as score 85', () => {
    expect(
      shapeLhPerformanceScore({
        categories: { performance: { score: 0.85 } },
      })
    ).toEqual({ ok: true, score: 85 });
  });

  it('keeps boundary 0 and 1 representable', () => {
    expect(
      shapeLhPerformanceScore({
        categories: { performance: { score: 0 } },
      })
    ).toEqual({ ok: true, score: 0 });
    expect(
      shapeLhPerformanceScore({
        categories: { performance: { score: 1 } },
      })
    ).toEqual({ ok: true, score: 100 });
  });

  it('leaves missing/null path unchanged (q-mp-1208)', () => {
    expect(
      shapeLhPerformanceScore({
        categories: { performance: { score: null } },
      })
    ).toEqual({
      ok: false,
      error: 'missing Lighthouse performance score',
    });
  });
});

describe('runLighthouse out-of-range performance score (q-mp-1246)', () => {
  it('returns ok:false + error for fixture JSON with score 1.2', async () => {
    const row = await runWithFixture({
      audits: AUDITS,
      categories: { performance: { score: 1.2 } },
    });
    expect(row.ok).toBe(false);
    expect(row.error).toMatch(/out-of-range Lighthouse performance score/);
    expect(row).not.toHaveProperty('score');
  });

  it('returns ok:false for fixture JSON with score -0.1', async () => {
    const row = await runWithFixture({
      audits: AUDITS,
      categories: { performance: { score: -0.1 } },
    });
    expect(row.ok).toBe(false);
    expect(row.error).toMatch(/out-of-range Lighthouse performance score/);
  });

  it('returns ok:true score 85 for in-range 0.85', async () => {
    const row = await runWithFixture({
      audits: AUDITS,
      categories: { performance: { score: 0.85 } },
    });
    expect(row.ok).toBe(true);
    expect(row.score).toBe(85);
  });
});
