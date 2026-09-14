/**
 * Wave 38 — dice selection constraint leftovers after #171 / wave 32–34.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  rollMultiple,
  selectDice,
  clearSelection,
  toggleDiceSelection,
  getSelectedValues,
  getSelectedTotal,
  isValidSelection,
  type RollConfig,
} from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n = (n + 1) % 97;
    return n / 97;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 38 dice-select — min/max selectable bounds', () => {
  it('empty selection fails minSelectable>0; passes when unset/0', () => {
    const result = rollMultiple('d6', 4);
    const cfgMin2: RollConfig = {
      dice: ['d6', 'd6', 'd6', 'd6'],
      minSelectable: 2,
    };
    expect(isValidSelection(result, cfgMin2)).toBe(false);
    expect(
      isValidSelection(result, {
        dice: ['d6', 'd6', 'd6', 'd6'],
        minSelectable: 0,
      })
    ).toBe(true);
    expect(isValidSelection(result, { dice: ['d6', 'd6', 'd6', 'd6'] })).toBe(
      true
    );
  });

  it('selecting exactly maxSelectable is valid; one over is not', () => {
    let result = rollMultiple('d8', 5);
    const ids = result.rolls.map((d) => d.id);
    const cfg: RollConfig = {
      dice: ['d8', 'd8', 'd8', 'd8', 'd8'],
      maxSelectable: 2,
    };
    result = selectDice(result, ids.slice(0, 2), true);
    expect(isValidSelection(result, cfg)).toBe(true);
    result = selectDice(result, [ids[2]], true);
    expect(isValidSelection(result, cfg)).toBe(false);
  });

  it('toggle then clear restores empty selection totals', () => {
    let result = rollMultiple('d6', 3);
    const [a, b] = result.rolls.map((d) => d.id);
    result = toggleDiceSelection(result, a);
    result = toggleDiceSelection(result, b);
    expect(getSelectedValues(result)).toHaveLength(2);
    expect(getSelectedTotal(result)).toBe(
      result.rolls.filter((d) => d.isSelected).reduce((s, d) => s + d.value, 0)
    );
    result = clearSelection(result);
    expect(getSelectedValues(result)).toEqual([]);
    expect(getSelectedTotal(result)).toBe(0);
    expect(result.rolls.every((d) => !d.isSelected)).toBe(true);
  });

  it('selectDice(false) deselects only listed ids', () => {
    let result = rollMultiple('d6', 3);
    const ids = result.rolls.map((d) => d.id);
    result = selectDice(result, ids, true);
    result = selectDice(result, [ids[1]], false);
    expect(result.rolls.filter((d) => d.isSelected).map((d) => d.id)).toEqual([
      ids[0],
      ids[2],
    ]);
  });
});
