/**
 * Wave 28 — areCellsConnected / isAdjacent / areCellsInBounds / absolute cells.
 * Distinct from contiguous flood-fill (#139/#141) — polyomino cell-set helpers only.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  areCellsConnected,
  isAdjacent,
  areCellsInBounds,
  getCellsAtPosition,
  getAbsoluteCells,
  canonicalizeCells,
  sortCells,
  cellsToKey,
  SIMPLE_SHAPES,
  getPolyominoById,
  type Cell,
} from '../../src/core/polyomino';

describe('Wave 28 poly-connect — areCellsConnected flood', () => {
  it('empty and singleton are connected', () => {
    expect(areCellsConnected([])).toBe(true);
    expect(areCellsConnected([{ row: 0, col: 0 }])).toBe(true);
  });

  it('edge-adjacent cells are connected; diagonal-only are not', () => {
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ])
    ).toBe(true);
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 1, col: 1 },
      ])
    ).toBe(false);
  });

  it('standard catalog shapes are connected', () => {
    for (const shape of SIMPLE_SHAPES) {
      expect(areCellsConnected(shape.cells)).toBe(true);
    }
    for (const id of ['I', 'O', 'T', 'S', 'Z', 'J', 'L', 'F', 'X', 'W']) {
      const s = getPolyominoById(id);
      expect(s, id).toBeDefined();
      expect(areCellsConnected(s!.cells)).toBe(true);
    }
  });

  it('two separate islands fail connectivity', () => {
    const cells: Cell[] = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 3, col: 3 },
      { row: 3, col: 4 },
    ];
    expect(areCellsConnected(cells)).toBe(false);
  });
});

describe('Wave 28 poly-connect — isAdjacent 4-way', () => {
  const block: Cell[] = [
    { row: 1, col: 1 },
    { row: 1, col: 2 },
  ];

  it('cardinal neighbors are adjacent; diagonals alone are not', () => {
    expect(isAdjacent({ row: 1, col: 0 }, block)).toBe(true);
    expect(isAdjacent({ row: 0, col: 1 }, block)).toBe(true);
    expect(isAdjacent({ row: 1, col: 3 }, block)).toBe(true);
    expect(isAdjacent({ row: 2, col: 2 }, block)).toBe(true);
    expect(isAdjacent({ row: 0, col: 0 }, block)).toBe(false);
    // A cell already in the set is still "adjacent" to its neighbor in-set
    expect(isAdjacent({ row: 1, col: 1 }, block)).toBe(true);
  });

  it('empty set never reports adjacency', () => {
    expect(isAdjacent({ row: 0, col: 0 }, [])).toBe(false);
  });
});

describe('Wave 28 poly-connect — bounds and absolute placement', () => {
  it('areCellsInBounds rejects any OOB member', () => {
    const ok: Cell[] = [
      { row: 0, col: 0 },
      { row: 1, col: 2 },
    ];
    expect(areCellsInBounds(ok, 2, 3)).toBe(true);
    expect(areCellsInBounds([{ row: -1, col: 0 }], 2, 2)).toBe(false);
    expect(areCellsInBounds([{ row: 0, col: 2 }], 2, 2)).toBe(false);
    expect(areCellsInBounds([], 1, 1)).toBe(true);
  });

  it('getCellsAtPosition and getAbsoluteCells agree for allowed transforms', () => {
    const L = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;
    const pos = { row: 2, col: 3 };
    for (const rot of [0, 90, 180, 270] as const) {
      for (const flipped of [false, true]) {
        const a = getCellsAtPosition(L, pos, rot, flipped);
        const b = getAbsoluteCells(L, pos, rot, flipped);
        // getCellsAtPosition respects canFlip/canRotate; getAbsoluteCells
        // uses transformCells which always applies. For L both flags true → equal.
        expect(cellsToKey(a)).toBe(cellsToKey(b));
      }
    }
  });

  it('getAbsoluteCells places monomino at exact anchor', () => {
    const m = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    expect(getAbsoluteCells(m, { row: 4, col: 7 }, 0, false)).toEqual([
      { row: 4, col: 7 },
    ]);
  });

  it('canonicalizeCells normalizes then sorts', () => {
    const cells: Cell[] = [
      { row: 5, col: 6 },
      { row: 4, col: 5 },
      { row: 5, col: 5 },
    ];
    expect(canonicalizeCells(cells)).toEqual(
      sortCells([
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ])
    );
  });
});
