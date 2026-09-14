/**
 * Wave 28 — flip / normalize / bounding box / center / COM transforms.
 * Distinct from rotate matrix burn and wave 18 game-level rotate/flip chrome.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  flipCellsHorizontal,
  flipCellsVertical,
  normalizeCells,
  getBoundingBox,
  getBounds,
  centerCells,
  getCenterOfMass,
  sortCells,
  cellsToKey,
  translateCells,
  type Cell,
} from '../../src/core/polyomino';

function S(): Cell[] {
  return [
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
  ];
}

describe('Wave 28 poly-flip — horizontal and vertical mirrors', () => {
  it('horizontal flip of S yields Z-like shape after normalize', () => {
    const flipped = normalizeCells(flipCellsHorizontal(S()));
    expect(sortCells(flipped)).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ]);
  });

  it('vertical flip of L tromino mirrors across X after normalize', () => {
    const L: Cell[] = [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ];
    const flipped = normalizeCells(flipCellsVertical(L));
    expect(sortCells(flipped)).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ]);
  });

  it('double horizontal or vertical flip restores original cells', () => {
    const cells = S();
    expect(cellsToKey(flipCellsHorizontal(flipCellsHorizontal(cells)))).toBe(
      cellsToKey(cells)
    );
    expect(cellsToKey(flipCellsVertical(flipCellsVertical(cells)))).toBe(
      cellsToKey(cells)
    );
  });

  it('horizontal then vertical equals 180° for connected shapes after normalize', () => {
    const cells = S();
    const hv = normalizeCells(flipCellsVertical(flipCellsHorizontal(cells)));
    // Manual 180 via negate both axes then normalize
    const rot180 = normalizeCells(
      cells.map((c) => ({ row: -c.row, col: -c.col }))
    );
    expect(cellsToKey(hv)).toBe(cellsToKey(rot180));
  });
});

describe('Wave 28 poly-normalize — origin anchoring', () => {
  it('shifts arbitrary offset so min row/col become 0', () => {
    const cells: Cell[] = [
      { row: 5, col: -3 },
      { row: 6, col: -2 },
      { row: 7, col: -3 },
    ];
    const n = normalizeCells(cells);
    expect(Math.min(...n.map((c) => c.row))).toBe(0);
    expect(Math.min(...n.map((c) => c.col))).toBe(0);
    expect(sortCells(n)).toEqual([
      { row: 0, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 0 },
    ]);
  });

  it('empty input returns empty; single cell becomes origin', () => {
    expect(normalizeCells([])).toEqual([]);
    expect(normalizeCells([{ row: 9, col: -4 }])).toEqual([{ row: 0, col: 0 }]);
  });

  it('already-normalized cells keep relative geometry', () => {
    const cells = S();
    expect(normalizeCells(cells)).toEqual(cells);
  });
});

describe('Wave 28 poly-bbox — getBoundingBox vs getBounds', () => {
  it('reports width/height/min for skewed cells', () => {
    const cells: Cell[] = [
      { row: 2, col: 5 },
      { row: 4, col: 7 },
      { row: 3, col: 5 },
    ];
    expect(getBoundingBox(cells)).toEqual({
      width: 3,
      height: 3,
      minRow: 2,
      minCol: 5,
    });
    expect(getBounds(cells)).toEqual({
      minRow: 2,
      maxRow: 4,
      minCol: 5,
      maxCol: 7,
      width: 3,
      height: 3,
    });
  });

  it('empty cells return zeroed boxes', () => {
    expect(getBoundingBox([])).toEqual({
      width: 0,
      height: 0,
      minRow: 0,
      minCol: 0,
    });
    expect(getBounds([])).toEqual({
      minRow: 0,
      maxRow: 0,
      minCol: 0,
      maxCol: 0,
      width: 0,
      height: 0,
    });
  });

  it('single cell is 1×1', () => {
    expect(getBoundingBox([{ row: 3, col: 4 }])).toMatchObject({
      width: 1,
      height: 1,
      minRow: 3,
      minCol: 4,
    });
  });
});

describe('Wave 28 poly-center — centerCells and center of mass', () => {
  it('centers a 3×1 bar around origin with floor midpoints', () => {
    const bar: Cell[] = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ];
    const centered = centerCells(bar);
    expect(sortCells(centered)).toEqual([
      { row: 0, col: -1 },
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ]);
  });

  it('getCenterOfMass averages coordinates; empty is origin', () => {
    expect(getCenterOfMass([])).toEqual({ row: 0, col: 0 });
    expect(
      getCenterOfMass([
        { row: 0, col: 0 },
        { row: 0, col: 2 },
        { row: 2, col: 0 },
        { row: 2, col: 2 },
      ])
    ).toEqual({ row: 1, col: 1 });
  });

  it('translateCells accepts Cell offset and dual-number overload', () => {
    const cells: Cell[] = [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
    ];
    expect(translateCells(cells, { row: 2, col: 3 })).toEqual([
      { row: 2, col: 3 },
      { row: 3, col: 3 },
    ]);
    expect(translateCells(cells, 2, 3)).toEqual([
      { row: 2, col: 3 },
      { row: 3, col: 3 },
    ]);
  });
});
