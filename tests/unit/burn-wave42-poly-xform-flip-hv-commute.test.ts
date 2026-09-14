/**
 * Wave 42 — flip H/V commute with normalize leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  flipCellsHorizontal,
  flipCellsVertical,
  normalizeCells,
  cellsToKey,
  transformCells,
  rotateCells,
  TETROMINOES,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 42 poly-xform — flip hv commute', () => {
  it('double horizontal flip is identity', () => {
    const S = TETROMINOES.find((s) => s.id === 'S')!;
    const twice = flipCellsHorizontal(flipCellsHorizontal(S.cells));
    expect(cellsToKey(twice)).toBe(cellsToKey(S.cells));
  });

  it('double vertical flip is identity', () => {
    const Z = TETROMINOES.find((s) => s.id === 'Z')!;
    const twice = flipCellsVertical(flipCellsVertical(Z.cells));
    expect(cellsToKey(twice)).toBe(cellsToKey(Z.cells));
  });

  it('H then V equals V then H up to normalize', () => {
    const L = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;
    const hv = normalizeCells(
      flipCellsVertical(flipCellsHorizontal(L.cells))
    );
    const vh = normalizeCells(
      flipCellsHorizontal(flipCellsVertical(L.cells))
    );
    expect(cellsToKey(hv)).toBe(cellsToKey(vh));
  });

  it('transformCells flipped path matches manual H-then-rotate', () => {
    const J = TETROMINOES.find((s) => s.id === 'J')!;
    for (const rot of [0, 90, 180, 270] as const) {
      let manual = flipCellsHorizontal(J.cells);
      manual = normalizeCells(rotateCells(manual, rot));
      expect(cellsToKey(transformCells(J.cells, rot, true))).toBe(
        cellsToKey(manual)
      );
    }
  });

  it('unflipped transformCells equals rotate+normalize', () => {
    const T = TETROMINOES.find((s) => s.id === 'T')!;
    expect(cellsToKey(transformCells(T.cells, 90, false))).toBe(
      cellsToKey(normalizeCells(rotateCells(T.cells, 90)))
    );
  });
});
