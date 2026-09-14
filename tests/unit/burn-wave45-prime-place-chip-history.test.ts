/**
 * Wave 45 — Prime Gold placeChip history/seat flip leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, placeChip, getValidPlacements } from '../../src/games/prime-gold/rules';

describe('Wave 45 prime — placeChip happy', () => {
  it('places chip, records history, flips seat', () => {
    let state = createInitialState();
    state = { ...state, phase: 'placing', diceRoll: { die1: 2, die2: 3, die3: 1 } };
    const pick = getValidPlacements(state)[0];
    const next = placeChip(state, pick.value, pick.expr);
    expect(next.moveHistory).toHaveLength(1);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.playerChips.player1).toBe(19);
    expect(next.diceRoll).toBeNull();
  });
});
