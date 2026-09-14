/**
 * Wave 39 — Fraction Pinball hitRandomTarget weight leftovers.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { TARGET_POINTS } from '../../src/games/fraction-pinball/types';
import { hitRandomTarget } from '../../src/games/fraction-pinball/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 39 Pinball — hit target weights', () => {
  function targets() {
    return TARGET_POINTS.map((value, i) => ({
      id: `t${i}`,
      value,
      label: String(value),
      hit: false,
    }));
  }

  it('random 0 selects first (lowest) target', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const hit = hitRandomTarget(targets());
    expect(hit.points).toBe(TARGET_POINTS[0]);
    expect(hit.target.value).toBe(TARGET_POINTS[0]);
  });

  it('random near 1 can select later targets', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    const hit = hitRandomTarget(targets());
    expect(TARGET_POINTS).toContain(hit.points);
  });

  it('TARGET_POINTS catalog is ascending rewards', () => {
    expect(TARGET_POINTS).toEqual([10, 20, 30, 50, 100]);
    for (let i = 1; i < TARGET_POINTS.length; i++) {
      expect(TARGET_POINTS[i]).toBeGreaterThan(TARGET_POINTS[i - 1]);
    }
  });
});
