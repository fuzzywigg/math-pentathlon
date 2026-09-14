/**
 * Overnight HEAVY — Pent'Em In getAIMove / isAITurn null gates.
 * Distinct leftover vs wave42 is-turn-null. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAIMove, isAITurn } from '../../src/games/pent-em-in/ai';
import { createInitialState } from '../../src/games/pent-em-in/types';

describe('Overnight pent — AI null gates', () => {
  it('null on gameOver and wrong seat; isAITurn matrix', () => {
    const open = createInitialState();
    expect(getAIMove(open, 'player2', 'hard')).toBeNull();
    const over = { ...open, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(getAIMove(over, 'player1', 'hard')).toBeNull();
    expect(isAITurn(open, null)).toBe(false);
    expect(isAITurn(over, 'player1')).toBe(false);
    expect(isAITurn(open, 'player1')).toBe(true);
    expect(isAITurn(open, 'player2')).toBe(false);
  });
});
