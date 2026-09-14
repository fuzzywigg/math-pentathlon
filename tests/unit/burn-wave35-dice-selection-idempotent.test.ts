/**
 * Wave 35 — toggle/select/clear idempotency leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  rollMultiple,
  toggleDiceSelection,
  selectDice,
  clearSelection,
  getSelectedValues,
  getSelectedTotal,
} from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 41) / 41;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 35 dice-selection-idemp — toggle cycles', () => {
  it('toggle twice returns to original selection flags', () => {
    let result = rollMultiple('d6', 3);
    const id = result.rolls[0].id;
    const before = result.rolls.map((d) => d.isSelected);
    result = toggleDiceSelection(result, id);
    expect(result.rolls[0].isSelected).toBe(!before[0]);
    result = toggleDiceSelection(result, id);
    expect(result.rolls.map((d) => d.isSelected)).toEqual(before);
  });

  it('toggle unknown id leaves all flags unchanged', () => {
    let result = rollMultiple('d6', 2);
    const flags = result.rolls.map((d) => d.isSelected);
    result = toggleDiceSelection(result, 'missing');
    expect(result.rolls.map((d) => d.isSelected)).toEqual(flags);
  });
});

describe('Wave 35 dice-selection-idemp — select/clear', () => {
  it('select true twice then clear empties selection', () => {
    let result = rollMultiple('d8', 4);
    const ids = result.rolls.map((d) => d.id);
    result = selectDice(result, ids, true);
    result = selectDice(result, ids, true);
    expect(result.rolls.every((d) => d.isSelected)).toBe(true);
    expect(getSelectedValues(result)).toHaveLength(4);
    result = clearSelection(result);
    expect(result.rolls.every((d) => !d.isSelected)).toBe(true);
    expect(getSelectedValues(result)).toEqual([]);
    expect(getSelectedTotal(result)).toBe(0);
  });

  it('select false on partial selection clears only listed ids', () => {
    let result = rollMultiple('d6', 3);
    result = selectDice(result, result.rolls.map((d) => d.id), true);
    result = selectDice(result, [result.rolls[1].id], false);
    expect(result.rolls[0].isSelected).toBe(true);
    expect(result.rolls[1].isSelected).toBe(false);
    expect(result.rolls[2].isSelected).toBe(true);
  });
});
