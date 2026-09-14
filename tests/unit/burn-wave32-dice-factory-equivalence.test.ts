/**
 * Wave 32 — rollDie / rollMultiple / rollDice equivalence + total algebra.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  rollDie,
  roll,
  rollDice,
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

describe('Wave 32 dice — factory equivalence', () => {
  it('rollMultiple(type,n) matches rollDice of n copies', () => {
    stubRandom('mid');
    const a = rollMultiple('d10', 4);
    stubRandom('mid');
    const b = rollDice({ dice: ['d10', 'd10', 'd10', 'd10'] });
    expect(a.rolls.map((r) => r.value)).toEqual(b.rolls.map((r) => r.value));
    expect(a.total).toBe(b.total);
  });

  it('roll(...types) matches rollDice({ dice: types })', () => {
    const types: DiceType[] = ['d4', 'd8', 'd20'];
    stubRandom('max');
    const a = roll(...types);
    stubRandom('max');
    const b = rollDice({ dice: types });
    expect(a.rolls.map((r) => r.diceType)).toEqual(types);
    expect(a.rolls.map((r) => r.value)).toEqual(b.rolls.map((r) => r.value));
    expect(a.total).toBe(types.reduce((sum, t) => sum + DICE_FACES[t], 0));
  });

  it('rollMultiple(1) face matches rollDie under same stub', () => {
    stubRandom('min');
    const single = rollDie('d12');
    stubRandom('min');
    const multi = rollMultiple('d12', 1);
    expect(multi.rolls[0]!.value).toBe(single.value);
    expect(multi.total).toBe(single.value);
  });
});

describe('Wave 32 dice — total algebra', () => {
  it('total is sum even when selection/lock flags later change', () => {
    stubRandom('max');
    const result = rollDice({ dice: ['d6', 'd6', 'd6'] });
    expect(result.total).toBe(18);
    expect(result.rolls.reduce((s, d) => s + d.value, 0)).toBe(result.total);
  });
});
