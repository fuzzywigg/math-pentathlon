/**
 * @vitest-environment node
 *
 * Hermetic coverage for finalizeGameResult / summarizeSamples ignoring
 * non-finite durationMs (q-mp-1224). No Chromium / network.
 */
import { describe, it, expect } from 'vitest';
import { finalizeGameResult } from '../../scripts/render-perf-mode.mjs';

describe('finalizeGameResult durationMs filter (q-mp-1224)', () => {
  it('ignores undefined durationMs — meanMs null, count 0', () => {
    const r = finalizeGameResult({
      moveSamples: [{ durationMs: undefined, layoutReads: 1 }],
      hoverSamples: [],
    });
    expect(r.move.count).toBe(0);
    expect(r.move.meanMs).toBeNull();
    expect(Number.isNaN(r.move.meanMs)).toBe(false);
    expect(r.move.p50Ms).toBeNull();
    expect(r.move.maxMs).toBeNull();
  });

  it('ignores null, NaN, and Infinity durationMs', () => {
    const r = finalizeGameResult({
      moveSamples: [
        { durationMs: null as unknown as number },
        { durationMs: Number.NaN },
        { durationMs: Number.POSITIVE_INFINITY },
        { durationMs: Number.NEGATIVE_INFINITY },
      ],
      hoverSamples: [{ durationMs: '12' as unknown as number }],
    });
    expect(r.move.count).toBe(0);
    expect(r.move.meanMs).toBeNull();
    expect(r.hover.count).toBe(0);
    expect(r.hover.meanMs).toBeNull();
  });

  it('keeps finite samples and averages only those', () => {
    const r = finalizeGameResult({
      moveSamples: [
        { durationMs: 10, layoutReads: 2, longTasksOver50: 1, longTaskMaxMs: 60 },
        { durationMs: undefined, layoutReads: 99, longTasksOver50: 5, longTaskMaxMs: 200 },
        { durationMs: 30, layoutReads: 4, longTasksOver50: 0, longTaskMaxMs: 0 },
      ],
      hoverSamples: [
        { durationMs: 5, layoutReads: 1 },
        { durationMs: Number.NaN, layoutReads: 8 },
      ],
    });
    expect(r.move.count).toBe(2);
    expect(r.move.meanMs).toBe(20);
    // pct uses floor(n*p) index — for [10,30] p50 → index 1 → 30
    expect(r.move.p50Ms).toBe(30);
    expect(r.move.maxMs).toBe(30);
    expect(r.move.longTasksOver50).toBe(1);
    expect(r.move.longTaskMaxMs).toBe(60);
    expect(r.hover.count).toBe(1);
    expect(r.hover.meanMs).toBe(5);
  });

  it('omits raw sample arrays from the returned result', () => {
    const r = finalizeGameResult({
      gameId: 'hex',
      moveSamples: [{ durationMs: 12 }],
      hoverSamples: [],
    });
    expect(r).not.toHaveProperty('moveSamples');
    expect(r).not.toHaveProperty('hoverSamples');
    expect(r.gameId).toBe('hex');
    expect(r.move.count).toBe(1);
    expect(r.move.meanMs).toBe(12);
  });
});
