/**
 * Wave 28 — polyomino geometry helpers (center/flip-vertical/bbox/normalize edges).
 * First coverage of centerCells / flipCellsVertical / getBoundingBox.
 * Distinct from polyomino.test normalize/rotate smoke. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  centerCells,
  flipCellsVertical,
  flipCellsHorizontal,
  getBoundingBox,
  normalizeCells,
  rotateCells,
  translateCells,
  cellsToKey,
  canonicalizeCells,
  sortCells,
  TETROMINOES,
  type Cell,
} from '../../src/core/polyomino';

describe('Wave 28 polyomino-geometry — getBoundingBox', () => {
  it('empty cells return zeroed box', () => {
    expect(getBoundingBox([])).toEqual({
      width: 0,
      height: 0,
      minRow: 0,
      minCol: 0,
    });
  });

  it('single cell is 1x1 at its origin', () => {
    expect(getBoundingBox([{ row: 5, col: -2 }])).toEqual({
      width: 1,
      height: 1,
      minRow: 5,
      minCol: -2,
    });
  });

  it('scattered cells report inclusive width/height', () => {
    const box = getBoundingBox([
      { row: 1, col: 2 },
      { row: 4, col: 2 },
      { row: 1, col: 7 },
    ]);
    expect(box).toEqual({
      width: 6,
      height: 4,
      minRow: 1,
      minCol: 2,
    });
  });

  it('I and O tetromino bounding boxes match known footprints', () => {
    const i = TETROMINOES.find((s) => s.id === 'I')!;
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    expect(getBoundingBox(i.cells)).toMatchObject({
      width: 4,
      height: 1,
      minRow: 0,
      minCol: 0,
    });
    expect(getBoundingBox(o.cells)).toMatchObject({
      width: 2,
      height: 2,
      minRow: 0,
      minCol: 0,
    });
  });
});

describe('Wave 28 polyomino-geometry — centerCells', () => {
  it('empty cells stay empty', () => {
    expect(centerCells([])).toEqual([]);
  });

  it('single cell centers to origin', () => {
    expect(centerCells([{ row: 3, col: 8 }])).toEqual([{ row: 0, col: 0 }]);
  });

  it('even-width footprint centers with floor offset', () => {
    // width 2 → offsetCol = minCol + floor(2/2) = minCol+1
    const centered = centerCells([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ]);
    expect(centered).toContainEqual({ row: 0, col: -1 });
    expect(centered).toContainEqual({ row: 0, col: 0 });
  });

  it('O-tetromino centers around (-0-ish) with cells in {-1,0}^2', () => {
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    const centered = centerCells(o.cells);
    for (const c of centered) {
      expect([-1, 0]).toContain(c.row);
      expect([-1, 0]).toContain(c.col);
    }
    expect(centered).toHaveLength(4);
  });

  it('centering then getBoundingBox keeps the same dimensions', () => {
    const t = TETROMINOES.find((s) => s.id === 'T')!;
    const before = getBoundingBox(t.cells);
    const after = getBoundingBox(centerCells(t.cells));
    expect(after.width).toBe(before.width);
    expect(after.height).toBe(before.height);
  });
});

describe('Wave 28 polyomino-geometry — flipCellsVertical', () => {
  it('mirrors across X axis (negates row)', () => {
    const cells: Cell[] = [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ];
    const flipped = flipCellsVertical(cells);
    expect(flipped.map((c) => ({ row: c.row || 0, col: c.col || 0 }))).toEqual([
      { row: 0, col: 0 },
      { row: -1, col: 0 },
      { row: -1, col: 1 },
    ]);
  });

  it('vertical then horizontal flip equals 180° rotation (normalized)', () => {
    const cells: Cell[] = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 2, col: 1 },
    ];
    const vh = normalizeCells(flipCellsHorizontal(flipCellsVertical(cells)));
    const rot180 = normalizeCells(rotateCells(cells, 180));
    expect(cellsToKey(vh)).toBe(cellsToKey(rot180));
  });

  it('double vertical flip restores original cells', () => {
    const cells: Cell[] = [
      { row: 2, col: -1 },
      { row: 3, col: 0 },
      { row: 4, col: 0 },
    ];
    expect(flipCellsVertical(flipCellsVertical(cells))).toEqual(cells);
  });

  it('normalized vertical flip of T differs from original when asymmetric in row', () => {
    const t = TETROMINOES.find((s) => s.id === 'T')!;
    const flipped = normalizeCells(flipCellsVertical(t.cells));
    // T has stem below; vertical flip then normalize yields stem above relative to bar
    expect(cellsToKey(flipped)).not.toBe(cellsToKey(t.cells));
    expect(flipped).toHaveLength(4);
  });
});

describe('Wave 28 polyomino-geometry — translate / canonicalize / sort edges', () => {
  it('translateCells number overload matches Cell offset overload', () => {
    const cells = [
      { row: 1, col: 2 },
      { row: 3, col: 4 },
    ];
    const viaObj = translateCells(cells, { row: 5, col: -1 });
    const viaNums = translateCells(cells, 5, -1);
    expect(viaObj).toEqual(viaNums);
  });

  it('canonicalizeCells is normalize then sort', () => {
    const cells = [
      { row: 5, col: 6 },
      { row: 4, col: 7 },
      { row: 4, col: 6 },
    ];
    expect(canonicalizeCells(cells)).toEqual(sortCells(normalizeCells(cells)));
    expect(canonicalizeCells(cells)[0]).toEqual({ row: 0, col: 0 });
  });

  it('sortCells is stable for already-sorted input and does not mutate', () => {
    const cells = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ];
    const copy = cells.map((c) => ({ ...c }));
    const sorted = sortCells(cells);
    expect(sorted).toEqual(copy);
    expect(sorted).not.toBe(cells);
  });
});
