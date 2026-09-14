/**
 * Overnight HEAVY leftover after #280 — getPlacementCells(Placement) dual API.
 * Distinct from wave58 absolute/transformed cells leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getPlacementCells,
  SIMPLE_SHAPES,
  cellsToKey,
} from '../../src/core/polyomino';

describe('Wave 59 core poly — placement cells grid', () => {
  it('Placement dual returns translated rotated monomino cell', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const cells = getPlacementCells({
      polyomino: mono,
      position: { row: 2, col: 3 },
      rotation: 0,
      flipped: false,
    });
    expect(cellsToKey(cells)).toBe(cellsToKey([{ row: 2, col: 3 }]));
  });
});
