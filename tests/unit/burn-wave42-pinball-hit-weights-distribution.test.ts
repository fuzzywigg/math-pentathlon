/**
 * Wave 42 — Pinball hitRandomTarget weight distribution stress. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hitRandomTarget } from '../../src/games/fraction-pinball/rules';
import { TARGET_POINTS, createInitialState } from '../../src/games/fraction-pinball/types';

describe('Wave 42 pinball — hit weights', () => {
  it('samples stay in TARGET_POINTS; lower values more frequent', () => {
    const state = createInitialState();
    const counts = new Map<number, number>();
    for (let i = 0; i < 200; i++) {
      const { points } = hitRandomTarget(state.targets);
      expect(TARGET_POINTS).toContain(points);
      counts.set(points, (counts.get(points) ?? 0) + 1);
    }
    expect(counts.get(10) ?? 0).toBeGreaterThan(counts.get(100) ?? 0);
  });
});
