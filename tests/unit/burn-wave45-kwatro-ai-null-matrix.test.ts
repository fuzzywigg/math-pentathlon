/**
 * Wave 45 TOKENMAXX — Kwatro getAIMove null matrix leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { getAIMove } from '../../src/games/kwatro-sinko/ai';

describe('Wave 45 kwatro — AI null matrix', () => {
  it('null on gameOver and wrong seat', () => {
    const open = createInitialState();
    expect(getAIMove(open, 'player2', 'hard')).toBeNull();
    const over = { ...open, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(getAIMove(over, 'player1', 'easy')).toBeNull();
  });
});
