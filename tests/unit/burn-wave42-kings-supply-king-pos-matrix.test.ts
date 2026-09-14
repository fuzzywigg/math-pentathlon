/**
 * Wave 42 — Kings getSupply / getKingPosition matrix (1-based).
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialGameState,
  getSupply,
  getKingPosition,
  moveKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — supply / king position matrix', () => {
  it('opening supplies 30/30 and kings at (1,5)/(9,5)', () => {
    const state = createInitialGameState();
    expect(getSupply(state, 'player1')).toBe(30);
    expect(getSupply(state, 'player2')).toBe(30);
    expect(getKingPosition(state, 'player1')).toEqual({ row: 1, col: 5 });
    expect(getKingPosition(state, 'player2')).toEqual({ row: 9, col: 5 });
  });

  it('getKingPosition tracks after moveKing', () => {
    let state = createInitialGameState();
    state = moveKing(state, { row: 2, col: 4 });
    expect(getKingPosition(state, 'player1')).toEqual({ row: 2, col: 4 });
    expect(getKingPosition(state, 'player2')).toEqual({ row: 9, col: 5 });
  });

  it('getSupply reflects place decrement only for actor', () => {
    let state = createInitialGameState();
    state = moveKing(state, { row: 1, col: 4 });
    state = placeQuadraphage(state, { row: 7, col: 7 });
    expect(getSupply(state, 'player1')).toBe(29);
    expect(getSupply(state, 'player2')).toBe(30);
  });
});
