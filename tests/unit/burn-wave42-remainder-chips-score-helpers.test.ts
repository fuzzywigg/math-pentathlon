/**
 * Wave 42 — Remainder Islands getPlayerChips / getPlayerScore after select.
 * Beyond wave41 chrome handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getPlayerChips,
  getPlayerScore,
  INITIAL_CHIPS_PER_PLAYER,
} from '../../src/games/remainder-islands/types';
import {
  selectIsland,
  calculateDivision,
} from '../../src/games/remainder-islands/rules';

describe('Wave 42 remainder — chips/score helpers', () => {
  it('helpers mirror opening constants', () => {
    const state = createInitialState();
    expect(getPlayerChips(state, 'player1')).toBe(INITIAL_CHIPS_PER_PLAYER);
    expect(getPlayerChips(state, 'player2')).toBe(INITIAL_CHIPS_PER_PLAYER);
    expect(getPlayerScore(state, 'player1')).toBe(0);
    expect(getPlayerScore(state, 'player2')).toBe(0);
  });

  it('after selectIsland helpers track only active seat', () => {
    const base = createInitialState();
    const island = base.islands[0];
    const total = 11;
    const rem = calculateDivision(total, island.value).remainder;
    const next = selectIsland(
      {
        ...base,
        phase: 'selectIsland',
        currentRoll: { die1: 5, die2: 6, total },
        validIslands: [island.id],
        turnsRemaining: 12,
      },
      island.id
    );
    expect(getPlayerChips(next, 'player1')).toBe(INITIAL_CHIPS_PER_PLAYER - 1);
    expect(getPlayerChips(next, 'player2')).toBe(INITIAL_CHIPS_PER_PLAYER);
    expect(getPlayerScore(next, 'player1')).toBe(rem);
    expect(getPlayerScore(next, 'player2')).toBe(0);
  });
});
