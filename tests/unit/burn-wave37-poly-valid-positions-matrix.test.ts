/**
 * Wave 37 — polyomino getAllValidPositions dense occupancy matrix.
 * Beyond wave 28 orientation smoke. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createGrid,
  placePolyomino,
  getAllValidPositions,
  isValidPlacement,
  TETROMINOES,
  SIMPLE_SHAPES,
  type Rotation,
} from '../../src/core/polyomino';

const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
const O = TETROMINOES.find((s) => s.id === 'O')!;
const T = TETROMINOES.find((s) => s.id === 'T')!;
const I = TETROMINOES.find((s) => s.id === 'I')!;

describe('Wave 37 poly-valid-matrix — occupancy shrink', () => {
  it('filling with monominoes shrinks remaining slots by one each time', () => {
    let grid = createGrid(3, 3);
    for (let i = 0; i < 9; i++) {
      expect(getAllValidPositions(grid, mono, 0, false)).toHaveLength(9 - i);
      const spot = getAllValidPositions(grid, mono, 0, false)[0];
      grid = placePolyomino(grid, { ...mono, id: `m${i}` }, spot);
    }
    expect(getAllValidPositions(grid, mono, 0, false)).toEqual([]);
  });

  it('O positions on NxN equal (N-1)^2', () => {
    for (const n of [2, 3, 5, 6]) {
      expect(getAllValidPositions(createGrid(n, n), O, 0, false)).toHaveLength(
        (n - 1) * (n - 1)
      );
    }
  });

  it('I horizontal vs vertical counts swap on non-square grids', () => {
    const grid = createGrid(3, 6);
    const horiz = getAllValidPositions(grid, I, 0, false);
    const vert = getAllValidPositions(grid, I, 90, false);
    expect(horiz.length).toBe(3 * 3); // 3 rows × (6-4+1) cols
    expect(vert.length).toBe(0); // height 3 < 4
    expect(getAllValidPositions(createGrid(6, 3), I, 90, false).length).toBe(
      3 * 3
    );
  });
});

describe('Wave 37 poly-valid-matrix — T rotations after O obstacle', () => {
  it('rotation-0 spots remain isValidPlacement-true; other rots still non-empty', () => {
    const grid = placePolyomino(createGrid(6, 6), O, { row: 0, col: 0 });
    const rot0 = getAllValidPositions(grid, T, 0, false);
    expect(rot0.length).toBeGreaterThan(0);
    for (const pos of rot0) {
      // Grid isValidPlacement only models rotation 0
      expect(isValidPlacement(grid, T, pos)).toBe(true);
    }
    for (const rot of [90, 180, 270] as Rotation[]) {
      expect(getAllValidPositions(grid, T, rot, false).length).toBeGreaterThan(
        0
      );
    }
  });
});
