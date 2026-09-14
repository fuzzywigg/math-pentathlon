/**
 * Wave 40 — Grid removePolyomino + getAllValidPositions leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createGrid,
  placePolyomino,
  removePolyomino,
  getAllValidPositions,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 40 poly — grid remove / validpos', () => {
  const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;

  it('place then remove clears occupancy; valid positions refill', () => {
    let grid = createGrid(3, 3);
    grid = placePolyomino(grid, mono, { row: 1, col: 1 }, 0, false);
    expect(grid.placements).toHaveLength(1);
    grid = removePolyomino(grid, mono.id);
    expect(grid.placements).toHaveLength(0);
    expect(grid.cells[1][1].occupied).toBe(false);
    const positions = getAllValidPositions(grid, mono, 0, false);
    expect(positions.length).toBe(9);
  });
});
