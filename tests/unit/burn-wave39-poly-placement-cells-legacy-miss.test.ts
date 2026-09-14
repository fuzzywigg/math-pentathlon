/**
 * Wave 39 — getPlacementCells legacy miss leftovers after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createGrid,
  placePolyomino,
  getPlacementCells,
  SIMPLE_SHAPES,
  type PlacedPolyomino,
} from '../../src/core/polyomino';

describe('Wave 39 poly — placement cells legacy miss', () => {
  it('legacy missing shapeId / empty shapes → []', () => {
    const placed: PlacedPolyomino = {
      shapeId: 'nope',
      position: { row: 0, col: 0 },
      rotation: 0,
      flipped: false,
    };
    expect(getPlacementCells(placed, [])).toEqual([]);
    expect(getPlacementCells(placed, SIMPLE_SHAPES)).toEqual([]);
  });

  it('Grid Placement path still returns cells', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const grid = placePolyomino(createGrid(2, 2), mono, { row: 0, col: 1 });
    const cells = getPlacementCells(grid.placements[0]);
    expect(cells).toEqual([{ row: 0, col: 1 }]);
  });
});
