/**
 * Wave 38 — getAdjacentCells edge/corner/diagonal leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createGrid,
  placePolyomino,
  getAdjacentCells,
  getPlacementCells,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 38 poly-adjacent — edge / diagonal', () => {
  it('1x1 monomino on 1x1 grid has no adjacent cells', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.size === 1)!;
    let grid = createGrid(1, 1);
    grid = placePolyomino(grid, mono, { row: 0, col: 0 });
    const placement = grid.placements[0];
    expect(getAdjacentCells(grid, placement, false)).toEqual([]);
    expect(getAdjacentCells(grid, placement, true)).toEqual([]);
  });

  it('corner monomino 4-adj excludes occupied body and OOB', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.size === 1)!;
    let grid = createGrid(3, 3);
    grid = placePolyomino(grid, mono, { row: 0, col: 0 });
    const adj = getAdjacentCells(grid, grid.placements[0], false);
    const keys = adj.map((c) => `${c.row},${c.col}`).sort();
    expect(keys).toEqual(['0,1', '1,0']);
  });

  it('diagonal mode adds corner neighbors without body cells', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.size === 1)!;
    let grid = createGrid(3, 3);
    grid = placePolyomino(grid, mono, { row: 1, col: 1 });
    const edge = getAdjacentCells(grid, grid.placements[0], false);
    const diag = getAdjacentCells(grid, grid.placements[0], true);
    expect(edge).toHaveLength(4);
    expect(diag).toHaveLength(8);
    expect(diag.some((c) => c.row === 1 && c.col === 1)).toBe(false);
  });

  it('domino adjacent set excludes placement body cells', () => {
    const domino = SIMPLE_SHAPES.find((s) => s.size === 2)!;
    let grid = createGrid(4, 4);
    grid = placePolyomino(grid, domino, { row: 1, col: 1 });
    const placement = grid.placements[0];
    const adj = getAdjacentCells(grid, placement, false);
    expect(adj.length).toBeGreaterThan(0);
    const body = new Set(
      getPlacementCells(placement).map((c) => `${c.row},${c.col}`)
    );
    for (const cell of adj) {
      expect(body.has(`${cell.row},${cell.col}`)).toBe(false);
    }
  });
});
