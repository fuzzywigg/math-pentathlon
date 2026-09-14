/**
 * Wave 42 — Hex game neighbor symmetry on interior cells. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getNeighbors } from '../../src/games/hex/rules';

describe('Wave 42 hex-game — neighbor symmetry', () => {
  it('interior cell has 6 neighbors; reciprocity holds', () => {
    const size = 7;
    const origin = { row: 3, col: 3 };
    const n = getNeighbors(origin, size);
    expect(n).toHaveLength(6);
    for (const nb of n) {
      const back = getNeighbors(nb, size);
      expect(back.some((p) => p.row === origin.row && p.col === origin.col)).toBe(
        true
      );
    }
  });
});
