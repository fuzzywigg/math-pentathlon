/**
 * Wave 44 — canonicalizeCells / sortCells leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { canonicalizeCells, sortCells, cellsToKey } from '../../src/core/polyomino';

describe('Wave 44 poly — canonicalize sort', () => {
  it('canonicalize normalizes then sorts; key stable under shuffle', () => {
    const cells = [
      { row: 5, col: 6 },
      { row: 5, col: 5 },
      { row: 6, col: 5 },
    ];
    const canon = canonicalizeCells(cells);
    expect(canon[0]).toEqual({ row: 0, col: 0 });
    expect(sortCells([{ row: 1, col: 2 }, { row: 0, col: 9 }])[0]).toEqual({
      row: 0,
      col: 9,
    });
    const shuffled = [cells[2], cells[0], cells[1]];
    expect(cellsToKey(shuffled)).toBe(cellsToKey(cells));
  });
});
