/**
 * Wave 42 — Kings placeQuadraphage wrong phase / zero supply / occupied identity.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialGameState,
  selectKing,
  moveKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — placeQuadraphage identity rejects', () => {
  it('moveKing phase place returns same reference', () => {
    const state = createInitialGameState();
    expect(placeQuadraphage(state, { row: 4, col: 4 })).toBe(state);
  });

  it('zero supply in place phase is identity', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 4 });
    const starved = { ...state, player1Supply: 0 };
    expect(placeQuadraphage(starved, { row: 6, col: 6 })).toBe(starved);
  });

  it('occupied by either king is identity', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    expect(placeQuadraphage(state, { row: 2, col: 5 })).toBe(state);
    expect(placeQuadraphage(state, { row: 9, col: 5 })).toBe(state);
  });
});
