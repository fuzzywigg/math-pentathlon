/**
 * Wave 42 — Prime Gold getValidPlacements filter leftovers after #186. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  rollDice,
  getValidPlacements,
  findCellByValue,
} from '../../src/games/prime-gold/rules';
import { generateExpressions } from '../../src/games/prime-gold/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 prime — getValidPlacements filter', () => {
  it('empty while phase is rolling even with dice present', () => {
    const state = createInitialState();
    expect(getValidPlacements(state)).toEqual([]);
    const rolledButRolling = {
      ...state,
      diceRoll: { die1: 2, die2: 3, die3: 4 },
      phase: 'rolling' as const,
    };
    expect(getValidPlacements(rolledButRolling)).toEqual([]);
  });

  it('non-empty after rollDice with only unoccupied targets', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = rollDice(createInitialState());
    const valids = getValidPlacements(state);
    expect(valids.length).toBeGreaterThan(0);
    const dice = state.diceRoll!;
    const exprValues = new Set(
      generateExpressions(dice.die1, dice.die2, dice.die3).map((e) => e.value)
    );
    for (const p of valids) {
      expect(exprValues.has(p.value)).toBe(true);
      expect(findCellByValue(state, p.value)?.owner).toBeNull();
    }
  });

  it('filters out occupied cells from expression hits', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = rollDice(createInitialState());
    const validsBefore = getValidPlacements(state);
    expect(validsBefore.length).toBeGreaterThan(0);
    const target = validsBefore[0].value;
    const cell = findCellByValue(state, target)!;
    cell.owner = 'player2';
    const validsAfter = getValidPlacements(state);
    expect(validsAfter.some((p) => p.value === target)).toBe(false);
    expect(validsAfter.length).toBe(validsBefore.length - 1);
  });

  it('returns empty when every expression target is occupied', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = rollDice(createInitialState());
    for (const p of getValidPlacements(state)) {
      findCellByValue(state, p.value)!.owner = 'player1';
    }
    expect(getValidPlacements(state)).toEqual([]);
  });
});
