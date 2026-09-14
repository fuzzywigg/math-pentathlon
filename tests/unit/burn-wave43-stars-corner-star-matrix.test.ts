/**
 * Wave 43 — star corners + center leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';

describe('Wave 43 stars — corner star matrix', () => {
  it('corners and center are stars', () => {
    const s = createInitialState();
    const stars = [
      [0, 0],
      [0, 4],
      [2, 2],
      [4, 0],
      [4, 4],
    ];
    for (const [r, c] of stars) {
      expect(s.cells[r][c].isStar).toBe(true);
    }
    expect(s.cells[1][1].isStar).toBe(false);
  });
});
