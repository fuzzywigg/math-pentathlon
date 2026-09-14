/**
 * Wave 44 — areCellsInBounds partial OOB leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { areCellsInBounds } from '../../src/core/polyomino';

describe('Wave 44 poly — areCellsInBounds', () => {
  it('all inside 3x3 → true; one OOB → false', () => {
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

  it('negative coords out of bounds', () => {
    expect(areCellsInBounds([{ row: -1, col: 0 }], 2, 2)).toBe(false);
  });
});
