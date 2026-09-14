/**
 * Wave 40 — Prime Gold rollDice wrong phase / getValidPlacements / findCellByValue.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  rollDice,
  getValidPlacements,
  findCellByValue,
} from '../../src/games/prime-gold/rules';

describe('Wave 40 prime-gold — roll / valids / find miss', () => {
  it('rollDice in placing phase → identity', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      diceRoll: { die1: 1, die2: 2, die3: 3 },
    };
    expect(rollDice(state)).toBe(state);
  });

  it('getValidPlacements when not placing or null dice → []', () => {
    const rolling = createInitialState();
    expect(rolling.phase).toBe('rolling');
    expect(rolling.diceRoll).toBeNull();
    expect(getValidPlacements(rolling)).toEqual([]);

    const placingNoDice = {
      ...rolling,
      phase: 'placing' as const,
      diceRoll: null,
    };
    expect(getValidPlacements(placingNoDice)).toEqual([]);
  });

  it('findCellByValue miss (−1, 99999) → null', () => {
    const state = createInitialState();
    expect(findCellByValue(state, -1)).toBeNull();
    expect(findCellByValue(state, 99999)).toBeNull();
  });
});
