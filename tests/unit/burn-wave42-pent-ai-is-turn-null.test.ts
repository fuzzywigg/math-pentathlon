/**
 * Wave 42 — Pent'Em In AI isAITurn matrix + getAIMove null wrong seat leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { getAIMove, isAITurn } from '../../src/games/pent-em-in/ai';

describe('Wave 42 pent-em-in — AI isAITurn + null seat', () => {
  it('isAITurn matrix over phase, seat, and aiPlayer', () => {
    const open = createInitialState();
    expect(isAITurn(open, null)).toBe(false);
    expect(isAITurn(open, 'player1')).toBe(true);
    expect(isAITurn(open, 'player2')).toBe(false);

    const p2Turn = { ...open, currentPlayer: 'player2' as const };
    expect(isAITurn(p2Turn, 'player1')).toBe(false);
    expect(isAITurn(p2Turn, 'player2')).toBe(true);

    const over = { ...open, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(isAITurn(over, 'player1')).toBe(false);
    expect(isAITurn(over, 'player2')).toBe(false);
  });

  it('getAIMove null when aiPlayer is not currentPlayer', () => {
    const state = createInitialState();
    expect(getAIMove(state, 'player2', 'medium')).toBeNull();
    expect(getAIMove({ ...state, currentPlayer: 'player2' }, 'player1', 'hard')).toBeNull();
  });

  it('getAIMove null when phase is gameOver', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    expect(getAIMove(state, 'player1', 'easy')).toBeNull();
    expect(getAIMove(state, 'player2', 'hard')).toBeNull();
  });
});
