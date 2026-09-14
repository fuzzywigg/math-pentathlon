/**
 * Overnight HEAVY leftover after #280 — legacy getPlacementCells + unknown id.
 * Distinct from wave58 validate OOB/occupied reasons. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getPlacementCells,
  SIMPLE_SHAPES,
  cellsToKey,
} from '../../src/core/polyomino';

describe('Wave 59 core poly — placement cells legacy', () => {
  it('legacy shapeId resolves cells; unknown shapeId yields []', () => {
    const hit = getPlacementCells(
      {
        shapeId: 'domino',
        position: { row: 1, col: 1 },
        rotation: 0,
        flipped: false,
      },
      SIMPLE_SHAPES
    );
    expect(cellsToKey(hit)).toBe(
      cellsToKey([
        { row: 1, col: 1 },
        { row: 1, col: 2 },
      ])
    );
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
