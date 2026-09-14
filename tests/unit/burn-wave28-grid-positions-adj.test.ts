/**
 * Wave 28 — getAllValidPositions / getPlacementCells / overlap / adjacent.
 * Distinct from grid-core place/remove and Board findValidPlacements.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createGrid,
  placePolyomino,
  getAllValidPositions,
  getPlacementCells,
  doPlacementsOverlap,
  getAdjacentCells,
  SIMPLE_SHAPES,
  getPolyominoById,
  type Placement,
  type Rotation,
} from '../../src/core/polyomino';

function mono() {
  return SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
}

function domino() {
  return SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
}

describe('Wave 28 grid-positions — getAllValidPositions matrix', () => {
  it('monomino has rows*cols positions on empty grid', () => {
    const g = createGrid(3, 4);
    expect(getAllValidPositions(g, mono(), 0, false)).toHaveLength(12);
  });

  it('domino horizontal vs vertical position counts differ on 2×3', () => {
    const g = createGrid(2, 3);
    const d = domino();
    const horiz = getAllValidPositions(g, d, 0, false);
    const vert = getAllValidPositions(g, d, 90, false);
    expect(horiz).toHaveLength(4); // 2 rows × 2 cols
    expect(vert).toHaveLength(3); // 1 row × 3 cols
    expect(horiz.every((p) => p.row >= 0 && p.col >= 0)).toBe(true);
  });

  it('occupied cells shrink the valid set', () => {
    let g = createGrid(3, 3);
    g = placePolyomino(g, mono(), { row: 1, col: 1 });
    const positions = getAllValidPositions(g, mono(), 0, false);
    expect(positions).toHaveLength(8);
    expect(positions.some((p) => p.row === 1 && p.col === 1)).toBe(false);
  });

  it('I-tetromino fits only as vertical on 4×1', () => {
    const g = createGrid(4, 1);
    const I = getPolyominoById('I')!;
    expect(getAllValidPositions(g, I, 0, false)).toEqual([]);
    const vertical = getAllValidPositions(g, I, 90, false);
    expect(vertical).toHaveLength(1);
    expect(vertical[0].row || 0).toBe(0);
    expect(vertical[0].col || 0).toBe(0);
  });

  it('tromino-L orientations produce at least one nonempty position set on 3×2', () => {
    const g = createGrid(3, 2);
    const L = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;
    const nonempty: string[] = [];
    for (const rot of [0, 90, 180, 270] as Rotation[]) {
      for (const flip of [false, true]) {
        const pos = getAllValidPositions(g, L, rot, flip);
        if (pos.length > 0) {
          nonempty.push(
            `${rot}/${flip}:${pos.map((p) => `${p.row},${p.col}`).join(';')}`
          );
        }
      }
    }
    // L tromino mirrors are rotation-equivalent — still must fit somewhere
    expect(nonempty.length).toBeGreaterThan(0);
  });
});

describe('Wave 28 grid-positions — placement cells and overlap', () => {
  it('getPlacementCells applies rotation and flip on Placement records', () => {
    const d = domino();
    const p: Placement = {
      polyomino: d,
      position: { row: 1, col: 2 },
      rotation: 90,
      flipped: false,
    };
    expect(getPlacementCells(p)).toEqual([
      { row: 1, col: 2 },
      { row: 2, col: 2 },
    ]);
  });

  it('doPlacementsOverlap detects shared cells and misses neighbors', () => {
    const m = mono();
    const a: Placement = {
      polyomino: m,
      position: { row: 0, col: 0 },
      rotation: 0,
      flipped: false,
    };
    const b: Placement = {
      polyomino: m,
      position: { row: 0, col: 0 },
      rotation: 0,
      flipped: false,
    };
    const c: Placement = {
      polyomino: m,
      position: { row: 0, col: 1 },
      rotation: 0,
      flipped: false,
    };
    expect(doPlacementsOverlap(a, b)).toBe(true);
    expect(doPlacementsOverlap(a, c)).toBe(false);
  });

  it('rotated domino overlaps monomino on the stem cell', () => {
    const d = domino();
    const m = mono();
    const bar: Placement = {
      polyomino: d,
      position: { row: 0, col: 0 },
      rotation: 90,
      flipped: false,
    };
    const mid: Placement = {
      polyomino: m,
      position: { row: 1, col: 0 },
      rotation: 0,
      flipped: false,
    };
    expect(doPlacementsOverlap(bar, mid)).toBe(true);
  });
});

describe('Wave 28 grid-positions — getAdjacentCells 4 vs 8', () => {
  it('monomino in center has 4 ortho and 8 Moore neighbors', () => {
    const g = createGrid(3, 3);
    const p: Placement = {
      polyomino: mono(),
      position: { row: 1, col: 1 },
      rotation: 0,
      flipped: false,
    };
    const ortho = getAdjacentCells(g, p, false);
    const moore = getAdjacentCells(g, p, true);
    expect(ortho).toHaveLength(4);
    expect(moore).toHaveLength(8);
    expect(
      ortho.every((c) => Math.abs(c.row - 1) + Math.abs(c.col - 1) === 1)
    ).toBe(true);
  });

  it('corner monomino clips neighbors to board', () => {
    const g = createGrid(3, 3);
    const p: Placement = {
      polyomino: mono(),
      position: { row: 0, col: 0 },
      rotation: 0,
      flipped: false,
    };
    expect(getAdjacentCells(g, p, false)).toHaveLength(2);
    expect(getAdjacentCells(g, p, true)).toHaveLength(3);
  });

  it('excludes the placement cells themselves from adjacency', () => {
    const g = createGrid(4, 4);
    const p: Placement = {
      polyomino: domino(),
      position: { row: 1, col: 1 },
      rotation: 0,
      flipped: false,
    };
    const adj = getAdjacentCells(g, p, false);
    const keys = new Set(adj.map((c) => `${c.row},${c.col}`));
    expect(keys.has('1,1')).toBe(false);
    expect(keys.has('1,2')).toBe(false);
  });
});
