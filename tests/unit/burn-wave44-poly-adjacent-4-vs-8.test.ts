/**
 * Wave 44 — getAdjacentCells 4 vs 8 connectivity leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createGrid,
  placePolyomino,
  getAdjacentCells,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 44 poly — adjacent 4 vs 8', () => {
  it('diagonal neighbors only appear when diagonal=true', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    let grid = createGrid(3, 3);
    grid = placePolyomino(grid, mono, { row: 1, col: 1 });
    const placement = grid.placements[0]!;
    const ortho = getAdjacentCells(grid, placement, false);
    const diag = getAdjacentCells(grid, placement, true);
    expect(ortho).toHaveLength(4);
    expect(diag).toHaveLength(8);
    expect(diag.some((c) => c.row === 0 && c.col === 0)).toBe(true);
    expect(ortho.some((c) => c.row === 0 && c.col === 0)).toBe(false);
  });
});
