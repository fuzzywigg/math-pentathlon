/**
 * Wave 45 — Prime Gold getAIPlacement null gates leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { getAIPlacement } from '../../src/games/prime-gold/ai';

describe('Wave 45 prime — AI null gates', () => {
  it('null when not placing or wrong seat', () => {
    const state = createInitialState();
    expect(getAIPlacement(state, 'player1', 'hard')).toBeNull();
    const placing = { ...state, phase: 'placing' as const, diceRoll: { die1: 1, die2: 1, die3: 1 } };
    expect(getAIPlacement(placing, 'player2', 'hard')).toBeNull();
  });
});
