/**
 * Wave 44 — toggleDiceSelection + clearSelection leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  rollDice,
  toggleDiceSelection,
  clearSelection,
  getSelectedValues,
  getSelectedTotal,
} from '../../src/core/dice';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 dice — toggle/clear cycle', () => {
  it('double toggle restores unselected; clear empties', () => {
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      n += 1;
      return (n % 97) / 97;
    });
    let r = rollDice({ dice: ['d8', 'd8'] });
    const id = r.rolls[0].id;
    r = toggleDiceSelection(r, id);
    expect(getSelectedValues(r)).toEqual([r.rolls[0].value]);
    r = toggleDiceSelection(r, id);
    expect(getSelectedValues(r)).toEqual([]);
    r = toggleDiceSelection(r, id);
    r = toggleDiceSelection(r, r.rolls[1].id);
    expect(getSelectedTotal(r)).toBe(r.total);
    r = clearSelection(r);
    expect(getSelectedTotal(r)).toBe(0);
  });
});
