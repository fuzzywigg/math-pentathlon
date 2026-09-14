/**
 * Overnight HEAVY leftover after #264 — flipCellsVertical mirrors rows.
 * Distinct from wave55 flip ignores flag / horizontal coverage. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  flipCellsVertical,
  flipCellsHorizontal,
  cellsToKey,
  normalizeCells,
} from '../../src/core/polyomino';

describe('Wave 57 core poly — flip vertical', () => {
  it('vertical flip differs from horizontal for L tromino cells', () => {
    const cells = [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ];
    const v = normalizeCells(flipCellsVertical(cells));
    const h = normalizeCells(flipCellsHorizontal(cells));
    expect(cellsToKey(v)).not.toBe(cellsToKey(h));
    expect(v.some((c) => c.row === 0 && c.col === 0)).toBe(true);
  });
});
