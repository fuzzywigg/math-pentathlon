/**
 * Wave 40 — doPlacementsOverlap / getAdjacentCells leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createGrid,
  placePolyomino,
  doPlacementsOverlap,
  getAdjacentCells,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 40 poly — overlap / adjacent matrix', () => {
  const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;

  it('same cell placements overlap; adjacent counts ortho vs diagonal', () => {
    let grid = createGrid(4, 4);
    grid = placePolyomino(grid, mono, { row: 1, col: 1 }, 0, false);
    const p1 = grid.placements[0];
    const ghost = {
      ...p1,
      position: { row: 1, col: 1 },
    };
    expect(doPlacementsOverlap(p1, ghost)).toBe(true);

    const ortho = getAdjacentCells(grid, p1, false);
    const diag = getAdjacentCells(grid, p1, true);
    expect(ortho.length).toBeLessThan(diag.length);
    expect(ortho.every((c) => Math.abs(c.row - 1) + Math.abs(c.col - 1) === 1)).toBe(
      true
    );
  });
});
