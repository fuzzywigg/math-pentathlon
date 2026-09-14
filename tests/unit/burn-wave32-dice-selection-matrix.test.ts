/**
 * Wave 32 — selection / toggle / clear / isValidSelection constraint matrix.
 * Deepens existing select APIs beyond wave 27 smoke. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  rollMultiple,
  selectDice,
  toggleDiceSelection,
  clearSelection,
  getSelectedValues,
  getSelectedTotal,
  isValidSelection,
  type DiceType,
} from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 997) / 997;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 32 dice-selection — select / toggle / clear', () => {
  it('selectDice true then false restores empty selection', () => {
    let result = rollMultiple('d6', 4);
    const ids = result.rolls.map((d) => d.id);
    result = selectDice(result, ids, true);
    expect(getSelectedValues(result)).toHaveLength(4);
    expect(getSelectedTotal(result)).toBe(result.total);
    result = selectDice(result, ids, false);
    expect(getSelectedValues(result)).toEqual([]);
    expect(getSelectedTotal(result)).toBe(0);
  });

  it('toggle is idempotent over two clicks per die', () => {
    let result = rollMultiple('d6', 3);
    const id = result.rolls[0].id;
    result = toggleDiceSelection(result, id);
    expect(getSelectedValues(result)).toHaveLength(1);
    result = toggleDiceSelection(result, id);
    expect(getSelectedValues(result)).toEqual([]);
  });

  it('clearSelection leaves lock flags intact', () => {
    let result = rollMultiple('d6', 3);
    const ids = result.rolls.map((d) => d.id);
    result = {
      ...result,
      rolls: result.rolls.map((d, i) =>
        i === 0 ? { ...d, isLocked: true, isSelected: true } : { ...d, isSelected: true }
      ),
    };
    result = clearSelection(result);
    expect(result.rolls.every((d) => !d.isSelected)).toBe(true);
    expect(result.rolls[0].isLocked).toBe(true);
    expect(ids).toEqual(result.rolls.map((d) => d.id));
  });
});

describe('Wave 32 dice-selection — isValidSelection bounds', () => {
  const dice: DiceType[] = ['d6', 'd6', 'd6', 'd6'];

  it('no min/max always valid regardless of count', () => {
    let result = rollMultiple('d6', 4);
    expect(isValidSelection(result, { dice })).toBe(true);
    result = selectDice(result, result.rolls.map((d) => d.id), true);
    expect(isValidSelection(result, { dice })).toBe(true);
  });

  it('minSelectable alone rejects under-selection', () => {
    let result = rollMultiple('d6', 4);
    expect(isValidSelection(result, { dice, minSelectable: 2 })).toBe(false);
    result = selectDice(result, [result.rolls[0].id, result.rolls[1].id], true);
    expect(isValidSelection(result, { dice, minSelectable: 2 })).toBe(true);
  });

  it('maxSelectable alone rejects over-selection', () => {
    let result = rollMultiple('d6', 4);
    result = selectDice(result, result.rolls.map((d) => d.id), true);
    expect(isValidSelection(result, { dice, maxSelectable: 3 })).toBe(false);
    result = clearSelection(result);
    result = selectDice(result, [result.rolls[0].id], true);
    expect(isValidSelection(result, { dice, maxSelectable: 3 })).toBe(true);
  });

  it('exact min=max window', () => {
    let result = rollMultiple('d6', 4);
    const cfg = { dice, minSelectable: 2, maxSelectable: 2 };
    expect(isValidSelection(result, cfg)).toBe(false);
    result = selectDice(result, [result.rolls[0].id, result.rolls[1].id], true);
    expect(isValidSelection(result, cfg)).toBe(true);
    result = selectDice(result, [result.rolls[2].id], true);
    expect(isValidSelection(result, cfg)).toBe(false);
  });
});
