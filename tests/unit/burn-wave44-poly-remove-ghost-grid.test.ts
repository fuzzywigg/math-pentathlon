/**
 * Wave 44 — removePolyomino ghost id no-op leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createGrid,
  placePolyomino,
  removePolyomino,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 44 poly — remove ghost id', () => {
  it('unknown id leaves occupancy unchanged', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    let grid = placePolyomino(createGrid(2, 2), mono, { row: 0, col: 0 });
    const before = JSON.stringify(grid.cells);
    grid = removePolyomino(grid, 'no-such-id');
    expect(JSON.stringify(grid.cells)).toBe(before);
    expect(grid.placements).toHaveLength(1);
  });
});
