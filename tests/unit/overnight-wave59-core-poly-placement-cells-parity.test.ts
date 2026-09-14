/**
 * Overnight HEAVY leftover after #280 — Placement vs legacy cells parity.
 * Distinct from wave58 dual absolute/canFlip diverge. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getPlacementCells,
  TETROMINOES,
  cellsToKey,
} from '../../src/core/polyomino';

describe('Wave 59 core poly — placement cells parity', () => {
  it('Grid Placement and legacy PlacedPolyomino agree for T at rot 0', () => {
    const T = TETROMINOES.find((s) => s.id === 'T')!;
    const pos = { row: 2, col: 1 };
    const gridCells = getPlacementCells({
      polyomino: T,
      position: pos,
      rotation: 0,
      flipped: false,
    });
    const legacyCells = getPlacementCells(
      {
        shapeId: 'T',
        position: pos,
        rotation: 0,
        flipped: false,
      },
      TETROMINOES
    );
    expect(cellsToKey(gridCells)).toBe(cellsToKey(legacyCells));
  });
});
