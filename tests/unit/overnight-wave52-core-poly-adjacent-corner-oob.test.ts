/**
 * Overnight HEAVY leftover after #234 — corner monomino adjacent cells OOB-filtered 4 vs 8.
 * Distinct from burn-wave44-poly-adjacent-4-vs-8 (interior). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createGrid,
  placePolyomino,
  getAdjacentCells,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 52 core poly — adjacent corner oob', () => {
  it('mono at (0,0) on 3×3 → 4-way length 2; 8-way length 3', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const grid = placePolyomino(createGrid(3, 3), mono, { row: 0, col: 0 });
    const placement = grid.placements[0];
    expect(getAdjacentCells(grid, placement, false)).toHaveLength(2);
    expect(getAdjacentCells(grid, placement, true)).toHaveLength(3);
  });
});
