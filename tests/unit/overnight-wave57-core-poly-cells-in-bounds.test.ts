/**
 * Overnight HEAVY leftover after #264 — areCellsInBounds true/false matrix.
 * Distinct from wave56 mouse in-bounds. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { areCellsInBounds } from '../../src/core/polyomino';

describe('Wave 57 core poly — areCellsInBounds', () => {
  it('all in 3x3 true; one OOB false', () => {
    expect(
      areCellsInBounds(
        [
          { row: 0, col: 0 },
          { row: 2, col: 2 },
        ],
        3,
        3
      )
    ).toBe(true);
    expect(
      areCellsInBounds(
        [
          { row: 0, col: 0 },
          { row: 3, col: 0 },
        ],
        3,
        3
      )
    ).toBe(false);
  });
});
