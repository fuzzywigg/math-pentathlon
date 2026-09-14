/**
 * Wave 42 — Fraction Pinball hitRandomTarget mid-weight seeds.
 * Beyond wave41 0 / 0.999 extremes. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  TARGET_POINTS,
} from '../../src/games/fraction-pinball/types';
import { hitRandomTarget } from '../../src/games/fraction-pinball/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 pinball — hitRandomTarget mid seeds', () => {
  it('mid seeds stay inside TARGET_POINTS', () => {
    for (const seed of [0.1, 0.25, 0.5, 0.7, 0.85]) {
      vi.spyOn(Math, 'random').mockReturnValue(seed);
      const { points, target } = hitRandomTarget(createInitialState().targets);
      expect(TARGET_POINTS).toContain(points);
      expect(target.value).toBe(points);
      vi.restoreAllMocks();
    }
  });

  it('returned target is one of the provided targets', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
    const targets = createInitialState().targets;
    const hit = hitRandomTarget(targets);
    expect(targets.map((t) => t.id)).toContain(hit.target.id);
  });
});
