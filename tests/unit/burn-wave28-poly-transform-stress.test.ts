/**
 * Wave 28 — transformCells / getAbsoluteCells / rotate+flip combinatorial stress.
 * Distinct from orientation-flag burn; focuses on free transformCells path.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  transformCells,
  getAbsoluteCells,
  getAllTransformations,
  cellsToKey,
  normalizeCells,
  rotateCells,
  flipCellsHorizontal,
  SIMPLE_SHAPES,
  TETROMINOES,
  PENTOMINOES,
  type Rotation,
  type Cell,
} from '../../src/core/polyomino';

const ROTS: Rotation[] = [0, 90, 180, 270];

describe('Wave 28 poly-transform-stress — transformCells free path', () => {
  it('compose flip then rotate equals transformCells for L tromino', () => {
    const L = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;
    for (const flipped of [false, true]) {
      for (const rot of ROTS) {
        let manual = L.cells;
        if (flipped) manual = flipCellsHorizontal(manual);
        manual = normalizeCells(rotateCells(manual, rot));
        expect(cellsToKey(transformCells(L.cells, rot, flipped))).toBe(
          cellsToKey(manual)
        );
      }
    }
  });

  it('all 8 free transforms of F are unique', () => {
    const F = PENTOMINOES.find((s) => s.id === 'F')!;
    const keys = new Set<string>();
    for (const flipped of [false, true]) {
      for (const rot of ROTS) {
        keys.add(cellsToKey(transformCells(F.cells, rot, flipped)));
      }
    }
    expect(keys.size).toBe(8);
  });

  it('getAllTransformations keys equal free 8-orbit unique set', () => {
    for (const shape of [...TETROMINOES, ...PENTOMINOES.slice(0, 6)]) {
      const fromApi = new Set(
        getAllTransformations(shape).map((s) => cellsToKey(s.cells))
      );
      const manual = new Set<string>();
      for (const flipped of [false, true]) {
        for (const rot of ROTS) {
          manual.add(cellsToKey(transformCells(shape.cells, rot, flipped)));
        }
      }
      expect(fromApi).toEqual(manual);
    }
  });
});

describe('Wave 28 poly-transform-stress — absolute placement grid cover', () => {
  it('every absolute cell of T at (0,0) lands inside 3×3', () => {
    const T = TETROMINOES.find((s) => s.id === 'T')!;
    const cells = getAbsoluteCells(T, { row: 0, col: 0 }, 0, false);
    expect(cells).toHaveLength(4);
    expect(
      cells.every((c) => c.row >= 0 && c.row < 3 && c.col >= 0 && c.col < 3)
    ).toBe(true);
  });

  it('translating absolute cells by (dr,dc) shifts every coordinate', () => {
    const I = TETROMINOES.find((s) => s.id === 'I')!;
    const base = getAbsoluteCells(I, { row: 0, col: 0 }, 0, false);
    const moved = getAbsoluteCells(I, { row: 2, col: 3 }, 0, false);
    expect(moved).toEqual(
      base.map((c) => ({ row: c.row + 2, col: c.col + 3 }))
    );
  });

  it('vertical I absolute cells form a contiguous column', () => {
    const I = TETROMINOES.find((s) => s.id === 'I')!;
    const cells = getAbsoluteCells(I, { row: 1, col: 2 }, 90, false);
    expect(cells.map((c) => c.col)).toEqual([2, 2, 2, 2]);
    expect(cells.map((c) => c.row).sort((a, b) => a - b)).toEqual([1, 2, 3, 4]);
  });
});

describe('Wave 28 poly-transform-stress — invariant properties', () => {
  it('transform never changes cell count', () => {
    for (const shape of [...SIMPLE_SHAPES, ...TETROMINOES]) {
      for (const flipped of [false, true]) {
        for (const rot of ROTS) {
          expect(transformCells(shape.cells, rot, flipped)).toHaveLength(
            shape.cells.length
          );
        }
      }
    }
  });

  it('normalized transform always includes a (0,*) or (*,0) origin cell', () => {
    const S = TETROMINOES.find((s) => s.id === 'S')!;
    for (const flipped of [false, true]) {
      for (const rot of ROTS) {
        const cells = transformCells(S.cells, rot, flipped);
        expect(Math.min(...cells.map((c) => c.row))).toBe(0);
        expect(Math.min(...cells.map((c) => c.col))).toBe(0);
      }
    }
  });

  it('cellsToKey is permutation-invariant', () => {
    const cells: Cell[] = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
    ];
    const shuffled = [cells[2], cells[0], cells[1]];
    expect(cellsToKey(cells)).toBe(cellsToKey(shuffled));
  });
});
