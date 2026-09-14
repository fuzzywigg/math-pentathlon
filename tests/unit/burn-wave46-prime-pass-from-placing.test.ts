/**
 * Wave 46 — Prime Gold passTurn from placing leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn } from '../../src/games/prime-gold/rules';

describe('Wave 46 prime — pass from placing', () => {
  it('clears dice and returns to rolling for opponent', () => {
    const placing = {
      ...createInitialState(),
      phase: 'placing' as const,
      diceRoll: { die1: 1, die2: 2, die3: 3 },
    };
    const next = passTurn(placing);
    expect(next.phase).toBe('rolling');
    expect(next.diceRoll).toBeNull();
    expect(next.currentPlayer).toBe('player2');
  });
});
