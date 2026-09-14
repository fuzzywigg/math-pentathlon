/**
 * Wave 32 — empty / zero-count / zero-face arithmetic edges.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  rollDice,
  rollMultiple,
  getAllPossibleSums,
  getAllPossibleProducts,
  getSelectedValues,
  getSelectedTotal,
  isValidSelection,
  clearSelection,
  type DiceType,
} from '../../src/core/dice';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 32 dice — empty edges', () => {
  it('empty rollDice result has vacuous selection validity', () => {
    const result = rollDice({ dice: [] });
    const dice: DiceType[] = [];
    expect(getSelectedValues(result)).toEqual([]);
    expect(getSelectedTotal(result)).toBe(0);
    expect(isValidSelection(result, { dice })).toBe(true);
    expect(isValidSelection(result, { dice, minSelectable: 1 })).toBe(false);
    expect(clearSelection(result).rolls).toEqual([]);
  });

  it('rollMultiple count 0 and empty sums/products agree', () => {
    const empty = rollMultiple('d20', 0);
    expect(empty.rolls).toEqual([]);
    expect(empty.total).toBe(0);
    expect(getAllPossibleSums([])).toEqual([]);
    expect(getAllPossibleProducts([])).toEqual([]);
  });

  it('single zero value products/sums only expose 0', () => {
    expect(getAllPossibleSums([0])).toEqual([0]);
    expect(getAllPossibleProducts([0])).toEqual([0]);
  });
});
