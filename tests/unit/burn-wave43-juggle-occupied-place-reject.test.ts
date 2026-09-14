/**
 * Wave 43 — Juggle reject place on occupied cell. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  placeShape,
  isPlacementValid,
} from '../../src/games/juggle/rules';
import { SHAPE_POOLS } from '../../src/games/juggle/types';

describe('Wave 43 juggle — occupied place reject', () => {
  it('second monomino on same cell is invalid / identity', () => {
    const mono = SHAPE_POOLS.monomino[0];
    const placing = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [1, 1] as [number, number],
      selectedCategory: 'monomino' as const,
      selectedShape: mono,
    };
    const after = placeShape(placing, { row: 4, col: 4 });
    // back to p2 rolling — forge p1 placing again on filled board
    const again = {
      ...after,
      currentPlayer: 'player1' as const,
      phase: 'placing' as const,
      currentDice: [1, 1] as [number, number],
      selectedCategory: 'monomino' as const,
      selectedShape: mono,
    };
    expect(isPlacementValid(again, { row: 4, col: 4 })).toBe(false);
    expect(placeShape(again, { row: 4, col: 4 })).toBe(again);
  });
});
