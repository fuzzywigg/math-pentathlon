/**
 * Wave 46 — Prime Gold placeChip owner stamp leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  placeChip,
  getValidPlacements,
  findCellByValue,
} from '../../src/games/prime-gold/rules';

describe('Wave 46 prime — owner stamp', () => {
  it('placed cell owner is current player', () => {
    let state = createInitialState();
    state = { ...state, phase: 'placing', diceRoll: { die1: 2, die2: 3, die3: 1 } };
    const pick = getValidPlacements(state)[0];
    const next = placeChip(state, pick.value, pick.expr);
    expect(findCellByValue(next, pick.value)?.owner).toBe('player1');
  });
});
