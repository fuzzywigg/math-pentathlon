/**
 * Wave 32 — rollDice / roll / rollMultiple factory edges.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  rollDice,
  roll,
  rollMultiple,
  DICE_FACES,
  type DiceType,
} from '../../src/core/dice';

function stubRandom(kind: 'min' | 'max' | 'mid' = 'min'): void {
  let i = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    i += 1;
    if (kind === 'min') return (i % 10_000) * 1e-7;
    if (kind === 'mid') return 0.5 + (i % 100) * 1e-9;
    return 0.999999 - (i % 10_000) * 1e-12;
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

function mockSequential(values: number[]): void {
  let i = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    const v = values[i % values.length]!;
    i += 1;
    // also used by generateId — keep face rolls deterministic by cycling
    return v;
  });
}

describe('Wave 32 dice — rollDice totals + types', () => {
  it('sums faces from controlled random for mixed types', () => {
    // First call per die is for value; subsequent randoms feed generateId.
    // Use 0 for every random → every die value = 1.
    stubRandom('min');
    const result = rollDice({ dice: ['d4', 'd6', 'd8'] });
    expect(result.rolls.map((r) => r.diceType)).toEqual(['d4', 'd6', 'd8']);
    expect(result.rolls.every((r) => r.value === 1)).toBe(true);
    expect(result.total).toBe(3);
    expect(result.id).toBeTruthy();
  });

  it('preserves empty dice array as empty result with total 0', () => {
    const result = rollDice({ dice: [] });
    expect(result.rolls).toEqual([]);
    expect(result.total).toBe(0);
  });
});

describe('Wave 32 dice — roll convenience', () => {
  it('matches rollDice for the same type list', () => {
    stubRandom('min');
    const a = roll('d6', 'd6', 'd20');
    stubRandom('min');
    const b = rollDice({ dice: ['d6', 'd6', 'd20'] });
    expect(a.rolls.map((r) => r.value)).toEqual(b.rolls.map((r) => r.value));
    expect(a.total).toBe(b.total);
  });

  it('rolls a single die when one type given', () => {
    stubRandom('max');
    const result = roll('d12');
    expect(result.rolls).toHaveLength(1);
    expect(result.rolls[0]!.value).toBe(DICE_FACES.d12);
    expect(result.total).toBe(DICE_FACES.d12);
  });
});

describe('Wave 32 dice — rollMultiple', () => {
  it('rolls N of one type with conserved total', () => {
    stubRandom('min');
    const result = rollMultiple('d8', 5);
    expect(result.rolls).toHaveLength(5);
    expect(result.rolls.every((r) => r.diceType === 'd8')).toBe(true);
    expect(result.total).toBe(5);
  });

  it('count 0 yields empty rolls', () => {
    const result = rollMultiple('d6', 0);
    expect(result.rolls).toEqual([]);
    expect(result.total).toBe(0);
  });

  it.each<[DiceType, number]>([
    ['d4', 2],
    ['d10', 3],
    ['d20', 1],
  ])('%s × %i stays in face range', (type, count) => {
    mockSequential([0.01, 0.3, 0.6, 0.9]);
    const result = rollMultiple(type, count);
    for (const die of result.rolls) {
      expect(die.value).toBeGreaterThanOrEqual(1);
      expect(die.value).toBeLessThanOrEqual(DICE_FACES[type]);
    }
  });
});
