/**
 * Wave 42 — Kings phase message placeQuadraphage for player2.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialGameState,
  moveKing,
  placeQuadraphage,
  selectKing,
  getCurrentPhaseMessage,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — player2 placeQuadraphage phase message', () => {
  it('after p1 turn, player2 select message names Player 2', () => {
    let state = createInitialGameState();
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 5, col: 5 });
    expect(state.currentPlayer).toBe('player2');
    expect(getCurrentPhaseMessage(state)).toContain('Player 2');
    expect(getCurrentPhaseMessage(state)).toContain('Click your King');
  });

  it('player2 place phase says Place a Quadraphage', () => {
    let state = createInitialGameState();
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 5, col: 5 });
    state = selectKing(state);
    state = moveKing(state, { row: 8, col: 4 });
    expect(state.turnPhase).toBe('placeQuadraphage');
    expect(getCurrentPhaseMessage(state)).toBe(
      'Player 2: Place a Quadraphage'
    );
  });

  it('gameOver message uses winner name for player2', () => {
    const over = {
      ...createInitialGameState(),
      turnPhase: 'gameOver' as const,
      winner: 'player2' as const,
      currentPlayer: 'player1' as const,
    };
    expect(getCurrentPhaseMessage(over)).toContain('Player 2 wins');
  });
});
