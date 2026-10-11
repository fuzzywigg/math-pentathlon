/**
 * Hermetic coverage for render-perf __mpRenderPerf bag reads (q-mp-1238)
 * and hover probe cell-limit single source of truth (q-mp-1242).
 *
 * Stays on unit-shared (no vitest.config.ts edit in this ticket): pure lib +
 * source asserts only — no Playwright / browser launch.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  HOVER_PROBE_CELL_LIMIT,
  snapshotRenderPerfCounters,
  deltaRenderPerfCounters,
  hoverProbeMethodBullet,
} from '../../scripts/lib/render-perf-stats.mjs';

const RENDER_PERF = resolve(process.cwd(), 'scripts/render-perf.mjs');
const STATS_LIB = resolve(process.cwd(), 'scripts/lib/render-perf-stats.mjs');

describe('render-perf stats bag (q-mp-1238)', () => {
  it('snapshotRenderPerfCounters reads numeric counters from __mpRenderPerf shape', () => {
    expect(snapshotRenderPerfCounters(undefined)).toEqual({
      layoutReads: 0,
      longTaskCount: 0,
      moveCostCount: 0,
    });
    expect(snapshotRenderPerfCounters(null)).toEqual({
      layoutReads: 0,
      longTaskCount: 0,
      moveCostCount: 0,
    });
    const bag = {
      longTasks: [{ duration: 60 }, { duration: 12 }],
      layoutReads: 7,
      moveCosts: [{ costMs: 1 }],
      started: 100,
      _po: {},
    };
    expect(snapshotRenderPerfCounters(bag)).toEqual({
      layoutReads: 7,
      longTaskCount: 2,
      moveCostCount: 1,
    });
  });

  it('deltaRenderPerfCounters yields real deltas (not always {})', () => {
    const before = snapshotRenderPerfCounters({
      longTasks: [{ duration: 1 }],
      layoutReads: 3,
      moveCosts: [],
    });
    const after = snapshotRenderPerfCounters({
      longTasks: [{ duration: 1 }, { duration: 2 }],
      layoutReads: 10,
      moveCosts: [{ costMs: 4 }],
    });
    expect(deltaRenderPerfCounters(before, after)).toEqual({
      layoutReads: 7,
      longTaskCount: 1,
      moveCostCount: 1,
    });
  });

  it('scripts/render-perf.mjs reads __mpRenderPerf and never a stats-bag alias', () => {
    const src = readFileSync(RENDER_PERF, 'utf8');
    expect(src).toMatch(/__mpRenderPerf/);
    expect(src).not.toMatch(/__mpRenderStats/);
    expect(src).toMatch(/snapCounters\(w\.__mpRenderPerf\)/);
    expect(src).toMatch(/const bag = window\.__mpRenderPerf/);
    expect(src).toMatch(/render-perf-stats\.mjs/);
  });
});

describe('render-perf hover probe limit (q-mp-1242)', () => {
  it('HOVER_PROBE_CELL_LIMIT is 16 and method bullet matches', () => {
    expect(HOVER_PROBE_CELL_LIMIT).toBe(16);
    expect(hoverProbeMethodBullet()).toBe(
      '- Hover probe (juggle, pent-em-in): 16 synthetic `mouseenter` events during place phase when cells exist'
    );
    expect(hoverProbeMethodBullet(HOVER_PROBE_CELL_LIMIT)).toContain('16');
    expect(hoverProbeMethodBullet()).not.toMatch(/\b12\b/);
  });

  it('scripts/render-perf.mjs uses the shared constant for slice + docs', () => {
    const src = readFileSync(RENDER_PERF, 'utf8');
    const lib = readFileSync(STATS_LIB, 'utf8');
    expect(lib).toMatch(/export const HOVER_PROBE_CELL_LIMIT = 16/);
    expect(src).toMatch(/HOVER_PROBE_CELL_LIMIT/);
    expect(src).toMatch(/hoverProbeMethodBullet\(HOVER_PROBE_CELL_LIMIT\)/);
    expect(src).toMatch(/hoverLimit: HOVER_PROBE_CELL_LIMIT/);
    expect(src).not.toMatch(/12 synthetic/);
    expect(src).not.toMatch(/\.slice\(0,\s*16\)/);
  });
});
