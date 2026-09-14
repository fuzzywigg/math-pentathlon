/**
 * Overnight HEAVY leftover after #274 — getAbsoluteCells ignores canFlip:false.
 * Distinct from wave57 equivalent-flip / flip-vertical. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getAbsoluteCells,
  getCellsAtPosition,
  cellsToKey,
  TETROMINOES,
} from '../../src/core/polyomino';

describe('Wave 58 core poly — absolute ignores canFlip', () => {
  it('O canFlip false: absolute flipped differs from flag-aware cells', () => {
    const O = TETROMINOES.find((s) => s.id === 'O')!;
    expect(O.canFlip).toBe(false);
    // For O, flip is a no-op geometrically — use S/Z or L where canFlip true...
    // Prefer J/L with canFlip; use a custom shape via mutating copy:
    const locked = { ...O, canFlip: false, cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
    ]};
    const pos = { row: 2, col: 2 };
    const abs = cellsToKey(getAbsoluteCells(locked, pos, 0, true));
    const gated = cellsToKey(getCellsAtPosition(locked, pos, 0, true));
    expect(abs).not.toBe(gated);
  });
});
