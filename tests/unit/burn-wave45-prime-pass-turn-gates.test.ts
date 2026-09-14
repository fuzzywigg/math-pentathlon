/**
 * Wave 45 — Prime Gold passTurn gates leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn, rollDice } from '../../src/games/prime-gold/rules';

describe('Wave 45 prime — passTurn', () => {
  it('flips seat and resets to rolling; identity on gameOver', () => {
    const state = rollDice(createInitialState());
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.diceRoll).toBeNull();
    const over = { ...state, phase: 'gameOver' as const };
    expect(passTurn(over)).toBe(over);
  });
});
