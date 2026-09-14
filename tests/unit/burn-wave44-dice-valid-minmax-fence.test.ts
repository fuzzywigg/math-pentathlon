/**
 * Wave 44 — isValidSelection min/max fence leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { rollDice, selectDice, isValidSelection } from '../../src/core/dice';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 dice — min/max selection fence', () => {
  it('rejects under min and over max', () => {
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      n += 1;
      return (n % 97) / 97;
    });
    let r = rollDice({ dice: ['d6', 'd6', 'd6', 'd6'] });
    const dice = ['d6', 'd6', 'd6', 'd6'] as const;
    const bounds = { dice: [...dice], minSelectable: 2, maxSelectable: 3 };
    expect(isValidSelection(r, bounds)).toBe(false);
    r = selectDice(r, [r.rolls[0].id], true);
    expect(isValidSelection(r, bounds)).toBe(false);
    r = selectDice(r, [r.rolls[1].id], true);
    expect(isValidSelection(r, bounds)).toBe(true);
    r = selectDice(r, [r.rolls[2].id, r.rolls[3].id], true);
    expect(isValidSelection(r, bounds)).toBe(false);
  });
});
