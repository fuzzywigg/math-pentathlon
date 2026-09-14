/**
 * Wave 44 — getAbsoluteCells vs getCellsAtPosition when canRotate false. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getAbsoluteCells,
  getCellsAtPosition,
  TETROMINOES,
  cellsToKey,
} from '../../src/core/polyomino';

describe('Wave 44 poly — absolute vs at-position', () => {
  it('O at (2,3) with rotation 90 matches both APIs (flags ignored differently)', () => {
    const O = TETROMINOES.find((s) => s.id === 'O')!;
    // getCellsAtPosition respects canRotate=false → no rotate
    const at = getCellsAtPosition(O, { row: 2, col: 3 }, 90, false);
    // getAbsoluteCells uses transformCells which ignores canRotate
    const abs = getAbsoluteCells(O, { row: 2, col: 3 }, 90, false);
    // O is square so both should be equivalent under normalize key
    expect(cellsToKey(at)).toBe(cellsToKey(abs));
    expect(at.every((c) => c.row >= 2 && c.col >= 3)).toBe(true);
  });
});
