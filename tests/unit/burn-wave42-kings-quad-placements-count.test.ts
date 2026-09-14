/**
 * Wave 42 — Kings getValidQuadraphagePlacements opening count 81-2=79.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getValidQuadraphagePlacements,
  isValidQuadraphagePlacement,
  findKingPosition,
} from '../../src/games/kings-quadraphages/rules';
import {
  createInitialGameState,
  moveKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — quad placements count', () => {
  it('opening empty count is 79', () => {
    const state = createInitialGameState();
    expect(getValidQuadraphagePlacements(state)).toHaveLength(79);
  });

  it('placements never include either king cell', () => {
    const state = createInitialGameState();
    const places = getValidQuadraphagePlacements(state);
    const p1 = findKingPosition(state.board, 'player1')!;
    const p2 = findKingPosition(state.board, 'player2')!;
    expect(
      places.some((p) => p.row === p1.row && p.col === p1.col)
    ).toBe(false);
    expect(
      places.some((p) => p.row === p2.row && p.col === p2.col)
    ).toBe(false);
  });

  it('after one place, count is 78 (two kings + one quad)', () => {
    let state = createInitialGameState();
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 5, col: 5 });
    // 81 - 2 kings - 1 quad = 78
    expect(getValidQuadraphagePlacements(state)).toHaveLength(78);
    // placed at 1-based (5,5) → 0-based (4,4) occupied
    expect(isValidQuadraphagePlacement(state, { row: 4, col: 4 })).toBe(false);
    expect(isValidQuadraphagePlacement(state, { row: 3, col: 3 })).toBe(true);
  });
});
