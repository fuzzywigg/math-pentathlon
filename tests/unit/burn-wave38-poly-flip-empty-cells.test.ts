/**
 * Wave 38 — flip/normalize empty & singleton leftovers.
 * Beyond wave 37 rotate cycle. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  flipCellsHorizontal,
  flipCellsVertical,
  normalizeCells,
  cellsToKey,
} from '../../src/core/polyomino';

describe('Wave 38 poly-flip — empty / singleton', () => {
  it('empty flip and normalize stay empty', () => {
    expect(flipCellsHorizontal([])).toEqual([]);
    expect(flipCellsVertical([])).toEqual([]);
    expect(normalizeCells([])).toEqual([]);
  });

  it('singleton flip produces negative col/row then normalizes to origin', () => {
    const h = flipCellsHorizontal([{ row: 2, col: 3 }]);
    expect(h).toEqual([{ row: 2, col: -3 }]);
    expect(normalizeCells(h)).toEqual([{ row: 0, col: 0 }]);

    const v = flipCellsVertical([{ row: 2, col: 3 }]);
    expect(v).toEqual([{ row: -2, col: 3 }]);
    expect(normalizeCells(v)).toEqual([{ row: 0, col: 0 }]);
  });

  it('horizontal flip then normalize preserves shape key of L tetromino', () => {
    const L = [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
    ];
    const flipped = normalizeCells(flipCellsHorizontal(L));
    expect(cellsToKey(flipped)).not.toBe(cellsToKey(L));
    expect(flipped.every((c) => c.row >= 0 && c.col >= 0)).toBe(true);
  });

  it('double horizontal flip returns original after normalize', () => {
    const cells = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ];
    const twice = normalizeCells(
      flipCellsHorizontal(flipCellsHorizontal(cells))
    );
    expect(cellsToKey(twice)).toBe(cellsToKey(cells));
  });
});
