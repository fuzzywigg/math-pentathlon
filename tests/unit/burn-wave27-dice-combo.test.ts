/**
 * Wave 27 — dice roller combo / lock / selection / product edges.
 * Deepens beyond dice.test.ts and wave 22 dice-ui selector.
 * Distinct from wave 26 success-playthroughs. Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  rollDice,
  rollMultiple,
  rerollDice,
  lockDice,
  unlockDice,
  toggleDiceSelection,
  selectDice,
  clearSelection,
  getSelectedValues,
  getSelectedTotal,
  isValidSelection,
  getAllPossibleSums,
  getAllPossibleProducts,
  getTwoDiceResults,
  getDiceConfig,
  type DiceType,
} from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n = (n + 1) % 10;
    return n / 10;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 27 dice — lock / reroll / selection', () => {
  it('lock prevents reroll of locked dice; unlock restores', () => {
    let result = rollMultiple('d6', 3);
    const lockedId = result.rolls[0].id;
    const lockedValue = result.rolls[0].value;
    result = lockDice(result, [lockedId]);
    expect(result.rolls.find((d) => d.id === lockedId)?.isLocked).toBe(true);

    result = rerollDice(
      result,
      result.rolls.map((d) => d.id)
    );
    expect(result.rolls.find((d) => d.id === lockedId)?.value).toBe(
      lockedValue
    );

    result = unlockDice(result, [lockedId]);
    expect(result.rolls.find((d) => d.id === lockedId)?.isLocked).toBe(false);
  });

  it('selectDice / toggle / clearSelection drive totals', () => {
    let result = rollMultiple('d6', 4);
    const ids = result.rolls.map((d) => d.id);
    result = selectDice(result, ids.slice(0, 2), true);
    expect(getSelectedValues(result)).toHaveLength(2);
    expect(getSelectedTotal(result)).toBe(
      getSelectedValues(result).reduce((a, b) => a + b, 0)
    );

    result = toggleDiceSelection(result, ids[2]);
    expect(getSelectedValues(result)).toHaveLength(3);
    result = toggleDiceSelection(result, ids[0]);
    expect(getSelectedValues(result)).toHaveLength(2);

    result = clearSelection(result);
    expect(getSelectedValues(result)).toEqual([]);
    expect(getSelectedTotal(result)).toBe(0);
  });

  it('isValidSelection enforces min/max selected counts', () => {
    let result = rollMultiple('d6', 3);
    const dice: DiceType[] = ['d6', 'd6', 'd6'];
    expect(
      isValidSelection(result, { dice, minSelectable: 1, maxSelectable: 2 })
    ).toBe(false);
    result = selectDice(result, [result.rolls[0].id], true);
    expect(
      isValidSelection(result, { dice, minSelectable: 1, maxSelectable: 2 })
    ).toBe(true);
    result = selectDice(
      result,
      result.rolls.map((d) => d.id),
      true
    );
    expect(
      isValidSelection(result, { dice, minSelectable: 1, maxSelectable: 2 })
    ).toBe(false);
  });
});

describe('Wave 27 dice — sums / products / two-dice map', () => {
  it('getAllPossibleSums covers non-empty subsets', () => {
    const sums = getAllPossibleSums([1, 2, 3]);
    expect(sums).not.toContain(0);
    expect(sums).toContain(6);
    expect(sums).toContain(3);
    expect(new Set(sums).size).toBe(sums.length);
  });

  it('getAllPossibleProducts covers non-empty subset products', () => {
    const products = getAllPossibleProducts([2, 3, 4]);
    expect(products).toContain(2);
    expect(products).toContain(24);
    expect(products).toContain(6);
    expect(products).toContain(8);
  });

  it('getTwoDiceResults enumerates ops and handles zeros', () => {
    const map = getTwoDiceResults(6, 3);
    expect(map.get('6 + 3')).toBe(9);
    expect(map.get('6 - 3')).toBe(3);
    expect(map.get('6 × 3')).toBe(18);
    expect(map.get('6 ÷ 3')).toBe(2);

    const withZero = getTwoDiceResults(5, 0);
    expect(withZero.get('5 × 0')).toBe(0);
    expect(withZero.has('5 ÷ 0')).toBe(false);
  });

  it('getDiceConfig exposes faces for known types; rollDice uses config', () => {
    expect(getDiceConfig('d6').faces).toBe(6);
    expect(getDiceConfig('d20').faces).toBe(20);
    const rolled = rollDice({ dice: ['d8', 'd8'] });
    expect(rolled.rolls).toHaveLength(2);
    expect(rolled.rolls.every((d) => d.value >= 1 && d.value <= 8)).toBe(true);
  });
});
