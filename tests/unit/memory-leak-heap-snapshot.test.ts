/**
 * @vitest-environment node
 *
 * Hermetic coverage for q-mp-1215 + q-mp-1216:
 *  - analyzeHeapSnapshot fail-closed when self_size (or name) is missing
 *  - metricDelta never coerces null heap metrics to 0
 * Fixture JSON only — no Playwright / CDP / vite.
 */
import { describe, it, expect } from 'vitest';
import {
  analyzeHeapSnapshot,
  metricDelta,
  fmtMb,
} from '../../scripts/lib/memory-leak-heap.mjs';

/** Minimal well-formed Chrome-ish heap snapshot (3 fields/node). */
const WELL_FORMED = {
  snapshot: {
    meta: {
      node_fields: ['type', 'name', 'self_size'],
    },
  },
  // type, nameIdx, self_size × 3 nodes
  nodes: [1, 0, 16, 1, 1, 32, 2, 2, 8],
  strings: ['Object', 'Detached HTMLDivElement', 'Window'],
};

describe('analyzeHeapSnapshot (q-mp-1215)', () => {
  it('sums self_size and detached Detached* nodes on well-formed snapshots', () => {
    const r = analyzeHeapSnapshot(JSON.stringify(WELL_FORMED));
    expect(r).toEqual({
      detachedDomNodes: 1,
      detachedSelfSize: 32,
      totalSelfSize: 56,
    });
    expect(Number.isNaN(r.detachedSelfSize)).toBe(false);
    expect(Number.isNaN(r.totalSelfSize)).toBe(false);
  });

  it('throws a hard error when self_size is missing (no NaN)', () => {
    const missingSelfSize = {
      snapshot: { meta: { node_fields: ['type', 'name'] } },
      strings: ['Detached HTMLDivElement', 'Object'],
      nodes: [1, 0, 2, 1],
    };
    expect(() => analyzeHeapSnapshot(JSON.stringify(missingSelfSize))).toThrow(
      /missing required node_fields entry: self_size/
    );
  });

  it('throws when name field is missing', () => {
    const missingName = {
      snapshot: { meta: { node_fields: ['type', 'self_size'] } },
      strings: ['Object'],
      nodes: [1, 16],
    };
    expect(() => analyzeHeapSnapshot(JSON.stringify(missingName))).toThrow(
      /name/
    );
  });

  it('throws when node_fields is absent', () => {
    expect(() =>
      analyzeHeapSnapshot(
        JSON.stringify({ snapshot: { meta: {} }, nodes: [], strings: [] })
      )
    ).toThrow(/node_fields/);
  });
});

describe('metricDelta (q-mp-1216)', () => {
  it('returns null when both sides are null (not 0)', () => {
    expect(metricDelta(null, null)).toBeNull();
  });

  it('returns null when either side is missing (42 - null → null, not 42)', () => {
    expect(metricDelta(42, null)).toBeNull();
    expect(metricDelta(null, 10)).toBeNull();
    expect(metricDelta(undefined, 10)).toBeNull();
    expect(metricDelta(42, undefined)).toBeNull();
  });

  it('subtracts when both sides are finite numbers', () => {
    expect(metricDelta(100, 40)).toBe(60);
    expect(metricDelta(0, 0)).toBe(0);
    expect(metricDelta(10, 25)).toBe(-15);
  });

  it('returns null for NaN / non-finite sides', () => {
    expect(metricDelta(Number.NaN, 1)).toBeNull();
    expect(metricDelta(1, Number.POSITIVE_INFINITY)).toBeNull();
  });
});

describe('fmtMb null printer (q-mp-1216)', () => {
  it('prints n/a for null deltas', () => {
    expect(fmtMb(null)).toBe('n/a');
    expect(fmtMb(undefined)).toBe('n/a');
  });

  it('formats finite byte counts', () => {
    expect(fmtMb(2 * 1024 * 1024)).toBe('2.00 MB');
  });
});
