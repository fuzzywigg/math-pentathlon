/**
 * Wave 42 — Stars & Bars AI getAIMove / executeAITurn / isAITurn. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, hasValidMoves } from '../../src/games/stars-bars/rules';
import {
  getAIMove,
  executeAITurn,
  isAITurn,
} from '../../src/games/stars-bars/ai';

describe('Wave 42 stars — AI turn pipeline', () => {
  it('getAIMove returns a hand card and board cell for current AI', () => {
    const state = createInitialState();
    expect(hasValidMoves(state)).toBe(true);
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(state.playerHands.player1.some((c) => c.id === move!.cardId)).toBe(
      true
    );
    expect(move!.row).toBeGreaterThanOrEqual(0);
    expect(move!.col).toBeLessThan(5);
  });

  it('executeAITurn places and flips seat; null seat returns pass', () => {
    const state = createInitialState();
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next).not.toBe(state);
    expect(next.moveHistory.length).toBe(1);
    expect(next.currentPlayer).toBe('player2');

    const wrongSeat = executeAITurn(state, 'player2', 'hard');
    expect(wrongSeat.currentPlayer).toBe('player2');
    expect(wrongSeat.moveHistory).toHaveLength(0);
  });

  it('isAITurn gates on mode, seat, and gameOver', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    const over = { ...state, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
  });
});
