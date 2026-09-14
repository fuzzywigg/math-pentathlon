/**
 * Wave 42 — Prime Gold placeChip reject paths leftovers after #186. Tests-only.
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

describe('Wave 42 prime — placeChip reject', () => {
  it('rejects when phase is rolling or diceRoll is null', () => {
    const rolling = createInitialState();
    expect(placeChip(rolling, 1, '1')).toBe(rolling);
    const placingNoDice = { ...rolling, phase: 'placing' as const, diceRoll: null };
    expect(placeChip(placingNoDice, 1, '1')).toBe(placingNoDice);
  });

  it('rejects occupied cell even if value is expression-valid', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = rollDice(createInitialState());
    const first = getValidPlacements(state)[0];
    findCellByValue(state, first.value)!.owner = 'player2';
    expect(placeChip(state, first.value, first.expr)).toBe(state);
  });

  it('rejects wrong value not in current valid placements', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = rollDice(createInitialState());
    const valids = new Set(getValidPlacements(state).map((p) => p.value));
    let wrong = 1;
    for (let v = 1; v <= 49; v++) {
      if (!valids.has(v) && findCellByValue(state, v)?.owner === null) {
        wrong = v;
        break;
      }
    }
    expect(valids.has(wrong)).toBe(false);
    expect(placeChip(state, wrong, 'invalid')).toBe(state);
  });

  it('rejects missing board value', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = rollDice(createInitialState());
    expect(placeChip(state, 999, '999')).toBe(state);
  });
});
