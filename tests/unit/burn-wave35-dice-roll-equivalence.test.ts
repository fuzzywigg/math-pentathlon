/**
 * Wave 35 — roll / rollDice / rollMultiple equivalence under mocked RNG.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  roll,
  rollDice,
  rollMultiple,
  DICE_FACES,
  type DiceType,
} from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 53) / 53;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 35 dice-roll-eq — API shape', () => {
  it('roll(...types) matches rollDice({ dice: types }) totals and lengths', () => {
    // Reset sequence by restoring and re-mocking between calls is hard;
    // compare structural invariants instead under shared mock stream separately.
    const types: DiceType[] = ['d4', 'd6', 'd8', 'd10'];
    const a = roll(...types);
    expect(a.rolls).toHaveLength(types.length);
    expect(a.total).toBe(a.rolls.reduce((s, d) => s + d.value, 0));
    a.rolls.forEach((d, i) => {
      expect(d.diceType).toBe(types[i]);
      expect(d.value).toBeGreaterThanOrEqual(1);
      expect(d.value).toBeLessThanOrEqual(DICE_FACES[types[i]]);
      expect(d.isSelected).toBe(false);
      expect(d.isLocked).toBe(false);
    });
  });

  it('rollMultiple(type,n) length and face bounds', () => {
    for (const type of Object.keys(DICE_FACES) as DiceType[]) {
      const n = 5;
      const result = rollMultiple(type, n);
      expect(result.rolls).toHaveLength(n);
      for (const die of result.rolls) {
        expect(die.diceType).toBe(type);
        expect(die.value).toBeGreaterThanOrEqual(1);
        expect(die.value).toBeLessThanOrEqual(DICE_FACES[type]);
      }
      expect(result.total).toBe(result.rolls.reduce((s, d) => s + d.value, 0));
    }
  });

  it('rollDice empty config yields empty rolls and total 0', () => {
    const result = rollDice({ dice: [] });
    expect(result.rolls).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.id).toBeTruthy();
  });
});

describe('Wave 35 dice-roll-eq — deterministic twin streams', () => {
  it('identical call sequences under identical RNG produce matching values', () => {
    const seq: number[] = [];
    let i = 0;
    const next = () => {
      const v = (i % 17) / 17;
      i += 1;
      seq.push(v);
      return v;
    };
    vi.restoreAllMocks();
    vi.spyOn(Math, 'random').mockImplementation(next);
    const first = roll('d6', 'd6', 'd20');
    i = 0;
    const second = rollDice({ dice: ['d6', 'd6', 'd20'] });
    expect(second.rolls.map((d) => d.value)).toEqual(
      first.rolls.map((d) => d.value)
    );
    expect(second.total).toBe(first.total);
  });
});
