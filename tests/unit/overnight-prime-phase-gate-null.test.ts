/**
 * Overnight HEAVY — getAIPlacement null outside placing / wrong seat.
 * Distinct leftover handshake sharpening. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAIPlacement } from '../../src/games/prime-gold/ai';
import { createInitialState } from '../../src/games/prime-gold/rules';

describe('Overnight prime — phase gate null', () => {
  it('rolling and wrong-seat placing return null', () => {
    const rolling = createInitialState();
    expect(getAIPlacement(rolling, 'player1', 'hard')).toBeNull();
    const placing = {
      ...rolling,
      phase: 'placing' as const,
      diceRoll: { die1: 1, die2: 1, die3: 1 },
      currentPlayer: 'player1' as const,
    };
    expect(getAIPlacement(placing, 'player2', 'hard')).toBeNull();
  });
});
