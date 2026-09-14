/**
 * Wave 42 — Kings isValidPlacement phase gates leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialGameState,
  selectKing,
  moveKing,
  isValidPlacement,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — isValidPlacement phase gates', () => {
  it('false during moveKing even on empty cell', () => {
    const state = createInitialGameState();
    expect(isValidPlacement(state, { row: 5, col: 5 })).toBe(false);
  });

  it('true on empty during placeQuadraphage; false on kings', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    expect(state.turnPhase).toBe('placeQuadraphage');
    expect(isValidPlacement(state, { row: 4, col: 4 })).toBe(true);
    expect(isValidPlacement(state, { row: 2, col: 5 })).toBe(false);
    expect(isValidPlacement(state, { row: 9, col: 5 })).toBe(false);
  });

  it('false in gameOver phase', () => {
    const over = {
      ...createInitialGameState(),
      turnPhase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(isValidPlacement(over, { row: 3, col: 3 })).toBe(false);
  });
});
