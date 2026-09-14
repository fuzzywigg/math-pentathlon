/**
 * Overnight HEAVY — Kings isAITurn matrix deepen (null seat / gameOver / modes).
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { isAITurn } from '../../src/games/kings-quadraphages/ai';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

describe('Overnight kings — isAITurn matrix', () => {
  it('covers null seat, human mode, seat mismatch, and gameOver', () => {
    const state = createInitialGameState();
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(
      isAITurn(
        { ...state, currentPlayer: 'player2' },
        'player2',
        'human-vs-ai'
      )
    ).toBe(true);
    expect(
      isAITurn(
        { ...state, turnPhase: 'gameOver', winner: 'player2' },
        'player1',
        'human-vs-ai'
      )
    ).toBe(false);
  });
});
