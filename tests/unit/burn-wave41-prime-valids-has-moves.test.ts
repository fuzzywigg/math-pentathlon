/**
 * Wave 41 — Prime Gold getValidPlacements / hasValidMoves leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  rollDice,
  getValidPlacements,
  hasValidMoves,
  findCellByValue,
} from '../../src/games/prime-gold/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 prime — valids / hasValidMoves', () => {
  it('getValidPlacements empty without dice or when not placing', () => {
    const state = createInitialState();
    expect(getValidPlacements(state)).toEqual([]);
    expect(hasValidMoves(state)).toBe(false);

    const rolledMissingPhase = {
      ...state,
      diceRoll: { die1: 1, die2: 1, die3: 1 },
      phase: 'rolling' as const,
    };
    expect(getValidPlacements(rolledMissingPhase)).toEqual([]);
  });

  it('after roll valids are empty-owner cells from expressions', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = rollDice(createInitialState());
    const valids = getValidPlacements(state);
    expect(valids.length).toBeGreaterThan(0);
    expect(hasValidMoves(state)).toBe(true);
    for (const p of valids) {
      const cell = findCellByValue(state, p.value);
      expect(cell).toBeTruthy();
      expect(cell!.owner).toBeNull();
      expect(typeof p.expr).toBe('string');
    }
  });

  it('claiming all valid targets empties placements', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = rollDice(createInitialState());
    for (const p of getValidPlacements(state)) {
      const cell = findCellByValue(state, p.value)!;
      cell.owner = 'player2';
    }
    expect(getValidPlacements(state)).toEqual([]);
    expect(hasValidMoves(state)).toBe(false);
  });
});
