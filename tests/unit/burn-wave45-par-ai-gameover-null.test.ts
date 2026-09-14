/**
 * Wave 45 TOKENMAXX — Par-55 getAIMove gameOver/wrong-seat null. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { getAIMove } from '../../src/games/par-55/ai';

describe('Wave 45 par55 — AI null gates', () => {
  it('null on gameOver and wrong seat', () => {
    const open = createInitialState();
    expect(getAIMove(open, 'player2', 'hard')).toBeNull();
    const over = { ...open, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(getAIMove(over, 'player1', 'hard')).toBeNull();
  });
});
