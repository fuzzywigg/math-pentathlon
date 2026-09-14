/**
 * Wave 39 — Grid placePolyomino ignores rotation/flip args (contract).
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  SIMPLE_SHAPES,
  createGrid,
  placePolyomino,
  getPlacementCells,
} from '../../src/core/polyomino';

describe('Wave 39 poly — grid ignores rotation', () => {
  it('Grid overload always stores rotation 0 / flipped false', () => {
    const shape = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;
    const pos = { row: 0, col: 0 };
    // Call through Board overload signature args — Grid branch ignores them
    const grid = placePolyomino(
      createGrid(5, 5),
      shape,
      pos,
      90 as 0,
      true as false,
      3
    );
    expect(grid.placements[0].rotation).toBe(0);
    expect(grid.placements[0].flipped).toBe(false);
    const cells = getPlacementCells(grid.placements[0]);
    const identity = getPlacementCells({
      polyomino: shape,
      position: pos,
      rotation: 0,
      flipped: false,
    });
    expect(cells).toEqual(identity);
  });
});
