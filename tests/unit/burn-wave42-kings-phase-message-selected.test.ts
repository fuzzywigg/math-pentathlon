/**
 * Wave 42 — Kings getCurrentPhaseMessage with selected king. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialGameState,
  selectKing,
  moveKing,
  getCurrentPhaseMessage,
  resetGame,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — phase message selected', () => {
  it('unselected moveKing prompts click king', () => {
    const state = createInitialGameState();
    expect(getCurrentPhaseMessage(state)).toBe(
      'Player 1: Click your King to select it'
    );
  });

  it('selected king prompts green square move', () => {
    const state = selectKing(createInitialGameState());
    expect(state.selectedKingPosition).toEqual({ row: 1, col: 5 });
    expect(getCurrentPhaseMessage(state)).toBe(
      'Player 1: Click a green square to move'
    );
  });

  it('placeQuadraphage message after move', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    expect(getCurrentPhaseMessage(state)).toBe(
      'Player 1: Place a Quadraphage'
    );
  });

  it('player2 selected message + gameOver winner text', () => {
    const p2 = {
      ...createInitialGameState(),
      currentPlayer: 'player2' as const,
      selectedKingPosition: { row: 9, col: 5 },
    };
    expect(getCurrentPhaseMessage(p2)).toBe(
      'Player 2: Click a green square to move'
    );
    const over = {
      ...createInitialGameState(),
      turnPhase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getCurrentPhaseMessage(over)).toBe('Game Over! Player 1 wins!');
    expect(resetGame().selectedKingPosition).toBeNull();
  });
});
