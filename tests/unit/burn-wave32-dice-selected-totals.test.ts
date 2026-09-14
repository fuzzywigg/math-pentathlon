/**
 * Wave 32 — getSelectedValues / getSelectedTotal conservation.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  rollDice,
  selectDice,
  getSelectedValues,
  getSelectedTotal,
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

describe('Wave 32 dice — selected values order', () => {
  it('preserves roll order for selected values', () => {
    // Force distinct faces via sequential random for value rolls only —
    // generateId also consumes random, so pin all to known pattern carefully.
    const sequence = [0.01, 0.2, 0.4, 0.6, 0.8, 0.1, 0.3, 0.5, 0.7];
    let i = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const v = sequence[i % sequence.length]!;
      i += 1;
      return v;
    });
    const result = rollDice({ dice: ['d6', 'd6', 'd6'] });
    const ids = result.rolls.map((r) => r.id);
    const selected = selectDice(result, [ids[0]!, ids[2]!], true);
    expect(getSelectedValues(selected)).toEqual([
      result.rolls[0]!.value,
      result.rolls[2]!.value,
    ]);
    expect(getSelectedTotal(selected)).toBe(
      result.rolls[0]!.value + result.rolls[2]!.value
    );
  });

  it('returns empty / 0 when none selected', () => {
    stubRandom('min');
    const result = rollDice({ dice: ['d6', 'd6'] });
    expect(getSelectedValues(result)).toEqual([]);
    expect(getSelectedTotal(result)).toBe(0);
  });

  it('full selection equals roll total', () => {
    stubRandom('max');
    const result = rollDice({ dice: ['d4', 'd6', 'd8'] });
    const selected = selectDice(
      result,
      result.rolls.map((r) => r.id),
      true
    );
    expect(getSelectedTotal(selected)).toBe(result.total);
    expect(getSelectedValues(selected)).toEqual(
      result.rolls.map((r) => r.value)
    );
  });
});
