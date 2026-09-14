/**
 * Wave 41 — Kings game-state placeQuadraphage phase/supply/occupied rejects.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialGameState,
  selectKing,
  moveKing,
  placeQuadraphage,
  isValidPlacement,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 41 kings — placeQuadraphage rejects', () => {
  it('wrong phase (moveKing) is identity', () => {
    const state = createInitialGameState();
    expect(placeQuadraphage(state, { row: 5, col: 5 })).toBe(state);
    expect(isValidPlacement(state, { row: 5, col: 5 })).toBe(false);
  });

  it('zero supply is identity in place phase', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    expect(state.turnPhase).toBe('placeQuadraphage');
    const starved = { ...state, player1Supply: 0 };
    expect(placeQuadraphage(starved, { row: 5, col: 5 })).toBe(starved);
  });

  it('occupied king cell reject; empty place advances turn', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    // Player1 king now at 2,5 (1-based) — cannot place there
    expect(placeQuadraphage(state, { row: 2, col: 5 })).toBe(state);
    expect(isValidPlacement(state, { row: 2, col: 5 })).toBe(false);
    const next = placeQuadraphage(state, { row: 5, col: 5 });
    expect(next).not.toBe(state);
    expect(next.turnPhase).toBe('moveKing');
    expect(next.currentPlayer).toBe('player2');
    expect(next.player1Supply).toBe(29);
  });

  it('gameOver phase place is identity', () => {
    const over = {
      ...createInitialGameState(),
      turnPhase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(placeQuadraphage(over, { row: 4, col: 4 })).toBe(over);
  });
});
