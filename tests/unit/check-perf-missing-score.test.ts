/**
 * @vitest-environment node
 *
 * Hermetic coverage for q-mp-1208: check-perf fails closed when Lighthouse JSON
 * lacks a finite performance category score. Also q-mp-1375: finite numeric
 * strings in [0, 1] are coerced (non-numeric still missing). Fixture JSON
 * only — no network, no real Lighthouse, no Chrome. Leave q-mp-1090
 * child-kill paths alone.
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
  const reportPath = 'virtual-lh-missing-score.json';
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

describe('shapeLhPerformanceScore (q-mp-1208)', () => {
  it('fails closed when categories.performance is missing', () => {
    expect(shapeLhPerformanceScore({ categories: {} })).toEqual({
      ok: false,
      error: 'missing Lighthouse performance score',
    });
  });

  it('fails closed when performance.score is null', () => {
    expect(
      shapeLhPerformanceScore({
        categories: { performance: { score: null } },
      })
    ).toEqual({
      ok: false,
      error: 'missing Lighthouse performance score',
    });
  });

  it('fails closed when performance.score is undefined', () => {
    expect(
      shapeLhPerformanceScore({
        categories: { performance: {} },
      })
    ).toEqual({
      ok: false,
      error: 'missing Lighthouse performance score',
    });
  });

  it('keeps present numeric 0 representable as score 0', () => {
    expect(
      shapeLhPerformanceScore({
        categories: { performance: { score: 0 } },
      })
    ).toEqual({ ok: true, score: 0 });
  });

  it('rounds a finite score to 0–100 points', () => {
    expect(
      shapeLhPerformanceScore({
        categories: { performance: { score: 0.91 } },
      })
    ).toEqual({ ok: true, score: 91 });
  });

  it('coerces finite numeric string scores in [0, 1] (q-mp-1375)', () => {
    expect(
      shapeLhPerformanceScore({
        categories: { performance: { score: '0.91' } },
      })
    ).toEqual({ ok: true, score: 91 });
    expect(
      shapeLhPerformanceScore({
        categories: { performance: { score: ' 0.85 ' } },
      })
    ).toEqual({ ok: true, score: 85 });
    expect(
      shapeLhPerformanceScore({
        categories: { performance: { score: '0' } },
      })
    ).toEqual({ ok: true, score: 0 });
  });

  it('still reports non-numeric strings as missing (q-mp-1375)', () => {
    expect(
      shapeLhPerformanceScore({
        categories: { performance: { score: 'n/a' } },
      })
    ).toEqual({
      ok: false,
      error: 'missing Lighthouse performance score',
    });
    expect(
      shapeLhPerformanceScore({
        categories: { performance: { score: '' } },
      })
    ).toEqual({
      ok: false,
      error: 'missing Lighthouse performance score',
    });
  });
});

describe('runLighthouse missing performance score (q-mp-1208)', () => {
  it('returns ok:false + error for fixture JSON without performance category', async () => {
    const row = await runWithFixture({ audits: AUDITS, categories: {} });
    expect(row.ok).toBe(false);
    expect(row.error).toMatch(/missing Lighthouse performance score/);
    expect(row).not.toHaveProperty('score');
  });

  it('returns ok:false when score is null in fixture JSON', async () => {
    const row = await runWithFixture({
      audits: AUDITS,
      categories: { performance: { score: null } },
    });
    expect(row.ok).toBe(false);
    expect(row.error).toMatch(/missing Lighthouse performance score/);
  });

  it('returns ok:true score 0 for present numeric 0 in fixture JSON', async () => {
    const row = await runWithFixture({
      audits: AUDITS,
      categories: { performance: { score: 0 } },
    });
    expect(row.ok).toBe(true);
    expect(row.score).toBe(0);
  });
});
