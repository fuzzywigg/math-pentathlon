/**
 * Wave 55 leftover after #250 — Kings P2 phase templates + game-over copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  getCurrentPhaseMessage,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 55 kings — P2 phase messages', () => {
  it('Player 2 templates and Player 1 wins game-over', () => {
    const s = createInitialGameState();
    expect(
      getCurrentPhaseMessage({ ...s, currentPlayer: 'player2', turnPhase: 'moveKing' })
    ).toBe('Player 2: Click your King to select it');
    expect(
      getCurrentPhaseMessage({
        ...s,
        currentPlayer: 'player2',
        turnPhase: 'moveKing',
        selectedKingPosition: { row: 9, col: 5 },
      })
    ).toBe('Player 2: Click a green square to move');
    expect(
      getCurrentPhaseMessage({
        ...s,
        currentPlayer: 'player2',
        turnPhase: 'placeQuadraphage',
      })
    ).toBe('Player 2: Place a Quadraphage');
    expect(
      getCurrentPhaseMessage({
        ...s,
        turnPhase: 'gameOver',
        winner: 'player1',
      })
    ).toBe('Game Over! Player 1 wins!');
  });
});
