/**
 * Wave 45 — Prime Gold chip-exhaust settle leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, placeChip, getValidPlacements } from '../../src/games/prime-gold/rules';

describe('Wave 45 prime — chip exhaust', () => {
  it('both chips at 1→0 settles gameOver', () => {
    let state = createInitialState();
    state = {
      ...state,
      phase: 'placing',
      diceRoll: { die1: 2, die2: 3, die3: 1 },
      playerChips: { player1: 1, player2: 0 },
    };
    const pick = getValidPlacements(state)[0];
    const next = placeChip(state, pick.value, pick.expr);
    expect(next.phase).toBe('gameOver');
    expect(next.playerChips.player1).toBe(0);
  });
});
