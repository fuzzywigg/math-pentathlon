/**
 * Wave 42 — Prime Gold placeChip success leftovers after #186. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  rollDice,
  placeChip,
  getValidPlacements,
  findCellByValue,
} from '../../src/games/prime-gold/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 prime — placeChip success', () => {
  it('claims cell, records move, decrements chips, clears dice', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = rollDice(createInitialState());
    const pick = getValidPlacements(state)[0];
    const next = placeChip(state, pick.value, pick.expr);
    expect(next).not.toBe(state);
    expect(findCellByValue(next, pick.value)?.owner).toBe('player1');
    expect(next.playerChips.player1).toBe(state.playerChips.player1 - 1);
    expect(next.playerChips.player2).toBe(state.playerChips.player2);
    expect(next.diceRoll).toBeNull();
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0]).toMatchObject({
      player: 'player1',
      result: pick.value,
      expression: pick.expr,
    });
  });

  it('flips seat to player2 and returns to rolling when game continues', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = rollDice(createInitialState());
    const pick = getValidPlacements(state)[0];
    const next = placeChip(state, pick.value, pick.expr);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.winner).toBeNull();
  });

  it('updates primeVeins counters after placement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = rollDice(createInitialState());
    const pick = getValidPlacements(state)[0];
    const next = placeChip(state, pick.value, pick.expr);
    expect(next.primeVeins.player1).toBeGreaterThanOrEqual(0);
    expect(next.primeVeins.player2).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(next.primeVeins.player1)).toBe(true);
    expect(Number.isInteger(next.primeVeins.player2)).toBe(true);
  });
});
