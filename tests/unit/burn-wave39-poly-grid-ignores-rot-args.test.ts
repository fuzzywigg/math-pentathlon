/**
 * Wave 39 — Grid placePolyomino ignores rotation/flip args after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createGrid,
  placePolyomino,
  getPlacementCells,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 39 poly — grid ignores rot args', () => {
  it('Grid overload stores rotation:0 flipped:false even if Board args differ', () => {
    const domino = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
    // Call through overload with extra args — Grid path forces 0/false
    const placeAny = placePolyomino as (
      grid: ReturnType<typeof createGrid>,
      shape: typeof domino,
      position: { row: number; col: number },
      rotation?: number,
      flipped?: boolean
    ) => ReturnType<typeof createGrid>;
    const grid = placeAny(createGrid(4, 4), domino, { row: 1, col: 1 }, 90, true);
    expect(grid.kind).toBe('grid');
    expect(grid.placements[0].rotation).toBe(0);
    expect(grid.placements[0].flipped).toBe(false);
    // unrotated domino occupies (1,1) and (1,2)
    const cells = getPlacementCells(grid.placements[0]);
    expect(cells).toEqual([
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ]);
  });
});
