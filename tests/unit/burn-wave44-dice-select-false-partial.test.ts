/**
 * Wave 44 — selectDice selected=false partial leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { rollDice, selectDice, getSelectedValues } from '../../src/core/dice';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 dice — selectDice false partial', () => {
  it('deselects only listed ids', () => {
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      n += 1;
      return (n % 97) / 97;
    });
    let r = rollDice({ dice: ['d6', 'd6', 'd6'] });
    const ids = r.rolls.map((d) => d.id);
    expect(new Set(ids).size).toBe(3);
    r = selectDice(r, ids, true);
    expect(getSelectedValues(r)).toHaveLength(3);
    r = selectDice(r, [ids[1]], false);
    expect(r.rolls.filter((d) => d.isSelected).map((d) => d.id)).toEqual([
      ids[0],
      ids[2],
    ]);
  });
});
