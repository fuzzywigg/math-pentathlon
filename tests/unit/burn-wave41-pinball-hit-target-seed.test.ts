/**
 * Wave 41 — Fraction Pinball hitRandomTarget empty + weighted Math.random seed.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  TARGET_POINTS,
  type PinballTarget,
} from '../../src/games/fraction-pinball/types';
import { hitRandomTarget } from '../../src/games/fraction-pinball/rules';

afterEach(() => vi.restoreAllMocks());

function targetsFromPoints(): PinballTarget[] {
  return TARGET_POINTS.map((value, i) => ({
    id: `t${i}`,
    value,
    label: String(value),
    hit: false,
  }));
}

describe('Wave 41 Pinball — hitRandomTarget empty / weights', () => {
  it('empty targets throws when resolving points', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(() => hitRandomTarget([])).toThrow();
  });

  it('seed 0 prefers first (lowest) target via weight bias', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const hit = hitRandomTarget(targetsFromPoints());
    expect(hit.target.value).toBe(TARGET_POINTS[0]);
    expect(hit.points).toBe(TARGET_POINTS[0]);
  });

  it('seed near 1 can reach later higher-value targets', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    const hit = hitRandomTarget(targetsFromPoints());
    expect(TARGET_POINTS).toContain(hit.points);
    expect(hit.target.value).toBe(hit.points);
    // High seed should not always land on the first bucket
    expect(hit.points).toBe(TARGET_POINTS[TARGET_POINTS.length - 1]);
  });

  it('createInitialState targets stay in TARGET_POINTS', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const { targets } = createInitialState();
    const hit = hitRandomTarget(targets);
    expect(TARGET_POINTS).toContain(hit.points);
  });
});
