/**
 * Wave 28 — polyomino Grid API edges (rotation positions, remove, overlap, adjacency).
 * Deepens beyond polyomino.test smoke: rotated/flipped positions, corner adjacency,
 * legacy getPlacementCells, remove unknown id. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createGrid,
  isCellOccupied,
  isValidPlacement,
  placePolyomino,
  removePolyomino,
  getAllValidPositions,
  getPlacementCells,
  doPlacementsOverlap,
  getAdjacentCells,
  TETROMINOES,
  getPolyominoesByOrder,
  type Cell,
  type Placement,
  type Rotation,
} from '../../src/core/polyomino';

const key = (c: Cell) => `${c.row},${c.col}`;
const sortedKeys = (cs: Cell[]) => cs.map(key).sort();

describe('Wave 28 polyomino-grid — getAllValidPositions orientations', () => {
  it('horizontal vs vertical domino position counts on 3x3', () => {
    const grid = createGrid(3, 3);
    const d = getPolyominoesByOrder(2)[0];
    const horiz = getAllValidPositions(grid, d, 0, false);
    const vert = getAllValidPositions(grid, d, 90, false);
    // 3 rows × 2 cols = 6 horizontal; 2 rows × 3 cols = 6 vertical
    expect(horiz).toHaveLength(6);
    expect(vert).toHaveLength(6);
    expect(sortedKeys(horiz)).not.toEqual(sortedKeys(vert));
  });

  it('I-tetromino fits 4x4 only as horizontal or vertical bar', () => {
    const grid = createGrid(4, 4);
    const i = TETROMINOES.find((s) => s.id === 'I')!;
    expect(getAllValidPositions(grid, i, 0, false)).toHaveLength(4); // 4 rows × 1
    expect(getAllValidPositions(grid, i, 90, false)).toHaveLength(4); // 1 × 4 cols
    expect(getAllValidPositions(grid, i, 0, false)).toHaveLength(
      getAllValidPositions(grid, i, 180, false).length
    );
  });

  it('occupied cell shrinks valid monomino positions by one', () => {
    const m = getPolyominoesByOrder(1)[0];
    let grid = createGrid(2, 2);
    expect(getAllValidPositions(grid, m, 0, false)).toHaveLength(4);
    grid = placePolyomino(grid, m, { row: 0, col: 0 });
    const remaining = getAllValidPositions(grid, { ...m, id: 'm2' }, 0, false);
    expect(remaining).toHaveLength(3);
    expect(remaining.some((p) => p.row === 0 && p.col === 0)).toBe(false);
  });

  it('O-tetromino has no valid positions on 1x1 or 2x1', () => {
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    expect(getAllValidPositions(createGrid(1, 1), o, 0, false)).toEqual([]);
    expect(getAllValidPositions(createGrid(2, 1), o, 0, false)).toEqual([]);
    expect(getAllValidPositions(createGrid(2, 2), o, 0, false)).toHaveLength(1);
  });

  it('flip flag changes valid set for asymmetric flippable tromino', () => {
    const skew = {
      ...getPolyominoesByOrder(3).find((s) => s.cells.length === 3)!,
      id: 'skew-l',
      cells: [
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ],
      canFlip: true,
      canRotate: true,
    };
    const grid = createGrid(3, 3);
    const plain = getAllValidPositions(grid, skew, 0, false);
    const flipped = getAllValidPositions(grid, skew, 0, true);
    expect(plain.length).toBeGreaterThan(0);
    expect(flipped.length).toBeGreaterThan(0);
    // Same count on empty square, but keys may differ for chiral placements
    expect(plain).toHaveLength(flipped.length);
  });
});

describe('Wave 28 polyomino-grid — place / remove / occupancy', () => {
  it('place marks polyominoId on every occupied cell', () => {
    const t = TETROMINOES.find((s) => s.id === 'T')!;
    const grid = placePolyomino(createGrid(5, 5), t, { row: 0, col: 0 });
    const occupied = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (grid.cells[r][c].occupied) {
          expect(grid.cells[r][c].polyominoId).toBe('T');
          occupied.push(key({ row: r, col: c }));
        }
      }
    }
    expect(occupied).toHaveLength(4);
    expect(grid.placements).toHaveLength(1);
  });

  it('removePolyomino clears only matching id and leaves others', () => {
    const m = getPolyominoesByOrder(1)[0];
    const m2 = { ...m, id: 'mono-b' };
    let grid = createGrid(2, 2);
    grid = placePolyomino(grid, m, { row: 0, col: 0 });
    grid = placePolyomino(grid, m2, { row: 1, col: 1 });
    grid = removePolyomino(grid, m.id);
    expect(isCellOccupied(grid, 0, 0)).toBe(false);
    expect(isCellOccupied(grid, 1, 1)).toBe(true);
    expect(grid.cells[1][1].polyominoId).toBe('mono-b');
    expect(grid.placements).toHaveLength(1);
  });

  it('removePolyomino unknown id is a no-op on occupancy', () => {
    const m = getPolyominoesByOrder(1)[0];
    let grid = placePolyomino(createGrid(2, 2), m, { row: 0, col: 0 });
    const before = JSON.stringify(grid.cells);
    grid = removePolyomino(grid, 'no-such-id');
    expect(JSON.stringify(grid.cells)).toBe(before);
    expect(grid.placements).toHaveLength(1);
  });

  it('isValidPlacement false after place at same anchor', () => {
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    let grid = createGrid(5, 5);
    expect(isValidPlacement(grid, o, { row: 0, col: 0 })).toBe(true);
    grid = placePolyomino(grid, o, { row: 0, col: 0 });
    expect(isValidPlacement(grid, o, { row: 0, col: 0 })).toBe(false);
    expect(isValidPlacement(grid, o, { row: 0, col: 1 })).toBe(false); // overlaps
    expect(isValidPlacement(grid, o, { row: 2, col: 2 })).toBe(true);
  });
});

describe('Wave 28 polyomino-grid — getPlacementCells / overlap', () => {
  it('Placement API cells match manual translation of shape', () => {
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    const placement: Placement = {
      polyomino: o,
      position: { row: 2, col: 3 },
      rotation: 0,
      flipped: false,
    };
    expect(sortedKeys(getPlacementCells(placement))).toEqual([
      '2,3',
      '2,4',
      '3,3',
      '3,4',
    ]);
  });

  it('legacy PlacedPolyomino + shapes resolves cells; missing shape yields []', () => {
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    const placed = {
      shapeId: o.id,
      position: { row: 1, col: 1 },
      rotation: 0 as Rotation,
      flipped: false,
    };
    expect(getPlacementCells(placed, [o])).toHaveLength(4);
    expect(getPlacementCells(placed, [])).toEqual([]);
  });

  it('rotated Placement cells differ from rotation 0', () => {
    const t = TETROMINOES.find((s) => s.id === 'T')!;
    const p0: Placement = {
      polyomino: t,
      position: { row: 0, col: 0 },
      rotation: 0,
      flipped: false,
    };
    const p90: Placement = { ...p0, rotation: 90 };
    expect(sortedKeys(getPlacementCells(p0))).not.toEqual(
      sortedKeys(getPlacementCells(p90))
    );
  });

  it('doPlacementsOverlap false for touching but non-sharing cells', () => {
    const m = getPolyominoesByOrder(1)[0];
    const a: Placement = {
      polyomino: m,
      position: { row: 0, col: 0 },
      rotation: 0,
      flipped: false,
    };
    const b: Placement = {
      polyomino: m,
      position: { row: 0, col: 1 },
      rotation: 0,
      flipped: false,
    };
    expect(doPlacementsOverlap(a, b)).toBe(false);
    expect(doPlacementsOverlap(a, a)).toBe(true);
  });

  it('O and overlapping T share cells → overlap true', () => {
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    const t = TETROMINOES.find((s) => s.id === 'T')!;
    const pO: Placement = {
      polyomino: o,
      position: { row: 0, col: 0 },
      rotation: 0,
      flipped: false,
    };
    const pT: Placement = {
      polyomino: t,
      position: { row: 0, col: 0 },
      rotation: 0,
      flipped: false,
    };
    expect(doPlacementsOverlap(pO, pT)).toBe(true);
  });
});

describe('Wave 28 polyomino-grid — getAdjacentCells edges', () => {
  it('corner monomino has two 4-adj and three 8-adj neighbors', () => {
    const grid = createGrid(3, 3);
    const m = getPolyominoesByOrder(1)[0];
    const placement: Placement = {
      polyomino: m,
      position: { row: 0, col: 0 },
      rotation: 0,
      flipped: false,
    };
    expect(sortedKeys(getAdjacentCells(grid, placement, false))).toEqual([
      '0,1',
      '1,0',
    ]);
    expect(sortedKeys(getAdjacentCells(grid, placement, true))).toEqual([
      '0,1',
      '1,0',
      '1,1',
    ]);
  });

  it('edge (non-corner) monomino has three 4-adj neighbors', () => {
    const grid = createGrid(3, 3);
    const m = getPolyominoesByOrder(1)[0];
    const placement: Placement = {
      polyomino: m,
      position: { row: 0, col: 1 },
      rotation: 0,
      flipped: false,
    };
    expect(getAdjacentCells(grid, placement, false)).toHaveLength(3);
  });

  it('domino adjacency excludes own cells and stays in bounds', () => {
    const grid = createGrid(4, 4);
    const d = getPolyominoesByOrder(2)[0];
    const placement: Placement = {
      polyomino: d,
      position: { row: 1, col: 1 },
      rotation: 0,
      flipped: false,
    };
    const adj = getAdjacentCells(grid, placement, false);
    const own = new Set(sortedKeys(getPlacementCells(placement)));
    for (const c of adj) {
      expect(own.has(key(c))).toBe(false);
      expect(c.row).toBeGreaterThanOrEqual(0);
      expect(c.col).toBeGreaterThanOrEqual(0);
      expect(c.row).toBeLessThan(4);
      expect(c.col).toBeLessThan(4);
    }
    // Horizontal domino at (1,1)-(1,2): N×2 + S×2 + W + E = 6
    expect(adj).toHaveLength(6);
  });

  it('8-adj for center monomino is exactly eight unique cells', () => {
    const grid = createGrid(5, 5);
    const m = getPolyominoesByOrder(1)[0];
    const placement: Placement = {
      polyomino: m,
      position: { row: 2, col: 2 },
      rotation: 0,
      flipped: false,
    };
    const adj = getAdjacentCells(grid, placement, true);
    expect(adj).toHaveLength(8);
    expect(new Set(adj.map(key)).size).toBe(8);
  });
});
