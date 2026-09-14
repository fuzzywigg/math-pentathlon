/**
 * Overnight HEAVY leftover after #234 — getAbsoluteCells ignores canFlip; getCellsAtPosition respects it.
 * Distinct from burn-wave44 (canRotate/O) and burn-wave38 (L canFlip true in SIMPLE). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getAbsoluteCells,
  getCellsAtPosition,
  cellsToKey,
  TETROMINOES,
} from '../../src/core/polyomino';

describe('Wave 52 core poly — absolute flip flag diverge', () => {
  it('L (canFlip false, asymmetric) flipped:true → absolute ≠ at-position keys', () => {
    const L = TETROMINOES.find((s) => s.id === 'L')!;
    expect(L.canFlip).toBe(false);
    const abs = getAbsoluteCells(L, { row: 1, col: 1 }, 0, true);
    const at = getCellsAtPosition(L, { row: 1, col: 1 }, 0, true);
    expect(cellsToKey(abs)).not.toBe(cellsToKey(at));
    expect(cellsToKey(at)).toBe(
      cellsToKey(getCellsAtPosition(L, { row: 1, col: 1 }, 0, false))
    );
  });
});
