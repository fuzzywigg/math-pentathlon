/**
 * Wave 45 — Prime Gold primeVeins update after place leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, placeChip, getValidPlacements } from '../../src/games/prime-gold/rules';

describe('Wave 45 prime — vein update', () => {
  it('primeVeins fields are non-negative after placement', () => {
    let state = createInitialState();
    state = { ...state, phase: 'placing', diceRoll: { die1: 2, die2: 3, die3: 1 } };
    const pick = getValidPlacements(state)[0];
    const next = placeChip(state, pick.value, pick.expr);
    expect(next.primeVeins.player1).toBeGreaterThanOrEqual(0);
    expect(next.primeVeins.player2).toBeGreaterThanOrEqual(0);
  });
});
