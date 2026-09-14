/**
 * Wave 32 — roll / rollDice / rollMultiple totals, ids, and composition.
 * Deepens existing roller entry points. Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  roll,
  rollDice,
  rollMultiple,
  rollDie,
  type DiceType,
} from '../../src/core/dice';

beforeEach(() => {
  // Distinct fractions keep Math.random().toString(36) ids unique.
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 997) / 997;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 32 dice-roll — totals match sum of faces', () => {
  it('roll(...types) total equals sum of die values', () => {
    const types: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
    const result = roll(...types);
    expect(result.rolls).toHaveLength(6);
    expect(result.total).toBe(result.rolls.reduce((s, d) => s + d.value, 0));
    expect(result.id).toBeTruthy();
    expect(new Set(result.rolls.map((d) => d.id)).size).toBe(6);
  });

  it('rollDice empty config yields zero total', () => {
    const empty = rollDice({ dice: [] });
    expect(empty.rolls).toEqual([]);
    expect(empty.total).toBe(0);
  });

  it('rollMultiple(n) length and type are uniform', () => {
    for (const count of [1, 2, 5, 8]) {
      const result = rollMultiple('d6', count);
      expect(result.rolls).toHaveLength(count);
      expect(result.rolls.every((d) => d.diceType === 'd6')).toBe(true);
      expect(result.total).toBe(result.rolls.reduce((s, d) => s + d.value, 0));
    }
  });
});

describe('Wave 32 dice-roll — id / timestamp uniqueness', () => {
  it('rollDie ids differ across sequential calls', () => {
    const ids = Array.from({ length: 20 }, () => rollDie('d8').id);
    expect(new Set(ids).size).toBe(20);
  });

  it('rollDice result id differs from each die id', () => {
    const result = rollDice({ dice: ['d6', 'd6', 'd6'] });
    expect(result.rolls.every((d) => d.id !== result.id)).toBe(true);
  });

  it('timestamps are numeric and non-decreasing under mocked clock', () => {
    const t0 = 1_700_000_000_000;
    vi.spyOn(Date, 'now').mockReturnValue(t0);
    const a = rollDie('d6');
    vi.spyOn(Date, 'now').mockReturnValue(t0 + 5);
    const b = rollDie('d6');
    expect(a.timestamp).toBe(t0);
    expect(b.timestamp).toBe(t0 + 5);
  });
});
