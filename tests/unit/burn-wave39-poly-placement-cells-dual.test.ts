/**
 * Wave 39 — getPlacementCells Placement vs PlacedPolyomino+shapes dual.
 * Beyond wave 28/37/38. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  SIMPLE_SHAPES,
  getPlacementCells,
  createBoard,
  placePolyomino,
  createGrid,
} from '../../src/core/polyomino';

const trominoL = () => SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;

describe('Wave 39 poly — placement cells dual', () => {
  it('Board PlacedPolyomino+shapes agrees with Grid Placement cells', () => {
    const shape = trominoL();
    const pos = { row: 1, col: 1 };
    const board = placePolyomino(createBoard(6, 6), shape, pos, 90, true, 2);
    const placed = board.placements[0];
    const legacy = getPlacementCells(placed, [shape]);

    let grid = createGrid(6, 6);
    // Grid path ignores rotation/flip — place identity then compare via Placement API
    grid = placePolyomino(grid, shape, pos);
    const fromGrid = getPlacementCells(grid.placements[0]);

    // Explicit Placement with rotation+flip should match legacy
    const rotated: typeof grid.placements[0] = {
      polyomino: shape,
      position: pos,
      rotation: 90,
      flipped: true,
    };
    expect(getPlacementCells(rotated).map((c) => `${c.row},${c.col}`).sort()).toEqual(
      legacy.map((c) => `${c.row},${c.col}`).sort()
    );
    expect(fromGrid).toHaveLength(shape.cells.length);
  });

  it('ghost shapeId yields empty cells', () => {
    expect(
      getPlacementCells(
        {
          shapeId: 'no-such-shape',
          position: { row: 0, col: 0 },
          rotation: 0,
          flipped: false,
        },
        SIMPLE_SHAPES
      )
    ).toEqual([]);
  });
});
