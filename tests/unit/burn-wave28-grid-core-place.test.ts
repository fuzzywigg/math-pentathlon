/**
 * Wave 28 — Grid create / occupy / place / remove immutability matrix.
 * Distinct from thin createGrid smoke in polyomino.test and wave 21 Board solve.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createGrid,
  isCellOccupied,
  isValidPlacement,
  placePolyomino,
  removePolyomino,
  SIMPLE_SHAPES,
  TETROMINOES,
  getPolyominoById,
  type Grid,
} from '../../src/core/polyomino';

function mono() {
  return SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
}

function occupiedCount(grid: Grid): number {
  let n = 0;
  for (const row of grid.cells) {
    for (const cell of row) {
      if (cell.occupied) n++;
    }
  }
  return n;
}

describe('Wave 28 grid-core — createGrid structure', () => {
  it('tags kind=grid and zeros all cells', () => {
    const g = createGrid(3, 4);
    expect(g.kind).toBe('grid');
    expect(g.rows).toBe(3);
    expect(g.cols).toBe(4);
    expect(g.placements).toEqual([]);
    expect(g.cells).toHaveLength(3);
    expect(g.cells[0]).toHaveLength(4);
    for (const row of g.cells) {
      for (const cell of row) {
        expect(cell).toEqual({ occupied: false });
      }
    }
  });

  it('supports 1×1 and wide skinny grids', () => {
    const tiny = createGrid(1, 1);
    expect(occupiedCount(tiny)).toBe(0);
    const wide = createGrid(1, 8);
    expect(wide.cells[0]).toHaveLength(8);
  });
});

describe('Wave 28 grid-core — isCellOccupied bounds', () => {
  it('treats every out-of-bounds coordinate as occupied', () => {
    const g = createGrid(2, 2);
    expect(isCellOccupied(g, -1, 0)).toBe(true);
    expect(isCellOccupied(g, 0, -1)).toBe(true);
    expect(isCellOccupied(g, 2, 0)).toBe(true);
    expect(isCellOccupied(g, 0, 2)).toBe(true);
    expect(isCellOccupied(g, 0, 0)).toBe(false);
  });

  it('reports true after placement', () => {
    let g = createGrid(3, 3);
    g = placePolyomino(g, mono(), { row: 1, col: 1 });
    expect(isCellOccupied(g, 1, 1)).toBe(true);
    expect(isCellOccupied(g, 0, 0)).toBe(false);
  });
});

describe('Wave 28 grid-core — isValidPlacement gates', () => {
  it('accepts monomino anywhere on empty 2×2', () => {
    const g = createGrid(2, 2);
    const m = mono();
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        expect(isValidPlacement(g, m, { row: r, col: c })).toBe(true);
      }
    }
  });

  it('rejects OOB and overlap for O-tetromino', () => {
    const g = createGrid(3, 3);
    const O = getPolyominoById('O')!;
    expect(isValidPlacement(g, O, { row: 0, col: 0 })).toBe(true);
    expect(isValidPlacement(g, O, { row: 2, col: 0 })).toBe(false);
    expect(isValidPlacement(g, O, { row: 0, col: 2 })).toBe(false);
    const filled = placePolyomino(g, O, { row: 0, col: 0 });
    expect(isValidPlacement(filled, O, { row: 1, col: 1 })).toBe(false);
  });

  it('Grid placement path always uses rotation 0 / unflipped geometry', () => {
    // Documented Grid API quirk: isValidPlacement ignores orientation args.
    const g = createGrid(4, 1);
    const I = getPolyominoById('I')!;
    // Horizontal I cannot fit in 4×1, even though vertical would.
    expect(isValidPlacement(g, I, { row: 0, col: 0 })).toBe(false);
  });
});

describe('Wave 28 grid-core — place / remove immutability', () => {
  it('placePolyomino deep-copies cells and appends placement', () => {
    const g0 = createGrid(3, 3);
    const T = TETROMINOES.find((s) => s.id === 'T')!;
    const g1 = placePolyomino(g0, T, { row: 0, col: 0 });
    expect(g0.placements).toHaveLength(0);
    expect(occupiedCount(g0)).toBe(0);
    expect(g1.placements).toHaveLength(1);
    expect(g1.placements[0]).toMatchObject({
      position: { row: 0, col: 0 },
      rotation: 0,
      flipped: false,
    });
    expect(g1.cells[0][0].polyominoId).toBe('T');
    expect(g1.cells[0][1].polyominoId).toBe('T');
    expect(g1.cells[0][2].polyominoId).toBe('T');
    expect(g1.cells[1][1].polyominoId).toBe('T');
    expect(occupiedCount(g1)).toBe(4);
  });

  it('removePolyomino clears matching cells and placement records', () => {
    let g = createGrid(4, 4);
    const m1 = { ...mono(), id: 'a' };
    const m2 = { ...mono(), id: 'b' };
    g = placePolyomino(g, m1, { row: 0, col: 0 });
    g = placePolyomino(g, m2, { row: 1, col: 1 });
    expect(occupiedCount(g)).toBe(2);
    const cleared = removePolyomino(g, 'a');
    expect(cleared.cells[0][0]).toEqual({ occupied: false });
    expect(cleared.cells[1][1].polyominoId).toBe('b');
    expect(cleared.placements.map((p) => p.polyomino.id)).toEqual(['b']);
    expect(g.placements).toHaveLength(2); // original untouched
  });

  it('remove unknown id is a no-op copy with same occupancy', () => {
    let g = createGrid(2, 2);
    g = placePolyomino(g, mono(), { row: 0, col: 0 });
    const same = removePolyomino(g, 'ghost');
    expect(occupiedCount(same)).toBe(1);
    expect(same.placements).toHaveLength(1);
  });

  it('chained placements fill a 2×2 with four monominoes', () => {
    let g = createGrid(2, 2);
    const ids = ['m0', 'm1', 'm2', 'm3'];
    let i = 0;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        g = placePolyomino(g, { ...mono(), id: ids[i++] }, { row: r, col: c });
      }
    }
    expect(occupiedCount(g)).toBe(4);
    expect(g.placements).toHaveLength(4);
    for (const row of g.cells) {
      for (const cell of row) {
        expect(cell.occupied).toBe(true);
      }
    }
  });
});
