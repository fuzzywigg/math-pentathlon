/**
 * Wave 44 — isValidSelection undefined bounds leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { rollDice, selectDice, isValidSelection, clearSelection } from '../../src/core/dice';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 dice — valid selection undefined bounds', () => {
  it('no min/max → always valid regardless of count', () => {
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      n += 1;
      return (n % 97) / 97;
    });
    let r = rollDice({ dice: ['d6', 'd6', 'd6'] });
    expect(isValidSelection(r, { dice: ['d6', 'd6', 'd6'] })).toBe(true);
    r = selectDice(
      r,
      r.rolls.map((d) => d.id),
      true
    );
    expect(isValidSelection(r, { dice: ['d6', 'd6', 'd6'] })).toBe(true);
    r = clearSelection(r);
    expect(isValidSelection(r, { dice: ['d6', 'd6', 'd6'] })).toBe(true);
  });
});
