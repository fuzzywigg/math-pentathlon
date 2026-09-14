/**
 * Wave 32 — multi-die stress / total conservation.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  rollMultiple,
  rollDice,
  lockDice,
  rerollDice,
  selectDice,
  getSelectedTotal,
  getAllPossibleSums,
  getAllPossibleProducts,
  DICE_FACES,
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

describe('Wave 32 dice — stress conservation', () => {
  it('20×d6 total equals sum of faces', () => {
    stubRandom('mid');
    const result = rollMultiple('d6', 20);
    expect(result.rolls).toHaveLength(20);
    expect(result.total).toBe(
      result.rolls.reduce((sum, d) => sum + d.value, 0)
    );
    for (const die of result.rolls) {
      expect(die.value).toBeLessThanOrEqual(DICE_FACES.d6);
    }
  });

  it('lock-all then reroll-all preserves values and total', () => {
    stubRandom('min');
    let result = rollMultiple('d8', 8);
    const before = result.rolls.map((r) => r.value);
    result = lockDice(
      result,
      result.rolls.map((r) => r.id)
    );
    stubRandom('max');
    result = rerollDice(
      result,
      result.rolls.map((r) => r.id)
    );
    expect(result.rolls.map((r) => r.value)).toEqual(before);
    expect(result.total).toBe(before.reduce((a, b) => a + b, 0));
  });

  it('subset sum/product catalogs stay unique for 5 faces', () => {
    const values = [1, 2, 3, 4, 5];
    const sums = getAllPossibleSums(values);
    const products = getAllPossibleProducts(values);
    expect(new Set(sums).size).toBe(sums.length);
    expect(new Set(products).size).toBe(products.length);
    expect(sums).toContain(15);
    expect(products).toContain(120);
  });

  it('selecting every other die conserves partial total', () => {
    stubRandom('mid');
    const result = rollDice({
      dice: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'],
    });
    const ids = [...new Set(result.rolls.map((r) => r.id))];
    expect(ids).toHaveLength(result.rolls.length);
    const pick = result.rolls.filter((_, i) => i % 2 === 0).map((r) => r.id);
    const selected = selectDice(result, pick, true);
    const expected = result.rolls
      .filter((_, i) => i % 2 === 0)
      .reduce((sum, d) => sum + d.value, 0);
    expect(getSelectedTotal(selected)).toBe(expected);
  });
});
